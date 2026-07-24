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
const TUR_SORU_SAYISI = 20;  // her yarışmada
const PUAN = { 1: 10, 2: 20, 3: 30 };

/* ---------------- Seed soru havuzu ---------------- */
const SORULAR = [
  { id: 1,  tip: "kok",        zorluk: 1, soru: "Bu kelime hangi kökten gelir?", arapca: "جَدِيد", secenekler: ["ج-د-د","ع-ر-ج","ك-ت-ب","ح-م-د"], dogru: 0, arSecenek: true },
  { id: 2,  tip: "anlam",      zorluk: 1, soru: "«جَدِيد» ne demek?", arapca: "جَدِيد", secenekler: ["Yeni","Eski","Büyük","Uzak"], dogru: 0 },
  { id: 3,  tip: "vezin",      zorluk: 2, soru: "«جَدِيد» hangi vezindedir?", arapca: "جَدِيد", secenekler: ["فَعِيل","فَاعِل","مَفْعُول","فَعَّال"], dogru: 0, arSecenek: true },
  { id: 4,  tip: "anlam",      zorluk: 1, soru: "«جَدّ» ne demek?", arapca: "جَدّ", secenekler: ["Dede","Baba","Amca","Torun"], dogru: 0 },
  { id: 5,  tip: "kok",        zorluk: 1, soru: "Bu kelime hangi kökten gelir?", arapca: "أَعْرَج", secenekler: ["ع-ر-ج","ج-د-د","ر-ج-ع","ع-ج-ز"], dogru: 0, arSecenek: true },
  { id: 6,  tip: "anlam",      zorluk: 2, soru: "«أَعْرَج» ne demek?", arapca: "أَعْرَج", secenekler: ["Topal","Kör","Sağır","Dilsiz"], dogru: 0 },
  { id: 7,  tip: "vezin",      zorluk: 2, soru: "«مُجَدِّد» hangi vezindedir?", arapca: "مُجَدِّد", secenekler: ["مُفَعِّل","مُفْعِل","مُتَفَعِّل","فَاعِل"], dogru: 0, arSecenek: true },
  { id: 8,  tip: "anlam",      zorluk: 2, soru: "«مُجَدِّد» ne demek?", arapca: "مُجَدِّد", secenekler: ["Yenileyen (müceddid)","Yenilenmiş","Yenilenme","Eskiten"], dogru: 0 },
  { id: 9,  tip: "ters-vezin", zorluk: 3, soru: "«ج-د-د» kökünün «فَاعِل» kalıbındaki hâli hangisidir?", secenekler: ["جَادّ","جَدِيد","مُجَدِّد","جَدَّدَ","تَجْدِيد"], dogru: 0, arSecenek: true },
  { id: 10, tip: "ters-vezin", zorluk: 3, soru: "«ج-د-د» kökünün «تَفْعِيل» masdarı hangisidir?", secenekler: ["تَجْدِيد","تَجَدُّد","مُجَدَّد","جِدِّيَّة","مُجَدِّد"], dogru: 0, arSecenek: true },
  { id: 11, tip: "vezin",      zorluk: 3, soru: "İsm-i mekân için doğru vezin hangisidir?", secenekler: ["مَفْعِل","فَاعِل","فَعِيل","مِفْعَال","مَفْعُول"], dogru: 0, arSecenek: true },
  { id: 12, tip: "anlam",      zorluk: 3, soru: "«جِدِّيَّة» ne demek?", arapca: "جِدِّيَّة", secenekler: ["Ciddiyet","Yenilik","Topallık","Yükseliş","Eskilik"], dogru: 0 },
  { id: 13, tip: "ayet",       zorluk: 3, soru: "«مِنَ اللّهِ ذِي الْمَعَارِجِ» — buradaki «مَعَارِج» hangi kökten gelir?", arapca: "مَعَارِج", secenekler: ["ع-ر-ج","ع-ج-م","م-ع-ر","ر-ج-و","ج-ر-ع"], dogru: 0, arSecenek: true },
  { id: 14, tip: "kok",        zorluk: 2, soru: "Bu kelime hangi kökten gelir?", arapca: "مُسْتَجِدّ", secenekler: ["ج-د-د","س-ج-د","و-ج-د","ج-ه-د"], dogru: 0, arSecenek: true },
  { id: 15, tip: "vezin",      zorluk: 1, soru: "«فَاعِل» vezni aşağıdaki kelimelerden hangisindedir?", secenekler: ["جَادّ","جَدِيد","مُجَدِّد","أَجَدَّ"], dogru: 0, arSecenek: true }
];
const TIP_BILGI = {
  "kok":        { ad: "Kök Bulma",       emoji: "🌱" },
  "vezin":      { ad: "Vezin Bulma",     emoji: "⚖️" },
  "anlam":      { ad: "Anlam",           emoji: "💡" },
  "ters-vezin": { ad: "Kalıptan Üretme", emoji: "🔧" },
  "ayet":       { ad: "Ayet / Örnek",    emoji: "📖" }
};
const ZORLUK_AD = { 1: "Kolay", 2: "Orta", 3: "Zor" };
const SIK_RENK = ["#E74C3C", "#3498DB", "#F1C40F", "#27AE60", "#9B59B6"]; // A B C D E
const SEVIYE_ZORLUK = { kolay: 1, orta: 2, zor: 3 };

