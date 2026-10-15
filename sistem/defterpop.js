/* =====================================================================
   SINIF DEFTERİ PENCERESİ — hafta hafta öğrenme çıktıları
                                                 sistem/defterpop.js
   ---------------------------------------------------------------------
   Öğretmen (15.10.2026), sırasıyla:
     1) "sınıf defterine basınca o haftaki öğrenme çıktısını ... ayrı bi
        sekme olmadan direkt popup şeklinde açılsın — hem imam hatip
        kategorisinde hem bi sınıf açılmışken."
     2) "deftere yaz olmasın, direkt hafta hafta öğrenme çıktılarının
        olduğu kısım çıksın dikey scrolla bakılabilsin."
     3) "imam hatip kategorisinde bi sütun olsun haftalar."
     4) "veriler ... sınıf listesindekilerin aynısı olsun, ayrı olmasın;
        ortaokulda Arapça haftada iki ders olduğu için iki şey yazılmalı."
     5) "defteri aç tuşu olmasın, orada popup şeklinde açılacak."

   VERİ — SINIF DEFTERİYLE AYNI KAYNAK
   Sınıf panelindeki defter neyi gösteriyorsa bu pencere de onu gösterir:
   sistem/ciktiveri.js (window.KIDEF_CIKTI) — yıllık plan belgelerinden
   üretilen, KİTABA göre haftalık çıktılar. Anahtar sinifdefteri.js ile
   birebir aynı kuruluyor: "6@2026-2027" gibi; tek kitaplı sınıfta "8".
   Her haftada ünite başlığı, o haftanın ÖĞRENME ÇIKTILARI (ortaokulda
   haftada iki ders olduğu için çoğu haftada iki madde) ve içerik satırı
   (konu · sözcük · dil bilgisi) var. Kitabın planı havuzda yoksa
   sistem/kazanimoneri.js'teki genel öneriye düşülür.
   Dosya 157 KB olduğu için ana sayfaya yüklenmez; pencere ilk açıldığında
   bir kez getirilir (sinifdefteri.js de böyle yapıyor).

   Pencere YALNIZ OKUNUR: yazma tuşu da, sekmeye geçiş tuşu da yok.
   Açık sınıf AYNI SEVİYEDEYSE o şubenin defterine yazılmış satır, ait
   olduğu haftanın altında görünür (8. sınıf kartında 6-A'nın defteri
   görünmesin diye seviye karşılaştırılıyor).
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefDefterPop) return;

  var KAP = 'dfpKap';
  var STIL = 'dfpStil';
  var BASLANGIC = '2026-09-14';      /* sinifdefteri.js ile aynı */
  var HAFTA_SAYISI = 36;
  var TATIL = {
    9:  { ad: '1. Ara Tatil',   hafta: 1 },
    18: { ad: 'Sömestr Tatili', hafta: 2 },
    22: { ad: '2. Ara Tatil',   hafta: 1 }
  };
  var AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  function kac(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function gunAy(d) { return d.getDate() + ' ' + AY[d.getMonth()]; }

  /* ------------------------------------------------------- takvim */
  function takvim() {
    var D = window.KidefSinifDefteri;
    if (D && typeof D.takvim === 'function') {
      try { var t = D.takvim(); if (t && t.length) return t; } catch (e) { }
    }
    var p = BASLANGIC.split('-');
    var bas = new Date(+p[0], +p[1] - 1, +p[2]), kayma = 0, c = [];
    for (var i = 1; i <= HAFTA_SAYISI; i++) {
      var b = new Date(bas);
      b.setDate(bas.getDate() + (i - 1) * 7 + kayma);
      var s = new Date(b);
      s.setDate(b.getDate() + 6);
      c.push({ no: i, bas: b, bit: s, tatil: TATIL[i] || null });
      if (TATIL[i]) kayma += TATIL[i].hafta * 7;
    }
    return c;
  }
  function buHafta() {
    var t = takvim(), bugun = new Date(), son = t[0];
    for (var i = 0; i < t.length; i++) {
      if (bugun >= t[i].bas && bugun <= t[i].bit) return t[i];
      if (bugun > t[i].bit) son = t[i];
    }
    return son;
  }

  /* --------------------------------- yıllık çıktı havuzu (geç yükleme) */
  var durum = 0;                      /* 0 yok · 1 yükleniyor · 2 hazır · 3 olmadı */
  var bekleyen = [];

  function ciktiYukle(bitince) {
    if (window.KIDEF_CIKTI) { durum = 2; bitince(); return; }
    if (durum === 3) { bitince(); return; }
    bekleyen.push(bitince);
    if (durum === 1) return;
    durum = 1;
    var t = document.createElement('script');
    t.src = 'sistem/ciktiveri.js?v=5894cc11';
    t.onload = function () { durum = 2; bekleyenleriCagir(); };
    t.onerror = function () { durum = 3; bekleyenleriCagir(); };
    (document.head || document.documentElement).appendChild(t);
  }
  function bekleyenleriCagir() {
    var l = bekleyen.slice();
    bekleyen = [];
    l.forEach(function (f) { try { f(); } catch (e) { } });
  }

  /* Sınıfın SEÇİLİ kitabının çıktı anahtarı — sinifdefteri.js ile aynı. */
  function ciktiAnahtar(sinif) {
    var C = window.KIDEF_CIKTI;
    var n = parseInt(String(sinif).replace(/[^0-9]/g, ''), 10);
    if (!C || !n) return null;
    var k = null;
    try {
      var V = window.KidefSinifVeri;
      k = (V && V.seciliVeriYili) ? V.seciliVeriYili(n) : null;
    } catch (e) { }
    if (k && C[n + '@' + k.yil]) return n + '@' + k.yil;
    if (C[String(n)]) return String(n);
    return null;
  }
  /* Genel öneri (kitabın planı havuzda yoksa) */
  function genelOneri(sinif) {
    var K = window.KidefKazanimOneri;
    if (!K || typeof K.al !== 'function') return null;
    try { return K.al(sinif); } catch (e) { return null; }
  }

  /* ---------------------- açık sınıf (yalnız AYNI seviyedeyse kullanılır) */
  function seviyeNo(ad) {
    try {
      var K = window.KidefKazanimOneri;
      if (K && K.sinifCoz) { var n = K.sinifCoz(ad || ''); if (n) return parseInt(n, 10); }
    } catch (e) { }
    var m = String(ad || '').match(/\d{1,2}/);
    return m ? parseInt(m[0], 10) : 0;
  }
  function aktif(sinif) {
    try {
      var a = (typeof window.llAktifSinif === 'function') ? window.llAktifSinif() : null;
      if (!a || !a.lId || !a.cId) return null;
      var d = (typeof data !== 'undefined' && data) ? data : null;
      var lv = d && d.levels ? d.levels[a.lId] : null;
      var sb = (lv && lv.classes) ? lv.classes[a.cId] : null;
      if (!sb) return null;
      /* 8. sınıf kartında 6-A'nın defteri görünmesin: seviye tutmalı. */
      var n = parseInt(String(sinif).replace(/[^0-9]/g, ''), 10);
      if (seviyeNo(lv.name) !== n) return null;
      return { ad: sb.name || '', defter: sb.defter || null };
    } catch (e) { return null; }
  }

  /* --------------------------------------------------------- stil */
  function stilKur() {
    if (document.getElementById(STIL)) return;
    var s = document.createElement('style');
    s.id = STIL;
    s.textContent = [
      '#' + KAP + '{ position:fixed; inset:0; z-index:10090; display:flex;',
      '  align-items:center; justify-content:center; padding:18px;',
      '  background:rgba(12,24,40,.5); backdrop-filter:blur(3px); }',
      '#' + KAP + ' .dfp-kutu{ width:100%; max-width:720px; max-height:90vh;',
      '  display:flex; flex-direction:column; overflow:hidden;',
      '  background:#fff; border-radius:20px; box-shadow:0 26px 60px rgba(8,20,38,.42);',
      '  border-top:6px solid #1F3A68; }',
      '#' + KAP + ' .dfp-bas{ flex:none; display:flex; align-items:center; gap:12px;',
      '  padding:15px 20px 12px; border-bottom:1px solid #EDF1F6; }',
      '#' + KAP + ' .dfp-ikon{ flex:none; width:44px; height:44px; }',
      '#' + KAP + ' .dfp-ikon svg{ width:100%; height:100%; display:block; }',
      '#' + KAP + ' .dfp-bas b{ display:block; font-size:1.12rem; color:#16324F; line-height:1.2; }',
      '#' + KAP + ' .dfp-bas small{ display:block; margin-top:2px; font-size:.88rem; color:#6B7A8C; }',
      '#' + KAP + ' .dfp-kapat{ margin-inline-start:auto; flex:none; width:34px; height:34px;',
      '  border:none; border-radius:50%; background:#F2F5F9; color:#44607A; font-size:20px;',
      '  line-height:1; cursor:pointer; }',
      '#' + KAP + ' .dfp-kapat:hover{ background:#E4EAF2; }',
      '#' + KAP + ' .dfp-liste{ flex:1 1 auto; min-height:0; overflow-y:auto;',
      '  padding:6px 14px 16px; overscroll-behavior:contain; }',
      /* ünite ayracı */
      '#' + KAP + ' .dfp-unite{ position:sticky; top:0; z-index:2; margin:10px 0 6px;',
      '  padding:7px 12px; border-radius:10px; background:#EEF3FA; border:1px solid #D9E4F2;',
      '  font-size:.8rem; font-weight:800; letter-spacing:.02em; color:#1F3A68; }',
      /* hafta satırı */
      '#' + KAP + ' .dfp-hafta{ display:flex; gap:12px; padding:11px 10px;',
      '  border-bottom:1px solid #F0F4F9; }',
      '#' + KAP + ' .dfp-hafta:last-child{ border-bottom:none; }',
      '#' + KAP + ' .dfp-no{ flex:none; width:46px; text-align:center; }',
      '#' + KAP + ' .dfp-no b{ display:block; font-size:1.02rem; font-weight:800; color:#1F3A68; line-height:1.1; }',
      '#' + KAP + ' .dfp-no small{ display:block; font-size:.66rem; letter-spacing:.06em;',
      '  text-transform:uppercase; color:#93A3B5; }',
      '#' + KAP + ' .dfp-ic{ min-width:0; flex:1 1 auto; }',
      '#' + KAP + ' .dfp-tarih{ font-size:.78rem; color:#8094A8; margin:0 0 5px; }',
      '#' + KAP + ' .dfp-cikti{ list-style:none; margin:0; padding:0; }',
      '#' + KAP + ' .dfp-cikti li{ position:relative; margin:0 0 5px; padding-inline-start:16px;',
      '  font-size:.98rem; line-height:1.5; color:#16324F; }',
      '#' + KAP + ' .dfp-cikti li::before{ content:""; position:absolute; inset-inline-start:0; top:.62em;',
      '  width:7px; height:7px; border-radius:50%; background:#1F3A68; opacity:.55; }',
      '#' + KAP + ' .dfp-icerik{ margin:4px 0 0; font-size:.86rem; line-height:1.5; color:#6B7A8C; }',
      '#' + KAP + ' .dfp-bos{ margin:0; font-size:.95rem; color:#9AA9B8; font-style:italic; }',
      '#' + KAP + ' .dfp-yazili{ margin:7px 0 0; padding:7px 10px; border-radius:10px;',
      '  background:#EEF9F4; border:1px solid #BFE6D6; font-size:.86rem; line-height:1.45; color:#0B5F51; }',
      '#' + KAP + ' .dfp-hafta.simdi{ background:#F3F8FF; border-radius:14px;',
      '  border:1px solid #CBDDF5; box-shadow:0 6px 16px -10px #1F3A68; }',
      '#' + KAP + ' .dfp-hafta.simdi .dfp-no b{ color:#15408A; }',
      '#' + KAP + ' .dfp-rozet{ display:inline-block; margin-inline-start:8px; font-size:.66rem;',
      '  font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:#fff;',
      '  background:#1F3A68; border-radius:999px; padding:3px 8px; vertical-align:2px; }',
      '#' + KAP + ' .dfp-tatil{ display:flex; align-items:center; gap:10px; margin:8px 10px;',
      '  padding:7px 12px; border-radius:999px; background:#FFF6E6; border:1px solid #F3DEB3;',
      '  font-size:.86rem; font-weight:700; color:#8A5A00; }',
      '#' + KAP + ' .dfp-yukleniyor{ padding:26px 12px; text-align:center; color:#6B7A8C; }',
      '#' + KAP + ' .dfp-alt{ flex:none; padding:11px 20px 15px; border-top:1px solid #EDF1F6;',
      '  background:#FBFDFF; font-size:.84rem; line-height:1.45; color:#6B7A8C; }',
      '@media (max-width:520px){ #' + KAP + '{ padding:10px; }',
      '  #' + KAP + ' .dfp-kutu{ max-width:100%; max-height:94vh; }',
      '  #' + KAP + ' .dfp-no{ width:38px; } }'
    ].join('');
    (document.head || document.documentElement).appendChild(s);
  }

  function ikon(sinif) {
    try {
      if (typeof window.a4IkonDefter === 'function') {
        return '<svg viewBox="0 0 48 48" aria-hidden="true">' + window.a4IkonDefter(sinif) + '</svg>';
      }
    } catch (e) { }
    return '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<rect x="9" y="5" width="28" height="38" rx="3" fill="#1F3A68"/>' +
      '<rect x="18" y="13" width="15" height="16" rx="2" fill="#fff"/>' +
      '<text x="25.5" y="25.4" text-anchor="middle" font-size="13" font-weight="800" fill="#1F3A68">' +
      kac(String(sinif || '').replace(/[^0-9]/g, '')) + '</text></svg>';
  }

  function kapat() {
    var k = document.getElementById(KAP);
    if (k && k.parentNode) k.parentNode.removeChild(k);
    document.removeEventListener('keydown', esc, true);
  }
  function esc(e) { if (e.key === 'Escape') kapat(); }

  /* --------------------------------------------------- liste gövdesi */
  function listeHtml(sinif, simdi, a) {
    var t = takvim();
    var anahtar = ciktiAnahtar(sinif);
    var v = anahtar ? window.KIDEF_CIKTI[anahtar] : null;
    var gen = v ? null : genelOneri(sinif);
    var sonUnite = '';
    var h = '';

    t.forEach(function (w) {
      var kayit = (v && v.haftalar) ? v.haftalar[String(w.no)] : null;
      var unite = kayit && kayit.u ? kayit.u : '';
      if (unite && unite !== sonUnite) {
        h += '<div class="dfp-unite">' + kac(unite) + '</div>';
        sonUnite = unite;
      }
      var ciktilar = [];
      if (kayit && kayit.c && kayit.c.length) ciktilar = kayit.c;
      else if (gen && gen.haftalar && gen.haftalar[w.no - 1]) ciktilar = [gen.haftalar[w.no - 1]];

      var yazili = (a && a.defter && a.defter[String(w.no)]) ? a.defter[String(w.no)] : null;

      h += '<div class="dfp-hafta' + (w.no === simdi.no ? ' simdi' : '') + '"' +
           (w.no === simdi.no ? ' data-dfp-simdi="1"' : '') + '>' +
        '<span class="dfp-no"><b>' + w.no + '</b><small>hafta</small></span>' +
        '<span class="dfp-ic">' +
          '<p class="dfp-tarih">' + kac(gunAy(w.bas) + ' – ' + gunAy(w.bit)) +
          (w.no === simdi.no ? '<span class="dfp-rozet">bu hafta</span>' : '') + '</p>' +
          (ciktilar.length
            ? '<ul class="dfp-cikti">' + ciktilar.map(function (c) {
                return '<li>' + kac(c) + '</li>';
              }).join('') + '</ul>'
            : '<p class="dfp-bos">Bu hafta için hazır öğrenme çıktısı yok.</p>') +
          (kayit && kayit.i ? '<p class="dfp-icerik">' + kac(kayit.i) + '</p>' : '') +
          (yazili && yazili.c ? '<p class="dfp-yazili"><b>Deftere yazılmış:</b> ' +
            kac(yazili.c) + (yazili.t ? ' (' + kac(yazili.t) + ')' : '') + '</p>' : '') +
        '</span></div>';

      if (w.tatil) {
        h += '<div class="dfp-tatil">' + kac(w.tatil.ad || 'Tatil') +
             (w.tatil.hafta ? ' · ' + w.tatil.hafta + ' hafta' : '') + '</div>';
      }
    });
    return { html: h, kitap: v ? (v.ad || '') : '', program: v ? (v.program || '') : (gen ? gen.program : ''),
             saat: v ? (v.saat || '') : '' };
  }

  function doldur(kap, sinif, simdi, a) {
    var r = listeHtml(sinif, simdi, a);
    var l = kap.querySelector('.dfp-liste');
    if (l) l.innerHTML = r.html;
    var ust = kap.querySelector('.dfp-ust');
    if (ust) {
      ust.textContent = (r.kitap ? r.kitap + ' · ' : '') + HAFTA_SAYISI +
        ' hafta · şu an ' + simdi.no + '. hafta' + (a && a.ad ? ' · ' + a.ad : '');
    }
    var alt = kap.querySelector('.dfp-alt');
    if (alt) {
      var p = [];
      if (r.program) p.push(r.program);
      if (r.saat) p.push(r.saat);
      alt.textContent = p.join(' · ');
      alt.style.display = p.length ? '' : 'none';
    }
    try {
      var s = kap.querySelector('[data-dfp-simdi]');
      if (s && s.scrollIntoView) s.scrollIntoView({ block: 'center' });
    } catch (e) { }
  }

  function ac(sinif) {
    stilKur();
    kapat();
    var simdi = buHafta() || { no: 1, bas: new Date(), bit: new Date() };
    var a = aktif(sinif);

    var kap = document.createElement('div');
    kap.id = KAP;
    kap.setAttribute('role', 'dialog');
    kap.setAttribute('aria-modal', 'true');
    kap.innerHTML = '<div class="dfp-kutu">' +
      '<div class="dfp-bas"><span class="dfp-ikon">' + ikon(sinif) + '</span>' +
      '<span><b>Sınıf Defteri · ' + kac(sinif) + '. Sınıf</b>' +
      '<small class="dfp-ust">yıllık çıktılar yükleniyor…</small></span>' +
      '<button type="button" class="dfp-kapat" data-dfp="kapat" aria-label="Kapat">&times;</button></div>' +
      '<div class="dfp-liste"><div class="dfp-yukleniyor">Haftalık öğrenme çıktıları yükleniyor…</div></div>' +
      '<div class="dfp-alt" style="display:none"></div></div>';

    kap.addEventListener('click', function (e) {
      if (e.target === kap) { kapat(); return; }
      var d = e.target.closest ? e.target.closest('[data-dfp]') : null;
      if (d && d.getAttribute('data-dfp') === 'kapat') kapat();
    }, false);

    document.body.appendChild(kap);
    document.addEventListener('keydown', esc, true);

    ciktiYukle(function () {
      if (!document.getElementById(KAP)) return;   /* kapatılmışsa boşuna çizme */
      doldur(kap, sinif, simdi, a);
    });
  }

  window.KidefDefterPop = { ac: ac, kapat: kapat, buHafta: buHafta };
})();
