/* ============================================================
   ARAYÜZ ARAKOM (24.10.2026)
   Öğretmen: "sonradan eklediklerimizde arakom yazısı olmayan yazıları
   var, onları klasördeki arakom tipiyle görelim". Kitap sitenin içinde
   (kidefarapca.com/kitap/…) açılınca sitenin arakom-arayuz.css'i yüklenir:
   araç çubuğu, paneller, pencereler, kalem takımı, deneme hakları Arakom;
   kitap sayfaları (.sahne) kendi yazı tipinde kalır. Bilgisayara
   indirilmiş kopyada (file://) değişiklik yok.
   ============================================================ */
(function () {
  'use strict';
  if (location.protocol === 'file:' || document.getElementById('arakomArayuz')) return;
  var yol = location.pathname, i = yol.indexOf('/kitap/');
  if (i < 0) return;
  var l = document.createElement('link');
  l.id = 'arakomArayuz';
  l.rel = 'stylesheet';
  l.href = yol.slice(0, i + 1) + 'arakom-arayuz.css?v=06c07a30';
  (document.head || document.documentElement).appendChild(l);
})();

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
   KALEM DE YALNIZ GİRİŞ YAPANLARA (24.10.2026) — öğretmen: "flipbooklarda
   öğretmen veya herhangi bi giriş yapmayınca da kalemle yazma özelliği kapalı
   olacaktı": girişsizken Kalem düğmesi görünmez, P kısayolu çalışmaz, açık
   kalem kapanır. Sınıf Ekranı kumandanın kalemini yine gösterir.
   GİRİŞSİZKEN DE DÜĞME, TIKLAYINCA DESTEK (24.10.2026) — öğretmen:
   "flipbooklarda kalem ve indir seçeneği giriş yapılmasada tuş olarak
   görünsün ama giriş yapmayanlar için tıklayınca destek istensin": Kalem ve
   İndir düğmeleri herkese görünür; girişsiz basınca (P de) iş yapılmaz,
   sitenin destek penceresi açılır (sistem/hak.js girisIste: «Giriş yap,
   destek ol», destek isteğe bağlı). Kaynaklardaki tek tek «İndir»
   bağlantıları girişsizken yine gizli.
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
    /* 24.10.2026: Kalem ve İndir düğmeleri girişsizken de görünür (basınca destek penceresi) */
    st.textContent = 'html.ik-girissiz a[download]:not([href^="blob:"]):not([href^="data:"]){display:none !important}';
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

  /* girişsiz: İndir düğmesi ve paketleri iş yapmaz, destek penceresi açılır
     (24.10.2026); kaynaklardaki gizli «İndir» bağlantıları sessizce durur */
  document.addEventListener('click', function (e) {
    if (izin === true || !e.target || !e.target.closest) return;
    var a = e.target.closest('a[download]');
    if (a && /^(blob|data):/i.test(a.getAttribute('href') || '')) a = null;   /* hazırlanan ZIP'in kendisi */
    var d = e.target.closest('#tIndir, #pIndir [data-p]');
    if (d || a) {
      e.preventDefault(); e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      if (d && e.isTrusted) destekIste('kitapIndir');
    }
  }, true);

  /* kalem: girişsizken açılmaz; basınca (P de) destek penceresi (24.10.2026) */
  document.addEventListener('click', function (e) {
    if (izin === true || !e.isTrusted || !e.target || !e.target.closest) return;
    if (e.target.closest('#tKalem, .kk-tus')) {
      e.preventDefault(); e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      destekIste('kitapKalem');
    }
  }, true);
  window.addEventListener('keydown', function (e) {
    if (izin === true || !e.isTrusted || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key !== 'p' && e.key !== 'P') return;
    var h = e.target || {};
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(h.tagName || '') || h.isContentEditable) return;
    e.preventDefault(); e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    if (!e.repeat) destekIste('kitapKalem');
  }, true);
  /* girişsiz basışta sitenin destek penceresi (sistem/hak.js girisIste).
     Giriş henüz anlaşılmadıysa önce o beklenir: girişliyse pencere çıkmaz,
     ikinci basışta düğme her zamanki gibi çalışır. */
  function destekIste(oz) {
    function ac() {
      var H = window.KidefHak;
      if (H && typeof H.girisIste === 'function') { H.girisIste(oz); return; }
      var y = location.pathname, i = y.indexOf('/kitap/');
      try { window.open((i >= 0 ? y.slice(0, i + 1) : '/') + 'index.html#destek', '_blank'); } catch (x) { }
    }
    if (izin === false) { ac(); return; }
    girisVarMi().then(function (v) { izin = v; kok.classList.toggle('ik-girissiz', !v); if (!v) ac(); });
  }
  function kalemKapat() {
    var k = document.getElementById('tKalem');
    if (k && k.getAttribute('aria-pressed') === 'true') { try { k.click(); } catch (x) { } }
  }
  function tazele() {
    girisVarMi().then(function (v) {
      izin = v;
      if (!v) kalemKapat();
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


/* ============================================================
   SAYFADAKİ HATAYI BİLDİR                                   20.11.2026
   Öğretmen: "flipbooklarda bi hata olan sayfada öğretmen geri bildirim
   gönderebilmeli, bunlara yönetici ulaşıp bakabilmeli, flipbook
   sidebarına ekleyelim bu özelliği."

   NE VAR
   · Yan çubuğun en altında «Hata bildir» düğmesi (telefonda üst şerit dolu
     olduğundan 520 px altında alt şeritte, kaydırıcının yanında yalnız
     simge). Basınca soldan bir panel açılır: kitap, sayfa
     ve ünite kendiliğinden doldurulur; öğretmen hata türünü seçer, birkaç
     satır yazar, «Yöneticiye gönder»e basar. İki sayfa açıkken hatanın
     hangi sayfada olduğu seçilir (ikisi de olabilir).
   · Yalnız giriş yapmış ÖĞRETMEN (onaylı) ya da yönetici gönderebilir.
     Girişsiz ziyaretçiye giriş yolu, öğrenciye kısa bir açıklama gösterilir.
   · Bildirim sitenin MEVCUT mesaj kanalına (Firestore «mesajlar») yazılır.
     Kurallar zaten «kullanıcı kendi mesajını yazar; yönetici hepsini okur
     ve cevaplar» diyor, yani Firebase kuralı DEĞİŞMEZ. Yönetici Mesajlar
     noktasını görür; ayrıca Yönetici Paneli › «Kitap hata bildirimleri»nde
     kitaba, sayfaya ve duruma göre listeler (hesap/teacher-admin.js).
     Yönetici cevap yazarsa öğretmenin Mesajlar kutusuna düşer.
     Kayıt alanları: from:'user', tur:'kitapHata', hataTuru, aciklama, kitap, kitapAd,
     sayfa, sayfaNo, unite, ders, adres, durum:'yeni' (+ mesajın olağan
     alanları: uid, email, ad, kategori, text, createdAt, readByAdmin…).
   · Firebase bu sayfada yüklü DEĞİL (kitap Firebase'siz açılıyor): SDK,
     düğmeye ilk basışta (ya da üstüne gelince) gstatic'ten, siteyle aynı
     sürümle (8.10.1) yüklenir; oturum sitenin tarayıcı deposundan gelir.
     Girişsiz ziyaretçide hiçbir şey yüklenmez. Bilgisayara indirilmiş
     kopyada (file://) düğme hiç eklenmez.
   · Tahtaya yansıtılan kopyadaki yinelenen tıklar (isTrusted:false)
     gönderim yapmaz: bildirim iki kez kaydedilmez.
   · Aynı tarayıcıdan saatte en çok 12 bildirim (yanlışlıkla art arda
     basışa karşı); yeniden denemede AYNI belge kimliği kullanılır, bağlantı
     kopup gelince çift kayıt oluşmaz.
   ============================================================ */
(function () {
  'use strict';
  if (location.protocol === 'file:' || window.__kitapHataBildir) return;
  var YOL = location.pathname, KI = YOL.indexOf('/kitap/');
  if (KI < 0) return;
  window.__kitapHataBildir = true;
  var KOK = YOL.slice(0, KI + 1);                       /* sitenin kökü */

  /* sitenin Firebase ayarı (hesap/auth.js ile aynı; web anahtarı gizli değil) */
  var AYAR = {
    apiKey: 'AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w',
    authDomain: 'kidefarapca-98f9c.firebaseapp.com',
    projectId: 'kidefarapca-98f9c',
    storageBucket: 'kidefarapca-98f9c.firebasestorage.app',
    messagingSenderId: '503317118211',
    appId: '1:503317118211:web:a9c8cf15b854597e0b3d36'
  };
  var SDK = 'https://www.gstatic.com/firebasejs/8.10.1/';
  var TURLER = [
    ['yazim', 'Yazım ya da hareke hatası'],
    ['anlam', 'Çeviri ya da anlam hatası'],
    ['cevap', 'Cevap anahtarı yanlış'],
    ['medya', 'Ses, video ya da etkinlik çalışmıyor'],
    ['gorunum', 'Sayfa görünümü bozuk ya da eksik'],
    ['diger', 'Diğer']
  ];
  var EN_AZ = 8, EN_COK = 1000, SAATLIK = 12, GECMIS = 'kitap_hata_gecmis';

  var IK_BILDIR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 4v-4h-.3A2.5 2.5 0 0 1 4 13.5z"/><path d="M12 7v4"/><path d="M12 13.4v.1"/></svg>';
  var IK_TAMAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.6l2.7 2.7L16.5 9.6"/></svg>';
  var IK_KILIT = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  var IK_BILGI = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.9v.1"/></svg>';

  function $(s, k) { return (k || document).querySelector(s); }
  function kac(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function duz(e) { return e ? String(e.textContent || '').replace(/\s+/g, ' ').trim() : ''; }

  /* ---------- oturum: siteyle aynı tarayıcı deposundan (Firebase yüklenmeden) ---------- */
  function depodanUid(depo) {
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
  function oturumUid() {
    return new Promise(function (bitir) {
      var oldu = false;
      function son(v) { if (!oldu) { oldu = true; bitir(v || ''); } }
      var y = '';
      try { y = depodanUid(window.localStorage) || depodanUid(window.sessionStorage); } catch (e) { }
      if (y) return son(y);
      if (!window.indexedDB) return son('');
      setTimeout(function () { son(''); }, 3000);
      var r;
      try { r = indexedDB.open('firebaseLocalStorageDb'); } catch (e) { return son(''); }
      /* depo yoksa açmak onu oluşturur — oluşturmadan vazgeç */
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
            if (String(x.fbase_key || k.key || '').indexOf('firebase:authUser:') === 0 && v && v.uid && !v.isAnonymous) {
              db.close(); return son(v.uid);
            }
            k.continue();
          };
          c.onerror = function () { db.close(); son(''); };
        } catch (e) { try { db.close(); } catch (x) { } son(''); }
      };
    });
  }

  /* ---------- Firebase SDK: gerektiğinde, yalnız eksik parçalar ---------- */
  var sdkSoz = null;
  function var_(ad) {
    var f = window.firebase;
    if (!f) return false;
    if (ad === 'app') return typeof f.initializeApp === 'function';
    return typeof f[ad] === 'function';
  }
  function sdkYukle() {
    if (sdkSoz) return sdkSoz;
    sdkSoz = new Promise(function (coz, red) {
      function bitir() {
        try {
          if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(AYAR);
        } catch (e) {
          /* başka bir kod aynı anda başlattıysa sorun yok */
          if (!(firebase.apps && firebase.apps.length)) { red(e); return; }
        }
        coz(window.firebase);
      }
      var liste = [['app', 'firebase-app.js'], ['auth', 'firebase-auth.js'], ['firestore', 'firebase-firestore.js']];
      (function sonraki(i) {
        while (i < liste.length && var_(liste[i][0])) i++;
        if (i >= liste.length) { bitir(); return; }
        var s = document.createElement('script');
        s.src = SDK + liste[i][1];
        s.onload = function () { sonraki(i + 1); };
        s.onerror = function () { red({ code: 'sdk-yuklenemedi' }); };
        (document.head || document.documentElement).appendChild(s);
      })(0);
    });
    sdkSoz.then(null, function () { sdkSoz = null; });      /* hata olursa bir sonraki denemede yeniden */
    return sdkSoz;
  }
  function zamanla(p, ms, kod) {
    return new Promise(function (coz, red) {
      var t = setTimeout(function () { red({ code: kod || 'zaman-asimi' }); }, ms);
      p.then(function (v) { clearTimeout(t); coz(v); }, function (e) { clearTimeout(t); red(e); });
    });
  }

  /* ---------- hesap: giriş var mı, öğretmen mi ---------- */
  function tamam(u, v, rol) {
    /* ad: sitenin ortak çözücüsüyle aynı sıra (sistem/rol.js › isimCoz) — «Belirtilmedi» ad sayılmaz */
    var ad = (v.name && v.name !== 'Belirtilmedi') ? v.name : (u.displayName || v.email || u.email || '');
    return { durum: 'tamam', uid: u.uid, email: v.email || u.email || '', ad: ad, rol: rol };
  }
  function hesapKontrol() {
    return zamanla(sdkYukle().then(function (fb) {
      return new Promise(function (coz, red) {
        var bitti = false, iptal = null;
        /* oturum kayıtlı ama Firebase 9 sn'de yanıt vermediyse "girişsiz" değil, bağlantı sorunu say */
        var z = setTimeout(function () { if (!bitti) { bitti = true; try { if (iptal) iptal(); } catch (e) { } red({ code: 'zaman-asimi' }); } }, 9000);
        iptal = fb.auth().onAuthStateChanged(function (u) {
          if (bitti) return;
          bitti = true; clearTimeout(z);
          try { if (iptal) iptal(); } catch (e) { }
          coz(u || null);
        }, function (e) {
          if (bitti) return;
          bitti = true; clearTimeout(z);
          red(e || { code: 'auth-hatasi' });
        });
      });
    }), 25000, 'sdk-zaman-asimi').then(function (u) {
      if (!u || u.isAnonymous) return { durum: 'girissiz' };
      return zamanla(firebase.firestore().collection('kullanicilar').doc(u.uid).get(), 12000, 'zaman-asimi').then(function (d) {
        var v = d && d.exists ? d.data() : null;
        if (!v) return { durum: 'kayitYok', uid: u.uid };
        var rol = String(v.role || '');
        /* «role» alanı eksik eski hesaplar: sitenin ortak çözücüsüyle (sistem/rol.js › rolCoz) AYNI —
           öğretmen izi (teacherStaticCode ya da userData sınıf listesi) varsa öğretmen sayılır */
        if (!rol) rol = (v.teacherStaticCode || v.userData) ? 'teacher' : 'student';
        if (rol === 'admin') return tamam(u, v, rol);
        if (rol === 'teacher') {
          if (v.ogretmenOnay === 'bekliyor' || v.ogretmenOnay === 'reddedildi') return { durum: 'onayBekliyor' };
          return tamam(u, v, rol);
        }
        return { durum: 'ogrenci' };
      });
    });
  }

  /* ---------- açık sayfanın bilgisi ---------- */
  function sayfaBilgisi() {
    var m = /\/kitap\/([^\/]+)\//.exec(YOL), kod = '';
    try { kod = m ? decodeURIComponent(m[1]) : ''; } catch (e) { kod = m ? m[1] : ''; }
    var et = duz(document.getElementById('sayfaEt')).replace(/\s*\/\s*\d+\s*$/, '');   /* "44–45 / 231" → "44–45" */
    var say = [], bul = et.match(/\d+/g) || [];
    for (var i = 0; i < bul.length; i++) { if (say.indexOf(bul[i]) < 0) say.push(bul[i]); }
    var marka = $('.ust .marka'), ad = '', yil = '';
    if (marka) {
      ad = duz($('b', marka));
      var sp = marka.querySelectorAll('span');
      for (var j = 0; j < sp.length; j++) {
        if (/\bks-(kik|sag|yazi|ok)\b/.test(sp[j].className || '')) continue;
        if (sp[j].closest && sp[j].closest('.ks-sag')) continue;
        var t = duz(sp[j]); if (t) yil = t;
      }
    }
    var kitapAd = ad ? (ad + (yil ? ' · ' + yil : '')) : (duz($('title')) || kod);
    var unite = duz(document.getElementById('uniteEt')), ders = duz(document.getElementById('dersEt'));
    if (/^Ünite\s*[—-]\s*$/.test(unite)) unite = '';
    if (/^[—-]+$/.test(ders)) ders = '';
    return { kod: kod, kitapAd: kitapAd, etiket: et || '—', sayfalar: say, unite: unite, ders: ders };
  }

  /* ---------- durum ---------- */
  var D = { ac: false, sayac: 0, hesap: null, bilgi: null, tur: '', secili: [], metin: '', gonderiliyor: false, ref: null, goruntu: '' };
  var dugme = null, perde = null, panel = null, govde = null;

  function turAdi(k) { for (var i = 0; i < TURLER.length; i++) if (TURLER[i][0] === k) return TURLER[i][1]; return ''; }
  function sirala(a, b) { return parseInt(a, 10) - parseInt(b, 10); }

  /* ---------- görünümler ---------- */
  function satir(et, ic) { return '<div class="hb-ctx-s"><b>' + et + '</b><span class="hb-ctx-d">' + ic + '</span></div>'; }
  function sayfaHtml(b) {
    if (b.sayfalar.length > 1) {
      var s = '<span class="hb-chips hb-sayfalar" role="group" aria-label="Hata hangi sayfada?">';
      for (var i = 0; i < b.sayfalar.length; i++) {
        var on = D.secili.indexOf(b.sayfalar[i]) >= 0;
        s += '<button type="button" class="hb-chip hb-sayfa" data-hb-sayfa="' + kac(b.sayfalar[i]) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + kac(b.sayfalar[i]) + '</button>';
      }
      return s + '</span>';
    }
    return '<span class="hb-sabit">' + kac(b.sayfalar.length ? b.sayfalar[0] : b.etiket) + '</span>';
  }
  function formHtml() {
    var b = D.bilgi, h = D.hesap, s = '';
    s += '<div class="hb-ctx">' + satir('Kitap', '<span class="hb-ad">' + kac(b.kitapAd) + '</span>') +
         satir('Sayfa', sayfaHtml(b)) +
         ((b.unite || b.ders) ? satir('Ünite', kac([b.unite, b.ders].filter(Boolean).join(' · '))) : '') + '</div>';
    s += '<div class="hb-blok"><div class="hb-et" id="hbTurEt">Ne tür bir hata?</div>' +
         '<div class="hb-chips" role="radiogroup" aria-labelledby="hbTurEt">';
    for (var i = 0; i < TURLER.length; i++) {
      var on = D.tur === TURLER[i][0];
      s += '<button type="button" class="hb-chip hb-tur" role="radio" data-hb-tur="' + TURLER[i][0] + '" aria-checked="' + (on ? 'true' : 'false') + '">' + kac(TURLER[i][1]) + '</button>';
    }
    s += '</div></div>';
    s += '<div class="hb-blok"><label class="hb-et" for="hbMetin">Açıklama</label>' +
         '<textarea id="hbMetin" class="hb-metin" rows="5" maxlength="' + EN_COK + '" placeholder="Neresi yanlış, doğrusu ne olmalı? Örnek: 3. satırdaki kelimenin harekesi eksik.">' + kac(D.metin) + '</textarea>' +
         '<div class="hb-say"><span id="hbSay">' + D.metin.length + '</span> / ' + EN_COK + '</div></div>';
    s += '<div class="hb-uyari" id="hbUyari" role="alert" hidden></div>';
    s += '<button type="button" class="hb-gonder" data-hb-gonder>Yöneticiye gönder</button>';
    s += '<p class="hb-not">Gönderen: ' + kac(h.ad || h.email || 'öğretmen') + (h.ad && h.email ? ' · ' + kac(h.email) : '') +
         '. Yanıt gelirse sitedeki <b>Mesajlar</b> bölümünde görürsün.</p>';
    return s;
  }
  function durumHtml(ik, baslik, yazi, alt, sinif) {
    return '<div class="hb-durum' + (sinif ? ' ' + sinif : '') + '">' + ik + '<h3>' + baslik + '</h3><p>' + yazi + '</p>' + (alt || '') + '</div>';
  }
  var GORUNUM = {
    kontrol: function () { return '<div class="hb-durum"><div class="hb-don" aria-hidden="true"></div><p>Hesabın kontrol ediliyor…</p></div>'; },
    girissiz: function () {
      return durumHtml(IK_KILIT, 'Önce giriş yapmalısın',
        'Hata bildirimi öğretmen hesabıyla yapılır; böylece yönetici sana dönüş yapabilir.',
        '<div class="hb-dugmeler"><a class="hb-gonder hb-bag" href="' + kac(KOK + 'index.html') + '" target="_blank" rel="noopener">Siteye giriş yap</a></div>' +
        '<small>Giriş yaptıktan sonra bu sekmeye dön; panel kendiliğinden yenilenir.</small>');
    },
    ogrenci: function () {
      return durumHtml(IK_BILGI, 'Hata bildirimi öğretmenlere açık',
        'Sayfada bir hata görürsen öğretmenine söyleyebilirsin; o da buradan yöneticiye iletir.');
    },
    onayBekliyor: function () {
      return durumHtml(IK_BILGI, 'Hesabın onay bekliyor', 'Öğretmen hesabın onaylanınca hata bildirebilirsin.');
    },
    kayitYok: function () {
      return durumHtml(IK_BILGI, 'Hesap kaydın eksik görünüyor',
        'Ana sayfadan giriş yapıp kaydını tamamla, sonra tekrar dene.',
        '<div class="hb-dugmeler"><a class="hb-gonder hb-bag" href="' + kac(KOK + 'index.html') + '" target="_blank" rel="noopener">Ana sayfaya git</a></div>');
    },
    ag: function () {
      return durumHtml(IK_BILGI, 'Bağlantı kurulamadı',
        'Hesabın kontrol edilemedi. İnternet bağlantını kontrol edip tekrar dene.',
        '<div class="hb-dugmeler"><button type="button" class="hb-gonder" data-hb-tekrar>Tekrar dene</button></div>', 'hb-uyar');
    },
    tamam: function () {
      return durumHtml(IK_TAMAM, 'Teşekkürler!',
        'Bildirimin yöneticiye iletildi. Yanıt gelirse sitedeki <b>Mesajlar</b> bölümünde görürsün.',
        '<div class="hb-dugmeler"><button type="button" class="hb-ikinci" data-hb-yeni>Bir bildirim daha</button>' +
        '<button type="button" class="hb-gonder" data-hb-kapat>Kitaba dön</button></div>', 'hb-iyi');
    },
    form: formHtml
  };
  function goster(ad) {
    D.goruntu = ad;
    govde.innerHTML = (GORUNUM[ad] || GORUNUM.ag)();
    panel.setAttribute('data-hb', ad);
    var ilk = $('.hb-metin, .hb-bag, [data-hb-tekrar], [data-hb-yeni], [data-hb-kapat]', govde);
    if (D.ac && ad !== 'kontrol') {
      var odak = ad === 'form' ? ($('.hb-tur', govde) || ilk) : ilk;
      if (odak) try { odak.focus({ preventScroll: true }); } catch (e) { }
    }
  }
  function uyar(m) {
    var u = $('#hbUyari', govde);
    if (!u) return;
    u.textContent = m || '';
    u.hidden = !m;
  }

  /* ---------- hesap sorgusu (panel her açılışta yenilenir) ---------- */
  function hesapIste() {
    var n = ++D.sayac;
    goster('kontrol');
    oturumUid().then(function (uid) {
      if (n !== D.sayac || !D.ac) return;
      if (!uid) { D.hesap = null; goster('girissiz'); return; }
      hesapKontrol().then(function (h) {
        if (n !== D.sayac || !D.ac) return;
        D.hesap = h;
        if (h.durum === 'tamam') {
          D.bilgi = sayfaBilgisi();
          D.secili = D.bilgi.sayfalar.slice();
          goster('form');
        } else goster(h.durum);
      }, function () {
        if (n !== D.sayac || !D.ac) return;
        goster('ag');
      });
    });
  }

  /* ---------- gönderim ---------- */
  function gecmis() {
    try {
      var a = JSON.parse(localStorage.getItem(GECMIS) || '[]'), s = Date.now() - 3600000;
      return a.filter(function (t) { return typeof t === 'number' && t > s; });
    } catch (e) { return []; }
  }
  function gecmisEkle() {
    var a = gecmis(); a.push(Date.now());
    try { localStorage.setItem(GECMIS, JSON.stringify(a.slice(-40))); } catch (e) { }
  }
  function hataMetni(e) {
    var k = (e && e.code) || '';
    if (k === 'permission-denied') return 'Bildirim gönderilemedi: bu hesabın yazma izni yok. Sayfayı yenileyip yeniden giriş yapmayı dene.';
    if (k === 'unavailable' || k === 'zaman-asimi' || k === 'deadline-exceeded' || k === 'sdk-yuklenemedi') return 'İnternet bağlantısı kurulamadı. Bağlantını kontrol edip tekrar dene.';
    return 'Bildirim gönderilemedi' + (k ? ' (' + k + ')' : '') + '. Birazdan tekrar dene.';
  }
  function gonder(olay) {
    if (olay && olay.isTrusted === false) return;          /* tahtaya yansıyan tık: ikinci kayıt olmasın */
    if (D.gonderiliyor || D.goruntu !== 'form') return;
    var b = D.bilgi, h = D.hesap;
    var ta = $('#hbMetin', govde);
    var ileti = String((ta && ta.value) || '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!D.tur) { uyar('Önce hata türünü seç.'); return; }
    if (b.sayfalar.length > 1 && !D.secili.length) { uyar('Hatanın hangi sayfada olduğunu seç.'); return; }
    if (ileti.length < EN_AZ) { uyar('Hatayı birkaç sözcükle anlat (en az ' + EN_AZ + ' harf).'); if (ta) ta.focus(); return; }
    if (gecmis().length >= SAATLIK) { uyar('Kısa sürede çok bildirim gönderdin. Biraz sonra tekrar dene.'); return; }
    uyar('');
    D.gonderiliyor = true;
    var dg = $('[data-hb-gonder]', govde);
    if (dg) { dg.disabled = true; dg.textContent = 'Gönderiliyor…'; }

    var sec = D.secili.slice().sort(sirala);
    var sayfaYazi = sec.length ? sec.join(' – ') : b.etiket;
    var konum = sec.length ? ('sayfa ' + sayfaYazi) : b.etiket;
    var s = sec.length ? sec[0] : '';
    var metin = 'Kitap hatası: ' + b.kitapAd + ', ' + konum +
      ((b.unite || b.ders) ? ' (' + [b.unite, b.ders].filter(Boolean).join(' · ') + ')' : '') +
      '\nTür: ' + turAdi(D.tur) + '\n\n' + ileti;
    var kayit = {
      uid: h.uid, email: h.email || '', ad: h.ad || 'Öğretmen',
      from: 'user', kategori: 'Kitap hatası', text: metin,
      tur: 'kitapHata', hataTuru: D.tur, aciklama: ileti,
      kitap: b.kod, kitapAd: b.kitapAd, sayfa: sayfaYazi, sayfaNo: s ? parseInt(s, 10) : null,
      unite: b.unite || '', ders: b.ders || '',
      adres: YOL + (s ? '?s=' + encodeURIComponent(s) : ''),
      durum: 'yeni',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      readByAdmin: false, readByUser: true
    };
    var ref;
    try {
      /* aynı form oturumunda yeniden denemede AYNI belge: çift kayıt olmaz */
      ref = D.ref || (D.ref = firebase.firestore().collection('mesajlar').doc());
    } catch (e) { D.gonderiliyor = false; goster('ag'); return; }
    zamanla(ref.set(kayit), 15000, 'zaman-asimi').then(function () {
      D.gonderiliyor = false; D.ref = null; D.tur = ''; D.metin = '';
      gecmisEkle();
      if (D.ac) goster('tamam');
    }, function (e) {
      D.gonderiliyor = false;
      if (!D.ac || D.goruntu !== 'form') return;
      var d2 = $('[data-hb-gonder]', govde);
      if (d2) { d2.disabled = false; d2.textContent = 'Yöneticiye gönder'; }
      uyar(hataMetni(e));
    });
  }

  /* ---------- aç / kapat ---------- */
  function digerleriniKapat() {                          /* İçindekiler, Kaynaklar… açıksa kendi × düğmesiyle kapanır */
    var l = document.querySelectorAll('.panel.acik');
    for (var i = 0; i < l.length; i++) {
      if (l[i] === panel) continue;
      var k = l[i].querySelector('.kapat');
      if (k) { try { k.click(); } catch (e) { } }
    }
  }
  function ac() {
    if (D.ac) return;
    kur();
    digerleriniKapat();
    D.ac = true;
    panel.classList.add('acik'); panel.setAttribute('aria-hidden', 'false');
    perde.classList.add('acik');
    if (dugme) { dugme.classList.add('aktif'); dugme.setAttribute('aria-expanded', 'true'); }
    D.bilgi = sayfaBilgisi();
    D.secili = D.bilgi.sayfalar.slice();
    try { panel.focus({ preventScroll: true }); } catch (e) { }      /* kısayollar panele girsin, kitaba gitmesin */
    hesapIste();
  }
  function kapat(sessiz) {
    if (!D.ac) return;
    D.ac = false; D.sayac++;
    panel.classList.remove('acik'); panel.setAttribute('aria-hidden', 'true');
    perde.classList.remove('acik');
    if (dugme) {
      dugme.classList.remove('aktif'); dugme.setAttribute('aria-expanded', 'false');
      if (!sessiz) { try { dugme.focus({ preventScroll: true }); } catch (e) { } }
    }
  }

  /* ---------- panelin kurulumu (ilk açışta) ---------- */
  function durdur(e) { e.stopPropagation(); }
  function kur() {
    if (panel) return;
    stilEkle();
    perde = document.createElement('div');
    perde.className = 'hb-perde';
    perde.setAttribute('aria-hidden', 'true');
    panel = document.createElement('aside');
    panel.className = 'panel yan hb-panel';
    panel.id = 'pHataBildir';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('tabindex', '-1');
    panel.setAttribute('aria-labelledby', 'hbBaslik');
    panel.innerHTML = '<div class="pbas"><h2 id="hbBaslik">Sayfadaki hatayı bildir</h2>' +
      '<button type="button" class="kapat" data-hb-kapat aria-label="Kapat">&times;</button></div>' +
      '<div class="pgovde" id="hbIc"></div>';
    document.body.appendChild(perde);
    document.body.appendChild(panel);
    govde = $('#hbIc', panel);

    perde.addEventListener('click', function () { kapat(); });
    /* Tab panelin içinde döner (arkadaki düğmelere ve kitabın kısayollarına çıkmasın) */
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var o = [].filter.call(panel.querySelectorAll('button:not([disabled]), textarea, a[href]'), function (x) { return x.offsetParent !== null; });
      if (!o.length) { e.preventDefault(); return; }
      var ilk = o[0], son = o[o.length - 1], a = document.activeElement;
      if (e.shiftKey && (a === ilk || a === panel || !panel.contains(a))) { e.preventDefault(); son.focus(); }
      else if (!e.shiftKey && (a === son || !panel.contains(a))) { e.preventDefault(); ilk.focus(); }
    });
    document.addEventListener('focusin', function (e) {
      if (!D.ac || !panel || panel.contains(e.target)) return;
      try { panel.focus({ preventScroll: true }); } catch (x) { }
    });
    /* kitabın kısayolları (ok tuşları, K, I, P…) ve kaydırma/zoom hareketleri panelin içinden kitaba geçmesin */
    ['keydown', 'keyup', 'keypress', 'pointerdown', 'mousedown', 'touchstart', 'dblclick'].forEach(function (ad) {
      panel.addEventListener(ad, durdur);
    });
    panel.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target : null;
      if (!t) return;
      var o = t.closest('[data-hb-kapat]');
      if (o) { kapat(); return; }
      o = t.closest('[data-hb-tur]');
      if (o) {
        D.tur = o.getAttribute('data-hb-tur');
        var hep = govde.querySelectorAll('.hb-tur');
        for (var i = 0; i < hep.length; i++) hep[i].setAttribute('aria-checked', hep[i] === o ? 'true' : 'false');
        uyar('');
        return;
      }
      o = t.closest('[data-hb-sayfa]');
      if (o) {
        var n = o.getAttribute('data-hb-sayfa'), i2 = D.secili.indexOf(n);
        if (i2 >= 0) {
          if (D.secili.length === 1) return;               /* en az biri seçili kalsın */
          D.secili.splice(i2, 1);
        } else D.secili.push(n);
        o.setAttribute('aria-pressed', i2 >= 0 ? 'false' : 'true');
        uyar('');
        return;
      }
      if (t.closest('[data-hb-gonder]')) { gonder(e); return; }
      if (t.closest('[data-hb-tekrar]')) { hesapIste(); return; }
      if (t.closest('[data-hb-yeni]')) {
        D.tur = ''; D.metin = ''; D.ref = null;
        D.bilgi = sayfaBilgisi(); D.secili = D.bilgi.sayfalar.slice();
        goster('form');
        return;
      }
    });
    panel.addEventListener('input', function (e) {
      if (!e.target || e.target.id !== 'hbMetin') return;
      D.metin = e.target.value;
      var c = $('#hbSay', govde); if (c) c.textContent = String(D.metin.length);
      uyar('');
    });
    /* başka bir kod paneli kapatırsa (kitabın kapatHepsi'si gibi) perde de insin */
    if (window.MutationObserver) {
      new MutationObserver(function () {
        if (D.ac && !panel.classList.contains('acik')) kapat(true);
      }).observe(panel, { attributes: true, attributeFilter: ['class'] });
    }
  }

  /* Esc: önce bu paneli kapat, kitabın kendi Esc işine (yakınlaştırmayı sıfırla) karışmasın */
  window.addEventListener('keydown', function (e) {
    if (!D.ac || (e.key !== 'Escape' && e.key !== 'Esc')) return;
    e.preventDefault(); e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    kapat();
  }, true);
  /* giriş yapıp bu sekmeye dönünce panel kendiliğinden yenilenir */
  function dondu() {
    if (D.ac && (D.goruntu === 'girissiz' || D.goruntu === 'kayitYok' || D.goruntu === 'ag')) hesapIste();
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) dondu(); });
  window.addEventListener('focus', dondu);
  window.addEventListener('pageshow', dondu);

  /* ---------- biçim ---------- */
  function stilEkle() {
    if (document.getElementById('hbStil')) return;
    var st = document.createElement('style');
    st.id = 'hbStil';
    st.textContent = [
      /* düğme rengi: kitaptema.css'teki --tr/--trz düzeni (yan çubukta yazı + simge bu renkte,
         etkinken dolu; dar ekranda öbür .tus'lar gibi yalnız simge) */
      '.ust .araclar #tHataBildir{--tr:#DB2777;--trz:rgba(219,39,119,.11)}',
      /* telefonda (<520 px) üst şerit dolu: düğme alt şeritte, kaydırıcının sağında durur */
      '.alt #tHataBildir{--tr:#DB2777;--trz:rgba(219,39,119,.11);order:9;flex:0 0 38px;color:#DB2777}',
      '.alt #tHataBildir:hover{background:rgba(219,39,119,.11);color:#DB2777}',
      '.alt #tHataBildir.aktif{background:#DB2777;color:#fff}',
      /* perde ve panel */
      '.hb-perde{position:fixed;top:0;right:0;bottom:0;left:0;z-index:70;background:rgba(31,36,48,.42);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);opacity:0;pointer-events:none;transition:opacity .22s}',
      '.hb-perde.acik{opacity:1;pointer-events:auto}',
      '.hb-panel{width:min(460px,94vw)}',
      '.hb-panel .pgovde{display:flex;flex-direction:column;gap:16px;padding:18px}',
      '.hb-panel h2,.hb-panel h3{margin:0}',
      /* bağlam kartı */
      '.hb-ctx{display:grid;gap:9px;padding:13px 15px;border:1.5px solid var(--cizgi,#E3E8EF);border-radius:14px;background:#F8FAFC}',
      '.hb-ctx-s{display:flex;align-items:center;gap:10px;min-width:0;font-size:13.5px;color:var(--mur,#1F2430)}',
      '.hb-ctx-s>b{flex:0 0 52px;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--gri,#5B6471)}',
      '.hb-ctx-d{flex:1 1 auto;min-width:0;overflow-wrap:anywhere}',
      '.hb-ad{font-weight:800}',
      '.hb-sabit{display:inline-block;min-width:34px;padding:4px 12px;border-radius:99px;background:rgba(22,160,133,.12);color:var(--yesilK,#0E7C66);font-weight:800;text-align:center}',
      /* seçenekler */
      '.hb-blok{display:grid;gap:8px}',
      '.hb-et{font-size:12px;font-weight:800;letter-spacing:.02em;color:var(--gri,#5B6471)}',
      '.hb-chips{display:flex;flex-wrap:wrap;gap:8px}',
      '.hb-chip{min-height:44px;padding:8px 15px;border:1.5px solid var(--cizgi,#E3E8EF);border-radius:99px;background:#fff;color:var(--ink2,#2A3C63);font:inherit;font-size:13px;font-weight:700;line-height:1.25;text-align:left;cursor:pointer;transition:border-color .15s,background .15s,color .15s}',
      '.hb-sayfa{min-width:52px;text-align:center}',
      '.hb-chip:hover{border-color:var(--yesil,#16A085)}',
      '.hb-chip[aria-checked="true"],.hb-chip[aria-pressed="true"]{border-color:var(--yesil,#16A085);background:rgba(22,160,133,.12);color:var(--yesilK,#0E7C66)}',
      '.hb-metin{width:100%;min-height:118px;resize:vertical;padding:12px 14px;border:1.5px solid var(--cizgi,#E3E8EF);border-radius:12px;background:#fff;color:var(--mur,#1F2430);font:inherit;font-size:14.5px;line-height:1.5;outline:none}',
      '.hb-metin:focus{border-color:var(--yesil,#16A085)}',
      '.hb-say{text-align:right;font-size:11.5px;color:var(--soluk,#8A93A0);font-variant-numeric:tabular-nums}',
      '.hb-uyari{padding:10px 13px;border-radius:12px;background:#FDECEC;color:#9B1C1C;font-size:13px;font-weight:700;line-height:1.4}',
      '.hb-uyari[hidden]{display:none}',
      '.hb-gonder,.hb-ikinci{min-height:50px;padding:0 20px;border-radius:14px;font:inherit;font-size:15px;font-weight:800;cursor:pointer;transition:filter .15s,background .15s}',
      '.hb-gonder{border:0;background:var(--yesil,#16A085);color:#fff}',
      '.hb-gonder:hover{filter:brightness(.94)}',
      '.hb-gonder:disabled{opacity:.6;cursor:default}',
      '.hb-ikinci{border:1.5px solid var(--cizgi,#E3E8EF);background:#fff;color:var(--ink2,#2A3C63)}',
      '.hb-ikinci:hover{border-color:var(--yesil,#16A085)}',
      '.hb-not{margin:0;font-size:12px;line-height:1.5;color:var(--gri,#5B6471);overflow-wrap:anywhere}',
      '.hb-chip:focus-visible,.hb-gonder:focus-visible,.hb-ikinci:focus-visible{outline:2px solid var(--yesil,#16A085);outline-offset:2px}',
      /* durum ekranları */
      '.hb-durum{display:flex;flex-direction:column;align-items:center;gap:10px;padding:26px 8px;text-align:center;color:var(--mur,#1F2430)}',
      '.hb-durum svg{width:46px;height:46px;fill:none;stroke:var(--yesil,#16A085);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
      '.hb-uyar svg{stroke:#D97706}',
      '.hb-durum h3{font-size:17px;font-weight:800}',
      '.hb-durum p{margin:0;font-size:14px;line-height:1.55;color:var(--gri,#5B6471)}',
      '.hb-durum small{font-size:12px;line-height:1.5;color:var(--soluk,#8A93A0)}',
      '.hb-dugmeler{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;width:100%;margin-top:6px}',
      '.hb-dugmeler>button,.hb-dugmeler>a{flex:1 1 150px}',
      '.hb-bag{display:flex;align-items:center;justify-content:center;text-decoration:none;color:#fff;text-align:center}',
      '.hb-bag:hover{color:#fff}',
      '.hb-don{width:34px;height:34px;border-radius:50%;border:3px solid rgba(22,160,133,.2);border-top-color:var(--yesil,#16A085);animation:hbDon .8s linear infinite}',
      '@keyframes hbDon{to{transform:rotate(360deg)}}',
      '@media (prefers-reduced-motion:reduce){.hb-don{animation-duration:2.4s}.hb-perde{transition:none}}',
      '@media (max-width:420px){.hb-panel .pgovde{padding:14px}.hb-ctx-s>b{flex-basis:46px}}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }

  /* ---------- yan çubuk düğmesi ---------- */
  function dugmeKur() {
    var ar = $('.ust .araclar');
    if (!ar || document.getElementById('tHataBildir')) return;
    stilEkle();
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tus';
    b.id = 'tHataBildir';
    b.title = 'Bu sayfadaki hatayı yöneticiye bildir';
    b.setAttribute('aria-label', 'Hata bildir');
    b.setAttribute('aria-haspopup', 'dialog');
    b.setAttribute('aria-expanded', 'false');
    b.innerHTML = IK_BILDIR + '<span class="yan-et">Hata bildir</span>';
    ar.appendChild(b);
    dugme = b;
    /* telefonda üst şeritte yer yok (Kidef'te en sağdaki düğme ekran dışına düşüyordu):
       500 px altında düğme alt şeride, kaydırıcının yanına geçer; geniş ekranda yan çubukta */
    var kucuk = window.matchMedia ? window.matchMedia('(max-width: 519px)') : null;
    function yerles() {
      var alt = $('.alt');
      if (kucuk && kucuk.matches && alt) {
        if (b.parentNode !== alt) alt.appendChild(b);
      } else if (b.parentNode !== ar) ar.appendChild(b);
    }
    yerles();
    if (kucuk) { if (kucuk.addEventListener) kucuk.addEventListener('change', yerles); else if (kucuk.addListener) kucuk.addListener(yerles); }
    /* sonradan eklenen düğmeler (Ders, Yardım…) altına binmesin: yan çubukta bu en altta kalır */
    if (window.MutationObserver) {
      new MutationObserver(function () { if (b.parentNode === ar && ar.lastElementChild !== b) ar.appendChild(b); })
        .observe(ar, { childList: true });
    }
    b.addEventListener('click', function () { if (D.ac) kapat(); else ac(); });
    /* üstüne gelince / dokununca girişliyse SDK'yı önceden indir (ilk açılış hızlı olsun) */
    var onYuk = function () {
      oturumUid().then(function (u) { if (u) sdkYukle().then(null, function () { }); });
    };
    ['pointerenter', 'focus', 'touchstart'].forEach(function (ad) { b.addEventListener(ad, onYuk, { once: true, passive: true }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dugmeKur);
  else dugmeKur();
  window.addEventListener('load', dugmeKur);              /* çubuk geç kurulduysa bir kez daha dene */

  window.KitapHataBildir = { ac: ac, kapat: kapat };
})();
