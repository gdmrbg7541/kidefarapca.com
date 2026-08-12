/* =====================================================================
   SÖZLÜK SİMÜLASYONU — 10. SINIF VERİSİ            (üretilmiş dosya)
   ---------------------------------------------------------------------
   KAYNAK: muhadese/veri/10_*.js ders cümleleri. Arapça ELLE
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
window.SOZLUK_SINIF["10"] = {
  sinif: 10,
  cumle: 83,
  kelime: 267,
  seviyeler: [
  {
    level: 1,
    anahtar: "al",
    hint: "<h3 dir=\"ltr\">Seviye 1 · <bdi class=\"ip-ar\">ال</bdi> takısı ve yalın isim</h3><p class=\"ip-sinif\" dir=\"ltr\">10. sınıf muhâdese cümlelerinden</p><ul><li>Vurgulanan kelimenin <b>sözlükte aranacak yalın hâlini</b> (harekesiz) yazın.</li><li>İsmin başındaki <b><bdi class=\"ip-ar\">ال</bdi></b> takısı atılır.</li><li>Zamir, işaret ismi ve özel adlar aranmaz: onlar <b>geçilir</b>.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">قَلِقَة.</bdi> → <bdi class=\"ip-ar\"><b>قلق</b></bdi> <i>(isim (sıfat · dişil))</i></li><li><bdi class=\"ip-ar\">جَميلَة</bdi> → <bdi class=\"ip-ar\"><b>جميل</b></bdi> <i>(isim (sıfat · dişil))</i></li><li><bdi class=\"ip-ar\">ومُهِمَّة.</bdi> → <bdi class=\"ip-ar\"><b>مهم</b></bdi> <i>(atıf harfi + isim (sıfat · dişil))</i></li></ul>",
    sentences: [
      { /* 10_1_1#6 */
        arabic: [
          { text: "أَنْتَ", root: "SKIP", category: "zamir" },
          { text: "مُتَقاعِد.", root: "متقاعد", category: "isim" }
        ],
        turkish: ["Sen","emeklisin."],
        turkishFull: "Sen emeklisin."
      },
      { /* 10_1_2#16 */
        arabic: [
          { text: "هُو", root: "SKIP", category: "zamir" },
          { text: "مُتَعَجِّب.", root: "متعجب", category: "isim" }
        ],
        turkish: ["O","şaşkındır."],
        turkishFull: "O şaşkındır."
      },
      { /* 10_1_2#17 */
        arabic: [
          { text: "هِي", root: "SKIP", category: "zamir" },
          { text: "قَلِقَة.", root: "قلق", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["O","endişelidir."],
        turkishFull: "O endişelidir."
      },
      { /* 10_2_1#1 */
        arabic: [
          { text: "أَنا", root: "SKIP", category: "zamir" },
          { text: "مَريض.", root: "مريض", category: "isim" }
        ],
        turkish: ["Ben","hastayım."],
        turkishFull: "Ben hastayım."
      },
      { /* 10_3_1#2 */
        arabic: [
          { text: "أَنَا", root: "SKIP", category: "zamir" },
          { text: "تُرْكِيٌّ.", root: "تركي", category: "isim (nisbet)" }
        ],
        turkish: ["Ben","Türküm."],
        turkishFull: "Ben Türküm."
      },
      { /* 10_3_1#28 */
        arabic: [
          { text: "وَأَنَا", root: "SKIP", category: "atıf harfi + zamir" },
          { text: "مُواطِن", root: "مواطن", category: "isim (ism-i fâil)" },
          { text: "تُرْكِيّ.", root: "تركي", category: "isim (nisbet)" }
        ],
        turkish: ["Ben","vatandaşıyım.","Türk"],
        turkishFull: "Ben Türk vatandaşıyım."
      },
      { /* 10_3_1#30 */
        arabic: [
          { text: "أَنْقَرَة", root: "SKIP", category: "isim (özel · yer)" },
          { text: "مَدينَة", root: "مدينة", category: "isim" },
          { text: "جَميلَة", root: "جميل", category: "isim (sıfat · dişil)" },
          { text: "ومُهِمَّة.", root: "مهم", category: "atıf harfi + isim (sıfat · dişil)" }
        ],
        turkish: ["Ankara","şehirdir.","güzel","ve önemli"],
        turkishFull: "Ankara güzel ve önemli şehirdir."
      },
      { /* 10_3_2#16 */
        arabic: [
          { text: "السّاعَة", root: "ساعة", category: "isim (ال takılı)" },
          { text: "الخامِسَة", root: "خامسة", category: "isim (ال takılı)" },
          { text: "وَالثُّلُث", root: "ثلث", category: "atıf harfi + isim (ال takılı)" }
        ],
        turkish: ["Saat","beşi","yirmi geçiyor."],
        turkishFull: "Saat beşi yirmi geçiyor."
      },
      { /* 10_3_2#18 */
        arabic: [
          { text: "السّاعَة", root: "ساعة", category: "isim (ال takılı)" },
          { text: "العاشِرَة", root: "عاشرة", category: "isim (ال takılı)" },
          { text: "وَالرُّبْع", root: "ربع", category: "atıf harfi + isim (ال takılı)" }
        ],
        turkish: ["Saat","onu","çeyrek geçiyor."],
        turkishFull: "Saat onu çeyrek geçiyor."
      },
      { /* 10_3_2#19 */
        arabic: [
          { text: "السّاعَة", root: "ساعة", category: "isim (ال takılı)" },
          { text: "الخامِسَة", root: "خامسة", category: "isim (ال takılı)" },
          { text: "وَالرُّبْع", root: "ربع", category: "atıf harfi + isim (ال takılı)" }
        ],
        turkish: ["Saat","beşi","çeyrek geçiyor."],
        turkishFull: "Saat beşi çeyrek geçiyor."
      },
      { /* 10_3_2#21 */
        arabic: [
          { text: "السّاعَة", root: "ساعة", category: "isim (ال takılı)" },
          { text: "الواحِدَة", root: "واحدة", category: "ال takılı · isim (sayı · dişil)" },
          { text: "وَالثُّلُث", root: "ثلث", category: "atıf harfi + isim (ال takılı)" }
        ],
        turkish: ["Saat","biri","yirmi geçiyor."],
        turkishFull: "Saat biri yirmi geçiyor."
      },
      { /* 10_3_2#23 */
        arabic: [
          { text: "السّاعَة", root: "ساعة", category: "isim (ال takılı)" },
          { text: "الثّالِثَة", root: "ثالثة", category: "isim (ال takılı)" },
          { text: "وَالثُّلُث", root: "ثلث", category: "atıf harfi + isim (ال takılı)" }
        ],
        turkish: ["Saat","üçü","yirmi geçiyor."],
        turkishFull: "Saat üçü yirmi geçiyor."
      },
      { /* 10_3_2#26 */
        arabic: [
          { text: "السّاعَة", root: "ساعة", category: "isim (ال takılı)" },
          { text: "السّابِعَة", root: "سابعة", category: "isim (ال takılı)" },
          { text: "وَالرُّبْع", root: "ربع", category: "atıf harfi + isim (ال takılı)" }
        ],
        turkish: ["Saat","yediyi","çeyrek geçiyor."],
        turkishFull: "Saat yediyi çeyrek geçiyor."
      },
      { /* 10_4_1#2 */
        arabic: [
          { text: "كَيْفَ", root: "كيف", category: "soru ismi" },
          { text: "الطَّقْسُ", root: "طقس", category: "isim (ال takılı)" },
          { text: "اليَوْمَ؟", root: "اليوم", category: "zarf (zaman)" }
        ],
        turkish: ["nasıl?","hava","Bugün"],
        turkishFull: "Bugün hava nasıl?"
      },
      { /* 10_4_1#3 */
        arabic: [
          { text: "الطَّقْسُ", root: "طقس", category: "isim (ال takılı)" },
          { text: "مُشْمِسٌ", root: "مشمس", category: "isim" },
          { text: "اليَوْمَ.", root: "اليوم", category: "zarf (zaman)" }
        ],
        turkish: ["Hava","güneşli.","bugün"],
        turkishFull: "Hava bugün güneşli."
      },
      { /* 10_4_2#2 */
        arabic: [
          { text: "ما", root: "ما", category: "soru ismi" },
          { text: "سِعْرُ", root: "سعر", category: "isim" },
          { text: "هَذا؟", root: "SKIP", category: "işaret/mevsul ismi" }
        ],
        turkish: ["ne?","fiyatı","Bunun"],
        turkishFull: "Bunun fiyatı ne?"
      },
      { /* 10_4_2#16 */
        arabic: [
          { text: "اَلْبائِعُ", root: "بائع", category: "isim (ال takılı)" },
          { text: "لَطيفٌ", root: "لطيف", category: "isim (sıfat)" },
          { text: "كَثيرًا.", root: "كثيرا", category: "zarf" }
        ],
        turkish: ["Satıcı","nazik.","çok"],
        turkishFull: "Satıcı çok nazik."
      },
      { /* 10_4_2#17 */
        arabic: [
          { text: "اَلسِّعْرُ", root: "سعر", category: "isim (ال takılı)" },
          { text: "مُرْتَفِعٌ.", root: "مرتفع", category: "isim" }
        ],
        turkish: ["Fiyat","yüksek."],
        turkishFull: "Fiyat yüksek."
      },
      { /* 10_4_2#20 */
        arabic: [
          { text: "أَيُّ", root: "أي", category: "soru ismi" },
          { text: "خِدْمَةٍ؟", root: "خدمة", category: "isim" }
        ],
        turkish: ["Buyurun,","ne arzu edersiniz?"],
        turkishFull: "Buyurun, ne arzu edersiniz?"
      }
    ]
  },
  {
    level: 2,
    anahtar: "zamir",
    hint: "<h3 dir=\"ltr\">Seviye 2 · Bitişik zamir ve harf-i cer</h3><p class=\"ip-sinif\" dir=\"ltr\">10. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyenin kuralları geçerlidir.</li><li>Kelimenin sonundaki <b>bitişik zamir</b> (<bdi class=\"ip-ar\">ـي، ـكَ، ـهُ، ـها، ـنا</bdi>) atılır.</li><li>Başa gelen <b>harf-i cer</b> (<bdi class=\"ip-ar\">بِـ، لِـ، كَـ</bdi>) kelimeden ayrılır; ama harf-i cer bir <b>zamire</b> bitişmişse birlikte aranır: <bdi class=\"ip-ar\">بِكَ</bdi> → <bdi class=\"ip-ar\">بك</bdi>.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">عِنْدي</bdi> → <bdi class=\"ip-ar\"><b>عند</b></bdi> <i>(isim + bitişik zamir (ben))</i></li><li><bdi class=\"ip-ar\">مُرْتَفِعَة.</bdi> → <bdi class=\"ip-ar\"><b>مرتفع</b></bdi> <i>(isim (sıfat · dişil))</i></li><li><bdi class=\"ip-ar\">مَريضَة،</bdi> → <bdi class=\"ip-ar\"><b>مريض</b></bdi> <i>(isim (sıfat · dişil))</i></li></ul>",
    sentences: [
      { /* 10_2_1#3 */
        arabic: [
          { text: "عِنْدي", root: "عند", category: "isim + bitişik zamir (ben)" },
          { text: "كُحَّة.", root: "كحة", category: "isim" }
        ],
        turkish: ["var.","Öksürüğüm"],
        turkishFull: "Öksürüğüm var."
      },
      { /* 10_2_1#6 */
        arabic: [
          { text: "عِنْدي", root: "عند", category: "isim + bitişik zamir (ben)" },
          { text: "حَرارَة", root: "حرارة", category: "isim" },
          { text: "مُرْتَفِعَة.", root: "مرتفع", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["var.","ateşim","Yüksek"],
        turkishFull: "Yüksek ateşim var."
      },
      { /* 10_2_1#9 */
        arabic: [
          { text: "أَنا", root: "SKIP", category: "zamir" },
          { text: "مَريض،", root: "مريض", category: "isim" },
          { text: "عِنْدي", root: "عند", category: "isim + bitişik zamir (ben)" },
          { text: "صُداع.", root: "صداع", category: "isim" }
        ],
        turkish: ["Ben","hastayım,","var.","baş ağrım"],
        turkishFull: "Ben hastayım, baş ağrım var."
      },
      { /* 10_2_1#11 */
        arabic: [
          { text: "أَنْتَ", root: "SKIP", category: "zamir" },
          { text: "مَريض،", root: "مريض", category: "isim" },
          { text: "عِنْدَكَ", root: "عند", category: "isim + bitişik zamir (sen)" },
          { text: "كُحَّة.", root: "كحة", category: "isim" }
        ],
        turkish: ["Sen","hastasın,","var.","öksürüğün"],
        turkishFull: "Sen hastasın, öksürüğün var."
      },
      { /* 10_2_1#14 */
        arabic: [
          { text: "هِي", root: "SKIP", category: "zamir" },
          { text: "مَريضَة،", root: "مريض", category: "isim (sıfat · dişil)" },
          { text: "عِنْدَها", root: "عند", category: "isim + bitişik zamir (o · dişil)" },
          { text: "زُكام.", root: "زكام", category: "isim" }
        ],
        turkish: ["O","hasta,","var.(onun)","nezlesi"],
        turkishFull: "O hasta, nezlesi var.(onun)"
      },
      { /* 10_2_1#15 */
        arabic: [
          { text: "جَدّي", root: "جد", category: "isim + bitişik zamir (ben)" },
          { text: "مَريض،", root: "مريض", category: "isim" },
          { text: "ضَغْطُهُ", root: "ضغط", category: "isim + bitişik zamir (o)" },
          { text: "مُرْتَفِع.", root: "مرتفع", category: "isim" }
        ],
        turkish: ["Dedem","hasta,","onun tansiyonu","yüksek."],
        turkishFull: "Dedem hasta, onun tansiyonu yüksek."
      },
      { /* 10_2_1#16 */
        arabic: [
          { text: "أُخْتي", root: "أخت", category: "isim + bitişik zamir (ben)" },
          { text: "مَريضَة،", root: "مريض", category: "isim (sıfat · dişil)" },
          { text: "حَرارَتُها", root: "حرارة", category: "isim + bitişik zamir (o · dişil)" },
          { text: "مُرْتَفِعَة.", root: "مرتفع", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Kız kardeşim","hasta,","ateşi","yüksek."],
        turkishFull: "Kız kardeşim hasta, ateşi yüksek."
      },
      { /* 10_2_2#14 */
        arabic: [
          { text: "الرِّياضَة", root: "رياضة", category: "isim (ال takılı)" },
          { text: "مُفيدَة", root: "مفيد", category: "isim (sıfat · dişil)" },
          { text: "لِلصِّحَّة.", root: "صحة", category: "harf-i cer + isim (ال takılı)" }
        ],
        turkish: ["Spor","faydalıdır.","sağlık için"],
        turkishFull: "Spor sağlık için faydalıdır."
      },
      { /* 10_3_1#1 */
        arabic: [
          { text: "مَا", root: "ما", category: "soru ismi" },
          { text: "جِنْسِيَّتُكَ؟", root: "جنسية", category: "isim + bitişik zamir (sen)" }
        ],
        turkish: ["nedir?","Senin uyruğun"],
        turkishFull: "Senin uyruğun nedir?"
      },
      { /* 10_3_1#15 */
        arabic: [
          { text: "قُونْيَا", root: "SKIP", category: "isim (özel · yer)" },
          { text: "مَشْهُورَة", root: "مشهور", category: "isim (sıfat · dişil)" },
          { text: "بِمُتْحَف", root: "متحف", category: "harf-i cer + isim" },
          { text: "مَوْلَانَا.", root: "SKIP", category: "isim (özel · yer)" }
        ],
        turkish: ["Konya","meşhurdur.","müzesi ile","Mevlana"],
        turkishFull: "Konya Mevlana müzesi ile meşhurdur."
      },
      { /* 10_3_1#27 */
        arabic: [
          { text: "مَرْحَبًا،", root: "مرحبا", category: "isim (mastar · kalıp)" },
          { text: "اِسْمي", root: "اسم", category: "isim + bitişik zamir (ben)" },
          { text: "مُراد.", root: "SKIP", category: "isim (özel · kişi)" }
        ],
        turkish: ["Merhaba,","ismim","Murat'tır."],
        turkishFull: "Merhaba, ismim Murat'tır."
      },
      { /* 10_3_1#31 */
        arabic: [
          { text: "لِأَنَّها", root: "لأن", category: "ta'lil harfi + bitişik zamir" },
          { text: "عاصِمَة", root: "عاصمة", category: "isim" },
          { text: "تُرْكِيا.", root: "SKIP", category: "isim (özel · yer)" }
        ],
        turkish: ["Çünkü o","başkentidir.","Türkiye'nin"],
        turkishFull: "Çünkü o Türkiye'nin başkentidir."
      },
      { /* 10_3_1#36 */
        arabic: [
          { text: "كَمَسْجِد", root: "مسجد", category: "harf-i cer + isim" },
          { text: "آياصوفْيا", root: "SKIP", category: "isim (özel · yer)" },
          { text: "الْكَبير،", root: "كبير", category: "isim (ال takılı)" },
          { text: "وَقَصْر", root: "قصر", category: "atıf harfi + isim" },
          { text: "توبْكابي،", root: "SKIP", category: "isim (özel · yer)" },
          { text: "وَمُتْحَف", root: "متحف", category: "atıf harfi + isim" },
          { text: "مَوْلانا.", root: "SKIP", category: "isim (özel · yer)" }
        ],
        turkish: ["camisi gibi","Ayasofya","Büyük","ve sarayı","Topkapı","ve müzesi","Mevlana"],
        turkishFull: "Büyük Ayasofya camisi gibi ve sarayı Topkapı ve müzesi Mevlana"
      },
      { /* 10_3_1#37 */
        arabic: [
          { text: "وَتُرْكِيا", root: "SKIP", category: "atıf harfi + isim (özel · yer)" },
          { text: "مَشْهورَة", root: "مشهور", category: "isim (sıfat · dişil)" },
          { text: "بِطَبيعَتِها", root: "طبيعة", category: "harf-i cer + isim + bitişik zamir" },
          { text: "الجَميلَة", root: "جميل", category: "ال takılı · isim (sıfat · dişil)" },
          { text: "أَيْضًا.", root: "أيضا", category: "zarf" }
        ],
        turkish: ["ve Türkiye","meşhurdur.","doğasıyla","güzel","da"],
        turkishFull: "ve Türkiye güzel doğasıyla da meşhurdur."
      },
      { /* 10_3_2#46 */
        arabic: [
          { text: "مَدْرَسَتي", root: "مدرسة", category: "isim + bitişik zamir (ben)" },
          { text: "خَلْف", root: "خلف", category: "zarf" },
          { text: "المَسْجِد.", root: "مسجد", category: "isim (ال takılı)" }
        ],
        turkish: ["Okulum","arkasındadır.","caminin"],
        turkishFull: "Okulum caminin arkasındadır."
      },
      { /* 10_4_2#1 */
        arabic: [
          { text: "بِكَمْ", root: "كم", category: "harf-i cer + isim" },
          { text: "هَذا؟", root: "SKIP", category: "işaret/mevsul ismi" }
        ],
        turkish: ["kaça?","Bu"],
        turkishFull: "Bu kaça?"
      },
      { /* 10_4_2#21 */
        arabic: [
          { text: "كَيْفَ", root: "كيف", category: "soru ismi" },
          { text: "أُساعِدُكَ؟", root: "أساعد", category: "isim + bitişik zamir (sen)" }
        ],
        turkish: ["Size nasıl","yardımcı olabilirim?"],
        turkishFull: "Size nasıl yardımcı olabilirim?"
      }
    ]
  },
  {
    level: 3,
    anahtar: "coful",
    hint: "<h3 dir=\"ltr\">Seviye 3 · İkil, çoğul ve tenvin</h3><p class=\"ip-sinif\" dir=\"ltr\">10. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyelerin kuralları geçerlidir.</li><li><b>İkil</b> (<bdi class=\"ip-ar\">ـانِ، ـيْنِ</bdi>) ve <b>çoğul</b> (<bdi class=\"ip-ar\">ـونَ، ـينَ، ـاتٌ</bdi>) ekleri atılır, <b>tekili</b> yazılır.</li><li><b>Kırık çoğulun</b> tekili ezberden bilinir: <bdi class=\"ip-ar\">أَوْلاد</bdi> → <bdi class=\"ip-ar\">ولد</bdi>.</li><li>Sondaki <b>tenvin elifi</b> (<bdi class=\"ip-ar\">ـًا</bdi>) kelimeden sayılmaz.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">وَالعَيْن،</bdi> → <bdi class=\"ip-ar\"><b>عين</b></bdi> <i>(atıf harfi + isim (ال takılı))</i></li><li><bdi class=\"ip-ar\">وَالأُذُن،</bdi> → <bdi class=\"ip-ar\"><b>أذن</b></bdi> <i>(atıf harfi + isim (ال takılı))</i></li><li><bdi class=\"ip-ar\">وَالأَنْف،</bdi> → <bdi class=\"ip-ar\"><b>أنف</b></bdi> <i>(atıf harfi + isim (ال takılı))</i></li></ul>",
    sentences: [
      { /* 10_2_1#19 */
        arabic: [
          { text: "وَالعَيْن،", root: "عين", category: "atıf harfi + isim (ال takılı)" },
          { text: "وَالأُذُن،", root: "أذن", category: "atıf harfi + isim (ال takılı)" },
          { text: "وَالأَنْف،", root: "أنف", category: "atıf harfi + isim (ال takılı)" },
          { text: "وَاللِّسان،", root: "لسان", category: "atıf harfi + isim (ال takılı)" },
          { text: "وَالأَسْنان،", root: "سن", category: "atıf harfi + ال takılı · isim (kırık çoğul)" },
          { text: "وَاليَد.", root: "يد", category: "atıf harfi + isim (ال takılı)" }
        ],
        turkish: ["Göz,","kulak,","burun,","dil,","dişler,","ve el."],
        turkishFull: "Göz, kulak, burun, dil, dişler, ve el."
      },
      { /* 10_2_1#28 */
        arabic: [
          { text: "مِثْل", root: "مثل", category: "isim (edat görevinde)" },
          { text: "الخَضْرَوات", root: "خضار", category: "ال takılı · isim (çoğul)" },
          { text: "وَالفَواكِه.", root: "فاكهة", category: "atıf harfi + ال takılı · isim (kırık çoğul)" }
        ],
        turkish: ["gibi.","Sebze","ve meyveler"],
        turkishFull: "Sebze ve meyveler gibi."
      },
      { /* 10_2_2#15 */
        arabic: [
          { text: "لِأَنَّ", root: "لأن", category: "ta'lil harfi" },
          { text: "مَناظِرَها", root: "منظر", category: "isim (kırık çoğul) + bitişik zamir" },
          { text: "جَميلَة.", root: "جميل", category: "isim (sıfat · dişil)" }
        ],
        turkish: ["Çünkü","manzaraları","güzeldir."],
        turkishFull: "Çünkü manzaraları güzeldir."
      },
      { /* 10_3_2#6 */
        arabic: [
          { text: "الشّارِع", root: "شارع", category: "isim (ال takılı)" },
          { text: "مُزْدَحِم", root: "مزدحم", category: "isim" },
          { text: "بِالمُواصَلات.", root: "مواصلة", category: "harf-i cer + ال takılı · isim (dişil çoğul)" }
        ],
        turkish: ["Cadde","kalabalıktır.","ulaşım araçlarıyla"],
        turkishFull: "Cadde ulaşım araçlarıyla kalabalıktır."
      },
      { /* 10_4_1#1 */
        arabic: [
          { text: "الفُصولُ", root: "فصل", category: "ال takılı · isim (kırık çoğul)" },
          { text: "أَرْبَعَةٌ.", root: "أربعة", category: "isim (sayı)" }
        ],
        turkish: ["Mevsimler","dörttür."],
        turkishFull: "Mevsimler dörttür."
      }
    ]
  },
  {
    level: 4,
    anahtar: "fiil",
    hint: "<h3 dir=\"ltr\">Seviye 4 · Fiiller: muzariden maziye</h3><p class=\"ip-sinif\" dir=\"ltr\">10. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyelerin kuralları geçerlidir.</li><li>Fiil, sözlükte <b>mazi</b> (geçmiş zaman) biçimiyle aranır: <bdi class=\"ip-ar\">يَكْتُبُ</bdi> → <bdi class=\"ip-ar\">كتب</bdi>.</li><li>Emir kipi de maziye çevrilir: <bdi class=\"ip-ar\">اُكْتُبْ</bdi> → <bdi class=\"ip-ar\">كتب</bdi>.</li><li>Fiile bitişen <b>mef'ûl zamiri</b> (<bdi class=\"ip-ar\">ـني، ـهُ</bdi>) atılır.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">المُسْلِمون</bdi> → <bdi class=\"ip-ar\"><b>مسلم</b></bdi> <i>(ال takılı · isim (eril çoğul))</i></li><li><bdi class=\"ip-ar\">يُساعِدونَ</bdi> → <bdi class=\"ip-ar\"><b>ساعد</b></bdi> <i>(fiil (muzari · mezid))</i></li><li><bdi class=\"ip-ar\">جيرانَهُم</bdi> → <bdi class=\"ip-ar\"><b>جيران</b></bdi> <i>(isim + bitişik zamir (onlar))</i></li></ul>",
    sentences: [
      { /* 10_1_2#1 */
        arabic: [
          { text: "المُسْلِمون", root: "مسلم", category: "ال takılı · isim (eril çoğul)" },
          { text: "يُساعِدونَ", root: "ساعد", category: "fiil (muzari · mezid)" },
          { text: "جيرانَهُم", root: "جيران", category: "isim + bitişik zamir (onlar)" },
          { text: "دائِمًا.", root: "دائما", category: "zarf" }
        ],
        turkish: ["Müslümanlar","yardım ederler.","komşularına","daima"],
        turkishFull: "Müslümanlar komşularına daima yardım ederler."
      },
      { /* 10_1_2#2 */
        arabic: [
          { text: "المُسْلِمون", root: "مسلم", category: "ال takılı · isim (eril çoğul)" },
          { text: "يُساعِدونَ", root: "ساعد", category: "fiil (muzari · mezid)" },
          { text: "المُحْتاجين", root: "محتاج", category: "ال takılı · isim (eril çoğul · mansub)" },
          { text: "وَالمُسِنّين", root: "مسن", category: "atıf harfi + ال takılı · isim (eril çoğul · mansub)" },
          { text: "دائِمًا.", root: "دائما", category: "zarf" }
        ],
        turkish: ["Müslümanlar","yardım ederler.","muhtaçlara","ve yaşlılara","daima"],
        turkishFull: "Müslümanlar muhtaçlara ve yaşlılara daima yardım ederler."
      },
      { /* 10_1_2#4 */
        arabic: [
          { text: "هُم", root: "SKIP", category: "zamir" },
          { text: "يَحْتَرِمونَ", root: "احترم", category: "fiil (muzari · mezid)" },
          { text: "الكِبار.", root: "كبير", category: "ال takılı · isim (kırık çoğul)" }
        ],
        turkish: ["Onlar","saygı duyarlar.","büyüklere"],
        turkishFull: "Onlar büyüklere saygı duyarlar."
      },
      { /* 10_1_2#5 */
        arabic: [
          { text: "هُم", root: "SKIP", category: "zamir" },
          { text: "يُكْرِمونَ", root: "أكرم", category: "fiil (muzari · mezid)" },
          { text: "ضُيوفَهُم.", root: "ضيوف", category: "isim + bitişik zamir (onlar)" }
        ],
        turkish: ["Onlar","ikram ederler.","misafirlerine"],
        turkishFull: "Onlar misafirlerine ikram ederler."
      },
      { /* 10_2_1#23 */
        arabic: [
          { text: "أَحْيانًا", root: "أحيانا", category: "zarf" },
          { text: "أَمْرَضُ.", root: "مرض", category: "fiil (muzari)" }
        ],
        turkish: ["Bazen","hastalanırım."],
        turkishFull: "Bazen hastalanırım."
      },
      { /* 10_2_1#25 */
        arabic: [
          { text: "الطَّبيب", root: "طبيب", category: "isim (ال takılı)" },
          { text: "يَفْحَصُني", root: "فحص", category: "fiil (muzari) + mef'ûl zamiri" },
          { text: "وَيُعالِجُني.", root: "عالج", category: "atıf harfi + fiil (muzari · mezid) + mef'ûl zamiri" }
        ],
        turkish: ["Doktor","beni muayene eder","ve tedavi eder,"],
        turkishFull: "Doktor beni muayene eder ve tedavi eder,"
      },
      { /* 10_2_2#6 */
        arabic: [
          { text: "أُشاهِدُ", root: "شاهد", category: "fiil (muzari · mezid)" },
          { text: "المَسْرَح", root: "مسرح", category: "isim (ال takılı)" },
          { text: "مَع", root: "مع", category: "zarf" },
          { text: "صَديقاتي.", root: "صديقة", category: "isim (dişil çoğul) + bitişik zamir" }
        ],
        turkish: ["izliyorum.","tiyatro","ile","Kız arkadaşlarım"],
        turkishFull: "Kız arkadaşlarım ile tiyatro izliyorum."
      },
      { /* 10_2_2#8 */
        arabic: [
          { text: "نُمارِسُ", root: "مارس", category: "fiil (muzari · mezid · mütekellim çoğul)" },
          { text: "السِّباحَة", root: "سباحة", category: "isim (ال takılı)" },
          { text: "وَالرِّمايَة.", root: "رماية", category: "atıf harfi + isim (ال takılı)" }
        ],
        turkish: ["yapıyoruz.","Yüzme","ve okçuluk"],
        turkishFull: "Yüzme ve okçuluk yapıyoruz."
      },
      { /* 10_2_2#11 */
        arabic: [
          { text: "الأُمّ", root: "أم", category: "isim (ال takılı)" },
          { text: "تُفَضِّلُ", root: "فضل", category: "fiil (muzari · mezid)" },
          { text: "الرَّسْم.", root: "رسم", category: "isim (ال takılı)" }
        ],
        turkish: ["Anne","tercih ediyor.","resmi"],
        turkishFull: "Anne resmi tercih ediyor."
      },
      { /* 10_3_1#7 */
        arabic: [
          { text: "بِمَاذَا", root: "ماذا", category: "harf-i cer + isim" },
          { text: "تَشْتَهِرُ", root: "اشتهر", category: "fiil (muzari · mezid)" },
          { text: "مَدِينَة", root: "مدينة", category: "isim" },
          { text: "قُونْيَا.", root: "SKIP", category: "isim (özel · yer)" }
        ],
        turkish: ["ne ile","meşhurdur?","şehri","Konya"],
        turkishFull: "Konya şehri ne ile meşhurdur?"
      },
      { /* 10_3_1#8 */
        arabic: [
          { text: "تَشْتَهِرُ", root: "اشتهر", category: "fiil (muzari · mezid)" },
          { text: "بِمُتْحَف", root: "متحف", category: "harf-i cer + isim" },
          { text: "مَوْلَانَا.", root: "SKIP", category: "isim (özel · yer)" }
        ],
        turkish: ["meşhurdur.","müzesi ile","Mevlana"],
        turkishFull: "Mevlana müzesi ile meşhurdur."
      },
      { /* 10_3_1#18 */
        arabic: [
          { text: "تَشْتَهِرُ", root: "اشتهر", category: "fiil (muzari · mezid)" },
          { text: "مَرْسِين", root: "SKIP", category: "isim (özel · yer)" },
          { text: "بِقَلْعَة", root: "قلعة", category: "harf-i cer + isim" },
          { text: "الْفَتَاة.", root: "فتاة", category: "ال takılı · isim" }
        ],
        turkish: ["meşhurdur.","Mersin","kalesi ile","kız"],
        turkishFull: "Mersin kız kalesi ile meşhurdur."
      },
      { /* 10_3_1#35 */
        arabic: [
          { text: "تَشْتَهِرُ", root: "اشتهر", category: "fiil (muzari · mezid)" },
          { text: "تُرْكِيا", root: "SKIP", category: "isim (özel · yer)" },
          { text: "بِأَماكِنِها", root: "مكان", category: "harf-i cer + isim (kırık çoğul) + bitişik zamir" },
          { text: "التّاريخِيَّة", root: "تاريخي", category: "ال takılı · isim (nisbet · dişil)" },
          { text: "وَالسِّياحِيَّة.", root: "سياحي", category: "atıf harfi + isim (nisbet · dişil)" }
        ],
        turkish: ["meşhurdur.","Türkiye","mekanlarıyla","tarihi","ve turistik"],
        turkishFull: "Türkiye tarihi ve turistik mekanlarıyla meşhurdur."
      },
      { /* 10_3_1#39 */
        arabic: [
          { text: "أَخْدِمُهُ", root: "خدم", category: "fiil (muzari) + mef'ûl zamiri" },
          { text: "بِعِلْمي", root: "علم", category: "harf-i cer + isim + bitişik zamir" },
          { text: "وَعَمَلي.", root: "عمل", category: "atıf harfi + isim + bitişik zamir (ben)" }
        ],
        turkish: ["ona hizmet ederim.","İlmimle","ve amelimle"],
        turkishFull: "İlmimle ve amelimle ona hizmet ederim."
      },
      { /* 10_3_2#3 */
        arabic: [
          { text: "سَأَرْجِعُ", root: "رجع", category: "sin harfi + fiil (muzari)" },
          { text: "الأُسْبوع", root: "أسبوع", category: "isim (ال takılı)" },
          { text: "القادِم", root: "قادم", category: "isim (ال takılı)" },
          { text: "بِالحافِلَة.", root: "حافلة", category: "harf-i cer + isim (ال takılı)" }
        ],
        turkish: ["döneceğim.","hafta","Gelecek","otobüsle"],
        turkishFull: "Gelecek hafta otobüsle döneceğim."
      },
      { /* 10_4_1#16 */
        arabic: [
          { text: "أَصْبَحَ", root: "أصبح", category: "fiil (mazi · mezid)" },
          { text: "الجَوُّ", root: "جو", category: "isim (ال takılı)" },
          { text: "حارًّا.", root: "حار", category: "isim (tenvinli)" }
        ],
        turkish: ["oldu.","Hava","sıcak"],
        turkishFull: "Hava sıcak oldu."
      },
      { /* 10_4_1#17 */
        arabic: [
          { text: "يَنْزِلُ", root: "نزل", category: "fiil (muzari)" },
          { text: "الثَّلْجُ", root: "ثلج", category: "isim (ال takılı)" }
        ],
        turkish: ["yağıyor.","Kar"],
        turkishFull: "Kar yağıyor."
      },
      { /* 10_4_1#20 */
        arabic: [
          { text: "أُنَظِّفُ", root: "نظف", category: "fiil (muzari · mezid)" },
          { text: "غُرْفَتي.", root: "غرفة", category: "isim + bitişik zamir (ben)" }
        ],
        turkish: ["temizlerim.","Odamı"],
        turkishFull: "Odamı temizlerim."
      },
      { /* 10_4_1#21 */
        arabic: [
          { text: "اِنْتَبِهْ", root: "انتبه", category: "fiil (emir · mezid)" },
          { text: "لِنَفْسِكَ!", root: "نفس", category: "harf-i cer + isim + bitişik zamir" }
        ],
        turkish: ["dikkat et!","Kendine"],
        turkishFull: "Kendine dikkat et!"
      },
      { /* 10_4_2#7 */
        arabic: [
          { text: "أَدْفَعُ", root: "دفع", category: "fiil (muzari)" },
          { text: "نَقْدًا.", root: "نقد", category: "isim (tenvinli)" }
        ],
        turkish: ["ödüyorum.","Nakit"],
        turkishFull: "Nakit ödüyorum."
      }
    ]
  },
  {
    level: 5,
    anahtar: "illetli",
    hint: "<h3 dir=\"ltr\">Seviye 5 · İlletli ve mezid fiiller</h3><p class=\"ip-sinif\" dir=\"ltr\">10. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyelerin tümü geçerlidir.</li><li><b>Ecvef</b> (ortası illetli): <bdi class=\"ip-ar\">يَنامُ</bdi> → <bdi class=\"ip-ar\">نام</bdi> &nbsp;·&nbsp; <b>Misal</b> (başı illetli): <bdi class=\"ip-ar\">يَقِفُ</bdi> → <bdi class=\"ip-ar\">وقف</bdi></li><li><b>Nâkıs</b> (sonu illetli): <bdi class=\"ip-ar\">يُصَلّي</bdi> → <bdi class=\"ip-ar\">صلى</bdi> &nbsp;·&nbsp; <b>Mehmuz</b>: <bdi class=\"ip-ar\">يَأْكُلُ</bdi> → <bdi class=\"ip-ar\">أكل</bdi></li><li><b>Mudâaf</b> (şeddeli): <bdi class=\"ip-ar\">يُحِبُّ</bdi> → <bdi class=\"ip-ar\">أحب</bdi> &nbsp;·&nbsp; <b>Mezid</b> fiil kendi mazisiyle aranır: <bdi class=\"ip-ar\">يَسْتَيْقِظُ</bdi> → <bdi class=\"ip-ar\">استيقظ</bdi></li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">والِدَتي</bdi> → <bdi class=\"ip-ar\"><b>والدة</b></bdi> <i>(isim + bitişik zamir (ben))</i></li><li><bdi class=\"ip-ar\">البَيْت،</bdi> → <bdi class=\"ip-ar\"><b>بيت</b></bdi> <i>(isim (ال takılı))</i></li><li><bdi class=\"ip-ar\">تَهْتَمُّ</bdi> → <bdi class=\"ip-ar\"><b>اهتم</b></bdi> <i>(fiil (muzari · mezid · mudâaf))</i></li></ul>",
    sentences: [
      { /* 10_1_1#8 */
        arabic: [
          { text: "والِدَتي", root: "والدة", category: "isim + bitişik zamir (ben)" },
          { text: "رَبَّة", root: "ربة", category: "isim" },
          { text: "البَيْت،", root: "بيت", category: "isim (ال takılı)" },
          { text: "وَهِيَ", root: "SKIP", category: "atıf harfi + zamir" },
          { text: "تَهْتَمُّ", root: "اهتم", category: "fiil (muzari · mezid · mudâaf)" },
          { text: "بِعائِلَتِنا.", root: "عائلة", category: "harf-i cer + isim + bitişik zamir (biz)" }
        ],
        turkish: ["Annem","ev","hanımıdır","ve o","ilgilenir.","ailemizle"],
        turkishFull: "Annem ev hanımıdır ve o ailemizle ilgilenir."
      },
      { /* 10_1_1#9 */
        arabic: [
          { text: "أَنا", root: "SKIP", category: "zamir" },
          { text: "سائِق،", root: "سائق", category: "isim (ism-i fâil)" },
          { text: "أَسوقُ", root: "ساق", category: "fiil (muzari · ecvef)" },
          { text: "سَيّارَة", root: "سيارة", category: "isim" },
          { text: "أُجْرَة.", root: "أجرة", category: "isim" }
        ],
        turkish: ["Ben","şoförüm,","sürüyorum.","taksi","ticari/ücretli"],
        turkishFull: "Ben şoförüm, ticari/ücretli taksi sürüyorum."
      },
      { /* 10_1_2#3 */
        arabic: [
          { text: "هُم", root: "SKIP", category: "zamir" },
          { text: "يُحِبّونَ", root: "أحب", category: "fiil (muzari · mudâaf)" },
          { text: "الصِّغار.", root: "صغير", category: "ال takılı · isim (kırık çoğul)" }
        ],
        turkish: ["Onlar","severler.","küçükleri"],
        turkishFull: "Onlar küçükleri severler."
      },
      { /* 10_1_2#8 */
        arabic: [
          { text: "كُنْ", root: "كان", category: "fiil (emir · ecvef)" },
          { text: "مَبْسوطًا.", root: "مبسوط", category: "isim (sıfat · tenvinli)" }
        ],
        turkish: ["ol.","Mutlu"],
        turkishFull: "Mutlu ol."
      },
      { /* 10_1_2#10 */
        arabic: [
          { text: "كوني", root: "كان", category: "fiil (emir · ecvef · dişil)" },
          { text: "مُبْتَسِمَة.", root: "مبتسم", category: "isim (ism-i fâil · dişil)" }
        ],
        turkish: ["ol.","Güler yüzlü"],
        turkishFull: "Güler yüzlü ol."
      },
      { /* 10_2_1#21 */
        arabic: [
          { text: "وَأَشُمُّ", root: "شم", category: "atıf harfi + fiil (muzari · mudâaf)" },
          { text: "بِأَنْفي،", root: "أنف", category: "harf-i cer + isim + bitişik zamir" },
          { text: "وَأَذوقُ", root: "ذاق", category: "atıf harfi + fiil (muzari · ecvef)" },
          { text: "بِلِساني.", root: "لسان", category: "harf-i cer + isim + bitişik zamir" }
        ],
        turkish: ["koklarım,","Burnumla","ve tadarım.","dilimle"],
        turkishFull: "Burnumla koklarım, dilimle ve tadarım."
      },
      { /* 10_2_1#34 */
        arabic: [
          { text: "آكُلُ", root: "أكل", category: "fiil (muzari · mehmuz)" },
          { text: "الخَضْرَوات", root: "خضار", category: "ال takılı · isim (çoğul)" },
          { text: "وَالفَواكِه.", root: "فاكهة", category: "atıf harfi + ال takılı · isim (kırık çoğul)" }
        ],
        turkish: ["yiyorum.","Sebze","ve meyve"],
        turkishFull: "Sebze ve meyve yiyorum."
      },
      { /* 10_2_2#3 */
        arabic: [
          { text: "أُحِبُّ", root: "أحب", category: "fiil (muzari · mudâaf)" },
          { text: "قِراءَة", root: "قراءة", category: "isim (mastar)" },
          { text: "الكُتُب.", root: "كتاب", category: "ال takılı · isim (kırık çoğul)" }
        ],
        turkish: ["seviyorum.","okumayı","Kitap"],
        turkishFull: "Kitap okumayı seviyorum."
      },
      { /* 10_2_2#12 */
        arabic: [
          { text: "الأَب", root: "أب", category: "isim (ال takılı)" },
          { text: "يُريدُ", root: "أراد", category: "fiil (muzari · ecvef · mezid)" },
          { text: "مُشاهَدَة", root: "مشاهدة", category: "isim (mastar)" },
          { text: "السّينَما.", root: "سينما", category: "isim (ال takılı)" }
        ],
        turkish: ["Baba","istiyor.","izlemeyi","sinema"],
        turkishFull: "Baba sinema izlemeyi istiyor."
      },
      { /* 10_3_1#5 */
        arabic: [
          { text: "أَيْنَ", root: "أين", category: "soru ismi" },
          { text: "تَعِيشُ؟", root: "عاش", category: "fiil (muzari · ecvef)" }
        ],
        turkish: ["Nerede","yaşıyorsun?"],
        turkishFull: "Nerede yaşıyorsun?"
      },
      { /* 10_3_1#33 */
        arabic: [
          { text: "أُحِبُّ", root: "أحب", category: "fiil (muzari · mudâaf)" },
          { text: "وَطَني", root: "وطن", category: "isim + bitişik zamir (ben)" },
          { text: "كَثيرًا.", root: "كثيرا", category: "zarf" }
        ],
        turkish: ["seviyorum.","Vatanımı","çok"],
        turkishFull: "Vatanımı çok seviyorum."
      },
      { /* 10_3_1#34 */
        arabic: [
          { text: "لِأَنَّني", root: "لأن", category: "ta'lil harfi + bitişik zamir" },
          { text: "أَعيشُ", root: "عاش", category: "fiil (muzari · ecvef)" },
          { text: "فيه", root: "فيه", category: "harf-i cer + bitişik zamir" },
          { text: "حُرًّا", root: "حر", category: "isim (sıfat · tenvinli)" },
          { text: "تَحْت", root: "تحت", category: "zarf" },
          { text: "العَلَم.", root: "علم", category: "isim (ال takılı)" }
        ],
        turkish: ["Çünkü ben","yaşıyorum.","orada","özgürce","altında","bayrak"],
        turkishFull: "Çünkü ben orada bayrak altında özgürce yaşıyorum."
      },
      { /* 10_3_1#42 */
        arabic: [
          { text: "تَقَعُ", root: "وقع", category: "fiil (muzari · misal)" },
          { text: "تُرْكِيا", root: "SKIP", category: "isim (özel · yer)" },
          { text: "بَيْنَ", root: "بين", category: "zarf" },
          { text: "آسْيا", root: "SKIP", category: "isim (özel · yer)" },
          { text: "وَأوروبّا.", root: "SKIP", category: "atıf harfi + isim (özel · yer)" }
        ],
        turkish: ["bulunur.","Türkiye","arasında","Asya","ve Avrupa"],
        turkishFull: "Türkiye Asya ve Avrupa arasında bulunur."
      },
      { /* 10_3_1#48 */
        arabic: [
          { text: "مَاذَا", root: "ماذا", category: "soru ismi" },
          { text: "تُرِيدُ؟", root: "أراد", category: "fiil (muzari · ecvef · mezid)" }
        ],
        turkish: ["Ne","istiyorsun?"],
        turkishFull: "Ne istiyorsun?"
      },
      { /* 10_3_1#49 */
        arabic: [
          { text: "أُرِيدُ", root: "أراد", category: "fiil (muzari · ecvef · mezid)" },
          { text: "تَذْكِرَةً", root: "تذكرة", category: "isim" },
          { text: "لِلْقِطَارِ", root: "قطار", category: "harf-i cer + isim (ال takılı)" },
          { text: "السَّرِيع.", root: "سريع", category: "isim (ال takılı)" }
        ],
        turkish: ["istiyorum.","bilet","tren için","Hızlı"],
        turkishFull: "Hızlı tren için bilet istiyorum."
      },
      { /* 10_4_1#14 */
        arabic: [
          { text: "أَيْنَ", root: "أين", category: "soru ismi" },
          { text: "سَتَقْضي", root: "قضى", category: "sin harfi + fiil (muzari · nakıs)" },
          { text: "العُطْلَةَ؟", root: "عطلة", category: "isim (ال takılı)" }
        ],
        turkish: ["nerede","geçireceksin?","Tatili"],
        turkishFull: "Tatili nerede geçireceksin?"
      },
      { /* 10_4_1#15 */
        arabic: [
          { text: "كانَ", root: "كان", category: "fiil (mazi · ecvef)" },
          { text: "الطَّقْسُ", root: "طقس", category: "isim (ال takılı)" },
          { text: "بارِدًا", root: "بارد", category: "isim (tenvinli)" },
          { text: "أَمْسِ.", root: "أمس", category: "zarf (zaman)" }
        ],
        turkish: ["idi.","Hava","soğuk","dün"],
        turkishFull: "Hava dün soğuk idi."
      },
      { /* 10_4_1#18 */
        arabic: [
          { text: "أَنا", root: "SKIP", category: "zamir" },
          { text: "أَهْتَمُّ", root: "اهتم", category: "fiil (muzari · mezid · mudâaf)" },
          { text: "بِالبيئَةِ.", root: "بيئة", category: "harf-i cer + isim (ال takılı)" }
        ],
        turkish: ["Ben","özen gösteririm.","çevreye"],
        turkishFull: "Ben çevreye özen gösteririm."
      },
      { /* 10_4_2#3 */
        arabic: [
          { text: "أُريدُ", root: "أراد", category: "fiil (muzari · ecvef · mezid)" },
          { text: "كيلو", root: "كيلو", category: "isim" },
          { text: "سُكَّرٍ.", root: "سكر", category: "isim" }
        ],
        turkish: ["istiyorum.","Bir kilo","şeker"],
        turkishFull: "Bir kilo şeker istiyorum."
      },
      { /* 10_4_2#5 */
        arabic: [
          { text: "كَمْ", root: "كم", category: "soru ismi" },
          { text: "كيلو", root: "كيلو", category: "isim" },
          { text: "تُريدُ؟", root: "أراد", category: "fiil (muzari · ecvef · mezid)" }
        ],
        turkish: ["Kaç","kilo","istiyorsun?"],
        turkishFull: "Kaç kilo istiyorsun?"
      },
      { /* 10_4_2#6 */
        arabic: [
          { text: "أُريدُ", root: "أراد", category: "fiil (muzari · ecvef · mezid)" },
          { text: "عُلْبَةَ", root: "علبة", category: "isim" },
          { text: "شايٍ.", root: "شاي", category: "isim" }
        ],
        turkish: ["istiyorum.","Bir kutu","çay"],
        turkishFull: "Bir kutu çay istiyorum."
      },
      { /* 10_4_2#11 */
        arabic: [
          { text: "أَيَّ", root: "أي", category: "soru ismi" },
          { text: "لَوْنٍ", root: "لون", category: "isim" },
          { text: "تُريدُ؟", root: "أراد", category: "fiil (muzari · ecvef · mezid)" }
        ],
        turkish: ["Hangi","rengi","istersin?"],
        turkishFull: "Hangi rengi istersin?"
      }
    ]
  }
  ]
};
