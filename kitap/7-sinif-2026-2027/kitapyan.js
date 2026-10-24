/* ============================================================
   YAN ARAÇ ÇUBUĞU — üstteki şeridi sola taşır              02.10.2026
   Öğretmen: "kitap iki sayfa açıkken çok küçük duruyor, yukardaki tüm
   araç çubukları sola alalım kitap seçme kısmının altına, açılıp
   kapanabilir olsun."

   Biçimin tamamı kitapyan.css'te; burada yalnız üç iş var:
     1) <html>'e "yanli" sınıfı — CSS devreye girer (yalnız ≥760 px'te),
     2) alttaki şeridin içi (ünite/ders bilgisi, ilerleme çizgisi, sayaç,
        "sayfaya git") yan çubuğun altına taşınır, alt şerit kalkar;
        yakınlaştırma üçlüsü bir kutuya girer, yazısız düğmelere
        aria-label'dan yazı eklenir,
     3) en alta aç/kapat düğmesi (Y tuşu da yapar), seçim hatırlanır.
   Dört kitapta da aynı sınıf adları kullanıldığı için tek dosya yetiyor.
   ============================================================ */
(function () {
  'use strict';
  var ANAHTAR = 'kitap_yanDar';

  var IK_KAPAT = '<svg viewBox="0 0 24 24"><path d="M14.5 7.5 10 12l4.5 4.5"/>' +
    '<path d="M4 4v16"/></svg>';

  function yaz(el, metin) {
    var s = document.createElement('span');
    s.className = 'yan-et';
    s.textContent = metin;
    el.appendChild(s);
  }

  /* aria-label'ı uzun olan birkaç düğme için kısa ad (yan çubuğa sığsın) */
  var KISA = {
    tIpucu: 'Düğmeler', tTamEkran: 'Tam ekran', tUzaklas: 'Uzaklaş', tYaklas: 'Yaklaş',
    tYardim: 'Yardım', tNasil: 'Nasıl kullanılır'
  };

  /* title'daki "(I)" gibi kısayol ekini at: "İçindekiler (I)" → "İçindekiler" */
  function etiket(b) {
    if (b.id && KISA[b.id]) return KISA[b.id];
    var t = b.getAttribute('aria-label') || b.getAttribute('title') || '';
    t = t.replace(/\s*\([^)]*\)\s*$/, '').trim();
    return t.length > 17 ? t.split(/[\/,]/)[0].trim() : t;   /* "Düğmeleri göster/gizle" gibi */
  }

  function kur() {
    var ust = document.querySelector('.ust');
    var araclar = ust && ust.querySelector('.araclar');
    if (!ust || !araclar || ust.dataset.yanli) return;
    ust.dataset.yanli = '1';
    document.documentElement.classList.add('yanli');

    /* 1 — alt şeridin içi yan çubuğa: ünite/ders, ilerleme çizgisi, sayfaya git
           (öğretmen: "aşağıdaki ilerleme çizgisini de sola alalım daha kısa olsun")
           Alt şerit boşalınca CSS onu kaldırıyor, kitap o 44 px'i de kazanıyor.
           DAR EKRANDA (telefon) yan çubuk yok: parçalar eski yerine döner,
           yoksa üst şeride sığmayıp taşıyorlar. */
    var alt = document.querySelector('.alt');
    var ilerleme = document.createElement('div');
    ilerleme.className = 'yan-ilerleme';
    ust.appendChild(ilerleme);

    var tasinir = [];                       /* {el, anne, komsu} — eski yeri */
    ['.konum', '.kaydirac', '.git'].forEach(function (se) {
      var n = (ust.querySelector(se) || (alt && alt.querySelector(se)));
      if (n) tasinir.push({ el: n, anne: n.parentNode, komsu: n.nextSibling });
    });

    function yerlestir(yan) {
      tasinir.forEach(function (k) {
        if (yan) {
          if (k.el.parentNode !== ilerleme) ilerleme.appendChild(k.el);
        } else if (k.el.parentNode !== k.anne) {
          k.anne.insertBefore(k.el, k.komsu);
        }
      });
      if (alt) alt.classList.toggle('yan-bos', !!yan && !!ilerleme.children.length);
    }

    var genis = window.matchMedia('(min-width: 760px)');
    yerlestir(genis.matches);
    var dinle = function (e) { yerlestir(e.matches); window.dispatchEvent(new Event('resize')); };
    if (genis.addEventListener) genis.addEventListener('change', dinle);
    else genis.addListener(dinle);

    /* 2 — yakınlaştırma üçlüsü tek kutuda kalsın */
    var eksi = araclar.querySelector('#tUzaklas'),
        olcu = araclar.querySelector('#zoomEt'),
        arti = araclar.querySelector('#tYaklas');
    if (eksi && arti) {
      var kutu = document.createElement('div');
      kutu.className = 'yan-zoom';
      araclar.insertBefore(kutu, eksi);
      kutu.appendChild(eksi);
      if (olcu) kutu.appendChild(olcu);
      kutu.appendChild(arti);
    }

    /* 3 — yazısız düğmelere yazı */
    araclar.querySelectorAll('.tus').forEach(function (b) {
      if (b.querySelector('span')) return;
      var t = etiket(b);
      if (t) yaz(b, t);
    });

    /* 4 — aç/kapat */
    var d = document.createElement('button');
    d.type = 'button';
    d.className = 'yan-kapat';
    d.innerHTML = IK_KAPAT + '<span>Daralt</span>';
    ust.appendChild(d);

    function uygula(dar, kaydet) {
      document.documentElement.classList.toggle('dar', dar);
      d.title = (dar ? 'Araç çubuğunu genişlet' : 'Araç çubuğunu daralt') + ' (Y)';
      d.setAttribute('aria-label', d.title);
      d.lastChild.textContent = 'Daralt';
      if (kaydet) { try { localStorage.setItem(ANAHTAR, dar ? '1' : '0'); } catch (e) {} }
      /* kitap yeni ene göre yeniden ölçeklensin */
      window.dispatchEvent(new Event('resize'));
    }

    var basla = false;
    try { basla = localStorage.getItem(ANAHTAR) === '1'; } catch (e) {}
    uygula(basla, false);

    d.addEventListener('click', function () {
      uygula(!document.documentElement.classList.contains('dar'), true);
    });

    /* Y: daralt/genişlet — yazı kutusundayken karışmasın */
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var h = document.activeElement;
      if (h && (h.tagName === 'INPUT' || h.tagName === 'TEXTAREA' || h.isContentEditable)) return;
      if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        uygula(!document.documentElement.classList.contains('dar'), true);
      }
    });
  }

  /* ---------- panellerde iki parmakla kaydırma yedeği ----------
     Bazı tarayıcılarda (Safari) panel gövdesi tekerlek/iki parmak
     olayına yanıt vermiyor. Burada olay sonrası bir kare beklenip
     kutunun GERÇEKTEN kayıp kaymadığına bakılıyor; kaymadıysa o kutu
     bundan sonra elle kaydırılıyor. Çalışan tarayıcıda hiçbir şey
     değişmez, momentum bozulmaz. */
  var KUTULAR = '.panel .pgovde, .panel .cevap-alan, .ks-panel .ks-govde, .ust';

  function kaydirabilir(g, d) {
    if (d > 0) return g.scrollTop + g.clientHeight < g.scrollHeight - 1;
    if (d < 0) return g.scrollTop > 1;
    return false;
  }

  function piksel(e) {
    if (e.deltaMode === 1) return e.deltaY * 16;        /* satır */
    if (e.deltaMode === 2) return e.deltaY * 400;       /* sayfa */
    return e.deltaY;
  }

  function kutuKur(g) {
    if (g.dataset.kaydirmaYedegi) return;
    g.dataset.kaydirmaYedegi = '1';
    var elle = false;
    g.addEventListener('wheel', function (e) {
      var d = piksel(e);
      if (!kaydirabilir(g, d)) return;                  /* kenardayız: sayfaya bırak */
      if (elle) {
        e.preventDefault();
        g.scrollTop += d;
        return;
      }
      var onceki = g.scrollTop;
      /* İKİ kare: Safari kaydırmayı kendi katmanında yaptığı için bir kare
         sonra scrollTop henüz değişmemiş olabiliyordu (02.10.2026). */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (g.scrollTop === onceki) {                 /* tarayıcı kaydırmadı */
            elle = true;
            g.scrollTop = onceki + d;
          }
        });
      });
    }, { passive: false });
  }

  /* Parmak gövdenin dışındayken (başlık, kenar boşluğu) de gövde kaysın */
  function panelKur(pa) {
    if (pa.dataset.kaydirmaPanel) return;
    pa.dataset.kaydirmaPanel = '1';
    pa.addEventListener('wheel', function (e) {
      var g = pa.querySelector('.pgovde, .cevap-alan, .ks-govde');
      if (!g || g === e.target || g.contains(e.target)) return;   /* gövde kendi dinler */
      var d = piksel(e);
      if (!kaydirabilir(g, d)) return;
      e.preventDefault();
      g.scrollTop += d;
    }, { passive: false });
  }

  function kaydirmaYedegi() {
    document.querySelectorAll(KUTULAR).forEach(kutuKur);
    document.querySelectorAll('.panel, .ks-panel').forEach(panelKur);
  }

  /* paneller sonradan da açılabiliyor (kitap seçici gibi): gözle */
  function gozle() {
    kaydirmaYedegi();
    if (!window.MutationObserver) return;
    new MutationObserver(function () { kaydirmaYedegi(); })
      .observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- ileri/geri oklarının ikizi sol kenarda ----------
     Öğretmen: "ileri geri tuşu sol tarafta da olsun."
     Düğme çoğaltılmıyor, kopyalanıyor: tıklama aslına iletiliyor, pasif
     durumu aslını izliyor. Sayfa çevirme mantığına dokunulmuyor. */
  function okIkizle() {
    if (document.querySelector('.ok.ikiz')) return;
    var ana = document.querySelectorAll('.ok.sol, .ok.sag');
    for (var n = 0; n < ana.length; n++) {
      (function (o) {
        if (o.classList.contains('ikiz')) return;
        var i = o.cloneNode(true);
        i.removeAttribute('id');
        i.classList.add('ikiz');
        i.disabled = o.disabled;
        i.addEventListener('click', function (e) { e.preventDefault(); o.click(); });
        o.parentNode.insertBefore(i, o.nextSibling);
        if (window.MutationObserver) {
          new MutationObserver(function () { i.disabled = o.disabled; })
            .observe(o, { attributes: true, attributeFilter: ['disabled'] });
        }
      })(ana[n]);
    }
  }

  /* ---------- eşler birlikte vurgulansın ----------
     Öğretmen: "bi ileri tuşuna basınca diğerine de basmış gibi vurgu olsun."
     Aynı işi yapan oklar (ileri ↔ ileri, geri ↔ geri) birbirinin
     üzerine gelme/basılma durumunu paylaşıyor. */
  function okEslestir() {
    var hepsi = document.querySelectorAll('.ok.sol, .ok.sag');
    function esleri(o) {
      var tur = o.classList.contains('sag') ? 'sag' : 'sol';
      var d = [];
      for (var i = 0; i < hepsi.length; i++) {
        if (hepsi[i] !== o && hepsi[i].classList.contains(tur)) d.push(hepsi[i]);
      }
      return d;
    }
    function isaret(o, sinif, var_) {
      var d = esleri(o);
      for (var i = 0; i < d.length; i++) d[i].classList[var_ ? 'add' : 'remove'](sinif);
    }
    for (var n = 0; n < hepsi.length; n++) {
      (function (o) {
        if (o.dataset.esli) return;
        o.dataset.esli = '1';
        o.addEventListener('pointerenter', function () { isaret(o, 'es-vurgu', 1); });
        o.addEventListener('focus', function () { isaret(o, 'es-vurgu', 1); });
        ['pointerleave', 'pointercancel', 'blur'].forEach(function (e) {
          o.addEventListener(e, function () { isaret(o, 'es-vurgu', 0); isaret(o, 'es-basili', 0); });
        });
        o.addEventListener('pointerdown', function () { isaret(o, 'es-basili', 1); });
        ['pointerup', 'pointercancel'].forEach(function (e) {
          o.addEventListener(e, function () {
            setTimeout(function () { isaret(o, 'es-basili', 0); }, 130);
          });
        });
      })(hepsi[n]);
    }
  }

  function basla() { kur(); gozle(); okIkizle(); okEslestir(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', basla);
  } else {
    basla();
  }
})();

