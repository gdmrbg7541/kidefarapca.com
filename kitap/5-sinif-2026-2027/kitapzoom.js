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
   · YÖN TUŞLARI (büyükken): ↑↓ sayfa boyunun 1/5'i kadar yumuşak kaydırır,
     sayfanın ucunda okuma sırasına göre öbür sayfaya / sonraki yayılıma geçer.
     ←→ sayfa değiştirir. Boşluk ve PageDown/PageUp da çalışır.
   · TEK SAYFADA (telefon/dikey) DA 6 BÖLGE (17.10.2026): sayfa 2 sütun ×
     3 satır; bölgeye tek dokunuş büyütür, tekrar dokunuş küçültür. Yön
     tuşlarıyla kaydırma.
   · ÇİFT TIKLAMA GÜVENCESİ (17.10.2026): büyütme/küçültmeden sonra 0,35 sn
     içinde gelen dokunuş yok sayılır; çift tıklama büyütmeyi geri almaz.
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
          (flip.tekli ? 'dokununca küçülür' : 'yön tuşlarıyla geç, dokununca küçülür');
        bilgi.classList.toggle('gor', z.o > 1.02);
      }
      sahne.classList.toggle('yakin', z.o > 1.02);
      flip.kilitli = z.o > 1.02 || !!panelAcik() || tanitimAcik;
      oklariGuncelle();
    }

    /* --------------------------------------------------------------
       DİKEY GEZİNME OKLARI (08.10.2026)
       Öğretmen: "bir kere dokununca büyüme gerçekleşiyor ya; aşağı ve
       yukarıda hafif saydam aşağı-yukarı ok görünsün, kademeli 9 adımda
       sayfada dikey hareket okla yapılabilsin."
       Yakınlaştırma yokken oklar gizli; büyütülünce beliriyorlar.
       Tıklama ↑/↓ tuşlarının AYNI yolundan geçiyor (zoomTusu): tek ve
       çift sayfa kipinde davranış birebir aynı olsun, ayrıca sayfanın
       ucuna gelince kendiliğinden sonraki sayfaya geçsin.
       Adım boyu DIKEY_ADIM: sayfa yüksekliğinin 1/5'i (20.10.2026, öğretmen:
       "flipbook motorunda aşağı yukarı 9 kademeydi ya onu 5 kademeye düşür"). */
    var okUst = null, okAlt = null;
    function oklariGuncelle() {
      var gor = z.o > 1.02;
      if (okUst) {
        okUst.classList.toggle('gor', gor);
        okUst.classList.toggle('pasif', gor && !dikeyGidebilir('yukari'));
      }
      if (okAlt) {
        okAlt.classList.toggle('gor', gor);
        okAlt.classList.toggle('pasif', gor && !dikeyGidebilir('asagi'));
      }
    }
    (function dikeyOklar() {
      if (!sahne) return;
      var yap = function (yon) {
        var yukari = (yon === 'yukari');
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'zOk zOk-' + yon;
        d.setAttribute('aria-label', yukari ? 'Yukarı kaydır' : 'Aşağı kaydır');
        d.title = yukari ? 'Yukarı (↑)' : 'Aşağı (↓)';
        d.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' +
          (yukari ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6') +
          '" fill="none" stroke="currentColor" stroke-width="2.6"' +
          ' stroke-linecap="round" stroke-linejoin="round"/></svg>';
        d.addEventListener('click', function (e) {
          e.preventDefault(); e.stopPropagation();
          /* YALNIZ DİKEY KAYDIRMA: ↑/↓ tuşları sayfanın ucunda bölge
             büyütmeye geçip yakınlaştırma oranını da değiştiriyor; okun
             işi sadece sayfada aşağı-yukarı gezinmek. Uçtaysa ok zaten
             soluk duruyor ve bir şey yapmıyor. */
          dikeyKay(yukari ? 'yukari' : 'asagi');
          oklariGuncelle();
        });
        /* Oka dokunmak sayfayı küçültmesin / çift dokunma sayılmasın */
        ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'dblclick']
          .forEach(function (t) {
            d.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
          });
        sahne.appendChild(d);
        return d;
      };
      okUst = yap('yukari');
      okAlt = yap('asagi');
    })();

    function sinirla() {
      if (z.o <= 1.001) { z.x = 0; z.y = 0; return; }
      var r = sahne.getBoundingClientRect();
      var mx = (r.width * (z.o - 1)) / 2, my = (r.height * (z.o - 1)) / 2;
      z.x = Math.max(-mx, Math.min(mx, z.x));
      z.y = Math.max(-my, Math.min(my, z.y));
      if (flip.tekli) sayfayaSinirla();
    }
    /* TEK SAYFADA görüntü SAYFANIN içinde kalır (17.10.2026): telefonda sayfa
       sahneyi dikeyde doldurmuyor; üst/alt bölge büyütülünce ya da
       sürüklenince sayfanın dışındaki boşluk görünüyordu. Sayfa görünen
       alandan büyükse kenarına dayanır, küçükse ortalanır. */
    function sayfayaSinirla() {
      var g = tekSayfa1x(), o = z.o;
      var yw = g.w / (2 * o), yh = g.h / (2 * o);          /* görünen alanın yarısı (1x) */
      var cx = g.w / 2 - z.x / o, cy = g.h / 2 - z.y / o;  /* ekran ortasının sayfadaki yeri */
      cx = g.en >= 2 * yw ? Math.max(g.x + yw, Math.min(g.x + g.en - yw, cx)) : g.x + g.en / 2;
      cy = g.boy >= 2 * yh ? Math.max(g.y + yh, Math.min(g.y + g.boy - yh, cy)) : g.y + g.boy / 2;
      z.x = (g.w / 2 - cx) * o; z.y = (g.h / 2 - cy) * o;
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

    /* Piksel piksel gezinme — tekerlek/iki parmak için. zKaydir() oransal
       çalışıyor (yön tuşları için); burada hareketin kendi uzunluğu gerekli. */
    function zKaydirPx(dx, dy) {
      if (!dx && !dy) return;
      z.x -= dx; z.y -= dy;
      sinirla();
      zUygula(false);              /* anlık: parmakla birlikte kaysın */
    }

    /* TEKERLEK / TRACKPAD
       02.10.2026 — öğretmen: "touch pad kısmıyla bazı scrollarda aşağı
       yukarı gidemiyorum". Eskiden düz tekerlek de yakınlaştırıyordu, bu
       yüzden büyütülmüş sayfada iki parmakla yukarı-aşağı gidilemiyordu
       (sayfa gezinmek yerine uzaklaşıyordu). Artık:
         · ctrl/cmd + tekerlek (trackpad'de iki parmakla sıkıştırma) → yakınlaştırır
         · düz kaydırma, sayfa büyükken                              → GEZİNİR
         · düz kaydırma, normal boyda                                → hiçbir şey */
    sahne.addEventListener('wheel', function (e) {
      var sikistir = e.ctrlKey || e.metaKey;
      if (!sikistir && z.o <= 1.001) return;
      e.preventDefault();
      if (sikistir) {
        var r = sahne.getBoundingClientRect();
        zAyarla(z.o * Math.exp(-e.deltaY / 220), e.clientX - r.left, e.clientY - r.top);
        return;
      }
      /* deltaMode: 0 piksel, 1 satır, 2 sayfa */
      var kat = e.deltaMode === 1 ? 16 : (e.deltaMode === 2 ? sahne.clientHeight : 1);
      zKaydirPx(e.deltaX * kat, e.deltaY * kat);
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
      if (flip.tekli) {
        /* TEK SAYFA (17.10.2026): sayfa 2 sütun × 3 satır = 6 bölge */
        var g = tekSayfa1x(), sr = sahne.getBoundingClientRect();
        var px = e.clientX - sr.left - g.x, py = e.clientY - sr.top - g.y;
        if (px < 0 || px > g.en || py < 0 || py > g.boy) return null;
        return { tek: true, sutun: px >= g.en / 2 ? 1 : 0,
          satir: Math.min(BOLGE_SATIR - 1, Math.floor(py / (g.boy / BOLGE_SATIR))) };
      }
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

    /* Görünen sayfanın zoom'suz dikdörtgeni (TEK SAYFA kipi). Kitap kabı
       iki sayfa genişliğinde durur, flip.js etkin sayfayı sahnenin ortasına
       kaydırır (_tekliHiza); kaydırma transform olduğu için offset*
       değerlerinde görünmez — sayfanın yeri buradan hesaplanır. */
    function tekSayfa1x() {
      var k = kitap1x(), en = flip.sayfaEn || k.en / 2;
      return { x: kaydir.offsetLeft + (k.w - en) / 2, y: k.y, en: en, boy: k.boy, w: k.w, h: k.h };
    }

    function bolgeyiBuyut(h) {
      if (h.tek) {
        var g = tekSayfa1x(), tEn = g.en / 2, tBoy = g.boy / BOLGE_SATIR;
        var to = Math.min(ENCOK, Math.min(g.w / tEn, g.h / tBoy) * 0.98);
        var tx = g.x + h.sutun * tEn + tEn / 2 - g.w / 2, ty = g.y + h.satir * tBoy + tBoy / 2 - g.h / 2;
        z.o = to; z.x = -tx * to; z.y = -ty * to;
        sinirla(); zUygula(true);
        return;
      }
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

    /* ↑↓ ince adım: sayfa boyunun 1/5'i kadar yumuşak kaydırır (eskiden 1/9).
       Sayfanın ucuna gelmişsek false döner → bir üst kat (bolgeGez) sayfa değiştirir. */
    var DIKEY_ADIM = 5;
    /* Bu yönde gidilecek yer kaldı mı? (okları soluklaştırmak için de kullanılır) */
    function dikeyGidebilir(yon) {
      if (z.o <= 1.02) return false;
      var k = kitap1x();
      var gor = k.h / z.o;
      var py = k.h / 2 - z.y / z.o;
      var ust = k.y + gor / 2, alt = k.y + k.boy - gor / 2;
      if (alt < ust) return false;
      return yon === 'asagi' ? py < alt - 2 : py > ust + 2;
    }
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

    /* bölgeye dokunma — çift sayfada da tek sayfada da (17.10.2026).
       ÇİFT TIKLAMA GÜVENCESİ: büyütme/küçültmeden sonra CIFT_ARALIK içinde
       gelen dokunuş yok sayılır. Eskiden bölgeyi büyütmek için çift tıklayan
       (ya da çift dokunan) kişinin ikinci tıklaması büyütmeyi hemen geri
       alıyordu; ekran bir an yakınlaşıp dönüyor, "yakınlaşmıyor" sanılıyordu. */
    var CIFT_ARALIK = 350, sonBolge = 0;
    sahne.addEventListener('pointerdown', function (e) {
      if (panelAcik() || tanitimAcik || e.button > 0 || e.isPrimary === false) { bolgeDokun = null; return; }
      bolgeDokun = { x: e.clientX, y: e.clientY, t: Date.now(), id: e.pointerId, h: bolgeHedefi(e) };
    });
    kok.addEventListener('pointerup', function (e) {
      var d = bolgeDokun;
      if (!d || e.pointerId !== d.id) return;
      bolgeDokun = null;
      if (panelAcik() || tanitimAcik) return;
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10 || Date.now() - d.t > 600) return; // sürükleme
      if (Date.now() - sonBolge < CIFT_ARALIK) return;                       // çift tıklamanın ikincisi
      if (z.o > 1.02) { if (!e.target.closest(YOKSAY)) { zAyarla(1); sonBolge = Date.now(); } return; }
      if (d.h) { bolgeyiBuyut(d.h); sonBolge = Date.now(); }
    });
    kok.addEventListener('pointercancel', function () { bolgeDokun = null; });

    /* --------------------------------------------------------------
       3) TEK SAYFA: çift tıklama / çift dokunma
       Kaydırma ya da sürükleme çift dokunma sayılmaz: telefonda art arda iki
       hızlı sayfa kaydırma yakınlaştırmayı açmasın. İki dokunuş aynı yere
       düşmeli.
       -------------------------------------------------------------- */
    /* 17.10.2026: tek sayfadaki çift dokunma işleyicisi kaldırıldı — tek
       sayfada da 6 bölge var (yukarıda); çift dokunma bölgeyi büyütür,
       ikinci dokunuş güvenceye takılır, büyütmeyi geri almaz. */

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
    /* KADEMELİ PINCH (08.10.2026) — öğretmen: "iki parmakla yaklaştırma
       veya uzaklaştırma, sistemdeki yaklaştırma özelliğine bir kere
       tıklanmış gibi tepki versin; sonsuz yaklaştırma pratik olmuyor."
       Eskiden parmak arası sürekli ölçülüp oran anlık güncelleniyordu:
       tahtada ve telefonda ölçü parmağın en ufak titremesiyle oynuyor,
       istenen kademede durmak zorlaşıyordu.
       Artık bir pinch hareketi = + ya da - düğmesine BİR kez basmak:
       parmaklar EŞİK kadar açılır/kapanırsa tek kademe uygulanır
       (düğmelerle aynı 1.5 kat), hareketin kalanı yok sayılır. Yeni
       kademe için parmakları kaldırıp yeniden sıkıştırmak gerekir.
       Eşik hem orana hem piksele bakar: parmaklar birbirine yakınken
       küçük bir kayma yüzde olarak büyük görünüyor, o yüzden en az
       36 piksellik gerçek bir hareket de aranıyor. */
    var PINCH_ORAN = 1.18;   /* %18 açılma/kapanma */
    var PINCH_PIKSEL = 36;   /* ... ve en az bu kadar piksel */
    var pinch = null;
    sahne.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) {
        var a = e.touches[0], b = e.touches[1];
        pinch = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), bitti: false };
        bolgeDokun = null;                     /* kıstırma: bekleyen bölge dokunuşu iptal */
      }
    }, { passive: true });
    sahne.addEventListener('touchmove', function (e) {
      if (e.touches.length !== 2 || !pinch) return;
      e.preventDefault();
      if (pinch.bitti) return;                 /* bu harekette kademe verildi */
      var a = e.touches[0], b = e.touches[1];
      var d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      var fark = d - pinch.d, oran = d / pinch.d;
      var ac  = oran >= PINCH_ORAN      && fark >=  PINCH_PIKSEL;
      var kap = oran <= 1 / PINCH_ORAN  && fark <= -PINCH_PIKSEL;
      if (!ac && !kap) return;
      pinch.bitti = true;
      var r = sahne.getBoundingClientRect();
      zAyarla(ac ? z.o * 1.5 : z.o / 1.5,
        (a.clientX + b.clientX) / 2 - r.left, (a.clientY + b.clientY) / 2 - r.top);
    }, { passive: false });
    sahne.addEventListener('touchend', function (e) { if (e.touches.length < 2) pinch = null; }, { passive: true });


    /* --------------------------------------------------------------
       6) "NASIL KULLANILIR?" TANITIMI                   (02.10.2026)
       Öğretmen isteği: "tüm flipbooklara 6 dokunma zoom yeri ve diğer
       motor özelliklerini anlatan görsel ekleyelim."
       Kitabın HTML'ine hiçbir şey eklenmiyor — pencere de, üst çubuktaki
       "?" düğmesi de burada kuruluyor. Böylece üç kitapta (ve sonraki
       kitaplarda) aynı anlatım kendiliğinden çıkıyor.
       İlk açılışta bir kez kendiliğinden açılır, kapatılınca bir daha
       çıkmaz (tarayıcıda saklanır); sonra "?" düğmesinden açılır.
       -------------------------------------------------------------- */
    var tanitimKutu = null, tanitimAcik = false;
    var TANITIM_ANAHTAR = ayar.tanitimAnahtari ||
      ('kitapTanitim_' + (location.pathname.replace(/[^a-z0-9]+/gi, '_') || 'kitap'));

    function svg(ic, sinif) {
      return '<svg class="' + (sinif || '') + '" viewBox="0 0 24 24" aria-hidden="true" ' +
        'fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" ' +
        'stroke-linejoin="round">' + ic + '</svg>';
    }
    var IK = {
      cevir: '<path d="M12 4.5v15"/><path d="M12 6.5C10 4.9 7.6 4.2 4.5 4.2v13.6c3.1 0 5.5.7 7.5 2.3"/>' +
             '<path d="M12 6.5c2-1.6 4.4-2.3 7.5-2.3v13.6c-3.1 0-5.5.7-7.5 2.3"/>',
      dokun: '<circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none"/>' +
             '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="10.4" opacity=".45"/>',
      yon:   '<path d="M12 3.2v17.6"/><path d="M8.6 6.6 12 3.2l3.4 3.4"/><path d="M8.6 17.4 12 20.8l3.4-3.4"/>' +
             '<path d="M3.2 12h17.6" opacity=".45"/>',
      pinch: '<path d="M8.5 15.5 3.6 20.4"/><path d="M3.6 15.1v5.3h5.3"/>' +
             '<path d="M15.5 8.5 20.4 3.6"/><path d="M20.4 8.9V3.6h-5.3"/>',
      gez:   '<rect x="6.4" y="2.6" width="11.2" height="6.2" rx="2.2" opacity=".45"/>' +
             '<path d="M9.6 6.6 12 4.2l2.4 2.4"/>' +
             '<rect x="6.4" y="15.2" width="11.2" height="6.2" rx="2.2" opacity=".45"/>' +
             '<path d="M9.6 17.4 12 19.8l2.4-2.4"/>',
      tus:   '<rect x="2.6" y="5.6" width="18.8" height="12.8" rx="2.4"/>' +
             '<path d="M6.4 9.6h.01M10 9.6h.01M13.6 9.6h.01M17.2 9.6h.01M8.4 14.2h7.2"/>'
    };

    /* Altı bölge şeması. Numaralar OKUMA SIRASINA göre: sağdan sola
       kitapta 1-2-3 sağ sayfada başlar. */
    function semaHtml() {
      var solBas = rtl ? 4 : 1, sagBas = rtl ? 1 : 4;
      function sayfa(bas, isim) {
        var h = '<div class="kz-sayfa" data-ad="' + isim + '">';
        for (var i = 0; i < 3; i++) {
          var ilk = (bas + i === 1);
          /* Dokunuş işareti 1 numaralı bölgenin İÇİNDE durur: sağdan sola
             kitapta o bölge sağ sayfada olduğu için konumu sabit veremeyiz. */
          h += '<span class="kz-bolge' + (ilk ? ' kz-bolge-ilk' : '') + '">' + (bas + i) +
               (ilk ? '<span class="kz-dokunus">' + svg(IK.dokun) + '</span>' +
                      '<i class="kz-ornek">buraya dokun</i>' : '') + '</span>';
        }
        return h + '</div>';
      }
      /* TEK SAYFA ŞEMASI (17.10.2026): telefonda bir sayfa, 2 sütun × 3 satır;
         numaralar okuma sırasına göre (sağdan sola kitapta sağ sütun önce). */
      function tekSayfa() {
        var h = '<div class="kz-sayfa kz-tek6" data-ad="tek">';
        for (var s = 0; s < 3; s++) {
          for (var c = 0; c < 2; c++) {            /* c: ekranda soldan sağa */
            var no = s * 2 + ((c === 0) === !rtl ? 1 : 2), ilk = (no === 1);
            h += '<span class="kz-bolge' + (ilk ? ' kz-bolge-ilk' : '') + '">' + no +
                 (ilk ? '<span class="kz-dokunus">' + svg(IK.dokun) + '</span>' : '') + '</span>';
          }
        }
        return h + '</div>';
      }
      return '<div class="kz-sema" aria-hidden="true">' +
        '<div class="kz-kitap kz-cift-sema">' + sayfa(solBas, 'sol') + sayfa(sagBas, 'sağ') + '</div>' +
        '<div class="kz-kitap kz-tek-sema" hidden>' + tekSayfa() + '</div>' +
        '<p class="kz-sema-not kz-cift-not">Açık iki sayfa <b>6 bölge</b>. Bir bölgeye dokun — ' +
        'o bölge ekranı doldurur. Tekrar dokununca eski hâline döner.</p>' +
        /* Telefonda/dikey ekranda kitap tek sayfa açılır, orada bölge yok —
           pencere açılırken duruma göre gösterilir (tanitimAc). */
        '<p class="kz-sema-not kz-tekli-not" hidden>Telefonda (tek sayfa) da <b>6 bölge</b> var: ' +
        'sayfanın iki yarısı, üçer satır. Bir bölgeye dokun — o bölge ekranı doldurur. ' +
        'Tekrar dokununca eski hâline döner.</p></div>';
    }

    function tanitimHtml() {
      var yonYazi = rtl
        ? '<b>↑ ↓</b> sayfanın içinde kaydırır, <b>←</b> ileri <b>→</b> geri sayfa değiştirir.'
        : '<b>↑ ↓</b> sayfanın içinde kaydırır, <b>← →</b> sayfa değiştirir.';
      var satir = [
        [IK.dokun, 'Bir bölgeyi büyüt',
         'Yazı küçük geldiyse o bölgeye dokun; ekranı doldurur. Akıllı tahtada en çok işe yarayan yol bu.'],
        [IK.yon, 'Büyükken gezin', yonYazi + ' Sayfanın sonuna gelince kendiliğinden öbür sayfaya geçer.'],
        [IK.cevir, 'Sayfa çevir',
         'Parmağını <b>yatay kaydır</b> ya da kenardaki <b>oklara</b> bas. ' +
         'Dokunmak sayfayı çevirmez — dokunduğun bölgeyi büyütür.'],
        [IK.gez, 'Ekrandaki oklar',
         'Büyütünce sayfanın üstünde ve altında soluk birer ok çıkar; ' +
         'dokundukça sayfa <b>kademeli</b> aşağı-yukarı kayar. Sayfanın ' +
         'ucuna gelince ok soluklaşır.'],
        [IK.pinch, 'Dokunmatikte',
         'İki parmakla yakınlaştır. Telefonda da bölgeye bir kez dokunmak yeter; tekrar dokununca küçülür.'],
        [IK.tus, 'Tuşlar',
         '<b>+</b> <b>−</b> yakınlaştırma, <b>0</b> eski hâli, <b>Esc</b> çıkış, <b>F</b> tam ekran.']
      ].map(function (x) {
        return '<li>' + svg(x[0], 'kz-ik') + '<div><b>' + x[1] + '</b><span>' + x[2] + '</span></div></li>';
      }).join('');

      return '<div class="kz-tanitim-ic" role="dialog" aria-modal="true" aria-label="Nasıl kullanılır">' +
        '<button type="button" class="kz-kapat" aria-label="Kapat">✕</button>' +
        '<h2>Nasıl kullanılır?</h2>' +
        semaHtml() +
        '<ul class="kz-liste">' + satir + '</ul>' +
        '<div class="kz-alt"><button type="button" class="kz-tamam">Anladım</button>' +
        '<small>Bu pencereyi üstteki <b>?</b> düğmesinden her zaman açabilirsin.</small></div>' +
        '</div>';
    }

    function tanitimKur() {
      if (tanitimKutu) return;
      tanitimKutu = document.createElement('div');
      tanitimKutu.className = 'kz-tanitim';
      tanitimKutu.hidden = true;
      tanitimKutu.innerHTML = tanitimHtml();
      document.body.appendChild(tanitimKutu);
      tanitimKutu.addEventListener('click', function (e) {
        if (e.target === tanitimKutu || e.target.closest('.kz-kapat,.kz-tamam')) tanitimKapat();
      });
    }

    function tanitimAc() {
      tanitimKur();
      /* Tek sayfa modundaysa şemanın altına o duruma özel not çıkar. */
      [['.kz-tekli-not', !flip.tekli], ['.kz-tek-sema', !flip.tekli],
       ['.kz-cift-not', flip.tekli], ['.kz-cift-sema', flip.tekli]].forEach(function (x) {
        var el = tanitimKutu.querySelector(x[0]);
        if (el) el.hidden = x[1];
      });
      tanitimKutu.hidden = false;
      tanitimAcik = true;
      flip.kilitli = true;
      var t = tanitimKutu.querySelector('.kz-tamam');
      if (t) try { t.focus({ preventScroll: true }); } catch (x) {}
    }
    function tanitimKapat() {
      if (!tanitimKutu) return;
      tanitimKutu.hidden = true;
      tanitimAcik = false;
      zUygula(false);                      /* kilidi gerçek duruma göre kur */
      try { localStorage.setItem(TANITIM_ANAHTAR, '1'); } catch (x) {}
    }

    /* Üst çubuğa "?" düğmesi. Kitabın HTML'i değişmesin diye buradan
       ekleniyor; tam ekran düğmesinin soluna, aynı .tus biçimiyle. */
    (function tanitimTusu() {
      if (document.querySelector('.kz-yardim')) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tus kz-yardim';
      b.title = 'Nasıl kullanılır? (?)';
      b.setAttribute('aria-label', 'Nasıl kullanılır');
      b.innerHTML = svg('<circle cx="12" cy="12" r="9.2"/>' +
        '<path d="M9.3 9.2a2.8 2.8 0 1 1 3.5 2.7c-.6.2-1 .8-1 1.5v.4"/>' +
        '<path d="M12 17.4h.01"/>');
      b.addEventListener('click', tanitimAc);
      var tam = document.getElementById('tTamEkran');
      if (tam && tam.parentNode) tam.parentNode.insertBefore(b, tam);
      else {
        var yk = document.getElementById('tYaklas');
        if (yk && yk.parentNode) yk.parentNode.insertBefore(b, yk);
        else { b.classList.add('kz-yardim-serbest'); document.body.appendChild(b); }
      }
    })();

    /* Klavye: "?" açar, Esc kapatır. Yakalama evresinde dinleniyor ki
       tanıtım açıkken Esc önce bu pencereyi kapatsın, kitabın kendi Esc
       işi sonra gelsin. */
    document.addEventListener('keydown', function (e) {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target || {}).tagName || '')) return;
      if (tanitimAcik && e.key === 'Escape') { e.stopPropagation(); tanitimKapat(); return; }
      if (!tanitimAcik && (e.key === '?' || (e.key === '/' && e.shiftKey))) {
        e.preventDefault(); e.stopPropagation(); tanitimAc();
      }
    }, true);

    /* İlk açılışta bir kez kendiliğinden */
    (function ilkAcilis() {
      var gorulmus = false;
      try { gorulmus = !!localStorage.getItem(TANITIM_ANAHTAR); } catch (x) {}
      if (gorulmus) return;
      setTimeout(function () { if (!panelAcik()) tanitimAc(); }, 1200);
    })();

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
      olcekle: function () { sinirla(); zUygula(false); },
      tanitim: tanitimAc,
      tanitimAcikMi: function () { return tanitimAcik; }
    };
  };
})(window);
