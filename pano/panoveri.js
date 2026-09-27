/* ==================================================================
   PANO VERİSİ — "Bu Günün Kökü" afişleri
   ------------------------------------------------------------------
   ÜRETİLMİŞ DOSYA. Elle düzenlemeyin; Arapça metinlerin tamamı
   sitenin kendi kök verisinden (veri/veri_kokler.js → wordEasterEggs)
   çekildi, tek tek yazılmadı. Yeni afiş eklemek ya da bir kökün
   türevlerini değiştirmek için üretici betik çalıştırılır.

   Her kayıt: gün adı, tarih, renk, kök harfleri, o kökten türeyen
   kelimeler (Arapça + Türkçe) ve verideki örnek cümleler (en çok üç;
   afişte kaçının sığdığına pano.js karar veriyor).
   ================================================================== */
window.PANO_VERI = [
  {
    "id": "camiler",
    "ad": "Camiler ve Din Görevlileri Haftası",
    "tarih": "1 – 7 Ekim",
    "renk": "#16A085",
    "kok": "جمع",
    "turev": [
      {
        "ar": "جَامِع",
        "tr": "Cami / Toplayan, bir araya getiren",
        "kisa": "Cami"
      },
      {
        "ar": "جُمُعَة",
        "tr": "Cuma / Toplanma günü",
        "kisa": "Cuma"
      },
      {
        "ar": "جَمَاعَة",
        "tr": "Cemaat / Topluluk, grup",
        "kisa": "Cemaat"
      },
      {
        "ar": "جَمَعَ",
        "tr": "Topladı / Bir araya getirdi",
        "kisa": "Topladı"
      },
      {
        "ar": "اِجْتَمَعَ",
        "tr": "Toplandı / Bir araya geldi",
        "kisa": "Toplandı"
      }
    ],
    "cumleler": [
      {
        "ar": "جَمَعَ مَالًا وَعَدَّدَهُ",
        "tr": "Mal toplayıp onu tekrar tekrar sayan...",
        "kaynak": "Hümeze Suresi, 2"
      },
      {
        "ar": "يَدُ اللهِ مَعَ الجَمَاعَةِ",
        "tr": "Allah'ın eli (yardımı ve rahmeti) cemaatle (toplulukla) beraberdir.",
        "kaynak": "Hadis-i Şerif"
      },
      {
        "ar": "اِجْتَمَعَ المُدِيرُ بِالْمُوَظَّفِينَ",
        "tr": "Müdür çalışanlarla toplantı yaptı.",
        "kaynak": ""
      }
    ],
    "not": "Cami de cuma da cemaat de tek bir kökten: bir araya gelmek. Üçünü yan yana koyunca kelimenin niye o anlama geldiği kendiliğinden görünüyor."
  },
  {
    "id": "cumhuriyet",
    "ad": "Cumhuriyet Bayramı",
    "tarih": "29 Ekim",
    "renk": "#C0392B",
    "kok": "حرر",
    "turev": [
      {
        "ar": "حُرّ",
        "tr": "Hür, özgür; asil",
        "kisa": "Hür, özgür"
      },
      {
        "ar": "أَحْرَار",
        "tr": "Hürler, özgür kimseler (حُرّ çoğulu)",
        "kisa": "Hürler, özgür kimseler"
      },
      {
        "ar": "حَرَّرَ",
        "tr": "Kurtardı, azat etti; (metni) yazıp düzeltti",
        "kisa": "Kurtardı, azat etti"
      },
      {
        "ar": "تَحْرِير",
        "tr": "Tahrir; kurtarma, azat etme; yazı işleri (masdar)",
        "kisa": "Tahrir"
      },
      {
        "ar": "مُحَرِّر",
        "tr": "Kurtaran; editör, yazı işleri müdürü",
        "kisa": "Kurtaran"
      }
    ],
    "cumleler": [
      {
        "ar": "أَعِيشُ فِي وَطَنِي حُرًّا",
        "tr": "Vatanımda özgürce yaşıyorum.",
        "kaynak": ""
      },
      {
        "ar": "حَرَّ الجَوُّ فِي الظَّهِيرَةِ",
        "tr": "Öğle vakti hava ısındı.",
        "kaynak": ""
      },
      {
        "ar": "الطَّقْسُ حَارٌّ فِي الصَّيْفِ",
        "tr": "Yazın hava sıcaktır.",
        "kaynak": ""
      }
    ],
    "not": "Hürriyet, hür, ahrar… Cumhuriyetin anahtar kelimesi Arapçada tek bir kökten çıkıyor."
  },
  {
    "id": "anma",
    "ad": "10 Kasım · Atatürk'ü Anma",
    "tarih": "10 Kasım",
    "renk": "#34495E",
    "kok": "ذكر",
    "turev": [
      {
        "ar": "ذَكَرَ",
        "tr": "Hatırladı / Andı",
        "kisa": "Hatırladı"
      },
      {
        "ar": "ذِكْر",
        "tr": "Zikir / Anma / Hatırlama",
        "kisa": "Zikir"
      },
      {
        "ar": "ذَاكِر",
        "tr": "Zâkir / Anan, hatırlayan, zikreden",
        "kisa": "Zâkir"
      },
      {
        "ar": "مَذْكُور",
        "tr": "Mezkûr / Anılan, adı geçen, zikredilen",
        "kisa": "Mezkûr"
      },
      {
        "ar": "ذَاكَرَ",
        "tr": "Müzakere etti / Çalıştı (ders)",
        "kisa": "Müzakere etti"
      }
    ],
    "cumleler": [
      {
        "ar": "ذِكْرُ اللهِ",
        "tr": "Allah'ı anmak.",
        "kaynak": ""
      },
      {
        "ar": "يُذَاكِرُ بِجِدٍّ",
        "tr": "Ciddiyetle çalışır.",
        "kaynak": ""
      },
      {
        "ar": "الذَّاكِرُونَ اللهَ",
        "tr": "Allah'ı (çokça) ananlar.",
        "kaynak": ""
      }
    ],
    "not": "Anmak, hatırlamak, zikretmek… Türkçede ayrı duran kelimeler Arapçada aynı kökün dalları."
  },
  {
    "id": "ogretmenler",
    "ad": "Öğretmenler Günü",
    "tarih": "24 Kasım",
    "renk": "#7C3AED",
    "kok": "علم",
    "turev": [
      {
        "ar": "عَلِمَ",
        "tr": "Bildi / Öğrendi",
        "kisa": "Bildi"
      },
      {
        "ar": "عِلْم",
        "tr": "İlim / Bilgi",
        "kisa": "İlim"
      },
      {
        "ar": "عَلَّمَ",
        "tr": "Öğretti",
        "kisa": "Öğretti"
      },
      {
        "ar": "مُعَلِّم",
        "tr": "Öğretmen",
        "kisa": "Öğretmen"
      },
      {
        "ar": "عُلَمَاء",
        "tr": "Âlimler",
        "kisa": "Âlimler"
      }
    ],
    "cumleler": [
      {
        "ar": "الرَّحْمَٰنُ ۝ عَلَّمَ القُرْآنَ",
        "tr": "Rahmân, Kur'an'ı öğretti.",
        "kaynak": "Rahmân Suresi, 1-2"
      },
      {
        "ar": "العُلَمَاءُ وَرَثَةُ الأَنْبِيَاءِ",
        "tr": "Âlimler peygamberlerin varisleridir.",
        "kaynak": "Hadis-i Şerif"
      },
      {
        "ar": "كادَ المُعَلِّمُ أَن يَكونَ رَسولاً",
        "tr": "Öğretmen neredeyse bir elçi (peygamber) olacaktı. (Ahmed Şevki'nin meşhur şiirinden)",
        "kaynak": ""
      }
    ],
    "not": "Muallim \"öğreten\", ilim \"bilinen\", âlim \"bilen\". Öğretmenler Günü bir kökün bütün dallarını taşıyor."
  },
  {
    "id": "arapca-gunu",
    "ad": "Dünya Arapça Günü",
    "tarih": "18 Aralık",
    "renk": "#2563EB",
    "kok": "كلم",
    "turev": [
      {
        "ar": "كَلَّمَ",
        "tr": "Konuştu / Hitap etti",
        "kisa": "Konuştu"
      },
      {
        "ar": "كَلِمَة",
        "tr": "Kelime / Sözcük",
        "kisa": "Kelime"
      },
      {
        "ar": "كَلَام",
        "tr": "Kelam / Söz, konuşma",
        "kisa": "Kelam"
      },
      {
        "ar": "مُكَالَمَة",
        "tr": "Mükaleme / Karşılıklı konuşma, diyalog, telefon görüşmesi",
        "kisa": "Mükaleme"
      }
    ],
    "cumleler": [
      {
        "ar": "كَلَامُ اللهِ",
        "tr": "Allah'ın kelamı (sözü - Kur'an-ı Kerim için kullanılır).",
        "kaynak": ""
      },
      {
        "ar": "مُكَالَمَةٌ هَاتِفِيَّةٌ",
        "tr": "Telefon görüşmesi (mükalemesi).",
        "kaynak": ""
      },
      {
        "ar": "كَالَمَ صَدِيقَهُ فِي الهَاتِفِ",
        "tr": "Telefonda arkadaşıyla konuştu.",
        "kaynak": ""
      }
    ],
    "not": "Birleşmiş Milletler 18 Aralık'ı Arapça Günü ilan etti. Kelime, kelam, mükâleme: konuşmanın kökü."
  },
  {
    "id": "ucaylar",
    "ad": "Üç Aylar · Regaib Kandili",
    "tarih": "10 Aralık",
    "renk": "#0E7C66",
    "kok": "دعو",
    "turev": [
      {
        "ar": "دَعَا",
        "tr": "Davet etti / Dua etti",
        "kisa": "Davet etti"
      },
      {
        "ar": "يَدْعُو",
        "tr": "Davet eder / Dua ediyor",
        "kisa": "Davet eder"
      },
      {
        "ar": "دُعَاء",
        "tr": "Dua etmek",
        "kisa": "Dua etmek"
      },
      {
        "ar": "دَاعٍ",
        "tr": "Davet eden",
        "kisa": "Davet eden"
      }
    ],
    "cumleler": [
      {
        "ar": "قَبِلَ دَعْوَةَ صَدِيقِهِ",
        "tr": "Arkadaşının davetini kabul etti.",
        "kaynak": ""
      },
      {
        "ar": "هُوَ دَاعٍ إِلَى الخَيْرِ",
        "tr": "O hayra davet edendir.",
        "kaynak": ""
      },
      {
        "ar": "اُدْعُ إِلَى سَبِيلِ رَبِّكَ",
        "tr": "Rabbinin yoluna davet et.",
        "kaynak": ""
      }
    ],
    "not": "Dua \"çağırmak\"tır: davet, davetiye, dâî hep aynı kökten. Üç aylar bu çağrının mevsimi."
  },
  {
    "id": "mirac",
    "ad": "Miraç Kandili",
    "tarih": "4 Ocak",
    "renk": "#1F6FEB",
    "kok": "صلي",
    "turev": [
      {
        "ar": "صَلَّى",
        "tr": "Namaz kıldı / Dua etti",
        "kisa": "Namaz kıldı"
      },
      {
        "ar": "يُصَلِّي",
        "tr": "Namaz kılar / Kılıyor",
        "kisa": "Namaz kılar"
      },
      {
        "ar": "مُصَلٍّ",
        "tr": "Namaz kılan",
        "kisa": "Namaz kılan"
      },
      {
        "ar": "مُصَلًّى",
        "tr": "Namazgâh / Namaz kılınan yer",
        "kisa": "Namazgâh"
      }
    ],
    "cumleler": [
      {
        "ar": "صَلِّ صَلَاتَكَ",
        "tr": "Namazını kıl.",
        "kaynak": ""
      },
      {
        "ar": "هُوَ مُصَلٍّ خَاشِعٌ",
        "tr": "O, huşû içinde namaz kılan biridir.",
        "kaynak": ""
      },
      {
        "ar": "تَوَضَّأَ لِلصَّلَاةِ",
        "tr": "Namaz için abdest aldı.",
        "kaynak": ""
      }
    ],
    "not": "Miraç gecesinin hediyesi namazdır. Salât kelimesi hem namaz hem dua demek."
  },
  {
    "id": "berat",
    "ad": "Berat Kandili",
    "tarih": "22 Ocak",
    "renk": "#8E44AD",
    "kok": "عفو",
    "turev": [
      {
        "ar": "عَفَا",
        "tr": "Affetti / Bağışladı / Silip yok etti",
        "kisa": "Affetti"
      },
      {
        "ar": "يَعْفُو",
        "tr": "Affeder / Bağışlar",
        "kisa": "Affeder"
      },
      {
        "ar": "عَافَى",
        "tr": "Afiyet verdi / İyileştirdi",
        "kisa": "Afiyet verdi"
      }
    ],
    "cumleler": [
      {
        "ar": "عَفَا اللهُ عَنْكَ",
        "tr": "Allah seni affetsin.",
        "kaynak": "Tevbe Suresi, 43"
      },
      {
        "ar": "وَيَعْفُو عَنْ كَثِيرٍ",
        "tr": "Çoğunu da affeder (görmezden gelir).",
        "kaynak": "Şûrâ Suresi, 30"
      },
      {
        "ar": "عَافَى اللهُ المَرِيضَ",
        "tr": "Allah hastaya afiyet verdi.",
        "kaynak": ""
      }
    ],
    "not": "Berat gecesi af gecesidir. Afv kökü hem bağışlamayı hem şifayı (afiyet) anlatır."
  },
  {
    "id": "ramazan",
    "ad": "Ramazan Ayı Başlıyor",
    "tarih": "8 Şubat",
    "renk": "#16A085",
    "kok": "صوم",
    "turev": [
      {
        "ar": "صَامَ",
        "tr": "Oruç tuttu",
        "kisa": "Oruç tuttu"
      },
      {
        "ar": "يَصُومُ",
        "tr": "Oruç tutar",
        "kisa": "Oruç tutar"
      },
      {
        "ar": "صَوْم",
        "tr": "Oruç",
        "kisa": "Oruç"
      },
      {
        "ar": "صَائِم",
        "tr": "Oruçlu, oruç tutan",
        "kisa": "Oruçlu, oruç tutan"
      }
    ],
    "cumleler": [
      {
        "ar": "صَامَ المُسْلِمُونَ رَمَضَانَ",
        "tr": "Müslümanlar ramazanda oruç tuttu.",
        "kaynak": ""
      },
      {
        "ar": "يَصُومُ أَبِي كُلَّ اثْنَيْنِ",
        "tr": "Babam her pazartesi oruç tutar.",
        "kaynak": ""
      },
      {
        "ar": "الصَّائِمُ يُفْطِرُ عِنْدَ الغُرُوبِ",
        "tr": "Oruçlu kişi gün batımında iftar eder.",
        "kaynak": ""
      }
    ],
    "not": "Savm \"tutmak, kendini alıkoymak\" demek. Oruç, dilin ve elin de tutulmasıdır."
  },
  {
    "id": "kadir",
    "ad": "Kadir Gecesi",
    "tarih": "5 Mart",
    "renk": "#6C3483",
    "kok": "قدر",
    "turev": [
      {
        "ar": "قَدَرَ",
        "tr": "Ölçtü / Güç yetirdi",
        "kisa": "Ölçtü"
      },
      {
        "ar": "قُدْرَة",
        "tr": "Kudret / Güç",
        "kisa": "Kudret"
      },
      {
        "ar": "قَدَّرَ",
        "tr": "Takdir etti / Değer biçti",
        "kisa": "Takdir etti"
      },
      {
        "ar": "قَادِر",
        "tr": "Kadir / Gücü yeten",
        "kisa": "Kadir"
      },
      {
        "ar": "مِقْدَار",
        "tr": "Miktar / Ölçü",
        "kisa": "Miktar"
      },
      {
        "ar": "قَدَر",
        "tr": "Kader / Ölçü",
        "kisa": "Kader"
      }
    ],
    "cumleler": [
      {
        "ar": "قَدِّرْ جُهُودَ الآخَرِينَ",
        "tr": "Başkalarının çabalarını takdir et.",
        "kaynak": ""
      },
      {
        "ar": "يُقَدِّرُ النَّاسُ عَمَلَهُ",
        "tr": "İnsanlar onun çalışmasını takdir ediyor.",
        "kaynak": ""
      },
      {
        "ar": "قُدْرَةُ اللهِ لَا حُدُودَ لَهَا",
        "tr": "Allah'ın kudretinin (gücünün) sınırı yoktur.",
        "kaynak": ""
      }
    ],
    "not": "Kadir; kudret, takdir, miktar ve kader ile aynı kökten. Bin aydan hayırlı gecenin adı \"ölçü\"den geliyor."
  },
  {
    "id": "bayram-ramazan",
    "ad": "Ramazan Bayramı",
    "tarih": "9 – 11 Mart",
    "renk": "#F39C12",
    "kok": "فطر",
    "turev": [
      {
        "ar": "أَفْطَرَ",
        "tr": "Orucunu açtı, iftar etti; kahvaltı yaptı",
        "kisa": "Orucunu açtı, iftar etti"
      },
      {
        "ar": "فَطُور",
        "tr": "Kahvaltı; iftar yemeği",
        "kisa": "Kahvaltı"
      },
      {
        "ar": "فِطْرَة",
        "tr": "Fıtrat: yaratılıştan gelen temiz hâl",
        "kisa": "Fıtrat: yaratılıştan gelen temiz hâl"
      },
      {
        "ar": "يُفْطِرُ",
        "tr": "İftar eder, orucunu açar",
        "kisa": "İftar eder, orucunu açar"
      }
    ],
    "cumleler": [
      {
        "ar": "أَفْطَرْنَا عَلَى تَمْرٍ وَمَاءٍ",
        "tr": "Hurma ve suyla iftar ettik.",
        "kaynak": ""
      },
      {
        "ar": "دَعَانَا الجَارُ إِلَى الإِفْطَارِ",
        "tr": "Komşu bizi iftara davet etti.",
        "kaynak": ""
      },
      {
        "ar": "أَفْطِرْ عَلَى تَمْرٍ إِنْ وَجَدْتَ",
        "tr": "Bulursan hurmayla iftar et.",
        "kaynak": ""
      }
    ],
    "not": "İftar, fıtır sadakası ve fıtrat aynı kökten: yarmak, açmak, ilk yaratılış."
  },
  {
    "id": "yesilay",
    "ad": "Yeşilay Haftası",
    "tarih": "1 – 7 Mart",
    "renk": "#27AE60",
    "kok": "صحح",
    "turev": [
      {
        "ar": "صِحَّة",
        "tr": "Sağlık; doğruluk",
        "kisa": "Sağlık"
      },
      {
        "ar": "صَحِيح",
        "tr": "Doğru, sahih; sağlıklı",
        "kisa": "Doğru, sahih"
      },
      {
        "ar": "صَحَّحَ",
        "tr": "Düzeltti, tashih etti",
        "kisa": "Düzeltti, tashih etti"
      },
      {
        "ar": "تَصْحِيح",
        "tr": "Düzeltme, tashih",
        "kisa": "Düzeltme, tashih"
      },
      {
        "ar": "مُصَحَّح",
        "tr": "Düzeltilmiş",
        "kisa": "Düzeltilmiş"
      }
    ],
    "cumleler": [
      {
        "ar": "صَحِيحٌ، هَذَا هُوَ الجَوَابُ",
        "tr": "Doğru, cevap budur.",
        "kaynak": ""
      },
      {
        "ar": "صَحَّحَ المُعَلِّمُ أَخْطَاءَ الطُّلَّابِ",
        "tr": "Öğretmen öğrencilerin hatalarını düzeltti.",
        "kaynak": ""
      },
      {
        "ar": "تَصْحِيحُ الأَوْرَاقِ يَسْتَغْرِقُ وَقْتًا",
        "tr": "Kâğıtları düzeltmek zaman alıyor.",
        "kaynak": ""
      }
    ],
    "not": "Sıhhat ile sahih aynı kök: sağlam olmak. Sağlıklı beden de doğru bilgi de \"sahih\"tir."
  },
  {
    "id": "kutuphane",
    "ad": "Kütüphane Haftası",
    "tarih": "Mart · son hafta",
    "renk": "#0B7285",
    "kok": "كتب",
    "turev": [
      {
        "ar": "كَتَبَ",
        "tr": "Yazdı",
        "kisa": "Yazdı"
      },
      {
        "ar": "كِتَاب",
        "tr": "Kitap",
        "kisa": "Kitap"
      },
      {
        "ar": "يَكْتُبُ",
        "tr": "Yazıyor",
        "kisa": "Yazıyor"
      },
      {
        "ar": "كَاتِب",
        "tr": "Yazar / Katip",
        "kisa": "Yazar"
      },
      {
        "ar": "مَكْتُوب",
        "tr": "Mektup",
        "kisa": "Mektup"
      }
    ],
    "cumleler": [
      {
        "ar": "كَتَبَ رِسَالَةً",
        "tr": "Bir mektup yazdı.",
        "kaynak": ""
      },
      {
        "ar": "يَكْتُبُ بِالْقَلَمِ",
        "tr": "Kalemle yazıyor.",
        "kaynak": ""
      },
      {
        "ar": "هُوَ كَاتِبٌ مَشْهُورٌ",
        "tr": "O meşhur bir yazardır.",
        "kaynak": ""
      }
    ],
    "not": "Kitap, kâtip, mektup, mektep… Hepsi \"yazmak\" kökünden. Kütüphane bu kökün evi."
  },
  {
    "id": "canakkale",
    "ad": "18 Mart Çanakkale Zaferi",
    "tarih": "18 Mart",
    "renk": "#A93226",
    "kok": "شهد",
    "turev": [
      {
        "ar": "شَهِدَ",
        "tr": "Şahit oldu / Gördü",
        "kisa": "Şahit oldu"
      },
      {
        "ar": "يَشْهَدُ",
        "tr": "Şahit olur / Görüyor",
        "kisa": "Şahit olur"
      },
      {
        "ar": "شَهِيد",
        "tr": "Şehit / Şahit",
        "kisa": "Şehit"
      }
    ],
    "cumleler": [
      {
        "ar": "يَشْهَدُ بِالْحَقِّ",
        "tr": "Gerçeğe şahitlik ediyor.",
        "kaynak": ""
      },
      {
        "ar": "اِشْهَدْ بِالْعَدْلِ",
        "tr": "Adaletle şahit ol.",
        "kaynak": ""
      },
      {
        "ar": "شَهِدَ عَلَى الحَادِثِ",
        "tr": "Olaya şahit oldu.",
        "kaynak": ""
      }
    ],
    "not": "Şehit ile şahit aynı kökten: görmek, tanıklık etmek. Şehit, hakikate tanıklık edendir."
  },
  {
    "id": "cocuk",
    "ad": "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
    "tarih": "23 Nisan",
    "renk": "#EE5253",
    "kok": "طفل",
    "turev": [
      {
        "ar": "طِفْل",
        "tr": "Çocuk",
        "kisa": "Çocuk"
      },
      {
        "ar": "طُفُولَة",
        "tr": "Çocukluk (masdar)",
        "kisa": "Çocukluk"
      },
      {
        "ar": "أَطْفَال",
        "tr": "Çocuklar (kırık çoğul: أَفْعَال)",
        "kisa": "Çocuklar"
      }
    ],
    "cumleler": [
      {
        "ar": "الطُّفُولَةُ أَجْمَلُ زَمَنٍ",
        "tr": "Çocukluk en güzel zamandır.",
        "kaynak": ""
      },
      {
        "ar": "عَلَاءُ الدِّينِ طِفْلٌ صَغِيرٌ",
        "tr": "Alâeddin küçük bir çocuktur.",
        "kaynak": ""
      }
    ],
    "not": "Tıfıl \"çocuk\", tufûlet \"çocukluk\", atfâl \"çocuklar\". Üç kelime, tek kök."
  },
  {
    "id": "kurban",
    "ad": "Kurban Bayramı",
    "tarih": "16 – 19 Mayıs",
    "renk": "#B7791F",
    "kok": "ضحي",
    "turev": [
      {
        "ar": "أَضْحَى",
        "tr": "Kurban (عِيدُ الأَضْحَى: Kurban Bayramı)",
        "kisa": "Kurban"
      },
      {
        "ar": "أُضْحِيَة",
        "tr": "Kurbanlık hayvan",
        "kisa": "Kurbanlık hayvan"
      },
      {
        "ar": "ضَحَّى",
        "tr": "Kurban kesti; feda etti",
        "kisa": "Kurban kesti"
      },
      {
        "ar": "تَضْحِيَة",
        "tr": "Fedakârlık; kurban kesme (masdar)",
        "kisa": "Fedakârlık"
      }
    ],
    "cumleler": [
      {
        "ar": "ضَحَّى الحَاجُّ بِالْخَرُوفِ",
        "tr": "Hacı koyunu kurban etti.",
        "kaynak": ""
      },
      {
        "ar": "التَّضْحِيَةُ مِنْ أَجْلِ الوَطَنِ شَرَفٌ",
        "tr": "Vatan uğruna fedakârlık şereftir.",
        "kaynak": ""
      },
      {
        "ar": "لِلْمُسْلِمِينَ عِيدَانِ: عِيدُ الفِطْرِ وَعِيدُ الأَضْحَى",
        "tr": "Müslümanların iki bayramı vardır: Ramazan Bayramı ve Kurban Bayramı.",
        "kaynak": ""
      }
    ],
    "not": "Kurban, \"yaklaşmak\" kökünden: yakınlık kurmanın adı. Adha ise kuşluk vaktini anlatır."
  }
];
