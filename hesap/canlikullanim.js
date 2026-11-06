/* ======================================================================
   KIDEF · CANLI DERS KULLANIMI — yönetici gösterimi   (hesap/canlikullanim.js)
   ----------------------------------------------------------------------
                                                            06.11.2026
   Yönetici: "öğretmenler de bu sistemi kullanmak isterse ona göre ücret
   öderler ama video açarlarsa ve para harcanırsa".

   Ölçümü canlı ders odası yapar (hesap/canliOda.js): her ders bitince
   öğretmenin kullanicilar/{uid} belgesine
     canliKullanim: { 'YYYY-MM': { ders, sn, kameraSn, sesMB, goruntuMB, aktarMB, son } }
     canliDersler:  [ { id, ogr, ad, bas, bitis, sn, kameraSn, sesMB, goruntuMB, aktarMB, aktarli } ]
   yazılır. MB'ler «cihazlara teslim edilen» veri; aktarMB bunun Cloudflare
   aktarıcısından (TURN) geçen kısmı — ücret yalnız bunun üstünden: bütün
   öğretmenler ortak ayda 1.000 GB ücretsiz, aşan GB 0,05 $. Doğrudan
   bağlantı bedava.

   Bu dosya yalnız gösterir: Öğretmenler listesinde kart satırı (satir),
   listenin üstünde aylık toplam (toplamSatir), öğretmen penceresinin GENEL
   sekmesinde ay ay dökümü ve son dersler (bolum). Ek okuma yok: veri
   listenin zaten okuduğu belgeden gelir.
   ====================================================================== */
