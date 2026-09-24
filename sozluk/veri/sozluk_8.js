/* =====================================================================
   SÖZLÜK SİMÜLASYONU — 8. SINIF VERİSİ            (üretilmiş dosya)
   ---------------------------------------------------------------------
   KAYNAK: muhadese/veri/8_1_1 … 8_6_3 ders cümleleri (6 ünite, 18 ders).
   Arapça ELLE YAZILMADI; ders verisinden alındı.
   KÖK: üç harfli sarf kökü değil, SÖZLÜKTE ARANAN yalın biçim
   (ال atılır, bitişik zamir atılır, çoğul tekile döner, fiil maziye).
   Bu alanlar sozluk/cozumleyici.py ile sitenin KENDİ sözlük/kök
   verisinden türetildi; motorun doğruluğu 5/6/7/9/10. sınıfların
   elden geçmiş çözümleriyle ölçüldü (kök TAM %78.8, YANLIŞ %6.4 —
   bkz. sozluk/sina_cozumleyici.py).
   Bir kelimesi bile çözülemeyen cümle ALINMADI: veri azalır ama
   yanlış dilbilgisi çıkmaz.
   ÜRETİCİ: sozluk/uret_sozluk8.py — ders verisi değişirse yeniden üret.
   ===================================================================== */
