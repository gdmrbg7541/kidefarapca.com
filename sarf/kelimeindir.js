/* =====================================================================
   KELİME LİSTESİNİ İNDİR (01.10.2026)
   Kelime Dağarcığı'nda açılan her listenin üst satırına "İndir" düğmesi
   ekler. Üç biçim:
     • Word  (.doc)  — Word'de düzenlenebilir tablo
     • Excel (.xlsx) — SheetJS ilk basışta cdnjs'ten yüklenir;
                        yüklenemezse UTF-8 CSV iner (Excel açar)
     • Yazdır / PDF  — yazdırma penceresi; "PDF olarak kaydet" seçilebilir
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

  /* ---------- ortak tablo (Word ve yazdırma) ---------- */
  function tabloHtml(L, word) {
    var arFont = word ? "'Traditional Arabic','Arial'" : "'Arakom','Amiri','Traditional Arabic',serif";
    var h = '<h1 style="font-family:Arial,sans-serif;font-size:20pt;margin:0 0 4pt;color:#1F2937">' + kacis(L.baslik) + '</h1>';
    if (L.arBaslik) h += '<p dir="rtl" style="font-family:' + arFont + ';font-size:22pt;margin:0 0 10pt;color:#374151">' + kacis(L.arBaslik) + '</p>';
    h += '<p style="font-family:Arial,sans-serif;font-size:10pt;color:#6B7280;margin:0 0 12pt">' + L.kelimeler.length + ' kelime</p>';
    h += '<table style="border-collapse:collapse;width:100%" cellpadding="6">' +
      '<thead><tr>' +
      '<th style="border:1px solid #9CA3AF;background:#E5E7EB;font-family:Arial,sans-serif;font-size:11pt;width:8%">#</th>' +
      '<th style="border:1px solid #9CA3AF;background:#E5E7EB;font-family:Arial,sans-serif;font-size:11pt;width:46%">Arapça</th>' +
      '<th style="border:1px solid #9CA3AF;background:#E5E7EB;font-family:Arial,sans-serif;font-size:11pt;width:46%">Türkçe</th>' +
      '</tr></thead><tbody>';
    L.kelimeler.forEach(function (w, i) {
      h += '<tr>' +
        '<td style="border:1px solid #9CA3AF;font-family:Arial,sans-serif;font-size:11pt;text-align:center;color:#6B7280">' + (i + 1) + '</td>' +
        '<td dir="rtl" style="border:1px solid #9CA3AF;font-family:' + arFont + ';font-size:20pt;text-align:right">' + kacis(w.ar) + '</td>' +
        '<td style="border:1px solid #9CA3AF;font-family:Arial,sans-serif;font-size:13pt">' + kacis(w.tr) + '</td>' +
        '</tr>';
    });
    return h + '</tbody></table>' +
      '<p style="font-family:Arial,sans-serif;font-size:9pt;color:#9CA3AF;margin-top:14pt">kidefarapca.com</p>';
  }

  /* ---------- Word ---------- */
  function word(L) {
    var doc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" ' +
      'xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + kacis(L.baslik) + '</title>' +
      '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->' +
      '<style>@page{size:21cm 29.7cm;margin:2cm 2cm 2cm 2cm}body{font-family:Arial,sans-serif}</style></head><body>' +
      tabloHtml(L, true) + '</body></html>';
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
  function yazdir(L) {
    var fr = document.createElement('iframe');
    fr.setAttribute('aria-hidden', 'true');
    fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
    document.body.appendChild(fr);
    var d = fr.contentWindow.document;
    d.open();
    d.write('<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>' + kacis(L.baslik) + '</title>' +
      '<link rel="stylesheet" href="' + new URL('arakom.css', location.href).href + '">' +
      '<style>@page{size:A4;margin:16mm}body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      'tr{break-inside:avoid}thead{display:table-header-group}</style></head><body>' + tabloHtml(L, false) + '</body></html>');
    d.close();
    var yaz = function () {
      try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (e) { tost('Yazdırma açılamadı'); }
      setTimeout(function () { fr.remove(); }, 60000);
    };
    /* yazı tipi gelsin diye kısa bekleme */
    setTimeout(yaz, 400);
    olay('yazdir', L);
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
    m.innerHTML = '<b>' + kacis(L.baslik) + ' · ' + L.kelimeler.length + ' kelime</b>' +
      '<button data-b="word"><i style="background:#2B579A">W</i><span>Word<small>Düzenlenebilir tablo (.doc)</small></span></button>' +
      '<button data-b="excel"><i style="background:#217346">X</i><span>Excel<small>Tablo (.xlsx)</small></span></button>' +
      '<button data-b="yazdir"><i style="background:#B91C1C">PDF</i><span>Yazdır / PDF<small>Yazıcıya gönder ya da PDF kaydet</small></span></button>';
    document.body.appendChild(m);
    var r = dugme.getBoundingClientRect(), mw = m.offsetWidth, mh = m.offsetHeight;
    var x = Math.min(Math.max(8, r.right - mw), window.innerWidth - mw - 8);
    var y = r.bottom + 8; if (y + mh > window.innerHeight - 8) y = Math.max(8, r.top - mh - 8);
    m.style.left = x + 'px'; m.style.top = y + 'px';
    m.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      menuKapat();
      if (b.dataset.b === 'word') word(L);
      else if (b.dataset.b === 'excel') excel(L);
      else yazdir(L);
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

  /* ---------- düğmeleri ekle ---------- */
  function dugmeleriEkle() {
    stilKur();
    var kapatlar = document.querySelectorAll('[id^="btn-fs-"]');
    [].forEach.call(kapatlar, function (k) {
      var key = k.id.slice(7);
      if (document.getElementById('btn-indir-' + key)) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'memory-btn kl-indir';
      b.id = 'btn-indir-' + key;
      b.title = 'Bu listeyi indir — Word, Excel ya da PDF';
      b.setAttribute('aria-label', 'Listeyi indir');
      b.innerHTML = IKON + '<span>İndir</span>';
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        if (acikMenu) { menuKapat(); return; }
        menuAc(key, b);
      });
      k.parentNode.insertBefore(b, k);
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
  window.KidefKelimeIndir = { ekle: dugmeleriEkle };
})();
