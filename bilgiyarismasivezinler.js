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
  sonCevapIndex: -1
};

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
      try { const box = $(qrId); if (box && window.QRCode){ box.innerHTML=""; new QRCode(box, { text: link, width: 132, height: 132, correctLevel: QRCode.CorrectLevel.M }); } }
      catch(err){ console.warn("QR:", err); }
    });
    const baslat = $("baslatBtn");
    if (sayi >= 2) baslat.classList.remove("gizli"); else baslat.classList.add("gizli");
    $("baslatNot").textContent = sayi === 0 ? "" : (sayi + " takım · " + bagli + " bağlandı" + (sayi < 2 ? " · başlatmak için en az 2 takım" : ""));
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
    if (o.durum === "bitti"){ sayacDurdur(); kap.innerHTML = BIY._leaderboardHtml(true); return; }
    const idx = o.aktifIndex || 0;
    const soru = state.oyunSorulari[idx];
    if (!soru){ kap.innerHTML = '<div class="biy-oyun-orta"><p class="biy-alt">Bu turun soruları bellekte yok (sayfa yenilenmiş olabilir). Lütfen yarışmayı yeniden başlatın.</p><button class="biy-btn biy-btn-mavi" onclick="BIY.anasayfa()">Ana Menü</button></div>'; return; }
    const sonuc = (o.faz === "sonuc");
    const t = TIP_BILGI[soru.tip] || { ad: soru.tip, emoji: "❓" };
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
    const gizli = state.soruGizli && !sonuc;   // gizleme yalnız cevap fazında
    const gizleBtn = '<button class="biy-gizle-btn" onclick="BIY.soruGizleToggle()">' + (state.soruGizli ? '👁️ Soruyu Göster' : '🙈 Soruyu Gizle') + '</button>';

    let govde =
      '<div class="biy-oyun-ust">' +
        '<div class="biy-oyun-sira">Soru '+(idx+1)+' / '+(o.toplamSoru||state.oyunSorulari.length)+'</div>' +
        '<div class="biy-oyun-tip"><span class="biy-soru-tip">'+t.emoji+' '+t.ad+'</span> <span class="biy-zorluk z'+soru.zorluk+'">'+ZORLUK_AD[soru.zorluk]+' · '+PUAN[soru.zorluk]+' puan</span></div>' +
        (sonuc ? '' : '<div class="biy-sayac"><span id="sayacNum">'+kalan+'</span><small>sn</small></div>') +
      '</div>' +
      (sonuc ? '' : '<div class="biy-gizle-alan">'+gizleBtn+'</div>') +
      (sonuc ? '' : '<div class="biy-sayac-bar"><i style="width:'+yuzde+'%"></i></div>');

    if (gizli){
      govde += '<div class="biy-soru-gizli"><span class="biy-sg-emoji">🙈</span><b>Soru gizli</b><small>Takımlar soruyu kendi cihazlarında görüyor</small></div>';
    } else {
      govde += '<div class="biy-oyun-soru">'+ kacis(soru.soru) +'</div>' +
        (soru.arapca ? '<div class="biy-oyun-arapca">'+ kacis(soru.arapca) +'</div>' : '') +
        '<div class="biy-a-optlar">'+ opt +'</div>';
    }

    if (!sonuc){
      // cevaplayan takımlar
      let cips = state.takimListe.map(tk =>
        '<span class="biy-cip '+(buCevaplar[tk.id]?'ok':'')+'">'+(buCevaplar[tk.id]?'<span class="biy-cip-tik">✓</span> ':'')+kacis(tk.ad)+'</span>'
      ).join("");
      const hepsi = state.takimListe.length > 0 && cevapSayisi >= state.takimListe.length;
      govde += '<div class="biy-cevap-durum">'+cevapSayisi+' / '+state.takimListe.length+' takım cevapladı'+(hepsi?' — sonuç açılıyor…':'')+'</div>' +
               '<div class="biy-cipler">'+cips+'</div>' +
               '<div class="biy-oyun-kontrol"><button class="biy-btn biy-btn-buyuk" onclick="BIY.sonucGoster()">Sonucu Göster</button></div>';
      // tüm takımlar cevaplayınca otomatik sonuç
      if (hepsi && state.otoSonucIndex !== idx){
        state.otoSonucIndex = idx;
        setTimeout(function(){ if (state.oda && state.oda.faz === 'cevap' && (state.oda.aktifIndex||0) === idx) BIY.sonucGoster(); }, 700);
      }
    } else {
      // reveal tablosu
      let satir = state.takimListe.slice().map(tk => {
        const c = buCevaplar[tk.id];
        const dogruMu = c && c.secilen === soru.dogru;
        const secMetin = c ? (String.fromCharCode(65 + c.secilen) + ') ' + soru.secenekler[c.secilen]) : "—";
        const kazanc = dogruMu ? ('+'+PUAN[soru.zorluk]) : '0';
        return '<tr class="'+(c?(dogruMu?'dogru':'yanlis'):'yok')+'"><td>'+kacis(tk.ad)+'</td><td class="ar-hucre">'+kacis(secMetin)+'</td><td>'+(c?(dogruMu?'✅ Doğru':'❌ Yanlış'):'⏳ Cevapsız')+'</td><td>'+kazanc+'</td></tr>';
      }).join("");
      const son = (idx + 1 >= (o.toplamSoru || state.oyunSorulari.length));
      govde += '<div class="biy-reveal"><table class="biy-reveal-tablo"><thead><tr><th>Takım</th><th>Cevabı</th><th>Durum</th><th>Puan</th></tr></thead><tbody>'+satir+'</tbody></table></div>' +
               '<div class="biy-mini-lider">'+ BIY._miniLiderHtml() +'</div>' +
               '<div class="biy-oyun-kontrol"><button class="biy-btn biy-btn-buyuk" onclick="BIY.sonrakiSoru()">'+(son?'🏁 Yarışmayı Bitir':'Sonraki Soru ›')+'</button></div>';
    }
    kap.innerHTML = '<div class="biy-oyun-orta">'+govde+'</div>';

    // sayaç
    if (!sonuc){
      sayacBaslat(() => {
        const k = kalanSaniye(); const el = $("sayacNum"); if (el) el.textContent = k;
        const bar = document.querySelector(".biy-sayac-bar i"); if (bar) bar.style.width = Math.max(0, Math.min(100, (k/(o.soruSuresi||SORU_SURESI))*100)) + "%";
      });
    } else sayacDurdur();
  },

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
        sirali.map((t,i) => '<li class="'+(i<3?'podyum':'')+'"><span class="biy-final-sira">'+(madalya[i]||(i+1))+'</span><span class="biy-final-ad">'+kacis(t.ad)+'</span><b>'+(t.puan||0)+'</b></li>').join("") +
      '</ol>' +
      '<button class="biy-btn biy-btn-mavi" onclick="BIY.anasayfa()" style="margin-top:20px">Ana Menü</button>' +
    '</div>';
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
        ekranGoster("ekranAnasayfa");
      } else {
        $("girisRolNot").textContent = "Bu hesabın rolü öğrenci. Yarışmayı yalnızca öğretmen/yönetici yönetebilir.";
        ekranGoster("ekranGirisKapisi");
      }
    }).catch(err => { console.error("Rol:", err); ekranGoster("ekranGirisKapisi"); });
  });
})();
