/* ÜRETİLEN DOSYA — elle düzenlemeyin.
   Kaynak: _kaynak/uretici/konuAnlatim.py (Arapça metinler kod noktalarından)
   KONU_ANLATIM: alfabe.html alt şeridindeki kutuların konu penceresi.
   Pencereyi açan arayüz: okumayazma/alfabe_konu.js */
const KONU_ANLATIM = {
  "Tâ-i Merbûta": {
    "ar": "ة",
    "ozet": "Tâ-i merbûta \"bağlı te\" demektir: he (ه) harfinin üstüne iki nokta konarak yazılır ve yalnız kelimenin SONUNDA bulunur. Çoğu zaman kelimeyi dişil (müennes) yapar: مُعَلِّم bir erkek öğretmen, مُعَلِّمَة bir bayan öğretmen. Üzerinde durulduğunda hafif bir \"h\" gibi okunur; cümle içinde geçilerek okunduğunda ise \"t\" sesi verir. Kelime ikil ya da çoğul yapıldığında bu kapalı te açılır, apaçık bir ت olur.",
    "bilgi": [
      "Yalnız kelime sonunda bulunur; kelimenin başında ya da ortasında yazılmaz.",
      "Kendinden önceki harfe bitişiyorsa ـة, bitişmiyorsa ة yazılır.",
      "Durulduğunda (vakf) ه gibi, geçildiğinde (vasl) ت gibi okunur.",
      "Çoğunlukla müenneslik (dişillik) alâmetidir: مَدْرَسَة okul, فَاطِمَة Fâtıma.",
      "İkil ve cemi müennes yapılırken açık te'ye (ت) döner.",
      "Tenvin alırsa işaret doğrudan onun üstüne gelir: مُسْلِمَةٌ · مُسْلِمَةً."
    ],
    "donusum": {
      "baslik": "Tekilden ikile, ikilden cemi müennese",
      "not": "Gövde değişmiyor; değişen yalnız son: kapalı te (ة) açılıyor, ikilde تَانِ, cemi müenneste ات oluyor.",
      "satirlar": [
        {
          "etiket": "Tekil",
          "govde": "مُعَلِّمَ",
          "son": "ة",
          "okunus": "muallimetun",
          "tr": "bir bayan öğretmen"
        },
        {
          "etiket": "İkil",
          "govde": "مُعَلِّمَ",
          "son": "تَانِ",
          "okunus": "muallimetâni",
          "tr": "iki bayan öğretmen"
        },
        {
          "etiket": "Cemi müennes",
          "govde": "مُعَلِّمَ",
          "son": "ات",
          "okunus": "muallimât",
          "tr": "bayan öğretmenler"
        }
      ]
    },
    "ornekler": [
      {
        "ar": "مَدْرَسَة",
        "tr": "okul"
      },
      {
        "ar": "فَاطِمَة",
        "tr": "Fâtıma"
      },
      {
        "ar": "مُسْلِمَةٌ",
        "tr": "müslüman (bir hanım)"
      }
    ]
  },
  "Uzatma harfleri": {
    "ar": "ا و ي",
    "ozet": "Elif, vav ve ye bazen kendi sesini vermez; kendinden önceki harekeyi bir elif miktarı UZATIR. Üstünü elif, ötreyi vav, esreyi ye uzatır. Bu görevdeki üç harfe med (uzatma) harfleri denir ve kendileri daima harekesizdir. Harekeli oldukları yerde ise uzatma değil, kendi sesleriyle okunurlar: وَلَد (veled), يَد (yed).",
    "bilgi": [
      "Elif ا üstünlü harfi uzatır: قَالَ (kâle).",
      "Vav و ötreli harfi uzatır: يَقُولُ (yekûlü).",
      "Ye ي esreli harfi uzatır: قِيلَ (kîle).",
      "Uzatma harfinin kendisi harekesizdir; kendinden önceki harfin harekesi ona uyar.",
      "Uzatma bir elif miktarıdır, yani iki hareke süresi kadar.",
      "Elif her zaman uzatma harfidir; vav ile ye harekeliyken uzatmaz."
    ],
    "ornekler": [
      {
        "ar": "قَالَ",
        "tr": "dedi"
      },
      {
        "ar": "يَقُولُ",
        "tr": "diyor"
      },
      {
        "ar": "قِيلَ",
        "tr": "denildi"
      }
    ]
  },
  "Cezim – Şedde": {
    "ar": "ــــْ  ــــّ",
    "ozet": "Cezim (sükûn) harfin harekesiz olduğunu gösterir: harf kendinden önceki harekeye yapışarak okunur, مَكْتَب (mek-teb) gibi. Şedde ise aynı harfin iki kez yazılmak yerine bir kez yazılıp katmerli okunduğunu gösterir: önce sâkin, sonra harekeli — مُدَرِّس (müder-ris) gibi.",
    "bilgi": [
      "Cezimli (sâkin) harf hareke almaz; kendinden önceki harfle birlikte okunur.",
      "Kelime sâkin harfle BAŞLAMAZ; cezim ancak ikinci harften itibaren bulunur.",
      "Şedde, biri sâkin biri harekeli iki aynı harfin tek harfte birleşmesidir.",
      "Şeddeli harfin harekesi şeddenin üstüne yazılır; esre çoğu kez şeddenin altına konur.",
      "Şeddeli harf okunurken bir an bekletilir, ses katmerlenir."
    ],
    "ornekler": [
      {
        "ar": "مَكْتَب",
        "tr": "yazıhane, büro"
      },
      {
        "ar": "مُدَرِّس",
        "tr": "öğretmen"
      },
      {
        "ar": "رَبَّنَا",
        "tr": "Rabbimiz"
      }
    ]
  },
  "Tenvin": {
    "ar": "ــــً  ــــٍ  ــــٌ",
    "ozet": "Tenvin, kelimenin sonundaki harekenin iki kez yazılmasıdır; sonuna sâkin bir nun (ن) eklenmiş gibi okunur: \"-en\", \"-in\", \"-un\". Yalnız kelime sonunda bulunur ve kelimenin belirsiz (nekre) olduğunu gösterir: كِتَابٌ bir kitap.",
    "bilgi": [
      "İki üstün ــً \"-en\", iki esre ــٍ \"-in\", iki ötre ــٌ \"-un\" diye okunur.",
      "Tenvin belirsizlik (nekrelik) alâmetidir; belirtili ال takısıyla bir arada bulunmaz.",
      "Yazıda görünen bir nun yoktur; nun sesi yalnız okuyuşta vardır.",
      "İki üstün çoğu kelimede bir elif üzerine yazılır: كِتَابًا.",
      "Tâ-i merbûta ve hemzeden sonra bu elif yazılmaz: مُسْلِمَةً.",
      "Üzerinde durulduğunda iki üstün bir elif miktarı uzatılarak okunur."
    ],
    "ornekler": [
      {
        "ar": "كِتَابٌ",
        "tr": "bir kitap (ötre)"
      },
      {
        "ar": "كِتَابًا",
        "tr": "bir kitabı (üstün)"
      },
      {
        "ar": "كِتَابٍ",
        "tr": "bir kitabın (esre)"
      }
    ]
  },
  "Harekeler": {
    "ar": "ــــَ  ــــِ  ــــُ",
    "ozet": "Arapçada kısa ünlüler harfin kendisinde değil, üstüne ve altına konan küçük işaretlerde durur. Üstün (fetha) \"e/a\", esre (kesra) \"i\", ötre (damme) \"u\" sesini verir: بَ be, بِ bi, بُ bu. Harekesi olan harfe müteharrik, harekesiz (cezimli) harfe sâkin denir.",
    "bilgi": [
      "Üstün ــَ harfin ÜSTÜNE eğik bir çizgidir.",
      "Esre ــِ harfin ALTINA konur.",
      "Ötre ــُ harfin üstüne küçük bir vav gibi yazılır.",
      "Her hareke bir KISA ünlüdür; uzatma harfiyle birleşince uzun ünlü olur.",
      "Harekeler kelimenin hem okunuşunu hem anlamını değiştirir, bu yüzden ders kitapları ve Kur'an harekeli yazılır."
    ],
    "ornekler": [
      {
        "ar": "بَ بِ بُ",
        "tr": "be · bi · bu"
      },
      {
        "ar": "كَتَبَ",
        "tr": "yazdı"
      },
      {
        "ar": "مَكْتَب",
        "tr": "yazıhane"
      }
    ]
  }
};
