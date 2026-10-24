/* =====================================================================
   KIDEF · OKUMA HIZLANDIRMA                  (okumayazma/okuma_hiz.js)
   ---------------------------------------------------------------------
   Öğretmen (24.10.2026): "okumayı güçlendirmek için bi çalışma yapalım,
   tts sesler hazırlayalım bunlar için bi ses oynatma vs için detaylı bi
   arayüz yapalım, amaç hızına göre öğrenciyi değerlendirmek, alfabe.html
   de okuma kısmına bi şekilde entegre edelim, her sınıftan cümleler seçip
   bunların ses dosyasını ekleyeceğim bilgisayara" · "okuma hızlandırma
   adında bi kart olarak sınıf materyallerine de ekle".
   Seçimler: üç ölçme kipi birlikte · cümleleri kitaplardan seç · sonuç
   girişsizde cihazda, öğretmen girişliyse öğrenci adına.

   NEREDE
     okumahiz.html?sinif=N        sınıf materyallerindeki «Okuma Hızlandırma» kartı
     okumahiz.html?gomulu=1       alfabe.html «Okuma» sekmesindeki «Hızlandırma» çipi
     (&ses=1 ses listesini açar, &oku=5-03 o okumayı açar)

   VERİ
     okumayazma/okuma_hiz_veri.js  window.OKUMA_HIZ_VERI — sınıf başına 18 okuma
                                   (1-6 kısa · 7-12 orta · 13-18 uzun), üretilen dosya
     okumayazma/okuma_hiz_ses.js   window.OKUMA_HIZ_SES {id: uzantı} — sesi olanlar
                                   (_kaynak/uretici/okuma-hiz/sesler.py yazar; her
                                   açılışta saatlik damgayla yeniden okunur)
     ses: okumayazma/ses/okuma-hiz/<sınıf>/<id>.mp3
     Kayıtlı sesi olmayan okumada tarayıcının Arapça sesi (varsa) çalar;
     o da yoksa «ses yok» — süre tutma ve mikrofon yine çalışır.

   KİPLER
     · Süre tut      : «Başla» → öğrenci sesli okur → «Bitti» (boşluk tuşu da).
     · Sesle birlikte: ses 0,75× → 1× → 1,25× → 1,5× çalar; öğrenci aynı anda
                       okur, «Yetişti / Yetişemedi»; yetiştiği en yüksek hız.
     · Mikrofon      : ortam ölçülür, okumanın başladığı ve bittiği an sesten
                       yakalanır (konuşma tanıma yok, yalnız ses var / yok).
     Değerlendirme: süre ÷ örnek sesin süresi (oran) → ≤1,3 üç yıldız «Akıcı»,
     ≤1,8 iki «İyi», ≤2,6 bir «Gelişiyor», üstü «Bir daha deneyelim»;
     ayrıca kelime/dakika. Örnek süre: kayıtlı sesin süresi, yoksa tarayıcı
     sesinin ölçülen süresi, o da yoksa tahmin (0,62 sn/kelime).

   SONUÇLAR
     Girişsiz / öğrenci seçilmeden: bu tarayıcıda (kidefOkumaHizKayit).
     Öğretmen girişli + öğrenci seçili: kullanicilar/{uid}.okumaHiz.{anahtar} =
       {ad, s: sınıf kimliği, sa: sınıf adı, k: [son 60 kayıt]} (merge; Firestore
       kurallarına dokunulmadı — kendi belgesini güncelleyebiliyor). Yazılamazsa
       tarayıcıda bekler (kidefOkumaHizBekleyen), sonra yeniden denenir.
     Kayıt: {i, kip, sn?, kdk?, o?, h?, y, z, ms, mt}
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefOkumaHiz) return;

  var SINIFLAR = ['5', '6', '7', '8', '9', '10'];
  var HIZLAR = [0.5, 0.75, 1, 1.25, 1.5];
  var MERDIVEN = [0.75, 1, 1.25, 1.5];
  var MERDIVEN_AD = ['Yavaş', 'Normal', 'Hızlı', 'Çok hızlı'];
  var SES_YOL = 'okumayazma/ses/okuma-hiz/';
  var SES_LISTE_YOL = 'okumayazma/okuma_hiz_ses.js';
  var K_AYAR = 'kidefOkumaHizAyar', K_KAYIT = 'kidefOkumaHizKayit', K_MODEL = 'kidefOkumaHizModel', K_BEKLEYEN = 'kidefOkumaHizBekleyen';
  var KUME_AD = { kisa: 'Kısa', orta: 'Orta', uzun: 'Uzun' };
  var KIP_AD = { sure: 'Süre tut', birlikte: 'Sesle birlikte', mikrofon: 'Mikrofon' };
  var HAREKE = /[ً-ٰٟـ]/g;
  var OGR_KAYIT_SINIR = 60, CIHAZ_KAYIT_SINIR = 300;

  /* ---------------- simgeler ---------------- */
  function svg(ic, vb) { return '<svg viewBox="' + (vb || '0 0 24 24') + '" aria-hidden="true" focusable="false">' + ic + '</svg>'; }
  var CZ = ' fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  var IK = {
    ev: svg('<path d="M11.3 2.9a1.1 1.1 0 0 1 1.4 0l9.1 7.6c.8.7.3 2-.7 2H20v7.9A1.6 1.6 0 0 1 18.4 22H5.6A1.6 1.6 0 0 1 4 20.4v-7.9H2.9c-1 0-1.5-1.3-.7-2Z" fill="#E74C3C"/><rect x="9.6" y="14.2" width="4.8" height="7.8" rx="1.1" fill="#fff"/>'),
    oynat: svg('<path d="M8 5.2v13.6a1 1 0 0 0 1.5.9l10.6-6.8a1 1 0 0 0 0-1.7L9.5 4.3A1 1 0 0 0 8 5.2Z" fill="currentColor"/>'),
    durak: svg('<rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/>'),
    basa: svg('<path d="M4 12a8 8 0 1 0 2.4-5.7"' + CZ + '/><path d="M4 4v4.5h4.5"' + CZ + '/>'),
    dongu: svg('<path d="M17 2.5l3 3-3 3"' + CZ + '/><path d="M3.5 11.5v-1a5 5 0 0 1 5-5H20"' + CZ + '/><path d="M7 21.5l-3-3 3-3"' + CZ + '/><path d="M20.5 12.5v1a5 5 0 0 1-5 5H4"' + CZ + '/>'),
    saat: svg('<circle cx="12" cy="13.5" r="7.5"' + CZ + '/><path d="M12 9.5v4l2.6 2M10 2.5h4M18.5 6.5l1.5-1.5"' + CZ + '/>'),
    kulak: svg('<path d="M4 15v-3a8 8 0 0 1 16 0v3"' + CZ + '/><rect x="3" y="14" width="5" height="7" rx="2"' + CZ + '/><rect x="16" y="14" width="5" height="7" rx="2"' + CZ + '/>'),
    mik: svg('<rect x="9" y="2.5" width="6" height="12" rx="3"' + CZ + '/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v4M8.5 21.5h7"' + CZ + '/>'),
    ogr: svg('<circle cx="12" cy="8" r="4"' + CZ + '/><path d="M4 21a8 8 0 0 1 16 0"' + CZ + '/>'),
    liste: svg('<path d="M9 6h11M9 12h11M9 18h11"' + CZ + '/><circle cx="4.5" cy="6" r="1.4" fill="currentColor"/><circle cx="4.5" cy="12" r="1.4" fill="currentColor"/><circle cx="4.5" cy="18" r="1.4" fill="currentColor"/>'),
    tablo: svg('<rect x="3" y="4" width="18" height="16" rx="2.5"' + CZ + '/><path d="M3 10h18M9 10v10"' + CZ + '/>'),
    kapat: svg('<path d="M6 6l12 12M18 6 6 18"' + CZ + '/>'),
    ileri: svg('<path d="M9 5l7 7-7 7"' + CZ + '/>'),
    geri: svg('<path d="M15 5l-7 7 7 7"' + CZ + '/>'),
    hop: svg('<path d="M4 9.5v5h3.5l5 4v-13l-5 4Z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"' + CZ + '/>'),
    sessiz: svg('<path d="M4 9.5v5h3.5l5 4v-13l-5 4Z" fill="currentColor"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"' + CZ + '/>'),
    tik: svg('<path d="M5 12.5l4.5 4.5L19 7.5"' + CZ + ' stroke-width="2.8"/>'),
    carpi: svg('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"' + CZ + ' stroke-width="2.8"/>'),
    kopya: svg('<rect x="8" y="8" width="12.5" height="12.5" rx="2.5"' + CZ + '/><path d="M5 15.5H4.5A1.5 1.5 0 0 1 3 14V4.5A1.5 1.5 0 0 1 4.5 3H14a1.5 1.5 0 0 1 1.5 1.5V5"' + CZ + '/>'),
    bayrak: svg('<path d="M5 21V4M5 4h11l-2 4 2 4H5"' + CZ + '/>')
  };
  function yildiz(dolu) {
    return '<svg viewBox="0 0 24 24" class="' + (dolu ? 'dolu' : 'bos') + '" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8Z" fill="' +
      (dolu ? '#F59E0B' : '#E5E7EB') + '" stroke="' + (dolu ? '#D97706' : '#D1D5DB') + '" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  }
  function yildizlar(n, kucuk) { var s = ''; for (var i = 0; i < 3; i++) s += yildiz(i < n); return s; }

  /* ---------------- yardımcılar ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function yerelAl(k, v) { try { var x = localStorage.getItem(k); return x ? JSON.parse(x) : v; } catch (e) { return v; } }
  function yerelYaz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function ondalik(x, d) { return (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', ','); }
  function hizYaz(h) { return (h === 1 ? '1' : ondalik(h, h * 100 % 10 ? 2 : 1).replace(/,?0+$/, '')) + '×'; }
  function sayacYaz(sn) { sn = Math.max(0, sn); var m = Math.floor(sn / 60), s = sn - m * 60; return m + ':' + (s < 10 ? '0' : '') + ondalik(Math.floor(s * 10) / 10, 1); }
  function zamanYaz(sn) { sn = Math.max(0, sn || 0); var m = Math.floor(sn / 60), s = Math.floor(sn % 60); return m + ':' + (s < 10 ? '0' : '') + s; }
  function tarihYaz(ms) {
    var d = new Date(ms), b = new Date(), iki = function (n) { return (n < 10 ? '0' : '') + n; };
    var gun = d.toDateString() === b.toDateString() ? 'bugün' : iki(d.getDate()) + '.' + iki(d.getMonth() + 1);
    return gun + ' ' + iki(d.getHours()) + ':' + iki(d.getMinutes());
  }
  function param(ad) {
    var m = new RegExp('[?&]' + ad + '=([^&#]*)').exec(location.search);
    try { return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : ''; } catch (e) { return ''; }
  }
  function simdi() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function harekesiz(s) { return String(s || '').replace(HAREKE, ''); }

  /* ---------------- veri ---------------- */
  function VERI() { var v = window.OKUMA_HIZ_VERI; return (v && v.liste) || []; }
  function sinifListesi(s) { return VERI().filter(function (o) { return o.id.split('-')[0] === s; }); }
  function bul(id) { var L = VERI(); for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
  function sesUzanti(id) { var S = window.OKUMA_HIZ_SES; return (S && S[id]) ? String(S[id]) : ''; }
  function sesYolu(o) { var u = o && sesUzanti(o.id); return u ? SES_YOL + o.id.split('-')[0] + '/' + o.id + '.' + u : ''; }
  function metin(o) { return o.s.join(' '); }
  function tahminSure(o) { return 0.62 * o.n + 0.38 * (o.s.length - 1) + 0.35; }
  /* karaoke: her kelimenin süre payı (harf sayısı), satır arasında durak */
  function paylar(o) {
    var L = [], top = 0;
    o.s.forEach(function (satir, si) {
      if (si > 0) top += 4;
      satir.split(/\s+/).filter(Boolean).forEach(function (k) {
        var a = Math.max(1, harekesiz(k).replace(/[^ء-ي]/g, '').length) + 1.2;
        L.push({ bas: top, son: top + a }); top += a;
      });
    });
    return { L: L, top: top || 1 };
  }

  /* ---------------- durum ---------------- */
  var UI = null, D = null, ODK = null;
  function ayarYaz() {
    if (!D) return;
    var a = yerelAl(K_AYAR, {}) || {};
    a.sinif = D.sinif; a.kip = D.kip; a.hiz = D.hiz; a.tr = D.tr; a.dongu = D.dongu;
    a.i = a.i || {}; a.i[D.sinif] = D.i;
    if (D.og) { a.kim = a.kim || {}; a.kim[D.og.uid] = D.kim ? D.kim.anahtar : ''; }
    yerelYaz(K_AYAR, a);
  }
  function secili() { return D ? D.liste[D.i] : null; }

  /* ===================================================================
     SES MOTORU — kayıtlı ses (HTMLAudioElement) ya da tarayıcı sesi (TTS)
     =================================================================== */
  var _tts = null, _ttsArandi = false;
  function ttsSesi() {
    try {
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return null;
      var v = speechSynthesis.getVoices() || [], ar = v.filter(function (x) { return /^ar(\b|[-_])/i.test(x.lang || ''); });
      _tts = ar.filter(function (x) { return /^ar[-_]SA/i.test(x.lang); })[0] || ar[0] || null;
      _ttsArandi = true;
      return _tts;
    } catch (e) { return null; }
  }
  var Ses = {
    tur: 'yok', o: null, sure: null, tahmini: true, el: null, caliyor: false, durgun: false, hiz: 1,
    raf: 0, bitince: null, ttsT0: 0, ttsKelime: -1, ttsGecen: 0,
    hazirla: function (o) {
      this.durdur();
      this.o = o; this.el = null; this.sure = null; this.tahmini = true; this.ttsKelime = -1;
      var yol = sesYolu(o);
      if (yol) {
        var el = new Audio(); el.preload = 'auto'; el.src = yol;
        try { el.preservesPitch = true; el.mozPreservesPitch = true; el.webkitPreservesPitch = true; } catch (e) { }
        var self = this;
        el.addEventListener('loadedmetadata', function () {
          if (self.el !== el) return;
          if (isFinite(el.duration) && el.duration > 0) { self.sure = el.duration; self.tahmini = false; arayuzSes(); }
        });
        el.addEventListener('error', function () {
          if (self.el !== el) return;
          self.el = null; self.tur = ttsSesi() ? 'tts' : 'yok'; self.modelYukle(); arayuzSes();
        });
        el.addEventListener('ended', function () { if (self.el === el) self.bitti(); });
        this.el = el; this.tur = 'dosya';
      } else {
        this.tur = ttsSesi() ? 'tts' : 'yok';
        this.modelYukle();
      }
    },
    modelYukle: function () {
      var M = yerelAl(K_MODEL, {}) || {}, m = this.o && M[this.o.id];
      if (m && m > 0.3) { this.sure = m; this.tahmini = false; } else { this.sure = this.o ? tahminSure(this.o) : null; this.tahmini = true; }
    },
    var: function () { return this.tur !== 'yok'; },
    oynat: function (hiz, bitince) {
      if (!this.o || this.tur === 'yok') return false;
      this.hiz = hiz || 1; this.bitince = bitince || null; this.durgun = false;
      if (this.tur === 'dosya' && this.el) {
        var el = this.el;
        try { el.playbackRate = this.hiz; el.defaultPlaybackRate = this.hiz; } catch (e) { }
        if (el.ended || (el.duration && el.currentTime >= el.duration - 0.05)) el.currentTime = 0;
        var p = el.play();
        if (p && p.catch) p.catch(function () { bildir('Ses çalınamadı — bir kez dokunup yeniden dene'); Ses.caliyor = false; arayuzOynat(); });
      } else {
        try { speechSynthesis.cancel(); } catch (e) { }
        var u = new SpeechSynthesisUtterance(metin(this.o)), v = _tts || ttsSesi(), self = this;
        u.lang = v ? v.lang : 'ar-SA'; if (v) u.voice = v; u.rate = this.hiz;
        u.onstart = function () { self.ttsT0 = simdi(); self.ttsGecen = 0; };
        u.onboundary = function (e) { if (e && (e.name === 'word' || !e.name)) self.ttsKelime = kelimeSirasi(self.o, e.charIndex); };
        u.onend = function () {
          if (self._u !== u) return;
          var g = (simdi() - self.ttsT0 + self.ttsGecen) / 1000;
          if (g > 0.3 && self.o) { var M = yerelAl(K_MODEL, {}) || {}; M[self.o.id] = Math.round(g * self.hiz * 100) / 100; yerelYaz(K_MODEL, M); if (self.tahmini) { self.sure = M[self.o.id]; self.tahmini = false; } }
          self.bitti();
        };
        u.onerror = function () { if (self._u === u) { self.caliyor = false; arayuzOynat(); } };
        this._u = u; this.ttsT0 = simdi(); this.ttsKelime = -1;
        speechSynthesis.speak(u);
      }
      this.caliyor = true;
      this.dongu();
      arayuzOynat();
      return true;
    },
    duraklat: function () {
      if (!this.caliyor) return;
      if (this.tur === 'dosya' && this.el) this.el.pause();
      else { try { speechSynthesis.pause(); } catch (e) { } this.ttsGecen += simdi() - this.ttsT0; }
      this.caliyor = false; this.durgun = true; cancelAnimationFrame(this.raf); arayuzOynat();
    },
    devam: function () {
      if (!this.durgun) return this.oynat(this.hiz, this.bitince);
      if (this.tur === 'dosya' && this.el) { var p = this.el.play(); if (p && p.catch) p.catch(function () { }); }
      else { try { speechSynthesis.resume(); } catch (e) { } this.ttsT0 = simdi(); }
      this.caliyor = true; this.durgun = false; this.dongu(); arayuzOynat();
      return true;
    },
    durdur: function () {
      cancelAnimationFrame(this.raf);
      this.bitince = null;
      if (this.el) { try { this.el.pause(); this.el.currentTime = 0; } catch (e) { } }
      if (this.tur === 'tts' || this._u) { this._u = null; try { speechSynthesis.cancel(); } catch (e) { } }
      this.caliyor = false; this.durgun = false; this.ttsKelime = -1;
      vurgula(-1);
      arayuzOynat();
    },
    konumla: function (p) {
      if (this.tur !== 'dosya' || !this.el || !(this.el.duration > 0)) return;
      this.el.currentTime = Math.max(0, Math.min(1, p)) * this.el.duration;
      this.ciz();
    },
    oran: function () {
      if (this.tur === 'dosya' && this.el && this.el.duration > 0) return this.el.currentTime / this.el.duration;
      if (this.tur === 'tts' && (this.caliyor || this.durgun)) {
        var top = (this.sure || tahminSure(this.o)) / this.hiz;
        var g = (this.ttsGecen + (this.caliyor ? simdi() - this.ttsT0 : 0)) / 1000;
        return Math.max(0, Math.min(0.99, g / top));
      }
      return 0;
    },
    gecen: function () {
      if (this.tur === 'dosya' && this.el) return this.el.currentTime;
      return this.oran() * (this.sure || 0);
    },
    dongu: function () {
      cancelAnimationFrame(this.raf);
      var self = this;
      var adim = function () { if (!self.caliyor) return; self.ciz(); self.raf = requestAnimationFrame(adim); };
      this.raf = requestAnimationFrame(adim);
    },
    ciz: function () {
      var p = this.oran();
      arayuzIlerleme(p);
      if (this.tur === 'tts' && this.ttsKelime >= 0) vurgula(this.ttsKelime);
      else if (this.caliyor || this.durgun) vurgula(kelimeOran(this.o, p));
    },
    bitti: function () {
      cancelAnimationFrame(this.raf);
      this.caliyor = false; this.durgun = false;
      arayuzIlerleme(1); vurgula(1e9);
      var f = this.bitince; this.bitince = null;
      arayuzOynat();
      setTimeout(function () { if (!Ses.caliyor) vurgula(-1); }, 650);
      if (f) { f(); return; }
      if (D && D.dongu && !D.calisma) setTimeout(function () { if (D && D.dongu && !Ses.caliyor && !D.calisma) Ses.oynat(D.hiz); }, 800);
    }
  };
  function kelimeSirasi(o, ci) {
    if (!o || ci == null) return -1;
    var t = metin(o), n = 0, i = 0, ic = false;
    for (; i < t.length && i <= ci; i++) { var bos = /\s/.test(t[i]); if (!bos && !ic) { n++; ic = true; } else if (bos) ic = false; }
    return Math.max(0, n - 1);
  }
  function kelimeOran(o, p) {
    if (!o) return -1;
    var P = UI && UI.paylar ? UI.paylar : paylar(o), h = p * P.top;
    for (var i = 0; i < P.L.length; i++) if (h < P.L[i].son) return i;
    return P.L.length - 1;
  }
  function vurgula(i) {
    if (!UI) return;
    var K = UI.kelimeler || [];
    for (var j = 0; j < K.length; j++) { K[j].classList.toggle('yak', j === i); K[j].classList.toggle('gecti', i >= 0 && j < i); }
  }

  /* ===================================================================
     ARAYÜZ
     =================================================================== */
  function kur(mount, ayar) {
    if (typeof mount === 'string') mount = document.getElementById(mount);
    if (!mount || mount.__ohKuruldu) return;
    mount.__ohKuruldu = 1;
    ayar = ayar || {};
    var a = yerelAl(K_AYAR, {}) || {};
    var s = String(ayar.sinif || param('sinif') || a.sinif || '5').replace(/\D/g, '');
    if (SINIFLAR.indexOf(s) < 0) s = '5';
    D = {
      sinif: s, i: 0, kip: (a.kip in KIP_AD) ? a.kip : 'sure', hiz: HIZLAR.indexOf(a.hiz) >= 0 ? a.hiz : 1,
      tr: a.tr !== false, dongu: !!a.dongu, liste: [], og: null, kim: null, calisma: null, son: null,
      gomulu: !!(ayar.gomulu || param('gomulu'))
    };
    mount.classList.add('oh');
    if (D.gomulu) mount.classList.add('gomulu');
    mount.innerHTML =
      '<header class="oh-bas">' +
        '<a class="oh-ev" href="index.html" data-kidef-home="1" title="Ana sayfa — Kidef Arapça" aria-label="Ana sayfaya git">' + IK.ev + '</a>' +
        '<div class="oh-baslik"><b>Okuma Hızlandırma</b><small>Dinle · oku · hızını ölç</small></div>' +
        '<div class="oh-siniflar" role="tablist" aria-label="Sınıf"><span>Sınıf</span>' +
          SINIFLAR.map(function (x) { return '<button type="button" class="oh-sinif" data-is="sinif" data-v="' + x + '" role="tab">' + x + '</button>'; }).join('') + '</div>' +
        '<button type="button" class="oh-ust-t" data-is="kim" hidden title="Kimin okuması — sonuç o öğrencinin adına kaydedilir">' + IK.ogr + '<span>Öğrenci seç</span></button>' +
        '<button type="button" class="oh-ust-t" data-is="tablo" hidden title="Sınıfın okuma hızları">' + IK.tablo + '<span class="uzun">Sınıf tablosu</span></button>' +
        '<button type="button" class="oh-ust-t" data-is="sesListe" hidden title="Ses dosyalarının listesi (TTS için metinler)">' + IK.liste + '<span class="uzun">Ses listesi</span></button>' +
      '</header>' +
      '<div class="oh-govde">' +
        '<aside class="oh-yan"><h2>Okumalar <small></small></h2><div class="oh-liste"></div></aside>' +
        '<main class="oh-ana">' +
          '<div class="oh-kipler" role="tablist" aria-label="Ölçme biçimi">' +
            '<button type="button" class="oh-kip" data-is="kip" data-v="sure" role="tab">' + IK.saat + '<span>Süre tut</span></button>' +
            '<button type="button" class="oh-kip" data-is="kip" data-v="birlikte" role="tab">' + IK.kulak + '<span>Sesle birlikte</span></button>' +
            '<button type="button" class="oh-kip" data-is="kip" data-v="mikrofon" role="tab">' + IK.mik + '<span>Mikrofon</span></button>' +
          '</div>' +
          '<section class="oh-kart" aria-live="polite">' +
            '<div class="oh-kart-ust"></div>' +
            '<div class="oh-metin ar" lang="ar"></div>' +
            '<div class="oh-tr"></div>' +
          '</section>' +
          '<div class="oh-oynatici">' +
            '<button type="button" class="oh-ot ana" data-is="oynat" title="Örnek okumayı dinle (oynat / duraklat)" aria-label="Oynat">' + IK.oynat + '</button>' +
            '<button type="button" class="oh-ot" data-is="basa" title="Baştan" aria-label="Baştan">' + IK.basa + '</button>' +
            '<div class="oh-cubuk"><div class="oh-iz" data-is="iz" role="slider" aria-label="Konum" aria-valuemin="0" aria-valuemax="100" tabindex="0"><div class="oh-iz-dolu"></div><div class="oh-iz-top"></div></div>' +
              '<span class="oh-sure">0:00 / 0:00</span></div>' +
            '<div class="oh-hizlar" role="group" aria-label="Hız">' +
              HIZLAR.map(function (h) { return '<button type="button" class="oh-hiz" data-is="hiz" data-v="' + h + '" title="Hız ' + hizYaz(h) + '">' + hizYaz(h) + '</button>'; }).join('') + '</div>' +
            '<button type="button" class="oh-ot" data-is="dongu" title="Tekrarla (döngü)" aria-label="Tekrarla" aria-pressed="false">' + IK.dongu + '</button>' +
            '<span class="oh-kaynak"></span>' +
          '</div>' +
          '<section class="oh-panel"></section>' +
          '<div class="oh-gecis">' +
            '<button type="button" class="oh-kucuk-t" data-is="onceki">' + IK.geri + 'Önceki</button>' +
            '<button type="button" class="oh-kucuk-t" data-is="sonraki">Sonraki' + IK.ileri + '</button>' +
          '</div>' +
          '<section class="oh-gecmis"></section>' +
        '</main>' +
      '</div>';
    UI = {
      kok: mount, liste: mount.querySelector('.oh-liste'), yanAlt: mount.querySelector('.oh-yan h2 small'),
      kartUst: mount.querySelector('.oh-kart-ust'), metin: mount.querySelector('.oh-metin'), tr: mount.querySelector('.oh-tr'),
      kart: mount.querySelector('.oh-kart'), panel: mount.querySelector('.oh-panel'), gecmis: mount.querySelector('.oh-gecmis'),
      oynat: mount.querySelector('[data-is="oynat"]'), iz: mount.querySelector('.oh-iz'), izDolu: mount.querySelector('.oh-iz-dolu'),
      izTop: mount.querySelector('.oh-iz-top'), sure: mount.querySelector('.oh-sure'), kaynak: mount.querySelector('.oh-kaynak'),
      kim: mount.querySelector('[data-is="kim"]'), tablo: mount.querySelector('[data-is="tablo"]'), sesListe: mount.querySelector('[data-is="sesListe"]'),
      kelimeler: [], paylar: null
    };
    mount.addEventListener('click', tikla);
    UI.iz.addEventListener('pointerdown', izBas);
    document.addEventListener('keydown', tus);
    document.addEventListener('visibilitychange', function () { if (document.hidden) { Ses.duraklat(); } });
    window.addEventListener('pagehide', function () { mikKapat(); });
    var ev = mount.querySelector('.oh-ev');
    ev.addEventListener('click', function (e) { if (window.kidefAnasayfa) return window.kidefAnasayfa(e); });
    /* tarayıcı sesleri geç gelir: gelince kayıtlı sesi olmayan okuma tarayıcı sesine geçer */
    if (window.speechSynthesis) {
      try {
        speechSynthesis.addEventListener('voiceschanged', function () {
          ttsSesi();
          if (Ses.o && !Ses.el && !Ses.caliyor && Ses.tur !== (_tts ? 'tts' : 'yok')) { Ses.tur = _tts ? 'tts' : 'yok'; Ses.modelYukle(); arayuzSes(); }
        });
      } catch (e) { }
      ttsSesi();
    }
    sesListesiYukle();
    sinifSec(D.sinif, true);
    var oku = param('oku');
    if (oku) { var j = D.liste.map(function (x) { return x.id; }).indexOf(oku); if (j >= 0) ogeSec(j); }
    if (param('ses') === '1') setTimeout(sesListesiAc, 50);
  }

  /* ses listesi (hangi okumanın kayıtlı sesi var) — saatlik damgayla taze */
  function sesListesiYukle() {
    var s = document.createElement('script');
    s.src = SES_LISTE_YOL + '?t=' + Math.floor(Date.now() / 3600000);
    s.async = true;
    s.onload = function () { if (Ses.o && !Ses.caliyor && !(D && D.calisma)) { Ses.hazirla(Ses.o); arayuzSes(); listeCiz(); } };
    s.onerror = function () { window.OKUMA_HIZ_SES = window.OKUMA_HIZ_SES || {}; };
    document.head.appendChild(s);
  }

  function sinifSec(s, ilk) {
    if (SINIFLAR.indexOf(s) < 0) return;
    calismaBirak();
    D.sinif = s;
    D.liste = sinifListesi(s);
    var a = yerelAl(K_AYAR, {}) || {};
    D.i = Math.max(0, Math.min(D.liste.length - 1, (a.i && a.i[s]) || 0));
    [].forEach.call(UI.kok.querySelectorAll('.oh-sinif'), function (b) {
      var se = b.getAttribute('data-v') === s; b.classList.toggle('sec', se); b.setAttribute('aria-selected', se ? 'true' : 'false');
    });
    listeCiz();
    ogeSec(D.i, true);
    if (!ilk) ayarYaz();
  }

  function enIyi(id) {
    var y = -1;
    kayitlar().forEach(function (r) { if (r.i === id && r.y > y) y = r.y; });
    return y;
  }
  function listeCiz() {
    if (!UI) return;
    var h = '', son = '';
    D.liste.forEach(function (o, i) {
      if (o.k !== son) { son = o.k; h += '<div class="oh-kume ' + o.k + '"><i></i>' + KUME_AD[o.k] + (o.k === 'uzun' ? ' · karşılıklı' : '') + '</div>'; }
      var y = enIyi(o.id);
      h += '<button type="button" class="oh-oge ' + o.k + (i === D.i ? ' sec' : '') + '" data-is="oge" data-i="' + i + '" title="' + esc(o.tr.join(' — ')) + '">' +
        '<span class="no">' + (i + 1) + '</span><span class="ar" lang="ar">' + esc(o.s.join(' ')) + '</span>' +
        '<span class="yz" aria-label="' + (y >= 0 ? y + ' yıldız' : '') + '">' + (y >= 0 ? yildizlar(y) : '') + '</span></button>';
    });
    UI.liste.innerHTML = h;
    UI.yanAlt.textContent = D.sinif + '. sınıf · ' + D.liste.length;
  }

  function ogeSec(i, sessiz) {
    if (!D.liste.length) return;
    calismaBirak();
    D.i = (i + D.liste.length) % D.liste.length;
    var o = secili();
    [].forEach.call(UI.liste.querySelectorAll('.oh-oge'), function (b) { b.classList.toggle('sec', +b.getAttribute('data-i') === D.i); });
    var sec = UI.liste.querySelector('.oh-oge.sec');
    if (sec && sec.scrollIntoView && !sessiz) { try { sec.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { } }
    UI.kartUst.innerHTML = '<span class="rozet ' + o.k + '">' + KUME_AD[o.k] + '</span><span>' + (D.i + 1) + ' / ' + D.liste.length + ' · ' + o.n + ' kelime</span>' +
      '<span class="ders" title="' + esc(o.u + ' · ' + o.d) + '">' + esc(o.u + ' · ' + o.d) + '</span>' +
      '<button type="button" class="oh-tr-t" data-is="tr" aria-pressed="true" title="Türkçesini göster / gizle">Türkçesi</button>';
    var k = 0;
    UI.metin.className = 'oh-metin ar ' + o.k;
    UI.metin.innerHTML = o.s.map(function (satir) {
      return '<span class="oh-satir' + (o.s.length > 1 ? ' iki' : '') + '">' + satir.split(/\s+/).filter(Boolean).map(function (w) { return '<span class="oh-k" data-k="' + (k++) + '">' + esc(w) + '</span>'; }).join(' ') + '</span>';
    }).join('');
    UI.kelimeler = [].slice.call(UI.metin.querySelectorAll('.oh-k'));
    UI.paylar = paylar(o);
    UI.tr.innerHTML = esc(o.tr.join(' — '));
    trUygula();
    Ses.hazirla(o);
    arayuzSes(); arayuzOynat(); arayuzIlerleme(0);
    D.son = null;
    panelCiz();
    gecmisCiz();
    if (!sessiz) ayarYaz();
  }
  function trUygula() {
    UI.tr.hidden = !D.tr;
    var b = UI.kok.querySelector('[data-is="tr"]');
    b.classList.toggle('sec', D.tr); b.setAttribute('aria-pressed', D.tr ? 'true' : 'false');
  }

  /* --- oynatıcı arayüzü --- */
  function arayuzSes() {
    if (!UI) return;
    var t = Ses.tur, k = UI.kaynak;
    k.className = 'oh-kaynak ' + t;
    k.innerHTML = t === 'dosya' ? IK.hop + 'Kayıtlı ses' : (t === 'tts' ? IK.hop + 'Tarayıcı sesi' : IK.sessiz + 'Ses henüz yok');
    k.title = t === 'dosya' ? 'Bu okumanın kayıtlı sesi çalıyor' : (t === 'tts' ? 'Kayıtlı ses eklenene kadar cihazın Arapça sesi okuyor' : 'Bu okumanın sesi henüz eklenmedi; süre tutma ve mikrofon yine çalışır');
    var yok = t === 'yok';
    UI.oynat.disabled = yok;
    UI.kok.querySelector('[data-is="basa"]').disabled = yok;
    UI.iz.classList.toggle('kapali', t !== 'dosya');
    [].forEach.call(UI.kok.querySelectorAll('[data-is="hiz"]'), function (b) { b.disabled = yok; b.classList.toggle('sec', +b.getAttribute('data-v') === D.hiz); });
    var dg = UI.kok.querySelector('[data-is="dongu"]');
    dg.disabled = yok; dg.classList.toggle('sec', D.dongu); dg.setAttribute('aria-pressed', D.dongu ? 'true' : 'false');
    arayuzIlerleme(Ses.oran());
    if (D.kip === 'birlikte' || D.kip === 'sure') panelNot();
  }
  function arayuzOynat() {
    if (!UI) return;
    UI.oynat.innerHTML = Ses.caliyor ? IK.durak : IK.oynat;
    UI.oynat.setAttribute('aria-label', Ses.caliyor ? 'Duraklat' : 'Oynat');
    UI.kart.classList.toggle('dinliyor', Ses.caliyor);
  }
  function arayuzIlerleme(p) {
    if (!UI) return;
    p = Math.max(0, Math.min(1, p || 0));
    UI.izDolu.style.width = (p * 100) + '%';
    UI.izTop.style.left = (p * 100) + '%';
    UI.iz.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    var top = Ses.sure || (Ses.o ? tahminSure(Ses.o) : 0);
    UI.sure.textContent = zamanYaz(p * top) + ' / ' + (Ses.tahmini && Ses.tur !== 'dosya' ? '~' : '') + zamanYaz(top);
  }
  function izBas(e) {
    if (Ses.tur !== 'dosya') return;
    e.preventDefault();
    var r = UI.iz.getBoundingClientRect();
    var git = function (ev) { Ses.konumla((ev.clientX - r.left) / r.width); };
    git(e);
    try { UI.iz.setPointerCapture(e.pointerId); } catch (x) { }
    var tasi = function (ev) { git(ev); };
    var birak = function () { UI.iz.removeEventListener('pointermove', tasi); UI.iz.removeEventListener('pointerup', birak); UI.iz.removeEventListener('pointercancel', birak); };
    UI.iz.addEventListener('pointermove', tasi); UI.iz.addEventListener('pointerup', birak); UI.iz.addEventListener('pointercancel', birak);
  }

  /* ===================================================================
     KİPLER
     =================================================================== */
  function kipSec(k) {
    if (!(k in KIP_AD)) return;
    calismaBirak();
    if (D.kip === 'mikrofon' && k !== 'mikrofon') mikKapat();
    D.kip = k; D.son = null;
    panelCiz(); ayarYaz();
  }
  function calismaBirak() {
    var c = D && D.calisma;
    if (!c) return;
    D.calisma = null;
    clearInterval(c.tz); clearTimeout(c.gz);
    if (c.kip === 'birlikte') Ses.durdur();
    if (c.kip === 'mikrofon') mikDinleDur();
    if (UI) UI.kart.classList.remove('okunuyor');
    var gs = UI && UI.kart.querySelector('.oh-geri-say'); if (gs) gs.remove();
  }
  function panelCiz() {
    if (!UI) return;
    [].forEach.call(UI.kok.querySelectorAll('.oh-kip'), function (b) { var se = b.getAttribute('data-v') === D.kip; b.classList.toggle('sec', se); b.setAttribute('aria-selected', se ? 'true' : 'false'); });
    var h = '';
    if (D.kip === 'sure') {
      h = '<div class="oh-panel-bas"><b>Süre tut</b><p>Öğrenci <b>Başla</b>ya basar, cümleyi sesli okur, bitince <b>Bitti</b>ye basar. Boşluk tuşu da olur. İstersen önce örneği dinle (oynat tuşu).</p></div>' +
        '<div class="oh-sahne"><button type="button" class="oh-buyuk" data-is="basla">' + IK.oynat + 'Başla</button><div class="oh-sayac">0:00,0</div></div>' +
        '<p class="oh-not"></p>';
    } else if (D.kip === 'birlikte') {
      h = '<div class="oh-panel-bas"><b>Sesle birlikte</b><p>Ses çalarken öğrenci de aynı anda sesli okur. Yetişirse hız bir basamak artar: 0,75× → 1× → 1,25× → 1,5×.</p></div>' +
        '<div class="oh-merdiven">' + MERDIVEN.map(function (m, i) { return '<div class="oh-basamak" data-b="' + i + '"><small>' + MERDIVEN_AD[i] + '</small><b>' + hizYaz(m) + '</b></div>'; }).join('') + '</div>' +
        '<div class="oh-sahne oh-b-sahne"></div><p class="oh-not"></p>';
    } else {
      h = '<div class="oh-panel-bas"><b>Mikrofon</b><p>Mikrofon okumanın başladığı ve bittiği anı kendisi yakalar. Sessiz bir ortamda, cihaza yakın, yüksek sesle oku.</p></div>' +
        '<div class="oh-mik-sev"><div class="oh-olcer"><i></i><em></em></div></div>' +
        '<div class="oh-mik-durum">Mikrofon kapalı</div>' +
        '<div class="oh-sahne oh-m-sahne"></div><p class="oh-not"></p>';
    }
    h += '<div class="oh-sonuc-yer"></div>';
    UI.panel.innerHTML = h;
    if (D.kip === 'birlikte') birlikteCiz();
    if (D.kip === 'mikrofon') mikCiz();
    panelNot();
    if (D.son) sonucGoster(D.son, true);
  }
  function panelNot() {
    var n = UI && UI.panel.querySelector('.oh-not');
    if (!n || !Ses.o) return;
    var o = Ses.o, ms = Ses.sure || tahminSure(o);
    if (D.kip === 'sure') n.innerHTML = 'Örnek okuma: <b>' + ondalik(ms, 1) + ' sn</b>' + (Ses.tahmini ? ' (tahmini)' : '') + ' · ' + o.n + ' kelime';
    else if (D.kip === 'birlikte') {
      n.innerHTML = Ses.tur === 'yok' ? 'Bu okumanın sesi henüz eklenmedi; «Sesle birlikte» ses gelince açılır. Şimdilik «Süre tut» ya da «Mikrofon».'
        : (Ses.tur === 'tts' ? 'Kayıtlı ses yok, cihazın Arapça sesi okuyor.' : 'Örnek okuma: <b>' + ondalik(ms, 1) + ' sn</b> (1× hızda)');
      var b = UI.panel.querySelector('[data-is="bBasla"]'); if (b) b.disabled = Ses.tur === 'yok';
    } else n.innerHTML = 'Örnek okuma: <b>' + ondalik(ms, 1) + ' sn</b>' + (Ses.tahmini ? ' (tahmini)' : '');
  }

  /* --- 1) SÜRE TUT --- */
  function sureBasla() {
    if (D.calisma) return;
    Ses.durdur();
    var c = D.calisma = { kip: 'sure', t0: simdi() };
    D.son = null;
    var yer = UI.panel.querySelector('.oh-sonuc-yer'); if (yer) yer.innerHTML = '';
    var b = UI.panel.querySelector('[data-is="basla"]'), sy = UI.panel.querySelector('.oh-sayac');
    b.setAttribute('data-is', 'bitti'); b.classList.add('dur'); b.innerHTML = IK.bayrak + 'Bitti';
    sy.classList.add('calisiyor');
    UI.kart.classList.add('okunuyor');
    c.tz = setInterval(function () { if (D.calisma === c) sy.textContent = sayacYaz((simdi() - c.t0) / 1000); }, 50);
  }
  function sureBitti() {
    var c = D.calisma;
    if (!c || c.kip !== 'sure') return;
    var sn = (simdi() - c.t0) / 1000;
    calismaBirak();
    var b = UI.panel.querySelector('[data-is="bitti"]'), sy = UI.panel.querySelector('.oh-sayac');
    if (b) { b.setAttribute('data-is', 'basla'); b.classList.remove('dur'); b.innerHTML = IK.oynat + 'Başla'; }
    if (sy) { sy.classList.remove('calisiyor'); sy.textContent = sayacYaz(Math.round(sn * 10) / 10); }
    if (sn < 0.5) { bildir('Çok kısa sürdü — yeniden dene'); if (sy) sy.textContent = '0:00,0'; return; }
    sonucYap({ kip: 'sure', sn: sn });
  }

  /* --- 2) SESLE BİRLİKTE --- */
  function birlikteCiz(durum) {
    var sh = UI.panel.querySelector('.oh-b-sahne');
    if (!sh) return;
    var c = D.calisma && D.calisma.kip === 'birlikte' ? D.calisma : null;
    [].forEach.call(UI.panel.querySelectorAll('.oh-basamak'), function (b) {
      var i = +b.getAttribute('data-b');
      b.classList.toggle('gecti', !!c && i < c.adim);
      b.classList.toggle('simdi', !!c && i === c.adim && durum !== 'bitti');
      b.classList.toggle('kaldi', !!c && i === c.adim && durum === 'kaldi');
    });
    if (!c) {
      sh.innerHTML = '<button type="button" class="oh-buyuk" data-is="bBasla"' + (Ses.tur === 'yok' ? ' disabled' : '') + '>' + IK.oynat + 'Başlat</button>';
    } else if (durum === 'sor') {
      sh.innerHTML = '<div class="oh-mik-durum">' + hizYaz(MERDIVEN[c.adim]) + ' hızına yetişti mi?</div>' +
        '<button type="button" class="oh-buyuk evet" data-is="bEvet">' + IK.tik + 'Yetişti</button>' +
        '<button type="button" class="oh-buyuk hayir" data-is="bHayir">' + IK.carpi + 'Yetişemedi</button>' +
        '<button type="button" class="oh-buyuk ikinci" data-is="bTekrar">' + IK.basa + 'Bu hızı tekrarla</button>';
    } else {
      sh.innerHTML = '<div class="oh-mik-durum okuyor">' + hizYaz(MERDIVEN[c.adim]) + ' · sesle birlikte oku…</div>' +
        '<button type="button" class="oh-buyuk ikinci" data-is="bDur">' + IK.durak + 'Durdur</button>';
    }
  }
  function birlikteBasla() {
    if (Ses.tur === 'yok') { bildir('Bu okumanın sesi henüz yok'); return; }
    calismaBirak(); Ses.durdur();
    D.son = null;
    var yer = UI.panel.querySelector('.oh-sonuc-yer'); if (yer) yer.innerHTML = '';
    D.calisma = { kip: 'birlikte', adim: 0 };
    birlikteAdim();
  }
  function birlikteAdim() {
    var c = D.calisma;
    if (!c || c.kip !== 'birlikte') return;
    birlikteCiz('cal');
    UI.kart.classList.add('okunuyor');
    geriSay(3, function () {
      if (D.calisma !== c) return;
      Ses.oynat(MERDIVEN[c.adim], function () {
        if (D.calisma !== c) return;
        UI.kart.classList.remove('okunuyor');
        birlikteCiz('sor');
      });
    }, c);
  }
  function birlikteCevap(evet) {
    var c = D.calisma;
    if (!c || c.kip !== 'birlikte') return;
    if (evet) {
      c.adim++;
      if (c.adim >= MERDIVEN.length) { var h = MERDIVEN[MERDIVEN.length - 1]; birlikteBitir(h); return; }
      birlikteAdim();
    } else {
      var en = c.adim > 0 ? MERDIVEN[c.adim - 1] : 0;
      birlikteCiz('kaldi');
      birlikteBitir(en);
    }
  }
  function birlikteBitir(h) {
    var c = D.calisma;
    calismaBirak();
    D.calisma = null;
    birlikteCiz();
    [].forEach.call(UI.panel.querySelectorAll('.oh-basamak'), function (b) {
      var i = +b.getAttribute('data-b');
      b.classList.toggle('gecti', MERDIVEN[i] <= h);
      b.classList.toggle('kaldi', c && i === c.adim && MERDIVEN[i] > h);
    });
    sonucYap({ kip: 'birlikte', h: h });
  }
  function geriSay(n, sonra, c) {
    var k = document.createElement('div');
    k.className = 'oh-geri-say';
    UI.kart.appendChild(k);
    var adim = function () {
      if (D.calisma !== c) { k.remove(); return; }
      if (n <= 0) { k.remove(); sonra(); return; }
      k.innerHTML = '<b>' + n + '</b>';
      n--;
      c.gz = setTimeout(adim, 700);
    };
    adim();
  }

  /* --- 3) MİKROFON (ses var / yok) --- */
  var MK = null;   /* { akis, ctx, an, buf, tz, durum, gurultu, esik, t0, son, ilkSes, sesSay, olcum[] } */
  function mikCiz() {
    var sh = UI.panel.querySelector('.oh-m-sahne'), d = UI.panel.querySelector('.oh-mik-durum');
    if (!sh || !d) return;
    var durum = MK ? MK.durum : 'kapali';
    var yazi = { kapali: 'Mikrofon kapalı', hazir: 'Mikrofon açık — «Okumaya hazırım»a bas', olcuyor: 'Sessiz kal… ortam ölçülüyor',
                 bekliyor: 'Oku! Sesin gelince süre başlar', okuyor: 'Okuyor…', hata: MK && MK.hata ? MK.hata : 'Mikrofon açılamadı' }[durum] || '';
    d.textContent = yazi;
    d.className = 'oh-mik-durum' + (durum === 'bekliyor' ? ' dinliyor' : (durum === 'okuyor' ? ' okuyor' : ''));
    var sy = MK && (durum === 'okuyor' || durum === 'bekliyor') ? '<div class="oh-sayac calisiyor">0:00,0</div>' : '';
    if (durum === 'kapali' || durum === 'hata') sh.innerHTML = '<button type="button" class="oh-buyuk" data-is="mAc">' + IK.mik + 'Mikrofonu aç</button>';
    else if (durum === 'hazir') sh.innerHTML = '<button type="button" class="oh-buyuk" data-is="mBasla">' + IK.oynat + 'Okumaya hazırım</button>' +
      '<button type="button" class="oh-buyuk ikinci" data-is="mKapat">Mikrofonu kapat</button>';
    else sh.innerHTML = sy + '<button type="button" class="oh-buyuk dur" data-is="mDur">' + IK.bayrak + (durum === 'okuyor' ? 'Bitti' : 'Vazgeç') + '</button>';
  }
  function mikAc() {
    if (MK && MK.akis) { MK.durum = 'hazir'; mikCiz(); return; }
    var md = navigator.mediaDevices;
    if (!md || !md.getUserMedia || !(window.AudioContext || window.webkitAudioContext)) {
      MK = { durum: 'hata', hata: 'Bu cihazda / tarayıcıda mikrofon kullanılamıyor' }; mikCiz(); return;
    }
    MK = { durum: 'aciliyor' };
    var bu = MK;
    md.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }).then(function (akis) {
      if (MK !== bu) { akis.getTracks().forEach(function (t) { t.stop(); }); return; }
      var Ctx = window.AudioContext || window.webkitAudioContext, ctx = new Ctx();
      var src = ctx.createMediaStreamSource(akis), an = ctx.createAnalyser();
      an.fftSize = 1024; an.smoothingTimeConstant = 0;
      src.connect(an);
      MK = { akis: akis, ctx: ctx, an: an, buf: new Float32Array(an.fftSize), durum: 'hazir', gurultu: 0.004, esik: 0.02 };
      if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
      MK.tz = setInterval(mikOlc, 25);
      mikCiz();
    }).catch(function (e) {
      if (MK !== bu) return;
      MK = { durum: 'hata', hata: (e && e.name === 'NotAllowedError') ? 'Mikrofon izni verilmedi — tarayıcının adres çubuğundan izin ver' : 'Mikrofon açılamadı' };
      mikCiz();
    });
  }
  function mikKapat() {
    if (MK) {
      clearInterval(MK.tz);
      if (MK.akis) MK.akis.getTracks().forEach(function (t) { try { t.stop(); } catch (e) { } });
      if (MK.ctx && MK.ctx.close) { try { MK.ctx.close(); } catch (e) { } }
    }
    MK = null;
    if (UI && D && D.kip === 'mikrofon') mikCiz();
  }
  function mikRms() {
    var an = MK.an, b = MK.buf;
    if (an.getFloatTimeDomainData) an.getFloatTimeDomainData(b);
    else { var u = new Uint8Array(an.fftSize); an.getByteTimeDomainData(u); for (var j = 0; j < u.length; j++) b[j] = (u[j] - 128) / 128; }
    var t = 0; for (var i = 0; i < b.length; i++) t += b[i] * b[i];
    return Math.sqrt(t / b.length);
  }
  function mikBasla() {
    if (!MK || !MK.akis) { mikAc(); return; }
    Ses.durdur();
    calismaBirak();
    D.son = null;
    var yer = UI.panel.querySelector('.oh-sonuc-yer'); if (yer) yer.innerHTML = '';
    var c = D.calisma = { kip: 'mikrofon' };
    MK.durum = 'olcuyor'; MK.olcum = []; MK.t0 = 0; MK.son = 0; MK.ilkSes = 0; MK.sesSay = 0; MK.basT = simdi();
    mikCiz();
    c.tz = setInterval(function () {
      if (D.calisma !== c || !MK) return;
      var sy = UI.panel.querySelector('.oh-sayac');
      if (sy && MK.durum === 'okuyor') sy.textContent = sayacYaz((simdi() - MK.t0) / 1000);
    }, 50);
  }
  function mikDinleDur() { if (MK && MK.akis) { MK.durum = 'hazir'; } if (UI && D && D.kip === 'mikrofon') mikCiz(); }
  function mikOlc() {
    if (!MK || !MK.an) return;
    var r = mikRms(), t = simdi();
    var olcer = UI && UI.panel.querySelector('.oh-olcer i'), cizgi = UI && UI.panel.querySelector('.oh-olcer em');
    if (olcer) olcer.style.width = Math.min(100, Math.sqrt(r) * 260) + '%';
    if (cizgi) cizgi.style.left = Math.min(100, Math.sqrt(MK.esik) * 260) + '%';
    var c = D && D.calisma;
    if (!c || c.kip !== 'mikrofon') return;
    if (MK.durum === 'olcuyor') {
      MK.olcum.push(r);
      if (t - MK.basT >= 800) {
        var L = MK.olcum.slice().sort(function (a, b) { return a - b; }), g = L[Math.floor(L.length * 0.6)] || 0.003;
        MK.gurultu = g;
        MK.esik = Math.max(g * 3.2, g + 0.012, 0.015);
        MK.durum = 'bekliyor'; MK.bekT = t;
        mikCiz();
      }
      return;
    }
    if (MK.durum === 'bekliyor') {
      if (r > MK.esik) { if (!MK.ilkSes) MK.ilkSes = t; MK.sesSay++; } else { MK.sesSay = 0; MK.ilkSes = 0; }
      if (MK.sesSay >= 5) { MK.durum = 'okuyor'; MK.t0 = MK.ilkSes; MK.son = t; mikCiz(); }
      else if (t - MK.bekT > 15000) { calismaBirak(); MK.durum = 'hazir'; mikCiz(); bildir('Ses gelmedi — yüksek sesle oku ya da cihaza yaklaş'); }
      return;
    }
    if (MK.durum === 'okuyor') {
      if (r > MK.esik * 0.75) MK.son = t;
      if (t - MK.son >= 1300 || t - MK.t0 > 90000) mikBitti();
    }
  }
  function mikBitti(elle) {
    var c = D.calisma;
    if (!c || c.kip !== 'mikrofon' || !MK) return;
    var okudu = MK.durum === 'okuyor', sn = okudu ? ((elle ? simdi() : MK.son) - MK.t0) / 1000 : 0;
    calismaBirak();
    MK.durum = 'hazir'; mikCiz();
    if (!okudu) return;
    if (sn < 0.5) { bildir('Çok kısa — yeniden dene'); return; }
    sonucYap({ kip: 'mikrofon', sn: sn });
  }

  /* ===================================================================
     DEĞERLENDİRME VE KAYIT
     =================================================================== */
  function yildizSure(oran) { return oran <= 1.3 ? 3 : (oran <= 1.8 ? 2 : (oran <= 2.6 ? 1 : 0)); }
  function yildizBirlikte(h) { return h >= 1.25 ? 3 : (h >= 1 ? 2 : (h >= 0.75 ? 1 : 0)); }
  var ETIKET = ['Bir daha deneyelim', 'Gelişiyor', 'İyi gidiyor', 'Akıcı okuma!'];
  function sonucYap(r) {
    var o = secili();
    var ms = Ses.sure || tahminSure(o);
    r.i = o.id; r.z = Date.now(); r.ms = Math.round(ms * 100) / 100; r.mt = Ses.tahmini ? 1 : 0;
    if (r.kip === 'birlikte') r.y = yildizBirlikte(r.h);
    else {
      r.sn = Math.round(r.sn * 100) / 100;
      r.kdk = Math.round(o.n / r.sn * 60);
      r.o = Math.round(r.sn / ms * 100) / 100;
      r.y = yildizSure(r.o);
    }
    D.son = r;
    var nereye = kaydet(r);
    sonucGoster(r, false, nereye);
    listeCiz();
    gecmisCiz();
  }
  function sonucGoster(r, eski, nereye) {
    var yer = UI.panel.querySelector('.oh-sonuc-yer');
    if (!yer) return;
    var o = bul(r.i) || secili(), h;
    if (r.kip === 'birlikte') {
      h = '<span class="sayilar"><span>En yüksek hız: <b>' + (r.h ? hizYaz(r.h) : '—') + '</b></span></span>' +
        '<small>' + (r.h ? (r.h >= 1.5 ? 'Örnek sesten bile hızlı okuyabiliyor.' : 'Sonraki basamak: ' + hizYaz(MERDIVEN[Math.min(MERDIVEN.length - 1, MERDIVEN.indexOf(r.h) + 1)]) + '.') : 'En yavaş hızda bile zorlandı — önce «Süre tut» ile kendi hızında okusun.') + '</small>';
    } else {
      var hizli = r.o < 0.55;
      h = '<span class="sayilar"><span><b>' + ondalik(r.sn, 1) + '</b> sn</span><span><b>' + r.kdk + '</b> kelime/dk</span>' +
        '<span>Örnek: <b>' + ondalik(r.ms, 1) + '</b> sn' + (r.mt ? ' (tahmini)' : '') + '</span></span>' +
        '<small>' + (hizli ? 'Çok hızlı! Her kelimeyi okudu mu? ' : '') + 'Örnek okumanın ' + ondalik(r.o, 1) + ' katı sürede okudu' +
        (r.kip === 'mikrofon' ? ' (mikrofonla ölçüldü)' : '') + '.</small>';
    }
    var kim = D.kim ? esc(D.kim.ad) + ' adına kaydedildi' : (D.og ? 'Öğrenci seçilmedi — bu cihaza kaydedildi' : 'Bu cihaza kaydedildi');
    if (nereye === 'bekliyor') kim = esc(D.kim ? D.kim.ad : '') + ' — bağlantı yok, sonra kaydedilecek';
    yer.innerHTML = '<div class="oh-sonuc' + (eski ? ' eski' : '') + '">' +
      '<div class="oh-yildizlar" aria-label="' + r.y + ' yıldız">' + yildizlar(r.y) + '</div>' +
      '<div class="oh-sonuc-ic"><b class="etiket">' + ETIKET[r.y] + '</b>' + h + '<span class="oh-kaydedildi">' + kim + '</span></div>' +
      '<div class="oh-sonuc-t"><button type="button" class="oh-kucuk-t" data-is="yeniden">' + IK.basa + 'Tekrar dene</button>' +
      '<button type="button" class="oh-kucuk-t ana" data-is="sonraki">Sonraki okuma' + IK.ileri + '</button></div></div>';
  }

  /* --- kayıtlar: cihaz ya da öğrenci --- */
  function cihazKayit() { var k = yerelAl(K_KAYIT, null); return (k && Array.isArray(k.k)) ? k.k : []; }
  function ogrKayit(an) {
    var v = D.og && D.og.okuma && D.og.okuma[an];
    return (v && Array.isArray(v.k)) ? v.k : [];
  }
  function kayitlar() { return (D.og && D.kim) ? ogrKayit(D.kim.anahtar) : cihazKayit(); }
  function kaydet(r) {
    if (D.og && D.kim) {
      var an = D.kim.anahtar, ok = D.og.okuma = D.og.okuma || {};
      var g = ok[an] = ok[an] || { ad: D.kim.ad, s: D.kim.sinifId, sa: D.kim.sinifAd, k: [] };
      g.ad = D.kim.ad; g.s = D.kim.sinifId; g.sa = D.kim.sinifAd;
      g.k = (g.k || []).concat([r]).slice(-OGR_KAYIT_SINIR);
      return buluta(an, g);
    }
    var L = cihazKayit().concat([r]).slice(-CIHAZ_KAYIT_SINIR);
    yerelYaz(K_KAYIT, { v: 1, k: L });
    return 'cihaz';
  }
  function buluta(an, g) {
    var og = D.og;
    if (!og || !og.db || !og.uid) return 'bekliyor';
    var bek = yerelAl(K_BEKLEYEN, {}) || {};
    var veri = {}; veri[an] = g;
    bek[og.uid] = bek[og.uid] || {}; bek[og.uid][an] = g;
    yerelYaz(K_BEKLEYEN, bek);
    try {
      og.db.collection('kullanicilar').doc(og.uid).set({ okumaHiz: veri }, { merge: true }).then(function () {
        var b2 = yerelAl(K_BEKLEYEN, {}) || {};
        if (b2[og.uid] && b2[og.uid][an] && b2[og.uid][an].k.length === g.k.length) { delete b2[og.uid][an]; yerelYaz(K_BEKLEYEN, b2); }
      }).catch(function () { bildir('Sonuç şimdilik bu cihazda bekliyor; bağlantı gelince kaydedilecek'); });
    } catch (e) { return 'bekliyor'; }
    return 'bulut';
  }
  function bekleyenleriGonder() {
    var og = D && D.og;
    if (!og || !og.db) return;
    var bek = yerelAl(K_BEKLEYEN, {}) || {}, b = bek[og.uid];
    if (!b) return;
    Object.keys(b).forEach(function (an) {
      var g = b[an];
      if (!g || !Array.isArray(g.k)) return;
      og.okuma = og.okuma || {};
      var bulut = og.okuma[an], birlesik = (bulut && bulut.k) ? bulut.k.slice() : [];
      g.k.forEach(function (r) { if (!birlesik.some(function (x) { return x.z === r.z && x.i === r.i; })) birlesik.push(r); });
      birlesik.sort(function (a, c) { return a.z - c.z; });
      og.okuma[an] = { ad: g.ad, s: g.s, sa: g.sa, k: birlesik.slice(-OGR_KAYIT_SINIR) };
      buluta(an, og.okuma[an]);
    });
  }

  function gecmisCiz() {
    if (!UI) return;
    var o = secili(), L = kayitlar(), bu = L.filter(function (r) { return r.i === o.id; }).slice(-5).reverse();
    var tum = L.slice(-8).reverse();
    var kim = D.kim ? esc(D.kim.ad) + ' · ' + esc(D.kim.sinifAd) : (D.og ? 'Bu cihaz (öğrenci seçilmedi)' : 'Bu cihaz');
    var satir = function (r, adGoster) {
      var x = bul(r.i);
      return '<li><span class="k">' + KIP_AD[r.kip] + '</span>' +
        (adGoster && x ? '<span class="ar" lang="ar">' + esc(x.s.join(' ')) + '</span>' : '<span>' + tarihYaz(r.z) + '</span>') +
        '<span class="d">' + (r.kip === 'birlikte' ? (r.h ? hizYaz(r.h) : '—') : ondalik(r.sn, 1) + ' sn · ' + r.kdk + ' k/dk') + '</span>' +
        '<span class="yz">' + yildizlar(r.y) + '</span></li>';
    };
    UI.gecmis.innerHTML = '<h3>Bu okumanın sonuçları <small>' + kim + '</small></h3>' +
      (bu.length ? '<ol>' + bu.map(function (r) { return satir(r, false); }).join('') + '</ol>' : '<p class="bos">Henüz sonuç yok.</p>') +
      (tum.length ? '<h3 style="margin-top:12px">Son okumalar</h3><ol>' + tum.map(function (r) { return satir(r, true); }).join('') + '</ol>' : '');
  }

  /* ===================================================================
     ÖĞRETMEN: öğrenci seçimi, sınıf tablosu, ses listesi
     =================================================================== */
  function siniflariCoz(veri) {
    var d = null, L = [];
    try { d = veri && veri.userData ? (typeof veri.userData === 'string' ? JSON.parse(veri.userData) : veri.userData) : null; } catch (e) { d = null; }
    var lv = (d && d.levels) || {};
    Object.keys(lv).forEach(function (lid) {
      var l = lv[lid] || {}, C = l.classes || {};
      Object.keys(C).forEach(function (cid) {
        var c = C[cid] || {}, st = Array.isArray(c.students) ? c.students : [];
        if (c.demo || l.demo) return;
        L.push({ id: cid, ad: String(c.name || cid), seviye: String(l.name || ''), ogrenciler: st.map(function (s, i) {
          var ad = String((s && s.name) || ('Öğrenci ' + (i + 1))).trim();
          return { anahtar: cid + '~' + ((s && s.loginCode) || ad), ad: ad };
        }) });
      });
    });
    return L;
  }
  function ogretmen(o) {
    if (!o || !o.uid || !D) return;
    D.og = { uid: o.uid, isim: o.isim || '', rol: o.rol || 'teacher', db: o.db || null, okuma: (o.veri && o.veri.okumaHiz) || {}, siniflar: siniflariCoz(o.veri) };
    UI.kim.hidden = false; UI.tablo.hidden = false; UI.sesListe.hidden = false;
    var a = yerelAl(K_AYAR, {}) || {}, an = a.kim && a.kim[o.uid];
    if (an) {
      D.og.siniflar.some(function (c) { return c.ogrenciler.some(function (s) { if (s.anahtar === an) { D.kim = { anahtar: an, ad: s.ad, sinifId: c.id, sinifAd: c.ad }; return true; } return false; }); });
    }
    kimCiz();
    bekleyenleriGonder();
    listeCiz(); gecmisCiz();
  }
  function kimCiz() {
    if (!UI || !D.og) return;
    UI.kim.classList.toggle('dolu', !!D.kim);
    UI.kim.querySelector('span').textContent = D.kim ? D.kim.ad + ' · ' + D.kim.sinifAd : 'Öğrenci seç';
  }
  function pencere(baslik, ic, sinif) {
    pencereKapat();
    var p = document.createElement('div');
    p.className = 'oh-perde';
    p.innerHTML = '<div class="oh-pencere ' + (sinif || '') + '" role="dialog" aria-modal="true" aria-label="' + esc(baslik) + '">' +
      '<div class="oh-pencere-bas"><b>' + esc(baslik) + '</b><button type="button" class="oh-kapat" data-is="pKapat" aria-label="Kapat">' + IK.kapat + '</button></div>' + ic + '</div>';
    p.addEventListener('click', function (e) { if (e.target === p) pencereKapat(); });
    UI.kok.appendChild(p);
    UI.pencere = p;
    return p;
  }
  function pencereKapat() { if (UI && UI.pencere) { UI.pencere.remove(); UI.pencere = null; } }
  function sinifSirasi() {
    var L = (D.og && D.og.siniflar) || [], s = D.sinif;
    return L.slice().sort(function (a, b) {
      var x = (a.seviye.indexOf(s) === 0 || a.ad.indexOf(s) === 0) ? 0 : 1, y = (b.seviye.indexOf(s) === 0 || b.ad.indexOf(s) === 0) ? 0 : 1;
      return (x - y) || a.ad.localeCompare(b.ad, 'tr');
    });
  }
  function kimAc() {
    if (!D.og) return;
    var L = sinifSirasi(), ok = D.og.okuma || {};
    var ic = '<div class="oh-bilgi">Okumayı yapan öğrenciyi seç; sonuçlar onun adına senin hesabına kaydedilir. Öğrenci seçmezsen sonuç yalnız bu cihazda kalır.</div>' +
      '<div class="oh-ogrenciler" style="margin-bottom:10px"><button type="button" class="oh-ogr' + (!D.kim ? ' sec' : '') + '" data-is="kimSec" data-v="">Bu cihaz (öğrenci seçmeden)</button></div>';
    if (!L.length) ic += '<p class="oh-bilgi">Sınıf listen boş. Ana sayfada Sınıflarım\'dan sınıf ve öğrenci ekleyince burada görünür.</p>';
    L.forEach(function (c) {
      ic += '<div class="oh-sinif-grup"><b>' + esc(c.ad) + (c.seviye ? ' · ' + esc(c.seviye) : '') + '</b><div class="oh-ogrenciler">' +
        (c.ogrenciler.length ? c.ogrenciler.map(function (s) {
          var n = ok[s.anahtar] && ok[s.anahtar].k ? ok[s.anahtar].k.length : 0;
          return '<button type="button" class="oh-ogr' + (D.kim && D.kim.anahtar === s.anahtar ? ' sec' : '') + '" data-is="kimSec" data-v="' + esc(s.anahtar) + '">' + esc(s.ad) + (n ? '<i>' + n + '</i>' : '') + '</button>';
        }).join('') : '<span class="oh-bilgi" style="margin:0">Bu sınıfta öğrenci yok</span>') + '</div></div>';
    });
    pencere('Kimin okuması?', ic);
  }
  function kimSec(an) {
    D.kim = null;
    if (an && D.og) D.og.siniflar.some(function (c) { return c.ogrenciler.some(function (s) { if (s.anahtar === an) { D.kim = { anahtar: an, ad: s.ad, sinifId: c.id, sinifAd: c.ad }; return true; } return false; }); });
    pencereKapat(); kimCiz(); ayarYaz(); listeCiz(); gecmisCiz();
    D.son = null; var yer = UI.panel.querySelector('.oh-sonuc-yer'); if (yer) yer.innerHTML = '';
  }
  function tabloAc(cid) {
    if (!D.og) return;
    var L = sinifSirasi(), c = null;
    L.forEach(function (x) { if (x.id === cid) c = x; });
    c = c || L[0];
    var ok = D.og.okuma || {};
    var ic = '<div class="oh-sekme-sira">' + L.map(function (x) { return '<button type="button" class="oh-ogr' + (c && x.id === c.id ? ' sec' : '') + '" data-is="tabloSinif" data-v="' + esc(x.id) + '">' + esc(x.ad) + '</button>'; }).join('') + '</div>';
    if (!c) ic += '<p class="oh-bilgi">Sınıf listen boş.</p>';
    else {
      ic += '<table class="oh-tablo"><thead><tr><th>Öğrenci</th><th>Okuma</th><th>Son hız</th><th>Ortalama</th><th>En iyi</th><th>Sesle birlikte</th><th>Son</th></tr></thead><tbody>' +
        c.ogrenciler.map(function (s) {
          var k = (ok[s.anahtar] && ok[s.anahtar].k) || [], sure = k.filter(function (r) { return r.kip !== 'birlikte'; });
          var son = sure[sure.length - 1], ort = sure.length ? Math.round(sure.reduce(function (a, r) { return a + r.kdk; }, 0) / sure.length) : 0;
          var ey = k.reduce(function (a, r) { return Math.max(a, r.y); }, -1), bh = k.reduce(function (a, r) { return r.kip === 'birlikte' ? Math.max(a, r.h || 0) : a; }, 0);
          return '<tr><td>' + esc(s.ad) + '</td><td class="sayi">' + (k.length || '—') + '</td><td class="sayi">' + (son ? son.kdk + ' k/dk' : '—') + '</td>' +
            '<td class="sayi">' + (ort ? ort + ' k/dk' : '—') + '</td><td>' + (ey >= 0 ? '<span class="yz">' + yildizlar(ey) + '</span>' : '—') + '</td><td class="sayi">' + (bh ? hizYaz(bh) : '—') + '</td>' +
            '<td class="sayi">' + (k.length ? tarihYaz(k[k.length - 1].z) : '—') + '</td></tr>';
        }).join('') + '</tbody></table>';
      ic += '<p class="oh-not">k/dk: kelime/dakika (süre tut ve mikrofon). Her öğrencinin son ' + OGR_KAYIT_SINIR + ' okuması saklanır.</p>';
    }
    pencere('Sınıf tablosu' + (c ? ' · ' + c.ad : ''), ic, 'genis');
  }
  function sesListesiAc() {
    var S = window.OKUMA_HIZ_SES || {}, L = D.liste, varSay = L.filter(function (o) { return S[o.id]; }).length;
    var ic = '<div class="oh-bilgi">Her okuma için bir ses dosyası: <b>okumayazma/ses/okuma-hiz/' + D.sinif + '/</b> klasörüne aşağıdaki adla koy (mp3; m4a, wav, ogg da olur). ' +
      'Normal konuşma hızında, sondaki sessizlik kısa olsun. Sonra <b>sesler.py</b> listeyi yeniler. Bu sınıfta sesi olan: <b>' + varSay + ' / ' + L.length + '</b>.</div>' +
      '<div class="oh-sekme-sira">' + SINIFLAR.map(function (s) { return '<button type="button" class="oh-ogr' + (s === D.sinif ? ' sec' : '') + '" data-is="sesSinif" data-v="' + s + '">' + s + '. sınıf</button>'; }).join('') +
      '<button type="button" class="oh-kucuk-t" data-is="sesCsv">' + IK.kopya + 'Bu sınıfı kopyala (tablo)</button></div>' +
      '<table class="oh-tablo"><thead><tr><th>Dosya</th><th>Metin (TTS)</th><th>Türkçesi</th><th>Ses</th><th></th></tr></thead><tbody>' +
      L.map(function (o) {
        return '<tr><td class="sayi">' + o.id + '.mp3</td><td class="ar" lang="ar" style="text-align:right">' + esc(metin(o)) + '</td><td>' + esc(o.tr.join(' — ')) + '</td>' +
          '<td>' + (S[o.id] ? '<span class="var">var</span>' : '<span class="yok">yok</span>') + '</td>' +
          '<td><button type="button" class="oh-kucuk-t" data-is="sesKopya" data-v="' + o.id + '" title="Arapça metni kopyala">' + IK.kopya + '</button></td></tr>';
      }).join('') + '</tbody></table>';
    pencere('Ses listesi · ' + D.sinif + '. sınıf', ic, 'genis');
  }
  function kopyala(t) {
    var bitti = function () { bildir('Kopyalandı'); };
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(bitti, function () { eskiKopya(t); bitti(); }); return; } } catch (e) { }
    eskiKopya(t); bitti();
  }
  function eskiKopya(t) {
    var a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select();
    try { document.execCommand('copy'); } catch (e) { } a.remove();
  }

  /* --- bildirim --- */
  var _bz = 0;
  function bildir(t) {
    if (!UI) return;
    var b = UI.kok.querySelector('.oh-bildiri');
    if (!b) { b = document.createElement('div'); b.className = 'oh-bildiri'; b.setAttribute('role', 'status'); UI.kok.appendChild(b); }
    b.textContent = t; b.hidden = false;
    clearTimeout(_bz); _bz = setTimeout(function () { b.hidden = true; }, 2600);
  }

  /* ===================================================================
     OLAYLAR
     =================================================================== */
  function tikla(e) {
    var b = e.target.closest && e.target.closest('[data-is]');
    if (!b || !UI.kok.contains(b) || b.disabled) return;
    var is = b.getAttribute('data-is'), v = b.getAttribute('data-v');
    if (is === 'sinif') sinifSec(v);
    else if (is === 'oge') ogeSec(+b.getAttribute('data-i'));
    else if (is === 'onceki') ogeSec(D.i - 1);
    else if (is === 'sonraki') ogeSec(D.i + 1);
    else if (is === 'kip') kipSec(v);
    else if (is === 'tr') { D.tr = !D.tr; trUygula(); ayarYaz(); }
    else if (is === 'oynat') {
      if (D.calisma && D.calisma.kip !== 'birlikte') calismaBirak();
      if (Ses.caliyor) Ses.duraklat(); else if (Ses.durgun) Ses.devam(); else Ses.oynat(D.hiz);
    }
    else if (is === 'basa') { var cal = Ses.caliyor || Ses.durgun; Ses.durdur(); if (cal) Ses.oynat(D.hiz); }
    else if (is === 'hiz') {
      D.hiz = +v; ayarYaz(); arayuzSes();
      if (Ses.caliyor && Ses.tur === 'dosya' && Ses.el && !D.calisma) { try { Ses.el.playbackRate = D.hiz; } catch (x) { } Ses.hiz = D.hiz; }
      else if ((Ses.caliyor || Ses.durgun) && Ses.tur === 'tts' && !D.calisma) { Ses.durdur(); Ses.oynat(D.hiz); }
    }
    else if (is === 'dongu') { D.dongu = !D.dongu; ayarYaz(); arayuzSes(); }
    else if (is === 'basla') sureBasla();
    else if (is === 'bitti') sureBitti();
    else if (is === 'yeniden') {
      D.son = null; var yer = UI.panel.querySelector('.oh-sonuc-yer'); if (yer) yer.innerHTML = '';
      if (D.kip === 'sure') { var sy = UI.panel.querySelector('.oh-sayac'); if (sy) sy.textContent = '0:00,0'; }
      else if (D.kip === 'birlikte') { birlikteCiz(); [].forEach.call(UI.panel.querySelectorAll('.oh-basamak'), function (x) { x.className = 'oh-basamak'; }); }
    }
    else if (is === 'bBasla') birlikteBasla();
    else if (is === 'bEvet') birlikteCevap(true);
    else if (is === 'bHayir') birlikteCevap(false);
    else if (is === 'bTekrar') birlikteAdim();
    else if (is === 'bDur') { calismaBirak(); birlikteCiz(); }
    else if (is === 'mAc') mikAc();
    else if (is === 'mKapat') { mikKapat(); }
    else if (is === 'mBasla') mikBasla();
    else if (is === 'mDur') mikBitti(true);
    else if (is === 'kim') kimAc();
    else if (is === 'kimSec') kimSec(v);
    else if (is === 'tablo') tabloAc(D.kim ? D.kim.sinifId : '');
    else if (is === 'tabloSinif') tabloAc(v);
    else if (is === 'sesListe') sesListesiAc();
    else if (is === 'sesSinif') { sinifSec(v); sesListesiAc(); }
    else if (is === 'sesKopya') { var o = bul(v); if (o) kopyala(metin(o)); }
    else if (is === 'sesCsv') kopyala(['dosya\tmetin\ttürkçe'].concat(D.liste.map(function (o) { return o.id + '.mp3\t' + metin(o) + '\t' + o.tr.join(' — '); })).join('\n'));
    else if (is === 'pKapat') pencereKapat();
  }
  function tus(e) {
    if (!UI || !D) return;
    var h = e.target;
    if (h && /^(INPUT|TEXTAREA|SELECT)$/.test(h.tagName || '')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape') { if (UI.pencere) { pencereKapat(); e.preventDefault(); } else if (D.calisma) { calismaBirak(); panelCiz(); e.preventDefault(); } return; }
    if (UI.pencere) return;
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
      if (h && h.tagName === 'BUTTON' && e.key === 'Enter') return;          /* Enter düğmenin kendisini çalıştırsın */
      if (h && h.tagName === 'BUTTON' && h.blur) h.blur();                   /* boşluk odaktaki düğmeye ikinci kez basmasın */
      if (D.kip === 'sure') { e.preventDefault(); if (D.calisma) sureBitti(); else sureBasla(); }
      else if (D.kip === 'mikrofon' && D.calisma) { e.preventDefault(); mikBitti(true); }
      return;
    }
    if (D.calisma) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { ogeSec(D.i + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { ogeSec(D.i - 1); e.preventDefault(); }
  }

  /* dışarıdan durdurma (alfabe sekmesi değişince): ses, süre, mikrofon */
  function durdur() {
    if (!D) return;
    calismaBirak();
    Ses.durdur();
    mikKapat();
    if (UI) panelCiz();
  }

  window.KidefOkumaHiz = {
    kur: kur, ogretmen: ogretmen, durdur: durdur,
    /* deneme için */
    _d: function () {
      return D ? { sinif: D.sinif, i: D.i, id: secili() && secili().id, kip: D.kip, hiz: D.hiz, kim: D.kim, og: !!D.og, son: D.son,
                   ses: { tur: Ses.tur, sure: Ses.sure, tahmini: Ses.tahmini, caliyor: Ses.caliyor, oran: Ses.oran(), hiz: Ses.el ? Ses.el.playbackRate : Ses.hiz, hazir: Ses.el ? Ses.el.readyState : null }, mik: MK ? MK.durum : null,
                   calisma: D.calisma ? D.calisma.kip : null, okuma: D.og ? D.og.okuma : null } : null;
    },
    _kayitlar: function () { return kayitlar(); }
  };
})();
