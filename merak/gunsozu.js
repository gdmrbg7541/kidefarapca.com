/* ===========================================================================
   GÜNÜN SÖZÜ — Merak Çarkı sayfasının üstünde açılan pop-up     03.10.2026
   04.10.2026 — öğretmen: "günün sözünü öğretmen isterse sadece dinî konular,
   örneğin sadece âyetlerden, sadece hadislerden, sadece atasözlerinden,
   sadece deyimlerden gibi bir çok seçenek ekleyelim."
   ---------------------------------------------------------------------------
   ÇARKIN DIŞINDA: çarkın dilimlerine dokunulmadı; söz, sayfa açılınca
   üstte beliren ayrı bir kartta çıkar. Çark kartlarıyla (merakveri.js)
   hiçbir ilişkisi yok.

   TÜR SEÇİMİ: kartın altındaki şeritten hangi türden söz geleceğini
   seçersin — Hepsi, Âyet, Hadis, Dinî (âyet+hadis), Atasözü, Deyim.
   Seçim o tarayıcıda hatırlanır: localStorage['kidef_gunsozu_tur'].
   Boş havuz şeritte hiç görünmez; hadis metni eklenene kadar «Hadis»
   ve «Dinî» düğmeleri çıkmaz.

   SÖZLER BU DOSYADA DEĞİL:
     merak/gunsozu-veri.js   atasözü · deyim · hadis   (elle yazılır)
     merak/gunsozu-ayet.js   âyetler                   (betikle üretilir —
         _kaynak/uretici/ayetSecki.py, Arapça site verisinden kopyalanır)
   İkisi de bu dosyadan ÖNCE yüklenmeli (bkz. merakcarki.html).

   GÜNE GÖRE SEÇİM: söz, takvim gününden hesaplanır — aynı gün aynı türde
   bütün cihazlarda AYNI söz çıkar, ertesi gün kendiliğinden değişir.

   GÜNDE BİR KEZ: pop-up o gün ilk açılışta kendiliğinden gelir
   (localStorage['kidef_gunsozu'] = YYYY-MM-DD). Kapatınca o gün bir daha
   kendiliğinden gelmez; üst çubuktaki «Günün sözü» düğmesiyle her zaman
   yeniden açılır.
   =========================================================================== */
