/* ===========================================================================
   GÜNÜN SÖZÜ — ÂYET SEÇKİSİ        (üretilen dosya, ELLE DEĞİŞTİRME)
   ---------------------------------------------------------------------------
   _kaynak/uretici/ayetSecki.py üretir. Âyetin Arapçası ve meali sitenin
   kendi verisinden — degerler/kisasureler.js — KONUMSAL olarak kopyalanır;
   metne elle dokunulmaz. Seçkiyi değiştirmek için betikteki SECKI listesini
   düzenle ve betiği yeniden çalıştır.

     ar  âyetin Arapçası      s   meali
     n   sınıfa bağlayan not  k   kaynak (sure, âyet no)
     s2  simge anahtarı (merak/gunsozu.js içindeki havuzdan)
   =========================================================================== */
window.KIDEF_SOZ_AYET = [
  { ar: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    s: "Yaratan Rabbinin adıyla oku!",
    n: "Vahyin ilk emri okumak: dersin de ilk işi.",
    k: "Alak Suresi, 1. ayet", s2: "kitap" },
  { ar: "اقْرَأْ وَرَبُّكَ الْأَكْرَمُ",
    s: "Oku! Rabbin en cömert olandır.",
    n: "Öğrenmek isteyene verilen hiç eksilmez.",
    k: "Alak Suresi, 3. ayet", s2: "yildiz" },
  { ar: "الَّذِي عَلَّمَ بِالْقَلَمِ",
    s: "O, kalemle (yazmayı) öğretendir.",
    n: "Kalemle öğretmek, bu mesleğin ta kendisi.",
    k: "Alak Suresi, 4. ayet", s2: "kalem" },
  { ar: "عَلَّمَ الْإِنْسَانَ مَا لَمْ يَعْلَمْ",
    s: "İnsana bilmediğini öğretti.",
    n: "Bilmemek başlangıçtır; öğrenmek yolculuktur.",
    k: "Alak Suresi, 5. ayet", s2: "ampul" },
  { ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    s: "Şüphesiz, zorlukla beraber bir kolaylık vardır.",
    n: "Zor konunun hemen yanında kolayı duruyor.",
    k: "İnşirah Suresi, 5. ayet", s2: "merdiven" },
  { ar: "فَإِذَا فَرَغْتَ فَانْصَبْ",
    s: "Öyleyse, bir işi bitirince (hemen) başka bir işe koyul.",
    n: "Bir iş bitince durmak değil, yenisine geçmek.",
    k: "İnşirah Suresi, 7. ayet", s2: "disli" },
  { ar: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
    s: "Rabbin seni terk etmedi ve sana darılmadı.",
    n: "Zorlandığın gün yalnız olmadığını hatırla.",
    k: "Duha Suresi, 3. ayet", s2: "kalp" },
  { ar: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ",
    s: "Öyleyse yetimi sakın ezme.",
    n: "Sınıfta en kırılgan olanı koruman gerek.",
    k: "Duha Suresi, 9. ayet", s2: "kalkan" },
  { ar: "وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ",
    s: "İsteyeni sakın azarlama.",
    n: "Soru soranı asla azarlama; soru öğrenmenin kapısıdır.",
    k: "Duha Suresi, 10. ayet", s2: "konusma" },
  { ar: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ",
    s: "Ve Rabbinin nimetini anlat.",
    n: "İyi olanı anlatmak da bir görevdir.",
    k: "Duha Suresi, 11. ayet", s2: "konusma" },
  { ar: "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
    s: "Biz insanı en güzel biçimde yarattık.",
    n: "Her öğrenci en güzel biçimde yaratılmış biridir.",
    k: "Tin Suresi, 4. ayet", s2: "yildiz" },
  { ar: "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ",
    s: "Kim zerre miktarı hayır işlemişse onu görür.",
    n: "Küçük görünen çaba da karşılıksız kalmaz.",
    k: "Zilzal Suresi, 7. ayet", s2: "damla" },
  { ar: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    s: "Ancak iman edenler, salih ameller işleyenler, birbirlerine hakkı tavsiye edenler ve birbirlerine sabrı tavsiye edenler başka.",
    n: "Hakkı ve sabrı tavsiye etmek: sınıfın ortak işi.",
    k: "Asr Suresi, 3. ayet", s2: "eller" },
  { ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    s: "Bizi doğru yola ilet.",
    n: "Her dersin bir yönü, her yolun bir rehberi var.",
    k: "Fatiha Suresi, 6. ayet", s2: "pusula" },
  { ar: "أَلْهَاكُمُ التَّكَاثُرُ",
    s: "Çoklukla övünmek sizi oyaladı.",
    n: "Çokluk yarışı oyalar; asıl soru ne öğrendiğin.",
    k: "Tekasür Suresi, 1. ayet", s2: "kumsaati" },
  { ar: "الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ",
    s: "O (Rab) ki, onları açlıktan doyurdu ve onları korkudan emin kıldı.",
    n: "Güven ve doyum, öğrenmenin önkoşulu.",
    k: "Kureyş Suresi, 4. ayet", s2: "testi" }
];
