/* ===========================================================================
   SINAV GÖNDER — sistem/sinavgonder.js                              (14.11.2026)
   ---------------------------------------------------------------------------
   Öğretmen: "sınıf listelerinde görev gönder kısmı var, oraya şu sistemi
   entegre edelim, sınav gönder … sitedeki klavye sistemini ve sınav hazırlama
   sistemini kullanarak öğretmenin kendi hazırladığı bi sınavı 100 puan
   üzerinden hesaplayacak bi sistem yapalım … arayüz basit olsun, sınavı
   hazırlayıp öğrencilere görev olarak gönderebilsin."
   Kararlar: karma soru (çoktan seçmeli ve doğru/yanlış kendiliğinden, açık uçluyu
   öğretmen puanlar) · puanı öğretmen de girebilir, girmezse kalan puan soru
   sayısına göre kendiliğinden dağılır · Görev Gönder penceresinde «Sınav» sekmesi.

   VERİ
     gorevler/{id}         görev (tur:'sinav', oyun:'sinavcoz.html') + sinav:{ad, kurum,
                           ogretmenAd, seviyeAd, sureDk, sorular:[{t, soru, ar, sik, puan}]}
                           — CEVAPSIZ: öğrenci görevi okuyabildiği için anahtar burada yok.
     sinavAnahtar/{id}     yalnız öğretmen: cevap:[…], puanlar:{uid:{oto, elle, toplam, t}}
     gorevSonuc/{id_uid}   öğrencinin cevapları (sinavcoz.html yazar; eski kural yeter)
     sinavNot/{id_uid}     öğretmenin tarayıcısı hesaplayıp yazar; öğrenci kendi notunu okur
   PUANLAMA öğretmenin tarayıcısında: sonuç dinleyicisi cevabı görünce anahtarla
   hesaplar, değiştiyse sinavNot'u yazar (cevap anahtarı öğrenciye hiç inmez).
   =========================================================================== */