/* ============================================================
   İNDİR YALNIZ GİRİŞ YAPANLARA                            17.10.2026
   Öğretmen: "flipbooklardaki indir özelliğine siteye giriş yapanlar
   sahip olsun" · 18.10.2026: "siteye giriş yapmayanlara 5-10 arası
   kitapları flipbookları indirme seçeneği görünmesin flipbook
   motorunda".

   Kitap sitenin içinde (kidefarapca.com/kitap/…) açıldığında, siteye
   giriş yapılmamışsa "İndir" düğmesi (flaş/bilgisayar paketi) ve
   Kaynaklar listesindeki tek tek "İndir" bağlantıları HİÇ GÖRÜNMEZ.
   Giriş anlaşılana kadar da gizli durur (bir an görünüp kaybolmaz);
   girişliyse belirir. Giriş yapıp bu sekmeye dönünce kendiliğinden
   görünür. Kitabı okumak, sesleri ve videoları açmak herkese açık.

   Giriş nereden anlaşılıyor: site Firebase'le giriş yapıyor; Firebase
   oturumu aynı sitedeki tarayıcı deposunda tutuyor (IndexedDB
   "firebaseLocalStorageDb", oturumluk girişte sessionStorage). Kitap
   sayfası Firebase'i yüklemeden yalnız orayı okur; misafir (anonim)
   kimlik giriş sayılmaz. Depo yoksa hiçbir şey OLUŞTURULMAZ.
   Bilgisayardan (file://) açılan indirilmiş kopyada gizleme yok.
   ============================================================ */
