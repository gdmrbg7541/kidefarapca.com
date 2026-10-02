/* ============================================================================
   KİTAPTAN KİTABA GEÇİŞ                        kitapsecici.js   (02.10.2026)
   ----------------------------------------------------------------------------
   Öğretmen: "bir flipbooktan diğer flipbooklara geçiş yapılabilmeli, şu an
   3 tane flipbook'umuz var."

   BÜTÜN FLIPBOOK'LARDA AYNI DOSYA. Tek kaynağı:
       _kaynak/ortak-kitap/kitapsecici.js
   Kitap klasöründeki kopyayı elle değiştirme — kopyalamada üstüne yazılır
   (_kaynak/uretici/kitapOrtakla.py).

   NASIL GÖRÜNÜYOR
   Üst çubuğun solundaki MARKA (kitabın adı) düğmeye dönüşüyor: yanında küçük
   bir ▾ beliriyor, basınca "Hangi kitabı açalım?" penceresi çıkıyor. Üç kitap
   da listelenir; açık olan işaretli ve tıklanmaz. Marka bulunamazsa üst
   çubuğa kendi düğmesini koyar (#tTamEkran'ın soluna).

   ADRESLER
   Üç kitap da sitede "kitap/<klasör>/index.html" altında. Bulunduğumuz
   adreste "/kitap/" geçiyorsa bağlantılar ona göre kuruluyor (hem http hem
   file:// çalışır). Geçmiyorsa — Mac'teki ASIL klasör ya da flaşa indirilmiş
   tek kitap — bağlantılar siteye gider ve "internet gerekir" notu çıkar.

   Kitabın HTML'ine yalnız <script> satırı eklenir; biçimler burada.
   ========================================================================== */
