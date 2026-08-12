/* =====================================================================
   KIDEF · SINIF MODÜL KAYITÇISI       (sistem/sinifmodul.js)
   ---------------------------------------------------------------------
   AMAÇ
   Bir modülün (Bilgi Yarışması, Muhâdese, Sözlük…) TEK bir HTML dosyası
   olsun; veriler sınıfa göre değişsin. Tasarım/iskelet değişince tek
   dosya düzenlenir, her sınıf için ayrı kopya tutulmaz.

   NASIL ÇALIŞIR
   İmam Hatip akordiyonundaki her sınıfın ".ih-kartlar[data-sinif=N]"
   kutusu vardır. Bu dosya, kayıtlı her modüle "N. sınıfın verisi var mı?"
   diye sorar; varsa o sınıfın kartını basar, yoksa hiç basmaz. Kart
   tıklanınca modülün TEK html'i "?sinif=N" ile açılır ve o sayfa kendi
   verisini sınıfa göre seçer.

   ⚠️ YENİ KART EKLEMEK — tek yer, tek nesne:
      KidefSinifModul.ekle({
        id:       'sozluk',                       // benzersiz
        ad:       'Sözlük Yarışı',
        sira:     30,                             // küçük olan solda
        renk:     '#7C3AED',                      // rozet/çerçeve rengi (isteğe bağlı)
        aciklama: function (s) { return s + '. Sınıf kelimeleri'; },
        svg:      function () { return '<svg …></svg>'; },
        veriVar:  function (s) { return {rozet:'12 Kelime'} },  // null → kart ÇIKMAZ
        url:      function (s) { return 'sozluk.html?sinif=' + s; }
      });
      Kart otomatik olarak İmam Hatip akordiyonundaki tüm sınıflarda
      denenir; yalnız verisi olan sınıflarda görünür.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefSinifModul) return;

  var KAYIT = [];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function cagir(v, s) {
    try { return (typeof v === 'function') ? v(s) : v; } catch (e) { return null; }
  }
  function sayi(s) { var n = parseInt(s, 10); return isFinite(n) ? n : 0; }

  /* ---------------- Kayıt defteri ---------------- */
  function ekle(t) {
    if (!t || !t.id) return;
    sil(t.id);
    if (typeof t.sira !== 'number') t.sira = 50;
    KAYIT.push(t);
    KAYIT.sort(function (a, b) { return (a.sira - b.sira) || (a.id < b.id ? -1 : 1); });
  }
  function sil(id) {
    for (var i = KAYIT.length - 1; i >= 0; i--) if (KAYIT[i].id === id) KAYIT.splice(i, 1);
  }
  function liste() { return KAYIT.slice(); }

  /* Bir sınıfın kartları — veriVar() null döndüren modül atlanır */
  function kartlar(sinif) {
    var n = sayi(sinif), cikti = [];
    if (!n) return cikti;
    KAYIT.forEach(function (t) {
      var v = cagir(t.veriVar, n);
      if (!v) return;
      if (v === true) v = {};
      cikti.push({
        id:       t.id,
        ad:       cagir(t.ad, n) || t.id,
        aciklama: cagir(t.aciklama, n) || '',
        rozet:    v.rozet || cagir(t.rozet, n) || 'Başla',
        pasif:    !!v.pasif,
        renk:     v.renk || t.renk || '',
        svg:      cagir(t.svg, n) || '',
        url:      cagir(t.url, n) || '#',
        veri:     v
      });
    });
    return cikti;
  }

  /* ---------------- HTML ---------------- */
  function kartHtml(k) {
    var stil = k.renk ? ' style="--smrenk:' + esc(k.renk) + '"' : '';
    return '<a href="' + esc(k.url) + '" target="_blank" rel="opener"' + stil +
      ' class="game-card kss-card sm-kart" data-smodul="' + esc(k.id) + '">' +
      '<div class="default-game-content">' +
      '<div class="default-game-emoji">' + (k.svg || '') + '</div>' +
      '<h3>' + esc(k.ad) + '</h3>' +
      '<span class="game-card-description">' + esc(k.aciklama) + '</span>' +
      '<span class="status-badge ' + (k.pasif ? 'bekliyor' : 'available') + '">' + esc(k.rozet) + '</span>' +
      '</div></a>';
  }
  function html(sinif) {
    return kartlar(sinif).map(kartHtml).join('');
  }

  /* ---------------- Yerleştirme ----------------
     mount = .ih-kartlar[data-sinif=N]. İçindeki .game-grid'in SONUNA
     eklenir; Muhâdese kartı ve açılır ders paneli olduğu gibi kalır.
     Aynı mount'a ikinci kez çağrılırsa önce eskiler temizlenir. */
  function yerlestir(mount, sinif) {
    if (!mount) return 0;
    var n = sayi(sinif != null ? sinif : mount.getAttribute('data-sinif'));
    if (!n) return 0;
    var kod = html(n);
    var grid = mount.querySelector('.game-grid');
    if (!grid) {
      if (!kod) return 0;
      grid = document.createElement('div');
      grid.className = 'game-grid mobile-scroll-grid-single';
      mount.insertBefore(grid, mount.firstChild);
    }
    [].forEach.call(grid.querySelectorAll('[data-smodul]'), function (x) {
      if (x.parentNode) x.parentNode.removeChild(x);
    });
    if (kod) grid.insertAdjacentHTML('beforeend', kod);
    return grid.querySelectorAll('[data-smodul]').length;
  }

  /* Tüm İmam Hatip sınıflarına uygula */
  function kur(kok) {
    var alan = kok || document;
    var mountlar = alan.querySelectorAll('#imam-hatip .ih-kartlar[data-sinif]');
    var toplam = 0;
    [].forEach.call(mountlar, function (m) { toplam += yerlestir(m, m.getAttribute('data-sinif')); });
    return toplam;
  }

  /* ---------------- Ortak stil (index.css'e dokunulmaz) ---------------- */
  function stilKur() {
    if (document.getElementById('smStil')) return;
    var s = document.createElement('style');
    s.id = 'smStil';
    s.textContent =
      '.sm-kart{position:relative;}' +
      '.sm-kart .status-badge{white-space:nowrap;}' +
      '.sm-kart[style*="--smrenk"] .status-badge.available{background:var(--smrenk);border-color:var(--smrenk);}' +
      '.sm-kart .kg{width:100%;height:100%;display:block;overflow:visible;}' +
      /* Sözlük kartı: satırlar sırayla beliriyor, mercek kökün üstünde
         geziniyor. Kartların öbür canlandırmaları index.html'de; bu
         modülün kendi kartı kendi stilini getirsin diye burada. */
      '.sm-kart .kga-satir{animation:smSatir 3.2s ease-in-out infinite;}' +
      '.sm-kart .kga-satir.s2x{animation-delay:.35s;}' +
      '.sm-kart .kga-satir.s3x{animation-delay:.7s;}' +
      '@keyframes smSatir{0%,100%{opacity:.2}45%,65%{opacity:1}}' +
      '.sm-kart .kga-mercek{transform-origin:50% 50%;animation:smMercek 3.2s ease-in-out infinite;}' +
      '@keyframes smMercek{0%,100%{transform:translate(0,0)}35%{transform:translate(-13px,-9px)}' +
      '60%{transform:translate(-13px,-9px)}}' +
      '@media (prefers-reduced-motion: reduce){' +
      '.sm-kart .kga-satir,.sm-kart .kga-mercek{animation:none;}' +
      '.sm-kart .kga-satir{opacity:1;}}';
    (document.head || document.documentElement).appendChild(s);
  }

  window.KidefSinifModul = {
    ekle: ekle, sil: sil, liste: liste,
    kartlar: kartlar, html: html,
    yerlestir: yerlestir, kur: kur, stilKur: stilKur
  };

  /* =====================================================================
     KAYITLI MODÜLLER
     ===================================================================== */

  /* ---- 1) BİLGİ YARIŞMASI ----
     Verisi: sistem/sinifveri.js → KidefSinifVeri.biyKonulari(N)
     Hedef : bilgiyarismasikacom.html?sinif=N&konu=<ilk konu>
             (sayfa açılışta sınıf süzgecini ve konuyu kendi seçer) */
  function biySvg() {
    return '<svg viewBox="0 0 64 64" class="kg" aria-hidden="true">' +
      /* Zil dalgalari solda ikili: sag taraf soru balonuna ait */
      '<g stroke="#F39C12" stroke-width="2.6" fill="none" stroke-linecap="round">' +
        '<path class="kga-dalga" d="M14 26 a12 12 0 0 1 4-8.4"/>' +
        '<path class="kga-dalga g2x" d="M7 28 a19 19 0 0 1 6.4-13.4"/>' +
      '</g>' +
      '<g class="kga-parla">' +
        '<circle cx="46" cy="15" r="10" fill="#fff" stroke="#2563EB" stroke-width="2.6"/>' +
        '<path d="M42.5 12.2 a3.7 3.7 0 0 1 6.8 2 c0 2.2-3 2.4-3 4.5" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<circle cx="46.2" cy="21.4" r="1.7" fill="#2563EB"/>' +
      '</g>' +
      '<rect x="9" y="45" width="46" height="9.5" rx="4.75" fill="#0E9E86"/>' +
      '<rect x="14" y="41" width="36" height="6" rx="3" fill="#16A085"/>' +
      '<g class="kga-parmak">' +
        '<path d="M18 42 a14 14 0 0 1 28 0 Z" fill="#EE5253"/>' +
        '<path d="M23.5 39 a9 9 0 0 1 7.5-6.6" stroke="rgba(255,255,255,.8)" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '</g>' +
      '</svg>';
  }

  ekle({
    id: 'bilgiyarismasi',
    ad: 'Bilgi Yarışması',
    sira: 20,
    renk: '#EE5253',
    svg: biySvg,
    aciklama: function (s) { return 'Canlı sınıf yarışması — ' + s + '. Sınıf soruları'; },
    veriVar: function (s) {
      var v = window.KidefSinifVeri;
      if (!v || !v.biyKonulari) return null;
      var k = v.biyKonulari(s);
      if (!k.length) return null;
      /* Artık sınıf başına TEK konu var (kelime + cümle birlikte), bu yüzden
         "1 Konu Hazır" demek anlamsız; rozette soru sayısı yazar. */
      var n = 0;
      for (var i = 0; i < k.length; i++) n += (v.biyKonu[k[i]] && v.biyKonu[k[i]].soru) || 0;
      return { rozet: n ? n + ' Soru Hazır' : 'Sorular Hazır', konular: k };
    },
    url: function (s) {
      var v = window.KidefSinifVeri;
      var ilk = (v && v.biyIlkKonu) ? v.biyIlkKonu(s) : null;
      return 'bilgiyarismasikacom.html?sinif=' + encodeURIComponent(s) +
             (ilk ? '&konu=' + encodeURIComponent(ilk) : '') +
             '&kaynak=index&yer=imam-hatip';
    }
  });

  /* ---- 2) SÖZLÜK SİMÜLASYONU ----
     Verisi: sozluk/veri/sozluk_N.js (muhadese ders cümlelerinden üretildi)
             → sistem/sinifveri.js → KidefSinifVeri.sozlukSinif(N)
     Hedef : sozluksimulasyonu.html?sinif=N
             (sayfa açılışta o sınıfın verisini ve seviyelerini kendi kurar)
     Kart, verisi OLMAYAN sınıfta hiç basılmaz — 6 ve 8'de muhâdese
     cümlesi bulunmadığı için orada görünmez. */
  function sozSvg() {
    return '<svg viewBox="0 0 64 64" class="kg" aria-hidden="true">' +
      /* Açık sözlük: iki sayfa, ortada sırt */
      '<path d="M32 18c-5-3.6-11-4.8-17-3.4v30c6-1.4 12-.2 17 3.4" fill="#fff" stroke="#7C3AED" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="M32 18c5-3.6 11-4.8 17-3.4v30c-6-1.4-12-.2-17 3.4" fill="#F5F3FF" stroke="#7C3AED" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="M32 18v30" stroke="#7C3AED" stroke-width="2.2"/>' +
      /* Satırlar sırayla beliriyor: "madde aranıyor" duygusu */
      '<g stroke="#A78BFA" stroke-width="2" stroke-linecap="round">' +
        '<path class="kga-satir" d="M21 25h7"/>' +
        '<path class="kga-satir s2x" d="M21 31h9"/>' +
        '<path class="kga-satir s3x" d="M36 25h7"/>' +
      '</g>' +
      /* Mercek: kökü bulan göz */
      '<g class="kga-mercek">' +
        '<circle cx="40" cy="38" r="9" fill="rgba(255,255,255,.9)" stroke="#5B21B6" stroke-width="2.8"/>' +
        '<path d="M46.6 44.6 53 51" stroke="#5B21B6" stroke-width="3.2" stroke-linecap="round"/>' +
      '</g>' +
      '</svg>';
  }

  ekle({
    id: 'sozluk',
    ad: 'Sözlük Simülasyonu',
    sira: 30,
    renk: '#7C3AED',
    svg: sozSvg,
    aciklama: function (s) { return 'Kelimenin yalın hâlini bul — ' + s + '. Sınıf cümleleri'; },
    veriVar: function (s) {
      var v = window.KidefSinifVeri;
      if (!v || !v.sozlukSinif) return null;
      var d = v.sozlukSinif(s);
      if (!d) return null;
      return { rozet: d.cumle + ' Cümle Hazır', seviye: d.seviye };
    },
    url: function (s) {
      return 'sozluksimulasyonu.html?sinif=' + encodeURIComponent(s) +
             '&kaynak=index&yer=imam-hatip';
    }
  });

  /* ---- Sonraki kartlar buraya: aynı kalıpla ekle({...}) ---- */

  stilKur();
})();
