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
   · AYRAÇ İPİ (27.10.2026): her sayfanın üstünde gri iz; dokununca kırmızı
     ip o sayfada kalır, kitapta tek ip (11. bölüm).
   · DERS MODU (29.10.2026): ders.js'teki adımlarla sunum gibi işleme —
     banda büyüt, kaynak aç, cevap kutusu, örtü, öğretmen notu (12. bölüm).
   · İÇİNDEKİLER (29.10.2026): kitabın İçindekiler sayfasındaki satırlar
     tıklanır, panelde ünitelerin altında konular (icindekiler.js, 13. bölüm);
     ders modu yalnız adımı olan sayfalarda.
   · YEREL TAZELEME (29.10.2026): bilgisayardan açılan kitapta ders.js ve
     icindekiler.js hep tazeden okunur; Ders Tezgâhı'nda kaydedilince kitaba
     dönülünce kaldığı sayfada yeniden açılır (14. bölüm).
   · İLERİ ADIMLARI OYNATIR (29.10.2026): adımlı sayfada ileri (tuş, ok,
     kaydırma) önce adımları oynatır, son adımdan sonra büyükse önce
     küçültür; sağdan sola kitapta ← ileri, → geri; cevap kutusuz, sayfaya
     yazılmış gibi, öğretmenin çizdiği yerde (12. bölüm).
   · CEVAPLA (29.10.2026): kalem şeridinde ✓ ✗ ◯ ١–١٠ · ok (başta nokta,
     sonda ok ucu) · yazı + yüzen klavye; ders adımında hazır işaretler (8., 12.).
   · İŞARETLER TEK TEK (29.10.2026): ders adımındaki hazır işaretler her
     ileride bir tane açılır (ok ve daire çizilerek), geri son açılanı kapatır.
   · DOKUNMA ALANLARI (30.10.2026): icindekiler.js'teki dokunma alanları —
     şık (◯ ✓ ✗, ses), yazı, eşleştirme (ok), örtü; kitapta herkes (15. bölüm).
   · SES VE VİDEO (30.10.2026): icindekiler.js'teki medya — Ders Tezgâhı'nda
     sayfaya bırakılan ses / video, kitabın düğmeleri gibi çalar (16. bölüm).
   · ZAMAN ŞERİDİ (30.10.2026): sesli etkinlikte çerçeveler sesle sırayla yanar;
     her parçadan sonra dur, takip, altyazı, cevaplar düğmeyle (17. bölüm).
   · SAYFA ŞERİDİ (30.10.2026) · YALNIZ İLERİ (31.10.2026): sıra Ders Tezgâhı'nın
     sayfa şeridinde; ders modunda ilerlemeyi öğretmen yapar, sayfadaki ses /
     etkinlik düğmeleri gizli, ses adımında ses kendiliğinden çalar (12. bölüm).
   · İLERLEME ÇUBUĞU · KISIMLAR (31.10.2026): ses / video açılınca altta kalın
     çubuk (dokun: git, sürükle: sar); Ders Tezgâhı'nda ayarlanan kısımlar
     (yönerge, 1. soru…) çubukta dokunulur, o kısmın başından çalar (18. bölüm).

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
      '.nokta,[data-git],.html-sayfa a,button,a,input,select,.panel,.kk-palet,.kk-ipucu,.kk-serit,.kk-ayar,.dk,.zs-c';   /* .dk: dokunma alanı (15. bölüm); .zs-c: zaman şeridi çerçevesi (17. bölüm) */

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
      if (dsDokunma(e, d)) return;                             /* ders modu: dokunma = sonraki adım (12. bölüm) */
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
             '<path d="M6.4 9.6h.01M10 9.6h.01M13.6 9.6h.01M17.2 9.6h.01M8.4 14.2h7.2"/>',
      ip:    '<path d="M7.4 2.8h9.2v18.4L12 17.4l-4.6 3.8z"/>',
      ders:  '<rect x="3" y="4.2" width="18" height="12.6" rx="2.2"/><path d="M8 20h8M12 16.8V20"/>' +
             '<path d="M9.8 7.8v5.4l4.6-2.7z" fill="currentColor" stroke="none"/>'
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
        [IK.ip, 'Ayraç ipi',
         'Her sayfanın üstünde gri bir iz var: dokununca <b>kırmızı ip</b> o sayfaya iner. Kitapta tek ip ' +
         'var — başka sayfaya koyunca eskisinden kalkar; kırmızı ipe yeniden dokununca kalkar. İp başka ' +
         'sayfadayken kitabın üst ortasında kırmızı ucu görünür: ona dokununca o sayfa açılır.'],
        [IK.ders, 'Ders modu',
         'Öğretmen için: adımı olan sayfada <b>ileri</b> (tuş, sayfa oku ya da <b>Ders</b> düğmesi) dersi adım adım ' +
         'işletir — sayfanın bir bölgesine büyütür, sesi/etkinliği açar, cevabı sayfaya yazar, örtülü cevabı açar; son ' +
         'adımdan sonra önce sayfayı küçültür, sonra sayfa çevrilir. ' + (rtl ? '<b>←</b> / <b>◀</b> ileri, <b>→</b> geri' : '<b>→</b> / <b>▶</b> ileri, <b>←</b> geri') +
         ', sayfaya dokunma da ileri; <b>Esc</b> çıkış (o sayfada ileri yine sayfa çevirir). Tahtaya yansıtmada aynı adım ' +
         'Sınıf Ekranı\'nda da işlenir, notlar yalnız kumandada kalır.'],
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
      var ip = ipAnlik();                                        /* + ayraç ipi (11. bölüm) */
      if (ip) m.ip = ip;
      var ds = dsAnlik();                                        /* + ders modu (12. bölüm) */
      if (ds) m.ds = ds;
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
      if (m && m.t === 'ds') { TK.canli = true; dsGelen(m); return; }                                     /* ders modu (12. bölüm) */
      if (m && m.t === 'dk') { TK.canli = true; dkGelen(m); return; }                                     /* dokunma alanları (15. bölüm) */
      if (m && m.t === 'ip') { TK.canli = true; ipGelen(m); return; }                                     /* ayraç ipi (11. bölüm) */
      if (m && typeof m.t === 'string' && m.t.charAt(0) === 'k') { TK.canli = true; kkGelen(m); return; }   /* kalem (8. bölüm) */
      if (!m || (m.t !== 'g' && m.t !== 'h')) return;
      TK.canli = true;
      if (m.t === 'h' && m.k) kkGelen({ t: 'kb', bk: m.k.bk, L: m.k.L });
      if (m.t === 'h' && m.ip) ipGelen(m.ip);
      if (m.t === 'h') dsGelen(m.ds || { a: 0 });                /* ders modu: liderde açıksa aynı adım, yoksa kapat */
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
         yazılan yere yönlendirme yok: SON YAZILAN YER ÖNERİSİ KALKTI (27.10.2026)
         — en son açılan yer en son yazılan yerden farklı olabilir; kitap
         kaldığı sayfadan açılır, işaret için ayraç ipi.
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
      sonGez: false,    /* son dokunuş gezinme miydi: kitabın içindeki tıklamaya izin */
      silme: 'c', silMenu: null, silMenuAcik: false   /* SİLGİ SEÇENEKLERİ (25.10.2026): 'c' dokunduğu çizgiyi, 'y' dokunduğu yeri siler */
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
    /* DOĞAL KALEM (25.10.2026): yeni çizgiler büyük harfle yazılır — 'K' kalem, 'F' fosforlu.
       Noktalar onda bir birim hassas (eskisi yarım birim: büyütünce küçük yazı titremesin);
       'K'de her noktanın kalınlık katı da var (b; yirmide bir hassas). Eski 'k' / 'f' çizgiler
       aynen okunur ve eskisi gibi çizilir. */
    function kkFos(c) { return c.a === 'f' || c.a === 'F'; }
    function kkEnKalin(c) { var m = 1; if (c.b) for (var i = 0; i < c.b.length; i++) if (c.b[i] > m) m = c.b[i]; return m; }
    function kkNoktaKodla10(p, b) {
      var out = [], px = 0, py = 0, pq = 0;
      for (var i = 0, j = 0; i + 1 < p.length; i += 2, j++) {
        var x = Math.round(p[i] * 10), y = Math.round(p[i + 1] * 10);
        kkSayiYaz(x - px, out); kkSayiYaz(y - py, out); px = x; py = y;
        if (b) { var q = Math.round((b[j] || 1) * 20); kkSayiYaz(q - pq, out); pq = q; }
      }
      return out.join('');
    }
    function kkNoktaCoz10(s, kalinli) {
      var n = kkSayiOku(String(s || '')), k = kalinli ? 3 : 2, p = [], b = kalinli ? [] : null, x = 0, y = 0, q = 0;
      for (var i = 0; i + k - 1 < n.length; i += k) {
        x += n[i]; y += n[i + 1]; p.push(x / 10, y / 10);
        if (kalinli) { q += n[i + 2]; b.push(Math.max(0.2, q / 20)); }
      }
      return { p: p, b: b };
    }
    function kkKodla(c) {
      if (ceMi(c)) return ceKodla(c);                             /* CEVAPLA (29.10.2026): ok · damga · yazı */
      if (c.a === 'K' || c.a === 'F') return c.a + String(c.r) + c.w + kkNoktaKodla10(c.p, c.a === 'K' ? c.b : null);
      return c.a + String(c.r) + c.w + kkNoktaKodla(c.p);
    }
    function kkCoz(t) {
      if (!t || t.length < 4) return null;
      var a = t.charAt(0);
      if (a === 'O' || a === 'T' || a === 'Y') return ceCoz(t);      /* CEVAPLA */
      if (a !== 'k' && a !== 'f' && a !== 'K' && a !== 'F') return null;
      var r = parseInt(t.charAt(1), 10), w = t.charAt(2), fos = a === 'f' || a === 'F';
      if (!(r >= 0)) r = 0;
      if (!fos && r >= KK_RENK.length) r = 1;
      if (fos && r >= KK_FOS.length) r = 0;
      if (!KK_KALIN[w]) w = 'o';
      if (a === 'K' || a === 'F') {
        var Y = kkNoktaCoz10(t.slice(3), a === 'K');
        if (!Y.p.length) return null;
        return a === 'K' ? { a: a, r: r, w: w, p: Y.p, b: Y.b } : { a: a, r: r, w: w, p: Y.p };
      }
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
    /* DOĞAL KALEM: bütün noktalarından geçen yumuşak eğri (Catmull-Rom → kübik Bézier). Kollar
       komşu aralığın %45'iyle sınırlı: seyrek noktada taşıp düğüm atmasın. bas: 'M' yeni yol, '' sürdür */
    function kkCR(P, d, bas) {
      var n = P.length / 2;
      if (!n) return d;
      if (bas) d += bas + kkR(P[0]) + ' ' + kkR(P[1]);
      if (n === 1) return bas ? d + 'l.01 0' : d;
      for (var i = 0; i < n - 1; i++) {
        var h = Math.max(i - 1, 0), j = Math.min(i + 2, n - 1);
        var x1 = P[2 * i], y1 = P[2 * i + 1], x2 = P[2 * i + 2], y2 = P[2 * i + 3];
        var ax = (x2 - P[2 * h]) / 6, ay = (y2 - P[2 * h + 1]) / 6, bx = (P[2 * j] - x1) / 6, by = (P[2 * j + 1] - y1) / 6;
        var m = 0.45 * Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        var la = Math.sqrt(ax * ax + ay * ay), lb = Math.sqrt(bx * bx + by * by);
        if (la > m) { ax *= m / la; ay *= m / la; }
        if (lb > m) { bx *= m / lb; by *= m / lb; }
        d += 'C' + kkR(x1 + ax) + ' ' + kkR(y1 + ay) + ' ' + kkR(x2 - bx) + ' ' + kkR(y2 - by) + ' ' + kkR(x2) + ' ' + kkR(y2);
      }
      return d;
    }
    function kkDaire(x, y, q) {
      return 'M' + kkR(x - q) + ' ' + kkR(y) + 'a' + kkR(q) + ' ' + kkR(q) + ' 0 1 0 ' + kkR(2 * q) + ' 0a' +
        kkR(q) + ' ' + kkR(q) + ' 0 1 0 ' + kkR(-2 * q) + ' 0Z';
    }
    /* kalınlaşıp incelen kalem: iki kenar + yuvarlak uçlar, dolgu. Keskin dönüşte ya da
       kalınlığına göre dar kıvrımda parçalara bölünür (iç kenar kendini kesip delik açmasın);
       parçaların yuvarlak uçları birbirini örter. */
    function kkKontur(p, b, w) {
      var n = p.length / 2;
      if (!n) return '';
      function r(i) { return Math.max(0.3, w * (b && b[i] != null ? b[i] : 1) / 2); }
      var d = '', bas = 0;
      for (var i = 1; i < n - 1; i++) {
        var ux = p[2 * i] - p[2 * i - 2], uy = p[2 * i + 1] - p[2 * i - 1], vx = p[2 * i + 2] - p[2 * i], vy = p[2 * i + 3] - p[2 * i + 1];
        var lu = Math.sqrt(ux * ux + uy * uy), lv = Math.sqrt(vx * vx + vy * vy);
        if (lu < 1e-6 || lv < 1e-6) continue;
        var ac = Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / (lu * lv))));
        if (ac > 1.05 || Math.min(lu, lv) < ac * r(i) * 1.1) { d += kkParca(p, bas, i, r); bas = i; }
      }
      return d + kkParca(p, bas, n - 1, r);
    }
    function kkParca(p, a, e, r) {
      if (e <= a) return kkDaire(p[2 * a], p[2 * a + 1], r(a));
      var L = [], R = [];
      for (var i = a; i <= e; i++) {
        var h = Math.max(i - 1, a), j = Math.min(i + 1, e);
        var tx = p[2 * j] - p[2 * h], ty = p[2 * j + 1] - p[2 * h + 1], tl = Math.sqrt(tx * tx + ty * ty) || 1;
        var nx = -ty / tl, ny = tx / tl, q = r(i), x = p[2 * i], y = p[2 * i + 1];
        L.push(x + nx * q, y + ny * q); R.unshift(x - nx * q, y - ny * q);
      }
      var qa = r(a), qe = r(e);
      var d = kkCR(L, '', 'M') + 'A' + kkR(qe) + ' ' + kkR(qe) + ' 0 0 0 ' + kkR(R[0]) + ' ' + kkR(R[1]);
      d = kkCR(R, d, '');
      return d + 'A' + kkR(qa) + ' ' + kkR(qa) + ' 0 0 0 ' + kkR(L[0]) + ' ' + kkR(L[1]) + 'Z';
    }
    var kkDBellek = typeof WeakMap === 'function' ? new WeakMap() : null;   /* çizginin hazır dolgusu */
    function kkYolYaz(e, c) {
      if (ceMi(c)) { ceYaz(e, c); return; }                         /* CEVAPLA: e bir grup */
      var fos = kkFos(c), renk = fos ? (KK_FOS[c.r] || KK_FOS[0]) : (KK_RENK[c.r] || KK_RENK[1]);
      if (c.a === 'K') {
        var on = kkDBellek && kkDBellek.get(c), d;
        if (on && on.n === c.p.length) d = on.d;
        else { d = kkKontur(c.p, c.b, KK_KALIN[c.w] || KK_KALIN.o); if (kkDBellek) kkDBellek.set(c, { n: c.p.length, d: d }); }
        e.setAttribute('d', d);
        e.setAttribute('fill', renk);
        e.removeAttribute('stroke'); e.removeAttribute('stroke-width');
        e.setAttribute('class', 'kk-kd');
        return;
      }
      e.setAttribute('d', c.a === 'F' ? kkCR(c.p, '', 'M') : kkD(c.p));
      e.setAttribute('stroke', renk);
      e.setAttribute('stroke-width', fos ? KK_FKALIN[c.w] : KK_KALIN[c.w]);
      e.setAttribute('class', fos ? 'kk-f' : 'kk-k');
    }
    function kkYol(c) { if (ceMi(c)) return ceG(c); var e = document.createElementNS(KK_NS, 'path'); kkYolYaz(e, c); return e; }
    function kkGrup(v, c) { return kkFos(c) ? v.firstChild : v.lastChild; }
    /* ---------- CEVAPLA (29.10.2026) ----------
       Öğretmen: "cevapla kısmında hazır bazı onay için tik, yanlışlar için çarpı svg leri olsun, doğru şık için
       daire ekleme, arapça 1-10 arası rakam ekleme, ok ekleme olsun eşleştirmeler için bu oklar kalem gibi
       parmağı takip etsin ama başlangıç noktasında büyük bir nokta bitiş yerinde ok olsun, klavye de olsun, bu
       araçlar kitap açıkken kullanılabilir olsun, klavye yüzebilir olsun, aynı zamanda sunum modunda tezgahta da
       kullanabilmeliyim".
       · Kalem şeridinde «Cevapla» takımı: ✓ (yeşil) · ✗ (kırmızı) · ◯ daire (sürükle: boyu; dokun: hazır boy) ·
         ١ … ١٠ (her koyuşta bir sonraki; düğmeye yine dokununca 1–10 seçilir) · ok (kalem gibi parmağı izler;
         başta büyük nokta, sonda ok ucu) · yazı (dokunulan yere yazılır; YÜZEN KLAVYE: Arapça harekeli ·
         Türkçe · rakamlar, başlığından sürüklenir). Damgada parmak kalkınca konur, basılıyken yeri görünür.
       · Kalem yazısıyla aynı katmanda ve kayıtta: sayfaya yapışır, saklanır, geri al / yinele, silgi, tahtaya
         yansır. Kayıt: 'O' ok · 'T' damga (t ✓, x ✗, c daire, n rakam) · 'Y' yazı. Eski motor bunları atlar.
       · Ders modunda da kullanılır (kalem açıkken dokunuş adım ilerletmez). Ders Tezgâhı'nda cevap adımına
         konan işaretleri (ders.js: isaret [...]) 12. bölüm aynı çizimle gösterir.
       -------------------------------------------------------------- */
    var CE_RAKAM = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠'];
    var CE_BOY = { i: 44, o: 56, k: 72 };                   /* ✓ ✗ boyu (birim; sayfa eni 1000) */
    var CE_SAYI = { i: 40, o: 50, k: 64 };
    var CE_YAZI = { i: 28, o: 34, k: 44 };
    var CE_RENK = { ct: 3, cx: 2 };                         /* ✓ yeşil, ✗ kırmızı; ötekiler seçili renk */
    var CE_IK = {
      ct: '<path d="M4.5 12.5l4.6 4.6L19.5 6.6"/>',
      cx: '<path d="M6.2 6.2l11.6 11.6M17.8 6.2L6.2 17.8"/>',
      cc: '<ellipse cx="12" cy="12" rx="8.8" ry="6.2"/>',
      co: '<circle cx="5" cy="17.5" r="2.4" fill="currentColor" stroke="none"/><path d="M6.6 16C10 12.6 13.4 10.4 18.6 7.4"/><path d="M14.2 6.4l5.2.5-1.9 4.8"/>',
      cy: '<rect x="2.6" y="6.2" width="18.8" height="11.6" rx="2.2"/><path d="M6 10.2h.9M9 10.2h.9M12 10.2h.9M15 10.2h.9M18 10.2h.1M7.2 14h9.6"/>'
    };
    function ceMi(c) { return !!c && (c.a === 'O' || c.a === 'T' || c.a === 'Y'); }
    function ceAracMi(a) { return /^c[txcnoy]$/.test(a || ''); }
    function ceRtl(m) {
      var t = String(m || '').replace(/[\s0-9.,;:!?()\-+=%"'«»\/٠-٩]+/g, '');
      return /^[֐-ࣿיִ-﷿ﹰ-﻿]/.test(t);
    }
    function ceSayiKodla(L) { var out = []; for (var i = 0; i < L.length; i++) kkSayiYaz(Math.round((+L[i] || 0) * 10), out); return out.join(''); }
    function ceSayiCoz(s) { return kkSayiOku(String(s || '')).map(function (v) { return v / 10; }); }
    function ceKodla(c) {
      var bas = c.a + String(c.r) + c.w;
      if (c.a === 'O') return bas + kkNoktaKodla10(c.p, null);
      if (c.a === 'Y') return bas + ceSayiKodla([c.x, c.y, c.s]) + '!' + encodeURIComponent(c.m || '');
      if (c.d === 'c') return bas + 'c' + ceSayiKodla([c.x, c.y, c.rx, c.ry]);
      if (c.d === 'n') return bas + 'n' + ceSayiKodla([c.x, c.y, c.s, c.n]);
      return bas + c.d + ceSayiKodla([c.x, c.y, c.s]);
    }
    function ceCoz(t) {
      var a = t.charAt(0), r = parseInt(t.charAt(1), 10), w = t.charAt(2);
      if (!(r >= 0) || r >= KK_RENK.length) r = 1;
      if (!KK_KALIN[w]) w = 'o';
      if (a === 'O') { var Y = kkNoktaCoz10(t.slice(3), false); return Y.p.length >= 4 ? { a: 'O', r: r, w: w, p: Y.p } : null; }
      if (a === 'Y') {
        var i = t.indexOf('!');
        if (i < 4) return null;
        var m = '';
        try { m = decodeURIComponent(t.slice(i + 1)); } catch (e) { return null; }
        var q = ceSayiCoz(t.slice(3, i));
        return (q.length >= 3 && m) ? ceDamga({ a: 'Y', r: r, w: w, x: q[0], y: q[1], s: q[2] || 34, m: m }) : null;
      }
      var d = t.charAt(3), n = ceSayiCoz(t.slice(4));
      if (d === 't' || d === 'x') return n.length >= 3 ? ceDamga({ a: 'T', r: r, w: w, d: d, x: n[0], y: n[1], s: n[2] || 56 }) : null;
      if (d === 'c') return n.length >= 4 ? ceDamga({ a: 'T', r: r, w: w, d: 'c', x: n[0], y: n[1], rx: Math.max(4, n[2]), ry: Math.max(4, n[3]) }) : null;
      if (d === 'n') return n.length >= 4 ? ceDamga({ a: 'T', r: r, w: w, d: 'n', x: n[0], y: n[1], s: n[2] || 50, n: Math.max(1, Math.min(10, Math.round(n[3]))) }) : null;
      return null;
    }
    /* silgi ve «kaldığım yer» için işaretin noktaları (çizgi gibi kullanılır) */
    function ceDamga(c) {
      var x = c.x, y = c.y, s = c.s || 50, p, i;
      if (c.a === 'T' && c.d === 't') p = [x - .45 * s, y - .02 * s, x - .12 * s, y + .32 * s, x + .5 * s, y - .38 * s];
      else if (c.a === 'T' && c.d === 'x') p = [x - .4 * s, y - .4 * s, x + .4 * s, y + .4 * s, x + .4 * s, y - .4 * s, x - .4 * s, y + .4 * s];
      else if (c.a === 'T' && c.d === 'c') { p = []; for (i = 0; i <= 24; i++) { var t = i / 24 * 2 * Math.PI; p.push(x + c.rx * Math.cos(t), y + c.ry * Math.sin(t)); } }
      else {
        var g = c.a === 'Y' ? Math.max(s, String(c.m || '').length * s * .5) : .7 * s, h = c.a === 'Y' ? .6 * s : .55 * s;
        var x0 = c.a === 'Y' ? (ceRtl(c.m) ? x - g : x) : x - g / 2, x1 = x0 + g;
        p = [x0, y - h, x1, y - h, x1, y + h, x0, y + h, x0, y - h, x1, y + h, x1, y - h, x0, y + h];
      }
      c.p = p.map(kkR);
      return c;
    }
    function ceEl(ad, o) { var e = document.createElementNS(KK_NS, ad); for (var k in o) e.setAttribute(k, o[k]); return e; }
    function ceG(c) { var g = document.createElementNS(KK_NS, 'g'); ceYaz(g, c); return g; }
    function ceUcYon(p) {                                          /* okun ucu: son ~16 birimin yönü */
      var n = p.length / 2, ex = p[2 * n - 2], ey = p[2 * n - 1];
      for (var i = n - 2; i >= 0; i--) {
        var dx = ex - p[2 * i], dy = ey - p[2 * i + 1], L = Math.sqrt(dx * dx + dy * dy);
        if (L >= 16 || i === 0) return L > 0.5 ? [dx / L, dy / L] : null;
      }
      return null;
    }
    function ceUzunluk(p) { var u = 0; for (var i = 2; i + 1 < p.length; i += 2) u += Math.sqrt((p[i] - p[i - 2]) * (p[i] - p[i - 2]) + (p[i + 1] - p[i - 1]) * (p[i + 1] - p[i - 1])); return u; }
    function ceYaz(g, c) {
      while (g.firstChild) g.removeChild(g.firstChild);
      var renk = KK_RENK[c.r] || KK_RENK[1], w = KK_KALIN[c.w] || KK_KALIN.o;
      g.setAttribute('class', 'kk-ce');
      if (c.a === 'O') {
        var p = c.p, n = p.length / 2, k = w * 1.3;
        if (!n) return;
        if (n >= 2) g.appendChild(ceEl('path', { d: kkCR(p, '', 'M'), stroke: renk, 'stroke-width': kkR(k) }));
        g.appendChild(ceEl('circle', { cx: kkR(p[0]), cy: kkR(p[1]), r: kkR(Math.max(7, k * 2.5)), fill: renk }));      /* başta büyük nokta */
        var u = n >= 2 ? ceUcYon(p) : null;
        if (u) {                                                                                               /* sonda ok ucu */
          var L = Math.max(16, k * 5.2), x = p[2 * n - 2], y = p[2 * n - 1], bx = x - u[0] * L, by = y - u[1] * L, nx = -u[1] * L * .5, ny = u[0] * L * .5;
          g.appendChild(ceEl('path', { 'class': 'kk-kd', fill: renk, d: 'M' + kkR(x + u[0] * L * .18) + ' ' + kkR(y + u[1] * L * .18) +
            'L' + kkR(bx + nx) + ' ' + kkR(by + ny) + 'L' + kkR(bx - nx) + ' ' + kkR(by - ny) + 'Z' }));
        }
        return;
      }
      var s = c.s || 50, cx = c.x, cy = c.y, kal = Math.max(3.4, w * 1.7);
      if (c.a === 'T' && c.d === 't') {
        g.appendChild(ceEl('path', { stroke: renk, 'stroke-width': kkR(kal * 1.15), d: 'M' + kkR(cx - .45 * s) + ' ' + kkR(cy - .02 * s) +
          'L' + kkR(cx - .12 * s) + ' ' + kkR(cy + .32 * s) + 'L' + kkR(cx + .5 * s) + ' ' + kkR(cy - .38 * s) }));
      } else if (c.a === 'T' && c.d === 'x') {
        var q = .36 * s;
        g.appendChild(ceEl('path', { stroke: renk, 'stroke-width': kkR(kal * 1.1), d: 'M' + kkR(cx - q) + ' ' + kkR(cy - q) + 'L' + kkR(cx + q) + ' ' + kkR(cy + q) +
          'M' + kkR(cx + q) + ' ' + kkR(cy - q) + 'L' + kkR(cx - q) + ' ' + kkR(cy + q) }));
      } else if (c.a === 'T' && c.d === 'c') {
        g.appendChild(ceEl('ellipse', { cx: kkR(cx), cy: kkR(cy), rx: kkR(c.rx), ry: kkR(c.ry), fill: 'none', stroke: renk, 'stroke-width': kkR(kal) }));
      } else {
        var yaz = c.a === 'Y', rt = yaz ? ceRtl(c.m) : true;
        var te = ceEl('text', { x: kkR(cx), y: kkR(cy), fill: renk, 'font-size': kkR(s), 'dominant-baseline': 'central', 'class': rt ? 'kk-ce-ar' : 'kk-ce-tr' });
        if (!yaz) te.setAttribute('text-anchor', 'middle');
        else if (rt) { te.setAttribute('direction', 'rtl'); te.setAttribute('text-anchor', 'start'); }   /* sağdan sola: dokunulan yerden sola */
        te.textContent = yaz ? String(c.m || '') : CE_RAKAM[Math.max(1, Math.min(10, c.n || 1)) - 1];
        g.appendChild(te);
      }
    }
    /* ders.js'teki işaret (sayfa yüzdesi; boylar sayfa eninin yüzdesi) → çizim kaydı */
    function ceDersten(m) {
      if (!m || typeof m !== 'object') return null;
      function X(v) { return Math.max(0, Math.min(KK_EN, (+v || 0) * KK_EN / 100)); }
      function Y(v) { return Math.max(0, Math.min(KK_BOY, (+v || 0) * KK_BOY / 100)); }
      function B(v, d) { var n = +v; return (n > 0 ? n : d) * KK_EN / 100; }
      var r = (+m.r >= 0 && +m.r < KK_RENK.length) ? +m.r : null, w = KK_KALIN[m.w] ? m.w : 'o';
      if (m.t === 'tik' || m.t === 'carpi') return ceDamga({ a: 'T', d: m.t === 'tik' ? 't' : 'x', r: r != null ? r : (m.t === 'tik' ? 3 : 2), w: w, x: X(m.x), y: Y(m.y), s: B(m.s, 5.6) });
      if (m.t === 'sayi') return ceDamga({ a: 'T', d: 'n', r: r != null ? r : 1, w: w, x: X(m.x), y: Y(m.y), s: B(m.s, 5), n: Math.max(1, Math.min(10, Math.round(+m.n || 1))) });
      if (m.t === 'daire') return ceDamga({ a: 'T', d: 'c', r: r != null ? r : 1, w: w, x: X(m.x), y: Y(m.y), rx: B(m.rx, 6), ry: B(m.ry, 3.6) });
      if (m.t === 'ok' && Array.isArray(m.p) && m.p.length >= 4) {
        var p = [];
        for (var i = 0; i + 1 < m.p.length; i += 2) p.push(kkR(X(m.p[i])), kkR(Y(m.p[i + 1])));
        return { a: 'O', r: r != null ? r : 1, w: w, p: p };
      }
      if (m.t === 'yazi' && m.m) return ceDamga({ a: 'Y', r: r != null ? r : 1, w: w, x: X(m.x), y: Y(m.y), s: B(m.s, 3.4), m: String(m.m) });
      return null;
    }
    /* ---------- koyma: damga / daire / rakam (parmak kalkınca), yazı ---------- */
    function ceYeni(C) {
      var a = KK.arac, w = KK.kal;
      if (a === 'ct' || a === 'cx') return ceDamga({ a: 'T', r: CE_RENK[a], w: w, d: a.charAt(1), x: kkR(C.x), y: kkR(C.y), s: CE_BOY[w] || 56 });
      if (a === 'cn') return ceDamga({ a: 'T', r: KK.renk, w: w, d: 'n', x: kkR(C.x), y: kkR(C.y), s: CE_SAYI[w] || 50, n: KK.ceSayi || 1 });
      if (a === 'cc') {
        var dx = C.x - C.x0, dy = C.y - C.y0;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return ceDamga({ a: 'T', r: KK.renk, w: w, d: 'c', x: kkR(C.x0), y: kkR(C.y0), rx: 62, ry: 36 });
        return ceDamga({ a: 'T', r: KK.renk, w: w, d: 'c', x: kkR((C.x + C.x0) / 2), y: kkR((C.y + C.y0) / 2), rx: kkR(Math.max(8, Math.abs(dx) / 2)), ry: kkR(Math.max(8, Math.abs(dy) / 2)) });
      }
      return null;
    }
    function ceHayal() {                                           /* basılıyken: konacağı yer, soluk */
      var C = KK.ce;
      if (!C || KK.arac === 'cy') return;
      var v = kkSvg(C.o.yuz, true), c = ceYeni(C);
      if (!v || !c) return;
      if (!C.el) C.el = ceG(c); else ceYaz(C.el, c);
      C.el.setAttribute('class', 'kk-ce kk-ce-hayal');
      if (C.el.parentNode !== v.lastChild) v.lastChild.appendChild(C.el);
    }
    function ceHayalSil(C) { if (C && C.el && C.el.parentNode) C.el.parentNode.removeChild(C.el); }
    function ceBas(e) {
      var o = kkNoktadaki(e.clientX, e.clientY);
      if (!o) return;
      var b = kkBirim(o, e.clientX, e.clientY);
      KK.ce = { id: e.pointerId, o: o, x0: b[0], y0: b[1], x: b[0], y: b[1], el: null };
      ceHayal();
    }
    function ceOynat(e) {
      var C = KK.ce;
      if (!C) return;
      var b = kkBirim(C.o, e.clientX, e.clientY);
      C.x = Math.max(0, Math.min(KK_EN, b[0])); C.y = Math.max(0, Math.min(KK_BOY, b[1]));
      ceHayal();
    }
    function ceBirak(e) {
      var C = KK.ce;
      KK.ce = null;
      if (!C) return;
      ceHayalSil(C);
      if (e.type !== 'pointerup') return;
      if (KK.arac === 'cy') { ceYaziAc(C.o, C.x0, C.y0); return; }
      var c = ceYeni(C);
      if (c) ceEkle(C.o.s, c);
    }
    function ceIptal() { var C = KK.ce; KK.ce = null; ceHayalSil(C); }
    function ceEkle(s, c) {
      var rec = KK.M[s], L = kkCizgiler(rec), onceki = rec ? 'm' + kkImza(rec) : '-';
      L.push(c);
      kkSayfaYaz(s, L, true);
      KK.geri.push({ t: 'ekle', s: s, c: c });
      if (KK.geri.length > 120) KK.geri.shift();
      KK.ileri = [];
      kkSayfaEkle(s, onceki, [c]);
      kkGonder([s]);
      kkSonYaz(s, c.p, 8);
      kkGeriDurum();
      if (c.a === 'T' && c.d === 'n') { KK.ceSayi = c.n >= 10 ? 1 : c.n + 1; ceSayiGoster(); }
    }
    /* yazı: dokunulan yerde sayfanın içinde bir satır (büyütmeyle birlikte büyür); Enter koyar, Esc vazgeçer */
    function ceYaziAc(o, x, y) {
      ceYaziBitir(true);
      var inp = document.createElement('input');
      inp.type = 'text'; inp.className = 'kk-ce-girdi'; inp.spellcheck = false; inp.autocomplete = 'off';
      inp.setAttribute('aria-label', 'Sayfaya yazılacak cevap');
      inp.setAttribute('enterkeyhint', 'done');
      KK.yazi = { o: o, s: o.s, x: x, y: y, boy: CE_YAZI[KK.kal] || 34, el: inp, r: KK.renk, w: KK.kal };
      inp.style.color = KK_RENK[KK.renk] || KK_RENK[1];
      ['pointerdown', 'touchstart', 'click', 'dblclick', 'wheel'].forEach(function (t) { inp.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: t !== 'click' }); });
      inp.addEventListener('input', ceYaziYer);
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); ceYaziBitir(true); }
        else if (e.key === 'Escape') { e.preventDefault(); ceYaziBitir(false); }
        e.stopPropagation();
      });
      o.yuz.appendChild(inp);
      ceYaziYer();
      if (CK.istem) ceKlavye(true, inp); else CK.hedef = inp;
      try { inp.focus({ preventScroll: true }); } catch (x2) { inp.focus(); }
    }
    function ceYaziYer() {
      var Y = KK.yazi;
      if (!Y) return;
      var el = Y.el, W = Y.o.yuz.offsetWidth || 1, rt = el.value ? ceRtl(el.value) : CK.dil !== 'tr';
      var xp = Y.x / KK_EN * 100, en = Math.min(70, Math.max(30, (rt ? xp : 100 - xp) - 1));
      el.style.fontSize = (Y.boy * W / KK_EN) + 'px';
      el.style.top = (Y.y / KK_BOY * 100) + '%';
      el.style.width = en + '%';
      if (rt) { el.style.left = ''; el.style.right = (100 - xp) + '%'; el.style.textAlign = 'right'; el.setAttribute('dir', 'rtl'); }
      else { el.style.right = ''; el.style.left = xp + '%'; el.style.textAlign = 'left'; el.setAttribute('dir', 'ltr'); }
    }
    function ceYaziBitir(kaydet) {
      var Y = KK.yazi;
      if (!Y) return;
      KK.yazi = null;
      if (CK.hedef === Y.el) CK.hedef = null;
      var m = String(Y.el.value || '').replace(/\s+/g, ' ').trim();
      if (Y.el.parentNode) Y.el.parentNode.removeChild(Y.el);
      if (kaydet && m) ceEkle(Y.s, ceDamga({ a: 'Y', r: Y.r, w: Y.w, x: kkR(Y.x), y: kkR(Y.y), s: Y.boy, m: m }));
    }
    /* ---------- şeritte «Cevapla» takımı ---------- */
    function ceDug(k, t, ic) {
      return '<button type="button" class="kk-s kk-a kk-ce" data-kk="' + k + '" title="' + t + '" aria-label="' + t + '" aria-pressed="false">' + ic + '</button>';
    }
    function ceSeritHtml() {
      return '<span class="kk-sg kk-cevapla" role="group" aria-label="Cevapla">' +
        ceDug('ct', 'Doğru: ✓ koy (yeşil)', svg(CE_IK.ct)) +
        ceDug('cx', 'Yanlış: ✗ koy (kırmızı)', svg(CE_IK.cx)) +
        ceDug('cc', 'Daire: doğru şıkkı daire içine al (sürükle: boyu)', svg(CE_IK.cc)) +
        ceDug('cn', 'Rakam ١ … ١٠: her koyuşta bir sonraki · yine dokun: seç', '<b class="kk-ce-n" aria-hidden="true">١</b>') +
        ceDug('co', 'Ok: eşleştir — parmağını izler; başta nokta, sonda ok', svg(CE_IK.co)) +
        ceDug('cy', 'Yazı: dokunduğun yere yaz (yüzen klavye)', svg(CE_IK.cy)) +
        '<span class="kk-ce-sayilar" role="menu" aria-label="Rakam seç" hidden>' +
        CE_RAKAM.map(function (r, i) { return '<button type="button" class="kk-ce-sb" data-cn="' + (i + 1) + '" role="menuitemradio">' + r + '</button>'; }).join('') +
        '</span></span>';
    }
    function ceSayiGoster() {
      var p = KK.palet;
      if (!p) return;
      var n = Math.max(1, Math.min(10, KK.ceSayi || 1)), b = p.querySelector('.kk-ce-n');
      if (b) b.textContent = CE_RAKAM[n - 1];
      [].forEach.call(p.querySelectorAll('[data-cn]'), function (x) { x.setAttribute('aria-checked', +x.getAttribute('data-cn') === n ? 'true' : 'false'); });
    }
    function ceSayiMenu(ac) {
      var p = KK.palet, m = p && p.querySelector('.kk-ce-sayilar');
      KK.ceSayiAcik = !!ac && !!m && KK.acik && KK.arac === 'cn' && !KK.kucuk;
      if (!m) return;
      m.hidden = !KK.ceSayiAcik;
      if (!KK.ceSayiAcik) return;
      var b = p.querySelector('[data-kk="cn"]'), pr = p.getBoundingClientRect(), br = b.getBoundingClientRect(), sr = sahne.getBoundingClientRect();
      var en = m.offsetWidth, boy = m.offsetHeight, x = br.left + br.width / 2 - en / 2, y = pr.bottom + 8;
      if (y + boy > sr.bottom - 6 && pr.top - 8 - boy >= sr.top + 6) y = pr.top - 8 - boy;
      x = Math.max(sr.left + 6, Math.min(sr.right - en - 6, x));
      m.style.left = Math.round(x - pr.left - p.clientLeft) + 'px';
      m.style.top = Math.round(y - pr.top - p.clientTop) + 'px';
    }
    function ceAracTik(k) {
      if (k === 'cn' && KK.arac === 'cn') { ceSayiMenu(!KK.ceSayiAcik); return; }
      kkAracSec(k);
      if (k === 'cy') { CK.istem = true; kkTost('Yazı: sayfada yazacağın yere dokun · yüzen klavye açılır'); }
      else if (k === 'co') kkTost('Ok: eşleştirmeyi parmağınla çiz — başta nokta, sonda ok ucu');
      else if (k === 'cc') kkTost('Daire: şıkkın çevresini sürükle (dokunursan hazır boy)');
    }
    /* ---------- YÜZEN KLAVYE: Arapça (harekeli) · Türkçe · rakamlar; başlığından sürüklenir ---------- */
    var CK = { el: null, hedef: null, dil: 'ar', buyuk: false, rakam: false, istem: true, yer: null, suruk: null };
    var CK_HAREKE = ['ً', 'ٌ', 'ٍ', 'َ', 'ُ', 'ِ', 'ّ', 'ْ', 'ـ'];
    var CK_AR = [
      ['ذ', 'ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
      ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
      ['ئ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ', 'أ', 'إ', 'آ']
    ];
    var CK_TR = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i'], ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç']];
    var CK_RK = [['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '٠'], ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], ['-', '+', '=', '(', ')', '/', ':', '«', '»', '"']];
    var CK_RENK = { 'ب': '#d4efdf', 'ت': '#d4efdf', 'ث': '#d4efdf', 'ج': '#fadbd8', 'ح': '#fadbd8', 'خ': '#fadbd8', 'د': '#fae5d3', 'ذ': '#fae5d3',
      'ر': '#fcf3cf', 'ز': '#fcf3cf', 'س': '#d6eaf8', 'ش': '#d6eaf8', 'ص': '#e8daef', 'ض': '#e8daef', 'ط': '#d1f2eb', 'ظ': '#d1f2eb',
      'ع': '#f5b7b1', 'غ': '#f5b7b1', 'ف': '#d4e6f1', 'ق': '#d4e6f1', 'ا': '#ebedef', 'ء': '#ebedef', 'ؤ': '#ebedef', 'ئ': '#ebedef', 'ي': '#d7bde2', 'ى': '#d7bde2' };
    function ckTus(k, et, sinif, baslik) {
      return '<button type="button" class="kz-kl-t' + (sinif ? ' ' + sinif : '') + '" data-k="' + kkEsc(k) + '"' + (baslik ? ' title="' + baslik + '" aria-label="' + baslik + '"' : '') +
        (CK_RENK[k] ? ' style="background:' + CK_RENK[k] + '"' : '') + '>' + et + '</button>';
    }
    function ckHtml() {
      var h = '<div class="kz-kl-bas" data-k="__tut"><span class="kz-kl-tut">⠿ Klavye</span>' +
        '<button type="button" class="kz-kl-x" data-k="__kapat" title="Klavyeyi kapat" aria-label="Klavyeyi kapat">✕</button></div>';
      if (CK.rakam) CK_RK.forEach(function (sr) { h += '<div class="kz-kl-sira">' + sr.map(function (k) { return ckTus(k, kkEsc(k)); }).join('') + '</div>'; });
      else if (CK.dil === 'tr') {
        CK_TR.forEach(function (sr, i) {
          h += '<div class="kz-kl-sira">' + (i === 2 ? ckTus('__buyuk', '⇧', 'kz-ozel' + (CK.buyuk ? ' basili' : ''), 'Büyük harf') : '') +
            sr.map(function (k) { var u = CK.buyuk ? (k === 'i' ? 'İ' : k === 'ı' ? 'I' : k.toLocaleUpperCase('tr-TR')) : k; return ckTus(u, kkEsc(u)); }).join('') +
            (i === 2 ? ckTus('__sil', '⌫', 'kz-ozel', 'Sil') : '') + '</div>';
        });
      } else {
        h += '<div class="kz-kl-sira kz-hr">' + CK_HAREKE.map(function (k) { return ckTus(k, k === 'ـ' ? 'ـ' : '◌' + k, 'kz-hr'); }).join('') + '</div>';
        CK_AR.forEach(function (sr, i) { h += '<div class="kz-kl-sira">' + sr.map(function (k) { return ckTus(k, k); }).join('') + (i === 2 ? ckTus('__sil', '⌫', 'kz-ozel', 'Sil') : '') + '</div>'; });
      }
      var ar = CK.dil !== 'tr';
      return h + '<div class="kz-kl-sira">' +
        ckTus('__dil', ar ? 'ABC' : 'عربي', 'kz-ozel', ar ? 'Türkçe klavye' : 'Arapça klavye') +
        ckTus('__rakam', CK.rakam ? (ar ? 'ا ب' : 'abc') : '١٢٣', 'kz-ozel', 'Rakamlar') +
        ckTus(ar ? '،' : ',', ar ? '،' : ',') + ckTus(' ', '', 'kz-bosluk', 'Boşluk') + ckTus(ar ? '؟' : '?', ar ? '؟' : '?') + ckTus('.', '.') +
        (CK.rakam || CK.dil === 'tr' ? '' : ckTus('__sil', '⌫', 'kz-ozel', 'Sil')) +
        ckTus('__yaz', '✓ Yaz', 'kz-ozel kz-yaz', 'Sayfaya yaz') + '</div>';
    }
    function ckCiz() { if (CK.el) { CK.el.innerHTML = ckHtml(); CK.el.classList.toggle('kz-tr', CK.dil === 'tr' && !CK.rakam); } }
    function ckKur() {
      var k = CK.el = document.createElement('div');
      k.className = 'kz-klavye'; k.hidden = true;
      k.setAttribute('role', 'group'); k.setAttribute('aria-label', 'Yüzen klavye');
      try { var y = JSON.parse(localStorage.getItem('kitapKlavyeYer') || 'null'); if (y && isFinite(y.x) && isFinite(y.y)) CK.yer = y; } catch (e) { }
      ckCiz();
      document.body.appendChild(k);
      ['touchstart', 'wheel', 'dblclick'].forEach(function (t) { k.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true }); });
      k.addEventListener('pointerdown', function (e) {
        e.stopPropagation();
        var b = e.target.closest && e.target.closest('[data-k]');
        if (!b) return;
        e.preventDefault();                                      /* yazı satırı odaktan çıkmasın */
        var d = b.getAttribute('data-k');
        if (d === '__tut') { ckSurukBas(e); return; }
        b.classList.add('basili'); setTimeout(function () { b.classList.remove('basili'); }, 130);
        ckBas(d);
      });
      k.addEventListener('pointermove', ckSurukOynat);
      k.addEventListener('pointerup', ckSurukBitir);
      k.addEventListener('pointercancel', ckSurukBitir);
      k.addEventListener('click', function (e) { e.stopPropagation(); e.preventDefault(); });
      window.addEventListener('resize', function () { if (CK.el && !CK.el.hidden) ckYerlestir(); });
    }
    function ckBas(d) {
      var t = CK.hedef;
      if (d === '__kapat') { ceKlavye(false); CK.istem = false; if (t) { t.removeAttribute('inputmode'); try { t.focus(); } catch (e) { } } return; }
      if (d === '__dil') { CK.dil = CK.dil === 'tr' ? 'ar' : 'tr'; CK.rakam = false; ckCiz(); ceYaziYer(); return; }
      if (d === '__rakam') { CK.rakam = !CK.rakam; ckCiz(); return; }
      if (d === '__buyuk') { CK.buyuk = !CK.buyuk; ckCiz(); return; }
      if (!t || !document.documentElement.contains(t)) return;
      if (d === '__yaz') { if (KK.yazi && KK.yazi.el === t) ceYaziBitir(true); else { t.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); try { t.blur(); } catch (e) { } } return; }
      var a = t.selectionStart, b = t.selectionEnd;
      if (a == null) { a = b = t.value.length; }
      if (d === '__sil') { if (a === b) { if (!a) return; a -= 1; } ckKoy(t, '', a, b); return; }
      ckKoy(t, d, a, b);
      if (CK.buyuk && CK.dil === 'tr' && !CK.rakam) { CK.buyuk = false; ckCiz(); }
    }
    function ckKoy(t, ch, a, b) {
      if (typeof t.setRangeText === 'function') t.setRangeText(ch, a, b, 'end');
      else { t.value = t.value.slice(0, a) + ch + t.value.slice(b); }
      t.dispatchEvent(new Event('input', { bubbles: true }));
      if (document.activeElement !== t) { try { t.focus({ preventScroll: true }); } catch (e) { } }
    }
    function ckYerlestir() {
      var k = CK.el;
      if (!k || k.hidden) return;
      var W = window.innerWidth, H = window.innerHeight, en = k.offsetWidth, boy = k.offsetHeight, x, y;
      if (CK.yer) { x = CK.yer.x * Math.max(1, W - en); y = CK.yer.y * Math.max(1, H - boy); }
      else { x = (W - en) / 2; y = H - boy - 14; }
      x = Math.max(4, Math.min(W - en - 4, x)); y = Math.max(4, Math.min(H - boy - 4, y));
      k.style.left = Math.round(x) + 'px'; k.style.top = Math.round(y) + 'px';
    }
    function ckSurukBas(e) {
      var r = CK.el.getBoundingClientRect();
      CK.suruk = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top };
      try { CK.el.setPointerCapture(e.pointerId); } catch (x) { }
      CK.el.classList.add('kz-suruk');
    }
    function ckSurukOynat(e) {
      var S = CK.suruk;
      if (!S || S.id !== e.pointerId) return;
      var k = CK.el, W = window.innerWidth, H = window.innerHeight, en = k.offsetWidth, boy = k.offsetHeight;
      var x = Math.max(4, Math.min(W - en - 4, e.clientX - S.dx)), y = Math.max(4, Math.min(H - boy - 4, e.clientY - S.dy));
      k.style.left = Math.round(x) + 'px'; k.style.top = Math.round(y) + 'px';
      CK.yer = { x: x / Math.max(1, W - en), y: y / Math.max(1, H - boy) };
    }
    function ckSurukBitir(e) {
      var S = CK.suruk;
      if (!S || S.id !== e.pointerId) return;
      CK.suruk = null;
      CK.el.classList.remove('kz-suruk');
      try { localStorage.setItem('kitapKlavyeYer', JSON.stringify(CK.yer)); } catch (x) { }
    }
    function ceKlavye(ac, hedef) {
      if (!ac) { if (CK.el) CK.el.hidden = true; return; }
      if (!CK.el) ckKur();
      if (hedef) CK.hedef = hedef;
      if (CK.hedef) CK.hedef.setAttribute('inputmode', 'none');   /* dokunmatik cihazın kendi klavyesi açılmasın */
      CK.el.hidden = false;
      ckYerlestir();
    }
    (function () {                                                  /* sayfa çevrilince açık yazı yerine konur */
      var onceki = flip.degisti;
      flip.degisti = function () {
        var r = onceki.apply(this, arguments);
        if (KK.yazi && kkGorunen().indexOf(KK.yazi.s) < 0) ceYaziBitir(true);
        if (KK.ceSayiAcik) ceSayiMenu(false);
        return r;
      };
    })();
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
    /* DOĞAL KALEM (25.10.2026). Öğretmen: "flipbooklarda kalemle yazınca kalem hassasiyetini ve
       performansını nasıl arttırırız, ayrıca çizgiler düzleşiyor nedense, doğal olsun kalem
       kullanımı" (kalınlık bastırmaya göre; en çok akıllı tahtada parmakla, telefon / tablette).
       · DÜZLEŞME: eski yumuşatma her noktayı bir öncekiyle ortalıyordu; hızlı yazınca küçük
         döngüler ve köşeler siliniyordu. Yerine 1€ süzgeci (Casiez, 2012): yavaş yazarken
         dokunmatik tahtanın titremesini alır, hızlanınca gecikmez. Parmakta noktalar en az
         ~2 px aralıklı (yavaş yazıda titreme kıvrım yapmasın). Fare süzülmez, kalem ucu çok
         az süzülür. Çizgi bütün noktalarından geçer (kkCR).
       · KALINLIK: kalem ucunda bastırmaya göre (iPad kalemi, tablet kalemi); parmak ve farede
         hıza göre (yavaşta biraz kalın, hızlıda biraz ince; olağan hız bu cihazda öğrenilir);
         bastırmasız yazıda çizginin ucu hafifçe incelir.
       · AKICILIK: yazılan çizginin bitmiş kısmı parça parça dondurulur, her karede yalnız son
         parça yeniden çizilir; tarayıcı veriyorsa (Chrome) kalemin gideceği yer bir adım önden
         gösterilir (saklanmaz). */
    var KK_SUZ = { touch: [2.5, 0.08, 10], pen: [6, 0.15, 20] };     /* 1€: en düşük kesim (Hz) · hız katsayısı · hız süzgeci (Hz) */
    var KK_ADIM = { touch: 1.8 };                                     /* noktalar arası en az (ekranda px; parmakta seyrek: titreme kıvrılmasın) */
    var KK_PARCA = 48;                                                /* canlı çizimde donan parça (nokta) */
    var kkHizOrt = 0;                                                 /* bu cihazda olağan yazma hızı (px/sn) */
    function kkSuzgec(tur) {
      var k = KK_SUZ[tur] || null, S = { x: null, y: 0, dx: 0, dy: 0, t: 0, v: 0 };
      function al(fc, te) { return 1 / (1 + 1 / (2 * Math.PI * fc) / te); }
      S.ekle = function (x, y, t) {
        if (S.x === null) { S.x = x; S.y = y; S.t = t; return; }
        var te = (t - S.t) / 1000;
        if (!(te > 0.0005)) te = 1 / 120;                             /* aynı ya da geri damga */
        else S.t = t;
        var ad = al(k ? k[2] : 20, te);
        S.dx += ((x - S.x) / te - S.dx) * ad; S.dy += ((y - S.y) / te - S.dy) * ad;
        S.v = Math.sqrt(S.dx * S.dx + S.dy * S.dy);
        if (!k) { S.x = x; S.y = y; return; }                         /* fare: olduğu gibi */
        var a = al(k[0] + k[1] * S.v, te);
        S.x += (x - S.x) * a; S.y += (y - S.y) * a;
      };
      return S;
    }
    function kkHiz0() {
      if (kkHizOrt) return kkHizOrt;
      var kaba = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      return kaba ? (Math.min(window.innerWidth, window.innerHeight) >= 700 ? 260 : 420) : 650;
    }
    function kkHizOgren(L) {
      if (!L || L.length < 6) return;
      L.sort(function (a, b) { return a - b; });
      var m = L[L.length >> 1];
      kkHizOrt = Math.max(80, Math.min(3000, kkHizOrt ? kkHizOrt * 0.75 + m * 0.25 : m));
    }
    function kkBaskili(e) { return e.pointerType === 'pen' && e.pressure > 0 && e.pressure !== 0.5; }
    function kkOran(cz, e) {                                          /* bu noktada kalınlığın katı */
      var f;
      if (cz.baski || kkBaskili(e)) {
        cz.baski = true;
        f = 0.45 + 1.1 * Math.pow(Math.max(0, Math.min(1, e.pressure || 0)), 0.65);   /* hafif ~0,7 · olağan ~1 · sert 1,55 */
      } else {
        f = 1.2 - 0.2 * Math.min(2.5, cz.f.v / cz.hiz0);              /* yavaş 1,2 · olağan 1 · çok hızlı 0,7 */
      }
      cz.fk = cz.fk == null ? f : cz.fk + (f - cz.fk) * 0.3;          /* birden zıplamasın */
      return Math.round(cz.fk * 20) / 20;
    }
    function kkCizBasla(e, o) {
      var fos = KK.arac === 'f', ok = KK.arac === 'co', b = kkBirim(o, e.clientX, e.clientY);
      var c = { a: ok ? 'O' : (fos ? 'F' : 'K'), r: fos ? 0 : KK.renk, w: KK.kal, p: [kkR(b[0]), kkR(b[1])] };   /* 'O': CEVAPLA oku */
      var olcek = o.r.width / KK_EN;                                  /* ekranda bir birimin pikseli */
      var cz = KK.cz = { id: e.pointerId, s: o.s, o: o, c: c, t0: Date.now(), adim: Math.max(0.1, (KK_ADIM[e.pointerType] || 0.75) / olcek), olcek: olcek,
                         f: kkSuzgec(e.pointerType), hiz0: kkHiz0(), baski: false, fk: null, hizlar: [], don: 0, tah: null,
                         k: '', g: 0, el: null };
      cz.f.ekle(e.clientX, e.clientY, e.timeStamp || 0);
      if (!fos && !ok) c.b = [kkBaskili(e) ? kkOran(cz, e) : (cz.fk = 0.9)];
      cz.el = kkCanliKap(c);
      var v = kkSvg(o.yuz, true);
      if (v) kkGrup(v, c).appendChild(cz.el);
      kkCanliCiz(cz);
      KK.seritR = kkSeritKutu();
      kkCanliBasla();
    }
    function kkCizEkle(cz, ev) {
      cz.f.ekle(ev.clientX, ev.clientY, ev.timeStamp || 0);
      if (cz.f.v > 15 && cz.hizlar.length < 4000) cz.hizlar.push(cz.f.v);
      var c = cz.c, p = c.p, n = p.length, b = kkBirim(cz.o, cz.f.x, cz.f.y);
      var f = c.b ? kkOran(cz, ev) : 0;
      var dx = b[0] - p[n - 2], dy = b[1] - p[n - 1];
      if (dx * dx + dy * dy < cz.adim * cz.adim) {                    /* çok yakın: yalnız bastırma (nokta koyulaşır) */
        if (c.b && cz.baski && f > c.b[c.b.length - 1]) c.b[c.b.length - 1] = f;
        return false;
      }
      p.push(kkR(b[0]), kkR(b[1]));
      if (c.b) c.b.push(f);
      return true;
    }
    /* tarayıcının tahmini (Chrome): kalemin bir sonraki yeri — yalnız gösterilir, saklanmaz */
    function kkTahmin(cz, e) {
      cz.tah = null;
      if (cz.c.a !== 'K' || e.pointerType === 'mouse' || !e.getPredictedEvents || cz.f.v < 120) return;
      var T = e.getPredictedEvents();
      if (!T || !T.length) return;
      var b = kkBirim(cz.o, T[0].clientX, T[0].clientY), p = cz.c.p, n = p.length;
      var dx = (b[0] - p[n - 2]) * cz.olcek, dy = (b[1] - p[n - 1]) * cz.olcek;   /* ekranda piksel */
      if (dx * dx + dy * dy <= 576) cz.tah = [kkR(b[0]), kkR(b[1])];
    }
    /* canlı çizgi: kalem için grup (donmuş parçalar + değişen son parça), fosforlu için tek yol */
    function kkCanliKap(c) {
      if (c.a !== 'K') return kkYol(c);
      var g = document.createElementNS(KK_NS, 'g'), y = document.createElementNS(KK_NS, 'path');
      g.setAttribute('class', 'kk-canli');
      g.setAttribute('fill', KK_RENK[c.r] || KK_RENK[1]);
      y.setAttribute('class', 'kk-kd');
      g.appendChild(y);
      return g;
    }
    function kkCanliCiz(cz) {
      var c = cz.c, p = c.p, el = cz.el;
      if (!el) return;
      if (c.a !== 'K') { kkYolYaz(el, c); return; }
      var n = p.length / 2, w = KK_KALIN[c.w] || KK_KALIN.o;
      while (n - cz.don > KK_PARCA + 8) {                             /* bitmiş kısmı dondur */
        var a = cz.don, son = a + KK_PARCA, y = document.createElementNS(KK_NS, 'path');
        y.setAttribute('class', 'kk-kd');
        y.setAttribute('d', kkKontur(p.slice(2 * a, 2 * son + 2), c.b.slice(a, son + 1), w));
        el.insertBefore(y, el.lastChild);
        cz.don = son;
      }
      var pp = p.slice(2 * cz.don), bb = c.b.slice(cz.don);
      if (cz.tah) { pp.push(cz.tah[0], cz.tah[1]); bb.push(bb[bb.length - 1]); }
      el.lastChild.setAttribute('d', kkKontur(pp, bb, w));
    }
    var kkCizRaf = 0;
    function kkCizZamanla() {
      if (kkCizRaf) return;
      kkCizRaf = (window.requestAnimationFrame || setTimeout)(function () {
        kkCizRaf = 0;
        if (KK.cz) kkCanliCiz(KK.cz);
      });
    }
    /* Ramer-Douglas-Peucker: kayıt küçük kalsın (kalınlığı belirgin değişen noktalar da kalır) */
    function kkSadelestir(p, eps, bb) {
      var n = p.length / 2;
      if (n < 3) return { p: p, b: bb };
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
      if (bb) for (var k = 1, sn = 0; k < n; k++) { if (tut[k]) { sn = k; continue; } if (Math.abs(bb[k] - bb[sn]) >= 0.12) { tut[k] = 1; sn = k; } }
      var out = [], ob = bb ? [] : null;
      for (var j = 0; j < n; j++) if (tut[j]) { out.push(p[2 * j], p[2 * j + 1]); if (ob) ob.push(bb[j]); }
      return { p: out, b: ob };
    }
    function kkCizBitir() {
      var cz = KK.cz;
      if (!cz) return;
      KK.cz = null;
      if (cz.el && cz.el.parentNode) cz.el.parentNode.removeChild(cz.el);
      var c = cz.c;
      if (c.a === 'O' && ceUzunluk(c.p) < 12) {                      /* CEVAPLA: dokunuş ok değil */
        if (cz.k && tkLider()) { try { TK.k.gonder({ t: 'kx', k: cz.k, bk: KK_KITAP }); } catch (x) { } }
        kkSeritBirak(); return;
      }
      if (c.b && !cz.baski && c.b.length >= 4) {                       /* bastırmasız yazıda uç hafifçe incelir */
        var m = c.b.length;
        c.b[m - 1] = Math.round(c.b[m - 1] * 0.7 * 20) / 20; c.b[m - 2] = Math.round(c.b[m - 2] * 0.86 * 20) / 20;
      }
      var sd = kkSadelestir(c.p, 0.2, c.b || null);
      c.p = sd.p; if (c.b) c.b = sd.b;
      kkHizOgren(cz.hizlar);
      var rec = KK.M[cz.s], L = kkCizgiler(rec), onceki = rec ? 'm' + kkImza(rec) : '-';
      L.push(c);
      kkSayfaYaz(cz.s, L, true);
      KK.geri.push({ t: 'ekle', s: cz.s, c: c });
      if (KK.geri.length > 120) KK.geri.shift();
      KK.ileri = [];
      kkSayfaEkle(cz.s, onceki, [c]);
      kkGonder([cz.s], cz.k);
      kkSonYaz(cz.s, c.p, (kkFos(c) ? KK_FKALIN[c.w] : KK_KALIN[c.w] * kkEnKalin(c)) / 2 + 2);
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
      var p = c.p, n = p.length / 2, w = (kkFos(c) ? KK_FKALIN[c.w] : KK_KALIN[c.w] * kkEnKalin(c)) / 2, s = rr + w;
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
    /* YER SİLGİSİ — SİLGİ SEÇENEKLERİ (25.10.2026): çizginin yalnız silginin (a→b, yarıçap R)
       geçtiği kısmı silinir. Döner: null (değmedi) · [] (hepsi silindi) · [{p, b}] (kalan parçalar).
       Silgiye yakın aralıklar sık örneklenir; kesik ucu silginin kenarına oturur. */
    function kkKes(c, ax, ay, bx, by, R) {
      var p = c.p, kb = c.b || null, n = p.length / 2;
      var x0 = Math.min(ax, bx) - R, x1 = Math.max(ax, bx) + R, y0 = Math.min(ay, by) - R, y1 = Math.max(ay, by) + R;
      if (n === 1) return (p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1 && kkUzaklik(p[0], p[1], ax, ay, bx, by) <= R) ? [] : null;
      var adim = Math.max(0.3, R / 10), S = [], ic = false;
      for (var i = 0; i < n; i++) {
        var x = p[2 * i], y = p[2 * i + 1], f = kb ? kb[i] : 1;
        if (i > 0) {
          var px = p[2 * i - 2], py = p[2 * i - 1];
          if (!(Math.max(px, x) < x0 || Math.min(px, x) > x1 || Math.max(py, y) < y0 || Math.min(py, y) > y1)) {
            var pf = kb ? kb[i - 1] : 1, L = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py)), k = Math.min(600, Math.ceil(L / adim));
            for (var j = 1; j < k; j++) {
              var t = j / k, qx = px + (x - px) * t, qy = py + (y - py) * t, q = kkUzaklik(qx, qy, ax, ay, bx, by) <= R;
              if (q) ic = true;
              S.push(qx, qy, pf + (f - pf) * t, q ? 1 : 0, 0);
            }
          }
        }
        var qi = x >= x0 && x <= x1 && y >= y0 && y <= y1 && kkUzaklik(x, y, ax, ay, bx, by) <= R;
        if (qi) ic = true;
        S.push(x, y, f, qi ? 1 : 0, 1);
      }
      if (!ic) return null;
      var out = [], cur = null, m = S.length / 5;
      for (var s = 0; s < m; s++) {
        if (S[5 * s + 3]) { if (cur) { out.push(cur); cur = null; } continue; }
        var son = s === m - 1 || S[5 * s + 8];                      /* parçanın son noktası */
        if (!cur || son || S[5 * s + 4]) {                           /* baş, son ve asıl noktalar */
          if (!cur) cur = { p: [], b: kb ? [] : null };
          cur.p.push(kkR(S[5 * s]), kkR(S[5 * s + 1]));
          if (cur.b) cur.b.push(Math.round(S[5 * s + 2] * 20) / 20);
        }
      }
      if (cur) out.push(cur);
      var en = Math.max(1.5, R * 0.15);                              /* kesikten kalan kırıntı atılır */
      return out.filter(function (o) {
        var u = 0;
        for (var i = 2; i < o.p.length; i += 2) u += Math.sqrt((o.p[i] - o.p[i - 2]) * (o.p[i] - o.p[i - 2]) + (o.p[i + 1] - o.p[i - 1]) * (o.p[i + 1] - o.p[i - 1]));
        return u >= en;
      });
    }
    var kkSilRaf = 0, kkSilKirli = {};
    function kkSilCizZamanla(s) {                                     /* yer silgisi: kare başına bir çizim ve gönderim */
      kkSilKirli[s] = 1;
      if (kkSilRaf) return;
      kkSilRaf = (window.requestAnimationFrame || setTimeout)(function () {
        kkSilRaf = 0;
        var L = Object.keys(kkSilKirli).map(Number);
        kkSilKirli = {};
        L.forEach(function (n) { kkSayfaCiz(n); });
        kkGonder(L);
      });
    }
    function kkYerSil(S, o, a, b, rr, L) {
      var yeni = [], degisti = false;
      for (var i = 0; i < L.length; i++) {
        var c = L[i], w = (kkFos(c) ? KK_FKALIN[c.w] : KK_KALIN[c.w] * kkEnKalin(c)) / 2;
        if (ceMi(c)) { if (kkDegiyor(c, a.x, a.y, b[0], b[1], rr)) degisti = true; else yeni.push(c); continue; }   /* CEVAPLA: bütün */
        var P = kkKes(c, a.x, a.y, b[0], b[1], rr + w);
        if (!P) { yeni.push(c); continue; }
        degisti = true;
        for (var j = 0; j < P.length; j++) {
          var d = { a: c.a, r: c.r, w: c.w, p: P[j].p };
          if (c.b && P[j].b) d.b = P[j].b;
          yeni.push(d);
        }
      }
      if (!degisti) return;
      if (!S.once[o.s]) S.once[o.s] = L;
      kkSayfaYaz(o.s, yeni);
      kkSonYaz(o.s, [b[0], b[1]], rr);
      kkSilCizZamanla(o.s);
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
      if (KK.silme === 'y') { kkYerSil(S, o, a, b, rr, L); return; }   /* dokunduğu yeri sil (25.10.2026) */
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
      if (e.target.closest('.kk-ce-girdi')) return;                 /* CEVAPLA: yazı satırına yazılıyor */
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
      if (ceAracMi(KK.arac) && KK.arac !== 'co') { ceBas(e); return; }   /* CEVAPLA: damga · daire · rakam · yazı */
      var o = kkNoktadaki(e.clientX, e.clientY);
      if (!o) { KK.bekle = { id: e.pointerId }; return; }
      kkCizBasla(e, o);
    }
    function kkOynat(e) {
      var d = KK.dok[e.pointerId];
      if (d) { d.x = e.clientX; d.y = e.clientY; }
      if (KK.iki) { if (d) { e.preventDefault(); kkIkiOynat(); } return; }
      if (KK.ce && KK.ce.id === e.pointerId) { e.preventDefault(); ceOynat(e); return; }   /* CEVAPLA */
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
          if (o && o.s !== cz.s) { kkCizEkle(cz, ev); kkCizBitir(); kkCizBasla(ev, o); cz = KK.cz; yeni = true; continue; }
        }
        if (kkCizEkle(cz, ev)) yeni = true;
      }
      kkTahmin(cz, e);
      if (yeni || cz.tah) kkCizZamanla();
      if (yeni) { kkCanliZamanla(); kkYolVer(e.clientX, e.clientY); }
    }
    function kkBirak(e) {
      var d = KK.dok[e.pointerId];
      delete KK.dok[e.pointerId];
      if (KK.iki) { if (Object.keys(KK.dok).length < 2) KK.iki = null; if (d) e.stopPropagation(); return; }
      if (KK.bekle && KK.bekle.id === e.pointerId) KK.bekle = null;
      if (KK.ce && KK.ce.id === e.pointerId) { ceBirak(e); return; }   /* CEVAPLA */
      if (KK.sil && KK.sil.id === e.pointerId) { kkSilgiBitir(); if (e.pointerType === 'mouse') kkSilgiImlec(e); return; }
      if (KK.cz && KK.cz.id === e.pointerId) {
        if (e.type === 'pointerup') kkCizEkle(KK.cz, e);
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
      if (KK.ce) ceIptal();                                          /* CEVAPLA: iki parmak — koyma */
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
        var yeni = cz.c.a === 'K' || cz.c.a === 'F' || cz.c.a === 'O';
        TK.k.gonder({ t: yeni ? 'kd' : 'kc', bk: KK_KITAP, k: cz.k, s: cz.s, a: cz.c.a, r: cz.c.r, w: cz.c.w, b: bas / 2,
                      d: yeni ? kkNoktaKodla10(cz.c.p.slice(bas), cz.c.b ? cz.c.b.slice(bas / 2) : null) : kkNoktaKodla(cz.c.p.slice(bas)) });
      } catch (e) { }
    }
    /* izleyen: gelen */
    function kkGelen(m) {
      if (!KK || !m || (m.bk && m.bk !== KK_KITAP) || tkLider()) return;
      if (m.t === 'kc' || m.t === 'kd') { kkUzakParca(m); return; }
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
      var yeni = m.t === 'kd', Y = yeni ? kkNoktaCoz10(m.d, m.a === 'K') : null;     /* 'kd': DOĞAL KALEM çizgisi */
      var p = yeni ? Y.p : kkNoktaCoz(m.d), s = +m.s;
      if (!p.length || !(s >= 1)) return;
      var u = KK.uzak[m.k];
      if (!u) {
        var a = yeni ? (m.a === 'F' ? 'F' : (m.a === 'O' ? 'O' : 'K')) : (m.a === 'f' ? 'f' : 'k'), r = +m.r || 0;
        u = KK.uzak[m.k] = { s: s, c: { a: a, r: r, w: KK_KALIN[m.w] ? m.w : 'o', p: [] }, el: null };
        if (a === 'K') u.c.b = [];
      }
      u.z = Date.now();
      if ((+m.b || 0) * 2 !== u.c.p.length) { if (+m.b) return; u.c.p = []; if (u.c.b) u.c.b = []; }   /* sırayla gelir; uymayan parça atlanır */
      u.c.p.push.apply(u.c.p, p);
      if (u.c.b && Y && Y.b) u.c.b.push.apply(u.c.b, Y.b);
      var yuz = kkYuz(s), v = yuz && kkSvg(yuz, true);
      if (!v) return;
      if (!u.el) u.el = kkYol(u.c);
      if (u.el.parentNode !== kkGrup(v, u.c)) kkGrup(v, u.c).appendChild(u.el);
      kkYolYaz(u.el, u.c);
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
        if (t.sm === 'y' || t.sm === 'c') KK.silme = t.sm;
        var y = t.y;
        if (y && typeof y === 'object' && isFinite(y.x) && isFinite(y.y) && (y.k === '' || y.k === 'sol' || y.k === 'sag'))
          KK.sabit = { k: y.k, x: Math.max(0, Math.min(1, +y.x)), y: Math.max(0, Math.min(1, +y.y)) };
      } catch (e) { }
    }
    function kkTercihYaz() {
      var t = { r: KK.renk, w: KK.kal, a: KK.sonArac, t: KK.takip ? 1 : 0, k: KK.kucuk ? 1 : 0 };
      if (KK.parmakT === 0 || KK.parmakT === 1) t.pg = KK.parmakT;
      if (KK.silme === 'y') t.sm = 'y';
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
      return h + '</span>' + ceSeritHtml() + '<span class="kk-sg kk-isler">' +
        '<button type="button" class="kk-s kk-a" data-kk="silgi" title="Silgi (E) · yine dokun: seçenekler" aria-label="Silgi" aria-pressed="false">' + svg(KK_IK.silgi) + '</button>' +
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
      var sm = document.createElement('div');                       /* silgi seçenekleri (25.10.2026) */
      sm.className = 'kk-silmenu';
      sm.setAttribute('role', 'menu');
      sm.setAttribute('aria-label', 'Silgi biçimi');
      sm.hidden = true;
      sm.innerHTML = kkSilMenuHtml();
      p.appendChild(sm);
      KK.silMenu = sm;
      document.addEventListener('pointerdown', function (e) { if (KK.silMenuAcik && !(KK.palet && KK.palet.contains(e.target))) kkSilMenu(false); }, true);
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
      sahne.classList.toggle('kk-cevapla', KK.acik && ceAracMi(KK.arac));
      if (KK.palet) { KK.palet.classList.toggle('kk-cevapta', ceAracMi(KK.arac)); ceSayiGoster(); if (KK.arac !== 'cn' && KK.ceSayiAcik) ceSayiMenu(false); }
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
          else if (ceAracMi(k)) sec = KK.arac === k;                  /* CEVAPLA */
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
      kkSilMenuGuncelle();                                          /* silgi seçenekleri (25.10.2026) */
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
      if (ceAracMi(KK.arac) && KK.arac !== 'co') { sahne.style.setProperty('--kk-imlec', KK.arac === 'cy' ? 'text' : 'crosshair'); return; }
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
      if (KK.arac !== 'cy') { ceYaziBitir(true); ceKlavye(false); }   /* CEVAPLA: yazıdan çıkınca yazılan konur */
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
      var cn = e.target.closest && e.target.closest('[data-cn]');
      if (cn && KK.palet && KK.palet.contains(cn)) { e.preventDefault(); KK.ceSayi = +cn.getAttribute('data-cn') || 1; ceSayiMenu(false); ceSayiGoster(); return; }   /* CEVAPLA: rakam seçimi */
      var sm = e.target.closest && e.target.closest('[data-sm]');
      if (sm && KK.silMenu && KK.silMenu.contains(sm)) { e.preventDefault(); kkSilmeSec(sm.getAttribute('data-sm')); return; }
      var b = e.target.closest && e.target.closest('[data-kk]');
      if (!b || !((KK.palet && KK.palet.contains(b)) || (KK.ayar && KK.ayar.contains(b)))) return;
      e.preventDefault();
      var k = b.getAttribute('data-kk');
      if (k !== 'temizle') kkTemizOnay(KK.ayar && KK.ayar.querySelector('[data-kk="temizle"]'), false);
      if (k !== 'yer' && k !== 'git') kkListeKapat();
      if (k !== 'silgi') kkSilMenu(false);
      if (/^r\d$/.test(k)) kkAracSec('k', +k.charAt(1));
      else if (k === 'fos') kkAracSec('f');
      else if (/^w[iok]$/.test(k)) kkKalinlik(k.charAt(1));
      else if (k === 'silgi') { if (KK.arac === 's' && !KK.kucuk) kkSilMenu(!KK.silMenuAcik); else kkAracSec('s'); }   /* ikinci dokunuş: silme biçimi (25.10.2026) */
      else if (k === 'gez') kkAracSec('g');
      else if (ceAracMi(k)) ceAracTik(k);                           /* CEVAPLA */
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

    /* ---------- SİLGİ SEÇENEKLERİ (25.10.2026) ----------
       Öğretmen: "ikinci kez silgiye basınca 2 seçenek çıksın, dokunulan yeri sil, dokunulan
       çizgiyi sil şeklinde". Silgi seçiliyken silgiye yine dokununca küçük menü açılır (şeridin
       içinde, silgi düğmesinin altında; dikey şeritte yanında). Seçim bu cihazda hatırlanır. */
    var KK_SM_IK = {
      y: '<path d="M3 12h5.2M15.8 12H21"/><circle cx="12" cy="12" r="3.4"/>',
      c: '<path d="M3.5 15.5c2.6-5.4 5.4-5.4 8 0s5.4 5.4 8 0"/><path d="M18.5 4.5l-4 4M14.5 4.5l4 4"/>'
    };
    function kkSilMenuHtml() {
      return [['y', 'Dokunduğu yeri sil', 'Çizgi bölünür, gerisi kalır'], ['c', 'Dokunduğu çizgiyi sil', 'Çizginin tamamı silinir']]
        .map(function (x) {
          return '<button type="button" class="kk-sm" data-sm="' + x[0] + '" role="menuitemradio" aria-checked="false">' +
            svg(KK_SM_IK[x[0]]) + '<span>' + x[1] + '<small>' + x[2] + '</small></span></button>';
        }).join('');
    }
    function kkSilMenu(ac) {
      var m = KK.silMenu;
      ac = !!ac && !!m && KK.acik && KK.arac === 's' && !KK.kucuk && !kkMisafirKip();
      KK.silMenuAcik = ac;
      if (!m) return;
      m.hidden = !ac;
      var b = KK.palet && KK.palet.querySelector('[data-kk="silgi"]');
      if (b) b.setAttribute('aria-expanded', ac ? 'true' : 'false');
      if (ac) kkSilMenuYer();
    }
    function kkSilMenuYer() {
      var m = KK.silMenu, p = KK.palet, b = p && p.querySelector('[data-kk="silgi"]');
      if (!m || m.hidden || !b) return;
      var pr = p.getBoundingClientRect(), br = b.getBoundingClientRect(), sr = sahne.getBoundingClientRect();
      var en = m.offsetWidth, boy = m.offsetHeight, x, y;
      if (p.classList.contains('kk-dikey')) {                         /* kenardaki dikey şerit: yanında */
        x = pr.left + pr.width / 2 > sr.left + sr.width / 2 ? pr.left - en - 8 : pr.right + 8;
        y = br.top + br.height / 2 - boy / 2;
      } else {                                                         /* yatay şerit: altında, yer yoksa üstünde */
        x = br.left + br.width / 2 - en / 2; y = pr.bottom + 8;
        if (y + boy > sr.bottom - 6 && pr.top - 8 - boy >= sr.top + 6) y = pr.top - 8 - boy;
      }
      x = Math.max(sr.left + 6, Math.min(sr.right - en - 6, x));
      y = Math.max(sr.top + 6, Math.min(sr.bottom - boy - 6, y));
      m.style.left = Math.round(x - pr.left - p.clientLeft) + 'px';
      m.style.top = Math.round(y - pr.top - p.clientTop) + 'px';
    }
    function kkSilmeSec(s) {
      KK.silme = s === 'y' ? 'y' : 'c';
      kkTercihYaz();
      kkSilMenu(false);
      kkPaletGuncelle();
      kkTost(KK.silme === 'y' ? 'Silgi: dokunduğu yeri siler' : 'Silgi: dokunduğu çizgiyi siler');
    }
    function kkSilMenuGuncelle() {
      var p = KK.palet, m = KK.silMenu;
      if (!p) return;
      p.classList.toggle('kk-silyer', KK.silme === 'y');
      var b = p.querySelector('[data-kk="silgi"]');
      if (b) b.title = (KK.silme === 'y' ? 'Silgi: dokunduğu yeri siler (E)' : 'Silgi: dokunduğu çizgiyi siler (E)') + ' · yine dokun: seçenekler';
      if (m) [].forEach.call(m.querySelectorAll('[data-sm]'), function (x) {
        x.setAttribute('aria-checked', x.getAttribute('data-sm') === KK.silme ? 'true' : 'false');
      });
      if (KK.silMenuAcik && !(KK.acik && KK.arac === 's' && !KK.kucuk)) kkSilMenu(false);
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
      for (var i = L.length - 1; i >= 0; i--) if (L[i].a === 'k' || L[i].a === 'K') return KK_RENK[L[i].r] || KK_RENK[1];
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
    /* (açılışta «en son yazdığın yer» önerisi kalktı — 27.10.2026) */

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
      ceYaziBitir(true); ceIptal(); ceKlavye(false); ceSayiMenu(false);   /* CEVAPLA */
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
        if (KK.silMenuAcik) kkSilMenu(false);                       /* silgi seçenekleri (25.10.2026) */
        else if (KK.liste && !KK.liste.hidden) kkListeKapat();
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
      if (KK.ce && kkGorunen().indexOf(KK.ce.o.s) < 0) ceIptal();
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
      /* açılışta en son yazılan yere yönlendirme yok (27.10.2026) */
    });
    var kkDis = {
      acik: function () { return KK.acik; }, ac: kkAc, kapat: kkKapat,
      kitap: KK_KITAP, hazir: function () { return KK.hazir; }, depo: function () { return KK.depo; },
      cizgiler: function (s, misafir) { return kkCizgiler((misafir ? KK.G : KK.M)[s]).map(function (c) { var o = { a: c.a, r: c.r, w: c.w, p: c.p.slice() }; if (c.b) o.b = c.b.slice();
        ['d', 'x', 'y', 's', 'n', 'm', 'rx', 'ry'].forEach(function (k) { if (c[k] != null) o[k] = c[k]; }); return o; }); },
      cevapla: { arac: function (a) { if (ceAracMi(a)) ceAracTik(a); return KK.arac; }, sayi: function (n) { if (n >= 1 && n <= 10) { KK.ceSayi = n; ceSayiGoster(); } return KK.ceSayi || 1; },
                 klavye: function () { return { acik: !!(CK.el && !CK.el.hidden), dil: CK.dil, rakam: CK.rakam, el: CK.el }; }, yazi: function () { return KK.yazi ? KK.yazi.el : null; },
                 ders: ceDersten },   /* CEVAPLA (29.10.2026) */
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
       indirilmiş kopyada (file://) kapalı — metin.yerel varsa (katman
       dosyaları kitabın yanında, Komisyon 9) açık (01.11.2026). Üreten:
       _kaynak/uretici/metinKatmani.py
       -------------------------------------------------------------- */
    var metinYukselt = null;                           /* 2K zemin: 9. bölüm kurar, zUygula çağırır */
    (function metinKatmani() {
      var V = kok.KITAP_VERI || {}, M = ayar.metin || V.metin;
      /* NET KATMAN YEREL (01.11.2026): katman dosyaları kitabın yanındaysa (metin.yerel, Komisyon 9) bilgisayardan da açık */
      if (!M || !M.kok || (location.protocol === 'file:' && !M.yerel) || !flip.yapraklar) return;
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

    /* --------------------------------------------------------------
       11) AYRAÇ İPİ                                         (27.10.2026)
       Öğretmen: "flipbook motorlarına her sayfada yukardan görünecek bi
       ip olsun oraya basılırsa kitapta sadece orada ip sabit kalacak, her
       sayfada gri bi iz olsun oraya tıklandığında kırmızıya dönüşecek
       eğer başka bi yerde işaretlenmişse orasında kalmayacak en son ki
       yerde işaretlenmiş olacak".
       · Her sayfanın üstünde, dış kenara yakın gri bir iz (.kip). Dokununca
         kırmızı ip o sayfaya iner; kitapta TEK ip var: başka sayfaya
         konunca eskisinden kalkar. Kırmızı ipe yeniden dokununca kalkar.
         Kapaklarda (ilk ve son sayfa) iz yok.
       · İp başka sayfadayken kitabın üst ortasında (cilt) ipin kırmızı
         ucu (.kip-kuyruk) görünür; dokununca ipli sayfa açılır. Kitap
         açılınca ip açık sayfada değilse bir kez «Oraya git» önerisi çıkar.
       · Bu tarayıcıda kitaba göre saklanır: localStorage kitapIp|<kitap>
         (kitap = klasör adı, kalemle aynı). Öbür sekmede değişince burada
         da değişir.
       · TAHTA (kanal 'kitap', t:'ip'): kumandada (lider) konan ip Sınıf
         Ekranı'nda da görünür ve orada da saklanır; anlık durumda (h) da
         gider. İzleyende kabuğun yinelediği tık (isTrusted: false) ipi
         değiştirmez — ip kanaldan gelir.
       · Kalem yazarken iz dokunulmaz (sayfadaki öbür düğmeler gibi;
         kitapzoom.css); imleçte ve parmakla gezerken çalışır.
       -------------------------------------------------------------- */
    var IP = { s: 0, t: 0, kuyruk: null, anahtar: 'kitapIp|' + KK_KITAP };
    function ipSayfaMi(s) { return s > 1 && s < (flip.toplam || 0); }
    function ipOku() {
      var o = null;
      try { o = JSON.parse(localStorage.getItem(IP.anahtar) || 'null'); } catch (e) { o = null; }
      if (o && ipSayfaMi(+o.s)) { IP.s = +o.s; IP.t = +o.t || 0; } else { IP.s = 0; IP.t = 0; }
    }
    function ipYaz() {
      try {
        if (IP.s) localStorage.setItem(IP.anahtar, JSON.stringify({ s: IP.s, t: IP.t }));
        else localStorage.removeItem(IP.anahtar);
      } catch (e) { }
    }
    function ipAd(s) { return kkSayfaAdi(s); }
    /* bütün izler + cildin ucu */
    function ipCiz() {
      if (!flip.kitap) return;
      [].forEach.call(flip.kitap.querySelectorAll('.yuz > .kip'), function (b) {
        var s = +b.getAttribute('data-kip'), sec = s === IP.s;
        if (b.classList.contains('secili') !== sec) b.classList.toggle('secili', sec);
        b.setAttribute('aria-pressed', sec ? 'true' : 'false');
        var t = sec ? 'Kırmızı ip bu sayfada — kaldırmak için dokun' : 'Ayraç ipi: ' + ipAd(s) + ' sayfasına koy';
        if (b.title !== t) { b.title = t; b.setAttribute('aria-label', t); }
      });
      ipKuyruk();
    }
    function ipKuyruk() {
      var k = IP.kuyruk;
      if (!k) return;
      var gizle = !IP.s || kkGorunen().indexOf(IP.s) >= 0;
      if (k.hidden !== gizle) k.hidden = gizle;
      if (IP.s) {
        var t = 'Kırmızı ip: ' + ipAd(IP.s) + ' — oraya git';
        if (k.title !== t) { k.title = t; k.setAttribute('aria-label', t); }
      }
    }
    function ipParlat(s) {
      var b = flip.kitap && flip.kitap.querySelector('.yuz > .kip[data-kip="' + s + '"]');
      if (!b) return;
      b.classList.remove('parla'); void b.offsetWidth; b.classList.add('parla');
      setTimeout(function () { b.classList.remove('parla'); }, 1700);
    }
    /* s: ipin konacağı sayfa (0: kaldır); yolla: kullanıcı yaptı (kanala yaz, tost) */
    function ipKoy(s, yolla) {
      s = ipSayfaMi(+s) ? +s : 0;
      IP.s = s; IP.t = Date.now();
      ipYaz();
      ipCiz();
      if (s && yolla) ipParlat(s);
      if (yolla) {
        ipGonder();
        kkTost(s ? 'Kırmızı ip burada: ' + ipAd(s) : 'İp kaldırıldı');
      }
    }
    function ipGit(s) {
      if (!(s >= 1)) return;
      if (z.o > 1.02 || z.x || z.y) { z.o = 1; z.x = 0; z.y = 0; zUygula(false); }
      if (kkGorunen().indexOf(s) < 0) flip.git(s);
      setTimeout(function () { ipParlat(s); }, 450);
    }
    /* ---------- tahta ---------- */
    function ipGonder() {
      if (!TK || !TK.k || !tkLider()) return;
      try { TK.k.gonder({ t: 'ip', s: IP.s, z: IP.t }); } catch (e) { }
    }
    function ipGelen(m) {
      if (!IP || !m || tkLider()) return;
      var s = ipSayfaMi(+m.s) ? +m.s : 0;
      if (s === IP.s) return;
      IP.s = s; IP.t = +m.z || Date.now();
      ipYaz();
      ipCiz();
    }
    function ipAnlik() { return IP ? { s: IP.s, z: IP.t } : null; }
    /* ---------- dokunuşlar ---------- */
    function ipDur(e) { e.stopPropagation(); }        /* yaprak sürüklenmesin, bölge büyümesin */
    function ipTik(e) {
      var b = e.target && e.target.closest && e.target.closest('.kip, .kip-kuyruk');
      if (!b || !flip.kitap.contains(b)) return;
      e.preventDefault(); e.stopPropagation();
      if (engelli()) return;                            /* izleyende yinelenen tık: ip kanaldan gelir */
      if (b.classList.contains('kip-kuyruk')) { if (IP.s) ipGit(IP.s); return; }
      var s = +b.getAttribute('data-kip');
      ipKoy(IP.s === s ? 0 : s, true);
    }
    function ipKur() {
      if (!flip.kitap) return;
      [].forEach.call(flip.kitap.querySelectorAll('.yuz[data-sayfa]'), function (yuz) {
        var s = +yuz.getAttribute('data-sayfa');
        if (!ipSayfaMi(s) || !yuz.querySelector('.katman') || yuz.querySelector('.kip')) return;
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'kip';
        b.setAttribute('data-kip', String(s));
        b.innerHTML = '<i aria-hidden="true"></i>';
        b.addEventListener('pointerdown', ipDur);
        b.addEventListener('touchstart', ipDur, { passive: true });
        yuz.appendChild(b);
      });
      var k = document.createElement('button');
      k.type = 'button'; k.className = 'kip-kuyruk'; k.hidden = true;
      k.innerHTML = '<i aria-hidden="true"></i>';
      k.addEventListener('pointerdown', ipDur);
      k.addEventListener('touchstart', ipDur, { passive: true });
      flip.kitap.appendChild(k);
      IP.kuyruk = k;
      flip.kitap.addEventListener('click', ipTik);
    }
    /* açılışta: ip açık sayfada değilse bir kez öner */
    function ipAcilisOnerisi() {
      if (!IP.s || izleCihazi() || kkMisafirKip() || document.querySelector('.kk-ipucu')) return;
      if (kkGorunen().indexOf(IP.s) >= 0) { ipParlat(IP.s); return; }
      var s = IP.s, d = document.createElement('div');
      d.className = 'kk-ipucu kip-ipucu';
      d.setAttribute('role', 'status');
      d.innerHTML = svg(IK.ip) + '<span>Kırmızı ip burada: <b>' + kkEsc(ipAd(s)) + '</b></span>' +
        '<button type="button" class="kk-ipgit" data-ip="git">Oraya git</button>' +
        '<button type="button" class="kk-x" data-ip="kapat" aria-label="Kapat">✕</button>';
      sahne.appendChild(d);
      var kapat = function () { if (d.parentNode) d.parentNode.removeChild(d); };
      d.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-ip]');
        if (!b) return;
        e.preventDefault();
        if (b.getAttribute('data-ip') === 'git' && !kkYanki(e)) ipGit(IP.s || s);
        kapat();
      });
      ['pointerdown', 'touchstart'].forEach(function (t) { d.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true }); });
      setTimeout(kapat, 10000);
    }
    ipOku();
    ipKur();
    ipCiz();
    (function () {                                     /* sayfa değişince cildin ucu */
      var onceki = flip.degisti;
      flip.degisti = function () { var r = onceki.apply(this, arguments); ipKuyruk(); return r; };
    })();
    kok.addEventListener('storage', function (e) {     /* öbür sekmede ip değişti */
      if (e.key !== IP.anahtar) return;
      ipOku(); ipCiz();
    });
    setTimeout(ipAcilisOnerisi, 1200);
    var ipDis = {
      sayfa: function () { return IP.s; },
      koy: function (s) { ipKoy(s, true); },
      kaldir: function () { ipKoy(0, true); },
      git: function () { if (IP.s) ipGit(IP.s); },
      anahtar: IP.anahtar
    };

    /* --------------------------------------------------------------
       12) DERS MODU                                         (29.10.2026)
       Öğretmen: "flipbooklara ... ders modu, bu moda basınca dersin adım
       adım istediğimiz gibi işlenmesini sağlayacağız bi nevi sunum modu
       gibi ama başka bi html açmayacağız; flipbook hem dijital kitap hem
       de cevapların ve içeriklerin açıldığı bi dijital öğretmen klavuzu,
       dijital cevap anahtarı olacak".
       · Adımlar kitabın yanındaki ders.js'te (window.KITAP_DERS.sayfa[s] =
         [adım…], s = flip sayfa no); Ders Tezgâhı yazar
         (_kaynak/arac/araclar.html#ders). Dosya yalnız yetkili için yüklenir
         (öğretmen/yönetici, dosyadan açılan kopya, tahta izleyeni); yoksa
         düğme hiç çıkmaz. Girişsizde ve öğrencide düğme gizli.
       · Düğme (#tDers) deneme hakkı: hak.js «ders» kapısı (5 hak, destekçi
         sınırsız, yönetici serbest).
       · Adım türleri: yakin (sayfanın x1..x2 × y1..y2 bandına büyüt),
         kaynak (sayfadaki .nokta[data-k] düğmesine basar), cevap (kutu:
         Arapça/Türkçe), not (yalnız kumandada), ortu (adıma dek örtülü).
       · İleri: → ↓ PageDown Boşluk Enter · sayfaya dokunma · ▶. Geri:
         ← ↑ PageUp Backspace · ◀. Esc kapatır.
       · YALNIZ ADIMLI SAYFADA (29.10.2026) — öğretmen: "sunum modu her sayfada
         olmayacak sadece cevap, etkinlik vs eklenen sayfalarda olacak": düğme
         yalnız adımı olan sayfada (ders açıkken her sayfada, basılı) görünür.
         Ders açıkken adımsız sayfada çubuk gizlenir, ileri/geri tuşu sayfa
         çevirir; adımlı sayfaya gelince çubuk kendiliğinden döner («▶ ile
         başla»; geri gelindiyse son adımda). Son adımdan sonra ileri: yayılımda
         adımı olan öbür sayfa, yoksa sayfa çevrilir. İlk adımdan geri: sayfanın
         ilk hâli (büyütme yok, örtüler kapalı); oradan geri sayfa çevirir.
       · TAHTA (kanal 'kitap', t:'ds'): lider açınca/ilerleyince izleyen
         aynı adımı uygular; büyütme liderin görünümüyle (t:'g') gelir,
         kutular ve örtüler izleyende de çizilir, not izleyende görünmez,
         kaynak düğmesine izleyen kendisi basmaz (kabuk tıkı yineler).
         Sınıf Ekranı'nda çubuğun düğmeleri yok; yerel dokunuş/tuş işlemez.
       · ÖNİZLEME (yalnız file:// kopyada, üst pencereden postMessage):
         dersOnizle {sayfa, adimlar, i} · dersAdim {i} · dersKapat;
         kitap → araç: dersHazir, dersDurum {aktif, sayfa, i, toplam}.
       · İLERİ ADIMLARI OYNATIR (29.10.2026) — öğretmen: "eğer bi sayfa için
         yakınlaştırma cevap vs yapılmışsa ileri tuşu otomatik yapılanları
         oynatsın ... bi yer yakınlaşmışken son adım bittikten sonra ileri tuşu
         sonraki sayfaya geçmesin, sayfayı küçültsün ... sağdan sola ... sol tuş
         ileri sağ tuşu geri olsun". Ders kapalıyken adımlı sayfada ileri (tuş,
         sayfa oku, kaydırma: flip.ileri) dersi açar, ilk adımı oynatır (sitede
         hak.js «ders» kapısı aynen: kullan / hak yoksa sayfa çevirir). Son
         adımdan sonra büyükse ileri önce küçültür (i = adım sayısı, «Sayfa
         bitti»: her şey açık), sonra çevirir. Elle kapatılan (✕ / Esc / Ders)
         görünümde ileri sayfa çevirir. Sağdan sola kitapta (rtl) ← / PageDown
         / Boşluk ileri, → / PageUp geri; çubukta ileri düğmesi solda (◀).
       · CEVAP SAYFAYA YAZILIR (29.10.2026) — "kitabın üstüne yazılmış gibi
         olmalı bi kutu içine değil ... çok fazla büyük bi kutu açılmasın ve
         kutunun açılacağı yer cümlelere yakın açılsın". Cevap kutusuz,
         mürekkep renginde (kalem gibi multiply), sağdan sola yazılarak
         belirir. Yeri Ders Tezgâhı'nda çizilir: kx1, ky1, kx2, ky2 (sayfa
         yüzdesi), yazı o alana sığdırılır. Cevap ekrandaysa büyütme değişmez,
         değilse yalnız onu (üstündeki cümleyle) gösterecek kadar büyütülür.
         Eski kayıtta cevaba çizilmiş küçük dikdörtgen bant (x'li, en çok %10)
         cevabın yeri sayılır; öbür eski kayıt bandın altında. Yazısız cevap
         sayfaya bir şey yazmaz.
       · İŞARETLER TEK TEK (29.10.2026) — öğretmen: "her bir çarpı veya diğer
         işaretler tıklama ile adım adım açılsın". Cevap adımındaki hazır
         işaretler (isaret, konduğu sırayla) her ileride bir tane belirir; ok ve
         daire baştan sona çizilerek. Yazılı cevapta önce yazı gelir; yazısız
         cevapta ilk işaret adımla birlikte. Büyütme adıma gelince bir kez (yazı
         + bütün işaretler sığacak kadar) yapılır, işaret açılırken değişmez.
         Geri son açılan işareti kapatır; önceki adıma dönülünce onun bütün
         işaretleri açık gelir. Alt adım DS.m = açık işaret sayısı: tahtaya
         {t:'ds', s, i, m} (m'siz eski lider: hepsi açık); önizlemeye
         dersOnizle / dersAdim {…, m} (m yoksa adımın ilk hâli); kitap → araç
         dersDurum {…, m, isaret}. Çubukta adın yanında açılan/kalan noktalar.
       · SAYFA ŞERİDİ (30.10.2026) — öğretmen: "zaman çizgisi, tüm notlar işaretler,
         yakınlaştırma gibi şeylerde geçerli olsun ... flipbookta bu time line
         görünmeyecek sadece tezgahta olacak üretim için". Adımlarda zm (sn) ve
         isaret[].zm: Ders Tezgâhı'nın sayfa şeridi yazar; sıra zamana göredir.
         Yeni adımlar: md {j, dosya} (16. bölümün sesi / videosu çalar), dk {j}
         (15. bölümün alanı adımla açılır, geri gelince kapanır), bg {j} (13.
         bölümün bağlantısı parlar).
       · YALNIZ İLERİ (31.10.2026) — öğretmen: "ders modunda ses ve etkinlik svg
         leri görünmesin sadece ileri tuşu olacak, yani ses otomotik çalacak
         sonraki adımlar insan tarafından belirlenecek". Kendiliğinden oynatma
         yok; adımlı sayfada sayfadaki .nokta düğmeleri gizli (html.ds-ders);
         ses adımı gelince ses çalar (hızla geçilen adımın sesi çalmaz, geri
         gelince susar); dinleme etkinliğinde ileri / geri konum konum.
       -------------------------------------------------------------- */
    var DS = { v: null, aktif: false, s: 0, i: -1, m: 0, tus: null, bar: null, onizleme: false, yuk: 0, bekleyen: null, sonTik: 0,
               hazir: false, onizSon: '', yon: null, yerel: location.protocol === 'file:', cevir: false, otoKapali: null, otoBekle: false };
    var DS_TUR = { yakin: 1, kaynak: 1, cevap: 1, not: 1, ortu: 1, md: 1, dk: 1, bg: 1 };   /* md dk bg: SAYFA ŞERİDİ (30.10.2026) */
    function dsAktif() { return DS.aktif; }
    function dsSinif(acik) {                                     /* DERS MODU SADE (18. bölüm): yan menü gizlenince / gelince kitap yeniden ölçeklenir */
      acik = !!acik; var g = document.documentElement.classList.contains('ds-acik') !== acik ? dsSadeOnce() : null;
      sahne.classList.toggle('ds-acik', acik); document.documentElement.classList.toggle('ds-acik', acik);
      if (g) dsSadeSonra(acik, g);
    }
    function dsVeri() {
      if (DS.v) return DS.v;
      var v = kok.KITAP_DERS;
      if (v && typeof v === 'object' && v.sayfa && typeof v.sayfa === 'object') DS.v = v;
      return DS.v;
    }
    function dsGecerli(a) { return !!(a && typeof a === 'object' && DS_TUR[a.t]); }
    function dsAdimlar(s) {
      if (!(+s >= 1)) return [];                                 /* 0: ekranda adımlı sayfa yok */
      var v = dsVeri(), L = v && v.sayfa[String(s)];
      return Array.isArray(L) ? L.filter(dsGecerli) : [];
    }
    function dsGorunenAdimli() {                               /* ekrandaki adımı olan sayfalar, okuma sırasıyla */
      return kkGorunen().filter(function (p) { return dsAdimlar(p).length > 0; }).sort(function (a, b) { return a - b; });
    }
    function dsKitapSonu() { return flip.tekli ? (flip.aktif || 1) >= (flip.toplam || 1) : !flip._ilerisiVar(); }
    function dsKitapBasi() { return flip.tekli ? (flip.aktif || 1) <= 1 : flip.c <= 0; }
    function dsSayfalar() {
      var v = dsVeri(); if (!v) return [];
      return Object.keys(v.sayfa).map(function (k) { return +k; })
        .filter(function (s) { return s >= 1 && dsAdimlar(s).length; }).sort(function (a, b) { return a - b; });
    }
    /* kimde: öğretmen / yönetici (hak.js durumu); dosyadan açılan kopya (indirme yalnız destekçiye) */
    function dsYetki() {
      if (DS.onizleme || DS.yerel) return true;
      if (document.documentElement.classList.contains('ik-girissiz')) return false;
      try {
        var H = kok.KidefHak, d = H && H.durum ? H.durum() : null;
        return !!(d && (d.rol === 'teacher' || d.rol === 'admin'));
      } catch (e) { return false; }
    }
    function dsIzleyen() { return !!(TK && TK.k && TK.canli && tkIzleyen()); }   /* Sınıf Ekranı */
    /* ders.js kitabın yanından (günlük damga); bir kez */
    function dsYukle() {
      if (DS.yuk) return;
      DS.yuk = 1;
      if (kok.KITAP_DERS) { dsYuklendi(); return; }
      try {
        var d = new Date(), t = '' + d.getFullYear() + (d.getMonth() + 1) + d.getDate();
        var s = document.createElement('script');
        s.src = new URL('ders.js' + (DS.yerel ? '?t=' + Date.now() : '?t=' + t), location.href).href;   /* file://: hep taze (14. bölüm) */
        s.async = true;
        s.onload = dsYuklendi;
        s.onerror = function () { DS.yuk = 2; dsHazirBildir(); };
        (document.head || document.documentElement).appendChild(s);
      } catch (e) { DS.yuk = 2; }
    }
    function dsYuklendi() {
      DS.yuk = 2;
      dsTusGuncelle(); dsHazirBildir(); icDersIsaret();
      if (DS.bekleyen) { var m = DS.bekleyen; DS.bekleyen = null; dsGelen(m); }
    }
    function dsTusKur() {
      if (document.getElementById('tDers')) return;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tus etiketli ds-tus'; b.id = 'tDers';
      b.setAttribute('data-kz', 'ders');
      b.title = 'Ders modu: dersi adım adım işle';
      b.setAttribute('aria-label', 'Ders modu');
      b.setAttribute('aria-pressed', 'false');
      b.hidden = true;
      b.innerHTML = svg(IK.ders) + '<span>Ders</span>';
      b.addEventListener('click', function (e) {
        if (kkYanki(e) || dsIzleyen()) return;                  /* Sınıf Ekranı: kanaldan gelir */
        try { b.blur(); sahne.focus(); } catch (x) { }
        if (DS.aktif) dsKapat(true); else dsAc(0, 0, true);
      });
      var kalem = document.getElementById('tKalem');
      if (kalem && kalem.parentNode) kalem.parentNode.insertBefore(b, kalem.nextSibling);
      else {
        var ar = document.querySelector('.ust .araclar');
        if (ar) ar.appendChild(b); else document.body.appendChild(b);
      }
      DS.tus = b;
    }
    function dsTusGuncelle() {
      var y = dsYetki();
      if (y && !DS.yuk) dsYukle();
      var b = DS.tus; if (!b) return;
      var once = b.hidden;
      b.hidden = !(y && dsVeri() && (DS.aktif || dsGorunenAdimli().length));   /* yalnız adımı olan sayfada (ders açıkken her sayfada) */
      if (once && !b.hidden && !DS.aktif) { b.classList.remove('ds-belir'); void b.offsetWidth; b.classList.add('ds-belir'); }
      b.setAttribute('aria-pressed', DS.aktif ? 'true' : 'false');
      b.classList.toggle('aktif', DS.aktif);
    }
    /* ---------- sayfa geometrisi ---------- */
    function dsSayfaKutu(s) {                                    /* sayfanın zoom'suz dikdörtgeni (sahneye göre) */
      if (flip.tekli) return tekSayfa1x();
      var k = kitap1x(), en = k.en / 2;
      var sag = ekranSayfa(true) === s;
      return { x: k.x + (sag ? en : 0), y: k.y, en: en, boy: k.boy, w: k.w, h: k.h };
    }
    function dsYuzde(v, d) { v = +v; return isFinite(v) ? Math.max(0, Math.min(100, v)) : d; }
    function dsBantVar(a) { return !!(a && a.y1 != null && a.y2 != null && +a.y2 > +a.y1); }
    function dsYakinlas(s, a) {
      if (!dsBantVar(a)) { if (z.o > 1.02 || z.x || z.y) { z.o = 1; z.x = 0; z.y = 0; sinirla(); zUygula(true); } return; }
      var g = dsSayfaKutu(s);
      if (!(g.en > 0 && g.boy > 0 && g.w > 0 && g.h > 0)) return;
      var x1 = dsYuzde(a.x1, 0), x2 = Math.max(x1 + 1, dsYuzde(a.x2, 100));
      var y1 = dsYuzde(a.y1, 0), y2 = Math.max(y1 + 1, dsYuzde(a.y2, 100));
      var bx = g.x + g.en * x1 / 100, bw = g.en * (x2 - x1) / 100;
      var by = g.y + g.boy * y1 / 100, bh = g.boy * (y2 - y1) / 100;
      var o = Math.max(ENAZ, Math.min(ENCOK, Math.min(g.w / bw, g.h / bh) * 0.94));
      var cx = bx + bw / 2 - g.w / 2, cy = by + bh / 2 - g.h / 2;
      z.o = o; z.x = -cx * o; z.y = -cy * o;
      sinirla(); zUygula(true);
    }
    /* ---------- katmanlar: örtü, cevap ---------- */
    function dsTemizle() {
      [].forEach.call(document.querySelectorAll('.ds-ortu, .ds-cevap, .ds-isaret'), function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
    }
    function dsKonum(el, a) {
      var x1 = dsYuzde(a.x1, 0), x2 = dsYuzde(a.x2, 100), y1 = dsYuzde(a.y1, 0), y2 = dsYuzde(a.y2, 100);
      el.style.left = x1 + '%'; el.style.width = Math.max(1, x2 - x1) + '%';
      el.style.top = y1 + '%'; el.style.height = Math.max(1, y2 - y1) + '%';
    }
    function dsOrtuleriKur(s, L) {
      var y = kkYuz(s); if (!y) return;
      L.forEach(function (a, j) {
        if (a.t !== 'ortu') return;
        var o = document.createElement('div');
        o.className = 'ds-ortu'; o.setAttribute('data-ds', String(j)); o.setAttribute('aria-hidden', 'true');
        dsKonum(o, a);
        o.innerHTML = '<i></i>';
        y.appendChild(o);
      });
    }
    function dsYaziBoyu(y) { return Math.max(9, Math.round(y.offsetWidth * 0.022)) + 'px'; }
    /* cevabın yazılacağı yer (Ders Tezgâhı'nda çizilir; sayfa yüzdesi) — yoksa null (eski kayıt) */
    function dsCevapYeri(a) {
      if (!a) return null;
      if (a.kx1 != null && a.ky1 != null && a.kx2 != null && a.ky2 != null) {
        var x1 = dsYuzde(a.kx1, 0), x2 = dsYuzde(a.kx2, 100), y1 = dsYuzde(a.ky1, 0), y2 = dsYuzde(a.ky2, 100);
        return (x2 > x1 + 0.5 && y2 > y1 + 0.3) ? { x1: x1, x2: x2, y1: y1, y2: y2 } : null;
      }
      /* eski kayıt: cevaba elle çizilmiş küçük dikdörtgen bant (x'li, en çok %10 yüksek, y yok) cevabın yeri sayılır */
      if (a.y == null && a.x1 != null && a.x2 != null && dsBantVar(a)) {
        var bx1 = dsYuzde(a.x1, 0), bx2 = dsYuzde(a.x2, 100), by1 = dsYuzde(a.y1, 0), by2 = dsYuzde(a.y2, 100);
        if (by2 - by1 <= 10 && bx2 - bx1 < 99 && bx2 > bx1 + 0.5) return { x1: bx1, x2: bx2, y1: by1, y2: by2, bandan: true };
      }
      return null;
    }
    function dsCevapKur(s, a, j) {
      var y = kkYuz(s); if (!y || y.querySelector('.ds-cevap[data-ds="' + j + '"]')) return;
      var k = document.createElement('div'), yer = dsCevapYeri(a);
      k.className = 'ds-cevap' + (yer ? ' ds-yerli' : '') + (a.ar ? ' ds-arli' : ''); k.setAttribute('data-ds', String(j));
      if (yer) {                                                /* öğretmenin çizdiği yer: yazı oraya sığar */
        k.style.left = yer.x1 + '%'; k.style.width = (yer.x2 - yer.x1) + '%';
        k.style.top = yer.y1 + '%'; k.style.height = (yer.y2 - yer.y1) + '%';
      } else {                                                  /* eski kayıt: bandın altında, bandın genişliğinde */
        var x1 = dsYuzde(a.x1, 0), x2 = dsYuzde(a.x2, 100);
        var ust = a.y != null ? dsYuzde(a.y, 0) : (a.y2 != null ? dsYuzde(a.y2, 0) : 0);
        k.style.left = x1 + '%'; k.style.width = Math.max(8, x2 - x1) + '%'; k.style.top = ust + '%';
      }
      var h = '';
      if (a.ar) h += '<div class="ds-ar" dir="rtl" lang="ar">' + kkEsc(a.ar).replace(/\n/g, '<br>') + '</div>';
      if (a.tr) h += '<div class="ds-tr">' + kkEsc(a.tr).replace(/\n/g, '<br>') + '</div>';
      if (!h) return;                                           /* yazısız cevap: sayfaya bir şey yazılmaz */
      k.innerHTML = '<div class="ds-yazi">' + h + '</div>';
      ['pointerdown', 'touchstart'].forEach(function (t) { k.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true }); });
      k.addEventListener('click', function (e) { e.stopPropagation(); });
      y.appendChild(k);
      dsCevapOlc(k, y);
    }
    /* yazı boyu sayfaya göre; yeri çizilmişse o alana sığdırılır (en çok 1.6 kat büyür) */
    function dsCevapOlc(k, y) {
      var W = y.offsetWidth || 0; if (!W) return;
      var taban = Math.max(9, W * 0.022);
      k.style.fontSize = taban + 'px';
      if (!k.classList.contains('ds-yerli')) return;
      var ic = k.querySelector('.ds-yazi'), kw = k.clientWidth, kh = k.clientHeight;
      if (!ic || !kw || !kh || !ic.offsetWidth || !ic.offsetHeight) return;
      var o = Math.min(kw / ic.offsetWidth, kh / ic.offsetHeight, 1.6) * 0.96;
      k.style.fontSize = Math.max(6, taban * o) + 'px';
    }
    /* adıma göre katman durumu: j<=i açık, j>i kapalı; i. adımın işaretlerinden ilk m tanesi açık (m yoksa hepsi) */
    function dsKatmanlar(s, L, i, m) {
      var y = kkYuz(s); if (!y) return;
      var dkDeg = false;                                          /* SAYFA ŞERİDİ: dokunma adımları */
      L.forEach(function (a, j) {
        if (a.t === 'dk') { if (dsDokunDurum(s, +a.j, j <= i)) dkDeg = true; return; }
        if (a.t === 'ortu') {
          var o = y.querySelector('.ds-ortu[data-ds="' + j + '"]');
          if (o) o.classList.toggle('acik', j <= i);
        } else if (a.t === 'cevap') {
          var k = y.querySelector('.ds-cevap[data-ds="' + j + '"]'), im = y.querySelector('.ds-isaret[data-ds="' + j + '"]');
          if (j <= i) { if (!k) dsCevapKur(s, a, j); if (!im) dsIsaretKur(s, a, j); dsIsaretGoster(s, j, (j < i || m == null) ? Infinity : m); }
          else { if (k && k.parentNode) k.parentNode.removeChild(k); if (im && im.parentNode) im.parentNode.removeChild(im); }
        }
      });
      if (dkDeg) dkGoster(s);
    }
    /* ---------- çubuk ---------- */
    var DS_GERI = '<path d="M15 5l-7 7 7 7"/>', DS_ILERI = '<path d="M9 5l7 7-7 7"/>';
    function dsBarKur() {
      if (DS.bar) return;
      var b = document.createElement('div');
      b.className = 'ds-bar' + (rtl ? ' ds-rtl' : ''); b.setAttribute('role', 'toolbar'); b.setAttribute('aria-label', 'Ders modu');
      b.innerHTML =
        '<button type="button" class="ds-geri" data-ds="geri" title="Önceki adım (' + (rtl ? '→' : '←') + ')" aria-label="Önceki adım">' + svg(rtl ? DS_ILERI : DS_GERI) + '</button>' +
        '<div class="ds-orta"><span class="ds-ust"><span class="ds-sayfa"></span><span class="ds-say"></span></span><span class="ds-ad"></span>' +
        '<div class="ds-not" hidden></div></div>' +
        '<button type="button" class="ds-ileri" data-ds="ileri" title="Sonraki adım (' + (rtl ? '←' : '→') + ')" aria-label="Sonraki adım">' + svg(rtl ? DS_GERI : DS_ILERI) + '</button>' +
        '<button type="button" class="ds-x" data-ds="kapat" title="Ders modunu kapat (Esc)" aria-label="Ders modunu kapat">✕</button>';
      b.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('[data-ds]');
        if (!t) return;
        e.preventDefault(); e.stopPropagation();
        if (kkYanki(e) || dsIzleyen()) return;
        try { t.blur(); sahne.focus(); } catch (x) { }
        var k = t.getAttribute('data-ds');
        if (k === 'ileri') dsIleri(); else if (k === 'geri') dsGeri(); else if (k === 'kapat') dsKapat(true);
      });
      ['pointerdown', 'touchstart'].forEach(function (t) { b.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true }); });
      sahne.appendChild(b);
      DS.bar = b;
    }
    function dsTurAdi(a) {
      return { yakin: 'Yakınlaş', kaynak: 'Kaynağı aç', cevap: 'Cevap', not: 'Not', ortu: 'Cevabı aç', md: 'Ses / video', dk: 'Dokunma', bg: 'Bağlantı' }[a.t] || 'Adım';
    }
    function dsBarYaz() {
      var b = DS.bar; if (!b) return;
      var L = dsAdimlar(DS.s), bitti = L.length > 0 && DS.i >= L.length, a = (DS.i >= 0 && !bitti) ? L[DS.i] : null, izle = dsIzleyen();
      b.hidden = !L.length;                                      /* adımsız sayfada çubuk yok */
      dsSinif(DS.aktif && L.length > 0);
      b.classList.toggle('ds-izle', izle);
      b.querySelector('.ds-sayfa').textContent = kkSayfaAdi(DS.s);
      b.querySelector('.ds-say').textContent = L.length ? (bitti ? '✓ ' + L.length + '/' + L.length : (Math.max(0, DS.i + 1) + '/' + L.length)) : '0/0';
      var ad = b.querySelector('.ds-ad'), ni = a ? dsIsaretSay(a) : 0;
      ad.textContent = bitti ? 'Sayfa bitti' : (a ? (a.ad || dsTurAdi(a)) : (L.length ? (rtl ? '◀' : '▶') + ' ile başla' : 'Bu sayfada adım yok'));
      if (ni) {                                                 /* İŞARETLER TEK TEK: açılan (dolu) / sıradaki (boş) işaretler */
        var nk = document.createElement('span'); nk.className = 'ds-im'; nk.title = DS.m + '/' + ni + ' işaret';
        for (var q = 0; q < ni; q++) { var o = document.createElement('i'); if (q < DS.m) o.className = 'acik'; nk.appendChild(o); }
        ad.appendChild(nk);
      }
      var n = b.querySelector('.ds-not'), notVar = !!(a && a.t === 'not' && a.metin && !izle);
      n.hidden = !notVar; n.textContent = notVar ? a.metin : '';
      var G = dsGorunenAdimli();
      b.querySelector('.ds-geri').disabled = DS.i < 0 && !G.some(function (x) { return x < DS.s; }) && dsKitapBasi();
      b.querySelector('.ds-ileri').disabled = (DS.i >= L.length || (DS.i === L.length - 1 && !dsBuyuk() && !(DS.m < ni))) && !G.some(function (x) { return x > DS.s; }) && dsKitapSonu();
      dsSimge();                                                  /* YALNIZ İLERİ: sayfadaki düğmeler gizli */
    }
    function dsOncekiSayfa() { var P = dsSayfalar(); for (var i = P.length - 1; i >= 0; i--) if (P[i] < DS.s) return P[i]; return 0; }
    function dsSonrakiSayfa() { var P = dsSayfalar(); for (var i = 0; i < P.length; i++) if (P[i] > DS.s) return P[i]; return 0; }
    /* ---------- aç / kapat / gez ---------- */
    function dsAc(s, i, yolla, m) {
      if (DS.aktif) return;
      if (!dsSayfalar().length) return;
      if (!(s >= 1) || dsAdimlar(s).length === 0) { var G = dsGorunenAdimli(); s = G.length ? G[0] : 0; }   /* ekrandaki adımlı sayfa */
      DS.aktif = true;
      dsBarKur();
      dsSayfaKur(s, s ? (i == null ? 0 : i) : -1, yolla, m);
      dsTusGuncelle();
      if (yolla) kkTost(s ? 'Ders modu açık — kenardaki oklarla (' + (rtl ? '←' : '→') + ') ya da sayfaya dokunarak ilerle; Esc kapatır' : 'Ders modu açık — adımı olan sayfaya gelince çubuk çıkar');   /* DERS MODU SADE: çubukta ok yok */
    }
    function dsKapat(yolla) {
      if (!DS.aktif) return;
      DS.aktif = false;
      dsTemizle();
      dsSinif(false);
      if (DS.bar && DS.bar.parentNode) DS.bar.parentNode.removeChild(DS.bar);
      dsDokunSifirla(DS.s); dsSimge();                            /* adımla açılan alanlar kapanır, düğmeler görünür */
      DS.bar = null; DS.i = -1; DS.m = 0;
      dsTusGuncelle();
      if (!dsIzleyen() && (z.o > 1.02 || z.x || z.y)) { z.o = 1; z.x = 0; z.y = 0; sinirla(); zUygula(true); }
      if (yolla) { DS.otoKapali = kkGorunen().join(','); dsGonder(); kkTost('Ders modu kapandı'); }   /* bu görünümde ileri yine sayfa çevirir */
      dsDurumBildir();
    }
    function dsSayfaKur(s, i, yolla, m) {
      dsTemizle();
      DS.s = s; DS.i = -1; DS.m = 0;
      if (s >= 1 && kkGorunen().indexOf(s) < 0 && !dsIzleyen()) flip.git(s);   /* izleyende sayfa liderin görünümüyle (t:'g') gelir */
      var L = dsAdimlar(s);
      dsOrtuleriKur(s, L);
      if (i >= 0 && L.length) dsAdimaGit(i, yolla, m);
      else { dsKatmanlar(s, L, -1); dsBarYaz(); if (yolla) dsGonder(); dsDurumBildir(); }
    }
    function dsAdimaGit(i, yolla, m) {
      var L = dsAdimlar(DS.s); if (!L.length) { dsBarYaz(); return; }
      i = Math.max(-1, Math.min(L.length, i | 0));
      DS.i = i;
      DS.m = (i >= 0 && i < L.length) ? dsIsaretSinir(L[i], m) : 0;   /* İŞARETLER TEK TEK: açık işaret (m yoksa adımın ilk hâli) */
      if (i >= L.length) {                                      /* SAYFA BİTTİ: her şey açık, büyütme yok; sonraki ileri çevirir */
        dsKatmanlar(DS.s, L, L.length - 1);
        if (!dsIzleyen()) dsYakinlas(DS.s, null);
        dsBarYaz(); if (yolla) dsGonder(); dsDurumBildir();
        return;
      }
      dsKatmanlar(DS.s, L, i, DS.m);
      if (!dsIzleyen()) dsMedyaGeri(DS.s, L, i);                  /* SAYFA ŞERİDİ: geri gelince sonraki sesler durur */
      if (i < 0) {                                              /* sayfanın ilk hâli: büyütme yok, örtüler kapalı */
        if (!dsIzleyen()) dsYakinlas(DS.s, null);
        dsBarYaz(); if (yolla) dsGonder(); dsDurumBildir();
        return;
      }
      var a = L[i];
      if (!dsIzleyen()) {
        if (a.t === 'cevap') { var ub = dsCevapBandi(DS.s, a, i); if (ub) dsYakinlas(DS.s, ub); }
        else if (a.t === 'yakin' || dsBantVar(a)) dsYakinlas(DS.s, a);
        if (a.t === 'kaynak' && a.k != null) dsKaynakAc(DS.s, +a.k);
        if (a.t === 'md') dsMedyaAc(DS.s, a);                      /* SAYFA ŞERİDİ */
        if (a.t === 'bg') dsBagParlat(DS.s, a);
      }
      dsBarYaz();
      if (yolla) dsGonder();
      dsDurumBildir();
    }
    /* cevap adımı: yeri çizilmişse — ekrandaysa büyütme değişmez, değilse cevap (üstündeki cümleyle) görünecek kadar;
       bandı da varsa bant + yer. Eski kayıt: bant + kutunun kendisi birlikte sığsın (kutu bandın altında) */
    function dsYerGorunur(s, b) {
      var y = kkYuz(s); if (!y) return false;
      var r = y.getBoundingClientRect(), v = sahne.getBoundingClientRect();
      if (!r.width || !v.width) return false;
      var L = r.left + r.width * b.x1 / 100, R = r.left + r.width * b.x2 / 100, T = r.top + r.height * b.y1 / 100, B = r.top + r.height * b.y2 / 100;
      return L >= v.left - 2 && R <= v.right + 2 && T >= v.top - 2 && B <= v.bottom - 70;   /* alttaki çubuğun payı */
    }
    /* CEVAPLA (29.10.2026): cevap adımındaki hazır işaretler (✓ ✗ ◯ rakam ok yazı) — kalemle aynı çizim */
    function dsIsaretKur(s, a, j) {
      var y = kkYuz(s);
      if (!y || !Array.isArray(a.isaret) || !a.isaret.length || y.querySelector('.ds-isaret[data-ds="' + j + '"]')) return;
      var v = document.createElementNS(KK_NS, 'svg');
      v.setAttribute('class', 'ds-isaret'); v.setAttribute('data-ds', String(j));
      v.setAttribute('viewBox', '0 0 ' + KK_EN + ' ' + KK_BOY); v.setAttribute('preserveAspectRatio', 'none');
      v.setAttribute('aria-hidden', 'true'); v.setAttribute('focusable', 'false');
      dsIsaretler(a).forEach(function (m, k) {                     /* İŞARETLER TEK TEK: hepsi kapalı kurulur, sırası data-m */
        var c = ceDersten(m); if (!c) return;
        var g = ceG(c);
        g.setAttribute('class', 'kk-ce ds-kapali' + (c.a === 'O' || (c.a === 'T' && c.d === 'c') ? ' ds-ciz' : ''));
        g.setAttribute('data-m', String(k));
        v.appendChild(g);
      });
      if (v.firstChild) y.appendChild(v);
    }
    /* İŞARETLER TEK TEK (29.10.2026): adımın geçerli işaretleri konduğu sırayla; her ileride bir tane */
    function dsIsaretler(a) {
      if (!a || a.t !== 'cevap' || !Array.isArray(a.isaret)) return [];
      return a.isaret.filter(function (m) { return !!ceDersten(m); });
    }
    function dsIsaretSay(a) { return dsIsaretler(a).length; }
    function dsIsaretIlk(a) { return dsIsaretSay(a) && !(a.ar || a.tr) ? 1 : 0; }   /* adıma gelince: yazı varsa önce yazı */
    function dsIsaretSinir(a, m) {                                  /* m yok → adımın ilk hâli; sayı → [ilk, hepsi] */
      var n = dsIsaretSay(a), ilk = dsIsaretIlk(a);
      if (!n) return 0;
      if (m == null || m === '' || isNaN(+m)) return ilk;
      return Math.max(ilk, Math.min(n, Math.floor(+m)));
    }
    function dsIsaretGoster(s, j, m) {                              /* ilk m işaret açık; yeni açılan belirir (ok, daire çizilir) */
      var y = kkYuz(s), v = y && y.querySelector('.ds-isaret[data-ds="' + j + '"]');
      if (!v) return;
      [].forEach.call(v.querySelectorAll('g.kk-ce'), function (g) {
        var kapat = +g.getAttribute('data-m') >= m, kapali = g.classList.contains('ds-kapali');
        if (kapat === kapali) return;
        g.classList.toggle('ds-kapali', kapat);
        if (!kapat) dsIsaretCiz(g);
      });
    }
    function dsAzHareket() { try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; } }
    function dsIsaretCiz(g) {                                       /* ok ve daire baştan sona çizilir (Web Animations; yoksa hemen görünür) */
      if (!g.classList.contains('ds-ciz') || dsAzHareket()) return;
      try {
        var yol = g.querySelector('path:not(.kk-kd), ellipse'), uc = g.querySelector('.kk-kd'), nk = g.querySelector('circle');
        if (!yol || typeof yol.animate !== 'function' || typeof yol.getTotalLength !== 'function') return;
        var L = yol.getTotalLength(); if (!(L > 2)) return;
        var d = Math.round(Math.max(320, Math.min(900, L * 0.9))), dz = L + ' ' + (L + 8);
        yol.animate([{ strokeDasharray: dz, strokeDashoffset: L }, { strokeDasharray: dz, strokeDashoffset: 0 }], { duration: d, easing: 'cubic-bezier(.45, 0, .25, 1)' });
        if (nk) nk.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' });
        if (uc) uc.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: Math.max(0, d - 80), fill: 'backwards', easing: 'ease-out' });
      } catch (e) { }
    }
    function dsIsaretAdim(m, yolla) {                               /* yalnız işaret açılır / kapanır; büyütme değişmez */
      var L = dsAdimlar(DS.s), a = DS.i >= 0 ? L[DS.i] : null; if (!a) return;
      DS.m = dsIsaretSinir(a, m);
      dsKatmanlar(DS.s, L, DS.i, DS.m);
      dsBarYaz(); if (yolla) dsGonder(); dsDurumBildir();
    }
    function dsIsaretKutu(a) {                                     /* işaretlerin kapladığı yer (sayfa yüzdesi) */
      if (!a || !Array.isArray(a.isaret) || !a.isaret.length) return null;
      var x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
      a.isaret.forEach(function (m) {
        var c = ceDersten(m); if (!c || !c.p) return;
        var e = c.a === 'O' ? 14 : 4;
        for (var i = 0; i + 1 < c.p.length; i += 2) { x1 = Math.min(x1, c.p[i] - e); x2 = Math.max(x2, c.p[i] + e); y1 = Math.min(y1, c.p[i + 1] - e); y2 = Math.max(y2, c.p[i + 1] + e); }
      });
      if (!(x2 > x1)) return null;
      return { x1: Math.max(0, x1 / KK_EN * 100), x2: Math.min(100, x2 / KK_EN * 100), y1: Math.max(0, y1 / KK_BOY * 100), y2: Math.min(100, y2 / KK_BOY * 100) };
    }
    function dsCevapBandi(s, a, j) {
      var yer = dsCevapYeri(a), ik = dsIsaretKutu(a);
      if (ik) yer = yer ? { x1: Math.min(yer.x1, ik.x1), x2: Math.max(yer.x2, ik.x2), y1: Math.min(yer.y1, ik.y1), y2: Math.max(yer.y2, ik.y2), bandan: yer.bandan }
                        : { x1: ik.x1, x2: ik.x2, y1: ik.y1, y2: ik.y2 };
      if (yer) {
        if (dsBantVar(a) && !yer.bandan) return { x1: Math.min(dsYuzde(a.x1, 0), yer.x1), x2: Math.max(dsYuzde(a.x2, 100), yer.x2),
                                   y1: Math.min(dsYuzde(a.y1, 0), yer.y1), y2: Math.max(dsYuzde(a.y2, 100), yer.y2) };
        if (dsYerGorunur(s, yer)) return null;
        return { x1: 0, x2: 100, y1: Math.max(0, yer.y1 - 12), y2: Math.min(100, yer.y2 + 6) };
      }
      if (!dsBantVar(a)) return null;
      var y = kkYuz(s), k = y && y.querySelector('.ds-cevap[data-ds="' + j + '"]');
      var b = { x1: dsYuzde(a.x1, 0), x2: dsYuzde(a.x2, 100), y1: dsYuzde(a.y1, 0), y2: dsYuzde(a.y2, 100) };
      if (k && y.offsetHeight) {
        var ku = parseFloat(k.style.top) || 0, kb = k.offsetHeight / y.offsetHeight * 100;
        var kx1 = parseFloat(k.style.left) || 0, kx2 = kx1 + (parseFloat(k.style.width) || 100);
        b.y1 = Math.min(b.y1, ku); b.y2 = Math.max(b.y2, Math.min(100, ku + kb + 1));
        b.x1 = Math.min(b.x1, kx1); b.x2 = Math.max(b.x2, Math.min(100, kx2));
      }
      return b;
    }
    /* ---------- DERS SAYFASI — YALNIZ İLERİ (31.10.2026) ----------
       Sıra Ders Tezgâhı'nın sayfa şeridinde kurulur (adımlarda zm vardır; kitapta yalnız sıra önemlidir). Öğretmen:
       "ders modunda ses ve etkinlik svg leri görünmesin sadece ileri tuşu olacak, yani ses otomotik çalacak sonraki
       adımlar insan tarafından belirlenecek". Bu yüzden:
       · Kendiliğinden ilerleme yok: her adıma öğretmen ileri ile geçer (geri ile döner).
       · Ders modunda adımlı sayfa açıkken sayfadaki ses / video / etkinlik düğmeleri (.nokta, eklenen sesler de) gizli;
         ders kapanınca ya da adımsız sayfada yine görünür. Gizli düğme adımla yine açılır (kaynak adımı).
       · Ses adımı (kaynak ya da md) gelince ses kendiliğinden çalar; o adım hızla geçildiyse çalmaz; geri gelince
         sonraki adımların sesi susar.
       · Dinleme etkinliğinde (sesin konumları, 17. bölüm) ses o adımda çalarken ileri sıradaki konumu, geri öncekini
         çalar; konumlar bitince ileri sonraki adıma geçer.
       · Yeni adımlar: md {j, dosya} (eklenen ses / video çalar), dk {j} (dokunma alanı adımla açılır, geri gelince
         kapanır), bg {j} (bağlantı parlar). */
    var DS_SES = 0, DS_ZSA = null;                                   /* tek bekleyen ses zamanlayıcısı · bu ziyarette sesi başlamış md adımı */
    function dsSimge() {
      if (!DS.aktif) DS_ZSA = null;
      document.documentElement.classList.toggle('ds-ders', !!(DS.aktif && DS.s > 0 && dsAdimlar(DS.s).length));
    }
    function dsZsAdim(yon) {                                          /* dinleme etkinliği: ileri / geri konum konum */
      var L = dsAdimlar(DS.s), a = DS.i >= 0 && DS.i < L.length ? L[DS.i] : null;
      if (!a || a.t !== 'md' || a !== DS_ZSA || !ZS.a || !ZS.el || ZS.s !== DS.s || !ZS.P.length || dsMedyaBul(DS.s, a) !== ZS.j) return false;   /* ses bu ziyarette başladıysa */
      if (yon > 0) { if (ZS.bitti || ZS.k >= ZS.P.length - 1) return false; zsSonraki(); return true; }
      var h = ZS.bitti ? ZS.P.length - 1 : ZS.k - 1;                 /* geri: bir önceki konum (çalanı yeniden değil) */
      if (h < 0) return false;
      zsGit(+ZS.P[h].b - 0.02, true); return true;
    }
    /* md: eklenen ses / video (16. bölüm) adım gelince çalar */
    function dsMedyaBul(s, a) {
      var L = mdListe(s), j = +a.j;
      if (!(L[j] && L[j].dosya === a.dosya)) { j = -1; L.forEach(function (m, k) { if (j < 0 && m && m.dosya === a.dosya) j = k; }); }
      return j >= 0 && mdGecerli(L[j]) ? j : -1;
    }
    function dsMedyaAc(s, a) {
      clearTimeout(DS_SES);
      DS_SES = setTimeout(function () {                                /* büyütme otursun; adım hâlâ bu mu, ses zaten çalıyor mu */
        if (!DS.aktif || DS.s !== s || dsAdimlar(s)[DS.i] !== a) return;
        var j = dsMedyaBul(s, a); if (j < 0) return;
        var m = mdListe(s)[j], yv = document.getElementById('mdYv');
        if (m.t === 'ses' && MD.sira === s + ':' + j && MD.ses) {
          if (!MD.ses.paused) { DS_ZSA = a; return; }                 /* mdAc aç / kapa: çalarken basılmaz */
          try { MD.ses.currentTime = 0; } catch (e) { }                /* adıma yeniden gelindi: ses baştan */
        }
        if (m.t === 'video' && yv && !yv.hidden && ZS.el && !ZS.el.paused && ZS.s === s && ZS.j === j) { DS_ZSA = a; return; }
        try { mdAc(s, j); DS_ZSA = a; } catch (e) { }
      }, 380);
    }
    function dsMedyaGeri(s, L, i) {                                   /* geri gelince: sonraki ses adımlarının sesi durur */
      if (DS_ZSA && L[i] !== DS_ZSA) DS_ZSA = null;                  /* md adımından ayrıldı: dinleme ileri / geri bitti */
      L.forEach(function (a, k) {
        if (k <= i) return;
        if (a.t === 'kaynak' && a.k != null) {                        /* kitabın kendi sesi: o adımınki çalıyorsa sus */
          var n = document.querySelector('.nokta.n-ses.calan[data-k="' + (+a.k) + '"]'), ks = mdKitapSes();
          if (n && ks && !ks.paused) ks.pause();
          return;
        }
        if (a.t !== 'md') return;
        var j = dsMedyaBul(s, a); if (j < 0) return;
        if (MD.sira === s + ':' + j && MD.ses && !MD.ses.paused) MD.ses.pause();
        if (ZS.el && ZS.s === s && ZS.j === j && !ZS.el.paused) ZS.el.pause();
      });
    }
    /* bg: bağlantı (13. bölüm) adım gelince parlar */
    function dsBagParlat(s, a) {
      var e = document.querySelector('.yuz[data-sayfa="' + s + '"] > .bg-git[data-bgi="' + (+a.j) + '"]'); if (!e) return;
      e.classList.remove('bg-parla'); void e.offsetWidth; e.classList.add('bg-parla');
      setTimeout(function () { e.classList.remove('bg-parla'); }, 1800);
    }
    /* dk: dokunma alanı (15. bölüm) adımla açılır — şık işaretlenir, yazı yazılır, örtü açılır, eşleştirmede doğru ok */
    function dsDokunDurum(s, j, acik) {
      var L = dkListe(s), a = L[j]; if (!dkGecerli(a)) return false;
      var d = dkDurum(s), deg = false;
      if (a.t === 'es') {
        var es = -1;
        L.forEach(function (c, k) { if (es < 0 && k !== j && dkGecerli(c) && c.t === 'es' && c.k != null && a.k != null && String(c.k) === String(a.k)) es = k; });
        if (es < 0) return false;
        var bu = function (x) { return (x[0] === j && x[1] === es) || (x[0] === es && x[1] === j); }, var_ = d.o.some(bu);
        if (acik && !var_) { d.o.push([j, es]); deg = true; }
        if (!acik && var_) { d.o = d.o.filter(function (x) { return !bu(x); }); deg = true; }
      } else if (!!d.a[j] !== acik) { d.a[j] = acik ? 1 : 0; deg = true; }
      return deg;
    }
    function dsDokunSifirla(s) {                                     /* ders kapanınca adımlarla açılan alanlar kapanır */
      var deg = false;
      dsAdimlar(s).forEach(function (a) { if (a.t === 'dk' && dsDokunDurum(s, +a.j, false)) deg = true; });
      if (deg) dkGoster(s);
    }
    function dsKaynakAc(s, k) {
      var y = kkYuz(s), b = y && y.querySelector('.nokta[data-k="' + k + '"]');
      if (!b) b = document.querySelector('.nokta[data-k="' + k + '"]');
      if (!b) { kkTost('Kaynak bu sayfada bulunamadı'); return; }
      clearTimeout(DS_SES);                                            /* YALNIZ İLERİ: tek bekleyen ses (hızlı ileri / geri) */
      DS_SES = setTimeout(function () {                                /* büyütme otursun; adım hâlâ bu mu */
        var a = dsAdimlar(s)[DS.i];
        if (!DS.aktif || DS.s !== s || !a || a.t !== 'kaynak' || +a.k !== +k) return;
        var y2 = kkYuz(s), b2 = (y2 && y2.querySelector('.nokta[data-k="' + k + '"]')) || b;
        if (b2.classList.contains('calan')) return;                    /* kitabın sesi zaten çalıyor: düğme aç / kapa, basılmaz */
        try { b2.click(); } catch (e) { }
      }, 380);
    }
    function dsIleri() {
      if (!DS.aktif) return;
      if (dsZsAdim(1)) return;                                    /* YALNIZ İLERİ: dinleme etkinliğinde sıradaki konum */
      var L = dsAdimlar(DS.s);
      if (L.length && DS.i >= 0 && DS.i < L.length && DS.m < dsIsaretSay(L[DS.i])) { dsIsaretAdim(DS.m + 1, true); return; }   /* İŞARETLER TEK TEK: sıradaki işaret */
      if (L.length && DS.i < L.length - 1) { dsAdimaGit(DS.i + 1, true); return; }
      if (L.length && DS.i === L.length - 1 && dsBuyuk()) { dsAdimaGit(L.length, true); return; }   /* önce küçült, sonra çevir */
      var p = dsGorunenAdimli().filter(function (x) { return x > DS.s; })[0];   /* yayılımda adımı olan öbür sayfa */
      if (p) { dsSayfaKur(p, 0, true); return; }
      dsSayfaCevir(true);
    }
    function dsGeri() {
      if (!DS.aktif) return;
      if (dsZsAdim(-1)) return;                                   /* YALNIZ İLERİ: önceki konum */
      var L = dsAdimlar(DS.s);
      if (L.length && DS.i >= 0 && DS.i < L.length && DS.m > dsIsaretIlk(L[DS.i])) { dsIsaretAdim(DS.m - 1, true); return; }   /* İŞARETLER TEK TEK: son açılanı kapat */
      if (L.length && DS.i > -1) { dsAdimaGit(DS.i - 1, true, Infinity); return; }   /* önceki adım bütün işaretleriyle */
      var G = L.length ? dsGorunenAdimli().filter(function (x) { return x < DS.s; }) : [], p = G[G.length - 1];
      if (p) { dsSayfaKur(p, dsAdimlar(p).length - 1, true, Infinity); return; }
      dsSayfaCevir(false);
    }
    /* adımsız sayfada / son adımdan sonra: sayfa çevir (sonuç flip.degisti'de) */
    function dsSayfaCevir(ileri) {
      if (dsIzleyen() || flip.animasyonda) return;             /* çevrilirken ikinci basış yön bilgisini bozmasın */
      if (ileri ? dsKitapSonu() : dsKitapBasi()) { kkTost(ileri ? 'Kitabın sonu' : 'Kitabın başı'); return; }
      if (z.o > 1.02 || z.x || z.y) { z.o = 1; z.x = 0; z.y = 0; zUygula(false); }
      DS.yon = ileri ? 'ileri' : 'geri';
      var r = false;
      DS.cevir = true;                                          /* flip.ileri/geri sarmalı: bu çevirme dersin kendisi */
      try { r = ileri ? flip.ileri() : flip.geri(); } finally { DS.cevir = false; }
      if (!r) DS.yon = null;
    }
    /* sayfaya dokunma (sürükleme değil) = ileri; düğmeler / kutular hariç; çift dokunuşun ikincisi yok sayılır */
    function dsDokunma(e, d) {
      if (!DS.aktif || !dsAdimlar(DS.s).length) return false;     /* adımsız sayfada dokunma her zamanki gibi */
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10 || Date.now() - d.t > 600) return true;   /* sürükleme: büyütme de yapma */
      if (e.target.closest && e.target.closest(YOKSAY + ',.ds-bar,.ds-cevap')) return true;
      if (kkYanki(e) || dsIzleyen()) return true;
      if (Date.now() - DS.sonTik < 350) return true;
      DS.sonTik = Date.now();
      dsIleri();
      return true;
    }
    /* klavye: ok tuşları, sunum kumandası (PageUp/PageDown), boşluk, Esc */
    document.addEventListener('keydown', function (e) {
      if (!DS.aktif) return;
      var h = e.target || {};
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(h.tagName || '') || h.isContentEditable) return;
      if (panelAcik() || tanitimAcik) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var k = e.key, ileri = k === (rtl ? 'ArrowLeft' : 'ArrowRight') || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter';   /* sağdan sola: ← ileri */
      var geri = k === (rtl ? 'ArrowRight' : 'ArrowLeft') || k === 'ArrowUp' || k === 'PageUp' || k === 'Backspace';
      if (!ileri && !geri && k !== 'Escape') return;
      if (!dsAdimlar(DS.s).length && z.o > 1.02 && /^Arrow/.test(k)) return;   /* adımsız sayfada büyükken oklar sayfada gezdirir */
      e.preventDefault(); e.stopPropagation();
      if (kkYanki(e) || dsIzleyen()) return;
      if (ileri) dsIleri(); else if (geri) dsGeri(); else dsKapat(true);
    }, true);
    /* sayfa çevrilince: adımı olan sayfaya gelindiyse çubuk «▶ ile başla» (geri gelindiyse son adım),
       adımsız sayfada çubuk gizli; düğme yalnız adımlı sayfada */
    (function () {
      var onceki = flip.degisti;
      flip.degisti = function () {
        var r = onceki.apply(this, arguments);
        if (DS.otoKapali && DS.otoKapali !== kkGorunen().join(',')) DS.otoKapali = null;   /* başka görünüm: ileri yine adımları oynatır */
        if (DS.aktif && !dsIzleyen() && (!DS.s || kkGorunen().indexOf(DS.s) < 0)) {
          var G = dsGorunenAdimli(), geri = DS.yon === 'geri';
          DS.yon = null;
          dsTemizle();
          if (G.length) { var p = geri ? G[G.length - 1] : G[0]; dsSayfaKur(p, geri ? dsAdimlar(p).length - 1 : -1, true, Infinity); }
          else { DS.s = 0; DS.i = -1; dsBarYaz(); dsGonder(); dsDurumBildir(); }
        }
        dsTusGuncelle();
        return r;
      };
    })();
    window.addEventListener('resize', function () {
      [].forEach.call(document.querySelectorAll('.ds-cevap'), function (k) {
        var y = k.closest('.yuz'); if (y) dsCevapOlc(k, y);
      });
    });
    /* İLERİ ADIMLARI OYNATIR: ders kapalıyken adımlı sayfada ileri (tuş, sayfa oku, kaydırma) dersi açar;
       ders açıkken sayfa okları ve kaydırma da adım adım ilerler (tuşlar yukarıda) */
    function dsBuyuk() { return z.o > 1.02; }
    function dsOtoBasla() {
      if (DS.otoBekle) return true;                            /* hak harcanırken ikinci basış */
      if (DS.aktif || dsIzleyen() || flip.animasyonda || !dsYetki() || !dsVeri() || !dsGorunenAdimli().length) return false;
      var imza = kkGorunen().join(',');
      if (DS.otoKapali === imza) return false;                 /* bu görünümde elle kapatıldı: sayfa çevir */
      var H = kok.KidefHak, k = Infinity;
      try { if (!DS.yerel && H && H.kalan) k = H.kalan('ders'); } catch (e) { k = Infinity; }
      if (k <= 0) { DS.otoKapali = imza; return false; }      /* deneme hakkı bitti: her zamanki gibi sayfa çevir */
      if (k !== Infinity && H.kullan) {                         /* sitede deneme hakkı: düğmedeki kapı gibi */
        DS.otoBekle = true;
        H.kullan('ders', DS.tus).then(function (ok) {
          DS.otoBekle = false;
          if (ok) dsAc(0, 0, true); else DS.otoKapali = imza;
        }, function () { DS.otoBekle = false; });
        return true;
      }
      dsAc(0, 0, true);
      return DS.aktif;
    }
    var DS_ASIL = { ileri: flip.ileri, geri: flip.geri };
    flip.ileri = function () {
      if (DS.cevir || dsIzleyen()) return DS_ASIL.ileri.apply(flip, arguments);
      if (DS.aktif) { dsIleri(); return true; }
      if (dsOtoBasla()) return true;
      return DS_ASIL.ileri.apply(flip, arguments);
    };
    flip.geri = function () {
      if (DS.cevir || dsIzleyen() || !DS.aktif) return DS_ASIL.geri.apply(flip, arguments);
      dsGeri(); return true;
    };
    /* ---------- tahta ---------- */
    function dsAnlik() { return DS.aktif ? { a: 1, s: DS.s, i: DS.i, m: DS.m } : null; }
    function dsGonder() {
      if (!TK || !TK.k || !tkLider()) return;
      try { TK.k.gonder(DS.aktif ? { t: 'ds', a: 1, s: DS.s, i: DS.i, m: DS.m } : { t: 'ds', a: 0 }); } catch (e) { }
    }
    function dsGelen(m) {
      if (!m || tkLider()) return;
      if (!m.a) { DS.bekleyen = null; if (DS.aktif) dsKapat(false); return; }
      if (!dsVeri()) { DS.bekleyen = m; dsYukle(); return; }      /* ders.js henüz yok: yüklenince uygula */
      var s = +m.s || 0, i = m.i == null ? -1 : +m.i, mm = m.m == null ? Infinity : +m.m;   /* m'siz (eski) lider: işaretler hep açık */
      if (!dsAdimlar(s).length) s = 0;                          /* liderde adımsız sayfa: çubuk gizli */
      if (!DS.aktif) { DS.aktif = true; dsBarKur(); dsSayfaKur(s, i, false, mm); dsTusGuncelle(); return; }
      if (DS.s !== s) { dsSayfaKur(s, i, false, mm); return; }
      if (s && i === DS.i && i >= 0 && i < dsAdimlar(s).length) { dsIsaretAdim(mm, false); return; }   /* aynı adım: yalnız işaret */
      if (s) dsAdimaGit(i, false, mm); else dsBarYaz();
    }
    /* ---------- önizleme (Ders Tezgâhı) ---------- */
    function dsUst() { try { return (DS.yerel && window.parent && window.parent !== window) ? window.parent : null; } catch (e) { return null; } }
    function dsHazirBildir() {
      var u = dsUst(); if (!u || DS.hazir || DS.yuk !== 2) return;      /* ders.js okunduktan (ya da yok) sonra, bir kez */
      DS.hazir = true;
      try { u.postMessage({ kd: 'dersHazir', kitap: KK_KITAP, toplam: flip.toplam || 0, var: !!dsVeri() }, '*'); } catch (e) { }
    }
    function dsDurumBildir() {
      var u = dsUst(); if (!u) return;
      var L = dsAdimlar(DS.s), a = DS.i >= 0 ? L[DS.i] : null;
      try { u.postMessage({ kd: 'dersDurum', aktif: DS.aktif, sayfa: DS.s, i: DS.i, toplam: L.length, m: DS.m, isaret: a ? dsIsaretSay(a) : 0 }, '*'); } catch (e) { }
    }
    window.addEventListener('message', function (e) {
      var u = dsUst(); if (!u || e.source !== u) return;
      var m = e.data; if (!m || typeof m !== 'object' || typeof m.kd !== 'string') return;
      if (m.kd === 'dersOnizle') {
        var s = +m.sayfa; if (!(s >= 1) || !Array.isArray(m.adimlar)) return;
        var imza = s + '|' + JSON.stringify(m.adimlar);
        if (DS.aktif && DS.onizleme && DS.s === s && imza === DS.onizSon) { dsAdimaGit(m.i == null ? 0 : +m.i, false, m.m); return; }   /* aynı içerik: yalnız adım */
        DS.onizSon = imza;
        if (!dsVeri()) { DS.v = { surum: 1, sayfa: {} }; kok.KITAP_DERS = DS.v; }
        DS.v.sayfa[String(s)] = m.adimlar;
        DS.onizleme = true;
        if (DS.aktif) dsKapat(false);
        dsTusGuncelle();
        if (dsAdimlar(s).length) dsAc(s, m.i == null ? 0 : +m.i, false, m.m);
        else { if (kkGorunen().indexOf(s) < 0) flip.git(s); dsDurumBildir(); }
      } else if (m.kd === 'dersAdim') {
        if (DS.aktif) dsAdimaGit(+m.i, false, m.m);
      } else if (m.kd === 'dersKapat') dsKapat(false);
      icDersIsaret();
    });
    dsTusKur();
    if (DS.yerel || izleCihazi()) dsYukle();
    (function () {                                           /* hak.js durumu geç gelir: bir süre yokla, sonra seyrek */
      var n = 0, t = setInterval(function () { dsTusGuncelle(); if (++n > 20) { clearInterval(t); setInterval(dsTusGuncelle, 10000); } }, 1500);
      try {
        new MutationObserver(dsTusGuncelle).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      } catch (e) { }
      kok.addEventListener('storage', function (e) { if (!e || e.key === 'kidefDestekDurum') dsTusGuncelle(); });
    })();
    if (DS.yerel) setTimeout(dsHazirBildir, 1500);           /* ders.js hâlâ gelmediyse yine de bildir (yuk=2 beklenir) */
    var dsDis = {
      aktif: dsAktif,
      ac: function (s, i) { dsAc(s, i, true); },
      kapat: function () { dsKapat(true); },
      ileri: dsIleri, geri: dsGeri,
      git: function (s, i, m) { if (!DS.aktif) dsAc(s, i, true, m); else if (DS.s !== s) dsSayfaKur(s, i, true, m); else dsAdimaGit(i, true, m); },
      durum: function () { var L = dsAdimlar(DS.s), a = DS.i >= 0 ? L[DS.i] : null; return { aktif: DS.aktif, sayfa: DS.s, i: DS.i, m: DS.m, isaret: a ? dsIsaretSay(a) : 0, toplam: L.length, sayfalar: dsSayfalar() }; },
      veri: dsVeri, yetki: dsYetki, yukle: dsYukle, tazele: dsTusGuncelle, oto: dsOtoBasla, buyuk: dsBuyuk
    };

    /* --------------------------------------------------------------
       13) İÇİNDEKİLER — sayfa bağlantıları ve konular      (29.10.2026)
       Öğretmen: "içindekiler kısmında her konuya basınca o sayfaya gidecek
       bi sistem ekleyebilelim".
       · Kitabın yanındaki icindekiler.js (window.KITAP_ICINDEKILER) herkes
         için yüklenir (yalnız MEB kitapları: KITAP_VERI.uniteler). Ders Tezgâhı
         yazar; 9 kitabın İçindekiler sayfası hazır.
       · baglanti[sayfa] = [{x1,y1,x2,y2 (% sayfa), s (basılı) | f (flip), ad}]
         → sayfanın üstünde görünmez bağlantı (.yuz > a.bg-git); tıklayınca o
         sayfa açılır (büyütme sıfırlanır). Farede üstüne gelince hafif mavi,
         sayfa ilk görününce bir kez parlar. Kalem yazarken tıklanmaz; Sınıf
         Ekranı'nda yerel/yinelenen tık bir şey yapmaz (sayfa kanaldan gelir).
       · konular[] = [{u?, ad, ar?, s | f}] → soldaki İçindekiler panelinde
         ünitenin altında (.tkonu); ünitesiz ön sayfalar Kapak'ın ardında.
         Öğretmende (ders.js yüklüyse) adımı olan ünite/konuda «▶ n».
       · ÖNİZLEME (file://, üst pencereden): {kd:'icOnizle', veri} → veri
         değişir, bağlantılar çerçeveli (html.bg-onizle) yeniden çizilir.
       · dokun[sayfa] = dokunma alanları (şık, yazı, eşleştirme, örtü) → 15. bölüm.
       · medya[sayfa] = sayfaya konan ses / video düğmeleri → 16. bölüm;
         kaydın zs'i (zaman şeridi: sesle sırayla çerçeveler) → 17. bölüm.
       · file:// kopyada sayfa resmi kitabın yanında yoksa kardeş depodan
         (../../../kidefarapca-materyal-N/<kitap>/sayfa/) — Ders Tezgâhı
         önizlemesi 7, 8 ve 10. sınıfta da resimli açılsın.
       -------------------------------------------------------------- */
    var IC = { v: null, yuk: 0, parladi: {}, panel: false };
    function icVeri() {
      if (IC.v) return IC.v;
      var v = kok.KITAP_ICINDEKILER;
      if (v && typeof v === 'object') IC.v = v;
      return IC.v;
    }
    function icFark() { var V = kok.KITAP_VERI; return (V && +V.fark) || 0; }
    function icHedef(g) {
      if (!g) return 0;
      var f = (g.f != null && isFinite(+g.f)) ? +g.f : ((g.s != null && isFinite(+g.s)) ? +g.s + icFark() : 0);
      f = Math.round(f);
      return (f >= 1 && f <= (flip.toplam || 1e6)) ? f : 0;
    }
    function icYukle() {
      var KV = kok.KITAP_VERI;
      if (IC.yuk || !KV || !Array.isArray(KV.uniteler)) return;   /* yalnız MEB kitapları (Kidef'in kendi İçindekiler sayfası var) */
      IC.yuk = 1;
      if (kok.KITAP_ICINDEKILER) { icKur(); return; }
      try {
        var d = new Date(), t = '' + d.getFullYear() + (d.getMonth() + 1) + d.getDate();
        var s = document.createElement('script');
        s.src = new URL('icindekiler.js' + (DS.yerel ? '?t=' + Date.now() : '?t=' + t), location.href).href;   /* file://: hep taze */
        s.async = true;
        s.onload = icKur;
        s.onerror = function () { IC.yuk = 2; };
        (document.head || document.documentElement).appendChild(s);
      } catch (e) { IC.yuk = 2; }
    }
    function icKur() { IC.yuk = 2; icCiz(); icPanelKur(); icParlat(); dkCiz(); dkParlat(); mdCiz(); }
    function icTik(e) {
      e.preventDefault(); e.stopPropagation();
      if (kkYanki(e) || engelli() || dsIzleyen()) return;        /* Sınıf Ekranı: sayfa kanaldan gelir */
      var f = +this.getAttribute('data-bgit'); if (!(f >= 1)) return;
      if (z.o > 1.02 || z.x || z.y) { z.o = 1; z.x = 0; z.y = 0; zUygula(false); }
      flip.git(f);
    }
    function icCiz() {
      [].forEach.call(document.querySelectorAll('.yuz > .bg-git'), function (a) { if (a.parentNode) a.parentNode.removeChild(a); });
      var V = icVeri(); if (!V || !V.baglanti || typeof V.baglanti !== 'object') return;
      Object.keys(V.baglanti).forEach(function (k) {
        var y = kkYuz(+k), L = V.baglanti[k];
        if (!y || !Array.isArray(L)) return;
        L.forEach(function (g, gj) {
          if (!g || g.y1 == null || g.y2 == null || !(+g.y2 > +g.y1)) return;
          var f = icHedef(g); if (!f) return;
          var a = document.createElement('a');
          a.className = 'bg-git'; a.href = '#'; a.setAttribute('data-bgit', String(f)); a.setAttribute('data-bgi', String(gj));   /* bg adımı (12. bölüm) */
          var ad = (g.ad ? String(g.ad) + ' — ' : '') + kkSayfaAdi(f);
          a.title = ad; a.setAttribute('aria-label', ad);
          dsKonum(a, g);
          a.addEventListener('pointerdown', function (e) { e.stopPropagation(); });   /* yaprak sürüklenmesin, bölge büyümesin */
          a.addEventListener('click', icTik);
          y.appendChild(a);
        });
      });
    }
    function icParlat() {                                       /* bağlantılı sayfa ilk görününce bir kez */
      kkGorunen().forEach(function (p) {
        if (IC.parladi[p]) return;
        var L = document.querySelectorAll('.yuz[data-sayfa="' + p + '"] > .bg-git');
        if (!L.length) return;
        IC.parladi[p] = 1;
        [].forEach.call(L, function (a) { a.classList.add('bg-parla'); });
        setTimeout(function () { [].forEach.call(L, function (a) { a.classList.remove('bg-parla'); }); }, 1800);
      });
    }
    function icPanelKur() {
      var liste = document.getElementById('tocListe'), V = icVeri(), KV = kok.KITAP_VERI;
      if (!liste || !KV) return;
      [].forEach.call(liste.querySelectorAll('.tkonular'), function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
      var U = Array.isArray(KV.uniteler) ? KV.uniteler : [], fark = icFark(), G = {};
      ((V && Array.isArray(V.konular)) ? V.konular : []).forEach(function (k) {
        if (!k || typeof k.ad !== 'string' || !k.ad) return;
        var f = icHedef(k); if (!f) return;
        var s = f - fark, gi = -1;
        if (+k.u > 0) U.forEach(function (u, i) { if (gi < 0 && +u.no === +k.u) gi = i; });
        if (gi < 0) U.forEach(function (u, i) { if (gi < 0 && s >= +u.bas && s <= +u.son) gi = i; });
        (G[gi] = G[gi] || []).push({ k: k, f: f, s: s });
      });
      Object.keys(G).forEach(function (gi) {
        var L = G[gi].sort(function (a, b) { return a.f - b.f; }), u = +gi >= 0 ? U[+gi] : null;
        var kap = document.createElement('div');
        kap.className = 'tkonular'; kap.setAttribute('role', 'group');
        kap.setAttribute('data-son', String(u ? +u.son + fark : (U[0] ? +U[0].bas + fark - 1 : 1e6)));
        kap.innerHTML = L.map(function (x) {
          return '<button type="button" class="tkonu" data-konu-f="' + x.f + '"><span class="ad">' + kkEsc(x.k.ad) +
            (x.k.ar ? '<span class="ar" dir="rtl" lang="ar">' + kkEsc(x.k.ar) + '</span>' : '') + '</span>' +
            '<span class="sy">' + kkEsc(x.s >= 1 ? 's. ' + x.s : kkSayfaAdi(x.f)) + '</span></button>';
        }).join('');
        var ust = u ? liste.querySelector('.tunite[data-git="' + u.bas + '"]') : liste.querySelector('.tunite[data-git="kapak"]');
        if (ust && ust.parentNode === liste) liste.insertBefore(kap, ust.nextSibling); else liste.appendChild(kap);
      });
      if (!IC.panel) {
        IC.panel = true;
        liste.addEventListener('click', function (e) {
          var b = e.target.closest && e.target.closest('.tkonu'); if (!b) return;
          e.preventDefault(); e.stopPropagation();
          if (kkYanki(e) || engelli() || dsIzleyen()) return;
          var f = +b.getAttribute('data-konu-f'); if (!(f >= 1)) return;
          var x = document.querySelector('#pIcindekiler [data-kapat]'); if (x) x.click();
          if (z.o > 1.02 || z.x || z.y) { z.o = 1; z.x = 0; z.y = 0; zUygula(false); }
          flip.git(f);
        });
        var t = document.getElementById('tIcindekiler');
        if (t) t.addEventListener('click', function () { icSimdi(); icDersIsaret(); });
      }
      icSimdi(); icDersIsaret();
    }
    function icSimdi() {                                        /* açık sayfayı içeren konu vurgulu */
      var G = kkGorunen(), en = null, enF = 0;
      [].forEach.call(document.querySelectorAll('#tocListe .tkonular'), function (kap) {
        var son = +kap.getAttribute('data-son') || 1e6;
        [].forEach.call(kap.querySelectorAll('.tkonu'), function (b) {
          b.classList.remove('simdi');
          var f = +b.getAttribute('data-konu-f');
          if (f >= enF && G.some(function (x) { return f <= x && x <= son; })) { en = b; enF = f; }
        });
      });
      if (en) en.classList.add('simdi');
    }
    function icDersIsaret() {                                   /* öğretmende: ders adımı olan ünite/konu */
      if (!IC) return;
      var liste = document.getElementById('tocListe'); if (!liste) return;
      [].forEach.call(liste.querySelectorAll('.tders'), function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
      if (!dsVeri() || !dsYetki()) return;
      var P = dsSayfalar(); if (!P.length) return;
      var fark = icFark(), KV = kok.KITAP_VERI, U = (KV && Array.isArray(KV.uniteler)) ? KV.uniteler : [];
      function say(f1, f2) { return P.filter(function (p) { return p >= f1 && p <= f2; }).length; }
      function isaret(el, n) {
        var i = document.createElement('span'); i.className = 'tders'; i.textContent = '▶ ' + n;
        i.title = 'Ders adımı olan sayfa: ' + n; el.appendChild(i);
      }
      U.forEach(function (u) {
        var b = liste.querySelector('.tunite[data-git="' + u.bas + '"]'), n = b ? say(+u.bas + fark, +u.son + fark) : 0;
        if (n) isaret(b.querySelector('.mt b') || b, n);
      });
      [].forEach.call(liste.querySelectorAll('.tkonular'), function (kap) {
        var B = [].slice.call(kap.querySelectorAll('.tkonu')), son = +kap.getAttribute('data-son') || 1e6;
        B.forEach(function (b, j) {
          var f = +b.getAttribute('data-konu-f'), f2 = j + 1 < B.length ? +B[j + 1].getAttribute('data-konu-f') - 1 : son;
          var n = say(f, Math.max(f, f2));
          if (n) isaret(b.querySelector('.ad') || b, n);
        });
      });
    }
    window.addEventListener('message', function (e) {         /* Ders Tezgâhı önizlemesi */
      var u = dsUst(); if (!u || e.source !== u) return;
      var m = e.data; if (!m || typeof m !== 'object' || m.kd !== 'icOnizle' || !m.veri || typeof m.veri !== 'object') return;
      IC.v = m.veri; kok.KITAP_ICINDEKILER = m.veri; IC.yuk = 2;
      document.documentElement.classList.add('bg-onizle');
      icCiz(); icPanelKur(); dkCiz(); mdCiz();
    });
    (function () {
      var onceki = flip.degisti;
      flip.degisti = function () { var r = onceki.apply(this, arguments); icParlat(); return r; };
    })();
    (function yerelResimYedegi() {                             /* yalnız file://: resmi kardeş depoda olan kitap */
      if (!DS.yerel || typeof flip.gorselYolu !== 'function') return;
      var V = kok.KITAP_VERI, m = V && /kidefarapca\.com\/(kidefarapca-materyal-[^\/]+)\/([^\/]+)\//.exec(V.sayfaKok || '');
      if (!m) return;
      var on = '../../../' + m[1] + '/' + m[2] + '/', asilG = flip.gorselYolu, asilK = flip.kucukYolu, yedek = false;
      function cevir(p) { return (yedek && /^sayfa\//.test(p)) ? on + p : p; }
      flip.gorselYolu = function (no) { return cevir(asilG.call(flip, no)); };
      if (typeof asilK === 'function') flip.kucukYolu = function (no) { return cevir(asilK.call(flip, no)); };
      var dene = new Image();
      dene.onerror = function () {
        yedek = true;
        [].forEach.call(flip.kitap.querySelectorAll('.yuz[data-yuklu]'), function (y) {
          if (y.dataset.tamGeldi) return;
          delete y.dataset.yuklu; y.classList.remove('uretilmedi');
          try { flip._yukle(y); } catch (x) { }
        });
      };
      dene.src = asilG.call(flip, Math.min(2, flip.toplam || 1));
    })();
    icYukle();
    var icDis = {
      veri: icVeri, hedef: icHedef,
      ciz: function () { icCiz(); icPanelKur(); dkCiz(); mdCiz(); },
      yukle: icYukle
    };

    /* --------------------------------------------------------------
       14) YEREL TAZELEME                                    (29.10.2026)
       Öğretmen: "kaydet tuşu yok, kaydedince hemen flipbookta sonuçlara
       bakabilmeliyim". Bilgisayardan (file://) açılan kitapta:
       · ders.js ve icindekiler.js her açılışta tazeden okunur (?t=; Safari
         dosya betiklerini bellekte tutabiliyor).
       · Sekmeye / pencereye dönülünce ikisi yeniden okunur; Ders Tezgâhı'nda
         kaydedilmiş bir değişiklik varsa kitap kaldığı sayfada yeniden
         açılır (adres ?s=… olduğu için aynı sayfa).
       Sitede (http), çerçevede (Ders Tezgâhı önizlemesi, tahta) ve Sınıf
       Ekranı izleyeninde kapalı.
       -------------------------------------------------------------- */
    var YT = { son: 0, okuyor: false, sayi: 0 };
    (function yerelTazele() {
      if (!DS.yerel) return;
      try { if (window.top !== window) return; } catch (e) { return; }
      function imza() {
        var a = kok.KITAP_DERS, b = kok.KITAP_ICINDEKILER;
        try { return JSON.stringify([(a && a.sayfa) || null, (b && b.konular) || null, (b && b.baglanti) || null, (b && b.dokun) || null, (b && b.medya) || null, (b && b.kisim) || null]); } catch (e) { return '?'; }
      }
      function oku(ad, bitti) {
        var s = document.createElement('script');
        s.src = new URL(ad + '?t=' + Date.now(), location.href).href;
        s.onload = s.onerror = function () { if (s.parentNode) s.parentNode.removeChild(s); bitti(); };
        (document.head || document.documentElement).appendChild(s);
      }
      function bak() {
        if (YT.okuyor || document.visibilityState === 'hidden' || Date.now() - YT.son < 800) return;
        if (DS.yuk === 1 || IC.yuk === 1 || dsIzleyen()) return;            /* ilk okuma sürüyor / izleyen */
        var L = [];
        if (DS.yuk === 2) L.push('ders.js');
        if (IC.yuk === 2) L.push('icindekiler.js');
        if (!L.length) return;
        YT.son = Date.now(); YT.okuyor = true; YT.sayi++;
        var once = imza();
        (function sira() {
          if (L.length) { oku(L.shift(), sira); return; }
          YT.okuyor = false;
          if (imza() === once) return;
          try { kkTost('Ders Tezgâhı\'nda kaydedilenler yükleniyor…'); } catch (e) { }
          setTimeout(function () { location.reload(); }, 150);
        })();
      }
      document.addEventListener('visibilitychange', bak);
      window.addEventListener('focus', bak);
      YT.bak = bak;
    })();

    /* --------------------------------------------------------------
       15) DOKUNMA ALANLARI                                  (30.10.2026)
       Öğretmen: "bazı sayfalarda örneğin 3 tane şık veriliyor, bu üç şıktan
       birine veya birden fazlasına dokunma vurgusu ekleyebilmeliyiz, o
       vurgulu yerlerden birine basınca bi daire mi eklenecek, tik veya çarpı
       mı hepsini belirleyebilip ekleyebilmeliyim ... bu tarzda araçlar
       ekleyelim". Seçtikleri: kitap açıkken herkes; doğru/yanlış sesi;
       yanlışta doğruyu göster; dokununca yazı, eşleştirme, dokununca örtü.
       · icindekiler.js (herkese açık; Ders Tezgâhı «Dokunma» yazar):
         dokun[sayfa] = [{t, x1, y1, x2, y2 (% sayfa), …}]
           sik   m: 'daire' | 'tik' | 'carpi', q: soru no. Dokununca işaret
                 (◯ şıkkın çevresine, ✓ ✗ ortasına), ◯ ✓ doğru, ✗ yanlış sesi;
                 ✗'de aynı sorunun doğru şıkları da işaretlenir. Yine dokununca
                 işaret kalkar.
           yazi  ar, tr: dokununca o yere yazılır (mürekkep); yine dokununca kalkar.
           es    k: eş no. İki öğeye sırayla dokununca aralarına ok: eş no
                 aynıysa doğru (yeşil, kalır), değilse kırmızı (bir an; yeniden
                 denenir). Eşli öğeye yine dokununca ok kalkar.
           ortu  dokununca açılır, yine dokununca örtülür.
       · Sayfada sarı vurgu (.yuz > .dk; ilk görününce bir kez parlar);
         «Düğmeler» kapalıyken yalnız üstüne gelince. Kalem yazarken
         dokunulmaz; ders modunda dokunmak adım ilerletmez (YOKSAY'da).
         Sürükleme / uzun basış dokunma sayılmaz. Durum sayfa yenilenince sıfır.
       · Tahta: lider dokununca sayfanın durumu {t:'dk', s, a, o, c, x?};
         izleyen uygular (sessiz; kendi dokunuşu bir şey yapmaz).
       · Önizleme (Ders Tezgâhı, icOnizle) alanları yeniden kurar.
       -------------------------------------------------------------- */
    var DK_TUR = { sik: 1, yazi: 1, es: 1, ortu: 1 };
    var DK_AD = { sik: 'Şık — dokun', yazi: 'Dokun: cevap yazılsın', es: 'Eşleştir: iki öğeye sırayla dokun', ortu: 'Örtü — dokun, açılsın' };
    var DK = { d: {}, sec: null, ses: null, parladi: {}, sesler: [] };
    function dkVeri() { var V = icVeri(); return (V && V.dokun && typeof V.dokun === 'object') ? V.dokun : null; }
    function dkListe(s) { var V = dkVeri(), L = V && V[String(s)]; return Array.isArray(L) ? L : []; }
    function dkGecerli(a) {
      return !!(a && typeof a === 'object' && DK_TUR[a.t] && isFinite(+a.x1) && isFinite(+a.x2) && isFinite(+a.y1) && isFinite(+a.y2) &&
        +a.x2 > +a.x1 && +a.y2 > +a.y1);
    }
    function dkDurum(s) { return DK.d[s] || (DK.d[s] = { a: [], o: [] }); }
    function dkEsli(d, j) { return d.o.some(function (x) { return x[0] === j || x[1] === j; }); }
    /* alanlar: sayfanın üstünde vurgulu dikdörtgen; veri değişince hepsi yeniden (durum sıfır) */
    function dkCiz() {
      [].forEach.call(document.querySelectorAll('.yuz > .dk, .yuz > .dk-isaret, .yuz > .dk-yaz'), function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
      DK.d = {}; DK.sec = null;
      var V = dkVeri(); if (!V) return;
      Object.keys(V).forEach(function (k) {
        var s = +k, y = kkYuz(s), L = dkListe(s);
        if (!y || !L.length) return;
        L.forEach(function (a, j) {
          if (!dkGecerli(a)) return;
          var el = document.createElement('div');
          el.className = 'dk dk-' + a.t;
          el.setAttribute('data-dk', String(j)); el.setAttribute('role', 'button');
          el.title = DK_AD[a.t]; el.setAttribute('aria-label', DK_AD[a.t]);
          dsKonum(el, a);
          if (a.t === 'ortu') el.innerHTML = '<i></i>';
          el.addEventListener('pointerdown', function (e) { e.stopPropagation(); el._dk = { x: e.clientX, y: e.clientY, t: Date.now() }; });   /* yaprak sürüklenmesin */
          el.addEventListener('click', dkTik);
          y.appendChild(el);
        });
      });
    }
    function dkParlat() {                                       /* alanlı sayfa ilk görününce bir kez */
      kkGorunen().forEach(function (p) {
        if (DK.parladi[p]) return;
        var L = [].filter.call(document.querySelectorAll('.yuz[data-sayfa="' + p + '"] > .dk'), function (e) { return !e.classList.contains('dk-ortu'); });
        if (!L.length) return;
        DK.parladi[p] = 1;
        L.forEach(function (a) { a.classList.add('dk-parla'); });
        setTimeout(function () { L.forEach(function (a) { a.classList.remove('dk-parla'); }); }, 1900);
      });
    }
    function dkTik(e) {
      e.preventDefault(); e.stopPropagation();
      var b = this._dk; this._dk = null;
      if (b && (Math.hypot(e.clientX - b.x, e.clientY - b.y) > 12 || Date.now() - b.t > 900)) return;   /* sürükleme / uzun basış */
      if (kkYanki(e) || engelli() || dsIzleyen()) return;          /* Sınıf Ekranı: durum kanaldan gelir */
      var y = this.parentNode, s = y ? +y.getAttribute('data-sayfa') : 0;
      dkDokun(s, +this.getAttribute('data-dk'));
    }
    function dkSecKoy(sec) {                                    /* eşleştirmede seçili öğe (sayfa değişse de eskisi söner) */
      var once = DK.sec; DK.sec = sec;
      if (once && (!sec || once.s !== sec.s)) dkGoster(once.s);
    }
    function dkDokun(s, j) {
      var L = dkListe(s), a = L[j]; if (!dkGecerli(a)) return;
      var d = dkDurum(s);
      if (a.t === 'es') { dkEs(s, j); return; }
      dkSecKoy(null);
      var ac = !d.a[j];
      d.a[j] = ac ? 1 : 0;
      if (ac && a.t === 'sik') {
        var dogru = a.m !== 'carpi';
        dkSes(dogru);
        if (!dogru) setTimeout(function () {                      /* yanlışta doğruyu göster: aynı sorunun doğru şıkları */
          if (!d.a[j] || DK.d[s] !== d) return;                    /* bu arada kapatıldı / veri değişti */
          var deg = false;
          dkListe(s).forEach(function (c, k) {
            if (dkGecerli(c) && c.t === 'sik' && c.m !== 'carpi' && (+c.q || 0) === (+a.q || 0) && !d.a[k]) { d.a[k] = 1; deg = true; }
          });
          if (deg) { dkGoster(s); dkGonder(s); }
        }, 600);
      }
      dkGoster(s); dkGonder(s);
    }
    function dkEs(s, j) {
      var L = dkListe(s), d = dkDurum(s), a = L[j];
      if (dkEsli(d, j)) {                                         /* eşli öğe: ok kalkar */
        d.o = d.o.filter(function (x) { return x[0] !== j && x[1] !== j; });
        dkSecKoy(null); dkGoster(s); dkGonder(s); return;
      }
      var sec = DK.sec;
      if (!sec || sec.s !== s || !dkGecerli(L[sec.j]) || dkEsli(d, sec.j)) { dkSecKoy({ s: s, j: j }); dkGoster(s); dkGonder(s); return; }   /* ilk öğe */
      var i = sec.j; dkSecKoy(null);
      if (i === j) { dkGoster(s); dkGonder(s); return; }        /* aynısına yine: seçim kalkar */
      var b = L[i], dogru = b.k != null && a.k != null && String(b.k) === String(a.k);
      dkSes(dogru);
      if (dogru) { d.o.push([i, j]); dkGoster(s); dkGonder(s); return; }
      dkGoster(s); dkGeciciOk(s, i, j); dkGonder(s, [i, j]);     /* yanlış: kırmızı ok bir an, yeniden denenir */
    }
    /* ---------- çizim: işaretler (kalemle aynı), oklar, yazılar ---------- */
    function dkSvg(y) {
      for (var n = y.firstChild; n; n = n.nextSibling) if (n.nodeType === 1 && n.getAttribute('class') === 'dk-isaret') return n;
      var v = document.createElementNS(KK_NS, 'svg');
      v.setAttribute('class', 'dk-isaret'); v.setAttribute('viewBox', '0 0 ' + KK_EN + ' ' + KK_BOY); v.setAttribute('preserveAspectRatio', 'none');
      v.setAttribute('aria-hidden', 'true'); v.setAttribute('focusable', 'false');
      y.appendChild(v);
      return v;
    }
    function dkKutu(a) {                                          /* alanın dikdörtgeni (kalem birimi) */
      var x1 = dsYuzde(a.x1, 0) * KK_EN / 100, x2 = dsYuzde(a.x2, 100) * KK_EN / 100, y1 = dsYuzde(a.y1, 0) * KK_BOY / 100, y2 = dsYuzde(a.y2, 100) * KK_BOY / 100;
      return { x1: x1, x2: x2, y1: y1, y2: y2, cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, w: x2 - x1, h: y2 - y1 };
    }
    function dkIsaretKaydi(a) {
      var b = dkKutu(a);
      if (a.m === 'tik' || a.m === 'carpi') {
        var s = Math.max(28, Math.min(b.h * 1.35, b.w * 0.9, 120));
        return ceDamga({ a: 'T', d: a.m === 'tik' ? 't' : 'x', r: a.m === 'tik' ? 3 : 2, w: 'o', x: kkR(b.cx), y: kkR(b.cy), s: kkR(s) });
      }
      var p = Math.max(6, Math.min(16, b.h * 0.18));             /* ◯ şıkkın çevresine */
      return ceDamga({ a: 'T', d: 'c', r: 3, w: 'o', x: kkR(b.cx), y: kkR(b.cy), rx: kkR(b.w / 2 + p), ry: kkR(b.h / 2 + p) });
    }
    function dkKenar(b, tx, ty) {                                  /* kutunun merkezinden (tx, ty) yönünde kenar noktası */
      var dx = tx - b.cx, dy = ty - b.cy;
      if (!dx && !dy) return [b.cx, b.cy];
      var t = Math.min(dx ? (b.w / 2) / Math.abs(dx) : Infinity, dy ? (b.h / 2) / Math.abs(dy) : Infinity, 1);
      return [b.cx + dx * t, b.cy + dy * t];
    }
    function dkOkKaydi(A, B, r) {                                  /* A'nın kenarından B'nin kenarına ok (başta nokta, sonda uç) */
      if (!dkGecerli(A) || !dkGecerli(B)) return null;
      var a = dkKutu(A), b = dkKutu(B), p = dkKenar(a, b.cx, b.cy), q = dkKenar(b, a.cx, a.cy);
      var L = Math.hypot(q[0] - p[0], q[1] - p[1]);
      if (L < 30) { p = [a.cx, a.cy]; q = [b.cx, b.cy]; L = Math.hypot(q[0] - p[0], q[1] - p[1]); }
      if (L < 2) return null;
      var geri = Math.min(8, L * 0.1);                             /* uç yazının üstüne binmesin */
      q = [q[0] - (q[0] - p[0]) / L * geri, q[1] - (q[1] - p[1]) / L * geri];
      return { a: 'O', r: r, w: 'o', p: [kkR(p[0]), kkR(p[1]), kkR(q[0]), kkR(q[1])] };
    }
    function dkGoster(s) {                                         /* sayfanın durumunu çiz: yalnız değişen eklenir / kalkar */
      var y = kkYuz(s); if (!y) return;
      var L = dkListe(s), d = dkDurum(s), ist = {}, sec = DK.sec && DK.sec.s === s ? DK.sec.j : -1;
      [].forEach.call(y.querySelectorAll('.dk'), function (el) {
        if (el.parentNode !== y) return;
        var j = +el.getAttribute('data-dk'), a = L[j]; if (!dkGecerli(a)) return;
        var acik = a.t === 'es' ? dkEsli(d, j) : !!d.a[j];
        el.classList.toggle('dk-acik', acik);
        el.classList.toggle('dk-secik', j === sec);
        if (a.t === 'sik' && acik) ist['m' + j] = dkIsaretKaydi(a);
        if (a.t === 'yazi') dkYazi(y, a, j, acik);
      });
      d.o.forEach(function (x) { var c = dkOkKaydi(L[x[0]], L[x[1]], 3); if (c) ist['o' + x[0] + '-' + x[1]] = c; });
      var v = dkSvg(y);
      [].slice.call(v.childNodes).forEach(function (g) {
        if (g.nodeType !== 1) return;
        var k = g.getAttribute('data-k'); if (!k) return;             /* geçici (kırmızı) ok kendi gider */
        if (ist[k]) delete ist[k]; else v.removeChild(g);
      });
      Object.keys(ist).forEach(function (k) {
        var c = ist[k], g = ceG(c);
        g.setAttribute('class', 'kk-ce' + (c.a === 'O' || (c.a === 'T' && c.d === 'c') ? ' ds-ciz' : ''));   /* ok ve ◯ çizilerek (12. bölüm) */
        g.setAttribute('data-k', k);
        v.appendChild(g); dsIsaretCiz(g);
      });
    }
    function dkGeciciOk(s, i, j) {                                 /* yanlış eş: kırmızı ok bir an */
      var y = kkYuz(s), L = dkListe(s), c = dkOkKaydi(L[i], L[j], 2); if (!y || !c) return;
      var v = dkSvg(y), g = ceG(c);
      g.setAttribute('class', 'kk-ce ds-ciz dk-gecici');
      v.appendChild(g); dsIsaretCiz(g);
      setTimeout(function () { g.classList.add('dk-son'); }, 900);
      setTimeout(function () { if (g.parentNode) g.parentNode.removeChild(g); }, 1450);
    }
    function dkYazi(y, a, j, acik) {                               /* dokununca yazı: o yere sığdırılır (mürekkep) */
      var k = y.querySelector('.dk-yaz[data-dk="' + j + '"]');
      if (!acik) { if (k && k.parentNode) k.parentNode.removeChild(k); return; }
      if (k) return;
      var h = '';
      if (a.ar) h += '<div class="ds-ar" dir="rtl" lang="ar">' + kkEsc(a.ar) + '</div>';
      if (a.tr) h += '<div class="ds-tr">' + kkEsc(a.tr) + '</div>';
      if (!h) return;
      k = document.createElement('div');
      k.className = 'dk-yaz'; k.setAttribute('data-dk', String(j)); k.setAttribute('aria-hidden', 'true');
      dsKonum(k, a);
      k.innerHTML = '<div class="dk-yazi">' + h + '</div>';
      y.appendChild(k);
      dkYaziOlc(k, y);
    }
    function dkYaziOlc(k, y) {
      var W = y.offsetWidth || 0; if (!W) return;
      var taban = Math.max(9, W * 0.022);
      k.style.fontSize = taban + 'px';
      var ic = k.firstChild, kw = k.clientWidth, kh = k.clientHeight;
      if (!ic || !kw || !kh || !ic.offsetWidth || !ic.offsetHeight) return;
      k.style.fontSize = Math.max(6, taban * Math.min(kw / ic.offsetWidth, kh / ic.offsetHeight, 1.6) * 0.94) + 'px';
    }
    window.addEventListener('resize', function () {
      [].forEach.call(document.querySelectorAll('.yuz > .dk-yaz'), function (k) { if (k.parentNode) dkYaziOlc(k, k.parentNode); });
    });
    /* kısa doğru / yanlış sesi (Web Audio; dosya yok) */
    function dkSes(dogru) {
      DK.sesler.push(dogru ? 'dogru' : 'yanlis'); if (DK.sesler.length > 20) DK.sesler.shift();
      try {
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        var C = DK.ses || (DK.ses = new AC());
        if (C.state === 'suspended' && C.resume) C.resume();
        var t = C.currentTime + 0.01;
        (dogru ? [[784, 0, 0.14, 'sine', 0.22], [1175, 0.1, 0.28, 'sine', 0.2]] : [[196, 0, 0.3, 'square', 0.06], [165, 0.14, 0.32, 'square', 0.06]]).forEach(function (n) {
          var o = C.createOscillator(), g = C.createGain();
          o.type = n[3]; o.frequency.setValueAtTime(n[0], t + n[1]);
          g.gain.setValueAtTime(0.0001, t + n[1]);
          g.gain.exponentialRampToValueAtTime(n[4], t + n[1] + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, t + n[1] + n[2]);
          o.connect(g); g.connect(C.destination);
          o.start(t + n[1]); o.stop(t + n[1] + n[2] + 0.03);
        });
      } catch (e) { }
    }
    /* ---------- tahta ---------- */
    function dkSik(d, n) { var A = []; for (var i = 0; i < n; i++) A.push(d.a[i] ? 1 : 0); return A; }
    function dkGonder(s, x) {
      if (!TK || !TK.k || !tkLider()) return;
      var d = dkDurum(s), m = { t: 'dk', s: s, a: dkSik(d, dkListe(s).length), o: d.o.map(function (p) { return [p[0], p[1]]; }), c: DK.sec && DK.sec.s === s ? DK.sec.j : -1 };
      if (x) m.x = x;
      try { TK.k.gonder(m); } catch (e) { }
    }
    function dkGelen(m) {
      if (!m || tkLider()) return;
      var s = +m.s; if (!(s >= 1)) return;
      var d = dkDurum(s);
      d.a = Array.isArray(m.a) ? m.a.map(function (v) { return v ? 1 : 0; }) : [];
      d.o = Array.isArray(m.o) ? m.o.filter(function (p) { return Array.isArray(p) && p.length === 2 && isFinite(+p[0]) && isFinite(+p[1]); }).map(function (p) { return [+p[0], +p[1]]; }) : [];
      if (+m.c >= 0) dkSecKoy({ s: s, j: +m.c }); else if (DK.sec && DK.sec.s === s) dkSecKoy(null);
      dkGoster(s);
      if (Array.isArray(m.x) && m.x.length === 2) dkGeciciOk(s, +m.x[0], +m.x[1]);
    }
    (function () {
      var onceki = flip.degisti;
      flip.degisti = function () { var r = onceki.apply(this, arguments); dkParlat(); return r; };
    })();
    var dkDis = {
      veri: dkVeri, liste: dkListe, ciz: dkCiz, dokun: dkDokun, gelen: dkGelen,
      durum: function (s) { var d = dkDurum(s); return { a: dkSik(d, dkListe(s).length), o: d.o.map(function (p) { return [p[0], p[1]]; }), sec: DK.sec ? { s: DK.sec.s, j: DK.sec.j } : null, sesler: DK.sesler.slice() }; }
    };

    /* --------------------------------------------------------------
       16) SES VE VİDEO                                      (30.10.2026)
       Öğretmen: "bi klasörden diyelimki ses veya video yu sürükle bırak veya
       klasörden dosya seçerek kitabın istediğimiz yerine bırakabilelim".
       · icindekiler.js (herkese açık; Ders Tezgâhı «Ses ve video» yazar):
         medya[sayfa] = [{t: 'ses' | 'video', x1, y1, x2, y2 (% sayfa),
         dosya: 'medya/<ad>.<uzantı>', ad}]. Dosyayı kitabın medya/ klasörüne
         Ders Tezgâhı'nın kaydetme yardımcısı kopyalar (yol yalnız medya/…).
       · Sayfada kitabın kendi ses / video düğmeleri gibi (.nokta.n-ses /
         .n-video, sayfanın katmanında; flip.katmanKur sarılır: sayfa yeniden
         kurulunca düğmeler de gelir).
       · Ses: alttaki çalar (kitabınkiyle aynı görünüş, ayrı öğe); biri
         çalınca öbürü durur. Video: kitabın video penceresi (#pVideo); yoksa
         kendi penceresi. Sınıf Ekranı'nda tık kabuktan yinelenir (kitabın
         düğmeleri gibi).
       · Önizleme (icOnizle) ve yerel tazeleme medya'yı da izler.
       · ZAMAN ŞERİDİ (17. bölüm): kaydın zs'i varsa çalarken çerçeveler sesle
         sırayla yanar; zs'li video kitabın penceresinde değil, yüzen pencerede.
       -------------------------------------------------------------- */
    var MD_YOL = /^medya\/[A-Za-z0-9][A-Za-z0-9._-]{0,90}\.(mp3|m4a|aac|wav|ogg|oga|opus|mp4|m4v|webm|mov)$/;
    var MD_IK = {
      ses: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
      video: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/></svg>'
    };
    var MD = { calar: null, ses: null, sira: null, biz: false };
    function mdVeri() { var V = icVeri(); return (V && V.medya && typeof V.medya === 'object') ? V.medya : null; }
    function mdListe(s) { var V = mdVeri(), L = V && V[String(s)]; return Array.isArray(L) ? L : []; }
    function mdGecerli(a) {
      return !!(a && typeof a === 'object' && (a.t === 'ses' || a.t === 'video') && typeof a.dosya === 'string' && MD_YOL.test(a.dosya) &&
        isFinite(+a.x1) && isFinite(+a.x2) && isFinite(+a.y1) && isFinite(+a.y2) && +a.x2 > +a.x1 && +a.y2 > +a.y1);
    }
    function mdAd(a) { return (a && typeof a.ad === 'string' && a.ad.trim()) ? a.ad.trim().slice(0, 80) : (a && a.t === 'video' ? 'Video' : 'Ses'); }
    function mdYol(a) { try { return new URL(a.dosya, location.href).href; } catch (e) { return a.dosya; } }
    function mdKatmanKur(s, katman) {                               /* sayfanın katmanına düğmeler (kitabın düğmelerinin ardına) */
      if (!katman) return;
      [].forEach.call(katman.querySelectorAll('.md-dugme'), function (b) { if (b.parentNode === katman) katman.removeChild(b); });
      mdListe(s).forEach(function (a, j) {
        if (!mdGecerli(a)) return;
        var b = document.createElement('button'), ad = mdAd(a);
        b.type = 'button'; b.className = 'nokta md-dugme n-' + a.t;
        b.setAttribute('data-md', String(j)); b.setAttribute('data-md-s', String(s));
        var x1 = dsYuzde(a.x1, 0), y1 = dsYuzde(a.y1, 0);
        b.style.left = x1 + '%'; b.style.top = y1 + '%';
        b.style.width = Math.max(1, dsYuzde(a.x2, 100) - x1) + '%'; b.style.height = Math.max(1, dsYuzde(a.y2, 100) - y1) + '%';
        b.title = ad + (a.t === 'video' ? ' — video' : ' — ses'); b.setAttribute('aria-label', b.title);
        b.innerHTML = MD_IK[a.t] + '<b>' + kkEsc(ad) + '</b>';
        b.addEventListener('pointerdown', function (e) { e.stopPropagation(); });   /* yaprak sürüklenmesin */
        b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); mdAc(s, j); });
        katman.appendChild(b);
      });
      mdCalanIsaretle();
    }
    function mdCiz() {                                               /* veri değişti: bütün sayfalarda yeniden */
      if (!flip.kitap) return;
      [].forEach.call(flip.kitap.querySelectorAll('.yuz'), function (y) {
        var s = +y.getAttribute('data-sayfa'), k = y.querySelector('.katman');
        if (s >= 1 && k) mdKatmanKur(s, k);
      });
      zsYenile();                                                      /* 17. bölüm: çalan kaydın çerçeveleri */
      ksYenile();                                                      /* 18. bölüm: çubuktaki kısımlar */
    }
    (function () {                                                   /* kitap sayfayı kurunca (yeniden kurunca) düğmeler de */
      var asil = flip.katmanKur;
      flip.katmanKur = function (no, katman) {
        if (asil) asil.apply(this, arguments);
        try { mdKatmanKur(+no, katman); } catch (e) { }
      };
    })();
    function mdKitapSes() { return document.getElementById('calarSes'); }
    function mdCalarKur() {                                          /* kitabın çalarıyla aynı görünüş (.calar), ayrı öğe */
      if (MD.calar) return MD.calar;
      var c = document.createElement('div');
      c.className = 'calar md-calar'; c.id = 'mdCalar'; c.hidden = true;
      c.setAttribute('role', 'region'); c.setAttribute('aria-label', 'Ses çalar');
      c.innerHTML = '<span class="ci">' + MD_IK.ses + '</span><div class="cm"><b class="md-c-ad">Ses</b><small class="md-c-s"></small></div>' +
        '<audio controls preload="none"></audio><button type="button" class="kapat" aria-label="Sesi kapat">&times;</button>' + zsAracHtml();   /* 17. bölüm */
      document.body.appendChild(c);
      var a = c.querySelector('audio');
      ['play', 'pause', 'ended'].forEach(function (ev) { a.addEventListener(ev, mdCalanIsaretle); });
      a.addEventListener('play', function () {                      /* çalardaki ▶ ile: kitabınki durur, gizlenir */
        if (MD.biz) { MD.biz = false; return; }                       /* mdAc başlattı: kitabınkini orada durdurdu */
        var k = mdKitapSes(); if (k && !k.paused) k.pause();
        var kc = document.getElementById('calar'); if (kc) kc.hidden = true;
      });
      a.addEventListener('error', function () { if (a.getAttribute('src')) kkTost('Ses dosyası açılamadı'); });
      c.querySelector('.kapat').addEventListener('click', function () {
        a.pause(); a.removeAttribute('src'); try { a.load(); } catch (e) { }
        MD.sira = null; c.hidden = true; if (ZS.el === a) zsBitir(); mdCalanIsaretle();
      });
      var k = mdKitapSes();                                          /* kitabın sesi çalınca bizimki durur, gizlenir */
      if (k) k.addEventListener('play', function () { if (!a.paused) a.pause(); c.hidden = true; if (ZS.el === a) zsBitir(); mdCalanIsaretle(); });
      MD.calar = c; MD.ses = a;
      ksBagla(a, c, true);                                             /* 18. bölüm: kalın çubuk, kısımlar */
      return c;
    }
    function mdAc(s, j) {
      var a = mdListe(s)[j]; if (!mdGecerli(a)) return;
      if (a.t === 'video') { if (zsVar(a)) zsVideo(s, j, a); else mdVideo(s, a); return; }   /* zs'li: yüzen pencere (17. bölüm) */
      var c = mdCalarKur(), au = MD.ses, kim = s + ':' + j;
      if (MD.sira === kim && !au.paused) { au.pause(); return; }
      if (MD.sira !== kim) { au.src = mdYol(a); MD.sira = kim; }
      mdYvKapat();                                                       /* ZAMAN ŞERİDİ: yüzen video kapanır; zs'li seste çerçeveler */
      if (zsVar(a)) { if (!ZS.a || ZS.el !== au || ZS.s !== +s || ZS.j !== +j) zsBasla(s, j, a, au, c); }
      else if (ZS.el === au) zsBitir();
      c.querySelector('.md-c-ad').textContent = mdAd(a);
      c.querySelector('.md-c-s').textContent = 'Kitap ' + kkSayfaAdi(s);
      c.hidden = false;
      var v = document.getElementById('videoOyn'); if (v && !v.paused) v.pause();
      var k = mdKitapSes(); if (k && !k.paused) k.pause();               /* kitabın sesi durur, çaları gizlenir (hemen) */
      var kc = document.getElementById('calar'); if (kc) kc.hidden = true;
      MD.biz = true;
      var p = au.play(); if (p && p.catch) p.catch(function () { MD.biz = false; });
      mdCalanIsaretle();
    }
    function mdCalanIsaretle() {
      var au = MD.ses, calan = au && !au.paused ? MD.sira : null;
      [].forEach.call(document.querySelectorAll('.md-dugme'), function (b) {
        b.classList.toggle('md-calan', calan !== null && (b.getAttribute('data-md-s') + ':' + b.getAttribute('data-md')) === calan);
      });
    }
    function mdVideo(s, a) {                                          /* kitabın video penceresi; yoksa kendi penceresi */
      mdYvKapat();                                                     /* 17. bölüm: zs'li yüzen video kapanır */
      if (MD.ses && !MD.ses.paused) MD.ses.pause();
      var k = mdKitapSes(); if (k && !k.paused) k.pause();
      var pv = document.getElementById('pVideo'), v = document.getElementById('videoOyn');
      if (pv && v) {
        [].forEach.call(document.querySelectorAll('.panel.acik'), function (p) { p.classList.remove('acik'); p.setAttribute('aria-hidden', 'true'); });
        var fr = document.getElementById('etkinlikCerceve'); if (fr && fr.getAttribute('src')) fr.removeAttribute('src');
        pv.classList.add('acik'); pv.setAttribute('aria-hidden', 'false');
        var perde = document.getElementById('perde'); if (perde) perde.classList.add('acik');
        var r = document.getElementById('videoRozet'); if (r) r.textContent = 'Video';
        var bs = document.getElementById('videoBaslik'); if (bs) bs.textContent = mdAd(a) + ' · ' + kkSayfaAdi(s);
        var ind = document.getElementById('videoIndir'); if (ind) ind.href = a.dosya;
        v.poster = ''; v.src = mdYol(a);
        var p = v.play(); if (p && p.catch) p.catch(function () { });
        return;
      }
      var o = document.getElementById('mdVideo');
      if (!o) {
        o = document.createElement('div'); o.id = 'mdVideo'; o.className = 'md-video'; o.hidden = true;
        o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'Video');
        o.innerHTML = '<div class="md-v-kutu"><button type="button" class="md-v-x" aria-label="Kapat">&times;</button><video controls playsinline></video></div>';
        document.body.appendChild(o);
        ksBagla(o.querySelector('video'), o.querySelector('.md-v-kutu'), false, null);   /* 18. bölüm */
        var kapat = function () { var vv = o.querySelector('video'); vv.pause(); vv.removeAttribute('src'); o.hidden = true; };
        o.querySelector('.md-v-x').addEventListener('click', kapat);
        o.addEventListener('click', function (e) { if (e.target === o) kapat(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !o.hidden) kapat(); });
      }
      var vk = o.querySelector('video'); o.hidden = false; vk.src = mdYol(a);
      var p2 = vk.play(); if (p2 && p2.catch) p2.catch(function () { });
    }
    var mdDis = {
      veri: mdVeri, liste: mdListe, ciz: mdCiz, ac: mdAc,
      durum: function () { return { calan: MD.ses && !MD.ses.paused ? MD.sira : null, sira: MD.sira, src: MD.ses ? MD.ses.getAttribute('src') : null }; }
    };

    /* --------------------------------------------------------------
       17) ZAMAN ŞERİDİ — SESLE SIRAYLA ÇERÇEVE, CEVAP KILAVUZU   (30.10.2026)
       Öğretmen: "diyelimki bi ses etkinliği var ve 15 konum var, sesle beraber
       sırayla 15 konumda çözüm istenen etkinlikte sesle ilgili nereye işlem
       yapılması gerektiğini gösteren bi çerçeve olabilir ... ses yazı video
       takip ve işlem şeridi ... biz sadece flip book için basit ama biraz da
       kapsamlı bi cevap klavuz arayüzü yapacağız". Seçtikleri: herkes görür,
       cevap düğmeyle; her parçadan sonra dur; büyütüp takip; altyazı;
       çerçeveye dokununca o parça.
       · icindekiler.js medya kaydında zs (Ders Tezgâhı «Zaman şeridi» yazar):
         zs: { parca: [{b, s (saniye), x1, y1, x2, y2 (% sayfa; yoksa çerçevesiz),
                        sayfa? (çerçeve başka sayfadaysa flip no), ar?, tr?,
                        m?: 'tik' | 'carpi' | 'daire'}],
               yazi: [{b, s, ar?, tr?}],          (altyazı)
               cevap: 'dugme' | 'sonra', dur: true | false, altyazi: true }
       · Düğmeye basınca çerçeveler sayfada belirir (numaralı, kesik çizgi);
         çalan parçanın çerçevesi yanar, sonraki parça başlayana dek yanık
         kalır (öğrenci o arada yazar). Çalar kapanınca çerçeveler kalkar.
       · Çalarda konum çubuğu: ⏮ 3 / 15 ⏭ · Dur (her parçadan sonra durur;
         ▶ ya da ⏭ ile devam) · Takip (görünüm yanan çerçeveye büyür; bu
         cihazda hatırlanır) · Yazı (altyazı) · Cevaplar. Görünmeyen düğme o
         kayıtta işe yaramayandır (cevap yok → «Cevaplar» yok …).
       · Cevaplar: 'dugme' → «Cevaplar»a basınca hepsi; 'sonra' → parça bitip
         sonraki başlayınca (sonuncusu ses bitince) o çerçevede; düğme yine
         hepsini açar. Cevap çerçeveye sığdırılır (mürekkep), işaret ✓ ✗ ◯.
       · Çerçeveye dokununca o parça çalar ve sonunda durur. Ders modunda
         dokunmak adım ilerletmez (YOKSAY'da); kalem yazarken dokunulmaz.
       · zs'li video kitabın penceresinde değil, sürüklenen küçük pencerede
         (sayfa görünür kalsın). Sınıf Ekranı'nda takip büyütmesi yapılmaz
         (görünüm kumandadan gelir).
       -------------------------------------------------------------- */
    var ZS_IK = {
      onceki: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14"/><path d="M18 6.5l-9 5.5 9 5.5z"/></svg>',
      sonraki: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5v14"/><path d="M6 6.5l9 5.5-9 5.5z"/></svg>',
      dur: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.5" y="5" width="4.5" height="14" rx="1.3"/><rect x="14" y="5" width="4.5" height="14" rx="1.3"/></svg>',
      takip: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5M10.5 7.5v6M7.5 10.5h6"/></svg>',
      yazi: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.6 10.3a2.3 2.3 0 1 0 0 3.4M17 10.3a2.3 2.3 0 1 0 0 3.4"/></svg>',
      cevap: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M7.8 12.3l2.8 2.8 5.6-5.8"/></svg>'
    };
    var ZS_M = { tik: 1, carpi: 1, daire: 1 };
    var ZS = { a: null, s: 0, j: -1, P: [], Y: [], el: null, kap: null, k: -2, bitti: false, bitir: false, cevap: false, dur: false,
               altyazi: false, takip: false, tek: null, durdu: null, onceT: 0, raf: 0, imza: '', yi: -1 };
    try { ZS.takip = localStorage.getItem('kidefZsTakip') === '1'; } catch (e) { }
    function zsSn(v) { return v !== null && v !== '' && isFinite(+v) && +v >= 0 && +v <= 36000; }
    function zsMetin(v) { return typeof v === 'string' && v.trim() ? v.trim() : ''; }
    function zsParcalar(a) {
      var z = a && a.zs;
      if (!z || typeof z !== 'object' || !Array.isArray(z.parca)) return [];
      return z.parca.filter(function (p) { return !!p && typeof p === 'object' && zsSn(p.b) && zsSn(p.s) && +p.s > +p.b; })
        .sort(function (x, y) { return x.b - y.b; });
    }
    function zsYazilar(a) {
      var z = a && a.zs;
      if (!z || typeof z !== 'object' || !Array.isArray(z.yazi)) return [];
      return z.yazi.filter(function (y) { return !!y && typeof y === 'object' && zsSn(y.b) && zsSn(y.s) && +y.s > +y.b && !!(zsMetin(y.ar) || zsMetin(y.tr)); })
        .sort(function (x, y) { return x.b - y.b; });
    }
    function zsVar(a) { return zsParcalar(a).length > 0 || zsYazilar(a).length > 0; }
    function zsCerceveli(p) { return !!p && isFinite(+p.x1) && isFinite(+p.x2) && isFinite(+p.y1) && isFinite(+p.y2) && +p.x2 > +p.x1 && +p.y2 > +p.y1; }
    function zsCevapli(p) { return !!(p && (zsMetin(p.ar) || zsMetin(p.tr) || ZS_M[p.m])); }
    function zsSayfasi(p) { return +p.sayfa >= 1 ? Math.floor(+p.sayfa) : ZS.s; }
    function zsMod() { return ZS.a && ZS.a.zs && ZS.a.zs.cevap === 'sonra' ? 'sonra' : 'dugme'; }
    /* çalara / yüzen videoya eklenen satırlar: altyazı (üstte) ve konum çubuğu (altta) */
    function zsAracHtml() {
      var t = function (ad, baslik, yazi) {
        return '<button type="button" class="zs-t' + (yazi ? ' zs-anah' : '') + '" data-zs="' + ad + '" title="' + baslik + '" aria-label="' + baslik + '">' + ZS_IK[ad] + (yazi ? '<span>' + yazi + '</span>' : '') + '</button>';
      };
      return '<div class="zs-ust" hidden><div class="zs-yazi" aria-live="polite"></div></div>' +
        '<div class="zs-cubuk" hidden>' + t('onceki', 'Önceki konum') + '<span class="zs-sayac" aria-live="polite"></span>' + t('sonraki', 'Sonraki konum') +
        '<span class="zs-ara"></span>' +
        t('dur', 'Her konumdan sonra dursun (öğrenci yazsın) — ▶ ya da ⏭ ile devam', 'Dur') +
        t('takip', 'Takip: görünüm yanan çerçeveye büyüsün (bu cihazda hatırlanır)', 'Takip') +
        t('yazi', 'Altyazı: söylenen cümle', 'Yazı') +
        t('cevap', 'Cevapları göster / gizle', 'Cevaplar') + '</div>';
    }
    function zsAracBagla(kap) {
      if (!kap || kap._zs) return;
      kap._zs = 1;
      kap.addEventListener('click', function (e) {
        var b = e.target && e.target.closest ? e.target.closest('[data-zs]') : null;
        if (!b || !kap.contains(b) || !ZS.a || ZS.kap !== kap) return;
        e.preventDefault(); e.stopPropagation();
        var n = b.getAttribute('data-zs');
        if (n === 'onceki') { zsOnceki(); return; }
        if (n === 'sonraki') { zsSonraki(); return; }
        if (n === 'dur') ZS.dur = !ZS.dur;
        else if (n === 'takip') {
          ZS.takip = !ZS.takip;
          try { localStorage.setItem('kidefZsTakip', ZS.takip ? '1' : '0'); } catch (x) { }
          if (ZS.takip && ZS.k >= 0) zsTakipEt(ZS.k);
        }
        else if (n === 'yazi') ZS.altyazi = !ZS.altyazi;
        else if (n === 'cevap') ZS.cevap = !ZS.cevap;
        zsGuncelle(true);
      });
    }
    function zsAnah(cub, ad, acik, gor) {
      var b = cub.querySelector('[data-zs="' + ad + '"]'); if (!b) return;
      b.hidden = !gor; b.setAttribute('aria-pressed', acik ? 'true' : 'false');
    }
    function zsAracYaz() {
      var kap = ZS.kap; if (!kap) return;
      var cub = kap.querySelector('.zs-cubuk'), ust = kap.querySelector('.zs-ust'), el = ZS.el, n = ZS.P.length;
      if (!cub) return;
      cub.hidden = false; kap.classList.add('zs-var');
      var say = cub.querySelector('.zs-sayac'), bekle = !!(el && el.paused && ZS.durdu != null && ZS.durdu === ZS.k && !ZS.bitti);
      say.textContent = !n ? '' : ZS.bitti ? '✓ ' + n + ' / ' + n : (ZS.k >= 0 ? (ZS.k + 1) + ' / ' + n : '– / ' + n);
      say.classList.toggle('zs-bekle', bekle);
      say.title = bekle ? 'Durdu — yazma zamanı; ▶ ya da ⏭ ile devam' : 'Konum';
      [].forEach.call(cub.querySelectorAll('[data-zs="onceki"], [data-zs="sonraki"], .zs-sayac'), function (b) { b.hidden = !n; });
      zsAnah(cub, 'dur', ZS.dur, n > 0);
      zsAnah(cub, 'takip', ZS.takip, ZS.P.some(zsCerceveli));
      zsAnah(cub, 'yazi', ZS.altyazi, ZS.Y.length > 0);
      zsAnah(cub, 'cevap', ZS.cevap, ZS.P.some(zsCevapli));
      if (ust) {
        ust.hidden = !(ZS.Y.length && ZS.altyazi);
        var y = ZS.yi >= 0 ? ZS.Y[ZS.yi] : null, d = ust.querySelector('.zs-yazi');
        var h = y ? (zsMetin(y.ar) ? '<span class="zs-ar" dir="rtl" lang="ar">' + kkEsc(zsMetin(y.ar)) + '</span>' : '') + (zsMetin(y.tr) ? '<span class="zs-tr">' + kkEsc(zsMetin(y.tr)) + '</span>' : '') : '';
        if (d && d._h !== h) { d._h = h; d.innerHTML = h || '<span class="zs-bos">…</span>'; }
      }
    }
    function zsAracGizle(kap) {
      if (!kap) return;
      [].forEach.call(kap.querySelectorAll('.zs-cubuk, .zs-ust'), function (e) { e.hidden = true; });
      kap.classList.remove('zs-var');
    }
    /* sayfadaki çerçeveler */
    function zsCerceveSil() {
      [].forEach.call(document.querySelectorAll('.yuz > .zs-c, .yuz > .zs-isaret'), function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
    }
    function zsYaziBoyu(y) { return Math.max(8, (y.offsetWidth || 600) * 0.017) + 'px'; }
    function zsCercevelerKur() {
      zsCerceveSil();
      ZS.P.forEach(function (p, i) {
        if (!zsCerceveli(p)) return;
        var y = kkYuz(zsSayfasi(p)); if (!y) return;
        var el = document.createElement('div');
        el.className = 'zs-c zs-gelecek'; el.setAttribute('data-k', String(i)); el.setAttribute('data-hal', 'gelecek'); el.setAttribute('role', 'button');
        el.title = (i + 1) + '. konum — dokun: bu parça yeniden çalsın'; el.setAttribute('aria-label', el.title);
        dsKonum(el, p);
        el.style.fontSize = zsYaziBoyu(y);
        el.innerHTML = '<b class="zs-no">' + (i + 1) + '</b>';
        el.addEventListener('pointerdown', function (e) { e.stopPropagation(); el._zs = { x: e.clientX, y: e.clientY, t: Date.now() }; });   /* yaprak sürüklenmesin */
        el.addEventListener('click', function (e) {
          e.preventDefault(); e.stopPropagation();
          var b = el._zs; el._zs = null;
          if (b && (Math.hypot(e.clientX - b.x, e.clientY - b.y) > 12 || Date.now() - b.t > 900)) return;   /* sürükleme / uzun basış */
          zsTek(i);
        });
        y.appendChild(el);
      });
      ZS.imza = '';
    }
    function zsSvg(y) {
      for (var n = y.firstChild; n; n = n.nextSibling) if (n.nodeType === 1 && n.getAttribute('class') === 'zs-isaret') return n;
      var v = document.createElementNS(KK_NS, 'svg');
      v.setAttribute('class', 'zs-isaret'); v.setAttribute('viewBox', '0 0 ' + KK_EN + ' ' + KK_BOY); v.setAttribute('preserveAspectRatio', 'none');
      v.setAttribute('aria-hidden', 'true'); v.setAttribute('focusable', 'false');
      y.appendChild(v);
      return v;
    }
    function zsIsaretKoy(y, i, c) {                                 /* ✓ ✗ ◯ (dokunma alanlarıyla aynı çizim) */
      var v = zsSvg(y), g = v.querySelector('g[data-k="' + i + '"]');
      if (g) v.removeChild(g);
      if (!c) return;
      g = ceG(c);
      g.setAttribute('class', 'kk-ce' + (c.a === 'T' && c.d === 'c' ? ' ds-ciz' : ''));
      g.setAttribute('data-k', String(i));
      v.appendChild(g); dsIsaretCiz(g);
    }
    function zsCevapGoster(y, el, p, i, acik) {
      if (el.classList.contains('zs-cevapli') === acik) return;
      el.classList.toggle('zs-cevapli', acik);
      var cv = el.querySelector('.zs-cv');
      if (!acik) { if (cv) el.removeChild(cv); zsIsaretKoy(y, i, null); return; }
      var h = '';
      if (zsMetin(p.ar)) h += '<div class="ds-ar" dir="rtl" lang="ar">' + kkEsc(zsMetin(p.ar)) + '</div>';
      if (zsMetin(p.tr)) h += '<div class="ds-tr">' + kkEsc(zsMetin(p.tr)) + '</div>';
      if (h) {
        cv = document.createElement('div'); cv.className = 'zs-cv'; cv.setAttribute('aria-hidden', 'true');
        cv.innerHTML = '<div class="dk-yazi">' + h + '</div>';
        el.appendChild(cv); dkYaziOlc(cv, y);
      }
      if (ZS_M[p.m]) zsIsaretKoy(y, i, dkIsaretKaydi(p));
    }
    function zsCercevelerYaz() {
      var mod = zsMod(), k = ZS.k, bitti = ZS.bitti;
      ZS.P.forEach(function (p, i) {
        if (!zsCerceveli(p)) return;
        var y = kkYuz(zsSayfasi(p)), el = y && y.querySelector('.zs-c[data-k="' + i + '"]');
        if (!el) return;
        var hal = (bitti || (k >= 0 && i < k)) ? 'gecti' : (i === k ? 'simdi' : 'gelecek');
        if (el.getAttribute('data-hal') !== hal) {
          el.setAttribute('data-hal', hal);
          el.classList.toggle('zs-simdi', hal === 'simdi'); el.classList.toggle('zs-gecti', hal === 'gecti'); el.classList.toggle('zs-gelecek', hal === 'gelecek');
        }
        zsCevapGoster(y, el, p, i, zsCevapli(p) && (ZS.cevap || (mod === 'sonra' && hal === 'gecti')));
      });
    }
    /* oynatma: çalan yer → yanan çerçeve, parça sonunda durma, altyazı */
    function zsGuncelle(zorla) {
      var el = ZS.el; if (!ZS.a || !el) return;
      var P = ZS.P, n = P.length, t = +el.currentTime || 0, k = -1, i;
      for (i = 0; i < n; i++) { if (+P[i].b <= t + 0.03) k = i; else break; }
      if (!el.paused && k >= 0 && (ZS.dur || ZS.tek === k) && ZS.durdu !== k) {
        var son = +P[k].s;
        if (ZS.onceT < son - 0.01 && t >= son - 0.04) {            /* parçanın sonu geçildi: dur (yazma zamanı) */
          ZS.durdu = k; ZS.tek = null;
          try { el.pause(); } catch (e) { }
          if (t > son + 0.15) { try { el.currentTime = son; } catch (e) { } t = son; }   /* arka planda geç kalındıysa geri */
        }
      }
      if (!el.paused) ZS.onceT = t;
      var bitti = !!(ZS.bitir || el.ended || (n && t >= +P[n - 1].s + 2));
      if (bitti) k = -1;
      var yi = -1;
      for (i = 0; i < ZS.Y.length; i++) if (+ZS.Y[i].b <= t + 0.03 && t < +ZS.Y[i].s) yi = i;
      var imza = [k, bitti ? 1 : 0, ZS.cevap ? 1 : 0, ZS.dur ? 1 : 0, ZS.takip ? 1 : 0, ZS.altyazi ? 1 : 0, yi, el.paused ? 1 : 0, ZS.durdu].join('|');
      if (!zorla && imza === ZS.imza) return;
      ZS.imza = imza;
      var yeniK = k !== ZS.k;
      ZS.k = k; ZS.bitti = bitti; ZS.yi = yi;
      zsCercevelerYaz(); zsAracYaz();
      if (yeniK && ZS.takip && k >= 0) zsTakipEt(k);
    }
    function zsDongu() {
      if (ZS.raf) return;
      var ileri = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
      var adim = function () {
        ZS.raf = 0;
        if (!ZS.el) return;
        zsGuncelle();
        if (ZS.el && !ZS.el.paused) ZS.raf = ileri(adim);
      };
      ZS.raf = ileri(adim);
    }
    function zsOlayBagla(el) {
      if (!el || el._zs) return;
      el._zs = 1;
      el.addEventListener('play', function () { if (ZS.el !== el) return; ZS.onceT = +el.currentTime || 0; zsDongu(); zsGuncelle(true); });
      ['pause', 'ended', 'timeupdate', 'loadedmetadata'].forEach(function (ev) { el.addEventListener(ev, function () { if (ZS.el === el) zsGuncelle(); }); });
      el.addEventListener('seeking', function () {
        if (ZS.el !== el) return;
        var t = +el.currentTime || 0, P = ZS.P;
        ZS.onceT = t;
        if (ZS.durdu != null && P[ZS.durdu] && t < +P[ZS.durdu].s - 0.05) ZS.durdu = null;
        if (ZS.bitir && P.length && t < +P[P.length - 1].s) ZS.bitir = false;
      });
      el.addEventListener('seeked', function () { if (ZS.el === el) { ZS.onceT = +el.currentTime || 0; zsGuncelle(); } });
    }
    function zsGit(t, cal) {
      var el = ZS.el; if (!el) return;
      ZS.durdu = null; ZS.bitir = false;
      t = Math.max(0, +t || 0);
      try { el.currentTime = t; } catch (e) { }
      ZS.onceT = t;
      if (ZS.kap && ZS.kap.hidden) ZS.kap.hidden = false;
      if (cal) { var p = el.play(); if (p && p.catch) p.catch(function () { }); }
      zsGuncelle(true);
    }
    function zsTek(i) {                                               /* çerçeveye dokununca: o parça, sonunda durur */
      var p = ZS.P[i]; if (!p || !ZS.el) return;
      zsGit(+p.b - 0.02, true);
      ZS.tek = i;
    }
    function zsOnceki() {
      var P = ZS.P, el = ZS.el; if (!P.length || !el) return;
      var k = ZS.bitti ? P.length : ZS.k, t = +el.currentTime || 0;
      var i = (k >= 0 && k < P.length && t - +P[k].b > 1.2) ? k : Math.max(0, (k < 0 ? 0 : k) - 1);
      zsGit(+P[i].b - 0.02, true);
    }
    function zsSonraki() {
      var P = ZS.P, el = ZS.el; if (!P.length || !el || ZS.bitti) return;
      if (ZS.k < P.length - 1) { zsGit(+P[ZS.k + 1].b - 0.02, true); return; }
      ZS.bitir = true; ZS.durdu = null; ZS.tek = null;            /* sonuncudan ileri: bitti, bütün çerçeveler geçti */
      try { el.pause(); } catch (e) { }
      zsGuncelle(true);
    }
    function zsTakipEt(i) {                                           /* görünüm yanan çerçeveye (çevresiyle) büyür */
      var p = ZS.P[i]; if (!zsCerceveli(p) || dsIzleyen()) return;
      var s = zsSayfasi(p); if (kkGorunen().indexOf(s) < 0) return;
      var x1 = dsYuzde(p.x1, 0), x2 = dsYuzde(p.x2, 100), y1 = dsYuzde(p.y1, 0), y2 = dsYuzde(p.y2, 100);
      var cx = (x1 + x2) / 2, cy = (y1 + y2) / 2, w = Math.max(x2 - x1 + 16, 60), h = Math.max(y2 - y1 + 14, 38);
      try { dsYakinlas(s, { x1: Math.max(0, cx - w / 2), x2: Math.min(100, cx + w / 2), y1: Math.max(0, cy - h / 2), y2: Math.min(100, cy + h / 2) }); } catch (e) { }
    }
    function zsBasla(s, j, a, el, kap) {
      zsBitir();
      var z = a.zs || {};
      ZS.a = a; ZS.s = +s; ZS.j = +j; ZS.P = zsParcalar(a); ZS.Y = zsYazilar(a); ZS.el = el; ZS.kap = kap;
      ZS.dur = z.dur === true; ZS.altyazi = z.altyazi === true; ZS.cevap = false;
      ZS.k = -2; ZS.bitti = false; ZS.bitir = false; ZS.tek = null; ZS.durdu = null; ZS.onceT = +el.currentTime || 0; ZS.imza = ''; ZS.yi = -1;
      zsOlayBagla(el); zsAracBagla(kap);
      zsCercevelerKur(); zsGuncelle(true);
      if (!el.paused) zsDongu();
      ksTazele();                                                      /* 18. bölüm: konumlar çubukta */
    }
    function zsBitir() {
      zsAracGizle(ZS.kap);
      zsCerceveSil();
      ZS.a = null; ZS.el = null; ZS.kap = null; ZS.P = []; ZS.Y = []; ZS.k = -2; ZS.imza = ''; ZS.tek = null; ZS.durdu = null;
      ksTazele();
    }
    function zsYenile() {                                             /* veri değişti (önizleme): çalan kayıt yeniden okunur */
      if (!ZS.a) return;
      var a = mdListe(ZS.s)[ZS.j];
      if (!mdGecerli(a) || a.dosya !== ZS.a.dosya || !zsVar(a)) { var el = ZS.el; zsBitir(); if (el && el === MD.ses) mdCalanIsaretle(); return; }
      var eski = ZS.a.zs || {}, yeni = a.zs || {};
      ZS.a = a; ZS.P = zsParcalar(a); ZS.Y = zsYazilar(a);
      if ((eski.dur === true) !== (yeni.dur === true)) ZS.dur = yeni.dur === true;
      if ((eski.altyazi === true) !== (yeni.altyazi === true)) ZS.altyazi = yeni.altyazi === true;
      zsCercevelerKur(); zsGuncelle(true);
    }
    /* zs'li video: sürüklenen küçük pencere (sayfa görünür kalır) */
    function zsYvKur() {
      var o = document.getElementById('mdYv'); if (o) return o;
      o = document.createElement('div'); o.id = 'mdYv'; o.className = 'md-yv'; o.hidden = true;
      o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'Video');
      o.innerHTML = '<div class="md-yv-bas" title="Sürükle: pencereyi taşı"><span class="md-yv-ad">Video</span>' +
        '<button type="button" class="md-yv-x" aria-label="Videoyu kapat">&times;</button></div><video controls playsinline preload="metadata"></video>' + zsAracHtml();
      document.body.appendChild(o);
      var yvv = o.querySelector('video'); ksBagla(yvv, o, false, yvv.nextElementSibling);   /* 18. bölüm: videonun altında */
      o.querySelector('.md-yv-x').addEventListener('click', function (e) { e.stopPropagation(); mdYvKapat(); });
      var bas = o.querySelector('.md-yv-bas'), sur = null;
      bas.addEventListener('pointerdown', function (e) {
        if (e.target.closest('button')) return;
        var r = o.getBoundingClientRect(); sur = { x: e.clientX - r.left, y: e.clientY - r.top };
        try { bas.setPointerCapture(e.pointerId); } catch (x) { }
        e.preventDefault();
      });
      bas.addEventListener('pointermove', function (e) {
        if (!sur) return;
        var w = o.offsetWidth, h = o.offsetHeight;
        o.style.left = Math.max(4, Math.min(window.innerWidth - w - 4, e.clientX - sur.x)) + 'px';
        o.style.top = Math.max(4, Math.min(window.innerHeight - h - 4, e.clientY - sur.y)) + 'px';
        o.style.right = 'auto'; o.style.bottom = 'auto';
      });
      var bit = function () { sur = null; };
      bas.addEventListener('pointerup', bit); bas.addEventListener('pointercancel', bit);
      o.querySelector('video').addEventListener('error', function () { if (this.getAttribute('src')) kkTost('Video açılamadı'); });
      return o;
    }
    function mdYvKapat() {
      var o = document.getElementById('mdYv'); if (!o) return;
      var v = o.querySelector('video');
      if (ZS.el === v) zsBitir();
      try { v.pause(); } catch (e) { }
      v.removeAttribute('src'); v.removeAttribute('data-yol'); try { v.load(); } catch (e) { }
      o.hidden = true;
    }
    function zsVideo(s, j, a) {
      var o = zsYvKur(), v = o.querySelector('video'), yol = mdYol(a);
      if (!o.hidden && v.getAttribute('data-yol') === yol && !v.paused) { v.pause(); return; }   /* yine dokununca durur */
      if (MD.ses && !MD.ses.paused) MD.ses.pause();
      var k = mdKitapSes(); if (k && !k.paused) k.pause();
      var kv = document.getElementById('videoOyn'); if (kv && !kv.paused) kv.pause();
      o.querySelector('.md-yv-ad').textContent = mdAd(a) + ' · ' + kkSayfaAdi(s);
      if (v.getAttribute('data-yol') !== yol) { v.setAttribute('data-yol', yol); v.src = yol; }
      o.hidden = false;
      if (!ZS.a || ZS.el !== v || ZS.s !== +s || ZS.j !== +j) zsBasla(s, j, a, v, o);
      var p = v.play(); if (p && p.catch) p.catch(function () { });
    }
    window.addEventListener('resize', function () {
      [].forEach.call(document.querySelectorAll('.yuz > .zs-c'), function (el) {
        var y = el.parentNode; if (!y) return;
        el.style.fontSize = zsYaziBoyu(y);
        var cv = el.querySelector('.zs-cv'); if (cv) dkYaziOlc(cv, y);
      });
    });
    var zsDis = {
      parcalar: zsParcalar, yazilar: zsYazilar, git: function (t, cal) { zsGit(t, !!cal); }, tek: zsTek, onceki: zsOnceki, sonraki: zsSonraki,
      ayar: function (ad, v) { if (ad === 'dur' || ad === 'takip' || ad === 'altyazi' || ad === 'cevap') { if (v !== undefined) { ZS[ad] = !!v; zsGuncelle(true); } return ZS[ad]; } return null; },
      durum: function () {
        var el = ZS.el, y = ZS.yi >= 0 ? ZS.Y[ZS.yi] : null;
        return { aktif: !!ZS.a, s: ZS.s, j: ZS.j, n: ZS.P.length, k: ZS.k, bitti: ZS.bitti, cevap: ZS.cevap, dur: ZS.dur, takip: ZS.takip, altyazi: ZS.altyazi,
                 t: el ? +el.currentTime : null, calan: !!(el && !el.paused), durdu: ZS.durdu, video: !!(el && el.tagName === 'VIDEO'), yazi: y ? (zsMetin(y.ar) || zsMetin(y.tr)) : '' };
      }
    };


    /* --------------------------------------------------------------
       18) İLERLEME ÇUBUĞU · KISIMLAR                        (31.10.2026)
       Öğretmen: "kitapta bi ses veya video açıldığında aşağıda kalın bi
       ilerleme çubuğu görünsün ... bu ilerleme çubuğunda her ses veya video
       içindeki kısma tıklayarak gidebilelim, örneğin bi ses var ve bu sesin
       ilk kısmı yönerge seslendirmesi ama diğer kısmında 3 soru için soru ve
       cevap kısmı için ipucu var bu ilerleme çubuğunda 3 kısma tıklanabilir
       olsun ... bu kısımlar hem o içeriğin interaktivitesi için hem ses ve
       videoda geriye almak için güzel bi dokunsal alan olsun".
       · icindekiler.js (herkese açık; Ders Tezgâhı'nın sayfa şeridinde
         «Kısımlar» yazar): kisim["<dosya>"] = [{b, s (sn), ad?}]. Anahtar
         sesin / videonun yolu — kitabın kendi kaynakları (veri.js'teki yol)
         da, eklenen medya (medya/…) da; dosya nerede çalarsa aynı kısımlar.
       · Kitabın ses çaları (#calar), eklenen sesin çaları (#mdCalar), video
         penceresi (#pVideo), yüzen video (#mdYv): kalın çubuk — dokun: oraya
         git, sürükle: ileri / geri sar. Kısımlar çubukta adlarıyla; kısma
         dokununca o kısmın başından çalar; çalan kısım yanar, geçenler
         koyulaşır. Kısım yoksa dinleme
         etkinliğinin konumları (17. bölüm) numaralı (dokununca o konum çalar,
         sonunda durur); o da yoksa yalnız çubuk.
       · Seste çubuğun yanında ▶ / ❚❚ ve süre (tarayıcının ince çubuğu
         gizlenir); videoda tarayıcının denetimleri de kalır (tam ekran).
       · Sınıf Ekranı: kısma ve ▶'e dokunuş kabuktan yinelenir (tahtada da
         aynı kısım); çubukta sürükleme yalnız dokunulan cihazda.
       · KISIM VURGUSU (31.10.2026) — öğretmen: "yönerge kısmı okunduğunda
         yönerge cümlesine vurgu eklemek istiyorum, sonra cümlelere geçtiğinde
         ilgili cümleye görsel vurgu eklemek istiyorum ... amacımız
         öğrencilerin tüm dikkatini sürekli flipbookta tutmak". Kısımda
         x1, y1, x2, y2 (% sayfa) ve sayfa (flip no) varsa ses çalarken o
         kısmın yeri sayfada parlar: açık sayfaların kalanı (karşı sayfa da)
         hafifçe kararır (spot ışığı), kısım değişince vurgu yeni yere kayar;
         iki kısım arasındaki sessizlikte bir öncekinde kalır. Vurguya
         dokununca o kısım yeniden çalar. Ses durunca yerinde durur; çalar
         kapanınca / ses bitince kalkar. Seste ve yüzen videoda (sayfa
         görünür); video penceresinde yok (sayfayı örter). Yeri Ders
         Tezgâhı'nda kısım kısım sayfaya çizilir.
       · KISIM NUMARASI (31.10.2026) — öğretmen: "ses için kitaba eklediğimiz
         çizgilerde de numara olsun": vurgunun köşesinde kısmın numarası.
       · SESLE İLERLEME (31.10.2026) — ders modunda bir sesin adımı çalarken
         şeritte o sesin süresine düşen adımlar (2. yakınlaşma…) zamanı gelince
         kendiliğinden gelir (dsSesle).
       · DERS MODU SADE (01.11.2026) — öğretmen: "ders modunda yan menü
         görünmesin" · "ders moduna geçince normalde sağda ve solda olan ileri
         geri okları, dersin ileri geri adımları için çalışsın, zaten oklar
         var, yeni bi oka gerek yok": ders çubuğu açıkken araç çubuğu (yanda;
         telefonda üstte / altta) ve renkli şerit gizli, kitap bütün ekranı
         kullanır (görünüm korunur, adımın yakınlaşması yeni ölçüye göre);
         çubukta ◀ ▶ yok — kenardaki sayfa okları adım adım ilerletir,
         adları «Sonraki adım / Önceki adım». Ders kapanınca eski hâli.
       · DERS KÖŞE (01.11.2026) — öğretmen: "çarpı da köşede bi yerde olsun,
         sayfanın en altına gelince ilerleme çubuğu ekranı çok fazla
         engellemesin": ders çubuğu (adım bilgisi, ✕ en köşede) sağ üst
         köşede; ders açıkken ses çubuğu en altta, tek satır (▶ · kısımlar ·
         süre · ×) ve kitap onun üstünde biter — yakınlaşma da aşağı kaydırma
         da çubuğun üstünde kalır (dsAlt…).
       -------------------------------------------------------------- */
    var KS = { L: [], v: 0, raf: 0 };
    var KS_IK = {
      oyn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.6v12.8L18.6 12z"/></svg>',
      dur: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.2" y="5.2" width="4.1" height="13.6" rx="1.2"/><rect x="13.7" y="5.2" width="4.1" height="13.6" rx="1.2"/></svg>'
    };
    function ksVeri() { var V = icVeri(); return (V && V.kisim && typeof V.kisim === 'object') ? V.kisim : null; }
    function ksAnah(y) {                                              /* dosyanın kimliği: tam adres (materyal deposunda yolun kuyruğu) */
      var t = String(y || '');
      try { t = new URL(t, location.href).href; } catch (e) { }
      t = t.replace(/[?#].*$/, '');
      var m = /\/(kidefarapca-materyal-[^\/]+\/.+)$/.exec(t);
      return m ? 'm:' + m[1] : t;
    }
    function ksKisimlar(src) {                                        /* çalan dosyanın kısımları (sıralı, geçerli olanlar) */
      var V = ksVeri(); if (!V || !src) return [];
      var a = ksAnah(src), L = null;
      Object.keys(V).some(function (k) { if (ksAnah(k) === a) { L = V[k]; return true; } return false; });
      if (!Array.isArray(L)) return [];
      return L.filter(function (p) { return !!p && typeof p === 'object' && zsSn(p.b) && zsSn(p.s) && +p.s > +p.b; })
        .map(function (p) {
          var o = { b: +p.b, s: +p.s, ad: zsMetin(p.ad).slice(0, 60) };
          if (zsCerceveli(p) && +p.sayfa >= 1) {                     /* KISIM VURGUSU: sayfadaki yeri */
            o.x1 = dsYuzde(p.x1, 0); o.y1 = dsYuzde(p.y1, 0); o.x2 = dsYuzde(p.x2, 100); o.y2 = dsYuzde(p.y2, 100); o.sayfa = Math.floor(+p.sayfa);
          }
          return o;
        })
        .sort(function (x, y) { return x.b - y.b; });
    }
    function ksSaat(t) { t = Math.max(0, Math.floor(+t || 0)); var m = Math.floor(t / 60), s = t - m * 60; return m + ':' + (s < 10 ? '0' : '') + s; }
    function ksCal(el) { var p; try { p = el.play(); } catch (e) { p = null; } if (p && p.catch) p.catch(function () { }); }
    /* çubuğu bir oynatıcıya bağla (bir kez): ses = kendi ▶ ve süresi, tarayıcının çubuğu gizli; once = çubuk neyin önüne */
    function ksBagla(el, kap, ses, once) {
      if (!el || !kap) return null;
      if (el._ks) return el._ks;
      var K = { el: el, kap: kap, ses: !!ses, P: [], konum: false, src: null, v: -1, zp: null, d: -1, i: -2, gec: -2, kb: null, oy: null, sn: '', sur: null, yut: 0,
                vel: null, vimza: '', kel: null, kno: 0, sayfaGor: !!ses || kap.id === 'mdYv' };   /* vurgu: sayfa görünürken (ses, yüzen video) */
      var alan = document.createElement('div');
      alan.className = 'ks-alan';
      alan.innerHTML = '<div class="ks-cubuk" role="slider" aria-label="İlerleme — dokun: oraya git, sürükle: ileri / geri sar" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0">' +
        '<div class="ks-ic"><div class="ks-dolu"></div><div class="ks-kisimlar"></div></div><div class="ks-imlec"></div></div>';
      K.alan = alan; K.cub = alan.firstChild; K.dolu = alan.querySelector('.ks-dolu'); K.kis = alan.querySelector('.ks-kisimlar'); K.imlec = alan.querySelector('.ks-imlec');
      K.sureEl = document.createElement('span'); K.sureEl.className = 'ks-sure'; K.sureEl.textContent = '0:00';
      if (ses) {
        var x = null, c;
        for (c = kap.firstElementChild; c; c = c.nextElementSibling) if (c.classList.contains('kapat')) { x = c; break; }
        K.oyn = document.createElement('button'); K.oyn.type = 'button'; K.oyn.className = 'ks-oyn'; K.oyn.innerHTML = KS_IK.oyn;
        K.oyn.setAttribute('aria-label', 'Oynat'); K.oyn.title = 'Oynat / duraklat';
        kap.insertBefore(K.oyn, x); kap.insertBefore(K.sureEl, x);
        kap.appendChild(alan);
        kap.classList.add('ks-ses');
        K.oyn.addEventListener('click', function (e) {
          e.preventDefault(); e.stopPropagation();
          if (el.paused || el.ended) ksCal(el); else el.pause();
        });
      } else {
        alan.appendChild(K.sureEl);
        kap.insertBefore(alan, once && once.parentNode === kap ? once : null);
      }
      el._ks = K; KS.L.push(K);
      ['loadstart', 'emptied', 'loadedmetadata', 'durationchange', 'timeupdate', 'play', 'playing', 'pause', 'ended', 'seeked'].forEach(function (ev) {
        el.addEventListener(ev, function () { ksGuncelle(K); if (ev === 'play' || ev === 'playing') ksDongu(); });
      });
      ksSurukleBagla(K);
      ksGuncelle(K, true);
      return K;
    }
    function ksCiz(K) {                                               /* kısımlar çubukta (ölçek değişince yeniden) */
      var d = K.d, h = '';
      if (d > 0) K.P.forEach(function (p, i) {
        var a = Math.max(0, Math.min(100, p.b / d * 100)), b = Math.max(a, Math.min(100, p.s / d * 100));
        if (!(b - a > 0)) return;
        var ad = K.konum ? String(i + 1) : (p.ad || String(i + 1));
        var bas = (K.konum ? (i + 1) + '. konum' : (p.ad || (i + 1) + '. kısım')) + ' · ' + ksSaat(p.b) + '–' + ksSaat(p.s) + (K.konum ? ' — dokun: bu konum çalsın' : ' — dokun: buradan çal');
        h += '<button type="button" class="ks-k' + (K.konum ? ' ks-konum' : '') + (p.ad ? '' : ' ks-adsiz') + '" data-ki="' + i + '" style="left:' + a.toFixed(3) + '%;width:' + (b - a).toFixed(3) + '%" title="' +
          kkEsc(bas) + '" aria-label="' + kkEsc(bas) + '"><span>' + kkEsc(ad) + '</span></button>';
      });
      K.kis.innerHTML = h; K.i = -2; K.gec = -2; K.kb = null;
    }
    function ksGuncelle(K, zorla) {
      if (!K) return;
      var el = K.el, src = el.getAttribute('src') || '', zp = (ZS.el === el && ZS.P.length) ? ZS.P : null, P, i;
      if (zorla || src !== K.src || K.v !== KS.v || zp !== K.zp) {    /* dosya / veri / dinleme etkinliği değişti */
        K.src = src; K.v = KS.v; K.zp = zp;
        var L = ksKisimlar(src);
        K.konum = !L.length && !!zp;
        K.P = L.length ? L : (zp ? zp.map(function (p) { return { b: +p.b, s: +p.s, ad: '' }; }) : []);
        K.d = -1;
        K.kap.classList.toggle('ks-kisimli', K.P.length > 0);
      }
      P = K.P;
      var d = isFinite(el.duration) && el.duration > 0 ? +el.duration : 0;
      if (!d) for (i = 0; i < P.length; i++) if (P[i].s > d) d = P[i].s;   /* süre henüz bilinmiyor: kısımların sonu */
      if (d !== K.d) { K.d = d; ksCiz(K); }
      var t = (K.sur && K.sur.oldu && K.sur.t != null) ? K.sur.t : (+el.currentTime || 0), o = d > 0 ? Math.max(0, Math.min(1, t / d)) : 0;
      K.dolu.style.width = (o * 100).toFixed(2) + '%';
      K.imlec.style.left = (o * 100).toFixed(2) + '%';
      var k = -1, g = 0;
      for (i = 0; i < P.length; i++) if (P[i].b <= t + 0.05) { g = i + 1; if (t < P[i].s - 0.02) k = i; }
      if (k !== K.i || g !== K.gec) {
        K.i = k; K.gec = g; K.kb = null;
        [].forEach.call(K.kis.children, function (b) {
          var j = +b.getAttribute('data-ki'), p = P[j];
          b.classList.toggle('simdi', j === k);
          b.classList.toggle('gecti', j !== k && !!p && p.s <= t + 0.05);
          if (j === k) K.kb = b;
        });
      }
      if (K.kb && P[k]) K.kb.style.setProperty('--ki', Math.max(0, Math.min(100, (t - P[k].b) / Math.max(0.01, P[k].s - P[k].b) * 100)).toFixed(1) + '%');   /* çalan kısım kendi içinde dolar */
      var vj = -1;                                                     /* KISIM VURGUSU: çalan (arada: bir önceki) kısmın yeri */
      if (K.sayfaGor && ksAcik(K)) { vj = k >= 0 ? k : (g > 0 && !el.ended ? g - 1 : -1); if (vj >= 0 && !ksVurguVar(P[vj])) vj = -1; }
      ksVurguYaz(K, vj);
      var sn = d > 0 ? ksSaat(t) + ' / ' + ksSaat(d) : ksSaat(t);
      if (sn !== K.sn) {
        K.sn = sn; K.sureEl.textContent = sn;
        K.cub.setAttribute('aria-valuemax', String(Math.round(d))); K.cub.setAttribute('aria-valuenow', String(Math.floor(t))); K.cub.setAttribute('aria-valuetext', sn);
      }
      if (K.oyn) {
        var oy = !el.paused && !el.ended;
        if (oy !== K.oy) { K.oy = oy; K.oyn.innerHTML = oy ? KS_IK.dur : KS_IK.oyn; K.oyn.setAttribute('aria-label', oy ? 'Duraklat' : 'Oynat'); K.oyn.classList.toggle('calan', oy); }
      }
      if (!el.paused && !el.ended) dsSesle(K);                           /* SESLE İLERLEME: ders modunda ses çaldıkça adımlar */
    }
    /* SESLE İLERLEME (31.10.2026) — öğretmen: "yakınlaşma birden fazla eklenebiliyor ama ilk yakınlaşma bittiğinde ve 2.
       yakınlaşma başlaması gerekirken olmuyor". Ders modunda bir ses adımının sesi çalarken, Ders Tezgâhı'nın şeridinde o
       sesin süresine düşen sonraki adımlar (yakınlaşma, cevap ve işaretleri, not, örtü, dokunma, bağlantı, sonraki ses)
       zamanı gelince kendiliğinden gelir: ses çaldıkça ders ilerler. Öğretmen ileri / geri ile istediği adıma geçer; ders
       ancak sıradaki adımın zamanı gelince oradan sürer (geriye çekmez). Sesi kısımdan / çubuktan geri sarınca ders de o ana
       döner. Ses durunca bekler; sesten sonraki adımlara yine ileri ile. Şeritte zamanlanmamış sayfada (zm yok) yalnız ileri. */
    var DS_SESON = '', DS_SEST = { el: null, t: 0 };
    function dsSesZm(L) {                                            /* adımların zamanı (Tezgâh'ın szZm kuralı) */
      var t = null;
      return L.map(function (a) { var v = a && typeof a.zm === 'number' && isFinite(a.zm) ? a.zm : NaN; t = (v >= 0 && (t === null || v >= t)) ? v : (t === null ? 0 : t + 2); return t; });
    }
    function dsSesIsr(a, z0, ust) {                                  /* cevabın işaretlerinin zamanı (Tezgâh'ın szIsrSinir kuralı) */
      var t = z0, v = dsIsaretler(a).map(function (m) { var x = m && typeof m.zm === 'number' && isFinite(m.zm) ? m.zm : NaN; t = x >= t ? x : t + 0.8; return t; }), k;
      for (k = v.length - 1; k >= 0; k--) { var lim = k === v.length - 1 ? ust - 0.1 : v[k + 1]; if (v[k] > lim) v[k] = lim; if (v[k] < z0) v[k] = z0; }
      return v;
    }
    function dsSesAdimi(s, a, el) {                                  /* bu adımın sesi mi (el) çalıyor? */
      if (a.t === 'kaynak' && a.k != null) return el === mdKitapSes() && !!document.querySelector('.nokta.n-ses.calan[data-k="' + (+a.k) + '"]');
      if (a.t !== 'md') return false;
      var j = dsMedyaBul(s, a); if (j < 0) return false;
      if (MD.ses === el) return MD.sira === s + ':' + j;
      if (ZS.el === el) return ZS.s === s && ZS.j === j && !ZS.P.length;   /* dinleme etkinliği: ileri konum konum (dsZsAdim) */
      return false;
    }
    function dsSesle(K) {
      if (!DS.aktif || dsIzleyen() || !(DS.s >= 1)) return;
      var s = DS.s, L = dsAdimlar(s), el = K.el, i, i0 = -1;
      if (!L.length || DS.i < 0 || DS.i >= L.length || !L.some(function (a) { return typeof a.zm === 'number'; })) return;
      for (i = DS.i; i >= 0; i--) if ((L[i].t === 'kaynak' || L[i].t === 'md') && dsSesAdimi(s, L[i], el)) { i0 = i; break; }
      if (i0 < 0) return;
      var Z = dsSesZm(L), t = +el.currentTime || 0, T = Z[i0] + t + 0.05, j = i0;
      for (i = i0 + 1; i < L.length; i++) { if (Z[i] <= T) j = i; else break; }
      var IZ = dsSesIsr(L[j], Z[j], j + 1 < L.length ? Z[j + 1] : Infinity), n = 0;
      IZ.forEach(function (x) { if (x <= T) n++; });
      var m = Math.max(dsIsaretIlk(L[j]), n), geri = DS_SEST.el === el && t < DS_SEST.t - 0.3;   /* geri sarıldı */
      DS_SEST.el = el; DS_SEST.t = t;
      var imza = s + ':' + i0 + ':' + j + ':' + m;
      if (imza === DS_SESON) return;
      DS_SESON = imza;
      if (j === DS.i && m === DS.m) return;
      if (!geri && (j < DS.i || (j === DS.i && m < DS.m))) return;   /* öğretmen önde: zamanı gelince sürer, geri çekmez */
      if (j !== DS.i) dsAdimaGit(j, true, m); else dsIsaretAdim(m, true);
    }
    function ksVurguVar(p) { return !!p && p.sayfa >= 1 && isFinite(p.x1) && isFinite(p.x2) && isFinite(p.y1) && isFinite(p.y2) && p.x2 > p.x1 && p.y2 > p.y1; }
    function ksAcik(K) {                                              /* oynatıcı açık mı (kapatılmadı, gizli değil) */
      if (!K.src || K.kap.hidden) return false;
      return K.kap.classList.contains('panel') ? K.kap.classList.contains('acik') : true;
    }
    function ksVurguSil(K) {
      var el = K.vel; K.vel = null;
      if (el && el.parentNode && el.parentNode.parentNode) el.parentNode.parentNode.removeChild(el.parentNode);
    }
    function ksKarsi(s) {                                              /* iki sayfa açıkken vurgulu sayfanın karşısındaki açık sayfa */
      if (!s || flip.tekli || typeof flip.solSayfa !== 'function' || typeof flip.sagSayfa !== 'function') return 0;
      var a = flip.solSayfa(), b = flip.sagSayfa();
      return s === a ? (b || 0) : s === b ? (a || 0) : 0;
    }
    function ksKarsiYaz(K, s) {                                        /* karşı sayfa da aynı ölçüde kararır: dikkat vurguda kalsın */
      var ks = ksKarsi(s), e = K.kel;
      if (ks === K.kno && (!ks || (e && e.isConnected))) return;
      K.kno = ks; K.kel = null;
      if (e && e.parentNode) e.parentNode.removeChild(e);
      var y = ks ? kkYuz(ks) : null; if (!y) return;
      e = document.createElement('div'); e.className = 'ksv-perde ksv-karsi'; e.setAttribute('aria-hidden', 'true');
      y.appendChild(e); K.kel = e;
    }
    function ksVurguYaz(K, vj) {                                       /* sayfada vurgu: perde (sayfayı hafif karartır) + parlayan yer */
      var p = vj >= 0 ? K.P[vj] : null, imza = p ? [vj, p.sayfa, p.x1, p.y1, p.x2, p.y2].join('|') : '';
      if (imza !== K.vimza || (p && !(K.vel && K.vel.isConnected))) { K.vimza = imza; ksVurguKur(K, p, vj); }
      ksKarsiYaz(K, p && K.vel && K.vel.isConnected ? p.sayfa : 0);
    }
    function ksVurguKur(K, p, vj) {
      if (!p) { ksVurguSil(K); return; }
      var y = kkYuz(p.sayfa), el = K.vel;
      if (!y) { ksVurguSil(K); return; }
      if (!el || !el.isConnected || el.parentNode.parentNode !== y) {   /* bu sayfada yoksa: yeni perde */
        ksVurguSil(K);
        var perde = document.createElement('div');
        perde.className = 'ksv-perde';
        el = document.createElement('div'); el.className = 'ks-vurgu'; el.setAttribute('role', 'button');
        el.innerHTML = '<b class="ks-no" aria-hidden="true"></b>';    /* kısmın numarası (çubuktaki sırası) */
        perde.appendChild(el); y.appendChild(perde); K.vel = el;
        el.addEventListener('pointerdown', function (e) { e.stopPropagation(); el._ks = { x: e.clientX, y: e.clientY, t: Date.now() }; });   /* yaprak sürüklenmesin */
        el.addEventListener('click', function (e) {                    /* dokununca o kısım yeniden (Sınıf Ekranı'nda yinelenen tık da) */
          e.preventDefault(); e.stopPropagation();
          var b = el._ks; el._ks = null;
          if (b && (Math.hypot(e.clientX - b.x, e.clientY - b.y) > 12 || Date.now() - b.t > 900)) return;   /* sürükleme / uzun basış */
          var j = +el.getAttribute('data-j'); if (j >= 0) ksKisma(K, j);
        });
      }
      dsKonum(el, p);
      el.setAttribute('data-j', String(vj));
      el.firstChild.textContent = String(vj + 1);
      el.title = (p.ad || (vj + 1) + '. kısım') + ' — dokun: bu kısım yeniden çalsın';
      el.setAttribute('aria-label', el.title);
      el.classList.remove('ks-yeni'); void el.offsetWidth; el.classList.add('ks-yeni');   /* her yeni kısımda kısa parlama */
    }
    function ksDongu() {                                              /* çalarken akıcı (kare kare) */
      if (KS.raf) return;
      var ileri = window.requestAnimationFrame || function (f) { return setTimeout(f, 33); };
      var adim = function () {
        KS.raf = 0;
        var calan = false;
        KS.L.forEach(function (K) { if (!K.el.paused && !K.el.ended) { calan = true; ksGuncelle(K); } });
        if (calan) KS.raf = ileri(adim);
      };
      KS.raf = ileri(adim);
    }
    function ksYenile() { if (!KS) return; KS.v++; KS.L.forEach(function (K) { ksGuncelle(K, true); }); }   /* veri değişti (önizleme, yükleme) */
    function ksTazele() { if (!KS) return; KS.L.forEach(function (K) { ksGuncelle(K); }); }
    function ksT(K, x) {                                              /* çubukta x → saniye */
      var r = K.cub.getBoundingClientRect(), d = K.d;
      if (!(d > 0) || !(r.width > 0)) return null;
      return Math.max(0, Math.min(d, (x - r.left) / r.width * d));
    }
    function ksGit(K, t, cal) {
      var el = K.el; if (t == null || !isFinite(t)) return;
      if (ZS.el === el) zsGit(t, !!cal);                             /* dinleme etkinliği: kendi durma / konum hesabıyla */
      else { try { el.currentTime = t; } catch (e) { } if (cal && (el.paused || el.ended)) ksCal(el); }
      ksGuncelle(K);
    }
    function ksKisma(K, i) {                                          /* kısma dokunuldu: o kısmın başından çal */
      var p = K.P[i]; if (!p) return;
      if (K.konum && ZS.el === K.el && ZS.P[i]) { zsTek(i); ksGuncelle(K); return; }   /* konum: o parça, sonunda durur */
      ksGit(K, Math.max(0, p.b - 0.02), true);
    }
    function ksSurukleBagla(K) {
      var cub = K.cub;
      cub.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.stopPropagation();                                           /* sayfa / yaprak bu dokunuşu almasın */
        K.sur = { id: e.pointerId, x0: e.clientX, oldu: false, t: null, an: 0, kisim: !!(e.target && e.target.closest && e.target.closest('.ks-k')) };
      });
      cub.addEventListener('pointermove', function (e) {
        var S = K.sur; if (!S || S.id !== e.pointerId) return;
        if (!S.oldu) {
          if (Math.abs(e.clientX - S.x0) < 6) return;
          S.oldu = true; K.kap.classList.add('ks-surukle');
          try { cub.setPointerCapture(e.pointerId); } catch (x) { }   /* yakalama ancak sürükleme başlayınca: dokunuş kısımda kalsın */
        }
        e.preventDefault();
        var t = ksT(K, e.clientX); if (t == null) return;
        S.t = t; ksGuncelle(K);
        var an = Date.now();
        if (an - S.an > 140) { S.an = an; try { K.el.currentTime = t; } catch (x) { } }   /* sararken ses de oraya (seyrek) */
      });
      cub.addEventListener('pointerup', function (e) {
        var S = K.sur; if (!S || S.id !== e.pointerId) return;
        K.sur = null; K.kap.classList.remove('ks-surukle');
        if (S.oldu) { K.yut = Date.now(); if (S.t != null) ksGit(K, S.t, false); return; }
        if (!S.kisim) ksGit(K, ksT(K, e.clientX), false);              /* boş yere dokunuş: oraya (kısma dokunuşu «tık» yapar) */
      });
      cub.addEventListener('pointercancel', function () {
        var S = K.sur; K.sur = null; K.kap.classList.remove('ks-surukle');
        if (S && S.oldu) { K.yut = Date.now(); ksGuncelle(K); }
      });
      cub.addEventListener('click', function (e) {                    /* kısma dokunuş (Sınıf Ekranı'nda yinelenen tık da buradan) */
        e.preventDefault(); e.stopPropagation();
        if (Date.now() - K.yut < 450) return;                          /* sürüklemenin sonu */
        var b = e.target && e.target.closest ? e.target.closest('.ks-k') : null;
        if (b && cub.contains(b)) ksKisma(K, +b.getAttribute('data-ki'));
      });
    }
    (function () {                                                    /* kitabın kendi oynatıcıları */
      var a = document.getElementById('calarSes'), c = document.getElementById('calar');
      if (a && c) ksBagla(a, c, true);
      var v = document.getElementById('videoOyn'), pv = document.getElementById('pVideo');
      if (v && pv) ksBagla(v, pv, false, null);
      var onceki = flip.degisti;                                      /* sayfa çevrilince (duraklıyken de) karşı sayfanın perdesi */
      if (typeof onceki === 'function') flip.degisti = function () { var r = onceki.apply(this, arguments); ksTazele(); return r; };
    })();
    var ksDis = {
      veri: ksVeri, anah: ksAnah, liste: ksKisimlar, yenile: ksYenile,
      durum: function () {
        return KS.L.map(function (K) {
          var el = K.el;
          var v = K.vel && K.vel.isConnected ? K.vel : null, y = v && v.parentNode.parentNode;
          return { id: el.id || (K.kap && K.kap.id) || '', src: K.src, n: K.P.length, konum: K.konum, ad: K.P.map(function (p) { return p.ad; }), olcek: K.d,
                   t: +el.currentTime || 0, calan: !el.paused && !el.ended, simdi: K.i, sure: K.sn, gor: !!K.alan.offsetParent,
                   vurgu: v ? { j: +v.getAttribute('data-j'), sayfa: +y.getAttribute('data-sayfa'), x: v.style.left, y: v.style.top, w: v.style.width, h: v.style.height } : null };
        });
      }
    };
    /* DERS MODU SADE (01.11.2026): dsSinif çağırır — sınıf değişmeden önceki görünüm, sonra yeni ölçü */
    function dsSadeOnce() { try { return tkGorunum(); } catch (e) { return { p: 1, o: 1 }; } }
    function dsSadeSonra(acik, g) {
      dsOkAdi(acik);
      dsAltKur();                                                        /* DERS KÖŞE: ses çubuğu açıksa kitap onun üstünde biter */
      try { window.dispatchEvent(new Event('resize')); } catch (e) { }   /* kitap yeni yere göre (uygulama.js: flip.olcekle, Z.olcekle) */
      if (DS.aktif && !dsIzleyen() && dsSadeCerceve()) return;          /* adımın kendi yakınlaşması */
      dsSadeGorunum(g);                                                  /* yoksa aynı yer görünsün */
    }
    function dsSadeCerceve() {
      var L = dsAdimlar(DS.s), i = DS.i, a;
      if (!(DS.s >= 1) || !L.length) return false;
      if (i < 0 || i >= L.length) { dsYakinlas(DS.s, null); return true; }
      a = L[i];
      if (a.t === 'cevap') { var ub = dsCevapBandi(DS.s, a, i); if (ub) { dsYakinlas(DS.s, ub); return true; } return false; }
      if (a.t === 'yakin' || dsBantVar(a)) { dsYakinlas(DS.s, a); return true; }
      return false;
    }
    function dsSadeGorunum(m) {
      if (!m || !(sayi(m.o, 1) > 1.02)) { if (z.o > 1.02 || z.x || z.y) { z.o = 1; z.x = 0; z.y = 0; sinirla(); zUygula(false); } return; }
      var g = tkSayfa1x(m.p), W = sahne.clientWidth, H = sahne.clientHeight;
      if (!g || !W || !H) return;
      var vw = Math.max(0.02, sayi(m.fw, 1)) * g.en, vh = Math.max(0.02, sayi(m.fh, 1)) * g.boy;
      var o = Math.max(ENAZ, Math.min(ENCOK, Math.min(W / vw, H / vh)));
      var px = g.x + sayi(m.fx, 0.5) * g.en, py = g.y + sayi(m.fy, 0.5) * g.boy;
      z.o = o; z.x = (W / 2 - px) * o; z.y = (H / 2 - py) * o;
      sinirla(); zUygula(false);
    }
    function dsOkAdi(acik) {                                             /* kenardaki oklar (ikizleri de): ders açıkken adım */
      [].forEach.call(document.querySelectorAll('.ok.sol, .ok.sag'), function (o) {
        var e = o.getAttribute('data-ds-ad');
        if (acik) {
          if (e == null) { e = (o.getAttribute('aria-label') || '') + '\n' + (o.getAttribute('title') || ''); o.setAttribute('data-ds-ad', e); }
          var p = e.split('\n'), ileri = /sonraki/i.test(p[0] || p[1] || ''), k = /\(([^)]*)\)\s*$/.exec(p[1] || ''), ad = ileri ? 'Sonraki adım' : 'Önceki adım';
          o.setAttribute('aria-label', ad); o.title = ad + (k ? ' (' + k[1] + ')' : '');
        } else if (e != null) {
          var q = e.split('\n'); o.setAttribute('aria-label', q[0] || ''); o.title = q[1] || ''; o.removeAttribute('data-ds-ad');
        }
      });
    }
    /* DERS KÖŞE (01.11.2026): ders açıkken görünen ses çubuğu (en altta) kadar sahnenin altı boş kalır; çubuk açılınca /
       kapanınca / boyu değişince kitap yeniden ölçeklenir, görünüm (adımın yakınlaşması) korunur */
    var DS_ALT = 0;
    function dsAltOlc() {
      if (!document.documentElement.classList.contains('ds-acik')) return 0;
      var en = 0, H = window.innerHeight || 0;
      [].forEach.call(document.querySelectorAll('.calar'), function (c) {
        if (c.hidden) return;
        var r = c.getBoundingClientRect();
        if (!(r.width > 0 && r.height > 0) || r.top < H / 3) return;      /* yalnız alttaki çubuk */
        en = Math.max(en, Math.round(H - r.top + 8));
      });
      return en;
    }
    function dsAltKur() {                                                /* sahnenin alt payı — değiştiyse true */
      var px = dsAltOlc(); if (px === DS_ALT) return false;
      DS_ALT = px;
      if (px > 0) sahne.style.setProperty('bottom', px + 'px', 'important'); else sahne.style.removeProperty('bottom');
      return true;
    }
    function dsAltTazele() {
      if (dsAltOlc() === DS_ALT) return;
      var g = dsSadeOnce();
      dsAltKur();
      try { window.dispatchEvent(new Event('resize')); } catch (e) { }
      if (DS.aktif && !dsIzleyen() && dsSadeCerceve()) return;
      dsSadeGorunum(g);
    }
    (function dsAltGozcu() {
      var bekle = 0, gor = [], MO = window.MutationObserver, RO = window.ResizeObserver ? new ResizeObserver(function () { iste(); }) : null;
      function iste() { if (bekle) return; bekle = 1; (window.requestAnimationFrame || setTimeout)(function () { bekle = 0; dsAltTazele(); }); }
      function bagla() {                                                 /* kitabın çaları; eklenen sesinki sonradan kurulur */
        [].forEach.call(document.querySelectorAll('.calar'), function (c) {
          if (gor.indexOf(c) >= 0) return; gor.push(c);
          if (RO) RO.observe(c);                                         /* açılınca / kapanınca / boyu değişince */
          else if (MO) new MO(iste).observe(c, { attributes: true, attributeFilter: ['hidden', 'class'] });
          iste();
        });
      }
      bagla();
      if (MO) new MO(bagla).observe(document.body, { childList: true });
      window.addEventListener('resize', iste);
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
      pinch: function () { return { akici: AKICI, aktif: pinchAktif, kilit: !!flip.kilitli }; },  /* deneme için (24.10.2026) */
      ip: ipDis,                           /* ayraç ipi (27.10.2026) */
      ders: dsDis,                         /* ders modu (29.10.2026) */
      tazele: YT,                          /* yerel tazeleme (29.10.2026) */
      icindekiler: icDis,                  /* içindekiler (29.10.2026) */
      dokun: dkDis,                        /* dokunma alanları (30.10.2026) */
      medya: mdDis,                        /* ses ve video (30.10.2026) */
      zaman: zsDis,                        /* zaman şeridi (30.10.2026) */
      kisim: ksDis                         /* ilerleme çubuğu · kısımlar (31.10.2026) */
    });
  };
})(window);
