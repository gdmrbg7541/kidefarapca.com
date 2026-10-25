/* =====================================================================
   AYLIK YARIŞMA — ANA SAYFA GERİ SAYIM KARTI          sistem/aylikkart.js
   ---------------------------------------------------------------------
                                                            24.10.2026
   Öğretmen: "index te geri sayım olacak, bu geri sayım verilen bi yarışma
   günü ve saatinin geri sayımı olacak ve gizem macera tasarım ruhunu
   taşıyacak … öğrenci girişi olmak zorunda, öğretmenler girememeli bu
   şartlar geri sayımın altında yazsın".
   ayarlar/aylikYarisma belgesini (herkes okur) bir kez okur; görev açıksa
   ana sayfanın başına (#aylikYarisma) gece mavisi bir kart koyar: görev adı,
   geri sayım, açık ligler, şartlar ve tuş (aylikyarisma.html). Kapı açıkken
   «Katıl», kapandıktan sonra sonuçlar; yönetici şampiyonları açıkladıysa
   ilk üçler. Görev yoksa kart görünmez. Ayrıntı: oyunlar/aylikyarisma.js.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefAylikKart) return;
  var A = null, Z = null, son = '';
  var LIG = { temel: ['Temel Lig', '#00f2ff'], orta: ['Orta Lig', '#ff9f43'], ileri: ['İleri Lig', '#c084fc'] };
  var AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  function kac(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function iki(n) { return (n < 10 ? '0' : '') + n; }
  function ms(t) { if (!t) return 0; if (typeof t === 'number') return t; if (t.toMillis) return t.toMillis(); if (t.seconds != null) return t.seconds * 1000; return 0; }
  function saat(t) { var d = new Date(t); return iki(d.getHours()) + ':' + iki(d.getMinutes()); }
  function tarih(t) { var d = new Date(t); return d.getDate() + ' ' + AYLAR[d.getMonth()] + ' ' + GUNLER[d.getDay()] + ' · ' + saat(t); }
  function ligler() { return ['temel', 'orta', 'ileri'].filter(function (l) { return A.ligler && A.ligler[l] && A.ligler[l].length; }); }
  function kapanis() { return A.bas + (A.pencere || 15) * 60000; }
  function sonucZamani() { return kapanis() + (A.soru || 15) * ((A.sure || 20) + 3) * 1000 + 30000; }
  function asama() {
    if (!A || !A.aktif || !A.bas) return 'yok';
    var t = Date.now();
    if (t < A.bas) return 'bekle';
    if (t < kapanis()) return 'acik';
    if (t < sonucZamani()) return 'kapandi';
    if (t < A.bas + 10 * 86400000) return 'sonuc';                 /* sonuçlar 10 gün durur */
    return 'yok';
  }
  function rol() {
    var u = null;
    try { u = firebase.auth().currentUser; } catch (e) { }
    if (!u || u.isAnonymous) return '';
    try { if (typeof appState !== 'undefined' && appState && appState.userRole) return String(appState.userRole); } catch (e) { }
    try { var r = JSON.parse(localStorage.getItem('kidefRolBilgi') || 'null'); if (r && r.uid === u.uid) return r.rol || (r.ogretmen ? 'teacher' : ''); } catch (e) { }
    return '?';
  }

  var STIL = [
    '#aylikYarisma{margin:0 0 14px}',
    '#aylikYarisma[hidden]{display:none}',
    '.ayk{position:relative;overflow:hidden;border-radius:20px;padding:18px 18px 16px;color:#e8ecff;border:1px solid #2a3556;',
    ' background:radial-gradient(ellipse at 50% -20%,#1f2c5a 0%,rgba(19,26,48,0) 60%),radial-gradient(ellipse at 110% 120%,#26164a 0%,rgba(11,13,23,0) 55%),#0b0d17;',
    ' box-shadow:0 14px 40px rgba(11,13,23,.35);font-family:Poppins,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}',
    '.ayk::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.8;background:',
    ' radial-gradient(1px 1px at 8% 20%,#fff9,transparent 60%),radial-gradient(1px 1px at 22% 78%,#fff7,transparent 60%),',
    ' radial-gradient(1.4px 1.4px at 41% 30%,#fffb,transparent 60%),radial-gradient(1px 1px at 63% 85%,#fff7,transparent 60%),',
    ' radial-gradient(1.4px 1.4px at 79% 18%,#fffa,transparent 60%),radial-gradient(1px 1px at 92% 62%,#fff8,transparent 60%),',
    ' radial-gradient(1px 1px at 55% 55%,#fff6,transparent 60%),radial-gradient(1px 1px at 33% 52%,#fff5,transparent 60%)}',
    '.ayk>*{position:relative}',
    '.ayk-ust{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}',
    '.ayk-etiket{font-family:Orbitron,Poppins,sans-serif;font-size:.68rem;letter-spacing:.28em;color:#5c6b94;text-transform:uppercase}',
    '.ayk-ligler{display:flex;gap:6px;flex-wrap:wrap}',
    '.ayk-lig{display:inline-flex;align-items:center;gap:6px;font-size:.72rem;font-weight:700;border:1px solid #2c3a66;border-radius:999px;padding:3px 9px;color:#cdd6f6}',
    '.ayk-lig i{width:8px;height:8px;border-radius:50%;background:var(--r);box-shadow:0 0 8px var(--r)}',
    '.ayk h3{margin:8px 0 2px;font-family:Orbitron,Poppins,sans-serif;font-weight:800;font-size:clamp(1.05rem,3.8vw,1.45rem);letter-spacing:.08em;',
    ' color:#00f2ff;text-shadow:0 0 16px rgba(0,242,255,.55);text-transform:uppercase}',
    '.ayk-gorev{color:#ff9f43;font-weight:700;font-size:.95rem;margin:0 0 10px}',
    '.ayk-orta{display:flex;align-items:center;gap:14px 18px;flex-wrap:wrap}',
    '.ayk-sayac{display:flex;gap:8px;direction:ltr}',
    '.ayk-h{min-width:58px;text-align:center;padding:7px 4px 6px;border-radius:12px;border:1px solid #22335e;background:rgba(9,13,26,.85);box-shadow:inset 0 0 18px rgba(0,242,255,.08)}',
    '.ayk-h b{display:block;font-family:Orbitron,Poppins,sans-serif;font-weight:800;font-size:1.6rem;line-height:1.05;color:#00f2ff;text-shadow:0 0 12px rgba(0,242,255,.6);font-variant-numeric:tabular-nums}',
    '.ayk-h small{display:block;margin-top:3px;font-size:.58rem;letter-spacing:.18em;color:#5c6b94;text-transform:uppercase;font-family:Orbitron,Poppins,sans-serif}',
    '.ayk-tarih{font-size:.86rem;color:#93a0c4}',
    '.ayk-tarih b{color:#e8ecff}',
    '.ayk-tus{display:inline-flex;align-items:center;gap:8px;margin-inline-start:auto;border:0;border-radius:13px;padding:12px 20px;font:inherit;font-weight:800;',
    ' font-size:.98rem;text-decoration:none;color:#1b1004;background:linear-gradient(135deg,#ffb56b,#ff9f43 55%,#ff7a2f);',
    ' box-shadow:0 8px 24px rgba(255,159,67,.35);cursor:pointer;white-space:nowrap}',
    '.ayk-tus:hover{filter:brightness(1.06)}',
    '.ayk-tus.nabiz{animation:aykNabiz 1.6s ease-in-out infinite}',
    '@keyframes aykNabiz{50%{box-shadow:0 8px 34px rgba(255,159,67,.7),0 0 0 6px rgba(255,159,67,.18)}}',
    '.ayk-tus.sakin{color:#e8ecff;background:transparent;border:1px solid #3a4a75;box-shadow:none}',
    '.ayk-sartlar{list-style:none;margin:12px 0 0;padding:10px 0 0;border-top:1px solid #1f2a4a;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:5px 16px}',
    '.ayk-sartlar li{display:flex;gap:8px;font-size:.8rem;line-height:1.4;color:#b9c3e6}',
    '.ayk-sartlar li::before{content:"";flex:none;width:6px;height:6px;margin-top:6px;border-radius:2px;background:#ff9f43;box-shadow:0 0 6px #ff9f43;transform:rotate(45deg)}',
    '.ayk-not{margin:8px 0 0;font-size:.82rem;color:#93a0c4}',
    '.ayk-sampiyon{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-top:4px}',
    '.ayk-sampiyon div{border:1px solid #2c3a66;border-radius:12px;padding:8px 10px;background:rgba(9,13,26,.7)}',
    '.ayk-sampiyon b{display:block;font-family:Orbitron,Poppins,sans-serif;font-size:.68rem;letter-spacing:.16em;color:var(--r);margin-bottom:4px}',
    '.ayk-sampiyon span{display:block;font-size:.84rem;color:#e8ecff}',
    '@media (max-width:560px){.ayk-tus{width:100%;justify-content:center;margin:4px 0 0}.ayk-h{min-width:54px}.ayk-h b{font-size:1.35rem}}',
    '@media (prefers-reduced-motion:reduce){.ayk-tus.nabiz{animation:none}}'
  ].join('\n');

  function kutu() {
    var k = document.getElementById('aylikYarisma');
    if (!k) {
      var hub = document.getElementById('home-hub-section');
      if (!hub) return null;
      k = document.createElement('div'); k.id = 'aylikYarisma';
      hub.insertBefore(k, hub.firstChild);
    }
    if (!document.getElementById('aykStil')) {
      var s = document.createElement('style'); s.id = 'aykStil'; s.textContent = STIL; document.head.appendChild(s);
      var f = document.createElement('link'); f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&display=swap'; document.head.appendChild(f);
    }
    return k;
  }
  function sartlar() {
    return '<ul class="ayk-sartlar">' +
      '<li>Yalnız öğrenci hesabıyla giriş yapanlar katılabilir.</li>' +
      '<li>Öğretmen hesapları katılamaz; bağlantıyı öğrencilerinizle paylaşın.</li>' +
      '<li>Saat gelince «Katıl»a bas; kapı ' + (A.pencere || 15) + ' dakika açık kalır.</li>' +
      '<li>Her öğrenci bir kez yarışır: ' + (A.soru || 15) + ' soru, her biri ' + (A.sure || 20) + ' saniye.</li></ul>';
  }
  function hane(n, ad) { return '<div class="ayk-h"><b>' + iki(n) + '</b><small>' + ad + '</small></div>'; }
  function sayac(hedef) {
    var k = Math.max(0, hedef - Date.now());
    var g = Math.floor(k / 86400000), s = Math.floor(k / 3600000) % 24, d = Math.floor(k / 60000) % 60, sn = Math.floor(k / 1000) % 60;
    return (g > 0 ? hane(g, 'Gün') : '') + hane(s, 'Saat') + hane(d, 'Dakika') + hane(sn, 'Saniye');
  }
  function ciz() {
    var as = asama(), k = kutu();
    if (!k) return;
    var r = rol(), ogretmen = r === 'teacher' || r === 'admin';
    var imza = as + '|' + (A ? A.kod + A.bas + (A.sonucZaman || '') : '') + '|' + r;
    if (as === 'yok') { k.hidden = true; k.innerHTML = ''; son = imza; return; }
    var sayEl = k.querySelector('.ayk-sayac');
    if (imza === son && sayEl) {
      sayEl.innerHTML = sayac(as === 'bekle' ? A.bas : as === 'acik' ? kapanis() : sonucZamani());
      return;
    }
    son = imza;
    var L = ligler();
    var ust = '<div class="ayk-ust"><span class="ayk-etiket">Aylık Türkiye Arapça Yarışması · Görev ' + kac(A.no || 1) + '</span>' +
      '<span class="ayk-ligler">' + L.map(function (l) { return '<span class="ayk-lig" style="--r:' + LIG[l][1] + '"><i></i>' + LIG[l][0] + '</span>'; }).join('') + '</span></div>';
    var h = '<div class="ayk">' + ust;
    if (as === 'bekle') {
      h += '<h3>Zaman Kapısı açılıyor</h3><p class="ayk-gorev">' + kac(A.baslik || '') + '</p>' +
        '<div class="ayk-orta"><div class="ayk-sayac">' + sayac(A.bas) + '</div><div class="ayk-tarih"><b>' + kac(tarih(A.bas)) + '</b><br>Konuları şimdiden çalış.</div>' +
        '<a class="ayk-tus' + (ogretmen ? ' sakin' : '') + '" href="aylikyarisma.html">' + (ogretmen ? 'Görev sayfası' : 'Görev dosyasını aç') + '</a></div>' + sartlar();
    } else if (as === 'acik') {
      h += '<h3>Kapı açık — görev başladı</h3><p class="ayk-gorev">' + kac(A.baslik || '') + '</p>' +
        '<div class="ayk-orta"><div class="ayk-sayac">' + sayac(kapanis()) + '</div><div class="ayk-tarih">Kapının kapanmasına</div>' +
        '<a class="ayk-tus' + (ogretmen ? ' sakin' : ' nabiz') + '" href="aylikyarisma.html">' + (ogretmen ? 'Görev sayfası' : 'Katıl') + '</a></div>' + sartlar();
    } else if (as === 'kapandi') {
      h += '<h3>Kapı kapandı</h3><p class="ayk-gorev">' + kac(A.baslik || '') + '</p>' +
        '<div class="ayk-orta"><div class="ayk-sayac">' + sayac(sonucZamani()) + '</div><div class="ayk-tarih">Sonuçlar <b>' + saat(sonucZamani()) + '</b>\'te</div>' +
        '<a class="ayk-tus sakin" href="aylikyarisma.html">Görev sayfası</a></div>';
    } else {
      var so = A.sonuc || {}, SL = L.filter(function (l) { return so[l] && so[l].length; });
      h += '<h3>Ayın şampiyonları</h3><p class="ayk-gorev">' + kac(A.baslik || '') + '</p>' +
        (SL.length ? '<div class="ayk-sampiyon">' + SL.map(function (l) {
          return '<div style="--r:' + LIG[l][1] + '"><b>' + LIG[l][0].toLocaleUpperCase('tr') + '</b>' +
            so[l].map(function (x, i) { return '<span>' + (i + 1) + '. ' + kac(x.ad) + ' · ' + (x.puan || 0) + '</span>'; }).join('') + '</div>';
        }).join('') + '</div>' : '<p class="ayk-not">Sıralama açıklandı.</p>') +
        '<p class="ayk-not"><a class="ayk-tus sakin" href="aylikyarisma.html" style="margin:6px 0 0">Bütün sıralama</a></p>';
    }
    k.innerHTML = h + '</div>';
    k.hidden = false;
  }
  function basla() {
    var n = 0;
    (function bak() {
      var ok = false;
      try { ok = !!(window.firebase && firebase.apps && firebase.apps.length && firebase.firestore); } catch (e) { }
      if (!ok) { if (++n < 120) setTimeout(bak, 250); return; }
      firebase.firestore().collection('ayarlar').doc('aylikYarisma').get().then(function (d) {
        A = d.exists ? d.data() : null;
        if (A) A.bas = ms(A.bas);
        ciz();
        clearInterval(Z);
        if (asama() !== 'yok') Z = setInterval(ciz, 1000);
      }, function () { });
    })();
  }
  window.KidefAylikKart = { ciz: function () { son = ''; ciz(); }, durum: function () { return { asama: asama(), ayar: A }; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
