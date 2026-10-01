/* =====================================================================
   MESLEKLER — SES                                      (meslek/ses.js)
   ---------------------------------------------------------------------
   Sesler HAZIR DOSYA DEĞİL, Web Audio ile anında üretiliyor. Sebebi:
     · indirilecek dosya yok — sayfa çevrimdışı da sesli çalışır,
     · her ses birkaç satır; 16 ayrı mp3 taşımaya gerek kalmıyor,
     · perde/süre kodda ayarlanıyor, yeni ses eklemek kolay.

   TARAYICI KURALI: ses bağlamı, kullanıcı sayfaya dokunmadan
   başlatılamaz. Bu yüzden bağlam ilk dokunuşta/tuşta kuruluyor
   (`uyandir`), öncesinde çağrılan sesler sessizce yutuluyor.

   Sınıf ortamı için SES AÇ/KAPA var ve seçim localStorage'da saklanıyor;
   öğretmen sessiz çalışmak isterse her açılışta tekrar kapatmıyor.

      S.tik()      küçük dokunuş
      S.sec()      seçim (iki notalı)
      S.ucus()     yükselen süpürme — uçan ة
      S.konsun()   iniş/yerleşme tokması
      S.dogru()    açılış/ödül arpeji
      S.carkTik()  çark dişlisi tıkırtısı
      S.carkDur()  çark durunca çan
      S.puan()     takım puanı
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefSes) return;

  var ANAHTAR = 'kidef_meslek_ses';
  var acik = true;
  try { acik = localStorage.getItem(ANAHTAR) !== '0'; } catch (e) {}

  var ctx = null;
  function uyandir() {
    if (!acik) return null;
    try {
      if (!ctx) {
        var C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        ctx = new C();
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (e) { return null; }
  }

  /* Tek nota: dalga biçimi, perde (Hz), süre, ses düzeyi, perde kayması */
  function nota(bicim, hz, sure, duzey, hzSon, gecikme) {
    var c = uyandir(); if (!c) return;
    var t0 = c.currentTime + (gecikme || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = bicim;
    o.frequency.setValueAtTime(hz, t0);
    if (hzSon) o.frequency.exponentialRampToValueAtTime(hzSon, t0 + sure);
    /* Ani başlangıç "tık" sesi çıkarıyor; kısa bir yükseliş konuldu. */
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(duzey, t0 + Math.min(0.012, sure / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + sure);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + sure + 0.02);
  }

  /* Gürültü patlaması — tokmak/şıkırtı için (osilatör yerine tampon) */
  function gurultu(sure, duzey, suzgecHz) {
    var c = uyandir(); if (!c) return;
    var n = Math.floor(c.sampleRate * sure);
    var tampon = c.createBuffer(1, n, c.sampleRate), d = tampon.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var k = c.createBufferSource(); k.buffer = tampon;
    var f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = suzgecHz || 1800;
    var g = c.createGain(); g.gain.value = duzey;
    k.connect(f); f.connect(g); g.connect(c.destination);
    k.start();
  }

  var S = {
    acikMi: function () { return acik; },
    ayarla: function (v) {
      acik = !!v;
      try { localStorage.setItem(ANAHTAR, acik ? '1' : '0'); } catch (e) {}
      if (acik) { uyandir(); S.tik(); }
    },
    uyandir: uyandir,

    tik:     function () { nota('sine', 900, 0.05, 0.07); },
    sec:     function () { nota('triangle', 620, 0.07, 0.09);
                           nota('triangle', 930, 0.09, 0.07, null, 0.06); },
    /* uçan ة: aşağıdan yukarı süpürme */
    ucus:    function () { nota('sine', 300, 0.55, 0.10, 1400); },
    konsun:  function () { gurultu(0.09, 0.16, 900); nota('sine', 190, 0.13, 0.13); },
    /* açılış/ödül: do–mi–sol */
    dogru:   function () { nota('triangle', 523, 0.13, 0.10);
                           nota('triangle', 659, 0.13, 0.10, null, 0.09);
                           nota('triangle', 784, 0.24, 0.11, null, 0.18); },
    carkTik: function () { gurultu(0.035, 0.10, 2600); },
    carkDur: function () { nota('sine', 880, 0.5, 0.13, 660);
                           nota('sine', 1320, 0.45, 0.06, null, 0.02); },
    puan:    function () { nota('square', 700, 0.07, 0.05);
                           nota('square', 1050, 0.12, 0.05, null, 0.07); },
    /* aşağıdan yükselen ögelere eşlik eden yumuşak "geliş" */
    gelis:   function (gecikme) { nota('sine', 420, 0.12, 0.05, 680, gecikme || 0); }
  };

  /* İlk dokunuşta bağlamı hazırla — tarayıcı kuralı gereği. */
  function ilkDokunus() {
    uyandir();
    document.removeEventListener('pointerdown', ilkDokunus);
    document.removeEventListener('keydown', ilkDokunus);
  }
  document.addEventListener('pointerdown', ilkDokunus);
  document.addEventListener('keydown', ilkDokunus);

  window.KidefSes = S;
})();
