/* =====================================================================
   SINIF DEFTERİ PENCERESİ — bu hafta deftere ne yazılır?
                                                 sistem/defterpop.js
   ---------------------------------------------------------------------
   Öğretmen (15.10.2026): "sınıf defterine basınca o haftaki öğrenme
   çıktısını veya deftere ne yazması gerekiyorsa ayrı bi sekme olmadan
   direkt popup şeklinde açılsın — hem imam hatip kategorisinde hem bi
   sınıf açılmışken."

   NE YAPAR
   Belge şeridindeki "Sınıf Defteri" kartına basınca açılan pencere:
     · kaçıncı hafta olduğumuz ve tarih aralığı,
     · o haftanın ÖĞRENME ÇIKTISI (sistem/kazanimoneri.js),
     · yıl sonu hedefi,
     · bir sınıf açıksa o şubenin defterinde bu haftaya yazılmış satır;
       yoksa tek dokunuşla yazma ("Deftere yaz") ve defteri açma tuşları,
     · sınıf açık değilse (İmam Hatip kategorisi) yalnız okunur: metni
       kopyalama tuşu ve "sınıfını seçince yazabilirsin" notu.

   NEREDEN OKUR / NEREYE YAZAR
     · Takvim ve hafta: KidefSinifDefteri (varsa) — yoksa aynı sabitlerle
       burada hesaplanır (14.09.2026 başlangıç, 36 hafta, üç tatil).
     · Öneri: KidefKazanimOneri.al(sinif).haftalar[hafta-1]
     · Yazma: data.levels[lId].classes[cId].defter[hafta] = {t,c,g} ve
       listelerim.js'teki save() — sinifdefteri.js ile AYNI yer, ayrı
       depo yok. Defter sekmesi açıksa yeniden çizilir.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefDefterPop) return;

  var KAP = 'dfpKap';
  var STIL = 'dfpStil';
  var BASLANGIC = '2026-09-14';      /* sinifdefteri.js ile aynı */
  var HAFTA_SAYISI = 36;
  var TATIL = { 9: 1, 18: 2, 22: 1 }; /* hafta no → kaç hafta ara */
  var AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  function kac(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function iki(n) { return (n < 10 ? '0' : '') + n; }
  function isoYaz(d) { return d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate()); }
  function gunAy(d) { return d.getDate() + ' ' + AY[d.getMonth()]; }

  /* ---- takvim: önce sınıf defterinin kendi takvimi, yoksa buradaki ---- */
  function takvim() {
    var D = window.KidefSinifDefteri;
    if (D && typeof D.takvim === 'function') {
      try { return D.takvim(); } catch (e) { }
    }
    var p = BASLANGIC.split('-');
    var bas = new Date(+p[0], +p[1] - 1, +p[2]), kayma = 0, c = [];
    for (var i = 1; i <= HAFTA_SAYISI; i++) {
      var b = new Date(bas);
      b.setDate(bas.getDate() + (i - 1) * 7 + kayma);
      var s = new Date(b);
      s.setDate(b.getDate() + 6);
      c.push({ no: i, bas: b, bit: s });
      if (TATIL[i]) kayma += TATIL[i] * 7;
    }
    return c;
  }
  /* Bugünün haftası; tatile denk gelirse en yakın geçmiş hafta. */
  function buHafta() {
    var D = window.KidefSinifDefteri, h = null;
    if (D && typeof D.buHafta === 'function') {
      try { h = D.buHafta(); } catch (e) { h = null; }
    }
    if (h && h.no) return h;
    if (typeof h === 'number' && h) {
      var t0 = takvim();
      for (var j = 0; j < t0.length; j++) if (t0[j].no === h) return t0[j];
    }
    var t = takvim(), bugun = new Date(), son = t[0];
    for (var i = 0; i < t.length; i++) {
      if (bugun >= t[i].bas && bugun <= t[i].bit) return t[i];
      if (bugun > t[i].bit) son = t[i];
    }
    return son;
  }

  function oneriMetni(sinif, haftaNo) {
    var K = window.KidefKazanimOneri;
    if (!K || typeof K.al !== 'function') return null;
    var v = null;
    try { v = K.al(sinif); } catch (e) { v = null; }
    if (!v) return null;
    return { metin: (v.haftalar || [])[haftaNo - 1] || '', hedef: v.hedef || '', program: v.program || '' };
  }

  /* ---- açık sınıf ve o şubenin defteri ---- */
  function aktif() {
    try {
      var a = (typeof window.llAktifSinif === 'function') ? window.llAktifSinif() : null;
      if (!a || !a.lId || !a.cId) return null;
      var d = (typeof data !== 'undefined' && data) ? data : null;
      var lv = d && d.levels ? d.levels[a.lId] : null;
      var sb = (lv && lv.classes) ? lv.classes[a.cId] : null;
      if (!sb) return null;
      return { lId: a.lId, cId: a.cId, sube: sb, ad: sb.name || '', seviye: (lv.name || '') };
    } catch (e) { return null; }
  }
  function defterSatiri(a, haftaNo) {
    try {
      var d = a.sube.defter;
      return (d && d[String(haftaNo)]) ? d[String(haftaNo)] : null;
    } catch (e) { return null; }
  }
  function defterYaz(a, haftaNo, metin) {
    try {
      if (!a.sube.defter || typeof a.sube.defter !== 'object') a.sube.defter = {};
      a.sube.defter[String(haftaNo)] = {
        t: isoYaz(new Date()), c: metin, g: Date.now()
      };
      if (typeof save === 'function') save();
      var D = window.KidefSinifDefteri;
      if (D && typeof D.ciz === 'function') { try { D.ciz(); } catch (e) { } }
      return true;
    } catch (e) { return false; }
  }

  /* ----------------------------------------------------------- stil */
  function stilKur() {
    if (document.getElementById(STIL)) return;
    var s = document.createElement('style');
    s.id = STIL;
    s.textContent = [
      '#' + KAP + '{ position:fixed; inset:0; z-index:10090; display:flex;',
      '  align-items:center; justify-content:center; padding:18px;',
      '  background:rgba(12,24,40,.5); backdrop-filter:blur(3px); }',
      '#' + KAP + ' .dfp-kutu{ width:100%; max-width:620px; max-height:88vh; overflow:auto;',
      '  background:#fff; border-radius:20px; box-shadow:0 26px 60px rgba(8,20,38,.42);',
      '  border-top:6px solid #1E3A5F; }',
      '#' + KAP + ' .dfp-bas{ display:flex; align-items:center; gap:12px;',
      '  padding:16px 20px 12px; border-bottom:1px solid #EDF1F6; }',
      '#' + KAP + ' .dfp-ikon{ flex:none; width:44px; height:44px; }',
      '#' + KAP + ' .dfp-ikon svg{ width:100%; height:100%; display:block; }',
      '#' + KAP + ' .dfp-bas b{ display:block; font-size:1.12rem; color:#16324F; line-height:1.2; }',
      '#' + KAP + ' .dfp-bas small{ display:block; margin-top:2px; font-size:.9rem; color:#6B7A8C; }',
      '#' + KAP + ' .dfp-kapat{ margin-inline-start:auto; flex:none; width:34px; height:34px;',
      '  border:none; border-radius:50%; background:#F2F5F9; color:#44607A; font-size:20px;',
      '  line-height:1; cursor:pointer; }',
      '#' + KAP + ' .dfp-kapat:hover{ background:#E4EAF2; }',
      '#' + KAP + ' .dfp-ic{ padding:16px 20px 20px; }',
      '#' + KAP + ' .dfp-et{ font-size:.76rem; font-weight:800; letter-spacing:.08em;',
      '  text-transform:uppercase; color:#8094A8; margin:0 0 7px; }',
      '#' + KAP + ' .dfp-metin{ margin:0 0 14px; padding:14px 16px; border-radius:14px;',
      '  background:#F6F9FD; border:1px solid #E3EAF3; color:#16324F;',
      '  font-size:1.04rem; line-height:1.55; }',
      '#' + KAP + ' .dfp-yazili{ background:#EEF9F4; border-color:#BFE6D6; }',
      '#' + KAP + ' .dfp-hedef{ margin:0 0 14px; font-size:.9rem; line-height:1.5; color:#6B7A8C; }',
      '#' + KAP + ' .dfp-tuslar{ display:flex; flex-wrap:wrap; gap:9px; }',
      '#' + KAP + ' .dfp-tus{ font:inherit; font-size:.94rem; font-weight:700; cursor:pointer;',
      '  border-radius:999px; padding:10px 18px; border:1.5px solid #CFE0D9;',
      '  background:#fff; color:#0B5F51; transition:background .15s, border-color .15s; }',
      '#' + KAP + ' .dfp-tus:hover{ background:#E9F7F2; }',
      '#' + KAP + ' .dfp-tus.ana{ background:#16A085; border-color:#16A085; color:#fff; }',
      '#' + KAP + ' .dfp-tus.ana:hover{ background:#0E8571; }',
      '#' + KAP + ' .dfp-not{ margin:12px 0 0; font-size:.88rem; line-height:1.5; color:#6B7A8C; }',
      '@media (max-width:520px){ #' + KAP + ' .dfp-kutu{ max-width:100%; } }'
    ].join('');
    (document.head || document.documentElement).appendChild(s);
  }

  function ikon(sinif) {
    /* index.html'deki defter ikonunun aynısı (a4IkonDefter) — varsa oradan. */
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

  function ac(sinif) {
    stilKur();
    kapat();
    var h = buHafta() || { no: 1, bas: new Date(), bit: new Date() };
    var o = oneriMetni(sinif, h.no) || { metin: '', hedef: '', program: '' };
    var a = aktif();
    var yazili = a ? defterSatiri(a, h.no) : null;

    var kap = document.createElement('div');
    kap.id = KAP;
    kap.setAttribute('role', 'dialog');
    kap.setAttribute('aria-modal', 'true');

    var tarih = gunAy(h.bas) + ' – ' + gunAy(h.bit) + ' ' + h.bit.getFullYear();
    var ustAlt = h.no + '. Hafta · ' + tarih + (a ? ' · ' + kac(a.ad) : '');

    var govde =
      '<p class="dfp-et">Bu hafta deftere ne yazılır?</p>' +
      '<div class="dfp-metin">' + (o.metin ? kac(o.metin) :
        'Bu hafta için hazır bir öğrenme çıktısı önerisi yok; deftere kendi ' +
        'cümleni yazabilirsin.') + '</div>';
    if (yazili && yazili.c) {
      govde += '<p class="dfp-et">Deftere yazılmış</p>' +
        '<div class="dfp-metin dfp-yazili">' + kac(yazili.c) +
        (yazili.t ? '<br><small>' + kac(yazili.t) + '</small>' : '') + '</div>';
    }
    if (o.hedef) {
      govde += '<p class="dfp-hedef"><b>Yıl sonu hedefi:</b> ' + kac(o.hedef) + '</p>';
    }

    var tuslar = '';
    if (a) {
      if (o.metin) tuslar += '<button type="button" class="dfp-tus ana" data-dfp="yaz">' +
        (yazili && yazili.c ? 'Deftere yeniden yaz' : 'Bu haftayı deftere yaz') + '</button>';
      tuslar += '<button type="button" class="dfp-tus" data-dfp="ac">Defteri aç</button>';
    }
    if (o.metin) tuslar += '<button type="button" class="dfp-tus" data-dfp="kopya">Metni kopyala</button>';
    govde += '<div class="dfp-tuslar">' + tuslar + '</div>';
    if (!a) {
      govde += '<p class="dfp-not">Bir sınıf açıkken bu satırı tek dokunuşla ' +
        'o şubenin defterine yazabilirsin.</p>';
    }

    kap.innerHTML = '<div class="dfp-kutu">' +
      '<div class="dfp-bas"><span class="dfp-ikon">' + ikon(sinif) + '</span>' +
      '<span><b>Sınıf Defteri · ' + kac(sinif) + '. Sınıf</b>' +
      '<small>' + kac(ustAlt) + '</small></span>' +
      '<button type="button" class="dfp-kapat" data-dfp="kapat" aria-label="Kapat">&times;</button></div>' +
      '<div class="dfp-ic">' + govde + '</div></div>';

    kap.addEventListener('click', function (e) {
      if (e.target === kap) { kapat(); return; }
      var t = e.target.closest ? e.target.closest('[data-dfp]') : null;
      if (!t) return;
      var i = t.getAttribute('data-dfp');
      if (i === 'kapat') { kapat(); return; }
      if (i === 'kopya') {
        try {
          navigator.clipboard.writeText(o.metin);
          t.textContent = 'Kopyalandı ✓';
        } catch (h2) { }
        return;
      }
      if (i === 'ac') {
        kapat();
        try { if (window.KidefSinifDefteri) window.KidefSinifDefteri.ac(); } catch (h3) { }
        return;
      }
      if (i === 'yaz') {
        if (yazili && yazili.c &&
            !confirm('Bu haftanın satırı dolu. Üzerine yazılsın mı?')) return;
        if (defterYaz(a, h.no, o.metin)) {
          t.textContent = 'Deftere yazıldı ✓';
          t.classList.remove('ana');
        }
      }
    }, false);

    document.body.appendChild(kap);
    document.addEventListener('keydown', esc, true);
  }

  window.KidefDefterPop = { ac: ac, kapat: kapat, buHafta: buHafta };
})();
