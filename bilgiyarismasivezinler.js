/* ===========================================================
   Bilgi Yarışması — Vezinler & Kelimeler
   Firebase 8.10.1 (compat) · proje: kidefarapca-98f9c
   Mod 1 (ADMIN): index girişinde teacher/admin ise yönetim.
   Mod 2 (TAKIM): ?oda=..&takim=.. linkiyle anonim katılım.
   NOT: Bu ilk kilometre taşı — canlı oyun döngüsü (soru akışı,
   süre senkronu, puanlama, sonuç) bir sonraki adımda eklenecek.
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

/* ---------------- Seed soru havuzu ----------------
   Şimdilik örnek havuz (عرج / جدد / vezin verisinden).
   İleride veri_kokler.js'ten otomatik üretilip 100'e çıkarılacak.
   tip: kok | vezin | anlam | ters-vezin | ayet
   zorluk: 1 (kolay) | 2 (orta) | 3 (zor)
   dogru: doğru şıkkın 0-tabanlı indeksi
------------------------------------------------------ */
const SORULAR = [
  { id: 1,  tip: "kok",        zorluk: 1, soru: "Bu kelime hangi kökten gelir?", arapca: "جَدِيد", secenekler: ["ج-د-د","ع-ر-ج","ك-ت-ب","ح-م-د"], dogru: 0, arSecenek: true },
  { id: 2,  tip: "anlam",      zorluk: 1, soru: "«جَدِيد» ne demek?", arapca: "جَدِيد", secenekler: ["Yeni","Eski","Büyük","Uzak"], dogru: 0 },
  { id: 3,  tip: "vezin",      zorluk: 2, soru: "«جَدِيد» hangi vezindedir?", arapca: "جَدِيد", secenekler: ["فَعِيل","فَاعِل","مَفْعُول","فَعَّال"], dogru: 0, arSecenek: true },
  { id: 4,  tip: "anlam",      zorluk: 1, soru: "«جَدّ» ne demek?", arapca: "جَدّ", secenekler: ["Dede","Baba","Amca","Torun"], dogru: 0 },
  { id: 5,  tip: "kok",        zorluk: 1, soru: "Bu kelime hangi kökten gelir?", arapca: "أَعْرَج", secenekler: ["ع-ر-ج","ج-د-د","ر-ج-ع","ع-ج-ز"], dogru: 0, arSecenek: true },
  { id: 6,  tip: "anlam",      zorluk: 2, soru: "«أَعْرَج» ne demek?", arapca: "أَعْرَج", secenekler: ["Topal","Kör","Sağır","Dilsiz"], dogru: 0 },
  { id: 7,  tip: "vezin",      zorluk: 2, soru: "«مُجَدِّد» hangi vezindedir?", arapca: "مُجَدِّد", secenekler: ["مُفَعِّل","مُفْعِل","مُتَفَعِّل","فَاعِل"], dogru: 0, arSecenek: true },
  { id: 8,  tip: "anlam",      zorluk: 2, soru: "«مُجَدِّد» ne demek?", arapca: "مُجَدِّد", secenekler: ["Yenileyen (müceddid)","Yenilenmiş","Yenilenme","Eskiten"], dogru: 0 },
  { id: 9,  tip: "ters-vezin", zorluk: 3, soru: "«ج-د-د» kökünün «فَاعِل» kalıbındaki hâli hangisidir?", secenekler: ["جَادّ","جَدِيد","مُجَدِّد","جَدَّدَ"], dogru: 0, arSecenek: true },
  { id: 10, tip: "ters-vezin", zorluk: 3, soru: "«ج-د-د» kökünün «تَفْعِيل» masdarı hangisidir?", secenekler: ["تَجْدِيد","تَجَدُّد","مُجَدَّد","جِدِّيَّة"], dogru: 0, arSecenek: true },
  { id: 11, tip: "vezin",      zorluk: 3, soru: "İsm-i mekân için doğru vezin hangisidir?", secenekler: ["مَفْعِل","فَاعِل","فَعِيل","مِفْعَال"], dogru: 0, arSecenek: true },
  { id: 12, tip: "anlam",      zorluk: 3, soru: "«جِدِّيَّة» ne demek?", arapca: "جِدِّيَّة", secenekler: ["Ciddiyet","Yenilik","Topallık","Yükseliş"], dogru: 0 },
  { id: 13, tip: "ayet",       zorluk: 3, soru: "«مِنَ اللّهِ ذِي الْمَعَارِجِ» — buradaki «مَعَارِج» hangi kökten gelir?", arapca: "مَعَارِج", secenekler: ["ع-ر-ج","ع-ج-م","م-ع-ر","ر-ج-و"], dogru: 0, arSecenek: true },
  { id: 14, tip: "kok",        zorluk: 2, soru: "Bu kelime hangi kökten gelir?", arapca: "مُسْتَجِدّ", secenekler: ["ج-د-د","س-ج-د","و-ج-د","ج-ه-د"], dogru: 0, arSecenek: true },
  { id: 15, tip: "vezin",      zorluk: 1, soru: "«فَاعِل» vezni aşağıdaki kelimelerden hangisindedir?", secenekler: ["جَادّ","جَدِيد","مُجَدِّد","أَجَدَّ"], dogru: 0, arSecenek: true }
];

