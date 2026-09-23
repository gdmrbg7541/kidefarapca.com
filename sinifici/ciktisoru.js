/* =====================================================================
   KIDEF · ÖĞRENME ÇIKTISINA GÖRE SINAV — sinifici/ciktisoru.js
   ---------------------------------------------------------------------
   Öğretmen MEB Arapça öğretim programının ÖĞRENME ÇIKTILARINA ve SÜREÇ
   BİLEŞENLERİNE göre soru seçer. İki yönlü çalışır:

     · Çıktı → soru : ağaçtan bir çıktıya (ya da bileşene) tıklayınca
       havuz o çıktının ALAN BECERİSİNE uyan sorulara süzülür.
     · Soru → çıktı : bir soru eklendiğinde, sorunun türünden bulunan alan
       becerisinin o ünitedeki ilk çıktısı KENDİLİĞİNDEN atanır ve ağaçta
       işaretlenir. Atama "Sınavım" listesinden değiştirilebilir; seçim
       tarayıcıda saklanır.

   VERİ KAYNAKLARI — ikisi de çalışma anında okunur, kopya tutulmaz
     · veri/veri_ciktilar.js  → window.ARP_CIKTI (MEB programından ayıklandı)
     · oyunlar/biy_kaliplar.js + oyunlar/bilgiyarismasikacom.js → soru havuzu
       (Soru Kâğıdı Hazırla sayfasının okuma yönteminin aynısı; yarışmaya
       eklenen her yeni soru burada da kendiliğinden görünür)

   NE YAPMAZ — dürüstlük notu
     Bir sorunun hangi ÜNİTEYE ait olduğu havuzda yazmaz. Bu yüzden ünite,
     öğretmenin üstteki şeritten seçtiği ünitedir; sistem kitaptan ünite
     TAHMİN ETMEZ. Alan becerisi ise sorunun türünden kesin olarak bulunur
     (anlam→sözcük, cümle→okuma, gramer/i'rab/vezin/edat→dil bilgisi,
     harf→sesletim). Çıktı numarası bir ÖNERİDİR; öğretmen değiştirebilir.

   ARAPÇA İÇİN KURAL: Arapça metin tek metin düğümünde kalır; Türkçe içinde
   geçen Arapça parçalar <bdi dir="rtl"> içine alınır (yoksa noktalama yer
   değiştirir).
   ===================================================================== */
