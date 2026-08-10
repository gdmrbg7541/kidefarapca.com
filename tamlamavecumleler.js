/* ==========================================================================
   TAMLAMA VE CÜMLELER — tamlamavecumleler.js
   --------------------------------------------------------------------------
   Sayfanın iki gömülü <script> bloğu buraya AYNEN taşındı; sıraları korundu:
       1) Büyütme (zoom) motoru + İ'rab penceresi
       2) Test paneli (10 soruluk tur, 100 puan) + görev köprüsü raporu
   Dosya gövdenin sonunda, sistem/geri.js ve sistem/gorevkopru.js'ten ÖNCE
   yüklenir; böylece eski gömülü hâliyle aynı anda çalışır.
   ========================================================================== */

/* ==================== 1) BÜYÜTME MOTORU + İ'RAB ==================== */
/* ============================================================
   1) İ'RAB POPUP
   ============================================================ */
(function () {
  var perde = document.getElementById('tcPerde');
  var ac = document.getElementById('tcIrabAc');
  var kapat = document.getElementById('tcKapat');
  function goster(a) {
    perde.classList.toggle('acik', a);
    perde.setAttribute('aria-hidden', a ? 'false' : 'true');
  }
  ac.addEventListener('click', function () { goster(true); });
  kapat.addEventListener('click', function () { goster(false); });
  perde.addEventListener('click', function (e) { if (e.target === perde) goster(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && perde.classList.contains('acik')) goster(false);
  });
  window.tcIrabGoster = goster;
})();

/* ============================================================
   1c) PANEL BÖLÜMLERİ · TERİM BİLGİSİ · ÖRNEK HAVUZU FİLTRESİ
   ------------------------------------------------------------
   Üç iş bir arada:
     (1) üst sekmeler bölümler arasında geçiş yapar;
     (2) ⓘ tuşları terim balonunu açar;
     (3) filtre üç eksende havuzu süzer ve kartları basar.
   ============================================================ */
(function () {
  var ustSek = document.getElementById('tcUstSek');
  if (!ustSek) return;

  /* ---------- (1) bölüm sekmeleri ---------- */
  var bolumler = [].slice.call(document.querySelectorAll('.tc-bolum'));
  var govde = document.querySelector('.tc-pop-govde');
  function bolumAc(ad) {
    bolumler.forEach(function (b) { b.hidden = (b.getAttribute('data-bolum') !== ad); });
    [].forEach.call(ustSek.children, function (d) {
      var s = d.getAttribute('data-bolum') === ad;
      d.classList.toggle('aktif', s);
      d.setAttribute('aria-selected', s ? 'true' : 'false');
    });
    if (govde) govde.scrollTop = 0;
  }
  ustSek.addEventListener('click', function (e) {
    var d = e.target.closest ? e.target.closest('.tc-us') : null;
    if (d) bolumAc(d.getAttribute('data-bolum'));
  });
  window.tcBolumAc = bolumAc;

  /* ---------- alt sekme: İsim / Fiil tablosu ---------- */
  /* Alt sekme beş düğme: iki genel tablo + üç basamağın kelime tablosu.
     Basamak düğmeleri aynı paneli açıp içindeki kelimeyi değiştirir. */
  var tabloSek = document.getElementById('tcTabloSek');
  function panelAc(d) {
    var ad = d.getAttribute('data-panel');
    [].forEach.call(tabloSek.querySelectorAll('.tc-asd'), function (x) {
      x.classList.toggle('aktif', x === d);
      x.setAttribute('aria-selected', x === d ? 'true' : 'false');
    });
    document.querySelectorAll('.tc-tablo-panel').forEach(function (x) {
      x.hidden = (x.getAttribute('data-panel') !== ad);
    });
    var sv = d.getAttribute('data-sev');
    if (sv && window.tcSeviyeSec) window.tcSeviyeSec(sv, 0);
  }
  if (tabloSek) {
    tabloSek.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-terim]')) return;
      var d = e.target.closest ? e.target.closest('.tc-asd') : null;
      if (d) panelAc(d);
    });
  }
  window.tcPanelAc = function (ad) {
    var d = tabloSek && tabloSek.querySelector('.tc-asd[data-panel="' + ad + '"]');
    if (d) panelAc(d);
  };
  window.tcBasamakAc = function (sv) {
    bolumAc('tablolar');
    var d = tabloSek && tabloSek.querySelector('.tc-asd[data-sev="' + sv + '"]');
    if (d) panelAc(d);
  };

  /* ---------- (2) terim balonu ----------
     Öğrenci "mahallen" kelimesini ilk gördüğünde takılıyor. Her
     terimin yanındaki ⓘ üç şey verir: TANIM, NASIL ANLARIM, ÖRNEK. */
  var TERIM = {
    lafzen: { ad:'Lafzen', ar:'لَفْظًا', renk:'#12A05F',
      tanim:'Alâmet kelimenin sonunda <b>yazılır ve okunur</b>. Ötreyi görürsün, üstünü görürsün, esreyi görürsün.',
      nasil:'Kelimenin son harfine bak: <b>hareke ya da i\'rab harfi görünüyorsa</b> lafzîdir. Sonu sahih harf olan bütün mu\'reb isimler ve çoğu muzari fiil böyledir.',
      ornek:'جَاءَ الْمُعَلِّمُ &nbsp;·&nbsp; رَأَيْتُ الْمُعَلِّمَ',
      ornekTr:'Ötre de üstün de göz önünde: <b>lafzen merfu</b>, <b>lafzen mansub</b>.' },
    takdiren: { ad:'Takdiren', ar:'تَقْدِيرًا', renk:'#C77800',
      tanim:'Kelime mu\'rebdir, hâli de vardır; ama son harfi hareke <b>taşıyamadığı</b> için alâmet yazılamaz. Alâmet yok değildir — <b>takdir edilir</b>, yani var sayılır.',
      nasil:'Üç yerde olur: sonu <b>elif</b> olan isim (maksûr), sonu <b>ya</b> olan isim (menkûs) ve <b>mütekellim ya\'sına muzâf</b> olan isim. Fiilde de sonu elif ya da vav olan muzari böyledir.',
      ornek:'جَاءَ الْفَتَى &nbsp;·&nbsp; رَأَيْتُ الْفَتَى &nbsp;·&nbsp; هَذَا كِتَابِي',
      ornekTr:'Üç hâlde de yazılış aynı; hâli ancak <b>görevden</b> anlarız.' },
    mahallen: { ad:'Mahallen', ar:'مَحَلًّا', renk:'#6D4AA8',
      tanim:'Kelime <b>mebnîdir</b>: sonu hiç değişmez, alâmet diye bir şey yoktur. Ama görevi vardır; hâli, kelimenin <b>durduğu yerden</b> okunur.',
      nasil:'Kelime mebnî mi? Zamir, ism-i işâret, ism-i mevsûl, soru isimleri, mâzi ve emir fiil, bütün harfler mebnîdir. Mebnî bir kelimenin hâlini söylerken başına <b>“mahallen”</b> eklersin.',
      ornek:'هَذَا كِتَابٌ &nbsp;·&nbsp; إِيَّاكَ نَعْبُدُ',
      ornekTr:'<span dir="rtl" class="tc-ic">هَذَا</span> mübteda ama mebnî → <b>mahallen merfu</b>. <span dir="rtl" class="tc-ic">إِيَّاكَ</span> mef\'ul ama mebnî → <b>mahallen mansub</b>.' },
    mureb: { ad:'Mu\'reb', ar:'مُعْرَب', renk:'#2C7BE5',
      tanim:'Cümledeki görevine göre <b>sonu değişen</b> kelimeye mu\'reb denir. İ\'rab dediğimiz şey zaten bu değişmedir.',
      nasil:'Aynı kelimeyi üç cümlede dene: fâil yap, mef\'ul yap, harf-i cerden sonra koy. <b>Sonu değişiyorsa</b> mu\'rebdir. İsimlerin çoğu ve muzari fiil mu\'rebdir.',
      ornek:'الْمُعَلِّمُ &nbsp;·&nbsp; الْمُعَلِّمَ &nbsp;·&nbsp; الْمُعَلِّمِ',
      ornekTr:'Aynı kelime, üç ayrı son: mu\'reb olduğunun ispatı budur.' },
    mebni: { ad:'Mebnî', ar:'مَبْنِيّ', renk:'#5B6B7B',
      tanim:'Cümledeki görevi ne olursa olsun <b>sonu hiç değişmeyen</b> kelimeye mebnî denir. “Binası sabit” demektir.',
      nasil:'Şunlar her zaman mebnîdir: <b>zamirler</b>, <b>ism-i işâretler</b> (ikil hâriç), <b>ism-i mevsûller</b> (ikil hâriç), <b>soru isimleri</b>, <b>mâzi ve emir fiil</b>, <b>bütün harfler</b>. Muzari fiil de nûn-u nisveye bitişince mebnî olur.',
      ornek:'هَذَا &nbsp;·&nbsp; الَّذِي &nbsp;·&nbsp; مَنْ &nbsp;·&nbsp; كَتَبَ &nbsp;·&nbsp; يَكْتُبْنَ',
      ornekTr:'Mebnî kelimenin hâli yok değildir; yalnız <b>mahallen</b> okunur.' }
  };

  var bpPerde = document.getElementById('tcBpPerde');
  var bpBas   = document.getElementById('tcBpBas');
  var bpGovde = document.getElementById('tcBpGovde');
  function terimAc(kod) {
    var t = TERIM[kod]; if (!t) return;
    document.getElementById('tcBp').style.setProperty('--bp-renk', t.renk);
    bpBas.querySelector('span').innerHTML =
      t.ad + ' &nbsp;<span class="tc-bp-ar" dir="rtl">' + t.ar + '</span>';
    bpGovde.innerHTML =
      '<p><span class="tc-bp-etiket">Nedir?</span><br>' + t.tanim + '</p>' +
      '<p><span class="tc-bp-etiket">Nasıl anlarım?</span><br>' + t.nasil + '</p>' +
      '<span class="tc-bp-etiket">Örnek</span>' +
      '<div class="tc-bp-ornek">' + t.ornek + '</div>' +
      '<p>' + t.ornekTr + '</p>';
    bpPerde.classList.add('acik');
    bpPerde.setAttribute('aria-hidden', 'false');
  }
  function terimKapa() {
    bpPerde.classList.remove('acik');
    bpPerde.setAttribute('aria-hidden', 'true');
  }
  document.addEventListener('click', function (e) {
    var d = e.target.closest ? e.target.closest('[data-terim]') : null;
    if (d) { e.preventDefault(); e.stopPropagation(); terimAc(d.getAttribute('data-terim')); }
  }, true);
  document.getElementById('tcBpKapat').addEventListener('click', terimKapa);
  bpPerde.addEventListener('click', function (e) { if (e.target === bpPerde) terimKapa(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && bpPerde.classList.contains('acik')) { terimKapa(); e.stopPropagation(); }
  }, true);
  window.tcTerimAc = terimAc;

  /* ---------- (3) örnek havuzu ---------- */
  /* ------------------------------------------------------------
     ÖRNEK HAVUZU — filtreye göre süzülen etiketli örnekler.
     Her kayıt üç eksende etiketlidir:
       tur     : kelime | cumle
       hal     : merfu | mansub | mecrur | meczum
       basamak : lafzen | takdiren | mahallen
     Cümlelerde birden çok hâl ve basamak bulunabildiği için
     etiketler dizi tutulur; filtre "içeriyor mu?" diye bakar.
     ------------------------------------------------------------ */
  var HAVUZ = [
    /* ---------- İSİM · LAFZEN ---------- */
    { tur:'kelime', tip:'İsim', ar:'الْمُعَلِّمُ', tr:'öğretmen', hal:['merfu'], basamak:['lafzen'],
      gorev:'Fâil', alamet:'Zamme (ötre)',
      baglam:'جَاءَ الْمُعَلِّمُ', baglamTr:'Öğretmen geldi.',
      irab:'Fâil olduğu için <b>merfudur</b>; alâmeti sonunda görünen <b>zammedir</b> — yani <b>lafzen</b> merfu.' },
    { tur:'kelime', tip:'İsim', ar:'الْكِتَابَ', tr:'kitabı', hal:['mansub'], basamak:['lafzen'],
      gorev:'Mef\'ul', alamet:'Fetha (üstün)',
      baglam:'قَرَأْتُ الْكِتَابَ', baglamTr:'Kitabı okudum.',
      irab:'Mef\'ul olduğu için <b>mansubdur</b>; alâmeti görünen <b>fethadır</b> — <b>lafzen</b> mansub.' },
    { tur:'kelime', tip:'İsim', ar:'الْبَيْتِ', tr:'ev', hal:['mecrur'], basamak:['lafzen'],
      gorev:'Harf-i cerden sonra', alamet:'Kesra (esre)',
      baglam:'فِي الْبَيْتِ', baglamTr:'Evde.',
      irab:'Harf-i cerden sonra geldiği için <b>mecrurdur</b>; alâmeti görünen <b>kesradır</b> — <b>lafzen</b> mecrur.' },
    { tur:'kelime', tip:'İsim', ar:'الْمُعَلِّمُونَ', tr:'öğretmenler', hal:['merfu'], basamak:['lafzen'],
      gorev:'Fâil · cem-i müzekker sâlim', alamet:'Vav (harf)',
      baglam:'جَاءَ الْمُعَلِّمُونَ', baglamTr:'Öğretmenler geldi.',
      irab:'Fâil olduğu için <b>merfudur</b>; ama alâmeti hareke değil <b>vav</b>dır. Harf de görünür — yine <b>lafzen</b> merfu.' },
    { tur:'kelime', tip:'İsim', ar:'الْمُعَلِّمِينَ', tr:'öğretmenleri', hal:['mansub'], basamak:['lafzen'],
      gorev:'Mef\'ul · cem-i müzekker sâlim', alamet:'Ya (harf)',
      baglam:'رَأَيْتُ الْمُعَلِّمِينَ', baglamTr:'Öğretmenleri gördüm.',
      irab:'Mef\'ul olduğu için <b>mansubdur</b>; alâmeti <b>ya</b>dır — <b>lafzen</b> mansub.' },
    { tur:'kelime', tip:'İsim', ar:'الْمُعَلِّمَيْنِ', tr:'iki öğretmen', hal:['mecrur'], basamak:['lafzen'],
      gorev:'Harf-i cerden sonra · ikil', alamet:'Ya (harf)',
      baglam:'مَرَرْتُ بِالْمُعَلِّمَيْنِ', baglamTr:'İki öğretmenin yanından geçtim.',
      irab:'Harf-i cerden sonra geldiği için <b>mecrurdur</b>; ikilde alâmet <b>ya</b>dır — <b>lafzen</b> mecrur.' },
    { tur:'kelime', tip:'İsim', ar:'الْمُعَلِّمَاتِ', tr:'öğretmenleri (bayan)', hal:['mansub'], basamak:['lafzen'],
      gorev:'Mef\'ul · cem-i müennes sâlim', alamet:'Kesra (istisna!)',
      baglam:'رَأَيْتُ الْمُعَلِّمَاتِ', baglamTr:'Bayan öğretmenleri gördüm.',
      irab:'<b>İstisna:</b> cem-i müennes sâlim mansubda üstün değil <b>esre</b> alır. Hâli mansub, alâmeti kesra — yine <b>lafzen</b>.' },
    { tur:'kelime', tip:'İsim', ar:'مَدَارِسَ', tr:'okullar', hal:['mecrur'], basamak:['lafzen'],
      gorev:'Harf-i cerden sonra · gayr-i munsarif', alamet:'Fetha (istisna!)',
      baglam:'مَرَرْتُ بِمَدَارِسَ', baglamTr:'Okulların yanından geçtim.',
      irab:'<b>İstisna:</b> gayr-i munsarif tenvin almaz ve mecrurda esre yerine <b>üstün</b> alır. Alâmet yine görünür — <b>lafzen</b> mecrur.' },

    /* ---------- İSİM · TAKDİREN ---------- */
    { tur:'kelime', tip:'İsim · maksûr', ar:'الْفَتَى', tr:'genç', hal:['merfu'], basamak:['takdiren'],
      gorev:'Fâil', alamet:'Takdir edilen zamme',
      baglam:'جَاءَ الْفَتَى', baglamTr:'Genç geldi.',
      irab:'Fâil olduğu için <b>merfudur</b>; ama sonu <b>elif</b>, hareke taşıyamaz. Zamme <b>takdir edilir</b> — <b>takdiren</b> merfu.' },
    { tur:'kelime', tip:'İsim · maksûr', ar:'الْفَتَى', tr:'genci', hal:['mansub'], basamak:['takdiren'],
      gorev:'Mef\'ul', alamet:'Takdir edilen fetha',
      baglam:'رَأَيْتُ الْفَتَى', baglamTr:'Genci gördüm.',
      irab:'Mef\'ul olduğu için <b>mansubdur</b>; yazılışı hiç değişmedi. Fetha <b>takdir edilir</b> — <b>takdiren</b> mansub.' },
    { tur:'kelime', tip:'İsim · maksûr', ar:'الْفَتَى', tr:'gencin', hal:['mecrur'], basamak:['takdiren'],
      gorev:'Harf-i cerden sonra', alamet:'Takdir edilen kesra',
      baglam:'مَرَرْتُ بِالْفَتَى', baglamTr:'Gencin yanından geçtim.',
      irab:'Harf-i cerden sonra <b>mecrurdur</b>; elif kesrayı da taşıyamaz — <b>takdiren</b> mecrur. Üç hâlde de yazılış aynı!' },
    { tur:'kelime', tip:'İsim · menkûs', ar:'الْقَاضِي', tr:'hâkim', hal:['merfu'], basamak:['takdiren'],
      gorev:'Fâil', alamet:'Takdir edilen zamme',
      baglam:'جَاءَ الْقَاضِي', baglamTr:'Hâkim geldi.',
      irab:'Sonu <b>ya</b>; ya ötreyi taşıyamaz. Fâil olduğu için merfu, alâmeti <b>takdirîdir</b>.' },
    { tur:'kelime', tip:'İsim · menkûs', ar:'الْقَاضِيَ', tr:'hâkimi', hal:['mansub'], basamak:['lafzen'],
      gorev:'Mef\'ul', alamet:'Fetha (görünür!)',
      baglam:'رَأَيْتُ الْقَاضِيَ', baglamTr:'Hâkimi gördüm.',
      irab:'Menkûsun tek görünen hâli: ya <b>üstünü taşır</b>. Bu yüzden mansubu <b>lafzîdir</b>, merfu ve mecruru takdirî.' },
    { tur:'kelime', tip:'İsim · mütekellim ya\'sı', ar:'كِتَابِي', tr:'kitabım', hal:['merfu'], basamak:['takdiren'],
      gorev:'Haber', alamet:'Takdir edilen zamme',
      baglam:'هَذَا كِتَابِي', baglamTr:'Bu benim kitabım.',
      irab:'Mütekellim ya\'sına muzâf olduğu için sonu <b>esreye kilitlenmiştir</b>. Haber olduğu için merfu, alâmeti <b>takdirîdir</b>.' },

    /* ---------- MEBNÎ · MAHALLEN ---------- */
    { tur:'kelime', tip:'İsm-i işâret · mebnî', ar:'هَذَا', tr:'bu', hal:['merfu'], basamak:['mahallen'],
      gorev:'Mübteda', alamet:'Yok — mebnî',
      baglam:'هَذَا كِتَابٌ', baglamTr:'Bu bir kitaptır.',
      irab:'Mübteda olduğu için merfu olması gerekir; ama <b>mebnîdir</b>, sonu değişemez — <b>mahallen</b> merfu.' },
    { tur:'kelime', tip:'İsm-i mevsûl · mebnî', ar:'الَّذِي', tr:'…(ki) o', hal:['mansub'], basamak:['mahallen'],
      gorev:'Mef\'ul', alamet:'Yok — mebnî',
      baglam:'قَرَأْتُ الَّذِي كَتَبْتَ', baglamTr:'Yazdığını okudum.',
      irab:'Mef\'ul olduğu için mansub olması gerekir; <b>mebnî</b> olduğundan <b>mahallen</b> mansubdur.' },
    { tur:'kelime', tip:'İsm-i işâret · mebnî', ar:'هَؤُلَاءِ', tr:'bunlar', hal:['mecrur'], basamak:['mahallen'],
      gorev:'Harf-i cerden sonra', alamet:'Yok — mebnî',
      baglam:'مَرَرْتُ بِهَؤُلَاءِ', baglamTr:'Bunların yanından geçtim.',
      irab:'Harf-i cerden sonra mecrur olması gerekir; <b>mebnî</b> olduğundan <b>mahallen</b> mecrurdur.' },
    { tur:'kelime', tip:'Zamir · mebnî', ar:'إِيَّاكَ', tr:'sana/seni', hal:['mansub'], basamak:['mahallen'],
      gorev:'Mef\'ul (öne alınmış)', alamet:'Yok — mebnî',
      baglam:'إِيَّاكَ نَعْبُدُ', baglamTr:'Yalnız sana kulluk ederiz.',
      irab:'Ayrık mansub zamirdir; mef\'ul olduğu için <b>mahallen</b> mansubdur. Fiilden önce gelmesi tahsis (yalnızlık) bildirir.' },

    /* ---------- FİİL · LAFZEN ---------- */
    { tur:'kelime', tip:'Muzari fiil', ar:'يَكْتُبُ', tr:'yazıyor', hal:['merfu'], basamak:['lafzen'],
      gorev:'Başında edat yok', alamet:'Zamme (ötre)',
      baglam:'يَكْتُبُ الْمُعَلِّمُ', baglamTr:'Öğretmen yazıyor.',
      irab:'Muzari fiilin aslı <b>merfudur</b>; başında nasb ya da cezm edatı yok. Alâmeti görünen <b>zammedir</b>.' },
    { tur:'kelime', tip:'Muzari fiil', ar:'يَكْتُبَ', tr:'yazması', hal:['mansub'], basamak:['lafzen'],
      gorev:'لَنْ edatından sonra', alamet:'Fetha (üstün)',
      baglam:'لَنْ يَكْتُبَ', baglamTr:'Asla yazmayacak.',
      irab:'<span dir="rtl">لَنْ</span> nasb edatıdır; fiili <b>mansub</b> yapar. Alâmeti görünen <b>fethadır</b>.' },
    { tur:'kelime', tip:'Muzari fiil', ar:'يَكْتُبْ', tr:'yazmadı', hal:['meczum'], basamak:['lafzen'],
      gorev:'لَمْ edatından sonra', alamet:'Sükûn',
      baglam:'لَمْ يَكْتُبْ', baglamTr:'Yazmadı.',
      irab:'<span dir="rtl">لَمْ</span> cezm edatıdır; fiili <b>meczum</b> yapar. Alâmeti <b>sükûndur</b>. Cezm yalnız muzari fiilde olur.' },
    { tur:'kelime', tip:'Muzari fiil · efâl-i hamse', ar:'يَكْتُبُونَ', tr:'yazıyorlar', hal:['merfu'], basamak:['lafzen'],
      gorev:'Başında edat yok', alamet:'Nûnun durması',
      baglam:'الطُّلَّابُ يَكْتُبُونَ', baglamTr:'Öğrenciler yazıyorlar.',
      irab:'Efâl-i hamsede alâmet harekede değil <b>nûndadır</b>: merfuda <b>nûn durur</b>.' },
    { tur:'kelime', tip:'Muzari fiil · efâl-i hamse', ar:'يَكْتُبُوا', tr:'yazmaları', hal:['mansub','meczum'], basamak:['lafzen'],
      gorev:'لَنْ / لَمْ edatından sonra', alamet:'Nûnun düşmesi',
      baglam:'لَنْ يَكْتُبُوا · لَمْ يَكْتُبُوا', baglamTr:'Asla yazmayacaklar · Yazmadılar.',
      irab:'Efâl-i hamse mansub ve meczum olunca <b>nûnu düşer</b>. Alâmet yine görünür (nûnun yokluğu) — <b>lafzen</b>.' },

    /* ---------- FİİL · TAKDİREN ---------- */
    { tur:'kelime', tip:'Muzari fiil · sonu elif', ar:'يَسْعَى', tr:'çabalıyor', hal:['merfu'], basamak:['takdiren'],
      gorev:'Başında edat yok', alamet:'Takdir edilen zamme',
      baglam:'يَسْعَى الطَّالِبُ', baglamTr:'Öğrenci çabalıyor.',
      irab:'Merfudur; ama sonu <b>elif</b>, ötreyi taşıyamaz — <b>takdiren</b> merfu.' },
    { tur:'kelime', tip:'Muzari fiil · sonu vav', ar:'يَدْعُو', tr:'çağırıyor', hal:['merfu'], basamak:['takdiren'],
      gorev:'Başında edat yok', alamet:'Takdir edilen zamme',
      baglam:'يَدْعُو الْمُؤْمِنُ', baglamTr:'Mümin dua ediyor.',
      irab:'Sonu <b>vav</b>; vav ötreyi taşıyamaz — <b>takdiren</b> merfu. Ama <span dir="rtl">لَنْ يَدْعُوَ</span> derken fetha görünür: orası lafzî.' },
    { tur:'kelime', tip:'Muzari fiil · sonu elif', ar:'يَسْعَى', tr:'çabalaması', hal:['mansub'], basamak:['takdiren'],
      gorev:'لَنْ edatından sonra', alamet:'Takdir edilen fetha',
      baglam:'لَنْ يَسْعَى', baglamTr:'Asla çabalamayacak.',
      irab:'Mansubdur; elif fethayı da taşıyamaz — <b>takdiren</b> mansub. Yazılış merfu hâliyle aynı kalır.' },

    /* ---------- FİİL · MAHALLEN (nûn-u nisve) ---------- */
    { tur:'kelime', tip:'Muzari fiil · nûn-u nisve', ar:'يَكْتُبْنَ', tr:'yazıyorlar (bayanlar)', hal:['merfu'], basamak:['mahallen'],
      gorev:'Haber', alamet:'Yok — mebnî',
      baglam:'الْمُعَلِّمَاتُ يَكْتُبْنَ', baglamTr:'Bayan öğretmenler yazıyorlar.',
      irab:'Muzari fiil <b>nûn-u nisveye</b> bitişince <b>mebnî</b> olur; sonu artık değişmez. Haber olduğu için <b>mahallen</b> merfudur.' },
    { tur:'kelime', tip:'Muzari fiil · nûn-u nisve', ar:'يَكْتُبْنَ', tr:'yazmaları (bayanlar)', hal:['mansub'], basamak:['mahallen'],
      gorev:'لَنْ edatından sonra', alamet:'Yok — mebnî',
      baglam:'لَنْ يَكْتُبْنَ', baglamTr:'Asla yazmayacaklar.',
      irab:'Nasb edatı geldi ama fiil mebnî; şekli hiç değişmedi — <b>mahallen</b> mansub. Tabloda bu sütun üç satırda da aynıdır.' },
    { tur:'kelime', tip:'Muzari fiil · nûn-u nisve', ar:'يَكْتُبْنَ', tr:'yazmadılar (bayanlar)', hal:['meczum'], basamak:['mahallen'],
      gorev:'لَمْ edatından sonra', alamet:'Yok — mebnî',
      baglam:'لَمْ يَكْتُبْنَ', baglamTr:'Yazmadılar.',
      irab:'Cezm edatı geldi, fiil yine değişmedi — <b>mahallen</b> meczum. Mebnîlik cezmi de görünmez kılar.' },

    /* ================= CÜMLELER ================= */
    { tur:'cumle', ar:'جَاءَ الْمُعَلِّمُ إِلَى الْمَدْرَسَةِ.', tr:'Öğretmen okula geldi.',
      hal:['merfu','mecrur'], basamak:['lafzen'],
      cozum:[
        { k:'جَاءَ', g:'Fiil', h:'—', b:'mebnî', not:'Mâzi fiildir; mebnîdir, i\'rab almaz.' },
        { k:'الْمُعَلِّمُ', g:'Fâil', h:'merfu', b:'lafzen', not:'Alâmeti görünen zammedir.' },
        { k:'إِلَى', g:'Harf-i cer', h:'—', b:'mebnî', not:'Harftir; mebnîdir.' },
        { k:'الْمَدْرَسَةِ', g:'Mecrur isim', h:'mecrur', b:'lafzen', not:'Harf-i cerden sonra geldi; alâmeti kesradır.' }
      ] },
    { tur:'cumle', ar:'قَرَأَ الطَّالِبُ الْكِتَابَ.', tr:'Öğrenci kitabı okudu.',
      hal:['merfu','mansub'], basamak:['lafzen'],
      cozum:[
        { k:'قَرَأَ', g:'Fiil', h:'—', b:'mebnî', not:'Mâzi fiil; mebnîdir.' },
        { k:'الطَّالِبُ', g:'Fâil', h:'merfu', b:'lafzen', not:'Fâil daima merfudur; alâmeti zammedir.' },
        { k:'الْكِتَابَ', g:'Mef\'ul', h:'mansub', b:'lafzen', not:'Mef\'ul daima mansubdur; alâmeti fethadır.' }
      ] },
    { tur:'cumle', ar:'الْكِتَابُ مُفِيدٌ.', tr:'Kitap faydalıdır.',
      hal:['merfu'], basamak:['lafzen'],
      cozum:[
        { k:'الْكِتَابُ', g:'Mübteda', h:'merfu', b:'lafzen', not:'Marifedir; alâmeti zammedir.' },
        { k:'مُفِيدٌ', g:'Haber', h:'merfu', b:'lafzen', not:'Nekradır; alâmeti tenvinli zammedir.' }
      ] },
    { tur:'cumle', ar:'هَذَا كِتَابُ الْمُعَلِّمِ.', tr:'Bu, öğretmenin kitabıdır.',
      hal:['merfu','mecrur'], basamak:['lafzen','mahallen'],
      cozum:[
        { k:'هَذَا', g:'Mübteda', h:'merfu', b:'mahallen', not:'İsm-i işârettir, mebnîdir; mahallen merfudur.' },
        { k:'كِتَابُ', g:'Haber · muzâf', h:'merfu', b:'lafzen', not:'Muzâf olduğu için ال ve tenvin almadı; alâmeti zammedir.' },
        { k:'الْمُعَلِّمِ', g:'Muzâfun ileyh', h:'mecrur', b:'lafzen', not:'Muzâfun ileyh daima mecrurdur; alâmeti kesradır.' }
      ] },
    { tur:'cumle', ar:'لَمْ يَكْتُبِ الطَّالِبُ الدَّرْسَ.', tr:'Öğrenci dersi yazmadı.',
      hal:['meczum','merfu','mansub'], basamak:['lafzen'],
      cozum:[
        { k:'لَمْ', g:'Cezm edatı', h:'—', b:'mebnî', not:'Harftir; kendisi i\'rab almaz, fiili meczum yapar.' },
        { k:'يَكْتُبِ', g:'Muzari fiil', h:'meczum', b:'lafzen', not:'Alâmeti sükûndur; iki sâkin yan yana gelmesin diye esreyle okundu.' },
        { k:'الطَّالِبُ', g:'Fâil', h:'merfu', b:'lafzen', not:'Alâmeti zammedir.' },
        { k:'الدَّرْسَ', g:'Mef\'ul', h:'mansub', b:'lafzen', not:'Alâmeti fethadır.' }
      ] },
    { tur:'cumle', ar:'جَاءَ الْفَتَى وَالْقَاضِي.', tr:'Genç ile hâkim geldi.',
      hal:['merfu'], basamak:['takdiren'],
      cozum:[
        { k:'جَاءَ', g:'Fiil', h:'—', b:'mebnî', not:'Mâzi fiil; mebnîdir.' },
        { k:'الْفَتَى', g:'Fâil', h:'merfu', b:'takdiren', not:'Maksûrdur; zamme elif üzerine takdir edilir.' },
        { k:'الْقَاضِي', g:'Ma\'tûf (fâile bağlı)', h:'merfu', b:'takdiren', not:'Menkûstur; zamme ya üzerine takdir edilir.' }
      ] },
    { tur:'cumle', ar:'الْمُعَلِّمَاتُ يَكْتُبْنَ الدَّرْسَ.', tr:'Bayan öğretmenler dersi yazıyorlar.',
      hal:['merfu','mansub'], basamak:['lafzen','mahallen'],
      cozum:[
        { k:'الْمُعَلِّمَاتُ', g:'Mübteda', h:'merfu', b:'lafzen', not:'Cem-i müennes sâlim; alâmeti zammedir.' },
        { k:'يَكْتُبْنَ', g:'Haber (fiil cümlesi)', h:'merfu', b:'mahallen', not:'Nûn-u nisve yüzünden mebnîdir; haber olduğu için mahallen merfudur.' },
        { k:'الدَّرْسَ', g:'Mef\'ul', h:'mansub', b:'lafzen', not:'Alâmeti fethadır.' }
      ] },
    { tur:'cumle', ar:'لَنْ يَنْجَحَ الْكَسُولُ.', tr:'Tembel asla başarılı olamaz.',
      hal:['mansub','merfu'], basamak:['lafzen'],
      cozum:[
        { k:'لَنْ', g:'Nasb edatı', h:'—', b:'mebnî', not:'Harftir; fiili mansub yapar.' },
        { k:'يَنْجَحَ', g:'Muzari fiil', h:'mansub', b:'lafzen', not:'Alâmeti görünen fethadır.' },
        { k:'الْكَسُولُ', g:'Fâil', h:'merfu', b:'lafzen', not:'Alâmeti zammedir.' }
      ] }
  ];

  var HAL_AD = { merfu:'Merfu', mansub:'Mansub', mecrur:'Mecrur', meczum:'Meczum' };
  var BAS_AD = { lafzen:'Lafzen', takdiren:'Takdiren', mahallen:'Mahallen', 'mebnî':'Mebnî' };
  var secim = { tur:'hepsi', hal:'hepsi', basamak:'hepsi' };
  var filtreEl = document.getElementById('tcFiltre');
  var sonucEl  = document.getElementById('tcSonuc');
  var sayiEl   = document.getElementById('tcFlSayi');

  function uyar(k) {
    if (secim.tur !== 'hepsi' && k.tur !== secim.tur) return false;
    if (secim.hal !== 'hepsi' && k.hal.indexOf(secim.hal) < 0) return false;
    if (secim.basamak !== 'hepsi' && k.basamak.indexOf(secim.basamak) < 0) return false;
    return true;
  }

  function rozetBas(k) {
    var r = k.hal.map(function (h) {
      return '<span class="tc-rz tc-rz-hal">' + (HAL_AD[h] || h) + '</span>';
    }).join('');
    r += k.basamak.map(function (b) {
      return '<span class="tc-rz tc-rz-bas tc-b-' + b + '">' + (BAS_AD[b] || b) + '</span>';
    }).join('');
    return r;
  }

  function kartHtml(k) {
    var ana = k.hal[0] || 'merfu';
    if (k.tur === 'cumle') {
      return '<article class="tc-sk-kart tc-k-' + ana + '">' +
        '<div class="tc-sk-cumle" dir="rtl">' + k.ar + '</div>' +
        '<div class="tc-sk-tr">' + k.tr + '</div>' +
        '<div class="tc-sk-rozetler">' + rozetBas(k) + '</div>' +
        '<div class="tc-coz">' + k.cozum.map(function (c) {
          return '<div class="tc-coz-sat">' +
                   '<span class="tc-coz-k" dir="rtl">' + c.k + '</span>' +
                   '<span class="tc-coz-g">' + c.g +
                     (c.h === '—' ? '' : ' · ' + (HAL_AD[c.h] || c.h)) +
                     ' · ' + (BAS_AD[c.b] || c.b) + '</span>' +
                   '<span class="tc-coz-n">' + c.not + '</span>' +
                 '</div>';
        }).join('') + '</div>' +
      '</article>';
    }
    /* Rozet sayısı ikiye indi: hâl ve basamak. Görev ile alâmet
       zaten i'rab cümlesinde geçiyor, ayrıca rozet olmasına gerek yok. */
    return '<article class="tc-sk-kart tc-k-' + ana + '">' +
      '<div class="tc-sk-ar" dir="rtl">' + k.ar + '</div>' +
      '<div class="tc-sk-rozetler">' + rozetBas(k) + '</div>' +
      '<div class="tc-sk-tr">“' + k.tr + '” · ' + k.tip + ' · ' + k.gorev + '</div>' +
      '<div class="tc-sk-cumle" dir="rtl">' + k.baglam + '</div>' +
      '<div class="tc-sk-tr">' + k.baglamTr + '</div>' +
      '<p class="tc-sk-irab">' + k.irab + '</p>' +
    '</article>';
  }

  function suz() {
    var liste = HAVUZ.filter(uyar);
    sayiEl.innerHTML = '<b>' + liste.length + '</b> / ' + HAVUZ.length + ' örnek';
    sonucEl.innerHTML = liste.length
      ? liste.map(kartHtml).join('')
      : '<p class="tc-bos">Bu üçlü birleşimin örneği yok. Örneğin isim <b>meczum</b> olmaz, ' +
        'fiil de <b>mecrur</b> olmaz — bir filtreyi gevşetmeyi dene.</p>';
  }

  filtreEl.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-terim]')) return;   /* ⓘ filtreyi değiştirmesin */
    var d = e.target.closest ? e.target.closest('.tc-fl') : null;
    if (!d) return;
    var g = d.parentNode.getAttribute('data-grup');
    secim[g] = d.getAttribute('data-deger');
    [].forEach.call(d.parentNode.querySelectorAll('.tc-fl'), function (x) {
      x.classList.toggle('aktif', x === d);
    });
    suz();
  });
  suz();
  window.tcSuz = function (a) { if (a) { for (var k in a) secim[k] = a[k]; } suz(); return sonucEl.children.length; };
  /* İ'rab testi aynı havuzdan beslensin diye dışarı açılıyor; havuz
     tek yerde kalsın, test ile örnekler asla ayrı düşmesin. */
  window.TC_HAVUZ = HAVUZ;
})();

