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
   · TAHTAYA YANSITMA (23.10.2026): tahta kabuğunun çerçevesinde kumandanın
     sayfası ve yakınlığı Sınıf Ekranı'na da gider (aşağıda 7. bölüm).
   · KALEM (23.10.2026): sayfaya yapışan, kâğıda yazılmış gibi duran yazı;
     nerede kalındığını gösterir, tahtaya da yansır (aşağıda 8. bölüm).
   · AKICI İKİ PARMAK (24.10.2026): veri.js'te pinch: 'akici' olan kitapta
     sayfa parmakları birebir izler, bırakınca kademeye oturur (5. bölüm).
   · METİN KATMANI (24.10.2026): veri.js'te metin varsa yazılar PDF'ten
     çizgi olarak sayfanın üstünde durur, her büyütmede net (9. bölüm).

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
      '.nokta,[data-git],.html-sayfa a,button,a,input,select,.panel,.kk-palet,.kk-ipucu,.kk-serit,.kk-ayar';

    var ENAZ = 1, ENCOK = ayar.encok || 5;
    /* AKICI PINCH (24.10.2026): kitabın veri.js'inde pinch: 'akici' ise iki
       parmakla yakınlaşma parmakları birebir izler (5. bölüm). Pilot: 8. sınıf. */
    var AKICI = (ayar.pinch || (kok.KITAP_VERI && kok.KITAP_VERI.pinch)) === 'akici';
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
        bilgi.textContent = kalemYazar()                /* kalemde tek parmak yazar (8. bölüm); imleçte gezer */
          ? y + ' — kalem açık: iki parmakla gezin' + (flip.tekli ? '' : ', yön tuşlarıyla geç')
          : y + ' — sürükleyerek gezin, ' + (flip.tekli ? 'dokununca küçülür' : 'yön tuşlarıyla geç, dokununca küçülür');
        bilgi.classList.toggle('gor', z.o > 1.02);
      }
      sahne.classList.toggle('yakin', z.o > 1.02);
      duzAyarla();                       /* Safari netliği: büyükken yapraklar 3B'siz (10. bölüm) */
      flip.kilitli = z.o > 1.02 || !!panelAcik() || tanitimAcik || kalemYazar() || pinchAktif;   /* kalem: 8. bölüm · iki parmak: 5. bölüm */
      oklariGuncelle();
      tkZamanla();                       /* tahtaya yansıtma (7. bölüm) */
      kkSeritZamanla();                  /* yüzen kalem şeridi (8. bölüm, 25.10.2026) */
      if (metinYukselt) metinYukselt();  /* 2K zemin (9. bölüm, 25.10.2026) */
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
          if (engelli()) return;           /* Sınıf Ekranı: görünüm kumandadan gelir */
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
      if (engelli()) return;               /* Sınıf Ekranı: görünüm kumandadan gelir */
      atalet(false);                       /* fırlatılmış sayfa durur (5. bölüm) */
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

    if (ayar.yaklas) ayar.yaklas.addEventListener('click', function () { zAyarla(AKICI ? komsuKademe(z.o, 1) : z.o * 1.5); });
    if (ayar.uzaklas) ayar.uzaklas.addEventListener('click', function () { zAyarla(AKICI ? komsuKademe(z.o, -1) : z.o / 1.5); });

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
        if (AKICI) tekerKademe(e.clientX - r.left, e.clientY - r.top);   /* 5. bölüm */
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
      if (engelli()) return true;          /* yinelenen tuş: kanaldan gelen görünüm yeter */
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
      if (panelAcik() || tanitimAcik || !kkGezinir(e) || e.button > 0 || e.isPrimary === false) { bolgeDokun = null; return; }
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
      atalet(false);                                     /* fırlatılmış sayfa dokununca durur */
      if (z.o <= 1.02 || !kkGezinir(e) || pinchAktif) return;   /* kalemde tek parmak yazar (imleçte / parmakla gezer), iki parmak gezdirir */
      if (e.target.closest(YOKSAY)) return;
      pan = { id: e.pointerId, x: e.clientX, y: e.clientY, zx: z.x, zy: z.y, iz: [] };
      sahne.style.cursor = 'grabbing';
    });
    kok.addEventListener('pointermove', function (e) {
      /* 24.10.2026: yalnız sürüklemeyi başlatan parmak gezdirir (ikinci parmak
         sayfayı oynatmasın); kıstırırken gezinmeyi 5. bölüm yapar */
      if (!pan || pinchAktif || (pan.id != null && e.pointerId !== pan.id)) return;
      z.x = pan.zx + (e.clientX - pan.x);
      z.y = pan.zy + (e.clientY - pan.y);
      if (AKICI) { pan.iz.push([performance.now(), e.clientX, e.clientY]); if (pan.iz.length > 8) pan.iz.shift(); }
      sinirla(); zUygula(false);
    });
    kok.addEventListener('pointerup', function (e) {
      var p = pan; pan = null; sahne.style.cursor = '';
      if (AKICI && p && !pinchAktif && (p.id == null || e.pointerId === p.id)) atalet(true, p.iz);
    });
    kok.addEventListener('pointercancel', function (e) { if (e.isTrusted) { pan = null; sahne.style.cursor = ''; } });

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
      if (e.touches.length === 2 && !AKICI) {           /* akıcı kitapta aşağıdaki işleyici */
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

    /* AKICI PINCH (24.10.2026) — öğretmen: "flipbooka iki parmakla yaklaşmayı
       daha hassas ve işlevsel bi hale getirmek istiyorum"; bırakınca:
       "kademeye otursun". Yalnız veri.js'inde pinch: 'akici' olan kitapta
       (pilot: 8. sınıf); öbür kitaplarda yukarıdaki kademeli pinch sürer.
       · Sayfa parmakları birebir izler: parmakların ortasındaki nokta
         parmakların altında kalır; iki parmakla aynı anda kaydırılır.
       · Başta 8 piksellik pay: parmak titremesi büyütmez (08.10.2026'da
         kademeli pinch'e geçilmesinin sebebi buydu).
       · Bırakınca en yakın kademeye yumuşakça oturur (%100 150 200 300 400
         500); + ve − düğmeleri ve trackpad de bu kademelerle. Sınırın ötesine
         biraz esner, bırakınca geri gelir.
       · İkinci parmak inince ilk parmağın yaprak çevirmesi ve bölge dokunuşu
         iptal: kıstırma sayfa çevirmez, bölge büyütmez.
       · Bir parmak kalınca o parmakla gezinme sürer. */
    var KADEMELER = [1, 1.5, 2, 3, 4, 5];
    var pinchAktif = false, PK = null, pkKare = 0, dokunan = {}, tekerZ = 0;
    function kademe(o) {
      var en = ENAZ, fark = Infinity;
      KADEMELER.forEach(function (k) {
        if (k < ENAZ || k > ENCOK) return;
        var d = Math.abs(Math.log(o / k));
        if (d < fark) { fark = d; en = k; }
      });
      return en;
    }
    function komsuKademe(o, yon) {
      var L = KADEMELER.filter(function (k) { return k >= ENAZ && k <= ENCOK; });
      if (yon > 0) { for (var i = 0; i < L.length; i++) if (L[i] > o * 1.02) return L[i]; return ENCOK; }
      for (var j = L.length - 1; j >= 0; j--) if (L[j] < o / 1.02) return L[j];
      return ENAZ;
    }
    function lastik(o) {                                 /* sınırın ötesinde direnç */
      if (o > ENCOK) return ENCOK * Math.pow(o / ENCOK, 0.35);
      if (o < ENAZ) return ENAZ * Math.pow(o / ENAZ, 0.35);
      return o;
    }
    function tekerKademe(mx, my) {
      clearTimeout(tekerZ);
      tekerZ = setTimeout(function () {
        tekerZ = 0;
        var k = kademe(z.o);
        if (Math.abs(k - z.o) > 0.002) zAyarla(k, mx, my);
      }, 220);
    }
    function ikiParmak(e) {
      var a = e.touches[0], b = e.touches[1], r = sahne.getBoundingClientRect();
      return { d: Math.max(1, Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)),
               x: (a.clientX + b.clientX) / 2 - r.left, y: (a.clientY + b.clientY) / 2 - r.top,
               w: r.width, h: r.height };
    }
    function pkUygula() {
      pkKare = 0;
      if (!PK || !PK.basladi) return;
      var s = PK.son, b = PK.bas;
      var o = lastik(PK.o0 * s.d / b.d), k = o / PK.o0;
      /* başlangıçta parmak ortasının altındaki nokta şimdi de parmak ortasının altında */
      z.x = (s.x - s.w / 2) - ((b.x - b.w / 2) - PK.x0) * k;
      z.y = (s.y - s.h / 2) - ((b.y - b.h / 2) - PK.y0) * k;
      z.o = o;
      sinirla();
      zUygula(false);
    }
    function pkBitir(e) {
      if (e.touches && e.touches.length >= 2) return;
      if (!PK) {
        if (pinchAktif) { pinchAktif = false; kaydir.classList.remove('pinch'); zUygula(false); }
        return;
      }
      if (pkKare) { cancelAnimationFrame(pkKare); pkUygula(); }
      var p = PK.son, basladi = PK.basladi;
      PK = null; pinchAktif = false;
      kaydir.classList.remove('pinch');
      if (basladi) zAyarla(kademe(z.o), p.x, p.y);         /* en yakın kademeye yumuşakça */
      else zUygula(false);                                  /* kilidi gerçek duruma göre kur */
      if (e.touches && e.touches.length === 1 && z.o > 1.02 && !kalemYazar()) {
        var t = e.touches[0];                               /* kalan parmakla gezinme sürer */
        pan = { id: null, x: t.clientX, y: t.clientY, zx: z.x, zy: z.y, iz: [] };
      }
    }
    if (AKICI) {
      /* ikinci parmak inerken (dokunuş olaylarından ÖNCE gelir): yaprak
         sürüklenmesin, bölge büyümesin, ilk parmağın işi iptal */
      sahne.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'touch') return;
        if (e.isPrimary) dokunan = {};
        var once = Object.keys(dokunan);
        dokunan[e.pointerId] = 1;
        if (!once.length || engelli()) return;
        pinchAktif = true; pan = null; bolgeDokun = null;
        flip.kilitli = true;
        if (!kalemYazar()) {
          try {
            kok.dispatchEvent(new PointerEvent('pointercancel', { pointerId: +once[0], pointerType: 'touch', bubbles: true }));
          } catch (x) { }
        }
      }, true);
      kok.addEventListener('pointerup', function (e) { delete dokunan[e.pointerId]; }, true);
      kok.addEventListener('pointercancel', function (e) { if (e.isTrusted) delete dokunan[e.pointerId]; }, true);
      sahne.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 2 || engelli()) return;
        atalet(false);
        var p = ikiParmak(e);
        PK = { bas: p, son: p, basladi: false, o0: z.o, x0: z.x, y0: z.y };
        pinchAktif = true; pan = null; bolgeDokun = null;
        kaydir.classList.add('pinch');
        zUygula(false);
      }, { passive: true });
      sahne.addEventListener('touchmove', function (e) {
        if (!PK || e.touches.length !== 2) return;
        e.preventDefault();
        var p = ikiParmak(e);
        if (!PK.basladi) {                                  /* titreme payı: 8 piksel */
          if (Math.abs(p.d - PK.bas.d) < 8 && Math.hypot(p.x - PK.bas.x, p.y - PK.bas.y) < 8) return;
          PK.basladi = true;                                /* aşıldı: parmaklar ilk yerlerinden birebir */
        }
        PK.son = p;
        if (!pkKare) pkKare = requestAnimationFrame(pkUygula);
      }, { passive: false });
      sahne.addEventListener('touchend', pkBitir, { passive: true });
      sahne.addEventListener('touchcancel', pkBitir, { passive: true });
    }

    /* ATALET (24.10.2026, akıcı kitapta): büyükken tek parmakla hızlıca
       sürükleyip bırakınca sayfa kaymaya devam eder, yavaşlayarak durur.
       Dokununca, büyütme değişince ya da sınıra gelince durur. */
    var AT = null;
    function atalet(basla, iz) {
      if (AT) { cancelAnimationFrame(AT.k); AT = null; }
      if (!basla || !iz || iz.length < 2 || z.o <= 1.02) return;
      var son = iz[iz.length - 1], ilk = son;
      if (performance.now() - son[0] > 80) return;          /* durup bıraktı */
      for (var j = iz.length - 2; j >= 0; j--) { if (son[0] - iz[j][0] > 100) break; ilk = iz[j]; }
      var dt = son[0] - ilk[0];
      if (dt < 8) return;
      var vx = (son[1] - ilk[1]) / dt, vy = (son[2] - ilk[2]) / dt, hiz = Math.hypot(vx, vy);
      if (hiz < 0.3) return;
      if (hiz > 2.5) { vx *= 2.5 / hiz; vy *= 2.5 / hiz; }  /* çok sert fırlatma da ölçülü kaysın */
      AT = { vx: vx, vy: vy, t: performance.now(), k: 0 };
      var adim = function (t) {
        if (!AT) return;
        var d = Math.min(50, Math.max(0, t - AT.t)); AT.t = t;   /* yavaş cihazda da süreye göre yavaşlar */
        var hx = z.x + AT.vx * d, hy = z.y + AT.vy * d;
        z.x = hx; z.y = hy; sinirla();
        if (Math.abs(z.x - hx) > 0.5) AT.vx = 0;           /* sınıra dayandı */
        if (Math.abs(z.y - hy) > 0.5) AT.vy = 0;
        zUygula(false);
        var f = Math.pow(0.92, d / 16);                     /* ~1 saniyede durur */
        AT.vx *= f; AT.vy *= f;
        if (Math.hypot(AT.vx, AT.vy) < 0.03) { AT = null; return; }
        AT.k = requestAnimationFrame(adim);
      };
      AT.k = requestAnimationFrame(adim);
    }


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
      kalem: '<path d="M15.2 4.8l4 4L8.4 19.6 3.6 20.4l.8-4.8z"/><path d="M13.6 6.4l4 4"/>',
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
        [IK.kalem, 'Kalemle yaz',
         '<b>Kalem</b> düğmesine bas (ya da <b>P</b>) ve sayfaya yaz: yazdığın o sayfaya yapışır, ' +
         'sayfa çevrilince ve büyütünce onunla gider. Bu tarayıcıda saklanır; <b>Kaldığım yer</b> ' +
         'en son yazdığın sayfayı açar. İki parmakla büyütüp gezinebilirsin. Renkler, silgi, geri al ve ' +
         'yinele yüzen şeritte; büyütünce şerit yazdığın yerin yakınına gelir (Kalem düğmesinin altındaki ' +
         '<b>Otomatik takip</b> ile kapatılır). Şeritteki <b>imleçle</b> (<b>V</b>) kalemi kapatmadan sayfada ' +
         'gezersin, bir renge dokununca yine yazarsın. Şeridi baştaki tutamaktan istediğin yere taşı; kenara ' +
         'bırakınca dikey olur.'],
        [IK.tus, 'Tuşlar',
         '<b>+</b> <b>−</b> yakınlaştırma, <b>0</b> eski hâli, <b>Esc</b> çıkış, <b>F</b> tam ekran.']
      ].map(function (x) {
        return '<li>' + svg(x[0], 'kz-ik') + '<div><b>' + x[1] + '</b><span>' + x[2] + '</span></div></li>';
      }).join('');

      return '<div class="kz-tanitim-ic" role="dialog" aria-modal="true" aria-label="Nasıl kullanılır">' +
        '<button type="button" class="kz-kapat" data-kz="kapat" aria-label="Kapat">✕</button>' +
        '<h2>Nasıl kullanılır?</h2>' +
        semaHtml() +
        '<ul class="kz-liste">' + satir + '</ul>' +
        '<div class="kz-alt"><button type="button" class="kz-tamam" data-kz="tamam">Anladım</button>' +
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
      b.setAttribute('data-kz', 'yardim');      /* tahtaya yansıtmada tuşun kimliği (23.10.2026) */
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
      /* Sınıf Ekranı'nda kendiliğinden açılmaz (kumandadan kapatılamazdı); pencere gizli
         kurulur ki kumandadaki pencerenin tuşları tahtada da aynı tuşa düşsün */
      if (izleCihazi()) { tanitimKur(); return; }
      setTimeout(function () { if (!panelAcik()) tanitimAc(); }, 1200);
    })();

    /* --------------------------------------------------------------
       7) TAHTAYA YANSITMA                               (23.10.2026)
       Öğretmen: "flipbook motorunda kumandadan yakınlaşınca yaklaşma vs
       çalışsın". Kitap tahta kabuğunun çerçevesinde açıkken (telefon ya da
       bilgisayar kumanda, akıllı tahta Sınıf Ekranı) kabuğun genel
       yansıtması tıklamaları ve tuşları taşıyor ama parmak hareketlerini
       taşımıyordu: bölgeye dokunup büyütme, kıstırma, sürükleyerek gezinme,
       kaydırarak sayfa çevirme tahtaya gitmiyordu, tahta olduğu yerde
       kalıyordu.
       Şimdi kumanda (lider) görünümünü her değişimde cihazdan bağımsız
       yazar (KidefTahta.kanal 'kitap'): ekranın ortasındaki sayfa, o
       sayfadaki yer (0-1) ve görünen alanın sayfaya oranı. Sınıf Ekranı
       (izleyen) aynı sayfayı açar (komşu yayılıma çevirerek, uzaksa
       atlayarak), aynı yeri ortalar; ekranının oranı farklı olduğundan
       kumandanın gördüğü alanın tamamı sığacak kadar büyütür. Telefon tek
       sayfada, tahta çift sayfada olsa da aynı yer görünür.
       İzleyende, kabuğun yinelediği tıklama ve tuşların (isTrusted: false)
       sayfa çevirmesi ve yakınlaştırması yok sayılır — yoksa aynı hareket
       iki kez uygulanırdı (bir kez yinelenen tıklamayla, bir kez kanaldan).
       Bu yalnız kanal bir kez konuştuktan sonra: kumanda eski sürümdeyse
       genel yansıtma eskisi gibi çalışır. Kabuğun dışında hiçbir şey
       değişmez. Sınıf Ekranı'nda «Nasıl kullanılır?» kendiliğinden açılmaz
       (kumandadan kapatılamazdı).
       -------------------------------------------------------------- */
    var TK = { k: null, canli: false, z: 0, son: '', bek: null, bz: 0 };
    function izleCihazi() {
      try {
        var u = window.parent;
        if (!u || u === window) return false;
        if (u.KidefTahta && u.KidefTahta.cihaz) return u.KidefTahta.cihaz === 'tahta';
        return /[?&]rol=izle\b/.test(u.location.search);
      } catch (e) { return false; }
    }
    function tkDurum() { try { return TK.k ? TK.k.durum() : null; } catch (e) { return null; } }
    function tkLider() { var d = tkDurum(); return !!(d && d.oturum && d.lider); }
    function tkIzleyen() { var d = tkDurum(); return !!(d && d.oturum && !d.lider); }
    /* izleyende kabuğun yinelediği olaydan gelen sayfa / yakınlık işi mi? */
    function engelli() {
      if (!TK || !TK.k || !TK.canli || !tkIzleyen()) return false;
      try { var e = window.event; return !!(e && e.isTrusted === false); } catch (x) { return false; }
    }
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function sayi(v, d) { v = +v; return isFinite(v) ? v : d; }
    function tkYayilim(p) { return p <= 1 ? 0 : Math.floor(p / 2); }
    function tkSayfada(p) { return flip.tekli ? flip.aktif === p : tkYayilim(p) === flip.c; }
    /* bu cihazda p. sayfanın zoom'suz dikdörtgeni (sayfa açıkken) */
    function tkSayfa1x(p) {
      if (flip.tekli) { var t = tekSayfa1x(); return { x: t.x, y: t.y, en: t.en, boy: t.boy }; }
      var k = kitap1x(), en = k.en / 2, sag;
      if (ekranSayfa(true) === p) sag = true;
      else if (ekranSayfa(false) === p) sag = false;
      else return null;
      return { x: k.x + (sag ? en : 0), y: k.y, en: en, boy: k.boy };
    }
    /* kumandanın görünümü: { p, o } ya da büyükken { p, o, fx, fy, fw, fh } */
    function tkGorunum() {
      var W = sahne.clientWidth, H = sahne.clientHeight;
      var m = { p: flip.tekli ? flip.aktif : (flip.sagSayfa() || flip.solSayfa() || 1), o: 1 };
      if (kalemAcik()) m.kl = 1;                                 /* kalem açık: izleyen de açar (8. bölüm) */
      if (z.o <= 1.02 || !W || !H || !sahne.querySelector('.kitap')) return m;
      var cx = W / 2 - z.x / z.o, cy = H / 2 - z.y / z.o, g;     /* ekran ortasının zoom'suz yeri */
      if (flip.tekli) { var t = tekSayfa1x(); g = { x: t.x, y: t.y, en: t.en, boy: t.boy }; }
      else {
        var k = kitap1x(), en = k.en / 2, sag = cx >= k.x + en, p = ekranSayfa(sag);
        if (p == null) { sag = !sag; p = ekranSayfa(sag); }
        if (p == null) return m;
        m.p = p;
        g = { x: k.x + (sag ? en : 0), y: k.y, en: en, boy: k.boy };
      }
      if (!(g.en > 0 && g.boy > 0)) return m;
      m.o = r4(z.o);
      m.fx = r4((cx - g.x) / g.en); m.fy = r4((cy - g.y) / g.boy);
      m.fw = r4(W / z.o / g.en); m.fh = r4(H / z.o / g.boy);
      return m;
    }
    function tkAnlik() {                                         /* kabuk t:'h' koyar */
      var m = tkGorunum(), k = kkAnlik();                        /* + açık yayılımın yazısı (8. bölüm) */
      if (k) m.k = k;
      return m;
    }
    /* lider: değişim bitince (en çok 90 ms'de bir) yazar */
    function tkZamanla() {
      if (!TK || !TK.k || TK.z) return;
      TK.z = setTimeout(function () {
        TK.z = 0;
        if (!tkLider()) return;
        var m = tkGorunum(), s = JSON.stringify(m);
        if (s === TK.son) return;
        m.t = 'g';
        try { if (TK.k.gonder(m)) TK.son = s; } catch (e) { }
      }, 90);
    }
    /* izleyen: liderin görünümü */
    function tkGelen(m) {
      if (m && typeof m.t === 'string' && m.t.charAt(0) === 'k') { TK.canli = true; kkGelen(m); return; }   /* kalem (8. bölüm) */
      if (!m || (m.t !== 'g' && m.t !== 'h')) return;
      TK.canli = true;
      if (m.t === 'h' && m.k) kkGelen({ t: 'kb', bk: m.k.bk, L: m.k.L });
      kkKipEsitle(m);
      TK.son = '';
      TK.bek = m;
      tkUygulaZamanla(0);
    }
    function tkUygulaZamanla(ms) { clearTimeout(TK.bz); TK.bz = setTimeout(tkUygula, ms); }
    function tkUygula() {
      TK.bz = 0;
      var m = TK.bek;
      if (!m || tkLider()) { TK.bek = null; return; }
      if (flip.animasyonda) { tkUygulaZamanla(80); return; }        /* çevirme bitsin */
      var p = Math.max(1, Math.min(flip.toplam || 1e6, Math.round(sayi(m.p, 1))));
      var buyuk = sayi(m.o, 1) > 1.02;
      if (!tkSayfada(p)) {
        if (z.o > 1.02 || z.x || z.y) { z.o = 1; z.x = 0; z.y = 0; zUygula(false); }   /* yakınlık eski sayfada kalsın */
        var ileri = flip.tekli ? p > flip.aktif : tkYayilim(p) > flip.c;
        var komsu = flip.tekli ? Math.abs(p - flip.aktif) === 1 : Math.abs(tkYayilim(p) - flip.c) === 1;
        if (komsu && !buyuk && (ileri ? ASIL.ileri : ASIL.geri).call(flip)) { tkUygulaZamanla(80); return; }
        ASIL.git.call(flip, p);
      }
      TK.bek = null;
      if (!buyuk) {
        if (z.o > 1.02 || z.x || z.y) { z.o = 1; z.x = 0; z.y = 0; zUygula(true); }
        return;
      }
      var g = tkSayfa1x(p), W = sahne.clientWidth, H = sahne.clientHeight;
      if (!g || !W || !H) return;
      var vw = Math.max(0.02, sayi(m.fw, 1)) * g.en, vh = Math.max(0.02, sayi(m.fh, 1)) * g.boy;
      var o = Math.max(ENAZ, Math.min(ENCOK, Math.min(W / vw, H / vh)));
      var px = g.x + sayi(m.fx, 0.5) * g.en, py = g.y + sayi(m.fy, 0.5) * g.boy;
      z.o = o; z.x = (W / 2 - px) * o; z.y = (H / 2 - py) * o;
      sinirla(); zUygula(true);
    }
    /* izleyende yinelenen olayla sayfa çevrilmez; kanalın kendi işi ASIL ile */
    var ASIL = { ileri: flip.ileri, geri: flip.geri, git: flip.git };
    ['ileri', 'geri', 'git'].forEach(function (ad) {
      flip[ad] = function () { if (engelli()) return false; return ASIL[ad].apply(flip, arguments); };
    });
    /* sayfa değişince de (kaydırarak çevirme, içindekiler, sayfa no) */
    var asilDegisti = flip.degisti;
    flip.degisti = function () { var r = asilDegisti.apply(this, arguments); tkZamanla(); kkSayfaDegisti(); return r; };
    (function tahtaKanali() {
      var KT = null;
      try { var u = window.parent; KT = (u && u !== window && u.KidefTahta && u.KidefTahta.kanal) ? u.KidefTahta : null; } catch (e) { KT = null; }
      if (!KT) return;
      try { TK.k = KT.kanal.kur('kitap', { belge: document, gelen: tkGelen, anlik: tkAnlik }); } catch (e) { TK.k = null; }
    })();

    /* --------------------------------------------------------------
       8) KALEM — SAYFAYA YAPIŞAN YAZI                   (23.10.2026)
       Öğretmen: "flipbooklarda kalemle yazma özelliği eklesek, hem
       böylece nerde kaldığımızı da görürüz, kalem kağıda yazılmış gibi
       olmalı ama, sayfaya yapışmalı".
       · Araç çubuğunda «Kalem» (P). Açıkken parmak / kalem / fare sayfaya
         yazar; kaydırarak sayfa çevirme ve dokununca büyütme durur. Oklar,
         klavye, iki parmakla kıstırma ve iki parmakla gezinme çalışır.
         YÜZEN ŞERİT (25.10.2026): mavi · pembe · kırmızı · siyah · yeşil
         (defterle aynı renkler, 1-5 tuşları), silgi (E; dokunduğu çizgiyi
         siler), geri al (Ctrl+Z), yinele (Ctrl+Y). Kalem ayarları Kalem
         düğmesinin altında: otomatik takip, kalınlık, fosforlu (6),
         sayfayı temizle (iki kez dokun), «Kaldığım yer», kapat (Esc).
       · KÂĞIDA YAZILMIŞ GİBİ: yazı her sayfa yüzünün kendi katmanında
         (SVG) ve sayfa resmiyle çarpılarak karışır (mix-blend-mode:
         multiply): beyaz kâğıtta mürekkep rengi, basılı yazının üstünde
         koyu kalır. Fosforlu kalem çizgilerin altında kalır, yazıyı
         örtmez. Kesişen çizgiler biraz koyulaşır (gerçek mürekkep gibi).
       · SAYFAYA YAPIŞIR: noktalar sayfanın kendi biriminde (en 1000)
         tutulur; sayfa çevrilince yaprakla birlikte döner, büyütünce
         keskin büyür; telefonda tek sayfa, tahtada çift sayfa olsa da
         aynı yerde durur. Kalınlık da sayfaya göredir (kâğıttaki gibi).
       · NEREDE KALDIK: yazılar bu tarayıcıda kitaba ve sayfaya göre
         saklanır (IndexedDB, olmazsa localStorage). «Kaldığım yer» en son
         yazılan sayfaları (renk, gün) sıralar; dokununca o sayfayı açar,
         son çizginin yerini bir an parlatır. Kitap açılınca en son
         yazılan yer açık sayfada değilse bir kez öneri çıkar.
       · TAHTA (kanal 'kitap'): kumandada yazılan çizgi Sınıf Ekranı'nda
         yazıldıkça görünür. Lider açık yayılımın yazılarını yollar;
         izleyen onları gösterir, daha yeniyse kendi deposuna da yazar
         (tahta tek başına açılınca da kaldığınız yer görünür). Sınıf
         Ekranı'nda kalem takımı görünmez, yazı kumandadan gelir. Kumanda
         eski sürümdeyse tahta kendi yazılarını gösterir.
       -------------------------------------------------------------- */
    var KK_NS = 'http://www.w3.org/2000/svg';
    var KK_EN = 1000;                                     /* sayfa eni (birim) */
    var KK_BOY = Math.round(KK_EN * (flip.oran || 1.414)); /* sayfa boyu (birim) */
    /* renk numaraları defterle (yazisayfasi.js RENKLER) aynı */
    var KK_RENK = ['#1F2430', '#1E5BD8', '#D93025', '#188038', '#EA7A0C', '#E84393'];
    var KK_RENK_AD = ['Siyah', 'Mavi', 'Kırmızı', 'Yeşil', 'Turuncu', 'Pembe'];
    var KK_SIRA = [1, 5, 2, 0, 3];                        /* mavi · pembe · kırmızı · siyah · yeşil */
    var KK_FOS = ['#FFE04A'];                             /* fosforlu: sarı */
    var KK_KALIN = { i: 2.6, o: 4.2, k: 7 };              /* kalem çizgisi (birim) */
    var KK_FKALIN = { i: 15, o: 22, k: 32 };              /* fosforlu */
    var KK_KAL_AD = { i: 'İnce', o: 'Orta', k: 'Kalın' };
    var KK_TERCIH = 'kitapKalemTercih';
    var KK_DB = 'kidef-kitap-kalem', KK_DEPO = 'sayfalar';

    function kkKitapAdi() {
      var y = String(location.pathname || '').replace(/\/+$/, '').replace(/\/index\.html?$/i, '');
      var ad = y.split('/').pop() || 'kitap';
      try { ad = decodeURIComponent(ad); } catch (e) { }
      return ad;
    }
    var KK_KITAP = ayar.kalemAnahtari || kkKitapAdi();

    var KK = {
      acik: false, arac: 'k', sonArac: 'k', renk: 1, kal: 'o',
      M: {},            /* bu cihazın deposu: sayfa -> { t, c (kod), L (çözülmüş) } */
      G: {},            /* izleyen: liderden gelen sayfa kayıtları (yalnız gösterilir) */
      hazir: false, depo: 'idb',
      geri: [],         /* geri al */
      cz: null,         /* yazılan çizgi */
      bekle: null,      /* sayfanın dışında başlayan çizgi: sayfaya girince başlar */
      sil: null,        /* silgi hareketi */
      dok: {},          /* kalem kipinde ekrandaki parmaklar */
      iki: null,        /* iki parmakla gezinme */
      uzak: {},         /* izleyen: yazılmakta olan uzak çizgiler */
      gitti: {},        /* lider: izleyene yollanan sayfaların imzası */
      rol: '', say: 0, on: Math.random().toString(36).slice(2, 6),
      tus: null, palet: null, liste: null, imlec: null, temizZ: 0,
      ileri: [],        /* yinele (25.10.2026) */
      ayar: null, ayarGor: false, takip: true, kucuk: false,
      son: null,        /* en son yazılan yer (sayfa birimi): şerit onun yakınında durur */
      yer: null, seritR: null, yolver: false,
      parmak: false, parmakT: null,  /* parmakla gez (kalem uçlu cihaz): açık mı · bu cihazdaki seçim (1/0; yoksa null) */
      sabit: null,      /* taşınmış şeridin yeri { k: ''|'sol'|'sag', x, y } (0-1; kenardaysa dikey) */
      sonGez: false     /* son dokunuş gezinme miydi: kitabın içindeki tıklamaya izin */
    };
    function kalemAcik() { return !!(KK && KK.acik); }
    /* İMLEÇ / PARMAK (25.10.2026): kalem açıkken de sayfada gezilebilsin. Şeritteki imleçte
       (KK.arac 'g') her dokunuş, «Parmakla gez»de (KK.parmak: kalem uçlu cihaz) parmak
       dokunuşu gezer — kalem kapalıymış gibi: sürükle, kaydırıp çevir, dokunup büyüt, ses
       düğmeleri. Kalem ucu ve fare yazmayı sürdürür (kkBas kendi dokunuşunu yakalar). */
    function kalemYazar() { return !!(KK && KK.acik && KK.arac !== 'g' && !KK.parmak); }
    function kkGezinir(e) { return !KK || !KK.acik || KK.arac === 'g' || (!!KK.parmak && !!e && e.pointerType === 'touch'); }

    /* ---------- kayıt biçimi ----------
       Çizgi: araç harfi ('k' kalem, 'f' fosforlu) + renk rakamı + kalınlık
       harfi ('i','o','k') + noktalar. Noktalar yarım birim hassasiyetle tam
       sayıya çevrilir, ardışık farklar defterdeki gibi "polyline"
       kodlamasıyla (ASCII 63-126) yazılır. Sayfa: çizgiler boşlukla. */
    function kkSayiYaz(n, out) {
      var v = n < 0 ? ~(n << 1) : (n << 1);
      while (v >= 0x20) { out.push(String.fromCharCode((0x20 | (v & 0x1f)) + 63)); v >>= 5; }
      out.push(String.fromCharCode(v + 63));
    }
    function kkSayiOku(s) {
      var res = [], i = 0, n = s.length;
      while (i < n) {
        var b, kay = 0, r = 0;
        do { b = s.charCodeAt(i++) - 63; r |= (b & 0x1f) << kay; kay += 5; } while (b >= 0x20 && i <= n);
        res.push((r & 1) ? ~(r >> 1) : (r >> 1));
      }
      return res;
    }
    function kkNoktaKodla(p) {
      var out = [], px = 0, py = 0;
      for (var i = 0; i + 1 < p.length; i += 2) {
        var x = Math.round(p[i] * 2), y = Math.round(p[i + 1] * 2);
        kkSayiYaz(x - px, out); kkSayiYaz(y - py, out); px = x; py = y;
      }
      return out.join('');
    }
    function kkNoktaCoz(s) {
      var n = kkSayiOku(String(s || '')), p = [], x = 0, y = 0;
      for (var i = 0; i + 1 < n.length; i += 2) { x += n[i]; y += n[i + 1]; p.push(x / 2, y / 2); }
      return p;
    }
    function kkKodla(c) { return c.a + String(c.r) + c.w + kkNoktaKodla(c.p); }
    function kkCoz(t) {
      if (!t || t.length < 4) return null;
      var a = t.charAt(0);
      if (a !== 'k' && a !== 'f') return null;
      var r = parseInt(t.charAt(1), 10), w = t.charAt(2);
      if (!(r >= 0)) r = 0;
      if (a === 'k' && r >= KK_RENK.length) r = 1;
      if (a === 'f' && r >= KK_FOS.length) r = 0;
      if (!KK_KALIN[w]) w = 'o';
      var p = kkNoktaCoz(t.slice(3));
      return p.length ? { a: a, r: r, w: w, p: p } : null;
    }
    function kkSayfaCoz(c) { return String(c || '').split(' ').map(kkCoz).filter(Boolean); }
    function kkCizgiler(rec) { if (!rec) return []; if (!rec.L) rec.L = kkSayfaCoz(rec.c); return rec.L; }
    function kkImza(rec) { return rec ? rec.t + ':' + (rec.c || '').length : '0'; }

    /* ---------- depo: IndexedDB, olmazsa localStorage ---------- */
    var kkIdb = null;
    function kkIdbAc() {
      if (kkIdb) return kkIdb;
      kkIdb = new Promise(function (ok, red) {
        try {
          if (!window.indexedDB) { red(new Error('IndexedDB yok')); return; }
          var r = indexedDB.open(KK_DB, 1);
          r.onupgradeneeded = function () {
            var db = r.result;
            if (!db.objectStoreNames.contains(KK_DEPO)) db.createObjectStore(KK_DEPO, { keyPath: 'id' }).createIndex('kitap', 'kitap');
          };
          r.onsuccess = function () { ok(r.result); };
          r.onerror = function () { red(r.error || new Error('IndexedDB açılamadı')); };
          r.onblocked = function () { red(new Error('IndexedDB meşgul')); };
        } catch (e) { red(e); }
      });
      kkIdb.catch(function () { });
      return kkIdb;
    }
    function kkLsAnahtar() { return 'kitapKalem|' + KK_KITAP; }
    function kkLsOku() { try { return JSON.parse(localStorage.getItem(kkLsAnahtar()) || '{}') || {}; } catch (e) { return {}; } }
    function kkLsYaz() {
      var o = {};
      for (var s in KK.M) o[s] = { t: KK.M[s].t, c: KK.M[s].c };
      try { localStorage.setItem(kkLsAnahtar(), JSON.stringify(o)); }
      catch (e) { kkTost('Yazılar saklanamadı: tarayıcının deposu dolu'); }
    }
    function kkOku() {
      var ls = kkLsOku();                                   /* eskiden (IndexedDB yokken) yazılanlar */
      return kkIdbAc().then(function (db) {
        return new Promise(function (ok, red) {
          var L = {};
          try {
            var q = db.transaction(KK_DEPO, 'readonly').objectStore(KK_DEPO).index('kitap').openCursor(IDBKeyRange.only(KK_KITAP));
            q.onsuccess = function () {
              var c = q.result;
              if (c) { var v = c.value || {}; L[v.s] = { t: +v.t || 0, c: v.c || '' }; c.continue(); }
              else ok(L);
            };
            q.onerror = function () { red(q.error); };
          } catch (e) { red(e); }
        });
      }).then(function (L) {
        KK.depo = 'idb';
        for (var s in ls) if (ls[s] && (!L[s] || (+ls[s].t || 0) > L[s].t)) { L[s] = { t: +ls[s].t || 0, c: ls[s].c || '' }; kkKaydet(s); }
        return L;
      }, function () { KK.depo = 'ls'; return ls; });
    }
    var kkYazBek = {}, kkYazZ = 0;
    function kkKaydet(s) { kkYazBek[s] = 1; if (!kkYazZ) kkYazZ = setTimeout(kkYazGonder, 200); }
    function kkYazGonder() {
      kkYazZ = 0;
      var L = Object.keys(kkYazBek);
      kkYazBek = {};
      if (!L.length) return;
      if (KK.depo !== 'idb') { kkLsYaz(); return; }
      kkIdbAc().then(function (db) {
        var tx = db.transaction(KK_DEPO, 'readwrite'), st = tx.objectStore(KK_DEPO);
        L.forEach(function (s) {
          var r = KK.M[s];
          if (r) st.put({ id: KK_KITAP + '|' + s, kitap: KK_KITAP, s: +s, t: r.t, c: r.c || '' });
        });
        tx.onerror = function () { KK.depo = 'ls'; kkLsYaz(); };
      }, function () { KK.depo = 'ls'; kkLsYaz(); });
    }
    window.addEventListener('pagehide', function () { if (kkYazZ) { clearTimeout(kkYazZ); kkYazGonder(); } });

    /* bu cihazın deposunda bir sayfanın yeni hâli */
    function kkSayfaYaz(s, L, ek) {
      var r = KK.M[s], kod;
      if (ek && r && r.L === L && r.c) kod = r.c + ' ' + kkKodla(L[L.length - 1]);   /* sona eklendi */
      else kod = L.map(kkKodla).join(' ');
      KK.M[s] = { t: Math.max(Date.now(), r ? r.t + 1 : 0), c: kod, L: L };
      kkKaydet(s);
    }
    /* izleyen: liderden gelen kayıt kendi deposundakinden yeniyse onu da sakla */
    function kkBirlestir(s, rec) {
      if (!(rec.t > 0)) return;
      var o = KK.M[s];
      if (o && o.t >= rec.t) return;
      KK.M[s] = { t: rec.t, c: rec.c, L: null };
      kkKaydet(s);
    }

    /* ---------- yardımcılar ---------- */
    function kkR(v) { return Math.round(v * 10) / 10; }
    function kkTost(m) {
      var t = document.getElementById('tost');
      if (t) {
        t.textContent = m; t.classList.add('gor');
        clearTimeout(t._kkZ); t._kkZ = setTimeout(function () { t.classList.remove('gor'); }, 2600);
        return;
      }
      if (bilgi) { bilgi.textContent = m; bilgi.classList.add('gor'); setTimeout(function () { if (z.o <= 1.02) bilgi.classList.remove('gor'); }, 2600); }
    }
    function kkMisafirKip() { return !!(TK && TK.k && TK.canli && tkIzleyen()); }
    /* izleyende kabuğun yinelediği tık / tuş: yazıyı değiştiren işi yapma (sonucu kanaldan gelir) */
    function kkYanki(e) {
      if (!kkMisafirKip()) return false;
      try { e = e || window.event; return !!(e && e.isTrusted === false); } catch (x) { return false; }
    }
    function kkSayfaAdi(s) {
      try { if (flip.etiket) { var e = flip.etiket(s); if (e) return /^\d+$/.test(String(e)) ? 's. ' + e : String(e); } } catch (x) { }
      var K = window.KITAP_VERI || window.KITAP6;          /* MEB kitapları (uygulama.js'teki etiket() ile aynı) */
      if (K && K.fark != null) {
        var pr = s - K.fark, son = K.sonBasili || (K.toplam - K.fark - 2);
        if (pr >= 1 && pr <= son) return 's. ' + pr;
        if (s === 1) return 'Kapak';
        if (s === K.toplam) return 'Arka kapak';
        return pr < 1 ? 'İç kapak' : 'Sayfa ' + s;
      }
      return 's. ' + s;
    }
    function kkZaman(t) {
      var d = new Date(t), b = new Date();
      if (isNaN(d.getTime())) return '';
      var g0 = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
      var saat = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
      if (t >= g0) return 'bugün ' + saat;
      if (t >= g0 - 864e5) return 'dün ' + saat;
      if (t >= g0 - 6 * 864e5) return d.toLocaleDateString('tr-TR', { weekday: 'long' }) + ' ' + saat;
      return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) + (d.getFullYear() !== b.getFullYear() ? ' ' + d.getFullYear() : '');
    }
    function kkEsc(x) { return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

    /* ---------- sayfalar ve ekrandaki yerleri ---------- */
    function kkYuz(s) { return flip.kitap ? flip.kitap.querySelector('.yuz[data-sayfa="' + s + '"]') : null; }
    function kkGorunen() {                                       /* ekranda açık sayfalar */
      if (flip.tekli) return [flip.aktif];
      var L = [], a = flip.solSayfa(), b = flip.sagSayfa();
      if (a) L.push(a); if (b) L.push(b);
      return L;
    }
    function kkYayilim() {                                       /* açık yayılımın sayfaları (tek sayfada da ikisi) */
      var L = [], a = flip.solSayfa(), b = flip.sagSayfa();
      if (a) L.push(a); if (b) L.push(b);
      if (!L.length) L.push(flip.aktif || 1);
      return L;
    }
    function kkNoktadaki(x, y) {
      var L = kkGorunen();
      for (var i = 0; i < L.length; i++) {
        var yz = kkYuz(L[i]);
        if (!yz || !yz.querySelector('.katman')) continue;
        var r = yz.getBoundingClientRect();
        if (r.width > 4 && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return { s: L[i], yuz: yz, r: r };
      }
      return null;
    }
    function kkBirim(o, x, y) { return [(x - o.r.left) / o.r.width * KK_EN, (y - o.r.top) / o.r.height * KK_BOY]; }

    /* ---------- çizim (SVG) ---------- */
    function kkGosterilen(s) { return (kkMisafirKip() && KK.G[s]) || KK.M[s] || null; }
    function kkSvg(yuz, yap) {
      var v = yuz._kkSvg, kat = yuz.querySelector('.katman');
      if (v && v.parentNode === yuz) {
        if (kat && v.nextSibling !== kat) yuz.insertBefore(v, kat);    /* sonradan gelen katmanlar (metin) altında kalsın */
        return v;
      }
      if (!yap || !kat) return null;                                  /* boş yüz (toplamın ötesi) */
      v = document.createElementNS(KK_NS, 'svg');
      v.setAttribute('class', 'kk-m');
      v.setAttribute('viewBox', '0 0 ' + KK_EN + ' ' + KK_BOY);
      v.setAttribute('preserveAspectRatio', 'none');
      v.setAttribute('aria-hidden', 'true');
      v.setAttribute('focusable', 'false');
      ['kk-gf', 'kk-gk'].forEach(function (s) {                       /* fosforlu altta, kalem üstte */
        var g = document.createElementNS(KK_NS, 'g'); g.setAttribute('class', s); v.appendChild(g);
      });
      yuz.insertBefore(v, kat);
      yuz._kkSvg = v;
      return v;
    }
    function kkD(p) {
      var n = p.length / 2;
      if (!n) return '';
      var d = 'M' + kkR(p[0]) + ' ' + kkR(p[1]);
      if (n === 1) return d + 'l.01 0';
      if (n === 2) return d + 'L' + kkR(p[2]) + ' ' + kkR(p[3]);
      for (var i = 1; i < n - 1; i++) {
        var x = p[2 * i], y = p[2 * i + 1];
        d += 'Q' + kkR(x) + ' ' + kkR(y) + ' ' + kkR((x + p[2 * i + 2]) / 2) + ' ' + kkR((y + p[2 * i + 3]) / 2);
      }
      return d + 'L' + kkR(p[2 * n - 2]) + ' ' + kkR(p[2 * n - 1]);
    }
    function kkYolYaz(e, c) {
      var fos = c.a === 'f';
      e.setAttribute('d', kkD(c.p));
      e.setAttribute('stroke', fos ? (KK_FOS[c.r] || KK_FOS[0]) : (KK_RENK[c.r] || KK_RENK[1]));
      e.setAttribute('stroke-width', fos ? KK_FKALIN[c.w] : KK_KALIN[c.w]);
      e.setAttribute('class', fos ? 'kk-f' : 'kk-k');
    }
    function kkYol(c) { var e = document.createElementNS(KK_NS, 'path'); kkYolYaz(e, c); return e; }
    function kkGrup(v, c) { return c.a === 'f' ? v.firstChild : v.lastChild; }
    /* sayfanın yazısını (gerekiyorsa) yeniden çiz */
    function kkSayfaCiz(s, zorla) {
      if (!(s >= 1) || s > flip.toplam) return;
      var yuz = kkYuz(s);
      if (!yuz) return;
      var rec = kkGosterilen(s), L = kkCizgiler(rec);
      var an = rec ? (rec === KK.G[s] ? 'g' : 'm') + kkImza(rec) : '-';
      var v = kkSvg(yuz, L.length > 0);
      if (!zorla && yuz._kkAn === an) return;
      yuz._kkAn = an;
      if (!v) return;
      var gf = v.firstChild, gk = v.lastChild;
      while (gf.firstChild) gf.removeChild(gf.firstChild);
      while (gk.firstChild) gk.removeChild(gk.firstChild);
      for (var i = 0; i < L.length; i++) kkGrup(v, L[i]).appendChild(kkYol(L[i]));
      /* yazılmakta olan çizgiler (bu cihazda ya da kumandada) yerinde kalsın */
      if (KK.cz && KK.cz.s === s && KK.cz.el) kkGrup(v, KK.cz.c).appendChild(KK.cz.el);
      for (var k in KK.uzak) { var u = KK.uzak[k]; if (u.s === s && u.el) kkGrup(v, u.c).appendChild(u.el); }
    }
    /* sayfaya yalnız sona eklenen çizgiler: ekrandaki hâl bir önceki kayıtsa bütün sayfa yeniden çizilmez
       (çok yazılı sayfada her çizgide yüzlerce yol kurulmasın) */
    function kkSayfaEkle(s, onceki, yeniler) {
      var yuz = kkYuz(s), rec = kkGosterilen(s);
      if (!yuz || !rec || yuz._kkAn !== onceki) { kkSayfaCiz(s); return; }
      var v = kkSvg(yuz, true);
      if (!v) { kkSayfaCiz(s); return; }
      for (var i = 0; i < yeniler.length; i++) {
        var e = kkYol(yeniler[i]), g = kkGrup(v, yeniler[i]);
        if (KK.cz && KK.cz.s === s && KK.cz.el && KK.cz.el.parentNode === g) g.insertBefore(e, KK.cz.el);
        else g.appendChild(e);
      }
      yuz._kkAn = (rec === KK.G[s] ? 'g' : 'm') + kkImza(rec);
    }
    /* açık yayılım ve komşuları */
    function kkTazele(zorla) {
      if (!KK || !flip.yapraklar) return;
      var a = Math.max(0, flip.c - 2), b = Math.min(flip.yaprakSayisi - 1, flip.c + 2);
      for (var i = a; i <= b; i++) { kkSayfaCiz(2 * i + 1, zorla); kkSayfaCiz(2 * i + 2, zorla); }
    }

    /* ---------- yazma ---------- */
    function kkCizBasla(e, o) {
      var b = kkBirim(o, e.clientX, e.clientY), fos = KK.arac === 'f';
      var c = { a: fos ? 'f' : 'k', r: fos ? 0 : KK.renk, w: KK.kal, p: [kkR(b[0]), kkR(b[1])] };
      var olcek = o.r.width / KK_EN;                               /* ekranda bir birimin pikseli */
      KK.cz = { id: e.pointerId, s: o.s, o: o, c: c, t0: Date.now(), sx: b[0], sy: b[1], hx: b[0], hy: b[1],
                adim: Math.max(0.3, 0.9 / olcek), yum: e.pointerType === 'touch' ? 0.5 : 0.72, el: kkYol(c), k: '', g: 0 };
      var v = kkSvg(o.yuz, true);
      if (v) kkGrup(v, c).appendChild(KK.cz.el);
      KK.seritR = kkSeritKutu();
      kkCanliBasla();
    }
    function kkCizEkle(cz, x, y) {
      var b = kkBirim(cz.o, x, y);
      cz.hx = b[0]; cz.hy = b[1];
      cz.sx += (b[0] - cz.sx) * cz.yum; cz.sy += (b[1] - cz.sy) * cz.yum;   /* titremeyi yumuşat (dokunmatik tahta) */
      var p = cz.c.p, lx = p[p.length - 2], ly = p[p.length - 1];
      if (Math.abs(cz.sx - lx) + Math.abs(cz.sy - ly) < cz.adim) return false;
      p.push(kkR(cz.sx), kkR(cz.sy));
      return true;
    }
    var kkCizRaf = 0;
    function kkCizZamanla() {
      if (kkCizRaf) return;
      kkCizRaf = (window.requestAnimationFrame || setTimeout)(function () {
        kkCizRaf = 0;
        if (KK.cz && KK.cz.el) KK.cz.el.setAttribute('d', kkD(KK.cz.c.p));
      });
    }
    /* Ramer-Douglas-Peucker: kayıt küçük kalsın */
    function kkSadelestir(p, eps) {
      var n = p.length / 2;
      if (n < 3) return p;
      var tut = [], yig = [[0, n - 1]], e2 = eps * eps;
      tut[0] = tut[n - 1] = 1;
      while (yig.length) {
        var ab = yig.pop(), a = ab[0], b = ab[1];
        var ax = p[2 * a], ay = p[2 * a + 1], dx = p[2 * b] - ax, dy = p[2 * b + 1] - ay, L2 = dx * dx + dy * dy, en = -1, ei = -1;
        for (var i = a + 1; i < b; i++) {
          var px = p[2 * i] - ax, py = p[2 * i + 1] - ay, d;
          if (!L2) d = px * px + py * py;
          else { var t = (px * dx + py * dy) / L2; t = t < 0 ? 0 : (t > 1 ? 1 : t); var qx = px - t * dx, qy = py - t * dy; d = qx * qx + qy * qy; }
          if (d > en) { en = d; ei = i; }
        }
        if (ei > 0 && en > e2) { tut[ei] = 1; yig.push([a, ei], [ei, b]); }
      }
      var out = [];
      for (var j = 0; j < n; j++) if (tut[j]) out.push(p[2 * j], p[2 * j + 1]);
      return out;
    }
    function kkCizBitir() {
      var cz = KK.cz;
      if (!cz) return;
      KK.cz = null;
      if (cz.el && cz.el.parentNode) cz.el.parentNode.removeChild(cz.el);
      var c = cz.c, p = c.p;
      /* parmağın kalktığı yere kadar (yumuşatma geride bırakmasın) */
      if (Math.abs(cz.hx - p[p.length - 2]) + Math.abs(cz.hy - p[p.length - 1]) > cz.adim * 0.5) p.push(kkR(cz.hx), kkR(cz.hy));
      c.p = kkSadelestir(p, 0.3);
      var rec = KK.M[cz.s], L = kkCizgiler(rec), onceki = rec ? 'm' + kkImza(rec) : '-';
      L.push(c);
      kkSayfaYaz(cz.s, L, true);
      KK.geri.push({ t: 'ekle', s: cz.s, c: c });
      if (KK.geri.length > 120) KK.geri.shift();
      KK.ileri = [];
      kkSayfaEkle(cz.s, onceki, [c]);
      kkGonder([cz.s], cz.k);
      kkSonYaz(cz.s, c.p, (c.a === 'f' ? KK_FKALIN[c.w] : KK_KALIN[c.w]) / 2 + 2);
      kkSeritBirak();
    }
    function kkCizAt() {                                           /* iki parmak indi: yeni başlamış çizgi kıstırmanın ilk parmağıydı */
      var cz = KK.cz;
      if (!cz) return;
      KK.cz = null;
      if (cz.el && cz.el.parentNode) cz.el.parentNode.removeChild(cz.el);
      if (cz.k && tkLider()) { try { TK.k.gonder({ t: 'kx', k: cz.k, bk: KK_KITAP }); } catch (e) { } }
      kkSeritBirak();
    }

    /* ---------- silgi: dokunduğu çizgiyi siler ---------- */
    function kkUzaklik(px, py, ax, ay, bx, by) {
      var dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy, t = L2 ? ((px - ax) * dx + (py - ay) * dy) / L2 : 0;
      t = t < 0 ? 0 : (t > 1 ? 1 : t);
      var qx = ax + t * dx - px, qy = ay + t * dy - py;
      return Math.sqrt(qx * qx + qy * qy);
    }
    function kkKesisir(ax, ay, bx, by, cx, cy, dx, dy) {
      function yon(px, py, qx, qy, rx, ry) { return (qx - px) * (ry - py) - (qy - py) * (rx - px); }
      var d1 = yon(cx, cy, dx, dy, ax, ay), d2 = yon(cx, cy, dx, dy, bx, by), d3 = yon(ax, ay, bx, by, cx, cy), d4 = yon(ax, ay, bx, by, dx, dy);
      return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
    }
    function kkDegiyor(c, ax, ay, bx, by, rr) {
      var p = c.p, n = p.length / 2, w = (c.a === 'f' ? KK_FKALIN[c.w] : KK_KALIN[c.w]) / 2, s = rr + w;
      var x0 = Math.min(ax, bx) - s, x1 = Math.max(ax, bx) + s, y0 = Math.min(ay, by) - s, y1 = Math.max(ay, by) + s;
      for (var i = 0; i < n; i++) {
        var x = p[2 * i], y = p[2 * i + 1];
        if (n === 1) return x >= x0 && x <= x1 && y >= y0 && y <= y1 && kkUzaklik(x, y, ax, ay, bx, by) <= s;
        if (i === n - 1) break;
        var x2 = p[2 * i + 2], y2 = p[2 * i + 3];
        if (Math.max(x, x2) < x0 || Math.min(x, x2) > x1 || Math.max(y, y2) < y0 || Math.min(y, y2) > y1) continue;
        if (kkKesisir(ax, ay, bx, by, x, y, x2, y2)) return true;
        if (Math.min(kkUzaklik(ax, ay, x, y, x2, y2), kkUzaklik(bx, by, x, y, x2, y2),
                     kkUzaklik(x, y, ax, ay, bx, by), kkUzaklik(x2, y2, ax, ay, bx, by)) <= s) return true;
      }
      return false;
    }
    function kkSilgiYaricap(e) { return e && e.pointerType === 'mouse' ? 14 : 24; }   /* ekranda piksel */
    function kkSilgiBasla(e) {
      KK.sil = { id: e.pointerId, son: null, once: {}, rp: kkSilgiYaricap(e) };
      KK.seritR = kkSeritKutu();
      kkSilgiAdim(e.clientX, e.clientY);
    }
    function kkSilgiAdim(x, y) {
      var S = KK.sil;
      if (!S) return;
      var o = kkNoktadaki(x, y);
      if (!o) { S.son = null; return; }
      var b = kkBirim(o, x, y), rr = S.rp / (o.r.width / KK_EN);
      var a = (S.son && S.son.s === o.s) ? S.son : { s: o.s, x: b[0], y: b[1] };
      S.son = { s: o.s, x: b[0], y: b[1] };
      var rec = KK.M[o.s], L = kkCizgiler(rec);
      if (!L.length) return;
      var kalan = [];
      for (var i = 0; i < L.length; i++) if (!kkDegiyor(L[i], a.x, a.y, b[0], b[1], rr)) kalan.push(L[i]);
      if (kalan.length === L.length) return;
      if (!S.once[o.s]) S.once[o.s] = L;
      kkSayfaYaz(o.s, kalan);
      kkSonYaz(o.s, [b[0], b[1]], rr);
      kkSayfaCiz(o.s);
      kkGonder([o.s]);
    }
    function kkSilgiBitir() {
      var S = KK.sil;
      KK.sil = null;
      if (S && Object.keys(S.once).length) { KK.geri.push({ t: 'liste', s: S.once }); if (KK.geri.length > 120) KK.geri.shift(); KK.ileri = []; }
      kkSilgiImlec(null);
      kkSeritBirak();
    }
    function kkSilgiImlec(e) {
      var im = KK.imlec;
      if (!im) {
        if (!e) return;
        im = KK.imlec = document.createElement('div');
        im.className = 'kk-silgi-imlec';
        sahne.appendChild(im);
      }
      if (!e || !KK.acik || (KK.arac !== 's' && !KK.sil)) { im.classList.remove('gor'); return; }
      var r = sahne.getBoundingClientRect(), d = 2 * kkSilgiYaricap(e);
      im.style.width = im.style.height = d + 'px';
      im.style.left = (e.clientX - r.left) + 'px'; im.style.top = (e.clientY - r.top) + 'px';
      im.classList.add('gor');
    }

    /* ---------- geri al · temizle ---------- */
    function kkGoster(s) {                                         /* değişen sayfa ekranda değilse aç */
      if (kkGorunen().indexOf(s) >= 0 || kkMisafirKip()) return;
      if (z.o > 1.02 || z.x || z.y) { z.o = 1; z.x = 0; z.y = 0; zUygula(false); }
      flip.git(s);
    }
    /* geri al ve yinele (25.10.2026) aynı kayıtla çalışır: 'ekle' tek çizgi,
       'liste' sayfaların önceki hâli. Geri alınan yinele yığınına, yinelenen
       geri al yığınına geçer; yeni yazı / silgi / temizle yineleyi boşaltır. */
    function kkUygula(a, ters) {
      var degisen = [];
      if (a.t === 'ekle') {
        var L = kkCizgiler(KK.M[a.s]).slice();
        if (ters) {
          var i = L.lastIndexOf(a.c);
          if (i < 0) { kkTost('Bu yazı başka cihazda değişmiş, geri alınamadı'); return null; }
          L.splice(i, 1);
        } else L.push(a.c);
        kkSayfaYaz(a.s, L); degisen.push(a.s);
        return { a: a, d: degisen };
      }
      var once = {};
      for (var s in a.s) { once[s] = kkCizgiler(KK.M[+s]); kkSayfaYaz(+s, a.s[s].slice()); degisen.push(+s); }
      return { a: { t: 'liste', s: once }, d: degisen };
    }
    function kkGeriYineleBitir(degisen) {
      degisen.forEach(function (n) { kkSayfaCiz(n); });
      kkGonder(degisen);
      if (degisen.length) kkGoster(degisen[0]);
      kkGeriDurum();
    }
    function kkGeriAl() {
      var a = KK.geri.pop();
      if (!a) { kkTost('Geri alınacak yazı yok'); kkGeriDurum(); return; }
      var r = kkUygula(a, true);
      if (!r) { kkGeriDurum(); return; }
      KK.ileri.push(r.a);
      if (KK.ileri.length > 120) KK.ileri.shift();
      kkGeriYineleBitir(r.d);
    }
    function kkIleriAl() {
      var a = KK.ileri.pop();
      if (!a) { kkTost('Yinelenecek yazı yok'); kkGeriDurum(); return; }
      var r = kkUygula(a, false);
      if (!r) { kkGeriDurum(); return; }
      KK.geri.push(r.a);
      if (KK.geri.length > 120) KK.geri.shift();
      kkGeriYineleBitir(r.d);
    }
    function kkTemizle() {
      var L = kkGorunen().filter(function (s) { return kkCizgiler(KK.M[s]).length > 0; });
      if (!L.length) { kkTost('Bu sayfada yazı yok'); return; }
      var once = {};
      L.forEach(function (s) { once[s] = kkCizgiler(KK.M[s]); kkSayfaYaz(s, []); kkSayfaCiz(s); });
      KK.geri.push({ t: 'liste', s: once });
      KK.ileri = [];
      kkGonder(L);
      kkGeriDurum();
      kkTost((L.length > 1 ? 'İki sayfanın' : 'Sayfanın') + ' yazıları silindi · «Geri al» ile dönebilirsin');
    }

    /* ---------- dokunuşlar (kalem kipinde) ---------- */
    function kkBas(e) {
      if (!KK.acik || !e.target || !e.target.closest || !e.target.closest('.kitap')) return;
      if (e.pointerType === 'pen') kkKalemUcu();                  /* kalem ucu: parmak gezsin */
      KK.sonGez = kkGezinir(e);
      if (KK.sonGez) return;                                      /* imleç / parmak: sayfada gezer */
      if (panelAcik() || tanitimAcik) return;
      if (e.pointerType === 'mouse' && e.button !== 0) { e.stopPropagation(); return; }   /* sağ / orta tuş yaprağı sürüklemesin */
      e.preventDefault(); e.stopPropagation();
      if (kkMisafirKip()) return;                                 /* Sınıf Ekranı: yazı kumandadan gelir */
      kkListeKapat();
      if (KK.ayarGor && !kkAyarIcMi()) { KK.ayarGor = false; kkPaletGuncelle(); }   /* açılır ayar kutusu: yazmaya başlayınca kapanır */
      KK.dok[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (Object.keys(KK.dok).length >= 2) { kkIkiBasla(); return; }
      if (flip.animasyonda) return;
      try { sahne.setPointerCapture(e.pointerId); } catch (x) { }
      /* kalemin silgi ucu (Surface, Wacom): o dokunuşta silgi */
      if (KK.arac === 's' || (e.pointerType === 'pen' && (e.button === 5 || (e.buttons & 32)))) { kkSilgiBasla(e); kkSilgiImlec(e); return; }
      var o = kkNoktadaki(e.clientX, e.clientY);
      if (!o) { KK.bekle = { id: e.pointerId }; return; }
      kkCizBasla(e, o);
    }
    function kkOynat(e) {
      var d = KK.dok[e.pointerId];
      if (d) { d.x = e.clientX; d.y = e.clientY; }
      if (KK.iki) { if (d) { e.preventDefault(); kkIkiOynat(); } return; }
      if (KK.sil && KK.sil.id === e.pointerId) {
        kkSilgiImlec(e);
        kkYolVer(e.clientX, e.clientY);
        var ls = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
        if (!ls.length) ls = [e];
        for (var j = 0; j < ls.length; j++) kkSilgiAdim(ls[j].clientX, ls[j].clientY);
        return;
      }
      if (KK.acik && KK.arac === 's' && e.pointerType === 'mouse') kkSilgiImlec(e.target && e.target.closest && e.target.closest('.kitap') ? e : null);   /* fareyle gezinirken */
      if (KK.bekle && KK.bekle.id === e.pointerId) {
        var o0 = kkNoktadaki(e.clientX, e.clientY);
        if (o0) { KK.bekle = null; kkCizBasla(e, o0); }
        return;
      }
      var cz = KK.cz;
      if (!cz || cz.id !== e.pointerId) return;
      e.preventDefault();
      var L = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
      if (!L.length) L = [e];
      var yeni = false;
      for (var i = 0; i < L.length; i++) {
        var ev = L[i], b = kkBirim(cz.o, ev.clientX, ev.clientY);
        if (b[0] < -2 || b[0] > KK_EN + 2 || b[1] < -2 || b[1] > KK_BOY + 2) {
          /* öbür sayfaya geçti: bu çizgi biter, orada yenisi başlar */
          var o = kkNoktadaki(ev.clientX, ev.clientY);
          if (o && o.s !== cz.s) { kkCizEkle(cz, ev.clientX, ev.clientY); kkCizBitir(); kkCizBasla(ev, o); cz = KK.cz; yeni = true; continue; }
        }
        if (kkCizEkle(cz, ev.clientX, ev.clientY)) yeni = true;
      }
      if (yeni) { kkCizZamanla(); kkCanliZamanla(); kkYolVer(e.clientX, e.clientY); }
    }
    function kkBirak(e) {
      var d = KK.dok[e.pointerId];
      delete KK.dok[e.pointerId];
      if (KK.iki) { if (Object.keys(KK.dok).length < 2) KK.iki = null; if (d) e.stopPropagation(); return; }
      if (KK.bekle && KK.bekle.id === e.pointerId) KK.bekle = null;
      if (KK.sil && KK.sil.id === e.pointerId) { kkSilgiBitir(); if (e.pointerType === 'mouse') kkSilgiImlec(e); return; }
      if (KK.cz && KK.cz.id === e.pointerId) {
        if (e.type === 'pointerup') kkCizEkle(KK.cz, e.clientX, e.clientY);
        kkCizBitir();
      }
    }
    /* iki parmak: kıstırma kitapzoom'un dokunuş işleyicisinde; burada gezinme */
    function kkOrta() {
      var k = Object.keys(KK.dok), a = KK.dok[k[0]], b = KK.dok[k[1]];
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
    function kkIkiBasla() {
      var cz = KK.cz;
      if (cz) { if (Date.now() - cz.t0 < 280 || cz.c.p.length < 10) kkCizAt(); else kkCizBitir(); }
      KK.bekle = null;
      if (KK.sil) kkSilgiBitir();
      KK.iki = kkOrta();
    }
    function kkIkiOynat() {
      if (Object.keys(KK.dok).length < 2) return;
      var o = kkOrta(), dx = o.x - KK.iki.x, dy = o.y - KK.iki.y;
      KK.iki = o;
      if (AKICI) return;                                  /* akıcı pinch kaydırmayı da yapar (5. bölüm) */
      if (z.o <= 1.02 || (!dx && !dy)) return;
      z.x += dx; z.y += dy;
      sinirla(); zUygula(false);
    }
    sahne.addEventListener('pointerdown', kkBas, true);
    kok.addEventListener('pointermove', kkOynat, true);
    kok.addEventListener('pointerup', kkBirak, true);
    kok.addEventListener('pointercancel', kkBirak, true);
    sahne.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !KK.sil) kkSilgiImlec(null); });
    sahne.addEventListener('contextmenu', function (e) { if (kalemYazar() && e.target.closest && e.target.closest('.kitap')) e.preventDefault(); });
    /* kalem kipinde kitabın içindeki tıklamalar (ses düğmesi, bağlantı) bir şey açmasın */
    sahne.addEventListener('click', function (e) {
      if (KK.acik && !KK.sonGez && e.target.closest && e.target.closest('.kitap')) { e.preventDefault(); e.stopPropagation(); }   /* imleçte / parmakla açar */
    }, true);

    /* ---------- tahtaya yansıtma (7. bölümün kanalı) ---------- */
    function kkKayitListe(L) {
      return L.map(function (s) {
        var r = KK.M[s];
        KK.gitti[s] = kkImza(r);
        return r && r.c ? { s: s, t: r.t, c: r.c } : { s: s, t: r ? r.t : 0 };
      });
    }
    /* lider: değişen sayfalar (bitti: biten çizginin anahtarı) */
    function kkGonder(L, bitti) {
      if (!TK || !TK.k || !L.length || !tkLider()) return;
      var m = { t: 'kb', bk: KK_KITAP, L: kkKayitListe(L) };
      if (bitti) m.bit = bitti;
      try { TK.k.gonder(m); } catch (e) { }
    }
    /* lider: açık yayılımın yazısı izleyendekinden farklıysa */
    function kkYayilimGonder() {
      if (!TK || !TK.k || !tkLider()) return;
      var L = kkYayilim().filter(function (s) { return KK.gitti[s] !== kkImza(KK.M[s]); });
      if (L.length) kkGonder(L);
    }
    function kkAnlik() {                                           /* anlık durumda (t:'h') yayılımın yazısı */
      if (!KK || !KK.hazir) return null;
      return { bk: KK_KITAP, L: kkKayitListe(kkYayilim()) };
    }
    function kkCanliBasla() {
      var cz = KK.cz;
      if (!cz || !TK || !TK.k || !tkLider()) return;
      cz.k = KK.on + (++KK.say);
      kkCanliZamanla();
    }
    var kkCanliZ = 0;
    function kkCanliZamanla() { if (KK.cz && KK.cz.k && !kkCanliZ) kkCanliZ = setTimeout(kkCanliGonder, 50); }
    function kkCanliGonder() {
      kkCanliZ = 0;
      var cz = KK.cz;
      if (!cz || !cz.k || cz.c.p.length <= cz.g || !tkLider()) return;
      var bas = cz.g;
      cz.g = cz.c.p.length;
      try {
        TK.k.gonder({ t: 'kc', bk: KK_KITAP, k: cz.k, s: cz.s, a: cz.c.a, r: cz.c.r, w: cz.c.w, b: bas / 2, d: kkNoktaKodla(cz.c.p.slice(bas)) });
      } catch (e) { }
    }
    /* izleyen: gelen */
    function kkGelen(m) {
      if (!KK || !m || (m.bk && m.bk !== KK_KITAP) || tkLider()) return;
      if (m.t === 'kc') { kkUzakParca(m); return; }
      if (m.t === 'kx') { kkUzakSil(m.k); return; }
      if (m.t !== 'kb') return;
      var L = m.L || [];
      for (var i = 0; i < L.length; i++) {
        var it = L[i], s = +(it && it.s);
        if (!(s >= 1)) continue;
        var rec = { t: +it.t || 0, c: it.c || '', L: null }, eski = KK.G[s], yuz = kkYuz(s);
        /* yalnız sona çizgi eklendiyse eski çözümü kullan, yalnız yenisini çiz */
        var ek = eski && kkMisafirKip() && yuz && yuz._kkAn === 'g' + kkImza(eski) && eski.c && rec.c.length > eski.c.length &&
                 rec.c.charAt(eski.c.length) === ' ' && rec.c.slice(0, eski.c.length) === eski.c;
        var yeniler = ek ? kkSayfaCoz(rec.c.slice(eski.c.length + 1)) : null;
        if (ek) rec.L = kkCizgiler(eski).concat(yeniler);
        KK.G[s] = rec;
        kkBirlestir(s, rec);
        if (ek) kkSayfaEkle(s, 'g' + kkImza(eski), yeniler); else kkSayfaCiz(s);
      }
      if (m.bit) kkUzakSil(m.bit);
    }
    function kkUzakParca(m) {
      var p = kkNoktaCoz(m.d), s = +m.s;
      if (!p.length || !(s >= 1)) return;
      var u = KK.uzak[m.k];
      if (!u) {
        var a = m.a === 'f' ? 'f' : 'k', r = +m.r || 0;
        u = KK.uzak[m.k] = { s: s, c: { a: a, r: r, w: KK_KALIN[m.w] ? m.w : 'o', p: [] }, el: null };
      }
      u.z = Date.now();
      if ((+m.b || 0) * 2 !== u.c.p.length) { if (+m.b) return; u.c.p = []; }   /* sırayla gelir; uymayan parça atlanır */
      u.c.p.push.apply(u.c.p, p);
      var yuz = kkYuz(s), v = yuz && kkSvg(yuz, true);
      if (!v) return;
      if (!u.el) u.el = kkYol(u.c);
      if (u.el.parentNode !== kkGrup(v, u.c)) kkGrup(v, u.c).appendChild(u.el);
      u.el.setAttribute('d', kkD(u.c.p));
    }
    function kkUzakSil(k) {
      var u = KK.uzak[k];
      if (!u) return;
      delete KK.uzak[k];
      if (u.el && u.el.parentNode) u.el.parentNode.removeChild(u.el);
    }
    /* izleyen: kalem kumandada açıksa burada da açık (kumandanın görünüm iletisindeki kl) */
    function kkKipEsitle(m) {
      if (!KK || !m || tkLider()) return;
      if (!!m.kl !== KK.acik) { if (m.kl) kkAc(); else kkKapat(); }
    }
    /* rol değişince (tahta liderliği aldı ya da bıraktı) doğru yazı görünsün */
    function kkRolBak() {
      if (!TK || !TK.k) return;
      var l = tkLider(), mi = kkMisafirKip(), r = (l ? 'L' : '') + (mi ? 'I' : '');
      var simdi = Date.now();
      for (var k in KK.uzak) if (simdi - (KK.uzak[k].z || 0) > 8000) kkUzakSil(k);     /* bitişi gelmeyen uzak çizgi */
      if (r === KK.rol) return;
      KK.rol = r;
      if (!mi) KK.G = {};
      if (KK.palet) kkPaletGuncelle();
      kkTazele();
      if (l) { KK.gitti = {}; kkYayilimGonder(); }
    }
    setInterval(kkRolBak, 700);

    /* ---------- YÜZEN KALEM ŞERİDİ (25.10.2026) ve kalem ayarları ----------
       Öğretmen: "flipbooklarda kaleme basınca küçük şekilde açılır kapanır bi 5
       renk ileri geri tuşu ve silgi olan bi şerit yapalım otomotik yüzecek …
       zoom yapılmamışken kalemler en yukarda … zoom yapılırsa … öğretmenin yazı
       yazdığı yerden çok uzaklaşmadan öğretmene alan bırakarak ama takip te
       ederek yüzebilmeli, bu otomotik takibi açıp kapatmak ta lazım, hatta
       soldaki kalem kısmına tıklayınca bu seçenek te görünsün, kalem ayarları bu
       aşamada yapılsın".
       · ŞERİT (.kk-serit): mavi · pembe · kırmızı · siyah · yeşil (defterdeki
         gibi dolu yuvarlak, içinde kalem), silgi, geri al, yinele. Baştaki ‹
         şeridi tek yuvarlak düğmeye (seçili renk) küçültür, basınca açılır.
       · YERİ: büyütme yokken sahnenin üstünde ortada. Büyütülünce, otomatik
         takip açıksa, en son yazılan yerin ÜSTÜNDE (yer yoksa ALTINDA) bir
         boşluk bırakarak durur; yazıyı ve okları örtmez. Yazı aynı yerde
         sürdükçe kımıldamaz, uzaklaşınca ardından kayar; yazarken / silerken
         kımıldamaz. Kalem şeride yaklaşırsa şerit o an soluklaşıp yol verir.
         Takip kapalıysa hep üstte (büyütülünce üstteki okun altında).
       · AYARLAR (.kk-ayar): Kalem düğmesine basınca. Yan çubukta düğmenin hemen
         altında durur (kalem açık oldukça); daraltılmış çubukta ve telefonda
         açılır kutudur: sayfaya yazmaya başlayınca kapanır, Kalem düğmesi yine
         açar, ikinci basış kalemi kapatır. İçinde: otomatik takip, kalınlık,
         fosforlu kalem, sayfayı temizle, kaldığım yer, kalemi kapat.
       -------------------------------------------------------------- */
    var KK_IK = {
      kalem: '<path d="M15.2 4.8l4 4L8.4 19.6 3.6 20.4l.8-4.8z"/><path d="M13.6 6.4l4 4"/>',
      silgi: '<path d="M8.6 20.4h11.6"/><path d="M5.2 15.4 14.8 5.8a2 2 0 0 1 2.8 0l2.6 2.6a2 2 0 0 1 0 2.8L12 19.4H8.8l-3.6-3.6a.3.3 0 0 1 0-.4z"/><path d="M9.6 11l5.2 5.2"/>',
      geri: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
      ileri: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
      temizle: '<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
      yer: '<path d="M7 3.5h10a1 1 0 0 1 1 1V21l-6-4.2L6 21V4.5a1 1 0 0 1 1-1z"/>',
      bitti: '<path d="M5 12.6l4.3 4.3L19 7.2"/>',
      kucult: '<path d="M14.5 6.5 9 12l5.5 5.5"/>',
      imlec: '<path d="M6 3.8v14.6l3.9-3.7 2.6 5.7 2.7-1.2-2.6-5.6 5.4-.2z"/>',   /* fare imleci: sayfada gez (25.10.2026) */
      tut: '<circle cx="9" cy="6.5" r=".9"/><circle cx="15" cy="6.5" r=".9"/><circle cx="9" cy="12" r=".9"/>' +
           '<circle cx="15" cy="12" r=".9"/><circle cx="9" cy="17.5" r=".9"/><circle cx="15" cy="17.5" r=".9"/>'
    };
    function kkTercihOku() {
      try {
        var t = JSON.parse(localStorage.getItem(KK_TERCIH) || '{}') || {};
        if (KK_SIRA.indexOf(t.r) >= 0) KK.renk = t.r;
        if (KK_KALIN[t.w]) KK.kal = t.w;
        if (t.a === 'k' || t.a === 'f') KK.arac = KK.sonArac = t.a;
        if (t.t === 0 || t.t === 1) KK.takip = t.t === 1;
        if (t.k === 0 || t.k === 1) KK.kucuk = t.k === 1;
        if (t.pg === 0 || t.pg === 1) { KK.parmakT = t.pg; KK.parmak = t.pg === 1; }
        var y = t.y;
        if (y && typeof y === 'object' && isFinite(y.x) && isFinite(y.y) && (y.k === '' || y.k === 'sol' || y.k === 'sag'))
          KK.sabit = { k: y.k, x: Math.max(0, Math.min(1, +y.x)), y: Math.max(0, Math.min(1, +y.y)) };
      } catch (e) { }
    }
    function kkTercihYaz() {
      var t = { r: KK.renk, w: KK.kal, a: KK.sonArac, t: KK.takip ? 1 : 0, k: KK.kucuk ? 1 : 0 };
      if (KK.parmakT === 0 || KK.parmakT === 1) t.pg = KK.parmakT;
      if (KK.sabit) t.y = { k: KK.sabit.k, x: +KK.sabit.x.toFixed(4), y: +KK.sabit.y.toFixed(4) };
      try { localStorage.setItem(KK_TERCIH, JSON.stringify(t)); } catch (e) { }
    }
    function kkSeritHtml() {
      var h = '<button type="button" class="kk-s kk-tut" data-kk="tut" title="Şeridi taşı: sürükle · çift dokun: yine kendisi yer seçsin" aria-label="Şeridi taşı">' +
        svg(KK_IK.tut) + '</button>' +
        '<button type="button" class="kk-s kk-kapa" data-kk="kapa" title="Şeridi küçült" aria-label="Şeridi küçült" aria-expanded="true">' +
        svg(KK_IK.kucult, 'kk-ok') + svg(KK_IK.kalem, 'kk-kalemik') + svg(KK_IK.silgi, 'kk-silgiik') + svg(KK_IK.imlec, 'kk-imlecik') + '</button>' +
        '<span class="kk-sg kk-gezg"><button type="button" class="kk-s kk-a kk-gez" data-kk="gez" title="İmleç: kalemi kapatmadan sayfada gez (V) · bir renge dokununca yazarsın" ' +
        'aria-label="İmleç: sayfada gez" aria-pressed="false">' + svg(KK_IK.imlec) + '</button></span>' +
        '<span class="kk-sg kk-renkler">';
      KK_SIRA.forEach(function (r, i) {
        h += '<button type="button" class="kk-s kk-r" data-kk="r' + r + '" style="--kk:' + KK_RENK[r] + '" title="' + KK_RENK_AD[r] +
          ' kalem (' + (i + 1) + ')" aria-label="' + KK_RENK_AD[r] + ' kalem" aria-pressed="false">' + svg(KK_IK.kalem) + '</button>';
      });
      return h + '</span><span class="kk-sg kk-isler">' +
        '<button type="button" class="kk-s kk-a" data-kk="silgi" title="Silgi: dokunduğun çizgiyi siler (E)" aria-label="Silgi" aria-pressed="false">' + svg(KK_IK.silgi) + '</button>' +
        '<button type="button" class="kk-s kk-a" data-kk="geri" title="Geri al (Ctrl+Z)" aria-label="Geri al">' + svg(KK_IK.geri) + '</button>' +
        '<button type="button" class="kk-s kk-a" data-kk="ileri" title="Yinele (Ctrl+Y)" aria-label="Yinele">' + svg(KK_IK.ileri) + '</button></span>';
    }
    function kkAyarHtml() {
      var h = '<div class="kk-ay-bas"><b>Kalem ayarları</b>' +
        '<button type="button" class="kk-ay-x" data-kk="ayarx" title="Kapat" aria-label="Kalem ayarlarını kapat">✕</button></div>' +
        '<button type="button" class="kk-ay-sat kk-takip" data-kk="takip" role="switch" aria-checked="true">' +
        '<span class="kk-ay-ad">Otomatik takip<small>Büyütünce şerit yazının yanında durur</small></span>' +
        '<i class="kk-anahtar" aria-hidden="true"></i></button>' +
        '<button type="button" class="kk-ay-sat kk-takip kk-parmak" data-kk="parmak" role="switch" aria-checked="false" hidden>' +
        '<span class="kk-ay-ad">Parmakla gez<small>Kalem ucu yazar, parmak sayfada gezer</small></span>' +
        '<i class="kk-anahtar" aria-hidden="true"></i></button>' +
        '<div class="kk-ay-sat kk-ay-kal" role="group" aria-label="Kalınlık"><span class="kk-ay-ad">Kalınlık</span><span class="kk-ay-dz">';
      ['i', 'o', 'k'].forEach(function (w) {
        h += '<button type="button" class="kk-ay-d kk-w" data-kk="w' + w + '" title="' + KK_KAL_AD[w] + '" aria-label="' + KK_KAL_AD[w] +
          ' çizgi" aria-pressed="false"><i class="kk-w-' + w + '"></i></button>';
      });
      return h + '</span></div>' +
        '<button type="button" class="kk-ay-sat kk-fos" data-kk="fos" aria-pressed="false" title="Fosforlu kalem (6)">' +
        '<i class="kk-fos-uc" style="--kk:' + KK_FOS[0] + '" aria-hidden="true"></i><span class="kk-ay-ad">Fosforlu kalem</span></button>' +
        '<button type="button" class="kk-ay-sat kk-tem" data-kk="temizle" title="Açık sayfanın yazılarını sil">' + svg(KK_IK.temizle) +
        '<span class="kk-ay-ad">Sayfayı temizle</span></button>' +
        '<button type="button" class="kk-ay-sat kk-yer" data-kk="yer" aria-expanded="false" title="Kaldığım yer: en son yazılan sayfalar">' + svg(KK_IK.yer) +
        '<span class="kk-ay-ad">Kaldığım yer</span></button>' +
        '<button type="button" class="kk-ay-sat kk-bitti" data-kk="bitti" title="Kalemi kapat (Esc)">' + svg(KK_IK.bitti) +
        '<span class="kk-ay-ad">Kalemi kapat</span></button>' +
        '<div class="kk-liste" role="menu" hidden></div>';
    }
    function kkKur() {
      if (KK.palet) return KK.palet;
      var p = document.createElement('div');
      p.className = 'kk-serit';
      p.setAttribute('role', 'toolbar');
      p.setAttribute('aria-label', 'Kalem şeridi');
      p.hidden = true;
      p.innerHTML = kkSeritHtml();
      sahne.appendChild(p);
      KK.palet = p;
      var a = document.createElement('div');
      a.className = 'kk-ayar';
      a.setAttribute('role', 'group');
      a.setAttribute('aria-label', 'Kalem ayarları');
      a.hidden = true;
      a.innerHTML = kkAyarHtml();
      KK.ayar = a;
      KK.liste = a.querySelector('.kk-liste');
      kkAyarYerlestir();
      p.addEventListener('pointerdown', kkTutBas);                /* tutamak: şeridi taşı (25.10.2026) */
      p.addEventListener('pointermove', kkTutOynat);
      p.addEventListener('pointerup', kkTutBirak);
      p.addEventListener('pointercancel', kkTutBirak);
      [p, a].forEach(function (el) {
        el.addEventListener('click', kkPaletTik);
        /* şeride / ayarlara dokunmak sayfayı büyütmesin, kaydırmasın */
        ['pointerdown', 'touchstart', 'dblclick'].forEach(function (t) {
          el.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
        });
      });
      return p;
    }

    /* ---------- kalem ayarlarının yeri ---------- */
    function kkAyarIcMi() { return !!(KK.ayar && KK.ayar.classList.contains('kk-ay-ic')); }
    function kkAyarYerlestir() {
      var a = KK.ayar, t = KK.tus;
      if (!a) return;
      var h = document.documentElement, yan = h.classList.contains('yanli') && window.innerWidth >= 760;
      var ic = !!(t && t.parentNode && yan && !h.classList.contains('dar') && t.closest && t.closest('.ust'));
      if (ic) {                                              /* yan çubukta Kalem düğmesinin hemen altında */
        if (a.previousElementSibling !== t || a.parentNode !== t.parentNode) t.parentNode.insertBefore(a, t.nextSibling);
        a.classList.add('kk-ay-ic'); a.classList.remove('kk-ay-yuzen');
        a.style.left = a.style.top = a.style.width = '';
        return;
      }
      if (a.parentNode !== document.body) document.body.appendChild(a);
      a.classList.remove('kk-ay-ic'); a.classList.add('kk-ay-yuzen');
      if (a.hidden || !t) return;
      var r = t.getBoundingClientRect(), W = window.innerWidth, Y = window.innerHeight, en = Math.min(292, W - 16);
      a.style.width = en + 'px';
      var x, y, boy = a.offsetHeight;
      if (yan) { x = r.right + 10; y = r.top - 8; }                                   /* daraltılmış yan çubuk: düğmenin sağında */
      else {                                                                           /* üst çubuk: düğmenin altında */
        x = r.left + r.width / 2 - en / 2; y = r.bottom + 8;
        if (y + boy > Y - 8 && r.top - 8 - boy >= 8) y = r.top - 8 - boy;             /* altta yer yoksa üstünde */
      }
      x = Math.max(8, Math.min(W - en - 8, x));
      y = Math.max(8, Math.min(Y - boy - 8, y));
      a.style.left = Math.round(x) + 'px'; a.style.top = Math.round(y) + 'px';
    }

    /* ---------- görünüm ---------- */
    function kkPaletGuncelle() {
      if (KK.tus) { KK.tus.classList.toggle('aktif', KK.acik); KK.tus.setAttribute('aria-pressed', KK.acik ? 'true' : 'false'); }
      sahne.classList.toggle('kk-acik', KK.acik);
      sahne.classList.toggle('kk-silgi', KK.acik && KK.arac === 's');
      sahne.classList.toggle('kk-gez', KK.acik && KK.arac === 'g');
      sahne.classList.toggle('kk-parmak', KK.acik && !!KK.parmak);
      document.documentElement.classList.toggle('kk-acik', KK.acik);
      document.documentElement.classList.toggle('kk-gez', KK.acik && KK.arac === 'g');
      var izle = kkMisafirKip(), renk = KK.sonArac === 'f' ? '#C9A400' : KK_RENK[KK.renk];
      [KK.palet, KK.ayar].forEach(function (p) {
        if (!p) return;
        p.classList.toggle('kk-izle', izle);
        p.style.setProperty('--kk-sec', renk);
        [].forEach.call(p.querySelectorAll('[data-kk]'), function (b) {
          var k = b.getAttribute('data-kk'), sec = false;
          if (/^r\d$/.test(k)) sec = KK.arac === 'k' && +k.charAt(1) === KK.renk;
          else if (k === 'fos') sec = KK.arac === 'f';
          else if (/^w[iok]$/.test(k)) sec = k.charAt(1) === KK.kal;
          else if (k === 'silgi') sec = KK.arac === 's';
          else if (k === 'gez') sec = KK.arac === 'g';
          else return;
          b.classList.toggle('secili', sec);
          b.setAttribute('aria-pressed', sec ? 'true' : 'false');
        });
      });
      var p = KK.palet;
      if (p) {
        var gizliydi = p.hidden;
        p.hidden = !KK.acik;
        p.classList.toggle('kk-kucuk', !!KK.kucuk);
        p.classList.toggle('kk-silgide', KK.arac === 's');
        p.classList.toggle('kk-gezide', KK.arac === 'g');
        var kp = p.querySelector('[data-kk="kapa"]');
        if (kp) {
          kp.setAttribute('aria-expanded', KK.kucuk ? 'false' : 'true');
          kp.title = KK.kucuk ? 'Kalem şeridini aç' : 'Şeridi küçült';
          kp.setAttribute('aria-label', kp.title);
        }
        kkGeriDurum();
        if (!KK.acik) { p.classList.remove('kk-yolver'); KK.yolver = false; KK.yer = null; }
        else if (gizliydi || !KK.yer) kkSeritYerlestir(true);
        else kkSeritZamanla(0);
      }
      var a = KK.ayar;
      if (a) {
        kkAyarYerlestir();
        a.hidden = !KK.acik || izle || (!kkAyarIcMi() && !KK.ayarGor);
        var t = a.querySelector('[data-kk="takip"]');
        if (t) {
          t.setAttribute('aria-checked', KK.takip && !KK.sabit ? 'true' : 'false');
          var ts = t.querySelector('small');
          if (ts) ts.textContent = KK.sabit ? 'Şeridi taşıdın · açınca yine kendisi yer seçer' : 'Büyütünce şerit yazının yanında durur';
        }
        var pg = a.querySelector('[data-kk="parmak"]');
        if (pg) { pg.hidden = KK.parmakT == null; pg.setAttribute('aria-checked', KK.parmak ? 'true' : 'false'); }
        if (!a.hidden && !kkAyarIcMi()) kkAyarYerlestir();          /* açılır kutu: boyu ölçülebilsin diye görünür olunca */
        if (a.hidden) kkListeKapat(); else kkListeYer();
      }
      kkUstYer();
      kkImlec();
    }
    function kkGeriDurum() {
      var p = KK.palet;
      if (!p) return;
      var g = p.querySelector('[data-kk="geri"]'), i = p.querySelector('[data-kk="ileri"]');
      if (g) g.classList.toggle('kk-pasif', !KK.geri.length);
      if (i) i.classList.toggle('kk-pasif', !KK.ileri.length);
    }
    /* eski alttaki takım bildirimi yukarı itiyordu; şerit üstte, gerek kalmadı */
    function kkUstYer() { document.documentElement.style.removeProperty('--kk-ust'); }
    window.addEventListener('resize', function () {
      if (!KK.acik) return;
      setTimeout(function () { kkPaletGuncelle(); kkSeritYerlestir(true); }, 150);
    });
    function kkImlec() {
      if (!KK.acik || KK.arac === 's' || KK.arac === 'g') { sahne.style.removeProperty('--kk-imlec'); return; }
      var fos = KK.arac === 'f', renk = fos ? KK_FOS[0] : KK_RENK[KK.renk];
      var r = fos ? 6 : ({ i: 2.2, o: 3, k: 4.4 })[KK.kal];
      var s = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="' + (r + 1.8) +
        '" fill="#fff" fill-opacity=".9" stroke="#000" stroke-opacity=".25"/><circle cx="12" cy="12" r="' + r + '" fill="' + renk + '"/></svg>';
      sahne.style.setProperty('--kk-imlec', 'url("data:image/svg+xml,' + encodeURIComponent(s) + '") 12 12, crosshair');
    }

    /* ---------- şeridin yeri: üstte ya da yazılan yerin yakınında ---------- */
    var kkSeritZ = 0;
    function kkSeritZamanla(g) {
      if (!KK || !KK.acik || !KK.palet) return;
      clearTimeout(kkSeritZ);
      kkSeritZ = setTimeout(function () {
        kkSeritZ = 0;
        if (KK.cz || KK.sil || KK.iki || pinchAktif) { kkSeritZamanla(220); return; }    /* yazarken / silerken / kıstırırken kımıldamasın */
        kkSeritYerlestir();
      }, g == null ? 200 : g);
    }
    function kkSeritKutu() {
      var p = KK.palet;
      return (p && !p.hidden && !p.classList.contains('kk-izle')) ? p.getBoundingClientRect() : null;
    }
    /* yazı ya da silgi şeride yaklaşınca şerit o an soluklaşır, kalemin yolundan çekilir */
    function kkYolVer(x, y) {
      var r = KK.seritR;
      if (!r || KK.yolver) return;
      var m = 26;
      if (x > r.left - m && x < r.right + m && y > r.top - m && y < r.bottom + m) { KK.yolver = true; KK.palet.classList.add('kk-yolver'); }
    }
    function kkSeritBirak() {
      KK.seritR = null;
      if (KK.yolver && KK.palet) { KK.yolver = false; KK.palet.classList.remove('kk-yolver'); }
      kkGeriDurum();
      kkSeritZamanla(260);
    }
    /* en son yazılan (ya da silinen) yer, sayfa biriminde */
    function kkSonYaz(s, p, pay) {
      if (!p || p.length < 2) return;
      var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (var i = 0; i + 1 < p.length; i += 2) {
        if (p[i] < x0) x0 = p[i]; if (p[i] > x1) x1 = p[i];
        if (p[i + 1] < y0) y0 = p[i + 1]; if (p[i + 1] > y1) y1 = p[i + 1];
      }
      pay = pay || 0;
      KK.son = { s: s, x0: x0 - pay, y0: y0 - pay, x1: x1 + pay, y1: y1 + pay };
    }
    function kkSonKutu(sr) {                                      /* sahneye göre ekrandaki kutusu */
      var S = KK.son;
      if (!S || kkGorunen().indexOf(S.s) < 0) return null;
      var yuz = kkYuz(S.s);
      if (!yuz) return null;
      var r = yuz.getBoundingClientRect();
      if (r.width < 4) return null;
      var k = { l: r.left - sr.left + S.x0 / KK_EN * r.width, t: r.top - sr.top + S.y0 / KK_BOY * r.height,
                r: r.left - sr.left + S.x1 / KK_EN * r.width, b: r.top - sr.top + S.y1 / KK_BOY * r.height };
      if (k.r < 0 || k.b < 0 || k.l > sr.width || k.t > sr.height) return null;   /* gezinince ekranın dışında kaldı */
      return k;
    }
    function kkGorunurMu(e) {
      if (!e || !e.getClientRects().length) return false;
      var cs = window.getComputedStyle(e);
      return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05;
    }
    /* şeridin örtmemesi gerekenler: yukarı / aşağı okları ve bilgi yazısı (kesin), sayfa
       çevirme okları (yumuşak: dar ekranda başka yer yoksa kenarına binebilir) */
    function kkEngeller(sr) {
      var L = [], E = [okUst, okAlt].concat([].slice.call(document.querySelectorAll('.ok')));
      if (bilgi && bilgi.classList.contains('gor')) E.push(bilgi);
      E.forEach(function (e) {
        if (!kkGorunurMu(e)) return;
        var r = e.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;
        L.push({ l: r.left - sr.left - 6, t: r.top - sr.top - 6, r: r.right - sr.left + 6, b: r.bottom - sr.top + 6,
                 yum: e.classList.contains('ok') });
      });
      return L;
    }
    function kkCakisir(a, b) { return a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t; }
    function kkSeritYerlestir(hemen) {
      var p = KK.palet;
      if (!p || !KK.acik || p.hidden || p.classList.contains('kk-izle')) return;
      if (kkTas && kkTas.oynadi) return;                           /* sürüklenirken */
      p.classList.toggle('kk-dikey', !!(KK.sabit && KK.sabit.k));
      var sr = sahne.getBoundingClientRect(), W = sr.width, H = sr.height, w = p.offsetWidth, h = p.offsetHeight;
      if (!w || !h || !W || !H) return;
      if (KK.sabit) {                                             /* taşınmış: orada kalır (25.10.2026) */
        if (KK.sabit.k && h > H - 16) { p.classList.remove('kk-dikey'); w = p.offsetWidth; h = p.offsetHeight; }   /* dikey sığmıyor */
        var q = kkSabitYer(W, H, w, h, KK.sabit);
        if (KK.sabit.k && p.classList.contains('kk-dikey')) q.y = kkKenarY(sr, q.x, w, h, q.y);   /* kenardaki okların üstü / altı */
        kkSeritKoy(q.x, q.y, 'sabit', w, h, hemen);
        return;
      }
      var P = 8, yakin = z.o > 1.02, eng = kkEngeller(sr);
      var minX = P, maxX = Math.max(P, W - w - P), minY = P, maxY = Math.max(P, H - h - P);
      var ust = P;                                                 /* büyütülünce üstteki okun altında */
      if (yakin && kkGorunurMu(okUst)) { var ou = okUst.getBoundingClientRect(); ust = Math.max(ust, ou.bottom - sr.top + 8); }
      function kutu(x, y) { return { l: x, t: y, r: x + w, b: y + h }; }
      function bos(k, B, pay, gevsek) {
        if (B && kkCakisir(k, { l: B.l - pay, t: B.t - pay, r: B.r + pay, b: B.b + pay })) return false;
        for (var i = 0; i < eng.length; i++) if (!(gevsek && eng[i].yum) && kkCakisir(k, eng[i])) return false;
        return true;
      }
      var hedef = null, mod = 'ust';
      var B = (yakin && KK.takip) ? kkSonKutu(sr) : null;
      if (B) {
        var G = kkDokunmatik() ? 40 : 30;                            /* yazıya bırakılan boşluk */
        var su = KK.yer;
        if (su && su.mod === 'izle' && su.w === w && su.h === h) {  /* yazı aynı yerde sürüyorsa kımıldama */
          var k0 = kutu(su.x, su.y);
          var ara = k0.b <= B.t ? B.t - k0.b : (k0.t >= B.b ? k0.t - B.b : -1);
          var cx0 = su.x + w / 2;
          if (ara >= G * 0.5 && ara <= G + 110 && cx0 >= B.l - w * 0.55 && cx0 <= B.r + w * 0.55 &&
              su.x >= minX - 1 && su.x <= maxX + 1 && su.y >= minY - 1 && su.y <= maxY + 1 && bos(k0, B, G * 0.5, true)) hedef = { x: su.x, y: su.y };
        }
        if (!hedef) {
          /* önce üstünde, olmazsa altında; her birinde önce hiçbir şeye binmeden,
             olmazsa sayfa çevirme oklarının kenarına binerek */
          var cx = (B.l + B.r) / 2, ys = [B.t - G - h, B.b + G];
          for (var d = 0; d < 4 && !hedef; d++) {
            var y = ys[d >> 1], gevsek = (d & 1) === 1;
            if (y < minY || y > maxY) continue;
            var xs = [cx - w / 2];
            eng.forEach(function (e) { xs.push(e.l - w - 2, e.r + 2); });
            xs = xs.map(function (x) { return Math.max(minX, Math.min(maxX, x)); });
            xs.sort(function (m, n) { return Math.abs(m + w / 2 - cx) - Math.abs(n + w / 2 - cx); });
            for (var b = 0; b < xs.length; b++) {
              if (Math.abs(xs[b] + w / 2 - cx) > Math.max(260, W * 0.35)) break;
              if (bos(kutu(xs[b], y), B, G * 0.5, gevsek)) { hedef = { x: xs[b], y: y }; break; }
            }
          }
        }
        if (hedef) mod = 'izle';
      }
      if (!hedef) {                                                /* üstte ortada; yazı tam oradaysa altta */
        var x0 = Math.max(minX, Math.min(maxX, (W - w) / 2)), y0 = Math.min(ust, maxY);
        if (B && !bos(kutu(x0, y0), B, 12)) {
          y0 = maxY;
          if (yakin && kkGorunurMu(okAlt)) { var oa = okAlt.getBoundingClientRect(); y0 = Math.max(minY, Math.min(maxY, oa.top - sr.top - h - 8)); }
          mod = 'alt';
        }
        hedef = { x: x0, y: y0 };
      }
      kkSeritKoy(Math.round(hedef.x), Math.round(hedef.y), mod, w, h, hemen);
    }
    function kkSeritKoy(x, y, mod, w, h, hemen) {
      var p = KK.palet, s = KK.yer;
      KK.yer = { x: x, y: y, mod: mod, w: w, h: h };
      if (s && s.x === x && s.y === y && !hemen) return;
      var anlik = !!hemen || !s;
      if (anlik) p.classList.add('kk-anlik');
      p.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      if (anlik) { void p.offsetWidth; p.classList.remove('kk-anlik'); }
    }
    function kkDokunmatik() { try { return window.matchMedia('(pointer: coarse)').matches; } catch (e) { return false; } }

    /* ---------- ŞERİDİ TAŞIMA (25.10.2026) ----------
       Öğretmen: "kalemlerin olduğu şeridi kolayca taşıyabilmeliyiz". Baştaki tutamaktan
       sürüklenir, bırakılan yerde kalır (bu cihazda hatırlanır; o sırada otomatik takip
       durur). Sahnenin sol / sağ kenarına bırakılırsa dikey olur: tahtada çift sayfanın
       yanındaki boşlukta durur, sayfayı örtmez. Tutamağa çift dokununca (ya da Kalem
       ayarlarında «Otomatik takip» açılınca) yine kendisi yer seçer. */
    var kkTas = null, kkTutSon = 0, kkTasIpucu = false;
    function kkSabitYer(W, H, w, h, S) {
      var P = 8, maxX = Math.max(P, W - w - P), maxY = Math.max(P, H - h - P);
      var x = S.k === 'sol' ? P : (S.k === 'sag' ? maxX : P + S.x * (maxX - P));
      var y = P + S.y * (maxY - P);
      return { x: Math.round(Math.max(P, Math.min(maxX, x))), y: Math.round(Math.max(P, Math.min(maxY, y))) };
    }
    function kkKenar(x, W) {                                      /* imleç sahnenin kenarına yakınsa: dikey */
      var m = Math.max(48, Math.min(96, W * 0.06));
      return x < m ? 'sol' : (x > W - m ? 'sag' : '');
    }
    /* kenardaki sayfa çevirme okları: dikey palet onların üstünde ya da altında durur */
    function kkKenarY(sr, x, w, h, y) {
      var t = 1e9, b = -1e9, P = 8, maxY = Math.max(P, sr.height - h - P);
      [].forEach.call(document.querySelectorAll('.ok'), function (e) {
        if (!kkGorunurMu(e)) return;
        var r = e.getBoundingClientRect();
        if (r.right - sr.left < x - 4 || r.left - sr.left > x + w + 4) return;
        t = Math.min(t, r.top - sr.top); b = Math.max(b, r.bottom - sr.top);
      });
      if (b <= t || y + h <= t - 6 || y >= b + 6) return y;
      var L = [t - 6 - h, b + 6].filter(function (v) { return v >= P && v <= maxY; });
      if (!L.length) return y;
      L.sort(function (m, n) { return Math.abs(m - y) - Math.abs(n - y); });
      return L[0];
    }
    function kkTutBas(e) {
      var t = e.target.closest && e.target.closest('[data-kk="tut"]');
      if (!t || !KK.palet || KK.palet.hidden || (e.pointerType === 'mouse' && e.button !== 0)) return;
      e.preventDefault();
      kkTas = { id: e.pointerId, x: e.clientX, y: e.clientY, oynadi: false, t: t };
      try { t.setPointerCapture(e.pointerId); } catch (x) { }
    }
    function kkTutOynat(e) {
      var T = kkTas, p = KK.palet;
      if (!T || e.pointerId !== T.id || !p) return;
      if (!T.oynadi && Math.abs(e.clientX - T.x) + Math.abs(e.clientY - T.y) < 6) return;
      e.preventDefault();
      if (!T.oynadi) { T.oynadi = true; p.classList.add('kk-tasiniyor'); p.classList.remove('kk-yolver'); KK.yolver = false; }
      var sr = sahne.getBoundingClientRect(), k = kkKenar(e.clientX - sr.left, sr.width);
      p.classList.toggle('kk-dikey', !!k);
      var w = p.offsetWidth, h = p.offsetHeight;
      if (k && h > sr.height - 16) { p.classList.remove('kk-dikey'); w = p.offsetWidth; h = p.offsetHeight; }
      var g = T.t, gx = g.offsetLeft + g.offsetWidth / 2, gy = g.offsetTop + g.offsetHeight / 2;
      var P = 8, maxX = Math.max(P, sr.width - w - P), maxY = Math.max(P, sr.height - h - P);
      var x = k === 'sol' ? P : (k === 'sag' ? maxX : e.clientX - sr.left - gx);
      var y = e.clientY - sr.top - gy;
      x = Math.max(P, Math.min(maxX, x)); y = Math.max(P, Math.min(maxY, y));
      T.k = k; T.w = w; T.h = h; T.W = sr.width; T.H = sr.height; T.px = x; T.py = y;
      if (k && p.classList.contains('kk-dikey')) y = kkKenarY(sr, x, w, h, y);   /* kenardaki okların üstü / altı */
      kkSeritKoy(Math.round(x), Math.round(y), 'sabit', w, h, true);
    }
    function kkTutBirak(e) {
      var T = kkTas, p = KK.palet;
      if (!T || e.pointerId !== T.id) return;
      kkTas = null;
      if (p) p.classList.remove('kk-tasiniyor');
      if (!T.oynadi) {                                            /* dokunuş: çift dokunuş → yine kendisi yer seçer */
        if (e.type !== 'pointerup') return;
        var simdi = Date.now();
        if (simdi - kkTutSon < 420) {
          kkTutSon = 0;
          if (KK.sabit) { KK.sabit = null; kkTercihYaz(); kkPaletGuncelle(); kkSeritYerlestir(true); kkTost('Şerit yine kendisi yer seçiyor'); }
        } else kkTutSon = simdi;
        return;
      }
      var P = 8, mx = Math.max(1, T.W - T.w - 2 * P), my = Math.max(1, T.H - T.h - 2 * P);
      KK.sabit = { k: T.k || '', x: Math.max(0, Math.min(1, (T.px - P) / mx)), y: Math.max(0, Math.min(1, (T.py - P) / my)) };
      kkTercihYaz(); kkPaletGuncelle();
      if (!kkTasIpucu) { kkTasIpucu = true; kkTost('Şerit burada kalacak · tutamağa çift dokununca yine kendisi yer seçer'); }
    }
    /* KALEM UCU (25.10.2026): kalem uçlu cihazda (iPad kalemi, Surface, Wacom) ilk kalem ucu
       dokunuşunda «Parmakla gez» açılır: kalem ucu yazar, parmak gezer. Kalem ayarlarından
       kapatılır; seçim bu cihazda kalır. */
    function kkKalemUcu() {
      if (KK.parmakT != null) return;
      KK.parmakT = 1; KK.parmak = true;
      kkTercihYaz(); kkPaletGuncelle(); zUygula(false);
      kkTost('Kalem ucu algılandı: kalemle yazarsın, parmakla gezersin (Kalem ayarlarından kapatılır)');
    }

    /* ---------- seçimler ---------- */
    function kkAracSec(a, renk) {
      var once = KK.arac;
      if (a === 'g') { KK.arac = KK.arac === 'g' ? KK.sonArac : 'g'; }    /* imleç: aç / kapat (25.10.2026) */
      else if (a === 's') { KK.arac = KK.arac === 's' ? KK.sonArac : 's'; }
      else { KK.arac = KK.sonArac = a; if (a === 'k' && renk != null) KK.renk = renk; kkTercihYaz(); }
      if (KK.arac !== 's') kkSilgiImlec(null);
      kkPaletGuncelle();
      if ((once === 'g') !== (KK.arac === 'g')) zUygula(false);   /* sayfa kilidi ve bilgi yazısı */
    }
    function kkKalinlik(w) {
      KK.kal = w;
      if (KK.arac === 's') KK.arac = KK.sonArac;
      kkTercihYaz(); kkPaletGuncelle();
    }
    function kkTemizOnay(b, ac) {
      clearTimeout(KK.temizZ);
      if (!b) return;
      var sp = b.querySelector('.kk-ay-ad');
      b.classList.toggle('kk-emin', !!ac);
      if (sp) sp.textContent = ac ? 'Emin misin?' : 'Sayfayı temizle';
      if (ac) KK.temizZ = setTimeout(function () { kkTemizOnay(b, false); }, 3200);
    }
    function kkPaletTik(e) {
      var b = e.target.closest && e.target.closest('[data-kk]');
      if (!b || !((KK.palet && KK.palet.contains(b)) || (KK.ayar && KK.ayar.contains(b)))) return;
      e.preventDefault();
      var k = b.getAttribute('data-kk');
      if (k !== 'temizle') kkTemizOnay(KK.ayar && KK.ayar.querySelector('[data-kk="temizle"]'), false);
      if (k !== 'yer' && k !== 'git') kkListeKapat();
      if (/^r\d$/.test(k)) kkAracSec('k', +k.charAt(1));
      else if (k === 'fos') kkAracSec('f');
      else if (/^w[iok]$/.test(k)) kkKalinlik(k.charAt(1));
      else if (k === 'silgi') kkAracSec('s');
      else if (k === 'gez') kkAracSec('g');
      else if (k === 'tut') return;                               /* tutamak: sürükle / çift dokun (kkTut…) */
      else if (k === 'parmak') {
        if (kkYanki(e)) return;
        KK.parmak = !KK.parmak; KK.parmakT = KK.parmak ? 1 : 0; kkTercihYaz(); kkPaletGuncelle(); zUygula(false);
        kkTost(KK.parmak ? 'Parmakla gez açık: kalem ucu yazar, parmak sayfada gezer' : 'Parmakla gez kapalı: parmak da yazar');
      }
      else if (k === 'geri') { if (!kkYanki(e)) kkGeriAl(); }
      else if (k === 'ileri') { if (!kkYanki(e)) kkIleriAl(); }
      else if (k === 'kapa') { KK.kucuk = !KK.kucuk; kkTercihYaz(); kkPaletGuncelle(); kkSeritYerlestir(); }
      else if (k === 'takip') {
        if (kkYanki(e)) return;                                 /* Sınıf Ekranı: kumandanın tıkı tahtanın tercihini değiştirmesin */
        if (KK.sabit) { KK.sabit = null; KK.takip = true; } else KK.takip = !KK.takip;   /* taşınmış şerit: açınca yine kendisi yer seçer */
        kkTercihYaz(); kkPaletGuncelle(); kkSeritYerlestir();
        kkTost(KK.takip ? 'Otomatik takip açık: büyütünce şerit yazdığın yerin yakınında durur' : 'Otomatik takip kapalı: şerit üstte durur');
      }
      else if (k === 'ayarx') { KK.ayarGor = false; kkPaletGuncelle(); }
      else if (k === 'temizle') {
        if (!b.classList.contains('kk-emin')) { kkTemizOnay(b, true); return; }
        kkTemizOnay(b, false);
        if (!kkYanki(e)) kkTemizle();
      }
      else if (k === 'yer') { if (KK.liste.hidden) kkListeAc(); else kkListeKapat(); }
      else if (k === 'git') { kkListeKapat(); if (!kkYanki(e)) kkYereGit(+b.getAttribute('data-s')); }
      else if (k === 'bitti') { if (!kkYanki(e)) kkKapat(); }
    }

    /* ---------- kaldığım yer ---------- */
    function kkYerler() {
      var L = [];
      for (var s in KK.M) { var r = KK.M[s]; if (r && r.c) L.push({ s: +s, t: r.t, r: r }); }
      L.sort(function (a, b) { return b.t - a.t; });
      return L.slice(0, 8);
    }
    function kkSonRenk(rec) {
      var L = kkCizgiler(rec);
      for (var i = L.length - 1; i >= 0; i--) if (L[i].a === 'k') return KK_RENK[L[i].r] || KK_RENK[1];
      return L.length ? KK_FOS[0] : KK_RENK[1];
    }
    function kkListeAc() {
      var L = kkYerler(), h = '<h4>Kaldığım yer</h4>';
      if (!L.length) h += '<p class="kk-bos">Henüz yazı yok. Kalemle sayfaya yazdıkların burada en yenisi üstte sıralanır; dokununca o sayfa açılır.</p>';
      L.forEach(function (x, i) {
        h += '<button type="button" class="kk-li' + (i === 0 ? ' kk-ilk' : '') + '" role="menuitem" data-kk="git" data-s="' + x.s + '">' +
          '<i style="--kk:' + kkSonRenk(x.r) + '"></i><b>' + kkEsc(kkSayfaAdi(x.s)) + '</b><small>' + kkEsc(kkZaman(x.t)) + '</small></button>';
      });
      KK.liste.innerHTML = h;
      KK.liste.hidden = false;
      var y = KK.ayar.querySelector('[data-kk="yer"]');
      if (y) { y.setAttribute('aria-expanded', 'true'); y.classList.add('secili'); }
      kkListeYer();
    }
    /* yan çubukta liste çubuğun yanında açılır; açılır kutuda kutunun içinde */
    function kkListeYer() {
      var L = KK.liste, y = KK.ayar && KK.ayar.querySelector('[data-kk="yer"]');
      if (!L || L.hidden || !y) return;
      var yan = kkAyarIcMi();
      L.classList.toggle('kk-liste-yan', yan);
      if (!yan) { L.style.left = L.style.top = ''; return; }
      var r = y.getBoundingClientRect();
      L.style.left = Math.round(r.right + 14) + 'px';
      L.style.top = Math.round(Math.max(8, Math.min(r.top - 10, window.innerHeight - L.offsetHeight - 8))) + 'px';
    }
    function kkListeKapat() {
      if (!KK.liste || KK.liste.hidden) return;
      KK.liste.hidden = true;
      var y = KK.ayar && KK.ayar.querySelector('[data-kk="yer"]');
      if (y) { y.setAttribute('aria-expanded', 'false'); y.classList.remove('secili'); }
    }
    function kkYereGit(s) {
      if (!(s >= 1)) return;
      if (z.o > 1.02 || z.x || z.y) { z.o = 1; z.x = 0; z.y = 0; zUygula(false); }
      if (kkGorunen().indexOf(s) < 0) flip.git(s);
      setTimeout(function () { kkParlat(s); }, 450);
    }
    /* son çizginin yeri bir an parlasın */
    function kkParlat(s) {
      var yuz = kkYuz(s), L = kkCizgiler(kkGosterilen(s));
      if (!yuz || !L.length) return;
      var p = L[L.length - 1].p, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (var i = 0; i < p.length; i += 2) { x0 = Math.min(x0, p[i]); x1 = Math.max(x1, p[i]); y0 = Math.min(y0, p[i + 1]); y1 = Math.max(y1, p[i + 1]); }
      var pay = 18;
      var d = document.createElement('div');
      d.className = 'kk-parla';
      d.style.left = ((x0 - pay) / KK_EN * 100) + '%'; d.style.top = ((y0 - pay) / KK_BOY * 100) + '%';
      d.style.width = ((x1 - x0 + 2 * pay) / KK_EN * 100) + '%'; d.style.height = ((y1 - y0 + 2 * pay) / KK_BOY * 100) + '%';
      yuz.appendChild(d);
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 2000);
    }
    /* açılışta: en son yazılan yer açık sayfada değilse bir kez öner */
    function kkAcilisOnerisi() {
      if (izleCihazi() || kkMisafirKip() || document.querySelector('.kk-ipucu')) return;
      var L = kkYerler();
      if (!L.length) return;
      if (kkYayilim().indexOf(L[0].s) >= 0) { if (kkGorunen().indexOf(L[0].s) >= 0) kkParlat(L[0].s); return; }   /* zaten açık: yerini göster */
      var s = L[0].s, d = document.createElement('div');
      d.className = 'kk-ipucu';
      d.setAttribute('role', 'status');
      d.innerHTML = svg(KK_IK.yer) + '<span>En son yazdığın yer: <b>' + kkEsc(kkSayfaAdi(s)) + '</b> · ' + kkEsc(kkZaman(L[0].t)) + '</span>' +
        '<button type="button" class="kk-ipgit" data-kk="ipgit">Oraya git</button>' +
        '<button type="button" class="kk-x" data-kk="ipkapat" aria-label="Kapat">✕</button>';
      sahne.appendChild(d);
      var kapat = function () { if (d.parentNode) d.parentNode.removeChild(d); };
      d.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-kk]');
        if (!b) return;
        e.preventDefault();
        if (b.getAttribute('data-kk') === 'ipgit' && !kkYanki(e)) kkYereGit(s);
        kapat();
      });
      ['pointerdown', 'touchstart'].forEach(function (t) { d.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true }); });
      setTimeout(kapat, 10000);
    }

    /* ---------- aç / kapat ---------- */
    function kkAc() {
      if (KK.acik) return;
      KK.acik = true;
      if (KK.arac === 'g') KK.arac = KK.sonArac;                   /* kalem açılınca yazar (imleçte kalmasın) */
      KK.yer = null;
      kkKur();
      kkPaletGuncelle();
      zUygula(false);                                        /* kilit ve alttaki bilgi yazısı */
      var ip = document.querySelector('.kk-ipucu');
      if (ip && ip.parentNode) ip.parentNode.removeChild(ip);
    }
    function kkKapat() {
      if (!KK.acik) return;
      if (KK.cz) kkCizBitir();
      if (KK.sil) kkSilgiBitir();
      KK.bekle = null; KK.iki = null; KK.dok = {};
      KK.acik = false;
      KK.ayarGor = false;
      kkListeKapat();
      kkTemizOnay(KK.ayar && KK.ayar.querySelector('[data-kk="temizle"]'), false);
      kkSilgiImlec(null);
      kkPaletGuncelle();
      zUygula(false);
    }
    /* Kalem düğmesi: kapalıyken açar (ayarlar da görünür). Açıkken: açılır ayar
       kutusu kapalıysa onu açar, değilse kalemi kapatır. */
    function kkTusa(e) {
      if (kkYanki(e)) return;                                   /* Sınıf Ekranı: kalem kumandayla birlikte açılır (kkKipEsitle) */
      if (!KK.acik) { KK.ayarGor = true; kkAc(); return; }
      if (KK.ayar && !kkAyarIcMi() && !KK.ayarGor) { KK.ayarGor = true; kkPaletGuncelle(); return; }
      kkKapat();
    }
    (function kalemTusu() {
      if (document.querySelector('.kk-tus')) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tus kk-tus';
      b.id = 'tKalem';
      b.setAttribute('data-kz', 'kalem');
      b.title = 'Kalemle yaz (P)';
      b.setAttribute('aria-label', 'Kalem');
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = svg(KK_IK.kalem);
      b.addEventListener('click', kkTusa);
      KK.tus = b;
      /* yakınlaştırma takımının önüne (İçindekiler'in ardı); yoksa göz düğmesinin önüne */
      var ar = document.querySelector('.ust .araclar'), yer = null;
      ['tUzaklas', 'tIpucu', 'tTamEkran'].some(function (id) {
        var e = document.getElementById(id);
        if (e && ar && ar.contains(e)) { yer = e; return true; }
        return false;
      });
      if (yer) { var k = yer.closest('.yan-zoom'); if (k && ar.contains(k)) yer = k; yer.parentNode.insertBefore(b, yer); }
      else if (ar) ar.appendChild(b);
      else { b.classList.add('kk-tus-serbest'); document.body.appendChild(b); }
    })();
    /* klavye: P aç/kapat; açıkken 1-5 renkler, 6 fosforlu, E silgi, Ctrl+Z geri al,
       Ctrl+Y / Ctrl+Shift+Z yinele, Esc (önce liste / açılır ayarlar) kapat */
    document.addEventListener('keydown', function (e) {
      var h = e.target || {};
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(h.tagName || '') || h.isContentEditable) return;
      if (tanitimAcik || panelAcik()) return;
      var k = e.key, tus = !e.ctrlKey && !e.metaKey && !e.altKey;
      if (tus && (k === 'p' || k === 'P')) {
        e.preventDefault(); e.stopPropagation();
        if (kkYanki(e)) return;
        if (KK.acik) kkKapat(); else { KK.ayarGor = true; kkAc(); }
        return;
      }
      if (!KK.acik) return;
      if (k === 'Escape' || k === 'Esc') {
        e.preventDefault(); e.stopPropagation();
        if (KK.liste && !KK.liste.hidden) kkListeKapat();
        else if (KK.ayarGor && !kkAyarIcMi()) { KK.ayarGor = false; kkPaletGuncelle(); }
        else if (!kkYanki(e)) kkKapat();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && ((e.shiftKey && (k === 'z' || k === 'Z')) || (!e.shiftKey && (k === 'y' || k === 'Y')))) {
        e.preventDefault(); e.stopPropagation(); if (!kkYanki(e)) kkIleriAl(); return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (k === 'z' || k === 'Z')) { e.preventDefault(); e.stopPropagation(); if (!kkYanki(e)) kkGeriAl(); return; }
      if (!tus) return;
      if (/^[1-5]$/.test(k)) { e.preventDefault(); e.stopPropagation(); kkAracSec('k', KK_SIRA[+k - 1]); }
      else if (k === '6') { e.preventDefault(); e.stopPropagation(); kkAracSec('f'); }
      else if (k === 'e' || k === 'E') { e.preventDefault(); e.stopPropagation(); kkAracSec('s'); }
      else if (k === 'v' || k === 'V') { e.preventDefault(); e.stopPropagation(); kkAracSec('g'); }   /* imleç (25.10.2026) */
    }, true);

    /* sayfa değişince (flip.degisti, 7. bölümde sarılı) */
    function kkSayfaDegisti() {
      if (!KK) return;
      if (KK.cz && kkGorunen().indexOf(KK.cz.s) < 0) kkCizBitir();
      kkListeKapat();
      kkTazele();
      kkYayilimGonder();
      if (KK.son && kkGorunen().indexOf(KK.son.s) < 0) KK.son = null;
      kkSeritZamanla();
    }
    kkTercihOku();
    kkOku().then(function (L) {
      for (var s in L) {
        var r = L[s], o = KK.M[s];
        if (r && (!o || (+r.t || 0) > o.t)) KK.M[s] = { t: +r.t || 0, c: r.c || '', L: null };
      }
      KK.hazir = true;
      kkTazele(true);
      kkYayilimGonder();
      setTimeout(kkAcilisOnerisi, 1500);
    });
    var kkDis = {
      acik: function () { return KK.acik; }, ac: kkAc, kapat: kkKapat,
      kitap: KK_KITAP, hazir: function () { return KK.hazir; }, depo: function () { return KK.depo; },
      cizgiler: function (s, misafir) { return kkCizgiler((misafir ? KK.G : KK.M)[s]).map(function (c) { return { a: c.a, r: c.r, w: c.w, p: c.p.slice() }; }); },
      kayit: function (s) { var r = KK.M[s]; return r ? { t: r.t, c: r.c } : null; },
      gosterilen: function (s) { var r = kkGosterilen(s); return r ? { t: r.t, c: r.c, misafir: r === KK.G[s] } : null; },
      yerler: function () { return kkYerler().map(function (x) { return { s: x.s, t: x.t, ad: kkSayfaAdi(x.s) }; }); },
      arac: function () { return { arac: KK.arac, renk: KK.renk, kal: KK.kal }; },
      gorunen: function () { return kkGorunen(); },
      sec: kkAracSec, geriAl: kkGeriAl, temizle: kkTemizle, git: kkYereGit, kodla: kkKodla, coz: kkCoz,
      ileriAl: kkIleriAl,                                       /* 25.10.2026 */
      takip: function (v) { if (v != null) { KK.takip = !!v; kkTercihYaz(); kkPaletGuncelle(); kkSeritYerlestir(); } return KK.takip; },
      serit: function () { var p = KK.palet; return p ? { yer: KK.yer, kucuk: KK.kucuk, gizli: p.hidden, yolver: KK.yolver, son: KK.son, ayarIc: kkAyarIcMi(), ayarGor: KK.ayarGor,
                                                       sabit: KK.sabit, dikey: p.classList.contains('kk-dikey') } : null; },
      yerlestir: function () { kkSeritYerlestir(true); },
      gez: function (v) { if (v != null && (KK.arac === 'g') !== !!v) kkAracSec('g'); return KK.arac === 'g'; },   /* 25.10.2026 */
      parmak: function () { return { acik: !!KK.parmak, tercih: KK.parmakT }; },
      sabit: function (v) { if (v !== undefined) { KK.sabit = v; kkTercihYaz(); kkPaletGuncelle(); kkSeritYerlestir(true); } return KK.sabit; }
    };

    /* --------------------------------------------------------------
       9) METİN KATMANI                                      (24.10.2026)
       Öğretmen: "görseller değil ama metinlerin kalitesi çok yüksek olmalı".
       Kitabın veri.js'inde metin: { kok, v, yok } varsa açık ve yakın
       sayfalarda sayfa resminin yerine yazısız zemin (zemin/NNN.webp) ve
       üstüne PDF'ten çıkarılmış çizgi yazılar (metin/NNN.svg) konur: yazılar
       her büyütmede ve her ekranda net. İkisi de gelmeden hiçbir şey
       değişmez; biri gelmezse bugünkü sayfa resmi kalır. Bilgisayara
       indirilmiş kopyada (file://) kapalı. Üreten:
       _kaynak/uretici/metinKatmani.py
       -------------------------------------------------------------- */
    var metinYukselt = null;                           /* 2K zemin: 9. bölüm kurar, zUygula çağırır */
    (function metinKatmani() {
      var V = kok.KITAP_VERI || {}, M = ayar.metin || V.metin;
      if (!M || !M.kok || location.protocol === 'file:' || !flip.yapraklar) return;
      var yok = {};
      (M.yok || []).forEach(function (n) { yok[n] = 1; });
      var ek = M.v ? '?v=' + M.v : '';
      /* 2K ZEMİN (25.10.2026) — öğretmen: "flipbookların çözünürlüğünü 2 k ya yakın
         yaparsak daha iyi olur". veri.js metin.k2 varsa her katmanlı yaprağın 2048 px
         enli zemini de var (zemin2k/NNN.webp). Sayfa ekranda bugünkü zeminden
         (1152 px) büyük çiziliyorsa (büyük / keskin ekran, tahta, büyütme) 2K'sı
         kullanılır; telefonda büyütmeden hafif olan kalır. Büyütünce açık sayfaların
         zemini 2K'ya yükseltilir; 2K gelmezse bugünkü zemin kalır. */
      var K2 = M.k2 ? '?v=' + M.k2 : '';
      function adres(kls, no, uz) { return M.kok + kls + '/' + ('00' + no).slice(-3) + uz + (kls === 'zemin2k' ? K2 : ek); }
      function zeminUrl(src) { return 'url("' + src.replace(/["\\]/g, '\\$&') + '")'; }
      function ikiK(yuz) {                                  /* ekranda 1152'den büyük mü çiziliyor (dönüşsüz en × büyütme × piksel oranı) */
        if (!M.k2 || !yuz) return false;
        return (yuz.offsetWidth || 0) * Math.max(1, z.o) * (window.devicePixelRatio || 1) > 1152 * 1.15;
      }
      function acikYuzler() {
        var L = [], S = flip.tekli ? [flip.aktif] : [flip.solSayfa(), flip.sagSayfa()];
        S.forEach(function (s) { var y = s && flip.kitap && flip.kitap.querySelector('.yuz[data-sayfa="' + s + '"]'); if (y) L.push(y); });
        return L;
      }
      /* KİDEF EK SAYFALARI (25.10.2026): Kidef'te basılı 4. sayfadan sonra Metin Tahlili
         sayfaları ekleniyor (03_veri/metintahlili_sayfalar.js, window.KIDEF_EK) — yaprağın
         sırası basılı numaradan kayıyor. Katman dosyaları ve yok listesi basılı numarayla;
         metin.js gibi KIDEF_EK.b() ile çevrilir, ek sayfanın (0) katmanı yok. */
      function basili(yuz) {
        var f = +yuz.dataset.sayfa, E = kok.KIDEF_EK;
        return E && typeof E.b === 'function' ? E.b(f) : f;
      }
      function uygula(yuz, iki) {
        if (!yuz || !yuz.dataset || yuz.dataset.metin) return;
        var no = basili(yuz);
        if (!no || yok[no] || no > flip.toplam || !yuz.dataset.tamGeldi || yuz.classList.contains('uretilmedi')) return;
        var img = yuz.querySelector('img');
        if (!img) return;
        yuz.dataset.metin = 'bekliyor';
        var zemin = new Image(), yazi = new Image(), gelen = 0, bozuk = false, kac = iki ? 2 : 1;
        var geldi = function () {
          if (bozuk || ++gelen < 2) return;
          /* TEK ÖĞE (25.10.2026) — öğretmen: "bazı yazılar diğer sayfada da
             görünüyor". Yazılar ayrı bir <img> olarak yüzün üstüne konunca bazı
             tarayıcılarda (Safari) çevrilmiş yaprağın öbür yüzünde de
             görünüyordu: backface-visibility yüzün konumlu çocuğuna işlemiyor.
             Sayfa yine tek öğe: zemin resmin arka planı, net yazılar (SVG)
             resmin kendisi. */
          var st = img.style;
          st.backgroundImage = zeminUrl(zemin.src);
          st.backgroundPosition = 'center';
          st.backgroundSize = 'contain';
          st.backgroundRepeat = 'no-repeat';
          img.src = yazi.src;
          yuz.dataset.metin = '1';
          yuz.dataset.zemin = String(kac);
        };
        var gelmedi = function () { bozuk = true; yuz.dataset.metin = 'yok'; };
        zemin.onload = geldi; yazi.onload = geldi;
        zemin.onerror = function () {                         /* 2K'sı yoksa bugünkü zemin */
          if (kac === 2) { kac = 1; zemin.src = adres('zemin', no, '.webp'); return; }
          gelmedi();
        };
        yazi.onerror = gelmedi;
        zemin.src = adres(kac === 2 ? 'zemin2k' : 'zemin', no, '.webp');
        yazi.src = adres('metin', no, '.svg');
      }
      /* katmanlı açık sayfanın zemini 2K'ya (büyütünce, pencere büyüyünce, sayfa açılınca) */
      function yukselt(yuz) {
        if (!M.k2 || !yuz || !yuz.dataset || yuz.dataset.metin !== '1' || yuz.dataset.zemin !== '1' || !ikiK(yuz)) return;
        var no = basili(yuz), img = yuz.querySelector('img'), z2 = new Image();
        if (!img || !no || yok[no]) return;
        yuz.dataset.zemin = 'y';
        z2.onload = function () { img.style.backgroundImage = zeminUrl(z2.src); yuz.dataset.zemin = '2'; };
        z2.onerror = function () { yuz.dataset.zemin = 'x'; };   /* yok: bir daha denenmez */
        z2.src = adres('zemin2k', no, '.webp');
      }
      function yakinlar() {                                  /* açık yayılım ve iki yanı */
        var a = Math.max(0, flip.c - 1), b = Math.min(flip.yapraklar.length - 1, flip.c + 1);
        var acik = acikYuzler();
        for (var i = a; i <= b; i++) {
          var y = flip.yapraklar[i];
          if (y) [y.children[0], y.children[1]].forEach(function (yz) { uygula(yz, acik.indexOf(yz) >= 0 && ikiK(yz)); });
        }
        acik.forEach(yukselt);
      }
      var ykZ = 0;
      metinYukselt = function () {
        if (!M.k2) return;
        clearTimeout(ykZ);
        ykZ = setTimeout(function () { acikYuzler().forEach(yukselt); }, 350);
      };
      window.addEventListener('resize', metinYukselt);
      try {                                                  /* sayfa resmi gelince (flip.js data-tam-geldi) */
        new MutationObserver(yakinlar).observe(flip.kap, { subtree: true, attributes: true, attributeFilter: ['data-tam-geldi'] });
      } catch (x) { }
      var onceki = flip.degisti;
      flip.degisti = function () { var r = onceki.apply(this, arguments); yakinlar(); return r; };
      yakinlar();
    })();

    /* --------------------------------------------------------------
       10) SAFARİ NETLİĞİ (25.10.2026) — BÜYÜKKEN DÜZ YAPRAK
       Öğretmen: "hala yaklaştırınca bozuluyor netlik" (Mac'te Safari,
       yazılar da bulanık). Sebep çözünürlük değil: Safari (WebKit) dönen
       yaprakları (3B) ayrı katman olarak büyütmeden önceki boyda boyuyor,
       sonra resim gibi büyütüyor. Safari'de 8 yolla denendi: 3B olmayınca
       yazı da resim de her büyüklükte keskin. Bu yüzden büyükken
       (.sahne.duz) yapraklar düz çizilir: çevrilmiş yaprak 180° dönmek
       yerine yana kayar, görünmeyen yüzler gizlenir — görüntü aynı
       (kitapzoom.css "SAFARİ NETLİĞİ"). Büyükken ok tuşuyla sayfa
       çevrilirse çevirme 3B'de oynar, bitince yine düze dönülür. Geçiş
       anında yaprakların kendi geçişi kapalı (duz-gecis): yoksa çevrilmiş
       yapraklar yerinde dönüp kayardı.
       -------------------------------------------------------------- */
    function duzGec(ac) {
      if (sahne.classList.contains('duz') === ac) return;
      var k = flip.kitap;
      if (k) k.classList.add('duz-gecis');
      sahne.classList.toggle('duz', ac);
      if (k) { void k.offsetWidth; k.classList.remove('duz-gecis'); }
    }
    function duzAyarla() { duzGec(z.o > 1.02 && !flip.animasyonda); }
    ['ileri', 'geri'].forEach(function (ad) {
      var asil = flip[ad];
      flip[ad] = function () {
        duzGec(false);                                 /* çevirme 3B'de oynasın */
        var r = asil.apply(flip, arguments);
        duzAyarla();                                   /* çevirme yoksa hemen düze dön */
        return r;
      };
    });
    (function () {                                     /* çevirme bitince (flip.js _bildir) */
      var onceki = flip.degisti;
      flip.degisti = function () { var r = onceki.apply(this, arguments); duzAyarla(); return r; };
    })();

    zUygula(false);

    /* --------------------------------------------------------------
       DIŞARIYA AÇILAN
       -------------------------------------------------------------- */
    return (kok.KitapZoom.son = {
      oran: function () { return z.o; },
      ayarla: zAyarla,
      sifirla: function () { zAyarla(1); },
      tus: zoomTusu,
      uygula: zUygula,
      olcekle: function () { sinirla(); zUygula(false); },
      tanitim: tanitimAc,
      tanitimAcikMi: function () { return tanitimAcik; },
      gorunum: tkGorunum,                  /* yansıtmadaki görünüm (23.10.2026) */
      tahta: function () { return { kanal: !!TK.k, canli: TK.canli, lider: tkLider(), izleyen: tkIzleyen() }; },
      kalem: kkDis,                        /* kalem (23.10.2026) */
      pinch: function () { return { akici: AKICI, aktif: pinchAktif, kilit: !!flip.kilitli }; }   /* deneme için (24.10.2026) */
    });
  };
})(window);
