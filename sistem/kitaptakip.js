/* =====================================================================
   KİTAP TAKİBİ — hangi sınıfta hangi kitap          sistem/kitaptakip.js
   ---------------------------------------------------------------------
   Öğretmen (15.10.2026): "giriş yapan öğretmenlerin hangi sınıfta hangi
   kitabı kullandığı iyi takip edilsin."

   NE YAPAR
   Öğretmen panelinin (Öğretmen Kontrol Paneli) içine bir kart koyar:
   5-10. sınıfların her biri için O AN SEÇİLİ KİTAP, varsa öğretmenin o
   seviyedeki şubeleri ve onay durumu. Kitap buradan da değiştirilebilir;
   seçim sistem/sinifveri.js üzerinden kaydedilir, yani metin tahlilleri,
   muhâdese, kelime listeleri — kitabı okuyan her yer aynı anda değişir.

   NEREDEN OKUR
     · Kitap/onay  : KidefSinifVeri (seciliVeriYili, onayliMi, tumSecimler)
     · Şubeler     : data.levels (adındaki sayı seviyeyi verir)
   Giriş yapan öğretmende seçim kullanicilar/{uid} belgesine de yazılır
   (sinifveri.js yapıyor); yani cihaz değişse de aynı kalır.

   PANEL YENİDEN ÇİZİLİRSE kart kaybolmasın diye #teacher-section
   izleniyor; kart yoksa yeniden konuyor.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefKitapTakip) return;

  var KART_ID = 'ktKart';
  var STIL_ID = 'ktStil';

  function V() { return window.KidefSinifVeri; }
  function kac(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Seviye adındaki ilk sayı: "7. Sınıflar" → 7 */
  function seviyeNo(ad) {
    var m = String(ad || '').match(/\d+/);
    var n = m ? parseInt(m[0], 10) : 0;
    return (n >= 5 && n <= 12) ? n : 0;
  }

  /* Öğretmenin seviyelere göre şubeleri: { 6: ['6-A','6-B'], … } */
  function subeler() {
    var o = {};
    try {
      var d = (typeof data !== 'undefined' && data) ? data : null;
      if (!d || !d.levels) return o;
      Object.keys(d.levels).forEach(function (lId) {
        var lv = d.levels[lId] || {}, n = seviyeNo(lv.name);
        if (!n) return;
        var cls = lv.classes || {};
        Object.keys(cls).forEach(function (cId) {
          (o[n] = o[n] || []).push((cls[cId] || {}).name || cId);
        });
      });
    } catch (e) { }
    return o;
  }

  function stilKur() {
    if (document.getElementById(STIL_ID)) return;
    var s = document.createElement('style');
    s.id = STIL_ID;
    s.textContent = [
      '#' + KART_ID + ' h3{ margin:0 0 6px; font-size:1.12rem; color:#0f2a43; }',
      '#' + KART_ID + ' .kt-not{ margin:0 0 14px; font-size:.92rem; line-height:1.5; color:#5A7186; }',
      '#' + KART_ID + ' .kt-liste{ display:grid; gap:10px; }',
      '#' + KART_ID + ' .kt-satir{ display:flex; flex-wrap:wrap; align-items:center; gap:10px 14px;',
      '  padding:11px 14px; border:1.4px solid #E7EDF3; border-radius:14px; background:#fff;',
      '  border-left:5px solid var(--ktc,#16A085); }',
      '#' + KART_ID + ' .kt-sinif{ flex:none; display:flex; align-items:center; gap:9px; min-width:150px; }',
      '#' + KART_ID + ' .kt-disk{ flex:none; width:34px; height:34px; border-radius:50%;',
      '  display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff;',
      '  background:var(--ktc,#16A085); }',
      '#' + KART_ID + ' .kt-ad{ font-weight:800; color:#1F3B55; }',
      '#' + KART_ID + ' .kt-sube{ font-size:.82rem; color:#6B7A8C; }',
      '#' + KART_ID + ' .kt-secici{ flex:1 1 220px; min-width:0; }',
      '#' + KART_ID + ' .kt-durum{ flex:none; display:inline-flex; align-items:center; gap:6px;',
      '  font-size:.8rem; font-weight:700; border-radius:999px; padding:5px 11px; }',
      '#' + KART_ID + ' .kt-durum.ok{ color:#0B5F51; background:#E6F7F2; border:1px solid #9FD9CB; }',
      '#' + KART_ID + ' .kt-durum.bekle{ color:#8A5A00; background:#FFF6E3; border:1px solid #F0D79B; }',
      '#' + KART_ID + ' .kt-durum.tek{ color:#5A7186; background:#F4F8FC; border:1px solid #E3EBF2; }',
      '#' + KART_ID + ' .kt-onayla{ font:inherit; font-size:.82rem; font-weight:700; cursor:pointer;',
      '  color:#0B5F51; background:#fff; border:1.4px solid #9FD9CB; border-radius:999px; padding:5px 12px; }',
      '#' + KART_ID + ' .kt-onayla:hover{ background:#E6F7F2; }',
      '@media (max-width:620px){ #' + KART_ID + ' .kt-sinif{ min-width:0; } }'
    ].join('');
    (document.head || document.documentElement).appendChild(s);
  }

  var RENK = { 5: '#16A085', 6: '#F39C12', 7: '#2563EB', 8: '#7C3AED', 9: '#EE5253', 10: '#0E9E86' };

  function icerik() {
    var v = V();
    if (!v || !v.tumSecimler) return '';
    var sb = subeler();
    var satir = v.tumSecimler().map(function (x) {
      var n = x.sinif, k = x.kitap || {};
      var ad = k.ad || k.yil || '—';
      var durum = !x.cok
        ? '<span class="kt-durum tek">tek kitap</span>'
        : (x.onay
            ? '<span class="kt-durum ok">✓ onaylandı</span>'
            : '<span class="kt-durum bekle">onay bekliyor</span>' +
              '<button type="button" class="kt-onayla" data-kt-onay="' + n + '">' +
              'Bu kitabı kullanıyorum</button>');
      var sube = (sb[n] && sb[n].length) ? '<span class="kt-sube">' + kac(sb[n].join(', ')) + '</span>' : '';
      return '<div class="kt-satir" style="--ktc:' + (RENK[n] || '#16A085') + '">' +
             '<span class="kt-sinif"><span class="kt-disk">' + n + '</span>' +
             '<span><span class="kt-ad">' + n + '. Sınıf</span><br>' + sube + '</span></span>' +
             '<span class="kt-secici">' + (v.yilRozetHtml ? v.yilRozetHtml(n) : kac(ad)) + '</span>' +
             durum + '</div>';
    }).join('');
    return '<h3>Hangi sınıfta hangi kitap?</h3>' +
      '<p class="kt-not">Seçtiğin kitap metin tahlillerinde, muhâdesede ve kelime ' +
      'listelerinde geçerli olur. Seçim hesabına kayıtlıdır: telefonda ya da ' +
      'okulda açtığında da aynı kitap gelir. İki kitabı olan sınıflarda ' +
      'hangisini kullandığını bir kez işaretlemen yeter.</p>' +
      '<div class="kt-liste">' + satir + '</div>';
  }

  function ciz(kart) {
    var v = V();
    if (!kart || !v) return;
    try { if (v.yilStilKur) v.yilStilKur(); } catch (e) { }
    kart.innerHTML = icerik();
  }

  function yerlestir() {
    var bolum = document.getElementById('teacher-section');
    if (!bolum || !bolum.firstElementChild) return;
    if (!V() || !V().tumSecimler) return;
    var eski = document.getElementById(KART_ID);
    if (eski && bolum.contains(eski)) return;
    stilKur();
    var kart = document.createElement('div');
    kart.id = KART_ID;
    kart.className = 'glass-card';
    ciz(kart);
    var ilk = bolum.firstElementChild;
    if (ilk && ilk.nextSibling) bolum.insertBefore(kart, ilk.nextSibling);
    else bolum.appendChild(kart);
  }

  /* onay düğmesi ve kitap değişimi */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    var n = t.getAttribute('data-kt-onay');
    if (!n) return;
    e.preventDefault();
    try { if (V() && V().onayla) V().onayla(n); } catch (h) { }
  }, false);

  document.addEventListener('kidef:veriyili', function () {
    var kart = document.getElementById(KART_ID);
    if (kart) ciz(kart);
  });

  function izle() {
    var bolum = document.getElementById('teacher-section');
    if (!bolum) { setTimeout(izle, 800); return; }
    yerlestir();
    try {
      new MutationObserver(function () { yerlestir(); })
        .observe(bolum, { childList: true });
    } catch (e) { setInterval(yerlestir, 2000); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', izle);
  else izle();

  window.KidefKitapTakip = { yerlestir: yerlestir, ciz: ciz };
})();
