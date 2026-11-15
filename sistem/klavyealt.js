/* ===========================================================================
   ALTTAN AÇILAN ARAPÇA KLAVYE — sistem/klavyealt.js                (14.11.2026)
   ---------------------------------------------------------------------------
   Soru Hazırla'daki «Kendi sorunu yaz» klavyesinin (arapcaklavye.html?gomulu=1)
   her sayfada kullanılabilen hâli. Sınav Gönder (öğretmen soruyu yazar) ve
   sinavcoz.html (öğrenci açık uçlu cevabı yazar) kullanır.

   KULLANIM
     <textarea data-ka-kl data-ka-ad="Soru"></textarea>
     <button type="button" data-ka-kl-ac="alanKimligi">…</button>
     KidefKlavyeAlt.kur()        bir kez (belge dinleyicileri)
     KidefKlavyeAlt.ac(el)       klavyeyi o alana aç
     KidefKlavyeAlt.kapat()
   Yazı yeri seçili alandır: gömülü klavye her tuştan önce alanın yazısını ve
   imlecini alır (al), sonra geri yazar (degisti) — window.KidefSoruKlavye
   köprüsü (sinifici/arapcaklavye.js · GOMULU). Alan açıkken inputmode=none:
   tablette cihazın kendi klavyesi üste açılmaz; «Tamam» deyince geri gelir.
   =========================================================================== */
