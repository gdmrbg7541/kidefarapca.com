/* ===========================================================================
   SINAV ÇÖZ — sistem/sinavcoz.js (sinavcoz.html)                    (14.11.2026)
   Öğrenci, öğretmeninin gönderdiği sınavı çözer. Akış:
     giriş → görev (gorevler/{id}) → daha önce teslim ettiyse SONUÇ, etmediyse
     başlangıç ekranı → sorular (tek sayfa) → «Sınavı bitir» → gorevSonuc yazılır.
   Cevaplar bitene kadar bu tarayıcıda saklanır (sayfa yenilense de kaybolmaz);
   süre varsa başlangıçtan sayılır, bitince sınav kendiliğinden teslim edilir.
   Puan öğretmenin tarayıcısında hesaplanır (sinavNot); bu sayfa onu okur.
   =========================================================================== */
(function () {
  'use strict';
  var AYAR = {
    apiKey: 'AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w',
    authDomain: 'kidefarapca-98f9c.firebaseapp.com',
    projectId: 'kidefarapca-98f9c',
    storageBucket: 'kidefarapca-98f9c.firebasestorage.app',
    messagingSenderId: '503317118211',
    appId: '1:503317118211:web:a9c8cf15b854597e0b3d36'
  };
  var HARF = ['A', 'B', 'C', 'D', 'E'];     /* ortaokulda A–D, lisede A–E (18.11.2026; eskiden A B C Ç D) */
  var IK = {
    ev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>',
    kl: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6 10h1M9.5 10h1M13 10h1M16.5 10h1M7 14h10"/></svg>',
    saat: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>',
    onay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    carpi: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    kalem: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
    bas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
  };
  function $(s) { return document.querySelector(s); }
  function kac(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function arMi(s) { return /[؀-ۿ]/.test(String(s || '')) && !/[a-zçğıöşü]{3}/i.test(String(s || '')); }
  function param(ad) { var m = new RegExp('[?&]' + ad + '=([^&#]*)').exec(location.search); try { return m ? decodeURIComponent(m[1]) : ''; } catch (e) { return ''; } }
  function trTarih(ts) { if (!ts) return ''; var d = new Date(ts), i = function (n) { return String(n).padStart(2, '0'); }; return i(d.getDate()) + '.' + i(d.getMonth() + 1) + '.' + d.getFullYear(); }
  var G = $('#scGovde');
  function durum(baslik, metin, ek) {
    $('#scAlt').hidden = true;
    G.innerHTML = '<div class="sc-kart sc-durum"><h1>' + kac(baslik) + '</h1><p>' + kac(metin) + '</p>' + (ek || '') +
      '<a class="sc-btn ikinci" href="index.html">' + IK.ev + 'Ana sayfa</a></div>';
  }

  var GID = param('gorev').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 60);
  var S = { u: null, D: null, v: null, cev: [], bas: 0, saatZ: null, bitti: false };
  function depoAnahtar() { return 'kidefSinavCoz|' + GID + '|' + (S.u ? S.u.uid : ''); }
  function depoOku() { try { return JSON.parse(localStorage.getItem(depoAnahtar()) || 'null'); } catch (e) { return null; } }
  function depoYaz() { try { localStorage.setItem(depoAnahtar(), JSON.stringify({ c: S.cev, b: S.bas })); } catch (e) { } }

  if (!GID) { durum('Sınav bulunamadı', 'Bu sayfa Görevlerim\'deki «Sınava başla» tuşuyla açılır.'); return; }
  try { if (!firebase.apps.length) firebase.initializeApp(AYAR); } catch (e) { durum('Bağlantı kurulamadı', 'Sayfayı yenileyip tekrar dene.'); return; }
  S.D = firebase.firestore();
  var cevap = false;
  setTimeout(function () { if (!cevap) durum('Giriş bekleniyor', 'Hesap bilgisi alınamadı. Ana sayfada giriş yapıp Görevlerim\'den yeniden aç.'); }, 10000);
  firebase.auth().onAuthStateChanged(function (u) {
    if (cevap) return; cevap = true;
    if (!u || u.isAnonymous) { durum('Önce giriş yap', 'Sınav öğrenci hesabınla açılır. Ana sayfada giriş yaptıktan sonra Görevlerim\'den sınavı aç.'); return; }
    S.u = u; yukle();
  });

  function yukle() {
    S.D.collection('gorevler').doc(GID).get().then(function (s) {
      if (!s.exists) { durum('Sınav bulunamadı', 'Öğretmenin bu sınavı kaldırmış olabilir.'); return; }
      var v = s.data() || {}; v._id = s.id; S.v = v;
      if (v.tur !== 'sinav' || !v.sinav || !Array.isArray(v.sinav.sorular)) { durum('Bu bir sınav değil', 'Görevlerim\'e dönüp yeniden dene.'); return; }
      if (Array.isArray(v.uids) && v.uids.length && v.uids.indexOf(S.u.uid) < 0) { durum('Bu sınav sana gönderilmemiş', 'Sınav başka bir sınıfa ya da öğrenciye gönderilmiş.'); return; }
      $('#scBaslik').textContent = v.baslik || v.sinav.ad || 'Sınav';
      document.title = (v.baslik || 'Sınav') + ' — Kidef Arapça';
      return S.D.collection('gorevSonuc').doc(GID + '_' + S.u.uid).get().then(function (r) {
        if (r.exists) { sonucGoster(r.data() || {}); return; }
        if (v.aktif === false) { durum('Sınav kapatıldı', 'Öğretmenin bu sınavı kapatmış.'); return; }
        var d = depoOku();
        if (d && Array.isArray(d.c) && d.b) { S.cev = d.c; S.bas = d.b; sorular(); }
        else baslangic();
      });
    }).catch(function (e) { durum('Sınav açılamadı', 'Bağlantı hatası: ' + ((e && (e.code || e.message)) || '') + '. Sayfayı yenileyip tekrar dene.'); });
  }
  function basHtml() {
    var s = S.v.sinav, v = S.v;
    return '<div class="sc-kart sc-bas"><h1>' + kac(v.baslik || s.ad) + '</h1>' +
      (s.kurum ? '<div class="sc-satir"><b>' + kac(s.kurum) + '</b></div>' : '') +
      '<div class="sc-satir"><span>Sınıf: <b>' + kac([s.seviyeAd, s.sinifAd].filter(Boolean).join(' / ') || '—') + '</b></span>' +
      (s.ogretmenAd ? '<span>Öğretmen: <b>' + kac(s.ogretmenAd) + '</b></span>' : '') + '</div>' +
      '<div class="sc-satir"><span>' + s.sorular.length + ' soru · 100 puan</span>' + (s.sureDk ? '<span>Süre: <b>' + s.sureDk + ' dakika</b></span>' : '') +
      (v.sonTarih ? '<span>Son gün: <b>' + trTarih(v.sonTarih) + '</b></span>' : '') + '</div>';
  }
  function baslangic() {
    var s = S.v.sinav, doldu = S.v.sonTarih && Date.now() > S.v.sonTarih;
    G.innerHTML = basHtml() +
      '<div class="sc-yon">Soruların hepsi tek sayfada. İşaretlediğin cevaplar bu cihazda saklanır; sayfa kapanırsa kaldığın yerden sürer.' +
      (s.sureDk ? ' <b>Süre başlayınca durmaz</b>; bitince sınav kendiliğinden teslim edilir.' : '') +
      ' Arapça cevap yazacağın sorularda klavye düğmesine dokunabilirsin. Bitince «Sınavı bitir»e bas — teslimden sonra cevap değişmez.' +
      (doldu ? '<br><b style="color:#C0392B">Son gün geçti; yine de teslim edersen «geç» yazılır.</b>' : '') + '</div>' +
      '<div style="margin-top:16px;text-align:center"><button type="button" class="sc-btn" id="scBasla">' + IK.bas + 'Sınava başla</button></div></div>';
    $('#scBasla').onclick = function () { S.bas = Date.now(); S.cev = s.sorular.map(function () { return null; }); depoYaz(); sorular(); };
  }

  function sorular() {
    var s = S.v.sinav;
    if (window.KidefKlavyeAlt) KidefKlavyeAlt.kur();
    $('#scUst').hidden = false; $('#scAlt').hidden = false;
    G.innerHTML = basHtml() + '</div>' + s.sorular.map(function (q, i) {
      var h = '<div class="sc-kart sc-soru" id="scQ' + i + '"><div class="sc-sb"><span class="sc-no">' + (i + 1) + '</span><div class="sc-st" dir="' + (arMi(q.soru) ? 'rtl' : 'ltr') + '">' + kac(q.soru) + '</div><span class="sc-puan">' + q.puan + ' p</span></div>' +
        (q.ar ? '<div class="sc-ar" lang="ar">' + kac(q.ar) + '</div>' : '');
      if (q.t === 'test') h += '<div class="sc-siklar">' + (q.sik || []).map(function (sk, j) {
        return '<button type="button" class="sc-sik' + (S.cev[i] === j ? ' on' : '') + '" data-q="' + i + '" data-c="' + j + '"><span class="h">' + HARF[j] + '</span><span class="m"' + (arMi(sk) ? ' dir="rtl" lang="ar"' : ' dir="auto"') + '>' + kac(sk) + '</span></button>';
      }).join('') + '</div>';
      else if (q.t === 'dy') h += '<div class="sc-dy"><button type="button" class="sc-sik' + (S.cev[i] === true ? ' on' : '') + '" data-q="' + i + '" data-dy="1">Doğru</button><button type="button" class="sc-sik' + (S.cev[i] === false ? ' on' : '') + '" data-q="' + i + '" data-dy="0">Yanlış</button></div>';
      else h += '<div class="sc-acik"><textarea id="scC' + i + '" data-q="' + i + '" data-ka-kl data-ka-ad="' + (i + 1) + '. sorunun cevabı" dir="auto" placeholder="Cevabını yaz">' + kac(S.cev[i] || '') + '</textarea>' +
        '<button type="button" class="sc-kl" data-ka-kl-ac="scC' + i + '" title="Arapça klavyeyle yaz" aria-label="Arapça klavyeyle yaz">' + IK.kl + '</button></div>';
      return h + '</div>';
    }).join('');
    G.onclick = function (e) {
      var b = e.target.closest('.sc-sik'); if (!b || S.bitti) return;
      var i = +b.getAttribute('data-q');
      if (b.hasAttribute('data-dy')) S.cev[i] = b.getAttribute('data-dy') === '1'; else S.cev[i] = +b.getAttribute('data-c');
      [].forEach.call(b.parentNode.children, function (x) { x.classList.toggle('on', x === b); });
      depoYaz(); say();
    };
    G.oninput = function (e) { var t = e.target; if (t.tagName === 'TEXTAREA' && t.hasAttribute('data-q')) { S.cev[+t.getAttribute('data-q')] = t.value; depoYaz(); say(); } };
    $('#scTeslim').onclick = function () { teslim(false); };
    say(); saatKur();
  }
  function bos(c) { return c == null || c === '' || (typeof c === 'string' && !c.trim()); }
  function say() {
    var n = S.v.sinav.sorular.length, d = S.cev.filter(function (c) { return !bos(c); }).length;
    $('#scSay').textContent = d + ' / ' + n + ' cevaplandı';
    $('#scIlerle').style.width = (n ? d / n * 100 : 0) + '%';
  }
  function saatKur() {
    var dk = +S.v.sinav.sureDk || 0, el = $('#scSaat');
    if (!dk) { el.hidden = true; return; }
    el.hidden = false; clearInterval(S.saatZ);
    var tik = function () {
      var kalan = Math.round((S.bas + dk * 60000 - Date.now()) / 1000);
      if (kalan <= 0) { clearInterval(S.saatZ); el.innerHTML = IK.saat + '0:00'; if (!S.bitti) teslim(true); return; }
      el.innerHTML = IK.saat + Math.floor(kalan / 60) + ':' + String(kalan % 60).padStart(2, '0');
      el.classList.toggle('az', kalan <= 60);
    };
    tik(); S.saatZ = setInterval(tik, 1000);
  }
  function teslim(sureBitti) {
    if (S.bitti) return;
    var boslar = [];
    S.cev.forEach(function (c, i) { if (bos(c)) boslar.push(i + 1); });
    if (!sureBitti && boslar.length && !confirm(boslar.length + ' soruyu boş bıraktın (' + boslar.slice(0, 8).join(', ') + (boslar.length > 8 ? '…' : '') + '). Yine de bitirilsin mi?')) {
      var ilk = document.getElementById('scQ' + (boslar[0] - 1)); if (ilk) ilk.scrollIntoView({ block: 'center', behavior: 'smooth' }); return;
    }
    if (!sureBitti && !boslar.length && !confirm('Sınavı bitiriyorsun. Teslimden sonra cevapların değişmez.')) return;
    S.bitti = true; clearInterval(S.saatZ);
    if (window.KidefKlavyeAlt) KidefKlavyeAlt.kapat();
    var btn = $('#scTeslim'); btn.disabled = true; btn.textContent = 'Gönderiliyor…';
    var simdi = Date.now(), v = S.v;
    var kayit = {
      gorevId: GID, ogrenciUid: S.u.uid, ogretmenUid: v.ogretmenUid, oyun: 'sinavcoz.html', tur: 'sinav',
      cevaplar: S.cev.map(function (c) { return c === undefined ? null : (typeof c === 'string' ? c.slice(0, 2000) : c); }),
      baslangic: S.bas || simdi, bitis: simdi, sureSn: Math.round((simdi - (S.bas || simdi)) / 1000), deneme: 1,
      gec: !!(v.sonTarih && simdi > v.sonTarih), sureBitti: !!sureBitti
    };
    S.D.collection('gorevSonuc').doc(GID + '_' + S.u.uid).set(kayit).then(function () {
      try { localStorage.removeItem(depoAnahtar()); } catch (e) { }
      teslimIsaretle();
      sonucGoster(kayit, true);
    }).catch(function (e) {
      S.bitti = false; btn.disabled = false; btn.textContent = 'Sınavı bitir';
      alert('Teslim edilemedi: ' + ((e && (e.code || e.message)) || 'bağlantı hatası') + '. Cevapların bu cihazda duruyor; bağlantı gelince yeniden bas.');
    });
  }
  /* SINIF BAŞKANI (14.11.2026): sınıfın ödev durumu — yalnız «teslim etti» bilgisi (puan değil) sınıf odasına */
  function teslimIsaretle() {
    var v = S.v; if (!v.ogretmenUid) return;
    var bagId = S.u.uid + '__' + v.ogretmenUid;
    S.D.collection('ogrenciBaglari').doc(bagId).get().then(function (b) {
      var x = b.exists ? (b.data() || {}) : {}, lId = x.lId || v.lId, cId = x.cId || v.cId;
      if (!lId || !cId) return;
      var g = {}; g['teslim.' + S.u.uid + '.' + GID] = Date.now();
      return S.D.collection('sinifOda').doc(v.ogretmenUid + '__' + lId + '__' + cId).update(g);
    }).catch(function () { /* sınıf odası yoksa ya da üye değilse sessiz */ });
  }

  function sonucGoster(r, yeni) {
    $('#scAlt').hidden = true; $('#scSaat').hidden = true; $('#scUst').hidden = false; $('#scIlerle').style.width = '100%';
    var v = S.v, s = v.sinav;
    G.innerHTML = '<div class="sc-kart sc-durum" id="scSonuc"><h1>' + (yeni ? 'Sınavın teslim edildi' : 'Bu sınavı teslim ettin') + '</h1><p>Puanın hesaplanıyor…</p></div>';
    S.D.collection('sinavNot').doc(GID + '_' + S.u.uid).get().then(function (n) {
      var x = n.exists ? (n.data() || {}) : null, k = $('#scSonuc');
      if (!x) {
        k.innerHTML = '<h1>' + (yeni ? 'Sınavın teslim edildi' : 'Bu sınavı teslim ettin') + '</h1><p>' + trTarih(r.bitis) + ' · ' +
          (S.cev.length ? '' : '') + 'Puanın, öğretmenin sonuçları açınca hesaplanır ve Görevlerim\'de görünür.</p><a class="sc-btn" href="index.html">' + IK.ev + 'Ana sayfa</a>';
        return;
      }
      k.innerHTML = '<div class="sc-buyuk">' + x.puan + ' <small>/ 100</small></div><h1>' + kac(v.baslik || s.ad) + '</h1>' +
        '<p>' + (x.bekleyen ? 'Açık uçlu ' + x.bekleyen + ' cevabın öğretmenin puanlayınca eklenecek.' : 'Tebrikler, sınavın puanlandı.') + '</p>' +
        '<a class="sc-btn" href="index.html">' + IK.ev + 'Ana sayfa</a>';
      /* soru soru: doğru / yanlış (cevap anahtarı gösterilmez — yalnız senin cevabın) */
      var c = r.cevaplar || [], d = x.d || [];
      G.insertAdjacentHTML('beforeend', s.sorular.map(function (q, i) {
        var cy = c[i], yaz;
        if (q.t === 'test') yaz = (cy == null || cy === '') ? 'boş' : HARF[cy] + ') ' + (q.sik[cy] || '');
        else if (q.t === 'dy') yaz = cy === true ? 'Doğru' : cy === false ? 'Yanlış' : 'boş';
        else yaz = (cy && String(cy).trim()) ? cy : 'boş';
        var is = d[i] === 1 ? '<span class="sc-isaret d">' + IK.onay + 'doğru</span>' : d[i] === 0 ? '<span class="sc-isaret y">' + IK.carpi + 'yanlış</span>'
          : d[i] === 0.5 ? '<span class="sc-isaret b">kısmen</span>' : '<span class="sc-isaret b">' + IK.kalem + 'öğretmen puanlayacak</span>';
        return '<div class="sc-kart sc-soru"><div class="sc-sb"><span class="sc-no">' + (i + 1) + '</span><div class="sc-st" dir="' + (arMi(q.soru) ? 'rtl' : 'ltr') + '">' + kac(q.soru) + '</div><span class="sc-puan">' + q.puan + ' p</span></div>' +
          (q.ar ? '<div class="sc-ar" lang="ar">' + kac(q.ar) + '</div>' : '') + '<div class="sc-cev">Cevabın: <b dir="auto">' + kac(yaz) + '</b></div>' + is + '</div>';
      }).join(''));
    }).catch(function () { var k = $('#scSonuc'); if (k) k.innerHTML = '<h1>Sınavın teslim edildi</h1><p>Puanın Görevlerim\'de görünecek.</p><a class="sc-btn" href="index.html">' + IK.ev + 'Ana sayfa</a>'; });
  }
})();