(function () {
  'use strict';
  if (location.protocol === 'file:') return;
  var kok = document.documentElement;
  var izin = null;                                    /* null: henüz bilinmiyor */
  /* başta gizli: giriş anlaşılınca açılır */
  try {
    var st = document.createElement('style');
    st.id = 'ikStil';
    st.textContent = 'html.ik-girissiz #tIndir, html.ik-girissiz #pIndir,' +
      ' html.ik-girissiz a[download]:not([href^="blob:"]):not([href^="data:"]){display:none !important}';
    (document.head || kok).appendChild(st);
  } catch (e) { }
  kok.classList.add('ik-girissiz');

  function depodaVar(depo) {
    try {
      for (var i = 0; i < depo.length; i++) {
        var k = depo.key(i);
        if (k && k.indexOf('firebase:authUser:') === 0) {
          var v = JSON.parse(depo.getItem(k) || 'null');
          if (v && v.uid && !v.isAnonymous) return true;
        }
      }
    } catch (e) { }
    return false;
  }
  function girisVarMi() {
    return new Promise(function (bitir) {
      var oldu = false;
      function son(v) { if (!oldu) { oldu = true; bitir(v); } }
      try { if (depodaVar(window.localStorage) || depodaVar(window.sessionStorage)) return son(true); } catch (e) { }
      if (!window.indexedDB) return son(false);
      setTimeout(function () { son(false); }, 3000);
      var r;
      try { r = indexedDB.open('firebaseLocalStorageDb'); } catch (e) { return son(false); }
      /* depo yoksa açmak onu oluşturur — oluşturmadan vazgeç */
      r.onupgradeneeded = function () { try { r.transaction.abort(); } catch (e) { } };
      r.onerror = function (e) { try { e.preventDefault(); } catch (x) { } son(false); };
      r.onblocked = function () { son(false); };
      r.onsuccess = function () {
        var db = r.result;
        try {
          if (!db.objectStoreNames.contains('firebaseLocalStorage')) { db.close(); return son(false); }
          var c = db.transaction('firebaseLocalStorage', 'readonly').objectStore('firebaseLocalStorage').openCursor();
          c.onsuccess = function () {
            var k = c.result;
            if (!k) { db.close(); return son(false); }
            var x = k.value || {}, v = x.value;
            if (String(x.fbase_key || k.key || '').indexOf('firebase:authUser:') === 0 && v && v.uid && !v.isAnonymous) {
              db.close(); return son(true);
            }
            k.continue();
          };
          c.onerror = function () { db.close(); son(false); };
        } catch (e) { try { db.close(); } catch (x) { } son(false); }
      };
    });
  }

  /* gizliyken bir yoldan tıklanırsa (ör. kalan bir kısayol) yine açılmasın */
  document.addEventListener('click', function (e) {
    if (izin === true || !e.target || !e.target.closest) return;
    var a = e.target.closest('a[download]');
    if (a && /^(blob|data):/i.test(a.getAttribute('href') || '')) a = null;   /* hazırlanan ZIP'in kendisi */
    if (e.target.closest('#tIndir') || a) {
      e.preventDefault(); e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
  }, true);

  function tazele() {
    girisVarMi().then(function (v) {
      izin = v;
      kok.classList.toggle('ik-girissiz', !v);
    });
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tazele(); });
  window.addEventListener('focus', tazele);
  window.addEventListener('pageshow', tazele);
  tazele();
})();

