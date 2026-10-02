/* ============================================================================
   KİTAPTAN KİTABA GEÇİŞ                        kitapsecici.js   (02.10.2026)
   ----------------------------------------------------------------------------
   Öğretmen: "bir flipbooktan diğer flipbooklara geçiş yapılabilmeli, şu an
   3 tane flipbook'umuz var."  → "soldaki kısım çok belirgin olmuyor, ayrıca
   kitapların kapağı da görünsün ve soldan açılsın panel."

   BÜTÜN FLIPBOOK'LARDA AYNI DOSYA. Tek kaynağı:
       _kaynak/ortak-kitap/kitapsecici.js
   Kitap klasöründeki kopyayı elle değiştirme — kopyalamada üstüne yazılır
   (_kaynak/uretici/kitapOrtakla.py).

   NASIL GÖRÜNÜYOR
   Üst çubuğun solundaki MARKA çerçeveli bir düğmeye dönüşüyor: solunda kitap
   yığını simgesi, sağında "değiştir ▾". Basınca panel SOLDAN kayarak açılıyor;
   her kitap KAPAĞIYLA listeleniyor, açık olan işaretli. Esc, ×, perde kapatır.
   Marka bulunamazsa modül üst çubuğa kendi düğmesini koyar.

   KAPAKLAR
   Her kitap klasöründe 300 px genişliğinde "kapak.webp" duruyor
   (_kaynak/uretici/kapakUret.py üretti). Yüklenemezse yerine kitabın
   renginde harf/rakam karesi çıkıyor — çevrimdışı kopyada da boş kalmaz.

   ADRESLER
   Bulunulan adreste "/kitap/" geçiyorsa bağlantılar ve kapaklar oradan
   kuruluyor (hem http hem file:// çalışır). Geçmiyorsa — Mac'teki ASIL
   klasör ya da flaşa indirilmiş tek kitap — siteye gider, panelde
   "çevrimdışı" notu çıkar.
   ========================================================================== */
