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
      '.sm-kart .kg{width:100%;height:100%;display:block;overflow:visible;}';
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
      return { rozet: k.length + (k.length > 1 ? ' Konu Hazır' : ' Konu Hazır'), konular: k };
    },
    url: function (s) {
      var v = window.KidefSinifVeri;
      var ilk = (v && v.biyIlkKonu) ? v.biyIlkKonu(s) : null;
      return 'bilgiyarismasikacom.html?sinif=' + encodeURIComponent(s) +
             (ilk ? '&konu=' + encodeURIComponent(ilk) : '') +
             '&kaynak=index&yer=imam-hatip';
    }
  });

  /* ---- Sonraki kartlar buraya: aynı kalıpla ekle({...}) ---- */

  stilKur();
})();
