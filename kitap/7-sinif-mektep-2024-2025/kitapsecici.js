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

   SİTEYE DÖN (18.10.2026) — öğretmen: "flipbooklardan kidef arapça siteye
   dönen bi tuş ta ekleyelim kitap seçme kısmının üstünde olsun, basınca
   flip book sekmesi kapansa zaten siteden gelindiği için site anasayfa
   görünür". Kitap seçme düğmesinin ÜSTÜNDE (yan çubukta; telefonun tek
   satırlık üst şeridinde solunda, ev simgesi) "Kidef Arapça · siteye dön".
   · Kitap siteden yeni sekmede açıldıysa (site sekmesi hâlâ açık): sekme
     kapanır, arkadaki site görünür.
   · Kapanamıyorsa (kitap doğrudan açıldı, site sekmesi kapanmış, tahtanın
     çerçevesinde açık): aynı sekmede sitenin ana sayfası açılır. Site
     dışındaki kopyada (Mac'teki asıl klasör, flaş) kidefarapca.com.
   ========================================================================== */
/* AYRI SEKME (23.10.2026, öğretmen: "tüm flipbooklar ayrı sekmede açılsın"):
   listedeki öbür kitaplar YENİ SEKMEDE açılır (açık kitap yerinde kalır); tahta
   kabuğunda kabuk onu kendi çerçevesinde açar, tahta da izler. «Siteye dön»
   kitaptan açılan kitapta da sitenin sekmesini bulur (açanların zincirinde). */
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
    /* 7. sınıf (04.11.2026): MEB Devlet Kitapları'nın kitabı — bu yıl okutulan kitap.
       Sayfaları ve sesleri kidefarapca-materyal-7 deposunda (7-sinif-devlet-2026-2027). */
    { id: '7-sinif-devlet-2026-2027', ad: 'Arapça 7', alt: 'Devlet Kitapları · 2026-2027',
      renk: '#2980B9', im: '7', guncel: true },
    /* 7. sınıf Mektep Yayınları kitabı (17.10.2026): 2025-2026'da okutulmuştu; seçenek
       olarak duruyor (klasörü 7-sinif-2026-2027 adıyla kaldı). Sayfaları ve sesleri
       kidefarapca-materyal-7 deposunda. */
    { id: '7-sinif-2026-2027',    ad: 'Arapça 7',     alt: 'Mektep Yayınları · 2025-2026',
      renk: '#2471A3', im: '7' },
    /* 7. sınıf Mektep Yayınları'nın 2024-2025 kitabı (22.11.2026): aynı kitabın ön/arka kapaklı paketi +
       ünite testleri, sunular, cevap anahtarı. Sayfaları kidefarapca-materyal-7 deposunda
       (7-sinif-mektep-2024-2025); sesleri 2025-2026 kitabının klasöründen çalar. */
    { id: '7-sinif-mektep-2024-2025', ad: 'Arapça 7', alt: 'Mektep Yayınları · 2024-2025',
      renk: '#1F618D', im: '7' },
    /* GİZLİ (02.10.2026): 7. sınıf Maarif kitabı resmî olarak yayınlanamıyor.
       Listede yalnız o kitabın içindeyken görünür; başka kitaptan bağlantı
       verilmez, site kartı da portala gider. */
    { id: '7-sinif-2027-2028',    ad: 'Arapça 7',     alt: 'Dijital ders kitabı · 2027-2028',
      renk: '#2563EB', im: '7', gizli: true },
    /* 8. sınıf (17.10.2026): İmam Hatip Ortaokulu, MEB'in 2026-2027 kitabı.
       Sayfaları, sesleri ve videoları kidefarapca-materyal-8 deposunda. */
    { id: '8-sinif-2026-2027',    ad: 'Arapça 8',     alt: 'İmam Hatip Ortaokulu · 2026-2027',
      renk: '#6D4C41', im: '8', guncel: true },
    /* 9. sınıf (17.10.2026): Anadolu İmam Hatip Lisesi, MEB'in güncel 2026-2027 kitabı */
    { id: '9-sinif-2026-2027',    ad: 'Arapça 9',     alt: 'Anadolu İmam Hatip Lisesi · 2026-2027',
      renk: '#8E44AD', im: '9', guncel: true },
    /* 10. sınıf (17.10.2026): Anadolu İmam Hatip Lisesi, MEB'in güncel 2026-2027
       kitabı. Sayfaları, sesleri ve videoları kidefarapca-materyal-10 deposunda. */
    { id: '10-sinif-2026-2027',   ad: 'Arapça 10',    alt: 'Anadolu İmam Hatip Lisesi · 2026-2027',
      renk: '#C0392B', im: '10', guncel: true },
    /* KİDEF'LE! (14.11.2026): 5-10. sınıf ders kitaplarının uzun diyalog ve metinleri — kelime kelime Türkçesi, kök çalışması */
    { id: 'metinlerle-arapca',    ad: 'Metinlerle Arapça', alt: 'Metin tahlilleri · 5-10. sınıf',
      renk: '#17817E', im: 'M' },
    { id: 'kidef-arapca-2-baski', ad: 'Kidef Arapça', alt: '2. Baskı · flipbook',
      renk: '#E3A02A', im: 'K', asil: 'FLIPBOOK' }
  ];
  var SITE = 'https://kidefarapca.com/kitap/';
  var SITE_ANA = 'https://kidefarapca.com/';

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
  var IK_SITE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3.6 10.8 12 4l8.4 6.8"/><path d="M5.9 9.3V20h4.3v-5.4h3.6V20h4.3V9.3"/></svg>';

  /* ---------- siteye dön ---------- */
  /* sitenin ana sayfası: kitap sitenin içindeyse (internetteki site ya da
     bilgisayardaki site kopyası) oradaki index.html, değilse kidefarapca.com */
  function siteAdresi() {
    var h = location.href.split('#')[0].split('?')[0], i = h.lastIndexOf('/kitap/');
    return i >= 0 ? h.slice(0, i + 1) + 'index.html' : SITE_ANA;
  }
  /* bu sekmeyi sitenin bir sekmesi mi açtı (ve o sekme hâlâ açık mı)? Kitap
     başka bir kitaptan açıldıysa (23.10.2026: kitaplar ayrı sekmede) açanların
     zincirinde geriye gidilir: o kitabı da site açmışsa sitenin sekmesi o. */
  function siteSekmesi() {
    try {
      var o = window.opener;
      for (var i = 0; o && i < 8; i++) {
        if (o.closed || o.location.origin !== location.origin) return null;   /* başka sitenin açtığı sekme kapanmaz */
        if (!/\/kitap\//.test(o.location.pathname)) return o;             /* sitenin sekmesi */
        o = o.opener;                                                       /* kitabı açan kitap: onun açanı */
      }
    } catch (e) { }
    return null;
  }
  function siteyeDon(e) {
    if (e) e.preventDefault();
    var hedef = siteAdresi(), ustte = true;
    try { ustte = window.top === window.self; } catch (x) { ustte = false; }
    var site = ustte ? siteSekmesi() : null;
    if (site) {
      /* siteden açılan sekme: kapanır, arkadaki site görünür */
      try { site.focus(); } catch (x) { }
      try { window.close(); } catch (x) { }
      if (window.closed) return;
      setTimeout(function () { if (!window.closed) location.href = hedef; }, 350);
      return;
    }
    location.href = hedef;              /* kapanamaz: sitenin ana sayfası bu sekmede */
  }
  function donusKur(m) {
    if (document.getElementById('ksDon')) return;
    var ust = document.querySelector('.ust');
    if (!ust) return;
    var b = document.createElement('a');
    b.id = 'ksDon';
    b.className = 'ks-don';
    b.href = siteAdresi();
    b.title = 'Kidef Arapça sitesine dön';
    b.setAttribute('aria-label', 'Kidef Arapça sitesine dön');
    b.innerHTML = IK_SITE + '<span class="ks-don-yazi"><b>Kidef Arapça</b><small>siteye dön</small></span>';
    b.addEventListener('click', siteyeDon);
    if (m && m.parentNode === ust) ust.insertBefore(b, m);
    else ust.insertBefore(b, ust.firstChild);
    /* telefonda ev düğmesi kitap adından yer alır: ad simge çekilince sığacaksa simge çekilir */
    var z = null;
    window.addEventListener('resize', function () { clearTimeout(z); z = setTimeout(markaSigdir, 120); });
    try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(markaSigdir); } catch (e) { }
    setTimeout(markaSigdir, 60);
  }
  function markaSigdir() {
    var m = document.querySelector('.ust .marka.ks-marka');
    if (!m) return;
    m.classList.remove('ks-sik');
    var b = m.querySelector('b'), ik = m.querySelector('.ks-kik');
    if (!b || !ik || window.innerWidth >= 760) return;
    var tasan = b.scrollWidth - b.clientWidth;
    if (tasan > 1 && tasan <= ik.offsetWidth + 10) m.classList.add('ks-sik');
  }

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

      /* --- siteye dön: telefonun üst şeridinde yalnız ev simgesi (kitap
             seçmenin solunda), yan çubukta kitap seçmenin üstünde yazılı --- */
      '.ks-don{flex:none;display:inline-flex;align-items:center;justify-content:center;gap:9px;' +
        'height:38px;min-width:38px;padding:0 9px;border-radius:12px;box-sizing:border-box;' +
        'text-decoration:none;color:#0E7C66;background:rgba(22,160,133,.1);' +
        'border:1px solid rgba(22,160,133,.28);cursor:pointer;-webkit-tap-highlight-color:transparent;' +
        'transition:background .15s,color .15s,border-color .15s;}' +
      '.ks-don:hover{background:#16A085;border-color:#16A085;color:#fff;}' +
      '.ks-don:focus-visible{outline:2px solid #16A085;outline-offset:2px;}' +
      '.ks-don:active{transform:scale(.98);}' +
      '.ks-don svg{width:19px;height:19px;flex:none;}' +
      '.ks-don-yazi{display:none;}' +
      '@media (min-width:760px){' +
        'html.yanli .ks-don{width:100%;height:auto;min-height:42px;justify-content:flex-start;' +
          'padding:6px 10px;flex:0 0 auto;}' +
        'html.yanli .ks-don-yazi{display:flex;flex-direction:column;min-width:0;line-height:1.18;text-align:left;}' +
        'html.yanli .ks-don-yazi b{font-size:13px;font-weight:800;white-space:nowrap;' +
          'overflow:hidden;text-overflow:ellipsis;}' +
        'html.yanli .ks-don-yazi small{font-size:10.5px;font-weight:700;opacity:.82;}' +
        'html.yanli.dar .ks-don{width:38px;height:38px;min-height:0;padding:0;' +
          'justify-content:center;align-self:center;}' +
        'html.yanli.dar .ks-don-yazi{display:none;}' +
      '}' +
      /* dar telefonda kitap adı sığsın: ev düğmesi küçülür; ad yine taşıyorsa ve
         simge çekilince sığacaksa kitap kartındaki simge çekilir (markaSigdir) */
      'html .ust .marka.ks-marka.ks-sik .ks-kik{display:none;}' +
      '@media (max-width:380px){.ks-don{min-width:34px;height:34px;padding:0 7px;}}' +

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
      /* --- KİDEF'LE! (14.11.2026): metni olan sayfada altta düğme --- */
      '.kd-kutu{position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:45;display:flex;' +
        'flex-wrap:wrap;justify-content:center;gap:10px;max-width:calc(100vw - 32px);pointer-events:none;}' +
      '.kd-tus{pointer-events:auto;position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:10px;' +
        'min-height:50px;box-sizing:border-box;padding:7px 18px 7px 8px;border-radius:99px;text-decoration:none;' +
        'color:#fff;background:var(--kdr,#17817E);background:linear-gradient(135deg,var(--kdr,#17817E),' +
        'color-mix(in srgb,var(--kdr,#17817E) 72%,#0B3B3A));font-family:inherit;' +
        'box-shadow:0 10px 24px rgba(8,40,40,.32),inset 0 1px 0 rgba(255,255,255,.28);' +
        '-webkit-tap-highlight-color:transparent;touch-action:manipulation;' +
        'animation:kdGel .42s cubic-bezier(.2,1.5,.4,1) both;transition:transform .15s,box-shadow .15s;}' +
      '.kd-tus:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(8,40,40,.38),inset 0 1px 0 rgba(255,255,255,.28);}' +
      '.kd-tus:active{transform:scale(.97);}' +
      '.kd-tus:focus-visible{outline:3px solid #F5C04A;outline-offset:3px;}' +
      '.kd-tus::after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:40%;pointer-events:none;' +
        'background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);' +
        'animation:kdParla 4.5s ease-in-out 1s infinite;}' +
      '.kd-ik{flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;' +
        'background:#fff;color:var(--kdr,#17817E);box-shadow:0 2px 6px rgba(0,0,0,.18);}' +
      '.kd-ik svg{width:20px;height:20px;}' +
      '.kd-ik .kd-yildiz{color:#E3A02A;transform-origin:19.2px 13.9px;animation:kdYildiz 2.4s ease-in-out infinite;}' +
      '.kd-yazi{display:flex;flex-direction:column;min-width:0;line-height:1.15;text-align:left;}' +
      '.kd-yazi b{font-size:16px;font-weight:800;letter-spacing:.01em;white-space:nowrap;}' +
      '.kd-yazi small{font-size:11.5px;font-weight:600;opacity:.92;white-space:nowrap;overflow:hidden;' +
        'text-overflow:ellipsis;max-width:62vw;}' +
      '.kd-tus.kd-ters{color:var(--kdr);background:#fff;border:2px solid var(--kdr);' +
        'box-shadow:0 10px 24px rgba(16,26,46,.22);}' +
      '.kd-tus.kd-ters .kd-ik{background:var(--kdr);color:#fff;}' +
      '.kd-tus.kd-ters::after{background:linear-gradient(100deg,transparent,rgba(0,0,0,.06),transparent);}' +
      '@keyframes kdGel{from{opacity:0;transform:translateY(14px) scale(.9);}to{opacity:1;transform:none;}}' +
      '@keyframes kdParla{0%,70%{left:-60%;}100%{left:130%;}}' +
      '@keyframes kdYildiz{0%,100%{transform:scale(1) rotate(0);}50%{transform:scale(1.35) rotate(45deg);}}' +
      '@media (max-width:480px){.kd-tus{min-height:44px;padding:5px 14px 5px 6px;gap:8px;}' +
        '.kd-ik{width:30px;height:30px;}.kd-yazi b{font-size:14px;}.kd-yazi small{font-size:10.5px;}}' +
      '@media (prefers-reduced-motion:reduce){.kd-tus,.kd-tus::after,.kd-ik .kd-yildiz{animation:none;}}' +
      '@media print{.kd-kutu{display:none;}}' +
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
        : '<a class="ks-kitap" style="--ksr:' + k.renk + '" href="' + adres(k) + '" target="_blank" rel="opener">' + ic + '</a>';
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
    [].forEach.call(panel.querySelectorAll('a.ks-kitap'), function (a) {
      a.addEventListener('click', function () { setTimeout(kapat, 60); });   /* kitap yeni sekmede: bu sekmede panel kapanır */
    });

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

  /* ---------- KİDEF'LE! (14.11.2026) ----------
     Öğretmen: "7. sınıf 26. sayfa metin tahlili 7. sınıf flipbookunda sayfa 26'ya gelince bi tuş görünsün ...
     buna Kidef'le! diye bi tuş olabilir". Sınıf kitabında metni olan basılı sayfa ekrandayken sayfanın altında
     «Kidef'le!» düğmesi: Metinlerle Arapça o metnin sayfasında açılır. Metinlerle Arapça'da tersi: «Ders kitabında».
     Ekrandaki sayfalar #sayfaEt'ten okunur (sınıf kitabında basılı numara, Metinlerle Arapça'da yaprak).
     KIDEFLE: ders kitabı → [basılı sayfa, Metinlerle Arapça yaprağı, başlık] — _kaynak/uretici/kidefleKur.py yazdı. */
  var KIDEFLE_KITAP = 'metinlerle-arapca';
  var KIDEFLE = {
    '5-sinif-2026-2027': [[147,4,"Oğlum ve Kızım"],[164,5,"Kardeşlerim"],[185,6,"Evim"],[212,7,"Güzel Evim"]],
    '6-sinif-2026-2027': [[26,9,"Akrabalarım"],[44,10,"Ailem ve Meslekleri"],[68,11,"Okulum"],[82,12,"Okulum · Süleyman"],[111,13,"Vücudun Organları"],[116,14,"Duyularım"],[154,15,"Hava Nasıl?"],[181,16,"Hava ve Kıyafet"]],
    '7-sinif-devlet-2026-2027': [[17,18,"Haydi Oynayalım"],[26,19,"Öğretmenlerimiz"],[36,20,"Hayallerimiz"],[43,21,"Bakkalda"],[52,22,"Kırtasiyede"],[60,23,"Semt Pazarında"],[74,24,"Bugün Hava Nasıl?"],[83,25,"Haydi Kardan Adam Yapalım"],[91,26,"Yaz Mevsimi"],[102,27,"İstanbul"],[112,28,"Çanakkale Destanı"],[120,29,"Selahaddin Eyyubi"],[123,30,"Örnek Şahsiyetler"],[135,31,"Sabah Namazı"],[142,32,"Teravih Namazı"],[143,33,"Oruç"],[150,34,"Dinî Bayramlarda Âdetlerimiz"],[158,35,"Cep Telefonu"],[166,36,"İnternet Kesintisi"],[170,37,"Mektup ve İnternet"]],
    '8-sinif-2026-2027': [[10,39,"Kulüpler"],[18,40,"Tiyatro Oyunu"],[26,41,"Gezi"],[36,42,"Kitap Okuma"],[44,43,"Kitap Fuarında"],[48,44,"Durakta"],[52,45,"El Sanatları Fuarında"],[62,46,"Hasta Arkadaşımı Ziyaret"],[70,47,"Güzel Sınıfımız"],[78,48,"Bayram Gününde"],[88,49,"Çevre Temizliği"],[96,50,"Hayvanlar"],[106,51,"Afetler"],[112,52,"Afetlere Hazırlık"],[116,53,"Sporu Seviyorum"],[126,54,"Spor Yapıyorum"],[134,55,"Sporlar"],[138,56,"Engelli Sporları"],[144,57,"Mezuniyet Töreni"],[152,58,"Arkadaşlara Veda"],[160,59,"Tatil"]],
    '9-sinif-2026-2027': [[54,61,"Nerelisin?"],[66,62,"Arkadaşım"],[84,63,"Sınıfım Güzel"],[86,64,"Sınıfta"],[130,65,"Anne ve Babanın Mesleği"],[138,66,"Aile ve Meslekler"],[150,67,"Evin Bölümleri"],[157,68,"Meryem'in Odası"],[174,69,"Asım ve Kız Kardeşi"],[177,70,"Öğretmen ve Öğrenciler"],[180,71,"Dün Ne Yaptın?"],[191,72,"Öğle Yemeğinde"],[195,73,"Lokantada"]],
    '10-sinif-2026-2027': [[20,75,"Ailem"],[26,76,"İki Eski Arkadaş"],[40,77,"İslam'da Bayramlar"],[46,78,"Müslümanların Özellikleri"],[66,79,"Vücut Sağlığı"],[74,80,"Selman Hasta"],[89,81,"Çünkü Onu Seviyorum"],[96,82,"Hobin Ne?"],[114,83,"Vatanım Türkiye"],[120,84,"Suriye'nin Başkenti"],[136,85,"Marmara Oteli Nerede?"],[142,86,"Umre Yolculuğu"],[160,87,"Kıyafetler"],[166,88,"Tatil"],[180,89,"Alışveriş Merkezinde İndirimler"],[188,90,"Giyim Mağazasında"]]
  };
  var IK_KIDEFLE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><path d="M6 3h7.5L18 7.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>' +
    '<path d="M13.5 3v4.5H18"/><path d="M8.5 12h6M8.5 15.5h4"/>' +
    '<path class="kd-yildiz" d="M19.2 11.6l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" fill="currentColor" stroke="none"/></svg>';
  function kitapBul(id) { for (var i = 0; i < KITAPLAR.length; i++) if (KITAPLAR[i].id === id) return KITAPLAR[i]; return null; }
  function kidefleTur() {
    var k = simdiki(); if (!k) return null;
    if (k.id === KIDEFLE_KITAP) return 'ters';
    return KIDEFLE[k.id] ? k.id : null;
  }
  function kidefleHedefler(tur) {
    var e = document.getElementById('sayfaEt'), h = [];
    var g = ((e && e.textContent) || '').match(/\d+/g) || [];
    g = g.map(Number);
    if (tur === 'ters') {
      Object.keys(KIDEFLE).forEach(function (id) {
        var kt = kitapBul(id);
        KIDEFLE[id].forEach(function (x) {
          if (g.indexOf(x[1]) < 0) return;
          h.push({ href: kitapKok() + id + '/index.html?s=' + x[0], b: 'Ders kitabında',
            s: (kt ? kt.ad : '') + ' · s. ' + x[0], renk: kt ? kt.renk : '#17817E', ad: x[2], n: x[1] });
        });
      });
    } else {
      KIDEFLE[tur].forEach(function (x) {
        if (g.indexOf(x[0]) < 0) return;
        h.push({ href: kitapKok() + KIDEFLE_KITAP + '/index.html?s=' + x[1], b: "Kidef'le!",
          s: x[2] + ' · metin tahlili', renk: '#17817E', ad: x[2], n: x[0] });
      });
    }
    h.sort(function (a, b) { return b.n - a.n; });   /* sağdan sola kitap: sağdaki sayfanın düğmesi sağda */
    return h;
  }
  var kdKutu = null, kdSon = null;
  function kidefleYer() {
    if (!kdKutu) return;
    var f = document.querySelector('.alt'), alt = 16;
    if (f) { var r = f.getBoundingClientRect(); if (r.height && r.top < window.innerHeight && getComputedStyle(f).display !== 'none') alt = Math.max(16, window.innerHeight - r.top + 12); }
    kdKutu.style.bottom = alt + 'px';
  }
  function kidefleCiz() {
    var tur = kidefleTur(); if (!tur) return;
    var h = kidefleHedefler(tur), imza = JSON.stringify(h);
    if (imza === kdSon) { kidefleYer(); return; }
    kdSon = imza;
    if (!kdKutu) {
      kdKutu = document.createElement('div'); kdKutu.id = 'ksKidefle'; kdKutu.className = 'kd-kutu';
      document.body.appendChild(kdKutu);
    }
    kdKutu.innerHTML = '';
    h.forEach(function (x) {
      var a = document.createElement('a');
      a.className = 'kd-tus' + (tur === 'ters' ? ' kd-ters' : '');
      a.href = x.href; a.target = '_blank'; a.rel = 'opener';
      a.style.setProperty('--kdr', x.renk);
      a.title = tur === 'ters' ? x.ad + ' — ders kitabının sayfasında aç' : x.ad + ' — Metinlerle Arapça\'da kelime kelime çalış';
      a.innerHTML = '<span class="kd-ik">' + (tur === 'ters' ? IK_KITAPLAR : IK_KIDEFLE) + '</span>' +
        '<span class="kd-yazi"><b></b><small></small></span>';
      a.querySelector('b').textContent = x.b;
      a.querySelector('small').textContent = x.s;
      kdKutu.appendChild(a);
    });
    kdKutu.classList.toggle('gor', h.length > 0);
    kidefleYer();
  }
  function kidefleKur() {
    if (!kidefleTur() || document.getElementById('ksKidefle')) return;
    var e = document.getElementById('sayfaEt'); if (!e) return;
    try { new MutationObserver(kidefleCiz).observe(e, { childList: true, characterData: true, subtree: true }); } catch (x) { }
    window.addEventListener('resize', kidefleYer);
    kidefleCiz();
  }

  /* ---------- markayı düğmeye çevir ---------- */
  function kur() {
    stilKur();
    kidefleKur();                      /* KİDEF'LE! (14.11.2026) */
    var m = document.querySelector('.ust .marka');
    donusKur(m);                       /* siteye dön: kitap seçmenin üstünde */
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

  window.KitapSecici = { ac: ac, kapat: kapat, kitaplar: function () { return KITAPLAR.slice(); },
    siteyeDon: siteyeDon };
})();
