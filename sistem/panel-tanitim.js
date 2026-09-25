/* =====================================================================
   KIDEF · PANEL TANITIMI            (sistem/panel-tanitim.js)
   ---------------------------------------------------------------------
   AMAÇ
   Giriş/kayıt ekranında ve tanıtım sayfasında (indeks.html) "öğrenci" ve
   "öğretmen" kartları. Karta basınca, o rolün panelinde NE OLDUĞU
   ÇİZİMLERLE anlatılır: kurumlar ve sınıflar, sınıf listesi, kurayla
   seç, etkinlikler, görev gönderme, sonuçlar…

   Çizimler ekran görüntüsü DEĞİL, elle yazılmış SVG maketlerdir: hafif,
   her ekranda net, büyütülünce bozulmaz. Gerçek sayfalardan bağımsız
   oldukları için site değişince kırılmazlar.

   KULLANIM
     <script src="sistem/panel-tanitim.js"></script>
     KidefTanitim.kartlar(document.getElementById('bir-yer'));   // iki kart
     KidefTanitim.ac('ogretmen');                                // doğrudan pencere
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefTanitim) return;

  var YESIL = '#16A085', TURUNCU = '#E67E22', MOR = '#7C3AED',
      MAVI = '#2563EB', KIRMIZI = '#EE5253', YESIL2 = '#059669';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ------------------------------------------------------------------
     ORTAK PENCERE ÇERÇEVESİ — her maket aynı dilde görünsün
     ------------------------------------------------------------------ */
  function pencere(baslik, renk, ic) {
    return '<svg class="kdt-ekran" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<rect x="1.5" y="1.5" width="317" height="197" rx="13" fill="#fff" stroke="#E7D9CC" stroke-width="2"/>' +
      '<path d="M1.5 14.5a13 13 0 0 1 13-13h291a13 13 0 0 1 13 13v17H1.5z" fill="' + renk + '"/>' +
      '<circle cx="16" cy="16" r="3.2" fill="#fff" opacity=".5"/>' +
      '<circle cx="26" cy="16" r="3.2" fill="#fff" opacity=".35"/>' +
      '<circle cx="36" cy="16" r="3.2" fill="#fff" opacity=".22"/>' +
      '<text x="48" y="20" font-size="11.5" font-weight="700" fill="#fff">' + esc(baslik) + '</text>' +
      ic + '</svg>';
  }
  function satir(y, en, renk, op) {
    return '<rect x="22" y="' + y + '" width="' + en + '" height="7" rx="3.5" fill="' + renk + '" opacity="' + (op || .3) + '"/>';
  }

  /* ==================================================================
     ÖĞRETMEN MAKETLERİ
     ================================================================== */
  function mKurum() {
    var ic = '';
    ic += '<path d="M160 44 L288 82 H32 Z" fill="' + KIRMIZI + '" opacity=".9"/>';
    ic += '<rect x="44" y="82" width="232" height="104" rx="6" fill="#FBF7F2" stroke="#E7D9CC" stroke-width="1.6"/>';
    var katlar = [['5. Sınıflar', 96], ['8. Sınıflar', 126], ['10. Sınıflar', 156]];
    katlar.forEach(function (k, i) {
      ic += '<text x="56" y="' + (k[1] + 12) + '" font-size="9.5" font-weight="700" fill="#7A5230">' + k[0] + '</text>';
      for (var d = 0; d < 3; d++) {
        ic += '<rect x="' + (140 + d * 44) + '" y="' + k[1] + '" width="38" height="17" rx="5" fill="' + MAVI + '" opacity="' + (0.88 - d * 0.16) + '"/>';
        ic += '<text x="' + (159 + d * 44) + '" y="' + (k[1] + 12) + '" font-size="8.5" font-weight="700" fill="#fff" text-anchor="middle">' +
              (i === 0 ? 5 : (i === 1 ? 8 : 10)) + '-' + 'ABC'.charAt(d) + '</text>';
      }
    });
    ic += '<rect x="146" y="176" width="28" height="10" rx="2" fill="#8B5E3C"/>';
    return pencere('Kurumlarım & Sınıflarım', KIRMIZI, ic);
  }

  function mListe() {
    var ic = '<rect x="18" y="42" width="284" height="16" rx="5" fill="#F3F7FA"/>' +
      '<text x="30" y="54" font-size="9" font-weight="700" fill="#5B7590">Öğrenci</text>' +
      '<text x="196" y="54" font-size="9" font-weight="700" fill="#5B7590">Artı / Eksi</text>' +
      '<text x="262" y="54" font-size="9" font-weight="700" fill="#5B7590">Puan</text>';
    var adlar = ['Ali Y.', 'Zeynep K.', 'Ömer D.', 'Elif S.'];
    var renkler = [MAVI, MOR, TURUNCU, YESIL2];
    var puan = [92, 78, 85, 96];
    adlar.forEach(function (a, i) {
      var y = 66 + i * 30;
      ic += '<circle cx="34" cy="' + (y + 9) + '" r="9" fill="' + renkler[i] + '" opacity=".85"/>';
      ic += '<text x="34" y="' + (y + 12) + '" font-size="8.5" font-weight="700" fill="#fff" text-anchor="middle">' + a.charAt(0) + '</text>';
      ic += '<text x="50" y="' + (y + 12) + '" font-size="9.5" fill="#3A5670">' + a + '</text>';
      ic += '<circle cx="204" cy="' + (y + 9) + '" r="9" fill="#E8F8F2" stroke="' + YESIL + '" stroke-width="1.4"/>';
      ic += '<path d="M199.5 ' + (y + 9) + 'h9M204 ' + (y + 4.5) + 'v9" stroke="' + YESIL + '" stroke-width="1.8" stroke-linecap="round"/>';
      ic += '<circle cx="228" cy="' + (y + 9) + '" r="9" fill="#FDECEA" stroke="' + KIRMIZI + '" stroke-width="1.4"/>';
      ic += '<path d="M223.5 ' + (y + 9) + 'h9" stroke="' + KIRMIZI + '" stroke-width="1.8" stroke-linecap="round"/>';
      ic += '<rect x="256" y="' + (y + 1) + '" width="36" height="17" rx="8.5" fill="#FFF4E3"/>';
      ic += '<text x="274" y="' + (y + 13) + '" font-size="9" font-weight="800" fill="#B9770E" text-anchor="middle">' + puan[i] + '</text>';
      if (i < 3) ic += '<path d="M18 ' + (y + 24) + 'h284" stroke="#F0E6DC" stroke-width="1"/>';
    });
    return pencere('Sınıf Listesi', YESIL, ic);
  }

  function mKura() {
    var ic = '';
    ic += '<rect x="26" y="70" width="62" height="62" rx="14" fill="#fff" stroke="' + KIRMIZI + '" stroke-width="3"/>';
    [[44, 88], [70, 88], [57, 101], [44, 114], [70, 114]].forEach(function (n) {
      ic += '<circle cx="' + n[0] + '" cy="' + n[1] + '" r="5" fill="' + KIRMIZI + '"/>';
    });
    ic += '<rect x="104" y="60" width="190" height="34" rx="10" fill="#E8F8F2" stroke="' + YESIL + '" stroke-width="2"/>';
    ic += '<text x="199" y="82" font-size="13" font-weight="800" fill="#0E7A68" text-anchor="middle">Zeynep K.</text>';
    ['Ali Y.', 'Ömer D.', 'Elif S.'].forEach(function (a, i) {
      var y = 104 + i * 26;
      ic += '<rect x="104" y="' + y + '" width="190" height="20" rx="7" fill="#F6F9FB"/>';
      ic += '<text x="116" y="' + (y + 14) + '" font-size="9.5" fill="#8CA3B5">' + a + '</text>';
      ic += '<rect x="252" y="' + (y + 4) + '" width="32" height="12" rx="6" fill="#EDF3F7"/>';
    });
    ic += '<text x="57" y="150" font-size="9" font-weight="700" fill="#A6836E" text-anchor="middle">Kura</text>';
    return pencere('Kurayla Seç', KIRMIZI, ic);
  }

  function mEtkinlik() {
    var ic = '';
    var k = [['Kelime Avı', MOR], ['Hafıza', TURUNCU], ['Eşleştir', YESIL2]];
    k.forEach(function (x, i) {
      var cx = 24 + i * 96;
      ic += '<rect x="' + cx + '" y="46" width="84" height="96" rx="10" fill="#fff" stroke="#E7D9CC" stroke-width="1.6"/>';
      ic += '<rect x="' + cx + '" y="46" width="84" height="5" rx="2.5" fill="' + x[1] + '"/>';
      ic += '<circle cx="' + (cx + 42) + '" cy="82" r="18" fill="' + x[1] + '" opacity=".14"/>';
      ic += '<path d="M' + (cx + 34) + ' 76 h16 M' + (cx + 34) + ' 84 h11" stroke="' + x[1] + '" stroke-width="3" stroke-linecap="round"/>';
      ic += '<text x="' + (cx + 42) + '" y="116" font-size="9.5" font-weight="700" fill="#3A5670" text-anchor="middle">' + x[0] + '</text>';
      ic += '<rect x="' + (cx + 20) + '" y="124" width="44" height="13" rx="6.5" fill="#F3F7FA"/>';
      ic += '<text x="' + (cx + 42) + '" y="134" font-size="8" font-weight="700" fill="' + x[1] + '" text-anchor="middle">Hazır</text>';
    });
    ic += satir(154, 150, '#C9B7A8', .5) + satir(168, 90, '#C9B7A8', .35);
    return pencere('Etkinlikler & Oyunlar', MOR, ic);
  }

  function mGorev() {
    var ic = '';
    ic += '<rect x="22" y="52" width="140" height="106" rx="10" fill="#fff" stroke="#E7D9CC" stroke-width="1.6"/>';
    ic += '<path d="M22 62a10 10 0 0 1 10-10h120a10 10 0 0 1 10 10v12H22z" fill="' + TURUNCU + '" opacity=".92"/>';
    ic += '<text x="34" y="68" font-size="9.5" font-weight="700" fill="#fff">Yeni görev</text>';
    ic += satir(88, 110, TURUNCU, .45) + satir(102, 84, TURUNCU, .3) + satir(116, 98, TURUNCU, .22);
    ic += '<rect x="34" y="132" width="60" height="16" rx="8" fill="#FFF4E3"/>';
    ic += '<text x="64" y="144" font-size="8.5" font-weight="700" fill="#B9770E" text-anchor="middle">3 gün</text>';
    ic += '<path d="M176 105 h34" stroke="' + YESIL + '" stroke-width="3" stroke-linecap="round"/>';
    ic += '<path d="M204 98 l9 7 -9 7z" fill="' + YESIL + '"/>';
    ic += '<rect x="228" y="48" width="64" height="114" rx="12" fill="#fff" stroke="#3A5670" stroke-width="2.4"/>';
    ic += '<rect x="248" y="54" width="24" height="4" rx="2" fill="#3A5670" opacity=".4"/>';
    ic += '<rect x="236" y="70" width="48" height="26" rx="6" fill="#E8F8F2" stroke="' + YESIL + '" stroke-width="1.2"/>';
    ic += '<path d="M244 83 l5 5 10 -11" stroke="' + YESIL + '" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    ic += '<rect x="236" y="102" width="48" height="8" rx="4" fill="#EDF3F7"/>';
    ic += '<rect x="236" y="116" width="34" height="8" rx="4" fill="#EDF3F7"/>';
    ic += '<circle cx="260" cy="150" r="7" fill="#EDF3F7"/>';
    return pencere('Görev Gönder', TURUNCU, ic);
  }

  function mSonuc() {
    var ic = '<path d="M28 158 h268" stroke="#D9C7B8" stroke-width="1.6"/>';
    var v = [54, 82, 66, 96, 74, 88];
    var r = [MAVI, YESIL, TURUNCU, MOR, KIRMIZI, YESIL2];
    v.forEach(function (h, i) {
      var x = 40 + i * 42;
      ic += '<rect x="' + x + '" y="' + (158 - h) + '" width="26" height="' + h + '" rx="5" fill="' + r[i] + '" opacity=".85"/>';
      ic += '<text x="' + (x + 13) + '" y="' + (152 - h) + '" font-size="8.5" font-weight="700" fill="#6B4A38" text-anchor="middle">' + h + '</text>';
    });
    ic += '<rect x="28" y="42" width="104" height="16" rx="8" fill="#E8F8F2"/>';
    ic += '<text x="80" y="54" font-size="9" font-weight="700" fill="#0E7A68" text-anchor="middle">Sınıf ortalaması</text>';
    ic += '<text x="28" y="176" font-size="8.5" fill="#A6836E">Sınav · Ödev · Performans · Davranış</text>';
    return pencere('Sonuçlar & Karne', YESIL2, ic);
  }

  /* ==================================================================
     ÖĞRENCİ MAKETLERİ
     ================================================================== */
  function oGorev() {
    var ic = '';
    var g = [['Ünite 2 kelimeleri', true], ['Dinle ve seç', true], ['Boşluk doldurma', false]];
    g.forEach(function (x, i) {
      var y = 50 + i * 34;
      ic += '<rect x="20" y="' + y + '" width="280" height="28" rx="9" fill="' + (x[1] ? '#E8F8F2' : '#F6F9FB') + '"/>';
      ic += '<circle cx="38" cy="' + (y + 14) + '" r="9" fill="' + (x[1] ? YESIL : '#fff') + '" stroke="' + (x[1] ? YESIL : '#C9D6E0') + '" stroke-width="1.8"/>';
      if (x[1]) ic += '<path d="M33.5 ' + (y + 14) + ' l3.4 3.4 l6.4 -7" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      ic += '<text x="56" y="' + (y + 18) + '" font-size="10" fill="#3A5670">' + x[0] + '</text>';
      ic += '<rect x="242" y="' + (y + 6) + '" width="48" height="16" rx="8" fill="#fff"/>';
      ic += '<text x="266" y="' + (y + 17) + '" font-size="8.5" font-weight="700" fill="' + (x[1] ? '#0E7A68' : '#B9770E') + '" text-anchor="middle">' +
            (x[1] ? 'bitti' : '2 gün') + '</text>';
    });
    ic += '<rect x="20" y="156" width="280" height="24" rx="9" fill="#FFF4E3"/>';
    ic += '<text x="160" y="172" font-size="9.5" font-weight="700" fill="#B9770E" text-anchor="middle">Öğretmenin gönderdiği görevler burada</text>';
    return pencere('Görevlerim', TURUNCU, ic);
  }

  function oPuan() {
    var ic = '';
    ic += '<circle cx="86" cy="112" r="42" fill="none" stroke="#EDF3F7" stroke-width="13"/>';
    ic += '<circle cx="86" cy="112" r="42" fill="none" stroke="' + YESIL + '" stroke-width="13" stroke-linecap="round" stroke-dasharray="198 264" transform="rotate(-90 86 112)"/>';
    ic += '<text x="86" y="118" font-size="20" font-weight="800" fill="#0E7A68" text-anchor="middle">75</text>';
    ic += '<text x="86" y="170" font-size="9" font-weight="700" fill="#6B4A38" text-anchor="middle">Bu haftaki puanın</text>';
    var rz = [['Kelime', YESIL2, 84], ['Okuma', MOR, 62], ['Konuşma', TURUNCU, 46]];
    rz.forEach(function (r, i) {
      var y = 52 + i * 42;
      ic += '<circle cx="176" cy="' + (y + 16) + '" r="15" fill="' + r[1] + '" opacity=".16"/>';
      ic += '<path d="M176 ' + (y + 6) + ' l3 6.6 7.2 1 -5.2 5 1.2 7.2 -6.2 -3.4 -6.2 3.4 1.2 -7.2 -5.2 -5 7.2 -1z" fill="' + r[1] + '"/>';
      ic += '<text x="200" y="' + (y + 14) + '" font-size="10" font-weight="700" fill="#3A5670">' + r[0] + '</text>';
      ic += '<rect x="200" y="' + (y + 20) + '" width="' + r[2] + '" height="7" rx="3.5" fill="' + r[1] + '" opacity=".55"/>';
    });
    return pencere('Puanlarım & Rozetlerim', YESIL, ic);
  }

  function oOyun() {
    var ic = '';
    var o = [['Kelime Avı', MOR], ['Hafıza Kartı', TURUNCU], ['Harf Yarışı', MAVI], ['Sözlük', YESIL2]];
    o.forEach(function (x, i) {
      var cx = 22 + (i % 2) * 150, cy = 46 + Math.floor(i / 2) * 76;
      ic += '<rect x="' + cx + '" y="' + cy + '" width="138" height="64" rx="11" fill="' + x[1] + '" opacity=".1"/>';
      ic += '<circle cx="' + (cx + 34) + '" cy="' + (cy + 32) + '" r="18" fill="' + x[1] + '" opacity=".85"/>';
      ic += '<path d="M' + (cx + 26) + ' ' + (cy + 32) + ' h16 M' + (cx + 34) + ' ' + (cy + 24) + ' v16" stroke="#fff" stroke-width="3" stroke-linecap="round"/>';
      ic += '<text x="' + (cx + 62) + '" y="' + (cy + 30) + '" font-size="10" font-weight="700" fill="#3A5670">' + x[0] + '</text>';
      ic += '<rect x="' + (cx + 62) + '" y="' + (cy + 38) + '" width="56" height="7" rx="3.5" fill="' + x[1] + '" opacity=".4"/>';
    });
    return pencere('Oyunlar & Sözlük', MOR, ic);
  }

  function oKarne() {
    var ic = '<path d="M28 156 h268" stroke="#D9C7B8" stroke-width="1.6"/>';
    var v = [62, 78, 92, 70], r = [MAVI, YESIL, TURUNCU, MOR], ad = ['1.Yz', '2.Yz', 'Ödev', 'Perf'];
    v.forEach(function (h, i) {
      var x = 52 + i * 62;
      ic += '<rect x="' + x + '" y="' + (156 - h) + '" width="34" height="' + h + '" rx="6" fill="' + r[i] + '" opacity=".85"/>';
      ic += '<text x="' + (x + 17) + '" y="' + (150 - h) + '" font-size="9" font-weight="700" fill="#6B4A38" text-anchor="middle">' + h + '</text>';
      ic += '<text x="' + (x + 17) + '" y="172" font-size="8" fill="#8CA3B5" text-anchor="middle">' + ad[i] + '</text>';
    });
    /* ortalama rozeti SOLDA: sağda 3. sütunun değer yazısıyla çakışıyordu */
    ic += '<rect x="24" y="42" width="104" height="18" rx="9" fill="#E8F8F2"/>';
    ic += '<text x="76" y="55" font-size="9.5" font-weight="800" fill="#0E7A68" text-anchor="middle">Ortalama 75,5</text>';
    return pencere('Karnem', MAVI, ic);
  }

  /* ==================================================================
     İÇERİK
     ================================================================== */
  var VERI = {
    ogretmen: {
      ad: 'Öğretmen paneli',
      alt: 'Kurumunu, sınıflarını ve listelerini tek yerden yönet.',
      renk: '#16A085',
      ekranlar: [
        { ad: 'Kurumlarım & Sınıflarım', not: 'Okul → seviye → şube. Her sınıf bir kapı; dokun, listesi açılsın.', svg: mKurum },
        { ad: 'Sınıf listesi', not: 'Öğrenciler, artı/eksi puan, ödev ve sınav notları aynı satırda.', svg: mListe },
        { ad: 'Kurayla seç', not: 'Söz sırası, ödev dağıtımı, tahtaya kalkacak öğrenci — havuzdan çeker.', svg: mKura },
        { ad: 'Etkinlikler & oyunlar', not: 'Kitap etkinlikleri, oyunlar ve çalışma kâğıtları sınıfın altında hazır.', svg: mEtkinlik },
        { ad: 'Görev gönder', not: 'Görevi sınıfa ya da tek öğrenciye yolla; telefonunda görür, yaptıkça işaretlenir.', svg: mGorev },
        { ad: 'Sonuçlar & karne', not: 'Sınav, ödev, performans ve davranış tek tabloda; ortalama kendiliğinden.', svg: mSonuc }
      ]
    },
    ogrenci: {
      ad: 'Öğrenci paneli',
      alt: 'Görevlerini, puanlarını ve oyunlarını tek yerden gör.',
      renk: '#7C3AED',
      ekranlar: [
        { ad: 'Görevlerim', not: 'Öğretmenin gönderdiği görevler, son teslim günüyle birlikte.', svg: oGorev },
        { ad: 'Puanlarım & rozetlerim', not: 'Haftalık puan, beceri rozetleri, ilerleme halkası.', svg: oPuan },
        { ad: 'Oyunlar & sözlük', not: 'Kelime avı, hafıza kartları, harf yarışı ve sınıf sözlüğü.', svg: oOyun },
        { ad: 'Karnem', not: 'Yazılılar, ödev ve performans notların; ortalaman her an önünde.', svg: oKarne }
      ]
    }
  };

  /* rol simgeleri (kartların ve pencere başlığının ikonu) */
  function rolSvg(rol) {
    if (rol === 'ogretmen') {
      return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
        '<rect x="6" y="8" width="52" height="34" rx="4" fill="#2f6f52"/>' +
        '<rect x="9" y="11" width="46" height="28" rx="2.5" fill="#3d8b66"/>' +
        '<g stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".92">' +
          '<path class="kdt-tebesir" d="M15 20h20"/><path class="kdt-tebesir kdt-g2" d="M15 28h26"/></g>' +
        '<rect x="4" y="42" width="24" height="4" rx="2" fill="#c8a165"/>' +
        '<circle cx="44" cy="48" r="8" fill="' + TURUNCU + '"/>' +
        '<path d="M32 62a12 12 0 0 1 24 0z" fill="' + TURUNCU + '" opacity=".85"/></svg>';
    }
    /* sırt çantası: sap + kapak + ön cep (asma kilide benzemesin diye
       kapak ve cep belirgin, gövde geniş) */
    return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
      '<path d="M24 22a8 8 0 0 1 16 0" fill="none" stroke="' + MOR + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M22 20h20a11 11 0 0 1 11 11v21a6 6 0 0 1-6 6H17a6 6 0 0 1-6-6V31a11 11 0 0 1 11-11z" fill="' + MOR + '"/>' +
      '<path d="M11 36h42v-5a11 11 0 0 0-11-11H22a11 11 0 0 0-11 11z" fill="#fff" opacity=".22"/>' +
      '<path d="M11 36h42" stroke="#fff" stroke-width="2" opacity=".5"/>' +
      '<rect x="23" y="41" width="18" height="13" rx="4" fill="#fff" opacity=".95"/>' +
      '<path class="kdt-tebesir" d="M27 47h10" stroke="' + MOR + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="51" cy="15" r="8" fill="' + TURUNCU + '"/>' +
      '<path d="M51 9.6l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#fff"/></svg>';
  }

  function kartHtml(rol) {
    var v = VERI[rol];
    return '<button type="button" class="kdt-kart kdt-' + rol + '" onclick="KidefTanitim.ac(\'' + rol + '\')">' +
      '<span class="kdt-kart-ik">' + rolSvg(rol) + '</span>' +
      '<span class="kdt-kart-yazi"><b>' + (rol === 'ogretmen' ? 'Öğretmen misin?' : 'Öğrenci misin?') + '</b>' +
      '<small>' + esc(v.alt) + '</small></span>' +
      '<span class="kdt-kart-ok">İçeriye bak</span></button>';
  }

  function kartlar(mount) {
    if (typeof mount === 'string') mount = document.getElementById(mount);
    if (!mount) return;
    stilKur();
    mount.innerHTML = '<div class="kdt-kartlar">' + kartHtml('ogrenci') + kartHtml('ogretmen') + '</div>';
  }

  /* ---------------------------------------------------------------- pencere */
  function ac(rol) {
    stilKur();
    kapat();
    var v = VERI[rol] || VERI.ogretmen;
    var k = document.createElement('div');
    k.id = 'kdtPencere';
    k.innerHTML =
      '<div class="kdt-panel" role="dialog" aria-modal="true" aria-label="' + esc(v.ad) + '">' +
        '<div class="kdt-bas" style="--kdt:' + v.renk + '">' +
          '<span class="kdt-bas-ik">' + rolSvg(rol) + '</span>' +
          '<span class="kdt-bas-yazi"><b>' + esc(v.ad) + '</b><small>' + esc(v.alt) + '</small></span>' +
          '<button type="button" class="kdt-kapat" title="Kapat" aria-label="Kapat">&times;</button>' +
        '</div>' +
        '<div class="kdt-govde"><div class="kdt-izgara">' +
          v.ekranlar.map(function (e) {
            return '<figure class="kdt-madde" tabindex="0">' + e.svg() +
              '<figcaption><b>' + esc(e.ad) + '</b><span>' + esc(e.not) + '</span></figcaption></figure>';
          }).join('') +
        '</div>' +
        '<p class="kdt-not">Çizimler paneli tanıtmak içindir; gerçek ekranlar kendi sınıfınla dolar.</p>' +
        '</div>' +
      '</div>' +
      '<div class="kdt-buyut" hidden><div class="kdt-buyut-ic"></div></div>';
    document.body.appendChild(k);
    document.body.classList.add('kdt-acik');

    k.querySelector('.kdt-kapat').addEventListener('click', kapat);
    k.addEventListener('click', function (e) { if (e.target === k) kapat(); });

    var buyut = k.querySelector('.kdt-buyut');
    [].forEach.call(k.querySelectorAll('.kdt-madde'), function (f) {
      f.addEventListener('click', function () {
        buyut.querySelector('.kdt-buyut-ic').innerHTML = f.innerHTML;
        buyut.hidden = false;
      });
      f.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f.click(); }
      });
    });
    buyut.addEventListener('click', function () { buyut.hidden = true; });

    if (!window.__kdtEsc) {
      window.__kdtEsc = function (e) {
        if (e.key !== 'Escape') return;
        var b = document.querySelector('#kdtPencere .kdt-buyut');
        if (b && !b.hidden) { b.hidden = true; return; }
        kapat();
      };
    }
    document.addEventListener('keydown', window.__kdtEsc);
  }

  function kapat() {
    var k = document.getElementById('kdtPencere');
    if (k) k.remove();
    document.body.classList.remove('kdt-acik');
    if (window.__kdtEsc) document.removeEventListener('keydown', window.__kdtEsc);
  }

  /* ---------------------------------------------------------------- stil
     z-index 2147483000: giriş penceresi (#login-modal) 100000001 kullanıyor,
     tanıtım penceresi onun da üstünde kalmalı. */
  function stilKur() {
    if (document.getElementById('kdtStil')) return;
    var s = document.createElement('style');
    s.id = 'kdtStil';
    s.textContent =
      '.kdt-kartlar{display:grid;grid-template-columns:repeat(auto-fit,minmax(228px,1fr));gap:12px;margin:0 0 18px}' +
      '.kdt-kart{display:flex;align-items:center;gap:12px;width:100%;padding:13px 14px;border-radius:15px;cursor:pointer;' +
        'border:1.6px solid #E7D9CC;background:linear-gradient(180deg,#FFFDF9,#FFF6EE);font-family:inherit;text-align:left;' +
        'transition:transform .18s,box-shadow .18s,border-color .18s}' +
      '.kdt-kart:hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(120,80,40,.16);border-color:#E2B894}' +
      '.kdt-kart:focus-visible{outline:3px solid #16A085;outline-offset:2px}' +
      '.kdt-kart-ik svg{width:46px;height:46px;display:block;flex:0 0 auto}' +
      '.kdt-kart-yazi{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}' +
      '.kdt-kart-yazi b{font-size:.98rem;color:#7A4A20}' +
      '.kdt-kart-yazi small{font-size:.76rem;color:#8B6A57;line-height:1.35}' +
      '.kdt-kart-ok{flex:0 0 auto;font-size:.74rem;font-weight:800;color:#0E7A68;background:#E8F8F2;' +
        'border-radius:999px;padding:5px 11px;white-space:nowrap}' +
      '.kdt-ogretmen .kdt-kart-ok{color:#8A4B12;background:#FFF0DF}' +
      'body.kdt-acik{overflow:hidden}' +
      '#kdtPencere{position:fixed;inset:0;z-index:2147483000;background:rgba(30,18,10,.55);' +
        'display:flex;align-items:center;justify-content:center;padding:18px;animation:kdtGir .18s ease-out}' +
      '@keyframes kdtGir{from{opacity:0}to{opacity:1}}' +
      '#kdtPencere .kdt-panel{width:100%;max-width:1020px;max-height:92vh;display:flex;flex-direction:column;' +
        'background:#FFFDFA;border-radius:20px;overflow:hidden;box-shadow:0 26px 70px rgba(0,0,0,.4)}' +
      '#kdtPencere .kdt-bas{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--kdt,#16A085);color:#fff}' +
      '#kdtPencere .kdt-bas-ik svg{width:40px;height:40px;display:block}' +
      '#kdtPencere .kdt-bas-yazi{display:flex;flex-direction:column;flex:1;min-width:0}' +
      '#kdtPencere .kdt-bas-yazi b{font-size:1.1rem}' +
      '#kdtPencere .kdt-bas-yazi small{font-size:.8rem;opacity:.92}' +
      '#kdtPencere .kdt-kapat{border:0;background:rgba(255,255,255,.18);color:#fff;width:34px;height:34px;' +
        'border-radius:10px;font-size:1.3rem;line-height:1;cursor:pointer;flex:0 0 auto;font-family:inherit}' +
      '#kdtPencere .kdt-kapat:hover{background:rgba(255,255,255,.3)}' +
      '#kdtPencere .kdt-govde{overflow:auto;padding:16px}' +
      '#kdtPencere .kdt-izgara{display:grid;grid-template-columns:repeat(auto-fit,minmax(268px,1fr));gap:14px}' +
      '#kdtPencere .kdt-madde{margin:0;padding:10px;border:1.4px solid #EEE2D6;border-radius:14px;background:#fff;' +
        'cursor:zoom-in;transition:transform .16s,box-shadow .16s,border-color .16s}' +
      '#kdtPencere .kdt-madde:hover{transform:translateY(-3px);box-shadow:0 12px 24px rgba(120,80,40,.14);border-color:#E2B894}' +
      '#kdtPencere .kdt-madde:focus-visible{outline:3px solid #16A085;outline-offset:2px}' +
      '.kdt-ekran{width:100%;height:auto;display:block;font-family:inherit}' +
      '#kdtPencere figcaption{display:block;margin-top:8px}' +
      '#kdtPencere figcaption b{display:block;font-size:.92rem;color:#7A4A20;margin-bottom:2px}' +
      '#kdtPencere figcaption span{display:block;font-size:.78rem;color:#7d6552;line-height:1.5}' +
      '#kdtPencere .kdt-not{margin:14px 2px 0;font-size:.76rem;color:#A6836E;text-align:center}' +
      '#kdtPencere .kdt-buyut{position:fixed;inset:0;z-index:2147483001;background:rgba(20,12,6,.86);display:flex;' +
        'align-items:center;justify-content:center;padding:22px;cursor:zoom-out}' +
      '#kdtPencere .kdt-buyut[hidden]{display:none}' +
      '#kdtPencere .kdt-buyut-ic{max-width:860px;width:100%}' +
      '#kdtPencere .kdt-buyut-ic figcaption{margin-top:12px;text-align:center;color:#fff}' +
      '#kdtPencere .kdt-buyut-ic figcaption b{display:block;font-size:1.05rem;margin-bottom:3px;color:#fff}' +
      '#kdtPencere .kdt-buyut-ic figcaption span{font-size:.86rem;opacity:.85;color:#fff}' +
      '@keyframes kdtCiz{0%,12%{stroke-dashoffset:34}45%,85%{stroke-dashoffset:0}100%{stroke-dashoffset:34}}' +
      '.kdt-tebesir{stroke-dasharray:34;animation:kdtCiz 4.6s ease-in-out infinite}' +
      '.kdt-tebesir.kdt-g2{animation-delay:.5s}' +
      '@media (max-width:560px){#kdtPencere{padding:8px}#kdtPencere .kdt-panel{max-height:96vh}' +
        '#kdtPencere .kdt-govde{padding:12px}#kdtPencere .kdt-izgara{grid-template-columns:1fr}' +
        '.kdt-kart-ok{display:none}}' +
      '@media (prefers-reduced-motion:reduce){.kdt-tebesir{animation:none;stroke-dashoffset:0}' +
        '.kdt-kart,#kdtPencere .kdt-madde{transition:none}#kdtPencere{animation:none}}';
    (document.head || document.documentElement).appendChild(s);
  }

  window.KidefTanitim = { ac: ac, kapat: kapat, kartlar: kartlar, kartHtml: kartHtml };
})();