const TIP_BILGI = {
  "kok":        { ad: "Kök Bulma",      emoji: "🌱" },
  "vezin":      { ad: "Vezin Bulma",    emoji: "⚖️" },
  "anlam":      { ad: "Anlam",          emoji: "💡" },
  "ters-vezin": { ad: "Kalıptan Üretme",emoji: "🔧" },
  "ayet":       { ad: "Ayet / Örnek",   emoji: "📖" }
};
const ZORLUK_AD = { 1: "Kolay", 2: "Orta", 3: "Zor" };

/* ---------------- Durum ---------------- */
const state = {
  mod: null,              // 'admin' | 'takim'
  uid: null,
  odaId: null,            // admin: oluşturulan oda
  odaTakim: null,         // takım modunda: {oda, takim}
  takimAbone: null,       // lobi dinleyicisi (admin)
  odaAbone: null,         // oda durum dinleyicisi (takım)
  qrSayac: 0
};

/* ---------------- Yardımcılar ---------------- */
function $(id){ return document.getElementById(id); }
function ekranGoster(id){
  document.querySelectorAll(".biy-ekran").forEach(e => e.classList.add("gizli"));
  const el = $(id); if (el) el.classList.remove("gizli");
}
function rastgeleKod(uzunluk){
  const harf = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // karışabilenler (I,O,0,1) çıkarıldı
  let s = ""; for (let i=0;i<uzunluk;i++) s += harf[Math.floor(Math.random()*harf.length)];
  return s;
}
function takimLinki(oda, takim){
  const base = location.origin + location.pathname;
  return base + "?oda=" + encodeURIComponent(oda) + "&takim=" + encodeURIComponent(takim);
}

/* ===========================================================
   BIY — dışa açık arayüz
   =========================================================== */
