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
const SORU_SURESI = 60;      // saniye
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
const BICIM_BILGI = {
  "test":     { ad: "Çoktan seçmeli", emoji: "🔘" },
  "surukle":  { ad: "Sıralama",  emoji: "🧲" },
  "eslestir": { ad: "Eşleştirme",     emoji: "🔗" },
  "yazma":    { ad: "Yazma",  emoji: "⌨️" }
};
function bicimAl(s){ return (s && s.bicim) || "test"; }
// Metin Arapça mı? (kutulara doğru yazı tipini vermek için)
function arMi(t){ return /[؀-ۿ]/.test(String(t == null ? "" : t)); }
/* ---------------- Etiketler: animasyonlu SVG rozetler ----------------
   Soru tipi / bicim / zorluk yazi degil ikon; soru cumlesinin ustunde
   ayri satirda durur. Renk ve animasyon CSS'te (biy-ea-*). */
const _EA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">';
const ETIKET_TIP = {
  "kok":   _EA+'<path d="M12 21v-8"/><path d="M12 13c0-3.2-2.4-5.6-6-5.6 0 3.6 2.4 5.6 6 5.6z"/><path class="biy-ea-parla" d="M12 11c0-3.6 2.6-6.2 6.4-6.2 0 4-2.8 6.2-6.4 6.2z"/></svg>',
  "vezin": _EA+'<g class="biy-ea-zip"><path d="M4.2 7h15.6"/><path d="M6.8 7l-2.7 5a3.1 3.1 0 0 0 5.4 0z"/><path d="M17.2 7l-2.7 5a3.1 3.1 0 0 0 5.4 0z"/></g><path d="M12 4.4v13.2M8.6 20.4h6.8"/><circle cx="12" cy="4.2" r="1.1"/></svg>',
  "anlam": _EA+'<path d="M9.8 17.5h4.4M10.6 20.5h2.8"/><path d="M12 3.2a5.6 5.6 0 0 1 3.2 10.2c-.7.5-1 1.1-1 1.9h-4.4c0-.8-.3-1.4-1-1.9A5.6 5.6 0 0 1 12 3.2z"/><g class="biy-ea-parla"><path d="M3.6 5.4l1.5.9M20.4 5.4l-1.5.9M12 .9v1.5"/></g></svg>',
  "ters-vezin": _EA+'<g class="biy-ea-zip"><path d="M14.4 6.2a4.4 4.4 0 0 0-5.8 5.5l-5 5a2 2 0 1 0 2.8 2.8l5-5a4.4 4.4 0 0 0 5.5-5.8l-2.8 2.8-2.4-.7-.7-2.4z"/></g></svg>',
  "ayet":  _EA+'<path d="M12 6.4C10.4 5 8.2 4.3 5.5 4.3c-.9 0-1.7.1-2.5.3v13.2c.8-.2 1.6-.3 2.5-.3 2.7 0 4.9.7 6.5 2.2 1.6-1.5 3.8-2.2 6.5-2.2.9 0 1.7.1 2.5.3V4.6c-.8-.2-1.6-.3-2.5-.3-2.7 0-4.9.7-6.5 2.1z"/><path class="biy-ea-ciz" d="M12 6.4v13.2"/></svg>',
  "cumle": _EA+'<path d="M6.5 4.5h11a2.5 2.5 0 0 1 2.5 2.5v6a2.5 2.5 0 0 1-2.5 2.5H10.5L6 19v-3.5A2.5 2.5 0 0 1 4 13V7a2.5 2.5 0 0 1 2.5-2.5z"/><path class="biy-ea-ciz" d="M8.5 8.5h7M8.5 11.5h4.5"/></svg>',
  "gramer": _EA+'<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path class="biy-ea-ciz" d="M8 8.5h8M8 12h8M8 15.5h5"/></svg>',
  "varsayilan": _EA+'<circle cx="12" cy="12" r="8.6"/><path class="biy-ea-ciz" d="M9.6 9.2a2.4 2.4 0 1 1 3.3 2.2c-.8.4-.9 1-.9 1.8"/><circle cx="12" cy="16.6" r=".9" fill="currentColor" stroke="none"/></svg>'
};
const ETIKET_BICIM = {
  "test":     _EA+'<circle cx="12" cy="12" r="8.6"/><path class="biy-ea-ciz" d="M8.2 12.4l2.6 2.6 5-5.8"/></svg>',
  "surukle":  _EA+'<rect x="2.8" y="9.4" width="5.2" height="5.2" rx="1.3"/><rect x="16" y="9.4" width="5.2" height="5.2" rx="1.3"/><g class="biy-ea-kay"><rect x="9.4" y="9.4" width="5.2" height="5.2" rx="1.3" fill="currentColor" stroke="none"/></g></svg>',
  "eslestir": _EA+'<circle cx="5.4" cy="7" r="1.9"/><circle cx="18.6" cy="7" r="1.9"/><circle cx="5.4" cy="17" r="1.9"/><circle cx="18.6" cy="17" r="1.9"/><path class="biy-ea-ciz" d="M7.6 7h8.8M7.6 17h8.8"/></svg>',
  "yazma":    _EA+'<path d="M4.5 19.5l1-3.8L16.6 4.6a2.1 2.1 0 0 1 3 3L8.4 18.7z"/><path class="biy-ea-ciz" d="M4.5 22.6h15"/></svg>'
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
  if (b === "surukle")
    return Array.isArray(secilen) && Array.isArray(s.parcalar) && secilen.join("|") === s.parcalar.join("|");
  if (b === "eslestir")
    return Array.isArray(secilen) && Array.isArray(s.ciftler) &&
           secilen.length === s.ciftler.length && s.ciftler.every((c, i) => secilen[i] === c[1]);
  if (b === "yazma")
    return String(secilen).replace(/\s+/g, "") === String(s.cevapYazi || "").replace(/\s+/g, "");
  return secilen === s.dogru;
}
// Doğru cevabın okunabilir metni (önizleme kartları, sınıf modu, soru havuzu).
function dogruCevapMetni(s){
  const b = bicimAl(s);
  if (b === "surukle")  return (s.parcalar || []).join(" ");
  if (b === "eslestir") return (s.ciftler || []).map(c => c[0] + " → " + c[1]).join("  ·  ");
  if (b === "yazma")    return s.cevapYazi || "";
  return (s.secenekler || [])[s.dogru] || "";
}
// Soru havuzu aramasında taranacak metin.
function aramaMetni(q){
  const b = bicimAl(q);
  if (b === "surukle")  return (q.parcalar || []).join(" ");
  if (b === "eslestir") return (q.ciftler || []).map(c => c.join(" ")).join(" ");
  if (b === "yazma")    return q.cevapYazi || "";
  return (q.secenekler || []).join(" ");
}
// Bir takımın verdiği cevabın gösterim biçimi (sonuç ekranı tablosu).
function secimHtml(soru, secilen){
  const b = bicimAl(soru);
  if (secilen == null) return '<span class="biy-rev-yok">—</span>';
  if (b === "surukle")
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

/* ---------------- Seed soru havuzu ---------------- */
/* KONULAR — kidefarapca.com verisi (aynen korunmustur) */
/* Vezinler bankasi (KONULAR icindeki 'vezinler' konusu bunu kullanir) */
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
const KONULAR = [
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
  { id: "dokuz", ad: "9. Sınıf Kelimeleri", pdf: "", sorular: [
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
  ] },
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
  { id: "vezinler", ad: "Vezinler", pdf: "Vezinler Bilgi Yarışması.pdf", sorular: SORULAR },
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
  { i:"kuyruklu", a:"مُذَنَّب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#B3E5FC"/><path d="M4 42l18-18 6 6z" fill="#4FC3F7" opacity=".55"/><path d="M10 42l14-14 4 4z" fill="#29B6F6" opacity=".8"/><circle cx="31" cy="17" r="9" fill="#FFB300"/><circle cx="31" cy="17" r="5.5" fill="#FFE082"/><circle cx="41" cy="8" r="1.7" fill="#FFF"/><circle cx="14" cy="10" r="1.5" fill="#FFF"/></svg>' },
  { i:"teleskop", a:"مِرْقَب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#C5CAE9"/><path d="M8 27l22-12 5 8-22 12z" fill="#5C6BC0"/><path d="M30 15l6-3 5 8-6 3z" fill="#3949AB"/><path d="M14 32l-4 10M22 30l6 12" stroke="#455A64" stroke-width="3" stroke-linecap="round"/><circle cx="41" cy="9" r="1.7" fill="#FFF176"/><circle cx="34" cy="5" r="1.3" fill="#FFF176"/></svg>' }
];
const KRK_TAKIM = [
  { i:"t-yildiz", a:"فَريق النَّجْم", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E3F2FD"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#1565C0"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#42A5F5"/><path d="M24 13l3.4 7 7.6 1.1-5.5 5.3 1.3 7.6L24 30.4l-6.8 3.6 1.3-7.6-5.5-5.3 7.6-1.1z" fill="#FFF176"/></svg>' },
  { i:"t-simsek", a:"فَريق البَرْق", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFF8E1"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#F57F17"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#FFCA28"/><path d="M27 11l-9 13h6l-3 11 10-14h-6z" fill="#FFFDE7"/></svg>' },
  { i:"t-alev", a:"فَريق اللَّهَب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFEBEE"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#B71C1C"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#EF5350"/><path d="M24 11c4 5 8 7 8 13a8 8 0 0 1-16 0c0-4 2-6 4-8 0 3 1 4 2 4 0-4 1-6 2-9z" fill="#FFE082"/></svg>' },
  { i:"t-kupa", a:"فَريق الكَأْس", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#F3E5F5"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#6A1B9A"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#AB47BC"/><path d="M17 12h14v7a7 7 0 0 1-14 0z" fill="#FFD54F"/><path d="M17 14h-3a4 4 0 0 0 4 4M31 14h3a4 4 0 0 1-4 4" stroke="#FFD54F" stroke-width="2" fill="none"/><path d="M22 26h4v5h-4z" fill="#FFD54F"/><path d="M18 31h12v3H18z" fill="#FFD54F"/></svg>' },
  { i:"t-nesir", a:"فَريق النَّسْر", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E0F7FA"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#00695C"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#26A69A"/><path d="M24 14l10 6-6 1 4 4-8-2-8 2 4-4-6-1z" fill="#FFF8E1"/><path d="M24 22v9M20 33h8" stroke="#FFF8E1" stroke-width="2.2" stroke-linecap="round"/></svg>' },
  { i:"t-mihlab", a:"فَريق المِخْلَب", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#EFEBE9"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#4E342E"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#8D6E63"/><path d="M17 13c1 6 1 10 0 14M22 12c1 7 1 11 0 15M27 12c-1 7-1 11 0 15M32 13c-1 6-1 10 0 14" stroke="#FFF8E1" stroke-width="3" fill="none" stroke-linecap="round"/></svg>' },
  { i:"t-seyf", a:"فَريق السَّيْف", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#ECEFF1"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#37474F"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#78909C"/><path d="M16 12l16 20M32 12L16 32" stroke="#ECEFF1" stroke-width="3.4" stroke-linecap="round"/><path d="M14 30l4 4M34 30l-4 4" stroke="#FFCA28" stroke-width="3.4" stroke-linecap="round"/></svg>' },
  { i:"t-tac", a:"فَريق التّاج", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFF3E0"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#E65100"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#FB8C00"/><path d="M14 30l-2-15 6 5 6-8 6 8 6-5-2 15z" fill="#FFE082"/><path d="M14 32h20" stroke="#FFE082" stroke-width="3" stroke-linecap="round"/></svg>' },
  { i:"t-dir", a:"فَريق الدِّرْع", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E8EAF6"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#283593"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#5C6BC0"/><path d="M24 12l9 3.5v8c0 5.5-4.2 9-9 11-4.8-2-9-5.5-9-11v-8z" fill="none" stroke="#FFF8E1" stroke-width="2.6"/><path d="M24 18v10M19 23h10" stroke="#FFF8E1" stroke-width="2.6" stroke-linecap="round"/></svg>' },
  { i:"t-wisam", a:"فَريق الوِسام", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FCE4EC"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#AD1457"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#EC407A"/><path d="M18 11l3 8h6l3-8" stroke="#FFF8E1" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="24" cy="27" r="8" fill="#FFD54F"/><circle cx="24" cy="27" r="4.6" fill="#FFF8E1"/></svg>' },
  { i:"t-karn", a:"فَريق القَرْن", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#EDE7F6"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#4527A0"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#7E57C2"/><path d="M13 14c-1 8 4 12 11 12s12-4 11-12" stroke="#FFF8E1" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="24" cy="31" r="4.5" fill="#FFF8E1"/></svg>' },
  { i:"t-sehm", a:"فَريق السَّهْم", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E0F2F1"/><path d="M24 4l16 5.5v15C40 34.5 32.5 41 24 44.5 15.5 41 8 34.5 8 24.5v-15z" fill="#00838F"/><path d="M24 8l12 4.2v12c0 7.6-5.6 12.6-12 15.4-6.4-2.8-12-7.8-12-15.4v-12z" fill="#26C6DA"/><path d="M24 11l7 9h-4v14h-6V20h-4z" fill="#FFF8E1"/></svg>' }
];
const KRK_SINIF = [
  { i:"s-madrasa", a:"صَفّ المَدْرَسَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E3F2FD"/><circle cx="24" cy="24" r="19" fill="#1E88E5"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><path d="M24 10l13 7v3H11v-3z" fill="#FFF8E1"/><rect x="13" y="20" width="22" height="14" rx="2" fill="#FFECB3"/><rect x="21" y="25" width="6" height="9" rx="1.4" fill="#1565C0"/><rect x="15.5" y="24" width="4" height="4" rx="1" fill="#1565C0"/><rect x="28.5" y="24" width="4" height="4" rx="1" fill="#1565C0"/></svg>' },
  { i:"s-taharruc", a:"صَفّ التَّخَرُّج", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#EDE7F6"/><circle cx="24" cy="24" r="19" fill="#5E35B1"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><path d="M24 12l14 6-14 6-14-6z" fill="#FFF8E1"/><path d="M15 22v7c0 3 4.5 5 9 5s9-2 9-5v-7" fill="none" stroke="#FFF8E1" stroke-width="2.6"/><path d="M37 19v9" stroke="#FFD54F" stroke-width="2.2" stroke-linecap="round"/><circle cx="37" cy="30" r="2.2" fill="#FFD54F"/></svg>' },
  { i:"s-daftar", a:"صَفّ الدَّفْتَر", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFF3E0"/><circle cx="24" cy="24" r="19" fill="#EF6C00"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><rect x="13" y="11" width="20" height="26" rx="2.6" fill="#FFF8E1"/><path d="M18 17h11M18 22h11M18 27h7" stroke="#EF6C00" stroke-width="1.9" stroke-linecap="round"/><rect x="11" y="11" width="4" height="26" rx="2" fill="#FFB300"/></svg>' },
  { i:"s-sabbura", a:"صَفّ السَّبّورَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E8F5E9"/><circle cx="24" cy="24" r="19" fill="#2E7D32"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><rect x="11" y="12" width="26" height="18" rx="2.4" fill="#1B5E20"/><rect x="13.4" y="14.4" width="21.2" height="13.2" rx="1.4" fill="#388E3C"/><path d="M17 19h9M17 23h13" stroke="#FFF8E1" stroke-width="1.8" stroke-linecap="round"/><path d="M16 30v5M32 30v5" stroke="#8D6E63" stroke-width="2.4" stroke-linecap="round"/></svg>' },
  { i:"s-tuffaha", a:"صَفّ التُّفّاحَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFEBEE"/><circle cx="24" cy="24" r="19" fill="#C62828"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><path d="M24 15c-3-3-11-2-11 7 0 7 5 14 8 14 1.5 0 2-1 3-1s1.5 1 3 1c3 0 8-7 8-14 0-9-8-10-11-7z" fill="#FFCDD2"/><path d="M24 15v-4" stroke="#6D4C41" stroke-width="2.2" stroke-linecap="round"/><path d="M24 13c3-3 6-3 7-2 0 3-3 5-7 4z" fill="#66BB6A"/></svg>' },
  { i:"s-hafila", a:"صَفّ الحافِلَة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFFDE7"/><circle cx="24" cy="24" r="19" fill="#F9A825"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><rect x="9" y="15" width="30" height="16" rx="4" fill="#FFF8E1"/><rect x="12" y="18" width="9" height="7" rx="1.6" fill="#4FC3F7"/><rect x="24" y="18" width="9" height="7" rx="1.6" fill="#4FC3F7"/><circle cx="16" cy="32" r="3.4" fill="#37474F"/><circle cx="32" cy="32" r="3.4" fill="#37474F"/><rect x="9" y="27" width="30" height="2.6" fill="#F57F17"/></svg>' },
  { i:"s-jaras", a:"صَفّ الجَرَس", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFF8E1"/><circle cx="24" cy="24" r="19" fill="#FFA000"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><path d="M24 11a10 10 0 0 1 10 10v7l3 4H11l3-4v-7a10 10 0 0 1 10-10z" fill="#FFF8E1"/><circle cx="24" cy="35" r="3.2" fill="#FFF8E1"/><path d="M24 8v3" stroke="#FFF8E1" stroke-width="2.4" stroke-linecap="round"/></svg>' },
  { i:"s-kura", a:"صَفّ الكُرَة الأَرْضِيَّة", s:'<svg viewBox="0 0 48 48" class="biy-krk-svg" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E0F7FA"/><circle cx="24" cy="24" r="19" fill="#00838F"/><circle cx="24" cy="24" r="19" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".7"/><circle cx="24" cy="23" r="12" fill="#4DD0E1"/><path d="M12 23h24M24 11c4 5 4 19 0 24M24 11c-4 5-4 19 0 24" stroke="#00695C" stroke-width="1.8" fill="none"/><path d="M24 35v4M18 39h12" stroke="#FFF8E1" stroke-width="2.4" stroke-linecap="round"/></svg>' },
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

/* ---------------- Biçime göre HTML üreticileri ---------------- */
// Önizleme / sınıf modu kartlarındaki "şıklar" alanı.
function sikKartHtml(s, dogruGoster){
  const b = bicimAl(s);
  if (b === "test"){
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
// Yansıtılan admin tahtasındaki soru gövdesi (cevap fazı ve sonuç ekranı).
function tahtaIcerikHtml(soru, sonucMu){
  const b = bicimAl(soru);
  if (b === "test"){
    let h = "";
    (soru.secenekler || []).forEach((sec, i) => {
      const dogru = sonucMu && i === soru.dogru;
      h += '<div class="biy-a-opt'+(dogru?' dogru':'')+(arMi(sec)?' ar':' biy-ltr')+'" style="--c:'+SIK_RENK[i % SIK_RENK.length]+'">' +
           '<span class="biy-a-harf">'+String.fromCharCode(65+i)+'</span><span class="biy-a-metin">'+kacis(sec)+'</span>' +
           (dogru?'<span class="biy-a-tik">✓</span>':'') + '</div>';
    });
    return h;
  }
  if (b === "surukle"){
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
      (sonucMu ? '<div class="biy-a-cevapcubuk">✓ '+kacis(soru.cevapYazi||"")+'</div>' : '');
  }
  return "";
}
/* ---------------- Durum ---------------- */
const state = {
  mod: null, uid: null,
  bicimSecim: { "test": true, "surukle": true, "eslestir": true, "yazma": true },
  oyunModu: "takim",         // takim | birey | okul  (yarışma biçimi)
  bekleyenListe: [],         // birey modu: onay bekleyen katılımcılar
  katilimId: null,           // öğrenci tarafı: kendi katılımcı kaydının id'si
  katilimAbone: null,        // öğrenci tarafı: kendi kaydını dinleyen abonelik
  katilBagli: false,         // takimBagla bir kez çalıştı mı
  atildiMi: false,           // öğretmen bu cihazı yarışmadan çıkardı mı (kalıcı bayrak)
  takimNabiz: null,          // öğrenci tarafı: "hâlâ buradayım" zamanlayıcısı
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
  takim: { ad: "Takım Sistemi", emoji: "👥", kisi: "Takım", cog: "takım",      baslik: "Takım Oluştur & Lobi" },
  birey: { ad: "Bireysel Sistem", emoji: "🙋", kisi: "Katılımcı",  cog: "katılımcı", baslik: "Katılımcılar & Lobi" },
  okul:  { ad: "Sınıf Sistemi",  emoji: "🏫", kisi: "Sınıf", cog: "sınıf",      baslik: "Sınıf Oluştur & Lobi" }
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
  if (b === "surukle"){
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
  const b = bicimAl(s);
  if (b === "surukle"){
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
    /* Bu dosya 1. unite oyunlari klasorunde duruyor; geri tusu oyun listesine
       (index.html) doner. Ayni klasorde oldugu icin goreli adres yeterli.     */
    location.href = "index.html";
  },

  /* ---------- Konu seçimi ---------- */
  _aktifKonu(){ return state.konuId ? (KONULAR.find(k => k.id === state.konuId) || null) : null; },
  _aktifSorular(){ const k = BIY._aktifKonu(); return (k && k.sorular) || []; },
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
    const liste = $("konuSeciciListe");
    if (liste){
      liste.innerHTML = KONULAR.map((k, i) =>
        '<button type="button" role="option" style="--i:' + i + '" data-konu="' + kacis(k.id) + '"'
        + (k.pasif ? ' disabled aria-disabled="true"' : '')
        + ' class="biy-ds-oge' + (k.pasif ? ' biy-ds-pasif' : '') + '">'
        + '<span class="biy-ds-nokta" aria-hidden="true"></span>'
        + '<span class="biy-ds-ad2">' + kacis(k.ad) + '</span>'
        + (k.pasif ? '<span class="biy-ds-yakinda">yakında</span>'
                   : '<svg class="biy-ds-tik" viewBox="0 0 24 24" aria-hidden="true" fill="none"'
                     + ' stroke="currentColor" stroke-width="3.4" stroke-linecap="round"'
                     + ' stroke-linejoin="round"><polyline points="4 12.5 9.5 18 20 6.5"/></svg>')
        + '</button>').join("");
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
    const ov = document.createElement("div"); ov.id = "biySoruSec"; ov.className = "biy-onay-ov biy-soru-sec-ov";
    ov.innerHTML =
      '<div class="biy-soru-sec-kutu">' +
        '<div class="biy-soru-sec-bas">' +
          '<h3><span class="biy-hs-bas-ikon biy-anim">' + hvIkon + '</span> Soru Havuzu</h3>' +
          '<span class="biy-soru-sec-say" id="soruSecSecili"></span>' +
          '<button class="biy-soru-sec-kapat" onclick="BIY.soruSecKapat()">✕</button>' +
        '</div>' +
        '<div class="biy-soru-sec-liste" id="soruSecListe"></div>' +
        '<div class="biy-soru-sec-alt">' +
          '<button class="biy-btn biy-onay-hayir" onclick="BIY.soruSecTemizle()">Tümünü temizle</button>' +
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
      const sorular = k.sorular.filter(q => !ara || (q.soru + " " + (q.arapca||"") + " " + aramaMetni(q)).toLowerCase().indexOf(ara) >= 0);
      if (!sorular.length) return;
      const seciliSay = k.sorular.filter(q => set.has(k.id + "#" + q.id)).length;
      const acik = ara ? true : !!(state.soruSecAcik && state.soruSecAcik[k.id]);
      html += '<div class="biy-hs-grup'+(acik?' acik':'')+'" data-konu="'+k.id+'">' +
        '<div class="biy-hs-baslik" onclick="BIY.soruSecAkordiyon(\''+k.id+'\')">' +
        '<span class="biy-hs-ok">▸</span>' +
        '<b>'+kacis(k.ad)+'</b> <span class="biy-hs-say'+(seciliSay>0?' dolu':'')+(seciliSay===k.sorular.length?' tam':'')+'"><b>'+seciliSay+'</b><i>/</i>'+k.sorular.length+'</span>' +
        '<button class="biy-hs-tumu" title="Tümünü seç" aria-label="Tümünü seç" onclick="event.stopPropagation();BIY.soruSecTumu(\''+k.id+'\')">' +
          '<svg viewBox="0 0 24 24" class="biy-hs-tumu-svg" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.5"/><path class="biy-ea-ciz" d="M7.4 12.6l3 3 6.2-7.2"/></svg></button></div>' +
        '<div class="biy-hs-govde">';
      sorular.forEach(q => {
        const key = k.id + "#" + q.id; const sec = set.has(key);
        const dogruSik = dogruCevapMetni(q);
        html += '<label class="biy-hs-satir'+(sec?' secili':'')+'" data-key="'+key+'">' +
          '<input type="checkbox" '+(sec?'checked':'')+' onchange="BIY.soruSecTik(\''+key+'\', this)">' +
          '<span class="biy-hs-metin">'+soruHtml(q)+(q.arapca?' <i>'+kacis(q.arapca)+'</i>':'')+
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
      const sp = g.querySelector(".biy-hs-say");
      if (sp){
        sp.innerHTML = "<b>" + sec + "</b><i>/</i>" + k.sorular.length;
        sp.classList.toggle("dolu", sec > 0);
        sp.classList.toggle("tam", sec === k.sorular.length);
      }
      // tümünü-seç: grup tam seçiliyse animasyon durur, tik yeşil kalır
      const tb = g.querySelector(".biy-hs-tumu");
      if (tb) tb.classList.toggle("tam", sec === k.sorular.length);
    });
    const say = $("soruSecSecili"); if (say) say.innerHTML = 'Seçili <b class="biy-say-rozet">' + set.size + '</b>';
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
  /* ---------- soru tipi (biçim) filtresi ---------- */
  // aktif konunun sorularından yalnız seçili biçimdekiler
  _bicimliSorular(){
    return BIY._aktifSorular().filter(q => state.bicimSecim[bicimAl(q)] !== false);
  },
  _bicimPanelDoldur(){
    const p = $("bicimSecPanel"); if (!p) return;
    p.innerHTML = Object.keys(BICIM_BILGI).map(b =>
      '<button type="button" class="biy-bs-oge'+(state.bicimSecim[b] ? ' secili' : '')+'" data-b="'+b+'"' +
      ' title="'+kacis(BICIM_BILGI[b].ad)+'" aria-pressed="'+(state.bicimSecim[b] ? 'true' : 'false')+'"' +
      ' onclick="BIY.bicimToggle(\''+b+'\')">' + (ETIKET_BICIM[b] || "") +
      '<span class="biy-bs-tik" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12.5l4 4 8-9"/></svg></span></button>'
    ).join("");
  },
  bicimToggle(b){
    const sec = state.bicimSecim;
    // en az bir tip secili kalmali
    if (sec[b] && Object.keys(sec).filter(x => sec[x]).length <= 1) return;
    sec[b] = !sec[b];
    BIY._bicimPanelDoldur();
    BIY._soruSayiSinir();
    BIY._menuDurum();
  },
  bicimAcKapat(){
    const p = $("bicimSecPanel"), b = $("bicimSecBtn"); if (!p) return;
    if (p.hidden){
      BIY._bicimPanelDoldur();
      p.hidden = false;
      if (b) b.setAttribute("aria-expanded", "true");
      setTimeout(() => document.addEventListener("mousedown", BIY._bicimDis), 0);
    } else BIY.bicimKapat();
  },
  bicimKapat(){
    const p = $("bicimSecPanel"), b = $("bicimSecBtn");
    if (p) p.hidden = true;
    if (b) b.setAttribute("aria-expanded", "false");
    document.removeEventListener("mousedown", BIY._bicimDis);
  },
  _bicimDis(e){ if (!e.target.closest || !e.target.closest("#bicimSec")) BIY.bicimKapat(); },
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
      const od0 = snap.data() || {};
      state.oyunModu = MOD_BILGI[od0.mod] ? od0.mod : "takim";
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
      mod: modAl(),
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
      for (let i = hv.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); const g = hv[i]; hv[i] = hv[j]; hv[j] = g; }
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
    state.yedekSorular = yedek;   // beraberlikte yedek olarak kullanılır
    state.yedekSoruMap = {};
    state.berHedef = 0; state.berTakimlar = []; state.berSabit = {}; state.berNo = 0; state.berSorular = [];
    state.ayarKilidiKapali = false;   // yeni tur başladı → normal kilit davranışı
    await BIY._cevaplariSil();         // oda yeniden kullanılıyorsa eski cevapları temizle
    try {
      await db.collection(KOLEKSIYON).doc(state.odaId).update({
        durum: "oyun", faz: "cevap", aktifIndex: 0, toplamSoru: secilen.length, soruSuresi: SORU_SURESI,
        mod: modAl(),
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
    if (!soru){ kap.innerHTML = '<div class="biy-oyun-orta"><p class="biy-alt">Bu turun soruları bulunamadı (sayfa yenilenmiş olabilir). Yarışmayı yeniden başlat.</p><button class="biy-btn biy-btn-mavi" onclick="BIY.anasayfa()">Ana Menü</button></div>'; return; }
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
        '<div class="biy-a-optlar">'+ opt +'</div>';
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
    const satir = cevapTakimlari.map((tk,ri) => {
      const c = buCevaplar[tk.id]; const dogruMu = !!(c && cevapDogruMu(soru, c.secilen));
      const secim = c ? secimHtml(soru, c.secilen) : '<span class="biy-rev-yok">—</span>';
      const durum = c ? (dogruMu ? '✅ Doğru' : '❌ Yanlış') : '⏳ Cevapsız';
      return '<tr class="'+(c?(dogruMu?'dogru':'yanlis'):'yok')+'" style="--r:'+ri+'"><td>'+krkSvg(tk.krk, "biy-krk-mini")+kacis(tk.ad)+'</td><td class="biy-rev-sik">'+secim+'</td><td>'+durum+'</td></tr>';
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
    const lider = newOrder.map(id => {
      const ns = newR[id] || ids.length, ps = prevR[id] || ids.length, delta = ps - ns;
      const ok = delta > 0 ? '<span class="biy-ok biy-ok-yukari">▲</span>' : (delta < 0 ? '<span class="biy-ok biy-ok-asagi">▼</span>' : '<span class="biy-ok biy-ok-sabit"></span>');
      const cls = delta > 0 ? ' biy-lider-yukari' : (delta < 0 ? ' biy-lider-asagi' : '');
      return '<li class="biy-lider-satir'+cls+'"><span class="biy-lider-sira">'+ns+'</span>'+ok+'<span class="biy-lider-ad">'+krkSvg(krkOf(id), "biy-krk-mini")+kacis(adOf(id))+'</span><b>'+(newP[id]||0)+'</b></li>';
    }).join("");
    const degisti = ids.some(id => (prevR[id]||ids.length) !== (newR[id]||ids.length));
    const son = ber ? true : (idx + 1 >= toplam);
    const step = taze ? 0 : 2;   // yenileme olursa doğrudan son sahne (liderlik)
    const t = TIP_BILGI[soru.tip] || { ad: soru.tip, emoji: "❓" };
    const baslik = ber
      ? '⚔️ '+(o.berHedef===1?'Liderlik':'İkincilik')+' · Beraberlik · Soru '+o.berNo
      : '📊 Sonuç · Soru '+(idx+1)+' / '+toplam;
    return '<div class="biy-oyun-orta biy-sonuc-ekran" data-degisti="'+(degisti?1:0)+'" data-step="'+step+'">' +
      '<div class="biy-sonuc-baslik'+(ber?' biy-ber':'')+'">'+baslik+'</div>' +
      '<div class="biy-sonuc-sahne">' +
        // SAHNE 1: soru cümlesi + şıklar + vurgulu doğru şık
        '<div class="biy-sahne-oge oge-dogru">' +
          etiketHtml(soru) + '<div class="biy-sonuc-soru-cumle">'+soruHtml(soru)+'</div>' +
          (soru.arapca ? '<div class="biy-oyun-arapca">'+kacis(soru.arapca)+'</div>' : '') +
          '<div class="biy-a-optlar">'+optHtml+'</div>' +
        '</div>' +
        // SAHNE 2: sınıfların verdiği cevaplar (devasa)
        '<div class="biy-sahne-oge oge-reveal">' +
          '<div class="biy-reveal'+(cevapTakimlari.length > 8 && modAl() === "birey" ? ' biy-kaydir' : '')+'"><table class="biy-reveal-tablo"><thead><tr><th>'+basSutun+'</th><th>Cevap</th><th>Durum</th></tr></thead><tbody>'+satir+'</tbody></table></div>' +
        '</div>' +
        // SAHNE 3: güncel puan durumu (devasa)
        '<div class="biy-sahne-oge oge-lider">' +
          '<div class="biy-sonuc-lider"><h4>🏆 Puan Durumu</h4><ol class="biy-lider-ol'+(newOrder.length>10?' biy-kaydir':'')+'">'+lider+'</ol></div>' +
        '</div>' +
      '</div>' +
      // aşağıda üç ilerleme çizgisi — tıklayınca ilgili sayfaya geçer
      '<div class="biy-sonuc-nokta">' +
        '<button class="biy-nokta" data-adim="0" onclick="BIY.sonucAdim(0)" title="Soru & doğru cevap"><span class="biy-nk-ikon"><svg viewBox="0 0 24 24" class="biy-nk-svg" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"/><path d="M8.2 12.4l2.6 2.6 5-5.8"/></svg></span><i class="biy-nk-cizgi"></i></button>' +
        '<button class="biy-nokta" data-adim="1" onclick="BIY.sonucAdim(1)" title="Katılımcı cevapları"><span class="biy-nk-ikon"><svg viewBox="0 0 24 24" class="biy-nk-svg" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.6" cy="6" r="1.5"/><path d="M10 6h8.4"/><circle cx="5.6" cy="12" r="1.5"/><path d="M10 12h8.4"/><circle cx="5.6" cy="18" r="1.5"/><path d="M10 18h8.4"/></svg></span><i class="biy-nk-cizgi"></i></button>' +
        '<button class="biy-nokta" data-adim="2" onclick="BIY.sonucAdim(2)" title="Puan durumu"><span class="biy-nk-ikon"><svg viewBox="0 0 24 24" class="biy-nk-svg" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="13" width="4.6" height="7.4" rx="1.2"/><rect x="9.7" y="8.4" width="4.6" height="12" rx="1.2"/><rect x="15.4" y="15" width="4.6" height="5.4" rx="1.2"/></svg></span><i class="biy-nk-cizgi"></i></button>' +
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
      '<div class="biy-logo">'+simge("🏆")+'</div><h1>Yarışma Bitti!</h1>' +
      '<ol class="biy-final-ol'+(sirali.length>10?' biy-kaydir':'')+'">' +
        sirali.map((t,i) => '<li class="'+(i<3?'podyum':'')+(i===0?' birinci':'')+'" style="--i:'+i+'"><span class="biy-final-sira">'+(madalya[i]||(i+1))+'</span><span class="biy-final-ad">'+kacis(t.ad)+'</span><b>'+puanOf(t)+'</b></li>').join("") +
      '</ol>' +
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
    $("takimIcerik").className = "biy-orta";
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
      if (b === "surukle")       n = (s.karisik || []).length;
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
    if (b === "surukle")  return "Parçaları sürükleyerek sırala";
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

    if (b === "surukle"){
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
    if (b === "surukle"){
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

  /* Tek karekodlu modlarda (birey/okul) baglanti yalnizca ?oda= tasir; ogrenci
     kendi adini yazar ve ogretmen onayini bekler. Takim modunda ise her takimin
     kendi karekodu vardir, bu yuzden ?takim= de bulunur.                     */
  if (oda && !takim){
    state.mod = "takim";
    try { firebase.auth().signInAnonymously().catch(function(){}); } catch(e){}
    BIY.katilimAkisi(oda);
    return;
  }

  if (oda && takim){
    state.mod = "takim"; state.odaTakim = { oda, takim };
    ekranGoster("ekranTakim");
    // takım listesi (final için) hafif dinleme
    db.collection(KOLEKSIYON).doc(oda).collection("takimlar").onSnapshot(snap => {
      state.takimListe = []; snap.forEach(d => { const t = d.data(); state.takimListe.push({ id: d.id, ad: t.ad, puan: t.puan||0, bagli: !!t.bagli }); });
    }, () => {});
    // kidef kuralları için anonim oturum; ardından takım bağlanır.
    try { firebase.auth().signInAnonymously().catch(function(){}); } catch(e){}
    BIY.takimBagla(oda, takim);
    return;
  }

  /* Sade adres (?oda= yok) ile açan kişi öğretmendir: kidefarapca.com'daki
     hesap/rol denetimi AYNEN korunur (index girişindeki teacher/admin). */
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
      if (!(rol === "teacher" || rol === "admin")){
        $("girisRolNot").textContent = "Bu hesabın rolü öğrenci. Yarışmayı yalnızca öğretmen/yönetici yönetebilir.";
        ekranGoster("ekranGirisKapisi"); return;
      }
      const isim = (doc.data().name && doc.data().name !== "Belirtilmedi") ? doc.data().name : (user.email || "Yönetici");
      const adEl = $("adminAd"); if (adEl) adEl.textContent = (rol === "admin" ? "Yönetici: " : "Öğretmen: ") + isim;
      BIY._girisSonrasi();
    }).catch(err => { console.error("Rol:", err); ekranGoster("ekranGirisKapisi"); });
  });
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
    else ekranGoster("ekranAnasayfa");
  } catch(err){
    console.error("[BIY] Açılış hatası:", err);
    const not = $("girisRolNot");
    if (not) not.textContent = String(err && err.message ? err.message : err);
    ekranGoster("ekranGirisKapisi");
  }
};