(function () {
  'use strict';
  if (window.KitapSecici) return;

  /* Yeni kitap eklenince buraya bir satır yazmak yeter. */
  var KITAPLAR = [
    { id: '5-sinif-2026-2027',    ad: 'Arapça 5',     alt: 'Dijital ders kitabı · 2026-2027',
      renk: '#16A085', im: '5' },
    { id: '6-sinif-2026-2027',    ad: 'Arapça 6',     alt: 'Dijital ders kitabı · 2026-2027',
      renk: '#F39C12', im: '6' },
    { id: 'kidef-arapca-2-baski', ad: 'Kidef Arapça', alt: '2. Baskı · flipbook',
      renk: '#E3A02A', im: 'K', asil: 'FLIPBOOK' }
  ];
  var SITE = 'https://kidefarapca.com/kitap/';

  function yol() { try { return decodeURIComponent(location.pathname); } catch (e) { return location.pathname; } }
  function kokDizin() {
    var y = yol(), i = y.lastIndexOf('/kitap/');
    return i >= 0 ? y.slice(0, i + 7) : null;
  }
  function adres(k) {
    var kd = kokDizin();
    return kd ? kd + k.id + '/index.html' : SITE + k.id + '/index.html';
  }
  function simdiki() {
    var y = yol();
    for (var i = 0; i < KITAPLAR.length; i++) {
      var k = KITAPLAR[i];
      if (y.indexOf('/' + k.id + '/') >= 0) return k;
      if (k.asil && y.indexOf('/' + k.asil + '/') >= 0) return k;
    }
    return null;
  }

  /* ---------- biçimler (kitabın CSS'ine dokunulmuyor) ---------- */
  function stilKur() {
    if (document.getElementById('ksStil')) return;
    var s = document.createElement('style');
    s.id = 'ksStil';
    s.textContent =
      /* marka artık düğme: imleç ve küçük ok */
      '.ust .marka.ks-marka{cursor:pointer;border-radius:10px;padding:3px 8px;margin-left:-8px;' +
        'transition:background .15s;}' +
      '.ust .marka.ks-marka:hover,.ust .marka.ks-marka:focus-visible{background:rgba(255,255,255,.12);}' +
      '.ust .marka.ks-marka:focus-visible{outline:2px solid rgba(255,255,255,.5);outline-offset:1px;}' +
      '.ks-ok{font-size:11px;opacity:.75;margin-left:2px;flex:none;}' +
      '.ks-tus svg{width:20px;height:20px;}' +
      /* pencere */
      '.ks-perde{position:fixed;inset:0;z-index:9100;display:grid;place-items:center;padding:18px;' +
        'background:rgba(12,18,30,.62);backdrop-filter:blur(3px);animation:ksGel .18s ease both;}' +
      '.ks-perde[hidden]{display:none;}' +
      '@keyframes ksGel{from{opacity:0}to{opacity:1}}' +
      '.ks-kutu{position:relative;width:min(540px,100%);max-height:calc(100dvh - 36px);overflow:auto;' +
        '-webkit-overflow-scrolling:touch;background:#fff;color:#16324F;border-radius:20px;' +
        'padding:clamp(18px,2.4vw,26px);box-shadow:0 24px 70px rgba(8,16,32,.45);' +
        "font-family:'Segoe UI',Roboto,Helvetica,sans-serif;" +
        'animation:ksCik .22s cubic-bezier(.2,.9,.3,1) both;}' +
      '@keyframes ksCik{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}' +
      '.ks-kutu h2{margin:0 0 4px;font-size:clamp(1.15rem,2vw,1.5rem);font-weight:800;color:#0E7C66;}' +
      '.ks-kutu .ks-ust{margin:0 0 16px;font-size:.9rem;color:#6B7A8C;line-height:1.5;}' +
      '.ks-kapat{position:absolute;top:12px;right:12px;width:34px;height:34px;border:0;border-radius:10px;' +
        'background:#F1F5F9;color:#6B7A8C;font-size:1rem;line-height:1;cursor:pointer;}' +
      '.ks-kapat:hover{background:#E2E8F0;color:#16324F;}' +
      /* kitap satırları */
      '.ks-liste{display:grid;gap:10px;}' +
      '.ks-kitap{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:14px;' +
        'border:1.5px solid #E3E9F0;background:#fff;text-decoration:none;color:inherit;' +
        'transition:border-color .16s,background .16s,transform .16s;}' +
      '.ks-kitap:hover{transform:translateY(-1px);border-color:var(--ksr);background:#F8FAFC;}' +
      '.ks-kitap.acik{border-color:var(--ksr);background:#F6FAFF;' +
        'background:color-mix(in srgb,var(--ksr) 10%,#fff);' +
        'cursor:default;transform:none;}' +
      '.ks-sim{flex:none;width:44px;height:56px;border-radius:5px 9px 9px 5px;display:grid;' +
        'place-items:center;background:var(--ksr);color:#fff;font-weight:800;font-size:1.3rem;' +
        'box-shadow:inset 4px 0 0 rgba(0,0,0,.18),0 3px 8px rgba(16,26,46,.18);}' +
      '.ks-mt{min-width:0;flex:1;}' +
      '.ks-mt b{display:block;font-size:1.02rem;font-weight:800;}' +
      '.ks-mt small{display:block;margin-top:2px;font-size:.84rem;color:#6B7A8C;}' +
      '.ks-rozet{flex:none;font-size:.74rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;' +
        'padding:5px 10px;border-radius:99px;background:var(--ksr);color:#fff;}' +
      '.ks-git{flex:none;color:var(--ksr);font-size:1.2rem;font-weight:800;}' +
      '.ks-not{margin:14px 2px 0;font-size:.82rem;line-height:1.5;color:#8A5A00;background:#FFF6E5;' +
        'border:1px solid #F3DCB2;border-radius:10px;padding:9px 12px;}' +
      '@media (max-width:520px){.ks-kutu{border-radius:16px;}.ks-sim{width:38px;height:48px;font-size:1.1rem;}' +
        '.ks-rozet{display:none;}}' +
      '@media (prefers-reduced-motion:reduce){.ks-perde,.ks-kutu{animation:none;}' +
        '.ks-kitap:hover{transform:none;}}';
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------- pencere ---------- */
  var perde = null;
  function kapat() { if (perde) { perde.remove(); perde = null; } }
  function ac() {
    if (perde) { kapat(); return; }
    stilKur();
    var simdi = simdiki(), yerel = !!kokDizin();
    var h = '<div class="ks-kutu" role="dialog" aria-modal="true" aria-label="Kitap seç">' +
      '<button class="ks-kapat" type="button" aria-label="Kapat">&times;</button>' +
      '<h2>Hangi kitabı açalım?</h2>' +
      '<p class="ks-ust">Üç dijital kitap da aynı motorla çalışıyor: dokununca büyütme, ' +
      'içindekiler, kaynaklar.</p><div class="ks-liste">';
    KITAPLAR.forEach(function (k) {
      var bu = simdi && k.id === simdi.id;
      var ic = '<span class="ks-sim">' + k.im + '</span>' +
        '<span class="ks-mt"><b></b><small></small></span>' +
        (bu ? '<span class="ks-rozet">şu an açık</span>' : '<span class="ks-git">→</span>');
      h += bu
        ? '<div class="ks-kitap acik" style="--ksr:' + k.renk + '">' + ic + '</div>'
        : '<a class="ks-kitap" style="--ksr:' + k.renk + '" href="' + adres(k) + '">' + ic + '</a>';
    });
    h += '</div>';
    if (!yerel) {
      h += '<p class="ks-not"><b>Bu kopya çevrimdışı.</b> Öteki kitaplar ' +
        'kidefarapca.com üzerinden açılır; internet gerekir.</p>';
    }
    h += '</div>';

    perde = document.createElement('div');
    perde.className = 'ks-perde';
    perde.innerHTML = h;
    /* adlar metin olarak yazılıyor (HTML'e gömülmüyor) */
    var kutular = perde.querySelectorAll('.ks-kitap');
    KITAPLAR.forEach(function (k, i) {
      kutular[i].querySelector('b').textContent = k.ad;
      kutular[i].querySelector('small').textContent = k.alt;
    });
    perde.addEventListener('click', function (e) {
      if (e.target === perde || e.target.closest('.ks-kapat')) { e.preventDefault(); kapat(); }
    });
    document.body.appendChild(perde);
    var kp = perde.querySelector('.ks-kapat');
    if (kp) setTimeout(function () { kp.focus({ preventScroll: true }); }, 60);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && perde) { e.stopPropagation(); kapat(); }
  }, true);

  /* ---------- markayı düğmeye çevir ---------- */
  function kur() {
    stilKur();
    var m = document.querySelector('.ust .marka');
    if (m && !m.getAttribute('data-ks')) {
      m.setAttribute('data-ks', '1');
      m.classList.add('ks-marka');
      m.setAttribute('role', 'button');
      m.setAttribute('tabindex', '0');
      m.title = 'Başka bir kitaba geç';
      m.insertAdjacentHTML('beforeend', '<span class="ks-ok" aria-hidden="true">▾</span>');
      m.addEventListener('click', ac);
      m.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ac(); }
      });
      return;
    }
    /* marka yoksa: üst çubuğa kendi düğmesi */
    if (document.getElementById('tKitaplar')) return;
    var cubuk = document.querySelector('.ust .araclar');
    if (!cubuk) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.id = 'tKitaplar';
    b.className = 'tus ks-tus';
    b.title = 'Başka bir kitaba geç';
    b.setAttribute('aria-label', 'Kitaplar');
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 4.5h4.2a2 2 0 0 1 2 2V19a1.6 1.6 0 0 0-1.6-1.6H4Z"/>' +
      '<path d="M20 4.5h-4.2a2 2 0 0 0-2 2V19a1.6 1.6 0 0 1 1.6-1.6H20Z"/></svg>';
    b.addEventListener('click', ac);
    var once = document.getElementById('tTamEkran') || cubuk.lastChild;
    cubuk.insertBefore(b, once);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
  else kur();

  window.KitapSecici = { ac: ac, kapat: kapat, kitaplar: function () { return KITAPLAR.slice(); } };
})();