window.SOZLUK_SINIF = window.SOZLUK_SINIF || {};
window.SOZLUK_SINIF["8"] = {
  "sinif": 8,
  "cumle": 444,
  "kelime": 1924,
  "seviyeler": [
    {
      "level": 1,
      "anahtar": "al",
      "hint": "<h3 dir=\"ltr\">Seviye 1 · <bdi class=\"ip-ar\">ال</bdi> takısı ve yalın isim</h3><p class=\"ip-sinif\" dir=\"ltr\">8. sınıf muhâdese cümlelerinden</p><ul><li>Kelimenin başındaki <bdi class=\"ip-ar\">ال</bdi> takısı atılır: <bdi class=\"ip-ar\">النّادي</bdi> → <bdi class=\"ip-ar\">نادي</bdi>.</li><li>Harekeler ve sondaki tenvin yazılmaz.</li><li>Harf-i cer kelimeye bitişikse o da atılır: <bdi class=\"ip-ar\">بِالرِّياضَة</bdi> → <bdi class=\"ip-ar\">رياضة</bdi>.</li><li>Özel adlar (kişi, şehir) sözlükte aranmaz, atlanır.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">المَكْتَبَة!</bdi> → <bdi class=\"ip-ar\"><b>مكتبة</b></bdi> <i>(isim (ال takılı))</i></li><li><bdi class=\"ip-ar\">المَسْرَحِيَّة.</bdi> → <bdi class=\"ip-ar\"><b>مسرحية</b></bdi> <i>(isim (ال takılı · dişil))</i></li><li><bdi class=\"ip-ar\">بِالمَدْرَسَة.</bdi> → <bdi class=\"ip-ar\"><b>مدرسة</b></bdi> <i>(harf-i cer + isim (ال takılı))</i></li><li><bdi class=\"ip-ar\">السّاعَة</bdi> → <bdi class=\"ip-ar\"><b>ساعة</b></bdi> <i>(isim (ال takılı))</i></li><li><bdi class=\"ip-ar\">الواحِدَة.</bdi> → <bdi class=\"ip-ar\"><b>واحدة</b></bdi> <i>(isim (ال takılı · dişil))</i></li><li><bdi class=\"ip-ar\">والرُّبْع.</bdi> → <bdi class=\"ip-ar\"><b>ربع</b></bdi> <i>(atıf harfi + isim (ال takılı))</i></li></ul>",
      "sentences": [
        {
          "arabic": [
            {
              "text": "نَعَم،",
              "root": "نعم",
              "category": "cevap harfi"
            },
            {
              "text": "صَحيح!",
              "root": "صحيح",
              "category": "isim"
            }
          ],
          "turkish": [
            "Evet,",
            "doğru!"
          ],
          "turkishFull": "Evet, doğru!",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "إِذَنْ،",
              "root": "إذن",
              "category": "isim"
            },
            {
              "text": "أَنْتَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "عُضْو",
              "root": "عضو",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "المَكْتَبَة!",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Öyleyse",
            "sen",
            "üyesisin!",
            "kulübünün",
            "kütüphane",
            "—"
          ],
          "turkishFull": "Öyleyse sen kütüphane kulübünün üyesisin!",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "مَرْحَبًا",
              "root": "مرحب",
              "category": "isim"
            },
            {
              "text": "سُمَيَّة،",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "أَيْن",
              "root": "أين",
              "category": "soru edatı"
            },
            {
              "text": "أنتِ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "ذاهِبَة؟",
              "root": "ذاهب",
              "category": "isim (ism-i fâil · dişil)"
            }
          ],
          "turkish": [
            "Merhaba",
            "Sümeyye,",
            "nereye",
            "gidiyorsun?",
            "—",
            "—"
          ],
          "turkishFull": "Merhaba Sümeyye, nereye gidiyorsun?",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "هَل",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "أنتِ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "مُمَثِّلَة؟",
              "root": "ممثلة",
              "category": "isim (ism-i fâil · dişil)"
            }
          ],
          "turkish": [
            "musun?",
            "Sen",
            "oyuncu"
          ],
          "turkishFull": "Sen oyuncu musun?",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "نَعَم،",
              "root": "نعم",
              "category": "cevap harfi"
            },
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "مُمَثِّلَة",
              "root": "ممثلة",
              "category": "isim (ism-i fâil · dişil)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "المَسْرَحِيَّة.",
              "root": "مسرحية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Evet,",
            "ben",
            "oyuncuyum.",
            "tiyatro oyununda",
            "—"
          ],
          "turkishFull": "Evet, ben tiyatro oyununda oyuncuyum.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "المَسْرَحِيَّة",
              "root": "مسرحية",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "المَكْتَبَة.",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Tiyatro oyunu",
            "kütüphanede.",
            "—"
          ],
          "turkishFull": "Tiyatro oyunu kütüphanede.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "سُمَيَّة",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "مُمَثِّلَة",
              "root": "ممثلة",
              "category": "isim (ism-i fâil · dişil)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "المَسْرَحِيَّة.",
              "root": "مسرحية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Sümeyye",
            "oyuncu.",
            "tiyatro oyununda",
            "—"
          ],
          "turkishFull": "Sümeyye tiyatro oyununda oyuncu.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "مُمَثِّل",
              "root": "ممثل",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "المَسْرَحِيَّة",
              "root": "مسرحية",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "بِالمَدْرَسَة.",
              "root": "مدرسة",
              "category": "harf-i cer + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "oyuncuyum.",
            "tiyatro oyununda",
            "okuldaki",
            "—"
          ],
          "turkishFull": "Ben okuldaki tiyatro oyununda oyuncuyum.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "مُمَثِّلَة",
              "root": "ممثلة",
              "category": "isim (ism-i fâil · dişil)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "المَسْرَحِيَّة.",
              "root": "مسرحية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Ben",
            "oyuncuyum.",
            "tiyatro oyununda",
            "—"
          ],
          "turkishFull": "Ben tiyatro oyununda oyuncuyum.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "هُوَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "مُمَثِّل",
              "root": "ممثل",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "المَسْرَحِيَّة.",
              "root": "مسرحية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "O (erkek)",
            "oyuncu.",
            "tiyatro oyununda",
            "—"
          ],
          "turkishFull": "O (erkek) tiyatro oyununda oyuncu.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الواحِدَة.",
              "root": "واحدة",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Saat",
            "bir."
          ],
          "turkishFull": "Saat bir.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الواحِدَة",
              "root": "واحدة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "والرُّبْع.",
              "root": "ربع",
              "category": "atıf harfi + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Saat",
            "biri",
            "çeyrek geçiyor."
          ],
          "turkishFull": "Saat biri çeyrek geçiyor.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الواحِدَة",
              "root": "واحدة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "والنِّصْف.",
              "root": "نصف",
              "category": "atıf harfi + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Saat",
            "bir",
            "buçuk."
          ],
          "turkishFull": "Saat bir buçuk.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الثّانيَة",
              "root": "ثانية",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "إِلّا",
              "root": "إلا",
              "category": "istisna edatı"
            },
            {
              "text": "رُبْعًا.",
              "root": "ربعا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Saat",
            "ikiye",
            "çeyrek var.",
            "—"
          ],
          "turkishFull": "Saat ikiye çeyrek var.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الرّابِعَة",
              "root": "رابعة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "والنِّصْف.",
              "root": "نصف",
              "category": "atıf harfi + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Saat",
            "dört",
            "buçuk."
          ],
          "turkishFull": "Saat dört buçuk.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الخامِسَة",
              "root": "خامسة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "والرُّبْع.",
              "root": "ربع",
              "category": "atıf harfi + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Saat",
            "beşi",
            "çeyrek geçiyor."
          ],
          "turkishFull": "Saat beşi çeyrek geçiyor.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "السّادِسَة",
              "root": "سادسة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "إِلّا",
              "root": "إلا",
              "category": "istisna edatı"
            },
            {
              "text": "رُبْعًا.",
              "root": "ربعا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Saat",
            "altıya",
            "çeyrek var.",
            "—"
          ],
          "turkishFull": "Saat altıya çeyrek var.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "عَفْوًا،",
              "root": "عفوا",
              "category": "kalıp"
            },
            {
              "text": "زِيارَة",
              "root": "زيارة",
              "category": "isim"
            },
            {
              "text": "مُمْتِعَة.",
              "root": "ممتع",
              "category": "isim (sıfat · dişil)"
            }
          ],
          "turkish": [
            "Rica ederim,",
            "keyifli bir ziyaret.",
            "—"
          ],
          "turkishFull": "Rica ederim, keyifli bir ziyaret.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "قَريبَة",
              "root": "قريب",
              "category": "isim (sıfat · dişil)"
            },
            {
              "text": "مِنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "هُنا.",
              "root": "هنا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Okul",
            "yakın.",
            "buraya",
            "—"
          ],
          "turkishFull": "Okul buraya yakın.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "المَكْتَبَة",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "بَعيدَة",
              "root": "بعيد",
              "category": "isim (sıfat · dişil)"
            },
            {
              "text": "عَنْ",
              "root": "عن",
              "category": "harf-i cer"
            },
            {
              "text": "البَيْت.",
              "root": "بيت",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Kütüphane",
            "uzak.",
            "evden",
            "—"
          ],
          "turkishFull": "Kütüphane evden uzak.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "قَريبَة",
              "root": "قريب",
              "category": "isim (sıfat · dişil)"
            },
            {
              "text": "مِنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "هُنا.",
              "root": "هنا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Okul",
            "yakın.",
            "buraya",
            "—"
          ],
          "turkishFull": "Okul buraya yakın.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "قَريبَة",
              "root": "قريب",
              "category": "isim (sıfat · dişil)"
            },
            {
              "text": "مِنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "المُسْتَشْفى.",
              "root": "مستشفى",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Okul",
            "yakın.",
            "hastaneye",
            "—"
          ],
          "turkishFull": "Okul hastaneye yakın.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "الجَوّ",
              "root": "جو",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "هذه",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "المَدينَة",
              "root": "مدينة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "بارِد",
              "root": "بارد",
              "category": "isim"
            },
            {
              "text": "أَمْ",
              "root": "أم",
              "category": "isim"
            },
            {
              "text": "حارّ؟",
              "root": "حار",
              "category": "isim"
            }
          ],
          "turkish": [
            "hava",
            "Bu şehirde",
            "soğuk mu",
            "sıcak mı?",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Bu şehirde hava soğuk mu sıcak mı?",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "أَنْطالْيا",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "مَدينَة",
              "root": "مدينة",
              "category": "isim"
            },
            {
              "text": "سِياحِيَّة",
              "root": "سياحة",
              "category": "isim (dişil)"
            },
            {
              "text": "وجَميلَة.",
              "root": "جميل",
              "category": "atıf harfi + isim (sıfat · dişil)"
            }
          ],
          "turkish": [
            "Antalya",
            "bir şehirdir.",
            "turistik ve güzel",
            "—"
          ],
          "turkishFull": "Antalya turistik ve güzel bir şehirdir.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "هل",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "عُضْوٌ",
              "root": "عضو",
              "category": "isim"
            },
            {
              "text": "أنتَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "المَكْتَبَة؟",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "üye misin?",
            "Sen",
            "kütüphane kulübünde",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Sen kütüphane kulübünde üye misin?",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "مُنير",
              "root": "منير",
              "category": "isim"
            },
            {
              "text": "عُضْو",
              "root": "عضو",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "المَكْتَبَة.",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Münir",
            "üyedir.",
            "kütüphane kulübünde",
            "—",
            "—"
          ],
          "turkishFull": "Münir kütüphane kulübünde üyedir.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "الصُّنْدوق",
              "root": "صندوق",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "زاوِيَة",
              "root": "زاوية",
              "category": "isim"
            },
            {
              "text": "الغُرْفَة.",
              "root": "غرفة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sandık",
            "odanın köşesinde.",
            "—",
            "—"
          ],
          "turkishFull": "Sandık odanın köşesinde.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "شَهْرِيار",
              "root": "شهريار",
              "category": "isim"
            },
            {
              "text": "مَلِكٌ",
              "root": "ملك",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "سَمَرْقَنْد.",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            }
          ],
          "turkish": [
            "Şehriyar",
            "bir hükümdardır.",
            "Semerkant'ta",
            "—"
          ],
          "turkishFull": "Şehriyar Semerkant'ta bir hükümdardır.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "الحِمار",
              "root": "حمار",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لَيْسَ",
              "root": "ليس",
              "category": "edat"
            },
            {
              "text": "هُنا.",
              "root": "هنا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Eşek",
            "burada değil.",
            "—"
          ],
          "turkishFull": "Eşek burada değil.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "أَهْلًا",
              "root": "أهلا",
              "category": "zarf"
            },
            {
              "text": "وسَهْلًا.",
              "root": "سهلا",
              "category": "atıf harfi + zarf"
            }
          ],
          "turkish": [
            "Hoş geldiniz.",
            "—"
          ],
          "turkishFull": "Hoş geldiniz.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "شُكْرًا",
              "root": "شكرا",
              "category": "zarf"
            },
            {
              "text": "جَزيلًا.",
              "root": "جزيل",
              "category": "isim"
            }
          ],
          "turkish": [
            "teşekkürler.",
            "Çok"
          ],
          "turkishFull": "Çok teşekkürler.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "عَفْوًا.",
              "root": "عفوا",
              "category": "kalıp"
            }
          ],
          "turkish": [
            "Rica ederim."
          ],
          "turkishFull": "Rica ederim.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "سُلَيْمان",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "المَنْزِل.",
              "root": "منزل",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Süleyman",
            "evde.",
            "—"
          ],
          "turkishFull": "Süleyman evde.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "خَفيف",
              "root": "خفيف",
              "category": "isim"
            },
            {
              "text": "ثَقيل",
              "root": "ثقيل",
              "category": "isim"
            }
          ],
          "turkish": [
            "hafif",
            "—"
          ],
          "turkishFull": "hafif — ağır",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "صَغير",
              "root": "صغير",
              "category": "isim"
            },
            {
              "text": "كَبير",
              "root": "كبير",
              "category": "isim"
            }
          ],
          "turkish": [
            "küçük",
            "—"
          ],
          "turkishFull": "küçük — büyük",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "قَصير",
              "root": "قصير",
              "category": "isim"
            },
            {
              "text": "طَويل",
              "root": "طويل",
              "category": "isim"
            }
          ],
          "turkish": [
            "kısa",
            "—"
          ],
          "turkishFull": "kısa — uzun",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "قَديم",
              "root": "قديم",
              "category": "isim"
            },
            {
              "text": "جَديد",
              "root": "جديد",
              "category": "isim"
            }
          ],
          "turkish": [
            "eski",
            "—"
          ],
          "turkishFull": "eski — yeni",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "قَريب",
              "root": "قريب",
              "category": "isim"
            },
            {
              "text": "بَعيد",
              "root": "بعيد",
              "category": "isim"
            }
          ],
          "turkish": [
            "yakın",
            "—"
          ],
          "turkishFull": "yakın — uzak",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "واسِع",
              "root": "واسع",
              "category": "isim"
            },
            {
              "text": "ضَيِّق",
              "root": "ضيق",
              "category": "isim"
            }
          ],
          "turkish": [
            "geniş",
            "—"
          ],
          "turkishFull": "geniş — dar",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "بارِد",
              "root": "بارد",
              "category": "isim"
            },
            {
              "text": "حارّ",
              "root": "حار",
              "category": "isim"
            }
          ],
          "turkish": [
            "soğuk",
            "—"
          ],
          "turkishFull": "soğuk — sıcak",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "كَثير",
              "root": "كثير",
              "category": "isim"
            },
            {
              "text": "قَليل",
              "root": "قليل",
              "category": "isim"
            }
          ],
          "turkish": [
            "çok",
            "—"
          ],
          "turkishFull": "çok — az",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "جَميل",
              "root": "جميل",
              "category": "isim"
            },
            {
              "text": "قَبيح",
              "root": "قبيح",
              "category": "isim"
            }
          ],
          "turkish": [
            "güzel",
            "—"
          ],
          "turkishFull": "güzel — çirkin",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "الشَّجَرَة",
              "root": "شجرة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الطَّويلَة",
              "root": "طويل",
              "category": "isim (sıfat · ال takılı · dişil)"
            },
            {
              "text": "أمام",
              "root": "أمام",
              "category": "zarf"
            },
            {
              "text": "المَنْزِل.",
              "root": "منزل",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Uzun ağaç",
            "evin önünde.",
            "—",
            "—"
          ],
          "turkishFull": "Uzun ağaç evin önünde.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "الطَّريق",
              "root": "طريق",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الواسِع",
              "root": "واسع",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "geniş yol",
            "—"
          ],
          "turkishFull": "geniş yol",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "الصُّنْدوق",
              "root": "صندوق",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الأَسْوَد",
              "root": "أسود",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "siyah sandık",
            "—"
          ],
          "turkishFull": "siyah sandık",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "الكِتاب",
              "root": "كتاب",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الجَديد",
              "root": "جديد",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "yeni kitap",
            "—"
          ],
          "turkishFull": "yeni kitap",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "القِطَّة",
              "root": "قطة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الصَّغيرَة",
              "root": "صغير",
              "category": "isim (sıfat · ال takılı · dişil)"
            }
          ],
          "turkish": [
            "küçük kedi",
            "—"
          ],
          "turkishFull": "küçük kedi",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "الكَلْب",
              "root": "كلب",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الكَبير",
              "root": "كبير",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "büyük köpek",
            "—"
          ],
          "turkishFull": "büyük köpek",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "الشَّجَرَة",
              "root": "شجرة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الطَّويلَة",
              "root": "طويل",
              "category": "isim (sıfat · ال takılı · dişil)"
            }
          ],
          "turkish": [
            "uzun ağaç",
            "—"
          ],
          "turkishFull": "uzun ağaç",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "ما",
              "root": "ما",
              "category": "edat"
            },
            {
              "text": "اسْم",
              "root": "اسم",
              "category": "isim"
            },
            {
              "text": "هذا",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "الفَنّ؟",
              "root": "فن",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Bu sanatın adı",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Bu sanatın adı",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "أَهْلًا",
              "root": "أهلا",
              "category": "zarf"
            },
            {
              "text": "وسَهْلًا.",
              "root": "سهلا",
              "category": "atıf harfi + zarf"
            },
            {
              "text": "هذا",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "فَنّ",
              "root": "فن",
              "category": "isim"
            },
            {
              "text": "الخَزَف",
              "root": "خزف",
              "category": "isim (ال takılı)"
            },
            {
              "text": "التُّرْكِيّ.",
              "root": "تركي",
              "category": "isim (sıfat · ال takılı)"
            }
          ],
          "turkish": [
            "Hoş geldiniz.",
            "Bu",
            "Türk çini sanatıdır.",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Hoş geldiniz. Bu Türk çini sanatıdır.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "فَنّ",
              "root": "فن",
              "category": "isim"
            },
            {
              "text": "الخَزَف",
              "root": "خزف",
              "category": "isim (ال takılı)"
            },
            {
              "text": "التُّرْكِيّ",
              "root": "تركي",
              "category": "isim (sıfat · ال takılı)"
            },
            {
              "text": "مُمْتِع.",
              "root": "ممتع",
              "category": "isim"
            }
          ],
          "turkish": [
            "Türk çini sanatı",
            "keyiflidir.",
            "—",
            "—"
          ],
          "turkishFull": "Türk çini sanatı keyiflidir.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "فَنّ",
              "root": "فن",
              "category": "isim"
            },
            {
              "text": "الزُّجاج",
              "root": "زجاج",
              "category": "isim (ال takılı)"
            },
            {
              "text": "هو",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "النَّقْش",
              "root": "نقش",
              "category": "isim (ال takılı)"
            },
            {
              "text": "عَلى",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "الزُّجاج.",
              "root": "زجاج",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Cam sanatı",
            "işlemedir.",
            "cam üzerine",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Cam sanatı cam üzerine işlemedir.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "فَنّ",
              "root": "فن",
              "category": "isim"
            },
            {
              "text": "الأَبْرو",
              "root": "أبرو",
              "category": "isim (ال takılı)"
            },
            {
              "text": "هو",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "الرَّسْم",
              "root": "رسم",
              "category": "isim (ال takılı)"
            },
            {
              "text": "عَلى",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "الماء.",
              "root": "ماء",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ebru sanatı",
            "resimdir.",
            "su üzerine",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ebru sanatı su üzerine resimdir.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "فَنّ",
              "root": "فن",
              "category": "isim"
            },
            {
              "text": "الخَطّ",
              "root": "خط",
              "category": "isim (ال takılı)"
            },
            {
              "text": "العَرَبِيّ",
              "root": "عربي",
              "category": "isim (sıfat · ال takılı)"
            },
            {
              "text": "جَميل.",
              "root": "جميل",
              "category": "isim"
            }
          ],
          "turkish": [
            "Arap hat sanatı",
            "güzeldir.",
            "—",
            "—"
          ],
          "turkishFull": "Arap hat sanatı güzeldir.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "التَّذْهيب",
              "root": "تذهيب",
              "category": "isim (ال takılı)"
            },
            {
              "text": "فَنٌّ",
              "root": "فن",
              "category": "isim"
            },
            {
              "text": "غالٍ.",
              "root": "غال",
              "category": "isim"
            }
          ],
          "turkish": [
            "Tezhip",
            "bir sanattır.",
            "değerli"
          ],
          "turkishFull": "Tezhip değerli bir sanattır.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "مَرْحَبًا،",
              "root": "مرحب",
              "category": "isim"
            },
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "مَرْيَم.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "Merhaba,",
            "ben Meryem'im.",
            "—"
          ],
          "turkishFull": "Merhaba, ben Meryem'im.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "نَعَم.",
              "root": "نعم",
              "category": "cevap harfi"
            }
          ],
          "turkish": [
            "Evet."
          ],
          "turkishFull": "Evet.",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "مُساعَدَة",
              "root": "مساعدة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Yardım"
          ],
          "turkishFull": "Yardım",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "صَدَقَة",
              "root": "صدقة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Sadaka"
          ],
          "turkishFull": "Sadaka",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "مَسْؤولِيَّة",
              "root": "مسؤولية",
              "category": "isim (dişil)"
            }
          ],
          "turkish": [
            "Sorumluluk"
          ],
          "turkishFull": "Sorumluluk",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "مُعايَدَة",
              "root": "معايدة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Bayramlaşma"
          ],
          "turkishFull": "Bayramlaşma",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "اِجْتِماع",
              "root": "اجتماع",
              "category": "isim"
            },
            {
              "text": "العائِلَة",
              "root": "عائلة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Aile toplantısı",
            "—"
          ],
          "turkishFull": "Aile toplantısı",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "صَلاة",
              "root": "صلاة",
              "category": "isim"
            },
            {
              "text": "العيد",
              "root": "عيد",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Bayram namazı",
            "—"
          ],
          "turkishFull": "Bayram namazı",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "تَوْزيع",
              "root": "توزيع",
              "category": "isim"
            },
            {
              "text": "الحَلْوى",
              "root": "حلوى",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Tatlı dağıtma",
            "—"
          ],
          "turkishFull": "Tatlı dağıtma",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "اللِّقاء",
              "root": "لقاء",
              "category": "isim (ال takılı)"
            },
            {
              "text": "قَريبًا.",
              "root": "قريب",
              "category": "isim"
            }
          ],
          "turkish": [
            "görüşmek üzere.",
            "Yakında",
            "—"
          ],
          "turkishFull": "Yakında görüşmek üzere.",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "جَميل،",
              "root": "جميل",
              "category": "isim"
            },
            {
              "text": "نَظافَة",
              "root": "نظافة",
              "category": "isim"
            },
            {
              "text": "البيئَة",
              "root": "بيئة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مُهِمَّة",
              "root": "مهم",
              "category": "isim (sıfat · dişil)"
            },
            {
              "text": "جِدًّا.",
              "root": "جدا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Güzel,",
            "çevre temizliği",
            "önemlidir.",
            "çok",
            "—"
          ],
          "turkishFull": "Güzel, çevre temizliği çok önemlidir.",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "فُرْقان",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "عُضْو",
              "root": "عضو",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "النَّظافَة.",
              "root": "نظافة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Furkan",
            "üyedir.",
            "temizlik kulübünde",
            "—",
            "—"
          ],
          "turkishFull": "Furkan temizlik kulübünde üyedir.",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "طَبيعَة",
              "root": "طبيعة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Doğa"
          ],
          "turkishFull": "Doğa",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "بيئَة",
              "root": "بيئة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Çevre"
          ],
          "turkishFull": "Çevre",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "ضَوْضاء",
              "root": "ضوضاء",
              "category": "isim"
            }
          ],
          "turkish": [
            "Gürültü"
          ],
          "turkishFull": "Gürültü",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "نُفايات",
              "root": "نفايات",
              "category": "isim"
            }
          ],
          "turkish": [
            "Atıklar, çöpler"
          ],
          "turkishFull": "Atıklar, çöpler",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "أَيْن",
              "root": "أين",
              "category": "soru edatı"
            },
            {
              "text": "الأَرْنَب؟",
              "root": "أرنب",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "nerede?",
            "Tavşan"
          ],
          "turkishFull": "Tavşan nerede?",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "أَسَد",
              "root": "أسد",
              "category": "isim"
            }
          ],
          "turkish": [
            "Aslan"
          ],
          "turkishFull": "Aslan",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "فيل",
              "root": "فيل",
              "category": "isim"
            }
          ],
          "turkish": [
            "Fil"
          ],
          "turkishFull": "Fil",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "زَرافَة",
              "root": "زرافة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Zürafa"
          ],
          "turkishFull": "Zürafa",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "حِصان",
              "root": "حصان",
              "category": "isim"
            }
          ],
          "turkish": [
            "At"
          ],
          "turkishFull": "At",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "كَلْب",
              "root": "كلب",
              "category": "isim"
            }
          ],
          "turkish": [
            "Köpek"
          ],
          "turkishFull": "Köpek",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "قِطَّة",
              "root": "قطة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Kedi"
          ],
          "turkishFull": "Kedi",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "أَرْنَب",
              "root": "أرنب",
              "category": "isim"
            }
          ],
          "turkish": [
            "Tavşan"
          ],
          "turkishFull": "Tavşan",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "عُصْفور",
              "root": "عصفور",
              "category": "isim"
            }
          ],
          "turkish": [
            "Serçe"
          ],
          "turkishFull": "Serçe",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "سَمَكَة",
              "root": "سمكة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Balık"
          ],
          "turkishFull": "Balık",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "نَمْلَة",
              "root": "نملة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Karınca"
          ],
          "turkishFull": "Karınca",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "سُلَحْفاة",
              "root": "سلحفاة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Kaplumbağa"
          ],
          "turkishFull": "Kaplumbağa",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "نَحْلَة",
              "root": "نحلة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Arı"
          ],
          "turkishFull": "Arı",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "الأَسَد",
              "root": "أسد",
              "category": "isim (ال takılı)"
            },
            {
              "text": "هو",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "مَلِكُ",
              "root": "ملك",
              "category": "isim"
            },
            {
              "text": "الغابَة.",
              "root": "غابة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Aslan",
            "kralıdır.",
            "ormanın",
            "—"
          ],
          "turkishFull": "Aslan ormanın kralıdır.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "زِلْزال",
              "root": "زلزال",
              "category": "isim"
            }
          ],
          "turkish": [
            "Deprem"
          ],
          "turkishFull": "Deprem",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "فَيَضان",
              "root": "فيضان",
              "category": "isim"
            }
          ],
          "turkish": [
            "Sel"
          ],
          "turkishFull": "Sel",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "جَفاف",
              "root": "جفاف",
              "category": "isim"
            }
          ],
          "turkish": [
            "Kuraklık"
          ],
          "turkishFull": "Kuraklık",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "أَقْدَم",
              "root": "أقدم",
              "category": "isim"
            },
            {
              "text": "رِياضَة",
              "root": "رياضة",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "التّاريخ",
              "root": "تاريخ",
              "category": "isim (ال takılı)"
            },
            {
              "text": "هي",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "المُصارَعَة.",
              "root": "مصارعة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Tarihteki en eski spor",
            "güreştir.",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Tarihteki en eski spor güreştir.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "والمُصارَعَة",
              "root": "مصارعة",
              "category": "atıf harfi + isim (ال takılı)"
            },
            {
              "text": "هي",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أَقْدَم",
              "root": "أقدم",
              "category": "isim"
            },
            {
              "text": "رِياضَة",
              "root": "رياضة",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "التّاريخ،",
              "root": "تاريخ",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Güreş",
            "en eski spordur,",
            "tarihteki",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Güreş tarihteki en eski spordur,",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "الشّاي",
              "root": "شاي",
              "category": "isim (ال takılı)"
            },
            {
              "text": "بِكَمْ؟",
              "root": "بكم",
              "category": "soru edatı"
            }
          ],
          "turkish": [
            "Çay",
            "kaç lira?"
          ],
          "turkishFull": "Çay kaç lira?",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "الشّاي",
              "root": "شاي",
              "category": "isim (ال takılı)"
            },
            {
              "text": "ثَلاثون",
              "root": "ثلاثون",
              "category": "isim"
            },
            {
              "text": "لِيرَة.",
              "root": "ليرة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Çay",
            "otuz liradır.",
            "—"
          ],
          "turkishFull": "Çay otuz liradır.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "الماء",
              "root": "ماء",
              "category": "isim (ال takılı)"
            },
            {
              "text": "عِشْرون",
              "root": "عشرون",
              "category": "isim"
            },
            {
              "text": "لِيرَة.",
              "root": "ليرة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Su",
            "yirmi liradır.",
            "—"
          ],
          "turkishFull": "Su yirmi liradır.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "القَهْوَة",
              "root": "قهوة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "خَمْسون",
              "root": "خمسون",
              "category": "isim"
            },
            {
              "text": "لِيرَة.",
              "root": "ليرة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Kahve",
            "elli liradır.",
            "—"
          ],
          "turkishFull": "Kahve elli liradır.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "العَصير",
              "root": "عصير",
              "category": "isim (ال takılı)"
            },
            {
              "text": "أَرْبَعون",
              "root": "أربعون",
              "category": "isim"
            },
            {
              "text": "لِيرَة.",
              "root": "ليرة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Meyve suyu",
            "kırk liradır.",
            "—"
          ],
          "turkishFull": "Meyve suyu kırk liradır.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُفَضِّلُ",
              "root": "أفضل",
              "category": "isim"
            },
            {
              "text": "كُرَةَ",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "القَدَم",
              "root": "قدم",
              "category": "isim (ال takılı)"
            },
            {
              "text": "عَلى",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "الكُرَة",
              "root": "كرة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الطّائِرَة.",
              "root": "طائرة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "tercih ederim.",
            "futbolu",
            "voleybola",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ben futbolu voleybola tercih ederim.",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "مَشْي",
              "root": "مشي",
              "category": "isim"
            }
          ],
          "turkish": [
            "Yürüyüş"
          ],
          "turkishFull": "Yürüyüş",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "تَنِس",
              "root": "تنس",
              "category": "isim"
            }
          ],
          "turkish": [
            "Tenis"
          ],
          "turkishFull": "Tenis",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "رُكوب",
              "root": "ركوب",
              "category": "isim"
            },
            {
              "text": "الدَّرّاجَة",
              "root": "دراجة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Bisiklete binme",
            "—"
          ],
          "turkishFull": "Bisiklete binme",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "تَسَلُّق",
              "root": "تسلق",
              "category": "isim"
            }
          ],
          "turkish": [
            "Tırmanma"
          ],
          "turkishFull": "Tırmanma",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "كُرَة",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "الطّاوِلَة",
              "root": "طاولة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Masa tenisi",
            "—"
          ],
          "turkishFull": "Masa tenisi",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "الجَرْي",
              "root": "جري",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Koşu"
          ],
          "turkishFull": "Koşu",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "كُرَة",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "الماء",
              "root": "ماء",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Su topu",
            "—"
          ],
          "turkishFull": "Su topu",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "السِّباحَة",
              "root": "سباحة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "رِياضَة",
              "root": "رياضة",
              "category": "isim"
            },
            {
              "text": "مائِيَّة.",
              "root": "مائية",
              "category": "isim (dişil)"
            }
          ],
          "turkish": [
            "Yüzme",
            "bir su sporudur.",
            "—"
          ],
          "turkishFull": "Yüzme bir su sporudur.",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "أَيْن؟",
              "root": "أين",
              "category": "soru edatı"
            }
          ],
          "turkish": [
            "Nerede?"
          ],
          "turkishFull": "Nerede?",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "السِّباحَة",
              "root": "سباحة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مُفيدَة",
              "root": "مفيد",
              "category": "isim (sıfat · dişil)"
            },
            {
              "text": "لِلصِّحَّة.",
              "root": "صحة",
              "category": "harf-i cer + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Yüzme",
            "faydalıdır.",
            "sağlık için"
          ],
          "turkishFull": "Yüzme sağlık için faydalıdır.",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "صَيْد",
              "root": "صيد",
              "category": "isim"
            },
            {
              "text": "الأَسْماك",
              "root": "سمكة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Balık tutma",
            "—"
          ],
          "turkishFull": "Balık tutma",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "المُخَيَّم",
              "root": "مخيم",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Kamp"
          ],
          "turkishFull": "Kamp",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "البَحْر",
              "root": "بحر",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Deniz"
          ],
          "turkishFull": "Deniz",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "السِّباحَة",
              "root": "سباحة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Yüzme"
          ],
          "turkishFull": "Yüzme",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "القَرْيَة",
              "root": "قرية",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Köy"
          ],
          "turkishFull": "Köy",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "المُتْحَف",
              "root": "متحف",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Müze"
          ],
          "turkishFull": "Müze",
          "ders": "8_6_3"
        }
      ]
    },
    {
      "level": 2,
      "anahtar": "zamir",
      "hint": "<h3 dir=\"ltr\">Seviye 2 · Bitişik zamir, sayı ve çoğul</h3><p class=\"ip-sinif\" dir=\"ltr\">8. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyenin kuralları geçerlidir.</li><li>Bitişik zamir atılır: <bdi class=\"ip-ar\">صَديقي</bdi> → <bdi class=\"ip-ar\">صديق</bdi>.</li><li>Çoğul, <b>tekil</b> biçimiyle aranır: <bdi class=\"ip-ar\">الأَنْدِيَة</bdi> → <bdi class=\"ip-ar\">نادي</bdi>.</li><li>Dişil çoğulun tekili de dişildir: <bdi class=\"ip-ar\">الرِّياضات</bdi> → <bdi class=\"ip-ar\">رياضة</bdi>.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">أَدَوات</bdi> → <bdi class=\"ip-ar\"><b>أداة</b></bdi> <i>(isim (dişil çoğul))</i></li><li><bdi class=\"ip-ar\">الكُتُب؟</bdi> → <bdi class=\"ip-ar\"><b>كتاب</b></bdi> <i>(isim (kırık çoğul · ال takılı))</i></li><li><bdi class=\"ip-ar\">بِكِ،</bdi> → <bdi class=\"ip-ar\"><b>بك</b></bdi> <i>(harf-i cer + bitişik zamir (sen))</i></li><li><bdi class=\"ip-ar\">لَكِ</bdi> → <bdi class=\"ip-ar\"><b>لك</b></bdi> <i>(edat + bitişik zamir (sen))</i></li><li><bdi class=\"ip-ar\">عَمَّتي!</bdi> → <bdi class=\"ip-ar\"><b>عمة</b></bdi> <i>(isim + bitişik zamir (ben))</i></li><li><bdi class=\"ip-ar\">الأماكِن</bdi> → <bdi class=\"ip-ar\"><b>مكان</b></bdi> <i>(isim (kırık çoğul · ال takılı))</i></li></ul>",
      "sentences": [
        {
          "arabic": [
            {
              "text": "هَلْ",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "أَنْتَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "مَسْؤول",
              "root": "مسؤول",
              "category": "isim"
            },
            {
              "text": "عَنْ",
              "root": "عن",
              "category": "harf-i cer"
            },
            {
              "text": "أَدَوات",
              "root": "أداة",
              "category": "isim (dişil çoğul)"
            },
            {
              "text": "الرِّياضِيَّة؟",
              "root": "رياضية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "musun?",
            "Sen",
            "sorumlu",
            "aletlerinden",
            "spor",
            "—"
          ],
          "turkishFull": "Sen spor aletlerinden sorumlu musun?",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "هَلْ",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "أَنْتَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "مَسْؤول",
              "root": "مسؤول",
              "category": "isim"
            },
            {
              "text": "عَنْ",
              "root": "عن",
              "category": "harf-i cer"
            },
            {
              "text": "تَرْتيب",
              "root": "ترتيب",
              "category": "isim"
            },
            {
              "text": "الكُتُب؟",
              "root": "كتاب",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "musun?",
            "Sen",
            "sorumlu",
            "düzenlemekten",
            "kitapları",
            "—"
          ],
          "turkishFull": "Sen kitapları düzenlemekten sorumlu musun?",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَهْلًا",
              "root": "أهلا",
              "category": "zarf"
            },
            {
              "text": "بِكِ،",
              "root": "بك",
              "category": "harf-i cer + bitişik zamir (sen)"
            },
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "ذاهِبَة",
              "root": "ذاهب",
              "category": "isim (ism-i fâil · dişil)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِلْمَسْرَحِيَّة.",
              "root": "مسرحية",
              "category": "harf-i cer + isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Hoş geldin,",
            "ben",
            "gidiyorum.",
            "okula",
            "tiyatro oyunu için",
            "—",
            "—"
          ],
          "turkishFull": "Hoş geldin, ben tiyatro oyunu için okula gidiyorum.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "شُكْرًا",
              "root": "شكرا",
              "category": "zarf"
            },
            {
              "text": "لَكِ",
              "root": "لك",
              "category": "edat + bitişik zamir (sen)"
            },
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "عَمَّتي!",
              "root": "عمة",
              "category": "isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "Teşekkür ederim",
            "halacığım!",
            "—",
            "—"
          ],
          "turkishFull": "Teşekkür ederim halacığım!",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "مَرْحَبًا،",
              "root": "مرحب",
              "category": "isim"
            },
            {
              "text": "ما",
              "root": "ما",
              "category": "edat"
            },
            {
              "text": "هي",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "الأماكِن",
              "root": "مكان",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "لِلزِّيارَة",
              "root": "زيارة",
              "category": "harf-i cer + isim (ال takılı)"
            },
            {
              "text": "هُنا؟",
              "root": "هنا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Merhaba,",
            "nelerdir?",
            "yerler",
            "ziyaret edilecek",
            "burada",
            "—"
          ],
          "turkishFull": "Merhaba, burada ziyaret edilecek yerler nelerdir?",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "رائِع!",
              "root": "رائع",
              "category": "isim"
            },
            {
              "text": "شُكْرًا",
              "root": "شكرا",
              "category": "zarf"
            },
            {
              "text": "لَكِ.",
              "root": "لك",
              "category": "edat + bitişik zamir (sen)"
            }
          ],
          "turkish": [
            "Harika!",
            "Teşekkür ederim.",
            "—"
          ],
          "turkishFull": "Harika! Teşekkür ederim.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "هُناك",
              "root": "هنا",
              "category": "zarf + bitişik zamir (sen)"
            },
            {
              "text": "العَديد",
              "root": "عديد",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مِنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "الأماكِن",
              "root": "مكان",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "لِلزِّيارَة.",
              "root": "زيارة",
              "category": "harf-i cer + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Orada",
            "birçok yer vardır.",
            "ziyaret edilecek",
            "—",
            "—"
          ],
          "turkishFull": "Orada ziyaret edilecek birçok yer vardır.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "\"هُناك",
              "root": "هنا",
              "category": "zarf + bitişik zamir (sen)"
            },
            {
              "text": "حُفْرَة",
              "root": "حفرة",
              "category": "isim"
            },
            {
              "text": "وفيها",
              "root": "وفيها",
              "category": "harf-i cer + bitişik zamir (o · dişil)"
            },
            {
              "text": "غُرْفَة،",
              "root": "غرفة",
              "category": "isim"
            },
            {
              "text": "وفي",
              "root": "في",
              "category": "atıf harfi + harf-i cer"
            },
            {
              "text": "الغُرْفَة",
              "root": "غرفة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "صُنْدوق\".",
              "root": "صندوق",
              "category": "isim"
            }
          ],
          "turkish": [
            "«Orada bir çukur var,",
            "içinde bir oda,",
            "odada da bir sandık.»",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "«Orada bir çukur var, içinde bir oda, odada da bir sandık.»",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "وفيه",
              "root": "وفيه",
              "category": "harf-i cer + bitişik zamir (o)"
            },
            {
              "text": "مِصْباح",
              "root": "مصباح",
              "category": "isim"
            },
            {
              "text": "قَديم.",
              "root": "قديم",
              "category": "isim"
            }
          ],
          "turkish": [
            "İçinde",
            "bir lamba var.",
            "eski"
          ],
          "turkishFull": "İçinde eski bir lamba var.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "أَيْن",
              "root": "أين",
              "category": "soru edatı"
            },
            {
              "text": "هذه",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "الكُتُب؟",
              "root": "كتاب",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "nerede?",
            "Bu kitaplar",
            "—"
          ],
          "turkishFull": "Bu kitaplar nerede?",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "الكُتُب",
              "root": "كتاب",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "القَديمَة",
              "root": "قديم",
              "category": "isim (sıfat · ال takılı · dişil)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "المَكْتَبَة.",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Eski kitaplar",
            "kütüphanede.",
            "—",
            "—"
          ],
          "turkishFull": "Eski kitaplar kütüphanede.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "الكُتُب",
              "root": "كتاب",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "القَديمَة",
              "root": "قديم",
              "category": "isim (sıfat · ال takılı · dişil)"
            }
          ],
          "turkish": [
            "eski kitaplar",
            "—"
          ],
          "turkishFull": "eski kitaplar",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "فَنّ",
              "root": "فن",
              "category": "isim"
            },
            {
              "text": "الخَزَف",
              "root": "خزف",
              "category": "isim (ال takılı)"
            },
            {
              "text": "التُّرْكِيّ",
              "root": "تركي",
              "category": "isim (sıfat · ال takılı)"
            },
            {
              "text": "مِنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "هِوايات",
              "root": "هواية",
              "category": "isim (dişil çoğul)"
            },
            {
              "text": "الخَزّافَة.",
              "root": "خزافة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Türk çini sanatı",
            "hobilerindendir.",
            "çiniciliğin",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Türk çini sanatı çiniciliğin hobilerindendir.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "مُساعَدَة",
              "root": "مساعدة",
              "category": "isim"
            },
            {
              "text": "المُحْتاجين",
              "root": "محتاج",
              "category": "isim (düzenli çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "yardım",
            "İhtiyaç sahiplerine"
          ],
          "turkishFull": "İhtiyaç sahiplerine yardım",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "مُقابَلَة",
              "root": "مقابلة",
              "category": "isim"
            },
            {
              "text": "النّازِحين",
              "root": "نازح",
              "category": "isim (düzenli çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "görüşme",
            "Göçmenlerle"
          ],
          "turkishFull": "Göçmenlerle görüşme",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "زِيارَة",
              "root": "زيارة",
              "category": "isim"
            },
            {
              "text": "المَنْكوبين",
              "root": "منكوب",
              "category": "isim (düzenli çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "ziyaret",
            "Afetzedeleri"
          ],
          "turkishFull": "Afetzedeleri ziyaret",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "صَباح",
              "root": "صباح",
              "category": "isim"
            },
            {
              "text": "النّور",
              "root": "نور",
              "category": "isim (ال takılı)"
            },
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "أَبي،",
              "root": "أب",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "حَسَنًا.",
              "root": "حسنا",
              "category": "cevap harfi"
            }
          ],
          "turkish": [
            "Günaydın",
            "babacığım,",
            "olur.",
            "—",
            "—"
          ],
          "turkishFull": "Günaydın babacığım, olur.",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "هَدايا",
              "root": "هدية",
              "category": "isim (kırık çoğul)"
            }
          ],
          "turkish": [
            "Hediyeler"
          ],
          "turkishFull": "Hediyeler",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "عيدِيّات",
              "root": "عيدية",
              "category": "isim (dişil çoğul)"
            }
          ],
          "turkish": [
            "Bayram harçlıkları"
          ],
          "turkishFull": "Bayram harçlıkları",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "زِيارَة",
              "root": "زيارة",
              "category": "isim"
            },
            {
              "text": "الأَقارِب",
              "root": "قريب",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "Akrabaları ziyaret",
            "—"
          ],
          "turkishFull": "Akrabaları ziyaret",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "زِيارَة",
              "root": "زيارة",
              "category": "isim"
            },
            {
              "text": "المَقابِر",
              "root": "مقبرة",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "Kabir ziyareti",
            "—"
          ],
          "turkishFull": "Kabir ziyareti",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "صَديقي",
              "root": "صديق",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "العَزيز!",
              "root": "عزيز",
              "category": "isim (ال takılı)"
            },
            {
              "text": "اليَوْم",
              "root": "يوم",
              "category": "zarf (zaman)"
            },
            {
              "text": "عيد",
              "root": "عيد",
              "category": "isim"
            },
            {
              "text": "الأَضْحى",
              "root": "أضحى",
              "category": "isim (ال takılı)"
            },
            {
              "text": "المُبارَك.",
              "root": "مبارك",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sevgili arkadaşım!",
            "Bugün",
            "mübarek Kurban Bayramı.",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Sevgili arkadaşım! Bugün mübarek Kurban Bayramı.",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "حَريق",
              "root": "حريق",
              "category": "isim"
            },
            {
              "text": "الغابات",
              "root": "غابة",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "Orman yangını",
            "—"
          ],
          "turkishFull": "Orman yangını",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "وهُناك",
              "root": "هنا",
              "category": "atıf harfi + zarf + bitişik zamir (sen)"
            },
            {
              "text": "رَأَيْنا",
              "root": "رأي",
              "category": "isim + bitişik zamir (biz)"
            },
            {
              "text": "كَثيرًا",
              "root": "كثيرا",
              "category": "zarf"
            },
            {
              "text": "مِن",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "الحَيَوانات.",
              "root": "حيوان",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Orada",
            "gördük.",
            "birçok hayvan",
            "—",
            "—"
          ],
          "turkishFull": "Orada birçok hayvan gördük.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "حَريق",
              "root": "حريق",
              "category": "isim"
            },
            {
              "text": "الغابات",
              "root": "غابة",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "Orman yangını",
            "—"
          ],
          "turkishFull": "Orman yangını",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مُفيدَة",
              "root": "مفيد",
              "category": "isim (sıfat · dişil)"
            },
            {
              "text": "جِدًّا",
              "root": "جدا",
              "category": "zarf"
            },
            {
              "text": "لِصِحَّتِنا،",
              "root": "صحة",
              "category": "harf-i cer + isim + bitişik zamir (biz)"
            }
          ],
          "turkish": [
            "Spor",
            "çok faydalıdır,",
            "sağlığımız için",
            "—"
          ],
          "turkishFull": "Spor sağlığımız için çok faydalıdır,",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "الرِّياضات",
              "root": "رياضة",
              "category": "isim (dişil çoğul · ال takılı)"
            },
            {
              "text": "الفَرْدِيَّة",
              "root": "فردي",
              "category": "isim (sıfat · ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Bireysel sporlar",
            "—"
          ],
          "turkishFull": "Bireysel sporlar",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "الرِّياضات",
              "root": "رياضة",
              "category": "isim (dişil çoğul · ال takılı)"
            },
            {
              "text": "الجَماعِيَّة",
              "root": "جماعي",
              "category": "isim (sıfat · ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Takım sporları",
            "—"
          ],
          "turkishFull": "Takım sporları",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "الرِّياضات",
              "root": "رياضة",
              "category": "isim (dişil çoğul · ال takılı)"
            },
            {
              "text": "المائِيَّة",
              "root": "مائية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Su sporları",
            "—"
          ],
          "turkishFull": "Su sporları",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُفَضِّلُ",
              "root": "أفضل",
              "category": "isim"
            },
            {
              "text": "الرِّياضات",
              "root": "رياضة",
              "category": "isim (dişil çoğul · ال takılı)"
            },
            {
              "text": "الفَرْدِيَّة.",
              "root": "فردي",
              "category": "isim (sıfat · ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Ben",
            "tercih ederim.",
            "bireysel sporları",
            "—"
          ],
          "turkishFull": "Ben bireysel sporları tercih ederim.",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "مَرْحَبًا",
              "root": "مرحب",
              "category": "isim"
            },
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "أَصْدِقائي،",
              "root": "صديق",
              "category": "isim (kırık çoğul) + bitişik zamir (ben)"
            },
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "عَلِيّ.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "Merhaba arkadaşlarım,",
            "ben Ali'yim.",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Merhaba arkadaşlarım, ben Ali'yim.",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "اِلْتِقاط",
              "root": "تقاط",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الصُّوَر",
              "root": "صورة",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "Fotoğraf çekme",
            "—"
          ],
          "turkishFull": "Fotoğraf çekme",
          "ders": "8_6_3"
        }
      ]
    },
    {
      "level": 3,
      "anahtar": "fiil",
      "hint": "<h3 dir=\"ltr\">Seviye 3 · Fiiller: muzariden maziye</h3><p class=\"ip-sinif\" dir=\"ltr\">8. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyelerin kuralları geçerlidir.</li><li>Fiil, sözlükte <b>mazi</b> (geçmiş zaman) biçimiyle aranır: <bdi class=\"ip-ar\">يَخْتارُ</bdi> → <bdi class=\"ip-ar\">اختار</bdi>.</li><li>Şahıs ve zaman ekleri atılır: <bdi class=\"ip-ar\">سَأَذْهَبُ، ذَهَبوا، كَتَبْتُ</bdi> → <bdi class=\"ip-ar\">ذهب، ذهب، كتب</bdi>.</li><li>Emir ve nehiy de maziye çevrilir.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">أَقومُ</bdi> → <bdi class=\"ip-ar\"><b>قام</b></bdi> <i>(fiil (muzari))</i></li><li><bdi class=\"ip-ar\">أَذْهَبُ</bdi> → <bdi class=\"ip-ar\"><b>ذهب</b></bdi> <i>(soru edatı + fiil (mazi))</i></li><li><bdi class=\"ip-ar\">أَدْرُسُ</bdi> → <bdi class=\"ip-ar\"><b>درس</b></bdi> <i>(soru edatı + fiil (mazi))</i></li><li><bdi class=\"ip-ar\">سَتَبْدَأُ</bdi> → <bdi class=\"ip-ar\"><b>بدأ</b></bdi> <i>(fiil (muzari · istikbal))</i></li><li><bdi class=\"ip-ar\">أَقْرَأُ</bdi> → <bdi class=\"ip-ar\"><b>قرأ</b></bdi> <i>(soru edatı + fiil (mazi))</i></li><li><bdi class=\"ip-ar\">وبَعْدَها</bdi> → <bdi class=\"ip-ar\"><b>بعد</b></bdi> <i>(atıf harfi + fiil (mazi) + bitişik zamir (o · dişil))</i></li></ul>",
      "sentences": [
        {
          "arabic": [
            {
              "text": "أَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أَقومُ",
              "root": "قام",
              "category": "fiil (muzari)"
            },
            {
              "text": "بِمَسْؤولِيَّاتي",
              "root": "مسؤولية",
              "category": "harf-i cer + isim (dişil çoğul) + bitişik zamir (ben)"
            },
            {
              "text": "دائِمًا.",
              "root": "دائما",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Ben",
            "yerine getiririm.",
            "sorumluluklarımı",
            "her zaman"
          ],
          "turkishFull": "Ben sorumluluklarımı her zaman yerine getiririm.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَذْهَبُ",
              "root": "ذهب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "إِلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المَدْرَسَة.",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "giderim.",
            "Okula",
            "—"
          ],
          "turkishFull": "Okula giderim.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَدْرُسُ",
              "root": "درس",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "البَيْت",
              "root": "بيت",
              "category": "isim (ال takılı)"
            },
            {
              "text": "كُلَّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "مَساء.",
              "root": "مساء",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "ders çalışırım.",
            "evde",
            "Her akşam",
            "—",
            "—"
          ],
          "turkishFull": "Her akşam evde ders çalışırım.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "مَتى",
              "root": "متى",
              "category": "soru edatı"
            },
            {
              "text": "سَتَبْدَأُ",
              "root": "بدأ",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "المَسْرَحِيَّة؟",
              "root": "مسرحية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "ne zaman",
            "başlayacak?",
            "Tiyatro oyunu"
          ],
          "turkishFull": "Tiyatro oyunu ne zaman başlayacak?",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "سَتَبْدَأُ",
              "root": "بدأ",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الخامِسَة",
              "root": "خامسة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "مَساءً.",
              "root": "مساء",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "başlayacak.",
            "saat beşte",
            "Akşam",
            "—",
            "—"
          ],
          "turkishFull": "Akşam saat beşte başlayacak.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "سُمَيَّة",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "تَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المَكْتَبَة.",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sümeyye",
            "gidiyor.",
            "kütüphaneye",
            "—"
          ],
          "turkishFull": "Sümeyye kütüphaneye gidiyor.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "تَبْدَأُ",
              "root": "بدأ",
              "category": "fiil (muzari)"
            },
            {
              "text": "المَسْرَحِيَّة",
              "root": "مسرحية",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الخامِسَة",
              "root": "خامسة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "صَباحًا.",
              "root": "صباحا",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "başlıyor.",
            "Tiyatro oyunu",
            "saat beşte",
            "sabah",
            "—",
            "—"
          ],
          "turkishFull": "Tiyatro oyunu sabah saat beşte başlıyor.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "أَقْرَأُ",
              "root": "قرأ",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "السّيناريو",
              "root": "سيناريو",
              "category": "isim (ال takılı)"
            },
            {
              "text": "بِدِقَّة",
              "root": "دقة",
              "category": "harf-i cer + isim (mastar)"
            },
            {
              "text": "كُلَّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "يَوْم.",
              "root": "يوم",
              "category": "isim"
            }
          ],
          "turkish": [
            "okurum.",
            "senaryoyu",
            "dikkatle",
            "Her gün",
            "—"
          ],
          "turkishFull": "Her gün senaryoyu dikkatle okurum.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "أنتَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "تَقْرَأُ",
              "root": "قرأ",
              "category": "fiil (muzari)"
            },
            {
              "text": "السّيناريو",
              "root": "سيناريو",
              "category": "isim (ال takılı)"
            },
            {
              "text": "بِدِقَّة.",
              "root": "دقة",
              "category": "harf-i cer + isim (mastar)"
            }
          ],
          "turkish": [
            "Sen (erkek)",
            "okuyorsun.",
            "senaryoyu",
            "dikkatle"
          ],
          "turkishFull": "Sen (erkek) senaryoyu dikkatle okuyorsun.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "نَحْنُ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "نَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المَسْرَح",
              "root": "مسرح",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الكَبير.",
              "root": "كبير",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Biz",
            "gidiyoruz.",
            "büyük tiyatroya",
            "—",
            "—"
          ],
          "turkishFull": "Biz büyük tiyatroya gidiyoruz.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "أَقْرَأُ",
              "root": "قرأ",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "السّيناريو",
              "root": "سيناريو",
              "category": "isim (ال takılı)"
            },
            {
              "text": "كُلَّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "يَوْم.",
              "root": "يوم",
              "category": "isim"
            }
          ],
          "turkish": [
            "okurum.",
            "senaryoyu",
            "Her gün",
            "—"
          ],
          "turkishFull": "Her gün senaryoyu okurum.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "ذَهَبَتْ",
              "root": "ذهب",
              "category": "fiil (mazi)"
            },
            {
              "text": "عائِشَة",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِلتَّدْريب.",
              "root": "تدريب",
              "category": "harf-i cer + isim (ال takılı)"
            }
          ],
          "turkish": [
            "gitti.",
            "Ayşe",
            "okula",
            "prova için",
            "—"
          ],
          "turkishFull": "Ayşe prova için okula gitti.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "قَرَأَتِ",
              "root": "قرأ",
              "category": "fiil (mazi)"
            },
            {
              "text": "السّيناريو.",
              "root": "سيناريو",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sonra",
            "okudu.",
            "senaryoyu"
          ],
          "turkishFull": "Sonra senaryoyu okudu.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "وبَعْدَها",
              "root": "بعد",
              "category": "atıf harfi + fiil (mazi) + bitişik zamir (o · dişil)"
            },
            {
              "text": "قامَتْ",
              "root": "قام",
              "category": "fiil (mazi)"
            },
            {
              "text": "بِالتَّدْريب",
              "root": "تدريب",
              "category": "harf-i cer + isim (ال takılı)"
            },
            {
              "text": "على",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "المَشْهَد",
              "root": "مشهد",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مَعَ",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "زَيْنَب.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "Ve ardından",
            "provasını yaptı.",
            "sahnenin",
            "Zeynep'le",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ve ardından Zeynep'le sahnenin provasını yaptı.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "رَجَعَتْ",
              "root": "رجع",
              "category": "fiil (mazi)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "بَيْتِها",
              "root": "بيت",
              "category": "isim + bitişik zamir (o · dişil)"
            },
            {
              "text": "مَساءً.",
              "root": "مساء",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "Sonra",
            "döndü.",
            "evine",
            "akşam",
            "—"
          ],
          "turkishFull": "Sonra akşam evine döndü.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "بَلى،",
              "root": "بلى",
              "category": "cevap harfi"
            },
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أَعْرِفُ",
              "root": "عرف",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "كُلَّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "شَيْءٍ.",
              "root": "شيء",
              "category": "isim"
            }
          ],
          "turkish": [
            "Evet,",
            "ben",
            "bilirim.",
            "her şeyi",
            "—"
          ],
          "turkishFull": "Evet, ben her şeyi bilirim.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "إِذَنْ",
              "root": "إذن",
              "category": "isim"
            },
            {
              "text": "قُلْ",
              "root": "قل",
              "category": "fiil (mazi)"
            },
            {
              "text": "لي",
              "root": "لي",
              "category": "edat + bitişik zamir (ben)"
            },
            {
              "text": "أَيْن",
              "root": "أين",
              "category": "soru edatı"
            },
            {
              "text": "مَرْكَزُ",
              "root": "مركز",
              "category": "isim"
            },
            {
              "text": "الأَرْضِ؟",
              "root": "أرض",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Öyleyse",
            "söyle:",
            "bana",
            "nerede?",
            "dünyanın merkezi",
            "—"
          ],
          "turkishFull": "Öyleyse bana söyle: dünyanın merkezi nerede?",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "تَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الثّامِنَة",
              "root": "ثامنة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "والنِّصْف.",
              "root": "نصف",
              "category": "atıf harfi + isim (ال takılı)"
            }
          ],
          "turkish": [
            "gidiyor.",
            "okula",
            "Sekiz buçukta",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Sekiz buçukta okula gidiyor.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "زَيْنَب",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "سَتَقْرَأُ",
              "root": "قرأ",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "السّيناريو",
              "root": "سيناريو",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الواحِدَة",
              "root": "واحدة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "والنِّصْف.",
              "root": "نصف",
              "category": "atıf harfi + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Zeynep",
            "okuyacak.",
            "senaryoyu",
            "bir buçukta",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Zeynep bir buçukta senaryoyu okuyacak.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "مِثْل",
              "root": "مثل",
              "category": "fiil (mazi)"
            },
            {
              "text": "حَديقَة",
              "root": "حديقة",
              "category": "isim"
            },
            {
              "text": "كُلْخانَة،",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "ومُتْحَف",
              "root": "متحف",
              "category": "atıf harfi + isim"
            },
            {
              "text": "طوب",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "قابي،",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "والقَصْر",
              "root": "قصر",
              "category": "atıf harfi + isim (ال takılı)"
            },
            {
              "text": "المَغْمور،",
              "root": "مغمور",
              "category": "isim (ism-i mef'ûl · ال takılı)"
            },
            {
              "text": "ومَسْجِد",
              "root": "مسجد",
              "category": "atıf harfi + isim"
            },
            {
              "text": "آيا",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "صوفْيا",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "الكَبير.",
              "root": "كبير",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "gibi.",
            "Gülhane Parkı,",
            "Topkapı Müzesi,",
            "Yerebatan Sarnıcı",
            "ve büyük Ayasofya Camii",
            "—",
            "—",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Gülhane Parkı, Topkapı Müzesi, Yerebatan Sarnıcı ve büyük Ayasofya Camii gibi.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "كَيْف",
              "root": "كيف",
              "category": "soru edatı"
            },
            {
              "text": "أَذْهَبُ",
              "root": "ذهب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "حَديقَة",
              "root": "حديقة",
              "category": "isim"
            },
            {
              "text": "كُلْخانَة؟",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            }
          ],
          "turkish": [
            "nasıl",
            "giderim?",
            "Gülhane Parkı'na",
            "—",
            "—"
          ],
          "turkishFull": "Gülhane Parkı'na nasıl giderim?",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "أَيَّ",
              "root": "أي",
              "category": "soru edatı"
            },
            {
              "text": "مَدينَة",
              "root": "مدينة",
              "category": "isim"
            },
            {
              "text": "زارَ",
              "root": "زار",
              "category": "fiil (mazi)"
            },
            {
              "text": "خالِد؟",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "hangi şehri",
            "ziyaret etti?",
            "Hâlid",
            "—"
          ],
          "turkishFull": "Hâlid hangi şehri ziyaret etti?",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "خالِد",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "زارَ",
              "root": "زار",
              "category": "fiil (mazi)"
            },
            {
              "text": "إِسْطَنْبول.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "Hâlid",
            "ziyaret etti.",
            "İstanbul'u"
          ],
          "turkishFull": "Hâlid İstanbul'u ziyaret etti.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "اُعْبُرِ",
              "root": "عبر",
              "category": "fiil (emir)"
            },
            {
              "text": "الطَّريق.",
              "root": "طريق",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "geç.",
            "Yolu"
          ],
          "turkishFull": "Yolu geç.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "اِذْهَبْ",
              "root": "ذهب",
              "category": "fiil (emir)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "الأَمام.",
              "root": "أمام",
              "category": "zarf"
            }
          ],
          "turkish": [
            "git.",
            "İleri",
            "—"
          ],
          "turkishFull": "İleri git.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "كَيْف",
              "root": "كيف",
              "category": "soru edatı"
            },
            {
              "text": "أَذْهَبُ",
              "root": "ذهب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المَدْرَسَة؟",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "nasıl",
            "giderim?",
            "Okula",
            "—"
          ],
          "turkishFull": "Okula nasıl giderim?",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "أَوَّلًا",
              "root": "أولا",
              "category": "zarf"
            },
            {
              "text": "اِمْشِ",
              "root": "مشى",
              "category": "fiil (emir)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "الأَمام.",
              "root": "أمام",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Önce",
            "yürü.",
            "ileri",
            "—"
          ],
          "turkishFull": "Önce ileri yürü.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "كَيْف",
              "root": "كيف",
              "category": "soru edatı"
            },
            {
              "text": "أَذْهَبُ",
              "root": "ذهب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "مِنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "الصّالَة",
              "root": "صالة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الرِّياضِيَّة",
              "root": "رياضية",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المَدْرَسَة؟",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "nasıl",
            "giderim?",
            "Spor salonundan",
            "okula",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Spor salonundan okula nasıl giderim?",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "كَيْف",
              "root": "كيف",
              "category": "soru edatı"
            },
            {
              "text": "أَذْهَبُ",
              "root": "ذهب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "مِنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "المَكْتَبَة",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المُتْحَف؟",
              "root": "متحف",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "nasıl",
            "giderim?",
            "Kütüphaneden",
            "müzeye",
            "—",
            "—"
          ],
          "turkishFull": "Kütüphaneden müzeye nasıl giderim?",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "كَيْف",
              "root": "كيف",
              "category": "soru edatı"
            },
            {
              "text": "أَذْهَبُ",
              "root": "ذهب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "مِنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "المُتْحَف",
              "root": "متحف",
              "category": "isim (ال takılı)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المُسْتَشْفى؟",
              "root": "مستشفى",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "nasıl",
            "giderim?",
            "Müzeden",
            "hastaneye",
            "—",
            "—"
          ],
          "turkishFull": "Müzeden hastaneye nasıl giderim?",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "أَذْهَبُ",
              "root": "ذهب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "السّوق",
              "root": "سوق",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مَعَ",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "أَخي",
              "root": "أخ",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "أَحْيانًا.",
              "root": "أحيانا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "giderim.",
            "çarşıya",
            "kardeşimle",
            "Bazen",
            "—",
            "—"
          ],
          "turkishFull": "Bazen kardeşimle çarşıya giderim.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "أَزورُ",
              "root": "زار",
              "category": "fiil (muzari)"
            },
            {
              "text": "المَتاحِف",
              "root": "متحف",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "كُلِّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "عُطْلَة",
              "root": "عطلة",
              "category": "isim"
            },
            {
              "text": "عادَةً.",
              "root": "عادة",
              "category": "zarf"
            }
          ],
          "turkish": [
            "ziyaret ederim.",
            "müzeleri",
            "her tatilde",
            "Genelde",
            "—",
            "—"
          ],
          "turkishFull": "Genelde her tatilde müzeleri ziyaret ederim.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "أَزورُ",
              "root": "زار",
              "category": "fiil (muzari)"
            },
            {
              "text": "أَقارِبي",
              "root": "قريب",
              "category": "isim (kırık çoğul) + bitişik zamir (ben)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "القَرْيَة",
              "root": "قرية",
              "category": "isim (ال takılı)"
            },
            {
              "text": "كُلَّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "عام.",
              "root": "عام",
              "category": "isim"
            }
          ],
          "turkish": [
            "ziyaret ederim.",
            "akrabalarımı",
            "köydeki",
            "Her yıl",
            "—",
            "—"
          ],
          "turkishFull": "Her yıl köydeki akrabalarımı ziyaret ederim.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "أنتَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "سَتَقومُ",
              "root": "قام",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "بِرِحْلَةٍ",
              "root": "رحلة",
              "category": "harf-i cer + isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "إِجازَتِكَ.",
              "root": "إجازة",
              "category": "isim + bitişik zamir (sen)"
            }
          ],
          "turkish": [
            "Sen",
            "yapacaksın.",
            "bir gezi",
            "tatilinde",
            "—"
          ],
          "turkishFull": "Sen tatilinde bir gezi yapacaksın.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "ذَهَبْتُ",
              "root": "ذهب",
              "category": "fiil (mazi)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "البازار",
              "root": "بازار",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الكَبير",
              "root": "كبير",
              "category": "isim (ال takılı)"
            },
            {
              "text": "بَعْدَ",
              "root": "بعد",
              "category": "fiil (mazi)"
            },
            {
              "text": "صَلاة",
              "root": "صلاة",
              "category": "isim"
            },
            {
              "text": "المَغْرِب.",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            }
          ],
          "turkish": [
            "gittim.",
            "Kapalıçarşı'ya",
            "Akşam namazından sonra",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Akşam namazından sonra Kapalıçarşı'ya gittim.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "ماذا",
              "root": "ماذا",
              "category": "soru edatı"
            },
            {
              "text": "تَقْرَأُ",
              "root": "قرأ",
              "category": "fiil (muzari)"
            },
            {
              "text": "الآن؟",
              "root": "آن",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "ne",
            "okuyorsun?",
            "Şimdi"
          ],
          "turkishFull": "Şimdi ne okuyorsun?",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "أَقْرَأُ",
              "root": "قرأ",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "\"قِصَّة",
              "root": "قصة",
              "category": "isim"
            },
            {
              "text": "أَلْف",
              "root": "ألف",
              "category": "fiil (mazi)"
            },
            {
              "text": "لَيْلَة",
              "root": "ليلة",
              "category": "isim (dişil)"
            },
            {
              "text": "ولَيْلَة\".",
              "root": "ليلة",
              "category": "atıf harfi + isim (dişil)"
            }
          ],
          "turkish": [
            "okuyorum.",
            "«Binbir Gece Masalı»nı",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "«Binbir Gece Masalı»nı okuyorum.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أَقْرَأُ",
              "root": "قرأ",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "كِتاب",
              "root": "كتاب",
              "category": "isim"
            },
            {
              "text": "\"نُكْتَة",
              "root": "نكتة",
              "category": "isim"
            },
            {
              "text": "جُحا\".",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "Ben",
            "okuyorum.",
            "«Cuha Fıkraları» kitabını",
            "—",
            "—"
          ],
          "turkishFull": "Ben «Cuha Fıkraları» kitabını okuyorum.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "أَقْرَأُ",
              "root": "قرأ",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "قِصَّة",
              "root": "قصة",
              "category": "isim"
            },
            {
              "text": "كُلَّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "يَوْم.",
              "root": "يوم",
              "category": "isim"
            }
          ],
          "turkish": [
            "okurum.",
            "bir hikâye",
            "Her gün",
            "—"
          ],
          "turkishFull": "Her gün bir hikâye okurum.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "أُفَضِّلُ",
              "root": "أفضل",
              "category": "isim"
            },
            {
              "text": "قِراءَة",
              "root": "قراءة",
              "category": "isim (mastar)"
            },
            {
              "text": "كُتُب",
              "root": "كتب",
              "category": "fiil (mazi)"
            },
            {
              "text": "الشِّعْر.",
              "root": "شعر",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "tercih ederim.",
            "okumayı",
            "Şiir kitapları",
            "—"
          ],
          "turkishFull": "Şiir kitapları okumayı tercih ederim.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "يَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari)"
            },
            {
              "text": "الدَّرْس",
              "root": "درس",
              "category": "isim (ال takılı)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "مَكْتَبَة",
              "root": "مكتبة",
              "category": "isim"
            },
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مع",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "أَصْدِقائِه",
              "root": "صديق",
              "category": "isim (kırık çoğul) + bitişik zamir (o)"
            }
          ],
          "turkish": [
            "gider.",
            "Ders(ten sonra)",
            "okul kütüphanesine",
            "arkadaşlarıyla",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ders(ten sonra) arkadaşlarıyla okul kütüphanesine gider.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "يَقْرَأُ",
              "root": "قرأ",
              "category": "fiil (muzari)"
            },
            {
              "text": "كُتُب",
              "root": "كتب",
              "category": "fiil (mazi)"
            },
            {
              "text": "القِصَّة",
              "root": "قصة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "النُّكْتَة.",
              "root": "نكتة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "okur.",
            "hikâye kitaplarını",
            "ve fıkraları",
            "—"
          ],
          "turkishFull": "hikâye kitaplarını ve fıkraları okur.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "جُحا",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "شَخْصٌ",
              "root": "شخص",
              "category": "fiil (mazi)"
            },
            {
              "text": "مَشْهور.",
              "root": "مشهور",
              "category": "isim"
            }
          ],
          "turkish": [
            "Cuha",
            "bir şahsiyettir.",
            "meşhur"
          ],
          "turkishFull": "Cuha meşhur bir şahsiyettir.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "فَـ",
              "root": "ف",
              "category": "bağlaç"
            },
            {
              "text": "جُحا",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "كانَ",
              "root": "كان",
              "category": "fiil (mazi)"
            },
            {
              "text": "يَمْشي",
              "root": "مشى",
              "category": "fiil (muzari)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "السّوق",
              "root": "سوق",
              "category": "isim (ال takılı)"
            },
            {
              "text": "رَأى",
              "root": "رأى",
              "category": "fiil (mazi)"
            },
            {
              "text": "أَحَد",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "أَصْدِقائِه.",
              "root": "صديق",
              "category": "isim (kırık çoğul) + bitişik zamir (o)"
            }
          ],
          "turkish": [
            "derken",
            "Cuha",
            "yürüyordu,",
            "çarşıda",
            "gördü.",
            "arkadaşlarından birini",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Cuha çarşıda yürüyordu, derken arkadaşlarından birini gördü.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "فَقالَ",
              "root": "قال",
              "category": "atıf harfi + fiil (mazi)"
            },
            {
              "text": "جُحا",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "\"نَعَم،",
              "root": "نعم",
              "category": "cevap harfi"
            },
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "صادِق",
              "root": "صادق",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "كَلامي",
              "root": "كلام",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "دائِمًا\".",
              "root": "دائما",
              "category": "zarf"
            }
          ],
          "turkish": [
            "dedi:",
            "Cuha",
            "«Evet, ben sözümde hep doğruyum.»",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Cuha dedi: «Evet, ben sözümde hep doğruyum.»",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "قالَ",
              "root": "قال",
              "category": "fiil (mazi)"
            },
            {
              "text": "عَمُّهُ",
              "root": "عم",
              "category": "fiil (mazi) + bitişik zamir (o)"
            },
            {
              "text": "يَوْمًا:",
              "root": "يوم",
              "category": "isim"
            },
            {
              "text": "لَهُ",
              "root": "له",
              "category": "edat + bitişik zamir (o)"
            }
          ],
          "turkish": [
            "dedi ki:",
            "amcası",
            "Bir gün",
            "ona"
          ],
          "turkishFull": "Bir gün amcası ona dedi ki:",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "وزَوْجَتُهُ",
              "root": "زوجة",
              "category": "atıf harfi + isim + bitişik zamir (o)"
            },
            {
              "text": "شَهْرَزاد",
              "root": "شهرزاد",
              "category": "isim"
            },
            {
              "text": "تَحْكي",
              "root": "حكى",
              "category": "fiil (muzari)"
            },
            {
              "text": "قِصَصًا",
              "root": "قصصا",
              "category": "zarf"
            },
            {
              "text": "لَهُ",
              "root": "له",
              "category": "edat + bitişik zamir (o)"
            },
            {
              "text": "لِمُدَّة",
              "root": "مدة",
              "category": "harf-i cer + isim"
            },
            {
              "text": "أَلْف",
              "root": "ألف",
              "category": "fiil (mazi)"
            },
            {
              "text": "لَيْلَة",
              "root": "ليلة",
              "category": "isim (dişil)"
            },
            {
              "text": "ولَيْلَة.",
              "root": "ليلة",
              "category": "atıf harfi + isim (dişil)"
            }
          ],
          "turkish": [
            "Karısı",
            "Şehrazat",
            "hikâyeler anlatır.",
            "ona",
            "bin bir gece boyunca",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Karısı Şehrazat ona bin bir gece boyunca hikâyeler anlatır.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "جُحا،",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "الحِمار",
              "root": "حمار",
              "category": "isim (ال takılı)"
            },
            {
              "text": "هُنا،",
              "root": "هنا",
              "category": "zarf"
            },
            {
              "text": "لَكِنَّك",
              "root": "لكنك",
              "category": "bağlaç + bitişik zamir (sen)"
            },
            {
              "text": "تَقولُ",
              "root": "قال",
              "category": "fiil (muzari)"
            },
            {
              "text": "لي",
              "root": "لي",
              "category": "edat + bitişik zamir (ben)"
            },
            {
              "text": "\"الحِمار",
              "root": "حمار",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لَيْسَ",
              "root": "ليس",
              "category": "edat"
            },
            {
              "text": "هُنا\".",
              "root": "هنا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Ey Cuha,",
            "eşek",
            "burada,",
            "ama sen bana",
            "«eşek burada değil» diyorsun.",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ey Cuha, eşek burada, ama sen bana «eşek burada değil» diyorsun.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "يَغْضَبُ",
              "root": "غضب",
              "category": "fiil (muzari)"
            },
            {
              "text": "جُحا",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "ويَقولُ",
              "root": "قال",
              "category": "atıf harfi + fiil (muzari)"
            },
            {
              "text": "لَهُ:",
              "root": "له",
              "category": "edat + bitişik zamir (o)"
            }
          ],
          "turkish": [
            "kızar",
            "Cuha",
            "ve ona der ki:",
            "—"
          ],
          "turkishFull": "Cuha kızar ve ona der ki:",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "هو",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "يَنْظُرُ",
              "root": "نظر",
              "category": "fiil (muzari)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "الكُتُب.",
              "root": "كتاب",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "O",
            "bakıyor.",
            "kitaplara",
            "—"
          ],
          "turkishFull": "O kitaplara bakıyor.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "أُفَضِّلُ",
              "root": "أفضل",
              "category": "isim"
            },
            {
              "text": "قِراءَة",
              "root": "قراءة",
              "category": "isim (mastar)"
            },
            {
              "text": "كُتُب",
              "root": "كتب",
              "category": "fiil (mazi)"
            },
            {
              "text": "الشِّعْر.",
              "root": "شعر",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "tercih ederim.",
            "okumayı",
            "Şiir kitapları",
            "—"
          ],
          "turkishFull": "Şiir kitapları okumayı tercih ederim.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "ذَهَبَتْ",
              "root": "ذهب",
              "category": "fiil (mazi)"
            },
            {
              "text": "لَيْلى",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "مَعْرِض",
              "root": "معرض",
              "category": "isim"
            },
            {
              "text": "الكِتاب",
              "root": "كتاب",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الظُّهْر.",
              "root": "ظهر",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "gitti.",
            "Leylâ",
            "kitap fuarına",
            "öğleden sonra",
            "—",
            "—"
          ],
          "turkishFull": "Leylâ öğleden sonra kitap fuarına gitti.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "خَرَجَتْ",
              "root": "خرج",
              "category": "fiil (mazi)"
            },
            {
              "text": "لَيْلى",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "مِن",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "المَعْرِض،",
              "root": "معرض",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "çıktı,",
            "Leylâ",
            "fuardan",
            "—"
          ],
          "turkishFull": "Leylâ fuardan çıktı,",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "الخَزّافَة",
              "root": "خزافة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لا",
              "root": "لا",
              "category": "edat"
            },
            {
              "text": "تَصْنَعُ",
              "root": "صنع",
              "category": "fiil (muzari)"
            },
            {
              "text": "هذه",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "الأَشْياء.",
              "root": "شيء",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "Çinici (kadın)",
            "yapmıyor.",
            "bu eşyaları",
            "—",
            "—"
          ],
          "turkishFull": "Çinici (kadın) bu eşyaları yapmıyor.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "تَجْليد",
              "root": "تجليد",
              "category": "isim"
            },
            {
              "text": "الكُتُب",
              "root": "كتاب",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "عَمَلٌ",
              "root": "عمل",
              "category": "fiil (mazi)"
            },
            {
              "text": "دَقيق.",
              "root": "دقيق",
              "category": "isim"
            }
          ],
          "turkish": [
            "Kitap ciltleme",
            "bir iştir.",
            "ince",
            "—"
          ],
          "turkishFull": "Kitap ciltleme ince bir iştir.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "كَيْف",
              "root": "كيف",
              "category": "soru edatı"
            },
            {
              "text": "أَذْهَبُ",
              "root": "ذهب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "مِن",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المَكْتَبَة؟",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "nasıl",
            "giderim?",
            "Okuldan",
            "kütüphaneye",
            "—",
            "—"
          ],
          "turkishFull": "Okuldan kütüphaneye nasıl giderim?",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "اِذْهَبْ",
              "root": "ذهب",
              "category": "fiil (emir)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "الأَمام.",
              "root": "أمام",
              "category": "zarf"
            }
          ],
          "turkish": [
            "git.",
            "İleri",
            "—"
          ],
          "turkishFull": "İleri git.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "اِمْشِ",
              "root": "مشى",
              "category": "fiil (emir)"
            },
            {
              "text": "قَليلًا.",
              "root": "قليل",
              "category": "isim"
            }
          ],
          "turkish": [
            "Sonra",
            "yürü.",
            "biraz"
          ],
          "turkishFull": "Sonra biraz yürü.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "سَأَزورُ",
              "root": "زار",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "صَديقي",
              "root": "صديق",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "أَحْمَد،",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "لِأَنَّهُ",
              "root": "لأنه",
              "category": "bağlaç + bitişik zamir (o)"
            },
            {
              "text": "مَريض",
              "root": "مريض",
              "category": "isim"
            },
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "أُمّي.",
              "root": "أم",
              "category": "isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "ziyaret edeceğim,",
            "Arkadaşım Ahmet'i",
            "çünkü o hasta",
            "anneciğim.",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Arkadaşım Ahmet'i ziyaret edeceğim, çünkü o hasta anneciğim.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "لِقاء",
              "root": "لقاء",
              "category": "isim"
            },
            {
              "text": "الأَصْدِقاء",
              "root": "صديق",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "سِرّ",
              "root": "سار",
              "category": "fiil (emir)"
            },
            {
              "text": "السَّعادَة.",
              "root": "سعادة",
              "category": "isim (mastar · ال takılı)"
            }
          ],
          "turkish": [
            "Arkadaşlarla buluşmak",
            "sırrıdır.",
            "mutluluğun",
            "—"
          ],
          "turkishFull": "Arkadaşlarla buluşmak mutluluğun sırrıdır.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "نَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المَكْتَبَة،",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "نَلْعَبُ",
              "root": "لعب",
              "category": "fiil (muzari)"
            },
            {
              "text": "كُرَة",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "السَّلَة.",
              "root": "سلة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "gideriz,",
            "kütüphaneye",
            "sonra",
            "oynarız.",
            "basketbol",
            "—",
            "—"
          ],
          "turkishFull": "kütüphaneye gideriz, sonra basketbol oynarız.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "مَتى",
              "root": "متى",
              "category": "soru edatı"
            },
            {
              "text": "تَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "مُخْتَبَر",
              "root": "مختبر",
              "category": "isim"
            },
            {
              "text": "المَدْرَسَة؟",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "ne zaman gidiyorsun?",
            "Okul laboratuvarına",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Okul laboratuvarına ne zaman gidiyorsun?",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "الجَوّ",
              "root": "جو",
              "category": "isim (ال takılı)"
            },
            {
              "text": "بارِد،",
              "root": "بارد",
              "category": "isim"
            },
            {
              "text": "لِذَلِكَ",
              "root": "لذلك",
              "category": "bağlaç"
            },
            {
              "text": "أَلْبَسُ",
              "root": "لبس",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "المِعْطَف",
              "root": "معطف",
              "category": "isim (ال takılı)"
            },
            {
              "text": "والجِزْمَة.",
              "root": "جزمة",
              "category": "atıf harfi + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Hava soğuk,",
            "bu yüzden",
            "giyerim.",
            "mont ve bot",
            "—",
            "—"
          ],
          "turkishFull": "Hava soğuk, bu yüzden mont ve bot giyerim.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "أَلْعَبُ",
              "root": "لعب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "مع",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "أَصْدِقائي.",
              "root": "صديق",
              "category": "isim (kırık çoğul) + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "oynarım.",
            "Arkadaşlarımla",
            "—"
          ],
          "turkishFull": "Arkadaşlarımla oynarım.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "أَكْتُبُ",
              "root": "كتب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "كُتُبي.",
              "root": "كتب",
              "category": "fiil (mazi) + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "yazarım.",
            "Kitaplarımı"
          ],
          "turkishFull": "Kitaplarımı yazarım.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "اليَوْم",
              "root": "يوم",
              "category": "zarf (zaman)"
            },
            {
              "text": "سَنُنَظِّفُ",
              "root": "نظف",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "صَفَّنا",
              "root": "صف",
              "category": "fiil (mazi) + bitişik zamir (biz)"
            },
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "طُلّاب،",
              "root": "طالب",
              "category": "isim (kırık çoğul)"
            },
            {
              "text": "هَلْ",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "أَنْتُم",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "جاهِزون؟",
              "root": "جاهز",
              "category": "isim (düzenli çoğul)"
            }
          ],
          "turkish": [
            "Bugün",
            "temizleyeceğiz",
            "sınıfımızı",
            "öğrenciler,",
            "hazır mısınız?",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Bugün sınıfımızı temizleyeceğiz öğrenciler, hazır mısınız?",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "ماذا",
              "root": "ماذا",
              "category": "soru edatı"
            },
            {
              "text": "سَتَفْعَلُ",
              "root": "فعل",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "مَرْيَم",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "وآيْنور؟",
              "root": "آينور",
              "category": "atıf harfi + isim"
            }
          ],
          "turkish": [
            "ne",
            "yapacak?",
            "Meryem ve Aynur",
            "—"
          ],
          "turkishFull": "Meryem ve Aynur ne yapacak?",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "مَنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "سَيُنَظِّفُ",
              "root": "نظف",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "الأَرْض؟",
              "root": "أرض",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "kim",
            "temizleyecek?",
            "Yeri"
          ],
          "turkishFull": "Yeri kim temizleyecek?",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "فِعْل",
              "root": "فعل",
              "category": "fiil (mazi)"
            },
            {
              "text": "الخَيْر",
              "root": "خير",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "İyilik yapmak",
            "—"
          ],
          "turkishFull": "İyilik yapmak",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "وغَدًا",
              "root": "غدا",
              "category": "atıf harfi + zarf"
            },
            {
              "text": "سَنَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "مَعَ",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "مُعَلِّمِنا",
              "root": "معلم",
              "category": "isim + bitişik zamir (biz)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "مِنْطَقَة",
              "root": "منطقة",
              "category": "isim (dişil)"
            },
            {
              "text": "الزِّلْزال",
              "root": "زلزال",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِزِيارَة",
              "root": "زيارة",
              "category": "harf-i cer + isim"
            },
            {
              "text": "المَنْكوبين،",
              "root": "منكوب",
              "category": "isim (düzenli çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "Yarın",
            "gideceğiz",
            "öğretmenimizle",
            "deprem bölgesine",
            "afetzedeleri ziyarete",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Yarın öğretmenimizle deprem bölgesine afetzedeleri ziyarete gideceğiz",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "الصَّدَقَة",
              "root": "صدقة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "تَدْفَعُ",
              "root": "دفع",
              "category": "fiil (muzari)"
            },
            {
              "text": "البَلاء.",
              "root": "بلاء",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sadaka",
            "def eder.",
            "belayı"
          ],
          "turkishFull": "Sadaka belayı def eder.",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "بَعْدَ",
              "root": "بعد",
              "category": "fiil (mazi)"
            },
            {
              "text": "الصَّلاة",
              "root": "صلاة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "سَنَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "بَيْت",
              "root": "بيت",
              "category": "isim"
            },
            {
              "text": "جَدِّك",
              "root": "جد",
              "category": "fiil (mazi) + bitişik zamir (sen)"
            },
            {
              "text": "لِلْفَطور.",
              "root": "فطور",
              "category": "harf-i cer + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Namazdan sonra",
            "gideceğiz.",
            "dedenin evine",
            "kahvaltı için",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Namazdan sonra kahvaltı için dedenin evine gideceğiz.",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "ماذا",
              "root": "ماذا",
              "category": "soru edatı"
            },
            {
              "text": "مُحَمَّد",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "سَيَفْعَلُ",
              "root": "فعل",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "قَبْلَ",
              "root": "قبل",
              "category": "fiil (mazi)"
            },
            {
              "text": "صَلاة",
              "root": "صلاة",
              "category": "isim"
            },
            {
              "text": "العيد؟",
              "root": "عيد",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "ne",
            "Muhammed",
            "yapacak?",
            "bayram namazından önce",
            "—",
            "—"
          ],
          "turkishFull": "Muhammed bayram namazından önce ne yapacak?",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "أَيْن",
              "root": "أين",
              "category": "soru edatı"
            },
            {
              "text": "العائِلَة",
              "root": "عائلة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "سَتَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "بَعْدَ",
              "root": "بعد",
              "category": "fiil (mazi)"
            },
            {
              "text": "صَلاة",
              "root": "صلاة",
              "category": "isim"
            },
            {
              "text": "العيد؟",
              "root": "عيد",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "nereye",
            "Aile",
            "gidecek?",
            "bayram namazından sonra",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Aile bayram namazından sonra nereye gidecek?",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "سَنُنَظِّفُ",
              "root": "نظف",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "النَّظافَة",
              "root": "نظافة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "حَديقَة",
              "root": "حديقة",
              "category": "isim"
            },
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "أُمّي.",
              "root": "أم",
              "category": "isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "temizleyeceğiz",
            "Temizlik kulübünde",
            "okul bahçesini",
            "anneciğim.",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Temizlik kulübünde okul bahçesini temizleyeceğiz anneciğim.",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "سَيَقْرَأُ",
              "root": "قرأ",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "فُرْقان",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "الكِتاب",
              "root": "كتاب",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "البَيْت.",
              "root": "بيت",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "okuyacak.",
            "Furkan",
            "kitap",
            "evde",
            "—"
          ],
          "turkishFull": "Furkan evde kitap okuyacak.",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "أُمّي،",
              "root": "أم",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "اُنْظُري",
              "root": "نظر",
              "category": "fiil (emir) + bitişik zamir (ben)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "الفيل،",
              "root": "فيل",
              "category": "isim (ال takılı)"
            },
            {
              "text": "هُوَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "كَبير",
              "root": "كبير",
              "category": "isim"
            },
            {
              "text": "جِدًّا.",
              "root": "جدا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Anneciğim,",
            "bak,",
            "file",
            "o çok büyük.",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Anneciğim, file bak, o çok büyük.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "ذَهَبْتُ",
              "root": "ذهب",
              "category": "fiil (mazi)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "الغابَة",
              "root": "غابة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مَعَ",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "صَديقي",
              "root": "صديق",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "نِهايَة",
              "root": "نهاية",
              "category": "isim (mastar · dişil)"
            },
            {
              "text": "الأُسْبوع.",
              "root": "أسبوع",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "gittim.",
            "ormana",
            "arkadaşımla",
            "Hafta sonunda",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Hafta sonunda arkadaşımla ormana gittim.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "لَعِبْنا",
              "root": "لعب",
              "category": "fiil (mazi)"
            },
            {
              "text": "هُناك،",
              "root": "هنا",
              "category": "zarf + bitişik zamir (sen)"
            },
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "رَجَعْنا",
              "root": "رجع",
              "category": "fiil (mazi)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "بَيْتِنا",
              "root": "بيت",
              "category": "isim + bitişik zamir (biz)"
            },
            {
              "text": "مَساءً.",
              "root": "مساء",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "oynadık,",
            "Orada",
            "sonra",
            "evimize döndük.",
            "akşam",
            "—",
            "—"
          ],
          "turkishFull": "Orada oynadık, sonra akşam evimize döndük.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "النَّحْلَة",
              "root": "نحلة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "تَصْنَعُ",
              "root": "صنع",
              "category": "fiil (muzari)"
            },
            {
              "text": "العَسَل.",
              "root": "عسل",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Arı",
            "yapar.",
            "bal"
          ],
          "turkishFull": "Arı bal yapar.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "الحِصان",
              "root": "حصان",
              "category": "isim (ال takılı)"
            },
            {
              "text": "يَجْري",
              "root": "جرى",
              "category": "fiil (muzari)"
            },
            {
              "text": "سَريعًا.",
              "root": "سريع",
              "category": "isim"
            }
          ],
          "turkish": [
            "At",
            "koşar.",
            "hızlı"
          ],
          "turkishFull": "At hızlı koşar.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "السَّمَكَة",
              "root": "سمكة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "تَعيشُ",
              "root": "عاش",
              "category": "fiil (muzari)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "الماء.",
              "root": "ماء",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Balık",
            "yaşar.",
            "suda",
            "—"
          ],
          "turkishFull": "Balık suda yaşar.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "قَبْلَ",
              "root": "قبل",
              "category": "fiil (mazi)"
            },
            {
              "text": "الكَوارِث",
              "root": "كارثة",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "الطَّبيعِيَّة",
              "root": "طبيعي",
              "category": "isim (sıfat · ال takılı · dişil)"
            },
            {
              "text": "يَجِبُ",
              "root": "وجب",
              "category": "fiil (muzari)"
            },
            {
              "text": "عَلَيْنا",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "الاِسْتِعْداد",
              "root": "استعداد",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لَها.",
              "root": "لها",
              "category": "edat + bitişik zamir (o · dişil)"
            }
          ],
          "turkish": [
            "Doğal afetlerden önce",
            "hazırlanmamız gerekir.",
            "onlara",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Doğal afetlerden önce onlara hazırlanmamız gerekir.",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "اِنْهِيار",
              "root": "انهيار",
              "category": "isim"
            },
            {
              "text": "أَرْضِيّ",
              "root": "رضي",
              "category": "soru edatı + fiil (mazi)"
            }
          ],
          "turkish": [
            "Toprak kayması",
            "—"
          ],
          "turkishFull": "Toprak kayması",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "اِنْهِيار",
              "root": "انهيار",
              "category": "isim"
            },
            {
              "text": "ثَلْجِيّ",
              "root": "ثلج",
              "category": "fiil (mazi) + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "Çığ",
            "—"
          ],
          "turkishFull": "Çığ",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "بَرْد",
              "root": "برد",
              "category": "fiil (mazi)"
            },
            {
              "text": "شَديد",
              "root": "شديد",
              "category": "isim"
            }
          ],
          "turkish": [
            "Şiddetli soğuk",
            "—"
          ],
          "turkishFull": "Şiddetli soğuk",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "يَحْدُثُ",
              "root": "حدث",
              "category": "fiil (muzari)"
            },
            {
              "text": "الزِّلْزال",
              "root": "زلزال",
              "category": "isim (ال takılı)"
            },
            {
              "text": "كَثيرًا",
              "root": "كثيرا",
              "category": "zarf"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "تُرْكِيا",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "deprem çok olur,",
            "Türkiye'de",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Türkiye'de deprem çok olur,",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "كُرَة",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "القَدَم",
              "root": "قدم",
              "category": "isim (ال takılı)"
            },
            {
              "text": "ظَهَرَتْ",
              "root": "ظهر",
              "category": "fiil (mazi)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "إِنْجِلْتَرا.",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            }
          ],
          "turkish": [
            "Futbol",
            "ortaya çıkmıştır.",
            "İngiltere'de",
            "—",
            "—"
          ],
          "turkishFull": "Futbol İngiltere'de ortaya çıkmıştır.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "والكُرَة",
              "root": "كرة",
              "category": "atıf harfi + isim (ال takılı)"
            },
            {
              "text": "الطّائِرَة",
              "root": "طائرة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "ظَهَرَتْ",
              "root": "ظهر",
              "category": "fiil (mazi)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "أَمْريكا.",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            }
          ],
          "turkish": [
            "Voleybol",
            "ortaya çıkmıştır.",
            "Amerika'da",
            "—",
            "—"
          ],
          "turkishFull": "Voleybol Amerika'da ortaya çıkmıştır.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "صَحيح!",
              "root": "صحيح",
              "category": "isim"
            },
            {
              "text": "وأَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أَلْعَبُ",
              "root": "لعب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "كُرَةَ",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "القَدَم",
              "root": "قدم",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "نِهايَة",
              "root": "نهاية",
              "category": "isim (mastar · dişil)"
            },
            {
              "text": "كُلِّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "أُسْبوع.",
              "root": "أسبوع",
              "category": "isim"
            }
          ],
          "turkish": [
            "Doğru!",
            "Ben de",
            "futbol oynarım.",
            "her hafta sonu",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Doğru! Ben de her hafta sonu futbol oynarım.",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "تَزيدُ",
              "root": "زاد",
              "category": "fiil (muzari)"
            },
            {
              "text": "مِن",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "الطّاقَة.",
              "root": "طاقة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Spor",
            "artırır.",
            "enerjiyi",
            "—"
          ],
          "turkishFull": "Spor enerjiyi artırır.",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "أُفَضِّلُ",
              "root": "أفضل",
              "category": "isim"
            },
            {
              "text": "مِثْل",
              "root": "مثل",
              "category": "fiil (mazi)"
            },
            {
              "text": "الجَرْي",
              "root": "جري",
              "category": "isim (ال takılı)"
            },
            {
              "text": "ورُكوب",
              "root": "ركوب",
              "category": "atıf harfi + isim"
            },
            {
              "text": "الدَّرّاجَة،",
              "root": "دراجة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الرِّياضات",
              "root": "رياضة",
              "category": "isim (dişil çoğul · ال takılı)"
            },
            {
              "text": "الفَرْدِيَّة،",
              "root": "فردي",
              "category": "isim (sıfat · ال takılı · dişil)"
            },
            {
              "text": "وأَنْتَ؟",
              "root": "SKIP",
              "category": "zamir"
            }
          ],
          "turkish": [
            "tercih ederim,",
            "Koşu ve bisiklete binme gibi",
            "bireysel sporları",
            "ya sen?",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Koşu ve bisiklete binme gibi bireysel sporları tercih ederim, ya sen?",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "أَلْعَبُ",
              "root": "لعب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "كُرَة",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "الطّاوِلَة",
              "root": "طاولة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مَعَ",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "أَخي.",
              "root": "أخ",
              "category": "isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "oynarım.",
            "Masa tenisini",
            "kardeşimle",
            "—",
            "—"
          ],
          "turkishFull": "Masa tenisini kardeşimle oynarım.",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "أَرْكَبُ",
              "root": "ركب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "الدَّرّاجَة",
              "root": "دراجة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "كُلَّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "صَباح.",
              "root": "صباح",
              "category": "isim"
            }
          ],
          "turkish": [
            "bisiklete binerim.",
            "Her sabah",
            "—",
            "—"
          ],
          "turkishFull": "Her sabah bisiklete binerim.",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "مَرْحَبًا",
              "root": "مرحب",
              "category": "isim"
            },
            {
              "text": "كَريم!",
              "root": "كريم",
              "category": "isim"
            },
            {
              "text": "هل",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "ذَهَبْتَ",
              "root": "ذهب",
              "category": "fiil (mazi)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "حَفْلَة",
              "root": "حفلة",
              "category": "isim (dişil)"
            },
            {
              "text": "التَّخَرُّج",
              "root": "تخرج",
              "category": "isim (mastar · ال takılı)"
            },
            {
              "text": "أَمْس؟",
              "root": "أمس",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "Merhaba Kerim!",
            "gittin mi?",
            "mezuniyet törenine",
            "Dün",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Merhaba Kerim! Dün mezuniyet törenine gittin mi?",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "طَبْعًا",
              "root": "طبعا",
              "category": "zarf"
            },
            {
              "text": "ذَهَبْتُ.",
              "root": "ذهب",
              "category": "fiil (mazi)"
            }
          ],
          "turkish": [
            "Tabii ki",
            "gittim."
          ],
          "turkishFull": "Tabii ki gittim.",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "مَتى",
              "root": "متى",
              "category": "soru edatı"
            },
            {
              "text": "بَدَأَتْ؟",
              "root": "بدأ",
              "category": "fiil (mazi)"
            }
          ],
          "turkish": [
            "Ne zaman",
            "başladı?"
          ],
          "turkishFull": "Ne zaman başladı?",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "بَدَأَتْ",
              "root": "بدأ",
              "category": "fiil (mazi)"
            },
            {
              "text": "بَعْدَ",
              "root": "بعد",
              "category": "fiil (mazi)"
            },
            {
              "text": "الظُّهْر",
              "root": "ظهر",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "حَديقَة",
              "root": "حديقة",
              "category": "isim"
            },
            {
              "text": "المَدْرَسَة.",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "başladı.",
            "Öğleden sonra",
            "okul bahçesinde",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Öğleden sonra okul bahçesinde başladı.",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "ماذا",
              "root": "ماذا",
              "category": "soru edatı"
            },
            {
              "text": "فَعَلْتَ",
              "root": "فعل",
              "category": "fiil (mazi)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "الحَفْلَة؟",
              "root": "حفلة",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "ne",
            "yaptın?",
            "Törende",
            "—"
          ],
          "turkishFull": "Törende ne yaptın?",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "خَرَجَ",
              "root": "خرج",
              "category": "fiil (mazi)"
            },
            {
              "text": "مِن",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "البَيْت",
              "root": "بيت",
              "category": "isim (ال takılı)"
            },
            {
              "text": "صَباحًا.",
              "root": "صباحا",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "çıktı.",
            "evden",
            "Sabahleyin",
            "—"
          ],
          "turkishFull": "Sabahleyin evden çıktı.",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "دَخَلَتْ",
              "root": "دخل",
              "category": "fiil (mazi)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "الصَّفّ",
              "root": "صف",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الثّامِنَة.",
              "root": "ثامنة",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "girdi.",
            "sınıfa",
            "Saat sekizde",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Saat sekizde sınıfa girdi.",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "قَرَأْتَ",
              "root": "قرأ",
              "category": "fiil (mazi)"
            },
            {
              "text": "الشِّعْر",
              "root": "شعر",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "الحَفْلَة.",
              "root": "حفلة",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "şiir okudun.",
            "Törende",
            "—",
            "—"
          ],
          "turkishFull": "Törende şiir okudun.",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "حَصَلْتِ",
              "root": "حصل",
              "category": "fiil (mazi)"
            },
            {
              "text": "عَلى",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "شَهادَة",
              "root": "شهادة",
              "category": "isim (mastar · dişil)"
            },
            {
              "text": "تَقْدير.",
              "root": "تقدير",
              "category": "isim"
            }
          ],
          "turkish": [
            "aldın.",
            "Takdir belgesi",
            "—",
            "—"
          ],
          "turkishFull": "Takdir belgesi aldın.",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "خَرَجَ",
              "root": "خرج",
              "category": "fiil (mazi)"
            },
            {
              "text": "مِن",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "البَيْت",
              "root": "بيت",
              "category": "isim (ال takılı)"
            },
            {
              "text": "صَباحًا.",
              "root": "صباحا",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "Sonra",
            "evden çıktı.",
            "sabahleyin",
            "—",
            "—"
          ],
          "turkishFull": "Sonra sabahleyin evden çıktı.",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "ذَهَبَ",
              "root": "ذهب",
              "category": "fiil (mazi)"
            },
            {
              "text": "مَعَ",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "أُخْتِهِ",
              "root": "أخت",
              "category": "isim + bitişik zamir (o)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "حَفْلَة",
              "root": "حفلة",
              "category": "isim (dişil)"
            },
            {
              "text": "التَّخَرُّج",
              "root": "تخرج",
              "category": "isim (mastar · ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "المَدْرَسَة.",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sonra kız kardeşiyle",
            "okuldaki mezuniyet törenine gitti.",
            "—",
            "—",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Sonra kız kardeşiyle okuldaki mezuniyet törenine gitti.",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "مَنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "ذَهَبَ؟",
              "root": "ذهب",
              "category": "fiil (mazi)"
            }
          ],
          "turkish": [
            "Kim",
            "gitti?"
          ],
          "turkishFull": "Kim gitti?",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "مَتى",
              "root": "متى",
              "category": "soru edatı"
            },
            {
              "text": "حَفْلَة",
              "root": "حفلة",
              "category": "isim (dişil)"
            },
            {
              "text": "التَّخَرُّج",
              "root": "تخرج",
              "category": "isim (mastar · ال takılı)"
            },
            {
              "text": "بَدَأَتْ؟",
              "root": "بدأ",
              "category": "fiil (mazi)"
            }
          ],
          "turkish": [
            "ne zaman",
            "Mezuniyet töreni",
            "başladı?",
            "—"
          ],
          "turkishFull": "Mezuniyet töreni ne zaman başladı?",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "أَنام",
              "root": "نام",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "مُبَكِّرًا",
              "root": "مبكرا",
              "category": "zarf"
            },
            {
              "text": "كُلَّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "يَوْم.",
              "root": "يوم",
              "category": "isim"
            }
          ],
          "turkish": [
            "erken yatarım.",
            "Her gün",
            "—",
            "—"
          ],
          "turkishFull": "Her gün erken yatarım.",
          "ders": "8_6_2"
        },
        {
          "arabic": [
            {
              "text": "سَأَزورُ",
              "root": "زار",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "أَصْدِقائي",
              "root": "صديق",
              "category": "isim (kırık çoğul) + bitişik zamir (ben)"
            },
            {
              "text": "بَعْدَ",
              "root": "بعد",
              "category": "fiil (mazi)"
            },
            {
              "text": "التَّخَرُّج.",
              "root": "تخرج",
              "category": "isim (mastar · ال takılı)"
            }
          ],
          "turkish": [
            "arkadaşlarımı ziyaret edeceğim.",
            "Mezuniyetten sonra",
            "—",
            "—"
          ],
          "turkishFull": "Mezuniyetten sonra arkadaşlarımı ziyaret edeceğim.",
          "ders": "8_6_2"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "سَأَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari · istikbal · mütekellim)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "صَيْد",
              "root": "صيد",
              "category": "isim"
            },
            {
              "text": "الأَسْماك.",
              "root": "سمكة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "gideceğim.",
            "balık tutmaya",
            "—",
            "—"
          ],
          "turkishFull": "Ben balık tutmaya gideceğim.",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "هو",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "سَيَسْبَحُ",
              "root": "سبح",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "البَحْر.",
              "root": "بحر",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "O (erkek)",
            "yüzecek.",
            "denizde",
            "—"
          ],
          "turkishFull": "O (erkek) denizde yüzecek.",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "هي",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "سَتَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "المُخَيَّم.",
              "root": "مخيم",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "O (kız)",
            "gidecek.",
            "kampa",
            "—"
          ],
          "turkishFull": "O (kız) kampa gidecek.",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "وهُناك",
              "root": "هنا",
              "category": "atıf harfi + zarf + bitişik zamir (sen)"
            },
            {
              "text": "سَأَزورُ",
              "root": "زار",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "الأَقارِب",
              "root": "قريب",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "أَيْضًا.",
              "root": "أيضا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Orada ayrıca",
            "ziyaret edeceğim.",
            "akrabalarımı da",
            "—"
          ],
          "turkishFull": "Orada ayrıca akrabalarımı da ziyaret edeceğim.",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "ماذا",
              "root": "ماذا",
              "category": "soru edatı"
            },
            {
              "text": "سَتَفْعَلُ",
              "root": "فعل",
              "category": "fiil (muzari · istikbal)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "العُطْلَة؟",
              "root": "عطلة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "ne",
            "yapacaksın?",
            "Tatilde",
            "—"
          ],
          "turkishFull": "Tatilde ne yapacaksın?",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "أَيْن",
              "root": "أين",
              "category": "soru edatı"
            },
            {
              "text": "سَتَذْهَبُ؟",
              "root": "ذهب",
              "category": "fiil (muzari · istikbal)"
            }
          ],
          "turkish": [
            "Nereye",
            "gideceksin?",
            "—"
          ],
          "turkishFull": "Nereye gideceksin?",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "مَعَ",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "مَنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "سَتَذْهَبُ؟",
              "root": "ذهب",
              "category": "fiil (muzari · istikbal)"
            }
          ],
          "turkish": [
            "Kiminle",
            "gideceksin?",
            "—"
          ],
          "turkishFull": "Kiminle gideceksin?",
          "ders": "8_6_3"
        }
      ]
    },
    {
      "level": 4,
      "anahtar": "illetli",
      "hint": "<h3 dir=\"ltr\">Seviye 4 · İlletli, mehmuz ve mezid fiiller</h3><p class=\"ip-sinif\" dir=\"ltr\">8. sınıf muhâdese cümlelerinden</p><ul><li>Önceki seviyelerin kuralları geçerlidir.</li><li><b>Ecvef</b> (ortası illetli) fiilde harf geri gelir: <bdi class=\"ip-ar\">يَقولُ</bdi> → <bdi class=\"ip-ar\">قال</bdi>.</li><li><b>Misâl</b> fiilde düşen <bdi class=\"ip-ar\">و</bdi> geri gelir: <bdi class=\"ip-ar\">تَقَعُ</bdi> → <bdi class=\"ip-ar\">وقع</bdi>.</li><li><b>Mezid</b> fiil, artan harfleriyle birlikte aranır: <bdi class=\"ip-ar\">يُنَظِّفُ</bdi> → <bdi class=\"ip-ar\">نظف</bdi>.</li></ul><p class=\"ip-bas\" dir=\"ltr\">Bu seviyeden örnekler:</p><ul class=\"ip-ornek\"><li><bdi class=\"ip-ar\">سَنَخْتارُ</bdi> → <bdi class=\"ip-ar\"><b>اختار</b></bdi> <i>(fiil (muzari · istikbal · mezid))</i></li><li><bdi class=\"ip-ar\">أُحِبُّ</bdi> → <bdi class=\"ip-ar\"><b>أحب</b></bdi> <i>(fiil (mazi · mezid))</i></li><li><bdi class=\"ip-ar\">بُشْرى</bdi> → <bdi class=\"ip-ar\"><b>شرى</b></bdi> <i>(harf-i cer + fiil (mazi))</i></li><li><bdi class=\"ip-ar\">تُفَضِّلُ</bdi> → <bdi class=\"ip-ar\"><b>تفضل</b></bdi> <i>(fiil (mazi · mezid))</i></li><li><bdi class=\"ip-ar\">أَسْتَيْقِظُ</bdi> → <bdi class=\"ip-ar\"><b>استيقظ</b></bdi> <i>(fiil (muzari · mezid))</i></li><li><bdi class=\"ip-ar\">أُحافِظُ</bdi> → <bdi class=\"ip-ar\"><b>حافظ</b></bdi> <i>(soru edatı + fiil (mazi · mezid))</i></li></ul>",
      "sentences": [
        {
          "arabic": [
            {
              "text": "سَنَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · istikbal · mezid)"
            },
            {
              "text": "الأَنْدِيَة",
              "root": "نادي",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "اليَوْم.",
              "root": "يوم",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "seçeceğiz.",
            "kulüpleri",
            "Bugün"
          ],
          "turkishFull": "Bugün kulüpleri seçeceğiz.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الرَّسْم!",
              "root": "رسم",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "seviyorum!",
            "resmi"
          ],
          "turkishFull": "Ben resmi seviyorum!",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "إِذَنْ،",
              "root": "إذن",
              "category": "isim"
            },
            {
              "text": "أَنْتَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "تَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الرَّسْم.",
              "root": "رسم",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Öyleyse",
            "sen",
            "seçiyorsun.",
            "kulübünü",
            "resim"
          ],
          "turkishFull": "Öyleyse sen resim kulübünü seçiyorsun.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الشَّطْرَنْج",
              "root": "شطرنج",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِذَلِكَ",
              "root": "لذلك",
              "category": "bağlaç"
            },
            {
              "text": "أُفَضِّلُ",
              "root": "أفضل",
              "category": "isim"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الشَّطْرَنْج.",
              "root": "شطرنج",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "seviyorum,",
            "satrancı",
            "bu yüzden",
            "tercih ediyorum.",
            "kulübünü",
            "satranç"
          ],
          "turkishFull": "Ben satrancı seviyorum, bu yüzden satranç kulübünü tercih ediyorum.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِأَنَّني",
              "root": "لأنني",
              "category": "bağlaç + bitişik zamir (ben)"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الرِّياضَة.",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "seçiyorum",
            "kulübünü",
            "spor",
            "çünkü",
            "seviyorum.",
            "sporu"
          ],
          "turkishFull": "Ben spor kulübünü seçiyorum çünkü sporu seviyorum.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "فَريد",
              "root": "فريد",
              "category": "isim"
            },
            {
              "text": "يَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الرَّسْم.",
              "root": "رسم",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ferid",
            "seçiyor.",
            "kulübünü",
            "resim"
          ],
          "turkishFull": "Ferid resim kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "بُشْرى",
              "root": "شرى",
              "category": "harf-i cer + fiil (mazi)"
            },
            {
              "text": "تَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الشَّطْرَنْج.",
              "root": "شطرنج",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Büşra",
            "seçiyor.",
            "kulübünü",
            "satranç"
          ],
          "turkishFull": "Büşra satranç kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "مَرال",
              "root": "مرال",
              "category": "isim"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِذَلِكَ",
              "root": "لذلك",
              "category": "bağlaç"
            },
            {
              "text": "تَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الرِّياضَة.",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Meral",
            "seviyor,",
            "sporu",
            "bu yüzden",
            "seçiyor.",
            "kulübünü",
            "spor"
          ],
          "turkishFull": "Meral sporu seviyor, bu yüzden spor kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "بُشْرى",
              "root": "شرى",
              "category": "harf-i cer + fiil (mazi)"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "الرَّسْم",
              "root": "رسم",
              "category": "isim (ال takılı)"
            },
            {
              "text": "وَلَكِنْ",
              "root": "لكن",
              "category": "atıf harfi + bağlaç"
            },
            {
              "text": "تُفَضِّلُ",
              "root": "تفضل",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الشَّطْرَنْج.",
              "root": "شطرنج",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Büşra",
            "seviyor",
            "resmi",
            "ama",
            "tercih ediyor.",
            "kulübünü",
            "satranç"
          ],
          "turkishFull": "Büşra resmi seviyor ama satranç kulübünü tercih ediyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الموسيقى.",
              "root": "موسيقى",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "seçiyorum.",
            "kulübünü",
            "müzik"
          ],
          "turkishFull": "Ben müzik kulübünü seçiyorum.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "صَديقي",
              "root": "صديق",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "أَحْمَد",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "يَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الرَّسْم.",
              "root": "رسم",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Arkadaşım",
            "Ahmet",
            "seçiyor.",
            "kulübünü",
            "resim"
          ],
          "turkishFull": "Arkadaşım Ahmet resim kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "صَديقَتي",
              "root": "صديقة",
              "category": "isim (dişil) + bitişik zamir (ben)"
            },
            {
              "text": "أَليف",
              "root": "أليف",
              "category": "isim"
            },
            {
              "text": "تَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "المَسْرَحِيَّة.",
              "root": "مسرحية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Arkadaşım",
            "Elif",
            "seçiyor.",
            "kulübünü",
            "tiyatro"
          ],
          "turkishFull": "Arkadaşım Elif tiyatro kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "صَديقَتي",
              "root": "صديقة",
              "category": "isim (dişil) + bitişik zamir (ben)"
            },
            {
              "text": "مَرْوَة",
              "root": "مروة",
              "category": "isim"
            },
            {
              "text": "تَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "المَكْتَبَة.",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Arkadaşım",
            "Merve",
            "seçiyor.",
            "kulübünü",
            "kütüphane"
          ],
          "turkishFull": "Arkadaşım Merve kütüphane kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "هُوَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "يُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الرَّسْم،",
              "root": "رسم",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لَكِنْ",
              "root": "لكن",
              "category": "bağlaç"
            },
            {
              "text": "يَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "النَّظافَة.",
              "root": "نظافة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "O",
            "seviyor",
            "resmi",
            "ama",
            "seçiyor.",
            "kulübünü",
            "temizlik"
          ],
          "turkishFull": "O resmi seviyor ama temizlik kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الشَّطْرَنْج،",
              "root": "شطرنج",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِذَلِكَ",
              "root": "لذلك",
              "category": "bağlaç"
            },
            {
              "text": "أَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الشَّطْرَنْج.",
              "root": "شطرنج",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "seviyorum,",
            "satrancı",
            "bu yüzden",
            "seçiyorum.",
            "kulübünü",
            "satranç"
          ],
          "turkishFull": "Ben satrancı seviyorum, bu yüzden satranç kulübünü seçiyorum.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "هِيَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "الرِّياضَة،",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لَكِنْ",
              "root": "لكن",
              "category": "bağlaç"
            },
            {
              "text": "تَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "المَسْرَحِيَّة.",
              "root": "مسرحية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "O",
            "seviyor",
            "sporu",
            "ama",
            "seçiyor.",
            "kulübünü",
            "tiyatro"
          ],
          "turkishFull": "O sporu seviyor ama tiyatro kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَنْتَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "الموسيقى،",
              "root": "موسيقى",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِذَلِكَ",
              "root": "لذلك",
              "category": "bağlaç"
            },
            {
              "text": "تَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الموسيقى.",
              "root": "موسيقى",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sen",
            "seviyorsun,",
            "müziği",
            "bu yüzden",
            "seçiyorsun.",
            "kulübünü",
            "müzik"
          ],
          "turkishFull": "Sen müziği seviyorsun, bu yüzden müzik kulübünü seçiyorsun.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "صَديقي",
              "root": "صديق",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "فُرْقان",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "يُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "قِراءَة",
              "root": "قراءة",
              "category": "isim (mastar)"
            },
            {
              "text": "الكُتُب،",
              "root": "كتاب",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "وَلِذَلِكَ",
              "root": "لذلك",
              "category": "atıf harfi + bağlaç"
            },
            {
              "text": "يَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "المَكْتَبَة.",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Arkadaşım",
            "Furkan",
            "seviyor,",
            "okumayı",
            "kitap",
            "bu yüzden",
            "seçiyor.",
            "kulübünü",
            "kütüphane"
          ],
          "turkishFull": "Arkadaşım Furkan kitap okumayı seviyor, bu yüzden kütüphane kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "صَديقَتي",
              "root": "صديقة",
              "category": "isim (dişil) + bitişik zamir (ben)"
            },
            {
              "text": "سُمَيَّة",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "الشَّطْرَنْج،",
              "root": "شطرنج",
              "category": "isim (ال takılı)"
            },
            {
              "text": "وَلَكِنْ",
              "root": "لكن",
              "category": "atıf harfi + bağlaç"
            },
            {
              "text": "تَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الطَّبيعَة.",
              "root": "طبيعة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Arkadaşım",
            "Sümeyye",
            "seviyor",
            "satrancı",
            "ama",
            "seçiyor.",
            "kulübünü",
            "doğa"
          ],
          "turkishFull": "Arkadaşım Sümeyye satrancı seviyor ama doğa kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "صَديقَتي",
              "root": "صديقة",
              "category": "isim (dişil) + bitişik zamir (ben)"
            },
            {
              "text": "مَرْيَم",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "الموسيقى،",
              "root": "موسيقى",
              "category": "isim (ال takılı)"
            },
            {
              "text": "وَلَكِنْ",
              "root": "لكن",
              "category": "atıf harfi + bağlaç"
            },
            {
              "text": "تَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "التَّكْنولوجيا.",
              "root": "تكنولوجيا",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Arkadaşım",
            "Meryem",
            "seviyor",
            "müziği",
            "ama",
            "seçiyor.",
            "kulübünü",
            "teknoloji"
          ],
          "turkishFull": "Arkadaşım Meryem müziği seviyor ama teknoloji kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "مَنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "يَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "النَّظافَة؟",
              "root": "نظافة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "kim",
            "seçiyor?",
            "kulübünü",
            "Temizlik"
          ],
          "turkishFull": "Temizlik kulübünü kim seçiyor?",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "النَّظافَة،",
              "root": "نظافة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "وَأَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "مَسْؤولَة",
              "root": "مسؤول",
              "category": "isim (sıfat · dişil)"
            },
            {
              "text": "عَنْ",
              "root": "عن",
              "category": "harf-i cer"
            },
            {
              "text": "نَظافَة",
              "root": "نظافة",
              "category": "isim"
            },
            {
              "text": "الصَّفّ.",
              "root": "صف",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "seçiyorum,",
            "kulübünü",
            "temizlik",
            "ben",
            "sorumluyum.",
            "temizliğinden",
            "sınıfın",
            "—"
          ],
          "turkishFull": "Ben temizlik kulübünü seçiyorum, ben sınıfın temizliğinden sorumluyum.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "لِماذا",
              "root": "لماذا",
              "category": "soru edatı"
            },
            {
              "text": "تَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الرِّياضَة؟",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Neden",
            "seçiyorsun?",
            "kulübünü",
            "spor"
          ],
          "turkishFull": "Neden spor kulübünü seçiyorsun?",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "لِأَنَّني",
              "root": "لأنني",
              "category": "bağlaç + bitişik zamir (ben)"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "كُرَة",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "القَدَم،",
              "root": "قدم",
              "category": "isim (ال takılı)"
            },
            {
              "text": "وَأَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "مَسْؤول",
              "root": "مسؤول",
              "category": "isim"
            },
            {
              "text": "عَنْ",
              "root": "عن",
              "category": "harf-i cer"
            },
            {
              "text": "الأَدَوات",
              "root": "أداة",
              "category": "isim (dişil çoğul · ال takılı)"
            },
            {
              "text": "الرِّياضِيَّة.",
              "root": "رياضية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Çünkü",
            "seviyorum,",
            "futbolu",
            "ben",
            "sorumluyum.",
            "aletlerinden",
            "spor",
            "—",
            "—"
          ],
          "turkishFull": "Çünkü futbolu seviyorum, ben spor aletlerinden sorumluyum.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَسْتَيْقِظُ",
              "root": "استيقظ",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "مُبَكِّرًا",
              "root": "مبكرا",
              "category": "zarf"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "الصَّباح.",
              "root": "صباح",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "kalkarım.",
            "erken",
            "Sabah",
            "—"
          ],
          "turkishFull": "Sabah erken kalkarım.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أُحافِظُ",
              "root": "حافظ",
              "category": "soru edatı + fiil (mazi · mezid)"
            },
            {
              "text": "عَلى",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "نَظافَة",
              "root": "نظافة",
              "category": "isim"
            },
            {
              "text": "مَدْرَسَتي.",
              "root": "مدرسة",
              "category": "isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "korurum.",
            "temizliğini",
            "Okulumun",
            "—"
          ],
          "turkishFull": "Okulumun temizliğini korurum.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أُحافِظُ",
              "root": "حافظ",
              "category": "soru edatı + fiil (mazi · mezid)"
            },
            {
              "text": "عَلى",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "تَرْتيب",
              "root": "ترتيب",
              "category": "isim"
            },
            {
              "text": "غُرْفَتي.",
              "root": "غرفة",
              "category": "isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "korurum.",
            "düzenini",
            "Odamın",
            "—"
          ],
          "turkishFull": "Odamın düzenini korurum.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُساعِدُ",
              "root": "ساعد",
              "category": "soru edatı + fiil (mazi · mezid)"
            },
            {
              "text": "أُمِّي",
              "root": "أم",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "وَأَبي",
              "root": "أب",
              "category": "atıf harfi + isim + bitişik zamir (ben)"
            },
            {
              "text": "دائِمًا.",
              "root": "دائما",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Ben",
            "yardım ederim.",
            "annemle",
            "babama",
            "her zaman"
          ],
          "turkishFull": "Ben annemle babama her zaman yardım ederim.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "زَيْنَب",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "الرِّياضَة،",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "وَلَكِنْ",
              "root": "لكن",
              "category": "atıf harfi + bağlaç"
            },
            {
              "text": "تُفَضِّلُ",
              "root": "تفضل",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الموسيقى.",
              "root": "موسيقى",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Zeynep",
            "seviyor",
            "sporu",
            "ama",
            "tercih ediyor.",
            "kulübünü",
            "müzik"
          ],
          "turkishFull": "Zeynep sporu seviyor ama müzik kulübünü tercih ediyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "مَنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "يَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "التَّكْنولوجيا؟",
              "root": "تكنولوجيا",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "kim",
            "seçiyor?",
            "kulübünü",
            "Teknoloji"
          ],
          "turkishFull": "Teknoloji kulübünü kim seçiyor?",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "عُمَر",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "يَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "التَّكْنولوجيا.",
              "root": "تكنولوجيا",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ömer",
            "seçiyor.",
            "kulübünü",
            "teknoloji"
          ],
          "turkishFull": "Ömer teknoloji kulübünü seçiyor.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "هَلْ",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "الرِّياضَة؟",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "musun?",
            "seviyor",
            "Sporu"
          ],
          "turkishFull": "Sporu seviyor musun?",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "نَعَم،",
              "root": "نعم",
              "category": "cevap harfi"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الرِّياضَة.",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Evet,",
            "severim.",
            "sporu"
          ],
          "turkishFull": "Evet, sporu severim.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "مَتى",
              "root": "متى",
              "category": "soru edatı"
            },
            {
              "text": "سَنَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · istikbal · mezid)"
            },
            {
              "text": "الأَنْدِيَة؟",
              "root": "نادي",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "ne zaman",
            "seçeceğiz?",
            "Kulüpleri"
          ],
          "turkishFull": "Kulüpleri ne zaman seçeceğiz?",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَخْتارُ",
              "root": "اختار",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "الرَّسْم",
              "root": "رسم",
              "category": "isim (ال takılı)"
            },
            {
              "text": "أَوْ",
              "root": "أو",
              "category": "bağlaç"
            },
            {
              "text": "نادي",
              "root": "نادي",
              "category": "isim"
            },
            {
              "text": "المَكْتَبَة.",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "seçerim",
            "kulübünü",
            "Resim",
            "ya da",
            "kulübünü.",
            "kütüphane"
          ],
          "turkishFull": "Resim kulübünü seçerim ya da kütüphane kulübünü.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الشَّطْرَنْج",
              "root": "شطرنج",
              "category": "isim (ال takılı)"
            },
            {
              "text": "وَكُرَة",
              "root": "كرة",
              "category": "atıf harfi + isim"
            },
            {
              "text": "السَّلَّة.",
              "root": "سلة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "severim",
            "Satrancı",
            "ve basketbolu.",
            "—"
          ],
          "turkishFull": "Satrancı severim ve basketbolu.",
          "ders": "8_1_1"
        },
        {
          "arabic": [
            {
              "text": "أَتَمَنّى",
              "root": "تمنى",
              "category": "soru edatı + fiil (mazi · mezid)"
            },
            {
              "text": "لَكِ",
              "root": "لك",
              "category": "edat + bitişik zamir (sen)"
            },
            {
              "text": "التَّوْفيق.",
              "root": "توفيق",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "dilerim.",
            "Sana",
            "başarılar"
          ],
          "turkishFull": "Sana başarılar dilerim.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "وأَعْمَلُ",
              "root": "أعمل",
              "category": "atıf harfi + fiil (mazi · mezid)"
            },
            {
              "text": "على",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "دَوْري.",
              "root": "دور",
              "category": "isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "çalışırım.",
            "Ve rolüm üzerinde",
            "—"
          ],
          "turkishFull": "Ve rolüm üzerinde çalışırım.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "وأَصْدِقائي",
              "root": "صديق",
              "category": "atıf harfi + isim (kırık çoğul) + bitişik zamir (ben)"
            },
            {
              "text": "نُجَهِّزُ",
              "root": "جهز",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الدّيكور",
              "root": "ديكور",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِلْمَشْهَد.",
              "root": "مشهد",
              "category": "harf-i cer + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben ve arkadaşlarım",
            "hazırlarız.",
            "dekoru",
            "sahne için",
            "—"
          ],
          "turkishFull": "Ben ve arkadaşlarım sahne için dekoru hazırlarız.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "نُريدُ",
              "root": "أراد",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "أَنْ",
              "root": "أن",
              "category": "masdar harfi"
            },
            {
              "text": "نُقَدِّمَ",
              "root": "قدم",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "مَسْرَحِيَّة",
              "root": "مسرحية",
              "category": "isim (dişil)"
            },
            {
              "text": "جَيِّدَة.",
              "root": "جيد",
              "category": "isim (sıfat · dişil)"
            }
          ],
          "turkish": [
            "istiyoruz.",
            "sunmak",
            "Güzel bir tiyatro oyunu",
            "—",
            "—"
          ],
          "turkishFull": "Güzel bir tiyatro oyunu sunmak istiyoruz.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "هُوَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "يُؤَدّي",
              "root": "أدى",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "دَوْرَهُ.",
              "root": "دور",
              "category": "isim + bitişik zamir (o)"
            }
          ],
          "turkish": [
            "O (erkek)",
            "oynuyor.",
            "rolünü"
          ],
          "turkishFull": "O (erkek) rolünü oynuyor.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "هِيَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "تُجَهِّزُ",
              "root": "تجهز",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الدّيكور",
              "root": "ديكور",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِلْمَشْهَد.",
              "root": "مشهد",
              "category": "harf-i cer + isim (ال takılı)"
            }
          ],
          "turkish": [
            "O (kız)",
            "hazırlıyor.",
            "dekoru",
            "sahne için"
          ],
          "turkishFull": "O (kız) sahne için dekoru hazırlıyor.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "أنتِ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "تَقومينَ",
              "root": "قام",
              "category": "fiil (muzari · ecvef · muhatap · dişil)"
            },
            {
              "text": "بِالتَّدْريب.",
              "root": "تدريب",
              "category": "harf-i cer + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sen (kız)",
            "yapıyorsun.",
            "prova"
          ],
          "turkishFull": "Sen (kız) prova yapıyorsun.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "نُجَهِّزُ",
              "root": "جهز",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الدّيكور",
              "root": "ديكور",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِلْمَشْهَد.",
              "root": "مشهد",
              "category": "harf-i cer + isim (ال takılı)"
            }
          ],
          "turkish": [
            "hazırlarız.",
            "dekoru",
            "Sahne için"
          ],
          "turkishFull": "Sahne için dekoru hazırlarız.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "جَهِّزْ",
              "root": "جهز",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "مُلْصَقًا",
              "root": "ملصق",
              "category": "isim"
            },
            {
              "text": "عَنْ",
              "root": "عن",
              "category": "harf-i cer"
            },
            {
              "text": "مَسْرَحِيَّة.",
              "root": "مسرحية",
              "category": "isim (dişil)"
            }
          ],
          "turkish": [
            "hazırla.",
            "bir afiş",
            "Bir tiyatro oyunu hakkında",
            "—"
          ],
          "turkishFull": "Bir tiyatro oyunu hakkında bir afiş hazırla.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "جَهَّزَتِ",
              "root": "جهز",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الدّيكور",
              "root": "ديكور",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مَعَ",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "صَديقَتِها.",
              "root": "صديقة",
              "category": "isim (dişil) + bitişik zamir (o · dişil)"
            }
          ],
          "turkish": [
            "hazırladı.",
            "dekoru",
            "Arkadaşıyla",
            "—"
          ],
          "turkishFull": "Arkadaşıyla dekoru hazırladı.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "أَخيرًا",
              "root": "أخيرا",
              "category": "zarf"
            },
            {
              "text": "جَهَّزَتْ",
              "root": "جهز",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "مُلْصَقًا",
              "root": "ملصق",
              "category": "isim"
            },
            {
              "text": "مَعَ",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "صَديقَتِها.",
              "root": "صديقة",
              "category": "isim (dişil) + bitişik zamir (o · dişil)"
            }
          ],
          "turkish": [
            "Sonunda",
            "hazırladı.",
            "bir afiş",
            "arkadaşıyla",
            "—"
          ],
          "turkishFull": "Sonunda arkadaşıyla bir afiş hazırladı.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "جُحا!",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "أنتَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "تَعْرِفُ",
              "root": "تعرف",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "كُلَّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "شَيْءٍ،",
              "root": "شيء",
              "category": "isim"
            },
            {
              "text": "أَلَيْسَ",
              "root": "ليس",
              "category": "soru edatı + nakıs fiil"
            },
            {
              "text": "كَذَلِكَ؟",
              "root": "SKIP",
              "category": "işaret ismi"
            }
          ],
          "turkish": [
            "Ey Cuha!",
            "Sen",
            "biliyorsun,",
            "her şeyi",
            "öyle değil mi?",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ey Cuha! Sen her şeyi biliyorsun, öyle değil mi?",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "مَرْكَزُ",
              "root": "مركز",
              "category": "isim"
            },
            {
              "text": "الأَرْضِ",
              "root": "أرض",
              "category": "isim (ال takılı)"
            },
            {
              "text": "تَحْتَ",
              "root": "تحت",
              "category": "zarf"
            },
            {
              "text": "قَدَمي!",
              "root": "قدم",
              "category": "fiil (mazi · mezid) + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "Dünyanın merkezi",
            "ayağımın altında!",
            "—",
            "—"
          ],
          "turkishFull": "Dünyanın merkezi ayağımın altında!",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "تَحْتَ",
              "root": "تحت",
              "category": "zarf"
            },
            {
              "text": "قَدَمِكَ،",
              "root": "قدم",
              "category": "fiil (mazi · mezid) + bitişik zamir (sen)"
            },
            {
              "text": "ماذا",
              "root": "ماذا",
              "category": "soru edatı"
            },
            {
              "text": "تَقولُ",
              "root": "قال",
              "category": "fiil (muzari)"
            },
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "جُحا!",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "Ayağının altında mı?",
            "Ne",
            "diyorsun",
            "ey Cuha!",
            "—",
            "—"
          ],
          "turkishFull": "Ayağının altında mı? Ne diyorsun ey Cuha!",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "إِذا",
              "root": "إذا",
              "category": "edat"
            },
            {
              "text": "كُنْتَ",
              "root": "كان",
              "category": "fiil (mazi · ecvef · mütekellim)"
            },
            {
              "text": "لا",
              "root": "لا",
              "category": "edat"
            },
            {
              "text": "تُصَدِّقُني،",
              "root": "صدق",
              "category": "fiil (muzari · mezid · muhatap) + bitişik zamir (ben)"
            },
            {
              "text": "قِسْ!",
              "root": "قاس",
              "category": "fiil (emir)"
            }
          ],
          "turkish": [
            "Bana inanmıyorsan,",
            "ölç!",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Bana inanmıyorsan, ölç!",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "تَسْتَيْقِظُ",
              "root": "استيقظ",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "السّادِسَة",
              "root": "سادسة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "إِلّا",
              "root": "إلا",
              "category": "istisna edatı"
            },
            {
              "text": "رُبْعًا.",
              "root": "ربعا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "uyanıyor.",
            "Altıya çeyrek kala",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Altıya çeyrek kala uyanıyor.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "تُصَلّي",
              "root": "صلى",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "صَلاة",
              "root": "صلاة",
              "category": "isim"
            },
            {
              "text": "الفَجْر",
              "root": "فجر",
              "category": "zarf (zaman)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "السّادِسَة.",
              "root": "سادسة",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "kılıyor.",
            "sabah namazını",
            "Saat altıda",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Saat altıda sabah namazını kılıyor.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "تَتَناوَلُ",
              "root": "تناول",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الفَطور",
              "root": "فطور",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "السّابِعَة",
              "root": "سابعة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "والرُّبْع.",
              "root": "ربع",
              "category": "atıf harfi + isim (ال takılı)"
            }
          ],
          "turkish": [
            "yapıyor.",
            "kahvaltısını",
            "Yediyi çeyrek geçe",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Yediyi çeyrek geçe kahvaltısını yapıyor.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "أَحْمَد",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "سَيُجَهِّزُ",
              "root": "جهز",
              "category": "fiil (muzari · istikbal · mezid)"
            },
            {
              "text": "مُلْصَقًا",
              "root": "ملصق",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "السّاعَة",
              "root": "ساعة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الخامِسَة",
              "root": "خامسة",
              "category": "isim (ال takılı · dişil)"
            },
            {
              "text": "إِلّا",
              "root": "إلا",
              "category": "istisna edatı"
            },
            {
              "text": "رُبْعًا.",
              "root": "ربعا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Ahmet",
            "hazırlayacak.",
            "bir afiş",
            "beşe çeyrek kala",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ahmet beşe çeyrek kala bir afiş hazırlayacak.",
          "ders": "8_1_2"
        },
        {
          "arabic": [
            {
              "text": "أَهْلًا،",
              "root": "أهلا",
              "category": "zarf"
            },
            {
              "text": "يوجَدُ",
              "root": "أوجد",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "هُنا",
              "root": "هنا",
              "category": "zarf"
            },
            {
              "text": "الكَثير",
              "root": "كثير",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مِن",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "الأماكِن",
              "root": "مكان",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "السِّياحِيَّة.",
              "root": "سياحة",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Hoş geldin,",
            "var.",
            "burada",
            "çok",
            "turistik yerlerden",
            "—",
            "—"
          ],
          "turkishFull": "Hoş geldin, burada turistik yerlerden çok var.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "اُعْبُرِ",
              "root": "عبر",
              "category": "fiil (emir)"
            },
            {
              "text": "الطَّريق،",
              "root": "طريق",
              "category": "isim (ال takılı)"
            },
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "اِتَّجِهْ",
              "root": "اتجه",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "نَحْوَ",
              "root": "نحو",
              "category": "isim"
            },
            {
              "text": "اليَمين،",
              "root": "يمين",
              "category": "zarf (yön)"
            },
            {
              "text": "سَتَجِدُها",
              "root": "وجد",
              "category": "fiil (muzari · istikbal · misal · muhatap) + bitişik zamir (o · dişil)"
            },
            {
              "text": "أمامَكَ.",
              "root": "أمام",
              "category": "zarf + bitişik zamir (sen)"
            }
          ],
          "turkish": [
            "Yolu geç,",
            "sonra",
            "sağa dön,",
            "bulacaksın.",
            "onu karşında",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Yolu geç, sonra sağa dön, onu karşında bulacaksın.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "مُتْحَف",
              "root": "متحف",
              "category": "isim"
            },
            {
              "text": "مَوْلانا",
              "root": "مولانا",
              "category": "isim"
            },
            {
              "text": "لا",
              "root": "لا",
              "category": "edat"
            },
            {
              "text": "يوجَدُ",
              "root": "أوجد",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "إِسْطَنْبول.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "Mevlânâ Müzesi",
            "bulunmaz.",
            "İstanbul'da",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Mevlânâ Müzesi İstanbul'da bulunmaz.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "اِتَّجِهْ",
              "root": "اتجه",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "نَحْوَ",
              "root": "نحو",
              "category": "isim"
            },
            {
              "text": "اليَمين.",
              "root": "يمين",
              "category": "zarf (yön)"
            }
          ],
          "turkish": [
            "dön.",
            "Sağa",
            "—"
          ],
          "turkishFull": "Sağa dön.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "اِتَّجِهْ",
              "root": "اتجه",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "نَحْوَ",
              "root": "نحو",
              "category": "isim"
            },
            {
              "text": "اليَسار.",
              "root": "يسار",
              "category": "zarf (yön)"
            }
          ],
          "turkish": [
            "dön.",
            "Sola",
            "—"
          ],
          "turkishFull": "Sola dön.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "اِتَّجِهْ",
              "root": "اتجه",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "نَحْوَ",
              "root": "نحو",
              "category": "isim"
            },
            {
              "text": "اليَمين",
              "root": "يمين",
              "category": "zarf (yön)"
            },
            {
              "text": "مِنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "الطَّريق",
              "root": "طريق",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الأَوَّل.",
              "root": "أول",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sonra",
            "dön.",
            "sağa",
            "birinci yoldan",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Sonra birinci yoldan sağa dön.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "سَتَجِدُ",
              "root": "وجد",
              "category": "fiil (muzari · istikbal · misal · muhatap)"
            },
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "أمامَكَ.",
              "root": "أمام",
              "category": "zarf + bitişik zamir (sen)"
            }
          ],
          "turkish": [
            "bulacaksın.",
            "Okulu",
            "karşında"
          ],
          "turkishFull": "Okulu karşında bulacaksın.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "اِذْهَبْ",
              "root": "ذهب",
              "category": "fiil (emir)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "الأَمام،",
              "root": "أمام",
              "category": "zarf"
            },
            {
              "text": "واتَّجِهْ",
              "root": "اتجه",
              "category": "atıf harfi + fiil (mazi · mezid)"
            },
            {
              "text": "نَحْوَ",
              "root": "نحو",
              "category": "isim"
            },
            {
              "text": "يَسارِكَ،",
              "root": "يسار",
              "category": "zarf (yön) + bitişik zamir (sen)"
            },
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "اِتَّجِهْ",
              "root": "اتجه",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "نَحْوَ",
              "root": "نحو",
              "category": "isim"
            },
            {
              "text": "اليَمين،",
              "root": "يمين",
              "category": "zarf (yön)"
            },
            {
              "text": "سَتَجِدُهُ",
              "root": "وجد",
              "category": "fiil (muzari · istikbal · misal · muhatap) + bitişik zamir (o)"
            },
            {
              "text": "أمامَكَ.",
              "root": "أمام",
              "category": "zarf + bitişik zamir (sen)"
            }
          ],
          "turkish": [
            "İleri git,",
            "soluna dön,",
            "sonra",
            "sağa dön,",
            "onu karşında bulacaksın.",
            "—",
            "—",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "İleri git, soluna dön, sonra sağa dön, onu karşında bulacaksın.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "تَقَعُ",
              "root": "وقع",
              "category": "fiil (muzari · misal · dişil)"
            },
            {
              "text": "مَدينَة",
              "root": "مدينة",
              "category": "isim"
            },
            {
              "text": "سينوب",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "شَمال",
              "root": "شمال",
              "category": "isim"
            },
            {
              "text": "تُرْكِيا.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "yer alır.",
            "Sinop şehri",
            "Türkiye'nin kuzeyinde",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Sinop şehri Türkiye'nin kuzeyinde yer alır.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "تَقَعُ",
              "root": "وقع",
              "category": "fiil (muzari · misal · dişil)"
            },
            {
              "text": "مَدينَة",
              "root": "مدينة",
              "category": "isim"
            },
            {
              "text": "أَغْري",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "شَرْق",
              "root": "شرق",
              "category": "fiil (mazi)"
            },
            {
              "text": "تُرْكِيا.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "yer alır.",
            "Ağrı şehri",
            "Türkiye'nin doğusunda",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ağrı şehri Türkiye'nin doğusunda yer alır.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "تَقَعُ",
              "root": "وقع",
              "category": "fiil (muzari · misal · dişil)"
            },
            {
              "text": "مَدينَة",
              "root": "مدينة",
              "category": "isim"
            },
            {
              "text": "أَنْطالْيا",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "جَنوب",
              "root": "جنوب",
              "category": "isim"
            },
            {
              "text": "تُرْكِيا.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "yer alır.",
            "Antalya şehri",
            "Türkiye'nin güneyinde",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Antalya şehri Türkiye'nin güneyinde yer alır.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "تَقَعُ",
              "root": "وقع",
              "category": "fiil (muzari · misal · dişil)"
            },
            {
              "text": "مَدينَة",
              "root": "مدينة",
              "category": "isim"
            },
            {
              "text": "إِزْمير",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "غَرْب",
              "root": "غرب",
              "category": "fiil (mazi)"
            },
            {
              "text": "تُرْكِيا.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "yer alır.",
            "İzmir şehri",
            "Türkiye'nin batısında",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "İzmir şehri Türkiye'nin batısında yer alır.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "تَقَعُ",
              "root": "وقع",
              "category": "fiil (muzari · misal · dişil)"
            },
            {
              "text": "مَدينَة",
              "root": "مدينة",
              "category": "isim"
            },
            {
              "text": "أَنْقَرَة",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "وَسَط",
              "root": "وسط",
              "category": "isim"
            },
            {
              "text": "الأَناضول.",
              "root": "أناضول",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "yer alır.",
            "Ankara şehri",
            "Anadolu'nun ortasında",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ankara şehri Anadolu'nun ortasında yer alır.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "أَيْن",
              "root": "أين",
              "category": "soru edatı"
            },
            {
              "text": "تَقَعُ",
              "root": "وقع",
              "category": "fiil (muzari · misal · dişil)"
            },
            {
              "text": "هذه",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "المَدينَة",
              "root": "مدينة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "تُرْكِيا؟",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "nerede",
            "yer alır?",
            "Bu şehir",
            "Türkiye'de",
            "—",
            "—"
          ],
          "turkishFull": "Bu şehir Türkiye'de nerede yer alır?",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "أُسافِرُ",
              "root": "سافر",
              "category": "soru edatı + fiil (mazi · mezid)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "مَدينَة",
              "root": "مدينة",
              "category": "isim"
            },
            {
              "text": "مُخْتَلِفَة",
              "root": "مختلف",
              "category": "isim (ism-i fâil · mezid · dişil)"
            },
            {
              "text": "كُلَّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "عام.",
              "root": "عام",
              "category": "isim"
            }
          ],
          "turkish": [
            "seyahat ederim.",
            "farklı bir şehre",
            "Her yıl",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Her yıl farklı bir şehre seyahat ederim.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "لا",
              "root": "لا",
              "category": "edat"
            },
            {
              "text": "أَسْتَيْقِظُ",
              "root": "استيقظ",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "مُتَأَخِّرًا",
              "root": "متأخر",
              "category": "isim"
            },
            {
              "text": "أَبَدًا.",
              "root": "أبدا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "uyanmam.",
            "geç",
            "Asla",
            "—"
          ],
          "turkishFull": "Asla geç uyanmam.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "أَلْتَقِطُ",
              "root": "تقط",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "صُوَرًا",
              "root": "صورا",
              "category": "zarf"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "كُلِّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "رِحْلَة",
              "root": "رحلة",
              "category": "isim"
            },
            {
              "text": "دائِمًا.",
              "root": "دائما",
              "category": "zarf"
            }
          ],
          "turkish": [
            "çekerim.",
            "fotoğraf",
            "Her gezide",
            "hep",
            "—",
            "—"
          ],
          "turkishFull": "Her gezide hep fotoğraf çekerim.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "ماذا",
              "root": "ماذا",
              "category": "soru edatı"
            },
            {
              "text": "تَحْتاجُ؟",
              "root": "احتاج",
              "category": "fiil (muzari · mezid)"
            }
          ],
          "turkish": [
            "Neye",
            "ihtiyacın var?",
            "—"
          ],
          "turkishFull": "Neye ihtiyacın var?",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "أَحْتاجُ",
              "root": "احتاج",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "حَقيبَة",
              "root": "حقيبة",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "رِحْلَتي.",
              "root": "رحلة",
              "category": "isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "ihtiyacım var.",
            "bir çantaya",
            "Gezimde",
            "—",
            "—"
          ],
          "turkishFull": "Gezimde bir çantaya ihtiyacım var.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "سافَرْتُ",
              "root": "سافر",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "إِسْطَنْبول",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "قَبْلَ",
              "root": "قبل",
              "category": "fiil (mazi)"
            },
            {
              "text": "يَوْمَيْن.",
              "root": "يوم",
              "category": "isim (düzenli çoğul)"
            }
          ],
          "turkish": [
            "seyahat ettim.",
            "İstanbul'a",
            "İki gün önce",
            "—",
            "—"
          ],
          "turkishFull": "İki gün önce İstanbul'a seyahat ettim.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "وزُرْتُ",
              "root": "زار",
              "category": "atıf harfi + fiil (mazi · ecvef · mütekellim)"
            },
            {
              "text": "مُتْحَف",
              "root": "متحف",
              "category": "isim"
            },
            {
              "text": "طوب",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "قابي",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "الصَّباح.",
              "root": "صباح",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "ziyaret ettim.",
            "Topkapı Müzesi'ni",
            "Sabah",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Sabah Topkapı Müzesi'ni ziyaret ettim.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "صَلَّيْتُ",
              "root": "صلى",
              "category": "fiil (mazi · nakıs · mütekellim)"
            },
            {
              "text": "صَلاة",
              "root": "صلاة",
              "category": "isim"
            },
            {
              "text": "الظُّهْر",
              "root": "ظهر",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "مَسْجِد",
              "root": "مسجد",
              "category": "isim"
            },
            {
              "text": "آيا",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "صوفْيا",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "الكَبير.",
              "root": "كبير",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sonra",
            "kıldım.",
            "öğle namazını",
            "büyük Ayasofya Camii'nde",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Sonra büyük Ayasofya Camii'nde öğle namazını kıldım.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "بَعْدَ",
              "root": "بعد",
              "category": "fiil (mazi)"
            },
            {
              "text": "صَلاة",
              "root": "صلاة",
              "category": "isim"
            },
            {
              "text": "الظُّهْرِ،",
              "root": "ظهر",
              "category": "isim (ال takılı)"
            },
            {
              "text": "زُرْتُ",
              "root": "زار",
              "category": "fiil (mazi · ecvef · mütekellim)"
            },
            {
              "text": "حَديقَة",
              "root": "حديقة",
              "category": "isim"
            },
            {
              "text": "كُلْخانَة.",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            }
          ],
          "turkish": [
            "Öğle namazından sonra",
            "ziyaret ettim.",
            "Gülhane Parkı'nı",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Öğle namazından sonra Gülhane Parkı'nı ziyaret ettim.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "صَلَّيْتُ",
              "root": "صلى",
              "category": "fiil (mazi · nakıs · mütekellim)"
            },
            {
              "text": "صَلاة",
              "root": "صلاة",
              "category": "isim"
            },
            {
              "text": "العَصْر",
              "root": "عصر",
              "category": "zarf (zaman)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "مَسْجِد",
              "root": "مسجد",
              "category": "isim"
            },
            {
              "text": "السُّلْطان",
              "root": "سلطان",
              "category": "isim (ال takılı)"
            },
            {
              "text": "أَحْمَد.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "kıldım.",
            "İkindi namazını",
            "Sultanahmet Camii'nde",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "İkindi namazını Sultanahmet Camii'nde kıldım.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "تَقَعُ",
              "root": "وقع",
              "category": "fiil (muzari · misal · dişil)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "جَنوب",
              "root": "جنوب",
              "category": "isim"
            },
            {
              "text": "تُرْكِيا.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "yer alır.",
            "Türkiye'nin güneyinde",
            "—",
            "—"
          ],
          "turkishFull": "Türkiye'nin güneyinde yer alır.",
          "ders": "8_1_3"
        },
        {
          "arabic": [
            {
              "text": "نَعَم،",
              "root": "نعم",
              "category": "cevap harfi"
            },
            {
              "text": "لِأَنَّني",
              "root": "لأنني",
              "category": "bağlaç + bitişik zamir (ben)"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "القِراءَة.",
              "root": "قراءة",
              "category": "isim (mastar · ال takılı)"
            }
          ],
          "turkish": [
            "Evet,",
            "çünkü",
            "seviyorum.",
            "okumayı"
          ],
          "turkishFull": "Evet, çünkü okumayı seviyorum.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "وماذا",
              "root": "ماذا",
              "category": "atıf harfi + soru edatı"
            },
            {
              "text": "تَقْرَئينَ",
              "root": "قرأ",
              "category": "fiil (muzari · mehmuz · muhatap · dişil)"
            },
            {
              "text": "وأنتِ؟",
              "root": "SKIP",
              "category": "zamir"
            }
          ],
          "turkish": [
            "ne",
            "okuyorsun?",
            "Ya sen"
          ],
          "turkishFull": "Ya sen ne okuyorsun?",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "\"قِصَّة",
              "root": "قصة",
              "category": "isim"
            },
            {
              "text": "أَلْف",
              "root": "ألف",
              "category": "fiil (mazi)"
            },
            {
              "text": "لَيْلَة",
              "root": "ليلة",
              "category": "isim (dişil)"
            },
            {
              "text": "ولَيْلَة\".",
              "root": "ليلة",
              "category": "atıf harfi + isim (dişil)"
            }
          ],
          "turkish": [
            "severim.",
            "«Binbir Gece Masalı»nı",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "«Binbir Gece Masalı»nı severim.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "هي",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "قِراءَة",
              "root": "قراءة",
              "category": "isim (mastar)"
            },
            {
              "text": "نُكْتَة",
              "root": "نكتة",
              "category": "isim"
            },
            {
              "text": "جُحا.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "O (kız)",
            "sever.",
            "okumayı",
            "Cuha fıkrası",
            "—"
          ],
          "turkishFull": "O (kız) Cuha fıkrası okumayı sever.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "هو",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "يُرَتِّبُ",
              "root": "رتب",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الكُتُب،",
              "root": "كتاب",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "O",
            "düzenler,",
            "kitapları"
          ],
          "turkishFull": "O kitapları düzenler,",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "سَأَلَ",
              "root": "سأل",
              "category": "fiil (mazi)"
            },
            {
              "text": "الرَّجُلُ",
              "root": "رجل",
              "category": "isim (ال takılı)"
            },
            {
              "text": "جُحا",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "عَنْ",
              "root": "عن",
              "category": "harf-i cer"
            },
            {
              "text": "عُمْرِه",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "فَأَجابَهُ",
              "root": "أجاب",
              "category": "atıf harfi + fiil (mazi · mezid) + bitişik zamir (o)"
            },
            {
              "text": "\"أَرْبَعون\".",
              "root": "أربعون",
              "category": "isim"
            }
          ],
          "turkish": [
            "sordu,",
            "Adam",
            "Cuha'ya",
            "yaşını",
            "o da «kırk» diye cevap verdi.",
            "—",
            "—"
          ],
          "turkishFull": "Adam Cuha'ya yaşını sordu, o da «kırk» diye cevap verdi.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُريدُ",
              "root": "أراد",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "مِنْك",
              "root": "منك",
              "category": "edat + bitişik zamir (sen)"
            },
            {
              "text": "هذا",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "المِصْباح.",
              "root": "مصباح",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "istiyorum.",
            "Senden",
            "bu lambayı",
            "—",
            "—"
          ],
          "turkishFull": "Senden bu lambayı istiyorum.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "\"قِصَّة",
              "root": "قصة",
              "category": "isim"
            },
            {
              "text": "أَلْف",
              "root": "ألف",
              "category": "fiil (mazi)"
            },
            {
              "text": "لَيْلَة",
              "root": "ليلة",
              "category": "isim (dişil)"
            },
            {
              "text": "ولَيْلَة\"،",
              "root": "ليلة",
              "category": "atıf harfi + isim (dişil)"
            },
            {
              "text": "قِصَّة",
              "root": "قصة",
              "category": "isim"
            },
            {
              "text": "مُهِمَّة",
              "root": "مهم",
              "category": "isim (sıfat · dişil)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "الأَدَب",
              "root": "أدب",
              "category": "isim (ال takılı)"
            },
            {
              "text": "العَرَبِيّ",
              "root": "عربي",
              "category": "isim (sıfat · ال takılı)"
            },
            {
              "text": "ولا",
              "root": "لا",
              "category": "atıf harfi + edat"
            },
            {
              "text": "يُعْرَفُ",
              "root": "عرف",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "كاتِبُها.",
              "root": "كاتب",
              "category": "isim + bitişik zamir (o · dişil)"
            }
          ],
          "turkish": [
            "«Binbir Gece Masalı»,",
            "önemli bir hikâyedir",
            "Arap edebiyatında",
            "ve yazarı bilinmez.",
            "—",
            "—",
            "—",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "«Binbir Gece Masalı», Arap edebiyatında önemli bir hikâyedir ve yazarı bilinmez.",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "لَكِنَّ",
              "root": "لكن",
              "category": "bağlaç"
            },
            {
              "text": "جُحا",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "لا",
              "root": "لا",
              "category": "edat"
            },
            {
              "text": "يُريدُ",
              "root": "أراد",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "أَنْ",
              "root": "أن",
              "category": "masdar harfi"
            },
            {
              "text": "يُعْطِيَهُ",
              "root": "أعطى",
              "category": "fiil (muzari · mezid) + bitişik zamir (o)"
            },
            {
              "text": "الحِمار",
              "root": "حمار",
              "category": "isim (ال takılı)"
            },
            {
              "text": "فَيَقولُ",
              "root": "قال",
              "category": "atıf harfi + fiil (muzari)"
            },
            {
              "text": "لَهُ:",
              "root": "له",
              "category": "edat + bitişik zamir (o)"
            }
          ],
          "turkish": [
            "Ama Cuha",
            "istemez",
            "eşeği vermek",
            "ve ona der ki:",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ama Cuha eşeği vermek istemez ve ona der ki:",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "وفي",
              "root": "في",
              "category": "atıf harfi + harf-i cer"
            },
            {
              "text": "تِلْك",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "اللَّحْظَة،",
              "root": "لحظة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "يَسْمَعُ",
              "root": "سمع",
              "category": "fiil (muzari)"
            },
            {
              "text": "الجارُ",
              "root": "جار",
              "category": "isim (ال takılı)"
            },
            {
              "text": "صَوْت",
              "root": "صوت",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الحِمار،",
              "root": "حمار",
              "category": "isim (ال takılı)"
            },
            {
              "text": "ويَقولُ",
              "root": "قال",
              "category": "atıf harfi + fiil (muzari)"
            },
            {
              "text": "لَهُ:",
              "root": "له",
              "category": "edat + bitişik zamir (o)"
            }
          ],
          "turkish": [
            "O anda",
            "duyar",
            "komşu",
            "eşeğin sesini",
            "ve ona der ki:",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "O anda komşu eşeğin sesini duyar ve ona der ki:",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "جاري،",
              "root": "جار",
              "category": "fiil (mazi) + bitişik zamir (ben)"
            },
            {
              "text": "هل",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "تُصَدِّقُ",
              "root": "صدق",
              "category": "fiil (muzari)"
            },
            {
              "text": "الحِمار",
              "root": "حمار",
              "category": "isim (ال takılı)"
            },
            {
              "text": "ولا",
              "root": "لا",
              "category": "atıf harfi + edat"
            },
            {
              "text": "تُصَدِّقُني!",
              "root": "صدق",
              "category": "fiil (muzari · mezid · muhatap) + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "Ey komşum,",
            "eşeğe inanıyorsun da",
            "bana inanmıyor musun!",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ey komşum, eşeğe inanıyorsun da bana inanmıyor musun!",
          "ders": "8_2_1"
        },
        {
          "arabic": [
            {
              "text": "تَفَضَّلْ،",
              "root": "تفضل",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "اُنْظُرْ",
              "root": "نظر",
              "category": "fiil (emir)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "هذا",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "القِسْم؟",
              "root": "قسم",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Buyurun,",
            "bakın.",
            "şu bölüme",
            "—",
            "—"
          ],
          "turkishFull": "Buyurun, şu bölüme bakın.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "هو",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "لا",
              "root": "لا",
              "category": "edat"
            },
            {
              "text": "يُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الكُتُب",
              "root": "كتاب",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "الدّينِيَّة.",
              "root": "دينية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "O",
            "sevmiyor.",
            "dinî kitapları",
            "—",
            "—"
          ],
          "turkishFull": "O dinî kitapları sevmiyor.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الكُتُب",
              "root": "كتاب",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "الدّينِيَّة.",
              "root": "دينية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "severim.",
            "Dinî kitapları",
            "—"
          ],
          "turkishFull": "Dinî kitapları severim.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "هي",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "كُتُب",
              "root": "كتب",
              "category": "fiil (mazi)"
            },
            {
              "text": "المُغامَرات.",
              "root": "مغامرات",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "O (kız)",
            "seviyor.",
            "macera kitaplarını",
            "—"
          ],
          "turkishFull": "O (kız) macera kitaplarını seviyor.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "لا",
              "root": "لا",
              "category": "edat"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الكُتُب",
              "root": "كتاب",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "التّاريخِيَّة.",
              "root": "تاريخي",
              "category": "isim (sıfat · ال takılı · dişil)"
            }
          ],
          "turkish": [
            "sevmem.",
            "Tarihî kitapları",
            "—",
            "—"
          ],
          "turkishFull": "Tarihî kitapları sevmem.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "هي",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "لا",
              "root": "لا",
              "category": "edat"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "كُتُب",
              "root": "كتب",
              "category": "fiil (mazi)"
            },
            {
              "text": "الدِّراما.",
              "root": "دراما",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "O (kız)",
            "sevmiyor.",
            "dram kitaplarını",
            "—",
            "—"
          ],
          "turkishFull": "O (kız) dram kitaplarını sevmiyor.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "لَيْلى",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "الكَلْب",
              "root": "كلب",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الصَّغير.",
              "root": "صغير",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Leylâ",
            "seviyor.",
            "küçük köpeği",
            "—"
          ],
          "turkishFull": "Leylâ küçük köpeği seviyor.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "هي",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "القِراءَة.",
              "root": "قراءة",
              "category": "isim (mastar · ال takılı)"
            }
          ],
          "turkish": [
            "O",
            "seviyor.",
            "okumayı"
          ],
          "turkishFull": "O okumayı seviyor.",
          "ders": "8_2_2"
        },
        {
          "arabic": [
            {
              "text": "رائِع،",
              "root": "رائع",
              "category": "isim"
            },
            {
              "text": "أُريدُ",
              "root": "أراد",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "أَنْ",
              "root": "أن",
              "category": "masdar harfi"
            },
            {
              "text": "أَشْتَرِيَ",
              "root": "اشترى",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "هذا",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "الطَّبَق.",
              "root": "طبق",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Harika!",
            "satın almak istiyorum.",
            "Bu tabağı",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Harika! Bu tabağı satın almak istiyorum.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "طَبْعًا،",
              "root": "طبعا",
              "category": "zarf"
            },
            {
              "text": "تَفَضَّلي.",
              "root": "تفضل",
              "category": "fiil (mazi · mezid) + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "Tabii ki,",
            "buyurun."
          ],
          "turkishFull": "Tabii ki, buyurun.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "حَليمَة",
              "root": "حليمة",
              "category": "isim"
            },
            {
              "text": "تَتَسَوَّقُ",
              "root": "تسوق",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "مَعْرِض",
              "root": "معرض",
              "category": "isim"
            },
            {
              "text": "الفُنون",
              "root": "فن",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "اليَدَوِيَّة.",
              "root": "يدوي",
              "category": "isim (sıfat · ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Halime",
            "alışveriş yapıyor.",
            "el sanatları fuarında",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Halime el sanatları fuarında alışveriş yapıyor.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "حَليمَة",
              "root": "حليمة",
              "category": "isim"
            },
            {
              "text": "تُريدُ",
              "root": "أراد",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "أَنْ",
              "root": "أن",
              "category": "masdar harfi"
            },
            {
              "text": "تَشْتَرِيَ",
              "root": "اشترى",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "طَبَقًا.",
              "root": "طبقا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Halime",
            "satın almak istiyor.",
            "bir tabak",
            "—",
            "—"
          ],
          "turkishFull": "Halime bir tabak satın almak istiyor.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "واتَّجِهْ",
              "root": "اتجه",
              "category": "atıf harfi + fiil (mazi · mezid)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "اليَمين",
              "root": "يمين",
              "category": "zarf (yön)"
            },
            {
              "text": "عِنْدَ",
              "root": "عند",
              "category": "zarf (mekân)"
            },
            {
              "text": "التَّقاطُع",
              "root": "تقاطع",
              "category": "isim (mastar · ال takılı)"
            },
            {
              "text": "الأَوَّل.",
              "root": "أول",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "dön.",
            "sağa",
            "Birinci kavşakta",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Birinci kavşakta sağa dön.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "ثُمَّ",
              "root": "ثم",
              "category": "bağlaç"
            },
            {
              "text": "اِتَّجِهْ",
              "root": "اتجه",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "اليَسار",
              "root": "يسار",
              "category": "zarf (yön)"
            },
            {
              "text": "عِنْدَ",
              "root": "عند",
              "category": "zarf (mekân)"
            },
            {
              "text": "التَّقاطُع",
              "root": "تقاطع",
              "category": "isim (mastar · ال takılı)"
            },
            {
              "text": "الثّاني.",
              "root": "ثاني",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sonra",
            "dön.",
            "sola",
            "ikinci kavşakta",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Sonra ikinci kavşakta sola dön.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "سَتَجِدُ",
              "root": "وجد",
              "category": "fiil (muzari · istikbal · misal · muhatap)"
            },
            {
              "text": "المَكْتَبَة",
              "root": "مكتبة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "عَلى",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "يَمينِك.",
              "root": "يمين",
              "category": "zarf (yön) + bitişik zamir (sen)"
            }
          ],
          "turkish": [
            "bulacaksın.",
            "Kütüphaneyi",
            "sağında",
            "—"
          ],
          "turkishFull": "Kütüphaneyi sağında bulacaksın.",
          "ders": "8_2_3"
        },
        {
          "arabic": [
            {
              "text": "هَلْ",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "سَتَشْتَري",
              "root": "اشترى",
              "category": "fiil (muzari · istikbal · mezid)"
            },
            {
              "text": "لَهُ",
              "root": "له",
              "category": "edat + bitişik zamir (o)"
            },
            {
              "text": "هَدِيَّة؟",
              "root": "هدية",
              "category": "isim"
            }
          ],
          "turkish": [
            "alacak mısın?",
            "Ona bir hediye",
            "—",
            "—"
          ],
          "turkishFull": "Ona bir hediye alacak mısın?",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "نَعَم،",
              "root": "نعم",
              "category": "cevap harfi"
            },
            {
              "text": "سَأَشْتَري",
              "root": "اشترى",
              "category": "fiil (muzari · istikbal · mezid)"
            },
            {
              "text": "لَهُ",
              "root": "له",
              "category": "edat + bitişik zamir (o)"
            },
            {
              "text": "عُلْبَة",
              "root": "علبة",
              "category": "isim"
            },
            {
              "text": "شوكولاتَة.",
              "root": "شوكولاتة",
              "category": "isim"
            }
          ],
          "turkish": [
            "Evet,",
            "alacağım.",
            "ona bir kutu çikolata",
            "—",
            "—"
          ],
          "turkishFull": "Evet, ona bir kutu çikolata alacağım.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "الاِحْتِرام",
              "root": "احترام",
              "category": "isim (ال takılı)"
            },
            {
              "text": "بَيْنَ",
              "root": "بين",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الأَصْدِقاء",
              "root": "صديق",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "مُهِمّ.",
              "root": "مهم",
              "category": "isim"
            }
          ],
          "turkish": [
            "saygı",
            "Arkadaşlar arasında",
            "önemlidir.",
            "—"
          ],
          "turkishFull": "Arkadaşlar arasında saygı önemlidir.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "صَديقي",
              "root": "صديق",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "لِذَلِكَ",
              "root": "لذلك",
              "category": "bağlaç"
            },
            {
              "text": "أَلْعَبُ",
              "root": "لعب",
              "category": "soru edatı + fiil (mazi)"
            },
            {
              "text": "مَعَهُ",
              "root": "مع",
              "category": "zarf + bitişik zamir (o)"
            },
            {
              "text": "دائِمًا.",
              "root": "دائما",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Arkadaşımı severim,",
            "bu yüzden",
            "oynarım.",
            "onunla",
            "hep",
            "—"
          ],
          "turkishFull": "Arkadaşımı severim, bu yüzden onunla hep oynarım.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "أَلْتَقي",
              "root": "التقى",
              "category": "fiil (muzari · mezid · nakıs · mütekellim)"
            },
            {
              "text": "بِصَديقَتي",
              "root": "صديقة",
              "category": "harf-i cer + isim (dişil) + bitişik zamir (ben)"
            },
            {
              "text": "يَوْم",
              "root": "يوم",
              "category": "isim"
            },
            {
              "text": "العُطْلَة،",
              "root": "عطلة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "arkadaşımla buluşurum,",
            "Tatil günü",
            "—",
            "—"
          ],
          "turkishFull": "Tatil günü arkadaşımla buluşurum,",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "مُحَمَّد",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "يُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "السَّمَك",
              "root": "سمك",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لَكِنْ",
              "root": "لكن",
              "category": "bağlaç"
            },
            {
              "text": "لا",
              "root": "لا",
              "category": "edat"
            },
            {
              "text": "يُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الدَّجاج.",
              "root": "دجاج",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Muhammed",
            "balığı sever",
            "ama",
            "tavuğu sevmez.",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Muhammed balığı sever ama tavuğu sevmez.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "أَعْتَذِرُ",
              "root": "اعتذر",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "مِنْ",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "صَديقي.",
              "root": "صديق",
              "category": "isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "özür dilerim.",
            "Arkadaşımdan",
            "—"
          ],
          "turkishFull": "Arkadaşımdan özür dilerim.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "أَحْتَرِمُ",
              "root": "احترم",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "أُمّي.",
              "root": "أم",
              "category": "isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "saygı gösteririm.",
            "Anneme"
          ],
          "turkishFull": "Anneme saygı gösteririm.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "أَتَّصِلُ",
              "root": "اتصل",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "بِصَديقَتي.",
              "root": "صديقة",
              "category": "harf-i cer + isim (dişil) + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "ararım.",
            "Arkadaşımı"
          ],
          "turkishFull": "Arkadaşımı ararım.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "أُشارِكُ",
              "root": "شارك",
              "category": "soru edatı + fiil (mazi · mezid)"
            },
            {
              "text": "مع",
              "root": "مع",
              "category": "zarf"
            },
            {
              "text": "صَديقَتي.",
              "root": "صديقة",
              "category": "isim (dişil) + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "paylaşırım.",
            "Arkadaşlarımla",
            "—"
          ],
          "turkishFull": "Arkadaşlarımla paylaşırım.",
          "ders": "8_3_1"
        },
        {
          "arabic": [
            {
              "text": "كَيْف",
              "root": "كيف",
              "category": "soru edatı"
            },
            {
              "text": "خَديجَة",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "سَتُشارِكُ",
              "root": "شارك",
              "category": "fiil (muzari · istikbal · mezid)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "تَنْظيف",
              "root": "تنظيف",
              "category": "isim"
            },
            {
              "text": "الصَّفّ؟",
              "root": "صف",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "nasıl",
            "Hatice",
            "katılacak?",
            "sınıf temizliğine",
            "—",
            "—"
          ],
          "turkishFull": "Hatice sınıf temizliğine nasıl katılacak?",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "تَعاوُن",
              "root": "تعاون",
              "category": "fiil (mazi · mezid)"
            }
          ],
          "turkish": [
            "Dayanışma"
          ],
          "turkishFull": "Dayanışma",
          "ders": "8_3_2"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "العيد",
              "root": "عيد",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِأَنَّهُ",
              "root": "لأنه",
              "category": "bağlaç + bitişik zamir (o)"
            },
            {
              "text": "يَوْم",
              "root": "يوم",
              "category": "isim"
            },
            {
              "text": "السَّعادَة",
              "root": "سعادة",
              "category": "isim (mastar · ال takılı)"
            },
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "أَبي!",
              "root": "أب",
              "category": "isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "Ben bayramı severim,",
            "çünkü o",
            "mutluluk günüdür",
            "babacığım!",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ben bayramı severim, çünkü o mutluluk günüdür babacığım!",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "لِماذا",
              "root": "لماذا",
              "category": "soru edatı"
            },
            {
              "text": "مُحَمَّد",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "يُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "يَوْم",
              "root": "يوم",
              "category": "isim"
            },
            {
              "text": "العيد؟",
              "root": "عيد",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "neden",
            "Muhammed",
            "seviyor?",
            "bayram gününü",
            "—"
          ],
          "turkishFull": "Muhammed bayram gününü neden seviyor?",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "وكُلّ",
              "root": "وكل",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "عامٍ",
              "root": "عام",
              "category": "isim"
            },
            {
              "text": "وأَنْتُم",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "بِخَيْر.",
              "root": "خير",
              "category": "harf-i cer + isim"
            }
          ],
          "turkish": [
            "Nice yıllara!",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Nice yıllara!",
          "ders": "8_3_3"
        },
        {
          "arabic": [
            {
              "text": "يَدورُ",
              "root": "دار",
              "category": "fiil (muzari)"
            },
            {
              "text": "الحِوار",
              "root": "حوار",
              "category": "isim (ال takılı)"
            },
            {
              "text": "بَيْنَ",
              "root": "بين",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "فُرْقان",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "وأُمِّهِ.",
              "root": "أم",
              "category": "atıf harfi + isim + bitişik zamir (o)"
            }
          ],
          "turkish": [
            "geçiyor.",
            "Diyalog",
            "Furkan ile annesi arasında",
            "—",
            "—"
          ],
          "turkishFull": "Diyalog Furkan ile annesi arasında geçiyor.",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "تَلَوُّث",
              "root": "تلوث",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الجَوّ",
              "root": "جو",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Hava kirliliği",
            "—"
          ],
          "turkishFull": "Hava kirliliği",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "تَلَوُّث",
              "root": "تلوث",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "المِياه",
              "root": "ماء",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Su kirliliği",
            "—"
          ],
          "turkishFull": "Su kirliliği",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "وفيها",
              "root": "وفيها",
              "category": "harf-i cer + bitişik zamir (o · dişil)"
            },
            {
              "text": "تَلَوُّث",
              "root": "تلوث",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "المِياه.",
              "root": "ماء",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "ve orada",
            "su kirliliği var.",
            "—"
          ],
          "turkishFull": "ve orada su kirliliği var.",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "وَلِذَلِكَ",
              "root": "لذلك",
              "category": "atıf harfi + bağlaç"
            },
            {
              "text": "يَجِبُ",
              "root": "وجب",
              "category": "fiil (muzari)"
            },
            {
              "text": "عَلَيْنا",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "أَنْ",
              "root": "أن",
              "category": "masdar harfi"
            },
            {
              "text": "نُحافِظَ",
              "root": "حافظ",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "عَلى",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "نَظافَة",
              "root": "نظافة",
              "category": "isim"
            },
            {
              "text": "البيئَة.",
              "root": "بيئة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "bu yüzden",
            "korumamız gerekir.",
            "çevre temizliğini",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "bu yüzden çevre temizliğini korumamız gerekir.",
          "ders": "8_4_1"
        },
        {
          "arabic": [
            {
              "text": "الأَرْنَب",
              "root": "أرنب",
              "category": "isim (ال takılı)"
            },
            {
              "text": "هُناك",
              "root": "هنا",
              "category": "zarf + bitişik zamir (sen)"
            },
            {
              "text": "بَيْنَ",
              "root": "بين",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الأَشْجار.",
              "root": "شجرة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Tavşan",
            "orada",
            "ağaçların arasında.",
            "—"
          ],
          "turkishFull": "Tavşan orada ağaçların arasında.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "ما",
              "root": "ما",
              "category": "edat"
            },
            {
              "text": "أَجْمَلَ",
              "root": "أجمل",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "هذه",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "الحَيَوانات.",
              "root": "حيوان",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "ne kadar güzel!",
            "Bu hayvanlar",
            "—",
            "—"
          ],
          "turkishFull": "Bu hayvanlar ne kadar güzel!",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الحَيَوانات.",
              "root": "حيوان",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "seviyorum.",
            "hayvanları"
          ],
          "turkishFull": "Ben hayvanları seviyorum.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "وصَديقي",
              "root": "صديق",
              "category": "atıf harfi + isim + bitişik zamir (ben)"
            },
            {
              "text": "يُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الحَيَوانات",
              "root": "حيوان",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الصَّغيرَة،",
              "root": "صغير",
              "category": "isim (sıfat · ال takılı · dişil)"
            },
            {
              "text": "مِثْل",
              "root": "مثل",
              "category": "fiil (mazi)"
            },
            {
              "text": "الأَرْنَب",
              "root": "أرنب",
              "category": "isim (ال takılı)"
            },
            {
              "text": "والقِطَّة",
              "root": "قطة",
              "category": "atıf harfi + isim (ال takılı)"
            },
            {
              "text": "والعُصْفور.",
              "root": "عصفور",
              "category": "atıf harfi + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Arkadaşım ise",
            "sever.",
            "küçük hayvanları",
            "tavşan, kedi ve serçe gibi",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Arkadaşım ise tavşan, kedi ve serçe gibi küçük hayvanları sever.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "الأَرْنَب",
              "root": "أرنب",
              "category": "isim (ال takılı)"
            },
            {
              "text": "يَتَغَذّى",
              "root": "تغذى",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "بِالجَزَر.",
              "root": "جزر",
              "category": "harf-i cer + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Tavşan",
            "beslenir.",
            "havuçla"
          ],
          "turkishFull": "Tavşan havuçla beslenir.",
          "ders": "8_4_2"
        },
        {
          "arabic": [
            {
              "text": "اليَوْم",
              "root": "يوم",
              "category": "zarf (zaman)"
            },
            {
              "text": "سَنَتَحَدَّثُ",
              "root": "تحدث",
              "category": "fiil (muzari · istikbal · mezid)"
            },
            {
              "text": "عَن",
              "root": "عن",
              "category": "harf-i cer"
            },
            {
              "text": "الكَوارِث",
              "root": "كارثة",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "الطَّبيعِيَّة",
              "root": "طبيعي",
              "category": "isim (sıfat · ال takılı · dişil)"
            },
            {
              "text": "يا",
              "root": "يا",
              "category": "edat"
            },
            {
              "text": "طُلّاب.",
              "root": "طالب",
              "category": "isim (kırık çoğul)"
            }
          ],
          "turkish": [
            "Bugün",
            "konuşacağız",
            "doğal afetler hakkında",
            "öğrenciler.",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Bugün doğal afetler hakkında konuşacağız öğrenciler.",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "أَوَّلُها",
              "root": "أول",
              "category": "fiil (mazi · mezid) + bitişik zamir (o · dişil)"
            },
            {
              "text": "الزِّلْزال.",
              "root": "زلزال",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "İlki",
            "depremdir."
          ],
          "turkishFull": "İlki depremdir.",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "لِماذا",
              "root": "لماذا",
              "category": "soru edatı"
            },
            {
              "text": "يَحْدُثُ",
              "root": "حدث",
              "category": "fiil (muzari)"
            },
            {
              "text": "الزِّلْزال",
              "root": "زلزال",
              "category": "isim (ال takılı)"
            },
            {
              "text": "كَثيرًا",
              "root": "كثيرا",
              "category": "zarf"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "بَلَدِنا؟",
              "root": "بلد",
              "category": "fiil (mazi · mezid)"
            }
          ],
          "turkish": [
            "deprem neden",
            "oluyor?",
            "çok",
            "Ülkemizde",
            "—",
            "—"
          ],
          "turkishFull": "Ülkemizde deprem neden çok oluyor?",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "لِأَنَّ",
              "root": "لأن",
              "category": "bağlaç"
            },
            {
              "text": "بَلَدَنا",
              "root": "بلد",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "يَقَعُ",
              "root": "وقع",
              "category": "fiil (muzari · misal)"
            },
            {
              "text": "عَلى",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "خُطوط",
              "root": "خط",
              "category": "isim (kırık çoğul)"
            },
            {
              "text": "الزَّلازِل.",
              "root": "زلزال",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "Çünkü ülkemiz",
            "yer alıyor.",
            "deprem hatları üzerinde",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Çünkü ülkemiz deprem hatları üzerinde yer alıyor.",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "والفَيَضانات",
              "root": "فيضان",
              "category": "atıf harfi + isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "تَحْدُثُ",
              "root": "تحدث",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "كَثيرًا",
              "root": "كثيرا",
              "category": "zarf"
            },
            {
              "text": "أَيْضًا.",
              "root": "أيضا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Seller de",
            "oluyor.",
            "çok",
            "—"
          ],
          "turkishFull": "Seller de çok oluyor.",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "بَعْدَ",
              "root": "بعد",
              "category": "fiil (mazi)"
            },
            {
              "text": "الكَوارِث",
              "root": "كارثة",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "يَجِبُ",
              "root": "وجب",
              "category": "fiil (muzari)"
            },
            {
              "text": "أَنْ",
              "root": "أن",
              "category": "masdar harfi"
            },
            {
              "text": "نُساعِدَ",
              "root": "ساعد",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "المَنْكوبين.",
              "root": "منكوب",
              "category": "isim (düzenli çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "Afetlerden sonra",
            "yardım etmemiz gerekir.",
            "afetzedelere",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Afetlerden sonra afetzedelere yardım etmemiz gerekir.",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "شاهَدْتُ",
              "root": "شاهد",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "فيديو",
              "root": "فيديو",
              "category": "isim"
            },
            {
              "text": "عَن",
              "root": "عن",
              "category": "harf-i cer"
            },
            {
              "text": "الكَوارِث",
              "root": "كارثة",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "الطَّبيعِيَّة",
              "root": "طبيعي",
              "category": "isim (sıfat · ال takılı · dişil)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "التِّلْفاز",
              "root": "تلفاز",
              "category": "isim (ال takılı)"
            },
            {
              "text": "أَمْس.",
              "root": "أمس",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "bir video izledim.",
            "doğal afetler hakkında",
            "televizyonda",
            "Dün",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Dün televizyonda doğal afetler hakkında bir video izledim.",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "لِأَنَّ",
              "root": "لأن",
              "category": "bağlaç"
            },
            {
              "text": "تُرْكِيا",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "تَقَعُ",
              "root": "وقع",
              "category": "fiil (muzari · misal · dişil)"
            },
            {
              "text": "عَلى",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "خُطوط",
              "root": "خط",
              "category": "isim (kırık çoğul)"
            },
            {
              "text": "الزِّلْزال.",
              "root": "زلزال",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "çünkü Türkiye",
            "yer alır.",
            "deprem hatları üzerinde",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "çünkü Türkiye deprem hatları üzerinde yer alır.",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "يَجِبُ",
              "root": "وجب",
              "category": "fiil (muzari)"
            },
            {
              "text": "أَنْ",
              "root": "أن",
              "category": "masdar harfi"
            },
            {
              "text": "نَسْتَعِدَّ",
              "root": "استعد",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "قَبْلَ",
              "root": "قبل",
              "category": "fiil (mazi)"
            },
            {
              "text": "الكَوارِث.",
              "root": "كارثة",
              "category": "isim (kırık çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "gerekir.",
            "hazırlıklı olmamız",
            "Afetlerden önce",
            "—",
            "—"
          ],
          "turkishFull": "Afetlerden önce hazırlıklı olmamız gerekir.",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "يوجَدُ",
              "root": "أوجد",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "خَطّ",
              "root": "خط",
              "category": "fiil (mazi)"
            },
            {
              "text": "زِلْزال",
              "root": "زلزال",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "شَمال",
              "root": "شمال",
              "category": "isim"
            },
            {
              "text": "تُرْكِيا.",
              "root": "SKIP",
              "category": "isim (özel)"
            }
          ],
          "turkish": [
            "bir deprem hattı vardır.",
            "Türkiye'nin kuzeyinde",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Türkiye'nin kuzeyinde bir deprem hattı vardır.",
          "ders": "8_4_3"
        },
        {
          "arabic": [
            {
              "text": "هل",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "تُحِبّينَ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap · dişil)"
            },
            {
              "text": "الرِّياضَة؟",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "sever misin?",
            "Sporu",
            "—"
          ],
          "turkishFull": "Sporu sever misin?",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "نَعَم،",
              "root": "نعم",
              "category": "cevap harfi"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "كَثيرًا،",
              "root": "كثيرا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "Evet,",
            "severim.",
            "sporu",
            "çok"
          ],
          "turkishFull": "Evet, sporu çok severim.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "كُرَة",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "القَدَم،",
              "root": "قدم",
              "category": "isim (ال takılı)"
            },
            {
              "text": "وأَنْتِ؟",
              "root": "SKIP",
              "category": "zamir"
            }
          ],
          "turkish": [
            "Ben",
            "futbolu",
            "severim, ya sen?",
            "—"
          ],
          "turkishFull": "Ben futbolu severim, ya sen?",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "السِّباحَة.",
              "root": "سباحة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "yüzmeyi severim."
          ],
          "turkishFull": "Ben yüzmeyi severim.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "مَتى",
              "root": "متى",
              "category": "soru edatı"
            },
            {
              "text": "تُمارِسُ",
              "root": "مارس",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الرِّياضَة؟",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "ne zaman yaparsın?",
            "Sporu",
            "—"
          ],
          "turkishFull": "Sporu ne zaman yaparsın?",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "أُمارِسُ",
              "root": "مارس",
              "category": "soru edatı + fiil (mazi · mezid)"
            },
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "نِهايَة",
              "root": "نهاية",
              "category": "isim (mastar · dişil)"
            },
            {
              "text": "كُلّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "أُسْبوع",
              "root": "أسبوع",
              "category": "isim"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "الصّالَة",
              "root": "صالة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الرِّياضِيَّة.",
              "root": "رياضية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "yaparım.",
            "Sporu",
            "her hafta sonu",
            "spor salonunda",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Sporu her hafta sonu spor salonunda yaparım.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "عائِشَة",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "السِّباحَة.",
              "root": "سباحة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ayşe",
            "sever.",
            "yüzmeyi"
          ],
          "turkishFull": "Ayşe yüzmeyi sever.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "أَحْمَد",
              "root": "SKIP",
              "category": "isim (özel)"
            },
            {
              "text": "يُفَضِّلُ",
              "root": "فضل",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "كُرَة",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "القَدَم.",
              "root": "قدم",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ahmet",
            "tercih eder.",
            "futbolu",
            "—"
          ],
          "turkishFull": "Ahmet futbolu tercih eder.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "أَوَّل",
              "root": "أول",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "مُباراة",
              "root": "مباراة",
              "category": "isim"
            },
            {
              "text": "لِلْكُرَة",
              "root": "كرة",
              "category": "harf-i cer + isim (ال takılı)"
            },
            {
              "text": "الطّائِرَة",
              "root": "طائرة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "كانَتْ",
              "root": "كان",
              "category": "fiil (mazi)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "أَمْريكا.",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            }
          ],
          "turkish": [
            "Voleybolun ilk maçı",
            "olmuştur.",
            "Amerika'da",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Voleybolun ilk maçı Amerika'da olmuştur.",
          "ders": "8_5_1"
        },
        {
          "arabic": [
            {
              "text": "نَعَم،",
              "root": "نعم",
              "category": "cevap harfi"
            },
            {
              "text": "أُمارِسُ",
              "root": "مارس",
              "category": "soru edatı + fiil (mazi · mezid)"
            },
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "كُلَّ",
              "root": "كل",
              "category": "isim"
            },
            {
              "text": "يَوْم،",
              "root": "يوم",
              "category": "isim"
            },
            {
              "text": "لِأَنَّها",
              "root": "لأنها",
              "category": "bağlaç + bitişik zamir (o · dişil)"
            },
            {
              "text": "مُفيدَة",
              "root": "مفيد",
              "category": "isim (sıfat · dişil)"
            },
            {
              "text": "جِدًّا",
              "root": "جدا",
              "category": "zarf"
            },
            {
              "text": "لِلصِّحَّة.",
              "root": "صحة",
              "category": "harf-i cer + isim (ال takılı)"
            }
          ],
          "turkish": [
            "Evet,",
            "spor yaparım,",
            "her gün",
            "çünkü o sağlık için çok faydalıdır.",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Evet, her gün spor yaparım, çünkü o sağlık için çok faydalıdır.",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الكُرَةَ",
              "root": "كرة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الطّائِرَة.",
              "root": "طائرة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "severim.",
            "voleybolu",
            "—"
          ],
          "turkishFull": "Ben voleybolu severim.",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "تُقَوّي",
              "root": "قوى",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الجِسْم.",
              "root": "جسم",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Spor",
            "güçlendirir.",
            "bedeni"
          ],
          "turkishFull": "Spor bedeni güçlendirir.",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "تُقَوّي",
              "root": "قوى",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "عَلاقات",
              "root": "علاقة",
              "category": "isim (kırık çoğul)"
            },
            {
              "text": "الصَّداقَة.",
              "root": "صداقة",
              "category": "isim (mastar · ال takılı)"
            }
          ],
          "turkish": [
            "Spor",
            "güçlendirir.",
            "dostluk ilişkilerini",
            "—"
          ],
          "turkishFull": "Spor dostluk ilişkilerini güçlendirir.",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "تُحافِظُ",
              "root": "حافظ",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "عَلى",
              "root": "على",
              "category": "edat"
            },
            {
              "text": "صِحَّة",
              "root": "صحة",
              "category": "isim"
            },
            {
              "text": "القَلْب.",
              "root": "قلب",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Spor",
            "korur.",
            "kalp sağlığını",
            "—",
            "—"
          ],
          "turkishFull": "Spor kalp sağlığını korur.",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "فَهِيَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "تُقَوّي",
              "root": "قوى",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "جِسْمَنا",
              "root": "جسم",
              "category": "fiil (mazi)"
            },
            {
              "text": "والعَلاقات",
              "root": "علاقة",
              "category": "atıf harfi + isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "بَيْنَ",
              "root": "بين",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الأَصْدِقاء",
              "root": "صديق",
              "category": "isim (kırık çoğul · ال takılı)"
            },
            {
              "text": "أَيْضًا.",
              "root": "أيضا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "çünkü o",
            "güçlendirir.",
            "bedenimizi",
            "ve arkadaşlar arasındaki ilişkileri",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "çünkü o bedenimizi ve arkadaşlar arasındaki ilişkileri güçlendirir.",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "وَلِذَلِكَ",
              "root": "لذلك",
              "category": "atıf harfi + bağlaç"
            },
            {
              "text": "يَجِبُ",
              "root": "وجب",
              "category": "fiil (muzari)"
            },
            {
              "text": "أَنْ",
              "root": "أن",
              "category": "masdar harfi"
            },
            {
              "text": "نُمارِسَ",
              "root": "مارس",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "لِحَياة",
              "root": "حياة",
              "category": "harf-i cer + isim"
            },
            {
              "text": "أَجْمَل.",
              "root": "أجمل",
              "category": "fiil (mazi · mezid)"
            }
          ],
          "turkish": [
            "Bu yüzden",
            "spor yapmalıyız.",
            "daha güzel bir hayat için",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Bu yüzden daha güzel bir hayat için spor yapmalıyız.",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "هَلْ",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "الرِّياضَة؟",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "sever misin?",
            "Sporu",
            "—"
          ],
          "turkishFull": "Sporu sever misin?",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "تُفَضِّلُ؟",
              "root": "تفضل",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "أَيّ",
              "root": "أي",
              "category": "soru edatı"
            },
            {
              "text": "رِياضَة",
              "root": "رياضة",
              "category": "isim"
            }
          ],
          "turkish": [
            "tercih edersin?",
            "Hangi sporu",
            "—"
          ],
          "turkishFull": "Hangi sporu tercih edersin?",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "هَلْ",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "تُمارِسُ",
              "root": "مارس",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الرِّياضَة؟",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "yapar mısın?",
            "Spor",
            "—"
          ],
          "turkishFull": "Spor yapar mısın?",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "مَتى",
              "root": "متى",
              "category": "soru edatı"
            },
            {
              "text": "تُمارِسُ",
              "root": "مارس",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الرِّياضَة؟",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "ne zaman yaparsın?",
            "Sporu",
            "—"
          ],
          "turkishFull": "Sporu ne zaman yaparsın?",
          "ders": "8_5_2"
        },
        {
          "arabic": [
            {
              "text": "تُحِبّينَ؟",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap · dişil)"
            },
            {
              "text": "أَيَّ",
              "root": "أي",
              "category": "soru edatı"
            },
            {
              "text": "نَوْع",
              "root": "نوع",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "مِن",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "الرِّياضات",
              "root": "رياضة",
              "category": "isim (dişil çoğul · ال takılı)"
            }
          ],
          "turkish": [
            "seversin?",
            "hangi türü",
            "Sporlardan",
            "—",
            "—"
          ],
          "turkishFull": "Sporlardan hangi türü seversin?",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "أَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "الرِّياضات",
              "root": "رياضة",
              "category": "isim (dişil çoğul · ال takılı)"
            },
            {
              "text": "الجَماعِيَّة،",
              "root": "جماعي",
              "category": "isim (sıfat · ال takılı · dişil)"
            },
            {
              "text": "مِثْل",
              "root": "مثل",
              "category": "fiil (mazi)"
            },
            {
              "text": "كُرَة",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "القَدَم",
              "root": "قدم",
              "category": "isim (ال takılı)"
            },
            {
              "text": "وكُرَة",
              "root": "كرة",
              "category": "atıf harfi + isim"
            },
            {
              "text": "السَّلَّة.",
              "root": "سلة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "severim.",
            "takım sporlarını",
            "futbol ve basketbol gibi",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ben futbol ve basketbol gibi takım sporlarını severim.",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "هل",
              "root": "هل",
              "category": "soru edatı"
            },
            {
              "text": "تُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid · muhatap)"
            },
            {
              "text": "الرِّياضات",
              "root": "رياضة",
              "category": "isim (dişil çoğul · ال takılı)"
            },
            {
              "text": "المائِيَّة؟",
              "root": "مائية",
              "category": "isim (ال takılı · dişil)"
            }
          ],
          "turkish": [
            "sever misin?",
            "Su sporlarını",
            "—",
            "—"
          ],
          "turkishFull": "Su sporlarını sever misin?",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "نَعَم،",
              "root": "نعم",
              "category": "cevap harfi"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "كُرَة",
              "root": "كرة",
              "category": "isim"
            },
            {
              "text": "الماء.",
              "root": "ماء",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Evet,",
            "severim.",
            "su topunu",
            "—"
          ],
          "turkishFull": "Evet, su topunu severim.",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "وأَنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "السِّباحَة.",
              "root": "سباحة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben de",
            "severim.",
            "yüzmeyi"
          ],
          "turkishFull": "Ben de yüzmeyi severim.",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "تَزَلُّج",
              "root": "تزلج",
              "category": "fiil (mazi · mezid)"
            }
          ],
          "turkish": [
            "Kayak"
          ],
          "turkishFull": "Kayak",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "صَديقي",
              "root": "صديق",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "يُحِبُّ",
              "root": "أحب",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "الرِّياضات",
              "root": "رياضة",
              "category": "isim (dişil çoğul · ال takılı)"
            },
            {
              "text": "الجَماعِيَّة.",
              "root": "جماعي",
              "category": "isim (sıfat · ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Arkadaşım",
            "sever.",
            "takım sporlarını",
            "—"
          ],
          "turkishFull": "Arkadaşım takım sporlarını sever.",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "أَتَزَلَّجُ",
              "root": "تزلج",
              "category": "soru edatı + fiil (mazi · mezid)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "الشِّتاء.",
              "root": "شتاء",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "kayak yaparım.",
            "Kışın",
            "—"
          ],
          "turkishFull": "Kışın kayak yaparım.",
          "ders": "8_5_3"
        },
        {
          "arabic": [
            {
              "text": "تَخَرَّجْتُ",
              "root": "تخرج",
              "category": "fiil (mazi · mezid · mütekellim)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "المُتَوَسِّطَة.",
              "root": "متوسط",
              "category": "isim (sıfat · ال takılı · dişil)"
            }
          ],
          "turkish": [
            "mezun oldum.",
            "Ortaokuldan",
            "—",
            "—"
          ],
          "turkishFull": "Ortaokuldan mezun oldum.",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "اِسْتَمَعْتُ",
              "root": "استمع",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "تِلاوَة",
              "root": "تلاوة",
              "category": "isim"
            },
            {
              "text": "مِن",
              "root": "من",
              "category": "edat"
            },
            {
              "text": "القُرْآن",
              "root": "قرآن",
              "category": "isim (ال takılı)"
            },
            {
              "text": "الكَريم.",
              "root": "كريم",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "dinledim.",
            "Kur'ân-ı Kerîm'den bir tilâvet",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Kur'ân-ı Kerîm'den bir tilâvet dinledim.",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "اِسْتَيْقَظَ",
              "root": "استيقظ",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "كَريم",
              "root": "كريم",
              "category": "isim"
            },
            {
              "text": "مُبَكِّرًا",
              "root": "مبكرا",
              "category": "zarf"
            },
            {
              "text": "أَمْس.",
              "root": "أمس",
              "category": "zarf (zaman)"
            }
          ],
          "turkish": [
            "uyandı.",
            "Kerim",
            "erken",
            "dün"
          ],
          "turkishFull": "Kerim dün erken uyandı.",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "لِأَنَّ",
              "root": "لأن",
              "category": "bağlaç"
            },
            {
              "text": "أُخْتَهُ",
              "root": "أخت",
              "category": "isim + bitişik zamir (o)"
            },
            {
              "text": "تَخَرَّجَتْ",
              "root": "تخرج",
              "category": "fiil (mazi · mezid · mütekellim)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "المَدْرَسَة",
              "root": "مدرسة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "المُتَوَسِّطَة،",
              "root": "متوسط",
              "category": "isim (sıfat · ال takılı · dişil)"
            }
          ],
          "turkish": [
            "Çünkü kız kardeşi",
            "mezun oldu",
            "ortaokuldan",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Çünkü kız kardeşi ortaokuldan mezun oldu",
          "ders": "8_6_1"
        },
        {
          "arabic": [
            {
              "text": "لا",
              "root": "لا",
              "category": "edat"
            },
            {
              "text": "أَسْتَيْقِظُ",
              "root": "استيقظ",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "مُتَأَخِّرًا",
              "root": "متأخر",
              "category": "isim"
            },
            {
              "text": "أَبَدًا.",
              "root": "أبدا",
              "category": "zarf"
            }
          ],
          "turkish": [
            "uyanmam.",
            "geç",
            "Asla",
            "—"
          ],
          "turkishFull": "Asla geç uyanmam.",
          "ders": "8_6_2"
        },
        {
          "arabic": [
            {
              "text": "سَأَشْتاقُ",
              "root": "اشتاق",
              "category": "fiil (muzari · istikbal · mezid)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "مَدْرَسَتي",
              "root": "مدرسة",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "دائِمًا.",
              "root": "دائما",
              "category": "zarf"
            }
          ],
          "turkish": [
            "özleyeceğim.",
            "Okulumu",
            "hep",
            "—"
          ],
          "turkishFull": "Okulumu hep özleyeceğim.",
          "ders": "8_6_2"
        },
        {
          "arabic": [
            {
              "text": "أُمارِسُ",
              "root": "مارس",
              "category": "soru edatı + fiil (mazi · mezid)"
            },
            {
              "text": "الرِّياضَة",
              "root": "رياضة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "غالِبًا.",
              "root": "غالب",
              "category": "isim"
            }
          ],
          "turkish": [
            "yaparım.",
            "spor",
            "Çoğunlukla"
          ],
          "turkishFull": "Çoğunlukla spor yaparım.",
          "ders": "8_6_2"
        },
        {
          "arabic": [
            {
              "text": "أَحْتَرِمُ",
              "root": "احترم",
              "category": "fiil (muzari · mezid)"
            },
            {
              "text": "عائِلَتي،",
              "root": "عائلة",
              "category": "isim + bitişik zamir (ben)"
            },
            {
              "text": "لِأَنَّ",
              "root": "لأن",
              "category": "bağlaç"
            },
            {
              "text": "الاِحْتِرام",
              "root": "احترام",
              "category": "isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "العائِلَة",
              "root": "عائلة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "مُهِمّ.",
              "root": "مهم",
              "category": "isim"
            }
          ],
          "turkish": [
            "saygı gösteririm,",
            "Ailem'e",
            "çünkü ailede saygı önemlidir.",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ailem'e saygı gösteririm, çünkü ailede saygı önemlidir.",
          "ders": "8_6_2"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "لا",
              "root": "لا",
              "category": "edat"
            },
            {
              "text": "آكُلُ",
              "root": "آكل",
              "category": "isim"
            },
            {
              "text": "كَثيرًا،",
              "root": "كثيرا",
              "category": "zarf"
            },
            {
              "text": "لِأَنَّهُ",
              "root": "لأنه",
              "category": "bağlaç + bitişik zamir (o)"
            },
            {
              "text": "ضارّ",
              "root": "ضار",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "بِصِحَّتي.",
              "root": "صحة",
              "category": "harf-i cer + isim + bitişik zamir (ben)"
            }
          ],
          "turkish": [
            "Ben",
            "yemem,",
            "çok",
            "çünkü o sağlığıma zararlıdır.",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ben çok yemem, çünkü o sağlığıma zararlıdır.",
          "ders": "8_6_2"
        },
        {
          "arabic": [
            {
              "text": "لَعِبْنا",
              "root": "لعب",
              "category": "fiil (mazi)"
            },
            {
              "text": "وضَحِكْنا",
              "root": "ضحك",
              "category": "atıf harfi + fiil (mazi) + bitişik zamir (biz)"
            },
            {
              "text": "مَعًا",
              "root": "معا",
              "category": "zarf"
            },
            {
              "text": "وتَعَلَّمْنا.",
              "root": "تعلم",
              "category": "atıf harfi + fiil (mazi · mezid) + bitişik zamir (biz)"
            }
          ],
          "turkish": [
            "oynadık, güldük",
            "Birlikte",
            "ve öğrendik.",
            "—"
          ],
          "turkishFull": "Birlikte oynadık, güldük ve öğrendik.",
          "ders": "8_6_2"
        },
        {
          "arabic": [
            {
              "text": "أنا",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "سَأَتَزَلَّجُ",
              "root": "تزلج",
              "category": "fiil (muzari · istikbal · mezid)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "الشِّتاء.",
              "root": "شتاء",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ben",
            "kayak yapacağım.",
            "kışın",
            "—"
          ],
          "turkishFull": "Ben kışın kayak yapacağım.",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "أَنْتَ",
              "root": "SKIP",
              "category": "zamir"
            },
            {
              "text": "سَتَلْتَقِطُ",
              "root": "تقط",
              "category": "fiil (muzari · istikbal · mezid)"
            },
            {
              "text": "صُوَرًا",
              "root": "صورا",
              "category": "zarf"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "الطَّبيعَة.",
              "root": "طبيعة",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Sen",
            "fotoğraf çekeceksin.",
            "doğada",
            "—",
            "—"
          ],
          "turkishFull": "Sen doğada fotoğraf çekeceksin.",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "لَكِنْ",
              "root": "لكن",
              "category": "bağlaç"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "هذه",
              "root": "SKIP",
              "category": "işaret ismi"
            },
            {
              "text": "العُطْلَة",
              "root": "عطلة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "سَأَذْهَبُ",
              "root": "ذهب",
              "category": "fiil (muzari · istikbal · mütekellim)"
            },
            {
              "text": "إلى",
              "root": "إلى",
              "category": "harf-i cer"
            },
            {
              "text": "أَنْطالْيا",
              "root": "SKIP",
              "category": "isim (özel · yer)"
            },
            {
              "text": "لِأَنَّني",
              "root": "لأنني",
              "category": "bağlaç + bitişik zamir (ben)"
            },
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "البَحْر.",
              "root": "بحر",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "Ama bu tatilde",
            "gideceğim,",
            "Antalya'ya",
            "çünkü denizi seviyorum.",
            "—",
            "—",
            "—",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Ama bu tatilde Antalya'ya gideceğim, çünkü denizi seviyorum.",
          "ders": "8_6_3"
        },
        {
          "arabic": [
            {
              "text": "أُحِبُّ",
              "root": "أحب",
              "category": "fiil (mazi · mezid)"
            },
            {
              "text": "صَيْد",
              "root": "صيد",
              "category": "isim"
            },
            {
              "text": "الأَسْماك",
              "root": "سمكة",
              "category": "isim (ال takılı)"
            },
            {
              "text": "والسِّباحَة",
              "root": "سباحة",
              "category": "atıf harfi + isim (ال takılı)"
            },
            {
              "text": "في",
              "root": "في",
              "category": "harf-i cer"
            },
            {
              "text": "البَحْر.",
              "root": "بحر",
              "category": "isim (ال takılı)"
            }
          ],
          "turkish": [
            "severim.",
            "balık tutmayı ve yüzmeyi",
            "Denizde",
            "—",
            "—",
            "—"
          ],
          "turkishFull": "Denizde balık tutmayı ve yüzmeyi severim.",
          "ders": "8_6_3"
        }
      ]
    }
  ]
};