/* ============================================================
   DENEME HAKLARI (24.10.2026)
   Öğretmen: "kitap flipbook indirme ve kalem kullanma ... bunlarda hak
   verilsin öğretmenlere denemeleri için". Kitap sitenin içinde
   (kidefarapca.com/kitap/…) açıldığında sitenin sistem/hak.js'i yüklenir:
   destek vermeyen öğretmene İndir panelindeki paketlerde ve Kalem'de
   haftada 5 deneme hakkı (düğmede küçük sayı, basınca 5 → 4). Kimin
   girişli olduğu sitenin oturum deposundan okunur (Firebase yüklenmez);
   girişli değilse hiçbir şey sınırlanmaz. Bilgisayara indirilmiş kopyada
   (file://) yok.
   ============================================================ */
(function () {
  'use strict';
  if (location.protocol === 'file:') return;
  var yol = location.pathname, i = yol.indexOf('/kitap/');
  if (i < 0) return;
  var kok = yol.slice(0, i + 1);
  function depodan(depo) {
    try {
      for (var j = 0; j < depo.length; j++) {
        var k = depo.key(j);
        if (k && k.indexOf('firebase:authUser:') === 0) {
          var v = JSON.parse(depo.getItem(k) || 'null');
          if (v && v.uid && !v.isAnonymous) return v.uid;
        }
      }
    } catch (e) { }
    return '';
  }
  function hesap() {
    return new Promise(function (bitir) {
      var oldu = false;
      function son(v) { if (!oldu) { oldu = true; bitir(v || ''); } }
      var y = '';
      try { y = depodan(window.localStorage) || depodan(window.sessionStorage); } catch (e) { }
      if (y) return son(y);
      if (!window.indexedDB) return son('');
      setTimeout(function () { son(''); }, 3000);
      var r;
      try { r = indexedDB.open('firebaseLocalStorageDb'); } catch (e) { return son(''); }
      r.onupgradeneeded = function () { try { r.transaction.abort(); } catch (e) { } };
      r.onerror = function (e) { try { e.preventDefault(); } catch (x) { } son(''); };
      r.onblocked = function () { son(''); };
      r.onsuccess = function () {
        var db = r.result;
        try {
          if (!db.objectStoreNames.contains('firebaseLocalStorage')) { db.close(); return son(''); }
          var c = db.transaction('firebaseLocalStorage', 'readonly').objectStore('firebaseLocalStorage').openCursor();
          c.onsuccess = function () {
            var k = c.result;
            if (!k) { db.close(); return son(''); }
            var x = k.value || {}, v = x.value;
            if (String(x.fbase_key || k.key || '').indexOf('firebase:authUser:') === 0 && v && v.uid && !v.isAnonymous) { db.close(); return son(v.uid); }
            k.continue();
          };
          c.onerror = function () { db.close(); son(''); };
        } catch (e) { try { db.close(); } catch (x) { } son(''); }
      };
    });
  }
  function bildir() {
    if (!window.KidefHak) return;
    hesap().then(function (u) { window.KidefHak.uid(u); });
  }
  function hazir() {
    if (!window.KidefHak) return;
    window.KidefHak.destekAdresi(kok + 'index.html#destek');
    bildir();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) bildir(); });
    window.addEventListener('pageshow', bildir);
  }
  if (window.KidefHak) { hazir(); return; }
  var s = document.createElement('script');
  var d = new Date();
  s.src = kok + 'sistem/hak.js?t=' + d.getFullYear() + (d.getMonth() + 1) + d.getDate();
  s.async = true;
  s.onload = hazir;
  (document.head || document.documentElement).appendChild(s);
})();