(function () {
  'use strict';
  if (window.KidefSinav) return;
  var SV = window.KidefSinav = {};
  var C_GRV = 'gorevler', C_ANH = 'sinavAnahtar', C_NOT = 'sinavNot';
  var HARF = ['A', 'B', 'C', 'Ç', 'D'];
  var TUR_AD = { test: 'Çoktan seçmeli', dy: 'Doğru / Yanlış', acik: 'Açık uçlu' };

  /* ---------------------------------------------------------- yardımcılar */
  function fb() { return (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) ? firebase : null; }
  function oturum() { var f = fb(); try { return (f && f.auth) ? f.auth().currentUser : null; } catch (e) { return null; } }
  function veri() { var f = fb(); if (!f) return null; try { if (typeof db !== 'undefined' && db) return db; return f.firestore(); } catch (e) { return null; } }
  function rol() { try { return (typeof appState !== 'undefined' && appState.userRole) ? appState.userRole : ''; } catch (e) { return ''; } }
  function ogretmenMi() { var r = rol(); return r === 'teacher' || r === 'admin'; }
  function veriAl() { return (typeof data !== 'undefined' && data) ? data : null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sade(s) { return String(s || '').replace(/[ً-ْٰـ]/g, '').replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').toLocaleLowerCase('tr').replace(/[\s.,;:!?،؛؟'"()\-]+/g, ' ').trim(); }
  function trTarih(ts) { if (!ts) return ''; var d = new Date(ts), i = function (n) { return String(n).padStart(2, '0'); }; return i(d.getDate()) + '.' + i(d.getMonth() + 1) + '.' + d.getFullYear(); }
  var IK = {
    kl: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6 10h1M9.5 10h1M13 10h1M16.5 10h1M7 14h10"/></svg>',
    yukari: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg>',
    asagi: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 10 6 6 6-6"/></svg>',
    sil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
    arti: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    onay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    uyari: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 20h20Z"/><path d="M12 10v4M12 17h.01"/></svg>',
    kagit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 12h6M10 16h6"/></svg>',
    kalem: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>'
  };

  /* ---------------------------------------------------------- stil */
  function stil() {
    if (document.getElementById('svStil')) return;
    var s = document.createElement('style'); s.id = 'svStil';
    s.textContent =
      '.sv-k svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex:none;}' +
      '.sv-k{font-family:inherit;color:#6B4A38;}' +
      '.sv-k .sv-ust{display:grid;grid-template-columns:1fr 1fr;gap:10px;}' +
      '.sv-k label.sv-e{display:block;margin:0 0 5px;font-size:.8rem;font-weight:700;color:#9C3B0C;}' +
      '.sv-k input[type=text],.sv-k input[type=number],.sv-k input[type=date],.sv-k select,.sv-k textarea{width:100%;box-sizing:border-box;padding:10px;border:1px solid #E8A87C;' +
        'border-radius:10px;font-family:inherit;font-size:.92rem;color:#5A3D2E;background:#fff;}' +
      '.sv-k textarea{resize:vertical;min-height:42px;line-height:1.5;}' +
      '.sv-k textarea.ar,.sv-k input.ar{font-family:Arakom,serif;font-size:1.25rem;direction:rtl;}' +
      '.sv-k .sv-tam{grid-column:1/-1;}' +
      '.sv-k .sv-bilgi{grid-column:1/-1;font-size:.8rem;color:#8B6A57;background:#FFF1E4;border-radius:10px;padding:8px 11px;line-height:1.5;}' +
      '.sv-k .sv-sorular{margin-top:14px;display:grid;gap:12px;}' +
      '.sv-k .sv-soru{background:#fff;border:1.5px solid #F3D5BF;border-radius:14px;padding:12px;box-shadow:0 2px 8px rgba(216,67,21,.06);}' +
      '.sv-k .sv-sb{display:flex;align-items:center;gap:8px;margin-bottom:9px;flex-wrap:wrap;}' +
      '.sv-k .sv-no{width:30px;height:30px;border-radius:50%;background:#D84315;color:#fff;display:grid;place-items:center;font-weight:800;flex:none;}' +
      '.sv-k .sv-tur{display:inline-flex;border:1px solid #F0C9A6;border-radius:10px;overflow:hidden;}' +
      '.sv-k .sv-tur button{border:0;background:#fff;color:#8B6A57;padding:7px 10px;font:700 .78rem/1 inherit;cursor:pointer;}' +
      '.sv-k .sv-tur button.on{background:#D84315;color:#fff;}' +
      '.sv-k .sv-bos{flex:1;}' +
      '.sv-k .sv-ib{width:34px;height:34px;border-radius:10px;border:1px solid #F0DACA;background:#FFF8F2;color:#B34700;display:inline-grid;place-items:center;cursor:pointer;}' +
      '.sv-k .sv-ib:hover{background:#FFE9D6;}' +
      '.sv-k .sv-ib.sil:hover{background:#FDE2DF;color:#C0392B;}' +
      '.sv-k .sv-sat{display:flex;gap:6px;align-items:flex-start;}' +
      '.sv-k .sv-sat > textarea,.sv-k .sv-sat > input{flex:1;}' +
      '.sv-k .sv-kl{flex:none;width:40px;height:42px;border-radius:10px;border:1px solid #BFE5DB;background:#E9F7F3;color:#0E7C66;display:grid;place-items:center;cursor:pointer;}' +
      '.sv-k .sv-alan{margin-top:8px;}' +
      '.sv-k .sv-alan > small{display:block;font-size:.76rem;color:#A6836E;margin:0 0 4px;font-weight:700;}' +
      '.sv-k .sv-sik{display:flex;gap:6px;align-items:center;margin-top:6px;}' +
      '.sv-k .sv-sik .sv-h{width:30px;height:30px;flex:none;border-radius:50%;border:2px solid #E8A87C;display:grid;place-items:center;font-weight:800;color:#B34700;cursor:pointer;background:#fff;}' +
      '.sv-k .sv-sik .sv-h.on{background:#16A085;border-color:#16A085;color:#fff;}' +
      '.sv-k .sv-dy{display:flex;gap:8px;margin-top:8px;}' +
      '.sv-k .sv-dy button{flex:1;padding:10px;border-radius:10px;border:1.5px solid #E8A87C;background:#fff;font:800 .9rem/1 inherit;color:#8B6A57;cursor:pointer;}' +
      '.sv-k .sv-dy button.on{background:#16A085;border-color:#16A085;color:#fff;}' +
      '.sv-k .sv-puan{display:flex;align-items:center;gap:6px;font-size:.8rem;font-weight:700;color:#8B6A57;}' +
      '.sv-k .sv-puan input{width:70px;text-align:center;padding:7px;}' +
      '.sv-k .sv-puan.oto input{border-style:dashed;}' +
      '.sv-k .sv-ekle{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;}' +
      '.sv-k .sv-ekle button{flex:1;min-width:140px;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:11px;border-radius:12px;' +
        'border:1.5px dashed #E8A87C;background:#FFF6EC;color:#B34700;font:800 .86rem/1 inherit;cursor:pointer;}' +
      '.sv-k .sv-ozet{margin:14px 0 0;padding:12px 0 0;border-top:1px solid #F3E2D3;}' +
      '#gvGovde .sv-k .sv-ozet{position:sticky;bottom:-16px;margin:14px -16px -16px;padding:12px 16px;background:#FFF8F2;}' +
      '.sv-k .sv-toplam{display:flex;align-items:center;gap:8px;font-weight:800;font-size:.95rem;}' +
      '.sv-k .sv-toplam.tam{color:#1E8449;}.sv-k .sv-toplam.yok{color:#C0392B;}' +
      '.sv-k .sv-oneri{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;font-size:.78rem;color:#8B6A57;align-items:center;}' +
      '.sv-k .sv-oneri b{color:#B34700;}' +
      '.sv-k .sv-gonder{width:100%;margin-top:10px;padding:13px;border:none;border-radius:12px;cursor:pointer;font:800 1rem/1 inherit;color:#fff;background:linear-gradient(135deg,#F39C12,#D84315);}' +
      '.sv-k .sv-gonder:disabled{opacity:.55;cursor:not-allowed;}' +
      '.sv-k .sv-not{min-height:18px;margin:8px 0 0;font-size:.85rem;}' +
      '.sv-k .sv-bas{display:flex;align-items:center;gap:8px;font-size:.8rem;color:#8B6A57;margin:-2px 0 10px;}' +
      /* sonuçlar */
      '.sv-r{font-family:inherit;}' +
      '.sv-r .sv-rs{background:#fff;border:1px solid #F3E2D3;border-radius:11px;margin-bottom:8px;}' +
      '.sv-r .sv-rb{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 13px;cursor:pointer;}' +
      '.sv-r .sv-rb .ad{color:#6B4A38;font-size:.9rem;}' +
      '.sv-r .sv-p{font-weight:800;font-size:1rem;}' +
      '.sv-r .sv-rozet{display:inline-flex;align-items:center;gap:4px;font-size:.72rem;font-weight:800;padding:3px 8px;border-radius:99px;background:#FFF1D6;color:#9A6400;margin-left:6px;}' +
      '.sv-r .sv-rozet svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;}' +
      '.sv-r .sv-det{border-top:1px dashed #F0DACA;padding:10px 13px;display:grid;gap:8px;}' +
      '.sv-r .sv-dq{font-size:.84rem;line-height:1.5;color:#5A3D2E;}' +
      '.sv-r .sv-dq .ar{font-family:Arakom,serif;font-size:1.15rem;}' +
      '.sv-r .sv-dc{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;}' +
      '.sv-r .sv-ok{color:#1E8449;font-weight:800;}.sv-r .sv-no{color:#C0392B;font-weight:800;}' +
      '.sv-r .sv-cv{background:#F7F9FB;border:1px solid #E3E9F0;border-radius:9px;padding:6px 9px;}' +
      '.sv-r .sv-elle{display:inline-flex;align-items:center;gap:5px;font-weight:700;font-size:.8rem;}' +
      '.sv-r .sv-elle input{width:64px;padding:6px;border:1.5px solid #E8A87C;border-radius:8px;text-align:center;font:inherit;}' +
      '.sv-r .sv-kaydet{padding:8px 14px;border:0;border-radius:9px;background:#16A085;color:#fff;font:800 .82rem/1 inherit;cursor:pointer;}' +
      '.sv-r .sv-ust{display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin:0 0 10px;font-size:.83rem;color:#8B6A57;}' +
      '@media (max-width:520px){.sv-k .sv-ust{grid-template-columns:1fr;}.sv-k .sv-tur button{padding:7px 7px;}}';
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------------------------------------------------------- PUAN DAĞITMA
     Öğretmen puan girdiyse o puan sabit; girmediği sorular kalan puanı paylaşır.
     Açık uçlu soru çoktan seçmeliden iki kat ağırlıklı. Tam sayıya yuvarlama en büyük
     kalan yöntemiyle: toplam her zaman tam 100. (Saf işlev — denemede de kullanılır.) */
  SV.dagit = function (sorular) {
    var n = sorular.length, sonuc = new Array(n), sabit = 0, oto = [];
    sorular.forEach(function (q, i) {
      var p = (q.puanElle === '' || q.puanElle == null) ? null : Number(q.puanElle);
      if (p != null && isFinite(p) && p >= 0) { sonuc[i] = Math.round(p * 100) / 100; sabit += sonuc[i]; }
      else oto.push(i);
    });
    var kalan = Math.round((100 - sabit) * 100) / 100, hata = '';
    if (!n) hata = 'Henüz soru yok.';
    else if (kalan < 0) hata = 'Girdiğin puanlar 100\'ü ' + (-kalan) + ' puan aşıyor.';
    else if (!oto.length && kalan !== 0) hata = 'Toplam ' + sabit + ' — 100 olmalı (' + (kalan > 0 ? kalan + ' puan eksik' : '') + ').';
    if (oto.length && kalan >= 0) {
      var ag = oto.map(function (i) { return sorular[i].t === 'acik' ? 2 : 1; });
      var agT = ag.reduce(function (a, b) { return a + b; }, 0);
      var tamKalan = Math.floor(kalan), ham = ag.map(function (a) { return tamKalan * a / agT; });
      var taban = ham.map(Math.floor), dag = taban.reduce(function (a, b) { return a + b; }, 0);
      var sira = ham.map(function (h, k) { return { k: k, r: h - Math.floor(h) }; }).sort(function (a, b) { return b.r - a.r || a.k - b.k; });
      for (var j = 0; j < tamKalan - dag; j++) taban[sira[j % sira.length].k]++;
      if (kalan !== tamKalan) taban[taban.length - 1] = Math.round((taban[taban.length - 1] + kalan - tamKalan) * 100) / 100;
      oto.forEach(function (i, k) { sonuc[i] = taban[k]; });
    }
    var toplam = Math.round(sonuc.reduce(function (a, b) { return a + (b || 0); }, 0) * 100) / 100;
    if (!hata && toplam !== 100) hata = 'Toplam ' + toplam + ' — 100 olmalı.';
    /* SORU SAYISI ÖNERİSİ: kendiliğinden dağılan sorular eşit ağırlıklıysa ve kalan puan
       soru sayısına tam bölünmüyorsa, en yakın «tam bölünen» soru sayıları önerilir. */
    var oneri = [];
    var esit = oto.length && oto.every(function (i) { return sorular[i].t === sorular[oto[0]].t; });
    var tk = Math.round(kalan);
    if (esit && tk > 0 && kalan === tk && tk % oto.length !== 0) {
      for (var m = Math.max(1, oto.length - 3); m <= oto.length + 6 && oneri.length < 3; m++) {
        if (m !== oto.length && tk % m === 0) oneri.push({ n: m + (n - oto.length), fark: m - oto.length, puan: tk / m });
      }
    }
    return { puan: sonuc, toplam: toplam, hata: hata, oto: oto, oneri: oneri };
  };

  /* ---------------------------------------------------------- PUANLAMA (saf işlev)
     sinav: görevdeki sınav, anahtar: {cevap, puan}, cevaplar: öğrencinin dizisi, elle: {i: puan}.
     Açık uçluda cevap anahtarıyla (harekesiz, büyük-küçük harf ayrımsız) birebir aynıysa tam puan;
     değilse öğretmenin girdiği puan, girilmediyse BEKLİYOR. */
  SV.puanla = function (sinav, anahtar, cevaplar, elle) {
    var Q = (sinav && sinav.sorular) || [], K = (anahtar && anahtar.cevap) || [], P = (anahtar && anahtar.puan) || Q.map(function (q) { return q.puan || 0; });
    elle = elle || {}; cevaplar = cevaplar || [];
    var oto = 0, el = 0, bekleyen = 0, d = [];
    Q.forEach(function (q, i) {
      var c = cevaplar[i], p = Number(P[i]) || 0;
      if (q.t === 'acik') {
        if (elle[i] != null && elle[i] !== '') { var e = Math.max(0, Math.min(p, Number(elle[i]) || 0)); el += e; d.push(e >= p ? 1 : (e > 0 ? 0.5 : 0)); return; }
        if (c == null || String(c).trim() === '') { d.push(0); return; }
        if (K[i] && sade(K[i]) && sade(K[i]) === sade(c)) { oto += p; d.push(1); return; }
        bekleyen++; d.push(null); return;
      }
      var dogru = (q.t === 'dy') ? (c === true || c === false) && c === K[i] : (c != null && c !== '' && Number(c) === Number(K[i]));
      if (dogru) oto += p;
      d.push(dogru ? 1 : 0);
    });
    var toplam = Math.round((oto + el) * 100) / 100;
    return { oto: Math.round(oto * 100) / 100, elle: Math.round(el * 100) / 100, toplam: toplam, bekleyen: bekleyen, d: d };
  };

  /* ---------------------------------------------------------- TASLAK (tarayıcıda) */
  function taslakAnahtar() { var u = oturum(); return 'kidefSinavTaslak|' + (u ? u.uid : ''); }
  var T = null;    /* {ad, sureDk, sorular:[{t, soru, ar, sik:[], dogru, cevap, puanElle}]} */
  function taslakOku() {
    try { var v = JSON.parse(localStorage.getItem(taslakAnahtar()) || 'null'); if (v && Array.isArray(v.sorular)) return v; } catch (e) { }
    return { ad: '', sureDk: '', sorular: [] };
  }
  var tz = null;
  function taslakYaz() { clearTimeout(tz); tz = setTimeout(function () { try { localStorage.setItem(taslakAnahtar(), JSON.stringify(T)); } catch (e) { } }, 250); }
  function yeniSoru(t) { return t === 'test' ? { t: 'test', soru: '', ar: '', sik: ['', '', '', ''], dogru: null, puanElle: '' }
    : t === 'dy' ? { t: 'dy', soru: '', ar: '', dogru: null, puanElle: '' } : { t: 'acik', soru: '', ar: '', cevap: '', puanElle: '' }; }

  /* ---------------------------------------------------------- hedef seçimi (Görev Gönder ile aynı) */
  function seviyeSecenek() {
    var d = veriAl(); if (!d || !d.levels) return '';
    var sira = (d.levelOrder && d.levelOrder.length) ? d.levelOrder : Object.keys(d.levels);
    return sira.map(function (lId) { var l = d.levels[lId]; return l ? '<option value="' + esc(lId) + '">' + esc(l.name || lId) + '</option>' : ''; }).join('');
  }
  SV.hedefCiz = function () {
    var tur = (document.getElementById('svHedefTur') || {}).value || 'sinif';
    var sk = document.getElementById('svSinifKutu'), ok = document.getElementById('svOgrenciKutu');
    if (sk) sk.style.display = (tur === 'sinif' || tur === 'ogrenci') ? '' : 'none';
    if (ok) ok.style.display = (tur === 'ogrenci') ? '' : 'none';
    var d = veriAl(), lId = (document.getElementById('svSeviye') || {}).value, ss = document.getElementById('svSinif');
    if (ss && d && d.levels[lId] && d.levels[lId].classes) {
      var onceki = ss.value;
      ss.innerHTML = Object.keys(d.levels[lId].classes).map(function (cId) { return '<option value="' + esc(cId) + '">' + esc(d.levels[lId].classes[cId].name || cId) + '</option>'; }).join('');
      if (onceki && d.levels[lId].classes[onceki]) ss.value = onceki;
    }
    SV.ogrenciDoldur(); bilgiYaz();
  };
  SV.ogrenciDoldur = function () {
    var d = veriAl(), lId = (document.getElementById('svSeviye') || {}).value, cId = (document.getElementById('svSinif') || {}).value, os = document.getElementById('svOgrenci');
    if (!os || !d) return;
    var ogr = []; try { ogr = d.levels[lId].classes[cId].students || []; } catch (e) { ogr = []; }
    os.innerHTML = ogr.map(function (s, i) { return '<option value="' + i + '"' + (s.hesapUid ? '' : ' disabled') + '>' + esc(s.name || ('Öğrenci ' + (i + 1))) + (s.hesapUid ? '' : ' (hesap bağlı değil)') + '</option>'; }).join('') || '<option value="">— öğrenci yok —</option>';
  };
  function kurumAdi(lId) { var d = veriAl(); try { var k = d.levels[lId].kurumId; return (k && d.kurumlar && d.kurumlar[k] && d.kurumlar[k].name) || ''; } catch (e) { return ''; } }
  function ogretmenAdi() { try { return (typeof appState !== 'undefined' && appState.currentUserName) || ''; } catch (e) { return ''; } }
  function bilgiYaz() {
    var el = document.getElementById('svBilgi'); if (!el) return;
    var d = veriAl(), lId = (document.getElementById('svSeviye') || {}).value || '', cId = (document.getElementById('svSinif') || {}).value || '';
    var tur = (document.getElementById('svHedefTur') || {}).value || 'sinif';
    var sev = (d && d.levels[lId] && d.levels[lId].name) || '', sn = '';
    try { if (tur !== 'seviye') sn = d.levels[lId].classes[cId].name || ''; } catch (e) { }
    var k = kurumAdi(lId), o = ogretmenAdi();
    el.innerHTML = 'Sınav kâğıdının başında: <b>' + esc(k || 'kurum adı yok') + '</b> · ' + esc(sev) + (sn ? ' / ' + esc(sn) : '') + ' · Öğretmen: <b>' + esc(o || '—') + '</b>';
  }

  /* ---------------------------------------------------------- SINAV SEKMESİ (Görev Gönder penceresi) */
  SV.ciz = function (hedefId, on) {                 /* on: {lId, cId} — sınıf görünümünden açılınca o sınıf seçili gelir */
    var g = document.getElementById(hedefId || 'gvGovde'); if (!g) return;
    stil(); if (window.KidefKlavyeAlt) KidefKlavyeAlt.kur();
    T = taslakOku();
    if (!T.sorular.length) T.sorular.push(yeniSoru('test'));
    g.innerHTML = '<div class="sv-k">' +
      '<div class="sv-bas">' + IK.kagit + '<span>Soruları yaz, puanları istersen sen gir; boş bıraktıkların 100\'e kendiliğinden tamamlanır. Taslak bu tarayıcıda saklanır.</span></div>' +
      '<div class="sv-ust">' +
        '<div class="sv-tam"><label class="sv-e" for="svAd">Sınavın adı</label><input type="text" id="svAd" maxlength="80" placeholder="ör. 1. Dönem 1. Arapça Sınavı" value="' + esc(T.ad) + '"></div>' +
        '<div><label class="sv-e" for="svHedefTur">Kime</label><select id="svHedefTur" onchange="KidefSinav.hedefCiz()"><option value="sinif">Bir sınıfa</option><option value="seviye">Bütün seviyeye</option><option value="ogrenci">Tek öğrenciye</option></select></div>' +
        '<div><label class="sv-e" for="svSeviye">Seviye</label><select id="svSeviye" onchange="KidefSinav.hedefCiz()">' + seviyeSecenek() + '</select></div>' +
        '<div id="svSinifKutu"><label class="sv-e" for="svSinif">Sınıf</label><select id="svSinif" onchange="KidefSinav.ogrenciDoldur();KidefSinav._bilgi()"></select></div>' +
        '<div id="svOgrenciKutu" style="display:none"><label class="sv-e" for="svOgrenci">Öğrenci</label><select id="svOgrenci"></select></div>' +
        '<div><label class="sv-e" for="svTarih">Son tarih (isteğe bağlı)</label><input type="date" id="svTarih"></div>' +
        '<div><label class="sv-e" for="svSure">Süre, dakika (isteğe bağlı)</label><input type="number" id="svSure" min="5" max="180" placeholder="süresiz" value="' + esc(T.sureDk) + '"></div>' +
        '<div class="sv-bilgi" id="svBilgi"></div>' +
        '<div class="sv-tam" style="background:#FFF6EC;border:1px dashed #F0C9A6;border-radius:12px;padding:10px 12px;">' +
          '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:700;color:#9C3B0C;font-size:.86rem;"><input type="checkbox" id="svNot" style="width:auto" onchange="document.getElementById(\'svNotAyar\').style.display=this.checked?\'flex\':\'none\'"> Notlara işlenecek (performans notu)</label>' +
          '<div id="svNotAyar" style="display:none;align-items:center;gap:8px;margin-top:8px;font-size:.82rem;">Ağırlık (%) <input type="number" id="svAgirlik" min="1" max="50" value="20" style="width:80px"></div></div>' +
      '</div>' +
      '<div class="sv-sorular" id="svSorular"></div>' +
      '<div class="sv-ekle">' +
        '<button type="button" data-sv-ekle="test">' + IK.arti + 'Çoktan seçmeli</button>' +
        '<button type="button" data-sv-ekle="dy">' + IK.arti + 'Doğru / Yanlış</button>' +
        '<button type="button" data-sv-ekle="acik">' + IK.arti + 'Açık uçlu</button></div>' +
      '<div class="sv-ozet"><div class="sv-toplam" id="svToplam"></div><div class="sv-oneri" id="svOneri"></div>' +
        '<button type="button" class="sv-gonder" id="svGonder">Sınavı Gönder</button><p class="sv-not" id="svNotYazi"></p></div>' +
      '</div>';
    try {
      if (on && on.lId && document.getElementById('svSeviye')) {
        document.getElementById('svSeviye').value = on.lId; SV.hedefCiz();
        if (on.cId && document.getElementById('svSinif')) { document.getElementById('svSinif').value = on.cId; SV.ogrenciDoldur(); }
      }
    } catch (e) { }
    SV.hedefCiz();
    sorulariCiz();
    var k = g.querySelector('.sv-k');
    k.addEventListener('input', girdi);
    k.addEventListener('click', tikla);
    k.querySelector('#svGonder').addEventListener('click', SV.gonder);
  };
  SV._bilgi = bilgiYaz;

  function alanHtml(id, deger, ad, ar, ph, satir) {
    return '<div class="sv-sat"><textarea id="' + id + '" rows="' + (satir || 1) + '" data-ka-kl data-ka-ad="' + esc(ad) + '"' + (ar ? ' class="ar" dir="rtl" lang="ar"' : ' dir="auto"') +
      ' placeholder="' + esc(ph || '') + '">' + esc(deger) + '</textarea>' +
      '<button type="button" class="sv-kl" data-ka-kl-ac="' + id + '" title="Arapça klavyeyle yaz" aria-label="' + esc(ad) + ' — Arapça klavyeyle yaz">' + IK.kl + '</button></div>';
  }
  function sorulariCiz() {
    var kap = document.getElementById('svSorular'); if (!kap) return;
    var D = SV.dagit(T.sorular);
    kap.innerHTML = T.sorular.map(function (q, i) {
      var tur = '<span class="sv-tur">' + ['test', 'dy', 'acik'].map(function (t) { return '<button type="button" data-sv-tur="' + t + '" data-i="' + i + '" class="' + (q.t === t ? 'on' : '') + '">' + TUR_AD[t] + '</button>'; }).join('') + '</span>';
      var oto = (q.puanElle === '' || q.puanElle == null);
      var h = '<div class="sv-soru" data-i="' + i + '"><div class="sv-sb"><span class="sv-no">' + (i + 1) + '</span>' + tur + '<span class="sv-bos"></span>' +
        '<label class="sv-puan' + (oto ? ' oto' : '') + '" title="Boş bırakırsan kendiliğinden hesaplanır">Puan <input type="number" min="0" max="100" step="1" data-sv-puan="' + i + '" value="' + esc(q.puanElle) + '" placeholder="' + (D.puan[i] != null ? D.puan[i] : '') + '"></label>' +
        '<button type="button" class="sv-ib" data-sv-is="yukari" data-i="' + i + '" title="Yukarı" aria-label="Yukarı taşı"' + (i ? '' : ' disabled') + '>' + IK.yukari + '</button>' +
        '<button type="button" class="sv-ib" data-sv-is="asagi" data-i="' + i + '" title="Aşağı" aria-label="Aşağı taşı"' + (i < T.sorular.length - 1 ? '' : ' disabled') + '>' + IK.asagi + '</button>' +
        '<button type="button" class="sv-ib sil" data-sv-is="sil" data-i="' + i + '" title="Soruyu sil" aria-label="Soruyu sil">' + IK.sil + '</button></div>' +
        '<div class="sv-alan"><small>Soru</small>' + alanHtml('svQ' + i, q.soru, (i + 1) + '. soru', false, 'ör. Aşağıdaki cümlenin Türkçesi hangisidir?', 1) + '</div>' +
        '<div class="sv-alan"><small>Arapça metin (isteğe bağlı)</small>' + alanHtml('svA' + i, q.ar, (i + 1) + '. sorunun Arapça metni', true, 'اُكْتُبْ هُنا…', 1) + '</div>';
      if (q.t === 'test') {
        h += '<div class="sv-alan"><small>Şıklar — doğru şıkkın harfine dokun</small>' + q.sik.map(function (s, j) {
          return '<div class="sv-sik"><button type="button" class="sv-h' + (q.dogru === j ? ' on' : '') + '" data-sv-dogru="' + j + '" data-i="' + i + '" title="Doğru şık" aria-label="' + HARF[j] + ' doğru şık">' + HARF[j] + '</button>' +
            '<div style="flex:1">' + alanHtml('svS' + i + '_' + j, s, (i + 1) + '. soru ' + HARF[j] + ' şıkkı', false, HARF[j] + ' şıkkı', 1) + '</div></div>';
        }).join('') + (q.sik.length < 5 ? '<button type="button" class="sv-ib" style="width:auto;padding:0 10px;margin-top:6px;font:700 .78rem/1 inherit;gap:4px;display:inline-flex" data-sv-is="sikEkle" data-i="' + i + '">' + IK.arti + 'Şık ekle</button>' : '') + '</div>';
      } else if (q.t === 'dy') {
        h += '<div class="sv-dy"><button type="button" data-sv-dy="1" data-i="' + i + '" class="' + (q.dogru === true ? 'on' : '') + '">Doğru</button><button type="button" data-sv-dy="0" data-i="' + i + '" class="' + (q.dogru === false ? 'on' : '') + '">Yanlış</button></div>';
      } else {
        h += '<div class="sv-alan"><small>Cevap anahtarı (isteğe bağlı) — öğrencinin yazdığı birebir aynıysa kendiliğinden tam puan; değilse sen puanlarsın</small>' + alanHtml('svC' + i, q.cevap, (i + 1) + '. sorunun cevabı', false, 'cevap', 1) + '</div>';
      }
      return h + '</div>';
    }).join('');
    toplamCiz(D);
  }
  function toplamCiz(D) {
    D = D || SV.dagit(T.sorular);
    var t = document.getElementById('svToplam'), o = document.getElementById('svOneri'), b = document.getElementById('svGonder');
    if (t) {
      t.className = 'sv-toplam ' + (D.hata ? 'yok' : 'tam');
      t.innerHTML = (D.hata ? IK.uyari + esc(D.hata) : IK.onay + T.sorular.length + ' soru · toplam 100 puan' + (D.oto.length ? ' (' + D.oto.length + ' sorunun puanı kendiliğinden)' : ''));
    }
    if (o) o.innerHTML = D.oneri.length ? 'Puanlar tam bölünsün istersen: ' + D.oneri.map(function (x) { return '<b>' + x.n + ' soru</b> → her biri ' + x.puan; }).join(' · ') : '';
    /* yer tutucuları tazele */
    T.sorular.forEach(function (q, i) { var inp = document.querySelector('[data-sv-puan="' + i + '"]'); if (inp) { inp.placeholder = D.puan[i] != null ? D.puan[i] : ''; inp.parentNode.classList.toggle('oto', inp.value === ''); } });
    if (b) b.disabled = !!D.hata;
  }
  function girdi(e) {
    var t = e.target, id = t.id || '', m;
    if (id === 'svAd') { T.ad = t.value; taslakYaz(); return; }
    if (id === 'svSure') { T.sureDk = t.value; taslakYaz(); return; }
    if ((m = /^svQ(\d+)$/.exec(id))) T.sorular[+m[1]].soru = t.value;
    else if ((m = /^svA(\d+)$/.exec(id))) T.sorular[+m[1]].ar = t.value;
    else if ((m = /^svC(\d+)$/.exec(id))) T.sorular[+m[1]].cevap = t.value;
    else if ((m = /^svS(\d+)_(\d+)$/.exec(id))) T.sorular[+m[1]].sik[+m[2]] = t.value;
    else if (t.hasAttribute('data-sv-puan')) { T.sorular[+t.getAttribute('data-sv-puan')].puanElle = t.value === '' ? '' : Math.max(0, Math.min(100, Number(t.value) || 0)); toplamCiz(); }
    else return;
    taslakYaz();
  }
  function tikla(e) {
    var b = e.target.closest('button'); if (!b) return;
    var i = +b.getAttribute('data-i'), q = T.sorular[i];
    if (b.hasAttribute('data-sv-ekle')) { if (window.KidefKlavyeAlt) KidefKlavyeAlt.kapat(); T.sorular.push(yeniSoru(b.getAttribute('data-sv-ekle'))); sorulariCiz(); taslakYaz(); var son = document.querySelector('.sv-soru:last-child'); if (son) son.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    if (b.hasAttribute('data-sv-tur') && q) {
      var yt = b.getAttribute('data-sv-tur'); if (q.t === yt) return;
      var y = yeniSoru(yt); y.soru = q.soru; y.ar = q.ar; y.puanElle = q.puanElle; T.sorular[i] = y; sorulariCiz(); taslakYaz(); return;
    }
    if (b.hasAttribute('data-sv-dogru') && q) { q.dogru = +b.getAttribute('data-sv-dogru'); sorulariCiz(); taslakYaz(); return; }
    if (b.hasAttribute('data-sv-dy') && q) { q.dogru = b.getAttribute('data-sv-dy') === '1'; sorulariCiz(); taslakYaz(); return; }
    var is = b.getAttribute('data-sv-is');
    if (!is || !q) return;
    if (window.KidefKlavyeAlt) KidefKlavyeAlt.kapat();
    if (is === 'sil') { if ((q.soru || q.ar) && !confirm((i + 1) + '. soru silinsin mi?')) return; T.sorular.splice(i, 1); }
    else if (is === 'yukari' && i > 0) { T.sorular.splice(i - 1, 0, T.sorular.splice(i, 1)[0]); }
    else if (is === 'asagi' && i < T.sorular.length - 1) { T.sorular.splice(i + 1, 0, T.sorular.splice(i, 1)[0]); }
    else if (is === 'sikEkle' && q.sik.length < 5) { q.sik.push(''); }
    sorulariCiz(); taslakYaz();
  }

  /* ---------------------------------------------------------- GÖNDER */
  function denetle() {
    var D = SV.dagit(T.sorular);
    if (D.hata) return { hata: D.hata };
    for (var i = 0; i < T.sorular.length; i++) {
      var q = T.sorular[i], no = (i + 1) + '. soru: ';
      if (!String(q.soru || '').trim() && !String(q.ar || '').trim()) return { hata: no + 'soru metni boş.', i: i };
      if (q.t === 'test') {
        var dolu = q.sik.filter(function (s) { return String(s || '').trim(); }).length;
        if (dolu < 2) return { hata: no + 'en az iki şık yazmalısın.', i: i };
        if (q.dogru == null || !String(q.sik[q.dogru] || '').trim()) return { hata: no + 'doğru şıkkı işaretlemedin.', i: i };
      }
      if (q.t === 'dy' && q.dogru !== true && q.dogru !== false) return { hata: no + 'doğru mu yanlış mı, seçmedin.', i: i };
    }
    return { D: D };
  }
  function yeniId() { return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  SV.gonder = function () {
    var u = oturum(), Db = veri(), notEl = document.getElementById('svNotYazi');
    var yaz = function (m, hata) { if (notEl) { notEl.style.color = hata ? '#E74C3C' : '#16A085'; notEl.textContent = m; } };
    if (!u || !Db || !ogretmenMi()) { yaz('Bağlantı yok ya da yetki yok.', true); return; }
    var dn = denetle();
    if (dn.hata) { yaz(dn.hata, true); if (dn.i != null) { var s = document.querySelector('.sv-soru[data-i="' + dn.i + '"]'); if (s) s.scrollIntoView({ block: 'center', behavior: 'smooth' }); } return; }
    var d = veriAl(), tur = (document.getElementById('svHedefTur') || {}).value || 'sinif';
    var lId = (document.getElementById('svSeviye') || {}).value || '', cId = (document.getElementById('svSinif') || {}).value || '';
    if (!lId || !d || !d.levels[lId]) { yaz('Seviye seçmelisin.', true); return; }
    var hedefAd = d.levels[lId].name || lId, ogrUid = null, uids = [];
    if (tur !== 'seviye') { if (!cId) { yaz('Sınıf seçmelisin.', true); return; } try { hedefAd += ' / ' + (d.levels[lId].classes[cId].name || cId); } catch (e) { } }
    try {
      if (tur === 'ogrenci') {
        var o = d.levels[lId].classes[cId].students[parseInt((document.getElementById('svOgrenci') || {}).value)];
        if (!o || !o.hesapUid) { yaz('Hesabı bağlı bir öğrenci seçmelisin.', true); return; }
        ogrUid = o.hesapUid; uids = [o.hesapUid]; hedefAd += ' / ' + (o.name || '');
      } else if (tur === 'sinif') (d.levels[lId].classes[cId].students || []).forEach(function (s) { if (s && s.hesapUid) uids.push(s.hesapUid); });
      else Object.keys(d.levels[lId].classes || {}).forEach(function (ck) { (d.levels[lId].classes[ck].students || []).forEach(function (s) { if (s && s.hesapUid) uids.push(s.hesapUid); }); });
    } catch (e) { }
    if (!uids.length) { yaz('Bu hedefte hesabı bağlı öğrenci yok; sınav kimseye gitmez.', true); return; }
    var tarih = (document.getElementById('svTarih') || {}).value || '', sonTarih = null;
    if (tarih) { var tt = new Date(tarih + 'T23:59:59'); if (!isNaN(tt.getTime())) sonTarih = tt.getTime(); }
    var notMu = !!((document.getElementById('svNot') || {}).checked);
    var agirlik = Math.min(50, Math.max(1, parseInt((document.getElementById('svAgirlik') || {}).value) || 20));
    var sure = parseInt((document.getElementById('svSure') || {}).value) || 0;
    var ad = String(T.ad || '').trim() || ((d.levels[lId].name || '') + ' Arapça Sınavı');
    var sorular = T.sorular.map(function (q, i) {
      var o = { t: q.t, soru: String(q.soru || '').trim(), ar: String(q.ar || '').trim(), puan: dn.D.puan[i] };
      if (q.t === 'test') {           /* boş şıklar atılır; doğru şıkkın yeni yeri anahtara yazılır */
        o.sik = []; q.sik.forEach(function (s, j) { if (String(s || '').trim()) { if (j === q.dogru) o._d = o.sik.length; o.sik.push(String(s).trim()); } });
      }
      return o;
    });
    var cevap = T.sorular.map(function (q, i) { return q.t === 'test' ? sorular[i]._d : (q.t === 'dy' ? q.dogru : String(q.cevap || '').trim()); });
    sorular.forEach(function (o) { delete o._d; });
    var id = yeniId(), sev = d.levels[lId].name || '', snf = '';
    try { if (cId) snf = d.levels[lId].classes[cId].name || ''; } catch (e) { }
    var kayit = {
      id: id, ogretmenUid: u.uid, oyun: 'sinavcoz.html', baslik: ad, hedefTur: tur, lId: lId, cId: (tur === 'seviye' ? null : cId) || null,
      ogrenciUid: ogrUid, uids: uids, hedefAd: hedefAd, tur: 'sinav', sonTarih: sonTarih,
      performans: notMu ? { agirlik: agirlik, donem: (typeof window.llAktifDonem === 'function' ? window.llAktifDonem(lId) : 0) } : null,
      aktif: true, olusturma: Date.now(),
      sinav: { ad: ad, kurum: kurumAdi(lId), ogretmenAd: ogretmenAdi(), seviyeAd: sev, sinifAd: tur === 'seviye' ? '' : snf, sureDk: sure > 0 ? Math.min(180, sure) : 0, sorular: sorular }
    };
    var btn = document.getElementById('svGonder'); if (btn) btn.disabled = true;
    yaz('Gönderiliyor…');
    /* önce anahtar (öğrenciye görünmez), sonra görev: anahtarsız görev kalmasın */
    Db.collection(C_ANH).doc(id).set({ ogretmenUid: u.uid, gorevId: id, cevap: cevap, puan: dn.D.puan, puanlar: {}, olusturma: Date.now() })
      .then(function () { return Db.collection(C_GRV).doc(id).set(kayit); })
      .then(function () {
        if (notMu && window.GV && GV.notSutunuEkle) GV.notSutunuEkle(lId, ad, agirlik, id);
        ANH[id] = { cevap: cevap, puan: dn.D.puan, puanlar: {} };
        try { localStorage.removeItem(taslakAnahtar()); } catch (e) { }
        T = { ad: '', sureDk: '', sorular: [yeniSoru('test')] };
        yaz('Sınav gönderildi: ' + ad + ' → ' + hedefAd + ' (' + uids.length + ' öğrenci). Sonuçlar sekmesinden izleyebilirsin.');
        setTimeout(function () { if (document.getElementById('svSorular')) { var n = document.getElementById('svNotYazi'), m = n && n.textContent; SV.ciz('gvGovde'); var n2 = document.getElementById('svNotYazi'); if (n2) { n2.style.color = '#16A085'; n2.textContent = m; } } }, 50);
      })
      .catch(function (e) {
        if (btn) btn.disabled = false;
        var m = (e && (e.message || e.code)) || 'bilinmeyen hata';
        yaz('Gönderilemedi: ' + m + (/permission|insufficient/i.test(m) ? ' — Firebase kurallarına sınav bölümü eklenmemiş olabilir (sinavAnahtar).' : ''), true);
      });
  };

  /* ---------------------------------------------------------- ÖĞRETMEN: PUANLAMA ve SONUÇLAR */
  var ANH = {};          /* gorevId → anahtar belgesi (okunan) */
  var ANH_SOZ = {};
  function anahtarAl(gid) {
    if (ANH[gid]) return Promise.resolve(ANH[gid]);
    if (ANH_SOZ[gid]) return ANH_SOZ[gid];
    var Db = veri(); if (!Db) return Promise.resolve(null);
    ANH_SOZ[gid] = Db.collection(C_ANH).doc(gid).get().then(function (s) {
      delete ANH_SOZ[gid];
      if (!s.exists) return null;
      ANH[gid] = s.data() || {}; if (!ANH[gid].puanlar) ANH[gid].puanlar = {};
      return ANH[gid];
    }).catch(function (e) { delete ANH_SOZ[gid]; console.warn('sınav anahtarı:', e && (e.code || e.message)); return null; });
    return ANH_SOZ[gid];
  }
  /* bir sonucu puanla; değiştiyse sinavNot'u ve anahtardaki özeti yaz */
  function notYaz(v, A, r) {
    var u = oturum(), Db = veri(); if (!u || !Db || !A || !r || !r.ogrenciUid) return null;
    var eski = A.puanlar[r.ogrenciUid] || {}, elle = eski.elle || {};
    var P = SV.puanla(v.sinav, A, r.cevaplar, elle);
    var imza = [P.toplam, P.bekleyen, P.d.join(','), r.bitis || 0].join('|');
    if (eski.imza === imza) return P;
    var yeni = { oto: P.oto, elle: elle, toplam: P.toplam, bekleyen: P.bekleyen, t: Date.now(), imza: imza };
    A.puanlar[r.ogrenciUid] = yeni;
    var g = {}; g['puanlar.' + r.ogrenciUid] = yeni;
    Db.collection(C_ANH).doc(v._id).update(g).catch(function (e) { console.warn('sınav puanı (anahtar):', e && (e.code || e.message)); });
    Db.collection(C_NOT).doc(v._id + '_' + r.ogrenciUid).set({
      gorevId: v._id, ogrenciUid: r.ogrenciUid, ogretmenUid: u.uid, puan: P.toplam, bekleyen: P.bekleyen, d: P.d, t: Date.now()
    }).catch(function (e) { console.warn('sınav notu:', e && (e.code || e.message)); });
    return P;
  }
  SV.sonucCiz = function (el, v, liste, ogrenciler, gorevId) {
    stil();
    el.innerHTML = '<p style="color:#A6836E;font-size:.85rem;">Cevap anahtarı okunuyor…</p>';
    anahtarAl(v._id).then(function (A) {
      if (!document.body.contains(el)) return;
      if (!A) { el.innerHTML = '<p style="color:#E74C3C;font-size:.85rem;">Bu sınavın cevap anahtarı okunamadı (Firebase kuralı eksik olabilir: sinavAnahtar).</p>'; return; }
      var harita = {}; (liste || []).forEach(function (r) { harita[r.ogrenciUid] = r; });
      var teslim = 0, toplamP = 0, bekleyenSay = 0, acik = SV._acik || {};
      var satirlar = ogrenciler.map(function (s) {
        var r = s.hesapUid ? harita[s.hesapUid] : null, P = null;
        if (r) { teslim++; P = notYaz(v, A, r); if (P) { toplamP += P.toplam; r.yuzde = Math.round(P.toplam); if (P.bekleyen) bekleyenSay++; } }
        var sag = !s.hesapUid ? '<span style="color:#A6836E;font-size:.8rem;">hesap bağlı değil</span>'
          : !r ? '<span style="color:#B34700;font-size:.8rem;">bekleniyor</span>'
          : '<span><span class="sv-p" style="color:' + (P.toplam >= 85 ? '#1E8449' : P.toplam >= 50 ? '#B7950B' : '#C0392B') + '">' + P.toplam + '</span><small style="color:#A6836E"> /100</small>' +
            (P.bekleyen ? '<span class="sv-rozet">' + IK.kalem + P.bekleyen + ' açık uçlu bekliyor</span>' : '') +
            (r.gec ? ' <b style="color:#E74C3C;font-size:.76rem;">geç</b>' : '') + '</span>';
        var acikMi = r && acik[v._id + '|' + s.hesapUid];
        return '<div class="sv-rs" data-uid="' + esc(s.hesapUid || '') + '"><div class="sv-rb"' + (r ? ' data-sv-ac="' + esc(s.hesapUid) + '"' : '') + '><span class="ad">' + esc(s.name || 'Öğrenci') + '</span>' + sag + '</div>' +
          (acikMi ? detayHtml(v, A, r) : '') + '</div>';
      }).join('');
      var ort = teslim ? Math.round(toplamP / teslim * 10) / 10 : 0;
      var notTus = (v.performans && v.performans.agirlik)
        ? '<button type="button" onclick="GV.notlaraIsle(\'' + esc(gorevId) + '\')" style="width:100%;margin-top:10px;padding:12px;border:none;border-radius:11px;cursor:pointer;font-family:inherit;font-weight:700;color:#fff;background:linear-gradient(135deg,#20C997,#16A085);">Sınav puanlarını notlara işle (%' + v.performans.agirlik + ')</button>' +
          '<p id="gvNotIsleNot" style="min-height:16px;margin:8px 0 0;font-size:.82rem;color:#16A085;">' + (bekleyenSay ? 'Önce açık uçlu cevapları puanla: ' + bekleyenSay + ' öğrencide bekleyen var.' : '') + '</p>' : '';
      el.innerHTML = '<div class="sv-r"><div class="sv-ust"><span>Sınav · ' + (v.sinav ? v.sinav.sorular.length : 0) + ' soru' + (v.sinav && v.sinav.sureDk ? ' · ' + v.sinav.sureDk + ' dk' : '') + (v.sonTarih ? ' · son tarih ' + trTarih(v.sonTarih) : '') + '</span>' +
        '<span><b>' + teslim + '</b> / ' + ogrenciler.length + ' teslim' + (teslim ? ' · ortalama <b>' + ort + '</b>' : '') + '</span></div>' +
        (satirlar || '<p style="color:#A6836E;font-size:.85rem;">Bu hedefte öğrenci yok.</p>') + notTus + '</div>';
      var oz = document.getElementById('gvOzet_' + gorevId); if (oz) oz.textContent = teslim + '/' + ogrenciler.length;
      el.onclick = function (e) {
        var a = e.target.closest('[data-sv-ac]');
        if (a) { var k = v._id + '|' + a.getAttribute('data-sv-ac'); SV._acik = SV._acik || {}; SV._acik[k] = !SV._acik[k]; SV.sonucCiz(el, v, liste, ogrenciler, gorevId); return; }
        var kd = e.target.closest('[data-sv-kaydet]');
        if (kd) {
          var uid = kd.getAttribute('data-sv-kaydet'), kap = kd.closest('.sv-det'), el2 = {};
          [].forEach.call(kap.querySelectorAll('[data-sv-elle]'), function (inp) { if (inp.value !== '') el2[inp.getAttribute('data-sv-elle')] = Number(inp.value); });
          var eski = A.puanlar[uid] || {}; A.puanlar[uid] = { oto: eski.oto, elle: el2, toplam: eski.toplam, bekleyen: eski.bekleyen, t: eski.t, imza: '' };
          SV.sonucCiz(el, v, liste, ogrenciler, gorevId);
        }
      };
      if (window.GV) { GV._sonSonuclar = liste; GV._sonSonuclarId = gorevId; }
    });
  };
  function detayHtml(v, A, r) {
    var Q = (v.sinav && v.sinav.sorular) || [], K = A.cevap || [], P = A.puan || [], el = ((A.puanlar[r.ogrenciUid] || {}).elle) || {};
    var R = SV.puanla(v.sinav, A, r.cevaplar, el), c = r.cevaplar || [], acikVar = false;
    var h = Q.map(function (q, i) {
      var ci = c[i], cy, ky;
      if (q.t === 'test') { cy = (ci == null || ci === '') ? '<i>boş</i>' : esc(HARF[ci] + ') ' + (q.sik[ci] || '')); ky = esc(HARF[K[i]] + ') ' + (q.sik[K[i]] || '')); }
      else if (q.t === 'dy') { cy = ci === true ? 'Doğru' : ci === false ? 'Yanlış' : '<i>boş</i>'; ky = K[i] ? 'Doğru' : 'Yanlış'; }
      else { cy = (ci && String(ci).trim()) ? '<span dir="auto">' + esc(ci) + '</span>' : '<i>boş</i>'; ky = K[i] ? '<span dir="auto">' + esc(K[i]) + '</span>' : ''; }
      var durum = R.d[i] === 1 ? '<span class="sv-ok">doğru</span>' : R.d[i] === 0 ? '<span class="sv-no">yanlış</span>' : R.d[i] === 0.5 ? '<span style="color:#B7950B;font-weight:800">kısmen</span>' : '<span style="color:#9A6400;font-weight:800">puan bekliyor</span>';
      var ek = '';
      if (q.t === 'acik' && ci && String(ci).trim()) { acikVar = true; ek = '<label class="sv-elle">Puan <input type="number" min="0" max="' + P[i] + '" step="1" data-sv-elle="' + i + '" value="' + (el[i] != null ? el[i] : '') + '" placeholder="0–' + P[i] + '"></label>'; }
      return '<div class="sv-dq"><b>' + (i + 1) + '.</b> <span dir="ltr">' + esc(q.soru) + '</span>' + (q.ar ? ' <span class="ar" dir="rtl">' + esc(q.ar) + '</span>' : '') +
        '<div class="sv-dc"><span class="sv-cv">' + cy + '</span>' + durum + '<small style="color:#A6836E">(' + P[i] + ' puan)</small>' + ek + '</div>' +
        (ky && R.d[i] !== 1 ? '<div style="font-size:.78rem;color:#7B8A99;margin-top:2px">Cevap: ' + ky + '</div>' : '') + '</div>';
    }).join('');
    return '<div class="sv-det">' + h + (acikVar ? '<div><button type="button" class="sv-kaydet" data-sv-kaydet="' + esc(r.ogrenciUid) + '">Açık uçlu puanlarını kaydet</button></div>' : '') + '</div>';
  }

  /* ---------------------------------------------------------- ÖĞRENCİ (Görevlerim) */
  SV.ogrNotlar = {};
  SV.ogrNotYukle = function () {
    var u = oturum(), Db = veri(); if (!u || !Db) return;
    Db.collection(C_NOT).where('ogrenciUid', '==', u.uid).get().then(function (s) {
      var m = {}; s.forEach(function (doc) { var x = doc.data() || {}; m[x.gorevId] = x; }); SV.ogrNotlar = m;
      if (window.GV) { try { GV.profilKartiGuncelle(); } catch (e) { } var mo = document.getElementById('gvOgrModal'); if (mo && mo.style.display !== 'none' && GV.ogrListeCiz) GV.ogrListeCiz(); }
    }).catch(function (e) { console.warn('sınav notları:', e && (e.code || e.message)); });
  };
  /* Görevlerim'deki sınav kartı (gorev.js ogrListeHTML çağırır) */
  SV.ogrKart = function (v, r) {
    var n = SV.ogrNotlar[v._id], doldu = !!(v.sonTarih && Date.now() > v.sonTarih);
    var durum = r ? (n ? '<span style="font-weight:800;color:#1E8449;">' + n.puan + ' / 100' + (n.bekleyen ? ' <small style="color:#9A6400">(açık uçlu bekliyor)</small>' : '') + '</span>' : '<span style="font-weight:800;color:#2471A3;">teslim edildi</span>')
      : (doldu ? '<span style="color:#E74C3C;font-weight:700;">süresi doldu</span>' : '<span style="color:#B34700;font-weight:700;">seni bekliyor</span>');
    var s = v.sinav || {};
    var tus = (!r && doldu) ? '' : '<a href="sinavcoz.html?gorev=' + esc(v._id) + '" target="_blank" rel="opener" style="display:inline-block;padding:9px 16px;border-radius:9px;text-decoration:none;font-weight:700;font-size:.85rem;color:#fff;background:linear-gradient(135deg,' + (r ? '#20C997,#16A085' : '#F39C12,#D84315') + ');">' + (r ? 'Sonucu gör' : 'Sınava başla') + '</a>';
    return '<div style="background:#fff;border:1px solid #F3E2D3;border-radius:13px;padding:13px 15px;margin-bottom:11px;box-shadow:0 2px 7px rgba(216,67,21,.06);">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px;"><span style="font-size:.98rem;color:#9C3B0C;font-weight:700;">' + esc(v.baslik || s.ad || 'Sınav') + '</span>' + durum + '</div>' +
      '<div style="font-size:.8rem;color:#A6836E;margin-bottom:10px;">Sınav · ' + ((s.sorular || []).length) + ' soru' + (s.sureDk ? ' · ' + s.sureDk + ' dakika' : '') + (v.sonTarih ? ' · son tarih: ' + trTarih(v.sonTarih) : '') + '</div>' + tus + '</div>';
  };
})();
