/* =====================================================================
   KALIP LİSTESİ — "kök seçilmeden kalıba bakma" kipi
   ---------------------------------------------------------------------
   NE YAPAR
   Tabloda bir kalıp kutusuna KÖK SEÇİLİ DEĞİLKEN dokunulduğunda, o
   kalıptan sözlükte kayıtlı bütün kelimeleri bir perdede listeler.
   Kök seçiliyken hiçbir şeye karışmaz: eski davranış (kutu döngüsü,
   çekim penceresi) olduğu gibi çalışır.

   ÜÇ GÖRÜNÜM — hangisinin açılacağını kalıp numarası söyler
   1) TEKİL  (isim kalıpları: 17-51 ve tablo dışı numaralar)
      Tek kalıp, 4 sütunlu kart ızgarası.  Ör. 33 → حاكِم · كاتِب · عالِم…
   2) BÂB    (sülâsî mücerret fiiller: 1-16)
      O fiilin BÂBI açılır; mazi · muzari · emir olmak üzere 3 sütun.
      DİKKAT: 1., 2. ve 3. bâbın mazisi ORTAKTIR (hepsi #1, tabloda
      rowspan="3"). Bu yüzden üçlüler 3'er 3'er bölünemez:
          1.bâb [1,2,3] · 2.bâb [1,4,5] · 3.bâb [1,6,7]
          4.bâb [8,9,10] · 5.bâb [11,12,13] · 6.bâb [14,15,16]
      Ayrıca bir kök yalnız #1'e sahip diye 2. bâba yazılmamalı; bâb
      üyeliği MUZARİ ya da EMİR ile belirlenir (bkz. babUyesi).
   3) MEZİD  (52-105)
      Tablodaki SATIRIN tamamı: mazi · muzari · emir · mastar ·
      ism-i fâil · ism-i mef'ûl — en çok 6 sütun.
      İki istisna: Mufâ'ale'nin iki mastarı (67+68) tek sütunda
      birleşir; İf'ilâl'in ism-i mef'ûlü yoktur (5 sütun).

   VERİ
   sozlukVerileri (veri_sozluk.js, veri_kokler.js ile birleştirilmiş —
   bkz. veri_sozluk.js sonundaki Object.assign). Ters indeks (numara →
   kelimeler) sitede yoktu, burada bir kez kurulup önbelleğe alınıyor.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KalipListe) return;

    /* ---------- 1) SÜTUN DÜZENLERİ ---------- */

    /* Sülâsî mücerret bâbları: [mazi, muzari, emir].
       Kaynak: veri_kok_numaralari.js → BAB_KALIP ve tablodaki rowspan. */
    var BAB = [
        { ad: '1. Bâb', no: [1, 2, 3] },
        { ad: '2. Bâb', no: [1, 4, 5] },
        { ad: '3. Bâb', no: [1, 6, 7] },
        { ad: '4. Bâb', no: [8, 9, 10] },
        { ad: '5. Bâb', no: [11, 12, 13] },
        { ad: '6. Bâb', no: [14, 15, 16] }
    ];
    var BAB_BASLIK = ['Mazi', 'Muzari', 'Emir'];

    /* Mezid tablosunun satırları — HTML'deki sırayla (klasik I-X sırası
       değil, sayfadaki pedagojik sıra). İç dizi = tek sütunda duran
       iki kalıp (Mufâ'ale'nin iki mastarı). */
    var MEZID = [
        { ad: 'İf\'âl',    no: [52, 53, 54, 55, 56, 57] },
        { ad: 'Tef\'îl',   no: [58, 59, 60, 61, 62, 63] },
        { ad: 'Mufâ\'ale', no: [64, 65, 66, [67, 68], 69, 70] },
        { ad: 'İnfi\'âl',  no: [71, 72, 73, 74, 75, 76] },
        { ad: 'İfti\'âl',  no: [77, 78, 79, 80, 81, 82] },
        { ad: 'İf\'ilâl',  no: [83, 84, 85, 86, 87] },
        { ad: 'Tefe\'ul',  no: [88, 89, 90, 91, 92, 93] },
        { ad: 'Tefâ\'ul',  no: [94, 95, 96, 97, 98, 99] },
        { ad: 'İstif\'âl', no: [100, 101, 102, 103, 104, 105] }
    ];
    var MEZID_BASLIK = ['Mazi', 'Muzari', 'Emir', 'Mastar', 'İsm-i Fâil', 'İsm-i Mef\'ûl'];

    /* Tablo dışı/eksik numaralar için yedek vezin adları (KALIP_DATA
       yüklüyse oradan gelir; değilse başlık numarayla yetinir). */
    function kalipBilgi(no) {
        var d = (typeof KALIP_DATA !== 'undefined') ? KALIP_DATA[String(no)] : null;
        return { ar: (d && d.ar) || '', tr: (d && d.tr) || '' };
    }

    /* ---------- 2) TERS İNDEKS: numara → kelimeler ---------- */
    var _indeks = null;

    function havuz() {
        /* Çalışma anında sozlukVerileri, wordEasterEggs ile birleşiktir
           (veri_sozluk.js sonu). İkisi de yoksa boş dön. */
        if (typeof sozlukVerileri !== 'undefined') return sozlukVerileri;
        if (typeof wordEasterEggs !== 'undefined') return wordEasterEggs;
        return {};
    }
    function kokMu(kayit) {
        /* isDictOnly kayıtları kök değil, edat/tematik sözlük girdisi:
           sayısal kalıp anahtarları yok, listeye girmemeli. */
        return !!kayit && !kayit.isDictOnly;
    }
    function ornekDizi(o) {
        /* ornek alanı verinin bir yerinde NESNE, bir yerinde DİZİ.
           (2417 nesne · 310 dizi · 87 yok) — tek biçime indiriyoruz. */
        if (!o) return [];
        return Array.isArray(o) ? o : [o];
    }
    function govde(kok, no) {
        var k = havuz()[kok];
        var h = k && k[no];
        var b = h && h.base;
        if (!b || !b.arText) return null;
        return { kok: kok, no: no, ar: b.arText, tr: b.trText || '',
                 emoji: b.emoji || '', ornek: ornekDizi(b.ornek) };
    }
    function indeks() {
        if (_indeks) return _indeks;
        _indeks = {};
        var H = havuz();
        for (var kok in H) {
            if (!Object.prototype.hasOwnProperty.call(H, kok) || !kokMu(H[kok])) continue;
            for (var k in H[kok]) {
                if (!/^\d+$/.test(k)) continue;          /* "Gun", "21_cogul" gibi anahtarlar */
                var g = govde(kok, k);
                if (!g) continue;
                (_indeks[+k] = _indeks[+k] || []).push(g);
            }
        }
        return _indeks;
    }
    /* Ders verisi sonradan birleşirse indeks bayatlamasın */
    function indeksiTazele() { _indeks = null; }

    /* ---------- 3) KALIP → GÖRÜNÜM ---------- */

    function babBul(no) {
        for (var i = 0; i < BAB.length; i++)
            if (BAB[i].no.indexOf(no) >= 0 && no !== 1) return BAB[i];
        /* #1 üç bâbın ORTAK mazisi: hangisine ait olduğu belirsiz,
           bu yüzden ona basmak 1. bâbı açar (tablodaki ilk satır). */
        if (no === 1) return BAB[0];
        return null;
    }
    function mezidBul(no) {
        for (var i = 0; i < MEZID.length; i++) {
            var s = MEZID[i].no;
            for (var j = 0; j < s.length; j++) {
                var c = s[j];
                if (Array.isArray(c) ? c.indexOf(no) >= 0 : c === no) return MEZID[i];
            }
        }
        return null;
    }
    /* Bir kök bu bâbın üyesi mi? Ortak mazi (#1) tek başına yetmez —
       yoksa yalnız 1. bâbı olan kök 2. ve 3. bâbda da görünürdü. */
    function babUyesi(kok, grup) {
        return !!(govde(kok, grup[1]) || govde(kok, grup[2]));
    }

    function gorunum(no) {
        var bab = (no >= 1 && no <= 16) ? babBul(no) : null;
        if (bab) return { kip: 'bab', ad: bab.ad, sutun: bab.no, baslik: BAB_BASLIK };
        var mez = (no >= 52 && no <= 105) ? mezidBul(no) : null;
        if (mez) {
            /* İKİLİ SÜTUN (Mufâ'ale'nin iki mastarı 67/68) — VEZİN
               TABLOSUNUN DİLİ: ikisi birden AÇIK durmaz. İki kelime tek
               hücreye yığılınca sütun taşıyordu; artık biri açık, öbürü
               KATLI (yalnız numarası görünen dar kutu) duruyor.
                 · 64/65/66/69/70 → 67 açık, 68 katlı
                 · doğrudan 68'e basılırsa → 68 açık, 67 katlı
               Katlı numaraya dokunmak sütunu takas eder (tablodaki
               .bo-kapali kutusunda olduğu gibi), satırlar yerinde kalır.
               Doğrudan bir mastara basıldığında satırlar yine ona sahip
               olanlarla sınırlanır — 68'e basıp mastarı 67 olan
               kelimeleri listelemek yanıltıcı olurdu. */
            var ikiliSira = -1, cift = null;
            mez.no.forEach(function (c, i) { if (Array.isArray(c)) { ikiliSira = i; cift = c; } });
            var secili = !!(cift && cift.indexOf(no) >= 0);
            return { kip: 'mezid', ad: mez.ad + ' Bâbı', sutun: mez.no.slice(),
                     baslik: MEZID_BASLIK.slice(0, mez.no.length),
                     ikiliSira: ikiliSira, ikiliCift: cift,
                     ikiliAcik: cift ? (secili ? no : cift[0]) : null,
                     zorunlu: secili ? no : null };
        }
        return { kip: 'tekil', ad: '', sutun: [no], baslik: null };
    }

    /* Izgara/matris satırları: her satır BİR kök, her sütun bir kalıp */
    function satirlar(g) {
        var H = havuz(), c = [];
        var duz = [];
        g.sutun.forEach(function (s) { (Array.isArray(s) ? s : [s]).forEach(function (x) { duz.push(x); }); });
        for (var kok in H) {
            if (!Object.prototype.hasOwnProperty.call(H, kok) || !kokMu(H[kok])) continue;
            if (g.kip === 'bab' && !babUyesi(kok, g.sutun)) continue;
            /* Zorunlu kalıp (67/68 gibi): o kalıbı olmayan kök listeye girmez */
            if (g.zorunlu && !govde(kok, g.zorunlu)) continue;
            var hucre = g.sutun.map(function (s) {
                if (!Array.isArray(s)) return govde(kok, s) ? [govde(kok, s)] : [];
                return s.map(function (x) { return govde(kok, x); }).filter(Boolean);
            });
            var dolu = hucre.reduce(function (n, h) { return n + (h.length ? 1 : 0); }, 0);
            if (!dolu) continue;
            c.push({ kok: kok, hucre: hucre, dolu: dolu });
        }
        /* Sıralamayı ac() yapıyor: alfabe süzgeci hep açık olduğu için
           bütün görünümlerde tek ölçü var — kökün baş harfi. */
        return c;
    }

    /* ---------- 3b) TABLONUN KENDİ RENGİNİ ÖDÜNÇ AL ----------
       Tasarım bütünlüğü elle kopyalanan renklerle değil, TABLONUN
       KENDİSİNDEN okunarak sağlanıyor: kalıbın kutusunu sayfada bul,
       içinde durduğu hücrenin rengini al. Böylece Geylani tabloyu
       yeniden boyarsa perde de kendiliğinden uyar.
       Mücerret satırları renksizdir (şeffaf) — orada tablo da öyle. */
    function kutuBul(no) {
        var ler = document.querySelectorAll('.glass-box');
        for (var i = 0; i < ler.length; i++) {
            var r = ler[i].querySelector('.ref');
            var m = r ? String(r.innerText || r.textContent || '').trim()
                      : String(ler[i].getAttribute('data-ref') || '').trim();
            if (parseInt(m, 10) === no) return ler[i];
        }
        return null;
    }
    function rgbCoz(x) {
        var m = String(x || '').match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        var p2 = m[1].split(',').map(function (v) { return parseFloat(v); });
        if (p2.length > 3 && p2[3] === 0) return null;          /* saydam */
        return { r: p2[0], g: p2[1], b: p2[2] };
    }
    function koyult(c, k) {
        return 'rgb(' + [c.r, c.g, c.b].map(function (v) {
            return Math.max(0, Math.round(v * k)); }).join(',') + ')';
    }
    function satirTonu(no) {
        var k = kutuBul(no);
        var td = k && k.closest ? k.closest('td') : null;
        var c = td ? rgbCoz(getComputedStyle(td).backgroundColor) : null;
        if (!c) return null;
        /* Neredeyse beyazsa ton sayılmaz (mücerret hücreleri böyle) */
        if (c.r > 250 && c.g > 250 && c.b > 250) return null;
        return { ton: 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')', vurgu: koyult(c, 0.55) };
    }

    /* ---------- 3c) KÖK PLAKASI: iki kısayol ----------
       Matris görünümlerinde ilk sütun kökün kendisi. Kök yazısının
       ALTINA iki düğme koyuyoruz — liste artık bir çıkmaz sokak değil,
       köke giden kapı:

         ⏱ MARATON — o kökün fiil çekim tablosunu açar (mazi · muzari ·
           emir). Kökte birden çok fiil varsa (عَلِمَ · عَلَّمَ · تَعَلَّمَ)
           maratonun kendi fiil seçme lobisi çıkar, öğrenci hangisini
           çalışacağını seçer.
         ▦ TABLO — kökü listeden seçmiş gibi davranır: perde kapanır,
           sayfadaki mücerret/mezid tablosu o kökle dolar.

       İkisi de kökü selectReadyVerb ile seçer (sayfanın kök listesinin
       kullandığı yol); tek fark maratonun ardından openMarathon
       çağırması. Böylece kökün seçilme biçimi tek elden yürüyor,
       burada ayrı bir "kök seçme" kopyası tutmuyoruz. */

    var SVG_KRONO =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"' +
        ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="13" r="8"></circle><polyline points="12 9 12 13 14 15"></polyline>' +
        '<line x1="10" y1="2" x2="14" y2="2"></line><line x1="12" y1="2" x2="12" y2="5"></line>' +
        '<line x1="18" y1="6" x2="16.5" y2="7.5"></line></svg>';
    var SVG_TABLO =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"' +
        ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="3" y="3" width="18" height="18" rx="2"></rect>' +
        '<line x1="3" y1="9" x2="21" y2="9"></line>' +
        '<line x1="9" y1="21" x2="9" y2="9"></line></svg>';

    /* Kök seçme: sayfanın kendi yolu. selectReadyVerb tabloyu sıfırlar,
       kökü onaylar, kutuları boyar ve kahverengi kök taşını doğurur. */
    function kokSec(kok) {
        kapat();
        if (typeof selectReadyVerb === 'function') { selectReadyVerb(kok); return true; }
        if (typeof selectRootFromMainKeyboard === 'function') { selectRootFromMainKeyboard(kok); return true; }
        return false;
    }
    /* Fiili olmayan kökte maraton düğmesi sönük durur: openMarathon o
       durumda telaffuz ekranına düşüyor, öğrenci basmadığı yere gitmesin.
       (Sözlükteki 252 kökün 6'sı yalnız isim kalıplarından ibaret.) */
    function maratonVar(kok) {
        return (typeof hasVerbsToRead === 'function') ? !!hasVerbsToRead(kok) : true;
    }

    /* ---------- MARATON: GİT VE GERİ DÖN ----------
       ⏱ düğmesi kökü TABLOYA TAŞIMAZ. Önce selectReadyVerb çağrılıyordu;
       o tabloyu sıfırlayıp kökü yerleştirdiği için maratondan çıkınca
       öğrenci listeye değil, ▦ düğmesine basmış gibi kökün tablosuna
       düşüyordu. Artık:
         · perde yalnızca GİZLENİR (durumu — kalıp, süzgeç, seçim — durur),
         · maratonun ihtiyaç duyduğu iki değişken (currentRoot ve
           activeConfirmedRoot) geçici olarak bu köke ayarlanır,
         · maraton kapanınca ikisi de eski hâline döner ve perde en son
           bakılan kalıpla, aynı süzgeçle yeniden açılır.
       Kapanışı yakalamak için sayfanın closeMarathon'u bir kez sarılıyor;
       yalnız BİZ açtıysak (maratonDonus dolu) geri dönüş çalışır. */
    var maratonDonus = null;
    var kapatSarildi = false;

    function maratonKapanisiniYakala() {
        if (kapatSarildi || typeof window.closeMarathon !== 'function') return;
        kapatSarildi = true;
        var eski = window.closeMarathon;
        window.closeMarathon = function () {
            var d = maratonDonus; maratonDonus = null;
            var s = eski.apply(this, arguments);
            if (d) setTimeout(function () { maratondanDon(d); }, 60);
            return s;
        };
    }
    function maratondanDon(d) {
        /* Kök maratondan önceki hâline döner: perde "kök seçili değilken"
           çalışıyor, kök üstünde kalırsa kalıba dokunmak listeyi açmaz. */
        try { currentRoot = d.kokOnce; } catch (e) {}
        window.activeConfirmedRoot = d.onayOnce;
        if (!isFinite(d.no)) return;
        ac(d.no);
        suzgec = d.suzgec;                       /* aynı sekme, aynı seçim */
        suzgecCiz(); govdeCiz();
    }
    function maratonAc(kok) {
        maratonKapanisiniYakala();
        maratonDonus = {
            no: acikNo,
            suzgec: { tur: suzgec.tur, deger: suzgec.deger, acik: suzgec.acik },
            kokOnce: (typeof currentRoot !== 'undefined') ? currentRoot : '',
            onayOnce: window.activeConfirmedRoot || ''
        };
        kapat();                                  /* durumu bozmadan gizle */
        try { currentRoot = kok; } catch (e) {}
        window.activeConfirmedRoot = kok;
        /* Perdenin kapanış geçişi bitsin, maraton yarım kareye denk gelmesin */
        setTimeout(function () {
            if (typeof window.openMarathon === 'function') window.openMarathon();
        }, 60);
    }
    function kokDugmesi(sinif, svg, baslik) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'kl-kd ' + sinif;
        b.title = baslik;
        b.setAttribute('aria-label', baslik);
        b.innerHTML = svg;
        return b;
    }
    function kokPlaka(kok) {
        var p = document.createElement('div');
        p.className = 'kl-kok-plaka';

        var ad = document.createElement('span');
        ad.className = 'kl-kok-ad';
        ad.setAttribute('dir', 'rtl');
        ad.textContent = kok;
        p.appendChild(ad);

        var sira = document.createElement('span');
        sira.className = 'kl-kok-dugmeler';
        sira.setAttribute('dir', 'ltr');

        var m = kokDugmesi('kl-kd-maraton', SVG_KRONO, kok + ' — fiil çekim maratonu');
        if (!maratonVar(kok)) {
            m.classList.add('kl-kd-pasif');
            m.disabled = true;
            m.title = 'Bu kökte çekilecek fiil yok';
        } else {
            m.addEventListener('click', function (e) {
                e.preventDefault(); e.stopPropagation();
                maratonAc(kok);
            });
        }
        sira.appendChild(m);

        var t = kokDugmesi('kl-kd-tablo', SVG_TABLO, kok + ' — kökü tabloda aç');
        t.addEventListener('click', function (e) {
            e.preventDefault(); e.stopPropagation();
            kokSec(kok);
        });
        sira.appendChild(t);

        p.appendChild(sira);
        return p;
    }

    /* ---------- 3d) SÜZGEÇ: KÖK ARA ve AKSÂM-I SEB'A ----------
       Liste uzun (33'te 130+ kelime, İf'âl'de 64 kök); öğrenci aradığını
       bulabilsin diye iki süzgeç var ve İKİSİ AYNI ANDA DEĞİL, sıra
       birindedir:
         KÖK ARA (içeride 'alfabe') — açılışta seçili olan budur; küçük
                   arama klavyesini açar. Kelimeler her hâlükârda kökün
                   BAŞ HARFİNE göre dizilir; bir tuşa basılırsa yalnız
                   o harfle başlayan kökler kalır.
         AKSÂM-I SEB'A — kökün yapısına göre yedi kısım. Bir kısma
                   basılınca yalnız o kısmın örnekleri kalır, sıralama
                   yine alfabetiktir.
       Sınıflandırmayı BURADA YENİDEN YAZMIYORUZ: sayfanın kendi
       getAksamIseba'sı (kaliplartablosu.js) çağrılıyor — Geylani kuralı
       orada düzeltirse süzgeç de kendiliğinden uyar. */

    /* Hicâî sıra. Unicode zaten bu sırada ama hemzeli biçimler (أ إ آ ؤ ئ ء)
       elif'ten ÖNCE geliyor; sözlük geleneğinde olduğu gibi hepsini elif'e
       indiriyoruz — yoksa أخذ listenin başında tek başına kalırdı. */
    var ALFABE = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ',
                  'ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];
    var HARF_SIRA = (function () { var o = {}; ALFABE.forEach(function (h, i) { o[h] = i; }); return o; })();
    var HEMZE = { 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ء': 'ا', 'ؤ': 'ا', 'ئ': 'ا', 'ى': 'ي', 'ة': 'ه' };
    function sadeHarf(h) { return HEMZE[h] || h; }
    function basHarf(kok) { return sadeHarf(String(kok).charAt(0)); }
    function kokKarsilastir(a, b) {
        var x = String(a), y = String(b);
        var n = Math.max(x.length, y.length);
        for (var i = 0; i < n; i++) {
            var hx = HARF_SIRA[sadeHarf(x.charAt(i))], hy = HARF_SIRA[sadeHarf(y.charAt(i))];
            if (hx === undefined) hx = 99; if (hy === undefined) hy = 99;
            if (hx !== hy) return hx - hy;
        }
        return 0;
    }

    /* Anahtarlar getAksamIseba'nın döndürdükleriyle birebir; gösterilen
       ad ise sınıfta kullanılan yazımıyla (sahih-SÂLİM). */
    /* Kısa tanım ve örnek fiil, sayfanın KAVRAM ŞEMASI'ndan birebir
       alındı (kaliplartablosu.html → #aksam-sema-panel). Öğrenci orada
       ezberlediği cümleyi burada da aynı sözcüklerle görsün; iki ekran
       farklı şey öğretmesin. Gruplar da oradaki gibi: sahih üç, mu'tel dört. */
    var AKSAM = [
        { k: 'Sahih',  ad: 'Sâlim',  grup: 'sahih', kisa: 'İllet, hemze yok.',  ornek: 'كَتَبَ',
          ip: 'Kök harflerinin üçü de sahih: ne illet harfi ne hemze (كَتَبَ)' },
        { k: 'Mehmuz', ad: 'Mehmûz', grup: 'sahih', kisa: 'Hemze (ء) var.',     ornek: 'أَكَلَ',
          ip: 'Kök harflerinden biri hemze (أَكَلَ · سَأَلَ · قَرَأَ)' },
        { k: 'Muzaaf', ad: 'Muzâaf', grup: 'sahih', kisa: 'Şeddeli fiil.',      ornek: 'مَدَّ',
          ip: 'İkinci ve üçüncü harf aynı, şeddeli okunur (مَدَّ)' },
        { k: 'Misal',  ad: 'Misâl',  grup: 'mutel', kisa: 'İLK harf illetli.',  ornek: 'وَجَدَ',
          ip: 'İlk harfi illetli (وَعَدَ)' },
        { k: 'Ecvef',  ad: 'Ecvef',  grup: 'mutel', kisa: 'ORTA harf illetli.', ornek: 'قَالَ',
          ip: 'Ortadaki harfi illetli (قَالَ)' },
        { k: 'Nakıs',  ad: 'Nâkıs',  grup: 'mutel', kisa: 'SON harf illetli.',  ornek: 'رَمَى',
          ip: 'Son harfi illetli (رَمَى)' },
        { k: 'Lefif',  ad: 'Lefîf',  grup: 'mutel', kisa: 'İKİ illetli.',       ornek: 'نَوَى',
          ip: 'İki harfi birden illetli (نَوَى · وَقَى)' }
    ];
    /* Şemadaki yerleşim: SOLDA mu'tel (4), SAĞDA sahih (3). */
    var SEMA_SIRA = [{ g: 'mutel', ad: 'MU\'TEL' }, { g: 'sahih', ad: 'SAHİH' }];
    var _aksamBellek = {};
    function aksamlar(kok) {
        if (_aksamBellek[kok]) return _aksamBellek[kok];
        var d = (typeof getAksamIseba === 'function') ? getAksamIseba(kok) : ['Sahih'];
        if (!d || !d.length) d = ['Sahih'];
        return (_aksamBellek[kok] = d);
    }
    function aksamAdi(k) {
        for (var i = 0; i < AKSAM.length; i++) if (AKSAM[i].k === k) return AKSAM[i].ad;
        return k;
    }

    /* Açık perdenin hâli: hangi kalıp, hangi görünüm, süzülmemiş liste */
    var acikNo = null, acikGor = null, tumler = [];
    var suzgec = { tur: 'alfabe', deger: null, acik: false };

    function suz(ler) {
        if (!suzgec.deger) return ler.slice();
        if (suzgec.tur === 'alfabe')
            return ler.filter(function (x) { return basHarf(x.kok) === suzgec.deger; });
        return ler.filter(function (x) { return aksamlar(x.kok).indexOf(suzgec.deger) >= 0; });
    }
    function sayim(tur) {
        var m = {};
        tumler.forEach(function (x) {
            if (tur === 'alfabe') { var h = basHarf(x.kok); m[h] = (m[h] || 0) + 1; }
            else aksamlar(x.kok).forEach(function (a) { m[a] = (m[a] || 0) + 1; });
        });
        return m;
    }
    /* KLAVYE DİZİLİŞİ — sayfanın kendi arama klavyesiyle AYNI KAYNAK:
       universalKeyboardLayout (kaliplartablosu.js). Öğrenci kök ararken
       hangi tuşa basıyorsa harf süzgecinde de aynı yerde bulur; Geylani
       yerleşimi değiştirirse ikisi birden değişir. Sayfa yüklenmemişse
       diye birebir kopyası yedekte durur. */
    var KLAVYE = (typeof universalKeyboardLayout !== 'undefined' && universalKeyboardLayout.length)
        ? universalKeyboardLayout
        : [['ذ','ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج','د'],
           ['ش','س','ي','ب','ل','ا','ت','ن','م','ك','ط'],
           ['ئ','ء','ؤ','ر','ى','ة','و','ز','ظ','BACKSPACE']];

    function tus(sinif, ic, sayi, baslik) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'kl-tus ' + sinif;
        b.title = baslik;
        b.setAttribute('aria-label', baslik);
        b.innerHTML = '<span class="kl-tus-harf">' + ic + '</span>' +
                      (sayi === null ? '' : '<span class="kl-tus-sayi">' + sayi + '</span>');
        return b;
    }
    function klavyeCiz(say) {
        var kb = document.createElement('div');
        kb.className = 'kl-klavye';
        KLAVYE.forEach(function (satir) {
            var s = document.createElement('div');
            s.className = 'kl-kb-satir';
            satir.forEach(function (h) {
                /* Sil tuşunun yerine "Hepsi": süzgeci kaldıran tuşun
                   klavyede en beklenen yeri orası. */
                if (h === 'BACKSPACE') {
                    var t = tus('kl-tus-hepsi' + (suzgec.deger ? '' : ' kl-tus-secili'),   /* Hepsi = hiç süzgeç yok */
                                'Hepsi', tumler.length, 'Süzgeci kaldır');
                    t.addEventListener('click', function () { sec(null, 'alfabe'); });
                    s.appendChild(t);
                    return;
                }
                var n = say[h] || 0;
                var yazi = (h === 'ه') ? 'هـ' : h;          /* klavyedeki gösterimin aynısı */
                if (!n) {
                    /* Klavyenin şekli bozulmasın diye tuş yerinde durur ama
                       sönüktür. Hemzeli biçimler (ء ئ ؤ) ve ى · ة kök başında
                       hiç geçmez — onlar elif/ye tuşunda toplanıyor, ipucu
                       bunu söyler ki öğrenci "bozuk" sanmasın. */
                    var nere = HEMZE[h];
                    var t2 = tus('kl-tus-olu', yazi, null,
                        nere ? ('Bu harf ' + nere + ' tuşunda toplanıyor')
                             : ('Bu kalıpta ' + h + ' ile başlayan kök yok'));
                    t2.disabled = true;
                    s.appendChild(t2);
                    return;
                }
                var t3 = tus((suzgec.tur === 'alfabe' && suzgec.deger === h) ? 'kl-tus-secili' : '', yazi, n,
                             h + ' ile başlayan ' + n + ' kök');
                t3.addEventListener('click', function () { sec(h, 'alfabe'); });
                s.appendChild(t3);
            });
            kb.appendChild(s);
        });
        return kb;
    }

    /* AKSÂM SEKMESİ = KAVRAM ŞEMASININ KÜÇÜĞÜ
       Sayfanın kendi şeması (kalıplar tablosundaki "Kavram Şeması"
       düğmesi) iki dala ayrılır: solda MU'TEL dördü, sağda SAHİH üçü;
       her kart ad · tanım · örnek fiil taşır. Süzgeci de aynı şekle
       soktuk — öğrenci hangi ekranda olursa olsun aynı haritayı görür.
       Şemadaki kök başlığının yerinde "Hepsi" duruyor: süzgeci kaldırır. */
    function aksamKarti(a, n, ortala) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'kl-sema-kart kl-sk-' + a.grup +
                      (ortala ? ' kl-sk-orta' : '') +
                      ((suzgec.tur === 'aksam' && suzgec.deger === a.k) ? ' kl-sema-secili' : '') +
                      (n ? '' : ' kl-sema-bos');
        b.title = n ? a.ip : ('Bu kalıpta ' + a.ad.toLocaleLowerCase('tr') + ' kök yok');
        b.innerHTML =
            '<span class="kl-sk-sayi">' + n + '</span>' +
            '<span class="kl-sk-ad">' + a.ad + '</span>' +
            '<span class="kl-sk-tanim">' + a.kisa + '</span>' +
            '<span class="kl-sk-ornek" dir="rtl">' + a.ornek + '</span>';
        if (!n) b.disabled = true;
        else b.addEventListener('click', function () { sec(a.k, 'aksam'); });
        return b;
    }
    function aksamCiz(say) {
        var kap = document.createElement('div');
        kap.className = 'kl-sema';

        /* Şemanın üstünde artık "Hepsi" düğmesi yok: seçili karta ikinci
           kez basmak süzgeci zaten kaldırıyor. Yerinde ince bir başlık ve
           yanında şemayı büyüten düğme duruyor. */
        var bas = document.createElement('div');
        bas.className = 'kl-sema-tepe';
        bas.innerHTML = '<span>AKSÂM-I SEB\'A</span>' +
                        (typeof semaBuyutecBtn === 'function' ? semaBuyutecBtn() : '');
        kap.appendChild(bas);

        var dallar = document.createElement('div');
        dallar.className = 'kl-sema-dallar';
        SEMA_SIRA.forEach(function (g) {
            var sut = document.createElement('div');
            sut.className = 'kl-sema-sutun kl-sema-' + g.g;
            var bas = document.createElement('div');
            bas.className = 'kl-sema-baslik';
            bas.textContent = g.ad;
            sut.appendChild(bas);
            var iz = document.createElement('div');
            iz.className = 'kl-sema-izgara';
            var uyeler = AKSAM.filter(function (a) { return a.grup === g.g; });
            uyeler.forEach(function (a, i) {
                /* Tek sayıda kart varsa sonuncusu ortalanır (şemadaki
                   MUDAAF kartı gibi) — sütun tek başına asimetrik durmasın. */
                iz.appendChild(aksamKarti(a, say[a.k] || 0,
                    uyeler.length % 2 === 1 && i === uyeler.length - 1));
            });
            sut.appendChild(iz);
            dallar.appendChild(sut);
        });
        kap.appendChild(dallar);
        /* SOR şeridi: şemayı kendi kendini yoklama tahtasına çevirir.
           Markup ve mantık ana betikte (semaSorSerit / semaSor). */
        if (typeof semaSorSerit === 'function') {
            var sor = document.createElement('div');
            sor.innerHTML = semaSorSerit();
            kap.appendChild(sor.firstChild);
        }
        return kap;
    }

    function pul(sinif, etiket, sayi, secili, baslik) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'kl-pul ' + sinif + (secili ? ' kl-pul-secili' : '');
        if (baslik) b.title = baslik;
        b.innerHTML = '<span class="kl-pul-ad">' + etiket + '</span>' +
                      (sayi === null ? '' : '<span class="kl-pul-sayi">' + sayi + '</span>');
        return b;
    }
    function suzgecCiz() {
        var kap = document.getElementById('klSuzgec');
        if (!kap) return;
        /* Tek kelimelik listede süzgeç gürültüdür. Süzgeç yokken kalıp
           levhası üst sırada tek başına kalır, ortalanır. */
        var yalin = (tumler.length < 4);
        kap.style.display = yalin ? 'none' : '';
        var ust = document.getElementById('klUst');
        if (ust) ust.classList.toggle('kl-ust-yalin', yalin);
        kap.setAttribute('data-acik', suzgec.acik ? '1' : '0');
        var ok = document.getElementById('klKucult');
        if (ok) {
            var ipucu = suzgec.acik ? 'Süzgeci küçült' : 'Süzgeci aç';
            ok.title = ipucu;
            ok.setAttribute('aria-label', ipucu);
            ok.setAttribute('aria-expanded', suzgec.acik ? 'true' : 'false');
        }
        kap.querySelectorAll('.kl-sekme').forEach(function (s) {
            var bu = s.getAttribute('data-tur');
            /* Vurgu yalnız AÇIKKEN: kapalıyken iki başlık da eşit durur */
            /* Odakta iki panel de açık: iki başlık da açık görünür. */
            var acik = suzgec.acik && (odak || bu === suzgec.tur);
            s.classList.toggle('kl-sekme-acik', acik);
            s.setAttribute('aria-selected', acik);
            s.setAttribute('aria-expanded', acik);
            /* Süzgeç kapalıyken de "hangi süzgeç açık" görünsün: seçili
               harf/kısım başlığın yanında küçük bir rozette durur. */
            var r = s.querySelector('.kl-sekme-rozet');
            var etkin = !!suzgec.deger && bu === suzgec.tur;
            r.textContent = etkin ? (suzgec.tur === 'alfabe' ? suzgec.deger : aksamAdi(suzgec.deger)) : '';
            s.classList.toggle('kl-sekme-suzgecli', etkin);
        });
        var yuva = document.getElementById('klPullar');
        yuva.innerHTML = '';
        /* Kapalıyken içerik hiç çizilmez: bir önceki kalıbın klavyesi/şeması
           gizli de olsa DOM'da bayat sayılarla asılı kalmasın. */
        if (!suzgec.acik) return;
        yuva.setAttribute('dir', suzgec.tur === 'alfabe' ? 'rtl' : 'ltr');
        yuva.setAttribute('data-kip', suzgec.tur);
        var say = sayim(suzgec.tur);

        /* TABLO İÇİ ODAK: yatay yer bol, ikisi YAN YANA durur — sekme
           değiştirmeye gerek yok. Perdede yer dar olduğu için orada
           sekme düzeni sürüyor. */
        if (odak) {
            yuva.setAttribute('data-kip', 'ikisi');
            yuva.removeAttribute('dir');
            var b1 = document.createElement('div');
            b1.className = 'kl-pul-bolum kl-pul-alfabe';
            b1.setAttribute('dir', 'rtl');
            b1.appendChild(klavyeCiz(sayim('alfabe')));
            var b2 = document.createElement('div');
            b2.className = 'kl-pul-bolum kl-pul-aksam';
            b2.appendChild(aksamCiz(sayim('aksam')));
            yuva.appendChild(b1);
            yuva.appendChild(b2);
            return;
        }
        if (suzgec.tur === 'alfabe') {
            /* Harf süzgeci = küçültülmüş arama klavyesi. "Hepsi" tuşu
               klavyenin içinde (sil tuşunun yerinde) durduğu için ayrıca
               kutucuk koymuyoruz. */
            yuva.appendChild(klavyeCiz(say));
        } else {
            /* Yedi kısmın hepsi durur: "bu kalıpta lefîf yok" da bilgidir.
               Boş olanlar sönük ve tıklanmaz. */
            yuva.appendChild(aksamCiz(say));
        }
    }
    /* İki panel (klavye + şema) YAN YANA durduğunda hangi panelden
       seçildiği belli olmalı: süzgeç türü de tıklamayla birlikte geliyor.
       İki süzgeç aynı `deger` yuvasını paylaşıyor, biri seçilince öteki
       kendiliğinden kalkıyor — ikisi birden uygulanmıyor. */
    function sec(deger, tur) {
        if (tur && suzgec.tur !== tur) { suzgec.tur = tur; suzgec.deger = deger; }
        else suzgec.deger = (suzgec.deger === deger) ? null : deger;   /* aynısına basmak kaldırır */
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
        suzgecCiz(); govdeCiz();
    }
    function sekmeSec(tur) {
        /* Odakta iki panel birden duruyor; başlıklar sekme değil, aç/kapa.
           katlaCevir'e devretmiyoruz: o da kapalıyken sekmeSec'i çağırıp
           sonsuz döngü kuruyordu. */
        if (odak) {
            if (suzgec.acik) { kucult(); return; }
            suzgec.acik = true;
            if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
            seritYumusat(suzgecCiz);
            return;
        }
        /* Kapalıysa dokunulan başlıkla AÇILIR; açıkken başka başlığa
           dokunmak o süzgece geçirir (seçim sıfırlanır); AÇIK OLAN
           başlığa ikinci kez dokunmak katlar — başlığın kendisi de
           aç/kapa düğmesi, ok için elini uzatmaya gerek yok. */
        if (suzgec.acik && suzgec.tur === tur) { kucult(); return; }
        var degisti = false;
        if (!suzgec.acik) { suzgec.acik = true; degisti = true; }
        if (suzgec.tur !== tur) { suzgec.tur = tur; suzgec.deger = null; degisti = true; }
        if (!degisti) return;
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
        suzgecCiz(); govdeCiz();
    }
    /* Küçültme: seçili süzgeç KORUNUR (öğretmen listeye yer açmak için
       katlıyor, seçimini iptal etmek için değil) — hangi süzgecin açık
       olduğu başlığın yanındaki rozetten okunur. */
    function kucult() {
        if (!suzgec.acik) return;
        suzgec.acik = false;
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClose) SoundEngine.playClose();
        seritYumusat(suzgecCiz);
    }
    /* SÜZGEÇ AÇILIP KAPANIRKEN YUMUŞAK GEÇİŞ.
       Klavye ve şema display:none/flex ile tek karede beliriyordu; şerit
       birden 90px'ten 400px'e sıçrayınca göz yoruyordu. Şeridin
       yüksekliği eski hâlden yenisine süzülüyor, overflow:hidden olduğu
       için içerik de perde açılır gibi ortaya çıkıyor. Perdede eski
       davranış duruyor (orada şerit yok). */
    var SURE_SUZGEC = '.85s cubic-bezier(.33,1,.68,1)';
    function seritYumusat(ciz) {
        var sar = odak && odak.suzgecTr && odak.suzgecTr.querySelector('.ko-serit-sar');
        if (!sar) { ciz(); return; }
        var basla = sar.getBoundingClientRect().height;
        sar.style.transition = 'none';
        sar.style.height = '';
        ciz();
        var bitis = sar.getBoundingClientRect().height;
        if (Math.abs(basla - bitis) < 1) { sar.style.transition = ''; storOlc(); return; }
        sar.style.height = basla + 'px';
        void sar.offsetHeight;
        sar.style.transition = 'height ' + SURE_SUZGEC;
        sar.style.height = bitis + 'px';
        clearTimeout(seritYumusat._z);
        /* YAPIŞMA EŞİĞİ ŞERİTLE BİRLİKTE DEĞİŞMELİ.
           Şerit katlanınca/açılınca yüksekliği değişiyor ama sticky
           eşikleri (--ko-bar-yuk / --ko-serit-yuk / --ko-bas-kayma) eski
           ölçüyle kalıyordu: vezin levhası katlanmış şeridin bıraktığı
           boşluğa inemiyor, "tam yukarı çıkmıyordu". Ölçü, yumuşama
           boyunca her karede yenileniyor — levha şeritle birlikte
           süzülüyor, sonunda da bir kez daha sabitleniyor. */
        var bitisAn = Date.now() + 900;
        (function izle() {
            storOlc();
            if (Date.now() < bitisAn) requestAnimationFrame(izle);
        })();
        seritYumusat._z = setTimeout(function () {
            sar.style.transition = ''; sar.style.height = '';
            storOlc();
            takimPayOlc(true);      /* şerit oturdu: panel tavanı hemen tazelensin */
        }, 900);
    }
    /* Ok İKİ YÖNLÜ: açıkken yukarı bakar (katla), kapalıyken aşağı
       (aç). Kapalıyken en son kullanılan süzgeçle açılır — öğretmen
       hangi başlığa basacağını yeniden düşünmesin. */
    function katlaCevir() {
        if (suzgec.acik) kucult();
        else sekmeSec(suzgec.tur);
    }

    /* ---------- 4) PERDE ---------- */
    var perde = null;

    /* Süzgecin iskeleti TEK YERDE: hem perde hem tablo içi odak aynı
       şeyi kuruyor. İki ayrı kopya tutulsaydı biri değişince öbürü
       sessizce eskirdi. */
    var SUZGEC_HTML =
        /* Süzgeç KAPALI açılır: ilk görüntü kelimelerin kendisi olsun,
           iki başlık kenarda dursun. Başlığa dokunmak açar, yanındaki
           ok küçültür. */
        '<div class="kl-suzgec" id="klSuzgec" data-acik="0">' +
          '<div class="kl-sekmeler" role="tablist">' +
            '<button type="button" class="kl-sekme" data-tur="alfabe" role="tab">' +
              /* Başlık "Alfabe" değil "Kök Ara": açılan şey bir klavye,
                 öğrenci de harfe göre süzmüyor, kökü arıyor. */
              '<span>Kök Ara</span><b class="kl-sekme-rozet"></b></button>' +
            '<button type="button" class="kl-sekme" data-tur="aksam" role="tab">' +
              '<span>Aksâm-ı Seb\'a</span><b class="kl-sekme-rozet"></b></button>' +
            '<button type="button" class="kl-kucult" id="klKucult" title="Süzgeci küçült" ' +
              'aria-label="Süzgeci küçült">' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" ' +
              'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<path d="M6 15l6-6 6 6"></path></svg></button>' +
          '</div>' +
          '<div class="kl-pullar" id="klPullar"></div>' +
        '</div>';

    function suzgecBagla(kap) {
        kap.querySelectorAll('.kl-sekme').forEach(function (s) {
            s.addEventListener('click', function () { sekmeSec(s.getAttribute('data-tur')); });
        });
        var ok = kap.querySelector('.kl-kucult');
        if (ok) ok.addEventListener('click', katlaCevir);
    }

    function kur() {
        if (perde) return perde;
        perde = document.createElement('div');
        perde.id = 'kalip-liste-perde';
        perde.className = 'kl-perde';
        perde.setAttribute('role', 'dialog');
        perde.setAttribute('aria-modal', 'true');
        perde.innerHTML =
            '<div class="kl-pencere" role="document">' +
              '<button type="button" class="kl-kapat" aria-label="Kapat">&times;</button>' +
              /* ÜST SIRA: solda süzgeç, sağda kalıbın kendi levhası.
                 Perde ltr olduğu için DOM sırası ekrandaki sırayla aynı. */
              '<div class="kl-ust" id="klUst">' +
                SUZGEC_HTML +
                '<div class="kl-bas">' +
                  '<span class="kl-no" id="klNo"></span>' +
                  '<span class="kl-vezin" id="klVezin" dir="rtl"></span>' +
                  '<span class="kl-ad" id="klAd"></span>' +
                '</div>' +
              '</div>' +
              '<div class="kl-govde" id="klGovde"></div>' +
            '</div>';
        document.body.appendChild(perde);
        suzgecBagla(perde);
        perde.querySelector('.kl-kapat').addEventListener('click', kapat);
        /* Dışarı dokunmak kapatır; pencere içi dokunuş kapatmaz. */
        perde.addEventListener('click', function (e) { if (e.target === perde) kapat(); });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && perde.classList.contains('acik')) kapat();
        });
        return perde;
    }

    function kelimeKarti(g, ekSinif) {
        var d = document.createElement('div');
        d.className = 'kl-kart' + (ekSinif ? ' ' + ekSinif : '');
        d.setAttribute('data-kok', g.kok);
        var ornek = g.ornek.length
            ? '<div class="kl-ornek"><span dir="rtl">' + g.ornek[0].ar + '</span>' +
              '<i>' + (g.ornek[0].tr || '') + '</i></div>' : '';
        /* Sözlükte Türkçesi girilmemiş birkaç kayıt var (2805'te 20).
           Kelimeyi gizlemiyoruz — yerine sessiz bir çizgi koyuyoruz ki
           kart yarım görünmesin ve eksik göze çarpsın. */
        var trHtml = (g.tr && g.tr.trim())
            ? '<span class="kl-tr">' + g.tr + '</span>'
            : '<span class="kl-tr kl-tr-yok" title="Türkçesi girilmemiş">—</span>';
        /* ZÂİD HARFLER BURADA DA KIRMIZI. Kural yeniden yazılmıyor:
           kelime, KÖKÜNÜN harfleriyle sayfanın kendi ColorEngine'inden
           geçiyor — kök siyah, ziyade kırmızı (#E53935), tablodaki
           kutularla aynı dil. Renklendirilemezse düz kalır. */
        var arHtml = g.ar;
        try {
            if (typeof ColorEngine !== 'undefined' && ColorEngine.colorize)
                arHtml = ColorEngine.colorize(g.ar, g.kok.split(''));
        } catch (e) { arHtml = g.ar; }
        d.innerHTML =
            '<span class="kl-emoji" aria-hidden="true">' + (g.emoji || '') + '</span>' +
            '<span class="kl-ar" dir="rtl">' + arHtml + '</span>' + trHtml +
            '<span class="kl-kok" dir="rtl" title="kök">' + g.kok + '</span>' + ornek;
        /* İSİM KALIPLARININ LİSTESİ ÇIKMAZ SOKAK OLMASIN.
           Matris görünümlerinde kökün altında iki kısayol var; tekil
           ızgarada (mastar, ism-i fâil, ism-i mef'ûl, ism-i mekân,
           ism-i âlet, zaman-mekân, cem-i teksir, ism-i tasğîr, ism-i
           tafdil…) kök sütunu yok, dolayısıyla kısayol da yoktu.
           Her kartın SAĞ ÜST köşesine — kök rozetinin karşısına, onunla
           aynı sessiz gride — bir tablo simgesi koyuyoruz: dokununca
           perde kapanır ve o kök tabloda açılır. Maraton simgesi burada
           yok; bunlar isim kalıpları, çekilecek fiil ekranı değil. */
        var tb = document.createElement('button');
        tb.type = 'button';
        tb.className = 'kl-kart-tablo';
        tb.title = g.kok + ' — kökü tabloda aç';
        tb.setAttribute('aria-label', tb.title);
        tb.innerHTML = SVG_TABLO;
        tb.addEventListener('click', function (e) {
            e.preventDefault(); e.stopPropagation();
            kokSec(g.kok);
        });
        d.appendChild(tb);
        if (ornek) {
            /* Örnek gizli durur; karta dokunmak açar — liste kalabalıklaşmasın. */
            d.classList.add('kl-ornekli');
            d.addEventListener('click', function () {
                d.classList.toggle('kl-acik');
                if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
            });
        }
        return d;
    }

    /* KARTLAR PARTİ PARTİ KURULUR. 218 kartlık bir listeyi tek karede
       kurmak 205 ms'lik bir donma yapıyordu (ölçüldü) — uçuşun tam
       bittiği yere denk geliyor, göz takılmayı oradan yakalıyor.
       İlk parti anında basılır (ekran boş kalmasın), kalanı sonraki
       karelere yayılır. Yeni bir çizim başlarsa jeton değişir ve
       bekleyen partiler sessizce iptal olur. */
    var cizimJetonu = 0;
    function kartlariDok(hedef, ler, kademe, ilkParti, hazirla) {
        var i = 0, jeton = cizimJetonu, PARTI = 30;
        function bas(n) {
            var son = Math.min(ler.length, i + n);
            for (; i < son; i++) {
                var kart = kelimeKarti(ler[i]);
                if (kademe && i < kademe) {
                    kart.classList.add('ko-kart-belir');
                    /* Perde yalnız başına açılsın, kart şelalesi sonra */
                    kart.style.animationDelay = (KL_SELALE_BAS + i * 55) + 'ms';
                }
                if (hazirla) hazirla(kart, i);
                hedef.appendChild(kart);
            }
        }
        bas(ilkParti || PARTI);
        (function devam() {
            if (i >= ler.length || jeton !== cizimJetonu) return;
            requestAnimationFrame(function () {
                if (jeton !== cizimJetonu || !hedef.isConnected) return;
                bas(PARTI);
                devam();
            });
        })();
    }
    function tekilCiz(yuva, ler) {
        var g = document.createElement('div');
        g.className = 'kl-izgara';                      /* 4 sütun (CSS) */
        /* Tablo içi odakta ilk kartlar SIRAYLA belirir (matristeki
           kademeli girişin ızgara karşılığı) */
        var kademe = (odak && !odak.anisizCizim) ? 12 : 0;
        yuva.appendChild(g);
        kartlariDok(g, ler, kademe, 24);
        return ler.length;
    }

    /* TAKIM GÖVDESİ: her üyenin kelimeleri kendi panelinde. Üyeler
       SÜTUN SAYISI kadar BANTLARA bölünür: ilk bandın kutuları ÜST
       levhada kalır, örnekleri hemen altındadır; sonraki bantların
       kutuları örneklerin ORTASINA "ara levha" olarak iner, kendi
       örnekleri de onların altına gelir (Geylani: "yarısı üstte yarısı
       ortada, her vezinden sonra örnek kutusu"). Tafdil tek banttır.
       Süzgeç ortak havuza uygulanır; HER PANEL KENDİ İÇİNDE kayar. */
    function tekilTakimCiz(yuva, ler) {
        var tk = takimBul(acikNo);
        if (!tk) return tekilCiz(yuva, ler);
        var st = (odak && odak.muc) ? odak : null;
        var bosPanel = suzgec.deger ? 'Süzgece uyan kelime yok.' : 'Kayıtlı kelime yok.';
        var bantlar = [];
        for (var b = 0; b < tk.uyeler.length; b += tk.sutun)
            bantlar.push(tk.uyeler.slice(b, b + tk.sutun));
        bantlar.forEach(function (grup, gi) {
            /* ARA LEVHA ANCAK KUTULAR LEVHAYA GELDİKTEN SONRA KURULUR.
               Örnek listesi artık ARKA PLANDA, tablo hâlâ ekrandayken
               çiziliyor; bu çizimde kutuları taşımak alttaki 45-48'i
               tablodan koparıp gizli ara levhaya götürüyordu — kullanıcı
               tablo daha durup dururken alt sıranın boşaldığını görüyordu
               (Geylani: "cemi teksirden birine basınca alt satırdaki
               45-48 kayboluyor"). levhaHazir bayrağı: kutular levhaya
               taşındıktan sonra liste bir kez daha çiziliyor (levhaKur),
               taşıma o çizimde yapılıyor. */
            if (gi > 0 && st && st.levhaHazir) {
                /* ARA LEVHA: bandın GERÇEK kutuları buraya taşınır. İlk
                   çizimde üst levhadan süzülerek inerler (FLIP); süzgeç
                   tazelemesinde zaten kopukturlar, animasyonsuz otururlar. */
                var ara = document.createElement('div');
                ara.className = 'muc-ara-levha';
                ara.style.setProperty('--takim-sutun', tk.sutun);
                yuva.appendChild(ara);
                grup.forEach(function (no) {
                    var ki = st.levhaNolar ? st.levhaNolar.indexOf(no) : -1;
                    var k = (ki >= 0 && st.kutular) ? st.kutular[ki] : null;
                    if (!k) return;
                    var r0 = k.getBoundingClientRect();
                    ara.appendChild(k);
                    if (r0.width) kutuSuzul(k, r0, '.75s cubic-bezier(.22,1,.36,1)');
                });
            }
            var kap = document.createElement('div');
            kap.className = 'kl-takim kl-takim-' + tk.ad;
            kap.style.setProperty('--takim-sutun', tk.sutun);
            grup.forEach(function (no) {
                var panel = document.createElement('div');
                panel.className = 'kl-takim-panel' + (no === acikNo ? ' kl-takim-secili' : '');
                if (tk.panelBas) {
                    var bas = document.createElement('div');
                    bas.className = 'kl-panel-bas';
                    bas.setAttribute('dir', 'rtl');
                    var bi = kalipBilgi(no);
                    bas.innerHTML = '<span class="kl-panel-vezin">' + (bi.ar || '') +
                        '</span><b class="kl-panel-no">' + no + '</b>';
                    panel.appendChild(bas);
                    /* Harekeyle ayrışan ailelerde (17-32) vezin tek başına
                       yetmiyor: görevi de yazılır — Masdar / Sıfat-ı
                       Müşebbehe gibi. */
                    if (tk.panelTr && bi.tr) {
                        var alt = document.createElement('div');
                        alt.className = 'kl-panel-gorev';
                        alt.setAttribute('dir', 'ltr');
                        alt.textContent = bi.tr;
                        panel.appendChild(alt);
                    }
                }
                var gv = document.createElement('div');
                gv.className = 'kl-panel-govde';
                var kelimeler = ler.filter(function (x) { return +x.no === no; });
                if (!kelimeler.length) {
                    var bos = document.createElement('p');
                    bos.className = 'kl-bos';
                    bos.textContent = bosPanel;
                    gv.appendChild(bos);
                } else {
                    var g = document.createElement('div');
                    g.className = 'kl-izgara kl-izgara-takim';
                    gv.appendChild(g);
                    kartlariDok(g, kelimeler, odak ? 6 : 0, 12, function (kart) {
                        if (!tk.kisa) return;
                        /* KISA KART: Türkçesi gizli; örneksiz kartta da
                           dokunuş açsın (örnekli zaten kl-acik ile açılıyor) */
                        kart.classList.add('kl-kisa');
                        if (!kart.classList.contains('kl-ornekli')) {
                            kart.addEventListener('click', function () {
                                kart.classList.toggle('kl-acik');
                                if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
                            });
                        }
                    });
                }
                panel.appendChild(gv);
                kap.appendChild(panel);
            });
            yuva.appendChild(kap);
        });
        return ler.length;
    }

    /* Tıklanan numara hangi sütuna düşüyor? (67/68 gibi ikili sütunlar
       da kapsanır) — o sütun perdede vurgulanır ki bütün satır
       listelendiğinde hangi kalıba bastığın kaybolmasın. */
    function sutunSirasi(gor, no) {
        for (var i = 0; i < gor.sutun.length; i++) {
            var c = gor.sutun[i];
            if (Array.isArray(c) ? c.indexOf(no) >= 0 : c === no) return i;
        }
        return -1;
    }

    function matrisCiz(yuva, gor, secNo, sat) {
        var sec = sutunSirasi(gor, secNo);
        var t = document.createElement('table');
        /* Tablo içi odakta ÜSTTEKİ vezin satırı/levhası zaten başlıktır;
           matrisin kendi başlığı aynı şeyi İKİNCİ kez söylerdi. Bâb
           odağında da böyle: levhadaki üçlü (mazi · muzari · emir)
           başlığın kendisidir, sütunlar mucHizala ile altına hizalanır. */
        t.className = 'kl-tablo kl-s' + gor.sutun.length + (odak ? ' kl-tablo-bassiz' : '');
        var bas = '<thead><tr><th class="kl-kok-bas">Kök</th>';
        gor.sutun.forEach(function (s, i) {
            var ikili = (i === gor.ikiliSira && gor.ikiliAcik);
            var noLar = ikili ? [gor.ikiliAcik] : (Array.isArray(s) ? s : [s]);
            /* Tablodaki renk dili: mazi/muzari/emir YEŞİL (fiil), mastar
               ve türevleri MAVİ (isim) — .baslik-fiil / .baslik-isim
               sınıfları sayfanın kendi CSS'inden geliyor. */
            var tur = (i < 3) ? 'baslik-fiil' : 'baslik-isim';
            var ic = '<span class="kl-th-ad">' + (gor.baslik[i] || '') + '</span>' +
                     '<span class="kl-th-vezin" dir="rtl">' +
                     noLar.map(function (n) { return kalipBilgi(n).ar || ('#' + n); }).join(' / ') +
                     '</span><span class="kl-th-no">' + noLar.join(' · ') + '</span>';
            if (ikili) {
                /* KATLI KUTU: yalnız numarasını gösterir, dokunulunca açılır */
                var katli = gor.ikiliCift.filter(function (x) { return x !== gor.ikiliAcik; })[0];
                ic = '<span class="kl-th-ic"><span class="kl-th-ac">' + ic + '</span>' +
                     '<button type="button" class="kl-katli" data-no="' + katli +
                     '" title="' + katli + '. kalıbı aç" aria-label="' + katli +
                     '. kalıbı aç">' + katli + '</button></span>';
            }
            bas += '<th class="kl-th ' + tur + (i === sec ? ' kl-sec' : '') +
                   (ikili ? ' kl-th-ikili' : '') + '">' + ic + '</th>';
        });
        t.innerHTML = bas + '</tr></thead>';
        var katliDugme = t.querySelector('.kl-katli');
        if (katliDugme) katliDugme.addEventListener('click', function (e) {
            e.preventDefault(); e.stopPropagation();
            gor.ikiliAcik = parseInt(this.getAttribute('data-no'), 10);
            if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
            govdeCiz();
        });
        var g = document.createElement('tbody');
        /* Tablo içi odakta ilk satırlar SIRAYLA beliriyor: hepsi bir
           karede gelince liste "patlıyor", göz nereye bakacağını
           bilemiyordu. Yalnız ilk ekranda görünen kadarı gecikmeli —
           119 satırın hepsi sıralansa dakikalar sürerdi. */
        var kademe = (odak && !odak.anisizCizim) ? 12 : 0;
        sat.forEach(function (r) {
            var tr = document.createElement('tr');
            var td0 = document.createElement('td');
            td0.className = 'kl-kok-hucre';
            td0.setAttribute('dir', 'rtl');
            td0.appendChild(kokPlaka(r.kok));
            tr.appendChild(td0);
            r.hucre.forEach(function (h, i) {
                var td = document.createElement('td');
                if (i === sec) td.classList.add('kl-sec');
                /* İkili sütunda hücre de başlığı izler: yalnız AÇIK olan
                   mastarın kelimesi durur, katlı olanınki gizlenir. */
                if (i === gor.ikiliSira && gor.ikiliAcik) {
                    var tek = govde(r.kok, gor.ikiliAcik);
                    h = tek ? [tek] : [];
                }
                if (!h.length) { td.classList.add('kl-yok'); td.textContent = '—'; }
                else h.forEach(function (x) { td.appendChild(kelimeKarti(x, 'kl-mini')); });
                tr.appendChild(td);
            });
            if (kademe && g.children.length < kademe) {
                tr.classList.add('ko-satir-belir');
                /* Perdenin yüksekliği YALNIZ BAŞINA açılsın: satır şelalesi
                   ondan sonra başlar (KL_SELALE_BAS gecikmesiyle). */
                tr.style.animationDelay = (KL_SELALE_BAS + g.children.length * 55) + 'ms';
            }
            g.appendChild(tr);
        });
        t.appendChild(g);
        yuva.appendChild(t);
        return sat.length;
    }

    /* BAŞLIKTAKİ VEZİNDE ZÂİD HARFLER KIRMIZI.
       Kuralı burada yeniden yazmıyoruz: sayfanın kendi ColorEngine'i
       zaten kök harflerini siyah, ziyade (zâid) harfleri kırmızı
       boyuyor (#E53935) ve vezinde kök harfleri ف ع ل olduğu için
       kendiliğinden doğru sonucu veriyor — مَفْعُول'de م ve و kırmızı,
       ف ع ل siyah. Harfler ZWJ ile bağlandığından kelime kopmuyor.
       Sütun başlıklarına uygulanmadı: onlar yeşil/mavi pilin üstünde
       BEYAZ yazılıyor, siyah kök harfleri orada okunmaz. */
    function vezinBoya(el, ar) {
        if (!el) return;
        if (ar && typeof ColorEngine !== 'undefined' && ColorEngine.colorize) {
            el.innerHTML = ColorEngine.colorize(ar);
        } else {
            el.textContent = ar || '';
        }
    }

    /* Satırın/kartların rengi tablodan okunur (bkz. 3b). Gövde her
       süzgeç değişiminde yeniden çizildiği için ton yazımı da burada. */
    /* MÜCERREDDE YAPAY TON YOK (Geylani: "arkada çıkan renk olmasın,
       normalde hangi rengin arkasındaysa o çıksın"): kutunun EVİNDEKİ
       gerçek zemin taranır — atalarında saydam olmayan ilk renk. Bugün
       mücerredin her köşesi beyaz, dolayısıyla bant boyanmaz; bir gün
       bir bölge renklendirilirse ton kendiliğinden onu izler. */
    function rgbCoz(s) {
        var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(s || '');
        return m ? { r: +m[1], g: +m[2], b: +m[3] } : null;
    }
    function evZemin(kutu) {
        var el = kutu && kutu.parentElement, derin = 0;
        while (el && el.id !== 'tab1' && derin++ < 12) {
            var cs = getComputedStyle(el);
            /* Zemin bir DESEN ise (tbody'nin pastel gradyanı) renge
               indirgenemez — hiç boyamayız, desen odakta da akar. */
            if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
            var bg = cs.backgroundColor;
            if (bg && bg !== 'transparent' && !/rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(bg)) {
                /* Beyaz "renk" sayılmaz: bant boyanmaz */
                return /rgb\(\s*255,\s*255,\s*255\s*\)/.test(bg) ? null : bg;
            }
            el = el.parentElement;
        }
        return null;
    }
    function tonYaz() {
        var t;
        if (odak && odak.muc) {
            var zem = (odak.evTonlar && odak.evTonlar[acikNo]) || null;
            var rgbv = zem && rgbCoz(zem);
            t = rgbv ? { ton: zem, vurgu: koyult(rgbv, 0.55) } : null;
        } else {
            var no = (acikGor.kip === 'tekil')
                ? acikNo
                : (Array.isArray(acikGor.sutun[0]) ? acikGor.sutun[0][0] : acikGor.sutun[0]);
            t = satirTonu(no);
        }
        /* Ton AKTİF KABUĞA yazılır: perde ya da tablo içi odağın gövde
           satırı. İkisi de aynı değişkenleri okuyor. */
        var host = odak ? odak.govdeTr : perde;
        if (!host) return;
        host.style.setProperty('--kl-ton', t ? t.ton : 'transparent');
        host.style.setProperty('--kl-vurgu', t ? t.vurgu : '#9ca3af');
        host.setAttribute('data-tonlu', t ? '1' : '0');
    }
    function bosMetin() {
        if (!tumler.length)
            return acikGor.kip === 'tekil'
                ? 'Bu kalıptan sözlükte kayıtlı kelime yok.'
                : 'Bu bâbdan sözlükte kayıtlı kelime yok.';
        if (suzgec.tur === 'alfabe')
            return 'Bu kalıpta ' + suzgec.deger + ' harfiyle başlayan kök yok.';
        return 'Bu kalıpta ' + aksamAdi(suzgec.deger).toLocaleLowerCase('tr') + ' kök yok.';
    }
    function adYaz(n) {
        var bilgi = kalipBilgi(acikNo);
        var birim = (acikGor.kip === 'tekil') ? 'kelime' : 'kök';
        var tkAd = (acikGor.kip === 'tekil') ? takimBul(acikNo) : null;
        var ad = (acikGor.kip === 'tekil')
            ? ((tkAd && tkAd.baslik) || bilgi.tr || 'Kalıp')
            : acikGor.ad;
        /* Süzgeç açıkken "12 / 64" — bütünün neresindeyiz belli olsun */
        var sayi = suzgec.deger ? (n + ' / ' + tumler.length) : String(tumler.length);
        var el = document.getElementById('klAd');
        if (el) el.textContent = ad + (tumler.length ? ' · ' + sayi + ' ' + birim : '');
    }
    function govdeCiz() {
        var yuva = document.getElementById('klGovde');
        if (!yuva) return 0;
        cizimJetonu++;                 /* önceki çizimin bekleyen partileri iptal */
        yuva.innerHTML = '';
        tonYaz();
        var ler = suz(tumler);
        var n = 0;
        /* Takım odağında BOŞ süzgeç de panellerle çizilir: ara levhanın
           kutuları gövdenin İÇİNDE yaşadığından tek satırlık boş mesaj
           onları yutardı; her panel kendi "kelime yok"unu söyler. */
        var takimda = (acikGor.kip === 'tekil' && odak && odak.muc && takimBul(acikNo));
        if (takimda) n = tekilTakimCiz(yuva, ler);
        else if (!ler.length) yuva.innerHTML = '<p class="kl-bos">' + bosMetin() + '</p>';
        else n = (acikGor.kip === 'tekil')
            ? tekilCiz(yuva, ler)
            : matrisCiz(yuva, acikGor, acikNo, ler);
        yuva.scrollTop = 0;
        /* Tablo içi odakta örnek sütunları ÜSTTEKİ vezin satırıyla /
           levhayla hizalanır — ölçü her çizimde yeniden alınır. */
        if (odak) { if (odak.muc) { mucHizala(); mucLevhaBoya(); } else sutunlariHizala(); }
        adYaz(n);
        takimPayOlc();          /* panel sayısı/başlık boyu değişmiş olabilir */
        return n;
    }

    /* ---------- 4a) TAM EKRAN ----------
       Vezne basınca örnek listesiyle BİRLİKTE sayfa tam ekrana geçer —
       gizli bir tam ekran düğmesine basılmış gibi; liste kapanınca
       çıkar. İki koruma var:
         · Yalnız BİZİM açtığımız tam ekrandan çıkılır. Öğrenci zaten
           tam ekrandaysa listeyi kapatmak onu dışarı atmaz.
         · Çıkış bir tık GECİKMELİ: vezinden vezne geçerken (kapat-aç)
           ekran bir yanıp sönmesin — yeni liste açılırsa çıkış iptal.
       Tarayıcı izin vermezse (eski Safari, iframe, jestsiz programatik
       çağrı) sessizce vazgeçilir; hiçbir şey bozulmaz. */
    /* ---------- ANİMASYON SÜRELERİ — TEK YERDEN ----------
       Geylani: "animasyonlar daha yavaş ve pürüzsüz olsun".
       Açılış easeOutQuint (sonu yumuşak), kapanış easeInOutQuart
       (hem başı hem sonu yumuşak) — kapanışta artık ekran birden
       durmuyor. TAM EKRANDAN ÇIKIŞ da bu sürelerin SONUNDA yapılır:
       ekran ölçüsü animasyonun ortasında değişip hareketi kırmasın. */
    var KL_EGRI_AC = 'cubic-bezier(.22,1,.36,1)';
    var KL_EGRI_KAP = 'cubic-bezier(.45,0,.25,1)';
    var KL_AC_MS = 1500;      /* veznin hareketi: satır süzülüşü + şeridin açılışı */
    var KL_LISTE_MS = 1050;   /* örneklerin aşağı inişi           */
    var KL_KAP_SERIT = 700;   /* şeridin yukarı kapanışı          */
    var KL_KAP_LISTE = 850;   /* örneklerin kapanışı              */
    var KL_SATIR_GERI = 1300; /* satırın eski yerine dönüşü       */
    /* Tam ekran oturduktan sonra, açılış animasyonundan önceki nefes payı:
       tarayıcının tam ekran bildirimi geçsin, ekran tamamen dursun. */
    var KL_SERIT_MS = 450;    /* şeridin içinin belirişi (koBelir)  */
    var KL_SERIT_AC = 780;    /* süzgecin sekme altından inişi          */
    var KL_SELALE_BAS = 260;  /* perde açıldıktan sonra satır şelalesi */
    /* Tam ekran oturduktan SONRA istenen yarım saniyelik duruş. Bu
       aralıkta sayfa sönümlenir (görsel geri bildirim), sonunda vezin
       hareketi başlar. */
    var KL_CUBUK_MS = 500;
    /* Bütün listeler tamamen açılana kadar geçen süre: perdenin inişi +
       satır şelalesinin son satırı. Süzgeç şeridi ancak bundan sonra
       görünür (Geylani: "filtre kısmı tüm listeler açıldıktan sonra"). */
    var KL_LISTE_TAM = KL_LISTE_MS + KL_SELALE_BAS + 11 * 55 + 620;
    /* MÜCERRED daha ağır: tablo hep birlikte çekiliyor, göz onu
       izleyebilsin. */
    var KL_MUC_MS = 2100;
    /* MÜCERREDDE VEZİN ARTIK UÇMUYOR. Levha ve örnek listesi arka planda
       (görünmez) kurulur; tablo çekildikten sonra yavaş bir dönüşümle
       belirir — Geylani: "arkaplanda vezinle ilgili liste oluşsun sonra
       yavaş bi dönüşümle liste görünsün". */
    var KL_MUC_BELIR = 1400;  /* levhanın yavaş belirişi */
    var KL_MUC_ARA = 140;     /* iki vuruş arası nefes (hiç biri birlikte başlamaz) */
    /* TAM EKRAN GERÇEKTEN NE ZAMAN BİTER?
       Ne fullscreenchange olayı ne de pencere ölçüsünün durulması bunu
       söyler: macOS'ta ölçü tek hamlede son değerine atlar, ama ekranda
       görülen büyüme yaklaşık 0,7 sn süren bir sistem animasyonudur.
       Bu yüzden bekleme, olaydan itibaren EN AZ bu kadar sürer. */
    var KL_TAM_EKRAN_SISTEM = 700;
    var KL_TAM_EKRAN_PAY = 0;      /* sistem payına katıldı */
    function kln() {
        return (window.performance && performance.now) ? performance.now() : +new Date();
    }
    function klSn(ms) { return (ms / 1000) + 's'; }

    /* ---------- KAYDIRMA ÇUBUĞU DENETİMİ ----------
       Geylani: "animasyon sırasında scroll çubuğu aktif oluyor ve bu
       sayfanın titremesine neden oluyor."
       SEBEP: satırlar aşağı ÖTELENİRKEN (transform: translateY) tarayıcı
       ötelenmiş kutuları KAYDIRILABİLİR ALANA sayar. Ölçüldü: sayfa
       982 px iken bir anda 1590 px'e uzuyor, sağda kaydırma çubuğu
       beliriyor, kullanılabilir genişlik ~15 px daralıyor ve BÜTÜN
       sayfa yeniden yerleşiyor; animasyon bitince çubuk kaybolup aynı
       sarsıntı ters yönde tekrarlanıyor. Görülen titreme budur.
       ÇÖZÜM iki parçalı:
         1) YER (cubukYerAyir) — çubuğun yeri, TAM EKRANA GEÇİLİRKEN
            baştan ayrılır (`scrollbar-gutter: stable`). O sırada zaten
            bütün sayfa yeniden yerleşiyor; 15 px'lik daralma tam ekran
            geçişinin içinde eriyor, göze çarpmıyor. Bundan sonra örnek
            listesi ne kadar uzun olursa olsun çubuk HAZIR YUVASINA
            oturuyor: genişlik bir daha hiç değişmiyor.
         2) KİLİT (cubukKilitle) — tablo aşağı süzülürken kaydırma
            tamamen kapalı: sahte çubuk hiç doğmuyor. Ayrılmış yer kilit
            altında da duruyor (ölçüldü), yani kilit genişliği oynatmaz.
       Kapanışta ayrılan yer TAM EKRANDAN ÇIKARKEN bırakılır — yine
       ekranın tümden değiştiği an. Vezinden vezne geçişte tam ekrandan
       çıkılmadığı için yer olduğu gibi kalır, arada tek bir sıçrama bile
       olmaz.
       Süre verilirse denetim kendi kendini çözer: bir kanca atlansa bile
       sayfa kilitli kalmaz. */
    var cubukKilit = false, cubukYer = false, cubukPay = 0;
    var cubukZaman = null, cubukBit = 0;
    function cubukSaat(sure) {
        if (!sure) return;
        var bit = kln() + sure;
        if (bit > cubukBit) cubukBit = bit;
        clearTimeout(cubukZaman);
        cubukZaman = setTimeout(function () {
            cubukZaman = null; cubukBit = 0; cubukCoz();
        }, Math.max(0, cubukBit - kln()));
    }
    function cubukDur() { clearTimeout(cubukZaman); cubukZaman = null; cubukBit = 0; }
    /* Ölçü GÖVDENİN genişliğinden alınır: yer ayrılınca documentElement.
       clientWidth değişmiyor (oluk çubuk sayılmıyor), gövde ise gerçekten
       daralıyor — yerleşimi belirleyen de bu. */
    function cubukEn() { return Math.round(document.body.getBoundingClientRect().width); }
    function cubukKilitle(sure) {
        var h = document.documentElement;
        if (!cubukKilit) {
            var once = cubukEn();
            h.classList.add('ko-kaydirma-kilit');
            cubukKilit = true;
            /* Yer ayrılmışsa oluk kilit altında da duruyor → pay 0.
               Ayrılmamış ve ekranda gerçek bir çubuk varsa kilit onu
               kaldırır, sayfa 15 px genişler; o kadar sağ boşluk
               verilerek yerleşim aynı bırakılır. */
            var pay = cubukEn() - once;
            if (pay > 0) { h.style.paddingRight = pay + 'px'; cubukPay = pay; }
        }
        cubukDur(); cubukSaat(sure);
    }
    /* OLUK ARTIK AÇILMIYOR (Geylani: "mücerredde bir vezne basınca sağda
       ince bir sütun çıkıyor, gereksiz yere sayfayı daraltıyor").
       scrollbar-gutter: stable sağda 15 px'lik boş bir şerit ayırıyordu;
       bunun bedeli TAM EKRAN geçişinin içinde eriyordu. Tam ekran
       kaldırılınca şerit ortada kaldı: odak açıkken sayfa zaten taşmıyor
       (ölçüldü: scrollHeight <= clientHeight), yani ayrılacak bir çubuk
       bile yok — 1512 px'lik gövde boşuna 1497 px'e düşüyordu.

       Titremeyi önleyen asıl parça KİLİT'ti (cubukKilitle): tablo aşağı
       süzülürken kaydırma tamamen kapalı, sahte çubuk hiç doğmuyor. O
       yerinde duruyor. Bu işlevin çağrıldığı üç yerde beklenen davranış
       zaten "animasyon bitti, KİLİDİ BIRAK"tı; artık yalnız onu yapıyor.
       ko-cubuk-yer kuralı CSS'te duruyor: geri istenirse aşağıdaki iki
       satırı açmak yeter. */
    function cubukYerAyir(sure) {
        var h = document.documentElement;
        if (cubukYer) { h.classList.remove('ko-cubuk-yer'); cubukYer = false; }
        if (cubukKilit) {
            h.classList.remove('ko-kaydirma-kilit'); cubukKilit = false;
            if (cubukPay) { h.style.removeProperty('padding-right'); cubukPay = 0; }
        }
        cubukDur(); cubukSaat(sure);
    }
    function cubukCoz() {
        var h = document.documentElement;
        cubukDur();
        if (cubukKilit) { h.classList.remove('ko-kaydirma-kilit'); cubukKilit = false; }
        if (cubukYer) { h.classList.remove('ko-cubuk-yer'); cubukYer = false; }
        if (cubukPay) { h.style.removeProperty('padding-right'); cubukPay = 0; }
    }

    var tamEkranBiz = false, tamEkranZaman = null;

    /* ===================== TAM EKRAN KAPALI =====================
       Geylani: "tam ekran özelliğini tamamen iptal edelim, hiç tam ekran
       olmasın." Vezne dokununca tarayıcının tam ekranına geçilmiyor,
       çıkarken de tam ekrandan çıkma adımı yok.

       Kod SÖKÜLMEDİ, tek bir anahtara bağlandı: aşağıdaki bayrağı true
       yaparsan eski davranış (dokun → tam ekran → liste) aynen döner.

       Bayrak false iken zincir kendiliğinden doğru çalışıyor:
         · tamEkranAc() false döner  → ac() listeyi DOĞRUDAN açar
         · tamEkranBiz hiç true olmaz → tamEkranKapat() yalnız kaydırma
           çubuğu payını serbest bırakır (cubukCoz), başka iş yapmaz
         · tamEkranCikYalniz() false döner → geri tuşu birinci aşamayı
           atlayıp doğrudan bâb bilgisine / sayfaya gider
       Sayfa içi "tam ekran" görünümleri (atlas, çekim matrisi) bundan
       ETKİLENMEZ; onlar tarayıcı API'si değil, CSS sınıfıdır. */
    var TAM_EKRAN_ACIK = false;

    function tamEkranMi() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }
    function tamEkranAc() {
        if (!TAM_EKRAN_ACIK) return false;
        clearTimeout(tamEkranZaman);
        if (tamEkranMi()) return false;
        var el = document.documentElement;
        var f = el.requestFullscreen || el.webkitRequestFullscreen;
        if (!f) return false;
        try {
            var s = f.call(el, { navigationUI: 'hide' });
            if (s && s.then) s.then(function () { tamEkranBiz = true; }, function () { tamEkranBiz = false; });
            else tamEkranBiz = true;
            return true;                    /* istek yapıldı: geçişi beklemeye değer */
        } catch (e) { tamEkranBiz = false; return false; }
    }
    /* Tam ekrana geçiş sırasında ekran ölçüsü değişiyor; örnek kartlarının
       açılış animasyonu bu sırada başlarsa kekliyordu. İş, tam ekran
       yerleştikten SONRA (fullscreenchange + iki kare) başlatılır; olay
       hiç gelmezse 700 ms sonra yine de başlar. */
    function tamEkranBekle(is) {
        var bitti = false, degisti = false, tavan, ilkTavan;
        var sonEn = window.innerWidth, sonBoy = window.innerHeight, sabit = 0;
        var fsAn = 0;   /* tam ekranın açıldığı an */

        function bitir() {
            if (bitti) return; bitti = true;
            document.removeEventListener('fullscreenchange', olay);
            document.removeEventListener('webkitfullscreenchange', olay);
            clearTimeout(tavan); clearTimeout(ilkTavan);
            /* ÖLÇÜ DURULDU ≠ GEÇİŞ BİTTİ. macOS'ta pencere ölçüsü tam
               ekrana geçerken tek hamlede son değerine atlar, ama ekranda
               görülen kayma (ve tarayıcının "Çıkmak için Esc" bildirimi)
               yarım saniye daha sürer. Ölçü durduktan sonra bu kadar daha
               bekliyoruz ki vezin animasyonu bomboş, oturmuş bir ekranda
               başlasın. */
            /* Bekleme TAM EKRANIN AÇILDIĞI ANDAN sayılır. Ölçü erken
               dursa bile sistem animasyonu bitene kadar (KL_TAM_EKRAN_SISTEM)
               beklenir; üstüne istenen pay eklenir. Makinenin hızına göre
               kaymaz: geçen süre bu bütçeden düşülür. */
            var pay = 0;
            if (degisti) {
                var gecen = fsAn ? (kln() - fsAn) : 0;
                pay = Math.max(0, KL_TAM_EKRAN_SISTEM + KL_TAM_EKRAN_PAY - gecen);
            }
            requestAnimationFrame(function () {
                requestAnimationFrame(function () { setTimeout(is, pay); });
            });
        }
        function olay() { degisti = true; if (!fsAn) fsAn = kln(); }
        document.addEventListener('fullscreenchange', olay);
        document.addEventListener('webkitfullscreenchange', olay);

        /* NEDEN OLAYA DEĞİL ÖLÇÜYE BAKIYORUZ:
           fullscreenchange olayı tam ekran geçişinin SONUNDA değil
           BAŞINDA gelir. macOS'ta bu geçiş yaklaşık bir saniyelik bir
           sistem animasyonudur; olayı bekleyip hemen başlarsak kalıbın
           açılış animasyonu ekran hâlâ büyürken oynuyor ve kekliyor.
           Bunun yerine PENCERE ÖLÇÜSÜNÜN DURULMASINI bekliyoruz: ölçü
           üst üste 8 kare değişmediyse geçiş oturmuştur. */
        function bak() {
            if (bitti) return;
            var e = window.innerWidth, b = window.innerHeight;
            if (e !== sonEn || b !== sonBoy) { degisti = true; if (!fsAn) fsAn = kln(); sabit = 0; sonEn = e; sonBoy = b; }
            else sabit++;
            if (degisti && sabit >= 8) { bitir(); return; }
            requestAnimationFrame(bak);
        }
        requestAnimationFrame(bak);

        /* Tam ekran hiç açılmadıysa (tarayıcı reddetti, izin yok) ölçü
           de değişmez: 600 ms sonra beklemeden başla. */
        ilkTavan = setTimeout(function () { if (!degisti) bitir(); }, 600);
        /* Geçiş uzarsa yine de sonsuza kadar bekleme. */
        tavan = setTimeout(bitir, 2400);
    }
    /* "Şimdi tam ekrana geç, oturunca haber ver." Tam ekran zaten
       açıksa ya da tarayıcı reddederse iş beklemeden yapılır.
       MEZİDDE AÇILIŞIN ORTASINDA çağrılıyor: satır yukarı süzülüp
       yerine oturduktan sonra. Tıklamanın geçici yetkisi (Chrome'da
       ~5 sn) o ana kadar geçerli olduğundan istek kabul ediliyor. */
    function tamEkranaGec(sonra) {
        if (tamEkranMi()) { sonra(); return; }
        if (!tamEkranAc()) { sonra(); return; }
        tamEkranBekle(sonra);
    }
    function tamEkranKapat() {
        /* Ayrılan çubuk yeri TAM EKRANDAN ÇIKARKEN bırakılır: ekran
           zaten baştan aşağı değişiyor, 15 px'lik genişleme onun içinde
           kaybolur. (Vezinden vezne geçişte buraya hiç gelinmiyor —
           tamEkranAc bu çıkışı iptal ediyor — yer de korunuyor.) */
        cubukCoz();
        if (!tamEkranBiz) return;
        tamEkranBiz = false;
        if (!tamEkranMi()) return;
        var f = document.exitFullscreen || document.webkitExitFullscreen;
        if (!f) return;
        try { var s = f.call(document); if (s && s['catch']) s['catch'](function () { }); } catch (e) { }
    }
    function tamEkranKapatGecikmeli() {
        clearTimeout(tamEkranZaman);
        tamEkranZaman = setTimeout(function () {
            /* `kapanan`a BAKILMAZ: kapanış animasyonu ~1sn sürüyor, ona
               takılsak tam ekrandan hiç çıkmazdık. Vezinden vezne geçişi
               zaten tamEkranAc()'ın clearTimeout'u iptal ediyor. */
            if (odak) return;                             /* yeni liste açıldı */
            if (perde && perde.classList.contains('acik')) return;
            tamEkranKapat();
        }, 80);
    }
    function tamEkranIzle() { if (!tamEkranMi()) tamEkranBiz = false; }
    document.addEventListener('fullscreenchange', tamEkranIzle);
    document.addEventListener('webkitfullscreenchange', tamEkranIzle);
    /* Tam ekrana girip çıkarken pencere boyu değişir: açık listenin
       sütun hizaları ve stor ölçüleri tazelensin. */
    window.addEventListener('resize', function () {
        if (!odak) return;
        storOlc();
        if (odak.muc) mucHizala(); else { sutunTazele(); sutunlariHizala(); }
    });

    /* Tam ekran geçişi sürerken hangi veznin beklediği. */
    var bekleyenNo = null;
    function bekleyenVarMi() { return bekleyenNo !== null; }

    function ac(no) {
        no = parseInt(no, 10);
        if (!isFinite(no)) return false;

        /* MÜCERRED: kaydırma çubuğunun yeri daha ilk dokunuşta ayrılır.
           Tam ekrana geçiş sayfayı zaten baştan yerleştiriyor; oluk da o
           geçişin içinde açılıyor. Böylece ne tablo süzülürken ne de
           örnek listesi gelirken genişlik bir daha oynuyor. */
        if (no >= 1 && no <= 51 && tab1Kutu(no)) cubukYerAyir();

        /* ZATEN TAM EKRANDAYSA beklenecek bir şey yok. */
        if (tamEkranMi()) return acGovde(no);

        /* MEZİDDE SIRA TERS (Geylani: "infoya basar gibi önce satır
           yukarı güzelce süzülsün sonra tam ekran olsun"): satır normal
           pencerede, olduğu yerden yukarı süzülür; tam ekran isteği
           satır yerine oturunca odakAc'ın içinden yapılır. Mücerredde
           eski düzen sürüyor — orada önce tam ekran, sonra hareket. */
        if (no >= 52 && no <= 105 && tab2Kutu(no)) return acGovde(no);

        var istendi = tamEkranAc();        /* tıklamanın kendi jesti geçerliyken */
        if (!istendi) return acGovde(no);  /* tam ekran yok ya da reddedildi */

        /* İLK DOKUNUŞ YALNIZ TAM EKRANA GEÇİRİR.
           Vezin açılmaz, hiçbir animasyon başlamaz. Tam ekran oturup
           tarayıcının bildirimi geçtikten sonra, sanki vezne İKİNCİ KEZ
           dokunulmuş gibi liste açılır. Bekleme sırasında başka bir vezne
           dokunulursa hedef güncellenir, iki liste birden açılmaz. */
        bekleyenNo = no;
        tamEkranBekle(function () {
            var n = bekleyenNo;
            bekleyenNo = null;
            if (n !== null) acGovde(n);
        });
        return true;
    }
    function acGovde(no) {
        /* PERDE ARTIK YALNIZ YEDEK: mezid (52-105) tablonun içinde,
           mücerred (1-51) de tablonun içinde açılıyor. Perde ancak kutu
           sayfada bulunamazsa (tablo dışı numara) devreye girer. */
        if (no >= 52 && no <= 105 && tab2Kutu(no)) return odakAc(no);
        if (no >= 1 && no <= 51 && tab1Kutu(no)) return mucOdakAc(no);
        if (odak) odakKapat(true);
        var p = kur();
        acikNo = no;
        acikGor = gorunum(no);
        var bilgi = kalipBilgi(no);
        /* Her açılış alfabeyle başlar (Geylani'nin isteği) */
        suzgec = { tur: 'alfabe', deger: null, acik: false };
        tumler = (acikGor.kip === 'tekil') ? (indeks()[no] || []).slice() : satirlar(acikGor);
        tumler.sort(function (a, b) { return kokKarsilastir(a.kok, b.kok); });
        var noEl = document.getElementById('klNo');
        if (noEl) noEl.textContent = no;
        vezinBoya(document.getElementById('klVezin'), bilgi.ar);
        p.setAttribute('data-kip', acikGor.kip);
        suzgecCiz();
        govdeCiz();
        p.setAttribute('aria-label', 'Kalıp ' + no + (bilgi.tr ? ' — ' + bilgi.tr : ''));
        p.classList.add('acik');
        document.body.classList.add('kl-kilit');
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
        return true;
    }

    function kapat() {
        if (odak) { odakKapat(); return; }
        tamEkranKapatGecikmeli();
        /* Kapanış animasyonu sürerken ikinci kez kapatmak istenirse
           bekletme: doğrudan son hâle geç. */
        if (kapanan) { (kapanan.zaman || []).forEach(clearTimeout); odakSonlandir(kapanan, true); return; }
        if (!perde) return;
        perde.classList.remove('acik');
        document.body.classList.remove('kl-kilit');
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClose) SoundEngine.playClose();
    }

    /* ---------- 4b) TABLO İÇİ ODAK (SÜLÂSÎ MEZİD) ----------
       Mezidde perdeye gerek yok: satır zaten bâb bâb dizili, vezinler
       yan yana duruyor, tıklanan vezin kırmızıya dönüyor. Ayrı bir tam
       ekran dünya kurup tablonun rengini, tonunu, başlık pillerini
       taklit etmek yerine LİSTEYİ TABLONUN İÇİNDE açıyoruz — bâb
       odağında (sarf/babodak.js) olduğu gibi:
         · tıklanan veznin bâb satırı en üste süzülür, ötekiler gizlenir
         · SÜZGEÇ satırın ÜSTÜNDE, tam genişlikte bir şeritte durur
         · ÖRNEKLER satırın ALTINDA, aynı sütun hizasında
       Sütunlar canlı ölçülüp aktarılıyor: örnek matrisi üstteki vezin
       satırıyla birebir hizalanıyor, başlık tekrarına gerek kalmıyor.
       İki odak (bâb ⓘ / kalıp) aynı satırları taşıdığı için birbirini
       kapatır. */
    var odak = null;   /* { no, satir, suzgecTr, govdeTr, kutu, origNext } */

    function tab2Govde() {
        var t = document.querySelector('#tab2 table tbody');
        return t || null;
    }
    function tab2Kutu(no) {
        var ler = document.querySelectorAll('#tab2 .glass-box');
        for (var i = 0; i < ler.length; i++) {
            var r = ler[i].querySelector('.ref');
            if (r && parseInt(String(r.innerText || r.textContent).trim(), 10) === no) return ler[i];
        }
        return null;
    }
    function tab1Kutu(no) {
        var ler = document.querySelectorAll('#tab1 .glass-box');
        for (var i = 0; i < ler.length; i++) {
            var r = ler[i].querySelector('.ref');
            if (r && parseInt(String(r.innerText || r.textContent).trim(), 10) === no) return ler[i];
        }
        return null;
    }
    /* 67/68 katlı mastar: HANGİSİ AÇIK olduğunu tablonun kendisinden
       oku (babodak .bo-kapali ile katlıyor). Perdedeki katlı çip burada
       gereksiz — kutunun kendisi zaten satırda duruyor. */
    function tabloKatliOku() {
        var a68 = tab2Kutu(68);
        if (!a68) return null;
        return a68.classList.contains('bo-kapali') ? 67 : 68;
    }
    /* FLIP: satır eski yerinden yenisine süzülür. Dil babodak.js:535
       ile aynı — iki odak arasında hareket farkı olmasın. */

    /* ---------- AÇIK VEZNİN KÖŞESİNDEKİ ÇARPI ----------
       Kırmızı vurgulu kutu "açık olan" demek, ama nereden kapatılacağı
       ilk bakışta belli olmuyordu. Kutunun köşesine küçük bir çarpı
       konuyor; ona ya da veznin kendisine dokunmak kapatıyor. */
    function kapatXKur(kutu) {
        kapatXSil();
        if (!kutu) return;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ko-kapat-x';
        b.title = 'Bu vezni kapat';
        b.setAttribute('aria-label', 'Bu vezni kapat');
        b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                      'stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
        b.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            odakKapat();
        }, true);
        kutu.appendChild(b);
    }
    function kapatXSil() {
        var eski = document.querySelectorAll('.ko-kapat-x');
        Array.prototype.slice.call(eski).forEach(function (e) { e.remove(); });
    }

    function kaydirTr(row, eskiTop, bittiCb) {
        var cagrildi = false;
        function haber() { if (cagrildi) return; cagrildi = true; if (bittiCb) bittiCb(); }
        var delta = eskiTop - row.getBoundingClientRect().top;
        if (!delta) { haber(); return; }
        row.style.transition = 'none';
        row.style.transform = 'translateY(' + delta + 'px)';
        void row.offsetHeight;
        row.style.transition = 'transform ' + klSn(KL_SATIR_GERI) + ' ' + KL_EGRI_AC;
        row.style.transform = '';
        var yedek;
        var bitis = function () {
            row.style.transition = ''; row.style.transform = '';
            row.removeEventListener('transitionend', bitis);
            clearTimeout(yedek);
            haber();
        };
        row.addEventListener('transitionend', bitis);
        /* Geçiş olayı hiç gelmezse (satır gizlendi, kesildi) yine de haber ver */
        yedek = setTimeout(bitis, KL_SATIR_GERI + 220);
    }
    /* Örnek matrisinin sütunları ÜSTTEKİ satırdan ölçülür. Elle genişlik
       yazsaydık tablo yeniden düzenlendiğinde hizalama sessizce kayardı. */
    function sutunlariHizala() {
        /* govdeTr HENÜZ OLMAYABİLİR: mezidde tam ekran artık satır
           süzüldükten SONRA açılıyor, o sırada gelen resize örnek
           listesi kurulmadan buraya uğruyor. */
        if (!odak || !odak.satir || !odak.govdeTr) return;
        var t = odak.govdeTr.querySelector('.kl-tablo');
        if (!t) return;
        var hucre = Array.prototype.slice.call(odak.satir.children);
        if (hucre.length < 2) return;
        var eski = t.querySelector('colgroup');
        if (eski) eski.remove();
        var cg = document.createElement('colgroup');
        var en = hucre.map(function (td) { return td.getBoundingClientRect().width; });
        /* DİKEY ÇUBUK YATAY KAYDIRMA DOĞURMASIN. Sütun toplamı üstteki
           satırın tam genişliği; kabın iç genişliği kaydırma çubuğu
           kadar dar kalınca matris taşıp yatay çubuk çıkarıyordu.
           Farkı ÇUBUĞUN BULUNDUĞU UÇTAKİ sütundan düşüyoruz (kap RTL,
           çubuk solda → son sütun); böylece öteki altı sütunun hizası
           kılı kılına yerinde kalıyor. */
        var kap = odak.govdeTr.querySelector('.ko-kaydir');
        if (kap) {
            var toplam = en.reduce(function (a, b) { return a + b; }, 0);
            var fazla = toplam - kap.clientWidth;
            if (fazla > 0.5) en[en.length - 1] = Math.max(24, en[en.length - 1] - fazla);
        }
        en.forEach(function (w) {
            var c = document.createElement('col');
            c.style.width = w + 'px';
            cg.appendChild(c);
        });
        t.insertBefore(cg, t.firstChild);
    }
    /* SÜTUN İZLERİ PENCEREYLE BİRLİKTE YENİLENİR.
       `ko-sutun` colgroup'u piksel yazıyor; ölçü satır süzülmeden ÖNCE,
       normal pencerede alınıyor. Mezidde tam ekran ARTIK SONRA açıldığı
       için (bkz. ac()) pencere o sırada büyüyor: pikseller eski kalırsa
       bâb satırı tablonun tamamına yayılmıyor. Oranları saklayıp yeni
       genişliğe göre yeniden yazıyoruz. */
    function sutunTazele() {
        if (!odak || odak.muc || !odak.satir || !odak.sutunOran) return;
        var tablo = odak.satir.closest('table');
        var cg = tablo && tablo.querySelector('colgroup.ko-sutun');
        if (!cg) return;
        var en = tablo.clientWidth;
        if (!en) return;
        Array.prototype.slice.call(cg.children).forEach(function (c, i) {
            if (odak.sutunOran[i]) c.style.width = Math.round(odak.sutunOran[i] * en) + 'px';
        });
    }
    function babOdagiKapat() {
        try { if (window.BabOdak && window.BabOdak.aktif()) window.BabOdak.kapat(); } catch (e) {}
    }

    /* Odağın veri hâli: hangi kalıp, hangi satır, hangi kökler.
       Hem ilk açılışta hem satır içi vezin değişiminde aynı yol. */
    function odakVeriKur(no) {
        acikNo = no;
        acikGor = gorunum(no);
        var katli = tabloKatliOku();
        if (katli && acikGor.ikiliSira >= 0) acikGor.ikiliAcik = katli;
        suzgec = { tur: 'alfabe', deger: null, acik: false };
        /* Mücerredin isim kalıpları (17-51) TEKİL görünüm: kelime kartı
           ızgarası. Bâb (1-16) ve mezid görünümleri kök matrisi.
           TAKIMLARDA (tafdil 50+51 · teksir 41-48) havuz ortak: üyelerin
           kelimeleri birlikte tutulur, gövde panellere ayırarak çizer. */
        var vTakim = takimBul(no);
        tumler = (acikGor.kip === 'tekil')
            ? (vTakim
                ? vTakim.uyeler.reduce(function (a, u) { return a.concat(indeks()[u] || []); }, [])
                : (indeks()[no] || []).slice())
            : satirlar(acikGor);
        tumler.sort(function (a, b) { return kokKarsilastir(a.kok, b.kok); });
    }
    /* Tabloda 67/68 takas edilirse örnek sütunu da onu izlesin. */
    function katliTazele() {
        if (!odak || !acikGor || acikGor.ikiliSira < 0) return;
        var katli = tabloKatliOku();
        if (!katli || katli === acikGor.ikiliAcik) return;
        acikGor.ikiliAcik = katli;
        govdeCiz();
    }

    function odakAc(no) {
        var kutu = tab2Kutu(no);
        var satir = kutu ? kutu.closest('tr') : null;
        var govde2 = tab2Govde();
        if (!kutu || !satir || !govde2) return false;
        babOdagiKapat();                       /* iki odak birlikte duramaz */
        /* Kapanış animasyonu sürüyorsa hemen tamamla: yarısında yeni bir
           odak açılırsa iki animasyon aynı satırlar üstünde çakışıyor. */
        if (kapanan) { (kapanan.zaman || []).forEach(clearTimeout); odakSonlandir(kapanan, true); }
        /* AYNI SATIRDA başka bir vezne geçiş: satırı yerinden oynatma,
           yalnız vurguyu ve listeyi tazele — ekran boşuna zıplamasın. */
        if (odak && odak.satir === satir) {
            if (odak.kutu) odak.kutu.classList.remove('ko-sec');
            odak.no = no; odak.kutu = kutu;
            kutu.classList.add('ko-sec');
            kapatXKur(kutu);
            odakVeriKur(no);
            faz2();                           /* animasyon yarım kaldıysa tamamla */
            suzgecCiz(); govdeCiz();
            if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
            return true;
        }
        if (odak) odakKapat(true);
        storSifirla();                        /* stor perde temiz başlasın */

        odakVeriKur(no);

        var sutunSayi = satir.children.length;
        var eskiTop = satir.getBoundingClientRect().top;
        /* ŞERİT RENGİNİ TAŞIMADAN ÖNCE YAKALA. Satır rengi nth-child'dan
           geliyor; satırı en üste taşıyınca bütün bâblar ilk şeridin
           rengine dönüyordu (ölçüldü: İfti'âl yeşili 224,242,239 iken
           taşındıktan sonra 251,245,238 okunuyordu) — hem satırın kendisi
           hem de listenin tonu yanlış çıkıyordu. babodak.js:567 ile aynı
           çözüm: rengi yakala, taşıdıktan sonra sabitle. */
        var tdRenk = Array.prototype.slice.call(satir.children)
            .map(function (td) { return getComputedStyle(td).backgroundColor; });

        /* SÜTUN GENİŞLİKLERİNİ ÖNCEDEN SABİTLE.
           Tablo `table-layout: fixed`; bu düzende sütun ölçüleri TABLONUN
           İLK SATIRINDAN okunuyor. Süzgeç şeridini thead'in ilk satırı
           yaptığımız için ölçü artık tek bir colspan=7 hücreden alınıyor
           ve bütün sütunlar eşitleniyordu (ölçüldü: 266·187·187·187·219·
           187·187 → hepsi 203). En çok Mufâ'ale'de göze batıyordu: bâb
           adı 266'dan 203'e inince "Müfa'ale" ve ⓘ hücreden taşıyordu.
           colgroup sabit düzende ilk satırdan ÖNCE gelir — ölçüyü artık
           oradan veriyoruz. */
        var tablo = govde2.parentElement;
        var basSatir = Array.prototype.slice.call(tablo.querySelectorAll('thead tr'))
            .filter(function (tr) { return !tr.classList.contains('ko-satir'); })[0];
        var olcuSatir = basSatir || satir;
        var sutunEn = Array.prototype.slice.call(olcuSatir.children)
            .map(function (h) { return h.getBoundingClientRect().width; });
        var eskiCg = tablo.querySelector('colgroup.ko-sutun');
        if (eskiCg) eskiCg.remove();
        var cg = document.createElement('colgroup');
        cg.className = 'ko-sutun';
        sutunEn.forEach(function (w) {
            var c = document.createElement('col');
            c.style.width = w + 'px';
            cg.appendChild(c);
        });
        tablo.insertBefore(cg, tablo.firstChild);

        var f = document.createElement('tr');
        f.className = 'ko-satir ko-suzgec-satir';
        /* Şeridin düzeni: SÜZGECİN TAMAMI üstte (klavye ile şema ancak
           tam genişlikte yan yana sığıyor — ölçüldü, 990px'e sığmıyorlar),
           bâb bilgisi ikisinin ALTINDA ortalı, kapat düğmesi sağ üst
           köşede sabit. */
        /* KAPATMA DÜĞMESİ YOK: liste, açan veznin üstüne ikinci kez
           dokununca kapanıyor (bâb ⓘ'siyle aynı dil). Escape de
           kapatır. Şeritte ayrıca bir çarpı, kalabalık yapıyordu. */
        f.innerHTML = '<td colspan="' + sutunSayi + '"><div class="ko-serit-sar"><div class="ko-serit">' +
            SUZGEC_HTML +
            '<span class="ko-ad" id="klAd"></span>' +
            '</div></div></td>';
        var g = document.createElement('tr');
        g.className = 'ko-satir ko-govde-satir';
        g.innerHTML = '<td colspan="' + sutunSayi + '">' +
            '<div class="ko-kaydir"><div class="kl-govde ko-govde" id="klGovde"></div></div></td>';

        /* Bâb satırını en üste taşı. Kapatınca yerine koymak için
           sonrasını sakla. ÖTEKİ SATIRLAR HEMEN GİZLENİYOR: yerlerinde
           dursalardı satır onların arasından süzülüyor, hareket pürüzlü
           görünüyordu. */
        var n = satir.nextElementSibling;
        while (n && n.classList.contains('ko-satir')) n = n.nextElementSibling;
        Array.prototype.slice.call(govde2.children).forEach(function (tr) {
            if (tr === satir || tr.classList.contains('ko-satir')) return;
            tr.dataset.koGizli = '1';
            tr.style.display = 'none';
        });
        if (govde2.firstElementChild !== satir) govde2.insertBefore(satir, govde2.firstElementChild);
        Array.prototype.slice.call(satir.children).forEach(function (td, i) {
            if (tdRenk[i]) td.style.setProperty('background-color', tdRenk[i], 'important');
        });
        /* ŞERİT BAŞLIKLARIN DA ÜSTÜNDE: Mazi · Muzari · Emir · Mastar …
           satırının altına konsaydı süzgeç tablonun ortasında kalırdı.
           thead'in ilk satırı olarak giriyor — tablonun tam tepesi. */
        var bas = govde2.parentElement.querySelector('thead');
        if (bas) bas.insertBefore(f, bas.firstElementChild);
        else govde2.insertBefore(f, satir);

        odak = { no: no, satir: satir, suzgecTr: f, govdeTr: null, govdeHazir: g,
                 kutu: kutu, origNext: n, zaman: [] };
        /* İzlerin ORANI saklanır: tam ekran açılınca (bkz. sutunTazele)
           aynı oranlar yeni genişliğe yazılır. */
        var sutunToplam = sutunEn.reduce(function (a, b) { return a + b; }, 0) || 1;
        odak.sutunOran = sutunEn.map(function (w) { return w / sutunToplam; });
        satir.classList.add('ko-odak-satir');
        kutu.classList.add('ko-sec');
        /* Çarpı EN SONDA gelir (bkz. 4. vuruş) — satır uçarken pat diye
           belirmesin. */
        govde2.closest('table').classList.add('ko-acik');
        /* Öteki sekme (mücerred) akıştan çıkar: stor perde pencerenin
           kırpmasını kaldırdığı için bandın sağ yarısı ekranın son
           şeridinde görünüyordu. Kapanışta sınıf kalkar. */
        document.body.classList.add('mezid-odak');
        /* Üst çubuğun sönümlenmesi satırla AYNI ANDA başlamasın: bir
           soluk önce yapılır, satır uçarken ekranda tek hareket kalır. */
        if (typeof window.kidefUstKilit === 'function') window.kidefUstKilit();

        suzgecBagla(f);

        suzgecCiz();
        /* Bâb bilgisi FAZ 1'de yazılıyor: FAZ 2'ye bırakılsaydı şerit
           ölçüsü eksik alınıyor, yazı gelince şerit 30px daha büyüyüp
           tabloyu geç bir sıçramayla aşağı itiyordu (ölçüldü). */
        adYaz(0);

        /* ---- FAZ 1: satır yukarı süzülür, başlık aşağı kayar ----
           İkisi TEK hareket: şeridin yüksekliği 0'dan açılırken başlık
           satırı (Mazi … İsm-i Mef'ûl) aşağı iniyor; aynı sürede bâb
           satırı eski yerinden yukarı süzülüyor. Satırın başlangıç
           konumu şerit KAPALIYKENki yerine göre hesaplanıyor, yoksa
           şerit açılırken satır ikinci kez aşağı kayıyordu. */
        /* ================= AÇILIŞ KOREOGRAFİSİ: DÖRT AYRI VURUŞ =========
           Aynı anda iki hareket başlamaz. Sıra:
             1) SATIR yukarı süzülür            (KL_AC_MS)
             -) satır oturunca TAM EKRAN açılır (bkz. tamEkranaGec)
             2) ÖRNEKLER açılır                 (KL_LISTE_MS)
             3) SÜZGEÇ ŞERİDİ iner              (KL_SERIT_AC)
             4) ÇARPI belirir
           Şeridin YÜKSEKLİĞİ en baştan son ölçüsüne kuruluyor ama içi
           saklı duruyor: böylece satırın varacağı yer en baştan doğru,
           yine de ekranda tek bir hareket görünüyor. Eskiden şerit
           yüksekliği ile satır aynı anda hareket ediyordu. */
        var sar = f.querySelector('.ko-serit-sar');
        var seritYuk = sar.getBoundingClientRect().height;
        /* ŞERİT KAPALI BAŞLAR (yüksekliği 0). Böylece başlıklar (Mazi …
           İsm-i Mef'ûl) en yukarıda kalır, vezin onların hemen altına
           oturur, örnekler de altına dizilir. Süzgeç en sonda sekmenin
           altından AÇILARAK iner ve başlık+vezin bloğunu aşağı iter —
           tek ve pürüzsüz bir hareket. */
        sar.style.height = '0px';
        var sonTop = satir.getBoundingClientRect().top;
        satir.style.transition = 'none';
        satir.style.transform = 'translateY(' + (eskiTop - sonTop) + 'px)';
        void satir.offsetHeight;

        /* 1. VURUŞ — yalnız satır. Üst çubuğun sönümlenmesi bitsin diye
           bir soluk (KL_CUBUK_MS) bekletilir; yoksa ikisi bir arada
           başlıyordu. */
        var SURE = klSn(KL_AC_MS) + ' ' + KL_EGRI_AC;
        var st0 = odak;
        odak.zaman.push(setTimeout(function () {
            if (odak !== st0) return;
            satir.style.transition = 'transform ' + SURE;
            satir.style.transform = '';
        }, KL_CUBUK_MS));

        /* SATIR YERİNE OTURDU → ŞİMDİ TAM EKRAN. Kalan vuruşlar tam
           ekran oturduktan sonra, yeni ölçülerle başlar. */
        odak.zaman.push(setTimeout(function () {
            if (odak !== st0) return;
            satir.style.transition = ''; satir.style.transform = '';
            tamEkranaGec(function () {
                if (odak !== st0) return;
                sutunTazele();            /* pencere büyüdüyse izler yenilensin */

                /* 2. VURUŞ — ÖRNEKLER açılır */
                st0.zaman.push(setTimeout(function () {
                    if (odak !== st0) return;
                    faz2();
                }, KL_MUC_ARA));

                /* 3. VURUŞ — BÜTÜN LİSTELER AÇILDIKTAN SONRA süzgeç iner.
                   Şerit thead'in ilk satırı olduğu için yüksekliği
                   açılırken başlık satırını, vezni ve örnekleri birlikte
                   aşağı iter. Yükseklik TAM EKRANDA yeniden ölçülür:
                   pencere genişliği değiştiyse klavye başka sarıyor. */
                st0.zaman.push(setTimeout(function () {
                    if (odak !== st0) return;
                    var h = seritOlc(sar) || seritYuk;
                    sar.style.transition = 'height ' + klSn(KL_SERIT_AC) + ' ' + KL_EGRI_AC;
                    sar.style.height = h + 'px';
                    st0.zaman.push(setTimeout(function () {
                        sar.style.transition = ''; sar.style.height = '';
                    }, KL_SERIT_AC + 60));
                }, KL_MUC_ARA + KL_LISTE_TAM + 120));

                /* 4. VURUŞ — en son, kapatma çarpısı */
                st0.zaman.push(setTimeout(function () {
                    if (odak === st0 && odak.kutu) kapatXKur(odak.kutu);
                }, KL_MUC_ARA + KL_LISTE_TAM + KL_SERIT_AC + 320));
            });
        }, KL_CUBUK_MS + KL_AC_MS + 60));

        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
        return true;
    }

    /* ŞERİDİN DOĞAL YÜKSEKLİĞİ: kapalıyken (height:0) ölçülemez.
       Geçici olarak serbest bırakıp okur, aynı karede geri kapatır —
       ekranda hiçbir sıçrama olmaz. */
    function seritOlc(sar) {
        if (!sar) return 0;
        var eskiGecis = sar.style.transition, eskiYuk = sar.style.height;
        sar.style.transition = 'none';
        sar.style.height = 'auto';
        var h = sar.getBoundingClientRect().height;
        sar.style.height = eskiYuk;
        void sar.offsetHeight;
        sar.style.transition = eskiGecis;
        return h;
    }

    /* FAZ 2: satır yukarı süzülüp yerine oturduktan SONRA örnekler
       beliriyor. Yarım kalmışsa doğrudan çağrılabilir (hızlı ikinci
       tıklamada liste eksik kalmasın). */
    function faz2(anisiz) {
        if (!odak || odak.govdeTr) return;
        var st = odak, govde2 = st.satir.parentElement;
        if (!govde2) return;
        govde2.insertBefore(st.govdeHazir, st.satir.nextSibling);
        st.govdeTr = st.govdeHazir;
        /* ANİSİZ: liste ARKA PLANDA kuruluyor (mücerred açılışı).
           Ne yükseklik perdesi ne satır şelalesi olur — hepsi tek bir
           yavaş belirişe (belirBasla) bırakılır. */
        if (anisiz) st.anisizCizim = true;
        govdeCiz();
        if (anisiz) { st.anisizCizim = false; return; }
        /* Liste YÜKSEKLİKLE açılıyor: aşağı doğru yumuşakça iniyor,
           satırlar da sırayla beliriyor. Eski .ko-belir tek karede
           yukarıdan düşürüyordu. */
        var kap = st.govdeTr.querySelector('.ko-kaydir');
        if (!kap) return;
        /* BANTLI TAKIMDA (teksir) perde yok: ikinci dörtlünün üst
           levhadan örneklerin ortasına SÜZÜLÜŞÜ açılışın kendisidir;
           yükseklik perdesi o uçuşu kırpardı. Kartlar zaten kademeli. */
        var tkF = st.muc ? takimBul(st.no) : null;
        if (tkF && tkF.uyeler.length > tkF.sutun) return;
        /* Liste artık SAYFAYLA kayıyor (stor perde): tam boyu binlerce
           piksel olabilir. Animasyon yalnız GÖRÜNÜR kısmı kadar açılır,
           bitince serbest bırakılır — ekran altı zaten görünmüyor. */
        var hedef = Math.min(kap.getBoundingClientRect().height, window.innerHeight);
        kap.style.overflow = 'hidden';
        kap.style.height = '0px';
        void kap.offsetHeight;
        kap.style.transition = 'height ' + klSn(KL_LISTE_MS) + ' ' + KL_EGRI_AC;
        kap.style.height = hedef + 'px';
        st.zaman.push(setTimeout(function () {
            kap.style.transition = ''; kap.style.height = ''; kap.style.overflow = '';
        }, KL_LISTE_MS + 60));
    }

    /* Kapanışın SON adımı: DOM eski hâline döner. Animasyonun sonunda ya
       da (sessiz kapanışta) doğrudan çağrılır. Bir kez çalışır. */
    var kapanan = null;
    function odakSonlandir(st, sessiz, bittiCb) {
        function haber() { if (bittiCb) { var f = bittiCb; bittiCb = null; f(); } }
        if (st.bitti) { haber(); return; }
        st.bitti = true;
        if (kapanan === st) kapanan = null;
        storSifirla();                        /* üst çubuk sınıfları temizlensin */
        kapatXSil();
        if (st.muc) {                          /* mücerred kendi yolundan */
            mucSonlandir(st, sessiz);
            /* Mücerredde tepeye çıkan bir SATIR yok; kutular kendi
               yerlerine süzülür (kutuSuzul, KL_AC_MS süresiyle). Tam
               ekrandan çıkış o süzülüş bitince istenir. */
            if (sessiz) haber(); else setTimeout(haber, KL_MUC_MS + 80);
            return;
        }
        document.body.classList.remove('mezid-odak');
        var govde2 = st.satir.parentElement;
        var eskiTop = st.satir.getBoundingClientRect().top;
        st.satir.style.transition = ''; st.satir.style.transform = '';
        st.suzgecTr.remove();
        if (st.govdeTr) st.govdeTr.remove();
        st.satir.classList.remove('ko-odak-satir');
        if (st.kutu) st.kutu.classList.remove('ko-sec');
        if (govde2) {
            if (st.origNext && st.origNext.parentElement === govde2) govde2.insertBefore(st.satir, st.origNext);
            else if (st.origNext === null) govde2.appendChild(st.satir);
            /* Sabitlenen şerit rengini bırak: nth-child yine doğrusunu verir */
            Array.prototype.slice.call(st.satir.children).forEach(function (td) {
                td.style.removeProperty('background-color');
            });
            Array.prototype.slice.call(govde2.children).forEach(function (tr) {
                tr.classList.remove('ko-sonuyor');
                if (tr.dataset.koGizli) { tr.style.display = ''; delete tr.dataset.koGizli; }
            });
            var tablo = govde2.closest('table');
            if (tablo) {
                tablo.classList.remove('ko-acik');
                var cg = tablo.querySelector('colgroup.ko-sutun');
                if (cg) cg.remove();
            }
            kaydirTr(st.satir, eskiTop, haber);
        } else haber();
        if (typeof window.kidefUstKilit === 'function') window.kidefUstKilit();
        if (!sessiz && typeof SoundEngine !== 'undefined' && SoundEngine.playClose) SoundEngine.playClose();
    }

    /* KAPANIŞ, AÇILIŞIN AYNASI DEĞİL — Geylani'nin istediği sıra:
         1) önce klavye + aksâm şeridi YUKARIDAN kapanır (.5sn)
         2) sonra örnekler yavaşça kapanır (.6sn)
         3) en son satır eski yerine süzülür (bâb odağının süresiyle)
       sessiz=true → animasyonsuz, doğrudan son hâl (başka bir vezne
       geçerken ya da ⓘ'ye basılırken ekran bekletilmesin). */
    function odakKapat(sessiz) {
        if (!odak) return;
        var st = odak;
        odak = null;
        (st.zaman || []).forEach(clearTimeout);   /* yarım kalan açılış */
        st.zaman = [];
        /* SESSİZ kapanış (başka vezne geçiş, ⓘ): animasyon yok, çıkış
           hemen istenebilir — yeni liste açılırsa zaten iptal olur. */
        kapatXSil();                 /* çarpı ilk anda gider: şeritle aynı anda oynamasın */
        /* Odak kalkarken sayfanın kendi bekleme animasyonları (kalıp
           numarası nabzı, sürpriz kutu parıltısı, ipucu rozeti, üst
           çubuk simgeleri) hep birlikte yeniden başlıyordu — üstelik tam
           satır kendi yerine dönerken. Satır oturana kadar susturuluyor. */
        document.body.classList.add('ko-sakin');
        if (sessiz) { odakSonlandir(st, true); document.body.classList.remove('ko-sakin'); tamEkranKapatGecikmeli(); return; }
        kapanan = st;
        /* Ara levhadaki kutular (teksirin orta dörtlüsü) kapanmadan önce
           ÜST levhaya geri süzülür — açılışın aynası; yoksa gövde perdesi
           kapanırken içeride kırpılıp kayboluyorlardı. */
        if (st.muc) mucToparla(st);
        /* Sayfa aşağıdaysa kapanışla birlikte tepeye süzül (stor perde
           kapanırken makara yukarı sarar) — şerit kapanışıyla eşzamanlı. */
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
        var sar = st.suzgecTr.querySelector('.ko-serit-sar');
        var kap = st.govdeTr && st.govdeTr.querySelector('.ko-kaydir');
        var EGRI = KL_EGRI_KAP;
        var A = KL_KAP_SERIT, B = KL_KAP_LISTE;
        if (sar) {
            /* KATLAR ÇEKİLİYKEN ŞERİT CANLANDIRILMAZ.
               Takım kipinde tablo, şeridin YERİNİ geri almak için
               --ko-serit-oz kadar yukarı çekilidir; yani şerit görüş
               alanının ÜSTÜNDE, zaten görünmüyor. Boyu yavaşça sıfıra
               inerken pay 116 px'te donuk kalıyor, altındaki her şey o
               kadar yukarı süzülüyor ve vezinler ekranın üstünden taşıp
               kırpılıyordu (ölçüldü: levha +3 px'ten −113 px'e iniyor —
               Geylani: "cemi teksîr kapatılırken bi kısmı görünmüyor").
               Görünmeyen bir şeyi canlandırmanın anlamı yok: şerit ve
               pay TEK KAREDE birlikte sıfırlanır, ikisi birbirini tam
               götürür, ekranda hiçbir şey oynamaz. Katlar açıkken şerit
               görünür ve tablonun payı zaten sıfırdır — orada eski
               yumuşak kapanış aynen sürüyor. */
            var cekili = barKipi() && !document.body.classList.contains('muc-takim-ust');
            if (cekili) {
                document.body.classList.add('muc-kapaniyor');   /* pay geçişi kapalı */
                sar.style.transition = 'none';
                sar.style.height = '0px';
                document.body.style.setProperty('--ko-serit-oz', '0px');
            } else {
                sar.style.height = sar.getBoundingClientRect().height + 'px';
                void sar.offsetHeight;
                sar.style.transition = 'height ' + klSn(A) + ' ' + EGRI;
                sar.style.height = '0px';
            }
        }
        st.zaman.push(setTimeout(function () {
            if (st.bitti) return;
            if (kap) {
                kap.style.overflow = 'hidden';
                /* Görünür boydan başla: binlerce pikselden 0'a inen geçiş
                   son karede "pat" diye kapanmış görünüyordu */
                kap.style.height = Math.min(kap.getBoundingClientRect().height, window.innerHeight) + 'px';
                void kap.offsetHeight;
                kap.style.transition = 'height ' + klSn(B) + ' ' + EGRI;
                kap.style.height = '0px';
            }
            st.zaman.push(setTimeout(function () {
                /* TAM EKRANDAN ÇIKIŞ EN SONDA — ve artık SAATE DEĞİL,
                   SATIRIN KENDİSİNE bakarak. Mezidde alttaki bir satır
                   tıklandığında o satır tepeye çıkıyor; kapanışta aynı
                   yolu geri iniyor. macOS'ta tam ekrandan çıkış sağdan
                   gelen siyah bir perdeyle başlıyor; satır hâlâ yoldayken
                   çıkılırsa tablo başka bir yerden geliyormuş gibi
                   görünüyordu. Şimdi satırın dönüş geçişi BİTTİKTEN sonra
                   çıkılıyor. Bu arada yeni bir vezin açılırsa çıkış
                   kendiliğinden iptal olur (tamEkranKapatGecikmeli
                   "odak" varsa durur). */
                odakSonlandir(st, false, function () {
                    /* Satır yerine oturdu: önce sayfa kendi nabzına dönsün,
                       sonra tam ekrandan çıkılsın — ikisi bir arada olmasın. */
                    setTimeout(function () { document.body.classList.remove('ko-sakin'); }, 60);
                    setTimeout(tamEkranKapatGecikmeli, 380);
                });
            }, kap ? B + 40 : 0));
        }, sar ? A + 30 : 0));
    }

    /* ---------- 4c) TABLO İÇİ ODAK (SÜLÂSÎ MÜCERRED) ----------
       Mücerredde (1-51) mezidin "satır tepeye süzülür" hareketi
       uygulanamaz: tablo rowspan'lı, isim kalıplarının çoğu tek hücrede
       (mastar-grid) yığılı. Onun yerine TIKLANAN KUTUNUN KENDİSİ (klon
       değil) tablonun tepesindeki sentetik "vezin levhası" satırına
       FLIP ile taşınıp büyür; öteki satırlar gizlenir. Şerit, örnekler,
       süzgeç, stor perde, üst kilit — hepsi mezidle ORTAK makine
       (aynı `odak` nesnesi; `odak.muc` bayrağı ayırır). */
    /* KALIP TAKIMLARI: birine basılınca ÜYELERİN HEPSİ birlikte uçar,
       örnekler sütunlu panellere ayrışır; her panel KENDİ İÇİNDE kayar.
         · İsm-i fâil (33-35):   3 sütun tek sıra
         · Zaman-mekân (37+38):  2 sütun tek sıra
         · İsm-i âlet (39+40):   2 sütun tek sıra
         · İsm-i tafdil (50+51): 2 sütun tek sıra — sağda 50, solda 51
         · Cem-i teksir (41-48): 4 sütun × 2 sıra, panel başlıklı
       Üye sayısı sütunu aşarsa (yalnız teksir) ikinci sıra ARA LEVHA
       olarak örneklerin ortasına iner; başlık orada zorunlu.
       kisa: sekizli görünüm ekrana sığsın diye kartlar SIKI dizilir,
       Türkçeleri gizli durur — kelimeye dokununca açılır. */
    /* MASDAR/SIFAT TAKIMLARI (17-32): bu vezinler birbirine yalnız
       HAREKEYLE benziyor (فَعَل · فَعِل · فَعْل …). Tek tek açılınca hangi
       listenin hangi vezne ait olduğu ayırt edilemiyordu; artık aynı
       yazılış ailesi birlikte açılıyor ve her panel KENDİ başlığını
       taşıyor (vezin + numara + Türkçe görevi — panelTr).
         17-21 · 22-24 · 25-26 · 27-29 · 30-32
       baslik alanı üst şeritte görünen takım adıdır. */
    var TAKIMLAR = [
        { ad: 'fail', uyeler: [33, 34, 35], sutun: 3, panelBas: false },
        { ad: 'zamanmekan', uyeler: [37, 38], sutun: 2, panelBas: false },
        { ad: 'alet', uyeler: [39, 40], sutun: 2, panelBas: false },
        { ad: 'tafdil', uyeler: [50, 51], sutun: 2, panelBas: false },
        { ad: 'teksir', uyeler: [41, 42, 43, 44, 45, 46, 47, 48], sutun: 4, panelBas: true, kisa: true },
        { ad: 'masdar1', uyeler: [17, 18, 19, 20, 21], sutun: 5, panelBas: true, panelTr: true,
          baslik: 'Üç Harfli Masdarlar' },
        { ad: 'masdar2', uyeler: [22, 23, 24], sutun: 3, panelBas: true, panelTr: true,
          baslik: 'Fe\'âl Masdarları' },
        { ad: 'masdar3', uyeler: [25, 26], sutun: 2, panelBas: true, panelTr: true,
          baslik: 'Fu\'ûl Masdarları' },
        { ad: 'masdar4', uyeler: [27, 28, 29], sutun: 3, panelBas: true, panelTr: true,
          baslik: 'Fu\'lân Masdarları' },
        { ad: 'sifat', uyeler: [30, 31, 32], sutun: 3, panelBas: true, panelTr: true,
          baslik: 'Sıfat-ı Müşebbehe (Renk ve Kusur)' }
    ];
    function takimBul(no) {
        for (var i = 0; i < TAKIMLAR.length; i++)
            if (TAKIMLAR[i].uyeler.indexOf(no) >= 0) return TAKIMLAR[i];
        return null;
    }
    /* LEVHANIN ZEMİNİ TABLONUN KENDİ ZEMİNİDİR. Levha yapışıp yüzerken
       altından kartlar akıyor; saydam kalamaz, ama BEYAZA DA DÖNMEZ
       (Geylani: "yukarı kaydırınca vezninin arkası beyazlaşmasın").
       Çözüm: tablonun pastel gradyanının TAM O NOKTADAKİ DİLİMİ hücreye
       kopyalanır — dururken dikişsiz, yüzerken de aynı renk. */
    function mucZeminKopyala(td) {
        var kap = td.parentElement;
        while (kap && kap !== document.body) {
            var cs = getComputedStyle(kap);
            if (cs.backgroundImage && cs.backgroundImage !== 'none') {
                var rk = kap.getBoundingClientRect(), rt = td.getBoundingClientRect();
                if (!rk.width || !rt.width) return false;
                td.style.setProperty('background-image', cs.backgroundImage, 'important');
                td.style.setProperty('background-size',
                    Math.round(rk.width) + 'px ' + Math.round(rk.height) + 'px', 'important');
                td.style.setProperty('background-position',
                    Math.round(rk.left - rt.left) + 'px ' + Math.round(rk.top - rt.top) + 'px', 'important');
                return true;
            }
            kap = kap.parentElement;
        }
        return false;
    }
    /* ================= TAKIM KİPİ: ÜST KATLAR =================
       ARTIK BÜTÜN VEZİNLERDE AYNI SİSTEM (Geylani: "vezinlere basınca
       bazılarında filtre kısmı çıkmıyor… tüm vezinlerde sistem aynı
       olmalı, filtre ve yapışkan kısmın yukarı çıkması vs").

       ESKİDEN: takım görünümlerinde (17-21 · 22-24 · 25-26 · 27-29 ·
       30-32 · ism-i fâil · zaman-mekân · âlet · cem-i teksir · tafdil)
       Kök Ara / Aksâm-ı Seb'a şeridi HİÇ ÇİZİLMİYORDU, üst çubuk da
       baştan çekiliydi. Sebep dikey alandı: takımda örnekler panel panel
       KENDİ İÇİNDE kaydığı için sayfanın kayacak yeri yok, o yüzden stor
       perdesi hiç tetiklenmiyor, şerit yalnız görünmez oluyor ama YERİ
       duruyordu — vezinlerin üstünde ~145 px boş bant kalıyordu.

       ŞİMDİ: şerit takımda da çiziliyor ve üst çubukla birlikte AÇIK
       geliyor; tekil kalıplarda ne görülüyorsa burada da o görülüyor.
       Ekranı yukarı çekince (tekerlek aşağı / parmak yukarı) ikisi
       BİRLİKTE kalkıyor ve YERLERİNİ DE bırakıyor — vezinler tepeye
       oturuyor; ters yönde jest ikisini geri indiriyor. Şeridin yeri
       tablonun negatif üst payıyla geri alınıyor (bir <td>'ye margin
       işlemediği için); paneller de boşalan kadar uzuyor (--kl-panel-yuk).
       Tekil kalıpta aynı işi sayfanın gerçek kaydırması + stor perdesi
       yapıyor; gözle görülen davranış birebir aynı. */
    function seritGizle(takim, bab) {
        /* TEK EKRAN KİPİ: hem takımlar hem BÂBLAR (1-16).
           Bâb odağında örnekler bir matris; eskiden bütün sayfa kayıyordu
           (ölçüldü: 1. bâbda 14 237 px). Sayfa kayınca vezin levhası ile
           filtre yapışkanlıkla ekranda tutulmaya çalışılıyor, matrisin
           sütunları levhadan kopuyordu. Artık matris KENDİ kabında kayıyor
           (--kl-kaydir-yuk), sayfanın kendisi kaymıyor; dışarıda yapılan
           jest ise üst katları kaldırıp filtreyi topluyor — takımlarda ne
           oluyorsa o (Geylani: "1-16 vezin örnekleri diğer vezinler gibi
           hareket etsin"). */
        var tekEkran = !!(takim || bab);
        document.body.classList.remove('muc-kapaniyor');   /* yarım kalmışsa */
        document.body.classList.toggle('muc-takim', tekEkran);
        document.body.classList.toggle('muc-bab', !!bab && !takim);
        /* Her açılışta üst katlar AÇIK: ilk görüntüde filtre görünsün */
        document.body.classList.toggle('muc-takim-ust', tekEkran);
        payGozcuKur(tekEkran);
        takimPayOlc();
    }
    /* ŞERİDİN BOYU SONRADAN OTURUYOR: açılış sırasında şerit satırı
       daha `display:none` (tablo çekilene kadar akış dışında), ölçü o
       anda 0 çıkıyor ve paneller olduğundan uzun kalıyordu — ekranın
       altından taşıp sayfaya kaydırma çubuğu getiriyordu. Gözcü, şerit
       ve üst çubuk her boy değiştirdiğinde payı yeniden yazıyor;
       süzgeç açılıp kapandığında da aynı yoldan geçiyor. */
    var payGozcu = null;
    function payGozcuKur(takimda) {
        if (!takimda) {
            if (payGozcu) { payGozcu.disconnect(); payGozcu = null; }
            return;
        }
        if (typeof ResizeObserver === 'undefined') {
            /* Gözcüsüz tarayıcıda birkaç kare sonra tek seferlik ölçüm */
            [80, 400, 1200, 2600].forEach(function (ms) { setTimeout(takimPayOlc, ms); });
            return;
        }
        if (!payGozcu) payGozcu = new ResizeObserver(function () { takimPayOlc(); });
        payGozcu.disconnect();
        /* Üst çubuk · şerit · vezin levhası: üçünün boyu da panellere
           kalan yeri değiştiriyor. Panellerin KENDİSİ izlenmiyor —
           ölçüm onları değiştirdiği için gözcü kendi kuyruğunu kovalardı. */
        [document.querySelector('.top-bar'),
         document.querySelector('.ko-suzgec-satir > td'),
         document.querySelector('.muc-levha-satir > td')]
            .forEach(function (el) { if (el) payGozcu.observe(el); });
    }
    /* ÜST KATLARI EKRANI AŞAĞI ÇEKİNCE GERİ GETİR. Bu görünümde sayfa
       kaymadığı için stor perdesi tetiklenmiyor — jesti kendimiz
       dinliyoruz: tekerlek yukarı / parmak aşağı = katlar iner, ters
       yön = kalkarlar. Panel içi kaydırma ÖNCELİKLİ: panelin daha
       kayacak yeri varsa jest ona bırakılır. */
    function panelPayiVar(hedef, yon) {
        /* Takımda panel gövdesi, bâbda matrisin kabı — hangisi daha
           yakınsa jest önce ona ait. */
        var g = (hedef && hedef.closest) ? hedef.closest('.kl-panel-govde, .ko-kaydir') : null;
        if (!g) return false;
        return (yon < 0) ? (g.scrollTop > 1)
                         : (g.scrollTop + g.clientHeight < g.scrollHeight - 1);
    }
    /* PANEL TAVANI ÖLÇÜLEREK BULUNUR, SABİTLE DEĞİL.
       Takım görünümü tek ekrana sığmalı: sığmazsa sayfada kaydırma
       çubuğu doğuyor, çubuk da genişliği değiştirip titreme yapıyor.
       Sığacak boy CSS sabitleriyle (100vh − 245px gibi) tutturulamıyor,
       çünkü üstteki katlar (bar + şerit) inip kalkıyor, panel başlığı
       kimi ailede iki satır (vezin + Türkçe görev), teksirde ise iki
       bant + ara levha var.

       ÖLÇÜM HİÇBİR ŞEYE DOKUNMAZ. İlk sürümde gövdeler bir an sıfıra
       indirilip sayfanın kalanı ölçülüyordu; kâğıt üstünde tek görevde
       bitiyordu ama tarayıcı o ara biçimi de hesaplıyor ve geçiş yeniden
       açıldığında animasyonu SIFIRDAN başlatıyordu — liste her ölçümde
       yeniden büyüyordu (ölçüldü: tek açılışta 65 yerleşim değişimi;
       Geylani: "birden fazla render oluyormuş gibi tekrar tekrar scroll
       oluyor"). Şimdi ölçü tamamen okumadan çıkarılıyor:
         · bantların ÜSTÜNDEKİ her şey  = ilk bandın tepesi
         · her bandın panel KROMU       = bant boyu − en uzun gövde
         · bantlar arası (ara levha)    = alt bandın tepesi − üstün dibi
       Kalan boşluk bantlara bölünür. Gövdelerin o anki boyu ne olursa
       olsun (tavana dayalı ya da içerikten kısa) krom aynı çıkar, yani
       ölçü kendi kendini düzeltir; kartlar dolarken bile oynamaz. */
    function takimOlc() {
        var b = document.body;
        if (!b.classList.contains('muc-takim')) {
            b.style.removeProperty('--kl-panel-yuk');
            b.style.removeProperty('--kl-kaydir-yuk');
            return;
        }
        /* Şeridin boyunu BURADA da yazıyoruz: storOlc yalnız kaydırmada
           çalışıyor, takımda ise sayfa hiç kaymıyor — ölçü 0'da kalıp
           tablo yukarı çekilemiyordu (levha tepeye 116 px uzak kalıyordu). */
        var td = document.querySelector('.ko-suzgec-satir > td');
        if (td && td.offsetHeight) b.style.setProperty('--ko-serit-oz', td.offsetHeight + 'px');
        /* BÂB ODAĞI: kayan tek bir kap var (matrisin kabı). Üstünde ne
           kalıyorsa gerisi onun; ölçü kabın kendi tepesinden okunuyor. */
        if (b.classList.contains('muc-bab')) {
            var kay = document.querySelector('#tab1 .ko-kaydir');
            if (!kay) return;
            var kr = kay.getBoundingClientRect();
            if (!kr.height) return;
            var yer = Math.max(180, Math.floor(
                window.innerHeight - (kr.top + (window.scrollY || 0)) - 6));
            var oncekiK = parseFloat(b.style.getPropertyValue('--kl-kaydir-yuk')) || 0;
            if (Math.abs(yer - oncekiK) > 2) b.style.setProperty('--kl-kaydir-yuk', yer + 'px');
            return;
        }
        var yuva = document.getElementById('klGovde');
        var bantlar = yuva ? yuva.querySelectorAll('.kl-takim') : [];
        if (!bantlar.length) return;
        var ilk = bantlar[0].getBoundingClientRect();
        if (!ilk.height) return;              /* daha yerleşmemiş: ölçme */
        var dolu = ilk.top + (window.scrollY || 0);
        var oncekiAlt = null;
        for (var i = 0; i < bantlar.length; i++) {
            var r = bantlar[i].getBoundingClientRect();
            if (oncekiAlt !== null) dolu += Math.max(0, r.top - oncekiAlt);
            oncekiAlt = r.bottom;
            var gvd = bantlar[i].querySelectorAll('.kl-panel-govde');
            var enUzun = 0;
            for (var j = 0; j < gvd.length; j++)
                enUzun = Math.max(enUzun, gvd[j].getBoundingClientRect().height);
            dolu += Math.max(0, r.height - enUzun);
        }
        var pay = Math.max(120,
            Math.floor((window.innerHeight - dolu - 6) / bantlar.length));
        /* Birkaç piksellik oynamalar yazılmaz: yoksa kartlar dolarken
           tavan sürekli tazelenip geçişi yeniden tetiklerdi. */
        var eski = parseFloat(b.style.getPropertyValue('--kl-panel-yuk')) || 0;
        if (Math.abs(pay - eski) > 2) b.style.setProperty('--kl-panel-yuk', pay + 'px');
    }
    /* İKİ HIZ:
       · hemen = true  → aynı karede ölç. Üst katlar inip kalkarken
         (jest) paneller barla BİRLİKTE büyüsün diye gerekli.
       · hemen = false → yalnız yerleşim durduktan sonra ölç. Liste
         açılırken levha, panel başlıkları ve kartlar sırayla oturuyor;
         her ara durumda tavan yazılsaydı geçiş üst üste tetiklenir,
         liste birkaç kez yeniden büyürdü. Bekleyiş her yeni istekte
         baştan kurulur, yani ölçü hareket bitince bir kez alınır. */
    var olcuBekleyen = 0, olcuSaat = null;
    function takimPayOlc(hemen) {
        if (!document.body.classList.contains('muc-takim')) {
            if (document.body.style.getPropertyValue('--kl-panel-yuk'))
                document.body.style.removeProperty('--kl-panel-yuk');
            if (document.body.style.getPropertyValue('--kl-kaydir-yuk'))
                document.body.style.removeProperty('--kl-kaydir-yuk');
            return;
        }
        if (hemen && !olcuBekleyen) olcuBekleyen = requestAnimationFrame(function () {
            olcuBekleyen = 0; takimOlc();
        });
        clearTimeout(olcuSaat);
        olcuSaat = setTimeout(function () { olcuSaat = null; takimOlc(); }, 400);
    }
    function barAc(ac) {
        var b = document.body;
        if (b.classList.contains('muc-takim-ust') === !!ac) return;
        b.classList.toggle('muc-takim-ust', !!ac);
        takimPayOlc(true);          /* paneller barla birlikte büyüsün */
    }
    function barKipi() { return document.body.classList.contains('muc-takim'); }
    /* KAYAN KAP HER ZAMAN ÖNCELİKLİ — iki yönde de.
       Örneklerin içinde gezerken üst katlar oynamaz; jest ancak kabın
       DIŞINDA yapılırsa (levha, kenar boşlukları) ya da kap yolun
       sonuna geldiyse katlara geçer (Geylani: "örnekleri kaydırırken
       sayfa kaymasın, örnek konteynırı dışında kaydırılırsa filtre
       kaybolsun"). */
    document.addEventListener('wheel', function (e) {
        if (!barKipi()) return;
        if (e.deltaY < -4) { if (!panelPayiVar(e.target, -1)) barAc(true); }
        else if (e.deltaY > 4) { if (!panelPayiVar(e.target, 1)) barAc(false); }
    }, { passive: true });
    var dokunY = null;
    document.addEventListener('touchstart', function (e) {
        dokunY = (e.touches && e.touches[0]) ? e.touches[0].clientY : null;
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
        if (!barKipi() || dokunY === null || !e.touches || !e.touches[0]) return;
        var dy = e.touches[0].clientY - dokunY;
        if (dy > 26) { if (!panelPayiVar(e.target, -1)) { barAc(true); dokunY = e.touches[0].clientY; } }
        else if (dy < -26) { if (!panelPayiVar(e.target, 1)) { barAc(false); dokunY = e.touches[0].clientY; } }
    }, { passive: true });
    function mucLevhaBoya() {
        if (!odak || !odak.muc || !odak.satir) return;
        var hucre = odak.satir.querySelector('td');
        if (!hucre) return;
        /* Boya AYRI KATMANA: kutular hücrenin içinde yaşıyor, hücreye
           opaklık verilseydi başlık da solardı (bkz. levhaKur). */
        var td = hucre.querySelector('.muc-levha-zemin') || hucre;
        /* ÇİFT BOYA OLMASIN: zemin katı kurulmadan önce (arka plan
           çizimi sırasında) hücrenin kendisi boyanmış olabiliyor; ikisi
           üst üste gelince şerit sayfa zemininden koyu çıkıyor ve en
           üstte sağdan sola uzanan ekstra bir bant gibi görünüyordu. */
        if (td !== hucre) {
            hucre.style.removeProperty('background-image');
            hucre.style.removeProperty('background-color');
            hucre.style.removeProperty('background-attachment');
            hucre.style.removeProperty('background-size');
            hucre.style.removeProperty('background-position');
        }
        var zem = odak.evTonlar && odak.evTonlar[odak.no];
        if (zem) {                            /* ev zemini renkliyse o renk */
            td.style.removeProperty('background-image');
            td.style.setProperty('background-color', zem, 'important');
            return;
        }
        td.style.removeProperty('background-color');
        /* ŞERİT DE SAYFANIN ZEMİNİYLE AYNI: degrade pencereye çakılı
           (background-attachment: fixed), yani `body.muc-odak::before`
           ile birebir hizalı. Yapışkan başlık şeridi arkadaki zeminin
           devamı gibi duruyor, kartlar altından akarken de okunaklı
           kalıyor. */
        var deg = ustDegrade();
        if (deg) {
            td.style.setProperty('background-image', deg, 'important');
            td.style.setProperty('background-attachment', 'fixed', 'important');
            td.style.setProperty('background-size', 'cover', 'important');
            td.style.setProperty('background-position', 'center', 'important');
            return;
        }
        mucZeminKopyala(td);
    }
    /* Sayfanın gri degradesi: hiçbir öğeye boyanmıyor, tabloda değişken
       olarak duruyor (bkz. ustZeminDilimle). */
    function ustDegrade() {
        var t1 = document.getElementById('tab1');
        var tablo = t1 && t1.querySelector('.container > table');
        if (!tablo) return '';
        return (getComputedStyle(tablo).getPropertyValue('--ust-degrade') || '').trim();
    }
    /* BÂB ODAĞINDA SİMETRİ: örnek sütunları levhadaki ÜÇ kutunun tam
       altına gelir. Matrise colgroup, levhaya aynı ölçülerde grid izleri
       yazılır (sağda kök izi boş kalır — matrisin kök sütunu). Tekil
       kipte ikisi de temizlenir. */
    function mucHizala() {
        if (!odak || !odak.muc || !odak.govdeTr) return;
        var yuva = odak.satir && odak.satir.querySelector('.muc-levha');
        var t = odak.govdeTr.querySelector('.kl-tablo');
        if (!yuva) return;
        if (!acikGor || acikGor.kip !== 'bab' || !t) {
            if (yuva.style.gridTemplateColumns) yuva.style.gridTemplateColumns = '';
            return;
        }
        /* Ölçü tabanı LEVHA HÜCRESİ: açılıştaki erken yerleşimle (FLIP
           öncesi) aynı taban kullanılır ki faz 2'de kutular kıpırdamasın. */
        var lvTd = odak.satir.querySelector('td');
        var kap = odak.govdeTr.querySelector('.ko-kaydir');
        var toplam = (lvTd && lvTd.clientWidth) || (kap && kap.clientWidth) || t.clientWidth || 0;
        if (!toplam) return;
        var kokW = Math.min(230, Math.max(150, Math.round(toplam * 0.14)));
        var w = Math.max(60, Math.floor((toplam - kokW) / 3));
        var eski = t.querySelector(':scope > colgroup');
        if (eski) eski.remove();
        var cg = document.createElement('colgroup');
        [kokW, w, w, w].forEach(function (px) {
            var c = document.createElement('col');
            c.style.width = px + 'px';
            cg.appendChild(c);
        });
        t.insertBefore(cg, t.firstChild);
        yuva.style.gridTemplateColumns = kokW + 'px ' + w + 'px ' + w + 'px ' + w + 'px';
    }
    /* Kutu FLIP: eski dikdörtgeninden şimdiki yerine süzülür (satır
       kaydırmanın kutu karşılığı). Süre verilmezse bâb odağınınki. */
    /* FLIP: kutu levhaya taşındıktan sonra ESKİ yerine/ölçüsüne geri
       çevrilir (geçişsiz), sonra oraya doğru bırakılır — eski yerinden
       uçup büyüyormuş gibi görünür.
       gecikme: yalnız UÇUŞUN BAŞLAMASI ertelenir. Kritik nokta: geri
       çevirme ERTELENMEZ. Eskiden bütün çağrı geciktiriliyordu; o yarım
       saniye boyunca kutu levhada BÜYÜK duruyor, sonra birden küçülüp
       yeniden uçuyordu — "büyük çıkıyor, kaybolup tekrar görünüyor"
       denen kusur buydu. */
    function kutuSuzul(kutu, r0, sure, gecikme) {
        var r1 = kutu.getBoundingClientRect();
        if (!r1.width || !r1.height) return;
        kutu.style.transition = 'none';
        kutu.style.transformOrigin = '0 0';
        kutu.style.transform = 'translate(' + (r0.left - r1.left) + 'px,' + (r0.top - r1.top) + 'px)' +
            ' scale(' + (r0.width / r1.width) + ',' + (r0.height / r1.height) + ')';
        void kutu.offsetHeight;
        var SURE = sure || (klSn(KL_AC_MS) + ' ' + KL_EGRI_AC);
        var ms = (parseFloat(SURE) || 1) * 1000 + 60;
        function bas() {
            kutu.style.transition = 'transform ' + SURE;
            kutu.style.transform = '';
            setTimeout(function () {
                kutu.style.transition = ''; kutu.style.transform = ''; kutu.style.transformOrigin = '';
            }, ms);
        }
        if (gecikme) setTimeout(bas, gecikme); else bas();
    }
    /* ---- YAVAŞ DÖNÜŞÜM (mücerred açılışı) ----
       Satır (levha ya da örnek listesi) arka planda, akıştan ÇIKMIŞ
       hâlde kurulur; belirme anında akışa girer ama görünmez durur,
       sonra yerinde erircesine belirir. Uçuş yok: hafif bir büyüme
       "yaklaşıyor" hissini veriyor, geri kalanı sönümlenme.
         belirHazirla → satırı akışa al, görünmez ve minik bırak (ölçü
                        alınabilir hâlde)
         belirBasla   → yavaşça belir */
    function belirHazirla(tr) {
        var ic = tr.querySelector('.muc-levha');
        var kirp = null;
        if (!ic) { kirp = tr.querySelector('.ko-kaydir'); ic = kirp || tr.querySelector('td'); }
        tr.style.display = '';
        if (!ic) return null;
        /* ÇOK UZUN LİSTEDE KIRPMA: örnek matrisi 15.000 piksele
           varabiliyor; o boyda bir katmanın saydamlığını canlandırmak
           pahalı. Beliriş süresince yalnız GÖRÜNEN kadarı kırpılır
           (faz2'nin yükseklik perdesiyle aynı ölçü), sonunda serbest
           bırakılır — ekran altı zaten görünmüyor. */
        if (kirp && kirp.getBoundingClientRect().height > window.innerHeight) {
            kirp.dataset.koKirp = '1';
            kirp.style.overflow = 'hidden';
            kirp.style.height = Math.round(window.innerHeight) + 'px';
        }
        ic.style.transition = 'none';
        ic.style.opacity = '0';
        ic.style.transformOrigin = '50% 15%';
        ic.style.transform = 'scale(.955)';
        void ic.offsetHeight;
        return ic;
    }
    function belirBasla(ic, sure) {
        if (!ic) return;
        ic.style.transition = 'opacity ' + klSn(sure) + ' ease-out, transform ' +
                              klSn(sure) + ' ' + KL_EGRI_AC;
        ic.style.opacity = '1';
        ic.style.transform = 'none';
        setTimeout(function () {
            ic.style.transition = ''; ic.style.opacity = '';
            ic.style.transform = ''; ic.style.transformOrigin = '';
            if (ic.dataset && ic.dataset.koKirp) {
                ic.style.overflow = ''; ic.style.height = '';
                delete ic.dataset.koKirp;
            }
        }, sure + 80);
    }
    /* Mücerred KAPANIŞ uçuşu bilerek daha ağır: üç kutu süzülürken göz
       izleyebilsin (Geylani: "o animasyon yavaş olsun"). */
    var SURE_MUC = klSn(KL_MUC_MS) + ' ' + KL_EGRI_AC;  /* mücerred DAHA AĞIR: kutular birlikte uçuyor */
    function mucOdakAc(no) {
        var kutu = tab1Kutu(no);
        var govde1 = document.querySelector('#tab1 table tbody');
        if (!kutu || !govde1) return false;
        babOdagiKapat();                       /* iki odak birlikte duramaz */
        if (kapanan) { (kapanan.zaman || []).forEach(clearTimeout); odakSonlandir(kapanan, true); }
        /* AÇIKKEN BAŞKA MÜCERRED VEZNİNE GEÇİŞ: kapat-aç yok, levha
           yerinde dönüşür, kartlar tazelenir (mezidde "aynı satırda
           geçiş"in karşılığı). */
        if (odak && odak.muc) return mucGecis(no, kutu);
        if (odak) odakKapat(true);
        storSifirla();                        /* stor perde temiz başlasın */

        odakVeriKur(no);

        var tablo = govde1.parentElement;
        var basSatir = tablo.querySelector('thead tr:not(.ko-satir)');
        var sutunSayi = basSatir ? basSatir.children.length : 7;
        /* FİİL KALIPLARINDA (1-16) LEVHAYA BÂBIN ÜÇLÜSÜ ÇIKAR: mazi +
           muzari + emir kutuları birlikte levhada belirir; örnekler
           üçünün altında listelenir. İsim kalıplarında levha tek
           kutudur. */
        var trio = null;
        if (no >= 1 && no <= 16) {
            var bb = babBul(no);
            if (bb) trio = bb.no.slice();
        }
        /* TAKIM (tafdil çifti / cem-i teksir sekizlisi): üyelerin hepsi
           birlikte belirir; örnekler panel panel ayrışır. */
        var takim = (!trio) ? takimBul(no) : null;
        var levhaNolar = trio || (takim ? takim.uyeler.slice() : null) || [no];
        var kutular = levhaNolar.map(tab1Kutu).filter(Boolean);
        if (!kutular.length) kutular = [kutu];
        /* Ev zeminleri kutular YERİNDEYKEN okunur (taşınınca kaybolur) */
        var evTonlar = {};
        kutular.forEach(function (k, i) { evTonlar[levhaNolar[i]] = evZemin(k); });

        var f = document.createElement('tr');
        f.className = 'ko-satir ko-suzgec-satir';
        f.innerHTML = '<td colspan="' + sutunSayi + '"><div class="ko-serit-sar"><div class="ko-serit">' +
            SUZGEC_HTML +
            '<span class="ko-ad" id="klAd"></span>' +
            '</div></div></td>';
        var lv = document.createElement('tr');
        lv.className = 'ko-odak-satir muc-levha-satir';
        lv.innerHTML = '<td colspan="' + sutunSayi + '"><div class="muc-levha"></div></td>';
        var g = document.createElement('tr');
        g.className = 'ko-satir ko-govde-satir';
        g.innerHTML = '<td colspan="' + sutunSayi + '">' +
            '<div class="ko-kaydir"><div class="kl-govde ko-govde" id="klGovde"></div></div></td>';

        /* Tablo satırları ve alttaki cemi/tasğir/tafdil bölümü BİRDEN
           YOK OLMAZ: önce yarım saniyede SOLAR (kutular üstlerinden
           süzülürken arkada beyaz ekran kalmasın), sonra akıştan çıkar.
           DİKKAT: tablonun HTML'inde iç içe yazılmış <tbody> var —
           tarayıcı bunu BİRDEN ÇOK tbody kardeşine çevirir; bu yüzden
           satırlar tek tbody'den değil, tablonun tamamından toplanır. */
        var solacaklar = Array.prototype.slice.call(tablo.querySelectorAll(':scope > tbody > tr'))
            .filter(function (tr) {
                return !tr.classList.contains('ko-satir') && !tr.classList.contains('muc-levha-satir');
            });
        var footerEl = document.querySelector('#tab1 .footer-container');
        /* TABLO AŞAĞI KAYAR, VEZİN YUKARI ÇIKAR — tek, iki yönlü hareket.
           Kayan: TABLONUN KENDİSİ (başlık satırı ve bütün gövde satırları
           içinde) + altbilgi bloğu. Kaymayan: sekmeler ve üst çubuk.
           Solma tek başına yapılırken kutu nereden kalktığı belli
           olmuyordu; tablonun aşağı süzülmesi kutunun yukarı çıkışını
           gözle okunur kılıyor. Hareket 1. vuruşta başlar.

           NEDEN SATIR SATIR DEĞİL, TEK PARÇA:
           Eskiden her <tr> ayrı ayrı ötelenip soluyordu. Bir satıra
           transform verildiği anda tarayıcı o satırı KENDİ KATMANINA
           alıyor ve hücreleri tek tek boyuyor; birleşik kenarlı
           (border-collapse: collapse) bir tabloda bu, duran hâlde
           komşularıyla kaynaşan hücre köşelerinin ayrı ayrı, daha
           yuvarlak görünmesine yol açıyordu (Geylani: "vezinlerin içinde
           bulunduğu konteynırda animasyon sırasında köşeler daha fazla
           yuvarlak oluyor ve tablo aşağı giderken göze çarpıyor... tablo
           aşağı kaymadan önce ve kayarken farklı olmamalı").
           Tablo bir bütün olarak ötelenince içi tam olarak duran hâldeki
           gibi boyanıyor: hiçbir köşe, hiçbir kenar değişmiyor. Üstelik
           tbody'lerin ayrıca soldurulmasına da gerek kalmıyor — tablonun
           zemini de tabloyla birlikte gidiyor (eski "arkada gri plaka
           kalıyor" sorununun kökü de buydu). */
        solacaklar.forEach(function (tr) { tr.dataset.koGizli = '1'; });
        var kayanlar = [tablo];
        if (basSatir) {
            /* CSS, tablo `ko-acik` olur olmaz başlık satırını display:none
               yapıyor — bu yüzden mavi/yeşil dilbilgisi başlıkları bir anda
               yok oluyordu. `ko-bas-kayan` o kuralı geçici olarak deler:
               satır tabloyla birlikte aşağı iner, kayış bitince sınıf
               kalkar ve kural yine devreye girer. */
            basSatir.classList.add('ko-bas-kayan');
        }
        if (footerEl) kayanlar.push(footerEl);

        /* SÜTUN İZLERİNİ ÖNCEDEN SABİTLE — mezidle (odakAc) aynı sebep,
           orada çözülmüştü, burada gözden kaçmıştı:
           tablo `table-layout: fixed`; bu düzende sütun ölçüleri
           TABLONUN İLK SATIRINDAN okunur. Süzgeç şeridini thead'in ilk
           satırı yaptığımız an ölçü tek bir colspan=7 hücreden alınmaya
           başlıyor ve bütün sütunlar EŞİTLENİYORDU (ölçüldü: 140·192·
           192·192·373·192·192 → hepsi 211). Tablo hâlâ ekrandayken
           BABLAR sütunu genişliyor, bâb kutuları 79px yana kayıyordu
           (Geylani: "en sağdaki sütunlar genişliyor ve kutular kayıyor").
           Eskiden kutular FLIP ile eski yerlerine çivilendiği için bu
           kayma görünmüyordu; kutular artık yerinde durduğundan çıplak
           kaldı. colgroup sabit düzende ilk satırdan ÖNCE gelir — ölçüyü
           artık oradan veriyoruz. */
        var eskiCgM = tablo.querySelector('colgroup.ko-sutun');
        if (eskiCgM) eskiCgM.remove();
        var sutunEnM = basSatir
            ? Array.prototype.slice.call(basSatir.children)
                .map(function (h) { return h.getBoundingClientRect().width; })
            : [];
        if (sutunEnM.length) {
            var cgM = document.createElement('colgroup');
            cgM.className = 'ko-sutun';
            sutunEnM.forEach(function (w) {
                var c = document.createElement('col');
                c.style.width = w + 'px';
                cgM.appendChild(c);
            });
            tablo.insertBefore(cgM, tablo.firstChild);
        }

        var bas = tablo.querySelector('thead');
        if (bas) bas.insertBefore(f, bas.firstElementChild);
        else tablo.insertBefore(f, govde1);
        /* LEVHA VE ÖRNEK LİSTESİ AKIŞ DIŞINDA KURULUR. İkisi de baştan
           DOM'a giriyor ama `display:none`: yoksa tablo daha ekrandayken
           altındaki satırları liste boyu (binlerce piksel) aşağı iterdi.
           Tablo çekilince akışa alınır, ölçülür ve yavaşça belirirler. */
        f.style.display = 'none';               /* şerit de akış dışı: bkz. ko-acik notu */
        lv.style.display = 'none';
        g.style.display = 'none';
        govde1.insertBefore(lv, govde1.firstElementChild);

        var yuva = lv.querySelector('.muc-levha');
        if (takim) {
            yuva.classList.add('muc-levha-takim', 'muc-levha-' + takim.ad);
            yuva.style.setProperty('--takim-sutun', takim.sutun);
            lv.classList.add('muc-satir-takim', 'muc-satir-' + takim.ad);
        }
        seritGizle(takim, trio);
        /* Evler ŞİMDİ saklanır (kutular hâlâ yerinde): kapanışta aynen
           geri konurlar. */
        var evler = kutular.map(function (k) {
            return { kutu: k, par: k.parentNode, next: k.nextSibling };
        });
        kutu.classList.add('ko-sec');          /* tıklanan kutu hemen kırmızı olur */
        /* Çarpı en sonda gelir (bkz. son vuruş) */

        odak = { no: no, muc: true, satir: lv, suzgecTr: f, govdeTr: null,
                 govdeHazir: g, kutu: kutu, kutular: kutular, evler: evler,
                 levhaNolar: levhaNolar, evTonlar: evTonlar,
                 origNext: null, zaman: [], levhaHazir: false, bandHazir: false };
        secBoya(odak);                         /* bâbda üç kutu birden kırmızı */

        /* KUTULAR LEVHAYA TABLO ÇEKİLDİKTEN SONRA TAŞINIR.
           Böylece kutular tabloyla birlikte aşağı süzülüp solar (kendi
           hücrelerinde), ekranda delik açılmaz; levhada ise yeni baştan
           belirirler. Bir kez çalışır — hızlı ikinci dokunuşta (mucGecis)
           ya da kapanışta da çağrılabilsin diye durum üzerinde durur. */
        function levhaKur() {
            var st = odak;
            if (!st || !st.muc || st.levhaHazir) return;
            st.levhaHazir = true;
            /* Bâbda levha, matrisle AYNI izlere oturan bir grid: sağda
               kök izi (boş), sonra mazi · muzari · emir. */
            if (trio && !yuva.classList.contains('muc-levha-bab')) {
                yuva.classList.add('muc-levha-bab');
                var izi = document.createElement('span');
                izi.className = 'muc-levha-kok-izi';
                yuva.appendChild(izi);
            }
            kutular.forEach(function (k) {
                yuva.appendChild(k);
                k.classList.add('muc-buyuk');
            });
            /* Satır akışa girsin (görünmez): ölçüler ancak yerleşince
               alınabiliyor — izler, zemin dilimi ve matris hizası. */
            /* Levha akışa girer ve GÖRÜNÜR durur: kutular kopyanın
               dönüşümüyle geleceği için burada solma perdesi yok. Zemin
               şeridi ise sonraki vuruşa bırakılır (bandHazir). */
            lv.style.display = '';
            if (trio) {
                var lvTd0 = lv.querySelector('td');
                var geni = lvTd0 ? lvTd0.clientWidth : 0;
                if (geni) {
                    var kokW0 = Math.min(230, Math.max(150, Math.round(geni * 0.14)));
                    var w0 = Math.max(60, Math.floor((geni - kokW0) / 3));
                    yuva.style.gridTemplateColumns = kokW0 + 'px ' + w0 + 'px ' + w0 + 'px ' + w0 + 'px';
                }
            }
            /* ZEMİN ŞERİDİ: boyanır ama SAYDAM başlar; vezin ona doğru
               yürürken (2. vuruş) yumuşakça beliriyor. Degrade zemin
               canlandırılamadığı için opaklık hücrenin kendisinden
               veriliyor — kutular o sırada zaten görünmez (kopya
               yürüyor), yani yalnız şerit soluyor. */
            /* ZEMİN AYRI BİR KATMAN: şerit soluklanırken kutular
               etkilenmesin diye hücrenin kendisi değil, hücrenin içine
               konan bir kat boyanıyor. Kutular hücrenin İÇİNDE olduğu
               için hücreye opaklık verilseydi başlık da solardı. */
            /* SAYFA ZEMİNİ: degrade artık tablo kutusuyla sınırlı değil,
               pencereye çakılı olarak BÜTÜN SAYFAYI kaplıyor (Geylani).
               Sınıf tablo çekildikten sonra takılıyor, saydam başlıyor;
               vezinler başlığa dönüşürken birlikte beliriyor.
               SINIF, ŞERİT KATI KURULMADAN ÖNCE takılır: sonra takılınca
               kat bir kez opaklık 1 ile hesaplanıyor, ardından kurala
               uyup 0'a geçiyordu — üstte bir an görünüp kaybolan bant
               tam olarak buydu (Geylani: "bi an görünüp kayboluyor"). */
            document.body.classList.add('muc-zemin');
            var lvTdB = lv.querySelector('td');
            if (lvTdB && !lvTdB.querySelector('.muc-levha-zemin')) {
                var zeminEl = document.createElement('div');
                zeminEl.className = 'muc-levha-zemin';
                zeminEl.style.opacity = '0';
                lvTdB.insertBefore(zeminEl, lvTdB.firstChild);
            }
            st.bandHazir = true;
            mucLevhaBoya();
            /* ARA LEVHALI TAKIM (cem-i teksir): örnek listesi ARKA
               PLANDA, kutular daha TABLODAYKEN kurulmuştu; o sırada
               tekilTakimCiz ikinci dörtlüyü ara levhaya indiremedi —
               sekiz kutu da üst levhada kalıyor, iki bandın arasında
               boş bir şerit görünüyordu. Kutular levhaya geldiğine göre
               liste yeniden çizilir: bant dağılımı yerine oturur.
               (Tek bantlı takımlarda ve bâbda gereksiz, çizilmez.) */
            var tkL = takimBul(st.no);
            if (tkL && tkL.uyeler.length > tkL.sutun && st.govdeTr) {
                st.anisizCizim = true;
                govdeCiz();
                st.anisizCizim = false;
            }
        }
        odak.levhaKur = levhaKur;
        /* `ko-acik` ARTIK BAŞTA EKLENMİYOR — TABLO ÇEKİLDİKTEN SONRA.
           Sebebi ölçüldü: `#tab1 .container > table.ko-acik { flex: 0 0 auto }`.
           Tablo normalde kabı dolduran esnek bir öğe; sınıf eklenir
           eklenmez esnemeyi bırakıp doğal boyuna iniyor, satırlar
           105px'ten 78px'e düşüyor (gövde 620 → 462) ve bütün kutular
           yukarı sıçrıyordu. Eskiden kutular FLIP ile çivilendiği için
           bu sıçrama görünmezdi. Sınıf, tablo ekrandan çekildikten
           sonra ekleniyor: artık kimse görmüyor. */
        /* Öteki sekme (mezid) akıştan çıkar: ko-stor pencereyi serbest
           bırakınca kaydırıcı bandı tab2'yi görüş alanının SOLUNA
           (-1455px) taşırıyor; sola taşan içerik tarayıcının boyama
           uzayını kaydırabiliyor. Odak kapanınca sınıf kalkar. */
        document.body.classList.add('muc-odak');
        if (typeof window.kidefUstKilit === 'function') window.kidefUstKilit();

        suzgecBagla(f);
        suzgecCiz();
        adYaz(0);

        /* ============ AÇILIŞ KOREOGRAFİSİ (MÜCERRED) ============
           UÇUŞ YOK — YAVAŞ DÖNÜŞÜM (Geylani: "arkaplanda vezinle ilgili
           liste oluşsun sonra yavaş bi dönüşümle liste görünsün, ama
           kaybolma kısmı aynı kalabilir"):
             1) TABLO ÇEKİLİR — başlık satırı, gövde satırları ve
                altbilgi (kutular da içlerinde) aşağı süzülüp solar.
                Bu bölüm eskisiyle birebir aynı.                (KL_MUC_MS)
             ·  tablo gidince kutular sessizce levhaya taşınır
             2) VEZİN LEVHASI yerinde yavaşça belirir         (KL_MUC_BELIR)
             3) ÖRNEK LİSTESİ yerinde belirir                 (KL_LISTE_MS)
             4) SÜZGEÇ ŞERİDİ iner                            (KL_SERIT_AC)
             5) ÇARPI belirir
           Örnek listesi 1. vuruşun altında, görünmez hâlde ZATEN
           kuruluyor (faz2(anisiz)); 3. vuruşta yalnız belirmesi kalıyor.
           Hiçbir vuruş bir diğeriyle aynı anda başlamaz. */
        var st0 = odak;
        var sar = f.querySelector('.ko-serit-sar');
        var seritYuk = sar.getBoundingClientRect().height;
        /* Mezidle aynı: şerit KAPALI başlar; başlıklar yukarıda kalır,
           levha onların altına oturur, örnekler altta dizilir. Süzgeç
           en sonda açılarak iner ve hepsini birlikte aşağı iter. */
        sar.style.height = '0px';

        /* ARKA PLAN İŞİ: örnek listesi daha tablo ekrandayken kurulur.
           `display:none` olduğu için ne yerleşimi bozar ne de görünür;
           kartların şelale animasyonu da bu sırada sessizce geçer. */
        faz2(true);

        /* 1. VURUŞ — TABLO ÇEKİLİR (kaybolma kısmı: aynen korundu) */
        /* Kayış boyunca kaydırma kilitli: ötelenen satırlar sahte bir
           kaydırma çubuğu doğurup sayfayı sarsmasın. Çubuğun yeri zaten
           tam ekrana geçilirken ayrıldığı için kilit genişliği
           oynatmıyor; tablo çıkınca (aşağıda) kilit kalkar. Kanca
           atlanırsa saat kendiliğinden çözer. */
        cubukKilitle(KL_CUBUK_MS + KL_MUC_MS + 400);
        var kayMesafe = Math.round(window.innerHeight * 0.75);
        odak.zaman.push(setTimeout(function () {
            if (odak !== st0) return;
            /* Kayış BAŞLAMADAN kopyalar çakılır: ölçüler hâlâ tablonun
               kendi yerleşimi (dönüşüm henüz uygulanmadı). */
            st0.cakili = cakiliKur(kutular);
            kayanlar.forEach(function (el) {
                el.style.transition = 'transform ' + klSn(KL_MUC_MS) + ' ' + KL_EGRI_AC +
                                      ', opacity ' + klSn(Math.round(KL_MUC_MS * 0.8)) + ' ease-in';
                el.style.transform = 'translateY(' + kayMesafe + 'px)';
                el.style.opacity = '0';
            });
        }, KL_CUBUK_MS));
        /* Kayma bitince akıştan çıkarlar (yer kaplamasınlar) ve KUTULAR
           LEVHAYA TAŞINIR — ekranda hiçbir şey görünmez: tablo gitti,
           levha henüz saydam. */
        odak.zaman.push(setTimeout(function () {
            if (odak !== st0) return;
            /* SIRA ÖNEMLİ: önce satırlar akıştan çıkar, sonra tablonun
               kendi izleri silinir. Tablo bir bütün olarak ötelendiği
               için, izleri satırlar hâlâ görünürken silinseydi tablo tek
               karede eski yerinde parlardı. İkisi aynı görevde (tek
               karede) olduğundan ekranda hiçbir şey görünmez. */
            solacaklar.forEach(function (tr) {
                if (tr.dataset.koGizli) tr.style.display = 'none';
            });
            /* Sınıf kalkınca CSS kuralı başlık satırını yine gizler */
            tablo.classList.add('ko-acik');     /* artık serbest: tablo ekranda değil */
            if (basSatir) { basSatir.classList.remove('ko-bas-kayan'); basSatir.style.opacity = ''; }
            if (footerEl) {
                footerEl.style.display = 'none';
                footerEl.style.transition = ''; footerEl.style.transform = ''; footerEl.style.opacity = '';
            }
            tablo.style.transition = ''; tablo.style.transform = ''; tablo.style.opacity = '';
            f.style.display = '';                /* süzgeç şeridi akışa girer (yüksekliği 0) */
            /* GÜVENCE: yer normalde tam ekrana geçilirken ayrılıyor
               (ac()). Tam ekran hiç açılmadıysa (izin verilmediyse, ya da
               liste doğrudan KalipListe.ac ile çağrıldıysa) burada
               ayrılır — ekranın boş olduğu tek an burası: tablo gitti,
               levha henüz saydam, görünen tek şey genişlikten
               etkilenmeyen sabit kopyalar. Zaten ayrılmışsa bu çağrı
               hiçbir şeyi değiştirmez. */
            cubukYerAyir();
            levhaKur();
        }, KL_CUBUK_MS + KL_MUC_MS + 60));

        /* 2. VURUŞ — VEZİN LEVHASI YAVAŞÇA BELİRİR */
        odak.zaman.push(setTimeout(function () {
            if (odak !== st0) return;
            levhaKur();                       /* güvence: taşınma atlanmasın */
            mucHizala();                      /* varış ölçüleri kesinleşsin */
            /* Tablodan kalan vezin, listenin başlığına dönüşür. */
            cakiliDonustur(st0, KL_MUC_BELIR, function () {
                var z = st0.satir && st0.satir.querySelector('.muc-levha-zemin');
                if (z) { z.style.transition = ''; z.style.opacity = ''; }
            });
        }, KL_CUBUK_MS + KL_MUC_MS + 60 + KL_MUC_ARA));

        /* 3. VURUŞ — ÖRNEK LİSTESİ BELİRİR. Arka planda kurulmuştu:
           akışa girer, ölçüler alınır, sonra yerinde belirir. */
        odak.zaman.push(setTimeout(function () {
            if (odak !== st0 || !st0.govdeTr) return;
            var ic = belirHazirla(st0.govdeTr);
            mucHizala();                      /* matris izleri: ancak şimdi ölçülebilir */
            mucLevhaBoya();
            /* ARA LEVHADAKİLER: kopyalar varış noktalarında bekliyor;
               asıl kutular altlarında, örneklerle birlikte beliriyor.
               Liste tam görünür olunca kopyalar sessizce siliniyor —
               ikisi üst üste olduğu için ekranda hiçbir şey değişmiyor.
               (Aynı anda biri sönüp öteki belirseydi vezin ortada bir
               parça sönük görünürdü.) */
            /* ARA LEVHADAKİLER (cem-i teksîrin 45-48'i) İSTİSNA: onlar
               listenin İÇİNDE yaşıyor ve liste bu anda hâlâ aşağı doğru
               beliriyor — asıl kutu o kayışa katılıyor, kopya ise varış
               noktasında duruyor. İkisi birden görünür olunca aralarında
               10 px'lik bir fark doğuyor ve vezin bir saniye boyunca ÇİFT
               görünüyordu (Geylani: "45-48. kalıplar iki kopya
               görünüyor"). Onlar kopyalarıyla AYNI ANDA devralıyor:
               aşağıdaki cakiliSil hem kopyayı siliyor hem asılları
               görünür yapıyor, o anda ikisi birebir çakışık. */
            var gvd = st0.govdeTr;
            (st0.kutular || []).forEach(function (k) {
                if (!(gvd && gvd.contains(k))) k.style.visibility = '';
            });
            st0.zaman.push(setTimeout(function () { cakiliSil(st0); }, KL_LISTE_MS + 60));
            belirBasla(ic, KL_LISTE_MS);
        }, KL_CUBUK_MS + KL_MUC_MS + 60 + KL_MUC_ARA + KL_MUC_BELIR + KL_MUC_ARA));

        /* Vuruş takvimi: liste belirişi bittikten sonrası */
        var MUC_LISTE_SON = KL_CUBUK_MS + KL_MUC_MS + 60 + KL_MUC_ARA +
                            KL_MUC_BELIR + KL_MUC_ARA + KL_LISTE_MS;

        /* 4. VURUŞ — liste belirdikten sonra süzgeç iner */
        odak.zaman.push(setTimeout(function () {
            if (odak !== st0) return;
            var h = seritOlc(sar) || seritYuk;
            sar.style.transition = 'height ' + klSn(KL_SERIT_AC) + ' ' + KL_EGRI_AC;
            sar.style.height = h + 'px';
            st0.zaman.push(setTimeout(function () {
                sar.style.transition = ''; sar.style.height = '';
                mucLevhaBoya();
            }, KL_SERIT_AC + 60));
        }, MUC_LISTE_SON + KL_MUC_ARA));

        /* 5. VURUŞ — en son, kapatma çarpısı */
        odak.zaman.push(setTimeout(function () {
            if (odak === st0 && odak.kutu) kapatXKur(odak.kutu);
        }, MUC_LISTE_SON + KL_MUC_ARA + KL_SERIT_AC + 200));

        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
        return true;
    }
    /* ======= ÜST TABLONUN GRİSİ HÜCRELERE DAĞITILIR =======
       Altbilgi bloklarında (cem-i teksir · ism-i tasğir · ism-i tafdil)
       dolgu bloğun KENDİSİNE ait: yuvarlak köşeli, kutuları saran bir
       kart. Mücerred tablosunda ise gri tek bir levhaydı, hücrelerden
       bağımsızdı; köşeleri yuvarlatmak da işe yaramıyordu çünkü levha
       arkadan görünmeye devam ediyordu (Geylani: "gri rengi de aşağıdaki
       tabloda olduğu gibi yapalım, tablo tasarımı yekpare olsun").
       Çözüm: degrade tablonun üstünde duruyor, her hücre ondan KENDİ
       DİLİMİNİ alıyor (boyut = tablonun boyu, konum = hücrenin tabloya
       göre kayması). Görünen renk birebir aynı kalıyor — tek fark,
       dolgu artık hücrenin malı; oluklar ve yuvarlak köşeler beyaz. */
    function ustZeminDilimle() {
        var t1 = document.getElementById('tab1');
        var tablo = t1 && t1.querySelector('.container > table');
        if (!tablo || tablo.classList.contains('ko-acik')) return;
        var rt = tablo.getBoundingClientRect();
        if (!rt.width || !rt.height) return;
        /* Kaynak DEĞİŞKENDEN okunur: degrade hiçbir öğeye boyanmıyor,
           yoksa satırlar aşağı süzülüp gitse bile altta gri bir plaka
           kalıyordu (sağda BABLAR'dan solda zaman-mekân sütununa kadar). */
        var ts = getComputedStyle(tablo);
        var img = (ts.getPropertyValue('--ust-degrade') || '').trim();
        if (!img) img = ts.backgroundImage;
        if (!img || img === 'none') return;
        var boy = Math.round(rt.width) + 'px ' + Math.round(rt.height) + 'px';
        Array.prototype.forEach.call(
            tablo.querySelectorAll(':scope > tbody > tr:not(.ko-satir):not(.muc-levha-satir) > td'),
            function (td) {
                var r = td.getBoundingClientRect();
                if (!r.width || !r.height) return;
                td.style.setProperty('background-image', img, 'important');
                td.style.setProperty('background-size', boy, 'important');
                td.style.setProperty('background-position',
                    Math.round(rt.left - r.left) + 'px ' + Math.round(rt.top - r.top) + 'px', 'important');
            });
    }
    window.addEventListener('resize', function () { ustZeminDilimle(); });
    if (document.readyState === 'complete') setTimeout(ustZeminDilimle, 0);
    else window.addEventListener('load', function () { setTimeout(ustZeminDilimle, 0); });

    /* ================= ÇAKILI VEZİNLER =================
       Tablo aşağı süzülürken TIKLANAN VEZİNLER EKRANDA SABİT KALIR
       (Geylani: "tablo aşağı kayarken ilgili vezinler kaymasa sonra
       dönüşüm efektiyle örnekler açılsa"). Gerçek kutular satırların
       içinde yaşadığı için onlarla birlikte kayıyorlardı; artık
       kutuların bir KOPYASI ekrana çakılı bir katmanda duruyor, asılları
       görünmez oluyor (visibility — display DEĞİL: yer kaplamaya devam
       etsin, tablo kıpırdamasın). Tablo gidince kopyalar sönerken
       levhadaki gerçek kutular beliriyor: vezin yer değiştirmiyor,
       DÖNÜŞÜYOR.
       Kapsam: bâbın üçlüsü, cem-i teksirin sekizlisi, ism-i fâil üçlüsü,
       ism-i âlet · zaman-mekân · ism-i tafdil ikilileri — yani levhaya
       çıkan kutuların hepsi (st.kutular). */
    function cakiliKur(kutular) {
        var kap = document.getElementById('tab1') || document.body;
        var kat = document.createElement('div');
        kat.className = 'muc-cakili';
        /* Ölçüler ÖNCE alınır (kopyalar eklenince yerleşim değişmesin),
           katman sonra sayfaya girer. */
        var yerler = [];
        kutular.forEach(function (k) {
            var r = k.getBoundingClientRect();
            if (r.width && r.height) yerler.push({ k: k, r: r });
        });
        if (!yerler.length) return null;
        kap.appendChild(kat);
        /* KATMANIN KENDİ KÖŞESİNE GÖRE KONUMLANDIR.
           `position: fixed` her zaman pencereye göre değildir: dönüşümü,
           süzgeci ya da will-change'i olan bir ata varsa kapsayan blok o
           olur. Ölçüldü: kopyalar 1387px yana kayıyordu. Katmanın kendi
           dikdörtgenini okuyup farkı yazınca kapsayan blok ne olursa
           olsun doğru yere oturuyor. */
        var kr = kat.getBoundingClientRect();
        yerler.forEach(function (y) {
            var kl = y.k.cloneNode(true);
            kl.removeAttribute('id');
            Array.prototype.forEach.call(kl.querySelectorAll('[id]'), function (e) { e.removeAttribute('id'); });
            kl.classList.add('muc-cakili-kutu');
            /* Konum SATIR İÇİ yazılır: sayfanın kendi `#tab1 .glass-box`
               kuralı position:relative veriyor ve sınıf seçicimizi
               eziyordu — kopyalar normal akıştaki yerlerinden 1387px
               yana düşüyordu (ölçüldü). */
            kl.style.position = 'absolute';
            kl.style.left = Math.round(y.r.left - kr.left) + 'px';
            kl.style.top = Math.round(y.r.top - kr.top) + 'px';
            kl.style.width = Math.round(y.r.width) + 'px';
            kl.style.height = Math.round(y.r.height) + 'px';
            kat.appendChild(kl);
            y.k.style.visibility = 'hidden';
        });
        return kat;
    }
    /* Kopyalar söner, asıllar görünürlüğüne kavuşur. sure verilmezse
       hemen silinir (kapanış / yarıda kesilme). */
    function cakiliSil(st, sure) {
        if (!st) return;
        (st.kutular || []).forEach(function (k) { k.style.visibility = ''; });
        var kat = st.cakili;
        if (!kat) return;
        st.cakili = null;
        if (!sure) { kat.remove(); return; }
        kat.style.setProperty('--muc-cakili-sure', klSn(sure));
        Array.prototype.forEach.call(kat.children, function (e) { e.style.opacity = '0'; });
        setTimeout(function () { kat.remove(); }, sure + 80);
    }

    /* ======== TABLODAKİ VEZİN, LİSTENİN BAŞLIĞINA DÖNÜŞÜR ========
       Örneklerin üstünde AYRI bir başlık kutusu yok: liste başlığı,
       tablodan kalan veznin kendisidir (Geylani: "örnek listelerindeki
       başlıklar olmasın, tablodan kalan vezinler başlıklara dönüşsün").

       NİÇİN ÖLÇEK DEĞİL, GERÇEK BOY? transform: scale() tek katsayıyla
       yapılırsa kutu hedefin boyuna oturmuyor, iki katsayıyla yapılırsa
       yazı eziliyor. Cem-i teksirde fark uçuk: tablodaki kutu 237×53,
       hedefi 170×88 — biri yatık, öteki dikey. Bu yüzden kopyanın kendi
       left/top/width/height'ı, dolgusu ve harflerinin font-size'ı
       canlandırılıyor: kutu da yazı da bozulmadan, hedefin TAM ölçüsüne
       dönüşüyor. Varışta asıl kutu görünür olup kopya siliniyor —
       ikisi bire bir çakıştığı için ekranda hiçbir şey değişmiyor.

       ARA LEVHADAKİLER (cem-i teksirin 45-48'i) listenin İÇİNDE
       oturuyor; liste bu anda henüz akış dışı olduğu için ölçüsü bir an
       akışa alınıp (görünmeden) okunuyor. Onların kopyası varış
       noktasında BEKLER: asıl kutular örneklerle birlikte altlarında
       belirir, kopya en sonda sessizce silinir. */
    function cakiliDonustur(st, sure, bitti) {
        var kat = st && st.cakili;
        var kutular = (st && st.kutular) || [];
        var hucre = st && st.satir && st.satir.querySelector('td');
        var zemin = hucre && hucre.querySelector('.muc-levha-zemin');
        function zeminAc() {
            /* Sayfa zemini ile şerit birlikte, aynı eğride belirir */
            document.body.style.setProperty('--muc-zemin-sure', klSn(sure));
            document.body.classList.add('muc-zemin-ac');
            if (!zemin) return;
            zemin.style.transition = 'opacity ' + klSn(sure) + ' ease-out';
            zemin.style.opacity = '1';
        }
        if (!kat || !kutular.length) { zeminAc(); if (bitti) bitti(); return; }

        /* Gizli listeyi bir an akışa al: ara levhadaki hedefler ölçülsün */
        var gSatir = st.govdeTr;
        var gGizliydi = !!(gSatir && gSatir.style.display === 'none');
        if (gGizliydi) { gSatir.style.visibility = 'hidden'; gSatir.style.display = ''; }

        var kr = kat.getBoundingClientRect();
        var isler = [];
        Array.prototype.forEach.call(kat.children, function (kl, i) {
            var hedef = kutular[i];
            if (!hedef) return;
            var r1 = hedef.getBoundingClientRect();
            if (!r1.width || !r1.height) return;
            var hs = getComputedStyle(hedef);
            var yazi = [];
            var asilY = hedef.querySelectorAll('.ar, .ar-small');
            Array.prototype.forEach.call(kl.querySelectorAll('.ar, .ar-small'), function (e, j) {
                if (asilY[j]) yazi.push({ e: e, boy: getComputedStyle(asilY[j]).fontSize });
            });
            isler.push({
                kl: kl, hedef: hedef, yazi: yazi,
                bekle: gGizliydi && gSatir.contains(hedef),
                l: Math.round(r1.left - kr.left), t: Math.round(r1.top - kr.top),
                w: Math.round(r1.width), h: Math.round(r1.height),
                pad: hs.padding
            });
        });
        if (gGizliydi) { gSatir.style.display = 'none'; gSatir.style.visibility = ''; }

        if (!isler.length) { zeminAc(); cakiliSil(st); if (bitti) bitti(); return; }

        var EGRI = ' ' + KL_EGRI_AC;
        isler.forEach(function (it) {
            it.kl.style.transition = 'left ' + klSn(sure) + EGRI + ', top ' + klSn(sure) + EGRI +
                                     ', width ' + klSn(sure) + EGRI + ', height ' + klSn(sure) + EGRI +
                                     ', padding ' + klSn(sure) + EGRI;
            it.yazi.forEach(function (y) { y.e.style.transition = 'font-size ' + klSn(sure) + EGRI; });
        });
        void kat.offsetHeight;
        isler.forEach(function (it) {
            it.kl.style.left = it.l + 'px';
            it.kl.style.top = it.t + 'px';
            it.kl.style.width = it.w + 'px';
            it.kl.style.height = it.h + 'px';
            it.kl.style.padding = it.pad;
            it.yazi.forEach(function (y) { y.e.style.fontSize = y.boy; });
        });
        zeminAc();

        setTimeout(function () {
            var kalan = 0;
            isler.forEach(function (it) {
                if (it.bekle) { kalan++; return; }
                it.hedef.style.visibility = '';   /* asıl kutu devralır */
                it.kl.remove();
            });
            if (!kalan) cakiliSil(st);
            if (bitti) bitti();
        }, sure + 40);
    }

    /* KIRMIZI SEÇİM — BÂBDA ÜÇÜ BİRDEN.
       Bâb (1-16) tek bir bütün: mazi · muzari · emir birlikte açılıyor,
       örnekler de üçünün altında listeleniyor. Yalnız dokunulan kutuyu
       kırmızıya boyamak "öteki ikisi kapalı" gibi okunuyordu (Geylani:
       "bi fiile tıklayınca üç kutu kırmızı olsun"). İsim kalıplarında
       ve takımlarda seçim yine TEK kutudur: orada örnekler üye üye
       ayrışıyor, hangisinde olduğun ancak kırmızıdan anlaşılıyor. */
    function secBoya(st) {
        if (!st || !st.kutular) return;
        /* BÂBDA üç kutu birlikte kırmızı olurdu; TAKIMLARDA da öyle
           olsun — birine dokunulunca ailenin tamamı seçili görünür
           (ism-i fâil üçlüsü, zaman-mekân, âlet, masdar aileleri…). */
        var hepsi = !!(st.no >= 1 && st.no <= 16 && babBul(st.no)) || !!takimBul(st.no);
        st.kutular.forEach(function (k) {
            k.classList.toggle('ko-sec', hepsi || k === st.kutu);
        });
    }

    function mucGecis(no, yeniKutu) {
        var st = odak;
        /* Açılış animasyonunun ortasında başka vezne dokunulmuş olabilir:
           kutular henüz levhaya taşınmamışsa önce oraya alınır, sonra
           geçiş her zamanki gibi yürür. */
        cakiliSil(st);                        /* geçişte kopya kalmasın */
        if (st.levhaKur) st.levhaKur();
        /* Dönüşüm yarıda kesildiyse zemin şeridi saydam kalmasın */
        var zG = st.satir && st.satir.querySelector('.muc-levha-zemin');
        if (zG) { zG.style.transition = ''; zG.style.opacity = ''; }
        (st.kutular || []).forEach(function (k) {
            k.style.transition = ''; k.style.transform = ''; k.style.transformOrigin = '';
        });
        st.bandHazir = true;
        if (st.govdeTr) { st.govdeTr.style.display = ''; }
        var trio = null;
        if (no >= 1 && no <= 16) {
            var bb = babBul(no);
            if (bb) trio = bb.no.slice();
        }
        var takim = (!trio) ? takimBul(no) : null;
        var yeniNolar = trio || (takim ? takim.uyeler.slice() : null) || [no];
        var ayniKume = !!(st.levhaNolar && st.levhaNolar.join() === yeniNolar.join());
        if (ayniKume) {
            /* Levha aynı küme (bâb üçlüsünde mazi ↔ muzari ↔ emir
               gezinmesi): kutular yerinde durur, yalnız kırmızı seçim ve
               örneklerdeki sütun vurgusu değişir; süzgeç de korunur. */
            if (st.no === no) { faz2(); suzgecCiz(); govdeCiz(); return true; }
            st.no = no; acikNo = no; st.kutu = yeniKutu;
            secBoya(st);
            kapatXKur(yeniKutu);
            faz2();
            govdeCiz();
            if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
            return true;
        }
        /* Küme değişti (başka bâb ya da isim kalıbı): eski kutular evine
           döner, yeniler levhaya gelir — mezidin satır içi geçişi gibi
           beklemesiz. */
        (st.evler || []).forEach(function (ev) {
            ev.kutu.classList.remove('muc-buyuk', 'ko-sec');
            ev.kutu.style.transition = ''; ev.kutu.style.transform = ''; ev.kutu.style.transformOrigin = '';
            if (ev.par) ev.par.insertBefore(ev.kutu,
                (ev.next && ev.next.parentNode === ev.par) ? ev.next : null);
        });
        var yuva = st.satir.querySelector('.muc-levha');
        /* Levha biçimi yeni kümeye göre: bâbda grid + kök izi, takımda
           eşit izler, tekilde ortalanmış tek kutu. */
        yuva.classList.toggle('muc-levha-bab', !!trio);
        yuva.classList.remove('muc-levha-takim');
        st.satir.classList.remove('muc-satir-takim');
        TAKIMLAR.forEach(function (tk) {
            yuva.classList.remove('muc-levha-' + tk.ad);
            st.satir.classList.remove('muc-satir-' + tk.ad);
        });
        if (takim) {
            yuva.classList.add('muc-levha-takim', 'muc-levha-' + takim.ad);
            yuva.style.setProperty('--takim-sutun', takim.sutun);
            st.satir.classList.add('muc-satir-takim', 'muc-satir-' + takim.ad);
        } else {
            yuva.style.removeProperty('--takim-sutun');
        }
        seritGizle(takim, trio);
        var izi = yuva.querySelector('.muc-levha-kok-izi');
        if (trio && !izi) {
            izi = document.createElement('span');
            izi.className = 'muc-levha-kok-izi';
            yuva.insertBefore(izi, yuva.firstChild);
        } else if (!trio && izi) {
            izi.remove();
        }
        if (!trio) yuva.style.gridTemplateColumns = '';
        var kutular = yeniNolar.map(tab1Kutu).filter(Boolean);
        if (!kutular.length) kutular = [yeniKutu];
        st.evTonlar = {};
        kutular.forEach(function (k, i) { st.evTonlar[yeniNolar[i]] = evZemin(k); });
        st.evler = kutular.map(function (k) {
            return { kutu: k, par: k.parentNode, next: k.nextSibling };
        });
        kutular.forEach(function (k) { yuva.appendChild(k); k.classList.add('muc-buyuk'); });
        st.kutular = kutular; st.levhaNolar = yeniNolar;
        st.no = no; st.kutu = yeniKutu;
        secBoya(st);
        kapatXKur(yeniKutu);
        odakVeriKur(no);
        mucLevhaBoya();
        faz2();                               /* animasyon yarım kaldıysa tamamla */
        suzgecCiz(); govdeCiz();
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
        return true;
    }
    /* Kapanış başlarken ara levhadaki kutular üst levhaya geri toplanır
       (FLIP) — sonlandırma hepsini oradan evlerine uçurur. */
    function mucToparla(st) {
        var yuva = st.satir && st.satir.querySelector('.muc-levha');
        if (!yuva) return;
        (st.kutular || []).forEach(function (k) {
            if (k.parentElement === yuva) return;
            var r0 = k.getBoundingClientRect();
            yuva.appendChild(k);
            if (r0.width) kutuSuzul(k, r0, '.5s cubic-bezier(.22,1,.36,1)');
        });
    }
    /* Mücerred kapanışının son adımı: kutu FLIP ile evine döner, satırlar
       geri gelir. odakSonlandir'dan dallanır. */
    function mucSonlandir(st, sessiz) {
        cakiliSil(st);                        /* yarıda kalan kopyalar */
        kapatXSil();
        /* SESSİZ kapanış (vezinden vezne geçiş): ayrılan çubuk yerine
           DOKUNULMAZ — tam ekrandan çıkılmıyor, iki liste arasında tek
           bir sıçrama bile olmasın. Yer, gerçekten çıkılırken
           (tamEkranKapat) bırakılıyor.
           SESLİ kapanışta kilit için güvenlik saati kurulur: aşağıdaki
           kanca herhangi bir sebeple çalışmazsa sayfa kilitli kalmasın. */
        if (!sessiz) cubukSaat(KL_MUC_MS + 900);
        document.body.classList.remove('muc-odak', 'muc-takim', 'muc-takim-ust',
                                       'muc-bab', 'muc-kapaniyor', 'muc-zemin', 'muc-zemin-ac');
        document.body.style.removeProperty('--muc-zemin-sure');
        document.body.style.removeProperty('--kl-panel-yuk');
        document.body.style.removeProperty('--kl-kaydir-yuk');
        var govde1 = st.satir.parentElement;
        var evler = st.evler || [];
        var r0lar = evler.map(function (ev) { return ev.kutu.getBoundingClientRect(); });
        st.suzgecTr.remove();
        if (st.govdeTr) st.govdeTr.remove();
        st.satir.remove();
        evler.forEach(function (ev) {
            ev.kutu.classList.remove('muc-buyuk', 'ko-sec');
            ev.kutu.style.transition = ''; ev.kutu.style.transform = ''; ev.kutu.style.transformOrigin = '';
            if (ev.par) ev.par.insertBefore(ev.kutu,
                (ev.next && ev.next.parentNode === ev.par) ? ev.next : null);
        });
        var footerEl = document.querySelector('#tab1 .footer-container');
        if (govde1) {
            var tablo = govde1.closest('table');
            if (tablo) {
                /* Tablonun BÜTÜN tbody'lerindeki satırlar (iç içe tbody
                   tarayıcıda kardeşlere bölünüyor — açılıştaki notla aynı).
                   Satırlar SOLARAK gizlenmişti: görünürlük ve solma izleri
                   birlikte temizlenir; sesli kapanışta yumuşakça geri
                   belirirler. */
                var geriGelen = [];
                Array.prototype.slice.call(tablo.querySelectorAll(':scope > tbody > tr')).forEach(function (tr) {
                    tr.classList.remove('ko-sonuyor');
                    if (tr.dataset.koGizli) {
                        tr.style.display = '';
                        delete tr.dataset.koGizli;
                        geriGelen.push(tr);
                    }
                });
                /* Mavi/yeşil dilbilgisi başlık satırı: `ko-acik` daha yeni
                   kalktığı için kendiliğinden görünür olur; dönüş kaymasına
                   o da katılsın. */
                /* Yarıda kesilen sönmeler: gövdelerin opaklığı geri gelsin */
                Array.prototype.slice.call(tablo.querySelectorAll(':scope > tbody')).forEach(function (tb) {
                    if (tb.style.opacity || tb.style.transition) {
                        tb.style.transition = ''; tb.style.opacity = '';
                    }
                });
                var basGeri = tablo.querySelector(':scope > thead > tr:not(.ko-satir)');
                if (basGeri) { basGeri.style.display = ''; geriGelen.push(basGeri); }
                tablo.classList.remove('ko-acik');
                /* Sabitlenen sütun izleri kalkar: tablo kendi ölçüsüne döner */
                var cgKapa = tablo.querySelector('colgroup.ko-sutun');
                if (cgKapa) cgKapa.remove();
                /* Açılış kayması yarıda kesilmiş olabilir (tablo yolun
                   ortasındayken kapatıldıysa üstünde transform/opacity
                   izleri kalır) — hem tablonun hem satırların izleri
                   her hâlükârda silinir. */
                tablo.style.transition = ''; tablo.style.opacity = ''; tablo.style.transform = '';
                geriGelen.forEach(function (tr) {
                    tr.style.transition = ''; tr.style.opacity = ''; tr.style.transform = '';
                });
                if (sessiz) {
                    if (footerEl) {
                        footerEl.style.display = ''; footerEl.style.transition = '';
                        footerEl.style.opacity = ''; footerEl.style.transform = '';
                    }
                } else {
                    /* AÇILIŞIN AYNASI: tablo aşağıdan yukarı süzülerek
                       yerine döner; kutular da aynı anda evlerine iner. */
                    /* Liste kalktı, tablo henüz ekran dışında — yani ekran
                       yine boş. Ayrılmış çubuk yeri tam burada bırakılır
                       (görünmeden), dönüş kayması da kilitli geçer:
                       ötelenen satırlar bir daha çubuk doğuramaz. */
                    cubukKilitle(KL_MUC_MS + 400);
                    var geriMesafe = Math.round(window.innerHeight * 0.75);
                    if (footerEl) { footerEl.style.display = ''; }
                    /* AÇILIŞLA AYNI: hareketi TABLO bir bütün olarak yapar,
                       satırlar tek tek katmanlanmaz. Böylece dönüş kayması
                       sırasında da tablo, duran hâlinden birebir aynı
                       görünür — köşeler, kenarlar, hiçbir şey değişmez. */
                    var donenler = [tablo];
                    if (footerEl) donenler.push(footerEl);
                    donenler.forEach(function (el) {
                        el.style.transition = 'none';
                        el.style.transform = 'translateY(' + geriMesafe + 'px)';
                        el.style.opacity = '0';
                    });
                    void tablo.offsetHeight;
                    donenler.forEach(function (el) {
                        el.style.transition = 'transform ' + klSn(KL_MUC_MS) + ' ' + KL_EGRI_AC +
                                              ', opacity ' + klSn(Math.round(KL_MUC_MS * 0.7)) + ' ease-out';
                        el.style.transform = '';
                        el.style.opacity = '1';
                    });
                    setTimeout(function () {
                        donenler.forEach(function (el) {
                            el.style.transition = ''; el.style.opacity = ''; el.style.transform = '';
                        });
                        /* Tablo yerine oturdu: kilit kalkar, sayfa yine
                           kaydırılabilir. Çubuğun AYRILMIŞ YERİ durur —
                           onu tam ekrandan çıkış bırakacak. */
                        cubukYerAyir();
                    }, KL_MUC_MS + 80);
                }
            }
        }
        if (!sessiz) evler.forEach(function (ev, i) {
            if (r0lar[i]) kutuSuzul(ev.kutu, r0lar[i]);
        });
        if (typeof window.kidefUstKilit === 'function') window.kidefUstKilit();
        /* Tablo geri geldi: hücre dilimleri yeni ölçüye göre tazelensin */
        setTimeout(ustZeminDilimle, 60);
        setTimeout(ustZeminDilimle, KL_MUC_MS + 120);
        if (!sessiz && typeof SoundEngine !== 'undefined' && SoundEngine.playClose) SoundEngine.playClose();
    }

    /* ÖRNEKLER AÇIKKEN BÂB ⓘ'Sİ HİÇ ÇALIŞMAZ (Geylani'nin isteği) —
       eskiden örnekleri kapatıp bâb odağına geçiyordu. Gerçek tıklamayı
       CSS kapatıyor (pointer-events); bu sarmal da programatik çağrıyı
       yutuyor. Ters yön duruyor: bâb odağı açıkken vezne basmak odağı
       kapatıp örnekleri açar (odakAc → babOdagiKapat).
       babodak.js bizden ÖNCE yüklendiği için showBabInfo ikinci kez
       sarmalanıyor. */
    (function () {
        var onceki = window.showBabInfo;
        window.showBabInfo = function () {
            if (odak || kapanan) return;       /* örnek listesi açık → yut */
            if (typeof onceki === 'function') return onceki.apply(this, arguments);
        };
    })();

    /* SEKME DEĞİŞİNCE ÖRNEK LİSTESİ KENDİLİĞİNDEN KAPANIR (Geylani'nin
       isteği): mücerred ↔ mezid arasında gezerken açık liste öteki
       sekmede asılı kalıyor, geri dönünce yarım bir düzen karşılıyordu.
       Kapanış SESSİZ: sekme geçişi animasyon beklemesin. setTab hem
       düğmelerden hem kaydırma/tekerlek jestlerinden çağrılıyor;
       sarmalayınca hepsi kapsanıyor. */
    (function () {
        var onceki = window.setTab;
        if (typeof onceki !== 'function') return;
        window.setTab = function () {
            if (odak) odakKapat(true);
            else if (kapanan) { (kapanan.zaman || []).forEach(clearTimeout); odakSonlandir(kapanan, true); }
            else if (perde && perde.classList.contains('acik')) kapat();
            return onceki.apply(this, arguments);
        };
    })();
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && odak) odakKapat();
    });

    /* ---------- 5) TABLOYA BAĞLANMA ----------
       Yakalama (capture) evresinde dinliyoruz ve KÖK SEÇİLİ DEĞİLKEN
       olayı devralıyoruz: böylece kutunun kendi 5 aşamalı döngüsü
       (handleBoxClick) ve .ref'in çekim penceresi hiç tetiklenmiyor.
       Kök seçiliyse hiç karışmıyoruz — eski davranış aynen sürüyor. */
    /* "فعل" GERÇEK BİR KÖK DEĞİL: veznin kendi harfleri. Sayfa ilk üç
       ziyarette onu tanıtım amacıyla kendiliğinden yüklüyor
       (kaliplartablosu.js, fialLoadCount). Öğrenci bir kök seçmiş
       sayılmaz — bu yüzden o da "kök seçilmedi" kabul ediliyor. */
    var NOTR_KOK = 'فعل';
    function kokSecili() {
        if (typeof currentRoot === 'undefined' || !currentRoot) return false;
        if (currentRoot.length !== 3) return false;
        return currentRoot !== NOTR_KOK;
    }
    function numaraOku(kutu) {
        var r = kutu.querySelector('.ref');
        var m = r ? String(r.innerText || r.textContent || '').trim()
                  : String(kutu.getAttribute('data-ref') || '').trim();
        var n = parseInt(m, 10);
        return isFinite(n) ? n : null;                  /* "x" kutusu → null */
    }
    document.addEventListener('click', function (e) {
        if (!e.target || !e.target.closest) return;
        if (e.target.closest('.kl-perde')) return;      /* perdenin kendi tıklamaları */
        /* AYARLARDAKİ "VEZİN ÖRNEK LİSTESİ" ANAHTARI — öntanımlı kapalı.
           Kapalıyken vezne dokunmak listeyi açmıyor; sayfanın kendi kutu
           davranışı (kalıbı açma/katlama) olduğu gibi sürüyor. */
        if (typeof window.kidefOrnekListeAcik === 'function' &&
            !window.kidefOrnekListeAcik()) return;
        /* Odağın kendi satırları dinlenmez — TEK İSTİSNA ara levha:
           teksirin orta dörtlüsü gövde satırında yaşar ama levhadaki
           kardeşleri gibi vezin kutusudur, dokunuşu ona da işler. */
        if (e.target.closest('.ko-satir') && !e.target.closest('.muc-ara-levha')) return;
        var kutu = e.target.closest('.glass-box');
        if (!kutu || kokSecili()) return;
        /* KAPALI KUTUYA İLK DOKUNUŞ AÇAR, LİSTE İKİNCİDE GELİR.
           Mufâ'ale'nin iki mastarından biri (67/68) hep katlı durur;
           sayfanın kendi "merak tıklaması" (sarf/babodak.js) kapalı
           olana basınca ikisini takas ediyor. Bizim dinleyicimiz belge
           düzeyinde ve yakalama evresinde olduğu için ondan ÖNCE
           çalışıyor ve devralıyordu: kalıp hiç görünmeden liste
           açılıyordu. Kutu katlıysa karışmıyoruz — önce vezin açılsın,
           listeyi ikinci dokunuşta veririz. */
        if (kutu.classList.contains('bo-kapali')) {
            /* Takastan SONRA örnek sütunu da yeni mastarı göstersin */
            if (odak) setTimeout(katliTazele, 0);
            return;
        }
        var no = numaraOku(kutu);
        if (no === null) return;
        e.preventDefault();
        e.stopPropagation();
        /* TAM EKRAN GEÇİŞİ SÜRÜYORSA: dokunuş yalnız hedefi değiştirir.
           Kullanıcı beklerken sabırsızlanıp bir daha dokunursa aynı vezin
           iki kez açılmasın; başka bir vezne dokunursa o açılsın. */
        if (bekleyenVarMi()) { bekleyenNo = no; return; }
        /* AÇIK OLAN VEZNE İKİNCİ DOKUNUŞ KAPATIR — bâb ⓘ'siyle aynı dil */
        if (odak && odak.no === no) { odakKapat(); return; }
        ac(no);
    }, true);

    /* ============== STOR PERDE GERİ DÖNÜŞÜ ==============
       Örnek listesinde derine inildikçe üst çubuk (kök levhası +
       mücerred/mezid sekmeleri) yukarı süzülüp gizlenir (ko-stor-sakla).
       GERİ (yukarı) kaydırma başlar başlamaz — bir iki satır sonra —
       üst çubuk, listenin başına dönülmesini BEKLEMEDEN ekrana iner:
       stor perde gibi. ko-stor-yuzer: bar sayfanın başında değilken
       asılı durur; buzlu zemin + gölge alır ki altındaki satırların
       üstünde okunaklı kalsın. */
    var storSonY = 0, storAsagi = 0, storYukari = 0;
    function storSifirla() {
        storAsagi = storYukari = 0;
        storSonY = window.scrollY || 0;
        document.body.classList.remove('ko-stor-sakla', 'ko-stor-yuzer');
        storOlc();
    }
    /* İnen katların yüksekliklerini CSS'e bildir: bar (üst çubuk),
       şerit (Kök Ara klavyesi + Aksâm-ı Seb'a) ve renkli başlıkların
       kayma payları buradan okunur. Şeridin yüksekliği süzgeç çizimine
       göre değişebildiği için her asılma/iniş anında yeniden ölçülür. */
    function storOlc() {
        var tbEl = document.querySelector('.top-bar');
        /* Aynı anda tek odak olur: şerit hangi sekmedeyse orada bulunur */
        var seritTd = document.querySelector('table.ko-acik thead .ko-suzgec-satir > td');
        var barYuk = tbEl ? tbEl.offsetHeight + 2 : 62;
        var seritYuk = seritTd ? seritTd.offsetHeight : 0;
        var bs = document.body.style;
        bs.setProperty('--ko-bar-yuk', barYuk + 'px');
        bs.setProperty('--ko-serit-yuk', (seritYuk + 60) + 'px');      /* gölge payı */
        bs.setProperty('--ko-bas-kayma', (barYuk + seritYuk) + 'px');
        /* Şeridin GÖLGESİZ, gerçek boyu: takım kipinde tablo bu kadar
           yukarı çekilerek şeridin YERİ geri alınıyor. */
        bs.setProperty('--ko-serit-oz', seritYuk + 'px');
        /* MEZİDDE TÜRKÇE BAŞLIK SATIRININ BOYU: odak satırı (ⓘ'den
           ism-i mef'ûle kadar olan Arapça vezinler) tam onun altına
           yapışsın diye eşiği buradan okuyor. */
        var mezBas = document.querySelector('#tab2 table.ko-acik > thead > tr:not(.ko-satir)');
        if (mezBas && mezBas.offsetHeight)
            bs.setProperty('--ko-mez-bas', mezBas.offsetHeight + 'px');
        takimPayOlc();
    }
    window.addEventListener('scroll', function () {
        var b = document.body;
        if (!b.classList.contains('ko-stor')) {
            if (b.classList.contains('ko-stor-sakla') || b.classList.contains('ko-stor-yuzer')) {
                b.classList.remove('ko-stor-sakla', 'ko-stor-yuzer');
            }
            storSonY = window.scrollY || 0;
            return;
        }
        var y = window.scrollY || 0;
        var dy = y - storSonY;
        storSonY = y;
        var yuzerOl = y > 8;
        if (yuzerOl && !b.classList.contains('ko-stor-yuzer')) storOlc();
        b.classList.toggle('ko-stor-yuzer', yuzerOl);
        if (y <= 60) {                 /* başa yaklaşıldı: bar zaten yerinde */
            b.classList.remove('ko-stor-sakla');
            storAsagi = storYukari = 0;
            return;
        }
        if (dy > 0) {                  /* derine iniş: üst çubuk çekilsin */
            storAsagi += dy; storYukari = 0;
            if (storAsagi > 15) b.classList.add('ko-stor-sakla');
        } else if (dy < 0) {           /* geri dönüş: 1-2 satırda katlar insin */
            storYukari -= dy; storAsagi = 0;
            if (storYukari > 80 && b.classList.contains('ko-stor-sakla')) {
                storOlc();             /* iniş anında güncel yükseklikler */
                b.classList.remove('ko-stor-sakla');
            }
        }
    }, { passive: true });

    window.KalipListe = { ac: ac, kapat: kapat, gorunum: gorunum, indeks: indeks,
                          tazele: indeksiTazele, BAB: BAB, MEZID: MEZID };
    /* Üst çubuk kilidi için: örnek listesi (kapanış animasyonu dahil)
       açık mı? babodak'taki ustKilit iki odağı birlikte okuyor. */
    window.KalipOdak = { aktif: function () { return !!(odak || kapanan); } };

    /* ---------- GERİ TUŞU: ÜÇ KADEMELİ ----------
       Geylani: "eğer vezinlerden birinin örnek listesi açılmışsa demek ki
       tam ekrandır, bu geri tuşuna basılınca tam ekrandan çıksın ama örnek
       listelerini kapatmasın; eğer if'âl…istif'âl başlıklarındaki bir
       infoya basılmış ve o satır açılmışsa geri tuşuna basmak infoyu
       kapatma işine yarasın, info kapandıktan sonra bir daha basılırsa
       geri tuşu asıl işlevini yapsın."
         1. basış → örnek listesi açık VE tam ekrandaysak: yalnız tam
            ekrandan çıkılır. Liste olduğu gibi kalır. (Escape ikisini
            birden kapattığı için bu yol gerekiyordu.)
         2. basış → bâb ⓘ odağı açıksa: o kapanır.
         3. basış → tuşun asıl işi: kidefGeri (bir önceki sayfa / anasayfa).
       Dinleyici YAKALAMA aşamasında: bağlantının kendi onclick'i
       (kidefGeriDon) ancak sıra ona gelirse çalışsın diye. Böylece
       kaliplartablosu.html'in HTML'ine hiç dokunmadan davranış eklenir. */
    function tamEkranCikYalniz() {
        if (!TAM_EKRAN_ACIK) return false;   /* tam ekran kapalı: bu aşama yok */
        if (!tamEkranMi()) return false;
        var f = document.exitFullscreen || document.webkitExitFullscreen;
        if (!f) return false;
        tamEkranBiz = false;          /* artık bizim açtığımız sayılmaz */
        try {
            var s = f.call(document);
            if (s && s['catch']) s['catch'](function () { });
        } catch (e) { return false; }
        return true;
    }
    document.addEventListener('click', function (e) {
        var a = (e.target && e.target.closest)
            ? e.target.closest('.back-btn-area a, a.back-link') : null;
        if (!a) return;
        if (a.getAttribute('data-kidef-home')) return;   /* ev tuşu kendi işini yapar */
        /* 1) Örnek listesi açık + tam ekran → yalnız tam ekrandan çık */
        if (window.KalipOdak && window.KalipOdak.aktif() && tamEkranMi()) {
            if (tamEkranCikYalniz()) { e.preventDefault(); e.stopPropagation(); return; }
        }
        /* 2) Bâb ⓘ odağı açık → önce onu kapat */
        if (window.BabOdak && window.BabOdak.aktif && window.BabOdak.aktif()) {
            e.preventDefault(); e.stopPropagation();
            window.BabOdak.kapat();
            return;
        }
        /* 3) Başka bir şey yok → tuş asıl işini yapsın (karışma) */
    }, true);
})();
