/* =====================================================================
   SÖZLÜK SİMÜLASYONU — 9. SINIF VERİSİ            (üretilmiş dosya)
   ---------------------------------------------------------------------
   KAYNAK: muhadese/veri/9_*.js ders cümleleri. Arapça ELLE
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
window.SOZLUK_SINIF["9"] = {
  sinif: 9,
  cumle: 58,
  kelime: 146,
  seviyeler: [
  {
    level: 1,
    anahtar: "al",
    hint: "<h3 dir=\"ltr\">Seviye 1 · <bdi class=\"ip-ar\">ال</bdi> takısı ve yalın isim</h3><p class=\"ip-sinif\" dir=\"ltr\">9. sınıf muhâdese cümlelerinden</p><ul><li>Vurgulanan kelimenin <b>sözlükte aranacak yalın hâlini</b> (harekesiz) yazın.</li><li>İsmin başındaki <b><bdi class=\"ip-ar\">ال</bdi></b> takısı atılır.</li><li>Zamir, işaret ismi ve özel adlar aranmaz: onlar <b>geçilir</b>.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">الخَيْر</bdi> → <bdi class=\"ip-ar\"><b>خير</b></bdi> <i>(isim (ال takılı))</i></li><li><bdi class=\"ip-ar\">النّور</bdi> → <bdi class=\"ip-ar\"><b>نور</b></bdi> <i>(isim (ال takılı))</i></li><li><bdi class=\"ip-ar\">وَسَهْلًا</bdi> → <bdi class=\"ip-ar\"><b>سهلا</b></bdi> <i>(atıf harfi + isim (kalıp))</i></li></ul>",
    sentences: [
      { /* 9_1_1#3 */
        arabic: [
          { text: "صَباح", root: "صباح", category: "isim" },
          { text: "الخَيْر", root: "خير", category: "isim (ال takılı)" }
        ],
        turkish: ["sabahlar","Hayırlı"],
        turkishFull: "Hayırlı sabahlar"
      },
      { /* 9_1_1#4 */
        arabic: [
          { text: "صَباح", root: "صباح", category: "isim" },
          { text: "النّور", root: "نور", category: "isim (ال takılı)" }
        ],
        turkish: ["sabahlar","Nurlu"],
        turkishFull: "Nurlu sabahlar"
      },
      { /* 9_1_1#5 */
        arabic: [
          { text: "مَساء", root: "مساء", category: "zarf (zaman)" },
          { text: "الخَيْر", root: "خير", category: "isim (ال takılı)" }
        ],
        turkish: ["akşamlar","Hayırlı"],
        turkishFull: "Hayırlı akşamlar"
      },
      { /* 9_1_1#6 */
        arabic: [
          { text: "مَساء", root: "مساء", category: "zarf (zaman)" },
          { text: "النّور", root: "نور", category: "isim (ال takılı)" }
        ],
        turkish: ["akşamlar","Nurlu"],
        turkishFull: "Nurlu akşamlar"
      },
      { /* 9_1_1#8 */
        arabic: [
          { text: "أَهْلًا", root: "أهلا", category: "isim (kalıp)" },
          { text: "وَسَهْلًا", root: "سهلا", category: "atıf harfi + isim (kalıp)" }
        ],
        turkish: ["Hoş","geldin"],
        turkishFull: "Hoş geldin"
      },
      { /* 9_1_2#5 */
        arabic: [
          { text: "مَن", root: "من", category: "harf-i cer" },
          { text: "هَذا؟", root: "SKIP", category: "işaret/mevsul ismi" }
        ],
        turkish: ["kim?","Bu"],
        turkishFull: "Bu kim?"
      },
      { /* 9_1_2#6 */
        arabic: [
          { text: "هَذا", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "طالِب.", root: "طالب", category: "isim" }
        ],
        turkish: ["Bu","bir öğrenci."],
        turkishFull: "Bu bir öğrenci."
      },
      { /* 9_1_2#7 */
        arabic: [
          { text: "مَنْ", root: "من", category: "harf-i cer" },
          { text: "هَذِهِ؟", root: "SKIP", category: "işaret/mevsul ismi" }
        ],
        turkish: ["kim?","Bu"],
        turkishFull: "Bu kim?"
      },
      { /* 9_1_2#8 */
        arabic: [
          { text: "هَذِهِ", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "طالِبَة.", root: "طالبة", category: "isim (dişil)" }
        ],
        turkish: ["Bu","bir kız öğrenci."],
        turkishFull: "Bu bir kız öğrenci."
      },
      { /* 9_1_2#9 */
        arabic: [
          { text: "هُوَ", root: "SKIP", category: "zamir" },
          { text: "مُدَرِّس.", root: "مدرس", category: "isim" }
        ],
        turkish: ["O","bir öğretmen."],
        turkishFull: "O bir öğretmen."
      },
      { /* 9_1_2#10 */
        arabic: [
          { text: "هِيَ", root: "SKIP", category: "zamir" },
          { text: "مُدَرِّسَة.", root: "مدرسة", category: "isim" }
        ],
        turkish: ["O","bir bayan öğretmen."],
        turkishFull: "O bir bayan öğretmen."
      },
      { /* 9_1_2#16 */
        arabic: [
          { text: "فُرْصَة", root: "فرصة", category: "isim" },
          { text: "سَعيدَة.", root: "سعيد", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["tesadüf.","Mutlu bir"],
        turkishFull: "Mutlu bir tesadüf."
      },
      { /* 9_1_2#19 */
        arabic: [
          { text: "وَأَنا", root: "SKIP", category: "atıf harfi + zamir" },
          { text: "أَيْضًا", root: "أيضا", category: "zarf" },
          { text: "سَعيد.", root: "سعيد", category: "isim (sıfat)" }
        ],
        turkish: ["Ve ben","de","mutluyum."],
        turkishFull: "Ve ben de mutluyum."
      },
      { /* 9_2_1#1 */
        arabic: [
          { text: "أَيْن", root: "أين", category: "soru ismi" },
          { text: "الْمُدَرِّس؟", root: "مدرس", category: "isim (ال takılı)" }
        ],
        turkish: ["nerede?","Öğretmen"],
        turkishFull: "Öğretmen nerede?"
      },
      { /* 9_2_1#3 */
        arabic: [
          { text: "أَيْن", root: "أين", category: "soru ismi" },
          { text: "الطّالِب؟", root: "طالب", category: "isim (ال takılı)" }
        ],
        turkish: ["nerede?","Öğrenci"],
        turkishFull: "Öğrenci nerede?"
      },
      { /* 9_2_1#5 */
        arabic: [
          { text: "أَيْن", root: "أين", category: "soru ismi" },
          { text: "الكِتاب؟", root: "كتاب", category: "isim (ال takılı)" }
        ],
        turkish: ["nerede?","Kitap"],
        turkishFull: "Kitap nerede?"
      },
      { /* 9_2_1#7 */
        arabic: [
          { text: "أَيْن", root: "أين", category: "soru ismi" },
          { text: "القَلَم؟", root: "قلم", category: "isim (ال takılı)" }
        ],
        turkish: ["nerede?","Kalem"],
        turkishFull: "Kalem nerede?"
      },
      { /* 9_2_2#18 */
        arabic: [
          { text: "هَذِهِ", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "أُسْرَة", root: "أسرة", category: "isim" }
        ],
        turkish: ["Bu","bir ailedir."],
        turkishFull: "Bu bir ailedir."
      },
      { /* 9_3_1#6 */
        arabic: [
          { text: "المَطْبَخ", root: "مطبخ", category: "isim (ال takılı)" },
          { text: "كَبير.", root: "كبير", category: "isim" }
        ],
        turkish: ["Mutfak","büyük."],
        turkishFull: "Mutfak büyük."
      },
      { /* 9_3_1#7 */
        arabic: [
          { text: "الْحَمّام", root: "حمام", category: "isim (ال takılı)" },
          { text: "نَظيف.", root: "نظيف", category: "isim (sıfat)" }
        ],
        turkish: ["Banyo","temiz."],
        turkishFull: "Banyo temiz."
      },
      { /* 9_3_1#19 */
        arabic: [
          { text: "الْبَيْت", root: "بيت", category: "isim (ال takılı)" },
          { text: "نَظيف", root: "نظيف", category: "isim (sıfat)" },
          { text: "وَجَميل.", root: "جميل", category: "atıf harfi + isim" }
        ],
        turkish: ["Ev","temiz","ve güzel."],
        turkishFull: "Ev temiz ve güzel."
      }
    ]
  },
  {
    level: 2,
    anahtar: "zamir",
    hint: "<h3 dir=\"ltr\">Seviye 2 · Bitişik zamir ve harf-i cer</h3><p class=\"ip-sinif\" dir=\"ltr\">9. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyenin kuralları geçerlidir.</li><li>Kelimenin sonundaki <b>bitişik zamir</b> (<bdi class=\"ip-ar\">ـي، ـكَ، ـهُ، ـها، ـنا</bdi>) atılır.</li><li>Başa gelen <b>harf-i cer</b> (<bdi class=\"ip-ar\">بِـ، لِـ، كَـ</bdi>) kelimeden ayrılır; ama harf-i cer bir <b>zamire</b> bitişmişse birlikte aranır: <bdi class=\"ip-ar\">بِكَ</bdi> → <bdi class=\"ip-ar\">بك</bdi>.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">السَّلام</bdi> → <bdi class=\"ip-ar\"><b>سلام</b></bdi> <i>(ال takılı · isim)</i></li><li><bdi class=\"ip-ar\">وَعَلَيْكُم</bdi> → <bdi class=\"ip-ar\"><b>عليكم</b></bdi> <i>(atıf harfi + harf-i cer + bitişik zamir)</i></li><li><bdi class=\"ip-ar\">حالُكَ؟</bdi> → <bdi class=\"ip-ar\"><b>حال</b></bdi> <i>(isim + bitişik zamir (sen))</i></li></ul>",
    sentences: [
      { /* 9_1_1#1 */
        arabic: [
          { text: "السَّلام", root: "سلام", category: "ال takılı · isim" },
          { text: "عَلَيْكُم", root: "عليكم", category: "harf-i cer + bitişik zamir" }
        ],
        turkish: ["Selam","size olsun"],
        turkishFull: "Selam size olsun"
      },
      { /* 9_1_1#2 */
        arabic: [
          { text: "وَعَلَيْكُم", root: "عليكم", category: "atıf harfi + harf-i cer + bitişik zamir" },
          { text: "السَّلام", root: "سلام", category: "ال takılı · isim" }
        ],
        turkish: ["Size de","selam olsun"],
        turkishFull: "Size de selam olsun"
      },
      { /* 9_1_1#7 */
        arabic: [
          { text: "مَرْحَبًا", root: "مرحبا", category: "isim (mastar · kalıp)" },
          { text: "بِك", root: "بك", category: "harf-i cer + bitişik zamir" }
        ],
        turkish: ["Merhaba","sana"],
        turkishFull: "Merhaba sana"
      },
      { /* 9_1_1#9 */
        arabic: [
          { text: "كَيْفَ", root: "كيف", category: "soru ismi" },
          { text: "حالُكَ؟", root: "حال", category: "isim + bitişik zamir (sen)" }
        ],
        turkish: ["nasıl?","Halin"],
        turkishFull: "Halin nasıl?"
      },
      { /* 9_1_2#1 */
        arabic: [
          { text: "ما", root: "ما", category: "soru ismi" },
          { text: "اسْمُك؟", root: "اسم", category: "isim + bitişik zamir (sen)" }
        ],
        turkish: ["ne?","Adın"],
        turkishFull: "Adın ne?"
      },
      { /* 9_1_2#2 */
        arabic: [
          { text: "ما", root: "ما", category: "soru ismi" },
          { text: "اسْمُك؟", root: "اسم", category: "isim + bitişik zamir (sen)" }
        ],
        turkish: ["ne?","Adın"],
        turkishFull: "Adın ne?"
      },
      { /* 9_1_2#3 */
        arabic: [
          { text: "اِسْمي", root: "اسم", category: "isim + bitişik zamir (ben)" },
          { text: "أَحْمَد.", root: "SKIP", category: "isim (özel · kişi)" }
        ],
        turkish: ["Adım","Ahmet."],
        turkishFull: "Adım Ahmet."
      },
      { /* 9_1_2#11 */
        arabic: [
          { text: "أَنْتَ", root: "SKIP", category: "zamir" },
          { text: "صَديقي.", root: "صديق", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Sen","arkadaşımsın."],
        turkishFull: "Sen arkadaşımsın."
      },
      { /* 9_1_2#12 */
        arabic: [
          { text: "أَنْتِ", root: "SKIP", category: "zamir" },
          { text: "صَديقَتي.", root: "صديقة", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Sen","arkadaşımsın."],
        turkishFull: "Sen arkadaşımsın."
      },
      { /* 9_2_2#1 */
        arabic: [
          { text: "ما", root: "ما", category: "soru ismi" },
          { text: "مِهْنَتُك؟", root: "مهنة", category: "isim + bitişik zamir (sen)" }
        ],
        turkish: ["nedir?","Mesleğin"],
        turkishFull: "Mesleğin nedir?"
      },
      { /* 9_2_2#6 */
        arabic: [
          { text: "هَلْ", root: "هل", category: "soru edatı" },
          { text: "وَالِدُكَ", root: "والد", category: "isim + bitişik zamir (sen)" },
          { text: "مُدَرِّس؟", root: "مدرس", category: "isim" }
        ],
        turkish: ["mi?","Baban","öğretmen"],
        turkishFull: "Baban öğretmen mi?"
      },
      { /* 9_2_2#7 */
        arabic: [
          { text: "هَلْ", root: "هل", category: "soru edatı" },
          { text: "وَالِدَتُكِ", root: "والدة", category: "isim + bitişik zamir (sen)" },
          { text: "مُهَنْدِسَة؟", root: "مهندسة", category: "isim (meslek · dişil)" }
        ],
        turkish: ["mi?","Annen","mühendis"],
        turkishFull: "Annen mühendis mi?"
      },
      { /* 9_2_2#8 */
        arabic: [
          { text: "هَلْ", root: "هل", category: "soru edatı" },
          { text: "أَخوكَ", root: "أخ", category: "esmâ-i hamse + bitişik zamir (sen)" },
          { text: "عامِل؟", root: "عامل", category: "isim" }
        ],
        turkish: ["mi?","Erkek kardeşin","işçi"],
        turkishFull: "Erkek kardeşin işçi mi?"
      },
      { /* 9_2_2#19 */
        arabic: [
          { text: "هَذِهِ", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "أُسْرَتي", root: "أسرة", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Bu","benim ailemdir."],
        turkishFull: "Bu benim ailemdir."
      },
      { /* 9_2_2#20 */
        arabic: [
          { text: "هَذا", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "والِدي", root: "والد", category: "isim + bitişik zamir (ben)" },
          { text: "وَهَذِهِ", root: "SKIP", category: "atıf harfi + işaret/mevsul ismi" },
          { text: "والِدَتي", root: "والدة", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Bu","babam,","bu da","annem."],
        turkishFull: "Bu babam, bu da annem."
      },
      { /* 9_2_2#21 */
        arabic: [
          { text: "هَذا", root: "SKIP", category: "işaret/mevsul ismi" },
          { text: "أَخي", root: "أخ", category: "isim + bitişik zamir (ben)" },
          { text: "وَهَذِهِ", root: "SKIP", category: "atıf harfi + işaret/mevsul ismi" },
          { text: "أُخْتي", root: "أخت", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["Bu","erkek kardeşim,","bu da","kız kardeşim."],
        turkishFull: "Bu erkek kardeşim, bu da kız kardeşim."
      },
      { /* 9_3_2#1 */
        arabic: [
          { text: "غُرْفَتي", root: "غرفة", category: "isim + bitişik zamir (ben)" },
          { text: "كَبيرَة", root: "كبير", category: "isim (sıfat · dişil)" },
          { text: "وَجَميلَة.", root: "جميل", category: "atıf harfi + isim (sıfat · dişil)" }
        ],
        turkish: ["Odam","büyük","ve güzel."],
        turkishFull: "Odam büyük ve güzel."
      },
      { /* 9_3_2#2 */
        arabic: [
          { text: "فيها", root: "في", category: "isim + bitişik zamir (o · dişil)" },
          { text: "سَرير", root: "سرير", category: "isim" },
          { text: "وَمَكْتَب", root: "مكتب", category: "atıf harfi + isim" },
          { text: "وَكُرْسِيّ.", root: "كرسي", category: "atıf harfi + isim" }
        ],
        turkish: ["İçinde","yatak,","masa","ve sandalye var."],
        turkishFull: "İçinde yatak, masa ve sandalye var."
      },
      { /* 9_4_2#15 */
        arabic: [
          { text: "يَوْمِي", root: "يوم", category: "isim + bitişik zamir (ben)" },
          { text: "طَوِيلٌ", root: "طويل", category: "isim" },
          { text: "وَلَكِنَّهُ", root: "لكن", category: "atıf harfi + istidrak harfi + zamir" },
          { text: "جَمِيلٌ.", root: "جميل", category: "isim" }
        ],
        turkish: ["Günüm","uzundur","ama","güzeldir."],
        turkishFull: "Günüm uzundur ama güzeldir."
      }
    ]
  },
  {
    level: 3,
    anahtar: "fiil",
    hint: "<h3 dir=\"ltr\">Seviye 3 · Fiiller: muzariden maziye</h3><p class=\"ip-sinif\" dir=\"ltr\">9. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyelerin kuralları geçerlidir.</li><li>Fiil, sözlükte <b>mazi</b> (geçmiş zaman) biçimiyle aranır: <bdi class=\"ip-ar\">يَكْتُبُ</bdi> → <bdi class=\"ip-ar\">كتب</bdi>.</li><li>Emir kipi de maziye çevrilir: <bdi class=\"ip-ar\">اُكْتُبْ</bdi> → <bdi class=\"ip-ar\">كتب</bdi>.</li><li>Fiile bitişen <b>mef'ûl zamiri</b> (<bdi class=\"ip-ar\">ـني، ـهُ</bdi>) atılır.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">تَشَرَّفْتُ</bdi> → <bdi class=\"ip-ar\"><b>تشرف</b></bdi> <i>(fiil (mazi · mezid))</i></li><li><bdi class=\"ip-ar\">بِمَعْرِفَتِكَ.</bdi> → <bdi class=\"ip-ar\"><b>معرفة</b></bdi> <i>(harf-i cer + isim + bitişik zamir)</i></li><li><bdi class=\"ip-ar\">اِفْتَح</bdi> → <bdi class=\"ip-ar\"><b>فتح</b></bdi> <i>(fiil (muzari))</i></li></ul>",
    sentences: [
      { /* 9_1_2#15 */
        arabic: [
          { text: "تَشَرَّفْتُ", root: "تشرف", category: "fiil (mazi · mezid)" },
          { text: "بِمَعْرِفَتِكَ.", root: "معرفة", category: "harf-i cer + isim + bitişik zamir" }
        ],
        turkish: ["şeref duydum.","Seninle tanıştığıma"],
        turkishFull: "Seninle tanıştığıma şeref duydum."
      },
      { /* 9_2_1#16 */
        arabic: [
          { text: "اِفْتَح", root: "فتح", category: "fiil (muzari)" },
          { text: "الكِتاب.", root: "كتاب", category: "isim (ال takılı)" }
        ],
        turkish: ["aç.","Kitabı"],
        turkishFull: "Kitabı aç."
      },
      { /* 9_2_2#2 */
        arabic: [
          { text: "ماذا", root: "ماذا", category: "soru ismi" },
          { text: "يَعْمَلُ", root: "عمل", category: "fiil (muzari)" },
          { text: "وَالِدُك؟", root: "والد", category: "isim + bitişik zamir (sen)" }
        ],
        turkish: ["ne","iş yapıyor?","Baban"],
        turkishFull: "Baban ne iş yapıyor?"
      },
      { /* 9_2_2#3 */
        arabic: [
          { text: "أَيْن", root: "أين", category: "soru ismi" },
          { text: "يَعْمَلُ", root: "عمل", category: "fiil (muzari)" },
          { text: "العامِل؟", root: "عامل", category: "isim (ال takılı)" }
        ],
        turkish: ["nerede","çalışıyor?","İşçi"],
        turkishFull: "İşçi nerede çalışıyor?"
      },
      { /* 9_2_2#4 */
        arabic: [
          { text: "أَيْن", root: "أين", category: "soru ismi" },
          { text: "تَعْمَلُ", root: "عمل", category: "fiil (muzari)" },
          { text: "الطَّبّاخَة؟", root: "طباخة", category: "isim (ال takılı)" }
        ],
        turkish: ["nerede","çalışıyor?","Aşçı kadın"],
        turkishFull: "Aşçı kadın nerede çalışıyor?"
      },
      { /* 9_2_2#5 */
        arabic: [
          { text: "أَيْن", root: "أين", category: "soru ismi" },
          { text: "يَعْمَلُ", root: "عمل", category: "fiil (muzari)" },
          { text: "الطَّبيب؟", root: "طبيب", category: "isim (ال takılı)" }
        ],
        turkish: ["nerede","çalışıyor?","Doktor"],
        turkishFull: "Doktor nerede çalışıyor?"
      },
      { /* 9_2_2#15 */
        arabic: [
          { text: "يَفْحَصُ", root: "فحص", category: "fiil (muzari)" },
          { text: "الطَّبيب", root: "طبيب", category: "isim (ال takılı)" },
          { text: "المَرْضى", root: "مرض", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["muayene ediyor.","Doktor","hastaları"],
        turkishFull: "Doktor hastaları muayene ediyor."
      },
      { /* 9_2_2#16 */
        arabic: [
          { text: "تَطْبُخُ", root: "طبخ", category: "fiil (muzari)" },
          { text: "الطَّبّاخَة", root: "طباخة", category: "isim (ال takılı)" },
          { text: "الطَّعام", root: "طعام", category: "isim (ال takılı)" }
        ],
        turkish: ["pişiriyor.","Aşçı kadın","yemeği"],
        turkishFull: "Aşçı kadın yemeği pişiriyor."
      },
      { /* 9_2_2#17 */
        arabic: [
          { text: "يُدَرِّسُ", root: "درس", category: "fiil (muzari)" },
          { text: "المُدَرِّس", root: "مدرس", category: "isim (ال takılı)" },
          { text: "الدَّرْس", root: "درس", category: "isim (ال takılı)" }
        ],
        turkish: ["anlatıyor.","Öğretmen","dersi"],
        turkishFull: "Öğretmen dersi anlatıyor."
      },
      { /* 9_3_1#1 */
        arabic: [
          { text: "أَيْن", root: "أين", category: "soru ismi" },
          { text: "تَسْكُن؟", root: "سكن", category: "fiil (muzari)" }
        ],
        turkish: ["Nerede","oturuyorsun?"],
        turkishFull: "Nerede oturuyorsun?"
      },
      { /* 9_3_1#12 */
        arabic: [
          { text: "أُخْتي", root: "أخت", category: "isim + bitişik zamir (ben)" },
          { text: "تَكْتُبُ", root: "كتب", category: "fiil (muzari)" },
          { text: "الدَّرْس.", root: "درس", category: "isim (ال takılı)" }
        ],
        turkish: ["Kız kardeşim","yazıyor.","dersi"],
        turkishFull: "Kız kardeşim dersi yazıyor."
      },
      { /* 9_4_1#2 */
        arabic: [
          { text: "أَغْسِلُ", root: "غسل", category: "fiil (muzari)" },
          { text: "وَجْهي", root: "وجه", category: "isim + bitişik zamir (ben)" },
          { text: "وَيَدَيّ.", root: "يد", category: "atıf harfi + isim + bitişik zamir (ben)" }
        ],
        turkish: ["yıkarım.","Yüzümü","ve ellerimi"],
        turkishFull: "Yüzümü ve ellerimi yıkarım."
      },
      { /* 9_4_1#4 */
        arabic: [
          { text: "أَلْبَسُ", root: "لبس", category: "fiil (muzari)" },
          { text: "مَلابِسي.", root: "ملابس", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["giyerim.","Kıyafetlerimi"],
        turkishFull: "Kıyafetlerimi giyerim."
      }
    ]
  },
  {
    level: 4,
    anahtar: "illetli",
    hint: "<h3 dir=\"ltr\">Seviye 4 · İlletli ve mezid fiiller</h3><p class=\"ip-sinif\" dir=\"ltr\">9. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyelerin tümü geçerlidir.</li><li><b>Ecvef</b> (ortası illetli): <bdi class=\"ip-ar\">يَنامُ</bdi> → <bdi class=\"ip-ar\">نام</bdi> &nbsp;·&nbsp; <b>Misal</b> (başı illetli): <bdi class=\"ip-ar\">يَقِفُ</bdi> → <bdi class=\"ip-ar\">وقف</bdi></li><li><b>Nâkıs</b> (sonu illetli): <bdi class=\"ip-ar\">يُصَلّي</bdi> → <bdi class=\"ip-ar\">صلى</bdi> &nbsp;·&nbsp; <b>Mehmuz</b>: <bdi class=\"ip-ar\">يَأْكُلُ</bdi> → <bdi class=\"ip-ar\">أكل</bdi></li><li><b>Mudâaf</b> (şeddeli): <bdi class=\"ip-ar\">يُحِبُّ</bdi> → <bdi class=\"ip-ar\">أحب</bdi> &nbsp;·&nbsp; <b>Mezid</b> fiil kendi mazisiyle aranır: <bdi class=\"ip-ar\">يَسْتَيْقِظُ</bdi> → <bdi class=\"ip-ar\">استيقظ</bdi></li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">أَعِدْ</bdi> → <bdi class=\"ip-ar\"><b>أعاد</b></bdi> <i>(fiil (emir · mezid · ecvef))</i></li><li><bdi class=\"ip-ar\">بَعْدي</bdi> → <bdi class=\"ip-ar\"><b>بعد</b></bdi> <i>(isim + bitişik zamir (ben))</i></li><li><bdi class=\"ip-ar\">عائِلَتي</bdi> → <bdi class=\"ip-ar\"><b>عائلة</b></bdi> <i>(isim + bitişik zamir (ben))</i></li></ul>",
    sentences: [
      { /* 9_1_1#16 */
        arabic: [
          { text: "أَعِدْ", root: "أعاد", category: "fiil (emir · mezid · ecvef)" },
          { text: "بَعْدي", root: "بعد", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["tekrarla","Benden sonra"],
        turkishFull: "Benden sonra tekrarla"
      },
      { /* 9_2_2#22 */
        arabic: [
          { text: "أَنا", root: "SKIP", category: "zamir" },
          { text: "أُحِبُّ", root: "أحب", category: "fiil (muzari · mudâaf)" },
          { text: "عائِلَتي", root: "عائلة", category: "isim + bitişik zamir (ben)" },
          { text: "جِدًّا", root: "جدا", category: "zarf" }
        ],
        turkish: ["Ben","seviyorum.","ailemi","çok"],
        turkishFull: "Ben ailemi çok seviyorum."
      },
      { /* 9_2_2#23 */
        arabic: [
          { text: "أَنا", root: "SKIP", category: "zamir" },
          { text: "أُحِبُّ", root: "أحب", category: "fiil (muzari · mudâaf)" },
          { text: "وَأَحْتَرِمُ", root: "احترم", category: "atıf harfi + fiil (muzari · mezid)" },
          { text: "عائِلَتي", root: "عائلة", category: "isim + bitişik zamir (ben)" },
          { text: "كَثيرًا", root: "كثيرا", category: "zarf" }
        ],
        turkish: ["Ben","seviyor","ve saygı duyuyorum.","ailemi","çok"],
        turkishFull: "Ben ailemi çok seviyor ve saygı duyuyorum."
      },
      { /* 9_3_1#11 */
        arabic: [
          { text: "أَخي", root: "أخ", category: "isim + bitişik zamir (ben)" },
          { text: "يَقْرَأُ", root: "قرأ", category: "fiil (muzari · mehmuz)" },
          { text: "كِتابًا.", root: "كتاب", category: "isim (tenvinli)" }
        ],
        turkish: ["Erkek kardeşim","okuyor.","kitap"],
        turkishFull: "Erkek kardeşim kitap okuyor."
      },
      { /* 9_4_2#14 */
        arabic: [
          { text: "أَنَامُ", root: "نام", category: "fiil (muzari · ecvef)" },
          { text: "مُتَأَخِّرًا", root: "متأخر", category: "isim (sıfat · tenvinli)" },
          { text: "أَحْيَانًا.", root: "أحيانا", category: "zarf" }
        ],
        turkish: ["uyurum.","geç","Bazen"],
        turkishFull: "Bazen geç uyurum."
      }
    ]
  }
  ]
};
