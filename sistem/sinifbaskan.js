/* ===========================================================================
   SINIF BAŞKANI — sistem/sinifbaskan.js                    (14.11.2026, v2 15.11)
   ---------------------------------------------------------------------------
   14.11.2026 öğretmen: "bi sınıf başkanı ve başkan yardımcısı özelliği ekleyelim …
   öğretmen öğrencilerden sadece mail ile sisteme kayıt olmuş ve öğretmenle
   eşleşmiş öğrencilerden seçebilsin".
   15.11.2026 öğretmen: "aşağıdaki yetkileri öğretmen seçerek hem başkana hem başkan
   yardımcısına ayrı ayrı seçerek ve aynı görevlerden ikisine de verebilecek şekilde
   ayarlayalım: oturma planı (dijital bi sınıfta sıra sayısı ve öğrenci sayısı
   belirler, isimleri sürükle bırak yapabilir), hatırlatma dürtüsü, son gün uyarısı,
   kâğıt sınav teslim listesi, kura ve takım kurma, yarışma sunuculuğu, hesabı
   olmayanları takip, şifre ve giriş yardımı".

   VERİ  sinifOda/{ogretmenUid}__{lId}__{cId}   (sınıf başına tek belge)
     öğretmenin tarayıcısı yazar: ogretmenUid, lId, cId, seviyeAd, sinifAd, uyeler [uid],
       uyeAdlar {uid: ad}, liste [{k, ad, h}] (bütün sınıf; k: uid ya da 'a:'+ad, h: hesabı var),
       ogretmenKodu, baskanUid / yardimciUid, baskan / yardimci {uid, ad},
       yetki {baskan: {…}, yardimci: {…}}, bekleyen [{id, ad, t}]
     başkan / yardımcı (yetkisi varsa) yazar: hatirlatmalar, onaylar, durtmeler, oturma, kagit, kura, skor
     her üye yalnız kendi satırını yazar: teslim {uid: {gorevId: t}}
   Kural metni: _kaynak/firestore-ek-sinav-baskan.txt
   =========================================================================== */
