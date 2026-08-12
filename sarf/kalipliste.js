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
        { k: 'Lefif',  ad: 'Lefîf',  grup: 'mutel', kisa: 'İKİ illetli.',       ornek: 'طَوَى',
          ip: 'İki harfi birden illetli (طَوَى · وَقَى)' }
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

        var kok = document.createElement('button');
        kok.type = 'button';
        kok.className = 'kl-sema-kok' + (suzgec.deger ? '' : ' kl-sema-secili');
        kok.title = 'Süzgeci kaldır';
        kok.innerHTML = '<span>Hepsi</span><b>' + tumler.length + '</b>';
        kok.addEventListener('click', function () { sec(null, 'aksam'); });
        kap.appendChild(kok);

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
        if (Math.abs(basla - bitis) < 1) { sar.style.transition = ''; return; }
        sar.style.height = basla + 'px';
        void sar.offsetHeight;
        sar.style.transition = 'height ' + SURE_SUZGEC;
        sar.style.height = bitis + 'px';
        clearTimeout(seritYumusat._z);
        seritYumusat._z = setTimeout(function () {
            sar.style.transition = ''; sar.style.height = '';
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

    function tekilCiz(yuva, ler) {
        var g = document.createElement('div');
        g.className = 'kl-izgara';                      /* 4 sütun (CSS) */
        ler.forEach(function (x) { g.appendChild(kelimeKarti(x)); });
        yuva.appendChild(g);
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
        /* Tablo içi odakta ÜSTTEKİ vezin satırı zaten başlıktır; matrisin
           kendi başlığı aynı şeyi ikinci kez söylerdi. */
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
        var kademe = odak ? 12 : 0;
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
                tr.style.animationDelay = (g.children.length * 55) + 'ms';
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
    function tonYaz() {
        var no = (acikGor.kip === 'tekil')
            ? acikNo
            : (Array.isArray(acikGor.sutun[0]) ? acikGor.sutun[0][0] : acikGor.sutun[0]);
        var t = satirTonu(no);
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
        var ad = (acikGor.kip === 'tekil') ? (bilgi.tr || 'Kalıp') : acikGor.ad;
        /* Süzgeç açıkken "12 / 64" — bütünün neresindeyiz belli olsun */
        var sayi = suzgec.deger ? (n + ' / ' + tumler.length) : String(tumler.length);
        var el = document.getElementById('klAd');
        if (el) el.textContent = ad + (tumler.length ? ' · ' + sayi + ' ' + birim : '');
    }
    function govdeCiz() {
        var yuva = document.getElementById('klGovde');
        if (!yuva) return 0;
        yuva.innerHTML = '';
        tonYaz();
        var ler = suz(tumler);
        var n = 0;
        if (!ler.length) yuva.innerHTML = '<p class="kl-bos">' + bosMetin() + '</p>';
        else n = (acikGor.kip === 'tekil')
            ? tekilCiz(yuva, ler)
            : matrisCiz(yuva, acikGor, acikNo, ler);
        yuva.scrollTop = 0;
        /* Tablo içi odakta örnek sütunları ÜSTTEKİ vezin satırıyla
           hizalanır — ölçü her çizimde yeniden alınır. */
        if (odak) sutunlariHizala();
        adYaz(n);
        return n;
    }

    function ac(no) {
        no = parseInt(no, 10);
        if (!isFinite(no)) return false;
        /* SÜLÂSÎ MEZİD (52-105): perde yok, liste tablonun içinde açılır.
           Mücerred (1-51) şimdilik perdede — sırayla taşınacak. */
        if (no >= 52 && no <= 105 && tab2Kutu(no)) return odakAc(no);
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
    function kaydirTr(row, eskiTop) {
        var delta = eskiTop - row.getBoundingClientRect().top;
        if (!delta) return;
        row.style.transition = 'none';
        row.style.transform = 'translateY(' + delta + 'px)';
        void row.offsetHeight;
        row.style.transition = 'transform 1s cubic-bezier(.22,1,.36,1)';
        row.style.transform = '';
        var bitis = function () {
            row.style.transition = ''; row.style.transform = '';
            row.removeEventListener('transitionend', bitis);
        };
        row.addEventListener('transitionend', bitis);
    }
    /* Örnek matrisinin sütunları ÜSTTEKİ satırdan ölçülür. Elle genişlik
       yazsaydık tablo yeniden düzenlendiğinde hizalama sessizce kayardı. */
    function sutunlariHizala() {
        if (!odak || !odak.satir) return;
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
        tumler = satirlar(acikGor);
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
            odakVeriKur(no);
            faz2();                           /* animasyon yarım kaldıysa tamamla */
            suzgecCiz(); govdeCiz();
            if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
            return true;
        }
        if (odak) odakKapat(true);

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
        satir.classList.add('ko-odak-satir');
        kutu.classList.add('ko-sec');
        govde2.closest('table').classList.add('ko-acik');
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
        var sar = f.querySelector('.ko-serit-sar');
        var seritYuk = sar.getBoundingClientRect().height;
        var sonTop = satir.getBoundingClientRect().top;
        sar.style.height = '0px';
        satir.style.transition = 'none';
        satir.style.transform = 'translateY(' + (eskiTop - (sonTop - seritYuk)) + 'px)';
        void satir.offsetHeight;
        /* Süre ve eğri bâb odağından okunuyor (window.BO_SURE) —
           ⓘ'ye basınca satır nasıl süzülüyorsa burada da öyle. */
        var SURE = (typeof window.BO_SURE === 'string') ? window.BO_SURE : '1s cubic-bezier(.22,1,.36,1)';
        sar.style.transition = 'height ' + SURE;
        sar.style.height = seritYuk + 'px';
        satir.style.transition = 'transform ' + SURE;
        satir.style.transform = '';
        f.classList.add('ko-belir');
        odak.zaman.push(setTimeout(function () {
            sar.style.transition = ''; sar.style.height = '';
            satir.style.transition = ''; satir.style.transform = '';
        }, 1040));

        /* ---- FAZ 2: veznin altı boşalır, sonra örnekler belirir ---- */
        odak.zaman.push(setTimeout(function () { faz2(); }, 1020));

        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
        return true;
    }

    /* FAZ 2: satır yukarı süzülüp yerine oturduktan SONRA örnekler
       beliriyor. Yarım kalmışsa doğrudan çağrılabilir (hızlı ikinci
       tıklamada liste eksik kalmasın). */
    function faz2() {
        if (!odak || odak.govdeTr) return;
        var st = odak, govde2 = st.satir.parentElement;
        if (!govde2) return;
        govde2.insertBefore(st.govdeHazir, st.satir.nextSibling);
        st.govdeTr = st.govdeHazir;
        govdeCiz();
        /* Liste YÜKSEKLİKLE açılıyor: aşağı doğru yumuşakça iniyor,
           satırlar da sırayla beliriyor. Eski .ko-belir tek karede
           yukarıdan düşürüyordu. */
        var kap = st.govdeTr.querySelector('.ko-kaydir');
        if (!kap) return;
        var hedef = kap.getBoundingClientRect().height;
        kap.style.overflow = 'hidden';
        kap.style.height = '0px';
        void kap.offsetHeight;
        kap.style.transition = 'height .8s cubic-bezier(.33,1,.68,1)';
        kap.style.height = hedef + 'px';
        st.zaman.push(setTimeout(function () {
            kap.style.transition = ''; kap.style.height = ''; kap.style.overflow = '';
        }, 860));
    }

    /* Kapanışın SON adımı: DOM eski hâline döner. Animasyonun sonunda ya
       da (sessiz kapanışta) doğrudan çağrılır. Bir kez çalışır. */
    var kapanan = null;
    function odakSonlandir(st, sessiz) {
        if (st.bitti) return;
        st.bitti = true;
        if (kapanan === st) kapanan = null;
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
            kaydirTr(st.satir, eskiTop);
        }
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
        if (sessiz) { odakSonlandir(st, true); return; }
        kapanan = st;
        var sar = st.suzgecTr.querySelector('.ko-serit-sar');
        var kap = st.govdeTr && st.govdeTr.querySelector('.ko-kaydir');
        var EGRI = 'cubic-bezier(.33,1,.68,1)';
        var A = 500, B = 600;
        if (sar) {
            sar.style.height = sar.getBoundingClientRect().height + 'px';
            void sar.offsetHeight;
            sar.style.transition = 'height .5s ' + EGRI;
            sar.style.height = '0px';
        }
        st.zaman.push(setTimeout(function () {
            if (st.bitti) return;
            if (kap) {
                kap.style.overflow = 'hidden';
                kap.style.height = kap.getBoundingClientRect().height + 'px';
                void kap.offsetHeight;
                kap.style.transition = 'height .6s ' + EGRI;
                kap.style.height = '0px';
            }
            st.zaman.push(setTimeout(function () { odakSonlandir(st, false); }, kap ? B + 40 : 0));
        }, sar ? A + 30 : 0));
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
        if (e.target.closest('.ko-satir')) return;      /* odağın kendi satırları */
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
        /* AÇIK OLAN VEZNE İKİNCİ DOKUNUŞ KAPATIR — bâb ⓘ'siyle aynı dil */
        if (odak && odak.no === no) { odakKapat(); return; }
        ac(no);
    }, true);

    window.KalipListe = { ac: ac, kapat: kapat, gorunum: gorunum, indeks: indeks,
                          tazele: indeksiTazele, BAB: BAB, MEZID: MEZID };
    /* Üst çubuk kilidi için: örnek listesi (kapanış animasyonu dahil)
       açık mı? babodak'taki ustKilit iki odağı birlikte okuyor. */
    window.KalipOdak = { aktif: function () { return !!(odak || kapanan); } };
})();