(function () {
  'use strict';
  if (window.KitapSecici) return;

  /* Yeni kitap eklenince buraya bir satır yazmak yeter. */
  var KITAPLAR = [
    /* 5. sınıfın üç kitabı (02.10.2026): yeni Maarif kitabı asıl,
       2025-2026 baskısı ve 2024-2025 kitabı seçenek olarak duruyor. */
    /* guncel: bu öğretim yılında okutulan kitap — yılı renkli yazılır */
    { id: '5-sinif-2026-2027',    ad: 'Arapça 5',     alt: 'Maarif kitabı · 2026-2027',
      renk: '#16A085', im: '5', guncel: true },
    { id: '5-sinif-2025-2026',    ad: 'Arapça 5',     alt: 'Maarif kitabı · 2025-2026 baskısı',
      renk: '#13907A', im: '5' },
    { id: '5-sinif-2024-2025',    ad: 'Arapça 5',     alt: 'Önceki kitap · 2024-2025',
      renk: '#0E7C66', im: '5' },
    { id: '6-sinif-2026-2027',    ad: 'Arapça 6',     alt: 'Dijital ders kitabı · 2026-2027',
      renk: '#F39C12', im: '6', guncel: true },
    /* GİZLİ (02.10.2026): 7. sınıf Maarif kitabı resmî olarak yayınlanamıyor.
       Listede yalnız o kitabın içindeyken görünür; başka kitaptan bağlantı
       verilmez, site kartı da portala gider. */
    { id: '7-sinif-2027-2028',    ad: 'Arapça 7',     alt: 'Dijital ders kitabı · 2027-2028',
      renk: '#2563EB', im: '7', gizli: true },
    { id: 'kidef-arapca-2-baski', ad: 'Kidef Arapça', alt: '2. Baskı · flipbook',
      renk: '#E3A02A', im: 'K', asil: 'FLIPBOOK' }
  ];
  var SITE = 'https://kidefarapca.com/kitap/';

  function yol() { try { return decodeURIComponent(location.pathname); } catch (e) { return location.pathname; } }
  function kokDizin() {
    var y = yol(), i = y.lastIndexOf('/kitap/');
    return i >= 0 ? y.slice(0, i + 7) : null;
  }
  function kitapKok() { return kokDizin() || SITE; }
  function adres(k) { return kitapKok() + k.id + '/index.html'; }
  function kapak(k) { return kitapKok() + k.id + '/kapak.webp'; }
  function simdiki() {
    var y = yol();
    for (var i = 0; i < KITAPLAR.length; i++) {
      var k = KITAPLAR[i];
      if (y.indexOf('/' + k.id + '/') >= 0) return k;
      if (k.asil && y.indexOf('/' + k.asil + '/') >= 0) return k;
    }
    return null;
  }

  var IK_KITAPLAR =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M4 4.6h4a2 2 0 0 1 2 2v12.8a1.6 1.6 0 0 0-1.6-1.6H4Z"/>' +
    '<path d="M20 4.6h-4a2 2 0 0 0-2 2v12.8a1.6 1.6 0 0 1 1.6-1.6H20Z"/></svg>';

  /* ---------- biçimler (kitabın CSS'ine dokunulmuyor) ---------- */
  function stilKur() {
    if (document.getElementById('ksStil')) return;
    var s = document.createElement('style');
    s.id = 'ksStil';
    s.textContent =
      /* --- marka artık belirgin bir düğme --- */
      '.ust .marka.ks-marka{cursor:pointer;display:flex;align-items:center;gap:9px;' +
        'padding:5px 10px 5px 9px;border-radius:12px;' +
        'background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);' +
        'transition:background .15s,border-color .15s;}' +
      '.ust .marka.ks-marka:hover{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.45);}' +
      '.ust .marka.ks-marka:focus-visible{outline:2px solid rgba(255,255,255,.65);outline-offset:2px;}' +
      '.ust .marka.ks-marka:active{transform:scale(.98);}' +
      '.ks-kik{width:19px;height:19px;flex:none;color:var(--gold,#E3A02A);align-self:center;}' +
      '.ks-sag{display:inline-flex;align-items:center;gap:4px;flex:none;align-self:center;' +
        'padding:3px 8px;border-radius:99px;background:rgba(255,255,255,.14);' +
        'font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;' +
        'color:rgba(255,255,255,.88);white-space:nowrap;}' +
      '.ks-ok{font-size:9px;line-height:1;}' +
      /* 1200px: beş etiketli düğmeli kitapta (Kidef) "değiştir" yazısı
         markayı büyütüp düğmelerin altına sokuyordu; simge ve ▾ kalıyor. */
      '@media (max-width:1200px){.ks-sag .ks-yazi{display:none;}' +
        '.ks-sag{padding:3px 6px;}}' +
      '@media (max-width:480px){.ust .marka.ks-marka{gap:6px;padding:4px 6px;}.ks-kik{display:none;}}' +
      '.ks-tus svg{width:20px;height:20px;}' +

      /* --- perde + SOLDAN açılan panel --- */
      '.ks-perde{position:fixed;inset:0;z-index:9100;background:rgba(12,18,30,.55);' +
        'backdrop-filter:blur(2px);opacity:0;transition:opacity .22s;}' +
      '.ks-perde.gor{opacity:1;}' +
      '.ks-panel{position:fixed;top:0;bottom:0;left:0;z-index:9101;width:min(380px,90vw);' +
        'display:flex;flex-direction:column;background:#fff;color:#16324F;' +
        "font-family:'Segoe UI',Roboto,Helvetica,sans-serif;" +
        'box-shadow:18px 0 56px rgba(8,16,32,.38);' +
        'transform:translateX(-101%);transition:transform .3s cubic-bezier(.2,.8,.3,1);}' +
      '.ks-panel.gor{transform:none;}' +
      '.ks-bas{display:flex;align-items:center;gap:10px;padding:16px 16px 13px;' +
        'border-bottom:1px solid #E3E9F0;}' +
      '.ks-bas .ks-kik{width:22px;height:22px;color:#0E7C66;}' +
      '.ks-bas h2{flex:1;min-width:0;margin:0;font-size:1.05rem;font-weight:800;color:#0E7C66;}' +
      '.ks-kapat{flex:none;width:34px;height:34px;border:0;border-radius:10px;cursor:pointer;' +
        'background:#F1F5F9;color:#6B7A8C;font-size:1rem;line-height:1;}' +
      '.ks-kapat:hover{background:#E2E8F0;color:#16324F;}' +
      '.ks-govde{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;padding:14px;}' +
      '.ks-ust{margin:0 2px 12px;font-size:.84rem;line-height:1.5;color:#6B7A8C;}' +

      /* --- kitap kartları --- */
      '.ks-liste{display:grid;gap:10px;}' +
      '.ks-kitap{display:flex;align-items:center;gap:12px;padding:10px;border-radius:14px;' +
        'border:1.5px solid #E3E9F0;background:#fff;text-decoration:none;color:inherit;' +
        'transition:border-color .16s,background .16s,transform .16s;}' +
      '.ks-kitap:hover{transform:translateY(-1px);border-color:var(--ksr);background:#F8FAFC;}' +
      '.ks-kitap.acik{border-color:var(--ksr);background:#F6FAFF;' +
        'background:color-mix(in srgb,var(--ksr) 10%,#fff);cursor:default;transform:none;}' +
      /* kapak: gerçek resim; yüklenemezse altındaki harf karesi kalır */
      '.ks-kapak{position:relative;flex:none;width:58px;height:78px;border-radius:4px 8px 8px 4px;' +
        'overflow:hidden;background:var(--ksr);' +
        'box-shadow:inset 5px 0 0 rgba(0,0,0,.2),0 3px 10px rgba(16,26,46,.22);}' +
      '.ks-kapak img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;' +
        'display:block;opacity:0;transition:opacity .2s;}' +
      '.ks-kapak img.geldi{opacity:1;}' +
      '.ks-harf{position:absolute;inset:0;display:grid;place-items:center;color:#fff;' +
        'font-weight:800;font-size:1.5rem;}' +
      '.ks-mt{min-width:0;flex:1;}' +
      '.ks-mt b{display:block;font-size:1rem;font-weight:800;}' +
      '.ks-mt small{display:block;margin-top:2px;font-size:.82rem;color:#6B7A8C;line-height:1.4;}' +
      /* güncel kitabın yılı kitabın kendi renginde, hafif zeminli */
      '.ks-yil.simdi{color:var(--ksr);font-weight:800;background:color-mix(in srgb,var(--ksr) 13%,transparent);' +
      'padding:1px 7px;border-radius:99px;white-space:nowrap;}' +
      '@supports not (background:color-mix(in srgb,red 10%,transparent)){' +
      '.ks-yil.simdi{background:rgba(0,0,0,.055);}}' +
      '.ks-rozet{display:inline-block;margin-top:6px;font-size:.68rem;font-weight:800;' +
        'letter-spacing:.07em;text-transform:uppercase;padding:3px 9px;border-radius:99px;' +
        'background:var(--ksr);color:#fff;}' +
      '.ks-git{flex:none;color:var(--ksr);font-size:1.25rem;font-weight:800;padding-right:4px;}' +
      '.ks-not{margin:14px 2px 0;font-size:.8rem;line-height:1.5;color:#8A5A00;background:#FFF6E5;' +
        'border:1px solid #F3DCB2;border-radius:10px;padding:9px 11px;}' +
      '@media (prefers-reduced-motion:reduce){' +
        '.ks-panel,.ks-perde{transition:none;}.ks-kitap:hover{transform:none;}}';
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------- panel ---------- */
  var perde = null, panel = null;

  function kapat() {
    if (!panel) return;
    var pn = panel, pr = perde;
    panel = perde = null;
    pn.classList.remove('gor');
    if (pr) pr.classList.remove('gor');
    setTimeout(function () { pn.remove(); if (pr) pr.remove(); }, 320);
  }

  function ac() {
    if (panel) { kapat(); return; }
    stilKur();
    var simdi = simdiki(), yerel = !!kokDizin();
    /* gizli kitap yalnız içindeyken listelenir */
    var liste = KITAPLAR.filter(function (k) {
      return !k.gizli || (simdi && k.id === simdi.id);
    });

    perde = document.createElement('div');
    perde.className = 'ks-perde';
    perde.addEventListener('click', kapat);

    panel = document.createElement('aside');
    panel.className = 'ks-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Kitaplar');
    var h = '<div class="ks-bas"><span class="ks-kik">' + IK_KITAPLAR + '</span>' +
      '<h2>Kitaplar</h2>' +
      '<button class="ks-kapat" type="button" aria-label="Kapat">&times;</button></div>' +
      '<div class="ks-govde">' +
      '<p class="ks-ust">Hangi kitabı açalım? ' + liste.length +
      ' kitap da aynı motorla çalışıyor: dokununca büyütme, içindekiler, ' +
      'kaynaklar.</p><div class="ks-liste">';
    liste.forEach(function (k) {
      var bu = simdi && k.id === simdi.id;
      var ic = '<span class="ks-kapak"><span class="ks-harf">' + k.im + '</span>' +
        '<img alt="" loading="lazy" src="' + kapak(k) + '"></span>' +
        '<span class="ks-mt"><b></b><small></small>' +
        (bu ? '<span class="ks-rozet">şu an açık</span>' : '') + '</span>' +
        (bu ? '' : '<span class="ks-git">→</span>');
      h += bu
        ? '<div class="ks-kitap acik" style="--ksr:' + k.renk + '">' + ic + '</div>'
        : '<a class="ks-kitap" style="--ksr:' + k.renk + '" href="' + adres(k) + '">' + ic + '</a>';
    });
    h += '</div>';
    if (!yerel) {
      h += '<p class="ks-not"><b>Bu kopya çevrimdışı.</b> Öteki kitaplar ve kapak ' +
        'resimleri kidefarapca.com üzerinden gelir; internet gerekir.</p>';
    }
    h += '</div>';
    panel.innerHTML = h;

    /* adlar metin olarak yazılıyor; kapak gelince beliriyor */
    var kutular = panel.querySelectorAll('.ks-kitap');
    liste.forEach(function (k, i) {
      kutular[i].querySelector('b').textContent = k.ad;
      /* alt yazının son parçası yıl: güncel kitapta renkli rozet olur */
      var kucuk = kutular[i].querySelector('small');
      var p = k.alt.split(' · ');
      if (p.length > 1) {
        kucuk.textContent = p.slice(0, -1).join(' · ') + ' · ';
        var yil = document.createElement('span');
        yil.className = 'ks-yil' + (k.guncel ? ' simdi' : '');
        yil.textContent = p[p.length - 1];
        kucuk.appendChild(yil);
      } else {
        kucuk.textContent = k.alt;
      }
      var im = kutular[i].querySelector('img');
      im.addEventListener('load', function () { im.classList.add('geldi'); });
      im.addEventListener('error', function () { im.remove(); });   /* harf karesi kalsın */
      if (im.complete && im.naturalWidth) im.classList.add('geldi');
    });
    panel.querySelector('.ks-kapat').addEventListener('click', kapat);

    document.body.appendChild(perde);
    document.body.appendChild(panel);
    /* bir kare sonra sınıf: geçiş çalışsın */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (perde) perde.classList.add('gor');
        if (panel) panel.classList.add('gor');
      });
    });
    var kp = panel.querySelector('.ks-kapat');
    if (kp) setTimeout(function () { kp.focus({ preventScroll: true }); }, 120);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel) { e.stopPropagation(); kapat(); }
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
      m.insertAdjacentHTML('afterbegin', '<span class="ks-kik">' + IK_KITAPLAR + '</span>');
      m.insertAdjacentHTML('beforeend',
        '<span class="ks-sag"><span class="ks-yazi">değiştir</span>' +
        '<span class="ks-ok" aria-hidden="true">▾</span></span>');
      m.addEventListener('click', ac);
      m.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ac(); }
      });
      return;
    }
    if (document.getElementById('tKitaplar')) return;
    var cubuk = document.querySelector('.ust .araclar');
    if (!cubuk) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.id = 'tKitaplar';
    b.className = 'tus ks-tus';
    b.title = 'Başka bir kitaba geç';
    b.setAttribute('aria-label', 'Kitaplar');
    b.innerHTML = IK_KITAPLAR;
    b.addEventListener('click', ac);
    cubuk.insertBefore(b, document.getElementById('tTamEkran') || cubuk.lastChild);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
  else kur();

  window.KitapSecici = { ac: ac, kapat: kapat, kitaplar: function () { return KITAPLAR.slice(); } };
})();
