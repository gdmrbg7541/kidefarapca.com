/* ===========================================================
   Bilgi Yarışması — Vezinler & Kelimeler
   Firebase 8.10.1 (compat) · proje: kidefarapca-98f9c
   Mod 1 (ADMIN): index girişinde teacher/admin ise yönetim.
   Mod 2 (TAKIM): ?oda=..&takim=.. linkiyle anonim katılım.
   Canlı oyun döngüsü: admin kontrollü, sunucu-zamanlı geri sayım,
   dijital cevap, öğrenci cihazında doğru/yanlış GÖRÜNMEZ; doğru/yanlış
   + puan yalnız admin (yansıtılan) ekranda. Puan zorluğa göre.
   =========================================================== */

/* ---------------- Firebase ---------------- */
const firebaseConfig = {
    apiKey: "AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w",
    authDomain: "kidefarapca-98f9c.firebaseapp.com",
    projectId: "kidefarapca-98f9c",
    storageBucket: "kidefarapca-98f9c.firebasestorage.app",
    messagingSenderId: "503317118211",
    appId: "1:503317118211:web:a9c8cf15b854597e0b3d36",
    measurementId: "G-HYY6T2EDKY"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const KOLEKSIYON = "bilgiYarismasi";
const SORU_SURESI = 60;      // saniye
const TUR_SORU_SAYISI = 20;  // varsayılan soru sayısı
const SORU_SAYI_SECENEK = [10, 15, 20, 25, 50];
const TOPLAM_PUAN = 1000;    // ana tur toplam puanı (yedekler hariç)
const ZAMAN_PAYI = 0.15;     // puanın en fazla %15'i hızdan (çok fazla değil)
const PUAN = { 1: 10, 2: 20, 3: 30 };  // (eski; artık 1000 üzerinden hesaplanır)

/* ---------------- Seed soru havuzu ---------------- */
const SORULAR = [
  {"id":1,"tip":"vezin","zorluk":1,"soru":"«كاتِب» (kâtip / yazar) kelimesi hangi vezindedir?","secenekler":["فاعِل","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فَعيل"],"dogru":0,"arapca":"كاتِب","arSecenek":true},
  {"id":2,"tip":"vezin","zorluk":1,"soru":"«عالِم» (âlim / bilgin) kelimesi hangi vezindedir?","secenekler":["فاعِل","اِسْتِفْعال","تَفْعيل","فَعيل","فَعّال"],"dogru":0,"arapca":"عالِم","arSecenek":true},
  {"id":3,"tip":"vezin","zorluk":1,"soru":"«حاكِم» (hâkim / yargıç) kelimesi hangi vezindedir?","secenekler":["فاعِل","فِعال","مَفْعول","مَفْعَل","مُفاعَلَة"],"dogru":0,"arapca":"حاكِم","arSecenek":true},
  {"id":4,"tip":"vezin","zorluk":1,"soru":"«طالِب» (tâlip / öğrenci) kelimesi hangi vezindedir?","secenekler":["فاعِل","فَعيل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"طالِب","arSecenek":true},
  {"id":5,"tip":"vezin","zorluk":1,"soru":"«صاحِب» (sâhip) kelimesi hangi vezindedir?","secenekler":["فاعِل","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"صاحِب","arSecenek":true},
  {"id":6,"tip":"vezin","zorluk":1,"soru":"«شاهِد» (şahit / tanık) kelimesi hangi vezindedir?","secenekler":["فاعِل","مَفْعَل","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال"],"dogru":0,"arapca":"شاهِد","arSecenek":true},
  {"id":7,"tip":"vezin","zorluk":1,"soru":"«عادِل» (âdil / adaletli) kelimesi hangi vezindedir?","secenekler":["فاعِل","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"عادِل","arSecenek":true},
  {"id":8,"tip":"vezin","zorluk":1,"soru":"«قادِر» (kâdir / güçlü) kelimesi hangi vezindedir?","secenekler":["فاعِل","اِسْتِفْعال","تَفْعيل","فَعيل","فَعّال"],"dogru":0,"arapca":"قادِر","arSecenek":true},
  {"id":9,"tip":"vezin","zorluk":1,"soru":"«مَكْتوب» (mektup / yazılmış) kelimesi hangi vezindedir?","secenekler":["مَفْعول","اِسْتِفْعال","تَفْعيل","فاعِل","فَعيل"],"dogru":0,"arapca":"مَكْتوب","arSecenek":true},
  {"id":10,"tip":"vezin","zorluk":1,"soru":"«مَعْلوم» (malum / bilinen) kelimesi hangi vezindedir?","secenekler":["مَفْعول","فِعال","مَفْعَل","مُفاعَلَة","مُفَعِّل"],"dogru":0,"arapca":"مَعْلوم","arSecenek":true},
  {"id":11,"tip":"vezin","zorluk":1,"soru":"«مَشْهور» (meşhur / ünlü) kelimesi hangi vezindedir?","secenekler":["مَفْعول","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فاعِل"],"dogru":0,"arapca":"مَشْهور","arSecenek":true},
  {"id":12,"tip":"vezin","zorluk":1,"soru":"«مَحْكوم» (mahkûm) kelimesi hangi vezindedir?","secenekler":["مَفْعول","مَفْعَل","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال"],"dogru":0,"arapca":"مَحْكوم","arSecenek":true},
  {"id":13,"tip":"vezin","zorluk":1,"soru":"«مَوْجود» (mevcut / var olan) kelimesi hangi vezindedir?","secenekler":["مَفْعول","فاعِل","فَعيل","فَعّال","فِعال"],"dogru":0,"arapca":"مَوْجود","arSecenek":true},
  {"id":14,"tip":"vezin","zorluk":1,"soru":"«مَقْصود» (maksut / kastedilen) kelimesi hangi vezindedir?","secenekler":["مَفْعول","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فاعِل"],"dogru":0,"arapca":"مَقْصود","arSecenek":true},
  {"id":15,"tip":"vezin","zorluk":1,"soru":"«مَظْلوم» (mazlum) kelimesi hangi vezindedir?","secenekler":["مَفْعول","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"مَظْلوم","arSecenek":true},
  {"id":16,"tip":"vezin","zorluk":1,"soru":"«مَجْهول» (meçhul / bilinmeyen) kelimesi hangi vezindedir?","secenekler":["مَفْعول","فَعّال","فِعال","مَفْعَل","مُفاعَلَة"],"dogru":0,"arapca":"مَجْهول","arSecenek":true},
  {"id":17,"tip":"vezin","zorluk":1,"soru":"«كَريم» (kerîm / cömert) kelimesi hangi vezindedir?","secenekler":["فَعيل","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"كَريم","arSecenek":true},
  {"id":18,"tip":"vezin","zorluk":1,"soru":"«رَحيم» (rahîm / merhametli) kelimesi hangi vezindedir?","secenekler":["فَعيل","فاعِل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"رَحيم","arSecenek":true},
  {"id":19,"tip":"vezin","zorluk":1,"soru":"«حَكيم» (hakîm / bilge) kelimesi hangi vezindedir?","secenekler":["فَعيل","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"حَكيم","arSecenek":true},
  {"id":20,"tip":"vezin","zorluk":1,"soru":"«عَظيم» (azîm / büyük) kelimesi hangi vezindedir?","secenekler":["فَعيل","اِسْتِفْعال","تَفْعيل","فاعِل","فَعّال"],"dogru":0,"arapca":"عَظيم","arSecenek":true},
  {"id":21,"tip":"vezin","zorluk":1,"soru":"«جَميل» (cemîl / güzel) kelimesi hangi vezindedir?","secenekler":["فَعيل","فاعِل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"جَميل","arSecenek":true},
  {"id":22,"tip":"vezin","zorluk":1,"soru":"«لَطيف» (latîf / hoş) kelimesi hangi vezindedir?","secenekler":["فَعيل","تَفْعيل","فاعِل","فَعّال","فِعال"],"dogru":0,"arapca":"لَطيف","arSecenek":true},
  {"id":23,"tip":"vezin","zorluk":1,"soru":"«سَليم» (selîm / sağlam) kelimesi hangi vezindedir?","secenekler":["فَعيل","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"سَليم","arSecenek":true},
  {"id":24,"tip":"vezin","zorluk":1,"soru":"«كِتاب» (kitap) kelimesi hangi vezindedir?","secenekler":["فِعال","تَفْعيل","فاعِل","فَعيل","فَعّال"],"dogru":0,"arapca":"كِتاب","arSecenek":true},
  {"id":25,"tip":"vezin","zorluk":1,"soru":"«حِساب» (hesap) kelimesi hangi vezindedir?","secenekler":["فِعال","فاعِل","فَعيل","فَعّال","مَفْعول"],"dogru":0,"arapca":"حِساب","arSecenek":true},
  {"id":26,"tip":"vezin","zorluk":1,"soru":"«نِظام» (nizam / düzen) kelimesi hangi vezindedir?","secenekler":["فِعال","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"نِظام","arSecenek":true},
  {"id":27,"tip":"vezin","zorluk":1,"soru":"«جِهاد» (cihat) kelimesi hangi vezindedir?","secenekler":["فِعال","فَعّال","مَفْعول","مَفْعَل","مُفاعَلَة"],"dogru":0,"arapca":"جِهاد","arSecenek":true},
  {"id":28,"tip":"vezin","zorluk":1,"soru":"«لِسان» (lisan / dil) kelimesi hangi vezindedir?","secenekler":["فِعال","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"لِسان","arSecenek":true},
  {"id":29,"tip":"vezin","zorluk":1,"soru":"«سِلاح» (silah) kelimesi hangi vezindedir?","secenekler":["فِعال","فاعِل","فَعيل","فَعّال","مَفْعول"],"dogru":0,"arapca":"سِلاح","arSecenek":true},
  {"id":30,"tip":"vezin","zorluk":1,"soru":"«مُعَلِّم» (muallim / öğretmen) kelimesi hangi vezindedir?","secenekler":["مُفَعِّل","مَفْعول","مَفْعَل","مُفاعَلَة","اِسْتِفْعال"],"dogru":0,"arapca":"مُعَلِّم","arSecenek":true},
  {"id":31,"tip":"vezin","zorluk":1,"soru":"«مُدَرِّس» (müderris) kelimesi hangi vezindedir?","secenekler":["مُفَعِّل","فاعِل","فَعيل","فَعّال","فِعال"],"dogru":0,"arapca":"مُدَرِّس","arSecenek":true},
  {"id":32,"tip":"vezin","zorluk":1,"soru":"«مُؤَذِّن» (müezzin) kelimesi hangi vezindedir?","secenekler":["مُفَعِّل","مَفْعَل","مُفاعَلَة","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"مُؤَذِّن","arSecenek":true},
  {"id":33,"tip":"vezin","zorluk":1,"soru":"«مُفَتِّش» (müfettiş) kelimesi hangi vezindedir?","secenekler":["مُفَعِّل","مَفْعَل","مُفاعَلَة","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"مُفَتِّش","arSecenek":true},
  {"id":34,"tip":"vezin","zorluk":1,"soru":"«مُقَدِّم» (mukaddim / sunan) kelimesi hangi vezindedir?","secenekler":["مُفَعِّل","مَفْعول","مَفْعَل","مُفاعَلَة","اِسْتِفْعال"],"dogru":0,"arapca":"مُقَدِّم","arSecenek":true},
  {"id":35,"tip":"vezin","zorluk":1,"soru":"«تَفْسير» (tefsir) kelimesi hangi vezindedir?","secenekler":["تَفْعيل","فاعِل","فَعيل","فَعّال","فِعال"],"dogru":0,"arapca":"تَفْسير","arSecenek":true},
  {"id":36,"tip":"vezin","zorluk":1,"soru":"«تَبْريك» (tebrik) kelimesi hangi vezindedir?","secenekler":["تَفْعيل","فَعيل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"تَبْريك","arSecenek":true},
  {"id":37,"tip":"vezin","zorluk":1,"soru":"«تَرْتيب» (tertip / düzen) kelimesi hangi vezindedir?","secenekler":["تَفْعيل","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"تَرْتيب","arSecenek":true},
  {"id":38,"tip":"vezin","zorluk":1,"soru":"«تَقْديم» (takdim / sunum) kelimesi hangi vezindedir?","secenekler":["تَفْعيل","فَعيل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"تَقْديم","arSecenek":true},
  {"id":39,"tip":"vezin","zorluk":1,"soru":"«تَبْليغ» (tebliğ) kelimesi hangi vezindedir?","secenekler":["تَفْعيل","اِسْتِفْعال","فاعِل","فَعيل","فَعّال"],"dogru":0,"arapca":"تَبْليغ","arSecenek":true},
  {"id":40,"tip":"vezin","zorluk":1,"soru":"«نَجّار» (neccar / marangoz) kelimesi hangi vezindedir?","secenekler":["فَعّال","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فاعِل"],"dogru":0,"arapca":"نَجّار","arSecenek":true},
  {"id":41,"tip":"vezin","zorluk":1,"soru":"«خَبّاز» (habbaz / fırıncı) kelimesi hangi vezindedir?","secenekler":["فَعّال","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فاعِل"],"dogru":0,"arapca":"خَبّاز","arSecenek":true},
  {"id":42,"tip":"vezin","zorluk":1,"soru":"«بَقّال» (bakkal) kelimesi hangi vezindedir?","secenekler":["فَعّال","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فاعِل"],"dogru":0,"arapca":"بَقّال","arSecenek":true},
  {"id":43,"tip":"vezin","zorluk":1,"soru":"«حَدّاد» (haddad / demirci) kelimesi hangi vezindedir?","secenekler":["فَعّال","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"حَدّاد","arSecenek":true},
  {"id":44,"tip":"vezin","zorluk":1,"soru":"«اِسْتِقْبال» (istikbal / karşılama) kelimesi hangi vezindedir?","secenekler":["اِسْتِفْعال","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"اِسْتِقْبال","arSecenek":true},
  {"id":45,"tip":"vezin","zorluk":1,"soru":"«اِسْتِقْلال» (istiklal / bağımsızlık) kelimesi hangi vezindedir?","secenekler":["اِسْتِفْعال","فِعال","مَفْعول","مَفْعَل","مُفاعَلَة"],"dogru":0,"arapca":"اِسْتِقْلال","arSecenek":true},
  {"id":46,"tip":"vezin","zorluk":1,"soru":"«اِسْتِعْمار» (istîmar / sömürge) kelimesi hangi vezindedir?","secenekler":["اِسْتِفْعال","مَفْعَل","مُفاعَلَة","مُفَعِّل","تَفْعيل"],"dogru":0,"arapca":"اِسْتِعْمار","arSecenek":true},
  {"id":47,"tip":"vezin","zorluk":1,"soru":"«مُكالَمَة» (mükâleme / konuşma) kelimesi hangi vezindedir?","secenekler":["مُفاعَلَة","فَعيل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"مُكالَمَة","arSecenek":true},
  {"id":48,"tip":"vezin","zorluk":1,"soru":"«مُحاسَبَة» (muhasebe) kelimesi hangi vezindedir?","secenekler":["مُفاعَلَة","فاعِل","فَعيل","فَعّال","فِعال"],"dogru":0,"arapca":"مُحاسَبَة","arSecenek":true},
  {"id":49,"tip":"vezin","zorluk":1,"soru":"«مَكْتَب» (mektep / yazıhane) kelimesi hangi vezindedir?","secenekler":["مَفْعَل","فَعّال","فِعال","مَفْعول","مُفاعَلَة"],"dogru":0,"arapca":"مَكْتَب","arSecenek":true},
  {"id":50,"tip":"vezin","zorluk":1,"soru":"«مَطْبَخ» (matbah / mutfak) kelimesi hangi vezindedir?","secenekler":["مَفْعَل","فَعيل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"مَطْبَخ","arSecenek":true}
];
const TIP_BILGI = {
  "kok":        { ad: "Kök Bulma",       emoji: "🌱" },
  "vezin":      { ad: "Vezin Bulma",     emoji: "⚖️" },
  "anlam":      { ad: "Anlam",           emoji: "💡" },
  "ters-vezin": { ad: "Kalıptan Üretme", emoji: "🔧" },
  "ayet":       { ad: "Ayet / Örnek",    emoji: "📖" },
  "cumle":      { ad: "Cümle",           emoji: "💬" },
  "gramer":     { ad: "Dilbilgisi",      emoji: "📝" }
};
const ZORLUK_AD = { 1: "Kolay", 2: "Orta", 3: "Zor" };
const SIK_RENK = ["#E74C3C", "#3498DB", "#F1C40F", "#27AE60", "#9B59B6"]; // A B C D E
const SEVIYE_ZORLUK = { kolay: 1, orta: 2, zor: 3 };

/* ---------------- Konular ----------------
   Yeni konu eklemek için bu diziye bir nesne ekleyin:
   { id: "benzersiz-id", ad: "Konu Adı", pdf: "PDF dosya adı.pdf", sorular: [ ...soru nesneleri... ] }
   • pdf: repo kökündeki PDF dosyasının adı (boş bırakılırsa indirme/önizleme pasif olur).
   • sorular: SORULAR ile aynı biçimde; boşsa o konuda yarışma başlatılamaz.                        */
const KONULAR = [
  { id: "vezinler", ad: "Vezinler", pdf: "Vezinler Bilgi Yarışması.pdf", sorular: SORULAR },
  { id: "kelimeler", ad: "Kelimeler", pdf: "", sorular: [
    {"id":1,"tip":"anlam","zorluk":1,"soru":"«مُنْذُ» ne demek?","secenekler":["-den beri","-den, hakkında (uzaklaşma)","-e kadar","içinde, -de/-da","-den, -dan (başlangıç/ayrılma)"],"dogru":0,"arapca":"مُنْذُ"},
    {"id":2,"tip":"anlam","zorluk":1,"soru":"«فِي» ne demek?","secenekler":["içinde, -de/-da","-den, -dan (başlangıç/ayrılma)","-den, hakkında (uzaklaşma)","-e kadar","-den beri"],"dogru":0,"arapca":"فِي"},
    {"id":3,"tip":"anlam","zorluk":1,"soru":"«حَتَّى» ne demek?","secenekler":["-e kadar","-den, -dan (başlangıç/ayrılma)","-den, hakkında (uzaklaşma)","içinde, -de/-da","-den beri"],"dogru":0,"arapca":"حَتَّى"},
    {"id":4,"tip":"anlam","zorluk":1,"soru":"«عَنْ» ne demek?","secenekler":["-den, hakkında (uzaklaşma)","-den, -dan (başlangıç/ayrılma)","-e kadar","içinde, -de/-da","-den beri"],"dogru":0,"arapca":"عَنْ"},
    {"id":5,"tip":"anlam","zorluk":2,"soru":"«için, -e ait» kelimesinin Arapçası hangisidir?","secenekler":["لِ","إِلَى","بِ","عَلَى","كَ"],"dogru":0,"arSecenek":true},
    {"id":6,"tip":"anlam","zorluk":2,"soru":"«ile, vasıtasıyla» kelimesinin Arapçası hangisidir?","secenekler":["بِ","عَلَى","كَ","لِ","إِلَى"],"dogru":0,"arSecenek":true},
    {"id":7,"tip":"anlam","zorluk":2,"soru":"«-e, -a (yönelme/bitiş)» kelimesinin Arapçası hangisidir?","secenekler":["إِلَى","كَ","لِ","بِ","عَلَى"],"dogru":0,"arSecenek":true},
    {"id":8,"tip":"anlam","zorluk":3,"soru":"«üzerine, üstünde» kelimesinin Arapçası hangisidir?","secenekler":["عَلَى","إِلَى","بِ","كَ","لِ"],"dogru":0,"arSecenek":true},
    {"id":9,"tip":"anlam","zorluk":3,"soru":"«مِنْ» ne demek?","secenekler":["-den, -dan (başlangıç/ayrılma)","içinde, -de/-da","-den beri","-den, hakkında (uzaklaşma)","-e kadar"],"dogru":0,"arapca":"مِنْ"},
    {"id":10,"tip":"anlam","zorluk":3,"soru":"«gibi» kelimesinin Arapçası hangisidir?","secenekler":["كَ","عَلَى","لِ","إِلَى","بِ"],"dogru":0,"arSecenek":true},
    {"id":11,"tip":"anlam","zorluk":1,"soru":"«هُنَّ» ne demek?","secenekler":["onlar (dişil)","sen (eril)","o (dişil)","onlar (eril)","sen (dişil)"],"dogru":0,"arapca":"هُنَّ"},
    {"id":12,"tip":"anlam","zorluk":1,"soru":"«هِيَ» ne demek?","secenekler":["o (dişil)","onlar (eril)","sen (dişil)","sen (eril)","onlar (dişil)"],"dogru":0,"arapca":"هِيَ"},
    {"id":13,"tip":"anlam","zorluk":1,"soru":"«هُمْ» ne demek?","secenekler":["onlar (eril)","onlar (dişil)","sen (dişil)","sen (eril)","o (dişil)"],"dogru":0,"arapca":"هُمْ"},
    {"id":14,"tip":"anlam","zorluk":1,"soru":"«أَنْتِ» ne demek?","secenekler":["sen (dişil)","onlar (dişil)","onlar (eril)","sen (eril)","o (dişil)"],"dogru":0,"arapca":"أَنْتِ"},
    {"id":15,"tip":"anlam","zorluk":2,"soru":"«ben» kelimesinin Arapçası hangisidir?","secenekler":["أَنَا","نَحْنُ","هُوَ","أَنْتُمَا","أَنْتُمْ"],"dogru":0,"arSecenek":true},
    {"id":16,"tip":"anlam","zorluk":2,"soru":"«biz» kelimesinin Arapçası hangisidir?","secenekler":["نَحْنُ","أَنْتُمْ","هُوَ","أَنَا","أَنْتُمَا"],"dogru":0,"arSecenek":true},
    {"id":17,"tip":"anlam","zorluk":2,"soru":"«ikiniz» kelimesinin Arapçası hangisidir?","secenekler":["أَنْتُمَا","أَنْتُمْ","نَحْنُ","هُوَ","أَنَا"],"dogru":0,"arSecenek":true},
    {"id":18,"tip":"anlam","zorluk":3,"soru":"«siz (eril çoğul)» kelimesinin Arapçası hangisidir?","secenekler":["أَنْتُمْ","أَنَا","أَنْتُمَا","نَحْنُ","هُوَ"],"dogru":0,"arSecenek":true},
    {"id":19,"tip":"anlam","zorluk":3,"soru":"«أَنْتَ» ne demek?","secenekler":["sen (eril)","sen (dişil)","o (dişil)","onlar (dişil)","onlar (eril)"],"dogru":0,"arapca":"أَنْتَ"},
    {"id":20,"tip":"anlam","zorluk":3,"soru":"«o (eril)» kelimesinin Arapçası hangisidir?","secenekler":["هُوَ","نَحْنُ","أَنَا","أَنْتُمَا","أَنْتُمْ"],"dogru":0,"arSecenek":true},
    {"id":21,"tip":"anlam","zorluk":1,"soru":"«هُنَا» ne demek?","secenekler":["burası","bu ikisi (eril)","orası","şu/o (eril, uzak)","bu ikisi (dişil)"],"dogru":0,"arapca":"هُنَا"},
    {"id":22,"tip":"anlam","zorluk":1,"soru":"«هَذَانِ» ne demek?","secenekler":["bu ikisi (eril)","bu ikisi (dişil)","burası","orası","şu/o (eril, uzak)"],"dogru":0,"arapca":"هَذَانِ"},
    {"id":23,"tip":"anlam","zorluk":1,"soru":"«هُنَاكَ» ne demek?","secenekler":["orası","burası","şu/o (eril, uzak)","bu ikisi (dişil)","bu ikisi (eril)"],"dogru":0,"arapca":"هُنَاكَ"},
    {"id":24,"tip":"anlam","zorluk":1,"soru":"«ذَلِكَ» ne demek?","secenekler":["şu/o (eril, uzak)","bu ikisi (eril)","burası","orası","bu ikisi (dişil)"],"dogru":0,"arapca":"ذَلِكَ"},
    {"id":25,"tip":"anlam","zorluk":2,"soru":"«bu (dişil, tekil)» kelimesinin Arapçası hangisidir?","secenekler":["هَذِهِ","تِلْكَ","هَؤُلَاءِ","هَذَا","أُولَئِكَ"],"dogru":0,"arSecenek":true},
    {"id":26,"tip":"anlam","zorluk":2,"soru":"«bu (eril, tekil)» kelimesinin Arapçası hangisidir?","secenekler":["هَذَا","أُولَئِكَ","تِلْكَ","هَؤُلَاءِ","هَذِهِ"],"dogru":0,"arSecenek":true},
    {"id":27,"tip":"anlam","zorluk":2,"soru":"«onlar (uzak)» kelimesinin Arapçası hangisidir?","secenekler":["أُولَئِكَ","هَؤُلَاءِ","هَذَا","هَذِهِ","تِلْكَ"],"dogru":0,"arSecenek":true},
    {"id":28,"tip":"anlam","zorluk":3,"soru":"«bunlar (çoğul)» kelimesinin Arapçası hangisidir?","secenekler":["هَؤُلَاءِ","هَذَا","هَذِهِ","أُولَئِكَ","تِلْكَ"],"dogru":0,"arSecenek":true},
    {"id":29,"tip":"anlam","zorluk":3,"soru":"«هَاتَانِ» ne demek?","secenekler":["bu ikisi (dişil)","burası","orası","şu/o (eril, uzak)","bu ikisi (eril)"],"dogru":0,"arapca":"هَاتَانِ"},
    {"id":30,"tip":"anlam","zorluk":3,"soru":"«şu/o (dişil, uzak)» kelimesinin Arapçası hangisidir?","secenekler":["تِلْكَ","أُولَئِكَ","هَؤُلَاءِ","هَذَا","هَذِهِ"],"dogru":0,"arSecenek":true},
    {"id":31,"tip":"anlam","zorluk":1,"soru":"«تِسْعَة» ne demek?","secenekler":["dokuz (9)","dört (4)","sekiz (8)","üç (3)","altı (6)"],"dogru":0,"arapca":"تِسْعَة"},
    {"id":32,"tip":"anlam","zorluk":1,"soru":"«سِتَّة» ne demek?","secenekler":["altı (6)","dört (4)","sekiz (8)","üç (3)","dokuz (9)"],"dogru":0,"arapca":"سِتَّة"},
    {"id":33,"tip":"anlam","zorluk":1,"soru":"«أَرْبَعَة» ne demek?","secenekler":["dört (4)","sekiz (8)","üç (3)","altı (6)","dokuz (9)"],"dogru":0,"arapca":"أَرْبَعَة"},
    {"id":34,"tip":"anlam","zorluk":1,"soru":"«ثَلَاثَة» ne demek?","secenekler":["üç (3)","dört (4)","sekiz (8)","altı (6)","dokuz (9)"],"dogru":0,"arapca":"ثَلَاثَة"},
    {"id":35,"tip":"anlam","zorluk":2,"soru":"«on (10)» kelimesinin Arapçası hangisidir?","secenekler":["عَشَرَة","سَبْعَة","وَاحِد","اِثْنَان","خَمْسَة"],"dogru":0,"arSecenek":true},
    {"id":36,"tip":"anlam","zorluk":2,"soru":"«yedi (7)» kelimesinin Arapçası hangisidir?","secenekler":["سَبْعَة","اِثْنَان","خَمْسَة","عَشَرَة","وَاحِد"],"dogru":0,"arSecenek":true},
    {"id":37,"tip":"anlam","zorluk":2,"soru":"«bir (1)» kelimesinin Arapçası hangisidir?","secenekler":["وَاحِد","سَبْعَة","عَشَرَة","اِثْنَان","خَمْسَة"],"dogru":0,"arSecenek":true},
    {"id":38,"tip":"anlam","zorluk":3,"soru":"«iki (2)» kelimesinin Arapçası hangisidir?","secenekler":["اِثْنَان","سَبْعَة","عَشَرَة","وَاحِد","خَمْسَة"],"dogru":0,"arSecenek":true},
    {"id":39,"tip":"anlam","zorluk":3,"soru":"«ثَمَانِيَة» ne demek?","secenekler":["sekiz (8)","dört (4)","üç (3)","altı (6)","dokuz (9)"],"dogru":0,"arapca":"ثَمَانِيَة"},
    {"id":40,"tip":"anlam","zorluk":3,"soru":"«beş (5)» kelimesinin Arapçası hangisidir?","secenekler":["خَمْسَة","وَاحِد","اِثْنَان","سَبْعَة","عَشَرَة"],"dogru":0,"arSecenek":true},
    {"id":41,"tip":"anlam","zorluk":1,"soru":"«رَمَادِيّ» ne demek?","secenekler":["gri","yeşil","beyaz","kırmızı","pembe"],"dogru":0,"arapca":"رَمَادِيّ"},
    {"id":42,"tip":"anlam","zorluk":1,"soru":"«أَخْضَر» ne demek?","secenekler":["yeşil","kırmızı","pembe","beyaz","gri"],"dogru":0,"arapca":"أَخْضَر"},
    {"id":43,"tip":"anlam","zorluk":1,"soru":"«وَرْدِيّ» ne demek?","secenekler":["pembe","yeşil","beyaz","gri","kırmızı"],"dogru":0,"arapca":"وَرْدِيّ"},
    {"id":44,"tip":"anlam","zorluk":1,"soru":"«أَحْمَر» ne demek?","secenekler":["kırmızı","beyaz","gri","pembe","yeşil"],"dogru":0,"arapca":"أَحْمَر"},
    {"id":45,"tip":"anlam","zorluk":2,"soru":"«kahverengi» kelimesinin Arapçası hangisidir?","secenekler":["بُنِّيّ","أَسْوَد","أَصْفَر","بُرْتُقَالِيّ","أَزْرَق"],"dogru":0,"arSecenek":true},
    {"id":46,"tip":"anlam","zorluk":2,"soru":"«sarı» kelimesinin Arapçası hangisidir?","secenekler":["أَصْفَر","بُرْتُقَالِيّ","بُنِّيّ","أَزْرَق","أَسْوَد"],"dogru":0,"arSecenek":true},
    {"id":47,"tip":"anlam","zorluk":2,"soru":"«turuncu» kelimesinin Arapçası hangisidir?","secenekler":["بُرْتُقَالِيّ","بُنِّيّ","أَزْرَق","أَسْوَد","أَصْفَر"],"dogru":0,"arSecenek":true},
    {"id":48,"tip":"anlam","zorluk":3,"soru":"«mavi» kelimesinin Arapçası hangisidir?","secenekler":["أَزْرَق","أَسْوَد","أَصْفَر","بُرْتُقَالِيّ","بُنِّيّ"],"dogru":0,"arSecenek":true},
    {"id":49,"tip":"anlam","zorluk":3,"soru":"«أَبْيَض» ne demek?","secenekler":["beyaz","yeşil","gri","kırmızı","pembe"],"dogru":0,"arapca":"أَبْيَض"},
    {"id":50,"tip":"anlam","zorluk":3,"soru":"«siyah» kelimesinin Arapçası hangisidir?","secenekler":["أَسْوَد","أَصْفَر","بُرْتُقَالِيّ","بُنِّيّ","أَزْرَق"],"dogru":0,"arSecenek":true}
  ] },
  { id: "yedi", ad: "7. Sınıf Kelimeleri", pdf: "", sorular: [
    {"id":1,"tip":"anlam","zorluk":1,"soru":"«الفَطور» ne demek?","secenekler":["kahvaltı","hızlı","kahve","kütüphane","küçük"],"dogru":0,"arapca":"الفَطور"},
    {"id":2,"tip":"anlam","zorluk":1,"soru":"«الغَداء» ne demek?","secenekler":["öğle yemeği","soğan","süt","tavuk","tereyağı"],"dogru":0,"arapca":"الغَداء"},
    {"id":3,"tip":"anlam","zorluk":1,"soru":"«العَشاء» ne demek?","secenekler":["akşam yemeği","soğan","süt","tavuk","tereyağı"],"dogru":0,"arapca":"العَشاء"},
    {"id":4,"tip":"anlam","zorluk":1,"soru":"«الصَّباح» ne demek?","secenekler":["sabah","yavaş","yumurta","zeytin","çarşı / pazar"],"dogru":0,"arapca":"الصَّباح"},
    {"id":5,"tip":"anlam","zorluk":1,"soru":"«المَساء» ne demek?","secenekler":["akşam","elma","et","ev","gece"],"dogru":0,"arapca":"المَساء"},
    {"id":6,"tip":"anlam","zorluk":1,"soru":"«اللَّيْل» ne demek?","secenekler":["gece","tavuk","tereyağı","tren","tuz"],"dogru":0,"arapca":"اللَّيْل"},
    {"id":7,"tip":"anlam","zorluk":1,"soru":"«المَدْرَسَة» ne demek?","secenekler":["okul","hastane","havuç","hızlı","kahvaltı"],"dogru":0,"arapca":"المَدْرَسَة"},
    {"id":8,"tip":"anlam","zorluk":1,"soru":"«البَيْت» ne demek?","secenekler":["ev","küçük","muz","okul","otobüs"],"dogru":0,"arapca":"البَيْت"},
    {"id":9,"tip":"anlam","zorluk":1,"soru":"«الحَليب» ne demek?","secenekler":["süt","balık","başkent","bisiklet","büyük"],"dogru":0,"arapca":"الحَليب"},
    {"id":10,"tip":"anlam","zorluk":1,"soru":"«الجُبْن» ne demek?","secenekler":["peynir","sabah","sağ","sol","soğan"],"dogru":0,"arapca":"الجُبْن"},
    {"id":11,"tip":"anlam","zorluk":1,"soru":"«الزَّيْتون» ne demek?","secenekler":["zeytin","elma","et","ev","gece"],"dogru":0,"arapca":"الزَّيْتون"},
    {"id":12,"tip":"anlam","zorluk":1,"soru":"«اللَّحْم» ne demek?","secenekler":["et","sabah","sağ","sol","soğan"],"dogru":0,"arapca":"اللَّحْم"},
    {"id":13,"tip":"anlam","zorluk":1,"soru":"«الأُرْز» ne demek?","secenekler":["pirinç / pilav","araba","bal","balık","başkent"],"dogru":0,"arapca":"الأُرْز"},
    {"id":14,"tip":"anlam","zorluk":1,"soru":"«القَهْوَة» ne demek?","secenekler":["kahve","bal","balık","başkent","bisiklet"],"dogru":0,"arapca":"القَهْوَة"},
    {"id":15,"tip":"anlam","zorluk":1,"soru":"«الشّاي» ne demek?","secenekler":["çay","araba","bal","balık","başkent"],"dogru":0,"arapca":"الشّاي"},
    {"id":16,"tip":"anlam","zorluk":1,"soru":"«السَّمَك» ne demek?","secenekler":["balık","kahve","kütüphane","küçük","muz"],"dogru":0,"arapca":"السَّمَك"},
    {"id":17,"tip":"anlam","zorluk":1,"soru":"«الخُبْز» ne demek?","secenekler":["ekmek","kahve","kütüphane","küçük","muz"],"dogru":0,"arapca":"الخُبْز"},
    {"id":18,"tip":"anlam","zorluk":1,"soru":"«السُّكَّر» ne demek?","secenekler":["şeker","gece","gemi","hastane","havuç"],"dogru":0,"arapca":"السُّكَّر"},
    {"id":19,"tip":"anlam","zorluk":1,"soru":"«المِلْح» ne demek?","secenekler":["tuz","öğle yemeği","üzüm","şehir","şeker"],"dogru":0,"arapca":"المِلْح"},
    {"id":20,"tip":"anlam","zorluk":1,"soru":"«العَسَل» ne demek?","secenekler":["bal","gece","gemi","hastane","havuç"],"dogru":0,"arapca":"العَسَل"},
    {"id":21,"tip":"anlam","zorluk":1,"soru":"«الزُّبْدَة» ne demek?","secenekler":["tereyağı","pahalı","patates","peynir","pirinç / pilav"],"dogru":0,"arapca":"الزُّبْدَة"},
    {"id":22,"tip":"anlam","zorluk":1,"soru":"«البَيْض» ne demek?","secenekler":["yumurta","zeytin","çarşı / pazar","çay","öğle yemeği"],"dogru":0,"arapca":"البَيْض"},
    {"id":23,"tip":"anlam","zorluk":1,"soru":"«الدَّجاج» ne demek?","secenekler":["tavuk","uzak","uçak","yakın","yavaş"],"dogru":0,"arapca":"الدَّجاج"},
    {"id":24,"tip":"anlam","zorluk":1,"soru":"«التُّفّاح» ne demek?","secenekler":["elma","kahvaltı","kahve","kütüphane","küçük"],"dogru":0,"arapca":"التُّفّاح"},
    {"id":25,"tip":"anlam","zorluk":1,"soru":"«المَوْز» ne demek?","secenekler":["muz","yavaş","yumurta","zeytin","çarşı / pazar"],"dogru":0,"arapca":"المَوْز"},
    {"id":26,"tip":"anlam","zorluk":1,"soru":"«العِنَب» ne demek?","secenekler":["üzüm","elma","et","ev","gece"],"dogru":0,"arapca":"العِنَب"},
    {"id":27,"tip":"anlam","zorluk":1,"soru":"«البُرْتُقال» ne demek?","secenekler":["portakal","sabah","sağ","sol","soğan"],"dogru":0,"arapca":"البُرْتُقال"},
    {"id":28,"tip":"anlam","zorluk":1,"soru":"«البَصَل» ne demek?","secenekler":["soğan","uzak","uçak","yakın","yavaş"],"dogru":0,"arapca":"البَصَل"},
    {"id":29,"tip":"anlam","zorluk":1,"soru":"«الجَزَر» ne demek?","secenekler":["havuç","uçak","yakın","yavaş","yumurta"],"dogru":0,"arapca":"الجَزَر"},
    {"id":30,"tip":"anlam","zorluk":1,"soru":"«البَطاطا» ne demek?","secenekler":["patates","kahve","kütüphane","küçük","muz"],"dogru":0,"arapca":"البَطاطا"},
    {"id":31,"tip":"anlam","zorluk":1,"soru":"«السَّيّارَة» ne demek?","secenekler":["araba","şehir","şeker","akşam","akşam yemeği"],"dogru":0,"arapca":"السَّيّارَة"},
    {"id":32,"tip":"anlam","zorluk":1,"soru":"«الحافِلَة» ne demek?","secenekler":["otobüs","zeytin","çarşı / pazar","çay","öğle yemeği"],"dogru":0,"arapca":"الحافِلَة"},
    {"id":33,"tip":"anlam","zorluk":1,"soru":"«القِطار» ne demek?","secenekler":["tren","peynir","pirinç / pilav","portakal","sabah"],"dogru":0,"arapca":"القِطار"},
    {"id":34,"tip":"anlam","zorluk":1,"soru":"«الطّائِرَة» ne demek?","secenekler":["uçak","patates","peynir","pirinç / pilav","portakal"],"dogru":0,"arapca":"الطّائِرَة"},
    {"id":35,"tip":"anlam","zorluk":1,"soru":"«الدَّرّاجَة» ne demek?","secenekler":["bisiklet","çay","öğle yemeği","üzüm","şehir"],"dogru":0,"arapca":"الدَّرّاجَة"},
    {"id":36,"tip":"anlam","zorluk":1,"soru":"«السَّفينَة» ne demek?","secenekler":["gemi","muz","okul","otobüs","pahalı"],"dogru":0,"arapca":"السَّفينَة"},
    {"id":37,"tip":"anlam","zorluk":1,"soru":"«المُسْتَشْفى» ne demek?","secenekler":["hastane","portakal","sabah","sağ","sol"],"dogru":0,"arapca":"المُسْتَشْفى"},
    {"id":38,"tip":"anlam","zorluk":1,"soru":"«المَكْتَبَة» ne demek?","secenekler":["kütüphane","gece","gemi","hastane","havuç"],"dogru":0,"arapca":"المَكْتَبَة"},
    {"id":39,"tip":"anlam","zorluk":1,"soru":"«المَسْجِد» ne demek?","secenekler":["cami","gemi","hastane","havuç","hızlı"],"dogru":0,"arapca":"المَسْجِد"},
    {"id":40,"tip":"anlam","zorluk":1,"soru":"«السّوق» ne demek?","secenekler":["çarşı / pazar","peynir","pirinç / pilav","portakal","sabah"],"dogru":0,"arapca":"السّوق"},
    {"id":41,"tip":"anlam","zorluk":1,"soru":"«غالٍ» ne demek?","secenekler":["pahalı","ev","gece","gemi","hastane"],"dogru":0,"arapca":"غالٍ"},
    {"id":42,"tip":"anlam","zorluk":1,"soru":"«رَخيص» ne demek?","secenekler":["ucuz","kahvaltı","kahve","kütüphane","küçük"],"dogru":0,"arapca":"رَخيص"},
    {"id":43,"tip":"anlam","zorluk":1,"soru":"«كَبير» ne demek?","secenekler":["büyük","uçak","yakın","yavaş","yumurta"],"dogru":0,"arapca":"كَبير"},
    {"id":44,"tip":"anlam","zorluk":1,"soru":"«صَغير» ne demek?","secenekler":["küçük","ucuz","uzak","uçak","yakın"],"dogru":0,"arapca":"صَغير"},
    {"id":45,"tip":"anlam","zorluk":1,"soru":"«سَريع» ne demek?","secenekler":["hızlı","muz","okul","otobüs","pahalı"],"dogru":0,"arapca":"سَريع"},
    {"id":46,"tip":"anlam","zorluk":1,"soru":"«بَطيء» ne demek?","secenekler":["yavaş","yakın","yumurta","zeytin","çarşı / pazar"],"dogru":0,"arapca":"بَطيء"},
    {"id":47,"tip":"anlam","zorluk":1,"soru":"«قَريب» ne demek?","secenekler":["yakın","portakal","sabah","sağ","sol"],"dogru":0,"arapca":"قَريب"},
    {"id":48,"tip":"anlam","zorluk":1,"soru":"«بَعيد» ne demek?","secenekler":["uzak","gemi","hastane","havuç","hızlı"],"dogru":0,"arapca":"بَعيد"},
    {"id":49,"tip":"anlam","zorluk":1,"soru":"«اليَمين» ne demek?","secenekler":["sağ","kütüphane","küçük","muz","okul"],"dogru":0,"arapca":"اليَمين"},
    {"id":50,"tip":"anlam","zorluk":1,"soru":"«اليَسار» ne demek?","secenekler":["sol","ekmek","elma","et","ev"],"dogru":0,"arapca":"اليَسار"},
    {"id":51,"tip":"anlam","zorluk":1,"soru":"«عاصِمَة» ne demek?","secenekler":["başkent","öğle yemeği","üzüm","şehir","şeker"],"dogru":0,"arapca":"عاصِمَة"},
    {"id":52,"tip":"anlam","zorluk":1,"soru":"«مَدينَة» ne demek?","secenekler":["şehir","üzüm","şeker","akşam","akşam yemeği"],"dogru":0,"arapca":"مَدينَة"}
  ] },
  { id: "dilbilgisi1", ad: "Dilbilgisi 1 (Mücerret)", pdf: "", sorular: [
    {"id":1,"tip":"gramer","zorluk":1,"soru":"Mazi fiil hangi zamanı bildirir?","secenekler":["Görülen (di'li) geçmiş zaman","Şimdiki / geniş zaman","Gelecek zaman","Emir (buyruk)","Geniş zamanın olumsuzu"],"dogru":0},
    {"id":2,"tip":"gramer","zorluk":1,"soru":"Muzari fiil hangi zamanları bildirir?","secenekler":["Şimdiki, geniş ve gelecek zaman","Sadece görülen geçmiş zaman","Sadece emir","Sadece gelecek zaman","Duyulan geçmiş zaman"],"dogru":0},
    {"id":3,"tip":"gramer","zorluk":1,"soru":"«كَتَبَ» hangi fiil kipidir?","secenekler":["Mazi (geçmiş zaman)","Muzari (geniş/şimdiki)","Emir","Mastar","Nehiy"],"dogru":0,"arSecenek":true},
    {"id":4,"tip":"gramer","zorluk":1,"soru":"«يَكْتُبُ» hangi fiil kipidir?","secenekler":["Muzari (geniş/şimdiki)","Mazi (geçmiş)","Emir","İsm-i fâil","Mastar"],"dogru":0,"arSecenek":true},
    {"id":5,"tip":"gramer","zorluk":1,"soru":"Sülasi mücerret fiilin kaç babı vardır?","secenekler":["6","3","4","8","10"],"dogru":0},
    {"id":6,"tip":"gramer","zorluk":1,"soru":"Sülasi mücerredin ism-i fâili hangi vezinde gelir?","secenekler":["فاعِل","مَفْعول","مُفَعِّل","فَعّال","مِفْعال"],"dogru":0,"arSecenek":true},
    {"id":7,"tip":"gramer","zorluk":1,"soru":"Sülasi mücerredin ism-i mef'ûlü hangi vezinde gelir?","secenekler":["مَفْعول","فاعِل","مُفَعَّل","فَعيل","مَفْعَل"],"dogru":0,"arSecenek":true},
    {"id":8,"tip":"gramer","zorluk":1,"soru":"«عالِم» kelimesi hangi türetilmiş isimdir?","secenekler":["İsm-i fâil (işi yapan)","İsm-i mef'ûl (etkilenen)","Mastar","İsm-i zaman","İsm-i âlet"],"dogru":0},
    {"id":9,"tip":"gramer","zorluk":1,"soru":"«مَعْلوم» kelimesi hangi türetilmiş isimdir?","secenekler":["İsm-i mef'ûl (işten etkilenen)","İsm-i fâil (işi yapan)","Mastar","İsm-i tafdîl","İsm-i âlet"],"dogru":0},
    {"id":10,"tip":"gramer","zorluk":1,"soru":"Sülasi mücerret fiillerin mastarları nasıldır?","secenekler":["Semaîdir (işitilerek/ezberle öğrenilir)","Kıyasîdir (kurallıdır)","Tek bir vezni vardır","Daima إِفْعال gelir","Hep aynıdır"],"dogru":0},
    {"id":11,"tip":"gramer","zorluk":1,"soru":"Mazi fiilin başına «ما» gelince ne olur?","secenekler":["Anlamı geçmiş zamanda olumsuzlaşır (şekli değişmez)","Gelecek zaman olur","Emir olur","Soru cümlesi olur","Şekli tamamen değişir"],"dogru":0},
    {"id":12,"tip":"gramer","zorluk":1,"soru":"Muzari fiilin başına «لَمْ» gelince anlamı ne olur?","secenekler":["Kesin geçmiş zaman olumsuzu (yapmadı)","Şimdiki zaman olumlu","Gelecek zaman","Emir","Geniş zaman olumlu"],"dogru":0},
    {"id":13,"tip":"gramer","zorluk":1,"soru":"Muzari fiilin başına «لا» gelince ne olur?","secenekler":["Şimdiki/geniş zaman olumsuzu (yapmıyor)","Geçmiş zaman olumsuzu","Emir olur","Soru olur","Mastar olur"],"dogru":0},
    {"id":14,"tip":"gramer","zorluk":1,"soru":"Olumsuz emir (nehiy) hangi edatla yapılır?","secenekler":["لا","ما","لَمْ","هَل","قَد"],"dogru":0,"arSecenek":true},
    {"id":15,"tip":"gramer","zorluk":1,"soru":"İsm-i zaman ve ism-i mekan, sülasi mücerredde hangi vezinlerde gelir?","secenekler":["مَفْعَل / مَفْعِل","فاعِل / مَفْعول","فَعّال / مِفْعال","مُفَعِّل / مُفَعَّل","فَعيل / فَعّال"],"dogru":0},
    {"id":16,"tip":"gramer","zorluk":1,"soru":"İsm-i âlet (alet ismi) genellikle hangi harfle başlar?","secenekler":["Esreli mim (مِ)","Ötreli mim (مُ)","Üstünlü mim (مَ)","Elif (ا)","Te (ت)"],"dogru":0},
    {"id":17,"tip":"gramer","zorluk":1,"soru":"«جَمْع التَّكْسير» (cem-i teksir) ne demektir?","secenekler":["Kırık çoğul (kelimenin yapısı bozularak çoğul olması)","Düzenli (salim) çoğul","İkil (tesniye)","Küçültme ismi","Üstünlük ismi"],"dogru":0},
    {"id":18,"tip":"gramer","zorluk":1,"soru":"İsm-i tasğîr ne ifade eder?","secenekler":["Küçültme (küçük / sevimli anlamı)","Üstünlük / daha üstün","Kırık çoğul","İşi yapan","Alet ismi"],"dogru":0},
    {"id":19,"tip":"gramer","zorluk":1,"soru":"İsm-i tafdîl ne ifade eder?","secenekler":["Üstünlük (daha / en üstün olma)","Küçültme","Kırık çoğul","İşi yapan","Yapılan iş"],"dogru":0},
    {"id":20,"tip":"gramer","zorluk":1,"soru":"«اُكْتُبْ» hangi fiil kipidir?","secenekler":["Emir (buyruk: yaz!)","Mazi (geçmiş)","Muzari (geniş)","Nehiy (yasak)","Mastar"],"dogru":0,"arSecenek":true}
  ] },
  { id: "dilbilgisi2", ad: "Dilbilgisi 2 (Mezid)", pdf: "", sorular: [
    {"id":1,"tip":"gramer","zorluk":1,"soru":"Mezid bablarda mastar nasıldır?","secenekler":["Kıyasîdir (kurallı; her babın kendine has vezni var)","Semaîdir (ezberlenir)","Belirli bir kuralı yoktur","Daima فاعِل gelir","Her fiilde değişir"],"dogru":0},
    {"id":2,"tip":"gramer","zorluk":1,"soru":"«إِفْعال» hangi babın mastarıdır?","secenekler":["İf'âl babı (أَفْعَلَ)","Tef'îl babı (فَعَّلَ)","Mufâale babı (فاعَلَ)","İstif'âl babı (اِسْتَفْعَلَ)","İnfial babı (اِنْفَعَلَ)"],"dogru":0},
    {"id":3,"tip":"gramer","zorluk":1,"soru":"«أَسْلَمَ» fiilinin mastarı hangisidir?","secenekler":["إِسْلام","تَسْليم","مُسالَمَة","اِسْتِسْلام","اِنْسِلاخ"],"dogru":0,"arSecenek":true},
    {"id":4,"tip":"gramer","zorluk":1,"soru":"Mezid bablar isimlerini neyden alır?","secenekler":["Kendi mastarlarından","Mazi fiilden","Muzari fiilden","İsm-i fâilden","Emir fiilinden"],"dogru":0},
    {"id":5,"tip":"gramer","zorluk":1,"soru":"Mezid bablarda ism-i fâil türetirken muzari başındaki harf atılıp yerine ne getirilir?","secenekler":["Ötreli mim (مُـ)","Esreli mim (مِـ)","Üstünlü mim (مَـ)","Elif (ا)","Te (ت)"],"dogru":0},
    {"id":6,"tip":"gramer","zorluk":1,"soru":"Mezid bab ism-i fâilde sondan bir önceki harfin harekesi ne olur?","secenekler":["Esre (ـِ)","Üstün (ـَ)","Ötre (ـُ)","Cezm (ـْ)","Şedde (ـّ)"],"dogru":0},
    {"id":7,"tip":"gramer","zorluk":1,"soru":"Mezid bab ism-i mef'ûlde sondan bir önceki harfin harekesi ne olur?","secenekler":["Üstün (ـَ)","Esre (ـِ)","Ötre (ـُ)","Cezm (ـْ)","Tenvin"],"dogru":0},
    {"id":8,"tip":"gramer","zorluk":1,"soru":"«يُسْلِمُ» fiilinin ism-i fâili hangisidir?","secenekler":["مُسْلِم","مُسْلَم","سالِم","مَسْلوم","إِسْلام"],"dogru":0,"arSecenek":true},
    {"id":9,"tip":"gramer","zorluk":1,"soru":"«مُنْتَظَر» hangi türetilmiş isimdir?","secenekler":["İsm-i mef'ûl (beklenen)","İsm-i fâil (bekleyen)","Mastar","İsm-i zaman","Mazi fiil"],"dogru":0},
    {"id":10,"tip":"gramer","zorluk":1,"soru":"Mezid bablarda ism-i zaman ve ism-i mekan vezni neye eşittir?","secenekler":["O babın ism-i mef'ûl vezniyle aynıdır","İsm-i fâil vezniyle aynıdır","Mastar vezniyle aynıdır","Daima مَفْعَل gelir","Daima فاعِل gelir"],"dogru":0},
    {"id":11,"tip":"gramer","zorluk":1,"soru":"«جاهَدَ» fiili hangi babdandır?","secenekler":["Mufâale (فاعَلَ)","İf'âl (أَفْعَلَ)","Tef'îl (فَعَّلَ)","İstif'âl (اِسْتَفْعَلَ)","İftial (اِفْتَعَلَ)"],"dogru":0},
    {"id":12,"tip":"gramer","zorluk":1,"soru":"«تَفْعيل» hangi babın mastarıdır?","secenekler":["Tef'îl babı (فَعَّلَ)","İf'âl babı (أَفْعَلَ)","Mufâale babı (فاعَلَ)","İstif'âl babı (اِسْتَفْعَلَ)","İnfial babı (اِنْفَعَلَ)"],"dogru":0},
    {"id":13,"tip":"gramer","zorluk":1,"soru":"«اِسْتِفْعال» hangi babın mastarıdır?","secenekler":["İstif'âl babı (اِسْتَفْعَلَ)","İf'âl babı (أَفْعَلَ)","Tef'îl babı (فَعَّلَ)","İftial babı (اِفْتَعَلَ)","İnfial babı (اِنْفَعَلَ)"],"dogru":0},
    {"id":14,"tip":"gramer","zorluk":1,"soru":"«اِسْتَغْفَرَ» fiili hangi babdandır?","secenekler":["İstif'âl (اِسْتَفْعَلَ)","İf'âl (أَفْعَلَ)","Tef'îl (فَعَّلَ)","Mufâale (فاعَلَ)","İnfial (اِنْفَعَلَ)"],"dogru":0},
    {"id":15,"tip":"gramer","zorluk":1,"soru":"«اِنْفَعَلَ» fiili hangi babdandır?","secenekler":["İnfial (اِنْفَعَلَ)","İftial (اِفْتَعَلَ)","İf'âl (أَفْعَلَ)","Tef'îl (فَعَّلَ)","İstif'âl (اِسْتَفْعَلَ)"],"dogru":0},
    {"id":16,"tip":"gramer","zorluk":1,"soru":"«Mezid» fiil ne demektir?","secenekler":["Aslî harflerine harf eklenmiş (ziyadeleşmiş) fiil","Yalın / çıplak üç harfli fiil","Sadece mastar","Çoğul isim","Emir kipi"],"dogru":0},
    {"id":17,"tip":"gramer","zorluk":1,"soru":"Mastar bakımından mücerret ile mezidin farkı nedir?","secenekler":["Mücerret semaî (ezber), mezid kıyasî (kurallı)","İkisi de kurallıdır","İkisi de ezberdir","Mezid ezber, mücerret kurallı","Aralarında fark yoktur"],"dogru":0},
    {"id":18,"tip":"gramer","zorluk":1,"soru":"«عَلَّمَ» (öğretti) fiili hangi babdandır?","secenekler":["Tef'îl (فَعَّلَ)","İf'âl (أَفْعَلَ)","Mufâale (فاعَلَ)","İstif'âl (اِسْتَفْعَلَ)","İnfial (اِنْفَعَلَ)"],"dogru":0}
  ] },
];

/* ---------------- Durum ---------------- */
const state = {
  mod: null, uid: null,
  konuId: null,              // seçili konu (açılışta seçili değil)
  seviye: null,              // kolay | orta | zor  (başta seçili değil)
  sorularZ: 1,               // Sorular önizleme sekmesi (zorluk)
  soruGizli: true,           // admin ekranında soruyu gizle/göster (açılışta gizli)
  soruSayisi: null,          // turdaki soru sayısı (başta seçili değil)
  soruSayiMax: 50,           // seçili konu+seviyedeki mevcut soruya göre üst sınır
  secilenSet: null,          // elle seçilen soru anahtarları (Set) — havuzdan
  soruSecArama: "",          // soru havuzu arama metni
  otoSonucIndex: -1,         // tüm takımlar cevaplayınca otomatik sonuç kilidi
  odaId: null,               // admin: oda kodu
  odaTakim: null,            // takım: {oda, takim}
  takimAd: "",
  takimAbone: null, odaAboneAdmin: null, odaAbone: null, cevapAbone: null,
  ayarKilidiKapali: false,   // lobiye dönünce ayarlar (konu/seviye/soru sayısı) takım bağlıyken de açılır
  oda: null,                 // canlı oda dokümanı
  takimListe: [],            // [{id, ad, bagli, puan}]
  cevaplar: {},              // "takimId_index" -> {takimId, ad, index, secilen}
  oyunSorulari: [],          // admin: seçilen sorular (cevap dahil)
  sayacInterval: null,
  sonCevapIndex: -1,
  sinifKonu: null, sinifZ: 1, sinifList: [], sinifIndex: 0, sinifCevapAcik: false,   // sınıf modu (çevrimdışı)
  sonucAnimIndex: -1,        // sonuç ekranı animasyonu hangi soru için oynatıldı
  sonucTimerlar: [],         // sonuç ekranı adım zamanlayıcıları (temizlik için)
  finalKonfeti: false,       // yarışma bitti ekranında konfeti bir kez patlar
  baglSet: null,             // o an bağlı takım id kümesi (yeni bağlanmayı yakalamak için)
  baglIlk: false,            // ilk takım snapshot'ı işlendi mi (açılışta ses çalmamak için)
  hepsiSesIndex: -1,         // "tümü cevapladı" sesi hangi soru için çalındı
  // ---- beraberlik (yedek soru) ----
  yedekSorular: [],          // turda kullanılmayan yedek sorular
  berHedef: 0,               // beraberlik hangi sıra için (1=liderlik, 2=ikincilik)
  berTakimlar: [],           // beraberlikte yarışan takım id'leri
  berSabit: {},              // sırası kesinleşmiş takımlar { id: sıra }
  berNo: 0,                  // kaçıncı yedek soru
  berSorular: [],            // sorulan yedek soru index'leri
  berOtoIndex: -1,           // (kullanılmıyor)
  yedekSoruMap: {}           // { index: soru }  yedek soruların puan hesabı için
};

/* ---------------- Ses (sinüs dalgası — Web Audio) ---------------- */
const SES = {
  ctx: null,
  _ac(){
    try {
      if (!this.ctx){ const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; this.ctx = new AC(); }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    } catch(e){ return null; }
  },
  _ton(ac, freq, t0, sure, kazanc){
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(kazanc, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + sure);
    o.connect(g); g.connect(ac.destination);
    o.start(t0); o.stop(t0 + sure + 0.03);
  },
  _cal(notalar, kazanc){
    const ac = this._ac(); if (!ac) return;
    const now = ac.currentTime + 0.01;
    notalar.forEach(n => this._ton(ac, n.f, now + (n.t || 0), n.d || 0.15, (n.g || kazanc || 0.14)));
  },
  baglandi(){ this._cal([{f:659,t:0,d:0.12},{f:988,t:0.10,d:0.18}], 0.13); },                          // takım bağlandı: yükselen ding
  hepsiCevap(){ this._cal([{f:523,t:0,d:0.11},{f:659,t:0.09,d:0.11},{f:784,t:0.18,d:0.20}], 0.13); },  // tümü cevapladı: do-mi-sol
  sonuc(){ this._cal([{f:392,t:0,d:0.14},{f:587,t:0.12,d:0.24}], 0.15); },                              // sonuç ekranı açıldı
  siraDegisti(){ this._cal([{f:494,t:0,d:0.10},{f:740,t:0.08,d:0.10},{f:988,t:0.16,d:0.20}], 0.12); }   // sıralama değişti: hızlı yükseliş
};
// ilk kullanıcı hareketinde ses bağlamını aç (tarayıcı otomatik oynatma kısıtı)
["pointerdown","keydown","touchstart"].forEach(ev => window.addEventListener(ev, () => SES._ac(), { passive: true }));

/* ---------------- Yardımcılar ---------------- */
function $(id){ return document.getElementById(id); }
function ekranGoster(id){
  document.querySelectorAll(".biy-ekran").forEach(e => e.classList.add("gizli"));
  const el = $(id); if (el) el.classList.remove("gizli");
  // çıkış tuşu yalnızca canlı oyun ekranında görünür
  const cik = $("cikisTus"); if (cik) cik.classList.toggle("gizli", id !== "ekranOyunAdmin");
}
function kacis(t){ const d = document.createElement("div"); d.textContent = t == null ? "" : String(t); return d.innerHTML; }
function rastgeleKod(uzunluk){
  const harf = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = ""; for (let i=0;i<uzunluk;i++) s += harf[Math.floor(Math.random()*harf.length)];
  return s;
}
function takimLinki(oda, takim){
  return location.origin + location.pathname + "?oda=" + encodeURIComponent(oda) + "&takim=" + encodeURIComponent(takim);
}
function temizSoru(s){  // takıma gidecek hâli — DOĞRU CEVAP YOK
  return { tip: s.tip, zorluk: s.zorluk, soru: s.soru, arapca: s.arapca || null, secenekler: s.secenekler, arSecenek: !!s.arSecenek };
}
function soruHazirla(s){  // şıkları karıştır (doğru hep A olmasın); dogru indeksini güncelle
  const idx = s.secenekler.map((_, i) => i);
  for (let i = idx.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); const g = idx[i]; idx[i] = idx[j]; idx[j] = g; }
  return Object.assign({}, s, { secenekler: idx.map(i => s.secenekler[i]), dogru: idx.indexOf(s.dogru) });
}
function tsMillis(ts){
  if (!ts) return null;
  if (ts.toMillis) return ts.toMillis();
  if (ts.seconds != null) return ts.seconds*1000;
  return null;
}
function kalanSaniye(){
  const o = state.oda; if (!o) return SORU_SURESI;
  const bas = tsMillis(o.soruBaslangic);
  if (bas == null) return o.soruSuresi || SORU_SURESI;
  return Math.max(0, Math.ceil((o.soruSuresi || SORU_SURESI) - (Date.now() - bas)/1000));
}
function sayacBaslat(render){
  sayacDurdur();
  state.sayacInterval = setInterval(render, 400);
}
function sayacDurdur(){ if (state.sayacInterval){ clearInterval(state.sayacInterval); state.sayacInterval = null; } }

/* ===========================================================
   BIY
   =========================================================== */
const BIY = {

  anasayfa(){ sayacDurdur(); ekranGoster("ekranAnasayfa"); BIY._menuDurum(); },

  // Geri: dosyadan çık. Bağlı cihaz varsa onay iste; çıkışta odayı kapat (cihazlar ayrılsın).
  geriDon(){
    if (state.odaId && (state.takimListe || []).some(t => t.bagli)){
      BIY._onay("Çıkılsın mı?", "Bağlı sınıf/cihazlar var — çıkarsanız bağlantıları kesilecek.", "Evet, çık", function(){ BIY._geriCik(); });
      return;
    }
    BIY._geriCik();
  },
  async _geriCik(){
    if (state.odaId){
      try { await db.collection(KOLEKSIYON).doc(state.odaId).update({ durum: "bitti", sonSira: [] }); } catch(e){}
      try { if (state.odaAboneAdmin) state.odaAboneAdmin(); if (state.cevapAbone) state.cevapAbone(); if (state.takimAbone) state.takimAbone(); } catch(e){}
      BIY._temizleKayit();
    }
    try { window.close(); } catch(e){}
    setTimeout(function(){ location.href = "kaliplartablosu.html"; }, 120);
  },

  /* ---------- Konu seçimi ---------- */
  _aktifKonu(){ return state.konuId ? (KONULAR.find(k => k.id === state.konuId) || null) : null; },
  _aktifSorular(){ const k = BIY._aktifKonu(); return (k && k.sorular) || []; },
  _konuVurgu(){ const sel = $("konuSecim"); if (sel) sel.classList.toggle("secili", !!state.konuId); },
  // tüm konulardaki soruların havuzu (elle seçim için)
  _soruHavuzu(){
    const havuz = [];
    KONULAR.forEach(k => { if (Array.isArray(k.sorular)) k.sorular.forEach(q => havuz.push({ key: k.id + "#" + q.id, konuId: k.id, konuAd: k.ad, soru: q })); });
    return havuz;
  },
  _konulariHazirla(){
    const sel = $("konuSecim"); if (!sel) return;
    sel.innerHTML = '<option value=""'+(state.konuId?'':' selected')+' disabled hidden>Konu seçin…</option>' +
      KONULAR.map(k => '<option value="'+k.id+'"'+(k.pasif?' disabled':'')+(k.id===state.konuId?' selected':'')+'>'+kacis(k.ad)+(k.pasif?' · yakında':'')+'</option>').join("");
    if (!state.konuId) sel.value = "";
    BIY._konuVurgu();
    BIY._pdfOnizleGuncelle();
  },
  konuSec(id){
    state.konuId = id || null;
    if (state.konuId){
      const set = BIY._secSet();
      if (set.size){ set.clear(); state.soruSayisi = null; }   // havuzdan vazgeçildi → seçimi + soru sayısını sıfırla
    }
    BIY._konuVurgu();
    BIY._soruSecSayiGuncelle();   // havuz tuşu/sayaç + pdf + sınır + menü hepsini günceller
  },

  /* ---------- Soru Havuzu (elle seçim) ---------- */
  _secSet(){ if (!state.secilenSet) state.secilenSet = new Set(); return state.secilenSet; },
  _soruSecSayiGuncelle(){
    const n = BIY._secSet().size;
    // havuzdan soru seçildiyse konu seçimi kalkar (tek kaynak: havuz ya da konu)
    if (n > 0 && state.konuId){ state.konuId = null; const sel = $("konuSecim"); if (sel) sel.value = ""; BIY._konuVurgu(); }
    const b = $("soruSecSayi"); if (b) b.textContent = "(" + n + ")";
    const btn = $("soruSecBtn"); if (btn) btn.classList.toggle("biy-secili-var", n > 0);
    BIY._pdfOnizleGuncelle();
    BIY._soruSayiSinir();
    BIY._menuDurum();
  },
  soruSecAc(){
    if ($("soruSecBtn") && $("soruSecBtn").disabled) return;
    const eski = $("biySoruSec"); if (eski) eski.remove();
    state.soruSecArama = "";
    const ov = document.createElement("div"); ov.id = "biySoruSec"; ov.className = "biy-onay-ov biy-soru-sec-ov";
    ov.innerHTML =
      '<div class="biy-soru-sec-kutu">' +
        '<div class="biy-soru-sec-bas">' +
          '<h3>🎯 Soru Havuzu</h3>' +
          '<span class="biy-soru-sec-say" id="soruSecSecili"></span>' +
          '<button class="biy-soru-sec-kapat" onclick="BIY.soruSecKapat()">✕</button>' +
        '</div>' +
        '<div class="biy-soru-sec-liste" id="soruSecListe"></div>' +
        '<div class="biy-soru-sec-alt">' +
          '<button class="biy-btn biy-onay-hayir" onclick="BIY.soruSecTemizle()">Tümünü Temizle</button>' +
          '<button class="biy-btn biy-btn-yesil" onclick="BIY.soruSecKapat()">Bitti</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    ov.addEventListener("click", e => { if (e.target === ov) BIY.soruSecKapat(); });
    BIY._soruSecRender();
  },
  soruSecAra(v){ state.soruSecArama = (v||"").toLowerCase(); BIY._soruSecRender(); },
  _soruSecRender(){
    const kap = $("soruSecListe"); if (!kap) return;
    const set = BIY._secSet();
    const ara = state.soruSecArama;
    const zorAd = { 1:"Kolay", 2:"Orta", 3:"Zor" };
    let html = "";
    KONULAR.forEach(k => {
      if (!Array.isArray(k.sorular) || !k.sorular.length) return;
      const sorular = k.sorular.filter(q => !ara || (q.soru + " " + (q.arapca||"") + " " + q.secenekler.join(" ")).toLowerCase().indexOf(ara) >= 0);
      if (!sorular.length) return;
      const seciliSay = k.sorular.filter(q => set.has(k.id + "#" + q.id)).length;
      const acik = ara ? true : !!(state.soruSecAcik && state.soruSecAcik[k.id]);
      html += '<div class="biy-hs-grup'+(acik?' acik':'')+'" data-konu="'+k.id+'">' +
        '<div class="biy-hs-baslik" onclick="BIY.soruSecAkordiyon(\''+k.id+'\')">' +
        '<span class="biy-hs-ok">▸</span>' +
        '<b>'+kacis(k.ad)+'</b> <span class="biy-hs-say">('+seciliSay+'/'+k.sorular.length+')</span>' +
        '<button class="biy-hs-tumu" onclick="event.stopPropagation();BIY.soruSecTumu(\''+k.id+'\')">Tümünü seç/kaldır</button></div>' +
        '<div class="biy-hs-govde">';
      sorular.forEach(q => {
        const key = k.id + "#" + q.id; const sec = set.has(key);
        const dogruSik = q.secenekler[q.dogru];
        html += '<label class="biy-hs-satir'+(sec?' secili':'')+'" data-key="'+key+'">' +
          '<input type="checkbox" '+(sec?'checked':'')+' onchange="BIY.soruSecTik(\''+key+'\', this)">' +
          '<span class="biy-hs-zor z'+q.zorluk+'">'+zorAd[q.zorluk]+'</span>' +
          '<span class="biy-hs-metin">'+kacis(q.soru)+(q.arapca?' <i>'+kacis(q.arapca)+'</i>':'')+
            ' <b class="biy-hs-dogru">✓ '+kacis(dogruSik)+'</b></span>' +
        '</label>';
      });
      html += '</div></div>';
    });
    kap.innerHTML = html || '<p class="biy-alt" style="text-align:center">Sonuç yok.</p>';
    BIY._soruSecSayilar();
  },
  // sayaçları (grup başlıkları + toplam + buton) satırları yeniden çizmeden güncelle
  _soruSecSayilar(){
    const set = BIY._secSet();
    document.querySelectorAll(".biy-hs-grup").forEach(g => {
      const k = KONULAR.find(x => x.id === g.getAttribute("data-konu")); if (!k) return;
      const sec = k.sorular.filter(q => set.has(k.id + "#" + q.id)).length;
      const sp = g.querySelector(".biy-hs-say"); if (sp) sp.textContent = "(" + sec + "/" + k.sorular.length + ")";
    });
    const say = $("soruSecSecili"); if (say) say.textContent = "Seçili: " + set.size;
    BIY._soruSecSayiGuncelle();
  },
  // tek satır: yeniden çizmeden aç/kapa (kaydırma korunur)
  soruSecTik(key, cb){
    const set = BIY._secSet();
    if (set.has(key)) set.delete(key); else set.add(key);
    if (cb){ const row = cb.closest(".biy-hs-satir"); if (row) row.classList.toggle("secili", cb.checked); }
    BIY._soruSecSayilar();
  },
  // akordiyon: başlığa tıkla → aç/kapa (yeniden çizmeden, kaydırma korunur)
  soruSecAkordiyon(konuId){
    if (!state.soruSecAcik) state.soruSecAcik = {};
    state.soruSecAcik[konuId] = !state.soruSecAcik[konuId];
    const g = document.querySelector('.biy-hs-grup[data-konu="'+konuId+'"]');
    if (g) g.classList.toggle("acik", !!state.soruSecAcik[konuId]);
  },
  soruSecTumu(konuId){
    const set = BIY._secSet();
    const k = KONULAR.find(x => x.id === konuId); if (!k) return;
    const hepsiSecili = k.sorular.every(q => set.has(konuId + "#" + q.id));
    k.sorular.forEach(q => { const key = konuId + "#" + q.id; if (hepsiSecili) set.delete(key); else set.add(key); });
    BIY._soruSecRender();
  },
  soruSecTemizle(){ BIY._secSet().clear(); BIY._soruSecRender(); BIY._soruSecSayiGuncelle(); },
  soruSecKapat(){ const ov = $("biySoruSec"); if (ov) ov.remove(); BIY._soruSecSayiGuncelle(); },
  // elle seçilen sorular (havuzdan) — sıralı liste
  _secilenSorular(){
    const set = BIY._secSet(); if (!set.size) return [];
    return BIY._soruHavuzu().filter(h => set.has(h.key)).map(h => h.soru);
  },
  // seçili konu+seviyedeki mevcut soruya göre soru sayısı üst sınırını ayarla
  _soruSayiSinir(){
    const havuz = BIY._secSet().size;
    const inp = $("soruSayiInput");
    const lbl = document.querySelector(".biy-sorusayi-secim .biy-seviye-label");
    // HAVUZ seçili → soru sayısı = seçilen soru sayısı (sabit); hazır rakamlar pasif, manuel alanda o sayı yazılı
    if (havuz > 0){
      state.soruSayiMax = havuz;
      state.soruSayisi = havuz;
      state.soruSayiHavuzdan = true;   // bu sayı havuzdan geldi → havuz bırakılınca sıfırlanacak
      document.querySelectorAll(".biy-sayi-btn").forEach(b => { b.disabled = true; b.classList.add("biy-pasif"); b.classList.remove("secili"); });
      if (inp){ inp.disabled = false; inp.readOnly = true; inp.max = havuz; inp.min = 1; inp.value = havuz; inp.classList.add("biy-secili"); }
      if (lbl) lbl.textContent = "Soru sayısı (havuzdan " + havuz + "):";
      return;
    }
    // havuz modundan çıkıldıysa havuz kaynaklı soru sayısını sıfırla (öğretmen yeniden seçsin)
    if (state.soruSayiHavuzdan){ state.soruSayisi = null; state.soruSayiHavuzdan = false; }
    let mevcut;
    // dijital yarışma seçilen zorluğu önceliklendirip gerekirse diğer zorluklardan tamamlar → üst sınır konunun TÜM sorusu
    if (state.konuId) mevcut = BIY._aktifSorular().length;
    else mevcut = 50;                                                    // konu/havuz yok → sınır uygulanmasın
    const max = Math.max(1, Math.min(50, mevcut));
    state.soruSayiMax = max;
    document.querySelectorAll(".biy-sayi-btn").forEach(b => {
      const v = +b.getAttribute("data-sayi"); const dis = v > max;
      b.disabled = dis; b.classList.toggle("biy-pasif", dis);
    });
    if (inp){ inp.disabled = false; inp.readOnly = false; inp.classList.remove("biy-secili"); inp.max = max; inp.min = 1; inp.placeholder = "≤ " + max; }
    if (lbl) lbl.textContent = "Soru sayısı (en çok " + max + "):";
    if (state.soruSayisi != null){ if (state.soruSayisi > max) BIY.setSoruSayisi(max); else BIY.setSoruSayisi(state.soruSayisi); }
    else { document.querySelectorAll(".biy-sayi-btn").forEach(b => b.classList.remove("secili")); if (inp) inp.value = ""; }
  },
  _pdfOnizleGuncelle(){
    const havuz = BIY._secSet().size;
    const k = BIY._aktifKonu();
    const baslik = $("pdfBaslik"); if (baslik) baslik.textContent = havuz > 0 ? "Karışık" : (k ? (k.ad || "") : "");
    const kart = $("pdfKart"), indir = $("pdfIndir");
    const varMi = !havuz && !!(k && k.pdf);
    const url = varMi ? encodeURI(k.pdf) : "";
    if (kart){ if (varMi){ kart.href = url; kart.classList.remove("biy-pasif"); } else { kart.removeAttribute("href"); kart.classList.add("biy-pasif"); } }
    if (indir){
      if (varMi){ indir.href = url; indir.setAttribute("download", k.pdf); indir.classList.remove("gizli"); }
      else { indir.removeAttribute("href"); indir.classList.add("gizli"); }
    }
  },

  /* ---------- Sorular önizleme ---------- */
  acSorular(){ BIY.sorularSekme(state.sorularZ || 1); ekranGoster("ekranSorular"); },
  sorularSekme(z){
    state.sorularZ = z;
    document.querySelectorAll(".biy-sekme").forEach(b => b.classList.toggle("secili", +b.getAttribute("data-z") === z));
    const liste = $("sorularListe"); liste.innerHTML = "";
    const list = BIY._aktifSorular().filter(s => s.zorluk === z);
    if (!list.length){ liste.innerHTML = '<p class="biy-alt" style="text-align:center">Bu konuda bu seviyede henüz örnek yok.</p>'; return; }
    // her soru tipinden yalnızca bir örnek göster (tüm sorular değil)
    const gorulen = new Set(); const ornekler = [];
    list.forEach(s => { if (!gorulen.has(s.tip)){ gorulen.add(s.tip); ornekler.push(s); } });
    ornekler.forEach(s => liste.appendChild(BIY._soruKartEl(s, true)));
  },
  _soruKartEl(s, dogruGoster){
    const t = TIP_BILGI[s.tip] || { ad: s.tip, emoji: "❓" };
    const kart = document.createElement("div"); kart.className = "biy-soru-kart";
    let sikHtml = "";
    s.secenekler.forEach((sec, i) => {
      const dogruMu = dogruGoster && i === s.dogru;
      const sinif = "biy-secenek" + (dogruMu ? " dogru" : "") + (s.arSecenek ? " biy-arapca-secenek" : "");
      sikHtml += '<div class="'+sinif+'"><span class="biy-sik">'+String.fromCharCode(65+i)+'</span><span class="biy-secenek-metin">'+ kacis(sec) +'</span></div>';
    });
    kart.innerHTML =
      '<span class="biy-soru-tip">'+t.emoji+' '+t.ad+'</span>' +
      '<span class="biy-zorluk z'+s.zorluk+'">'+ ZORLUK_AD[s.zorluk] +'</span>' +
      '<div class="biy-soru-metin">'+ kacis(s.soru) +'</div>' +
      (s.arapca ? '<div class="biy-soru-arapca">'+ kacis(s.arapca) +'</div>' : '') +
      '<div class="biy-secenekler">'+ sikHtml +'</div>';
    return kart;
  },

  // ana menü kartları: geçerli içerik (havuz soruları veya soru içeren konu) seçiliyken aktif olur
  _menuDurum(){
    const havuz = BIY._secSet().size;
    const konuVar = (BIY._aktifSorular().length > 0);
    const icerik = havuz > 0 || konuVar;                 // konu ya da havuzdan soru
    const sayiSecili = (state.soruSayisi != null && state.soruSayisi > 0);  // soru sayısı seçili
    const aktif = icerik && sayiSecili;
    ["kartSinif", "kartDijital"].forEach(id => { const el = $(id); if (el) el.classList.toggle("biy-pasif", !aktif); });
    const not = $("menuNot"); if (not) not.classList.toggle("gizli", aktif);
    BIY._dijitalKartDurum();
  },
  // bağlı cihaz varsa Dijital Yarışma kartının çerçevesi yeşil + rozet
  _dijitalKartDurum(){
    const bagli = (state.takimListe || []).filter(t => t.bagli).length;
    const aktifOda = !!state.odaId && bagli > 0;
    const el = $("kartDijital"); if (el) el.classList.toggle("biy-bagli-var", aktifOda);
    const rozet = $("dijitalBagliRozet");
    if (rozet){ rozet.textContent = "● " + bagli + " cihaz bağlı"; rozet.classList.toggle("gizli", !aktifOda); }
  },

  /* ---------- Sınıf Modu (çevrimdışı: soruları sınıfça çöz) ---------- */
  // yukarıda seçilen konuyu / havuz sorularını kullanır (ekranında ayrı seçim yok)
  acSinif(){
    const havuz = BIY._secilenSorular();
    let list, kaynak;
    if (havuz.length){ list = havuz.slice(); kaynak = "Karışık · seçili sorular (" + havuz.length + ")"; }
    else {
      const k = BIY._aktifKonu(); if (!k) return;   // konu da havuz da yoksa açma
      list = (k.sorular || []).slice();             // konunun tüm soruları (zorluk fark etmez)
      kaynak = k.ad;
    }
    if (!list.length){   // soru yoksa uyar
      state.sinifList = []; state.sinifIndex = 0; state.sinifCevapAcik = false;
      const kb0 = $("sinifKaynak"); if (kb0) kb0.textContent = kaynak;
      BIY._sinifRender();
      ekranGoster("ekranSinif");
      return;
    }
    // her açılışta: şıkları karıştır (doğru hep A olmasın) + soru sırasını karıştır
    list = list.map(soruHazirla);
    for (let i = list.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); const g = list[i]; list[i] = list[j]; list[j] = g; }
    // seçilen soru sayısını uygula (konudan rastgele N; havuzda zaten seçilenler)
    if (!havuz.length && state.soruSayisi != null && state.soruSayisi > 0 && state.soruSayisi < list.length){
      list = list.slice(0, state.soruSayisi);
      kaynak = kaynak + " · " + list.length + " soru";
    }
    state.sinifList = list; state.sinifIndex = 0; state.sinifCevapAcik = false;
    const kb = $("sinifKaynak"); if (kb) kb.textContent = kaynak;
    BIY._sinifRender();
    ekranGoster("ekranSinif");
  },
  sinifGit(delta){
    const n = (state.sinifList || []).length; if (!n) return;
    state.sinifIndex = (state.sinifIndex + delta + n) % n;
    state.sinifCevapAcik = false;
    BIY._sinifRender();
  },
  sinifCevap(){ state.sinifCevapAcik = !state.sinifCevapAcik; BIY._sinifRender(); },
  _sinifRender(){
    const govde = $("sinifGovde"); if (!govde) return;
    const list = state.sinifList || [];
    const sayac = $("sinifSayac"), cbtn = $("sinifCevapBtn");
    if (!list.length){
      govde.innerHTML = '<div class="biy-sinif-bos">Bu konuda bu seviyede henüz soru yok.</div>';
      if (sayac) sayac.textContent = "0 / 0";
      if (cbtn) cbtn.textContent = "Cevabı Göster";
      return;
    }
    if (state.sinifIndex >= list.length) state.sinifIndex = 0;
    const s = list[state.sinifIndex];
    const t = TIP_BILGI[s.tip] || { ad: s.tip, emoji: "❓" };
    let sikHtml = "";
    s.secenekler.forEach((sec, i) => {
      const dogruMu = state.sinifCevapAcik && i === s.dogru;
      const sinif = "biy-secenek" + (dogruMu ? " dogru" : "") + (s.arSecenek ? " biy-arapca-secenek" : "");
      sikHtml += '<div class="'+sinif+'"><span class="biy-sik">'+String.fromCharCode(65+i)+'</span><span class="biy-secenek-metin">'+ kacis(sec) +'</span></div>';
    });
    govde.innerHTML =
      '<div class="biy-sinif-soru">' +
        '<span class="biy-soru-tip">'+t.emoji+' '+t.ad+'</span>' +
        (s.arapca ? '<div class="biy-sinif-arapca">'+ kacis(s.arapca) +'</div>' : '') +
        '<div class="biy-sinif-metin">'+ kacis(s.soru) +'</div>' +
      '</div>' +
      '<div class="biy-sinif-siklar">'+ sikHtml +'</div>';
    if (sayac) sayac.textContent = (state.sinifIndex + 1) + " / " + list.length;
    if (cbtn) cbtn.textContent = state.sinifCevapAcik ? "Cevabı Gizle" : "Cevabı Göster";
  },

  /* ---------- Takım Oluştur / Lobi ---------- */
  acTakimlar(){
    ekranGoster("ekranTakimlar");
    if (!state.odaId){
      $("takimlarGrid").innerHTML = "";
      const b = $("baslatBtn"); if (b) b.classList.add("gizli");
      const n = $("baslatNot"); if (n) n.textContent = "";
      BIY._kontrolleriAc();
    }
    BIY._soruSayiSinir(); BIY._soruSecSayiGuncelle();
  },
  // --- Kalıcılık (sayfa yenilense de oyun kaybolmasın) ---
  _kaydet(){
    try { localStorage.setItem('biy_aktif', JSON.stringify({ oda: state.odaId, sorular: state.oyunSorulari, yedek: state.yedekSorular, yedekMap: state.yedekSoruMap, seviye: state.seviye, soruSayisi: state.soruSayisi,
      ber: { hedef: state.berHedef, takimlar: state.berTakimlar, sabit: state.berSabit, no: state.berNo, sorular: state.berSorular }, ts: Date.now() })); } catch(e){}
  },
  _temizleKayit(){ try { localStorage.removeItem('biy_aktif'); } catch(e){} },
  async _devamEt(kayit){
    try {
      if (kayit.ts && (Date.now() - kayit.ts) > 12*3600*1000){ BIY._temizleKayit(); ekranGoster('ekranAnasayfa'); return; }
      const ref = db.collection(KOLEKSIYON).doc(kayit.oda);
      const snap = await ref.get();
      const dr0 = snap.exists ? snap.data().durum : null;
      // yalnızca AKTİF oyun (oyun/beraberlik) kaldığı yerden devam eder; lobi/bitti → ana sayfa
      if (dr0 !== 'oyun' && dr0 !== 'beraberlik'){ BIY._temizleKayit(); ekranGoster('ekranAnasayfa'); return; }
      state.odaId = kayit.oda;
      state.oyunSorulari = Array.isArray(kayit.sorular) ? kayit.sorular : [];
      state.yedekSorular = Array.isArray(kayit.yedek) ? kayit.yedek : [];
      state.yedekSoruMap = kayit.yedekMap || {};
      state.soruSayisi = kayit.soruSayisi || 20;
      if (kayit.ber){ state.berHedef = kayit.ber.hedef||0; state.berTakimlar = kayit.ber.takimlar||[]; state.berSabit = kayit.ber.sabit||{}; state.berNo = kayit.ber.no||0; state.berSorular = kayit.ber.sorular||[]; }
      if (state.takimAbone) state.takimAbone();
      state.takimAbone = ref.collection('takimlar').orderBy('olusturmaZamani').onSnapshot(s => BIY._takimlariCiz(s));
      BIY._adminOyunaGec();   // aktif oyuna geri dön
    } catch(e){ console.error('Devam hatası:', e); BIY._temizleKayit(); ekranGoster('ekranAnasayfa'); }
  },
  // özel onay penceresi (native confirm yerine)
  _onay(baslik, metin, evetMetin, onEvet){
    const eski = $("biyOnay"); if (eski) eski.remove();
    const ov = document.createElement("div"); ov.id = "biyOnay"; ov.className = "biy-onay-ov";
    ov.innerHTML = '<div class="biy-onay-kutu"><h3>'+kacis(baslik)+'</h3><p>'+kacis(metin)+'</p>' +
      '<div class="biy-onay-btnlar"><button class="biy-onay-hayir">Vazgeç</button><button class="biy-onay-evet">'+kacis(evetMetin)+'</button></div></div>';
    document.body.appendChild(ov);
    const kapat = () => { if (ov.parentNode) ov.remove(); };
    ov.querySelector(".biy-onay-hayir").onclick = kapat;
    ov.querySelector(".biy-onay-evet").onclick = () => { kapat(); onEvet(); };
    ov.addEventListener("click", e => { if (e.target === ov) kapat(); });
  },
  // canlı yarışmadan çıkış → lobiye dön (takım bağlantıları KORUNUR)
  yaristanCik(){
    BIY._onay("Lobiye dönülsün mü?",
      "Yarışma durdurulup lobiye dönülür. Takım bağlantıları korunur — konu veya soru sayısını değiştirip yeniden başlatabilirsiniz.",
      "Evet, lobiye dön", function(){ BIY.lobiyeDon(); });
  },
  // oyunu durdurup lobiye döner; oda + takım karekod bağlantıları kopmaz
  async lobiyeDon(){
    // 1) oyun dinleyicilerini kapat (takım aboneliği KORUNUR → kartlar canlı kalır)
    if (state.odaAboneAdmin){ state.odaAboneAdmin(); state.odaAboneAdmin = null; }
    if (state.cevapAbone){ state.cevapAbone(); state.cevapAbone = null; }
    sayacDurdur(); BIY._sonucTemizle();
    // 2) odayı lobiye al + eski cevapları temizle (yeni tura karışmasın), bağlantı kopmaz
    try {
      if (state.odaId){
        await BIY._cevaplariSil();
        await db.collection(KOLEKSIYON).doc(state.odaId).update({
          durum: "lobi", faz: "cevap", aktifIndex: -1, toplamSoru: 0,
          sonSira: [], berHedef: 0, berTakimlar: [], berSabit: {}, berNo: 0
        });
      }
    } catch(e){ console.error(e); }
    // 3) oyun/beraberlik state'ini sıfırla (odaId ve takımlar korunur)
    state.oyunSorulari = []; state.oda = null; state.otoSonucIndex = -1; state.sonucAnimIndex = -1; state.finalKonfeti = false;
    state.hepsiSesIndex = -1;
    state.yedekSorular = []; state.yedekSoruMap = {}; state.berHedef = 0; state.berTakimlar = []; state.berSabit = {}; state.berNo = 0; state.berSorular = [];
    state.ayarKilidiKapali = true;   // lobiye döndük → ayarlar takım bağlıyken de değiştirilebilir
    BIY._temizleKayit();
    // 4) lobi ekranına dön, ayarları aç
    ekranGoster("ekranTakimlar");
    BIY._kontrolleriAc();
    BIY._soruSayiSinir(); BIY._soruSecSayiGuncelle();
  },
  // odanın cevaplar alt-koleksiyonunu temizle (oda yeniden kullanılırken)
  _cevaplariSil(){
    if (!state.odaId) return Promise.resolve();
    return db.collection(KOLEKSIYON).doc(state.odaId).collection("cevaplar").get().then(cs => {
      if (cs.empty) return;
      const batch = db.batch(); cs.forEach(d => batch.delete(d.ref)); return batch.commit();
    }).catch(e => console.warn("cevap temizle:", e));
  },
  oyunuBitir(){
    BIY._temizleKayit();
    if (state.odaAboneAdmin) state.odaAboneAdmin();
    if (state.cevapAbone) state.cevapAbone();
    if (state.takimAbone) state.takimAbone();
    BIY._sonucTemizle();
    state.odaId = null; state.oyunSorulari = []; state.oda = null; state.otoSonucIndex = -1; state.sonucAnimIndex = -1; state.finalKonfeti = false;
    state.baglSet = null; state.baglIlk = false; state.hepsiSesIndex = -1;
    state.yedekSorular = []; state.yedekSoruMap = {}; state.berHedef = 0; state.berTakimlar = []; state.berSabit = {}; state.berNo = 0; state.berSorular = [];
    state.ayarKilidiKapali = false;
    if (state.secilenSet) state.secilenSet.clear(); BIY._soruSecSayiGuncelle();
    BIY._kontrolleriAc();
    const bB = $("baslatBtn"); if (bB) bB.classList.add("gizli");
    const bN = $("baslatNot"); if (bN) bN.textContent = "";
    BIY.anasayfa();
  },
  // takım silinince/yarış bitince kilitli tüm ayar kontrollerini yeniden aç
  _kontrolleriAc(){
    document.querySelectorAll(".biy-seviye-btn, .biy-sayi-btn").forEach(b => { b.disabled = false; b.classList.remove("biy-pasif"); });
    ["soruSayiInput", "soruSecBtn", "konuSecim"].forEach(id => { const el = $(id); if (el){ el.disabled = false; el.classList.remove("biy-pasif"); } });
    document.querySelectorAll(".biy-seviye-label").forEach(l => l.classList.remove("biy-pasif"));
  },

  async _odayiHazirla(){
    if (state.odaId) return state.odaId;
    let kod, ref, mevcut = true, deneme = 0;
    while (mevcut && deneme < 6){
      kod = rastgeleKod(4); ref = db.collection(KOLEKSIYON).doc(kod);
      const snap = await ref.get(); mevcut = snap.exists; deneme++;
    }
    await ref.set({
      durum: "lobi", faz: "cevap", aktifIndex: -1, toplamSoru: 0, soruSuresi: SORU_SURESI,
      olusturan: state.uid || null, olusturmaZamani: firebase.firestore.FieldValue.serverTimestamp()
    });
    state.odaId = kod;
    if (state.takimAbone) state.takimAbone();
    state.takimAbone = db.collection(KOLEKSIYON).doc(kod).collection("takimlar")
      .orderBy("olusturmaZamani").onSnapshot(snap => BIY._takimlariCiz(snap));
    BIY._kaydet();
    return kod;
  },
  async takimEkle(){
    const inp = $("takimAdiInput"); const ad = (inp.value || "").trim();
    if (!ad){ inp.focus(); return; }
    inp.value = "";
    try {
      const oda = await BIY._odayiHazirla();
      const takimId = rastgeleKod(5);
      await db.collection(KOLEKSIYON).doc(oda).collection("takimlar").doc(takimId).set({
        ad: ad, bagli: false, puan: 0, olusturmaZamani: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch(e){ console.error(e); $("baslatNot").textContent = "Takım eklenemedi (Firebase izinleri?): " + (e.code || e.message); }
  },
  _takimlariCiz(snap){
    state.takimListe = [];
    const grid = $("takimlarGrid"); grid.innerHTML = "";
    let sayi = 0, bagli = 0;
    snap.forEach(doc => {
      const t = doc.data(); state.takimListe.push({ id: doc.id, ad: t.ad, bagli: !!t.bagli, puan: t.puan || 0 });
      sayi++; if (t.bagli) bagli++;
      const link = takimLinki(state.odaId, doc.id); const qrId = "qr_" + doc.id;
      const kart = document.createElement("div"); kart.className = "biy-takim-kart " + (t.bagli ? "biy-kart-bagli" : "biy-kart-bekliyor");
      kart.innerHTML =
        '<button class="biy-sil" title="Sil" onclick="BIY.takimSil(\''+doc.id+'\')">✕</button>' +
        '<h3>'+ kacis(t.ad) +'</h3>' +
        '<div class="biy-takim-durum '+(t.bagli?"biy-bagli":"biy-bekliyor")+'">'+(t.bagli?"● Bağlandı":"○ Bekleniyor")+'</div>' +
        '<div class="biy-qr" id="'+qrId+'"></div>' +
        '<div class="biy-takim-link"><input readonly value="'+ kacis(link) +'"><button class="biy-kopya" onclick="BIY.kopyala(this)">Kopyala</button></div>';
      grid.appendChild(kart);
      try { const box = $(qrId); if (box && window.QRCode){ box.innerHTML=""; new QRCode(box, { text: link, width: 170, height: 170, correctLevel: QRCode.CorrectLevel.M }); } }
      catch(err){ console.warn("QR:", err); }
    });
    // takım eklendiyse zorluk seviyesi, soru sayısı ve soru seçimi kilitlenir; hepsi silinince açılır
    // (lobiye dönüldüyse ayarKilidiKapali=true → takım bağlıyken de değiştirilebilir)
    const kilit = sayi > 0 && !state.ayarKilidiKapali;
    document.querySelectorAll(".biy-seviye-btn, .biy-sayi-btn").forEach(b => { b.disabled = kilit; b.classList.toggle("biy-pasif", kilit); });
    const sInp = $("soruSayiInput"); if (sInp){ sInp.disabled = kilit; sInp.classList.toggle("biy-pasif", kilit); }
    const ssBtn = $("soruSecBtn"); if (ssBtn){ ssBtn.disabled = kilit; ssBtn.classList.toggle("biy-pasif", kilit); }
    const kSel = $("konuSecim"); if (kSel){ kSel.disabled = kilit; kSel.classList.toggle("biy-pasif", kilit); }
    const sLbl = document.querySelector(".biy-sorusayi-secim .biy-seviye-label");
    const zLbl = document.querySelector(".biy-seviye-secim .biy-seviye-label");
    if (zLbl) zLbl.classList.toggle("biy-pasif", kilit);
    if (sLbl) sLbl.classList.toggle("biy-pasif", kilit);
    if (!kilit) BIY._soruSayiSinir();   // kilit açıldıysa mevcut soruya göre üst sınırı yeniden uygula

    const baslat = $("baslatBtn");
    // yarışma yalnızca en az 2 takım varsa VE hepsi bağlandıysa başlatılabilir
    const hepsiBagli = (sayi >= 2 && bagli === sayi);
    if (hepsiBagli) baslat.classList.remove("gizli"); else baslat.classList.add("gizli");
    $("baslatNot").textContent =
      sayi === 0 ? "" :
      (sayi < 2 ? (sayi + " takım · başlatmak için en az 2 takım gerekli")
                : (bagli < sayi ? (sayi + " takım · " + bagli + " bağlandı — hepsi bağlanınca başlatılabilir"
                                   + " (" + (sayi - bagli) + " takım bekleniyor)")
                                : ("✓ " + sayi + " takım hazır — başlatabilirsiniz")));
    // yeni bağlanan takım(lar) için ses (açılışta çalmaz)
    const simdiBagli = new Set(state.takimListe.filter(t => t.bagli).map(t => t.id));
    if (state.baglIlk && state.baglSet){
      let yeni = false; simdiBagli.forEach(id => { if (!state.baglSet.has(id)) yeni = true; });
      if (yeni) SES.baglandi();
    }
    state.baglSet = simdiBagli; state.baglIlk = true;
    BIY._dijitalKartDurum();   // ana menü kartı için bağlı cihaz göstergesini güncelle
  },
  async takimSil(takimId){
    if (!state.odaId) return;
    try { await db.collection(KOLEKSIYON).doc(state.odaId).collection("takimlar").doc(takimId).delete(); } catch(e){ console.error(e); }
  },
  kopyala(btn){
    const inp = btn.parentElement.querySelector("input");
    inp.select(); inp.setSelectionRange(0, 99999);
    try { navigator.clipboard.writeText(inp.value); btn.textContent = "✓"; setTimeout(()=>btn.textContent="Kopyala", 1200); } catch(e){ document.execCommand("copy"); }
  },

  /* ---------- YARIŞMAYI BAŞLAT (oyun döngüsü) ---------- */
  setSoruSayisi(n){
    const max = state.soruSayiMax || 50;
    n = Math.max(1, Math.min(max, parseInt(n, 10) || max));
    state.soruSayisi = n;
    state.soruSayiHavuzdan = false;
    const hazir = SORU_SAYI_SECENEK.indexOf(n) >= 0;
    document.querySelectorAll(".biy-sayi-btn").forEach(b => b.classList.toggle("secili", +b.getAttribute("data-sayi") === n));
    const inp = $("soruSayiInput"); if (inp){ inp.value = hazir ? "" : n; }
    BIY._menuDurum();
  },
  setSoruSayisiManuel(v){
    let n = parseInt(v, 10);
    if (isNaN(n)){ return; }
    const max = state.soruSayiMax || 50;
    n = Math.max(1, Math.min(max, n));
    state.soruSayisi = n;
    state.soruSayiHavuzdan = false;
    // manuel giriş yapıldı → hazır rakamlardaki yeşil vurgu kalksın
    document.querySelectorAll(".biy-sayi-btn").forEach(b => b.classList.remove("secili"));
    const inp = $("soruSayiInput"); if (inp) inp.value = n;
    BIY._menuDurum();
  },

  async yarisiBaslat(){
    if (!state.odaId) return;
    // tüm takımlar bağlanmadan başlatılamaz
    const sayi = state.takimListe.length;
    const bagli = state.takimListe.filter(t => t.bagli).length;
    if (sayi < 2){ $("baslatNot").textContent = "Başlatmak için en az 2 takım gerekli."; return; }
    if (bagli < sayi){ $("baslatNot").textContent = "Tüm takımlar bağlanmadan yarışma başlatılamaz (" + (sayi - bagli) + " takım bekleniyor)."; return; }

    let secilen, yedek;
    const elle = BIY._secilenSorular();   // öğretmenin havuzdan elle seçtiği sorular
    if (elle.length){
      // MANUEL: yalnızca öğretmenin görüp seçtiği sorular sorulur
      let hv = elle.slice();
      for (let i = hv.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); const g = hv[i]; hv[i] = hv[j]; hv[j] = g; }
      secilen = hv.map(soruHazirla);
      yedek = [];   // görülmemiş yedek sorulmaz
    } else {
      const tumu = BIY._aktifSorular().slice();   // konunun tüm soruları (zorluk fark etmez)
      if (!tumu.length){ $("baslatNot").textContent = "«" + (BIY._aktifKonu() ? BIY._aktifKonu().ad : "") + "» konusunda henüz soru yok."; return; }
      for (let i = tumu.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); const g = tumu[i]; tumu[i] = tumu[j]; tumu[j] = g; }
      const hedefSayi = Math.max(1, Math.min(50, state.soruSayisi || TUR_SORU_SAYISI));
      secilen = tumu.slice(0, Math.min(hedefSayi, tumu.length)).map(soruHazirla);
      yedek = tumu.slice(secilen.length).map(soruHazirla);
    }
    state.oyunSorulari = secilen;
    state.yedekSorular = yedek;   // beraberlikte yedek olarak kullanılır
    state.yedekSoruMap = {};
    state.berHedef = 0; state.berTakimlar = []; state.berSabit = {}; state.berNo = 0; state.berSorular = [];
    state.ayarKilidiKapali = false;   // yeni tur başladı → normal kilit davranışı
    await BIY._cevaplariSil();         // oda yeniden kullanılıyorsa eski cevapları temizle
    try {
      await db.collection(KOLEKSIYON).doc(state.odaId).update({
        durum: "oyun", faz: "cevap", aktifIndex: 0, toplamSoru: secilen.length, soruSuresi: SORU_SURESI,
        soruIdSirasi: secilen.map(s => s.id),
        aktifSoru: temizSoru(secilen[0]),
        soruBaslangic: firebase.firestore.FieldValue.serverTimestamp()
      });
      BIY._kaydet();
      BIY._adminOyunaGec();
    } catch(e){ console.error(e); $("baslatNot").textContent = "Başlatılamadı: " + (e.code || e.message); }
  },

  _adminOyunaGec(){
    ekranGoster("ekranOyunAdmin");
    if (state.odaAboneAdmin) state.odaAboneAdmin();
    state.odaAboneAdmin = db.collection(KOLEKSIYON).doc(state.odaId).onSnapshot(d => {
      state.oda = d.data() || null;
      BIY._renderAdminOyun();
    });
    if (state.cevapAbone) state.cevapAbone();
    state.cevaplar = {};
    state.cevapAbone = db.collection(KOLEKSIYON).doc(state.odaId).collection("cevaplar").onSnapshot(snap => {
      state.cevaplar = {}; snap.forEach(d => state.cevaplar[d.id] = d.data());
      BIY._renderAdminOyun();
    });
  },

  _renderAdminOyun(){
    const o = state.oda, kap = $("ekranOyunAdmin");
    if (!o) return;
    if (o.durum === "bitti"){
      sayacDurdur(); BIY._sonucTemizle();
      kap.innerHTML = BIY._leaderboardHtml(true);
      if (!state.finalKonfeti){ state.finalKonfeti = true; BIY._konfetiPatlat(); }
      return;
    }
    const ber = (o.durum === "beraberlik");
    const idx = o.aktifIndex || 0;
    const soru = BIY._soruByIndex(idx);
    if (!soru){ kap.innerHTML = '<div class="biy-oyun-orta"><p class="biy-alt">Bu turun soruları bellekte yok (sayfa yenilenmiş olabilir). Lütfen yarışmayı yeniden başlatın.</p><button class="biy-btn biy-btn-mavi" onclick="BIY.anasayfa()">Ana Menü</button></div>'; return; }
    const sonuc = (o.faz === "sonuc");
    const t = TIP_BILGI[soru.tip] || { ad: soru.tip, emoji: "❓" };
    // SONUÇ EKRANI — soru ekranından tamamen ayrı (adım adım animasyonlu)
    if (sonuc){
      sayacDurdur();
      const taze = (state.sonucAnimIndex !== idx);
      kap.innerHTML = BIY._sonucEkranHtml(idx, soru, taze);
      if (taze){
        state.sonucAnimIndex = idx;
        SES.sonuc();                                  // sonuç ekranı açıldı
        BIY._sonucOynat();                            // sıralama sesi FLIP anında (_liderlikGecis) çalar
      }
      return;
    }
    // beraberlikte yalnızca beraber olan takımlar; değilse tüm takımlar
    const katilan = BIY._aktifTakimlar();
    const katilanId = {}; katilan.forEach(t => katilanId[t.id] = true);
    // cevaplar (bu index)
    const buCevaplar = {}; Object.values(state.cevaplar).forEach(c => { if (c.index === idx && katilanId[c.takimId]) buCevaplar[c.takimId] = c; });
    const cevapSayisi = Object.keys(buCevaplar).length;
    // seçenekler
    let opt = "";
    soru.secenekler.forEach((sec, i) => {
      const dogru = sonuc && i === soru.dogru;
      opt += '<div class="biy-a-opt'+(dogru?' dogru':'')+(soru.arSecenek?' ar':'')+'" style="--c:'+SIK_RENK[i]+'">' +
             '<span class="biy-a-harf">'+String.fromCharCode(65+i)+'</span><span class="biy-a-metin">'+kacis(sec)+'</span>'+(dogru?'<span class="biy-a-tik">✓</span>':'')+'</div>';
    });
    // üst bilgi + sayaç
    const kalan = kalanSaniye();
    const yuzde = Math.max(0, Math.min(100, (kalan / (o.soruSuresi || SORU_SURESI)) * 100));
    const gizli = state.soruGizli;
    // göz ikonu (tur sırasının yanında): açık göz = görünür (tıkla gizle), çapraz göz = gizli (tıkla göster)
    const gozSvg = state.soruGizli
      ? '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
      : '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    const gozBtn = '<button class="biy-gizle-svg" title="'+(state.soruGizli?'Soruyu göster':'Soruyu gizle')+'" onclick="BIY.soruGizleToggle()">'+gozSvg+'</button>';

    const cips = katilan.map(tk =>
      '<span class="biy-cip '+(buCevaplar[tk.id]?'ok':'')+'">'+(buCevaplar[tk.id]?'<span class="biy-cip-tik">✓</span> ':'')+kacis(tk.ad)+'</span>'
    ).join("");
    const hepsi = katilan.length > 0 && cevapSayisi >= katilan.length;

    const sayacHtml = '<div class="biy-sayac"><span id="sayacNum">'+kalan+'</span><small>sn</small></div>';
    const barHtml = '<div class="biy-sayac-bar"><i style="width:'+yuzde+'%"></i></div>';
    const siraMetin = ber
      ? '⚔️ '+(o.berHedef===1?'Liderlik':'İkincilik')+' · Yedek Soru '+o.berNo
      : 'Soru '+(idx+1)+' / '+(o.toplamSoru||state.oyunSorulari.length);

    let govde =
      '<div class="biy-oyun-ust">' +
        '<div class="biy-oyun-sira'+(ber?' biy-ber':'')+'">'+siraMetin+' '+gozBtn+'</div>' +
        '<div class="biy-oyun-tip"><span class="biy-soru-tip">'+t.emoji+' '+t.ad+'</span> <span class="biy-zorluk z'+soru.zorluk+'">'+ZORLUK_AD[soru.zorluk]+'</span></div>' +
        // soru gizliyken geri sayım üstte değil, aşağıda büyük gösterilir
        (gizli ? '' : sayacHtml) +
      '</div>' +
      (gizli ? '' : barHtml);

    // soru gizliyken hiçbir kutu gösterilmez (sınıf durumu + geri sayım aşağıda büyük)
    if (!gizli){
      govde += '<div class="biy-oyun-soru">'+ kacis(soru.soru) +'</div>' +
        (soru.arapca ? '<div class="biy-oyun-arapca">'+ kacis(soru.arapca) +'</div>' : '') +
        '<div class="biy-a-optlar">'+ opt +'</div>';
    }
    // sınıfların durumu (gizliyken çok daha büyük)
    govde += '<div class="biy-cevap-durum'+(gizli?' biy-dev':'')+'">'+cevapSayisi+' / '+katilan.length+' takım cevapladı'+(hepsi?' — sonuç açılıyor…':'')+'</div>' +
             '<div class="biy-cipler'+(gizli?' biy-dev':'')+'">'+cips+'</div>';
    // gizliyken geri sayım AŞAĞIDA ve devasa
    if (gizli){
      govde += '<div class="biy-alt-sayac">'+barHtml+'<div class="biy-sayac biy-sayac-dev"><span id="sayacNum">'+kalan+'</span><small>sn</small></div></div>';
    }

    kap.innerHTML = '<div class="biy-oyun-orta">'+govde+'</div>';

    // tüm takımlar cevaplayınca ses (soru başına bir kez)
    if (hepsi && state.hepsiSesIndex !== idx){ state.hepsiSesIndex = idx; SES.hepsiCevap(); }
    // otomatik sonuç: tüm takımlar cevaplayınca
    if (hepsi && state.otoSonucIndex !== idx){
      state.otoSonucIndex = idx;
      setTimeout(function(){ if (state.oda && state.oda.faz === 'cevap' && (state.oda.aktifIndex||0) === idx) BIY.sonucGoster(); }, 450);
    }
    // sayaç + süre bitince otomatik sonuç
    sayacBaslat(() => {
      const k = kalanSaniye(); const el = $("sayacNum"); if (el) el.textContent = k;
      const bar = document.querySelector(".biy-sayac-bar i"); if (bar) bar.style.width = Math.max(0, Math.min(100, (k/(o.soruSuresi||SORU_SURESI))*100)) + "%";
      if (k <= 0 && state.oda && state.oda.faz === 'cevap' && (state.oda.aktifIndex||0) === idx && state.otoSonucIndex !== idx){
        state.otoSonucIndex = idx; BIY.sonucGoster();
      }
    });
  },

  // index'e göre soru (ana tur veya yedek)
  _soruByIndex(i){ return (i >= 1000) ? (state.yedekSoruMap && state.yedekSoruMap[i]) : state.oyunSorulari[i]; },
  // bir doğru cevabın puanı: 1000/toplam taban + küçük hız bonusu (en fazla %15)
  _cevapPuani(c){
    const o = state.oda || {};
    const toplam = o.toplamSoru || state.oyunSorulari.length || state.soruSayisi || 1;
    const sure = o.soruSuresi || SORU_SURESI;
    const taban = TOPLAM_PUAN / toplam;
    let hiz = (typeof c.kalan === 'number') ? (c.kalan / sure) : 1;   // eski cevaplarda kalan yoksa tam say
    hiz = Math.max(0, Math.min(1, hiz));
    return Math.round(taban * (1 - ZAMAN_PAYI + ZAMAN_PAYI * hiz));
  },
  // belirli index'e kadar (dahil) her takımın toplam puanı (yedekler dahil)
  _puanKumul(cutoff){
    const t = {};
    Object.values(state.cevaplar).forEach(c => {
      if (c.index > cutoff) return;
      const s = BIY._soruByIndex(c.index); if (!s) return;
      if (c.secilen === s.dogru) t[c.takimId] = (t[c.takimId] || 0) + BIY._cevapPuani(c);
    });
    return t;
  },
  _rank(puanMap, ids){
    const r = {};
    ids.forEach(id => { const p = puanMap[id] || 0; r[id] = 1 + ids.filter(o => (puanMap[o]||0) > p).length; });
    return r;
  },
  // AYRI SONUÇ EKRANI (soru ekranından bağımsız) — adım adım animasyonlu
  // Akış: (0) doğru şık büyük → (1) sınıfların cevapları → (2) doğru şık küçülür → (3) liderlik tablosu büyür + sıra atlayanlar → (4) buton
  _sonucEkranHtml(idx, soru, taze){
    const o = state.oda;
    const ber = (o.durum === "beraberlik");
    const toplam = o.toplamSoru || state.oyunSorulari.length;
    const buCevaplar = {}; Object.values(state.cevaplar).forEach(c => { if (c.index === idx) buCevaplar[c.takimId] = c; });
    // soru + şıklar (doğru şık vurgulu)
    const di = soru.dogru;
    let optHtml = "";
    soru.secenekler.forEach((sec, i) => {
      const dg = (i === di);
      optHtml += '<div class="biy-a-opt'+(dg?' dogru':'')+(soru.arSecenek?' ar':'')+'" style="--c:'+SIK_RENK[i]+'">' +
        '<span class="biy-a-harf">'+String.fromCharCode(65+i)+'</span><span class="biy-a-metin">'+kacis(sec)+'</span>'+(dg?'<span class="biy-a-tik">✓</span>':'')+'</div>';
    });
    // sınıfların sonucu: seçtikleri şık + doğru/yanlış (beraberlikte yalnızca beraber olanlar)
    const arSik = soru.arSecenek ? ' ar' : '';
    const cevapTakimlari = BIY._aktifTakimlar();
    const satir = cevapTakimlari.map((tk,ri) => {
      const c = buCevaplar[tk.id]; const dogruMu = c && c.secilen === di;
      let secim = '<span class="biy-rev-yok">—</span>';
      if (c){ const harf = String.fromCharCode(65 + c.secilen); secim = '<b class="biy-rev-harf">'+harf+'</b> <span class="biy-rev-metin'+arSik+'">'+kacis(soru.secenekler[c.secilen])+'</span>'; }
      const durum = c ? (dogruMu ? '✅ Doğru' : '❌ Yanlış') : '⏳ Cevapsız';
      return '<tr class="'+(c?(dogruMu?'dogru':'yanlis'):'yok')+'" style="--r:'+ri+'"><td>'+kacis(tk.ad)+'</td><td class="biy-rev-sik">'+secim+'</td><td>'+durum+'</td></tr>';
    }).join("");
    // puan durumu (yedekler dahil) + sıra değişimi
    const ids = state.takimListe.map(t => t.id);
    const newP = BIY._puanKumul(idx), prevP = BIY._puanKumul(idx - 1);
    let newOrder, prevOrder;
    if (ber){
      newOrder  = BIY._pinliSira(ids, newP,  o.berTakimlar, o.berSabit, o.berHedef);
      prevOrder = BIY._pinliSira(ids, prevP, o.berTakimlar, o.berSabit, o.berHedef);
    } else {
      newOrder  = ids.slice().sort((a,b) => (newP[b]||0)-(newP[a]||0));
      prevOrder = ids.slice().sort((a,b) => (prevP[b]||0)-(prevP[a]||0));
    }
    const rankMap = arr => { const m = {}; arr.forEach((id,i) => m[id] = i+1); return m; };
    const newR = ber ? rankMap(newOrder) : BIY._rank(newP, ids);
    const prevR = ber ? rankMap(prevOrder) : BIY._rank(prevP, ids);
    const adOf = id => (state.takimListe.find(t => t.id === id)||{}).ad || "";
    const lider = newOrder.map(id => {
      const ns = newR[id] || ids.length, ps = prevR[id] || ids.length, delta = ps - ns;
      const ok = delta > 0 ? '<span class="biy-ok biy-ok-yukari">▲</span>' : (delta < 0 ? '<span class="biy-ok biy-ok-asagi">▼</span>' : '<span class="biy-ok biy-ok-sabit"></span>');
      const cls = delta > 0 ? ' biy-lider-yukari' : (delta < 0 ? ' biy-lider-asagi' : '');
      return '<li class="biy-lider-satir'+cls+'"><span class="biy-lider-sira">'+ns+'</span>'+ok+'<span class="biy-lider-ad">'+kacis(adOf(id))+'</span><b>'+(newP[id]||0)+'</b></li>';
    }).join("");
    const degisti = ids.some(id => (prevR[id]||ids.length) !== (newR[id]||ids.length));
    const son = ber ? true : (idx + 1 >= toplam);
    const step = taze ? 0 : 2;   // yenileme olursa doğrudan son sahne (liderlik)
    const t = TIP_BILGI[soru.tip] || { ad: soru.tip, emoji: "❓" };
    const baslik = ber
      ? '⚔️ '+(o.berHedef===1?'Liderlik':'İkincilik')+' Beraberliği · Yedek Soru '+o.berNo
      : '📊 Sonuç · Soru '+(idx+1)+' / '+toplam;
    return '<div class="biy-oyun-orta biy-sonuc-ekran" data-degisti="'+(degisti?1:0)+'" data-step="'+step+'">' +
      '<div class="biy-sonuc-baslik'+(ber?' biy-ber':'')+'">'+baslik+'</div>' +
      '<div class="biy-sonuc-sahne">' +
        // SAHNE 1: soru cümlesi + şıklar + vurgulu doğru şık
        '<div class="biy-sahne-oge oge-dogru">' +
          '<div class="biy-sonuc-soru-cumle">'+kacis(soru.soru)+'</div>' +
          (soru.arapca ? '<div class="biy-oyun-arapca">'+kacis(soru.arapca)+'</div>' : '') +
          '<div class="biy-a-optlar">'+optHtml+'</div>' +
        '</div>' +
        // SAHNE 2: sınıfların verdiği cevaplar (devasa)
        '<div class="biy-sahne-oge oge-reveal">' +
          '<div class="biy-reveal"><table class="biy-reveal-tablo"><thead><tr><th>Takım</th><th>Seçtiği Şık</th><th>Durum</th></tr></thead><tbody>'+satir+'</tbody></table></div>' +
        '</div>' +
        // SAHNE 3: güncel puan durumu (devasa)
        '<div class="biy-sahne-oge oge-lider">' +
          '<div class="biy-sonuc-lider"><h4>🏆 Puan Durumu</h4><ol class="biy-lider-ol">'+lider+'</ol></div>' +
        '</div>' +
      '</div>' +
      // aşağıda üç ilerleme çizgisi — tıklayınca ilgili sayfaya geçer
      '<div class="biy-sonuc-nokta">' +
        '<button class="biy-nokta" data-adim="0" onclick="BIY.sonucAdim(0)" title="Soru & doğru şık"></button>' +
        '<button class="biy-nokta" data-adim="1" onclick="BIY.sonucAdim(1)" title="Sınıfların cevapları"></button>' +
        '<button class="biy-nokta" data-adim="2" onclick="BIY.sonucAdim(2)" title="Puan durumu"></button>' +
      '</div>' +
      '<div class="biy-oyun-kontrol"><button class="biy-btn biy-btn-buyuk" onclick="BIY.sonrakiSoru()">'+
        (ber ? ((BIY._beraberlikCozuldu() || state.berNo >= state.yedekSorular.length) ? '🏁 Sıralamayı Kesinleştir' : 'Sonraki Yedek Soru ›')
             : (son ? '🏁 Yarışmayı Bitir' : 'Sonraki Soru ›')) +
      '</button></div>' +
    '</div>';
  },
  // ilerleme çizgisine basınca ilgili sonuç sayfasına geç (otomatik akışı durdur)
  sonucAdim(n){
    BIY._sonucTemizle();
    const e = document.querySelector(".biy-sonuc-ekran"); if (e) e.setAttribute("data-step", String(n));
  },
  // sonuç ekranı sahne akışı: her öğe devasa gösterilir; yenisi gelince önceki yukarı kayıp kaybolur
  _sonucOynat(){
    BIY._sonucTemizle();
    const el0 = document.querySelector(".biy-sonuc-ekran");
    const degisti = el0 && el0.getAttribute("data-degisti") === "1";
    const set = (n) => { const e = document.querySelector(".biy-sonuc-ekran"); if (e) e.setAttribute("data-step", String(n)); };
    state.sonucTimerlar.push(setTimeout(() => set(1), 7000));   // sahne 2: sınıf cevapları (soru+şıklar daha uzun beklesin)
    state.sonucTimerlar.push(setTimeout(() => set(2), 10500));  // sahne 3: liderlik + buton
    if (degisti) state.sonucTimerlar.push(setTimeout(() => SES.siraDegisti(), 10700));
  },
  _sonucTemizle(){ (state.sonucTimerlar || []).forEach(t => clearTimeout(t)); state.sonucTimerlar = []; },

  _siraliTakimlar(){
    return state.takimListe.slice().sort((a,b) => (b.puan||0) - (a.puan||0));
  },
  _miniLiderHtml(){
    return '<h4>Puan Durumu</h4><ol class="biy-lider-ol">' +
      BIY._siraliTakimlar().map(t => '<li><span>'+kacis(t.ad)+'</span><b>'+(t.puan||0)+'</b></li>').join("") + '</ol>';
  },
  _leaderboardHtml(final){
    const o = state.oda || {};
    const P = BIY._puanKumul(1e12);   // yedekler dahil toplam puanlar
    const puanOf = t => (P[t.id] != null ? P[t.id] : (t.puan || 0));
    let sirali;
    if (Array.isArray(o.sonSira) && o.sonSira.length){
      sirali = o.sonSira.map(id => state.takimListe.find(t => t.id === id)).filter(Boolean);
      state.takimListe.forEach(t => { if (sirali.indexOf(t) < 0) sirali.push(t); });
    } else {
      sirali = state.takimListe.slice().sort((a,b) => puanOf(b) - puanOf(a));
    }
    const madalya = ["🥇","🥈","🥉"];
    return '<div class="biy-oyun-orta biy-final">' +
      '<div class="biy-logo">🏆</div><h1>Yarışma Bitti!</h1>' +
      '<ol class="biy-final-ol">' +
        sirali.map((t,i) => '<li class="'+(i<3?'podyum':'')+(i===0?' birinci':'')+'" style="--i:'+i+'"><span class="biy-final-sira">'+(madalya[i]||(i+1))+'</span><span class="biy-final-ad">'+kacis(t.ad)+'</span><b>'+puanOf(t)+'</b></li>').join("") +
      '</ol>' +
      '<div class="biy-final-butonlar">' +
        '<button class="biy-btn biy-btn-yesil" onclick="BIY.lobiyeDon()">🔄 Lobiye Dön (takımlar bağlı kalır)</button>' +
        '<button class="biy-btn biy-btn-mavi" onclick="BIY.oyunuBitir()">Bitir &amp; Menü</button>' +
      '</div>' +
    '</div>';
  },
  // yarışma bitti — konfeti patlaması (harici kütüphane yok)
  _konfetiPatlat(){
    const renkler = ["#F1C40F","#EF5350","#27AE60","#3498DB","#9B59B6","#FF7AC6","#F39C12","#20C997","#FFFFFF"];
    const kap = document.createElement("div");
    kap.className = "biy-konfeti-kap";
    let h = "";
    const N = 160;
    for (let i = 0; i < N; i++){
      const sol = (Math.random()*100).toFixed(2);
      const renk = renkler[(Math.random()*renkler.length)|0];
      const gecikme = (Math.random()*0.9).toFixed(2);
      const sure = (2.6 + Math.random()*2.4).toFixed(2);
      const don = ((Math.random()*900 - 450)|0);
      const en = 6 + (Math.random()*9|0);
      const yuvarlak = Math.random() < 0.35;
      const boy = yuvarlak ? en : Math.max(4, (en*0.5)|0);
      const sx = ((Math.random()*46 - 23)|0);
      h += '<i style="left:'+sol+'%;background:'+renk+';width:'+en+'px;height:'+boy+'px;border-radius:'+(yuvarlak?'50%':'2px')+
           ';animation-delay:'+gecikme+'s;animation-duration:'+sure+'s;--don:'+don+'deg;--sx:'+sx+'px"></i>';
    }
    kap.innerHTML = h;
    const hedef = document.getElementById("ekranOyunAdmin") || document.body;
    hedef.appendChild(kap);
    setTimeout(function(){ if (kap.parentNode) kap.parentNode.removeChild(kap); }, 8000);
  },

  soruGizleToggle(){ state.soruGizli = !state.soruGizli; BIY._renderAdminOyun(); },

  async sonucGoster(){
    if (!state.odaId) return;
    try {
      await BIY._puanlariGuncelle();
      await db.collection(KOLEKSIYON).doc(state.odaId).update({ faz: "sonuc" });
    } catch(e){ console.error(e); }
  },
  _puanlariGuncelle(){
    // her takımın TOPLAM puanını tüm cevaplardan hesapla (yedekler dahil, idempotent)
    const toplam = BIY._puanKumul(1e12);
    const batch = db.batch();
    state.takimListe.forEach(t => {
      const ref = db.collection(KOLEKSIYON).doc(state.odaId).collection("takimlar").doc(t.id);
      batch.update(ref, { puan: toplam[t.id] || 0 });
    });
    return batch.commit();
  },
  async sonrakiSoru(){
    if (!state.odaId || !state.oda) return;
    BIY._sonucTemizle();
    // beraberlik turundaysak: çözüldüyse bitir, değilse sonraki yedek soru
    if (state.oda.durum === "beraberlik"){ return BIY._yedekVeyaBitir(); }
    const next = (state.oda.aktifIndex || 0) + 1;
    try {
      if (next >= (state.oda.toplamSoru || state.oyunSorulari.length)){
        await BIY._bitirVeyaBeraberlik();   // beraberlik varsa yedek soruya geç, yoksa bitir
      } else {
        await db.collection(KOLEKSIYON).doc(state.odaId).update({
          aktifIndex: next, faz: "cevap",
          aktifSoru: temizSoru(state.oyunSorulari[next]),
          soruBaslangic: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch(e){ console.error(e); }
  },

  /* ---------- BERABERLİK (yedek soru — aynı tasarım, puanlar toplama eklenir) ---------- */
  _aktifTakimlar(){
    const o = state.oda;
    if (o && o.durum === "beraberlik" && Array.isArray(o.berTakimlar)) return state.takimListe.filter(t => o.berTakimlar.indexOf(t.id) >= 0);
    return state.takimListe;
  },
  // sadece liderlik(1) veya ikincilik(2) için beraberlik var mı?
  _beraberlikDurumu(puanMap, ids){
    const pts = id => puanMap[id] || 0;
    if (ids.length < 2) return { hedef: 0 };
    const maxP = Math.max.apply(null, ids.map(pts));
    const topGroup = ids.filter(id => pts(id) === maxP);
    let hedef = 0, tied = [];
    if (topGroup.length > 1){ hedef = 1; tied = topGroup; }
    else {
      const rest = ids.filter(id => pts(id) !== maxP);
      if (rest.length){
        const secondP = Math.max.apply(null, rest.map(pts));
        const secondGroup = ids.filter(id => pts(id) === secondP);
        if (secondGroup.length > 1){ hedef = 2; tied = secondGroup; }
      }
    }
    if (!hedef) return { hedef: 0 };
    const sabit = {};
    ids.forEach(id => { if (tied.indexOf(id) >= 0) return; sabit[id] = 1 + ids.filter(o => pts(o) > pts(id)).length; });
    return { hedef, tied, sabit };
  },
  // pinli sıralama: sabitler kendi sırasında, beraber olanlar toplam puana göre hedef sıralarını doldurur
  _pinliSira(ids, pMap, tied, sabit, hedef){
    const total = id => pMap[id] || 0;
    const to = (tied||[]).slice().sort((a,b) => total(b) - total(a));
    const arr = new Array(ids.length).fill(null);
    to.forEach((id,i) => { arr[hedef - 1 + i] = id; });
    Object.keys(sabit||{}).forEach(id => { const r = sabit[id]; if (r>=1 && r<=arr.length) arr[r-1] = id; });
    const placed = new Set(arr.filter(Boolean)); let b = 0;
    ids.forEach(id => { if (!placed.has(id)){ while (arr[b]) b++; arr[b] = id; } });
    return arr;
  },
  // beraber olanlar artık farklı toplam puana sahipse çözülmüştür
  _beraberlikCozuldu(){
    const P = BIY._puanKumul(1e12);
    const vals = (state.berTakimlar||[]).map(id => P[id] || 0);
    return new Set(vals).size === vals.length;
  },
  async _bitirVeyaBeraberlik(){
    try { await BIY._puanlariGuncelle(); } catch(e){}
    const ids = state.takimListe.map(t => t.id);
    const d = BIY._beraberlikDurumu(BIY._puanKumul(1e12), ids);
    if (!d.hedef){ await db.collection(KOLEKSIYON).doc(state.odaId).update({ durum: "bitti", sonSira: [] }); return; }
    state.berHedef = d.hedef; state.berTakimlar = d.tied; state.berSabit = d.sabit; state.berNo = 0; state.berSorular = [];
    await BIY._yedekSoruSor();
  },
  async _yedekSoruSor(){
    const q = state.yedekSorular[state.berNo];
    if (!q){ return BIY._beraberlikBitir(); }   // yedek soru kalmadı → mevcut sırayla bitir
    state.berNo += 1;
    const index = 1000 + state.berNo;
    state.yedekSoruMap[index] = q;             // puan hesabına dahil
    state.berSorular.push(index);
    state.otoSonucIndex = -1; state.sonucAnimIndex = -1; state.hepsiSesIndex = -1;
    BIY._kaydet();
    try {
      await db.collection(KOLEKSIYON).doc(state.odaId).update({
        durum: "beraberlik", berHedef: state.berHedef, berTakimlar: state.berTakimlar, berSabit: state.berSabit, berNo: state.berNo,
        aktifIndex: index, faz: "cevap", aktifSoru: temizSoru(q),
        soruBaslangic: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch(e){ console.error(e); }
  },
  // yedek soru sonucundan sonra: çözüldüyse bitir, yedek kaldıysa devam
  async _yedekVeyaBitir(){
    if (BIY._beraberlikCozuldu() || state.berNo >= state.yedekSorular.length) return BIY._beraberlikBitir();
    return BIY._yedekSoruSor();
  },
  async _beraberlikBitir(){
    try { await BIY._puanlariGuncelle(); } catch(e){}
    const ids = state.takimListe.map(t => t.id);
    const sonSira = BIY._pinliSira(ids, BIY._puanKumul(1e12), state.berTakimlar, state.berSabit, state.berHedef);
    try { await db.collection(KOLEKSIYON).doc(state.odaId).update({ durum: "bitti", sonSira: sonSira }); } catch(e){ console.error(e); }
  },

  /* ---------- TAKIM MODU ---------- */
  async takimBagla(oda, takim){
    ekranGoster("ekranTakim");
    const takimRef = db.collection(KOLEKSIYON).doc(oda).collection("takimlar").doc(takim);
    try {
      const snap = await takimRef.get();
      if (!snap.exists){ BIY._takimIcerik('❌','Takım bulunamadı','Bu link geçersiz ya da takım silinmiş olabilir.'); return; }
      state.takimAd = snap.data().ad || "Takım";
      // yenileme sonrası: bu soruyu zaten cevapladıysa hatırla
      try { const kc = JSON.parse(localStorage.getItem('biy_cevap') || 'null'); if (kc && kc.oda === oda && kc.takim === takim) state.sonCevapIndex = kc.index; } catch(e){}
      await takimRef.update({ bagli: true, sonGorulme: firebase.firestore.FieldValue.serverTimestamp() });
      setInterval(() => { takimRef.update({ sonGorulme: firebase.firestore.FieldValue.serverTimestamp() }).catch(()=>{}); }, 20000);
      window.addEventListener("pagehide", () => { takimRef.update({ bagli: false }).catch(()=>{}); });

      if (state.odaAbone) state.odaAbone();
      state.odaAbone = db.collection(KOLEKSIYON).doc(oda).onSnapshot(d => { state.oda = d.data() || null; BIY._renderTakim(); });
    } catch(e){ console.error(e); BIY._takimIcerik('⚠️','Bağlanılamadı','İnternetini ve linki kontrol et.'); }
  },
  _takimIcerik(emoji, baslik, metin, ekstra){
    $("takimIcerik").className = "biy-orta";
    $("takimIcerik").innerHTML =
      '<div class="biy-kart">' +
        '<div class="biy-logo">'+emoji+'</div>' +
        '<h1>'+kacis(baslik)+'</h1>' +
        '<p class="biy-alt">'+kacis(metin)+'</p>' + (ekstra || "") +
      '</div>';
  },
  _renderTakim(){
    const o = state.oda; if (!o){ return; }
    if (o.durum === "lobi" || o.aktifIndex === -1){
      // yeni tura hazırlık: önceki turun cevap takibini sıfırla (oda yeniden kullanılıyor olabilir)
      state.sonCevapIndex = -1; try { localStorage.removeItem('biy_cevap'); } catch(e){}
      BIY._takimIcerik('✅', state.takimAd, 'Bağlandın! Yöneticinin yarışmayı başlatması bekleniyor…',
        '<div class="biy-bekle-nokta"><span></span><span></span><span></span></div>');
      sayacDurdur(); return;
    }
    if (o.durum === "bitti"){
      // beraberlik sonrası kesin sıralama varsa kendi sıramı göster
      const ss = Array.isArray(o.sonSira) ? o.sonSira : null;
      if (ss){
        const r = ss.indexOf(state.odaTakim.takim) + 1;
        if (r === 1) BIY._takimIcerik('🎉','Tebrikler!', 'Birinci oldunuz! 🥇');
        else if (r > 0) BIY._takimIcerik('🏅', r + '. oldunuz', 'Yarışmayı ' + r + '. sırada tamamladınız.');
        else BIY._takimIcerik('🏁','Yarışma bitti!', 'Sıralama tahtada.');
      } else {
        BIY._takimIcerik('🏁','Yarışma bitti!', 'Sıralama tahtada (yönetici ekranında).');
      }
      sayacDurdur(); return;
    }
    if (o.durum === "beraberlik"){
      const amTied = (o.berTakimlar||[]).indexOf(state.odaTakim.takim) >= 0;
      if (!amTied){
        const rank = (o.berSabit||{})[state.odaTakim.takim];
        if (rank === 1) BIY._takimIcerik('🎉','Tebrikler!', 'Birinci oldunuz! 🥇');
        else if (rank) BIY._takimIcerik('🏅', rank + '. oldunuz', 'Yarışmayı ' + rank + '. sırada tamamladınız.');
        else BIY._takimIcerik('⏳','Beraberlik!', 'Diğer takımlar yedek soruda yarışıyor…');
        sayacDurdur(); return;
      }
      if (o.faz === "sonuc"){ BIY._takimIcerik('📺','Cevaplar tahtada!', 'Sonraki yedek soru bekleniyor…'); sayacDurdur(); return; }
      // beraberlikte olan takım → aşağıdaki cevap akışıyla yedek soruyu cevaplar
    }
    // oyun
    const idx = o.aktifIndex, s = o.aktifSoru;
    if (!s){ BIY._takimIcerik('⏳','Hazırlanıyor…',''); return; }
    if (o.faz === "sonuc"){
      BIY._takimIcerik('📺','Cevaplar tahtada!', 'Sonraki soru bekleniyor…');
      sayacDurdur(); return;
    }
    // cevap fazı
    const cevapVerildi = (state.sonCevapIndex === idx);
    const t = TIP_BILGI[s.tip] || { ad: s.tip, emoji: "❓" };
    const kalan = kalanSaniye();
    let opt = s.secenekler.map((sec,i) =>
      '<button class="biy-t-opt'+(s.arSecenek?' ar':'')+'" style="--c:'+SIK_RENK[i]+'" '+(cevapVerildi||kalan<=0?'disabled':'')+' onclick="BIY.cevapla('+i+')"><span class="biy-a-harf">'+String.fromCharCode(65+i)+'</span><span>'+kacis(sec)+'</span></button>'
    ).join("");
    let alt = cevapVerildi
      ? '<div class="biy-t-alindi">✅ Cevabın alındı</div>'
      : (kalan<=0 ? '<div class="biy-t-alindi biy-gec">⌛ Süre doldu</div>' : '<div class="biy-t-ipucu">Bir şık seç</div>');
    $("takimIcerik").className = "biy-oyun-orta";
    $("takimIcerik").innerHTML =
      '<div class="biy-t-kimlik"><span class="biy-t-kimlik-nokta"></span><span class="biy-t-kimlik-ad">'+kacis(state.takimAd)+'</span></div>' +
      '<div class="biy-t-ust"><span class="biy-soru-tip">'+t.emoji+' '+t.ad+'</span>' +
        '<span class="biy-t-sayac" id="sayacNum">'+kalan+'</span></div>' +
      '<div class="biy-oyun-soru">'+kacis(s.soru)+'</div>' +
      (s.arapca ? '<div class="biy-oyun-arapca">'+kacis(s.arapca)+'</div>' : '') +
      '<div class="biy-t-optlar">'+opt+'</div>' + alt;
    sayacBaslat(() => {
      const k = kalanSaniye(); const el = $("sayacNum"); if (el) el.textContent = k;
      if (k <= 0){ document.querySelectorAll(".biy-t-opt").forEach(b => b.setAttribute("disabled","")); }
    });
  },
  async cevapla(optIdx){
    const o = state.oda; if (!o || o.faz !== "cevap") return;
    if (kalanSaniye() <= 0) return;
    const idx = o.aktifIndex;
    if (state.sonCevapIndex === idx) return;
    state.sonCevapIndex = idx;
    try {
      await db.collection(KOLEKSIYON).doc(state.odaTakim.oda).collection("cevaplar").doc(state.odaTakim.takim + "_" + idx).set({
        takimId: state.odaTakim.takim, ad: state.takimAd, index: idx, secilen: optIdx,
        kalan: kalanSaniye(),   // hız bonusu için kalan saniye
        zaman: firebase.firestore.FieldValue.serverTimestamp()
      });
      try { localStorage.setItem('biy_cevap', JSON.stringify({ oda: state.odaTakim.oda, takim: state.odaTakim.takim, index: idx })); } catch(e){}
    } catch(e){ console.error(e); state.sonCevapIndex = -1; }
    BIY._renderTakim();
  }
};
window.BIY = BIY;
// canlı yarışmada sekme kapatma/yenileme kazasına karşı uyarı
window.addEventListener("beforeunload", function(e){
  if (state.mod === "admin" && state.oda && (state.oda.durum === "oyun" || state.oda.durum === "beraberlik")){
    e.preventDefault(); e.returnValue = "";
  }
});

/* ===========================================================
   Başlangıç / mod yönlendirme
   =========================================================== */
(function baslat(){
  const p = new URLSearchParams(location.search);
  const oda = p.get("oda"), takim = p.get("takim");

  if (oda && takim){
    state.mod = "takim"; state.odaTakim = { oda, takim };
    ekranGoster("ekranTakim");
    // takım listesi (final için) hafif dinleme
    db.collection(KOLEKSIYON).doc(oda).collection("takimlar").onSnapshot(snap => {
      state.takimListe = []; snap.forEach(d => { const t = d.data(); state.takimListe.push({ id: d.id, ad: t.ad, puan: t.puan||0, bagli: !!t.bagli }); });
    }, () => {});
    firebase.auth().signInAnonymously()
      .then(cred => { state.uid = cred.user.uid; BIY.takimBagla(oda, takim); })
      .catch(err => { console.error("Anonim giriş:", err); BIY.takimBagla(oda, takim); });
    return;
  }

  state.mod = "admin";
  ekranGoster("ekranYukleniyor");
  firebase.auth().onAuthStateChanged(user => {
    if (!user || user.isAnonymous){
      $("girisRolNot").textContent = user && user.isAnonymous ? "Misafir olarak giriş yapılmış; yönetim için öğretmen/yönetici hesabı gerekli." : "";
      ekranGoster("ekranGirisKapisi"); return;
    }
    state.uid = user.uid;
    db.collection("kullanicilar").doc(user.uid).get().then(doc => {
      const rol = (doc.exists && doc.data().role) ? doc.data().role : "student";
      if (rol === "teacher" || rol === "admin"){
        const isim = (doc.data().name && doc.data().name !== "Belirtilmedi") ? doc.data().name : (user.email || "Yönetici");
        $("adminAd").textContent = (rol === "admin" ? "Yönetici: " : "Öğretmen: ") + isim;
        BIY._konulariHazirla();
        BIY._soruSayiSinir();
        BIY._menuDurum();
        // sayfa yenilenmişse aktif odaya/oyuna dön
        let kayit = null; try { kayit = JSON.parse(localStorage.getItem('biy_aktif') || 'null'); } catch(e){}
        if (kayit && kayit.oda){ BIY._devamEt(kayit); }
        else ekranGoster("ekranAnasayfa");
      } else {
        $("girisRolNot").textContent = "Bu hesabın rolü öğrenci. Yarışmayı yalnızca öğretmen/yönetici yönetebilir.";
        ekranGoster("ekranGirisKapisi");
      }
    }).catch(err => { console.error("Rol:", err); ekranGoster("ekranGirisKapisi"); });
  });
})();