/* ============================================================
   1b) ÜÇ BASAMAK SEKMELERİ — KELİME ÜZERİNDE İ'RAB
   ------------------------------------------------------------
   Üstteki tablo alâmetlerin listesi; burası aynı tablonun somut
   bir kelimeyle doldurulmuş hâli. Üç sekme = i'rabın üç görünme
   biçimi. Her sekmede o biçimi temsil eden kelimeler var:

     LAFZEN   قَلَم (sahih sonlu) · مُعَلِّم (sâlim çoğullu) · بِنَاء (memdûd)
     TAKDİREN الْفَتَى (maksûr) · الْقَاضِي (menkûs) · كِتَابِي (mütekellim ya'sı)
     MAHALLEN هَذَا (işâret) · الَّذِي (mevsûl) · هُوَ (zamir)

   Hücre rengi alâmetin CİNSİNİ söyler:
     pembe = hareke · mavi = harf · kehribar (kesik çizgi) = takdir
     mor (noktalı çizgi) = mahal (alâmet yok)

   Hücre biçimi: ['marife', 'nekra'(ops.), 'tip'(ops.)]
   Tip verilmezse sütunun tipi kullanılır — menkûsun mansubu gibi
   sütundan sapan tek tük hücre için üçüncü eleman yazılır.
   ============================================================ */
