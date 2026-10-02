/* =====================================================================
   KELİME LİSTESİNİ İNDİR (01.10.2026)
   Kelime Dağarcığı'nda açılan her listenin üst satırına "İndir" düğmesi
   ekler. Üç biçim:
     • Word  (.doc)  — Word'de düzenlenebilir tablo
     • Sütun sayısı (02.10.2026) — menünün başında 1/2/3 seçici;
       varsayılan, listenin EKRANDAKİ sütun sayısı. PDF, Yazdır ve
       Word'e uygulanır (Excel tek tablo kalır).
     • Excel (.xlsx) — SheetJS ilk basışta cdnjs'ten yüklenir;
                        yüklenemezse UTF-8 CSV iner (Excel açar)
     • PDF    (.pdf)  — DOĞRUDAN iner, pencere açılmaz (02.10.2026)
                        sistem/kagitpdf.js çiziyor; Arapça'yı tarayıcı
                        dizdiği için harekeler birebir doğru çıkıyor
     • Yazdır         — yazıcıya gönderir (oradan PDF de kaydedilebilir)
   Motor (sarf/kelimeler.js) DEĞİŞTİRİLMEDİ: renderThematicLists sarılıyor,
   çizimden sonra düğmeler #btn-fs-<anahtar> (Kapat) düğmesinin önüne konuyor.
   Liste verisi motorun kendi tablosundan (thematicCategoriesData) okunur;
   İmam Hatip sınıf listeleri de aynı tabloya yazıldığı için onlarda da çalışır.
   ===================================================================== */
