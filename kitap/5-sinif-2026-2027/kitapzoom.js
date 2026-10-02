/* ============================================================================
   ORTAK YAKINLAŞTIRMA VE GEZİNME MOTORU            kitapzoom.js   (02.10.2026)
   ----------------------------------------------------------------------------
   BÜTÜN FLIPBOOK'LARDA AYNI DOSYA. Tek kaynağı:
       _kaynak/ortak-kitap/kitapzoom.js
   Oradan betikle (_kaynak/uretici/kitapOrtakla.py) şu kitaplara kopyalanır:
       · Kidef Arapça 2. Baskı  (Mac'teki asıl klasör + sitedeki kopyası)
       · 5. sınıf Arapça 2026-2027
       · 6. sınıf Arapça 2026-2027   (sağdan sola)
   Yeni bir kitap eklenince betiğin listesine yazılır. KİTAP KLASÖRÜNDEKİ
   KOPYAYI ELLE DEĞİŞTİRME — bir sonraki kopyalamada üstüne yazılır.

   Önce Kidef Arapça flipbook'unun uygulama.js'inde satır içi duruyordu; 5. ve
   6. sınıf kitaplarında yalnız basit bir çift tıklama + sürükleme vardı.
   Öğretmen "tasarımsal şeyler tüm flipbooklarda ortak olmalı" dedi (02.10.2026),
   kod buraya çıkarıldı.

   NE YAPAR
   --------
   · Yakınlaştırma %100–%500, imlecin/parmağın olduğu noktaya doğru.
   · ÇİFT SAYFADA 6 BÖLGE: açık iki sayfa 6 bölgeye ayrılır (her sayfada 3
     satır). Bir bölgeye tek dokunuş onu ekranı dolduracak kadar büyütür;
     büyükken tek dokunuş küçültür. Akıllı tahtada en çok işe yarayan özellik.
   · YÖN TUŞLARI (büyükken): ↑↓ sayfa boyunun 1/9'u kadar yumuşak kaydırır,
     sayfanın ucunda okuma sırasına göre öbür sayfaya / sonraki yayılıma geçer.
     ←→ sayfa değiştirir. Boşluk ve PageDown/PageUp da çalışır.
   · TEK SAYFADA (telefon/dikey): çift dokunma ile büyütme, yön tuşlarıyla
     kaydırma.
   · İki parmak pinch, tekerlek, trackpad pinch, sürükleyerek gezinme.

   SAĞDAN SOLA KİTAPLAR (rtl: true)
   --------------------------------
   flip.solSayfa()/sagSayfa() SAYFA NUMARASI mantığına göre çalışıyor: çift
   numara "sol", tek numara "sağ". Sağdan sola kitapta bu EKRANDA TERSİNE
   duruyor (çift numara sağda). Bu yüzden ekrandaki yarı ile sayfa numarası
   arasındaki eşleme ekranSayfa() ile yapılır, okuma sırası da ILK_SAG ile
   belirlenir — ←→ tuşları ekrana göre değil OKUMA SIRASINA göre ilerler
   (flip.js'teki kenara dokunma ve kaydırma da böyle çalışıyor).

   KURULUM
   -------
     var Z = KitapZoom({
       sahne: document.getElementById('sahne'),
       kaydir: document.getElementById('kaydir'),
       flip: flip,                       // Flip örneği
       rtl: true,                        // sağdan sola kitap (varsayılan false)
       panelAcik: function () { return !!acikPanel; },   // isteğe bağlı
       etiket: document.getElementById('zoomEt'),        // "%100"
       bilgi: document.getElementById('zoomBilgi'),      // alttaki ipucu
       yaklas: document.getElementById('tYaklas'),
       uzaklas: document.getElementById('tUzaklas'),
       yoksay: '.nokta'                  // dokunulunca büyütmeyecek öğeler
     });
   Sayfa kendi klavye dinleyicisinde şunu çağırır:
       if (Z.tus(e.key)) { e.preventDefault(); return; }
   Pencere yeniden boyutlanınca:  Z.olcekle();
   ========================================================================== */
