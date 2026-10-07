/* ===========================================================================
   GÜNCELLEMELER VE GALERİ — ana sayfadaki bölüm                   03.10.2026
   ---------------------------------------------------------------------------
   Öğretmen (ilk istek): "katalogtan sonra imam hatip kategorisinden önce
   profesyonel bi site güncellemelerinin duyurularının olduğu ve galeri olan
   kategori gibi bi şey ekleyelim, galeriye görsel ekleyince içinde
   gezilebilsin."
   Öğretmen (düzeltme): "site güncellemeleri yatay olarak ekranın yarısını
   kaplasın, her bi güncelleme oklarla açılsın tüm güncellemeler dikey
   scrollarla görülmesin, galeri de görseller tek tek sağ sol oklarla
   gezilsin, büyütülse de."

   DÜZEN: iki eşit yarım. Solda duyuru, sağda fotoğraf — İKİSİ DE TEK TEK,
   oklarla. Dikey kaydırma yok; yükseklik sabit, geçişte sayfa zıplamıyor.

   İKİ KAYNAK, İKİSİ DE HAZIRDI:
     · Duyurular  → sistem/yenilikler.js (KidefYenilikler.hepsi())
       Öğretmen profilindeki yenilik şeridiyle AYNI liste; yeni duyuru
       eklemek için o dosyanın BAŞINA bir kayıt yazmak yeter.
     · Galeri     → sistem/galeriveri.js (KIDEF_GALERI)
       _kaynak/uretici/galeriYenile.py üretir; hızlı gönder her gönderimde
       çalıştırır. Fotoğrafı Galeri/ içine atmak yeterli.

   GEZİNME (ikisinde de aynı): başlıktaki ‹ › okları, altındaki noktalar,
   parmakla kaydırma, kutu odaktayken ← → tuşları. Sona gelince başa döner.

   BÜYÜTEÇ: fotoğrafa basınca tam ekran; orada da sağ/sol oklarla gezilir,
   Esc ya da boşluk kapatır. Büyük kopya (Galeri/web/) yalnız büyütülünce
   indirilir; tek tek görünümde orta boy (Galeri/kucuk/) yeter.

   Bölüm, içeriği olmadığında KENDİNİ GİZLER.
   =========================================================================== */