(function () {
  var seritEl  = document.getElementById('tcKelSerit');
  if (!seritEl) return;
  var kartEl   = document.getElementById('tcKelKart');
  var tabloEl  = document.getElementById('tcKelTablo');
  var okumaEl  = document.getElementById('tcSevOkuma');
  var sevBolum = seritEl.parentNode;

  var HAREKE = { ad:'Hareke', tip:'hareke' };
  var HARF   = { ad:'Harf',   tip:'harf' };
  var TAKDIR = { ad:'Takdirî', tip:'takdir' };
  var MAHAL  = { ad:'Alâmet yok', tip:'mahal' };

  var SEVIYELER = [
    /* ---------------------------------------------------- 1 */
    {
      kod:'lafzen', no:'1', ad:'Lafzen', ozet:'Alâmet yazılır ve okunur', renk:'#12A05F',
      tanim:'Alâmet kelimenin sonunda <b>görünür</b>: yazılır, okunur, duyulur. ' +
            'Sonu <b>sahih harf</b> olan — yani hareke taşımasına engel bulunmayan — ' +
            'her mu\'reb isim böyledir. Yukarıdaki tablo doğrudan bu basamağı anlatır.',
      kelimeler:[
        {
          ar:'قَلَم', tr:'kalem', etiket:'Sonu sahih harf',
          ack:'Sonu <b dir="rtl">م</b>, yani sahih bir harf. Hareke taşımasına hiçbir engel yok; ' +
              'bu yüzden üç hâlin alâmeti de açıkça görünür. Küçük yazı, marifesiz (nekra) biçimdir.',
          sutun:[ {ad:'Tekil', alt:HAREKE}, {ad:'İkil', alt:HARF}, {ad:'Düzensiz Çoğul', alt:HAREKE} ],
          satir:[
            [ ['الْقَلَمُ','قَلَمٌ'],  ['الْقَلَمَانِ','قَلَمَانِ'],  ['الْأَقْلَـامُ','أَقْلَامٌ'] ],
            [ ['الْقَلَمَ','قَلَمًا'], ['الْقَلَمَيْنِ','قَلَمَيْنِ'], ['الْأَقْلَامَ','أَقْلَامًا'] ],
            [ ['الْقَلَمِ','قَلَمٍ'],  ['الْقَلَمَيْنِ','قَلَمَيْنِ'], ['الْأَقْلَامِ','أَقْلَامٍ'] ]
          ],
          uyari:'Tekilde ve düzensiz çoğulda alâmet <b>harekedir</b>; ikile geçince ' +
                'alâmet <b>harfe</b> döner: ötrenin yerini elif, esrenin yerini ya alır.',
          okumaAr:'رَأَيْتُ الْقَلَمَ', okumaTr:'<i>الْقَلَمَ</i> mef\'uldür, bu yüzden mansubdur; ' +
                'alâmeti sonunda <i>görünen fethadır</i> — yani <i>lafzen</i> mansubdur.'
        },
        {
          ar:'مُعَلِّم', tr:'öğretmen', etiket:'Düzenli çoğulu var',
          ack:'Akıllı varlık olduğu için <b>düzenli (sâlim) çoğulu</b> vardır. ' +
              'Müzekker sâlim çoğulda alâmet <b>harfe</b> döner (vav – ya); ' +
              'müennes sâlim çoğulda hareke kalır ama <b>mansubu esreye</b> kaçar.',
          sutun:[ {ad:'Tekil', alt:HAREKE}, {ad:'İkil', alt:HARF},
                  {ad:'Cem-i Müzekker Sâlim', alt:HARF}, {ad:'Cem-i Müennes Sâlim', alt:HAREKE} ],
          satir:[
            [ ['الْمُعَلِّمُ','مُعَلِّمٌ'],  ['الْمُعَلِّمَانِ'],  ['الْمُعَلِّمُونَ'], ['الْمُعَلِّمَاتُ','مُعَلِّمَاتٌ'] ],
            [ ['الْمُعَلِّمَ','مُعَلِّمًا'], ['الْمُعَلِّمَيْنِ'], ['الْمُعَلِّمِينَ'], ['الْمُعَلِّمَاتِ','مُعَلِّمَاتٍ'] ],
            [ ['الْمُعَلِّمِ','مُعَلِّمٍ'],  ['الْمُعَلِّمَيْنِ'], ['الْمُعَلِّمِينَ'], ['الْمُعَلِّمَاتِ','مُعَلِّمَاتٍ'] ]
          ],
          uyari:'Son sütuna dikkat: cem-i müennes sâlim mansub hâlinde <b>üstün değil esre</b> alır. ' +
                'Bu yüzden mansub ile mecrur satırı birbirinin aynıdır — hâli ancak görevden ayırt ederiz.',
          okumaAr:'جَاءَ الْمُعَلِّمُونَ', okumaTr:'<i>الْمُعَلِّمُونَ</i> fâildir, bu yüzden merfudur; ' +
                'alâmeti ötre değil <i>vav</i>dır — yine <i>lafzen</i>, çünkü vav yazılıp okunuyor.'
        },
        {
          ar:'بِنَاء', tr:'yapı, bina', etiket:'Memdûd — sonu hemze',
          ack:'Elifin ardından <b>hemze</b> gelirse bu isme <b>memdûd</b> denir. ' +
              'Hemze sahih bir harftir, hareke taşır; bu yüzden memdûdun i\'rabı <b>lafzîdir</b>. ' +
              'Maksûr ile menkûstan ayrıldığı yer tam burasıdır — onlar takdirî, memdûd lafzî.',
          sutun:[ {ad:'Tekil', alt:HAREKE}, {ad:'Düzensiz Çoğul', alt:HAREKE} ],
          satir:[
            [ ['الْبِنَاءُ','بِنَاءٌ'],  ['الْأَبْنِيَةُ','أَبْنِيَةٌ'] ],
            [ ['الْبِنَاءَ','بِنَاءً'],  ['الْأَبْنِيَةَ','أَبْنِيَةً'] ],
            [ ['الْبِنَاءِ','بِنَاءٍ'],  ['الْأَبْنِيَةِ','أَبْنِيَةٍ'] ]
          ],
          uyari:'İstisna: <span dir="rtl">صَحْرَاء</span> gibi sonundaki hemze <b>müenneslik</b> ' +
                'içinse o memdûd <b>gayr-i munsariftir</b> — tenvin almaz, mecrurda esre değil ' +
                '<b>üstün</b> alır: <span dir="rtl">فِي صَحْرَاءَ</span>. Alâmet yine görünür, yani lafzîdir.',
          okumaAr:'مَرَرْتُ بِالْبِنَاءِ', okumaTr:'<i>الْبِنَاءِ</i> harf-i cerden sonra geldiği için mecrurdur; ' +
                'alâmeti hemzenin üzerinde <i>görünen kesradır</i> — <i>lafzen</i> mecrur.'
        }
      ]
    },
    /* ---------------------------------------------------- 2 */
    {
      kod:'takdiren', no:'2', ad:'Takdiren', ozet:'Alâmet vardır ama yazılamaz', renk:'#C77800',
      tanim:'Kelime mu\'rebdir, hâli de vardır; ama sonundaki harf hareke <b>taşıyamadığı</b> için ' +
            'alâmet yazılamaz. Alâmet yok değildir — <b>takdir edilir</b>, yani var sayılır. ' +
            'Üç kelime türü böyledir: <b>maksûr</b>, <b>menkûs</b> ve <b>mütekellim ya\'sına muzâf</b> olan isim.',
      kelimeler:[
        {
          ar:'الْفَتَى', tr:'genç, delikanlı', etiket:'Maksûr — sonu elif',
          ack:'Sonu <b>elif</b> olan isme <b>maksûr</b> denir. Elif hiçbir hareke taşımaz; ' +
              'bu yüzden üç hâlin alâmeti de takdirîdir. Tekilde üç satır <b>aynı yazılır</b> — ' +
              'hâli ancak kelimenin cümledeki görevinden anlarız.',
          sutun:[ {ad:'Tekil', alt:TAKDIR}, {ad:'İkil', alt:HARF}, {ad:'Düzensiz Çoğul', alt:HAREKE} ],
          satir:[
            [ ['الْفَتَى','فَتًى'], ['الْفَتَيَانِ'],  ['الْفِتْيَانُ','فِتْيَانٌ'] ],
            [ ['الْفَتَى','فَتًى'], ['الْفَتَيَيْنِ'], ['الْفِتْيَانَ','فِتْيَانًا'] ],
            [ ['الْفَتَى','فَتًى'], ['الْفَتَيَيْنِ'], ['الْفِتْيَانِ','فِتْيَانٍ'] ]
          ],
          uyari:'İkile ve çoğula geçince i\'rab yeniden <b>görünür</b> hâle gelir. ' +
                'Demek ki takdir kelimenin kaderi değil, yalnız <b>o biçimin</b> hâlidir.',
          okumaAr:'جَاءَ الْفَتَى', okumaTr:'<i>الْفَتَى</i> fâildir, bu yüzden merfudur; ' +
                'alâmeti elifin üzerinde <i>takdir edilen zammedir</i> — <i>takdiren</i> merfu.'
        },
        {
          ar:'الْقَاضِي', tr:'hâkim, yargıç', etiket:'Menkûs — sonu ya',
          ack:'Sonu <b>ya</b> olan isme <b>menkûs</b> denir. Ya, ötre ile esreyi taşıyamaz ' +
              'ama <b>üstünü taşır</b>. Bu yüzden menkûs yarı takdirî yarı lafzîdir: ' +
              'merfu ile mecrur takdirî, <b>mansub lafzîdir</b>. Satırlara bakınca fark hemen görülür.',
          sutun:[ {ad:'Tekil', alt:TAKDIR}, {ad:'İkil', alt:HARF}, {ad:'Cem-i Müzekker Sâlim', alt:HARF} ],
          satir:[
            [ ['الْقَاضِي','قَاضٍ'],              ['الْقَاضِيَانِ'],  ['الْقَاضُونَ'] ],
            [ ['الْقَاضِيَ','قَاضِيًا','hareke'], ['الْقَاضِيَيْنِ'], ['الْقَاضِينَ'] ],
            [ ['الْقَاضِي','قَاضٍ'],              ['الْقَاضِيَيْنِ'], ['الْقَاضِينَ'] ]
          ],
          uyari:'Ortadaki satır <b>pembedir</b>: menkûsun mansubu takdirî değil, <b>lafzîdir</b> — ' +
                'fetha ya\'nın üzerinde açıkça görünür. Ayrıca nekra hâlde menkûsun ya\'sı düşer, ' +
                'yerini tenvin alır (<span dir="rtl">قَاضٍ</span>); yalnız mansubda geri gelir ' +
                '(<span dir="rtl">قَاضِيًا</span>).',
          okumaAr:'رَأَيْتُ الْقَاضِيَ', okumaTr:'<i>الْقَاضِيَ</i> mef\'uldür, bu yüzden mansubdur; ' +
                'alâmeti <i>görünen fethadır</i> — burada <i>lafzen</i> mansub. Ama ' +
                '<span dir="rtl">جَاءَ الْقَاضِي</span> derken zamme yazılamaz, orada <i>takdiren</i> merfudur.'
        },
        {
          ar:'كِتَابِي', tr:'kitabım', etiket:'Mütekellim ya\'sına muzâf',
          ack:'Bir isim “benim” anlamındaki <b>ya</b>\'ya muzâf olunca sonu daima <b>esreli</b> okunur. ' +
              'Kelimenin hâli değişse de bu esre değişmez; çünkü esre i\'rab alâmeti değil, ' +
              'ya\'nın <b>istediği harekedir</b>. Üç hâlin alâmeti de takdirîdir.',
          sutun:[ {ad:'Tekil', alt:TAKDIR}, {ad:'Düzensiz Çoğul', alt:TAKDIR} ],
          satir:[
            [ ['كِتَابِي'], ['كُتُبِي'] ],
            [ ['كِتَابِي'], ['كُتُبِي'] ],
            [ ['كِتَابِي'], ['كُتُبِي'] ]
          ],
          uyari:'Altı hücrenin altısı da aynı — çünkü sonu ya\'ya kilitlenmiştir. ' +
                'İkil ve cem-i müzekker sâlimde ise i\'rab yine harfle görünür: ' +
                '<span dir="rtl">كِتَابَايَ</span> (merfu) · <span dir="rtl">كِتَابَيَّ</span> (mansub – mecrur).',
          okumaAr:'هَذَا كِتَابِي', okumaTr:'<i>كِتَابِي</i> haberdir, bu yüzden merfudur; ' +
                'alâmeti mütekellim ya\'sı yüzünden yazılamayan, <i>takdir edilen zammedir</i>.'
        }
      ]
    },
    /* ---------------------------------------------------- 3 */
    {
      kod:'mahallen', no:'3', ad:'Mahallen', ozet:'Alâmet hiç yoktur, hâl yerden okunur', renk:'#6D4AA8',
      tanim:'Kelime <b>mebnîdir</b>: sonu hiçbir zaman değişmez, alâmet diye bir şey yoktur. ' +
            'Ama <b>görevi vardır</b>. Görevin gerektirdiği hâli kelimenin <b>durduğu yere</b> veririz: ' +
            'mahallen merfu, mahallen mansub, mahallen mecrur. Aşağıdaki tablolarda satırlar arasında ' +
            'değişen şey alâmet değil, kelimenin <b>bulunduğu görevdir</b>.',
      kelimeler:[
        {
          ar:'هَذَا', tr:'bu', etiket:'İsm-i işâret — mebnî',
          ack:'<b dir="rtl">هَذَا</b> sükûn üzere mebnîdir; cümlenin neresine girerse girsin şekli değişmez. ' +
              'Çoğulu <span dir="rtl">هَؤُلَاءِ</span> de mebnîdir. <b>Tek istisna ikildir</b>: ' +
              '<span dir="rtl">هَذَانِ / هَذَيْنِ</span> diye mu\'reb gibi çekilir.',
          sutun:[ {ad:'Tekil', alt:MAHAL}, {ad:'İkil', alt:HARF}, {ad:'Çoğul', alt:MAHAL} ],
          satir:[
            [ ['هَذَا'], ['هَذَانِ'],  ['هَؤُلَاءِ'] ],
            [ ['هَذَا'], ['هَذَيْنِ'], ['هَؤُلَاءِ'] ],
            [ ['هَذَا'], ['هَذَيْنِ'], ['هَؤُلَاءِ'] ]
          ],
          uyari:'Tekil ve çoğul sütunlarında üç satır da <b>aynı</b>. Yalnız ikil değişiyor — ' +
                'çünkü ikilin elifi ile ya\'sı i\'rab harfidir, mebnîlik oraya işlemez.',
          okumaAr:'هَذَا كِتَابٌ', okumaTr:'<i>هَذَا</i> mübtedadır, bu yüzden merfu olması gerekir; ' +
                'ama mebnî olduğu için sonu değişemez — <i>mahallen</i> merfudur.'
        },
        {
          ar:'الَّذِي', tr:'ki o, o kimse', etiket:'İsm-i mevsûl — mebnî',
          ack:'Bütün mevsûller mebnîdir; <span dir="rtl">الَّذِي</span> ve ' +
              '<span dir="rtl">الَّذِينَ</span> hiç değişmez. ' +
              'Yine <b>tek istisna ikildir</b>: <span dir="rtl">اللَّذَانِ / اللَّذَيْنِ</span>.',
          sutun:[ {ad:'Tekil', alt:MAHAL}, {ad:'İkil', alt:HARF}, {ad:'Çoğul', alt:MAHAL} ],
          satir:[
            [ ['الَّذِي'], ['اللَّذَانِ'],  ['الَّذِينَ'] ],
            [ ['الَّذِي'], ['اللَّذَيْنِ'], ['الَّذِينَ'] ],
            [ ['الَّذِي'], ['اللَّذَيْنِ'], ['الَّذِينَ'] ]
          ],
          uyari:'<span dir="rtl">الَّذِينَ</span>\'in sonundaki ya–nûn i\'rab harfi <b>değildir</b>; ' +
                'kelimenin aslındandır. Bu yüzden mebnî kalır ve çoğul sütunu üç satırda da aynıdır.',
          okumaAr:'قَرَأْتُ الَّذِي كَتَبْتَ', okumaTr:'<i>الَّذِي</i> mef\'uldür, bu yüzden mansub olması gerekir; ' +
                'mebnî olduğu için <i>mahallen</i> mansubdur.'
        },
        {
          ar:'هُوَ', tr:'o', etiket:'Zamir — mebnî',
          ack:'Zamirlerin <b>hepsi</b> mebnîdir. Burada satırlar arasında değişen şey alâmet değil, ' +
              '<b>zamirin türüdür</b>: ayrık merfu zamir yalnız merfu mahalde, ayrık mansub zamir ' +
              '(<span dir="rtl">إِيَّا</span>) yalnız mansub mahalde bulunur; bitişik zamir ise ' +
              'mansub ve mecrur mahalde durur.',
          sutun:[ {ad:'Tekil', alt:MAHAL}, {ad:'İkil', alt:MAHAL}, {ad:'Çoğul', alt:MAHAL} ],
          satir:[
            [ ['هُوَ'],     ['هُمَا'],      ['هُمْ'] ],
            [ ['إِيَّاهُ'],   ['إِيَّاهُمَا'],  ['إِيَّاهُمْ'] ],
            [ ['بِهِ'],      ['بِهِمَا'],     ['بِهِمْ'] ]
          ],
          uyari:'Mebnî kelimenin sonu değişemediği için tablo <b>çekim tablosu değil, görev tablosudur</b>. ' +
                'Merfu satırında <span dir="rtl">هُوَ</span> mübteda ya da fâil olur; ' +
                'mecrur satırında zamir tek başına duramaz, ancak harf-i cere bitişir.',
          okumaAr:'إِيَّاكَ نَعْبُدُ', okumaTr:'<i>إِيَّاكَ</i> mef\'uldür, bu yüzden mansub olması gerekir; ' +
                'mebnî olduğu için <i>mahallen</i> mansubdur — üstelik fiilden <i>önce</i> gelmiştir.'
        }
      ]
    }
  ];

  var HAL_AD = ['Merfu','Mansub','Mecrur'];
  var HAL_SN = ['tc-h-merfu','tc-h-mansub','tc-h-mecrur'];
  var TIP_SN = { hareke:'tc-ib-hareke', harf:'tc-ib-harf', takdir:'tc-ib-takdir', mahal:'tc-ib-mahal' };

  var sevSira = 0, kelSira = 0;

  function sec(si, ki) {
    if (typeof si === 'string') {                 /* 'lafzen' gibi kod da kabul */
      var n = 0;
      SEVIYELER.forEach(function (x, i) { if (x.kod === si) n = i; });
      si = n;
    }
    ki = ki || 0;
    sevSira = si; kelSira = ki;
    var s = SEVIYELER[si], k = s.kelimeler[ki];
    sevBolum.style.setProperty('--sk-renk', s.renk);

    /* kelime şeridi */
    seritEl.innerHTML = '';
    s.kelimeler.forEach(function (kl, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tc-kl' + (i === ki ? ' aktif' : '');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', i === ki ? 'true' : 'false');
      b.innerHTML = '<span class="tc-kl-ar">' + kl.ar + '</span>' +
                    '<span class="tc-kl-tr">' + kl.etiket + '</span>';
      b.addEventListener('click', function () { sec(si, i); });
      seritEl.appendChild(b);
    });

    /* kelime kartı */
    kartEl.innerHTML =
      '<span class="tc-kel-buyuk" dir="rtl">' + k.ar + '</span>' +
      '<span class="tc-kel-sag">' +
        '<span class="tc-kel-etiket">' + k.etiket + '</span>' +
        '<span class="tc-kel-tr"> &nbsp;“' + k.tr + '”</span>' +
        '<p class="tc-kel-ack">' + k.ack + '</p>' +
      '</span>';

    /* tablo: üstteki tablonun aynısı, bu kelimeyle doldurulmuş */
    var bas = '<tr><th style="width:104px"></th>' + k.sutun.map(function (c) {
      return '<th><span class="tc-ib-ad">' + c.ad + '</span>' +
             '<span class="tc-ib-alt ' + TIP_SN[c.alt.tip] + '">' + c.alt.ad + '</span></th>';
    }).join('') + '</tr>';

    var govde = k.satir.map(function (sat, i) {
      return '<tr class="' + HAL_SN[i] + '"><td class="tc-hal">' + HAL_AD[i] + '</td>' +
        sat.map(function (h, j) {
          var sn = TIP_SN[h[2] || k.sutun[j].alt.tip];
          var ic = '<span class="' + sn + '">' + h[0] + '</span>';
          if (h[1]) ic += '<span class="tc-kel-nekra ' + sn + '">' + h[1] + '</span>';
          return '<td>' + ic + '</td>';
        }).join('') + '</tr>';
    }).join('');

    tabloEl.querySelector('thead').innerHTML = bas;
    tabloEl.querySelector('tbody').innerHTML = govde;

    /* Okuma ile uyarı tek kutuda: iki ayrı kutu göz yoruyordu. */
    okumaEl.innerHTML = '<span class="tc-okuma-ar">' + k.okumaAr + '</span>' + k.okumaTr +
      '<span class="tc-okuma-dikkat"><b>Dikkat —</b> ' + k.uyari + '</span>';
  }

  /* özetteki basamak şeridi Tablolar bölümüne kısayol */
  document.querySelectorAll('.tc-bsm[data-sev]').forEach(function (d) {
    d.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-terim]')) return;
      if (window.tcBasamakAc) window.tcBasamakAc(d.getAttribute('data-sev'));
    });
  });

  sec(0, 0);
  window.tcSeviyeSec = sec;
})();

/* ============================================================
   2) YAKINLAŞMA (ZOOM) MOTORU
   ------------------------------------------------------------
   Tablonun 4 satırı x 5 alanı düz bir listeye çevrilir; İleri
   tuşu bu listede ilerler. Her adımda SAHNE o hücreye yaklaşır:
   tablo transform ile ölçeklenip kaydırılır, hücre ekranı doldurur.
   Ayrı bir kart YOKTUR — öğrenci hücrenin tablodaki yerini hiç
   kaybetmez. İleri'ye basınca yakınlık aynı satırda yana kayar.

   Ölçüler her adımda transform KALDIRILARAK alınır; yoksa ikinci
   yakınlaşma birincinin üstüne biner ve ölçek katlanır.

   ÖRNEK alanında ayrıca ÇEŞİT gezintisi vardır: yukarı/aşağı
   oklarla tekil → ikil → çoğul örnekleri dolaşılır. Bu gezinti
   artık kartta değil, HÜCRENİN İÇİNDE yaşar; hücre seçiliyken
   okları ve notu görünür olur.

   DAR EKRAN: tablo dikey yığına döndüğü için ölçekleme anlamsız;
   orada yakınlaşma yerine hücre görünüre kaydırılır.
   ============================================================ */
