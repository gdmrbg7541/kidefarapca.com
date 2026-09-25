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
   Etkinlikler AYRI BİR AKORDİYON BÖLÜMÜ DEĞİL, sınıfın kart ızgarasında
   («N. Sınıf Etkinlikleri» → .ih-kartlar[data-sinif=N]) bir KARTTIR.
   Kart sistem/sinifmodul.js kayıtçısına yazılır (dugme:true), tıklanınca
   ünite listesi kartın ALTINDA açılır — Muhâdese kartındaki düzen.
   Ünite satırları sınıf dökümanlarıyla aynı akordiyon sınıflarını
   (ihdoc-item / ihdocToggle) kullanır; açılıp kapanma index.html'den.

   7. sınıfın İKİ kitabı olduğu için (bkz. sistem/sinifveri.js → VERI_YILI)
   kart yalnız KITAP[7].yil ile seçili yıl aynıyken basılır; kitap
   seçilince kart belirme animasyonuyla girer (gorunurMu → belir).

   Etkinlik bağlantıları YENİ SEKMEDE açılır (25.09.2026, Geylani:
   "her dosya müstakil olacak"). Paketlerin kendi geri tuşu o sekmede
   siteye dönemiyordu; sekmenin ilk sayfasındayken geri tuşu artık
   SEKMEYİ KAPATIYOR — bunu sistem/etkinlik-kapat.js yapıyor, her etkinlik
   dosyasının sonuna eklendi (paketlerin kendi kodu değişmedi).

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
  var KRENK = '#4F46E5';          /* kartın ve panelin rengi (kitap = indigo) */

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
      /* Bu etkinlikler MEB'in 2027-2028'de okutulacak 7. sınıf kitabına
         (Maarif Modeli) girmiştir. 7. sınıfın İKİ kitabı olduğu için
         (bkz. sistem/sinifveri.js → VERI_YILI) bölüm yalnız bu kitap
         seçiliyken görünür; Mektep Yayınları 2026-2027 seçiliyken gizlenir. */
      yil: '2027-2028',
      uniteler: [
        { no: 1, ad: 'Bugün Ne Yaptım?', ar: 'ماذا فَعَلْتُ اليَوْم؟', etk: [
          oyunlar('7/unite_1_oyunlar/', [O.yaz, O.kelime, O.ses, O.evet, O.hafiza, O.zamir, O.saat]),
          uniteSonu('7/unitesonudeger_1/') ] },
        { no: 2, ad: 'Alışveriş Zamanı', ar: 'وَقْت التَّسَوُّق', etk: [
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
      /* KAPALI (25.09.2026, Geylani: "10. sınıf kitap etkinliklerini iptal et").
         Paketler siteye hiç kopyalanmamıştı: kitapetkinlikleri/10/ boştu,
         karttaki bağlantıların tamamı 404 veriyordu. Dosyalar MEB klasöründe
         duruyor; kopyalanınca bu satırı silmek kartı geri getirir. */
      kapali: true,
      /* Bu etkinlikler 10. sınıfın ZORUNLU (Maarif) Arapça kitabına girmiştir.
         10. sınıfın iki kitabı var (bkz. sistem/sinifveri.js → VERI_YILI);
         «Seçmeli Arapça» seçiliyken bu bölüm gizlenir, çünkü o kitabın
         üniteleri başkadır. 24.09.2026'da eklendi: önceden yıl süzgeci yoktu,
         seçmeli kitaptayken Maarif kitabının etkinlikleri görünüyordu. */
      yil: '2026-2027',
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
        { no: 3, ad: 'Seyahat Etmeyi Seviyorum', ar: 'أُحِبّ السِّياحَة', etk: [
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
    /* YENİ SEKMEDE AÇILIR (25.09.2026): her etkinlik müstakil bir sekme.
       rel="opener" bilerek: etkinlik sayfası açan sekmeye erişebilsin. */
    var h = '<a class="ke-etk" target="_blank" rel="opener" href="' + esc(adres(e.url)) + '" style="--ket:' + renk + '">' +
      '<span class="ke-ic">' + ic + '</span>' +
      '<span class="ke-metin"><b>' + esc(e.ad) + '</b>' + (e.alt ? '<small>' + esc(e.alt) + '</small>' : '') + '</span>' +
      (e.sayfa ? '<span class="ke-sayfa" title="Kitaptaki sayfası">s. ' + esc(e.sayfa) + '</span>' : '') +
      '<span class="ke-ac" aria-hidden="true">Aç</span></a>';
    if (e.parca && e.parca.length) {
      h += '<div class="ke-parcalar" style="--ket:' + renk + '">' + e.parca.map(function (p) {
        var pdf = /\.pdf$/i.test(p[0]);
        return '<a target="_blank" rel="opener" href="' + esc(klasor(e.url) + p[0]) + '"' +
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
      /* ---------------- kart ---------------- */
      '.ke-kart{position:relative}' +
      '.ke-kart .ke-chevron{display:block;margin-top:7px;font-size:.95rem;line-height:1;color:#5f7286;transition:transform .32s ease}' +
      '.ke-kart.acik .ke-chevron{transform:rotate(180deg)}' +
      /* Açık kart: panelin hangi karta ait olduğu belli olsun diye halka +
         boyalı zemin, ötekiler soluyor (Muhâdese kartıyla aynı dil). */
      '.ke-kart.acik{border-color:#3730A3;box-shadow:0 0 0 3px rgba(79,70,229,.22),0 12px 26px rgba(55,48,163,.26)}' +
      '#imam-hatip .ih-kartlar .game-grid button.ke-kart.acik{background:linear-gradient(180deg,#EDEEFF 0%,#fff 72%)}' +
      '#imam-hatip .ih-kartlar.ke-acik .game-grid .game-card:not(.ke-kart){opacity:.5;filter:saturate(.5)}' +
      '#imam-hatip .ih-kartlar.ke-acik .game-grid .game-card:not(.ke-kart):hover,' +
      '#imam-hatip .ih-kartlar.ke-acik .game-grid .game-card:not(.ke-kart):focus-visible{opacity:1;filter:none}' +
      /* Kart ikonu: sayfa satırları sırayla beliriyor, oynat düğmesi nefes alıyor */
      '.ke-kart .kea-satir{animation:keSatir 3.2s ease-in-out infinite}' +
      '.ke-kart .kea-satir.s2x{animation-delay:.32s}.ke-kart .kea-satir.s3x{animation-delay:.64s}' +
      '@keyframes keSatir{0%,100%{opacity:.25}45%,65%{opacity:1}}' +
      '.ke-kart .kea-oyna{transform-origin:43px 30px;animation:keOyna 3.2s ease-in-out infinite}' +
      '@keyframes keOyna{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}' +
      /* ---------------- belirme (kitap seçilince) ----------------
         Geylani: "maarif seçilince farkedilsin". Kart aşağıdan süzülüp
         gelir, sonra iki kez halkalanır. */
      '.ke-kart.ke-belir{animation:keBelir .62s cubic-bezier(.22,1,.36,1) both,keHalka 1.15s ease-out .25s 2}' +
      '@keyframes keBelir{0%{opacity:0;transform:translateY(16px) scale(.93)}' +
        '60%{opacity:1;transform:translateY(-3px) scale(1.03)}100%{opacity:1;transform:none}}' +
      '@keyframes keHalka{0%{box-shadow:0 0 0 0 rgba(79,70,229,.55)}' +
        '70%{box-shadow:0 0 0 15px rgba(79,70,229,0)}100%{box-shadow:0 0 0 0 rgba(79,70,229,0)}}' +
      /* ---------------- kartın altında açılan panel ---------------- */
      '.ke-panel{max-height:0;overflow:hidden;transition:max-height .34s cubic-bezier(.4,0,.2,1)}' +
      '.ke-panel-in{position:relative;margin-top:13px;padding:13px 15px 15px;' +
        'border:1.8px solid #C3C8F7;border-radius:14px;background:linear-gradient(180deg,#F6F7FF 0%,#fff 62%)}' +
      /* Ok — panelin tepesinden kartı gösterir; kartın ızgaradaki yeri
         sınıfa göre değiştiği için okHizala() ölçüp --ke-ok'a yazar. */
      '.ke-panel-in::before{content:"";position:absolute;top:-8px;left:var(--ke-ok,50%);width:15px;height:15px;' +
        'transform:translateX(-50%) rotate(45deg);background:#F6F7FF;' +
        'border-left:1.8px solid #C3C8F7;border-top:1.8px solid #C3C8F7;border-radius:3px 0 0 0}' +
      '.ke-panel-bas{display:flex;align-items:center;gap:13px;padding:11px 14px;margin:0 0 11px;border-radius:12px;' +
        'background:linear-gradient(90deg,#E7E9FF 0%,#F7F8FF 76%);border:1.6px solid #C3C8F7}' +
      '.ke-panel-ik{flex:none;width:40px;height:40px}.ke-panel-ik svg{width:100%;height:100%;display:block;overflow:visible}' +
      '.ke-panel-ad{flex:1;min-width:0;font-size:1.22rem;font-weight:800;color:#312E81;line-height:1.25}' +
      '.ke-panel-ad b{color:#4F46E5}' +
      '.ke-panel-say{flex:none;font-size:.82rem;font-weight:800;letter-spacing:.3px;white-space:nowrap;' +
        'color:#312E81;background:#fff;border:1.5px solid #B4BAF5;border-radius:999px;padding:6px 14px}' +
      '@media (max-width:600px){.ke-etk{padding:9px 10px;gap:9px}.ke-ic{width:26px;height:26px}' +
        '.ke-metin b{font-size:.9rem}.ke-parcalar{margin-left:0}.ke-ac{display:none}' +
        '.ke-panel-in{padding:10px 11px 12px;margin-top:11px}.ke-panel-in::before{display:none}' +
        '.ke-panel-bas{padding:9px 11px;gap:10px}.ke-panel-ik{width:32px;height:32px}' +
        '.ke-panel-ad{font-size:1.02rem}.ke-panel-say{font-size:.72rem;padding:5px 11px}}' +
      '@media (prefers-reduced-motion:reduce){.ke-kart.ke-belir{animation:none}' +
        '.ke-kart .kea-satir,.ke-kart .kea-oyna{animation:none}.ke-kart .kea-satir{opacity:1}}';
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------------- öğretim yılı (kitap) süzgeci ----------------
     KITAP[sınıf].yil doluysa etkinlikler o yılın kitabına aittir; başka
     kitap seçiliyken bölüm gizlenir. Yıl bilgisi yoksa (5, 9, 10 …) her
     zaman görünür — eski davranış. */
  function gorunurMu(sinif) {
    var k = KITAP[String(sinif)];
    if (!k) return false;
    if (k.kapali) return false;          /* dosyaları sitede olmayan sınıf */
    if (!k.yil) return true;
    var v = window.KidefSinifVeri;
    if (!v || !v.seciliVeriYili) return true;
    var y = v.seciliVeriYili(sinif);
    return !y || y.yil === k.yil;
  }

  /* =====================================================================
     KART + KARTIN ALTINDA AÇILAN PANEL
     ===================================================================== */

  function etkSayisi(sinif) {
    var k = KITAP[String(sinif)], n = 0;
    if (!k) return 0;
    k.uniteler.forEach(function (u) {
      u.etk.forEach(function (e) { n += (e.parca && e.tur !== 'ek') ? e.parca.length : 1; });
    });
    return n;
  }

  /* Kart ikonu (64×64): açık kitap + oynat düğmesi — bölüm ikonunun büyüğü. */
  function kartSvg() {
    return '<svg viewBox="0 0 64 64" class="kg" aria-hidden="true">' +
      '<path d="M32 16c-6-4.2-13-5.4-20-3.8v31.4c7-1.6 14-.4 20 3.8" fill="#EEF2FF" stroke="' + KRENK + '" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="M32 16c6-4.2 13-5.4 20-3.8v31.4c-7-1.6-14-.4-20 3.8" fill="#fff" stroke="' + KRENK + '" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="M32 16v31.4" stroke="' + KRENK + '" stroke-width="2.2"/>' +
      '<g stroke="#A5B4FC" stroke-width="2.1" stroke-linecap="round">' +
        '<path class="kea-satir" d="M17 26h9"/><path class="kea-satir s2x" d="M17 32h11"/>' +
        '<path class="kea-satir s3x" d="M17 38h8"/></g>' +
      '<g class="kea-oyna"><circle cx="43" cy="30" r="8.8" fill="#F39C12"/>' +
        '<path d="M40.3 25.4 47.8 30l-7.5 4.6z" fill="#fff"/></g>' +
      '</svg>';
  }

  function panelHtml(sinif) {
    var k = KITAP[String(sinif)];
    if (!k) return '';
    return '<div class="ke-panel-in">' +
      '<div class="ke-panel-bas">' +
        '<span class="ke-panel-ik">' + kartSvg() + '</span>' +
        '<span class="ke-panel-ad">Kitap Etkinlikleri <b>' + esc(sinif) + '. Sınıf</b></span>' +
        '<span class="ke-panel-say">' + k.uniteler.length + ' ünite · ' + etkSayisi(sinif) + ' etkinlik</span>' +
      '</div>' + html(sinif) + '</div>';
  }

  /* Panel, kart ızgarasının ALTINDA tam genişlikte kardeştir; ilk tıklamada
     kurulur. Izgara yeniden yazıldığında (kitap değişince) silinir. */
  function panelBul(mount, olustur) {
    var c = mount.children, i, p = null;
    for (i = 0; i < c.length; i++)
      if (c[i].classList && c[i].classList.contains('ke-panel')) { p = c[i]; break; }
    if (p || !olustur) return p;
    var kod = panelHtml(mount.getAttribute('data-sinif'));
    if (!kod) return null;
    p = document.createElement('div');
    p.className = 'ke-panel';
    p.innerHTML = kod;
    mount.appendChild(p);
    return p;
  }
  function panelSil(mount) {
    var p = panelBul(mount, false);
    if (p && p.parentNode) p.parentNode.removeChild(p);
    mount.classList.remove('ke-acik');
  }

  /* --- açılış/kapanış (index.html'deki panelAc/panelKapat'ın eşi; o
         işlevler oradaki kapalı kutuda, buradan görünmüyor) --- */
  function acilisSil(p) {
    if (!p || !p.__keAc) return;
    p.removeEventListener('transitionend', p.__keAc);
    p.removeEventListener('transitioncancel', p.__keAc);
    p.__keAc = null;
  }
  function panelAc(p) {
    if (!p) return;
    acilisSil(p);
    p.style.maxHeight = p.scrollHeight + 'px';
    var f = function (e) {
      if (e.target !== p || e.propertyName !== 'max-height') return;
      acilisSil(p);
      if (p.style.maxHeight === '0px') return;        /* bu arada kapandı */
      p.style.maxHeight = 'none';                     /* ünite açılınca kırpılmasın */
    };
    p.__keAc = f;
    p.addEventListener('transitionend', f);
    p.addEventListener('transitioncancel', f);
  }
  function panelKapat(p) {
    if (!p) return;
    acilisSil(p);
    if (getComputedStyle(p).maxHeight === 'none') { p.style.maxHeight = p.scrollHeight + 'px'; void p.offsetHeight; }
    p.style.maxHeight = '0px';
  }
  /* Üstteki sınıf panelleri ölçülü yükseklikteyse büyüyen içerik kırpılır. */
  function ustSerbest(el) {
    var p = el.parentNode;
    while (p && p.nodeType === 1) {
      if (p.classList && (p.classList.contains('ih-panel') || p.classList.contains('ihsec-panel'))) {
        var m = p.style.maxHeight;
        if (m && m !== 'none' && m !== '0px') p.style.maxHeight = 'none';
      }
      p = p.parentNode;
    }
  }
  /* Panelin oku kartın ortasını gösterir (kartın sırası sınıfa göre değişir). */
  function okHizala(mount) {
    var kart = mount.querySelector('.ke-kart'), ic = mount.querySelector('.ke-panel-in');
    if (!kart || !ic) return;
    var k = kart.getBoundingClientRect(), p = ic.getBoundingClientRect();
    if (!p.width || !k.width) return;
    var x = (k.left + k.width / 2) - p.left;
    x = Math.max(26, Math.min(p.width - 26, x));
    ic.style.setProperty('--ke-ok', x.toFixed(1) + 'px');
  }
  window.addEventListener('resize', function () {
    clearTimeout(window.__keOkZaman);
    window.__keOkZaman = setTimeout(function () {
      [].forEach.call(document.querySelectorAll('.ih-kartlar.ke-acik'), okHizala);
    }, 140);
  });

  /* Kart tıklanınca: liste kartın altında açılır, sayfa değişmez. */
  window.keKartTik = function (btn) {
    var mount = btn.closest ? btn.closest('.ih-kartlar') : null;
    if (!mount) return;
    var p = panelBul(mount, true);
    if (!p) return;
    var aciliyor = !btn.classList.contains('acik');
    /* Muhâdese listesi açıksa kapanır: iki panel birden açıkken kartlar
       iki kez soluyor, hangi panelin kime ait olduğu karışıyor. */
    if (aciliyor && window.mhToggle) {
      var mh = mount.querySelector('.mh-kart.acik');
      if (mh) { try { window.mhToggle(mh); } catch (e) {} }
    }
    btn.classList.toggle('acik', aciliyor);
    btn.setAttribute('aria-expanded', aciliyor ? 'true' : 'false');
    mount.classList.toggle('ke-acik', aciliyor);
    if (aciliyor) { ustSerbest(p); okHizala(mount); panelAc(p); }
    else panelKapat(p);
  };

  /* --- belirme: kitap seçilince kart farkedilsin --- */
  function belir(kart) {
    if (!kart) return;
    kart.classList.remove('ke-belir');
    void kart.offsetWidth;                       /* animasyon baştan başlasın */
    kart.classList.add('ke-belir');
    var bitir = function (e) {
      if (e && e.animationName && e.animationName !== 'keHalka') return;
      kart.classList.remove('ke-belir');
      kart.removeEventListener('animationend', bitir);
    };
    kart.addEventListener('animationend', bitir);
    setTimeout(function () { bitir(); }, 2800);   /* hareket kapalıysa da temizlensin */
  }

  /* --- kartı kayıtçıya yaz (sistem/sinifmodul.js) --- */
  function kartKur() {
    var M = window.KidefSinifModul;
    if (!M || kartKur.kuruldu) return;
    kartKur.kuruldu = 1;
    M.ekle({
      id: 'kitapetkinlik',
      ad: 'Kitap Etkinlikleri',
      sira: 5,            /* ızgaranın başı: kitabın kendi etkinlikleri, kitapla birlikte gelir */
      renk: KRENK,
      dugme: true, tikla: 'keKartTik', eksinif: 'ke-kart',
      ekic: function () { return '<span class="ke-chevron">▾</span>'; },
      svg: kartSvg,
      aciklama: function (s) { return 'Ders kitabındaki dijital etkinlikler — ' + s + '. Sınıf'; },
      /* Kitabı olmayan sınıfta ve başka kitap seçiliyken kart hiç basılmaz */
      veriVar: function (s) {
        if (!KITAP[String(s)] || !gorunurMu(s)) return null;
        return { rozet: etkSayisi(s) + ' Etkinlik' };
      },
      url: function () { return '#'; }
    });
  }

  /* Eski düzen: ayrı bölümdeki <div class="ih-kitap"> kutusu. index.html'de
     kalmadı; başka bir sayfada kullanılırsa çalışmaya devam etsin diye
     duruyor. */
  function eskiKutu(m) {
    var sinif = m.getAttribute('data-sinif');
    var bolum = m.closest ? m.closest('.ihsec-item') : null;
    if (!gorunurMu(sinif)) { m.innerHTML = ''; if (bolum) bolum.style.display = 'none'; return 0; }
    if (bolum) bolum.style.display = '';
    var kod = html(sinif);
    if (!kod) return 0;
    m.innerHTML = kod;
    return 1;
  }

  function kur(kok) {
    stilKur(); kartKur();
    var alan = kok || document, n = 0;
    [].forEach.call(alan.querySelectorAll('#imam-hatip .ih-kitap[data-sinif]'), function (m) { n += eskiKutu(m); });
    /* Kartı normalde index.html'deki ızgara kurulumu basar; basılmadıysa
       (örn. modül bu dosyadan sonra yüklendiyse) burada tamamlanır. */
    var M = window.KidefSinifModul;
    if (M) [].forEach.call(alan.querySelectorAll('#imam-hatip .ih-kartlar[data-sinif]'), function (m) {
      var s = m.getAttribute('data-sinif');
      if (!KITAP[String(s)] || !gorunurMu(s) || m.querySelector('.ke-kart')) return;
      M.yerlestir(m, s); n++;
    });
    return n;
  }

  window.KidefKitapEtkinlik = {
    veri: KITAP, html: html, kur: kur, adres: adres,
    gorunurMu: gorunurMu, etkSayisi: etkSayisi
  };

  /* Kitap seçicisi değişince kartlar yeniden basılıyor: bu olayın
     dinleyicileri sırayla çalışır, sinifmodul.js ve index.html'deki
     ızgara kurulumu BİZDEN ÖNCE bağlı — iş sıraya alınıyor (setTimeout 0),
     o zamana kadar ızgara yerine oturmuş olur. */
  document.addEventListener('kidef:veriyili', function (e) {
    var n = e && e.detail ? String(e.detail.sinif) : '';
    if (!n) return;
    setTimeout(function () {
      [].forEach.call(document.querySelectorAll('#imam-hatip .ih-kartlar[data-sinif="' + n + '"]'), function (m) {
        panelSil(m);                    /* içerik kitaba göre değişir, yeniden kurulur */
        belir(m.querySelector('.ke-kart'));
      });
      [].forEach.call(document.querySelectorAll('#imam-hatip .ih-kitap[data-sinif="' + n + '"]'), eskiKutu);
    }, 0);
  });

  stilKur(); kartKur();          /* kart ızgara kurulmadan ÖNCE kayıtlı olmalı */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { kur(); });
  else kur();
})();