(function () {
  'use strict';

  var HAVUZ_DOSYALARI = ['oyunlar/biy_kaliplar.js', 'oyunlar/bilgiyarismasikacom.js'];
  var DEPO = 'kidef-ciktisoru-v1';
  var KAGIT_DEPO = 'kidef-sorukagidi-v1';      // Soru Kâğıdı Hazırla sayfasının deposu
  var LISTE_ADIM = 30;

  var $ = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };

  /* =====================================================================
     1) SORU TÜRÜ → ALAN BECERİSİ
     Alan becerisinin NUMARASI sınıfa göre değişir (5-8'de sesletim ayrı bir
     beceri, 9-10'da okuma ikinci sırada), bu yüzden ADIN BAŞIYLA aranır.
     ===================================================================== */
  var TIP_ALAN = {
    anlam: 'SÖZCÜK', kok: 'SÖZCÜK', bosluk: 'SÖZCÜK', kelime: 'SÖZCÜK',
    cumle: 'OKUMA', okuma: 'OKUMA',
    gramer: 'DİL BİLGİSİ', irab: 'DİL BİLGİSİ', vezin: 'DİL BİLGİSİ',
    'ters-vezin': 'DİL BİLGİSİ', edat: 'DİL BİLGİSİ',
    harf: 'SESLETİM'
  };
  /* Alan becerisi bulunamazsa (ör. 5. sınıf 1. ünitede OKUMA yoktur)
     soru yine listelenir, ama çıktı önerisi yapılmaz. */
  var ALAN_KISA = {
    'DİNLEME': 'Dinleme', 'OKUMA': 'Okuma', 'DİL BİLGİSİ': 'Dil bilgisi',
    'SÖZCÜK': 'Sözcük', 'SESLETİM': 'Sesletim', 'KONUŞMA': 'Konuşma', 'YAZMA': 'Yazma'
  };
  /* Havuzdaki konu id'si → sınıf (yalnız sınıf konuları). Ötekiler genel havuzdur. */
  function konuSinif(id) {
    var m = /^sinif(\d+)$/.exec(String(id));
    return m ? m[1] : null;
  }

  /* =====================================================================
     2) HAVUZU OKU  (Soru Kâğıdı Hazırla sayfasındaki yöntemin aynısı)
     ===================================================================== */
  function yapay(h) {
    h = h || function () {};
    return new Proxy(h, {
      get: function (t, k) {
        if (k in t) return t[k];
        if (k === Symbol.toPrimitive) return function () { return ''; };
        if (k === 'then') return undefined;
        return yapay();
      },
      set: function (t, k, v) { t[k] = v; return true; },
      apply: function () { return yapay(); },
      construct: function () { return yapay(); }
    });
  }
  function havuzuOku() {
    var Wt = {};
    var W = new Proxy(Wt, {
      get: function (t, k) {
        if (k in t) return t[k];
        if (typeof k !== 'string' || /^[A-Z_]/.test(k)) return undefined;
        return yapay();
      },
      set: function (t, k, v) { t[k] = v; return true; }
    });
    var hic = function () { return 0; };
    var adlar = ['window', 'self', 'globalThis', 'top', 'parent', 'document', 'firebase',
      'localStorage', 'sessionStorage', 'location', 'history', 'alert', 'confirm', 'prompt',
      'open', 'fetch', 'gtag', 'addEventListener', 'removeEventListener', 'setTimeout',
      'setInterval', 'requestAnimationFrame', 'navigator'];
    var degerler = [W, W, W, W, W, yapay(), yapay(), yapay(), yapay(),
      { search: '', href: '', hostname: '', pathname: '', hash: '' }, yapay(), hic,
      function () { return false; }, function () { return null; }, hic,
      function () { return new Promise(function () {}); }, hic, hic, hic, hic, hic, hic,
      { userAgent: '', language: 'tr' }];
    var kuyruk = HAVUZ_DOSYALARI.map(function (y) {
      return fetch(y, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error(y + ' alınamadı (' + r.status + ')');
        return r.text();
      });
    });
    return Promise.all(kuyruk).then(function (metinler) {
      var sonuc = null;
      metinler.forEach(function (kaynak, i) {
        var ana = /bilgiyarismasikacom\.js$/.test(HAVUZ_DOSYALARI[i]);
        var kuyrukKod = ana
          ? '\n;return {KONULAR: typeof KONULAR!=="undefined"?KONULAR:[],' +
            ' TIP_BILGI: typeof TIP_BILGI!=="undefined"?TIP_BILGI:{},' +
            ' BICIM_BILGI: typeof BICIM_BILGI!=="undefined"?BICIM_BILGI:{}};'
          : '';
        var fn = Function.apply(null, adlar.concat([kaynak + kuyrukKod]));
        var r = fn.apply(null, degerler);
        if (ana) sonuc = r;
      });
      if (!sonuc || !sonuc.KONULAR || !sonuc.KONULAR.length) throw new Error('Soru havuzu boş geldi.');
      var ek = Wt.BIY_EK_KONULAR || [];
      var gorulen = {};
      var konular = sonuc.KONULAR.concat(ek).filter(function (k) {
        if (!k || gorulen[k.id]) return false;
        gorulen[k.id] = 1; return true;
      });
      return { KONULAR: konular, TIP_BILGI: sonuc.TIP_BILGI || {}, BICIM_BILGI: sonuc.BICIM_BILGI || {} };
    });
  }

  /* =====================================================================
     3) DURUM
     ===================================================================== */
  var C = null;                                 // window.ARP_CIKTI
  var V = { sorular: [], harita: {}, tip: {} };
  var d = {
    sinif: '8', unite: '1', ara: '', tip: new Set(), tumSinif: false,
    odak: '',                                   // "8.1.3.1" ya da "8.1.3.1#a"
    secili: [],                                 // sıralı anahtarlar (konuId#soruId)
    atama: {},                                  // anahtar → { c: çıktı kodu, b: bileşen harfi }
    ayar: { baslik: 'Arapça Yazılı Sınavı', okul: '', sube: '', tarih: '', toplam: 100, ogretmen: '' }
  };
  var gosterilen = LISTE_ADIM;

  function bugun() {
    var t = new Date();
    return ('0' + t.getDate()).slice(-2) + '.' + ('0' + (t.getMonth() + 1)).slice(-2) + '.' + t.getFullYear();
  }
  function kaydet() {
    try {
      localStorage.setItem(DEPO, JSON.stringify({
        sinif: d.sinif, unite: d.unite, secili: d.secili, atama: d.atama, ayar: d.ayar
      }));
    } catch (e) {}
  }
  function geriYukle() {
    try {
      var o = JSON.parse(localStorage.getItem(DEPO) || 'null');
      if (!o) return;
      if (o.sinif) d.sinif = String(o.sinif);
      if (o.unite) d.unite = String(o.unite);
      if (Array.isArray(o.secili)) d.secili = o.secili;
      if (o.atama) d.atama = o.atama;
      if (o.ayar) Object.keys(d.ayar).forEach(function (k) { if (k in o.ayar) d.ayar[k] = o.ayar[k]; });
    } catch (e) {}
  }

  /* =====================================================================
     4) YARDIMCILAR
     ===================================================================== */
  var AR = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
  var AR_PARCA = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿][؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿\sً-ٟ]*/g;
  function kac(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function arMi(s) { return AR.test(String(s || '')); }
  function karisik(s) {
    return kac(s).replace(AR_PARCA, function (m) { return '<bdi dir="rtl" class="ar">' + m + '</bdi>'; });
  }
  function metin(s) {
    return arMi(s) && !/[a-zçğıöşü]{3,}/i.test(s)
      ? '<span dir="rtl" class="ar">' + kac(s) + '</span>' : karisik(s);
  }
  function normalle(s) {
    return String(s || '').toLocaleLowerCase('tr')
      .replace(/[ً-ٰٟـ‌-‏‪-‮⁦-⁩]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
  }

  /* ---- çıktı/alan erişimi ---- */
  function alanAdi(kod) { return C.alan[kod] || ''; }          // kod: "8.1.3"
  /* Seçili sınıf+ünitede, adı ANAHTARLA başlayan alan becerisinin kodu */
  function alanBul(anahtar, sinif, unite) {
    var on = (sinif || d.sinif) + '.' + (unite || d.unite) + '.';
    for (var i = 1; i <= 9; i++) {
      var k = on + i;
      if (C.alan[k] && C.alan[k].indexOf(anahtar) === 0) return k;
    }
    return '';
  }
  function alanCiktilari(alanKod) {
    return Object.keys(C.cikti).filter(function (k) {
      return k.indexOf(alanKod + '.') === 0;
    }).sort(function (a, b) {
      return (+a.split('.')[3]) - (+b.split('.')[3]);
    });
  }
  function uniteAlanlari(sinif, unite) {
    var on = sinif + '.' + unite + '.', r = [];
    for (var i = 1; i <= 9; i++) if (C.alan[on + i]) r.push(on + i);
    return r;
  }
  /* Bir sorunun alan becerisi anahtarı ("SÖZCÜK" gibi) */
  function soruAlanAnahtari(o) { return TIP_ALAN[o.q.tip] || ''; }
  /* Bir soruya önerilen çıktı kodu (seçili sınıf+ünitede) */
  function onerilenCikti(o) {
    var an = soruAlanAnahtari(o);
    if (!an) return '';
    var ak = alanBul(an);
    if (!ak) return '';
    var c = alanCiktilari(ak);
    return c.length ? c[0] : '';
  }

  /* =====================================================================
     5) HAVUZ SÜZME
     ===================================================================== */
  function odakAlani() {
    if (!d.odak) return '';
    var kod = d.odak.split('#')[0];
    return kod.split('.').slice(0, 3).join('.');
  }
  function suzulmus(haric) {
    var a = normalle(d.ara), oa = odakAlani();
    var oAd = oa ? alanAdi(oa) : '';
    return V.sorular.filter(function (o) {
      var ks = konuSinif(o.konu);
      if (!d.tumSinif && ks && ks !== d.sinif) return false;
      if (haric !== 'tip' && d.tip.size && !d.tip.has(o.q.tip)) return false;
      if (oAd) {
        var an = soruAlanAnahtari(o);
        if (!an || oAd.indexOf(an) !== 0) return false;
      }
      if (a && o.ara.indexOf(a) < 0) return false;
      return true;
    });
  }
  /* Bir alan becerisine uyan soru sayısı (sınıf süzgeci uygulanmış) */
  function alanSoruSayisi(alanKod) {
    var ad = alanAdi(alanKod), n = 0;
    V.sorular.forEach(function (o) {
      var ks = konuSinif(o.konu);
      if (!d.tumSinif && ks && ks !== d.sinif) return;
      var an = soruAlanAnahtari(o);
      if (an && ad.indexOf(an) === 0) n++;
    });
    return n;
  }

  /* =====================================================================
     6) ÇİZİM — çıktı ağacı
     ===================================================================== */
  function ciz() {
    cizAgac(); cizHavuz(); cizSinav(); sayilar();
  }
  function sayilar() {
    $$('.say-secili').forEach(function (e) { e.textContent = d.secili.length; });
    $('#sayHavuz').textContent = suzulmus().length;
    $('#sinavBos').hidden = !!d.secili.length;
    $('#btnTablo').disabled = !d.secili.length;
    $('#btnAktar').disabled = !d.secili.length;
  }
  function ciktiSecimSayisi(kod) {
    var n = 0;
    d.secili.forEach(function (a) { if (d.atama[a] && d.atama[a].c === kod) n++; });
    return n;
  }
  function cizAgac() {
    var kutu = $('#agac'), sinif = d.sinif, unite = d.unite;
    var ua = (C.unite[sinif] || {})[unite] || '';
    $('#uniteAd').textContent = sinif + '. sınıf · ' + unite + '. ünite' + (ua ? ' — ' + ua : '');
    $('#odakTemizle').hidden = !d.odak;
    var alanlar = uniteAlanlari(sinif, unite);
    if (!alanlar.length) { kutu.innerHTML = '<p class="not">Bu sınıf için program verisi bulunamadı.</p>'; return; }
    kutu.innerHTML = alanlar.map(function (ak) {
      var ad = alanAdi(ak), ciktilar = alanCiktilari(ak);
      var sec = ciktilar.reduce(function (t, k) { return t + ciktiSecimSayisi(k); }, 0);
      var acik = !d.odak || odakAlani() === ak;
      return '<div class="alanblok">' +
        '<button type="button" class="alanbas" aria-expanded="' + (acik ? 'true' : 'false') + '" data-alan="' + ak + '">' +
          '<span class="kod">ARP.' + ak + '</span><span>' + kac(ad) + '</span>' +
          '<span class="oksay">' + ciktilar.length + ' çıktı · ' + alanSoruSayisi(ak) + ' soru' +
          (sec ? ' · <b style="color:#16A085">' + sec + ' seçili</b>' : '') + '</span>' +
        '</button>' +
        '<div class="aliste">' + ciktilar.map(function (k) {
          var c = C.cikti[k], n = ciktiSecimSayisi(k);
          var odakli = d.odak.split('#')[0] === k;
          return '<button type="button" class="ciktisat' + (odakli ? ' odak acik' : '') + '" data-cikti="' + k + '">' +
              '<span class="kod">' + k + '</span>' +
              '<span class="m">' + kac(c.m) + '</span>' +
              '<span class="rz"><i>' + c.b.length + ' süreç bileşeni</i>' +
              (n ? '<i class="sec">' + n + ' soru seçili</i>' : '') + '</span>' +
            '</button>' +
            '<div class="bilesenler">' + c.b.map(function (b) {
              var bk = k + '#' + b[0];
              return '<button type="button" class="bilsat' + (d.odak === bk ? ' odak' : '') + '" data-bilesen="' + bk + '">' +
                '<b>' + kac(b[0]) + ')</b><span>' + kac(b[1]) + '</span></button>';
            }).join('') + '</div>';
        }).join('') + '</div></div>';
    }).join('');
  }

  /* =====================================================================
     7) ÇİZİM — soru havuzu
     ===================================================================== */
  function cizHavuz() {
    var liste = suzulmus();
    $('#bulunan').textContent = liste.length + ' soru';
    /* tür çipleri */
    var say = {};
    suzulmus('tip').forEach(function (o) { say[o.q.tip] = (say[o.q.tip] || 0) + 1; });
    $('#suz-tip').innerHTML = Object.keys(say).sort().map(function (t) {
      var bilgi = V.tip[t] || {};
      return '<button type="button" class="cip" data-tip="' + kac(t) + '" aria-pressed="' +
        (d.tip.has(t) ? 'true' : 'false') + '">' + kac(bilgi.ad || t) + ' <b>' + say[t] + '</b></button>';
    }).join('');
    /* odak bilgisi */
    var ob = $('#odakBilgi');
    if (d.odak) {
      var kod = d.odak.split('#')[0], harf = d.odak.split('#')[1];
      var c = C.cikti[kod], ak = odakAlani();
      ob.hidden = false;
      ob.innerHTML = '<b>' + kod + '</b> — ' + kac(c ? c.m : '') +
        (harf ? '<br><b>' + kac(harf) + ')</b> ' + kac((c.b.filter(function (x) { return x[0] === harf; })[0] || ['', ''])[1]) : '') +
        '<br><small>Alan becerisi: ' + kac(alanAdi(ak)) + ' — havuz bu beceriye uyan sorulara süzüldü.</small>';
    } else ob.hidden = true;
    /* liste */
    var goster = liste.slice(0, gosterilen);
    $('#liste').innerHTML = goster.map(function (o) {
      var secili = d.secili.indexOf(o.anahtar) >= 0;
      var an = soruAlanAnahtari(o), ak = an ? alanBul(an) : '';
      var bilgi = V.tip[o.q.tip] || {};
      return '<article class="soru' + (secili ? ' secili' : '') + '" data-a="' + kac(o.anahtar) + '">' +
        '<div class="st">' +
          '<span class="rozet">' + kac(o.konuAd) + '</span>' +
          '<span class="rozet">' + kac(bilgi.ad || o.q.tip) + '</span>' +
          (o.q.zorluk ? '<span class="rozet">zorluk ' + o.q.zorluk + '</span>' : '') +
          (ak ? '<span class="rozet arp">ARP.' + ak + ' · ' + kac(ALAN_KISA[an] || an) + '</span>'
              : '<span class="rozet">çıktı önerisi yok</span>') +
        '</div>' +
        (o.q.arapca ? '<p>' + metin(o.q.arapca) + '</p>' : '') +
        '<p>' + karisik(o.q.soru) + '</p>' +
        (Array.isArray(o.q.secenekler) && o.q.secenekler.length
          ? '<div class="sik">' + o.q.secenekler.map(function (s, i) {
              return '<span>' + String.fromCharCode(65 + i) + ') ' + karisik(s) + '</span>';
            }).join('') + '</div>' : '') +
        '<button type="button" data-is="' + (secili ? 'cikar' : 'ekle') + '">' +
          (secili ? '✓ Sınavda — çıkar' : '+ Ekle') + '</button>' +
      '</article>';
    }).join('') || '<p class="not">Bu süzgeçlerle soru bulunamadı.</p>';
    var kalan = liste.length - goster.length;
    $('#dahaFazla').hidden = kalan <= 0;
    $('#dahaFazla').textContent = kalan > 0 ? kalan + ' soru daha göster' : '';
  }

  /* =====================================================================
     8) ÇİZİM — sınavım
     ===================================================================== */
  function ciktiSecenekleri(secili) {
    var gruplar = [];
    Object.keys(C.unite[d.sinif] || {}).sort(function (a, b) { return a - b; }).forEach(function (u) {
      uniteAlanlari(d.sinif, u).forEach(function (ak) {
        var ic = alanCiktilari(ak).map(function (k) {
          return '<option value="' + k + '"' + (k === secili ? ' selected' : '') + '>' +
            k + ' — ' + kac(C.cikti[k].m.slice(0, 74)) + '</option>';
        }).join('');
        gruplar.push('<optgroup label="' + u + '. ünite · ' + kac(alanAdi(ak)) + '">' + ic + '</optgroup>');
      });
    });
    return '<option value=""' + (secili ? '' : ' selected') + '>— çıktı seçilmedi —</option>' + gruplar.join('');
  }
  function bilesenSecenekleri(kod, secili) {
    var c = C.cikti[kod];
    if (!c) return '<option value="">—</option>';
    return '<option value="">— süreç bileşeni (isteğe bağlı) —</option>' + c.b.map(function (b) {
      return '<option value="' + kac(b[0]) + '"' + (b[0] === secili ? ' selected' : '') + '>' +
        kac(b[0]) + ') ' + kac(b[1].slice(0, 80)) + '</option>';
    }).join('');
  }
  function cizSinav() {
    var kutu = $('#sinav');
    d.secili = d.secili.filter(function (a) { return V.harita[a]; });
    kutu.innerHTML = d.secili.map(function (a) {
      var o = V.harita[a], at = d.atama[a] || {};
      var ozet = (o.q.arapca && !o.q.soru ? o.q.arapca : o.q.soru) || '';
      return '<li data-a="' + kac(a) + '">' +
        '<button type="button" class="sil" data-is="sil" aria-label="Kaldır">✕</button>' +
        '<div class="mt" style="margin-top:2px">' + karisik(ozet.slice(0, 120)) + '</div>' +
        '<select data-is="cikti">' + ciktiSecenekleri(at.c || '') + '</select>' +
        '<select data-is="bilesen"' + (at.c ? '' : ' disabled') + '>' + bilesenSecenekleri(at.c, at.b || '') + '</select>' +
      '</li>';
    }).join('');
  }

  /* =====================================================================
     9) SEÇME / ÇIKARMA
     ===================================================================== */
  function degistir(a) {
    var i = d.secili.indexOf(a);
    if (i >= 0) { d.secili.splice(i, 1); delete d.atama[a]; }
    else {
      d.secili.push(a);
      /* odaktaki çıktı varsa onu ata, yoksa soru türünden öneriyi ata */
      var o = V.harita[a], kod = '', harf = '';
      if (d.odak) {
        var ok = d.odak.split('#')[0], an = soruAlanAnahtari(o);
        /* odak, sorunun alan becerisiyle uyuşuyorsa doğrudan onu kullan */
        if (an && alanAdi(odakAlani()).indexOf(an) === 0) { kod = ok; harf = d.odak.split('#')[1] || ''; }
      }
      if (!kod) kod = onerilenCikti(o);
      if (kod) d.atama[a] = { c: kod, b: harf };
    }
    kaydet(); ciz();
  }

  /* =====================================================================
     10) DAĞILIM TABLOSU
     ===================================================================== */
  function puanDagit(n) {
    if (!n) return [];
    var top = Math.max(1, parseInt(d.ayar.toplam, 10) || 100);
    var taban = Math.floor(top / n), kalan = top - taban * n, r = [];
    for (var i = 0; i < n; i++) r.push(taban + (i < kalan ? 1 : 0));
    return r;
  }
  function tabloCiz() {
    var puan = puanDagit(d.secili.length);
    var satirlar = d.secili.map(function (a, i) {
      var o = V.harita[a], at = d.atama[a] || {};
      var c = at.c ? C.cikti[at.c] : null;
      var ak = at.c ? at.c.split('.').slice(0, 3).join('.') : '';
      var bil = c && at.b ? (c.b.filter(function (x) { return x[0] === at.b; })[0] || null) : null;
      var ozet = (o.q.soru || o.q.arapca || '');
      return '<tr>' +
        '<td class="no">' + (i + 1) + '</td>' +
        '<td>' + karisik(ozet.slice(0, 150)) + (o.q.arapca && o.q.soru ? '<br><small>' + metin(o.q.arapca) + '</small>' : '') + '</td>' +
        '<td>' + kac(o.konuAd) + '</td>' +
        '<td>' + (ak ? 'ARP.' + ak + '<br><small>' + kac(alanAdi(ak)) + '</small>' : '—') + '</td>' +
        '<td>' + (at.c ? '<b>' + at.c + '</b><br><small>' + kac(c.m) + '</small>' : '—') + '</td>' +
        '<td>' + (bil ? '<b>' + kac(bil[0]) + ')</b> ' + kac(bil[1]) : '—') + '</td>' +
        '<td class="pu">' + puan[i] + '</td>' +
      '</tr>';
    }).join('');
    /* özet: çıktıya göre soru ve puan dağılımı */
    var oz = {};
    d.secili.forEach(function (a, i) {
      var k = (d.atama[a] || {}).c || '—';
      oz[k] = oz[k] || { n: 0, p: 0 };
      oz[k].n++; oz[k].p += puan[i];
    });
    var ozetSat = Object.keys(oz).sort().map(function (k) {
      return '<tr><td>' + (k === '—' ? 'Çıktı atanmadı' : '<b>' + k + '</b> — ' + kac(C.cikti[k] ? C.cikti[k].m : '')) +
        '</td><td class="pu">' + oz[k].n + '</td><td class="pu">' + oz[k].p + '</td></tr>';
    }).join('');
    var ua = (C.unite[d.sinif] || {})[d.unite] || '';
    $('#tabloIc').innerHTML =
      '<h3>' + kac(d.ayar.baslik || 'Arapça Yazılı Sınavı') + '</h3>' +
      '<p class="alt">' + [kac(d.ayar.okul), d.sinif + '. sınıf' + (d.ayar.sube ? ' / ' + kac(d.ayar.sube) : ''),
        d.unite + '. ünite' + (ua ? ' — ' + kac(ua) : ''), kac(d.ayar.tarih || bugun())]
        .filter(Boolean).join('  ·  ') + '</p>' +
      '<table><thead><tr>' +
        '<th style="width:34px">No</th><th>Soru</th><th style="width:92px">Havuz konusu</th>' +
        '<th style="width:128px">Alan becerisi</th><th style="width:230px">Öğrenme çıktısı</th>' +
        '<th style="width:200px">Süreç bileşeni</th><th style="width:46px">Puan</th>' +
      '</tr></thead><tbody>' + satirlar + '</tbody>' +
      '<tfoot><tr><td colspan="6">TOPLAM</td><td class="pu">' +
        puan.reduce(function (t, x) { return t + x; }, 0) + '</td></tr></tfoot></table>' +
      '<div class="ozet"><table><thead><tr><th>Öğrenme çıktısı</th><th style="width:70px">Soru</th>' +
      '<th style="width:70px">Puan</th></tr></thead><tbody>' + ozetSat + '</tbody></table></div>' +
      (d.ayar.ogretmen ? '<p class="alt" style="margin-top:22px">Ders öğretmeni: ' + kac(d.ayar.ogretmen) + '</p>' : '') +
      '<p class="alt" style="margin-top:10px;font-size:11px">Öğrenme çıktıları ve süreç bileşenleri: ' +
        kac(C.kaynak) + '  ·  kidefarapca.com</p>';
    $('#tablo').hidden = false;
  }

  /* =====================================================================
     11) SORU KÂĞIDINA AKTAR
     ===================================================================== */
  function aktar() {
    var eski = null;
    try { eski = JSON.parse(localStorage.getItem(KAGIT_DEPO) || 'null'); } catch (e) {}
    var ayar = (eski && eski.ayar) || {};
    ayar.baslik = d.ayar.baslik || ayar.baslik || 'Arapça Yazılı Sınavı';
    ayar.okul = d.ayar.okul || ayar.okul || '';
    ayar.sinif = d.ayar.sube || ayar.sinif || '';
    ayar.tarih = d.ayar.tarih || ayar.tarih || bugun();
    ayar.toplam = parseInt(d.ayar.toplam, 10) || ayar.toplam || 100;
    try {
      localStorage.setItem(KAGIT_DEPO, JSON.stringify({ secili: d.secili.slice(), ayar: ayar }));
    } catch (e) {
      durum('Tarayıcı belleğe yazamadı; aktarma yapılamadı.'); return;
    }
    durum(d.secili.length + ' soru Soru Kâğıdı Hazırla sayfasına aktarıldı. Yeni sekme açılıyor…');
    window.open('sorukagidi.html', '_blank');
  }
  function durum(s) {
    var e = $('#durum'); e.textContent = s; e.hidden = false;
    clearTimeout(durum._t); durum._t = setTimeout(function () { e.hidden = true; }, 6000);
  }

  /* =====================================================================
     12) OLAYLAR
     ===================================================================== */
  function olaylar() {
    $('#sinif').addEventListener('change', function () {
      d.sinif = this.value; d.unite = '1'; d.odak = ''; gosterilen = LISTE_ADIM;
      uniteDoldur(); kaydet(); ciz();
    });
    $('#unite').addEventListener('change', function () {
      d.unite = this.value; d.odak = ''; gosterilen = LISTE_ADIM; kaydet(); ciz();
    });
    $('#ara').addEventListener('input', function () {
      d.ara = normalle(this.value); gosterilen = LISTE_ADIM; cizHavuz(); sayilar();
    });
    $('#tumSinif').addEventListener('change', function () {
      d.tumSinif = this.checked; gosterilen = LISTE_ADIM; ciz();
    });
    $('#odakTemizle').addEventListener('click', function () {
      d.odak = ''; gosterilen = LISTE_ADIM; ciz();
    });
    $('#agac').addEventListener('click', function (e) {
      var bas = e.target.closest('.alanbas');
      if (bas) {
        var acik = bas.getAttribute('aria-expanded') === 'true';
        bas.setAttribute('aria-expanded', acik ? 'false' : 'true');
        return;
      }
      var c = e.target.closest('.ciktisat');
      if (c) {
        var k = c.getAttribute('data-cikti');
        d.odak = (d.odak.split('#')[0] === k && !d.odak.split('#')[1]) ? '' : k;
        gosterilen = LISTE_ADIM; ciz(); return;
      }
      var b = e.target.closest('.bilsat');
      if (b) {
        var bk = b.getAttribute('data-bilesen');
        d.odak = d.odak === bk ? bk.split('#')[0] : bk;
        gosterilen = LISTE_ADIM; ciz();
      }
    });
    $('#suz-tip').addEventListener('click', function (e) {
      var c = e.target.closest('.cip'); if (!c) return;
      var t = c.getAttribute('data-tip');
      if (d.tip.has(t)) d.tip.delete(t); else d.tip.add(t);
      gosterilen = LISTE_ADIM; cizHavuz(); sayilar();
    });
    $('#liste').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-is]'); if (!btn) return;
      degistir(btn.closest('.soru').getAttribute('data-a'));
    });
    $('#dahaFazla').addEventListener('click', function () {
      gosterilen += LISTE_ADIM; cizHavuz();
    });
    $('#sinav').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-is="sil"]'); if (!btn) return;
      degistir(btn.closest('li').getAttribute('data-a'));
    });
    $('#sinav').addEventListener('change', function (e) {
      var s = e.target.closest('select[data-is]'); if (!s) return;
      var a = s.closest('li').getAttribute('data-a');
      if (s.getAttribute('data-is') === 'cikti') {
        if (s.value) d.atama[a] = { c: s.value, b: '' }; else delete d.atama[a];
      } else {
        if (d.atama[a]) d.atama[a].b = s.value;
      }
      kaydet(); cizSinav(); cizAgac();
    });
    $('#sinavTemizle').addEventListener('click', function () {
      d.secili = []; d.atama = {}; kaydet(); ciz();
    });
    $$('[data-ayar]').forEach(function (e) {
      var k = e.getAttribute('data-ayar');
      e.value = d.ayar[k];
      e.addEventListener('input', function () { d.ayar[k] = this.value; kaydet(); });
    });
    $('#btnTablo').addEventListener('click', tabloCiz);
    $('#tabloKapat').addEventListener('click', function () { $('#tablo').hidden = true; });
    $('#tabloYazdir').addEventListener('click', function () { window.print(); });
    $('#btnAktar').addEventListener('click', aktar);
    $$('.sekme').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.sekme').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        b.setAttribute('aria-selected', 'true');
        document.body.setAttribute('data-sekme', b.getAttribute('data-sekme'));
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#tablo').hidden) $('#tablo').hidden = true;
    });
  }

  function uniteDoldur() {
    var u = C.unite[d.sinif] || {};
    $('#unite').innerHTML = Object.keys(u).sort(function (a, b) { return a - b; }).map(function (n) {
      return '<option value="' + n + '"' + (n === d.unite ? ' selected' : '') + '>' + n + '. ' + kac(u[n]) + '</option>';
    }).join('');
    if (!u[d.unite]) { d.unite = Object.keys(u).sort()[0] || '1'; $('#unite').value = d.unite; }
  }

  /* =====================================================================
     13) BAŞLAT
     ===================================================================== */
  function basla(r) {
    V.tip = r.TIP_BILGI || {};
    r.KONULAR.forEach(function (k) {
      (k.sorular || []).forEach(function (q) {
        if (!q || q.soru == null) return;
        var o = {
          anahtar: k.id + '#' + q.id, konu: String(k.id), konuAd: k.ad || String(k.id), q: q,
          ara: normalle([q.soru, q.arapca, (q.secenekler || []).join(' '),
            (q.parcalar || []).join(' '), q.cevapYazi].join(' '))
        };
        if (V.harita[o.anahtar]) return;
        V.harita[o.anahtar] = o; V.sorular.push(o);
      });
    });
    $('#havuzBilgi').textContent = 'Havuzda ' + V.sorular.length + ' soru, programda ' +
      Object.keys(C.cikti).length + ' öğrenme çıktısı var.';
    $('#programNot').innerHTML =
      '<b>Nasıl çalışır?</b> Ünite, üstten senin seçtiğin ünitedir — sistem sorunun ünitesini ' +
      'tahmin etmez. Sorunun <b>alan becerisi</b> türünden kesin bulunur (anlam→sözcük, cümle→okuma, ' +
      'dil bilgisi soruları→dil bilgisi). Çıktı numarası bir <b>öneridir</b>; “Sınavım” listesinden ' +
      'değiştirebilirsin.';
    var sn = Object.keys(C.unite).sort(function (a, b) { return a - b; });
    $('#sinif').innerHTML = sn.map(function (s) {
      return '<option value="' + s + '"' + (s === d.sinif ? ' selected' : '') + '>' + s + '. sınıf</option>';
    }).join('');
    if (!C.unite[d.sinif]) { d.sinif = sn[0]; $('#sinif').value = d.sinif; }
    uniteDoldur();
    olaylar();
    $('#yukleniyor').hidden = true;
    $('#uygulama').hidden = false;
    ciz();
  }

  function hata(e) {
    $('#yukleniyor').innerHTML = '<p style="color:#EE5253">Yüklenemedi: ' + kac(e && e.message || e) + '</p>';
  }

  C = window.ARP_CIKTI;
  if (!C || !C.cikti) { hata(new Error('veri/veri_ciktilar.js yüklenmedi.')); return; }
  geriYukle();
  d.ayar.tarih = d.ayar.tarih || bugun();
  havuzuOku().then(basla).catch(hata);
})();