(function () {
  var sahne  = document.querySelector('.tc-sar');
  var tablo  = document.querySelector('.tc-tablo');
  var kum    = document.getElementById('tcKum');
  var sayacEl= document.getElementById('tcOdakSayac');
  var basUst = document.getElementById('tcBasUst');
  var basSol = document.getElementById('tcBasSol');
  var basSolYazi = document.getElementById('tcBasSolYazi');
  var uzak   = document.getElementById('tcUzak');
  var ileri  = document.getElementById('tcSonraki');
  var geri   = document.getElementById('tcOnceki');

  var satirlar = [].slice.call(document.querySelectorAll('.tc-satir'));
  if (!satirlar.length || !sahne || !tablo) return;

  /* Düz gezinti listesi: her satırın 5 içerik hücresi, sırayla. */
  var adimlar = [];
  satirlar.forEach(function (sr, si) {
    [].slice.call(sr.querySelectorAll('td[data-bas]')).forEach(function (td, ci2) {
      adimlar.push({ satir: si, sutun: ci2, td: td, tr: sr, asil: td.innerHTML });
    });
  });

  var CESIT = [
    [ /* 1 · İsim Tamlaması */
      { ad:'Tekil', k:[['<span class="tc-el-yok">ال</span>&zwnj;قَلَمُ','Muzaf'],['الْمُعَلِّمِ','Muzafun ileyh']],
        tr:'Öğretmen<span class="tc-ek">in</span> kalem<span class="tc-ek">i</span>',
        not:'Muzâf <b>ötre</b> ile merfu, muzâfun ileyh <b>esre</b> ile mecrur.' },
      { ad:'İkil', k:[['<span class="tc-el-yok">ال</span>&zwnj;قَلَمَ<span class="tc-son">ا</span>','Muzaf'],['الْمُعَلِّمِ','Muzafun ileyh']],
        tr:'Öğretmen<span class="tc-ek">in</span> iki kalem<span class="tc-ek">i</span>',
        not:'Muzâf ikil: <b>elif</b> ile merfu. Dikkat — izâfet yüzünden ikilin <b>nûnu düştü</b> (قَلَمَانِ → قَلَمَا).' },
      { ad:'Çoğul', k:[['<span class="tc-el-yok">ال</span>&zwnj;أَقْلَـامُ','Muzaf'],['الْمُعَلِّمِ<span class="tc-son">ينَ</span>','Muzafun ileyh']],
        tr:'Öğretmen<span class="tc-ek">lerin</span> kalem<span class="tc-ek">leri</span>',
        not:'Muzâfun ileyh cem-i müzekker sâlim: esre değil <b>ya</b> ile mecrur.' }
    ],
    [ /* 2 · Sıfat Tamlaması */
      { ad:'Tekil', k:[['<span class="tc-el">اَلْ</span>قَلَمُ','Mevsuf'],['<span class="tc-el">الْ</span>جَمِيلُ','Sıfat']],
        tr:'Güzel kalem',
        not:'Sıfat mevsûfa uyar: ikisi de marife, ikisi de <b>ötre</b> ile merfu.' },
      { ad:'İkil', k:[['<span class="tc-el">اَلْ</span>قَلَمَ<span class="tc-son">انِ</span>','Mevsuf'],['<span class="tc-el">الْ</span>جَمِيلَـ<span class="tc-son">انِ</span>','Sıfat']],
        tr:'İki güzel kalem',
        not:'İkilde ikisi de <b>elif</b> alır; uyum sayıda da sürer.' },
      { ad:'Çoğul', k:[['<span class="tc-el">اَلْ</span>أَقْلَـامُ','Mevsuf'],['<span class="tc-el">الْ</span>جَمِيلَةُ','Sıfat']],
        tr:'Güzel kalemler',
        not:'<b>İstisna:</b> kalem akılsız (gayr-i âkil). Akılsızların çoğulu <b>müfred müennes</b> sayılır, sıfatı da öyle gelir.' }
    ],
    [ /* 3 · İsim Cümlesi */
      { ad:'Tekil', k:[['<span class="tc-el">اَلْ</span>كِتَابُ','Mübteda'],['<span class="tc-el-yok">ال</span>&zwnj;مُفِيدٌ.','Haber']],
        tr:'Kitap faydalıdır.',
        not:'Mübteda marife, haber nekra; ikisi de <b>ötre</b> ile merfu.' },
      { ad:'İkil', k:[['<span class="tc-el">اَلْ</span>كِتَابَ<span class="tc-son">انِ</span>','Mübteda'],['<span class="tc-el-yok">ال</span>&zwnj;مُفِيدَ<span class="tc-son">انِ</span>.','Haber']],
        tr:'İki kitap faydalıdır.',
        not:'İkilde ikisi de <b>elif</b> ile merfu olur.' },
      { ad:'Çoğul', k:[['<span class="tc-el">اَلْ</span>كُتُبُ','Mübteda'],['<span class="tc-el-yok">ال</span>&zwnj;مُفِيدَةٌ.','Haber']],
        tr:'Kitaplar faydalıdır.',
        not:'<b>İstisna:</b> kitap akılsız; çoğulunun haberi <b>müfred müennes</b> gelir.' }
    ],
    [ /* 4 · Fiil Cümlesi */
      { ad:'Tekil', k:[['<span class="tc-el">كَتَبَ</span>','Fiil'],['الْمُعَلِّمُ','Fail'],['الدَّرْسَ.','Mef\'ul']],
        tr:'Öğretmen dersi yazdı.',
        not:'Fâil <b>ötre</b> ile merfu, mef\'ul <b>üstün</b> ile mansub.' },
      { ad:'İkil', k:[['<span class="tc-el">كَتَبَ</span>','Fiil'],['الْمُعَلِّمَ<span class="tc-son">انِ</span>','Fail'],['الدَّرْسَ.','Mef\'ul']],
        tr:'İki öğretmen dersi yazdı.',
        not:'Fâil ikil (<b>elif</b> ile merfu) ama fiil <b>yine tekil</b> kaldı.' },
      { ad:'Çoğul', k:[['<span class="tc-el">كَتَبَ</span>','Fiil'],['الْمُعَلِّمُ<span class="tc-son">ونَ</span>','Fail'],['الدَّرْسَ.','Mef\'ul']],
        tr:'Öğretmenler dersi yazdı.',
        not:'Fâil cem-i müzekker sâlim: <b>vav</b> ile merfu. Fiil başta olduğu için <b>yine tekil</b>.' }
    ]
  ];

  var i = -1;        /* geçerli adım */
  var bekleyen = -1; /* satır sonu durağında sıradaki adım (-1: durak yok) */
  var ci = 0;        /* geçerli örnek çeşidi */
  var EN_COK = 4.2;  /* ölçek tavanı — okunaklılık bozulmasın */
  var BOSLUK = 26;   /* hücrenin kenarında bırakılan pay (px) */
  var ALT    = 86;   /* altta kumanda şeridine ayrılan yer (px) */

  /* Başlık ile kutu çizgisi arasındaki pay. Sol rozet dolu renkli bir
     blok olduğu için aynı payda çizgiye yapışmış gibi duruyor; ona bir
     tık daha yer veriliyor ki iki başlık da çizgiden ayrı okunsun. */
  /* Hareket süresi CSS'teki --tc-sure ile aynı olmalı; oradan okunuyor
     ki iki yerde ayrı ayrı güncellemek gerekmesin. */
  function sure() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--tc-sure').trim();
    var n = parseFloat(v) || .75;
    return /ms$/.test(v) ? n : n * 1000;
  }
  var katmanZaman = 0;
  /* Tabloyu yalnız hareket boyunca GPU katmanına al; bitince bırak ki
     tarayıcı son ölçekte yeniden tarasın (yakınken yazı netleşir). */
  function katmanAc() {
    tablo.classList.add('tc-hareket');
    if (katmanZaman) clearTimeout(katmanZaman);
    katmanZaman = setTimeout(function () {
      katmanZaman = 0;
      tablo.classList.remove('tc-hareket');
    }, sure() + 90);
  }

  var ARA = 18;
  var ARA_SOL = 26;
  var darZaman = 0;  /* dar ekranda kaydırma bitişini bekleyen sayaç */

  function darMi() { return window.innerWidth <= 900; }
  function azaltMi() { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function renk(tr) { return getComputedStyle(tr).getPropertyValue('--satir-renk').trim(); }
  function turAdi(tr) { return (tr.querySelector('.tc-turad') || {}).innerText.replace(/\s+/g, ' ').trim(); }

  /* ---- kamerayı n. hücreye götür ----
     Ölçüler her seferinde transform KALDIRILARAK alınır; yoksa ikinci
     yakınlaşma birincinin üstüne biner ve ölçek katlanır. Ölçüye
     hücrenin ÇOCUKLARI da katılır: örnek hücresinde çeşit oku ve not
     hücre kutusunun dışına taşıyor, çerçeve onları da içine almalı. */
  function kamera(n, anisiz) {
    if (darMi()) {                       /* dar ekranda ölçekleme yok */
      tablo.style.transform = '';
      tablo.style.removeProperty('--z');
      adimlar[n].td.scrollIntoView({ behavior: azaltMi() ? 'auto' : 'smooth', block:'center' });
      /* kaydırma bitince başlığı kutunun yeni yerine taşı */
      etiketleriTazele(true);
      if (darZaman) clearTimeout(darZaman);
      darZaman = setTimeout(function () { darZaman = 0; etiketleriTazele(true); }, sure());
      return;
    }
    var td = adimlar[n].td;

    var oncekiDonusum = tablo.style.transform;
    tablo.classList.add('tc-anisiz');
    tablo.style.transform = 'none';
    var t = tablo.getBoundingClientRect();
    var r = td.getBoundingClientRect();
    var x1 = r.left, y1 = r.top, x2 = r.right, y2 = r.bottom;
    [].forEach.call(td.children, function (c) {
      var b = c.getBoundingClientRect();
      if (!b.width && !b.height) return;
      if (b.left < x1) x1 = b.left;
      if (b.top < y1) y1 = b.top;
      if (b.right > x2) x2 = b.right;
      if (b.bottom > y2) y2 = b.bottom;
    });
    var sh = sahne.getBoundingClientRect();
    tablo.style.transform = oncekiDonusum;
    void tablo.offsetWidth;              /* eski durum yazılsın, geçiş oradan başlasın */
    if (!(anisiz || azaltMi())) tablo.classList.remove('tc-anisiz');

    var kw = x2 - x1, kh = y2 - y1;
    if (!kw || !kh) { tablo.classList.remove('tc-anisiz'); return; }

    /* Çerçeve altta kumanda şeridine yer bırakır; hücre onun ÜSTÜNDE
       ortalanır, yoksa örnek kutusunun alt oku şeridin altında kalıyor.
       Ayrıca ÜSTTE sütun başlığına, SOLDA satır başlığına pay ayrılır —
       yoksa büyüyen kutu ekranı doldurup başlıkların altına giriyor.
       Paylar başlıkların o anki gerçek ölçüsünden okunuyor. */
    var UST_PAY = (basUst && getComputedStyle(basUst).display !== 'none')
                  ? basUst.offsetHeight + ARA + 6 : 0;
    var SOL_PAY = basSol ? basSol.offsetWidth + ARA_SOL + 6 : 0;

    var enG = sh.width - 2 * BOSLUK - SOL_PAY;
    var enY = sh.height - BOSLUK - ALT - UST_PAY;
    var o = Math.min(enG / kw, enY / kh);
    o = Math.max(1, Math.min(EN_COK, o));

    var hx = (x1 + x2) / 2 - t.left, hy = (y1 + y2) / 2 - t.top;
    var mx = sh.left + sh.width / 2 + SOL_PAY / 2;
    var my = sh.top + BOSLUK + UST_PAY + enY / 2;
    var dx = mx - t.left - o * hx;
    var dy = my - t.top  - o * hy;

    tablo.style.setProperty('--z', o);
    katmanAc();
    tablo.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + o + ')';
    if (anisiz || azaltMi()) { void tablo.offsetWidth; tablo.classList.remove('tc-anisiz'); }

    /* Başlıklar kutunun VARACAĞI yere şimdiden konur. transform-origin
       0 0 olduğu için son köşeler doğrudan hesaplanabiliyor; böylece
       başlıklar tabloyla aynı geçişte, aynı anda kayıyor. */
    etiketleriKoy(
      t.left + dx + o * (x1 - t.left),
      t.top  + dy + o * (y1 - t.top),
      t.left + dx + o * (x2 - t.left),
      t.top  + dy + o * (y2 - t.top),
      anisiz || azaltMi(),
      t.top + dy + o * (r.top    - t.top),      /* şerit boyu: kutunun kendi */
      t.top + dy + o * (r.bottom - t.top)
    );
  }

  function kameraGeri() {
    katmanAc();
    tablo.style.transform = '';
    tablo.style.removeProperty('--z');
  }

  /* ---- BÜYÜTME BAŞLIKLARI ----
     Kutunun EKRANDAKİ son köşeleri veriliyor; üst başlık kutunun
     üstüne yatayda ortalı, sol başlık soluna dikeyde ortalı konur.
     İkisi de sahnenin dışına taşmayacak şekilde kırpılır — büyütülen
     kutu ekranı neredeyse doldurduğu için bu sınır sık devreye girer. */
  /* x1..y2 = kutunun TAŞAN ÇOCUKLARI dahil sınırları (başlıklar onlara
     da çarpmasın diye). kY1/kY2 verilirse şeridin BOYU bunlardan değil,
     kutunun kendi çerçevesinden alınır — göz neyi görüyorsa o. */
  function etiketleriKoy(x1, y1, x2, y2, anisiz, kY1, kY2) {
    if (kY1 == null) { kY1 = y1; kY2 = y2; }
    if (!basUst || !basSol) return;
    basUst.classList.toggle('tc-anisiz', !!anisiz);
    basSol.classList.toggle('tc-anisiz', !!anisiz);
    var sh = sahne.getBoundingClientRect();
    var ust = sh.top;
    var bar = document.querySelector('.tc-ust');
    if (bar) ust = Math.max(ust, bar.getBoundingClientRect().bottom);

    if (getComputedStyle(basUst).display !== 'none') {
      var uw = basUst.offsetWidth, uh = basUst.offsetHeight;
      var ux = (x1 + x2) / 2 - uw / 2;
      ux = Math.max(sh.left + 6, Math.min(ux, sh.right - uw - 6));
      var uy = Math.max(ust + 4, y1 - uh - ARA);
      basUst.style.transform = 'translate(' + Math.round(ux) + 'px,' + Math.round(uy) + 'px)';
    }

    /* Sol rozet, etiketlediği KUTUNUN BOYUNDA bir şerit olsun.
       İçeriğe göre boyutlanınca satır adı uzunluğuna göre kısalıp
       uzuyor ("dolgu daralıyor"); kutuya eşitlenince hep aynı şeyi
       kaplıyor ve yazı ortasında duruyor. Ekrandan taşmasın diye
       sahne sınırlarına kırpılır. */
    var enUst = ust + 4, enAlt = sh.bottom - 4;
    var sYuk = Math.min(kY2 - kY1, enAlt - enUst);
    basSol.style.height = Math.round(sYuk) + 'px';
    var sw = basSol.offsetWidth;
    var sx = Math.max(sh.left + 4, x1 - sw - ARA_SOL);
    var sy = (kY1 + kY2) / 2 - sYuk / 2;
    sy = Math.max(enUst, Math.min(sy, enAlt - sYuk));
    basSol.style.transform = 'translate(' + Math.round(sx) + 'px,' + Math.round(sy) + 'px)';
  }

  /* Dar ekranda ölçekleme yok; kutunun gerçek yerinden okunur. */
  function etiketleriTazele(anisiz) {
    var a = adimlar[i]; if (!a) return;
    var r = a.td.getBoundingClientRect();
    etiketleriKoy(r.left, r.top, r.right, r.bottom, anisiz);
  }

  /* ---- örnek çeşidi: hücrenin İÇİNE yazılır ---- */
  function cesitHtml(si) {
    var c = CESIT[si][ci];
    var ar = c.k.map(function (x) {
      return '<span class="tc-oge"><span class="tc-kelime">' + x[0] + '</span>' +
             '<span class="tc-etiket">' + x[1] + '</span></span>';
    }).join('');
    return '<div class="tc-cesit-serit">' +
             '<button type="button" class="tc-ok" data-yon="-1" title="Önceki örnek">&#9650;</button>' +
             '<span class="tc-cesit-ad">' + c.ad + '</span>' +
           '</div>' +
           '<div class="tc-ornek">' +
             '<div class="tc-ar">' + ar + '</div>' +
             '<div class="tc-ceviri">' + c.tr + '</div>' +
           '</div>' +
           '<div class="tc-cesit-serit">' +
             '<button type="button" class="tc-ok" data-yon="1" title="Sonraki örnek">&#9660;</button>' +
           '</div>' +
           '<p class="tc-cesit-not">' + c.not + '</p>';
  }

  function asillariGeriKoy(haric) {
    adimlar.forEach(function (a) {
      if (a !== haric && a.td.innerHTML !== a.asil && a.td.querySelector('.tc-cesit-serit')) {
        a.td.innerHTML = a.asil;
      }
    });
  }

  function ciz(anisiz) {
    var a = adimlar[i];
    document.querySelectorAll('.tc-tablo td.tc-secili').forEach(function (t) { t.classList.remove('tc-secili'); });
    a.td.classList.add('tc-secili');

    var r = renk(a.tr);
    kum.style.setProperty('--odak-renk', r);
    sayacEl.textContent = (i + 1) + ' / ' + adimlar.length;

    /* Üstte sütun (kutunun kendi başlığı), solda satır (tamlama türü). */
    if (basUst) basUst.textContent = a.td.getAttribute('data-bas') || '';
    if (basSolYazi) basSolYazi.textContent = turAdi(a.tr);
    if (basSol) basSol.style.setProperty('--odak-renk', r);

    /* Son sütun ÖRNEK: hücrenin içeriği çeşitle değiştirilir. */
    var ornekMi = a.asil.indexOf('tc-ornek') >= 0;
    asillariGeriKoy(a);
    if (ornekMi) a.td.innerHTML = cesitHtml(a.satir);
    else if (a.td.innerHTML !== a.asil) a.td.innerHTML = a.asil;

    /* Uçlarda da etkin: ilk kutuda Geri, son kutuda İleri küçültme yapar. */
    geri.disabled = false;
    ileri.disabled = false;
    document.body.classList.add('tc-yakin');
    kum.classList.add('gor');
    kum.setAttribute('aria-hidden', 'false');
    kamera(i, anisiz);
  }

  function git(n) {
    if (n < 0 || n >= adimlar.length) return;
    /* SATIR SONU DURAĞI — bir satırın son sütunundayken İleri önce
       uzaklaştırır; öğrenci tabloyu bütün olarak yeniden görür. İkinci
       dokunuşta sonraki satırın ilk sütunu büyür. Sütun sayısına değil,
       adımın satırının değişmesine bakıyoruz. */
    if (i >= 0 && n === i + 1 && adimlar[n].satir !== adimlar[i].satir) {
      araVer(n);
      return;
    }
    bekleyen = -1;
    if (i !== n) ci = 0;          /* yeni hücrede çeşit başa döner */
    i = n;
    ciz(false);
  }

  /* Satır sonu durağı: yakınlık kalkar ama KUMANDA açık kalır, yoksa
     İleri'ye ikinci kez basılamaz. Sıradaki adım "bekleyen"de tutulur. */
  function araVer(n) {
    bekleyen = n;
    kameraGeri();
    document.body.classList.remove('tc-yakin');
    document.querySelectorAll('.tc-tablo td.tc-secili').forEach(function (t) { t.classList.remove('tc-secili'); });
    asillariGeriKoy(null);
    i = -1; ci = 0;
    kum.classList.add('gor');
    kum.setAttribute('aria-hidden', 'false');
    kum.style.setProperty('--odak-renk', renk(adimlar[n].tr));
    sayacEl.textContent = (n + 1) + ' / ' + adimlar.length;
    geri.disabled = false;
    ileri.disabled = false;
  }

  function uzaklas() {
    if (i < 0 && bekleyen < 0) return;
    bekleyen = -1;
    kameraGeri();
    document.body.classList.remove('tc-yakin');
    kum.classList.remove('gor');
    kum.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.tc-tablo td.tc-secili').forEach(function (t) { t.classList.remove('tc-secili'); });
    asillariGeriKoy(null);
    i = -1; ci = 0;
  }

  /* Duraktayken İleri sıradaki satırı açar, Geri bırakılan hücreye döner.
     UÇLAR: ilk kutunun öncesinde, son kutunun sonrasında başka kutu yok —
     oralarda düğme devre dışı kalmak yerine ekranı küçültür. */
  function ileriGit() {
    if (bekleyen >= 0) { var n = bekleyen; bekleyen = -1; git(n); return; }
    if (i === adimlar.length - 1) { uzaklas(); return; }
    git(i < 0 ? 0 : i + 1);
  }
  function geriGit() {
    if (bekleyen >= 0) { var n = bekleyen; bekleyen = -1; git(n - 1); return; }
    if (i === 0) { uzaklas(); return; }
    git(i - 1);
  }

  function cesitGit(y) {
    var a = adimlar[i]; if (!a) return;
    var n = CESIT[a.satir].length;
    ci = (ci + y + n) % n;
    a.td.innerHTML = cesitHtml(a.satir);
    kamera(i, false);   /* not uzunluğu değişebilir; çerçeve tazelenir */
  }

  /* Hücreye dokunmak: kapalıysa yaklaş, o hücredeysen uzaklaş. */
  adimlar.forEach(function (a, n) {
    a.td.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.tc-ok')) return;
      if (i !== n) { git(n); return; }
      /* Odaktaki kutuya tekrar dokunmak KÜÇÜLTÜR ama gezintiyi bitirmez:
         satır sonundaki gibi bir DURAĞA geçilir. Böylece İleri baştan
         başlamak yerine kalınan yerden devam eder, Geri de bırakılan
         kutuyu geri açar. Son kutuda devam edecek adım yok, tamamen çıkılır. */
      if (n >= adimlar.length - 1) uzaklas(); else araVer(n + 1);
    });
  });
  tablo.addEventListener('click', function (e) {
    var ok = e.target.closest ? e.target.closest('.tc-ok') : null;
    if (ok) { e.stopPropagation(); cesitGit(+ok.getAttribute('data-yon')); }
  });

  ileri.addEventListener('click', function () { ileriGit(); });
  geri.addEventListener('click', function () { geriGit(); });
  uzak.addEventListener('click', uzaklas);

  /* ---------- SÜRÜKLEYEREK GEZİNME (4 yön) ----------
     Yakınlaşma açıkken parmakla sürükleme haritada gezer gibi çalışır:
     içerik parmağı izler — SAĞA çekince soldaki, SOLA çekince sağdaki,
     YUKARI çekince alttaki, AŞAĞI çekince üstteki kutu açılır.
     Satır atlarken satır-sonu durağına uğramaz: sürükleme akıcı kalmalı.
     Uçlarda (ilk/son satır ya da sütun) kayma yok sayılır, kutu yerinde
     kalır. Dar ekranda devre dışıdır — orada parmak zaten sayfayı
     kaydırıyor, iki hareket birbiriyle yarışmasın. */
  var syBas = null, sonSurukleme = 0;
  function komsuGit(dSatir, dSutun) {
    if (i < 0) return;
    var a = adimlar[i], hedef = -1;
    adimlar.forEach(function (x, k) {
      if (x.satir === a.satir + dSatir && x.sutun === a.sutun + dSutun) hedef = k;
    });
    if (hedef < 0) return;                 /* uçtayız: olduğumuz yerde kal */
    bekleyen = -1; ci = 0; i = hedef;
    ciz(false);
  }
  sahne.addEventListener('pointerdown', function (e) {
    syBas = (i >= 0) ? { x: e.clientX, y: e.clientY } : null;
  });
  /* pointerup DOCUMENT'ta: parmak sahnenin dışında kalksa da yakalanır. */
  document.addEventListener('pointerup', function (e) {
    if (!syBas) return;
    var dx = e.clientX - syBas.x, dy = e.clientY - syBas.y;
    syBas = null;
    if (i < 0) return;
    var ax = Math.abs(dx), ay = Math.abs(dy);
    if (Math.max(ax, ay) < 48) return;     /* kısa dokunuş: tıklama sayılır */
    /* Uzun sürükleme HER ekranda tıklama sayılmaz — dar ekranda da yanlış
       hücreye tıklanmış olmasın. Gezinme ise yalnız geniş ekranda. */
    sonSurukleme = Date.now();
    if (darMi()) return;
    if (ax > ay) komsuGit(0, dx < 0 ? 1 : -1);   /* sola çek → sağdaki */
    else         komsuGit(dy < 0 ? 1 : -1, 0);   /* yukarı çek → alttaki */
  });
  document.addEventListener('pointercancel', function () { syBas = null; });
  /* Sürüklemenin bıraktığı tıklama, hücre aç/kapa işlemini tetiklemesin —
     yoksa her kaydırma sonunda odaktaki kutu küçülürdü. */
  sahne.addEventListener('click', function (e) {
    if (Date.now() - sonSurukleme < 500) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  /* ---------- GERİ TUŞU: iki aşamalı ----------
     Yakınlaşma (ya da satır durağı) açıkken üst şeritteki Geri önce
     yalnızca yakınlaşmayı kapatır; sayfadan çıkmaz. Kapalıyken bağlantı
     kendi işine bakar ve index'e döner. Belge düzeyinde YAKALAMA evresi:
     bu betik sistem/geri.js'ten önce yüklendiği için buradaki dinleyici
     ondan önce çalışır ve gerektiğinde onu da susturur. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('#tcGeri') : null;
    if (!a) return;
    if (i >= 0 || bekleyen >= 0) {
      e.preventDefault();
      e.stopImmediatePropagation();
      uzaklas();
    }
  }, true);

  var boyZaman = 0;
  window.addEventListener('resize', function () {
    if (boyZaman) clearTimeout(boyZaman);
    boyZaman = setTimeout(function () {
      boyZaman = 0;
      if (i >= 0) kamera(i, true);
    }, 160);
  });

  /* Dar ekranda sayfa kaydıkça başlık kutuyla birlikte yürüsün. */
  function kaymaTazele() { if (i >= 0 && darMi()) etiketleriTazele(true); }
  window.addEventListener('scroll', kaymaTazele, { passive: true });
  sahne.addEventListener('scroll', kaymaTazele, { passive: true });

  document.addEventListener('keydown', function (e) {
    /* İ'rab paneli açıksa klavye ona ait; burası karışmaz. */
    if (document.getElementById('tcPerde').classList.contains('acik')) return;
    var acik = (i >= 0 || bekleyen >= 0);
    if (e.key === 'Escape' && acik) { uzaklas(); e.preventDefault(); return; }
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      ileriGit(); e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (acik) { geriGit(); e.preventDefault(); }
    } else if (acik && (e.key === 'ArrowDown')) { cesitGit(1); e.preventDefault(); }
    else if (acik && (e.key === 'ArrowUp')) { cesitGit(-1); e.preventDefault(); }
  });

  window.tcYakinlas = git;
  window.tcUzaklas = uzaklas;
})();

