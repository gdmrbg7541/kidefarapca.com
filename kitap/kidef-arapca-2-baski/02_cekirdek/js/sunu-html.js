/* Kidef Arapça — HTML sunu çizici (02.10.2026)
   SunuHTML.ciz(kok, veri, n, klasor): n. slaydı (1'den) kok içine çizer.
   Yazı tipleri PowerPoint'tekilerin benzeri olduğu için bir satır PowerPoint'tekinden biraz uzun
   olup alta kayabilir; PowerPoint'in yazıya göre boyutladığı kutular ve tablo satırları
   bir satırdan fazla taşarsa yazı en çok %14 küçültülerek sığdırılır (sigdir). */
(function (k) {
  'use strict';
  function sigdirKutu(el, hedef, ic) {
    var oran = 1;
    el.querySelectorAll('p').forEach(function (p) { p.style.zoom = ''; });
    if (ic() < hedef * 1.3) return;            // bir satırdan az fark: dokunma
    while (ic() > hedef * 1.08 && oran > 0.86) {
      oran -= 0.04;
      el.querySelectorAll('p').forEach(function (p) { p.style.zoom = oran; });
    }
  }
  function sigdir(kok) {
    kok.querySelectorAll('.s[data-sig] > .y').forEach(function (y) {
      var kutu = y.parentNode, h = kutu.offsetHeight;
      if (h < 4) return;
      var ic = function () { return y.scrollHeight; };
      sigdirKutu(y, h, ic);
    });
  }
  /* n: slayt (1'den). V.g varsa n bir GRUP: ardışık slaytlar tek slayt + adımlar (adim()). */
  function ciz(kok, V, n, klasor) {
    var on = klasor ? klasor.replace(/\/?$/, '/') : '';
    var grup = V.g ? V.g[n - 1] : null;
    kok.style.background = V.bg[grup ? grup[0] : n - 1] || '#fff';
    var parcalar = grup ? V.u[n - 1] : V.s[n - 1];
    var h = parcalar.map(function (i) {
      return V.havuz[i].replace(/^<(\w+)/, '<$1 data-p="' + i + '"');
    }).join('');
    if (on) h = h.replace(/src="m\//g, 'src="' + on + 'm/').replace(/url\(m\//g, 'url(' + on + 'm/');
    kok.innerHTML = h;
    sigdir(kok);
  }
  /* grup (0'dan) içindeki a. adımı göster: o adımda olmayan parçalar solarak kaybolur,
     yeniler belirir. ilk = true: geçişsiz (slayt yeni açıldı) */
  function adim(kok, V, g, a, ilk) {
    var gorunur = {};
    V.s[V.g[g][a]].forEach(function (i) { gorunur[i] = 1; });
    if (ilk) kok.classList.add('ilk');
    kok.querySelectorAll('[data-p]').forEach(function (el) {
      el.classList.toggle('gz', !gorunur[el.getAttribute('data-p')]);
    });
    if (ilk) { void kok.offsetWidth; kok.classList.remove('ilk'); }
  }
  k.SunuHTML = { ciz: ciz, sigdir: sigdir, adim: adim };
})(window);