(function () {
  'use strict';

  var IKON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><polyline points="7 10 12 15 17 10"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>';

  function stilKur() {
    if (document.getElementById('kl-indir-stil')) return;
    var s = document.createElement('style');
    s.id = 'kl-indir-stil';
    s.textContent =
      '.kl-indir{display:inline-flex;align-items:center;gap:7px;padding:8px 14px;line-height:1;' +
        'font-size:1rem;touch-action:manipulation;}' +
      '.kl-indir svg{width:20px;height:20px;display:block;pointer-events:none;}' +
      '.kl-indir:active{transform:scale(.94);}' +
      '.kl-indir-menu{position:fixed;z-index:100000;background:#fff;border-radius:14px;padding:6px;' +
        'box-shadow:0 18px 50px rgba(15,23,42,.28);border:1px solid #E3EAF3;min-width:250px;' +
        'font-family:Inter,system-ui,sans-serif;direction:ltr;}' +
      '.kl-indir-menu b{display:block;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;' +
        'color:#8A93A3;padding:8px 12px 6px;}' +
      '.kl-indir-menu button{display:flex;align-items:center;gap:12px;width:100%;border:0;background:none;' +
        'padding:13px 12px;border-radius:10px;font:inherit;font-size:1rem;font-weight:600;color:#1F2937;' +
        'cursor:pointer;text-align:left;touch-action:manipulation;}' +
      '.kl-indir-menu button:hover{background:#F1F5FB;}' +
      '.kl-indir-menu button:active{background:#E6EEF9;transform:scale(.98);}' +
      '.kl-indir-menu i{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;' +
        'font-style:normal;font-weight:800;font-size:.8rem;color:#fff;flex-shrink:0;}' +
      '.kl-indir-menu small{display:block;font-size:.8rem;font-weight:500;color:#8A93A3;margin-top:2px;}' +
      '.kl-indir-tost{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:100001;' +
        'background:#1F2937;color:#fff;padding:12px 20px;border-radius:22px;font:600 .95rem Inter,system-ui,sans-serif;' +
        'box-shadow:0 12px 34px rgba(0,0,0,.3);}' +
      '.kl-indir-menu i svg{width:19px;height:19px;fill:none;stroke:currentColor;' +
        'stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}' +
      /* PDF sayfaları: ekranda görünmez, html2canvas yine de çizer
         (olcek.html'deki .olc-gizli ile aynı yöntem). */
      '.kl-gizli{position:fixed;left:-20000px;top:0;width:1px;height:1px;overflow:hidden;}' +
      /* SIFIRLAMA — sayfanın genel table/td/th kuralları (kaliplartablosu.css)
         bu kâğıda da uyguluyordu: sütunlar bozuluyor, zemin gri, ilk sütun
         kırmızı çıkıyordu. Kâğıdın içi yalnız buradaki kurallarla çizilsin. */
      '.kl-kagit,.kl-kagit *{margin:0;padding:0;border:0 none;background:none;' +
        'box-shadow:none;text-shadow:none;color:#1F2937;font-weight:400;font-style:normal;' +
        'text-align:left;vertical-align:middle;line-height:1.4;letter-spacing:normal;' +
        'text-transform:none;white-space:normal;box-sizing:border-box;' +
        /* yön açıkça yazılmazsa Türkçe hücredeki parantezler ters dönüyor */
        'direction:ltr;unicode-bidi:isolate;' +
        "font-family:Inter,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}" +
      '.kl-kagit{--ae:1240px;width:var(--ae);height:calc(var(--ae)*1.41421);background:#fff;' +
        'display:flex;flex-direction:column;' +
        'padding:calc(var(--ae)*.055) calc(var(--ae)*.06) calc(var(--ae)*.035);}' +
      '.kl-kagit h1{font-size:calc(var(--ae)*.034);font-weight:800;color:#14213D;}' +
      '.kl-kagit .kl-arbas{margin-top:calc(var(--ae)*.008);direction:rtl;unicode-bidi:isolate;text-align:right;' +
        "font-family:'Arakom','Amiri','Traditional Arabic',serif;" +
        'font-size:calc(var(--ae)*.04);line-height:1.8;color:#2A3242;}' +
      '.kl-kagit .kl-ust{margin:calc(var(--ae)*.012) 0 calc(var(--ae)*.018);' +
        'font-size:calc(var(--ae)*.019);color:#8A93A3;}' +
      '.kl-kagit .kl-govde{flex:1;min-height:0;overflow:hidden;}' +
      '.kl-kagit table{width:100% !important;border-collapse:collapse !important;' +
        'table-layout:fixed !important;}' +
      '.kl-kagit col.c1{width:8%}.kl-kagit col.c2{width:46%}.kl-kagit col.c3{width:46%}' +
      '.kl-kagit th{background:#EEF3F9 !important;border:1px solid #C9D4E2 !important;' +
        'color:#5A6B80 !important;font-weight:800 !important;letter-spacing:.06em !important;' +
        'text-transform:uppercase !important;text-align:center !important;' +
        'padding:calc(var(--ae)*.009) !important;font-size:calc(var(--ae)*.018) !important;}' +
      /* genişlikler satır içinde (sütun sayısına göre hesaplanıyor) */
      '.kl-kagit td{background:#fff !important;border:1px solid #C9D4E2 !important;' +
        'vertical-align:middle !important;' +
        'padding:calc(var(--ae)*.0072) calc(var(--ae)*.013) !important;}' +
      '.kl-kagit td.s{text-align:center !important;color:#9AA4B2 !important;' +
        'font-size:calc(var(--ae)*.018) !important;}' +
      /* harekeler harfin üstünde; satır aralığı bol olmazsa tepeleri kırpılıyor */
      '.kl-kagit td.a{direction:rtl;unicode-bidi:isolate;text-align:right !important;line-height:1.68 !important;' +
        "font-family:'Arakom','Amiri','Traditional Arabic',serif !important;" +
        'font-size:calc(var(--ae)*.031) !important;color:#111827 !important;}' +
      '.kl-kagit td.t{text-align:left !important;line-height:1.45 !important;' +
        'font-size:calc(var(--ae)*.021) !important;}' +
      '.kl-kagit .kl-alt{display:flex;justify-content:space-between;' +
        'padding-top:calc(var(--ae)*.014);font-size:calc(var(--ae)*.016) !important;' +
        'color:#9AA4B2 !important;}' +
      /* Kaç sütun? seçici — menünün başında (02.10.2026) */
      '.kl-indir-sut{display:flex;align-items:center;gap:10px;padding:2px 12px 8px;}' +
      '.kl-indir-sut>span{font-size:.82rem;font-weight:600;color:#5B6676;line-height:1.3;}' +
      '.kl-sut-grup{display:inline-flex;gap:4px;margin-left:auto;background:#EEF2F7;' +
        'padding:4px;border-radius:10px;flex:none;}' +
      '.kl-indir-menu .kl-sut-grup button{width:38px;height:34px;padding:0;gap:0;' +
        'display:inline-flex;align-items:center;justify-content:center;border-radius:8px;' +
        'background:none;color:#64748B;}' +
      '.kl-indir-menu .kl-sut-grup button svg{width:19px;height:19px;fill:none;' +
        'stroke:currentColor;stroke-width:1.8;stroke-linejoin:round;}' +
      '.kl-indir-menu .kl-sut-grup button:hover{background:rgba(255,255,255,.7);color:#C0392B;}' +
      '.kl-indir-menu .kl-sut-grup button.aktif{background:#fff;color:#C0392B;' +
        'box-shadow:0 2px 8px rgba(15,23,42,.14);}' +
      '.kl-indir-ayrac{height:1px;background:#EEF2F7;margin:0 6px 6px;}' +
      /* iki/üç sütunda punto küçülür, yoksa Arapça hücreye sığmaz */
      '.kl-kagit td.bos,.kl-kagit th.bos{border:0 !important;background:none !important;' +
        'padding:0 !important;}' +
      '.kl-kagit.sut2 td.a{font-size:calc(var(--ae)*.026) !important;line-height:1.6 !important;}' +
      '.kl-kagit.sut2 td.t{font-size:calc(var(--ae)*.0175) !important;}' +
      '.kl-kagit.sut2 td.s{font-size:calc(var(--ae)*.015) !important;}' +
      '.kl-kagit.sut2 td{padding:calc(var(--ae)*.006) calc(var(--ae)*.009) !important;}' +
      '.kl-kagit.sut3 td.a{font-size:calc(var(--ae)*.0225) !important;line-height:1.55 !important;}' +
      '.kl-kagit.sut3 td.t{font-size:calc(var(--ae)*.0155) !important;}' +
      '.kl-kagit.sut3 td.s{font-size:calc(var(--ae)*.013) !important;}' +
      '.kl-kagit.sut3 td{padding:calc(var(--ae)*.005) calc(var(--ae)*.007) !important;}' +
      '.kl-kagit.sut2 th,.kl-kagit.sut3 th{font-size:calc(var(--ae)*.015) !important;' +
        'padding:calc(var(--ae)*.007) !important;}' +
      '@media (pointer:coarse){.kl-indir{padding:12px 18px;font-size:1.1rem;}' +
        '.kl-indir-menu button{padding:17px 14px;font-size:1.1rem;}}' +
      '@media (max-width:520px){.kl-indir span{display:none;}}';
    document.head.appendChild(s);
  }

  function tost(m) {
    var t = document.createElement('div'); t.className = 'kl-indir-tost'; t.textContent = m;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600);
  }

  /* ---------- veri ---------- */
  function liste(key) {
    var tablo = (typeof thematicCategoriesData !== 'undefined') ? thematicCategoriesData : null;
    var cat = tablo && tablo[key];
    if (!cat || !cat.items || !cat.items.length) return null;
    return {
      baslik: String(cat.title || 'Kelime Listesi').replace(/<[^>]*>/g, '').trim(),
      arBaslik: String(cat.arTitle || '').replace(/<[^>]*>/g, '').trim(),
      kelimeler: cat.items.map(function (w) {
        return { ar: String(w.arText || '').trim(), tr: String(w.trText || '').trim() };
      })
    };
  }
  function kacis(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function dosyaAdi(L, uzanti) {
    var ad = L.baslik.toLocaleLowerCase('tr')
      .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'liste';
    return 'kelime-listesi-' + ad + '.' + uzanti;
  }
  function indir(blob, ad) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = ad;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  }
  function olay(bicim, L) {
    try { if (window.gtag) window.gtag('event', 'kelime_listesi_indir', { bicim: bicim, liste: L.baslik }); } catch (e) {}
  }

  /* ---------- kaç sütun? (02.10.2026) ------------------------------
     Öğretmen: "A4'ün yarısı boş kalıyor... zaten orada sütunlardan biri
     seçilmişse o çıkartılabilsin varsayılan olarak."
     Varsayılan, listenin EKRANDAKİ sütun sayısı: kelimeler.js'teki
     klSutun(key); o yoksa .kdf-defter'in sutun-N sınıfı; o da yoksa 1. */
  function sayfaSutunu(key) {
    var n = 0;
    try { if (typeof klSutun === 'function') n = klSutun(key); } catch (e) {}
    if (!n) {
      var d = document.querySelector('#grid-' + key + ' .kdf-defter');
      var m = d && /sutun-(\d)/.exec(d.className);
      n = m ? +m[1] : 0;
    }
    return (n >= 1 && n <= 3) ? n : 1;
  }

  /* Sütun grubu genişlikleri (% olarak). Gruplar arasında ince boşluk. */
  function sutunOlcu(n) {
    var bos = n > 1 ? 2 : 0;
    var grup = (100 - bos * (n - 1)) / n;
    return { bos: bos, s: grup * 0.09, a: grup * 0.47, t: grup * 0.44 };
  }

  var SUT_IKON = [
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="7.4" height="15" rx="1.8"/>' +
      '<rect x="13.1" y="4.5" width="7.4" height="15" rx="1.8"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="4.3" height="15" rx="1.5"/>' +
      '<rect x="9.85" y="4.5" width="4.3" height="15" rx="1.5"/>' +
      '<rect x="16.2" y="4.5" width="4.3" height="15" rx="1.5"/></svg>'
  ];

  /* ---------- ortak tablo (Word ve yazdırma) ---------- */
  function tabloHtml(L, word, n) {
    n = (n >= 1 && n <= 3) ? n : 1;
    var arFont = word ? "'Traditional Arabic','Arial'" : "'Arakom','Amiri','Traditional Arabic',serif";
    /* sütun arttıkça punto küçülür — yoksa Arapça hücreye sığmaz */
    var arPt = [20, 15.5, 12.5][n - 1], trPt = [13, 10.5, 9][n - 1], noPt = [11, 9.5, 8.5][n - 1];
    var o = sutunOlcu(n), kn = 'border:1px solid #9CA3AF;';
    var bosHucre = '<td style="border:0;width:' + o.bos + '%"></td>';
    var bosBas = '<th style="border:0;width:' + o.bos + '%"></th>';
    var h = '<h1 style="font-family:Arial,sans-serif;font-size:20pt;margin:0 0 4pt;color:#1F2937">' + kacis(L.baslik) + '</h1>';
    if (L.arBaslik) h += '<p dir="rtl" style="font-family:' + arFont + ';font-size:22pt;margin:0 0 10pt;color:#374151">' + kacis(L.arBaslik) + '</p>';
    h += '<p style="font-family:Arial,sans-serif;font-size:10pt;color:#6B7280;margin:0 0 12pt">' +
      L.kelimeler.length + ' kelime' + (n > 1 ? ' · ' + n + ' sütun' : '') + '</p>';
    h += '<table style="border-collapse:collapse;width:100%" cellpadding="' + (n > 1 ? 4 : 6) + '">' +
      '<thead><tr>';
    for (var c = 0; c < n; c++) {
      if (c) h += bosBas;
      h += '<th style="' + kn + 'background:#E5E7EB;font-family:Arial,sans-serif;font-size:' + noPt + 'pt;width:' + o.s.toFixed(2) + '%">#</th>' +
        '<th style="' + kn + 'background:#E5E7EB;font-family:Arial,sans-serif;font-size:' + noPt + 'pt;width:' + o.a.toFixed(2) + '%">Arapça</th>' +
        '<th style="' + kn + 'background:#E5E7EB;font-family:Arial,sans-serif;font-size:' + noPt + 'pt;width:' + o.t.toFixed(2) + '%">Türkçe</th>';
    }
    h += '</tr></thead><tbody>';
    /* satır satır: 1-2-3 üstte, 4-5-6 altta; numaralar sırayı belli eder */
    for (var i = 0; i < L.kelimeler.length; i += n) {
      h += '<tr>';
      for (var j = 0; j < n; j++) {
        if (j) h += bosHucre;
        var w = L.kelimeler[i + j];
        if (!w) { h += '<td style="' + kn + '"></td><td style="' + kn + '"></td><td style="' + kn + '"></td>'; continue; }
        h += '<td style="' + kn + 'font-family:Arial,sans-serif;font-size:' + noPt + 'pt;text-align:center;color:#6B7280">' + (i + j + 1) + '</td>' +
          '<td dir="rtl" style="' + kn + 'font-family:' + arFont + ';font-size:' + arPt + 'pt;text-align:right">' + kacis(w.ar) + '</td>' +
          '<td style="' + kn + 'font-family:Arial,sans-serif;font-size:' + trPt + 'pt">' + kacis(w.tr) + '</td>';
      }
      h += '</tr>';
    }
    return h + '</tbody></table>' +
      '<p style="font-family:Arial,sans-serif;font-size:9pt;color:#9CA3AF;margin-top:14pt">kidefarapca.com</p>';
  }

  /* ---------- Word ---------- */
  function word(L, n) {
    var doc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" ' +
      'xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + kacis(L.baslik) + '</title>' +
      '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->' +
      '<style>@page{size:21cm 29.7cm;margin:2cm 2cm 2cm 2cm}body{font-family:Arial,sans-serif}</style></head><body>' +
      tabloHtml(L, true, n) + '</body></html>';
    indir(new Blob(['﻿', doc], { type: 'application/msword' }), dosyaAdi(L, 'doc'));
    olay('word', L);
  }

  /* ---------- Excel ---------- */
  var sheetYukleniyor = null;
  function sheetJs() {
    if (window.XLSX) return Promise.resolve();
    if (!sheetYukleniyor) {
      sheetYukleniyor = new Promise(function (ok, hata) {
        var s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        s.onload = ok; s.onerror = function () { sheetYukleniyor = null; hata(); };
        document.head.appendChild(s);
      });
    }
    return sheetYukleniyor;
  }
  function excel(L) {
    var satirlar = [['#', 'Arapça', 'Türkçe']].concat(L.kelimeler.map(function (w, i) { return [i + 1, w.ar, w.tr]; }));
    sheetJs().then(function () {
      var X = window.XLSX, ws = X.utils.aoa_to_sheet(satirlar), wb = X.utils.book_new();
      ws['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 34 }];
      X.utils.book_append_sheet(wb, ws, L.baslik.slice(0, 31).replace(/[\\\/\?\*\[\]:]/g, ' ') || 'Liste');
      X.writeFile(wb, dosyaAdi(L, 'xlsx'));
      olay('excel', L);
    }).catch(function () {
      /* internet yok / CDN engelli: Excel'in açtığı UTF-8 CSV (Türkçe Excel ';' bekler) */
      var csv = satirlar.map(function (r) {
        return r.map(function (h) { h = String(h); return /[";\n]/.test(h) ? '"' + h.replace(/"/g, '""') + '"' : h; }).join(';');
      }).join('\r\n');
      indir(new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' }), dosyaAdi(L, 'csv'));
      olay('csv', L);
    });
  }

  /* ---------- Yazdır / PDF ---------- */
  function yazdir(L, n) {
    var fr = document.createElement('iframe');
    fr.setAttribute('aria-hidden', 'true');
    fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
    document.body.appendChild(fr);
    var d = fr.contentWindow.document;
    d.open();
    d.write('<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>' + kacis(L.baslik) + '</title>' +
      '<link rel="stylesheet" href="' + new URL('arakom.css', location.href).href + '">' +
      '<style>@page{size:A4;margin:16mm}body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      'tr{break-inside:avoid}thead{display:table-header-group}</style></head><body>' + tabloHtml(L, false, n) + '</body></html>');
    d.close();
    var yaz = function () {
      try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (e) { tost('Yazdırma açılamadı'); }
      setTimeout(function () { fr.remove(); }, 60000);
    };
    /* yazı tipi gelsin diye kısa bekleme */
    setTimeout(yaz, 400);
    olay('yazdir', L);
  }

  /* ---------- PDF (doğrudan indirme) ---------------------------------
     02.10.2026 — öğretmen isteği: "yazdırma seçeneği olmadan da pdf
     şeklinde indirsin". PDF'i sitenin kendi üreticisi yazıyor
     (sistem/kagitpdf.js → KidefKagit): sayfalar ekranda görünmeyen A4
     kutuları olarak kurulup çiziliyor, Arapça'yı tarayıcı dizdiği için
     harekeler ve harf birleşmeleri birebir doğru çıkıyor. */
  var kagitYukleniyor = null;
  function kagitKit() {
    if (window.KidefKagit) return Promise.resolve();
    if (!kagitYukleniyor) {
      kagitYukleniyor = new Promise(function (ok, hata) {
        var s = document.createElement('script');
        s.src = new URL('sistem/kagitpdf.js?v=2', location.href).href;
        s.onload = function () { window.KidefKagit ? ok() : hata(new Error('yok')); };
        s.onerror = function () { kagitYukleniyor = null; hata(new Error('yüklenemedi')); };
        document.head.appendChild(s);
      });
    }
    return kagitYukleniyor;
  }

  function kagitYap(L, no, ilk, kap, n) {
    var k = document.createElement('div');
    k.className = 'kl-kagit' + (n > 1 ? ' sut' + n : '');
    k.id = 'klKagit' + no;
    k.style.setProperty('--ae', (window.KidefKagit ? window.KidefKagit.KAYNAK_EN : 1240) + 'px');
    var bas = '';
    if (ilk) {
      bas = '<h1>' + kacis(L.baslik) + '</h1>' +
        (L.arBaslik ? '<p class="kl-arbas">' + kacis(L.arBaslik) + '</p>' : '') +
        '<p class="kl-ust">' + L.kelimeler.length + ' kelime</p>';
    } else {
      bas = '<p class="kl-ust">' + kacis(L.baslik) + ' — devamı</p>';
    }
    /* Sütun genişlikleri hem <colgroup> hem th'lerde SATIR İÇİNDE veriliyor:
       sayfanın genel "th:nth-child(2){width:11%}" kuralı sütunları bozuyordu,
       satır içi değer onu da geçer. n grup yan yana, aralarında ince boşluk. */
    var o = sutunOlcu(n), col = '', th = '';
    for (var c = 0; c < n; c++) {
      if (c) { col += '<col style="width:' + o.bos + '%">'; th += '<th class="bos" style="border:0"></th>'; }
      col += '<col style="width:' + o.s.toFixed(2) + '%"><col style="width:' + o.a.toFixed(2) +
             '%"><col style="width:' + o.t.toFixed(2) + '%">';
      th += '<th class="s" style="width:' + o.s.toFixed(2) + '%">#</th>' +
            '<th class="a" style="width:' + o.a.toFixed(2) + '%">Arapça</th>' +
            '<th class="t" style="width:' + o.t.toFixed(2) + '%">Türkçe</th>';
    }
    k.innerHTML = bas +
      '<div class="kl-govde"><table><colgroup>' + col + '</colgroup>' +
      '<thead><tr>' + th + '</tr></thead>' +
      '<tbody></tbody></table></div>' +
      '<div class="kl-alt"><span>kidefarapca.com</span><span class="kl-syf"></span></div>';
    kap.appendChild(k);
    return k;
  }

  /* Satırları ÖLÇEREK sayfalara böler: kelime ikiye bölünmez, tablo
     başlığı her sayfada yinelenir. */
  function kagitlariKur(L, kap, n) {
    n = (n >= 1 && n <= 3) ? n : 1;
    var kagitlar = [], i = 0;
    while (i < L.kelimeler.length) {
      var k = kagitYap(L, kagitlar.length + 1, kagitlar.length === 0, kap, n);
      var gv = k.querySelector('.kl-govde'), tb = k.querySelector('tbody'), kondu = 0;
      while (i < L.kelimeler.length) {
        var tr = document.createElement('tr'), ic = '';
        for (var c = 0; c < n; c++) {
          if (c) ic += '<td class="bos"></td>';
          ic += '<td class="s"></td><td class="a"></td><td class="t"></td>';
        }
        tr.innerHTML = ic;
        for (var c2 = 0; c2 < n; c2++) {
          var w = L.kelimeler[i + c2];
          var t = tr.querySelectorAll('td.s')[c2],
              a = tr.querySelectorAll('td.a')[c2],
              u = tr.querySelectorAll('td.t')[c2];
          if (!w) continue;
          t.textContent = i + c2 + 1; a.textContent = w.ar; u.textContent = w.tr;
        }
        tb.appendChild(tr);
        if (gv.scrollHeight > gv.clientHeight) {
          if (!kondu) { i += n; kondu++; break; }   /* tek satır bile sığmadı: bırak */
          tb.removeChild(tr);
          break;
        }
        i += n; kondu++;
      }
      kagitlar.push(k);
    }
    kagitlar.forEach(function (k, n) {
      k.querySelector('.kl-syf').textContent = (n + 1) + ' / ' + kagitlar.length;
    });
    return kagitlar;
  }

  var pdfCiziliyor = false;
  function pdf(L, n) {
    if (pdfCiziliyor) return;
    pdfCiziliyor = true;
    tost('PDF hazırlanıyor…');
    kagitKit().then(function () {
      var kap = document.createElement('div');
      kap.className = 'kl-gizli';
      document.body.appendChild(kap);
      var kagitlar = kagitlariKur(L, kap, n);
      window.KidefKagit.indir({
        kagitlar: kagitlar, boy: 'A4', ad: 'Kelime Listesi - ' + L.baslik,
        bitti: function (h) {
          kap.remove();
          pdfCiziliyor = false;
          if (h) { tost('PDF olmadı — yazdırma penceresi açılıyor'); yazdir(L, n); }
        }
      });
      olay('pdf', L);
    }).catch(function () {
      pdfCiziliyor = false;
      tost('PDF aracı yüklenemedi — yazdırma penceresi açılıyor');
      yazdir(L, n);
    });
  }

  /* ---------- menü ---------- */
  var acikMenu = null;
  function menuKapat() { if (acikMenu) { acikMenu.remove(); acikMenu = null; } }
  function menuAc(key, dugme) {
    menuKapat();
    var L = liste(key);
    if (!L) { tost('Bu listede kelime yok'); return; }
    var m = document.createElement('div');
    m.className = 'kl-indir-menu';
    /* Önce "kaç sütun?" — sayfadaki liste kaç sütunsa o seçili gelir. */
    var sut = sayfaSutunu(key);
    var sutHtml = '<div class="kl-indir-sut"><span>Kaç sütun?<br>A4 boş kalmasın</span>' +
      '<div class="kl-sut-grup" role="group" aria-label="Sütun sayısı">';
    for (var c = 1; c <= 3; c++) {
      sutHtml += '<button type="button" data-s="' + c + '" class="' + (c === sut ? 'aktif' : '') +
        '" title="' + c + ' sütun" aria-label="' + c + ' sütun" aria-pressed="' +
        (c === sut ? 'true' : 'false') + '">' + SUT_IKON[c - 1] + '</button>';
    }
    sutHtml += '</div></div><div class="kl-indir-ayrac"></div>';
    m.innerHTML = '<b>' + kacis(L.baslik) + ' · ' + L.kelimeler.length + ' kelime</b>' + sutHtml +
      '<button data-b="word"><i style="background:#2B579A">W</i><span>Word<small>Düzenlenebilir tablo (.doc)</small></span></button>' +
      '<button data-b="excel"><i style="background:#217346">X</i><span>Excel<small>Tablo (.xlsx)</small></span></button>' +
      '<button data-b="pdf"><i style="background:#B91C1C">PDF</i><span>PDF indir<small>Dosya doğrudan iner, pencere açılmaz</small></span></button>' +
      '<button data-b="yazdir"><i style="background:#334155">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 9V3.5h11V9"/>' +
        '<path d="M6.5 17.5h-2A1.5 1.5 0 0 1 3 16v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1.5 1.5 0 0 1-1.5 1.5h-2"/>' +
        '<rect x="6.5" y="14" width="11" height="6.5" rx="1"/></svg>' +
        '</i><span>Yazdır<small>Yazıcıya gönder (oradan PDF de kaydedilir)</small></span></button>';
    document.body.appendChild(m);
    var r = dugme.getBoundingClientRect(), mw = m.offsetWidth, mh = m.offsetHeight;
    var x = Math.min(Math.max(8, r.right - mw), window.innerWidth - mw - 8);
    var y = r.bottom + 8; if (y + mh > window.innerHeight - 8) y = Math.max(8, r.top - mh - 8);
    m.style.left = x + 'px'; m.style.top = y + 'px';
    m.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      /* sütun düğmesi: menü AÇIK kalır, yalnız seçim değişir */
      if (b.dataset.s) {
        sut = +b.dataset.s;
        [].forEach.call(m.querySelectorAll('.kl-sut-grup button'), function (x) {
          var a = x === b;
          x.classList.toggle('aktif', a);
          x.setAttribute('aria-pressed', a ? 'true' : 'false');
        });
        return;
      }
      menuKapat();
      if (b.dataset.b === 'word') word(L, sut);
      else if (b.dataset.b === 'excel') excel(L);
      else if (b.dataset.b === 'pdf') pdf(L, sut);
      else yazdir(L, sut);
    });
    acikMenu = m;
    setTimeout(function () {
      document.addEventListener('pointerdown', function dis(e) {
        if (acikMenu && !acikMenu.contains(e.target) && e.target !== dugme && !dugme.contains(e.target)) {
          menuKapat(); document.removeEventListener('pointerdown', dis, true);
        }
      }, true);
    }, 0);
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && acikMenu) { e.stopPropagation(); menuKapat(); } }, true);
  window.addEventListener('resize', menuKapat);

  /* ---------- düğme yalnız Liste Modu'nda ----------
     İnen şey bir LİSTE; çalışma kartları, hafıza oyunu ve test kipinde
     ekranda liste olmadığı için düğme de görünmüyor. Kip bilgisi mod
     satırındaki düğmeden okunuyor: Liste Modu seçiliyken btn-list-<key>
     'active' sınıfını taşıyor (bkz. kelimeler.js setMemoryMode). */
  function listeKipiMi(key) {
    var l = document.getElementById('btn-list-' + key);
    if (!l) return true;                       /* mod satırı yoksa sade liste */
    if (window.KidefKelimeTest && KidefKelimeTest.acikMi && KidefKelimeTest.acikMi(key)) return false;
    return l.classList.contains('active');
  }

  function gorunur(key, goster) {
    var b = document.getElementById('btn-indir-' + key);
    if (!b) return;
    b.style.display = goster ? 'inline-flex' : 'none';
    if (!goster && acikMenu) menuKapat();       /* açık menü varsa kapansın */
  }

  /* Test kipi mod satırını yerinde bırakıp üstüne kendi katmanını açıyor.
     kelimetest.js'e dokunmadan ac/kapat sarmalanıyor. */
  function testiSar() {
    var T = window.KidefKelimeTest;
    if (!T || T.__klIndirSarili) return;
    T.__klIndirSarili = true;
    var ac = T.ac, kapat = T.kapat;
    if (typeof ac === 'function') {
      T.ac = function (key) {
        var r = ac.apply(this, arguments);
        /* Sütun seçici de testte anlamsız; sarmalayıcı burada olduğu için
           onu da buradan ayarlıyoruz (kelimetest.js'e dokunulmuyor). */
        try { gorunur(key, false); if (window.klSutunGoster) klSutunGoster(key, false); } catch (e) {}
        return r;
      };
    }
    if (typeof kapat === 'function') {
      T.kapat = function (key) {
        var r = kapat.apply(this, arguments);
        try {
          var l = listeKipiMi(key);
          gorunur(key, l);
          if (window.klSutunGoster) klSutunGoster(key, l);
        } catch (e) {}
        return r;
      };
    }
  }

  /* ---------- düğmeleri ekle ---------- */
  function dugmeleriEkle() {
    stilKur();
    testiSar();
    var kapatlar = document.querySelectorAll('[id^="btn-fs-"]');
    [].forEach.call(kapatlar, function (k) {
      var key = k.id.slice(7);
      if (document.getElementById('btn-indir-' + key)) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'memory-btn kl-indir';
      b.id = 'btn-indir-' + key;
      b.title = 'Bu listeyi indir — Word, Excel, PDF ya da yazdır';
      b.setAttribute('aria-label', 'Listeyi indir');
      b.innerHTML = IKON + '<span>İndir</span>';
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        if (acikMenu) { menuKapat(); return; }
        menuAc(key, b);
      });
      k.parentNode.insertBefore(b, k);
      gorunur(key, listeKipiMi(key));          /* ilk hâli de kipe uysun */
    });
  }

  var asil = window.renderThematicLists;
  if (typeof asil === 'function') {
    window.renderThematicLists = function () {
      var r = asil.apply(this, arguments);
      try { dugmeleriEkle(); } catch (e) {}
      return r;
    };
  }
  /* sayfa zaten çizildiyse */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dugmeleriEkle);
  else dugmeleriEkle();
  window.KidefKelimeIndir = { ekle: dugmeleriEkle, goster: gorunur, listeKipiMi: listeKipiMi };
})();
