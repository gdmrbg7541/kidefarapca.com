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
        okUst.classList.toggle('pasif', gor && !dikeyGidebilir('yukari') && !mcOkVar(-1));
      }
      if (okAlt) {
        okAlt.classList.toggle('gor', gor);
        okAlt.classList.toggle('pasif', gor && !dikeyGidebilir('asagi') && !mcOkVar(1));
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
          if (!dikeyKay(yukari ? 'yukari' : 'asagi')) mcOkKaydir(yukari ? -1 : 1);   /* KİTAP OK DÜĞME (14.11.2026): sayfanın ucunda bloğun metni kayar */
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
      if ((yon === 'asagi' || yon === 'yukari') && mcOkKaydir(yon === 'asagi' ? 1 : -1)) return;   /* KİTAP OK KAYDIR (14.11.2026): sayfanın ucunda bloğun metni kayar */

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
    /* DOKUNUNCA BÜYÜT AÇ / KAPA (25.11.2026) — öğretmen: "motordan bi yere dokununca büyüme özelliğini açılıp kapanır yapalım,
       isteyen açsın ama varsayılan kapalı olsun". Araç çubuğunda «Dokununca büyüt»; bu cihazda hatırlanır. */
    var KZ_DB = 'kitap_dokunBuyut';
    function kzDokunBuyut() { try { return localStorage.getItem(KZ_DB) !== '0'; } catch (e) { return true; } }   /* DERSTE DOKUNMA / OK (25.11.2026): varsayılan açık */
    (function () {
      var ip = document.getElementById('tIpucu'); if (!ip || document.getElementById('tDokunBuyut')) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tus'; b.id = 'tDokunBuyut';
      b.title = 'Sayfaya dokununca o bölgeyi büyüt (aç / kapa)'; b.setAttribute('aria-label', 'Dokununca büyüt');
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.3 15.3 20.5 20.5"/><path d="M10.5 7.6v5.8M7.6 10.5h5.8"/></svg>';
      function goster() { var a = kzDokunBuyut(); b.classList.toggle('aktif', a); b.setAttribute('aria-pressed', a ? 'true' : 'false'); }
      goster();
      b.addEventListener('click', function () {
        var a = !kzDokunBuyut(); try { localStorage.setItem(KZ_DB, a ? '1' : '0'); } catch (e) { }
        goster(); try { kkTost(a ? 'Dokununca büyütme açık: bir bölgeye dokun, büyür; yine dokun, küçülür' : 'Dokununca büyütme kapalı (Yaklaş / Uzaklaş düğmeleri ve iki parmak çalışır)'); } catch (e) { }
      });
      /* KALEM MENÜSÜ DÜZENİ (25.11.2026): yan çubukta değil, Kalem ayarlarında */
    })();
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
      if (!e.target.closest(YOKSAY) && !kkYanki(e)) {                       /* YÖNERGE VURGUSU (03.11.2026): yönergeye dokununca ders o etkinliğin BAŞINDAN; */
        var yn0 = dsYonAltta(e.clientX, e.clientY);                          /* etkinliğin içi dersi ortasından açmaz (eski «dokun ders aç» kalktı) */
        if (yn0) { dsSorKapat(); dsEbBasla(yn0.s, yn0.g); sonBolge = Date.now(); return; }
      }
      if (!e.target.closest(YOKSAY) && !kkYanki(e)) {                       /* KISMIN YERİ DERS KAPALIYKEN DE (02.11.2026) */
        var kp0 = dsKisimAltta(e.clientX, e.clientY);
        if (kp0) { dsKisimCal(kp0); sonBolge = Date.now(); return; }       /* o kısım çalar ve durur, büyütme yok */
      }
      if (z.o > 1.02) { if (kzDokunBuyut() && !(typeof DS !== 'undefined' && DS && DS.aktif) && !e.target.closest(YOKSAY)) {   /* DERSTE DOKUNMA: ders modunda dokunuş küçültmez */ zAyarla(1); sonBolge = Date.now(); } return; }   /* DOKUNUNCA BÜYÜT: kapalıysa küçültmez */
      if (d.h && !DS.aktif && kzDokunBuyut()) { bolgeyiBuyut(d.h); sonBolge = Date.now(); }   /* DOKUNUNCA BÜYÜT: varsayılan kapalı */   /* DERS MODUNDA TEK DOKUNUŞLA BÜYÜTME YOK (03.11.2026) */
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
    var CE_NBOY = { k: 34, o: 50, b: 76 };                         /* KALEM MENÜSÜ DÜZENİ: rakamın 3 hazır boyu */
    function ceNB() { try { var v = localStorage.getItem('kitap_ceNB'); return CE_NBOY[v] ? v : 'o'; } catch (e) { return 'o'; } }
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
      if (a === 'cn') return ceDamga({ a: 'T', r: KK.renk, w: w, d: 'n', x: kkR(C.x), y: kkR(C.y), s: CE_NBOY[ceNB()] || CE_SAYI[w] || 50, n: KK.ceSayi || 1 });
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
        '<span class="kk-ce-boylar" role="group" aria-label="Rakam boyu">' +   /* KALEM MENÜSÜ DÜZENİ: 3 hazır boy */
        [['k', 'Küçük', 13], ['o', 'Orta', 19], ['b', 'Büyük', 27]].map(function (x) { return '<button type="button" class="kk-ce-nb" data-cnb="' + x[0] + '" title="' + x[1] + ' rakam" aria-label="' + x[1] + ' rakam" style="font-size:' + x[2] + 'px">١</button>'; }).join('') + '</span>' +
        CE_RAKAM.map(function (r, i) { return '<button type="button" class="kk-ce-sb" data-cn="' + (i + 1) + '" role="menuitemradio">' + r + '</button>'; }).join('') +
        '</span></span>';
    }
    function ceSayiGoster() {
      var p = KK.palet;
      if (!p) return;
      var n = Math.max(1, Math.min(10, KK.ceSayi || 1)), b = p.querySelector('.kk-ce-n');
      if (b) b.textContent = CE_RAKAM[n - 1];
      [].forEach.call(p.querySelectorAll('[data-cn]'), function (x) { x.setAttribute('aria-checked', +x.getAttribute('data-cn') === n ? 'true' : 'false'); });
      var nb = ceNB(); [].forEach.call(p.querySelectorAll('[data-cnb]'), function (x) { x.setAttribute('aria-checked', x.getAttribute('data-cnb') === nb ? 'true' : 'false'); });
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
      if (k === 'cn') setTimeout(function () { ceSayiMenu(true); ceSayiGoster(); }, 0);   /* KALEM MENÜSÜ DÜZENİ: rakama basınca boy + rakam */
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
      if (d === '__kapat') { ceKlavye(false); /* KALEM MENÜSÜ DÜZENİ: ✕ yalnız şimdilik kapatır, yeni yere dokununca yine açılır */ if (t) { t.removeAttribute('inputmode'); try { t.focus(); } catch (e) { } } return; }
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
        '<button type="button" class="kk-ay-sat kk-takip kk-dokbuy" data-kk="dokbuy" role="switch" aria-checked="' + (kzDokunBuyut() ? 'true' : 'false') + '">' +   /* KALEM MENÜSÜ DÜZENİ: dokununca büyüt */
        '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V3h4M21 7V3h-4M3 17v4h4"/><path d="M10 12.5V7a1.4 1.4 0 0 1 2.8 0v4.6"/><path d="M12.8 10.6a1.4 1.4 0 0 1 2.8 0v1.2"/><path d="M15.6 11.4a1.4 1.4 0 0 1 2.8 0V16a5 5 0 0 1-5 5h-.7a4.6 4.6 0 0 1-3.8-2l-2.3-3.3a1.4 1.4 0 0 1 2.2-1.7l1.2 1.5"/></svg><span class="kk-ay-ad">Dokununca büyüt<small>Sayfaya dokununca o bölge büyür</small></span>' +
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
      /* KÜÇÜK ŞERİT TAŞINIR (25.11.2026) — öğretmen: "kalem popup ını küçültünce ekranda taşıyamıyorum": küçükken yuvarlak düğme tutamaktır */
      var t = e.target.closest && (e.target.closest('[data-kk="tut"]') || (KK.kucuk && e.target.closest('[data-kk="kapa"]')));
      if (!t || !KK.palet || KK.palet.hidden || (e.pointerType === 'mouse' && e.button !== 0)) return;
      var kp = t.getAttribute('data-kk') === 'kapa';
      if (!kp) e.preventDefault();
      kkTas = { id: e.pointerId, x: e.clientX, y: e.clientY, oynadi: false, t: t, kp: kp };
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
      if (T.oynadi) KK.tasBitti = Date.now();                     /* KÜÇÜK ŞERİT TAŞINIR: sürükleme sonrası tıklama sayılmaz */
      if (!T.oynadi) {                                            /* dokunuş: çift dokunuş → yine kendisi yer seçer */
        if (e.type !== 'pointerup' || T.kp) return;
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
      var cnb = e.target.closest && e.target.closest('[data-cnb]');      /* KALEM MENÜSÜ DÜZENİ: rakam boyu */
      if (cnb && KK.palet && KK.palet.contains(cnb)) { e.preventDefault(); try { localStorage.setItem('kitap_ceNB', cnb.getAttribute('data-cnb')); } catch (x) { } ceSayiGoster(); return; }
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
      else if (k === 'dokbuy') {                                    /* KALEM MENÜSÜ DÜZENİ: dokununca büyüt aç / kapa */
        var db = !kzDokunBuyut(); try { localStorage.setItem(KZ_DB, db ? '1' : '0'); } catch (x) { }
        b.setAttribute('aria-checked', db ? 'true' : 'false');
        kkTost(db ? 'Dokununca büyütme açık: bir bölgeye dokun, büyür; yine dokun, küçülür' : 'Dokununca büyütme kapalı (Yaklaş / Uzaklaş ve iki parmak çalışır)');
      }
      else if (k === 'geri') { if (!kkYanki(e)) kkGeriAl(); }
      else if (k === 'ileri') { if (!kkYanki(e)) kkIleriAl(); }
      else if (k === 'kapa') { if (Date.now() - (KK.tasBitti || 0) < 500) return; KK.kucuk = !KK.kucuk; kkTercihYaz(); kkPaletGuncelle(); kkSeritYerlestir(); }
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
      try { ipYanGuncelle(); } catch (e) { }                         /* İPLİ SAYFAYA GİT */
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
    /* İPLİ SAYFAYA GİT (25.11.2026) — öğretmen: "sidebar da ipin olduğu sayfaya git kısmı da olsun" */
    var IP_YAN = null;
    function ipYanGuncelle() {
      var b = IP_YAN; if (!b) return;
      var var_ = !!IP.s;
      b.classList.toggle('kip-yok', !var_);
      b.title = var_ ? 'Kırmızı ipin olduğu sayfaya git: ' + ipAd(IP.s) : 'İpli sayfa yok — sayfanın üstündeki gri ize dokununca ip konur';
    }
    (function () {
      var ic = document.getElementById('tIcindekiler') || document.getElementById('tIpucu');
      if (!ic || document.getElementById('tIpGit')) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tus'; b.id = 'tIpGit';
      b.setAttribute('aria-label', 'İpli sayfaya git');
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.4 2.8h9.2v18.4L12 17.4l-4.6 3.8z" fill="#E5484D" stroke="#B4232A"/></svg>';
      b.addEventListener('click', function (e) {
        e.preventDefault();
        if (IP.s) ipGit(IP.s);
        else kkTost('Henüz ip konmadı · sayfanın üstündeki gri ize dokununca kırmızı ip o sayfaya iner');
      });
      ic.parentNode.insertBefore(b, ic.nextSibling);
      IP_YAN = b;
      setTimeout(ipYanGuncelle, 0);
    })();
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
    var DS_TUR = { yakin: 1, kaynak: 1, cevap: 1, not: 1, ortu: 1, md: 1, dk: 1, bg: 1, dv: 1, eb: 1 };   /* eb: ETKİNLİK BAŞI (02.11.2026) */   /* dv: DOKUNMA VURGUSU (02.11.2026) */   /* md dk bg: SAYFA ŞERİDİ (30.10.2026) */
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
    /* ADIMLI SAYFADA BÜYÜTME YOK (02.11.2026) — öğretmen: "ders modu eklenen sayfada bi
       yere dokununca flipbook motorundaki yaklaştırma özelliği devreye giriyor, buna gerek
       yok". Dokunulan bölgenin sayfasında ders adımı varsa bölge büyütülmez. */
    function dsBolgeAdimli(h) {
      try {
        if (!dsVeri()) return false;
        var s = h.tek ? flip.aktif : ekranSayfa(h.sag);
        return !!(s && dsAdimlar(s).length);
      } catch (e) { return false; }
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
      dsEbCiz();                                                    /* ETKİNLİK BAŞI: sayfalardaki ders düğmeleri */
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
    function dsBantYonerge(s, x1, x2, y1, y2) {                        /* YÖNERGE TAM SIĞSIN (04.11.2026): geniş bandın içindeki yönerge satırlarının enine uzanımı */
      if (x2 - x1 < 70) return null;
      var Y = kok.KITAP_YONERGE, R = (Y && Y.sayfa && Y.sayfa[s]) || [], a = Infinity, b = -Infinity;
      R.forEach(function (r) { var c = (r[1] + r[3]) / 2; if (c >= 6 && c >= y1 - 1 && c <= y2) { a = Math.min(a, r[0]); b = Math.max(b, r[2]); } });
      return b > a ? [a, b] : null;
    }
    function dsBantIzlenir(s, a) {                                     /* UZUN BANT: etkinlikte odağın izleyeceği yer var mı */
      try {
        var L = dsAdimlar(s), i = L.indexOf(a), Kn = (kok.KITAP_VERI || {}).kaynak || [], k, e = i;
        if (i < 0) return true;
        while (e > 0 && !(L[e] && L[e].t === 'eb')) e--;
        for (k = e; k < L.length; k++) {
          var x = L[k]; if (!x) continue; if (k > e && x.t === 'eb') break;
          if (x.t === 'kaynak' && x.k != null && Kn[+x.k] && Kn[+x.k].yol && ksKisimlar(Kn[+x.k].yol).some(function (p) { return +p.sayfa === +s && p.x2 > p.x1; })) return true;
        }
        return false;
      } catch (err) { return true; }
    }
    function dsYakinlas(s, a) {
      if (!dsBantVar(a)) { if (z.o > 1.02 || z.x || z.y) { z.o = 1; z.x = 0; z.y = 0; sinirla(); zUygula(true); } return; }
      var g = dsSayfaKutu(s);
      if (!(g.en > 0 && g.boy > 0 && g.w > 0 && g.h > 0)) return;
      var x1 = dsYuzde(a.x1, 0), x2 = Math.max(x1 + 1, dsYuzde(a.x2, 100));
      var y1 = dsYuzde(a.y1, 0), y2 = Math.max(y1 + 1, dsYuzde(a.y2, 100));
      var bx = g.x + g.en * x1 / 100, bw = g.en * (x2 - x1) / 100;
      var by = g.y + g.boy * y1 / 100, bh = g.boy * (y2 - y1) / 100;
      var og = g.w / g.en * 0.985;                                      /* SAYFA GENİŞLİĞİNDE YAKINLAŞMA (03.11.2026): sayfa soldan sağa */
      var ob = Math.min(1.7, g.h * 0.6 / Math.max(1, bh));              /* DİKEY EKRANDA DA YAKLAŞ (03.11.2026): sayfa ekranı zaten dolduruyorsa */
      var yr = dsBantYonerge(s, x1, x2, y1, y2);                         /* YÖNERGE TAM SIĞSIN (04.11.2026): bandın içindeki yönerge satırı enine sığsın */
      if (yr) ob = Math.min(ob, g.w * 0.97 / Math.max(1, g.en * (yr[1] - yr[0]) / 100));
      var o = Math.max(ENAZ, Math.min(ENCOK, Math.max(og, ob)));
      if (bh * o > g.h * 0.9) o = Math.max(ENAZ, Math.min(o, g.h * 0.9 / Math.max(1, bh)));   /* ZOOM MERKEZ (25.11.2026): bant hep bütünüyle sığar */
      if (bw * o > g.w * 0.97) o = Math.max(ENAZ, Math.min(o, g.w * 0.97 / Math.max(1, bw)));   /* UZUN BANT (12.11.2026): izlenecek ses kısmı yoksa bandın tamamı sığsın */
      o = Math.max(ENAZ, Math.min(ENCOK, Math.min(g.w * 0.97 / Math.max(1, bw), g.h * 0.9 / Math.max(1, bh))));   /* SEÇİLEN ALAN (25.11.2026): seçilen alanın tamamı ekranı doldurur */
      if (+a.yk > 0) o = Math.max(ENAZ, Math.min(ENCOK, o * (+a.yk) / 100));   /* YAKINLIK ELLE (12.11.2026): tezgâhta ayarlanan oran */
      var ox = g.x + g.en / 2;                                           /* yatay: sayfa ortası */
      if (o > og + 0.05) {
        if (bw * o <= g.w * 0.96) ox = bx + bw / 2;
        else if (yr) ox = g.x + g.en * Math.min(100, yr[1] + 1.5) / 100 - g.w / (2 * o);   /* yönergenin sağ ucuna yaslı */
        else ox = bx + bw - g.w / (2 * o) + g.en * 0.01;                 /* sığmazsa sağa yaslı (Arapça sağdan başlar) */
      }
      var cx = ox - g.w / 2, cy = by + bh / 2 - g.h / 2;               /* dikeyde çizilen yerin ortası */
      if (bh * o > g.h * 0.92) cy = by - g.h * 0.03 / o + g.h / (2 * o) - g.h / 2;   /* YÖNERGE TAM SIĞSIN: bant sığmıyor: üstü ekranın üstüne yaslı */
      z.o = o; z.x = -cx * o; z.y = -cy * o;
      sinirla(); zUygula(true);
    }
    /* ---------- katmanlar: örtü, cevap ---------- */
    function dsTemizle() {
      [].forEach.call(document.querySelectorAll('.ds-ortu, .ds-cevap, .ds-isaret, .ds-dv'), function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
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
    /* CEVAP YAZI (04.11.2026) — öğretmen: "amacımız her cevabı her şeyi kitap üzerinden yapmak ve çözünürlüğünün yüksek
       kalmasını istiyoruz". cevapveri.js'te yazısı olan cevap resim yerine sayfanın üstüne çizilir (sayfayla büyür). */
    function dsCevapAnahtar(a) {
      if (!a) return '';
      if (a.ck) return String(a.ck);
      var m = /s(\d+)_e(\d+)/.exec(String(a.res || '')); return m ? (+m[1]) + '.' + (+m[2]) : '';
    }
    function dsCevapVeri(a) {                                         /* CEVAP DÜZENLE (05.11.2026): tezgâhta düzeltilmiş «cv» önce */
      if (a && Array.isArray(a.cv) && a.cv.length) return a.cv;
      var V = kok.KITAP_CEVAP, k = dsCevapAnahtar(a); return (V && V.etkinlik && k && V.etkinlik[k]) || null;
    }
    function dsCvSinir(Q) {                                            /* cevabın sayfadaki kapladığı yer */
      var x1 = 100, y1 = 100, x2 = 0, y2 = 0;
      Q.forEach(function (q) { (q.x || []).forEach(function (r) { x1 = Math.min(x1, r[0]); y1 = Math.min(y1, r[1]); x2 = Math.max(x2, r[0] + r[2]); y2 = Math.max(y2, r[1] + r[3]); }); });
      return x2 > x1 && y2 > y1 ? { x1: x1, y1: y1, x2: x2, y2: y2 } : null;
    }
    var DS_CV_OLC = null;
    function dsCvGen(t) {                                              /* 1cqw boyda yazının eni (cqw) */
      try { if (!DS_CV_OLC) DS_CV_OLC = document.createElement('canvas').getContext('2d'); DS_CV_OLC.font = '700 100px Arakom, "Geeza Pro", serif'; return DS_CV_OLC.measureText(t).width / 100; }
      catch (e) { return t.length * 0.5; }
    }
    var DS_CV_TIK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path pathLength="100" d="M4 12.8l5.2 5.2L20.5 6"/></svg>',   /* CEVAP VURGU: pathLength → çizilerek */
        DS_CV_CARPI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path pathLength="100" d="M6 6l12 12M18 6 6 18"/></svg>',
        DS_CV_SEKIL = { c: '<circle pathLength="100" cx="20" cy="20" r="17"/>', t: '<path pathLength="100" d="M20 3 37 36H3Z"/>', s: '<rect pathLength="100" x="3" y="3" width="34" height="34"/>' };
    function dsCvKutu(r, ek, ic, b) { var bs = Array.isArray(b) ? b.filter(function (x) { return x != null; }) : (b != null ? [b] : []); return '<span class="cv ' + ek + '"' + (bs.length ? ' data-b="' + Math.min.apply(null, bs) + '" data-bs="' + bs.join(',') + '"' : '') + ' style="left:' + r[0] + '%;top:' + r[1] + '%;width:' + r[2] + '%;height:' + r[3] + '%">' + (ic || '') + '</span>'; }
    function dsCvZr(c, s) { var m = /^(#[0-9a-fA-F]{6})(?::(\d+(?:\.\d+)?):(\d+(?:\.\d+)?))?$/.exec(String(c || '')); if (!m) return s; var u = +m[2] || 0, t = 100 - (+m[3] || 0); return s.replace(' style="', ' style="background:' + (m[2] != null ? 'linear-gradient(transparent ' + u + '%,' + m[1] + ' ' + u + '%,' + m[1] + ' ' + t + '%,transparent ' + t + '%)' : m[1]) + ';'); }   /* İNCE YER (12.11.2026): yazı kutusunun zemini (gölgeli satır) */
    function dsCvYazi(t, r, fs, oran) {                                /* boşluğa sığan boy (sayfa eninin yüzdesi) */
      var b = Math.min(fs || 3.6, r[3] * oran * 0.8, r[2] * 0.94 / Math.max(dsCvGen(t), 0.01));
      var arv = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(t);   /* YAZI YÖNÜ (11.11.2026): Arapça değilse soldan sağa */
      return '<b' + (arv ? ' lang="ar" dir="rtl"' : ' dir="ltr" class="cv-sol"') + ' style="font-size:' + Math.max(0.6, b).toFixed(2) + 'cqw">' + kkEsc(t) + '</b>';
    }
    function dsCvCizgi(a, b) {                                         /* iki kutu arası eğri (sayfa yüzdesi) */
      var ax = a[0] + a[2] / 2, bx = b[0] + b[2] / 2, ay = a[1] + a[3] / 2, by = b[1] + b[3] / 2, m;
      if (Math.abs(ax - bx) < (a[2] + b[2]) / 2) {
        var asg = by > ay, u1 = asg ? a[1] + a[3] : a[1], u2 = asg ? b[1] : b[1] + b[3]; m = (u1 + u2) / 2;
        return 'M' + ax + ' ' + u1 + 'C' + ax + ' ' + m + ' ' + bx + ' ' + m + ' ' + bx + ' ' + u2;
      }
      var sag = bx > ax, k1 = sag ? a[0] + a[2] : a[0], k2 = sag ? b[0] : b[0] + b[2]; m = (k1 + k2) / 2;
      return 'M' + k1 + ' ' + ay + 'C' + m + ' ' + ay + ' ' + m + ' ' + by + ' ' + k2 + ' ' + by;
    }
    /* CEVAP ELLE (05.11.2026) — öğretmen: "cevaplar sıralıysa her tıklamada bi tane açma veya hepsini açma". Adımın
       ac: 'tek' → her ileride / dokunuşta bir cevap (geri: sonuncu kapanır); 'oto' → her acs sn bir cevap. Sıra cv[].o
       (kutu) / po (çizgi); yoksa kitaptaki sıra (Ders Tezgâhı'nın cvBirimler kuralı). Alt adım DS.m: önce cevaplar, sonra işaretler. */
    function dsCvBirimler(Q) {
      var U = [];
      (Q || []).forEach(function (q, qi) {
        if (!q) return;
        var X = q.x || [], A = q.a || [], o = q.o || [];
        if (q.t === 'pick') (q.ok || []).forEach(function (j) { if (X[j]) U.push({ k: qi + ':' + j, o: o[j] }); });
        else if (q.t === 'fill' || q.t === 'seq') X.forEach(function (r, j) { if (r && A[j] != null && A[j] !== '' && !(q.bg && q.bg[j] != null)) U.push({ k: qi + ':' + j, o: o[j] }); });   /* SEÇİNCE YAZ (12.11.2026): bağlı yazı kendi birimi değil */
        else if (q.t === 'tf') X.forEach(function (r, j) { if (r) U.push({ k: qi + ':' + j, o: o[j] }); });
        else if (q.t === 'shape') X.forEach(function (r, j) { if (r && /^[cts]$/.test(A[j] || '')) U.push({ k: qi + ':' + j, o: o[j] }); });
        else if (q.t === 'match') (q.p || []).forEach(function (e, pi) { if (e && X[e[0]] && X[e[1]]) U.push({ k: qi + ':p' + pi, o: (q.po || [])[pi] }); });
        else if (q.t === 'iz') X.forEach(function (r, j) { if (r && (q.iz || [])[j]) U.push({ k: qi + ':' + j, o: o[j] }); });   /* YAZILIŞ (11.11.2026) */
      });
      U.forEach(function (u, n) { u.n = n; });
      U.sort(function (a, b) { var x = typeof a.o === 'number' ? a.o : 1e6 + a.n, y = typeof b.o === 'number' ? b.o : 1e6 + b.n; return x - y || a.n - b.n; });
      return U;
    }
    function dsCvSay(a) { return 0; }                                   /* CEVAP VURGU: cevaplar alt adım (DS.m) değil; DS_CVA */
    /* CEVAP VURGU (05.11.2026) — öğretmen: "cevapların nasıl açılacağı ve yazılması çizilmesi vs flipbook üzerinden
       yapılacak … dokunma vurgusu eklemiştik mesela öyle olabilir" + "her cevap aynı zamanda vurgu özelliği taşıyabilir".
       Açık birimler DS_CVA['sayfa:adım'] (açılış sırasıyla). Kip: dok (varsayılan) · tek · oto · '' (hepsi: vurgusuz). */
    var DS_CVA = {};
    function dsCvMod(a) {
      if (!a || a.t !== 'cevap' || a.ac === 'hepsi') return '';
      var Q = dsCevapVeri(a); if (!Q || !dsCvBirimler(Q).length) return '';
      return a.ac === 'tek' || a.ac === 'oto' ? a.ac : 'dok';
    }
    function dsCvVurguMu(a) { return !!dsCvMod(a); }
    function dsCvN(a) { var Q = dsCevapVeri(a); return Q ? dsCvBirimler(Q).length : 0; }
    function dsCvL(s, j) { var k = s + ':' + j; return DS_CVA[k] || (DS_CVA[k] = []); }
    function dsCvCizdir(e) { e.classList.remove('ds-ciz'); void e.getBoundingClientRect(); e.classList.add('ds-ciz'); }
    function dsCvUygula(s, j) {                                       /* açık birimler görünür; vurgusu söner */
      var y = kkYuz(s); if (!y) return;
      var L = dsCvL(s, j), k = y.querySelector('.ds-cevap.ds-vek[data-ds="' + j + '"]'), o = y.querySelector('.ds-cvd[data-cvd="' + j + '"]');
      if (k) [].forEach.call(k.querySelectorAll('[data-bs]'), function (e) {
        var gor = e.getAttribute('data-bs').split(',').some(function (b) { return b !== '' && L.indexOf(+b) >= 0; }), kap = e.classList.contains('ds-kapali');
        if (gor === kap) { e.classList.toggle('ds-kapali', !gor); if (gor) dsCvCizdir(e); }
      });
      if (o) [].forEach.call(o.querySelectorAll('i[data-b]'), function (e) { var b = e.getAttribute('data-b'); if (b !== 'y') e.classList.toggle('dv-isaretli', L.indexOf(+b) >= 0 || !!e.querySelector('.dvm')); });
    }
    function dsCvAc(s, j, b, ac) {
      var L = dsCvL(s, j), n = L.indexOf(b);
      if (ac && n < 0) L.push(b); else if (!ac && n >= 0) L.splice(n, 1); else return;
      dsCvUygula(s, j); dsBarYaz(); dsDurumBildir();
      if (ac && !dsKcCevap(s, j, b)) dsCvSesCal(s, j, b);              /* CEVAP SESİ · KISIM CEVAP */
    }
    /* CEVAP SESİ (06.11.2026) — öğretmen: "interaktif olmalı … tıklandığında veya ileriye basıldığında cevapları çıkan":
       açılan cevabın kutusunun üstünde etkinliğin sesinin bir kısmı varsa yalnız o kısım çalar. */
    function dsCvKisim(s, j, b) {
      var L = dsAdimlar(s), a = L[j], Q = dsCevapVeri(a); if (!Q) return null;
      var u = dsCvBirimler(Q)[b]; if (!u) return null;
      var m = /^(\d+):(p?)(\d+)$/.exec(u.k), q = Q[+m[1]], X = (q && q.x) || [];
      var r = m[2] ? X[(q.p[+m[3]] || [])[0]] : X[+m[3]]; if (!r) return null;
      var cx = r[0] + r[2] / 2, cy = r[1] + r[3] / 2, Kn = (kok.KITAP_VERI || {}).kaynak || [], bul = null;
      var bj = m[2] ? (q.p[+m[3]] || [])[0] : +m[3], bg = q && Array.isArray(q.ks) ? q.ks[bj] : null, bm = bg != null ? /^(\d+):([\d.]+)$/.exec(String(bg)) : null;
      if (bm && Kn[+bm[1]] && Kn[+bm[1]].yol) {                         /* KISIM CEVAPLARI (11.11.2026): tezgâhta kısma bağlanmış cevap */
        var yb = Kn[+bm[1]].yol, tb = +bm[2], ib = -1;
        ksKisimlar(yb).forEach(function (p, i) { if (ib < 0 && tb >= p.b && tb < p.s) ib = i; });
        if (ib >= 0) return { src: yb, i: ib, s: s };
      }
      for (var k = j - 1; k >= 0 && !bul; k--) {
        var x = L[k]; if (!x) continue; if (x.t === 'eb') break;
        if (x.t !== 'kaynak' || x.k == null || !Kn[+x.k] || !Kn[+x.k].yol) continue;
        var yol = Kn[+x.k].yol;
        ksKisimlar(yol).some(function (p, i) {
          if (!ksVurguVar(p) || +p.sayfa !== +s || cx < p.x1 || cx > p.x2 || cy < p.y1 || cy > p.y2) return false;
          bul = { src: yol, i: i, s: s }; return true;
        });
      }
      return bul;
    }
    function dsCvSesCal(s, j, b) {
      if (!DS.aktif || dsIzleyen() || DS.s !== s || DS.i !== j) return;
      var o = dsCvKisim(s, j, b); if (o) dsKisimCal(o);
    }
    function dsCvNoktalar(Q) {                                         /* dokunulacak yerler: birim (b) · yanlış şık (y) */
      var R = [];
      dsCvBirimler(Q).forEach(function (u, r) {
        var m = /^(\d+):(p?)(\d+)$/.exec(u.k), q = Q[+m[1]], X = q.x || [];
        if (m[2]) { var e = q.p[+m[3]]; R.push({ b: r, x: [X[e[0]], X[e[1]]] }); } else R.push({ b: r, x: [X[+m[3]]] });
      });
      Q.forEach(function (q) { if (q && q.t === 'pick') (q.x || []).forEach(function (x, j) { if (x && (q.ok || []).indexOf(j) < 0) R.push({ b: 'y', x: [x] }); }); });
      return R;
    }
    function dsCvVurguKur(s, a, j) {
      var y = kkYuz(s), Q = dsCevapVeri(a); if (!y || !Q) return;
      var o = document.createElement('div');
      o.className = 'ds-dv ds-cvd dv-' + (/^(dalga|nabiz|isik|cerceve)$/.test(a.av || '') ? a.av : 'dalga');
      o.setAttribute('data-cvd', String(j)); o.setAttribute('aria-hidden', 'true');
      dsCvNoktalar(Q).forEach(function (p) {
        p.x.forEach(function (r) {
          if (!r) return;
          var e = document.createElement('i'), pd = 0.35;
          e.style.left = (r[0] - pd) + '%'; e.style.top = (r[1] - pd) + '%'; e.style.width = (r[2] + 2 * pd) + '%'; e.style.height = (r[3] + 2 * pd) + '%';
          e.setAttribute('data-b', String(p.b)); e.className = 'dv-dok';
          e.addEventListener('pointerdown', function (ev) { ev.stopPropagation(); e._dv = { x: ev.clientX, y: ev.clientY, t: Date.now() }; });
          e.addEventListener('click', function (ev) {
            ev.preventDefault(); ev.stopPropagation();
            var b0 = e._dv; e._dv = null;
            if (b0 && (Math.hypot(ev.clientX - b0.x, ev.clientY - b0.y) > 12 || Date.now() - b0.t > 900)) return;
            if (kkYanki(ev)) return;
            if (p.b === 'y') {                                          /* yanlış şık: ✗ */
              var v = e.querySelector('.dvm');
              if (v) { e.removeChild(v); e.classList.remove('dv-isaretli'); return; }
              e.insertAdjacentHTML('beforeend', dsDvIsaretSvg('carpi')); e.classList.add('dv-isaretli');
              try { dkSes(false); } catch (x) { }
              return;
            }
            var ac = dsCvL(s, j).indexOf(p.b) < 0;
            if (ac && dsKcErken(s, j, p.b)) {                           /* SIRASI GELMEYEN (12.11.2026): henüz duyulmadı → kısa ✗ */
              var v2 = e.querySelector('.dvm');                         /* KISIM TEK DOĞRU (12.11.2026): ✗ kalıcı; yine dokununca kalkar */
              if (v2) { e.removeChild(v2); e.classList.remove('dv-isaretli'); return; }
              e.insertAdjacentHTML('beforeend', dsDvIsaretSvg('carpi')); e.classList.add('dv-isaretli');
              try { dkSes(false); } catch (x) { }
              return;
            }
            if (!ac && dsKcErken(s, j, p.b)) {                          /* açık eski cevap başka seste: kapanmaz, kısa ✗ */
              if (!e.querySelector('.dvm')) { e.insertAdjacentHTML('beforeend', dsDvIsaretSvg('carpi')); setTimeout(function () { var v4 = e.querySelector('.dvm'); if (v4) e.removeChild(v4); }, 900); }
              try { dkSes(false); } catch (x) { }
              return;
            }
            if (ac) { var v3 = e.querySelector('.dvm'); if (v3) e.removeChild(v3); }   /* sırası geldi: ✗ kalkar, cevap açılır */
            dsCvAc(s, j, p.b, ac);
            if (ac) { try { dkSes(true); } catch (x) { } }
          });
          o.appendChild(e);
        });
      });
      y.appendChild(o);
    }
    function dsCvVurguKatman(s, a, j, ac, i, m) {                      /* dsKatmanlar: kendi adımında vurgu; geçince hepsi açık */
      var y = kkYuz(s); if (!y || !a || a.t !== 'cevap') return;
      var md = dsCvMod(a), o = y.querySelector('.ds-cvd[data-cvd="' + j + '"]');
      if (md && ac && j === i && m != null && !dsIzleyen()) { if (!o) dsCvVurguKur(s, a, j); dsCvUygula(s, j); return; }
      if (o && o.parentNode) o.parentNode.removeChild(o);
      if (md && ac) { var L = dsCvL(s, j), n = dsCvN(a); for (var b = 0; b < n; b++) if (L.indexOf(b) < 0) L.push(b); dsCvUygula(s, j); }
    }
    function dsCvIleri(a, yon) {                                       /* ileri: dok → kalanların hepsi, tek / oto → sıradaki; geri: tersi */
      var md = dsCvMod(a); if (!md || dsIzleyen() || !DS.aktif) return false;
      var y = kkYuz(DS.s); if (!y || !y.querySelector('.ds-cevap.ds-vek[data-ds="' + DS.i + '"]')) return false;
      var L = dsCvL(DS.s, DS.i), n = dsCvN(a), b;
      if (yon > 0) {
        var K = []; for (b = 0; b < n; b++) if (L.indexOf(b) < 0) K.push(b);
        if (!K.length) return false;
        K.slice(0, 1).forEach(function (x) { L.push(x); if (!dsKcCevap(DS.s, DS.i, x)) dsCvSesCal(DS.s, DS.i, x); dsOdakBirim(DS.s, DS.i, x); });   /* KISIM CEVAP · ODAK KAYAR */   /* CEVAP TEKER TEKER (06.11.2026): her ileride bir cevap · CEVAP SESİ */
      } else {
        if (!L.length) return false;
        L.pop();                                                        /* CEVAP TEKER TEKER: geri son açılanı kapatır */
        if (md === 'oto') DS.cvDur = DS.s + ':' + DS.i;
      }
      dsCvUygula(DS.s, DS.i); dsBarYaz(); dsDurumBildir();
      return true;
    }
    function dsCvKalan() { var L = dsAdimlar(DS.s), a = DS.i >= 0 ? L[DS.i] : null; return !!dsCvMod(a) && !dsIzleyen() && dsCvL(DS.s, DS.i).length < dsCvN(a); }

    function dsCvGoster(s, j, m) {                                     /* ilk m cevap açık */
      var y = kkYuz(s), k = y && y.querySelector('.ds-cevap.ds-vek[data-ds="' + j + '"]'); if (!k) return;
      [].forEach.call(k.querySelectorAll('[data-b]'), function (e) { e.classList.toggle('ds-kapali', +e.getAttribute('data-b') >= m); });
    }
    var DS_CVO = 0, DS_CVOK = '', DS_CVSI = '';
    function dsCvOto() {                                               /* CEVAP VURGU: kendiliğinden — sıradaki kapalı cevap acs sn sonra */
      var si = DS.s + ':' + DS.i; if (si !== DS_CVSI) { DS_CVSI = si; DS.cvDur = null; }
      var L = DS.aktif ? dsAdimlar(DS.s) : [], a = DS.i >= 0 ? L[DS.i] : null, n0 = (DS_CVA[si] || []).length, k = DS.aktif + ':' + si + ':' + n0 + ':' + DS.cvDur;
      if (k === DS_CVOK) return; DS_CVOK = k; clearTimeout(DS_CVO);
      if (!a || dsCvMod(a) !== 'oto' || dsIzleyen() || DS.cvDur === si) return;
      if (n0 >= dsCvN(a)) return;
      var s = DS.s, i = DS.i, sn = +a.acs > 0 ? +a.acs : 2;
      DS_CVO = setTimeout(function () { if (DS.aktif && DS.s === s && DS.i === i && !dsIzleyen()) dsCvIleri(a, 1); }, sn * 1000);
    }
    /* YAZILIŞ (11.11.2026) — öğretmen: "silik verilen kelimelerin üstünden geçme etkinliği var, oraya harflerin üzerinden
       geçerek kelimeyi doğru bi şekilde sağdan sola doğru yazma animasyonu ekleyelim". Cevap türü «iz»: kutuya göre (0–1)
       kalem yolları sırayla çizilir (kalem hızıyla), harf noktaları ve harekeler en sonda. */
    function dsCvIz(r, Y, b, oran, hz) {
      var W = r[2], H = r[3] * oran, t = 0.15, h = '', HIZ = 13 * (+hz > 0 ? +hz : 1);   /* YAZI HIZI: tezgâhta ×hz */           /* HIZ: saniyede sayfa eninin %13'ü */
      (Y || []).forEach(function (s) {
        if (s.c && s.c.length >= 4) {
          var d = '', L = 0, px = 0, py = 0;
          for (var k = 0; k + 1 < s.c.length; k += 2) {
            var x = s.c[k] * W, y = s.c[k + 1] * H;
            d += (k ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2);
            if (k) L += Math.hypot(x - px, y - py); px = x; py = y;
          }
          var sn = Math.max(0.12, L / HIZ);
          h += '<path pathLength="100" class="' + (s.h ? 'iz-h' : 'iz-c') + '" style="--g:' + t.toFixed(2) + 's;--s:' + sn.toFixed(2) + 's" d="' + d + '"/>';
          t += sn + (s.h ? 0.12 : 0.04);
        } else if (s.n) {
          h += '<circle class="iz-n" style="--g:' + t.toFixed(2) + 's" cx="' + (s.n[0] * W).toFixed(2) + '" cy="' + (s.n[1] * H).toFixed(2) + '" r="' + Math.max(0.12, s.n[2] * W).toFixed(2) + '"/>';
          t += 0.16;
        }
      });
      var bs = b != null ? ' data-b="' + b + '" data-bs="' + b + '"' : '';
      return '<svg class="cv cv-iz"' + bs + ' viewBox="0 0 ' + W.toFixed(3) + ' ' + H.toFixed(3) + '" preserveAspectRatio="none" aria-hidden="true" style="left:' + r[0] + '%;top:' + r[1] + '%;width:' + r[2] + '%;height:' + r[3] + '%">' + h + '</svg>';
    }

    /* CEVAP RENGİ (11.11.2026) — cevabın rengi: rk "#rrggbb"; resim SVG süzgeciyle o renge boyanır */
    function rkGecer(c) { return /^#[0-9a-fA-F]{6}$/.test(String(c || '')) ? String(c).toLowerCase() : ''; }
    function rkSuzgec(c) {
      c = rkGecer(c); if (!c) return 'none';
      var id = 'rkf-' + c.slice(1);
      if (!document.getElementById(id)) {
        var s = document.getElementById('rkSuzgecler');
        if (!s) { s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.id = 'rkSuzgecler'; s.setAttribute('width', '0'); s.setAttribute('height', '0'); s.setAttribute('aria-hidden', 'true'); s.style.position = 'absolute'; s.style.width = '0'; s.style.height = '0'; document.body.appendChild(s); }
        var f = document.createElementNS('http://www.w3.org/2000/svg', 'filter'); f.id = id; f.setAttribute('color-interpolation-filters', 'sRGB');
        f.innerHTML = '<feFlood flood-color="' + c + '"/><feComposite in2="SourceAlpha" operator="in"/>'; s.appendChild(f);
      }
      return 'url(#' + id + ')';
    }
    function dsCevapVekKur(y, Q, j, a) {
      var V = kok.KITAP_VERI || {}, oran = +V.oran > 0 ? +V.oran : 1.41, h = '', cz = '', rk = {};
      dsCvBirimler(Q).forEach(function (u, r) { rk[u.k] = r; });
      Q.forEach(function (q, qi) {
        if (!q) return;
        var X = q.x || [], B = function (i) { return rk[qi + ':' + i]; };
        if (q.t === 'pick') (q.ok || []).forEach(function (i) { var r = X[i], m = q.m || 'ring'; if (r) h += dsCvKutu(r, 'cv-' + m, m === 'tick' ? DS_CV_TIK : '', B(i)); });
        else if (q.t === 'tf') X.forEach(function (r, i) { if (!r) return; var d = +(q.a || [])[i] === 1; h += dsCvKutu(r, d ? 'cv-dogru' : 'cv-yanlis', d ? DS_CV_TIK : DS_CV_CARPI, B(i)); });
        else if (q.t === 'shape') X.forEach(function (r, i) { var sk = DS_CV_SEKIL[(q.a || [])[i]]; if (r && sk) h += dsCvKutu(r, 'cv-sekil', '<svg viewBox="0 0 40 40" aria-hidden="true">' + sk + '</svg>', B(i)); });
        else if (q.t === 'fill' || q.t === 'seq') X.forEach(function (r, i) { var t = (q.a || [])[i]; if (r && t != null && t !== '') h += dsCvZr(q.zr && q.zr[i], dsCvKutu(r, 'cv-yaz' + (q.ince ? ' cv-bit' : ''), q.ince ? dsCvYazi(String(t), r, q.fs, oran).replace('<b lang', '<b class="cv-ince" lang') : dsCvYazi(String(t), r, q.fs, oran), q.bg && q.bg[i] != null && rk[q.bg[i]] != null ? rk[q.bg[i]] : B(i))); });   /* SEÇİNCE YAZ: bağlı şıkla birlikte açılır */
        else if (q.t === 'iz') X.forEach(function (r, i) { var Y = (q.iz || [])[i]; if (r && Y) h += dsCvIz(r, Y, B(i), oran, q.hz); });   /* YAZI HIZI (11.11.2026) */   /* YAZILIŞ */
        else if (q.t === 'match') {
          var mb = {};
          (q.p || []).forEach(function (e, pi) {
            var A = X[e[0]], Bk = X[e[1]]; if (!A || !Bk) return;
            var b = rk[qi + ':p' + pi]; cz += '<path' + (b != null ? ' data-b="' + b + '" data-bs="' + b + '"' : '') + ' d="' + dsCvCizgi(A, Bk) + '"/>';
            [e[0], e[1]].forEach(function (i) { (mb[i] = mb[i] || []).push(b); });
          });
          Object.keys(mb).forEach(function (i) { h += dsCvKutu(X[i], 'cv-es', '', mb[i]); });
        }
      });
      if (!h && !cz) return false;
      var k = document.createElement('div');
      k.className = 'ds-cevap ds-vek'; k.setAttribute('data-ds', String(j)); k.setAttribute('aria-hidden', 'true');
      if (rkGecer(a && a.rk)) { k.classList.add('ds-rk'); k.style.setProperty('--rk', rkGecer(a.rk)); }   /* CEVAP RENGİ */
      k.innerHTML = (cz ? '<svg class="cv-cizgi" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + cz + '</svg>' : '') + h;
      DS_CVA[y.getAttribute('data-sayfa') + ':' + j] = [];               /* CEVAP VURGU: yeni kurulan cevap kapalı (vurgulu kipte) */
      if (dsCvVurguMu(a) && !dsIzleyen()) [].forEach.call(k.querySelectorAll('[data-bs]'), function (e) { e.classList.add('ds-kapali'); });
      else [].forEach.call(k.querySelectorAll('[data-bs]'), function (e) { e.classList.add('ds-ciz'); });   /* hepsi birden: yazılarak / çizilerek gelir */
      y.appendChild(k);
      return true;
    }
    /* KALEM İZİ (13.11.2026) — açılan cevaplar sayfada yazılı kalır (ders kapansa, sayfa değişse, kitap yeniden açılsa da);
       silgi düğmesi etkinliğin yazılanlarını siler. Depo: localStorage 'kitapCevapKalem|kitap' → {'sayfa:adım': {n, L} | {h:1}} */
    var DS_KL = null, DS_KL_SILGI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 20H9L4 15a2 2 0 0 1 0-2.8l8.6-8.6a2 2 0 0 1 2.8 0l5 5a2 2 0 0 1 0 2.8L13 19"/><path d="M8.5 8.5l7 7"/></svg>';
    function dsKlOku() { if (!DS_KL) { try { DS_KL = JSON.parse(localStorage.getItem('kitapCevapKalem|' + KK_KITAP) || '{}') || {}; } catch (e) { DS_KL = {}; } } return DS_KL; }
    function dsKlYaz() { try { localStorage.setItem('kitapCevapKalem|' + KK_KITAP, JSON.stringify(DS_KL || {})); } catch (e) { } }
    function dsKlCanli(s, j) { var y = kkYuz(s); return !!(y && y.querySelector('.ds-cevap.ds-vek[data-ds="' + j + '"]')); }
    function dsKlKaydet(s, j) {                                       /* dersteki açık cevaplar → depo */
      if (dsIzleyen() || !dsKlCanli(s, j)) return;
      var a = dsAdimlar(s)[j]; if (!a || a.t !== 'cevap' || !dsCvVurguMu(a)) return;
      var K = dsKlOku(), k = s + ':' + j, L = (DS_CVA[k] || []).filter(function (b) { return typeof b === 'number'; }), e = K[k];
      if (L.length) { if (e && e.L && e.L.join(',') === L.join(',')) return; K[k] = { n: dsCvN(a), L: L.slice() }; }
      else if (e) delete K[k]; else return;
      dsKlYaz(); dsKlCiz();
    }
    function dsKlSil(s, J) {                                           /* silgi: etkinliğin yazılanları */
      var K = dsKlOku();
      J.forEach(function (j) { delete K[s + ':' + j]; if (dsKlCanli(s, j) && dsCvVurguMu(dsAdimlar(s)[j])) { DS_CVA[s + ':' + j] = []; dsCvUygula0(s, j); } });
      dsKlYaz(); dsKlCiz(); try { dsBarYaz(); } catch (e) { }
    }
    function dsKlCiz() {                                               /* derste olmayan yazılı cevaplar sayfanın üstünde */
      var kitap = flip && flip.kitap; if (!kitap) return;
      var gor = !!(dsVeri() && dsYetki() && !dsIzleyen()), K = gor ? dsKlOku() : {}, AN = Object.keys(K);
      [].forEach.call(kitap.querySelectorAll('.yuz[data-sayfa]'), function (yz) {
        var s = +yz.getAttribute('data-sayfa'), o = yz.querySelector(':scope > .ds-kalem-kap'), P = [], imza = '', L = null;
        AN.forEach(function (k) {
          var m = k.split(':'); if (+m[0] !== s) return;
          L = L || dsAdimlar(s); var j = +m[1], a = L[j], e = K[k];
          if (!a || a.t !== 'cevap' || !dsCevapVeri(a) || (e.L && e.n !== dsCvN(a))) return;
          var canli = !!yz.querySelector(':scope > .ds-cevap.ds-vek[data-ds="' + j + '"]');
          P.push({ j: j, a: a, e: e, canli: canli }); imza += j + (canli ? 'c' : '') + ':' + (e.h ? 'h' : e.L.join(',')) + '|';
        });
        if (!P.length) { if (o && o.parentNode) o.parentNode.removeChild(o); return; }
        if (o && o.getAttribute('data-imza') === imza) return;
        if (o && o.parentNode) o.parentNode.removeChild(o);
        o = document.createElement('div'); o.className = 'ds-kalem-kap'; o.setAttribute('data-imza', imza);
        P.forEach(function (p) {
          if (p.canli) return;
          var sahte = document.createElement('div'), k = s + ':' + p.j, vardi = Object.prototype.hasOwnProperty.call(DS_CVA, k), eski = DS_CVA[k], ok = false;
          sahte.setAttribute('data-sayfa', String(s));
          try { ok = dsCevapVekKur0(sahte, dsCevapVeri(p.a), p.j, p.a); } catch (x) { }
          if (vardi) DS_CVA[k] = eski; else delete DS_CVA[k];
          var el = ok && sahte.firstChild; if (!el) return;
          el.classList.remove('ds-cevap'); el.classList.add('ds-kalem'); el.removeAttribute('data-ds');
          [].forEach.call(el.querySelectorAll('[data-bs]'), function (x) {
            var g = !!p.e.h || x.getAttribute('data-bs').split(',').some(function (b) { return b !== '' && p.e.L.indexOf(+b) >= 0; });
            x.classList.remove('ds-ciz'); x.classList.toggle('ds-kapali', !g);
          });
          o.appendChild(el);
        });
        var gr = {};
        dsEtkinlikler(s).forEach(function (g) { P.forEach(function (p) { if (p.j >= g.bas && p.j <= g.son) (gr[g.bas] = gr[g.bas] || { g: g, J: [] }).J.push(p.j); }); });
        Object.keys(gr).forEach(function (b0) {
          var d = dsEbDugme(gr[b0].g), b = document.createElement('button'), J = gr[b0].J;
          b.type = 'button'; b.className = 'ds-kalem-sil'; b.style.left = (d.x + 6.6) + '%'; b.style.top = d.y + '%';
          b.title = 'Bu etkinlikte yazılan cevapları sil'; b.setAttribute('aria-label', b.title); b.innerHTML = DS_KL_SILGI;
          b.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
          b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); if (kkYanki(e) || dsIzleyen()) return; dsKlSil(s, J); });
          o.appendChild(b);
        });
        yz.appendChild(o);
      });
    }
    var dsCevapVekKur0 = dsCevapVekKur, dsCvUygula0 = dsCvUygula, dsTemizle0 = dsTemizle, dsEbCiz0 = dsEbCiz;
    dsCevapVekKur = function (y, Q, j, a) {                           /* kurulurken: önceden açılmış cevaplar açık gelir */
      var r = dsCevapVekKur0.apply(this, arguments);
      try {
        if (r && !dsIzleyen()) {
          var s = +y.getAttribute('data-sayfa'), k = s + ':' + j, K = dsKlOku(), e = K[k];
          if (dsCvVurguMu(a)) {
            if (e && e.L && e.n === dsCvN(a)) {
              DS_CVA[k] = e.L.slice(); dsCvUygula0(s, j);
              var el = y.querySelector('.ds-cevap.ds-vek[data-ds="' + j + '"]'); if (el) [].forEach.call(el.querySelectorAll('.ds-ciz'), function (x) { x.classList.remove('ds-ciz'); });
            }
          } else if (!e || !e.h) { K[k] = { h: 1 }; dsKlYaz(); }
          dsKlCiz();
        }
      } catch (x) { }
      return r;
    };
    dsCvUygula = function (s, j) { var r = dsCvUygula0.apply(this, arguments); try { dsKlKaydet(s, j); } catch (x) { } return r; };
    dsTemizle = function () { var r = dsTemizle0.apply(this, arguments); try { dsKlCiz(); } catch (x) { } return r; };
    dsEbCiz = function () { var r = dsEbCiz0.apply(this, arguments); try { dsKlCiz(); } catch (x) { } return r; };
    setInterval(function () { try { dsKlCiz(); } catch (x) { } }, 1500);
    /* HTML SAYFA (13.11.2026) — tezgâhta kurulan kitapta sayfaya yerleştirilen metin / görsel blokları (sayfalar.js) sayfanın üstünde */
    var HS = { yuk: 0, veri: null };
    function hsYukle() {
      var V = kok.KITAP_VERI || {}; if (HS.yuk || !(V.tezgah || V.htmlSayfa)) return; HS.yuk = 1;
      var s = document.createElement('script'); s.src = new URL('sayfalar.js?t=' + Date.now(), location.href).href;
      s.onload = function () { HS.yuk = 2; HS.veri = kok.KITAP_SAYFALAR || null; hsCiz(); }; s.onerror = function () { HS.yuk = 2; };
      document.head.appendChild(s);
    }
    function hsBlok(b) {
      if (!b || !(b.w > 0) || !(b.h > 0)) return null;
      if (b.t === 'calisma') return mcBlok(b);                          /* METİN ÇALIŞMASI (14.11.2026) */
      var e = document.createElement('div'), rk = /^#[0-9a-fA-F]{6}$/;
      e.style.left = (+b.x || 0) + '%'; e.style.top = (+b.y || 0) + '%'; e.style.width = +b.w + '%'; e.style.height = +b.h + '%';
      if (b.t === 'gorsel') {
        if (!/^gorsel\/[A-Za-z0-9._-]+$/.test(String(b.src || ''))) return null;
        e.className = 'hs-b hs-gorsel'; var i = new Image(); i.alt = ''; i.draggable = false; i.src = b.src; e.appendChild(i);
      } else {
        e.className = 'hs-b hs-metin'; e.dir = 'auto'; e.textContent = String(b.m || ''); e.style.fontSize = (+b.fs > 0 ? +b.fs : 3.2) + 'cqw';
        if (rk.test(b.rk || '')) e.style.color = b.rk; if (b.k) e.style.fontWeight = '700'; if (rk.test(b.zr || '')) e.style.background = b.zr;
        e.style.textAlign = b.hz === 'orta' ? 'center' : b.hz === 'son' ? 'end' : 'start';
      }
      return e;
    }
    function hsCiz() {
      var kitap = flip && flip.kitap; if (!kitap || !HS.veri || !HS.veri.sayfa) return;
      [].forEach.call(kitap.querySelectorAll('.yuz[data-sayfa]'), function (yz) {
        if (yz.querySelector(':scope > .hs-kat')) return;
        var B = HS.veri.sayfa[yz.getAttribute('data-sayfa')]; if (!Array.isArray(B) || !B.length) return;
        var o = document.createElement('div'); o.className = 'hs-kat';
        B.forEach(function (b) { var e = hsBlok(b); if (e) o.appendChild(e); });
        yz.appendChild(o);
      });
    }
    dsEbCiz = (function (f) { return function () { var r = f.apply(this, arguments); try { hsCiz(); mcSesGorunen(); } catch (x) { } return r; }; })(dsEbCiz);
    /* METİN ÇALIŞMASI (14.11.2026) · METİN ÇALIŞMASI 2 (14.11.2026) — «calisma» bloğu: renk eşleme · kelime anlamı · cümle çevirisi · üstte anlam · kök (çiçek / liste / kart) */
    /* KİTAP SİMGELERİ (14.11.2026): arayüz işaretleri SVG */
    var MC_IK = {oynat: '<svg class="mc-ik mc-ikd" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5Z"/></svg>', dur: '<svg class="mc-ik mc-ikd" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4.5" height="14" rx="1"/><rect x="13.5" y="5" width="4.5" height="14" rx="1"/></svg>', ayar: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h9M19 6h1M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="16" cy="6" r="2.4"/><circle cx="9" cy="12" r="2.4"/><circle cx="17" cy="18" r="2.4"/></svg>', tablo: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M3 14.5h18M9.5 4v16"/></svg>', kapat: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>', sol: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>', sag: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'};
    var MC = { panelKapali: true, ayar: null, harita: null, kokler: null, sozluk: null, listeler: null, liste: null, yuk: 0, bekle: [] };
    var MC_AD = [['renk', 'Renk', 'Arapça kelime ile Türkçesi aynı renkte'], ['kelime', 'Kelime', 'Kelimeye dokun: Türkçesi çıkar'], ['cumle', 'Cümle', 'Her cümlenin Türkçesi altında durur'], ['ustte', 'Üstte', 'Türkçe anlamlar kelimelerin üstünde durur'], ['kok', 'Kök', 'Kökleri incele: kelimeye dokun — kök çiçeği, liste ya da kelime kartı açılır']];
    var MC_RENK = ['#B91C1C', '#1D4ED8', '#047857', '#B45309', '#7E22CE', '#0E7490', '#BE185D', '#4D7C0F'];
    function mcAyar() {
      if (!MC.ayar) { try { MC.ayar = JSON.parse(localStorage.getItem('kitapCalisma|' + KK_KITAP) || 'null'); } catch (e) { } if (!MC.ayar || typeof MC.ayar !== 'object') MC.ayar = { kelime: 1, cumle: 0, ustte: 0, kok: 0 }; if (MC.ayar.renk === undefined) MC.ayar.renk = 1; mcAyarDuz(MC.ayar);
        if (MC.ayar.v !== 2) { var a2 = MC.ayar; a2.v = 2; a2.renk = 1; a2.km = 1; a2.cm = 1; a2.kok = 0; a2.yb = 1.5; mcAyarDuz(a2); } }   /* KİTAP İNDİR (14.11.2026): varsayılanlar (ayar sürümü 2) */
      return MC.ayar;
    }
    function mcUygula() {
      var A = mcAyar();
      [].forEach.call(document.querySelectorAll('.hs-calisma'), function (e) {
        e.classList.toggle('mc-cdokun', A.cm === 1);                   /* KİTAP ANAHTARLARI (14.11.2026) */
        [].forEach.call(e.querySelectorAll('.mc-sg'), function (s) { var v = A[s.getAttribute('data-g')]; s.classList.toggle('acik', !!v);
          [].forEach.call(s.querySelectorAll('button'), function (x) { var on = +x.getAttribute('data-v') === v; x.classList.toggle('acik', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); }); });
        MC_AD.forEach(function (a) { e.classList.toggle('mc-' + a[0], !!A[a[0]]); var b = e.querySelector('.mc-sw[data-a="' + a[0] + '"]'); if (b) { b.classList.toggle('acik', !!A[a[0]]); b.setAttribute('aria-pressed', A[a[0]] ? 'true' : 'false'); } });
      });
    }
    function mcSade(s) { return String(s || '').replace(/[ً-ْٰـ]/g, '').replace(/[^ء-ي]/g, ''); }
    /* KİTAP GÖRÜNÜMÜ (14.11.2026): sınıf + sayfa yazılı blokta ses dosyaları kendiliğinden aranır · «Dinle» sırayla okur */
    function mcSesOn(b) {
      var sn = parseInt(b.sn, 10), sy = parseInt(b.sy, 10); if (!(sn >= 1 && sn <= 12) || !(sy >= 1 && sy <= 999)) return '';
      var S = (HS.veri && HS.veri.sayfa) || {}, ayni = [];
      Object.keys(S).sort(function (x, y) { return x - y; }).forEach(function (s) { (S[s] || []).forEach(function (x) { if (x && x.t === 'calisma' && Array.isArray(x.c) && parseInt(x.sn, 10) === sn && parseInt(x.sy, 10) === sy) ayni.push(x); }); });
      var k = ayni.indexOf(b);
      return 'ses/' + sn + '-sinif/s' + ('00' + sy).slice(-3) + '/' + (ayni.length > 1 && k >= 0 ? (k + 1) + '-' : '');
    }
    function mcSesTum(e) { var t = e.querySelector('.mc-tumses'); if (t) t.hidden = !e.querySelector('.mc-ses:not(.mc-oto)'); }
    function mcSesYokla(e) {
      if (e.mcYok) return; e.mcYok = 1; mcSesTum(e);
      [].forEach.call(e.querySelectorAll('.mc-ses.mc-oto'), function (sb) {
        var a = new Audio(); a.preload = 'metadata';
        a.onloadedmetadata = function () { a.onloadedmetadata = null; sb.classList.remove('mc-oto'); mcSesTum(e); try { a.removeAttribute('src'); a.load(); } catch (x) { } };
        a.onerror = function () { a.onerror = null; };
        a.src = new URL(sb.getAttribute('data-s'), location.href).href;
      });
    }
    function mcSesGorunen() {
      kkGorunen().forEach(function (s) { var y = kkYuz(s); if (y) [].forEach.call(y.querySelectorAll('.hs-calisma'), mcSesYokla); });
    }
    function mcSesDur(tum) {
      try { if (MC.ses) { MC.ses.onended = MC.ses.onerror = null; MC.ses.pause(); } } catch (x) { } MC.ses = null;
      [].forEach.call(document.querySelectorAll('.mc-ses.calan'), function (x) { x.classList.remove('calan'); x.innerHTML = MC_IK.oynat; });
      [].forEach.call(document.querySelectorAll('.mc-c.mc-okunan'), function (x) { x.classList.remove('mc-okunan'); });
      if (tum) [].forEach.call(document.querySelectorAll('.mc-tumses.calan'), function (x) { x.classList.remove('calan'); x.innerHTML = MC_IK.oynat + ' Dinle'; });
    }
    function mcSesCal(e, sb, sira) {
      var caliyordu = sb.classList.contains('calan'); mcSesDur(!sira); if (caliyordu && !sira) return;
      var au = new Audio(new URL(sb.getAttribute('data-s') + '?v=' + (sb.getAttribute('data-v') || 0), location.href).href), cc = sb.closest('.mc-c'), g = e.querySelector('.mc-govde'); MC.ses = au;
      sb.classList.add('calan'); sb.innerHTML = MC_IK.dur;
      if (cc) { cc.classList.add('mc-okunan');
        if (sira && g) { var gr = g.getBoundingClientRect(), cr = cc.getBoundingClientRect(), o = gr.height > 0 ? g.clientHeight / gr.height : 1;
          if (cr.top < gr.top || cr.bottom > gr.bottom) g.scrollTop += (cr.top - gr.top) * o - g.clientHeight * 0.25; } }
      var bitti = function (hata) {
        if (MC.ses !== au) return;
        var L = [].slice.call(e.querySelectorAll('.mc-ses:not(.mc-oto)')), nx = (sira && !hata) ? L[L.indexOf(sb) + 1] : null;
        if (!nx) { mcSesDur(true); return; }
        sb.classList.remove('calan'); sb.innerHTML = MC_IK.oynat; if (cc) cc.classList.remove('mc-okunan');
        setTimeout(function () { if (MC.ses === au) mcSesCal(e, nx, true); }, 350);
      };
      au.onended = function () { bitti(false); }; au.onerror = function () { bitti(true); };
      au.play().catch(function () { if (MC.ses === au) { mcSesDur(true); try { kkTost('Ses çalınamadı'); } catch (x) { } } });
    }
    function mcSesSira(e, tm) {
      var caliyordu = tm.classList.contains('calan'); mcSesDur(true); if (caliyordu) return;
      var ilk = e.querySelector('.mc-ses:not(.mc-oto)'); if (!ilk) return;
      tm.classList.add('calan'); tm.innerHTML = MC_IK.dur + ' Durdur'; mcSesCal(e, ilk, true);
    }
    /* KİTAP ANAHTARLARI (14.11.2026): Kelime [dokun | üstte] · Cümle [dokun | tümü] iki tuşlu · sürükleyerek kaydırma */
    function mcAyarDuz(a) {
      if (a.km !== 0 && a.km !== 1 && a.km !== 2) a.km = a.ustte ? 2 : (a.kelime ? 1 : 0);
      if (a.cm !== 0 && a.cm !== 1 && a.cm !== 2) a.cm = a.cumle ? 2 : 1;
      a.kelime = a.km ? 1 : 0; a.ustte = a.km === 2 ? 1 : 0; a.cumle = a.cm === 2 ? 1 : 0;
      if (a.kt !== 1 && a.kt !== 2) a.kt = 0;                          /* KİTAP KÖK GÖRÜNÜMÜ (14.11.2026): 0 çiçek · 1 dal · 2 kart */
    }
    function mcAnahtarHtml() {
      var sw = function (a) { return '<button type="button" class="mc-sw" data-a="' + a[0] + '" title="' + a[2] + '"><i></i>' + a[1] + '</button>'; };
      var sg = function (g, ad, t1, i1, t2, i2) { return '<span class="mc-sg" data-g="' + g + '"><em>' + ad + '</em><button type="button" data-v="1" title="' + i1 + '">' + t1 + '</button><button type="button" data-v="2" title="' + i2 + '">' + t2 + '</button></span>'; };
      return sw(MC_AD[0]) + sg('km', 'Kelime', 'dokun', 'Kelimeye dokun: Türkçesi çıkar', 'üstte', 'Türkçe anlamlar kelimelerin üstünde durur') +
        sg('cm', 'Cümle', 'dokun', 'Cümleye dokun: Türkçesi altında açılır', 'tümü', 'Bütün cümlelerin Türkçesi açık durur') + sw(MC_AD[4]);
    }
    function mcKaydir(e) {                                            /* parmak / kalem / fare ile sürükleyerek kaydır (sahne touch-action:none olduğu için elle) */
      var g = e.querySelector('.mc-govde'), K = null, an = 0; if (!g) return;
      var oran = function () { var r = g.getBoundingClientRect(); return r.height > 0 ? g.clientHeight / r.height : 1; };
      g.addEventListener('pointerdown', function (ev) {
        if (ev.pointerType === 'mouse' && ev.button !== 0) return; if (an) { cancelAnimationFrame(an); an = 0; }
        if (mcBos(ev) && sahne.classList.contains('yakin')) return;      /* KİTAP BOŞLUK: yakınken boşluktan sürükleme sayfayı gezdirir */
        K = { id: ev.pointerId, y: ev.clientY, s: g.scrollTop, t: false, ly: ev.clientY, lt: ev.timeStamp, v: 0, o: oran() };
      });
      g.addEventListener('pointermove', function (ev) {
        if (!K || ev.pointerId !== K.id) return; var dy = ev.clientY - K.y;
        if (!K.t) { if (Math.abs(dy) < 6) return; K.t = true; try { g.setPointerCapture(K.id); } catch (x) { } }
        g.scrollTop = K.s - dy * K.o;
        var dt = ev.timeStamp - K.lt; if (dt > 0) { K.v = 0.7 * ((ev.clientY - K.ly) * K.o / dt) + 0.3 * K.v; K.ly = ev.clientY; K.lt = ev.timeStamp; }
        if (ev.cancelable) ev.preventDefault();
      });
      var bit = function (ev) {
        if (!K || ev.pointerId !== K.id) return; var k = K; K = null; if (!k.t) return;
        e.mcSur = Date.now(); try { g.releasePointerCapture(k.id); } catch (x) { }
        var v = (ev.timeStamp - k.lt < 80) ? k.v : 0, son = 0;       /* atalet: px/ms */
        if (Math.abs(v) < 0.15) return;
        var adim = function (t) { if (!son) son = t; var dt = Math.min(40, t - son); son = t; g.scrollTop -= v * dt; v *= Math.pow(0.95, dt / 16); an = Math.abs(v) > 0.03 ? requestAnimationFrame(adim) : 0; };
        an = requestAnimationFrame(adim);
      };
      g.addEventListener('pointerup', bit); g.addEventListener('pointercancel', bit);
    }
    /* KİTAP PANELİ (14.11.2026): anahtarlar «Görünüm» penceresinde · FİİL TABLOSU: çiçekte fiile dokun → çekim tabloları */
    function mcAyarDugme() { return '<button type="button" class="mc-ayarb" title="Görünüm ayarları: renk, kelime, cümle, kök" aria-label="Görünüm ayarları">' + MC_IK.ayar + '</button>'; }
    function mcPanelHtml() {
      var sat = function (ad, ip, ic) { return '<div class="mc-pr"><span class="mc-pa"><b>' + ad + '</b><small>' + ip + '</small></span>' + ic + '</div>'; };
      var sw = function (a) { return '<button type="button" class="mc-sw" data-a="' + a + '" aria-label="Aç / kapat"><i></i></button>'; };
      var sg = function (g, t2) { return '<span class="mc-sg" data-g="' + g + '"><button type="button" data-v="0">kapalı</button><button type="button" data-v="1">dokun</button><button type="button" data-v="2">' + t2 + '</button></span>'; };
      return '<div class="mc-panel" role="dialog" aria-label="Görünüm ayarları"><div class="mc-pb"><b>Görünüm</b><button type="button" class="mc-pkapat" aria-label="Kapat" title="Kapat (Ayarlar ile yeniden açılır)">' + MC_IK.kapat + '</button></div>' +
        sat('Renk eşleme', 'Arapça kelime ile Türkçesi aynı renkte', sw('renk')) +
        sat('Kelime anlamı', 'dokun: kelimeye dokununca · üstte: hep görünür', sg('km', 'üstte')) +
        sat('Cümle çevirisi', 'dokun: TR düğmesine dokununca · tümü: hep görünür', sg('cm', 'tümü')) +
        sat('Kök inceleme', 'Kelimeye dokun: kök penceresi, liste ya da kart', sw('kok')) +
        sat('Kök görünümü', 'Kök penceresinin tasarımı', '<span class="mc-sg" data-g="kt"><button type="button" data-v="0">çiçek</button><button type="button" data-v="1">dal</button><button type="button" data-v="2">kart</button></span>') +   /* KİTAP KÖK GÖRÜNÜMÜ (14.11.2026) */
        '</div>';
    }
    var MC_HRK = /[ً-ْٰ]+$/;
    var MC_ZAMIR = ['هُوَ', 'هُمَا', 'هُمْ', 'هِيَ', 'هُمَا', 'هُنَّ', 'أَنْتَ', 'أَنْتُمَا', 'أَنْتُمْ', 'أَنْتِ', 'أَنْتُمَا', 'أَنْتُنَّ', 'أَنَا', 'نَحْنُ'];
    var MC_ZTR = ['o (erkek)', 'o ikisi (erkek)', 'onlar (erkek)', 'o (kadın)', 'o ikisi (kadın)', 'onlar (kadın)', 'sen (erkek)', 'siz ikiniz', 'siz (erkek)', 'sen (kadın)', 'siz ikiniz', 'siz (kadın)', 'ben', 'biz'];
    var MC_MZ = ['َ', 'َا', 'ُوا', 'َتْ', 'َتَا', 'ْنَ', 'ْتَ', 'ْتُمَا', 'ْتُمْ', 'ْتِ', 'ْتُمَا', 'ْتُنَّ', 'ْتُ', 'ْنَا'];
    var MC_MU = [['ي', 0], ['ي', 1], ['ي', 2], ['ت', 0], ['ت', 1], ['ي', 3], ['ت', 0], ['ت', 1], ['ت', 2], ['ت', 4], ['ت', 1], ['ت', 3], ['أ', 0], ['ن', 0]];
    var MC_EK = { r: ['ُ', 'َانِ', 'ُونَ', 'ْنَ', 'ِينَ'], n: ['َ', 'َا', 'ُوا', 'ْنَ', 'ِي'], c: ['ْ', 'َا', 'ُوا', 'ْنَ', 'ِي'] };
    function mcEkle(g, ek) {                                          /* سَكَتْ + تُ → سَكَتُّ · يَسْكُنْ + نَ → يَسْكُنَّ */
      var m = /^ْ([ء-ي])([\s\S]*)$/.exec(ek);
      if (m && g.charAt(g.length - 1) === m[1]) return g + 'ّ' + m[2];
      return g + ek;
    }
    function mcFiilDuzenli(kok, mazi) {
      var r = String(kok || ''); mazi = String(mazi || '');
      if (/[ويى]/.test(r) || /[ءأؤئإآ]/.test(r.slice(1)) || (r.length === 3 && r.charAt(1) === r.charAt(2))) return false;
      if (/^آ/.test(mazi) || /ّ/.test((MC_HRK.exec(mazi) || [''])[0]) || /[ىا]$/.test(mazi.replace(MC_HRK, ''))) return false;
      return true;
    }
    /* KİTAP SARF (14.11.2026): çekimler kalıplar tablosunun motorundan üretilen fiilcekim.js'ten */
    function mcCekimYukle(sonra) {
      if (MC.cekim !== undefined) { sonra(); return; }
      var s = document.createElement('script'); s.src = new URL('fiilcekim.js?t=' + Date.now(), location.href).href;
      s.onload = function () { MC.cekim = kok.KITAP_CEKIM || null; sonra(); }; s.onerror = function () { MC.cekim = null; sonra(); };
      document.head.appendChild(s);
    }
    function mcKokRenk(s, kk, onEk) {                                  /* kök harfleri düz, ekler <i> (kırmızı) */
      var R = String(kk || '').split(''), ri = 0, h = '', ek = '', i = 0, n = s.length, HR = /[ً-ْٰـ]/, Z = 'اأإآءؤئىويٱ', ilk = true;
      var es = function (c, r) { return c === r || (Z.indexOf(r) >= 0 && Z.indexOf(c) >= 0); };
      while (i < n) {
        var c = s.charAt(i), j = i + 1; while (j < n && HR.test(s.charAt(j))) j++;
        var p = s.slice(i, j), km = false;
        if (c === ' ') { ek += p; i = j; continue; }
        if (!(onEk && ilk) && ri < R.length) {
          if (es(c, R[ri])) { km = true; ri++; }
          else if (ri + 1 < R.length && Z.indexOf(R[ri]) >= 0 && es(c, R[ri + 1])) { km = true; ri += 2; }   /* düşen illet harfi */
        }
        ilk = false;
        if (km) { if (ek) { h += '<i>' + kkEsc(ek) + '</i>'; ek = ''; } h += kkEsc(p); } else ek += p;
        i = j;
      }
      if (ek) h += '<i>' + kkEsc(ek) + '</i>';
      return ri >= 2 ? h : kkEsc(s);
    }
    function mcCezm(w, i, tur) {                                       /* muzâri → meczum ('c': لَمْ) / mansub ('n': لَنْ) — kalıplar tablosundaki kurallar */
      if (i === 1 || i === 4 || i === 7 || i === 10) return w.replace(/نِ?$/, '');
      if (i === 2 || i === 8) return w.replace(/نَ?$/, 'ا');
      if (i === 9) return w.replace(/نَ?$/, '');
      if (i === 5 || i === 11) return w;
      if (/ّ/.test(w.slice(-2))) return w.replace(/[ً-ْ]+$/, 'َّ');
      if (tur === 'c') {
        if (/ُ$/.test(w)) return w.replace(/ُ$/, 'ْ').replace(/ُ?و([ء-ي])ْ$/, 'ُ$1ْ').replace(/ِ?ي([ء-ي])ْ$/, 'ِ$1ْ').replace(/َ?ا([ء-ي])ْ$/, 'َ$1ْ');
        if (/ِي$/.test(w)) return w.replace(/ِي$/, 'ِ');
        if (/ُو$/.test(w)) return w.replace(/ُو$/, 'ُ');
        if (/َى$/.test(w)) return w.replace(/َى$/, 'َ');
        if (/ا$/.test(w)) return w.replace(/ا$/, 'َ');
        return w;
      }
      if (/ُ$/.test(w)) return w.replace(/ُ$/, 'َ');
      if (/ِي$/.test(w) || /ُو$/.test(w)) return w + 'َ';
      return w;
    }
    function mcNehiy(w, bab, kk) {                                     /* emir → nehiy gövdesi (لَا'dan sonrası) */
      var c = ((bab === 7 || bab === 8 || bab === 9) ? 'تُ' : 'تَ') + String(w).replace(/^[اأإآء][ً-ٟ]*/, '');
      if (kk === 'أخذ' && c.indexOf('تَخُذ') === 0) c = c.replace('تَخُذ', 'تَأْخُذ');
      else if (kk === 'أكل' && c.indexOf('تَكُل') === 0) c = c.replace('تَكُل', 'تَأْكُل');
      else if (kk === 'أمر' && c.indexOf('تَمُر') === 0) c = c.replace('تَمُر', 'تَأْمُر');
      return c;
    }
    function mcCekim(f, kk) {                                          /* her tablo tek zaman / tek olumsuzluk; f[8]: kalıp no */
      var U = function (s) { return '<u>' + s + '</u> '; }, kisa = function (s) { return String(s || '').split(' / ')[0].replace(/[.?!]+$/, ''); }, T = [];
      var D = MC.cekim && MC.cekim[kk] && MC.cekim[kk][f[8]];
      if (D && D[0]) {                                                 /* kalıplar tablosu verisi */
        var mz = D[0].split('|'), mu = D[1] ? D[1].split('|') : null, em = D[2] ? D[2].split('|') : null, bab = +D[3] || 1;
        T.push({ g: 0, ad: 'Malum Mâzi', alt: 'olumlu', tr: kisa(f[1]), R: 'tam', h: function (i) { return mcKokRenk(mz[i], kk, false); } });
        T.push({ g: 0, ad: 'Menfi Mâzi', alt: 'olumsuz · مَا', tr: '…‑medi', R: 'tam', h: function (i) { return U('مَا') + mcKokRenk(mz[i], kk, false); } });
        if (mu) {
          T.push({ g: 0, ad: 'Cehd‑i Mutlak', alt: 'olumsuz · لَمْ', tr: '…‑medi', R: 'tam', h: function (i) { return U('لَمْ') + mcKokRenk(mcCezm(mu[i], i, 'c'), kk, true); } });
          T.push({ g: 1, ad: 'Malum Muzâri', alt: 'olumlu', tr: kisa(f[6]), R: 'tam', h: function (i) { return mcKokRenk(mu[i], kk, true); } });
          T.push({ g: 1, ad: 'Menfi Muzâri', alt: 'olumsuz · لَا', tr: '…‑mez / ‑miyor', R: 'tam', h: function (i) { return U('لَا') + mcKokRenk(mu[i], kk, true); } });
          T.push({ g: 1, ad: 'Nefy‑i İstikbal', alt: 'gelecek olumsuz · لَنْ', tr: '…‑meyecek', R: 'tam', h: function (i) { return U('لَنْ') + mcKokRenk(mcCezm(mu[i], i, 'n'), kk, true); } });
        }
        if (em) {
          T.push({ g: 2, ad: 'Emir', alt: 'olumlu', tr: kisa(f[7]), R: 'emir', h: function (i) { return mcKokRenk(em[i - 6], kk, false); } });
          T.push({ g: 2, ad: 'Nehiy', alt: 'olumsuz emir · لَا', tr: '…‑me!', R: 'emir', h: function (i) { return U('لَا') + mcKokRenk(mcNehiy(em[i - 6], bab, kk), kk, true); } });
        }
        return { T: T, duz: true };
      }
      /* veride yok: düz ek ekleme (sâlim) ya da temel biçim */
      var duz = mcFiilDuzenli(kk, f[0]), mz0 = String(f[0] || '').replace(MC_HRK, ''), govde = f[4] ? String(f[4]).slice(1).replace(MC_HRK, '') : '', em0 = f[5] ? String(f[5]).replace(MC_HRK, '') : '';
      var bol = function (s) { var m = /^([ً-ْٰ]*)([\s\S]*)$/.exec(s); return kkEsc(m[1]) + (m[2] ? '<i>' + kkEsc(m[2]) + '</i>' : ''); };
      var mazi = function (i) { if (!duz) return kkEsc(String(f[0])); return kkEsc(mz0) + bol(mcEkle(mz0, MC_MZ[i]).slice(mz0.length)); };
      var muz = function (i, tur) {
        if (!duz) return kkEsc(String(f[4]));
        var p = MC_MU[i][0], ek = MC_EK[tur][MC_MU[i][1]], g = govde, on;
        if (p === 'أ' && /^َأْ/.test(g)) { g = g.slice(3); on = '<i>آ</i>'; }
        else { var m = /^([ً-ْٰ]*)([\s\S]*)$/.exec(g); on = '<i>' + p + kkEsc(m[1]) + '</i>'; g = m[2]; }
        return on + kkEsc(g) + bol(mcEkle(g, ek).slice(g.length));
      };
      var emir = function (i) { if (!duz) return kkEsc(String(f[5])); return kkEsc(em0) + bol(mcEkle(em0, MC_EK.c[MC_MU[i][1]]).slice(em0.length)); };
      var R = duz ? 'tam' : 'tek';
      T.push({ g: 0, ad: 'Malum Mâzi', alt: 'olumlu', tr: kisa(f[1]), R: R, h: mazi });
      T.push({ g: 0, ad: 'Menfi Mâzi', alt: 'olumsuz · مَا', tr: '…‑medi', R: R, h: function (i) { return U('مَا') + mazi(i); } });
      if (duz && govde) T.push({ g: 0, ad: 'Cehd‑i Mutlak', alt: 'olumsuz · لَمْ', tr: '…‑medi', R: R, h: function (i) { return U('لَمْ') + muz(i, 'c'); } });
      if (govde) {
        T.push({ g: 1, ad: 'Malum Muzâri', alt: 'olumlu', tr: kisa(f[6]), R: R, h: function (i) { return muz(i, 'r'); } });
        T.push({ g: 1, ad: 'Menfi Muzâri', alt: 'olumsuz · لَا', tr: '…‑mez / ‑miyor', R: R, h: function (i) { return U('لَا') + muz(i, 'r'); } });
        if (duz) T.push({ g: 1, ad: 'Nefy‑i İstikbal', alt: 'gelecek olumsuz · لَنْ', tr: '…‑meyecek', R: R, h: function (i) { return U('لَنْ') + muz(i, 'n'); } });
      }
      if (em0) T.push({ g: 2, ad: 'Emir', alt: 'olumlu', tr: kisa(f[7]), R: duz ? 'emir' : 'tek2', h: emir });
      if (duz && govde) T.push({ g: 2, ad: 'Nehiy', alt: 'olumsuz emir · لَا', tr: '…‑me!', R: 'emir', h: function (i) { return U('لَا') + muz(i, 'c'); } });
      return { T: T, duz: duz };
    }
    function mcTabloKapat() { var p = document.getElementById('mcTablo'); if (p && p.parentNode) p.parentNode.removeChild(p); }
    function mcTablo(f, kok) { mcCekimYukle(function () { mcTabloAc(f, kok); }); }
    function mcTabloAc(f, kok) {
      mcTabloKapat();
      var C = mcCekim(f, kok), T = C.T, akt = 0, p = document.createElement('div'); p.id = 'mcTablo'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Fiil çekim tablosu');
      var GR = ['Mâzi', 'Muzâri', 'Emir'], SAT = { tam: [[0, 1, 2, 'er', 'gâib'], [3, 4, 5, 'ka', 'gâibe'], [6, 7, 8, 'er', 'muhâtab'], [9, 10, 11, 'ka', 'muhâtaba'], [12, 13, 13, 'bn', 'mütekellim']], emir: [[6, 7, 8, 'er', 'muhâtab'], [9, 10, 11, 'ka', 'muhâtaba']] };
      var ciz = function () {
        var t = T[akt], h;
        if (SAT[t.R]) {
          h = '<table class="mt-g" dir="rtl"><thead><tr><th>Müfred</th><th>Tesniye</th><th>Cemi</th></tr></thead><tbody>' +
            SAT[t.R].map(function (s) { return '<tr class="' + s[3] + '" title="' + s[4] + '">' + [0, 1, 2].map(function (k) { return '<td lang="ar" title="' + MC_ZAMIR[s[k]] + ' · ' + MC_ZTR[s[k]] + '">' + t.h(s[k]) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
        } else h = '<div class="mt-tek" lang="ar" dir="rtl">' + t.h(t.R === 'tek2' ? 6 : 0) + '</div>';
        p.querySelector('.mt-govde').innerHTML = h;
        p.querySelector('.mt-ad').innerHTML = '<b>' + kkEsc(t.ad) + '</b><span dir="auto">' + kkEsc(t.alt) + '</span><small>' + kkEsc(t.tr || '') + '</small>';
        [].forEach.call(p.querySelectorAll('.mt-tabs button'), function (b) { b.classList.toggle('acik', +b.getAttribute('data-g') === t.g); });
        [].forEach.call(p.querySelectorAll('.mt-nok > i'), function (b, bi) { b.classList.toggle('acik', bi === akt); });
        [].forEach.call(p.querySelectorAll('.mt-ok'), function (b) { var y = +b.getAttribute('data-y'); b.disabled = akt + y < 0 || akt + y >= T.length; });
      };
      var grup = []; T.forEach(function (t) { if (grup.indexOf(t.g) < 0) grup.push(t.g); });
      p.innerHTML = '<div class="mt-kart"><div class="mt-ust"><span class="mt-bas"><b lang="ar" dir="rtl">' + kkEsc(String(f[0] || '')) + (f[4] ? ' <i>—</i> ' + kkEsc(String(f[4])) : '') + '</b><small>' + kkEsc(String(f[1] || '')) + '</small></span>' +
        '<span class="mt-tabs">' + grup.map(function (g) { return '<button type="button" data-g="' + g + '">' + GR[g] + '</button>'; }).join('') + '</span><button type="button" class="mt-kapat" aria-label="Kapat">' + MC_IK.kapat + '</button></div>' +
        '<div class="mt-sek"><button type="button" class="mt-ok" data-y="1" aria-label="Sonraki tablo">' + MC_IK.sol + '</button><span class="mt-ad"></span><button type="button" class="mt-ok" data-y="-1" aria-label="Önceki tablo">' + MC_IK.sag + '</button></div>' +
        '<div class="mt-govde"></div><div class="mt-nok">' + T.map(function () { return '<i></i>'; }).join('') + '</div>' +
        (C.duz ? '' : '<div class="mt-not">Bu fiil illetli, şeddeli ya da hemzeli: çekimde harf değişir. Yanlış biçim göstermemek için yalnız temel biçimler verildi.</div>') + '</div>';
      var git = function (y) { var n = akt + y; if (n < 0 || n >= T.length) return; akt = n; ciz(); };
      ['pointerdown', 'touchstart', 'wheel'].forEach(function (t) { p.addEventListener(t, function (ev) { ev.stopPropagation(); }, { passive: true }); });
      var x0 = null;
      p.addEventListener('pointerdown', function (ev) { x0 = { x: ev.clientX, y: ev.clientY }; });
      p.addEventListener('pointerup', function (ev) { if (!x0) return; var dx = ev.clientX - x0.x, dy = ev.clientY - x0.y; x0 = null; if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) { git(dx > 0 ? 1 : -1); p.mtSur = Date.now(); } });
      p.addEventListener('click', function (ev) {
        ev.stopPropagation(); if (p.mtSur && Date.now() - p.mtSur < 400) return;
        if (ev.target === p || ev.target.closest('.mt-kapat')) { mcTabloKapat(); return; }
        var ok = ev.target.closest('.mt-ok'); if (ok) { git(+ok.getAttribute('data-y')); return; }
        var tb = ev.target.closest('.mt-tabs button'); if (tb) { var g = +tb.getAttribute('data-g'); for (var i = 0; i < T.length; i++) if (T[i].g === g) { akt = i; break; } ciz(); }
      });
      p.mtGit = git; document.body.appendChild(p); ciz();
    }
    function mcKokLevha(k) {                                           /* كتب → كـ ـتـ ـب · ولد → و لـ ـد (harfin bitişme biçimi) */
      var L = String(k || '').split(''), n = L.length, baglamaz = 'اأإآدذرزوؤءى';
      return L.map(function (c, i) { var sonra = i < n - 1 && baglamaz.indexOf(c) < 0 && L[i + 1] !== 'ء', once = i > 0 && baglamaz.indexOf(L[i - 1]) < 0 && c !== 'ء'; return (once ? 'ـ' : '') + c + (sonra ? 'ـ' : ''); }).join(' ');
    }
    /* KİTAP SİMGE SATIRI (14.11.2026): başlıkta yalnız simgeler — yazı boyu · dizilim · indir · yazdır */
    var MC_IK2 = {kucuk: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19 8.5 6 14 19M5 14.5h7"/><path d="M16.5 9h5"/></svg>', buyuk: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19 8.5 6 14 19M5 14.5h7"/><path d="M16.5 9h5M19 6.5v5"/></svg>', hz0: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M10 10.5h10M6 15h14M12 19.5h8"/></svg>', hz1: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 10.5h10M5 15h14M8 19.5h8"/></svg>', hz2: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h7M3 12h6M3 17h7M14 7h7M15 12h6M14 17h7"/><path d="M12 4v16" stroke-dasharray="2 2.5"/></svg>', indir: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>', yazici: '<svg class="mc-ik" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2"/><rect x="7" y="14" width="10" height="6" rx="1"/></svg>'};
    function mcPdfDugme() {
      var d = function (cls, ek, ip, ic) { return '<button type="button" class="mc-ib ' + cls + '"' + ek + ' title="' + ip + '" aria-label="' + ip + '">' + ic + '</button>'; };
      return d('mc-yb', ' data-d="-1"', 'Yazıyı küçült', MC_IK2.kucuk) + d('mc-yb', ' data-d="1"', 'Yazıyı büyüt', MC_IK2.buyuk) +
        d('mc-hzb', '', 'Dizilim: sağdan · ortalı · karşılıklı (dokundukça değişir)', MC_IK2.hz0) +
        d('mc-pdf', ' data-is="indir"', 'PDF olarak indir', MC_IK2.indir) + d('mc-pdf', ' data-is="yazdir"', 'Yazdır', MC_IK2.yazici);
    }
    /* KİTAP SİMETRİ (14.11.2026): Arapça ile Türkçesi yarım satıra sığıyorsa karşılıklı (sağ yarı Arapça · sol yarı Türkçe) */
    function mcSimOlc(kokEl, selC, selAr, selTr, cls) {
      var C = [].slice.call(kokEl.querySelectorAll(selC)); C.forEach(function (c) { c.classList.add(cls); });
      var ok = C.map(function (c) { var a = c.querySelector(selAr), t = c.querySelector(selTr); if (!a || !t || !a.clientWidth) return false; return a.scrollWidth <= a.clientWidth + 1 && t.scrollWidth <= t.clientWidth + 1; });
      C.forEach(function (c, i) { if (!ok[i]) c.classList.remove(cls); });
    }
    function mcSimetri(e) {
      if (!e || !e.clientWidth) return; var k = e.clientWidth + '|' + e.className.replace(/\s*mc-pkapali/, '') + '|' + e.style.getPropertyValue('--mc-yb'); if (e.mcSimK === k) return; e.mcSimK = k;
      if (!e.classList.contains('mc-kar')) { [].forEach.call(e.querySelectorAll('.mc-c.mc-sim'), function (x) { x.classList.remove('mc-sim'); }); return; }
      mcSimOlc(e, '.mc-c', '.mc-ar', '.mc-ctr', 'mc-sim');
    }
    mcUygula = (function (f) { return function () {                   /* yazı boyu (yb) · dizilim (hz: 0 sağdan, 1 ortalı, 2 karşılıklı) */
      var A = mcAyar(); if (A.hz !== 1 && A.hz !== 2) A.hz = 0; if (!(A.yb >= 0.7 && A.yb <= 2)) A.yb = 1;
      var r = f.apply(this, arguments);
      try { [].forEach.call(document.querySelectorAll('.hs-calisma'), function (e) {
        e.classList.toggle('mc-orta', A.hz === 1); e.classList.toggle('mc-kar', A.hz === 2); e.style.setProperty('--mc-yb', String(A.yb));
        var hb = e.querySelector('.mc-hzb'); if (hb && hb.getAttribute('data-hz') !== String(A.hz)) { hb.innerHTML = MC_IK2['hz' + A.hz]; hb.setAttribute('data-hz', String(A.hz)); }
        [].forEach.call(e.querySelectorAll('.mc-yb'), function (x) { x.disabled = (+x.getAttribute('data-d') < 0) ? A.yb <= 0.7 : A.yb >= 2; }); mcSimetri(e); }); } catch (x) { }
      return r; }; })(mcUygula);
    mcSesGorunen = (function (f) { return function () { var r = f.apply(this, arguments); try { kkGorunen().forEach(function (s) { var y = kkYuz(s); if (y) [].forEach.call(y.querySelectorAll('.hs-calisma'), mcSimetri); }); } catch (x) { } return r; }; })(mcSesGorunen);
    document.addEventListener('click', function () { setTimeout(function () { MC.panelYut = 0; }, 0); }, true);   /* pencereyi kapatan dokunuşun tıklaması bitince bayrak iner */
    try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { [].forEach.call(document.querySelectorAll('.hs-calisma'), function (e) { e.mcSimK = ''; mcSimetri(e); }); }); } catch (x) { }
    /* KİTAP ÇUBUK (14.11.2026): kendi kaydırma çubuğumuz — dokununca kalınlaşır, dokunma alanı geniş */
    function mcCubuk(e) {
      var g = e.querySelector('.mc-govde'), c = e.querySelector('.mc-cb'); if (!g || !c) return;
      var sh = g.scrollHeight, ch = g.clientHeight; if (!ch || sh <= ch + 1) { c.hidden = true; return; }
      c.hidden = false; c.style.top = g.offsetTop + 'px'; c.style.height = g.offsetHeight + 'px';
      var boy = Math.max(0.08, ch / sh), ust = (g.scrollTop / (sh - ch)) * (1 - boy);
      c.firstChild.style.height = (boy * 100) + '%'; c.firstChild.style.top = (ust * 100) + '%';
    }
    function mcCubukKur(e) {
      var g = e.querySelector('.mc-govde'); if (!g) return;
      var c = document.createElement('div'); c.className = 'mc-cb'; c.hidden = true; c.innerHTML = '<i></i>'; e.appendChild(c);
      g.addEventListener('scroll', function () { mcCubuk(e); }, { passive: true });
      var S = null;
      var git = function (ev) { var cr = c.getBoundingClientRect(), yol = cr.height - c.firstChild.getBoundingClientRect().height; if (yol <= 0) return; g.scrollTop = Math.max(0, Math.min(1, (ev.clientY - cr.top - S.of) / yol)) * (g.scrollHeight - g.clientHeight); };
      c.addEventListener('pointerdown', function (ev) {
        if (ev.pointerType === 'mouse' && ev.button !== 0) return; ev.stopPropagation(); if (ev.cancelable) ev.preventDefault();
        var tr = c.firstChild.getBoundingClientRect(), ic = ev.clientY >= tr.top && ev.clientY <= tr.bottom;
        S = { id: ev.pointerId, of: ic ? ev.clientY - tr.top : tr.height / 2 }; c.classList.add('tut'); try { c.setPointerCapture(ev.pointerId); } catch (x) { } git(ev);
      });
      c.addEventListener('pointermove', function (ev) { if (S && ev.pointerId === S.id) { git(ev); if (ev.cancelable) ev.preventDefault(); } });
      var bit = function (ev) { if (!S || ev.pointerId !== S.id) return; S = null; c.classList.remove('tut'); e.mcSur = Date.now(); };
      c.addEventListener('pointerup', bit); c.addEventListener('pointercancel', bit);
      ['touchstart', 'click', 'dblclick'].forEach(function (t) { c.addEventListener(t, function (ev) { ev.stopPropagation(); }, { passive: true }); });
    }
    mcUygula = (function (f) { return function () { var r = f.apply(this, arguments); try { [].forEach.call(document.querySelectorAll('.hs-calisma'), mcCubuk); } catch (x) { } return r; }; })(mcUygula);
    mcSesGorunen = (function (f) { return function () { var r = f.apply(this, arguments); try { kkGorunen().forEach(function (s) { var y = kkYuz(s); if (y) [].forEach.call(y.querySelectorAll('.hs-calisma'), mcCubuk); }); } catch (x) { } return r; }; })(mcSesGorunen);
    /* KİTAP İNDİR (14.11.2026): çıktı ekrandaki duruma uyar · Yazdır = yazdır penceresi · İndir = gerçek PDF dosyası */
    /* KİTAP BAŞLIK SABİT (14.11.2026): sayfa aşağı gezdirilince blok başlığı görünen alanın üstünde kalır */
    function mcBaslikSabit() {
      var sr = sahne.getBoundingClientRect();
      kkGorunen().forEach(function (s) { var y = kkYuz(s); if (!y) return;
        [].forEach.call(y.querySelectorAll('.hs-calisma'), function (e) {
          var u = e.querySelector('.mc-ust'); if (!u || !e.offsetHeight) return;
          var er = e.getBoundingClientRect(), ol = er.height / e.offsetHeight, kay = (sr.top - er.top) / ol, enCok = e.offsetHeight - u.offsetHeight * 2.5;
          if (kay > 1 && enCok > 0 && er.bottom > sr.top) { kay = Math.min(kay, enCok); if (Math.abs((e.mcKay || 0) - kay) > 0.5) { e.mcKay = kay; e.style.setProperty('--mc-kay', kay + 'px'); e.classList.add('mc-sabit'); } }
          else if (e.mcKay) { e.mcKay = 0; e.style.removeProperty('--mc-kay'); e.classList.remove('mc-sabit'); }
        }); });
    }
    var mcBsSon = 0, mcBsCalisiyor = false;
    function mcBaslikIzle() {                                         /* gezinme / yakınlaşma geçişi sürerken her karede yeniden yerleştir */
      mcBsSon = Date.now(); if (mcBsCalisiyor) return; mcBsCalisiyor = true;
      var adim = function () { try { mcBaslikSabit(); } catch (x) { } if (Date.now() - mcBsSon < 900) requestAnimationFrame(adim); else mcBsCalisiyor = false; };
      requestAnimationFrame(adim);
    }
    zUygula = (function (f) { return function () { var r = f.apply(this, arguments); try { mcBaslikIzle(); } catch (x) { } return r; }; })(zUygula);
    mcSesGorunen = (function (f) { return function () { var r = f.apply(this, arguments); try { mcBaslikIzle(); } catch (x) { } return r; }; })(mcSesGorunen);
    document.addEventListener('scroll', function (ev) { var t = ev.target; if (t && t.classList && t.classList.contains('mc-govde')) return; mcBaslikIzle(); }, true);
    window.addEventListener('resize', mcBaslikIzle);
    /* KİTAP OK KAYDIR (14.11.2026): ok tuşu sayfanın ucuna gelince ekrandaki bloğun metnini kaydırır */
    function mcOkKaydir(yon) {
      var sr = sahne.getBoundingClientRect(), en = null, enA = 0;
      kkGorunen().forEach(function (s) { var y = kkYuz(s); if (!y) return;
        [].forEach.call(y.querySelectorAll('.hs-calisma .mc-govde'), function (g) { var r = g.getBoundingClientRect(), a = Math.max(0, Math.min(r.bottom, sr.bottom) - Math.max(r.top, sr.top)) * Math.max(0, Math.min(r.right, sr.right) - Math.max(r.left, sr.left)); if (a > enA) { enA = a; en = g; } }); });
      if (!en) return false;
      var kalan = yon > 0 ? en.scrollHeight - en.clientHeight - en.scrollTop : en.scrollTop; if (kalan < 2) return false;
      var r = en.getBoundingClientRect(), ol = r.height > 0 ? en.clientHeight / r.height : 1, gor = Math.max(40, (Math.min(r.bottom, sr.bottom) - Math.max(r.top, sr.top)) * ol);
      var hedef = en.scrollTop + yon * Math.min(kalan, gor * 0.7);
      try { en.scrollTo({ top: hedef, behavior: 'smooth' }); } catch (x) { en.scrollTop = hedef; }
      return true;
    }
    function mcTekerKur(e) {                                          /* fare tekerleği / dokunmatik yüzeyde iki parmak: metni kaydırır */
      e.addEventListener('wheel', function (ev) {
        if (ev.ctrlKey) return; var g = e.querySelector('.mc-govde'); if (!g || g.scrollHeight <= g.clientHeight + 1) return;
        var r = g.getBoundingClientRect(), ol = r.height > 0 ? g.clientHeight / r.height : 1, dy = ev.deltaY;
        if (ev.deltaMode === 1) dy *= 32; else if (ev.deltaMode === 2) dy *= r.height * 0.85;
        if (!dy) return; if (ev.cancelable) ev.preventDefault();
        g.scrollTop += dy * ol;
      }, { passive: false });
    }
    zKaydir = (function (f) { return function (dx, dy) { var y0 = z.y; f.apply(this, arguments); try { if (!dx && dy && Math.abs(z.y - y0) < 1) mcOkKaydir(dy > 0 ? 1 : -1); } catch (x) { } }; })(zKaydir);   /* tek sayfa görünümü */
    document.addEventListener('keydown', function (e) {               /* %100 görünümde ↓ ↑ bloğun metnini kaydırır */
      var yon = (e.key === 'ArrowDown' || e.key === 'PageDown') ? 1 : (e.key === 'ArrowUp' || e.key === 'PageUp') ? -1 : 0; if (!yon || e.altKey || e.ctrlKey || e.metaKey) return;
      if (sahne.classList.contains('yakin') || document.getElementById('mcCicek') || document.getElementById('mcTablo')) return;
      var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return;
      try { if (typeof DS !== 'undefined' && DS && DS.aktif) return; } catch (x) { }
      if (mcOkKaydir(yon)) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
    /* KİTAP OK DÜĞME (14.11.2026): ekrandaki ok düğmeleri de bloğun metnini kaydırır */
    function mcOkVar(yon) {                                            /* ekrandaki blokta bu yönde kaydırılacak metin kaldı mı? */
      try { var sr = sahne.getBoundingClientRect(), en = null, enA = 0;
        kkGorunen().forEach(function (s) { var y = kkYuz(s); if (!y) return;
          [].forEach.call(y.querySelectorAll('.hs-calisma .mc-govde'), function (g) { var r = g.getBoundingClientRect(), a = Math.max(0, Math.min(r.bottom, sr.bottom) - Math.max(r.top, sr.top)) * Math.max(0, Math.min(r.right, sr.right) - Math.max(r.left, sr.left)); if (a > enA) { enA = a; en = g; } }); });
        if (!en) return false; return (yon > 0 ? en.scrollHeight - en.clientHeight - en.scrollTop : en.scrollTop) >= 2;
      } catch (x) { return false; }
    }
    document.addEventListener('scroll', function (ev) { var t = ev.target; if (t && t.classList && t.classList.contains('mc-govde')) { try { oklariGuncelle(); } catch (x) { } } }, true);
    function mcZeminSrc(b) {
      var S = (HS.veri && HS.veri.sayfa) || {}, src = '';
      Object.keys(S).forEach(function (s) { var L = S[s] || []; if (L.indexOf(b) >= 0) L.forEach(function (x) { if (!src && x && x.t === 'gorsel' && /^gorsel\/[A-Za-z0-9._-]+$/.test(String(x.src || '')) && +x.w >= 99 && +x.h >= 99) src = String(x.src); }); });
      return src;
    }
    function mcYazdirKur(b, tur, e) {                                  /* çıktı kutusu (#mcYazdir): başlık + cümleler, ekrandaki duruma göre */
      var eski = document.getElementById('mcYazdir'); if (eski && eski.parentNode) eski.parentNode.removeChild(eski);
      var A = mcAyar(), V = kok.KITAP_VERI || {}, bas = b.bas ? String(b.bas) : (b.sn ? b.sn + '. Sınıf' + (b.sy ? ' · s. ' + b.sy : '') : 'Metin');
      var renkli = !!A.renk && tur !== 'sade', acikW = {}, acikC = {};
      if (e) { [].forEach.call(e.querySelectorAll('.mc-w.acik'), function (x) { acikW[x.getAttribute('data-c') + '_' + x.getAttribute('data-w')] = 1; });
        [].forEach.call(e.querySelectorAll('.mc-c.acik'), function (x) { acikC[x.getAttribute('data-c')] = 1; }); }
      var rk = function (i) { return renkli ? ' style="color:' + MC_RENK[i % MC_RENK.length] + '"' : ''; };
      var h = '<div class="my-ust"><b>' + kkEsc(bas) + '</b><span>' + kkEsc(String(V.ad || V.baslik || document.title || '')) + '</span></div>';
      (b.c || []).forEach(function (c, ci) {
        if (!c || !Array.isArray(c.w)) return;
        var gor = function (wi) { return A.km === 2 || !!acikW[ci + '_' + wi]; };
        var ust = c.w.some(function (w, wi) { return Array.isArray(w) && gor(wi); }), trGor = A.cm === 2 || !!acikC[ci], tr = '';
        if (trGor) {
          var W = c.w.filter(Array.isArray), sirali = W.length > 0 && W.every(function (w) { return typeof w[2] === 'number'; });
          if (sirali) tr = c.w.map(function (w, wi) { return { w: w, i: wi }; }).filter(function (x) { return Array.isArray(x.w); }).sort(function (x, y) { return x.w[2] - y.w[2]; })
            .map(function (x) { return '<span' + rk(x.i) + '>' + kkEsc(String(x.w[1] || '')) + '</span>'; }).join(' ');
          else tr = kkEsc(String(c.tr || ''));
        }
        h += '<div class="my-c' + (ust ? '' : ' my-ustsuz') + '"><span class="my-no">' + (c.k ? kkEsc(String(c.k)) : (ci + 1)) + '</span><div class="my-s"><div class="my-ar" dir="rtl" lang="ar">' +
          c.w.map(function (w, wi) { return Array.isArray(w) ? '<span class="my-w"' + rk(wi) + '>' + (ust ? '<small dir="ltr" lang="tr">' + (gor(wi) ? kkEsc(String(w[1] || '')) : '&nbsp;') + '</small>' : '') + '<b>' + kkEsc(String(w[0] || '')) + '</b></span>' : ''; }).join(' ') +
          '</div>' + (trGor ? '<div class="my-tr" dir="ltr" lang="tr">' + tr + '</div>' : '') + '</div></div>';
      });
      var d = document.createElement('div'); d.id = 'mcYazdir'; if (tur === 'sade') d.className = 'my-sade'; d.innerHTML = h; document.body.appendChild(d);
      d.style.setProperty('--my-yb', String(Math.max(0.7, Math.min(1.4, (+A.yb || 1.5) / 1.5)))); if (A.hz === 1) d.setAttribute('data-hz', 'orta');
      if (A.hz === 2) { d.classList.add('my-olc'); try { mcSimOlc(d, '.my-c', '.my-ar', '.my-tr', 'my-sim'); } catch (x) { } d.classList.remove('my-olc'); }
      d.mcAd = bas; return d;
    }
    function mcYazdirSayfala(d, src) {                                 /* içeriği A4 sayfalara böl; src varsa her sayfaya zemin görseli */
      d.classList.add('my-olc');
      var olc = document.createElement('div'); olc.style.cssText = 'height:100mm;width:1px'; d.appendChild(olc);
      var mm = olc.getBoundingClientRect().height / 100 || 3.78; d.removeChild(olc);
      var H = function (el) { var cs = getComputedStyle(el); return el.getBoundingClientRect().height + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0); };
      var bos = (296.5 - (src ? 19 + 15 : 14 + 14)) * mm, P = [], cur = [], y = 0;
      [].slice.call(d.children).forEach(function (el) { var h = H(el); if (y + h > bos && cur.some(function (x) { return x.classList.contains('my-c'); })) { P.push(cur); cur = []; y = 0; } cur.push(el); y += h; });
      if (cur.length) P.push(cur);
      d.innerHTML = '';
      P.forEach(function (L) { var sf = document.createElement('div'); sf.className = 'my-sf' + (src ? '' : ' my-bos');
        if (src) { var im = new Image(); im.className = 'my-zm'; im.alt = ''; im.src = new URL(src, location.href).href; sf.appendChild(im); }
        var ic = document.createElement('div'); ic.className = 'my-ic'; L.forEach(function (el) { ic.appendChild(el); }); sf.appendChild(ic); d.appendChild(sf); });
      d.classList.remove('my-olc'); d.classList.add('my-cerceve');
    }
    function mcYazdir(b, tur, e, is) {
      var d = mcYazdirKur(b, tur, e), src = tur === 'cerceve' ? mcZeminSrc(b) : '';
      if (tur === 'cerceve' && !src) { try { kkTost('Bu sayfada çerçeve yok: çerçevesiz hazırlanıyor'); } catch (x) { } }
      if (is === 'indir') { mcPdfIndir(d, src); return; }
      document.documentElement.classList.add('mc-yazdir');
      if (src) { try { mcYazdirSayfala(d, src); var st = document.createElement('style'); st.id = 'mcYazdirStil'; st.textContent = '@media print { @page { size: A4; margin: 0; } }'; document.head.appendChild(st); } catch (x) { } }
      var bit = function () { window.removeEventListener('afterprint', bit); document.documentElement.classList.remove('mc-yazdir'); var st0 = document.getElementById('mcYazdirStil'); if (st0 && st0.parentNode) st0.parentNode.removeChild(st0); if (d.parentNode) d.parentNode.removeChild(d); };
      window.addEventListener('afterprint', bit);
      setTimeout(function () { try { window.print(); } catch (x) { bit(); } }, 150);
    }
    function mcZeminYukle(src, sonra) {                                /* zemin görseli: zemin.js'teki (KITAP_ZEMIN) SVG metni → tuvali kirletmeyen veri adresi */
      var kur = function (url) { var im = new Image(); im.onload = function () { sonra(im); }; im.onerror = function () { sonra(null); }; im.src = url; };
      var dene = function () { var Z = kok.KITAP_ZEMIN, s = Z && Z[src];
        if (s) { if (!/<svg[^>]*\swidth=/.test(s)) s = s.replace('<svg ', '<svg width="1000" height="1414" '); kur('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s)); }
        else kur(new URL(src, location.href).href); };
      if (kok.KITAP_ZEMIN || MC.zeminYuk) { dene(); return; }
      MC.zeminYuk = 1; var sc = document.createElement('script'); sc.src = new URL('zemin.js?t=' + Date.now(), location.href).href; sc.onload = dene; sc.onerror = dene; document.head.appendChild(sc);
    }
    function mcPdfSayfa(sf, EN, zm) {                                  /* bir çıktı sayfasını tuvale çiz → JPEG baytları */
      var r0 = sf.getBoundingClientRect(), k = EN / r0.width, cv = document.createElement('canvas'); cv.width = EN; cv.height = Math.round(r0.height * k);
      var g = cv.getContext('2d'), X = function (v) { return (v - r0.left) * k; }, Y = function (v) { return (v - r0.top) * k; };
      g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
      if (zm) { try { g.drawImage(zm, 0, 0, cv.width, cv.height); } catch (x) { } }
      var saydam = function (c) { return !c || c === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(c); };
      [].forEach.call(sf.querySelectorAll('.my-no'), function (el) { var cs = getComputedStyle(el); if (saydam(cs.backgroundColor)) return; var r = el.getBoundingClientRect(), rr = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, r.height / 2) * k, x = X(r.left), y = Y(r.top), w = r.width * k, h = r.height * k;
        g.fillStyle = cs.backgroundColor; g.beginPath(); g.moveTo(x + rr, y); g.arcTo(x + w, y, x + w, y + h, rr); g.arcTo(x + w, y + h, x, y + h, rr); g.arcTo(x, y + h, x, y, rr); g.arcTo(x, y, x + w, y, rr); g.closePath(); g.fill(); });
      [].forEach.call(sf.querySelectorAll('.my-ust, .my-c'), function (el) { var cs = getComputedStyle(el), bw = parseFloat(cs.borderBottomWidth) || 0; if (!bw || cs.borderBottomStyle === 'none') return; var r = el.getBoundingClientRect();
        g.strokeStyle = cs.borderBottomColor; g.lineWidth = Math.max(1, bw * k); g.setLineDash(cs.borderBottomStyle === 'dashed' ? [6 * k * 0.5, 4 * k * 0.5] : []); g.beginPath(); g.moveTo(X(r.left), Y(r.bottom) - bw * k / 2); g.lineTo(X(r.right), Y(r.bottom) - bw * k / 2); g.stroke(); g.setLineDash([]); });
      var w = document.createTreeWalker(sf, NodeFilter.SHOW_TEXT, null), n, rg = document.createRange();
      while ((n = w.nextNode())) {
        var t = n.nodeValue, el = n.parentNode; if (!t || !/\S/.test(t) || !el) continue;
        var cs = getComputedStyle(el); if (cs.display === 'none') continue;   /* kutu ölçüm için gizli (visibility) durur; yazı yine çizilir */
        var px = parseFloat(cs.fontSize) * k; g.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + px + 'px ' + cs.fontFamily; g.fillStyle = cs.color; g.textBaseline = 'alphabetic';
        var re = /[^\s ]+/g, m;
        while ((m = re.exec(t))) {
          rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); var r = rg.getBoundingClientRect(); if (!r.width || !r.height) continue;
          var ar = /[؀-ۿ]/.test(m[0]), mt = g.measureText(m[0]), as = mt.fontBoundingBoxAscent || px * 0.9, de = mt.fontBoundingBoxDescent || px * 0.3;
          try { g.direction = ar ? 'rtl' : 'ltr'; } catch (x) { }
          g.textAlign = ar ? 'right' : 'left';
          g.fillText(m[0], ar ? X(r.right) : X(r.left), Y(r.top) + (r.height * k - (as + de)) / 2 + as);
        }
      }
      var u = cv.toDataURL('image/jpeg', 0.9), bn = atob(u.slice(u.indexOf(',') + 1)), B = new Uint8Array(bn.length); for (var i = 0; i < bn.length; i++) B[i] = bn.charCodeAt(i);
      return { j: B, w: cv.width, h: cv.height };
    }
    function mcPdfYaz(S) {                                             /* her sayfası bir JPEG olan A4 PDF (kütüphanesiz) */
      var P = [], boy = 0, of = [], W = 595.28, H = 841.89;
      var ek = function (x) { if (typeof x === 'string') { var b = new Uint8Array(x.length); for (var i = 0; i < x.length; i++) b[i] = x.charCodeAt(i) & 255; x = b; } P.push(x); boy += x.length; };
      var nesne = function (no, govde, akis) { of[no] = boy; ek(no + ' 0 obj\n' + govde + '\n'); if (akis) { ek('stream\n'); ek(akis); ek('\nendstream\n'); } ek('endobj\n'); };
      ek('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
      nesne(1, '<< /Type /Catalog /Pages 2 0 R >>');
      nesne(2, '<< /Type /Pages /Count ' + S.length + ' /Kids [' + S.map(function (s, i) { return (3 + i * 3) + ' 0 R'; }).join(' ') + '] >>');
      S.forEach(function (s, i) { var p = 3 + i * 3, ic = 'q ' + W + ' 0 0 ' + H + ' 0 0 cm /Im0 Do Q';
        nesne(p, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /XObject << /Im0 ' + (p + 2) + ' 0 R >> >> /Contents ' + (p + 1) + ' 0 R >>');
        nesne(p + 1, '<< /Length ' + ic.length + ' >>', ic);
        nesne(p + 2, '<< /Type /XObject /Subtype /Image /Width ' + s.w + ' /Height ' + s.h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + s.j.length + ' >>', s.j); });
      var n = 3 + S.length * 3, xr = boy, x = 'xref\n0 ' + n + '\n0000000000 65535 f \n';
      for (var i = 1; i < n; i++) x += ('0000000000' + of[i]).slice(-10) + ' 00000 n \n';
      ek(x + 'trailer\n<< /Size ' + n + ' /Root 1 0 R >>\nstartxref\n' + xr + '\n%%EOF\n');
      return new Blob(P, { type: 'application/pdf' });
    }
    /* KİTAP PDF METİN (14.11.2026): metin tabanlı PDF — gömülü yazı tipi + HarfBuzz ile biçimlendirme */
    function mcTtf(u8) {                                               /* yazı tipinden gereken ölçüler */
      var dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength), n = dv.getUint16(4), T = {};
      for (var i = 0; i < n; i++) { var o = 12 + 16 * i; T[String.fromCharCode(dv.getUint8(o), dv.getUint8(o + 1), dv.getUint8(o + 2), dv.getUint8(o + 3))] = dv.getUint32(o + 8); }
      var h = T.head, a = T.hhea, m = T.hmtx, nh = dv.getUint16(a + 34);
      return { upem: dv.getUint16(h + 18), kutu: [dv.getInt16(h + 36), dv.getInt16(h + 38), dv.getInt16(h + 40), dv.getInt16(h + 42)], cik: dv.getInt16(a + 4), in_: dv.getInt16(a + 6),
        en: function (g) { return dv.getUint16(m + 4 * Math.min(g, nh - 1)); } };
    }
    function mcPdfMotor(sonra) {                                       /* pdfmotor.js: HarfBuzz + yazı tipi (ilk indirmede yüklenir) */
      if (MC.pdfM !== undefined) { sonra(MC.pdfM); return; }
      var yok = function () { MC.pdfM = null; sonra(null); };
      var kur = function () {
        var K = kok.KITAP_PDF_MOTOR; if (!K || !K.hbjs || !K.wasm || !K.font || !window.WebAssembly) { yok(); return; }
        var b64 = function (s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
        try { var fb = b64(K.font);
          WebAssembly.instantiate(b64(K.wasm)).then(function (r) {
            try { var hb = K.hbjs(r.instance), font = hb.createFont(hb.createFace(hb.createBlob(fb.buffer), 0)); MC.pdfM = { hb: hb, font: font, ttf: fb, T: mcTtf(fb) }; } catch (x) { MC.pdfM = null; }
            sonra(MC.pdfM); }, yok);
        } catch (x) { yok(); }
      };
      if (kok.KITAP_PDF_MOTOR) { kur(); return; }
      var sc = document.createElement('script'); sc.src = new URL('pdfmotor.js?t=' + Date.now(), location.href).href; sc.onload = kur; sc.onerror = yok; document.head.appendChild(sc);
    }
    function mcPdfMetin(d, zm, M) {                                    /* #mcYazdir sayfaları → metin tabanlı PDF (Blob) */
      var W = 595.28, H = 841.89, T = M.T, hb = M.hb, kul = {}, uni = {}, SY = [], olc = document.createElement('canvas').getContext('2d');
      var f = function (v) { return String(Math.round(v * 100) / 100); };
      var renk = function (c) { var m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(String(c || '')); return m ? f(m[1] / 255) + ' ' + f(m[2] / 255) + ' ' + f(m[3] / 255) : '0 0 0'; };
      var saydam = function (c) { return !c || c === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(c); };
      var hex4 = function (g) { return ('0000' + g.toString(16)).slice(-4); };
      [].forEach.call(d.querySelectorAll('.my-sf'), function (sf) {
        var r0 = sf.getBoundingClientRect(), s = W / r0.width, X = function (v) { return (v - r0.left) * s; }, Y = function (v) { return H - (v - r0.top) * s; }, o = [];
        [].forEach.call(sf.querySelectorAll('.my-no'), function (el) {   /* rozet zemini: yuvarlak köşeli dikdörtgen */
          var cs = getComputedStyle(el); if (saydam(cs.backgroundColor)) return; var r = el.getBoundingClientRect(), x = X(r.left), y = Y(r.bottom), w = r.width * s, h = r.height * s, q = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, r.height / 2) * s, k = q * 0.5523;
          o.push(renk(cs.backgroundColor) + ' rg ' + f(x + q) + ' ' + f(y) + ' m ' + f(x + w - q) + ' ' + f(y) + ' l ' + f(x + w - q + k) + ' ' + f(y) + ' ' + f(x + w) + ' ' + f(y + q - k) + ' ' + f(x + w) + ' ' + f(y + q) + ' c ' +
            f(x + w) + ' ' + f(y + h - q) + ' l ' + f(x + w) + ' ' + f(y + h - q + k) + ' ' + f(x + w - q + k) + ' ' + f(y + h) + ' ' + f(x + w - q) + ' ' + f(y + h) + ' c ' +
            f(x + q) + ' ' + f(y + h) + ' l ' + f(x + q - k) + ' ' + f(y + h) + ' ' + f(x) + ' ' + f(y + h - q + k) + ' ' + f(x) + ' ' + f(y + h - q) + ' c ' +
            f(x) + ' ' + f(y + q) + ' l ' + f(x) + ' ' + f(y + q - k) + ' ' + f(x + q - k) + ' ' + f(y) + ' ' + f(x + q) + ' ' + f(y) + ' c f'); });
        [].forEach.call(sf.querySelectorAll('.my-ust, .my-c'), function (el) {   /* alt çizgiler */
          var cs = getComputedStyle(el), bw = parseFloat(cs.borderBottomWidth) || 0; if (!bw || cs.borderBottomStyle === 'none') return; var r = el.getBoundingClientRect(), y = Y(r.bottom) + bw * s / 2;
          o.push(renk(cs.borderBottomColor) + ' RG ' + f(Math.max(0.3, bw * s)) + ' w ' + (cs.borderBottomStyle === 'dashed' ? '[2.5 2] 0 d ' : '[] 0 d ') + f(X(r.left)) + ' ' + f(y) + ' m ' + f(X(r.right)) + ' ' + f(y) + ' l S [] 0 d'); });
        o.push('BT');
        var w = document.createTreeWalker(sf, NodeFilter.SHOW_TEXT, null), n, rg = document.createRange();
        while ((n = w.nextNode())) {
          var t = n.nodeValue, el = n.parentNode; if (!t || !/\S/.test(t) || !el) continue;
          var cs = getComputedStyle(el); if (cs.display === 'none') continue;
          var px = parseFloat(cs.fontSize), fs = px * s, rk = renk(cs.color), kalin = (parseInt(cs.fontWeight, 10) || 400) >= 600;
          olc.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + px + 'px ' + cs.fontFamily;
          o.push('/F1 ' + f(fs) + ' Tf ' + rk + ' rg ' + (kalin ? '2 Tr ' + f(fs * 0.028) + ' w ' + rk + ' RG' : '0 Tr'));
          var re = /[^\s ]+/g, m;
          while ((m = re.exec(t))) {
            rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); var r = rg.getBoundingClientRect(); if (!r.width || !r.height) continue;
            var tok = m[0].replace(/‑/g, '-'), mt = olc.measureText(tok), as = mt.fontBoundingBoxAscent || px * 0.99, de = mt.fontBoundingBoxDescent || px * 0.5;
            var by = Y(r.top + (r.height - (as + de)) / 2 + as), sagdan = /[֐-ࣿﭐ-﷿ﹰ-﻿]/.test(tok);
            var buf = hb.createBuffer(); buf.addText(tok); buf.guessSegmentProperties(); hb.shape(M.font, buf); var G = buf.json(); buf.destroy();
            var kalem = X(r.left), P = G.map(function (g) { var p = { g: g.g, cl: g.cl, x: kalem + g.dx * fs / T.upem, y: by + g.dy * fs / T.upem }; kalem += g.ax * fs / T.upem; return p; });
            if (sagdan) P.reverse();                                   /* içerik sırası = okuma sırası (kopyalama / arama doğru çıksın) */
            var bas = [], gr = {}; P.forEach(function (p) { if (!gr[p.cl]) { gr[p.cl] = []; bas.push(p.cl); } gr[p.cl].push(p); });
            bas.sort(function (a, b) { return a - b; });
            bas.forEach(function (c0, i) { var yz = tok.slice(c0, i + 1 < bas.length ? bas[i + 1] : tok.length), L = gr[c0];
              if (L.length === yz.length) L.forEach(function (p, j) { if (uni[p.g] === undefined) uni[p.g] = yz.charAt(j); });
              else if (uni[L[0].g] === undefined) uni[L[0].g] = yz; });
            P.forEach(function (p) { kul[p.g] = 1; o.push('1 0 0 1 ' + f(p.x) + ' ' + f(p.y) + ' Tm <' + hex4(p.g) + '> Tj'); });
          }
        }
        o.push('ET'); SY.push(o.join('\n'));
      });
      var zj = null;
      if (zm) { try { var cv = document.createElement('canvas'); cv.width = 1654; cv.height = 2339; var cg = cv.getContext('2d'); cg.fillStyle = '#fff'; cg.fillRect(0, 0, cv.width, cv.height); cg.drawImage(zm, 0, 0, cv.width, cv.height);
        var u = cv.toDataURL('image/jpeg', 0.88), bn = atob(u.slice(u.indexOf(',') + 1)); zj = new Uint8Array(bn.length); for (var i = 0; i < bn.length; i++) zj[i] = bn.charCodeAt(i); } catch (x) { zj = null; } }
      var P = [], boy = 0, of = [];
      var ek = function (x) { if (typeof x === 'string') { var b = new Uint8Array(x.length); for (var i = 0; i < x.length; i++) b[i] = x.charCodeAt(i) & 255; x = b; } P.push(x); boy += x.length; };
      var nesne = function (no, govde, akis) { of[no] = boy; ek(no + ' 0 obj\n' + govde + '\n'); if (akis !== undefined) { ek('stream\n'); ek(akis); ek('\nendstream\n'); } ek('endobj\n'); };
      var K = 1000 / T.upem, G = Object.keys(kul).map(Number).sort(function (a, b) { return a - b; });
      var u16 = function (sx) { var h = ''; for (var i = 0; i < sx.length; i++) h += ('0000' + sx.charCodeAt(i).toString(16)).slice(-4); return h; };
      var U = G.filter(function (g) { return uni[g] !== undefined; }), cm = '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n';
      for (var i = 0; i < U.length; i += 100) { var D = U.slice(i, i + 100); cm += D.length + ' beginbfchar\n' + D.map(function (g) { return '<' + hex4(g) + '> <' + u16(uni[g]) + '>'; }).join('\n') + '\nendbfchar\n'; }
      cm += 'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';
      ek('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
      nesne(1, '<< /Type /Catalog /Pages 2 0 R >>');
      nesne(2, '<< /Type /Pages /Count ' + SY.length + ' /Kids [' + SY.map(function (x, i) { return (9 + i * 2) + ' 0 R'; }).join(' ') + '] >>');
      nesne(3, '<< /Type /Font /Subtype /Type0 /BaseFont /Arakom /Encoding /Identity-H /DescendantFonts [4 0 R] /ToUnicode 7 0 R >>');
      nesne(4, '<< /Type /Font /Subtype /CIDFontType2 /BaseFont /Arakom /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor 5 0 R /DW 1000 /W [' + G.map(function (g) { return g + ' [' + Math.round(T.en(g) * K) + ']'; }).join(' ') + '] /CIDToGIDMap /Identity >>');
      nesne(5, '<< /Type /FontDescriptor /FontName /Arakom /Flags 4 /FontBBox [' + T.kutu.map(function (v) { return Math.round(v * K); }).join(' ') + '] /ItalicAngle 0 /Ascent ' + Math.round(T.cik * K) + ' /Descent ' + Math.round(T.in_ * K) + ' /CapHeight ' + Math.round(T.cik * K * 0.7) + ' /StemV 80 /FontFile2 6 0 R >>');
      nesne(6, '<< /Length ' + M.ttf.length + ' /Length1 ' + M.ttf.length + ' >>', M.ttf);
      nesne(7, '<< /Length ' + cm.length + ' >>', cm);
      if (zj) nesne(8, '<< /Type /XObject /Subtype /Image /Width 1654 /Height 2339 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + zj.length + ' >>', zj); else nesne(8, '<< >>');
      SY.forEach(function (ic, i) { var p = 9 + i * 2; if (zj) ic = 'q ' + W + ' 0 0 ' + H + ' 0 0 cm /Im0 Do Q\n' + ic;
        nesne(p, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /Font << /F1 3 0 R >>' + (zj ? ' /XObject << /Im0 8 0 R >>' : '') + ' >> /Contents ' + (p + 1) + ' 0 R >>');
        nesne(p + 1, '<< /Length ' + ic.length + ' >>', ic); });
      var n = 9 + SY.length * 2, xr = boy, x = 'xref\n0 ' + n + '\n0000000000 65535 f \n';
      for (var j = 1; j < n; j++) x += ('0000000000' + of[j]).slice(-10) + ' 00000 n \n';
      ek(x + 'trailer\n<< /Size ' + n + ' /Root 1 0 R >>\nstartxref\n' + xr + '\n%%EOF\n');
      return new Blob(P, { type: 'application/pdf' });
    }
    function mcPdfIndir(d, src) {
      try { kkTost('PDF hazırlanıyor…'); } catch (x) { }
      var bitir = function () { if (d.parentNode) d.parentNode.removeChild(d); }, motor = null;
      var yap = function (zm) {
        try {
          d.classList.add('my-olc'); var blob = null, metin = false;
          if (motor) { try { blob = mcPdfMetin(d, zm, motor); metin = true; } catch (x) { blob = null; } }
          if (!blob) blob = mcPdfYaz([].map.call(d.querySelectorAll('.my-sf'), function (sf) { try { return mcPdfSayfa(sf, 1654, zm); } catch (x) { return mcPdfSayfa(sf, 1654, null); } }));
          var a = document.createElement('a'), ad = String(d.mcAd || 'metin').replace(/[\\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim() || 'metin';
          a.href = URL.createObjectURL(blob); a.download = ad + '.pdf'; document.body.appendChild(a); a.click();
          setTimeout(function () { try { URL.revokeObjectURL(a.href); } catch (x) { } if (a.parentNode) a.parentNode.removeChild(a); }, 4000);
          try { kkTost('PDF indirildi: ' + ad + '.pdf' + (metin ? '' : ' (resim olarak)')); } catch (x) { }
        } catch (x) { try { kkTost('PDF oluşturulamadı — yazdır düğmesini dene'); } catch (y) { } }
        bitir();
      };
      try { mcYazdirSayfala(d, src); } catch (x) { bitir(); return; }
      var hazir = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
      var sur = function () { mcPdfMotor(function (M) { motor = M; if (src) mcZeminYukle(src, yap); else yap(null); }); };
      hazir.then(sur, sur);
    }
    document.addEventListener('keydown', function (e) {
      var p = document.getElementById('mcTablo'); if (!p) return;
      if (e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); mcTabloKapat(); }
      else if (e.key === 'ArrowLeft') { e.stopImmediatePropagation(); e.preventDefault(); p.mtGit(1); }
      else if (e.key === 'ArrowRight') { e.stopImmediatePropagation(); e.preventDefault(); p.mtGit(-1); }
    }, true);
    /* KİTAP YAZDIR (14.11.2026): dışarı dokununca Görünüm penceresi kapanır · PDF: renkli / sade seçimi */
    function mcPdfMenuKapat() { [].forEach.call(document.querySelectorAll('.mc-pdfm'), function (x) { if (x.parentNode) x.parentNode.removeChild(x); }); }
    function mcPdfMenu(e) {
      if (e.querySelector('.mc-pdfm')) { mcPdfMenuKapat(); return; }
      mcPdfMenuKapat();
      var m = document.createElement('div'); m.className = 'mc-pdfm';
      m.innerHTML = '<button type="button" data-y="renkli"><b>Renkli · çerçevesiz</b><small>kelimeler renkli, sayfa süsü yok (az boya)</small></button><button type="button" data-y="cerceve"><b>Renkli · çerçeveli</b><small>sınıfın kenar süslemesiyle (çok boya)</small></button><button type="button" data-y="sade"><b>Sade · toner tasarrufu</b><small>yalnız cümleler: siyah yazı, süs ve renk yok</small></button>';   /* KİTAP ÇERÇEVE (14.11.2026) */
      e.appendChild(m);
    }
    document.addEventListener('pointerdown', function (ev) {
      var t = ev.target; if (!t || !t.closest) return;
      if (document.querySelector('.mc-pdfm') && !t.closest('.mc-pdfm, .mc-pdf')) mcPdfMenuKapat();
      if (MC.panelKapali || !document.querySelector('.hs-calisma .mc-panel') || t.closest('.mc-panel, .mc-ayarb')) return;
      MC.panelKapali = true; [].forEach.call(document.querySelectorAll('.hs-calisma'), function (x) { x.classList.add('mc-pkapali'); });
      if (t.closest('.kitap') && !document.documentElement.classList.contains('kk-acik')) { MC.panelYut = Date.now(); ev.stopPropagation(); }   /* bu dokunuş yalnız pencereyi kapatır */
    }, true);
    function mcBos(ev) { var t = ev && ev.target; return !(t && t.closest && t.closest('.mc-w, .mc-ts, button, .mc-panel, .mc-pdfm, .mc-cb')); }   /* KİTAP BOŞLUK (14.11.2026): boşluğa dokunuş kitabın motoruna geçer */
    function mcPanelKim(b) { return [b.bas, b.sn, b.sy, b.x, b.y, (b.c || []).length].join('|'); }   /* KİTAP TEK PANEL (14.11.2026) */
    /* AÇILAN ÇEVİRİLER KALIR (14.11.2026): öğretmen "derste açılan cümleler kaydedilsin". Açık cümle tercümeleri (.mc-c.acik)
       ve kelime anlamları (.mc-w.acik) tarayıcıda saklanır (Firebase'e yazılmaz); metin yeniden çizilince açık gelir. */
    var MC_AK = 'kitapCalismaAcik|';
    function mcAkOku() { try { var v = JSON.parse(localStorage.getItem(MC_AK + KK_KITAP) || '{}'); return v && typeof v === 'object' ? v : {}; } catch (x) { return {}; } }
    function mcAkSay(e) { return !!e.querySelector('.mc-c.acik, .mc-w.acik'); }
    function mcAkKaydet(e, b) {
      if (!e.isConnected) return;
      var c = [], w = [];
      [].forEach.call(e.querySelectorAll('.mc-c.acik'), function (x) { c.push(+x.getAttribute('data-c')); });
      [].forEach.call(e.querySelectorAll('.mc-w.acik'), function (x) { w.push(x.getAttribute('data-c') + '_' + x.getAttribute('data-w')); });
      var D = mcAkOku(), k = mcPanelKim(b), eski = JSON.stringify(D[k] ? [D[k].c, D[k].w] : null);
      if (c.length || w.length) { if (eski === JSON.stringify([c, w])) return mcAkSil(e); D[k] = { c: c, w: w, t: Date.now() }; } else { if (!D[k]) return mcAkSil(e); delete D[k]; }
      try { localStorage.setItem(MC_AK + KK_KITAP, JSON.stringify(D)); } catch (x) { }
      mcAkSil(e);
    }
    function mcAkSil(e) { var s = e.querySelector('.mc-aksil'); if (s) s.hidden = !mcAkSay(e); }
    function mcAkIzle(e, b) {
      var s = mcAkOku()[mcPanelKim(b)];
      if (s) {
        (s.c || []).forEach(function (ci) { var x = e.querySelector('.mc-c[data-c="' + (+ci) + '"]'); if (x) x.classList.add('acik'); });
        (s.w || []).forEach(function (k) { var p = String(k).split('_'), x = e.querySelector('.mc-w[data-c="' + (+p[0]) + '"][data-w="' + (+p[1]) + '"]'); if (x) x.classList.add('acik'); });
      }
      mcAkSil(e);
      var z = null;
      try { new MutationObserver(function () { clearTimeout(z); z = setTimeout(function () { mcAkKaydet(e, b); }, 300); }).observe(e, { attributes: true, attributeFilter: ['class'], subtree: true }); } catch (x) { }
    }
    function mcBlok(b) {
      if (!b || !(b.w > 0) || !(b.h > 0) || !Array.isArray(b.c)) return null;
      var e = document.createElement('div'); e.className = 'hs-b hs-calisma';
      e.style.left = (+b.x || 0) + '%'; e.style.top = (+b.y || 0) + '%'; e.style.width = +b.w + '%'; e.style.height = +b.h + '%'; e.style.fontSize = (+b.fs > 0 ? +b.fs : 2.6) + 'cqw';
      var bas = b.bas ? String(b.bas) : (b.sn ? b.sn + '. Sınıf' + (b.sy ? ' · s. ' + b.sy : '') : '');   /* KİTAP SESİ: başlık boşsa sınıf · sayfa */
      var h = '<div class="mc-ust">' + (bas ? '<b class="mc-bas" dir="auto">' + kkEsc(bas) + '</b>' : '<b class="mc-bas"></b>') + '<span class="mc-sws"><button type="button" class="mc-tumses" hidden title="Bütün cümleleri sırayla dinle">' + MC_IK.oynat + ' Dinle</button>' +
        '<button type="button" class="mc-ib mc-aksil" hidden title="Açılan çevirileri kapat (kayıt silinir)" aria-label="Açılan çevirileri kapat">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 19.5 3.8 15.8a1.6 1.6 0 0 1 0-2.3L13.5 3.8a1.6 1.6 0 0 1 2.3 0l4.4 4.4a1.6 1.6 0 0 1 0 2.3L11 19.5"/><path d="M7.5 19.5H20"/><path d="m9 10.3 4.7 4.7"/></svg></button>' + mcPdfDugme() + mcAyarDugme() + '</span></div><div class="mc-govde">';   /* AÇILAN ÇEVİRİLER KALIR: silgi */
      var otoOn = mcSesOn(b);                                         /* KİTAP GÖRÜNÜMÜ (14.11.2026) */
      b.c.forEach(function (c, ci) {
        if (!c || !Array.isArray(c.w)) return;
        var W = c.w.filter(Array.isArray), sirali = W.length > 0 && W.every(function (w) { return typeof w[2] === 'number'; }), tr = '';
        if (sirali) tr = c.w.map(function (w, wi) { return { w: w, i: wi }; }).filter(function (x) { return Array.isArray(x.w); }).sort(function (x, y) { return x.w[2] - y.w[2]; })
          .map(function (x) { return '<span class="mc-ts" data-w="' + x.i + '" style="--mr:' + MC_RENK[x.i % MC_RENK.length] + '">' + kkEsc(String(x.w[1] || '')) + '</span>'; }).join(' ');
        else tr = kkEsc(String(c.tr || ''));
        var ses = /^ses\/[A-Za-z0-9._\/-]+\.mp3$/.test(String(c.s || '')) && String(c.s).indexOf('..') < 0 ? String(c.s) : '';   /* KİTAP SESİ (14.11.2026) */
        var oto = (!ses && otoOn) ? otoOn + ('0' + (ci + 1)).slice(-2) + '.mp3' : '';
        h += '<div class="mc-c' + (c.k ? ' mc-kisili' : '') + '" data-c="' + ci + '">' + ((c.k || ses || oto) ? '<span class="mc-yan">' + (c.k ? '<span class="mc-kisi" dir="auto">' + kkEsc(String(c.k)) + '</span>' : '') + ((ses || oto) ? '<button type="button" class="mc-ses' + (oto ? ' mc-oto' : '') + '" data-s="' + kkEsc(ses || oto) + '" data-v="' + (+c.sv || 0) + '" title="Cümleyi dinle" aria-label="Cümleyi dinle">' + MC_IK.oynat + '</button>' : '') + '</span>' : '') + '<div class="mc-sat"><div class="mc-ar" dir="rtl" lang="ar">' +
          c.w.map(function (w, wi) { return Array.isArray(w) ? '<span class="mc-w" data-c="' + ci + '" data-w="' + wi + '" style="--mr:' + MC_RENK[wi % MC_RENK.length] + '"><i class="mc-tr" dir="ltr" lang="tr">' + kkEsc(String(w[1] || '')) + '</i><b>' + kkEsc(String(w[0] || '')) + '</b></span>' : ''; }).join(' ') +
          '</div><div class="mc-ctr" dir="ltr" lang="tr"><button type="button" class="mc-goz" title="Bu cümlenin Türkçesini göster / gizle" aria-label="Cümlenin Türkçesi"><svg class="mc-cev" viewBox="0 0 44 24" aria-hidden="true"><g class="cv-a"><path d="M3 3.5h11A2.5 2.5 0 0 1 16.5 6v8a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3H3A2.5 2.5 0 0 1 .5 14V6A2.5 2.5 0 0 1 3 3.5Z"/><text x="8.5" y="13.4">ع</text></g><path class="cv-o" d="M19.3 12h5.4M22.4 9l3 3-3 3"/><g class="cv-t"><path d="M30 3.5h11A2.5 2.5 0 0 1 43.5 6v8a2.5 2.5 0 0 1-2.5 2.5h-2.5v3l-3.5-3H30a2.5 2.5 0 0 1-2.5-2.5V6A2.5 2.5 0 0 1 30 3.5Z"/><text x="35.5" y="13.6">A</text></g></svg></button><span class="mc-cs">' + tr + '</span></div></div></div>';
      });
      e.innerHTML = h + '</div>' + mcPanelHtml(); mcKaydir(e); mcCubukKur(e); mcTekerKur(e); if (MC.panelKapali || MC.panelKim !== mcPanelKim(b)) e.classList.add('mc-pkapali');   /* KİTAP PANELİ (14.11.2026) */   /* KİTAP TEK PANEL (14.11.2026): pencere yalnız düğmesine basılan blokta */
      ['pointerdown', 'touchstart', 'wheel'].forEach(function (t) { e.addEventListener(t, function (ev) { if (t === 'wheel' ? !ev.ctrlKey : !mcBos(ev)) ev.stopPropagation(); }, { passive: true }); });   /* KİTAP BOŞLUK: boşlukta yaklaş / uzaklaş */
      e.addEventListener('dblclick', function (ev) { ev.stopPropagation(); });
      e.addEventListener('click', function (ev) {
        ev.stopPropagation(); if (kkYanki(ev)) return;
        if (e.mcSur && Date.now() - e.mcSur < 400) return;
        if (MC.panelYut) { var yut = Date.now() - MC.panelYut < 700; MC.panelYut = 0; if (yut) return; }       /* KİTAP YAZDIR: pencereyi kapatan dokunuş başka iş yapmaz */              /* KİTAP ANAHTARLARI: sürükleme dokunuş sayılmaz */
        var sw = ev.target.closest('.mc-sw'), A = mcAyar();
        if (ev.target.closest('.mc-aksil')) { [].forEach.call(e.querySelectorAll('.mc-c.acik, .mc-w.acik'), function (x) { x.classList.remove('acik'); }); return; }   /* AÇILAN ÇEVİRİLER KALIR (14.11.2026) */
        if (ev.target.closest('.mc-hzb')) { A.hz = ((+A.hz || 0) + 1) % 3; try { localStorage.setItem('kitapCalisma|' + KK_KITAP, JSON.stringify(A)); } catch (x) { } mcUygula(); return; }   /* KİTAP SİMGE SATIRI: dizilim */
        var ybb = ev.target.closest('.mc-yb');                          /* KİTAP SİMETRİ: yazı boyu */
        if (ybb) { A.yb = Math.round(Math.max(0.7, Math.min(2, (+A.yb || 1) + 0.1 * (+ybb.getAttribute('data-d')))) * 10) / 10; try { localStorage.setItem('kitapCalisma|' + KK_KITAP, JSON.stringify(A)); } catch (x) { } mcUygula(); return; }
        var pdb = ev.target.closest('.mc-pdf');
        if (pdb) { var is = pdb.getAttribute('data-is') || 'indir'; if (e.mcIs !== is) mcPdfMenuKapat(); e.mcIs = is; mcPdfMenu(e); return; }
        var pmb = ev.target.closest('.mc-pdfm button'); if (pmb) { var sade = pmb.getAttribute('data-y'); mcPdfMenuKapat(); mcYazdir(b, sade, e, e.mcIs); return; }   /* KİTAP ÇEKİM (14.11.2026): PDF */
        if (ev.target.closest('.mc-ayarb') || ev.target.closest('.mc-pkapat')) {   /* KİTAP PANELİ: görünüm penceresi aç / kapat */
          var pkapa = !!ev.target.closest('.mc-pkapat') || !e.classList.contains('mc-pkapali');   /* KİTAP TEK PANEL (14.11.2026): yalnız bu blokta aç */
          [].forEach.call(document.querySelectorAll('.hs-calisma'), function (x) { x.classList.add('mc-pkapali'); });
          if (!pkapa) e.classList.remove('mc-pkapali'); MC.panelKapali = pkapa; MC.panelKim = pkapa ? '' : mcPanelKim(b); return;
        }
        var sgb = ev.target.closest('.mc-sg button');
        if (sgb) {
          var sgg = sgb.parentNode.getAttribute('data-g'), sgv = +sgb.getAttribute('data-v'); A[sgg] = (sgg !== 'kt' && A[sgg] === sgv) ? 0 : sgv; mcAyarDuz(A);
          try { localStorage.setItem('kitapCalisma|' + KK_KITAP, JSON.stringify(A)); } catch (x) { }
          if (A.km !== 1) [].forEach.call(document.querySelectorAll('.hs-calisma .mc-w.acik'), function (x) { x.classList.remove('acik'); });
          if (A.cm !== 1) [].forEach.call(document.querySelectorAll('.hs-calisma .mc-c.acik'), function (x) { x.classList.remove('acik'); });
          mcUygula(); return;
        }
        if (sw) { var a = sw.getAttribute('data-a'); A[a] = A[a] ? 0 : 1; try { localStorage.setItem('kitapCalisma|' + KK_KITAP, JSON.stringify(A)); } catch (x) { } if (!A.kelime && !A.ustte) [].forEach.call(document.querySelectorAll('.hs-calisma .mc-w.acik'), function (x) { x.classList.remove('acik'); }); mcUygula(); return; }
        var gz = ev.target.closest('.mc-goz'); if (gz) { gz.closest('.mc-c').classList.toggle('acik'); return; }
        var tm = ev.target.closest('.mc-tumses'); if (tm) { mcSesSira(e, tm); return; }   /* KİTAP GÖRÜNÜMÜ: sırayla dinle */
        var sb = ev.target.closest('.mc-ses'); if (sb) { mcSesCal(e, sb, false); return; }   /* KİTAP SESİ: cümleyi dinle / durdur */
        var ts = ev.target.closest('.mc-ts');
        if (ts) {                                                       /* Türkçe kelimeye dokun: Arapça eşi vurgulanır */
          var cc = ts.closest('.mc-c'), vardi = ts.classList.contains('mc-es');
          [].forEach.call(cc.querySelectorAll('.mc-es'), function (x) { x.classList.remove('mc-es'); });
          if (!vardi) { ts.classList.add('mc-es'); var es = cc.querySelector('.mc-w[data-w="' + ts.getAttribute('data-w') + '"]'); if (es) es.classList.add('mc-es'); }
          return;
        }
        var w = ev.target.closest('.mc-w'); if (!w) return;   /* KİTAP ANAHTARLARI: cümleye dokun → çevirisi */
        var c = b.c[+w.getAttribute('data-c')], v = c && c.w[+w.getAttribute('data-w')]; if (!v) return;
        if (A.kok) { MC.sonW = (A.kelime && !A.ustte) ? w : null; mcKokAc(String(v[0] || ''), String(v[1] || ''), w, v[3]); return; }   /* METİN ÇALIŞMASI 4 (14.11.2026): önce kök; pencere kapanınca anlam */   /* METİN ÇALIŞMASI 3 (14.11.2026): Kelime de açıksa ilk dokunuş anlam, ikincisi kök */
        if (A.kelime && !A.ustte) w.classList.toggle('acik');
        var c2 = w.closest('.mc-c'), vardi2 = w.classList.contains('mc-es');
        [].forEach.call(c2.querySelectorAll('.mc-es'), function (x) { x.classList.remove('mc-es'); });
        if (!vardi2) { w.classList.add('mc-es'); var e2 = c2.querySelector('.mc-ts[data-w="' + w.getAttribute('data-w') + '"]'); if (e2) e2.classList.add('mc-es'); }
      });
      mcAkIzle(e, b);                                                 /* AÇILAN ÇEVİRİLER KALIR (14.11.2026) */
      var A0 = mcAyar(); MC_AD.forEach(function (a) { if (A0[a[0]]) e.classList.add('mc-' + a[0]); });
      setTimeout(mcUygula, 0);
      return e;
    }
    function mcKokYukle(sonra) {
      if (MC.yuk === 2) { sonra(); return; }
      MC.bekle.push(sonra); if (MC.yuk) return; MC.yuk = 1; var n = 3;
      function bit() {
        if (--n) return; MC.yuk = 2; MC.harita = kok.KIDEF_KOK_HARITA || {}; MC.kokler = kok.KITAP_KOKLER || {}; MC.sozluk = kok.KITAP_SOZLUK || {}; MC.listeler = kok.KITAP_LISTELER || {}; MC.svg = kok.KITAP_SVG || {}; MC.emsvg = kok.KITAP_EMOJI_SVG || {}; MC.havuz = kok.KITAP_SVG_HAVUZ || {}; MC.liste = {};   /* EMOJİ → SVG (14.11.2026) */
        Object.keys(MC.sozluk).forEach(function (k) { var t = MC.sozluk[k][0]; if (t) (MC.liste[t] = MC.liste[t] || []).push(k); });
        var B = MC.bekle; MC.bekle = []; B.forEach(function (f) { try { f(); } catch (x) { } });
      }
      ['kokharita.js', 'kokler.js', 'kelimesvg.js'].forEach(function (ad) { var s = document.createElement('script'); s.src = new URL(ad, location.href).href; s.onload = bit; s.onerror = bit; document.head.appendChild(s); });
    }
    /* KİTAP FİİL BUL (14.11.2026): hareke uyumu · çekimli biçim dizini */
    function mcHarfler(s) {                                            /* 'كَتَبَ' → [{h:'ك', m:'َ'}, …] */
      var R = [], t = String(s || '').replace(/ـ/g, '');
      for (var i = 0; i < t.length; i++) { var c = t.charAt(i); if (/[ء-غف-ي]/.test(c)) R.push({ h: c, m: '' }); else if (/[ً-ْٰ]/.test(c) && R.length) R[R.length - 1].m += c; }
      return R;
    }
    function mcUyum(a, b) {                                            /* harfler aynı; ikisinde de hareke olan harfte (son harf hariç) sesli çelişmiyor */
      var A = mcHarfler(a), B = mcHarfler(b); if (A.length > B.length) A = A.slice(A.length - B.length); if (A.length !== B.length) return false;
      var sesli = function (m) { var x = /[َُِْ]/.exec(m); return x ? x[0] : ''; };
      for (var i = 0; i < A.length; i++) { if (A[i].h !== B[i].h) return false; if (i === A.length - 1) break; var x = sesli(A[i].m), y = sesli(B[i].m); if (x && y && x !== y) return false; }
      return true;
    }
    function mcCekimDizin() {                                          /* harekesiz çekimli biçim → [[kök, kalıp no, biçim]] */
      if (MC.ckD) return MC.ckD; var D = {}; if (!MC.cekim) return D;
      var ekle = function (k, kn, w) { var s = mcSade(w); if (s.length < 2) return; (D[s] = D[s] || []).push([k, kn, w]); };
      Object.keys(MC.cekim).forEach(function (k) { Object.keys(MC.cekim[k]).forEach(function (kn) { var x = MC.cekim[k][kn];
        x[0].split('|').forEach(function (w) { ekle(k, kn, w); });
        if (x[1]) x[1].split('|').forEach(function (w, i) { ekle(k, kn, w); var c = mcCezm(w, i, 'c'), n = mcCezm(w, i, 'n'); if (c !== w) ekle(k, kn, c); if (n !== w && n !== c) ekle(k, kn, n); });
        if (x[2]) x[2].split('|').forEach(function (w) { ekle(k, kn, w); }); }); });
      MC.ckD = D; return D;
    }
    function mcCekimBul(kelime, kk) {                                  /* kelime çekimli bir fiil biçimi mi? → [kök, kalıp no] (kk verilirse yalnız o kökte) */
      var D = mcCekimDizin(), ham = String(kelime || '').replace(/[^ء-ْٰ]/g, ''), V = [ham], H = mcHarfler(ham), sonuc = null;
      if (H.length > 3 && 'وفسل'.indexOf(H[0].h) >= 0) V.push(H.slice(1).map(function (x) { return x.h + x.m; }).join(''));
      V.some(function (v) { var L = D[mcSade(v)] || []; return L.some(function (x) { if (kk && x[0] !== kk) return false; if (!mcUyum(v, x[2])) return false; sonuc = [x[0], x[1]]; return true; }); });
      return sonuc;
    }
    function mcKokBul(ar) {                                            /* kelime (birkaç sözcük olabilir) → {k: sözlük anahtarı / kök, s: sözcük} — önce kökü olan */
      var P = String(ar || '').split(/\s+/), i, j, yedek = null;
      for (i = 0; i < P.length; i++) {
        var s = mcSade(P[i]); if (s.length < 2) continue;
        var D = [s, s.replace(/^(وال|بال|فال|كال|لل|ال)/, ''), s.replace(/^[وفبلك]/, ''), s.replace(/^[وفبلك]?(ال)?/, '').replace(/(ي|ك|ه|ها|نا|كم|هم|ات|ون|ين|ة)$/, '')];
        for (j = 0; j < D.length; j++) { var e = MC.harita[D[j]]; if (!e) continue; if (MC.kokler[e[0]]) return { k: e[0], s: P[i] }; if (MC.sozluk[e[0]] && !yedek) yedek = { k: e[0], s: P[i] }; }
      }
      for (i = 0; i < P.length; i++) { var cb = mcCekimBul(P[i]); if (cb && MC.kokler[cb[0]]) return { k: cb[0], s: P[i] }; }   /* KİTAP FİİL BUL: çekimli fiil */
      return yedek;
    }
    function mcSimge(ar, emoji) {                                      /* kelimenin animasyonlu SVG'si (havuzda varsa), yoksa emojisi */
      var coz = function (v) { return !v ? '' : (String(v).charAt(0) === '<' ? String(v) : ((MC.havuz && MC.havuz[v]) || '')); };   /* EMOJİ → SVG: kimlik ya da SVG metni */
      var s = coz(MC.svg && MC.svg[mcSade(ar)]) || coz(emoji && MC.emsvg && MC.emsvg[String(emoji).replace(/\uFE0F/g, '').trim()]);
      return s ? '<span class="mc-sv">' + s + '</span>' : (emoji ? '<span class="mc-em">' + kkEsc(String(emoji)) + '</span>' : '');
    }
    function mcPencereKapat() { var p = document.getElementById('mcCicek'); if (p && p.parentNode) { p.parentNode.removeChild(p); if (MC.sonW) { MC.sonW.classList.add('acik'); MC.sonW = null; } } }
    function mcPencere(ic, etiket) {
      mcPencereKapat();
      var p = document.createElement('div'); p.id = 'mcCicek'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', etiket); p.innerHTML = ic;
      ['pointerdown', 'touchstart', 'wheel'].forEach(function (t) { p.addEventListener(t, function (ev) { ev.stopPropagation(); }, { passive: true }); });
      p.addEventListener('click', function (ev) { ev.stopPropagation(); if (ev.target === p || ev.target.closest('.mc-kapat')) mcPencereKapat(); });
      document.body.appendChild(p); return p;
    }
    /* KİTAP KÖK EK (14.11.2026): elle anahtar · geniş arama · her kelimeye kart */
    function mcEkDizin() {                                             /* kök yaprakları + sözlüğün tekil / çoğulları → anahtar */
      if (MC.ekDizin) return MC.ekDizin; var D = {}, r, k;
      for (r in MC.kokler) { ((MC.kokler[r] || {}).k || []).forEach(function (y) { var s = mcSade(y[0]); if (s.length >= 3 && !D[s]) D[s] = r; }); }
      for (k in MC.sozluk) { var S = MC.sozluk[k] || []; [S[2], S[4]].forEach(function (a) { var s = mcSade(a); if (s.length >= 2 && String(a).indexOf(' ') < 0 && !D[s]) D[s] = k; }); }
      return (MC.ekDizin = D);
    }
    function mcKokBulEk(ar) {                                          /* haritada bulunamayan biçimler */
      var P = String(ar || '').split(/\s+/), X = mcEkDizin(), i, j;
      for (i = 0; i < P.length; i++) {
        var s = mcSade(P[i]); if (s.length < 3) continue;
        var G = [s, s.replace(/^و/, '')], T = [];
        G.forEach(function (g) { T.push(g); T.push(g.replace(/^(بال|كال|لل|ال)/, '')); if (/^[و]?[بل]ِ/.test(P[i])) T.push(g.replace(/^[بل]/, '')); });
        var D = [];
        T.forEach(function (t) { if (t.length < 2) return; D.push(t);
          if (/ً/.test(P[i])) D.push(t.replace(/ا$/, ''));                                       /* tenvin elifi */
          D.push(t.replace(/ت(ي|ك|ه|ها|نا|كم|هم)$/, 'ة'));                                             /* müennes + zamir */
          D.push(t.replace(/(ي|ك|ه|ها|نا|كم|هم)$/, ''));
          D.push(t.replace(/ة$/, '')); D.push(t.replace(/ية$/, 'ي')); D.push(t.replace(/ية$/, '')); D.push(t.replace(/(ات|ون|ين)$/, '')); });
        for (j = 0; j < D.length; j++) { var d = D[j]; if (d.length < 2) continue;
          var e = MC.harita[d]; if (e && (MC.kokler[e[0]] || MC.sozluk[e[0]])) return { k: e[0], s: P[i] };
          if (d.length >= 3 && X[d]) return { k: X[d], s: P[i] }; }
      }
      return null;
    }
    function mcKokSec(ar, anahtar) {                                   /* elle anahtar → arama → ek arama */
      var a = typeof anahtar === 'string' ? anahtar.trim() : '';
      if (a === '-') return null;
      if (a && (MC.kokler[a] || MC.sozluk[a])) {
        var P = String(ar || '').split(/\s+/), en = -1, sec = P[0] || '', H = mcSade(a);
        P.forEach(function (p) { var s = mcSade(p), n = 0, at = 0; for (var i = 0; i < H.length; i++) { var q = s.indexOf(H.charAt(i), at); if (q >= 0) { n++; at = q + 1; } } if (s.length >= 2 && n > en) { en = n; sec = p; } });
        return { k: a, s: sec };
      }
      return mcKokBul(ar) || mcKokBulEk(ar);
    }
    function mcKartSade(ar, tr) {                                      /* sözlükte olmayan kelime: kendisi + metindeki anlamı */
      mcKart(['', '', String(ar || '').replace(/[.,،؛؟!:«»"]/g, '').trim(), String(tr || '').replace(/[.,;:?!]+$/, '').trim()]);
    }
    function mcKokAc(ar, tr, el, anahtar) {
      mcKokYukle(function () { mcCekimYukle(function () {             /* KİTAP FİİL BUL: çekim verisi de hazır olsun */
        var B = mcKokSec(ar, anahtar);                                /* KİTAP KÖK EK (14.11.2026) */
        if (!B) { mcKartSade(ar, tr); return; }
        if (MC.kokler[B.k]) { mcCicek(B, tr); return; }
        var S = MC.sozluk[B.k], L = S[0] && S[0] !== 'isim' ? (MC.liste[S[0]] || []) : [];
        if (L.length >= 3) mcListe(B.k, S[0], L); else mcKart(S);
      }); });
    }
    function mcCicek(B, tr) {                                          /* fiil kökenli: ortada kök, yapraklarda türevler */
      var K = MC.kokler[B.k], L = (K.k || []).slice(), s = mcSade(B.s).replace(/^[وفبلك]?(ال)?/, ''), akt = -1, en = 0;
      var ham = String(B.s).replace(/[^\u0621-\u0652\u0670]/g, ''), ekF = null;   /* KİTAP FİİL BUL (14.11.2026): hareke çelişen yaprak eşleşmez */
      L.forEach(function (y, i) { var p = mcSade(y[0]); if (!p) return; var tam = s === p; if (tam && !mcUyum(ham, y[0])) return;
        var puan = tam ? 99 : (s.indexOf(p) === 0 || (p.length >= 3 && s.indexOf(p) >= 0)) ? p.length : 0; if (puan > en || (puan === en && puan > 0 && (puan < 99 || /^[وفبلك]?ال/.test(mcSade(B.s))) && akt >= 0 && L[akt][2] === 'f' && y[2] !== 'f')) { en = puan; akt = i; } });   /* KİTAP KÖK EK: eşitlikte isim yaprağı (صَفّي → صَفّ, الصَّفّ); çekimli fiili çekim dizini bulur */
      if (en < 99) { var cb = mcCekimBul(B.s, B.k);                    /* çekimli fiil biçimi → o fiilin yaprağı */
        if (cb) { var li = -1; L.forEach(function (y, i) { if (y[2] === 'f' && +y[8] === +cb[1]) li = i; });
          if (li >= 0) { akt = li; en = 98; }
          else { var cx = MC.cekim[cb[0]][cb[1]]; ekF = [cx[0].split('|')[0], tr, 'f', '', cx[1] ? cx[1].split('|')[0] : '', cx[2] ? cx[2].split('|')[0] : '', '', '', +cb[1]]; akt = -1; en = 98; } } }
      L.forEach(function (y, i) { if (y[2] !== 'f' || !y[4]) return; var m = mcSade(y[4]).slice(1); if (m.length >= 2 && /^[يتأنا]/.test(s) && s.slice(1).indexOf(m) === 0 && m.length + 1 > en) { en = m.length + 1; akt = i; } });   /* KİTAP SARF: muzâri biçimindeki kelime (أُرِيدُ) → fiili (أَرَادَ) */
      var isim = [], fiil = []; L.forEach(function (y, i) { (y[2] === 'f' ? fiil : isim).push(i); });
      /* KİTAP KÖK GÖRÜNÜMÜ (14.11.2026): çizim mcKokCiz'de — çiçek / dal / kart */
      var ekY = akt < 0 ? (ekF ? { ar: ekF[0], tr: tr, em: '', a: true, f: ekF } : { ar: String(B.s).replace(/[.,،؛؟!:«»"]/g, ''), tr: tr, em: '', a: true }) : null;
      mcKokCiz({ B: B, K: K, isim: isim, fiil: fiil, akt: akt, ek: ekY, yap: function (i) { return { ar: L[i][0], tr: L[i][1], em: L[i][3], a: i === akt, f: L[i][2] === 'f' ? L[i] : null }; } }, null);
    }
    var MC_KT = [
      ['Çiçek', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="2.6"/><ellipse cx="12" cy="5.4" rx="2.3" ry="3.1"/><ellipse cx="12" cy="18.6" rx="2.3" ry="3.1"/><ellipse cx="5.4" cy="12" rx="3.1" ry="2.3"/><ellipse cx="18.6" cy="12" rx="3.1" ry="2.3"/></svg>'],
      ['Dal', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="15.5" y="9" width="6" height="6" rx="1.6"/><path d="M15.5 12h-3.2M12.3 6.5v11M12.3 6.5H9M12.3 17.5H9"/><rect x="2.5" y="4" width="6.5" height="5" rx="1.5"/><rect x="2.5" y="15" width="6.5" height="5" rx="1.5"/></svg>'],
      ['Kart', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3.5" width="7.5" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7.5" height="7" rx="1.8"/><rect x="3" y="13.5" width="7.5" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7.5" height="7" rx="1.8"/></svg>']
    ];
    function mcKokCiz(D, acik) {                                       /* D: {B, K, isim, fiil, akt, ek, yap} · acik: tasarım değişirken açık kalanlar */
      var A = mcAyar(), kt = (A.kt === 1 || A.kt === 2) ? A.kt : 0, B = D.B, K = D.K, Y = [], h = '';
      var ic = function (y) { return mcSimge(y.ar, y.em) + '<b lang="ar" dir="rtl">' + kkEsc(y.ar) + '</b><small>' + kkEsc(String(y.tr || '').split(' / ')[0].replace(/[.?!]+$/, '')) + '</small>' + (y.f ? '<em class="mc-ck" title="Çekim tablosu">' + MC_IK.tablo + '</em>' : ''); };
      var sinif = function (y) { return (y.f ? ' mc-fiil' : '') + (y.a ? ' akt' : ' kapali'); };
      var oz = '<div class="mc-oz kapali" title="Dokun: kökü göster"><b lang="ar" dir="rtl">' + kkEsc(mcKokLevha(B.k)) + '</b><small>' + kkEsc(String(K.a || '').split(' / ')[0]) + '</small></div>';
      var tas = '<span class="mc-tas" role="group" aria-label="Kök görünümü">' + MC_KT.map(function (t, i) { return '<button type="button" data-kt="' + i + '"' + (i === kt ? ' class="acik" aria-pressed="true"' : ' aria-pressed="false"') + ' title="' + t[0] + '" aria-label="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</span>';
      var kapat = '<button type="button" class="mc-kapat" aria-label="Kapat">' + MC_IK.kapat + '</button>', tum = '<button type="button" class="mc-tum">Tümünü aç</button>';
      var lej = '<span class="mc-lej"><i class="f"></i>fiil — dokun: çekim tablosu<i class="i"></i>isim</span>';
      if (kt === 0) {                                                  /* çiçek: yatay ekranda oval */
        var vw = window.innerWidth || 1000, vh = window.innerHeight || 800, Hh = Math.min(vh * 0.98, 1000), Ww = Math.min(vw * 0.98, 1800), en = Math.max(1, Math.min(1.8, Ww / Hh)), boy = Math.round(Math.min(Hh, Ww));
        var EN = en >= 1.5 ? 12 : (en >= 1.25 ? 10 : 8);
        var S = D.isim.slice(0, EN - 2).concat(D.fiil.slice(0, EN - Math.min(EN - 2, D.isim.length))).slice(0, EN);
        if (S.length < EN) D.isim.slice(EN - 2).forEach(function (i) { if (S.length < EN) S.push(i); });
        if (D.akt >= 0 && S.indexOf(D.akt) < 0) S[S.length >= EN ? EN - 1 : S.length] = D.akt;
        if (D.ek && S.length >= EN) S.pop();
        Y = S.map(D.yap); if (D.ek) Y.unshift(D.ek);
        var n = Y.length, gen = Math.min(34, 330 / Math.max(n, 5)), pk = '', lb = '';
        Y.forEach(function (y, i) {
          var t = i * 360 / n, r = t * Math.PI / 180;
          pk += '<i class="mc-yp' + sinif(y) + '" data-i="' + i + '" style="width:' + gen + '%;margin-left:-' + gen / 2 + '%;transform:rotate(' + t + 'deg)"></i>';
          lb += '<span class="mc-ye' + sinif(y) + '" data-i="' + i + '" style="left:' + (50 + Math.sin(r) * 34) + '%;top:' + (50 - Math.cos(r) * 34) + '%">' + ic(y) + '</span>';
        });
        h = '<div class="mc-kokp mc-cicek' + (en > 1.05 ? ' mc-oval' : '') + (n > 8 ? ' mc-cok' : '') + '" style="width:' + Math.round(boy * en) + 'px;height:' + boy + 'px">' + kapat + tas +
          '<div class="mc-ypk" style="width:' + boy + 'px;margin-left:-' + boy / 2 + 'px;transform:scaleX(' + en + ')">' + pk + '</div>' + lb + oz + tum + lej + '</div>';
      } else {                                                         /* dal / kart: kökün bütün kelimeleri */
        var Yi = D.isim.map(D.yap), Yf = D.fiil.map(D.yap); if (D.ek) (D.ek.f ? Yf : Yi).unshift(D.ek);
        Y = Yi.concat(Yf);
        var dy = function (y) { return '<span class="mc-dy' + sinif(y) + '" data-i="' + Y.indexOf(y) + '">' + ic(y) + '</span>'; };
        var ust = '<div class="mc-kust">' + tas + lej + tum + kapat + '</div>';
        if (kt === 1) h = '<div class="mc-kokp mc-dal">' + ust + '<div class="mc-dg"><div class="mc-dkok">' + oz + '</div><div class="mc-dkl">' +
          (Yi.length ? '<div class="mc-dk i"><u>İsimler</u><div class="mc-dl">' + Yi.map(dy).join('') + '</div></div>' : '') +
          (Yf.length ? '<div class="mc-dk f"><u>Fiiller</u><div class="mc-dl">' + Yf.map(dy).join('') + '</div></div>' : '') + '</div></div></div>';
        else h = '<div class="mc-kokp mc-kg">' + ust + '<div class="mc-kb">' + oz + '</div><div class="mc-kl">' + Y.map(dy).join('') + '</div></div>';
      }
      var sw = MC.sonW; MC.sonW = null; var p = mcPencere(h, 'Kök penceresi'); MC.sonW = sw;   /* yeniden çizerken kelimenin anlamı erken açılmasın */
      var c = p.querySelector('.mc-kokp'); if (!c) return;
      function ac(e) { if (e && e.classList.contains('kapali')) { e.classList.remove('kapali'); e.classList.add('mc-yeni'); } }
      function tumBak() { if (!c.querySelector('.kapali')) { var tb = c.querySelector('.mc-tum'); if (tb) tb.hidden = true; } }
      if (acik) {
        if (acik.oz) { var o = c.querySelector('.mc-oz'); if (o) o.classList.remove('kapali'); }
        Y.forEach(function (y, i) { if (acik.y[y.ar]) [].forEach.call(c.querySelectorAll('[data-i="' + i + '"]'), function (e) { e.classList.remove('kapali'); }); });
      }
      tumBak();
      p.addEventListener('click', function (ev) {                      /* kapalı açılır: köke / kelimeye dokun → açılır; «Tümünü aç» */
        var tb = ev.target.closest('.mc-tas button');
        if (tb) {                                                      /* tasarım değiştir: açılmış olanlar açık kalır */
          var yeni = +tb.getAttribute('data-kt'); if (yeni === kt) return;
          var ak = { oz: !c.querySelector('.mc-oz.kapali'), y: {} };
          Y.forEach(function (y, i) { var e = c.querySelector('[data-i="' + i + '"]'); if (e && !e.classList.contains('kapali')) ak.y[y.ar] = 1; });
          A.kt = yeni; try { localStorage.setItem('kitapCalisma|' + KK_KITAP, JSON.stringify(A)); } catch (x) { }
          mcUygula(); mcKokCiz(D, ak); return;
        }
        if (ev.target.closest('.mc-tum')) { [].forEach.call(c.querySelectorAll('.kapali'), ac); ev.target.closest('.mc-tum').hidden = true; return; }
        if (ev.target.closest('.mc-oz')) { ac(c.querySelector('.mc-oz')); }
        else { var y = ev.target.closest('[data-i]');
          if (y) { var yi = +y.getAttribute('data-i'), kapaliydi = y.classList.contains('kapali'); [].forEach.call(c.querySelectorAll('[data-i="' + yi + '"]'), ac);
            if (!kapaliydi && Y[yi] && Y[yi].f) mcTablo(Y[yi].f, B.k); } }   /* açık fiil → fiil tablosu */
        tumBak();
      });
    }
    function mcListe(anahtar, tip, L) {                                /* listeye ait kelime: iki sütun, dikey kaydırma */
      var T = MC.listeler[tip] || [tip, ''], h = '';
      L.forEach(function (k) {
        var S = MC.sozluk[k];
        h += '<div class="mc-lk' + (k === anahtar ? ' akt' : '') + '"><span class="mc-le">' + mcSimge(S[2], S[1]) + '</span><span class="mc-lm"><b lang="ar" dir="rtl">' + kkEsc(S[2]) + '</b><small>' + kkEsc(S[3]) + '</small>' +
          (S[4] ? '<i><u>ج</u> <b lang="ar" dir="rtl">' + kkEsc(S[4]) + '</b>' + (S[5] ? ' · ' + kkEsc(S[5]) : '') + '</i>' : '') + '</span></div>';
      });
      var p = mcPencere('<div class="mc-liste"><div class="mc-lb"><span>' + kkEsc(T[1] || '') + '</span><b>' + kkEsc(T[0]) + '</b><small>' + L.length + ' kelime</small><button type="button" class="mc-kapat" aria-label="Kapat">' + MC_IK.kapat + '</button></div><div class="mc-lg">' + h + '</div></div>', T[0]);
      var a = p.querySelector('.mc-lk.akt'), g = p.querySelector('.mc-lg'); if (a && g) g.scrollTop = Math.max(0, a.offsetTop - g.offsetTop - g.clientHeight / 2 + a.offsetHeight / 2);
    }
    function mcKart(S) {                                               /* câmid kelime: tekili, çoğulu */
      mcPencere('<div class="mc-kart"><button type="button" class="mc-kapat" aria-label="Kapat">' + MC_IK.kapat + '</button><span class="mc-ke">' + mcSimge(S[2], S[1]) + '</span><b lang="ar" dir="rtl">' + kkEsc(S[2]) + '</b><small>' + kkEsc(S[3]) + '</small>' +
        (S[4] ? '<div class="mc-kc"><u>Çoğulu</u><b lang="ar" dir="rtl">' + kkEsc(S[4]) + '</b>' + (S[5] ? '<small>' + kkEsc(S[5]) + '</small>' : '') + '</div>' : '') + '</div>', 'Kelime kartı');
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.getElementById('mcCicek') && !document.getElementById('mcTablo')) { e.stopPropagation(); mcPencereKapat(); } }, true);
    try { hsYukle(); } catch (x) { }
    setInterval(function () { try { hsYukle(); hsCiz(); mcSesGorunen(); } catch (x) { } }, 1500);
    function dsCevapKur(s, a, j) {
      var y = kkYuz(s); if (!y || y.querySelector('.ds-cevap[data-ds="' + j + '"]')) return;
      var cvq = dsCevapVeri(a); if (cvq && dsCevapVekKur(y, cvq, j, a)) return;   /* CEVAP YAZI: yazısı varsa resim yok */
      var k = document.createElement('div'), yer = dsCevapYeri(a);
      k.className = 'ds-cevap' + (yer ? ' ds-yerli' : '') + (a.ar && /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(a.ar) ? ' ds-arli' : '') + (a.res ? ' ds-resli' : '') + (a.res && a.sef ? ' ds-sef' : ''); k.setAttribute('data-ds', String(j));   /* CEVAP RESMİ (02.11.2026) */
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
      if (a.res) h = '<img class="ds-res" alt="Cevap" draggable="false" src="' + kkEsc(String(a.res)) + '"' + (rkGecer(a.rk) && /_k\.webp$/i.test(String(a.res)) ? ' style="filter:' + rkSuzgec(a.rk) + '"' : '') + '>' + h;   /* CEVAP RENGİ */   /* CEVAP RESMİ: cevap anahtarının parçası */
      if (!h) return;                                           /* yazısız cevap: sayfaya bir şey yazılmaz */
      k.innerHTML = '<div class="ds-yazi">' + h + '</div>';
      ['pointerdown', 'touchstart'].forEach(function (t) { k.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true }); });
      k.addEventListener('click', function (e) { e.stopPropagation(); });
      y.appendChild(k);
      dsCevapOlc(k, y);
    }
    /* yazı boyu sayfaya göre; yeri çizilmişse o alana sığdırılır (en çok 1.6 kat büyür) */
    function dsCevapOlc(k, y) {
      if (k.classList.contains('ds-resli')) return;                 /* CEVAP RESMİ: resim kutuya kendisi sığar */
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
      var dkDeg = false, tb = DS.taban > -1 ? DS.taban : -1;      /* SAYFA ŞERİDİ: dokunma adımları; ETKİNLİK DEĞİŞİNCE: tabandan öncesi kapalı */
      L.forEach(function (a, j) {
        var ac = j <= i && j >= tb;
        if (a.t === 'dk') { if (dsDokunDurum(s, +a.j, ac)) dkDeg = true; return; }
        if (a.t === 'dv') { dsDvGoster(y, a, j, j === i); return; }   /* DOKUNMA VURGUSU: yalnız kendi adımında */
        if (a.t === 'ortu') {
          var o = y.querySelector('.ds-ortu[data-ds="' + j + '"]');
          if (o) o.classList.toggle('acik', ac);
        } else if (a.t === 'cevap') {
          var k = y.querySelector('.ds-cevap[data-ds="' + j + '"]'), im = y.querySelector('.ds-isaret[data-ds="' + j + '"]');
          if (ac) { if (!k) dsCevapKur(s, a, j); if (!im) dsIsaretKur(s, a, j);
            var Mx = (j < i || m == null) ? Infinity : m, Ub = dsCvSay(a);   /* CEVAP ELLE: önce cevaplar, sonra işaretler */
            if (Ub) dsCvGoster(s, j, Mx); dsIsaretGoster(s, j, Mx - Ub); }
          else { if (k && k.parentNode) k.parentNode.removeChild(k); if (im && im.parentNode) im.parentNode.removeChild(im); }
          dsCvVurguKatman(s, a, j, ac, i, m);                          /* CEVAP VURGU */
        }
      });
      if (dkDeg) dkGoster(s);
    }
    /* ETKİNLİK BAŞI (02.11.2026) — öğretmen: "yanyana iki sayfa açık olduğu için diyelim
       ki sol sayfada başlamak istiyorum o sayfadaki yer açılsın, hatta açık olan 2
       sayfada 4-5 tane etkinlik olsun, her etkinlik alanına dokunulduğunda dokunulan yer
       mi ilgili etkinliğin baştan mı çalınması svg lerle seçilebilir olsun, ayrıca
       sayfada geri gidildiğinde ders modu açılmasın … ders moduna geçmek için her
       etkinlik için bi tuş olabilir, diğer ses video vs etkinlik svg leri değil sadece
       ders modu için svg olsun". Adım {t:'eb', ad, x, y}: sonraki adımlar (bir sonraki
       eb'ye dek) o etkinlik; x, y ders düğmesinin yeri. */
    var DS_EB_IK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="2.8" y="3.6" width="18.4" height="12.8" rx="2.2"/><path d="M8.2 20.4h7.6M12 16.4v4"/><path d="M10.2 7.4v5.2l4.4-2.6z" fill="currentColor" stroke="none"/></svg>';
    var DS_SOR_IK = {
      burada: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="3"/><circle cx="12" cy="9" r="6.5" opacity=".45"/><path d="M12 15.5v5.5"/></svg>',
      bastan: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5v14"/><path d="M19 5.5v13L8.5 12z" fill="currentColor" stroke="none"/></svg>'
    };
    function dsTamBant(a) { var x1 = a.x1 != null ? +a.x1 : 0, x2 = a.x2 != null ? +a.x2 : 100; return x2 - x1 >= 90; }   /* DOLDURMA HAZIRLIĞI (02.11.2026) */
    function dsVideoAdim(a) {                                         /* VİDEO AYRI (05.11.2026) */
      if (!a || a.t !== 'kaynak' || a.k == null) return false;
      var K = ((kok.KITAP_VERI || {}).kaynak || [])[+a.k]; return !!K && (K.tur === 'video' || K.tur === 'sarki');
    }
    function dsEtkinlikler(s) {                                     /* [{bas, son, eb, no}] — bas: ilk adımın sırası */
      var L = dsAdimlar(s), G = [], g = null, no = 0;
      L.forEach(function (a, i) {
        if (a.t === 'eb') { g = { bas: i + 1, son: i, eb: a, no: ++no, ebi: i, s: s }; G.push(g); return; }
        if (dsVideoAdim(a)) return;                                   /* VİDEO AYRI (05.11.2026): video etkinliğe katılmaz */
        if (!g) { g = { bas: i, son: i, eb: null, no: ++no, ebi: -1, s: s }; G.push(g); }
        g.son = i;
      });
      return G.filter(function (x) { return x.son >= x.bas; });
    }
    /* BOŞ ETKİNLİK (13.11.2026): adımları yalnız yakınlaştırma olan etkinlikte ders modu yok (düğme, yönerge vurgusu, dokunuş) */
    function dsEtkDolu(s) {
      var L = dsAdimlar(s);
      return dsEtkinlikler(s).filter(function (g) { for (var i = g.bas; i <= g.son; i++) { var a = L[i]; if (a && a.t !== 'yakin' && a.t !== 'eb' && !dsVideoAdim(a)) return true; } return false; });
    }
    function dsEbDugme(g) {                                          /* düğmenin yeri (% sayfa) */
      var a = g.eb;
      if (a && isFinite(+a.x) && isFinite(+a.y)) return { x: dsYuzde(a.x, 92), y: dsYuzde(a.y, 4) };
      var yn = g.s ? dsYonergeTahmin(g.s, g) : null;                   /* YÖNERGE TAHMİNİ (03.11.2026): yeri olmayan düğme yönergenin yanında */
      if (yn) return { x: 4.5, y: Math.round((yn.y1 + yn.y2) * 5) / 10 };
      return { x: 93, y: 3.5 };
    }
    function dsEbAlan(s, g) {                                        /* etkinliğin alanı: adımlarının yerleri (+ kısımlar, düğme) */
      var L = dsAdimlar(s), R = [], V = kok.KITAP_VERI || {}, Kn = V.kaynak || [], j;
      var ilk = false;                                                /* İLK ADIM SORMAZ (02.11.2026): ilk yeri olan adımın yerleri */
      function ekle(x1, y1, x2, y2) { x1 = +x1; y1 = +y1; x2 = +x2; y2 = +y2; if (isFinite(x1) && isFinite(y1) && isFinite(x2) && isFinite(y2) && x2 > x1 && y2 > y1) R.push({ x1: x1, y1: y1, x2: x2, y2: y2, ilk: ilk }); }
      for (j = g.bas; j <= g.son; j++) {
        var a = L[j]; if (!a) continue;
        var n0 = R.length; ilk = !R.length;
        if (a.t === 'kaynak' && a.k != null && Kn[+a.k] && Kn[+a.k].yol) {
          var KP = ksKisimlar(Kn[+a.k].yol).filter(function (p) { return ksVurguVar(p) && p.sayfa === s; });
          KP.forEach(function (p, k) { var ilk0 = ilk; if (k > 0) ilk = false; ekle(p.x1, p.y1, p.x2, p.y2); ilk = ilk0; });   /* sesin yalnız ilk kısmı «ilk» */
          if (R.length > n0) ilk = false;
        }
        if (dsBantVar(a) && !dsTamBant(a)) ekle(a.x1 != null ? a.x1 : 0, a.y1, a.x2 != null ? a.x2 : 100, a.y2);   /* DOLDURMA HAZIRLIĞI: tam geniş bant alan değil */
        if (a.t === 'cevap') ekle(a.kx1, a.ky1, a.kx2, a.ky2);
        if (a.t === 'dv') dsDvAlan(a).forEach(function (r) { ekle(r.x1, r.y1, r.x2, r.y2); });
      }
      ilk = false;
      var d = dsEbDugme(g); ekle(d.x - 3, d.y - 2.5, d.x + 3, d.y + 2.5);
      return R;
    }
    function dsEbAltta(x, y) {                                       /* dokunuş hangi etkinliğin alanında (görünen sayfalarda) */
      if (DS.aktif || !dsVeri() || !dsYetki() || dsIzleyen()) return null;
      var bul = null;
      kkGorunen().forEach(function (s) {
        if (bul || !dsAdimlar(s).length) return;
        var yz = kkYuz(s); if (!yz) return;
        var r = yz.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0)) return;
        var px = (x - r.left) / r.width * 100, py = (y - r.top) / r.height * 100;
        dsEtkDolu(s).forEach(function (g) {                          /* üst üste binerse en dar alan */
          dsEbAlan(s, g).forEach(function (q) {
            var al = (q.x2 - q.x1) * (q.y2 - q.y1);
            if (px >= q.x1 && px <= q.x2 && py >= q.y1 && py <= q.y2 && (!bul || al < bul.al)) bul = { s: s, g: g, al: al, ilk: !!q.ilk };
          });
        });
      });
      return bul;
    }
    /* DOKUN DERS AÇ (02.11.2026) — öğretmen: "sayfalar değişince ders modundan çıkılsın,
       hala bi yere dokununca etkinlik için yer çizilmişse direkt yaklaşma varsa
       yaklaşsın ve ses açılıp otomatik devam etsin". Etkinliğin yerine dokunuş: kısımsa
       ders o sesin adımından açılır ve ses o kısımdan sürer (adımlar sesle gelir);
       adımın yeriyse ders o adımdan; değilse etkinliğin başından. */
    function dsEbDokun(eg, x, y) {
      var s = eg.s, g = eg.g, L = dsAdimlar(s), V = kok.KITAP_VERI || {}, Kn = V.kaynak || [], j;
      var kp = dsKisimAltta(x, y);
      if (kp && kp.s === s) {
        var an = ksAnah(kp.src);
        for (j = g.bas; j <= g.son; j++) {
          var a = L[j];
          if (a && a.t === 'kaynak' && a.k != null && Kn[+a.k] && Kn[+a.k].yol && ksAnah(Kn[+a.k].yol) === an) {
            var P = ksKisimlar(kp.src)[kp.i];
            dsAc(s, j, true);
            if (P) {
              var n = 0, bekle = function () {                         /* ses açılsın, o kısımdan sürsün */
                var K = dsKisimK(an);
                if (K && K.el && !K.el.paused) { ksGit(K, Math.max(0, +P.b - 0.02), true); dsKisimYere(kp); return; }
                if (++n < 50 && DS.aktif) setTimeout(bekle, 100);
              };
              setTimeout(bekle, 450);
            }
            return;
          }
        }
      }
      var yz = kkYuz(s), r = yz ? yz.getBoundingClientRect() : null, en = null;
      if (r && r.width > 0 && r.height > 0) {
        var px = (x - r.left) / r.width * 100, py = (y - r.top) / r.height * 100;
        for (j = g.bas; j <= g.son; j++) {
          var b = L[j]; if (!b) continue;
          var R = [];
          if (dsBantVar(b) && !dsTamBant(b)) R.push([b.x1 != null ? +b.x1 : 0, +b.y1, b.x2 != null ? +b.x2 : 100, +b.y2]);
          if (b.t === 'cevap') R.push([+b.kx1, +b.ky1, +b.kx2, +b.ky2]);
          if (b.t === 'dv') dsDvAlan(b).forEach(function (q) { R.push([+q.x1, +q.y1, +q.x2, +q.y2]); });
          R.forEach(function (q) {
            var al = (q[2] - q[0]) * (q[3] - q[1]);
            if (isFinite(al) && al > 0 && px >= q[0] && px <= q[2] && py >= q[1] && py <= q[3] && (!en || al < en.al)) en = { j: j, al: al };
          });
        }
      }
      if (en) { dsAc(s, en.j, true); return; }
      dsEbBasla(s, g);
    }
    /* YÖNERGE VURGUSU (03.11.2026) — öğretmen: "yönergeler vurgulu olsun, tıklayınca ders modu açılsın, sonra sayfada
       dokunarak alttaki veya üstteki çizilen yerlere geçilebilsin, yani direkt kitapta etkinliğin ortasından başlanmasın".
       yonerge.js: metin.js'ten numaralı yönerge satırlarının yerleri; etkinlik başının (eb.y) en yakın yönergesi. */
    function dsYonerge(s, g) {
      var a = g && g.eb; if (!a || !isFinite(+a.y)) return dsYonergeTahmin(s, g);   /* YÖNERGE TAHMİNİ (03.11.2026) */
      var Y = kok.KITAP_YONERGE, R = (Y && Y.sayfa && Y.sayfa[s]) || [], en = null, ey = +a.y;
      R.forEach(function (r) { var d = Math.abs((r[1] + r[3]) / 2 - ey); if (d < 3.5 && (!en || d < en.d)) en = { d: d, r: r }; });
      if (en) return { x1: en.r[0], y1: en.r[1], x2: en.r[2], y2: en.r[3] };
      var x = dsYuzde(a.x, 5);                                       /* yönerge bulunamadı: düğmenin yanındaki satır */
      return x < 50 ? { x1: Math.min(60, x + 6), y1: Math.max(0, ey - 2.6), x2: 93, y2: Math.min(100, ey + 2.6) }
                    : { x1: 7, y1: Math.max(0, ey - 2.6), x2: Math.max(40, x - 4), y2: Math.min(100, ey + 2.6) };
    }
    /* YÖNERGE TAHMİNİ (03.11.2026) — öğretmen: "bazı sayfalarda tanımlı olduğu halde sarı vurgu görünmüyor
       yönergelerde": etkinlik başı yeri (eb.y) olmayan etkinlikte (Tezgâh'ta eb'siz / yersiz eb) yönerge, başka bir
       etkinlik başına ait olmayan yönerge satırlarından tahmin edilir: adımların en üst yerinin üstündeki en yakın
       (yoksa en yakın); adımların yeri yoksa sıradaki boş yönerge. Ünite başlığı numarası (y < 6) sayılmaz. */
    function dsYonergeTahmin(s, g) {
      if (!g) return null;
      var Y = kok.KITAP_YONERGE, R = ((Y && Y.sayfa && Y.sayfa[s]) || []).filter(function (r) { return (r[1] + r[3]) / 2 >= 6; });
      if (!R.length) return null;
      var L = dsAdimlar(s), ys = [];
      L.forEach(function (x) { if (x && x.t === 'eb' && isFinite(+x.y) && x.y !== null && x.y !== '') ys.push(+x.y); });
      var bos = R.filter(function (r) { var c = (r[1] + r[3]) / 2; return !ys.some(function (y) { return Math.abs(c - y) < 3.5; }); });
      if (!bos.length) return null;
      var V = kok.KITAP_VERI || {}, Kn = V.kaynak || [], ust = Infinity, j;
      function al(y) { y = +y; if (isFinite(y)) ust = Math.min(ust, y); }
      for (j = g.bas; j <= g.son; j++) {
        var a = L[j]; if (!a) continue;
        if (dsBantVar(a)) al(a.y1);
        if (a.t === 'cevap' && a.ky1 != null) al(a.ky1);
        if (a.t === 'dv') dsDvAlan(a).forEach(function (q) { al(q.y1); });
        if (a.t === 'kaynak' && a.k != null && Kn[+a.k] && Kn[+a.k].yol) ksKisimlar(Kn[+a.k].yol).forEach(function (p) { if (ksVurguVar(p) && p.sayfa === s) al(p.y1); });
      }
      var r = null;
      if (isFinite(ust)) {
        bos.forEach(function (q) { if (q[1] <= ust + 3 && (!r || q[1] > r[1])) r = q; });          /* üstündeki en yakın */
        if (!r) bos.forEach(function (q) { if (!r || Math.abs(q[1] - ust) < Math.abs(r[1] - ust)) r = q; });
      } else {
        var G = dsEtkinlikler(s).filter(function (x) { return !(x.eb && isFinite(+x.eb.y)); }), k = 0;
        G.forEach(function (x, i) { if (x.bas === g.bas) k = i; });
        r = bos[Math.min(k, bos.length - 1)];
      }
      return r ? { x1: r[0], y1: r[1], x2: r[2], y2: r[3] } : null;
    }
    function dsSayfaNokta(s, x, y) {                                  /* ekran noktası → sayfa yüzdesi (sayfanın dışıysa null) */
      var yz = kkYuz(s); if (!yz) return null;
      var r = yz.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0)) return null;
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) return null;
      return { x: (x - r.left) / r.width * 100, y: (y - r.top) / r.height * 100 };
    }
    function dsYonIcinde(yn, p) { return !!(yn && p && p.x >= yn.x1 - 0.8 && p.x <= yn.x2 + 0.8 && p.y >= yn.y1 - 0.8 && p.y <= yn.y2 + 0.8); }
    function dsYonAltta(x, y) {                                       /* dokunuş bir etkinliğin yönergesinde mi */
      if (!dsVeri() || !dsYetki() || dsIzleyen()) return null;
      var bul = null;
      kkGorunen().forEach(function (s) {
        if (bul || !dsAdimlar(s).length) return;
        var p = dsSayfaNokta(s, x, y); if (!p) return;
        dsEtkDolu(s).forEach(function (g) { if (!bul && dsYonIcinde(dsYonerge(s, g), p)) bul = { s: s, g: g }; });
      });
      return bul;
    }
    function dsEtkUzanim(s, g) {                                      /* etkinliğin sayfadaki dikey uzanımı */
      var L = dsAdimlar(s), y1 = Infinity, y2 = -Infinity, j;
      function al(a, b) { a = +a; b = +b; if (isFinite(a) && isFinite(b) && b > a) { y1 = Math.min(y1, a); y2 = Math.max(y2, b); } }
      var yn = dsYonerge(s, g); if (yn) al(yn.y1, yn.y2);
      dsEbAlan(s, g).forEach(function (q) { al(q.y1, q.y2); });
      for (j = g.bas; j <= g.son; j++) { var a = L[j]; if (a && dsBantVar(a)) al(a.y1, a.y2); }
      return y2 > y1 ? { y1: y1, y2: y2 } : null;
    }
    /* BANTSIZ ETKİNLİKTE DE YAKLAŞ (05.11.2026) — öğretmen: "sayfa 17 de üstteki etkinliğe basınca yaklaşma olmuyor":
       etkinliğin ilk adımında, etkinliğin hiç bandı yoksa etkinliğin sayfadaki yerine yaklaşılır. */
    function dsBantsizYaklas(s, L, i) {
      try {
        var g = null; dsEtkinlikler(s).forEach(function (x) { if (!g && i >= x.bas && i <= x.son) g = x; });
        if (!g || i !== g.bas) return;
        for (var j = g.bas; j <= g.son; j++) if (L[j] && dsBantVar(L[j])) return;   /* bandı var: eskisi gibi */
        var u = dsEtkUzanim(s, g); if (!u) return;
        dsYakinlas(s, { x1: 0, x2: 100, y1: Math.max(0, u.y1 - 1.5), y2: Math.min(100, u.y2 + 1.5) });
      } catch (e) { }
    }
    function dsDokunGec(x, y) {                                       /* ders açık: başka etkinliğin yerine dokunuş → o etkinliğin başı */
      if (!DS.aktif || dsIzleyen()) return false;
      var hed = null;
      kkGorunen().forEach(function (s) {
        if (hed || !dsAdimlar(s).length) return;
        var p = dsSayfaNokta(s, x, y); if (!p) return;
        var A = [];
        dsEtkDolu(s).forEach(function (g) {
          var cur = DS.s === s && DS.i >= (g.ebi >= 0 ? g.ebi : g.bas) && DS.i <= g.son;
          if (dsYonIcinde(dsYonerge(s, g), p)) { A.push({ g: g, d: -1, h: 0, cur: cur }); return; }
          var u = dsEtkUzanim(s, g); if (!u) return;
          A.push({ g: g, d: p.y < u.y1 ? u.y1 - p.y : (p.y > u.y2 ? p.y - u.y2 : 0), h: u.y2 - u.y1, cur: cur });
        });
        if (!A.length) return;
        A.sort(function (a, b) { return (a.d - b.d) || ((b.cur ? 1 : 0) - (a.cur ? 1 : 0)) || (a.h - b.h); });   /* yönerge > içinde (o anki önce, dar önce) > en yakın */
        hed = { s: s, e: A[0] };
      });
      if (!hed) return false;
      if (hed.e.cur && hed.e.d >= 0) return false;                     /* o anki etkinliğin içi: dokunuş her zamanki gibi */
      dsSorKapat(); dsEbBasla(hed.s, hed.e.g);
      return true;
    }
    function dsEbBasla(s, g) {                                       /* ders bu etkinliğin başından */
      var taban = g.ebi >= 0 ? g.ebi : g.bas;                         /* ETKİNLİK DEĞİŞİNCE (04.11.2026): yalnız bu etkinlik açık */
      if (DS.aktif) {
        dsEtkKapat();                                                 /* eskisi kapanır: ses durur, çalar kapanır */
        if (DS.s === s) { DS.taban = taban; DS.i = -1; dsTemizle(); dsOrtuleriKur(s, dsAdimlar(s)); dsAdimaGit(g.bas, true); }   /* DS.i = -1: zincir sesine kadar ilerlesin (geriye geçişte de) */
        else { DS.tabanSonra = taban; dsSayfaKur(s, g.bas, true); }
        return;
      }
      DS.tabanSonra = taban;
      dsAc(s, g.bas, true);
    }
    /* ETKİNLİK DEĞİŞİNCE (04.11.2026) — öğretmen: "bi etkinlik başlatılmışken diğer bi etkinliğin yönergesine
       tıkladığımda mevcut etkinlik otomotik kapansın, diğerinde ses varsa o başlasın". */
    function dsEtkKapat() {
      clearTimeout(DS_ZT); clearTimeout(DS_SES); DS_DVBEK = null; dsSorKapat();
      try { var a = mdKitapSes(), kb = document.getElementById('calarKapat'); if (a && a.getAttribute('src') && kb) kb.click(); else if (a && !a.paused) a.pause(); } catch (e) { }
      try { if (MD.calar && !MD.calar.hidden) { var x = MD.calar.querySelector('.kapat'); if (x) x.click(); } } catch (e) { }
      try { if (ZS.el && !ZS.el.paused) ZS.el.pause(); } catch (e) { }
      try { [].forEach.call(document.querySelectorAll('audio, video'), function (m) { if (!m.paused) m.pause(); }); } catch (e) { }
    }
    function dsEbCiz() {                                             /* görünen ve yakın sayfalarda ders düğmeleri */
      var kitap = flip && flip.kitap; if (!kitap) return;
      var gor = !!(dsVeri() && dsYetki() && !dsIzleyen());
      [].forEach.call(kitap.querySelectorAll('.yuz[data-sayfa]'), function (yz) {
        var s = +yz.getAttribute('data-sayfa'), o = yz.querySelector(':scope > .ds-ebd');
        var G = gor ? dsEtkDolu(s) : [], imza = G.map(function (g) { var d = dsEbDugme(g), yn = dsYonerge(s, g); return g.bas + ':' + d.x + ':' + d.y + ':' + ((g.eb && g.eb.ad) || '') + ':' + (yn ? [yn.x1, yn.y1, yn.x2, yn.y2].join(',') : ''); }).join('|');
        if (!G.length) { if (o && o.parentNode) o.parentNode.removeChild(o); return; }
        if (!o || o.getAttribute('data-imza') !== imza) {
          if (o && o.parentNode) o.parentNode.removeChild(o);
          o = document.createElement('div'); o.className = 'ds-ebd'; o.setAttribute('data-imza', imza);
          G.forEach(function (g) {                                     /* YÖNERGE VURGUSU: yönerge sarı; dokunuş sahnede (dsYonAltta) */
            var yn = dsYonerge(s, g); if (!yn) return;
            var v = document.createElement('div'); v.className = 'ds-yon'; v.setAttribute('data-bas', String(g.bas)); v.setAttribute('aria-hidden', 'true');
            v.style.left = yn.x1 + '%'; v.style.top = yn.y1 + '%'; v.style.width = (yn.x2 - yn.x1) + '%'; v.style.height = (yn.y2 - yn.y1) + '%';
            v.title = 'Ders modu: ' + ((g.eb && g.eb.ad) ? String(g.eb.ad).slice(0, 60) : g.no + '. etkinlik') + ' — baştan';
            o.appendChild(v);
          });
          G.forEach(function (g) {
            var d = dsEbDugme(g), b = document.createElement('button'), ad = (g.eb && g.eb.ad) ? String(g.eb.ad).slice(0, 40) : '';
            b.type = 'button'; b.className = 'ds-eb'; b.setAttribute('data-bas', String(g.bas));
            b.style.left = d.x + '%'; b.style.top = d.y + '%';
            b.title = 'Ders modu: ' + (ad || g.no + '. etkinlik') + ' — baştan başlat';
            b.setAttribute('aria-label', b.title);
            b.innerHTML = DS_EB_IK + '<b>' + (dsEtkinlikler(s).length > 1 ? g.no : '') + '</b>';   /* DOLDURMA HAZIRLIĞI: ad yalnız ipucunda */
            b.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
            b.addEventListener('click', function (e) {
              e.preventDefault(); e.stopPropagation();
              if (kkYanki(e) || dsIzleyen()) return;
              var G2 = dsEtkinlikler(s), g2 = null; G2.forEach(function (x) { if (x.bas === +b.getAttribute('data-bas')) g2 = x; });
              if (g2) dsEbBasla(s, g2);
            });
            o.appendChild(b);
          });
          yz.appendChild(o);
        }
        var bb = o.querySelectorAll('.ds-eb, .ds-yon');
        [].forEach.call(bb, function (b) {
          var bas = +b.getAttribute('data-bas'), g3 = null; G.forEach(function (x) { if (x.bas === bas) g3 = x; });
          b.classList.toggle('aktif', !!(g3 && DS.aktif && DS.s === s && DS.i >= g3.bas && DS.i <= g3.son));
        });
      });
    }
    var DS_SOR = null;
    function dsSorKapat() { if (DS_SOR && DS_SOR.parentNode) DS_SOR.parentNode.removeChild(DS_SOR); DS_SOR = null; }
    function dsSor(x, y, eg, buradan) {                              /* «Buradan» · «Baştan» */
      dsSorKapat();
      var o = document.createElement('div'), ad = (eg.g.eb && eg.g.eb.ad) ? String(eg.g.eb.ad).slice(0, 40) : eg.g.no + '. etkinlik';
      o.className = 'ds-sor'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', ad);
      o.innerHTML = '<button type="button" data-sec="burada" title="Dokunduğun yer: kısımsa o kısım çalar, değilse yaklaşır">' + DS_SOR_IK.burada + '<span>Buradan</span></button>' +
        '<button type="button" data-sec="bastan" title="Ders modu: ' + kkEsc(ad) + ' baştan">' + DS_SOR_IK.bastan + '<span>Baştan</span></button>';
      document.body.appendChild(o);
      var W = o.offsetWidth || 180, H = o.offsetHeight || 60;
      o.style.left = Math.max(8, Math.min(window.innerWidth - W - 8, x - W / 2)) + 'px';
      o.style.top = (y - H - 14 > 8 ? y - H - 14 : Math.min(window.innerHeight - H - 8, y + 14)) + 'px';
      o.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      o.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-sec]'); if (!b) return;
        e.preventDefault(); e.stopPropagation();
        var sec = b.getAttribute('data-sec'); dsSorKapat();
        if (sec === 'burada') buradan(); else dsEbBasla(eg.s, eg.g);
      });
      DS_SOR = o;
      clearTimeout(DS_SOR_Z); DS_SOR_Z = setTimeout(dsSorKapat, 6000);
    }
    var DS_SOR_Z = 0;
    document.addEventListener('pointerdown', function (e) { if (DS_SOR && !DS_SOR.contains(e.target)) dsSorKapat(); }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && DS_SOR) dsSorKapat(); });
    /* DOKUNMA VURGUSU (02.11.2026) — öğretmen: "ders adımları kısmına, dokunma vurgusu
       ekle seçeneği ekleyelim, amaç birden fazla şıklı bi yerde şıklar için dokunacağı
       yeri vurgulamak, dalga vurgusu olabilir, bu vurgunun özelliği tüm şıklar aynı anda
       yanıp söner, vurgu çeşitleri seçilebilsin". Adım {t:'dv', v, alan:[{x1,y1,x2,y2}]}:
       sırası gelince bütün yerler aynı anda yanıp söner (hepsi aynı anda kurulur → aynı
       saat); başka adıma geçince kalkar. Çeşitler: dalga · nabiz · cerceve · isik · el. */
    var DS_DV = { dalga: 1, nabiz: 1, cerceve: 1, isik: 1, el: 1 };
    function dsDvAlan(a) {
      return (Array.isArray(a && a.alan) ? a.alan : []).filter(function (r) {
        return r && isFinite(+r.x1) && isFinite(+r.x2) && isFinite(+r.y1) && isFinite(+r.y2) && +r.x2 > +r.x1 && +r.y2 > +r.y1;
      });
    }
    function dsDvGoster(y, a, j, ac) {
      var o = y.querySelector('.ds-dv[data-ds="' + j + '"]');
      if (!ac) { if (o && o.parentNode) o.parentNode.removeChild(o); return; }
      if (o) return;
      var A = dsDvAlan(a); if (!A.length) return;
      o = document.createElement('div');
      o.className = 'ds-dv dv-' + (DS_DV[a.v] ? a.v : 'dalga'); o.setAttribute('data-ds', String(j)); o.setAttribute('aria-hidden', 'true');
      var sk = a.sk === 'kutu' ? 'kutu' : 'daire', bo = Math.max(20, Math.min(100, +a.b || 50)) / 100;   /* DV ŞEKİL BOYUT (02.11.2026) */
      var V = kok.KITAP_VERI || {}, oran = +V.oran > 0 ? +V.oran : 1.414;   /* sayfa boyu / eni */
      if (sk === 'daire') o.classList.add('dv-daire');
      A.forEach(function (r) {
        var e = document.createElement('i'), x1 = +r.x1, x2 = +r.x2, y1 = +r.y1, y2 = +r.y2, cx = (x1 + x2) / 2, cy = (y1 + y2) / 2, w, h;
        if (sk === 'daire') { var d = Math.min(x2 - x1, (y2 - y1) * oran) * bo; w = d; h = d / oran; }   /* en birimiyle çap */
        else { w = (x2 - x1) * bo; h = (y2 - y1) * bo; }
        e.style.left = (cx - w / 2) + '%'; e.style.width = w + '%'; e.style.top = (cy - h / 2) + '%'; e.style.height = h + '%';
        dsDvIsaretBagla(e, r, a, j);                                  /* DV İŞARET (02.11.2026) · DV CEVAP GEÇ */
        o.appendChild(e);
      });
      y.appendChild(o);
    }
    /* DV İŞARET (02.11.2026) — öğretmen: "dokunma vurgusu açıldığında birine tıklayınca
       tik çıksın, tik mi çıkacağı çarpı mı çıkacağı da tezgahta seçilsin, hatta daire mi
       çizilecek, sayı mı eklenecek hepsi seçilebilsin". Yerin m'si: tik | carpi | daire |
       sayi (n) | yok; yoksa tik. Dokununca çizilerek çıkar, yine dokununca kalkar. */
    var DV_RAKAM = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠'];
    function dsDvIsaretSvg(m, n) {
      var s = '<svg class="dvm dvm-' + m + '" viewBox="0 0 100 100" aria-hidden="true">';
      if (m === 'tik') s += '<path d="M18 54 L42 76 L84 26" pathLength="100"/>';
      else if (m === 'carpi') s += '<path d="M24 24 L76 76" pathLength="100"/><path d="M76 24 L24 76" pathLength="100" class="dvm2"/>';
      else if (m === 'daire') s += '<ellipse cx="50" cy="50" rx="46" ry="46" pathLength="100"/>';
      else if (m === 'sayi') s += '<text x="50" y="54" text-anchor="middle" dominant-baseline="central">' + DV_RAKAM[Math.max(1, Math.min(10, Math.round(+n || 1))) - 1] + '</text>';
      return s + '</svg>';
    }
    /* DV CEVAP GEÇ (02.11.2026) — öğretmen: "eğer ses kısımlara bölünmüşse ve vurgu da
       eklenmişse cevap verildikten sonra diğerine geçilsin mi diğer bi seçenek ekleyelim".
       ce:'gec' — adıma gelince çalan ses durur; cevaplanınca ses sürer (yoksa ileri). */
    var DS_DVBEK = null;   /* DV CEVAP GEÇ (02.11.2026) */
    function dsDvBekle(a, i) {                                       /* adıma gelindi: çalan sesi durdur */
      if (!a || a.t !== 'dv' || a.ce !== 'gec' || dsIzleyen()) return;
      var m = null;
      [].forEach.call(document.querySelectorAll('audio, video'), function (x) { if (!m && !x.paused && !x.ended) m = x; });
      DS_DVBEK = { s: DS.s, i: i, el: m, cevap: false };
      if (m) { try { m.pause(); } catch (e) { } }
    }
    function dsDvCevaplandi(a, j) {                                  /* ilk cevap: sürsün */
      var B = DS_DVBEK;
      if (!a || a.ce !== 'gec' || !DS.aktif || DS.i !== j || !B || B.i !== j || B.s !== DS.s || B.cevap) return;
      B.cevap = true;
      setTimeout(function () {
        if (DS_DVBEK !== B || !DS.aktif || DS.i !== j) return;
        DS_DVBEK = null;
        if (B.el) ksCal(B.el); else dsIleri();
      }, 900);
    }
    function dsDvIsaretBagla(e, r, a, j) {
      var m = r && r.m != null ? String(r.m) : 'tik';
      if (!/^(tik|carpi|daire|sayi)$/.test(m)) return;              /* yok: dokunulmaz */
      e.classList.add('dv-dok');
      e.addEventListener('pointerdown', function (ev) { ev.stopPropagation(); e._dv = { x: ev.clientX, y: ev.clientY, t: Date.now() }; });
      e.addEventListener('click', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        var b = e._dv; e._dv = null;
        if (b && (Math.hypot(ev.clientX - b.x, ev.clientY - b.y) > 12 || Date.now() - b.t > 900)) return;
        if (kkYanki(ev)) return;
        var v = e.querySelector('.dvm');
        if (v) { e.removeChild(v); e.classList.remove('dv-isaretli'); return; }
        e.insertAdjacentHTML('beforeend', dsDvIsaretSvg(m, r.n));
        e.classList.add('dv-isaretli');
        try { dkSes(m !== 'carpi'); } catch (x) { }
        dsDvCevaplandi(a, j);                                          /* DV CEVAP GEÇ */
      });
    }
    function dsDvKutu(a) {                                          /* yerlerin hepsini kapsayan bölge (pay ile) */
      var A = dsDvAlan(a); if (!A.length) return null;
      var b = { x1: 100, y1: 100, x2: 0, y2: 0 };
      A.forEach(function (r) { b.x1 = Math.min(b.x1, +r.x1); b.y1 = Math.min(b.y1, +r.y1); b.x2 = Math.max(b.x2, +r.x2); b.y2 = Math.max(b.y2, +r.y2); });
      return { x1: Math.max(0, b.x1 - 4), x2: Math.min(100, b.x2 + 4), y1: Math.max(0, b.y1 - 4), y2: Math.min(100, b.y2 + 4) };
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
      return { yakin: 'Yakınlaş', kaynak: 'Kaynağı aç', cevap: 'Cevap', not: 'Not', ortu: 'Cevabı aç', md: 'Ses / video', dk: 'Dokunma', bg: 'Bağlantı', dv: 'Dokunulacak yerler', eb: 'Etkinlik' }[a.t] || 'Adım';
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
        if (ni > 12) { nk.className += ' sayi'; nk.textContent = DS.m + '/' + ni; }   /* CEVAP ELLE: çoksa sayıyla */
        else for (var q = 0; q < ni; q++) { var o = document.createElement('i'); if (q < DS.m) o.className = 'acik'; nk.appendChild(o); }
        ad.appendChild(nk);
      }
      if (a && !bitti && dsCvMod(a) && !izle) {                     /* CEVAP VURGU: açılan / toplam cevap */
        var nc = document.createElement('span'); nc.className = 'ds-im sayi'; nc.title = 'Açılan cevap';
        nc.textContent = dsCvL(DS.s, DS.i).length + '/' + dsCvN(a); ad.appendChild(nc);
      }
      var n = b.querySelector('.ds-not'), notVar = !!(a && a.t === 'not' && a.metin && !izle);
      n.hidden = !notVar; n.textContent = notVar ? a.metin : '';
      var G = dsGorunenAdimli();
      b.querySelector('.ds-geri').disabled = DS.i < 0 && !G.some(function (x) { return x < DS.s; }) && dsKitapBasi();
      b.querySelector('.ds-ileri').disabled = (DS.i >= L.length || (DS.i === L.length - 1 && !dsBuyuk() && !(DS.m < ni) && !dsCvKalan())) && !G.some(function (x) { return x > DS.s; }) && dsKitapSonu();
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
      try { dsCpKaldir(); } catch (e) { }                              /* CEVAP PANELİ: dersten çıkınca kaybolur */
      dsTemizle();
      dsSinif(false);
      if (DS.bar && DS.bar.parentNode) DS.bar.parentNode.removeChild(DS.bar);
      dsDokunSifirla(DS.s); dsSimge();                            /* adımla açılan alanlar kapanır, düğmeler görünür */
      DS.bar = null; DS.i = -1; DS.m = 0;
      dsTusGuncelle();
      if (yolla && !dsIzleyen()) dsHepsiniKapat();                 /* DERS ✕ HEPSİNİ KAPATIR (02.11.2026) */
      if (!dsIzleyen() && (z.o > 1.02 || z.x || z.y)) { z.o = 1; z.x = 0; z.y = 0; sinirla(); zUygula(true); }
      if (yolla && !dsIzleyen()) setTimeout(function () {             /* çubuklar kapanınca ölçü değişir: yine uzak */
        if (!DS.aktif && (z.o > 1.02 || z.x || z.y)) { z.o = 1; z.x = 0; z.y = 0; sinirla(); zUygula(true); }
      }, 400);
      if (yolla) { DS.otoKapali = kkGorunen().join(','); dsGonder(); kkTost('Ders modu kapandı'); }   /* bu görünümde ileri yine sayfa çevirir */
      dsDurumBildir();
      dsEbCiz();
    }
    /* DERS ✕ HEPSİNİ KAPATIR (02.11.2026) — öğretmen: "ders modundan çıkınca hem sesi
       kapatmak için bi tane çarpıya basıyorum hem sunum modundan, ders modundan
       çıkınca hepsinden çıkılsın ve uzaklaşılsın". Açık ses çubukları, video
       penceresi ve yüzen video kapanır; bütün sesler / videolar durur. */
    function dsHepsiniKapat() {
      [].forEach.call(document.querySelectorAll('.calar'), function (c) {
        if (c.hidden) return;
        var x = c.querySelector('.kapat');
        if (x) { try { x.click(); } catch (e) { } }
      });
      var mv = document.getElementById('mdVideo');
      if (mv && !mv.hidden) { var vx = mv.querySelector('.md-v-x'); if (vx) { try { vx.click(); } catch (e) { } } }
      try { mdYvKapat(); } catch (e) { }
      [].forEach.call(document.querySelectorAll('audio, video'), function (m) { try { if (!m.paused) m.pause(); } catch (e) { } });
    }
    function dsSayfaKur(s, i, yolla, m) {
      dsTemizle();
      DS.s = s; DS.i = -1; DS.m = 0;
      DS.taban = DS.tabanSonra != null ? DS.tabanSonra : -1; DS.tabanSonra = null;   /* ETKİNLİK DEĞİŞİNCE: yönergeden açılınca yalnız o etkinlik */
      if (s >= 1 && kkGorunen().indexOf(s) < 0 && !dsIzleyen()) flip.git(s);   /* izleyende sayfa liderin görünümüyle (t:'g') gelir */
      var L = dsAdimlar(s);
      dsOrtuleriKur(s, L);
      if (i >= 0 && L.length) dsAdimaGit(i, yolla, m);
      else { dsKatmanlar(s, L, -1); dsBarYaz(); if (yolla) dsGonder(); dsDurumBildir(); }
    }
    var DS_ZT = 0;                                                   /* ADIM BAŞLAMA (02.11.2026): «öncekinden sonra» zamanlayıcısı */
    function dsZincir(s, i, onceI) {                                 /* ileri: sonraki adım öncekiyle / öncekinden sonra */
      if (dsIzleyen() || !(i > onceI)) return;
      var L = dsAdimlar(s), n = L[i + 1]; if (!n) return;
      if (n.bas === 'ile') { dsAdimaGit(i + 1, true); return; }
      if (n.bas === 'sonra') {
        var gk = Math.max(0, Math.min(60, +n.gk || 0));
        DS_ZT = setTimeout(function () { if (DS.aktif && DS.s === s && DS.i === i) dsAdimaGit(i + 1, true); }, gk * 1000);
      }
    }
    function dsAdimaGit(i, yolla, m) {
      var L = dsAdimlar(DS.s); if (!L.length) { dsBarYaz(); return; }
      var onceI = DS.i; clearTimeout(DS_ZT);                         /* ADIM BAŞLAMA */
      i = Math.max(-1, Math.min(L.length, i | 0));
      if (i >= 0 && i < L.length && L[i].t === 'eb') {                /* ETKİNLİK BAŞI: derste atlanır */
        var yonE = i >= DS.i ? 1 : -1;
        while (i >= 0 && i < L.length && L[i].t === 'eb') i += yonE;
        i = Math.max(-1, Math.min(L.length, i));
      }
      DS.i = i;
      if (DS.taban > -1 && i >= 0 && i < DS.taban) DS.taban = -1;     /* ETKİNLİK DEĞİŞİNCE: önceki etkinliğe dönüldü: her şey eskisi gibi */
      DS.m = (i >= 0 && i < L.length) ? dsIsaretSinir(L[i], m) : 0;   /* İŞARETLER TEK TEK: açık işaret (m yoksa adımın ilk hâli) */
      if (i >= L.length) {                                      /* SAYFA BİTTİ: her şey açık, büyütme yok; sonraki ileri çevirir */
        dsKatmanlar(DS.s, L, L.length - 1);
        if (!dsIzleyen()) dsYakinlas(DS.s, null);
        dsBarYaz(); if (yolla) dsGonder(); dsDurumBildir();
        return;
      }
      if (DS_DVBEK && (DS_DVBEK.s !== DS.s || DS_DVBEK.i !== i)) {   /* DV CEVAP GEÇ: başka adıma geçildi */
        var Bq = DS_DVBEK; DS_DVBEK = null;
        if (Bq.el && Bq.s === DS.s && i > Bq.i && !dsIzleyen()) ksCal(Bq.el);   /* ileri: duran ses sürer */
      }
      dsKatmanlar(DS.s, L, i, DS.m);
      if (i >= 0 && i < L.length && L[i].t === 'dv' && (!DS_DVBEK || DS_DVBEK.i !== i)) dsDvBekle(L[i], i);   /* DV CEVAP GEÇ */
      if (!dsIzleyen()) dsMedyaGeri(DS.s, L, i);                  /* SAYFA ŞERİDİ: geri gelince sonraki sesler durur */
      if (i < 0) {                                              /* sayfanın ilk hâli: büyütme yok, örtüler kapalı */
        if (!dsIzleyen()) dsYakinlas(DS.s, null);
        dsBarYaz(); if (yolla) dsGonder(); dsDurumBildir();
        return;
      }
      var a = L[i];
      if (!dsIzleyen()) dsBantsizYaklas(DS.s, L, i);                   /* BANTSIZ ETKİNLİKTE DE YAKLAŞ (05.11.2026) */
      if (!dsIzleyen()) {
        if (a.t === 'cevap') { var ub = dsCevapBandi(DS.s, a, i); if (ub) dsYakinlas(DS.s, ub); }
        else if (a.t === 'yakin' || dsBantVar(a)) dsYakinlas(DS.s, a);
        else if (a.t === 'dv') { var dk = dsDvKutu(a); if (dk && !dsYerGorunur(DS.s, dk)) dsYakinlas(DS.s, null); }   /* DOKUNMA VURGUSU: yerler görünsün — ÇİZİLEN YER YAKINLAŞTIRMAZ (02.11.2026, öğretmen: «çizilen yerin zoom unda bi hata var, fazla yaklaşıyor»): yerlere yaklaşmak yerine uzaklaşılır; yakınlaşma yalnız bantla */
        if (a.t === 'kaynak' && a.k != null) dsKaynakAc(DS.s, +a.k);
        if (a.t === 'md') dsMedyaAc(DS.s, a);                      /* SAYFA ŞERİDİ */
        if (a.t === 'bg') dsBagParlat(DS.s, a);
      }
      dsBarYaz();
      if (yolla) dsGonder();
      dsDurumBildir();
      dsEbCiz();
      dsZincir(DS.s, i, onceI);                                       /* ADIM BAŞLAMA: öncekiyle / öncekinden sonra */
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
    function dsIsaretSay(a) { return dsCvSay(a) + dsIsaretler(a).length; }   /* CEVAP ELLE: madde madde cevaplar da alt adım */
    function dsIsaretIlk(a) { if (dsCvSay(a)) return 0; return dsIsaretSay(a) && !(a.ar || a.tr) ? 1 : 0; }   /* adıma gelince: yazı varsa önce yazı */
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
      if (!yer) { var cvq = dsCevapVeri(a); if (cvq) yer = dsCvSinir(cvq); }   /* CEVAP YAZI: cevabın sayfadaki yeri */
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
        var Lq = dsAdimlar(s), a = null;                                /* CEVAP SESİ: «öncekiyle» gelen adım sesi kesmesin */
        for (var q0 = DS.i; q0 >= 0 && Lq[q0] && Lq[q0].t !== 'eb'; q0--) if (Lq[q0].t === 'kaynak' && +Lq[q0].k === +k) { a = Lq[q0]; break; }
        if (!DS.aktif || DS.s !== s || !a) return;
        var y2 = kkYuz(s), b2 = (y2 && y2.querySelector('.nokta[data-k="' + k + '"]')) || b;
        if (b2.classList.contains('calan')) return;                    /* kitabın sesi zaten çalıyor: düğme aç / kapa, basılmaz */
        if (a.kis || a.kc || dsKcIsaretli(k)) {                        /* KISIM İLERİ: «kis» — yalnız ilk kısım, sonra ileriyle · KISIM BEKLE: işaretli kısım varsa da */
          var Kk = (kok.KITAP_VERI || {}).kaynak || [], yk = Kk[+k] && Kk[+k].yol;
          if (yk && ksKisimlar(yk).length) { dsKcKur(s, a, yk); dsKisimCal({ src: yk, i: 0, s: s }); return; }   /* KISIM CEVAP */
        }
        try { b2.click(); } catch (e) { }
      }, 380);
    }
    /* KISIM İLERİ (06.11.2026) — öğretmen: "dokununca ses çıkan yerlerde ileri tuşunda da aynı özellik olsun". Bir kısım
       tek başına çalınınca (yerine dokunarak, ya da «kis» adımında) ileri sıradakini, geri öncekini çalar; son kısımdan
       sonra ileri her zamanki gibi. Başka etkinliğe / sayfaya geçince biter. */
    var DS_KSI = null;
    /* KISIM CEVAP (11.11.2026) — öğretmen: "kısımlar kısmında her sesten sonra dokunsal bi etkileşim varsa cevap verme
       yapıldıktan sonra diğer kısma geçme özelliği ekleyelim". «kc»li kaynak adımı: kısım biter → o kısmın cevapları
       açılana dek bekle → sıradaki kısım. Cevabı olmayan kısımdan sonra hemen sıradaki. */
    var DS_KC = null;
    function dsKcKur(s, a, yol) {
      DS_KC = null; var isr = ksKisimlar(yol).some(function (p) { return !!p.cb; });   /* KISIM BEKLE: işaretli kısımlar */
      if (!a || (!a.kc && !isr)) return;
      var L = dsAdimlar(s), k0 = L.indexOf(a), j = -1;
      for (var k = k0 + 1; k < L.length && L[k] && L[k].t !== 'eb'; k++) if (L[k].t === 'cevap' && dsCvMod(L[k])) { j = k; break; }
      DS_KC = { s: s, ds: DS.s, e: dsKsEb(), src: yol, j: j, bek: -1, t: 0, isr: isr, es: true, say: 0 };
    }
    function dsKcGecerli() { return !!(DS_KC && DS.aktif && !dsIzleyen() && DS_KC.ds === DS.s && DS_KC.e === dsKsEb()); }
    function dsKcBirimler(i) {                                         /* bu kısmın kutusuna düşen cevaplar */
      var R = [], a = DS_KC.j >= 0 ? dsAdimlar(DS_KC.s)[DS_KC.j] : null, n = a ? dsCvN(a) : 0;
      for (var b = 0; b < n; b++) { var o = dsCvKisim(DS_KC.s, DS_KC.j, b); if (o && o.i === i && ksAnah(o.src) === ksAnah(DS_KC.src)) R.push(b); }
      return R;
    }
    function dsKcTamam(i) { var L = dsCvL(DS_KC.s, DS_KC.j); return dsKcBirimler(i).every(function (b) { return L.indexOf(b) >= 0; }); }
    function dsKcSonraki(i, ms) {
      clearTimeout(DS_KC.t);
      DS_KC.t = setTimeout(function () {
        if (!dsKcGecerli()) { DS_KC = null; return; }
        var P = ksKisimlar(DS_KC.src); if (i + 1 >= P.length) { DS_KC.bek = -1; return; }
        DS_KC.bek = -1;
        var sy = +P[i + 1].sayfa >= 1 && kkGorunen().indexOf(+P[i + 1].sayfa) >= 0 ? +P[i + 1].sayfa : DS_KC.s;
        dsKisimCal({ src: DS_KC.src, i: i + 1, s: sy });
      }, ms);
    }
    function dsKcIsaretli(k) { var Kn = (kok.KITAP_VERI || {}).kaynak || [], yol = Kn[+k] && Kn[+k].yol; return !!yol && ksKisimlar(yol).some(function (p) { return !!p.cb; }); }
    function dsKcIleri() {
      if (!dsKcGecerli() || !(DS_KC.bek >= 0)) return false;
      var L = dsAdimlar(DS.s), a = DS_KC.j >= 0 ? L[DS_KC.j] : null;
      if (a && DS.i < DS_KC.j) return false;
      if (a && DS.i === DS_KC.j && dsCvL(DS_KC.s, DS_KC.j).length < dsCvN(a)) return false;   /* önce sıradaki cevap */
      dsKcSonraki(DS_KC.bek, 0); return true;
    }
    function dsKcBitti(src, i) {                                       /* bir kısım sonuna dek çaldı */
      if (!DS_KC || i == null || ksAnah(src) !== ksAnah(DS_KC.src)) return;
      if (!dsKcGecerli()) { DS_KC = null; return; }
      if (DS_KC.isr) {                                                  /* KISIM BEKLE (11.11.2026): yalnız işaretli kısım bekler */
        var Pk = ksKisimlar(DS_KC.src)[i];
        if (!Pk || !Pk.cb) { dsKcSonraki(i, 450); return; }
        var Bi = DS_KC.j >= 0 && DS.i >= DS_KC.j ? dsKcBirimler(i) : [];
        if (Bi.length && dsKcTamam(i)) { dsKcSonraki(i, 450); return; }
        DS_KC.bek = i; DS_KC.es = Bi.length > 0; DS_KC.say = DS_KC.j >= 0 ? dsCvL(DS_KC.s, DS_KC.j).length : 0;   /* yerinde cevap yoksa: bir cevap açılınca / ileri */
        return;
      }
      if (DS_KC.j < 0 || DS.i < DS_KC.j || dsKcTamam(i)) { dsKcSonraki(i, 450); return; }   /* cevabı yok / açık: sıradaki */
      DS_KC.bek = i;                                                    /* cevap bekleniyor */
    }
    function dsKcErken(s, j, b) {                                      /* SIRASI GELMEYEN: kısma bağlı (cv.ks) cevabın kısmı henüz çalmadı mı */
      if (!dsKcGecerli() || DS_KC.s !== s || DS_KC.j !== j) return false;
      var Q = dsCevapVeri(dsAdimlar(s)[j]), u = Q && dsCvBirimler(Q)[b]; if (!u) return false;
      var m = /^(\d+):(p?)(\d+)$/.exec(u.k), q = Q[+m[1]]; if (!q || !Array.isArray(q.ks)) return false;
      var bj = m[2] ? (q.p[+m[3]] || [])[0] : +m[3]; if (q.ks[bj] == null) return false;
      var o = dsCvKisim(s, j, b); if (!o || ksAnah(o.src) !== ksAnah(DS_KC.src)) return false;
      var cur = DS_KC.bek >= 0 ? DS_KC.bek : (DS_KSI && ksAnah(DS_KSI.src) === ksAnah(DS_KC.src) ? DS_KSI.i : -1);
      return o.i !== cur;                                              /* KISIM TEK DOĞRU: yalnız çalan / beklenen kısmın kutusu doğru */
    }
    function dsKcCevap(s, j, b) {                                      /* cevap açıldı: bu modda kendi sesi çalmaz */
      if (!dsKcGecerli() || DS_KC.s !== s || DS_KC.j !== j) return false;
      var o = dsCvKisim(s, j, b);
      if (DS_KC.bek >= 0 && (DS_KC.isr && !DS_KC.es ? dsCvL(s, j).length > DS_KC.say : dsKcTamam(DS_KC.bek))) dsKcSonraki(DS_KC.bek, 900);   /* KISIM BEKLE */
      return !!o;
    }
    function dsKsEb() { var L = dsAdimlar(DS.s); for (var k = Math.min(DS.i, L.length - 1); k >= 0; k--) if (L[k] && L[k].t === 'eb') return k; return -1; }
    function dsKsIleri(yon) {
      var q = DS_KSI; if (!q || !DS.aktif || dsIzleyen()) return false;
      var Lc = dsAdimlar(DS.s); if (DS.i >= 0 && dsCvMod(Lc[DS.i])) return false;   /* CEVAP SESİ: cevap adımında cevaplar sürer */
      if (q.ds !== DS.s || q.e !== dsKsEb() || kkGorunen().indexOf(q.s) < 0) { DS_KSI = null; return false; }
      var L = ksKisimlar(q.src), j = q.i + yon;
      if (j < 0 || j >= L.length) { DS_KSI = null; return false; }
      var sy = +L[j].sayfa >= 1 && kkGorunen().indexOf(+L[j].sayfa) >= 0 ? +L[j].sayfa : q.s;
      dsKisimCal({ src: q.src, i: j, s: sy });
      return true;
    }
    function dsIleri() {
      if (!DS.aktif) return;
      if (dsZsAdim(1)) return;                                    /* YALNIZ İLERİ: dinleme etkinliğinde sıradaki konum */
      if (dsKcIleri()) return;                                    /* KISIM BEKLE: bekleyen kısımdan sonra açılacak cevap yoksa sıradaki kısım */
      if (dsKsIleri(1)) return;                                   /* KISIM İLERİ: tek çalınan kısmın sıradakisi */
      var L = dsAdimlar(DS.s);
      if (L.length && DS.i >= 0 && DS.i < L.length && dsCvIleri(L[DS.i], 1)) return;   /* CEVAP VURGU: önce kapalı cevaplar */
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
      if (dsKsIleri(-1)) return;                                  /* KISIM İLERİ: önceki kısım */
      var L = dsAdimlar(DS.s);
      if (L.length && DS.i >= 0 && DS.i < L.length && dsCvIleri(L[DS.i], -1)) return;   /* CEVAP VURGU: açılan cevaplar kapanır */
      if (L.length && DS.i >= 0 && DS.i < L.length && DS.m > dsIsaretIlk(L[DS.i])) { DS.cvDur = DS.s + ':' + DS.i; dsIsaretAdim(DS.m - 1, true); return; }   /* CEVAP ELLE: geri → kendiliğinden açılış durur */   /* İŞARETLER TEK TEK: son açılanı kapat */
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
      if (dsDokunGec(e.clientX, e.clientY)) return true;           /* YÖNERGE VURGUSU: alttaki / üstteki etkinliğin yeri → o etkinliğin başı */
      var nk = dsSimgeAltta(e.clientX, e.clientY);
      if (nk) { try { nk.click(); } catch (x) { } return true; }   /* gizli simgenin yeri: o çalar, adım ilerlemez */
      var kp = dsKisimAltta(e.clientX, e.clientY);
      if (kp) { dsKisimCal(kp); return true; }                     /* YALNIZ O KISIM (02.11.2026): kısmın yeri: o kısım çalar, durur */
      dsIleri();
      return true;
    }
    /* SİMGENİN YERİNE DOKUNMA (02.11.2026) — öğretmen: "ders modunda sayfadaki bi
       yere dokununca da etkileşimi başlatabilelim" (gizli ses / etkinlik / video
       simgesinin yerine dokununca o çalsın). Ders açıkken simgeler gizli
       (html.ds-ders) ama yerleri duruyor: görünen sayfalardaki .nokta'nın alanına
       (6 px payla) düşen dokunuşta o düğme basılır. */
    /* YALNIZ O KISIM (02.11.2026) — öğretmen: "bi ses dosyasında kısım olan bi yerse
       tüm ses okunmasın sadece o ses okunsun ve dursun". Görünen sayfada yeri
       çizilmiş bir kısmın alanına dokunulursa o sesin yalnız o kısmı çalar. */
    function dsKisimAltta(x, y) {
      var V = ksVeri(); if (!V) return null;
      var G = kkGorunen(), bul = null;
      Object.keys(V).some(function (src) {
        var L = ksKisimlar(src);
        return L.some(function (p, i) {
          if (!ksVurguVar(p) || G.indexOf(p.sayfa) < 0) return false;
          var yz = kkYuz(p.sayfa); if (!yz) return false;
          var r = yz.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0)) return false;
          var px = (x - r.left) / r.width * 100, py = (y - r.top) / r.height * 100;
          if (px >= p.x1 && px <= p.x2 && py >= p.y1 && py <= p.y2) { bul = { src: src, i: i, s: p.sayfa }; return true; }
          return false;
        });
      });
      return bul;
    }
    function dsKisimK(a) {                                              /* o dosyayı çalan açık ses çubuğu */
      var bul = null;
      KS.L.forEach(function (K) { if (!bul && K.ses && K.el && ksAnah(K.el.getAttribute('src') || '') === a && ksAcik(K)) bul = K; });
      return bul;
    }
    var KS_SONEL = 0;                                                  /* SARI KUTUYU TAKİP (03.11.2026): son elle dokunuş */
    document.addEventListener('pointerdown', function () { KS_SONEL = Date.now(); }, true);
    document.addEventListener('wheel', function () { KS_SONEL = Date.now(); }, { capture: true, passive: true });
    function dsKutuyaKay(p) {                                          /* yakınken görünüm yanan kutuya kayar, ölçü aynı */
      try {
        if (!(z.o > 1.02) || !ksVurguVar(p) || dsIzleyen() || Date.now() - KS_SONEL < 1500) return;
        var s = p.sayfa; if (kkGorunen().indexOf(s) < 0) return;
        var g = dsSayfaKutu(s); if (!(g.en > 0 && g.boy > 0 && g.w > 0 && g.h > 0)) return;
        var o = z.o, x1 = dsYuzde(p.x1, 0), x2 = dsYuzde(p.x2, 100), y1 = dsYuzde(p.y1, 0), y2 = dsYuzde(p.y2, 100);
        var bx = g.x + g.en * x1 / 100, bw = g.en * (x2 - x1) / 100, by = g.y + g.boy * y1 / 100, bh = g.boy * (y2 - y1) / 100;
        var hw = g.w / (2 * o), ox = g.w / 2 - z.x / o;                  /* görünen yarı genişlik, ekran ortasının yeri (1x) */
        if (bx < ox - hw + 2 || bx + bw > ox + hw - 2) ox = bw <= 2 * hw * 0.96 ? bx + bw / 2 : bx + bw - hw + g.en * 0.01;
        z.x = -(ox - g.w / 2) * o; z.y = -(by + bh / 2 - g.h / 2) * o;
        sinirla(); zUygula(true);
      } catch (e) { }
    }
    /* KUTU BÜYÜR (04.11.2026) — öğretmen: "sarı vurgulu yerleri ben yapmıştım sayfa 15 te … basınca büyümüyor":
       dokunulan kutu ekrana sığacak kadar büyür (en az sayfa genişliği, en çok ×4.5), ekranın ortasında. */
    function dsKutuyaYaklas(s, p) {
      var g = dsSayfaKutu(s); if (!(g.en > 0 && g.boy > 0 && g.w > 0 && g.h > 0)) return;
      var x1 = dsYuzde(p.x1, 0), x2 = dsYuzde(p.x2, 100), y1 = dsYuzde(p.y1, 0), y2 = dsYuzde(p.y2, 100);
      var bw = g.en * (x2 - x1 + 5) / 100, bh = g.boy * (y2 - y1 + 4) / 100;   /* kutu + çevresinden pay */
      var bx = g.x + g.en * (x1 + x2) / 200, by = g.y + g.boy * (y1 + y2) / 200;
      var og = g.w / g.en * 0.985, o = Math.min(g.w * 0.92 / Math.max(1, bw), g.h * 0.78 / Math.max(1, bh));
      o = Math.max(ENAZ, Math.min(ENCOK, 4.5, Math.max(og, o)));
      var cx = bx - g.w / 2, cy = by - g.h / 2 + g.h * 0.04 / o;       /* alttaki ses çubuğu: biraz yukarıda */
      z.o = o; z.x = -cx * o; z.y = -cy * o;
      sinirla(); zUygula(true);
    }
    /* ODAK KAYAR (11.11.2026) — öğretmen: "etkinlik aşağı gittikçe ekran ortalamalı yaklaşma açık ama sayfa odağı kaymıyor".
       Yakınlaşmışken p (sayfa %'si kutu) ekranda rahat görünmüyorsa yakınlık değişmeden görünüm ona ortalanır. */
    function dsOdakKaydir(s, p, bant) {
      try {
        if (!p || !(z.o > 1.02)) return;
        var g = dsSayfaKutu(s); if (!(g.en > 0 && g.boy > 0 && g.w > 0 && g.h > 0)) return;
        var o = z.o, y1 = g.y + g.boy * dsYuzde(p.y1, 0) / 100, y2 = g.y + g.boy * dsYuzde(p.y2, 100) / 100;
        if (bant && dsBantVar(bant)) {                                  /* ODAK ORTALAR (11.11.2026): tezgâhla aynı — uzun bantta hep ortada, bandın içinde */
          var b1 = g.y + g.boy * dsYuzde(bant.y1, 0) / 100, b2 = g.y + g.boy * dsYuzde(bant.y2, 100) / 100, hh = g.h / (2 * o), pay = g.h * 0.03 / o;
          if ((b2 - b1) * o <= g.h * 0.92) return;                      /* bant ekrana sığıyor: görünüm oynamaz */
          var vc = Math.max(b1 - pay + hh, Math.min(b2 + pay - hh, (y1 + y2) / 2 + g.h * 0.04 / o));
          z.y = -(vc - g.h / 2) * o; sinirla(); zUygula(true); return;
        }
        var e1 = (y1 - g.h / 2) * o + z.y + g.h / 2, e2 = (y2 - g.h / 2) * o + z.y + g.h / 2;   /* ekrandaki üst / alt */
        if (e1 >= g.h * 0.10 && e2 <= g.h * 0.80) return;
        var cy = (y1 + y2) / 2 - g.h / 2 + g.h * 0.04 / o;
        z.y = -cy * o; sinirla(); zUygula(true);
      } catch (e) { }
    }
    function dsOdakBirim(s, j, b) {                                    /* açılan cevabın kutusu */
      try {
        var a = dsAdimlar(s)[j], Q = dsCevapVeri(a); if (!Q) return;
        var N = dsCvNoktalar(Q).filter(function (n) { return n.b === b; })[0], r = N && N.x && N.x[0]; if (!r) return;
        var y1 = r[1], y2 = r[1] + r[3]; N.x.forEach(function (q) { if (q) { y1 = Math.min(y1, q[1]); y2 = Math.max(y2, q[1] + q[3]); } });
        var L = dsAdimlar(s), bant = null, cy = (y1 + y2) / 2;
        for (var k = Math.min(j, L.length - 1); k >= 0 && !bant; k--) { var x = L[k]; if (!x) continue; if (x.t === 'yakin' && dsBantVar(x) && +x.y1 <= cy && +x.y2 >= cy) bant = x; if (x.t === 'eb') break; }
        dsOdakKaydir(s, { y1: y1, y2: y2 }, bant);                       /* ODAK ORTALAR */
      } catch (e) { }
    }
    function dsKisimYere(o) {                                          /* SARI KUTUYA DOKUNUNCA YAKLAŞ (03.11.2026) */
      try {
        var p = ksKisimlar(o.src)[o.i]; if (!ksVurguVar(p)) return;
        if (!DS.aktif && !kzDokunBuyut()) return;                      /* DOKUNUNCA BÜYÜT kapalı: kısım çalar, yakınlaşmaz */
        if (DS.aktif) {                                                /* ÖLÇÜLÜ YAKLAŞMA (06.11.2026): küçük kutuya dev yakınlaşma yok */
          var Ly = dsAdimlar(o.s);
          for (var ky = Math.min(DS.i, Ly.length - 1); ky >= 0 && DS.s === o.s; ky--) {
            var ay = Ly[ky]; if (!ay) continue;
            if (ay.t === 'yakin' && dsBantVar(ay) && +ay.y1 <= p.y1 + 0.5 && +ay.y2 >= p.y2 - 0.5) { dsYakinlas(o.s, ay); dsOdakKaydir(o.s, p, ay); return; }   /* ODAK KAYAR · ODAK ORTALAR */
            if (ay.t === 'eb') break;
          }
          var w = Math.max(p.x2 - p.x1, 55), h = Math.max(p.y2 - p.y1, 22), cx = (p.x1 + p.x2) / 2, cy = (p.y1 + p.y2) / 2;
          var x1 = Math.max(0, Math.min(100 - w, cx - w / 2)), y1 = Math.max(0, Math.min(100 - h, cy - h / 2));
          return;                                                      /* DERSTE DOKUNMA: kısma dokununca kutusuna yakınlaşma yok, bant kalır */
        }
        DS_KY = ''; dsKutuyaYaklas(o.s, p);                          /* KUTU BÜYÜR (04.11.2026): kutu ekrana sığacak kadar */
      } catch (e) { }
    }
    function dsKisimCal(o) {
      if (DS.aktif) DS_KSI = { src: o.src, i: o.i, s: o.s, ds: DS.s, e: dsKsEb() };   /* KISIM İLERİ: ileri / geri buradan sürer */
      var a = ksAnah(o.src), K = dsKisimK(a);
      if (K) { ksKismaTek(K, o.i); dsKisimYere(o); return; }
      var V = kok.KITAP_VERI || {}, Kn = V.kaynak || [], k = -1, i;
      for (i = 0; i < Kn.length; i++) if (Kn[i] && Kn[i].yol && ksAnah(Kn[i].yol) === a) { k = i; break; }
      var yz = kkYuz(o.s), b = k >= 0 ? ((yz && yz.querySelector('.nokta[data-k="' + k + '"]')) || document.querySelector('.nokta[data-k="' + k + '"]')) : null;
      if (!b) { kkTost('Bu kısmın sesi sayfada bulunamadı'); return; }
      try { b.click(); } catch (e) { return; }
      var n = 0, bekle = function () {                                  /* çalar açılsın, o kısma geç */
        var K2 = dsKisimK(a);
        if (K2) { ksKismaTek(K2, o.i); dsKisimYere(o); return; }
        if (++n < 40) setTimeout(bekle, 100);
      };
      setTimeout(bekle, 60);
    }
    function dsSimgeAltta(x, y) {
      var bul = null;
      kkGorunen().forEach(function (s) {
        var yz = kkYuz(s); if (bul || !yz) return;
        [].some.call(yz.querySelectorAll('.nokta'), function (b) {
          var r = b.getBoundingClientRect();
          if (!(r.width > 0 && r.height > 0)) return false;
          if (x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6) { bul = b; return true; }
          return false;
        });
      });
      return bul;
    }
    /* klavye: ok tuşları, sunum kumandası (PageUp/PageDown), boşluk, Esc */
    document.addEventListener('keydown', function (e) {
      if (!DS.aktif) return;
      var h = e.target || {};
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(h.tagName || '') || h.isContentEditable) return;
      if (panelAcik() || tanitimAcik) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var k = e.key;
      if (k === 'ArrowUp' || k === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); return; }   /* DERSTE DOKUNMA / OK: ↑ ↓ derste bir şey yapmaz */
      var ileri = k === (rtl ? 'ArrowLeft' : 'ArrowRight') || k === 'PageDown' || k === ' ' || k === 'Enter';   /* sağdan sola: ← ileri */
      var geri = k === (rtl ? 'ArrowRight' : 'ArrowLeft') || k === 'PageUp' || k === 'Backspace';
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
        if (DS.aktif && !dsIzleyen() && DS.s && kkGorunen().indexOf(DS.s) < 0) { DS.yon = null; dsKapat(true); }   /* DOKUN DERS AÇ: sayfa değişince ders kapanır */
        else if (DS.aktif && !dsIzleyen() && (!DS.s || kkGorunen().indexOf(DS.s) < 0)) {
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
      return false;                                              /* ETKİNLİK BAŞI (02.11.2026): ders yalnız düğmeyle açılır */
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
    /* OK İPUCU (06.11.2026) — öğretmen: "ders modunda ileri geri için gerekirse ileri geri tuşlarına vurgu ekleyelim ki nasıl
       başlayacağını anlasın öğretmen". Ders açılınca ileri / geri oku birkaç sn atar; sonra boşta (dokunuş yok, ses /
       video çalmıyor) adım başında 4 sn, sonra 9 sn bekleyince ileri oku atar; ilk dokunuşta söner. */
    var DS_OKI = { t: 0, ilk: 0, ac: false, k: '' };
    function dsOkTus(ileri) { return [].filter.call(document.querySelectorAll('.ok.sol, .ok.sag'), function (o) { var a = o.getAttribute('aria-label') || ''; return ileri ? /sonraki/i.test(a) : /önceki|onceki/i.test(a); }); }
    function dsOkSondur() { [].forEach.call(document.querySelectorAll('.ok.ds-ok-ipucu, .ok.ds-ok-hafif'), function (o) { o.classList.remove('ds-ok-ipucu', 'ds-ok-hafif'); }); }
    function dsOkCaliyor() { return [].some.call(document.querySelectorAll('audio, video'), function (m) { return !m.paused && !m.ended; }); }
    function dsOkIpucu(dokundu) {
      clearTimeout(DS_OKI.t); dsOkSondur();
      if (!DS.aktif || dsIzleyen()) { DS_OKI.ac = false; return; }
      if (!DS_OKI.ac) {                                                  /* ders yeni açıldı: ikisi birden, kısa */
        DS_OKI.ac = true; DS_OKI.ilk = Date.now();
        dsOkTus(true).forEach(function (o) { if (!o.disabled) o.classList.add('ds-ok-ipucu'); });
        dsOkTus(false).forEach(function (o) { if (!o.disabled) o.classList.add('ds-ok-hafif'); });
        DS_OKI.t = setTimeout(function () { dsOkSondur(); dsOkIpucu(false); }, 4200);
        return;
      }
      var L = dsAdimlar(DS.s), k = DS.s + ':' + DS.i, bas = k !== DS_OKI.k; DS_OKI.k = k;
      var bek = (DS.i < 0 || (bas && !dokundu)) ? 4000 : 9000;
      DS_OKI.t = setTimeout(function bak() {
        if (!DS.aktif || dsIzleyen()) return;
        if (dsOkCaliyor()) { DS_OKI.t = setTimeout(bak, 1500); return; }   /* ses / video bitince */
        dsOkTus(true).forEach(function (o) { if (!o.disabled && o.getClientRects().length) o.classList.add('ds-ok-ipucu'); });
      }, bek);
    }
    ['pointerdown', 'keydown', 'wheel'].forEach(function (t) { document.addEventListener(t, function () { if (DS.aktif && DS_OKI.ac && Date.now() - DS_OKI.ilk > 600) dsOkIpucu(true); }, { capture: true, passive: true }); });
    /* CEVAP PANELİ (11.11.2026) — öğretmen: "cevap gerektiren etkinliklerde sadece tezgahta değil kitapta da şu seçenekler
       kenarda gizlenebilen bi popup şeklinde okla belirsin başka bi etkinliğe geçildiğinde veya ders modunda kaybolsun".
       Derste o anki etkinliğin cevap adımı: açılış · vurgu · renk · yazı hızı — yalnız bu derslik (bellekte). */
    var DS_CP = { el: null, k: '', acik: false };
    var DS_CP_AC = [['dok', 'dokununca'], ['tek', 'madde madde'], ['oto', 'kendiliğinden'], ['hepsi', 'hepsi birden']];
    var DS_CP_AV = [['dalga', 'dalga'], ['nabiz', 'nabız'], ['isik', 'ışık'], ['cerceve', 'çerçeve']];
    var DS_CP_RK = [['', 'kitabın'], ['#ee1b22', 'kırmızı'], ['#1747a6', 'mavi'], ['#1e8e3e', 'yeşil'], ['#1f2937', 'siyah'], ['#7c3aed', 'mor']];
    var DS_CP_HZ = [[0.5, 'çok yavaş'], [0.75, 'yavaş'], [1, 'orta'], [1.5, 'hızlı'], [2, 'çok hızlı']];
    function dsCpAdim() {                                              /* o anki etkinliğin cevap adımı (veri olan) */
      if (!DS.aktif || dsIzleyen() || DS.i < 0) return -1;
      var L = dsAdimlar(DS.s), e = dsKsEb(), son = L.length, j, bul = -1;
      for (j = Math.max(0, e + 1); j < L.length; j++) if (L[j] && L[j].t === 'eb') { son = j; break; }
      for (j = Math.max(0, e); j < son; j++) if (L[j] && L[j].t === 'cevap' && dsCevapVeri(L[j])) { if (bul < 0 || j <= DS.i) bul = j; }
      return bul;
    }
    function dsCpKaldir() { if (DS_CP.el && DS_CP.el.parentNode) DS_CP.el.parentNode.removeChild(DS_CP.el); DS_CP.el = null; DS_CP.k = ''; DS_CP.acik = false; }
    function dsCpTus(ad, v, et, sec, ek) { return '<button type="button" class="' + (sec ? 'sec' : '') + '" data-cp="' + ad + '" data-v="' + v + '">' + (ek || '') + kkEsc(et) + '</button>'; }
    function dsCpCiz(j) {
      var L = dsAdimlar(DS.s), a = L[j]; if (!a) return;
      var Q = dsCevapVeri(a) || [], ac = /^(tek|oto|hepsi)$/.test(a.ac || '') ? a.ac : 'dok', av = /^(nabiz|isik|cerceve)$/.test(a.av || '') ? a.av : 'dalga';
      var rk = /^#[0-9a-f]{6}$/i.test(a.rk || '') ? String(a.rk).toLowerCase() : '', iz = Q.filter(function (q) { return q && q.t === 'iz'; })[0], hz = iz && +iz.hz > 0 ? +iz.hz : 1;
      var eb = L[dsKsEb()], ad = eb && eb.ad ? String(eb.ad).replace(/^(\d+)\..*$/, '$1. etkinlik') : 'Cevap';
      var h = '<button type="button" class="ds-cp-ok" data-cp="ok" aria-label="Cevap ayarları">' + (DS_CP.acik ? '›' : '‹') + '<span>Cevap</span></button>' +
        '<div class="ds-cp-ic"><b class="ds-cp-bas">Cevap ayarları <small>' + kkEsc(ad) + ' · yalnız bu ders</small></b>' +
        '<div class="ds-cp-sat"><i>Açılış</i>' + DS_CP_AC.map(function (b) { return dsCpTus('ac', b[0], b[1], ac === b[0]); }).join('') + '</div>' +
        (ac !== 'hepsi' ? '<div class="ds-cp-sat"><i>Vurgu</i>' + DS_CP_AV.map(function (b) { return dsCpTus('av', b[0], b[1], av === b[0]); }).join('') + '</div>' : '') +
        '<div class="ds-cp-sat"><i>Renk</i>' + DS_CP_RK.map(function (b) { return dsCpTus('rk', b[0], b[1], rk === b[0], b[0] ? '<em style="background:' + b[0] + '"></em>' : ''); }).join('') + '</div>' +
        (iz ? '<div class="ds-cp-sat"><i>Yazı hızı</i>' + DS_CP_HZ.map(function (b) { return dsCpTus('hz', b[0], b[1], Math.abs(hz - b[0]) < 0.001); }).join('') + '</div>' : '') +
        '</div>';
      DS_CP.el.innerHTML = h; DS_CP.el.classList.toggle('acik', DS_CP.acik);
    }
    function dsCpYenile(j, sifirla) {                                  /* cevap katmanları yeniden */
      var y = kkYuz(DS.s); if (!y) return;
      [].forEach.call(y.querySelectorAll('.ds-cevap[data-ds="' + j + '"], .ds-cvd[data-cvd="' + j + '"]'), function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
      if (sifirla) DS_CVA[DS.s + ':' + j] = [];
      dsKatmanlar(DS.s, dsAdimlar(DS.s), DS.i, DS.m); dsBarYaz(); dsDurumBildir();
    }
    function dsCpSec(t, v) {
      var j = dsCpAdim(); if (j < 0) return;
      var a = dsAdimlar(DS.s)[j]; if (!a) return;
      if (t === 'ac') { if (v === 'dok') delete a.ac; else a.ac = v; DS.cvDur = null; dsCpYenile(j, true); }
      else if (t === 'av') { if (v === 'dalga') delete a.av; else a.av = v; dsCpYenile(j, false); }
      else if (t === 'rk') { if (v) a.rk = v; else delete a.rk; dsCpYenile(j, false); }
      else if (t === 'hz') { (dsCevapVeri(a) || []).forEach(function (q) { if (q && q.t === 'iz') q.hz = +v; }); dsCpYenile(j, false); }
      dsCpCiz(j);
    }
    function dsCpGuncelle() {
      var j = dsCpAdim();
      if (j < 0) { dsCpKaldir(); return; }
      var k = DS.s + ':' + dsKsEb() + ':' + j;
      if (!DS_CP.el || k !== DS_CP.k) {                                 /* yeni etkinlik: kenarda kapalı */
        dsCpKaldir();
        var d = document.createElement('div'); d.className = 'ds-cp'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Cevap ayarları');
        ['pointerdown', 'touchstart', 'mousedown', 'wheel'].forEach(function (t) { d.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true }); });
        d.addEventListener('click', function (e) {
          e.stopPropagation(); var b = e.target.closest && e.target.closest('[data-cp]'); if (!b) return;
          var t = b.getAttribute('data-cp');
          if (t === 'ok') { DS_CP.acik = !DS_CP.acik; dsCpCiz(dsCpAdim()); return; }
          dsCpSec(t, b.getAttribute('data-v'));
        });
        document.body.appendChild(d); DS_CP.el = d; DS_CP.k = k; DS_CP.acik = false;
      }
      dsCpCiz(j);
    }
    function dsDurumBildir() {
      try { dsOkIpucu(false); } catch (e) { }                          /* OK İPUCU */
      try { dsCpGuncelle(); } catch (e) { }                            /* CEVAP PANELİ */
      try { dsCvOto(); } catch (e) { }                                 /* CEVAP ELLE */
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
      } else if (m.kd === 'dersYer') {                                 /* ÖNİZLEME DE YERİNDE (11.11.2026): tezgâhın şeritteki anı */
        if (DS.aktif && DS.s === +m.sayfa && isFinite(+m.y1) && isFinite(+m.y2) && +m.y2 > +m.y1) dsYakinlas(DS.s, { t: 'yakin', y1: +m.y1, y2: +m.y2 });
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
    /* İÇİNDEKİLER AKORDİYON (14.11.2026): bir bölüm açılınca öbürleri kapanır (veri.js: tocAkordiyon) */
    function icAkAcik() { var V = kok.KITAP_VERI; return !!(V && +V.tocAkordiyon); }
    var IC_AK_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9.5l6 6 6-6"/></svg>';
    function icAkKur(liste) {
      var ac = icAkAcik();
      liste.classList.toggle('tk-akordiyon', ac);
      if (ac) icAkSus(liste);                                         /* İÇİNDEKİLER SÜSÜ (14.11.2026) */
      [].forEach.call(liste.querySelectorAll('.tunite'), function (b) {
        var k = b.nextElementSibling, var_ = !!(k && k.classList.contains('tkonular')), o = b.querySelector('.tk-ok');
        b.classList.toggle('tk-var', ac && var_);
        if (ac && var_) {
          if (!o) { o = document.createElement('span'); o.className = 'tk-ok'; o.innerHTML = IC_AK_OK; b.appendChild(o); }
          b.setAttribute('aria-expanded', k.classList.contains('tk-kapali') ? 'false' : 'true');
        } else {
          if (o && o.parentNode) o.parentNode.removeChild(o);
          b.removeAttribute('aria-expanded'); b.classList.remove('tk-acik');
          if (var_) k.classList.remove('tk-kapali');
        }
      });
      if (ac && !IC.akDinle) {
        IC.akDinle = true;
        liste.addEventListener('click', function (e) {                 /* yakalama evresinde: bölüm satırı sayfaya gitmez, açılır / kapanır */
          if (!icAkAcik()) return;
          var b = e.target.closest && e.target.closest('.tunite.tk-var'); if (!b) return;
          e.preventDefault(); e.stopPropagation();
          if (kkYanki(e) || engelli() || dsIzleyen()) return;
          icAkAc(b.classList.contains('tk-acik') ? null : b, true);
        }, true);
      }
    }
    /* İÇİNDEKİLER SÜSÜ (14.11.2026): renkli bölüm kartları, Arapça ad, metin sayısı, konu simgeleri */
    var IC_SUS_IK = {
      kitap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>',
      diyalog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h8A2.5 2.5 0 0 1 16 5.5v4a2.5 2.5 0 0 1-2.5 2.5H8l-4 3v-3.2A2.5 2.5 0 0 1 3 9.5z"/><path d="M19 9h.5A1.5 1.5 0 0 1 21 10.5v5a1.5 1.5 0 0 1-1.5 1.5H19v3l-3.5-3H12a1.5 1.5 0 0 1-1.5-1.5V15"/></svg>',
      metin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6M9 9h2"/></svg>',
      bolum: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>'
    };
    function icRgba(hex, a) {
      var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim()); if (!m) return 'rgba(30, 58, 138, ' + a + ')';
      var n = parseInt(m[1], 16); return 'rgba(' + (n >> 16 & 255) + ', ' + (n >> 8 & 255) + ', ' + (n & 255) + ', ' + a + ')';
    }
    function icAkSus(liste) {
      var KV = kok.KITAP_VERI, U = (KV && Array.isArray(KV.uniteler)) ? KV.uniteler : [], fark = icFark();
      [].forEach.call(liste.querySelectorAll('.tunite'), function (b) {
        var git = b.getAttribute('data-git'), u = null;
        U.forEach(function (x) { if (!u && String(x.bas) === git) u = x; });
        var k = b.nextElementSibling, grup = !!(k && k.classList.contains('tkonular'));
        var renk = (u && /^#[0-9a-f]{6}$/i.test(String(u.renk || ''))) ? u.renk : '#1E3A8A';
        [b].concat(grup ? [k] : []).forEach(function (e) {
          e.style.setProperty('--tk', renk); e.style.setProperty('--tk-a', icRgba(renk, .07)); e.style.setProperty('--tk-b', icRgba(renk, .14)); e.style.setProperty('--tk-c', icRgba(renk, .32));
        });
        b.classList.add('tk-sus');
        if (!u) return;
        var nu = b.querySelector('.nu'), sayi = /^(\d+)\./.exec(String(u.ad || ''));
        if (nu && !nu.getAttribute('data-sus')) { nu.setAttribute('data-sus', '1'); nu.classList.remove('bos'); nu.innerHTML = sayi ? sayi[1] : IC_SUS_IK.kitap; }
        var mt = b.querySelector('.mt');
        if (mt) {
          var bilgi = mt.querySelector('.tk-bilgi'), n = 0;
          if (grup) [].forEach.call(k.querySelectorAll('.tkonu .ad'), function (a) { if (/ — (diyalog|metin) · /.test(a.textContent)) n++; });
          var metn = (n ? n + ' metin · ' : '') + 's. ' + u.bas + '–' + u.son;
          if (!bilgi) { bilgi = document.createElement('small'); bilgi.className = 'tk-bilgi'; mt.appendChild(bilgi); }
          bilgi.textContent = metn;
        }
      });
      [].forEach.call(liste.querySelectorAll('.tkonular .tkonu'), function (t) {
        if (t.getAttribute('data-sus')) return; t.setAttribute('data-sus', '1');
        var ad = t.querySelector('.ad'); if (!ad) return;
        var ilk = ad.firstChild; if (!ilk || ilk.nodeType !== 3) return;
        var m = /^(.*?) — (.+)$/.exec(ilk.nodeValue); var tur = 'bolum', ust = ilk.nodeValue, alt = '';
        if (m) { ust = m[1]; alt = m[2]; tur = /^diyalog · /.test(alt) ? 'diyalog' : (/^metin · /.test(alt) ? 'metin' : 'bolum'); }
        else if (/kullanılır/i.test(ust)) tur = 'kitap';
        var ik = document.createElement('span'); ik.className = 'tk-tur tk-' + tur; ik.innerHTML = IC_SUS_IK[tur] || IC_SUS_IK.bolum;
        t.insertBefore(ik, t.firstChild);
        var bas = document.createElement('b'); bas.className = 'tk-ad'; bas.textContent = ust;
        ad.replaceChild(bas, ilk);
        if (alt) { var s = document.createElement('small'); s.className = 'tk-alt'; s.textContent = alt; ad.appendChild(s); }
      });
    }
    function icAkAc(b, kaydir) {                                       /* b açılır, öbürleri kapanır (b yoksa hepsi kapanır) */
      var liste = document.getElementById('tocListe'); if (!liste) return;
      [].forEach.call(liste.querySelectorAll('.tunite.tk-var'), function (x) {
        var k = x.nextElementSibling, acik = x === b; if (!k) return;
        k.classList.toggle('tk-kapali', !acik); x.classList.toggle('tk-acik', acik); x.setAttribute('aria-expanded', acik ? 'true' : 'false');
      });
      if (b && kaydir) { try { b.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (x) { } }
    }
    function icAkSimdi() {                                             /* pencere açılırken: ekrandaki sayfanın bölümü açık */
      if (!icAkAcik()) return;
      var liste = document.getElementById('tocListe'); if (!liste) return;
      var G = kkGorunen(), fark = icFark(), sec = null;
      [].forEach.call(liste.querySelectorAll('.tunite.tk-var'), function (b) {
        var k = b.nextElementSibling, bas = b.getAttribute('data-git') === 'kapak' ? 1 : (+b.getAttribute('data-git') || 0) + fark, son = +k.getAttribute('data-son') || 1e6;
        var ilk = k.querySelector('.tkonu'); if (ilk) bas = Math.min(bas, +ilk.getAttribute('data-konu-f') || bas);
        if (!sec && G.some(function (x) { return x >= bas && x <= son; })) sec = b;
      });
      icAkAc(sec, false);
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
      icAkKur(liste);                                                 /* İÇİNDEKİLER AKORDİYON (14.11.2026) */
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
      icAkSimdi();                                                    /* İÇİNDEKİLER AKORDİYON (14.11.2026) */
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
      var arv = !!a.ar && /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(a.ar);   /* YAZI YÖNÜ 2 (11.11.2026): Arapça alanına Türkçe yazılmışsa da soldan sağa */
      if (a.ar) h += arv ? '<div class="ds-ar" dir="rtl" lang="ar">' + kkEsc(a.ar) + '</div>' : '<div class="ds-tr" dir="ltr">' + kkEsc(a.ar) + '</div>';
      if (a.tr) h += '<div class="ds-tr">' + kkEsc(a.tr) + '</div>';
      if (!h) return;
      k = document.createElement('div');
      k.className = 'dk-yaz'; k.setAttribute('data-dk', String(j)); k.setAttribute('aria-hidden', 'true');
      dsKonum(k, a);
      k.innerHTML = '<div class="dk-yazi' + (arv ? '' : ' dk-sol') + '">' + h + '</div>';
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
        cv.innerHTML = '<div class="dk-yazi' + (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(zsMetin(p.ar) || '') ? '' : ' dk-sol') + '">' + h + '</div>';
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
          if (+p.bk > 0) o.bk = Math.min(60, +p.bk);                     /* BÖLÜM ARASI BEKLE (03.11.2026) */
          if (p.cb) o.cb = 1;                                             /* KISIM BEKLE (11.11.2026) */
          if (p.vy) o.vy = 1;                                             /* KISIM VURGU SEÇ (11.11.2026) */
          if (zsCerceveli(p) && +p.sayfa >= 1) {                     /* KISIM VURGUSU: sayfadaki yeri */
            o.x1 = dsYuzde(p.x1, 0); o.y1 = dsYuzde(p.y1, 0); o.x2 = dsYuzde(p.x2, 100); o.y2 = dsYuzde(p.y2, 100); o.sayfa = Math.floor(+p.sayfa);
            ksYonergeOtur(o);                                             /* YÖNERGE KUTUSU OTURUR (04.11.2026) */
          }
          return o;
        })
        .sort(function (x, y) { return x.b - y.b; });
    }
    /* ÇUBUKTA HEP RAKAM (03.11.2026) — öğretmen: "zaman çizgisinde hep rakamlar olsun, yönerge için rakam yazmasın,
       türkçe yönerge yazsın … böylelikle otomotik olarak yönerge dışındakilerin rakamı tutmuş olur". */
    var KS_YON_FIIL = /^[\s\u064B-\u0652]*(?:[اأإ]س[\u064B-\u0652]*ت[\u064B-\u0652]*م[\u064B-\u0652]*ع|[اأإ]ق[\u064B-\u0652]*ر[\u064B-\u0652]*[أا]|[اأإ]ن[\u064B-\u0652]*ظ[\u064B-\u0652]*ر|[أا]ج[\u064B-\u0652]*ب|[اأإ]ك[\u064B-\u0652]*ت[\u064B-\u0652]*ب|ك[\u064B-\u0652]*و[\u064B-\u0652]*ن|[أا]ك[\u064B-\u0652]*م[\u064B-\u0652]*ل|ص[\u064B-\u0652]*ل|ض[\u064B-\u0652]*ع|ر[\u064B-\u0652]*ت[\u064B-\u0652]*ب|[اأإ]ملأ|[أا]ج[\u064B-\u0652]*ر|ش[\u064B-\u0652]*ا[\u064B-\u0652]*ه[\u064B-\u0652]*د|ت[\u064B-\u0652]*ح[\u064B-\u0652]*د[\u064B-\u0652]*ث|[اأإ]خ[\u064B-\u0652]*ت[\u064B-\u0652]*ر|ل[\u064B-\u0652]*و[\u064B-\u0652]*ن|[اأإ]س[\u064B-\u0652]*ت[\u064B-\u0652]*خ[\u064B-\u0652]*ر[\u064B-\u0652]*ج)/;
    function ksYonergeMi(p, i) {
      if (!p) return false;
      if (/^\s*y[öo]nerge\s*$/i.test(p.ad || '')) return true;          /* Tezgâh'ta adı «Yönerge» */
      if (ksVurguVar(p)) {                                              /* sarı kutusu bir yönerge satırının üstünde */
        var Y = kok.KITAP_YONERGE, R = (Y && Y.sayfa && Y.sayfa[p.sayfa]) || [], cx = (p.x1 + p.x2) / 2, cy = (p.y1 + p.y2) / 2;
        return R.some(function (r) { return (r[1] + r[3]) / 2 >= 6 && cx >= r[0] - 1 && cx <= r[2] + 1 && cy >= r[1] - 1 && cy <= r[3] + 1; });
      }
      return KS_YON_FIIL.test(p.ad || '') ? 'fiil' : false;              /* kutusu yok: yönerge fiiliyle başlıyor (ilk birkaç kısımda) */
    }
    function ksEtiket(K, i) {
      var P = K.P || [];
      if (K.etP !== P || K.etV !== KS.v) {                              /* etiketler: yönerge «Yönerge», kalanlar sırayla */
        K.etP = P; K.etV = KS.v; K.et = []; var n = 0;
        var Yi = P.map(function (p, j) { return ksYonergeMi(p, j); }), fy = -1;
        Yi = Yi.map(function (y, j) { var ok = y === true || (y === 'fiil' && j <= 3 && fy < 0); if (ok && fy < 0) fy = j; return ok; });
        P.forEach(function (p, j) {                                     /* yönergeden önceki ünite / ders başlığı: «Başlık» */
          var bas = fy > j && (/^\s*ba[şs]l[ıi]k\s*$/i.test(p.ad || '') || /^[\s\u064B-\u0652]*ال[\u064B-\u0652]*(?:و[\u064B-\u0652]*[اح]|د[\u064B-\u0652]*ر[\u064B-\u0652]*س)/.test(p.ad || ''));   /* KISIMLARDA RAKAM (06.11.2026): adı «Başlık» */
          K.et.push(Yi[j] ? 'Yönerge' : bas ? 'Başlık' : String(++n));
        });
      }
      return K.et[i] != null ? K.et[i] : String(i + 1);
    }
    /* YÖNERGE KUTUSU OTURUR (04.11.2026) — öğretmen: "turuncu vurgu çerçevesi ile mor vurgu çizgisi uyuşmuyor":
       yönergeyi okuyan kısmın kutusu yönerge satırının yerine oturur (ortası satırın içinde, en az yarısı kadar geniş). */
    function ksYonergeOtur(o) {
      try {
        var Y = kok.KITAP_YONERGE, R = (Y && Y.sayfa && Y.sayfa[o.sayfa]) || [], cx = (o.x1 + o.x2) / 2, cy = (o.y1 + o.y2) / 2;
        R.some(function (r) {
          if ((r[1] + r[3]) / 2 < 6 || cx < r[0] - 1 || cx > r[2] + 1 || cy < r[1] - 1 || cy > r[3] + 1) return false;
          if (o.x2 - o.x1 < (r[2] - r[0]) * 0.5) return false;          /* yönergedeki tek kelime: dokunma */
          o.x1 = r[0]; o.y1 = r[1]; o.x2 = r[2]; o.y2 = r[3]; return true;
        });
      } catch (e) { }
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
        var ad = K.konum ? String(i + 1) : ksEtiket(K, i);              /* ÇUBUKTA HEP RAKAM (03.11.2026): 1, 2, 3 … ; yönerge «Yönerge» */
        var bas = (K.konum ? (i + 1) + '. konum' : (p.ad || (i + 1) + '. kısım')) + ' · ' + ksSaat(p.b) + '–' + ksSaat(p.s) + (K.konum ? ' — dokun: bu konum çalsın' : ' — dokun: buradan çal');
        h += '<button type="button" class="ks-k' + (K.konum ? ' ks-konum' : '') + (p.ad ? '' : ' ks-adsiz') + '" data-ki="' + i + '" style="right:' + a.toFixed(3) + '%;width:' + (b - a).toFixed(3) + '%" title="' +
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
      if (K.tekSon != null && (el.ended || src !== K.src)) K.tekSon = null;
      if (K.tekSon != null && !el.paused && (+el.currentTime || 0) >= K.tekSon - 0.03) {   /* YALNIZ O KISIM: kısmın sonu */
        K.tekSon = null; try { el.pause(); } catch (e) { }
        try { dsKcBitti(src, K.tekI); } catch (e) { }                     /* KISIM CEVAP (11.11.2026) */
      }
      var t = (K.sur && K.sur.oldu && K.sur.t != null) ? K.sur.t : (+el.currentTime || 0), o = d > 0 ? Math.max(0, Math.min(1, t / d)) : 0;
      ksBekle(K, P, t);                                               /* BÖLÜM ARASI BEKLE (03.11.2026) */
      K.dolu.style.width = (o * 100).toFixed(2) + '%';
      K.imlec.style.right = (o * 100).toFixed(2) + '%';               /* SAĞDAN SOLA ÇUBUK (03.11.2026) */
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
      ksVurguYaz(K, vj >= 0 && P[vj] && P[vj].vy ? -1 : vj);          /* KISIM VURGU SEÇ: vurgusuz kısım parlamaz (görünüm yine kayar) */
      if (vj !== K.tkj) { K.tkj = vj; if (vj >= 0 && !el.paused && !el.ended) dsKutuyaKay(P[vj]); }   /* SARI KUTUYU TAKİP (03.11.2026) */
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
    var DS_SNBIT = null;                                             /* YAKINLAŞMA SÜRESİ: süresi dolan yakınlaşma */
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
      if (n) n += dsCvSay(L[j]);                                       /* CEVAP ELLE: işaretler cevaplardan sonra */
      var m = Math.max(dsIsaretIlk(L[j]), n), geri = DS_SEST.el === el && t < DS_SEST.t - 0.3;   /* geri sarıldı */
      DS_SEST.el = el; DS_SEST.t = t;
      var aj = L[j], snKey = s + ':' + j;                              /* YAKINLAŞMA SÜRESİ (02.11.2026): sn dolunca uzaklaş */
      if (aj && aj.t === 'dv' && typeof aj.sn === 'number' && aj.sn > 0 && j === DS.i) {   /* ŞERİT İKİ KENAR: dokunma vurgusu süresi */
        var yzv = kkYuz(s);
        if (yzv) { if (T > Z[j] + aj.sn) { var ov = yzv.querySelector('.ds-dv[data-ds="' + j + '"]'); if (ov && ov.parentNode) ov.parentNode.removeChild(ov); } else dsDvGoster(yzv, aj, j, true); }
      }
      if (aj && aj.t === 'yakin' && typeof aj.sn === 'number' && aj.sn > 0 && j === DS.i) {
        if (T > Z[j] + aj.sn) { if (DS_SNBIT !== snKey) { DS_SNBIT = snKey; if (!dsIzleyen()) dsYakinlas(s, null); } }
        else if (DS_SNBIT === snKey) { DS_SNBIT = null; if (!dsIzleyen() && dsBantVar(aj)) dsYakinlas(s, aj); }
      }
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
          var j = +el.getAttribute('data-j'); if (j >= 0) ksKismaTek(K, j);   /* YALNIZ O KISIM (02.11.2026): sonunda durur */
        });
      }
      dsKonum(el, p);
      el.setAttribute('data-j', String(vj));
      var ket = ksEtiket(K, vj); el.firstChild.textContent = /^\d+$/.test(ket) ? ket : '';   /* ÇUBUKTA HEP RAKAM: yönerge / başlık kutusunda numara yok */
      el.title = (p.ad || (vj + 1) + '. kısım') + ' — dokun: bu kısım yeniden çalsın';
      el.setAttribute('aria-label', el.title);
      el.classList.remove('ks-yeni'); void el.offsetWidth; el.classList.add('ks-yeni');   /* her yeni kısımda kısa parlama */
      if (!DS.aktif && K.el && !K.el.paused && !dsIzleyen()) dsKisimYakin(K, p);
      else if (DS.aktif && K.el && !K.el.paused && !K.sur) ksTakip(K, vj, false);   /* SARI VURGUYU TAKİP: çalarken ekran dışına çıktıysa */   /* ŞERİT İKİ KENAR: kısım çalarken mutlaka yaklaş */
    }
    /* BÖLÜM ARASI BEKLE (03.11.2026) — öğretmen: "bazı seslerde bölümler arasında istenen kadar gecikme ekleyebilelim":
       bölümün "bk" saniyesi varsa sonunda durur, geri sayar, sürer. */
    function ksBekleBit(K, surdur) {
      if (K.bkZ) { clearInterval(K.bkZ); K.bkZ = null; }
      var b = K.bkBek; K.bkBek = false; K.kap.classList.remove('ks-bekle'); K.sn = '';
      if (surdur && b && K.el.paused) ksCal(K.el);
    }
    function ksBekle(K, P, t) {
      var el = K.el;
      if (K.bkBek) {
        if (!el.paused || Math.abs(t - K.bkT) > 0.3 || el.getAttribute('src') !== K.src) ksBekleBit(K, false);   /* ▶ basıldı / sarıldı */
        return;
      }
      if (K.bkI != null && (!P[K.bkI] || t < P[K.bkI].s - 0.3 || t > P[K.bkI].s + 1.5)) K.bkI = null;
      if (el.paused || el.ended || K.tekSon != null || (K.sur && K.sur.oldu) || (typeof ZS !== 'undefined' && ZS.el === el)) return;
      for (var i = 0; i < P.length - 1; i++) {
        var p = P[i]; if (!(p.bk > 0) || K.bkI === i) continue;
        if (t >= p.s - 0.05 && t < p.s + 0.5) {
          K.bkI = i; K.bkBek = true; K.bkT = +el.currentTime || 0; K.bkSon = Date.now() + p.bk * 1000;
          try { el.pause(); } catch (e) { }
          K.kap.classList.add('ks-bekle');
          var yaz = function () {
            var kal = Math.max(0, (K.bkSon - Date.now()) / 1000);
            if (K.sureEl) { K.sureEl.textContent = '⏸ ' + Math.ceil(kal) + ' sn'; K.sn = ''; }
            if (kal <= 0) ksBekleBit(K, true);
          };
          yaz(); K.bkZ = setInterval(yaz, 200);
          return;
        }
      }
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
      return Math.max(0, Math.min(d, (r.right - x) / r.width * d));   /* SAĞDAN SOLA ÇUBUK: sağdan ölçülür */
    }
    function ksGit(K, t, cal) {
      var el = K.el; if (t == null || !isFinite(t)) return;
      K.tekSon = null;                                                  /* elle konum: «yalnız o kısım» biter */
      if (ZS.el === el) zsGit(t, !!cal);                             /* dinleme etkinliği: kendi durma / konum hesabıyla */
      else { try { el.currentTime = t; } catch (e) { } if (cal && (el.paused || el.ended)) ksCal(el); }
      ksGuncelle(K);
    }
    function ksKismaTek(K, i) {                                       /* YALNIZ O KISIM: başından çal, sonunda dur */
      var p = K.P[i]; if (!p) return;
      if (K.konum && ZS.el === K.el && ZS.P[i]) { zsTek(i); ksGuncelle(K); return; }
      ksGit(K, Math.max(0, p.b - 0.02), true);
      K.tekSon = Math.max(+p.b + 0.1, +p.s - 0.08);                    /* KISIM İLERİ: sonraki kısmın başına taşmasın (vurgu çalanda kalsın) */
      K.tekI = i;                                                       /* KISIM CEVAP: biten kısım */
      ksDongu();
      if (DS.aktif) ksTakip(K, i, true);                               /* SARI VURGUYU TAKİP */
      if (!DS.aktif && kzDokunBuyut()) dsKisimYakin(K, p);   /* DOKUNUNCA BÜYÜT */                               /* KISMA DOKUNUNCA YAKINLAŞMA (02.11.2026) */
    }
    /* KISMA DOKUNUNCA YAKINLAŞMA (02.11.2026) — öğretmen: "yakınlaştırma varsa o da
       çalışmalı". Ders kapalıyken: sayfanın adımlarında bu sesin kaynak adımından
       sonra, kısmın başladığı ana (Tezgâh şeridindeki zm) düşen son bantlı adıma
       yaklaşılır. Ders açıkken bunu sesle ilerleme (dsSesle) yapar. */
    var DS_KY = '';                                                   /* ŞERİT İKİ KENAR (02.11.2026): son kısım yakınlaşması */
    function dsKisimYakin(K, p) {
      try {
        if (!dsVeri() || !(p.sayfa >= 1)) return;
        var s = p.sayfa, L = dsAdimlar(s); if (!L.length) return;
        if (!L.some(function (x) { return x && x.t === 'yakin'; })) return;   /* yakınlaştırma eklenmiş sayfada */
        var hd = dsKisimHedef(K, p, L);
        /* KISMIN YERİ YAKINLAŞTIRMAZ (02.11.2026) — öğretmen: "yakınlaştırma özelliği ile yer çizme karışmasın, yer
           çizme sadece ilgili ses bölümü için vurgulanacak yeri kastediyor, yakınlaştırma yapmasın ekstra": yalnız
           yakınlaştırma adımlarının bantlarına; kısmın kendi yerine yaklaşılmaz. */
        if (!hd) return;
        var ky = s + ':' + [hd.x1, hd.y1, hd.x2, hd.y2].join(',');
        if (ky === DS_KY && z.o > 1.02) return;
        DS_KY = ky; dsYakinlas(s, hd);
      } catch (e) { }
    }
    function dsKisimHedef(K, p, L) {                                   /* kısmın başına düşen bantlı adım (yoksa null) */
      try {
        var s = p.sayfa;
        var V = kok.KITAP_VERI || {}, Kn = V.kaynak || [], a = ksAnah(K.el.getAttribute('src') || ''), i, i0 = -1;
        for (i = 0; i < L.length; i++) {
          var x = L[i];
          if (x && x.t === 'kaynak' && x.k != null && Kn[+x.k] && Kn[+x.k].yol && ksAnah(Kn[+x.k].yol) === a) { i0 = i; break; }
        }
        if (i0 < 0) return null;
        var Z = dsSesZm(L), T = Z[i0] + (+p.b) + 0.25, j = i0;      /* pay: kısım ile adım aynı anda çizilmiş olsun */
        for (i = i0 + 1; i < L.length; i++) { if (Z[i] <= T) j = i; else break; }
        for (i = j; i >= i0; i--) if (dsBantVar(L[i])) {
          if (L[i].t === 'yakin' && typeof L[i].sn === 'number' && L[i].sn > 0 && T > Z[i] + L[i].sn) return null;   /* YAKINLAŞMA SÜRESİ: süresi dolmuş */
          return L[i];
        }
      } catch (e) { }
      return null;
    }
    /* KISIM BEKLE ŞERİTTE DE (25.11.2026) — öğretmen: "ilerleme tuşu yerine bu ses kısımlarına basınca cevaba tıklamayı vs
       beklemeden diğerine geçiyor": bekleyen / çalan kısmın cevabı açılmadan sonraki kısma dokunuş «ileri» gibi */
    function dsKcSeritEngel(K, i) {
      try {
        if (!dsKcGecerli() || !K || !K.el) return false;
        var kay = K.el.currentSrc || K.el.getAttribute('src') || K.src || '';
        if (ksAnah(kay) !== ksAnah(DS_KC.src)) return false;
        var P = ksKisimlar(DS_KC.src), cur = DS_KC.bek;
        if (cur < 0) { var t = K.el.currentTime || 0; for (var x = 0; x < P.length; x++) if (t >= +P[x].b - 0.05 && t < +P[x].s) cur = x; }
        if (cur < 0 || i <= cur) return false;                       /* aynı / önceki kısım: yeniden dinlet */
        var bekle = DS_KC.bek >= 0;
        if (!bekle && P[cur] && P[cur].cb && DS_KC.j >= 0 && DS.i >= DS_KC.j && dsKcBirimler(cur).length && !dsKcTamam(cur)) bekle = true;
        if (!bekle) return false;
        dsIleri();
        try { kkTost('Önce bu kısmın cevabı açılır · sonra sıradaki kısım'); } catch (e) { }
        return true;
      } catch (e) { return false; }
    }
    /* SARI VURGUYU TAKİP (25.11.2026) — öğretmen: "ses kısmından bi bölüme tıklanırsa oraya ait büyüme hemen değişsin sarı
       vurguyu takip etsin": kısma dokununca o kısmın bandı (yoksa sarı vurguyu içeren bant, o da yoksa vurgunun kendisi);
       derste çalarken vurgu ekran dışına çıkarsa onu içeren banda kayılır. */
    var KS_TKP = 0;
    function ksTakipBant(K, p, zorla) {
      var s = p.sayfa, L = dsAdimlar(s), v = ksVurguVar(p), hd = null, j, x;
      var icer = function (b) { return dsBantVar(b) && +b.y1 <= +p.y1 + 1 && +b.y2 >= +p.y2 - 1; };
      if (L.length && zorla) hd = dsKisimHedef(K, p, L);
      if (hd && v && !icer(hd)) hd = null;
      if (!hd && v) {
        for (j = 0; j < L.length; j++) { x = L[j]; if (x && icer(x) && (!hd || (+x.y2 - +x.y1) < (+hd.y2 - +hd.y1))) hd = x; }
        if (!hd) hd = { x1: 0, x2: 100, y1: Math.max(0, +p.y1 - 3), y2: Math.min(100, +p.y2 + 3) };
      }
      return hd;
    }
    function ksTakip(K, i, zorla) {
      if (zorla === undefined) zorla = true;
      clearTimeout(KS_TKP);
      KS_TKP = setTimeout(function () {                               /* sarma ve derste adım değişimi bitsin, sonra */
        try {
          var p = K.P[i]; if (!p || !(p.sayfa >= 1) || dsIzleyen() || !dsVeri()) return;
          if (!DS.aktif && !kzDokunBuyut()) return;
          if (!zorla && (!ksVurguVar(p) || dsYerGorunur(p.sayfa, p))) return;   /* çalarken: vurgu ekrandaysa dokunma */
          var hd = ksTakipBant(K, p, zorla); if (!hd) return;
          DS_KY = p.sayfa + ':' + [hd.x1, hd.y1, hd.x2, hd.y2].join(',');
          dsYakinlas(p.sayfa, hd);
        } catch (e) { }
      }, zorla ? 260 : 60);
    }
    /* SES KAPANINCA DERS BİTER (25.11.2026) — öğretmen: "sesi kapatınca ders modundan çıksın": ses çubuğunun ✕'ine öğretmen
       basınca ders modu kapanır (ders kendi içinde etkinlik değiştirirken sesi kapatması saymaz: yalnız gerçek dokunuş) */
    document.addEventListener('click', function (e) {
      try {
        if (!e.isTrusted || !DS.aktif || dsIzleyen()) return;
        var t = e.target; if (!t || !t.closest) return;
        var kb = t.closest('#calarKapat') || (MD.calar && MD.calar.contains(t) ? t.closest('.kapat') : null);
        if (kb) setTimeout(function () { if (DS.aktif) dsKapat(true); }, 0);
      } catch (x) { }
    }, true);
    function ksKisma(K, i) {                                          /* kısma dokunuldu: o kısmın başından çal */
      var p = K.P[i]; if (!p) return;
      if (dsKcSeritEngel(K, i)) return;                              /* KISIM BEKLE ŞERİTTE DE */
      ksTakip(K, i, true);                                           /* SARI VURGUYU TAKİP */
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
