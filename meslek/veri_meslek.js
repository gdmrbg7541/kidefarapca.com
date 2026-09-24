/* =====================================================================
   MESLEKLER — oyun verisi                    (meslek/veri_meslek.js)
   ---------------------------------------------------------------------
   16 meslek. Arapça yazımlar UYDURULMADI: 5. sınıfın «الْمِهَن» dersinden
   (muhadese/veri/5_3_2.js) ve yeni 6. sınıf kitabının «اَلْمِهَن»
   dersinden (muhadese/veri/y2627/6_1_2.js) harekeleriyle alındı.

   Alanlar
     id      : iç anahtar
     e / k   : erkek (müzekker) ve kadın (müennes) biçim
     tr      : Türkçe karşılık
     kalip   : vezin — «kalıbın sırrı» modu ve sarf köprüsü için
     yer     : çalıştığı yer (varsa; sitenin kendi kelimesiyle)
     renk    : sahnenin ana rengi
     ikiz    : ة oyununa girer mi?  true = düz «+ة» kuralı işler
               false = kural dışı; oyun bunları SORMAZ, örnek olarak
               gösterir. İki istisna var ve ikisi de gerçek:
                 · مُحامٍ → مُحامِيَة  (nâkıs isim, düz ekleme değil)
                 · رَبَّةُ الْبَيْت    (zaten müennes, erkeği yok)
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefMeslek) return;

  var MESLEKLER = [
    /* ---- 5. sınıf «الْمِهَن» ---- */
    { id: 'ogretmen', e: 'مُعَلِّم',   k: 'مُعَلِّمَة',   tr: 'Öğretmen',
      kalip: 'مُفَعِّل',  yer: 'مَدْرَسَة',   renk: '#2563EB', ikiz: true },
    { id: 'doktor',   e: 'طَبيب',      k: 'طَبيبَة',      tr: 'Doktor',
      kalip: 'فَعيل',     yer: 'مُسْتَشْفى',  renk: '#EE5253', ikiz: true },
    { id: 'muhendis', e: 'مُهَنْدِس',  k: 'مُهَنْدِسَة',  tr: 'Mühendis',
      kalip: 'مُفَعْلِل', yer: '',            renk: '#F39C12', ikiz: true },
    { id: 'memur',    e: 'مُوَظَّف',   k: 'مُوَظَّفَة',   tr: 'Memur',
      kalip: 'مُفَعَّل',  yer: '',            renk: '#0E9E86', ikiz: true },
    { id: 'isci',     e: 'عامِل',      k: 'عامِلَة',      tr: 'İşçi',
      kalip: 'فاعِل',     yer: '',            renk: '#8E44AD', ikiz: true },
    { id: 'tuccar',   e: 'تاجِر',      k: 'تاجِرَة',      tr: 'Tüccar',
      kalip: 'فاعِل',     yer: '',            renk: '#16A085', ikiz: true },
    { id: 'emekli',   e: 'مُتَقاعِد',  k: 'مُتَقاعِدَة',  tr: 'Emekli',
      kalip: 'مُتَفاعِل', yer: '',            renk: '#7F8C8D', ikiz: true },

    /* ---- yeni 6. sınıf «اَلْمِهَن» ---- */
    { id: 'polis',    e: 'شُرْطِيّ',   k: 'شُرْطِيَّة',   tr: 'Polis',
      kalip: 'نِسْبَة',   yer: '',            renk: '#2C3E50', ikiz: true },
    { id: 'hemsire',  e: 'مُمَرِّض',   k: 'مُمَرِّضَة',   tr: 'Hemşire',
      kalip: 'مُفَعِّل',  yer: 'مُسْتَشْفى',  renk: '#E84393', ikiz: true },
    { id: 'asci',     e: 'طَبّاخ',     k: 'طَبّاخَة',     tr: 'Aşçı',
      kalip: 'فَعّال',    yer: 'مَطْبَخ',     renk: '#D35400', ikiz: true },
    { id: 'ciftci',   e: 'فَلّاح',     k: 'فَلّاحَة',     tr: 'Çiftçi',
      kalip: 'فَعّال',    yer: '',            renk: '#27AE60', ikiz: true },
    { id: 'sofor',    e: 'سائِق',      k: 'سائِقَة',      tr: 'Şoför',
      kalip: 'فاعِل',     yer: '',            renk: '#0984E3', ikiz: true },
    /* «Zabıta» değil «Subay»: kitabın kendi kâmûsu (s.199) ضابِط'ı
       Subay diye veriyor ve شُرْطِيّ'yi ayrıca Polis diye yazıyor —
       ikisini bilerek ayırmış. Zabıta bambaşka bir görev. */
    { id: 'subay',    e: 'ضابِط',      k: 'ضابِطَة',      tr: 'Subay',
      kalip: 'فاعِل',     yer: '',            renk: '#555F6B', ikiz: true },
    { id: 'veteriner',e: 'بَيْطَرِيّ', k: 'بَيْطَرِيَّة', tr: 'Veteriner',
      kalip: 'نِسْبَة',   yer: '',            renk: '#00B894', ikiz: true },

    /* ---- ة kuralının İŞLEMEDİĞİ ikisi ---- */
    { id: 'avukat',   e: 'مُحامٍ',     k: 'مُحامِيَة',    tr: 'Avukat',
      kalip: 'مُفاعِل',   yer: '',            renk: '#6C5CE7', ikiz: false,
      not: 'Nâkıs isim: مُحامٍ sonuna düz ة gelmez, önce ي döner.' },
    { id: 'evhanimi', e: '',           k: 'رَبَّةُ الْبَيْت', tr: 'Ev hanımı',
      kalip: 'تَرْكيب',   yer: 'بَيْت',      renk: '#B8577E', ikiz: false,
      not: 'Tamlama hâlinde ve zaten müennes; erkek biçimi yok.' }
  ];

  /* Kalıp → o kalıptaki meslekler. «Kalıbın sırrı» modu bundan beslenir:
     فَعّال'da iki zanaat (طَبّاخ · فَلّاح) yan yana gelince kural görünür. */
  function kalipGruplari() {
    var g = {};
    MESLEKLER.forEach(function (m) { (g[m.kalip] = g[m.kalip] || []).push(m); });
    return g;
  }

  /* ة oyununa girebilecekler — kural dışı ikisi ayıklanır. */
  function ikizler() {
    return MESLEKLER.filter(function (m) { return m.ikiz; });
  }

  function bul(id) {
    for (var i = 0; i < MESLEKLER.length; i++)
      if (MESLEKLER[i].id === id) return MESLEKLER[i];
    return null;
  }

  /* Cümle treni için — 7. sınıfın 3. ünitesindeki gerçek kalıp:
       أَبي تاجِر، هُو يُسافِرُ إِلى أَنْقَرَة بِالطّائِرَة
     Kişi ve araç kelimeleri de o üniteden (muhadese/veri/7_3.js). */
  var KISILER = [
    { ar: 'أَبي',   tr: 'Babam',           cins: 'e', zamir: 'هُوَ' },
    { ar: 'أُمّي',  tr: 'Annem',           cins: 'k', zamir: 'هِيَ' },
    { ar: 'أَخي',   tr: 'Erkek kardeşim',  cins: 'e', zamir: 'هُوَ' },
    { ar: 'أُخْتي', tr: 'Kız kardeşim',    cins: 'k', zamir: 'هِيَ' },
    { ar: 'جَدّي',  tr: 'Dedem',           cins: 'e', zamir: 'هُوَ' },
    { ar: 'عَمّي',  tr: 'Amcam',           cins: 'e', zamir: 'هُوَ' }
  ];
  var ARACLAR = [
    { ar: 'بِالطّائِرَة', tr: 'uçakla',     id: 'ucak' },
    { ar: 'بِالسَّيّارَة', tr: 'arabayla',  id: 'araba' },
    { ar: 'بِالقِطار',    tr: 'trenle',     id: 'tren' },
    { ar: 'بِالسَّفينَة', tr: 'gemiyle',    id: 'gemi' },
    { ar: 'بِالدَّرّاجَة', tr: 'bisikletle', id: 'bisiklet' },
    { ar: 'بِالحافِلَة',  tr: 'otobüsle',   id: 'otobus' }
  ];
  var YERLER = [
    { ar: 'أَنْقَرَة',    tr: 'Ankara' },
    { ar: 'إِسْطَنْبول',  tr: 'İstanbul' },
    { ar: 'بورْصَة',      tr: 'Bursa' },
    { ar: 'إِزْمير',      tr: 'İzmir' }
  ];

  window.KidefMeslek = {
    hepsi: MESLEKLER,
    ikizler: ikizler,
    kalipGruplari: kalipGruplari,
    bul: bul,
    kisiler: KISILER,
    araclar: ARACLAR,
    yerler: YERLER
  };
})();
