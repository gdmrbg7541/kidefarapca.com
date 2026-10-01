/* ============================================================
   FLIPBOOK KÖPRÜSÜ — yalnız flipbook kopyalarında bulunur, sitede YOK.
   Araç flipbook panelinde (iframe) açıldığında:
     • kopya dışına giden "ana sayfa / geri" bağlantıları paneli kapatır
     • Escape paneli kapatır
   Araç tek başına açılırsa hiçbir şey yapmaz.
   _araclar/03_araclari_uyarla.py tarafından üretildi.
   ============================================================ */
(function () {
  'use strict';
  var cerceve = false;
  try { cerceve = window.parent !== window; } catch (e) { cerceve = true; }
  if (!cerceve || window.__kidefKopru) return;
  window.__kidefKopru = true;

  var KUME = ["Dilbilgisi Konuları.html", "Harfi cer.html", "baglamdedektifi.html", "cikmissorular.html", "dilbilgisikonuanlatimi.html", "harficerler.html", "hizlioku.html", "kavramtesti.html", "kelimeavi.html", "kokenkardesligi.html", "kurandanornekler.html", "kurandanorneklermezid.html", "meslekler.html", "sozluk.html", "sozlukdedektifi.html", "testmezid.html", "ydtarapca.html", "yeni kelimeler.html"];

  function kapat() {
    try { window.parent.postMessage({ kidef: 'kapat' }, '*'); } catch (e) {}
  }
  function hedefAd(s) {
    if (!s) return '';
    var m = String(s).match(/([^\/'"?#]+\.html)/i);
    if (!m) return '';
    try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; }
  }
  function kapsamDisi(ad) { return ad && KUME.indexOf(ad) < 0; }

  // Yakalama aşamasında dinle: satır içi onclick'ten ÖNCE çalışır.
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('a[href],[onclick]') : null;
    if (!el) return;
    var ad = '';
    var h = el.getAttribute('href');
    if (h && !/^(https?:|#|javascript:|mailto:|tel:)/i.test(h)) ad = hedefAd(h);
    if (!ad) {
      var oc = el.getAttribute('onclick') || '';
      if (/location/.test(oc)) ad = hedefAd(oc);
    }
    if (kapsamDisi(ad)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      kapat();
    }
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') kapat();
  });
})();