/* ==================== 2) TEST PANELİ ==================== */
/* ============================================================
   TEST — 10 SORULUK TUR, 100 PUAN ÜZERİNDEN
   ------------------------------------------------------------
   Havuz: muhadese/veri/sinav.js — bu sayfanın öğrettiği dört yapı
   (isim tamlaması, sıfat tamlaması, isim cümlesi, fiil cümlesi).
   İçindeki örnekler kalip.js üzerinden 5-10. sınıf ders verilerine
   dayanıyor; sınav için ayrıca Arapça yazılmadı.

   İki soru tipi:
     ANLAM : öbeğin/cümlenin Türkçe karşılığı nedir?
     ÖGE   : işaretli kelime hangi ögedir? (Muzâf, Sıfat, Fâil …)

   Çeldiriciler AYNI TÜRDEN seçilir; öge sorularında ise gerçekten
   karışabilecek öge adları verilir, yoksa soru kendini ele veriyor.
   Havuz ilk "Test" dokunuşunda yükleniyor.
   ============================================================ */
(function () {
  /* ==== SORU HAVUZU (gömülü) : BAŞ ====
     Havuz eskiden muhadese/veri/sinav.js'ten <script> ile çekiliyordu;
     o dosya siteye yüklenmediğinde panel "Soru havuzu yüklenemedi."
     diyordu. Artık veri burada: ağ isteği yok, yüklenmesi gereken
     fazladan dosya yok, çevrimdışı da çalışıyor.
     KAYNAK DEĞİŞMEDİ: içerik muhadese/veri/sinav.js'ten üretilir
     (/tmp/gomu_havuz.js). O dosya sayfada ayrıca duruyorsa (window.
     KIDEF_SINAV) onunki kullanılır, böylece tek yerden güncellenebilir.
     Bu Arapçaların hiçbiri elle yazılmadı: kalip.js üzerinden 5-10.
     sınıf ders verilerinden geliyor.
     ==================================================== */
  var GOMULU_HAVUZ = {
    tur: {"izafet":"İsim Tamlaması","sifattam":"Sıfat Tamlaması","isimcum":"İsim Cümlesi","fiilcum":"Fiil Cümlesi"},
    ogeler: ["Muzâf","Muzâfun ileyh","Mevsûf","Sıfat","Mübteda","Haber","Fiil","Fâil","Mef’ûl"],
    maddeler: [
      {"t":"izafet","ar":"يَوْم الجُمُعَة","tr":"Cuma günü","oge":[["يَوْم","Muzâf"],["الجُمُعَة","Muzâfun ileyh"]]},
      {"t":"izafet","ar":"يَوْم الثُّلاثاء","tr":"Salı günü","oge":[["يَوْم","Muzâf"],["الثُّلاثاء","Muzâfun ileyh"]]},
      {"t":"izafet","ar":"كُرَة القَدَم","tr":"Futbol (ayak topu)","oge":[["كُرَة","Muzâf"],["القَدَم","Muzâfun ileyh"]]},
      {"t":"izafet","ar":"مَمَرّ المُشاة","tr":"Yaya geçidi","oge":[["مَمَرّ","Muzâf"],["المُشاة","Muzâfun ileyh"]]},
      {"t":"izafet","ar":"غُرْفَةُ الجُلوسِ","tr":"Oturma odası","oge":[["غُرْفَةُ","Muzâf"],["الجُلوسِ","Muzâfun ileyh"]]},
      {"t":"izafet","ar":"رَبَّة البَيْت","tr":"Ev hanımı","oge":[["رَبَّة","Muzâf"],["البَيْت","Muzâfun ileyh"]]},
      {"t":"izafet","ar":"قَلْعَة الْفَتَاة","tr":"Kız Kalesi","oge":[["قَلْعَة","Muzâf"],["الْفَتَاة","Muzâfun ileyh"]]},
      {"t":"izafet","ar":"مُتْحَف مَوْلَانَا","tr":"Mevlana Müzesi","oge":[["مُتْحَف","Muzâf"],["مَوْلَانَا","Muzâfun ileyh"]]},
      {"t":"izafet","ar":"عاصِمَة تُرْكِيا","tr":"Türkiye başkenti","oge":[["عاصِمَة","Muzâf"],["تُرْكِيا","Muzâfun ileyh"]]},
      {"t":"izafet","ar":"قِراءَة الكُتُب","tr":"Kitap okuma","oge":[["قِراءَة","Muzâf"],["الكُتُب","Muzâfun ileyh"]]},
      {"t":"izafet","ar":"مَدِينَة قُونْيَا","tr":"Konya şehri","oge":[["مَدِينَة","Muzâf"],["قُونْيَا","Muzâfun ileyh"]]},
      {"t":"izafet","ar":"مُشاهَدَة السّينَما","tr":"Sinema izleme","oge":[["مُشاهَدَة","Muzâf"],["السّينَما","Muzâfun ileyh"]]},
      {"t":"sifattam","ar":"الضَّوْء الأَحْمَر","tr":"Kırmızı ışık","oge":[["الضَّوْء","Mevsûf"],["الأَحْمَر","Sıfat"]]},
      {"t":"sifattam","ar":"الضَّوْء الأَخْضَر","tr":"Yeşil ışık","oge":[["الضَّوْء","Mevsûf"],["الأَخْضَر","Sıfat"]]},
      {"t":"sifattam","ar":"القِطار السَّريع","tr":"Hızlı tren","oge":[["القِطار","Mevsûf"],["السَّريع","Sıfat"]]},
      {"t":"sifattam","ar":"الشّارِع الواسِع","tr":"Geniş cadde","oge":[["الشّارِع","Mevsûf"],["الواسِع","Sıfat"]]},
      {"t":"sifattam","ar":"الصَّيْدَلِيَّة الجَديدَة","tr":"Yeni eczane","oge":[["الصَّيْدَلِيَّة","Mevsûf"],["الجَديدَة","Sıfat"]]},
      {"t":"sifattam","ar":"السّوق القَديم","tr":"Eski çarşı","oge":[["السّوق","Mevsûf"],["القَديم","Sıfat"]]},
      {"t":"sifattam","ar":"الغِذاء الصِّحِّيّ","tr":"Sağlıklı gıda","oge":[["الغِذاء","Mevsûf"],["الصِّحِّيّ","Sıfat"]]},
      {"t":"sifattam","ar":"الأُسْبوع القادِم","tr":"Gelecek hafta","oge":[["الأُسْبوع","Mevsûf"],["القادِم","Sıfat"]]},
      {"t":"sifattam","ar":"السّاعَة السّابِعَة","tr":"Yedinci saat","oge":[["السّاعَة","Mevsûf"],["السّابِعَة","Sıfat"]]},
      {"t":"sifattam","ar":"أَخي الكَبيرُ","tr":"Büyük kardeşim","oge":[["أَخي","Mevsûf"],["الكَبيرُ","Sıfat"]]},
      {"t":"isimcum","ar":"أَنْتَ مُتَقاعِد.","tr":"Sen emeklisin.","oge":[["أَنْتَ","Mübteda"],["مُتَقاعِد","Haber"]]},
      {"t":"isimcum","ar":"هُو مُتَعَجِّب.","tr":"O şaşkındır.","oge":[["هُو","Mübteda"],["مُتَعَجِّب","Haber"]]},
      {"t":"isimcum","ar":"هِي قَلِقَة.","tr":"O endişelidir.","oge":[["هِي","Mübteda"],["قَلِقَة","Haber"]]},
      {"t":"isimcum","ar":"الرِّياضَة مُفيدَة لِلصِّحَّة.","tr":"Spor sağlık için faydalıdır.","oge":[["الرِّياضَة","Mübteda"],["مُفيدَة","Haber"]]},
      {"t":"isimcum","ar":"الفُنْدُق قَريب مِنْ هُنا.","tr":"Otel buraya yakındır.","oge":[["الفُنْدُق","Mübteda"],["قَريب","Haber"]]},
      {"t":"isimcum","ar":"مَدْرَسَتي بَعيدَة عَن بَيْتي.","tr":"Okulum evimden uzaktır.","oge":[["مَدْرَسَتي","Mübteda"],["بَعيدَة","Haber"]]},
      {"t":"isimcum","ar":"الطَّقْسُ حارٌّ فِي الصَّيْفِ.","tr":"Yazın hava sıcaktır.","oge":[["الطَّقْسُ","Mübteda"],["حارٌّ","Haber"]]},
      {"t":"isimcum","ar":"الجَوُّ جَميلٌ فِي الرَّبيعِ.","tr":"İlkbaharda hava güzeldir.","oge":[["الجَوُّ","Mübteda"],["جَميلٌ","Haber"]]},
      {"t":"isimcum","ar":"الشّارِع مُزْدَحِم بِالمُواصَلات.","tr":"Cadde ulaşım araçlarıyla kalabalıktır.","oge":[["الشّارِع","Mübteda"],["مُزْدَحِم","Haber"]]},
      {"t":"isimcum","ar":"مَدْرَسَتي خَلْف المَسْجِد.","tr":"Okulum caminin arkasındadır.","oge":[["مَدْرَسَتي","Mübteda"],["خَلْف","Haber"]]},
      {"t":"fiilcum","ar":"يَلْعَبُ أَحْمَد كُرَة القَدَم.","tr":"Ahmet futbol oynuyor.","oge":[["يَلْعَبُ","Fiil"],["أَحْمَد","Fâil"],["كُرَة القَدَم","Mef’ûl"]]},
      {"t":"fiilcum","ar":"تَجَوَّلَتْ مَرْوَة في إِسْطَنْبُول.","tr":"Merve İstanbulda gezindi.","oge":[["تَجَوَّلَتْ","Fiil"],["مَرْوَة","Fâil"]]},
      {"t":"fiilcum","ar":"يَعِيشُ يُونُس فِي قُونْيَا.","tr":"Yunus Konya'da yaşıyor.","oge":[["يَعِيشُ","Fiil"],["يُونُس","Fâil"]]},
      {"t":"fiilcum","ar":"أَشْعُرُ بِأَلَم في حَلْقي.","tr":"Boğazımda ağrı hissediyorum.","oge":[["أَشْعُرُ","Fiil"]]},
      {"t":"fiilcum","ar":"آكُلُ الخَضْرَوات وَالفَواكِه.","tr":"Sebze ve meyve yiyorum.","oge":[["آكُلُ","Fiil"],["الخَضْرَوات","Mef’ûl"]]},
      {"t":"fiilcum","ar":"أَلْعَبُ كُرَة القَدَم.","tr":"Futbol oynuyorum.","oge":[["أَلْعَبُ","Fiil"],["كُرَة القَدَم","Mef’ûl"]]},
      {"t":"fiilcum","ar":"أُنَظِّفُ غُرْفَتي.","tr":"Odamı temizlerim.","oge":[["أُنَظِّفُ","Fiil"],["غُرْفَتي","Mef’ûl"]]},
      {"t":"fiilcum","ar":"أَذْهَبُ إِلى الطَّبيب.","tr":"Doktora giderim.","oge":[["أَذْهَبُ","Fiil"]]},
      {"t":"fiilcum","ar":"أَسْتَمِعُ إِلى الموسيقى.","tr":"Müzik dinliyorum.","oge":[["أَسْتَمِعُ","Fiil"]]},
      {"t":"fiilcum","ar":"أَعِيشُ فِي مَدِينَة قُونْيَا.","tr":"Konya şehrinde yaşıyorum.","oge":[["أَعِيشُ","Fiil"]]}
    ]
  };
  /* Havuzu genel ada da bağla: sayfada ayrıca sinav.js yüklüyse ONUNKI
     kazanır, yoksa gömülü kopya kullanılır. Tek bir okuma noktası kalsın. */
  if (!(window.KIDEF_SINAV && window.KIDEF_SINAV.maddeler && window.KIDEF_SINAV.maddeler.length))
    window.KIDEF_SINAV = GOMULU_HAVUZ;
  /* ==== SORU HAVUZU (gömülü) : SON ==== */
  var SORU = 10, PUAN = 10;

  var ac      = document.getElementById('tcTestAc');
  var perde   = document.getElementById('tcSinavPerde');
  if (!ac || !perde) return;
  var kapat   = document.getElementById('tcSinavKapat');
  var eAcilis = document.getElementById('svAcilis');
  var eSoru   = document.getElementById('svSoru');
  var eSonuc  = document.getElementById('svSonuc');
  var elHavuz = document.getElementById('svHavuz');
  var elBasla = document.getElementById('svBasla');
  var elAdim  = document.getElementById('svAdim');
  var elDolu  = document.getElementById('svDolu');
  var elPuan  = document.getElementById('svPuan');
  var elYon   = document.getElementById('svYonerge');
  var elMetin = document.getElementById('svMetin');
  var elSik   = document.getElementById('svSiklar');
  var elSon   = document.getElementById('svSonraki');
  var elHalka = document.getElementById('svHalka');
  var elSkor  = document.getElementById('svSkor');
  var elMesaj = document.getElementById('svMesaj');
  var elOzet  = document.getElementById('svOzet');

  var havuz = null, yukleniyor = false;
  var sorular = [], adim = 0, dogru = 0, cevapVerildi = false;
  var turNo = 0, turBas = 0, bildirildi = false;
  var HARF = ['A', 'B', 'C', 'D', 'E'];

  /* Aynı yapıda birlikte geçen, yani gerçekten karışabilecek öge adları. */
  var YAKIN = {
    'Muzâf':         ['Muzâfun ileyh', 'Mevsûf', 'Sıfat', 'Mübteda'],
    'Muzâfun ileyh': ['Muzâf', 'Sıfat', 'Mevsûf', 'Haber'],
    'Mevsûf':        ['Sıfat', 'Muzâf', 'Muzâfun ileyh', 'Mübteda'],
    'Sıfat':         ['Mevsûf', 'Muzâfun ileyh', 'Muzâf', 'Haber'],
    'Mübteda':       ['Haber', 'Fâil', 'Mevsûf', 'Muzâf'],
    'Haber':         ['Mübteda', 'Sıfat', 'Mef’ûl', 'Fâil'],
    'Fiil':          ['Fâil', 'Mef’ûl', 'Mübteda', 'Haber'],
    'Fâil':          ['Mef’ûl', 'Fiil', 'Mübteda', 'Haber'],
    'Mef’ûl':        ['Fâil', 'Fiil', 'Haber', 'Muzâfun ileyh']
  };

  function karistir(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function havuzYaz() {
    if (!havuz) { elHavuz.textContent = 'Soru havuzu yükleniyor…'; elBasla.disabled = true; return; }
    if (!tablo) tablo = tabloyuOku();
    var t = tablo.reduce(function (n, k) { return n + k.maddeler.length; }, 0);
    var o = havuz.maddeler.reduce(function (n, x) { return n + x.oge.length; }, 0);
    elHavuz.textContent = t + ' tablo · ' + o + ' öge sorusu havuzda';
    elBasla.disabled = (t + o < SORU);
  }
  function havuzYukle() {
    if (havuz) { havuzYaz(); return; }
    /* Havuz gömülü (yukarıdaki blok window.KIDEF_SINAV'e bağlar):
       ağ isteği yok, bekleme yok, eksik dosya yüzünden hata yok. */
    var h = window.KIDEF_SINAV;
    havuz = (h && h.maddeler && h.maddeler.length) ? h : null;
    if (!havuz) { elHavuz.textContent = 'Soru havuzu boş.'; elBasla.disabled = true; return; }
    havuzYaz();
  }

  /* ---- soru üretimi ---- */
  /* ---- TABLO SORULARI ----
     Sorular sayfanın KENDİ tablosundan okunuyor: "Ne işe yarar", "Ögeleri
     nelerdir", "Uyum", "Dikkat edilmesi gerekenler" sütunlarının hücreleri.
     Böylece tablo değişince sorular da kendiliğinden güncellenir; ayrı bir
     soru dosyası tutup ikisini elde eşitlemek gerekmez.
     Çeldiriciler AYNI SÜTUNUN öteki satırlarından gelir — yani "İsim
     Cümlesi"nin uyumu sorulduğunda şıklarda "Fiil Cümlesi"nin uyumu da
     bulunur. En çok karışan şey tam olarak budur. */
  var tablo = null;
  function tabloyuOku() {
    var satirlar = [].slice.call(document.querySelectorAll('.tc-satir'));
    var kayit = [];
    satirlar.forEach(function (tr) {
      var adEl = tr.querySelector('.tc-turad');
      if (!adEl) return;
      var ad = adEl.innerText.replace(/\s+/g, ' ').trim();
      [].slice.call(tr.querySelectorAll('td[data-bas]')).forEach(function (td) {
        if (td.querySelector('.tc-ornek')) return;        /* Örnek sütunu öge sorularının işi */
        var mad = [].slice.call(td.querySelectorAll('li'))
          .map(function (li) { return li.innerText.replace(/\s+/g, ' ').trim(); })
          .filter(function (x) { return x.length > 3; });
        if (mad.length) kayit.push({ ad: ad, sutun: td.getAttribute('data-bas'), maddeler: mad });
      });
    });
    return kayit;
  }
  function tabloSorusu(h) {
    /* aynı sütun, başka satır → en güçlü çeldirici */
    var ayniSutun = [];
    tablo.forEach(function (k) {
      if (k.sutun === h.sutun && k.ad !== h.ad) ayniSutun = ayniSutun.concat(k.maddeler);
    });
    var digerleri = [];
    tablo.forEach(function (k) {
      if (k.sutun !== h.sutun) digerleri = digerleri.concat(k.maddeler);
    });
    var aday = karistir(ayniSutun).concat(karistir(digerleri));
    /* Aynı hücrenin ÖTEKİ maddeleri çeldirici olamaz: onlar da o yapı için
       doğrudur, sorunun iki doğru cevabı olurdu. Başka satırda birebir aynı
       metin geçiyorsa o da elenir. */
    var secili = [], gor = {};
    h.tumMaddeler.forEach(function (x) { gor[x] = 1; });
    for (var i = 0; i < aday.length && secili.length < 4; i++) {
      if (gor[aday[i]]) continue;
      gor[aday[i]] = 1; secili.push(aday[i]);
    }
    return {
      tip: 'tablo',
      yonerge: h.sutun,
      metin: h.ad, arapca: false, isaret: null,
      dogru: h.madde,
      siklar: karistir(secili.concat([h.madde]))
    };
  }

  function ogeSorusu(m, o) {
    var kelime = o[0], rol = o[1];
    /* En güçlü çeldirici, AYNI örnekte geçen öteki ögedir: "الضَّوْء الأَحْمَر"
       sorulurken Mevsûf ile Sıfat gerçekten karışır. Sonra o role yakın
       öge adları, en sonda havuzun kalanı gelir. */
    var ayniOrnek = m.oge.map(function (x) { return x[1]; }).filter(function (x) { return x !== rol; });
    var aday = ayniOrnek
      .concat(karistir((YAKIN[rol] || []).slice()))
      .concat(karistir(havuz.ogeler.filter(function (x) { return x !== rol; })));
    var secili = [], gor = {};
    for (var i = 0; i < aday.length && secili.length < 4; i++) {
      if (gor[aday[i]] || aday[i] === rol) continue;
      gor[aday[i]] = 1; secili.push(aday[i]);
    }
    return {
      tip: 'oge',
      yonerge: 'İşaretli kelime hangi ögedir?',
      metin: m.ar, arapca: true, isaret: kelime,
      dogru: rol,
      siklar: karistir(secili.concat([rol]))
    };
  }
  function turKur() {
    if (!tablo) tablo = tabloyuOku();
    /* TABLO havuzu: her satır-sütun-madde üçlüsü bir soru */
    var tabloHavuz = [];
    tablo.forEach(function (k) {
      k.maddeler.forEach(function (m) {
        tabloHavuz.push({ ad: k.ad, sutun: k.sutun, madde: m, tumMaddeler: k.maddeler });
      });
    });
    /* ÖGE havuzu: örneklerin ögeleri */
    var ogeHavuz = [];
    havuz.maddeler.forEach(function (m) {
      m.oge.forEach(function (o) { ogeHavuz.push({ m: m, o: o }); });
    });
    karistir(tabloHavuz); karistir(ogeHavuz);

    var kacTablo = Math.min(Math.round(SORU / 2), tabloHavuz.length);
    var secilen = [], kul = {};
    function doldur(kaynak, adet, anahtar) {
      for (var i = 0; i < kaynak.length && adet > 0; i++) {
        var k = anahtar(kaynak[i]);
        if (kul[k]) continue;
        kul[k] = 1; secilen.push(kaynak[i]); adet--;
      }
    }
    doldur(tabloHavuz, kacTablo, function (x) { return 'T|' + x.ad + '|' + x.sutun; });
    doldur(ogeHavuz, SORU - secilen.length, function (x) { return 'O|' + x.m.ar; });
    doldur(tabloHavuz, SORU - secilen.length, function (x) { return 'T2|' + x.madde; });

    sorular = karistir(secilen).map(function (x) {
      return x.madde ? tabloSorusu(x) : ogeSorusu(x.m, x.o);
    });
    adim = 0; dogru = 0;
  }

  function ekran(hangi) {
    eAcilis.hidden = (hangi !== 'acilis');
    eSoru.hidden   = (hangi !== 'soru');
    eSonuc.hidden  = (hangi !== 'sonuc');
  }

  /* İşaret ÇOK KELİMELİ olabilir: "كُرَة القَدَم" gibi bir mef'ûl kendi
     içinde tamlamadır. Bu yüzden tek tek kelime değil, ardışık kelime
     dizisi eşleştiriliyor; yoksa öge sorusu işaretsiz kalıyordu. */
  function metinYaz(q) {
    var ar = !!q.arapca;
    elMetin.className = 'sv-soru' + (ar ? ' sv-ar' : ' sv-tr');
    elMetin.setAttribute('dir', ar ? 'rtl' : 'ltr');
    elMetin.innerHTML = '';
    if (!ar) { elMetin.textContent = q.metin; return; }
    var kelime = q.metin.split(' ');
    var im = q.isaret ? q.isaret.split(' ') : [];
    var kok = function (x) { return x.replace(/[.،؟!]+$/, ''); };
    var basla = -1;
    if (im.length) {
      for (var i = 0; i + im.length <= kelime.length; i++) {
        var uyar = true;
        for (var j = 0; j < im.length; j++) if (kok(kelime[i + j]) !== kok(im[j])) { uyar = false; break; }
        if (uyar) { basla = i; break; }
      }
    }
    kelime.forEach(function (k, n) {
      if (n) elMetin.appendChild(document.createTextNode(' '));
      var e = document.createElement('span');
      if (basla >= 0 && n >= basla && n < basla + im.length) e.className = 'sv-isaret';
      e.textContent = k;
      elMetin.appendChild(e);
    });
  }

  function soruCiz() {
    var q = sorular[adim];
    cevapVerildi = false;
    elAdim.textContent = 'Soru ' + (adim + 1) + ' / ' + SORU;
    elDolu.style.width = (adim / SORU * 100) + '%';
    elPuan.textContent = (dogru * PUAN) + ' puan';
    elYon.textContent = q.yonerge;
    metinYaz(q);

    elSik.innerHTML = '';
    q.siklar.forEach(function (metin, n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sv-sik';
      b.innerHTML = '<span class="sv-harf">' + HARF[n] + '</span><span class="sv-yazi"></span>';
      b.querySelector('.sv-yazi').textContent = metin;
      b.addEventListener('click', function () { cevapla(b, metin); });
      elSik.appendChild(b);
    });
    elSon.hidden = true;
    elSon.textContent = (adim === SORU - 1) ? 'Sonucu Gör' : 'Sonraki ❯';
  }

  function cevapla(dugme, metin) {
    if (cevapVerildi) return;
    cevapVerildi = true;
    var q = sorular[adim];
    if (metin === q.dogru) dogru++;
    [].forEach.call(elSik.children, function (b) {
      b.disabled = true;
      var y = b.querySelector('.sv-yazi').textContent;
      if (y === q.dogru) b.classList.add('dogru');
      else if (b === dugme) b.classList.add('yanlis');
    });
    elPuan.textContent = (dogru * PUAN) + ' puan';
    elDolu.style.width = ((adim + 1) / SORU * 100) + '%';
    elSon.hidden = false;
    elSon.focus();
  }

  function sonraki() {
    if (!cevapVerildi) return;
    if (adim < SORU - 1) { adim++; soruCiz(); return; }
    sonucCiz();
  }

  function sonucCiz() {
    var puan = dogru * PUAN;
    /* Görev/ilerleme köprüsüne BİR KEZ rapor et (tur başına). Öğrenci
       öğretmenine bağlı değilse ya da giriş yoksa köprü sessiz kalır. */
    if (!bildirildi) {
      bildirildi = true;
      try {
        if (window.KidefGorev && KidefGorev.aktif) {
          var ogeN = sorular.filter(function (q) { return q.tip === 'oge'; }).length;
          KidefGorev.bildir({
            dogru: dogru, toplam: SORU, mod: 'tur',
            detay: turNo + '. tur · ' + ogeN + ' öge/' + (SORU - ogeN) + ' tablo',
            sureSn: turBas ? Math.round((Date.now() - turBas) / 1000) : null
          });
        }
      } catch (e) { }
    }
    elSkor.textContent = puan;
    elHalka.style.setProperty('--yuzde', puan);
    elMesaj.textContent =
      puan === 100 ? 'Tam isabet! 🎯' :
      puan >= 80  ? 'Çok iyi!' :
      puan >= 60  ? 'İyi gidiyorsun.' :
      puan >= 40  ? 'Biraz daha tekrar iyi olur.' :
                    'Yapıları bir kez daha gözden geçirelim.';
    var ogeSay = sorular.filter(function (q) { return q.tip === 'oge'; }).length;
    elOzet.textContent = SORU + ' sorudan ' + dogru + ' doğru · ' +
      ogeSay + ' öge, ' + (SORU - ogeSay) + ' tablo sorusu';
    ekran('sonuc');
  }

  function basla() {
    if (elBasla.disabled || !havuz) return;
    turKur();
    if (!sorular.length) return;
    turNo++; turBas = Date.now(); bildirildi = false;
    ekran('soru');
    soruCiz();
  }

  /* ---- olaylar ---- */
  ac.addEventListener('click', function () {
    perde.classList.add('acik');
    perde.setAttribute('aria-hidden', 'false');
    ekran('acilis');
    havuzYukle();
  });
  function kapatt() {
    perde.classList.remove('acik');
    perde.setAttribute('aria-hidden', 'true');
  }
  kapat.addEventListener('click', kapatt);
  document.getElementById('svBitir').addEventListener('click', kapatt);
  perde.addEventListener('click', function (e) { if (e.target === perde) kapatt(); });
  elBasla.addEventListener('click', basla);
  document.getElementById('svTekrar').addEventListener('click', function () {
    ekran('acilis'); havuzYaz();
  });
  elSon.addEventListener('click', sonraki);

  document.addEventListener('keydown', function (e) {
    if (!perde.classList.contains('acik')) return;
    if (e.key === 'Escape') { kapatt(); e.preventDefault(); return; }
    if (eSoru.hidden) return;
    if (!cevapVerildi && /^[1-5]$/.test(e.key)) {
      var b = elSik.children[+e.key - 1];
      if (b) { b.click(); e.preventDefault(); }
    } else if (cevapVerildi && (e.key === 'Enter' || e.key === ' ')) {
      sonraki(); e.preventDefault();
    }
  });

  window.tcTestAc = function () { ac.click(); };

  /* GÖREV KİPİ: sayfa "?gorev=<id>" ile açıldıysa öğrenci anlatım
     ekranını aramasın — Test paneli kendiliğinden açılsın. */
  try {
    if ((new URLSearchParams(location.search)).get('gorev')) {
      setTimeout(function () { ac.click(); }, 600);
    }
  } catch (e) { }
})();

/* ==================== 3) İ'RAB TESTİ ==================== */
/* ============================================================
   İ'RAB TESTİ — 10 SORULUK TUR, 100 PUAN
   ------------------------------------------------------------
   Bu test için AYRI bir soru havuzu yazılmadı. Sorular, i'rab
   penceresindeki ÖRNEK HAVUZU'nun (window.TC_HAVUZ) kendisinden
   üretilir. Sebebi basit: havuza yeni bir örnek eklendiğinde soru
   da kendiliğinden oluşsun; iki ayrı liste zamanla birbirinden
   sapmasın.

   Havuzdaki her kaydın dört etiketi vardır; dört soru tipi de
   bunlara karşılık gelir:
       hal      → "Bu kelimenin hâli nedir?"        (merfu/mansub/mecrur/meczum)
       basamak  → "Alâmet nasıl görünüyor?"         (lafzen/takdiren/mahallen)
       alamet   → "Alâmeti nedir?"                  (zamme/fetha/vav/…)
       gorev    → "Cümledeki görevi nedir?"         (fâil/mef'ul/muzâfun ileyh/…)
   Cümle kayıtlarında ise çözümün her kelimesi ayrı soru olur.

   ÇELDİRİCİLER aynı eksenden seçilir: hâl sorusuna hâl adları,
   görev sorusuna görev adları verilir. Böylece soru kendini ele
   vermez. "Meczum" isim sorularında da seçenek olarak durur —
   çünkü "isim meczum olmaz" kuralının kendisi sınanıyor.

   Cevap işaretlenince havuzdaki i'rab cümlesi açıklama olarak
   açılır; yanlış cevap da öğretsin diye. Tur bitince yanlışlar
   tek tek listelenir.
   ============================================================ */
(function () {
  var bolum = document.querySelector('.tc-bolum[data-bolum="test"]');
  if (!bolum) return;

  var elAcilis = document.getElementById('tiAcilis');
  var elSoru   = document.getElementById('tiSoru');
  var elSonuc  = document.getElementById('tiSonuc');
  var elSecim  = document.getElementById('tiSecim');
  var elHavuz  = document.getElementById('tiHavuz');
  var elBasla  = document.getElementById('tiBasla');
  var elAdim   = document.getElementById('tiAdim');
  var elDolu   = document.getElementById('tiDolu');
  var elPuan   = document.getElementById('tiPuan');
  var elYonerge= document.getElementById('tiYonerge');
  var elSahne  = document.getElementById('tiSahne');
  var elSiklar = document.getElementById('tiSiklar');
  var elAcikla = document.getElementById('tiAciklama');
  var elSonraki= document.getElementById('tiSonraki');
  var elHalka  = document.getElementById('tiHalka');
  var elSkor   = document.getElementById('tiSkor');
  var elMesaj  = document.getElementById('tiMesaj');
  var elOzet   = document.getElementById('tiOzet');
  var elYanlis = document.getElementById('tiYanlislar');
  var elTekrar = document.getElementById('tiTekrar');
  var elOrnek  = document.getElementById('tiOrnek');

  var SORU = 10, PUAN = 10;
  var HAL_AD = { merfu:'Merfu', mansub:'Mansub', mecrur:'Mecrur', meczum:'Meczum' };
  var BAS_AD = { lafzen:'Lafzen', takdiren:'Takdiren', mahallen:'Mahallen' };
  var HAL_LISTE = ['merfu', 'mansub', 'mecrur', 'meczum'];
  var BAS_LISTE = ['lafzen', 'takdiren', 'mahallen'];

  var kip = 'hepsi';
  var sorular = [], adim = 0, dogru = 0, cevapVerildi = false;
  var yanlislar = [], turNo = 0, turBas = 0, bildirildi = false;

  /* ---------- yardımcılar ---------- */
  function karistir(a) {
    var d = a.slice();
    for (var i = d.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = d[i]; d[i] = d[j]; d[j] = t;
    }
    return d;
  }
  function tekille(a) {
    var g = {}, s = [];
    a.forEach(function (x) { if (x && !g[x]) { g[x] = 1; s.push(x); } });
    return s;
  }
  /* Sorulan kelimeyi bağlam içinde sarı zemine alır. Bulunamazsa
     bağlam olduğu gibi kalır; kelime ayrıca etikette gösterilir. */
  function vurgula(baglam, kelime) {
    var y = baglam.indexOf(kelime);
    if (y < 0) return { html: baglam, bulundu: false };
    return {
      html: baglam.slice(0, y) + '<span class="ti-hedef">' + kelime + '</span>' +
            baglam.slice(y + kelime.length),
      bulundu: true
    };
  }
  function celdirici(dogruCevap, kaynak, kac) {
    var havuzu = karistir(tekille(kaynak).filter(function (x) { return x !== dogruCevap; }));
    return havuzu.slice(0, kac);
  }

  /* ---------- soru üretimi ---------- */
  function tumSorular() {
    var havuz = window.TC_HAVUZ || [];
    var kelimeler = havuz.filter(function (k) { return k.tur === 'kelime'; });
    var tumAlamet = tekille(kelimeler.map(function (k) { return k.alamet; }));
    var tumGorev  = tekille(kelimeler.map(function (k) { return k.gorev; }));
    havuz.forEach(function (k) {
      if (k.tur === 'cumle' && k.cozum) {
        k.cozum.forEach(function (c) { if (c.g) tumGorev.push(c.g); });
      }
    });
    tumGorev = tekille(tumGorev);

    var liste = [];

    kelimeler.forEach(function (k) {
      var sahne = {
        etiket: k.tip, ar: k.baglam, tr: k.baglamTr, hedef: k.ar,
        acikla: k.irab, kaynakAr: k.ar
      };
      /* Tek hâlli / tek basamaklı kayıtlar sorulur; çok etiketli
         olanlarda "tek doğru" yoktur, o tipte soru üretilmez. */
      if (k.hal.length === 1) {
        liste.push({ tip:'hal', sahne:sahne,
          yonerge:'İşaretli kelimenin <b>hâli</b> nedir?',
          dogru: HAL_AD[k.hal[0]],
          secenek: HAL_LISTE.map(function (h) { return HAL_AD[h]; }), arapca:false });
      }
      if (k.basamak.length === 1) {
        liste.push({ tip:'basamak', sahne:sahne,
          yonerge:'Bu kelimede i\'rab <b>nasıl görünüyor</b>?',
          dogru: BAS_AD[k.basamak[0]],
          secenek: BAS_LISTE.map(function (b) { return BAS_AD[b]; }), arapca:false });
      }
      if (k.alamet) {
        liste.push({ tip:'alamet', sahne:sahne,
          yonerge:'İşaretli kelimenin <b>alâmeti</b> nedir?',
          dogru: k.alamet,
          secenek: [k.alamet].concat(celdirici(k.alamet, tumAlamet, 3)), arapca:false });
      }
      if (k.gorev) {
        liste.push({ tip:'gorev', sahne:sahne,
          yonerge:'İşaretli kelimenin cümledeki <b>görevi</b> nedir?',
          dogru: k.gorev,
          secenek: [k.gorev].concat(celdirici(k.gorev, tumGorev, 3)), arapca:false });
      }
    });

    havuz.forEach(function (k) {
      if (k.tur !== 'cumle' || !k.cozum) return;
      k.cozum.forEach(function (c) {
        var sahne = {
          etiket:'Cümle', ar:k.ar, tr:k.tr, hedef:c.k,
          acikla: c.not, kaynakAr: c.k
        };
        if (c.h && c.h !== '—' && HAL_AD[c.h]) {
          liste.push({ tip:'hal', sahne:sahne,
            yonerge:'İşaretli kelimenin <b>hâli</b> nedir?',
            dogru: HAL_AD[c.h],
            secenek: HAL_LISTE.map(function (h) { return HAL_AD[h]; }), arapca:false });
        }
        if (c.g) {
          liste.push({ tip:'gorev', sahne:sahne,
            yonerge:'İşaretli kelimenin cümledeki <b>görevi</b> nedir?',
            dogru: c.g,
            secenek: [c.g].concat(celdirici(c.g, tumGorev, 3)), arapca:false });
        }
      });
    });

    return liste;
  }

  function kipeGore() {
    var hepsi = tumSorular();
    if (kip === 'hepsi') return hepsi;
    return hepsi.filter(function (q) { return q.tip === kip; });
  }

  function havuzYaz() {
    var n = kipeGore().length;
    elHavuz.innerHTML = '<b>' + n + '</b> soru üretilebiliyor · her turda ' +
      Math.min(SORU, n) + ' tanesi karışık sorulur.';
    elBasla.disabled = n < 4;
    if (n < 4) elHavuz.innerHTML += ' <span style="color:var(--kirmizi)">Bu tip için yeterli örnek yok.</span>';
  }

  /* ---------- ekranlar ---------- */
  function ekran(ad) {
    elAcilis.hidden = ad !== 'acilis';
    elSoru.hidden   = ad !== 'soru';
    elSonuc.hidden  = ad !== 'sonuc';
    var govde = document.querySelector('.tc-pop-govde');
    if (govde) govde.scrollTop = 0;
  }

  function turKur() {
    var h = karistir(kipeGore());
    /* Bir turda her BAĞLAM bir kez çıksın. Anahtar yalnız cümle/bağlam:
       aynı cümlenin iki ayrı kelimesini üst üste sormak turu tekdüze
       yapıyordu. Havuzda 45'ten çok bağlam var, 10 soru rahat çıkar. */
    var gorulen = {}, secili = [];
    h.forEach(function (q) {
      var anahtar = q.sahne.ar;
      if (gorulen[anahtar] || secili.length >= SORU) return;
      gorulen[anahtar] = 1; secili.push(q);
    });
    /* Havuz dar kaldıysa (tek tipte) tekrar izinli olarak tamamla. */
    if (secili.length < SORU) {
      h.forEach(function (q) { if (secili.length < SORU && secili.indexOf(q) < 0) secili.push(q); });
    }
    sorular = secili.slice(0, SORU);
    adim = 0; dogru = 0; yanlislar = [];
  }

  function soruCiz() {
    var q = sorular[adim];
    cevapVerildi = false;
    elSonraki.hidden = true;
    elAcikla.hidden = true;
    elAdim.textContent = 'Soru ' + (adim + 1) + ' / ' + sorular.length;
    elPuan.textContent = (dogru * PUAN) + ' puan';
    elDolu.style.width = (adim / sorular.length * 100) + '%';
    elYonerge.innerHTML = q.yonerge;

    var v = vurgula(q.sahne.ar, q.sahne.hedef);
    elSahne.innerHTML =
      '<span class="ti-etiket">' + q.sahne.etiket + (v.bulundu ? '' : ' · ' + q.sahne.hedef) + '</span>' +
      '<div class="ti-ar" dir="rtl">' + v.html + '</div>' +
      '<div class="ti-tr">' + (q.sahne.tr || '') + '</div>';

    var harfler = ['A', 'B', 'C', 'D', 'E'];
    var siklar = karistir(tekille(q.secenek)).slice(0, 4);
    if (siklar.indexOf(q.dogru) < 0) { siklar[siklar.length - 1] = q.dogru; siklar = karistir(siklar); }
    elSiklar.innerHTML = '';
    siklar.forEach(function (metin, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'ti-sik' + (q.arapca ? ' ti-arapca' : '');
      d.innerHTML = '<span class="ti-harf">' + harfler[i] + '</span><span class="ti-yazi">' + metin + '</span>';
      d.addEventListener('click', function () { cevapla(d, metin, q); });
      elSiklar.appendChild(d);
    });
  }

  function cevapla(dugme, metin, q) {
    if (cevapVerildi) return;
    cevapVerildi = true;
    var dogruMu = metin === q.dogru;
    if (dogruMu) dogru++;
    else yanlislar.push({ q: q, verilen: metin });

    [].forEach.call(elSiklar.children, function (d) {
      d.disabled = true;
      var yazi = d.querySelector('.ti-yazi').textContent;
      if (yazi === q.dogru) d.classList.add('dogru');
      else if (d === dugme) d.classList.add('yanlis');
    });

    elPuan.textContent = (dogru * PUAN) + ' puan';
    elDolu.style.width = ((adim + 1) / sorular.length * 100) + '%';
    elAcikla.innerHTML =
      '<span class="ti-ac-bas">' + (dogruMu ? 'Doğru — ' : 'Doğrusu: ') + q.dogru + '</span>' +
      (q.sahne.acikla || '') +
      (q.sahne.tr ? '<br><span style="color:#8A94A3">' + q.sahne.tr + '</span>' : '');
    elAcikla.hidden = false;
    elSonraki.hidden = false;
    elSonraki.textContent = (adim < sorular.length - 1) ? 'Sonraki ❯' : 'Sonucu gör ❯';
  }

  function sonraki() {
    if (!cevapVerildi) return;
    if (adim < sorular.length - 1) { adim++; soruCiz(); return; }
    sonucCiz();
  }

  function sonucCiz() {
    var puan = Math.round(dogru / sorular.length * 100);
    /* Görev köprüsüne tur başına BİR kez rapor. Öğrenci öğretmenine
       bağlı değilse köprü sessizce yok sayar. */
    if (!bildirildi) {
      bildirildi = true;
      try {
        if (window.KidefGorev && KidefGorev.aktif) {
          KidefGorev.bildir({
            dogru: dogru, toplam: sorular.length, mod: 'irab',
            detay: turNo + '. i\'rab turu · ' +
                   (kip === 'hepsi' ? 'karışık' : kip) + ' soruları',
            sureSn: turBas ? Math.round((Date.now() - turBas) / 1000) : null
          });
        }
      } catch (e) { }
    }
    elSkor.textContent = puan;
    elHalka.style.setProperty('--yuzde', puan);
    elMesaj.textContent =
      puan === 100 ? 'Tam isabet!' :
      puan >= 80  ? 'Çok iyi!' :
      puan >= 60  ? 'İyi gidiyorsun.' :
      puan >= 40  ? 'Tabloları bir kez daha gözden geçirelim.' :
                    'Önce Tablolar ve Örnekler bölümüne bakalım.';
    elOzet.textContent = sorular.length + ' sorudan ' + dogru + ' doğru.';

    if (!yanlislar.length) {
      elYanlis.innerHTML = '';
    } else {
      elYanlis.innerHTML = '<p class="ti-ozet" style="margin:0 0 4px">Yanlış yaptıkların:</p>' +
        yanlislar.map(function (y) {
          var v = vurgula(y.q.sahne.ar, y.q.sahne.hedef);
          return '<div class="ti-yanlis">' +
            '<span class="ti-y-ar" dir="rtl">' + v.html + '</span>' +
            '<span class="ti-y-sat">Senin cevabın: <span class="ti-y-yanlis">' + y.verilen + '</span>' +
            ' · Doğrusu: <span class="ti-y-dogru">' + y.q.dogru + '</span></span>' +
            '<span class="ti-y-sat">' + (y.q.sahne.acikla || '') + '</span>' +
          '</div>';
        }).join('');
    }
    ekran('sonuc');
  }

  function basla() {
    turKur();
    if (!sorular.length) return;
    turNo++; turBas = Date.now(); bildirildi = false;
    ekran('soru');
    soruCiz();
  }

  /* ---------- olaylar ---------- */
  elSecim.addEventListener('click', function (e) {
    var d = e.target.closest ? e.target.closest('.ti-sec') : null;
    if (!d) return;
    kip = d.getAttribute('data-kip');
    [].forEach.call(elSecim.querySelectorAll('.ti-sec'), function (x) {
      x.classList.toggle('aktif', x === d);
    });
    havuzYaz();
  });
  elBasla.addEventListener('click', basla);
  elTekrar.addEventListener('click', basla);
  elSonraki.addEventListener('click', sonraki);
  elOrnek.addEventListener('click', function () {
    ekran('acilis');
    if (window.tcBolumAc) window.tcBolumAc('havuz');
  });

  havuzYaz();
  ekran('acilis');
  window.tcIrabTest = { basla: basla, havuzYaz: havuzYaz };
})();

/* ==================== 4) EFÂL-İ HAMSE — CANLI TABLO ==================== */
/* ============================================================
   EFÂL-İ HAMSE (BEŞ FİİL)
   ------------------------------------------------------------
   "Merfuda nûn durur, mansub ve meczumda düşer" cümlesi doğru ama
   soyut. Burada öğrenci hâli KENDİSİ değiştiriyor ve nûnun düşüşünü
   görüyor: eski son aşağı kayıp söner, yeni son yerine oturur.

   Tablo muzari fiilin tam çekim ızgarası: 5 kişi (gâib · gâibe ·
   muhâtab · muhâtaba · mütekellim) × 3 sayı (tekil · ikil · çoğul)
   = 15 kutu. Kutuların içinde yalnız fiil var; adlar kenarda başlık.
   Beş fiilin hangi kutulara düştüğü renkle görünür — "hangi çekim nûn
   alır" sorusunun cevabı tablonun kendisidir.

   Mansub ve meczumda seçilen edat tablodaki HER fiilin başına gelir;
   edat oklarla değişir. Böylece öğrenci "لَنْ gelince ne oluyor,
   لَمْ gelince ne oluyor" sorusunu tek tabloda deniyor.

   Alttaki tek satırlık örnek oklarla kişiler arasında gezer ve
   tabloda o satırı vurgular; cümle ile çekim arasındaki bağ görünür
   kalsın diye. HİÇBİR ŞEY KENDİLİĞİNDEN OYNAMAZ: her değişim bir
   dokunuşun sonucudur.

   Özneler zamir seçildi (هُوَ، أَنْتِ، هُمْ …). Sebep dil bilgisel:
   açık isim özne olsaydı "fiil başta tekil kalır" kuralı yüzünden
   çoğul çekimi cümlede gösteremezdik.
   ============================================================ */
(function () {
  var panel = document.querySelector('.tc-tablo-panel[data-panel="hamse"]');
  if (!panel) return;

  var elHal      = document.getElementById('efhHal');
  var elEdat     = document.getElementById('efhEdat');
  var elEdatAd   = document.getElementById('efhEdatAd');
  var elEdatListe = document.getElementById('efhEdatListe');
  var elNot      = document.getElementById('efhNot');
  var elGovde    = document.getElementById('efhGovde');
  var elOrnekAr  = document.getElementById('efhOrnekAr');
  var elOrnekTr  = document.getElementById('efhOrnekTr');
  var elOrnekKisi= document.getElementById('efhOrnekKisi');

  /* ---------- Türkçe çekim kalıpları ----------
     Dört kişi tipi yeter: o · sen · onlar · siz. İkil Türkçede
     çoğulla aynı çekimi aldığı için ayrı kalıp yazılmadı. */
  var TR = {
    o:     { simdi:'yazıyor',      lan:'asla yazmayacak',       an:'yazması',
             kay:'yazması için',   hatta:'yazıncaya kadar',     lem:'yazmadı',
             lemma:'henüz yazmadı',la:'yazmasın',               lam:'yazsın' },
    sen:   { simdi:'yazıyorsun',   lan:'asla yazmayacaksın',    an:'yazman',
             kay:'yazman için',    hatta:'yazıncaya kadar',     lem:'yazmadın',
             lemma:'henüz yazmadın', la:'yazma',                lam:'yaz' },
    onlar: { simdi:'yazıyorlar',   lan:'asla yazmayacaklar',    an:'yazmaları',
             kay:'yazmaları için', hatta:'yazıncaya kadar',     lem:'yazmadılar',
             lemma:'henüz yazmadılar', la:'yazmasınlar',        lam:'yazsınlar' },
    siz:   { simdi:'yazıyorsunuz', lan:'asla yazmayacaksınız',  an:'yazmanız',
             kay:'yazmanız için',  hatta:'yazıncaya kadar',     lem:'yazmadınız',
             lemma:'henüz yazmadınız', la:'yazmayın',           lam:'yazın' },
    ben:   { simdi:'yazıyorum',    lan:'asla yazmayacağım',     an:'yazmam',
             kay:'yazmam için',    hatta:'yazıncaya kadar',     lem:'yazmadım',
             lemma:'henüz yazmadım', la:'yazmayayım',           lam:'yazayım' },
    biz:   { simdi:'yazıyoruz',    lan:'asla yazmayacağız',     an:'yazmamız',
             kay:'yazmamız için',  hatta:'yazıncaya kadar',     lem:'yazmadık',
             lemma:'henüz yazmadık', la:'yazmayalım',           lam:'yazalım' }
  };

  /* ---------- 15 kutu: 5 kişi × 3 sayı ----------
     govde : hiç değişmeyen kısım
     son   : hâle göre değişen son (animasyon yalnız buna uygulanır)
     tur   : harf (beş fiil) · hareke · mebni
     Not: تَفْعَلَانِ üç satırda birden geçer; kalıp olarak beş fiil
     BEŞTİR ama tabloda nûn taşıyan yedi kutu vardır. */
  var SATIR = [
    { ad:'Gâib', alt:'o (eril)', hucre:[
      { govde:'يَكْتُب',  son:{merfu:'ُ', mansub:'َ', meczum:'ْ'},     tur:'hareke', zamir:'هُوَ',      zamirTr:'O',          trK:'o' },
      { govde:'يَكْتُبَ', son:{merfu:'انِ', mansub:'ا', meczum:'ا'},   tur:'harf',   zamir:'هُمَا',     zamirTr:'O ikisi',    trK:'onlar' },
      { govde:'يَكْتُبُ', son:{merfu:'ونَ', mansub:'وا', meczum:'وا'}, tur:'harf',   zamir:'هُمْ',      zamirTr:'Onlar',      trK:'onlar' }
    ]},
    { ad:'Gâibe', alt:'o (dişil)', hucre:[
      /* تَكْتُبُ gâibe ile muhâtabda birdir → iki satırı kaplayan tek kutu. */
      { govde:'تَكْتُب',  son:{merfu:'ُ', mansub:'َ', meczum:'ْ'},     tur:'hareke', zamir:'أَنْتَ',    zamirTr:'Sen',        trK:'sen',
        kapsar:2, adOzel:'Gâibe · Muhâtab', altOzel:'tekil — ikisinde aynı' },
      /* تَكْتُبَانِ üç kişide birdir (gâibe · muhâtab · muhâtaba ikilleri);
         üç kutu yerine TEK kutu (rowspan) — böylece nûn taşıyan kutu
         sayısı beşe iner ve "beş fiil" adıyla örtüşür. */
      { govde:'تَكْتُبَ', son:{merfu:'انِ', mansub:'ا', meczum:'ا'},   tur:'harf',   zamir:'أَنْتُمَا', zamirTr:'Siz ikiniz', trK:'siz',
        kapsar:3, adOzel:'Gâibe · Muhâtab · Muhâtaba', altOzel:'ikil — üçünde aynı' },
      { govde:'يَكْتُبْ', son:{merfu:'نَ', mansub:'نَ', meczum:'نَ'},   tur:'mebni',  zamir:'هُنَّ',     zamirTr:'Onlar',      trK:'onlar' }
    ]},
    { ad:'Muhâtab', alt:'sen (eril)', hucre:[
      { atla:true },
      { atla:true },
      { govde:'تَكْتُبُ', son:{merfu:'ونَ', mansub:'وا', meczum:'وا'}, tur:'harf',   zamir:'أَنْتُمْ',  zamirTr:'Siz',        trK:'siz' }
    ]},
    { ad:'Muhâtaba', alt:'sen (dişil)', hucre:[
      { govde:'تَكْتُبِ', son:{merfu:'ينَ', mansub:'ي', meczum:'ي'},   tur:'harf',   zamir:'أَنْتِ',    zamirTr:'Sen',        trK:'sen' },
      { atla:true },
      { govde:'تَكْتُبْ', son:{merfu:'نَ', mansub:'نَ', meczum:'نَ'},   tur:'mebni',  zamir:'أَنْتُنَّ', zamirTr:'Siz',        trK:'siz' }
    ]},
    { ad:'Mütekellim', alt:'ben / biz', hucre:[
      { govde:'أَكْتُب',  son:{merfu:'ُ', mansub:'َ', meczum:'ْ'},     tur:'hareke', zamir:'أَنَا',     zamirTr:'Ben',        trK:'ben' },
      /* نَكْتُبُ ikil ile çoğulda birdir → iki sütunu kaplayan tek kutu. */
      { govde:'نَكْتُب',  son:{merfu:'ُ', mansub:'َ', meczum:'ْ'},     tur:'hareke', zamir:'نَحْنُ',    zamirTr:'Biz',        trK:'biz',
        yatayKapsar:2, altOzel:'ikil · çoğul — aynı' },
      { atla:true }
    ]}
  ];
  var SAYI_AD = ['Tekil', 'İkil', 'Çoğul'];
  /* Yan tablolar — ikisi de MEBNÎ, hâl/edat onlara işlemez.
     Emir yalnız muhâtab ve muhâtabada çekilir; kalan 9 kutu — (tire). */
  /* Yan tablolar — ikisi de MEBNÎ. Aynı formlar ORTAK kutuda:
     rs = rowspan (alt satırı da kaplar), cs = colspan (yan sütunu da),
     atla = kaplanan yer, t = tire (çekimi olmayan kişi). */
  var MAZI_TABLO = [
    [{m:'كَتَبَ'},   {m:'كَتَبَا'},           {m:'كَتَبُوا'}],
    [{m:'كَتَبَتْ'}, {m:'كَتَبَتَا'},         {m:'كَتَبْنَ'}],
    [{m:'كَتَبْتَ'}, {m:'كَتَبْتُمَا', rs:2}, {m:'كَتَبْتُمْ'}],
    [{m:'كَتَبْتِ'}, {atla:true},            {m:'كَتَبْتُنَّ'}],
    [{m:'كَتَبْتُ'}, {m:'كَتَبْنَا', cs:2},   {atla:true}]
  ];
  var EMIR_TABLO = [
    [{t:1}, {t:1}, {t:1}],
    [{t:1}, {t:1}, {t:1}],
    [{m:'اُكْتُبْ'},  {m:'اُكْتُبَا', rs:2}, {m:'اُكْتُبُوا'}],
    [{m:'اُكْتُبِي'}, {atla:true},          {m:'اُكْتُبْنَ'}],
    [{t:1}, {t:1}, {t:1}]
  ];
  var KUTU = [];
  SATIR.forEach(function (sr, si) {
    sr.hucre.forEach(function (h, hi) {
      if (h.atla) return;   /* birleşik kutunun kapladığı yerler */
      KUTU.push({ h:h, si:si, hi:hi, ad:h.adOzel || sr.ad, alt:h.altOzel || SAYI_AD[hi] });
    });
  });

  /* ---------- edatlar ----------
     bitisik : fiile bitişik yazılan edat (lâm)
     kalip   : örnek cümle kalıbı — {Z} zamir, {F} fiil
     trKalip : Türkçe kalıp — {ZT} zamirin Türkçesi, {V} kişiye göre fiil */
  var EDAT = {
    merfu: [
      { ar:'', tr:'edatsız', anahtar:'simdi',
        kalip:'{Z} {F} الدَّرْسَ.', trKalip:'{ZT} dersi {V}.',
        not:'Muzari fiilin <b>aslı merfudur</b>: başında nasb ya da cezm edatı yoksa merfu okunur. Beş fiilde alâmet <b>nûnun durmasıdır</b>.' }
    ],
    mansub: [
      { ar:'لَنْ', tr:'asla …mayacak', anahtar:'lan',
        kalip:'{Z} لَنْ {F} الدَّرْسَ.', trKalip:'{ZT} dersi {V}.',
        not:'<b>لَنْ</b> gelecek zamanı kesin olarak olumsuzlar; fiili <b>mansub</b> yapar.' },
      { ar:'أَنْ', tr:'…ması', anahtar:'an',
        kalip:'يَجِبُ أَنْ {F} الدَّرْسَ.', trKalip:'{ZT2} dersi {V} gerekir.',
        not:'<b>أَنْ</b> masdar edatıdır: fiili isme çevirir ve <b>mansub</b> yapar.' },
      { ar:'كَيْ', tr:'…mak için', anahtar:'kay',
        kalip:'… كَيْ {F} الدَّرْسَ.', trKalip:'… dersi {V}.',
        not:'<b>كَيْ</b> sebep bildirir: “…mak için”. Fiili <b>mansub</b> yapar.' },
      { ar:'حَتَّى', tr:'…ıncaya kadar', anahtar:'hatta',
        kalip:'… حَتَّى {F} الدَّرْسَ.', trKalip:'… dersi {V}.',
        not:'<b>حَتَّى</b> gaye bildirir: “…ıncaya kadar”. Fiili <b>mansub</b> yapar.' }
    ],
    meczum: [
      { ar:'لَمْ', tr:'…madı', anahtar:'lem',
        kalip:'{Z} لَمْ {F} الدَّرْسَ.', trKalip:'{ZT} dersi {V}.',
        not:'<b>لَمْ</b> muzari fiili <b>geçmiş zamanda olumsuzlar</b> ve <b>meczum</b> yapar.' },
      { ar:'لَمَّا', tr:'henüz …madı', anahtar:'lemma',
        kalip:'{Z} لَمَّا {F} الدَّرْسَ.', trKalip:'{ZT} dersi {V}.',
        not:'<b>لَمَّا</b> “henüz olmadı, ama beklenir” anlamı katar; fiili <b>meczum</b> yapar.' },
      { ar:'لَا', tr:'…masın (nehiy)', anahtar:'la',
        kalip:'لَا {F} الدَّرْسَ!', trKalip:'{ZT} dersi {V}!',
        not:'Nehiy <b>لَا</b>’sı yasaklama bildirir; fiili <b>meczum</b> yapar. Olumsuzluk لَا’sıyla karıştırma — o cezm etmez.' },
      { ar:'لِـ', tr:'…sın (emir)', anahtar:'lam', bitisik:true,
        kalip:'لِ{F} الدَّرْسَ.', trKalip:'{ZT} dersi {V}.',
        not:'Emir <b>lâm</b>ı fiile <b>bitişik</b> yazılır ve onu <b>meczum</b> yapar.' }
    ]
  };

  var ALAMET = {
    harf:   { merfu:'Nûn durur',    mansub:'Nûn düşer',     meczum:'Nûn düşer' },
    hareke: { merfu:'Zamme (ötre)', mansub:'Fetha (üstün)', meczum:'Sükûn' },
    mebni:  { merfu:'mahallen merfu', mansub:'mahallen mansub', meczum:'mahallen meczum' }
  };

  /* ARAPÇA BİTİŞİKLİĞİ.
     Fiili "gövde + son" diye iki span'e bölünce tarayıcı iki ayrı metin
     kutusu görüyor ve harfler birbirine BAĞLANMIYOR: تَكْتُبِينَ,
     تَكْتُبِ ينَ gibi kopuk çıkıyordu. İki çözüm birlikte kullanıldı:
       • duruş hâlinde kelime TEK metin düğümü olarak yazılıyor —
         şekillendirme kusursuz;
       • yalnız animasyon anında bölünüyor ve iki parçanın arasına
         ZWJ (U+200D) konuyor, böylece o anda da bitişik görünüyor.
     Animasyon biter bitmez hücre yeniden tek parça hâlinde çiziliyor. */
  var ZWJ = '\u200D';
  function harfMi(x) { return /^[\u0621-\u064A\u0671-\u06D3]/.test(x); }

  /* İlk açılışta seçili kutu tablonun İLK fiili: Gâib · Tekil يَكْتُبُ */
  var hal = 'merfu', edatNo = 0, kutuNo = 0, oncekiHal = null, fiilSecili = 'muzari';
  var edatBekleniyor = false;   /* mansub/meczumda dönüşüm, EDAT seçilince başlar */

  function edatSimdi() { return EDAT[hal][edatNo] || EDAT[hal][0]; }

  /* ---------- tablo ----------
     ETKİLEŞİMLİ AKIŞ: hâl değişince yalnız İLK fiil kendiliğinden
     dönüşür (merfuya dönüşte: SON fiil). Kalanlar eski hâlleriyle
     bekler ve DOKUNULDUKÇA tek tek dönüşür — öğrenci animasyonu kutu
     kutu kendi eliyle yaşar. İlk dönüşüm bitince bekleyen kutular
     altın bir nabızla "bana dokun" der. Bütün kutular dönüşünce nûn
     taşıyan beş fiil mavi bir parıltıyla vurgulanır: sonunda HARF
     değişenler bunlardı. Aynı hâl kutusuna ikinci basış her şeyi
     bitirir; edat seçimi de tabloyu tamamlar. */
  var EDAT_SURE = 1300;  /* edatın gelişi */
  var CIK_SURE  = 800;   /* edatın gidişi */
  var SON_BAS   = 1500;  /* son, edat yerleştikten sonra değişmeye başlar */
  var SON_SURE  = 1900;  /* eski düşer, yeni oturur */
  var HIZLI_ADIM = 160;  /* edat dalgasında kutular arası kayma */
  var zamanlar = [];
  function zamanTemizle() {
    zamanlar.forEach(function (z) { window.clearTimeout(z); });
    zamanlar = [];
  }
  function bekle(fn, ms) { zamanlar.push(window.setTimeout(fn, ms)); }

  var bekleyenler = null;  /* {kutuNo:true} — hâl değişiminde dokunulmayı bekleyenler */
  var akisEski = null;     /* bekleyen kutuların ekrandaki eski hâli {hal, edat} */

  /* Kelimeyi yaz. eskiSon verilirse iki parçalı (animasyonlu) yazım;
     verilmezse tek metin düğümü — harfler doğal olarak bitişir.
     HAREKE SONLARI: yalın hareke çizilemez; son harf de animasyona
     katılır: بُ düşer, بَ oturur — hareke hep harfinin üstünde kalır. */
  function kelimeYaz(el, h, halX, eskiSon) {
    var yeniSon = h.son[halX];
    if (!eskiSon) { el.textContent = h.govde + yeniSon; return; }
    var govde = h.govde, ePar = eskiSon, yPar = yeniSon;
    if (!harfMi(yeniSon)) {
      var sonHarf = govde.slice(-1);
      govde = govde.slice(0, -1);
      ePar = sonHarf + eskiSon;
      yPar = sonHarf + yeniSon;
    }
    var bag = harfMi(yPar) ? ZWJ : '';
    el.innerHTML =
      '<span class="efh-govde">' + govde + bag + '</span>' +
      '<span class="efh-son">' +
        '<span class="efh-eski">' + (harfMi(ePar) ? ZWJ : '') + ePar + '</span>' +
        '<span class="efh-yeni efh-gel">' + bag + yPar + '</span>' +
      '</span>';
  }

  function edatYaz(el, e, durum) {
    var b = (e && e.ar && e.bitisik) ? ' efh-bitisik' : '';
    el.className = 'efh-edat-ek' + b + (durum ? ' ' + durum : '');
    el.textContent = (e && e.ar) ? (e.bitisik ? 'لِ' : e.ar) : '';
  }

  function hucreTd(a) {
    return elGovde.querySelector('.efh-hucre[data-si="' + a.si + '"][data-hi="' + a.hi + '"]');
  }
  function hucreGez(fn) {
    KUTU.forEach(function (a, n) { fn(hucreTd(a), a.h, n); });
  }

  function lejantYaz() {
    var k = KUTU[kutuNo];
    document.getElementById('efhLejantNot').innerHTML =
      'Seçili kutu: <b>' + k.ad + ' · ' + k.alt + '</b> — alâmeti <b>' + ALAMET[k.h.tur][hal] + '</b>';
  }

  function secimGuncelle() {
    [].forEach.call(elGovde.querySelectorAll('.efh-hucre.efh-secili'), function (x) {
      x.classList.remove('efh-secili');
    });
    var td = hucreTd(KUTU[kutuNo]);
    if (td) td.classList.add('efh-secili');
    lejantYaz();
  }

  /* Duruş çizimi: verilen hâlin sonları + verilen edatla, tek parça. */
  function tabloCiz(gosterHal, edatObj) {
    elGovde.innerHTML = '';
    SATIR.forEach(function (sr, si) {
      var tr = document.createElement('tr');
      var html = '<td class="efh-satirbas">' + sr.ad + '<span>' + sr.alt + '</span></td>';
      sr.hucre.forEach(function (h, hi) {
        if (h.atla) return;   /* birleşik kutunun kapladığı yer */
        var secili = (KUTU[kutuNo].si === si && KUTU[kutuNo].hi === hi);
        html += '<td class="efh-hucre efh-t-' + h.tur + (secili ? ' efh-secili' : '') + '"' +
                (h.kapsar ? ' rowspan="' + h.kapsar + '"' : '') +
                (h.yatayKapsar ? ' colspan="' + h.yatayKapsar + '"' : '') +
                ' data-si="' + si + '" data-hi="' + hi + '"' +
                ' title="' + (h.adOzel || sr.ad) + ' · ' + (h.altOzel || SAYI_AD[hi]) + '">' +
                '<span class="efh-ic"><span class="efh-edat-ek"></span><span class="efh-kelime"></span></span></td>';
      });
      tr.innerHTML = html;
      elGovde.appendChild(tr);
    });
    hucreGez(function (td, h) {
      edatYaz(td.querySelector('.efh-edat-ek'), edatObj, '');
      kelimeYaz(td.querySelector('.efh-kelime'), h, gosterHal, '');
    });
    lejantYaz();
  }

  /* Bütün kutular dönüşünce: sonunda HARF değişen beş fiil parıldar. */
  function parlat() {
    bekle(function () {
      hucreGez(function (td, h) {
        if (h.tur === 'harf' && td) {
          td.classList.remove('efh-parla');
          void td.offsetWidth;
          td.classList.add('efh-parla');
        }
      });
    }, 80);
  }

  /* Bekleyen kutulara "bana dokun" nabzı. */
  function davetVer() {
    var k = 0;
    hucreGez(function (td, h, n) {
      if (bekleyenler && bekleyenler[n] && td) {
        td.style.setProperty('--dv', k++);
        td.classList.add('efh-davet');
      }
    });
  }

  /* Akışı kes, bugünkü hâli göster. Bekleyen varken kesildiyse
     tamamlanma vurgusu (beş fiil parıltısı) yine verilir. */
  function sonDurum() {
    zamanTemizle();
    var yarim = !!bekleyenler;
    bekleyenler = null; akisEski = null; edatBekleniyor = false;
    tabloCiz(hal, edatSimdi());
    if (yarim) parlat();
  }

  /* TEK kutunun dönüşümü: edat gelir/gider, sonra son değişir. */
  function hucreAnimasyon(n, ilkMi) {
    if (!bekleyenler || !bekleyenler[n] || !akisEski) return;
    delete bekleyenler[n];
    var a = KUTU[n], td = hucreTd(a);
    if (!td) return;
    td.classList.remove('efh-davet');
    var edatEl = td.querySelector('.efh-edat-ek');
    var kelEl  = td.querySelector('.efh-kelime');
    var e = edatSimdi();
    var eskiSon = a.h.son[akisEski.hal], yeniSon = a.h.son[hal];
    var eskiAr = akisEski.edat && akisEski.edat.ar, yeniAr = e.ar;

    if (!eskiAr && yeniAr) {                          /* merfu → : edat gelir */
      bekle(function () { edatYaz(edatEl, e, 'efh-gir'); }, 0);
    } else if (eskiAr && !yeniAr) {                   /* → merfu : edat gider */
      bekle(function () { edatEl.classList.add('efh-cik'); }, 0);
      bekle(function () { edatYaz(edatEl, null, ''); }, CIK_SURE);
    } else if (eskiAr && yeniAr && eskiAr !== yeniAr) {    /* mansub ↔ meczum */
      bekle(function () { edatEl.classList.add('efh-cik'); }, 0);
      bekle(function () { edatYaz(edatEl, e, 'efh-gir'); }, CIK_SURE);
    }
    var sonDegisir = (eskiSon !== yeniSon);
    if (sonDegisir) {
      bekle(function () { kelimeYaz(kelEl, a.h, hal, eskiSon); }, SON_BAS);
      bekle(function () { kelimeYaz(kelEl, a.h, hal, ''); }, SON_BAS + SON_SURE);
    }
    var bitis = sonDegisir ? (SON_BAS + SON_SURE) : (EDAT_SURE + 200);
    bekle(function () {
      if (n === kutuNo || ilkMi) ornekCiz(true);
      if (ilkMi) davetVer();
      if (bekleyenler && !Object.keys(bekleyenler).length) {
        bekleyenler = null; akisEski = null;
        parlat();
      }
    }, bitis + 80);
  }

  /* Hâl değişimi: İLK fiil kendiliğinden (merfuya dönüşte SON fiil),
     kalanlar dokunuldukça. */
  function halAkis(eskiHal, eskiEdat) {
    zamanTemizle();
    edatBekleniyor = false;
    tabloCiz(eskiHal, eskiEdat);
    bekleyenler = {};
    KUTU.forEach(function (x, n) { bekleyenler[n] = true; });
    akisEski = { hal: eskiHal, edat: eskiEdat };
    if (hal === 'merfu') { hucreAnimasyon(KUTU.length - 1, true); return; }
    /* Mansub/Meczum: hiçbir şey kendiliğinden başlamaz — önce EDAT
       seçilir; ilk dönüşüm, öğrencinin seçtiği edatla başlar. */
    edatBekleniyor = true;
    edatCiz();
  }

  /* Yalnız edat değişimi: tablo tamamlanır, edat hızlı dalgayla yenilenir. */
  function edatAkis(eskiEdat) {
    zamanTemizle();
    bekleyenler = null; akisEski = null; edatBekleniyor = false;
    var e = edatSimdi();
    tabloCiz(hal, eskiEdat);
    hucreGez(function (td, h, n) {
      var t0 = n * HIZLI_ADIM;
      var edatEl = td.querySelector('.efh-edat-ek');
      bekle(function () { edatEl.classList.add('efh-cik'); }, t0);
      bekle(function () { edatYaz(edatEl, e, 'efh-gir'); }, t0 + 700);
    });
    ornekCiz(true);
  }

  /* ---------- örnek satırı ---------- */
  function ornekCiz(tazele) {
    var k = KUTU[kutuNo], h = k.h, e = edatSimdi();
    var fiil = '<span class="efh-vurgu">' + h.govde + h.son[hal] + '</span>';
    var ar = e.kalip.replace('{Z}', h.zamir).replace('{F}', fiil);
    var v = (TR[h.trK] || TR.o)[e.anahtar] || '';
    var iyelik = { 'O':'Onun', 'O ikisi':'O ikisinin', 'Onlar':'Onların', 'Sen':'Senin',
                   'Siz ikiniz':'İkinizin', 'Siz':'Sizin', 'Ben':'Benim', 'Biz':'Bizim' };
    var trc = e.trKalip
      .replace('{ZT}', h.zamirTr)
      .replace('{ZT2}', iyelik[h.zamirTr] || h.zamirTr)
      .replace('{V}', v);
    elOrnekAr.innerHTML = ar;
    elOrnekTr.textContent = trc;
    elOrnekKisi.textContent = '· ' + k.ad + ' · ' + k.alt;
    if (tazele) {
      var ic = elOrnekAr.parentNode;
      ic.classList.remove('efh-tazele');
      void ic.offsetWidth;
      ic.classList.add('efh-tazele');
    }
  }

  function edatCiz() {
    var liste = EDAT[hal];
    var cok = liste.length > 1;
    elEdat.hidden = !cok || fiilSecili !== 'muzari';
    elEdatAd.textContent = hal === 'mansub' ? 'Nasb edatları' : 'Cezm edatları';
    if (cok) {
      elEdatListe.classList.toggle('efh-sec-bekle', edatBekleniyor);
      elEdatListe.innerHTML = '';
      liste.forEach(function (e2, k) {
        var d = document.createElement('button');
        d.type = 'button';
        var aktif = !edatBekleniyor && k === edatNo;
        d.className = 'efh-edat-sec' + (aktif ? ' aktif' : '');
        d.setAttribute('data-edat-no', k);
        d.setAttribute('role', 'tab');
        d.setAttribute('aria-selected', aktif ? 'true' : 'false');
        d.innerHTML = '<b dir="rtl">' + e2.ar + '</b><small>' + e2.tr + '</small>';
        elEdatListe.appendChild(d);
      });
    }
    elNot.innerHTML = edatBekleniyor
      ? 'Önce bir <b>edat seç</b> — dönüşüm, seçtiğin edatla <b>ilk fiilde</b> başlar; kalan fiillere sen dokunursun.'
      : edatSimdi().not;
  }

  function ciz(mod, eskiHal, eskiEdat) {
    edatCiz();
    if (mod === 'hal') halAkis(eskiHal, eskiEdat);
    else if (mod === 'edat') edatAkis(eskiEdat);
    else { sonDurum(); ornekCiz(false); }
    oncekiHal = hal;
  }

  /* ---------- olaylar ---------- */
  elHal.addEventListener('click', function (ev) {
    var d = ev.target.closest ? ev.target.closest('.efh-h') : null;
    if (!d) return;
    var yeni = d.getAttribute('data-hal');
    [].forEach.call(elHal.querySelectorAll('.efh-h'), function (x) {
      var s = x === d;
      x.classList.toggle('aktif', s);
      x.setAttribute('aria-selected', s ? 'true' : 'false');
    });
    if (yeni === hal) { ciz(); return; }   /* aynı hâle ikinci basış: akışı keser */
    var eskiHalDeger = hal, eskiEdatDeger = edatSimdi();
    hal = yeni; edatNo = 0;
    ciz('hal', eskiHalDeger, eskiEdatDeger);
  });

  panel.addEventListener('click', function (ev) {
    var d = ev.target.closest ? ev.target.closest('.efh-ok, .efh-edat-sec') : null;
    if (!d) return;
    if (d.hasAttribute('data-edat-no')) {
      var no = parseInt(d.getAttribute('data-edat-no'), 10);
      if (edatBekleniyor) {
        /* İlk seçim: animasyonu bu edat başlatır. */
        edatNo = no;
        edatBekleniyor = false;
        edatCiz();
        hucreAnimasyon(0, true);
        return;
      }
      if (no === edatNo) return;
      var eskiEdatDeger2 = edatSimdi();
      edatNo = no;
      ciz('edat', null, eskiEdatDeger2);
      return;
    }
    if (d.hasAttribute('data-ornek')) {
      kutuNo = (kutuNo + parseInt(d.getAttribute('data-ornek'), 10) + KUTU.length) % KUTU.length;
      secimGuncelle();
      if (edatBekleniyor) return;
      if (bekleyenler && bekleyenler[kutuNo]) hucreAnimasyon(kutuNo, false);
      else ornekCiz(true);
    }
  });

  /* Kutuya dokunmak: bekleyen kutuysa DÖNÜŞÜMÜNÜ başlatır (animasyon
     dokunarak yaşanır), dönüşmüş kutuysa yalnız örneği oraya taşır. */
  elGovde.addEventListener('click', function (ev) {
    var td = ev.target.closest ? ev.target.closest('.efh-hucre') : null;
    if (!td) return;
    var si = +td.getAttribute('data-si'), hi = +td.getAttribute('data-hi');
    for (var i = 0; i < KUTU.length; i++) {
      if (KUTU[i].si === si && KUTU[i].hi === hi) { kutuNo = i; break; }
    }
    secimGuncelle();
    if (edatBekleniyor) return;          /* önce edat: kutular edat seçilince açılır */
    if (bekleyenler && bekleyenler[kutuNo]) hucreAnimasyon(kutuNo, false);
    else ornekCiz(true);
  });

  /* Yan tablolar bir kez kurulur: aynı veriden (MAZI_TABLO / EMIR_TABLO),
     muzariyle aynı boy puntoda. */
  (function yanTablolariKur() {
    var m = document.getElementById('efhMaziGovde');
    var em = document.getElementById('efhEmirGovde');
    SATIR.forEach(function (sr, si) {
      var bas = '<td class="efh-satirbas">' + sr.ad + '<span>' + sr.alt + '</span></td>';
      function yanHtml(h) {
        if (h.atla) return '';
        return '<td class="efh-b"' + (h.rs ? ' rowspan="' + h.rs + '"' : '') +
               (h.cs ? ' colspan="' + h.cs + '"' : '') + '>' +
               (h.t ? '<span class="efh-tire">—</span>' : h.m) + '</td>';
      }
      var r1 = bas, r2 = bas;
      MAZI_TABLO[si].forEach(function (x) { r1 += yanHtml(x); });
      EMIR_TABLO[si].forEach(function (x) { r2 += yanHtml(x); });
      m.insertAdjacentHTML('beforeend', '<tr>' + r1 + '</tr>');
      em.insertAdjacentHTML('beforeend', '<tr>' + r2 + '</tr>');
    });
  })();

  /* Fiil tablosu sekmeleri: üçü birden değil, seçilen TEK ve BÜYÜK. */
  var elFiiller = document.getElementById('efhFiiller');
  function fiilTabloSec(ad) {
    fiilSecili = ad;
    [].forEach.call(elFiiller.querySelectorAll('.efh-f'), function (x) {
      var sec = x.getAttribute('data-fiil') === ad;
      x.classList.toggle('aktif', sec);
      x.setAttribute('aria-selected', sec ? 'true' : 'false');
    });
    document.getElementById('efhTabloMuzari').hidden = ad !== 'muzari';
    document.getElementById('efhTabloMazi').hidden  = ad !== 'mazi';
    document.getElementById('efhTabloEmir').hidden  = ad !== 'emir';
    /* Hâl, edat, örnek ve ayrıntılar muzariye aittir; mebnî tablolarda
       anlamları yok — kafa karıştırmasınlar. */
    elHal.hidden = ad !== 'muzari';
    document.getElementById('efhOrnekBlok').hidden = ad !== 'muzari';
    document.getElementById('efhDetay').hidden = ad !== 'muzari';
    edatCiz();
  }
  elFiiller.addEventListener('click', function (ev) {
    var d = ev.target.closest ? ev.target.closest('.efh-f') : null;
    if (d) fiilTabloSec(d.getAttribute('data-fiil'));
  });

  ciz();
  fiilTabloSec('muzari');
  window.tcHamse = {
    halSec: function (h) {
      var d = elHal.querySelector('.efh-h[data-hal="' + h + '"]');
      if (d) d.click();
    },
    durum: function () { return { hal: hal, edat: edatSimdi().ar, fiil: fiilSecili, kutu: KUTU[kutuNo].ad + ' ' + KUTU[kutuNo].alt }; },
    fiilSec: fiilTabloSec
  };
})();