(function () {
  'use strict';
  if (window.KidefCanliKullanim) return;
  var UCRETSIZ_GB = 1000, GB_USD = 0.05;
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ayAd(d) { d = d || new Date(); return d.getFullYear() + '-' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1); }
  var AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  function ayYazi(k) { var m = /^(\d{4})-(\d{2})$/.exec(k || ''); return m ? AYLAR[+m[2] - 1] + ' ' + m[1] : String(k || ''); }
  function sure(sn) {
    sn = Math.max(0, Math.round(sn || 0));
    if (sn < 60) return sn + ' sn';
    var d = Math.floor(sn / 60), s = Math.floor(d / 60);
    return s < 1 ? d + ' dk' : s + ' sa ' + (d % 60) + ' dk';
  }
  function veri(mb) {
    mb = +mb || 0;
    if (mb >= 1000) return (Math.round(mb / 10) / 100).toLocaleString('tr-TR') + ' GB';
    return (Math.round(mb * 10) / 10).toLocaleString('tr-TR') + ' MB';
  }
  function usd(x) { return (Math.round(x * 100) / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $'; }
  function tarih(ms) { try { return new Date(+ms).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function ay(doc, k) { var c = doc && doc.canliKullanim; return (c && c[k || ayAd()]) || null; }
  function bos(v) { return { ders: +(v && v.ders) || 0, sn: +(v && v.sn) || 0, kameraSn: +(v && v.kameraSn) || 0, sesMB: +(v && v.sesMB) || 0, goruntuMB: +(v && v.goruntuMB) || 0, aktarMB: +(v && v.aktarMB) || 0 }; }

  /* Öğretmenler listesindeki kartın özet satırına eklenecek parça (bu ay) */
  function satir(doc) {
    var v = ay(doc); if (!v || !+v.ders) return '';
    var b = bos(v);
    return '<b>' + b.ders + '</b> canlı ders · ' + esc(sure(b.sn)) + ' · ' + esc(veri(b.sesMB + b.goruntuMB)) +
      (b.aktarMB ? ' (aktarıcı ' + esc(veri(b.aktarMB)) + ')' : '') + (b.kameraSn ? ' · kamera ' + esc(sure(b.kameraSn)) : '');
  }
  /* Listenin üstü: bütün öğretmenlerin bu ayki toplamı ve ücretsiz paya göre durum */
  function toplam(liste, k) {
    k = k || ayAd();
    var t = bos(null), n = 0;
    (liste || []).forEach(function (o) { var v = ay(o, k); if (!v) return; var b = bos(v); if (b.ders) n++; for (var x in t) t[x] += b[x]; });
    t.ogretmen = n; t.ay = k;
    t.aktarGB = t.aktarMB / 1000;
    t.asimGB = Math.max(0, t.aktarGB - UCRETSIZ_GB);
    t.asimUsd = t.asimGB * GB_USD;
    return t;
  }
  function toplamSatir(liste) {
    var t = toplam(liste);
    if (!t.ders) return '';
    return '<span class="aog-sayi-ek" title="Canlı ders: öğretmenin açtığı sayfalar öğrencinin cihazında + ses. Ücret yalnız aktarıcıdan (TURN) geçen veri için: ayda 1.000 GB ortak ücretsiz pay, aşan GB 0,05 $.">' +
      'Canlı ders bu ay: <b>' + t.ders + '</b> ders · ' + esc(sure(t.sn)) + ' · ' + t.ogretmen + ' öğretmen · aktarıcı <b>' + esc(veri(t.aktarMB)) + '</b> / ' + UCRETSIZ_GB + ' GB ücretsiz' +
      (t.asimGB ? ' · <b style="color:#B03A2E;">aşım ' + esc(veri(t.asimGB * 1000)) + ' ≈ ' + esc(usd(t.asimUsd)) + '</b>' : '') + '</span>';
  }
  /* Öğretmenin aşımdaki payı (aynı ay, bütün öğretmenlerin toplamına göre orantılı) */
  function pay(doc, liste, k) {
    var t = toplam(liste, k); var b = bos(ay(doc, k));
    if (!t.asimGB || !b.aktarMB || !t.aktarMB) return 0;
    return t.asimUsd * (b.aktarMB / t.aktarMB);
  }
  /* Öğretmen penceresi (GENEL): ay ay döküm + son dersler */
  function bolum(doc, liste) {
    var c = (doc && doc.canliKullanim) || {}, anahtarlar = Object.keys(c).sort().reverse().slice(0, 12);
    var dersler = Array.isArray(doc && doc.canliDersler) ? doc.canliDersler.slice() : [];
    if (!anahtarlar.length && !dersler.length) return '';
    var h = '<div class="ogd-bol"><h4>Canlı ders</h4>';
    if (anahtarlar.length) {
      h += '<table class="ogd-tablo ckl-tablo"><thead><tr><th>Ay</th><th>Ders</th><th>Süre</th><th>Kamera</th><th>Ses</th><th>Görüntü</th><th>Aktarıcı</th><th>Aşım payı</th></tr></thead><tbody>';
      anahtarlar.forEach(function (k) {
        var b = bos(c[k]), p = liste ? pay(doc, liste, k) : 0;
        h += '<tr><td>' + esc(ayYazi(k)) + '</td><td>' + b.ders + '</td><td>' + esc(sure(b.sn)) + '</td><td>' + (b.kameraSn ? esc(sure(b.kameraSn)) : '—') + '</td>' +
             '<td>' + esc(veri(b.sesMB)) + '</td><td>' + (b.goruntuMB ? esc(veri(b.goruntuMB)) : '—') + '</td><td>' + (b.aktarMB ? esc(veri(b.aktarMB)) : '—') + '</td>' +
             '<td>' + (p ? '<b style="color:#B03A2E;">' + esc(usd(p)) + '</b>' : '—') + '</td></tr>';
      });
      h += '</tbody></table>';
    }
    if (dersler.length) {
      dersler.sort(function (a, b) { return (+b.bas || 0) - (+a.bas || 0); });
      h += '<p class="ckl-bas">Son dersler</p><ul class="ckl-liste">' + dersler.slice(0, 10).map(function (d) {
        return '<li>' + esc(tarih(d.bas)) + ' · ' + esc(d.ad || 'Öğrenci') + ' · ' + esc(sure(d.sn)) +
          (d.kameraSn ? ' · kamera ' + esc(sure(d.kameraSn)) : '') + ' · ' + esc(veri((+d.sesMB || 0) + (+d.goruntuMB || 0))) +
          (d.aktarli ? ' · aktarıcıdan ' + esc(veri(d.aktarMB)) : ' · doğrudan') + '</li>';
      }).join('') + '</ul>';
    }
    h += '<p class="ogd-not">Ücret yalnız aktarıcıdan (Cloudflare TURN) geçen veri için: bütün öğretmenler ortak ayda ' + UCRETSIZ_GB + ' GB ücretsiz, aşan GB 0,05 $. Doğrudan bağlantı ve sayfa yansıtma bedava; kamera açılmadıkça ses tek başına ücretsiz payı aşmaz.</p></div>';
    return h;
  }
  function stil() {
    if (document.getElementById('cklStil')) return;
    var s = document.createElement('style'); s.id = 'cklStil';
    s.textContent = '.ckl-tablo{width:100%;border-collapse:collapse;font-size:.84rem;margin:4px 0 8px}.ckl-tablo th,.ckl-tablo td{padding:5px 6px;border-bottom:1px solid #eee;text-align:left;white-space:nowrap}' +
      '.ckl-tablo th{font-weight:700;color:#5A7186;font-size:.76rem}.ckl-bas{margin:8px 0 4px;font-weight:700;font-size:.86rem}.ckl-liste{margin:0;padding-left:18px;font-size:.84rem;line-height:1.5}' +
      '.ogd-not{margin:8px 0 0;font-size:.78rem;color:#7B8A99;line-height:1.4}@media(max-width:600px){.ckl-tablo{display:block;overflow:auto}}';
    document.head.appendChild(s);
  }
  window.KidefCanliKullanim = { satir: satir, toplam: toplam, toplamSatir: toplamSatir, pay: pay, bolum: function (doc, liste) { stil(); return bolum(doc, liste); },
                                ayAd: ayAd, UCRETSIZ_GB: UCRETSIZ_GB, GB_USD: GB_USD };
})();