(function () {
  'use strict';
  if (window.KidefBaskan) return;
  var SB = window.KidefBaskan = {};
  var C_ODA = 'sinifOda';

  /* yetkiler: [anahtar, ad, açıklama] — sıra ekranda da bu */
  var YETKI = [
    ['hatirlatma', 'Sınıfa hatırlatma', '«Yarın sınav var» gibi kısa notlar; herkesin Sınıfım kartında görünür.'],
    ['songun', 'Son gün uyarısı', 'Son günü yaklaşan görevleri kırmızı görür, tek dokunuşla sınıfa duyurur.'],
    ['durum', 'Ödev durumu', 'Görev ve sınavı kimin bitirdiğini görür; puanları göremez.'],
    ['durtme', 'Hatırlatma dürtüsü', 'Bitirmeyen arkadaşına «görevini bitir» dürtüsü gönderir.'],
    ['istek', 'Katılma isteklerini onaylama', 'Yalnız bu sınıfı seçen arkadaşlarının isteklerini görür; onayladığını site sınıfa ekler.'],
    ['oturma', 'Oturma planı', 'Sıra ve sıradaki kişi sayısını belirler, isimleri sürükleyip yerleştirir.'],
    ['kagit', 'Kâğıt ödev / sınav teslim listesi', 'Kâğıtla verilen ödevde kimin teslim ettiğini işaretler.'],
    ['kura', 'Kura ve takım kurma', 'Rastgele öğrenci seçer, takım kurar; sonuç sınıfa ve sana görünür.'],
    ['yarisma', 'Yarışma sunuculuğu', 'Sınıf içi yarışmada takımların puan tablosunu tutar.'],
    ['hesap', 'Hesabı olmayanları takip', 'Siteye kaydolmamış arkadaşlarını ve öğretmen kodunu görür.'],
    ['giris', 'Şifre ve giriş yardımı', 'Kayıt, giriş ve şifre yenileme adımlarını arkadaşına gösterir.']
  ];
  SB.YETKI = YETKI;

  function fb() { return (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) ? firebase : null; }
  function oturum() { var f = fb(); try { return (f && f.auth) ? f.auth().currentUser : null; } catch (e) { return null; } }
  function veri() { var f = fb(); if (!f) return null; try { if (typeof db !== 'undefined' && db) return db; return f.firestore(); } catch (e) { return null; } }
  function rol() { try { return (typeof appState !== 'undefined' && appState.userRole) ? appState.userRole : ''; } catch (e) { return ''; } }
  function ogretmenMi() { var r = rol(); return r === 'teacher' || r === 'admin'; }
  function veriAl() { return (typeof data !== 'undefined' && data) ? data : null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sil() { try { return firebase.firestore.FieldValue.delete(); } catch (e) { return null; } }
  function saat(t) { if (!t) return ''; var d = new Date(t), i = function (n) { return String(n).padStart(2, '0'); }; return i(d.getDate()) + '.' + i(d.getMonth() + 1) + ' ' + i(d.getHours()) + ':' + i(d.getMinutes()); }
  function gun(t) { if (!t) return ''; var d = new Date(t), i = function (n) { return String(n).padStart(2, '0'); }; return i(d.getDate()) + '.' + i(d.getMonth() + 1); }
  function karistir(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  SB.odaId = function (ogt, lId, cId) { return String(ogt) + '__' + String(lId) + '__' + String(cId); };
  var IK = {
    tac: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>',
    zil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
    liste: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/></svg>',
    kisi: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0M17 8v6M14 11h6"/></svg>',
    onay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    sil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    takvim: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    el: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11.5V4a1.5 1.5 0 0 1 3 0v8M14 11.5V5.5a1.5 1.5 0 0 1 3 0V14"/><path d="M17 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-4.6-2.2L4.5 15a1.5 1.5 0 0 1 2.3-2L8 14.3"/></svg>',
    sira: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="7" height="5" rx="1"/><rect x="14" y="4" width="7" height="5" rx="1"/><rect x="3" y="14" width="7" height="5" rx="1"/><rect x="14" y="14" width="7" height="5" rx="1"/></svg>',
    kagit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13l2 2 4-4"/></svg>',
    zar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1.2" fill="currentColor"/></svg>',
    kupa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M9.5 17h5"/></svg>',
    anahtar: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="14" r="4"/><path d="M11 11l8-8M16 6l2 2M14 8l2 2"/></svg>',
    arti: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    eksi: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
    yazici: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>'
  };
  function stil() {
    if (document.getElementById('sbStil')) return;
    var s = document.createElement('style'); s.id = 'sbStil';
    s.textContent =
      '.sb-k svg,.sb-o svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex:none;}' +
      '.sb-k{color:#6B4A38;font-family:inherit;}' +
      '.sb-k .sb-g{display:grid;grid-template-columns:1fr 1fr;gap:10px;}' +
      '.sb-k label.sb-e,.sb-o label.sb-e{display:block;margin:0 0 5px;font-size:.8rem;font-weight:700;color:#9C3B0C;}' +
      '.sb-k select,.sb-k textarea,.sb-k input[type=text],.sb-o select,.sb-o input[type=text]{width:100%;box-sizing:border-box;padding:10px;border:1px solid #E8A87C;border-radius:10px;font-family:inherit;font-size:.92rem;background:#fff;color:#5A3D2E;}' +
      '.sb-k .sb-kutu{grid-column:1/-1;background:#fff;border:1.5px solid #F3D5BF;border-radius:14px;padding:12px;}' +
      '.sb-yt{width:100%;border-collapse:collapse;font-size:.86rem;}' +
      '.sb-yt th{font-size:.76rem;color:#9C3B0C;text-align:center;padding:4px 6px;white-space:nowrap;}' +
      '.sb-yt th:first-child{text-align:left;}' +
      '.sb-yt td{padding:7px 6px;border-top:1px solid #F6E6DA;vertical-align:top;}' +
      '.sb-yt td.c{text-align:center;width:74px;}' +
      '.sb-yt td small{display:block;color:#A6836E;font-size:.74rem;line-height:1.35;}' +
      '.sb-yt input{width:22px;height:22px;accent-color:#D84315;cursor:pointer;}' +
      '.sb-k .sb-not{font-size:.8rem;color:#8B6A57;background:#FFF1E4;border-radius:10px;padding:8px 11px;line-height:1.5;grid-column:1/-1;}' +
      '.sb-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 15px;border:0;border-radius:11px;cursor:pointer;font:800 .88rem/1 inherit;color:#fff;background:linear-gradient(135deg,#F39C12,#D84315);}' +
      '.sb-btn.y{background:linear-gradient(135deg,#20C997,#16A085);}' +
      '.sb-btn.g{background:#F4ECE6;color:#6B4A38;}' +
      '.sb-btn.k{padding:7px 10px;font-size:.8rem;}' +
      '.sb-hat{display:flex;gap:8px;align-items:flex-start;padding:8px 10px;border-radius:10px;background:#FFF8E6;border:1px solid #F6E0A8;margin-top:6px;font-size:.88rem;line-height:1.45;}' +
      '.sb-hat small{display:block;color:#A6836E;font-size:.74rem;}' +
      '.sb-hat button{margin-left:auto;border:0;background:none;color:#C0392B;cursor:pointer;padding:2px;}' +
      '.sb-durt{display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:12px;background:#FDEDEC;border:1.5px solid #F5B7B1;color:#922B21;font-weight:700;font-size:.88rem;margin-bottom:8px;}' +
      '.sb-o{font-size:.9rem;color:#5A4034;}' +
      '.sb-o .sb-rol{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;}' +
      '.sb-o .sb-r{display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:99px;background:#FFF1E4;font-weight:700;font-size:.84rem;color:#9C3B0C;}' +
      '.sb-o .sb-r.ben{background:#D84315;color:#fff;}' +
      '.sb-bol{margin-top:12px;padding-top:10px;border-top:1px dashed #F0DACA;}' +
      '.sb-bol > h4{display:flex;align-items:center;gap:6px;margin:0 0 8px;font-size:.92rem;color:#9C3B0C;}' +
      'details.sb-bol > summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:6px;font-weight:800;font-size:.92rem;color:#9C3B0C;}' +
      'details.sb-bol > summary::-webkit-details-marker{display:none;}' +
      'details.sb-bol > summary::after{content:"";margin-left:auto;width:8px;height:8px;border-right:2px solid #C49A7E;border-bottom:2px solid #C49A7E;transform:rotate(45deg);transition:transform .2s;}' +
      'details.sb-bol[open] > summary::after{transform:rotate(-135deg);}' +
      'details.sb-bol > .sb-ic{margin-top:8px;}' +
      '.sb-o textarea,.sb-k .sb-ic textarea{width:100%;box-sizing:border-box;min-height:56px;padding:10px;border:1px solid #E8A87C;border-radius:10px;font:inherit;}' +
      '.sb-gv{background:#fff;border:1px solid #F3E2D3;border-radius:10px;padding:8px 10px;margin-top:6px;}' +
      '.sb-gv b{color:#9C3B0C;}' +
      '.sb-gv small{display:block;color:#8B6A57;margin-top:3px;line-height:1.5;}' +
      '.sb-gv.acil{border-color:#F5B7B1;background:#FDEDEC;}' +
      '.sb-cips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}' +
      '.sb-cip{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:99px;background:#FFF1E4;color:#6B4A38;font-size:.82rem;font-weight:700;border:1px solid #F3D5BF;}' +
      '.sb-cip button{border:0;background:#D84315;color:#fff;border-radius:99px;padding:3px 8px;font:800 .72rem/1 inherit;cursor:pointer;}' +
      '.sb-cip.ok{background:#E3F6EE;border-color:#A9DFBF;color:#1E8449;}' +
      '.sb-ist{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #F3E2D3;border-radius:10px;padding:8px 10px;margin-top:6px;}' +
      '.sb-ist span{flex:1;}' +
      '.sb-bilgi{font-size:.8rem;color:#8B6A57;min-height:16px;margin-left:8px;}' +
      /* oturma planı */
      '.sb-op-ayar{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-bottom:10px;font-size:.84rem;font-weight:700;}' +
      '.sb-say{display:inline-flex;align-items:center;gap:4px;}' +
      '.sb-say button{width:30px;height:30px;border-radius:9px;border:1px solid #E8A87C;background:#fff;color:#B34700;cursor:pointer;display:grid;place-items:center;}' +
      '.sb-say b{min-width:22px;text-align:center;}' +
      '.sb-tahta{text-align:center;font-size:.76rem;font-weight:800;letter-spacing:.12em;color:#fff;background:#2E7D5B;border-radius:8px;padding:5px;margin-bottom:10px;}' +
      '.sb-sinif{display:grid;gap:10px 12px;}' +
      '.sb-masa{display:flex;gap:3px;padding:4px;border-radius:10px;background:#C8A27A;box-shadow:inset 0 -3px 0 rgba(0,0,0,.12);}' +
      '.sb-yer{flex:1;min-width:0;min-height:40px;border-radius:7px;background:#FFF8EF;border:1.5px dashed #D9B892;display:flex;align-items:center;justify-content:center;padding:2px;font-size:.74rem;font-weight:700;color:#5A4034;text-align:center;line-height:1.15;word-break:break-word;}' +
      '.sb-yer.dolu{border-style:solid;border-color:#E8A87C;background:#fff;}' +
      '.sb-yer.ben{background:#D84315;color:#fff;border-color:#D84315;}' +
      '.sb-yer.hedef{outline:3px solid #16A085;}' +
      '.sb-duz .sb-yer,.sb-duz .sb-ad{cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;}' +
      '.sb-havuz{display:flex;flex-wrap:wrap;gap:6px;min-height:40px;margin-top:10px;padding:8px;border-radius:10px;background:#F7F1EC;border:1.5px dashed #E1CDBE;}' +
      '.sb-ad{padding:6px 10px;border-radius:99px;background:#fff;border:1px solid #E8A87C;font-size:.8rem;font-weight:700;color:#6B4A38;}' +
      '.sb-ad.sec,.sb-yer.sec{outline:3px solid #F39C12;}' +
      '.sb-hayalet{position:fixed;z-index:10100;pointer-events:none;padding:6px 10px;border-radius:99px;background:#D84315;color:#fff;font-size:.8rem;font-weight:800;box-shadow:0 8px 20px rgba(0,0,0,.25);transform:translate(-50%,-120%);}' +
      /* kura / skor */
      '.sb-kura{margin-top:8px;padding:12px;border-radius:12px;background:#FFF8E6;border:1.5px solid #F6E0A8;text-align:center;}' +
      '.sb-kura .bir{font-size:1.5rem;font-weight:800;color:#B34700;}' +
      '.sb-takimlar{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:8px;text-align:left;}' +
      '.sb-takim{background:#fff;border-radius:10px;border:1px solid #F3D5BF;padding:8px 10px;font-size:.82rem;line-height:1.5;}' +
      '.sb-takim b{display:block;color:#9C3B0C;font-size:.86rem;}' +
      '.sb-skor{display:grid;gap:6px;margin-top:8px;}' +
      '.sb-sk{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #F3D5BF;border-radius:10px;padding:8px 10px;}' +
      '.sb-sk .ad{flex:1;font-weight:800;color:#6B4A38;}' +
      '.sb-sk .p{min-width:44px;text-align:center;font-size:1.2rem;font-weight:800;color:#1E8449;}' +
      '.sb-sk.bir .p{color:#D84315;}' +
      '.sb-sk button{width:34px;height:34px;border-radius:9px;border:1px solid #E8A87C;background:#FFF8F2;color:#B34700;font:800 .8rem/1 inherit;cursor:pointer;}' +
      '.sb-adim{margin:6px 0 0;padding-left:20px;line-height:1.6;font-size:.86rem;}' +
      '.sb-kod{display:inline-block;font:800 1.05rem/1 monospace;letter-spacing:.06em;background:#fff;border:1.5px dashed #D84315;color:#D84315;border-radius:9px;padding:7px 12px;margin:4px 0;}' +
      '@media (max-width:560px){.sb-k .sb-g{grid-template-columns:1fr;}.sb-yt td.c{width:54px;}}';
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------------------------------------------------------- sınıf listesi */
  function sinifAl(lId, cId) { var d = veriAl(); try { return d.levels[lId].classes[cId] || null; } catch (e) { return null; } }
  SB.uyeler = function (lId, cId) {
    var c = sinifAl(lId, cId), u = [], ad = {}, uygun = [], liste = [], gor = {};
    ((c && c.students) || []).forEach(function (s) {
      if (!s) return;
      var a = String(s.name || 'Öğrenci').trim().slice(0, 60) || 'Öğrenci';
      if (s.hesapUid && !gor[s.hesapUid]) {
        gor[s.hesapUid] = 1; u.push(s.hesapUid); ad[s.hesapUid] = a; liste.push({ k: s.hesapUid, ad: a, h: true });
        if (s.hesapEmail) uygun.push({ uid: s.hesapUid, ad: a });   /* başkan olabilir: e-postayla kayıtlı + eşleşmiş */
      } else if (!s.hesapUid) liste.push({ k: 'a:' + a, ad: a, h: false });
    });
    return { uyeler: u, uyeAdlar: ad, uygun: uygun, liste: liste };
  };
  SB.sinifIstekleri = function (lId, cId) {
    return ((window.OH && OH.istekler) || []).filter(function (it) {
      if (!it || it.durum !== 'bekliyor') return false;
      return (it.onerilenLId === lId && it.onerilenCId === cId) || (it.lId === lId && it.cId === cId && it.tur !== 'ogretmen');
    }).map(function (it) { return { id: it._id, ad: String(it.ad || it.email || 'Öğrenci').slice(0, 60), t: it.istekTarih || it.olusturma || 0 }; });
  };
  /* yetki: {baskan:{…}, yardimci:{…}}; eski düz biçim ({hatirlatma, durum, istek}) ikisine birden sayılır */
  function yetkiAl(o, kim) {
    var y = (o && o.yetki) || {};
    if (y.baskan || y.yardimci) return (kim && y[kim]) || {};
    return kim ? y : {};
  }
  SB.yetkiVar = function (o, uid, k) {
    if (!o || !uid) return false;
    var kim = o.baskanUid === uid ? 'baskan' : (o.yardimciUid === uid ? 'yardimci' : '');
    return !!(kim && yetkiAl(o, kim)[k]);
  };
  function adBul(o, k) {
    var l = (o && o.liste) || [], i;
    for (i = 0; i < l.length; i++) if (l[i].k === k) return l[i].ad;
    if (String(k).indexOf('a:') === 0) return String(k).slice(2);
    return (o && o.uyeAdlar && o.uyeAdlar[k]) || '';
  }
  /* yerdeki anahtar artık yoksa (öğrenci sonradan hesap açtı) adından bulunur */
  function anahtarCoz(o, k) {
    var l = (o && o.liste) || [];
    for (var i = 0; i < l.length; i++) if (l[i].k === k) return k;
    if (String(k).indexOf('a:') === 0) for (i = 0; i < l.length; i++) if ('a:' + l[i].ad === k) return l[i].k;
    return k;
  }

  /* ---------------------------------------------------------- ortak yazıcı */
  function odaYaz(o, g) {
    var Db = veri(); if (!Db || !o || !o._id) return Promise.reject(new Error('bağlantı yok'));
    return Db.collection(C_ODA).doc(o._id).update(g).then(function () {
      Object.keys(g).forEach(function (k) { if (k.indexOf('.') < 0) o[k] = g[k]; });
      return true;
    });
  }
  function hata(e) { var m = (e && (e.code || e.message)) || ''; alert('Kaydedilemedi: ' + m + (/permission/i.test(m) ? ' (yetkin yok ya da Firebase kuralı eksik)' : '')); }

  /* ---------------------------------------------------------- ARAÇLAR (öğretmen ve yetkili başkan ortak) */
  /* ctx: {o, duzenle:{…yetki}, ogretmen, yenile()} */
  function hatirlatmaHtml(ctx) {
    var o = ctx.o, sil_ = ctx.ogretmen;
    return (ctx.duzenle.hatirlatma ? '<textarea data-sb-alan="hat" maxlength="200" placeholder="ör. Cuma günü Arapça sınavı var, 3. üniteye çalışın."></textarea>' +
      '<div style="margin-top:6px"><button type="button" class="sb-btn y" data-sb-is="hatGonder">' + IK.zil + 'Gönder</button><span class="sb-bilgi" data-sb-bilgi="hat"></span></div>' : '') +
      (ctx.ogretmen ? (o.hatirlatmalar || []).slice(0, 10) : []).map(function (h, i) {      /* öğrencide liste kartın üstünde zaten var */
        return '<div class="sb-hat">' + IK.zil + '<span>' + esc(h.m) + '<small>' + esc(h.ad || '') + ' · ' + saat(h.t) + '</small></span>' + (sil_ ? '<button type="button" data-sb-is="hatSil" data-i="' + i + '" title="Sil" aria-label="Hatırlatmayı sil">' + IK.sil + '</button>' : '') + '</div>';
      }).join('');
  }
  function hatirlatmaEkle(ctx, m) {
    var u = oturum(), o = ctx.o;
    var ad = ctx.ogretmen ? ((typeof appState !== 'undefined' && appState.currentUserName) || 'Öğretmen') : ((o.uyeAdlar || {})[u.uid] || 'Sınıf başkanı');
    var l = [{ m: String(m).slice(0, 200), ad: String(ad).slice(0, 60), uid: u.uid, t: Date.now() }].concat(o.hatirlatmalar || []).slice(0, 10);
    return odaYaz(o, { hatirlatmalar: l });
  }
  /* sınıfa verilmiş etkin görevler (öğretmende GV.gorevlerim, öğrencide GV.ogrGorevler) */
  function sinifGorevleri(ctx) {
    var o = ctx.o, L = ctx.ogretmen ? ((window.GV && GV.gorevlerim) || []) : ((window.GV && GV.ogrGorevler) || []);
    return L.filter(function (v) {
      if (!v || v.aktif === false || v.hedefTur === 'ogrenci') return false;
      if (v.hedefTur === 'sinif' && (v.lId !== o.lId || v.cId !== o.cId)) return false;
      if (v.hedefTur === 'seviye' && v.lId !== o.lId) return false;
      return true;
    }).slice(0, 8);
  }
  function sonGunHtml(ctx) {
    var simdi = Date.now(), acil = sinifGorevleri(ctx).filter(function (v) { return v.sonTarih && v.sonTarih > simdi && v.sonTarih - simdi < 2 * 864e5; });
    if (!acil.length) return '<p style="margin:0;font-size:.82rem;color:#A6836E">Son günü iki gün içinde dolan görev yok.</p>';
    return acil.map(function (v) {
      return '<div class="sb-gv acil"><b>' + esc(v.baslik || 'Görev') + '</b> · son gün ' + gun(v.sonTarih) +
        (ctx.duzenle.songun ? ' <button type="button" class="sb-btn k" style="margin-left:6px" data-sb-is="sonGunDuyur" data-g="' + esc(v._id) + '">' + IK.zil + 'Sınıfa duyur</button>' : '') + '</div>';
    }).join('');
  }
  function durumHtml(ctx) {
    var o = ctx.o, gor = sinifGorevleri(ctx), ad = o.uyeAdlar || {}, T = o.teslim || {}, D = o.durtmeler || {};
    if (!gor.length) return '<p style="margin:0;font-size:.82rem;color:#A6836E">Sınıfa verilmiş görev yok.</p>';
    return gor.map(function (v) {
      var bitiren = 0, kalan = [];
      (o.uyeler || []).forEach(function (uid) { if (T[uid] && T[uid][v._id]) bitiren++; else kalan.push(uid); });
      return '<div class="sb-gv"><b>' + esc(v.baslik || 'Görev') + '</b> · ' + bitiren + '/' + (o.uyeler || []).length + ' bitirdi' +
        (kalan.length ? '<div class="sb-cips">' + kalan.map(function (uid) {
          var d = D[uid] && D[uid].g === v._id;
          return '<span class="sb-cip">' + esc(ad[uid] || 'Öğrenci') + (ctx.duzenle.durtme && uid !== (oturum() || {}).uid
            ? (d ? ' <small style="color:#1E8449">dürtüldü</small>' : ' <button type="button" data-sb-is="durt" data-u="' + esc(uid) + '" data-g="' + esc(v._id) + '">Dürt</button>') : '') + '</span>';
        }).join('') + '</div>' : '<small>Herkes bitirdi.</small>') + '</div>';
    }).join('') + '<p style="margin:6px 0 0;font-size:.74rem;color:#A6836E">Arkadaşların görevi bitirip siteye girince işaretlenir.</p>';
  }
  function istekHtml(ctx) {
    var o = ctx.o, bek = o.bekleyen || [], on = o.onaylar || {};
    return bek.length ? bek.map(function (b) {
      return '<div class="sb-ist"><span>' + esc(b.ad) + '</span>' + (on[b.id] ? '<small style="color:#16A085;font-weight:700">onaylandı · öğretmen girince eklenir</small>'
        : (ctx.duzenle.istek ? '<button type="button" class="sb-btn y k" data-sb-is="istekOnay" data-b="' + esc(b.id) + '">' + IK.onay + 'Onayla</button>' : '')) + '</div>';
    }).join('') : '<p style="margin:0;font-size:.82rem;color:#A6836E">Bekleyen istek yok.</p>';
  }

  /* --- OTURMA PLANI --- */
  function oturmaVarsayilan(o) { var n = Math.max(1, ((o && o.liste) || []).length); return { sira: Math.min(6, Math.max(3, Math.ceil(n / 6))), sutun: 3, kisi: 2, yer: {} }; }
  function oturmaHtml(ctx) {
    var o = ctx.o, P = ctx._op || (ctx._op = JSON.parse(JSON.stringify(o.oturma || oturmaVarsayilan(o)))), duz = !!ctx.duzenle.oturma;
    P.yer = P.yer || {};
    var ben = (oturum() || {}).uid, yerli = {}, h = '';
    Object.keys(P.yer).forEach(function (s) { P.yer[s] = anahtarCoz(o, P.yer[s]); yerli[P.yer[s]] = s; });
    if (duz) h += '<div class="sb-op-ayar">' +
      '<span class="sb-say">Sıra (arka arkaya) <button type="button" data-sb-is="op" data-a="sira" data-d="-1">' + IK.eksi + '</button><b>' + P.sira + '</b><button type="button" data-sb-is="op" data-a="sira" data-d="1">' + IK.arti + '</button></span>' +
      '<span class="sb-say">Sütun <button type="button" data-sb-is="op" data-a="sutun" data-d="-1">' + IK.eksi + '</button><b>' + P.sutun + '</b><button type="button" data-sb-is="op" data-a="sutun" data-d="1">' + IK.arti + '</button></span>' +
      '<span class="sb-say">Sırada kişi <button type="button" data-sb-is="op" data-a="kisi" data-d="-1">' + IK.eksi + '</button><b>' + P.kisi + '</b><button type="button" data-sb-is="op" data-a="kisi" data-d="1">' + IK.arti + '</button></span></div>';
    h += '<div class="sb-tahta">TAHTA</div><div class="sb-sinif" style="grid-template-columns:repeat(' + P.sutun + ',1fr)">';
    for (var r = 0; r < P.sira; r++) for (var c = 0; c < P.sutun; c++) {
      h += '<div class="sb-masa">';
      for (var k = 0; k < P.kisi; k++) {
        var key = r + '_' + c + '_' + k, ogr = P.yer[key];
        h += '<div class="sb-yer' + (ogr ? ' dolu' : '') + (ogr && ogr === ben ? ' ben' : '') + '" data-yer="' + key + '"' + (ogr ? ' data-k="' + esc(ogr) + '"' : '') + '>' + (ogr ? esc(adBul(o, ogr)) : '') + '</div>';
      }
      h += '</div>';
    }
    h += '</div>';
    if (duz) {
      var bos = ((o.liste) || []).filter(function (x) { return !yerli[x.k]; });
      h += '<div class="sb-havuz" data-havuz="1">' + (bos.length ? bos.map(function (x) { return '<span class="sb-ad" data-k="' + esc(x.k) + '">' + esc(x.ad) + '</span>'; }).join('') : '<small style="color:#A6836E">Herkes yerleşti. Bir ismi buraya sürüklersen sıradan kalkar.</small>') + '</div>' +
        '<p style="margin:6px 0 0;font-size:.76rem;color:#A6836E">İsmi sürükleyip sıraya bırak; ya da isme dokun, sonra yere dokun. Dolu yere bırakırsan iki öğrenci yer değiştirir.</p>' +
        '<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="sb-btn y" data-sb-is="opKaydet">' + IK.onay + 'Planı kaydet</button>' +
        '<button type="button" class="sb-btn g" data-sb-is="opDagit">' + IK.zar + 'Rastgele yerleştir</button><button type="button" class="sb-btn g" data-sb-is="opBosalt">Hepsini kaldır</button><button type="button" class="sb-btn g" data-sb-is="opYazdir">' + IK.yazici + 'Yazdır / sınıfa as</button><span class="sb-bilgi" data-sb-bilgi="op"></span></div>';
    } else if (!o.oturma) h = '<p style="margin:0;font-size:.82rem;color:#A6836E">Oturma planı henüz yapılmadı.</p>';
    else h += '<div style="margin-top:10px"><button type="button" class="sb-btn g" data-sb-is="opYazdir">' + IK.yazici + 'Yazdır / sınıfa as</button></div>';
    return '<div class="' + (duz ? 'sb-duz' : '') + '" data-op="1">' + h + '</div>';
  }
  /* --- OTURMA PLANI ÇIKTISI (15.11.2026) — öğretmen: "oturma planını sınıfa asabilecek güzel bi
     tasarımlı çıktı alabilelim". Yeni pencerede A4 sayfa: başlık (kurum, sınıf, öğretmen, tarih), tahta,
     sıralar ve isimler; başkan altın, yardımcı gümüş taçla. Üstteki şeritten: tahta üstte (öğrenci
     gözünden) ya da altta (öğretmen gözünden), yatay/dikey, renkli/mürekkep dostu. İsimler yere sığacak
     kadar küçülür. Şerit yazdırılmaz. */
  function opKurum(lId) { var d = veriAl(); try { var k = d.levels[lId].kurumId; return (k && d.kurumlar && d.kurumlar[k] && d.kurumlar[k].name) || ''; } catch (e) { return ''; } }
  /* kaydederken başlık bilgisi plana yazılır: öğrenci (başkan) çıktı alınca da kurum ve öğretmen adı görünsün */
  function opEtiket(ctx, P) {
    var o = ctx.o, eski = o.oturma || {};
    P.kurum = (ctx.ogretmen && opKurum(o.lId)) || eski.kurum || P.kurum || '';
    P.ogretmenAd = (ctx.ogretmen && typeof appState !== 'undefined' && appState.currentUserName) || eski.ogretmenAd || P.ogretmenAd || '';
  }
  function opYazdir(ctx) {
    var o = ctx.o, P = JSON.parse(JSON.stringify(ctx._op || o.oturma || oturmaVarsayilan(o)));
    opEtiket(ctx, P);
    var yer = P.yer || {}, sira = P.sira || 1, sutun = P.sutun || 1, kisi = P.kisi || 1, dolu = 0;
    var S = [];
    for (var r = 0; r < sira; r++) { S[r] = []; for (var c = 0; c < sutun; c++) { S[r][c] = []; for (var k = 0; k < kisi; k++) {
      var a = yer[r + '_' + c + '_' + k], kk = a ? anahtarCoz(o, a) : '', ad = kk ? adBul(o, kk) : '';
      if (ad) dolu++;
      S[r][c][k] = { ad: ad, rol: !kk ? '' : (kk === o.baskanUid ? 'b' : (kk === o.yardimciUid ? 'y' : '')) };
    } } }
    var bas = (o.baskan && o.baskan.ad) || adBul(o, o.baskanUid) || '', yrd = (o.yardimci && o.yardimci.ad) || adBul(o, o.yardimciUid) || '';
    var veri = { sira: sira, sutun: sutun, kisi: kisi, S: S, sinif: o.sinifAd || '', seviye: o.seviyeAd || '', kurum: P.kurum || '', ogretmen: P.ogretmenAd || '',
      baskan: o.baskanUid ? bas : '', yardimci: o.yardimciUid ? yrd : '', dolu: dolu, toplam: sira * sutun * kisi,
      tarih: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) };
    var w = window.open('', '_blank');
    if (!w) { alert('Çıktı penceresi açılamadı. Tarayıcının açılır pencere engelini bu site için kaldır.'); return; }
    w.document.open(); w.document.write(opCiktiHtml(veri)); w.document.close();
  }
  function opCiktiHtml(V) {
    var T = '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>';
    var css = [
      '*{box-sizing:border-box}',
      'html,body{margin:0;background:#E9E4DF;font-family:"Segoe UI",Roboto,"Helvetica Neue",Arial,system-ui,sans-serif;color:#2B211B;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      /* şerit */
      '.serit{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;justify-content:center;padding:10px 14px;background:#fff;box-shadow:0 2px 12px rgba(0,0,0,.08)}',
      '.grup{display:inline-flex;background:#F4ECE6;border-radius:11px;padding:3px}',
      '.grup button{border:0;background:transparent;padding:8px 12px;border-radius:9px;font:700 13px/1 inherit;color:#6B4A38;cursor:pointer;display:inline-flex;align-items:center;gap:6px}',
      '.grup button.on{background:#fff;color:#C2410C;box-shadow:0 1px 4px rgba(0,0,0,.12)}',
      '.yaz{border:0;border-radius:11px;padding:11px 18px;font:800 14px/1 inherit;color:#fff;background:linear-gradient(135deg,#F39C12,#D84315);cursor:pointer;display:inline-flex;align-items:center;gap:8px}',
      '.serit svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
      '.kap{padding:22px 12px 40px;display:flex;justify-content:center}',
      /* sayfa */
      '.sayfa{width:297mm;height:210mm;background:#fff;box-shadow:0 10px 40px rgba(60,30,10,.18);padding:9mm 10mm 7mm;display:flex;flex-direction:column;gap:4mm;position:relative;overflow:hidden}',
      'body.dikey .sayfa{width:210mm;height:297mm}',
      '.sayfa:before{content:"";position:absolute;left:0;right:0;top:0;height:3.2mm;background:linear-gradient(90deg,#F39C12,#D84315 55%,#7B1FA2)}',
      '.bas{display:flex;align-items:center;gap:5mm;padding-top:1.5mm}',
      '.rozet{flex:none;width:17mm;height:17mm;border-radius:5mm;background:linear-gradient(135deg,#F39C12,#D84315);display:grid;place-items:center;color:#fff}',
      '.rozet svg{width:10mm;height:10mm;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
      '.bas-yazi{flex:1;min-width:0}',
      '.ust{font-size:3.3mm;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#A0522D;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      'h1{margin:.6mm 0 0;font-size:9mm;line-height:1;font-weight:900;letter-spacing:-.02em;color:#2B211B}',
      '.meta{margin-top:1.6mm;font-size:3.4mm;color:#7A5A48;display:flex;flex-wrap:wrap;gap:1mm 5mm}',
      '.meta b{color:#4A3426}',
      '.sinif-ad{flex:none;min-width:24mm;height:17mm;padding:0 5mm;border-radius:5mm;border:.7mm solid #D84315;color:#D84315;display:grid;place-items:center;font-size:9mm;font-weight:900;letter-spacing:-.02em}',
      '.sinif-ad small{display:block;font-size:2.6mm;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#B9770E;margin-top:-1mm;text-align:center}',
      /* tahta */
      '.on-taraf{display:flex;align-items:stretch;gap:5mm}',
      '.tahta{flex:1;height:11mm;border-radius:2.4mm;background:#2F5D4A;border:1.4mm solid #8B5E3C;display:grid;place-items:center;color:#E8F3EE;font-size:4mm;font-weight:800;letter-spacing:.5em;box-shadow:inset 0 0 0 .4mm rgba(255,255,255,.08)}',
      '.masa-ogr{flex:none;width:36mm;border-radius:2.4mm;background:#F6EADF;border:.4mm dashed #C9A06E;display:flex;align-items:center;justify-content:center;gap:1.6mm;font-size:3mm;font-weight:800;color:#8B5E3C}',
      '.masa-ogr svg{width:4.6mm;height:4.6mm;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
      /* sıralar */
      '.sinif{flex:1;min-height:0;display:grid;gap:3.4mm 6mm;align-content:stretch}',
      '.no{display:grid;place-items:center;font-size:3mm;font-weight:900;color:#B98B6A}',
      '.no span{width:6.4mm;height:6.4mm;border-radius:50%;border:.35mm solid #E3C9AE;display:grid;place-items:center;background:#FFF8EF}',
      '.masa{min-height:0;display:flex;gap:1.6mm;padding:1.6mm;border-radius:3mm;background:linear-gradient(180deg,#EAD2AE,#D9B488);box-shadow:inset 0 -.8mm 0 rgba(120,70,20,.18)}',
      '.yer{position:relative;flex:1;min-width:0;border-radius:2.2mm;background:#fff;border:.35mm solid #E6CFB4;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1mm 1.4mm;text-align:center;overflow:hidden}',
      '.yer.bos{background:rgba(255,255,255,.45);border:.35mm dashed #C9A06E}',
      '.ad{font-weight:800;line-height:1.08;color:#2B211B;max-width:100%;overflow-wrap:normal;word-break:normal}',
      '.ad i{display:block;font-style:normal;font-weight:600;font-size:.8em;color:#6B4A38}',
      '.yer.b{background:#FFF7DB;border:.6mm solid #E0A800}',
      '.yer.y{background:#F1F5F9;border:.6mm solid #94A3B8}',
      '.tac{position:absolute;top:.7mm;right:.9mm;width:4.2mm;height:4.2mm}',
      '.tac path{stroke-width:1.6;stroke-linejoin:round}',
      '.yer.b .tac path{fill:#F5B301;stroke:#B7791F} .yer.y .tac path{fill:#E2E8F0;stroke:#64748B}',
      '.unvan{font-size:2.3mm;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-top:.6mm;color:#B7791F}',
      '.yer.y .unvan{color:#64748B}',
      /* alt */
      '.alt{display:flex;align-items:center;gap:6mm;font-size:3mm;color:#8B6A57;border-top:.3mm solid #F0DACA;padding-top:2.4mm}',
      '.alt .ac{display:inline-flex;align-items:center;gap:1.4mm}',
      '.alt svg{width:4mm;height:4mm}',
      '.alt .imza{margin-left:auto;font-weight:700;color:#C49A7E}',
      /* mürekkep dostu */
      'body.sb .sayfa:before{background:#555}',
      'body.sb .rozet{background:#fff;color:#222;border:.5mm solid #222}',
      'body.sb .sinif-ad{border-color:#222;color:#222} body.sb .sinif-ad small,body.sb .ust{color:#555}',
      'body.sb .tahta{background:#fff;color:#222;border:.6mm solid #222;box-shadow:none}',
      'body.sb .masa{background:#fff;border:.4mm solid #444;box-shadow:none}',
      'body.sb .yer{border-color:#999} body.sb .yer.bos{border-color:#bbb;background:#fff}',
      'body.sb .yer.b,body.sb .yer.y{background:#fff;border:.7mm solid #222}',
      'body.sb .yer.b .tac path,body.sb .yer.y .tac path{fill:#fff;stroke:#222} body.sb .yer.b .tac path{fill:#222}',
      'body.sb .unvan,body.sb .yer.y .unvan{color:#222} body.sb .masa-ogr{background:#fff;border-color:#666;color:#333}',
      'body.sb .no span{background:#fff;border-color:#999;color:#444}',
      'body.sb .ad i{color:#444} body.sb .alt svg{fill:#fff !important;stroke:#222 !important} body.sb .alt .ac:first-child svg{fill:#222 !important}',
      /* yazdırma */
      '@media print{html,body{background:#fff}.serit{display:none}.kap{padding:0;display:block}.sayfa{box-shadow:none;margin:0}}',
      '@media screen and (max-width:1100px){.kap{justify-content:flex-start;overflow:auto}}'
    ].join('\n');
    var SIM = function (ic) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ic + '</svg>'; };
    var serit = '<div class="serit">' +
      '<div class="grup" data-g="yon"><button data-v="ust" class="on">' + SIM('<rect x="3" y="3" width="18" height="5" rx="1.4"/><path d="M6 13h4M14 13h4M6 18h4M14 18h4"/>') + 'Tahta üstte</button>' +
        '<button data-v="alt">' + SIM('<rect x="3" y="16" width="18" height="5" rx="1.4"/><path d="M6 6h4M14 6h4M6 11h4M14 11h4"/>') + 'Tahta altta</button></div>' +
      '<div class="grup" data-g="kagit"><button data-v="yatay">' + SIM('<rect x="2.5" y="6" width="19" height="12" rx="1.6"/>') + 'Yatay</button>' +
        '<button data-v="dikey">' + SIM('<rect x="6" y="2.5" width="12" height="19" rx="1.6"/>') + 'Dikey</button></div>' +
      '<div class="grup" data-g="renk"><button data-v="renkli" class="on">' + SIM('<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M3.5 12h17"/>') + 'Renkli</button>' +
        '<button data-v="sb">' + SIM('<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/>') + 'Mürekkep dostu</button></div>' +
      '<button class="yaz" onclick="window.print()">' + SIM('<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>') + 'Yazdır</button></div>';
    var html = '<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>Oturma Planı' + (V.sinif ? ' · ' + esc(V.sinif) : '') + '</title><style>' + css + '</style><style id="pg"></style></head><body>' + serit +
      '<div class="kap"><div class="sayfa" id="sayfa"></div></div>' +
      '<script>var V=' + JSON.stringify(V).replace(/</g, '\\u003c') + ',T=' + JSON.stringify(T) + ';(' + opCiktiBetik.toString() + ')();<\/script></body></html>';
    return html;
  }
  /* çıktı penceresinde çalışır (kendi başına; dış değişken kullanmaz, V ve T verilir) */
  function opCiktiBetik() {
    var D = { yon: 'ust', kagit: '', renk: 'renkli' };
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    /* yatay mı dikey mi: sıraların enine boyuna oranına göre */
    D.kagit = (V.sutun * (V.kisi * 2.3 + .6)) / (V.sira * 1.6) >= 1.05 ? 'yatay' : 'dikey';
    function adYaz(ad) {
      var p = String(ad).trim().split(/\s+/);
      if (p.length < 2) return esc(ad);
      return esc(p.slice(0, -1).join(' ')) + '<i>' + esc(p[p.length - 1]) + '</i>';
    }
    function ciz() {
      document.body.className = (D.kagit === 'dikey' ? 'dikey ' : '') + (D.renk === 'sb' ? 'sb' : '');
      document.getElementById('pg').textContent = '@page{size:A4 ' + (D.kagit === 'dikey' ? 'portrait' : 'landscape') + ';margin:0}';
      var alt = D.yon === 'alt', h = '';
      var sinifTam = (V.seviye && V.sinif && V.sinif.indexOf(V.seviye) < 0 ? V.seviye + ' · ' : '') + (V.sinif || '');
      h += '<div class="bas"><div class="rozet"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="7" height="5" rx="1"/><rect x="14" y="4" width="7" height="5" rx="1"/><rect x="3" y="14" width="7" height="5" rx="1"/><rect x="14" y="14" width="7" height="5" rx="1"/></svg></div>' +
        '<div class="bas-yazi">' + (V.kurum ? '<div class="ust">' + esc(V.kurum) + '</div>' : '') + '<h1>Oturma Planı</h1><div class="meta">' +
        (sinifTam ? '<span>Sınıf: <b>' + esc(sinifTam) + '</b></span>' : '') +
        (V.ogretmen ? '<span>Öğretmen: <b>' + esc(V.ogretmen) + '</b></span>' : '') +
        (V.baskan ? '<span>Sınıf başkanı: <b>' + esc(V.baskan) + '</b></span>' : '') +
        (V.yardimci ? '<span>Başkan yardımcısı: <b>' + esc(V.yardimci) + '</b></span>' : '') +
        '</div></div>' + (V.sinif ? '<div class="sinif-ad"><div>' + esc(V.sinif) + '<small>sınıf</small></div></div>' : '') + '</div>';
      var on = '<div class="on-taraf">' + (alt ? '<div class="masa-ogr"><svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="4" rx="1"/><path d="M5 13v7M19 13v7"/></svg>Öğretmen masası</div>' : '') +
        '<div class="tahta">TAHTA</div>' + (alt ? '' : '<div class="masa-ogr"><svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="4" rx="1"/><path d="M5 13v7M19 13v7"/></svg>Öğretmen masası</div>') + '</div>';
      var g = '<div class="sinif" style="grid-template-columns:7mm repeat(' + V.sutun + ',1fr);grid-template-rows:repeat(' + V.sira + ',1fr)">';
      for (var i = 0; i < V.sira; i++) {
        var r = alt ? V.sira - 1 - i : i;
        g += '<div class="no"><span>' + (r + 1) + '</span></div>';
        for (var j = 0; j < V.sutun; j++) {
          var c = alt ? V.sutun - 1 - j : j;
          g += '<div class="masa">';
          for (var m = 0; m < V.kisi; m++) {
            var k = alt ? V.kisi - 1 - m : m, Y = V.S[r][c][k];
            if (!Y.ad) { g += '<div class="yer bos"></div>'; continue; }
            g += '<div class="yer' + (Y.rol ? ' ' + Y.rol : '') + '">' + (Y.rol ? '<svg class="tac" viewBox="0 0 24 24">' + T + '</svg>' : '') +
              '<div class="ad">' + adYaz(Y.ad) + '</div>' + (Y.rol ? '<div class="unvan">' + (Y.rol === 'b' ? 'Başkan' : 'Yardımcı') + '</div>' : '') + '</div>';
          }
          g += '</div>';
        }
      }
      g += '</div>';
      var ayak = '<div class="alt">' +
        (V.baskan ? '<span class="ac"><svg viewBox="0 0 24 24" style="fill:#F5B301;stroke:#B7791F;stroke-width:1.6">' + T + '</svg>Sınıf başkanı</span>' : '') +
        (V.yardimci ? '<span class="ac"><svg viewBox="0 0 24 24" style="fill:#E2E8F0;stroke:#64748B;stroke-width:1.6">' + T + '</svg>Başkan yardımcısı</span>' : '') +
        '<span>' + V.dolu + ' öğrenci' + (V.toplam > V.dolu ? ' · ' + (V.toplam - V.dolu) + ' boş yer' : '') + '</span>' +
        '<span>' + esc(V.tarih) + '</span><span class="imza">kidefarapca.com</span></div>';
      document.getElementById('sayfa').innerHTML = h + (alt ? '' : on) + g + (alt ? on : '') + ayak;
      sigdir();
      [].forEach.call(document.querySelectorAll('.grup'), function (gr) {
        [].forEach.call(gr.querySelectorAll('button'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === D[gr.getAttribute('data-g')]); });
      });
    }
    /* her ismi kendi yerine sığacak en büyük boya getir (tek tip görünsün diye hepsinin en küçüğünü kullan) */
    function sigdir() {
      var Y = document.querySelectorAll('.yer:not(.bos)'); if (!Y.length) return;
      var en = 99;
      [].forEach.call(Y, function (y) {
        var a = y.querySelector('.ad'), hi = 34, lo = 6, i = a.querySelector('i');
        a.style.fontSize = ''; if (i) i.style.fontSize = '';
        while (hi - lo > .4) { var m = (hi + lo) / 2; a.style.fontSize = m + 'px'; if (sigiyor(y)) lo = m; else hi = m; }
        y._b = lo; if (lo < en) en = lo;
      });
      /* çok uzun tek bir isim herkesi küçültmesin: en küçük ile orta değer arasında dengele */
      var b = [].map.call(Y, function (y) { return y._b; }).sort(function (x, z) { return x - z; }), orta = b[Math.floor(b.length / 2)];
      var ortak = Math.max(en, orta * .82);
      [].forEach.call(Y, function (y) {
        var a = y.querySelector('.ad'), i = a.querySelector('i'), s = Math.min(y._b, ortak);
        /* uzun soyadı yüzünden ad çok küçülmesin: adı ortak boyda tut, yalnız soyadı küçült */
        if (i && s < ortak * .85) {
          a.style.fontSize = ortak * .85 + 'px';
          for (var e = .8; e >= .42; e -= .04) { i.style.fontSize = e + 'em'; if (sigiyor(y)) break; }
          if (!sigiyor(y)) { i.style.fontSize = ''; a.style.fontSize = s + 'px'; }
        } else a.style.fontSize = s + 'px';
        /* yazıcı yazıyı ekrandan biraz geniş basar: pay bırak */
        a.style.fontSize = parseFloat(a.style.fontSize) * .92 + 'px';
      });
    }
    function sigiyor(y) {
      var a = y.querySelector('.ad'), u = y.querySelector('.unvan');
      var W = y.clientWidth - 10, H = y.clientHeight - 6 - (u ? u.offsetHeight + 4 : 0) - (y.querySelector('.tac') ? 8 : 0);
      return a.scrollWidth <= W && a.offsetHeight <= H && !kelimeTasti(a, W);
    }
    function kelimeTasti(a, W) {
      var r = document.createRange(); r.selectNodeContents(a);
      var k = a.getBoundingClientRect(), L = r.getClientRects();
      for (var i = 0; i < L.length; i++) if (L[i].right > k.left + W + 3) return true;
      return false;
    }
    document.addEventListener('click', function (e) {
      var b = e.target.closest('.grup button'); if (!b) return;
      D[b.parentNode.getAttribute('data-g')] = b.getAttribute('data-v'); ciz();
    });
    window.addEventListener('beforeprint', sigdir);
    ciz();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sigdir);
  }

  function opYerles(ctx, k, hedef) {          /* hedef: yer anahtarı ya da '' (havuza) */
    var P = ctx._op, eski = null;
    Object.keys(P.yer).forEach(function (s) { if (P.yer[s] === k) eski = s; });
    if (hedef) {
      var oradaki = P.yer[hedef];
      if (eski) { if (oradaki) P.yer[eski] = oradaki; else delete P.yer[eski]; }
      P.yer[hedef] = k;
    } else if (eski) delete P.yer[eski];
    ctx.yenile();
  }
  /* sürükle-bırak (fare, parmak, kalem) + dokun-dokun */
  function opBagla(kap, ctx) {
    var surukle = null;
    kap.addEventListener('pointerdown', function (e) {
      var el = e.target.closest('.sb-duz .sb-ad, .sb-duz .sb-yer.dolu'); if (!el) return;
      surukle = { k: el.getAttribute('data-k'), x: e.clientX, y: e.clientY, el: el, hay: null, id: e.pointerId };
    });
    kap.addEventListener('pointermove', function (e) {
      if (!surukle || surukle.id !== e.pointerId) return;
      if (!surukle.hay && Math.abs(e.clientX - surukle.x) + Math.abs(e.clientY - surukle.y) < 8) return;
      e.preventDefault();
      if (!surukle.hay) { surukle.hay = document.createElement('div'); surukle.hay.className = 'sb-hayalet'; surukle.hay.textContent = adBul(ctx.o, surukle.k); document.body.appendChild(surukle.hay); try { surukle.el.setPointerCapture(e.pointerId); } catch (x) { } }
      surukle.hay.style.left = e.clientX + 'px'; surukle.hay.style.top = e.clientY + 'px';
      [].forEach.call(kap.querySelectorAll('.sb-yer.hedef'), function (x) { x.classList.remove('hedef'); });
      var alt = document.elementFromPoint(e.clientX, e.clientY), y = alt && alt.closest && alt.closest('[data-yer]');
      if (y && kap.contains(y)) y.classList.add('hedef');
    });
    var bitir = function (e) {
      if (!surukle || surukle.id !== e.pointerId) return;
      var s = surukle; surukle = null;
      if (!s.hay) return;                         /* sürüklenmedi: tıklama işler */
      s.hay.remove(); s._surukledi = true; kap._sonSurukle = Date.now();
      var alt = document.elementFromPoint(e.clientX, e.clientY), y = alt && alt.closest && alt.closest('[data-yer]'), hv = alt && alt.closest && alt.closest('[data-havuz]');
      if (y && kap.contains(y)) opYerles(ctx, s.k, y.getAttribute('data-yer'));
      else if (hv && kap.contains(hv)) opYerles(ctx, s.k, '');
      else ctx.yenile();
    };
    kap.addEventListener('pointerup', bitir); kap.addEventListener('pointercancel', bitir);
    kap.addEventListener('click', function (e) {
      if (kap._sonSurukle && Date.now() - kap._sonSurukle < 150) return;
      var d = kap.querySelector('.sb-duz'); if (!d) return;
      var ad = e.target.closest('.sb-duz .sb-ad, .sb-duz .sb-yer'); if (!ad) { var hv = e.target.closest('[data-havuz]'); if (hv && ctx._sec) { opYerles(ctx, ctx._sec, ''); ctx._sec = null; } return; }
      var k = ad.getAttribute('data-k'), yer = ad.getAttribute('data-yer');
      if (ctx._sec) { var s = ctx._sec; ctx._sec = null; if (yer) opYerles(ctx, s, yer); else if (k && k !== s) { ctx._sec = k; ctx.yenile(); } else ctx.yenile(); return; }
      if (k) { ctx._sec = k; ad.classList.add('sec'); }
    });
  }

  /* --- KÂĞIT TESLİM LİSTESİ --- */
  function kagitHtml(ctx) {
    var o = ctx.o, L = o.kagit || [], duz = !!ctx.duzenle.kagit, li = o.liste || [];
    var h = duz ? '<div style="display:flex;gap:6px"><input type="text" data-sb-alan="kagitAd" maxlength="60" placeholder="ör. 2. ünite ödevi"><button type="button" class="sb-btn y" data-sb-is="kagitYeni">' + IK.arti + 'Liste aç</button></div>' : '';
    if (!L.length) return h + '<p style="margin:8px 0 0;font-size:.82rem;color:#A6836E">Henüz teslim listesi yok.</p>';
    return h + L.map(function (x, i) {
      var T = x.teslim || {}, n = li.filter(function (s) { return T[s.k]; }).length;
      return '<div class="sb-gv"><b>' + esc(x.ad) + '</b> · ' + n + '/' + li.length + ' teslim etti <small>' + gun(x.t) + (duz ? ' · isme dokununca işaretlenir' : '') + '</small>' +
        '<div class="sb-cips">' + li.map(function (s) {
          return duz ? '<button type="button" class="sb-cip' + (T[s.k] ? ' ok' : '') + '" data-sb-is="kagitIsaret" data-i="' + i + '" data-k="' + esc(s.k) + '">' + (T[s.k] ? IK.onay : '') + esc(s.ad) + '</button>'
            : '<span class="sb-cip' + (T[s.k] ? ' ok' : '') + '">' + esc(s.ad) + '</span>';
        }).join('') + '</div>' + (duz ? '<div style="margin-top:6px"><button type="button" class="sb-btn g k" data-sb-is="kagitSil" data-i="' + i + '">Listeyi sil</button></div>' : '') + '</div>';
    }).join('');
  }
  var kagitZ = null;
  function kagitKaydet(ctx) { clearTimeout(kagitZ); kagitZ = setTimeout(function () { odaYaz(ctx.o, { kagit: ctx.o.kagit || [] }).catch(hata); }, 700); }

  /* --- KURA ve TAKIM --- */
  function kuraHtml(ctx) {
    var o = ctx.o, K = o.kura, duz = !!ctx.duzenle.kura, h = '';
    if (duz) h += '<div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="sb-btn" data-sb-is="kuraBir">' + IK.zar + 'Bir öğrenci seç</button>' +
      [2, 3, 4].map(function (n) { return '<button type="button" class="sb-btn g" data-sb-is="kuraTakim" data-n="' + n + '">' + n + ' takım kur</button>'; }).join('') + '</div>';
    if (K && K.sonuc) {
      h += '<div class="sb-kura"><small style="color:#A6836E">' + esc(K.ad || '') + ' · ' + saat(K.t) + '</small>' +
        (K.tur === 'kisi' ? '<div class="bir">' + esc(K.sonuc[0]) + '</div>'
          : '<div class="sb-takimlar">' + K.sonuc.map(function (t, i) { return '<div class="sb-takim"><b>' + (i + 1) + '. takım</b>' + t.map(esc).join(', ') + '</div>'; }).join('') + '</div>') + '</div>';
    } else if (!duz) h += '<p style="margin:0;font-size:.82rem;color:#A6836E">Henüz kura çekilmedi.</p>';
    return h;
  }
  function kuraCek(ctx, tur, n) {
    var o = ctx.o, adlar = (o.liste || []).map(function (x) { return x.ad; }), u = oturum();
    if (!adlar.length) return;
    var sonuc;
    if (tur === 'kisi') sonuc = [karistir(adlar)[0]];
    else { var k = karistir(adlar); sonuc = []; for (var i = 0; i < n; i++) sonuc.push([]); k.forEach(function (a, j) { sonuc[j % n].push(a); }); }
    var kim = ctx.ogretmen ? 'Öğretmen' : ((o.uyeAdlar || {})[u.uid] || 'Başkan');
    /* takımlar puan tablosuna da hazır (yarışma) — rastgele seçilen kişi tabloyu bozmaz */
    var g = { kura: { tur: tur, sonuc: sonuc, t: Date.now(), ad: kim } };
    return odaYaz(o, g).then(ctx.yenile).catch(hata);
  }

  /* --- YARIŞMA PUAN TABLOSU --- */
  function skorHtml(ctx) {
    var o = ctx.o, S = o.skor, duz = !!ctx.duzenle.yarisma, h = '';
    if (duz) h += '<div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="sb-btn y" data-sb-is="skorKur">' + IK.kupa + (o.kura && o.kura.tur === 'takim' ? 'Son kuradaki takımlarla başlat' : 'Yeni tablo (2 takım)') + '</button>' +
      (S ? '<button type="button" class="sb-btn g" data-sb-is="skorSifir">Puanları sıfırla</button>' : '') + '</div>';
    if (!S || !S.takimlar) return h + (duz ? '' : '<p style="margin:0;font-size:.82rem;color:#A6836E">Yarışma tablosu yok.</p>');
    var en = Math.max.apply(null, S.takimlar.map(function (t) { return t.p || 0; }));
    h += '<div class="sb-skor">' + S.takimlar.map(function (t, i) {
      return '<div class="sb-sk' + ((t.p || 0) === en && en > 0 ? ' bir' : '') + '"><span class="ad">' + esc(t.ad) + (t.uyeler && t.uyeler.length ? '<small style="display:block;font-weight:600;color:#A6836E;font-size:.74rem">' + t.uyeler.map(esc).join(', ') + '</small>' : '') + '</span>' +
        (duz ? '<button type="button" data-sb-is="skor" data-i="' + i + '" data-d="-1">−1</button>' : '') + '<span class="p">' + (t.p || 0) + '</span>' +
        (duz ? '<button type="button" data-sb-is="skor" data-i="' + i + '" data-d="1">+1</button><button type="button" data-sb-is="skor" data-i="' + i + '" data-d="5">+5</button>' : '') + '</div>';
    }).join('') + '</div>';
    return h;
  }
  var skorZ = null;
  function skorKaydet(ctx) { clearTimeout(skorZ); skorZ = setTimeout(function () { ctx.o.skor.t = Date.now(); odaYaz(ctx.o, { skor: ctx.o.skor }).catch(hata); }, 600); }

  /* --- HESABI OLMAYANLAR + GİRİŞ YARDIMI --- */
  var ADIM_KAYIT = ['kidefarapca.com\'a gir, sağ üstten <b>Giriş yap › Kayıt ol</b> de.', 'Öğrenci olarak <b>kendi e-postanla</b> kaydol (okul ya da aile e-postası olabilir).',
    'Profilinde <b>Öğretmene bağlan</b>a dokun, öğretmen kodunu yaz.', 'Sınıfını seç, <b>İstek gönder</b>. Öğretmen (ya da sınıf başkanı) onaylayınca bağlanırsın.'];
  var ADIM_SIFRE = ['Giriş penceresinde e-postanı yaz, <b>Şifremi unuttum</b>a dokun.', 'E-postana gelen bağlantıyı aç, yeni şifreni belirle (istenmeyen klasörüne de bak).',
    'E-postayı yanlış yazdıysan site doğrusunu önerir; <b>@gmail.com</b> gibi hazır tuşları kullanabilirsin.', 'Hâlâ giremiyorsan öğretmenine söyle — şifreni kimseyle paylaşma, başkan da sormaz.'];
  function hesapHtml(ctx) {
    var o = ctx.o, yok = (o.liste || []).filter(function (x) { return !x.h; });
    return (yok.length ? '<div class="sb-cips">' + yok.map(function (x) { return '<span class="sb-cip">' + esc(x.ad) + '</span>'; }).join('') + '</div>' : '<p style="margin:0;font-size:.82rem;color:#1E8449;font-weight:700">Sınıfta herkesin hesabı var.</p>') +
      (o.ogretmenKodu ? '<div style="margin-top:8px;font-size:.84rem">Öğretmen kodu: <span class="sb-kod">' + esc(o.ogretmenKodu) + '</span></div>' : '') +
      '<ol class="sb-adim">' + ADIM_KAYIT.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ol>';
  }
  function girisHtml() {
    return '<b style="font-size:.84rem;color:#9C3B0C">Kayıt ve bağlanma</b><ol class="sb-adim">' + ADIM_KAYIT.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ol>' +
      '<b style="font-size:.84rem;color:#9C3B0C">Şifreyi unutunca</b><ol class="sb-adim">' + ADIM_SIFRE.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ol>';
  }

  /* --- araçların hepsi tek tıklama dinleyicisinden --- */
  function aracTikla(e, ctx) {
    var b = e.target.closest('[data-sb-is]'); if (!b) return;
    var is = b.getAttribute('data-sb-is'), o = ctx.o, kap = ctx.kap, u = oturum();
    var bilgi = function (k, m, h) { var el = kap.querySelector('[data-sb-bilgi="' + k + '"]'); if (el) { el.style.color = h ? '#C0392B' : '#16A085'; el.textContent = m; } };
    if (is === 'hatGonder') {
      var ta = kap.querySelector('[data-sb-alan="hat"]'), m = ta ? String(ta.value || '').trim() : ''; if (!m) return;
      hatirlatmaEkle(ctx, m).then(function () { ctx.yenile(); bilgi('hat', 'Gönderildi.'); }).catch(hata);
    } else if (is === 'hatSil') {
      var l = (o.hatirlatmalar || []).slice(); l.splice(+b.getAttribute('data-i'), 1); odaYaz(o, { hatirlatmalar: l }).then(ctx.yenile).catch(hata);
    } else if (is === 'sonGunDuyur') {
      var v = sinifGorevleri(ctx).filter(function (x) { return x._id === b.getAttribute('data-g'); })[0]; if (!v) return;
      hatirlatmaEkle(ctx, '«' + (v.baslik || 'Görev') + '» görevinin son günü ' + gun(v.sonTarih) + ' — bitirmeyen kalmasın!').then(ctx.yenile).catch(hata);
    } else if (is === 'durt') {
      var g = {}; g['durtmeler.' + b.getAttribute('data-u')] = { g: b.getAttribute('data-g'), b: ((sinifGorevleri(ctx).filter(function (x) { return x._id === b.getAttribute('data-g'); })[0]) || {}).baslik || 'Görev', ad: ctx.ogretmen ? 'Öğretmenin' : ((o.uyeAdlar || {})[u.uid] || 'Sınıf başkanı'), t: Date.now() };
      odaYaz(o, g).then(function () { o.durtmeler = o.durtmeler || {}; o.durtmeler[b.getAttribute('data-u')] = g['durtmeler.' + b.getAttribute('data-u')]; ctx.yenile(); }).catch(hata);
    } else if (is === 'istekOnay') {
      var g2 = {}; g2['onaylar.' + b.getAttribute('data-b')] = { uid: u.uid, ad: (o.uyeAdlar || {})[u.uid] || '', t: Date.now() };
      odaYaz(o, g2).then(function () { o.onaylar = o.onaylar || {}; o.onaylar[b.getAttribute('data-b')] = g2['onaylar.' + b.getAttribute('data-b')]; ctx.yenile(); }).catch(hata);
    } else if (is === 'op') {
      var P = ctx._op, a = b.getAttribute('data-a'), d = +b.getAttribute('data-d'), sinir = { sira: [1, 10], sutun: [1, 6], kisi: [1, 3] }[a];
      P[a] = Math.max(sinir[0], Math.min(sinir[1], (P[a] || 1) + d));
      Object.keys(P.yer).forEach(function (s) { var p = s.split('_'); if (+p[0] >= P.sira || +p[1] >= P.sutun || +p[2] >= P.kisi) delete P.yer[s]; });
      ctx.yenile();
    } else if (is === 'opDagit') {
      var P2 = ctx._op, yerler = []; P2.yer = {};
      for (var r = 0; r < P2.sira; r++) for (var c = 0; c < P2.sutun; c++) for (var k = 0; k < P2.kisi; k++) yerler.push(r + '_' + c + '_' + k);
      karistir((o.liste || []).map(function (x) { return x.k; })).forEach(function (kk, i) { if (yerler[i]) P2.yer[yerler[i]] = kk; });
      ctx.yenile();
    } else if (is === 'opBosalt') { ctx._op.yer = {}; ctx.yenile(); }
    else if (is === 'opKaydet') {
      var P3 = JSON.parse(JSON.stringify(ctx._op)); P3.t = Date.now(); opEtiket(ctx, P3);
      odaYaz(o, { oturma: P3 }).then(function () { bilgi('op', 'Kaydedildi.'); }).catch(hata);
    } else if (is === 'opYazdir') { opYazdir(ctx);
    } else if (is === 'kagitYeni') {
      var inp = kap.querySelector('[data-sb-alan="kagitAd"]'), ad = inp ? String(inp.value || '').trim() : ''; if (!ad) return;
      o.kagit = [{ id: 'k' + Date.now().toString(36), ad: ad.slice(0, 60), t: Date.now(), teslim: {} }].concat(o.kagit || []).slice(0, 6);
      odaYaz(o, { kagit: o.kagit }).then(ctx.yenile).catch(hata);
    } else if (is === 'kagitIsaret') {
      var x = (o.kagit || [])[+b.getAttribute('data-i')]; if (!x) return;
      x.teslim = x.teslim || {}; var kk2 = b.getAttribute('data-k'); if (x.teslim[kk2]) delete x.teslim[kk2]; else x.teslim[kk2] = 1;
      ctx.yenile(); kagitKaydet(ctx);
    } else if (is === 'kagitSil') {
      if (!confirm('Bu teslim listesi silinsin mi?')) return;
      (o.kagit || []).splice(+b.getAttribute('data-i'), 1); odaYaz(o, { kagit: o.kagit || [] }).then(ctx.yenile).catch(hata);
    } else if (is === 'kuraBir') kuraCek(ctx, 'kisi');
    else if (is === 'kuraTakim') kuraCek(ctx, 'takim', +b.getAttribute('data-n'));
    else if (is === 'skorKur') {
      var K = o.kura, T = (K && K.tur === 'takim') ? K.sonuc.map(function (t, i) { return { ad: (i + 1) + '. takım', uyeler: t, p: 0 }; }) : [{ ad: '1. takım', uyeler: [], p: 0 }, { ad: '2. takım', uyeler: [], p: 0 }];
      o.skor = { takimlar: T, t: Date.now() }; odaYaz(o, { skor: o.skor }).then(ctx.yenile).catch(hata);
    } else if (is === 'skorSifir') { (o.skor.takimlar || []).forEach(function (t) { t.p = 0; }); ctx.yenile(); skorKaydet(ctx); }
    else if (is === 'skor') { var t = o.skor.takimlar[+b.getAttribute('data-i')]; t.p = Math.max(0, (t.p || 0) + (+b.getAttribute('data-d'))); ctx.yenile(); skorKaydet(ctx); }
  }
  /* araç bölümleri: [anahtar, başlık, ikon, html işlevi, gösterilsin mi] */
  function bolumler(ctx) {
    var d = ctx.duzenle, o = ctx.o;
    return [
      ['hatirlatma', 'Sınıfa hatırlatma', IK.zil, hatirlatmaHtml, d.hatirlatma],
      ['songun', 'Son gün yaklaşanlar', IK.takvim, sonGunHtml, d.songun],
      ['durum', 'Ödev durumu', IK.liste, durumHtml, d.durum || d.durtme],
      ['istek', 'Sınıfa katılmak isteyenler', IK.kisi, istekHtml, d.istek],
      ['oturma', 'Oturma planı', IK.sira, oturmaHtml, d.oturma || !!o.oturma],
      ['kagit', 'Kâğıt ödev teslim listesi', IK.kagit, kagitHtml, d.kagit],
      ['kura', 'Kura ve takım', IK.zar, kuraHtml, d.kura || !!o.kura],
      ['yarisma', 'Yarışma puan tablosu', IK.kupa, skorHtml, d.yarisma || !!(o.skor && o.skor.takimlar)],
      ['hesap', 'Hesabı olmayanlar', IK.el, hesapHtml, d.hesap],
      ['giris', 'Şifre ve giriş yardımı', IK.anahtar, girisHtml, d.giris]
    ].filter(function (x) { return x[4]; });
  }
  function araclarCiz(kap, ctx, acikVars) {
    ctx.kap = kap;
    ctx.acik = ctx.acik || {};
    var B = bolumler(ctx);
    kap.innerHTML = B.map(function (x) {
      var ac = ctx.acik[x[0]] != null ? ctx.acik[x[0]] : !!acikVars;
      return '<details class="sb-bol" data-bol="' + x[0] + '"' + (ac ? ' open' : '') + '><summary>' + x[2] + esc(x[1]) + '</summary><div class="sb-ic">' + x[3](ctx) + '</div></details>';
    }).join('');
    [].forEach.call(kap.querySelectorAll('details[data-bol]'), function (d) { d.addEventListener('toggle', function () { ctx.acik[d.getAttribute('data-bol')] = d.open; }); });
    if (!kap._bagli) { kap._bagli = true; kap.addEventListener('click', function (e) { aracTikla(e, kap._ctx); }); opBagla(kap, { get o() { return kap._ctx.o; }, get _op() { return kap._ctx._op; }, set _sec(v) { kap._ctx._sec = v; }, get _sec() { return kap._ctx._sec; }, yenile: function () { kap._ctx.yenile(); } }); }
    kap._ctx = ctx;
  }

  /* ---------------------------------------------------------- ÖĞRETMEN: sekme */
  var ODA = {};
  SB.ciz = function (hedefId, on) {
    var g = document.getElementById(hedefId || 'gvGovde'); if (!g) return;
    stil(); SB.ogtDinle();
    var d = veriAl();
    var sira = d && d.levels ? ((d.levelOrder && d.levelOrder.length) ? d.levelOrder : Object.keys(d.levels)) : [];
    var sev = sira.map(function (lId) { var l = d.levels[lId]; return l ? '<option value="' + esc(lId) + '">' + esc(l.name || lId) + '</option>' : ''; }).join('');
    g.innerHTML = '<div class="sb-k"><div class="sb-g">' +
      '<div><label class="sb-e" for="sbSeviye">Seviye</label><select id="sbSeviye">' + sev + '</select></div>' +
      '<div><label class="sb-e" for="sbSinif">Sınıf</label><select id="sbSinif"></select></div>' +
      '<div id="sbIc" style="grid-column:1/-1;display:grid;gap:10px;"></div>' +
      (window.KidefMeydan ? '<label class="sb-kutu" style="display:flex;gap:9px;align-items:flex-start;cursor:pointer;font-size:.88rem"><input type="checkbox" id="sbMeydan" style="width:20px;height:20px;accent-color:#8E44AD;margin:1px 0 0" checked>' +
        '<span><b>Öğrencilerim birbirine meydan okuyabilsin</b><small style="display:block;color:#A6836E;font-size:.76rem">Sana bağlı öğrenciler (bütün sınıfların) bir oyunda birbirine meydan okur; ikisi de oynayınca ilk oyunun puanı karşılaştırılır. Bütün sınıfların için geçerli.</small></span></label>' : '') +
      '</div></div>';
    var ss = g.querySelector('#sbSeviye'), sc = g.querySelector('#sbSinif');
    var my = g.querySelector('#sbMeydan');
    if (my) { KidefMeydan.acikOku().then(function (a) { my.checked = a; }); my.onchange = function () { KidefMeydan.acikYaz(my.checked).catch(function (e) { alert('Kaydedilemedi: ' + ((e && (e.code || e.message)) || '')); }); }; }
    var sinifDoldur = function () {
      var lId = ss.value, cl = (d && d.levels[lId] && d.levels[lId].classes) || {};
      sc.innerHTML = Object.keys(cl).map(function (cId) { return '<option value="' + esc(cId) + '">' + esc(cl[cId].name || cId) + '</option>'; }).join('');
      icCiz(true);
    };
    ss.onchange = sinifDoldur; sc.onchange = function () { icCiz(true); };
    if (on && on.lId && d && d.levels[on.lId]) ss.value = on.lId;
    sinifDoldur();
    if (on && on.cId && sc.querySelector('option[value="' + String(on.cId).replace(/"/g, '') + '"]')) { sc.value = on.cId; icCiz(true); }
  };
  var OGT_CTX = null;
  function icCiz(tam) {
    var ic = document.getElementById('sbIc'); if (!ic) return;
    var lId = (document.getElementById('sbSeviye') || {}).value, cId = (document.getElementById('sbSinif') || {}).value, u = oturum();
    if (!lId || !cId || !u) { ic.innerHTML = '<p class="sb-not">Önce bir sınıf seç.</p>'; return; }
    var id = SB.odaId(u.uid, lId, cId), U = SB.uyeler(lId, cId), oda = ODA[id] || null;
    var yB = yetkiAl(oda, 'baskan'), yY = yetkiAl(oda, 'yardimci');
    if (tam || !document.getElementById('sbBaskan') || ic.getAttribute('data-oda') !== id) {
      ic.setAttribute('data-oda', id);
      var sec = function (sid, deger) {
        return '<select id="' + sid + '"><option value="">— seçilmedi —</option>' + U.uygun.map(function (x) { return '<option value="' + esc(x.uid) + '"' + (oda && x.uid === deger ? ' selected' : '') + '>' + esc(x.ad) + '</option>'; }).join('') + '</select>';
      };
      ic.innerHTML =
        (U.uygun.length ? '' : '<p class="sb-not">Bu sınıfta e-postayla kaydolup sana bağlanmış öğrenci yok. Başkan yalnız bu öğrencilerden seçilebilir (' + U.uyeler.length + ' hesaplı öğrenci var).</p>') +
        '<div class="sb-g">' +
          '<div><label class="sb-e" for="sbBaskan">Sınıf başkanı</label>' + sec('sbBaskan', oda && oda.baskanUid) + '</div>' +
          '<div><label class="sb-e" for="sbYardimci">Başkan yardımcısı</label>' + sec('sbYardimci', oda && oda.yardimciUid) + '</div>' +
          '<div class="sb-not">Listede yalnız e-postayla kaydolmuş ve sana bağlanmış öğrenciler var. Her yetkiyi başkana, yardımcıya ya da ikisine birden verebilirsin.</div></div>' +
        '<div class="sb-kutu"><table class="sb-yt"><thead><tr><th>Yetki</th><th>Başkan</th><th>Yardımcı</th></tr></thead><tbody>' +
          YETKI.map(function (y) {
            return '<tr><td>' + esc(y[1]) + '<small>' + esc(y[2]) + '</small></td>' +
              '<td class="c"><input type="checkbox" data-yb="' + y[0] + '"' + (yB[y[0]] ? ' checked' : '') + ' aria-label="' + esc(y[1]) + ' — başkan"></td>' +
              '<td class="c"><input type="checkbox" data-yy="' + y[0] + '"' + (yY[y[0]] ? ' checked' : '') + ' aria-label="' + esc(y[1]) + ' — yardımcı"></td></tr>';
          }).join('') + '</tbody></table>' +
          '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="sb-btn g k" id="sbHepsiB">Başkana hepsi</button><button type="button" class="sb-btn g k" id="sbHepsiY">Yardımcıya hepsi</button></div></div>' +
        '<div><button type="button" class="sb-btn" id="sbKaydet">' + IK.tac + 'Kaydet</button><span class="sb-bilgi" id="sbBilgi"></span></div>' +
        '<div class="sb-kutu"><label class="sb-e">Sınıf araçları (sen de kullanabilirsin)</label><div id="sbAraclar">' + (oda ? '' : '<p style="margin:0;font-size:.82rem;color:#A6836E">Önce Kaydet’e bas; araçlar sınıf odası açılınca gelir.</p>') + '</div></div>';
      ic.querySelector('#sbKaydet').onclick = function () { kaydet(lId, cId); };
      ic.querySelector('#sbHepsiB').onclick = function () { [].forEach.call(ic.querySelectorAll('[data-yb]'), function (x) { x.checked = true; }); };
      ic.querySelector('#sbHepsiY').onclick = function () { [].forEach.call(ic.querySelectorAll('[data-yy]'), function (x) { x.checked = true; }); };
    }
    if (oda) {
      oda._id = id;
      var kap = document.getElementById('sbAraclar'), hep = {};
      YETKI.forEach(function (y) { hep[y[0]] = true; });
      if (!OGT_CTX || OGT_CTX.id !== id) OGT_CTX = { id: id, acik: {} };
      OGT_CTX.o = oda; OGT_CTX.duzenle = hep; OGT_CTX.ogretmen = true; OGT_CTX._op = OGT_CTX._op && OGT_CTX.id === id && OGT_CTX._opKilit ? OGT_CTX._op : null;
      OGT_CTX.yenile = function () { OGT_CTX._opKilit = true; araclarCiz(kap, OGT_CTX, false); };
      araclarCiz(kap, OGT_CTX, false);
    }
  }
  function kaydet(lId, cId) {
    var u = oturum(), Db = veri(), bilgi = document.getElementById('sbBilgi');
    var yaz = function (m, h) { if (bilgi) { bilgi.style.color = h ? '#C0392B' : '#16A085'; bilgi.textContent = m; } };
    if (!u || !Db || !ogretmenMi()) { yaz('Bağlantı yok.', true); return; }
    var U = SB.uyeler(lId, cId), b = (document.getElementById('sbBaskan') || {}).value || '', y = (document.getElementById('sbYardimci') || {}).value || '';
    if (b && b === y) { yaz('Başkan ve yardımcısı aynı öğrenci olamaz.', true); return; }
    var c = sinifAl(lId, cId) || {}, d = veriAl(), yB = {}, yY = {};
    [].forEach.call(document.querySelectorAll('#sbIc [data-yb]'), function (x) { yB[x.getAttribute('data-yb')] = !!x.checked; });
    [].forEach.call(document.querySelectorAll('#sbIc [data-yy]'), function (x) { yY[x.getAttribute('data-yy')] = !!x.checked; });
    var kayit = {
      ogretmenUid: u.uid, lId: lId, cId: cId, seviyeAd: (d && d.levels[lId] && d.levels[lId].name) || '', sinifAd: c.name || cId,
      uyeler: U.uyeler, uyeAdlar: U.uyeAdlar, liste: U.liste, ogretmenKodu: ogretmenKodu(),
      baskanUid: b, yardimciUid: y,
      baskan: b ? { uid: b, ad: U.uyeAdlar[b] || '' } : null, yardimci: y ? { uid: y, ad: U.uyeAdlar[y] || '' } : null,
      yetki: { baskan: yB, yardimci: yY },
      bekleyen: SB.sinifIstekleri(lId, cId), guncelleme: Date.now()
    };
    yaz('Kaydediliyor…');
    Db.collection(C_ODA).doc(SB.odaId(u.uid, lId, cId)).set(kayit, { merge: true }).then(function () {
      yaz('Kaydedildi.' + (b || y ? ' Öğrenci Sınıfım kartında yetkilerini görür.' : ''));
    }).catch(function (e) { var m = (e && (e.code || e.message)) || ''; yaz('Kaydedilemedi: ' + m + (/permission/i.test(m) ? ' — Firebase kurallarına sinifOda bölümü eklenmemiş olabilir.' : ''), true); });
  }
  function ogretmenKodu() { try { return (window.OH && typeof OH.ogretmenKodu === 'function' && OH.ogretmenKodu()) || ''; } catch (e) { return ''; } }

  /* ---------------------------------------------------------- ÖĞRETMEN: dinleyici ve eşitleme */
  SB.ogtDinle = function () {
    var u = oturum(), Db = veri(); if (!u || !Db || !ogretmenMi()) return;
    if (SB._abone && SB._aboneUid === u.uid) return;
    if (SB._abone) { try { SB._abone(); } catch (e) { } }
    SB._aboneUid = u.uid;
    SB._abone = Db.collection(C_ODA).where('ogretmenUid', '==', u.uid).onSnapshot(function (snap) {
      ODA = {}; snap.forEach(function (doc) { ODA[doc.id] = doc.data() || {}; ODA[doc.id]._id = doc.id; });
      onaylariIsle(); SB.ogtEsitle(); SB.listeSusle();
      var ic = document.getElementById('sbIc');
      if (ic && !(document.activeElement && ic.contains(document.activeElement) && /TEXTAREA|INPUT/.test(document.activeElement.tagName))) icCiz(false);
    }, function (e) { console.warn('sınıf odası dinleyici:', e && (e.code || e.message)); SB._abone = null; });
    if (window.KidefMeydan && KidefMeydan.ogtEsitle) setTimeout(function () { try { KidefMeydan.ogtEsitle(); } catch (e) { } }, 1500);
  };
  var ISLENDI = {};
  function onaylariIsle() {
    if (!window.OH || typeof OH.istekOnayla !== 'function') return;
    var u = oturum(); if (!u || window._llBulutGeldi !== u.uid) return;
    Object.keys(ODA).forEach(function (id) {
      var o = ODA[id], on = o.onaylar || {};
      Object.keys(on).forEach(function (bagId) {
        if (ISLENDI[bagId]) return;
        if (!SB.yetkiVar(o, on[bagId] && on[bagId].uid, 'istek')) return;      /* onaylayanın yetkisi hâlâ var mı */
        var it = (OH.istekler || []).filter(function (x) { return x._id === bagId; })[0];
        var sil_ = {}; sil_['onaylar.' + bagId] = sil();
        if (!it) { ISLENDI[bagId] = 1; veri().collection(C_ODA).doc(id).update(sil_).catch(function () { }); return; }
        var buSinif = (it.onerilenLId === o.lId && it.onerilenCId === o.cId) || (it.lId === o.lId && it.cId === o.cId);
        if (!buSinif) return;
        ISLENDI[bagId] = 1;
        var deg = (it.tur === 'ogretmen' || !it.lId) ? (o.lId + '|||' + o.cId) : '';
        Promise.resolve(OH.istekOnayla(bagId, true, deg)).then(function (ok) {
          if (ok) { veri().collection(C_ODA).doc(id).update(sil_).catch(function () { });
            if (OH.mujde) OH.mujde((it.ad || 'Öğrenci') + ', ' + ((on[bagId] && on[bagId].ad) || 'sınıf başkanı') + ' onayıyla ' + (o.sinifAd || 'sınıfa') + ' eklendi.'); }
          else delete ISLENDI[bagId];
        });
      });
    });
  }
  SB.ogtEsitle = function () {
    var u = oturum(), Db = veri(); if (!u || !Db || !ogretmenMi() || window._llBulutGeldi !== u.uid) return;
    var kod = ogretmenKodu();
    Object.keys(ODA).forEach(function (id) {
      var o = ODA[id]; if (!o || !o.lId || !o.cId || !sinifAl(o.lId, o.cId)) return;
      var U = SB.uyeler(o.lId, o.cId), istekVar = SB.yetkiVar(o, o.baskanUid, 'istek') || SB.yetkiVar(o, o.yardimciUid, 'istek');
      var bek = istekVar ? SB.sinifIstekleri(o.lId, o.cId) : [], g = {};
      if (JSON.stringify(U.uyeler) !== JSON.stringify(o.uyeler || []) || JSON.stringify(U.uyeAdlar) !== JSON.stringify(o.uyeAdlar || {})) { g.uyeler = U.uyeler; g.uyeAdlar = U.uyeAdlar; }
      if (JSON.stringify(U.liste) !== JSON.stringify(o.liste || [])) g.liste = U.liste;
      if (kod && kod !== o.ogretmenKodu) g.ogretmenKodu = kod;
      if (JSON.stringify(bek.map(function (x) { return x.id + x.ad; })) !== JSON.stringify((o.bekleyen || []).map(function (x) { return x.id + x.ad; }))) g.bekleyen = bek;
      if (o.baskanUid && U.uyeler.indexOf(o.baskanUid) < 0) { g.baskanUid = ''; g.baskan = null; }
      if (o.yardimciUid && U.uyeler.indexOf(o.yardimciUid) < 0) { g.yardimciUid = ''; g.yardimci = null; }
      if (Object.keys(g).length) Db.collection(C_ODA).doc(id).update(g).catch(function (e) { console.warn('sınıf odası eşitleme:', e && (e.code || e.message)); });
    });
  };
  setInterval(function () { try { if (ogretmenMi() && Object.keys(ODA).length) { onaylariIsle(); SB.ogtEsitle(); } } catch (e) { } }, 45000);

  /* ---------------------------------------------------------- SINIF LİSTESİNDE TAÇ (15.11.2026)
     Öğretmen: "başkan ve başkan yardımcısını sınıf listesinde belirleyebilelim".
     Öğrenci listesinde (hesap/listelerim.js renderStudents) e-postayla kaydolmuş ve
     öğretmene bağlı her öğrencinin adının yanında taç düğmesi: dokununca «Sınıf başkanı
     yap / Başkan yardımcısı yap / Unvanı kaldır / Yetkileri düzenle». İlk atamada
     sınıf odası açılır; yetkiler önerilen başlangıçla gelir (öğretmen değiştirebilir). */
  var ILK_YETKI = { baskan: { hatirlatma: true, songun: true, durum: true, kura: true }, yardimci: { hatirlatma: true, kura: true } };
  SB.odaAl = function (lId, cId) { var u = oturum(); return u ? (ODA[SB.odaId(u.uid, lId, cId)] || null) : null; };
  function tacStil() {
    if (document.getElementById('sbTacStil')) return;
    var s = document.createElement('style'); s.id = 'sbTacStil';
    s.textContent =
      '.sb-tacb{flex:none;display:inline-flex;align-items:center;gap:4px;height:26px;padding:0 8px;border-radius:999px;border:1.5px dashed #E8A87C;background:#fff;color:#C9A58C;cursor:pointer;font:700 .68rem/1 inherit;white-space:nowrap;}' +
      '.sb-tacb svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;}' +
      '.sb-tacb:hover{border-color:#D84315;color:#D84315;}' +
      '.sb-tacb.baskan{border-style:solid;border-color:#D84315;background:#D84315;color:#fff;}' +
      '.sb-tacb.yardimci{border-style:solid;border-color:#F0B27A;background:#FDEBD0;color:#B9770E;}' +
      '.sb-tacm{position:fixed;z-index:10120;min-width:220px;background:#fff;border-radius:14px;box-shadow:0 14px 40px rgba(16,26,46,.28);padding:6px;font-family:inherit;}' +
      '.sb-tacm b{display:block;padding:8px 10px 6px;font-size:.8rem;color:#9C3B0C;}' +
      '.sb-tacm button{display:flex;align-items:center;gap:8px;width:100%;padding:10px;border:0;border-radius:10px;background:none;text-align:left;font:600 .88rem/1.2 inherit;color:#5A4034;cursor:pointer;}' +
      '.sb-tacm button:hover{background:#FFF1E4;}' +
      '.sb-tacm button.on{color:#D84315;font-weight:800;}' +
      '.sb-tacm svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex:none;}' +
      '.sb-tacm small{display:block;padding:4px 10px 8px;color:#A6836E;font-size:.74rem;line-height:1.4;}';
    (document.head || document.documentElement).appendChild(s);
  }
  function tacMenuKapat() { var m = document.getElementById('sbTacMenu'); if (m) m.remove(); }
  SB.listeSusle = function () {
    if (!ogretmenMi()) return;
    var tb = document.getElementById('stuTableBody'); if (!tb) return;
    var lId = (typeof curLId !== 'undefined') ? curLId : '', cId = (typeof curCId !== 'undefined') ? curCId : '';
    var c = sinifAl(lId, cId); if (!c) return;
    tacStil(); SB.ogtDinle();
    var o = SB.odaAl(lId, cId) || {};
    (c.students || []).forEach(function (st, i) {
      var row = tb.rows[i]; if (!row || !row.cells[2]) return;
      var kap = row.cells[2].querySelector('div') || row.cells[2];
      var eski = kap.querySelector('.sb-tacb'); if (eski) eski.remove();
      if (!st || !st.hesapUid || !st.hesapEmail) return;          /* yalnız e-postayla kayıtlı + bağlı */
      var r = o.baskanUid === st.hesapUid ? 'baskan' : (o.yardimciUid === st.hesapUid ? 'yardimci' : '');
      var b = document.createElement('button'); b.type = 'button'; b.className = 'sb-tacb' + (r ? ' ' + r : '');
      b.title = r === 'baskan' ? 'Sınıf başkanı — değiştirmek için dokun' : (r === 'yardimci' ? 'Başkan yardımcısı — değiştirmek için dokun' : 'Sınıf başkanı ya da yardımcısı yap');
      b.setAttribute('aria-label', b.title);
      b.innerHTML = IK.tac + (r === 'baskan' ? 'Başkan' : (r === 'yardimci' ? 'Yardımcı' : ''));
      b.onclick = function (e) { e.stopPropagation(); tacMenu(b, lId, cId, st); };
      var roz = kap.lastElementChild; kap.insertBefore(b, roz && roz.tagName === 'SPAN' ? roz : null);
    });
  };
  function tacMenu(btn, lId, cId, st) {
    tacMenuKapat();
    var o = SB.odaAl(lId, cId) || {}, uid = st.hesapUid, r = o.baskanUid === uid ? 'baskan' : (o.yardimciUid === uid ? 'yardimci' : '');
    var m = document.createElement('div'); m.id = 'sbTacMenu'; m.className = 'sb-tacm'; m.setAttribute('role', 'menu');
    var digerB = o.baskan && o.baskanUid !== uid ? o.baskan.ad : '', digerY = o.yardimci && o.yardimciUid !== uid ? o.yardimci.ad : '';
    m.innerHTML = '<b>' + esc(st.name || 'Öğrenci') + '</b>' +
      '<button type="button" data-r="baskan" class="' + (r === 'baskan' ? 'on' : '') + '">' + IK.tac + 'Sınıf başkanı yap' + (digerB ? '<span style="margin-left:auto;font-size:.72rem;color:#A6836E">yerine</span>' : '') + '</button>' +
      '<button type="button" data-r="yardimci" class="' + (r === 'yardimci' ? 'on' : '') + '">' + IK.tac + 'Başkan yardımcısı yap' + (digerY ? '<span style="margin-left:auto;font-size:.72rem;color:#A6836E">yerine</span>' : '') + '</button>' +
      (r ? '<button type="button" data-r="">' + IK.sil + 'Unvanı kaldır</button>' : '') +
      '<button type="button" data-r="yetki">' + IK.liste + 'Yetkileri düzenle</button>' +
      ((digerB || digerY) ? '<small>' + (digerB ? 'Başkan: ' + esc(digerB) : '') + (digerB && digerY ? ' · ' : '') + (digerY ? 'Yardımcı: ' + esc(digerY) : '') + '</small>' : '');
    document.body.appendChild(m);
    var rc = btn.getBoundingClientRect(), mw = m.offsetWidth, mh = m.offsetHeight;
    m.style.left = Math.max(8, Math.min(innerWidth - mw - 8, rc.left)) + 'px';
    m.style.top = (rc.bottom + 6 + mh > innerHeight ? Math.max(8, rc.top - mh - 6) : rc.bottom + 6) + 'px';
    m.onclick = function (e) {
      var b = e.target.closest('button[data-r]'); if (!b) return;
      var yeni = b.getAttribute('data-r'); tacMenuKapat();
      if (yeni === 'yetki') { if (window.GV && GV.panelAc) { GV.panelAc(); GV.sekme('baskan'); setTimeout(function () { var ss = document.getElementById('sbSeviye'), sc = document.getElementById('sbSinif'); if (ss && sc) { ss.value = lId; ss.onchange && ss.onchange(); sc.value = cId; sc.onchange && sc.onchange(); } }, 60); } return; }
      SB.unvanVer(lId, cId, uid, yeni).catch(function (er) { alert('Kaydedilemedi: ' + ((er && (er.code || er.message)) || '') + (/permission/i.test(String(er && (er.code || er.message))) ? ' — Firebase kurallarına sinifOda bölümü eklenmemiş olabilir.' : '')); });
    };
    setTimeout(function () {
      var dis = function (e) { if (!m.contains(e.target)) { tacMenuKapat(); document.removeEventListener('pointerdown', dis, true); document.removeEventListener('keydown', esk, true); } };
      var esk = function (e) { if (e.key === 'Escape') { tacMenuKapat(); document.removeEventListener('pointerdown', dis, true); document.removeEventListener('keydown', esk, true); } };
      document.addEventListener('pointerdown', dis, true); document.addEventListener('keydown', esk, true);
    }, 0);
  }
  /* rol: 'baskan' | 'yardimci' | '' (kaldır). Aynı öğrenci öbür unvandaysa oradan düşer. */
  SB.unvanVer = function (lId, cId, uid, rol) {
    var u = oturum(), Db = veri(); if (!u || !Db || !ogretmenMi()) return Promise.reject(new Error('bağlantı yok'));
    var id = SB.odaId(u.uid, lId, cId), o = ODA[id] || null, U = SB.uyeler(lId, cId), c = sinifAl(lId, cId) || {}, d = veriAl();
    var b = o ? (o.baskanUid || '') : '', y = o ? (o.yardimciUid || '') : '';
    if (rol === 'baskan') { if (y === uid) y = ''; b = uid; }
    else if (rol === 'yardimci') { if (b === uid) b = ''; y = uid; }
    else { if (b === uid) b = ''; if (y === uid) y = ''; }
    var g = {
      ogretmenUid: u.uid, lId: lId, cId: cId, seviyeAd: (d && d.levels[lId] && d.levels[lId].name) || '', sinifAd: c.name || cId,
      uyeler: U.uyeler, uyeAdlar: U.uyeAdlar, liste: U.liste,
      baskanUid: b, yardimciUid: y, baskan: b ? { uid: b, ad: U.uyeAdlar[b] || '' } : null, yardimci: y ? { uid: y, ad: U.uyeAdlar[y] || '' } : null,
      guncelleme: Date.now()
    };
    var kod = ogretmenKodu(); if (kod) g.ogretmenKodu = kod;
    if (!o || !o.yetki || !(o.yetki.baskan || o.yetki.yardimci)) g.yetki = JSON.parse(JSON.stringify(ILK_YETKI));
    return Db.collection(C_ODA).doc(id).set(g, { merge: true }).then(function () {
      ODA[id] = Object.assign(o || {}, g); ODA[id]._id = id; SB.listeSusle();
      var ic = document.getElementById('sbIc'); if (ic && ic.getAttribute('data-oda') === id) icCiz(true);
    });
  };
  /* listelerim.js renderStudents her çizimde satırları baştan kurar: ardından taçlar yeniden konur */
  (function sar(n) {
    if (typeof window.renderStudents === 'function') {
      if (window.renderStudents._sb) return;
      var asil = window.renderStudents;
      var yeni = function () { var r = asil.apply(this, arguments); try { SB.listeSusle(); } catch (e) { } return r; };
      yeni._sb = true; window.renderStudents = yeni;
      setTimeout(function () { try { SB.listeSusle(); } catch (e) { } }, 0);
      return;
    }
    if (n < 40) setTimeout(function () { sar(n + 1); }, 500);
  })(0);

  /* ---------------------------------------------------------- ÖĞRENCİ */
  SB._oda = null;
  function ogrOdaId() {
    var b = window.OH && OH.bag; if (!b || b.durum !== 'onayli' || !b.ogretmenUid || !b.lId || !b.cId) return '';
    return SB.odaId(b.ogretmenUid, b.lId, b.cId);
  }
  SB.ogrYukle = function (zorla) {
    var u = oturum(), Db = veri(), id = ogrOdaId(); if (!u || !Db || !id || ogretmenMi()) return;
    if (!zorla && SB._ogrOkuma && SB._ogrOkuma.id === id && Date.now() - SB._ogrOkuma.t < 30000) return;
    SB._ogrOkuma = { id: id, t: Date.now() };
    Db.collection(C_ODA).doc(id).get().then(function (s) {
      SB._oda = s.exists ? (s.data() || null) : null; if (SB._oda) SB._oda._id = id;
      teslimEsitle();
      if (window.GV && GV.profilKartiGuncelle) { try { GV.profilKartiGuncelle(); } catch (e) { } }
    }).catch(function () { SB._oda = null; });
  };
  function teslimEsitle() {
    var u = oturum(), o = SB._oda; if (!u || !o || !o._id || (o.uyeler || []).indexOf(u.uid) < 0) return;
    var mev = (o.teslim && o.teslim[u.uid]) || {}, g = {}, n = 0;
    Object.keys((window.GV && GV.ogrSonuclar) || {}).forEach(function (gid) {
      if (mev[gid]) return; var r = GV.ogrSonuclar[gid]; g['teslim.' + u.uid + '.' + gid] = (r && (r.bitis || r.sonTarih)) || Date.now(); n++;
    });
    if (n) veri().collection(C_ODA).doc(o._id).update(g).then(function () {
      o.teslim = o.teslim || {}; o.teslim[u.uid] = o.teslim[u.uid] || {}; Object.keys(g).forEach(function (k) { o.teslim[u.uid][k.split('.')[2]] = g[k]; });
    }).catch(function () { });
  }
  function benimRolum() { var u = oturum(), o = SB._oda; if (!u || !o) return ''; return o.baskanUid === u.uid ? 'baskan' : (o.yardimciUid === u.uid ? 'yardimci' : ''); }
  var OGR_CTX = { acik: {} };
  /* Profil kartındaki «Sınıfım» akordiyonu (gorev.js profilKartiGuncelle çağırır) */
  SB.ogrHtml = function (akordiyon) {
    var o = SB._oda; if (!o || typeof akordiyon !== 'function') return '';
    stil();
    var u = oturum(), rolum = benimRolum(), y = rolum ? yetkiAl(o, rolum) : {};
    /* dürtme: bana gelen ve görevi hâlâ bitirmediğim */
    var D = (o.durtmeler || {})[u.uid], durt = '';
    if (D && !(window.GV && GV.ogrSonuclar && GV.ogrSonuclar[D.g]) && Date.now() - D.t < 7 * 864e5)
      durt = '<div class="sb-durt">' + IK.el + '<span>' + esc(D.ad || 'Sınıf başkanın') + ' hatırlatıyor: «' + esc(D.b || 'görev') + '» görevini henüz bitirmedin.</span></div>';
    var rol = '<div class="sb-rol">' +
      (o.baskan ? '<span class="sb-r' + (rolum === 'baskan' ? ' ben' : '') + '">' + IK.tac + 'Başkan: ' + esc(o.baskan.ad) + '</span>' : '') +
      (o.yardimci ? '<span class="sb-r' + (rolum === 'yardimci' ? ' ben' : '') + '">' + IK.tac + 'Yardımcı: ' + esc(o.yardimci.ad) + '</span>' : '') + '</div>';
    var hat = (o.hatirlatmalar || []).slice(0, 5).map(function (h) { return '<div class="sb-hat">' + IK.zil + '<span>' + esc(h.m) + '<small>' + esc(h.ad || '') + ' · ' + saat(h.t) + '</small></span></div>'; }).join('');
    var ic = '<div class="sb-o">' + durt + rol + (hat || '<p style="margin:0;font-size:.84rem;color:#A6836E">Henüz hatırlatma yok.</p>') +
      (rolum ? '<div class="sb-bol"><h4>' + IK.tac + (rolum === 'baskan' ? 'Sınıf başkanısın' : 'Başkan yardımcısısın') + '</h4>' +
        (YETKI.some(function (x) { return y[x[0]]; }) ? '' : '<p style="margin:0;font-size:.82rem;color:#8B6A57">Öğretmenin sana henüz yetki vermedi.</p>') + '</div>' : '') +
      '<div id="sbOgrAraclar"></div></div>';
    var baslik = '<span>Sınıfım' + (o.sinifAd ? ' · ' + esc(o.sinifAd) : '') + '</span>' + (rolum ? '<span style="font-size:.72rem;font-weight:700;padding:2px 9px;border-radius:999px;background:#FDEBD0;color:#B9770E;">' + (rolum === 'baskan' ? 'başkan' : 'yardımcı') + '</span>' : '') +
      (durt ? '<span style="width:10px;height:10px;border-radius:50%;background:#E74C3C;display:inline-block"></span>' : '');
    var h = akordiyon('prfSinifim', '#C0392B', baslik, ic, !!(rolum || durt || (o.hatirlatmalar && o.hatirlatmalar[0] && Date.now() - o.hatirlatmalar[0].t < 3 * 864e5)));
    /* araçlar kart çizildikten sonra (dinleyicilerle) yerleşir */
    setTimeout(function () {
      var kap = document.getElementById('sbOgrAraclar'); if (!kap) return;
      if (OGR_CTX.id !== o._id) OGR_CTX = { id: o._id, acik: {} };
      OGR_CTX.o = o; OGR_CTX.duzenle = y; OGR_CTX.ogretmen = false;
      if (!OGR_CTX._opKilit) OGR_CTX._op = null;
      OGR_CTX.yenile = function () { OGR_CTX._opKilit = true; araclarCiz(kap, OGR_CTX, false); };
      araclarCiz(kap, OGR_CTX, false);
    }, 0);
    return h;
  };
  /* eski adlar (14.11 sürümü) */
  SB.ogrHatirlat = function () { };
  SB.ogrOnayla = function () { };
})();
