/* =====================================================================
   SÖZLÜK SİMÜLASYONU — 5. SINIF VERİSİ            (üretilmiş dosya)
   ---------------------------------------------------------------------
   KAYNAK: muhadese/veri/5_*.js ders cümleleri. Arapça ELLE
   YAZILMADI; her cümlenin yanında geldiği ders ve sıra numarası yazılı.
   KÖK: üç harfli sarf kökü değil, SÖZLÜKTE ARANAN yalın biçim
   (ال atılır, bitişik zamir atılır, çoğul tekile döner, fiil maziye).
   SEVİYELER: bu sınıfın verisinde gerçekten geçen olgulara göre
   kuruldu; olgusu bulunmayan seviye açılmadı. İpuçları da o seviyenin
   KENDİ örnekleriyle yazıldı.
   ÜRETİCİ: /tmp/s_uret.js — çözümleyici /tmp/s_coz.js + /tmp/s_motor.js
   Ders verisi değişirse yeniden üretilmelidir.
   ===================================================================== */
window.SOZLUK_SINIF = window.SOZLUK_SINIF || {};
window.SOZLUK_SINIF["5"] = {
  sinif: 5,
  cumle: 60,
  kelime: 134,
  seviyeler: [
  {
    level: 1,
    anahtar: "al",
    hint: "<h3 dir=\"ltr\">Seviye 1 · <bdi class=\"ip-ar\">ال</bdi> takısı ve yalın isim</h3><p class=\"ip-sinif\" dir=\"ltr\">5. sınıf muhâdese cümlelerinden</p><ul><li>Vurgulanan kelimenin <b>sözlükte aranacak yalın hâlini</b> (harekesiz) yazın.</li><li>İsmin başındaki <b><bdi class=\"ip-ar\">ال</bdi></b> takısı atılır.</li><li>Zamir, işaret ismi ve özel adlar aranmaz: onlar <b>geçilir</b>.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">اَلْعِلْمُ</bdi> → <bdi class=\"ip-ar\"><b>علم</b></bdi> <i>(isim (ال takılı))</i></li><li><bdi class=\"ip-ar\">اَلْعائِلَةُ</bdi> → <bdi class=\"ip-ar\"><b>عائلة</b></bdi> <i>(isim (ال takılı))</i></li><li><bdi class=\"ip-ar\">اَلْبَيْتُ</bdi> → <bdi class=\"ip-ar\"><b>بيت</b></bdi> <i>(isim (ال takılı))</i></li></ul>",
    sentences: [
      { /* 5_1_2#16 */
        arabic: [
          { text: "نَعَمْ،", root: "نعم", category: "cevap harfi" },
          { text: "أَنا", root: "SKIP", category: "zamir" },
          { text: "طالِبٌ.", root: "طالب", category: "isim" }
        ],
        turkish: ["Evet,","ben","öğrenciyim."],
        turkishFull: "Evet, ben öğrenciyim."
      },
      { /* 5_1_2#17 */
        arabic: [
          { text: "لا،", root: "لا", category: "nefiy harfi" },
          { text: "أَنا", root: "SKIP", category: "zamir" },
          { text: "مُعَلِّمٌ.", root: "معلم", category: "isim" }
        ],
        turkish: ["Hayır,","ben","öğretmenim."],
        turkishFull: "Hayır, ben öğretmenim."
      },
      { /* 5_2_1#2 */
        arabic: [
          { text: "هَذا", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "كِتابٌ.", root: "كتاب", category: "isim" }
        ],
        turkish: ["Bu","bir kitaptır."],
        turkishFull: "Bu bir kitaptır."
      },
      { /* 5_2_1#4 */
        arabic: [
          { text: "هَذِهِ", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "حَقيبَةٌ.", root: "حقيبة", category: "isim" }
        ],
        turkish: ["Bu","bir çantadır."],
        turkishFull: "Bu bir çantadır."
      },
      { /* 5_2_1#6 */
        arabic: [
          { text: "نَعَمْ،", root: "نعم", category: "cevap harfi" },
          { text: "هَذا", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "مَقْعَدٌ.", root: "مقعد", category: "isim" }
        ],
        turkish: ["Evet,","bu","bir sıradır."],
        turkishFull: "Evet, bu bir sıradır."
      },
      { /* 5_2_1#7 */
        arabic: [
          { text: "لا،", root: "لا", category: "nefiy harfi" },
          { text: "هَذا", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "كُرْسِيٌّ.", root: "كرسي", category: "isim" }
        ],
        turkish: ["Hayır,","bu","bir sandalyedir."],
        turkishFull: "Hayır, bu bir sandalyedir."
      },
      { /* 5_2_1#9 */
        arabic: [
          { text: "لا،", root: "لا", category: "nefiy harfi" },
          { text: "هَذِهِ", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "قَلَمٌ.", root: "قلم", category: "isim" }
        ],
        turkish: ["Hayır,","bu","bir kalemdir."],
        turkishFull: "Hayır, bu bir kalemdir."
      },
      { /* 5_2_1#18 */
        arabic: [
          { text: "اَلْعِلْمُ", root: "علم", category: "isim (ال takılı)" },
          { text: "نافِعٌ.", root: "نافع", category: "isim (ism-i fâil)" }
        ],
        turkish: ["İlim","faydalıdır."],
        turkishFull: "İlim faydalıdır."
      },
      { /* 5_3_1#17 */
        arabic: [
          { text: "اَلْعائِلَةُ", root: "عائلة", category: "isim (ال takılı)" },
          { text: "أَوَّلًا.", root: "أولا", category: "zarf" }
        ],
        turkish: ["Aile","önce gelir."],
        turkishFull: "Aile önce gelir."
      },
      { /* 5_3_2#2 */
        arabic: [
          { text: "هُوَ", root: "SKIP", category: "zamir" },
          { text: "مُعَلِّمٌ.", root: "معلم", category: "isim" }
        ],
        turkish: ["O","öğretmendir."],
        turkishFull: "O öğretmendir."
      },
      { /* 5_3_2#4 */
        arabic: [
          { text: "هِيَ", root: "SKIP", category: "zamir" },
          { text: "مُعَلِّمَةٌ.", root: "معلمة", category: "isim (meslek · dişil)" }
        ],
        turkish: ["O","öğretmendir."],
        turkishFull: "O öğretmendir."
      },
      { /* 5_3_2#16 */
        arabic: [
          { text: "لا،", root: "لا", category: "nefiy harfi" },
          { text: "أَنا", root: "SKIP", category: "zamir" },
          { text: "مُوَظَّفٌ.", root: "موظف", category: "isim" }
        ],
        turkish: ["Hayır,","ben","memurum."],
        turkishFull: "Hayır, ben memurum."
      },
      { /* 5_3_3#8 */
        arabic: [
          { text: "اَلْبَيْتُ", root: "بيت", category: "isim (ال takılı)" },
          { text: "كَبيرٌ.", root: "كبير", category: "isim" }
        ],
        turkish: ["Ev","büyüktür."],
        turkishFull: "Ev büyüktür."
      },
      { /* 5_3_3#9 */
        arabic: [
          { text: "اَلْمَدْرَسَةُ", root: "مدرسة", category: "ال takılı · isim" },
          { text: "كَبيرَةٌ.", root: "كبير", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Okul","büyüktür."],
        turkishFull: "Okul büyüktür."
      },
      { /* 5_3_3#10 */
        arabic: [
          { text: "اَلْحَقيبَةُ", root: "حقيبة", category: "ال takılı · isim" },
          { text: "صَغيرَةٌ.", root: "صغير", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Çanta","küçüktür."],
        turkishFull: "Çanta küçüktür."
      },
      { /* 5_4_1#9 */
        arabic: [
          { text: "اَلصّالَةُ", root: "صالة", category: "isim (ال takılı)" },
          { text: "كَبيرَةٌ.", root: "كبير", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Salon","büyüktür."],
        turkishFull: "Salon büyüktür."
      },
      { /* 5_4_1#16 */
        arabic: [
          { text: "لا،", root: "لا", category: "nefiy harfi" },
          { text: "هَذِهِ", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "الحَمّامُ.", root: "حمام", category: "isim (ال takılı)" }
        ],
        turkish: ["Hayır,","bu","banyodur."],
        turkishFull: "Hayır, bu banyodur."
      },
      { /* 5_4_3#1 */
        arabic: [
          { text: "اَلْأَريكَةُ", root: "أريكة", category: "isim (ال takılı)" },
          { text: "جَديدَةٌ.", root: "جديد", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Koltuk","yenidir."],
        turkishFull: "Koltuk yenidir."
      },
      { /* 5_4_3#3 */
        arabic: [
          { text: "اَلْخِزانَةُ", root: "خزانة", category: "isim (ال takılı)" },
          { text: "قَديمَةٌ.", root: "قديم", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Dolap","eskidir."],
        turkishFull: "Dolap eskidir."
      },
      { /* 5_4_3#5 */
        arabic: [
          { text: "اَلْبَيْتُ", root: "بيت", category: "isim (ال takılı)" },
          { text: "نَظيفٌ.", root: "نظيف", category: "isim (sıfat)" }
        ],
        turkish: ["Ev","temizdir."],
        turkishFull: "Ev temizdir."
      },
      { /* 5_4_3#6 */
        arabic: [
          { text: "اَلْغُرْفَةُ", root: "غرفة", category: "isim (ال takılı)" },
          { text: "نَظيفَةٌ.", root: "نظيف", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Oda","temizdir."],
        turkishFull: "Oda temizdir."
      },
      { /* 5_4_3#7 */
        arabic: [
          { text: "اَلطّاوِلَةُ", root: "طاولة", category: "isim (ال takılı)" },
          { text: "وَسِخَةٌ.", root: "وسخ", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Masa","kirlidir."],
        turkishFull: "Masa kirlidir."
      },
      { /* 5_4_3#8 */
        arabic: [
          { text: "اَلسَّجّادَةُ", root: "سجادة", category: "isim (ال takılı)" },
          { text: "جَميلَةٌ.", root: "جميل", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Halı","güzeldir."],
        turkishFull: "Halı güzeldir."
      },
      { /* 5_4_3#14 */
        arabic: [
          { text: "لا،", root: "لا", category: "nefiy harfi" },
          { text: "هِيَ", root: "SKIP", category: "zamir" },
          { text: "وَسِخَةٌ.", root: "وسخ", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Hayır,","o","kirlidir."],
        turkishFull: "Hayır, o kirlidir."
      },
      { /* 5_4_4#14 */
        arabic: [
          { text: "صِفْرٌ،", root: "صفر", category: "isim" },
          { text: "واحِدٌ،", root: "واحد", category: "isim (sayı)" },
          { text: "اِثْنانِ.", root: "اثنان", category: "isim (sayı)" }
        ],
        turkish: ["Sıfır,","bir,","iki."],
        turkishFull: "Sıfır, bir, iki."
      }
    ]
  },
  {
    level: 2,
    anahtar: "zamir",
    hint: "<h3 dir=\"ltr\">Seviye 2 · Bitişik zamir ve harf-i cer</h3><p class=\"ip-sinif\" dir=\"ltr\">5. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyenin kuralları geçerlidir.</li><li>Kelimenin sonundaki <b>bitişik zamir</b> (<bdi class=\"ip-ar\">ـي، ـكَ، ـهُ، ـها، ـنا</bdi>) atılır.</li><li>Başa gelen <b>harf-i cer</b> (<bdi class=\"ip-ar\">بِـ، لِـ، كَـ</bdi>) kelimeden ayrılır; ama harf-i cer bir <b>zamire</b> bitişmişse birlikte aranır: <bdi class=\"ip-ar\">بِكَ</bdi> → <bdi class=\"ip-ar\">بك</bdi>.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">اِسْمي</bdi> → <bdi class=\"ip-ar\"><b>اسم</b></bdi> <i>(isim + bitişik zamir (ben))</i></li><li><bdi class=\"ip-ar\">صَديقي.</bdi> → <bdi class=\"ip-ar\"><b>صديق</b></bdi> <i>(isim + bitişik zamir (ben))</i></li><li><bdi class=\"ip-ar\">مَدْرَسَتي.</bdi> → <bdi class=\"ip-ar\"><b>مدرسة</b></bdi> <i>(isim + bitişik zamir (ben))</i></li></ul>",
    sentences: [
      { /* 5_1_2#12 */
        arabic: [
          { text: "اِسْمي", root: "اسم", category: "isim + bitişik zamir (ben)" },
          { text: "أَحْمَدُ.", root: "SKIP", category: "isim (özel · kişi)" }
        ],
        turkish: ["Adım","Ahmed'dir."],
        turkishFull: "Adım Ahmed'dir."
      },
      { /* 5_1_2#14 */
        arabic: [
          { text: "اِسْمي", root: "اسم", category: "isim + bitişik zamir (ben)" },
          { text: "زَيْنَبُ.", root: "SKIP", category: "isim (özel · kişi)" }
        ],
        turkish: ["Adım","Zeynep'tir."],
        turkishFull: "Adım Zeynep'tir."
      },
      { /* 5_1_2#19 */
        arabic: [
          { text: "هَذا", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "صَديقي.", root: "صديق", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Bu","benim arkadaşımdır."],
        turkishFull: "Bu benim arkadaşımdır."
      },
      { /* 5_2_1#15 */
        arabic: [
          { text: "هَذِهِ", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "مَدْرَسَتي.", root: "مدرسة", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Bu","benim okulumdur."],
        turkishFull: "Bu benim okulumdur."
      },
      { /* 5_2_1#16 */
        arabic: [
          { text: "هَذا", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "مَقْعَدي.", root: "مقعد", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Bu","benim sıramdır."],
        turkishFull: "Bu benim sıramdır."
      },
      { /* 5_2_2#2 */
        arabic: [
          { text: "الدَّفْتَرَ.", root: "دفتر", category: "isim (ال takılı)" },
          { text: "اِفْتَحي", root: "افتح", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["aç (kız).","Defteri"],
        turkishFull: "Defteri aç (kız)."
      },
      { /* 5_2_2#4 */
        arabic: [
          { text: "الحَقيبَةَ.", root: "حقيبة", category: "ال takılı · isim" },
          { text: "أَغْلِقي", root: "أغلق", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["kapat (kız).","Çantayı"],
        turkishFull: "Çantayı kapat (kız)."
      },
      { /* 5_2_2#13 */
        arabic: [
          { text: "هَذا", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "دَفْتَري.", root: "دفتر", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Bu","benim defterimdir."],
        turkishFull: "Bu benim defterimdir."
      },
      { /* 5_2_2#15 */
        arabic: [
          { text: "نَعَمْ،", root: "نعم", category: "cevap harfi" },
          { text: "هَذِهِ", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "مِمْحاتي.", root: "ممحاة", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Evet,","bu","benim silgimdir."],
        turkishFull: "Evet, bu benim silgimdir."
      },
      { /* 5_3_1#1 */
        arabic: [
          { text: "هَذِهِ", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "عائِلَتي.", root: "عائلة", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Bu","benim ailemdir."],
        turkishFull: "Bu benim ailemdir."
      },
      { /* 5_3_1#3 */
        arabic: [
          { text: "هُوَ", root: "SKIP", category: "zamir" },
          { text: "أَبي.", root: "أب", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["O","babamdır."],
        turkishFull: "O babamdır."
      },
      { /* 5_3_1#5 */
        arabic: [
          { text: "هِيَ", root: "SKIP", category: "zamir" },
          { text: "أُمّي.", root: "أم", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["O","annemdir."],
        turkishFull: "O annemdir."
      },
      { /* 5_3_1#7 */
        arabic: [
          { text: "اِسْمُهُ", root: "اسم", category: "isim + bitişik zamir (o)" },
          { text: "أَحْمَدُ.", root: "SKIP", category: "isim (özel · kişi)" }
        ],
        turkish: ["Onun adı","Ahmed'dir."],
        turkishFull: "Onun adı Ahmed'dir."
      },
      { /* 5_3_1#9 */
        arabic: [
          { text: "اِسْمُها", root: "اسم", category: "isim + bitişik zamir (o)" },
          { text: "مَرْيَمُ.", root: "SKIP", category: "isim (özel · kişi)" }
        ],
        turkish: ["Onun adı","Meryem'dir."],
        turkishFull: "Onun adı Meryem'dir."
      },
      { /* 5_3_1#10 */
        arabic: [
          { text: "هَذا", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "أَخي.", root: "أخ", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Bu","benim kardeşimdir."],
        turkishFull: "Bu benim kardeşimdir."
      },
      { /* 5_3_1#11 */
        arabic: [
          { text: "هَذِهِ", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "أُخْتي.", root: "أخت", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Bu","benim kız kardeşimdir."],
        turkishFull: "Bu benim kız kardeşimdir."
      },
      { /* 5_3_1#12 */
        arabic: [
          { text: "لي", root: "لي", category: "harf-i cer + bitişik zamir" },
          { text: "أَخٌ", root: "أخ", category: "isim" },
          { text: "وَأُخْتٌ.", root: "أخت", category: "atıf harfi + isim" }
        ],
        turkish: ["Benim","bir erkek kardeşim","ve bir kız kardeşim var."],
        turkishFull: "Benim bir erkek kardeşim ve bir kız kardeşim var."
      },
      { /* 5_3_2#5 */
        arabic: [
          { text: "أَبي", root: "أب", category: "isim + bitişik zamir (ben)" },
          { text: "مُهَنْدِسٌ.", root: "مهندس", category: "isim" }
        ],
        turkish: ["Babam","mühendistir."],
        turkishFull: "Babam mühendistir."
      },
      { /* 5_3_2#6 */
        arabic: [
          { text: "أُمّي", root: "أم", category: "isim + bitişik zamir (ben)" },
          { text: "طَبيبَةٌ.", root: "طبيبة", category: "isim (meslek · dişil)" }
        ],
        turkish: ["Annem","doktordur."],
        turkishFull: "Annem doktordur."
      },
      { /* 5_3_2#7 */
        arabic: [
          { text: "أَخي", root: "أخ", category: "isim + bitişik zamir (ben)" },
          { text: "مُوَظَّفٌ.", root: "موظف", category: "isim" }
        ],
        turkish: ["Kardeşim","memurdur."],
        turkishFull: "Kardeşim memurdur."
      },
      { /* 5_3_2#8 */
        arabic: [
          { text: "أُخْتي", root: "أخت", category: "isim + bitişik zamir (ben)" },
          { text: "عامِلَةٌ.", root: "عاملة", category: "isim (meslek · dişil)" }
        ],
        turkish: ["Kız kardeşim","işçidir."],
        turkishFull: "Kız kardeşim işçidir."
      },
      { /* 5_3_2#9 */
        arabic: [
          { text: "جَدّي", root: "جد", category: "isim + bitişik zamir (ben)" },
          { text: "مُتَقاعِدٌ.", root: "متقاعد", category: "isim" }
        ],
        turkish: ["Dedem","emeklidir."],
        turkishFull: "Dedem emeklidir."
      },
      { /* 5_3_3#1 */
        arabic: [
          { text: "أَخي", root: "أخ", category: "isim + bitişik zamir (ben)" },
          { text: "الكَبيرُ.", root: "كبير", category: "isim (ال takılı)" }
        ],
        turkish: ["Benim","ağabeyim."],
        turkishFull: "Benim ağabeyim."
      },
      { /* 5_3_3#6 */
        arabic: [
          { text: "أَبي", root: "أب", category: "isim + bitişik zamir (ben)" },
          { text: "كَبيرٌ.", root: "كبير", category: "isim" }
        ],
        turkish: ["Babam","büyüktür."],
        turkishFull: "Babam büyüktür."
      },
      { /* 5_3_3#7 */
        arabic: [
          { text: "أُخْتي", root: "أخت", category: "isim + bitişik zamir (ben)" },
          { text: "صَغيرَةٌ.", root: "صغير", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Kız kardeşim","küçüktür."],
        turkishFull: "Kız kardeşim küçüktür."
      },
      { /* 5_3_3#11 */
        arabic: [
          { text: "عائِلَتي", root: "عائلة", category: "isim + bitişik zamir (ben)" },
          { text: "كَبيرَةٌ.", root: "كبير", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Ailem","büyüktür."],
        turkishFull: "Ailem büyüktür."
      },
      { /* 5_4_1#1 */
        arabic: [
          { text: "هَذا", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "بَيْتي.", root: "بيت", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Bu","benim evimdir."],
        turkishFull: "Bu benim evimdir."
      },
      { /* 5_4_1#2 */
        arabic: [
          { text: "بَيْتي", root: "بيت", category: "isim + bitişik zamir (ben)" },
          { text: "جَميلٌ.", root: "جميل", category: "isim" }
        ],
        turkish: ["Evim","güzeldir."],
        turkishFull: "Evim güzeldir."
      },
      { /* 5_4_3#9 */
        arabic: [
          { text: "بَيْتي", root: "بيت", category: "isim + bitişik zamir (ben)" },
          { text: "جَميلٌ.", root: "جميل", category: "isim" }
        ],
        turkish: ["Evim","güzeldir."],
        turkishFull: "Evim güzeldir."
      }
    ]
  },
  {
    level: 3,
    anahtar: "illetli",
    hint: "<h3 dir=\"ltr\">Seviye 3 · İlletli ve mezid fiiller</h3><p class=\"ip-sinif\" dir=\"ltr\">5. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyelerin tümü geçerlidir.</li><li>Fiil, sözlükte <b>mazi</b> (geçmiş zaman) biçimiyle aranır: <bdi class=\"ip-ar\">يَكْتُبُ</bdi> → <bdi class=\"ip-ar\">كتب</bdi>.</li><li><b>Ecvef</b> (ortası illetli): <bdi class=\"ip-ar\">يَنامُ</bdi> → <bdi class=\"ip-ar\">نام</bdi> &nbsp;·&nbsp; <b>Misal</b> (başı illetli): <bdi class=\"ip-ar\">يَقِفُ</bdi> → <bdi class=\"ip-ar\">وقف</bdi></li><li><b>Nâkıs</b> (sonu illetli): <bdi class=\"ip-ar\">يُصَلّي</bdi> → <bdi class=\"ip-ar\">صلى</bdi> &nbsp;·&nbsp; <b>Mehmuz</b>: <bdi class=\"ip-ar\">يَأْكُلُ</bdi> → <bdi class=\"ip-ar\">أكل</bdi></li><li><b>Mudâaf</b> (şeddeli): <bdi class=\"ip-ar\">يُحِبُّ</bdi> → <bdi class=\"ip-ar\">أحب</bdi> &nbsp;·&nbsp; <b>Mezid</b> fiil kendi mazisiyle aranır: <bdi class=\"ip-ar\">يَسْتَيْقِظُ</bdi> → <bdi class=\"ip-ar\">استيقظ</bdi></li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">القَلَمَ.</bdi> → <bdi class=\"ip-ar\"><b>قلم</b></bdi> <i>(isim (ال takılı))</i></li><li><bdi class=\"ip-ar\">خُذِ</bdi> → <bdi class=\"ip-ar\"><b>أخذ</b></bdi> <i>(fiil (emir · mehmuz))</i></li><li><bdi class=\"ip-ar\">المِمْحاةَ.</bdi> → <bdi class=\"ip-ar\"><b>ممحاة</b></bdi> <i>(isim (ال takılı))</i></li></ul>",
    sentences: [
      { /* 5_2_2#5 */
        arabic: [
          { text: "القَلَمَ.", root: "قلم", category: "isim (ال takılı)" },
          { text: "خُذِ", root: "أخذ", category: "fiil (emir · mehmuz)" }
        ],
        turkish: ["al.","Kalemi"],
        turkishFull: "Kalemi al."
      },
      { /* 5_2_2#6 */
        arabic: [
          { text: "المِمْحاةَ.", root: "ممحاة", category: "isim (ال takılı)" },
          { text: "خُذي", root: "أخذ", category: "fiil (emir · mehmuz · dişil)" }
        ],
        turkish: ["al (kız).","Silgiyi"],
        turkishFull: "Silgiyi al (kız)."
      },
      { /* 5_2_2#7 */
        arabic: [
          { text: "القَلَمَ.", root: "قلم", category: "isim (ال takılı)" },
          { text: "أَعْطِني", root: "أعطى", category: "fiil (emir · mezid · nakıs) + mef'ûl zamiri" }
        ],
        turkish: ["bana ver.","Kalemi"],
        turkishFull: "Kalemi bana ver."
      },
      { /* 5_2_2#9 */
        arabic: [
          { text: "أَعْطِ", root: "أعطى", category: "fiil (emir · mezid · nakıs)" },
          { text: "صَديقَكَ", root: "صديق", category: "isim + bitişik zamir (sen)" },
          { text: "الكِتابَ.", root: "كتاب", category: "isim (ال takılı)" }
        ],
        turkish: ["Ver","arkadaşına","kitabı."],
        turkishFull: "Ver arkadaşına kitabı."
      },
      { /* 5_3_1#15 */
        arabic: [
          { text: "أَنا", root: "SKIP", category: "zamir" },
          { text: "أُحِبُّ", root: "أحب", category: "fiil (muzari · mudâaf)" },
          { text: "عائِلَتي.", root: "عائلة", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Ben","ailemi","seviyorum."],
        turkishFull: "Ben ailemi seviyorum."
      },
      { /* 5_3_2#14 */
        arabic: [
          { text: "أَنا", root: "SKIP", category: "zamir" },
          { text: "أُحِبُّ", root: "أحب", category: "fiil (muzari · mudâaf)" },
          { text: "مِهْنَتي.", root: "مهنة", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Ben","mesleğimi","seviyorum."],
        turkishFull: "Ben mesleğimi seviyorum."
      }
    ]
  }
  ]
};
