/* ===========================================================================
   GÜNÜN SÖZÜ — Merak Çarkı sayfasının üstünde açılan pop-up     03.10.2026
   ---------------------------------------------------------------------------
   Öğretmen: "merak çarkı içine ayrıca günün sözü ekleyelim bu çark dışında
   yukarda bi popup şeklinde görülsün."

   ÇARKIN DIŞINDA: çarkın dilimlerine dokunulmadı; söz, sayfa açılınca
   üstte beliren ayrı bir kartta çıkar. Çark kartlarıyla (merakveri.js)
   hiçbir ilişkisi yok.

   GÜNE GÖRE SEÇİM: söz, takvim gününden hesaplanır — aynı gün bütün
   cihazlarda AYNI söz çıkar, ertesi gün kendiliğinden değişir. Rastgele
   değil; öğretmen "bugünün sözü şu" diyebilsin diye.

   GÜNDE BİR KEZ: pop-up o gün ilk açılışta kendiliğinden gelir
   (localStorage['kidef_gunsozu'] = YYYY-MM-DD). Kapatınca o gün bir daha
   kendiliğinden gelmez; üst çubuktaki «Günün sözü» düğmesiyle her zaman
   yeniden açılır.

   İÇERİK: Türk atasözleri. Her sözün altında sınıfa bağlayan tek cümle
   var. Yeni söz eklemek için SOZLER dizisinin sonuna bir satır ekle;
   sıra önemli değil, seçim güne göre yapılıyor.
   =========================================================================== */