const BIY = {

  anasayfa(){ ekranGoster("ekranAnasayfa"); },

  /* ---------- Sorular önizleme (her tipten bir örnek) ---------- */
  acSorular(){
    const liste = $("sorularListe");
    liste.innerHTML = "";
    Object.keys(TIP_BILGI).forEach(tip => {
      const ornek = SORULAR.find(s => s.tip === tip);
      if (!ornek) return;
      liste.appendChild(BIY._soruKartEl(ornek, true));
    });
    ekranGoster("ekranSorular");
  },

  _soruKartEl(s, dogruGoster){
    const t = TIP_BILGI[s.tip] || { ad: s.tip, emoji: "❓" };
    const kart = document.createElement("div");
    kart.className = "biy-soru-kart";
    let sikHtml = "";
    s.secenekler.forEach((sec, i) => {
      const dogruMu = dogruGoster && i === s.dogru;
      const sinif = "biy-secenek" + (dogruMu ? " dogru" : "") + (s.arSecenek ? " biy-arapca-secenek" : "");
      const harf = String.fromCharCode(65 + i);
      sikHtml += '<div class="'+sinif+'"><span class="biy-sik">'+harf+'</span>'+ BIY._kacis(sec) +'</div>';
    });
    kart.innerHTML =
      '<span class="biy-soru-tip">'+t.emoji+' '+t.ad+'</span>' +
      '<span class="biy-zorluk z'+s.zorluk+'">'+ ZORLUK_AD[s.zorluk] +'</span>' +
      '<div class="biy-soru-metin">'+ BIY._kacis(s.soru) +'</div>' +
      (s.arapca ? '<div class="biy-soru-arapca">'+ BIY._kacis(s.arapca) +'</div>' : '') +
      '<div class="biy-secenekler">'+ sikHtml +'</div>';
    return kart;
  },
  _kacis(t){ const d = document.createElement("div"); d.textContent = t == null ? "" : String(t); return d.innerHTML; },

  /* ---------- Takım Oluştur ---------- */
  acTakimlar(){
    ekranGoster("ekranTakimlar");
    if (!state.odaId){
      $("takimlarGrid").innerHTML = "";
      $("odaBilgi").classList.add("gizli");
    }
  },

  async _odayiHazirla(){
    if (state.odaId) return state.odaId;
    let kod, ref, mevcut = true, deneme = 0;
    // çakışmayan bir oda kodu bul
    while (mevcut && deneme < 6){
      kod = rastgeleKod(4); ref = db.collection(KOLEKSIYON).doc(kod);
      const snap = await ref.get(); mevcut = snap.exists; deneme++;
    }
    await ref.set({
      durum: "lobi",
      olusturan: state.uid || null,
      olusturmaZamani: firebase.firestore.FieldValue.serverTimestamp(),
      aktifSoru: -1,
      soruSayisi: 20
    });
    state.odaId = kod;
    $("odaBilgi").classList.remove("gizli");
    $("odaBilgi").innerHTML = "Oda kodu: <b>" + kod + "</b> · takımlar linkle/karekodla katılır";
    // lobi dinleyicisi
    if (state.takimAbone) state.takimAbone();
    state.takimAbone = db.collection(KOLEKSIYON).doc(kod).collection("takimlar")
      .orderBy("olusturmaZamani")
      .onSnapshot(snap => BIY._takimlariCiz(snap));
    return kod;
  },

  async takimEkle(){
    const inp = $("takimAdiInput");
    const ad = (inp.value || "").trim();
    if (!ad){ inp.focus(); return; }
    inp.value = "";
    try{
      const oda = await BIY._odayiHazirla();
      const takimId = rastgeleKod(5);
      await db.collection(KOLEKSIYON).doc(oda).collection("takimlar").doc(takimId).set({
        ad: ad,
        bagli: false,
        puan: 0,
        olusturmaZamani: firebase.firestore.FieldValue.serverTimestamp()
      });
      // kartlar onSnapshot ile çizilecek
    }catch(e){
      console.error("Takım eklenemedi:", e);
      $("baslatNot").textContent = "Takım eklenemedi (Firebase izinleri?): " + (e.code || e.message);
    }
  },

  _takimlariCiz(snap){
    const grid = $("takimlarGrid");
    grid.innerHTML = "";
    let sayi = 0, bagli = 0;
    snap.forEach(doc => {
      sayi++;
      const t = doc.data();
      if (t.bagli) bagli++;
      const link = takimLinki(state.odaId, doc.id);
      const kart = document.createElement("div");
      kart.className = "biy-takim-kart";
      const qrId = "qr_" + doc.id;
      kart.innerHTML =
        '<button class="biy-sil" title="Sil" onclick="BIY.takimSil(\''+doc.id+'\')">✕</button>' +
        '<h3>'+ BIY._kacis(t.ad) +'</h3>' +
        '<div class="biy-takim-durum '+(t.bagli?"biy-bagli":"biy-bekliyor")+'">'+(t.bagli?"● Bağlandı":"○ Bekleniyor")+'</div>' +
        '<div class="biy-qr" id="'+qrId+'"></div>' +
        '<div class="biy-takim-link"><input readonly value="'+ BIY._kacis(link) +'"><button class="biy-kopya" onclick="BIY.kopyala(this)">Kopyala</button></div>';
      grid.appendChild(kart);
      // QR üret
      try{
        const box = document.getElementById(qrId);
        if (box && window.QRCode){ box.innerHTML=""; new QRCode(box, { text: link, width: 132, height: 132, correctLevel: QRCode.CorrectLevel.M }); }
      }catch(err){ console.warn("QR üretilemedi:", err); }
    });
    // başlat butonu
    const baslat = $("baslatBtn");
    if (sayi >= 2){ baslat.classList.remove("gizli"); } else { baslat.classList.add("gizli"); }
    $("baslatNot").textContent = sayi === 0 ? "" :
      (sayi + " takım · " + bagli + " bağlandı" + (sayi < 2 ? " · başlatmak için en az 2 takım" : ""));
  },

  async takimSil(takimId){
    if (!state.odaId) return;
    try{ await db.collection(KOLEKSIYON).doc(state.odaId).collection("takimlar").doc(takimId).delete(); }
    catch(e){ console.error("Silinemedi:", e); }
  },

  kopyala(btn){
    const inp = btn.parentElement.querySelector("input");
    inp.select(); inp.setSelectionRange(0, 99999);
    try{ navigator.clipboard.writeText(inp.value); btn.textContent = "✓"; setTimeout(()=>btn.textContent="Kopyala", 1200); }
    catch(e){ document.execCommand("copy"); }
  },

  async yarisiBaslat(){
    if (!state.odaId) return;
    try{
      await db.collection(KOLEKSIYON).doc(state.odaId).update({
        durum: "basladi",
        baslamaZamani: firebase.firestore.FieldValue.serverTimestamp()
      });
      $("baslatNot").textContent = "Yarışma başlatıldı. (Canlı soru döngüsü bir sonraki adımda eklenecek.)";
    }catch(e){ console.error(e); $("baslatNot").textContent = "Başlatılamadı: " + (e.code||e.message); }
  },

  /* ---------- TAKIM MODU ---------- */
  async takimBagla(oda, takim){
    ekranGoster("ekranTakim");
    $("takimBekleAnim").classList.remove("gizli");
    const takimRef = db.collection(KOLEKSIYON).doc(oda).collection("takimlar").doc(takim);
    try{
      const snap = await takimRef.get();
      if (!snap.exists){
        $("takimDurumEmoji").textContent = "❌";
        $("takimAdBaslik").textContent = "Takım bulunamadı";
        $("takimDurumMetin").textContent = "Bu link geçersiz ya da takım silinmiş olabilir.";
        $("takimBekleAnim").classList.add("gizli");
        return;
      }
      const t = snap.data();
      $("takimAdBaslik").textContent = t.ad || "Takım";
      $("takimDurumMetin").textContent = "Bağlandın! Yöneticinin yarışmayı başlatması bekleniyor…";
      $("takimDurumEmoji").textContent = "✅";
      await takimRef.update({ bagli: true, sonGorulme: firebase.firestore.FieldValue.serverTimestamp() });

      // kalp atışı (bağlı kal)
      setInterval(()=>{ takimRef.update({ sonGorulme: firebase.firestore.FieldValue.serverTimestamp() }).catch(()=>{}); }, 20000);
      // sekme kapanınca bağlantıyı düşür (best effort)
      window.addEventListener("pagehide", ()=>{ takimRef.update({ bagli: false }).catch(()=>{}); });

      // oda durumunu dinle
      if (state.odaAbone) state.odaAbone();
      state.odaAbone = db.collection(KOLEKSIYON).doc(oda).onSnapshot(d => {
        const data = d.data(); if (!data) return;
        if (data.durum === "basladi"){
          $("takimDurumEmoji").textContent = "🎬";
          $("takimAdBaslik").textContent = t.ad || "Takım";
          $("takimDurumMetin").textContent = "Yarışma başladı! Sorular birazdan ekranında.";
          $("takimBekleAnim").classList.add("gizli");
          // (Canlı soru döngüsü bir sonraki adımda buraya bağlanacak.)
        }
      });
    }catch(e){
      console.error("Bağlanılamadı:", e);
      $("takimDurumEmoji").textContent = "⚠️";
      $("takimDurumMetin").textContent = "Bağlanılamadı. İnternetini ve linki kontrol et.";
      $("takimBekleAnim").classList.add("gizli");
    }
  }
};
window.BIY = BIY;