/* ============================================================
   VİDEO · ETKİNLİK: TAM EKRAN VE YENİ SEKME                 22.10.2026
   Öğretmen: "FLİPBOOK MOTORUNDA VİDEO VE ETKİNLİKLERDE TAM EKRAN VE AYRI
   SEKMEDE ÖZELLİĞİ YOK MU". Video ve etkinlik pencerelerinin başlığına:
     · «Tam ekran» — video kendi tam ekranında (iPhone'da da), etkinlik
       başlığıyla birlikte ekranı kaplar; yeniden basınca «Küçült». Tarayıcı
       izin vermezse (ör. tahtaya kumandadan gelen dokunuşta) pencere ekranı
       kaplar. Pencere kapanınca tam ekrandan çıkılır.
     · «Yeni sekmede» — video sitenin izleme sayfasında (kitap/izle.html,
       adres çubuğunda kidefarapca.com) kaldığı saniyeden açılır, penceredeki
       durur; bilgisayara indirilmiş kitapta video dosyasının kendisi açılır.
       Etkinlik kendi sayfasıyla açılır (zaten «Yeni sekmede aç» bağlantısı
       olan kitaplarda o kullanılır, ikincisi eklenmez).
   Bütün kitaplarda aynı (ortak dosya; Kidef 2. baskı dahil).
   ============================================================ */