(function () {
  'use strict';

  var ANAHTAR = 'kidef_gunsozu';

  /* s = söz (Türk atasözü) · n = sınıfa bağlayan kısa not */
  var SOZLER = [
    { s: 'Bilmemek ayıp değil, öğrenmemek ayıp.', n: 'Soru sormak öğrenmenin ilk adımıdır.' },
    { s: 'Sora sora Bağdat bulunur.', n: 'Takıldığın yeri sormaktan çekinme.' },
    { s: 'Damlaya damlaya göl olur.', n: 'Her gün beş kelime, bir yılda yüzlerce kelime eder.' },
    { s: 'Ağaç yaşken eğilir.', n: 'Doğru alışkanlık en kolay bugün kazanılır.' },
    { s: 'Sabreden derviş muradına ermiş.', n: 'Zor görünen konu, üstüne gidince kolaylaşır.' },
    { s: 'Akıl akıldan üstündür.', n: 'Arkadaşının çözümünü dinlemek seninkini güçlendirir.' },
    { s: 'Emek olmadan yemek olmaz.', n: 'Çalışmadan gelen başarı kalıcı olmuyor.' },
    { s: 'İşleyen demir ışıldar.', n: 'Tekrar edilmeyen bilgi paslanır.' },
    { s: 'Azimle sıçan duvarı deler.', n: 'Küçük ama düzenli çaba, büyük engeli aşar.' },
    { s: 'Acele işe şeytan karışır.', n: 'Soruyu sonuna kadar oku, sonra cevapla.' },
    { s: 'Demir tavında dövülür.', n: 'Bugün öğrendiğini bugün tekrar et.' },
    { s: 'Ne ekersen onu biçersin.', n: 'Bugünün çalışması yarının sonucudur.' },
    { s: 'Sabrın sonu selamettir.', n: 'Anlamadığın yerde vazgeçme, bir kez daha dene.' },
    { s: 'Kervan yolda düzülür.', n: 'Her şey hazır olsun diye beklemeden başla.' },
    { s: 'Hatasız kul olmaz.', n: 'Yanlış yapmak öğrenmenin bir parçasıdır.' },
    { s: 'Bir elin nesi var, iki elin sesi var.', n: 'Eşli çalışma işi kolaylaştırır.' },
    { s: 'Dost acı söyler.', n: 'Hatanı söyleyen arkadaşının kıymetini bil.' },
    { s: 'Tatlı dil yılanı deliğinden çıkarır.', n: 'Sınıfta da, dışarıda da geçerli.' },
    { s: 'El elden üstündür.', n: 'Kendini başkasıyla değil, dünkü hâlinle karşılaştır.' },
    { s: 'Gülü seven dikenine katlanır.', n: 'Sevdiğin işin zor kısmına da katlanırsın.' },
    { s: 'Taşıma su ile değirmen dönmez.', n: 'Başkasının defteriyle sınav kazanılmaz.' },
    { s: 'Üzüm üzüme baka baka kararır.', n: 'Çalışkan arkadaş çalışkanlık bulaştırır.' },
    { s: 'Mum dibine ışık vermez.', n: 'En iyi bildiğini sandığın konuyu da bir kez tekrar et.' },
    { s: 'Zorla güzellik olmaz.', n: 'İlgini çeken yerden başla, gerisi gelir.' },
    { s: 'Alet işler, el övünür.', n: 'Araç ne kadar iyi olsa da işi yapan sensin.' },
    { s: 'Sanat altın bileziktir.', n: 'Öğrendiğin her beceri ömür boyu yanında.' },
    { s: 'Çok okuyan mı bilir, çok gezen mi?', n: 'Bilgi hem kitaptan hem hayattan gelir.' },
    { s: 'Keskin sirke küpüne zarar.', n: 'Öfkeyle ders çalışılmaz; önce sakinleş.' },
    { s: 'Son pişmanlık fayda etmez.', n: 'Sınav haftasını bekleme, bugün başla.' },
    { s: 'Bir musibet bin nasihatten yeğdir.', n: 'Yaptığın hatadan çıkardığın ders kalıcıdır.' },
    { s: 'İyi dost kara günde belli olur.', n: 'Zorlandığın derste sana yardım edeni unutma.' },
    { s: 'Vakit nakittir.', n: 'Teneffüs arası beş dakika bile tekrara yeter.' },
    { s: 'Yuvarlanan taş yosun tutmaz.', n: 'Hareket eden zihin tazeliğini korur.' },
    { s: 'Harman yel ile, düğün el ile.', n: 'Büyük iş yardımlaşmayla biter.' },
    { s: 'Zaman sana uymazsa sen zamana uy.', n: 'Plan bozulunca küsme, yeni plana geç.' },
    { s: 'Su akarken testiyi doldurmalı.', n: 'Fırsat varken çalış; her hafta aynı değil.' }
  ];

  function bugun() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) +
           '-' + ('0' + d.getDate()).slice(-2);
  }

  /* Gün sırası: yılbaşından bugüne geçen gün sayısı. Yerel saate göre,
     saat dilimi kaymasın diye gün başına sabitlenerek. */
  function gunSira() {
    var d = new Date();
    var bas = new Date(d.getFullYear(), 0, 1);
    var g = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - bas) / 86400000);
    return ((g % SOZLER.length) + SOZLER.length) % SOZLER.length;
  }

  function oku() { try { return localStorage.getItem(ANAHTAR) || ''; } catch (e) { return ''; } }
  function yaz(v) { try { localStorage.setItem(ANAHTAR, v); } catch (e) {} }

  var katman = null, acik = false;

  function kur() {
    var soz = SOZLER[gunSira()];

    katman = document.createElement('div');
    katman.className = 'gs-katman';
    katman.id = 'gsKatman';
    katman.setAttribute('role', 'dialog');
    katman.setAttribute('aria-modal', 'false');
    katman.setAttribute('aria-label', 'Günün sözü');
    katman.hidden = true;
    katman.innerHTML =
      '<div class="gs-kart" role="document">' +
        '<button type="button" class="gs-kapat" aria-label="Kapat">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '<span class="gs-etiket">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M8.6 6.4c-2.4.9-3.9 3-3.9 5.6 0 2 1.3 3.4 3 3.4 1.6 0 2.8-1.1 2.8-2.6 0-1.4-1-2.5-2.4-2.5-.3 0-.6 0-.8.1.3-1.2 1.2-2.2 2.5-2.8z"/>' +
            '<path d="M17.2 6.4c-2.4.9-3.9 3-3.9 5.6 0 2 1.3 3.4 3 3.4 1.6 0 2.8-1.1 2.8-2.6 0-1.4-1-2.5-2.4-2.5-.3 0-.6 0-.8.1.3-1.2 1.2-2.2 2.5-2.8z"/>' +
          '</svg>Günün Sözü</span>' +
        '<p class="gs-soz"></p>' +
        '<p class="gs-not"></p>' +
        '<div class="gs-alt"><span class="gs-kaynak">Türk atasözü</span>' +
          '<button type="button" class="gs-tamam">Anladım</button></div>' +
      '</div>';
    document.body.appendChild(katman);
    katman.querySelector('.gs-soz').textContent = soz.s;
    katman.querySelector('.gs-not').textContent = soz.n;

    katman.querySelector('.gs-kapat').addEventListener('click', kapat);
    katman.querySelector('.gs-tamam').addEventListener('click', kapat);
    katman.addEventListener('click', function (e) { if (e.target === katman) kapat(); });
    document.addEventListener('keydown', function (e) {
      if (acik && e.key === 'Escape') { e.preventDefault(); kapat(); }
    });

    /* üst çubuğa yeniden açma düğmesi */
    var ust = document.querySelector('.mc-ust');
    if (ust) {
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'gs-tus';
      t.title = 'Günün sözünü göster';
      t.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M8.6 6.4c-2.4.9-3.9 3-3.9 5.6 0 2 1.3 3.4 3 3.4 1.6 0 2.8-1.1 2.8-2.6 0-1.4-1-2.5-2.4-2.5-.3 0-.6 0-.8.1.3-1.2 1.2-2.2 2.5-2.8z"/>' +
        '<path d="M17.2 6.4c-2.4.9-3.9 3-3.9 5.6 0 2 1.3 3.4 3 3.4 1.6 0 2.8-1.1 2.8-2.6 0-1.4-1-2.5-2.4-2.5-.3 0-.6 0-.8.1.3-1.2 1.2-2.2 2.5-2.8z"/>' +
        '</svg><span>Günün sözü</span>';
      t.addEventListener('click', ac);
      ust.appendChild(t);
    }
  }

  function ac() {
    if (!katman) kur();
    katman.hidden = false;
    acik = true;
    requestAnimationFrame(function () { katman.classList.add('gor'); });
  }

  function kapat() {
    if (!acik) return;
    acik = false;
    katman.classList.remove('gor');
    yaz(bugun());                     /* bugün bir daha kendiliğinden açılmasın */
    setTimeout(function () { if (!acik) katman.hidden = true; }, 240);
  }

  function basla() {
    kur();
    if (oku() !== bugun()) setTimeout(ac, 650);   /* sayfa otursun, sonra belirsin */
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', basla);
  } else {
    basla();
  }

  window.KidefGunSozu = { ac: ac, kapat: kapat, bugunku: function () { return SOZLER[gunSira()]; } };
})();
