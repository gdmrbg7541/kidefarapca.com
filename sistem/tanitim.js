/* =====================================================================
   KİDEF · TANITIM                       (sistem/tanitim.js)
   ---------------------------------------------------------------------
   Öğretmen (07.10.2026):
     "sitede sosyal kısımda beni tanıtan bi yazı ekleyelim, sosyal popup
      açıldığında Geylani Demirbağ yazsın, oraya tıklayınca temel
      bilgilerim görünsün."
     "amacım bu bilgileri ilk derste açıp öğrencilere kendimi tanıtmak,
      çok büyük olsun ve hazırladıklarım da ben dili olmasın."
     "2024 ten beri Kitap Yazım Komisyonunda olduğum bilgisi de olsun."
     — sonra düzeltti: "kitap yazım komisyonunda 2025 te başladım".
     "arapça öğretmeninin altında site ismi yazmasın, 15 ekim 2018 de
      öğretmenliğe başladım, yıl ay ve gün olarak sürekli hesaplanan bi
      şey ekle, renklerde site renkleri kullan — turuncu, yeşil, site
      mavisi vs. Çok fazla konteynır tasarımı, kutu tasarımı olmasın."

   BU YÜZDEN İKİ KATMAN
   1) «Sosyal Hesaplar» başlığının altında küçük bir satır: yuvarlak
      içinde baş harfler + "Geylani Demirbağ". Pencereyi açanın gözünü
      yormuyor.
   2) Basınca ekranın ORTASINDA büyük bir kart açılıyor. Öğretmen
      (07.10.2026): "ismime basınca ekranın merkezinde tam ekran olmayan
      bi overlay olsun, ama büyük olsun, dikey scroll olsun."
      Tam ekran değil: arkası görünüyor, sayfadan kopmuyor. Yine de iri —
      tahtaya yansıdığında arkadan okunuyor. İçerik sığmazsa kart kendi
      içinde dikey kayıyor, sayfa kaymıyor. Esc, ✕ ya da kartın dışına
      basınca kapanıyor.

   DİL: ben dili yok. "Öğretmeniyim / hazırladım" yerine ad cümleleri —
   öğrenciye tanıtım yapılırken kendini övme havası olmasın diye.

   KIDEM SÜREKLİ HESAPLANIYOR: başlangıç 15 Ekim 2018; yıl-ay-gün her
   açılışta o günün tarihine göre yeniden bulunuyor (açık kalırsa da
   dakikada bir tazeleniyor). Elle yazılmış bir sayı yok, eskimiyor.

   AZ KUTU: öğretmen "çok fazla konteynır tasarımı, kutu tasarımı
   olmasın" dedi. Kart içinde kart yok; bölümler ince ayıraçlarla ve
   renkle ayrılıyor. Renkler sitenin kendi renkleri: yeşil #16A085,
   turuncu #F39C12 / #E67E22, mavi #2563EB, mor #7C3AED, kırmızı #EE5253.

   BİLGİLER ÖĞRETMENİN KENDİ VERDİĞİ: görev yılları ve iller, çalışmalar
   ve iletişim onun söylediği gibi. OKUL ADI GEÇMİYOR, yalnız iller.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefTanitim) return;

  var BOLUM_ID = 'youtube-kanallari';

  var AD = 'Geylani Demirbağ';
  var UNVAN = 'Arapça Öğretmeni';
  var BASLANGIC = new Date(2018, 9, 15);      /* 15 Ekim 2018 — göreve başlama */

  /* Sitenin kendi renkleri (index.css ve kart renkleriyle aynı). */
  var R = ['#16A085', '#F39C12', '#2563EB', '#7C3AED', '#EE5253', '#E67E22'];

  /* Yıl-ay-gün farkı: takvim ayları eşit olmadığı için gün sayısından
     değil, tarih tarih sayılarak bulunuyor. */
  function kidem(bugun) {
    var b = bugun || new Date();
    var y = b.getFullYear() - BASLANGIC.getFullYear();
    var a = b.getMonth() - BASLANGIC.getMonth();
    var g = b.getDate() - BASLANGIC.getDate();
    if (g < 0) {
      a -= 1;
      g += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
    }
    if (a < 0) { y -= 1; a += 12; }
    return { yil: y, ay: a, gun: g };
  }

  var GOREV = [
    ['2018 – 2022', 'Şırnak'],
    ['2022 – 2026', 'İstanbul'],
    ['2026 –', 'Van · Erciş']
  ];

  /* Komisyon görev yerlerinden ayrı duruyor: bir ile atama değil, onlara
     PARALEL süren bir görev. Bu yüzden listenin içine karışmıyor,
     üstünde kendi şeridinde. */
  var KOMISYON = ['2025’ten beri', 'Kitap Yazım Komisyonu üyesi'];

  /* Ad cümleleri — ben dili yok. */
  var CALISMA = [
    ['kitap', 'Kidef Arapça kitapları', 'basılı ve sayfası çevrilen dijital sürümleri'],
    ['sunu', 'Ders sunuları', 'konu konu, tahtaya yansıtmak için'],
    ['kelime', 'Kelime listeleri ve sözlük', 'üniteye göre ayrılmış'],
    ['oyun', 'Oyunlar', 'harf, kelime ve kök çalışmaları'],
    ['defter', 'Sınıf defteri ve öğretmen araçları', 'yoklama, not, haftalık plan']
  ];

  var SIM = {
    kitap: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15.5H6.5A2.5 2.5 0 0 0 4 21z"/>' +
           '<path d="M4 18.5h15"/>',
    sunu: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/>',
    kelime: '<path d="M4 6h16M4 12h10M4 18h13"/>',
    oyun: '<rect x="2.5" y="7" width="19" height="10" rx="4"/>' +
          '<path d="M7 12h3M8.5 10.5v3M15.5 11h.01M17.5 13h.01"/>',
    defter: '<rect x="4" y="3" width="15" height="18" rx="2"/><path d="M8 3v18M11 8h5M11 12h5"/>'
  };

  function sim(ad) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (SIM[ad] || '') + '</svg>';
  }

  /* ------------------------------------------------------------ BİÇİM */
  function stilKur() {
    if (document.getElementById('kidef-tanitim-stil')) return;
    var s = document.createElement('style');
    s.id = 'kidef-tanitim-stil';
    s.textContent = [
      /* --- sosyal penceredeki küçük satır --- */
      '#kdTanitim{ margin:0 0 12px; }',
      '#kdTanitim .kdt-tus{ display:flex; align-items:center; gap:11px; width:100%;',
      '  border:1px solid #E6EBF1; background:#fff; border-radius:14px;',
      '  padding:9px 12px; cursor:pointer; font-family:inherit; text-align:left;',
      '  transition:background .15s, border-color .15s; }',
      '#kdTanitim .kdt-tus:hover{ background:#F6FBFA; border-color:#BFE3DA; }',
      '#kdTanitim .kdt-bas{ flex:none; width:38px; height:38px; border-radius:50%;',
      '  display:flex; align-items:center; justify-content:center; color:#fff;',
      '  font-weight:800; font-size:.92rem; letter-spacing:.5px;',
      '  background:linear-gradient(145deg,#16A085,#0E7C66);',
      '  box-shadow:inset 0 0 0 2px rgba(255,255,255,.35); }',
      '#kdTanitim .kdt-ad{ flex:1 1 auto; min-width:0; }',
      '#kdTanitim .kdt-ad b{ display:block; font-size:.98rem; color:#1F2430;',
      '  font-weight:800; line-height:1.2; }',
      '#kdTanitim .kdt-ad span{ display:block; font-size:.76rem; color:#78828F;',
      '  margin-top:2px; }',
      '#kdTanitim .kdt-ok{ flex:none; width:17px; height:17px; opacity:.45;',
      '  transition:transform .15s, opacity .15s; }',
      '#kdTanitim .kdt-tus:hover .kdt-ok{ opacity:.9; transform:translateX(2px); }',

      /* --- ORTADA BÜYÜK KART; İÇİNDE KUTU YOK --- */
      '#kdtSahne{ position:fixed; inset:0; z-index:100000; display:flex;',
      '  align-items:center; justify-content:center; padding:24px 16px;',
      '  background:rgba(12,38,32,.5); -webkit-backdrop-filter:blur(3px);',
      '  backdrop-filter:blur(3px); animation:kdtGir .18s ease-out; }',
      '@keyframes kdtGir{ from{ opacity:0 } to{ opacity:1 } }',
      '@keyframes kdtKalk{ from{ opacity:0; transform:translateY(14px) scale(.985) }',
      '  to{ opacity:1; transform:none } }',
      /* ARKA PLAN SİTE RENKLERİYLE (07.10.2026) — öğretmen: "tanıtım
         kısmında arkaplan biraz daha site renkleriyle dolu olsun, arkası
         çok sade olmasın". Kutu eklemeden, yalnız boyayla: köşelerden
         yayılan yumuşak yeşil/turuncu/mavi/mor lekeler ve üstte ince bir
         renk şeridi. Lekeler düşük yoğunlukta, yazının okunurluğunu
         bozmuyor; kutu değiller, kenarları yok. */
      '#kdtSahne .kdt-kutu{ position:relative; width:min(960px,94vw);',
      '  max-height:min(860px,88vh); overflow-y:auto; overflow-x:hidden;',
      '  -webkit-overflow-scrolling:touch; overscroll-behavior:contain;',
      '  border-radius:24px; padding:40px 44px 40px;',
      '  box-shadow:0 34px 80px rgba(8,45,37,.34);',
      '  animation:kdtKalk .22s cubic-bezier(.22,1,.36,1);',
      '  background-color:#fff;',
      /* Renk şeridi ve lekeler kartın KENDİ zemininde; ayrı bir öğe yok,
         bu yüzden yuvarlak köşelerde beyaz kama kalmıyor. İlk katman
         tepedeki 7px şerit, sonrakiler köşelerden yayılan yumuşak
         lekeler. Hepsi "local": kart kayarken zeminiyle birlikte kayar. */
      '  background-image:',
      '    linear-gradient(90deg,#16A085 0%,#0E9E86 16%,#F39C12 40%,',
      '      #E67E22 55%,#2563EB 76%,#7C3AED 100%),',
      '    radial-gradient(52% 38% at 100% 0%, rgba(243,156,18,.34), rgba(243,156,18,0) 72%),',
      '    radial-gradient(56% 42% at 0% 0%, rgba(22,160,133,.34), rgba(22,160,133,0) 74%),',
      '    radial-gradient(50% 32% at 100% 48%, rgba(37,99,235,.22), rgba(37,99,235,0) 72%),',
      '    radial-gradient(54% 36% at 0% 84%, rgba(124,58,237,.20), rgba(124,58,237,0) 74%),',
      '    radial-gradient(46% 30% at 88% 100%, rgba(238,82,83,.18), rgba(238,82,83,0) 72%),',
      '    linear-gradient(180deg,#FFFFFF 0%,#F7FCFB 100%);',
      '  background-size:100% 7px, auto, auto, auto, auto, auto, auto;',
      '  background-repeat:no-repeat;',
      '  background-position:top left, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0;',
      '  background-attachment:local, local, local, local, local, local, local; }',
      '#kdtSahne .kdt-kutu::-webkit-scrollbar{ width:11px; }',
      '#kdtSahne .kdt-kutu::-webkit-scrollbar-thumb{ background:rgba(22,160,133,.32);',
      '  border-radius:99px; border:3px solid transparent; background-clip:content-box; }',
      '#kdtSahne .kdt-kapat{ position:sticky; top:6px; float:right;',
      '  margin:0 -20px 0 0; width:42px; height:42px; border-radius:50%;',
      '  border:0; cursor:pointer; background:rgba(255,255,255,.85); color:#55636E;',
      '  font-size:25px; line-height:1; z-index:3;',
      '  -webkit-backdrop-filter:blur(4px); backdrop-filter:blur(4px); }',
      '#kdtSahne .kdt-kapat:hover{ background:#fff; color:#16A085; }',

      /* ad — kutu yok, renkli ince bir çizgi */
      '#kdtSahne .kdt-isim{ margin:0; font-family:"Marhey",system-ui,sans-serif;',
      '  font-size:clamp(2rem,4.8vw,3.4rem); line-height:1.05; color:#12463B;',
      '  font-weight:700; clear:both; }',
      '#kdtSahne .kdt-unvan{ margin:8px 0 0; font-size:clamp(1.05rem,2.1vw,1.5rem);',
      '  color:#16A085; font-weight:700; }',
      '#kdtSahne .kdt-cizgi{ height:5px; width:120px; border-radius:99px; margin:20px 0 0;',
      '  background:linear-gradient(90deg,#16A085,#F39C12 45%,#2563EB); }',

      /* kıdem — satır, kutu değil */
      '#kdtSahne .kdt-kidem{ margin:26px 0 0; font-size:clamp(1.1rem,2.3vw,1.6rem);',
      '  color:#3B434E; font-weight:600; line-height:1.45; }',
      '#kdtSahne .kdt-kidem b{ font-weight:800; font-variant-numeric:tabular-nums; }',
      '#kdtSahne .kdt-kidem .s1{ color:#16A085; }',
      '#kdtSahne .kdt-kidem .s2{ color:#E67E22; }',
      '#kdtSahne .kdt-kidem .s3{ color:#2563EB; }',
      '#kdtSahne .kdt-kidem small{ display:block; margin-top:5px; font-size:.86rem;',
      '  color:#9AA3AE; font-weight:600; }',

      /* komisyon — dolu şerit değil, renkli kenarlı tek satır */
      '#kdtSahne .kdt-komisyon{ margin:22px 0 0; padding:2px 0 2px 16px;',
      '  border-left:5px solid #7C3AED; }',
      '#kdtSahne .kdt-komisyon i{ display:block; font-style:normal; font-weight:800;',
      '  font-size:.82rem; letter-spacing:1.4px; text-transform:uppercase;',
      '  color:#9AA3AE; }',
      '#kdtSahne .kdt-komisyon b{ display:block; margin-top:3px; font-weight:700;',
      '  font-size:clamp(1.05rem,2.1vw,1.45rem); color:#4C2A86; }',

      /* bölüm başlığı + ayıraç */
      '#kdtSahne .kdt-blok{ margin-top:30px; padding-top:24px;',
      '  border-top:1px solid rgba(18,70,59,.10); }',
      '#kdtSahne .kdt-bslk{ margin:0 0 14px; font-size:.82rem; font-weight:800;',
      '  letter-spacing:1.8px; text-transform:uppercase; color:#9AA3AE; }',

      /* görev yerleri — noktalı dizi, kutu yok */
      '#kdtSahne .kdt-gorev{ list-style:none; margin:0; padding:0; }',
      '#kdtSahne .kdt-gorev li{ display:flex; align-items:baseline; gap:14px;',
      '  padding:9px 0; }',
      '#kdtSahne .kdt-gorev u{ flex:none; width:11px; height:11px; border-radius:50%;',
      '  text-decoration:none; align-self:center; }',
      '#kdtSahne .kdt-gorev i{ flex:none; width:118px; font-style:normal;',
      '  font-weight:700; font-size:1.02rem; color:#7C8894;',
      '  font-variant-numeric:tabular-nums; }',
      '#kdtSahne .kdt-gorev span{ font-size:clamp(1.15rem,2.3vw,1.6rem);',
      '  color:#22303C; font-weight:700; }',

      /* çalışmalar — iki sütun düz liste */
      '#kdtSahne .kdt-calisma{ display:grid; grid-template-columns:repeat(2,1fr);',
      '  gap:4px 30px; list-style:none; margin:0; padding:0; }',
      '#kdtSahne .kdt-calisma li{ display:flex; align-items:flex-start; gap:13px;',
      '  padding:10px 0; }',
      '#kdtSahne .kdt-calisma svg{ flex:none; width:26px; height:26px; margin-top:2px; }',
      '#kdtSahne .kdt-calisma b{ display:block; font-size:clamp(1rem,1.9vw,1.24rem);',
      '  color:#22303C; font-weight:700; line-height:1.25; }',
      '#kdtSahne .kdt-calisma em{ display:block; font-style:normal; margin-top:2px;',
      '  font-size:.9rem; color:#8A939E; }',

      /* iletişim — düz bağlantılar */
      '#kdtSahne .kdt-iletisim{ display:flex; flex-wrap:wrap; gap:8px 26px; }',
      '#kdtSahne .kdt-iletisim a{ font-size:1.02rem; font-weight:700;',
      '  color:#16A085; text-decoration:none; border-bottom:2px solid rgba(22,160,133,.3);',
      '  padding-bottom:2px; }',
      '#kdtSahne .kdt-iletisim a:hover{ border-bottom-color:#16A085; }',

      '@media (max-width:760px){',
      '  #kdtSahne{ padding:14px 10px; }',
      '  #kdtSahne .kdt-kutu{ padding:28px 22px 28px; border-radius:20px;',
      '    max-height:92vh; }',
      '  #kdtSahne .kdt-calisma{ grid-template-columns:1fr; gap:0; }',
      '  #kdtSahne .kdt-gorev i{ width:96px; font-size:.94rem; } }',
      '@media (prefers-reduced-motion: reduce){',
      '  #kdtSahne, #kdtSahne .kdt-kutu{ animation:none } }'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* -------------------------------------------------- KÜÇÜK SATIR */
  function ciz() {
    var bolum = document.getElementById(BOLUM_ID);
    if (!bolum || document.getElementById('kdTanitim')) return;
    var h2 = bolum.querySelector('h2');
    if (!h2) return;
    stilKur();
    var k = document.createElement('div');
    k.id = 'kdTanitim';
    k.innerHTML =
      '<button type="button" class="kdt-tus" onclick="KidefTanitim.ac()"' +
      ' title="Tanıtımı tam ekran aç">' +
      '<span class="kdt-bas" aria-hidden="true">GD</span>' +
      '<span class="kdt-ad"><b>' + AD + '</b>' +
      '<span>' + UNVAN + '</span></span>' +
      /* SİMGE DEĞİŞTİ (07.10.2026) — öğretmen: "popupta hala tam ekran
         svg si var". Tanıtım artık tam ekran açılmıyor, ortada bir kart
         olarak açılıyor; dört köşeye açılan "büyüt" oku yanlış söz
         veriyordu. Yerine sade bir sağ oku kondu: "aç" demek. */
      '<svg class="kdt-ok" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"' +
      ' aria-hidden="true"><path d="M9 5.5l7 6.5-7 6.5"/></svg>' +
      '</button>';
    h2.parentNode.insertBefore(k, h2.nextSibling);
  }

  /* --------------------------------------------- TAM EKRAN TANITIM */
  function kidemYazi() {
    var k = kidem();
    return '<p class="kdt-kidem" id="kdtKidem">Öğretmenlikte ' +
      '<b class="s1">' + k.yil + '</b> yıl ' +
      '<b class="s2">' + k.ay + '</b> ay ' +
      '<b class="s3">' + k.gun + '</b> gün' +
      '<small>15 Ekim 2018’den beri</small></p>';
  }

  function sahneIc() {
    var g = '';
    GOREV.forEach(function (x, i) {
      g += '<li><u style="background:' + R[i % R.length] + '"></u>' +
        '<i>' + x[0] + '</i><span>' + x[1] + '</span></li>';
    });
    var c = '';
    CALISMA.forEach(function (x, i) {
      c += '<li><span style="color:' + R[i % R.length] + '">' + sim(x[0]) + '</span>' +
        '<span><b>' + x[1] + '</b><em>' + x[2] + '</em></span></li>';
    });
    return '<div class="kdt-kutu">' +
      '<button type="button" class="kdt-kapat" aria-label="Kapat"' +
      ' onclick="KidefTanitim.kapat()">&times;</button>' +
      '<h2 class="kdt-isim">' + AD + '</h2>' +
      '<p class="kdt-unvan">' + UNVAN + '</p>' +
      '<div class="kdt-cizgi" aria-hidden="true"></div>' +
      kidemYazi() +
      '<div class="kdt-komisyon"><i>' + KOMISYON[0] + '</i><b>' + KOMISYON[1] + '</b></div>' +
      '<div class="kdt-blok"><p class="kdt-bslk">Görev yerleri</p>' +
      '<ul class="kdt-gorev">' + g + '</ul></div>' +
      '<div class="kdt-blok"><p class="kdt-bslk">Bu sitedeki çalışmalar</p>' +
      '<ul class="kdt-calisma">' + c + '</ul></div>' +
      '<div class="kdt-blok"><p class="kdt-bslk">İletişim</p>' +
      '<div class="kdt-iletisim">' +
      '<a href="mailto:kidefarapca@gmail.com">kidefarapca@gmail.com</a>' +
      '<a href="https://www.youtube.com/@kidefarapca" target="_blank" rel="noopener">YouTube · @kidefarapca</a>' +
      '<a href="https://www.instagram.com/kidefarapca/" target="_blank" rel="noopener">Instagram · @kidefarapca</a>' +
      '</div></div></div>';
  }

  function ac() {
    if (document.getElementById('kdtSahne')) return;
    stilKur();
    var s = document.createElement('div');
    s.id = 'kdtSahne';
    s.setAttribute('role', 'dialog');
    s.setAttribute('aria-label', AD + ' — tanıtım');
    s.innerHTML = sahneIc();
    /* kartın DIŞINA basınca kapansın; kartın içindeki tıklama geçmesin */
    s.addEventListener('click', function (e) {
        if (e.target === s) kapat();
    });
    document.body.appendChild(s);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', tus);
    /* kart açık kalırken gün dönerse sayı da dönsün */
    nabiz = setInterval(function () {
      var e = document.getElementById('kdtKidem');
      if (!e) return;
      var y = kidemYazi();
      var g = document.createElement('div'); g.innerHTML = y;
      if (g.firstChild.innerHTML !== e.innerHTML) e.innerHTML = g.firstChild.innerHTML;
    }, 60000);
  }

  var nabiz = null;

  function kapat() {
    if (nabiz) { clearInterval(nabiz); nabiz = null; }
    var s = document.getElementById('kdtSahne');
    if (s && s.parentNode) s.parentNode.removeChild(s);
    document.body.style.overflow = '';
    document.removeEventListener('keydown', tus);
  }

  function tus(e) { if (e.key === 'Escape') kapat(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ciz);
  } else { ciz(); }
  var tur = 0;
  var zaman = setInterval(function () {
    ciz();
    if (document.getElementById('kdTanitim') || ++tur > 40) clearInterval(zaman);
  }, 200);

  window.KidefTanitim = { ciz: ciz, ac: ac, kapat: kapat };
})();
