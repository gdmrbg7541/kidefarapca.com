/* =====================================================================
   KIDEF · KİTAP ETKİNLİKLERİ             (sistem/kitapetkinlik.js)
   ---------------------------------------------------------------------
   AMAÇ
   İmam Hatip akordiyonunda 7, 9 ve 10. sınıfların «Kitap Etkinlikleri»
   bölümü. Okul ders kitabına giren dijital etkinlikler (Komisyon
   çalışmaları) ünite ünite, kitaptaki sayfasıyla listelenir.

   DOSYALAR
   Etkinlikler hazır paketlerdir; klasör yapıları korunarak
   kitapetkinlikleri/<sınıf>/<paket>/ altına kopyalandı (bkz.
   KLASOR-DUZENI.md). Asılları 📖Komisyon klasöründe durur.

   NASIL ÇALIŞIR
   index.html'de her sınıfın «Kitap Etkinlikleri» bölümünde
   <div class="ih-kitap" data-sinif="N"></div> kutusu vardır. Bu dosya
   KITAP[N] verisinden o kutuya ünite akordiyonunu basar. Ünite satırları
   sınıf dökümanlarıyla aynı akordiyon sınıflarını (ihdoc-item /
   ihdocToggle) kullanır; açılıp kapanma index.html'deki koddan gelir.

   ⚠️ YENİ ETKİNLİK EKLEMEK — tek satır:
      KITAP[sınıf].uniteler[i].etk dizisine
        { tur:'hafiza', ad:'Hafıza Kartları', alt:'Renkler', sayfa:113,
          url:'9/arp09.02.2_s113_hafizakarti_2/' }
      tur  : oyun · hafiza · deger (ünite sonu) · sayfa (sayfa etkinliği) · ek
      url  : kitapetkinlikleri/ klasörüne göre
      parca: [['Dosya.html','Ad'], …]  → menülü paketlerde etkinlikler
             satırın altında tek tek de açılır (isteğe bağlı)
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefKitapEtkinlik) return;

  var KOK = 'kitapetkinlikleri/';

  /* ---------------- simgeler (24×24) ---------------- */
  function svg(ic) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ic + '</svg>'; }
  var SIMGE = {
    oyun: function (c) {
      return svg('<rect x="2.4" y="7" width="19.2" height="11" rx="5.5" fill="#F3EEFF" stroke="' + c + '" stroke-width="1.6"/>' +
        '<path d="M7.6 10.4v4.2M5.5 12.5h4.2" stroke="' + c + '" stroke-width="1.8" stroke-linecap="round"/>' +
        '<circle cx="15.4" cy="11.3" r="1.25" fill="' + c + '"/><circle cx="17.9" cy="13.7" r="1.25" fill="' + c + '"/>');
    },
    hafiza: function (c) {
      return svg('<rect x="2.8" y="5.2" width="10" height="13.6" rx="2.2" fill="#FFF3E3" stroke="' + c + '" stroke-width="1.5" transform="rotate(-9 7.8 12)"/>' +
        '<rect x="11.2" y="5.2" width="10" height="13.6" rx="2.2" fill="#fff" stroke="' + c + '" stroke-width="1.5" transform="rotate(9 16.2 12)"/>' +
        '<path d="M14.2 10.2a2 2 0 1 1 2.6 1.9c-.6.2-.8.6-.8 1.1v.4" fill="none" stroke="' + c + '" stroke-width="1.5" stroke-linecap="round" transform="rotate(9 16.2 12)"/>' +
        '<circle cx="16" cy="15.6" r=".9" fill="' + c + '" transform="rotate(9 16.2 12)"/>');
    },
    deger: function (c) {
      return svg('<rect x="4.6" y="4" width="14.8" height="17.2" rx="2.4" fill="#E9F7F3" stroke="' + c + '" stroke-width="1.6"/>' +
        '<rect x="8.8" y="2.5" width="6.4" height="3.6" rx="1.2" fill="#fff" stroke="' + c + '" stroke-width="1.4"/>' +
        '<path d="M8.4 13.2l2.3 2.3 4.8-5.2" fill="none" stroke="' + c + '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>');
    },
    sayfa: function (c) {
      return svg('<path d="M2.8 5.8c3-1 6.1-.8 9.2.9v12.6c-3.1-1.7-6.2-1.9-9.2-.9z" fill="#EAF1FE" stroke="' + c + '" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M21.2 5.8c-3-1-6.1-.8-9.2.9v12.6c3.1-1.7 6.2-1.9 9.2-.9z" fill="#fff" stroke="' + c + '" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M14.6 10.6h4M14.6 13.6h2.9" stroke="' + c + '" stroke-width="1.5" stroke-linecap="round"/>');
    },
    ek: function (c) {
      return svg('<path d="M12 3.4l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.7l-5.2 2.7 1-5.8L3.6 9.5l5.8-.8z" fill="#FDECF4" stroke="' + c + '" stroke-width="1.5" stroke-linejoin="round"/>');
    },
    pdf: function (c) {
      return svg('<path d="M6 2.6h8l4.4 4.4v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4.6a2 2 0 0 1 2-2z" fill="#FDECEA" stroke="' + c + '" stroke-width="1.5"/>' +
        '<path d="M14 2.6V7h4.4" fill="none" stroke="' + c + '" stroke-width="1.5"/><path d="M7.6 13.4h8.8M7.6 16.6h6" stroke="' + c + '" stroke-width="1.5" stroke-linecap="round"/>');
    }
  };
  var TUR = {
    oyun:   { renk: '#7C3AED', ad: 'Oyun' },
    hafiza: { renk: '#E67E22', ad: 'Hafıza kartları' },
    deger:  { renk: '#16A085', ad: 'Ünite sonu' },
    sayfa:  { renk: '#2563EB', ad: 'Sayfa etkinliği' },
    ek:     { renk: '#DB2777', ad: 'Ek etkinlik' },
    pdf:    { renk: '#EE5253', ad: 'Belge' }
  };

  /* ---------------- ortak parça adları ---------------- */
  var O = {                                   /* 7. sınıf ünite oyunları */
    yaz: ['yaz.html', 'Harfleri Sırala'], kelime: ['kelime.html', 'Sembol Avı'],
    ses: ['sestesti.html', 'Dinleme Testi'], evet: ['evethayir.html', 'Evet mi, Hayır mı?'],
    hafiza: ['hafizakarti.html', 'Hafıza Kartları'], zamir: ['zamirtesti.html', 'Doğru Fiili Seç'],
    saat: ['saat.html', 'Saati Oku'], mukayese: ['mukayese.html', 'Hangisi? (Karşılaştır)'],
    pazar: ['alisveris.html', 'Kelime Pazarı'], seyahat: ['seyahat.html', 'Seyahat'],
    turist: ['turist.html', 'Turist Rehberi'], harita: ['harita.html', 'Şehir Avı (Harita)']
  };
  var D = {                                   /* ünite sonu değerlendirme parçaları */
    bosluk: ['boslukdoldurma.html', 'Boşluk Doldurma'], sirala: ['cumlesirala.html', 'Kelimeleri Sırala'],
    tamamla: ['eslestirme.html', 'Cümleleri Tamamla'], avi: ['kelimeavi.html', 'Kelime Avı'],
    surukle: ['suruklebirak.html', 'Sürükle-Bırak'], test: ['test.html', 'Test'],
    harf: ['hangiharf.html', 'Harf Yarışması'], dinle: ['dinlevesec.html', 'Dinle ve Seç'],
    hafiza: ['hafizakarti.html', 'Hafıza Kartları']
  };
  var STANDART = [D.bosluk, D.sirala, D.tamamla, D.avi, D.surukle, D.test];
  function uniteSonu(url, sayfa, parca) {
    return { tur: 'deger', ad: 'Ünite Sonu Değerlendirme', alt: (parca || STANDART).length + ' etkinlik · menüden seç',
             sayfa: sayfa, url: url, parca: parca || STANDART };
  }
  function oyunlar(url, parca) {
    return { tur: 'oyun', ad: 'Ünite Oyunları', alt: parca.length + ' oyun · menüden seç', url: url, parca: parca };
  }
  function hafiza(url, alt, sayfa) { return { tur: 'hafiza', ad: 'Hafıza Kartları', alt: alt, sayfa: sayfa, url: url }; }

  /* =====================================================================
     VERİ
     ===================================================================== */
  var KITAP = {
    7: {
      kitap: 'İHO Arapça 7',
      uniteler: [
        { no: 1, ad: 'Bugün Ne Yaptım?', ar: 'ماذا فَعَلْتُ اليَوْم؟', etk: [
          oyunlar('7/unite_1_oyunlar/', [O.yaz, O.kelime, O.ses, O.evet, O.hafiza, O.zamir, O.saat]),
          uniteSonu('7/unitesonudeger_1/') ] },
        { no: 2, ad: 'Alışveriş Zamanı', ar: 'وَقْت التَّسَوُّق', etk: [
          oyunlar('7/unite_2_oyunlar/', [O.yaz, O.kelime, O.evet, O.mukayese, O.pazar, O.hafiza]),
          uniteSonu('7/unitesonudeger_2/') ] },
        { no: 3, ad: 'Nereye Seyahat Ediyoruz?', ar: 'إِلى أَيْن نُسافِرُ؟', etk: [
          oyunlar('7/unite_3_oyunlar/', [O.yaz, O.kelime, O.evet, O.hafiza, O.seyahat]),
          uniteSonu('7/unitesonudeger_3/') ] },
        { no: 4, ad: 'Şehrim ve Ülkem', ar: 'مَدينَتي وَبَلَدي', etk: [
          oyunlar('7/unite_4_oyunlar/', [O.yaz, O.kelime, O.turist, O.saat, O.harita]),
          uniteSonu('7/unitesonudeger_4/') ] }
      ]
    },
    9: {
      kitap: 'İHL Arapça 9',
      uniteler: [
        { no: 1, ad: 'Haydi Tanışalım', ar: 'هَيّا نَتَعارَف', etk: [
          hafiza('9/arp09.01.1_hafizakarti_1/', 'Harekeler, selamlaşma, sınıf yönergeleri'),
          { tur: 'ek', ad: 'Kelime Oyunları', alt: '1. ünite kelimeleri · Arapça–Türkçe eşleştirme', url: '9/ek_kelime_oyunlari/' },
          { tur: 'ek', ad: 'Harf Yarışı', alt: 'Doğru harfi bul · iki kişilik', url: '9/ek_harf_yarisi/',
            parca: [['Arapca_Harf_Yarisi_Ogretmen_Kilavuzu.pdf', 'Öğretmen kılavuzu (PDF)']] },
          uniteSonu('9/arp09.01_s77_unitesonudeger_1/', 77, [D.harf, D.sirala, D.dinle, D.avi, D.surukle, D.test]) ] },
        { no: 2, ad: 'Okuldayım', ar: 'أَنا في المَدْرَسَة', etk: [
          hafiza('9/arp09.02.1_s93_hafizakarti_1/', 'Sayılar (1–12)', 93),
          hafiza('9/arp09.02.2_s113_hafizakarti_2/', 'Renkler', 113),
          uniteSonu('9/arp09.02_s119_unitesonudeger_2/', 119) ] },
        { no: 3, ad: 'Evdeyim', ar: 'أَنا في البَيْت', etk: [
          hafiza('9/arp09.03.1_s141_hafizakarti_3/', 'Meslekler ve yerler', 141),
          hafiza('9/arp09.03.2_s161_hafizakarti_4/', 'Evin bölümleri ve eşyaları', 161),
          uniteSonu('9/arp09.03_s165_unitesonudeger_3/', 165) ] },
        { no: 4, ad: 'Bir Günüm', ar: 'يَوْم مِن حَياتي', etk: [
          hafiza('9/arp09.04.1_s183_hafizakarti_5/', 'Gün içindeki işler (fiiller)', 183),
          hafiza('9/arp09.04.2_s199_hafizakarti_6/', 'Yiyecek ve içecekler', 199),
          uniteSonu('9/arp09.04_s203_unitesonudeger_4/', 203) ] }
      ]
    },
    10: {
      kitap: 'İHL Arapça 10',
      uniteler: [
        { no: 1, ad: 'Değerlerim', ar: 'قِيَمي', etk: [
          { tur: 'sayfa', ad: 'Boşluk Doldurma', alt: 'Etkinlik 3 · işaret zamirleri', sayfa: 16, url: '10/arp1001_s16_e3_boslukdoldurma_isaretzamirleri/' },
          { tur: 'sayfa', ad: 'Boşluk Doldurma', alt: 'Etkinlik 5 · işaret zamirleri', sayfa: 18, url: '10/arp1001_s18_e5_boslukdoldurma_isaretzamirleri/' },
          { tur: 'sayfa', ad: 'Dinle, Resmi Seç', alt: 'Etkinlik 10 · davranışlar', sayfa: 38, url: '10/arp1001_s38_e10_davranislar/' },
          { tur: 'sayfa', ad: 'Cümle Tamamlama', alt: 'Etkinlik 12 · bayram', sayfa: 42, url: '10/arp1001_s42_e12_cumletamamlama/' },
          hafiza('10/10.1.1_hafizakarti/', 'Aile, meslekler ve yerler'),
          hafiza('10/10.1.2_hafizakarti/', 'Duygular ve güzel davranışlar'),
          { tur: 'ek', ad: 'Harf Avı', alt: 'Klavyede Arapça harf yarışı', url: '10/10.1_harf_avi/' },
          { tur: 'ek', ad: 'Baş Harfe Göre Cevap', alt: 'Alfabe bilmecesi', url: '10/10.1_bas_harf/' },
          uniteSonu('10/unitesonudeger_1/', null, [D.bosluk, D.sirala, D.hafiza, D.avi, D.surukle, D.test]) ] },
        { no: 2, ad: 'Kendimi Keşfediyorum', ar: 'أَكْتَشِف نَفْسي', etk: [
          { tur: 'sayfa', ad: 'Dinle, Resmi Seç', alt: 'Etkinlik 15 · hastalıklar', sayfa: 57, url: '10/arp1002_s57_e15_sestengorsele_hastaliklar/' },
          { tur: 'sayfa', ad: 'Hafıza Kartları', alt: 'Etkinlik 22 · meyve ve sebzeler', sayfa: 73, url: '10/arp1002_s73_e22_hafizakarti/' },
          { tur: 'sayfa', ad: 'Dinle, Resmi Seç', alt: 'Etkinlik 26 · hobiler', sayfa: 89, url: '10/arp1002_s89_e26_sestengorsele_hobiler/' },
          { tur: 'sayfa', ad: 'Test', alt: 'Etkinlik 28 · hobiler', sayfa: 95, url: '10/arp1002_s95_e28_test_hobiler/' },
          hafiza('10/10.2.1_hafizakarti/', 'Vücut, hastalıklar ve yiyecekler'),
          hafiza('10/10.2.2_hafizakarti/', 'Hobiler ve sporlar'),
          uniteSonu('10/unitesonudeger_2/', null, [D.bosluk, D.sirala, D.hafiza, D.avi, D.surukle, D.test]) ] },
        { no: 3, ad: 'Seyahat Etmeyi Seviyorum', ar: 'أُحِبّ السِّياحَة', etk: [
          hafiza('10/10.3.1_hafizakarti/', 'Türkiye’de gezilecek yerler'),
          hafiza('10/10.3.2_hafizakarti/', 'Ulaşım ve yolculuk'),
          uniteSonu('10/unitesonudeger_3/', null, [D.bosluk, D.sirala, D.hafiza, D.avi, D.surukle, D.test]) ] },
        { no: 4, ad: 'Tatile Hazırlanıyorum', ar: 'أَسْتَعِدّ لِلْعُطْلَة', etk: [
          hafiza('10/10.4.1_hafizakarti/', 'Mevsimler ve giysiler'),
          hafiza('10/10.4.2_hafizakarti/', 'Renkler'),
          uniteSonu('10/unitesonudeger_4/', null, [D.bosluk, D.sirala, D.hafiza, D.avi, D.surukle, D.test]) ] }
      ]
    }
  };

  /* =====================================================================
     HTML
     ===================================================================== */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function adres(u) { return KOK + u + (/\/$/.test(u) ? 'index.html' : ''); }
  function klasor(u) { return KOK + u.replace(/[^\/]*$/, ''); }

  function noSvg(n) {
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" style="fill:var(--ihc,#2563EB)"/>' +
      '<text x="16" y="21.4" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">' + n + '</text></svg>';
  }

  function etkHtml(e) {
    var t = TUR[e.tur] || TUR.sayfa, renk = t.renk, ic = (SIMGE[e.tur] || SIMGE.sayfa)(renk);
    var h = '<a class="ke-etk" href="' + esc(adres(e.url)) + '" target="_blank" rel="opener" style="--ket:' + renk + '">' +
      '<span class="ke-ic">' + ic + '</span>' +
      '<span class="ke-metin"><b>' + esc(e.ad) + '</b>' + (e.alt ? '<small>' + esc(e.alt) + '</small>' : '') + '</span>' +
      (e.sayfa ? '<span class="ke-sayfa" title="Kitaptaki sayfası">s. ' + esc(e.sayfa) + '</span>' : '') +
      '<span class="ke-ac" aria-hidden="true">Aç</span></a>';
    if (e.parca && e.parca.length) {
      h += '<div class="ke-parcalar" style="--ket:' + renk + '">' + e.parca.map(function (p) {
        var pdf = /\.pdf$/i.test(p[0]);
        return '<a href="' + esc(klasor(e.url) + p[0]) + '" target="_blank" rel="' + (pdf ? 'noopener' : 'opener') + '"' +
          (pdf ? ' class="ke-pdf"' : '') + '>' + esc(p[1]) + '</a>';
      }).join('') + '</div>';
    }
    return h;
  }

  function uniteHtml(u) {
    var parca = 0;
    u.etk.forEach(function (e) { parca += (e.parca && e.tur !== 'ek') ? e.parca.length : 1; });
    return '<div class="ihdoc-item ke-unite">' +
      '<button type="button" class="ihdoc-head" onclick="ihdocToggle(this)">' +
        '<span class="dok-ic ke-no">' + noSvg(u.no) + '</span>' +
        '<span class="dok-title"><span>' + u.no + '. Ünite · ' + esc(u.ad) + '</span>' +
          (u.ar ? '<bdi dir="rtl" class="ke-ar">' + esc(u.ar) + '</bdi>' : '') + '</span>' +
        '<span class="dok-chip">' + parca + ' etkinlik</span>' +
        '<span class="dok-chevron">▾</span>' +
      '</button>' +
      '<div class="ihdoc-panel"><div class="dok-panel-in">' + u.etk.map(etkHtml).join('') + '</div></div>' +
    '</div>';
  }

  function html(sinif) {
    var k = KITAP[String(sinif)];
    if (!k) return '';
    return '<p class="ke-giris"><b>' + esc(k.kitap) + '</b> ders kitabına giren dijital etkinlikler. ' +
      '<span class="ke-sayfa">s.</span> etkinliğin kitaptaki sayfasıdır; menülü paketlerde her etkinlik ayrıca doğrudan açılır.</p>' +
      '<div class="ke-uniteler">' + k.uniteler.map(uniteHtml).join('') + '</div>';
  }

  /* ---------------- stil (index.css'e dokunulmaz) ---------------- */
  function stilKur() {
    if (document.getElementById('keStil')) return;
    var s = document.createElement('style');
    s.id = 'keStil';
    s.textContent =
      '.ih-kitap{margin:0}' +
      '.ke-giris{margin:0 2px 11px;font-size:.84rem;line-height:1.55;color:#64748b}' +
      '.ke-giris b{color:#0f2a43}' +
      '.ke-uniteler{display:flex;flex-direction:column;gap:9px}' +
      '.ke-unite .dok-title{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px;min-width:0}' +
      '.ke-ar{font-size:1.04em;font-weight:600;color:#64748b;unicode-bidi:isolate}' +
      '.ke-no svg{width:100%;height:100%;display:block}' +
      '.ke-etk{display:flex;align-items:center;gap:11px;text-decoration:none;padding:10px 12px;border:1.4px solid #eef2f6;' +
        'border-radius:11px;margin-top:9px;background:#fff;color:#0f2a43;transition:border-color .18s,box-shadow .18s,transform .18s;' +
        'touch-action:manipulation}' +
      '.ke-etk:hover{border-color:var(--ket);box-shadow:0 4px 12px rgba(15,42,67,.10);transform:translateY(-1px)}' +
      '.ke-etk:focus-visible{outline:3px solid var(--ket);outline-offset:2px}' +
      '.ke-ic{flex:none;width:30px;height:30px}.ke-ic svg{width:100%;height:100%;display:block}' +
      '.ke-metin{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}' +
      '.ke-metin b{font-size:.95rem;font-weight:800}' +
      '.ke-metin small{font-size:.76rem;font-weight:600;color:#7c8b99}' +
      '.ke-sayfa{flex:none;font-size:.7rem;font-weight:800;color:#1D4ED8;background:#E8F0FE;border-radius:6px;padding:2px 7px;white-space:nowrap}' +
      '.ke-ac{flex:none;font-size:.72rem;font-weight:800;color:#fff;background:var(--ket);border-radius:999px;padding:4px 12px}' +
      '.ke-parcalar{display:flex;flex-wrap:wrap;gap:6px;margin:7px 0 3px 41px}' +
      '.ke-parcalar a{font-size:.78rem;font-weight:700;text-decoration:none;color:#334155;background:#f8fafc;' +
        'border:1.2px solid #e5eaf0;border-radius:999px;padding:4px 11px;transition:border-color .15s,color .15s,background .15s;touch-action:manipulation}' +
      '.ke-parcalar a:hover{border-color:var(--ket);color:var(--ket);background:#fff}' +
      '.ke-parcalar a.ke-pdf::before{content:"";display:inline-block;width:7px;height:7px;border-radius:2px;background:#EE5253;margin-right:6px;vertical-align:1px}' +
      '@media (max-width:600px){.ke-etk{padding:9px 10px;gap:9px}.ke-ic{width:26px;height:26px}' +
        '.ke-metin b{font-size:.9rem}.ke-parcalar{margin-left:0}.ke-ac{display:none}}';
    (document.head || document.documentElement).appendChild(s);
  }

  function kur(kok) {
    stilKur();
    var n = 0;
    [].forEach.call((kok || document).querySelectorAll('#imam-hatip .ih-kitap[data-sinif]'), function (m) {
      var kod = html(m.getAttribute('data-sinif'));
      if (!kod) return;
      m.innerHTML = kod; n++;
    });
    return n;
  }

  window.KidefKitapEtkinlik = { veri: KITAP, html: html, kur: kur, adres: adres };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { kur(); });
  else kur();
})();
