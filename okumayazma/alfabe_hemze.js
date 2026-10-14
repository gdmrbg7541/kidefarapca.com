/* ÜRETİLEN DOSYA — elle düzenlemeyin.
   Kaynak: _kaynak/uretici/hemzeBilgi.py (Arapça metinler kod noktalarından kurulur)
   HEMZE_BILGI: hemze sekmesinin metinleri ve kürsü grupları.
   Kalem verisi ayrı dosyada: okumayazma/alfabe_hemze_yazim.js */
const HEMZE_BILGI = {
  "ad": "Hemze",
  "arapca": "ء",
  "ozet": "Hemze sessiz bir harftir; elif ise uzatma harfidir. Yazıda hemze çoğu zaman bir KÜRSÜ harfine (elif, vav, ye) oturur — kürsü okunmaz, yalnızca hemzeyi taşır.",
  "mahrec": "Boğazın en dibinden (aksa'l-halk) çıkar; ses yolunun bir an kapanıp açılmasıyla oluşan keskin bir kesme sesidir. He (ه) harfi de aynı bölgeden çıkar.",
  "yazilis": "Hemze küçük bir ع başı gibidir: kalem sağ üstten sola iner, kısa bir dönüşle sağa çıkar, sonra sola doğru kuyrukla biter. Kürsülü biçimlerde ÖNCE kürsü harfi (elif, vav, ye) yazılır; hemze EN SON konur.",
  "elifNotu": "Elif tek başına ses vermez: kendinden önceki üstünlü (fethalı) harfi bir elif miktarı uzatır. Aynı şekilde vav (و) ötreli, ye (ي) esreli harfi uzatır — bu üçüne MED (uzatma) harfleri denir. Elif ayrıca hemzenin en çok kullanılan kürsüsüdür (أ إ آ); orada uzatma değil, hemzeyi taşıma görevi görür.",
  "gruplar": [
    {
      "id": "kursusuz",
      "ad": "Kürsüsüz hemze",
      "ar": "ء",
      "kural": "Hemze bir harfe binmeden satır üstünde tek başına yazılır. Çoğunlukla kendinden önce uzun bir ses ya da sükûnlu bir harf varsa böyle olur.",
      "bicimler": [
        {
          "k": "kursusuz",
          "form": "n",
          "etiket": "Yalın",
          "ornek": {
            "ar": "شَيْء",
            "tr": "şey"
          }
        }
      ]
    },
    {
      "id": "elifUstu",
      "ad": "Elif üstünde",
      "ar": "أ",
      "kural": "En kuvvetli hareke FETHA (üstün) ise hemze elif kürsüsüne biner ve elifin ÜSTÜNE konur. Kelime başındaki üstünlü ve ötreli hemze daima böyle yazılır.",
      "bicimler": [
        {
          "k": "elifUstu_s",
          "form": "s",
          "etiket": "Sonda",
          "ornek": {
            "ar": "نَبَأ",
            "tr": "haber"
          }
        },
        {
          "k": "elifUstu_n",
          "form": "n",
          "etiket": "Yalın",
          "ornek": {
            "ar": "أَكَلَ",
            "tr": "yedi"
          }
        }
      ]
    },
    {
      "id": "elifAlti",
      "ad": "Elif altında",
      "ar": "إ",
      "kural": "Kelime başındaki hemze KESRALI (esreli) ise elifin ALTINA yazılır; esre de hemzenin altına konur. Bu biçim yalnız kelime başında bulunur.",
      "bicimler": [
        {
          "k": "elifAlti_n",
          "form": "n",
          "etiket": "Yalın",
          "ornek": {
            "ar": "إِيمَان",
            "tr": "iman"
          }
        }
      ]
    },
    {
      "id": "vavUstu",
      "ad": "Vav üstünde",
      "ar": "ؤ",
      "kural": "En kuvvetli hareke DAMME (ötre) ise hemze vav kürsüsüne biner. Vav okunmaz, yalnız hemzeyi taşır.",
      "bicimler": [
        {
          "k": "vavUstu_s",
          "form": "s",
          "etiket": "Sonda",
          "ornek": {
            "ar": "لُؤْلُؤ",
            "tr": "inci"
          }
        },
        {
          "k": "vavUstu_n",
          "form": "n",
          "etiket": "Yalın",
          "ornek": {
            "ar": "مُؤْمِن",
            "tr": "mümin"
          }
        }
      ]
    },
    {
      "id": "yeUstu",
      "ad": "Ye üstünde",
      "ar": "ئ",
      "kural": "En kuvvetli hareke KESRA (esre) ise hemze ye kürsüsüne biner; kürsü olan yenin NOKTALARI YAZILMAZ. Bu kürsü iki yana da bitişir.",
      "bicimler": [
        {
          "k": "yeUstu_b",
          "form": "b",
          "etiket": "Başta",
          "ornek": {
            "ar": "قَائِل",
            "tr": "söyleyen"
          }
        },
        {
          "k": "yeUstu_o",
          "form": "o",
          "etiket": "Ortada",
          "ornek": {
            "ar": "بِئْر",
            "tr": "kuyu"
          }
        },
        {
          "k": "yeUstu_s",
          "form": "s",
          "etiket": "Sonda",
          "ornek": {
            "ar": "شَاطِئ",
            "tr": "kıyı"
          }
        },
        {
          "k": "yeUstu_n",
          "form": "n",
          "etiket": "Yalın",
          "ornek": {
            "ar": "",
            "tr": "kelimede hemen hiç kullanılmaz"
          }
        }
      ]
    },
    {
      "id": "medli",
      "ad": "Medli elif",
      "ar": "آ",
      "kural": "Hemzeden sonra uzatma elifi gelirse ikisi tek harfte birleşir, üstüne med (~) işareti konur; bir elif miktarı uzatılarak \"â\" diye okunur.",
      "bicimler": [
        {
          "k": "medli_s",
          "form": "s",
          "etiket": "Sonda",
          "ornek": {
            "ar": "مَآب",
            "tr": "dönülecek yer"
          }
        },
        {
          "k": "medli_n",
          "form": "n",
          "etiket": "Yalın",
          "ornek": {
            "ar": "آمَنَ",
            "tr": "iman etti"
          }
        }
      ]
    }
  ],
  "ozellikler": [
    "Hemze SESSİZ bir harftir; elif (ا) ise yalnız uzatma harfidir. İkisi aynı şey değildir.",
    "Mahreci boğazın en dibidir; sesi keskin ve nettir.",
    "Yazıda hemze çoğu zaman bir kürsüye oturur: elif, vav ya da ye. Kürsü harfi okunmaz.",
    "Kürsü, harekelerin kuvvet sırasına göre seçilir: kesra (ye) → damme (vav) → fetha (elif) → sükûn (kürsüsüz).",
    "Kelime başındaki hemze her zaman elif kürsüsündedir: üstünlü/ötreli ise üstte (أ), esreli ise altta (إ).",
    "Ye kürsüsünün noktaları yazılmaz (ئ).",
    "Hemze-i kat' her durumda okunur (أَكْرَمَ); hemze-i vasl ise söze başlarken okunur, araya girince düşer (الْبَيْت).",
    "Medli elif (آ) hemze ile uzatma elifinin birleşmiş hâlidir: قُرْآن kelimesinde olduğu gibi."
  ]
};