/* ===========================================================
   Başlangıç / mod yönlendirme
   =========================================================== */
(function baslat(){
  const p = new URLSearchParams(location.search);
  const oda = p.get("oda"), takim = p.get("takim");

  if (oda && takim){
    // ---- TAKIM MODU ----
    state.mod = "takim"; state.odaTakim = { oda, takim };
    ekranGoster("ekranTakim");
    firebase.auth().signInAnonymously()
      .then(cred => { state.uid = cred.user.uid; BIY.takimBagla(oda, takim); })
      .catch(err => {
        console.error("Anonim giriş hatası:", err);
        // anonim giriş kapalıysa yine de dene (kurallar açıksa çalışır)
        BIY.takimBagla(oda, takim);
      });
    return;
  }

  // ---- ADMIN MODU ---- (index girişinde teacher/admin şart)
  state.mod = "admin";
  ekranGoster("ekranYukleniyor");
  firebase.auth().onAuthStateChanged(user => {
    if (!user || user.isAnonymous){
      $("girisRolNot").textContent = user && user.isAnonymous ? "Misafir olarak giriş yapılmış; yönetim için öğretmen/yönetici hesabı gerekli." : "";
      ekranGoster("ekranGirisKapisi");
      return;
    }
    state.uid = user.uid;
    db.collection("kullanicilar").doc(user.uid).get().then(doc => {
      const rol = (doc.exists && doc.data().role) ? doc.data().role : "student";
      if (rol === "teacher" || rol === "admin"){
        const isim = (doc.data().name && doc.data().name !== "Belirtilmedi") ? doc.data().name : (user.email || "Yönetici");
        $("adminAd").textContent = (rol === "admin" ? "Yönetici: " : "Öğretmen: ") + isim;
        ekranGoster("ekranAnasayfa");
      }else{
        $("girisRolNot").textContent = "Bu hesabın rolü öğrenci. Yarışmayı yalnızca öğretmen/yönetici yönetebilir.";
        ekranGoster("ekranGirisKapisi");
      }
    }).catch(err => {
      console.error("Rol okunamadı:", err);
      ekranGoster("ekranGirisKapisi");
    });
  });
})();
