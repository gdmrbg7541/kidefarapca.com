/* ===========================================================================
   KIDEF · SINIF DEFTERİ                       (hesap/sinifdefteri.js)
   ---------------------------------------------------------------------------
   Öğretmen: "kartların içine sınıf defterleri için bi kart yapalım, buradan
   öğretmen sınıflarına göre güncel ve herhangi bi tarihin öğrenme
   çıktılarını deftere yazabileceği bi sistem yapalım, her hafta için olsun."

   NE YAPAR
   Öğretmen panelinde (Listelerim) yeni bir sekme: seçili ŞUBENİN 36 haftalık
   ders defteri. Her hafta için ders tarihi + o derste gerçekleşen öğrenme
   çıktıları yazılır. Üstteki tarih kutusuna herhangi bir gün yazılınca o
   günün haftasına atlar; açılışta bugünün haftası vurgulu gelir.

   ÜÇ KAYNAK — öğretmenin isteği üzerine üçü birden:
     · «Öneri» → sistem/kazanimoneri.js, o sınıf düzeyinin o haftaki kazanımı
     · «Plan»  → Haftalık Plan sekmesinde o seviyeye yazdığın metin
     · boş satır → kendin yazarsın
   İlk ikisi tek dokunuşla satıra düşer; doluysa üstüne yazmadan önce sorar.

   VERİ — şubenin kendi kaydında, hesapla birlikte buluta gider:
     data.levels[lId].classes[cId].defter = {
        "<hafta no>": { t:'YYYY-MM-DD', c:'çıktılar', g:<zaman damgası> }
     }
   Kaydetme listelerim.js'teki save() ile; ayrı bir depo YOK.

   TAKVİM — Haftalık Plan ile BİREBİR aynı: 14.09.2026 başlangıç, 36 hafta,
   9. haftadan sonra 1 hafta ara tatil, 18'den sonra 2 hafta sömestr,
   22'den sonra 1 hafta ara tatil. İki ekranın tarihleri kaymasın diye
   hesap burada da aynen yapılır (BASLANGIC/TATIL sabitleri).

   BAĞIMLILIK: hesap/listelerim.js'ten SONRA yüklenir; switchTab'ı sarar
   (oturumguvenlik.js'in yaptığı gibi, içine dokunmadan). Sekme numarası 12.
   =========================================================================== */