/* ---------------- Durum ---------------- */
const state = {
  mod: null, uid: null,
  seviye: "kolay",           // kolay | orta | zor  (zor => 5 şık)
  sorularZ: 1,               // Sorular önizleme sekmesi (zorluk)
  soruGizli: false,          // admin ekranında soruyu gizle/göster (kalıcı toggle)
  otoSonucIndex: -1,         // tüm takımlar cevaplayınca otomatik sonuç kilidi
  odaId: null,               // admin: oda kodu
  odaTakim: null,            // takım: {oda, takim}
  takimAd: "",
  takimAbone: null, odaAboneAdmin: null, odaAbone: null, cevapAbone: null,
  oda: null,                 // canlı oda dokümanı
  takimListe: [],            // [{id, ad, bagli, puan}]
  cevaplar: {},              // "takimId_index" -> {takimId, ad, index, secilen}
  oyunSorulari: [],          // admin: seçilen sorular (cevap dahil)
  sayacInterval: null,
  sonCevapIndex: -1,
  sonucAnimIndex: -1,        // sonuç ekranı animasyonu hangi soru için oynatıldı
  sonucTimerlar: [],         // sonuç ekranı adım zamanlayıcıları (temizlik için)
  finalKonfeti: false,       // yarışma bitti ekranında konfeti bir kez patlar
  baglSet: null,             // o an bağlı takım id kümesi (yeni bağlanmayı yakalamak için)
  baglIlk: false,            // ilk takım snapshot'ı işlendi mi (açılışta ses çalmamak için)
  hepsiSesIndex: -1          // "tümü cevapladı" sesi hangi soru için çalındı
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

  anasayfa(){ sayacDurdur(); ekranGoster("ekranAnasayfa"); },

  // Geri: sekmeyi (dosyayı) kapatmayı dene; kapanmazsa kaliplartablosu.html'e git
  geriDon(){
    try { window.close(); } catch(e){}
    setTimeout(function(){ location.href = "kaliplartablosu.html"; }, 120);
  },

  /* ---------- Sorular önizleme ---------- */
  acSorular(){ BIY.sorularSekme(state.sorularZ || 1); ekranGoster("ekranSorular"); },
  sorularSekme(z){
    state.sorularZ = z;
    document.querySelectorAll(".biy-sekme").forEach(b => b.classList.toggle("secili", +b.getAttribute("data-z") === z));
    const liste = $("sorularListe"); liste.innerHTML = "";
    const list = SORULAR.filter(s => s.zorluk === z);
    if (!list.length){ liste.innerHTML = '<p class="biy-alt" style="text-align:center">Bu seviyede henüz örnek yok.</p>'; return; }
    list.forEach(s => liste.appendChild(BIY._soruKartEl(s, true)));
  },
  _soruKartEl(s, dogruGoster){
    const t = TIP_BILGI[s.tip] || { ad: s.tip, emoji: "❓" };
    const kart = document.createElement("div"); kart.className = "biy-soru-kart";
    let sikHtml = "";
    s.secenekler.forEach((sec, i) => {
      const dogruMu = dogruGoster && i === s.dogru;
      const sinif = "biy-secenek" + (dogruMu ? " dogru" : "") + (s.arSecenek ? " biy-arapca-secenek" : "");
      sikHtml += '<div class="'+sinif+'"><span class="biy-sik">'+String.fromCharCode(65+i)+'</span>'+ kacis(sec) +'</div>';
    });
    kart.innerHTML =
      '<span class="biy-soru-tip">'+t.emoji+' '+t.ad+'</span>' +
      '<span class="biy-zorluk z'+s.zorluk+'">'+ ZORLUK_AD[s.zorluk] +'</span>' +
      '<div class="biy-soru-metin">'+ kacis(s.soru) +'</div>' +
      (s.arapca ? '<div class="biy-soru-arapca">'+ kacis(s.arapca) +'</div>' : '') +
      '<div class="biy-secenekler">'+ sikHtml +'</div>';
    return kart;
  },

  /* ---------- Takım Oluştur / Lobi ---------- */
  acTakimlar(){
    ekranGoster("ekranTakimlar");
    if (!state.odaId){ $("takimlarGrid").innerHTML = ""; $("odaBilgi").classList.add("gizli"); }
  },
  // --- Kalıcılık (sayfa yenilense de oyun kaybolmasın) ---
  _kaydet(){
    try { localStorage.setItem('biy_aktif', JSON.stringify({ oda: state.odaId, sorular: state.oyunSorulari, seviye: state.seviye, ts: Date.now() })); } catch(e){}
  },
  _temizleKayit(){ try { localStorage.removeItem('biy_aktif'); } catch(e){} },
  async _devamEt(kayit){
    try {
      if (kayit.ts && (Date.now() - kayit.ts) > 12*3600*1000){ BIY._temizleKayit(); ekranGoster('ekranAnasayfa'); return; }
      const ref = db.collection(KOLEKSIYON).doc(kayit.oda);
      const snap = await ref.get();
      if (!snap.exists || snap.data().durum === 'bitti'){ BIY._temizleKayit(); ekranGoster('ekranAnasayfa'); return; }
      state.odaId = kayit.oda;
      state.seviye = kayit.seviye || 'kolay';
      state.oyunSorulari = Array.isArray(kayit.sorular) ? kayit.sorular : [];
      if (state.takimAbone) state.takimAbone();
      state.takimAbone = ref.collection('takimlar').orderBy('olusturmaZamani').onSnapshot(s => BIY._takimlariCiz(s));
      $('odaBilgi').classList.remove('gizli');
      $('odaBilgi').innerHTML = "Oda kodu: <b>" + kayit.oda + "</b> · takımlar linkle/karekodla katılır";
      BIY.setSeviye(state.seviye);
      if (snap.data().durum === 'oyun'){ BIY._adminOyunaGec(); }
      else { ekranGoster('ekranTakimlar'); }
    } catch(e){ console.error('Devam hatası:', e); BIY._temizleKayit(); ekranGoster('ekranAnasayfa'); }
  },
  oyunuBitir(){
    BIY._temizleKayit();
    if (state.odaAboneAdmin) state.odaAboneAdmin();
    if (state.cevapAbone) state.cevapAbone();
    if (state.takimAbone) state.takimAbone();
    BIY._sonucTemizle();
    state.odaId = null; state.oyunSorulari = []; state.oda = null; state.otoSonucIndex = -1; state.sonucAnimIndex = -1; state.finalKonfeti = false;
    state.baglSet = null; state.baglIlk = false; state.hepsiSesIndex = -1;
    BIY.anasayfa();
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
    $("odaBilgi").classList.remove("gizli");
    $("odaBilgi").innerHTML = "Oda kodu: <b>" + kod + "</b> · takımlar linkle/karekodla katılır";
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
      const kart = document.createElement("div"); kart.className = "biy-takim-kart";
      kart.innerHTML =
        '<button class="biy-sil" title="Sil" onclick="BIY.takimSil(\''+doc.id+'\')">✕</button>' +
        '<h3>'+ kacis(t.ad) +'</h3>' +
        '<div class="biy-takim-durum '+(t.bagli?"biy-bagli":"biy-bekliyor")+'">'+(t.bagli?"● Bağlandı":"○ Bekleniyor")+'</div>' +
        '<div class="biy-qr" id="'+qrId+'"></div>' +
        '<div class="biy-takim-link"><input readonly value="'+ kacis(link) +'"><button class="biy-kopya" onclick="BIY.kopyala(this)">Kopyala</button></div>';
      grid.appendChild(kart);
      try { const box = $(qrId); if (box && window.QRCode){ box.innerHTML=""; new QRCode(box, { text: link, width: 120, height: 120, correctLevel: QRCode.CorrectLevel.M }); } }
      catch(err){ console.warn("QR:", err); }
    });
    const baslat = $("baslatBtn");
    if (sayi >= 2) baslat.classList.remove("gizli"); else baslat.classList.add("gizli");
    $("baslatNot").textContent = sayi === 0 ? "" : (sayi + " takım · " + bagli + " bağlandı" + (sayi < 2 ? " · başlatmak için en az 2 takım" : ""));
    // yeni bağlanan takım(lar) için ses (açılışta çalmaz)
    const simdiBagli = new Set(state.takimListe.filter(t => t.bagli).map(t => t.id));
    if (state.baglIlk && state.baglSet){
      let yeni = false; simdiBagli.forEach(id => { if (!state.baglSet.has(id)) yeni = true; });
      if (yeni) SES.baglandi();
    }
    state.baglSet = simdiBagli; state.baglIlk = true;
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
  setSeviye(s){
    state.seviye = s;
    document.querySelectorAll(".biy-seviye-btn").forEach(b => b.classList.toggle("secili", b.getAttribute("data-seviye") === s));
  },

  async yarisiBaslat(){
    if (!state.odaId) return;
    const hedefZ = SEVIYE_ZORLUK[state.seviye] || 1;
    let havuz = SORULAR.filter(s => s.zorluk === hedefZ);
    if (!havuz.length){ $("baslatNot").textContent = "Bu seviyede henüz soru yok."; return; }
    for (let i = havuz.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); const g = havuz[i]; havuz[i] = havuz[j]; havuz[j] = g; }
    const secilen = havuz.slice(0, Math.min(TUR_SORU_SAYISI, havuz.length)).map(soruHazirla);
    state.oyunSorulari = secilen;
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
    const idx = o.aktifIndex || 0;
    const soru = state.oyunSorulari[idx];
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
        // sıralama değişimi kontrolü → liderlik büyürken (adım 3) ses
        const ids = state.takimListe.map(x => x.id);
        const newR = BIY._rank(BIY._puanKumul(idx), ids), prevR = BIY._rank(BIY._puanKumul(idx - 1), ids);
        const degisti = ids.some(id => (newR[id] || ids.length) < (prevR[id] || ids.length));
        BIY._sonucOynat();
        if (degisti) state.sonucTimerlar.push(setTimeout(() => SES.siraDegisti(), 4300));
      }
      return;
    }
    // cevaplar (bu index)
    const buCevaplar = {}; Object.values(state.cevaplar).forEach(c => { if (c.index === idx) buCevaplar[c.takimId] = c; });
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

    const cips = state.takimListe.map(tk =>
      '<span class="biy-cip '+(buCevaplar[tk.id]?'ok':'')+'">'+(buCevaplar[tk.id]?'<span class="biy-cip-tik">✓</span> ':'')+kacis(tk.ad)+'</span>'
    ).join("");
    const hepsi = state.takimListe.length > 0 && cevapSayisi >= state.takimListe.length;

    let govde =
      '<div class="biy-oyun-ust">' +
        '<div class="biy-oyun-sira">Soru '+(idx+1)+' / '+(o.toplamSoru||state.oyunSorulari.length)+' '+gozBtn+'</div>' +
        '<div class="biy-oyun-tip"><span class="biy-soru-tip">'+t.emoji+' '+t.ad+'</span> <span class="biy-zorluk z'+soru.zorluk+'">'+ZORLUK_AD[soru.zorluk]+' · '+PUAN[soru.zorluk]+' puan</span></div>' +
        '<div class="biy-sayac"><span id="sayacNum">'+kalan+'</span><small>sn</small></div>' +
      '</div>' +
      '<div class="biy-sayac-bar"><i style="width:'+yuzde+'%"></i></div>';

    if (gizli){
      govde += '<div class="biy-soru-gizli"><span class="biy-sg-emoji">🙈</span><b>Soru gizli</b><small>Takımlar soruyu kendi cihazlarında görüyor</small></div>';
    } else {
      govde += '<div class="biy-oyun-soru">'+ kacis(soru.soru) +'</div>' +
        (soru.arapca ? '<div class="biy-oyun-arapca">'+ kacis(soru.arapca) +'</div>' : '') +
        '<div class="biy-a-optlar">'+ opt +'</div>';
    }
    govde += '<div class="biy-cevap-durum">'+cevapSayisi+' / '+state.takimListe.length+' takım cevapladı'+(hepsi?' — sonuç açılıyor…':'')+'</div>' +
             '<div class="biy-cipler">'+cips+'</div>';

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

  // belirli index'e kadar (dahil) her takımın toplam puanı
  _puanKumul(cutoff){
    const t = {};
    Object.values(state.cevaplar).forEach(c => {
      if (c.index > cutoff) return;
      const s = state.oyunSorulari[c.index]; if (!s) return;
      if (c.secilen === s.dogru) t[c.takimId] = (t[c.takimId] || 0) + (PUAN[s.zorluk] || 10);
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
    const toplam = o.toplamSoru || state.oyunSorulari.length;
    const buCevaplar = {}; Object.values(state.cevaplar).forEach(c => { if (c.index === idx) buCevaplar[c.takimId] = c; });
    // doğru şık (büyük gösterim)
    const di = soru.dogru;
    const dogruRenk = SIK_RENK[di] || "#27AE60";
    const dogruHarf = String.fromCharCode(65 + di);
    const arCls = soru.arSecenek ? " ar" : "";
    // sınıfların sonucu (şık gösterilmez; sadece durum + puan)
    const satir = state.takimListe.map((tk,ri) => {
      const c = buCevaplar[tk.id]; const dogruMu = c && c.secilen === di;
      const kazanc = dogruMu ? ('+' + PUAN[soru.zorluk]) : '0';
      return '<tr class="'+(c?(dogruMu?'dogru':'yanlis'):'yok')+'" style="--r:'+ri+'"><td>'+kacis(tk.ad)+'</td><td>'+(c?(dogruMu?'✅ Doğru':'❌ Yanlış'):'⏳ Cevapsız')+'</td><td>'+kazanc+'</td></tr>';
    }).join("");
    // puan durumu + sıra değişimi (bu sorudan önce vs sonra)
    const ids = state.takimListe.map(t => t.id);
    const newP = BIY._puanKumul(idx), prevP = BIY._puanKumul(idx - 1);
    const newR = BIY._rank(newP, ids), prevR = BIY._rank(prevP, ids);
    const sirali = state.takimListe.slice().sort((a,b) => (newP[b.id]||0) - (newP[a.id]||0));
    const lider = sirali.map((tk,i) => {
      const delta = (prevR[tk.id]||ids.length) - (newR[tk.id]||ids.length); // >0 yükseldi
      const ok = delta > 0 ? '<span class="biy-ok biy-ok-yukari">▲</span>' : (delta < 0 ? '<span class="biy-ok biy-ok-asagi">▼</span>' : '<span class="biy-ok biy-ok-sabit">–</span>');
      const cls = delta > 0 ? 'biy-lider-yukari' : (delta < 0 ? 'biy-lider-asagi' : '');
      return '<li class="'+cls+'" style="--i:'+i+'"><span class="biy-lider-sira">'+(i+1)+'</span>'+ok+'<span class="biy-lider-ad">'+kacis(tk.ad)+'</span><b>'+(newP[tk.id]||0)+'</b></li>';
    }).join("");
    const son = (idx + 1 >= toplam);
    const step = taze ? 0 : 4;   // yeniden render (yenileme) olursa animasyonu atla, son durumu göster
    return '<div class="biy-oyun-orta biy-sonuc-ekran" data-step="'+step+'">' +
      '<div class="biy-sonuc-baslik">📊 Sonuç · Soru '+(idx+1)+' / '+toplam+'</div>' +
      '<div class="biy-dogru-buyuk'+arCls+'" style="--c:'+dogruRenk+'">' +
        '<span class="biy-db-etiket">Doğru Cevap</span>' +
        '<div class="biy-db-sik"><span class="biy-db-harf">'+dogruHarf+'</span><span class="biy-db-metin">'+kacis(soru.secenekler[di])+'</span></div>' +
      '</div>' +
      '<div class="biy-reveal"><table class="biy-reveal-tablo"><thead><tr><th>Takım</th><th>Durum</th><th>Puan</th></tr></thead><tbody>'+satir+'</tbody></table></div>' +
      '<div class="biy-sonuc-lider"><h4>🏆 Puan Durumu</h4><ol class="biy-lider-ol">'+lider+'</ol></div>' +
      '<div class="biy-oyun-kontrol"><button class="biy-btn biy-btn-buyuk" onclick="BIY.sonrakiSoru()">'+(son?'🏁 Yarışmayı Bitir':'Sonraki Soru ›')+'</button></div>' +
    '</div>';
  },
  // sonuç ekranı adım animasyonu sürücüsü
  _sonucOynat(){
    BIY._sonucTemizle();
    const set = (n) => { const e = document.querySelector(".biy-sonuc-ekran"); if (e) e.setAttribute("data-step", String(n)); };
    // 0: doğru şık büyük (giriş animasyonu CSS'te) →
    state.sonucTimerlar.push(setTimeout(() => set(1), 1500));  // 1: sınıfların cevapları görünür
    state.sonucTimerlar.push(setTimeout(() => set(2), 3600));  // 2: doğru şık küçülür
    state.sonucTimerlar.push(setTimeout(() => set(3), 4300));  // 3: liderlik tablosu büyür + sıra atlayanlar
    state.sonucTimerlar.push(setTimeout(() => set(4), 6200));  // 4: buton görünür
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
    const sirali = BIY._siraliTakimlar();
    const madalya = ["🥇","🥈","🥉"];
    return '<div class="biy-oyun-orta biy-final">' +
      '<div class="biy-logo">🏆</div><h1>Yarışma Bitti!</h1>' +
      '<ol class="biy-final-ol">' +
        sirali.map((t,i) => '<li class="'+(i<3?'podyum':'')+(i===0?' birinci':'')+'" style="--i:'+i+'"><span class="biy-final-sira">'+(madalya[i]||(i+1))+'</span><span class="biy-final-ad">'+kacis(t.ad)+'</span><b>'+(t.puan||0)+'</b></li>').join("") +
      '</ol>' +
      '<button class="biy-btn biy-btn-mavi" onclick="BIY.oyunuBitir()" style="margin-top:20px">Ana Menü</button>' +
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
    // her takımın TOPLAM puanını tüm cevaplardan hesapla (idempotent)
    const toplam = {};
    Object.values(state.cevaplar).forEach(c => {
      const soru = state.oyunSorulari[c.index]; if (!soru) return;
      if (c.secilen === soru.dogru) toplam[c.takimId] = (toplam[c.takimId] || 0) + (PUAN[soru.zorluk] || 10);
    });
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
    const next = (state.oda.aktifIndex || 0) + 1;
    try {
      if (next >= (state.oda.toplamSoru || state.oyunSorulari.length)){
        await db.collection(KOLEKSIYON).doc(state.odaId).update({ durum: "bitti" });
      } else {
        await db.collection(KOLEKSIYON).doc(state.odaId).update({
          aktifIndex: next, faz: "cevap",
          aktifSoru: temizSoru(state.oyunSorulari[next]),
          soruBaslangic: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch(e){ console.error(e); }
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
      BIY._takimIcerik('✅', state.takimAd, 'Bağlandın! Yöneticinin yarışmayı başlatması bekleniyor…',
        '<div class="biy-bekle-nokta"><span></span><span></span><span></span></div>');
      sayacDurdur(); return;
    }
    if (o.durum === "bitti"){
      const ben = state.takimListe.find(t => t.id === state.odaTakim.takim);
      BIY._takimIcerik('🏁','Yarışma bitti!', 'Sıralama tahtada (yönetici ekranında).');
      sayacDurdur(); return;
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
        zaman: firebase.firestore.FieldValue.serverTimestamp()
      });
      try { localStorage.setItem('biy_cevap', JSON.stringify({ oda: state.odaTakim.oda, takim: state.odaTakim.takim, index: idx })); } catch(e){}
    } catch(e){ console.error(e); state.sonCevapIndex = -1; }
    BIY._renderTakim();
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
