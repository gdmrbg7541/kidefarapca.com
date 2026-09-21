/* ==========================================================================
   TEST KAPIŞMASI · DERS LİSTESİ (oyunlar/tk_liste.js)
   --------------------------------------------------------------------------
   Tarayıcının kendi <select> kutusu seçeneklerin içine resim koymaya izin
   vermiyor. Bu yüzden #lesson-select yerinde kalır (oyunun bütün mantığı
   onu okur/yazar) ama GÖRÜNMEZ olur; üstüne aynı bilgiyi gösteren bir
   liste kurulur:
     · her dersin başında kendine özel ANİMASYONLU simge,
     · gruplar AKORDİYON: Harfler · 5 · 6 · 7 · 8 · 9 · 10. Sınıf (başta hepsi kapalı, tek-açılır),
     · kilitli dersler kilit simgesiyle, tıklanmaz.
   Seçim yapılınca asıl <select>'e yazılır ve 'change' olayı gönderilir;
   testkapismasi.js hiçbir şey fark etmez. Seçenekler yeniden kurulunca
   (oyuncu modu değişince) MutationObserver listeyi kendiliğinden tazeler.
   Yeni ders eklenirse simge haritasında yoksa varsayılan kitap simgesi çıkar.
   ========================================================================== */
(function () {
    'use strict';
    var sel = document.getElementById('lesson-select');
    if (!sel || sel.getAttribute('data-tkl')) return;
    sel.setAttribute('data-tkl', '1');

    /* ---------------------------------------------------------- SİMGELER
       48x48; hareketli parçalar tkl-* sınıflı (bkz. tk_liste.css) */
    var AR = "font-family=\"'Noto Naskh Arabic','Arakom',serif\"";
    var S = {
        /* --- HARFLER --- */
        'alfabe-birlestirme':        /* ب ile ا kartları birbirine yaklaşır, birleşip «با» olur, parıltı çıkar */
            '<g class="tka-sag"><rect x="26" y="11" width="19" height="26" rx="5" fill="#FFF1CF" stroke="#F39C12" stroke-width="1.8"/>' +
            '<text x="35.5" y="30.5" text-anchor="middle" font-size="19" fill="#B7650B" ' + AR + '>ب</text></g>' +
            '<g class="tka-sol"><rect x="3" y="11" width="19" height="26" rx="5" fill="#E8F6F1" stroke="#16A085" stroke-width="1.8"/>' +
            '<text x="12.5" y="30.5" text-anchor="middle" font-size="19" fill="#0E7C66" ' + AR + '>ا</text></g>' +
            '<g class="tka-birlesik"><rect x="7" y="11" width="34" height="26" rx="6" fill="#FDE7EC" stroke="#E5487A" stroke-width="1.8"/>' +
            '<text x="24" y="30.5" text-anchor="middle" font-size="19" fill="#C2185B" ' + AR + '>با</text></g>' +
            '<path class="tka-parla" d="M40 2 l1.3 3.2 3.2 1.3 -3.2 1.3 -1.3 3.2 -1.3 -3.2 -3.2 -1.3 3.2 -1.3 Z" fill="#F6C344"/>' +
            '<path class="tka-parla p3" d="M7 39 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill="#F6C344"/>',
        'alfabe-cizgi':              /* kalem ucu, çizginin üstünde ب'yi yazar, sonra noktasını koyar */
            '<path d="M4 33 H44" stroke="#9FB3C8" stroke-width="2" stroke-dasharray="3 3"/>' +
            '<path class="tka-ciz" pathLength="100" d="M36 18 C38 26 36 33 24 33 C13 33 9 29 10 22" fill="none" stroke="#2E86DE" stroke-width="3.4" stroke-linecap="round"/>' +
            '<circle class="tka-nokta" cx="23" cy="40.5" r="2.4" fill="#2E86DE"/>' +
            '<g class="tka-kalem"><g transform="translate(36 18)">' +      /* ucu (0,0)'da: harfin başlangıç noktası */
                '<path d="M4.39 -1.27 L1.27 -4.39 L7.28 -10.4 L10.4 -7.28 Z" fill="#F39C12"/>' +
                '<path d="M10.4 -7.28 L7.28 -10.4 L8.69 -11.81 L11.81 -8.69 Z" fill="#E5487A"/>' +
                '<path d="M0 0 L4.39 -1.27 L1.27 -4.39 Z" fill="#F5CBA7"/>' +
                '<path d="M0 0 L1.75 -0.51 L0.51 -1.75 Z" fill="#5A4636"/></g></g>',
        /* --- 9. SINIF --- */
        'grade9-unit1-lesson1':      /* Selamlaşma: sallanan el */
            '<g class="tka-el"><path d="M15 29 V15.5 a2.4 2.4 0 0 1 4.8 0 V24 V11.5 a2.4 2.4 0 0 1 4.8 0 V23 V12.8 a2.4 2.4 0 0 1 4.8 0 V24 V16.8 a2.4 2.4 0 0 1 4.8 0 V30 c0 7.2 -4.6 11.6 -10.8 11.6 c-4.6 0 -7.6 -2.6 -9.6 -6.8 l-3 -6 a2.2 2.2 0 0 1 3.8 -2.2 z" fill="#FFD08A" stroke="#E08E2C" stroke-width="1.5" stroke-linejoin="round"/></g>' +
            '<path class="tka-dalga" d="M38 8 q3 3 2 7 M42 5 q4 5 2 11" fill="none" stroke="#16A085" stroke-width="2" stroke-linecap="round"/>' +
            '<path class="tka-dalga d2" d="M9 9 q-3 3 -2 7" fill="none" stroke="#16A085" stroke-width="2" stroke-linecap="round"/>',
        'grade9-unit1-lesson2':      /* Tanışma: iki kişi, sırayla konuşma balonu */
            '<circle cx="14" cy="21" r="5.5" fill="#5DADE2"/><path d="M4.5 40 a9.5 9.5 0 0 1 19 0 z" fill="#2E86DE"/>' +
            '<circle cx="34" cy="21" r="5.5" fill="#F5B041"/><path d="M24.5 40 a9.5 9.5 0 0 1 19 0 z" fill="#E67E22"/>' +
            '<g class="tka-balon1"><rect x="4" y="3" width="15" height="10" rx="4" fill="#fff" stroke="#2E86DE" stroke-width="1.5"/><path d="M9 13 l2 3 2 -3" fill="#fff" stroke="#2E86DE" stroke-width="1.5" stroke-linejoin="round"/><circle cx="8.5" cy="8" r="1.1" fill="#2E86DE"/><circle cx="11.5" cy="8" r="1.1" fill="#2E86DE"/><circle cx="14.5" cy="8" r="1.1" fill="#2E86DE"/></g>' +
            '<g class="tka-balon2"><rect x="29" y="3" width="15" height="10" rx="4" fill="#fff" stroke="#E67E22" stroke-width="1.5"/><path d="M35 13 l2 3 2 -3" fill="#fff" stroke="#E67E22" stroke-width="1.5" stroke-linejoin="round"/><circle cx="33.5" cy="8" r="1.1" fill="#E67E22"/><circle cx="36.5" cy="8" r="1.1" fill="#E67E22"/><circle cx="39.5" cy="8" r="1.1" fill="#E67E22"/></g>',
        'grade9-unit2-lesson1':      /* Sınıf Eşyaları: kitap + kalem */
            '<path d="M6 12 h15 a3 3 0 0 1 3 3 v25 a3 3 0 0 0 -3 -3 h-15 z" fill="#E8F6F1" stroke="#16A085" stroke-width="1.8" stroke-linejoin="round"/>' +
            '<path d="M42 12 h-15 a3 3 0 0 0 -3 3 v25 a3 3 0 0 1 3 -3 h15 z" fill="#E8F6F1" stroke="#16A085" stroke-width="1.8" stroke-linejoin="round"/>' +
            '<path d="M10 18 h9 M10 23 h9 M29 18 h9 M29 23 h7" stroke="#9DCFC5" stroke-width="1.6" stroke-linecap="round"/>' +
            '<g class="tka-kalem2"><rect x="30" y="-2" width="6" height="26" rx="1.5" transform="rotate(35 33 11)" fill="#F7DC6F" stroke="#D4AC0D" stroke-width="1.2"/><path d="M26 30.5 l-2.2 4.6 4.8 -1.6 z" fill="#5A4636"/></g>',
        'grade9-unit2-lesson2':      /* Yönler ve Eylemler: tabela okları */
            '<rect x="22.5" y="8" width="3" height="36" rx="1.5" fill="#8D6E63"/>' +
            '<path class="tka-sagok" d="M14 11 h18 l5 4.5 -5 4.5 h-18 z" fill="#2E86DE"/>' +
            '<path class="tka-solok" d="M34 23 h-18 l-5 4.5 5 4.5 h18 z" fill="#E67E22"/>' +
            '<ellipse cx="24" cy="44" rx="9" ry="2" fill="#D5DBDB"/>',
        'grade9-unit3-lesson1':      /* Evdeyim: ev, yanan pencere, baca dumanı */
            '<path d="M6 24 L24 9 L42 24" fill="none" stroke="#C0392B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M10 22 V42 H38 V22 L24 11 Z" fill="#FDEBD0" stroke="#E59866" stroke-width="1.6" stroke-linejoin="round"/>' +
            '<rect x="31" y="9" width="5" height="9" fill="#A04000"/>' +
            '<rect x="20" y="30" width="8" height="12" rx="1.5" fill="#A04000"/>' +
            '<rect class="tka-pencere" x="13" y="25" width="6" height="6" rx="1" fill="#F7DC6F"/>' +
            '<rect class="tka-pencere p2" x="29" y="25" width="6" height="6" rx="1" fill="#F7DC6F"/>' +
            '<circle class="tka-duman" cx="33.5" cy="6" r="2.4" fill="#BFC9CA"/><circle class="tka-duman d2" cx="35.5" cy="4" r="1.8" fill="#D5DBDB"/>',
        'grade9-unit3-lesson2':      /* Odamda: yatak ve uyku */
            '<rect x="5" y="16" width="5" height="26" rx="2" fill="#8D6E63"/><rect x="38" y="26" width="5" height="16" rx="2" fill="#8D6E63"/>' +
            '<rect x="8" y="28" width="33" height="9" rx="3" fill="#5DADE2"/>' +
            '<rect x="10" y="23" width="11" height="6" rx="3" fill="#fff" stroke="#AED6F1" stroke-width="1.4"/>' +
            '<text class="tka-z" x="28" y="18" font-size="9" fill="#8E44AD" font-family="Rubik,sans-serif" font-weight="700">z</text>' +
            '<text class="tka-z z2" x="34" y="11" font-size="7" fill="#AF7AC5" font-family="Rubik,sans-serif" font-weight="700">z</text>',
        'grade9-unit4-lesson1':      /* Bir Günüm: doğan güneş */
            '<g class="tka-gunes"><circle cx="24" cy="27" r="7.5" fill="#F7B731"/>' +
            '<g class="tka-isin" stroke="#F7B731" stroke-width="2.2" stroke-linecap="round"><path d="M24 14 v-4 M33.2 17.8 l2.8 -2.8 M14.8 17.8 l-2.8 -2.8 M37 27 h4 M7 27 h4"/></g></g>' +
            '<path d="M2 36 C10 30 16 32 24 34 C32 36 38 31 46 34 V46 H2 Z" fill="#58D68D"/>' +
            '<path d="M2 40 C12 36 20 40 30 38 C38 36 42 39 46 38 V46 H2 Z" fill="#28B463"/>',
        'grade9-unit4-lesson2':      /* Günlük Rutin: dönen saat kolları */
            '<circle cx="24" cy="25" r="16" fill="#fff" stroke="#5E81AC" stroke-width="3"/>' +
            '<path d="M24 11.5 v2.4 M24 36.1 v2.4 M10.5 25 h2.4 M35.1 25 h2.4" stroke="#8FA4C1" stroke-width="2" stroke-linecap="round"/>' +
            '<path class="tka-akrep" d="M24 25 V17.5" stroke="#2C3E50" stroke-width="3" stroke-linecap="round"/>' +
            '<path class="tka-yelkovan" d="M24 25 V13" stroke="#E74C3C" stroke-width="2" stroke-linecap="round"/>' +
            '<circle cx="24" cy="25" r="2" fill="#2C3E50"/>' +
            '<path d="M13 6 l-4 4 M35 6 l4 4" stroke="#5E81AC" stroke-width="3" stroke-linecap="round"/>',
        /* --- 10. SINIF --- */
        'grade10-unit1-lesson1':     /* Güzel Davranışlar: atan kalp + parıltı */
            '<path class="tka-kalp" d="M24 40 C12 31 6 25 6 18 a8.5 8.5 0 0 1 18 -4 a8.5 8.5 0 0 1 18 4 c0 7 -6 13 -18 22 z" fill="#E74C3C"/>' +
            '<path d="M14 17 a4.5 4.5 0 0 1 5 -4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>' +
            '<path class="tka-parla" d="M40 4 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 Z" fill="#F6C344"/>' +
            '<path class="tka-parla p2" d="M7 36 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill="#F6C344"/>',
        'grade10-unit1-lesson2':     /* Mutlu Aile: üç kişi, üstte kalp */
            '<circle cx="12" cy="20" r="5" fill="#5DADE2"/><path d="M4 40 a8 8 0 0 1 16 0 z" fill="#2E86DE"/>' +
            '<circle cx="36" cy="20" r="5" fill="#F1948A"/><path d="M28 40 a8 8 0 0 1 16 0 z" fill="#E74C3C"/>' +
            '<circle cx="24" cy="27" r="3.8" fill="#F7DC6F"/><path d="M18 42 a6 6 0 0 1 12 0 z" fill="#F39C12"/>' +
            '<path class="tka-kalp2" d="M24 14 C19 10 17 8 17 5.5 a3.3 3.3 0 0 1 7 -1.4 a3.3 3.3 0 0 1 7 1.4 c0 2.5 -2 4.5 -7 8.5 z" fill="#E74C3C"/>',
        'grade10-unit2-lesson1':     /* Ben Kimim?: kişi + zıplayan soru işareti */
            '<circle cx="20" cy="20" r="7" fill="#AF7AC5"/><path d="M7 42 a13 13 0 0 1 26 0 z" fill="#8E44AD"/>' +
            '<g class="tka-soru"><circle cx="37" cy="12" r="8" fill="#F39C12"/>' +
            '<text x="37" y="16.5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="Rubik,sans-serif">?</text></g>',
        'grade10-unit2-lesson2':     /* Hobilerim: seken top, gölgesi büyüyüp küçülür */
            '<ellipse class="tka-golge" cx="24" cy="45" rx="10" ry="2.2" fill="#D5DBDB"/>' +
            '<g class="tka-top"><g transform="translate(24 19) scale(1.14) translate(-24 -22)"><circle cx="24" cy="22" r="11" fill="#fff" stroke="#2C3E50" stroke-width="1.6"/>' +
            '<path d="M24 16.5 l5 3.6 -1.9 5.9 h-6.2 l-1.9 -5.9 z" fill="#2C3E50"/>' +
            '<path d="M24 16.5 V11 M29 20.1 l5.2 -1.6 M27.1 26 l3.4 4.4 M20.9 26 l-3.4 4.4 M19 20.1 l-5.2 -1.6" stroke="#2C3E50" stroke-width="1.4"/></g></g>',
        'grade10-unit3-lesson1':     /* Zamanım ve Hayatım: kum akar, saat ters döner.
                                        Üst dolu kum = alt dolu kumun 180° dönmüşü → döngü dikişsiz */
            '<g class="tka-kum"><path d="M13 5 h22 M13 43 h22" stroke="#8D6E63" stroke-width="3.2" stroke-linecap="round"/>' +
            '<path d="M15 6 c0 9 7 12 7 18 c0 6 -7 9 -7 18 h18 c0 -9 -7 -12 -7 -18 c0 -6 7 -9 7 -18 z" fill="#EAF2F8" stroke="#5E81AC" stroke-width="1.8" stroke-linejoin="round"/>' +
            '<path class="tka-kumust" d="M16.6 8.5 H31.4 C31.4 14 26.4 17.4 25.4 22.4 H22.6 C21.6 17.4 16.6 14 16.6 8.5 Z" fill="#E59866"/>' +
            '<path class="tka-kumalt" d="M31.4 39.5 H16.6 C16.6 34 21.6 30.6 22.6 25.6 H25.4 C26.4 30.6 31.4 34 31.4 39.5 Z" fill="#E59866"/>' +
            '<path class="tka-dusen" d="M24 23 V38" stroke="#E59866" stroke-width="1.6" stroke-dasharray="1.6 2.2"/></g>',
        'grade10-unit3-lesson2':     /* Zamanımı Değerlendiriyorum: takvim + beliren onay */
            '<rect x="6" y="9" width="36" height="33" rx="5" fill="#fff" stroke="#16A085" stroke-width="2"/>' +
            '<path d="M6 17 h36" stroke="#16A085" stroke-width="2"/><rect x="6" y="9" width="36" height="8" rx="4" fill="#16A085"/>' +
            '<path d="M15 5 v7 M33 5 v7" stroke="#0E6655" stroke-width="3" stroke-linecap="round"/>' +
            '<g fill="#D5F5E3"><rect x="11" y="21" width="6" height="5" rx="1"/><rect x="21" y="21" width="6" height="5" rx="1"/><rect x="31" y="21" width="6" height="5" rx="1"/><rect x="11" y="30" width="6" height="5" rx="1"/></g>' +
            '<path class="tka-onay" pathLength="100" d="M21 33 l4 4 9 -9" fill="none" stroke="#E74C3C" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>',
        'grade10-unit4-lesson1':     /* Sağlıklı Yaşam: nabız çizgisi */
            '<path d="M24 41 C13 33 7 27 7 20 a8 8 0 0 1 17 -4 a8 8 0 0 1 17 4 c0 7 -6 13 -17 21 z" fill="#FADBD8" stroke="#E74C3C" stroke-width="1.8"/>' +
            '<path class="tka-nabiz" pathLength="100" d="M8.5 25 H15 L18 18.5 L22 32 L26 14.5 L29 25 H39.5" fill="none" stroke="#C0392B" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
        'grade10-unit4-lesson2':     /* Sağlıklı Beslenme: sallanan elma */
            '<g class="tka-elma"><path d="M24 15 c-4 -4 -14 -3 -15 8 c-1 10 7 20 15 17 c8 3 16 -7 15 -17 c-1 -11 -11 -12 -15 -8 z" fill="#E74C3C"/>' +
            '<path d="M24 15 c0 -4 1 -7 4 -9" fill="none" stroke="#6E2C00" stroke-width="2.2" stroke-linecap="round"/>' +
            '<path class="tka-yaprak" d="M26 9 c3 -5 9 -5 11 -3 c-2 4 -7 6 -11 3 z" fill="#27AE60"/>' +
            '<path d="M14 22 a6 6 0 0 1 4 -5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/></g>',
        'grade10-unit5-lesson1':     /* Meslekler: çanta + dönen dişli */
            '<rect x="5" y="17" width="30" height="22" rx="4" fill="#A0522D"/>' +
            '<path d="M14 17 v-4 a2 2 0 0 1 2 -2 h8 a2 2 0 0 1 2 2 v4" fill="none" stroke="#6E2C00" stroke-width="2.4"/>' +
            '<path d="M5 26 h30" stroke="#6E2C00" stroke-width="1.6"/><rect x="18" y="24" width="4" height="5" rx="1" fill="#F7DC6F"/>' +
            '<g class="tka-disli"><circle cx="37" cy="33" r="6.5" fill="#5E81AC"/>' +
            '<path d="M37 23.5 v4 M37 38.5 v4 M27.5 33 h4 M42.5 33 h4 M30.3 26.3 l2.8 2.8 M40.9 36.9 l2.8 2.8 M30.3 39.7 l2.8 -2.8 M40.9 29.1 l2.8 -2.8" stroke="#5E81AC" stroke-width="3" stroke-linecap="round"/>' +
            '<circle cx="37" cy="33" r="2.4" fill="#fff"/></g>',
        'grade10-unit6-lesson1':     /* Hava Durumu: güneş, bulut, yağmur */
            '<g class="tka-gunes2"><circle cx="15" cy="15" r="7" fill="#F7B731"/>' +
            '<path d="M15 3 v3 M15 24 v3 M3 15 h3 M24 15 h3 M6.5 6.5 l2 2 M21.5 21.5 l2 2 M6.5 23.5 l2 -2 M21.5 8.5 l2 -2" stroke="#F7B731" stroke-width="2" stroke-linecap="round"/></g>' +
            '<g class="tka-bulut"><path d="M15 33 a7 7 0 0 1 2 -13.7 a9 9 0 0 1 17 2.2 a6 6 0 0 1 3 11.5 z" fill="#fff" stroke="#AEB6BF" stroke-width="1.8" stroke-linejoin="round"/></g>' +
            '<path class="tka-damla" d="M20 37 l-1.5 4 M27 37 l-1.5 4 M34 37 l-1.5 4" stroke="#3498DB" stroke-width="2.2" stroke-linecap="round"/>',
        'grade10-unit7-lesson1':     /* Vücudumuz: gövde + atan kalp */
            '<circle cx="24" cy="9" r="5.5" fill="#F5CBA7"/>' +
            '<path d="M13 44 V24 a11 9 0 0 1 22 0 V44 z" fill="#FDEBD0" stroke="#E59866" stroke-width="1.6"/>' +
            '<path d="M9 22 l-4 12 M39 22 l4 12" stroke="#E59866" stroke-width="3.2" stroke-linecap="round"/>' +
            '<path class="tka-kalp" d="M24 33 C20 30 18 28 18 25.5 a3.2 3.2 0 0 1 6 -1.5 a3.2 3.2 0 0 1 6 1.5 c0 2.5 -2 4.5 -6 7.5 z" fill="#E74C3C"/>',
        /* --- 5. SINIF (2025-2026) --- */
        'ortaokul-5_1_1':            /* Arap Harfleri ve Sesler: ع harfinden ses dalgaları yayılır */
            '<g class="tkg-nabiz" style="--s:1.06;--t:1.4s"><circle cx="18" cy="24" r="14" fill="#FFF1CF" stroke="#F39C12" stroke-width="2"/>' +
            '<text x="18" y="31" text-anchor="middle" font-size="21" fill="#B7650B" ' + AR + '>ع</text></g>' +
            '<path class="tkg-yanip" style="--t:1.4s;--m:.12;--g:-.7s" d="M35.5 17 q4 7 0 14" fill="none" stroke="#16A085" stroke-width="2.4" stroke-linecap="round"/>' +
            '<path class="tkg-yanip" style="--t:1.4s;--m:.12;--g:-.35s" d="M39.5 13 q6 11 0 22" fill="none" stroke="#16A085" stroke-width="2.4" stroke-linecap="round"/>' +
            '<path class="tkg-yanip" style="--t:1.4s;--m:.12" d="M43.5 10 q7.5 14 0 28" fill="none" stroke="#16A085" stroke-width="2.4" stroke-linecap="round"/>',
        'ortaokul-5_1_2':            /* Kendini Tanıtma: yaka kartlı öğrenci, konuşma balonu açılıp kapanır */
            '<circle cx="17" cy="17" r="7.5" fill="#F5CBA7"/>' +
            '<circle cx="14.4" cy="16.2" r="1.1" fill="#5A4636"/><circle cx="19.6" cy="16.2" r="1.1" fill="#5A4636"/>' +
            '<path d="M14 19.8 q3 2.4 6 0" fill="none" stroke="#5A4636" stroke-width="1.3" stroke-linecap="round"/>' +
            '<path d="M3.5 45 a13.5 13.5 0 0 1 27 0 z" fill="#5DADE2"/>' +
            '<rect x="11" y="35" width="12" height="7.5" rx="1.6" fill="#fff" stroke="#2E86DE" stroke-width="1.3"/>' +
            '<path d="M13.5 38.8 h7" stroke="#2E86DE" stroke-width="1.5" stroke-linecap="round"/>' +
            '<g class="tkg-belir" style="--o:0% 100%;--t:3.2s;--g:-1s"><path d="M29 17.5 l1.5 4.5 4 -4.5" fill="#fff" stroke="#16A085" stroke-width="1.6" stroke-linejoin="round"/>' +
            '<rect x="27" y="4" width="19" height="14" rx="4.5" fill="#fff" stroke="#16A085" stroke-width="1.6"/>' +
            '<path d="M31 9.5 h11 M31 13 h7" stroke="#16A085" stroke-width="1.7" stroke-linecap="round"/></g>',
        'ortaokul-5_2_1':            /* Sınıf Eşyaları: tahtaya tebeşirle ب yazılır, noktası konur */
            '<rect x="4" y="6" width="40" height="29" rx="3" fill="#1E6F5C" stroke="#A0522D" stroke-width="2.4"/>' +
            '<path d="M11 38 v6 M37 38 v6" stroke="#A0522D" stroke-width="2.6" stroke-linecap="round"/>' +
            '<rect x="7" y="35" width="34" height="3.2" rx="1.6" fill="#8D6E63"/>' +
            '<rect x="33" y="33" width="6" height="2.2" rx="1.1" fill="#fff"/>' +
            '<path class="tka-ciz" pathLength="100" d="M33 13.5 C34.5 20 32.5 25.5 24 25.5 C15.5 25.5 12.5 22 13.5 17" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>' +
            '<circle class="tka-nokta" cx="23.5" cy="30" r="1.8" fill="#fff"/>',
        'ortaokul-5_2_2':            /* Kırtasiye Malzemeleri: cetvel, sallanan kalem, gidip gelen silgi */
            '<rect x="4" y="31" width="40" height="9" rx="2" fill="#F7DC6F" stroke="#D4AC0D" stroke-width="1.4"/>' +
            '<path d="M9 31 v4 M14 31 v2.5 M19 31 v4 M24 31 v2.5 M29 31 v4 M34 31 v2.5 M39 31 v4" stroke="#9A7D0A" stroke-width="1.2"/>' +
            '<g class="tkg-sallan" style="--o:50% 100%;--a:7deg;--t:1.8s"><rect x="10" y="4" width="6.5" height="21" rx="1.3" fill="#E74C3C"/>' +
            '<rect x="10" y="4" width="6.5" height="3.6" rx="1.1" fill="#F8C471"/>' +
            '<path d="M10 25 l3.25 5.5 3.25 -5.5 z" fill="#F5CBA7"/><path d="M12.2 28.7 l1.05 1.8 1.05 -1.8 z" fill="#5A4636"/></g>' +
            '<g class="tkg-kay" style="--x:-4px;--t:1.3s"><rect x="27" y="18" width="15" height="10" rx="2.6" fill="#F1948A"/>' +
            '<rect x="27" y="18" width="6" height="10" rx="2.2" fill="#5DADE2"/></g>',
        'ortaokul-5_3_3':            /* Sıfatlar (Ailem): büyük ve küçük yüz sırayla büyüyüp küçülür */
            '<g class="tkg-nabiz" style="--s:1.1;--t:2.2s"><circle cx="17" cy="25" r="12.5" fill="#F7DC6F" stroke="#D4AC0D" stroke-width="1.6"/>' +
            '<circle cx="12.8" cy="22" r="1.6" fill="#5A4636"/><circle cx="21.2" cy="22" r="1.6" fill="#5A4636"/>' +
            '<path d="M11.5 28.5 q5.5 4.5 11 0" fill="none" stroke="#5A4636" stroke-width="1.7" stroke-linecap="round"/></g>' +
            '<g class="tkg-nabiz" style="--s:1.28;--t:2.2s;--g:-1.1s"><circle cx="38" cy="34" r="6.5" fill="#AED6F1" stroke="#2E86DE" stroke-width="1.4"/>' +
            '<circle cx="35.8" cy="33" r="1" fill="#1B4F72"/><circle cx="40.2" cy="33" r="1" fill="#1B4F72"/>' +
            '<path d="M35.6 36.2 q2.4 1.8 4.8 0" fill="none" stroke="#1B4F72" stroke-width="1.1" stroke-linecap="round"/></g>' +
            '<path class="tka-parla" d="M38 6 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 Z" fill="#F6C344"/>',
        'ortaokul-5_4_1':            /* Evin Bölümleri: evin dört odasında ışıklar sırayla yanar */
            '<path d="M5 22 L24 7 L43 22" fill="none" stroke="#C0392B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<rect x="9" y="20" width="30" height="24" fill="#FDEBD0" stroke="#E59866" stroke-width="1.6"/>' +
            '<rect class="tkg-yanip" style="--t:2.4s;--m:.1" x="10.8" y="21.8" width="11.6" height="9.6" fill="#F7DC6F"/>' +
            '<rect class="tkg-yanip" style="--t:2.4s;--m:.1;--g:-.6s" x="25.6" y="21.8" width="11.6" height="9.6" fill="#AED6F1"/>' +
            '<rect class="tkg-yanip" style="--t:2.4s;--m:.1;--g:-1.2s" x="25.6" y="33.2" width="11.6" height="9" fill="#ABEBC6"/>' +
            '<rect class="tkg-yanip" style="--t:2.4s;--m:.1;--g:-1.8s" x="10.8" y="33.2" width="11.6" height="9" fill="#F5B7B1"/>' +
            '<path d="M24 20 v24 M9 32.3 h30" stroke="#E59866" stroke-width="1.6"/>' +
            '<rect x="14.5" y="36.5" width="4.5" height="7.5" rx=".8" fill="#A04000"/>',
        'ortaokul-5_4_2':            /* Evin Eşyaları: koltuk ve ışığı yanıp sönen lamba */
            '<path class="tkg-yanip" style="--t:2.2s;--m:.2" d="M36.8 14 L33.5 25 H48 L45.2 14 Z" fill="#F9E79F" opacity=".7"/>' +
            '<path d="M41 13 v28 M36 42.5 h10" stroke="#7F8C8D" stroke-width="2" stroke-linecap="round"/>' +
            '<path d="M35.5 14 h11 l-2.6 -7.5 h-5.8 z" fill="#F7DC6F" stroke="#D4AC0D" stroke-width="1.2" stroke-linejoin="round"/>' +
            '<path d="M8 28 v-8 a4 4 0 0 1 4 -4 h14 a4 4 0 0 1 4 4 v8 z" fill="#E59866"/>' +
            '<rect x="5" y="26" width="28" height="10" rx="3" fill="#D35400"/>' +
            '<rect x="3" y="23.5" width="6" height="12.5" rx="2.6" fill="#BA4A00"/><rect x="29" y="23.5" width="6" height="12.5" rx="2.6" fill="#BA4A00"/>' +
            '<path d="M8 36 v6 M30 36 v6" stroke="#6E2C00" stroke-width="2.4" stroke-linecap="round"/>',
        'ortaokul-5_4_3':            /* Sıfatlar (Güzel Evim): büyük ev – küçük ev */
            '<g class="tkg-nabiz" style="--o:50% 100%;--s:1.07;--t:2.2s"><path d="M4 27 L16 16 L28 27" fill="none" stroke="#C0392B" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<rect x="7" y="25" width="18" height="17" fill="#FDEBD0" stroke="#E59866" stroke-width="1.5"/>' +
            '<rect x="10" y="28" width="5" height="5" fill="#F7DC6F"/><rect x="17.5" y="33" width="5" height="9" fill="#A04000"/></g>' +
            '<g class="tkg-nabiz" style="--o:50% 100%;--s:1.22;--t:2.2s;--g:-1.1s"><path d="M31 34.5 L38 28.5 L45 34.5" fill="none" stroke="#2E86DE" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<rect x="33" y="33.5" width="10" height="8.5" fill="#EBF5FB" stroke="#5DADE2" stroke-width="1.3"/><rect x="36.6" y="37" width="3" height="5" fill="#1B4F72"/></g>' +
            '<path d="M2 42.6 H46" stroke="#A9CCE3" stroke-width="1.6" stroke-linecap="round"/>' +
            '<path class="tka-parla" d="M39 7 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 Z" fill="#F6C344"/>',
        'ortaokul-5_4_4':            /* Sayılar: ١ ٢ ٣ kartları sağdan sola sırayla belirir */
            '<g class="tkg-belir" style="--t:3.6s;--g:-1.2s"><rect x="32" y="13" width="13" height="20" rx="4" fill="#FDE7EC" stroke="#E5487A" stroke-width="1.6"/>' +
            '<text x="38.5" y="29" text-anchor="middle" font-size="15" fill="#C2185B" ' + AR + '>١</text></g>' +
            '<g class="tkg-belir" style="--t:3.6s;--g:-.85s"><rect x="17.5" y="13" width="13" height="20" rx="4" fill="#E8F6F1" stroke="#16A085" stroke-width="1.6"/>' +
            '<text x="24" y="29" text-anchor="middle" font-size="15" fill="#0E7C66" ' + AR + '>٢</text></g>' +
            '<g class="tkg-belir" style="--t:3.6s;--g:-.5s"><rect x="3" y="13" width="13" height="20" rx="4" fill="#FFF1CF" stroke="#F39C12" stroke-width="1.6"/>' +
            '<text x="9.5" y="29" text-anchor="middle" font-size="15" fill="#B7650B" ' + AR + '>٣</text></g>' +
            '<path d="M8 40 H40" stroke="#D5DBDB" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 5"/>',
        /* --- 6. SINIF (2026-2027 yeni kitap) --- */
        'ortaokul-y2627-6_1_1':      /* Akrabalar: soy ağacı yukarıdan aşağı sırayla büyür */
            '<path d="M24 14 V18 M12 18 H36 M12 18 V20 M36 18 V20 M12 28.5 V32 M6 32 H18 M6 32 V35 M18 32 V35 M36 28.5 V35" fill="none" stroke="#B2BABB" stroke-width="1.6" stroke-linecap="round"/>' +
            '<g class="tkg-belir" style="--t:4s;--g:-1.4s"><circle cx="24" cy="9" r="5.2" fill="#8E44AD"/><circle cx="24" cy="8" r="2" fill="#F5CBA7"/></g>' +
            '<g class="tkg-belir" style="--t:4s;--g:-1.05s"><circle cx="12" cy="24" r="4.6" fill="#2E86DE"/><circle cx="12" cy="23.2" r="1.8" fill="#F5CBA7"/></g>' +
            '<g class="tkg-belir" style="--t:4s;--g:-1.05s"><circle cx="36" cy="24" r="4.6" fill="#E67E22"/><circle cx="36" cy="23.2" r="1.8" fill="#F5CBA7"/></g>' +
            '<g class="tkg-belir" style="--t:4s;--g:-.7s"><circle cx="6" cy="39" r="3.8" fill="#5DADE2"/><circle cx="6" cy="38.3" r="1.5" fill="#F5CBA7"/></g>' +
            '<g class="tkg-belir" style="--t:4s;--g:-.7s"><circle cx="18" cy="39" r="3.8" fill="#48C9B0"/><circle cx="18" cy="38.3" r="1.5" fill="#F5CBA7"/></g>' +
            '<g class="tkg-belir" style="--t:4s;--g:-.7s"><circle cx="36" cy="39" r="3.8" fill="#F5B041"/><circle cx="36" cy="38.3" r="1.5" fill="#F5CBA7"/></g>',
        'ortaokul-y2627-6_2_1':      /* Okulun Bölümleri ve Araçları: okul binası, dalgalanan bayrak */
            '<path d="M24 10 V2" stroke="#7F8C8D" stroke-width="1.4" stroke-linecap="round"/>' +
            '<path class="tkg-sallan" style="--o:0% 50%;--a:9deg;--t:1.4s" d="M24.6 2.2 h9 l-2.2 2.7 2.2 2.7 h-9 z" fill="#E74C3C"/>' +
            '<rect x="6" y="20" width="36" height="23" fill="#FDEBD0" stroke="#E59866" stroke-width="1.6"/>' +
            '<path d="M4 21 L24 10 L44 21 Z" fill="#E74C3C"/>' +
            '<circle cx="24" cy="16.5" r="3" fill="#fff" stroke="#C0392B" stroke-width="1"/>' +
            '<path class="tka-yelkovan" style="transform-origin:24px 16.5px" d="M24 16.5 V14.4" stroke="#C0392B" stroke-width="1" stroke-linecap="round"/>' +
            '<rect x="9.5" y="24" width="6" height="5" fill="#AED6F1"/><rect x="32.5" y="24" width="6" height="5" fill="#AED6F1"/>' +
            '<rect x="9.5" y="33" width="6" height="5" fill="#AED6F1"/><rect x="32.5" y="33" width="6" height="5" fill="#AED6F1"/>' +
            '<rect x="20" y="31" width="8" height="12" rx="1" fill="#A04000"/>',
        'ortaokul-y2627-6_2_2':      /* Sıra Sayıları: ٢ ١ ٣ kürsüsü, birincinin yıldızı zıplar */
            '<rect x="17" y="22" width="14" height="21" rx="1.5" fill="#F7B731"/>' +
            '<rect x="3" y="29" width="14" height="14" rx="1.5" fill="#BDC3C7"/>' +
            '<rect x="31" y="33" width="14" height="10" rx="1.5" fill="#E59866"/>' +
            '<text x="24" y="37" text-anchor="middle" font-size="13" fill="#fff" ' + AR + '>١</text>' +
            '<text x="10" y="40.5" text-anchor="middle" font-size="12" fill="#fff" ' + AR + '>٢</text>' +
            '<text x="38" y="42" text-anchor="middle" font-size="11" fill="#fff" ' + AR + '>٣</text>' +
            '<path class="tkg-zipla" style="--y:3px;--t:1.4s" d="M24 6 l2 4.2 4.6 .6 -3.4 3.2 .9 4.6 -4.1 -2.3 -4.1 2.3 .9 -4.6 -3.4 -3.2 4.6 -.6 z" fill="#F1C40F" stroke="#D4AC0D" stroke-width="1"/>' +
            '<path class="tka-parla" d="M40 10 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill="#F6C344"/>' +
            '<path class="tka-parla p2" d="M8 14 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill="#F6C344"/>',
        'ortaokul-y2627-6_3_1':      /* Organlar: göz kırpan yüz — göz, kulak, burun, ağız */
            '<ellipse cx="8" cy="25" rx="3.2" ry="4.6" fill="#EDBB99"/><ellipse cx="40" cy="25" rx="3.2" ry="4.6" fill="#EDBB99"/>' +
            '<circle cx="24" cy="25" r="16" fill="#F5CBA7"/>' +
            '<path d="M8.5 21 C9 10 16.5 7 24 7 C31.5 7 39 10 39.5 21 C35 15 29.5 13.5 24 13.5 C18.5 13.5 13 15 8.5 21 Z" fill="#6E2C00"/>' +
            '<circle class="tka-goz" cx="18" cy="24" r="2.3" fill="#2C3E50"/><circle class="tka-goz" cx="30" cy="24" r="2.3" fill="#2C3E50"/>' +
            '<path d="M24 26 v4.6 h-2.2" fill="none" stroke="#D68910" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M19 34 q5 4 10 0" fill="none" stroke="#C0392B" stroke-width="1.9" stroke-linecap="round"/>',
        'ortaokul-y2627-6_3_2':      /* Hisler ve Duygular: yüz sevinçten üzüntüye, üzüntüden sevince döner */
            '<circle cx="24" cy="25" r="17" fill="#F7DC6F" stroke="#D4AC0D" stroke-width="1.6"/>' +
            '<circle cx="18" cy="21" r="2" fill="#5A4636"/><circle cx="30" cy="21" r="2" fill="#5A4636"/>' +
            '<g class="tka-mutlu"><path d="M16.5 29 q7.5 7 15 0" fill="none" stroke="#5A4636" stroke-width="2" stroke-linecap="round"/>' +
            '<ellipse cx="13.5" cy="27" rx="2.6" ry="1.6" fill="#F1948A"/><ellipse cx="34.5" cy="27" rx="2.6" ry="1.6" fill="#F1948A"/></g>' +
            '<g class="tka-uzgun"><path d="M17.5 34 q6.5 -5.5 13 0" fill="none" stroke="#5A4636" stroke-width="2" stroke-linecap="round"/>' +
            '<path d="M31.6 24.6 q1.6 3.2 0 4.8 q-1.6 -1.6 0 -4.8 z" fill="#5DADE2"/></g>',
        'ortaokul-y2627-6_4_2':      /* Renkler: paletteki boyalar sırayla parlar, fırça sallanır */
            '<path d="M24 6 C12 6 4 14 4 24 C4 34 12 42 22 42 C25 42 26 40 25 37.5 C24 35 25.5 33 28 33 H33 C39 33 44 29 44 22 C44 13 35 6 24 6 Z" fill="#FDF2E9" stroke="#D4AC0D" stroke-width="1.5"/>' +
            '<circle cx="31" cy="26" r="3" fill="#fff" stroke="#D4AC0D" stroke-width="1.2"/>' +
            '<circle class="tkg-nabiz" style="--s:1.3;--t:2.5s" cx="13" cy="21" r="3.3" fill="#E74C3C"/>' +
            '<circle class="tkg-nabiz" style="--s:1.3;--t:2.5s;--g:-2s" cx="20" cy="13.5" r="3.3" fill="#F39C12"/>' +
            '<circle class="tkg-nabiz" style="--s:1.3;--t:2.5s;--g:-1.5s" cx="29.5" cy="12.5" r="3.3" fill="#F1C40F"/>' +
            '<circle class="tkg-nabiz" style="--s:1.3;--t:2.5s;--g:-1s" cx="37" cy="19" r="3.3" fill="#27AE60"/>' +
            '<circle class="tkg-nabiz" style="--s:1.3;--t:2.5s;--g:-.5s" cx="12.5" cy="31" r="3.3" fill="#3498DB"/>' +
            '<g class="tkg-sallan" style="--o:100% 0%;--a:8deg;--t:1.6s"><path d="M46 29 L35 40" stroke="#8D6E63" stroke-width="3" stroke-linecap="round"/>' +
            '<path d="M36 38.6 c-2.4 1.2 -3.4 3.4 -5.6 4.6 c1.1 -2.2 1.2 -4.4 3.4 -6.8 z" fill="#8E44AD"/></g>',
        /* --- 7. SINIF --- */
        'ortaokul-7_1':              /* Günlük Etkinlikler ve Saatler: çalar saat titreyerek çalar */
            '<path class="tkg-yanip" style="--t:.6s;--m:0" d="M5 9 q-2.5 5 0 10 M43 9 q2.5 5 0 10" fill="none" stroke="#F39C12" stroke-width="2" stroke-linecap="round"/>' +
            '<g class="tkg-titre" style="--t:1.2s"><circle cx="13" cy="12" r="4.5" fill="#E74C3C"/><circle cx="35" cy="12" r="4.5" fill="#E74C3C"/>' +
            '<path d="M15 39 l-3 4.5 M33 39 l3 4.5" stroke="#E74C3C" stroke-width="2.6" stroke-linecap="round"/>' +
            '<circle cx="24" cy="26" r="14" fill="#fff" stroke="#E74C3C" stroke-width="3"/>' +
            '<path d="M24 16 v2 M24 34 v2 M14 26 h2 M32 26 h2" stroke="#95A5A6" stroke-width="1.6" stroke-linecap="round"/>' +
            '<path class="tka-yelkovan" style="transform-origin:24px 26px" d="M24 26 V18" stroke="#2C3E50" stroke-width="2" stroke-linecap="round"/>' +
            '<path d="M24 26 L29.5 29" stroke="#2C3E50" stroke-width="2.4" stroke-linecap="round"/><circle cx="24" cy="26" r="1.6" fill="#2C3E50"/></g>',
        'ortaokul-7_2':              /* Alışveriş, Miktar ve Sayılar: sepete meyve düşer, etiket sallanır */
            '<circle class="tkg-dus" style="--y:6px;--t:1.6s" cx="30" cy="10" r="3.2" fill="#27AE60"/>' +
            '<rect x="15" y="18" width="7" height="8" rx="1.2" fill="#F5B041"/><circle cx="27.5" cy="22" r="4" fill="#E74C3C"/>' +
            '<path d="M3 8 h6 l5 20 h24 l4 -14 H11" fill="none" stroke="#2E86DE" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M14 28 l-1.5 4.5 h26" fill="none" stroke="#2E86DE" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<circle cx="17" cy="37.5" r="3.2" fill="#2C3E50"/><circle cx="33" cy="37.5" r="3.2" fill="#2C3E50"/>' +
            '<g class="tkg-sallan" style="--o:50% 0%;--a:14deg;--t:1.8s"><path d="M42.5 25 v3 M39.5 28 h6 v9 h-6 z" fill="#F7DC6F" stroke="#D4AC0D" stroke-width="1.1" stroke-linejoin="round"/>' +
            '<path d="M41 31 h3 M41 33.5 h2" stroke="#9A7D0A" stroke-width="1" stroke-linecap="round"/></g>',
        'ortaokul-7_3':              /* Ulaşım ve Seyahat: uçak dünyanın çevresinde tur atar */
            '<circle cx="24" cy="26" r="16" fill="none" stroke="#D6EAF8" stroke-width="1.2" stroke-dasharray="2 3"/>' +
            '<circle cx="24" cy="26" r="12" fill="#AED6F1" stroke="#2E86DE" stroke-width="1.8"/>' +
            '<path d="M13 26 h22 M24 14 v24" stroke="#5DADE2" stroke-width=".9" opacity=".7"/>' +
            '<path d="M17.5 19 c3 2 5.5 1 7.5 3 c2 2 -1 4.5 1 6.5 c2 2 4.5 1 5.5 3.5 M14 28 c2.5 -1 4.5 1 5 3.5" fill="none" stroke="#27AE60" stroke-width="3" stroke-linecap="round"/>' +
            '<g class="tkg-yorunge" style="--o:24px 26px;--t:4s"><ellipse cx="24" cy="10" rx="5.5" ry="1.5" fill="#E67E22"/>' +
            '<path d="M22.5 9.5 L20 5 H22 L26 9.5 Z M22.5 10.5 L20 15 H22 L26 10.5 Z M19.5 9.7 L18 7 H19.3 L21 9.5 Z" fill="#D35400"/></g>',
        'ortaokul-7_4':              /* Şehrim ve Ülkem: dalgalanan bayrak, cami, ışıkları yanan binalar */
            '<rect x="3" y="27" width="8" height="17" fill="#85929E"/><rect x="32" y="22" width="9" height="22" fill="#5D6D7E"/><rect x="41" y="30" width="5" height="14" fill="#85929E"/>' +
            '<rect class="tkg-yanip" style="--t:2.6s;--m:.15" x="34" y="25" width="2" height="2.4" fill="#F7DC6F"/>' +
            '<rect class="tkg-yanip" style="--t:2.6s;--m:.15;--g:-1s" x="37.5" y="30" width="2" height="2.4" fill="#F7DC6F"/>' +
            '<rect class="tkg-yanip" style="--t:2.6s;--m:.15;--g:-1.8s" x="34" y="35" width="2" height="2.4" fill="#F7DC6F"/>' +
            '<rect class="tkg-yanip" style="--t:2.6s;--m:.15;--g:-.6s" x="5.5" y="31" width="3" height="2.4" fill="#F7DC6F"/>' +
            '<rect x="13" y="35.5" width="16" height="8.5" fill="#D6EAF8"/><path d="M14 36 a7 7 0 0 1 14 0 z" fill="#AED6F1"/>' +
            '<rect x="28.6" y="24" width="2.2" height="20" fill="#D6EAF8"/><path d="M28.3 24 l1.4 -4 1.4 4 z" fill="#5DADE2"/>' +
            '<path d="M2 44 H46" stroke="#AAB7B8" stroke-width="1.6" stroke-linecap="round"/>' +
            '<path d="M8.8 27 V4.5" stroke="#7F8C8D" stroke-width="1.3" stroke-linecap="round"/>' +
            '<g class="tkg-sallan" style="--o:0% 50%;--a:5deg;--t:1.6s"><rect x="9.4" y="5" width="15" height="10" fill="#E30A17"/>' +
            '<circle cx="15" cy="10" r="3" fill="#fff"/><circle cx="15.8" cy="10" r="2.4" fill="#E30A17"/>' +
            '<path d="M19.3 8.5 l.45 1.1 1.2 .1 -.9 .8 .3 1.15 -1.05 -.6 -1.05 .6 .3 -1.15 -.9 -.8 1.2 -.1 z" fill="#fff"/></g>',
        /* --- 8. SINIF --- */
        'ortaokul-8_1_1':            /* Kulüpler: kulüp flaması dalgalanır, üyeler sırayla zıplar */
            '<path d="M8 3 V20" stroke="#7F8C8D" stroke-width="1.4" stroke-linecap="round"/>' +
            '<path class="tkg-sallan" style="--o:0% 50%;--a:9deg;--t:1.5s" d="M8.6 3.5 L25 8 L8.6 12.5 Z" fill="#8E44AD"/>' +
            '<g class="tkg-zipla" style="--y:3px;--t:1.2s"><circle cx="11" cy="31" r="4.2" fill="#F5CBA7"/><path d="M4 45 a7 7 0 0 1 14 0 z" fill="#2E86DE"/></g>' +
            '<g class="tkg-zipla" style="--y:3px;--t:1.2s;--g:.2s"><circle cx="24" cy="29" r="4.6" fill="#F5CBA7"/><path d="M16.5 45 a7.5 7.5 0 0 1 15 0 z" fill="#27AE60"/></g>' +
            '<g class="tkg-zipla" style="--y:3px;--t:1.2s;--g:.4s"><circle cx="37" cy="31" r="4.2" fill="#F5CBA7"/><path d="M30 45 a7 7 0 0 1 14 0 z" fill="#E67E22"/></g>',
        'ortaokul-8_1_2':            /* Tiyatro: perde, sevinçli ve üzgün maske sırayla sallanır */
            '<path d="M0 3 H48 V6.5 C40 9.5 32 9.5 24 6.5 C16 9.5 8 9.5 0 6.5 Z" fill="#C0392B"/>' +
            '<g class="tkg-sallan" style="--o:50% 0%;--a:8deg;--t:2.4s"><path d="M5 11 h17 v10 c0 7 -4 11 -8.5 11 S5 28 5 21 z" fill="#F7DC6F" stroke="#D4AC0D" stroke-width="1.4"/>' +
            '<path d="M8.5 17 q2 -2 4 0 M15 17 q2 -2 4 0" fill="none" stroke="#5A4636" stroke-width="1.5" stroke-linecap="round"/>' +
            '<path d="M9 23 q4.5 5 9 0" fill="none" stroke="#5A4636" stroke-width="1.6" stroke-linecap="round"/></g>' +
            '<g class="tkg-sallan" style="--o:50% 0%;--a:8deg;--t:2.4s;--g:-1.2s"><path d="M26 17 h17 v10 c0 7 -4 11 -8.5 11 S26 34 26 27 z" fill="#AED6F1" stroke="#2E86DE" stroke-width="1.4"/>' +
            '<path d="M29.5 23.5 q2 2 4 0 M36 23.5 q2 2 4 0" fill="none" stroke="#1B4F72" stroke-width="1.5" stroke-linecap="round"/>' +
            '<path d="M30 33 q4.5 -4 9 0" fill="none" stroke="#1B4F72" stroke-width="1.6" stroke-linecap="round"/></g>',
        'ortaokul-8_1_3':            /* Gezi: haritada yol çizilir, konum iğnesi zıplar */
            '<path d="M4 12 L16 8 L32 12 L44 8 V38 L32 42 L16 38 L4 42 Z" fill="#E8F6F3" stroke="#48C9B0" stroke-width="1.6" stroke-linejoin="round"/>' +
            '<path d="M16 8 V38 M32 12 V42" stroke="#A3E4D7" stroke-width="1.2"/>' +
            '<path class="tkg-ciz" style="--t:3.2s;--g:-1.4s" pathLength="100" d="M9 36 C12 28 20 30 22 24 C24 18 30 21 34 18" fill="none" stroke="#E67E22" stroke-width="2" stroke-linecap="round"/>' +
            '<circle cx="9" cy="36" r="2" fill="#E67E22"/>' +
            '<g class="tkg-zipla" style="--y:3px;--t:1.1s"><path d="M34 18 c-4 -5 -5 -7 -5 -9 a5 5 0 0 1 10 0 c0 2 -1 4 -5 9 z" fill="#E74C3C"/><circle cx="34" cy="9" r="1.8" fill="#fff"/></g>',
        'ortaokul-8_2_1':            /* Edebiyat: açık kitap, yazan kalem, yükselen harfler */
            '<path d="M5 24 h16 a3 3 0 0 1 3 3 v16 a3 3 0 0 0 -3 -3 h-16 z" fill="#FDF2E9" stroke="#A0522D" stroke-width="1.7" stroke-linejoin="round"/>' +
            '<path d="M43 24 h-16 a3 3 0 0 0 -3 3 v16 a3 3 0 0 1 3 -3 h16 z" fill="#FDF2E9" stroke="#A0522D" stroke-width="1.7" stroke-linejoin="round"/>' +
            '<path d="M9 29 h10 M9 33 h10 M29 29 h10 M29 33 h7" stroke="#D5B895" stroke-width="1.4" stroke-linecap="round"/>' +
            '<text class="tkg-yuksel" style="--t:2.6s;--y:9px" x="11" y="20" font-size="10" fill="#C0392B" ' + AR + '>ق</text>' +
            '<text class="tkg-yuksel" style="--t:2.6s;--y:9px;--g:-1.3s" x="19" y="18" font-size="9" fill="#2E86DE" ' + AR + '>ل</text>' +
            '<g class="tkg-kay" style="--x:-5px;--y:1px;--t:1.6s"><path d="M45 5 C39 7 34 13 32 20 L34 21 C37 15 41 10 45 5 Z" fill="#8E44AD"/>' +
            '<path d="M32 20 l-1 3.5 2.6 -2.4 z" fill="#2C3E50"/></g>',
        'ortaokul-8_2_2':            /* Kitap Fuarında: çizgili tenteli stant, kitaplar sırayla zıplar */
            '<path d="M6 14 V44 M42 14 V44" stroke="#8D6E63" stroke-width="2"/>' +
            '<path d="M4 14 H44 L41 5 H7 Z" fill="#E74C3C"/>' +
            '<path d="M13 5 L12 14 M20.5 5 L20.5 14 M27.5 5 L27.5 14 M35 5 L36 14" stroke="#fff" stroke-width="2.4"/>' +
            '<path d="M4 14 q2.5 3.5 5 0 q2.5 3.5 5 0 q2.5 3.5 5 0 q2.5 3.5 5 0 q2.5 3.5 5 0 q2.5 3.5 5 0 q2.5 3.5 5 0 q2.5 3.5 5 0" fill="#E74C3C"/>' +
            '<rect class="tkg-zipla" style="--y:3px;--t:1.4s" x="10" y="20" width="6" height="13" rx="1" fill="#3498DB"/>' +
            '<rect class="tkg-zipla" style="--y:3px;--t:1.4s;--g:.2s" x="17" y="22" width="6" height="11" rx="1" fill="#27AE60"/>' +
            '<rect class="tkg-zipla" style="--y:3px;--t:1.4s;--g:.4s" x="24" y="19" width="6" height="14" rx="1" fill="#F39C12"/>' +
            '<rect class="tkg-zipla" style="--y:3px;--t:1.4s;--g:.6s" x="31" y="21" width="6" height="12" rx="1" fill="#8E44AD"/>' +
            '<rect x="4" y="33" width="40" height="11" fill="#D68910"/><path d="M4 36.5 H44" stroke="#B9770E" stroke-width="1"/>',
        'ortaokul-8_2_3':            /* El Sanatları: çini karo, lale motifi çizilir */
            '<rect x="6" y="6" width="36" height="36" rx="3" fill="#FDFEFE" stroke="#2E86DE" stroke-width="2"/>' +
            '<rect x="9.5" y="9.5" width="29" height="29" rx="2" fill="none" stroke="#85C1E9" stroke-width="1" stroke-dasharray="2 2"/>' +
            '<path d="M6 12 q6 0 6 -6 M42 12 q-6 0 -6 -6 M6 36 q6 0 6 6 M42 36 q-6 0 -6 6" fill="none" stroke="#2E86DE" stroke-width="1.6"/>' +
            '<path d="M24 37 V25 M24 33 q-6 -1 -8 -6 M24 34 q6 -1 8 -6" fill="none" stroke="#27AE60" stroke-width="2" stroke-linecap="round"/>' +
            '<path class="tkg-ciz" style="--t:3.4s;--g:-1.5s" pathLength="100" d="M24 25 C19 25 17 20 18 14 C20 16 22 16 24 12 C26 16 28 16 30 14 C31 20 29 25 24 25 Z" fill="none" stroke="#E74C3C" stroke-width="2.2" stroke-linejoin="round"/>' +
            '<path class="tka-parla" d="M36 9 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill="#F6C344"/>',
        'ortaokul-8_3_1':            /* Arkadaşlık: omuz omuza iki arkadaş, üstlerinde kalp belirir */
            '<circle cx="16" cy="18" r="6" fill="#F5CBA7"/><circle cx="32" cy="18" r="6" fill="#F5CBA7"/>' +
            '<path d="M13.5 19.5 q2.5 2 5 0 M29.5 19.5 q2.5 2 5 0" fill="none" stroke="#5A4636" stroke-width="1.2" stroke-linecap="round"/>' +
            '<circle cx="14" cy="16.5" r=".9" fill="#5A4636"/><circle cx="18" cy="16.5" r=".9" fill="#5A4636"/><circle cx="30" cy="16.5" r=".9" fill="#5A4636"/><circle cx="34" cy="16.5" r=".9" fill="#5A4636"/>' +
            '<path d="M6 45 v-8 a10 10 0 0 1 20 0 v8 z" fill="#3498DB"/><path d="M22 45 v-8 a10 10 0 0 1 20 0 v8 z" fill="#E67E22"/>' +
            '<path d="M19 33 q5 -3.5 10 0" fill="none" stroke="#F5CBA7" stroke-width="3" stroke-linecap="round"/>' +
            '<path class="tkg-belir" style="--o:50% 100%;--t:2.4s;--g:-.8s" d="M24 11 C20 8 18.5 6.5 18.5 4.8 a2.7 2.7 0 0 1 5.5 -1 a2.7 2.7 0 0 1 5.5 1 c0 1.7 -1.5 3.2 -5.5 6.2 z" fill="#E74C3C"/>',
        'ortaokul-8_3_2':            /* Yardımlaşma: iki el bir kalbi birlikte taşır */
            '<path class="tkg-nabiz" style="--s:1.12;--t:1.3s" d="M24 30 C15 24 11 20 11 15 a6.5 6.5 0 0 1 13 -2.5 a6.5 6.5 0 0 1 13 2.5 c0 5 -4 9 -13 15 z" fill="#E74C3C"/>' +
            '<rect x="0" y="33" width="5" height="10" rx="1.5" fill="#3498DB"/><rect x="43" y="33" width="5" height="10" rx="1.5" fill="#27AE60"/>' +
            '<path d="M4 34 c4 -1 8 0 11 2 l8 4 c1.6 .8 1.2 3 -.6 3 H12 c-3 0 -5.5 -1 -8 -2.5 z" fill="#F5CBA7" stroke="#E59866" stroke-width="1.2"/>' +
            '<path d="M44 34 c-4 -1 -8 0 -11 2 l-8 4 c-1.6 .8 -1.2 3 .6 3 H36 c3 0 5.5 -1 8 -2.5 z" fill="#F5CBA7" stroke="#E59866" stroke-width="1.2"/>',
        'ortaokul-8_3_3':            /* Bayramlar: sallanan fener, hilal, parlayan yıldızlar */
            '<path d="M34.69 6.11 A8 8 0 1 0 43.65 16.34 A6.8 6.8 0 0 1 34.69 6.11 Z" fill="#F7DC6F"/>' +
            '<path class="tka-parla" d="M40 26 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill="#F6C344"/>' +
            '<path class="tka-parla p2" d="M31 36 l.9 2.1 2.1 .9 -2.1 .9 -.9 2.1 -.9 -2.1 -2.1 -.9 2.1 -.9 Z" fill="#F6C344"/>' +
            '<g class="tkg-sallan" style="--o:50% 0%;--a:9deg;--t:2.6s"><path d="M16 0 V7" stroke="#7F8C8D" stroke-width="1.2"/>' +
            '<path d="M12 7 h8 l-1 3 h-6 z" fill="#B9770E"/>' +
            '<path d="M11 10 h10 c2 5 2 13 0 18 h-10 c-2 -5 -2 -13 0 -18 z" fill="#F5B041" stroke="#B9770E" stroke-width="1.2"/>' +
            '<ellipse class="tkg-yanip" style="--t:1.2s;--m:.45" cx="16" cy="19" rx="3" ry="5.5" fill="#FFF5CC"/>' +
            '<path d="M16 10 v18 M12.6 11 c-1.5 5 -1.5 11 0 16 M19.4 11 c1.5 5 1.5 11 0 16" stroke="#B9770E" stroke-width=".9" fill="none"/>' +
            '<path d="M13 28 h6 l-1 3 h-4 z" fill="#B9770E"/><path d="M16 31 v3" stroke="#B9770E" stroke-width="1.2" stroke-linecap="round"/></g>',
        'ortaokul-8_4_1':            /* Çevrenin Önemi: geri dönüşüm okları döner, ortada yaprak */
            '<g class="tkg-yorunge" style="--o:24px 24px;--t:6s">' +
            '<path d="M27.75 8.96 A15.5 15.5 0 0 1 39.16 27.22 M35.15 34.77 A15.5 15.5 0 0 1 13.63 35.52 M9.10 28.27 A15.5 15.5 0 0 1 19.21 9.26" fill="none" stroke="#27AE60" stroke-width="3.2" stroke-linecap="round"/>' +
            '<path d="M38.29 31.33 L42.29 27.89 L36.03 26.56 Z M10.51 32.71 L11.49 37.90 L15.77 33.14 Z M23.20 7.96 L18.22 6.22 L20.20 12.30 Z" fill="#27AE60"/></g>' +
            '<g class="tkg-nabiz" style="--s:1.1;--t:2s"><path d="M24 33 C16.5 30 15.5 20.5 24 14 C32.5 20.5 31.5 30 24 33 Z" fill="#58D68D"/>' +
            '<path d="M24 31.5 V18.5" stroke="#1E8449" stroke-width="1.4" stroke-linecap="round"/></g>',
        'ortaokul-8_4_2':            /* Hayvan Sevgisi: kuyruğunu sallayan, göz kırpan kedi; kalp yükselir */
            '<path class="tkg-sallan" style="--o:0% 100%;--a:12deg;--t:1.8s" d="M29 43 C36 43 40 39 38 31 C37 27 40 24 42 25" fill="none" stroke="#F5B041" stroke-width="3.2" stroke-linecap="round"/>' +
            '<path d="M13 44 C11 34 14 26 20 25 C26 25 30 31 30 44 Z" fill="#F5B041"/>' +
            '<path d="M17.5 30 q3 1.2 6 0 M16.5 35 q4.5 1.2 9 0" stroke="#D68910" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
            '<path d="M14.5 15.5 L14 8 L19.5 12.5 Z M27.5 15.5 L28 8 L22.5 12.5 Z" fill="#F5B041"/>' +
            '<path d="M15.2 13.8 L15 10.5 L17.6 12.6 Z M26.8 13.8 L27 10.5 L24.4 12.6 Z" fill="#F1948A"/>' +
            '<circle cx="21" cy="19" r="8" fill="#F5B041"/>' +
            '<ellipse class="tka-goz" cx="18" cy="18.5" rx="1.2" ry="1.7" fill="#2C3E50"/><ellipse class="tka-goz" cx="24" cy="18.5" rx="1.2" ry="1.7" fill="#2C3E50"/>' +
            '<path d="M20 21 h2 l-1 1.1 z" fill="#E74C3C"/>' +
            '<path d="M16.5 22 h-5 M16.5 23.5 l-4.5 1.5 M25.5 22 h5 M25.5 23.5 l4.5 1.5" stroke="#6E2C00" stroke-width=".7"/>' +
            '<path class="tkg-yuksel" style="--t:2.4s;--y:8px" d="M37 15 C34.5 13 33.5 12 33.5 10.8 a1.9 1.9 0 0 1 3.5 -.8 a1.9 1.9 0 0 1 3.5 .8 c0 1.2 -1 2.2 -3.5 4.2 z" fill="#E74C3C"/>',
        'ortaokul-8_4_3':            /* Doğal Afetler: deprem — ev sarsılır, yer yarılır, uyarı yanıp söner */
            '<g class="tkg-titre" style="--t:1s"><path d="M6 24 L18 13 L30 24" fill="none" stroke="#C0392B" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<rect x="9" y="22" width="18" height="16" fill="#FDEBD0" stroke="#E59866" stroke-width="1.5"/>' +
            '<rect x="15.5" y="30" width="5" height="8" fill="#A04000"/>' +
            '<path d="M12 24.5 l3 3 -2 2.5" fill="none" stroke="#A04000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></g>' +
            '<path d="M2 38.5 H20 L22.5 41 L21 43.5 L23.5 46 M24 38.5 H46" fill="none" stroke="#8D6E63" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path class="tkg-yanip" style="--t:.5s;--m:0" d="M3 20 l2 2 -2 2 M33 28 l2 2 -2 2" fill="none" stroke="#E67E22" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<g class="tkg-yanip" style="--t:1s;--m:.35"><path d="M38 8 L46 22 H30 Z" fill="#F1C40F" stroke="#D4AC0D" stroke-width="1.2" stroke-linejoin="round"/>' +
            '<path d="M38 12.5 v5" stroke="#2C3E50" stroke-width="1.8" stroke-linecap="round"/><circle cx="38" cy="19.6" r="1" fill="#2C3E50"/></g>',
        'ortaokul-8_5_1':            /* Sporun Tarihi: meşalenin alevi titreşir */
            '<path d="M12 41 q-3 -8 2 -14 M36 41 q3 -8 -2 -14" fill="none" stroke="#27AE60" stroke-width="1.6" stroke-linecap="round"/>' +
            '<path d="M11.2 33 q-3 -1 -3.4 -4 q3 .4 3.4 4 z M12.4 28 q-2.8 -1.6 -2.4 -4.6 q2.6 1 2.4 4.6 z M36.8 33 q3 -1 3.4 -4 q-3 .4 -3.4 4 z M35.6 28 q2.8 -1.6 2.4 -4.6 q-2.6 1 -2.4 4.6 z" fill="#58D68D"/>' +
            '<path d="M20 22 h8 l-2 22 h-4 z" fill="#B9770E"/><path d="M16 17 h16 l-3 6 h-10 z" fill="#D4AC0D"/>' +
            '<path class="tka-alev" d="M24 3 C28 8 31 11 29 15 C28 17 26 17.5 24 17.5 C22 17.5 20 17 19 15 C17 11 20 8 24 3 Z" fill="#E67E22"/>' +
            '<path class="tka-alev a2" d="M24 8 C26 11 27 13 26 15 C25.4 16.2 24.7 16.5 24 16.5 C23.3 16.5 22.6 16.2 22 15 C21 13 22 11 24 8 Z" fill="#F7DC6F"/>',
        'ortaokul-8_5_2':            /* Sporun Önemi: dambıl kalkar iner, kalp hızlı atar */
            '<g class="tkg-zipla" style="--y:6px;--t:1.4s"><rect x="10" y="20" width="28" height="3.4" rx="1.7" fill="#7F8C8D"/>' +
            '<rect x="6" y="14" width="6" height="15.4" rx="2" fill="#2C3E50"/><rect x="36" y="14" width="6" height="15.4" rx="2" fill="#2C3E50"/>' +
            '<rect x="2.5" y="16.5" width="4" height="10.4" rx="1.5" fill="#566573"/><rect x="41.5" y="16.5" width="4" height="10.4" rx="1.5" fill="#566573"/></g>' +
            '<path class="tkg-nabiz" style="--s:1.15;--t:.7s" d="M24 44 C19 40.5 17 38.5 17 36 a3.5 3.5 0 0 1 7 -1.2 a3.5 3.5 0 0 1 7 1.2 c0 2.5 -2 4.5 -7 8 z" fill="#E74C3C"/>',
        'ortaokul-8_5_3':            /* Spor Türleri: basketbol topu kavis çizip potaya girer */
            '<g class="tka-atis"><circle cx="10" cy="36" r="5.5" fill="#E67E22"/>' +
            '<path d="M4.5 36 h11 M10 30.5 v11 M6 32 q4 4 0 8 M14 32 q-4 4 0 8" stroke="#6E2C00" stroke-width=".8" fill="none"/></g>' +
            '<rect x="30" y="5" width="14" height="10" rx="1.5" fill="#fff" stroke="#95A5A6" stroke-width="1.4"/>' +
            '<rect x="34" y="8" width="6" height="4.5" fill="none" stroke="#E74C3C" stroke-width="1"/>' +
            '<path d="M44 15 V44" stroke="#95A5A6" stroke-width="2"/>' +
            '<path d="M31.5 17.5 l1.5 7 h6 l1.5 -7 M34 17.5 l.5 7 M38 17.5 l-.5 7" stroke="#BDC3C7" stroke-width=".9" fill="none"/>' +
            '<path d="M31 17 h10" stroke="#E74C3C" stroke-width="2" stroke-linecap="round"/>',
        'ortaokul-8_6_1':            /* Mezuniyet: kep havaya atılır, konfeti yağar */
            '<rect class="tkg-dus" style="--y:5px;--t:1.8s" x="7" y="5" width="2.4" height="2.4" fill="#E74C3C"/>' +
            '<rect class="tkg-dus" style="--y:5px;--t:1.8s;--g:.5s" x="17" y="3" width="2.4" height="2.4" fill="#3498DB"/>' +
            '<rect class="tkg-dus" style="--y:5px;--t:1.8s;--g:1s" x="31" y="4" width="2.4" height="2.4" fill="#27AE60"/>' +
            '<rect class="tkg-dus" style="--y:5px;--t:1.8s;--g:1.4s" x="41" y="7" width="2.4" height="2.4" fill="#F1C40F"/>' +
            '<g class="tka-kep"><path d="M24 14 L44 22 L24 30 L4 22 Z" fill="#2C3E50"/>' +
            '<path d="M13 26 v7 c0 3 5 5 11 5 s11 -2 11 -5 v-7 l-11 4.5 z" fill="#34495E"/>' +
            '<path d="M40 23.5 v8" stroke="#F1C40F" stroke-width="1.4"/><circle cx="40" cy="32.5" r="1.4" fill="#F1C40F"/></g>',
        'ortaokul-8_6_2':            /* Arkadaşlara Veda: ipte sallanan hatıra fotoğrafı, kalp yükselir */
            '<path d="M3 6 Q24 12 45 6" fill="none" stroke="#A0522D" stroke-width="1.2"/>' +
            '<g class="tkg-sallan" style="--o:50% 0%;--a:6deg;--t:2.4s"><rect x="11" y="9" width="26" height="30" rx="1.5" fill="#fff" stroke="#D5DBDB" stroke-width="1.2"/>' +
            '<rect x="14" y="12" width="20" height="18" fill="#D6EAF8"/>' +
            '<circle cx="20" cy="19" r="3.2" fill="#F5CBA7"/><path d="M15 30 a5 5 0 0 1 10 0 z" fill="#3498DB"/>' +
            '<circle cx="28" cy="19" r="3.2" fill="#F5CBA7"/><path d="M23 30 a5 5 0 0 1 10 0 z" fill="#E67E22"/>' +
            '<path d="M17 34.5 h14" stroke="#BDC3C7" stroke-width="1.4" stroke-linecap="round"/>' +
            '<rect x="22" y="7" width="4" height="4" rx="1" fill="#F1C40F"/></g>' +
            '<path class="tkg-yuksel" style="--t:2.6s;--y:8px" d="M42 26 C39.5 24 38.5 23 38.5 21.8 a1.9 1.9 0 0 1 3.5 -.8 a1.9 1.9 0 0 1 3.5 .8 c0 1.2 -1 2.2 -3.5 4.2 z" fill="#E74C3C"/>',
        'ortaokul-8_6_3':            /* Yaz Tatili: güneş, plaj şemsiyesi, kıpırdayan dalgalar */
            '<g class="tkg-don" style="--t:10s"><path d="M38 1.5 v2.5 M38 16 v2.5 M29.5 10 h2.5 M44 10 h2.5 M32 4 l1.8 1.8 M42.2 14.2 l1.8 1.8 M32 16 l1.8 -1.8 M42.2 5.8 l1.8 -1.8" stroke="#F7B731" stroke-width="1.6" stroke-linecap="round"/></g>' +
            '<circle class="tkg-nabiz" style="--s:1.1;--t:2s" cx="38" cy="10" r="5" fill="#F7B731"/>' +
            '<path d="M16 15 L22 42" stroke="#8D6E63" stroke-width="1.8" stroke-linecap="round"/>' +
            '<path d="M4 19 C8 8 22 5 28 12 C25 12.5 23 14 21.5 15.5 C19 14 15 14.5 12.5 16.5 C10 16.3 6.5 17.3 4 19 Z" fill="#E74C3C"/>' +
            '<path d="M16 8.2 C15 11 14 13.5 12.5 16.5 C15 14.5 17.5 14.2 19 14.6 C18.4 12.5 17.4 10 16 8.2 Z" fill="#fff"/>' +
            '<g class="tkg-kay" style="--x:-4px;--t:2.2s"><path d="M26 34 q3 -2.5 6 0 t6 0 t6 0" fill="none" stroke="#3498DB" stroke-width="2" stroke-linecap="round"/></g>' +
            '<g class="tkg-kay" style="--x:4px;--t:2.2s"><path d="M28 39 q3 -2.5 6 0 t6 0" fill="none" stroke="#5DADE2" stroke-width="2" stroke-linecap="round"/></g>' +
            '<path d="M2 44 C12 40 26 40 46 44 V46 H2 Z" fill="#F8C471"/>',
        /* --- 6. SINIF (2025-2026 önceki kitap) --- */
        'ortaokul-6_1_2':            /* Oyunlar: rüzgârda sallanan uçurtma */
            '<path d="M6 45 Q13 38 26 26" fill="none" stroke="#95A5A6" stroke-width="1" stroke-dasharray="2 2"/>' +
            '<g class="tkg-sallan" style="--o:50% 70%;--a:10deg;--t:2.2s"><path d="M28 3 L38 13 L28 29 L18 13 Z" fill="#E74C3C"/>' +
            '<path d="M28 3 L38 13 L28 13 Z" fill="#F7DC6F"/><path d="M18 13 L28 29 L28 13 Z" fill="#3498DB"/>' +
            '<path d="M28 3 V29 M18 13 H38" stroke="#fff" stroke-width="1.1"/>' +
            '<path d="M28 29 q-3 3 0 6 q3 3 0 6" fill="none" stroke="#8E44AD" stroke-width="1.4"/>' +
            '<path d="M26 33.5 l2 1.5 2 -1.5 M26 39.5 l2 1.5 2 -1.5" fill="none" stroke="#F39C12" stroke-width="1.6" stroke-linecap="round"/></g>',
        'ortaokul-6_2_1':            /* Kahvaltıda: ince belli bardakta çay, buhar yükselir; yumurta */
            '<path class="tkg-yuksel" style="--t:2.4s;--y:6px" d="M15 10 q-2 -3 0 -6" fill="none" stroke="#BFC9CA" stroke-width="1.6" stroke-linecap="round"/>' +
            '<path class="tkg-yuksel" style="--t:2.4s;--y:6px;--g:-1.2s" d="M20 10 q2 -3 0 -6" fill="none" stroke="#BFC9CA" stroke-width="1.6" stroke-linecap="round"/>' +
            '<path d="M11 14 h12 c-1 4 -3 6 -3 9 c0 3 2 5 3 9 h-12 c1 -4 3 -6 3 -9 c0 -3 -2 -5 -3 -9 z" fill="#E59866" stroke="#A04000" stroke-width="1.2"/>' +
            '<path d="M13 16 c.5 2 1.5 3.5 2 5" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>' +
            '<ellipse cx="17" cy="33.5" rx="9" ry="2.4" fill="#D6EAF8" stroke="#85C1E9" stroke-width="1"/>' +
            '<ellipse cx="36" cy="25" rx="4.3" ry="5.4" fill="#FDFEFE" stroke="#D5DBDB" stroke-width="1"/>' +
            '<path d="M31 29.5 h10 l-1.5 5 h-7 z" fill="#5DADE2"/>' +
            '<path d="M3 36 H45" stroke="#D5DBDB" stroke-width="1.6" stroke-linecap="round"/>' +
            '<circle class="tkg-nabiz" style="--s:1.12;--t:2s" cx="40" cy="9" r="4" fill="#F7B731"/>',
        'ortaokul-6_2_2':            /* Öğle Yemeğinde: tütsülenen çorba kâsesi, kaşık, öğle güneşi */
            '<path class="tkg-yuksel" style="--t:2.2s;--y:7px" d="M17 20 q-2 -3 0 -6" fill="none" stroke="#BFC9CA" stroke-width="1.6" stroke-linecap="round"/>' +
            '<path class="tkg-yuksel" style="--t:2.2s;--y:7px;--g:-.75s" d="M24 19 q2 -3 0 -6" fill="none" stroke="#BFC9CA" stroke-width="1.6" stroke-linecap="round"/>' +
            '<path class="tkg-yuksel" style="--t:2.2s;--y:7px;--g:-1.5s" d="M31 20 q-2 -3 0 -6" fill="none" stroke="#BFC9CA" stroke-width="1.6" stroke-linecap="round"/>' +
            '<path d="M38 8 L28 25" stroke="#95A5A6" stroke-width="2" stroke-linecap="round"/>' +
            '<path d="M6 26 h36 c0 9 -8 15 -18 15 s-18 -6 -18 -15 z" fill="#E74C3C"/>' +
            '<ellipse cx="24" cy="26" rx="18" ry="3" fill="#F5B041"/>' +
            '<rect x="18" y="40" width="12" height="3" rx="1.5" fill="#C0392B"/>' +
            '<circle class="tkg-nabiz" style="--s:1.15;--t:2s" cx="8" cy="8" r="3.6" fill="#F7B731"/>',
        'ortaokul-6_2_3':            /* Akşam Yemeğinde: tabak, çatal bıçak, hilal ve yıldızlar */
            '<path d="M37.47 4.02 A6 6 0 1 0 43.71 11.83 A5 5 0 0 1 37.47 4.02 Z" fill="#F7DC6F"/>' +
            '<path class="tka-parla" d="M26 5 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill="#F6C344"/>' +
            '<path class="tka-parla p2" d="M44 21 l.8 1.9 1.9 .8 -1.9 .8 -.8 1.9 -.8 -1.9 -1.9 -.8 1.9 -.8 Z" fill="#F6C344"/>' +
            '<circle cx="22" cy="31" r="13" fill="#FDFEFE" stroke="#D5DBDB" stroke-width="1.6"/>' +
            '<circle cx="22" cy="31" r="8.5" fill="none" stroke="#EAEDED" stroke-width="1.2"/>' +
            '<circle cx="19" cy="30" r="3" fill="#E67E22"/><circle cx="25" cy="32" r="2.6" fill="#27AE60"/><circle cx="21" cy="35" r="1.8" fill="#F4D03F"/>' +
            '<path d="M4.5 19 v5 q1.5 2 3 0 v-5 M6 24 v20" fill="none" stroke="#95A5A6" stroke-width="1.6" stroke-linecap="round"/>' +
            '<path d="M40 27 v17" stroke="#95A5A6" stroke-width="2" stroke-linecap="round"/><path d="M40 27 c2.5 0 3 3 3 8 h-3 z" fill="#BDC3C7"/>',
        'ortaokul-6_3_2':            /* Hastanede: çatıda yanıp sönen kırmızı artı */
            '<rect x="8" y="17" width="32" height="27" fill="#EBF5FB" stroke="#5DADE2" stroke-width="1.6"/>' +
            '<rect x="17.5" y="3" width="13" height="13" rx="2.5" fill="#fff" stroke="#E74C3C" stroke-width="1.4"/>' +
            '<path class="tkg-yanip" style="--t:1.2s;--m:.3" d="M22.5 5.5 h3 v2.5 h2.5 v3 h-2.5 v2.5 h-3 v-2.5 h-2.5 v-3 h2.5 z" fill="#E74C3C"/>' +
            '<rect x="11.5" y="21" width="5" height="4.5" fill="#AED6F1"/><rect x="21.5" y="21" width="5" height="4.5" fill="#AED6F1"/><rect x="31.5" y="21" width="5" height="4.5" fill="#AED6F1"/>' +
            '<rect x="11.5" y="29" width="5" height="4.5" fill="#AED6F1"/><rect x="31.5" y="29" width="5" height="4.5" fill="#AED6F1"/>' +
            '<rect x="20" y="33" width="8" height="11" fill="#5DADE2"/><path d="M24 33 v11" stroke="#EBF5FB" stroke-width="1"/>',
        'ortaokul-6_3_3':            /* Temizlik: sabun, yükselen köpük baloncukları */
            '<circle class="tkg-yuksel" style="--t:2.6s;--y:14px;--x:-2px" cx="24" cy="25" r="4" fill="#EBF5FB" stroke="#85C1E9" stroke-width="1.2"/>' +
            '<circle class="tkg-yuksel" style="--t:2.6s;--y:14px;--x:3px;--g:-.9s" cx="33" cy="22" r="3" fill="#EBF5FB" stroke="#85C1E9" stroke-width="1.2"/>' +
            '<circle class="tkg-yuksel" style="--t:2.6s;--y:12px;--x:-3px;--g:-1.7s" cx="16" cy="22" r="2.6" fill="#EBF5FB" stroke="#85C1E9" stroke-width="1.2"/>' +
            '<circle class="tkg-yuksel" style="--t:2.6s;--y:12px;--x:2px;--g:-2.2s" cx="40" cy="27" r="3.4" fill="#EBF5FB" stroke="#85C1E9" stroke-width="1.2"/>' +
            '<rect x="8" y="29" width="26" height="13" rx="4.5" fill="#F5B7B1" stroke="#EC7063" stroke-width="1.4"/>' +
            '<path d="M9 30 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0" fill="#FDFEFE" stroke="#D6EAF8" stroke-width="1"/>' +
            '<path d="M13 35.5 h11" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>' +
            '<path class="tka-parla" d="M40 8 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill="#85C1E9"/>',
        'ortaokul-6_4_1':            /* Mevsimler: ağacın yaprakları bahar, yaz, sonbahar, kış renklerine döner */
            '<path d="M4 44 H44" stroke="#AAB7B8" stroke-width="1.6" stroke-linecap="round"/>' +
            '<path d="M21 44 h6 l-1 -15 h-4 z" fill="#8D6E63"/>' +
            '<g class="tka-mevsim"><circle cx="24" cy="18" r="11"/><circle cx="15" cy="24" r="7"/><circle cx="33" cy="24" r="7"/></g>' +
            '<path class="tka-yaprakdus" d="M34 28 q3 -1 4 2 q-3 1 -4 -2 z" fill="#E67E22"/>' +
            '<circle class="tka-kar" cx="10" cy="8" r="1.4" fill="#AED6F1"/><circle class="tka-kar k2" cx="38" cy="6" r="1.4" fill="#AED6F1"/><circle class="tka-kar k3" cx="42" cy="16" r="1.2" fill="#AED6F1"/>',
        'ortaokul-6_4_2':            /* Kışlık Kıyafetler: bere, atkı, yağan kar taneleri */
            '<g class="tkg-dus" style="--y:5px;--t:2s"><path d="M6 6.6 V11.4 M3.9 7.8 L8.1 10.2 M3.9 10.2 L8.1 7.8" stroke="#85C1E9" stroke-width="1.2" stroke-linecap="round"/></g>' +
            '<g class="tkg-dus" style="--y:5px;--t:2s;--g:.7s"><path d="M42 12.6 V17.4 M39.9 13.8 L44.1 16.2 M39.9 16.2 L44.1 13.8" stroke="#85C1E9" stroke-width="1.2" stroke-linecap="round"/></g>' +
            '<g class="tkg-dus" style="--y:5px;--t:2s;--g:1.3s"><path d="M38 1.6 V6.4 M35.9 2.8 L40.1 5.2 M35.9 5.2 L40.1 2.8" stroke="#85C1E9" stroke-width="1.2" stroke-linecap="round"/></g>' +
            '<circle cx="24" cy="9" r="4" fill="#fff" stroke="#D6EAF8" stroke-width="1.2"/>' +
            '<path d="M10 26 a14 13 0 0 1 28 0 z" fill="#3498DB"/>' +
            '<rect x="8" y="24" width="32" height="7" rx="3" fill="#1F618D"/>' +
            '<path d="M12 27.5 h24" stroke="#fff" stroke-width="1.2" stroke-dasharray="2 2"/>' +
            '<path d="M9 34 h30 v5 h-30 z" fill="#E74C3C"/><path d="M29 37 v8 h5 v-8 z" fill="#C0392B"/>' +
            '<path d="M29.5 45 v1.6 M31.5 45 v1.6 M33.5 45 v1.6" stroke="#C0392B" stroke-width="1" stroke-linecap="round"/>',
        'ortaokul-6_4_3':            /* Yazlık Kıyafetler: tişört, zıplayan güneş gözlüğü, dönen güneş */
            '<g class="tkg-don" style="--t:10s"><path d="M40 0.5 v2 M40 14 v2 M32 8.3 h2 M46 8.3 h2 M34.3 2.6 l1.4 1.4 M44.3 12.6 l1.4 1.4 M34.3 14 l1.4 -1.4 M44.3 4 l1.4 -1.4" stroke="#F7B731" stroke-width="1.5" stroke-linecap="round"/></g>' +
            '<circle cx="40" cy="8.3" r="4.2" fill="#F7B731"/>' +
            '<path d="M15 12 L5 17 L8 24 L13 21.5 V42 H35 V21.5 L40 24 L43 17 L33 12 C31 15 28 16.5 24 16.5 C20 16.5 17 15 15 12 Z" fill="#48C9B0" stroke="#17A589" stroke-width="1.2" stroke-linejoin="round"/>' +
            '<g class="tkg-zipla" style="--y:2px;--t:1.6s"><circle cx="19" cy="28" r="3.6" fill="#2C3E50"/><circle cx="29" cy="28" r="3.6" fill="#2C3E50"/>' +
            '<path d="M22.6 27.5 h2.8" stroke="#2C3E50" stroke-width="1.4"/><path d="M17.5 26.5 l1.5 -1" stroke="#fff" stroke-width=".9" stroke-linecap="round"/></g>',
        'ortaokul-6_5_1':            /* Mekke-i Mükerreme'de: Kâbe ve çevresinde tavaf eden noktalar */
            '<g transform="translate(24 37) scale(1 .3)"><g class="tkg-yorunge" style="--o:0px 0px;--t:8s;--yon:reverse" fill="#AED6F1">' +
            '<circle cx="18" cy="0" r="2.6"/><circle cx="12.7" cy="12.7" r="2.6"/><circle cx="0" cy="18" r="2.6"/><circle cx="-12.7" cy="12.7" r="2.6"/>' +
            '<circle cx="-18" cy="0" r="2.6"/><circle cx="-12.7" cy="-12.7" r="2.6"/><circle cx="0" cy="-18" r="2.6"/><circle cx="12.7" cy="-12.7" r="2.6"/></g></g>' +
            '<path d="M13 15 L19 11 H37 L31 15 Z" fill="#34495E"/>' +
            '<path d="M31 15 L37 11 V33 L31 37 Z" fill="#17202A"/>' +
            '<rect x="13" y="15" width="18" height="22" fill="#212F3D"/>' +
            '<path d="M13 20 h18 l6 -4 v2.2 l-6 4 h-18 z" fill="#D4AC0D"/>' +
            '<rect x="25" y="26" width="4" height="7" fill="#D4AC0D"/>' +
            '<path class="tka-parla" d="M8 6 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill="#F6C344"/>',
        'ortaokul-6_5_2':            /* Medine-i Münevvere'de: Yeşil Kubbe, minare, parlayan yıldızlar */
            '<path class="tka-parla" d="M7 7 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill="#F6C344"/>' +
            '<path class="tka-parla p2" d="M31 4 l.8 1.9 1.9 .8 -1.9 .8 -.8 1.9 -.8 -1.9 -1.9 -.8 1.9 -.8 Z" fill="#F6C344"/>' +
            '<rect x="37.5" y="13" width="4.5" height="31" fill="#FDFEFE" stroke="#D5DBDB" stroke-width="1"/>' +
            '<path d="M36.8 13 L39.75 5.5 L42.7 13 Z" fill="#1E8449"/><rect x="36.5" y="21" width="6.5" height="2" fill="#D5DBDB"/>' +
            '<rect x="6" y="30" width="30" height="14" fill="#FDFEFE" stroke="#D5DBDB" stroke-width="1.2"/>' +
            '<path d="M10 44 v-6 a2.5 2.5 0 0 1 5 0 v6 M18.5 44 v-6 a2.5 2.5 0 0 1 5 0 v6 M27 44 v-6 a2.5 2.5 0 0 1 5 0 v6" fill="#D6EAF8"/>' +
            '<rect x="12" y="26" width="18" height="4.5" fill="#F4F6F6" stroke="#D5DBDB" stroke-width="1"/>' +
            '<path class="tkg-nabiz" style="--o:50% 100%;--s:1.05;--t:2.4s" d="M12.5 26.5 C11.5 19 15.5 14 21 10.5 C26.5 14 30.5 19 29.5 26.5 Z" fill="#1E8449"/>' +
            '<path d="M21 10.5 V6" stroke="#D4AC0D" stroke-width="1.2"/><circle cx="21" cy="5.4" r="1.3" fill="#D4AC0D"/>',
        'ortaokul-6_5_3':            /* Kudüs-i Şerif'te: Kubbetü's-Sahra, altın kubbede kayan parıltı */
            '<path d="M6 44 V30 L10 26 H38 L42 30 V44 Z" fill="#2E86DE"/>' +
            '<path d="M8 33.5 h32 M8 38.5 h32" stroke="#AED6F1" stroke-width="1"/>' +
            '<path d="M12 44 v-4 a2 2 0 0 1 4 0 v4 M22 44 v-4 a2 2 0 0 1 4 0 v4 M32 44 v-4 a2 2 0 0 1 4 0 v4" fill="#1B4F72"/>' +
            '<rect x="15" y="21.5" width="18" height="5" fill="#5DADE2"/>' +
            '<path d="M14.5 22 C14.5 13 19 8.5 24 8.5 C29 8.5 33.5 13 33.5 22 Z" fill="#F4D03F" stroke="#D4AC0D" stroke-width="1"/>' +
            '<ellipse class="tkg-kay" style="--x:9px;--t:2.6s" cx="18.5" cy="15.5" rx="1.8" ry="4" fill="#fff" opacity=".5"/>' +
            '<path d="M24 8.5 V4" stroke="#D4AC0D" stroke-width="1.2"/><circle cx="24" cy="3.4" r="1.1" fill="#D4AC0D"/>',
        'ortaokul-6_6_1':            /* Ulaşım Araçları: otobüs yolda, tekerlekler döner */
            '<path class="tka-yol" d="M2 43.5 H46" stroke="#95A5A6" stroke-width="1.6" stroke-dasharray="5 4"/>' +
            '<g class="tkg-zipla" style="--y:1px;--t:.5s"><rect x="4" y="11" width="39" height="25" rx="4" fill="#F4D03F" stroke="#D4AC0D" stroke-width="1.2"/>' +
            '<rect x="7" y="15" width="7" height="7" rx="1" fill="#D6EAF8"/><rect x="16" y="15" width="7" height="7" rx="1" fill="#D6EAF8"/><rect x="25" y="15" width="7" height="7" rx="1" fill="#D6EAF8"/>' +
            '<rect x="34.5" y="15" width="6" height="14" rx="1" fill="#AED6F1"/>' +
            '<path d="M4 26 H34" stroke="#E67E22" stroke-width="2"/><circle cx="41" cy="31.5" r="1.4" fill="#fff"/></g>' +
            '<g class="tkg-don" style="--t:.9s"><circle cx="13" cy="37" r="4.5" fill="#2C3E50"/><path d="M13 33.5 v7 M9.5 37 h7" stroke="#95A5A6" stroke-width="1.2"/></g>' +
            '<g class="tkg-don" style="--t:.9s"><circle cx="34" cy="37" r="4.5" fill="#2C3E50"/><path d="M34 33.5 v7 M30.5 37 h7" stroke="#95A5A6" stroke-width="1.2"/></g>',
        'ortaokul-6_6_2':            /* Trafik: trafik ışığı kırmızı → sarı → yeşil */
            '<path d="M24 36 V45" stroke="#7F8C8D" stroke-width="3" stroke-linecap="round"/>' +
            '<rect x="15" y="3" width="18" height="34" rx="5" fill="#2C3E50"/>' +
            '<circle cx="24" cy="10.5" r="4.2" fill="#5D6D7E"/><circle cx="24" cy="20" r="4.2" fill="#5D6D7E"/><circle cx="24" cy="29.5" r="4.2" fill="#5D6D7E"/>' +
            '<circle class="tka-isik1" cx="24" cy="10.5" r="4.2" fill="#E74C3C"/>' +
            '<circle class="tka-isik2" cx="24" cy="20" r="4.2" fill="#F4D03F"/>' +
            '<circle class="tka-isik3" cx="24" cy="29.5" r="4.2" fill="#2ECC71"/>' +
            '<path d="M12 8 h3 M12 17.5 h3 M12 27 h3 M33 8 h3 M33 17.5 h3 M33 27 h3" stroke="#2C3E50" stroke-width="2" stroke-linecap="round"/>',
        'ortaokul-6_6_3':            /* Tatil Yolumda: tepesinde bavulla giden araba, geçen ağaçlar */
            '<g class="tkg-ucus" style="--x:-18px;--t:2.4s"><path d="M38 30 v6" stroke="#8D6E63" stroke-width="1.6"/><circle cx="38" cy="26.5" r="4.2" fill="#58D68D"/></g>' +
            '<path class="tka-yol" d="M2 43.5 H46" stroke="#95A5A6" stroke-width="1.6" stroke-dasharray="5 4"/>' +
            '<g class="tkg-zipla" style="--y:1px;--t:.5s"><rect x="15" y="14" width="12" height="6" rx="1.2" fill="#F5B041" stroke="#B9770E" stroke-width="1"/>' +
            '<path d="M19 14 v-1.5 h4 V14" fill="none" stroke="#B9770E" stroke-width="1"/>' +
            '<path d="M4 35 v-6 l5 -1 4 -7 h16 l6 7 7 1.5 V35 Z" fill="#E74C3C"/>' +
            '<path d="M14.5 22.5 h6 v5.5 h-9.5 z M22 22.5 h6.2 l4.5 5.5 h-10.7 z" fill="#D6EAF8"/>' +
            '<circle cx="40" cy="31" r="1.3" fill="#F7DC6F"/></g>' +
            '<g class="tkg-don" style="--t:.9s"><circle cx="12" cy="36" r="4.2" fill="#2C3E50"/><path d="M12 32.8 v6.4 M8.8 36 h6.4" stroke="#95A5A6" stroke-width="1.2"/></g>' +
            '<g class="tkg-don" style="--t:.9s"><circle cx="34" cy="36" r="4.2" fill="#2C3E50"/><path d="M34 32.8 v6.4 M30.8 36 h6.4" stroke="#95A5A6" stroke-width="1.2"/></g>',
        /* --- 5-8. SINIF GRUP ROZETLERİ --- */
        'grup-g5':
            '<circle class="tka-rozet" cx="24" cy="24" r="17" fill="#F5A623"/><circle cx="24" cy="24" r="21" fill="none" stroke="#F5A623" stroke-width="2" stroke-dasharray="4 4" class="tka-halka"/>' +
            '<text x="24" y="31" text-anchor="middle" font-size="19" font-weight="700" fill="#fff" font-family="Rubik,sans-serif">5</text>',
        'grup-g6':
            '<circle class="tka-rozet" cx="24" cy="24" r="17" fill="#3498DB"/><circle cx="24" cy="24" r="21" fill="none" stroke="#3498DB" stroke-width="2" stroke-dasharray="4 4" class="tka-halka"/>' +
            '<text x="24" y="31" text-anchor="middle" font-size="19" font-weight="700" fill="#fff" font-family="Rubik,sans-serif">6</text>',
        'grup-g7':
            '<circle class="tka-rozet" cx="24" cy="24" r="17" fill="#9B59B6"/><circle cx="24" cy="24" r="21" fill="none" stroke="#9B59B6" stroke-width="2" stroke-dasharray="4 4" class="tka-halka"/>' +
            '<text x="24" y="31" text-anchor="middle" font-size="19" font-weight="700" fill="#fff" font-family="Rubik,sans-serif">7</text>',
        'grup-g8':
            '<circle class="tka-rozet" cx="24" cy="24" r="17" fill="#27AE60"/><circle cx="24" cy="24" r="21" fill="none" stroke="#27AE60" stroke-width="2" stroke-dasharray="4 4" class="tka-halka"/>' +
            '<text x="24" y="31" text-anchor="middle" font-size="19" font-weight="700" fill="#fff" font-family="Rubik,sans-serif">8</text>',
        /* --- GRUP BAŞLIKLARI --- */
        'grup-harf':
            '<rect x="3" y="7" width="20" height="30" rx="6" fill="#FFF1CF" stroke="#F39C12" stroke-width="2"/>' +
            '<text x="13" y="28.5" text-anchor="middle" font-size="19" fill="#B7650B" ' + AR + '>أ</text>' +
            '<g class="tka-kart2"><rect x="25" y="11" width="20" height="30" rx="6" fill="#E8F6F1" stroke="#16A085" stroke-width="2"/>' +
            '<text x="35" y="32.5" text-anchor="middle" font-size="19" fill="#0E7C66" ' + AR + '>ب</text></g>',
        'grup-g9':
            '<circle class="tka-rozet" cx="24" cy="24" r="17" fill="#EF5350"/><circle cx="24" cy="24" r="21" fill="none" stroke="#EF5350" stroke-width="2" stroke-dasharray="4 4" class="tka-halka"/>' +
            '<text x="24" y="31" text-anchor="middle" font-size="19" font-weight="700" fill="#fff" font-family="Rubik,sans-serif">9</text>',
        'grup-g10':
            '<circle cx="24" cy="24" r="17" fill="#16A085"/><circle cx="24" cy="24" r="21" fill="none" stroke="#16A085" stroke-width="2" stroke-dasharray="4 4" class="tka-halka"/>' +
            '<text x="24" y="30.5" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="Rubik,sans-serif">10</text>',
        'varsayilan':
            '<path d="M24 12 C19 8 12 7 5 8 V38 C12 37 19 38 24 42 C29 38 36 37 43 38 V8 C36 7 29 8 24 12 Z" fill="#E8F6F1" stroke="#16A085" stroke-width="2" stroke-linejoin="round"/>' +
            '<path d="M24 12 V42" stroke="#16A085" stroke-width="2"/>'
    };
    /* Aynı konudaki dersler aynı simgeyi paylaşır */
    S['ortaokul-5_3_1'] = S['grade10-unit1-lesson2'];          /* Aile Bireyleri ← Mutlu Aile */
    S['ortaokul-5_3_2'] = S['grade10-unit5-lesson1'];          /* Meslekler */
    S['ortaokul-y2627-6_1_2'] = S['grade10-unit5-lesson1'];    /* Meslekler */
    S['ortaokul-y2627-6_4_1'] = S['grade10-unit6-lesson1'];    /* Hava Durumu */
    S['ortaokul-6_1_1'] = S['ortaokul-y2627-6_2_1'];           /* Okulda ← okul binası */
    S['ortaokul-6_1_3'] = S['grade9-unit3-lesson1'];           /* Evde ← Evdeyim */
    S['ortaokul-6_3_1'] = S['grade10-unit7-lesson1'];          /* Vücut Organları */

    function ikon(id, sinif) {
        var ic = S[id] || S.varsayilan;
        return '<svg class="tki ' + (sinif || '') + '" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + ic + '</svg>';
    }
    var KILIT = '<svg class="tkl-kilit" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="#95A5A6"/>' +
        '<path d="M8 10.5 V8 a4 4 0 0 1 8 0 v2.5" fill="none" stroke="#95A5A6" stroke-width="2.2"/></svg>';
    var ONAY = '<svg class="tkl-onay" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 l4.5 4.5 L19 7.5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var OK = '<svg class="tkl-ok" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10 l5 5 5 -5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function grupOf(id) {
        if (/^alfabe-/.test(id)) return 'harf';
        if (/^grade9-/.test(id)) return 'g9';
        if (/^grade10-/.test(id)) return 'g10';
        return 'diger';
    }
    var GRUP_AD = { harf: 'Harfler', g5: '5. Sınıf', g6: '6. Sınıf', g7: '7. Sınıf', g8: '8. Sınıf',
                    g9: '9. Sınıf', g10: '10. Sınıf', diger: 'Diğer' };
    /* seçenekteki data-grup (testkapismasi.js yazar) önce; yoksa kimlikten */
    function grupSec(o) { return (o.dataset && o.dataset.grup) || grupOf(o.value); }
    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function temizAd(t) { return String(t || '').replace(/^\s*🔒\s*/, ''); }   /* baştaki kilit emojisi */

    /* ---------------------------------------------------------- KABUK */
    var kap = document.createElement('div');
    kap.className = 'tkl';
    sel.parentNode.insertBefore(kap, sel);
    kap.appendChild(sel);
    sel.classList.add('tkl-yerel');
    sel.setAttribute('tabindex', '-1');
    sel.setAttribute('aria-hidden', 'true');
    var dug = document.createElement('button');
    dug.type = 'button';
    dug.className = 'tkl-dug';
    dug.id = 'lesson-picker';
    dug.setAttribute('aria-haspopup', 'listbox');
    dug.setAttribute('aria-expanded', 'false');
    var panel = document.createElement('div');
    panel.className = 'tkl-panel';
    panel.setAttribute('role', 'listbox');
    panel.hidden = true;
    kap.appendChild(dug);
    kap.appendChild(panel);
    var etiket = kap.parentNode && kap.parentNode.querySelector('label[for="lesson-select"]');
    if (etiket) etiket.setAttribute('for', 'lesson-picker');

    /* AKORDİYON: her sınıf bir bölüm; sayfa açılınca HEPSİ KAPALI.
       Tek-açılır (sitedeki İmam Hatip akordiyonu gibi): biri açılınca
       öbürü kapanır. Açık bölüm yalnız bu sayfa açıkken hatırlanır. */
    var acikGrup = null;
    var CHEV = '<svg class="tkl-grup-ok" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10 l5 5 5 -5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function kur() {
        var gruplar = [], son = null, bolum = null;
        [].forEach.call(sel.options, function (o) {
            if (!o.value) return;
            var g = grupSec(o);
            if (g !== son) { bolum = { g: g, satir: [] }; gruplar.push(bolum); son = g; }
            var kilitli = o.disabled, secili = (o.value === sel.value);
            var alt = o.dataset && o.dataset.alt ? '<small class="tkl-alt">' + esc(o.dataset.alt) + '</small>' : '';
            bolum.satir.push('<button type="button" style="--i:' + bolum.satir.length + '" class="tkl-oge' + (kilitli ? ' kilitli' : '') + (secili ? ' secili' : '') + '" data-v="' + esc(o.value) + '" role="option"' +
                 ' aria-selected="' + secili + '"' + (kilitli ? ' aria-disabled="true" title="Önceki dersi bitirince açılır"' : '') + '>' +
                 ikon(o.value) + '<span class="tkl-ad">' + esc(temizAd(o.textContent)) + alt + '</span>' + (kilitli ? KILIT : (secili ? ONAY : '')) + '</button>');
        });
        if (acikGrup && !gruplar.some(function (b) { return b.g === acikGrup; })) acikGrup = null;
        /* Sınıf kartından gelindiyse (?sinif=N) listede tek bölüm var: kapalı tek
           başlık göstermenin anlamı yok, o bölüm açık gelir. */
        if (gruplar.length === 1) acikGrup = gruplar[0].g;
        panel.innerHTML = gruplar.map(function (b) {
            var acik = b.g === acikGrup;
            var rozet = (b.g === 'g6' && window.TKOrtaokul && window.TKOrtaokul.yilRozet) ? window.TKOrtaokul.yilRozet(6) : '';
            return '<div class="tkl-bolum' + (acik ? ' acik' : '') + '" data-g="' + b.g + '">' +
                /* başlığın tamamı tıklanır; klavye odağı düğmede. Yıl seçicisi düğmenin
                   DIŞINDA (düğme içine seçim kutusu konamaz), tıklanınca akordiyon oynamaz. */
                '<div class="tkl-grup tkl-g-' + b.g + '" data-grup="' + b.g + '">' +
                    '<button type="button" class="tkl-grup-dug" data-grup="' + b.g + '" aria-expanded="' + acik + '" aria-controls="tkl-gv-' + b.g + '">' +
                        ikon('grup-' + b.g) + '<span class="tkl-grup-ad">' + GRUP_AD[b.g] + '</span></button>' +
                    (rozet ? '<span class="tkl-yil">' + rozet + '</span>' : '') +
                    '<span class="tkl-sayi">' + b.satir.length + ' ders</span>' + CHEV +
                '</div>' +
                '<div class="tkl-govde" id="tkl-gv-' + b.g + '" role="group" aria-label="' + GRUP_AD[b.g] + '"><div class="tkl-govde-ic">' + b.satir.join('') + '</div></div>' +
            '</div>';
        }).join('');
        yazEtiket();
    }

    /* Bölüm aç/kapat. Açılan bölümün başlığı listenin tepesine kayar
       (öbürleri kapanınca başlıklar tek sıra kalır: hedef, önceki
       başlıkların toplam yüksekliği). */
    function grupAcKapa(g, zorla) {
        var ac_ = (zorla === undefined) ? (acikGrup !== g) : !!zorla;
        acikGrup = ac_ ? g : (acikGrup === g ? null : acikGrup);
        var hedef = parseFloat(getComputedStyle(panel).paddingTop) || 0, bulundu = false, hedefBolum = null;
        [].forEach.call(panel.querySelectorAll('.tkl-bolum'), function (b) {
            var bu = b.getAttribute('data-g') === acikGrup;
            b.classList.toggle('acik', bu);
            var d = b.querySelector('.tkl-grup-dug');
            if (d) d.setAttribute('aria-expanded', bu ? 'true' : 'false');
            if (b.getAttribute('data-g') === g) { bulundu = true; hedefBolum = b; }
            if (!bulundu) hedef += b.querySelector('.tkl-grup').offsetHeight + (parseFloat(getComputedStyle(b).marginBottom) || 0);
        });
        if (ac_) {
            kaydir(hedef);
            /* açılma/kapanma geçişi bitince asıl yerine bir kez daha (geçiş sırasında
               liste henüz o kadar uzun olmayabilir) */
            setTimeout(function () { if (acikGrup === g && hedefBolum) kaydir(hedefBolum.offsetTop); }, 360);
        }
    }

    function kaydir(y) {
        if (Math.abs(panel.scrollTop - y) < 2) return;
        try { panel.scrollTo({ top: y, behavior: 'smooth' }); } catch (e) { panel.scrollTop = y; }
    }
    function yazEtiket() {
        var o = sel.options[sel.selectedIndex];
        var bos = !o || !o.value;
        dug.disabled = sel.disabled;
        dug.classList.toggle('bos', bos);
        var altDug = '';
        if (!bos) {
            var g = grupSec(o), uNo = (o.dataset && o.dataset.alt) ? o.dataset.alt.split(' · ')[0] : '';
            if (g !== 'harf') altDug = '<small class="tkl-alt">' + esc(GRUP_AD[g] + (uNo ? ' · ' + uNo : '')) + '</small>';
        }
        dug.innerHTML = (bos ? '<span class="tkl-yer">' + esc(o ? temizAd(o.textContent) : 'Ders Seçin') + '</span>'
                             : ikon(o.value, 'buyuk') + '<span class="tkl-ad">' + esc(temizAd(o.textContent)) + altDug + '</span>') + OK;
        if (sel.disabled) ac(false);
    }
    /* Liste ekrana sığsın: aşağıda yer yoksa YUKARI açılır, boyu kalan
       boşluk kadar olur (başlangıç ekranı kendi içinde kaymasın). */
    function yerlestir() {
        var r = dug.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var alt = vh - r.bottom - 16, ust = r.top - 16;
        var yukari = alt < 320 && ust > alt;
        kap.classList.toggle('yukari', yukari);
        panel.style.maxHeight = Math.max(170, Math.min(470, yukari ? ust : alt)) + 'px';
    }
    function ac(evet) {
        if (evet && sel.disabled) return;
        if (evet) yerlestir();
        panel.hidden = !evet;
        kap.classList.toggle('acik', !!evet);
        dug.setAttribute('aria-expanded', evet ? 'true' : 'false');
        if (evet) {
            /* seçili ders açık bölümdeyse ona, değilse ilk başlığa */
            var sc = panel.querySelector('.tkl-bolum.acik .tkl-oge.secili');
            var hedef = sc || panel.querySelector('.tkl-bolum.acik .tkl-grup-dug') || panel.querySelector('.tkl-grup-dug');
            if (sc) panel.scrollTop = Math.max(0, sc.offsetTop - 96);
            else {
                var ab = panel.querySelector('.tkl-bolum.acik');
                panel.scrollTop = ab ? ab.offsetTop : 0;
            }
            if (hedef) hedef.focus({ preventScroll: true });
        }
    }
    function sec(b) {
        if (!b || b.classList.contains('kilitli')) return;
        sel.value = b.getAttribute('data-v');
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        ac(false);
        kur();
        dug.focus();
    }

    new MutationObserver(function () { kur(); }).observe(sel, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
    sel.addEventListener('change', function () { yazEtiket(); });
    dug.addEventListener('click', function () { ac(panel.hidden); });
    panel.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('.kd-yil')) return;          /* yıl seçicisi */
        var gb = e.target.closest && e.target.closest('.tkl-grup');
        if (gb) { grupAcKapa(gb.getAttribute('data-grup')); return; }
        sec(e.target.closest && e.target.closest('.tkl-oge'));
    });
    document.addEventListener('click', function (e) {
        if (panel.hidden || kap.contains(e.target)) return;
        if (etiket && etiket.contains(e.target)) return;   /* etikete tıklamak düğmeye tıklamak sayılır */
        ac(false);
    });
    window.addEventListener('resize', function () { if (!panel.hidden) yerlestir(); });
    /* klavye: ↑ ↓ başlıklar ve açık bölümün dersleri arasında gezer; Enter/Boşluk
       başlığı açar-kapar ya da dersi seçer; ← başlığa döner; Esc kapatır */
    kap.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !panel.hidden) { e.preventDefault(); ac(false); dug.focus(); return; }
        if (e.key === 'Tab') { if (!panel.hidden) ac(false); return; }
        if (e.target && e.target.tagName === 'SELECT') return;      /* 6. sınıf yıl seçicisi */
        if (e.key === 'ArrowLeft' && e.target.classList && e.target.classList.contains('tkl-oge')) {
            var bb = e.target.closest('.tkl-bolum'), bd = bb && bb.querySelector('.tkl-grup-dug');
            if (bd) { e.preventDefault(); bd.focus(); }
            return;
        }
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        if (panel.hidden) { ac(true); return; }
        var ler = [].slice.call(panel.querySelectorAll('.tkl-grup-dug, .tkl-bolum.acik .tkl-oge:not(.kilitli)'));
        var i = ler.indexOf(document.activeElement);
        var y = ler[Math.max(0, Math.min(ler.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))];
        if (y) y.focus();
    });
    kur();
})();