(function () {
  'use strict';
  if (window.KidefSinifDefteri) return;

  var SEKME = 12;                       /* switchTab(12) → #tab12 */
  var PANEL = 'tab12';
  var BASLANGIC = '2026-09-14';         /* renderPlan ile aynı */
  var HAFTA_SAYISI = 36;
  var TATIL = {                         /* hafta no → kaç hafta ara verilir */
    9:  { ad: '1. Ara Tatil',    hafta: 1 },
    18: { ad: 'Sömestr Tatili',  hafta: 2 },
    22: { ad: '2. Ara Tatil',    hafta: 1 }
  };
  var AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  /* ---------------------------------------------------- küçük yardımcılar */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function el(id) { return document.getElementById(id); }

  /* listelerim.js'teki `let data / curLId / curCId` script kapsamındadır:
     window üstünde DEĞİL, ama aynı genel kapsamdan okunur. Dosya henüz
     yüklenmemişse ReferenceError atar; o yüzden hepsi try içinde. */
  function D()  { try { return data; }   catch (e) { return null; } }
  function LID(){ try { return curLId; } catch (e) { return null; } }
  function CID(){ try { return curCId; } catch (e) { return null; } }

  function seviye() {
    var d = D(), l = LID();
    return (d && d.levels && l != null) ? d.levels[l] : null;
  }
  function sube() {
    var s = seviye(), c = CID();
    return (s && s.classes && c != null) ? s.classes[c] : null;
  }
  function kaydet() {
    try { if (typeof save === 'function') { save(); return true; } } catch (e) {}
    try { localStorage.setItem('schoolData', JSON.stringify(D())); return true; }
    catch (e) { return false; }
  }
  function uyar(m) {
    try { if (typeof showCustomAlert === 'function') { showCustomAlert(m); return; } } catch (e) {}
    alert(m);
  }
  function sor(m, evet) {
    try {
      if (typeof showCustomConfirm === 'function') { showCustomConfirm(m, evet); return; }
    } catch (e) {}
    if (confirm(m)) evet();
  }

  /* ------------------------------------------------------------- takvim */
  function gun(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function isoYaz(d) {
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) +
           '-' + ('0' + d.getDate()).slice(-2);
  }
  function isoOku(s) {
    var p = String(s || '').split('-');
    if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d.getTime()) ? null : d;
  }
  function kisaTarih(d) {
    return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2);
  }
  function uzunTarih(d) {
    return d.getDate() + ' ' + AY[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* 36 haftanın başlangıç/bitiş günleri — renderPlan'daki hesabın aynısı */
  var _takvim = null;
  function takvim() {
    if (_takvim) return _takvim;
    var bas = isoOku(BASLANGIC), kayma = 0, c = [];
    for (var i = 1; i <= HAFTA_SAYISI; i++) {
      var b = new Date(bas);
      b.setDate(bas.getDate() + (i - 1) * 7 + kayma);
      var s = new Date(b);
      s.setDate(b.getDate() + 6);
      c.push({ no: i, bas: b, bit: s, tatil: TATIL[i] || null });
      if (TATIL[i]) kayma += TATIL[i].hafta * 7;
    }
    _takvim = c;
    return c;
  }
  /* Bir günün hangi haftaya düştüğü; tatile denk gelirse null */
  function haftaBul(d) {
    if (!d) return null;
    var g = gun(d), c = takvim();
    for (var i = 0; i < c.length; i++) {
      if (g >= c[i].bas && g <= c[i].bit) return c[i].no;
    }
    return null;
  }
  function buHafta() { return haftaBul(new Date()); }

  /* --------------------------------------------------------- defter verisi */
  function defter() {
    var s = sube();
    if (!s) return null;
    if (!s.defter || typeof s.defter !== 'object') s.defter = {};
    return s.defter;
  }
  function kayit(h) {
    var d = defter();
    return (d && d[String(h)]) ? d[String(h)] : null;
  }
  function yaz(h, alan, deger) {
    var d = defter();
    if (!d) return;
    var k = d[String(h)] || (d[String(h)] = { t: '', c: '', g: 0 });
    k[alan] = deger;
    k.g = Date.now();
    if (!k.c && !k.t) delete d[String(h)];   /* ikisi de boşsa kaydı tutma */
    kaydet();
  }

  /* ---------------------------------------------- kitabın yıllık çıktıları
     sistem/ciktiveri.js yıllık plan belgelerinden üretilir ve 157 KB'dir;
     ana sayfaya yüklenmez. Defter ilk açıldığında bir kez getirilir. */
  var kitapDurum = 0;                 /* 0 yok · 1 yükleniyor · 2 hazır · 3 olmadı */

  function kitapYukle(bitince) {
    if (kitapDurum === 2 || kitapDurum === 3) { bitince && bitince(); return; }
    if (kitapDurum === 1) return;
    if (window.KIDEF_CIKTI) { kitapDurum = 2; bitince && bitince(); return; }
    kitapDurum = 1;
    var t = document.createElement('script');
    t.src = 'sistem/ciktiveri.js?v=1';
    t.onload = function () { kitapDurum = 2; bitince && bitince(); };
    t.onerror = function () { kitapDurum = 3; bitince && bitince(); };
    document.head.appendChild(t);
  }

  /* Seviyenin sınıf numarası — "9. Seviye" → 9 */
  function sinifNo() {
    var sv = seviye();
    if (!sv) return 0;
    try {
      var K = window.KidefKazanimOneri;
      if (K && K.sinifCoz) { var n = K.sinifCoz(sv.name || ''); if (n) return parseInt(n, 10); }
    } catch (e) {}
    var m = String(sv.name || '').match(/\d{1,2}/);
    return m ? parseInt(m[0], 10) : 0;
  }

  /* O sınıfın SEÇİLİ kitabının çıktı anahtarı — yoksa null */
  function kitapAnahtar() {
    var C = window.KIDEF_CIKTI;
    if (!C) return null;
    var n = sinifNo();
    if (!n) return null;
    var k = null;
    try {
      var V = window.KidefSinifVeri;
      k = (V && V.seciliVeriYili) ? V.seciliVeriYili(n) : null;
    } catch (e) {}
    if (k && C[n + '@' + k.yil]) return n + '@' + k.yil;
    if (C[String(n)]) return String(n);
    return null;
  }

  function kitapCikti(h) {
    var a = kitapAnahtar();
    if (!a) return null;
    var v = window.KIDEF_CIKTI[a];
    var k = v && v.haftalar[String(h)];
    return k ? { ad: v.ad, u: k.u, c: k.c || [], i: k.i || '' } : null;
  }

  /* Haftanın önerisi — önce kitabın kendi planı, o yoksa genel öneri
     (sistem/kazanimoneri.js, seviyenin sınıf numarasına göre). */
  function oneriMetni(h) {
    var kc = kitapCikti(h);
    if (kc && kc.c.length) return kc.c.join('\n');
    try {
      var K = window.KidefKazanimOneri;
      var s = seviye();
      if (!K || !s) return '';
      var n = K.sinifCoz(s.name || '');
      if (!n) return '';
      var o = K.al(n);
      return (o && o.haftalar[h - 1]) ? o.haftalar[h - 1] : '';
    } catch (e) { return ''; }
  }
  /* Haftanın planı — Haftalık Plan sekmesinde bu SEVİYEYE yazılan metin */
  function planMetni(h) {
    var s = seviye();
    return (s && s.planText && s.planText[h]) ? String(s.planText[h]) : '';
  }

  /* --------------------------------------------- plan · işlendi · kaldığımız
     Hepsi ESKİ Haftalık Plan sekmesinin yazdığı alanlar; aynı yere yazılıyor:
       level.planText[h]   seviyeye ortak plan (şubeler arasında paylaşılır)
       class.planStatus[h] o şubede işlendi mi
       class.stayedPoint   kaldığımız yer
     Böylece iki ekran arasında veri kopyalanmıyor, aynı veri paylaşılıyor. */
  function planYaz(h, deger) {
    try {
      if (typeof updateLevelPlanText === 'function') { updateLevelPlanText(h, deger); return; }
    } catch (e) {}
    var sv = seviye();
    if (!sv) return;
    if (!sv.planText) sv.planText = {};
    sv.planText[h] = deger;
    kaydet();
  }
  function durumYaz(h, acik) {
    try {
      if (typeof togglePlanStatus === 'function') { togglePlanStatus(h, acik); return; }
    } catch (e) {}
    var sb = sube();
    if (!sb) return;
    if (!sb.planStatus) sb.planStatus = {};
    sb.planStatus[h] = !!acik;
    kaydet();
  }
  function durumOku(h) {
    var sb = sube();
    return !!(sb && sb.planStatus && sb.planStatus[h]);
  }
  function kaldikYaz(deger) {
    try {
      if (typeof updateStayedPoint === 'function') { updateStayedPoint(deger); return; }
    } catch (e) {}
    var sb = sube();
    if (!sb) return;
    sb.stayedPoint = deger;
    kaydet();
  }

  /* ------------------------------------------------------------------ stil */
  function stilKur() {
    if (el('sdStil')) return;
    var st = document.createElement('style');
    st.id = 'sdStil';
    st.textContent = [
      '#tab12 .sd-ust{display:flex;flex-wrap:wrap;align-items:center;gap:12px;',
      '  background:#F2F7F5;border:1px solid #D4E6E0;border-radius:14px;',
      '  padding:14px 16px;margin-bottom:18px;}',
      '#tab12 .sd-bugun{font-weight:800;color:#0E7C66;font-size:1rem;}',
      '#tab12 .sd-bugun small{display:block;font-weight:600;color:#5B6471;font-size:.82rem;}',
      '#tab12 .sd-ara{flex:1 1 auto;}',
      '#tab12 .sd-alan{display:flex;align-items:center;gap:8px;font-size:.9rem;color:#44515F;}',
      '#tab12 .sd-alan input[type=date]{border:1px solid #CBD5E1;border-radius:9px;',
      '  padding:8px 10px;font-family:inherit;font-size:.92rem;color:#1F2430;}',
      '#tab12 .sd-tus{border:none;border-radius:11px;padding:10px 16px;cursor:pointer;',
      '  font-family:inherit;font-weight:700;font-size:.9rem;color:#fff;',
      '  background:#16A085;box-shadow:0 4px 12px rgba(22,160,133,.26);}',
      '#tab12 .sd-tus:hover{background:#0E7C66;}',
      '#tab12 .sd-tus.sd-ikincil{background:#fff;color:#0E7C66;border:1px solid #BCDAD2;box-shadow:none;}',
      '#tab12 .sd-tus.sd-ikincil:hover{background:#E8F4F1;}',
      '#tab12 .sd-sayac{font-size:.86rem;color:#5B6471;font-weight:700;}',
      '#tab12 .sd-bos{background:#FFF8E6;border:1px solid #F0DFB4;border-radius:14px;',
      '  padding:26px 22px;color:#7A6230;line-height:1.6;}',
      '#tab12 .sd-bos b{color:#8A6412;}',
      '#tab12 .sd-izgara{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}',
      '@media (max-width:980px){#tab12 .sd-izgara{grid-template-columns:minmax(0,1fr);}}',
      '#tab12 .sd-kart{background:#fff;border:1px solid #E3E8EF;border-radius:13px;',
      '  padding:13px 15px;display:grid;grid-template-columns:62px minmax(0,1fr);gap:13px;',
      '  align-items:start;scroll-margin-top:90px;}',
      '#tab12 .sd-kart.sd-simdi{border-color:#16A085;box-shadow:0 0 0 2px rgba(22,160,133,.18);}',
      '#tab12 .sd-kart.sd-dolu{background:#F7FBF9;}',
      '#tab12 .sd-no{text-align:center;}',
      '#tab12 .sd-no b{display:block;font-size:1.5rem;line-height:1.1;color:#0E7C66;}',
      '#tab12 .sd-no span{display:block;font-size:.72rem;color:#8A93A0;line-height:1.5;}',
      '#tab12 .sd-kart.sd-simdi .sd-no b{color:#16A085;}',
      '#tab12 .sd-govde{min-width:0;}',
      '#tab12 .sd-satir{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin-bottom:7px;}',
      '#tab12 .sd-tarih{border:1px solid #D7DEE7;border-radius:8px;padding:5px 8px;',
      '  font-family:inherit;font-size:.84rem;color:#1F2430;}',
      '#tab12 .sd-cip{border:1px solid #D7DEE7;background:#F7F9FC;border-radius:999px;',
      '  padding:5px 12px;font-family:inherit;font-size:.8rem;font-weight:700;',
      '  color:#44515F;cursor:pointer;}',
      '#tab12 .sd-cip:hover{background:#E8F4F1;border-color:#9FD0C4;color:#0E7C66;}',
      '#tab12 .sd-cip[disabled]{opacity:.42;cursor:default;}',
      '#tab12 .sd-cip[disabled]:hover{background:#F7F9FC;border-color:#D7DEE7;color:#44515F;}',
      '#tab12 .sd-rozet{margin-left:6px;font-size:.74rem;font-weight:800;color:#16A085;}',
      '#tab12 .sd-islendi{margin-left:auto;display:inline-flex;align-items:center;gap:5px;',
      '  font-size:.78rem;font-weight:700;color:#8A93A0;cursor:pointer;user-select:none;}',
      '#tab12 .sd-islendi input{accent-color:#16A085;width:15px;height:15px;cursor:pointer;}',
      '#tab12 .sd-kart.sd-islendi-var .sd-islendi{color:#0E7C66;}',
      '#tab12 .sd-kart.sd-islendi-var .sd-no b{color:#16A085;}',
      /* plan satırı — eski Haftalık Plan sekmesinin alanı */
      '#tab12 .sd-plan{display:flex;align-items:center;gap:7px;margin-bottom:7px;}',
      '#tab12 .sd-plan-et{flex:0 0 auto;font-size:.72rem;font-weight:800;letter-spacing:.06em;',
      '  text-transform:uppercase;color:#8A93A0;}',
      '#tab12 .sd-plan-g{flex:1 1 auto;min-width:0;border:1px dashed #D7DEE7;border-radius:8px;',
      '  padding:6px 9px;font:inherit;font-size:.86rem;color:#44515F;background:#FCFDFE;}',
      '#tab12 .sd-plan-g:focus{outline:none;border-style:solid;border-color:#16A085;background:#fff;}',
      /* kaldığımız yer */
      '#tab12 .sd-kaldik{display:flex;align-items:center;gap:10px;margin:0 0 16px;',
      '  background:#FFFDF2;border:1px solid #F0E2C0;border-radius:12px;padding:11px 14px;}',
      '#tab12 .sd-kaldik label{flex:0 0 auto;font-size:.82rem;font-weight:800;color:#8A6412;}',
      '#tab12 .sd-kaldik input{flex:1 1 auto;min-width:0;border:1px solid #EADFC6;',
      '  border-radius:9px;padding:8px 11px;font:inherit;font-size:.92rem;color:#1F2430;}',
      /* kitaptan gelen hazır çıktı — okunur, düzenlenmez */
      '#tab12 .sd-kitap{background:#F2F7F5;border:1px solid #D9E8E3;border-radius:9px;',
      '  padding:8px 11px;margin-bottom:8px;}',
      '#tab12 .sd-k-unite{font-weight:800;color:#0E7C66;font-size:.82rem;margin-bottom:3px;}',
      '#tab12 .sd-k-liste{margin:0;padding-left:17px;}',
      '#tab12 .sd-k-liste li{font-size:.84rem;line-height:1.45;color:#44515F;margin:2px 0;}',
      '#tab12 a.sd-tus{text-decoration:none;display:inline-flex;align-items:center;}',
      '#tab12 textarea.sd-metin{width:100%;box-sizing:border-box;min-height:62px;resize:vertical;',
      '  border:1px solid #D7DEE7;border-radius:9px;padding:9px 11px;',
      '  font-family:inherit;font-size:.93rem;line-height:1.5;color:#1F2430;}',
      '#tab12 textarea.sd-metin:focus{outline:none;border-color:#16A085;',
      '  box-shadow:0 0 0 3px rgba(22,160,133,.14);}',
      '#tab12 .sd-tatil{grid-column:1/-1;display:flex;align-items:center;justify-content:center;',
      '  gap:9px;background:#FDF3E3;border:1px dashed #E8C98E;border-radius:11px;',
      '  padding:9px 14px;color:#8A6412;font-weight:700;font-size:.88rem;}',
      /* ---- yazdırma: yalnız defter, dolu haftalar, imza satırı ---- */
      '@media print{',
      '  body *{visibility:hidden !important;}',
      '  #sdYazdir,#sdYazdir *{visibility:visible !important;}',
      '  #sdYazdir{position:absolute;left:0;top:0;width:100%;padding:0;}',
      '}',
      '#sdYazdir{display:none;}',
      '#sdYazdir table{width:100%;border-collapse:collapse;font-size:11pt;}',
      '#sdYazdir th,#sdYazdir td{border:1px solid #333;padding:6px 8px;vertical-align:top;',
      '  text-align:left;}',
      '#sdYazdir th{background:#eee;font-weight:700;}',
      '#sdYazdir h2{margin:0 0 4px;font-size:15pt;}',
      '#sdYazdir .sd-y-ust{margin-bottom:12px;font-size:10pt;color:#333;}',
      '#sdYazdir .sd-y-imza{margin-top:26px;font-size:10pt;}'
    ].join('\n');
    document.head.appendChild(st);
  }

  /* ------------------------------------------------------------------ çizim */
  function ciz() {
    stilKur();
    var kap = el(PANEL);
    if (!kap) return;
    /* Kitabın çıktıları henüz gelmediyse: yüklenince kendiliğinden yeniden çiz */
    if (kitapDurum < 2) {
      kitapYukle(function () { try { ciz(); } catch (e) {} });
      if (kitapDurum === 1) {
        kap.innerHTML = '<div class="sd-bos">Kitabın yıllık çıktıları yükleniyor…</div>';
        return;
      }
    }

    var s = sube();
    if (!s) {
      kap.innerHTML = '<div class="sd-bos"><b>Önce bir şube seç.</b><br>' +
        'Sınıf defteri şubenin kendi kaydında durur; soldaki listeden bir şube ' +
        'açınca o şubenin defteri burada çizilir. Henüz şube açmadıysan ' +
        '«Öğrenciler» sekmesinden kurabilirsin.</div>';
      return;
    }

    var c = takvim(), simdi = buHafta(), d = defter() || {};
    var dolu = 0;
    for (var a in d) if (Object.prototype.hasOwnProperty.call(d, a) && d[a] && d[a].c) dolu++;

    var bugun = new Date();
    var ustBilgi = simdi
      ? uzunTarih(bugun) + ' · <b>' + simdi + '. hafta</b>'
      : uzunTarih(bugun) + ' · ders haftası değil (tatil ya da yıl dışı)';

    var h = '';
    h += '<div class="sd-ust">';
    h +=   '<div class="sd-bugun">' + esc(s.name || 'Şube') +
           '<small>' + ustBilgi + '</small></div>';
    h +=   '<div class="sd-alan"><label for="sdGit">Tarihe git</label>' +
           '<input type="date" id="sdGit" value="' + isoYaz(bugun) + '"></div>';
    h +=   '<button type="button" class="sd-tus" id="sdBugun">Bugünün haftasına git</button>';
    h +=   '<div class="sd-ara"></div>';
    h +=   '<span class="sd-sayac">' + dolu + ' / ' + HAFTA_SAYISI + ' hafta yazılı</span>';
    var ka = kitapAnahtar();
    if (ka) {
      h += '<a class="sd-tus sd-ikincil" href="cikti.html?sinif=' + sinifNo() +
           '" target="_blank" rel="noopener" title="' +
           esc(window.KIDEF_CIKTI[ka].ad) + ' — 36 haftanın tamamı">Yıllık çıktılar</a>';
    }
    h +=   '<button type="button" class="sd-tus sd-ikincil" id="sdYaz">Yazdır</button>';
    h += '</div>';

    h += '<div class="sd-kaldik"><label for="sdKaldik">Kaldığımız yer</label>' +
           '<input type="text" id="sdKaldik" value="' + esc(s.stayedPoint || '') + '" ' +
           'placeholder="Örn: 2. ünite, 42. sayfada kaldık…"></div>';

    h += '<div class="sd-izgara">';
    for (var i = 0; i < c.length; i++) {
      var w = c[i], k = d[String(w.no)] || null;
      var sinif = 'sd-kart' + (w.no === simdi ? ' sd-simdi' : '') +
                  ((k && k.c) ? ' sd-dolu' : '') +
                  (durumOku(w.no) ? ' sd-islendi-var' : '');
      var oneri = oneriMetni(w.no), plan = planMetni(w.no);
      var kc = kitapCikti(w.no);
      var tarih = (k && k.t) || '';

      h += '<div class="' + sinif + '" id="sdH' + w.no + '">';
      h +=   '<div class="sd-no"><b>' + w.no + '</b><span>' +
               kisaTarih(w.bas) + '<br>' + kisaTarih(w.bit) + '</span></div>';
      h +=   '<div class="sd-govde">';
      h +=     '<div class="sd-satir">';
      /* min/max YOK: Chrome boş kutuyu yarı dolu ("09/gg/2026") gösteriyordu
         ve öğretmen zaten istediği günü yazabilmeli. */
      h +=       '<input type="date" class="sd-tarih" data-h="' + w.no + '"' +
                   ' value="' + esc(tarih) + '" title="Dersin işlendiği gün">';
      h +=       '<button type="button" class="sd-cip" data-al="oneri" data-h="' + w.no + '"' +
                   (oneri ? '' : ' disabled') + ' title="' +
                   esc(oneri || 'Bu hafta için hazır çıktı yok') + '">' +
                   (kc ? 'Çıktıyı al' : 'Öneri') + '</button>';
      h +=       '<button type="button" class="sd-cip" data-al="plan" data-h="' + w.no + '"' +
                   (plan ? '' : ' disabled') + ' title="' + esc(plan || 'Bu haftanın planı boş') +
                   '">Plan</button>';
      h +=       '<label class="sd-islendi" title="Bu hafta işlendi">' +
                   '<input type="checkbox" data-islendi="' + w.no + '"' +
                   (durumOku(w.no) ? ' checked' : '') + '><span>işlendi</span></label>';
      if (w.no === simdi) h += '<span class="sd-rozet">BU HAFTA</span>';
      h +=     '</div>';
      if (kc) {
        h +=   '<div class="sd-kitap"><div class="sd-k-unite">' + esc(kc.u) + '</div>';
        if (kc.c.length) {
          h += '<ul class="sd-k-liste">';
          for (var ci = 0; ci < kc.c.length; ci++) h += '<li>' + esc(kc.c[ci]) + '</li>';
          h += '</ul>';
        }
        h +=   '</div>';
      }
      /* PLAN — eski Haftalık Plan sekmesinin alanı, seviyeye ortak */
      h +=     '<div class="sd-plan"><span class="sd-plan-et">Plan</span>' +
                 '<input type="text" class="sd-plan-g" data-h="' + w.no + '" value="' +
                 esc(plan) + '" placeholder="Bu seviye için ortak plan…"></div>';
      /* DEFTER — bu şubede gerçekte ne işlendi */
      h +=     '<textarea class="sd-metin" data-h="' + w.no + '" rows="2"' +
                 ' placeholder="Bu hafta gerçekleşen öğrenme çıktıları…">' +
                 esc(k ? (k.c || '') : '') + '</textarea>';
      h +=   '</div>';
      h += '</div>';

      if (w.tatil) {
        h += '<div class="sd-tatil">' +
               '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"' +
               ' stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
               '<path d="M5 21V3"/><path d="M5 4h12l-2.4 3.4L17 11H5z"/></svg>' +
               esc(w.tatil.ad) + ' — ' + w.tatil.hafta + ' hafta' +
             '</div>';
      }
    }
    h += '</div>';
    h += '<div id="sdYazdir" aria-hidden="true"></div>';

    kap.innerHTML = h;
    baglar(kap);

    /* bugünün haftası varsa oraya kaydır */
    if (simdi) {
      var hedef = el('sdH' + simdi);
      if (hedef && hedef.scrollIntoView) {
        try { hedef.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch (e) {}
      }
    }
  }

  /* --------------------------------------------------------------- olaylar */
  function baglar(kap) {
    kap.addEventListener('change', function (e) {
      var t = e.target;
      if (!t) return;
      if (t.classList.contains('sd-metin')) {
        var hv = +t.dataset.h;
        if (t.value.trim()) tarihVarsay(hv);     /* önce tarih, sonra metin */
        yaz(hv, 'c', t.value.trim());
        tazeleKart(hv);
      } else if (t.classList.contains('sd-tarih')) {
        yaz(+t.dataset.h, 't', t.value);
      } else if (t.classList.contains('sd-plan-g')) {
        var hp = +t.dataset.h, pm = t.value.trim();
        planYaz(hp, pm);
        /* plan yazılır yazılmaz «Plan» düğmesi açılsın — yeniden çizmeye gerek yok */
        var kp = el('sdH' + hp), pc = kp && kp.querySelector('.sd-cip[data-al="plan"]');
        if (pc) {
          pc.disabled = !pm;
          pc.setAttribute('title', pm || 'Bu haftanın planı boş');
        }
      } else if (t.id === 'sdKaldik') {
        kaldikYaz(t.value);
      } else if (t.dataset && t.dataset.islendi) {
        durumYaz(+t.dataset.islendi, t.checked);
        var kk = el('sdH' + t.dataset.islendi);
        if (kk) kk.classList.toggle('sd-islendi-var', t.checked);
      } else if (t.id === 'sdGit') {
        git(t.value);
      }
    });

    kap.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('button') : null;
      if (!t) return;
      if (t.id === 'sdBugun') {
        var b = buHafta();
        if (!b) { uyar('Bugün ders haftasına denk gelmiyor (tatil ya da öğretim yılı dışı).'); return; }
        git(isoYaz(new Date()));
      } else if (t.id === 'sdYaz') {
        yazdir();
      } else if (t.dataset && t.dataset.al) {
        al(t.dataset.al, +t.dataset.h);
      }
    });
  }

  /* Tarihe git: o günün haftasını bul, karta kaydır, yazı alanına odaklan */
  function git(iso) {
    var d = isoOku(iso);
    if (!d) return;
    var h = haftaBul(d);
    if (!h) { uyar(uzunTarih(d) + ' bir ders haftasına denk gelmiyor (tatil ya da öğretim yılı dışı).'); return; }
    var kart = el('sdH' + h);
    if (!kart) return;
    try { kart.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { kart.scrollIntoView(); }
    var ta = kart.querySelector('.sd-metin');
    var tr = kart.querySelector('.sd-tarih');
    /* o haftanın ders günü boşsa seçilen günü yazalım — öğretmen tarihi
       ikinci kez girmesin */
    if (tr && !tr.value) { tr.value = iso; yaz(h, 't', iso); }
    if (ta) setTimeout(function () { ta.focus(); }, 320);
  }

  /* «Öneri» / «Plan» düğmesi: metni satıra düşür, doluysa önce sor */
  function al(kaynak, h) {
    var metin = (kaynak === 'oneri') ? oneriMetni(h) : planMetni(h);
    if (!metin) return;
    var kart = el('sdH' + h);
    var ta = kart && kart.querySelector('.sd-metin');
    if (!ta) return;

    function koy() {
      ta.value = metin;
      tarihVarsay(h);
      yaz(h, 'c', metin);
      tazeleKart(h);
      ta.focus();
    }
    if (ta.value.trim() && ta.value.trim() !== metin.trim()) {
      sor(h + '. haftada yazılı bir metin var. Üstüne yazılsın mı?', koy);
    } else {
      koy();
    }
  }

  /* Hafta ilk kez yazıldığında ders günü boşsa doldur: bugün o haftadaysa
     bugün, değilse haftanın ilk günü. Yazılmış tarihe dokunulmaz. */
  function tarihVarsay(h) {
    var k = kayit(h);
    if (k && k.t) return;
    var kart = el('sdH' + h), kutu = kart && kart.querySelector('.sd-tarih');
    if (kutu && kutu.value) return;
    var w = takvim()[h - 1];
    if (!w) return;
    var bugun = gun(new Date());
    var sec = (bugun >= w.bas && bugun <= w.bit) ? bugun : w.bas;
    var iso = isoYaz(sec);
    if (kutu) kutu.value = iso;
    yaz(h, 't', iso);
  }

  function tazeleKart(h) {
    var kart = el('sdH' + h);
    if (!kart) return;
    var k = kayit(h);
    kart.classList.toggle('sd-dolu', !!(k && k.c));
    var d = defter() || {}, dolu = 0;
    for (var a in d) if (Object.prototype.hasOwnProperty.call(d, a) && d[a] && d[a].c) dolu++;
    var sayac = document.querySelector('#' + PANEL + ' .sd-sayac');
    if (sayac) sayac.textContent = dolu + ' / ' + HAFTA_SAYISI + ' hafta yazılı';
  }

  /* --------------------------------------------------------------- yazdırma */
  function yazdir() {
    var s = sube(), d = defter() || {}, c = takvim();
    if (!s) return;
    var satir = '', kac = 0;
    for (var i = 0; i < c.length; i++) {
      var w = c[i], k = d[String(w.no)];
      if (!k || !k.c) continue;
      kac++;
      var t = isoOku(k.t);
      satir += '<tr><td style="text-align:center;width:38px;">' + w.no + '</td>' +
               '<td style="width:120px;">' + esc(t ? uzunTarih(t) :
                 (kisaTarih(w.bas) + ' – ' + kisaTarih(w.bit))) + '</td>' +
               '<td>' + esc(k.c) + '</td></tr>';
    }
    if (!kac) { uyar('Defterde yazılı hafta yok. Önce bir haftaya öğrenme çıktısı yaz.'); return; }

    var kutu = el('sdYazdir');
    kutu.innerHTML =
      '<h2>Sınıf Defteri — ' + esc(s.name || '') + '</h2>' +
      '<div class="sd-y-ust">2026-2027 öğretim yılı · ' + kac + ' hafta · ' +
        'yazdırma tarihi ' + esc(uzunTarih(new Date())) + '</div>' +
      '<table><thead><tr><th style="width:38px;">Hf.</th><th style="width:120px;">Tarih</th>' +
        '<th>Öğrenme çıktıları</th></tr></thead><tbody>' + satir + '</tbody></table>' +
      '<div class="sd-y-imza">Ders öğretmeni: ……………………………………&nbsp;&nbsp;&nbsp;' +
        'İmza: ……………………</div>';
    kutu.style.display = 'block';
    window.print();
    setTimeout(function () { kutu.style.display = 'none'; }, 400);
  }

  /* ------------------------------------------------------ switchTab sarmala */
  /* listelerim.js'teki switchTab'ın İÇİNE dokunmuyoruz; oturumguvenlik.js'in
     yaptığı gibi sarıyoruz. Özgün işlev 12 numarayı tanımadığı için hiçbir
     paneli açmaz — açmayı ve çizmeyi biz yapıyoruz. */
  function sar() {
    if (typeof window.switchTab !== 'function' || window.switchTab.__sd) return true;
    var eski = window.switchTab;
    var yeni = function (idx) {
      /* Haftalık Plan artık ayrı sekme değil: eski çağrılar (kısayol, geçmiş
         bağlantı) deftere düşsün. Panel ve renderPlan yerinde duruyor. */
      if (parseInt(idx, 10) === 9) idx = SEKME, arguments[0] = SEKME;
      var sonuc = eski.apply(this, arguments);
      if (parseInt(idx, 10) === SEKME) {
        var p = el(PANEL);
        if (p) { p.classList.add('active'); ciz(); }
      }
      return sonuc;
    };
    yeni.__sd = 1;
    window.switchTab = yeni;
    return true;
  }
  /* oturumguvenlik.js de sarıyor; o bizden sonra sarsa bile zincir bozulmaz.
     Yine de hazır olmazsa birkaç kez dene. */
  (function bekle(n) {
    if (sar() || n > 40) return;
    setTimeout(function () { bekle(n + 1); }, 250);
  })(0);

  window.KidefSinifDefteri = {
    SEKME: SEKME,
    ciz: ciz,
    ac: function () { try { switchTab(SEKME); } catch (e) {} },
    haftaBul: haftaBul,
    buHafta: buHafta,
    takvim: takvim
  };
})();
