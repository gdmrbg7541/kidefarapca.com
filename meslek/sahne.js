/* =====================================================================
   MESLEK SAHNELERİ — canlandırmalı SVG               (meslek/sahne.js)
   ---------------------------------------------------------------------
   Her meslek bir İKON değil, küçük bir SAHNE: doktorun steteskobunda
   nabız atıyor, aşçının tenceresinden buhar çıkıyor, çiftçinin
   toprağından filiz büyüyor. Tahtaya yansıtılacağı için çizgiler kalın
   ve biçimler büyük; arka sıradan da okunsun.

   Canlandırma SMIL ile (<animate>, <animateTransform>): her öge kendi
   canlandırmasını içinde taşır, sınıf adı çakışması olmaz — onlarca
   sahne aynı sayfaya basılabiliyor. CSS ile yapsaydık her sahneye ayrı
   ad uydurmak gerekirdi.

   Ortak ölçü: viewBox 0 0 120 120, nesne ortada, çizgi kalınlığı ~5.

      sahne(id)  -> <svg>…</svg>   (dizge)
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefMeslekSahne) return;

  function svg(ic, renk) {
    return '<svg class="msn" viewBox="0 0 120 120" role="img" aria-hidden="true">' +
           '<circle cx="60" cy="60" r="54" fill="' + renk + '" opacity=".10"/>' + ic + '</svg>';
  }
  /* yinelenen canlandırma kısayolu */
  function an(nit, d, sure, ek) {
    return '<animate attributeName="' + nit + '" values="' + d + '" dur="' + sure +
           's" repeatCount="indefinite"' + (ek || '') + '/>';
  }
  function don(mrk, d, sure, ek) {
    return '<animateTransform attributeName="transform" type="rotate" values="' + d +
           '" dur="' + sure + 's" repeatCount="indefinite"' + (ek || '') + '/>';
  }

  var S = {};

  /* ÖĞRETMEN — tahtaya tebeşirle yazı yazılıyor */
  S.ogretmen = function (r) {
    return svg(
      '<rect x="26" y="30" width="68" height="48" rx="4" fill="#1F3A5F"/>' +
      '<rect x="26" y="30" width="68" height="48" rx="4" fill="none" stroke="' + r + '" stroke-width="4"/>' +
      '<path d="M38 50 h40" stroke="#fff" stroke-width="4" stroke-linecap="round"' +
        ' stroke-dasharray="40" stroke-dashoffset="40">' +
        an('stroke-dashoffset', '40;0;0;40', 3.2) + '</path>' +
      '<path d="M38 62 h26" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".75"' +
        ' stroke-dasharray="26" stroke-dashoffset="26">' +
        an('stroke-dashoffset', '26;26;0;26', 3.2) + '</path>' +
      /* tebeşirlik + ayaklar: bunlar olmayınca pano ekran gibi duruyordu */
      '<rect x="24" y="78" width="72" height="6" rx="3" fill="' + r + '"/>' +
      '<path d="M40 84 l-6 14 M80 84 l6 14" stroke="' + r + '" stroke-width="5" stroke-linecap="round"/>' +
      '<rect x="52" y="86" width="14" height="4" rx="2" fill="#fff" opacity=".9"/>' +
      '<circle cx="86" cy="62" r="5" fill="#FFD166">' + an('cx', '40;86;86;40', 3.2) + '</circle>', r);
  };

  /* DOKTOR — steteskop ve atan nabız çizgisi */
  S.doktor = function (r) {
    return svg(
      '<path d="M42 28 v18 a18 18 0 0 0 36 0 v-18" fill="none" stroke="' + r +
        '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="42" cy="28" r="4.5" fill="' + r + '"/><circle cx="78" cy="28" r="4.5" fill="' + r + '"/>' +
      '<path d="M60 64 v10" stroke="' + r + '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="60" cy="82" r="11" fill="none" stroke="' + r + '" stroke-width="5">' +
        an('r', '11;12.6;11', 1.1) + '</circle>' +
      '<path d="M22 60 h12 l4-9 6 18 5-9 h10" fill="none" stroke="' + r +
        '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"' +
        ' stroke-dasharray="60" stroke-dashoffset="60">' +
        an('stroke-dashoffset', '60;-60', 1.8) + '</path>', r);
  };

  /* MÜHENDİS — birbirini çeviren iki dişli */
  S.muhendis = function (r) {
    function disli(cx, cy, rr, n, yon, sure) {
      var d = '', i, a;
      for (i = 0; i < n; i++) {
        a = 360 / n * i;
        d += '<rect x="' + (cx - 4) + '" y="' + (cy - rr - 7) + '" width="8" height="10" rx="2" fill="' + r +
             '" transform="rotate(' + a + ' ' + cx + ' ' + cy + ')"/>';
      }
      return '<g>' + d + '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" fill="' + r + '"/>' +
             '<circle cx="' + cx + '" cy="' + cy + '" r="' + (rr * 0.42) + '" fill="#fff"/>' +
             don('', (yon > 0 ? '0 ' : '360 ') + cx + ' ' + cy + ';' + (yon > 0 ? '360 ' : '0 ') + cx + ' ' + cy, sure) +
             '</g>';
    }
    return svg(disli(46, 52, 20, 8, 1, 5) + disli(82, 76, 14, 6, -1, 3.5), r);
  };

  /* MEMUR — dosyaya inip kalkan kaşe.
     Kaşe vuruşu döngünün yarısından fazlasında duruyordu; uzaktan
     "donmuş" görünüyordu. Vuruş hızlandırıldı ve kâğıda SÜREKLİ
     beliren mürekkep izi eklendi, sahne hiç ölmüyor. */
  S.memur = function (r) {
    return svg(
      '<rect x="26" y="58" width="68" height="34" rx="5" fill="' + r + '" opacity=".85"/>' +
      '<rect x="26" y="50" width="30" height="10" rx="4" fill="' + r + '"/>' +
      '<rect x="40" y="30" width="40" height="30" rx="3" fill="#fff" stroke="' + r + '" stroke-width="3"/>' +
      '<path d="M47 40 h26" stroke="' + r + '" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>' +
      '<path d="M47 48 h18" stroke="' + r + '" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>' +
      /* onay izi: sürekli beliren/solan mürekkep */
      '<path d="M50 53 l5 5 9-11" fill="none" stroke="#27AE60" stroke-width="4"' +
        ' stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="22">' +
        an('stroke-dashoffset', '22;0;0;22', 1.6) + '</path>' +
      '<g>' + '<rect x="52" y="4" width="16" height="9" rx="2" fill="#2C3E50"/>' +
        '<rect x="56" y="13" width="8" height="10" fill="#2C3E50"/>' +
        '<rect x="48" y="23" width="24" height="7" rx="2" fill="#2C3E50"/>' +
        '<animateTransform attributeName="transform" type="translate"' +
        ' values="0 0;0 16;0 0;0 2;0 0" dur="1.6s" repeatCount="indefinite"' +
        ' keyTimes="0;0.3;0.52;0.62;1"/></g>', r);
  };

  /* İŞÇİ — baret ve sallanan çekiç */
  S.isci = function (r) {
    return svg(
      '<path d="M32 74 a28 24 0 0 1 56 0 Z" fill="' + r + '"/>' +
      '<rect x="26" y="74" width="68" height="9" rx="4.5" fill="' + r + '"/>' +
      '<path d="M60 50 v-14" stroke="' + r + '" stroke-width="5" stroke-linecap="round" opacity=".5"/>' +
      '<g transform="rotate(0 30 34)">' +
        '<rect x="26" y="30" width="34" height="9" rx="3" fill="#8D6E63"/>' +
        '<rect x="14" y="22" width="16" height="25" rx="3" fill="#607D8B"/>' +
        don('', '-28 30 34;16 30 34;-28 30 34', 1.5) + '</g>', r);
  };

  /* TÜCCAR — çizgili tenteli tezgâh ve zıplayan para.
     Önce terazi çizmiştim ama terazi AVUKATIN simgesi; ikisi birbirinin
     aynı çıkıyordu. Tüccara çarşı tezgâhı daha doğru. */
  S.tuccar = function (r) {
    var tente = '', k;
    for (k = 0; k < 6; k++) {
      tente += '<rect x="' + (24 + k * 12) + '" y="30" width="12" height="18" fill="' +
               (k % 2 ? r : '#fff') + '"/>';
    }
    return svg(
      '<g>' + tente + '</g>' +
      '<path d="M24 48 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0" fill="none"' +
        ' stroke="' + r + '" stroke-width="3.4"/>' +
      '<rect x="22" y="26" width="76" height="7" rx="3.5" fill="' + r + '"/>' +
      '<rect x="28" y="70" width="64" height="9" rx="4" fill="' + r + '"/>' +
      '<path d="M34 79 v16 M86 79 v16" stroke="' + r + '" stroke-width="5" stroke-linecap="round"/>' +
      /* tezgâhtaki mallar */
      '<circle cx="46" cy="64" r="6" fill="' + r + '" opacity=".75"/>' +
      '<circle cx="60" cy="64" r="6" fill="' + r + '" opacity=".55"/>' +
      '<circle cx="74" cy="64" r="6" fill="' + r + '" opacity=".75"/>' +
      /* düşüp zıplayan altın */
      '<g><circle cx="60" cy="0" r="7" fill="#F1C40F" stroke="#D4A017" stroke-width="2"/>' +
      '<animateTransform attributeName="transform" type="translate"' +
      ' values="0 8;0 56;0 46;0 56;0 52;0 56" dur="2.2s"' +
      ' keyTimes="0;0.45;0.58;0.72;0.85;1" repeatCount="indefinite"/></g>', r);
  };

  /* EMEKLİ — buharı tüten çay bardağı */
  S.emekli = function (r) {
    function buhar(x, gec) {
      return '<path d="M' + x + ' 42 q6 -8 0 -16 q-6 -8 0 -14" fill="none" stroke="' + r +
             '" stroke-width="3.4" stroke-linecap="round" opacity=".55">' +
             '<animate attributeName="opacity" values="0;.6;0" dur="2.6s" begin="' + gec +
             's" repeatCount="indefinite"/>' +
             '<animateTransform attributeName="transform" type="translate" values="0 6;0 -8"' +
             ' dur="2.6s" begin="' + gec + 's" repeatCount="indefinite"/></path>';
    }
    return svg(
      buhar(50, 0) + buhar(62, .8) + buhar(72, 1.5) +
      '<path d="M42 50 l6 38 a4 4 0 0 0 4 3 h16 a4 4 0 0 0 4-3 l6-38 Z" fill="#C0392B" opacity=".85"/>' +
      '<path d="M42 50 l6 38 a4 4 0 0 0 4 3 h16 a4 4 0 0 0 4-3 l6-38 Z" fill="none" stroke="' + r + '" stroke-width="4"/>' +
      '<rect x="38" y="94" width="44" height="7" rx="3.5" fill="' + r + '"/>', r);
  };

  /* POLİS — kasket ve dönen tepe lambası */
  S.polis = function (r) {
    return svg(
      /* tepe lambası: kırmızı ile mavi arasında gidip geliyor ve
         halkası büyüyor — küçük bir opaklık oynaması uzaktan fark
         edilmiyordu */
      '<circle cx="60" cy="32" r="11" fill="#E74C3C">' +
        '<animate attributeName="fill" values="#E74C3C;#2980B9;#E74C3C" dur="1.1s" repeatCount="indefinite"/>' +
        an('r', '9;12;9', 1.1) + '</circle>' +
      '<circle cx="60" cy="32" r="11" fill="none" stroke="#E74C3C" stroke-width="3">' +
        an('r', '11;22;11', 1.1) + an('opacity', '.7;0;.7', 1.1) + '</circle>' +
      '<path d="M30 76 a30 26 0 0 1 60 0 Z" fill="' + r + '"/>' +
      '<rect x="24" y="76" width="72" height="10" rx="5" fill="' + r + '"/>' +
      '<rect x="50" y="56" width="20" height="14" rx="3" fill="#F1C40F"/>' +
      '<path d="M60 58 l2.6 5.4 5.4.6-4 3.8 1 5.4-5-2.8-5 2.8 1-5.4-4-3.8 5.4-.6 Z" fill="' + r + '"/>', r);
  };

  /* HEMŞİRE — atan kalp ve sağlık haçı.
     DİKKAT: aynı ögeye iki <animateTransform> koyup ikincisini
     additive'siz bırakmak birincisini İPTAL ediyor (ölçek çalışmıyordu).
     Doğrusu: dış <g> merkeze taşınır, iç <g> yalnız ölçeklenir. */
  S.hemsire = function (r) {
    return svg(
      '<g transform="translate(60 62)"><g>' +
      '<path d="M0 26 C-36 0 -30 -28 -14 -28 c8 0 12 5 14 9 2-4 6-9 14-9 16 0 22 28-14 54 Z" fill="' + r + '"/>' +
      /* Kızılay'ın simgesi hilâl; haç yerine o konuldu.
         Hilâl iki yayla çizilir: dış yay bir yönde, geri dönüş yayı
         daha büyük yarıçapla ters yönde — aradaki fark ay'ı doğurur. */
      '<path d="M3.48 -14.96 A 15 15 0 1 0 3.48 12.96 A 14 14 0 0 1 3.48 -14.96 Z" fill="#fff"/>' +
      '<animateTransform attributeName="transform" type="scale" values="1;1.12;1;1.06;1"' +
      ' dur="1.3s" repeatCount="indefinite"/>' +
      '</g></g>', r);
  };

  /* AŞÇI — kaynayan tencere, buhar ve kepçe */
  S.asci = function (r) {
    function buhar(x, gec) {
      return '<path d="M' + x + ' 44 q7 -9 0 -18" fill="none" stroke="' + r +
             '" stroke-width="3.6" stroke-linecap="round">' +
             '<animate attributeName="opacity" values="0;.75;0" dur="2.2s" begin="' + gec +
             's" repeatCount="indefinite"/>' +
             '<animateTransform attributeName="transform" type="translate" values="0 8;0 -10"' +
             ' dur="2.2s" begin="' + gec + 's" repeatCount="indefinite"/></path>';
    }
    return svg(
      buhar(48, 0) + buhar(60, .7) + buhar(72, 1.4) +
      '<rect x="30" y="58" width="60" height="30" rx="7" fill="' + r + '"/>' +
      '<rect x="24" y="52" width="72" height="9" rx="4.5" fill="' + r + '"/>' +
      '<rect x="18" y="66" width="10" height="7" rx="3" fill="' + r + '" opacity=".75"/>' +
      '<rect x="92" y="66" width="10" height="7" rx="3" fill="' + r + '" opacity=".75"/>' +
      '<g>' + '<path d="M78 50 v-18" stroke="#8D6E63" stroke-width="4" stroke-linecap="round"/>' +
        '<circle cx="78" cy="30" r="6" fill="#B0BEC5"/>' +
        don('', '-16 78 56;16 78 56;-16 78 56', 2.4) + '</g>', r);
  };

  /* ÇİFTÇİ — topraktan büyüyen filiz, güneş.
     Filiz TABANINDAN büyümeli: dış <g> kökü (60,84) noktasına taşır,
     iç <g> oradan yukarı doğru ölçeklenir. */
  S.ciftci = function (r) {
    return svg(
      '<circle cx="90" cy="30" r="11" fill="#F1C40F">' + an('r', '11;12.6;11', 2.4) + '</circle>' +
      '<rect x="18" y="82" width="84" height="16" rx="5" fill="#8D6E63"/>' +
      '<g transform="translate(60 84)"><g>' +
      '<path d="M0 0 v-30" stroke="' + r + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M0 -20 q-16 -4 -18 -18 q16 0 18 18 Z" fill="' + r + '"/>' +
      '<path d="M0 -28 q16 -4 18 -18 q-16 0 -18 18 Z" fill="' + r + '" opacity=".8"/>' +
      '<animateTransform attributeName="transform" type="scale" values="0.25;1;1;0.25"' +
      ' dur="3.6s" repeatCount="indefinite" keyTimes="0;0.4;0.85;1"/>' +
      '</g></g>', r);
  };

  /* ŞOFÖR — dönen direksiyon, akan yol */
  S.sofor = function (r) {
    return svg(
      /* yol çizgileri sola akıyor: bir aralık (24) kaydırınca desen
         kendini tekrarlıyor, böylece dönüş dikişsiz görünüyor */
      '<path d="M16 96 h14 M40 96 h14 M64 96 h14 M88 96 h14" stroke="' + r +
        '" stroke-width="5" stroke-linecap="round" opacity=".45">' +
        '<animateTransform attributeName="transform" type="translate" values="24 0;0 0"' +
        ' dur="0.7s" repeatCount="indefinite"/></path>' +
      '<g>' +
      '<circle cx="60" cy="52" r="30" fill="none" stroke="' + r + '" stroke-width="7"/>' +
      '<circle cx="60" cy="52" r="9" fill="' + r + '"/>' +
      '<path d="M60 43 v-20 M52 58 l-18 14 M68 58 l18 14" stroke="' + r +
        '" stroke-width="6" stroke-linecap="round"/>' +
      don('', '-14 60 52;14 60 52;-14 60 52', 2.8) + '</g>', r);
  };

  /* SUBAY — apolet ve rütbe yıldızları.
     Önce kasket çizmiştim, polisin kasketiyle neredeyse aynı görünüyordu;
     rütbe apoleti hem ayırt edici hem doğru simge. */
  S.subay = function (r) {
    function yildiz(cx, cy, b, gec) {
      var d = 'M' + cx + ' ' + (cy - b) + ' l' + (b * .32) + ' ' + (b * .66) + ' l' + (b * .72) + ' ' +
              (b * .1) + ' l-' + (b * .52) + ' ' + (b * .5) + ' l' + (b * .14) + ' ' + (b * .72) +
              ' l-' + (b * .66) + '-' + (b * .35) + ' l-' + (b * .66) + ' ' + (b * .35) +
              ' l' + (b * .14) + '-' + (b * .72) + ' l-' + (b * .52) + '-' + (b * .5) +
              ' l' + (b * .72) + '-' + (b * .1) + ' Z';
      return '<path d="' + d + '" fill="#F1C40F">' +
             '<animate attributeName="opacity" values=".35;1;.35" dur="2.4s" begin="' + gec +
             's" repeatCount="indefinite"/></path>';
    }
    return svg(
      '<path d="M34 26 h52 a6 6 0 0 1 6 6 l-6 58 a8 8 0 0 1-8 7 h-36 a8 8 0 0 1-8-7 l-6-58 a6 6 0 0 1 6-6 Z"' +
        ' fill="' + r + '"/>' +
      '<rect x="30" y="26" width="60" height="9" rx="4.5" fill="#2C3E50"/>' +
      yildiz(60, 50, 11, 0) + yildiz(60, 70, 11, .35) + yildiz(60, 88, 11, .7), r);
  };

  /* VETERİNER — pati ve atan kalp (aynı ölçek düzeltmesi) */
  S.veteriner = function (r) {
    return svg(
      '<ellipse cx="60" cy="72" rx="20" ry="17" fill="' + r + '"/>' +
      '<ellipse cx="38" cy="52" rx="8" ry="10" fill="' + r + '"/>' +
      '<ellipse cx="53" cy="42" rx="8" ry="10.5" fill="' + r + '"/>' +
      '<ellipse cx="70" cy="42" rx="8" ry="10.5" fill="' + r + '"/>' +
      '<ellipse cx="84" cy="54" rx="8" ry="10" fill="' + r + '"/>' +
      '<g transform="translate(60 70)"><g>' +
      '<path d="M0 10 C-12 0 -10-10 -4-10 c3 0 4 2 4 3 0-1 1-3 4-3 6 0 8 10-4 20 Z" fill="#fff"/>' +
      '<animateTransform attributeName="transform" type="scale" values="1;1.22;1"' +
      ' dur="1.1s" repeatCount="indefinite"/>' +
      '</g></g>', r);
  };

  /* AVUKAT — adalet terazisi */
  S.avukat = function (r) {
    return svg(
      '<path d="M60 22 v66" stroke="' + r + '" stroke-width="5" stroke-linecap="round"/>' +
      '<rect x="40" y="88" width="40" height="8" rx="4" fill="' + r + '"/>' +
      '<g>' +
      '<path d="M24 34 h72" stroke="' + r + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M24 34 v10 M96 34 v10" stroke="' + r + '" stroke-width="3.4"/>' +
      '<path d="M12 44 a12 12 0 0 0 24 0 Z" fill="' + r + '" opacity=".85"/>' +
      '<path d="M84 44 a12 12 0 0 0 24 0 Z" fill="' + r + '" opacity=".85"/>' +
      don('', '-9 60 34;9 60 34;-9 60 34', 3.4) + '</g>' +
      '<circle cx="60" cy="22" r="6" fill="' + r + '"/>', r);
  };

  /* EV HANIMI — demlikten bardağa süzülen çay.
     İlk çizimde akıntı demlikten kopuktu; şimdi emzikten bardağa
     kesintisiz iniyor ve bardak doluyor. */
  S.evhanimi = function (r) {
    return svg(
      '<path d="M26 40 h40 l-4 26 a8 8 0 0 1-8 7 h-16 a8 8 0 0 1-8-7 Z" fill="' + r + '"/>' +
      '<rect x="22" y="34" width="48" height="8" rx="4" fill="' + r + '"/>' +
      '<rect x="40" y="22" width="10" height="12" rx="3" fill="' + r + '" opacity=".8"/>' +
      '<path d="M66 46 q14 2 16 14" fill="none" stroke="' + r + '" stroke-width="6" stroke-linecap="round"/>' +
      /* akıntı: kesikli çizginin kayması çayı SÜREKLİ akıtır.
         Önce dasharray'i 0->18 büyütüyordum; döngünün yarısından
         sonra sabit kaldığı için akış durmuş gibi görünüyordu. */
      '<path d="M83 58 v20" stroke="#C0392B" stroke-width="5" stroke-linecap="round" opacity=".9"' +
        ' stroke-dasharray="5 4">' +
        '<animate attributeName="stroke-dashoffset" values="9;0" dur="0.5s" repeatCount="indefinite"/>' +
        '</path>' +
      /* bardak + dolan çay */
      '<path d="M72 78 l3 20 a4 4 0 0 0 4 3 h8 a4 4 0 0 0 4-3 l3-20 Z" fill="#fff" stroke="' + r +
        '" stroke-width="3.6"/>' +
      '<path d="M74 88 l1.6 10 a4 4 0 0 0 4 3 h8 a4 4 0 0 0 4-3 l1.6-10 Z" fill="#C0392B" opacity=".85">' +
        '<animate attributeName="opacity" values=".25;.85;.25" dur="2.6s" repeatCount="indefinite"/></path>', r);
  };

  /* --------------------------------------------------------------- */
  function sahne(id, renk) {
    var f = S[id];
    return f ? f(renk || '#444') :
      '<svg class="msn" viewBox="0 0 120 120" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="54" fill="' + (renk || '#444') + '" opacity=".10"/>' +
      '<circle cx="60" cy="60" r="26" fill="none" stroke="' + (renk || '#444') + '" stroke-width="6"/></svg>';
  }

  window.KidefMeslekSahne = { sahne: sahne, liste: Object.keys(S) };
})();