(function () {
  'use strict';

  function el(etiket, sinif, yazi) {
    var e = document.createElement(etiket);
    if (sinif) e.className = sinif;
    if (yazi != null) e.textContent = yazi;
    return e;
  }

  var OK_SOL = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 5 8 12 15 19"/></svg>';
  var OK_SAG = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 5 16 12 9 19"/></svg>';
  /* Duyuru tarafı dikey gezilir: oklar üstte ve altta (03.10.2026) */
  var OK_UST = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="5 15 12 8 19 15"/></svg>';
  var OK_ALT = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="5 9 12 16 19 9"/></svg>';

  /* ------------------------------------------------------------------
     Tek tek gezinme düzeneği: okları, sayacı, noktaları ve parmakla
     kaydırmayı kurar. Hangi kaydın çizileceğini çağıran belirler (ciz).
     ------------------------------------------------------------------ */
  function gezgin(ayar) {
    var n = ayar.adet, i = 0;
    if (!n) return null;

    var dikey = !!ayar.dikey;

    var geri = el('button', 'gd-ok');
    geri.type = 'button';
    geri.innerHTML = dikey ? OK_UST : OK_SOL;
    geri.setAttribute('aria-label', ayar.geriEtiket || 'Önceki');

    var ileri = el('button', 'gd-ok');
    ileri.type = 'button';
    ileri.innerHTML = dikey ? OK_ALT : OK_SAG;
    ileri.setAttribute('aria-label', ayar.ileriEtiket || 'Sonraki');

    if (dikey) ayar.okKap.classList.add('gd-govde-d');

    var sayac = el('span', 'gd-say');
    /* 03.10.2026: oklar başlıktan alınıp içeriğin iki yanına kondu —
       dikeyde ortalı ve büyük (öğretmen isteği). Sayaç aşağı, noktaların
       yanına indi. */
    ayar.okKap.insertBefore(geri, ayar.okKap.firstChild);
    ayar.okKap.appendChild(ileri);
    ayar.alt.appendChild(sayac);

    var nokta = el('div', 'gd-nokta');
    nokta.setAttribute('role', 'tablist');
    var noktalar = [];
    if (n > 1 && n <= 12) {
      for (var k = 0; k < n; k++) {
        (function (j) {
          var d = el('button', 'gd-n');
          d.type = 'button';
          d.setAttribute('aria-label', (j + 1) + '. kayıt');
          d.addEventListener('click', function () { git(j, true); });
          nokta.appendChild(d);
          noktalar.push(d);
        })(k);
      }
      ayar.alt.appendChild(nokta);
    }

    var ilkCizim = true;
    function git(y, mutlak) {
      var eski = i;
      i = mutlak ? y : (i + y + n) % n;
      /* aynı kayda yeniden gitmek boşa iş — ama İLK çizim atlanmamalı */
      if (!ilkCizim && i === eski && mutlak) return;
      ilkCizim = false;
      ayar.ciz(i, eski);
      sayac.textContent = (i + 1) + ' / ' + n;
      noktalar.forEach(function (d, j) {
        d.classList.toggle('acik', j === i);
        d.setAttribute('aria-selected', j === i ? 'true' : 'false');
      });
      if (n < 2) { geri.disabled = true; ileri.disabled = true; }
    }

    geri.addEventListener('click', function () { git(-1); });
    ileri.addEventListener('click', function () { git(1); });

    /* kutu odaktayken ok tuşları — sayfanın kendi kaydırmasını bozmasın
       diye yalnız bölümün içinde dinleniyor */
    ayar.kap.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || (dikey && e.key === 'ArrowDown')) { e.preventDefault(); git(1); }
      else if (e.key === 'ArrowLeft' || (dikey && e.key === 'ArrowUp')) { e.preventDefault(); git(-1); }
    });

    var x0 = null;
    ayar.kap.addEventListener('touchstart', function (e) {
      x0 = e.touches.length === 1 ? e.touches[0].clientX : null;
    }, { passive: true });
    ayar.kap.addEventListener('touchend', function (e) {
      if (x0 == null) return;
      var dx = (e.changedTouches[0] || {}).clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 45) git(dx < 0 ? 1 : -1);
    }, { passive: true });

    git(ayar.basla || 0, true);
    return { git: git, sira: function () { return i; } };
  }

  /* -------------------------------------------------------------- sınıfta yeni */
  /* 04.10.2026 — öğretmen: "amacımız yaptığımız yeni güncellemeleri bildirmek
     ama çok fazla teknik bi dille değil, öğretim yöntem ve teknikleri ve
     öğretmenin kolaylıkla uygulaması vs yönünden."
     Kaynak: sistem/siniftayeni.js — her kayıt yeniliğin SINIFTA ne işe
     yaradığını anlatır. Site içi teknik şerit ayrı: sistem/yenilikler.js.
     En yeni kayıtla açılır, oklarla geriye doğru gezilir. */
  var AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  function tarihYaz(s) {
    var p = String(s || '').split('-');
    if (p.length !== 3) return s || '';
    return parseInt(p[2], 10) + ' ' + (AY[parseInt(p[1], 10) - 1] || '') + ' ' + p[0];
  }

  function duyurulariKur(bolum) {
    var liste = [];
    try { liste = (window.KIDEF_SINIFTA_YENI || []).slice(); } catch (e) { liste = []; }
    if (!liste.length) return 0;

    var sol = bolum.querySelector('.gd-sol');
    var sahne = sol.querySelector('.gd-duyuru');
    var alt = sol.querySelector('.gd-sol-alt');

    var kart = el('article', 'gd-kayit');
    var ust = el('div', 'gd-ust');
    var etiket = el('span', 'gd-etiket');
    var tarih = el('time', 'gd-tarih');
    var rozet = el('span', 'gd-rozet', 'YENİ');
    ust.appendChild(etiket); ust.appendChild(tarih); ust.appendChild(rozet);
    var h4 = el('h4');
    var p = el('p');
    kart.appendChild(ust); kart.appendChild(h4); kart.appendChild(p);
    sahne.appendChild(kart);
    sahne.setAttribute('aria-live', 'polite');

    gezgin({
      adet: liste.length, kap: sol, okKap: sol.querySelector('.gd-govde'), alt: alt,
      dikey: true,
      geriEtiket: 'Önceki yenilik', ileriEtiket: 'Sonraki yenilik',
      ciz: function (i) {
        var f = liste[i] || {};
        etiket.textContent = f.e || '';
        tarih.textContent = tarihYaz(f.t);
        rozet.hidden = i !== 0;
        h4.textContent = f.b || '';
        p.textContent = f.m || '';
        kart.scrollTop = 0;               /* sabit boy kâğıt: yeni kayıt baştan */
        kart.classList.remove('gd-gir');
        void kart.offsetWidth;            /* animasyonu yeniden başlat */
        kart.classList.add('gd-gir');
      }
    });
    return liste.length;
  }

  /* ---------------------------------------------------------- resim değişimi
     Ok'a basınca ekranın donmaması için fotoğraf önce perde arkasında
     ÇÖZÜLÜYOR, sonra ekrandakine konuyor. Önden indirilenler burada
     tutuluyor; tutulmazsa tarayıcı çözdüğü görüntüyü atıyor ve sıra
     gelince yeniden çözüyor (eski "ön yükleme" bu yüzden iş görmüyordu). */
  var ONBELLEK = [];
  function ondenAl(yol) {
    for (var i = 0; i < ONBELLEK.length; i++) {
      if (ONBELLEK[i].__yol === yol) return ONBELLEK[i];
    }
    var o = new Image();
    o.__yol = yol;
    o.decoding = 'async';
    try { o.fetchPriority = 'low'; } catch (e) { }
    o.src = yol;
    try { if (o.decode) o.decode().catch(function () { }); } catch (e) { }
    ONBELLEK.push(o);
    if (ONBELLEK.length > 10) ONBELLEK.shift();
    return o;
  }

  /* İSTEK SAYACI HER RESİM İÇİN AYRI (07.10.2026) — tek bir ortak sayaç
     vardı; büyük görüntüleyici fotoğrafı beklerken şeritteki küçük
     resimlerden biri basılınca sayaç artıyor ve büyük fotoğrafın bekleyen
     işi "eskidi" sanılıp iptal ediliyordu. Sonuç: fotoğraf hiç
     değişmiyor, bekleme animasyonu ekranda kalıyordu. Artık sayaç
     img'nin kendi üstünde: ikisi birbirini iptal etmiyor. */
  /* iz = {basla, bitti} — fotoğraf hazır olana kadar geçen süreyi
     bildirir. Büyük görüntüleyicide bekleme animasyonu bununla
     açılıyor; küçük resimlerde iz verilmiyor, davranış eskisi gibi. */
  function resimKoy(img, yol, iz) {
    var benim = (img.__istek = (img.__istek || 0) + 1);
    var o = ondenAl(yol);
    var bitti = false;
    var koy = function () {
      if (benim !== img.__istek || bitti) return;  /* hızlı basıldı ya da bitti */
      bitti = true;
      /* ZORUNLU BEKLEME YOK (07.10.2026): fotoğraf hazırsa HEMEN konuyor.
         Önce 150 ms bekletiliyordu; "flaş söndükten sonra değişiyor"
         izlenimini veren buydu. Yumuşaklığı CSS geçişi sağlıyor,
         bekletmek gerekmiyor. */
      img.src = yol;
      if (iz && iz.bitti) try { iz.bitti(); } catch (e) { }
    };
    /* GEÇİŞ HER ZAMAN KASITLI GÖRÜNSÜN (07.10.2026) — öğretmen: "galeride
       hâlâ kasma oluyor, bi yükleniyor animasyonu ekle, kasıyormuş gibi
       olmasın."
       Çözme artık doğru sırada (önce yükle, sonra çöz) ama büyük bir
       fotoğrafın ekrana BOYANMASI yine bir an sürüyor; o an donma gibi
       duruyordu. Artık ok'a basıldığı anda eski fotoğraf soluyor ve
       bekleme katmanı AÇILMAYA BAŞLIYOR (gecikme yok). Katmanın kendi
       açılma süresi .25 sn; iş ondan önce biterse katman görünür hâle
       gelmeden kapanıyor, yani hızlı geçişte göze çarpmıyor. Sonuç:
       yavaşta animasyon, hızlıda yumuşak geçiş — ikisinde de donma
       izlenimi yok. */
    /* FLAŞ GİBİ ÇAKMASIN (07.10.2026) — öğretmen: "basınca sanki flaş
       çakıyor, sonra flaş söndükten sonra foto değişiyor."
       Bekleme katmanı beyaz çizimli; karanlık zeminde bir anlığına
       belirip sönünce flaş gibi duruyordu. Artık yalnız iş GERÇEKTEN
       uzarsa (400 ms) çıkıyor. Kısa beklemelerde hiç görünmüyor;
       orada göze yeten şey fotoğrafın yumuşak geçişi. */
    if (iz && iz.basla) {
      setTimeout(function () {
        if (!bitti && benim === img.__istek) try { iz.basla(); } catch (e) { }
      }, 400);
    }
    /* SIRA ÖNEMLİ (07.10.2026): önce YÜKLENSİN, sonra ÇÖZÜLSÜN.
       Eskiden doğrudan decode() çağrılıyordu; henüz inmemiş bir görüntüde
       decode() hemen reddediyor ve reddi de "tamam" sayıldığı için src
       anında değişiyordu — tarayıcı o anda ana iş parçacığında çözmek
       zorunda kalıyor, titreme tam buradan geliyordu. Artık load
       beklenip ondan sonra çözülüyor; src yalnız çözülmüş görüntüyle
       değişiyor. */
    var coz = function () {
      if (benim !== img.__istek) return;
      try {
        if (o.decode) { o.decode().then(koy, koy); return; }
      } catch (e) { }
      koy();
    };
    if (o.complete && o.naturalWidth) coz();
    else { o.addEventListener('load', coz, { once: true });
           o.addEventListener('error', koy, { once: true }); }
  }

  /* ------------------------------------------------------------------- galeri */
  var bekle = null;

  function galeriKur(bolum, buyut) {
    var foto = [];
    try { foto = (window.KIDEF_GALERI || []).slice(); } catch (e) { foto = []; }
    if (!foto.length) return 0;

    var sag = bolum.querySelector('.gd-sag');
    var sahne = sag.querySelector('.gd-foto');
    var alt = sag.querySelector('.gd-sag-alt');

    var tus = el('button', 'gd-kare');
    tus.type = 'button';
    tus.setAttribute('aria-label', 'Fotoğrafı büyüt');
    var g = new Image();
    g.alt = '';
    g.decoding = 'async';
    tus.appendChild(g);
    sahne.appendChild(tus);

    var gez = gezgin({
      adet: foto.length, kap: sag, okKap: sag.querySelector('.gd-govde'), alt: alt,
      geriEtiket: 'Önceki fotoğraf', ileriEtiket: 'Sonraki fotoğraf',
      ciz: function (i) {
        var f = foto[i];
        resimKoy(g, 'Galeri/kucuk/' + encodeURIComponent(f.a));
        tus.classList.remove('gd-gir');
        void tus.offsetWidth;
        tus.classList.add('gd-gir');
        /* komşuyu önden indir VE çöz (sonuç tutuluyor) */
        [1, -1].forEach(function (y) {
          var k = foto[(i + y + foto.length) % foto.length];
          if (k) ondenAl('Galeri/kucuk/' + encodeURIComponent(k.a));
        });
      }
    });

    tus.addEventListener('click', function () { buyut.ac(gez ? gez.sira() : 0); });
    /* büyüteçte gezilince küçük görünüm de aynı fotoğrafta kalsın */
    buyut.kur(foto, function (i) { if (gez) gez.git(i, true); });
    return foto.length;
  }

  /* ---------------------------------------------------------------- büyüteç */
  function buyutecKur() {
    var foto = [], sira = 0, katman = null, resim = null, sayac = null,
        acik = false, bildir = null;

    function yap() {
      katman = el('div', 'gd-buyut');
      katman.id = 'gdBuyut';
      katman.setAttribute('role', 'dialog');
      katman.setAttribute('aria-modal', 'true');
      katman.setAttribute('aria-label', 'Galeri');
      katman.hidden = true;

      var kapat = el('button', 'gd-b-kapat');
      kapat.type = 'button';
      kapat.setAttribute('aria-label', 'Kapat');
      kapat.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

      var geri = el('button', 'gd-b-ok gd-b-geri');
      geri.type = 'button';
      geri.setAttribute('aria-label', 'Önceki fotoğraf');
      geri.innerHTML = OK_SOL;

      var ileri = el('button', 'gd-b-ok gd-b-ileri');
      ileri.type = 'button';
      ileri.setAttribute('aria-label', 'Sonraki fotoğraf');
      ileri.innerHTML = OK_SAG;

      var sahne = el('div', 'gd-b-sahne');
      resim = new Image();
      resim.className = 'gd-b-resim';
      resim.alt = '';
      resim.decoding = 'async';
      sahne.appendChild(resim);

      /* BEKLEME ANİMASYONU (07.10.2026) — öğretmen: "oklara basınca
         titreme oluyor sonra geçiyor; eğer kasacaksa bi animasyon ekle,
         bi görsel svg si animasyonu olsun sonra açılsın."
         Fotoğraf çerçevesi çizen bir SVG: çerçeve çizilir, içindeki dağ
         ve güneş belirir, altında üç nokta sırayla yanar. Yalnız fotoğraf
         110 ms'de hazır olmazsa görünür; hazırsa hiç çıkmaz. */
      bekle = el('div', 'gd-b-bekle');
      bekle.setAttribute('aria-hidden', 'true');
      bekle.innerHTML =
        '<svg viewBox="0 0 64 56" class="gdb-svg">' +
        '<rect class="gdb-cerceve" x="4" y="4" width="56" height="42" rx="6"/>' +
        '<circle class="gdb-gunes" cx="20" cy="18" r="5"/>' +
        '<path class="gdb-dag" d="M8 42 L24 24 L34 36 L42 29 L56 42 Z"/>' +
        '</svg>' +
        '<span class="gdb-noktalar">' +
        '<span class="gdb-nokta"></span><span class="gdb-nokta"></span>' +
        '<span class="gdb-nokta"></span></span>';
      sahne.appendChild(bekle);

      sayac = el('div', 'gd-b-sayac');

      katman.appendChild(kapat);
      katman.appendChild(geri);
      katman.appendChild(sahne);
      katman.appendChild(ileri);
      katman.appendChild(sayac);
      document.body.appendChild(katman);

      kapat.addEventListener('click', kapa);
      geri.addEventListener('click', function (e) { e.stopPropagation(); git(-1); });
      ileri.addEventListener('click', function (e) { e.stopPropagation(); git(1); });
      katman.addEventListener('click', function (e) { if (e.target === katman || e.target === sahne) kapa(); });

      document.addEventListener('keydown', function (e) {
        if (!acik) return;
        if (e.key === 'Escape') { e.preventDefault(); kapa(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); git(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); git(-1); }
      });

      var x0 = null;
      sahne.addEventListener('touchstart', function (e) {
        x0 = e.touches.length === 1 ? e.touches[0].clientX : null;
      }, { passive: true });
      sahne.addEventListener('touchend', function (e) {
        if (x0 == null) return;
        var dx = (e.changedTouches[0] || {}).clientX - x0;
        x0 = null;
        if (Math.abs(dx) > 45) git(dx < 0 ? 1 : -1);
      }, { passive: true });
    }

    function goster() {
      var f = foto[sira];
      if (!f) return;
      resimKoy(resim, 'Galeri/web/' + encodeURIComponent(f.a), {
        basla: function () {
          if (bekle) bekle.classList.add('gor');
          if (resim) resim.classList.add('sol');
        },
        bitti: function () {
          if (bekle) bekle.classList.remove('gor');
          if (resim) {
            /* yeni fotoğraf yumuşak açılsın: sınıf bir kare sonra
               kalkınca geçiş çalışır */
            resim.classList.add('sol');
            requestAnimationFrame(function () {
              requestAnimationFrame(function () { resim.classList.remove('sol'); });
            });
          }
        }
      });
      sayac.textContent = (sira + 1) + ' / ' + foto.length;
      var tek = foto.length < 2;
      katman.querySelector('.gd-b-geri').style.visibility = tek ? 'hidden' : '';
      katman.querySelector('.gd-b-ileri').style.visibility = tek ? 'hidden' : '';
      [1, -1].forEach(function (y) {
        var k = foto[(sira + y + foto.length) % foto.length];
        if (k) ondenAl('Galeri/web/' + encodeURIComponent(k.a));
      });
      if (bildir) bildir(sira);
    }

    function git(y) {
      if (!foto.length) return;
      sira = (sira + y + foto.length) % foto.length;
      goster();
    }

    function kapa() {
      if (!acik) return;
      acik = false;
      katman.classList.remove('gor');
      document.documentElement.style.overflow = '';
      setTimeout(function () { if (!acik) { katman.hidden = true; resim.removeAttribute('src'); } }, 220);
    }

    return {
      kur: function (l, geriBildir) { foto = l || []; bildir = geriBildir || null; if (!katman) yap(); },
      ac: function (i) {
        if (!katman) yap();
        sira = i || 0;
        katman.hidden = false;
        acik = true;
        document.documentElement.style.overflow = 'hidden';
        goster();
        requestAnimationFrame(function () { katman.classList.add('gor'); });
      }
    };
  }

  /* --------------------------------------------------------------------- kur */
  function basla() {
    var bolum = document.getElementById('guncellemeler');
    if (!bolum || bolum.dataset.kuruldu) return;
    bolum.dataset.kuruldu = '1';

    var buyut = buyutecKur();
    var d = duyurulariKur(bolum);
    var g = galeriKur(bolum, buyut);

    if (!d) { var sd = bolum.querySelector('.gd-sol'); if (sd) sd.hidden = true; }
    if (!g) { var sg = bolum.querySelector('.gd-sag'); if (sg) sg.hidden = true; }
    if (!d && !g) bolum.hidden = true;
    if (!d || !g) bolum.classList.add('gd-tek');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', basla);
  } else {
    basla();
  }
})();