(function () {
  'use strict';
  var pV = document.getElementById('pVideo'), pE = document.getElementById('pEtkinlik');
  if ((!pV && !pE) || window.__kitapMedyaTus) return;
  window.__kitapMedyaTus = true;

  var IK_TAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  var IK_KUC = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  var IK_SEK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/>' +
               '<path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  var IK_INDIR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>';

  var st = document.createElement('style');
  st.textContent =
    '.km-dug{display:inline-flex;align-items:center;gap:6px;flex-shrink:0;padding:6px 12px;border-radius:99px;cursor:pointer;' +
    'font-size:12px;font-weight:700;line-height:1.2;font-family:inherit;white-space:nowrap;text-decoration:none;' +
    'border:1.5px solid var(--line,#E3E8F0);background:#fff;color:var(--ink2,#2B3A55);transition:.15s}' +
    '.km-dug:hover{border-color:var(--gold,#E3A02A);color:var(--ink,#122040)}' +
    '.km-dug svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}' +
    '@media (max-width:560px){.km-dug span{display:none}.km-dug{padding:8px}}' +
    '@media (pointer:coarse){.km-dug{padding:9px 14px;font-size:13.5px}}' +
    '.panel.km-tam{position:fixed!important;left:0!important;top:0!important;right:0!important;bottom:0!important;' +
    'width:100vw!important;height:100vh!important;height:100dvh!important;max-width:none!important;max-height:none!important;' +
    'transform:none!important;border-radius:0!important;z-index:2147483000!important;opacity:1!important}' +
    '.panel:fullscreen{width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;' +
    'transform:none!important;border-radius:0!important;opacity:1!important}' +
    '.panel:-webkit-full-screen{width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;' +
    '-webkit-transform:none!important;transform:none!important;border-radius:0!important;opacity:1!important}';
  document.head.appendChild(st);

  function tamEleman() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function tamMi(p) {
    var f = tamEleman();
    return !!((f && (f === p || p.contains(f))) || p.classList.contains('km-tam'));
  }
  function yedekTam(p, ac) { p.classList.toggle('km-tam', !!ac); tazele(); }
  function tamAc(p, hedef) {
    var el = hedef || p, iste = el.requestFullscreen || el.webkitRequestFullscreen;
    if (iste) {
      try {
        var s = iste.call(el);
        if (s && s.then) s.then(tazele, function () { yedekTam(p, true); });
        else setTimeout(function () { if (!tamEleman()) yedekTam(p, true); else tazele(); }, 400);
        return;
      } catch (e) { }
    }
    if (hedef && hedef.webkitEnterFullscreen) {                    /* iPhone: videonun kendi tam ekranı */
      try { hedef.webkitEnterFullscreen(); return; } catch (e) { }
    }
    yedekTam(p, true);
  }
  function tamKapat(p) {
    if (tamEleman()) {
      try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) { }
    }
    yedekTam(p, false);
  }

  function dugme(ad, ik, yazi, ipucu) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'km-dug'; b.setAttribute('data-km', ad);
    b.title = ipucu; b.setAttribute('aria-label', ipucu);
    b.innerHTML = ik + '<span>' + yazi + '</span>';
    return b;
  }
  /* başlıktaki eski bağlantılar (İndir, Yeni sekmede aç) yeni düğmelerle aynı görünsün */
  function susle(a, ik) {
    if (!a || a.querySelector('svg')) return;
    var yazi = (a.textContent || '').trim();
    a.classList.add('km-dug');
    a.textContent = '';
    a.insertAdjacentHTML('afterbegin', ik);
    var sp = document.createElement('span'); sp.textContent = yazi; a.appendChild(sp);
    if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', yazi);
  }
  function yerlestir(p, dugmeler) {
    var bas = p.querySelector('.pbas');
    if (!bas) return;
    var kapat = bas.querySelector('[data-kapat]');
    dugmeler.forEach(function (b) { if (kapat) bas.insertBefore(b, kapat); else bas.appendChild(b); });
  }
  function tamDugTazele(p) {
    var b = p && p.querySelector('[data-km="tam"]');
    if (!b) return;
    var t = tamMi(p);
    b.innerHTML = (t ? IK_KUC : IK_TAM) + '<span>' + (t ? 'Küçült' : 'Tam ekran') + '</span>';
    b.title = t ? 'Tam ekrandan çık' : 'Tam ekranda göster';
    b.setAttribute('aria-label', b.title);
  }
  function tazele() { tamDugTazele(pV); tamDugTazele(pE); }

  /* indirilmiş (bilgisayardan açılan) kitapta site sayfası yok: dosyanın kendisi */
  function siteMi() { return /^https?:$/.test(location.protocol); }
  function sitePath(u) {                                          /* materyal deposu → site yolu */
    var m = /^https:\/\/gdmrbg7541\.github\.io(\/kidefarapca-materyal-[^\/]+\/.+)$/i.exec(u);
    if (m) return m[1];
    try { var x = new URL(u, location.href); if (x.origin === location.origin) return x.pathname + x.search; } catch (e) { }
    return u;
  }
  function yeniSekme(adres) {
    var w = null;
    try { w = window.open(adres, '_blank', 'noopener'); } catch (e) { w = null; }
    if (!w) {                                                     /* açılır pencere engeli: aynı adres bağlantıyla */
      var a = document.createElement('a');
      a.href = adres; a.target = '_blank'; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
    }
  }

  if (pV) {
    var v = document.getElementById('videoOyn');
    var vTam = dugme('tam', IK_TAM, 'Tam ekran', 'Tam ekranda göster');
    var vYeni = dugme('yeni', IK_SEK, 'Yeni sekmede', 'Videoyu yeni sekmede aç');
    yerlestir(pV, [vTam, vYeni]);
    susle(document.getElementById('videoIndir'), IK_INDIR);
    vTam.addEventListener('click', function () {
      if (tamMi(pV)) { tamKapat(pV); return; }
      tamAc(pV, v || null);
    });
    vYeni.addEventListener('click', function () {
      if (!v) return;
      var src = v.currentSrc || v.getAttribute('src') || '';
      if (!src) return;
      var t = Math.floor(v.currentTime || 0);
      try { v.pause(); } catch (e) { }
      if (!siteMi()) { yeniSekme(src + (t ? '#t=' + t : '')); return; }
      var b = ((document.getElementById('videoBaslik') || {}).textContent || '').trim();
      var izle = new URL('../izle.html', location.href);
      izle.search = '?v=' + encodeURIComponent(sitePath(src)) + (b ? '&b=' + encodeURIComponent(b.slice(0, 140)) : '') + (t ? '&t=' + t : '');
      yeniSekme(izle.href);
    });
  }

  if (pE) {
    var fr = document.getElementById('etkinlikCerceve');
    var eTam = dugme('tam', IK_TAM, 'Tam ekran', 'Tam ekranda göster');
    var ekle = [eTam];
    if (!document.getElementById('etkinlikYeni')) {                /* Kidef: bağlantı yoksa düğme */
      var eYeni = dugme('yeni', IK_SEK, 'Yeni sekmede', 'Yeni sekmede aç');
      eYeni.addEventListener('click', function () {
        var s = fr && fr.getAttribute('src');
        if (!s || /^about:/i.test(s)) return;
        yeniSekme(new URL(s, location.href).href);
      });
      ekle.push(eYeni);
    }
    yerlestir(pE, ekle);
    susle(document.getElementById('etkinlikYeni'), IK_SEK);
    eTam.addEventListener('click', function () {
      if (tamMi(pE)) { tamKapat(pE); return; }
      tamAc(pE, null);
    });
  }

  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
    document.addEventListener(ev, function () {
      [pV, pE].forEach(function (p) { if (p && !tamEleman() && !p.classList.contains('acik')) yedekTam(p, false); });
      tazele();
    });
  });
  /* pencere kapanınca (her yoldan: ×, perde, Esc, başka pencere) tam ekrandan çık */
  if (window.MutationObserver) {
    [pV, pE].forEach(function (p) {
      if (!p) return;
      new MutationObserver(function () {
        if (!p.classList.contains('acik') && tamMi(p)) tamKapat(p);
      }).observe(p, { attributes: true, attributeFilter: ['class'] });
    });
  }
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.key === 'Esc') && !tamEleman()) {
      [pV, pE].forEach(function (p) { if (p && p.classList.contains('km-tam')) yedekTam(p, false); });
    }
  });
  tazele();
})();