(function () {
  'use strict';
  if (window.KidefKlavyeAlt) return;
  var KL = { api: null, hedef: null, yuklendi: false, kuruldu: false };
  var Z = 10090;      /* Görevler penceresinin (10060) üstünde */

  function $(s) { return document.querySelector(s); }
  function stil() {
    if (document.getElementById('kaKlStil')) return;
    var s = document.createElement('style'); s.id = 'kaKlStil';
    s.textContent =
      '.ka-klavye{position:fixed;left:0;right:0;bottom:0;z-index:' + Z + ';height:min(450px,58vh);display:flex;flex-direction:column;' +
        'background:#EEF2F6;border-top:1.5px solid #D9E1EA;border-radius:18px 18px 0 0;box-shadow:0 -10px 30px rgba(22,50,79,.24);overflow:hidden;' +
        "font-family:'Arakom',system-ui,sans-serif;}" +
      '.ka-klavye[hidden]{display:none;}' +
      '.ka-kl-bas{flex:none;display:flex;align-items:center;gap:8px;padding:7px 12px;}' +
      '.ka-kl-ad{flex:1;min-width:0;font-size:.86rem;color:#5B6B7C;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '.ka-kl-ad b{color:#0E7C66;}' +
      '.ka-kl-arac{display:inline-flex;gap:5px;}' +
      '.ka-kl-arac button{min-width:40px;height:36px;padding:0 9px;border-radius:10px;border:1.5px solid #D9E1EA;background:#fff;color:#2C3E50;' +
        'font:800 1rem/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;}' +
      '.ka-kl-arac button svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;}' +
      '.ka-kl-tamam{padding:8px 20px;border-radius:11px;border:0;background:#16A085;color:#fff;font:800 .95rem/1 inherit;cursor:pointer;}' +
      '.ka-klavye iframe{flex:1 1 auto;width:100%;min-height:0;border:0;display:block;background:#EEF2F6;}' +
      '[data-ka-kl].ka-hedef{outline:3px solid #16A085;outline-offset:1px;}' +
      'body.ka-klavye-acik{padding-bottom:var(--ka-kl-y,min(450px,58vh));}' +
      '@media (max-width:600px){.ka-kl-arac button{min-width:34px;height:34px;padding:0 6px;}.ka-kl-tamam{padding:8px 14px;}}';
    (document.head || document.documentElement).appendChild(s);
  }
  var IK = {
    geri: '<svg viewBox="0 0 24 24"><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/></svg>',
    ileri: '<svg viewBox="0 0 24 24"><path d="m15 14 5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/></svg>',
    sil: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };
  function sayfa() {
    var k = document.getElementById('kaKlavye');
    if (k) return k;
    stil();
    k = document.createElement('div');
    k.id = 'kaKlavye'; k.className = 'ka-klavye'; k.hidden = true;
    k.setAttribute('role', 'dialog'); k.setAttribute('aria-label', 'Arapça klavye');
    k.innerHTML =
      '<div class="ka-kl-bas"><span class="ka-kl-ad"><b id="kaKlHedef">Alan</b> alanına yazıyor</span>' +
      '<span class="ka-kl-arac">' +
        '<button type="button" data-ka-is="geriAl" title="Geri al" aria-label="Geri al">' + IK.geri + '</button>' +
        '<button type="button" data-ka-is="yinele" title="Yinele" aria-label="Yinele">' + IK.ileri + '</button>' +
        '<button type="button" data-ka-is="harekesiz" title="Harekeleri kaldır" aria-label="Harekeleri kaldır"><span dir="rtl" style="font-family:Arakom,serif">كَ→ك</span></button>' +
        '<button type="button" data-ka-is="temizle" title="Alanı temizle" aria-label="Alanı temizle">' + IK.sil + '</button>' +
      '</span><button type="button" class="ka-kl-tamam" id="kaKlTamam">Tamam</button></div>' +
      '<iframe id="kaKlCerceve" title="Arapça klavye" src="about:blank"></iframe>';
    document.body.appendChild(k);
    var arac = k.querySelector('.ka-kl-arac');
    arac.addEventListener('pointerdown', function (e) { if (e.target.closest('[data-ka-is]')) e.preventDefault(); });
    arac.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ka-is]'); if (!b || !KL.api) return;
      var is = b.getAttribute('data-ka-is');
      if (typeof KL.api[is] === 'function') { try { KL.api[is](); } catch (x) { } }
    });
    k.querySelector('#kaKlTamam').addEventListener('click', kapat);
    return k;
  }
  function olc() {
    var k = document.getElementById('kaKlavye');
    if (k && !k.hidden) document.documentElement.style.setProperty('--ka-kl-y', k.offsetHeight + 'px');
  }
  function yukle(yeni) { if (KL.api && KL.hedef) { try { KL.api.ver(KL.hedef.value, !!yeni); } catch (e) { } } }
  function birak(el) {
    if (!el) return;
    el.classList.remove('ka-hedef');
    if (el.hasAttribute('data-ka-im')) {
      var im = el.getAttribute('data-ka-im');
      if (im) el.setAttribute('inputmode', im); else el.removeAttribute('inputmode');
      el.removeAttribute('data-ka-im');
    }
  }
  function goster(el) {
    try {
      var r = el.getBoundingClientRect(), k = document.getElementById('kaKlavye');
      var alt = innerHeight - (k && !k.hidden ? k.offsetHeight : 0);
      if (r.bottom > alt - 12 || r.top < 8) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } catch (e) { }
  }
  function ac(el) {
    if (!el) return;
    var k = sayfa(), acikti = !k.hidden;
    if (KL.hedef === el && acikti) return;
    if (KL.hedef && KL.hedef !== el) birak(KL.hedef);
    KL.hedef = el; el.classList.add('ka-hedef');
    if (!el.hasAttribute('data-ka-im')) { el.setAttribute('data-ka-im', el.getAttribute('inputmode') || ''); el.setAttribute('inputmode', 'none'); }
    k.querySelector('#kaKlHedef').textContent = el.getAttribute('data-ka-ad') || 'Alan';
    k.hidden = false;
    document.body.classList.add('ka-klavye-acik');
    var f = k.querySelector('#kaKlCerceve');
    if (!KL.yuklendi) { KL.yuklendi = true; f.setAttribute('src', 'arapcaklavye.html?gomulu=1'); }
    else yukle(true);
    olc();
    try {
      if (document.activeElement !== el) el.focus({ preventScroll: true });
      el.setSelectionRange(el.value.length, el.value.length);
    } catch (e) { }
    setTimeout(function () { goster(el); }, 60);
  }
  function kapat() {
    var k = document.getElementById('kaKlavye'); if (k) k.hidden = true;
    document.body.classList.remove('ka-klavye-acik');
    birak(KL.hedef); KL.hedef = null;
  }
  /* gömülü klavye buraya bağlanır (sinifici/arapcaklavye.js · GOMULU) — sayfada başka köprü yoksa */
  if (!window.KidefSoruKlavye) window.KidefSoruKlavye = {
    hazir: function (api) { KL.api = api; yukle(true); },
    al: function () { var t = KL.hedef; return t ? { v: t.value, s: t.selectionStart, e: t.selectionEnd } : null; },
    degisti: function (v, s, e) {
      var t = KL.hedef; if (!t) return;
      t.value = v;
      try { if (document.activeElement !== t) t.focus({ preventScroll: true }); t.setSelectionRange(s, e); } catch (x) { }
      try { t.dispatchEvent(new Event('input', { bubbles: true })); } catch (x) { }
    },
    odak: function () { var t = KL.hedef; if (t && document.activeElement !== t) { try { t.focus({ preventScroll: true }); } catch (x) { } } }
  };
  function kur() {
    if (KL.kuruldu) return; KL.kuruldu = true;
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-ka-kl-ac]');
      if (b) { e.preventDefault(); ac(document.getElementById(b.getAttribute('data-ka-kl-ac'))); }
    });
    document.addEventListener('focusin', function (e) {
      var t = e.target.closest && e.target.closest('[data-ka-kl]');
      var k = document.getElementById('kaKlavye');
      if (t && k && !k.hidden && KL.hedef !== t) ac(t);         /* klavye açıkken başka alana geçilince orada yazar */
    });
    document.addEventListener('keydown', function (e) {
      var k = document.getElementById('kaKlavye');
      if (e.key === 'Escape' && k && !k.hidden) { e.stopPropagation(); kapat(); }
    }, true);
    window.addEventListener('resize', olc);
  }
  window.KidefKlavyeAlt = { kur: kur, ac: ac, kapat: kapat, acikMi: function () { var k = document.getElementById('kaKlavye'); return !!(k && !k.hidden); } };
})();
