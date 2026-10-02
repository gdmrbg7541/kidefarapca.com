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
