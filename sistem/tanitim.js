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
/* ⚠️ AD ÇAKIŞMASI (07.10.2026): bu dosya önce window.KidefTanitim adını
   kullanıyordu — ama sistem/panel-tanitim.js de AYNI adı kullanıyor ve
   index.html ikisini birden yüklüyor. İkisi de "adım zaten varsa çık"
   diye başladığı için, bu dosya önce yüklendiğinden panel-tanitim.js
   sessizce devre dışı kalıyor ve giriş ekranındaki "Panelde ne var?"
   kartları (KidefTanitim.kartlar / .ac) kırılıyordu. Ad KidefKimlik
   yapıldı; iki dosya da kendi işini görüyor. */
(function () {
  'use strict';
  if (window.KidefKimlik) return;

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
      '#kdTanitim .kdt-tus + .kdt-tus{ margin-top:7px; }',
      '#kdTanitim .kdt-bas-site{ background:linear-gradient(145deg,#2563EB,#5A50E0); }',
      '#kdTanitim .kdt-bas-site svg{ width:21px; height:21px; }',
      '#kdTanitim .kdt-site-tus:hover{ background:#F5F8FE; border-color:#C4D7F7; }',
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
      /* ---- SİTE KILAVUZU: üç adım, her birinin ekran görüntüsü ---- */
      '#kdtSahne .kdt-adim{ margin-top:26px; padding-top:22px;',
      '  border-top:1px solid rgba(18,70,59,.10); }',
      '#kdtSahne .kdt-adim:first-of-type{ border-top:0; padding-top:0; }',
      '#kdtSahne .kdt-adim h4{ margin:0 0 6px; display:flex; align-items:center;',
      '  gap:11px; font-size:clamp(1.1rem,2.2vw,1.42rem); color:#12463B;',
      '  font-weight:800; line-height:1.25; }',
      '#kdtSahne .kdt-adim h4 u{ flex:none; width:30px; height:30px; border-radius:50%;',
      '  text-decoration:none; color:#fff; font-size:.95rem; display:flex;',
      '  align-items:center; justify-content:center; font-weight:800; }',
      '#kdtSahne .kdt-adim p{ margin:0 0 12px 41px; font-size:1rem; line-height:1.55;',
      '  color:#4A525E; }',
      '#kdtSahne .kdt-adim p b{ color:#12463B; }',
      /* MAKETLER HTML (07.10.2026) — öğretmen: "görselleri html olarak
         oluşturalım, görselle net olmuyor." Ekran görüntüsü yerine
         burada çizilen küçük maketler: her ekranda net, büyütülünce
         bozulmuyor, dosya da inmiyor. */
      '#kdtSahne .kdt-maket{ margin-left:41px; border:1px solid rgba(18,70,59,.12);',
      '  border-radius:14px; padding:16px 18px; background:#fff;',
      '  box-shadow:0 8px 20px rgba(18,70,59,.07); }',
      '#kdtSahne .mk-bas{ font-size:.74rem; font-weight:800; letter-spacing:1.2px;',
      '  text-transform:uppercase; color:#9AA3AE; margin-bottom:11px; }',
      /* 1 · katalog rakamları */
      '#kdtSahne .mk-rakam{ display:flex; gap:12px; flex-wrap:wrap; }',
      '#kdtSahne .mk-rakam span{ width:40px; height:40px; border-radius:50%;',
      '  display:flex; align-items:center; justify-content:center; color:#fff;',
      '  font-weight:800; font-size:1rem; background:var(--r); }',
      '#kdtSahne .mk-rakam span.sec{ box-shadow:0 0 0 4px rgba(22,160,133,.25); }',
      '#kdtSahne .mk-acilan{ margin-top:12px; padding:11px 14px; border-radius:10px;',
      '  background:rgba(22,160,133,.09); color:#12463B; font-size:.92rem;',
      '  font-weight:700; }',
      /* 2 · belgeler + kartlar */
      '#kdtSahne .mk-dok{ display:flex; flex-wrap:wrap; gap:7px; margin-bottom:13px; }',
      '#kdtSahne .mk-dok span{ font-size:.8rem; font-weight:700; color:#8E5A24;',
      '  background:rgba(243,156,18,.14); border-radius:8px; padding:6px 11px; }',
      '#kdtSahne .mk-kart{ display:flex; gap:9px; flex-wrap:wrap; }',
      '#kdtSahne .mk-kart i{ font-style:normal; font-size:.78rem; font-weight:700;',
      '  color:#fff; border-radius:10px; padding:14px 12px; min-width:92px;',
      '  text-align:center; background:var(--r); }',
      /* 3 · sınıflarım */
      '#kdtSahne .mk-okul{ border-radius:10px; overflow:hidden;',
      '  border:1px solid rgba(18,70,59,.12); }',
      '#kdtSahne .mk-kurum{ background:#2C3E50; color:#fff; font-weight:700;',
      '  font-size:.88rem; padding:9px 13px; }',
      '#kdtSahne .mk-kat{ display:flex; align-items:center; gap:9px; padding:10px 13px;',
      '  border-top:1px solid rgba(18,70,59,.08); flex-wrap:wrap; }',
      '#kdtSahne .mk-kat b{ font-size:.86rem; color:#3B434E; min-width:66px; }',
      '#kdtSahne .mk-kat em{ font-style:normal; font-size:.82rem; font-weight:700;',
      '  color:#fff; background:#3E6E96; border-radius:8px; padding:6px 12px; }',
      /* 4 · eşleştirme */
      '#kdtSahne .mk-akis{ display:flex; align-items:stretch; gap:10px; flex-wrap:wrap; }',
      '#kdtSahne .mk-adim{ flex:1 1 150px; border-radius:11px; padding:12px 13px;',
      '  background:#F7FAF9; border:1px dashed rgba(18,70,59,.18); }',
      '#kdtSahne .mk-adim u{ display:block; text-decoration:none; font-size:.68rem;',
      '  font-weight:800; letter-spacing:1px; text-transform:uppercase;',
      '  color:#9AA3AE; margin-bottom:6px; }',
      '#kdtSahne .mk-adim b{ display:block; font-size:.95rem; color:#12463B; }',
      '#kdtSahne .mk-kod{ font-family:ui-monospace,Menlo,Consolas,monospace;',
      '  letter-spacing:1px; color:#7C3AED; }',
      '#kdtSahne .mk-onay{ display:inline-flex; align-items:center; gap:6px;',
      '  margin-top:7px; font-size:.78rem; font-weight:800; color:#fff;',
      '  background:#16A085; border-radius:99px; padding:5px 11px; }',
      '#kdtSahne .mk-ok2{ align-self:center; color:#BCC6CF; font-size:1.3rem; }',
      /* 5 · sonuçlar */
      '#kdtSahne .mk-sut{ display:flex; align-items:flex-end; gap:14px; height:116px;',
      '  padding-bottom:4px; border-bottom:2px solid rgba(18,70,59,.12); }',
      '#kdtSahne .mk-sut span{ flex:1; display:flex; flex-direction:column;',
      '  align-items:center; gap:6px; }',
      '#kdtSahne .mk-sut i{ font-style:normal; font-size:.82rem; font-weight:800;',
      '  color:#3B434E; }',
      '#kdtSahne .mk-sut u{ display:block; width:100%; max-width:46px;',
      '  border-radius:7px 7px 0 0; text-decoration:none; background:var(--r); }',
      '#kdtSahne .mk-etiket{ display:flex; gap:14px; margin-top:8px; }',
      '#kdtSahne .mk-etiket span{ flex:1; text-align:center; font-size:.76rem;',
      '  color:#8A939E; font-weight:700; }',
      '#kdtSahne .mk-genel{ margin-top:12px; display:inline-flex; align-items:center;',
      '  gap:9px; background:rgba(22,160,133,.11); border-radius:99px;',
      '  padding:8px 16px; font-size:.92rem; font-weight:800; color:#0B6B58; }',
      '#kdtSahne .kdt-ozet{ margin:28px 0 0; padding:16px 18px; border-radius:14px;',
      '  background:rgba(22,160,133,.10); font-size:1.02rem; line-height:1.55;',
      '  color:#12463B; }',
      '#kdtSahne .kdt-ozet b{ font-weight:800; }',
      '@media (max-width:760px){',
      '  #kdtSahne .kdt-adim p, #kdtSahne .kdt-maket{ margin-left:0; }',
      '  #kdtSahne .mk-ok2{ display:none; } }',

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
      '<button type="button" class="kdt-tus" onclick="KidefKimlik.ac()"' +
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
      '</button>' +
      /* İKİNCİ SATIR (07.10.2026) — öğretmen: "ismimin altında
         kidefarapca.com bilgilendirme overlayı olsun, ismimde olduğu
         gibi... amacımız sitede kaybolmasın, öğretmen mantığı kavrasın,
         çok ta uzun olmasın." Kısa bir kılavuz: üç adım, üçünün de
         ekran görüntüsü var. */
      '<button type="button" class="kdt-tus kdt-site-tus"' +
      ' onclick="KidefKimlik.siteAc()" title="Site nasıl çalışıyor">' +
      '<span class="kdt-bas kdt-bas-site" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18' +
      'a15 15 0 0 1 0-18z"/></svg></span>' +
      '<span class="kdt-ad"><b>kidefarapca.com</b>' +
      '<span>Site nasıl çalışıyor?</span></span>' +
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
      ' onclick="KidefKimlik.kapat()">&times;</button>' +
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

  /* Kılavuz da aynı kabuğu kullanıyor: ortada kart, dikey kayar,
     Esc/✕/dışına tıkla ile kapanır. İkinci bir pencere yazılmadı. */
  function sahneAc(etiket, ic) {
    if (document.getElementById('kdtSahne')) return;
    stilKur();
    var s = document.createElement('div');
    s.id = 'kdtSahne';
    s.setAttribute('role', 'dialog');
    s.setAttribute('aria-label', etiket);
    s.innerHTML = ic;
    s.addEventListener('click', function (e) { if (e.target === s) kapat(); });
    document.body.appendChild(s);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', tus);
    return s;
  }

  /* adim(no, renk, başlık, yazı, maket) — maket HTML, görsel dosyası
     değil. Öğretmen: "görselleri html olarak oluşturalım, görselle net
     olmuyor." Böylece her ekranda keskin duruyor ve hiçbir dosya
     inmiyor. */
  function adim(no, renk, baslik, yazi, maket) {
    return '<div class="kdt-adim">' +
      '<h4><u style="background:' + renk + '">' + no + '</u>' + baslik + '</h4>' +
      '<p>' + yazi + '</p>' +
      '<div class="kdt-maket" aria-hidden="true">' + maket + '</div>' +
      '</div>';
  }

  /* ---- maketler ---- */
  function mkKatalog() {
    var r = ['#16A085', '#F39C12', '#2563EB', '#7C3AED', '#EE5253', '#0E9E86'];
    var g = '';
    [5, 6, 7, 8, 9, 10].forEach(function (n, i) {
      g += '<span class="' + (n === 5 ? 'sec' : '') + '" style="--r:' + r[i] + '">' + n + '</span>';
    });
    return '<div class="mk-bas">İmam Hatip</div><div class="mk-rakam">' + g + '</div>' +
      '<div class="mk-acilan">5. Sınıf — belgeler ve etkinlikler altında açıldı</div>';
  }
  function mkSinifIci() {
    var r = ['#16A085', '#F39C12', '#2563EB', '#7C3AED'];
    var ad = ['Alfabe', 'Kelime<br>Listeleri', 'Sunular', 'Oyunlar'];
    var k = '';
    ad.forEach(function (a, i) { k += '<i style="--r:' + r[i] + '">' + a + '</i>'; });
    return '<div class="mk-bas">5. Sınıf</div>' +
      '<div class="mk-dok"><span>Yıllık plan</span><span>Günlük plan</span>' +
      '<span>BEP</span><span>Zümre</span><span>Performans</span></div>' +
      '<div class="mk-kart">' + k + '</div>';
  }
  function mkSiniflarim() {
    return '<div class="mk-okul">' +
      '<div class="mk-kurum">Kurumun</div>' +
      '<div class="mk-kat"><b>5. sınıf</b><em>5A</em><em>5B</em><em>5C</em></div>' +
      '<div class="mk-kat"><b>6. sınıf</b><em>6A</em><em>6B</em></div>' +
      '</div>';
  }
  function mkEslestirme() {
    return '<div class="mk-akis">' +
      '<div class="mk-adim"><u>1 · sende</u><b class="mk-kod">TCH-••••</b>' +
      '<b style="font-size:.8rem;font-weight:600;color:#7C8894;margin-top:5px">' +
      'Profil → Kişisel Bilgilerim</b></div>' +
      '<div class="mk-ok2">→</div>' +
      '<div class="mk-adim"><u>2 · öğrencide</u><b>Kayıt olurken kodu yazar</b></div>' +
      '<div class="mk-ok2">→</div>' +
      '<div class="mk-adim"><u>3 · sende</u><b>Zeynep K. · istek</b>' +
      '<span class="mk-onay">✓ Onayla</span></div>' +
      '</div>';
  }
  function mkSonuc() {
    var v = [['Sınav', 78, '#2563EB'], ['Ödev', 86, '#16A085'],
             ['Performans', 74, '#F39C12'], ['Davranış', 92, '#7C3AED']];
    var c = '', e = '';
    v.forEach(function (x) {
      c += '<span><i>' + x[1] + '</i><u style="--r:' + x[2] + ';height:' +
          Math.round(x[1] * 0.78) + 'px"></u></span>';
      e += '<span>' + x[0] + '</span>';
    });
    return '<div class="mk-bas">Zeynep K. · 1. dönem</div>' +
      '<div class="mk-sut">' + c + '</div>' +
      '<div class="mk-etiket">' + e + '</div>' +
      '<div class="mk-genel">Genel ortalama 82,5</div>';
  }

  function siteIc() {
    return '<div class="kdt-kutu">' +
      '<button type="button" class="kdt-kapat" aria-label="Kapat"' +
      ' onclick="KidefKimlik.kapat()">&times;</button>' +
      '<h2 class="kdt-isim">kidefarapca.com</h2>' +
      '<p class="kdt-unvan">Nasıl çalışıyor?</p>' +
      '<div class="kdt-cizgi" aria-hidden="true"></div>' +
      '<div style="height:22px"></div>' +
      adim(1, '#16A085', 'Hazır malzeme sınıfa göre duruyor',
        'Anasayfadaki <b>İmam Hatip</b> bölümünde sınıf rakamına basarsın. ' +
        'O sınıfın belgeleri ve etkinlikleri hemen altında açılır. ' +
        'Aradığını sınıftan bulursun, menüde kaybolmazsın.',
        mkKatalog()) +
      adim(2, '#F39C12', 'Bir sınıfın içinde ne var',
        'Üstte <b>belgeler</b>: yıllık plan, günlük plan, BEP, zümre, ' +
        'performans — Word ve PDF ikisi de iner. Altında <b>etkinlik ' +
        'kartları</b>: alfabe, kelime listeleri, sunular, sözlük ve ' +
        'oyunlar. Her kart o sınıfın verisiyle açılır.',
        mkSinifIci()) +
      adim(3, '#2563EB', 'Kendi sınıfların ayrı yerde',
        'Öğretmen girişinden sonra <b>Sınıflarım</b> açılır. Kendi okulunu ' +
        'kurarsın: kurum → seviye → şube. Bir şubeye basınca kendi ' +
        'sekmesinde açılır; orada sınıf listesi, sınıf defteri, materyaller ' +
        've sınıf araçları olur. Bunlar yalnız sana ait.',
        mkSiniflarim()) +
      adim(4, '#7C3AED', 'Öğrenciler sana nasıl bağlanır',
        'Sana özel, hiç değişmeyen bir <b>öğretmen kodun</b> var. Öğrenci ' +
        'kayıt olurken bu kodu girince sana <b>bağlanma isteği</b> düşer; ' +
        '"İstekleri Gör" ile onaylarsın ve öğrenci sınıf listene girer. ' +
        'Kodu rahatça dağıt — onaylamadığın kimse listende görünmez.',
        mkEslestirme()) +
      adim(5, '#EE5253', 'Sonuçları tek yerde görürsün',
        'Sınav, ödev, performans ve davranış <b>aynı tabloda</b>; genel ' +
        'ortalama kendiliğinden hesaplanır. Gönderdiğin görevleri kimin ' +
        'yaptığını, oyun ve etkinliklerde kimin nerede olduğunu da ' +
        'buradan görürsün — öğrenci de kendi karnesini görür.',
        mkSonuc()) +
      '<p class="kdt-ozet"><b>Kısacası:</b> katalog herkese açık hazır ' +
      'malzeme, Sınıflarım ise yalnız senin verin. İkisi birbirine ' +
      'karışmaz — birinden ders malzemesi alır, öbüründe sınıfını ' +
      'yönetirsin.</p>' +
      '</div>';
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

  function siteAc() { sahneAc('kidefarapca.com — kılavuz', siteIc()); }

  window.KidefKimlik = { ciz: ciz, ac: ac, siteAc: siteAc, kapat: kapat };
})();
