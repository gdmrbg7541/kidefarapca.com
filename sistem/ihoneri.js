/* ==========================================================================
   ihoneri.js — SINIF ALGILAMA + IMAM HATIP ONERILERI
   --------------------------------------------------------------------------
   Amac: Listelerim panelinde (index icinde) bir SEVIYE veya SINIF
   tanimlanirken adinda 5-10 arasi bir sinif gecerse (rakamla "10A",
   "9-B", "5/C", araliklarla "5-8. Siniflar", ya da yaziyla "dokuzuncu
   sinif") sistem bunu kendiliginden algilar:
     1) O sinifin IMAM HATIP kategorisindeki rakam tasarimi (animasyonlu
        SVG rozet) seviye/sinif satirinda gorunur — rozet, #imam-hatip
        icindeki CANLI dugumun kopyasidir, yani renk ve animasyon birebir.
     2) Rozete basilinca "oneri" penceresi acilir; o sinifin
        Etkinlikleri / Dokumanlari ve Ogretmen Dokumanlari, gercek
        sayilariyla (DOM'dan okunur) listelenir.
     3) Bir satira basilinca ana sayfaya donulur, #imam-hatip icinde ilgili
        sinif ve ilgili bolum akordiyonu acilir ve ekrana kaydirilir.
   Bagimlilik yok: index.css'e dokunmaz, kendi stilini enjekte eder;
   listelerim.js'i degistirmez, cizim sonrasini MutationObserver ile suslar.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__ihoneriYuklu) return;
  window.__ihoneriYuklu = true;

  var RENK = { 5: '#16A085', 6: '#F39C12', 7: '#2563EB', 8: '#7C3AED', 9: '#EE5253', 10: '#0E9E86' };

  function kucult(s) {
    try { return String(s == null ? '' : s).toLocaleLowerCase('tr'); }
    catch (e) { return String(s == null ? '' : s).toLowerCase(); }
  }

  /* =======================================================================
     1) ALGILAYICI
     ===================================================================== */
  var SIRALI = {
    'beşinci': 5, 'besinci': 5, 'altıncı': 6, 'altinci': 6, 'yedinci': 7,
    'sekizinci': 8, 'dokuzuncu': 9, 'onuncu': 10
  };
  var CIPLAK = {
    'beş': 5, 'bes': 5, 'altı': 6, 'alti': 6, 'yedi': 7,
    'sekiz': 8, 'dokuz': 9, 'on': 10
  };
  var EK = '(sınıf|sinif|seviye|şube|sube|sinifi|sınıfı)';

  function bul(metin) {
    if (!metin) return [];
    var t = kucult(metin), cikti = {};

    /* a) aralik: "5-8. Siniflar", "6 – 9 siniflar", "7/8. sinif" */
    t.replace(/(10|[1-9])\s*[-–—/]\s*(10|[1-9])(?!\d)/g, function (tam, a, b) {
      a = +a; b = +b;
      if (a < b && b - a <= 5) { for (var i = a; i <= b; i++) if (i >= 5 && i <= 10) cikti[i] = 1; }
      return tam;
    });

    /* b) duz rakam: "10A" -> 10, "9-B" -> 9, "5/C" -> 5.
          "12A", "2025", "11. Sinif" ELENIR (onunde/arkasinda rakam olamaz). */
    var m, re = /(?:^|[^\d])(10|[5-9])(?!\d)/g;
    while ((m = re.exec(t)) !== null) cikti[+m[1]] = 1;

    /* c) sirali sayi sozcukleri: "dokuzuncu sinif" */
    for (var k in SIRALI) if (SIRALI.hasOwnProperty(k) && t.indexOf(k) >= 0) cikti[SIRALI[k]] = 1;

    /* d) ciplak sayi sozcugu — YALNIZ sinif/seviye/sube ile birlikte */
    for (var c in CIPLAK) {
      if (!CIPLAK.hasOwnProperty(c)) continue;
      try {
        if (new RegExp('(?:^|[^a-zçğıöşü])' + c + '\\s*\\.?\\s*' + EK).test(t)) cikti[CIPLAK[c]] = 1;
      } catch (e) { }
    }

    var liste = [];
    for (var n in cikti) if (cikti.hasOwnProperty(n)) { n = +n; if (n >= 5 && n <= 10) liste.push(n); }
    return liste.sort(function (x, y) { return x - y; });
  }
  window.ihoBul = bul;

  /* =======================================================================
     2) ROZET — #imam-hatip'teki CANLI rakam tasariminin kopyasi
     ===================================================================== */
  var _kaynakOnbellek = {};

  function ihKok() { return document.getElementById('imam-hatip'); }

  function sinifItem(n) {
    var kok = ihKok(); if (!kok) return null;
    var bulunan = null;
    [].forEach.call(kok.querySelectorAll('.ih-acc > .ih-item'), function (it) {
      if (bulunan) return;
      var r = it.querySelector('.ihn-rakam');
      if (r && parseInt(String(r.textContent).trim(), 10) === n) bulunan = it;
    });
    return bulunan;
  }

  function rozetKaynak(n) {
    if (_kaynakOnbellek[n]) return _kaynakOnbellek[n];
    var it = sinifItem(n);
    var num = it ? it.querySelector('.ih-num') : null;
    if (num) _kaynakOnbellek[n] = num;
    return num;
  }

  /* #imam-hatip henuz yoksa/gec yuklendiyse: ayni gorunumde yedek rozet */
  function yedekRozet(n) {
    var ns = 'http://www.w3.org/2000/svg';
    var sp = document.createElementNS(ns, 'svg');
    sp.setAttribute('viewBox', '0 0 48 48');
    var d = document.createElementNS(ns, 'circle');
    d.setAttribute('class', 'ihn-disk');
    d.setAttribute('cx', '24'); d.setAttribute('cy', '24'); d.setAttribute('r', '15');
    d.setAttribute('fill', RENK[n] || '#16A085');
    var t = document.createElementNS(ns, 'text');
    t.setAttribute('class', 'ihn-rakam');
    t.setAttribute('x', '24'); t.setAttribute('y', n === 10 ? '30' : '30.5');
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('font-size', n === 10 ? '15' : '19');
    t.setAttribute('font-weight', '800'); t.setAttribute('fill', '#fff');
    t.setAttribute('font-family', "'Marhey',system-ui,sans-serif");
    t.textContent = String(n);
    sp.appendChild(d); sp.appendChild(t);
    var sar = document.createElement('span');
    sar.className = 'ih-num';
    sar.appendChild(sp);
    return sar;
  }

  function rozetYap(n, boy, baslik) {
    var kaynak = rozetKaynak(n);
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'iho-rozet';
    b.setAttribute('data-iho-sinif', String(n));
    b.style.width = boy + 'px';
    b.style.height = boy + 'px';
    b.style.setProperty('--ihc', RENK[n] || '#16A085');
    b.title = baslik || (n + '. Sınıf · İmam Hatip evrak ve etkinlikleri');
    b.setAttribute('aria-label', b.title);
    b.appendChild(kaynak ? kaynak.cloneNode(true) : yedekRozet(n));
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      popupAc(n);
    });
    return b;
  }

  /* =======================================================================
     3) SAYIMLAR — hepsi #imam-hatip DOM'undan okunur (uydurma sayi yok)
     ===================================================================== */
  function sayimlar(n) {
    var s = { etkinlik: '', dokKategori: 0, dokDosya: 0, ogrDok: 0 };
    var it = sinifItem(n);
    if (it) {
      [].forEach.call(it.querySelectorAll('.ihsec-item'), function (sec) {
        var bas = sec.querySelector('.ihsec-title');
        var t = kucult(bas ? bas.textContent : '');
        if (/etkinlik/.test(t)) {
          var rz = sec.querySelector('.status-badge');
          if (rz) s.etkinlik = String(rz.textContent).trim();
        } else if (/dok|dök/.test(t)) {
          s.dokKategori = sec.querySelectorAll('.a4-kart').length;
          [].forEach.call(sec.querySelectorAll('.a4-sayac'), function (x) {
            var m = String(x.textContent).match(/\d+/);
            if (m) s.dokDosya += +m[0];
          });
        }
      });
    }
    var g = document.querySelector('#imam-hatip .ih-genel-dok');
    if (g) s.ogrDok = g.querySelectorAll('.a4-kart').length;
    return s;
  }

  /* =======================================================================
     4) ONERI PENCERESI
     ===================================================================== */
  var _pop = null;

  function popupKur() {
    if (_pop) return _pop;
    _pop = document.createElement('div');
    _pop.id = 'ihoPop';
    _pop.setAttribute('role', 'dialog');
    _pop.setAttribute('aria-modal', 'true');
    _pop.innerHTML =
      '<div class="iho-perde"></div>' +
      '<div class="iho-kutu">' +
      '  <button type="button" class="iho-kapat" aria-label="Kapat">✕</button>' +
      '  <div class="iho-bas"><span class="iho-buyuk"></span>' +
      '    <span class="iho-bas-metin"><b></b><small></small></span></div>' +
      '  <div class="iho-satirlar"></div>' +
      '  <div class="iho-alt">Bu öneriler <b>İmam Hatip</b> kategorisindeki hazır çalışmalardan gelir.</div>' +
      '</div>';
    document.body.appendChild(_pop);
    _pop.querySelector('.iho-perde').addEventListener('click', popupKapat);
    _pop.querySelector('.iho-kapat').addEventListener('click', popupKapat);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && _pop && _pop.classList.contains('acik')) popupKapat();
    });
    return _pop;
  }

  function satirYap(ikon, ad, bilgi, tik, pasif) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'iho-satir' + (pasif ? ' iho-pasif' : '');
    b.innerHTML = '<span class="iho-s-ikon">' + ikon + '</span>' +
      '<span class="iho-s-metin"><b></b><small></small></span>' +
      '<span class="iho-s-ok">›</span>';
    b.querySelector('b').textContent = ad;
    b.querySelector('small').textContent = bilgi;
    b.addEventListener('click', tik);
    return b;
  }

  function popupAc(n) {
    var p = popupKur(), s = sayimlar(n);
    var buyuk = p.querySelector('.iho-buyuk');
    buyuk.innerHTML = '';
    var kaynak = rozetKaynak(n);
    buyuk.appendChild(kaynak ? kaynak.cloneNode(true) : yedekRozet(n));
    buyuk.style.setProperty('--ihc', RENK[n] || '#16A085');

    p.querySelector('.iho-bas-metin b').textContent = n + '. Sınıf';
    p.querySelector('.iho-bas-metin small').textContent = 'İmam Hatip · hazır evrak ve etkinlikler';
    p.querySelector('.iho-kutu').style.setProperty('--ihc', RENK[n] || '#16A085');

    var kap = p.querySelector('.iho-satirlar');
    kap.innerHTML = '';

    var etkBilgi = s.etkinlik || 'Ünite ve ders listesi';
    kap.appendChild(satirYap(
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3" fill="#EAF7F3"/><path d="M7 9h10M7 13h7" stroke="#16A085" stroke-width="2" stroke-linecap="round"/><circle cx="17.5" cy="14.5" r="3" fill="#F39C12"/></svg>',
      n + '. Sınıf Etkinlikleri', etkBilgi,
      function () { window.ihSinifAc(n, 'etkinlik'); }));

    var dokBilgi = s.dokKategori
      ? (s.dokKategori + ' kategori' + (s.dokDosya ? ' · ' + s.dokDosya + ' dosya' : ''))
      : 'Planlar, sınavlar, çalışma kâğıtları';
    kap.appendChild(satirYap(
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.4" y="3.6" width="12.2" height="16" rx="2" fill="#EEE7FB" stroke="#7C3AED" stroke-width="1.4"/><rect x="3.4" y="5.4" width="12.2" height="16" rx="2" fill="#fff" stroke="#2563EB" stroke-width="1.4"/><rect x="6" y="10" width="7" height="1.6" rx=".8" fill="#F39C12"/><rect x="6" y="13.4" width="7" height="1.6" rx=".8" fill="#16A085"/></svg>',
      n + '. Sınıf Dökümanları', dokBilgi,
      function () { window.ihSinifAc(n, 'dokuman'); }));

    kap.appendChild(satirYap(
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l8.4 4.2-8.4 4.2L3.6 7.4z" fill="#EE5253"/><path d="M6.4 9.6v4.6c0 1.9 2.5 3.4 5.6 3.4s5.6-1.5 5.6-3.4V9.6" fill="none" stroke="#EE5253" stroke-width="1.8" stroke-linecap="round"/><path d="M20.4 7.4v6" stroke="#F39C12" stroke-width="1.8" stroke-linecap="round"/></svg>',
      'Öğretmen Dökümanları', s.ogrDok ? (s.ogrDok + ' belge seti') : 'Zümre, yıllık plan, mevzuat',
      function () { window.ihSinifAc(n, 'ogretmen'); }));

    p.classList.add('acik');
    document.documentElement.classList.add('iho-kilit');
  }
  window.ihoPopAc = popupAc;

  function popupKapat() {
    if (!_pop) return;
    _pop.classList.remove('acik');
    document.documentElement.classList.remove('iho-kilit');
  }
  window.ihoPopKapat = popupKapat;

  /* =======================================================================
     5) KOPRU — ana sayfaya don, sinifi ve bolumu ac
     ===================================================================== */
  window.ihSinifAc = function (n, bolum) {
    popupKapat();
    try { if (typeof changeView === 'function') changeView('home-hub-section'); } catch (e) { }

    setTimeout(function () {
      var it = sinifItem(n);
      if (!it) return;
      try { ihKok().scrollIntoView({ behavior: 'auto', block: 'start' }); } catch (e) { }

      var bas = it.querySelector('.ih-head');
      if (bas && !it.classList.contains('acik')) bas.click();

      setTimeout(function () {
        var hedef = null;
        if (bolum === 'ogretmen') {
          hedef = document.querySelector('#imam-hatip .ih-genel-dok .ihsec-head');
        } else {
          [].forEach.call(it.querySelectorAll('.ihsec-item'), function (sec) {
            if (hedef) return;
            var b = sec.querySelector('.ihsec-title');
            var t = kucult(b ? b.textContent : '');
            if (bolum === 'etkinlik' && /etkinlik/.test(t)) hedef = sec.querySelector('.ihsec-head');
            else if (bolum === 'dokuman' && /dok|dök/.test(t)) hedef = sec.querySelector('.ihsec-head');
          });
        }
        if (!hedef) return;
        var kap = hedef.closest('.ihsec-item');
        if (kap && !kap.classList.contains('acik')) hedef.click();
        else { try { hedef.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { } }
      }, 780);
    }, 280);
  };

  /* =======================================================================
     6) DEKORASYON — dort ayri yerleşim noktasi
     ===================================================================== */
  var _calisiyor = false;

  function serit(siniflar, boy) {
    var s = document.createElement('span');
    s.className = 'iho-serit';
    s.setAttribute('data-iho', '1');
    siniflar.forEach(function (n) { s.appendChild(rozetYap(n, boy)); });
    return s;
  }

  function suslendiMi(el) { return !!(el && el.getAttribute('data-iho-sus')); }
  function isaretle(el) { if (el) el.setAttribute('data-iho-sus', '1'); }

  function taraKenar() {
    var nav = document.getElementById('levelNav');
    if (!nav) return;

    /* A) Seviye basligi — ad icinde gecen TUM siniflar */
    [].forEach.call(nav.querySelectorAll('.level-head'), function (bas) {
      if (suslendiMi(bas)) return;
      isaretle(bas);
      var ad = bas.querySelector(':scope > span');
      var siniflar = bul(ad ? ad.textContent : '');
      if (!siniflar.length) return;
      var sr = serit(siniflar, 26);
      sr.classList.add('iho-serit-seviye');
      var et = document.createElement('small');
      et.className = 'iho-etiket';
      et.textContent = 'İmam Hatip çalışmaları';
      sr.appendChild(et);
      bas.appendChild(sr);
    });

    /* B) Sinif satiri — ilk algilanan sinif */
    [].forEach.call(nav.querySelectorAll('.class-item'), function (sat) {
      if (suslendiMi(sat)) return;
      isaretle(sat);
      var bag = sat.querySelector('.class-link');
      if (!bag) return;
      var siniflar = bul(bag.textContent);
      if (!siniflar.length) {
        /* sinif adinda yoksa ust seviyenin adindan miras al (or. "10. Siniflar" > "A") */
        var kap = sat.closest('.level-container');
        var ust = kap ? kap.querySelector('.level-head > span') : null;
        siniflar = ust ? bul(ust.textContent) : [];
        if (siniflar.length !== 1) return;
      }
      sat.insertBefore(rozetYap(siniflar[0], 24), bag);
      sat.classList.add('iho-var');
    });
  }

  function taraProfil() {
    var sec = document.getElementById('student-profile-section');
    if (!sec) return;

    /* C) Profil kartindaki seviye basligi */
    [].forEach.call(sec.querySelectorAll('button[onclick^="openLvlConfig("]'), function (tus) {
      var satir = tus.parentNode;
      if (!satir || suslendiMi(satir)) return;
      isaretle(satir);
      var b = satir.querySelector('b');
      var siniflar = bul(b ? b.textContent : '');
      if (!siniflar.length) return;
      var sr = serit(siniflar, 30);
      satir.insertBefore(sr, tus);
    });

    /* D) Profil kartindaki sinif rozetleri */
    [].forEach.call(sec.querySelectorAll('button[onclick^="llProfilSinifSec("]'), function (tus) {
      var sar = tus.parentNode;
      if (!sar || suslendiMi(sar)) return;
      isaretle(sar);
      var siniflar = bul(tus.textContent);
      if (!siniflar.length) return;
      sar.insertBefore(rozetYap(siniflar[0], 26), tus);
    });
  }

  function tara() {
    if (_calisiyor) return;
    _calisiyor = true;
    try { taraKenar(); taraProfil(); } catch (e) { try { console.warn('ihoneri:', e); } catch (e2) { } }
    /* kendi eklediklerimiz gozlemciyi tetiklemesin diye bir tik bekle */
    setTimeout(function () { _calisiyor = false; }, 0);
  }
  window.ihoTara = tara;

  /* =======================================================================
     7) GOZLEMCI — renderSidebar / renderTeacherProfile innerHTML'i ezince
     ===================================================================== */
  var _zaman = null;
  function ertele() {
    if (_calisiyor) return;
    clearTimeout(_zaman);
    _zaman = setTimeout(function () { tara(); yeniSinifKontrol(); }, 140);
  }

  function gozle() {
    if (typeof MutationObserver !== 'function') return;
    var g = new MutationObserver(ertele);
    ['levelNav', 'student-profile-section', 'llProfilKart'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) g.observe(el, { childList: true, subtree: true });
    });
  }

  /* =======================================================================
     8) addLevel / addClass sarmalayicisi + bildirim seridi
     ===================================================================== */
  var _bilinen = null;

  function suankiSiniflar() {
    var k = {};
    [].forEach.call(document.querySelectorAll('#levelNav [data-iho-sinif]'), function (el) {
      k[el.getAttribute('data-iho-sinif')] = 1;
    });
    return k;
  }

  function yeniSinifKontrol() {
    var simdi = suankiSiniflar();
    if (_bilinen === null) { _bilinen = simdi; return; }
    var yeni = [];
    for (var n in simdi) if (simdi.hasOwnProperty(n) && !_bilinen[n]) yeni.push(+n);
    _bilinen = simdi;
    if (yeni.length) mujde(yeni.sort(function (a, b) { return a - b; }));
  }

  function mujde(siniflar) {
    var eski = document.getElementById('ihoMujde');
    if (eski && eski.parentNode) eski.parentNode.removeChild(eski);
    var d = document.createElement('div');
    d.id = 'ihoMujde';
    d.className = 'iho-mujde';
    var rz = document.createElement('span');
    rz.className = 'iho-mujde-rozet';
    siniflar.slice(0, 3).forEach(function (n) { rz.appendChild(rozetYap(n, 34)); });
    var yz = document.createElement('span');
    yz.className = 'iho-mujde-metin';
    yz.innerHTML = '<b></b><small>İmam Hatip evrak ve etkinlikleri hazır — göz atmak için rozete bas.</small>';
    yz.querySelector('b').textContent =
      siniflar.map(function (n) { return n + '. Sınıf'; }).join(', ') + ' algılandı';
    var kp = document.createElement('button');
    kp.type = 'button'; kp.className = 'iho-mujde-kapat'; kp.textContent = '✕';
    kp.setAttribute('aria-label', 'Kapat');
    kp.addEventListener('click', function () { if (d.parentNode) d.parentNode.removeChild(d); });
    d.appendChild(rz); d.appendChild(yz); d.appendChild(kp);
    document.body.appendChild(d);
    setTimeout(function () { d.classList.add('acik'); }, 20);
    setTimeout(function () {
      d.classList.remove('acik');
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 400);
    }, 9000);
  }

  function sarmala(ad) {
    var esk = window[ad];
    if (typeof esk !== 'function' || esk._iho) return false;
    var yeni = function () {
      var sonuc = esk.apply(this, arguments);
      setTimeout(function () { tara(); yeniSinifKontrol(); }, 80);
      return sonuc;
    };
    yeni._iho = true;
    try { window[ad] = yeni; } catch (e) { return false; }
    return true;
  }

  /* =======================================================================
     9) STIL — index.css'e dokunmadan enjekte
     ===================================================================== */
  function stilKur() {
    if (document.getElementById('ihoStil')) return;
    var s = document.createElement('style');
    s.id = 'ihoStil';
    s.textContent = [
      '.iho-rozet{flex:none;display:inline-flex;align-items:center;justify-content:center;',
      '  padding:0;border:none;background:transparent;cursor:pointer;line-height:0;vertical-align:middle;',
      '  border-radius:50%;transition:transform .18s ease,box-shadow .18s ease;}',
      '.iho-rozet .ih-num{width:100%!important;height:100%!important;display:block;border-radius:50%;}',
      '.iho-rozet .ih-num svg{width:100%;height:100%;display:block;overflow:visible;}',
      '.iho-rozet:hover,.iho-rozet:focus-visible{transform:scale(1.14);outline:none;',
      '  box-shadow:0 0 0 3px rgba(255,255,255,.35),0 4px 12px rgba(0,0,0,.22);}',
      '.iho-serit{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}',
      '.iho-serit-seviye{margin-top:2px;padding:4px 6px;border-radius:9px;',
      '  background:rgba(255,255,255,.10);}',
      '.iho-etiket{font-size:.66rem;font-weight:700;letter-spacing:.3px;opacity:.75;',
      '  margin-left:2px;white-space:nowrap;}',
      '#ll-root #sidebar .iho-serit-seviye{background:rgba(156,59,12,.08);}',
      '#ll-root #sidebar .iho-etiket{color:#9C3B0C;}',
      '.class-item.iho-var{gap:7px;}',

      /* ---- oneri penceresi ---- */
      'html.iho-kilit{overflow:hidden;}',
      '#ihoPop{position:fixed;inset:0;z-index:100000;display:none;}',
      '#ihoPop.acik{display:block;}',
      '#ihoPop .iho-perde{position:absolute;inset:0;background:rgba(30,20,14,.55);',
      '  backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);animation:ihoPerde .22s ease;}',
      '#ihoPop .iho-kutu{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);',
      '  width:min(460px,calc(100vw - 28px));max-height:calc(100vh - 40px);overflow:auto;',
      '  background:#fff;border-radius:20px;padding:20px 20px 16px;',
      '  box-shadow:0 26px 70px rgba(0,0,0,.34);animation:ihoKutu .26s cubic-bezier(.2,.9,.3,1.2);',
      '  font-family:inherit;}',
      '#ihoPop .iho-kapat{position:absolute;top:10px;right:12px;border:none;background:#F1F3F5;',
      '  color:#6B4A38;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:.95rem;',
      '  font-family:inherit;line-height:1;}',
      '#ihoPop .iho-kapat:hover{background:#E4E8EB;}',
      '#ihoPop .iho-bas{display:flex;align-items:center;gap:14px;padding-right:34px;}',
      '#ihoPop .iho-buyuk{flex:none;width:76px;height:76px;display:block;}',
      '#ihoPop .iho-buyuk .ih-num{width:100%!important;height:100%!important;display:block;}',
      '#ihoPop .iho-buyuk .ih-num svg{width:100%;height:100%;overflow:visible;display:block;}',
      '#ihoPop .iho-bas-metin{display:flex;flex-direction:column;gap:3px;min-width:0;}',
      '#ihoPop .iho-bas-metin b{font-size:1.42rem;color:#5A4034;line-height:1.1;}',
      '#ihoPop .iho-bas-metin small{font-size:.84rem;color:#8B6A57;}',
      '#ihoPop .iho-satirlar{display:flex;flex-direction:column;gap:9px;margin-top:16px;}',
      '#ihoPop .iho-satir{display:flex;align-items:center;gap:12px;width:100%;text-align:left;',
      '  border:1px solid #E9EEF5;border-radius:13px;background:#F7F9FC;padding:11px 13px;',
      '  cursor:pointer;font-family:inherit;transition:background .16s ease,border-color .16s ease,transform .16s ease;}',
      '#ihoPop .iho-satir:hover{background:#fff;border-color:var(--ihc,#16A085);transform:translateX(3px);}',
      '#ihoPop .iho-s-ikon{flex:none;width:38px;height:38px;display:block;}',
      '#ihoPop .iho-s-ikon svg{width:100%;height:100%;display:block;}',
      '#ihoPop .iho-s-metin{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}',
      '#ihoPop .iho-s-metin b{font-size:1rem;color:#5A4034;}',
      '#ihoPop .iho-s-metin small{font-size:.79rem;color:#8B6A57;}',
      '#ihoPop .iho-s-ok{flex:none;font-size:1.4rem;color:var(--ihc,#16A085);line-height:1;}',
      '#ihoPop .iho-alt{margin-top:14px;font-size:.75rem;color:#9A8577;text-align:center;}',
      '@keyframes ihoPerde{from{opacity:0}to{opacity:1}}',
      '@keyframes ihoKutu{from{opacity:0;transform:translate(-50%,-46%) scale(.94)}',
      '  to{opacity:1;transform:translate(-50%,-50%) scale(1)}}',

      /* ---- yeni sinif bildirimi ---- */
      '.iho-mujde{position:fixed;left:50%;bottom:22px;transform:translate(-50%,26px);z-index:100001;',
      '  display:flex;align-items:center;gap:12px;max-width:min(520px,calc(100vw - 24px));',
      '  background:#fff;border-radius:16px;padding:12px 14px;opacity:0;pointer-events:none;',
      '  box-shadow:0 16px 44px rgba(0,0,0,.26);transition:opacity .3s ease,transform .3s ease;',
      '  font-family:inherit;}',
      '.iho-mujde.acik{opacity:1;transform:translate(-50%,0);pointer-events:auto;}',
      '.iho-mujde-rozet{display:flex;align-items:center;gap:5px;flex:none;}',
      '.iho-mujde-metin{display:flex;flex-direction:column;gap:2px;min-width:0;}',
      '.iho-mujde-metin b{font-size:.96rem;color:#5A4034;}',
      '.iho-mujde-metin small{font-size:.78rem;color:#8B6A57;}',
      '.iho-mujde-kapat{flex:none;border:none;background:#F1F3F5;color:#6B4A38;width:28px;height:28px;',
      '  border-radius:50%;cursor:pointer;font-family:inherit;line-height:1;}',
      '@media (max-width:600px){',
      '  .iho-etiket{display:none;}',
      '  #ihoPop .iho-buyuk{width:62px;height:62px;}',
      '  #ihoPop .iho-bas-metin b{font-size:1.2rem;}',
      '  .iho-mujde{left:12px;right:12px;transform:translate(0,26px);max-width:none;}',
      '  .iho-mujde.acik{transform:translate(0,0);}',
      '}',
      'html.dusuk-guc .iho-rozet{transition:none;}',
      'html.dusuk-guc #ihoPop .iho-kutu,html.dusuk-guc #ihoPop .iho-perde{animation:none;}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* =======================================================================
     10) BASLAT
     ===================================================================== */
  function baslat() {
    stilKur();
    gozle();
    tara();
    yeniSinifKontrol();
    /* listelerim.js bizden sonra da yuklenebilir: sarmalayiciyi yakalayana
       kadar birkac kez dene (kisa araliklarla, en fazla ~12 sn) */
    var kalan = 40;
    var t = setInterval(function () {
      var a = sarmala('addLevel'), b = sarmala('addClass');
      var c = sarmala('editLevelName'), d = sarmala('editClassName');
      if ((a && b) || --kalan <= 0) clearInterval(t);
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(baslat, 400); });
  } else {
    setTimeout(baslat, 400);
  }
})();