(function () {
  'use strict';

  var ANAHTAR = 'kidef_gunsozu';
  var ANAHTAR_TUR = 'kidef_gunsozu_tur';

  /* ── simge havuzu ── viewBox 0 0 24 24, çizgi currentColor ── */
  var SIMGE = {
    damla:   '<path d="M12 3.2c3.3 3.8 5.5 6.7 5.5 9.4a5.5 5.5 0 0 1-11 0c0-2.7 2.2-5.6 5.5-9.4z"/>',
    filiz:   '<path d="M12 21v-7.6"/><path d="M12 13.4c0-2.9 2.2-5.2 5.1-5.2 0 2.9-2.2 5.2-5.1 5.2z"/>'
           + '<path d="M12 15.2c0-2.5-1.9-4.6-4.5-4.6 0 2.6 2 4.6 4.5 4.6z"/>',
    soru:    '<circle cx="12" cy="12" r="8.8"/>'
           + '<path d="M9.5 9.6a2.6 2.6 0 1 1 3.3 2.5c-.6.2-1 .8-1 1.5v.4"/><path d="M12 17.4h.01"/>',
    pusula:  '<circle cx="12" cy="12" r="8.8"/><path d="M15.4 8.6 13.6 13.6 8.6 15.4l1.8-5z"/>',
    kumsaati:'<path d="M6.6 3.2h10.8M6.6 20.8h10.8"/>'
           + '<path d="M7.6 3.2c0 4.1 4.4 5.6 4.4 8.8s-4.4 4.7-4.4 8.8"/>'
           + '<path d="M16.4 3.2c0 4.1-4.4 5.6-4.4 8.8s4.4 4.7 4.4 8.8"/>',
    cekic:   '<path d="M14.4 2.8 21.2 9.6l-2.8 2.8-6.8-6.8z"/>'
           + '<path d="M12.2 7.6 3.6 16.2a2.1 2.1 0 0 0 3 3l8.6-8.6"/>',
    disli:   '<circle cx="12" cy="12" r="3.3"/>'
           + '<path d="M12 2.6v2.8M12 18.6v2.8M21.4 12h-2.8M5.4 12H2.6'
           + 'M18.6 5.4l-2 2M7.4 16.6l-2 2M18.6 18.6l-2-2M7.4 7.4l-2-2"/>',
    merdiven:'<path d="M5.6 21V6.2M13.4 21V3.2"/><path d="M5.6 17.4h7.8M5.6 12.8h7.8M5.6 8.2h7.8"/>'
           + '<path d="M16.6 7.4 19 5l-3.4-.6M19 5l.6 3.4"/>',
    saat:    '<circle cx="12" cy="12" r="8.8"/><path d="M12 6.8V12l3.6 2.2"/>',
    ekim:    '<path d="M3.2 18.6h17.6"/><path d="M6 18.6v-4.2M10 18.6v-6.4M14 18.6v-5M18 18.6v-7.4"/>'
           + '<circle cx="6" cy="12.8" r="1.5"/><circle cx="10" cy="10.6" r="1.5"/>'
           + '<circle cx="14" cy="11.4" r="1.5"/><circle cx="18" cy="9.6" r="1.5"/>',
    yol:     '<path d="M4 21 9.4 3.4M20 21 14.6 3.4"/><path d="M12 5.4v2.4M12 11v2.4M12 16.6V19"/>',
    kalkan:  '<path d="M12 2.8 4.6 5.6v6c0 4.4 3.1 8.1 7.4 9.6 4.3-1.5 7.4-5.2 7.4-9.6v-6z"/>'
           + '<path d="M9 12.2l2.2 2.2 4-4.2"/>',
    eller:   '<path d="M2.8 13.4 6 10.2a2.1 2.1 0 0 1 3 0l3 3 3-3a2.1 2.1 0 0 1 3 0l3.2 3.2"/>'
           + '<path d="M2.8 13.4v2.8a2.4 2.4 0 0 0 2.4 2.4h13.6a2.4 2.4 0 0 0 2.4-2.4v-2.8"/>',
    kalp:    '<path d="M12 20.4S3.6 15.4 3.6 9.4a4.6 4.6 0 0 1 8.4-2.6 4.6 4.6 0 0 1 8.4 2.6c0 6-8.4 11-8.4 11z"/>',
    konusma: '<path d="M20.6 12.4c0 4-3.9 7.2-8.6 7.2-1.2 0-2.3-.2-3.3-.6L3.4 20.6l1.7-4.4a6.8 6.8 0 0 1-1.7-4.4c0-4 3.8-7.2 8.6-7.2s8.6 3.2 8.6 7.2z"/>'
           + '<path d="M8.6 11.6h6.8M8.6 14.4h4.4"/>',
    terazi:  '<path d="M12 3.4v16.4M7 19.8h10"/><path d="M12 6.4 4.6 8.6M12 6.4l7.4 2.2"/>'
           + '<path d="M1.8 14.2a2.8 2.8 0 0 0 5.6 0L4.6 8.6zM16.6 14.2a2.8 2.8 0 0 0 5.6 0L19.4 8.8z"/>',
    gul:     '<path d="M12 12.4a3.2 3.2 0 1 0 0-.1"/><path d="M12 9.2c0-2 1.2-3.4 3.2-3.4 0 2-1.2 3.4-3.2 3.4z"/>'
           + '<path d="M12 9.2c0-2-1.2-3.4-3.2-3.4 0 2 1.2 3.4 3.2 3.4z"/>'
           + '<path d="M9.4 13.6c-1.8-.8-3.4-.3-4.2 1.5 1.8.8 3.4.3 4.2-1.5z"/>'
           + '<path d="M14.6 13.6c1.8-.8 3.4-.3 4.2 1.5-1.8.8-3.4.3-4.2-1.5z"/><path d="M12 15.6V21"/>',
    testi:   '<path d="M8.6 3.4h6.8l-.6 3.2a6.6 6.6 0 0 1 4 6.1v4.9a3 3 0 0 1-3 3H8.2a3 3 0 0 1-3-3v-4.9a6.6 6.6 0 0 1 4-6.1z"/>'
           + '<path d="M6.2 13.4c2 1.4 3.8 1.4 5.8 0s3.8-1.4 5.8 0"/>',
    uzum:    '<path d="M12 3.2v3.4"/><path d="M12.4 6.6c1.4-1.6 3.4-2.2 5.2-1.6-.4 1.8-1.8 3-3.6 3.4"/>'
           + '<circle cx="9.4" cy="11" r="2"/><circle cx="14.6" cy="11" r="2"/>'
           + '<circle cx="12" cy="14.8" r="2"/><circle cx="7.4" cy="15.4" r="2"/>'
           + '<circle cx="16.6" cy="15.4" r="2"/><circle cx="12" cy="19" r="2"/>',
    mum:     '<path d="M8.6 10.4h6.8v10.2H8.6z"/><path d="M12 10.4V8"/>'
           + '<path d="M12 7.8c1.6-1.2 2.2-2.6 1.6-4.2-1.4.6-2.4 1.4-3 2.4-.5.9-.3 1.4 1.4 1.8z"/>'
           + '<path d="M6.2 20.6h11.6"/>',
    yildiz:  '<path d="M12 2.8 14.8 9l6.8.7-5.1 4.6 1.5 6.7L12 17.6l-6 3.4 1.5-6.7L2.4 9.7 9.2 9z"/>',
    kitap:   '<path d="M12 6.4C10 4.6 7.2 4.2 3.6 4.8v13.4c3.6-.6 6.4 0 8.4 1.8"/>'
           + '<path d="M12 6.4c2-1.8 4.8-2.2 8.4-1.6v13.4c-3.6-.6-6.4 0-8.4 1.8z"/>',
    alev:    '<path d="M12 21a6 6 0 0 0 6-6c0-4.4-4.2-6.6-4.2-10.2-2.4 1.2-3.4 3.4-3 5.8-1.2-.6-1.8-1.6-2-3C7 9.2 6 11.4 6 15a6 6 0 0 0 6 6z"/>',
    kalem:   '<path d="M4 20h4.2L19.4 8.8a2.4 2.4 0 0 0 0-3.4l-.8-.8a2.4 2.4 0 0 0-3.4 0L4 15.8z"/>'
             + '<path d="M14.2 6.2 17.8 9.8"/><path d="M4 20l1.2-4.2"/>',
    ampul:   '<path d="M9 17.6h6"/><path d="M9.8 20.6h4.4"/>'
             + '<path d="M12 3.2a5.8 5.8 0 0 0-3.4 10.5v1.9h6.8v-1.9A5.8 5.8 0 0 0 12 3.2z"/>',
    tas:     '<circle cx="12" cy="13.6" r="5.6"/><path d="M2.6 8.6h4.2M3.8 12.4h2.6M2.6 16.4h3"/>'
           + '<path d="M9.6 10.8c1.4-.6 3-.4 4.2.6"/>'
  };

  var TIRNAK = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<path d="M8.6 6.4c-2.4.9-3.9 3-3.9 5.6 0 2 1.3 3.4 3 3.4 1.6 0 2.8-1.1 2.8-2.6 0-1.4-1-2.5-2.4-2.5-.3 0-.6 0-.8.1.3-1.2 1.2-2.2 2.5-2.8z"/>'
    + '<path d="M17.2 6.4c-2.4.9-3.9 3-3.9 5.6 0 2 1.3 3.4 3 3.4 1.6 0 2.8-1.1 2.8-2.6 0-1.4-1-2.5-2.4-2.5-.3 0-.6 0-.8.1.3-1.2 1.2-2.2 2.5-2.8z"/></svg>';

  /* ── söz türleri ──────────────────────────────────────────────────────
     k        anahtar (localStorage'a yazılan değer)
     ad       şeritteki düğme yazısı
     dizi     window üzerindeki havuz adı
     etiket   kayıtta k alanı yoksa kaynak satırına yazılacak tür adı
     birlesik birkaç türü birleştiren seçenek (bileşenlerinin anahtarları)
     en az iki bileşeni dolu değilse birleşik seçenek gösterilmez. */
  var TURLER = [
    { k: 'hepsi',   ad: 'Hepsi',    birlesik: ['ayet', 'hadis', 'atasozu', 'deyim'] },
    { k: 'ayet',    ad: 'Âyet',     dizi: 'KIDEF_SOZ_AYET',    etiket: 'Kur\'an-ı Kerim' },
    { k: 'hadis',   ad: 'Hadis',    dizi: 'KIDEF_SOZ_HADIS',   etiket: 'Hadis' },
    { k: 'dini',    ad: 'Dinî',     birlesik: ['ayet', 'hadis'] },
    { k: 'atasozu', ad: 'Atasözü',  dizi: 'KIDEF_SOZ_ATASOZU', etiket: 'Türk atasözü' },
    { k: 'deyim',   ad: 'Deyim',    dizi: 'KIDEF_SOZ_DEYIM',   etiket: 'Türkçe deyim' }
  ];

  function turBul(k) {
    for (var i = 0; i < TURLER.length; i++) if (TURLER[i].k === k) return TURLER[i];
    return null;
  }

  /* Bir türün söz dizisi. Kayıtlar kopyalanır ve tür etiketi eklenir, böylece
     birleşik havuzda her sözün kendi kaynağı doğru yazılır. */
  function tekHavuz(t) {
    var ham = [];
    try { ham = window[t.dizi] || []; } catch (e) { ham = []; }
    var cik = [];
    for (var i = 0; i < ham.length; i++) {
      var o = ham[i], y = {};
      for (var p in o) if (Object.prototype.hasOwnProperty.call(o, p)) y[p] = o[p];
      y._e = t.etiket || t.ad;
      cik.push(y);
    }
    return cik;
  }

  function havuz(k) {
    var t = turBul(k) || TURLER[0];
    if (!t.birlesik) return tekHavuz(t);
    var hep = [];
    for (var i = 0; i < t.birlesik.length; i++) {
      var alt = turBul(t.birlesik[i]);
      if (alt) hep = hep.concat(tekHavuz(alt));
    }
    return hep;
  }

  /* Şeritte gösterilecek türler: boş havuz görünmez, birleşik seçenek ise
     en az iki bileşeni doluysa görünür (tek bileşenli hâli kopya olurdu). */
  function gorunurTurler() {
    var liste = [];
    for (var i = 0; i < TURLER.length; i++) {
      var t = TURLER[i];
      if (t.birlesik) {
        var dolu = 0;
        for (var j = 0; j < t.birlesik.length; j++) {
          var alt = turBul(t.birlesik[j]);
          if (alt && tekHavuz(alt).length) dolu++;
        }
        if (dolu >= 2) liste.push(t);
      } else if (tekHavuz(t).length) {
        liste.push(t);
      }
    }
    return liste;
  }

  function bugun() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) +
           '-' + ('0' + d.getDate()).slice(-2);
  }

  /* Gün sırası: yılbaşından bugüne geçen gün sayısı (yerel saate göre). */
  function gunSira(n) {
    if (!n) return 0;
    var d = new Date();
    var bas = new Date(d.getFullYear(), 0, 1);
    var g = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - bas) / 86400000);
    return ((g % n) + n) % n;
  }

  function oku() { try { return localStorage.getItem(ANAHTAR) || ''; } catch (e) { return ''; } }
  function yaz(v) { try { localStorage.setItem(ANAHTAR, v); } catch (e) {} }

  function turOku() {
    var v = '';
    try { v = localStorage.getItem(ANAHTAR_TUR) || ''; } catch (e) { v = ''; }
    var g = gorunurTurler();
    for (var i = 0; i < g.length; i++) if (g[i].k === v) return v;
    return g.length ? g[0].k : 'hepsi';          /* havuz boşaldıysa başa dön */
  }
  function turYaz(v) { try { localStorage.setItem(ANAHTAR_TUR, v); } catch (e) {} }

  var katman = null, acik = false, tur = 'hepsi';

  /* Seçili türün bugünkü sözünü karta yaz. */
  function ciz() {
    var liste = havuz(tur);
    var soz = liste[gunSira(liste.length)] || { s: '', n: '', s2: 'yildiz' };

    var ar = katman.querySelector('.gs-arapca');
    ar.textContent = soz.ar || '';
    ar.hidden = !soz.ar;

    katman.querySelector('.gs-simge svg').innerHTML = SIMGE[soz.s2] || SIMGE.yildiz;
    katman.querySelector('.gs-soz').textContent = soz.s || '';
    katman.querySelector('.gs-not').textContent = soz.n || '';
    katman.querySelector('.gs-kaynak').textContent = soz.k || soz._e || '';

    var tuslar = katman.querySelectorAll('.gs-tur-t');
    for (var i = 0; i < tuslar.length; i++) {
      tuslar[i].setAttribute('aria-pressed', tuslar[i].dataset.tur === tur ? 'true' : 'false');
    }
  }

  function turSec(k) {
    if (k === tur) return;
    tur = k;
    turYaz(k);
    ciz();
  }

  function kur() {
    tur = turOku();

    katman = document.createElement('div');
    katman.className = 'gs-katman';
    katman.id = 'gsKatman';
    katman.setAttribute('role', 'dialog');
    katman.setAttribute('aria-modal', 'false');
    katman.setAttribute('aria-label', 'Günün sözü');
    katman.hidden = true;

    var g = gorunurTurler(), serit = '';
    if (g.length > 1) {
      serit = '<div class="gs-turler" role="group" aria-label="Söz türü">' +
                '<span class="gs-turler-bas">Hangi türden gelsin?</span>';
      for (var i = 0; i < g.length; i++) {
        serit += '<button type="button" class="gs-tur-t" data-tur="' + g[i].k +
                 '" aria-pressed="false">' + g[i].ad + '</button>';
      }
      serit += '</div>';
    }

    katman.innerHTML =
      '<div class="gs-kart" role="document">' +
        '<button type="button" class="gs-kapat" aria-label="Kapat">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '<span class="gs-etiket">' + TIRNAK + 'Günün Sözü</span>' +
        '<div class="gs-simge" aria-hidden="true"><svg viewBox="0 0 24 24"></svg></div>' +
        '<p class="gs-arapca" dir="rtl" lang="ar" hidden></p>' +
        '<p class="gs-soz"></p>' +
        '<p class="gs-not"></p>' +
        serit +
        '<div class="gs-alt"><span class="gs-kaynak"></span>' +
          '<button type="button" class="gs-tamam">Anladım</button></div>' +
      '</div>';
    document.body.appendChild(katman);

    ciz();

    katman.querySelector('.gs-kapat').addEventListener('click', kapat);
    katman.querySelector('.gs-tamam').addEventListener('click', kapat);
    katman.addEventListener('click', function (e) { if (e.target === katman) kapat(); });
    katman.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('.gs-tur-t') : null;
      if (t) { e.preventDefault(); turSec(t.dataset.tur); }
    });
    document.addEventListener('keydown', function (e) {
      if (acik && e.key === 'Escape') { e.preventDefault(); kapat(); }
    });

    /* üst çubuğa yeniden açma düğmesi */
    var ust = document.querySelector('.mc-ust');
    if (ust) {
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'gs-tus';
      t.title = 'Günün sözünü göster';
      t.innerHTML = TIRNAK + '<span>Günün sözü</span>';
      t.addEventListener('click', ac);
      ust.appendChild(t);
    }
  }

  function ac() {
    if (!katman) kur();
    katman.hidden = false;
    acik = true;
    requestAnimationFrame(function () { katman.classList.add('gor'); });
  }

  function kapat() {
    if (!acik) return;
    acik = false;
    katman.classList.remove('gor');
    yaz(bugun());                     /* bugün bir daha kendiliğinden açılmasın */
    setTimeout(function () { if (!acik) katman.hidden = true; }, 240);
  }

  function basla() {
    kur();
    if (oku() !== bugun()) setTimeout(ac, 650);   /* sayfa otursun, sonra belirsin */
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', basla);
  } else {
    basla();
  }

  window.KidefGunSozu = {
    ac: ac, kapat: kapat, tur: function () { return tur; }, turSec: turSec,
    turler: function () { var g = gorunurTurler(), c = []; for (var i = 0; i < g.length; i++) c.push(g[i].k); return c; },
    bugunku: function () { var l = havuz(tur); return l[gunSira(l.length)] || null; }
  };
})();
