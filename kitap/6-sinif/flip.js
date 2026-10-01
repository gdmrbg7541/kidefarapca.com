/* ============================================================
   Kidef Arapça — FLIPBOOK ÇEVİRME MOTORU (rtl seçeneği eklendi: Arapça 6)
   Bağımlılık yok. CSS 3D yaprak modeli.

   Fiziksel kitap modeli:
     yaprak i  ->  ön yüz = sayfa 2i+1 , arka yüz = sayfa 2i+2
     c yaprak çevrilmişse açık sayfalar: sol = 2c , sağ = 2c+1
       c=0 -> sağda yalnız sayfa 1 (kapak)
       c=1 -> sol 2, sağ 3   ...
   ============================================================ */
(function (kok) {
  'use strict';

  function Flip(kap, ayar) {
    this.kap = kap;
    this.toplam = ayar.toplam;                    // toplam sayfa
    this.oran = ayar.oran || 1.414;               // sayfa boy/en
    this.gorselYolu = ayar.gorselYolu;            // (no) => url
    this.kucukYolu = ayar.kucukYolu || null;      // (no) => url  düşük çözünürlük
    this.katmanKur = ayar.katmanKur || null;      // (sayfaNo, katmanEl) => void
    this.degisti = ayar.degisti || function () {};
    this.komsu = ayar.komsu == null ? 3 : ayar.komsu;   // önden/arkadan yüklenecek yaprak
    this.pencere = ayar.pencere == null ? 2 : ayar.pencere; // DOM'da tutulacak yaprak yarıçapı
    this.rtl = !!ayar.rtl;   // sağdan sola kitap: kap CSS ile aynalanır (scaleX(-1)), işaretçi hesabı da aynalanır

    this.yaprakSayisi = Math.ceil(this.toplam / 2);
    this.c = 0;                                   // çevrilmiş yaprak sayısı
    this.tekli = false;                           // dikey/mobil tek sayfa modu
    this.animasyonda = false;
    this.yapraklar = [];

    this._kur();
    this._olaylar();
    this.olcekle();
    this.git(1, true);
  }

  Flip.prototype._kur = function () {
    this.kitap = document.createElement('div');
    this.kitap.className = 'kitap';
    for (var i = 0; i < this.yaprakSayisi; i++) {
      var y = document.createElement('div');
      y.className = 'yaprak';
      y.dataset.i = i;
      y.appendChild(this._yuz('on', 2 * i + 1));
      y.appendChild(this._yuz('arka', 2 * i + 2));
      this.kitap.appendChild(y);
      this.yapraklar.push(y);
    }
    this.kap.appendChild(this.kitap);
  };

  Flip.prototype._yuz = function (sinif, no) {
    var f = document.createElement('div');
    f.className = 'yuz ' + sinif;
    f.dataset.sayfa = no;
    if (no > this.toplam) {
      var b = document.createElement('div');
      b.className = 'bos';
      b.textContent = '';
      f.appendChild(b);
      return f;
    }
    var img = document.createElement('img');
    img.alt = no + '. sayfa';
    img.decoding = 'async';
    f.appendChild(img);

    var k = document.createElement('div');
    k.className = 'katman';
    f.appendChild(k);

    var n = document.createElement('div');
    n.className = 'no';
    n.textContent = no;
    f.appendChild(n);
    return f;
  };

  /* ---------- görsel yükleme (tembel) ---------- */
  Flip.prototype._yukle = function (yuz) {
    if (!yuz || yuz.dataset.yuklu) return;
    var no = +yuz.dataset.sayfa;
    if (no > this.toplam) return;
    var img = yuz.querySelector('img');
    if (!img) return;
    yuz.dataset.yuklu = '1';
    var self = this;
    if (this.kucukYolu) {
      var kck = new Image();
      kck.onload = function () { if (!yuz.dataset.tamGeldi) img.src = kck.src; };
      kck.src = this.kucukYolu(no);          // önce bulanık küçük
    }
    var tam = new Image();
    tam.onload = function () {
      yuz.dataset.tamGeldi = '1';
      yuz.classList.remove('uretilmedi');
      img.src = tam.src;
    };
    tam.onerror = function () { yuz.classList.add('uretilmedi'); };
    tam.src = this.gorselYolu(no);
    if (this.katmanKur) this.katmanKur(no, yuz.querySelector('.katman'));
  };

  Flip.prototype._komsulariYukle = function () {
    var a = Math.max(0, this.c - this.komsu);
    var b = Math.min(this.yaprakSayisi - 1, this.c + this.komsu);
    for (var i = a; i <= b; i++) {
      var y = this.yapraklar[i];
      this._yukle(y.children[0]);
      this._yukle(y.children[1]);
    }
    this._gorunurluk();
  };

  /* Uzaktaki yaprakları DOM'dan düşür.
     231 sayfa = 116 yaprak = 232 adet backface-visibility'li 3B katman demek;
     hepsi birden canlıyken Chromium katmanları hatalı rasterize ediyor
     (solda yanlış sayfa / yarım boyanmış dikdörtgenler) ve bellek şişiyor.
     Görünür pencere dışındakiler zaten üsttekilerin altında kaldığı için
     gizlemek görüntüyü değiştirmez. */
  Flip.prototype._gorunurluk = function () {
    var a = Math.max(0, this.c - this.pencere);
    var b = Math.min(this.yaprakSayisi - 1, this.c + this.pencere);
    for (var i = 0; i < this.yaprakSayisi; i++) {
      this.yapraklar[i].style.display = (i >= a && i <= b) ? '' : 'none';
    }
  };

  /* ---------- z sırası ---------- */
  Flip.prototype._zSirala = function (ucan) {
    for (var i = 0; i < this.yaprakSayisi; i++) {
      var y = this.yapraklar[i];
      if (i === ucan) { y.style.zIndex = this.yaprakSayisi + 5; continue; }
      y.style.zIndex = (i < this.c) ? (i + 1) : (this.yaprakSayisi - i);
    }
  };

  /* ---------- boyutlandırma ---------- */
  Flip.prototype.olcekle = function () {
    // clientWidth/Height: yakınlaştırılmışken (kabın scale'i) ölçü şişmesin
    var W = this.kap.clientWidth, H = this.kap.clientHeight;
    if (!W || !H) return;
    var bosluk = 28;
    var oncekiTekli = this.tekli;
    this.tekli = W < H * 0.92;                 // dikey ekran -> tek sayfa
    var sayfaEn, sayfaBoy;
    if (this.tekli) {
      sayfaBoy = Math.min(H - bosluk, (W - bosluk) * this.oran);
      sayfaEn = sayfaBoy / this.oran;
    } else {
      sayfaBoy = Math.min(H - bosluk, ((W - bosluk) / 2) * this.oran);
      sayfaEn = sayfaBoy / this.oran;
    }
    this.sayfaEn = sayfaEn;
    // Kap HER ZAMAN iki sayfa genişliğinde kalır: .yaprak{left:50%;width:50%}
    // geometrisi buna dayanır. Tek sayfa modunda kabı daraltmak yaprakları
    // yarım genişliğe düşürür (sayfa şeride döner) — onun yerine kabı
    // kaydırıp aktif yarıyı ortalıyoruz.
    this.kitap.style.width = (sayfaEn * 2) + 'px';
    this.kitap.style.height = sayfaBoy + 'px';
    this.kitap.classList.toggle('tekli', this.tekli);
    this._tekliHiza();
    // ekran döndü (tek sayfa <-> çift sayfa): sayaç ve oklar yeni moda göre yazılsın
    if (oncekiTekli !== this.tekli && this._aktif) this._bildir();
  };

  Flip.prototype._tekliHiza = function () {
    if (!this.tekli) { this.kitap.style.transform = ''; return; }
    // Kap 2 sayfa geniş, sahne 1 sayfa geniş: kap taşar. Taşan bir grid
    // öğesini tarayıcı ortalamaz, sola yaslar ("safe" hizalama) — bu yüzden
    // yüzdelik kaydırma yanlış yere düşer. Kaydırmayı pikselle hesaplıyoruz.
    // offsetLeft: kabın kaydırmasız sol kenarı, tarayıcının düzende koyduğu yer
    // (taşanı sola yaslasa da ortalasa da doğru; transform ve zoom etkilemez)
    var en = this.sayfaEn || 0;
    var solda = this.c > 0 && this.aktif % 2 === 0;
    var kapSol = this.kitap.offsetLeft;
    var suanki = kapSol + (solda ? 0 : en);              // aktif yarının şu anki sol kenarı
    var hedef = (this.kap.clientWidth - en) / 2;         // ortalanmış hâli
    this.kitap.style.transform = 'translateX(' + Math.round(hedef - suanki) + 'px)';
  };

  /* ---------- gezinme ---------- */
  Object.defineProperty(Flip.prototype, 'aktif', {
    get: function () { return this._aktif || 1; },
    set: function (v) { this._aktif = v; }
  });

  Flip.prototype.solSayfa = function () { return this.c > 0 ? 2 * this.c : null; };
  Flip.prototype.sagSayfa = function () {
    var n = 2 * this.c + 1;
    return n <= this.toplam ? n : null;
  };

  /* Sağ sayfadan sonra sayfa var mı? Tek sayılı kitapta (231) son yaprağın
     arkası boştur: o yaprak çevrilmez ("232– / 231" diye boş sayfa açılmaz). */
  Flip.prototype._ilerisiVar = function () { return 2 * this.c + 1 < this.toplam; };

  /* TEK SAYFA MODU (dikey ekran / telefon): açık yayılımın iki yüzünden yalnız
     biri görünür, `aktif` hangisi olduğunu tutar (sol yüz çift, sağ yüz tek).
     Sağ yüzdeyken ileri = yaprağı çevir (arkası, yani sonraki çift sayfa açılır);
     sol yüzdeyken ileri = yaprak çevirmeden aynı yayılımın sağ yüzüne kay.
     Geri bunun tersi. Önceden ileri her seferinde bir yaprak çevirip gösterimi
     sağ yüze koyuyordu: telefonda çift sayfalar hiç görünmüyordu (1, 3, 5 …). */
  Flip.prototype._bildir = function () {
    var sol = this.solSayfa(), sag = this.sagSayfa();
    if (this.tekli) {
      var a = this._aktif;
      if (!a || (a !== sol && a !== sag)) this.aktif = sag || sol || 1;
    } else {
      this.aktif = sag || sol || 1;
    }
    this._tekliHiza();
    this.degisti({
      sol: sol, sag: sag,
      aktif: this.aktif, c: this.c, tekli: this.tekli,
      ilk: this.tekli ? this.aktif <= 1 : this.c === 0,
      son: this.tekli ? this.aktif >= this.toplam : !this._ilerisiVar()
    });
  };

  Flip.prototype.ileri = function () {
    if (this.animasyonda) return false;
    if (this.tekli) {
      var sol = this.solSayfa(), sag = this.sagSayfa();
      if (sol && this.aktif === sol && sag) { this.aktif = sag; this._bildir(); return true; }
      if (!this._ilerisiVar()) return false;
      this.aktif = 2 * this.c + 2;                 // çevrilecek yaprağın arka yüzü
    } else if (!this._ilerisiVar()) return false;
    var y = this.yapraklar[this.c];
    this._zSirala(this.c);
    this.c++;
    this._komsulariYukle();
    this._animasyon(y, true);
    return true;
  };

  Flip.prototype.geri = function () {
    if (this.animasyonda || this.c <= 0) return false;
    if (this.tekli) {
      var sol = this.solSayfa(), sag = this.sagSayfa();
      if (sag && this.aktif === sag && sol) { this.aktif = sol; this._bildir(); return true; }
      this.aktif = 2 * this.c - 1;                 // geri çevrilecek yaprağın ön yüzü
    }
    this.c--;
    var y = this.yapraklar[this.c];
    this._zSirala(this.c);
    this._komsulariYukle();
    this._animasyon(y, false);
    return true;
  };

  Flip.prototype._animasyon = function (y, ileri) {
    var self = this;
    this.animasyonda = true;
    y.classList.remove('suruklenen');
    y.style.transform = '';
    // reflow -> geçişin tetiklenmesi
    void y.offsetWidth;
    y.classList.toggle('cevrildi', ileri);
    var bitti = false;
    function son(ev) {
      // içerideki bir öğenin geçişi (ör. hotspot'un kenar rengi) kabarcıkla
      // buraya gelirse çevirme erken bitmiş sayılmasın
      if (ev && (ev.target !== y || ev.propertyName !== 'transform')) return;
      if (bitti) return; bitti = true;
      y.removeEventListener('transitionend', son);
      self.animasyonda = false;
      self._zSirala(-1);
      self._bildir();
    }
    y.addEventListener('transitionend', son);
    setTimeout(son, 900);   // güvenlik ağı
    this._bildir();
  };

  Flip.prototype.git = function (no, sessiz) {
    no = Math.max(1, Math.min(this.toplam, no | 0));
    var hedef = (no === 1) ? 0 : Math.floor(no / 2);
    this.aktif = no;                   // tek sayfa modunda açılacak yüz (çift sayfada _bildir düzeltir)
    if (hedef === this.c && !sessiz) { this._bildir(); return; }
    this.c = hedef;
    this.kitap.style.transition = 'none';   // atlarken kitap kaymasın, yerine otursun
    for (var i = 0; i < this.yaprakSayisi; i++) {
      var y = this.yapraklar[i];
      y.classList.remove('suruklenen');
      y.style.transform = '';
      y.style.transition = 'none';
      y.classList.toggle('cevrildi', i < this.c);
    }
    this._gorunurluk();
    void this.kitap.offsetWidth;
    for (var j = 0; j < this.yaprakSayisi; j++) this.yapraklar[j].style.transition = '';
    this._zSirala(-1);
    this._komsulariYukle();
    this._bildir();
    void this.kitap.offsetWidth;
    this.kitap.style.transition = '';
  };

  /* ---------- sürükleyerek çevirme ---------- */
  Flip.prototype._olaylar = function () {
    var self = this, s = null;

    function acilar(e) {
      var r = self.kitap.getBoundingClientRect();
      return { x: self.rtl ? r.right - e.clientX : e.clientX - r.left, y: e.clientY - r.top, r: r };
    }

    this.kitap.addEventListener('pointerdown', function (e) {
      if (self.animasyonda || self.kilitli) return;
      if (e.target.closest('.nokta')) return;      // hotspot'a dokunma
      if (self.tekli) {
        // TEK SAYFA: yaprak parmakla sürüklenmez, sayfa kaydırılır (kararı birak verir).
        // Başka bir parmak da inerse bu kıstırmadır (yakınlaştırma): kaydırma iptal.
        if (s && s.kaydirma && s.id !== e.pointerId) { s = null; return; }
        s = { kaydirma: true, id: e.pointerId, x0: e.clientX, y0: e.clientY };
        return;
      }
      var p = acilar(e);
      var ileri = p.x > p.r.width / 2;
      var i = ileri ? self.c : self.c - 1;
      if (i < 0 || i >= self.yaprakSayisi) return;
      if (ileri && !self._ilerisiVar()) return;    // tek sayılı kitapta son yaprağın arkası boş
      s = { i: i, ileri: ileri, x0: e.clientX, y: self.yapraklar[i], w: p.r.width / 2, tasi: false };
      self._zSirala(i);
    });

    window.addEventListener('pointermove', function (e) {
      if (!s || s.kaydirma) return;
      var dx = (e.clientX - s.x0) * (self.rtl ? -1 : 1);
      if (!s.tasi && Math.abs(dx) < 6) return;
      if (!s.tasi) { s.tasi = true; s.y.classList.add('suruklenen'); }
      var oran;
      if (s.ileri) oran = Math.min(1, Math.max(0, -dx / s.w));
      else oran = Math.min(1, Math.max(0, dx / s.w));
      var aci = s.ileri ? -180 * oran : -180 * (1 - oran);
      s.y.style.transform = 'rotateY(' + aci + 'deg)';
      s.oran = oran;
    });

    function birak(e) {
      if (!s) return;
      if (s.kaydirma) {
        if (e.pointerId !== s.id) return;
        var k = s; s = null;
        if (e.type !== 'pointerup' || self.kilitli) return;
        var dx = (e.clientX - k.x0) * (self.rtl ? -1 : 1), dy = e.clientY - k.y0;
        // yatay ve yeterince uzun kaydırma: sola = ileri, sağa = geri
        if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { if (dx < 0) self.ileri(); else self.geri(); }
        return;
      }
      var t = s;
      s = null;
      t.y.classList.remove('suruklenen');
      if (!t.tasi) { t.y.style.transform = ''; self._zSirala(-1); return; }
      if ((t.oran || 0) > 0.32) {
        if (t.ileri) { self.c = t.i + 1; self._animasyon(t.y, true); }
        else { self.c = t.i; self._animasyon(t.y, false); }
        self._komsulariYukle();
      } else {
        self._animasyon(t.y, !t.ileri ? true : false);
      }
    }
    window.addEventListener('pointerup', birak);
    window.addEventListener('pointercancel', birak);
  };

  kok.Flip = Flip;
})(window);
