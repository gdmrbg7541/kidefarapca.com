/* ===========================================================
   Bilgi Yarışması — 7. Sınıf · 1. Ünite (ماذا فَعَلْت اليَوْم؟)
   Firebase 8.10.1 (compat) · proje: bilgiyarismasi7sinif1unite
   Soru biçimleri: test · sürükle-bırak · eşleştirme · klavyeyle yazma
   Mod 1 (ADMIN): dosyayı sade adresle açan kişi = öğretmen (giriş yok).
   Mod 2 (TAKIM): ?oda=..&takim=.. linkiyle anonim katılım.
   Canlı oyun döngüsü: admin kontrollü, sunucu-zamanlı geri sayım,
   dijital cevap, öğrenci cihazında doğru/yanlış GÖRÜNMEZ; doğru/yanlış
   + puan yalnız admin (yansıtılan) ekranda. Puan zorluğa göre.
   =========================================================== */

/* ---------------- Firebase ---------------- */
/*  Firebase web uygulaması bilgileri.
    Proje: bilgiyarismasi7sinif1unite (7. sınıf 1. ünite bilgi yarışması)
    Bu değerler Firebase Console → ⚙️ Proje ayarları → "Uygulamalarınız" →
    Web uygulaması → SDK kurulumu ve yapılandırması bölümünden alınmıştır.
    NOT: Firestore güvenlik kuralları "bilgiYarismasi" koleksiyonunu açık
    tutmalıdır; kurallar "if false" kalırsa oda kurma/katılma çalışmaz.        */
const firebaseConfig = {
    apiKey: "AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w",
    authDomain: "kidefarapca-98f9c.firebaseapp.com",
    projectId: "kidefarapca-98f9c",
    storageBucket: "kidefarapca-98f9c.firebasestorage.app",
    messagingSenderId: "503317118211",
    appId: "1:503317118211:web:a9c8cf15b854597e0b3d36",
    measurementId: "G-HYY6T2EDKY"
};
const FIREBASE_HAZIR = !!(firebaseConfig.apiKey && firebaseConfig.appId);
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
if (!FIREBASE_HAZIR) console.warn("[BIY] firebaseConfig eksik. Canlı yarışma çalışmaz.");
const KOLEKSIYON = "bilgiYarismasi";
const PDF_AKTIF = false;     // PDF'ler hazır olunca true yap → PDF önizleme/indirme geri gelir
const SORU_SURESI = 60;      // saniye — zorluk bilinmiyorsa yedek değer
/* ZORLUĞA GÖRE SORU SÜRESİ ------------------------------------------------
   Kolay 30 · Orta 45 · Zor 60 saniye. Öğretmen ana ekrandaki kronometre
   düğmesinden her seviye için hazır bir değere basabilir ya da elle saniye
   yazabilir; seçim localStorage['biy_sure'] içinde saklanır.
   Süre, soru odaya yazılırken zorluğuna göre belirlenir (soruSuresi alanı).
   Puan hesabı geçmiş soruların süresini state.turSureleri'nden okur; böylece
   öğretmen tur ortasında süreyi değiştirse bile eski cevapların puanı
   kaymaz (bkz. _puanParca). */
const SURE_VARSAYILAN = { 1: 30, 2: 45, 3: 60 };
const SURE_SECENEK = [15, 20, 30, 45, 60, 90, 120];
const SURE_ENAZ = 5, SURE_ENCOK = 300;
const SURE_ETIKET = { 1: "Kolay", 2: "Orta", 3: "Zor" };

function sureOku(){
  const s = { 1: SURE_VARSAYILAN[1], 2: SURE_VARSAYILAN[2], 3: SURE_VARSAYILAN[3] };
  try {
    const k = JSON.parse(localStorage.getItem('biy_sure') || 'null');
    if (k) [1,2,3].forEach(z => {
      const v = parseInt(k[z], 10);
      if (isFinite(v) && v >= SURE_ENAZ && v <= SURE_ENCOK) s[z] = v;
    });
  } catch(e){}
  return s;
}
function sureYaz(s){ try { localStorage.setItem('biy_sure', JSON.stringify(s)); } catch(e){} }
/* Bir sorunun süresi — zorluğu yoksa/tanınmıyorsa orta seviye sayılır. */
function soruSuresi(q){
  const z = q ? parseInt(q.zorluk, 10) : 0;
  const t = (state && state.sureler) || SURE_VARSAYILAN;
  return t[z] || t[2] || SORU_SURESI;
}
const TUR_SORU_SAYISI = 20;  // varsayılan soru sayısı
const SORU_SAYI_SECENEK = [10, 20, 25, 50];
const TOPLAM_PUAN = 1000;    // ana tur toplam puanı (yedekler hariç)
const ZAMAN_PAYI = 0.15;     // puanın en fazla %15'i hızdan (çok fazla değil)
const PUAN = { 1: 10, 2: 20, 3: 30 };  // (eski; artık 1000 üzerinden hesaplanır)

/* ---------------- Soru biçimleri ----------------
   Her sorunun bir "bicim" alanı vardır. Yazılmamışsa "test" kabul edilir,
   böylece eski sorular hiç değiştirilmeden çalışmaya devam eder.
     test     → çoktan seçmeli  { secenekler:[...], dogru:index }
     surukle  → kelimeleri sırala { parcalar:["...","..."] }  (dizideki sıra = doğru sıra)
     eslestir → eşleştirme        { ciftler:[["sol","sağ"], ...] }
     yazma    → klavyeyle yaz     { cevapYazi:"بيت", tuslar:[... en fazla 10 ...] }   */
/* SABİT SORU TİPLERİ (bicim): 7 tür. bosluk + dogruyanlis çoktan-seçmeli
   altyapısını (secenekler+dogru) paylaşır; cumlesira ise sıralama (surukle)
   altyapısını (parcalar) paylaşır. Yeni veri hep bu 7 türden biriyle eklenir. */
const BICIM_BILGI = {
  "test":       { ad: "Çoktan seçmeli", emoji: "🔘" },
  "surukle":    { ad: "Sıralama",        emoji: "🧲" },
  "eslestir":   { ad: "Eşleştirme",      emoji: "🔗" },
  "yazma":      { ad: "Yazma",           emoji: "⌨️" },
  "bosluk":     { ad: "Boşluk doldurma", emoji: "◻️" },
  "dogruyanlis":{ ad: "Doğru / Yanlış",  emoji: "✅" },
  "cumlesira":  { ad: "Cümle sıralama",  emoji: "🔀" }
};
// çoktan-seçmeli altyapısını paylaşan biçimler (test/bosluk/dogruyanlis)
function testGibiMi(b){ return b === "test" || b === "bosluk" || b === "dogruyanlis"; }
// sıralama altyapısını paylaşan biçimler (surukle/cumlesira)
function siraGibiMi(b){ return b === "surukle" || b === "cumlesira"; }
function bicimAl(s){ return (s && s.bicim) || "test"; }
/* Yansitilan tahtadaki sik sayisi — 5-6 sikta satirlar kisalsin diye
   .biy-a-optlar uzerine data-n olarak yazilir (bkz. CSS v114).       */
function sikSayisi(s){
  return testGibiMi(bicimAl(s)) ? ((s && s.secenekler) || []).length : 0;
}
// Metin Arapça mı? (kutulara doğru yazı tipini vermek için)
function arMi(t){ return /[؀-ۿ]/.test(String(t == null ? "" : t)); }
/* ---------------- Etiketler: animasyonlu SVG rozetler ----------------
   Soru tipi / bicim / zorluk yazi degil ikon; soru cumlesinin ustunde
   ayri satirda durur. Renk ve animasyon CSS'te (biy-ea-*). */
const _EA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">';
const ETIKET_TIP = {
  "harf":  _EA+'<path d="M3.2 18.2h17.6"/><path class="biy-ea-ciz" d="M6.4 15.4V8.2a2.1 2.1 0 0 1 4.2 0v7.2M6.4 12.2h4.2"/><path class="biy-ea-parla" d="M14.6 15.4V5.4M14.6 15.4h3.8"/></svg>',
  "kok":   _EA+'<path d="M12 21v-8"/><path d="M12 13c0-3.2-2.4-5.6-6-5.6 0 3.6 2.4 5.6 6 5.6z"/><path class="biy-ea-parla" d="M12 11c0-3.6 2.6-6.2 6.4-6.2 0 4-2.8 6.2-6.4 6.2z"/></svg>',
  "vezin": _EA+'<g class="biy-ea-zip"><path d="M4.2 7h15.6"/><path d="M6.8 7l-2.7 5a3.1 3.1 0 0 0 5.4 0z"/><path d="M17.2 7l-2.7 5a3.1 3.1 0 0 0 5.4 0z"/></g><path d="M12 4.4v13.2M8.6 20.4h6.8"/><circle cx="12" cy="4.2" r="1.1"/></svg>',
  "anlam": _EA+'<path d="M9.8 17.5h4.4M10.6 20.5h2.8"/><path d="M12 3.2a5.6 5.6 0 0 1 3.2 10.2c-.7.5-1 1.1-1 1.9h-4.4c0-.8-.3-1.4-1-1.9A5.6 5.6 0 0 1 12 3.2z"/><g class="biy-ea-parla"><path d="M3.6 5.4l1.5.9M20.4 5.4l-1.5.9M12 .9v1.5"/></g></svg>',
  "ters-vezin": _EA+'<g class="biy-ea-zip"><path d="M14.4 6.2a4.4 4.4 0 0 0-5.8 5.5l-5 5a2 2 0 1 0 2.8 2.8l5-5a4.4 4.4 0 0 0 5.5-5.8l-2.8 2.8-2.4-.7-.7-2.4z"/></g></svg>',
  "ayet":  _EA+'<path d="M12 6.4C10.4 5 8.2 4.3 5.5 4.3c-.9 0-1.7.1-2.5.3v13.2c.8-.2 1.6-.3 2.5-.3 2.7 0 4.9.7 6.5 2.2 1.6-1.5 3.8-2.2 6.5-2.2.9 0 1.7.1 2.5.3V4.6c-.8-.2-1.6-.3-2.5-.3-2.7 0-4.9.7-6.5 2.1z"/><path class="biy-ea-ciz" d="M12 6.4v13.2"/></svg>',
  "cumle": _EA+'<path d="M6.5 4.5h11a2.5 2.5 0 0 1 2.5 2.5v6a2.5 2.5 0 0 1-2.5 2.5H10.5L6 19v-3.5A2.5 2.5 0 0 1 4 13V7a2.5 2.5 0 0 1 2.5-2.5z"/><path class="biy-ea-ciz" d="M8.5 8.5h7M8.5 11.5h4.5"/></svg>',
  "gramer": _EA+'<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path class="biy-ea-ciz" d="M8 8.5h8M8 12h8M8 15.5h5"/></svg>',
  "bosluk": _EA+'<rect x="3.5" y="6.5" width="17" height="11" rx="2"/><path d="M7 10.5h3M14 10.5h3"/><rect class="biy-ea-puls" x="10.4" y="12.6" width="3.2" height="2.4" rx=".8" fill="currentColor" stroke="none"/></svg>',
  "dogruyanlis": _EA+'<path class="biy-ea-ciz" d="M4.5 12.6l3 3 5-6.2"/><path d="M14.5 8.5l5 5M19.5 8.5l-5 5"/></svg>',
  "edat": _EA+'<path d="M9.5 14.5l5-5"/><path d="M12.5 6.8l1.8-1.8a3.4 3.4 0 0 1 4.8 4.8l-1.8 1.8"/><path class="biy-ea-zip" d="M11.5 17.2l-1.8 1.8a3.4 3.4 0 0 1-4.8-4.8l1.8-1.8"/></svg>',
  "irab": _EA+'<path d="M4 17.5h16"/><path class="biy-ea-ciz" d="M17 17.5v-6.4a2.6 2.6 0 0 0-5.2 0v6.4M17 13.8h-5.2"/><g class="biy-ea-parla"><path d="M6.2 8.6h3.4"/><path d="M6.2 5.9h3.4"/><circle cx="7.9" cy="11.6" r=".9" fill="currentColor" stroke="none"/></g></svg>',
  "varsayilan": _EA+'<circle cx="12" cy="12" r="8.6"/><path class="biy-ea-ciz" d="M9.6 9.2a2.4 2.4 0 1 1 3.3 2.2c-.8.4-.9 1-.9 1.8"/><circle cx="12" cy="16.6" r=".9" fill="currentColor" stroke="none"/></svg>'
};
const ETIKET_BICIM = {
  "test":       _EA+'<circle cx="12" cy="12" r="8.6"/><path class="biy-ea-ciz" d="M8.2 12.4l2.6 2.6 5-5.8"/></svg>',
  "surukle":    _EA+'<rect x="2.8" y="9.4" width="5.2" height="5.2" rx="1.3"/><rect x="16" y="9.4" width="5.2" height="5.2" rx="1.3"/><g class="biy-ea-kay"><rect x="9.4" y="9.4" width="5.2" height="5.2" rx="1.3" fill="currentColor" stroke="none"/></g></svg>',
  "eslestir":   _EA+'<circle cx="5.4" cy="7" r="1.9"/><circle cx="18.6" cy="7" r="1.9"/><circle cx="5.4" cy="17" r="1.9"/><circle cx="18.6" cy="17" r="1.9"/><path class="biy-ea-ciz" d="M7.6 7h8.8M7.6 17h8.8"/></svg>',
  "yazma":      _EA+'<path d="M4.5 19.5l1-3.8L16.6 4.6a2.1 2.1 0 0 1 3 3L8.4 18.7z"/><path class="biy-ea-ciz" d="M4.5 22.6h15"/></svg>',
  "bosluk":     _EA+'<rect x="3.5" y="6.5" width="17" height="11" rx="2"/><path d="M7 10.5h3M14 10.5h3"/><rect class="biy-ea-puls" x="10.4" y="12.6" width="3.2" height="2.4" rx=".8" fill="currentColor" stroke="none"/></svg>',
  "dogruyanlis":_EA+'<path class="biy-ea-ciz" d="M4.5 12.6l3 3 5-6.2"/><path d="M14.5 8.5l5 5M19.5 8.5l-5 5"/></svg>',
  "cumlesira":  _EA+'<path d="M4 6.5h9M4 12h9M4 17.5h9"/><g class="biy-ea-zip"><path d="M18 17.5V7M18 7l-2.3 2.5M18 7l2.3 2.5"/></g></svg>'
};
const _YILDIZ = 'M12 3.6l2.2 4.4 4.9.7-3.5 3.5.8 4.9-4.4-2.3-4.4 2.3.8-4.9-3.5-3.5 4.9-.7z';
const _EAY = _EA.replace('fill="none"', 'fill="currentColor"');
const ETIKET_ZORLUK = {
  1: _EAY+'<path class="biy-ea-y1" stroke="none" d="'+_YILDIZ+'"/></svg>',
  2: _EAY+'<path class="biy-ea-y1" stroke="none" transform="translate(1.5,4.5) scale(.62)" d="'+_YILDIZ+'"/><path class="biy-ea-y2" stroke="none" transform="translate(9.1,4.5) scale(.62)" d="'+_YILDIZ+'"/></svg>',
  3: _EAY+'<path class="biy-ea-y1" stroke="none" transform="translate(1.4,1.9) scale(.55)" d="'+_YILDIZ+'"/><path class="biy-ea-y2" stroke="none" transform="translate(9.4,1.9) scale(.55)" d="'+_YILDIZ+'"/><path class="biy-ea-y3" stroke="none" transform="translate(5.4,8.9) scale(.55)" d="'+_YILDIZ+'"/></svg>'
};
function etiketHtml(s){
  const t = TIP_BILGI[s.tip] || { ad: s.tip || "" };
  const b = bicimAl(s);
  const bb = BICIM_BILGI[b] || { ad: b };
  return '<div class="biy-etiketler">' +
    '<span class="biy-etiket biy-et-tip" title="'+kacis(t.ad)+'">'+(ETIKET_TIP[s.tip]||ETIKET_TIP.varsayilan)+'</span>' +
    '<span class="biy-etiket biy-et-bicim" title="'+kacis(bb.ad)+'">'+(ETIKET_BICIM[b]||ETIKET_TIP.varsayilan)+'</span>' +
    (ETIKET_ZORLUK[s.zorluk] ? '<span class="biy-etiket biy-et-zorluk z'+s.zorluk+'" title="'+kacis(ZORLUK_AD[s.zorluk]||"")+'">'+ETIKET_ZORLUK[s.zorluk]+'</span>' : '') +
  '</div>';
}
/* Soru cümlesinin ekran hâli: arapca alanı zaten büyük gösterildiği için
   soru içindeki «aynı metin» tekrarı kaldırılır (çift cümle olmaz);
   «Türkçe» bölümler bdi ile soldan sağa (LTR) akar. */
function soruHtml(s){
  let m = String((s && s.soru) || "");
  if (s && s.arapca){
    const tekrar = "«" + s.arapca + "»";
    if (m.indexOf(tekrar) >= 0)
      m = m.replace(tekrar, "").replace(/\s{2,}/g, " ").replace(/\s+([؟?،.])/g, "$1").trim();
  }
  return kacis(m).replace(/«([^»]*)»/g, function(tum, ic){
    return /[A-Za-zÇĞİÖŞÜçğıöşü]/.test(ic) ? '«<bdi class="biy-ltr-ic">' + ic + '</bdi>»' : tum;
  });
}
function karistir(dizi){
  const a = (dizi || []).slice();
  for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); const g = a[i]; a[i] = a[j]; a[j] = g; }
  return a;
}
// Bir cevabın doğru olup olmadığını TEK yerden karar veren yardımcı.
function cevapDogruMu(s, secilen){
  if (!s || secilen == null) return false;
  const b = bicimAl(s);
  if (siraGibiMi(b))
    return Array.isArray(secilen) && Array.isArray(s.parcalar) && secilen.join("|") === s.parcalar.join("|");
  if (b === "eslestir")
    return Array.isArray(secilen) && Array.isArray(s.ciftler) &&
           secilen.length === s.ciftler.length && s.ciftler.every((c, i) => secilen[i] === c[1]);
  if (b === "yazma"){
    // Yazmada baştaki elif-lâm (ال) İSTEĞE BAĞLI: öğrenci «ليل» yazsa da
    // «الليل» yazsa da doğru sayılır. Yalnız harf-i tarif anlamı değiştiren
    // kelimeler için soruya elifLamSart:true konursa ال yine zorunlu olur.
    const sad = x => String(x == null ? "" : x).replace(/\s+/g, "");
    const kok = x => s.elifLamSart ? sad(x) : sad(x).replace(/^ال/, "");
    return kok(secilen) === kok(s.cevapYazi);
  }
  return secilen === s.dogru;
}
// Doğru cevabın okunabilir metni (önizleme kartları, sınıf modu, soru havuzu).
function dogruCevapMetni(s){
  const b = bicimAl(s);
  if (siraGibiMi(b))  return (s.parcalar || []).join(" ");
  if (b === "eslestir") return (s.ciftler || []).map(c => c[0] + " → " + c[1]).join("  ·  ");
  if (b === "yazma")    return s.cevapYazi || "";
  return (s.secenekler || [])[s.dogru] || "";
}
// Soru havuzu aramasında taranacak metin.
function aramaMetni(q){
  const b = bicimAl(q);
  if (siraGibiMi(b))  return (q.parcalar || []).join(" ");
  if (b === "eslestir") return (q.ciftler || []).map(c => c.join(" ")).join(" ");
  if (b === "yazma")    return q.cevapYazi || "";
  return (q.secenekler || []).join(" ");
}
// Bir takımın verdiği cevabın gösterim biçimi (sonuç ekranı tablosu).
function secimHtml(soru, secilen){
  const b = bicimAl(soru);
  if (secilen == null) return '<span class="biy-rev-yok">—</span>';
  if (siraGibiMi(b))
    return '<span class="biy-rev-metin ar">' + kacis((secilen || []).join(" ")) + '</span>';
  if (b === "eslestir"){
    const sol = (soru.ciftler || []).map(c => c[0]);
    return '<span class="biy-rev-cift">' +
      sol.map((x, i) => '<i>' + kacis(x) + ' → ' + kacis((secilen || [])[i] || "—") + '</i>').join("") + '</span>';
  }
  if (b === "yazma")
    return '<span class="biy-rev-metin ar">' + kacis(String(secilen)) + '</span>';
  const harf = String.fromCharCode(65 + secilen);
  const sMetin = (soru.secenekler || [])[secilen] || "";
  const ar = arMi(sMetin) ? ' ar' : ' biy-ltr';
  return '<b class="biy-rev-harf">' + harf + '</b> <span class="biy-rev-metin' + ar + '">' +
         kacis(sMetin) + '</span>';
}


/* ===================================================================
   TAMLAMA VE CÜMLELER — tamlamavecumleler.html testinin soru verisi
   -------------------------------------------------------------------
   Kaynak: muhadese/veri/sinav.js (42 örnek, 81 öge çifti) + o sayfadaki
   dört satırlık kural tablosu. Buradaki hiçbir Arapça elle yazılmadı;
   örnekler 5-10. sınıf ders verilerinden birebir geliyor.
   Altı soru biçimi kullanıldı: çoktan seçmeli (öge · yapı · kural),
   eşleştirme (anlam · öge), doğru/yanlış, boşluk doldurma, cümle
   sıralama ve kelime sıralama. "Yazma" biçimi bilerek yok: kelime
   bazında Türkçe karşılık verisi olmadığı için adil bir soru kökü
   kurulamıyordu, uydurma karşılık yazmak yerine dışarıda bırakıldı.
   TÜR (tip) ile BİÇİM (bicim) ayrı şeyler söyler: tür sorunun NEYİ
   ölçtüğüdür (gramer · anlam · cümle), biçim ise NASIL sorulduğudur.
   Sınıf konularındaki düzen de böyle; tür alanına "boşluk"/"doğru-yanlış"
   gibi biçim adları yazılmaz, yoksa süzgeçte iki sütun aynı şeyi gösterir.
   Dosya /tmp/tc_uret.js ile üretilir; sinav.js değişirse yeniden üret.
   =================================================================== */
const TAMLAMA_SORULARI = [
  {"id":1000,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «يَوْم» hangi ögedir?","secenekler":["Mevsûf","Muzâfun ileyh","Mübteda","Sıfat","Muzâf"],"dogru":4,"arapca":"يَوْم الجُمُعَة"},
  {"id":1001,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «يَوْم» hangi ögedir?","secenekler":["Muzâfun ileyh","Sıfat","Mevsûf","Mübteda","Muzâf"],"dogru":4,"arapca":"يَوْم الثُّلاثاء"},
  {"id":1002,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «كُرَة» hangi ögedir?","secenekler":["Mevsûf","Muzâfun ileyh","Mübteda","Muzâf","Sıfat"],"dogru":3,"arapca":"كُرَة القَدَم"},
  {"id":1003,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «مَمَرّ» hangi ögedir?","secenekler":["Muzâf","Sıfat","Mübteda","Muzâfun ileyh","Mevsûf"],"dogru":0,"arapca":"مَمَرّ المُشاة"},
  {"id":1004,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «غُرْفَةُ» hangi ögedir?","secenekler":["Mevsûf","Mübteda","Muzâf","Sıfat","Muzâfun ileyh"],"dogru":2,"arapca":"غُرْفَةُ الجُلوسِ"},
  {"id":1005,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «رَبَّة» hangi ögedir?","secenekler":["Mevsûf","Sıfat","Muzâfun ileyh","Mübteda","Muzâf"],"dogru":4,"arapca":"رَبَّة البَيْت"},
  {"id":1006,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «قَلْعَة» hangi ögedir?","secenekler":["Sıfat","Mevsûf","Muzâfun ileyh","Mübteda","Muzâf"],"dogru":4,"arapca":"قَلْعَة الْفَتَاة"},
  {"id":1007,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «مُتْحَف» hangi ögedir?","secenekler":["Muzâfun ileyh","Mübteda","Muzâf","Mevsûf","Sıfat"],"dogru":2,"arapca":"مُتْحَف مَوْلَانَا"},
  {"id":1008,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «عاصِمَة» hangi ögedir?","secenekler":["Sıfat","Muzâfun ileyh","Mevsûf","Mübteda","Muzâf"],"dogru":4,"arapca":"عاصِمَة تُرْكِيا"},
  {"id":1009,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «قِراءَة» hangi ögedir?","secenekler":["Mübteda","Muzâfun ileyh","Mevsûf","Muzâf","Sıfat"],"dogru":3,"arapca":"قِراءَة الكُتُب"},
  {"id":1010,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «مَدِينَة» hangi ögedir?","secenekler":["Muzâfun ileyh","Sıfat","Mübteda","Muzâf","Mevsûf"],"dogru":3,"arapca":"مَدِينَة قُونْيَا"},
  {"id":1011,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «مُشاهَدَة» hangi ögedir?","secenekler":["Mevsûf","Muzâfun ileyh","Sıfat","Muzâf","Mübteda"],"dogru":3,"arapca":"مُشاهَدَة السّينَما"},
  {"id":1012,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «الضَّوْء» hangi ögedir?","secenekler":["Muzâf","Mevsûf","Sıfat","Muzâfun ileyh","Mübteda"],"dogru":1,"arapca":"الضَّوْء الأَحْمَر"},
  {"id":1013,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «الضَّوْء» hangi ögedir?","secenekler":["Mevsûf","Muzâfun ileyh","Muzâf","Sıfat","Mübteda"],"dogru":0,"arapca":"الضَّوْء الأَخْضَر"},
  {"id":1014,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «القِطار» hangi ögedir?","secenekler":["Mübteda","Sıfat","Muzâfun ileyh","Muzâf","Mevsûf"],"dogru":4,"arapca":"القِطار السَّريع"},
  {"id":1015,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «الشّارِع» hangi ögedir?","secenekler":["Sıfat","Muzâf","Mübteda","Mevsûf","Muzâfun ileyh"],"dogru":3,"arapca":"الشّارِع الواسِع"},
  {"id":1016,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «الصَّيْدَلِيَّة» hangi ögedir?","secenekler":["Mevsûf","Muzâfun ileyh","Sıfat","Muzâf","Mübteda"],"dogru":0,"arapca":"الصَّيْدَلِيَّة الجَديدَة"},
  {"id":1017,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «السّوق» hangi ögedir?","secenekler":["Mübteda","Sıfat","Muzâf","Mevsûf","Muzâfun ileyh"],"dogru":3,"arapca":"السّوق القَديم"},
  {"id":1018,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «الغِذاء» hangi ögedir?","secenekler":["Sıfat","Mevsûf","Muzâfun ileyh","Mübteda","Muzâf"],"dogru":1,"arapca":"الغِذاء الصِّحِّيّ"},
  {"id":1019,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «الأُسْبوع» hangi ögedir?","secenekler":["Muzâfun ileyh","Muzâf","Sıfat","Mübteda","Mevsûf"],"dogru":4,"arapca":"الأُسْبوع القادِم"},
  {"id":1020,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «السّاعَة» hangi ögedir?","secenekler":["Sıfat","Mübteda","Muzâf","Mevsûf","Muzâfun ileyh"],"dogru":3,"arapca":"السّاعَة السّابِعَة"},
  {"id":1021,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki öbekte «أَخي» hangi ögedir?","secenekler":["Sıfat","Mübteda","Muzâfun ileyh","Muzâf","Mevsûf"],"dogru":4,"arapca":"أَخي الكَبيرُ"},
  {"id":1022,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «أَنْتَ» hangi ögedir?","secenekler":["Mevsûf","Muzâf","Fâil","Haber","Mübteda"],"dogru":4,"arapca":"أَنْتَ مُتَقاعِد."},
  {"id":1023,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «هُو» hangi ögedir?","secenekler":["Haber","Fâil","Mübteda","Muzâf","Mevsûf"],"dogru":2,"arapca":"هُو مُتَعَجِّب."},
  {"id":1024,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «هِي» hangi ögedir?","secenekler":["Haber","Fâil","Muzâf","Mevsûf","Mübteda"],"dogru":4,"arapca":"هِي قَلِقَة."},
  {"id":1025,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «الرِّياضَة» hangi ögedir?","secenekler":["Fâil","Muzâf","Haber","Mevsûf","Mübteda"],"dogru":4,"arapca":"الرِّياضَة مُفيدَة لِلصِّحَّة."},
  {"id":1026,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «الفُنْدُق» hangi ögedir?","secenekler":["Fâil","Mevsûf","Mübteda","Muzâf","Haber"],"dogru":2,"arapca":"الفُنْدُق قَريب مِنْ هُنا."},
  {"id":1027,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «مَدْرَسَتي» hangi ögedir?","secenekler":["Haber","Fâil","Mübteda","Mevsûf","Muzâf"],"dogru":2,"arapca":"مَدْرَسَتي بَعيدَة عَن بَيْتي."},
  {"id":1028,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «الطَّقْسُ» hangi ögedir?","secenekler":["Muzâf","Mübteda","Mevsûf","Haber","Fâil"],"dogru":1,"arapca":"الطَّقْسُ حارٌّ فِي الصَّيْفِ."},
  {"id":1029,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «الجَوُّ» hangi ögedir?","secenekler":["Mevsûf","Mübteda","Muzâf","Haber","Fâil"],"dogru":1,"arapca":"الجَوُّ جَميلٌ فِي الرَّبيعِ."},
  {"id":1030,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «الشّارِع» hangi ögedir?","secenekler":["Mevsûf","Fâil","Muzâf","Mübteda","Haber"],"dogru":3,"arapca":"الشّارِع مُزْدَحِم بِالمُواصَلات."},
  {"id":1031,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «مَدْرَسَتي» hangi ögedir?","secenekler":["Haber","Muzâf","Mevsûf","Mübteda","Fâil"],"dogru":3,"arapca":"مَدْرَسَتي خَلْف المَسْجِد."},
  {"id":1032,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «يَلْعَبُ» hangi ögedir?","secenekler":["Haber","Fiil","Mübteda","Fâil","Mef’ûl"],"dogru":1,"arapca":"يَلْعَبُ أَحْمَد كُرَة القَدَم."},
  {"id":1033,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «كُرَة القَدَم» hangi ögedir?","secenekler":["Mef’ûl","Fâil","Muzâfun ileyh","Haber","Fiil"],"dogru":0,"arapca":"يَلْعَبُ أَحْمَد كُرَة القَدَم."},
  {"id":1034,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «تَجَوَّلَتْ» hangi ögedir?","secenekler":["Fâil","Fiil","Mef’ûl","Mübteda","Haber"],"dogru":1,"arapca":"تَجَوَّلَتْ مَرْوَة في إِسْطَنْبُول."},
  {"id":1035,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «يَعِيشُ» hangi ögedir?","secenekler":["Mef’ûl","Fiil","Haber","Mübteda","Fâil"],"dogru":1,"arapca":"يَعِيشُ يُونُس فِي قُونْيَا."},
  {"id":1036,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «أَشْعُرُ» hangi ögedir?","secenekler":["Haber","Fâil","Mübteda","Fiil","Mef’ûl"],"dogru":3,"arapca":"أَشْعُرُ بِأَلَم في حَلْقي."},
  {"id":1037,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «آكُلُ» hangi ögedir?","secenekler":["Haber","Fâil","Mübteda","Fiil","Mef’ûl"],"dogru":3,"arapca":"آكُلُ الخَضْرَوات وَالفَواكِه."},
  {"id":1038,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «أَلْعَبُ» hangi ögedir?","secenekler":["Fâil","Mef’ûl","Fiil","Mübteda","Haber"],"dogru":2,"arapca":"أَلْعَبُ كُرَة القَدَم."},
  {"id":1039,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «أُنَظِّفُ» hangi ögedir?","secenekler":["Fâil","Mübteda","Haber","Mef’ûl","Fiil"],"dogru":4,"arapca":"أُنَظِّفُ غُرْفَتي."},
  {"id":1040,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «أَذْهَبُ» hangi ögedir?","secenekler":["Fâil","Fiil","Mef’ûl","Mübteda","Haber"],"dogru":1,"arapca":"أَذْهَبُ إِلى الطَّبيب."},
  {"id":1041,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «أَسْتَمِعُ» hangi ögedir?","secenekler":["Mef’ûl","Fiil","Haber","Fâil","Mübteda"],"dogru":1,"arapca":"أَسْتَمِعُ إِلى الموسيقى."},
  {"id":1042,"tip":"gramer","zorluk":2,"soru":"Yukarıdaki cümlede «أَعِيشُ» hangi ögedir?","secenekler":["Mübteda","Fiil","Haber","Fâil","Mef’ûl"],"dogru":1,"arapca":"أَعِيشُ فِي مَدِينَة قُونْيَا."},
  {"id":2000,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["Fiil Cümlesi","Sıfat Tamlaması","İsim Tamlaması","İsim Cümlesi"],"dogru":2,"arapca":"كُرَة القَدَم"},
  {"id":2001,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["İsim Cümlesi","Fiil Cümlesi","İsim Tamlaması","Sıfat Tamlaması"],"dogru":2,"arapca":"مُشاهَدَة السّينَما"},
  {"id":2002,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["İsim Tamlaması","Sıfat Tamlaması","Fiil Cümlesi","İsim Cümlesi"],"dogru":0,"arapca":"يَوْم الثُّلاثاء"},
  {"id":2003,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["İsim Tamlaması","İsim Cümlesi","Sıfat Tamlaması","Fiil Cümlesi"],"dogru":2,"arapca":"أَخي الكَبيرُ"},
  {"id":2004,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["İsim Tamlaması","Sıfat Tamlaması","İsim Cümlesi","Fiil Cümlesi"],"dogru":1,"arapca":"القِطار السَّريع"},
  {"id":2005,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["İsim Tamlaması","İsim Cümlesi","Fiil Cümlesi","Sıfat Tamlaması"],"dogru":3,"arapca":"الصَّيْدَلِيَّة الجَديدَة"},
  {"id":2006,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["Sıfat Tamlaması","İsim Cümlesi","İsim Tamlaması","Fiil Cümlesi"],"dogru":1,"arapca":"الرِّياضَة مُفيدَة لِلصِّحَّة."},
  {"id":2007,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["İsim Cümlesi","Fiil Cümlesi","Sıfat Tamlaması","İsim Tamlaması"],"dogru":0,"arapca":"مَدْرَسَتي خَلْف المَسْجِد."},
  {"id":2008,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["Fiil Cümlesi","İsim Tamlaması","İsim Cümlesi","Sıfat Tamlaması"],"dogru":2,"arapca":"أَنْتَ مُتَقاعِد."},
  {"id":2009,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["İsim Cümlesi","Fiil Cümlesi","Sıfat Tamlaması","İsim Tamlaması"],"dogru":1,"arapca":"أَذْهَبُ إِلى الطَّبيب."},
  {"id":2010,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["Sıfat Tamlaması","Fiil Cümlesi","İsim Tamlaması","İsim Cümlesi"],"dogru":1,"arapca":"أَشْعُرُ بِأَلَم في حَلْقي."},
  {"id":2011,"tip":"gramer","zorluk":1,"soru":"Yukarıdaki yapı hangisidir?","secenekler":["Sıfat Tamlaması","İsim Cümlesi","Fiil Cümlesi","İsim Tamlaması"],"dogru":2,"arapca":"أُنَظِّفُ غُرْفَتي."},
  {"id":3000,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"İsim Tamlaması örneklerini anlamlarıyla eşleştir.","ciftler":[["مُتْحَف مَوْلَانَا","Mevlana Müzesi"],["كُرَة القَدَم","Futbol (ayak topu)"],["يَوْم الثُّلاثاء","Salı günü"],["مُشاهَدَة السّينَما","Sinema izleme"]]},
  {"id":3001,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"İsim Tamlaması örneklerini anlamlarıyla eşleştir.","ciftler":[["قَلْعَة الْفَتَاة","Kız Kalesi"],["عاصِمَة تُرْكِيا","Türkiye başkenti"],["غُرْفَةُ الجُلوسِ","Oturma odası"],["مَمَرّ المُشاة","Yaya geçidi"]]},
  {"id":3002,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"İsim Tamlaması örneklerini anlamlarıyla eşleştir.","ciftler":[["قِراءَة الكُتُب","Kitap okuma"],["يَوْم الجُمُعَة","Cuma günü"],["رَبَّة البَيْت","Ev hanımı"],["مَدِينَة قُونْيَا","Konya şehri"]]},
  {"id":3003,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Sıfat Tamlaması örneklerini anlamlarıyla eşleştir.","ciftler":[["الضَّوْء الأَحْمَر","Kırmızı ışık"],["أَخي الكَبيرُ","Büyük kardeşim"],["الأُسْبوع القادِم","Gelecek hafta"],["الشّارِع الواسِع","Geniş cadde"]]},
  {"id":3004,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Sıfat Tamlaması örneklerini anlamlarıyla eşleştir.","ciftler":[["الغِذاء الصِّحِّيّ","Sağlıklı gıda"],["الصَّيْدَلِيَّة الجَديدَة","Yeni eczane"],["القِطار السَّريع","Hızlı tren"],["السّوق القَديم","Eski çarşı"]]},
  {"id":3005,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"İsim Cümlesi örneklerini anlamlarıyla eşleştir.","ciftler":[["مَدْرَسَتي بَعيدَة عَن بَيْتي.","Okulum evimden uzaktır."],["الرِّياضَة مُفيدَة لِلصِّحَّة.","Spor sağlık için faydalıdır."],["الشّارِع مُزْدَحِم بِالمُواصَلات.","Cadde ulaşım araçlarıyla kalabalıktır."],["الجَوُّ جَميلٌ فِي الرَّبيعِ.","İlkbaharda hava güzeldir."]]},
  {"id":3006,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"İsim Cümlesi örneklerini anlamlarıyla eşleştir.","ciftler":[["مَدْرَسَتي خَلْف المَسْجِد.","Okulum caminin arkasındadır."],["الطَّقْسُ حارٌّ فِي الصَّيْفِ.","Yazın hava sıcaktır."],["هِي قَلِقَة.","O endişelidir."],["أَنْتَ مُتَقاعِد.","Sen emeklisin."]]},
  {"id":3007,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Fiil Cümlesi örneklerini anlamlarıyla eşleştir.","ciftler":[["تَجَوَّلَتْ مَرْوَة في إِسْطَنْبُول.","Merve İstanbulda gezindi."],["يَعِيشُ يُونُس فِي قُونْيَا.","Yunus Konya'da yaşıyor."],["أُنَظِّفُ غُرْفَتي.","Odamı temizlerim."],["أَعِيشُ فِي مَدِينَة قُونْيَا.","Konya şehrinde yaşıyorum."]]},
  {"id":3008,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Fiil Cümlesi örneklerini anlamlarıyla eşleştir.","ciftler":[["أَسْتَمِعُ إِلى الموسيقى.","Müzik dinliyorum."],["يَلْعَبُ أَحْمَد كُرَة القَدَم.","Ahmet futbol oynuyor."],["آكُلُ الخَضْرَوات وَالفَواكِه.","Sebze ve meyve yiyorum."],["أَلْعَبُ كُرَة القَدَم.","Futbol oynuyorum."]]},
  {"id":4000,"tip":"gramer","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri ögeleriyle eşleştir.","ciftler":[["الأَخْضَر","Sıfat"],["البَيْت","Muzâfun ileyh"],["الضَّوْء","Mevsûf"],["رَبَّة","Muzâf"]]},
  {"id":4001,"tip":"gramer","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri ögeleriyle eşleştir.","ciftler":[["الضَّوْء","Mevsûf"],["مُشاهَدَة","Muzâf"],["الأَحْمَر","Sıfat"],["السّينَما","Muzâfun ileyh"]]},
  {"id":4002,"tip":"gramer","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri ögeleriyle eşleştir.","ciftler":[["السّاعَة","Mevsûf"],["السّابِعَة","Sıfat"],["مَوْلَانَا","Muzâfun ileyh"],["مُتْحَف","Muzâf"]]},
  {"id":4003,"tip":"gramer","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri ögeleriyle eşleştir.","ciftler":[["غُرْفَةُ","Muzâf"],["القَديم","Sıfat"],["الجُلوسِ","Muzâfun ileyh"],["السّوق","Mevsûf"]]},
  {"id":4004,"tip":"gramer","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri ögeleriyle eşleştir.","ciftler":[["مُفيدَة","Haber"],["الرِّياضَة","Mübteda"],["يُونُس","Fâil"],["يَعِيشُ","Fiil"]]},
  {"id":4005,"tip":"gramer","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri ögeleriyle eşleştir.","ciftler":[["مَرْوَة","Fâil"],["تَجَوَّلَتْ","Fiil"],["الفُنْدُق","Mübteda"],["قَريب","Haber"]]},
  {"id":5000,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu cümlede «الطَّقْسُ» kelimesi Mübteda'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"الطَّقْسُ حارٌّ فِي الصَّيْفِ."},
  {"id":5001,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu öbekte «مُتْحَف» kelimesi Muzâfun ileyh'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"مُتْحَف مَوْلَانَا"},
  {"id":5002,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu öbekte «مُشاهَدَة» kelimesi Muzâf'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"مُشاهَدَة السّينَما"},
  {"id":5003,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu cümlede «الفُنْدُق» kelimesi Haber'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"الفُنْدُق قَريب مِنْ هُنا."},
  {"id":5004,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu öbekte «الأُسْبوع» kelimesi Mevsûf'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"الأُسْبوع القادِم"},
  {"id":5005,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu cümlede «يَعِيشُ» kelimesi Fâil'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"يَعِيشُ يُونُس فِي قُونْيَا."},
  {"id":5006,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu öbekte «كُرَة» kelimesi Muzâf'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"كُرَة القَدَم"},
  {"id":5007,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu öbekte «يَوْم» kelimesi Muzâfun ileyh'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"يَوْم الجُمُعَة"},
  {"id":5008,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu öbekte «أَخي» kelimesi Mevsûf'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"أَخي الكَبيرُ"},
  {"id":5009,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu öbekte «الصَّيْدَلِيَّة» kelimesi Sıfat'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"الصَّيْدَلِيَّة الجَديدَة"},
  {"id":5010,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu öbekte «الضَّوْء» kelimesi Mevsûf'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"الضَّوْء الأَحْمَر"},
  {"id":5011,"tip":"gramer","bicim":"dogruyanlis","zorluk":2,"soru":"Bu cümlede «أُنَظِّفُ» kelimesi Fâil'dır. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"أُنَظِّفُ غُرْفَتي."},
  {"id":6000,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Konya şehri»: «____ قُونْيَا»","secenekler":["مَدِينَة","تُرْكِيا","المُشاة","قِراءَة"],"dogru":0,"arSecenek":true},
  {"id":6001,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Mevlana Müzesi»: «مُتْحَف ____»","secenekler":["قِراءَة","مُشاهَدَة","الجُلوسِ","مَوْلَانَا"],"dogru":3,"arSecenek":true},
  {"id":6002,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Türkiye başkenti»: «____ تُرْكِيا»","secenekler":["الجُلوسِ","عاصِمَة","الْفَتَاة","يَوْم"],"dogru":1,"arSecenek":true},
  {"id":6003,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Cuma günü»: «يَوْم ____»","secenekler":["الثُّلاثاء","السّينَما","الجُمُعَة","تُرْكِيا"],"dogru":2,"arSecenek":true},
  {"id":6004,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Sağlıklı gıda»: «____ الصِّحِّيّ»","secenekler":["القِطار","الصَّيْدَلِيَّة","السّوق","الغِذاء"],"dogru":3,"arSecenek":true},
  {"id":6005,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Yeni eczane»: «الصَّيْدَلِيَّة ____»","secenekler":["الأَخْضَر","الواسِع","الجَديدَة","السَّريع"],"dogru":2,"arSecenek":true},
  {"id":6006,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Kırmızı ışık»: «____ الأَحْمَر»","secenekler":["الصَّيْدَلِيَّة","الضَّوْء","القَديم","السّابِعَة"],"dogru":1,"arSecenek":true},
  {"id":6007,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Hızlı tren»: «القِطار ____»","secenekler":["الصَّيْدَلِيَّة","السَّريع","السّاعَة","الجَديدَة"],"dogru":1,"arSecenek":true},
  {"id":6008,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «O şaşkındır.»: «____ مُتَعَجِّب.»","secenekler":["قَريب","الرِّياضَة","مِنْ","هُو"],"dogru":3,"arSecenek":true},
  {"id":6009,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Okulum evimden uzaktır.»: «مَدْرَسَتي ____ عَن بَيْتي.»","secenekler":["هُو","بَعيدَة","هُنا.","مِنْ"],"dogru":1,"arSecenek":true},
  {"id":6010,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Sen emeklisin.»: «____ مُتَقاعِد.»","secenekler":["خَلْف","مِنْ","أَنْتَ","الصَّيْفِ."],"dogru":2,"arSecenek":true},
  {"id":6011,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Spor sağlık için faydalıdır.»: «____ مُفيدَة لِلصِّحَّة.»","secenekler":["مَدْرَسَتي","بَيْتي.","مُتَعَجِّب.","الرِّياضَة"],"dogru":3,"arSecenek":true},
  {"id":6012,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Futbol oynuyorum.»: «____ كُرَة القَدَم.»","secenekler":["أَلْعَبُ","تَجَوَّلَتْ","يُونُس","مَرْوَة"],"dogru":0,"arSecenek":true},
  {"id":6013,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Doktora giderim.»: «أَذْهَبُ ____ الطَّبيب.»","secenekler":["فِي","إِلى","أَسْتَمِعُ","يُونُس"],"dogru":1,"arSecenek":true},
  {"id":6014,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Sebze ve meyve yiyorum.»: «آكُلُ الخَضْرَوات ____»","secenekler":["غُرْفَتي.","وَالفَواكِه.","الموسيقى.","أَعِيشُ"],"dogru":1,"arSecenek":true},
  {"id":6015,"tip":"cumle","bicim":"bosluk","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç — «Konya şehrinde yaşıyorum.»: «أَعِيشُ فِي مَدِينَة ____»","secenekler":["الطَّبيب.","القَدَم.","أَلْعَبُ","قُونْيَا."],"dogru":3,"arSecenek":true},
  {"id":7000,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Spor sağlık için faydalıdır.»","parcalar":["الرِّياضَة","مُفيدَة","لِلصِّحَّة."]},
  {"id":7001,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Otel buraya yakındır.»","parcalar":["الفُنْدُق","قَريب","مِنْ","هُنا."]},
  {"id":7002,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Okulum evimden uzaktır.»","parcalar":["مَدْرَسَتي","بَعيدَة","عَن","بَيْتي."]},
  {"id":7003,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Yazın hava sıcaktır.»","parcalar":["الطَّقْسُ","حارٌّ","فِي","الصَّيْفِ."]},
  {"id":7004,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «İlkbaharda hava güzeldir.»","parcalar":["الجَوُّ","جَميلٌ","فِي","الرَّبيعِ."]},
  {"id":7005,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Cadde ulaşım araçlarıyla kalabalıktır.»","parcalar":["الشّارِع","مُزْدَحِم","بِالمُواصَلات."]},
  {"id":7006,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Okulum caminin arkasındadır.»","parcalar":["مَدْرَسَتي","خَلْف","المَسْجِد."]},
  {"id":7007,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Ahmet futbol oynuyor.»","parcalar":["يَلْعَبُ","أَحْمَد","كُرَة","القَدَم."]},
  {"id":7008,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Merve İstanbulda gezindi.»","parcalar":["تَجَوَّلَتْ","مَرْوَة","في","إِسْطَنْبُول."]},
  {"id":7009,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Yunus Konya'da yaşıyor.»","parcalar":["يَعِيشُ","يُونُس","فِي","قُونْيَا."]},
  {"id":7010,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Boğazımda ağrı hissediyorum.»","parcalar":["أَشْعُرُ","بِأَلَم","في","حَلْقي."]},
  {"id":7011,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Sebze ve meyve yiyorum.»","parcalar":["آكُلُ","الخَضْرَوات","وَالفَواكِه."]},
  {"id":7012,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Futbol oynuyorum.»","parcalar":["أَلْعَبُ","كُرَة","القَدَم."]},
  {"id":7013,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Doktora giderim.»","parcalar":["أَذْهَبُ","إِلى","الطَّبيب."]},
  {"id":7014,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Müzik dinliyorum.»","parcalar":["أَسْتَمِعُ","إِلى","الموسيقى."]},
  {"id":7015,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Konya şehrinde yaşıyorum.»","parcalar":["أَعِيشُ","فِي","مَدِينَة","قُونْيَا."]},
  {"id":9000,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Cuma günü»","parcalar":["يَوْم","الجُمُعَة"]},
  {"id":9001,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Salı günü»","parcalar":["يَوْم","الثُّلاثاء"]},
  {"id":9002,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Futbol (ayak topu)»","parcalar":["كُرَة","القَدَم"]},
  {"id":9003,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Yaya geçidi»","parcalar":["مَمَرّ","المُشاة"]},
  {"id":9004,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Oturma odası»","parcalar":["غُرْفَةُ","الجُلوسِ"]},
  {"id":9005,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Ev hanımı»","parcalar":["رَبَّة","البَيْت"]},
  {"id":9006,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Kız Kalesi»","parcalar":["قَلْعَة","الْفَتَاة"]},
  {"id":9007,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Mevlana Müzesi»","parcalar":["مُتْحَف","مَوْلَانَا"]},
  {"id":9008,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Türkiye başkenti»","parcalar":["عاصِمَة","تُرْكِيا"]},
  {"id":9009,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Kitap okuma»","parcalar":["قِراءَة","الكُتُب"]},
  {"id":9010,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Konya şehri»","parcalar":["مَدِينَة","قُونْيَا"]},
  {"id":9011,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Sinema izleme»","parcalar":["مُشاهَدَة","السّينَما"]},
  {"id":9012,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Kırmızı ışık»","parcalar":["الضَّوْء","الأَحْمَر"]},
  {"id":9013,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Yeşil ışık»","parcalar":["الضَّوْء","الأَخْضَر"]},
  {"id":9014,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Hızlı tren»","parcalar":["القِطار","السَّريع"]},
  {"id":9015,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Geniş cadde»","parcalar":["الشّارِع","الواسِع"]},
  {"id":9016,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Yeni eczane»","parcalar":["الصَّيْدَلِيَّة","الجَديدَة"]},
  {"id":9017,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Eski çarşı»","parcalar":["السّوق","القَديم"]},
  {"id":9018,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Sağlıklı gıda»","parcalar":["الغِذاء","الصِّحِّيّ"]},
  {"id":9019,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Gelecek hafta»","parcalar":["الأُسْبوع","القادِم"]},
  {"id":9020,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Yedinci saat»","parcalar":["السّاعَة","السّابِعَة"]},
  {"id":9021,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Kelimeleri sırala: «Büyük kardeşim»","parcalar":["أَخي","الكَبيرُ"]},
  {"id":8000,"tip":"gramer","zorluk":1,"soru":"İsim tamlamasının ögeleri nelerdir?","secenekler":["Mevsûf ve Sıfat","Muzâf ve Muzâfun ileyh","Mübteda ve Haber","Sıfat ve Haber","Fiil, Fâil ve Mef’ûl"],"dogru":1},
  {"id":8001,"tip":"gramer","zorluk":1,"soru":"Sıfat tamlamasının ögeleri nelerdir?","secenekler":["Muzâf ve Muzâfun ileyh","Mübteda ve Haber","Fâil ve Mef’ûl","Mevsûf ve Sıfat","Fiil, Fâil ve Mef’ûl"],"dogru":3},
  {"id":8002,"tip":"gramer","zorluk":1,"soru":"İsim cümlesinin ögeleri nelerdir?","secenekler":["Muzâf ve Muzâfun ileyh","Mevsûf ve Sıfat","Fiil, Fâil ve Mef’ûl","Mübteda ve Haber","Fiil ve Fâil"],"dogru":3},
  {"id":8003,"tip":"gramer","zorluk":1,"soru":"Fiil cümlesinin ögeleri nelerdir?","secenekler":["Mevsûf ve Sıfat","Mübteda ve Fâil","Muzâf ve Muzâfun ileyh","Mübteda ve Haber","Fiil, Fâil ve Mef’ûl"],"dogru":4},
  {"id":8004,"tip":"gramer","zorluk":1,"soru":"İsim tamlaması hangi soruya cevap verir?","secenekler":["Nerede?","Ne zaman?","Kimin, neyin?","Kaç tane?","Nasıl?"],"dogru":2},
  {"id":8005,"tip":"gramer","zorluk":1,"soru":"Sıfat tamlaması hangi soruya cevap verir?","secenekler":["Nasıl?","Ne zaman?","Kimin, neyin?","Niçin?","Nereye?"],"dogru":0},
  {"id":8006,"tip":"gramer","zorluk":2,"soru":"Muzâf ile ilgili hangisi doğrudur?","secenekler":["Daima mecrurdur.","Her zaman tenvinle biter.","Daima mansûbdur.","Her zaman ال takısı alır.","Asla ال takısı almaz ve tenvinle bitmez."],"dogru":4},
  {"id":8007,"tip":"gramer","zorluk":2,"soru":"Muzâfun ileyh hangi hâlde bulunur?","secenekler":["Mansûb","Merfû","Meczûm","Bazen merfû bazen mansûb","Mecrur"],"dogru":4},
  {"id":8008,"tip":"gramer","zorluk":2,"soru":"İsim cümlesinde mübteda ve haber hangi hâlde olur?","secenekler":["İkisi de mansûb olur.","İkisi de merfû olur.","İkisi de mecrur olur.","Mübteda mansûb, haber merfû olur.","Mübteda merfû, haber mansûb olur."],"dogru":1},
  {"id":8009,"tip":"gramer","zorluk":2,"soru":"Fiil cümlesinde fâil hangi hâlde olur?","secenekler":["Merfû","Mansûb","Hâli değişmez","Mecrur","Meczûm"],"dogru":0},
  {"id":8010,"tip":"gramer","zorluk":2,"soru":"Fiil cümlesinde mef’ûl hangi hâlde olur?","secenekler":["Mecrur","Mansûb","Meczûm","Merfû","Hâli değişmez"],"dogru":1},
  {"id":8011,"tip":"gramer","zorluk":1,"soru":"Bir cümle fiille başlıyorsa o cümle ne tür cümledir?","secenekler":["Fiil cümlesi","Sıfat tamlaması","İsim tamlaması","Şart cümlesi","İsim cümlesi"],"dogru":0},
  {"id":8012,"tip":"gramer","zorluk":1,"soru":"Bir cümle isimle başlıyorsa o cümle ne tür cümledir?","secenekler":["İsim tamlaması","Sıfat tamlaması","Fiil cümlesi","İsim cümlesi","Soru cümlesi"],"dogru":3},
  {"id":8013,"tip":"gramer","zorluk":2,"soru":"Sıfat tamlamasında ögeler arasında hangi uyumlar aranır?","secenekler":["Hiçbir uyum aranmaz.","Yalnız sayı uyumu aranır.","Yalnız cinsiyet uyumu aranır.","Yalnız marife–nekre uyumu aranır.","Marife–nekre, hareke/harf ve cinsiyet uyumu"],"dogru":4},
  {"id":8014,"tip":"gramer","zorluk":2,"soru":"İsim tamlamasında ögeler arasında uyum aranır mı?","secenekler":["Yalnız hareke uyumu aranır.","Bütün uyumlar aranır.","Marife–nekre uyumu aranır.","Yalnız cinsiyet uyumu aranır.","Aranmaz."],"dogru":4},
  {"id":8015,"tip":"gramer","zorluk":2,"soru":"Fiil cümlesinde cinsiyet uyumu nerede olur?","secenekler":["Fiil ile mef’ûl arasında","Bütün ögeler arasında","Yalnız fiil ile fâil arasında","Fâil ile mef’ûl arasında","Hiçbir yerde olmaz"],"dogru":2},
  {"id":8016,"tip":"gramer","zorluk":2,"soru":"İsim ve sıfat tamlamaları Türkçeye nasıl çevrilir?","secenekler":["Önce sıfat, sonra mevsûf çevrilir.","Baştan sona aynı sırayla çevrilir.","Yalnız ilk kelime çevrilir.","Tersten (sondan başa) çevrilir.","Çeviride sıra önemli değildir."],"dogru":3},
  {"id":8017,"tip":"gramer","zorluk":3,"soru":"İsim cümlesinde mübteda ile haber marifelik bakımından nasıldır?","secenekler":["İkisi de marife olur.","İkisi de nekre olur.","Mübteda marife, haber nekre olur.","Marifelik önemli değildir.","Mübteda nekre, haber marife olur."],"dogru":2},
  {"id":8018,"tip":"gramer","zorluk":2,"soru":"Fiil cümlesinde fiil nasıl bulunur?","secenekler":["Yalnız mazi olur.","Ortada bulunur.","Cümlenin sonunda olur.","Fâile göre çoğullaşır.","Cümlenin başında ve tekil olur."],"dogru":4},
  {"id":8019,"tip":"gramer","zorluk":2,"soru":"Ögeleri birbirine yapı bakımından çok benzeyen tamlama hangisidir?","secenekler":["Fiil cümlesi","Hepsi aynıdır","İsim tamlaması","İsim cümlesi","Sıfat tamlaması"],"dogru":4}
];

/* ===================================================================
   İ'RAB SORULARI — tamlamavecumleler.html'deki İ'RAB TESTİ buradadır.
   Kaynak: o sayfanın ÖRNEK HAVUZU (window.TC_HAVUZ). Dört soru kökü de
   testtekiyle aynı: hâl (kolay) · görev (orta) · alâmet (orta) ·
   nasıl görünüyor / lafzen-takdiren-mahallen (zor). Çeldiriciler aynı
   eksenden ve DETERMİNİSTİKTİR; görev çeldiricisi doğru cevapla aynı
   tabanı paylaşmaz (Fâil ↔ "Fâil · cem-i..." yan yana düşmez).
   Dosya /tmp/biy_irab_uret.js ile üretilir; örnek havuzu değişirse
   yeniden üret — iki liste asla ayrı düşmesin.
   =================================================================== */
const IRAB_SORULARI = [
  {"id":1,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْمُعَلِّمُ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُ"},
  {"id":2,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْمُعَلِّمُ» kelimesinin görevi nedir?","secenekler":["Fâil","Mef'ul · cem-i müzekker sâlim","Harf-i cerden sonra · ikil","Haber"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُ"},
  {"id":3,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْمُعَلِّمُ» kelimesinin i'rab alâmeti nedir?","secenekler":["Zamme (ötre)","Ya (harf)","Kesra (istisna!)","Fetha (istisna!)"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُ"},
  {"id":4,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْمُعَلِّمُ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُ"},
  {"id":5,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْكِتَابَ» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"قَرَأْتُ الْكِتَابَ"},
  {"id":6,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْكِتَابَ» kelimesinin görevi nedir?","secenekler":["Mef'ul","Mübteda","Mef'ul (öne alınmış)","Başında edat yok"],"dogru":0,"arapca":"قَرَأْتُ الْكِتَابَ"},
  {"id":7,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْكِتَابَ» kelimesinin i'rab alâmeti nedir?","secenekler":["Fetha (üstün)","Takdir edilen fetha","Takdir edilen kesra","Fetha (görünür!)"],"dogru":0,"arapca":"قَرَأْتُ الْكِتَابَ"},
  {"id":8,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْكِتَابَ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"قَرَأْتُ الْكِتَابَ"},
  {"id":9,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْبَيْتِ» kelimesinin hâli nedir?","secenekler":["Mecrur","Merfu","Mansub","Meczum"],"dogru":0,"arapca":"فِي الْبَيْتِ"},
  {"id":10,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْبَيْتِ» kelimesinin görevi nedir?","secenekler":["Harf-i cerden sonra","لَمْ edatından sonra","لَنْ / لَمْ edatından sonra","Fiil"],"dogru":0,"arapca":"فِي الْبَيْتِ"},
  {"id":11,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْبَيْتِ» kelimesinin i'rab alâmeti nedir?","secenekler":["Kesra (esre)","Sükûn","Nûnun durması","Nûnun düşmesi"],"dogru":0,"arapca":"فِي الْبَيْتِ"},
  {"id":12,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْبَيْتِ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"فِي الْبَيْتِ"},
  {"id":13,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْمُعَلِّمُونَ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُونَ"},
  {"id":14,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْمُعَلِّمُونَ» kelimesinin görevi nedir?","secenekler":["Fâil · cem-i müzekker sâlim","Harf-i cer","Mecrur isim","Haber · muzâf"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُونَ"},
  {"id":15,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْمُعَلِّمُونَ» kelimesinin i'rab alâmeti nedir?","secenekler":["Vav (harf)","Fetha (üstün)","Kesra (esre)","Ya (harf)"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُونَ"},
  {"id":16,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْمُعَلِّمُونَ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُونَ"},
  {"id":17,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْمُعَلِّمِينَ» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"رَأَيْتُ الْمُعَلِّمِينَ"},
  {"id":18,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْمُعَلِّمِينَ» kelimesinin görevi nedir?","secenekler":["Mef'ul · cem-i müzekker sâlim","Muzari fiil","Ma'tûf (fâile bağlı)","Haber (fiil cümlesi)"],"dogru":0,"arapca":"رَأَيْتُ الْمُعَلِّمِينَ"},
  {"id":19,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْمُعَلِّمِينَ» kelimesinin i'rab alâmeti nedir?","secenekler":["Ya (harf)","Fetha (istisna!)","Takdir edilen zamme","Takdir edilen fetha"],"dogru":0,"arapca":"رَأَيْتُ الْمُعَلِّمِينَ"},
  {"id":20,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْمُعَلِّمِينَ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"رَأَيْتُ الْمُعَلِّمِينَ"},
  {"id":21,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْمُعَلِّمَيْنِ» kelimesinin hâli nedir?","secenekler":["Mecrur","Merfu","Mansub","Meczum"],"dogru":0,"arapca":"مَرَرْتُ بِالْمُعَلِّمَيْنِ"},
  {"id":22,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْمُعَلِّمَيْنِ» kelimesinin görevi nedir?","secenekler":["Harf-i cerden sonra · ikil","Fâil","Mef'ul","Haber"],"dogru":0,"arapca":"مَرَرْتُ بِالْمُعَلِّمَيْنِ"},
  {"id":23,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْمُعَلِّمَيْنِ» kelimesinin i'rab alâmeti nedir?","secenekler":["Ya (harf)","Fetha (görünür!)","Yok — mebnî","Sükûn"],"dogru":0,"arapca":"مَرَرْتُ بِالْمُعَلِّمَيْنِ"},
  {"id":24,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْمُعَلِّمَيْنِ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"مَرَرْتُ بِالْمُعَلِّمَيْنِ"},
  {"id":25,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْمُعَلِّمَاتِ» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"رَأَيْتُ الْمُعَلِّمَاتِ"},
  {"id":26,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْمُعَلِّمَاتِ» kelimesinin görevi nedir?","secenekler":["Mef'ul · cem-i müennes sâlim","Harf-i cerden sonra · gayr-i munsarif","Haber","Mübteda"],"dogru":0,"arapca":"رَأَيْتُ الْمُعَلِّمَاتِ"},
  {"id":27,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْمُعَلِّمَاتِ» kelimesinin i'rab alâmeti nedir?","secenekler":["Kesra (istisna!)","Nûnun düşmesi","Zamme (ötre)","Fetha (üstün)"],"dogru":0,"arapca":"رَأَيْتُ الْمُعَلِّمَاتِ"},
  {"id":28,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْمُعَلِّمَاتِ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"رَأَيْتُ الْمُعَلِّمَاتِ"},
  {"id":29,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «مَدَارِسَ» kelimesinin hâli nedir?","secenekler":["Mecrur","Merfu","Mansub","Meczum"],"dogru":0,"arapca":"مَرَرْتُ بِمَدَارِسَ"},
  {"id":30,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «مَدَارِسَ» kelimesinin görevi nedir?","secenekler":["Harf-i cerden sonra · gayr-i munsarif","Başında edat yok","لَنْ edatından sonra","لَمْ edatından sonra"],"dogru":0,"arapca":"مَرَرْتُ بِمَدَارِسَ"},
  {"id":31,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «مَدَارِسَ» kelimesinin i'rab alâmeti nedir?","secenekler":["Fetha (istisna!)","Vav (harf)","Ya (harf)","Kesra (istisna!)"],"dogru":0,"arapca":"مَرَرْتُ بِمَدَارِسَ"},
  {"id":32,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «مَدَارِسَ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"مَرَرْتُ بِمَدَارِسَ"},
  {"id":33,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"جَاءَ الْفَتَى"},
  {"id":34,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinin görevi nedir?","secenekler":["Fâil","لَمْ edatından sonra","لَنْ / لَمْ edatından sonra","Fiil"],"dogru":0,"arapca":"جَاءَ الْفَتَى"},
  {"id":35,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinin i'rab alâmeti nedir?","secenekler":["Takdir edilen zamme","Takdir edilen fetha","Takdir edilen kesra","Fetha (görünür!)"],"dogru":0,"arapca":"جَاءَ الْفَتَى"},
  {"id":36,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinde i'rab nasıl görünüyor?","secenekler":["Takdiren","Lafzen","Mahallen"],"dogru":0,"arapca":"جَاءَ الْفَتَى"},
  {"id":37,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"رَأَيْتُ الْفَتَى"},
  {"id":38,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinin görevi nedir?","secenekler":["Mef'ul","Muzâfun ileyh","Cezm edatı","Muzari fiil"],"dogru":0,"arapca":"رَأَيْتُ الْفَتَى"},
  {"id":39,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinin i'rab alâmeti nedir?","secenekler":["Takdir edilen fetha","Sükûn","Nûnun durması","Nûnun düşmesi"],"dogru":0,"arapca":"رَأَيْتُ الْفَتَى"},
  {"id":40,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinde i'rab nasıl görünüyor?","secenekler":["Takdiren","Lafzen","Mahallen"],"dogru":0,"arapca":"رَأَيْتُ الْفَتَى"},
  {"id":41,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinin hâli nedir?","secenekler":["Mecrur","Merfu","Mansub","Meczum"],"dogru":0,"arapca":"مَرَرْتُ بِالْفَتَى"},
  {"id":42,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinin görevi nedir?","secenekler":["Harf-i cerden sonra","Haber (fiil cümlesi)","Nasb edatı","Fâil"],"dogru":0,"arapca":"مَرَرْتُ بِالْفَتَى"},
  {"id":43,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinin i'rab alâmeti nedir?","secenekler":["Takdir edilen kesra","Fetha (üstün)","Kesra (esre)","Vav (harf)"],"dogru":0,"arapca":"مَرَرْتُ بِالْفَتَى"},
  {"id":44,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْفَتَى» kelimesinde i'rab nasıl görünüyor?","secenekler":["Takdiren","Lafzen","Mahallen"],"dogru":0,"arapca":"مَرَرْتُ بِالْفَتَى"},
  {"id":45,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْقَاضِي» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"جَاءَ الْقَاضِي"},
  {"id":46,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْقَاضِي» kelimesinin görevi nedir?","secenekler":["Fâil","Mef'ul","Harf-i cerden sonra","Haber"],"dogru":0,"arapca":"جَاءَ الْقَاضِي"},
  {"id":47,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْقَاضِي» kelimesinin i'rab alâmeti nedir?","secenekler":["Takdir edilen zamme","Kesra (istisna!)","Fetha (istisna!)","Takdir edilen fetha"],"dogru":0,"arapca":"جَاءَ الْقَاضِي"},
  {"id":48,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْقَاضِي» kelimesinde i'rab nasıl görünüyor?","secenekler":["Takdiren","Lafzen","Mahallen"],"dogru":0,"arapca":"جَاءَ الْقَاضِي"},
  {"id":49,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الْقَاضِيَ» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"رَأَيْتُ الْقَاضِيَ"},
  {"id":50,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْقَاضِيَ» kelimesinin görevi nedir?","secenekler":["Mef'ul","Mübteda","Mef'ul (öne alınmış)","Başında edat yok"],"dogru":0,"arapca":"رَأَيْتُ الْقَاضِيَ"},
  {"id":51,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الْقَاضِيَ» kelimesinin i'rab alâmeti nedir?","secenekler":["Fetha (görünür!)","Takdir edilen kesra","Yok — mebnî","Sükûn"],"dogru":0,"arapca":"رَأَيْتُ الْقَاضِيَ"},
  {"id":52,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الْقَاضِيَ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"رَأَيْتُ الْقَاضِيَ"},
  {"id":53,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «كِتَابِي» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"هَذَا كِتَابِي"},
  {"id":54,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «كِتَابِي» kelimesinin görevi nedir?","secenekler":["Haber","Mübteda","Mef'ul (öne alınmış)","Başında edat yok"],"dogru":0,"arapca":"هَذَا كِتَابِي"},
  {"id":55,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «كِتَابِي» kelimesinin i'rab alâmeti nedir?","secenekler":["Takdir edilen zamme","Nûnun düşmesi","Zamme (ötre)","Fetha (üstün)"],"dogru":0,"arapca":"هَذَا كِتَابِي"},
  {"id":56,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «كِتَابِي» kelimesinde i'rab nasıl görünüyor?","secenekler":["Takdiren","Lafzen","Mahallen"],"dogru":0,"arapca":"هَذَا كِتَابِي"},
  {"id":57,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «هَذَا» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"هَذَا كِتَابٌ"},
  {"id":58,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «هَذَا» kelimesinin görevi nedir?","secenekler":["Mübteda","Başında edat yok","لَنْ edatından sonra","لَمْ edatından sonra"],"dogru":0,"arapca":"هَذَا كِتَابٌ"},
  {"id":59,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «هَذَا» kelimesinin i'rab alâmeti nedir?","secenekler":["Yok — mebnî","Vav (harf)","Ya (harf)","Kesra (istisna!)"],"dogru":0,"arapca":"هَذَا كِتَابٌ"},
  {"id":60,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «هَذَا» kelimesinde i'rab nasıl görünüyor?","secenekler":["Mahallen","Lafzen","Takdiren"],"dogru":0,"arapca":"هَذَا كِتَابٌ"},
  {"id":61,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «الَّذِي» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"قَرَأْتُ الَّذِي كَتَبْتَ"},
  {"id":62,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الَّذِي» kelimesinin görevi nedir?","secenekler":["Mef'ul","Muzari fiil","Ma'tûf (fâile bağlı)","Haber (fiil cümlesi)"],"dogru":0,"arapca":"قَرَأْتُ الَّذِي كَتَبْتَ"},
  {"id":63,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «الَّذِي» kelimesinin i'rab alâmeti nedir?","secenekler":["Yok — mebnî","Takdir edilen zamme","Takdir edilen fetha","Takdir edilen kesra"],"dogru":0,"arapca":"قَرَأْتُ الَّذِي كَتَبْتَ"},
  {"id":64,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «الَّذِي» kelimesinde i'rab nasıl görünüyor?","secenekler":["Mahallen","Lafzen","Takdiren"],"dogru":0,"arapca":"قَرَأْتُ الَّذِي كَتَبْتَ"},
  {"id":65,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «هَؤُلَاءِ» kelimesinin hâli nedir?","secenekler":["Mecrur","Merfu","Mansub","Meczum"],"dogru":0,"arapca":"مَرَرْتُ بِهَؤُلَاءِ"},
  {"id":66,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «هَؤُلَاءِ» kelimesinin görevi nedir?","secenekler":["Harf-i cerden sonra","Fâil","Mef'ul","Haber"],"dogru":0,"arapca":"مَرَرْتُ بِهَؤُلَاءِ"},
  {"id":67,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «هَؤُلَاءِ» kelimesinin i'rab alâmeti nedir?","secenekler":["Yok — mebnî","Sükûn","Nûnun durması","Nûnun düşmesi"],"dogru":0,"arapca":"مَرَرْتُ بِهَؤُلَاءِ"},
  {"id":68,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «هَؤُلَاءِ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Mahallen","Lafzen","Takdiren"],"dogru":0,"arapca":"مَرَرْتُ بِهَؤُلَاءِ"},
  {"id":69,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «إِيَّاكَ» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"إِيَّاكَ نَعْبُدُ"},
  {"id":70,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «إِيَّاكَ» kelimesinin görevi nedir?","secenekler":["Mef'ul (öne alınmış)","Haber (fiil cümlesi)","Nasb edatı","Fâil"],"dogru":0,"arapca":"إِيَّاكَ نَعْبُدُ"},
  {"id":71,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «إِيَّاكَ» kelimesinin i'rab alâmeti nedir?","secenekler":["Yok — mebnî","Fetha (üstün)","Kesra (esre)","Vav (harf)"],"dogru":0,"arapca":"إِيَّاكَ نَعْبُدُ"},
  {"id":72,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «إِيَّاكَ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Mahallen","Lafzen","Takdiren"],"dogru":0,"arapca":"إِيَّاكَ نَعْبُدُ"},
  {"id":73,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «يَكْتُبُ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"يَكْتُبُ الْمُعَلِّمُ"},
  {"id":74,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبُ» kelimesinin görevi nedir?","secenekler":["Başında edat yok","Harf-i cerden sonra","Fâil · cem-i müzekker sâlim","Mef'ul · cem-i müzekker sâlim"],"dogru":0,"arapca":"يَكْتُبُ الْمُعَلِّمُ"},
  {"id":75,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبُ» kelimesinin i'rab alâmeti nedir?","secenekler":["Zamme (ötre)","Fetha (istisna!)","Takdir edilen zamme","Takdir edilen fetha"],"dogru":0,"arapca":"يَكْتُبُ الْمُعَلِّمُ"},
  {"id":76,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «يَكْتُبُ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"يَكْتُبُ الْمُعَلِّمُ"},
  {"id":77,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «يَكْتُبَ» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"لَنْ يَكْتُبَ"},
  {"id":78,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبَ» kelimesinin görevi nedir?","secenekler":["لَنْ edatından sonra","Mef'ul · cem-i müennes sâlim","Harf-i cerden sonra · gayr-i munsarif","Haber"],"dogru":0,"arapca":"لَنْ يَكْتُبَ"},
  {"id":79,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبَ» kelimesinin i'rab alâmeti nedir?","secenekler":["Fetha (üstün)","Fetha (görünür!)","Yok — mebnî","Sükûn"],"dogru":0,"arapca":"لَنْ يَكْتُبَ"},
  {"id":80,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «يَكْتُبَ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"لَنْ يَكْتُبَ"},
  {"id":81,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «يَكْتُبْ» kelimesinin hâli nedir?","secenekler":["Meczum","Merfu","Mansub","Mecrur"],"dogru":0,"arapca":"لَمْ يَكْتُبْ"},
  {"id":82,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبْ» kelimesinin görevi nedir?","secenekler":["لَمْ edatından sonra","Mef'ul (öne alınmış)","Başında edat yok","لَنْ edatından sonra"],"dogru":0,"arapca":"لَمْ يَكْتُبْ"},
  {"id":83,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبْ» kelimesinin i'rab alâmeti nedir?","secenekler":["Sükûn","Nûnun düşmesi","Zamme (ötre)","Fetha (üstün)"],"dogru":0,"arapca":"لَمْ يَكْتُبْ"},
  {"id":84,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «يَكْتُبْ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"لَمْ يَكْتُبْ"},
  {"id":85,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «يَكْتُبُونَ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"الطُّلَّابُ يَكْتُبُونَ"},
  {"id":86,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبُونَ» kelimesinin görevi nedir?","secenekler":["Başında edat yok","Fiil","Harf-i cer","Mecrur isim"],"dogru":0,"arapca":"الطُّلَّابُ يَكْتُبُونَ"},
  {"id":87,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبُونَ» kelimesinin i'rab alâmeti nedir?","secenekler":["Nûnun durması","Vav (harf)","Ya (harf)","Kesra (istisna!)"],"dogru":0,"arapca":"الطُّلَّابُ يَكْتُبُونَ"},
  {"id":88,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «يَكْتُبُونَ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"الطُّلَّابُ يَكْتُبُونَ"},
  {"id":89,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبُوا» kelimesinin görevi nedir?","secenekler":["لَنْ / لَمْ edatından sonra","Haber · muzâf","Muzâfun ileyh","Cezm edatı"],"dogru":0,"arapca":"لَنْ يَكْتُبُوا · لَمْ يَكْتُبُوا"},
  {"id":90,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبُوا» kelimesinin i'rab alâmeti nedir?","secenekler":["Nûnun düşmesi","Fetha (istisna!)","Takdir edilen zamme","Takdir edilen fetha"],"dogru":0,"arapca":"لَنْ يَكْتُبُوا · لَمْ يَكْتُبُوا"},
  {"id":91,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «يَكْتُبُوا» kelimesinde i'rab nasıl görünüyor?","secenekler":["Lafzen","Takdiren","Mahallen"],"dogru":0,"arapca":"لَنْ يَكْتُبُوا · لَمْ يَكْتُبُوا"},
  {"id":92,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «يَسْعَى» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"يَسْعَى الطَّالِبُ"},
  {"id":93,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَسْعَى» kelimesinin görevi nedir?","secenekler":["Başında edat yok","Ma'tûf (fâile bağlı)","Haber (fiil cümlesi)","Nasb edatı"],"dogru":0,"arapca":"يَسْعَى الطَّالِبُ"},
  {"id":94,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَسْعَى» kelimesinin i'rab alâmeti nedir?","secenekler":["Takdir edilen zamme","Yok — mebnî","Sükûn","Nûnun durması"],"dogru":0,"arapca":"يَسْعَى الطَّالِبُ"},
  {"id":95,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «يَسْعَى» kelimesinde i'rab nasıl görünüyor?","secenekler":["Takdiren","Lafzen","Mahallen"],"dogru":0,"arapca":"يَسْعَى الطَّالِبُ"},
  {"id":96,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «يَدْعُو» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"يَدْعُو الْمُؤْمِنُ"},
  {"id":97,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَدْعُو» kelimesinin görevi nedir?","secenekler":["Başında edat yok","Mef'ul","Harf-i cerden sonra","Fâil · cem-i müzekker sâlim"],"dogru":0,"arapca":"يَدْعُو الْمُؤْمِنُ"},
  {"id":98,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَدْعُو» kelimesinin i'rab alâmeti nedir?","secenekler":["Takdir edilen zamme","Zamme (ötre)","Fetha (üstün)","Kesra (esre)"],"dogru":0,"arapca":"يَدْعُو الْمُؤْمِنُ"},
  {"id":99,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «يَدْعُو» kelimesinde i'rab nasıl görünüyor?","secenekler":["Takdiren","Lafzen","Mahallen"],"dogru":0,"arapca":"يَدْعُو الْمُؤْمِنُ"},
  {"id":100,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «يَسْعَى» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"لَنْ يَسْعَى"},
  {"id":101,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَسْعَى» kelimesinin görevi nedir?","secenekler":["لَنْ edatından sonra","Harf-i cerden sonra · ikil","Mef'ul · cem-i müennes sâlim","Haber"],"dogru":0,"arapca":"لَنْ يَسْعَى"},
  {"id":102,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَسْعَى» kelimesinin i'rab alâmeti nedir?","secenekler":["Takdir edilen fetha","Ya (harf)","Kesra (istisna!)","Fetha (istisna!)"],"dogru":0,"arapca":"لَنْ يَسْعَى"},
  {"id":103,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «يَسْعَى» kelimesinde i'rab nasıl görünüyor?","secenekler":["Takdiren","Lafzen","Mahallen"],"dogru":0,"arapca":"لَنْ يَسْعَى"},
  {"id":104,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"الْمُعَلِّمَاتُ يَكْتُبْنَ"},
  {"id":105,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinin görevi nedir?","secenekler":["Haber","لَنْ / لَمْ edatından sonra","Fiil","Harf-i cer"],"dogru":0,"arapca":"الْمُعَلِّمَاتُ يَكْتُبْنَ"},
  {"id":106,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinin i'rab alâmeti nedir?","secenekler":["Yok — mebnî","Takdir edilen fetha","Takdir edilen kesra","Fetha (görünür!)"],"dogru":0,"arapca":"الْمُعَلِّمَاتُ يَكْتُبْنَ"},
  {"id":107,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Mahallen","Lafzen","Takdiren"],"dogru":0,"arapca":"الْمُعَلِّمَاتُ يَكْتُبْنَ"},
  {"id":108,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"لَنْ يَكْتُبْنَ"},
  {"id":109,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinin görevi nedir?","secenekler":["لَنْ edatından sonra","لَنْ / لَمْ edatından sonra","Fiil","Harf-i cer"],"dogru":0,"arapca":"لَنْ يَكْتُبْنَ"},
  {"id":110,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinin i'rab alâmeti nedir?","secenekler":["Yok — mebnî","Nûnun durması","Nûnun düşmesi","Zamme (ötre)"],"dogru":0,"arapca":"لَنْ يَكْتُبْنَ"},
  {"id":111,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Mahallen","Lafzen","Takdiren"],"dogru":0,"arapca":"لَنْ يَكْتُبْنَ"},
  {"id":112,"tip":"irab","zorluk":1,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinin hâli nedir?","secenekler":["Meczum","Merfu","Mansub","Mecrur"],"dogru":0,"arapca":"لَمْ يَكْتُبْنَ"},
  {"id":113,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinin görevi nedir?","secenekler":["لَمْ edatından sonra","Haber · muzâf","Muzâfun ileyh","Cezm edatı"],"dogru":0,"arapca":"لَمْ يَكْتُبْنَ"},
  {"id":114,"tip":"irab","zorluk":2,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinin i'rab alâmeti nedir?","secenekler":["Yok — mebnî","Kesra (esre)","Vav (harf)","Ya (harf)"],"dogru":0,"arapca":"لَمْ يَكْتُبْنَ"},
  {"id":115,"tip":"irab","zorluk":3,"soru":"Yukarıdaki örnekte «يَكْتُبْنَ» kelimesinde i'rab nasıl görünüyor?","secenekler":["Mahallen","Lafzen","Takdiren"],"dogru":0,"arapca":"لَمْ يَكْتُبْنَ"},
  {"id":116,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «جَاءَ» hangi ögedir?","secenekler":["Fiil","Muzari fiil","Ma'tûf (fâile bağlı)","Haber (fiil cümlesi)"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُ إِلَى الْمَدْرَسَةِ."},
  {"id":117,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الْمُعَلِّمُ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُ إِلَى الْمَدْرَسَةِ."},
  {"id":118,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الْمُعَلِّمُ» hangi ögedir?","secenekler":["Fâil","Harf-i cerden sonra · ikil","Mef'ul · cem-i müennes sâlim","Haber"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُ إِلَى الْمَدْرَسَةِ."},
  {"id":119,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «إِلَى» hangi ögedir?","secenekler":["Harf-i cer","Nasb edatı","Fâil","Mef'ul"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُ إِلَى الْمَدْرَسَةِ."},
  {"id":120,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الْمَدْرَسَةِ» kelimesinin hâli nedir?","secenekler":["Mecrur","Merfu","Mansub","Meczum"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُ إِلَى الْمَدْرَسَةِ."},
  {"id":121,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الْمَدْرَسَةِ» hangi ögedir?","secenekler":["Mecrur isim","Mef'ul","Harf-i cerden sonra","Fâil · cem-i müzekker sâlim"],"dogru":0,"arapca":"جَاءَ الْمُعَلِّمُ إِلَى الْمَدْرَسَةِ."},
  {"id":122,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «قَرَأَ» hangi ögedir?","secenekler":["Fiil","Harf-i cerden sonra","Fâil · cem-i müzekker sâlim","Mef'ul · cem-i müzekker sâlim"],"dogru":0,"arapca":"قَرَأَ الطَّالِبُ الْكِتَابَ."},
  {"id":123,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الطَّالِبُ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"قَرَأَ الطَّالِبُ الْكِتَابَ."},
  {"id":124,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الطَّالِبُ» hangi ögedir?","secenekler":["Fâil","Başında edat yok","لَنْ edatından sonra","لَمْ edatından sonra"],"dogru":0,"arapca":"قَرَأَ الطَّالِبُ الْكِتَابَ."},
  {"id":125,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الْكِتَابَ» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"قَرَأَ الطَّالِبُ الْكِتَابَ."},
  {"id":126,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الْكِتَابَ» hangi ögedir?","secenekler":["Mef'ul","Muzâfun ileyh","Cezm edatı","Muzari fiil"],"dogru":0,"arapca":"قَرَأَ الطَّالِبُ الْكِتَابَ."},
  {"id":127,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الْكِتَابُ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"الْكِتَابُ مُفِيدٌ."},
  {"id":128,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الْكِتَابُ» hangi ögedir?","secenekler":["Mübteda","Haber","Mef'ul (öne alınmış)","Başında edat yok"],"dogru":0,"arapca":"الْكِتَابُ مُفِيدٌ."},
  {"id":129,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «مُفِيدٌ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"الْكِتَابُ مُفِيدٌ."},
  {"id":130,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «مُفِيدٌ» hangi ögedir?","secenekler":["Haber","Harf-i cer","Mecrur isim","Muzâfun ileyh"],"dogru":0,"arapca":"الْكِتَابُ مُفِيدٌ."},
  {"id":131,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «هَذَا» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"هَذَا كِتَابُ الْمُعَلِّمِ."},
  {"id":132,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «هَذَا» hangi ögedir?","secenekler":["Mübteda","لَمْ edatından sonra","لَنْ / لَمْ edatından sonra","Fiil"],"dogru":0,"arapca":"هَذَا كِتَابُ الْمُعَلِّمِ."},
  {"id":133,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «كِتَابُ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"هَذَا كِتَابُ الْمُعَلِّمِ."},
  {"id":134,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «كِتَابُ» hangi ögedir?","secenekler":["Haber · muzâf","Muzari fiil","Ma'tûf (fâile bağlı)","Haber (fiil cümlesi)"],"dogru":0,"arapca":"هَذَا كِتَابُ الْمُعَلِّمِ."},
  {"id":135,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الْمُعَلِّمِ» kelimesinin hâli nedir?","secenekler":["Mecrur","Merfu","Mansub","Meczum"],"dogru":0,"arapca":"هَذَا كِتَابُ الْمُعَلِّمِ."},
  {"id":136,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الْمُعَلِّمِ» hangi ögedir?","secenekler":["Muzâfun ileyh","Harf-i cer","Mecrur isim","Haber · muzâf"],"dogru":0,"arapca":"هَذَا كِتَابُ الْمُعَلِّمِ."},
  {"id":137,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «لَمْ» hangi ögedir?","secenekler":["Cezm edatı","Mecrur isim","Haber · muzâf","Muzâfun ileyh"],"dogru":0,"arapca":"لَمْ يَكْتُبِ الطَّالِبُ الدَّرْسَ."},
  {"id":138,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «يَكْتُبِ» kelimesinin hâli nedir?","secenekler":["Meczum","Merfu","Mansub","Mecrur"],"dogru":0,"arapca":"لَمْ يَكْتُبِ الطَّالِبُ الدَّرْسَ."},
  {"id":139,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «يَكْتُبِ» hangi ögedir?","secenekler":["Muzari fiil","Muzâfun ileyh","Cezm edatı","Ma'tûf (fâile bağlı)"],"dogru":0,"arapca":"لَمْ يَكْتُبِ الطَّالِبُ الدَّرْسَ."},
  {"id":140,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الطَّالِبُ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"لَمْ يَكْتُبِ الطَّالِبُ الدَّرْسَ."},
  {"id":141,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الطَّالِبُ» hangi ögedir?","secenekler":["Fâil","Harf-i cerden sonra · ikil","Mef'ul · cem-i müennes sâlim","Haber"],"dogru":0,"arapca":"لَمْ يَكْتُبِ الطَّالِبُ الدَّرْسَ."},
  {"id":142,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الدَّرْسَ» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"لَمْ يَكْتُبِ الطَّالِبُ الدَّرْسَ."},
  {"id":143,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الدَّرْسَ» hangi ögedir?","secenekler":["Mef'ul","لَنْ / لَمْ edatından sonra","Fiil","Harf-i cer"],"dogru":0,"arapca":"لَمْ يَكْتُبِ الطَّالِبُ الدَّرْسَ."},
  {"id":144,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «جَاءَ» hangi ögedir?","secenekler":["Fiil","Fâil","Mef'ul","Harf-i cerden sonra"],"dogru":0,"arapca":"جَاءَ الْفَتَى وَالْقَاضِي."},
  {"id":145,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الْفَتَى» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"جَاءَ الْفَتَى وَالْقَاضِي."},
  {"id":146,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الْفَتَى» hangi ögedir?","secenekler":["Fâil","Mef'ul (öne alınmış)","Başında edat yok","لَنْ edatından sonra"],"dogru":0,"arapca":"جَاءَ الْفَتَى وَالْقَاضِي."},
  {"id":147,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الْقَاضِي» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"جَاءَ الْفَتَى وَالْقَاضِي."},
  {"id":148,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الْقَاضِي» hangi ögedir?","secenekler":["Ma'tûf (fâile bağlı)","Mef'ul · cem-i müzekker sâlim","Harf-i cerden sonra · ikil","Haber"],"dogru":0,"arapca":"جَاءَ الْفَتَى وَالْقَاضِي."},
  {"id":149,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الْمُعَلِّمَاتُ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"الْمُعَلِّمَاتُ يَكْتُبْنَ الدَّرْسَ."},
  {"id":150,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الْمُعَلِّمَاتُ» hangi ögedir?","secenekler":["Mübteda","Mef'ul · cem-i müennes sâlim","Harf-i cerden sonra · gayr-i munsarif","Haber"],"dogru":0,"arapca":"الْمُعَلِّمَاتُ يَكْتُبْنَ الدَّرْسَ."},
  {"id":151,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «يَكْتُبْنَ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"الْمُعَلِّمَاتُ يَكْتُبْنَ الدَّرْسَ."},
  {"id":152,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «يَكْتُبْنَ» hangi ögedir?","secenekler":["Haber (fiil cümlesi)","Haber","Mübteda","Mef'ul (öne alınmış)"],"dogru":0,"arapca":"الْمُعَلِّمَاتُ يَكْتُبْنَ الدَّرْسَ."},
  {"id":153,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الدَّرْسَ» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"الْمُعَلِّمَاتُ يَكْتُبْنَ الدَّرْسَ."},
  {"id":154,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الدَّرْسَ» hangi ögedir?","secenekler":["Mef'ul","Fâil","Harf-i cerden sonra","Haber"],"dogru":0,"arapca":"الْمُعَلِّمَاتُ يَكْتُبْنَ الدَّرْسَ."},
  {"id":155,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «لَنْ» hangi ögedir?","secenekler":["Nasb edatı","Başında edat yok","لَنْ edatından sonra","لَمْ edatından sonra"],"dogru":0,"arapca":"لَنْ يَنْجَحَ الْكَسُولُ."},
  {"id":156,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «يَنْجَحَ» kelimesinin hâli nedir?","secenekler":["Mansub","Merfu","Mecrur","Meczum"],"dogru":0,"arapca":"لَنْ يَنْجَحَ الْكَسُولُ."},
  {"id":157,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «يَنْجَحَ» hangi ögedir?","secenekler":["Muzari fiil","لَمْ edatından sonra","لَنْ / لَمْ edatından sonra","Fiil"],"dogru":0,"arapca":"لَنْ يَنْجَحَ الْكَسُولُ."},
  {"id":158,"tip":"irab","zorluk":2,"soru":"Yukarıdaki cümlede «الْكَسُولُ» kelimesinin hâli nedir?","secenekler":["Merfu","Mansub","Mecrur","Meczum"],"dogru":0,"arapca":"لَنْ يَنْجَحَ الْكَسُولُ."},
  {"id":159,"tip":"irab","zorluk":3,"soru":"Yukarıdaki cümlede «الْكَسُولُ» hangi ögedir?","secenekler":["Fâil","Haber (fiil cümlesi)","Nasb edatı","Mef'ul"],"dogru":0,"arapca":"لَنْ يَنْجَحَ الْكَسُولُ."}
];

/* ---------------- Seed soru havuzu ---------------- */
/* KONULAR — kidefarapca.com verisi (aynen korunmustur) */
/* Vezinler bankasi (KONULAR icindeki 'vezinler' konusu bunu kullanir) */
const SORULAR = [
  {"id":1,"tip":"vezin","zorluk":1,"soru":"«كاتِب» (kâtip / yazar) kelimesi hangi vezindedir?","secenekler":["فاعِل","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فَعيل"],"dogru":0,"arapca":"كاتِب","arSecenek":true},
  {"id":2,"tip":"vezin","zorluk":1,"soru":"«عالِم» (âlim / bilgin) kelimesi hangi vezindedir?","secenekler":["فاعِل","اِسْتِفْعال","تَفْعيل","فَعيل","فَعّال"],"dogru":0,"arapca":"عالِم","arSecenek":true},
  {"id":3,"tip":"vezin","zorluk":1,"soru":"«حاكِم» (hâkim / yargıç) kelimesi hangi vezindedir?","secenekler":["فاعِل","فِعال","مَفْعول","مَفْعَل","مُفاعَلَة"],"dogru":0,"arapca":"حاكِم","arSecenek":true},
  {"id":4,"tip":"vezin","zorluk":1,"soru":"«طالِب» (tâlip / öğrenci) kelimesi hangi vezindedir?","secenekler":["فاعِل","فَعيل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"طالِب","arSecenek":true},
  {"id":5,"tip":"vezin","zorluk":1,"soru":"«صاحِب» (sâhip) kelimesi hangi vezindedir?","secenekler":["فاعِل","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"صاحِب","arSecenek":true},
  {"id":6,"tip":"vezin","zorluk":1,"soru":"«شاهِد» (şahit / tanık) kelimesi hangi vezindedir?","secenekler":["فاعِل","مَفْعَل","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال"],"dogru":0,"arapca":"شاهِد","arSecenek":true},
  {"id":7,"tip":"vezin","zorluk":1,"soru":"«عادِل» (âdil / adaletli) kelimesi hangi vezindedir?","secenekler":["فاعِل","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"عادِل","arSecenek":true},
  {"id":8,"tip":"vezin","zorluk":1,"soru":"«قادِر» (kâdir / güçlü) kelimesi hangi vezindedir?","secenekler":["فاعِل","اِسْتِفْعال","تَفْعيل","فَعيل","فَعّال"],"dogru":0,"arapca":"قادِر","arSecenek":true},
  {"id":9,"tip":"vezin","zorluk":1,"soru":"«مَكْتوب» (mektup / yazılmış) kelimesi hangi vezindedir?","secenekler":["مَفْعول","اِسْتِفْعال","تَفْعيل","فاعِل","فَعيل"],"dogru":0,"arapca":"مَكْتوب","arSecenek":true},
  {"id":10,"tip":"vezin","zorluk":1,"soru":"«مَعْلوم» (malum / bilinen) kelimesi hangi vezindedir?","secenekler":["مَفْعول","فِعال","مَفْعَل","مُفاعَلَة","مُفَعِّل"],"dogru":0,"arapca":"مَعْلوم","arSecenek":true},
  {"id":11,"tip":"vezin","zorluk":1,"soru":"«مَشْهور» (meşhur / ünlü) kelimesi hangi vezindedir?","secenekler":["مَفْعول","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فاعِل"],"dogru":0,"arapca":"مَشْهور","arSecenek":true},
  {"id":12,"tip":"vezin","zorluk":1,"soru":"«مَحْكوم» (mahkûm) kelimesi hangi vezindedir?","secenekler":["مَفْعول","مَفْعَل","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال"],"dogru":0,"arapca":"مَحْكوم","arSecenek":true},
  {"id":13,"tip":"vezin","zorluk":1,"soru":"«مَوْجود» (mevcut / var olan) kelimesi hangi vezindedir?","secenekler":["مَفْعول","فاعِل","فَعيل","فَعّال","فِعال"],"dogru":0,"arapca":"مَوْجود","arSecenek":true},
  {"id":14,"tip":"vezin","zorluk":1,"soru":"«مَقْصود» (maksut / kastedilen) kelimesi hangi vezindedir?","secenekler":["مَفْعول","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فاعِل"],"dogru":0,"arapca":"مَقْصود","arSecenek":true},
  {"id":15,"tip":"vezin","zorluk":1,"soru":"«مَظْلوم» (mazlum) kelimesi hangi vezindedir?","secenekler":["مَفْعول","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"مَظْلوم","arSecenek":true},
  {"id":16,"tip":"vezin","zorluk":1,"soru":"«مَجْهول» (meçhul / bilinmeyen) kelimesi hangi vezindedir?","secenekler":["مَفْعول","فَعّال","فِعال","مَفْعَل","مُفاعَلَة"],"dogru":0,"arapca":"مَجْهول","arSecenek":true},
  {"id":17,"tip":"vezin","zorluk":1,"soru":"«كَريم» (kerîm / cömert) kelimesi hangi vezindedir?","secenekler":["فَعيل","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"كَريم","arSecenek":true},
  {"id":18,"tip":"vezin","zorluk":1,"soru":"«رَحيم» (rahîm / merhametli) kelimesi hangi vezindedir?","secenekler":["فَعيل","فاعِل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"رَحيم","arSecenek":true},
  {"id":19,"tip":"vezin","zorluk":1,"soru":"«حَكيم» (hakîm / bilge) kelimesi hangi vezindedir?","secenekler":["فَعيل","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"حَكيم","arSecenek":true},
  {"id":20,"tip":"vezin","zorluk":1,"soru":"«عَظيم» (azîm / büyük) kelimesi hangi vezindedir?","secenekler":["فَعيل","اِسْتِفْعال","تَفْعيل","فاعِل","فَعّال"],"dogru":0,"arapca":"عَظيم","arSecenek":true},
  {"id":21,"tip":"vezin","zorluk":1,"soru":"«جَميل» (cemîl / güzel) kelimesi hangi vezindedir?","secenekler":["فَعيل","فاعِل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"جَميل","arSecenek":true},
  {"id":22,"tip":"vezin","zorluk":1,"soru":"«لَطيف» (latîf / hoş) kelimesi hangi vezindedir?","secenekler":["فَعيل","تَفْعيل","فاعِل","فَعّال","فِعال"],"dogru":0,"arapca":"لَطيف","arSecenek":true},
  {"id":23,"tip":"vezin","zorluk":1,"soru":"«سَليم» (selîm / sağlam) kelimesi hangi vezindedir?","secenekler":["فَعيل","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"سَليم","arSecenek":true},
  {"id":24,"tip":"vezin","zorluk":1,"soru":"«كِتاب» (kitap) kelimesi hangi vezindedir?","secenekler":["فِعال","تَفْعيل","فاعِل","فَعيل","فَعّال"],"dogru":0,"arapca":"كِتاب","arSecenek":true},
  {"id":25,"tip":"vezin","zorluk":1,"soru":"«حِساب» (hesap) kelimesi hangi vezindedir?","secenekler":["فِعال","فاعِل","فَعيل","فَعّال","مَفْعول"],"dogru":0,"arapca":"حِساب","arSecenek":true},
  {"id":26,"tip":"vezin","zorluk":1,"soru":"«نِظام» (nizam / düzen) kelimesi hangi vezindedir?","secenekler":["فِعال","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"نِظام","arSecenek":true},
  {"id":27,"tip":"vezin","zorluk":1,"soru":"«جِهاد» (cihat) kelimesi hangi vezindedir?","secenekler":["فِعال","فَعّال","مَفْعول","مَفْعَل","مُفاعَلَة"],"dogru":0,"arapca":"جِهاد","arSecenek":true},
  {"id":28,"tip":"vezin","zorluk":1,"soru":"«لِسان» (lisan / dil) kelimesi hangi vezindedir?","secenekler":["فِعال","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"لِسان","arSecenek":true},
  {"id":29,"tip":"vezin","zorluk":1,"soru":"«سِلاح» (silah) kelimesi hangi vezindedir?","secenekler":["فِعال","فاعِل","فَعيل","فَعّال","مَفْعول"],"dogru":0,"arapca":"سِلاح","arSecenek":true},
  {"id":30,"tip":"vezin","zorluk":1,"soru":"«مُعَلِّم» (muallim / öğretmen) kelimesi hangi vezindedir?","secenekler":["مُفَعِّل","مَفْعول","مَفْعَل","مُفاعَلَة","اِسْتِفْعال"],"dogru":0,"arapca":"مُعَلِّم","arSecenek":true},
  {"id":31,"tip":"vezin","zorluk":1,"soru":"«مُدَرِّس» (müderris) kelimesi hangi vezindedir?","secenekler":["مُفَعِّل","فاعِل","فَعيل","فَعّال","فِعال"],"dogru":0,"arapca":"مُدَرِّس","arSecenek":true},
  {"id":32,"tip":"vezin","zorluk":1,"soru":"«مُؤَذِّن» (müezzin) kelimesi hangi vezindedir?","secenekler":["مُفَعِّل","مَفْعَل","مُفاعَلَة","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"مُؤَذِّن","arSecenek":true},
  {"id":33,"tip":"vezin","zorluk":1,"soru":"«مُفَتِّش» (müfettiş) kelimesi hangi vezindedir?","secenekler":["مُفَعِّل","مَفْعَل","مُفاعَلَة","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"مُفَتِّش","arSecenek":true},
  {"id":34,"tip":"vezin","zorluk":1,"soru":"«مُقَدِّم» (mukaddim / sunan) kelimesi hangi vezindedir?","secenekler":["مُفَعِّل","مَفْعول","مَفْعَل","مُفاعَلَة","اِسْتِفْعال"],"dogru":0,"arapca":"مُقَدِّم","arSecenek":true},
  {"id":35,"tip":"vezin","zorluk":1,"soru":"«تَفْسير» (tefsir) kelimesi hangi vezindedir?","secenekler":["تَفْعيل","فاعِل","فَعيل","فَعّال","فِعال"],"dogru":0,"arapca":"تَفْسير","arSecenek":true},
  {"id":36,"tip":"vezin","zorluk":1,"soru":"«تَبْريك» (tebrik) kelimesi hangi vezindedir?","secenekler":["تَفْعيل","فَعيل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"تَبْريك","arSecenek":true},
  {"id":37,"tip":"vezin","zorluk":1,"soru":"«تَرْتيب» (tertip / düzen) kelimesi hangi vezindedir?","secenekler":["تَفْعيل","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"تَرْتيب","arSecenek":true},
  {"id":38,"tip":"vezin","zorluk":1,"soru":"«تَقْديم» (takdim / sunum) kelimesi hangi vezindedir?","secenekler":["تَفْعيل","فَعيل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"تَقْديم","arSecenek":true},
  {"id":39,"tip":"vezin","zorluk":1,"soru":"«تَبْليغ» (tebliğ) kelimesi hangi vezindedir?","secenekler":["تَفْعيل","اِسْتِفْعال","فاعِل","فَعيل","فَعّال"],"dogru":0,"arapca":"تَبْليغ","arSecenek":true},
  {"id":40,"tip":"vezin","zorluk":1,"soru":"«نَجّار» (neccar / marangoz) kelimesi hangi vezindedir?","secenekler":["فَعّال","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فاعِل"],"dogru":0,"arapca":"نَجّار","arSecenek":true},
  {"id":41,"tip":"vezin","zorluk":1,"soru":"«خَبّاز» (habbaz / fırıncı) kelimesi hangi vezindedir?","secenekler":["فَعّال","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فاعِل"],"dogru":0,"arapca":"خَبّاز","arSecenek":true},
  {"id":42,"tip":"vezin","zorluk":1,"soru":"«بَقّال» (bakkal) kelimesi hangi vezindedir?","secenekler":["فَعّال","مُفَعِّل","اِسْتِفْعال","تَفْعيل","فاعِل"],"dogru":0,"arapca":"بَقّال","arSecenek":true},
  {"id":43,"tip":"vezin","zorluk":1,"soru":"«حَدّاد» (haddad / demirci) kelimesi hangi vezindedir?","secenekler":["فَعّال","مُفاعَلَة","مُفَعِّل","اِسْتِفْعال","تَفْعيل"],"dogru":0,"arapca":"حَدّاد","arSecenek":true},
  {"id":44,"tip":"vezin","zorluk":1,"soru":"«اِسْتِقْبال» (istikbal / karşılama) kelimesi hangi vezindedir?","secenekler":["اِسْتِفْعال","فَعّال","فِعال","مَفْعول","مَفْعَل"],"dogru":0,"arapca":"اِسْتِقْبال","arSecenek":true},
  {"id":45,"tip":"vezin","zorluk":1,"soru":"«اِسْتِقْلال» (istiklal / bağımsızlık) kelimesi hangi vezindedir?","secenekler":["اِسْتِفْعال","فِعال","مَفْعول","مَفْعَل","مُفاعَلَة"],"dogru":0,"arapca":"اِسْتِقْلال","arSecenek":true},
  {"id":46,"tip":"vezin","zorluk":1,"soru":"«اِسْتِعْمار» (istîmar / sömürge) kelimesi hangi vezindedir?","secenekler":["اِسْتِفْعال","مَفْعَل","مُفاعَلَة","مُفَعِّل","تَفْعيل"],"dogru":0,"arapca":"اِسْتِعْمار","arSecenek":true},
  {"id":47,"tip":"vezin","zorluk":1,"soru":"«مُكالَمَة» (mükâleme / konuşma) kelimesi hangi vezindedir?","secenekler":["مُفاعَلَة","فَعيل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"مُكالَمَة","arSecenek":true},
  {"id":48,"tip":"vezin","zorluk":1,"soru":"«مُحاسَبَة» (muhasebe) kelimesi hangi vezindedir?","secenekler":["مُفاعَلَة","فاعِل","فَعيل","فَعّال","فِعال"],"dogru":0,"arapca":"مُحاسَبَة","arSecenek":true},
  {"id":49,"tip":"vezin","zorluk":1,"soru":"«مَكْتَب» (mektep / yazıhane) kelimesi hangi vezindedir?","secenekler":["مَفْعَل","فَعّال","فِعال","مَفْعول","مُفاعَلَة"],"dogru":0,"arapca":"مَكْتَب","arSecenek":true},
  {"id":50,"tip":"vezin","zorluk":1,"soru":"«مَطْبَخ» (matbah / mutfak) kelimesi hangi vezindedir?","secenekler":["مَفْعَل","فَعيل","فَعّال","فِعال","مَفْعول"],"dogru":0,"arapca":"مَطْبَخ","arSecenek":true},
  {"id":9501,"tip":"vezin","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri vezinleriyle eşleştir.","ciftler":[["حِساب","فِعال"],["تَبْريك","تَفْعيل"],["مَظْلوم","مَفْعول"],["مُؤَذِّن","مُفَعِّل"]]},
  {"id":9502,"tip":"vezin","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri vezinleriyle eşleştir.","ciftler":[["مَشْهور","مَفْعول"],["مَكْتَب","مَفْعَل"],["كَريم","فَعيل"],["سِلاح","فِعال"]]},
  {"id":9503,"tip":"vezin","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri vezinleriyle eşleştir.","ciftler":[["مُعَلِّم","مُفَعِّل"],["حَدّاد","فَعّال"],["تَبْليغ","تَفْعيل"],["مَكْتوب","مَفْعول"]]}

];
const KONULAR = [
  /* ---- SINIF KONULARI ----------------------------------------------
     Bir sinifin KELIME ve CUMLE sorulari TEK konuda toplanir; listede
     "N. Sinif" olarak tek satir gorunur. Soru id'leri konu icinde
     benzersiz olmalidir (kelimeler 1..9xxx, cumleler 2xxxx araliginda).
     ------------------------------------------------------------------ */
  /* 6. SINIF — muhadese/veri/6_1_1…6_6_3 ders verisinden ÜRETİLDİ.
     Üretici: oyunlar/uret_biy6.py (ders verisi değişirse yeniden
     çalıştırılır). Elle düzenlenirse betik üzerine yazar. */
  { id: "sinif6", ad: "6. Sınıf", pdf: "", sorular: [
    {"id": 1, "tip": "anlam", "zorluk": 1, "soru": "«فَريق» ne demek?", "secenekler": ["mağara", "takım", "kulak", "sen (erkek)", "-den / -dan"], "dogru": 1, "arapca": "فَريق"},
    {"id": 2, "tip": "anlam", "zorluk": 3, "soru": "«اِتَّجِهْ إِلى اليَسار» ne demek?", "secenekler": ["araç / vasıta", "yaz", "sola dön", "Nur Dağı", "bisiklet"], "dogru": 2, "arapca": "اِتَّجِهْ إِلى اليَسار"},
    {"id": 3, "tip": "anlam", "zorluk": 1, "soru": "«مَشْوِيّ» ne demek?", "secenekler": ["uyandı", "kırmızı", "meblağ / para", "sırasında / esnasında", "ızgara"], "dogru": 4, "arapca": "مَشْوِيّ"},
    {"id": 4, "tip": "anlam", "zorluk": 2, "soru": "«خَفيف» ne demek?", "secenekler": ["Müslüman (erkek)", "hoşuma gidiyor", "büyük", "aferin", "hafif"], "dogru": 4, "arapca": "خَفيف"},
    {"id": 5, "tip": "anlam", "zorluk": 1, "soru": "«سَأَلَ» ne demek?", "secenekler": ["atar", "durur / vakfeye durur", "sordu", "bilgisayar", "küçük (dişil)"], "dogru": 2, "arapca": "سَأَلَ"},
    {"id": 6, "tip": "anlam", "zorluk": 1, "soru": "«ثَلاثَة» ne demek?", "secenekler": ["üç", "insanlar", "Mescid-i Haram", "Bolu", "Kur'ân-ı Kerîm"], "dogru": 0, "arapca": "ثَلاثَة"},
    {"id": 7, "tip": "anlam", "zorluk": 1, "soru": "«جوعانَة» ne demek?", "secenekler": ["temizler", "süt", "Safa", "aç (dişil)", "uzun"], "dogru": 3, "arapca": "جوعانَة"},
    {"id": 8, "tip": "anlam", "zorluk": 1, "soru": "«صَفّ» ne demek?", "secenekler": ["satıcı", "defter", "sınıf", "mevsimler", "dağ"], "dogru": 2, "arapca": "صَفّ"},
    {"id": 9, "tip": "anlam", "zorluk": 2, "soru": "«مَريض» ne demek?", "secenekler": ["Hira Mağarası", "hasta", "israf etme", "kutsal", "-den / -dan"], "dogru": 1, "arapca": "مَريض"},
    {"id": 10, "tip": "anlam", "zorluk": 1, "soru": "«مَدْرَسَة» ne demek?", "secenekler": ["okul", "kulak", "ayak", "...dığı zaman", "at"], "dogru": 0, "arapca": "مَدْرَسَة"},
    {"id": 11, "tip": "anlam", "zorluk": 2, "soru": "«تَخْتارينَ» ne demek?", "secenekler": ["temiz", "-e ihtiyacı var", "pilot", "seçersin (dişil)", "el"], "dogru": 3, "arapca": "تَخْتارينَ"},
    {"id": 12, "tip": "anlam", "zorluk": 1, "soru": "«كوب» ne demek?", "secenekler": ["bardak", "sürer (zaman alır)", "araba", "bu (eril)", "haklı"], "dogru": 0, "arapca": "كوب"},
    {"id": 13, "tip": "anlam", "zorluk": 1, "soru": "«صَغيرَة» ne demek?", "secenekler": ["Kıblî Camii", "beş", "okul", "ayakkabılar", "küçük (dişil)"], "dogru": 4, "arapca": "صَغيرَة"},
    {"id": 14, "tip": "anlam", "zorluk": 1, "soru": "«أَهْلًا وَسَهْلًا» ne demek?", "secenekler": ["hastane", "biletler", "eteklik", "diş", "hoş geldiniz"], "dogru": 4, "arapca": "أَهْلًا وَسَهْلًا"},
    {"id": 15, "tip": "anlam", "zorluk": 2, "soru": "«دَواء» ne demek?", "secenekler": ["kızma", "görür (dişil)", "gezinir / dolaşır", "ilaç", "dinleniyorum"], "dogru": 3, "arapca": "دَواء"},
    {"id": 16, "tip": "anlam", "zorluk": 1, "soru": "«نافِذَة» ne demek?", "secenekler": ["pencere", "hoş geldiniz", "konuşma, diyalog", "-den (uzak)", "muayenehane / poliklinik"], "dogru": 0, "arapca": "نافِذَة"},
    {"id": 17, "tip": "anlam", "zorluk": 1, "soru": "«كُرَةُ القَدَمِ» ne demek?", "secenekler": ["altında", "çiçekler", "futbol", "tişört", "iyiyim"], "dogru": 2, "arapca": "كُرَةُ القَدَمِ"},
    {"id": 18, "tip": "anlam", "zorluk": 2, "soru": "«جاكيت» ne demek?", "secenekler": ["ceket", "eczane", "...dığı zaman", "beyaz", "Ankara"], "dogru": 0, "arapca": "جاكيت"},
    {"id": 19, "tip": "anlam", "zorluk": 1, "soru": "«يَد» ne demek?", "secenekler": ["Filistin", "Asılı Taş", "altında", "el", "şort"], "dogru": 3, "arapca": "يَد"},
    {"id": 20, "tip": "anlam", "zorluk": 1, "soru": "«طالِبَة» ne demek?", "secenekler": ["otobüs", "hafta", "öğrenci (kız)", "doktor (bayan)", "hangi"], "dogru": 2, "arapca": "طالِبَة"},
    {"id": 21, "tip": "anlam", "zorluk": 3, "soru": "«هُنا» ne demek?", "secenekler": ["lütfen (izin verirsen)", "burada / burası", "bilgisayar", "ağrı", "öksürük"], "dogru": 1, "arapca": "هُنا"},
    {"id": 22, "tip": "anlam", "zorluk": 3, "soru": "«سَفينَة» ne demek?", "secenekler": ["gemi", "evin bahçesi", "...dığı zaman", "başla", "-e göre"], "dogru": 0, "arapca": "سَفينَة"},
    {"id": 23, "tip": "anlam", "zorluk": 1, "soru": "«صَوْت» ne demek?", "secenekler": ["işitir (dişil)", "hasta (bayan)", "aç (dişil)", "acil servis", "ses"], "dogru": 4, "arapca": "صَوْت"},
    {"id": 24, "tip": "anlam", "zorluk": 2, "soru": "«لِيرات» ne demek?", "secenekler": ["yol", "başla", "istemiyorum", "üç (dişil)", "liralar"], "dogru": 4, "arapca": "لِيرات"},
    {"id": 25, "tip": "anlam", "zorluk": 1, "soru": "«صَيْف» ne demek?", "secenekler": ["ağır", "yaz", "et", "buzdolabı", "şapka"], "dogru": 1, "arapca": "صَيْف"},
    {"id": 26, "tip": "anlam", "zorluk": 1, "soru": "«وَلَد» ne demek?", "secenekler": ["okul", "...dığı zaman", "çocuk", "giydi", "söyle bana"], "dogru": 2, "arapca": "وَلَد"},
    {"id": 27, "tip": "anlam", "zorluk": 3, "soru": "«وَسَط» ne demek?", "secenekler": ["süpürge", "siyah", "çözecek", "orta", "et"], "dogru": 3, "arapca": "وَسَط"},
    {"id": 28, "tip": "anlam", "zorluk": 2, "soru": "«أَلَم» ne demek?", "secenekler": ["ağrı", "pilot", "Medine-i Münevvere", "pantolonlar", "bir"], "dogru": 0, "arapca": "أَلَم"},
    {"id": 29, "tip": "anlam", "zorluk": 3, "soru": "«القُدْسُ الشَّريف» ne demek?", "secenekler": ["taş", "öyleyse", "Kudüs-i Şerif", "Müslümanlar (erkek)", "dakika"], "dogru": 2, "arapca": "القُدْسُ الشَّريف"},
    {"id": 30, "tip": "anlam", "zorluk": 2, "soru": "«خَلْفَ» ne demek?", "secenekler": ["arkasında", "kızgın (dişil)", "nur / ışık", "Harem-i Kudsî", "Mescid-i Haram"], "dogru": 0, "arapca": "خَلْفَ"},
    {"id": 31, "tip": "anlam", "zorluk": 2, "soru": "«لِماذا» ne demek?", "secenekler": ["aferin (çoğul)", "palto", "dökülür", "niçin", "gelecek"], "dogru": 3, "arapca": "لِماذا"},
    {"id": 32, "tip": "anlam", "zorluk": 1, "soru": "«عُضْو» ne demek?", "secenekler": ["Merve", "akşam yemeği", "üye", "sarı", "mevsimler"], "dogru": 2, "arapca": "عُضْو"},
    {"id": 33, "tip": "anlam", "zorluk": 1, "soru": "«لاعِب» ne demek?", "secenekler": ["garson", "okul", "dış, dışarı", "Müslüman (kadın)", "oyuncu"], "dogru": 4, "arapca": "لاعِب"},
    {"id": 34, "tip": "anlam", "zorluk": 1, "soru": "«يوجَدُ» ne demek?", "secenekler": ["aferin", "buldu", "abdest alır", "deniz kıyısı", "vardır, bulunur"], "dogru": 4, "arapca": "يوجَدُ"},
    {"id": 35, "tip": "anlam", "zorluk": 3, "soru": "«يَقودُ» ne demek?", "secenekler": ["kutsal", "biliyorum", "satın almak için", "sürer (araç)", "bahçe"], "dogru": 3, "arapca": "يَقودُ"},
    {"id": 36, "tip": "anlam", "zorluk": 3, "soru": "«جِبال» ne demek?", "secenekler": ["dağlar", "bilir", "derim", "Türk lirası", "yıkarım"], "dogru": 0, "arapca": "جِبال"},
    {"id": 37, "tip": "anlam", "zorluk": 1, "soru": "«مَوْعِد» ne demek?", "secenekler": ["aferin", "randevu", "güneş", "yıkar (dişil)", "onun kitabı (erkek)"], "dogru": 1, "arapca": "مَوْعِد"},
    {"id": 38, "tip": "anlam", "zorluk": 3, "soru": "«فُنْدُق» ne demek?", "secenekler": ["muayenehane / poliklinik", "gitmeyeceğim", "otel", "araba", "baba"], "dogru": 2, "arapca": "فُنْدُق"},
    {"id": 39, "tip": "anlam", "zorluk": 2, "soru": "«أَسْوَد» ne demek?", "secenekler": ["Müslüman (kadın)", "yeşil ışık", "önce / ilk olarak", "siyah", "harem / kutsal alan"], "dogru": 3, "arapca": "أَسْوَد"},
    {"id": 40, "tip": "anlam", "zorluk": 2, "soru": "«مَبْلَغ» ne demek?", "secenekler": ["meblağ / para", "Arafat Dağı", "Mescid-i Haram", "Bolu", "durak"], "dogru": 0, "arapca": "مَبْلَغ"},
    {"id": 41, "tip": "anlam", "zorluk": 3, "soru": "«يَتَعامَلُ» ne demek?", "secenekler": ["gidiş-dönüş", "eteklik", "davranır / muamele eder", "ev", "Hira Mağarası"], "dogru": 2, "arapca": "يَتَعامَلُ"},
    {"id": 42, "tip": "anlam", "zorluk": 3, "soru": "«ضَوْء» ne demek?", "secenekler": ["Harem-i Kudsî", "otobüs", "gitmeyeceğim", "Bolu", "ışık"], "dogru": 4, "arapca": "ضَوْء"},
    {"id": 43, "tip": "anlam", "zorluk": 1, "soru": "«لَبَن» ne demek?", "secenekler": ["-e ihtiyacı var", "inşallah", "cadde / sokak", "Asılı Taş", "süt (ayran)"], "dogru": 4, "arapca": "لَبَن"},
    {"id": 44, "tip": "anlam", "zorluk": 1, "soru": "«مِمْحاة» ne demek?", "secenekler": ["...dığı zaman", "Merve", "silgi", "sekiz", "vakfe"], "dogru": 2, "arapca": "مِمْحاة"},
    {"id": 45, "tip": "anlam", "zorluk": 2, "soru": "«صوفِيّ» ne demek?", "secenekler": ["-den / -dan", "yünlü", "karşısında", "Kudüs-i Şerif", "Burak Duvarı"], "dogru": 1, "arapca": "صوفِيّ"},
    {"id": 46, "tip": "anlam", "zorluk": 3, "soru": "«بَعيد» ne demek?", "secenekler": ["uzak", "tren", "Bursa", "ama", "az önce"], "dogru": 0, "arapca": "بَعيد"},
    {"id": 47, "tip": "anlam", "zorluk": 2, "soru": "«جِسْم» ne demek?", "secenekler": ["sürer (zaman alır)", "memur", "elbiseler", "vücut", "zeytin"], "dogru": 3, "arapca": "جِسْم"},
    {"id": 48, "tip": "anlam", "zorluk": 1, "soru": "«اثْنا عَشَرَ» ne demek?", "secenekler": ["on iki", "-e göre", "bir (dişil)", "gemi", "...dığı zaman"], "dogru": 0, "arapca": "اثْنا عَشَرَ"},
    {"id": 49, "tip": "anlam", "zorluk": 1, "soru": "«ساعَة» ne demek?", "secenekler": ["Müslüman (erkek)", "saat", "üç", "-e ihtiyacı var", "alışveriş merkezi"], "dogru": 1, "arapca": "ساعَة"},
    {"id": 50, "tip": "anlam", "zorluk": 2, "soru": "«مُعْتَدِل» ne demek?", "secenekler": ["mağara", "Uhud Dağı", "ılıman", "hastane", "baş"], "dogru": 2, "arapca": "مُعْتَدِل"},
    {"id": 51, "tip": "anlam", "zorluk": 2, "soru": "«تَتَوَضَّأُ» ne demek?", "secenekler": ["kız", "adam", "az önce", "abdest alır (dişil)", "nezle"], "dogru": 3, "arapca": "تَتَوَضَّأُ"},
    {"id": 52, "tip": "anlam", "zorluk": 1, "soru": "«غَدًا» ne demek?", "secenekler": ["misket, bilye", "elbise / giysi", "başla", "kırmızı", "yarın"], "dogru": 4, "arapca": "غَدًا"},
    {"id": 53, "tip": "anlam", "zorluk": 1, "soru": "«كُرَةُ اليَدِ» ne demek?", "secenekler": ["Mescid-i Aksâ", "Kıblî Camii", "kızgın", "Asılı Taş", "hentbol"], "dogru": 4, "arapca": "كُرَةُ اليَدِ"},
    {"id": 54, "tip": "anlam", "zorluk": 1, "soru": "«مُفيد» ne demek?", "secenekler": ["faydalı", "geliyor", "Mescid-i Aksâ", "pamuklu", "banyo"], "dogru": 0, "arapca": "مُفيد"},
    {"id": 55, "tip": "anlam", "zorluk": 3, "soru": "«مُمارَسَةُ الرِّياضَة» ne demek?", "secenekler": ["Kur'ân-ı Kerîm", "atar", "nezle", "spor yapma", "çay"], "dogru": 3, "arapca": "مُمارَسَةُ الرِّياضَة"},
    {"id": 56, "tip": "anlam", "zorluk": 1, "soru": "«وَجْه» ne demek?", "secenekler": ["ilerler / gider", "dinleniyorum", "yüz", "beş (dişil)", "konuşma, diyalog"], "dogru": 2, "arapca": "وَجْه"},
    {"id": 57, "tip": "anlam", "zorluk": 3, "soru": "«مُسْلِمات» ne demek?", "secenekler": ["insanlar", "Müslümanlar (kadın)", "hissediyorum", "-e ihtiyacı var", "uyandı"], "dogru": 1, "arapca": "مُسْلِمات"},
    {"id": 58, "tip": "anlam", "zorluk": 2, "soru": "«بارِد» ne demek?", "secenekler": ["soğuk", "sabun", "acil servis", "deniz kıyısı", "çanta"], "dogru": 0, "arapca": "بارِد"},
    {"id": 59, "tip": "anlam", "zorluk": 3, "soru": "«الكَعْبَةُ الشَّريفَة» ne demek?", "secenekler": ["amca", "-e ihtiyacı var", "makarna", "Şerefli Kâbe", "el"], "dogru": 3, "arapca": "الكَعْبَةُ الشَّريفَة"},
    {"id": 60, "tip": "anlam", "zorluk": 1, "soru": "«قَريب» ne demek?", "secenekler": ["yakın", "susamış", "Selahaddin Eyyubî", "acil servis", "hastalık"], "dogru": 0, "arapca": "قَريب"},
    {"id": 61, "tip": "anlam", "zorluk": 1, "soru": "«oyuncu» kelimesinin Arapçası hangisi?", "secenekler": ["مَريضَة", "مَشْوِيّ", "مِنْ فَضْلِكَ", "إِلى أَيْنَ", "لاعِب"], "dogru": 4, "arSecenek": true},
    {"id": 62, "tip": "anlam", "zorluk": 1, "soru": "«sordu» kelimesinin Arapçası hangisi?", "secenekler": ["أَرْتَدي", "كِتاب", "شَوارِع", "أَخ", "سَأَلَ"], "dogru": 4, "arSecenek": true},
    {"id": 63, "tip": "anlam", "zorluk": 3, "soru": "«ücret» kelimesinin Arapçası hangisi?", "secenekler": ["إِنْ شاءَ اللهُ", "فاتِح", "وَسَط", "أُجْرَة", "سائِح"], "dogru": 3, "arSecenek": true},
    {"id": 64, "tip": "anlam", "zorluk": 1, "soru": "«oda» kelimesinin Arapçası hangisi?", "secenekler": ["لَعِبَ", "أَحْسَنْتُمْ", "غُرْفَة", "كِتاب", "أَنْتَ"], "dogru": 2, "arSecenek": true},
    {"id": 65, "tip": "anlam", "zorluk": 1, "soru": "«yıka» kelimesinin Arapçası hangisi?", "secenekler": ["عُضْو", "اِغْسِلْ", "يَقَعُ", "رَصيف", "حِذاء"], "dogru": 1, "arSecenek": true},
    {"id": 66, "tip": "anlam", "zorluk": 1, "soru": "«çatal» kelimesinin Arapçası hangisi?", "secenekler": ["شَوْكَة", "أَبَدًا", "اِنْتَبِهْ", "الصَّلاة", "باب"], "dogru": 0, "arSecenek": true},
    {"id": 67, "tip": "anlam", "zorluk": 1, "soru": "«oyunlar» kelimesinin Arapçası hangisi?", "secenekler": ["أَحْذِيَة", "طائِرَة", "مَبْلَغ", "أَلْعاب", "وَسيلَة"], "dogru": 3, "arSecenek": true},
    {"id": 68, "tip": "anlam", "zorluk": 1, "soru": "«evimiz» kelimesinin Arapçası hangisi?", "secenekler": ["بَيْتُنا", "أَحَدَ عَشَرَ", "عامِل", "هَيّا", "كَثيرًا"], "dogru": 0, "arSecenek": true},
    {"id": 69, "tip": "anlam", "zorluk": 3, "soru": "«sa'y eder / koşar» kelimesinin Arapçası hangisi?", "secenekler": ["مُمارَسَةُ الرِّياضَة", "يَسْعى", "أَب", "خُضْرَوات", "حَساء"], "dogru": 1, "arSecenek": true},
    {"id": 70, "tip": "anlam", "zorluk": 1, "soru": "«de, dahi» kelimesinin Arapçası hangisi?", "secenekler": ["أَطْباق", "العُطْلَةُ الصَّيْفِيَّة", "أَيْضًا", "أَشْعُرُ", "سِنّ"], "dogru": 2, "arSecenek": true},
    {"id": 71, "tip": "anlam", "zorluk": 1, "soru": "«onun kitabı (erkek)» kelimesinin Arapçası hangisi?", "secenekler": ["بُنَيّ", "مَمْنوعُ الوُقوف", "بولو", "شُرْطِيَّة", "كِتابُهُ"], "dogru": 4, "arSecenek": true},
    {"id": 72, "tip": "anlam", "zorluk": 3, "soru": "«her zaman / daima» kelimesinin Arapçası hangisi?", "secenekler": ["دائِمًا", "الصَّخْرَة", "أَبَدًا", "مُشْتَرٍ", "أَمْسِ"], "dogru": 0, "arSecenek": true},
    {"id": 73, "tip": "anlam", "zorluk": 1, "soru": "«lezzetli» kelimesinin Arapçası hangisi?", "secenekler": ["المَدينَةُ المُنَوَّرَة", "مَطَر", "لَذيذ", "يَمْشي", "أُمّ"], "dogru": 2, "arSecenek": true},
    {"id": 74, "tip": "anlam", "zorluk": 1, "soru": "«yavrum» kelimesinin Arapçası hangisi?", "secenekler": ["بُنَيّ", "المَرْوَة", "أَبَدًا", "السّابِعَة", "هَذِهِ"], "dogru": 0, "arSecenek": true},
    {"id": 75, "tip": "anlam", "zorluk": 1, "soru": "«misket, bilye» kelimesinin Arapçası hangisi?", "secenekler": ["تُوجَدُ", "تَرْمي", "حَسَبَ", "دُعْبُلَة", "مَكان"], "dogru": 3, "arSecenek": true},
    {"id": 76, "tip": "anlam", "zorluk": 1, "soru": "«kapı» kelimesinin Arapçası hangisi?", "secenekler": ["أَعْرِفُ", "سَيِّدي", "باب", "الأَكْل", "أَحْزِمَة"], "dogru": 2, "arSecenek": true},
    {"id": 77, "tip": "anlam", "zorluk": 1, "soru": "«on bir» kelimesinin Arapçası hangisi?", "secenekler": ["القُدْسُ الشَّريف", "أَحَدَ عَشَرَ", "أَثْناءَ", "الأُسْبوعُ القادِم", "شاي"], "dogru": 1, "arSecenek": true},
    {"id": 78, "tip": "anlam", "zorluk": 1, "soru": "«sağlık» kelimesinin Arapçası hangisi?", "secenekler": ["صِحَّة", "إِنْ شاءَ اللهُ", "المَسْجِدُ الحَرام", "مَكْتَبَة", "أَطْباق"], "dogru": 0, "arSecenek": true},
    {"id": 79, "tip": "anlam", "zorluk": 1, "soru": "«tereyağı» kelimesinin Arapçası hangisi?", "secenekler": ["أَحَدَ عَشَرَ", "أَماكِن", "الأَماكِنُ المُقَدَّسَة", "زُبْدَة", "ناجِح"], "dogru": 3, "arSecenek": true},
    {"id": 80, "tip": "anlam", "zorluk": 2, "soru": "«yürür» kelimesinin Arapçası hangisi?", "secenekler": ["مُشْكِلَة", "وِشاح", "صَلاة", "لا أُريدُ", "يَمْشي"], "dogru": 4, "arSecenek": true},
    {"id": 9000, "tip": "anlam", "bicim": "eslestir", "zorluk": 1, "soru": "Kelimeleri anlamlarıyla eşleştir.", "ciftler": [["مَرْكَزُ التَّسَوُّقِ", "alışveriş merkezi"], ["مَدْرَسَة", "okul"], ["وَلِذَلِكَ", "bu yüzden"], ["حِوار", "konuşma, diyalog"]]},
    {"id": 9001, "tip": "anlam", "bicim": "eslestir", "zorluk": 1, "soru": "Kelimeleri anlamlarıyla eşleştir.", "ciftler": [["طَبيبَة", "doktor (bayan)"], ["تَعْبان", "yorgun"], ["ثَلّاجَة", "buzdolabı"], ["ذَهَبَ", "gitti"]]},
    {"id": 9002, "tip": "anlam", "bicim": "eslestir", "zorluk": 3, "soru": "Kelimeleri anlamlarıyla eşleştir.", "ciftler": [["جَوْرَب", "çorap"], ["هِيَ", "o (kız)"], ["يَسيرُ", "ilerler / gider"], ["حَقيبَة", "çanta"]]},
    {"id": 9003, "tip": "anlam", "bicim": "eslestir", "zorluk": 3, "soru": "Kelimeleri anlamlarıyla eşleştir.", "ciftler": [["يَقَعُ", "bulunur / yer alır"], ["يَسْمَعُ", "işitir"], ["لا تُسْرِفْ", "israf etme"], ["طَلَب", "sipariş"]]},
    {"id": 9004, "tip": "anlam", "bicim": "eslestir", "zorluk": 3, "soru": "Kelimeleri anlamlarıyla eşleştir.", "ciftler": [["قَريب", "yakın"], ["قِبْلَة", "kıble"], ["أَبْيَض", "beyaz"], ["كوب", "bardak"]]},
    {"id": 9005, "tip": "anlam", "bicim": "eslestir", "zorluk": 2, "soru": "Kelimeleri anlamlarıyla eşleştir.", "ciftler": [["مُسْتَشْفى", "hastane"], ["الفَجْر", "sabah namazı"], ["قُمامَة", "çöp"], ["وَلَد", "çocuk"]]},
    {"id": 9006, "tip": "anlam", "bicim": "dogruyanlis", "zorluk": 2, "soru": "Bu kelime «öyleyse» demek. Doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 0, "arapca": "إِذَنْ"},
    {"id": 9007, "tip": "anlam", "bicim": "dogruyanlis", "zorluk": 3, "soru": "Bu kelime «uzak» demek. Doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 1, "arapca": "المُواصَلات"},
    {"id": 9008, "tip": "anlam", "bicim": "dogruyanlis", "zorluk": 3, "soru": "Bu kelime «uyur» demek. Doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 0, "arapca": "يَنامُ"},
    {"id": 9009, "tip": "anlam", "bicim": "dogruyanlis", "zorluk": 1, "soru": "Bu kelime «öğretmen (bayan)» demek. Doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 1, "arapca": "تَفَضَّلْ"},
    {"id": 9010, "tip": "anlam", "bicim": "dogruyanlis", "zorluk": 1, "soru": "Bu kelime «ev» demek. Doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 0, "arapca": "بَيْت"},
    {"id": 9011, "tip": "anlam", "bicim": "dogruyanlis", "zorluk": 1, "soru": "Bu kelime «yıkarım» demek. Doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 1, "arapca": "صالَةُ الرِّياضَةِ"},
    {"id": 9012, "tip": "anlam", "bicim": "dogruyanlis", "zorluk": 3, "soru": "Bu kelime «uzak» demek. Doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 0, "arapca": "بَعيد"},
    {"id": 9013, "tip": "anlam", "bicim": "dogruyanlis", "zorluk": 1, "soru": "Bu kelime «kızgın (dişil)» demek. Doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 1, "arapca": "خَرَجَ"},
    {"id": 9014, "tip": "anlam", "bicim": "dogruyanlis", "zorluk": 1, "soru": "Bu kelime «öğretmen (bayan)» demek. Doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 0, "arapca": "مُعَلِّمَة"},
    {"id": 9015, "tip": "anlam", "bicim": "dogruyanlis", "zorluk": 2, "soru": "Bu kelime «çamaşır makinesi» demek. Doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 1, "arapca": "أَصْفَر"},
    {"id": 9016, "tip": "anlam", "bicim": "surukle", "zorluk": 2, "soru": "Harfleri sırala: «şimdi»", "parcalar": ["ا", "ل", "آ", "ن"]},
    {"id": 9017, "tip": "anlam", "bicim": "surukle", "zorluk": 1, "soru": "Harfleri sırala: «kitap»", "parcalar": ["ك", "ت", "ا", "ب"]},
    {"id": 9018, "tip": "anlam", "bicim": "surukle", "zorluk": 2, "soru": "Harfleri sırala: «kulak»", "parcalar": ["أ", "ذ", "ن"]},
    {"id": 9019, "tip": "anlam", "bicim": "surukle", "zorluk": 2, "soru": "Harfleri sırala: «altında»", "parcalar": ["ت", "ح", "ت"]},
    {"id": 9020, "tip": "anlam", "bicim": "yazma", "zorluk": 3, "soru": "«şapka» kelimesinin Arapçasını harflerle yaz.", "cevapYazi": "قبعة", "tuslar": ["ب", "ة", "غ", "ز", "ع", "ك", "ت", "س", "ق", "خ"]},
    {"id": 9021, "tip": "anlam", "bicim": "yazma", "zorluk": 3, "soru": "«asla» kelimesinin Arapçasını harflerle yaz.", "cevapYazi": "أبدا", "tuslar": ["ر", "ص", "ش", "أ", "د", "ك", "ا", "ث", "ف", "ب"]},
    {"id": 9022, "tip": "anlam", "bicim": "yazma", "zorluk": 3, "soru": "«duydu» kelimesinin Arapçasını harflerle yaz.", "cevapYazi": "سمع", "tuslar": ["ش", "ا", "ذ", "ز", "ل", "ت", "م", "ع", "س", "د"]},
    {"id": 9023, "tip": "anlam", "bicim": "yazma", "zorluk": 3, "soru": "«kız» kelimesinin Arapçasını harflerle yaz.", "cevapYazi": "بنت", "tuslar": ["ل", "ب", "ت", "ن", "غ", "ع", "ض", "ش", "ر", "و"]},
    {"id": 20000, "tip": "cumle", "zorluk": 1, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Ben çorba pişiriyorum.", "Medine-i Münevvere Müslümanların ilk başkentidir.", "Abdullah erkenden uyandı.", "Doktor reçeteyi yazar."], "dogru": 0, "arapca": "أَنا أَطْبُخُ الحَساءَ."},
    {"id": 20001, "tip": "cumle", "zorluk": 3, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Temizliğine Dikkat et.", "Uçak havalimanına iniyor.", "Saat on bir.", "Turist otele indi."], "dogru": 1, "arapca": "الطّائِرَةُ تَهْبِطُ في المَطارِ."},
    {"id": 20002, "tip": "cumle", "zorluk": 3, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Geminin rengi kahverengidir.", "Yusuf öğle yemeğinde portakal suyunu tercih eder.", "Hastane buraya uzak mı?", "Okulun kapısı"], "dogru": 0, "arapca": "لَوْنُ السَّفينَةِ بُنِّيٌّ."},
    {"id": 20003, "tip": "cumle", "zorluk": 1, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Ahmet aç mı yoksa tok mu? …mı?", "Şapka başımın üstünde.", "Çizmeyi kış mevsiminde Giyerim.", "O (erkek) koştu."], "dogru": 3, "arapca": "هُوَ رَكَضَ."},
    {"id": 20004, "tip": "cumle", "zorluk": 3, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Şerefli Kâbe nerededir?", "Bahçemiz geniştir.", "Ayşe kahvaltıda sütü tercih eder mi?", "Saat on bir."], "dogru": 0, "arapca": "أَيْنَ تَقَعُ الكَعْبَةُ الشَّريفَةُ؟"},
    {"id": 20005, "tip": "cumle", "zorluk": 1, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Arabanı hızlı sürme.", "Buyur.", "Ben mutfaktayım.", "Senin (erkek) adın ne?"], "dogru": 1, "arapca": "تَفَضَّلْ."},
    {"id": 20006, "tip": "cumle", "zorluk": 1, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Ben tereyağı bal ile istiyorum.", "Baban akşam geldiğinde bu problemi çözecek inşallah.", "Sen ızgara tavuğu tercih eder misin? …mi?", "Annesi onu öptü ve ona sordu:"], "dogru": 0, "arapca": "أَنا أُريدُ الزُّبْدَةَ مَعَ العَسَلِ."},
    {"id": 20007, "tip": "cumle", "zorluk": 2, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Ahmet odada.", "Bu Tarık mı?", "Nur Dağı Mekke-i Mükerreme'de mi yoksa Medine-i Münevvere'de mi?", "Kalem kulağımın arkasında."], "dogru": 3, "arapca": "القَلَمُ خَلْفَ أُذُني."},
    {"id": 20008, "tip": "cumle", "zorluk": 2, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Bu bir baştır.", "Sınıfın tahtası", "Yarın kütüphaneye gideceğim.", "Alışveriş merkezi eve yakındır."], "dogru": 0, "arapca": "هَذا رَأْسٌ."},
    {"id": 20009, "tip": "cumle", "zorluk": 2, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Ben kimim?", "Spor yapmam.", "Bu eldiven büyüktür.", "Abdullah evden çıktı."], "dogru": 1, "arapca": "لا أُمارِسُ الرِّياضَةَ."},
    {"id": 20010, "tip": "cumle", "zorluk": 1, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Abdullah elbiselerini giydi.", "Bu bir gençtir.", "Trafik kurallarına önem ver.", "Abdullah evden çıktı."], "dogru": 0, "arapca": "لَبِسَ عَبْدُ اللهِ مَلابِسَهُ."},
    {"id": 20011, "tip": "cumle", "zorluk": 1, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Ağaç evin önündedir.", "Dün televizyon seyrettim.", "Bu sese kızdı ve odasından çıktı.", "Kahvaltıyı yedi."], "dogru": 3, "arapca": "أَكَلَتِ الفَطورَ."},
    {"id": 20012, "tip": "cumle", "zorluk": 1, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Yusuf öğle yemeğinde portakal suyunu tercih eder.", "Sonbaharda yapraklar dökülür.", "O (kız) evden çıktı.", "Ellerini ve yüzünü yıka."], "dogru": 0, "arapca": "يُفَضِّلُ يوسُفُ عَصيرَ البُرْتُقالِ في الغَداءِ."},
    {"id": 20013, "tip": "cumle", "zorluk": 2, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Adam kırmızı ışıkta durur.", "Ayakkabı ayakkabılar.", "Amcam Abdest alır.", "Medine-i Münevvere'ye seyahat ediyorum."], "dogru": 1, "arapca": "حِذاءٌ أَحْذِيَةٌ."},
    {"id": 20014, "tip": "cumle", "zorluk": 2, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Hangi mevsimde yapraklar dökülür?", "Giderim eczaneye ilaç almak için.", "Mekke-i Mükerreme nerededir?", "Müzeyi ziyaret eder."], "dogru": 0, "arapca": "في أَيِّ فَصْلٍ تَتَساقَطُ الأَوْراقُ؟"},
    {"id": 20015, "tip": "cumle", "zorluk": 2, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Çorap çoraplar.", "Senin (erkek) adın ne?", "Uçağa bin ve İstanbul havalimanında in.", "Doktor reçeteyi yazar."], "dogru": 3, "arapca": "الطَّبيبُ يَكْتُبُ الوَصْفَةَ الطِّبِّيَّةَ."},
    {"id": 20016, "tip": "cumle", "zorluk": 3, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Hastane buraya uzak mı?", "Ben mutfaktayım.", "Alışveriş merkezi eve yakındır.", "Ceket kahverengidir."], "dogru": 0, "arapca": "هَلِ المُسْتَشْفى بَعيدٌ عَنْ هُنا؟"},
    {"id": 20017, "tip": "cumle", "zorluk": 1, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Müslüman erkekler ve kadınlar Mescid-i Haram'da Kur'ân-ı Kerîm okurlar.", "Suudi Arabistan'a gideceğim.", "Onun adı Ahmet'tir.", "Bu bir kızdır."], "dogru": 2, "arapca": "اسْمُهُ أَحْمَدُ."},
    {"id": 20018, "tip": "cumle", "zorluk": 2, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Onun mor eldiveni var.", "Saat on iki.", "Niçin hastaneye gidiyorsun, hasta sen mısın?", "Bu bir süpürge mü yoksa çamaşır makinesi mi?"], "dogru": 0, "arapca": "عِنْدَها قُفّازٌ بَنَفْسَجِيٌّ."},
    {"id": 20019, "tip": "cumle", "zorluk": 1, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Geçen ay mescide gittiler.", "Onun adı Zeynep'tir.", "Bu kim?", "Kitabım yenidir."], "dogru": 3, "arapca": "كِتابي جَديدٌ."},
    {"id": 20020, "tip": "cumle", "zorluk": 2, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Benim siyah pantolonum var.", "Şerefli Kâbe nerededir?", "Abdullah okula gitti.", "Bu sarı bir tişörttür."], "dogru": 0, "arapca": "عِنْدي بَنْطَلونٌ أَسْوَدُ."},
    {"id": 20021, "tip": "cumle", "zorluk": 2, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Abdullah namaz için abdest aldı.", "Amcam Abdest alır.", "Göz görür, kulak işitir.", "Ben mutfaktayım."], "dogru": 2, "arapca": "العَيْنُ تَرى وَالأُذُنُ تَسْمَعُ."},
    {"id": 20022, "tip": "cumle", "zorluk": 1, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Ben ekmeğin üzerine tereyağı istiyorum.", "Kudüs Filistin'dedir.", "Öğrenci metroda kitap okuyor.", "Ahmet aç mı yoksa tok mu? …mı?"], "dogru": 0, "arapca": "أَنا أُريدُ الزُّبْدَةَ عَلى الخُبْزِ."},
    {"id": 20023, "tip": "cumle", "zorluk": 2, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Amcam Abdest alır.", "Bu eldiven büyüktür.", "Zeyd futbolcudur.", "Leyla'nın Çantası kahverengidir."], "dogru": 3, "arapca": "حَقيبَةُ لَيْلى بُنِّيَّةٌ."},
    {"id": 20024, "tip": "cumle", "zorluk": 3, "soru": "Bu cümlenin anlamı nedir?", "secenekler": ["Yayalar yeşil ışıkta geçer.", "Cep telefonuyla konuşuyor.", "Müslüman erkekler ve kadınlar Mescid-i Haram'da Kâbe'nin önünde namaz kılarlar.", "Turist otele indi."], "dogru": 0, "arapca": "يَعْبُرُ المُشاةُ في الضَّوْءِ الأَخْضَرِ."},
    {"id": 20025, "tip": "cumle", "zorluk": 3, "soru": "«Metroya bin ve üniversiteye git.» cümlesinin Arapçası hangisi?", "secenekler": ["عِنْدَها مَوْعِدٌ مَعَ الطَّبيبِ.", "الشَّجَرَةُ أَمامَ البَيْتِ.", "اِرْكَبِ المِتْرو وَاذْهَبْ إِلى الجامِعَةِ.", "الجَوُّ مُشْمِسٌ في الصَّيْفِ."], "dogru": 2, "arSecenek": true},
    {"id": 20026, "tip": "cumle", "zorluk": 2, "soru": "«Hangi mevsimde hava sıcak olur?» cümlesinin Arapçası hangisi?", "secenekler": ["في السَّنَةِ أَرْبَعَةُ فُصولٍ وَهِيَ الرَّبيعُ وَالصَّيْفُ وَالخَريفُ وَالشِّتاءُ.", "في أَيِّ فَصْلٍ يَكونُ الجَوُّ حارًّا؟", "السّاعَةُ الحادِيَةَ عَشْرَةَ.", "أَنْقَرَةُ عاصِمَةُ تُرْكِيا وَهِيَ قَريبَةٌ مِنْ مَدينَةِ بولو."], "dogru": 1, "arSecenek": true},
    {"id": 20027, "tip": "cumle", "zorluk": 1, "soru": "«O (kız) kim?» cümlesinin Arapçası hangisi?", "secenekler": ["تَتَساقَطُ الأَوْراقُ في الخَريفِ.", "بُشْرى أَمامَ المُسْتَشْفى.", "مَنْ هِيَ؟", "المَدْرَسَةُ بَعيدَةٌ عَنِ المَطْعَمِ."], "dogru": 2, "arSecenek": true},
    {"id": 20028, "tip": "cumle", "zorluk": 2, "soru": "«Çizmeyi kış mevsiminde Giyerim.» cümlesinin Arapçası hangisi?", "secenekler": ["حَديقَةُ البَيْتِ واسِعَةٌ.", "البَنْطَلونُ أَزْرَقُ.", "ما هِيَ أَوَّلُ عاصِمَةٍ في تاريخِ الإِسْلامِ؟", "أَرْتَدي الجَزْمَةَ في فَصْلِ الشِّتاءِ."], "dogru": 3, "arSecenek": true},
    {"id": 20029, "tip": "cumle", "zorluk": 3, "soru": "«Müslüman erkekler ve kadınlar Mescid-i Haram'da Kâbe'nin önünde namaz kılarlar.» cümlesinin Arapçası hangisi?", "secenekler": ["مَنْ فَتَحَ القُدْسَ الشَّريفَ؟", "ما هِيَ قِبْلَةُ المُسْلِمينَ؟", "يُصَلّي المُسْلِمونَ وَالمُسْلِماتُ في المَسْجِدِ الحَرامِ أَمامَ الكَعْبَةِ.", "ما لَوْنُ الطّائِرَةِ؟ لَوْنُها أَزْرَقُ."], "dogru": 2, "arSecenek": true},
    {"id": 20030, "tip": "cumle", "zorluk": 3, "soru": "«İslam tarihindeki ilk mescit Kuba Mescidi'dir.» cümlesinin Arapçası hangisi?", "secenekler": ["أَكَلَ عَبْدُ اللهِ الفَطورَ.", "أَوَّلُ مَسْجِدٍ في تاريخِ الإِسْلامِ هُوَ مَسْجِدُ قُباءَ.", "الجَزْمَةُ جَديدَةٌ.", "أَكْمَلَ يوسُفُ واجِبَهُ قَبْلَ الغَداءِ."], "dogru": 1, "arSecenek": true},
    {"id": 20031, "tip": "cumle", "zorluk": 2, "soru": "«Paltoyu kış mevsiminde Giyerim.» cümlesinin Arapçası hangisi?", "secenekler": ["أَنا جوعانُ.", "في أَيِّ فَصْلٍ تَتَساقَطُ الأَوْراقُ؟", "أَرْتَدي المِعْطَفَ في فَصْلِ الشِّتاءِ.", "المُسْتَشْفى بَعيدٌ عَنِ البَيْتِ."], "dogru": 2, "arSecenek": true},
    {"id": 20032, "tip": "cumle", "zorluk": 1, "soru": "«Bahçemiz geniştir.» cümlesinin Arapçası hangisi?", "secenekler": ["ما هِيَ قِبْلَةُ المُسْلِمينَ؟", "الدَّجاجُ بِالأَرُزِّ.", "عِنْدَها صُداعٌ.", "حَديقَتُنا واسِعَةٌ."], "dogru": 3, "arSecenek": true},
    {"id": 20033, "tip": "cumle", "zorluk": 1, "soru": "«O doktor mu?» cümlesinin Arapçası hangisi?", "secenekler": ["اِرْجِعوا مِنَ المَدْرَسَةِ بِالحافِلَةِ.", "أُسافِرُ إِلى المَدينَةِ المُنَوَّرَةِ.", "هَلْ هِيَ طَبيبَةٌ؟", "الشَّجَرَةُ أَمامَ البَيْتِ."], "dogru": 2, "arSecenek": true},
    {"id": 20034, "tip": "cumle", "zorluk": 2, "soru": "«Giderim eczaneye ilaç almak için.» cümlesinin Arapçası hangisi?", "secenekler": ["هَذا بُلوفَرٌ قُطْنِيٌّ.", "أَذْهَبُ إِلى الصَّيْدَلِيَّةِ لِشِراءِ الدَّواءِ.", "آكُلُ كَثيرًا في العَشاءِ.", "غارُ حِراءَ هُوَ غارٌ مُهِمٌّ في مَكَّةَ المُكَرَّمَةِ."], "dogru": 1, "arSecenek": true},
    {"id": 20035, "tip": "cumle", "zorluk": 2, "soru": "«Ayakkabı pembedir.» cümlesinin Arapçası hangisi?", "secenekler": ["غَضِبَ مِنْ هَذا الصَّوْتِ وَخَرَجَ مِنْ غُرْفَتِهِ.", "السّاعَةُ الحادِيَةَ عَشْرَةَ.", "الحِذاءُ وَرْدِيٌّ.", "حَقيبَةُ لَيْلى بُنِّيَّةٌ."], "dogru": 2, "arSecenek": true},
    {"id": 20036, "tip": "cumle", "zorluk": 2, "soru": "«Kirlilik hastalığın sebebidir.» cümlesinin Arapçası hangisi?", "secenekler": ["تُوجَدُ في المَدينَةِ المُنَوَّرَةِ ثَلاثَةُ مَساجِدَ قَديمَةٍ وَمُهِمَّةٍ وَهِيَ المَسْجِدُ النَّبَوِيُّ وَمَسْجِدُ قُباءَ وَمَسْجِدُ القِبْلَتَيْنِ.", "اِرْجِعوا مِنَ المَدْرَسَةِ بِالحافِلَةِ.", "قُبَّةُ الصَّخْرَةِ خَلْفَ المَسْجِدِ الأَقْصى.", "الوَساخَةُ سَبَبُ المَرَضِ."], "dogru": 3, "arSecenek": true},
    {"id": 20037, "tip": "cumle", "bicim": "cumlesira", "zorluk": 1, "soru": "Kelimeleri sırala: «Babam akşam gelir.»", "parcalar": ["والِدي", "يَأْتي", "مَساءً."]},
    {"id": 20038, "tip": "cumle", "bicim": "cumlesira", "zorluk": 2, "soru": "Kelimeleri sırala: «Onun uzun atkısı var.»", "parcalar": ["عِنْدَهُ", "وِشاحٌ", "طَويلٌ."]},
    {"id": 20039, "tip": "cumle", "bicim": "cumlesira", "zorluk": 1, "soru": "Kelimeleri sırala: «Kahvaltıda yumurta istiyorum, lütfen.»", "parcalar": ["أُريدُ", "البَيْضَ", "في الفَطورِ", "مِنْ فَضْلِكَ."]},
    {"id": 20040, "tip": "cumle", "bicim": "cumlesira", "zorluk": 1, "soru": "Kelimeleri sırala: «Ben susadım, su istiyorum.»", "parcalar": ["أَنا", "عَطْشانُ،", "أُريدُ", "الماءَ."]},
    {"id": 20041, "tip": "cumle", "bicim": "cumlesira", "zorluk": 1, "soru": "Kelimeleri sırala: «Babayla kim konuşuyor?»", "parcalar": ["مَنْ", "يَتَكَلَّمُ", "مَعَ الأَبِ؟"]},
    {"id": 20042, "tip": "cumle", "bicim": "cumlesira", "zorluk": 1, "soru": "Kelimeleri sırala: «Akşam yemeğinden sonra kek yerim.»", "parcalar": ["آكُلُ", "الكَعْكَةَ", "بَعْدَ العَشاءِ."]},
    {"id": 20043, "tip": "cumle", "bicim": "cumlesira", "zorluk": 2, "soru": "Kelimeleri sırala: «Yazın hava sıcaktır.»", "parcalar": ["الجَوُّ", "حارٌّ", "في الصَّيْفِ."]},
    {"id": 20044, "tip": "cumle", "bicim": "cumlesira", "zorluk": 1, "soru": "Kelimeleri sırala: «O (kız) suyu içti.»", "parcalar": ["هِيَ", "شَرِبَتِ", "الماءَ."]},
    {"id": 20045, "tip": "cumle", "bicim": "cumlesira", "zorluk": 1, "soru": "Kelimeleri sırala: «Ayrıca tavuk ve pilav pişireceğim.»", "parcalar": ["سَأَطْبُخُ", "الدَّجاجَ", "وَالأَرُزَّ", "أَيْضًا."]},
    {"id": 20046, "tip": "cumle", "bicim": "cumlesira", "zorluk": 1, "soru": "Kelimeleri sırala: «İçeceklerden neyi tercih edersin?»", "parcalar": ["ماذا", "تُفَضِّلُ", "مِنَ المَشْروباتِ؟"]},
    {"id": 20047, "tip": "cumle", "bicim": "cumlesira", "zorluk": 1, "soru": "Kelimeleri sırala: «Ahmet ekmeğin üzerine tereyağı yedi mi?»", "parcalar": ["هَلْ", "أَكَلَ", "أَحْمَدُ", "الزُّبْدَةَ", "عَلى الخُبْزِ؟"]},
    {"id": 20048, "tip": "cumle", "bicim": "cumlesira", "zorluk": 1, "soru": "Kelimeleri sırala: «Çok ekmek yeme.»", "parcalar": ["لا تَأْكُلِ", "الخُبْزَ", "كَثيرًا."]},
    {"id": 20049, "tip": "cumle", "bicim": "bosluk", "zorluk": 1, "soru": "Boşluğa gelecek kelimeyi seç: «هَذا الطَّعامُ لَذيذٌ ____»", "secenekler": ["جِدًّا.", "الطّالِبِ", "مُدَرِّسَةٌ.", "أَبْيَضُ."], "dogru": 0, "arSecenek": true},
    {"id": 20050, "tip": "cumle", "bicim": "bosluk", "zorluk": 2, "soru": "Boşluğa gelecek kelimeyi seç: «عِنْدَهُ وِشاحٌ ____»", "secenekler": ["الخامِسَةُ.", "بَنَفْسَجِيٌّ.", "طَويلٌ.", "وَسَأَلَتْهُ:"], "dogru": 2, "arSecenek": true},
    {"id": 20051, "tip": "cumle", "bicim": "bosluk", "zorluk": 1, "soru": "Boşluğa gelecek kelimeyi seç: «اللَّحْمُ لَذيذٌ ____»", "secenekler": ["جِدًّا.", "المَتْحَفَ.", "صُداعٌ.", "أَبْيَضُ."], "dogru": 0, "arSecenek": true},
    {"id": 20052, "tip": "cumle", "bicim": "bosluk", "zorluk": 1, "soru": "Boşluğa gelecek kelimeyi seç: «تَوَضَّأَ عَبْدُ اللهِ ____»", "secenekler": ["الوَلَدِ.", "يَشُمُّ.", "صُداعٌ.", "لِلصَّلاةِ."], "dogru": 3, "arSecenek": true},
    {"id": 20053, "tip": "cumle", "bicim": "bosluk", "zorluk": 1, "soru": "Boşluğa gelecek kelimeyi seç: «والِدي يَأْتي ____»", "secenekler": ["مَساءً.", "بِالضَّبْطِ؟", "الأَوْراقُ؟", "مَريضٌ؟"], "dogru": 0, "arSecenek": true},
    {"id": 20054, "tip": "cumle", "bicim": "bosluk", "zorluk": 1, "soru": "Boşluğa gelecek kelimeyi seç: «لَعِبْنا مُباراةً تَمْهيدِيَّةً ____»", "secenekler": ["شابَّةٌ.", "أَصْفَرُ.", "اليَوْمَ.", "مُفيدَةٌ."], "dogru": 2, "arSecenek": true},
    {"id": 20055, "tip": "cumle", "bicim": "bosluk", "zorluk": 1, "soru": "Boşluğa gelecek kelimeyi seç: «أَنا أُريدُ البَيْضَ ____»", "secenekler": ["وَالجُبْنَ.", "الغَداءَ؟", "وَجْهي.", "الطّالِبِ"], "dogru": 0, "arSecenek": true},
    {"id": 20056, "tip": "cumle", "bicim": "bosluk", "zorluk": 2, "soru": "Boşluğa gelecek kelimeyi seç: «في أَيِّ فَصْلٍ يَكونُ الجَوُّ ____»", "secenekler": ["بِالضَّبْطِ؟", "أَنا؟", "الصَّفِّ", "حارًّا؟"], "dogru": 3, "arSecenek": true},
    {"id": 20057, "tip": "cumle", "bicim": "bosluk", "zorluk": 1, "soru": "Boşluğa gelecek kelimeyi seç: «مَتى اسْتَيْقَظَ ____»", "secenekler": ["سُلَيْمانُ؟", "تَمْشي.", "أَحْزِمَةٌ.", "الحَساءَ."], "dogru": 0, "arSecenek": true},
    {"id": 20058, "tip": "cumle", "bicim": "bosluk", "zorluk": 1, "soru": "Boşluğa gelecek kelimeyi seç: «هَذِهِ زَيْنَبُ، هِيَ ____»", "secenekler": ["أُذُني.", "الفَجْرَ.", "تِلْميذَةٌ.", "مَريضَةٌ."], "dogru": 2, "arSecenek": true},
    {"id": 20059, "tip": "cumle", "bicim": "bosluk", "zorluk": 1, "soru": "Boşluğa gelecek kelimeyi seç: «هَلْ أَكْمَلَ يوسُفُ ____»", "secenekler": ["واجِبَهُ؟", "الحَساءَ.", "قَريبٌ.", "تَسْمَعُ."], "dogru": 0, "arSecenek": true},
    {"id": 20060, "tip": "cumle", "bicim": "bosluk", "zorluk": 2, "soru": "Boşluğa gelecek kelimeyi seç: «هَذا رَأْسُ ____»", "secenekler": ["أَحْمَدَ", "رَأْسي.", "أَحْذِيَةٌ.", "الشّابَّةِ."], "dogru": 3, "arSecenek": true},
    {"id": 20061, "tip": "cumle", "bicim": "dogruyanlis", "zorluk": 1, "soru": "«Saat dokuz.» çevirisi doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 0, "arapca": "السّاعَةُ التّاسِعَةُ."},
    {"id": 20062, "tip": "cumle", "bicim": "dogruyanlis", "zorluk": 1, "soru": "«Temizliğine Dikkat et.» çevirisi doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 1, "arapca": "لَبِسَ عَبْدُ اللهِ مَلابِسَهُ."},
    {"id": 20063, "tip": "cumle", "bicim": "dogruyanlis", "zorluk": 1, "soru": "«O (erkek) kim?» çevirisi doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 0, "arapca": "مَنْ هُوَ؟"},
    {"id": 20064, "tip": "cumle", "bicim": "dogruyanlis", "zorluk": 1, "soru": "«Hava ilkbahar mevsiminde ılımandır.» çevirisi doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 1, "arapca": "سَيَأْكُلُ يوسُفُ في الغَداءِ الدَّجاجَ المَشْوِيَّ مَعَ السَّلَطَةِ."},
    {"id": 20065, "tip": "cumle", "bicim": "dogruyanlis", "zorluk": 1, "soru": "«O (erkek) koştu.» çevirisi doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 0, "arapca": "هُوَ رَكَضَ."},
    {"id": 20066, "tip": "cumle", "bicim": "dogruyanlis", "zorluk": 2, "soru": "«Bu Cemil, o müdürdür.» çevirisi doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 1, "arapca": "اِنْتَبِهْ لِنَظافَتِكَ."},
    {"id": 20067, "tip": "cumle", "bicim": "dogruyanlis", "zorluk": 1, "soru": "«O doktor mu?» çevirisi doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 0, "arapca": "هَلْ هِيَ طَبيبَةٌ؟"},
    {"id": 20068, "tip": "cumle", "bicim": "dogruyanlis", "zorluk": 2, "soru": "«Yumurta hazır.» çevirisi doğru mu?", "secenekler": ["Doğru", "Yanlış"], "dogru": 1, "arapca": "الجَوُّ مُعْتَدِلٌ في فَصْلِ الرَّبيعِ."}
  ]},
  { id: "sinif7", ad: "7. Sınıf", pdf: "", sorular: [
    /* -- kelimeler -- */
    {"id":1,"tip":"anlam","zorluk":1,"soru":"«الفَطور» ne demek?","secenekler":["Kahvaltı","Hızlı","Kahve","Kütüphane","Küçük"],"dogru":0,"arapca":"الفَطور"},
    {"id":2,"tip":"anlam","zorluk":1,"soru":"«الغَداء» ne demek?","secenekler":["Öğle yemeği","Soğan","Süt","Tavuk","Tereyağı"],"dogru":0,"arapca":"الغَداء"},
    {"id":3,"tip":"anlam","zorluk":1,"soru":"«العَشاء» ne demek?","secenekler":["Akşam yemeği","Soğan","Süt","Tavuk","Tereyağı"],"dogru":0,"arapca":"العَشاء"},
    {"id":4,"tip":"anlam","zorluk":1,"soru":"«الصَّباح» ne demek?","secenekler":["Sabah","Yavaş","Yumurta","Zeytin","Çarşı / pazar"],"dogru":0,"arapca":"الصَّباح"},
    {"id":5,"tip":"anlam","zorluk":1,"soru":"«المَساء» ne demek?","secenekler":["Akşam","Elma","Et","Ev","Gece"],"dogru":0,"arapca":"المَساء"},
    {"id":6,"tip":"anlam","zorluk":1,"soru":"«اللَّيْل» ne demek?","secenekler":["Gece","Tavuk","Tereyağı","Tren","Tuz"],"dogru":0,"arapca":"اللَّيْل"},
    {"id":7,"tip":"anlam","zorluk":1,"soru":"«المَدْرَسَة» ne demek?","secenekler":["Okul","Hastane","Havuç","Hızlı","Kahvaltı"],"dogru":0,"arapca":"المَدْرَسَة"},
    {"id":8,"tip":"anlam","zorluk":1,"soru":"«البَيْت» ne demek?","secenekler":["Ev","Küçük","Muz","Okul","Otobüs"],"dogru":0,"arapca":"البَيْت"},
    {"id":9,"tip":"anlam","zorluk":1,"soru":"«الحَليب» ne demek?","secenekler":["Süt","Balık","Başkent","Bisiklet","Büyük"],"dogru":0,"arapca":"الحَليب"},
    {"id":10,"tip":"anlam","zorluk":1,"soru":"«الجُبْن» ne demek?","secenekler":["Peynir","Sabah","Sağ","Sol","Soğan"],"dogru":0,"arapca":"الجُبْن"},
    {"id":11,"tip":"anlam","zorluk":1,"soru":"«الزَّيْتون» ne demek?","secenekler":["Zeytin","Elma","Et","Ev","Gece"],"dogru":0,"arapca":"الزَّيْتون"},
    {"id":12,"tip":"anlam","zorluk":1,"soru":"«اللَّحْم» ne demek?","secenekler":["Et","Sabah","Sağ","Sol","Soğan"],"dogru":0,"arapca":"اللَّحْم"},
    {"id":13,"tip":"anlam","zorluk":1,"soru":"«الأُرْز» ne demek?","secenekler":["Pirinç / pilav","Araba","Bal","Balık","Başkent"],"dogru":0,"arapca":"الأُرْز"},
    {"id":14,"tip":"anlam","zorluk":1,"soru":"«القَهْوَة» ne demek?","secenekler":["Kahve","Bal","Balık","Başkent","Bisiklet"],"dogru":0,"arapca":"القَهْوَة"},
    {"id":15,"tip":"anlam","zorluk":1,"soru":"«الشّاي» ne demek?","secenekler":["Çay","Araba","Bal","Balık","Başkent"],"dogru":0,"arapca":"الشّاي"},
    {"id":16,"tip":"anlam","zorluk":1,"soru":"«السَّمَك» ne demek?","secenekler":["Balık","Kahve","Kütüphane","Küçük","Muz"],"dogru":0,"arapca":"السَّمَك"},
    {"id":17,"tip":"anlam","zorluk":1,"soru":"«الخُبْز» ne demek?","secenekler":["Ekmek","Kahve","Kütüphane","Küçük","Muz"],"dogru":0,"arapca":"الخُبْز"},
    {"id":18,"tip":"anlam","zorluk":1,"soru":"«السُّكَّر» ne demek?","secenekler":["Şeker","Gece","Gemi","Hastane","Havuç"],"dogru":0,"arapca":"السُّكَّر"},
    {"id":19,"tip":"anlam","zorluk":1,"soru":"«المِلْح» ne demek?","secenekler":["Tuz","Öğle yemeği","Üzüm","Şehir","Şeker"],"dogru":0,"arapca":"المِلْح"},
    {"id":20,"tip":"anlam","zorluk":1,"soru":"«العَسَل» ne demek?","secenekler":["Bal","Gece","Gemi","Hastane","Havuç"],"dogru":0,"arapca":"العَسَل"},
    {"id":21,"tip":"anlam","zorluk":1,"soru":"«الزُّبْدَة» ne demek?","secenekler":["Tereyağı","Pahalı","Patates","Peynir","Pirinç / pilav"],"dogru":0,"arapca":"الزُّبْدَة"},
    {"id":22,"tip":"anlam","zorluk":1,"soru":"«البَيْض» ne demek?","secenekler":["Yumurta","Zeytin","Çarşı / pazar","Çay","Öğle yemeği"],"dogru":0,"arapca":"البَيْض"},
    {"id":23,"tip":"anlam","zorluk":1,"soru":"«الدَّجاج» ne demek?","secenekler":["Tavuk","Uzak","Uçak","Yakın","Yavaş"],"dogru":0,"arapca":"الدَّجاج"},
    {"id":24,"tip":"anlam","zorluk":1,"soru":"«التُّفّاح» ne demek?","secenekler":["Elma","Kahvaltı","Kahve","Kütüphane","Küçük"],"dogru":0,"arapca":"التُّفّاح"},
    {"id":25,"tip":"anlam","zorluk":1,"soru":"«المَوْز» ne demek?","secenekler":["Muz","Yavaş","Yumurta","Zeytin","Çarşı / pazar"],"dogru":0,"arapca":"المَوْز"},
    {"id":26,"tip":"anlam","zorluk":1,"soru":"«العِنَب» ne demek?","secenekler":["Üzüm","Elma","Et","Ev","Gece"],"dogru":0,"arapca":"العِنَب"},
    {"id":27,"tip":"anlam","zorluk":1,"soru":"«البُرْتُقال» ne demek?","secenekler":["Portakal","Sabah","Sağ","Sol","Soğan"],"dogru":0,"arapca":"البُرْتُقال"},
    {"id":28,"tip":"anlam","zorluk":1,"soru":"«البَصَل» ne demek?","secenekler":["Soğan","Uzak","Uçak","Yakın","Yavaş"],"dogru":0,"arapca":"البَصَل"},
    {"id":29,"tip":"anlam","zorluk":1,"soru":"«الجَزَر» ne demek?","secenekler":["Havuç","Uçak","Yakın","Yavaş","Yumurta"],"dogru":0,"arapca":"الجَزَر"},
    {"id":30,"tip":"anlam","zorluk":1,"soru":"«البَطاطا» ne demek?","secenekler":["Patates","Kahve","Kütüphane","Küçük","Muz"],"dogru":0,"arapca":"البَطاطا"},
    {"id":31,"tip":"anlam","zorluk":1,"soru":"«السَّيّارَة» ne demek?","secenekler":["Araba","Şehir","Şeker","Akşam","Akşam yemeği"],"dogru":0,"arapca":"السَّيّارَة"},
    {"id":32,"tip":"anlam","zorluk":1,"soru":"«الحافِلَة» ne demek?","secenekler":["Otobüs","Zeytin","Çarşı / pazar","Çay","Öğle yemeği"],"dogru":0,"arapca":"الحافِلَة"},
    {"id":33,"tip":"anlam","zorluk":1,"soru":"«القِطار» ne demek?","secenekler":["Tren","Peynir","Pirinç / pilav","Portakal","Sabah"],"dogru":0,"arapca":"القِطار"},
    {"id":34,"tip":"anlam","zorluk":1,"soru":"«الطّائِرَة» ne demek?","secenekler":["Uçak","Patates","Peynir","Pirinç / pilav","Portakal"],"dogru":0,"arapca":"الطّائِرَة"},
    {"id":35,"tip":"anlam","zorluk":1,"soru":"«الدَّرّاجَة» ne demek?","secenekler":["Bisiklet","Çay","Öğle yemeği","Üzüm","Şehir"],"dogru":0,"arapca":"الدَّرّاجَة"},
    {"id":36,"tip":"anlam","zorluk":1,"soru":"«السَّفينَة» ne demek?","secenekler":["Gemi","Muz","Okul","Otobüs","Pahalı"],"dogru":0,"arapca":"السَّفينَة"},
    {"id":37,"tip":"anlam","zorluk":1,"soru":"«المُسْتَشْفى» ne demek?","secenekler":["Hastane","Portakal","Sabah","Sağ","Sol"],"dogru":0,"arapca":"المُسْتَشْفى"},
    {"id":38,"tip":"anlam","zorluk":1,"soru":"«المَكْتَبَة» ne demek?","secenekler":["Kütüphane","Gece","Gemi","Hastane","Havuç"],"dogru":0,"arapca":"المَكْتَبَة"},
    {"id":39,"tip":"anlam","zorluk":1,"soru":"«المَسْجِد» ne demek?","secenekler":["Cami","Gemi","Hastane","Havuç","Hızlı"],"dogru":0,"arapca":"المَسْجِد"},
    {"id":40,"tip":"anlam","zorluk":1,"soru":"«السّوق» ne demek?","secenekler":["Çarşı / pazar","Peynir","Pirinç / pilav","Portakal","Sabah"],"dogru":0,"arapca":"السّوق"},
    {"id":41,"tip":"anlam","zorluk":1,"soru":"«غالٍ» ne demek?","secenekler":["Pahalı","Ev","Gece","Gemi","Hastane"],"dogru":0,"arapca":"غالٍ"},
    {"id":42,"tip":"anlam","zorluk":1,"soru":"«رَخيص» ne demek?","secenekler":["Ucuz","Kahvaltı","Kahve","Kütüphane","Küçük"],"dogru":0,"arapca":"رَخيص"},
    {"id":43,"tip":"anlam","zorluk":1,"soru":"«كَبير» ne demek?","secenekler":["Büyük","Uçak","Yakın","Yavaş","Yumurta"],"dogru":0,"arapca":"كَبير"},
    {"id":44,"tip":"anlam","zorluk":1,"soru":"«صَغير» ne demek?","secenekler":["Küçük","Ucuz","Uzak","Uçak","Yakın"],"dogru":0,"arapca":"صَغير"},
    {"id":45,"tip":"anlam","zorluk":1,"soru":"«سَريع» ne demek?","secenekler":["Hızlı","Muz","Okul","Otobüs","Pahalı"],"dogru":0,"arapca":"سَريع"},
    {"id":46,"tip":"anlam","zorluk":1,"soru":"«بَطيء» ne demek?","secenekler":["Yavaş","Yakın","Yumurta","Zeytin","Çarşı / pazar"],"dogru":0,"arapca":"بَطيء"},
    {"id":47,"tip":"anlam","zorluk":1,"soru":"«قَريب» ne demek?","secenekler":["Yakın","Portakal","Sabah","Sağ","Sol"],"dogru":0,"arapca":"قَريب"},
    {"id":48,"tip":"anlam","zorluk":1,"soru":"«بَعيد» ne demek?","secenekler":["Uzak","Gemi","Hastane","Havuç","Hızlı"],"dogru":0,"arapca":"بَعيد"},
    {"id":49,"tip":"anlam","zorluk":1,"soru":"«اليَمين» ne demek?","secenekler":["Sağ","Kütüphane","Küçük","Muz","Okul"],"dogru":0,"arapca":"اليَمين"},
    {"id":50,"tip":"anlam","zorluk":1,"soru":"«اليَسار» ne demek?","secenekler":["Sol","Ekmek","Elma","Et","Ev"],"dogru":0,"arapca":"اليَسار"},
    {"id":51,"tip":"anlam","zorluk":1,"soru":"«عاصِمَة» ne demek?","secenekler":["Başkent","Öğle yemeği","Üzüm","Şehir","Şeker"],"dogru":0,"arapca":"عاصِمَة"},
    {"id":52,"tip":"anlam","zorluk":1,"soru":"«مَدينَة» ne demek?","secenekler":["Şehir","Üzüm","Şeker","Akşam","Akşam yemeği"],"dogru":0,"arapca":"مَدينَة"}
  ,
    {"id":9001,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["القِطار","Tren"],["البَيْت","Ev"],["العِنَب","Üzüm"],["السَّيّارَة","Araba"]]},
    {"id":9002,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["عاصِمَة","Başkent"],["الحَليب","Süt"],["البَطاطا","Patates"],["اللَّيْل","Gece"]]},
    {"id":9003,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["الحافِلَة","Otobüs"],["كَبير","Büyük"],["الأُرْز","Pirinç / pilav"],["رَخيص","Ucuz"]]},
    {"id":9004,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «Ev»","parcalar":["ا","ل","ب","ي","ت"]},
    {"id":9005,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «Üzüm»","parcalar":["ا","ل","ع","ن","ب"]},
    {"id":9006,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «Başkent»","parcalar":["ع","ا","ص","م","ة"]},
    {"id":9007,"tip":"anlam","bicim":"yazma","zorluk":3,"soru":"«Gece» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"الليل","tuslar":["ح","ل","د","ب","خ","ث","ا","ي","ج","ت"]},
    {"id":9008,"tip":"anlam","bicim":"yazma","zorluk":3,"soru":"«Büyük» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"كبير","tuslar":["ت","ث","ي","خ","د","ب","ح","ك","ر","ج"]},
    {"id":9009,"tip":"anlam","bicim":"yazma","zorluk":3,"soru":"«Pirinç / pilav» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"الأرز","tuslar":["أ","ح","ل","ر","ب","ا","ث","ز","ج","ت"]},
    /* -- cümleler -- */
    {"id":20001,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Kahvaltıda süt içiyorum.»","parcalar":["أَشْرَبُ","الحَليب","في الفَطور."]},
    {"id":20002,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Akşam yemeğinde meyve suyu içiyorum.","Saat sekiz.","Evde anneme yardım ederim.","Sen öğleyin eve dönüyorsun."],"dogru":0,"arapca":"أَشْرَبُ العَصير في العَشاء."},
    {"id":20003,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «____ إِلى البَيْت ظُهْرًا.»","secenekler":["أَرْجِعُ","اللَّحْم","أَنامُ","مَع عائِلَتي."],"dogru":0,"arSecenek":true},
    {"id":20004,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«O dişlerini temizliyor.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"آكُلُ العَسَل وَالزُّبْدَة في الفَطور."},
    {"id":20005,"tip":"cumle","zorluk":2,"soru":"«O dişlerini temizliyor.» cümlesinin Arapçası hangisi?","secenekler":["هِي تُـنَظِّفُ أَسْنانَها.","أَشْرَبُ الحَليب في الفَطور.","هُو يُـنَظِّفُ أَسْنانَهُ.","أُساعِدُ أُمّي في البَيْت."],"dogru":0,"arSecenek":true},
    {"id":20006,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Akşam derslerimi çalışırım.»","parcalar":["أَدْرُسُ","دُروسي","مَساءً."]},
    {"id":20007,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["O erken uyanıyor.","Sen akşam dersleri çalışıyorsun.","Saat sekizde okula giderim.","Sabah erken uyanırım."],"dogru":0,"arapca":"هِي تَـسْتَيْقِظُ مُبَكِّرًا."},
    {"id":20008,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «أَتَناوَلُ اللَّحْم ____ في الغَداء.»","secenekler":["وَالأُرْز","أَتَناوَلُ","أَنْتِ","أُصَلّي"],"dogru":0,"arSecenek":true},
    {"id":20009,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Saat sekizde okula giderim.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"أَنْتِ تَـرْجِعينَ إِلى البَيْت ظُهْرًا."},
    {"id":20010,"tip":"cumle","zorluk":2,"soru":"«Sabah erken uyanırım.» cümlesinin Arapçası hangisi?","secenekler":["أَسْتَيْقِظُ في الصَّباح مُبَكِّرًا.","أَتَوَضَّأُ، ثُمَّ أُصَلّي الفَجْر.","أَنْتَ تَـرْجِعُ إِلى البَيْت ظُهْرًا.","السّاعَة الثّامِنَة"],"dogru":0,"arSecenek":true},
    {"id":20011,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «O sabah namazı kılıyor.»","parcalar":["هُو","يُـصَلّي","الفَجْر."]},
    {"id":20012,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Saat sekiz.","O sabah namazı kılıyor.","O sabah namazı kılıyor.","Öğle yemeğinde et ve pirinç yiyorum."],"dogru":0,"arapca":"السّاعَة الثّامِنَة"},
    {"id":20013,"tip":"cumle","zorluk":2,"soru":"«Elbiselerimi giyerim.» cümlesinin Arapçası hangisi?","secenekler":["أَلْبَسُ مَلابِسي.","أَنْتِ تَـرْجِعينَ إِلى البَيْت ظُهْرًا.","أَنامُ في السّاعَة الحادِيَة عَشْرَة لَيْلًا.","أَنْتَ تَـرْجِعُ إِلى البَيْت ظُهْرًا."],"dogru":0,"arSecenek":true},
    {"id":20014,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Saat iki.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"السّاعَة الثّانِيَة"},
    {"id":20015,"tip":"cumle","zorluk":2,"soru":"«Sen gece uyuyorsun.» cümlesinin Arapçası hangisi?","secenekler":["أَنْتَ تَـنامُ لَيْلًا.","أَتَناوَلُ اللَّحْم وَالأُرْز في الغَداء.","أَنْتَ تُـساعِدُ أُمَّكَ.","آكُلُ العَسَل وَالزُّبْدَة في الفَطور."],"dogru":0,"arSecenek":true},
    {"id":20016,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Öğle yemeğinden sonra kahve içiyorum.»","parcalar":["أَشْرَبُ","القَهْوَة","بَعْد","الغَداء."]},
    {"id":20017,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Saat altı.","Akşam yemeğinde tavuk ve pirinç yerim.","Elbiselerimi giyerim.","Sen öğleyin eve dönüyorsun."],"dogru":0,"arapca":"السّاعَة السّادِسَة"},
    {"id":20018,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «____ الفَطور مَع عائِلَتي.»","secenekler":["أَتَناوَلُ","أَلْبَسُ","أَرْجِعُ","في الصَّباح"],"dogru":0,"arSecenek":true},
    {"id":20019,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Sen akşam dersleri çalışıyorsun.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"أَذْهَبُ إِلى مدْرَسَة في السّاعَة الثّامِنَة."},
    {"id":20020,"tip":"cumle","zorluk":2,"soru":"«Sen akşam dersleri çalışıyorsun.» cümlesinin Arapçası hangisi?","secenekler":["أَنْتَ تَـدْرُسُ الدُّروس مَساءً.","أَشْرَبُ الحَليب في الفَطور.","هُو يُـنَظِّفُ أَسْنانَهُ.","أَنْتِ تُـساعِدينَ أُمَّكِ."],"dogru":0,"arSecenek":true},
    {"id":20021,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Sen akşam dersleri çalışıyorsun.»","parcalar":["أَنْتِ","تَـدْرُسينَ","الدُّروس","مَساءً."]},
    {"id":20022,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Sen annene yardım ediyorsun.","O sabah namazı kılıyor.","Saat bir.","Akşam yemeğinde tavuk ve pirinç yerim."],"dogru":0,"arapca":"أَنْتِ تُـساعِدينَ أُمَّكِ."},
    {"id":20023,"tip":"cumle","zorluk":2,"soru":"«Saat üç.» cümlesinin Arapçası hangisi?","secenekler":["السّاعَة الثّالِثَة","آكُلُ العَسَل وَالزُّبْدَة في الفَطور.","أَنامُ لَيْلًا.","هُو يُـصَلّي الفَجْر."],"dogru":0,"arSecenek":true},
    {"id":20024,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Akşam yemeğinde balık ve salata yiyorum.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"أَتَناوَلُ السَّمَك وَالسَّلَطَة في العَشاء."},
    {"id":20025,"tip":"cumle","zorluk":2,"soru":"«Sen gece uyuyorsun.» cümlesinin Arapçası hangisi?","secenekler":["أَنْتِ تَـنامينَ لَيْلًا.","السّاعَة الواحِدَة","أَتَوَضَّأُ، ثُمَّ أُصَلّي الفَجْر.","أَنْتِ تُـساعِدينَ أُمَّكِ."],"dogru":0,"arSecenek":true},
    {"id":20026,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Sabah saat yedide kahvaltı yaparım.»","parcalar":["أَتَناوَلُ","الفَطور","في السّاعَة","السّابِعَة","صَباحًا."]},
    {"id":20027,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["O sabah namazı kılıyor.","Kahvaltıda süt içiyorum.","O dişlerini temizliyor.","Gece saat on birde uyurum."],"dogru":0,"arapca":"هِي تُـصَلّي الفَجْر."},
    {"id":20028,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «هُو يَـتَناوَلُ ____»","secenekler":["الفَطور.","مَلابِسي.","يَـسْتَيْقِظُ","أَنْتَ"],"dogru":0,"arSecenek":true},
    {"id":20029,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Sen öğleyin eve dönüyorsun.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"أَنْتَ تَـرْجِعُ إِلى البَيْت ظُهْرًا."},
    {"id":20030,"tip":"cumle","zorluk":2,"soru":"«O kahvaltı yapıyor.» cümlesinin Arapçası hangisi?","secenekler":["هِي تَـتَناوَلُ الفَطور.","أَدْرُسُ دُروسي مَساءً.","أَنامُ لَيْلًا.","أَنْتَ تَـدْرُسُ الدُّروس مَساءً."],"dogru":0,"arSecenek":true},
    {"id":20031,"tip":"cumle","zorluk":2,"soru":"«Saat bir.» cümlesinin Arapçası hangisi?","secenekler":["السّاعَة الواحِدَة","أَنامُ لَيْلًا.","أَرْجِعُ إِلى البَيْت ظُهْرًا.","أَشْرَبُ العَصير في العَشاء."],"dogru":0,"arSecenek":true},
    {"id":20032,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Yatsı namazını kılarım.","Elbiselerimi giyerim.","Sen gece uyuyorsun.","Okula giderim."],"dogru":0,"arapca":"أُصَلّي العِشاء."},
    {"id":20033,"tip":"cumle","zorluk":2,"soru":"«Saat beş.» cümlesinin Arapçası hangisi?","secenekler":["السّاعَة الخامِسَة","أَذْهَبُ إِلى المَدْرَسَة.","أَشْرَبُ الحَليب في الفَطور.","هُو يُـصَلّي الفَجْر."],"dogru":0,"arSecenek":true},
    {"id":20034,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Okula giderim.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"أَذْهَبُ إِلى المَدْرَسَة."},
    {"id":20035,"tip":"cumle","zorluk":2,"soru":"«Akşam yemeğinde tavuk ve pirinç yerim.» cümlesinin Arapçası hangisi?","secenekler":["آكُلُ الدَّجاج وَالأُرْز في العَشاء.","أَنامُ لَيْلًا.","أَذْهَبُ إِلى المَدْرَسَة.","أَنْتِ تَـرْجِعينَ إِلى البَيْت ظُهْرًا."],"dogru":0,"arSecenek":true},
    {"id":20036,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Kahvaltıda zeytin ve peynir yiyorum.»","parcalar":["أَتَناوَلُ","الزَّيْتون","وَالجُبْن","في الفَطور."]},
    {"id":20037,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Abdest alırım, sonra sabah namazını kılarım.","Sen akşam dersleri çalışıyorsun.","Sen öğleyin eve dönüyorsun.","O sabah namazı kılıyor."],"dogru":0,"arapca":"أَتَوَضَّأُ، ثُمَّ أُصَلّي الفَجْر."},
    {"id":20038,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «هُو ____ مُبَكِّرًا.»","secenekler":["يَـسْتَيْقِظُ","في الصَّباح","العَسَل","مَلابِسي."],"dogru":0,"arSecenek":true},
    {"id":20039,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Gece saat on birde uyurum.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"أَنامُ في السّاعَة الحادِيَة عَشْرَة لَيْلًا."},
    {"id":20040,"tip":"cumle","zorluk":2,"soru":"«Sen annene yardım ediyorsun.» cümlesinin Arapçası hangisi?","secenekler":["أَنْتَ تُـساعِدُ أُمَّكَ.","أَلْبَسُ مَلابِسي.","أَنْتَ تَـنامُ لَيْلًا.","هِي تَـسْتَيْقِظُ مُبَكِّرًا."],"dogru":0,"arSecenek":true},
    {"id":20041,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Evde anneme yardım ederim.»","parcalar":["أُساعِدُ","أُمّي","في البَيْت."]},
    {"id":20042,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Saat dört.","Sen akşam dersleri çalışıyorsun.","Sen öğleyin eve dönüyorsun.","Kahvaltıda zeytin ve peynir yiyorum."],"dogru":0,"arapca":"السّاعَة الرّابِعَة"},
    {"id":20043,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «هُو ____ أَسْنانَهُ.»","secenekler":["يُـنَظِّفُ","الثّامِنَة","السّاعَة","يَـسْتَيْقِظُ"],"dogru":0,"arSecenek":true},
    {"id":20044,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Gece uyurum.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"أَنامُ لَيْلًا."},
    {"id":20045,"tip":"cumle","zorluk":2,"soru":"«Saat yedi.» cümlesinin Arapçası hangisi?","secenekler":["السّاعَة السّابِعَة","أَشْرَبُ الحَليب في الفَطور.","السّاعَة الثّامِنَة","أَلْبَسُ مَلابِسي."],"dogru":0,"arSecenek":true}
  ] },
  { id: "sinif9", ad: "9. Sınıf", pdf: "", sorular: [
    /* -- kelimeler -- */
    {"id": 1, "tip": "anlam", "zorluk": 1, "soru": "«أُسْرَة / عَائِلَة» ne demek?", "secenekler": ["Aile", "Çok / Oldukça", "Muayene ediyor", "Banyo", "Müdür / Müdire"], "dogru": 0, "arapca": "أُسْرَة / عَائِلَة"},
    {"id": 2, "tip": "anlam", "zorluk": 1, "soru": "«وَالِد / أَب» ne demek?", "secenekler": ["Baba", "Ne?", "Eski", "Müdür / Müdire", "Mutfak"], "dogru": 0, "arapca": "وَالِد / أَب"},
    {"id": 3, "tip": "anlam", "zorluk": 1, "soru": "«وَالِدَة / أُم» ne demek?", "secenekler": ["Anne", "Ev", "Nerede?", "Erkek kardeş", "İşçi"], "dogru": 0, "arapca": "وَالِدَة / أُم"},
    {"id": 4, "tip": "anlam", "zorluk": 1, "soru": "«جَد» ne demek?", "secenekler": ["Dede", "Banyo", "Oda", "Anne", "Yemek pişiriyor"], "dogru": 0, "arapca": "جَد"},
    {"id": 5, "tip": "anlam", "zorluk": 1, "soru": "«جَدَّة» ne demek?", "secenekler": ["Babaanne / Anneanne", "Rahat", "Restoran", "Nerede?", "Kız çocuk"], "dogru": 0, "arapca": "جَدَّة"},
    {"id": 6, "tip": "anlam", "zorluk": 1, "soru": "«أَخ» ne demek?", "secenekler": ["Erkek kardeş", "Kız çocuk", "Oda", "Öğretmen", "Doktor"], "dogru": 0, "arapca": "أَخ"},
    {"id": 7, "tip": "anlam", "zorluk": 1, "soru": "«أُخْت» ne demek?", "secenekler": ["Kız kardeş", "Mühendis", "Öğrenci", "Doktor", "Yatak"], "dogru": 0, "arapca": "أُخْت"},
    {"id": 8, "tip": "anlam", "zorluk": 1, "soru": "«ابْن» ne demek?", "secenekler": ["Oğul", "Eski", "Kız çocuk", "Saygı duyuyorum", "Kapı"], "dogru": 0, "arapca": "ابْن"},
    {"id": 9, "tip": "anlam", "zorluk": 1, "soru": "«ابْنَة» ne demek?", "secenekler": ["Kız çocuk", "Ev hanımı", "Mutfak", "Muayene ediyor", "Oğul"], "dogru": 0, "arapca": "ابْنَة"},
    {"id": 10, "tip": "anlam", "zorluk": 1, "soru": "«مُدَرِّس / مُدَرِّسَة» ne demek?", "secenekler": ["Öğretmen", "Ev", "Oğul", "Baba", "Aşçı"], "dogru": 0, "arapca": "مُدَرِّس / مُدَرِّسَة"},
    {"id": 11, "tip": "anlam", "zorluk": 1, "soru": "«طَبِيب / طَبِيبَة» ne demek?", "secenekler": ["Doktor", "Kız çocuk", "Masa", "Anne", "Çok / Oldukça"], "dogru": 0, "arapca": "طَبِيب / طَبِيبَة"},
    {"id": 12, "tip": "anlam", "zorluk": 1, "soru": "«مُهَنْدِس / مُهَنْدِسَة» ne demek?", "secenekler": ["Mühendis", "Aşçı", "Saygı duyuyorum", "Ev hanımı", "Rahat"], "dogru": 0, "arapca": "مُهَنْدِس / مُهَنْدِسَة"},
    {"id": 13, "tip": "anlam", "zorluk": 1, "soru": "«عَامِل / عَامِلَة» ne demek?", "secenekler": ["İşçi", "Masa", "Öğretmen", "Yatak", "Anne"], "dogru": 0, "arapca": "عَامِل / عَامِلَة"},
    {"id": 14, "tip": "anlam", "zorluk": 1, "soru": "«طَبَّاخ / طَبَّاحَة» ne demek?", "secenekler": ["Aşçı", "Sandalye", "Çok / Oldukça", "Okul", "İşçi"], "dogru": 0, "arapca": "طَبَّاخ / طَبَّاحَة"},
    {"id": 15, "tip": "anlam", "zorluk": 1, "soru": "«طَالِب / طَالِبَة» ne demek?", "secenekler": ["Öğrenci", "Pencere", "Yeni", "Doktor", "Balkon"], "dogru": 0, "arapca": "طَالِب / طَالِبَة"},
    {"id": 16, "tip": "anlam", "zorluk": 1, "soru": "«مُدِير / مُدِيرَة» ne demek?", "secenekler": ["Müdür / Müdire", "Ev hanımı", "Seviyorum", "Yatak", "Kız çocuk"], "dogru": 0, "arapca": "مُدِير / مُدِيرَة"},
    {"id": 17, "tip": "anlam", "zorluk": 1, "soru": "«رَبَّةُ بَيْت» ne demek?", "secenekler": ["Ev hanımı", "Hastane", "Buzdolabı", "Yeni", "Nerede?"], "dogru": 0, "arapca": "رَبَّةُ بَيْت"},
    {"id": 18, "tip": "anlam", "zorluk": 1, "soru": "«بَيْت» ne demek?", "secenekler": ["Ev", "Ders anlatıyor / Öğretiyor", "Temiz", "Saygı duyuyorum", "Balkon"], "dogru": 0, "arapca": "بَيْت"},
    {"id": 19, "tip": "anlam", "zorluk": 1, "soru": "«مَدْرَسَة» ne demek?", "secenekler": ["Okul", "Banyo", "Yatak", "Birinci", "Kapı"], "dogru": 0, "arapca": "مَدْرَسَة"},
    {"id": 20, "tip": "anlam", "zorluk": 1, "soru": "«مُسْتَشْفَى» ne demek?", "secenekler": ["Hastane", "Müdür / Müdire", "Bulunuyor / Var", "İkinci", "Banyo"], "dogru": 0, "arapca": "مُسْتَشْفَى"},
    {"id": 21, "tip": "anlam", "zorluk": 1, "soru": "«مَصْنَع» ne demek?", "secenekler": ["Fabrika", "Aile", "Masa", "Banyo", "Ev hanımı"], "dogru": 0, "arapca": "مَصْنَع"},
    {"id": 22, "tip": "anlam", "zorluk": 1, "soru": "«مَطْعَم» ne demek?", "secenekler": ["Restoran", "Yeni", "Hastane", "Müdür / Müdire", "Sandalye"], "dogru": 0, "arapca": "مَطْعَم"},
    {"id": 23, "tip": "anlam", "zorluk": 1, "soru": "«شَرِكَة» ne demek?", "secenekler": ["Şirket", "Aile", "Yeni", "Erkek kardeş", "Çok / Oldukça"], "dogru": 0, "arapca": "شَرِكَة"},
    {"id": 24, "tip": "anlam", "zorluk": 1, "soru": "«غُرْفَة» ne demek?", "secenekler": ["Oda", "Seviyorum", "Yatak odası", "Aşçı", "Hastane"], "dogru": 0, "arapca": "غُرْفَة"},
    {"id": 25, "tip": "anlam", "zorluk": 1, "soru": "«غُرْفَة النَّوْم» ne demek?", "secenekler": ["Yatak odası", "Çamaşır makinesi", "Dede", "Sandalye", "Yemek pişiriyor"], "dogru": 0, "arapca": "غُرْفَة النَّوْم"},
    {"id": 26, "tip": "anlam", "zorluk": 1, "soru": "«غُرْفَة الجُلُوس» ne demek?", "secenekler": ["Oturma odası", "Okul", "Temiz", "Mühendis", "Babaanne / Anneanne"], "dogru": 0, "arapca": "غُرْفَة الجُلُوس"},
    {"id": 27, "tip": "anlam", "zorluk": 1, "soru": "«مَطْبَخ» ne demek?", "secenekler": ["Mutfak", "Dede", "Ders anlatıyor / Öğretiyor", "Ne?", "Muayene ediyor"], "dogru": 0, "arapca": "مَطْبَخ"},
    {"id": 28, "tip": "anlam", "zorluk": 1, "soru": "«حَمَّام» ne demek?", "secenekler": ["Banyo", "Rahat", "Oğul", "İşçi", "Yatak"], "dogru": 0, "arapca": "حَمَّام"},
    {"id": 29, "tip": "anlam", "zorluk": 1, "soru": "«شُرْفَة» ne demek?", "secenekler": ["Balkon", "Bulunuyor / Var", "Oda", "Yeni", "Rahat"], "dogru": 0, "arapca": "شُرْفَة"},
    {"id": 30, "tip": "anlam", "zorluk": 1, "soru": "«نَافِذَة» ne demek?", "secenekler": ["Pencere", "Balkon", "Hastane", "Çamaşır makinesi", "Oda"], "dogru": 0, "arapca": "نَافِذَة"},
    {"id": 31, "tip": "anlam", "zorluk": 1, "soru": "«بَاب» ne demek?", "secenekler": ["Kapı", "Yeni", "Rahat", "Yemek pişiriyor", "İşçi"], "dogru": 0, "arapca": "بَاب"},
    {"id": 32, "tip": "anlam", "zorluk": 1, "soru": "«ثَلَّاجَة» ne demek?", "secenekler": ["Buzdolabı", "Anne", "Yemek pişiriyor", "Sandalye", "İkinci"], "dogru": 0, "arapca": "ثَلَّاجَة"},
    {"id": 33, "tip": "anlam", "zorluk": 1, "soru": "«غَسَّالَة» ne demek?", "secenekler": ["Çamaşır makinesi", "Ne?", "Yemek pişiriyor", "Banyo", "Kız çocuk"], "dogru": 0, "arapca": "غَسَّالَة"},
    {"id": 34, "tip": "anlam", "zorluk": 1, "soru": "«سَرِير» ne demek?", "secenekler": ["Yatak", "Masa", "Buzdolabı", "Ev hanımı", "Pencere"], "dogru": 0, "arapca": "سَرِير"},
    {"id": 35, "tip": "anlam", "zorluk": 1, "soru": "«كُرْسِي» ne demek?", "secenekler": ["Sandalye", "Öğretmen", "Ders anlatıyor / Öğretiyor", "Banyo", "Restoran"], "dogru": 0, "arapca": "كُرْسِي"},
    {"id": 36, "tip": "anlam", "zorluk": 1, "soru": "«طَاوِلَة» ne demek?", "secenekler": ["Masa", "Mutfak", "İşçi", "Oda", "Öğretmen"], "dogru": 0, "arapca": "طَاوِلَة"},
    {"id": 37, "tip": "anlam", "zorluk": 1, "soru": "«يُدَرِّسُ» ne demek?", "secenekler": ["Ders anlatıyor / Öğretiyor", "Seviyorum", "Kız çocuk", "Müdür / Müdire", "Çamaşır makinesi"], "dogru": 0, "arapca": "يُدَرِّسُ"},
    {"id": 38, "tip": "anlam", "zorluk": 1, "soru": "«يَفْحَصُ» ne demek?", "secenekler": ["Muayene ediyor", "İşçi", "Balkon", "Birinci", "Oğul"], "dogru": 0, "arapca": "يَفْحَصُ"},
    {"id": 39, "tip": "anlam", "zorluk": 1, "soru": "«تَطْبُخُ» ne demek?", "secenekler": ["Yemek pişiriyor", "Babaanne / Anneanne", "Doktor", "Temiz", "Restoran"], "dogru": 0, "arapca": "تَطْبُخُ"},
    {"id": 40, "tip": "anlam", "zorluk": 1, "soru": "«أُحِبُّ» ne demek?", "secenekler": ["Seviyorum", "Doktor", "Çok / Oldukça", "Birinci", "Bulunuyor / Var"], "dogru": 0, "arapca": "أُحِبُّ"},
    {"id": 41, "tip": "anlam", "zorluk": 1, "soru": "«أَحْتَرِمُ» ne demek?", "secenekler": ["Saygı duyuyorum", "Oğul", "Sandalye", "Ne?", "Banyo"], "dogru": 0, "arapca": "أَحْتَرِمُ"},
    {"id": 42, "tip": "anlam", "zorluk": 1, "soru": "«يُوجَدُ» ne demek?", "secenekler": ["Bulunuyor / Var", "Fabrika", "İkinci", "Masa", "Temiz"], "dogru": 0, "arapca": "يُوجَدُ"},
    {"id": 43, "tip": "anlam", "zorluk": 1, "soru": "«مُرِيح» ne demek?", "secenekler": ["Rahat", "İşçi", "Doktor", "Anne", "Okul"], "dogru": 0, "arapca": "مُرِيح"},
    {"id": 44, "tip": "anlam", "zorluk": 1, "soru": "«نَظِيف» ne demek?", "secenekler": ["Temiz", "Saygı duyuyorum", "Aile", "Banyo", "Nerede?"], "dogru": 0, "arapca": "نَظِيف"},
    {"id": 45, "tip": "anlam", "zorluk": 1, "soru": "«جَدِيد» ne demek?", "secenekler": ["Yeni", "Oğul", "Temiz", "Nerede?", "Ev"], "dogru": 0, "arapca": "جَدِيد"},
    {"id": 46, "tip": "anlam", "zorluk": 1, "soru": "«قَدِيم» ne demek?", "secenekler": ["Eski", "Balkon", "Öğretmen", "Ev hanımı", "Okul"], "dogru": 0, "arapca": "قَدِيم"},
    {"id": 47, "tip": "anlam", "zorluk": 1, "soru": "«كَثِيرًا» ne demek?", "secenekler": ["Çok / Oldukça", "Ev hanımı", "Müdür / Müdire", "Banyo", "Oğul"], "dogru": 0, "arapca": "كَثِيرًا"},
    {"id": 48, "tip": "anlam", "zorluk": 1, "soru": "«الأَوَّل» ne demek?", "secenekler": ["Birinci", "Balkon", "Oğul", "Eski", "Babaanne / Anneanne"], "dogru": 0, "arapca": "الأَوَّل"},
    {"id": 49, "tip": "anlam", "zorluk": 1, "soru": "«الثَّانِي» ne demek?", "secenekler": ["İkinci", "Seviyorum", "Yatak", "Doktor", "Babaanne / Anneanne"], "dogru": 0, "arapca": "الثَّانِي"},
    {"id": 50, "tip": "anlam", "zorluk": 1, "soru": "«مَا / مَاذَا» ne demek?", "secenekler": ["Ne?", "Banyo", "Erkek kardeş", "Öğretmen", "Seviyorum"], "dogru": 0, "arapca": "مَا / مَاذَا"},
    {"id": 51, "tip": "anlam", "zorluk": 1, "soru": "«أَيْن» ne demek?", "secenekler": ["Nerede?", "Oğul", "Baba", "Ne?", "Restoran"], "dogru": 0, "arapca": "أَيْن"},
    {"id":9010,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["مَا / مَاذَا","Ne?"],["غُرْفَة النَّوْم","Yatak odası"],["طَاوِلَة","Masa"],["شُرْفَة","Balkon"]]},
    {"id":9011,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["أَحْتَرِمُ","Saygı duyuyorum"],["يَفْحَصُ","Muayene ediyor"],["أُسْرَة / عَائِلَة","Aile"],["شَرِكَة","Şirket"]]},
    {"id":9012,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["أُحِبُّ","Seviyorum"],["مُسْتَشْفَى","Hastane"],["جَد","Dede"],["وَالِد / أَب","Baba"]]},
    {"id":9013,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «Masa»","parcalar":["ط","ا","و","ل","ة"]},
    {"id":9014,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «Balkon»","parcalar":["ش","ر","ف","ة"]},
    {"id":9015,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «Saygı duyuyorum»","parcalar":["أ","ح","ت","ر","م"]},
    {"id":9016,"tip":"anlam","bicim":"yazma","zorluk":3,"soru":"«Muayene ediyor» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"يفحص","tuslar":["ت","ب","ث","د","ي","ج","خ","ح","ص","ف"]},
    {"id":9017,"tip":"anlam","bicim":"yazma","zorluk":3,"soru":"«Şirket» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"شركة","tuslar":["ر","ث","ش","ب","ت","ك","ح","خ","ة","ج"]},
    {"id":9018,"tip":"anlam","bicim":"yazma","zorluk":3,"soru":"«Seviyorum» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"أحب","tuslar":["ج","أ","د","ت","ح","خ","ث","ذ","ب","ر"]}
  ] },
  { id: "sinif10", ad: "10. Sınıf", pdf: "", sorular: [
    /* -- cümleler -- */
    {"id":21001,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Daima dürüst olman gerekir.»","parcalar":["يَجِبُ عَلَيْكَ","أَنْ تَكونَ","صادِقًا","دائِمًا‫.‬"]},
    {"id":21002,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Ben şoförüm, ticari/ücretli taksi sürüyorum.","Aceleci olmaman gerekir.","Ve birbirlerine şöyle derler: Bayramınız kutlu olsun.","Bende şiddetli baş ağrısı var."],"dogru":0,"arapca":"أَنا سائِق، أَسوقُ سَيّارَة أُجْرَة."},
    {"id":21003,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «أَنا مَريضَة، عِنْدي ____ في أُذُني.»","secenekler":["أَلَم","أَلّا تَكونَ","مُوَظَّفَة،","هُم"],"dogru":0,"arSecenek":true},
    {"id":21004,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Müslümanlar komşularına daima yardım ederler.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"والِدَتي رَبَّة البَيْت، وَهِيَ تَهْتَمُّ بِعائِلَتِنا."},
    {"id":21005,"tip":"cumle","zorluk":2,"soru":"«Bayramlarda Müslümanlar yemekten önce bayram namazı kılarlar.» cümlesinin Arapçası hangisi?","secenekler":["في الأَعْياد المُسْلِمون يُصَلّونَ قَبْل الطَّعام صَلاة العيد‫.‬","في الإِسْلام عيدان، هُما عيد الفِطْر وَعيد الأَضْحى‫.‬","بَعْد الطَّعام يَزُورونَ أَقارِبَهُم وَجيرانَهُم‫.‬","يَجِبُ عَلَيْكَ أَنْ تَكونَ صادِقًا دائِمًا‫.‬"],"dogru":0,"arSecenek":true},
    {"id":21006,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Sabırlı olman gerekir.»","parcalar":["يَجِبُ عَلَيْكِ","أَنْ تَكوني","صَبورَة‫.‬"]},
    {"id":21007,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Sen emeklisin.","Onlar küçükleri severler.","Sabırlı olman gerekir.","Aceleci olmaman gerekir."],"dogru":0,"arapca":"أَنْتَ مُتَقاعِد."},
    {"id":21008,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «يَزْدادُ التَّعاوُن وَالمُساعَدَة بَيْن المُسْلِمين أَكْثَر ____»","secenekler":["في الأَعْياد‫.‬","كاذِبًا","مَريضَة،","الصِّغار‫.‬"],"dogru":0,"arSecenek":true},
    {"id":21009,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Bende şiddetli baş ağrısı var.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"يَحْتَفِلُ المُسْلِمون بِالأَعْياد بِفَرَح كَبير‫.‬"},
    {"id":21010,"tip":"cumle","zorluk":2,"soru":"«Asla yalancı olmaman gerekir.» cümlesinin Arapçası hangisi?","secenekler":["يَجِبُ عَلَيْكَ أَلّا تَكونَ كاذِبًا أَبَدًا‫.‬","عِنْدي حَرارَة مُرْتَفِعَة.","أَنْتِ مَريضَة، عِنْدَكِ أَلَم في رَأْسِكِ.","يَجِبُ عَلى المُسْلِم أَنْ يَكونَ مُبْتَسِمًا‫.‬"],"dogru":0,"arSecenek":true},
    {"id":21011,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Babam ve kardeşim mühendistirler, ve onlar şirkette çalışıyorlar»","parcalar":["أَبي","وَأَخي","مُهَنْدِسان،","وَهُما","يَعْمَلانِ","في الشَّرِكَة."]},
    {"id":21012,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Sonra aileyle birlikte bayram yemeği yerler.","Ben hastayım.","Güler yüzlü ol.","Annem ev hanımıdır ve o ailemizle ilgilenir."],"dogru":0,"arapca":"ثُمَّ يَتَناوَلونَ طَعام العيد مَع العائِلَة‫.‬"},
    {"id":21013,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «ما عِنْدي ____ في بَطْني.»","secenekler":["مَغْص","في رَأْسِكِ.","مُتَقاعِد.","رَبَّة"],"dogru":0,"arSecenek":true},
    {"id":21014,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Teyzem memurdur ve o ofiste çalışıyor.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"خالَتي مُوَظَّفَة، وَهِي تَعْمَلُ في المَكْتَب."},
    {"id":21015,"tip":"cumle","zorluk":2,"soru":"«Ben hastayım.» cümlesinin Arapçası hangisi?","secenekler":["أَنا مَريض.","يَزْدادُ التَّعاوُن وَالمُساعَدَة بَيْن المُسْلِمين أَكْثَر في الأَعْياد‫.‬","هُو مُتَعَجِّب‫.‬","المُسْلِمون يُساعِدونَ المُحْتاجين وَالمُسِنّين دائِمًا."],"dogru":0,"arSecenek":true},
    {"id":21016,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Boğazımda ağrı hissediyorum.»","parcalar":["أَشْعُرُ","بِأَلَم","في حَلْقي."]},
    {"id":21017,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Müslümanlar muhtaçlara ve yaşlılara daima yardım ederler.","Ben hastayım, baş ağrım var.","Asla yalancı olmaman gerekir.","Bende şiddetli baş ağrısı var."],"dogru":0,"arapca":"المُسْلِمون يُساعِدونَ المُحْتاجين وَالمُسِنّين دائِمًا."},
    {"id":21018,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «____ يَزُورونَ أَقارِبَهُم وَجيرانَهُم‫.‬»","secenekler":["بَعْد الطَّعام","في رَأْسِكِ.","صُداع.","جيرانَهُم"],"dogru":0,"arSecenek":true},
    {"id":21019,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Ben şoförüm, ticari/ücretli taksi sürüyorum.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"كُنْ مَبْسوطًا‫.‬"},
    {"id":21020,"tip":"cumle","zorluk":2,"soru":"«Bende şiddetli baş ağrısı var.» cümlesinin Arapçası hangisi?","secenekler":["عِنْدي عِنْدي صُداع شَديد.","أَنا مَريض.","أَشْعُرُ بِأَلَم في أُذُني.","أَنا عامِل، أَعْمَلُ في المَصْنَع."],"dogru":0,"arSecenek":true},
    {"id":21021,"tip":"cumle","zorluk":2,"soru":"«Öksürüğüm var.» cümlesinin Arapçası hangisi?","secenekler":["عِنْدي كُحَّة.","عِنْدي حَرارَة مُرْتَفِعَة.","أَشْعُرُ بِأَلَم في حَلْقي.","في الإِسْلام عيدان، هُما عيد الفِطْر وَعيد الأَضْحى‫.‬"],"dogru":0,"arSecenek":true},
    {"id":21022,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Müslümanın öfkeli olmaması gerekir.","Müslümanın güler yüzlü olması gerekir.","Ben hastayım, baş ağrım var.","Mutlu ol."],"dogru":0,"arapca":"يَجِبُ عَلى  المُسْلِم أَلّا يَكونَ غَضْبان‫.‬"},
    {"id":21023,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «أَنْتِ مَريضَة، عِنْدَكِ أَلَم ____»","secenekler":["في رَأْسِكِ.","مُدَرِّس،","المُحْتاجين","سائِق،"],"dogru":0,"arSecenek":true},
    {"id":21024,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Annem doktordur ve kız kardeşim hemşiredir, onlar hastanede çalışıyorlar.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"أُمّي طَبيبَة وَأُخْتي مُمَرِّضَة، وَهُما تَعْمَلانِ فِي المُسْتَشْفى."},
    {"id":21025,"tip":"cumle","zorluk":2,"soru":"«Ve birbirlerine şöyle derler: Bayramınız kutlu olsun.» cümlesinin Arapçası hangisi?","secenekler":["وَيَقولُ  بَعْضُهُم لِبَعْض: كُلّ عام وَأَنْتُم بِخَيْر‫.‬","يَحْتَفِلُ المُسْلِمون بِالأَعْياد بِفَرَح كَبير‫.‬","هُم يُحِبّونَ الصِّغار‫.‬","لا تَكوني حَزينَة‫.‬"],"dogru":0,"arSecenek":true},
    {"id":21026,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Müslümanın güler yüzlü olması gerekir.»","parcalar":["يَجِبُ عَلى","المُسْلِم","أَنْ يَكونَ","مُبْتَسِمًا‫.‬"]},
    {"id":21027,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["İslam'da iki bayram vardır, onlar: Ramazan Bayramı ve Kurban Bayramıdır.","Boğazımda ağrı hissediyorum.","Dayım öğretmendir ve o okulda ders veriyor.","Müslümanlar bayramları büyük bir sevinçle kutlarlar."],"dogru":0,"arapca":"في الإِسْلام عيدان، هُما عيد الفِطْر وَعيد الأَضْحى‫.‬"},
    {"id":21028,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «هُم ____ الكِبار‫.‬»","secenekler":["يَحْتَرِمونَ","يُدافِعُ","مُوَظَّفَة،","هِي"],"dogru":0,"arSecenek":true},
    {"id":21029,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Bayramlarda Müslümanlar arasında dayanışma ve yardımlaşma daha çok artar.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"أَشْعُرُ بِأَلَم في أُذُني."},
    {"id":21030,"tip":"cumle","zorluk":2,"soru":"«Yüksek ateşim var.» cümlesinin Arapçası hangisi?","secenekler":["عِنْدي حَرارَة مُرْتَفِعَة.","بَعْد الطَّعام يَزُورونَ أَقارِبَهُم وَجيرانَهُم‫.‬","هِي قَلِقَة‫.‬","أَنا مَريضَة، عِنْدي أَلَم في أُذُني."],"dogru":0,"arSecenek":true},
    {"id":21031,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Onlar küçükleri severler.»","parcalar":["هُم","يُحِبّونَ","الصِّغار‫.‬"]},
    {"id":21032,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["O şaşkındır.","Ben işçiyim, fabrikada çalışıyorum.","Karnımda sancı yok.","Annem doktordur ve kız kardeşim hemşiredir, onlar hastanede çalışıyorlar."],"dogru":0,"arapca":"هُو مُتَعَجِّب‫.‬"},
    {"id":21033,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «خالي مُدَرِّس، وَهُو ____ في المَدْرَسَة.»","secenekler":["يُدَرِّسُ","أُمّي","بِأَلَم","في الأَعْياد‫.‬"],"dogru":0,"arSecenek":true},
    {"id":21034,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Onlar küçükleri severler.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"لا تَكُنْ غاضِبًا‫.‬"},
    {"id":21035,"tip":"cumle","zorluk":2,"soru":"«Ben işçiyim, fabrikada çalışıyorum.» cümlesinin Arapçası hangisi?","secenekler":["أَنا عامِل، أَعْمَلُ في المَصْنَع.","والِدي مُحامٍ، وَهُوَ يُدافِعُ عَنِ العَدالَة.","ثُمَّ يَتَناوَلونَ طَعام العيد مَع العائِلَة‫.‬","يَحْتَفِلُ المُسْلِمون بِالأَعْياد بِفَرَح كَبير‫.‬"],"dogru":0,"arSecenek":true},
    {"id":21036,"tip":"cumle","bicim":"cumlesira","zorluk":2,"soru":"Kelimeleri sırala: «Ben hastayım, baş ağrım var.»","parcalar":["أَنا","مَريض،","عِنْدي","صُداع."]},
    {"id":21037,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Müslümanlar komşularına daima yardım ederler.","Müslümanlar bayramları büyük bir sevinçle kutlarlar.","Yemekten sonra akrabalarını ve komşularını ziyaret ederler.","Ben şoförüm, ticari/ücretli taksi sürüyorum."],"dogru":0,"arapca":"المُسْلِمون يُساعِدونَ جيرانَهُم دائِمًا."},
    {"id":21038,"bicim":"bosluk","tip":"cumle","zorluk":3,"soru":"Boşluğa gelecek kelimeyi seç: «____ مَريض، عِنْدَكَ كُحَّة.»","secenekler":["أَنْتَ","كُحَّة.","يَحْتَرِمونَ","ما عِنْدي"],"dogru":0,"arSecenek":true},
    {"id":21039,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Aceleci olmaman gerekir.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"يَجِبُ عَلَيْكِ أَلّا تَكوني عَجولَة‫.‬"},
    {"id":21040,"tip":"cumle","zorluk":2,"soru":"«Onlar misafirlerine ikram ederler.» cümlesinin Arapçası hangisi?","secenekler":["هُم يُكْرِمونَ ضُيوفَهُم‫.‬","لا تَكوني حَزينَة‫.‬","عِنْدي كُحَّة.","يَجِبُ عَلَيْكِ أَنْ تَكوني صَبورَة‫.‬"],"dogru":0,"arSecenek":true},
    {"id":21041,"tip":"cumle","zorluk":2,"soru":"«Güler yüzlü ol.» cümlesinin Arapçası hangisi?","secenekler":["كوني مُبْتَسِمَة‫.‬","يَجِبُ عَلَيْكَ أَلّا تَكونَ كاذِبًا أَبَدًا‫.‬","المُسْلِمون يُساعِدونَ المُحْتاجين وَالمُسِنّين دائِمًا.","أَنْتَ مُتَقاعِد."],"dogru":0,"arSecenek":true},
    {"id":21042,"tip":"cumle","zorluk":2,"soru":"Bu cümlenin anlamı nedir?","secenekler":["Babam avukattır ve o adaleti savunur.","Müslümanlar bayramları büyük bir sevinçle kutlarlar.","Bende şiddetli baş ağrısı var.","Bayramlarda Müslümanlar yemekten önce bayram namazı kılarlar."],"dogru":0,"arapca":"والِدي مُحامٍ، وَهُوَ يُدافِعُ عَنِ العَدالَة."},
    {"id":21043,"tip":"cumle","zorluk":2,"soru":"«O endişelidir.» cümlesinin Arapçası hangisi?","secenekler":["هِي قَلِقَة‫.‬","هُو مُتَعَجِّب‫.‬","أَنا مَريضَة، عِنْدي أَلَم في أُذُني.","خالي مُدَرِّس، وَهُو يُدَرِّسُ في المَدْرَسَة."],"dogru":0,"arSecenek":true},
    {"id":21044,"bicim":"dogruyanlis","tip":"cumle","zorluk":1,"soru":"«Üzgün olma.» çevirisi doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"لا تَكوني حَزينَة‫.‬"},
    {"id":21045,"tip":"cumle","zorluk":2,"soru":"«İlacı kullanman/tüketmen gerekir.» cümlesinin Arapçası hangisi?","secenekler":["يَجِبُ عَلَيْكَ أَنْ تَتَناوَلَ الدَّواء.","هُم يُحِبّونَ الصِّغار‫.‬","يَجِبُ عَلى المُسْلِم أَنْ يَكونَ مُبْتَسِمًا‫.‬","خالي مُدَرِّس، وَهُو يُدَرِّسُ في المَدْرَسَة."],"dogru":0,"arSecenek":true}
  ] },
  /* ---- GENEL KONULAR (her sinifta gorunur) ---- */
  /* ------------------------------------------------------------------
     ALFABE — harflerin okunusu, yazilisi (bastaki/ortadaki/sondaki),
     birlesme kurallari ve bosluk doldurma. Tum siniflarda gorunur.
     tip: "harf" · id araligi 1..999 (konu icinde benzersiz).
     ------------------------------------------------------------------ */
  { id: "alfabe", ad: "Alfabe", pdf: "", sorular: [
    {"id":1,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"ح","secenekler":["Ha","Ya","Kef","Dad"],"dogru":0},
    {"id":2,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"ه","secenekler":["He","Ayn","Ba","Ğayn"],"dogru":0},
    {"id":3,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"و","secenekler":["Vav","Ta","Sa","Fa"],"dogru":0},
    {"id":4,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"ب","secenekler":["Ba","Sin","Ğayn","Zı"],"dogru":0},
    {"id":5,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"س","secenekler":["Sin","Ğayn","Şın","Ta"],"dogru":0},
    {"id":6,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"د","secenekler":["Dal","Ta","Nun","Fa"],"dogru":0},
    {"id":7,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"ك","secenekler":["Kef","Dal","Kaf","Dad"],"dogru":0},
    {"id":8,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"ز","secenekler":["Ze","Cim","Nun","Lam"],"dogru":0},
    {"id":9,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"خ","secenekler":["Hı","Dal","Nun","Tı"],"dogru":0},
    {"id":10,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"ص","secenekler":["Sad","Dad","Zı","Kaf"],"dogru":0},
    {"id":11,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"ل","secenekler":["Lam","Ğayn","Sa","Vav"],"dogru":0},
    {"id":12,"tip":"harf","bicim":"test","zorluk":1,"soru":"Bu harfin adı nedir?","arapca":"غ","secenekler":["Ğayn","Ze","Ra","Ta"],"dogru":0},
    {"id":13,"tip":"harf","bicim":"test","zorluk":1,"soru":"Hangisi «Şın» harfidir?","secenekler":["ش","ظ","ج","ت"],"dogru":0,"arSecenek":true},
    {"id":14,"tip":"harf","bicim":"test","zorluk":1,"soru":"Hangisi «Dad» harfidir?","secenekler":["ض","ت","ي","ط"],"dogru":0,"arSecenek":true},
    {"id":15,"tip":"harf","bicim":"test","zorluk":1,"soru":"Hangisi «Sa» harfidir?","secenekler":["ث","ق","د","غ"],"dogru":0,"arSecenek":true},
    {"id":16,"tip":"harf","bicim":"test","zorluk":1,"soru":"Hangisi «Zel» harfidir?","secenekler":["ذ","و","ي","ه"],"dogru":0,"arSecenek":true},
    {"id":17,"tip":"harf","bicim":"test","zorluk":1,"soru":"Hangisi «Cim» harfidir?","secenekler":["ج","د","م","ذ"],"dogru":0,"arSecenek":true},
    {"id":18,"tip":"harf","bicim":"test","zorluk":1,"soru":"Hangisi «Ra» harfidir?","secenekler":["ر","ن","ف","ح"],"dogru":0,"arSecenek":true},
    {"id":19,"tip":"harf","bicim":"test","zorluk":1,"soru":"Hangisi «Nun» harfidir?","secenekler":["ن","ك","ز","س"],"dogru":0,"arSecenek":true},
    {"id":20,"tip":"harf","bicim":"test","zorluk":1,"soru":"Hangisi «Mim» harfidir?","secenekler":["م","ز","د","ع"],"dogru":0,"arSecenek":true},
    {"id":21,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden yanlış verilen şıkkı bulunuz.","secenekler":["ن — ل","د — ض","ك — ق","ه — ح"],"dogru":0,"arSecenek":true},
    {"id":22,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden yanlış verilen şıkkı bulunuz.","secenekler":["ع — ك","ث — ص","ذ — ز","ح — خ"],"dogru":0,"arSecenek":true},
    {"id":23,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden yanlış verilen şıkkı bulunuz.","secenekler":["ق — ظ","س — ص","ا — ع","ت — ط"],"dogru":0,"arSecenek":true},
    {"id":24,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden yanlış verilen şıkkı bulunuz.","secenekler":["و — ع","ث — س","ه — خ","ذ — ظ"],"dogru":0,"arSecenek":true},
    {"id":25,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden yanlış verilen şıkkı bulunuz.","secenekler":["ح — د","ج — خ","ص — ض","ع — غ"],"dogru":0,"arSecenek":true},
    {"id":26,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden yanlış verilen şıkkı bulunuz.","secenekler":["و — ط","ج — ح","ب — ث","ف — ق"],"dogru":0,"arSecenek":true},
    {"id":27,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden yanlış verilen şıkkı bulunuz.","secenekler":["غ — ض","ط — ظ","ب — ت","ر — ز"],"dogru":0,"arSecenek":true},
    {"id":28,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden yanlış verilen şıkkı bulunuz.","secenekler":["ض — ر","س — ش","د — ذ","ح — خ"],"dogru":0,"arSecenek":true},
    {"id":29,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ك — ق","ب — خ","ر — ض","ت — و"],"dogru":0,"arSecenek":true},
    {"id":30,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ذ — ظ","ص — ي","ب — س","ج — ض"],"dogru":0,"arSecenek":true},
    {"id":31,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ث — ص","ج — ه","س — ا","ت — م"],"dogru":0,"arSecenek":true},
    {"id":32,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["س — ص","ع — ن","ب — ز","ذ — م"],"dogru":0,"arSecenek":true},
    {"id":33,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["د — ض","ي — ح","ط — ر","ف — ص"],"dogru":0,"arSecenek":true},
    {"id":34,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ح — خ","ط — ل","ا — د","ت — ج"],"dogru":0,"arSecenek":true},
    {"id":35,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ذ — ز","س — د","ق — ه","ك — ا"],"dogru":0,"arSecenek":true},
    {"id":36,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda okunuşları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ا — ع","غ — ض","ت — ش","ي — ك"],"dogru":0,"arSecenek":true},
    {"id":37,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ف — ق","ع — ي","غ — م","ا — ث"],"dogru":0,"arSecenek":true},
    {"id":38,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ص — ض","ا — ي","ن — ك","ق — ت"],"dogru":0,"arSecenek":true},
    {"id":39,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ج — ح","ل — ز","و — غ","م — ظ"],"dogru":0,"arSecenek":true},
    {"id":40,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ب — ت","ه — د","ر — ح","ف — ص"],"dogru":0,"arSecenek":true},
    {"id":41,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ت — ث","ح — ك","ن — ض","ي — د"],"dogru":0,"arSecenek":true},
    {"id":42,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ع — غ","ذ — و","ص — م","ب — ح"],"dogru":0,"arSecenek":true},
    {"id":43,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["ر — ز","ك — د","ث — ا","ض — ج"],"dogru":0,"arSecenek":true},
    {"id":44,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıda yazılışları benzer olan harflerden doğru verilen şıkkı bulunuz.","secenekler":["س — ش","غ — ت","م — ر","ص — خ"],"dogru":0,"arSecenek":true},
    {"id":45,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden yanlış yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["ـكـ ـكـ ـك","تـ ـتـ ـت","ضـ ـضـ ـض","طـ ـطـ ـط"],"dogru":0,"arSecenek":true},
    {"id":46,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden yanlış yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["ـبـ ـبـ ـب","نـ ـنـ ـن","سـ ـسـ ـس","ضـ ـضـ ـض"],"dogru":0,"arSecenek":true},
    {"id":47,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden yanlış yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["ص ـصـ ـص","غـ ـغـ ـغ","كـ ـكـ ـك","ظـ ـظـ ـظ"],"dogru":0,"arSecenek":true},
    {"id":48,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden yanlış yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["صـ صـ ـص","مـ ـمـ ـم","قـ ـقـ ـق","ثـ ـثـ ـث"],"dogru":0,"arSecenek":true},
    {"id":49,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden yanlış yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["ـبـ ـبـ ـب","عـ ـعـ ـع","صـ ـصـ ـص","يـ ـيـ ـي"],"dogru":0,"arSecenek":true},
    {"id":50,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden yanlış yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["مـ ـمـ ـمـ","طـ ـطـ ـط","غـ ـغـ ـغ","ظـ ـظـ ـظ"],"dogru":0,"arSecenek":true},
    {"id":51,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden yanlış yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["ظـ ـظـ ـظـ","كـ ـكـ ـك","غـ ـغـ ـغ","ضـ ـضـ ـض"],"dogru":0,"arSecenek":true},
    {"id":52,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden yanlış yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["بـ ـب ـب","طـ ـطـ ـط","مـ ـمـ ـم","هـ ـهـ ـه"],"dogru":0,"arSecenek":true},
    {"id":53,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden doğru yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["هـ ـهـ ـه","عـ ـع ـع","غـ ـغـ غـ","ـخـ ـخـ ـخ"],"dogru":0,"arSecenek":true},
    {"id":54,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden doğru yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["مـ ـمـ ـم","يـ ـي ـي","ظ ـظـ ـظ","بـ ـب ـب"],"dogru":0,"arSecenek":true},
    {"id":55,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden doğru yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["غـ ـغـ ـغ","تـ ـت ـت","ظـ ـظـ ـظـ","ـمـ ـمـ ـم"],"dogru":0,"arSecenek":true},
    {"id":56,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden doğru yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["سـ ـسـ ـس","شـ ـشـ شـ","طـ ـطـ ـطـ","ظ ـظـ ـظ"],"dogru":0,"arSecenek":true},
    {"id":57,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden doğru yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["لـ ـلـ ـل","هـ هـ ـه","شـ ـشـ شـ","عـ ـعـ ـعـ"],"dogru":0,"arSecenek":true},
    {"id":58,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden doğru yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["ثـ ـثـ ـث","طـ طـ ـط","هـ ـهـ ـهـ","عـ عـ ـع"],"dogru":0,"arSecenek":true},
    {"id":59,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden doğru yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["نـ ـنـ ـن","خـ ـخ ـخ","ـحـ ـحـ ـح","هـ هـ ـه"],"dogru":0,"arSecenek":true},
    {"id":60,"tip":"harf","bicim":"test","zorluk":3,"soru":"Aşağıda çizgideki yazılışları verilen harflerden doğru yazılmış olan harfi bulunuz. (Sırasıyla: baştaki — ortadaki — sondaki yazılışı)","secenekler":["طـ ـطـ ـط","قـ ـقـ ـقـ","ـشـ ـشـ ـش","ـيـ ـيـ ـي"],"dogru":0,"arSecenek":true},
    {"id":61,"tip":"harf","bicim":"eslestir","zorluk":2,"soru":"Okunuşları benzer olan harfleri eşleştiriniz.","ciftler":[["ط","ت"],["ظ","ز"],["ح","ه"],["ع","ا"]]},
    {"id":62,"tip":"harf","bicim":"eslestir","zorluk":2,"soru":"Okunuşları benzer olan harfleri eşleştiriniz.","ciftler":[["ح","خ"],["ت","ط"],["ق","ك"],["ع","ا"]]},
    {"id":63,"tip":"harf","bicim":"eslestir","zorluk":2,"soru":"Okunuşları benzer olan harfleri eşleştiriniz.","ciftler":[["ض","د"],["س","ص"],["ذ","ز"],["ع","ا"]]},
    {"id":64,"tip":"harf","bicim":"eslestir","zorluk":2,"soru":"Okunuşları benzer olan harfleri eşleştiriniz.","ciftler":[["ط","ت"],["ك","ق"],["خ","ه"],["ذ","ظ"]]},
    {"id":65,"tip":"harf","bicim":"eslestir","zorluk":2,"soru":"Yazılışları benzer olan harfleri eşleştiriniz.","ciftler":[["ق","ف"],["ذ","د"],["ت","ث"],["ص","ض"]]},
    {"id":66,"tip":"harf","bicim":"eslestir","zorluk":2,"soru":"Yazılışları benzer olan harfleri eşleştiriniz.","ciftler":[["غ","ع"],["ح","خ"],["ذ","د"],["ق","ف"]]},
    {"id":67,"tip":"harf","bicim":"eslestir","zorluk":2,"soru":"Yazılışları benzer olan harfleri eşleştiriniz.","ciftler":[["غ","ع"],["ق","ف"],["ط","ظ"],["د","ذ"]]},
    {"id":68,"tip":"harf","bicim":"eslestir","zorluk":2,"soru":"Yazılışları benzer olan harfleri eşleştiriniz.","ciftler":[["ط","ظ"],["ض","ص"],["ف","ق"],["ش","س"]]},
    {"id":69,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «yazdı»)","arapca":"كـ ـ ـ ـب","secenekler":["ـتـ","ت","تـ","ـت"],"dogru":0,"arSecenek":true},
    {"id":70,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «yetişti»)","arapca":"لـ ـ ـ ـق","secenekler":["ـحـ","ح","حـ","ـح"],"dogru":0,"arSecenek":true},
    {"id":71,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «deve»)","arapca":"جـ ـ ـ ـل","secenekler":["ـمـ","م","مـ","ـم"],"dogru":0,"arSecenek":true},
    {"id":72,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «eyer»)","arapca":"ـ ـ ـر ج","secenekler":["سـ","س","ـسـ","ـس"],"dogru":0,"arSecenek":true},
    {"id":73,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «taşıdı»)","arapca":"حـ ـمـ ـ ـ","secenekler":["ـل","ل","لـ","ـلـ"],"dogru":0,"arSecenek":true},
    {"id":74,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «yabani hayvan»)","arapca":"و ـ ـ ـش","secenekler":["حـ","ح","ـحـ","ـح"],"dogru":0,"arSecenek":true},
    {"id":75,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «beş»)","arapca":"خـ ـمـ ـ ـ","secenekler":["ـس","س","سـ","ـسـ"],"dogru":0,"arSecenek":true},
    {"id":76,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «kopya»)","arapca":"ـ ـ ـسـ ـخ","secenekler":["نـ","ن","ـنـ","ـن"],"dogru":0,"arSecenek":true},
    {"id":77,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «sayfalar»)","arapca":"صـ ـ ـ ـف","secenekler":["ـحـ","ح","حـ","ـح"],"dogru":0,"arSecenek":true},
    {"id":78,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «elde etti»)","arapca":"حـ ـ ـ ـل","secenekler":["ـصـ","ص","صـ","ـص"],"dogru":0,"arSecenek":true},
    {"id":79,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «makas»)","arapca":"مـ ـ ـ ـص","secenekler":["ـقـ","ق","قـ","ـق"],"dogru":0,"arSecenek":true},
    {"id":80,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «kaburga»)","arapca":"ضـ ـ ـ ـع","secenekler":["ـلـ","ل","لـ","ـل"],"dogru":0,"arSecenek":true},
    {"id":81,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «geçti»)","arapca":"مـ ـ ـ ـى","secenekler":["ـضـ","ض","ضـ","ـض"],"dogru":0,"arSecenek":true},
    {"id":82,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «bazı»)","arapca":"بـ ـعـ ـ ـ","secenekler":["ـض","ض","ضـ","ـضـ"],"dogru":0,"arSecenek":true},
    {"id":83,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «çoğaldı»)","arapca":"كـ ـ ـ ـر","secenekler":["ـثـ","ث","ثـ","ـث"],"dogru":0,"arSecenek":true},
    {"id":84,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «tekmeledi»)","arapca":"ر ـ ـ ـل","secenekler":["كـ","ك","ـكـ","ـك"],"dogru":0,"arSecenek":true},
    {"id":85,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «balık»)","arapca":"سـ ـمـ ـ ـ","secenekler":["ـك","ك","كـ","ـكـ"],"dogru":0,"arSecenek":true},
    {"id":86,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «et»)","arapca":"لـ ـحـ ـ ـ","secenekler":["ـم","م","مـ","ـمـ"],"dogru":0,"arSecenek":true},
    {"id":87,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «süt sağdı»)","arapca":"حـ ـ ـ ـب","secenekler":["ـلـ","ل","لـ","ـل"],"dogru":0,"arSecenek":true},
    {"id":88,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «yedi»)","arapca":"أ ـ ـ ـل","secenekler":["كـ","ك","ـكـ","ـك"],"dogru":0,"arSecenek":true},
    {"id":89,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «uyku»)","arapca":"نـ ـو ـ ـ","secenekler":["م","مـ","ـمـ","ـم"],"dogru":0,"arSecenek":true},
    {"id":90,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «işitti»)","arapca":"ـ ـ ـمـ ـع","secenekler":["سـ","س","ـسـ","ـس"],"dogru":0,"arSecenek":true},
    {"id":91,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «açtı»)","arapca":"فـ ـ ـ ـح","secenekler":["ـتـ","ت","تـ","ـت"],"dogru":0,"arSecenek":true},
    {"id":92,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «bildi»)","arapca":"عـ ـ ـ ـم","secenekler":["ـلـ","ل","لـ","ـل"],"dogru":0,"arSecenek":true},
    {"id":93,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «kalem»)","arapca":"قـ ـلـ ـ ـ","secenekler":["ـم","م","مـ","ـمـ"],"dogru":0,"arSecenek":true},
    {"id":94,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «ders»)","arapca":"د ر ـ ـ","secenekler":["س","سـ","ـسـ","ـس"],"dogru":0,"arSecenek":true},
    {"id":95,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «ev»)","arapca":"بـ ـ ـ ـت","secenekler":["ـيـ","ي","يـ","ـي"],"dogru":0,"arSecenek":true},
    {"id":96,"tip":"harf","bicim":"bosluk","zorluk":2,"soru":"Aşağıdaki kelimede boş bırakılan yere hangi harf gelmelidir? (Kelime: «güneş»)","arapca":"شـ ـ ـ ـس","secenekler":["ـمـ","م","مـ","ـم"],"dogru":0,"arSecenek":true},
    {"id":97,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Ra» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"ر","secenekler":["Doğru","Yanlış"],"dogru":1},
    {"id":98,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Ze» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"ز","secenekler":["Doğru","Yanlış"],"dogru":1},
    {"id":99,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Dal» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"د","secenekler":["Doğru","Yanlış"],"dogru":1},
    {"id":100,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Zel» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"ذ","secenekler":["Doğru","Yanlış"],"dogru":1},
    {"id":101,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Vav» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"و","secenekler":["Doğru","Yanlış"],"dogru":1},
    {"id":102,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Elif» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"ا","secenekler":["Doğru","Yanlış"],"dogru":1},
    {"id":103,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Ba» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"ب","secenekler":["Doğru","Yanlış"],"dogru":0},
    {"id":104,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Sin» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"س","secenekler":["Doğru","Yanlış"],"dogru":0},
    {"id":105,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Kef» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"ك","secenekler":["Doğru","Yanlış"],"dogru":0},
    {"id":106,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Ayn» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"ع","secenekler":["Doğru","Yanlış"],"dogru":0},
    {"id":107,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Fa» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"ف","secenekler":["Doğru","Yanlış"],"dogru":0},
    {"id":108,"tip":"harf","bicim":"dogruyanlis","zorluk":1,"soru":"«Mim» harfi kendinden sonraki harfe bağlanır. Doğru mu?","arapca":"م","secenekler":["Doğru","Yanlış"],"dogru":0},
    {"id":109,"tip":"harf","bicim":"dogruyanlis","zorluk":2,"soru":"«Nun» harfinin baştaki, ortadaki ve sondaki yazılışı doğru verilmiştir. Doğru mu?","arapca":"نـ ـنـ ـن","secenekler":["Doğru","Yanlış"],"dogru":0},
    {"id":110,"tip":"harf","bicim":"dogruyanlis","zorluk":2,"soru":"«Dad» harfinin baştaki, ortadaki ve sondaki yazılışı doğru verilmiştir. Doğru mu?","arapca":"ض ـضـ ـض","secenekler":["Doğru","Yanlış"],"dogru":1},
    {"id":111,"tip":"harf","bicim":"dogruyanlis","zorluk":2,"soru":"«He» harfinin baştaki, ortadaki ve sondaki yazılışı doğru verilmiştir. Doğru mu?","arapca":"هـ ـهـ ـه","secenekler":["Doğru","Yanlış"],"dogru":0},
    {"id":112,"tip":"harf","bicim":"dogruyanlis","zorluk":2,"soru":"«Sin» harfinin baştaki, ortadaki ve sondaki yazılışı doğru verilmiştir. Doğru mu?","arapca":"ـسـ ـسـ ـس","secenekler":["Doğru","Yanlış"],"dogru":1},
    {"id":113,"tip":"harf","bicim":"dogruyanlis","zorluk":2,"soru":"«Kaf» harfinin baştaki, ortadaki ve sondaki yazılışı doğru verilmiştir. Doğru mu?","arapca":"قـ ـقـ ـق","secenekler":["Doğru","Yanlış"],"dogru":0},
    {"id":114,"tip":"harf","bicim":"dogruyanlis","zorluk":2,"soru":"«Ğayn» harfinin baştaki, ortadaki ve sondaki yazılışı doğru verilmiştir. Doğru mu?","arapca":"غـ ـغ ـغ","secenekler":["Doğru","Yanlış"],"dogru":1},
    {"id":115,"tip":"harf","bicim":"dogruyanlis","zorluk":2,"soru":"«Kef» harfinin baştaki, ortadaki ve sondaki yazılışı doğru verilmiştir. Doğru mu?","arapca":"كـ ـكـ ـك","secenekler":["Doğru","Yanlış"],"dogru":0},
    {"id":116,"tip":"harf","bicim":"dogruyanlis","zorluk":2,"soru":"«Şın» harfinin baştaki, ortadaki ve sondaki yazılışı doğru verilmiştir. Doğru mu?","arapca":"شـ ـشـ شـ","secenekler":["Doğru","Yanlış"],"dogru":1},
    {"id":117,"tip":"harf","bicim":"test","zorluk":1,"soru":"Arap alfabesinde kaç harf vardır?","secenekler":["28","26","29","32"],"dogru":0},
    {"id":118,"tip":"harf","bicim":"test","zorluk":1,"soru":"Arapça hangi yönde yazılır?","secenekler":["Sağdan sola","Soldan sağa","Yukarıdan aşağıya","Aşağıdan yukarıya"],"dogru":0},
    {"id":119,"tip":"harf","bicim":"test","zorluk":2,"soru":"Kendinden sonraki harfe bağlanmayan harfler kaç tanedir? (ا د ذ ر ز و)","secenekler":["6","4","8","10"],"dogru":0},
    {"id":120,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıdakilerden hangisi kendinden sonraki harfe bağlanmaz?","secenekler":["د","ب","س","ن"],"dogru":0,"arSecenek":true},
    {"id":121,"tip":"harf","bicim":"test","zorluk":2,"soru":"Aşağıdakilerden hangisi kendinden sonraki harfe bağlanır?","secenekler":["ل","ر","و","ز"],"dogru":0,"arSecenek":true},
    {"id":122,"tip":"harf","bicim":"test","zorluk":2,"soru":"Bir harfin ortadaki yazılışında iki yandan çizgi almasının sebebi nedir?","secenekler":["Hem önceki hem sonraki harfe bağlanması","Sadece önceki harfe bağlanması","Sadece sonraki harfe bağlanması","Hiçbir harfe bağlanmaması"],"dogru":0},
    {"id":123,"tip":"harf","bicim":"test","zorluk":3,"soru":"Bir harf, kendinden önceki harf sonrakine bağlanmıyorsa nasıl yazılır?","secenekler":["Baştaki (yalın başlangıç) yazılışıyla","Ortadaki yazılışıyla","Sondaki yazılışıyla","Hiç yazılmaz"],"dogru":0},
    {"id":124,"tip":"harf","bicim":"test","zorluk":3,"soru":"«جرس» kelimesinde ر harfinden sonra gelen س harfi neden baştaki yazılışıyla yazılır?","secenekler":["ر harfi kendinden sonrakine bağlanmadığı için","س harfi hiçbir harfe bağlanmadığı için","Kelime üç harfli olduğu için","س harfi son harf olduğu için"],"dogru":0},
    {"id":125,"tip":"harf","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «yazdı»","parcalar":["ك","ت","ب"]},
    {"id":126,"tip":"harf","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «kalem»","parcalar":["ق","ل","م"]},
    {"id":127,"tip":"harf","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «ders»","parcalar":["د","ر","س"]},
    {"id":128,"tip":"harf","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «balık»","parcalar":["س","م","ك"]},
    {"id":129,"tip":"harf","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «güneş»","parcalar":["ش","م","س"]},
    {"id":130,"tip":"harf","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «ev»","parcalar":["ب","ي","ت"]},
    {"id":131,"tip":"harf","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «uyku»","parcalar":["ن","و","م"]},
    {"id":132,"tip":"harf","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «et»","parcalar":["ل","ح","م"]},
    {"id":133,"tip":"harf","bicim":"yazma","zorluk":3,"soru":"«yazdı» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"كتب","tuslar":["ض","ظ","ك","و","ب","ت","خ","ذ","ن","ش"]},
    {"id":134,"tip":"harf","bicim":"yazma","zorluk":3,"soru":"«kalem» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"قلم","tuslar":["ي","ج","ه","س","ط","ث","م","ل","ق","ح"]},
    {"id":135,"tip":"harf","bicim":"yazma","zorluk":3,"soru":"«güneş» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"شمس","tuslar":["ا","ن","ط","ج","ش","م","ح","ق","س","ض"]},
    {"id":136,"tip":"harf","bicim":"yazma","zorluk":3,"soru":"«ev» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"بيت","tuslar":["ب","ي","ث","ض","ن","ك","ت","ح","ط","ج"]},
    {"id":137,"tip":"harf","bicim":"yazma","zorluk":3,"soru":"«ders» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"درس","tuslar":["ف","خ","ش","ر","ب","ق","س","د","ص","ل"]},
    {"id":138,"tip":"harf","bicim":"yazma","zorluk":3,"soru":"«balık» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"سمك","tuslar":["ض","ع","ه","ك","م","ر","ي","ل","ا","س"]}
  ] },
  { id: "edatlar", ad: "Edatlar & Kalıplar", pdf: "", sorular: [
    {"id":22001,"tip":"edat","zorluk":2,"soru":"«أَنْتُنَّ» ne anlama gelir?","secenekler":["Sizler (Dişil)","Neden? / Niçin?","Tuz","Tavuskuşu"],"dogru":0,"arapca":"أَنْتُنَّ"},
    {"id":22002,"tip":"edat","zorluk":2,"soru":"«بَعوضَة» ne anlama gelir?","secenekler":["Sivrisinek","Gün","At Arabası","O kimseler ki (Dişil / Çoğul)"],"dogru":0,"arapca":"بَعوضَة"},
    {"id":22003,"tip":"edat","zorluk":2,"soru":"«قَبْلَ» ne anlama gelir?","secenekler":["Önce","Saatler","Taze","Elma"],"dogru":0,"arapca":"قَبْلَ"},
    {"id":22004,"tip":"edat","zorluk":2,"soru":"«هَؤُلَاءِ» ne anlama gelir?","secenekler":["Bunlar (Ortak)","Su","Köfte","Lütfen (Rica minnet)"],"dogru":0,"arapca":"هَؤُلَاءِ"},
    {"id":22005,"tip":"edat","zorluk":2,"soru":"«ذِئْب» ne anlama gelir?","secenekler":["Kurt","İzninizle / Lütfen (Eğer müsaade edersen)","Şehirler","Domates"],"dogru":0,"arapca":"ذِئْب"},
    {"id":22006,"tip":"edat","zorluk":2,"soru":"«دِبَبَة» ne anlama gelir?","secenekler":["Ayılar","Kediler","Ayak","Sivrisinekler"],"dogru":0,"arapca":"دِبَبَة"},
    {"id":22007,"tip":"edat","zorluk":2,"soru":"«فِي» ne anlama gelir?","secenekler":["-de / -da (İçinde bulunma)","Cumartesi (Dinlenme/Tatil günü).","Bisiklet","Zürafalar"],"dogru":0,"arapca":"فِي"},
    {"id":22008,"tip":"edat","zorluk":2,"soru":"«هَواتِف» ne anlama gelir?","secenekler":["Telefonlar","İzninizle / Lütfen (Eğer müsaade edersen)","Sarımsak","Vapur"],"dogru":0,"arapca":"هَواتِف"},
    {"id":22009,"tip":"edat","zorluk":2,"soru":"«بوم» ne anlama gelir?","secenekler":["Baykuşlar","Kelebekler","Eğer / Şayet / Değil (Olumsuz)","Kalpler"],"dogru":0,"arapca":"بوم"},
    {"id":22010,"tip":"edat","zorluk":2,"soru":"«الْيَوْمَ» ne anlama gelir?","secenekler":["Bugün","Hayvanlar","Çocuklar","Kurbağa"],"dogru":0,"arapca":"الْيَوْمَ"},
    {"id":22011,"tip":"edat","zorluk":2,"soru":"«جُبْن» ne anlama gelir?","secenekler":["Peynir","Keşke / Eğer (Gerçekleşmemiş şart)","Eşekler","Kulaklar"],"dogru":0,"arapca":"جُبْن"},
    {"id":22012,"tip":"edat","zorluk":2,"soru":"«ذُباب» ne anlama gelir?","secenekler":["Sinekler","Yılan","Altında","Et"],"dogru":0,"arapca":"ذُباب"},
    {"id":22013,"tip":"edat","zorluk":2,"soru":"«لا بَأْس» ne anlama gelir?","secenekler":["Sorun değil / Ziyanı yok","Çünkü / -dığı için","Tereyağı","İnek"],"dogru":0,"arapca":"لا بَأْس"},
    {"id":22014,"tip":"edat","zorluk":2,"soru":"«طاووس» ne anlama gelir?","secenekler":["Tavuskuşu","Asla yapmayacak (Gelecek Olumsuz)","Kazlar","Kız"],"dogru":0,"arapca":"طاووس"},
    {"id":22015,"tip":"edat","zorluk":2,"soru":"«نَهَاراً» ne anlama gelir?","secenekler":["Gündüz","Nasılsın?","Kitapçıklar.","Sinekler"],"dogru":0,"arapca":"نَهَاراً"},
    {"id":22016,"tip":"edat","zorluk":2,"soru":"«حَسَاء» ne anlama gelir?","secenekler":["Çorba / Şorba (شُورْبَة)","At","Önce","Kiraz"],"dogru":0,"arapca":"حَسَاء"},
    {"id":22017,"tip":"edat","zorluk":2,"soru":"«اَلَّتِي» ne anlama gelir?","secenekler":["O kimse ki (Dişil / Tekil)","Yunus","Sen (Dişil)","Çay"],"dogru":0,"arapca":"اَلَّتِي"},
    {"id":22018,"tip":"edat","zorluk":2,"soru":"«أَمْسِ» ne anlama gelir?","secenekler":["Dün","Nereden?","Kaplanlar","Yarasalar"],"dogru":0,"arapca":"أَمْسِ"},
    {"id":22019,"tip":"edat","zorluk":2,"soru":"«فَأْرَة» ne anlama gelir?","secenekler":["Fare","Ateş","Bisiklet","Bal"],"dogru":0,"arapca":"فَأْرَة"},
    {"id":22020,"tip":"edat","zorluk":2,"soru":"«كُوسَا» ne anlama gelir?","secenekler":["Kabak","Akşam","Balık","Tarih"],"dogru":0,"arapca":"كُوسَا"},
    {"id":22021,"tip":"edat","bicim":"eslestir","zorluk":2,"soru":"Edatları anlamlarıyla eşleştir.","ciftler":[["بَيْنَ","Arasında"],["مَعْكَرُونَة","Makarna"],["دُلْفين","Yunus"],["طازَج","Taze"]]},
    {"id":22022,"tip":"edat","bicim":"eslestir","zorluk":2,"soru":"Edatları anlamlarıyla eşleştir.","ciftler":[["مُذْ / مُنْذُ","-den beri (Zaman / Başlangıç)"],["زَهْرَة","Çiçek"],["دَرَّاجَة","Bisiklet"],["يَد","El"]]},
    {"id":22023,"tip":"edat","bicim":"eslestir","zorluk":2,"soru":"Edatları anlamlarıyla eşleştir.","ciftler":[["كَيْفَ","Nasıl?"],["نَمْلَة","Karınca"],["أَسْوَد","Siyah"],["هَاتَانِ","Bu İkisi (Dişil)"]]},
    {"id":22024,"tip":"edat","bicim":"eslestir","zorluk":2,"soru":"Edatları anlamlarıyla eşleştir.","ciftler":[["أَيّام","Günler"],["شَيْء","Şey"],["مَاء","Su"],["نَمْل","Karıncalar"]]},
    {"id":22025,"tip":"edat","bicim":"eslestir","zorluk":2,"soru":"Edatları anlamlarıyla eşleştir.","ciftler":[["شَمَّام","Kavun"],["ثُوم","Sarımsak"],["فَجْر","Fecr / Şafak"],["كَمْ","Kaç? / Ne Kadar?"]]}
  ] },
  { id: "kelimeler", ad: "Kelimeler", pdf: "", sorular: [
    {"id":1,"tip":"anlam","zorluk":1,"soru":"«مُنْذُ» ne demek?","secenekler":["-den beri","-den, hakkında (uzaklaşma)","-e kadar","İçinde, -de/-da","-den, -dan (başlangıç/ayrılma)"],"dogru":0,"arapca":"مُنْذُ"},
    {"id":2,"tip":"anlam","zorluk":1,"soru":"«فِي» ne demek?","secenekler":["İçinde, -de/-da","-den, -dan (başlangıç/ayrılma)","-den, hakkında (uzaklaşma)","-e kadar","-den beri"],"dogru":0,"arapca":"فِي"},
    {"id":3,"tip":"anlam","zorluk":1,"soru":"«حَتَّى» ne demek?","secenekler":["-e kadar","-den, -dan (başlangıç/ayrılma)","-den, hakkında (uzaklaşma)","İçinde, -de/-da","-den beri"],"dogru":0,"arapca":"حَتَّى"},
    {"id":4,"tip":"anlam","zorluk":1,"soru":"«عَنْ» ne demek?","secenekler":["-den, hakkında (uzaklaşma)","-den, -dan (başlangıç/ayrılma)","-e kadar","İçinde, -de/-da","-den beri"],"dogru":0,"arapca":"عَنْ"},
    {"id":5,"tip":"anlam","zorluk":2,"soru":"«için, -e ait» kelimesinin Arapçası hangisidir?","secenekler":["لِ","إِلَى","بِ","عَلَى","كَ"],"dogru":0,"arSecenek":true},
    {"id":6,"tip":"anlam","zorluk":2,"soru":"«ile, vasıtasıyla» kelimesinin Arapçası hangisidir?","secenekler":["بِ","عَلَى","كَ","لِ","إِلَى"],"dogru":0,"arSecenek":true},
    {"id":7,"tip":"anlam","zorluk":2,"soru":"«-e, -a (yönelme/bitiş)» kelimesinin Arapçası hangisidir?","secenekler":["إِلَى","كَ","لِ","بِ","عَلَى"],"dogru":0,"arSecenek":true},
    {"id":8,"tip":"anlam","zorluk":3,"soru":"«üzerine, üstünde» kelimesinin Arapçası hangisidir?","secenekler":["عَلَى","إِلَى","بِ","كَ","لِ"],"dogru":0,"arSecenek":true},
    {"id":9,"tip":"anlam","zorluk":3,"soru":"«مِنْ» ne demek?","secenekler":["-den, -dan (başlangıç/ayrılma)","İçinde, -de/-da","-den beri","-den, hakkında (uzaklaşma)","-e kadar"],"dogru":0,"arapca":"مِنْ"},
    {"id":10,"tip":"anlam","zorluk":3,"soru":"«gibi» kelimesinin Arapçası hangisidir?","secenekler":["كَ","عَلَى","لِ","إِلَى","بِ"],"dogru":0,"arSecenek":true},
    {"id":11,"tip":"anlam","zorluk":1,"soru":"«هُنَّ» ne demek?","secenekler":["Onlar (dişil)","Sen (eril)","O (dişil)","Onlar (eril)","Sen (dişil)"],"dogru":0,"arapca":"هُنَّ"},
    {"id":12,"tip":"anlam","zorluk":1,"soru":"«هِيَ» ne demek?","secenekler":["O (dişil)","Onlar (eril)","Sen (dişil)","Sen (eril)","Onlar (dişil)"],"dogru":0,"arapca":"هِيَ"},
    {"id":13,"tip":"anlam","zorluk":1,"soru":"«هُمْ» ne demek?","secenekler":["Onlar (eril)","Onlar (dişil)","Sen (dişil)","Sen (eril)","O (dişil)"],"dogru":0,"arapca":"هُمْ"},
    {"id":14,"tip":"anlam","zorluk":1,"soru":"«أَنْتِ» ne demek?","secenekler":["Sen (dişil)","Onlar (dişil)","Onlar (eril)","Sen (eril)","O (dişil)"],"dogru":0,"arapca":"أَنْتِ"},
    {"id":15,"tip":"anlam","zorluk":2,"soru":"«ben» kelimesinin Arapçası hangisidir?","secenekler":["أَنَا","نَحْنُ","هُوَ","أَنْتُمَا","أَنْتُمْ"],"dogru":0,"arSecenek":true},
    {"id":16,"tip":"anlam","zorluk":2,"soru":"«biz» kelimesinin Arapçası hangisidir?","secenekler":["نَحْنُ","أَنْتُمْ","هُوَ","أَنَا","أَنْتُمَا"],"dogru":0,"arSecenek":true},
    {"id":17,"tip":"anlam","zorluk":2,"soru":"«ikiniz» kelimesinin Arapçası hangisidir?","secenekler":["أَنْتُمَا","أَنْتُمْ","نَحْنُ","هُوَ","أَنَا"],"dogru":0,"arSecenek":true},
    {"id":18,"tip":"anlam","zorluk":3,"soru":"«siz (eril çoğul)» kelimesinin Arapçası hangisidir?","secenekler":["أَنْتُمْ","أَنَا","أَنْتُمَا","نَحْنُ","هُوَ"],"dogru":0,"arSecenek":true},
    {"id":19,"tip":"anlam","zorluk":3,"soru":"«أَنْتَ» ne demek?","secenekler":["Sen (eril)","Sen (dişil)","O (dişil)","Onlar (dişil)","Onlar (eril)"],"dogru":0,"arapca":"أَنْتَ"},
    {"id":20,"tip":"anlam","zorluk":3,"soru":"«o (eril)» kelimesinin Arapçası hangisidir?","secenekler":["هُوَ","نَحْنُ","أَنَا","أَنْتُمَا","أَنْتُمْ"],"dogru":0,"arSecenek":true},
    {"id":21,"tip":"anlam","zorluk":1,"soru":"«هُنَا» ne demek?","secenekler":["Burası","Bu ikisi (eril)","Orası","Şu/o (eril, uzak)","Bu ikisi (dişil)"],"dogru":0,"arapca":"هُنَا"},
    {"id":22,"tip":"anlam","zorluk":1,"soru":"«هَذَانِ» ne demek?","secenekler":["Bu ikisi (eril)","Bu ikisi (dişil)","Burası","Orası","Şu/o (eril, uzak)"],"dogru":0,"arapca":"هَذَانِ"},
    {"id":23,"tip":"anlam","zorluk":1,"soru":"«هُنَاكَ» ne demek?","secenekler":["Orası","Burası","Şu/o (eril, uzak)","Bu ikisi (dişil)","Bu ikisi (eril)"],"dogru":0,"arapca":"هُنَاكَ"},
    {"id":24,"tip":"anlam","zorluk":1,"soru":"«ذَلِكَ» ne demek?","secenekler":["Şu/o (eril, uzak)","Bu ikisi (eril)","Burası","Orası","Bu ikisi (dişil)"],"dogru":0,"arapca":"ذَلِكَ"},
    {"id":25,"tip":"anlam","zorluk":2,"soru":"«bu (dişil, tekil)» kelimesinin Arapçası hangisidir?","secenekler":["هَذِهِ","تِلْكَ","هَؤُلَاءِ","هَذَا","أُولَئِكَ"],"dogru":0,"arSecenek":true},
    {"id":26,"tip":"anlam","zorluk":2,"soru":"«bu (eril, tekil)» kelimesinin Arapçası hangisidir?","secenekler":["هَذَا","أُولَئِكَ","تِلْكَ","هَؤُلَاءِ","هَذِهِ"],"dogru":0,"arSecenek":true},
    {"id":27,"tip":"anlam","zorluk":2,"soru":"«onlar (uzak)» kelimesinin Arapçası hangisidir?","secenekler":["أُولَئِكَ","هَؤُلَاءِ","هَذَا","هَذِهِ","تِلْكَ"],"dogru":0,"arSecenek":true},
    {"id":28,"tip":"anlam","zorluk":3,"soru":"«bunlar (çoğul)» kelimesinin Arapçası hangisidir?","secenekler":["هَؤُلَاءِ","هَذَا","هَذِهِ","أُولَئِكَ","تِلْكَ"],"dogru":0,"arSecenek":true},
    {"id":29,"tip":"anlam","zorluk":3,"soru":"«هَاتَانِ» ne demek?","secenekler":["Bu ikisi (dişil)","Burası","Orası","Şu/o (eril, uzak)","Bu ikisi (eril)"],"dogru":0,"arapca":"هَاتَانِ"},
    {"id":30,"tip":"anlam","zorluk":3,"soru":"«şu/o (dişil, uzak)» kelimesinin Arapçası hangisidir?","secenekler":["تِلْكَ","أُولَئِكَ","هَؤُلَاءِ","هَذَا","هَذِهِ"],"dogru":0,"arSecenek":true},
    {"id":31,"tip":"anlam","zorluk":1,"soru":"«تِسْعَة» ne demek?","secenekler":["Dokuz (9)","Dört (4)","Sekiz (8)","Üç (3)","Altı (6)"],"dogru":0,"arapca":"تِسْعَة"},
    {"id":32,"tip":"anlam","zorluk":1,"soru":"«سِتَّة» ne demek?","secenekler":["Altı (6)","Dört (4)","Sekiz (8)","Üç (3)","Dokuz (9)"],"dogru":0,"arapca":"سِتَّة"},
    {"id":33,"tip":"anlam","zorluk":1,"soru":"«أَرْبَعَة» ne demek?","secenekler":["Dört (4)","Sekiz (8)","Üç (3)","Altı (6)","Dokuz (9)"],"dogru":0,"arapca":"أَرْبَعَة"},
    {"id":34,"tip":"anlam","zorluk":1,"soru":"«ثَلَاثَة» ne demek?","secenekler":["Üç (3)","Dört (4)","Sekiz (8)","Altı (6)","Dokuz (9)"],"dogru":0,"arapca":"ثَلَاثَة"},
    {"id":35,"tip":"anlam","zorluk":2,"soru":"«on (10)» kelimesinin Arapçası hangisidir?","secenekler":["عَشَرَة","سَبْعَة","وَاحِد","اِثْنَان","خَمْسَة"],"dogru":0,"arSecenek":true},
    {"id":36,"tip":"anlam","zorluk":2,"soru":"«yedi (7)» kelimesinin Arapçası hangisidir?","secenekler":["سَبْعَة","اِثْنَان","خَمْسَة","عَشَرَة","وَاحِد"],"dogru":0,"arSecenek":true},
    {"id":37,"tip":"anlam","zorluk":2,"soru":"«bir (1)» kelimesinin Arapçası hangisidir?","secenekler":["وَاحِد","سَبْعَة","عَشَرَة","اِثْنَان","خَمْسَة"],"dogru":0,"arSecenek":true},
    {"id":38,"tip":"anlam","zorluk":3,"soru":"«iki (2)» kelimesinin Arapçası hangisidir?","secenekler":["اِثْنَان","سَبْعَة","عَشَرَة","وَاحِد","خَمْسَة"],"dogru":0,"arSecenek":true},
    {"id":39,"tip":"anlam","zorluk":3,"soru":"«ثَمَانِيَة» ne demek?","secenekler":["Sekiz (8)","Dört (4)","Üç (3)","Altı (6)","Dokuz (9)"],"dogru":0,"arapca":"ثَمَانِيَة"},
    {"id":40,"tip":"anlam","zorluk":3,"soru":"«beş (5)» kelimesinin Arapçası hangisidir?","secenekler":["خَمْسَة","وَاحِد","اِثْنَان","سَبْعَة","عَشَرَة"],"dogru":0,"arSecenek":true},
    {"id":41,"tip":"anlam","zorluk":1,"soru":"«رَمَادِيّ» ne demek?","secenekler":["Gri","Yeşil","Beyaz","Kırmızı","Pembe"],"dogru":0,"arapca":"رَمَادِيّ"},
    {"id":42,"tip":"anlam","zorluk":1,"soru":"«أَخْضَر» ne demek?","secenekler":["Yeşil","Kırmızı","Pembe","Beyaz","Gri"],"dogru":0,"arapca":"أَخْضَر"},
    {"id":43,"tip":"anlam","zorluk":1,"soru":"«وَرْدِيّ» ne demek?","secenekler":["Pembe","Yeşil","Beyaz","Gri","Kırmızı"],"dogru":0,"arapca":"وَرْدِيّ"},
    {"id":44,"tip":"anlam","zorluk":1,"soru":"«أَحْمَر» ne demek?","secenekler":["Kırmızı","Beyaz","Gri","Pembe","Yeşil"],"dogru":0,"arapca":"أَحْمَر"},
    {"id":45,"tip":"anlam","zorluk":2,"soru":"«kahverengi» kelimesinin Arapçası hangisidir?","secenekler":["بُنِّيّ","أَسْوَد","أَصْفَر","بُرْتُقَالِيّ","أَزْرَق"],"dogru":0,"arSecenek":true},
    {"id":46,"tip":"anlam","zorluk":2,"soru":"«sarı» kelimesinin Arapçası hangisidir?","secenekler":["أَصْفَر","بُرْتُقَالِيّ","بُنِّيّ","أَزْرَق","أَسْوَد"],"dogru":0,"arSecenek":true},
    {"id":47,"tip":"anlam","zorluk":2,"soru":"«turuncu» kelimesinin Arapçası hangisidir?","secenekler":["بُرْتُقَالِيّ","بُنِّيّ","أَزْرَق","أَسْوَد","أَصْفَر"],"dogru":0,"arSecenek":true},
    {"id":48,"tip":"anlam","zorluk":3,"soru":"«mavi» kelimesinin Arapçası hangisidir?","secenekler":["أَزْرَق","أَسْوَد","أَصْفَر","بُرْتُقَالِيّ","بُنِّيّ"],"dogru":0,"arSecenek":true},
    {"id":49,"tip":"anlam","zorluk":3,"soru":"«أَبْيَض» ne demek?","secenekler":["Beyaz","Yeşil","Gri","Kırmızı","Pembe"],"dogru":0,"arapca":"أَبْيَض"},
    {"id":50,"tip":"anlam","zorluk":3,"soru":"«siyah» kelimesinin Arapçası hangisidir?","secenekler":["أَسْوَد","أَصْفَر","بُرْتُقَالِيّ","بُنِّيّ","أَزْرَق"],"dogru":0,"arSecenek":true}
  ,
    {"id":9019,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["هُمْ","Onlar (eril)"],["أَنْتِ","Sen (dişil)"],["مُنْذُ","-den beri"],["رَمَادِيّ","Gri"]]},
    {"id":9020,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["هُنَّ","Onlar (dişil)"],["هُنَا","Burası"],["حَتَّى","-e kadar"],["ثَلَاثَة","Üç (3)"]]},
    {"id":9021,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["هَاتَانِ","Bu ikisi (dişil)"],["أَبْيَض","Beyaz"],["عَنْ","-den, hakkında (uzaklaşma)"],["أَحْمَر","Kırmızı"]]},
    {"id":9022,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «Sen (dişil)»","parcalar":["أ","ن","ت"]},
    {"id":9023,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «-den beri»","parcalar":["م","ن","ذ"]},
    {"id":9024,"tip":"anlam","bicim":"surukle","zorluk":2,"soru":"Harfleri sırala: «Gri»","parcalar":["ر","م","ا","د","ي"]},
    {"id":9025,"tip":"anlam","bicim":"yazma","zorluk":3,"soru":"«Burası» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"هنا","tuslar":["ث","ت","ه","ا","ج","ن","خ","ب","ح","د"]},
    {"id":9026,"tip":"anlam","bicim":"yazma","zorluk":3,"soru":"«-e kadar» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"حتى","tuslar":["ت","ب","ى","ذ","ج","ث","ح","خ","ر","د"]},
    {"id":9027,"tip":"anlam","bicim":"yazma","zorluk":3,"soru":"«Üç (3)» kelimesinin Arapçasını harflerle yaz.","cevapYazi":"ثلاثة","tuslar":["خ","د","ث","ة","ل","ب","ا","ت","ح","ج"]}
  ] },
  { id: "vezinler", ad: "Vezinler", pdf: "Vezinler Bilgi Yarışması.pdf", sorular: SORULAR },
  { id: "dilbilgisi1", ad: "Dilbilgisi 1 (Mücerret)", pdf: "", sorular: [
    {"id":1,"tip":"gramer","zorluk":1,"soru":"Mazi fiil hangi zamanı bildirir?","secenekler":["Görülen (di'li) geçmiş zaman","Şimdiki / geniş zaman","Gelecek zaman","Emir (buyruk)","Geniş zamanın olumsuzu"],"dogru":0},
    {"id":2,"tip":"gramer","zorluk":1,"soru":"Muzari fiil hangi zamanları bildirir?","secenekler":["Şimdiki, geniş ve gelecek zaman","Sadece görülen geçmiş zaman","Sadece emir","Sadece gelecek zaman","Duyulan geçmiş zaman"],"dogru":0},
    {"id":3,"tip":"gramer","zorluk":1,"soru":"«كَتَبَ» hangi fiil kipidir?","secenekler":["Mazi (geçmiş zaman)","Muzari (geniş/şimdiki)","Emir","Mastar","Nehiy"],"dogru":0,"arSecenek":true},
    {"id":4,"tip":"gramer","zorluk":1,"soru":"«يَكْتُبُ» hangi fiil kipidir?","secenekler":["Muzari (geniş/şimdiki)","Mazi (geçmiş)","Emir","İsm-i fâil","Mastar"],"dogru":0,"arSecenek":true},
    {"id":5,"tip":"gramer","zorluk":1,"soru":"Sülasi mücerret fiilin kaç babı vardır?","secenekler":["6","3","4","8","10"],"dogru":0},
    {"id":6,"tip":"gramer","zorluk":1,"soru":"Sülasi mücerredin ism-i fâili hangi vezinde gelir?","secenekler":["فاعِل","مَفْعول","مُفَعِّل","فَعّال","مِفْعال"],"dogru":0,"arSecenek":true},
    {"id":7,"tip":"gramer","zorluk":1,"soru":"Sülasi mücerredin ism-i mef'ûlü hangi vezinde gelir?","secenekler":["مَفْعول","فاعِل","مُفَعَّل","فَعيل","مَفْعَل"],"dogru":0,"arSecenek":true},
    {"id":8,"tip":"gramer","zorluk":1,"soru":"«عالِم» kelimesi hangi türetilmiş isimdir?","secenekler":["İsm-i fâil (işi yapan)","İsm-i mef'ûl (etkilenen)","Mastar","İsm-i zaman","İsm-i âlet"],"dogru":0},
    {"id":9,"tip":"gramer","zorluk":1,"soru":"«مَعْلوم» kelimesi hangi türetilmiş isimdir?","secenekler":["İsm-i mef'ûl (işten etkilenen)","İsm-i fâil (işi yapan)","Mastar","İsm-i tafdîl","İsm-i âlet"],"dogru":0},
    {"id":10,"tip":"gramer","zorluk":1,"soru":"Sülasi mücerret fiillerin mastarları nasıldır?","secenekler":["Semaîdir (işitilerek/ezberle öğrenilir)","Kıyasîdir (kurallıdır)","Tek bir vezni vardır","Daima إِفْعال gelir","Hep aynıdır"],"dogru":0},
    {"id":11,"tip":"gramer","zorluk":1,"soru":"Mazi fiilin başına «ما» gelince ne olur?","secenekler":["Anlamı geçmiş zamanda olumsuzlaşır (şekli değişmez)","Gelecek zaman olur","Emir olur","Soru cümlesi olur","Şekli tamamen değişir"],"dogru":0},
    {"id":12,"tip":"gramer","zorluk":1,"soru":"Muzari fiilin başına «لَمْ» gelince anlamı ne olur?","secenekler":["Kesin geçmiş zaman olumsuzu (yapmadı)","Şimdiki zaman olumlu","Gelecek zaman","Emir","Geniş zaman olumlu"],"dogru":0},
    {"id":13,"tip":"gramer","zorluk":1,"soru":"Muzari fiilin başına «لا» gelince ne olur?","secenekler":["Şimdiki/geniş zaman olumsuzu (yapmıyor)","Geçmiş zaman olumsuzu","Emir olur","Soru olur","Mastar olur"],"dogru":0},
    {"id":14,"tip":"gramer","zorluk":1,"soru":"Olumsuz emir (nehiy) hangi edatla yapılır?","secenekler":["لا","ما","لَمْ","هَل","قَد"],"dogru":0,"arSecenek":true},
    {"id":15,"tip":"gramer","zorluk":1,"soru":"İsm-i zaman ve ism-i mekan, sülasi mücerredde hangi vezinlerde gelir?","secenekler":["مَفْعَل / مَفْعِل","فاعِل / مَفْعول","فَعّال / مِفْعال","مُفَعِّل / مُفَعَّل","فَعيل / فَعّال"],"dogru":0},
    {"id":16,"tip":"gramer","zorluk":1,"soru":"İsm-i âlet (alet ismi) genellikle hangi harfle başlar?","secenekler":["Esreli mim (مِ)","Ötreli mim (مُ)","Üstünlü mim (مَ)","Elif (ا)","Te (ت)"],"dogru":0},
    {"id":17,"tip":"gramer","zorluk":1,"soru":"«جَمْع التَّكْسير» (cem-i teksir) ne demektir?","secenekler":["Kırık çoğul (kelimenin yapısı bozularak çoğul olması)","Düzenli (salim) çoğul","İkil (tesniye)","Küçültme ismi","Üstünlük ismi"],"dogru":0},
    {"id":18,"tip":"gramer","zorluk":1,"soru":"İsm-i tasğîr ne ifade eder?","secenekler":["Küçültme (küçük / sevimli anlamı)","Üstünlük / daha üstün","Kırık çoğul","İşi yapan","Alet ismi"],"dogru":0},
    {"id":19,"tip":"gramer","zorluk":1,"soru":"İsm-i tafdîl ne ifade eder?","secenekler":["Üstünlük (daha / en üstün olma)","Küçültme","Kırık çoğul","İşi yapan","Yapılan iş"],"dogru":0},
    {"id":20,"tip":"gramer","zorluk":1,"soru":"«اُكْتُبْ» hangi fiil kipidir?","secenekler":["Emir (buyruk: yaz!)","Mazi (geçmiş)","Muzari (geniş)","Nehiy (yasak)","Mastar"],"dogru":0,"arSecenek":true}
  ] },
  { id: "dilbilgisi2", ad: "Dilbilgisi 2 (Mezid)", pdf: "", sorular: [
    {"id":1,"tip":"gramer","zorluk":1,"soru":"Mezid bablarda mastar nasıldır?","secenekler":["Kıyasîdir (kurallı; her babın kendine has vezni var)","Semaîdir (ezberlenir)","Belirli bir kuralı yoktur","Daima فاعِل gelir","Her fiilde değişir"],"dogru":0},
    {"id":2,"tip":"gramer","zorluk":1,"soru":"«إِفْعال» hangi babın mastarıdır?","secenekler":["İf'âl babı (أَفْعَلَ)","Tef'îl babı (فَعَّلَ)","Mufâale babı (فاعَلَ)","İstif'âl babı (اِسْتَفْعَلَ)","İnfial babı (اِنْفَعَلَ)"],"dogru":0},
    {"id":3,"tip":"gramer","zorluk":1,"soru":"«أَسْلَمَ» fiilinin mastarı hangisidir?","secenekler":["إِسْلام","تَسْليم","مُسالَمَة","اِسْتِسْلام","اِنْسِلاخ"],"dogru":0,"arSecenek":true},
    {"id":4,"tip":"gramer","zorluk":1,"soru":"Mezid bablar isimlerini neyden alır?","secenekler":["Kendi mastarlarından","Mazi fiilden","Muzari fiilden","İsm-i fâilden","Emir fiilinden"],"dogru":0},
    {"id":5,"tip":"gramer","zorluk":1,"soru":"Mezid bablarda ism-i fâil türetirken muzari başındaki harf atılıp yerine ne getirilir?","secenekler":["Ötreli mim (مُـ)","Esreli mim (مِـ)","Üstünlü mim (مَـ)","Elif (ا)","Te (ت)"],"dogru":0},
    {"id":6,"tip":"gramer","zorluk":1,"soru":"Mezid bab ism-i fâilde sondan bir önceki harfin harekesi ne olur?","secenekler":["Esre (ـِ)","Üstün (ـَ)","Ötre (ـُ)","Cezm (ـْ)","Şedde (ـّ)"],"dogru":0},
    {"id":7,"tip":"gramer","zorluk":1,"soru":"Mezid bab ism-i mef'ûlde sondan bir önceki harfin harekesi ne olur?","secenekler":["Üstün (ـَ)","Esre (ـِ)","Ötre (ـُ)","Cezm (ـْ)","Tenvin"],"dogru":0},
    {"id":8,"tip":"gramer","zorluk":1,"soru":"«يُسْلِمُ» fiilinin ism-i fâili hangisidir?","secenekler":["مُسْلِم","مُسْلَم","سالِم","مَسْلوم","إِسْلام"],"dogru":0,"arSecenek":true},
    {"id":9,"tip":"gramer","zorluk":1,"soru":"«مُنْتَظَر» hangi türetilmiş isimdir?","secenekler":["İsm-i mef'ûl (beklenen)","İsm-i fâil (bekleyen)","Mastar","İsm-i zaman","Mazi fiil"],"dogru":0},
    {"id":10,"tip":"gramer","zorluk":1,"soru":"Mezid bablarda ism-i zaman ve ism-i mekan vezni neye eşittir?","secenekler":["O babın ism-i mef'ûl vezniyle aynıdır","İsm-i fâil vezniyle aynıdır","Mastar vezniyle aynıdır","Daima مَفْعَل gelir","Daima فاعِل gelir"],"dogru":0},
    {"id":11,"tip":"gramer","zorluk":1,"soru":"«جاهَدَ» fiili hangi babdandır?","secenekler":["Mufâale (فاعَلَ)","İf'âl (أَفْعَلَ)","Tef'îl (فَعَّلَ)","İstif'âl (اِسْتَفْعَلَ)","İftial (اِفْتَعَلَ)"],"dogru":0},
    {"id":12,"tip":"gramer","zorluk":1,"soru":"«تَفْعيل» hangi babın mastarıdır?","secenekler":["Tef'îl babı (فَعَّلَ)","İf'âl babı (أَفْعَلَ)","Mufâale babı (فاعَلَ)","İstif'âl babı (اِسْتَفْعَلَ)","İnfial babı (اِنْفَعَلَ)"],"dogru":0},
    {"id":13,"tip":"gramer","zorluk":1,"soru":"«اِسْتِفْعال» hangi babın mastarıdır?","secenekler":["İstif'âl babı (اِسْتَفْعَلَ)","İf'âl babı (أَفْعَلَ)","Tef'îl babı (فَعَّلَ)","İftial babı (اِفْتَعَلَ)","İnfial babı (اِنْفَعَلَ)"],"dogru":0},
    {"id":14,"tip":"gramer","zorluk":1,"soru":"«اِسْتَغْفَرَ» fiili hangi babdandır?","secenekler":["İstif'âl (اِسْتَفْعَلَ)","İf'âl (أَفْعَلَ)","Tef'îl (فَعَّلَ)","Mufâale (فاعَلَ)","İnfial (اِنْفَعَلَ)"],"dogru":0},
    {"id":15,"tip":"gramer","zorluk":1,"soru":"«اِنْفَعَلَ» fiili hangi babdandır?","secenekler":["İnfial (اِنْفَعَلَ)","İftial (اِفْتَعَلَ)","İf'âl (أَفْعَلَ)","Tef'îl (فَعَّلَ)","İstif'âl (اِسْتَفْعَلَ)"],"dogru":0},
    {"id":16,"tip":"gramer","zorluk":1,"soru":"«Mezid» fiil ne demektir?","secenekler":["Aslî harflerine harf eklenmiş (ziyadeleşmiş) fiil","Yalın / çıplak üç harfli fiil","Sadece mastar","Çoğul isim","Emir kipi"],"dogru":0},
    {"id":17,"tip":"gramer","zorluk":1,"soru":"Mastar bakımından mücerret ile mezidin farkı nedir?","secenekler":["Mücerret semaî (ezber), mezid kıyasî (kurallı)","İkisi de kurallıdır","İkisi de ezberdir","Mezid ezber, mücerret kurallı","Aralarında fark yoktur"],"dogru":0},
    {"id":18,"tip":"gramer","zorluk":1,"soru":"«عَلَّمَ» (öğretti) fiili hangi babdandır?","secenekler":["Tef'îl (فَعَّلَ)","İf'âl (أَفْعَلَ)","Mufâale (فاعَلَ)","İstif'âl (اِسْتَفْعَلَ)","İnfial (اِنْفَعَلَ)"],"dogru":0}
  ] },
  { id: "tamlamacumle", ad: "Tamlama ve Cümleler", pdf: "", sorular: TAMLAMA_SORULARI },
  { id: "irab", ad: "İ'rab", pdf: "", sorular: IRAB_SORULARI },
];

/* ===================================================================
   ZENGİNLEŞTİRME — mevcut sorulardan TÜRETİLMİŞ ek sorular. Yeni Arapça
   YAZILMADI; var olan kelime/cümleler farklı soru tiplerine dönüştürüldü
   (eşleştirme, doğru/yanlış, boşluk doldurma, anlamı bozan kelime).
   Elle yazılmış KONULAR dizilerine dokunulmasın diye AYRI tutuldu; yükleme
   anında ilgili konunun sorularının SONUNA eklenir. Yeni veri de hep bu 7
   soru tipine göre (test/surukle/eslestir/yazma/bosluk/dogruyanlis/cumlesira)
   eklenecek. ID aralığı 80000+ (mevcut id'lerle çakışmaz).
   =================================================================== */
const EK_SORULAR = {
  "sinif7": [
    {"id":80000,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["الفَطور","Kahvaltı"],["الغَداء","Öğle yemeği"],["العَشاء","Akşam yemeği"],["الصَّباح","Sabah"]]},
    {"id":80001,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["المَساء","Akşam"],["اللَّيْل","Gece"],["المَدْرَسَة","Okul"],["البَيْت","Ev"]]},
    {"id":80002,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["الحَليب","Süt"],["الجُبْن","Peynir"],["الزَّيْتون","Zeytin"],["اللَّحْم","Et"]]},
    {"id":80003,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["الأُرْز","Pirinç / pilav"],["القَهْوَة","Kahve"],["الشّاي","Çay"],["السَّمَك","Balık"]]},
    {"id":80004,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Küçük» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"صَغير"},
    {"id":80005,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Kahvaltı» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"المَساء"},
    {"id":80006,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Soğan» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"البَصَل"},
    {"id":80007,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Kahvaltı» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"عاصِمَة"},
    {"id":80008,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Et» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"اللَّحْم"},
    {"id":80009,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Kahvaltı» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"الدَّرّاجَة"},
    {"id":80010,"tip":"anlam","bicim":"dogruyanlis","zorluk":2,"soru":"Bu kelime «Saat üç.» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"السّاعَة الثّالِثَة"},
    {"id":80011,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Kahvaltı» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"المِلْح"},
    {"id":80015,"tip":"cumle","bicim":"bosluk","zorluk":2,"soru":"Boşluğa gelecek kelimeyi seç: «أَشْرَبُ القَهْوَة بَعْد ____»","secenekler":["أَتَناوَلُ","أُساعِدُ","الغَداء.","أَدْرُسُ"],"dogru":2,"arSecenek":true},
    {"id":80016,"tip":"cumle","bicim":"bosluk","zorluk":2,"soru":"Boşluğa gelecek kelimeyi seç: «أَنْتِ تَـدْرُسينَ الدُّروس ____»","secenekler":["دُروسي","أَتَناوَلُ","مَساءً.","أُساعِدُ"],"dogru":2,"arSecenek":true},
    {"id":80017,"tip":"cumle","bicim":"bosluk","zorluk":2,"soru":"Boşluğa gelecek kelimeyi seç: «أَتَناوَلُ الفَطور في السّاعَة السّابِعَة ____»","secenekler":["دُروسي","الغَداء.","صَباحًا.","أُمّي"],"dogru":2,"arSecenek":true},
    {"id":80019,"tip":"cumle","bicim":"bosluk","zorluk":2,"soru":"Boşluğa gelecek kelimeyi seç: «أُساعِدُ أُمّي ____»","secenekler":["الزَّيْتون","هُو","تَـدْرُسينَ","في البَيْت."],"dogru":3,"arSecenek":true},
    {"id":80020,"tip":"cumle","bicim":"test","zorluk":3,"soru":"Aşağıdaki kelimelerden hangisi «Akşam derslerimi çalışırım.» cümlesine ait DEĞİLDİR (anlamı bozar)?","secenekler":["أُخْت","أَدْرُسُ","دُروسي","مَساءً."],"dogru":0,"arSecenek":true},
    {"id":80021,"tip":"cumle","bicim":"test","zorluk":3,"soru":"Aşağıdaki kelimelerden hangisi «O sabah namazı kılıyor.» cümlesine ait DEĞİLDİR (anlamı bozar)?","secenekler":["ثَمَانِيَة","هُو","يُـصَلّي","الفَجْر."],"dogru":0,"arSecenek":true},
    {"id":80022,"tip":"cumle","bicim":"test","zorluk":3,"soru":"Aşağıdaki kelimelerden hangisi «Öğle yemeğinden sonra kahve içiyorum.» cümlesine ait DEĞİLDİR (anlamı bozar)?","secenekler":["سِتَّة","أَشْرَبُ","الغَداء.","بَعْد"],"dogru":0,"arSecenek":true}
  ],
  "sinif9": [
    {"id":80023,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["أُسْرَة / عَائِلَة","Aile"],["وَالِد / أَب","Baba"],["وَالِدَة / أُم","Anne"],["جَد","Dede"]]},
    {"id":80024,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["جَدَّة","Babaanne / Anneanne"],["أَخ","Erkek kardeş"],["أُخْت","Kız kardeş"],["ابْن","Oğul"]]},
    {"id":80025,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["ابْنَة","Kız çocuk"],["مُدَرِّس / مُدَرِّسَة","Öğretmen"],["طَبِيب / طَبِيبَة","Doktor"],["مُهَنْدِس / مُهَنْدِسَة","Mühendis"]]},
    {"id":80026,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["عَامِل / عَامِلَة","İşçi"],["طَبَّاخ / طَبَّاحَة","Aşçı"],["طَالِب / طَالِبَة","Öğrenci"],["مُدِير / مُدِيرَة","Müdür / Müdire"]]},
    {"id":80027,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Temiz» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"نَظِيف"},
    {"id":80028,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Aile» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"جَدَّة"},
    {"id":80029,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Banyo» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"حَمَّام"},
    {"id":80030,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Aile» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"أَيْن"},
    {"id":80031,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Mühendis» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"مُهَنْدِس / مُهَنْدِسَة"},
    {"id":80032,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Aile» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"كُرْسِي"},
    {"id":80033,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Okul» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"مَدْرَسَة"},
    {"id":80034,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Aile» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"يُوجَدُ"}
  ],
  "sinif10": [
    {"id":80035,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["في الأَعْياد المُسْلِمون يُصَلّونَ قَبْل الطَّعام صَلاة العيد‫.‬","Bayramlarda Müslümanlar yemekten önce bayram namazı kılarlar."],["يَجِبُ عَلَيْكَ أَلّا تَكونَ كاذِبًا أَبَدًا‫.‬","Asla yalancı olmaman gerekir."],["أَنا مَريض.","Ben hastayım."],["عِنْدي عِنْدي صُداع شَديد.","Bende şiddetli baş ağrısı var."]]},
    {"id":80036,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["عِنْدي كُحَّة.","Öksürüğüm var."],["وَيَقولُ بَعْضُهُم لِبَعْض: كُلّ عام وَأَنْتُم بِخَيْر‫.‬","Ve birbirlerine şöyle derler: Bayramınız kutlu olsun."],["عِنْدي حَرارَة مُرْتَفِعَة.","Yüksek ateşim var."],["أَنا عامِل، أَعْمَلُ في المَصْنَع.","Ben işçiyim, fabrikada çalışıyorum."]]},
    {"id":80037,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["هُم يُكْرِمونَ ضُيوفَهُم‫.‬","Onlar misafirlerine ikram ederler."],["كوني مُبْتَسِمَة‫.‬","Güler yüzlü ol."],["هِي قَلِقَة‫.‬","O endişelidir."],["يَجِبُ عَلَيْكَ أَنْ تَتَناوَلَ الدَّواء.","İlacı kullanman/tüketmen gerekir."]]},
    {"id":80038,"tip":"anlam","bicim":"dogruyanlis","zorluk":2,"soru":"Bu kelime «Öksürüğüm var.» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"عِنْدي كُحَّة."},
    {"id":80039,"tip":"anlam","bicim":"dogruyanlis","zorluk":2,"soru":"Bu kelime «Bayramlarda Müslümanlar yemekten önce bayram namazı kılarlar.» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"يَجِبُ عَلَيْكَ أَنْ تَتَناوَلَ الدَّواء."},
    {"id":80040,"tip":"anlam","bicim":"dogruyanlis","zorluk":2,"soru":"Bu kelime «Ben hastayım.» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"أَنا مَريض."},
    {"id":80041,"tip":"anlam","bicim":"dogruyanlis","zorluk":2,"soru":"Bu kelime «Bayramlarda Müslümanlar yemekten önce bayram namazı kılarlar.» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"كوني مُبْتَسِمَة‫.‬"},
    {"id":80042,"tip":"anlam","bicim":"dogruyanlis","zorluk":2,"soru":"Bu kelime «Bayramlarda Müslümanlar yemekten önce bayram namazı kılarlar.» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"في الأَعْياد المُسْلِمون يُصَلّونَ قَبْل الطَّعام صَلاة العيد‫.‬"},
    {"id":80043,"tip":"anlam","bicim":"dogruyanlis","zorluk":2,"soru":"Bu kelime «Bayramlarda Müslümanlar yemekten önce bayram namazı kılarlar.» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"أَنا عامِل، أَعْمَلُ في المَصْنَع."},
    {"id":80044,"tip":"anlam","bicim":"dogruyanlis","zorluk":2,"soru":"Bu kelime «Ve birbirlerine şöyle derler: Bayramınız kutlu olsun.» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"وَيَقولُ بَعْضُهُم لِبَعْض: كُلّ عام وَأَنْتُم بِخَيْر‫.‬"},
    {"id":80045,"tip":"anlam","bicim":"dogruyanlis","zorluk":2,"soru":"Bu kelime «Bayramlarda Müslümanlar yemekten önce bayram namazı kılarlar.» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"عِنْدي عِنْدي صُداع شَديد."},
    {"id":80046,"tip":"cumle","bicim":"bosluk","zorluk":2,"soru":"Boşluğa gelecek kelimeyi seç: «يَجِبُ عَلَيْكَ أَنْ تَكونَ صادِقًا ____»","secenekler":["هُم","دائِمًا‫.‬","يَجِبُ عَلَيْكِ","أَشْعُرُ"],"dogru":1,"arSecenek":true},
    {"id":80047,"tip":"cumle","bicim":"bosluk","zorluk":2,"soru":"Boşluğa gelecek kelimeyi seç: «يَجِبُ عَلَيْكِ أَنْ تَكوني ____»","secenekler":["صادِقًا","صَبورَة‫.‬","في الشَّرِكَة.","يُحِبّونَ"],"dogru":1,"arSecenek":true},
    {"id":80048,"tip":"cumle","bicim":"bosluk","zorluk":2,"soru":"Boşluğa gelecek kelimeyi seç: «أَبي وَأَخي مُهَنْدِسان، وَهُما يَعْمَلانِ ____»","secenekler":["صادِقًا","في الشَّرِكَة.","في حَلْقي.","مَريض،"],"dogru":1,"arSecenek":true},
    {"id":80049,"tip":"cumle","bicim":"bosluk","zorluk":2,"soru":"Boşluğa gelecek kelimeyi seç: «أَشْعُرُ بِأَلَم ____»","secenekler":["يَعْمَلانِ","يُحِبّونَ","في حَلْقي.","صادِقًا"],"dogru":2,"arSecenek":true},
    {"id":80050,"tip":"cumle","bicim":"bosluk","zorluk":2,"soru":"Boşluğa gelecek kelimeyi seç: «يَجِبُ عَلى المُسْلِم أَنْ يَكونَ ____»","secenekler":["يَجِبُ عَلَيْكِ","يَعْمَلانِ","مُبْتَسِمًا‫.‬","الصِّغار‫.‬"],"dogru":2,"arSecenek":true},
    {"id":80051,"tip":"cumle","bicim":"bosluk","zorluk":2,"soru":"Boşluğa gelecek kelimeyi seç: «هُم يُحِبّونَ ____»","secenekler":["أَنا","يَجِبُ عَلَيْكِ","الصِّغار‫.‬","يَعْمَلانِ"],"dogru":2,"arSecenek":true},
    {"id":80052,"tip":"cumle","bicim":"bosluk","zorluk":2,"soru":"Boşluğa gelecek kelimeyi seç: «أَنا مَريض، عِنْدي ____»","secenekler":["أَشْعُرُ","هُم","صُداع.","يَجِبُ عَلَيْكِ"],"dogru":2,"arSecenek":true},
    {"id":80053,"tip":"cumle","bicim":"test","zorluk":3,"soru":"Aşağıdaki kelimelerden hangisi «Babam ve kardeşim mühendistirler, ve onlar şirkette çalışıyorlar» cümlesine ait DEĞİLDİR (anlamı bozar)?","secenekler":["هُنَاكَ","مُهَنْدِسان،","أَبي","يَعْمَلانِ"],"dogru":0,"arSecenek":true}
  ],
  "kelimeler": [
    {"id":80054,"tip":"anlam","bicim":"eslestir","zorluk":1,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["مُنْذُ","-den beri"],["فِي","İçinde, -de/-da"],["حَتَّى","-e kadar"],["عَنْ","-den, hakkında (uzaklaşma)"]]},
    {"id":80055,"tip":"anlam","bicim":"eslestir","zorluk":3,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["لِ","için, -e ait"],["بِ","ile, vasıtasıyla"],["إِلَى","-e, -a (yönelme/bitiş)"],["عَلَى","üzerine, üstünde"]]},
    {"id":80056,"tip":"anlam","bicim":"eslestir","zorluk":3,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["مِنْ","-den, -dan (başlangıç/ayrılma)"],["كَ","gibi"],["هُنَّ","Onlar (dişil)"],["هِيَ","O (dişil)"]]},
    {"id":80057,"tip":"anlam","bicim":"eslestir","zorluk":2,"soru":"Kelimeleri anlamlarıyla eşleştir.","ciftler":[["هُمْ","Onlar (eril)"],["أَنْتِ","Sen (dişil)"],["أَنَا","ben"],["نَحْنُ","biz"]]},
    {"id":80058,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Kırmızı» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"أَحْمَر"},
    {"id":80059,"tip":"anlam","bicim":"dogruyanlis","zorluk":2,"soru":"Bu kelime «-den beri» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"لِ"},
    {"id":80060,"tip":"anlam","bicim":"dogruyanlis","zorluk":3,"soru":"Bu kelime «bunlar (çoğul)» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"هَؤُلَاءِ"},
    {"id":80061,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «-den beri» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"هِيَ"},
    {"id":80062,"tip":"anlam","bicim":"dogruyanlis","zorluk":2,"soru":"Bu kelime «on (10)» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"عَشَرَة"},
    {"id":80063,"tip":"anlam","bicim":"dogruyanlis","zorluk":3,"soru":"Bu kelime «-den beri» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"أَنْتَ"},
    {"id":80064,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «Yeşil» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":0,"arapca":"أَخْضَر"},
    {"id":80065,"tip":"anlam","bicim":"dogruyanlis","zorluk":1,"soru":"Bu kelime «-den beri» demek. Doğru mu?","secenekler":["Doğru","Yanlış"],"dogru":1,"arapca":"حَتَّى"}
  ]
};
/* DIŞARIDAN GELEN KONULAR — ayrı dosyada üretilen soru kümeleri.
   Örn. oyunlar/biy_kaliplar.js (kalıplar tablosunun verisinden üretildi)
   bu dosyadan ÖNCE yüklenir ve window.BIY_EK_KONULAR'a kendini iter.
   Böylece üretilmiş sorular bu dosyayı şişirmez ve üretici betik yeniden
   çalıştığında yalnız kendi dosyasının üzerine yazar. */
if (Array.isArray(window.BIY_EK_KONULAR)) {
  window.BIY_EK_KONULAR.forEach(k => {
    if (k && k.id && Array.isArray(k.sorular) && !KONULAR.some(x => x.id === k.id))
      KONULAR.push(k);
  });
}
KONULAR.forEach(k => { if (EK_SORULAR[k.id] && Array.isArray(k.sorular)) k.sorular = k.sorular.concat(EK_SORULAR[k.id]); });

const TIP_BILGI = {
  "harf":        { ad: "Alfabe / Harfler", emoji: "🔠" },
  "bosluk":      { ad: "Boşluk Doldurma", emoji: "⬜" },
  "dogruyanlis": { ad: "Doğru / Yanlış",  emoji: "✅" },
  "edat":        { ad: "Edatlar",         emoji: "🔗" },
  "kok":        { ad: "Kök Bulma",       emoji: "🌱" },
  "vezin":      { ad: "Vezin Bulma",     emoji: "⚖️" },
  "anlam":      { ad: "Anlam",           emoji: "💡" },
  "ters-vezin": { ad: "Kalıptan Üretme", emoji: "🔧" },
  "ayet":       { ad: "Ayet / Örnek",    emoji: "📖" },
  "cumle":      { ad: "Cümle",           emoji: "💬" },
  "gramer":     { ad: "Dilbilgisi",      emoji: "📝" },
  "irab":       { ad: "İ'rab",           emoji: "📐" }
};
const ZORLUK_AD = { 1: "Kolay", 2: "Orta", 3: "Zor" };
/* SÜZGEÇ PANELİ AÇIKLAMALARI ------------------------------------------
   Panelde her seçeneğin altında bir cümlelik açıklama var: öğretmen ikonu
   çözmeye çalışmasın, ne kapattığını okusun. */
const BICIM_ACIKLAMA = {
  "test":       "Şıklardan doğru olanı işaretlenir.",
  "surukle":    "Karışık kelimeler doğru sıraya dizilir.",
  "eslestir":   "Arapça kelime Türkçe karşılığıyla birleştirilir.",
  "yazma":      "Cevap harf harf klavyeyle yazılır.",
  "bosluk":     "Cümledeki boşluğa uyan seçenek bulunur.",
  "dogruyanlis":"Verilen yargı doğru mu yanlış mı seçilir.",
  "cumlesira":  "Cümlenin kelimeleri doğru sıraya dizilir."
};
const ZORLUK_ACIKLAMA = {
  1: "Tek kelime, doğrudan anlam soruları.",
  2: "Cümle kurma ve çeviri soruları.",
  3: "Uzun cümle, dilbilgisi ve ayrıntı soruları."
};
/* SORU İÇERİĞİ — üçüncü süzgeç ekseni.
   Komisyon sürümü içeriği metinden SEZGİSEL olarak çıkarıyor; burada buna
   gerek yok, çünkü ka.com sorularının hepsinde zaten `tip` alanı var
   (TIP_BILGI). Yani içerik ekseni tahmine değil, veriye dayanıyor. */
const ICERIK_SIRA = ["anlam","cumle","harf","edat","kok","vezin","ters-vezin","gramer","irab","bosluk","dogruyanlis","ayet"];
const ICERIK_NOT = {
  "harf":"Harf tanıma, sıra, ses.",
  "bosluk":"Cümlede eksik parça.",
  "dogruyanlis":"Yargı doğrulama.",
  "edat":"Harf-i cer ve edatlar.",
  "kok":"Kelimenin kökü.",
  "vezin":"Kelimenin kalıbı.",
  "anlam":"Kelime ve ifade anlamı.",
  "ters-vezin":"Kalıptan kelime üretme.",
  "ayet":"Âyet ya da örnek metin.",
  "cumle":"Cümle kurma ve çeviri.",
  "gramer":"Dilbilgisi kuralı.",
  "irab":"Cümle çözümlemesi."
};
/* Sorunun içerik kategorisi. Tanımsız/bilinmeyen tip "anlam" sayılır ki
   hiçbir soru süzgecin dışında kaybolmasın. */
function icerikAl(q){
  const t = (q && q.tip) || "";
  return ICERIK_SIRA.indexOf(t) >= 0 ? t : "anlam";
}
const SIK_RENK = ["#E74C3C", "#3498DB", "#F1C40F", "#27AE60", "#9B59B6"]; // A B C D E

/* =====================================================================
   KARAKTERLER — katilimci adinin yaninda gorunen ozel SVG avatarlar.
   Birey odalarinda 30 tek karakter (hayvan · esya · uzay/robot),
   takim odalarinda 12 arma, okul (sinif) odalarinda 12 okul rozeti.
   Her avatari yalnizca BIR katilimci alabilir; sahiplenme Firestore
   tarafinda islem (transaction) ile yapilir → kim once kaparsa onun.
   SVG'lerde id yoktur (duz renk), bu yuzden her yere guvenle klonlanir.
   ===================================================================== */
const KRK_BIREY = [
  { i:"kedi", a:"قِطّ", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFE0B2"/><path d="M13 19l-1.5-9 8.5 4.5z" fill="#EF6C00"/><path d="M35 19l1.5-9-8.5 4.5z" fill="#EF6C00"/><circle cx="24" cy="27" r="13" fill="#F59E0B"/><circle cx="19" cy="25" r="2.3" fill="#3E2723"/><circle cx="29" cy="25" r="2.3" fill="#3E2723"/><path d="M24 30l-2.4 2.2h4.8z" fill="#5D4037"/><path d="M8 27h7M8 32h7M40 27h-7M40 32h-7" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { i:"kopek", a:"كَلْب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#D7CCC8"/><ellipse cx="11.5" cy="23" rx="4.5" ry="9" fill="#6D4C41"/><ellipse cx="36.5" cy="23" rx="4.5" ry="9" fill="#6D4C41"/><circle cx="24" cy="26" r="13" fill="#A1887F"/><circle cx="19" cy="23" r="2.2" fill="#3E2723"/><circle cx="29" cy="23" r="2.2" fill="#3E2723"/><ellipse cx="24" cy="31" rx="7" ry="5.5" fill="#EFEBE9"/><ellipse cx="24" cy="29.5" rx="2.8" ry="2.1" fill="#3E2723"/><path d="M24 32v3.5" stroke="#3E2723" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { i:"tavsan", a:"أَرْنَب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#F8BBD0"/><ellipse cx="18" cy="14" rx="4.2" ry="10" fill="#FAFAFA"/><ellipse cx="30" cy="14" rx="4.2" ry="10" fill="#FAFAFA"/><ellipse cx="18" cy="14.5" rx="2" ry="6.8" fill="#F06292"/><ellipse cx="30" cy="14.5" rx="2" ry="6.8" fill="#F06292"/><circle cx="24" cy="31" r="12" fill="#FAFAFA"/><circle cx="19.6" cy="29" r="2.1" fill="#5D4037"/><circle cx="28.4" cy="29" r="2.1" fill="#5D4037"/><path d="M24 33l-2.2 2h4.4z" fill="#F06292"/><path d="M24 35v2" stroke="#5D4037" stroke-width="1.3" stroke-linecap="round"/></svg>' },
  { i:"tilki", a:"ثَعْلَب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFCCBC"/><path d="M12 20l-1-10 9 5z" fill="#E64A19"/><path d="M36 20l1-10-9 5z" fill="#E64A19"/><circle cx="24" cy="26" r="13" fill="#FB8C00"/><path d="M24 24c4 0 7 4 7 8s-3 5-7 5-7-1-7-5 3-8 7-8z" fill="#FFF8E1"/><circle cx="18.5" cy="23" r="2.1" fill="#3E2723"/><circle cx="29.5" cy="23" r="2.1" fill="#3E2723"/><circle cx="24" cy="31" r="2.3" fill="#3E2723"/></svg>' },
  { i:"ayi", a:"دُبّ", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#BCAAA4"/><circle cx="13" cy="15" r="6" fill="#795548"/><circle cx="35" cy="15" r="6" fill="#795548"/><circle cx="13" cy="15" r="3" fill="#D7CCC8"/><circle cx="35" cy="15" r="3" fill="#D7CCC8"/><circle cx="24" cy="27" r="14" fill="#8D6E63"/><circle cx="19" cy="24" r="2.2" fill="#3E2723"/><circle cx="29" cy="24" r="2.2" fill="#3E2723"/><ellipse cx="24" cy="32" rx="7.5" ry="6" fill="#D7CCC8"/><ellipse cx="24" cy="30" rx="3" ry="2.2" fill="#3E2723"/></svg>' },
  { i:"panda", a:"بَانْدا", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#CFD8DC"/><circle cx="13" cy="15" r="6" fill="#263238"/><circle cx="35" cy="15" r="6" fill="#263238"/><circle cx="24" cy="27" r="14" fill="#FAFAFA"/><ellipse cx="18" cy="24" rx="4.6" ry="5.6" fill="#263238" transform="rotate(-16 18 24)"/><ellipse cx="30" cy="24" rx="4.6" ry="5.6" fill="#263238" transform="rotate(16 30 24)"/><circle cx="18.6" cy="24" r="1.8" fill="#FAFAFA"/><circle cx="29.4" cy="24" r="1.8" fill="#FAFAFA"/><ellipse cx="24" cy="31" rx="3" ry="2.2" fill="#263238"/><path d="M24 33.5v2" stroke="#263238" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { i:"aslan", a:"أَسَد", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFE082"/><g fill="#E65100"><circle cx="24" cy="8" r="5"/><circle cx="35" cy="12" r="5"/><circle cx="40" cy="23" r="5"/><circle cx="35" cy="34" r="5"/><circle cx="24" cy="39" r="5"/><circle cx="13" cy="34" r="5"/><circle cx="8" cy="23" r="5"/><circle cx="13" cy="12" r="5"/></g><circle cx="24" cy="24" r="13" fill="#FBC02D"/><circle cx="19" cy="22" r="2.2" fill="#4E342E"/><circle cx="29" cy="22" r="2.2" fill="#4E342E"/><path d="M24 27l-2.6 2.4h5.2z" fill="#4E342E"/><path d="M17 32q7 5 14 0" stroke="#4E342E" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>' },
  { i:"kurbaga", a:"ضِفْدَع", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#C8E6C9"/><circle cx="15" cy="16" r="7" fill="#66BB6A"/><circle cx="33" cy="16" r="7" fill="#66BB6A"/><circle cx="15" cy="16" r="4" fill="#FAFAFA"/><circle cx="33" cy="16" r="4" fill="#FAFAFA"/><circle cx="15" cy="16.5" r="2.2" fill="#1B5E20"/><circle cx="33" cy="16.5" r="2.2" fill="#1B5E20"/><path d="M8 27a16 12 0 0 0 32 0z" fill="#43A047"/><path d="M14 30q10 7 20 0" stroke="#1B5E20" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="12" cy="27" r="1.6" fill="#1B5E20" opacity=".5"/><circle cx="36" cy="27" r="1.6" fill="#1B5E20" opacity=".5"/></svg>' },
  { i:"baykus", a:"بومَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#D1C4E9"/><path d="M12 16l3-9 6 6z" fill="#5E35B1"/><path d="M36 16l-3-9-6 6z" fill="#5E35B1"/><ellipse cx="24" cy="27" rx="14" ry="15" fill="#7E57C2"/><circle cx="18" cy="23" r="6" fill="#FAFAFA"/><circle cx="30" cy="23" r="6" fill="#FAFAFA"/><circle cx="18" cy="23" r="2.8" fill="#311B92"/><circle cx="30" cy="23" r="2.8" fill="#311B92"/><path d="M24 27l-3 4h6z" fill="#FB8C00"/><path d="M17 35q7 4 14 0" stroke="#5E35B1" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>' },
  { i:"balik", a:"سَمَكَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#B3E5FC"/><path d="M38 24l8-7v14z" fill="#0288D1"/><ellipse cx="22" cy="24" rx="16" ry="11" fill="#29B6F6"/><path d="M22 13q5 4 5 11t-5 11" stroke="#0288D1" stroke-width="2" fill="none"/><circle cx="12" cy="21" r="2.6" fill="#FAFAFA"/><circle cx="11.4" cy="21" r="1.4" fill="#01579B"/><path d="M20 13v-5l7 5z" fill="#0288D1"/></svg>' },
  { i:"kitap", a:"كِتاب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFCDD2"/><path d="M10 12h11a4 4 0 0 1 3 1.6A4 4 0 0 1 27 12h11v25H27a3 3 0 0 0-3 2 3 3 0 0 0-3-2H10z" fill="#EF5350"/><path d="M22.4 15.4V37a4.6 4.6 0 0 0-2.4-.7h-8V15.4z" fill="#FFEBEE"/><path d="M25.6 15.4V37a4.6 4.6 0 0 1 2.4-.7h8V15.4z" fill="#FFEBEE"/><path d="M14 20h6M14 24h6M28 20h6M28 24h6" stroke="#EF9A9A" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { i:"kalem", a:"قَلَم", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFF9C4"/><path d="M12 36l2-8 18-18 6 6-18 18z" fill="#FDD835"/><path d="M32 10l6 6 3-3a4.2 4.2 0 0 0-6-6z" fill="#EC407A"/><path d="M14 28l6 6-8 2z" fill="#FFF8E1"/><path d="M12 36l3-1-2-2z" fill="#455A64"/><path d="M28 14l6 6" stroke="#F9A825" stroke-width="2" stroke-linecap="round"/></svg>' },
  { i:"saat", a:"ساعَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#B2EBF2"/><circle cx="24" cy="25" r="15" fill="#00838F"/><circle cx="24" cy="25" r="12" fill="#FAFAFA"/><path d="M24 17v8l6 4" stroke="#00838F" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="25" r="1.8" fill="#00838F"/><path d="M18 8h12v4H18z" fill="#00838F"/></svg>' },
  { i:"canta", a:"حَقيبَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#D7CCC8"/><path d="M18 16v-3a6 6 0 0 1 12 0v3" stroke="#5D4037" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="9" y="16" width="30" height="22" rx="4" fill="#8D6E63"/><rect x="9" y="23" width="30" height="4" fill="#5D4037"/><rect x="21" y="21" width="6" height="8" rx="2" fill="#FFCA28"/></svg>' },
  { i:"ampul", a:"مِصْباح", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFF59D"/><path d="M24 7a12 12 0 0 0-7 21.7V33h14v-4.3A12 12 0 0 0 24 7z" fill="#FDD835"/><rect x="18" y="33" width="12" height="3.4" rx="1.4" fill="#90A4AE"/><rect x="19.5" y="37" width="9" height="3.4" rx="1.4" fill="#78909C"/><path d="M21 28v-6h6v6" stroke="#F57F17" stroke-width="1.6" fill="none"/><path d="M5 24h3M40 24h3M9 10l2 2M39 10l-2 2" stroke="#F9A825" stroke-width="2" stroke-linecap="round"/></svg>' },
  { i:"fincan", a:"كوب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFE0B2"/><path d="M30 21h4a5 5 0 0 1 0 10h-4" stroke="#8D6E63" stroke-width="3" fill="none"/><path d="M10 17h22v14a8 8 0 0 1-8 8h-6a8 8 0 0 1-8-8z" fill="#FAFAFA"/><path d="M10 17h22v5H10z" fill="#EF6C00"/><path d="M17 12q2-3 0-6M25 12q2-3 0-6" stroke="#BCAAA4" stroke-width="2" fill="none" stroke-linecap="round"/></svg>' },
  { i:"anahtar", a:"مِفْتاح", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFECB3"/><circle cx="16" cy="19" r="9" fill="none" stroke="#FFA000" stroke-width="5"/><circle cx="16" cy="19" r="3" fill="#FFF8E1"/><path d="M22 25l14 14" stroke="#FFA000" stroke-width="5" stroke-linecap="round"/><path d="M31 30l4-4M35 34l4-4" stroke="#FFA000" stroke-width="4" stroke-linecap="round"/></svg>' },
  { i:"balon", a:"بالون", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#F8BBD0"/><ellipse cx="24" cy="19" rx="12" ry="14" fill="#EC407A"/><path d="M20 33h8l-4 4z" fill="#AD1457"/><path d="M24 37q4 4 0 8" stroke="#AD1457" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="19" cy="14" rx="3" ry="4.5" fill="#F8BBD0" opacity=".75" transform="rotate(-22 19 14)"/></svg>' },
  { i:"ud", a:"عود", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#D7CCC8"/><path d="M31 8l8 8-6 6-8-8z" fill="#8D6E63"/><ellipse cx="19" cy="30" rx="13" ry="11" fill="#A1887F" transform="rotate(-45 19 30)"/><path d="M24 24l8-8" stroke="#5D4037" stroke-width="4" stroke-linecap="round"/><circle cx="18" cy="29" r="4.5" fill="#4E342E"/><path d="M25 22l-9 9M28 25l-9 9" stroke="#FFE0B2" stroke-width="1.2"/></svg>' },
  { i:"kamera", a:"كاميرا", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#B0BEC5"/><path d="M17 12h14l2.5 4H39a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4h5.5z" fill="#455A64"/><circle cx="24" cy="27" r="9" fill="#90A4AE"/><circle cx="24" cy="27" r="5.5" fill="#263238"/><circle cx="22" cy="25" r="1.8" fill="#B0BEC5"/><circle cx="36" cy="21" r="1.8" fill="#FFCA28"/></svg>' },
  { i:"roket", a:"صاروخ", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#C5CAE9"/><path d="M24 5c6 5 9 12 9 20v6H15v-6c0-8 3-15 9-20z" fill="#FAFAFA"/><path d="M15 25l-6 8 6-1zM33 25l6 8-6-1z" fill="#EF5350"/><circle cx="24" cy="19" r="4.6" fill="#42A5F5"/><circle cx="24" cy="19" r="2.4" fill="#E3F2FD"/><path d="M19 31h10l-1 4H20z" fill="#B0BEC5"/><path d="M24 36l3 7h-6z" fill="#FB8C00"/><path d="M24 39l1.6 4h-3.2z" fill="#FFEB3B"/></svg>' },
  { i:"robot", a:"إِنْسان آلِيّ", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#B2DFDB"/><path d="M24 4v5" stroke="#00897B" stroke-width="2.4" stroke-linecap="round"/><circle cx="24" cy="4.5" r="2.6" fill="#FF7043"/><rect x="10" y="10" width="28" height="21" rx="6" fill="#B0BEC5"/><rect x="14" y="15" width="20" height="11" rx="4" fill="#263238"/><circle cx="19.5" cy="20.5" r="2.6" fill="#4DD0E1"/><circle cx="28.5" cy="20.5" r="2.6" fill="#4DD0E1"/><rect x="14" y="33" width="20" height="10" rx="3" fill="#90A4AE"/><rect x="5" y="34" width="7" height="4" rx="2" fill="#78909C"/><rect x="36" y="34" width="7" height="4" rx="2" fill="#78909C"/><rect x="20" y="36" width="8" height="3" rx="1.5" fill="#FF7043"/></svg>' },
  { i:"uydu", a:"قَمَر صِناعِيّ", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#B3E5FC"/><rect x="19" y="18" width="10" height="14" rx="3" fill="#90A4AE"/><rect x="3" y="20" width="13" height="10" rx="2" fill="#1E88E5"/><rect x="32" y="20" width="13" height="10" rx="2" fill="#1E88E5"/><path d="M3 25h13M32 25h13" stroke="#0D47A1" stroke-width="1.4"/><path d="M24 18v-6" stroke="#607D8B" stroke-width="2.4"/><circle cx="24" cy="9.5" r="3.4" fill="#FFCA28"/><path d="M24 32v5" stroke="#607D8B" stroke-width="2.4"/><ellipse cx="24" cy="39" rx="5" ry="2.6" fill="#78909C"/></svg>' },
  { i:"gezegen", a:"كَوْكَب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#D1C4E9"/><circle cx="24" cy="23" r="12" fill="#7E57C2"/><path d="M14 18a12 12 0 0 1 9-4M18 30a12 12 0 0 0 14-2" stroke="#B39DDB" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="24" cy="27" rx="21" ry="6" fill="none" stroke="#FFB300" stroke-width="3" transform="rotate(-18 24 27)"/><circle cx="40" cy="11" r="1.8" fill="#FFF"/><circle cx="8" cy="38" r="1.5" fill="#FFF"/></svg>' },
  { i:"yildiz", a:"نَجْمَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFF9C4"/><path d="M24 6l5.5 11.2 12.4 1.8-9 8.7 2.2 12.3L24 34.2 12.9 40l2.2-12.3-9-8.7 12.4-1.8z" fill="#FDD835"/><circle cx="19.5" cy="22" r="1.9" fill="#5D4037"/><circle cx="28.5" cy="22" r="1.9" fill="#5D4037"/><path d="M20 27q4 3.5 8 0" stroke="#5D4037" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>' },
  { i:"ay", a:"هِلال", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#B39DDB"/><path d="M30 6a19 19 0 1 0 12 26A19 19 0 0 1 30 6z" fill="#FFF176"/><circle cx="28" cy="18" r="2.6" fill="#FBC02D" opacity=".6"/><circle cx="24" cy="30" r="3.4" fill="#FBC02D" opacity=".5"/><circle cx="12" cy="10" r="1.8" fill="#FFF"/><circle cx="8" cy="20" r="1.4" fill="#FFF"/><circle cx="15" cy="40" r="1.5" fill="#FFF"/></svg>' },
  { i:"ufo", a:"طَبَق طائِر", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#B2EBF2"/><path d="M14 22a10 8 0 0 1 20 0z" fill="#4DD0E1"/><ellipse cx="24" cy="24" rx="18" ry="6" fill="#90A4AE"/><circle cx="13" cy="24" r="1.9" fill="#FFCA28"/><circle cx="24" cy="25" r="1.9" fill="#FF7043"/><circle cx="35" cy="24" r="1.9" fill="#FFCA28"/><path d="M17 29l-5 12h24l-5-12z" fill="#4DD0E1" opacity=".38"/></svg>' },
  { i:"astronot", a:"رائِد فَضاء", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#CFD8DC"/><circle cx="24" cy="20" r="13" fill="#FAFAFA"/><path d="M14 19a10 8 0 0 1 20 0 10 8 0 0 1-20 0z" fill="#263238"/><path d="M17 17a6 4 0 0 1 7-2" stroke="#78909C" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="9" y="16" width="4" height="7" rx="2" fill="#B0BEC5"/><rect x="35" y="16" width="4" height="7" rx="2" fill="#B0BEC5"/><path d="M14 33h20l2 10H12z" fill="#ECEFF1"/><rect x="20" y="36" width="8" height="4" rx="1.6" fill="#FF7043"/></svg>' },
  { i:"kuyruklu", a:"مُذَنَّب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#B3E5FC"/><path d="M4 42l18-18 6 6z" fill="#4FC3F7" opacity=".55"/><path d="M10 42l14-14 4 4z" fill="#29B6F6" opacity=".8"/><circle cx="31" cy="17" r="9" fill="#FFB300"/><circle cx="31" cy="17" r="5.5" fill="#FFE082"/><circle cx="41" cy="8" r="1.7" fill="#FFF"/><circle cx="14" cy="10" r="1.5" fill="#FFF"/></svg>' },
  { i:"teleskop", a:"مِرْقَب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#C5CAE9"/><path d="M8 27l22-12 5 8-22 12z" fill="#5C6BC0"/><path d="M30 15l6-3 5 8-6 3z" fill="#3949AB"/><path d="M14 32l-4 10M22 30l6 12" stroke="#455A64" stroke-width="3" stroke-linecap="round"/><circle cx="41" cy="9" r="1.7" fill="#FFF176"/><circle cx="34" cy="5" r="1.3" fill="#FFF176"/></svg>' }
];
const KRK_TAKIM = [
  { i:"t-yildiz", a:"فَريق النَّجْم", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E3F2FD"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#1565C0"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#42A5F5"/><path d="M24 13l3.4 7 7.6 1.1-5.5 5.3 1.3 7.6L24 30.4l-6.8 3.6 1.3-7.6-5.5-5.3 7.6-1.1z" fill="#FFF176"/></svg>' },
  { i:"t-simsek", a:"فَريق البَرْق", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFF8E1"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#F57F17"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#FFCA28"/><path d="M27 11l-9 13h6l-3 11 10-14h-6z" fill="#FFFDE7"/></svg>' },
  { i:"t-alev", a:"فَريق اللَّهَب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFEBEE"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#B71C1C"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#EF5350"/><path d="M24 11c4 5 8 7 8 13a8 8 0 0 1-16 0c0-4 2-6 4-8 0 3 1 4 2 4 0-4 1-6 2-9z" fill="#FFE082"/></svg>' },
  { i:"t-kupa", a:"فَريق الكَأْس", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#F3E5F5"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#6A1B9A"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#AB47BC"/><path d="M17 12h14v7a7 7 0 0 1-14 0z" fill="#FFD54F"/><path d="M17 14h-3a4 4 0 0 0 4 4M31 14h3a4 4 0 0 1-4 4" stroke="#FFD54F" stroke-width="2" fill="none"/><path d="M22 26h4v5h-4z" fill="#FFD54F"/><path d="M18 31h12v3H18z" fill="#FFD54F"/></svg>' },
  { i:"t-nesir", a:"فَريق النَّسْر", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E0F7FA"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#00695C"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#26A69A"/><path d="M24 14l10 6-6 1 4 4-8-2-8 2 4-4-6-1z" fill="#FFF8E1"/><path d="M24 22v9M20 33h8" stroke="#FFF8E1" stroke-width="2.2" stroke-linecap="round"/></svg>' },
  { i:"t-mihlab", a:"فَريق المِخْلَب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#EFEBE9"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#4E342E"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#8D6E63"/><path d="M17 13c1 6 1 10 0 14M22 12c1 7 1 11 0 15M27 12c-1 7-1 11 0 15M32 13c-1 6-1 10 0 14" stroke="#FFF8E1" stroke-width="3" fill="none" stroke-linecap="round"/></svg>' },
  { i:"t-seyf", a:"فَريق السَّيْف", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#ECEFF1"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#37474F"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#78909C"/><path d="M16 12l16 20M32 12L16 32" stroke="#ECEFF1" stroke-width="3.4" stroke-linecap="round"/><path d="M14 30l4 4M34 30l-4 4" stroke="#FFCA28" stroke-width="3.4" stroke-linecap="round"/></svg>' },
  { i:"t-tac", a:"فَريق التّاج", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFF3E0"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#E65100"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#FB8C00"/><path d="M14 30l-2-15 6 5 6-8 6 8 6-5-2 15z" fill="#FFE082"/><path d="M14 32h20" stroke="#FFE082" stroke-width="3" stroke-linecap="round"/></svg>' },
  { i:"t-dir", a:"فَريق الدِّرْع", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E8EAF6"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#283593"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#5C6BC0"/><path d="M24 12l9 3.5v8c0 5.5-4.2 9-9 11-4.8-2-9-5.5-9-11v-8z" fill="none" stroke="#FFF8E1" stroke-width="2.6"/><path d="M24 18v10M19 23h10" stroke="#FFF8E1" stroke-width="2.6" stroke-linecap="round"/></svg>' },
  { i:"t-wisam", a:"فَريق الوِسام", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FCE4EC"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#AD1457"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#EC407A"/><path d="M18 11l3 8h6l3-8" stroke="#FFF8E1" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="24" cy="27" r="8" fill="#FFD54F"/><circle cx="24" cy="27" r="4.6" fill="#FFF8E1"/></svg>' },
  { i:"t-karn", a:"فَريق القَرْن", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#EDE7F6"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#4527A0"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#7E57C2"/><path d="M13 14c-1 8 4 12 11 12s12-4 11-12" stroke="#FFF8E1" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="24" cy="31" r="4.5" fill="#FFF8E1"/></svg>' },
  { i:"t-sehm", a:"فَريق السَّهْم", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E0F2F1"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#00838F"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#26C6DA"/><path d="M24 11l7 9h-4v14h-6V20h-4z" fill="#FFF8E1"/></svg>' }
];
const KRK_SINIF = [
  { i:"s-madrasa", a:"صَفّ المَدْرَسَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E3F2FD"/><circle cx="24" cy="24" r="19" fill="#1E88E5"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><path d="M24 10l13 7v3H11v-3z" fill="#FFF8E1"/><rect x="13" y="20" width="22" height="14" rx="2" fill="#FFECB3"/><rect x="21" y="25" width="6" height="9" rx="1.4" fill="#1565C0"/><rect x="15.5" y="24" width="4" height="4" rx="1" fill="#1565C0"/><rect x="28.5" y="24" width="4" height="4" rx="1" fill="#1565C0"/></svg>' },
  { i:"s-taharruc", a:"صَفّ التَّخَرُّج", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#EDE7F6"/><circle cx="24" cy="24" r="19" fill="#5E35B1"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><path d="M24 12l14 6-14 6-14-6z" fill="#FFF8E1"/><path d="M15 22v7c0 3 4.5 5 9 5s9-2 9-5v-7" fill="none" stroke="#FFF8E1" stroke-width="2.6"/><path d="M37 19v9" stroke="#FFD54F" stroke-width="2.2" stroke-linecap="round"/><circle cx="37" cy="30" r="2.2" fill="#FFD54F"/></svg>' },
  { i:"s-daftar", a:"صَفّ الدَّفْتَر", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFF3E0"/><circle cx="24" cy="24" r="19" fill="#EF6C00"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><rect x="13" y="11" width="20" height="26" rx="2.6" fill="#FFF8E1"/><path d="M18 17h11M18 22h11M18 27h7" stroke="#EF6C00" stroke-width="1.9" stroke-linecap="round"/><rect x="11" y="11" width="4" height="26" rx="2" fill="#FFB300"/></svg>' },
  { i:"s-sabbura", a:"صَفّ السَّبّورَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E8F5E9"/><circle cx="24" cy="24" r="19" fill="#2E7D32"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><rect x="11" y="12" width="26" height="18" rx="2.4" fill="#1B5E20"/><rect x="13.4" y="14.4" width="21.2" height="13.2" rx="1.4" fill="#388E3C"/><path d="M17 19h9M17 23h13" stroke="#FFF8E1" stroke-width="1.8" stroke-linecap="round"/><path d="M16 30v5M32 30v5" stroke="#8D6E63" stroke-width="2.4" stroke-linecap="round"/></svg>' },
  { i:"s-tuffaha", a:"صَفّ التُّفّاحَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFEBEE"/><circle cx="24" cy="24" r="19" fill="#C62828"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><path d="M24 15c-3-3-11-2-11 7 0 7 5 14 8 14 1.5 0 2-1 3-1s1.5 1 3 1c3 0 8-7 8-14 0-9-8-10-11-7z" fill="#FFCDD2"/><path d="M24 15v-4" stroke="#6D4C41" stroke-width="2.2" stroke-linecap="round"/><path d="M24 13c3-3 6-3 7-2 0 3-3 5-7 4z" fill="#66BB6A"/></svg>' },
  { i:"s-hafila", a:"صَفّ الحافِلَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFFDE7"/><circle cx="24" cy="24" r="19" fill="#F9A825"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><rect x="9" y="15" width="30" height="16" rx="4" fill="#FFF8E1"/><rect x="12" y="18" width="9" height="7" rx="1.6" fill="#4FC3F7"/><rect x="24" y="18" width="9" height="7" rx="1.6" fill="#4FC3F7"/><circle cx="16" cy="32" r="3.4" fill="#37474F"/><circle cx="32" cy="32" r="3.4" fill="#37474F"/><rect x="9" y="27" width="30" height="2.6" fill="#F57F17"/></svg>' },
  { i:"s-jaras", a:"صَفّ الجَرَس", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFF8E1"/><circle cx="24" cy="24" r="19" fill="#FFA000"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><path d="M24 11a10 10 0 0 1 10 10v7l3 4H11l3-4v-7a10 10 0 0 1 10-10z" fill="#FFF8E1"/><circle cx="24" cy="35" r="3.2" fill="#FFF8E1"/><path d="M24 8v3" stroke="#FFF8E1" stroke-width="2.4" stroke-linecap="round"/></svg>' },
  { i:"s-kura", a:"صَفّ الكُرَة الأَرْضِيَّة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E0F7FA"/><circle cx="24" cy="24" r="19" fill="#00838F"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><circle cx="24" cy="23" r="12" fill="#4DD0E1"/><path d="M12 23h24M24 11c4 5 4 19 0 24M24 11c-4 5-4 19 0 24" stroke="#00695C" stroke-width="1.8" fill="none"/><path d="M24 35v4M18 39h12" stroke="#FFF8E1" stroke-width="2.4" stroke-linecap="round"/></svg>' },
  { i:"s-mijhar", a:"صَفّ المِجْهَر", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#F3E5F5"/><circle cx="24" cy="24" r="19" fill="#7B1FA2"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><path d="M27 11l6 4-9 13-6-4z" fill="#FFF8E1"/><path d="M18 24l6 4-3 4-6-4z" fill="#E1BEE7"/><path d="M14 34h20" stroke="#FFF8E1" stroke-width="2.8" stroke-linecap="round"/><path d="M20 34c-3-4-2-9 2-11" stroke="#FFF8E1" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>' },
  { i:"s-alwan", a:"صَفّ الأَلْوان", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FCE4EC"/><circle cx="24" cy="24" r="19" fill="#D81B60"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><path d="M24 11c8 0 14 5 14 11 0 4-3 5-6 5h-3c-2 0-3 1-3 3s1 2 1 3-1 2-3 2c-8 0-14-6-14-13S16 11 24 11z" fill="#FFF8E1"/><circle cx="18" cy="19" r="2.2" fill="#EF5350"/><circle cx="25" cy="17" r="2.2" fill="#42A5F5"/><circle cx="31" cy="21" r="2.2" fill="#66BB6A"/><circle cx="17" cy="27" r="2.2" fill="#FFCA28"/></svg>' },
  { i:"s-midad", a:"صَفّ المِعْداد", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E8EAF6"/><circle cx="24" cy="24" r="19" fill="#3949AB"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><rect x="11" y="12" width="26" height="24" rx="3" fill="none" stroke="#FFF8E1" stroke-width="2.6"/><path d="M11 20h26M11 28h26" stroke="#FFF8E1" stroke-width="1.8"/><circle cx="17" cy="16" r="2.6" fill="#FF7043"/><circle cx="24" cy="16" r="2.6" fill="#FFCA28"/><circle cx="19" cy="24" r="2.6" fill="#4DD0E1"/><circle cx="30" cy="24" r="2.6" fill="#66BB6A"/><circle cx="22" cy="32" r="2.6" fill="#EC407A"/><circle cx="31" cy="32" r="2.6" fill="#FFF8E1"/></svg>' },
  { i:"s-kutub", a:"صَفّ الكُتُب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E0F2F1"/><circle cx="24" cy="24" r="19" fill="#00695C"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><rect x="11" y="28" width="26" height="6" rx="1.6" fill="#FFF8E1"/><rect x="13" y="21" width="22" height="6" rx="1.6" fill="#FFD54F"/><rect x="15" y="14" width="18" height="6" rx="1.6" fill="#FF8A65"/><path d="M11 31h26M13 24h22M15 17h18" stroke="#00695C" stroke-width="1.2" opacity=".45"/></svg>' }
];

function krkSeti(mod){
  return mod === "takim" ? KRK_TAKIM : (mod === "okul" ? KRK_SINIF : KRK_BIREY);
}
function krkBul(id){
  if (!id) return null;
  const hepsi = KRK_BIREY.concat(KRK_TAKIM, KRK_SINIF);
  for (let i = 0; i < hepsi.length; i++) if (hepsi[i].i === id) return hepsi[i];
  return null;
}
function krkAd(id){ const k = krkBul(id); return k ? k.a : ""; }
/* Avatari isim yanina koymak icin: krkSvg("kedi", "biy-krk-mini") */
function krkSvg(id, ek){
  const k = krkBul(id);
  if (!k) return "";
  return '<span class="biy-krk ' + (ek || "") + '" title="' + k.a + '" aria-hidden="true">' + k.s + '</span>';
}

const SEVIYE_ZORLUK = { kolay: 1, orta: 2, zor: 3 };

/* ---------------- Konular ----------------
   Yeni konu eklemek için bu diziye bir nesne ekleyin:
   { id: "benzersiz-id", ad: "Konu Adı", pdf: "PDF dosya adı.pdf", sorular: [ ...soru nesneleri... ] }
   • pdf: repo kökündeki PDF dosyasının adı (boş bırakılırsa indirme/önizleme pasif olur).
   • sorular: SORULAR ile aynı biçimde; boşsa o konuda yarışma başlatılamaz.
   NOT: Soru id'leri aynı konu içinde benzersiz olmalıdır (birleşik konu da dâhil).      */
/* (eski KONULAR tanimi kaldirildi — veri yukarida) */
/* ---- Konu siniflandirmasi ----
   sinif: 5..10, 0 = Genel (tum siniflar) · seviye: 1 Temel, 2 Orta, 3 İleri
   Liste ve havuz BASITTEN ZORA bu bilgiyle dizilir.
   ⚠️ TEK KAYNAK: harita artik sistem/sinifveri.js icinde durur; index.html
   de ayni dosyayi okuyup "bu sinifta bilgi yarismasi var mi?" diye sorar.
   Boylece yeni sinif eklerken tek dosya degisir. */
const KONU_BILGI = (window.KidefSinifVeri && window.KidefSinifVeri.biyKonu) || {};
KONULAR.forEach(k => Object.assign(k, KONU_BILGI[k.id] || { sinif: 0, seviye: 2, sira: 9 }));
/* Once SINIF konulari (5→10), sonra GENEL konular (seviye/sira ile).
   Sinif konusunda kelime+cumle birlikte oldugu icin seviye basligi altina
   girmezler; kendi baslik gruplari vardir. */
KONULAR.sort((a, b) => {
  const as = +a.sinif || 0, bs = +b.sinif || 0;
  if (!as !== !bs) return as ? -1 : 1;
  if (as && bs && as !== bs) return as - bs;
  return (a.seviye - b.seviye) || (a.sira - b.sira) || a.ad.localeCompare(b.ad, "tr");
});
/* Suzgec cipleri: elle liste yok, veride hangi sinif varsa o cikar */
const BIY_SINIFLAR = (function () {
  const g = {}, c = [];
  KONULAR.forEach(k => { const n = +k.sinif || 0; if (n > 0 && !g[n]) { g[n] = 1; c.push(n); } });
  return c.sort((a, b) => a - b);
})();
const SEVIYE_BASLIK = { 1: "Temel · Alfabe ve Kelimeler", 2: "Orta · Cümleler ve Kalıplar", 3: "İleri · Sarf ve Dilbilgisi" };
/* Sinif konulari tek baslik altinda toplanir (kelime + cumle ayrimi yok) */
const SINIF_BASLIK = "Sınıflar · kelime ve cümleler bir arada";

/* ===================================================================
   ÜNİTE UYUM KATMANI (çevrimdışı modül için)
   -------------------------------------------------------------------
   cevrimdisi.js dersleri "ünite" başlıkları altında gruplar. ka.com'da
   ünite kavramı yok; ama listeler ZATEN dört küme hâlinde gösteriliyor:
   Sınıflar + üç seviye. Bu dört küme burada ünite yerine geçiyor, böylece
   çevrimdışı modülün 3300 satırlık kodunda tek satır değiştirmeye gerek
   kalmıyor. Ünite adları Türkçe olduğu için cevrimdisi.js'teki UNITE_TR
   sözlüğü boş bırakıldı; adlar doğrudan buradan okunuyor.
   =================================================================== */
const UNITELER = [
  { no: 1, ad: "Sınıflar",  alt: "kelime ve cümleler bir arada" },
  { no: 2, ad: "Temel",     alt: "Alfabe ve Kelimeler" },
  { no: 3, ad: "Orta",      alt: "Cümleler ve Kalıplar" },
  { no: 4, ad: "İleri",     alt: "Sarf ve Dilbilgisi" }
];
/* Her listeye kümesinin numarası yazılır: sınıf listeleri 1, seviye 1/2/3
   olanlar sırasıyla 2/3/4. */
KONULAR.forEach(k => { k.unite = k.sinif ? 1 : (1 + (Math.min(3, Math.max(1, +k.seviye || 1)))); });
/* ka.com dosyası tek; kilit yok, dört küme de görünür. */
function gorunurUniteNolar(){ return [1, 2, 3, 4]; }
function kapsamTumKonu(){ return null; }
function uniteAdiTr(no){ const u = UNITELER.find(x => x.no === no); return u ? (u.ad + " · " + u.alt) : ""; }
/* ---------------------------------------------------------------------
   "HEPSİ" — konu listesinin en ustundeki SANAL baslik.
   Gercek bir KONULAR kaydi degildir; secilince butun konularin sorulari
   tek liste gibi davranir. Eskiden listenin tepesinde duran sabit
   «Hepsi 7 9 10» sinif cipleri kaldirildi; yerini bu satir aldi.
   --------------------------------------------------------------------- */
const HEPSI_ID = "__hepsi";


/* ---------------- Biçime göre HTML üreticileri ---------------- */
// Önizleme / sınıf modu kartlarındaki "şıklar" alanı.
function sikKartHtml(s, dogruGoster){
  const b = bicimAl(s);
  if (testGibiMi(b)){
    let h = "";
    (s.secenekler || []).forEach((sec, i) => {
      const dogruMu = dogruGoster && i === s.dogru;
      // Yon sik metnine gore: Arapca harf varsa RTL, yoksa (Turkce cevap) LTR
      const sAr = arMi(sec);
      const sinif = "biy-secenek" + (dogruMu ? " dogru" : "") + (sAr ? " biy-arapca-secenek" : "");
      h += '<div class="'+sinif+'"><span class="biy-sik">'+String.fromCharCode(65+i)+'</span><span class="biy-secenek-metin'+(sAr?'':' biy-ltr')+'">'+kacis(sec)+'</span></div>';
    });
    return h;
  }
  const bb = BICIM_BILGI[b] || { ad: b, emoji: "❓" };
  const govde = dogruGoster ? dogruCevapMetni(s) : ("Soru · " + bb.ad);
  return '<div class="biy-secenek'+(dogruGoster?' dogru':'')+' biy-arapca-secenek biy-bicim-kutu">' +
         '<span class="biy-sik">'+bb.emoji+'</span><span class="biy-secenek-metin">'+kacis(govde)+'</span></div>';
}
/* Yazma sorusunun DOĞRU cevabında kelimeyi oluşturan her harfi hem yalın
   hâliyle hem de kelimedeki BİTİŞİK (bağlı) biçimiyle gösterir. Öğrenci hangi
   harfin başta/ortada/sonda nasıl şekil değiştirdiğini görsün diye.
   Bitişik biçim, harfi ZWJ (U+200D) ile sararak taklit edilir; ekstra font
   gerekmez. Harekeler ve tatvil, bağlanma hesabında saydam kabul edilir. */
const _AR_HAREKE = /[ً-ٰٕـ]/g;   // hareke/tenvin/sedde/sukun + ust elif + tatvil
const _AR_SOLA_BAGLANMAZ = "اأإآٱدذرزوؤةءى"; // sola baglanmaz: a e i vs.
function _arHarfMi(ch){ return /[ء-يٱ]/.test(ch); }
function _arBaglanirSonraki(ch){ return _arHarfMi(ch) && _AR_SOLA_BAGLANMAZ.indexOf(ch) < 0; }
function arapcaBirlesikHtml(kelime){
  // Kelimeyi oluşturan harfler kutularda YALIN (normal) hâlleriyle gösterilir —
  // başta/ortada/sonda bitişik biçimler DEĞİL. Kelimenin bütün (bitişik) hâli
  // ayrıca büyük punto ile cevap çubuğunda zaten görünür.
  const harfler = String(kelime || "").replace(_AR_HAREKE, "").split("").filter(_arHarfMi);
  if (harfler.length < 2) return "";
  const hucreler = harfler.map(ch =>
    '<span class="biy-yh-hucre"><b class="biy-yh-bic">'+ch+'</b></span>'
  ).join("");
  return '<div class="biy-yazi-harfler" dir="rtl" aria-label="Kelimenin harfleri (yalın)">'+hucreler+'</div>';
}
// Yansıtılan admin tahtasındaki soru gövdesi (cevap fazı ve sonuç ekranı).
function tahtaIcerikHtml(soru, sonucMu){
  const b = bicimAl(soru);
  if (testGibiMi(b)){
    let h = "";
    (soru.secenekler || []).forEach((sec, i) => {
      const dogru = sonucMu && i === soru.dogru;
      h += '<div class="biy-a-opt'+(dogru?' dogru':'')+(arMi(sec)?' ar':' biy-ltr')+'" style="--c:'+SIK_RENK[i % SIK_RENK.length]+'">' +
           '<span class="biy-a-harf">'+String.fromCharCode(65+i)+'</span><span class="biy-a-metin">'+kacis(sec)+'</span>' +
           (dogru?'<span class="biy-a-tik">✓</span>':'') + '</div>';
    });
    return h;
  }
  if (siraGibiMi(b)){
    const dizi = sonucMu ? (soru.parcalar || []) : (soru.karisik || soru.parcalar || []);
    return '<div class="biy-a-dizi'+(sonucMu?' dogru':'')+'">' +
      dizi.map(p => '<span class="biy-a-parca">'+kacis(p)+'</span>').join("") + '</div>' +
      (sonucMu ? '<div class="biy-a-cevapcubuk">✓ '+kacis((soru.parcalar||[]).join(" "))+'</div>' : '');
  }
  if (b === "eslestir"){
    const c = soru.ciftler || [];
    if (sonucMu){
      return '<div class="biy-a-cift dogru">' +
        c.map(x => '<div class="biy-a-cift-satir"><span class="biy-a-sol'+(arMi(x[0])?' ar':'')+'">'+kacis(x[0])+'</span><span class="biy-a-ok">→</span><span class="biy-a-sag'+(arMi(x[1])?' ar':'')+'">'+kacis(x[1])+'</span></div>').join("") +
      '</div>';
    }
    const sol = soru.sollar || c.map(x => x[0]);
    const sag = soru.sagKarisik || karistir(c.map(x => x[1]));
    return '<div class="biy-a-cift">' +
      '<div class="biy-a-sutun">'+sol.map(x => '<span class="biy-a-sol'+(arMi(x)?' ar':'')+'">'+kacis(x)+'</span>').join("")+'</div>' +
      '<div class="biy-a-sutun">'+sag.map(x => '<span class="biy-a-sag'+(arMi(x)?' ar':'')+'">'+kacis(x)+'</span>').join("")+'</div>' +
    '</div>';
  }
  if (b === "yazma"){
    const tus = soru.tusKarisik || soru.tuslar || [];
    return '<div class="biy-a-tuslar">'+tus.map(t => '<span class="biy-a-tus">'+kacis(t)+'</span>').join("")+'</div>' +
      (sonucMu ? '<div class="biy-a-cevapcubuk">✓ '+kacis(soru.cevapYazi||"")+'</div>' + arapcaBirlesikHtml(soru.cevapYazi) : '');
  }
  return "";
}
/* ---------------- Durum ---------------- */
const state = {
  mod: null, uid: null,
  sureler: sureOku(),        // {1,2,3} zorluğa göre saniye (localStorage'dan)
  turSureleri: {},           // soruIndex → o soruya verilen süre (puan hesabı için sabit)
  bicimSecim: { "test": true, "surukle": true, "eslestir": true, "yazma": true, "bosluk": true, "dogruyanlis": true, "cumlesira": true },
  /* Zorluk seçimi — soru tipi seçimiyle aynı mantık: kapalı olan zorluktaki
     sorular tura hiç girmez. Havuz penceresinde ayrı bir süzgeç yoktu artık;
     seçim ana ekranda, süre ve soru tipi düğmelerinin yanında yapılıyor. */
  zorlukSecim: { 1: true, 2: true, 3: true },
  /* Üçüncü eksen: soru İÇERİĞİ (ne soruluyor). Anahtarlar TIP_BILGI'den;
     hepsi açık başlar, kapatılanın soruları havuzda soluk görünür. */
  icerikSecim: (function(){ const o = {}; ICERIK_SIRA.forEach(k => o[k] = true); return o; })(),
  /* --- çevrimdışı modülün beklediği alanlar (ünite uyum katmanı) --- */
  uniteNo: 1,          // açık küme
  uniteAcik: null,     // akordiyonda açık olan küme
  uniteKilit: null,    // ka.com'da kilit yok
  /* Çevrimdışı elle puanlama ayarları; canlı modda kullanılmaz. */
  puanlama: { yon: "esit", dogru: 10, kolay: 10, orta: 20, zor: 30, yanlisAc: false, yanlis: 0 },
  oyunModu: "takim",         // takim | birey | okul  (yarışma biçimi)
  bekleyenListe: [],         // birey modu: onay bekleyen katılımcılar
  katilimId: null,           // öğrenci tarafı: kendi katılımcı kaydının id'si
  katilimAbone: null,        // öğrenci tarafı: kendi kaydını dinleyen abonelik
  katilBagli: false,         // takimBagla bir kez çalıştı mı
  atildiMi: false,           // öğretmen bu cihazı yarışmadan çıkardı mı (kalıcı bayrak)
  takimNabiz: null,          // öğrenci tarafı: "hâlâ buradayım" zamanlayıcısı
  konuId: null,              // seçili konu (açılışta seçili değil)
  acilisSinif: 0,            // index'teki sınıf kartından "?sinif=N" ile gelindiyse
  acilisKonu: null,          // "?konu=id" ile gelindiyse
  acilisUygulandi: false,    // açılış seçimi bir kez uygulanır
  seviye: null,              // kolay | orta | zor  (başta seçili değil)
  sorularZ: 1,               // Sorular önizleme sekmesi (zorluk)
  soruGizli: true,           // admin ekranında soruyu gizle/göster (açılışta gizli)
  iptalModu: false,          // sonuç ekranında iptal/geri al düğmeleri görünsün mü (sadece görünüm)
  raporAcik: {},             // final ekranı detaylı raporunda açık akordiyonlar { anahtar: true }
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
  calisma: null,             // takım: yarım kalan cevap { index, yerlesim, secili, yazi }
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
  cevapGeldi(){ this._cal([{f:880,t:0,d:0.08},{f:1175,t:0.06,d:0.11}], 0.10); },                       // bir cevap geldi: kısa blip
  hepsiCevap(){ this._cal([{f:523,t:0,d:0.11},{f:659,t:0.09,d:0.11},{f:784,t:0.18,d:0.20}], 0.13); },  // tümü cevapladı: do-mi-sol
  sonuc(){ this._cal([{f:392,t:0,d:0.14},{f:587,t:0.12,d:0.24}], 0.15); },                              // sonuç ekranı açıldı
  siraDegisti(){ this._cal([{f:494,t:0,d:0.10},{f:740,t:0.08,d:0.10},{f:988,t:0.16,d:0.20}], 0.12); }   // sıralama değişti: hızlı yükseliş
};
// ilk kullanıcı hareketinde ses bağlamını aç (tarayıcı otomatik oynatma kısıtı)
["pointerdown","keydown","touchstart"].forEach(ev => window.addEventListener(ev, () => SES._ac(), { passive: true }));
// Etiket rozetine dokununca adi kucuk bir balonda goster (tablette tooltip yok).
document.addEventListener("click", function(e){
  const eski = document.querySelector(".biy-et-balon");
  if (eski) eski.remove();
  const et = e.target.closest && e.target.closest(".biy-etiket");
  if (!et) return;
  const ad = et.getAttribute("title"); if (!ad) return;
  const b = document.createElement("div");
  b.className = "biy-et-balon"; b.textContent = ad;
  const r = et.getBoundingClientRect();
  b.style.left = (r.left + r.width / 2) + "px";
  b.style.top = (r.bottom + 8) + "px";
  document.body.appendChild(b);
  setTimeout(() => { if (b.parentNode) b.remove(); }, 1800);
});


/* ---------------- Yardımcılar ---------------- */
function $(id){ return document.getElementById(id); }
function ekranGoster(id){
  document.querySelectorAll(".biy-ekran").forEach(e => e.classList.add("gizli"));
  const el = $(id); if (el) el.classList.remove("gizli");
  // çıkış tuşu yalnızca canlı oyun ekranında görünür
  const cik = $("cikisTus"); if (cik) cik.classList.toggle("gizli", id !== "ekranOyunAdmin");
  // ekran değişince header her zaman görünür başlasın
  if (el){ const h = el.querySelector(".biy-header"); if (h) h.classList.remove("biy-header--gizli"); }
  _headerKaydirSifirla();
}
/* Aşağı kaydırınca header gizlenir, yukarı kaydırınca geri gelir — soruya daha çok alan. */
let _hkSonY = 0, _hkBekliyor = false;
function _headerKaydirSifirla(){ _hkSonY = window.scrollY || document.documentElement.scrollTop || 0; }
function _headerKaydirGuncelle(){
  _hkBekliyor = false;
  const h = document.querySelector(".biy-ekran:not(.gizli) .biy-header");
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  if (!h){ _hkSonY = y; return; }
  const fark = y - _hkSonY;
  if (y <= 4){ h.classList.remove("biy-header--gizli"); _hkSonY = y; return; }
  if (Math.abs(fark) < 6){ _hkSonY = y; return; }
  if (fark > 0 && y > h.offsetHeight) h.classList.add("biy-header--gizli");
  else if (fark < 0) h.classList.remove("biy-header--gizli");
  _hkSonY = y;
}
window.addEventListener("scroll", () => {
  if (_hkBekliyor) return;
  _hkBekliyor = true;
  requestAnimationFrame(_headerKaydirGuncelle);
}, { passive: true });

/* Soru havuzu (tam ekran) kendi kaydırma alanına sahip: liste aşağı kaydırılınca
   havuz başlığı daralarak gizlenir, yukarı kaydırılınca geri açılır. */
function _havuzBaslikKaydir(ov){
  const liste = ov.querySelector("#soruSecListe");
  const bas   = ov.querySelector(".biy-soru-sec-bas");
  if (!liste || !bas) return;
  // Başlık akıştan çıkarıldığı için listeye onun yüksekliği kadar üst boşluk ver.
  const payVer = () => { liste.style.paddingTop = Math.round(bas.getBoundingClientRect().height) + "px"; };
  payVer();
  if (window.ResizeObserver){ try { new ResizeObserver(payVer).observe(bas); } catch(e){} }
  let sonY = 0, bekliyor = false;
  const guncelle = () => {
    bekliyor = false;
    const y = liste.scrollTop, fark = y - sonY;
    if (y <= 4){ bas.classList.remove("biy-header--gizli"); sonY = y; return; }
    if (Math.abs(fark) < 6){ sonY = y; return; }
    if (fark > 0) bas.classList.add("biy-header--gizli");
    else bas.classList.remove("biy-header--gizli");
    sonY = y;
  };
  liste.addEventListener("scroll", () => {
    if (bekliyor) return;
    bekliyor = true;
    requestAnimationFrame(guncelle);
  }, { passive: true });
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
/* Birey/Okul modunda tek bir bağlantı herkese yeter: takım parametresi yok. */
function odaLinki(oda){
  return location.origin + location.pathname + "?oda=" + encodeURIComponent(oda);
}
/* ---- Yarışma modları ----
   takim : öğretmen takım adlarını yazar, her takım kendi karekodunu okutur (eski davranış)
   birey : tek karekod, herkes kendi adını yazar, öğretmen onaylar
   okul  : tek karekod, öğrenci adını yazar + sınıfını seçer, sınıflar ORTALAMA puanla yarışır  */
const MOD_BILGI = {
  takim: { ad: "Takımlar Arası Bilgi Yarışması", emoji: "👥", kisi: "Takım", cog: "takım",      baslik: "Takım Oluştur & Lobi" },
  birey: { ad: "Öğrenciler Arası Bilgi Yarışması", emoji: "🙋", kisi: "Katılımcı",  cog: "katılımcı", baslik: "Katılımcılar & Lobi" },
  okul:  { ad: "Sınıflar Arası Bilgi Yarışması",  emoji: "🏫", kisi: "Sınıf", cog: "sınıf",      baslik: "Sınıf Oluştur & Lobi" }
};
function modAl(){ return MOD_BILGI[state.oyunModu] ? state.oyunModu : "takim"; }
function tekKarekod(){ return modAl() === "birey"; }   // yalnız birey: tek ortak karekod
function kartliMod(){ return modAl() !== "birey"; }    // takım & okul: her katılımcıya ayrı karekod
function kisiSozu(){ return (MOD_BILGI[modAl()] || MOD_BILGI.takim).kisi; }
function cogSozu(){ return (MOD_BILGI[modAl()] || MOD_BILGI.takim).cog; }

/* ---- Ozel SVG simgeleri (emoji yerine) ------------------------------- */
const SIMGELER = {
  "⏳": '<circle class="biy-hale" cx="32" cy="32" r="27" fill="url(#biyGrTuruncu)" opacity=".14"/>' +
    '<g class="biy-sv-kum" fill="none" stroke="url(#biyGrTuruncu)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M20 12h24M20 52h24"/><path d="M22 12v6l10 14 10-14v-6"/><path d="M22 52v-6l10-14 10 14v6"/></g>' +
    '<circle class="biy-sv-tane" cx="32" cy="33" r="2.6" fill="url(#biyGrTuruncu)"/>',
  "✅": '<circle class="biy-hale" cx="32" cy="32" r="27" fill="url(#biyGrYesil)" opacity=".18"/>' +
    '<circle cx="32" cy="32" r="21" fill="none" stroke="url(#biyGrYesil)" stroke-width="3.5" class="biy-sv-halka"/>' +
    '<path class="biy-sv-tik" d="M21 33l8 8 15-16" fill="none" stroke="url(#biyGrYesil)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>',
  "❌": '<circle class="biy-hale" cx="32" cy="32" r="27" fill="#ef4444" opacity=".14"/>' +
    '<circle cx="32" cy="32" r="21" fill="none" stroke="#ef4444" stroke-width="3.5"/>' +
    '<g class="biy-sv-carpi" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round"><line x1="24" y1="24" x2="40" y2="40"/><line x1="40" y1="24" x2="24" y2="40"/></g>',
  "⚠️": '<circle class="biy-hale" cx="32" cy="32" r="27" fill="url(#biyGrTuruncu)" opacity=".16"/>' +
    '<path d="M32 12 55 52H9z" fill="none" stroke="url(#biyGrTuruncu)" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<g class="biy-sv-uyari" stroke="url(#biyGrTuruncu)" stroke-width="4" stroke-linecap="round"><line x1="32" y1="27" x2="32" y2="38"/><line x1="32" y1="45" x2="32" y2="45"/></g>',
  "🎉": '<circle class="biy-hale" cx="32" cy="32" r="27" fill="url(#biyGrMor)" opacity=".16"/>' +
    '<path d="M14 52 30 20l14 14z" fill="url(#biyGrMor)" opacity=".85"/>' +
    '<g class="biy-sv-serpme" stroke-linecap="round" stroke-width="3.5">' +
      '<line x1="44" y1="14" x2="49" y2="9" stroke="#f59e0b"/><line x1="50" y1="24" x2="57" y2="23" stroke="#10b981"/>' +
      '<line x1="38" y1="9" x2="39" y2="3" stroke="#ef4444"/><line x1="52" y1="34" x2="58" y2="37" stroke="#3b82f6"/></g>',
  "🏅": '<circle class="biy-hale" cx="32" cy="32" r="27" fill="url(#biyGrTuruncu)" opacity=".16"/>' +
    '<g class="biy-sv-kurdele"><path d="M22 8l8 18-8 4-4-16z" fill="url(#biyGrMavi)"/><path d="M42 8l-8 18 8 4 4-16z" fill="url(#biyGrMor)"/></g>' +
    '<circle class="biy-sv-madalya" cx="32" cy="42" r="14" fill="url(#biyGrTuruncu)"/>' +
    '<circle cx="32" cy="42" r="9" fill="none" stroke="#fff" stroke-width="2.5" opacity=".85"/>',
  "🏁": '<circle class="biy-hale" cx="32" cy="32" r="27" fill="url(#biyGrMavi)" opacity=".14"/>' +
    '<line x1="18" y1="10" x2="18" y2="54" stroke="url(#biyGrMavi)" stroke-width="3.5" stroke-linecap="round"/>' +
    '<g class="biy-sv-bayrak"><rect x="18" y="12" width="28" height="20" fill="url(#biyGrMavi)" opacity=".25"/>' +
      '<rect x="18" y="12" width="7" height="10" fill="url(#biyGrMavi)"/><rect x="32" y="12" width="7" height="10" fill="url(#biyGrMavi)"/>' +
      '<rect x="25" y="22" width="7" height="10" fill="url(#biyGrMavi)"/><rect x="39" y="22" width="7" height="10" fill="url(#biyGrMavi)"/></g>',
  "📺": '<circle class="biy-hale" cx="32" cy="32" r="27" fill="url(#biyGrMavi)" opacity=".14"/>' +
    '<rect x="10" y="20" width="44" height="30" rx="4" fill="none" stroke="url(#biyGrMavi)" stroke-width="3.5"/>' +
    '<path d="M22 12l10 8 10-8" fill="none" stroke="url(#biyGrMavi)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<rect class="biy-sv-parlama" x="14" y="24" width="10" height="22" fill="#fff" opacity=".5"/>',
  "✋": '<circle class="biy-hale" cx="32" cy="32" r="27" fill="#ef4444" opacity=".14"/>' +
    '<g class="biy-sv-el" fill="none" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M24 30V14M32 30V10M40 30V14"/><path d="M18 30v10a16 16 0 0 0 16 16h2a12 12 0 0 0 12-12V24"/></g>',
  "🚪": '<circle class="biy-hale" cx="32" cy="32" r="27" fill="url(#biyGrMor)" opacity=".14"/>' +
    '<rect x="16" y="10" width="32" height="44" rx="3" fill="none" stroke="url(#biyGrMor)" stroke-width="3.5"/>' +
    '<circle class="biy-sv-kol" cx="40" cy="33" r="2.8" fill="url(#biyGrMor)"/>',
  "🏆": '<circle class="biy-hale" cx="32" cy="32" r="27" fill="url(#biyGrTuruncu)" opacity=".18"/>' +
    '<path class="biy-sv-kupa" d="M22 10h20v14a10 10 0 0 1-20 0z" fill="url(#biyGrTuruncu)"/>' +
    '<path d="M22 14h-6a6 6 0 0 0 6 6M42 14h6a6 6 0 0 1-6 6" fill="none" stroke="url(#biyGrTuruncu)" stroke-width="3" stroke-linecap="round"/>' +
    '<rect x="29" y="34" width="6" height="10" fill="url(#biyGrTuruncu)"/><rect x="20" y="44" width="24" height="6" rx="2" fill="url(#biyGrTuruncu)"/>' +
    '<g class="biy-sv-parilti" fill="#fff"><circle cx="16" cy="26" r="2"/><circle cx="49" cy="30" r="1.6"/><circle cx="45" cy="8" r="1.6"/></g>'
};
function simge(e){
  const ic = SIMGELER[e];
  if (!ic) return e;
  return '<span class="biy-anim"><svg viewBox="0 0 64 64" class="biy-svg" aria-hidden="true">' + ic + '</svg></span>';
}


/* ---- Uygunsuz isim süzgeci ----
   Öğrenci kendi ismini yazdığı için basit bir denetim gerekiyor. Aşağıdaki liste
   yalnızca ilk süzgeç; son söz her zaman öğretmende (onay + düzelt + çıkar).     */
const YASAK_TAM = ["am","aq","mk","amk","ock","oc","göt","got","sik","sok","mal","bok","döl","dol",
  "piç","pic","31","otuzbir","ibne","ipne","seks","sex","salak","aptal","hıyar","hiyar","eşek","esek",
  "gerizekali","gerizekalı","şerefsiz","serefsiz","yavşak","yavsak","oç"];
const YASAK_PARCA = ["orospu","oruspu","orspu","kahpe","pezevenk","gavat","yarrak","yarak","siktir","sikey",
  "sikik","sikim","amina","amına","amcık","amcik","anani","ananı","ananin","götver","gotver","göddd",
  "puşt","pust","kaltak","sürtük","surtuk","dallama","porno","penis","vajina","taşak","tasak","boktan",
  "sperm","mastur","pezo","kancık","kancik","fuck","shit","bitch","pussy","dick","nigg"];
function isimNormal(t){
  let s = String(t || "").toLocaleLowerCase("tr");
  s = s.replace(/[0o]/g,"o").replace(/1|!|\|/g,"i").replace(/3/g,"e").replace(/4/g,"a")
       .replace(/5|\$/g,"s").replace(/7/g,"t").replace(/@/g,"a").replace(/8/g,"b");
  s = s.replace(/[^a-zçğıöşü ]+/g," ");
  s = s.replace(/(.)\1{2,}/g,"$1$1");          // aaaa -> aa
  return s.replace(/\s+/g," ").trim();
}
function isimTemizle(t){
  return String(t || "").replace(/\s+/g," ").trim().slice(0, 18);
}
/* uygunsa "" döner, değilse kullanıcıya gösterilecek sebebi döner */
function isimSorunu(ad){
  const ham = isimTemizle(ad);
  if (ham.length < 2) return "Adını en az iki harfle yaz.";
  if (!/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(ham)) return "İsimde harf olmalı.";
  const n = isimNormal(ham);
  const kelimeler = n.split(" ").filter(Boolean);
  for (const k of kelimeler){ if (YASAK_TAM.indexOf(k) >= 0) return "Bu isim uygun değil; gerçek adını yaz."; }
  const bitisik = n.replace(/ /g,"");
  for (const p of YASAK_PARCA){ if (bitisik.indexOf(p) >= 0) return "Bu isim uygun değil; gerçek adını yaz."; }
  return "";
}
/* aynı isimden ikinci kişi gelirse "Ahmet (2)" yapılır */
function isimBenzersiz(ad, mevcutAdlar){
  const kucuk = a => String(a||"").toLocaleLowerCase("tr").trim();
  const set = new Set((mevcutAdlar||[]).map(kucuk));
  if (!set.has(kucuk(ad))) return ad;
  let i = 2; while (set.has(kucuk(ad + " (" + i + ")")) && i < 40) i++;
  return ad + " (" + i + ")";
}
function temizSoru(s){  // takıma gidecek hâli — DOĞRU CEVAP YOK
  const b = bicimAl(s);
  const o = { tip: s.tip, bicim: b, zorluk: s.zorluk, soru: s.soru, arapca: s.arapca || null };
  if (siraGibiMi(b)){
    o.karisik = s.karisik || karistir(s.parcalar);
  } else if (b === "eslestir"){
    o.sollar     = s.sollar     || (s.ciftler || []).map(c => c[0]);
    o.sagKarisik = s.sagKarisik || karistir((s.ciftler || []).map(c => c[1]));
  } else if (b === "yazma"){
    o.tusKarisik = s.tusKarisik || karistir(s.tuslar);
    o.harfSayi   = String(s.cevapYazi || "").replace(/\s+/g, "").length;
  } else {
    o.secenekler = s.secenekler;
    o.arSecenek  = !!s.arSecenek;
  }
  return o;
}
function soruHazirla(s){  // biçime göre karıştırma (doğru cevap hep aynı yerde olmasın)
  if (s && s.sabitSira) return Object.assign({}, s);   // sabit sıralı set (ör. Maarif 50 soruluk test): şıklar karıştırılmaz
  const b = bicimAl(s);
  if (siraGibiMi(b)){
    const p = s.parcalar || [];
    let k = karistir(p);
    if (p.length > 1 && k.join("|") === p.join("|")) k = k.slice().reverse();
    return Object.assign({}, s, { karisik: k });
  }
  if (b === "eslestir"){
    const c = karistir(s.ciftler || []);
    let sag = karistir(c.map(x => x[1]));
    if (c.length > 1 && sag.join("|") === c.map(x => x[1]).join("|")) sag = sag.slice().reverse();
    return Object.assign({}, s, { ciftler: c, sollar: c.map(x => x[0]), sagKarisik: sag });
  }
  if (b === "yazma"){
    return Object.assign({}, s, { tusKarisik: karistir(s.tuslar || []) });
  }
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
      BIY._onay("Çıkıyor musun?", "Bağlı cihazlar var — çıkarsan bağlantıları kopar.", "Evet, çık", function(){ BIY._geriCik(); });
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
    /* kidefarapca.com: bu sayfa index.html'den YENI SEKMEDE aciliyor
       (target="_blank" rel="opener"). Ilk sayfadaki geri tusu:
       - yeni sekmede acildiysa index sekmesine odaklan ve BU SEKMEYI KAPAT
       - kapatmaya izin verilmezse / dogrudan acildiysa index.html'e don      */
    try {
      if (window.opener && !window.opener.closed){
        try { window.opener.focus(); } catch(e){}
        window.close();
        setTimeout(function(){ if (!window.closed) location.href = "index.html"; }, 250);
        return;
      }
    } catch(e){}
    location.href = "index.html";
  },

  /* ---------- Konu seçimi ---------- */
  _aktifKonu(){
    if (state.konuId === HEPSI_ID) return BIY._hepsiKonu();
    return state.konuId ? (KONULAR.find(k => k.id === state.konuId) || null) : null;
  },
  /* "Hepsi" secilince butun (pasif olmayan) konularin sorulari tek liste
     olur. Bir kez kurulur, sonra onbellekten doner. */
  _hepsiKonu(){
    if (!state.hepsiKonu){
      const t = [];
      KONULAR.forEach(k => { if (!k.pasif && Array.isArray(k.sorular)) k.sorular.forEach(q => t.push(q)); });
      state.hepsiKonu = { id: HEPSI_ID, ad: "Hepsi", pdf: "", sorular: t, sanal: true };
    }
    return state.hepsiKonu;
  },
  /* Havuzu (Sorulari Sec!) sinirlayan GERCEK konu; "Hepsi" ve bos secim
     null doner -> havuzda butun listeler gorunur. */
  _sinirKonuId(){ return (state.konuId && state.konuId !== HEPSI_ID) ? state.konuId : null; },
  _aktifSorular(){ const k = BIY._aktifKonu(); return (k && k.sorular) || []; },
  /* Süzgeç panellerinin saydığı havuz: bir liste seçilmişse o liste, hiçbir
     şey seçilmemişse BÜTÜN sorular. Yoksa açılışta bütün sayaçlar 0 çıkıyor
     ve öğretmen "hiç soru yok" sanıyordu. */
  _suzgecHavuzu(){
    const k = BIY._aktifKonu();
    if (k && Array.isArray(k.sorular) && k.sorular.length) return k.sorular;
    return KONULAR.reduce((t, x) => t.concat(x.sorular || []), []);
  },
  _konuVurgu(){
    const sel = $("konuSecim"); if (sel){ sel.classList.toggle("secili", !!state.konuId); sel.value = state.konuId || ""; }
    const k = BIY._aktifKonu();
    const ad = $("konuSeciciAd"); if (ad) ad.textContent = k ? k.ad : "Konu seç\u2026";
    const btn = $("konuSeciciBtn"); if (btn) btn.classList.toggle("secili", !!state.konuId);
    document.querySelectorAll("#konuSeciciListe .biy-ds-oge").forEach(o => {
      const s = o.getAttribute("data-konu") === state.konuId;
      o.classList.toggle("secili", s); o.setAttribute("aria-selected", s ? "true" : "false");
    });
  },
  /* ---- ders secimi: sistemin listesi degil, kendi acilir panelimiz ---- */
  konuListeAc(){
    const btn = $("konuSeciciBtn"), l = $("konuSeciciListe");
    if (!btn || !l || btn.disabled) return;
    if (!l.hidden){ BIY.konuListeKapat(); return; }
    l.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    btn.classList.add("biy-ds-acik");
    document.addEventListener("mousedown", BIY._konuListeDis);
    document.addEventListener("keydown", BIY._konuListeTus);
    const s = l.querySelector(".biy-ds-oge.secili"); if (s) s.scrollIntoView({ block: "nearest" });
  },
  konuListeKapat(){
    const btn = $("konuSeciciBtn"), l = $("konuSeciciListe");
    if (l) l.hidden = true;
    if (btn){ btn.setAttribute("aria-expanded", "false"); btn.classList.remove("biy-ds-acik"); }
    document.removeEventListener("mousedown", BIY._konuListeDis);
    document.removeEventListener("keydown", BIY._konuListeTus);
  },
  _konuListeDis(e){ if (!e.target.closest || !e.target.closest("#konuSecici")) BIY.konuListeKapat(); },
  _konuListeTus(e){ if (e.key === "Escape" || e.key === "Esc") BIY.konuListeKapat(); },
  // tüm konulardaki soruların havuzu (elle seçim için)
  /* Konu satırındaki ÖĞRETİM YILI rozeti. Satırın kendisi bir <button>
     olduğu için burada yalnız DURAĞAN rozet basılır (seçiciyi iç içe
     tıklanabilir öğe yapmamak için); yıl seçimi index kartlarından ve
     muhâdese ünite listesinden yapılır. Sınıf konusu değilse veya sınıfın
     yıl kaydı yoksa boş döner. */
  _yilRozet(sinif){
    const v = window.KidefSinifVeri;
    if (!sinif || !v || !v.yilRozetHtml) return "";
    const r = v.yilRozetHtml(sinif, { secici: false, sinif: "biy-ds-yilroz" });
    if (r && v.yilStilKur) v.yilStilKur();
    return r || "";
  },

  _soruHavuzu(){
    const havuz = [];
    KONULAR.forEach(k => { if (Array.isArray(k.sorular)) k.sorular.forEach(q => havuz.push({ key: k.id + "#" + q.id, konuId: k.id, konuAd: k.ad, soru: q })); });
    return havuz;
  },
  _konulariHazirla(){
    const sel = $("konuSecim"); if (!sel) return;
    sel.innerHTML = '<option value=""'+(state.konuId?'':' selected')+' disabled hidden>Konu seçin…</option>' +
      '<option value="'+HEPSI_ID+'"'+(state.konuId===HEPSI_ID?' selected':'')+'>Hepsi</option>' +
      KONULAR.map(k => '<option value="'+k.id+'"'+(k.pasif?' disabled':'')+(k.id===state.konuId?' selected':'')+'>'+kacis(k.ad)+(k.pasif?' · yakında':'')+'</option>').join("");
    if (!state.konuId) sel.value = "";
    const liste = $("konuSeciciListe");
    if (liste){
      /* En ustte "HEPSİ" satiri (butun konularin sorulari); altta seviye
         basliklariyla konular basitten zora dizilir.
         NOT: sabit «Hepsi 7 9 10» sinif cipleri KALDIRILDI. */
      const hepsiSay = KONULAR.reduce((t, k) => t + (k.pasif ? 0 : (k.sorular || []).length), 0);
      let h = '<button type="button" role="option" style="--i:0" data-konu="'+HEPSI_ID+'" data-sinif="0"'
        + ' class="biy-ds-oge biy-ds-hepsi" title="Bütün listelerin soruları">'
        + '<span class="biy-ds-nokta" aria-hidden="true"></span>'
        + '<span class="biy-ds-ad2">Hepsi</span>'
        + '<span class="biy-ds-rozet biy-ds-sinifroz genel">Tümü</span>'
        + '<span class="biy-ds-rozet biy-ds-say">'+hepsiSay+'</span>'
        + '<svg class="biy-ds-tik" viewBox="0 0 24 24" aria-hidden="true" fill="none"'
        + ' stroke="currentColor" stroke-width="3.4" stroke-linecap="round"'
        + ' stroke-linejoin="round"><polyline points="4 12.5 9.5 18 20 6.5"/></svg>'
        + '</button>';
      let grup = "", sira = 1;
      KONULAR.forEach(k => {
        const g = k.sinif ? "sinif" : ("seviye" + k.seviye);
        if (g !== grup){
          grup = g;
          h += k.sinif
            ? '<div class="biy-ds-seviye biy-ds-sinifbas"><i aria-hidden="true">▦</i>'+SINIF_BASLIK+'</div>'
            : '<div class="biy-ds-seviye"><i>'+('●'.repeat(k.seviye))+'</i>'+(SEVIYE_BASLIK[k.seviye]||"")+'</div>';
        }
        h += '<button type="button" role="option" style="--i:'+(sira++)+'" data-konu="'+kacis(k.id)+'" data-sinif="'+(k.sinif||0)+'"'
          + (k.pasif ? ' disabled aria-disabled="true"' : '')
          + ' class="biy-ds-oge'+(k.pasif ? ' biy-ds-pasif' : '')+'">'
          + '<span class="biy-ds-nokta" aria-hidden="true"></span>'
          + '<span class="biy-ds-ad2">'+kacis(k.ad)+'</span>'
          + '<span class="biy-ds-rozet biy-ds-sinifroz'+(k.sinif ? '' : ' genel')+'">'+(k.sinif || 'Genel')+'</span>'
          + BIY._yilRozet(k.sinif)
          + '<span class="biy-ds-rozet biy-ds-say">'+((k.sorular||[]).length)+'</span>'
          + (k.pasif ? '<span class="biy-ds-yakinda">yakında</span>'
                     : '<svg class="biy-ds-tik" viewBox="0 0 24 24" aria-hidden="true" fill="none"'
                       + ' stroke="currentColor" stroke-width="3.4" stroke-linecap="round"'
                       + ' stroke-linejoin="round"><polyline points="4 12.5 9.5 18 20 6.5"/></svg>')
          + '</button>';
      });
      liste.innerHTML = h;
      if (!liste.dataset.baglandi){
        liste.dataset.baglandi = "1";
        liste.addEventListener("click", (e) => {
          const o = e.target.closest(".biy-ds-oge");
          if (!o || o.disabled) return;
          BIY.konuSec(o.getAttribute("data-konu"));
          BIY.konuListeKapat();
        });
      }
    }
    BIY._acilisUygula();
    BIY._konuVurgu();
    BIY._pdfOnizleGuncelle();
  },

  /* ---------- Açılış: "?sinif=N&konu=id" ----------
     index.html'deki İmam Hatip sınıf kartından gelindiyse sınıf süzgecini
     o sınıfa alır ve sınıfın konusunu SEÇİLİ getirir. Böylece bilgi
     yarışmasının TEK html'i, sınıfa göre farklı açılır. */
  _acilisUygula(){
    if (state.acilisUygulandi) return;
    const n = +state.acilisSinif || 0, istenen = state.acilisKonu;
    if (!n && !istenen) { state.acilisUygulandi = true; return; }
    state.acilisUygulandi = true;

    /* 1) sınıf süzgeci — sabit çipler kaldırıldığı için doğrudan satırlara
       uygulanır: yalnız o sınıfın (ve Genel) konuları görünür. "Hepsi"
       satırı her zaman kalır; öğretmen oradan tüm konulara döner. */
    if (n) BIY._konuListeSuz(n);

    /* 2) konu seçimi — önce istenen id, olmazsa sınıfın ilk konusu */
    const uygun = k => k && !k.pasif && (k.sorular || []).length > 0;
    let hedef = istenen ? KONULAR.find(k => k.id === istenen && uygun(k)) : null;
    if (!hedef && n) hedef = KONULAR.find(k => (+k.sinif === n) && uygun(k));
    if (hedef) BIY.konuSec(hedef.id);

    /* 3) AÇIKLAMA CÜMLESİ YOK.
       Eskiden burada "N. sınıf için açıldı — konu X seçildi · tüm konular"
       notu basiliyordu. Kullanici istegi: hicbir cumle cikmasin, konu
       sadece SECILI gelsin. "Tum konular"a donmek isteyen, konu
       listesinin basindaki "Hepsi" satirina basar. */
  },
  /* ?sinif=N ile gelindiginde konu listesini suz. Bos kalan seviye
     basliklari da gizlenir; "Hepsi" satiri her zaman gorunur. */
  _konuListeSuz(n){
    const liste = $("konuSeciciListe"); if (!liste) return;
    let bas = null, basDolu = false;
    [].slice.call(liste.children).forEach(el => {
      if (el.classList.contains("biy-ds-seviye")){
        if (bas) bas.hidden = !basDolu;
        bas = el; basDolu = false; return;
      }
      if (!el.classList.contains("biy-ds-oge")) return;
      if (el.getAttribute("data-konu") === HEPSI_ID){ el.hidden = false; return; }
      const ks = +el.getAttribute("data-sinif");
      const gizle = !!(n && ks !== n && ks !== 0);     // Genel konular her sınıfta kalır
      el.hidden = gizle;
      if (!gizle) basDolu = true;
    });
    if (bas) bas.hidden = !basDolu;
  },

  /* Konu secimi ile "Sorulari Sec!" ARTIK BIRLIKTE CALISIR (biri digerini
     silmez). Tek kural: gercek bir liste seciliyse havuzda YALNIZ o
     listenin sorulari kalabilir; baska listelerden kalan secimler sessizce
     dusurulur. "Hepsi" secilirse hicbiri dusmez. */
  konuSec(id){
    state.konuId = id || null;
    BIY._havuzuKonuyaKirp();
    BIY._konuVurgu();
    BIY._soruSecSayiGuncelle();   // havuz tuşu/sayaç + pdf + sınır + menü hepsini günceller
  },
  _havuzuKonuyaKirp(){
    const kid = BIY._sinirKonuId(); if (!kid) return 0;
    const set = BIY._secSet(); let n = 0;
    [].slice.call(set).forEach(key => {
      if (key.slice(0, key.indexOf("#")) !== kid){ set.delete(key); n++; }
    });
    return n;
  },

  /* ---------- Soru Havuzu (elle seçim) ---------- */
  _secSet(){ if (!state.secilenSet) state.secilenSet = new Set(); return state.secilenSet; },

  /* ===================================================================
     ÇEVRİMDIŞI MODÜL KÖPRÜSÜ
     cevrimdisi.js bu altı üyeyi çağırıyor; ka.com sürümünde karşılıkları
     başka adlarla vardı ya da hiç yoktu. Hepsi ince sarmalayıcı: iş
     mantığı yine tek yerde (süzgeç, süre, liste seçimi).
     =================================================================== */
  _konuSorulari(k){ return (k && Array.isArray(k.sorular)) ? k.sorular.filter(BIY._havuzdaMi) : []; },
  _konuTumSorulari(k){ return (k && Array.isArray(k.sorular)) ? k.sorular.slice() : []; },
  _soruSuresi(q){ return soruSuresi(q); },
  /* Küme (ünite yerine geçen grup) seçimi — akordiyon başlığı. */
  uniteSec(no){
    no = +no; if (!no) return;
    if (no === state.uniteNo && state.uniteAcik === no) return;
    state.uniteNo = no; state.uniteAcik = no;
    state.konuId = null;                       // küme değişti → liste ve havuz sıfırlanır
    const set = BIY._secSet(); if (set.size) set.clear();
    state.soruSayisi = null; state.soruSayiHavuzdan = false;
    BIY._konulariHazirla();
    BIY._soruSecSayiGuncelle();
    BIY._soruSayiSinir();
    BIY._menuDurum();
  },
  uniteAc(no){
    no = +no;
    if (state.uniteAcik === no){ state.uniteAcik = null; BIY._konulariHazirla(); return; }
    state.uniteAcik = no;
    if (no !== state.uniteNo) BIY.uniteSec(no); else BIY._konulariHazirla();
  },
  kilidiAc(){ state.uniteKilit = null; BIY._konulariHazirla(); },

  /* ---- KURULUM SAYFASI ----------------------------------------------
     Ayrı bir "mod kapısı" ekranı YOK. Öğretmen doğrudan kurulum
     sihirbazına girer; canlı ⇄ çevrimdışı seçimi orada bir bölüm olarak
     durur (cevrimdisi.js · COFF.modSec). Böylece mod, katılım biçimi,
     liste ve soru sayısı tek sayfada seçiliyor.
     Çevrimdışı modül yüklenmemişse eski canlı kurulum ekranına düşülür. */
  _modKapisi(){
    if (window.COFF && COFF.ac){ try { COFF.ac(); return; } catch(e){ console.warn("[BIY] COFF:", e); } }
    ekranGoster("ekranAnasayfa");
  },
  modSec(hangi){
    /* İki mod da aynı kuruluma girer; fark yalnız son adımda. */
    if (window.COFF && COFF.ac){ COFF.ac(hangi === "canli" ? "canli" : "cevrimdisi"); return; }
    ekranGoster("ekranAnasayfa");
  },
  modaDon(){ BIY._modKapisi(); },
  _soruSecSayiGuncelle(){
    const n = BIY._secSet().size;
    /* ESKIDEN: havuzdan soru secilince konu secimi kalkardi (tek kaynak
       kurali). ARTIK KALKMIYOR — konu secimi havuzu SINIRLAR, silmez. */
    const b = $("soruSecSayi");
    if (b){ b.textContent = n; b.hidden = (n === 0); }   // sifirken rozet hic cikmasin
    const btn = $("soruSecBtn"); if (btn) btn.classList.toggle("biy-secili-var", n > 0);
    BIY._pdfOnizleGuncelle();
    BIY._soruSayiSinir();
    BIY._menuDurum();
  },
  soruSecAc(){
    if ($("soruSecBtn") && $("soruSecBtn").disabled) return;
    const eski = $("biySoruSec"); if (eski) eski.remove();
    state.soruSecArama = "";
    // Panelin ustundeki havuz SVG'sini basliga kucultulmus olarak klonla
    const hvIkon = (function(){ const e = document.querySelector(".biy-svg-havuz");
                                return e ? e.outerHTML : "\u{1F3AF}"; })();
    /* Secili GERCEK liste varsa pencere yalniz onu gosterir (C-1) ve o
       listenin akordiyonu acik gelir. "Hepsi" / secim yoksa hepsi gorunur. */
    const kSinir = BIY._sinirKonuId() ? BIY._aktifKonu() : null;
    if (kSinir){ if (!state.soruSecAcik) state.soruSecAcik = {}; state.soruSecAcik[kSinir.id] = true; }
    const ov = document.createElement("div"); ov.id = "biySoruSec"; ov.className = "biy-onay-ov biy-soru-sec-ov";
    ov.innerHTML =
      '<div class="biy-soru-sec-kutu">' +
        '<div class="biy-soru-sec-bas">' +
          '<h3><span class="biy-hs-bas-ikon biy-anim">' + hvIkon + '</span> Soruları Seç!' +
            (kSinir ? '<span class="biy-hs-konu-rozet" title="Seçili liste: ' + kacis(kSinir.ad) +
                      ' — başka listeden soru seçilemez">' + kacis(kSinir.ad) + '</span>' : '') +
          '</h3>' +
          '<span class="biy-soru-sec-tavan" id="soruSecTavan" hidden></span>' +
          '<span class="biy-soru-sec-say" id="soruSecSecili"></span>' +
          '<button class="biy-soru-sec-kapat" onclick="BIY.soruSecKapat()">✕</button>' +
          /* Uyari cubugu BASLIGIN ICINDE ikinci satir olarak durur. Disarida
             birakilinca, baslik "akistan cikarilmis" (position:absolute)
             oldugu icin uyari basligin ALTINDA kaliyor ve gorunmuyordu. */
          '<div class="biy-hs-uyari" id="soruSecUyari" role="alert" hidden></div>' +
        '</div>' +
        '<div class="biy-soru-sec-liste" id="soruSecListe"></div>' +
        '<div class="biy-soru-sec-alt">' +
          BIY._sepetHtml() +
          '<div class="biy-soru-sec-butonlar">' +
            '<button class="biy-btn biy-onay-hayir" onclick="BIY.soruSecTemizle()">Tümünü temizle</button>' +
            '<button class="biy-btn biy-btn-yesil" onclick="BIY.soruSecKapat()">Bitti</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    ov.addEventListener("click", e => { if (e.target === ov) BIY.soruSecKapat(); });
    _havuzBaslikKaydir(ov);
    BIY._soruSecRender();
  },
  soruSecAra(v){ state.soruSecArama = (v||"").toLowerCase(); BIY._soruSecRender(); },
  /* ---------- havuz sınırı (tavan) ----------
     Öğretmen aşağıdan bir soru sayısı seçtiyse o sayı TAVAN olur; sepet
     "n / tavan" gösterir, tavan dolunca seçilmemiş satırlar soluklaşır. */
  _havuzSinir(){ return BIY._hsTavan(); },
  _havuzKalan(){ const s = BIY._havuzSinir(); return s ? Math.max(0, s - BIY._secSet().size) : Infinity; },
  _havuzDoluMu(){ const s = BIY._havuzSinir(); return !!s && BIY._secSet().size >= s; },
  /* Süzgeç dışı sorular listeden ATILMAZ, soluk gösterilir: öğretmen neyin
     neden seçilemediğini görsün diye. Anahtarla da korunur (soruSecTik). */
  _suzgecDisiMi(key){
    const p = String(key).split("#");
    const k = KONULAR.find(x => x.id === p[0]); if (!k) return false;
    const q = (k.sorular || []).find(x => String(x.id) === p[1]);
    return q ? !BIY._havuzdaMi(q) : false;
  },
  /* ---------- SEPET: seçilen sorular gözle görülür şekilde birikir ----------
     Alt bardaki düz sayı hapı yerine dolan bir sepet: SVG içindeki dolgu
     seviyesi ve ilerleme çubuğu, seçimin tavana ne kadar yaklaştığını tek
     bakışta gösterir. Tavan yoksa çubuk yalnız "biriktiğini" anlatır. */
  _sepetHtml(){
    return '<div class="biy-sepet" id="soruSepet">'
      + '<span class="biy-sepet-ikon" aria-hidden="true">'
        + '<svg viewBox="0 0 52 52">'
          + '<defs><clipPath id="biySepetKirp"><path d="M8 20h36l-4.5 22a4 4 0 0 1-4 3.2H16.5a4 4 0 0 1-4-3.2z"/></clipPath></defs>'
          + '<g clip-path="url(#biySepetKirp)">'
            + '<rect class="biy-sepet-dolgu" id="sepetDolgu" x="6" y="46" width="40" height="30"/>'
          + '</g>'
          + '<path class="biy-sepet-kulp" d="M18 20V15a8 8 0 0 1 16 0v5" fill="none" stroke="currentColor"'
          + ' stroke-width="3" stroke-linecap="round"/>'
          + '<path d="M8 20h36l-4.5 22a4 4 0 0 1-4 3.2H16.5a4 4 0 0 1-4-3.2z" fill="none" stroke="currentColor"'
          + ' stroke-width="3" stroke-linejoin="round"/>'
          + '<path d="M5.5 20h41" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/>'
        + '</svg>'
        + '<i class="biy-sepet-dusen" id="sepetDusen"></i>'
      + '</span>'
      + '<div class="biy-sepet-bilgi">'
        + '<div class="biy-sepet-sayi"><b id="sepetSayi">0</b><span id="sepetHedef"></span></div>'
        + '<div class="biy-sepet-bar"><i id="sepetBar"></i></div>'
        + '<span class="biy-sepet-not" id="sepetNot"></span>'
      + '</div>'
    + '</div>';
  },
  _sepetGuncelle(dusenVar){
    const kap = $("soruSepet"); if (!kap) return;
    const n = BIY._secSet().size, hedef = BIY._havuzSinir();
    const oran = hedef ? Math.min(100, (n / hedef) * 100) : (n ? Math.min(100, n * 4) : 0);
    const dolu = BIY._havuzDoluMu();
    const sy = $("sepetSayi"); if (sy) sy.textContent = n;
    const hd = $("sepetHedef"); if (hd) hd.textContent = hedef ? (" / " + hedef) : " soru";
    const br = $("sepetBar"); if (br) br.style.width = oran + "%";
    const dg = $("sepetDolgu"); if (dg) dg.setAttribute("y", String(46 - (oran / 100) * 26));
    const nt = $("sepetNot");
    if (nt) nt.textContent = !hedef ? "" : (dolu ? "Sayı tamamlandı" : ("Daha seçebilirsin: " + (hedef - n) + " tane"));
    kap.classList.toggle("dolu", dolu);
    kap.classList.toggle("bos", n === 0);
    if (dusenVar){
      const d = $("sepetDusen");
      if (d){ d.classList.remove("biy-dus"); void d.offsetWidth; d.classList.add("biy-dus"); }
      kap.classList.remove("biy-zipla"); void kap.offsetWidth; kap.classList.add("biy-zipla");
    }
  },
  _sinirUyar(){
    const kap = $("soruSepet"); if (!kap) return;
    kap.classList.remove("biy-salla"); void kap.offsetWidth; kap.classList.add("biy-salla");
    const nt = $("sepetNot");
    if (nt){
      nt.textContent = "Belirlenen sayıya ulaştın (" + BIY._havuzSinir() + ")";
      nt.classList.add("uyari");
      setTimeout(() => { nt.classList.remove("uyari"); BIY._sepetGuncelle(); }, 1800);
    }
  },
  _kapsamSvg(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"'
         + ' stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5h18M6 12h12M9.5 17.5h5"/></svg>';
  },
  /* Listenin başındaki renk açıklaması: hangi renk hangi soru tipi.
     Süzgeçte kapalı tip burada da üstü çizili ve soluk görünür — böylece
     "bu sorular neden pasif?" sorusunun cevabı listenin başında duruyor. */
  _tipEfsanesi(){
    return '<div class="biy-hs-tipler">' + Object.keys(BICIM_BILGI).map(b => {
      const kapali = state.bicimSecim[b] === false;
      return '<span class="biy-hs-tip biy-hs-b-' + b + (kapali ? ' kapali' : '') + '"'
        + (kapali ? ' title="Bu tür süzgeçte kapalı"' : '') + '>' + (ETIKET_BICIM[b] || "")
        + kacis(BICIM_BILGI[b].ad) + '</span>';
    }).join("") + '</div>';
  },
  _soruSecRender(){
    const kap = $("soruSecListe"); if (!kap) return;
    const set = BIY._secSet();
    const ara = state.soruSecArama;
    const doluMu = BIY._havuzDoluMu();
    /* C-1: konu secildiyse havuzda YALNIZ o listenin sorulari cikar. */
    const kid = BIY._sinirKonuId();
    const listeler = (kid ? KONULAR.filter(k => k.id === kid) : KONULAR)
                       .filter(k => Array.isArray(k.sorular) && k.sorular.length);
    const kapsamAd = kid ? ((KONULAR.find(k => k.id === kid) || {}).ad || "") : "Bütün listeler";
    let html = '<div class="biy-hs-kapsam">' + BIY._kapsamSvg()
             + '<span>' + kacis(kapsamAd) + '</span></div>'
             + BIY._tipEfsanesi();
    /* Havuz birden çok listeyi kapsıyorsa araya küme başlığı gir: sınıflar
       ayrı, seviye seviye konular ayrı. Ana ekrandaki liste ile aynı dil. */
    const cokKume = listeler.length > 1;
    let sonKume = null;
    listeler.forEach(k => {
      const hepsi = k.sorular.slice();                       // süzgeç dışı da listelenir
      const uygun = k.sorular.filter(BIY._havuzdaMi);         // seçilebilir olanlar
      const sorular = hepsi.filter(q => !ara || (q.soru + " " + (q.arapca||"") + " " + aramaMetni(q)).toLowerCase().indexOf(ara) >= 0);
      if (!sorular.length) return;
      const seciliSay = uygun.filter(q => set.has(k.id + "#" + q.id)).length;
      const disiSay = hepsi.length - uygun.length;
      const kume = k.sinif ? "sinif" : ("seviye" + k.seviye);
      if (cokKume && kume !== sonKume){
        sonKume = kume;
        const kumeAd = k.sinif ? SINIF_BASLIK : (SEVIYE_BASLIK[k.seviye] || "");
        const kumeIm = k.sinif ? "▦" : "●".repeat(k.seviye || 1);
        const kumeSay = listeler.filter(x => (x.sinif ? "sinif" : ("seviye" + x.seviye)) === kume)
                                .reduce((t, x) => t + x.sorular.length, 0);
        html += '<div class="biy-hs-kume">'
          + '<span class="biy-hs-kume-im">' + kumeIm + '</span>'
          + '<span class="biy-hs-kume-ad">' + kacis(kumeAd) + '</span>'
          + '<span class="biy-hs-kume-say">' + kumeSay + ' soru</span>'
          + '</div>';
      }
      const acik = ara ? true : !!(state.soruSecAcik && state.soruSecAcik[k.id]);
      html += '<div class="biy-hs-grup'+(acik?' acik':'')+'" data-konu="'+k.id+'">' +
        '<div class="biy-hs-baslik" onclick="BIY.soruSecAkordiyon(\''+k.id+'\')">' +
        '<span class="biy-hs-ok">▸</span>' +
        '<b>'+kacis(k.ad)+'</b> <span class="biy-hs-say'+(seciliSay>0?' dolu':'')+((seciliSay===uygun.length&&uygun.length)?' tam':'')+'"><b>'+seciliSay+'</b><i>/</i>'+uygun.length+'</span>' +
        (disiSay ? '<span class="biy-hs-disi-say" title="Süzgeç dışında kaldığı için seçilemeyen soru">'+disiSay+' pasif</span>' : '') +
        '<button class="biy-hs-tumu" title="Tümünü seç" aria-label="Tümünü seç" onclick="event.stopPropagation();BIY.soruSecTumu(\''+k.id+'\')">' +
          '<svg viewBox="0 0 24 24" class="biy-hs-tumu-svg" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.5"/><path class="biy-ea-ciz" d="M7.4 12.6l3 3 6.2-7.2"/></svg></button></div>' +
        '<div class="biy-hs-govde">';
      sorular.forEach(q => {
        const key = k.id + "#" + q.id; const sec = set.has(key);
        const dogruSik = dogruCevapMetni(q);
        const b = bicimAl(q), z = +q.zorluk || 0;
        const disi = !BIY._havuzdaMi(q);            // süzgeç dışı: soluk ve seçilemez
        const kapali = disi || (!sec && doluMu);
        const ipucu = disi
          ? (state.bicimSecim[b] === false
              ? (BICIM_BILGI[b] || {}).ad + " türü süzgeçte kapalı"
              : (ZORLUK_AD[z] || "Bu zorlukta") + " sorular süzgeçte kapalı")
          : ((BICIM_BILGI[b] || {}).ad || "") + (ZORLUK_AD[z] ? " · " + ZORLUK_AD[z] : "");
        html += '<label class="biy-hs-satir biy-hs-b-'+b+' biy-hs-z'+z+(sec?' secili':'')+(disi?' biy-hs-disi':'')+(kapali?' biy-hs-kapali':'')+'" data-key="'+key+'"' +
            ' data-b="'+b+'" data-z="'+z+'" data-t="'+kacis(q.tip || "")+'" title="'+kacis(ipucu)+'">' +
          '<input type="checkbox" '+(sec?'checked':'')+(kapali?' disabled':'')+' onchange="BIY.soruSecTik(\''+key+'\', this)">' +
          BIY._hsRozetHtml(q) +
          (ZORLUK_AD[z] ? '<span class="biy-hs-zor z'+z+'">'+kacis(ZORLUK_AD[z])+'</span>' : '') +
          '<span class="biy-hs-metin">'+soruHtml(q)+(q.arapca?' <i>'+kacis(q.arapca)+'</i>':'')+
            ' <b class="biy-hs-dogru">✓ '+kacis(dogruSik)+'</b></span>' +
          (disi ? '<span class="biy-hs-disi-not">süzgeç dışı</span>' : '') +
        '</label>';
      });
      html += '</div></div>';
    });
    kap.innerHTML = html;
    if (!kap.querySelector(".biy-hs-grup"))
      kap.insertAdjacentHTML("beforeend", '<p class="biy-alt" style="text-align:center">' +
        (kid ? 'Bu listede gösterilecek soru yok.' : 'Sonuç yok.') + '</p>');
    BIY._soruSecSayilar();
  },

  /* =====================================================================
     HAVUZ SÜZGECİ — soru tipi (biçim) + zorluk (1–3 yıldız) + tür ikonları
     ---------------------------------------------------------------------
     Her açılabilir konu başlığının ALTINDA, gövdenin en üstünde durur.
     Başlık kapalıyken gövde zaten display:none olduğu için süzgeç de
     görünmez; yani tasarım kapalı hâlde birebir eskisi gibi kalır.

     · İkonlar soru kartlarındaki ETIKET_BICIM / ETIKET_ZORLUK / ETIKET_TIP
       SVG'lerinin ta kendisi → aynı dil, yeni bir sembol seti yok.
     · Her ikonun yanında o konuda kaç soru olduğu yazar.
     · Sayı 0 ise düğme gri + disabled ("pasif").
     · Seçim YOKSA süzgeç yok demektir (hepsi görünür). Aynı satırdan
       birden çok ikon seçilebilir (VEYA); satırlar arasında VE geçerli.
     · AKILLI: Sayılar, çipin KENDİ boyutu hariç diğer süzgeçlere göre
       yeniden hesaplanır; 0 kalan (ve seçili olmayan) çip pasifleşir. Kolon
       düzeni sabit olduğundan sayı değişse de ikon yerinden oynamaz.
  ===================================================================== */
  _hsRozetHtml(q){
    const b = bicimAl(q);
    const bb = BICIM_BILGI[b] || { ad: b };
    /* Zorluk artık satırda METİN hapıyla ("Kolay/Orta/Zor") yazıyor;
       burada ikonunu da basmak aynı şeyi iki kez söylemek olurdu. */
    return '<span class="biy-hs-roz" aria-hidden="true">' +
      '<i class="biy-hs-roz-b" title="'+kacis(bb.ad)+'">'+(ETIKET_BICIM[b] || ETIKET_TIP.varsayilan)+'</i>' +
    '</span>';
  },
  // sayaçları (grup başlıkları + toplam + buton) satırları yeniden çizmeden güncelle
  _soruSecSayilar(dusenVar){
    const set = BIY._secSet();
    document.querySelectorAll(".biy-hs-grup").forEach(g => {
      const k = KONULAR.find(x => x.id === g.getAttribute("data-konu")); if (!k) return;
      /* Sayaç, ana ekrandaki tip/zorluk seçiminden GEÇEN sorulara göre;
         listede görünmeyen soruyu paydaya katmak yanıltıcı olurdu. */
      const uygun = k.sorular.filter(BIY._havuzdaMi);
      const sec = uygun.filter(q => set.has(k.id + "#" + q.id)).length;
      const sp = g.querySelector(".biy-hs-say");
      if (sp){
        sp.innerHTML = "<b>" + sec + "</b><i>/</i>" + uygun.length;
        sp.classList.toggle("dolu", sec > 0);
        sp.classList.toggle("tam", sec === uygun.length);
      }
      // tümünü-seç: grup tam seçiliyse animasyon durur, tik yeşil kalır.
      // Süzgeç açıkken ölçüt EKRANDA GÖRÜNEN satırlardır (düğme de onlara işler).
      const tb = g.querySelector(".biy-hs-tumu");
      if (tb){
        const gorunen = [].slice.call(g.querySelectorAll(".biy-hs-satir")).filter(r => !r.hidden);
        const tam = gorunen.length
          ? gorunen.every(r => set.has(r.getAttribute("data-key")))
          : (sec === uygun.length);
        tb.classList.toggle("tam", tam);
      }
    });
    const say = $("soruSecSecili"); if (say) say.innerHTML = 'Seçili <b class="biy-say-rozet">' + set.size + '</b>';
    /* Asagidan soru sayisi secildiyse tavani her zaman goster (asilirsa kirmizi) */
    const tv = $("soruSecTavan"), tavan = BIY._hsTavan();
    if (tv){
      tv.hidden = !tavan;
      if (tavan){
        tv.innerHTML = 'En çok <b>' + tavan + '</b>';
        tv.classList.toggle("asildi", set.size > tavan);
        tv.title = "Aşağıdan " + tavan + " soru seçtin; havuzdan en çok o kadar soru işaretlenebilir.";
      }
    }
    /* Tavan dolunca seçilmemiş satırlar kapanır; süzgeç dışı olanlar
       zaten hep kapalı. Satırları yeniden çizmeden sınıf/disabled güncelle. */
    const dolu = BIY._havuzDoluMu();
    document.querySelectorAll("#soruSecListe .biy-hs-satir").forEach(r => {
      const cb = r.querySelector("input"); if (!cb) return;
      if (r.classList.contains("biy-hs-disi")){
        r.classList.add("biy-hs-kapali"); cb.disabled = true; return;
      }
      const kapali = !cb.checked && dolu;
      cb.disabled = kapali; r.classList.toggle("biy-hs-kapali", kapali);
    });
    document.querySelectorAll("#soruSecListe .biy-hs-tumu")
            .forEach(b => b.classList.toggle("biy-hs-tumu-kapali", dolu));
    // Alt bardaki SEPET: hangi listeden seçilirse seçilsin toplam burada birikir
    BIY._sepetGuncelle(dusenVar);
    BIY._soruSecSayiGuncelle();
  },
  /* =====================================================================
     SORU SAYISI TAVANI (C-5)
     Ogretmen asagidaki rakamlardan bir sayi sectiyse (yani sayi havuzdan
     gelmediyse) o sayi TAVANDIR. Havuzda tavandan fazlasina basilirsa
     secim alinmaz ve listenin ustunde bir uyari cubugu belirir; cubuktaki
     "Sinirli kaldir" tusu sayiyi birakir, boylece havuz yine serbest olur.
     Modal kullanilmadi: her fazla tiklamada pencere acilmasi is akisini
     keserdi; cubuk yerinde durur, 4 saniye sonra kendiliginden kapanir.
  ===================================================================== */
  _hsTavan(){ return (state.soruSayisi != null && !state.soruSayiHavuzdan) ? state.soruSayisi : 0; },
  _soruSecUyar(metin){
    const u = $("soruSecUyari"); if (!u) return;
    u.innerHTML =
      '<svg class="biy-hs-uyari-ikon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"' +
      ' stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 3.6 22 20.4H2z"/><path d="M12 9.6v4.6"/><circle cx="12" cy="17.4" r=".9" fill="currentColor" stroke="none"/></svg>' +
      '<span class="biy-hs-uyari-metin">' + kacis(metin) + '</span>' +
      '<button type="button" class="biy-hs-uyari-btn" onclick="BIY.soruSecSinirKaldir()">Sınırı kaldır</button>';
    u.hidden = false;
    /* liste asagi kaydirilmissa baslik gizlenmis olabilir; uyari gorunsun diye geri ac */
    const bas = document.querySelector("#biySoruSec .biy-soru-sec-bas");
    if (bas) bas.classList.remove("biy-header--gizli");
    u.classList.remove("carp"); void u.offsetWidth; u.classList.add("carp");
    if (state.hsUyariZmn) clearTimeout(state.hsUyariZmn);
    state.hsUyariZmn = setTimeout(() => {
      const e = $("soruSecUyari"); if (e) e.hidden = true;
      state.hsUyariZmn = null;
    }, 4200);
  },
  /* tavani birak: soru sayisi yeniden havuzdan belirlenir */
  soruSecSinirKaldir(){
    state.soruSayisi = null; state.soruSayiHavuzdan = false;
    if (state.hsUyariZmn){ clearTimeout(state.hsUyariZmn); state.hsUyariZmn = null; }
    const u = $("soruSecUyari"); if (u) u.hidden = true;
    BIY._soruSecSayilar();
  },
  // tek satır: yeniden çizmeden aç/kapa (kaydırma korunur)
  soruSecTik(key, cb){
    const set = BIY._secSet();
    /* Süzgeç dışı satır artık listede duruyor (soluk); yanlışlıkla
       işaretlenmesin diye anahtar üzerinden de korunuyor. */
    if (!set.has(key) && BIY._suzgecDisiMi(key)){ if (cb) cb.checked = false; return; }
    let eklendi = false;
    if (set.has(key)) set.delete(key);
    else {
      const tavan = BIY._hsTavan();
      if (tavan && set.size >= tavan){
        if (cb) cb.checked = false;                      // isaret geri alinir
        BIY._sinirUyar();
        BIY._soruSecUyar("Aşağıdan " + tavan + " soru seçtin; daha fazlasını işaretleyemezsin.");
        return;
      }
      set.add(key); eklendi = true;
    }
    if (cb){ const row = cb.closest(".biy-hs-satir"); if (row) row.classList.toggle("secili", cb.checked); }
    BIY._soruSecSayilar(eklendi);
  },
  // akordiyon: başlığa tıkla → aç/kapa (yeniden çizmeden, kaydırma korunur)
  soruSecAkordiyon(konuId){
    if (!state.soruSecAcik) state.soruSecAcik = {};
    state.soruSecAcik[konuId] = !state.soruSecAcik[konuId];
    const g = document.querySelector('.biy-hs-grup[data-konu="'+konuId+'"]');
    if (g) g.classList.toggle("acik", !!state.soruSecAcik[konuId]);
    // AÇILINCA: o listenin başlığı en yukarı kadar tırmansın (index'te kategori
    // açılınca başlığın yukarı çıkması gibi) → açılan sorular hemen görünür.
    if (g && state.soruSecAcik[konuId]){
      const liste = document.getElementById("soruSecListe");
      if (liste){
        const delta = g.getBoundingClientRect().top - liste.getBoundingClientRect().top;
        liste.scrollTo({ top: Math.max(0, liste.scrollTop + delta), behavior: "smooth" });
      }
    }
  },
  /* "Tümünü seç" artık EKRANDA GÖRÜNEN sorulara uygulanır: arama + süzgeç
     neyi bıraktıysa o seçilir. Süzgeç yokken davranış eskisiyle aynı.
     Satırlar yeniden çizilmez → kaydırma yerinde kalır. */
  soruSecTumu(konuId){
    const set = BIY._secSet();
    const k = KONULAR.find(x => x.id === konuId); if (!k) return;
    const g = document.querySelector('.biy-hs-grup[data-konu="'+konuId+'"]');
    /* Süzgeç dışı satırlar listede duruyor ama seçilemez — toplu seçim de
       onları atlar, yoksa "tümünü seç" süzgeci delerdi. */
    let satirlar = g ? [].slice.call(g.querySelectorAll(".biy-hs-satir"))
                         .filter(r => !r.hidden && !r.classList.contains("biy-hs-disi")) : [];
    let anahtarlar = satirlar.map(r => r.getAttribute("data-key"));
    // Grup ekranda yoksa (hiç çizilmemişse) konunun tamamına düş; ama grup
    // ÇİZİLMİŞ ve süzgeç hiçbir soru bırakmamışsa hiçbir şey yapma —
    // yoksa "eşleşme yok" hâlinde tuş bütün konuyu seçerdi.
    if (!anahtarlar.length){
      if (g) return;
      anahtarlar = k.sorular.filter(BIY._havuzdaMi).map(q => konuId + "#" + q.id); satirlar = [];
    }
    const hepsiSecili = anahtarlar.every(a => set.has(a));
    if (hepsiSecili) anahtarlar.forEach(a => set.delete(a));
    else {
      let eklenecek = anahtarlar.filter(a => !set.has(a));
      const tavan = BIY._hsTavan();
      if (tavan){
        const yer = Math.max(0, tavan - set.size);
        if (eklenecek.length > yer){
          eklenecek = eklenecek.slice(0, yer);
          BIY._soruSecUyar(yer
            ? "Aşağıdan " + tavan + " soru seçtin; yalnız " + yer + " soru eklenebildi."
            : "Aşağıdan seçtiğin " + tavan + " sorunun tamamı dolu; yeni soru eklenmedi.");
        }
      }
      eklenecek.forEach(a => set.add(a));
    }
    if (satirlar.length){
      satirlar.forEach(r => {
        const s = set.has(r.getAttribute("data-key"));
        r.classList.toggle("secili", s);
        const cb = r.querySelector("input"); if (cb) cb.checked = s;
      });
      BIY._soruSecSayilar();
    } else BIY._soruSecRender();
  },
  soruSecTemizle(){ BIY._secSet().clear(); BIY._soruSecRender(); BIY._soruSecSayiGuncelle(); },
  /* Tavan belirlenmiş ama sepet dolmamışsa kapanışta bir kez uyar: öğretmen
     "20 soru" deyip 12 seçmiş olarak çıkmasın. İkinci basışta kapanır. */
  _havuzEksikUyar(){
    const kutu = document.querySelector("#biySoruSec .biy-soru-sec-kutu"); if (!kutu) return;
    const eski = kutu.querySelector(".biy-havuz-eksik"); if (eski) eski.remove();
    const kalan = BIY._havuzKalan();
    const d = document.createElement("div");
    d.className = "biy-havuz-eksik";
    d.innerHTML = '<span><b>' + kalan + '</b> soru daha seçebilirsin.</span>'
      + '<button type="button" class="biy-he-tus" onclick="BIY.soruSecKapat(true)">Yine de kapat</button>';
    kutu.appendChild(d);
    setTimeout(() => { d.classList.add("biy-gec"); setTimeout(() => d.remove(), 500); }, 4200);
  },
  soruSecKapat(zorla){
    const ov = $("biySoruSec"); if (!ov) return;
    const sinir = BIY._havuzSinir();
    if (!zorla && sinir && BIY._secSet().size > 0 && BIY._secSet().size < sinir){
      BIY._havuzEksikUyar(); BIY._sinirUyar(); return;
    }
    ov.remove(); BIY._soruSecSayiGuncelle();
  },
  /* ---------- soru tipi (biçim) filtresi ---------- */
  // aktif konunun sorularından yalnız seçili biçimdekiler
  /* Ana ekrandaki soru tipi + zorluk seçiminden geçiyor mu?
     Havuz penceresi de bunu kullanır: seçim TEK yerde yapılır, liste ona
     uyar. (Eskiden pencerenin kendi süzgeci vardı, kaldırıldı.) */
  _havuzdaMi(q){
    return state.bicimSecim[bicimAl(q)] !== false &&
           state.zorlukSecim[+q.zorluk || 2] !== false &&
           (!state.icerikSecim || state.icerikSecim[icerikAl(q)] !== false);
  },
  /* Tek eksen tek başına — panel sayaçları "bu eksen hariç kaç soru kalır"
     diye hesaplanır, böylece öğretmen kapatmadan önce sonucu görür. */
  _bicimGecti(q){ return state.bicimSecim[bicimAl(q)] !== false; },
  _zorlukGecti(q){ return state.zorlukSecim[+q.zorluk || 2] !== false; },
  _icerikGecti(q){ return !state.icerikSecim || state.icerikSecim[icerikAl(q)] !== false; },
  /* Tura girecek sorular: soru TİPİ ve ZORLUK seçimi birlikte uygulanır.
     (Ad geriye dönük uyum için _bicimliSorular olarak kaldı.) */
  _bicimliSorular(){
    return BIY._aktifSorular().filter(BIY._havuzdaMi);
  },
  /* SÜZGEÇ PANELİ — iki sütun: solda soru TİPİ (nasıl cevaplanır),
     sağda soru İÇERİĞİ (ne soruluyor). Sayılar ÇAPRAZ hesaplanır: bir
     seçeneğin yanındaki rakam, DİĞER eksenlerden geçen soru adedidir —
     yani "bunu açarsam kaç soru gelir" doğrudan okunur. */
  /* Panelde yalnız BANKADA KARŞILIĞI OLAN içerik kategorileri gösterilir.
     Boş kategori hem yer kaplıyor hem de bazı adlar (Boşluk doldurma,
     Doğru/Yanlış) soru TİPİ sütunundakilerle karışıyordu. */
  _icerikListesi(){
    if (BIY._icListe) return BIY._icListe;
    const var_ = {};
    KONULAR.forEach(k => (k.sorular || []).forEach(q => { var_[icerikAl(q)] = true; }));
    BIY._icListe = ICERIK_SIRA.filter(k => TIP_BILGI[k] && var_[k]);
    return BIY._icListe;
  },
  _bicimPanelDoldur(){
    const p = $("bicimSecPanel"); if (!p) return;
    const tik = '<span class="biy-bs-tik" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"'
      + ' stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M6 12.5l4 4 8-9"/></svg></span>';
    const havuz = BIY._suzgecHavuzu();
    const bicimSay = {}, icerikSay = {};
    havuz.forEach(q => {
      if (BIY._zorlukGecti(q) && BIY._icerikGecti(q)){ const b = bicimAl(q); bicimSay[b] = (bicimSay[b]||0)+1; }
      if (BIY._zorlukGecti(q) && BIY._bicimGecti(q)){ const i = icerikAl(q); icerikSay[i] = (icerikSay[i]||0)+1; }
    });
    const sayi = n => '<em class="biy-bs-sayi">' + (n || 0) + '</em>';
    p.innerHTML =
      '<div class="biy-bs-bas">Soru süzgeci'
      + '<button type="button" class="biy-bs-kapat" title="Kapat" aria-label="Kapat"'
      + ' onclick="BIY.bicimKapat()">✕</button></div>'
      + '<div class="biy-bs-iki">'
      + '<div class="biy-bs-sutun biy-bs-sutun-tip">'
      +   '<div class="biy-pn-grup">Soru tipi <small>nasıl cevaplanır</small></div>'
      +   Object.keys(BICIM_BILGI).map(b =>
        '<button type="button" class="biy-bs-oge biy-hs-b-'+b+(state.bicimSecim[b] ? ' secili' : '')+'" data-b="'+b+'"' +
        ' title="'+kacis(BICIM_BILGI[b].ad)+'" aria-pressed="'+(state.bicimSecim[b] ? 'true' : 'false')+'"' +
        ' onclick="BIY.bicimToggle(\''+b+'\')">' + (ETIKET_BICIM[b] || "") +
        '<span class="biy-bs-yazi"><b>'+kacis(BICIM_BILGI[b].ad)+sayi(bicimSay[b])+'</b>' +
          '<small>'+kacis(BICIM_ACIKLAMA[b] || "")+'</small></span>' + tik + '</button>'
      ).join("")
      + '</div>'
      + '<div class="biy-bs-sutun biy-bs-sutun-icerik">'
      +   '<div class="biy-pn-grup">Soru içeriği <small>ne soruluyor</small></div>'
      +   '<div class="biy-ic-izgara">'
      +   BIY._icerikListesi().map(k => {
        const bi = TIP_BILGI[k], ac = state.icerikSecim[k] !== false, n = icerikSay[k] || 0;
        return '<button type="button" class="biy-bs-oge biy-ic-oge'+(ac ? ' secili' : '')+(n ? '' : ' biy-bs-bos')+'" data-ic="'+k+'"' +
        ' title="'+kacis(bi.ad)+'" aria-pressed="'+(ac ? 'true' : 'false')+'"' +
        ' onclick="BIY.icerikToggle(\''+k+'\')">' +
        '<span class="biy-ic-rozet" aria-hidden="true">'+bi.emoji+'</span>' +
        '<span class="biy-bs-yazi"><b>'+kacis(bi.ad)+sayi(n)+'</b>' +
          '<small>'+kacis(ICERIK_NOT[k] || "")+'</small></span>' + tik + '</button>'; }).join("")
      +   '</div>'
      + '</div></div>'
      + '<p class="biy-bs-not">Kapattığın tip ya da içerikteki sorular havuzda soluk görünür, seçilemez. Her başlıkta en az bir seçenek açık kalır.</p>';
  },
  bicimToggle(b){
    const sec = state.bicimSecim;
    // en az bir tip secili kalmali
    if (sec[b] && Object.keys(sec).filter(x => sec[x]).length <= 1) return;
    sec[b] = !sec[b];
    BIY._suzgecDegisti();
  },
  icerikToggle(k){
    const sec = state.icerikSecim;
    // en az bir icerik acik kalmali
    if (sec[k] !== false && BIY._icerikListesi().filter(x => sec[x] !== false).length <= 1) return;
    sec[k] = (sec[k] === false);
    BIY._suzgecDegisti();
  },
  /* Üç eksenin ortak dönüşü: sayaçlar çapraz bağımlı olduğu için hangi
     eksen değişirse değişsin HEPSİ yeniden hesaplanır. Ayrıca süzgeç dışına
     düşen seçili sorular sepetten atılır — yoksa listede görünmeyen soru
     sessizce tura girerdi. */
  _suzgecDegisti(){
    BIY._bicimPanelDoldur();
    BIY._zorlukPanelDoldur();
    const set = BIY._secSet();
    if (set.size){
      const gecerli = {};
      KONULAR.forEach(k => (k.sorular || []).forEach(q => {
        if (BIY._havuzdaMi(q)) gecerli[k.id + "#" + q.id] = true; }));
      [...set].forEach(a => { if (!gecerli[a]) set.delete(a); });
    }
    if ($("soruSecListe")) BIY._soruSecRender();
    BIY._soruSayiSinir();
    BIY._soruSecSayiGuncelle();
    BIY._menuDurum();
  },
  /* Aynı anda tek ayar paneli açık kalsın — üst üste binmesinler. */
  _ayarlariKapat(haric){
    if (haric !== "bicim") BIY.bicimKapat();
    if (haric !== "zorluk") BIY.zorlukKapat();
    if (haric !== "sure" && BIY.sureKapat) BIY.sureKapat();
  },
  bicimAcKapat(){
    const p = $("bicimSecPanel"), b = $("bicimSecBtn"); if (!p) return;
    if (p.hidden){
      BIY._ayarlariKapat("bicim");
      BIY._bicimPanelDoldur();
      p.hidden = false;
      if (b) b.setAttribute("aria-expanded", "true");
      BIY._bicimKonumla();
      /* Panelin giriş animasyonu bitmeden ölçülen kutu birkaç piksel
         şaşıyor; animasyon bitince bir kez daha hizala. */
      setTimeout(BIY._bicimKonumla, 230);
      window.addEventListener("resize", BIY._bicimKonumla);
      setTimeout(() => document.addEventListener("mousedown", BIY._bicimDis), 0);
    } else BIY.bicimKapat();
  },
  bicimKapat(){
    const p = $("bicimSecPanel"), b = $("bicimSecBtn");
    if (p) p.hidden = true;
    if (b) b.setAttribute("aria-expanded", "false");
    document.removeEventListener("mousedown", BIY._bicimDis);
    window.removeEventListener("resize", BIY._bicimKonumla);
  },
  _bicimDis(e){ if (!e.target.closest || !e.target.closest("#bicimSec")) BIY.bicimKapat(); },
  /* Süzgeç paneli iki sütunlu olduğu için geniş; dar ekranda sağdan/soldan
     taşmasın diye açılışta ve pencere boyu değişince yatayda kaydırılır. */
  _bicimKonumla(){
    const p = $("bicimSecPanel"); if (!p || p.hidden) return;
    p.style.left = "50%";
    const k = p.getBoundingClientRect(), pay = 10;
    let kay = 0;
    if (k.right > window.innerWidth - pay) kay = (window.innerWidth - pay) - k.right;
    if (k.left + kay < pay) kay = pay - k.left;
    if (kay) p.style.left = "calc(50% + " + Math.round(kay) + "px)";
  },

  /* ---------- ZORLUK SEÇİMİ ----------
     Eskiden havuz penceresinin içindeki süzgecin bir sütunuydu; artık ana
     ekranda, süre ve soru tipi düğmelerinin yanında duruyor. Kapalı olan
     zorluk turda hiç sorulmaz (bkz. _bicimliSorular). */
  zorlukAcKapat(){
    const p = $("zorlukSecPanel"), b = $("zorlukSecBtn"); if (!p) return;
    if (p.hidden){
      BIY._ayarlariKapat("zorluk");
      BIY._zorlukPanelDoldur();
      p.hidden = false;
      if (b) b.setAttribute("aria-expanded", "true");
      BIY._zorlukKonumla();
      setTimeout(BIY._zorlukKonumla, 230);
      window.addEventListener("resize", BIY._zorlukKonumla);
      setTimeout(() => document.addEventListener("mousedown", BIY._zorlukDis), 0);
    } else BIY.zorlukKapat();
  },
  zorlukKapat(){
    const p = $("zorlukSecPanel"), b = $("zorlukSecBtn");
    if (p) p.hidden = true;
    if (b) b.setAttribute("aria-expanded", "false");
    document.removeEventListener("mousedown", BIY._zorlukDis);
    window.removeEventListener("resize", BIY._zorlukKonumla);
  },
  _zorlukDis(e){ if (!e.target.closest || !e.target.closest("#zorlukSec")) BIY.zorlukKapat(); },
  _zorlukKonumla(){
    const p = $("zorlukSecPanel"); if (!p || p.hidden) return;
    p.style.left = "50%";
    const k = p.getBoundingClientRect(), pay = 10;
    let kay = 0;
    if (k.right > window.innerWidth - pay) kay = (window.innerWidth - pay) - k.right;
    if (k.left + kay < pay) kay = pay - k.left;
    if (kay) p.style.left = "calc(50% + " + Math.round(kay) + "px)";
  },
  /* Zorluk paneli, süzgeç paneliyle AYNI görsel dili konuşur: ikon +
     kalın ad + sayı rozeti + bir cümlelik açıklama + tik. Sayı burada da
     çaprazdır (tip ve içerik süzgecinden geçenler). */
  _zorlukPanelDoldur(){
    const p = $("zorlukSecPanel"); if (!p) return;
    const tik = '<span class="biy-bs-tik" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"'
      + ' stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M6 12.5l4 4 8-9"/></svg></span>';
    const say = { 1: 0, 2: 0, 3: 0 };
    BIY._suzgecHavuzu().forEach(q => {
      if (!BIY._bicimGecti(q) || !BIY._icerikGecti(q)) return;
      const z = +q.zorluk || 2; if (say[z] != null) say[z]++;
    });
    p.innerHTML =
      '<div class="biy-bs-bas">Zorluk'
      + '<button type="button" class="biy-bs-kapat" title="Kapat" aria-label="Kapat"'
      + ' onclick="BIY.zorlukKapat()">✕</button></div>'
      + [1,2,3].map(z =>
        '<button type="button" class="biy-bs-oge biy-bs-zor biy-hs-z'+z+(state.zorlukSecim[z] !== false ? ' secili' : '')+'"' +
        ' data-z="'+z+'" aria-pressed="'+(state.zorlukSecim[z] !== false ? 'true' : 'false')+'"' +
        ' onclick="BIY.zorlukToggle('+z+')">' + (ETIKET_ZORLUK[z] || "") +
        '<span class="biy-bs-yazi"><b>'+kacis(ZORLUK_AD[z] || ("Zorluk "+z))
          + '<em class="biy-bs-sayi">'+(say[z] || 0)+'</em></b>' +
          '<small>'+kacis(ZORLUK_ACIKLAMA[z] || "")+'</small></span>' + tik + '</button>'
      ).join("")
      + '<p class="biy-bs-not">Kapattığın zorluktaki sorular havuzda soluk görünür, seçilemez.</p>';
  },
  zorlukToggle(z){
    z = +z;
    const acik = state.zorlukSecim[z] !== false;
    /* Hepsi birden kapatılamaz — kapatılırsa tura girecek soru kalmaz. */
    if (acik && [1,2,3].filter(x => state.zorlukSecim[x] !== false).length <= 1) return;
    state.zorlukSecim[z] = !acik;
    BIY._suzgecDegisti();
  },

  /* ---------- ZORLUĞA GÖRE SORU SÜRESİ ----------
     Üç seviye (kolay/orta/zor) için ayrı süre. Her satırda hazır saniye
     düğmeleri ve bir de ELLE giriş alanı var. Değişiklik anında kaydedilir
     (localStorage) ve bundan SONRAKİ sorulara uygulanır; verilmiş cevapların
     puanı state.turSureleri sayesinde etkilenmez. */
  sureAcKapat(){
    const p = $("sureSecPanel"), b = $("sureSecBtn"); if (!p) return;
    if (p.hidden){
      BIY._surePanelDoldur();
      p.hidden = false;
      if (b) b.setAttribute("aria-expanded", "true");
      BIY._sureKonumla();
      window.addEventListener("resize", BIY._sureKonumla);
      setTimeout(() => document.addEventListener("mousedown", BIY._sureDis), 0);
    } else BIY.sureKapat();
  },
  sureKapat(){
    const p = $("sureSecPanel"), b = $("sureSecBtn");
    if (p) p.hidden = true;
    if (b) b.setAttribute("aria-expanded", "false");
    document.removeEventListener("mousedown", BIY._sureDis);
    window.removeEventListener("resize", BIY._sureKonumla);
  },
  /* Panel düğmesinin altında ortalanır; ama düğme satırın en sağında olduğu
     için dar ekranda ekrandan taşıp yatay kaydırma çubuğu yaratıyordu.
     Ölçüp görünüm alanının içine çekiyoruz. */
  _sureKonumla(){
    const p = $("sureSecPanel"); if (!p || p.hidden) return;
    /* Kaydırmayı TRANSFORM ile değil LEFT ile yapıyoruz: transform
       açılış animasyonuna ait (animation-fill-mode:both onu geri yazar). */
    p.style.left = "50%";
    const k = p.getBoundingClientRect(), pay = 10;
    let kay = 0;
    if (k.right > window.innerWidth - pay) kay = (window.innerWidth - pay) - k.right;
    if (k.left + kay < pay) kay = pay - k.left;
    if (kay) p.style.left = "calc(50% + " + Math.round(kay) + "px)";
  },
  _sureDis(e){ if (!e.target.closest || !e.target.closest("#sureSec")) BIY.sureKapat(); },

  _surePanelDoldur(){
    const p = $("sureSecPanel"); if (!p) return;
    const t = state.sureler || SURE_VARSAYILAN;
    const yildiz = z => '<span class="biy-sr-yildiz">' + "★".repeat(z) +
                        '<span class="biy-sr-sonuk">' + "★".repeat(3 - z) + '</span></span>';
    const satir = z => {
      const v = t[z];
      const tuslar = SURE_SECENEK.map(n =>
        '<button type="button" class="biy-sr-tus' + (n === v ? ' secili' : '') +
        '" data-z="' + z + '" data-n="' + n + '" onclick="BIY.sureSec(' + z + ',' + n + ')">' +
        n + '</button>').join("");
      return '<div class="biy-sr-satir" data-z="' + z + '">' +
        '<span class="biy-sr-ad">' + yildiz(z) + '<b>' + SURE_ETIKET[z] + '</b></span>' +
        '<span class="biy-sr-tuslar">' + tuslar + '</span>' +
        '<span class="biy-sr-elle">' +
          '<input type="number" class="biy-sr-input" id="sureInput' + z + '"' +
          ' min="' + SURE_ENAZ + '" max="' + SURE_ENCOK + '" step="1" value="' + v + '"' +
          ' aria-label="' + SURE_ETIKET[z] + ' için saniye"' +
          ' oninput="BIY.sureElle(' + z + ', this.value)">' +
          '<span class="biy-sr-sn">sn</span>' +
        '</span>' +
      '</div>';
    };
    p.innerHTML =
      '<div class="biy-sr-baslik">Soru süresi <small>zorluğa göre</small></div>' +
      [1,2,3].map(satir).join("") +
      '<div class="biy-sr-alt">' +
        '<button type="button" class="biy-sr-sifirla" onclick="BIY.sureSifirla()">' +
        'Varsayılana dön (30 · 45 · 60)</button></div>';
  },
  /* Hazır düğme */
  sureSec(z, n){ BIY._sureUygula(z, n, true); },
  /* Elle yazma — her tuşta kaydedilir, geçersiz değer yazılırken bozulmaz */
  sureElle(z, v){
    const n = parseInt(v, 10);
    if (!isFinite(n) || n < SURE_ENAZ || n > SURE_ENCOK) return;   // yazım sürüyor olabilir
    BIY._sureUygula(z, n, false);
  },
  _sureUygula(z, n, girdiyiTazele){
    z = parseInt(z, 10); n = parseInt(n, 10);
    if (!SURE_ETIKET[z] || !isFinite(n)) return;
    n = Math.max(SURE_ENAZ, Math.min(SURE_ENCOK, n));
    if (!state.sureler) state.sureler = sureOku();
    state.sureler[z] = n;
    sureYaz(state.sureler);
    /* Hazır düğmelerin seçili hâlini ve (gerekiyorsa) elle alanı tazele.
       Elle yazarken input'u yeniden yazmıyoruz; imleç başa atlardı. */
    const p = $("sureSecPanel"); if (!p) return;
    p.querySelectorAll('.biy-sr-tus[data-z="' + z + '"]').forEach(b => {
      b.classList.toggle("secili", +b.getAttribute("data-n") === n);
    });
    if (girdiyiTazele){ const i = $("sureInput" + z); if (i) i.value = n; }
  },
  sureSifirla(){
    state.sureler = { 1: SURE_VARSAYILAN[1], 2: SURE_VARSAYILAN[2], 3: SURE_VARSAYILAN[3] };
    sureYaz(state.sureler);
    BIY._surePanelDoldur();
  },
  // hazir rakamlar akordiyonu: rakam SVG'sine tiklaninca acilir/kapanir
  sayiAcKapat(){
    const a = $("sayiAkordiyon"), b = $("soruSayiEtiket"); if (!a) return;
    const acik = a.classList.toggle("acik");
    if (b) b.setAttribute("aria-expanded", acik ? "true" : "false");
  },
  // elle seçilen sorular (havuzdan) — sıralı liste
  _secilenSorular(){
    const set = BIY._secSet(); if (!set.size) return [];
    return BIY._soruHavuzu().filter(h => set.has(h.key)).map(h => h.soru);
  },
  /* Soru sayisi ust siniri.
     · Ogretmen asagidan bir sayi sectiyse (soruSayiHavuzdan=false) O SAYI
       KORUNUR; havuz onu ezmez, rakam tuslari acik kalir. Havuzda tavani
       asmaya calisirsa soruSecTik/soruSecTumu uyari verir.
     · Asagidan sayi secilmemisse eski davranis surer: havuzdaki soru adedi
       dogrudan soru sayisi olur. */
  _soruSayiSinir(){
    const havuz = BIY._secSet().size;
    const inp = $("soruSayiInput");
    const lbl = document.querySelector(".biy-sorusayi-secim .biy-seviye-label");
    const tavan = BIY._hsTavan();
    // HAVUZ var + elle secilmis tavan var → tavan korunur, rakamlar acik kalir
    if (havuz > 0 && tavan){
      const kaynak = state.konuId ? BIY._bicimliSorular().length : 50;
      const mx = Math.max(1, Math.min(50, Math.max(kaynak, havuz, tavan)));
      state.soruSayiMax = mx;
      document.querySelectorAll(".biy-sayi-btn").forEach(b => {
        const v = +b.getAttribute("data-sayi"); const dis = v > mx;
        b.disabled = dis; b.classList.toggle("biy-pasif", dis);
        b.classList.toggle("secili", !dis && v === tavan);
      });
      if (inp){
        inp.disabled = false; inp.readOnly = false; inp.classList.remove("biy-secili");
        inp.max = mx; inp.min = 1;
        inp.value = (SORU_SAYI_SECENEK.indexOf(tavan) >= 0) ? "" : tavan;
      }
      BIY._sayiDonDur();
      if (lbl) BIY._sayiEtiket(tavan, "secili");
      return;
    }
    // HAVUZ seçili → soru sayısı = seçilen soru sayısı (sabit); hazır rakamlar pasif, manuel alanda o sayı yazılı
    if (havuz > 0){
      state.soruSayiMax = havuz;
      state.soruSayisi = havuz;
      state.soruSayiHavuzdan = true;   // bu sayı havuzdan geldi → havuz bırakılınca sıfırlanacak
      document.querySelectorAll(".biy-sayi-btn").forEach(b => { b.disabled = true; b.classList.add("biy-pasif"); b.classList.remove("secili"); });
      if (inp){ inp.disabled = false; inp.readOnly = true; inp.max = havuz; inp.min = 1; inp.value = havuz; inp.classList.add("biy-secili"); }
      BIY._sayiDonDur();
      if (lbl) BIY._sayiEtiket(havuz, "havuz");
      return;
    }
    // havuz modundan çıkıldıysa havuz kaynaklı soru sayısını sıfırla (öğretmen yeniden seçsin)
    if (state.soruSayiHavuzdan){ state.soruSayisi = null; state.soruSayiHavuzdan = false; }
    let mevcut;
    // dijital yarışma seçilen zorluğu önceliklendirip gerekirse diğer zorluklardan tamamlar → üst sınır konunun TÜM sorusu
    if (state.konuId) mevcut = BIY._bicimliSorular().length;
    else mevcut = 50;                                                    // konu/havuz yok → sınır uygulanmasın
    const max = Math.max(1, Math.min(50, mevcut));
    state.soruSayiMax = max;
    document.querySelectorAll(".biy-sayi-btn").forEach(b => {
      const v = +b.getAttribute("data-sayi"); const dis = v > max;
      b.disabled = dis; b.classList.toggle("biy-pasif", dis);
    });
    if (inp){ inp.disabled = false; inp.readOnly = false; inp.classList.remove("biy-secili"); inp.max = max; inp.min = 1; inp.placeholder = "≤ " + max; }
    if (state.soruSayisi == null){ if (lbl) BIY._sayiEtiket(max, "sinir"); BIY._sayiDon(); }
    if (state.soruSayisi != null){ if (state.soruSayisi > max) BIY.setSoruSayisi(max); else BIY.setSoruSayisi(state.soruSayisi); }
    else { document.querySelectorAll(".biy-sayi-btn").forEach(b => b.classList.remove("secili")); if (inp) inp.value = ""; }
  },
  // soru sayisi etiketi: yazi yerine SVG rozeti — rakam sayarak degisir
  // kip: "sinir" (ust sinir) | "secili" (ogretmenin sectigi sayi) | "havuz"
  _sayiEtiket(n, kip){
    const kap = $("soruSayiEtiket"); if (!kap) return;
    const svg = kap.querySelector("svg");
    if (svg){
      svg.classList.toggle("biy-ss-havuz",  kip === "havuz");
      svg.classList.toggle("biy-ss-secili", kip === "secili");
      const metin = kip === "havuz"  ? "Soru sayısı (havuzdan " + n + ")"
                  : kip === "secili" ? "Soru sayısı: " + n
                                     : "Soru sayısı (en çok " + n + ")";
      const bas = svg.querySelector("title"); if (bas) bas.textContent = metin;
      svg.setAttribute("aria-label", metin);
    }
    BIY._sayiAnim(n);
  },
  // bosta: rakam yarim saniyede bir 10 / 20 / 25 / 50 arasinda karisik degisir
  _sayiDon(){
    if (state.sayiDonZmn) return;                 // zaten donuyor
    state.sayiDonZmn = setInterval(() => {
      if (state.soruSayisi != null){ BIY._sayiDonDur(); return; }
      const max = state.soruSayiMax || 50;
      const liste = SORU_SAYI_SECENEK.filter(v => v <= max);
      if (liste.length < 2) return;               // tek secenek kaldiysa donmeye gerek yok
      const t = $("soruSayiRakam"); if (!t) return;
      const simdi = parseInt(t.textContent, 10);
      const kalan = liste.filter(v => v !== simdi);
      const n = kalan[Math.floor(Math.random() * kalan.length)];
      BIY._sayiAnim(n, true);
    }, 500);
  },
  _sayiDonDur(){
    if (state.sayiDonZmn){ clearInterval(state.sayiDonZmn); state.sayiDonZmn = null; }
  },
  // rakami eski degerden yeni degere sayarak getir + rozeti sictir
  _sayiAnim(hedef, ani){
    const t = $("soruSayiRakam"); if (!t) return;
    hedef = Math.max(0, parseInt(hedef, 10) || 0);
    const bas = parseInt(t.textContent, 10);
    const svg = t.closest("svg");
    if (ani){
      // bosta donerken: sadece rakam cevrilsin, rozet nefes almaya devam etsin
      t.classList.remove("biy-ss-cevir");
      void t.getBoundingClientRect();            // sinifi yeniden tetiklemek icin
      t.classList.add("biy-ss-cevir");
      clearTimeout(state.sayiCevirZmn);
      state.sayiCevirZmn = setTimeout(() => t.classList.remove("biy-ss-cevir"), 430);
    } else if (svg){
      svg.classList.remove("biy-ss-atar");
      void svg.getBoundingClientRect();
      svg.classList.add("biy-ss-atar");
      clearTimeout(state.sayiAtarZmn);
      state.sayiAtarZmn = setTimeout(() => svg.classList.remove("biy-ss-atar"), 560);
    }
    // ani: rakam bir anda degissin (bostaki donme icin — yarim saniye okunakli kalir)
    if (isNaN(bas) || ani){
      if (state.sayiRaf){ cancelAnimationFrame(state.sayiRaf); state.sayiRaf = null; }
      t.textContent = hedef; return;
    }
    if (bas === hedef) return;
    if (state.sayiRaf) cancelAnimationFrame(state.sayiRaf);
    const sure = 450, t0 = (performance && performance.now) ? performance.now() : 0;
    const adim = (z) => {
      const p = Math.min(1, (z - t0) / sure);
      const e = 1 - Math.pow(1 - p, 3);          // yumusak yavaslama
      t.textContent = Math.round(bas + (hedef - bas) * e);
      if (p < 1) state.sayiRaf = requestAnimationFrame(adim);
      else { t.textContent = hedef; state.sayiRaf = null; }
    };
    state.sayiRaf = requestAnimationFrame(adim);
  },
  _pdfOnizleGuncelle(){
    const havuz = BIY._secSet().size;
    const k = BIY._aktifKonu();
    const baslik = $("pdfBaslik"); if (baslik) baslik.textContent = havuz > 0 ? "Karışık" : (k ? (k.ad || "") : "");
    const kart = $("pdfKart"), indir = $("pdfIndir");
    // PDF'ler henüz hazır değil → tüm önizleme bloğunu gizle (PDF_AKTIF=true olunca geri gelir)
    const blok = kart && kart.closest(".biy-pdf-onizleme");
    if (blok) blok.classList.toggle("gizli", !PDF_AKTIF);
    if (!PDF_AKTIF){
      if (kart){ kart.removeAttribute("href"); kart.classList.add("biy-pasif"); }
      if (indir){ indir.removeAttribute("href"); indir.classList.add("gizli"); }
      return;
    }
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
    if (!list.length){ liste.innerHTML = '<p class="biy-alt" style="text-align:center">Bu seviyede henüz örnek yok.</p>'; return; }
    // her soru tipinden yalnızca bir örnek göster (tüm sorular değil)
    const gorulen = new Set(); const ornekler = [];
    list.forEach(s => { if (!gorulen.has(s.tip)){ gorulen.add(s.tip); ornekler.push(s); } });
    ornekler.forEach(s => liste.appendChild(BIY._soruKartEl(s, true)));
  },
  _soruKartEl(s, dogruGoster){
    const t = TIP_BILGI[s.tip] || { ad: s.tip, emoji: "❓" };
    const kart = document.createElement("div"); kart.className = "biy-soru-kart";
    const sikHtml = sikKartHtml(s, dogruGoster);
    kart.innerHTML =
      etiketHtml(s) +
      '<div class="biy-soru-metin">'+ soruHtml(s) +'</div>' +
      (s.arapca ? '<div class="biy-soru-arapca">'+ kacis(s.arapca) +'</div>' : '') +
      '<div class="biy-secenekler">'+ sikHtml +'</div>';
    return kart;
  },

  // ana menü kartları: geçerli içerik (havuz soruları veya soru içeren konu) seçiliyken aktif olur
  _menuDurum(){
    const havuz = BIY._secSet().size;
    const konuVar = (BIY._bicimliSorular().length > 0);
    const icerik = havuz > 0 || konuVar;                 // konu ya da havuzdan soru
    const sayiSecili = (state.soruSayisi != null && state.soruSayisi > 0);  // soru sayısı seçili
    const aktif = icerik && sayiSecili;
    ["kartTakim", "kartBirey", "kartOkul"].forEach(id => { const el = $(id); if (el) el.classList.toggle("biy-pasif", !aktif); });
    const not = $("menuNot"); if (not) not.classList.toggle("gizli", aktif);
    BIY._dijitalKartDurum();
  },
  // bağlı cihaz varsa Dijital Yarışma kartının çerçevesi yeşil + rozet
  _dijitalKartDurum(){
    const bagli = (state.takimListe || []).filter(t => t.bagli).length;
    const aktifOda = !!state.odaId && bagli > 0;
    // rozet yalnızca odanın açıldığı modun kartında görünür
    const kartId = { takim: "kartTakim", birey: "kartBirey", okul: "kartOkul" };
    Object.keys(kartId).forEach(m => {
      const el = $(kartId[m]); if (!el) return;
      const bu = aktifOda && modAl() === m;
      el.classList.toggle("biy-bagli-var", bu);
      const r = el.querySelector(".biy-bagli-rozet");
      if (r){ r.textContent = "● " + bagli + " bağlı cihaz"; r.classList.toggle("gizli", !bu); }
    });
  },

  /* ---------- Lobi (üç mod ortak) ---------- */
  acTakimlar(){ return BIY.acLobi("takim"); },
  acLobi(mod){
    if (!MOD_BILGI[mod]) mod = "takim";
    // başka modda açık bir oda varsa önce onay iste
    if (state.odaId && state.oyunModu !== mod){
      const eskiAd = (MOD_BILGI[state.oyunModu] || {}).ad || "Yarışma";
      BIY._onay("Sistem değiştirilsin mi?",
        "Açık bir oda var: " + eskiAd + ". Sistemi değiştirirsen o oda ve cihazları bırakılır.",
        "Evet, değiştir", () => BIY._lobiAc(mod));
      return;
    }
    BIY._lobiAc(mod);
  },
  async _lobiAc(mod){
    if (state.oyunModu !== mod){        // gerçek mod değişimi → eski odayı bırak
      BIY._odaBirak();
      state.oyunModu = mod;
    }
    state.oyunModu = mod;
    ekranGoster("ekranTakimlar");
    BIY._lobiDuzen();
    if (!state.odaId){
      $("takimlarGrid").innerHTML = "";
      const b = $("baslatBtn"); if (b) b.classList.add("gizli");
      const n = $("baslatNot"); if (n) n.textContent = "";
      BIY._kontrolleriAc();
    }
    BIY._soruSayiSinir(); BIY._soruSecSayiGuncelle();
    // birey/okul: oda hemen kurulur ki ortak karekod ekranda dursun
    if (tekKarekod()){
      try { await BIY._odayiHazirla(); BIY._odaKarekodCiz(); }
      catch(e){ console.error(e); $("baslatNot").textContent = "Oda kurulamadı: " + (e.code || e.message); }
    }
  },
  // odayı bırak (silmez): abonelikleri kapat, ekranı temizle
  _odaBirak(){
    if (state.takimAbone){ state.takimAbone(); state.takimAbone = null; }
    if (state.odaAboneAdmin){ state.odaAboneAdmin(); state.odaAboneAdmin = null; }
    if (state.cevapAbone){ state.cevapAbone(); state.cevapAbone = null; }
    state.odaId = null; state.oda = null; state.takimListe = []; state.bekleyenListe = [];
    state.baglSet = null; state.baglIlk = false; state.cevaplar = {};
    BIY._temizleKayit();
  },
  // lobi ekranının hangi bölümleri görünecek (moda göre)
  _lobiDuzen(){
    const m = modAl(), bilgi = MOD_BILGI[m];
    const bas = $("lobiBaslik"); if (bas) bas.textContent = bilgi.emoji + " " + bilgi.baslik;
    const goster = (id, evet) => { const el = $(id); if (el) el.classList.toggle("gizli", !evet); };
    /* Takım ve Okul modu aynı akış: öğretmen ad yazar, her ada bir karekod
       çıkar. Tek ortak karekod + onay kuyruğu yalnız Birey modundadır.     */
    goster("takimYapAlan", m !== "birey");
    goster("lobiOdaAlan",  m === "birey");
    goster("lobiBekleyen", m === "birey");
    const grid = $("takimlarGrid");
    if (grid) grid.className = (m === "birey") ? "biy-kat-liste" : "biy-takimlar-grid";
    // ekleme alanının yazıları moda göre (takım adı / sınıf adı)
    const inp = $("takimAdiInput");
    if (inp) inp.placeholder = (m === "okul") ? "Sınıf adı (7/A)" : "Takım adı";
    const ekleBtn = $("takimEkleBtn");
    if (ekleBtn) ekleBtn.textContent = (m === "okul") ? "+ Sınıf Ekle" : "+ Takım Ekle";
  },
  // --- Kalıcılık (sayfa yenilense de oyun kaybolmasın) ---
  _kaydet(){
    try { localStorage.setItem('biy_aktif', JSON.stringify({ oda: state.odaId, sorular: state.oyunSorulari, yedek: state.yedekSorular, yedekMap: state.yedekSoruMap, seviye: state.seviye, soruSayisi: state.soruSayisi, turSureleri: state.turSureleri,
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
      const od0 = snap.data() || {};
      state.oyunModu = MOD_BILGI[od0.mod] ? od0.mod : "takim";
      state.oyunSorulari = Array.isArray(kayit.sorular) ? kayit.sorular : [];
      state.yedekSorular = Array.isArray(kayit.yedek) ? kayit.yedek : [];
      state.yedekSoruMap = kayit.yedekMap || {};
      state.soruSayisi = kayit.soruSayisi || 20;
      /* Sayfa yenilendiyse soru süreleri de geri gelsin; yoksa puan hesabı
         eski cevaplar için yanlış süreyle çalışırdı. */
      state.turSureleri = (kayit.turSureleri && typeof kayit.turSureleri === 'object')
                          ? kayit.turSureleri : {};
      if (!Object.keys(state.turSureleri).length)
        state.oyunSorulari.forEach((q, i) => { state.turSureleri[i] = soruSuresi(q); });
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
      "Yarışma durur ve lobiye dönülür. Cihazlar bağlı kalır — konuyu ya da soru sayısını değiştirip yeniden başlayabilirsin.",
      "Evet, dön", function(){ BIY.lobiyeDon(); });
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
          sonSira: [], berHedef: 0, berTakimlar: [], berSabit: {}, berNo: 0,
          iptal: []   // yeni tur → önceki turun iptalleri taşınmaz
        });
      }
    } catch(e){ console.error(e); }
    // 3) oyun/beraberlik state'ini sıfırla (odaId ve takımlar korunur)
    state.oyunSorulari = []; state.oda = null; state.otoSonucIndex = -1; state.sonucAnimIndex = -1; state.finalKonfeti = false;
    state.hepsiSesIndex = -1;
    state.yedekSorular = []; state.yedekSoruMap = {}; state.berHedef = 0; state.berTakimlar = []; state.berSabit = {}; state.berNo = 0; state.berSorular = [];
    state.iptalModu = false; state.raporAcik = {};
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
    state.ayarKilidiKapali = false; state.iptalModu = false; state.raporAcik = {};
    if (state.secilenSet) state.secilenSet.clear(); BIY._soruSecSayiGuncelle();
    BIY._kontrolleriAc();
    const bB = $("baslatBtn"); if (bB) bB.classList.add("gizli");
    const bN = $("baslatNot"); if (bN) bN.textContent = "";
    BIY.anasayfa();
  },
  // takım silinince/yarış bitince kilitli tüm ayar kontrollerini yeniden aç
  _kontrolleriAc(){
    document.querySelectorAll(".biy-seviye-btn, .biy-sayi-btn, .biy-bicim-btn, .biy-bs-oge").forEach(b => { b.disabled = false; b.classList.remove("biy-pasif"); });
    ["soruSayiInput", "soruSecBtn", "konuSecim", "konuSeciciBtn"].forEach(id => { const el = $(id); if (el){ el.disabled = false; el.classList.remove("biy-pasif"); } });
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
      mod: modAl(), iptal: [],
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
    } catch(e){ console.error(e); $("baslatNot").textContent = (modAl()==="okul"?"Sınıf":"Takım") + " Eklenmedi: " + (e.code || e.message); }
  },
  _takimlariCiz(snap){
    state.takimListe = []; state.bekleyenListe = [];
    snap.forEach(doc => {
      const t = doc.data();
      const k = { id: doc.id, ad: t.ad, bagli: !!t.bagli, puan: t.puan || 0, krk: t.krk || "" };
      if (t.atildi || t.red) return;                 // çıkarılan / reddedilen listede yok
      if (t.onay === false) state.bekleyenListe.push(k);   // onay bekliyor
      else state.takimListe.push(k);                        // takım modunda onay alanı hiç yoktur
    });
    let sayi = state.takimListe.length;
    let bagli = state.takimListe.filter(t => t.bagli).length;
    if (kartliMod()) BIY._takimKartlariCiz(); else BIY._katilimcilariCiz();
    // takım eklendiyse zorluk seviyesi, soru sayısı ve soru seçimi kilitlenir; hepsi silinince açılır
    // (lobiye dönüldüyse ayarKilidiKapali=true → takım bağlıyken de değiştirilebilir)
    const kilit = sayi > 0 && !state.ayarKilidiKapali;
    document.querySelectorAll(".biy-seviye-btn, .biy-sayi-btn, .biy-bicim-btn, .biy-bs-oge").forEach(b => { b.disabled = kilit; b.classList.toggle("biy-pasif", kilit); });
    const sInp = $("soruSayiInput"); if (sInp){ sInp.disabled = kilit; sInp.classList.toggle("biy-pasif", kilit); }
    const ssBtn = $("soruSecBtn"); if (ssBtn){ ssBtn.disabled = kilit; ssBtn.classList.toggle("biy-pasif", kilit); }
    const kSel = $("konuSecim"); if (kSel){ kSel.disabled = kilit; kSel.classList.toggle("biy-pasif", kilit); }
    const kBtn = $("konuSeciciBtn");
    if (kBtn){ kBtn.disabled = kilit; kBtn.classList.toggle("biy-pasif", kilit); if (kilit) BIY.konuListeKapat(); }
    const sLbl = document.querySelector(".biy-sorusayi-secim .biy-seviye-label");
    const zLbl = document.querySelector(".biy-seviye-secim .biy-seviye-label");
    if (zLbl) zLbl.classList.toggle("biy-pasif", kilit);
    if (sLbl) sLbl.classList.toggle("biy-pasif", kilit);
    if (!kilit) BIY._soruSayiSinir();   // kilit açıldıysa mevcut soruya göre üst sınırı yeniden uygula

    const baslat = $("baslatBtn");
    const d = BIY._baslatDurumu();
    if (d.olur) baslat.classList.remove("gizli"); else baslat.classList.add("gizli");
    $("baslatNot").textContent = d.not;
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
    BIY._sayiDonDur();
    BIY._sayiEtiket(n, "secili");
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
    BIY._sayiDonDur();
    BIY._sayiEtiket(n, "secili");
    BIY._menuDurum();
  },

  async yarisiBaslat(){
    if (!state.odaId) return;
    const d0 = BIY._baslatDurumu();
    if (!d0.olur){ $("baslatNot").textContent = d0.not; return; }

    let secilen, yedek;
    const elle = BIY._secilenSorular();   // öğretmenin havuzdan elle seçtiği sorular
    if (elle.length){
      // MANUEL: yalnızca öğretmenin görüp seçtiği sorular sorulur
      let hv = elle.slice();
      if (!hv.every(q => q.sabitSira))   // sabit sıralı set karıştırılmaz
      for (let i = hv.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); const g = hv[i]; hv[i] = hv[j]; hv[j] = g; }
      /* asagidan secilen sayi tavandir: havuz daha kalabalik kaldiysa kirp */
      const tavanB = BIY._hsTavan();
      if (tavanB && hv.length > tavanB) hv = hv.slice(0, tavanB);
      secilen = hv.map(soruHazirla);
      yedek = [];   // görülmemiş yedek sorulmaz
    } else {
      const tumu = BIY._bicimliSorular().slice();   // konunun tüm soruları (yalnız seçili biçimler)
      if (!tumu.length){ $("baslatNot").textContent = "«" + (BIY._aktifKonu() ? BIY._aktifKonu().ad : "") + "» konusunda henüz soru yok."; return; }
      for (let i = tumu.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); const g = tumu[i]; tumu[i] = tumu[j]; tumu[j] = g; }
      const hedefSayi = Math.max(1, Math.min(50, state.soruSayisi || TUR_SORU_SAYISI));
      secilen = tumu.slice(0, Math.min(hedefSayi, tumu.length)).map(soruHazirla);
      yedek = tumu.slice(secilen.length).map(soruHazirla);
    }
    state.oyunSorulari = secilen;
    /* Her sorunun süresini TUR BAŞINDA dondur: öğretmen ayarları tur
       ortasında değiştirse bile verilmiş cevapların puanı değişmesin. */
    state.turSureleri = {};
    secilen.forEach((q, i) => { state.turSureleri[i] = soruSuresi(q); });
    state.yedekSorular = yedek;   // beraberlikte yedek olarak kullanılır
    state.yedekSoruMap = {};
    state.berHedef = 0; state.berTakimlar = []; state.berSabit = {}; state.berNo = 0; state.berSorular = [];
    state.ayarKilidiKapali = false;   // yeni tur başladı → normal kilit davranışı
    await BIY._cevaplariSil();         // oda yeniden kullanılıyorsa eski cevapları temizle
    try {
      await db.collection(KOLEKSIYON).doc(state.odaId).update({
        durum: "oyun", faz: "cevap", aktifIndex: 0, toplamSoru: secilen.length,
        soruSuresi: soruSuresi(secilen[0]),
        mod: modAl(), iptal: [],
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
    /* CANLI TAHTA — sorunun geçtiği kalıplar tablosu iframe'de sürülür.
       Tüm iş oyunlar/biy_tahta.js'te; burada tek çağrı var. Soruda
       "tahta" alanı yoksa modül hiçbir şey göstermez, yani diğer
       konular bundan etkilenmez. */
    try { if (window.BIYTahta) window.BIYTahta.durum(o, BIY._soruByIndex(o.aktifIndex || 0)); }
    catch (e) { /* tahta düşerse yarışma devam etsin */ }
    if (o.durum === "bitti"){
      sayacDurdur(); BIY._sonucTemizle();
      // rapordan iptal yapılınca ekran baştan çizilir; okunan yer kaçmasın
      const kaydirma = window.pageYOffset || 0;
      kap.innerHTML = BIY._leaderboardHtml(true);
      if (kaydirma) window.scrollTo(0, kaydirma);
      if (!state.finalKonfeti){ state.finalKonfeti = true; BIY._konfetiPatlat(); }
      return;
    }
    const ber = (o.durum === "beraberlik");
    const idx = o.aktifIndex || 0;
    const soru = BIY._soruByIndex(idx);
    if (!soru){ kap.innerHTML = '<div class="biy-oyun-orta"><p class="biy-alt">Bu turun soruları bulunamadı (sayfa yenilenmiş olabilir). Yarışmayı yeniden başlat.</p><button class="biy-btn biy-btn-mavi" onclick="BIY.anasayfa()">Ana Menü</button></div>'; return; }
    const sonuc = (o.faz === "sonuc");
    const t = TIP_BILGI[soru.tip] || { ad: soru.tip, emoji: "❓" };
    // SONUÇ EKRANI — soru ekranından tamamen ayrı (adım adım animasyonlu)
    if (sonuc){
      sayacDurdur();
      const taze = (state.sonucAnimIndex !== idx);
      /* Yeniden çizimde (geç gelen cevap, iptal düğmesi…) öğretmenin o an
         baktığı sahne korunur; yoksa iptale basınca ekran liderlik
         tablosuna sıçrıyor ve cevaplar tablosu gözden kayboluyordu. */
      const eskiEl = kap.querySelector(".biy-sonuc-ekran");
      const eskiAdim = (!taze && eskiEl) ? eskiEl.getAttribute("data-step") : null;
      kap.innerHTML = BIY._sonucEkranHtml(idx, soru, taze);
      if (eskiAdim != null){ const y = kap.querySelector(".biy-sonuc-ekran"); if (y) y.setAttribute("data-step", eskiAdim); }
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
    const opt = tahtaIcerikHtml(soru, !!sonuc);
    // üst bilgi + sayaç
    const kalan = kalanSaniye();
    const yuzde = Math.max(0, Math.min(100, (kalan / (o.soruSuresi || SORU_SURESI)) * 100));
    const gizli = state.soruGizli;
    // göz ikonu (tur sırasının yanında): açık göz = görünür (tıkla gizle), çapraz göz = gizli (tıkla göster)
    const gozSvg = state.soruGizli
      ? '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
      : '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    const gozBtn = '<button class="biy-gizle-svg" title="'+(state.soruGizli?'Soruyu göster':'Soruyu gizle')+'" onclick="BIY.soruGizleToggle()">'+gozSvg+'</button>';

    const cips = BIY._ciplerHtml(katilan, buCevaplar);
    const hepsi = katilan.length > 0 && cevapSayisi >= katilan.length;

    const sayacHtml = '<div class="biy-sayac"><span id="sayacNum">'+kalan+'</span><small>sn</small></div>';
    const barHtml = '<div class="biy-sayac-bar"><i style="width:'+yuzde+'%"></i></div>';
    const siraMetin = ber
      ? '⚔️ '+(o.berHedef===1?'Liderlik':'İkincilik')+' · Yedek Soru '+o.berNo
      : 'Soru '+(idx+1)+' / '+(o.toplamSoru||state.oyunSorulari.length);

    let govde =
      '<div class="biy-oyun-ust">' +
        '<div class="biy-oyun-sira'+(ber?' biy-ber':'')+'">'+siraMetin+' '+gozBtn+'</div>' +
        '<div class="biy-oyun-tip"></div>' +
        // soru gizliyken geri sayım üstte değil, aşağıda büyük gösterilir
        (gizli ? '' : sayacHtml) +
      '</div>' +
      (gizli ? '' : barHtml);

    // soru gizliyken hiçbir kutu gösterilmez (sınıf durumu + geri sayım aşağıda büyük)
    if (!gizli){
      govde += etiketHtml(soru) + '<div class="biy-oyun-soru">'+ soruHtml(soru) +'</div>' +
        (soru.arapca ? '<div class="biy-oyun-arapca">'+ kacis(soru.arapca) +'</div>' : '') +
        '<div class="biy-a-optlar" data-n="'+ sikSayisi(soru) +'">'+ opt +'</div>';
    }
    // sınıfların durumu (gizliyken çok daha büyük)
    const kaydir = (modAl() === "birey" && katilan.length > 10) ? " biy-kaydir" : "";
    govde += '<div class="biy-cevap-durum'+(gizli?' biy-dev':'')+'">'+cevapSayisi+' / '+katilan.length+' cevapladı'+(hepsi?' — sonuç açılıyor…':'')+'</div>' +
             '<div class="biy-cipler'+(gizli?' biy-dev':'')+kaydir+'">'+cips+'</div>';
    // gizliyken geri sayım AŞAĞIDA ve devasa
    if (gizli){
      govde += '<div class="biy-alt-sayac">'+barHtml+'<div class="biy-sayac biy-sayac-dev"><span id="sayacNum">'+kalan+'</span><small>sn</small></div></div>';
    }

    kap.innerHTML = '<div class="biy-oyun-orta">'+govde+'</div>';

    // her yeni cevapta kısa ses (kurucunun cihazında); son cevapta
    // 'tümü cevapladı' melodisi çalacağı için blip atlanır. Sayfa yenilenince
    // sayaç mevcut cevap sayısıyla başlar → eski cevaplar için çalmaz.
    if (state.cevapSesIndex !== idx){ state.cevapSesIndex = idx; state.cevapSesSayi = cevapSayisi; }
    else if (cevapSayisi > state.cevapSesSayi){
      if (!hepsi) SES.cevapGeldi();
      state.cevapSesSayi = cevapSayisi;
    }
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
  /* Bir doğru cevabın puanı KIRILIMI.
     taban  = TOPLAM_PUAN / soru sayısı        (soru başına düşen pay)
     sabit  = tabanın (1 - ZAMAN_PAYI) kadarı  (herkese aynı, hızdan bağımsız)
     hizPay = tabanın ZAMAN_PAYI kadarı        (kalan süreyle orantılı bonus)
     _cevapPuani bu nesnenin sadece .puan alanını döndürür; böylece "hız puan
     detayı" raporu ile canlı puan hesabı tek formülden beslenir, ikisi
     birbirinden ayrışamaz. */
  _puanParca(c){
    const o = state.oda || {};
    const toplam = o.toplamSoru || state.oyunSorulari.length || state.soruSayisi || 1;
    /* O sorunun KENDİ süresi. Zorluğa göre süre geldiğinden odadaki güncel
       soruSuresi ile hesaplamak eski cevapların hız payını bozardı. */
    const sure = (state.turSureleri && state.turSureleri[c.index])
                 || o.soruSuresi || SORU_SURESI;
    const taban = TOPLAM_PUAN / toplam;
    let hiz = (typeof c.kalan === 'number') ? (c.kalan / sure) : 1;   // eski cevaplarda kalan yoksa tam say
    hiz = Math.max(0, Math.min(1, hiz));
    const sabit = Math.round(taban * (1 - ZAMAN_PAYI));
    const puan  = Math.round(taban * (1 - ZAMAN_PAYI + ZAMAN_PAYI * hiz));
    return {
      taban:  Math.round(taban),
      sabit:  sabit,
      hizPuan: puan - sabit,                 // yuvarlama farkı sabit'e değil bonusa yazılır ki sabit+bonus=puan
      hizMax: Math.round(taban) - sabit,     // alınabilecek en yüksek hız bonusu
      yuzde:  Math.round(hiz * 100),
      kalan:  (typeof c.kalan === 'number') ? c.kalan : null,
      sure:   sure,
      puan:   puan
    };
  },
  _cevapPuani(c){ return BIY._puanParca(c).puan; },

  /* ---------- SORU / CEVAP İPTALİ (kopya · hatalı soru) ----------
     Oda dokümanındaki `iptal` dizisi tek doğruluk kaynağıdır:
       "s3"        → 3. sorunun TAMAMI iptal (hatalı soru; kimseye puan yazmaz)
       "s3:t1"     → yalnız t1 katılımcısının 3. sorudaki cevabı iptal (kopya)
     Dizi olması bilinçli: arrayUnion/arrayRemove atomiktir, iki cihaz aynı
     anda dokunsa bile birbirinin yazdığını ezmez. Oda dokümanı zaten
     onSnapshot ile dinlendiği için iptal, canlı puana / sıralamaya /
     Firestore toplamlarına kendiliğinden yansır.
     Taban puan iptalden ETKİLENMEZ: iptal edilen soru, ulaşılabilir toplamı
     düşürür; kalan sorulara puan dağıtılıp önceki ekranlarda görülen sayılar
     geriye dönük şişmez. */
  _iptalListe(){ const o = state.oda || {}; return Array.isArray(o.iptal) ? o.iptal : []; },
  _soruIptalMi(idx){ return BIY._iptalListe().indexOf("s" + idx) >= 0; },
  _cevapIptalMi(idx, takimId){
    const L = BIY._iptalListe();
    return L.indexOf("s" + idx) >= 0 || L.indexOf("s" + idx + ":" + takimId) >= 0;
  },
  _iptalVarMi(){ return BIY._iptalListe().length > 0; },

  /* İptal modu YALNIZCA öğretmenin ekranındaki düğmeleri açıp kapatır, veriye
     dokunmaz. Kapalıyken sonuç tablosu bire bir eskisi gibi (ad · durum ·
     cevap) kalır — sınıfa yansıtılan görüntü düğmelerle kalabalıklaşmasın. */
  iptalModuToggle(){ state.iptalModu = !state.iptalModu; BIY._renderAdminOyun(); },

  // ortak yazıcı: anahtarı iptal dizisine ekler ya da diziden çıkarır
  async _iptalYaz(anahtar, ekle){
    if (!state.odaId) return;
    // 1) yerel iyimser güncelleme → düğme ağ beklemeden tepki versin
    const L = BIY._iptalListe().slice();
    const yer = L.indexOf(anahtar);
    if (ekle){ if (yer < 0) L.push(anahtar); } else { if (yer >= 0) L.splice(yer, 1); }
    if (state.oda) state.oda.iptal = L;
    BIY._renderAdminOyun();
    // 2) kalıcı yazım (atomik) + takım belgelerindeki toplam puanı eşitle
    try {
      await db.collection(KOLEKSIYON).doc(state.odaId).update({
        iptal: ekle ? firebase.firestore.FieldValue.arrayUnion(anahtar)
                    : firebase.firestore.FieldValue.arrayRemove(anahtar)
      });
      await BIY._puanlariGuncelle();
    } catch(e){ console.error(e); }
  },
  // tek katılımcının o sorudaki cevabı (kopya) — basınca iptal, yine basınca geri al
  cevapIptal(idx, takimId){
    const a = "s" + idx + ":" + takimId;
    BIY._iptalYaz(a, BIY._iptalListe().indexOf(a) < 0);
  },
  // sorunun tamamı (hatalı soru) — basınca iptal, yine basınca geri al
  soruIptal(idx){
    const a = "s" + idx;
    BIY._iptalYaz(a, BIY._iptalListe().indexOf(a) < 0);
  },

  // belirli index'e kadar (dahil) her takımın toplam puanı (yedekler dahil)
  _puanKumul(cutoff){
    const t = {};
    Object.values(state.cevaplar).forEach(c => {
      if (c.index > cutoff) return;
      if (BIY._cevapIptalMi(c.index, c.takimId)) return;   // iptal edilen cevap puan getirmez
      const s = BIY._soruByIndex(c.index); if (!s) return;
      if (cevapDogruMu(s, c.secilen)) t[c.takimId] = (t[c.takimId] || 0) + BIY._cevapPuani(c);
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
    const optHtml = tahtaIcerikHtml(soru, true);
    // sınıfların sonucu: seçtikleri şık + doğru/yanlış (beraberlikte yalnızca beraber olanlar)
    const cevapTakimlari = BIY._aktifTakimlar();
    /* İPTAL: mod kapalıyken tablo bire bir eski hâlinde (3 sütun) kalır;
       yalnız iptal EDİLMİŞ satırlar her hâlükârda "🚫 İptal" görünür ki
       sınıfa yansıyan ekran gerçeği söylesin. Düğme sütunu ise sadece
       öğretmen iptal modunu açtığında eklenir. */
    const iptalAcik = !!state.iptalModu;
    const soruIptalli = BIY._soruIptalMi(idx);
    const satir = cevapTakimlari.map((tk,ri) => {
      const c = buCevaplar[tk.id]; const dogruMu = !!(c && cevapDogruMu(soru, c.secilen));
      const kesik = BIY._cevapIptalMi(idx, tk.id);
      const secim = c ? secimHtml(soru, c.secilen) : '<span class="biy-rev-yok">—</span>';
      const durum = kesik ? '🚫 İptal' : (c ? (dogruMu ? '✅ Doğru' : '❌ Yanlış') : '⏳ Cevapsız');
      const sinif = (kesik ? 'iptal ' : '') + (c ? (dogruMu ? 'dogru' : 'yanlis') : 'yok');
      // yalnız iptal modunda: satır başına tek düğme (bas → iptal, yine bas → geri al)
      let islem = '';
      if (iptalAcik){
        islem = soruIptalli
          ? '<td class="biy-rev-islem"><span class="biy-rev-islem-bos">—</span></td>'
          : '<td class="biy-rev-islem"><button class="biy-mini-iptal'+(kesik?' geri':'')+'" onclick="BIY.cevapIptal('+idx+',\''+kacis(tk.id)+'\')" title="'+
            (kesik ? 'İptali geri al' : 'Bu cevabı iptal et (kopya)')+'">'+(kesik ? '↩' : '🚫')+'</button></td>';
      }
      /* SÜTUN SIRASI: ad → durum → verilen cevap.
         Ad ile durum yan yana dursun ki "kim doğru bildi" tek bakışta
         okunsun; verilen cevap (uzunluğu değişken, Arapça olabilir) en
         sağa yaslanır. İşlem sütunu (varsa) en sona eklenir; genişliği
         sabit ve dar olduğu için cevap sütunu yine boşluğu yutar. */
      return '<tr class="'+sinif+'" style="--r:'+ri+'">' +
        '<td class="biy-rev-ad">'+krkSvg(tk.krk, "biy-krk-mini")+kacis(tk.ad)+'</td>' +
        '<td class="biy-rev-durum">'+durum+'</td>' +
        '<td class="biy-rev-sik">'+secim+'</td>' + islem + '</tr>';
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
    const adOf  = id => { const t = state.takimListe.find(x => x.id === id) || {}; return t.ad || ""; };
    const krkOf = id => { const t = state.takimListe.find(x => x.id === id) || {}; return t.krk || ""; };
    // sonuç tablosunun ilk sütun başlığı moda göre
    const basSutun = modAl() === "birey" ? "Katılımcı" : (modAl() === "okul" ? "Sınıf" : "Takım");
    const lider = newOrder.map((id, i) => {
      const ns = newR[id] || ids.length, ps = prevR[id] || ids.length, delta = ps - ns;
      const ok = delta > 0 ? '<span class="biy-ok biy-ok-yukari">▲</span>' : (delta < 0 ? '<span class="biy-ok biy-ok-asagi">▼</span>' : '<span class="biy-ok biy-ok-sabit"></span>');
      const cls = delta > 0 ? ' biy-lider-yukari' : (delta < 0 ? ' biy-lider-asagi' : '');
      // --i: görsel sıra (0=birinci). Merdiven kaydırması CSS'te bundan hesaplanır.
      return '<li class="biy-lider-satir'+cls+'" style="--i:'+i+'"><span class="biy-lider-sira">'+ns+'</span>'+ok+'<span class="biy-lider-ad">'+krkSvg(krkOf(id), "biy-krk-mini")+kacis(adOf(id))+'</span><b>'+(newP[id]||0)+'</b></li>';
    }).join("");
    const degisti = ids.some(id => (prevR[id]||ids.length) !== (newR[id]||ids.length));
    const son = ber ? true : (idx + 1 >= toplam);
    const step = taze ? 0 : 2;   // yenileme olursa doğrudan son sahne (liderlik)
    const t = TIP_BILGI[soru.tip] || { ad: soru.tip, emoji: "❓" };
    const baslik = ber
      ? '⚔️ '+(o.berHedef===1?'Liderlik':'İkincilik')+' · Beraberlik · Soru '+o.berNo
      : '📊 Sonuç · Soru '+(idx+1)+' / '+toplam;
    /* İptal düğmesi başlık çubuğuna konuldu: alt kontrol satırı ancak son
       sahnede görünür hâle geliyor, oysa iptal tam da cevaplar sahnesinde
       gerekiyor. Başlıkta durunca her sahnede elin altında ve tabloya
       dokunmadığı için mevcut düzen aynen korunuyor. */
    const iptalDugme = '<button class="biy-iptal-ac'+(iptalAcik?' acik':'')+'" onclick="BIY.iptalModuToggle()" title="'+
      (iptalAcik ? 'İptal düğmelerini gizle' : 'Kopya ya da hatalı soru: iptal düğmelerini göster')+'">'+
      (iptalAcik ? '✓' : '🚫')+'<span>İptal</span></button>';
    const iptalUyari = soruIptalli
      ? '<div class="biy-iptal-uyari">🚫 Bu soru iptal edildi — hiç kimseye puan yazılmıyor.</div>' : '';
    const iptalPanel = iptalAcik
      ? '<div class="biy-iptal-panel">' +
          '<span class="biy-iptal-not">Satırdaki 🚫 tek '+kisiSozu()+'ın cevabını (kopya), aşağıdaki düğme sorunun tamamını (hatalı soru) iptal eder. Aynı düğmeye yeniden basmak iptali geri alır.</span>' +
          '<button class="biy-btn biy-btn-mini biy-iptal-tum'+(soruIptalli?' geri':'')+'" onclick="BIY.soruIptal('+idx+')">'+
            (soruIptalli ? '↩ Soruyu Geri Al' : '🚫 Tüm Soruyu İptal Et')+'</button>' +
        '</div>'
      : '';
    // Son soruda (veya beraberlik kesinleşince) "Yarışmayı Bitir" düğmesi
    // animasyonu beklemeden HEMEN tıklanabilsin — tüm takımlar cevaplayınca
    // sonuç ekranı açılır açılmaz yarışma bitirilebilir.
    return '<div class="biy-oyun-orta biy-sonuc-ekran'+(iptalAcik?' biy-iptal-acik':'')+'"'+(son?' data-son="1"':'')+' data-degisti="'+(degisti?1:0)+'" data-step="'+step+'">' +
      '<div class="biy-sonuc-baslik'+(ber?' biy-ber':'')+'">'+baslik+iptalDugme+'</div>' + iptalUyari +
      '<div class="biy-sonuc-sahne">' +
        // SAHNE 1: soru cümlesi + şıklar + vurgulu doğru şık
        '<div class="biy-sahne-oge oge-dogru">' +
          etiketHtml(soru) + '<div class="biy-sonuc-soru-cumle">'+soruHtml(soru)+'</div>' +
          (soru.arapca ? '<div class="biy-oyun-arapca">'+kacis(soru.arapca)+'</div>' : '') +
          '<div class="biy-a-optlar" data-n="'+sikSayisi(soru)+'">'+optHtml+'</div>' +
        '</div>' +
        // SAHNE 2: sınıfların verdiği cevaplar (devasa)
        '<div class="biy-sahne-oge oge-reveal">' + iptalPanel +
          '<div class="biy-reveal'+(cevapTakimlari.length > 8 && modAl() === "birey" ? ' biy-kaydir' : '')+'"><table class="biy-reveal-tablo"><thead><tr><th class="biy-rev-adbas">'+basSutun+'</th><th class="biy-rev-durumbas">Durum</th><th class="biy-rev-cevapbas">Cevap</th>'+(iptalAcik?'<th class="biy-rev-islembas">İşlem</th>':'')+'</tr></thead><tbody>'+satir+'</tbody></table></div>' +
        '</div>' +
        // SAHNE 3: güncel puan durumu (devasa)
        '<div class="biy-sahne-oge oge-lider">' +
          '<div class="biy-sonuc-lider"><h4>🏆 Puan Durumu</h4><ol class="biy-lider-ol'+(newOrder.length>10?' biy-kaydir':'')+'">'+lider+'</ol></div>' +
        '</div>' +
      '</div>' +
      /* ALT BAR: üç ilerleme çizgisi ORTADA, "Sonraki Soru" düğmesi aynı
         satırın SAĞINDA. Düğme ayrı bir satır kaplamayınca sonuç ekranı
         dikeyde daha çok nefes alıyor (tablo/liste için daha çok yükseklik). */
      '<div class="biy-sonuc-altbar">' +
        '<div class="biy-sonuc-nokta">' +
          '<button class="biy-nokta" data-adim="0" onclick="BIY.sonucAdim(0)" title="Soru & doğru cevap"><span class="biy-nk-ikon"><svg viewBox="0 0 24 24" class="biy-nk-svg" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"/><path d="M8.2 12.4l2.6 2.6 5-5.8"/></svg></span><i class="biy-nk-cizgi"></i></button>' +
          '<button class="biy-nokta" data-adim="1" onclick="BIY.sonucAdim(1)" title="Katılımcı cevapları"><span class="biy-nk-ikon"><svg viewBox="0 0 24 24" class="biy-nk-svg" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.6" cy="6" r="1.5"/><path d="M10 6h8.4"/><circle cx="5.6" cy="12" r="1.5"/><path d="M10 12h8.4"/><circle cx="5.6" cy="18" r="1.5"/><path d="M10 18h8.4"/></svg></span><i class="biy-nk-cizgi"></i></button>' +
          '<button class="biy-nokta" data-adim="2" onclick="BIY.sonucAdim(2)" title="Puan durumu"><span class="biy-nk-ikon"><svg viewBox="0 0 24 24" class="biy-nk-svg" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="13" width="4.6" height="7.4" rx="1.2"/><rect x="9.7" y="8.4" width="4.6" height="12" rx="1.2"/><rect x="15.4" y="15" width="4.6" height="5.4" rx="1.2"/></svg></span><i class="biy-nk-cizgi"></i></button>' +
        '</div>' +
        '<div class="biy-oyun-kontrol"><button class="biy-btn biy-btn-buyuk" onclick="BIY.sonrakiSoru()">'+
          (ber ? ((BIY._beraberlikCozuldu() || state.berNo >= state.yedekSorular.length) ? '🏁 Sıralamayı Kesinleştir' : 'Sonraki Yedek Soru ›')
               : (son ? '🏁 Yarışmayı Bitir' : 'Sonraki Soru ›')) +
        '</button></div>' +
      '</div>' +
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
  /* ---------- DETAYLI RAPOR (akordiyon) ----------
     Yarışma bitince "kim hangi soruya ne cevap verdi, kaç puan aldı, bunun
     ne kadarı hızdan geldi" sorusunun tam karşılığı. Kapalı <details>
     kullanıldı: ne ek JS ne ek durum gerekiyor, kapalıyken final ekranı
     eskisiyle birebir aynı görünüyor, isteyen açıp tek tek inceliyor. */
  // turda geçen tüm soru index'leri: ana tur sırayla + kullanılan yedekler
  _soruIndexleri(){
    const o = state.oda || {};
    const n = o.toplamSoru || state.oyunSorulari.length || 0;
    const liste = [];
    for (let i = 0; i < n; i++) liste.push(i);
    const yedek = {};
    Object.values(state.cevaplar).forEach(c => { if (c.index >= 1000) yedek[c.index] = true; });
    (state.berSorular || []).forEach(i => { yedek[i] = true; });
    Object.keys(yedek).map(Number).sort((a,b) => a - b).forEach(i => liste.push(i));
    return liste;
  },
  _soruEtiket(i){ return (i >= 1000) ? ('Y' + (i - 1000)) : String(i + 1); },

  /* Rapordaki bir satırdan iptal yapılınca ekran baştan çizilir; açık olan
     akordiyonlar kapanmasın diye açık/kapalı durumu state'te tutulur. */
  raporToggle(el){
    if (!state.raporAcik) state.raporAcik = {};
    state.raporAcik[el.getAttribute("data-anahtar")] = !!el.open;
  },
  _raporAcikMi(a){ return !!(state.raporAcik && state.raporAcik[a]); },

  // tek katılımcının soru soru dökümü (rapor tablosu gövdesi)
  _raporGovde(takimId){
    const kendi = {};
    Object.values(state.cevaplar).forEach(c => { if (c.takimId === takimId) kendi[c.index] = c; });
    return BIY._soruIndexleri().map(i => {
      const s = BIY._soruByIndex(i);
      const c = kendi[i];
      const kesik = BIY._cevapIptalMi(i, takimId);
      const soruKesik = BIY._soruIptalMi(i);
      const dogruMu = !!(s && c && cevapDogruMu(s, c.secilen));
      const p = (c && dogruMu) ? BIY._puanParca(c) : null;   // puan yalnız doğru cevapta oluşur
      const durum = kesik ? '🚫 İptal' : (c ? (dogruMu ? '✅ Doğru' : '❌ Yanlış') : '⏳ Cevapsız');
      const cevap = (c && s) ? secimHtml(s, c.secilen) : '<span class="biy-rev-yok">—</span>';
      // hız kırılımı: kaç saniye kala cevapladı, süresinin yüzde kaçı kaldı, kaç puan bonus
      const hiz = p
        ? '<b class="biy-rap-bonus">+'+p.hizPuan+'</b><small>'+(p.kalan == null ? 'süre bilinmiyor' : (p.kalan+' sn kala · %'+p.yuzde))+'</small>'
        : '<span class="biy-rev-yok">—</span>';
      const taban = p ? String(p.sabit) : '<span class="biy-rev-yok">—</span>';
      // iptal edilmişse kazanılacak puan üstü çizili gösterilir, yerine 0 yazılır
      const puan = p ? (kesik ? '<s>'+p.puan+'</s> 0' : String(p.puan)) : '0';
      const dugme = soruKesik
        ? '<span class="biy-rev-islem-bos">—</span>'
        : '<button class="biy-mini-iptal'+(kesik?' geri':'')+'" onclick="BIY.cevapIptal('+i+',\''+kacis(takimId)+'\')" title="'+
          (kesik ? 'İptali geri al' : 'Bu cevabı iptal et (kopya)')+'">'+(kesik ? '↩' : '🚫')+'</button>';
      return '<tr class="'+(kesik ? 'iptal' : (c ? (dogruMu ? 'dogru' : 'yanlis') : 'yok'))+'">' +
        '<td class="biy-rap-no">'+BIY._soruEtiket(i)+'</td>' +
        '<td class="biy-rap-cevap">'+cevap+'</td>' +
        '<td class="biy-rap-durum">'+durum+'</td>' +
        '<td class="biy-rap-taban">'+taban+'</td>' +
        '<td class="biy-rap-hiz">'+hiz+'</td>' +
        '<td class="biy-rap-puan">'+puan+'</td>' +
        '<td class="biy-rap-islem">'+dugme+'</td></tr>';
    }).join("");
  },

  _raporHtml(){
    const idxs = BIY._soruIndexleri();
    if (!idxs.length || !state.takimListe.length) return '';
    const P = BIY._puanKumul(1e12);
    const sirali = state.takimListe.slice().sort((a,b) => (P[b.id]||0) - (P[a.id]||0));
    // hatalı soruyu tümüyle iptal etmek yarışma bittikten sonra da mümkün olsun
    const cipler = idxs.map(i => '<button class="biy-rap-schip'+(BIY._soruIptalMi(i)?' kesik':'')+'" onclick="BIY.soruIptal('+i+')" title="'+
      (BIY._soruIptalMi(i) ? 'Bu sorunun iptalini geri al' : 'Bu sorunun tamamını iptal et (hatalı soru)')+'">'+BIY._soruEtiket(i)+'</button>').join("");
    const kisiler = sirali.map((t,i) =>
      '<details class="biy-rap-kisi" data-anahtar="k'+t.id+'" ontoggle="BIY.raporToggle(this)"'+(BIY._raporAcikMi("k"+t.id)?' open':'')+'>' +
        '<summary><span class="biy-rap-sira">'+(i+1)+'</span>'+krkSvg(t.krk, "biy-krk-mini")+
          '<span class="biy-rap-ad">'+kacis(t.ad)+'</span><b>'+(P[t.id]||0)+'</b></summary>' +
        '<div class="biy-rap-kaydir"><table class="biy-rap-tablo">' +
          '<thead><tr><th>Soru</th><th>Verdiği Cevap</th><th>Durum</th><th>Taban</th><th>Hız Puanı</th><th>Puan</th><th>İptal</th></tr></thead>' +
          '<tbody>'+BIY._raporGovde(t.id)+'</tbody>' +
        '</table></div>' +
      '</details>').join("");
    return '<details class="biy-rapor" data-anahtar="rapor" ontoggle="BIY.raporToggle(this)"'+(BIY._raporAcikMi("rapor")?' open':'')+'>' +
      '<summary>📋 Detaylı Rapor — soru soru cevaplar ve hız puanları</summary>' +
      '<div class="biy-rapor-govde">' +
        '<div class="biy-rap-sorular"><span class="biy-rap-sorular-not">Hatalı soruyu tümüyle iptal et / geri al:</span>'+cipler+'</div>' +
        '<p class="biy-rap-aciklama">Her sorunun puanının %'+Math.round((1-ZAMAN_PAYI)*100)+'\'i doğru cevaba (taban), en çok %'+Math.round(ZAMAN_PAYI*100)+'\'i kalan süreye (hız) verilir. İptal edilen cevap toplama katılmaz.</p>' +
        kisiler +
      '</div>' +
    '</details>';
  },

  _leaderboardHtml(final){
    const o = state.oda || {};
    const P = BIY._puanKumul(1e12);   // yedekler dahil toplam puanlar
    const puanOf = t => (P[t.id] != null ? P[t.id] : (t.puan || 0));
    let sirali;
    if (Array.isArray(o.sonSira) && o.sonSira.length){
      /* sonSira beraberlik turunun çözdüğü kesin sırayı taşır. Puan birincil,
         sonSira ikincil ölçüt: hiç iptal yoksa puanlar zaten sonSira ile
         uyumlu olduğu için sonuç birebir aynı çıkar; sonradan bir kopya
         iptal edilirse ilgili katılımcı hak ettiği yere iner ama beraberlik
         turunun çözdüğü eşitlikler bozulmaz. */
      const sabitSira = {};
      o.sonSira.forEach((id, i) => { sabitSira[id] = i; });
      const yeri = t => (sabitSira[t.id] != null ? sabitSira[t.id] : 1e6);
      sirali = state.takimListe.slice().sort((a,b) => (puanOf(b) - puanOf(a)) || (yeri(a) - yeri(b)));
    } else {
      sirali = state.takimListe.slice().sort((a,b) => puanOf(b) - puanOf(a));
    }
    const madalya = ["🥇","🥈","🥉"];
    return '<div class="biy-oyun-orta biy-final">' +
      '<div class="biy-logo">'+simge("🏆")+'</div><h1>Yarışma Bitti!</h1>' +
      '<ol class="biy-final-ol'+(sirali.length>10?' biy-kaydir':'')+'">' +
        sirali.map((t,i) => '<li class="'+(i<3?'podyum':'')+(i===0?' birinci':'')+'" style="--i:'+i+'"><span class="biy-final-sira">'+(madalya[i]||(i+1))+'</span><span class="biy-final-ad">'+kacis(t.ad)+'</span><b>'+puanOf(t)+'</b></li>').join("") +
      '</ol>' +
      BIY._raporHtml() +
      '<div class="biy-final-butonlar">' +
        '<button class="biy-btn biy-btn-yesil" onclick="BIY.lobiyeDon()">🔄 Lobiye Dön (' + cogSozu() + ' bağlı kalır)</button>' +
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
        const sSoru = state.oyunSorulari[next];
        /* Süre zorluğa göre; tur ortasında ayar değiştiyse SONRAKİ sorulara
           yansır, geçmiş sorular state.turSureleri'nde donduruldu. */
        const sSure = soruSuresi(sSoru);
        state.turSureleri[next] = sSure;
        await db.collection(KOLEKSIYON).doc(state.odaId).update({
          aktifIndex: next, faz: "cevap", soruSuresi: sSure,
          aktifSoru: temizSoru(sSoru),
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
    // Yedek soruyla beraberlik bozma takım ve okul modunda anlamlı (az sayıda
    // yarışmacı); birey modunda katılımcı çok, tam eşitlik nadir → doğrudan bitir.
    if (modAl() === "birey"){ await db.collection(KOLEKSIYON).doc(state.odaId).update({ durum: "bitti", sonSira: [] }); return; }
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
    state.turSureleri[index] = soruSuresi(q);  // yedek sorunun süresi de donar
    state.berSorular.push(index);
    state.otoSonucIndex = -1; state.sonucAnimIndex = -1; state.hepsiSesIndex = -1;
    BIY._kaydet();
    try {
      await db.collection(KOLEKSIYON).doc(state.odaId).update({
        durum: "beraberlik", berHedef: state.berHedef, berTakimlar: state.berTakimlar, berSabit: state.berSabit, berNo: state.berNo,
        aktifIndex: index, faz: "cevap", aktifSoru: temizSoru(q),
        soruSuresi: state.turSureleri[index],
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
      if (!snap.exists){ BIY._takimIcerik('❌','Takım bulunamadı','Bağlantı geçersiz ya da takım silinmiş.'); return; }
      state.takimAd = snap.data().ad || "Takım";
      state.takimKrk = snap.data().krk || "";
      BIY._krkIzle(oda);                     // alinan avatarlari canli izle
      // yenileme sonrası: bu soruyu zaten cevapladıysa hatırla
      try { const kc = JSON.parse(localStorage.getItem('biy_cevap') || 'null'); if (kc && kc.oda === oda && kc.takim === takim) state.sonCevapIndex = kc.index; } catch(e){}
      await takimRef.update({ bagli: true, sonGorulme: firebase.firestore.FieldValue.serverTimestamp() });
      if (state.takimNabiz) clearInterval(state.takimNabiz);
      state.takimNabiz = setInterval(() => { takimRef.update({ sonGorulme: firebase.firestore.FieldValue.serverTimestamp() }).catch(()=>{}); }, 20000);
      window.addEventListener("pagehide", () => { takimRef.update({ bagli: false }).catch(()=>{}); });

      if (state.odaAbone) state.odaAbone();
      state.odaAbone = db.collection(KOLEKSIYON).doc(oda).onSnapshot(d => { state.oda = d.data() || null; BIY._renderTakim(); });
    } catch(e){ console.error(e); BIY._takimIcerik('⚠️','Bağlanılamadı','İnterneti ve bağlantıyı kontrol et.'); }
  },
  /* =================================================================
     KARAKTER SECIMI — herkes bir avatar alir, ikincisi ayni avatari
     alamaz. Kilit Firestore'da odalar/{oda}/karakterler/{avatar}
     belgesiyle tutulur; yazim islem (transaction) icinde yapildigi icin
     iki cihaz ayni anda bassa bile yalnizca biri kazanir.
     ================================================================= */
  _krkIzle(oda){
    if (state.krkAbone){ state.krkAbone(); state.krkAbone = null; }
    state.krkAbone = db.collection(KOLEKSIYON).doc(oda).collection("karakterler")
      .onSnapshot(s => {
        const m = {}; s.forEach(d => { m[d.id] = (d.data() || {}).takim || ""; });
        state.krkKapali = m;
        BIY._krkTazele();
      }, e => console.warn("karakter dinleme:", e));
  },
  _krkBenim(){ return (state.odaTakim && state.odaTakim.takim) || state.katilimId || ""; },
  _krkModu(){
    return (state.oda && state.oda.mod) || state.oyunModu ||
           (state.odaTakim && state.odaTakim.mod) || "birey";
  },
  _krkIzgaraHtml(){
    const mod = BIY._krkModu(), benim = BIY._krkBenim(), kapali = state.krkKapali || {};
    return '<div class="biy-krk-izgara">' + krkSeti(mod).map(k => {
      const sahip = kapali[k.i];
      const kilit = !!sahip && sahip !== benim;
      const secili = state.krkSecili === k.i;
      return '<button type="button" class="biy-krk-btn' + (kilit ? ' kapali' : '') +
        (secili ? ' secili' : '') + '"' + (kilit ? ' disabled aria-disabled="true"' : '') +
        ' title="' + k.a + '" onclick="BIY.krkSec(&quot;' + k.i + '&quot;)">' +
        '<span class="biy-krk-resim">' + k.s + '</span>' +
        '<span class="biy-krk-ad">' + k.a + '</span>' +
        (kilit ? '<span class="biy-krk-kilit" aria-hidden="true">✕</span>' : '') +
        (secili ? '<span class="biy-krk-tik" aria-hidden="true">✓</span>' : '') +
      '</button>';
    }).join("") + '</div>';
  },
  _krkTazele(){
    const a = $("katilKrkAlan"); if (a) a.innerHTML = BIY._krkIzgaraHtml();
    const b = $("takimKrkAlan");
    if (b){
      b.innerHTML = BIY._krkIzgaraHtml();
      const btn = $("takimKrkBtn"); if (btn) btn.disabled = !state.krkSecili;
    }
  },
  krkSec(id){
    const kapali = state.krkKapali || {};
    const sahip = kapali[id];
    if (sahip && sahip !== BIY._krkBenim()) return;   // baskasi kapmis
    state.krkSecili = (state.krkSecili === id) ? "" : id;
    BIY._krkTazele();
  },
  // avatari kilitle — baskasinin adina yazilmissa hata firlatir
  async _krkKap(oda, takimId, krk){
    const ref = db.collection(KOLEKSIYON).doc(oda).collection("karakterler").doc(krk);
    await db.runTransaction(async tx => {
      const d = await tx.get(ref);
      if (d.exists && (d.data() || {}).takim !== takimId) throw new Error("KAPILDI");
      tx.set(ref, { takim: takimId, zaman: firebase.firestore.FieldValue.serverTimestamp() });
    });
  },
  // takim/okul cihazi: lobide arma secme ekrani
  _krkSecEkrani(){
    if ($("takimKrkAlan")){ BIY._krkTazele(); return; }   // acik ekrani bozma
    const mod = BIY._krkModu();
    const baslik = mod === "okul" ? "Sınıf amblemini seç" : "Takım amblemini seç";
    /* Amblem izgarasi masaustunde 480 px'lik dar kolona sigmiyordu;
       bu ekran icin kart genisler (bkz. .biy-krk-orta).             */
    $("takimIcerik").className = "biy-orta biy-krk-orta";
    $("takimIcerik").innerHTML =
      '<div class="biy-kart biy-krk-kart">' +
        '<h1>' + baslik + '</h1>' +
        '<p class="biy-alt">' + kacis(state.takimAd || "") + '</p>' +
        '<div id="takimKrkAlan"></div>' +
        '<p id="takimKrkNot" class="biy-not"></p>' +
        '<button id="takimKrkBtn" class="biy-btn biy-btn-yesil" disabled onclick="BIY.krkOnayla()">Onayla</button>' +
      '</div>';
    BIY._krkTazele();
  },
  async krkOnayla(){
    const oda = state.odaTakim && state.odaTakim.oda;
    const takim = state.odaTakim && state.odaTakim.takim;
    if (!oda || !takim || !state.krkSecili) return;
    const btn = $("takimKrkBtn"); if (btn) btn.disabled = true;
    const not = $("takimKrkNot");
    if (not){ not.classList.remove("biy-not-hata"); not.textContent = "Ayrılıyor…"; }
    try {
      await BIY._krkKap(oda, takim, state.krkSecili);
      await db.collection(KOLEKSIYON).doc(oda).collection("takimlar").doc(takim)
              .update({ krk: state.krkSecili });
      state.takimKrk = state.krkSecili;
      BIY._renderTakim();
    } catch(e){
      state.krkSecili = ""; BIY._krkTazele();
      if (not){ not.classList.add("biy-not-hata"); not.textContent = "Bu amblem kapılmış. Başkasını seç."; }
    }
  },
  _takimIcerik(emoji, baslik, metin, ekstra){
    $("takimIcerik").className = "biy-orta";
    $("takimIcerik").innerHTML =
      '<div class="biy-kart">' +
        '<div class="biy-logo">'+simge(emoji)+'</div>' +
        '<h1>'+kacis(baslik)+'</h1>' +
        '<p class="biy-alt">'+kacis(metin)+'</p>' + (ekstra || "") +
      '</div>';
  },
  _renderTakim(){
    /* Öğretmen bu cihazı çıkardıysa oda belgesinden gecikmeli gelen bir
       snapshot "Bağlandın!" ekranını geri getirmesin — bayrak kalıcıdır. */
    if (state.atildiMi) return;
    const o = state.oda; if (!o){ return; }
    if (o.durum === "lobi" || o.aktifIndex === -1){
      // yeni tura hazırlık: önceki turun cevap takibini sıfırla (oda yeniden kullanılıyor olabilir)
      state.sonCevapIndex = -1; try { localStorage.removeItem('biy_cevap'); } catch(e){}
      // avatar secilmediyse once o: herkes bir karakter alir, ikincisi alamaz
      if (!state.takimKrk){ BIY._krkSecEkrani(); sayacDurdur(); return; }
      BIY._takimIcerik('✅', state.takimAd, 'Bağlandın! Öğretmenin başlatması bekleniyor.',
        '<div class="biy-krk-benim">'+krkSvg(state.takimKrk, "biy-krk-buyuk")+'<span>'+kacis(krkAd(state.takimKrk))+'</span></div>' +
        '<div class="biy-bekle-nokta"><span></span><span></span><span></span></div>');
      sayacDurdur(); return;
    }
    if (o.durum === "bitti"){
      // beraberlik sonrası kesin sıralama varsa kendi sıramı göster
      const ss = Array.isArray(o.sonSira) ? o.sonSira : null;
      if (ss){
        const r = ss.indexOf(state.odaTakim.takim) + 1;
        if (r === 1) BIY._takimIcerik('🎉','Tebrikler!', 'Birincisin! 🥇');
        else if (r > 0) BIY._takimIcerik('🏅', r + '. sıra', 'Yarışmayı bitirdiğin sıra: ' + r + '.');
        else BIY._takimIcerik('🏁','Yarışma Bitti!', 'Sıralama ekranda.');
      } else {
        BIY._takimIcerik('🏁','Yarışma Bitti!', 'Sıralama öğretmenin ekranında.');
      }
      sayacDurdur(); return;
    }
    if (o.durum === "beraberlik"){
      const amTied = (o.berTakimlar||[]).indexOf(state.odaTakim.takim) >= 0;
      if (!amTied){
        const rank = (o.berSabit||{})[state.odaTakim.takim];
        if (rank === 1) BIY._takimIcerik('🎉','Tebrikler!', 'Birincisin! 🥇');
        else if (rank) BIY._takimIcerik('🏅', rank + '. sıradasın', 'Yarışmayı bitirdiğin sıra: ' + rank + '.');
        else BIY._takimIcerik('⏳','Beraberlik!', 'Diğerleri yedek soruda…');
        sayacDurdur(); return;
      }
      if (o.faz === "sonuc"){ BIY._takimIcerik('📺','Cevaplar ekranda!', 'Sonraki yedek soru bekleniyor…'); sayacDurdur(); return; }
      // beraberlikte olan takım → aşağıdaki cevap akışıyla yedek soruyu cevaplar
    }
    // oyun
    const idx = o.aktifIndex, s = o.aktifSoru;
    if (!s){ BIY._takimIcerik('⏳','Hazırlanıyor…',''); return; }
    if (o.faz === "sonuc"){
      BIY._takimIcerik('📺','Cevaplar ekranda!', 'Sonraki soru bekleniyor…');
      sayacDurdur(); return;
    }
    // cevap fazı
    // ---- cevap fazı: biçime göre etkileşimli alan ----
    const cevapVerildi = (state.sonCevapIndex === idx);
    const t  = TIP_BILGI[s.tip] || { ad: s.tip, emoji: "❓" };
    const bb = BICIM_BILGI[bicimAl(s)] || { ad: "", emoji: "" };
    const kalan = kalanSaniye();
    const kilit = cevapVerildi || kalan <= 0;
    BIY._calismaHazirla(idx, s);
    const alt = cevapVerildi
      ? '<div class="biy-t-alindi">✅ Cevabın alındı</div>'
      : (kalan<=0 ? '<div class="biy-t-alindi biy-gec">⌛ Süre doldu</div>'
                  : '<div class="biy-t-ipucu">'+BIY._ipucuMetni(s)+'</div>');
    $("takimIcerik").className = "biy-oyun-orta";
    $("takimIcerik").innerHTML =
      '<div class="biy-t-kimlik">'+(state.takimKrk ? krkSvg(state.takimKrk, "biy-krk-mini") : '<span class="biy-t-kimlik-nokta"></span>')+'<span class="biy-t-kimlik-ad">'+kacis(state.takimAd)+'</span></div>' +
      '<div class="biy-t-ust"><span></span>' +
        '<span class="biy-t-sayac" id="sayacNum">'+kalan+'</span></div>' +
      etiketHtml(s) +
      '<div class="biy-oyun-soru">'+soruHtml(s)+'</div>' +
      (s.arapca ? '<div class="biy-oyun-arapca">'+kacis(s.arapca)+'</div>' : '') +
      BIY._takimAlanHtml(s, kilit) + alt;
    BIY._dragKur();
    sayacBaslat(() => {
      const k = kalanSaniye(); const el = $("sayacNum"); if (el) el.textContent = k;
      if (k <= 0){
        document.querySelectorAll(".biy-t-opt, .biy-t-parca, .biy-t-tus, .biy-t-gonder")
          .forEach(b => b.setAttribute("disabled",""));
        const kap = $("biyCalisma"); if (kap) kap.classList.add("kilitli");
        const ip = document.querySelector(".biy-t-ipucu");
        if (ip){ ip.className = "biy-t-alindi biy-gec"; ip.textContent = "⌛ Süre doldu"; }
      }
    });
  },

  /* ---------- takım tarafı: çalışma durumu ---------- */
  // Yarım kalan cevap (yerleştirilen parçalar / yazılan harfler) state içinde
  // tutulur ki her _renderTakim çağrısında aynen geri kurulabilsin.
  _calismaHazirla(idx, s){
    if (!state.calisma || state.calisma.index !== idx){
      const b = bicimAl(s);
      let n = 0;
      if (siraGibiMi(b))       n = (s.karisik || []).length;
      else if (b === "eslestir") n = (s.sollar  || []).length;
      state.calisma = { index: idx, yerlesim: new Array(n).fill(null), secili: null, yazi: "" };
    }
    return state.calisma;
  },
  _takimKilit(){
    const o = state.oda;
    if (!o || o.faz !== "cevap") return true;
    if (state.sonCevapIndex === o.aktifIndex) return true;
    return kalanSaniye() <= 0;
  },
  _ipucuMetni(s){
    const b = bicimAl(s);
    if (siraGibiMi(b))  return "Parçaları sürükleyerek sırala";
    if (b === "eslestir") return "Kartları doğru satıra taşı";
    if (b === "yazma")    return "Kelimeyi harflerle yaz";
    return "Bir şık seç";
  },
  _gonderHtml(kilit, tam){
    return '<div class="biy-t-gonder-sar"><button class="biy-t-gonder" ' +
           ((kilit || !tam) ? 'disabled' : '') +
           ' onclick="BIY.cevapGonder()">Gönder ✔</button></div>';
  },

  /* ---------- takım tarafı: biçime göre cevap alanı ---------- */
  _takimAlanHtml(s, kilit){
    const b = bicimAl(s);
    const c = state.calisma;

    if (siraGibiMi(b)){
      const p = s.karisik || [];
      const slot = p.map((_, k) => {
        const v = c.yerlesim[k], dolu = (v != null);
        return '<div class="biy-t-slot'+(dolu?' dolu':'')+(dolu&&arMi(p[v])?' ar':'')+'" data-drop="slot:'+k+'"' +
               (dolu ? ' data-drag="slot:'+k+'"' : '') +
               ' onclick="BIY.slotTikla('+k+')">' +
               // Numara yuva dolunca da kalir: mobilde yuvalar alt alta dizilir,
               // sira ancak bu rozetle okunur.
               '<span class="biy-t-slot-no'+(dolu?' dolu':'')+'">'+(k+1)+'</span>' +
               (dolu ? '<span class="biy-t-slot-metin">'+kacis(p[v])+'</span>' : '') + '</div>';
      }).join("");
      const havuz = p.map((x, i) => c.yerlesim.indexOf(i) >= 0 ? '' :
        '<div class="biy-t-parca'+(c.secili===i?' secili':'')+(arMi(x)?' ar':'')+'" data-drag="havuz:'+i+'" onclick="BIY.parcaTikla('+i+')">'+kacis(x)+'</div>'
      ).join("");
      const tam = p.length > 0 && c.yerlesim.every(v => v != null);
      return '<div class="biy-t-calisma" id="biyCalisma">' +
               '<div class="biy-t-slotlar" dir="rtl">'+slot+'</div>' +
               '<div class="biy-t-havuz" data-drop="havuz" dir="rtl">' +
                 (havuz || '<span class="biy-t-bos">Hepsi sıralandı ✔</span>') +
               '</div>' +
             '</div>' + BIY._gonderHtml(kilit, tam);
    }

    if (b === "eslestir"){
      const sol = s.sollar || [], sag = s.sagKarisik || [];
      const satir = sol.map((x, k) => {
        const v = c.yerlesim[k], dolu = (v != null);
        return '<div class="biy-t-cift-satir">' +
                 '<div class="biy-t-sol'+(arMi(x)?' ar':'')+'">'+kacis(x)+'</div>' +
                 '<div class="biy-t-ok">→</div>' +
                 '<div class="biy-t-slot'+(dolu?' dolu':'')+(dolu&&arMi(sag[v])?' ar':'')+'" data-drop="slot:'+k+'"' +
                 (dolu ? ' data-drag="slot:'+k+'"' : '') +
                 ' onclick="BIY.slotTikla('+k+')">' +
                 (dolu ? kacis(sag[v]) : '<span class="biy-t-slot-no">?</span>') + '</div>' +
               '</div>';
      }).join("");
      const havuz = sag.map((x, i) => c.yerlesim.indexOf(i) >= 0 ? '' :
        '<div class="biy-t-parca'+(c.secili===i?' secili':'')+(arMi(x)?' ar':'')+'" data-drag="havuz:'+i+'" onclick="BIY.parcaTikla('+i+')">'+kacis(x)+'</div>'
      ).join("");
      const tam = sol.length > 0 && c.yerlesim.every(v => v != null);
      return '<div class="biy-t-calisma" id="biyCalisma">' +
               '<div class="biy-t-ciftler">'+satir+'</div>' +
               '<div class="biy-t-havuz" data-drop="havuz">' +
                 (havuz || '<span class="biy-t-bos">Hepsi yerleşti ✔</span>') +
               '</div>' +
             '</div>' + BIY._gonderHtml(kilit, tam);
    }

    if (b === "yazma"){
      const tus = (s.tusKarisik || []).map((h, i) =>
        '<button class="biy-t-tus" '+(kilit?'disabled':'')+' onclick="BIY.tusBas('+i+')">'+kacis(h)+'</button>'
      ).join("");
      const hedef = s.harfSayi || 0;
      return '<div class="biy-t-yazma" id="biyCalisma">' +
               '<div class="biy-t-yazekran" dir="rtl">' +
                 (c.yazi ? kacis(c.yazi) : '<span class="biy-t-bos">…</span>') + '</div>' +
               (hedef ? '<div class="biy-t-sayi">'+c.yazi.length+' / '+hedef+' harf</div>' : '') +
               '<div class="biy-t-klavye" dir="rtl">'+tus +
                 '<button class="biy-t-tus sil" '+(kilit?'disabled':'')+' onclick="BIY.tusSil()">⌫</button>' +
               '</div>' +
             '</div>' + BIY._gonderHtml(kilit, c.yazi.length > 0);
    }

    // varsayılan: klasik test
    const opt = (s.secenekler || []).map((sec, i) =>
      '<button class="biy-t-opt'+(arMi(sec)?' ar':' biy-ltr')+'" style="--c:'+SIK_RENK[i % SIK_RENK.length]+'" ' +
      (kilit?'disabled':'')+' onclick="BIY.cevapla('+i+')">' +
      '<span class="biy-a-harf">'+String.fromCharCode(65+i)+'</span><span>'+kacis(sec)+'</span></button>'
    ).join("");
    return '<div class="biy-t-optlar">'+opt+'</div>';
  },

  /* ---------- dokunarak yerleştirme ---------- */
  parcaTikla(i){
    if (BIY._takimKilit()) return;
    const c = state.calisma; if (!c) return;
    if (c.secili === i){                       // ikinci dokunuş → ilk boş yuvaya
      const k = c.yerlesim.indexOf(null);
      if (k >= 0) c.yerlesim[k] = i;
      c.secili = null;
    } else {
      c.secili = i;
    }
    BIY._renderTakim();
  },
  slotTikla(k){
    if (BIY._takimKilit()) return;
    const c = state.calisma; if (!c) return;
    if (c.secili != null){
      const onceki = c.yerlesim.indexOf(c.secili);
      if (onceki >= 0) c.yerlesim[onceki] = null;
      c.yerlesim[k] = c.secili;
      c.secili = null;
    } else if (c.yerlesim[k] != null){
      c.yerlesim[k] = null;                    // havuza geri gönder
    }
    BIY._renderTakim();
  },
  tusBas(i){
    if (BIY._takimKilit()) return;
    const s = state.oda && state.oda.aktifSoru; if (!s) return;
    const c = state.calisma; if (!c) return;
    const h = (s.tusKarisik || [])[i];
    if (h == null || c.yazi.length >= 24) return;
    c.yazi += h;
    BIY._renderTakim();
  },
  tusSil(){
    if (BIY._takimKilit()) return;
    const c = state.calisma; if (!c || !c.yazi) return;
    c.yazi = c.yazi.slice(0, -1);
    BIY._renderTakim();
  },
  _tasi(kaynak, hedef){
    const c = state.calisma; if (!c || !kaynak || !hedef) return;
    const kp = kaynak.split(":"), hp = hedef.split(":");
    if (kp[0] === "havuz"){
      const i = +kp[1];
      if (hp[0] !== "slot") return;
      const k = +hp[1];
      const onceki = c.yerlesim.indexOf(i);
      if (onceki >= 0) c.yerlesim[onceki] = null;
      c.yerlesim[k] = i;
    } else if (kp[0] === "slot"){
      const k1 = +kp[1];
      if (hp[0] === "havuz"){ c.yerlesim[k1] = null; }
      else if (hp[0] === "slot"){
        const k2 = +hp[1];
        const g = c.yerlesim[k2]; c.yerlesim[k2] = c.yerlesim[k1]; c.yerlesim[k1] = g;
      }
    }
    c.secili = null;
  },

  /* ---------- parmakla sürükleme (pointer events) ---------- */
  // Tablet/telefon için HTML5 drag&drop kullanılmaz; parmağı takip eden bir
  // "hayalet" kopya + elementFromPoint ile bırakma hedefi bulunur.
  _dragKur(){
    const kap = $("biyCalisma");
    if (!kap || kap._dragli) return;
    kap._dragli = true;
    let bas = null, hayalet = null, tasindi = false;

    const temizle = () => {
      if (hayalet && hayalet.parentNode) hayalet.parentNode.removeChild(hayalet);
      hayalet = null;
      kap.querySelectorAll(".hedef").forEach(e => e.classList.remove("hedef"));
      kap.querySelectorAll(".suruk").forEach(e => e.classList.remove("suruk"));
    };
    const dropBul = (x, y) => {
      const el = document.elementFromPoint(x, y);
      return (el && el.closest) ? el.closest("[data-drop]") : null;
    };

    // Sürükleme bittiğinde tarayıcının ürettiği "click" olayını yut ki
    // parça hem taşınıp hem de tıklanmış sayılmasın.
    kap.addEventListener("click", function(e){
      if (kap._yut){ e.stopPropagation(); e.preventDefault(); }
    }, true);

    kap.addEventListener("pointerdown", function(e){
      kap._yut = false;
      if (BIY._takimKilit()) return;
      const el = (e.target && e.target.closest) ? e.target.closest("[data-drag]") : null;
      if (!el) return;
      bas = { el: el, x: e.clientX, y: e.clientY, id: el.getAttribute("data-drag") };
      tasindi = false;
      try { el.setPointerCapture(e.pointerId); } catch(err){}
    });

    kap.addEventListener("pointermove", function(e){
      if (!bas) return;
      const dx = e.clientX - bas.x, dy = e.clientY - bas.y;
      if (!tasindi && (Math.abs(dx) + Math.abs(dy)) < 8) return;
      if (!tasindi){
        tasindi = true;
        hayalet = bas.el.cloneNode(true);
        hayalet.removeAttribute("data-drag");
        hayalet.removeAttribute("data-drop");
        hayalet.className = bas.el.className.replace("secili", "") + " biy-t-hayalet";
        hayalet.style.width = bas.el.offsetWidth + "px";
        document.body.appendChild(hayalet);
        bas.el.classList.add("suruk");
      }
      e.preventDefault();
      hayalet.style.left = e.clientX + "px";
      hayalet.style.top  = e.clientY + "px";
      kap.querySelectorAll(".hedef").forEach(x => x.classList.remove("hedef"));
      const hd = dropBul(e.clientX, e.clientY);
      if (hd) hd.classList.add("hedef");
    });

    kap.addEventListener("pointerup", function(e){
      if (!bas) return;
      const b = bas; bas = null;
      if (!tasindi){ temizle(); return; }
      const hd = dropBul(e.clientX, e.clientY);
      temizle();
      kap._yut = true;
      if (hd) BIY._tasi(b.id, hd.getAttribute("data-drop"));
      BIY._renderTakim();
    });

    kap.addEventListener("pointercancel", function(){ bas = null; temizle(); });
  },

  /* ---------- cevabı gönder ---------- */
  cevapGonder(){
    if (BIY._takimKilit()) return;
    const o = state.oda; if (!o) return;
    const s = o.aktifSoru; if (!s) return;
    const c = state.calisma; if (!c) return;
    const b = bicimAl(s);
    let secilen = null;
    if (siraGibiMi(b)){
      if (!c.yerlesim.length || c.yerlesim.some(v => v == null)) return;
      secilen = c.yerlesim.map(v => (s.karisik || [])[v]);
    } else if (b === "eslestir"){
      if (!c.yerlesim.length || c.yerlesim.some(v => v == null)) return;
      secilen = c.yerlesim.map(v => (s.sagKarisik || [])[v]);
    } else if (b === "yazma"){
      if (!c.yazi) return;
      secilen = c.yazi;
    } else {
      return;
    }
    BIY._cevapYolla(secilen);
  },
  cevapla(optIdx){ BIY._cevapYolla(optIdx); },
  async _cevapYolla(secilen){
    const o = state.oda; if (!o || o.faz !== "cevap") return;
    if (kalanSaniye() <= 0) return;
    const idx = o.aktifIndex;
    if (state.sonCevapIndex === idx) return;
    state.sonCevapIndex = idx;
    try {
      await db.collection(KOLEKSIYON).doc(state.odaTakim.oda).collection("cevaplar").doc(state.odaTakim.takim + "_" + idx).set({
        takimId: state.odaTakim.takim, ad: state.takimAd, index: idx, secilen: secilen,
        kalan: kalanSaniye(),   // hız bonusu için kalan saniye
        zaman: firebase.firestore.FieldValue.serverTimestamp()
      });
      try { localStorage.setItem('biy_cevap', JSON.stringify({ oda: state.odaTakim.oda, takim: state.odaTakim.takim, index: idx })); } catch(e){}
    } catch(e){ console.error(e); state.sonCevapIndex = -1; }
    BIY._renderTakim();
  },

  /* ===================================================================
     MOD ALTYAPISI — Takım / Birey / Okul
     Üç mod da aynı Firestore yapısını kullanır: her katılımcı (ister takım,
     ister tek öğrenci) "takimlar" alt koleksiyonunda bir belgedir. Böylece
     puanlama, sonuç ekranı ve sıralama kodu üç modda da aynı çalışır.
     Birey modunda belgeye ek olarak  onay(bool) · red · atildi  alanları
     yazılır; takım/okul modunda öğretmen adları kendi yazdığı için onay yok.
     =================================================================== */

  // Başlat düğmesi görünsün mü, altındaki not ne yazsın (moda göre)
  _baslatDurumu(){
    const m = modAl();
    const sayi  = state.takimListe.length;
    const bagli = state.takimListe.filter(t => t.bagli).length;
    const bek   = state.bekleyenListe.length;
    const bekNot = bek ? " · " + bek + " Onay bekleyenler" : "";
    // Takım ve Okul: her ada bir karekod → hepsi bağlanınca başlar (aynı mantık)
    if (m !== "birey"){
      const c = cogSozu();                        // "takım" | "sınıf"
      if (sayi === 0) return { olur:false, not:"" };
      if (sayi < 2)   return { olur:false, not: c + ": " + sayi + " · en az iki kişi gerekli" };
      if (bagli < sayi) return { olur:false, not: c + ": " + sayi + " · bağlı " + bagli + " · bekliyoruz " + (sayi-bagli) };
      return { olur:true, not: "✓ " + c + ": " + sayi + " · başlayabilirsin" };
    }
    if (sayi < 2) return { olur:false, not: "Katılımcı: " + sayi + " · en az iki kişi gerekli" + bekNot };
    return { olur:true, not: "✓ Katılımcı: " + sayi + " · başlayabilirsin" + bekNot };
  },

  /* ---------- TAKIM & OKUL lobisi: her takıma/sınıfa ayrı karekod ---------- */
  _takimKartlariCiz(){
    const grid = $("takimlarGrid"); if (!grid) return;
    grid.innerHTML = "";
    state.takimListe.forEach(t => {
      const link = takimLinki(state.odaId, t.id); const qrId = "qr_" + t.id;
      const kart = document.createElement("div");
      kart.className = "biy-takim-kart " + (t.bagli ? "biy-kart-bagli" : "biy-kart-bekliyor");
      kart.innerHTML =
        '<button class="biy-sil" title="Sil" onclick="BIY.takimSil(&quot;'+t.id+'&quot;)">✕</button>' +
        '<h3>'+ krkSvg(t.krk, "biy-krk-kart-ikon") + kacis(t.ad) +'</h3>' +
        '<div class="biy-takim-durum '+(t.bagli?"biy-bagli":"biy-bekliyor")+'">'+(t.bagli?"● bağlı":"○ bekliyor")+'</div>' +
        '<div class="biy-qr" id="'+qrId+'"></div>' +
        '<div class="biy-takim-link"><input readonly value="'+ kacis(link) +'"><button class="biy-kopya" onclick="BIY.kopyala(this)">Kopyala</button></div>';
      grid.appendChild(kart);
      try { const box = $(qrId); if (box && window.QRCode){ box.innerHTML=""; new QRCode(box, { text: link, width: 170, height: 170, correctLevel: QRCode.CorrectLevel.M }); } }
      catch(err){ console.warn("QR:", err); }
    });
  },

  /* ---------- BİREY lobisi: tek ortak karekod ---------- */
  _odaKarekodCiz(){
    const kap = $("lobiOdaAlan"); if (!kap || !state.odaId) return;
    const link = odaLinki(state.odaId);
    const ipucu = "Herkes bu karekodu okutup adını yazar; onayınla listeye girerler.";
    kap.innerHTML =
      '<div class="biy-oda-kart">' +
        '<div class="biy-oda-sol">' +
          '<span class="biy-oda-etiket">Oda kodu</span>' +
          '<span class="biy-oda-kod">'+ kacis(state.odaId) +'</span>' +
          '<div class="biy-takim-link"><input readonly value="'+ kacis(link) +'"><button class="biy-kopya" onclick="BIY.kopyala(this)">Kopyala</button></div>' +
          '<p class="biy-oda-ipucu">'+ ipucu +'</p>' +
        '</div>' +
        '<div class="biy-qr biy-oda-qr" id="odaQrKutu"></div>' +
      '</div>';
    try {
      const box = $("odaQrKutu");
      if (box && window.QRCode){ box.innerHTML = ""; new QRCode(box, { text: link, width: 230, height: 230, correctLevel: QRCode.CorrectLevel.M }); }
    } catch(err){ console.warn("QR:", err); }
  },

  _katilimcilariCiz(){
    // --- onay bekleyenler kuyruğu ---
    const bek = $("lobiBekleyen");
    if (bek){
      const b = state.bekleyenListe;
      bek.innerHTML = !b.length
        ? '<div class="biy-bek-bos">⏳ Bekleyen yok — karekodu okutan burada görünür.</div>'
        : '<div class="biy-bek-ust"><h3>⏳ Onay bekleyenler ('+b.length+')</h3>' +
            (b.length > 1 ? '<button class="biy-btn biy-btn-yesil biy-btn-mini" onclick="BIY.hepsiniOnayla()">Hepsini Onayla</button>' : '') +
          '</div>' +
          '<div class="biy-bek-liste">' + b.map(k =>
            '<div class="biy-bek-kart">' +
              '<button class="biy-bek-ad" title="İsmi düzelt" onclick="BIY.katilimciAdDegistir(&quot;'+k.id+'&quot;)">'+krkSvg(k.krk, "biy-krk-mini")+kacis(k.ad)+'</button>' +
              '<span class="biy-bek-btnlar">' +
                '<button class="biy-onay-ok" title="Onayla" onclick="BIY.katilimciOnayla(&quot;'+k.id+'&quot;)">✓</button>' +
                '<button class="biy-onay-red" title="Reddet" onclick="BIY.katilimciReddet(&quot;'+k.id+'&quot;)">✕</button>' +
              '</span>' +
            '</div>').join("") +
          '</div>';
    }
    // --- onaylanan katılımcılar ---
    const grid = $("takimlarGrid"); if (!grid) return;
    const L = state.takimListe;
    if (!L.length){
      grid.innerHTML = '<div class="biy-kat-bos">Henüz katılan yok.</div>';
      return;
    }
    grid.innerHTML =
      '<div class="biy-kat-ust"><span>👥 Katılımcılar ('+L.length+')</span>' +
        '<span class="biy-kat-ipucu">İsme dokunup düzelt · ✕ ile çıkar</span></div>' +
      '<div class="biy-kat-satirlar'+(L.length > 12 ? ' biy-kaydir' : '')+'">' +
        L.map(k =>
          '<div class="biy-kat-satir '+(k.bagli ? 'bagli' : 'kopuk')+'">' +
            '<span class="biy-kat-nokta" title="'+(k.bagli?'bağlı':'bağlı değil')+'"></span>' +
            '<button class="biy-kat-ad" title="İsmi düzelt" onclick="BIY.katilimciAdDegistir(&quot;'+k.id+'&quot;)">'+krkSvg(k.krk, "biy-krk-mini")+kacis(k.ad)+'</button>' +
            '<button class="biy-kat-at" title="Yarışmadan çıkar" onclick="BIY.katilimciAt(&quot;'+k.id+'&quot;)">✕</button>' +
          '</div>').join("") +
      '</div>';
  },

  /* ---------- öğretmen müdahalesi: onay / ret / düzelt / çıkar ---------- */
  _katilimciRef(id){ return db.collection(KOLEKSIYON).doc(state.odaId).collection("takimlar").doc(id); },
  async katilimciOnayla(id){
    try { await BIY._katilimciRef(id).update({ onay: true }); SES.baglandi(); }
    catch(e){ console.error(e); }
  },
  async hepsiniOnayla(){
    const b = state.bekleyenListe.slice(); if (!b.length) return;
    try {
      const batch = db.batch();
      b.forEach(k => batch.update(BIY._katilimciRef(k.id), { onay: true }));
      await batch.commit(); SES.baglandi();
    } catch(e){ console.error(e); }
  },
  katilimciReddet(id){
    const k = state.bekleyenListe.find(x => x.id === id) || {};
    BIY._onay("Katılım reddedilsin mi?", "«" + (k.ad||"") + "» listeye girmeyecek. Yeni bir isimle deneyebilir.",
      "Reddet", async () => { try { await BIY._katilimciRef(id).update({ red: true }); } catch(e){ console.error(e); } });
  },
  katilimciAt(id){
    const k = state.takimListe.find(x => x.id === id) || {};
    BIY._onay("Yarışmadan çıkarılsın mı?", "«" + (k.ad||"") + "» listeden çıkacak ve cihazında bildirim görünecek.",
      "Çıkar", async () => { try { await BIY._katilimciRef(id).update({ atildi: true, bagli: false }); } catch(e){ console.error(e); } });
  },
  katilimciAdDegistir(id){
    const k = state.takimListe.find(x => x.id === id) || state.bekleyenListe.find(x => x.id === id);
    if (!k) return;
    BIY._metinSor("İsmi düzelt", k.ad, "Kaydet", async (yeni) => {
      const ad = isimTemizle(yeni);
      if (ad.length < 2) return;
      try { await BIY._katilimciRef(id).update({ ad: ad }); } catch(e){ console.error(e); }
    });
  },
  // küçük metin sorma penceresi (_onay kardeşi)
  _metinSor(baslik, mevcut, evetMetin, onEvet){
    const eski = $("biyOnay"); if (eski) eski.remove();
    const ov = document.createElement("div"); ov.id = "biyOnay"; ov.className = "biy-onay-ov";
    ov.innerHTML = '<div class="biy-onay-kutu"><h3>'+kacis(baslik)+'</h3>' +
      '<input id="biyMetinInput" class="biy-onay-input" type="text" maxlength="18" value="'+kacis(mevcut||"")+'">' +
      '<div class="biy-onay-btnlar"><button class="biy-onay-hayir">Vazgeç</button><button class="biy-onay-evet">'+kacis(evetMetin)+'</button></div></div>';
    document.body.appendChild(ov);
    const kapat = () => { if (ov.parentNode) ov.remove(); };
    const inp = ov.querySelector("#biyMetinInput");
    const tamam = () => { const v = inp.value; kapat(); if (onEvet) onEvet(v); };
    ov.querySelector(".biy-onay-hayir").onclick = kapat;
    ov.querySelector(".biy-onay-evet").onclick = tamam;
    inp.addEventListener("keydown", e => { if (e.key === "Enter") tamam(); if (e.key === "Escape") kapat(); });
    ov.addEventListener("click", e => { if (e.target === ov) kapat(); });
    setTimeout(() => { inp.focus(); inp.select(); }, 30);
  },

  // tahtadaki "kim cevapladı" şeridi
  _ciplerHtml(katilan, buCevaplar){
    return katilan.map(tk => {
      const ok = !!buCevaplar[tk.id];
      // avatar isimden once: soru gizliyken uzaktan bakan bunu tanir
      return '<span class="biy-cip '+(ok?'ok':'')+'">' + krkSvg(tk.krk, "biy-krk-cip") +
        (ok ? '<span class="biy-cip-tik">✓</span> ' : '') + kacis(tk.ad) + '</span>';
    }).join("");
  },

  /* ===================================================================
     ÖĞRENCİ TARAFI — tek karekodla katılım (yalnız birey modu)
     =================================================================== */
  async katilimAkisi(oda){
    state.odaTakim = { oda: oda, takim: null };
    ekranGoster("ekranKatil");
    try {
      const snap = await db.collection(KOLEKSIYON).doc(oda).get();
      if (!snap.exists){ BIY._katilNot("Oda bulunamadı. Karekodu yeniden okut ya da öğretmenine sor.", true); return; }
      const o = snap.data() || {};
      state.oyunModu = "birey";   // ortak karekod bağlantısı yalnız birey odalarında üretilir
      BIY._krkIzle(oda);          // hangi karakterler kapılmış, canlı izlenir
      // daha önce katıldıysa aynı kayda dön
      let kayit = null; try { kayit = JSON.parse(localStorage.getItem("biy_katilim") || "null"); } catch(e){}
      if (kayit && kayit.oda === oda && kayit.takim){
        const kd = await db.collection(KOLEKSIYON).doc(oda).collection("takimlar").doc(kayit.takim).get();
        if (kd.exists){ BIY._katilimIzle(oda, kayit.takim); return; }
        try { localStorage.removeItem("biy_katilim"); } catch(e){}
      }
      BIY._katilFormu();
    } catch(e){
      console.error(e);
      BIY._katilNot("Bağlanılamadı. İnterneti kontrol et.", true);
    }
  },
  _katilFormu(){
    ekranGoster("ekranKatil");
    const kart = $("katilKart"); if (kart) kart.classList.remove("gizli");
    const bekle = $("katilBekle"); if (bekle) bekle.classList.add("gizli");
    const not = $("katilNot"); if (not) not.textContent = "";
    const inp = $("katilAdInput"); if (inp){ inp.value = ""; setTimeout(() => inp.focus(), 60); }
    state.krkSecili = "";
    BIY._krkTazele();
  },
  _katilNot(metin, hata){
    const not = $("katilNot");
    if (not){ not.textContent = metin || ""; not.classList.toggle("biy-not-hata", !!hata); }
  },
  async katilGonder(){
    const oda = state.odaTakim && state.odaTakim.oda; if (!oda) return;
    const inp = $("katilAdInput"); const ham = inp ? inp.value : "";
    const sorun = isimSorunu(ham);
    if (sorun){ BIY._katilNot(sorun, true); if (inp) inp.focus(); return; }
    if (!state.krkSecili){ BIY._katilNot("Önce karakterini seç.", true); return; }
    let ad = isimTemizle(ham);
    BIY._katilNot("Gönderiliyor…", false);
    try {
      // aynı isim varsa numaralandır
      const hepsi = await db.collection(KOLEKSIYON).doc(oda).collection("takimlar").get();
      const adlar = []; hepsi.forEach(d => { const t = d.data(); if (!t.atildi && !t.red) adlar.push(t.ad); });
      ad = isimBenzersiz(ad, adlar);
      const id = rastgeleKod(5);
      // once avatari kilitle: kaybedersek kayit hic olusmasin
      try { await BIY._krkKap(oda, id, state.krkSecili); }
      catch(err){
        state.krkSecili = ""; BIY._krkTazele();
        BIY._katilNot("Bu karakter kapılmış. Başkasını seç.", true); return;
      }
      await db.collection(KOLEKSIYON).doc(oda).collection("takimlar").doc(id).set({
        ad: ad, onay: false, bagli: true, puan: 0, krk: state.krkSecili,
        olusturmaZamani: firebase.firestore.FieldValue.serverTimestamp()
      });
      try { localStorage.setItem("biy_katilim", JSON.stringify({ oda: oda, takim: id })); } catch(e){}
      BIY._katilimIzle(oda, id);
    } catch(e){
      console.error(e);
      BIY._katilNot("Katılım başarısız: " + (e.code || e.message), true);
    }
  },
  // kendi kaydını dinle: onay / ret / çıkarılma
  _katilimIzle(oda, id){
    state.katilimId = id; state.odaTakim = { oda: oda, takim: id }; state.katilBagli = false;
    if (state.katilimAbone) state.katilimAbone();
    const ref = db.collection(KOLEKSIYON).doc(oda).collection("takimlar").doc(id);
    state.katilimAbone = ref.onSnapshot(d => {
      if (!d.exists){ try { localStorage.removeItem("biy_katilim"); } catch(e){} BIY._katilFormu(); return; }
      const t = d.data() || {};
      state.takimAd = t.ad || "Katılımcı";
      state.takimKrk = t.krk || "";
      if (t.atildi){
        state.atildiMi = true;
        if (state.takimNabiz){ clearInterval(state.takimNabiz); state.takimNabiz = null; }
        if (state.katilimAbone){ state.katilimAbone(); state.katilimAbone = null; }
        if (state.odaAbone){ state.odaAbone(); state.odaAbone = null; }
        try { localStorage.removeItem("biy_katilim"); } catch(e){}
        sayacDurdur(); ekranGoster("ekranTakim");
        BIY._takimIcerik("🚪", "Yarışmadan çıkarıldın", "Öğretmen seni listeden çıkardı.");
        return;
      }
      if (t.red){
        try { localStorage.removeItem("biy_katilim"); } catch(e){}
        BIY._katilBeklemeEkrani("✋", "İsim kabul edilmedi", "Gerçek adınla tekrar dene.",
          '<button class="biy-btn biy-btn-yesil" onclick="BIY.katilYeniden()">Yeni isimle katıl</button>');
        return;
      }
      if (t.onay !== true){
        BIY._katilBeklemeEkrani("⏳", kacis(t.ad || ""), "Öğretmenin onayı bekleniyor…",
          '<div class="biy-bekle-nokta"><span></span><span></span><span></span></div>');
        return;
      }
      // onaylandı → normal takım akışına geç (bir kez)
      if (!state.katilBagli){
        state.katilBagli = true;
        BIY.takimBagla(oda, id);
      }
    }, err => { console.error(err); BIY._katilNot("Bağlantı koptu: " + (err.code || err.message), true); });
  },
  _katilBeklemeEkrani(emoji, baslik, metin, ekstra){
    ekranGoster("ekranKatil");
    const kart = $("katilKart"); if (kart) kart.classList.add("gizli");
    const bekle = $("katilBekle");
    if (bekle){
      bekle.classList.remove("gizli");
      bekle.innerHTML = '<div class="biy-kart biy-orta"><div class="biy-logo">'+simge(emoji)+'</div>' +
        '<h1>'+baslik+'</h1><p class="biy-alt">'+kacis(metin)+'</p>' + (ekstra || "") + '</div>';
    }
  },
  katilYeniden(){
    if (state.katilimAbone){ state.katilimAbone(); state.katilimAbone = null; }
    state.katilimId = null; state.katilBagli = false; state.atildiMi = false;
    BIY._katilFormu();
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

  /* index.html'deki İmam Hatip sınıf kartı "?sinif=N&konu=id" ile açar.
     Tek html, veriler sınıfa göre: seçim _acilisUygula() içinde yapılır. */
  state.acilisSinif = Math.max(0, parseInt(p.get("sinif"), 10) || 0);
  /* Eski bağlantılar "?konu=yedi / cumle7 / dokuz / cumle10" taşıyor olabilir;
     kelime-cümle ayrımı kalktı, eşleme sistem/sinifveri.js'te. */
  state.acilisKonu  = ((window.KidefSinifVeri && window.KidefSinifVeri.biyKonuGoc)
                        ? window.KidefSinifVeri.biyKonuGoc(p.get("konu"))
                        : p.get("konu")) || null;

  /* Tek karekodlu modlarda (birey/okul) baglanti yalnizca ?oda= tasir; ogrenci
     kendi adini yazar ve ogretmen onayini bekler. Takim modunda ise her takimin
     kendi karekodu vardir, bu yuzden ?takim= de bulunur.                     */
  /* ÖĞRENCİ KATILIMI İÇİN OTURUM — MİSAFİR (ANONİM) GİRİŞ AÇIK.
     -----------------------------------------------------------------------
     Karekodu okutan öğrencinin hesabı olmak zorunda değil: oturumu yoksa
     Firebase'de misafir (anonim) bir kimlik açılır, öğrenci adını yazar ve
     oynar. Bu YALNIZ katılım yolu içindir (?oda= adresiyle gelenler);
     öğretmen tarafı (sade adres) gerçek hesap istemeye devam eder ve
     misafir kimlik oraya asla giremez (bkz. aşağıdaki isAnonymous denetimi).

     Misafir kimliğin yetkisi Firestore kurallarıyla sınırlanmıştır:
     sadece bilgiYarismasi/{oda} altına yazabilir; kullanicilar, rooms,
     ogrenciIlerleme gibi koleksiyonlara erişemez. Kural dosyası:
     firestore.rules.txt  (öce kuralları yayınla, SONRA konsolda Anonymous'u aç)

     Not: sistem/gorevkopru.js misafir oturumları zaten eliyor, bu yüzden
     misafir olarak oynayanın ilerleme/rekor kaydı tutulmaz — istenen davranış. */
  function biyOturumSagla(){
    return new Promise(function (coz) {
      try {
        var bitti = false, kes = null;
        kes = firebase.auth().onAuthStateChanged(function (u) {
          if (bitti) return; bitti = true;
          try { if (kes) kes(); } catch (e) {}
          if (u) { coz(u); return; }
          /* Oturum yok → misafir kimlik aç. Konsolda Anonymous kapalıysa
             auth/operation-not-allowed gelir; hatayı çağırana taşıyoruz ki
             öğretmene "neyi açman gerekiyor" diyebilelim. */
          firebase.auth().signInAnonymously()
            .then(function (s) { coz((s && s.user) || firebase.auth().currentUser || null); })
            .catch(function (e) { coz(null); biyOturumHatasi = e; });
        });
      } catch (e) { biyOturumHatasi = e; coz(null); }
    });
  }
  var biyOturumHatasi = null;

  /* Misafir kimlik bile açılamadıysa (Anonymous kapalı / ağ yok) uyarı. */
  function biyGirisGerek(){
    var kapali = !!(biyOturumHatasi && String(biyOturumHatasi.code || '')
                    .indexOf('operation-not-allowed') >= 0);
    var d = document.createElement('div');
    d.id = 'biyGirisGerek';
    d.style.cssText = 'position:fixed; inset:0; z-index:999999; background:rgba(15,42,67,.94);' +
      'display:flex; align-items:center; justify-content:center; padding:20px;' +
      "font-family:'Nunito','Segoe UI',sans-serif; color:#fff; text-align:center;";
    d.innerHTML =
      '<div style="max-width:440px; background:#fff; color:#2c3e50; border-radius:20px; padding:28px 24px;">' +
      '<div style="font-size:2.4rem; line-height:1; margin-bottom:10px;">🔒</div>' +
      '<h2 style="margin:0 0 10px; font-size:1.25rem; color:#16A085;">Bağlanılamadı</h2>' +
      '<p style="margin:0 0 18px; font-size:.96rem; line-height:1.55; color:#5c6b78;">' +
      (kapali
        ? 'Misafir katılımı sunucuda kapalı görünüyor. Öğretmenin Firebase Console → ' +
          'Authentication → Sign-in method bölümünden <b>Anonymous</b> seçeneğini ' +
          'açması gerekiyor. Dilersen kendi hesabınla giriş yapıp tekrar dene.'
        : 'Bağlantı kurulamadı. İnternetini kontrol edip sayfayı yenile; ' +
          'sorun sürerse kendi hesabınla giriş yapmayı dene.') +
      '</p>' +
      '<a href="../index.html" style="display:inline-block; padding:13px 26px; border-radius:12px;' +
      ' background:#16A085; color:#fff; font-weight:800; text-decoration:none;">Giriş Yap</a>' +
      '</div>';
    document.body.appendChild(d);
  }

  if (oda && !takim){
    state.mod = "takim";
    biyOturumSagla().then(function (u) {
      if (!u) { biyGirisGerek(); return; }
      BIY.katilimAkisi(oda);
    });
    return;
  }

  if (oda && takim){
    state.mod = "takim"; state.odaTakim = { oda, takim };
    ekranGoster("ekranTakim");
    // takım listesi (final için) hafif dinleme
    db.collection(KOLEKSIYON).doc(oda).collection("takimlar").onSnapshot(snap => {
      state.takimListe = []; snap.forEach(d => { const t = d.data(); state.takimListe.push({ id: d.id, ad: t.ad, puan: t.puan||0, bagli: !!t.bagli }); });
    }, () => {});
    // kidef kuralları için oturum; hesap yoksa misafir kimlik açılır.
    biyOturumSagla().then(function (u) {
      if (!u) { biyGirisGerek(); return; }
      BIY.takimBagla(oda, takim);
    });
    return;
  }

  /* Sade adres (?oda= yok) ile açan kişi öğretmendir: kidefarapca.com'daki
     hesap/rol denetimi AYNEN korunur (index girişindeki teacher/admin).

     ⚠️ ROL DENETİMİ ARTIK ORTAK: sistem/rol.js (KidefRol).
     Eskiden burada "role alanı yoksa öğrenci say" deniyordu; bu yüzden
     role alanı hiç yazılmamış öğretmen hesapları girişe yönlendiriliyor ve
     "bu hesabın rolü öğrenci" diyordu. KidefRol; role alanına, öğretmen
     izlerine (teacherStaticCode / sınıf listesi) ve bulut okunamazsa
     önbelleğe bakar; eksik role alanını da kendiliğinden onarır. */
  state.mod = "admin";
  ekranGoster("ekranYukleniyor");
  firebase.auth().onAuthStateChanged(user => {
    /* Ortak çözücü yoksa (dosya yüklenmediyse) eski davranışa dön */
    if (!window.KidefRol){
      biyEskiRolDenetimi(user); return;
    }
    if (!user){ biyGirisKapisiAc({ kaynak: "yok", misafir: true, rol: "misafir", ogretmen: false }); return; }
    /* Misafir (anonim) kimlik yalnızca ÖĞRENCİ katılımı içindir; yönetim
       ekranına asla giremez. Öğrenci karekodla girip sonra sade adresi
       açarsa oturumu misafir olur — burada kesiliyor. */
    if (user.isAnonymous){
      /* anonim:true → KidefRol.aciklama() hazır metni verir:
         "Misafir olarak giriş yapılmış; yönetim için öğretmen/yönetici
          hesabı gerekli." */
      biyGirisKapisiAc({ kaynak: "misafir", misafir: true, anonim: true,
                         rol: "misafir", ogretmen: false, uid: user.uid });
      return;
    }
    state.uid = user.uid;
    window.KidefRol.coz(user, db).then(o => {
      if (!o.ogretmen){ biyGirisKapisiAc(o); return; }
      const isim = o.isim || user.email || "Yönetici";
      const adEl = $("adminAd");
      if (adEl) adEl.textContent = (o.rol === "admin" ? "Yönetici: " : "Öğretmen: ") + isim;
      BIY._girisSonrasi();
    }).catch(err => { console.error("Rol:", err); biyGirisKapisiAc({ hata: String(err && err.message || err) }); });
  });

  /* Giriş kapısı + "neden" açıklaması (kullanıcı ne yapacağını bilsin) */
  function biyGirisKapisiAc(o){
    const not = $("girisRolNot");
    if (not) not.textContent = (window.KidefRol && o) ? window.KidefRol.aciklama(o) : "";
    /* Ayrıntı satırı: sorun yaşayan öğretmen ne olduğunu görebilsin */
    const ay = $("girisRolAyrinti");
    if (ay && o && o.uid){
      ay.textContent = "Hesap: " + (o.isim || o.uid.slice(0, 6)) +
        " · rol alanı: " + (o.rolAlani || "(yok)") +
        (o.iz ? " · öğretmen izi: " + o.iz : "") +
        " · kaynak: " + (o.kaynak || "-") + (o.hata ? " · " + o.hata : "");
      ay.style.display = "";
    } else if (ay){ ay.style.display = "none"; }
    ekranGoster("ekranGirisKapisi");
  }

  /* Eski (yedek) denetim — sistem/rol.js bulunamazsa */
  function biyEskiRolDenetimi(user){
    if (!user || user.isAnonymous){
      $("girisRolNot").textContent = user && user.isAnonymous ? "Misafir olarak giriş yapılmış; yönetim için öğretmen/yönetici hesabı gerekli." : "";
      ekranGoster("ekranGirisKapisi"); return;
    }
    state.uid = user.uid;
    db.collection("kullanicilar").doc(user.uid).get().then(doc => {
      const v = doc.exists ? (doc.data() || {}) : {};
      const rol = v.role || (v.teacherStaticCode || v.userData ? "teacher" : "student");
      if (!(rol === "teacher" || rol === "admin")){
        $("girisRolNot").textContent = "Bu hesabın rolü öğrenci. Yarışmayı yalnızca öğretmen/yönetici yönetebilir.";
        ekranGoster("ekranGirisKapisi"); return;
      }
      const isim = (v.name && v.name !== "Belirtilmedi") ? v.name : (user.email || "Yönetici");
      const adEl = $("adminAd"); if (adEl) adEl.textContent = (rol === "admin" ? "Yönetici: " : "Öğretmen: ") + isim;
      BIY._girisSonrasi();
    }).catch(err => { console.error("Rol:", err); ekranGoster("ekranGirisKapisi"); });
  }
})();
function biyGirisSonrasiTanimla(){}
BIY._girisSonrasi = function(){
  try {
    BIY._konulariHazirla();
    BIY._soruSayiSinir();
    BIY._menuDurum();
    // sayfa yenilenmişse aktif odaya/oyuna dön
    let kayit = null; try { kayit = JSON.parse(localStorage.getItem('biy_aktif') || 'null'); } catch(e){}
    if (kayit && kayit.oda){ BIY._devamEt(kayit); }
    /* Yarım kalan canlı oyun yoksa MOD KAPISI açılır: öğretmen önce
       "canlı mı, çevrimdışı mı" der, kurulum ondan sonra gelir. */
    else BIY._modKapisi();
  } catch(err){
    console.error("[BIY] Açılış hatası:", err);
    const not = $("girisRolNot");
    if (not) not.textContent = String(err && err.message ? err.message : err);
    ekranGoster("ekranGirisKapisi");
  }
};