(function (kok) {
  'use strict';

  kok.KitapZoom = function (ayar) {
    var sahne = ayar.sahne, kaydir = ayar.kaydir, flip = ayar.flip;
    if (!sahne || !kaydir || !flip) throw new Error('KitapZoom: sahne, kaydir ve flip gerekli');

    /* rtl verilmezse Flip örneğinden okunur (flip.js'teki ayar.rtl). */
    var rtl = (ayar.rtl !== undefined) ? !!ayar.rtl : !!flip.rtl;
    var etiket = ayar.etiket || null;
    var bilgi = ayar.bilgi || null;
    var panelAcik = ayar.panelAcik || function () { return false; };
    /* Dokunulunca bölgeyi büyütmeyecek öğeler: düğmeler, bağlantılar, paneller.
       Kitaplar kendi seçicilerini ekleyebilir. */
    var YOKSAY = (ayar.yoksay ? ayar.yoksay + ',' : '') +
      '.nokta,[data-git],.html-sayfa a,button,a,input,select,.panel';

    var ENAZ = 1, ENCOK = ayar.encok || 5;
    var z = { o: 1, x: 0, y: 0 };

    /* --------------------------------------------------------------
       1) TEMEL: uygula / sınırla / ayarla
       -------------------------------------------------------------- */
    function zUygula(animasyonlu, yumusak) {
      kaydir.classList.toggle('serbest', !animasyonlu);
      kaydir.classList.toggle('yumusak', !!yumusak);     // yön tuşlarıyla ince kaydırma
      kaydir.style.transform = z.o === 1 && !z.x && !z.y
        ? '' : 'translate(' + z.x + 'px,' + z.y + 'px) scale(' + z.o + ')';
      var y = '%' + Math.round(z.o * 100);
      if (etiket) etiket.textContent = y;
      if (bilgi) {
        bilgi.textContent = y + ' — sürükleyerek gezin, ' +
          (flip.tekli ? 'çift dokunarak çık' : 'yön tuşlarıyla geç, dokununca küçülür');
        bilgi.classList.toggle('gor', z.o > 1.02);
      }
      sahne.classList.toggle('yakin', z.o > 1.02);
      flip.kilitli = z.o > 1.02 || !!panelAcik();
    }

    function sinirla() {
      if (z.o <= 1.001) { z.x = 0; z.y = 0; return; }
      var r = sahne.getBoundingClientRect();
      var mx = (r.width * (z.o - 1)) / 2, my = (r.height * (z.o - 1)) / 2;
      z.x = Math.max(-mx, Math.min(mx, z.x));
      z.y = Math.max(-my, Math.min(my, z.y));
    }

    /* yeni oran; mx,my verilirse O NOKTA sabit kalacak şekilde büyütür */
    function zAyarla(yeni, mx, my) {
      yeni = Math.max(ENAZ, Math.min(ENCOK, yeni));
      var r = sahne.getBoundingClientRect();
      if (mx == null) { mx = r.width / 2; my = r.height / 2; }
      var kx = mx - r.width / 2, ky = my - r.height / 2;
      var k = yeni / z.o;
      z.x = kx - (kx - z.x) * k;
      z.y = ky - (ky - z.y) * k;
      z.o = yeni;
      sinirla();
      zUygula(true);
    }

    if (ayar.yaklas) ayar.yaklas.addEventListener('click', function () { zAyarla(z.o * 1.5); });
    if (ayar.uzaklas) ayar.uzaklas.addEventListener('click', function () { zAyarla(z.o / 1.5); });

    /* tekerlek / trackpad pinch */
    sahne.addEventListener('wheel', function (e) {
      if (!(e.ctrlKey || e.metaKey) && z.o <= 1.001) return;
      e.preventDefault();
      var r = sahne.getBoundingClientRect();
      var k = (e.ctrlKey || e.metaKey) ? Math.exp(-e.deltaY / 220) : Math.exp(-e.deltaY / 500);
      zAyarla(z.o * k, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });

    /* --------------------------------------------------------------
       2) ÇİFT SAYFADA 6 BÖLGE — DOKUN, BÜYÜT
       -------------------------------------------------------------- */
    var BOLGE_SATIR = 3;
    /* Ekranın sağ/sol yarısındaki sayfa numarası. Sağdan sola kitapta
       flip'in "sol"u ekranın sağında durur. */
    function ekranSayfa(sagMi) {
      return (sagMi !== rtl) ? flip.sagSayfa() : flip.solSayfa();
    }
    /* Okuma sırasında ÖNCE gelen sayfa ekranın sağında mı? (rtl'de evet) */
    var ILK_SAG = rtl;

    var bolgeDokun = null;
    function bolgeHedefi(e) {
      if (e.target.closest(YOKSAY)) return null;
      var kitap = sahne.querySelector('.kitap');
      if (!kitap) return null;
      var kr = kitap.getBoundingClientRect();            // ekrandaki (o anki zoom'lu) kitap
      if (e.clientX < kr.left || e.clientX > kr.right ||
          e.clientY < kr.top || e.clientY > kr.bottom) return null;
      var sag = e.clientX >= kr.left + kr.width / 2;
      if (ekranSayfa(sag) == null) return null;          // o yarıda sayfa yok (kapak / son yaprak)
      var satir = Math.min(BOLGE_SATIR - 1,
        Math.floor((e.clientY - kr.top) / (kr.height / BOLGE_SATIR)));
      return { sag: sag, satir: satir };
    }

    /* Kitabın zoom'suz (1x) dikdörtgeni, sahneye göre.
       DİKKAT: getBoundingClientRect kullanılmaz — zoom geçişi sürerken o anki
       (eski) konumu verir, art arda tuşa basınca hesap kayar. Yerleşim
       (offset*) değerleri transform'dan bağımsızdır. */
    function kitap1x() {
      var kt = sahne.querySelector('.kitap');
      return { x: kaydir.offsetLeft + kt.offsetLeft, y: kaydir.offsetTop + kt.offsetTop,
        en: kt.offsetWidth, boy: kt.offsetHeight, w: sahne.clientWidth, h: sahne.clientHeight };
    }

    function bolgeyiBuyut(h) {
      var k = kitap1x(), en = k.en / 2;
      var bx = k.x + (h.sag ? en : 0), by = k.y + h.satir * k.boy / BOLGE_SATIR;
      var bEn = en, bBoy = k.boy / BOLGE_SATIR;
      var o = Math.min(ENCOK, Math.min(k.w / bEn, k.h / bBoy) * 0.98);
      var cx = bx + bEn / 2 - k.w / 2, cy = by + bBoy / 2 - k.h / 2;
      z.o = o; z.x = -cx * o; z.y = -cy * o;
      sinirla(); zUygula(true);
    }

    /* Ekranın ortasında hangi bölge duruyor (zoom'luyken) */
    function ortadakiBolge() {
      var k = kitap1x();
      var px = k.w / 2 - z.x / z.o, py = k.h / 2 - z.y / z.o;
      var sag = px >= k.x + k.en / 2;
      var satir = Math.max(0, Math.min(BOLGE_SATIR - 1,
        Math.floor((py - k.y) / (k.boy / BOLGE_SATIR))));
      return { sag: sag, satir: satir };
    }

    /* önceki/sonraki iki sayfaya animasyonsuz geç */
    function cifteGec(ileri) {
      if (ileri) { if (!flip._ilerisiVar()) return false; flip.git(2 * (flip.c + 1)); }
      else { if (flip.c <= 0) return false; flip.git(flip.c - 1 === 0 ? 1 : 2 * (flip.c - 1)); }
      return true;
    }

    /* ↑↓ ince adım: sayfa boyunun 1/9'u kadar yumuşak kaydırır.
       Sayfanın ucuna gelmişsek false döner → bir üst kat (bolgeGez) sayfa değiştirir. */
    var DIKEY_ADIM = 9;
    function dikeyKay(yon) {
      var k = kitap1x();
      var gor = k.h / z.o;                                    // ekranda görünen yükseklik (1x birimi)
      var py = k.h / 2 - z.y / z.o;                           // ekran ortasının sayfadaki yeri
      var ust = k.y + gor / 2, alt = k.y + k.boy - gor / 2;   // sayfadan taşmadan gidilebilecek uçlar
      if (alt < ust) return false;
      if (yon === 'asagi' ? py >= alt - 2 : py <= ust + 2) return false;
      var yeni = Math.max(ust, Math.min(alt, py + (yon === 'asagi' ? 1 : -1) * k.boy / DIKEY_ADIM));
      z.y = (k.h / 2 - yeni) * z.o;
      zUygula(true, true);
      return true;
    }

    /* Okuma sırasında bir sonraki / önceki sayfaya geç (yayılım içinde ya da
       yeni yayılıma). Döndürdüğü hedef bolgeyiBuyut'a verilir. */
    function sayfaAdimi(ileri, satir) {
      var h = ortadakiBolge(), S = BOLGE_SATIR - 1;
      if (ileri) {
        if (h.sag === ILK_SAG && ekranSayfa(!ILK_SAG) != null) { h.sag = !ILK_SAG; h.satir = 0; }
        else if (cifteGec(true)) { h.sag = ILK_SAG; h.satir = 0; }
        else return null;
      } else {
        if (h.sag !== ILK_SAG && ekranSayfa(ILK_SAG) != null) { h.sag = ILK_SAG; h.satir = S; }
        else if (cifteGec(false)) { h.sag = ekranSayfa(!ILK_SAG) != null ? !ILK_SAG : ILK_SAG; h.satir = S; }
        else return null;
      }
      if (satir != null) h.satir = satir;
      /* kapak (bir yarı boş) düzeltmesi */
      if (ekranSayfa(h.sag) == null) h.sag = !h.sag;
      if (ekranSayfa(h.sag) == null) return null;
      return h;
    }

    function bolgeGez(yon) {
      /* ↑↓ önce aynı sayfada ince kaydırmayı dener */
      if ((yon === 'asagi' || yon === 'yukari') && dikeyKay(yon)) return;

      var S = BOLGE_SATIR - 1, h;
      if (yon === 'asagi' || yon === 'yukari') {
        h = ortadakiBolge();
        h.satir = (yon === 'asagi') ? S : 0;          // uçtayız
        if (yon === 'asagi' && h.satir < S) { h.satir++; }
        else if (yon === 'yukari' && h.satir > 0) { h.satir--; }
        else { h = sayfaAdimi(yon === 'asagi', yon === 'asagi' ? 0 : S); if (!h) return; }
      } else {
        /* ←→ EKRANA göre değil OKUMA SIRASINA göre: sağdan sola kitapta
           sol tuşu ileri götürür (flip.js'teki kenara dokunma da böyle). */
        var ileri = rtl ? (yon === 'sol') : (yon === 'sag');
        h = sayfaAdimi(ileri, null);
        if (!h) return;
      }
      bolgeyiBuyut(h);
      if (yon === 'asagi' || yon === 'yukari') {      // yeni sayfanın tam üstüne / altına otur
        var k = kitap1x(), gor = k.h / z.o;
        var py = yon === 'asagi' ? k.y + gor / 2 : k.y + k.boy - gor / 2;
        z.y = (k.h / 2 - py) * z.o;
        zUygula(true, true);
      }
    }

    /* tek sayfa modunda zoom'luyken yön tuşları kaydırır */
    function zKaydir(dx, dy) {
      var r = sahne.getBoundingClientRect();
      z.x -= dx * r.width * 0.35; z.y -= dy * r.height * 0.35;
      sinirla(); zUygula(true);
    }

    /* zoom'luyken yön tuşu yakalanırsa true döner (sayfa kendi işini yapmasın) */
    function zoomTusu(k) {
      if (z.o <= 1.02) return false;
      var yon = { ArrowDown: 'asagi', ArrowUp: 'yukari', ArrowRight: 'sag', ArrowLeft: 'sol',
        PageDown: 'asagi', ' ': 'asagi', PageUp: 'yukari' }[k];
      if (!yon) return false;
      if (flip.tekli) {
        if (k === 'ArrowDown' || k === 'PageDown' || k === ' ') zKaydir(0, 1);
        else if (k === 'ArrowUp' || k === 'PageUp') zKaydir(0, -1);
        else zKaydir(k === 'ArrowRight' ? 1 : -1, 0);
      } else bolgeGez(yon);
      return true;
    }

    /* bölgeye dokunma */
    sahne.addEventListener('pointerdown', function (e) {
      if (flip.tekli || panelAcik() || e.button > 0) { bolgeDokun = null; return; }
      bolgeDokun = { x: e.clientX, y: e.clientY, t: Date.now(), h: bolgeHedefi(e) };
    });
    kok.addEventListener('pointerup', function (e) {
      var d = bolgeDokun; bolgeDokun = null;
      if (!d || flip.tekli || panelAcik()) return;
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10 || Date.now() - d.t > 600) return; // sürükleme
      if (z.o > 1.02) { if (!e.target.closest(YOKSAY)) zAyarla(1); return; }
      if (d.h) bolgeyiBuyut(d.h);
    });

    /* --------------------------------------------------------------
       3) TEK SAYFA: çift tıklama / çift dokunma
       Kaydırma ya da sürükleme çift dokunma sayılmaz: telefonda art arda iki
       hızlı sayfa kaydırma yakınlaştırmayı açmasın. İki dokunuş aynı yere
       düşmeli.
       -------------------------------------------------------------- */
    var sonDokunma = 0, dokunmaYer = null;
    kok.addEventListener('pointerup', function (e) {
      if (dokunmaYer && Math.hypot(e.clientX - dokunmaYer.x, e.clientY - dokunmaYer.y) > 12) sonDokunma = 0;
    });
    sahne.addEventListener('pointerdown', function (e) {
      if (!flip.tekli) return;                 // çift sayfada 6 bölge kullanılır
      if (e.target.closest(YOKSAY)) return;
      var t = Date.now();
      var yakin = dokunmaYer && Math.hypot(e.clientX - dokunmaYer.x, e.clientY - dokunmaYer.y) < 40;
      dokunmaYer = { x: e.clientX, y: e.clientY };
      if (t - sonDokunma < 320 && yakin) {
        var r = sahne.getBoundingClientRect();
        if (z.o > 1.02) zAyarla(1);
        else zAyarla(2.4, e.clientX - r.left, e.clientY - r.top);
        sonDokunma = 0;
        return;
      }
      sonDokunma = t;
    });

    /* --------------------------------------------------------------
       4) Sürükleyerek gezinme (zoom'luyken)
       -------------------------------------------------------------- */
    var pan = null;
    sahne.addEventListener('pointerdown', function (e) {
      if (z.o <= 1.02) return;
      if (e.target.closest(YOKSAY)) return;
      pan = { x: e.clientX, y: e.clientY, zx: z.x, zy: z.y };
      sahne.style.cursor = 'grabbing';
    });
    kok.addEventListener('pointermove', function (e) {
      if (!pan) return;
      z.x = pan.zx + (e.clientX - pan.x);
      z.y = pan.zy + (e.clientY - pan.y);
      sinirla(); zUygula(false);
    });
    kok.addEventListener('pointerup', function () { pan = null; sahne.style.cursor = ''; });

    /* --------------------------------------------------------------
       5) İki parmak pinch (dokunmatik)
       -------------------------------------------------------------- */
    var pinch = null;
    sahne.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) {
        var a = e.touches[0], b = e.touches[1];
        pinch = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), o: z.o };
      }
    }, { passive: true });
    sahne.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2 && pinch) {
        e.preventDefault();
        var a = e.touches[0], b = e.touches[1];
        var d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        var r = sahne.getBoundingClientRect();
        zAyarla(pinch.o * (d / pinch.d),
          (a.clientX + b.clientX) / 2 - r.left, (a.clientY + b.clientY) / 2 - r.top);
      }
    }, { passive: false });
    sahne.addEventListener('touchend', function (e) { if (e.touches.length < 2) pinch = null; }, { passive: true });

    zUygula(false);

    /* --------------------------------------------------------------
       DIŞARIYA AÇILAN
       -------------------------------------------------------------- */
    return {
      oran: function () { return z.o; },
      ayarla: zAyarla,
      sifirla: function () { zAyarla(1); },
      tus: zoomTusu,
      uygula: zUygula,
      olcekle: function () { sinirla(); zUygula(false); }
    };
  };
})(window);
