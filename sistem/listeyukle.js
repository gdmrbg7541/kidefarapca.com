/* =====================================================================
   KIDEF · LİSTEDEN ÖĞRENCİ EKLE                    (sistem/listeyukle.js)
   ---------------------------------------------------------------------
                                                            01.11.2026
   Öğretmen: "listelerim kısmında bi özellik ekleyelim bi pdf word veya
   txt dosyasındaki sınıf ve öğrenci listesini sürükle bırakla siteye
   yükleyince bu listelerdeki öğrenci numaraları isim soyisimleri
   otomatik listelere eklesin ... meb in listelerini de aynı şekilde
   siteye rahatlıkla geçirebilelim, hatta birden fazla liste varsa ona
   göre sınıf da otomatik eklensin".

   NEREDE: Listelerim (#ll-root) açıkken dosya sayfanın neresine
   bırakılırsa bırakılsın perde açılır; anasayfadaki «Sınıflarım»da
   (gömülü okul penceresi) ve ayrı sekmedeki okul penceresinde yalnız
   onların üstüne bırakınca. Ayrıca açık sınıfın «Öğrenci Yönetimi»nde ve
   sınıf seçilmemişken boş ekranda «Dosya seç» tuşlu bırakma alanı
   (dokunmatik ekran / akıllı tahta için). Yalnız öğretmen; öğrenci yok.
   NE OKUR: PDF (sitedeki pdf.js 3.11.174 — kitap/kidef-arapca-2-baski/
   02_cekirdek/js/pdfjs; yüklenemezse cdnjs; isEvalSupported kapalı),
   Word .docx, .txt, .csv (UTF-8 / Windows Türkçesi), Excel .xlsx, e-Okul'un
   HTML biçimli .xls'i, .htm; aynı anda birden çok dosya. Eski ikili .doc /
   .xls, taranmış PDF okunmaz, nasıl kaydedileceği söylenir. Mac'te bozuk
   kaydedilmiş Türkçe (Ö→÷, Ğ→–, İ→ı …) onarılır.
   GİZLİLİK: dosya tarayıcıda okunur, hiçbir yere gönderilmez; listeye
   yalnız ad soyad ve okul numarası yazılır. T.C. kimlik no gibi 7 ve
   daha çok haneli sayılar okul numarası sayılmaz, saklanmaz.
   NASIL OKUR: satırlar çıkarılır (PDF'te aynı yükseklikteki yazılar,
   döndürülmüş yazılar atlanır; Word'de tablo satırları ve paragraflar).
   Sınıf başlıkları («5/A Sınıfı», «5. Sınıf / A Şubesi», tek başına
   «9A», Excel sayfa adı, dosya adı «5A Sınıf Listesi», «Sınıfı / Şubesi»
   sütunları) grupları ayırır; PDF'te bir sayfada tek sınıf başlığı varsa
   o sayfanın bütün öğrencileri o sınıfındır. Başlık satırı (Adı Soyadı ·
   Adı | Soyadı · Öğrenci No · S.No · Cinsiyeti · T.C. Kimlik No) varsa
   sütunlar ondan okunur; yoksa büyük harfle başlayan 2-6 sözcük ad, hemen
   önündeki 1-6 haneli sayı okul numarasıdır («1.» sıra numarası, «Sayfa
   30:» / «23:» etiket). Çizelgelerdeki başlıklar puanla elenir (numara,
   BÜYÜK HARF, yalnız adın bulunduğu satır). Aynı sınıfta yinelenen ad,
   aynı okul numaralı kısaltılmış ad («YIL.») bir kez alınır; 1, 2, 3 …
   diye giden sayılar sıra numarasıdır; iki sütunlu listede sıra korunur.
   ÖNİZLEME: sınıf sınıf öğrenciler; her grubun hedefi var olan bir sınıf
   ya da yeni sınıf (adı değiştirilebilir), adlar tek tek çıkarılabilir,
   «Adları düzelt» (AHMET YILMAZ → Ahmet Yılmaz), birden çok okul varsa
   okul seçimi. Tek sınıflı liste açık sınıfa bırakılırsa hedef o sınıftır
   (dosyadaki ad farklıysa uyarı). «Ekle»: eksik seviye ve sınıf kurulur
   (llSeviyeTaslak), öğrenciler giriş kodlarıyla eklenir (addSingleStudent
   biçimi, crypto ile); listede zaten olan (aynı ad ya da aynı okul no)
   yinelenmez, okul numarası boşsa dosyadakiyle doldurulur. Tek kayıt
   (save), sonra ilk sınıf açılır (okul penceresi açıksa o yenilenir).
   «Geri al» eklemeden önceki hâle döndürür.
   Girişsizken (llSaltGorunumMu) ve hesabın sınıfları buluttan inmeden
   (window._llBulutGeldi) ekleme yapılmaz — inen veri eklenenleri ezerdi.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefListeYukle) return;

  var PDFJS_YEREL = 'kitap/kidef-arapca-2-baski/02_cekirdek/js/pdfjs/';
  var PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  var EN_BUYUK = 30 * 1024 * 1024;
  var BUYUK = 'A-ZÇĞİÖŞÜÂÊÎÔÛÄËÏÉÈÀÑ';
  var KUCUK = 'a-zçğıöşüâêîôûäëïéèàñ';
  var HARF = BUYUK + KUCUK;
  var KELIME_RE = new RegExp('^[' + HARF + "](?:[" + HARF + "'’`\\-.]*[" + HARF + '.])?$');
  var HARF_G = new RegExp('[' + HARF + ']', 'g');

  function kd(k, tr) {
    try { if (window.KidefDil && KidefDil.metin) { var m = KidefDil.metin(k, tr); if (m != null) return m; } } catch (e) { }
    return tr;
  }
  function kac(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hata(kod, ek) { var e = new Error(kod); e.kod = kod; e.ek = ek; return e; }

  /* ------------------------------------------------------------------
     METİN YARDIMCILARI
     ------------------------------------------------------------------ */
  function nfk(s) {
    s = String(s == null ? '' : s);
    try { s = s.normalize('NFKC'); } catch (e) { }
    return s.replace(/[  -   　\t]/g, ' ').replace(/[​-‍⁠﻿­]/g, '');
  }
  function ust(s) { try { return String(s).toLocaleUpperCase('tr-TR'); } catch (e) { return String(s).replace(/i/g, 'İ').toUpperCase(); } }
  function alt(s) { try { return String(s).toLocaleLowerCase('tr-TR'); } catch (e) { return String(s).replace(/I/g, 'ı').replace(/İ/g, 'i').toLowerCase(); } }
  /* başlık / durak sözcüğü anahtarı: TÜRKÇE HARFSİZ BÜYÜK, yalnız harf-rakam */
  function anahtar(s) {
    return ust(nfk(s)).replace(/[İIÎÏ]/g, 'I').replace(/Ş/g, 'S').replace(/Ğ/g, 'G').replace(/[ÜÛ]/g, 'U')
      .replace(/[ÖÔ]/g, 'O').replace(/Ç/g, 'C').replace(/[ÂÄÀ]/g, 'A').replace(/[ÊËÉÈ]/g, 'E').replace(/Ñ/g, 'N')
      .replace(/[^A-Z0-9]+/g, ' ').trim();
  }
  function kume(s) { var o = {}; s.split(/\s+/).forEach(function (k) { if (k) o[k] = 1; }); return o; }
  /* Ad olamayacak sözcükler (başlıklar, çizelge yazıları). Ad da olabilen
     sözcükler (VELİ, CUMA, KASIM, EYLÜL, NİSAN, OCAK, PAZAR…) BİLEREK yok;
     yarıdan çoğu bu sözcüklerden olan satır ad sayılmaz («AHMET YAZILI» ad). */
  var DUR = kume('ADI SOYADI AD SOYAD ISIM ISMI SOYISIM SOYISMI OGRENCI OGRENCININ OGRENCILER OGRENCILERIN OGR NO NOSU ' +
    'NUMARA NUMARASI SIRA SINIF SINIFI SINIFLAR SINIFLARI SUBE SUBESI SUBELER LISTE LISTESI LISTELERI LISTESIDIR OKUL ' +
    'CINSIYET CINSIYETI ERKEK KIZ KADIN TOPLAM SAYFA TARIH TARIHI IMZA IMZASI ODEV ODEVI ODEVLER ODEVLERI PERFORMANS ' +
    'PROJE PROJESI YAZILI SOZLU ORTALAMA ORTALAMASI ORT NOT NOTU NOTLAR NOTLARI DERS DERSI DERSLER ARAPCA KITAP KITABI ' +
    'KONTROL KONTROLU DEFTER DEFTERI GOREV GOREVI ETKINLIK ETKINLIGI OGRETMEN OGRETMENI OGRETMENIN MUDUR MUDURU ' +
    'YARDIMCISI DONEM DONEMI YIL YILI EGITIM OGRETIM OGRETIMI GENEL TC KIMLIK ACIKLAMA ACIKLAMALAR DURUM DURUMU PUAN ' +
    'PUANI PUANLARI SONUC SONUCU GRUP GRUBU KURAN KERIM HAFTA HAFTALIK HAFTASI TAKIP TAKIBI CIZELGE CIZELGESI FORM ' +
    'FORMU BILGI BILGILERI BELGE BELGESI DOGUM YERI VELISI TELEFON TEL ADRES ADRESI EOKUL REHBER DANISMAN SEVIYE ' +
    'SEVIYESI UNITE UNITESI KONU KONUSU KONULAR SORU SORULAR CEVAP CEVAPLAR ANAHTAR ANAHTARI SUBAT MART MAYIS HAZIRAN ' +
    'AGUSTOS ARALIK PAZARTESI SALI CARSAMBA PERSEMBE CUMARTESI GELMEDI GELDI VAR YOK TAMAM EKSIK IZINLI RAPORLU ' +
    'DEVAMSIZ DEVAMSIZLIK OKUMA YAZMA KONUSMA DINLEME SOZLUK VEZIN TERCUME KELIME KELIMELER CUMLE CUMLELER METIN ' +
    'BECERI BECERILER KATILIM DAVRANIS IMAM HATIP KAYIT KAYITLI NAKIL TARAFINDAN VE ILE');
  /* Bunlardan biri geçen satır hiç ad sayılmaz (kurum adları) */
  var GUCLU = kume('MUDURLUGU MUDURLUK KAYMAKAMLIGI VALILIGI BAKANLIGI BASKANLIGI MUFTULUGU ORTAOKULU ILKOKULU ' +
    'ANAOKULU LISESI UNIVERSITESI FAKULTESI KURSU ORTAOKUL ILKOKUL CUMHURIYETI');
  var CINS = kume('ERKEK KIZ KADIN');

  function buyukMu(c) { return !!c && c !== alt(c) && c === ust(c); }
  function harfSay(w) { var m = String(w).match(HARF_G); return m ? m.length : 0; }
  function durMu(w) {
    var k = anahtar(w); if (!k) return false;
    var k2 = k.replace(/ /g, '');
    if (DUR[k2] || GUCLU[k2]) return true;
    var p = k.split(' ');
    return p.length > 1 && p.every(function (x) { return DUR[x] || GUCLU[x]; });
  }
  function gucluMu(w) { return !!GUCLU[anahtar(w).replace(/ /g, '')]; }
  function adGecerli(kel, ayar) {
    ayar = ayar || {};
    var n = kel.length;
    if (n < (ayar.tek ? 1 : 2) || n > 6) return false;
    var harf = 0, uzun = 0, dur = 0;
    for (var i = 0; i < n; i++) {
      var w = kel[i];
      if (!ayar.kucuk && !buyukMu(w.charAt(0))) return false;
      if (gucluMu(w)) return false;
      var h = harfSay(w), d = durMu(w);
      harf += h;
      if (d) dur++;
      else if (h >= 2) uzun++;               /* en az bir «gerçek» sözcük: «A Ödev» ad değil */
    }
    if (!uzun || harf < (n === 1 ? 3 : 4)) return false;
    if (n === 1 ? dur : dur * 2 > n) return false;
    return true;
  }
  function adAnahtar(ad) { return ust(nfk(ad)).replace(/[.\s]+/g, ' ').trim(); }

  /* Hücreyi parçala: sayi (72) · sira (1.) · kelime · diger */
  function parcala(metin, hucre) {
    var out = [];
    function ekle(p) {
      if (!p) return;
      var m;
      if (/^\d+$/.test(p)) { out.push({ t: p, tur: 'sayi', d: p, h: hucre }); return; }
      if ((m = p.match(/^(\d{1,4})[.)]$/))) { out.push({ t: p, tur: 'sira', d: m[1], h: hucre }); return; }
      if (/^\d{1,4}:$/.test(p)) { out.push({ t: p, tur: 'diger', h: hucre }); return; }      /* «23: Okuma Metni» — sayfa / madde etiketi */
      if (KELIME_RE.test(p)) { out.push({ t: p, tur: 'kelime', h: hucre }); return; }
      var q = p.replace(/^[(\[{«"'“‘*•·\-–—]+/, '').replace(/[)\]}»"'”’,;:*•·!?\-–—]+$/, '');
      if (q && q !== p) { ekle(q); return; }
      /* yapışık «1.AHMET», «72-AHMET» (tek harf değil: «5A», «9-A» sınıf adıdır) */
      if ((m = p.match(/^(\d{1,6})([.)\-]?)([^\d.)\-].*)$/)) && KELIME_RE.test(m[3]) && harfSay(m[3]) >= 2) {
        out.push({ t: m[1], tur: (m[2] === '.' || m[2] === ')') ? 'sira' : 'sayi', d: m[1], h: hucre });
        out.push({ t: m[3], tur: 'kelime', h: hucre });
        return;
      }
      out.push({ t: p, tur: 'diger', h: hucre });
    }
    nfk(metin).split(/\s+/).forEach(ekle);
    return out;
  }
  function hucreSafSozcuk(tok, h) {
    var n = 0;
    for (var i = 0; i < tok.length; i++) {
      if (tok[i].h !== h) continue;
      if (tok[i].tur !== 'kelime') return false;
      n++;
    }
    return n >= 1 && n <= 3;
  }
  /* Adın hemen önündeki sayı okul numarasıdır; noktalı sayı sıra numarası.
     7+ haneli sayı (T.C. kimlik, AÖL no) okul no değildir: bir öncekine bakılır. */
  function noBul(tok, i) {
    var p = tok[i - 1], r = { no: null };
    if (p && p.tur === 'diger' && /^[\-–—]$/.test(p.t) && tok[i - 2] && tok[i - 2].tur === 'sayi') { i--; p = tok[i - 1]; }   /* «505 - AHMET» */
    if (!p) return r;
    if (p.tur === 'sira') { r.sira = p.d; return r; }
    if (p.tur !== 'sayi') return r;
    var q = tok[i - 2];
    if (q && q.tur === 'kelime') return r;              /* «Sayfa 30: Okuma Metni» — sözcükten sonraki sayı okul no değil */
    if (p.d.length <= 6) { r.no = String(parseInt(p.d, 10)); return r; }
    if (q && q.tur === 'sayi' && q.d.length <= 6 && !(tok[i - 3] && tok[i - 3].tur === 'kelime')) r.no = String(parseInt(q.d, 10));
    else if (q && q.tur === 'sira') r.sira = q.d;
    return r;
  }
  /* «temiz» satır: adın dışında başka sözcük ya da harfli/rakamlı yazı yok (sayılar, +, /, ✓ olur) */
  function temizMi(tok, a, hepsi) {
    for (var i = 0; i < tok.length; i++) {
      if (i >= a.bas && i <= a.son) continue;
      var t = tok[i];
      if (hepsi.some(function (b) { return b !== a && i >= b.bas && i <= b.son && adAnahtar(b.ad) === adAnahtar(a.ad); })) continue;
      if (t.tur === 'sayi' || t.tur === 'sira') continue;
      if (t.tur === 'kelime') return false;
      if (/[0-9]/.test(t.t) && !sinifBul(t.t)) return false;
      if (/[^\s+\-\/*✓✔✗×!?.,;:()\[\]|_=~•·#%°'"`]/.test(t.t.replace(/[0-9]/g, '')) && !sinifBul(t.t)) return false;
    }
    return true;
  }
  /* Satırdaki ad adayları */
  function adaylar(tok, ayar) {
    ayar = ayar || {};
    var out = [], i = 0, n = tok.length;
    var bas = function (t) { return t.tur === 'kelime' && (ayar.kucuk || buyukMu(t.t.charAt(0))); };
    while (i < n) {
      if (!bas(tok[i])) { i++; continue; }
      var j = i, kel = [tok[i].t];
      while (j + 1 < n && bas(tok[j + 1])) {
        if (tok[j + 1].h !== tok[j].h && (kel.length !== 1 || !hucreSafSozcuk(tok, tok[j + 1].h))) break;
        j++; kel.push(tok[j].t);
        if (kel.length > 8) break;
      }
      var kk = kel.slice();
      while (kk.length > 1 && CINS[anahtar(kk[kk.length - 1])]) kk.pop();
      var tamam = adGecerli(kk, {});
      if (!tamam && (ayar.kucuk || ayar.tek) && adGecerli(kk, ayar) && sadeSatir(tok, i, j, kk)) tamam = true;
      if (tamam) {
        var r = noBul(tok, i);
        if (!r.no && ayar.sonNo && j + 2 === n && tok[j + 1].tur === 'sayi' && tok[j + 1].d.length <= 6) r.no = String(parseInt(tok[j + 1].d, 10));
        out.push({ ad: kk.join(' '), kel: kk, no: r.no, h: tok[i].h, bas: i, son: j, buyuk: kk.join(' ') === ust(kk.join(' ')) });
      }
      i = j + 1;
    }
    out.forEach(function (a) { a.temiz = ayar.kucuk ? sadeSatir(tok, a.bas, a.son, a.kel) || temizMi(tok, a, out) : temizMi(tok, a, out); });
    return out;
  }
  /* TXT'de «ahmet yılmaz» ya da tek sözcük «Ahmet»: satırda yalnız (sıra/no +) ad (+ no / sınıf) olmalı,
     en çok 4 sözcük, harf büyüklüğü tutarlı, durak sözcüğü yok */
  function sadeSatir(tok, i, j, kk) {
    for (var x = 0; x < tok.length; x++) {
      if (x >= i && x <= j) continue;
      var t = tok[x];
      if (x < i && (t.tur === 'sayi' || t.tur === 'sira')) continue;
      if (x === j + 1 && x === tok.length - 1 && (t.tur === 'sayi' || sinifBul(t.t))) continue;
      return false;
    }
    if (kk.length > 4 || kk.some(durMu)) return false;
    var b = kk.filter(function (w) { return buyukMu(w.charAt(0)); }).length;
    return b === 0 || b === kk.length;
  }

  /* ------------------------------------------------------------------
     SINIF BAŞLIĞI
     ------------------------------------------------------------------ */
  var UB = 'A-ZÇĞİÖŞÜ';
  var RE_SUBE1 = new RegExp('(?:^|[^0-9])(\\d{1,2})\\s*\\.?\\s*(?:SINIF(?:I|LAR)?)?\\s*[\\/\\-]?\\s*([' + UB + '])\\s*-?\\s*ŞUBE(?:Sİ|SI)?(?![' + UB + '])');
  var RE_SUBE2 = new RegExp('SINIF(?:I)?\\s*:?\\s*(\\d{1,2})\\s*\\.?\\s*(?:SINIF)?[^' + UB + '0-9]{0,6}ŞUBE(?:Sİ|SI)?\\s*:?\\s*([' + UB + '])(?![' + UB + '])');
  var RE_AYRAC = new RegExp('(?:^|[^0-9' + UB + '])(\\d{1,2})\\s*[\\/\\-]\\s*([' + UB + '])(?![' + UB + '0-9])');
  var RE_TEK = new RegExp('^[^0-9' + UB + ']*(\\d{1,2})\\s*\\.?\\s*([' + UB + '])\\s*(?:SINIFI?|ŞUBESİ?|LİSTESİ|SINIF LİSTESİ|ÖĞRENCİ LİSTESİ)?[^0-9' + UB + ']*$');
  var RE_BITISIK = new RegExp('^(\\d{1,2})([' + UB + '])(?=[' + UB + '][a-zçğıöşü])');
  var RE_BAS = new RegExp('^(\\d{1,2})\\s*[\\/\\-.]?\\s*([' + UB + '])\\s+\\S');
  var RE_DOSYA = new RegExp('^\\s*(\\d{1,2})\\s*[\\/\\-._]?\\s*([' + UB + '])(?![' + UB + '0-9])');
  function sinifBul(metin, ayar) {
    ayar = ayar || {};
    var ham = nfk(metin).replace(/\s+/g, ' ').trim();
    if (!ham || ham.length > 260) return null;
    var u = ust(ham), m = null;
    m = u.match(RE_SUBE1) || u.match(RE_SUBE2) || u.match(RE_AYRAC);
    if (!m && ham.length <= 90) m = u.match(RE_TEK) || ham.match(RE_BITISIK) || (ayar.bas ? u.match(RE_BAS) : null) || (ayar.dosya ? u.match(RE_DOSYA) : null);
    if (!m) return null;
    var n = parseInt(m[1], 10);
    if (!(n >= 1 && n <= 12)) return null;
    return { no: n, sube: m[2], ad: n + m[2] };
  }

  /* ------------------------------------------------------------------
     SÜTUN BAŞLIKLARI
     ------------------------------------------------------------------ */
  var S_ADSOYAD = /^(OGRENCI(NIN)? |OGR )?(AD|ADI|ISIM|ISMI)( VE)? (SOYAD|SOYADI|SOYISIM|SOYISMI)$/;
  var S_AD = /^(OGRENCI(NIN)? |OGR )?(AD|ADI|ISIM|ISMI)$/;
  var S_SOYAD = /^(SOYAD|SOYADI|SOYISIM|SOYISMI)$/;
  var S_TC = /^(T ?C|TC)( KIMLIK)?( NO| NUMARASI)?$|KIMLIK/;
  var S_SIRA = /^(S|SN|S NO|SIRA|SIRA NO|SIRA NUMARASI|NO SIRA)$/;
  var S_NO = /^((OGRENCI|OGR|OKUL)( NO| NOSU| NUMARA| NUMARASI)|NO|NOSU|NUMARA|NUMARASI)$/;
  var S_CINS = /^CINSIYET(I)?$/;
  var S_SINIF = /^(SINIF|SINIFI|SINIF SEVIYESI|SEVIYE|SEVIYESI|SINIF SUBE|SINIFI SUBESI|SINIF VE SUBE|SINIF SUBESI|SINIFI VE SUBESI)$/;
  var S_SUBE = /^(SUBE|SUBESI|SUBE ADI)$/;
  function sutunBul(hucreler) {
    var s = { adsoyad: -1, ad: -1, soyad: -1, no: -1, sira: -1, tc: -1, cins: -1, sinif: -1, sube: -1 };
    hucreler.forEach(function (h, i) {
      var k = anahtar(h.t);
      if (!k || k.length > 40) return;
      if (S_ADSOYAD.test(k)) s.adsoyad = i;
      else if (S_AD.test(k)) s.ad = i;
      else if (S_SOYAD.test(k)) s.soyad = i;
      else if (S_TC.test(k)) s.tc = i;
      else if (S_SIRA.test(k)) s.sira = i;
      else if (S_NO.test(k)) s.no = i;
      else if (S_CINS.test(k)) s.cins = i;
      else if (S_SINIF.test(k)) s.sinif = i;
      else if (S_SUBE.test(k)) s.sube = i;
    });
    if (s.adsoyad < 0 && s.ad < 0) return null;
    s.hucreler = hucreler;
    return s;
  }
  /* Satırı başlık sütunlarına böl: PDF'te öğeler x'e göre, öbürlerinde sütun sırasıyla */
  function sutunlaraBol(satir, s) {
    var bas = s.hucreler, out = [];
    for (var i = 0; i < bas.length; i++) out.push([]);
    if (satir.og && bas[0] && bas[0].x0 != null) {
      var sinir = [];
      for (var b = 0; b < bas.length - 1; b++) sinir.push((bas[b].x1 + bas[b + 1].x0) / 2);
      satir.og.forEach(function (o) {
        var orta = (o.x0 + o.x1) / 2, j = 0;
        while (j < sinir.length && orta >= sinir[j]) j++;
        out[j].push(o.t);
      });
    } else {
      var yer = {};
      bas.forEach(function (h, i) { yer[h.col] = i; });
      satir.h.forEach(function (h) {
        var j = yer[h.col];
        if (j == null) {                  /* birleşik hücre: soldaki en yakın başlığa */
          var en = -1;
          bas.forEach(function (bh, i) { if (bh.col <= h.col && (en < 0 || bh.col > bas[en].col)) en = i; });
          j = en;
        }
        if (j >= 0) out[j].push(h.t);
      });
    }
    return out.map(function (a) { return a.join(' ').replace(/\s+/g, ' ').trim(); });
  }
  function sutunlaCikar(satir, s, ayar) {
    var c = sutunlaraBol(satir, s);
    var adMetin = s.adsoyad >= 0 ? c[s.adsoyad] : (c[s.ad] + (s.soyad >= 0 ? ' ' + c[s.soyad] : ''));
    if (!adMetin || !adMetin.trim()) return [];
    var tok = parcala(adMetin, 0);
    var a = adaylar(tok, { kucuk: ayar.kucuk, tek: s.adsoyad < 0 && s.soyad < 0 && ayar.tek });
    if (!a.length) return [];
    var o = a[0];
    var no = null;
    if (s.no >= 0) {
      var nm = (c[s.no] || '').replace(/\s/g, '').match(/^(\d{1,6})$/);
      if (nm) no = String(parseInt(nm[1], 10));
    } else if (o.no) no = o.no;
    else {
      /* «No» sütunu tanınmadıysa (iki satıra bölünmüş başlık): adın solundaki en yakın sayı */
      var sol = s.adsoyad >= 0 ? s.adsoyad : s.ad;
      for (var i = sol - 1; i >= 0 && !no; i--) {
        if (i === s.sira || i === s.tc || i === s.cins) continue;
        var m = (c[i] || '').replace(/\s/g, '').match(/^(\d{1,6})$/);
        if (m) no = String(parseInt(m[1], 10));
      }
    }
    if ((s.no >= 0 || s.sira >= 0) && !no && !/\d/.test(c[s.sira] || '')) return [];   /* imza / alt bilgi satırı */
    /* sınıf sütunu: «5-A» tek sütunda ya da «Sınıfı» 5 · «Şubesi» A ayrı */
    var sinif = null;
    if (s.sinif >= 0 || s.sube >= 0) {
      var sv = s.sinif >= 0 ? (c[s.sinif] || '') : '', bv = s.sube >= 0 ? (c[s.sube] || '') : '';
      sinif = sinifBul((sv + ' ' + bv).trim(), { bas: true }) || (bv && sinifBul(bv, { bas: true })) || (sv && sinifBul(sv, { bas: true })) || null;
      if (!sinif && sv && bv) {
        var nm = sv.match(/(\d{1,2})/), lm = ust(nfk(bv)).replace(/ŞUBESİ?|ŞUBE/g, '').trim().match(/^([A-ZÇĞİÖŞÜ])$/);
        if (nm && lm && +nm[1] >= 1 && +nm[1] <= 12) sinif = { no: +nm[1], sube: lm[1], ad: +nm[1] + lm[1] };
      }
    }
    return [{ ad: o.ad, kel: o.kel, no: no, kesin: true, sinif: sinif }];
  }

  /* ------------------------------------------------------------------
     BELGEYİ ÇÖZ → sınıf grupları
     belge = { tur: 'pdf'|'docx'|'tablo'|'txt', ad?, satirlar: [{ h: [{t, col?, x0?, x1?}], og?, sayfa? }] }
     ------------------------------------------------------------------ */
  function satirMetni(r) { return r.h.map(function (h) { return h.t; }).join(' '); }
  function satirIncele(r, ayar) {
    var bilgi = { tok: [], adaylar: [], sinif: null, sutun: null, sinifHucre: null };
    /* 1) sütun başlıkları (Adı Soyadı …): başlık satırı */
    var sut = sutunBul(r.h);
    if (sut) { bilgi.sutun = sut; return bilgi; }
    var tok = [];
    r.h.forEach(function (h, i) { tok.push.apply(tok, parcala(h.t, i)); });
    bilgi.tok = tok;
    var ad = adaylar(tok, ayar);
    /* bir satırda 2'den çok FARKLI ad: öğrenci satırı değil (başlık / açıklama satırı). İki sütunlu listede 2 olur. */
    var farkli = {};
    ad.forEach(function (a) { farkli[adAnahtar(a.ad)] = 1; });
    if (Object.keys(farkli).length > 2) ad = [];
    /* 2) sınıf başlığı: satırda numaralı öğrenci yoksa */
    if (!ad.some(function (a) { return a.no; })) {
      for (var i = 0; i < r.h.length && !bilgi.sinif; i++) bilgi.sinif = sinifBul(r.h[i].t, { bas: i === 0 });
      if (!bilgi.sinif && r.h.length > 1) bilgi.sinif = sinifBul(satirMetni(r));
      if (bilgi.sinif) return bilgi;
    }
    /* 3) öğrenci adayları; ad hücresi dışındaki tek başına «5A» sınıf sütunudur */
    bilgi.adaylar = ad;
    if (ad.length) {
      r.h.forEach(function (h, j) {
        if (j === ad[0].h || bilgi.sinifHucre) return;
        var t = nfk(h.t).trim(), u = ust(t);
        if (t.length <= 12 && (RE_TEK.test(u) || RE_AYRAC.test(u))) bilgi.sinifHucre = sinifBul(t);
      });
      if (!bilgi.sinifHucre && ayar.sonSinif && ad.length === 1) {
        var son = tok[tok.length - 1];
        if (son && son.tur === 'diger' && tok.length - 1 === ad[0].son + 1) bilgi.sinifHucre = sinifBul(son.t);
      }
    }
    return bilgi;
  }
  /* BOZUK KODLAMA ONARIMI: Windows Türkçesiyle (cp1254) yazılmış metin Mac Türkçesiyle açılıp kaydedilmiş
     (Ö→÷, Ğ→–, İ→ı, Ü→İ, Ç→«, ı→˝ …). Yalnız bu imza açıkça görülünce (harf yanında ÷ « ˝ ˆ ˛ ¸ en az 3 kez) onarılır. */
  var MAC_TR = { '«': 'Ç', '–': 'Ğ', 'ı': 'İ', '÷': 'Ö', 'İ': 'Ü', 'Á': 'ç', '\uF8FF': 'ğ', '˝': 'ı', 'ˆ': 'ö', '˛': 'ş', '¸': 'ü' };
  function kodlamaOnar(belge) {
    var metin = belge.satirlar.map(satirMetni).join('\n');
    var imza = (metin.match(new RegExp('[' + HARF + '][÷«˝ˆ˛¸\uF8FF]|[÷«˝ˆ˛¸\uF8FF][' + HARF + ']', 'g')) || []).length +
      (metin.match(/[A-ZÇĞİÖŞÜ]ı[A-ZÇĞİÖŞÜ]|(?:^|[^A-Za-zÇĞİÖŞÜçğıöşü])ı[A-ZÇĞİÖŞÜ]{2}|[A-ZÇĞİÖŞÜ]–[A-ZÇĞİÖŞÜ]/g) || []).length;   /* «DEMıR», «ıSMAıL», «O–UZ» */
    if (imza < 3) return;
    var onar = function (t) { return String(t).replace(/[«–ı÷İÁ\uF8FF˝ˆ˛¸]/g, function (c) { return MAC_TR[c] || c; }); };
    belge.satirlar.forEach(function (r) {
      r.h.forEach(function (h) { h.t = onar(h.t); });
      if (r.og) r.og.forEach(function (o) { o.t = onar(o.t); });
    });
    if (belge.ad) belge.ad = onar(belge.ad);
  }
  function belgeCoz(belge, dosyaSinifi) {
    if (belge.tur !== 'pdf') kodlamaOnar(belge);
    var ayar = { kucuk: belge.tur === 'txt', tek: belge.tur === 'txt', sonNo: belge.tur === 'txt', sonSinif: belge.tur === 'txt' };
    var gruplar = [], harita = {};
    function grup(s) {
      var k = s ? s.ad : '';
      if (!harita[k]) { harita[k] = { anahtar: k, sinif: s || null, ogr: [], adh: {} }; gruplar.push(harita[k]); }
      return harita[k];
    }
    var bilgi = belge.satirlar.map(function (r) { return satirIncele(r, ayar); });
    /* PDF: sayfada tek sınıf başlığı varsa sayfanın hepsi o sınıfın */
    var sayfaSinif = {};
    if (belge.tur === 'pdf') {
      var gor = {};
      bilgi.forEach(function (b, i) {
        var p = belge.satirlar[i].sayfa;
        if (b.sinif) { (gor[p] = gor[p] || {})[b.sinif.ad] = b.sinif; }
      });
      Object.keys(gor).forEach(function (p) { var k = Object.keys(gor[p]); if (k.length === 1) sayfaSinif[p] = gor[p][k[0]]; });
    }
    var akt = belge.sinif || null, sutun = null, sonSayfa = null, sag = [];
    function ekle(o, g) {
      var k = adAnahtar(o.ad);
      var var_ = g.adh[k];
      if (var_) { if (!var_.no && o.no) var_.no = o.no; return; }
      var kayit = { ad: o.ad, no: o.no || null, kesin: !!o.kesin, buyuk: !!o.buyuk, temiz: !!o.temiz };
      g.adh[k] = kayit;
      g.ogr.push(kayit);
    }
    function sagBosalt() { sag.forEach(function (x) { ekle(x[0], x[1]); }); sag = []; }
    bilgi.forEach(function (b, i) {
      var r = belge.satirlar[i];
      if (r.sayfa !== sonSayfa) { sagBosalt(); sonSayfa = r.sayfa; if (sayfaSinif[r.sayfa]) akt = sayfaSinif[r.sayfa]; }
      if (b.sinif) { sagBosalt(); akt = b.sinif; return; }
      if (b.sutun) { sagBosalt(); sutun = b.sutun; return; }
      var liste = sutun ? sutunlaCikar(r, sutun, ayar) : b.adaylar;
      if (!liste.length && sutun && b.adaylar.length && !(sutun.no >= 0 || sutun.sira >= 0)) liste = b.adaylar;
      var simdi = (r.sayfa != null && sayfaSinif[r.sayfa]) || akt || dosyaSinifi || null;
      var ilk = liste.length ? adAnahtar(liste[0].ad) : '';
      liste.forEach(function (o, j) {
        var g = grup(o.sinif || b.sinifHucre || simdi);
        if (j > 0 && adAnahtar(o.ad) !== ilk) sag.push([o, g]);       /* iki sütunlu liste: sağdaki ad sonra */
        else ekle(o, g);
      });
    });
    sagBosalt();
    gruplar.forEach(sonIsle);
    var bilinmez = harita[''];
    if (bilinmez && bilinmez.ogr.length) {
      var en = null, enSay = 0;
      gruplar.forEach(function (g) {
        if (g === bilinmez || !g.sinif) return;
        var k = {}; g.ogr.forEach(function (x) { k[adAnahtar(x.ad)] = 1; });
        var say = bilinmez.ogr.filter(function (x) { return k[adAnahtar(x.ad)]; }).length;
        if (say > enSay) { en = g; enSay = say; }
      });
      if (en && enSay >= bilinmez.ogr.length * 0.8) {
        var k2 = {}; en.ogr.forEach(function (x) { k2[adAnahtar(x.ad)] = x; });
        bilinmez.ogr.forEach(function (x) { var v = k2[adAnahtar(x.ad)]; if (!v) en.ogr.push(x); else if (!v.no && x.no) v.no = x.no; });
        bilinmez.ogr = [];
      }
    }
    return gruplar.filter(function (g) { return g.ogr.length; });
  }
  function sozcukler(ad) { return ust(nfk(ad)).split(/\s+/).filter(Boolean); }
  /* kısaltma uyumu: «YIL.» ~ «YILMAZ», «M.» ~ «MEHMET» */
  function kisaUyar(x, y) {
    var xa = x.replace(/\.$/, ''), ya = y.replace(/\.$/, '');
    if (xa === ya) return true;
    return (/\.$/.test(x) && xa.length && ya.indexOf(xa) === 0) || (/\.$/.test(y) && ya.length && xa.indexOf(ya) === 0);
  }
  function ilkUyar(a, b) { var x = sozcukler(a), y = sozcukler(b); return !!(x.length && y.length && kisaUyar(x[0], y[0])); }
  function ayniKisi(a, b) {
    var x = sozcukler(a), y = sozcukler(b);
    return !!(x.length && y.length && kisaUyar(x[0], y[0]) && kisaUyar(x[x.length - 1], y[y.length - 1]));
  }
  function adPuani(ad) { var w = sozcukler(ad); return harfSay(ad) * 10 - w.filter(function (x) { return /\.$/.test(x); }).length * 25 + w.length; }
  function sonIsle(g) {
    var o = g.ogr;
    /* sezgisel adaylar: numara 2, BÜYÜK HARF 1, temiz satır 1 puan; belgenin çoğu temiz satırsa 1 puan yeter
       (çizelgelerdeki «Okuma Metni», «Harfler Ünitesi» gibi başlıklar elenir) */
    var sez = o.filter(function (x) { return !x.kesin; });
    if (sez.length) {
      var temiz = sez.filter(function (x) { return x.temiz; }).length;
      var esik = temiz >= sez.length * 0.7 ? 1 : 2;
      g.ogr = o = o.filter(function (x) { return x.kesin || ((x.no ? 2 : 0) + (x.buyuk ? 1 : 0) + (x.temiz ? 1 : 0)) >= esik; });
    }
    /* 1, 2, 3 … diye giden sayılar sıra numarasıdır */
    var nolu = o.filter(function (x) { return x.no; });
    if (nolu.length >= 3) {
      var sira = 0;
      nolu.forEach(function (x, i) { if (parseInt(x.no, 10) === i + 1) sira++; });
      if (sira >= nolu.length * 0.9) nolu.forEach(function (x) { x.no = null; });
    }
    /* aynı okul numarası: aynı öğrenci (çizelgede kısaltılmış ad) — adı daha tam olan kalır; ad başka ise ikincinin numarası düşer */
    var nh = {}, at = [];
    o.forEach(function (x) {
      if (!x.no) return;
      var v = nh[x.no];
      if (!v) { nh[x.no] = x; return; }
      if (ilkUyar(v.ad, x.ad)) { if (adPuani(x.ad) > adPuani(v.ad)) v.ad = x.ad; v.kesin = v.kesin || x.kesin; at.push(x); }
      else x.no = null;
    });
    if (at.length) g.ogr = o = o.filter(function (x) { return at.indexOf(x) < 0; });
    /* numarasız ad numaralı bir adla aynı kişiyse (ilk ve son sözcük, kısaltma) düşer */
    var nolular = o.filter(function (x) { return x.no; });
    if (nolular.length) {
      g.ogr = o = o.filter(function (x) { return x.no || !nolular.some(function (y) { return ayniKisi(x.ad, y.ad); }); });
    }
    /* sezgisel satırlarda: çoğu numaralıysa numarasız aday gürültüdür (imza, alt bilgi, oturma planı) */
    nolu = o.filter(function (x) { return x.no; });
    if (nolu.length >= 3 && nolu.length >= o.length * 0.6) {
      g.ogr = o = o.filter(function (x) { return x.no || x.kesin; });
    }
    /* sondaki tek harfli cinsiyet (E / K) */
    var ek = o.filter(function (x) { return / [EK]$/.test(x.ad); }).length;
    if (o.length >= 3 && ek >= o.length * 0.6) {
      o.forEach(function (x) { if (/ [EK]$/.test(x.ad) && x.ad.split(' ').length > 2) x.ad = x.ad.slice(0, -2); });
    }
    o.forEach(function (x) { delete x.buyuk; delete x.temiz; });
    delete g.adh;
  }
  /* Bütün dosyaların grupları: aynı sınıf birleşir; sınıfı belirsiz grup dosya başına ayrı kalır */
  function coz(dosyalar) {
    var son = [], harita = {};
    dosyalar.forEach(function (d) {
      var dosyaSinifi = sinifBul(String(d.ad || '').replace(/\.[^.]+$/, ''), { dosya: true });
      (d.belgeler || []).forEach(function (b) {
        var bs = b.ad ? sinifBul(b.ad, { dosya: true }) : null;
        if (bs) b.sinif = bs;
        belgeCoz(b, bs ? null : dosyaSinifi).forEach(function (g) {
          var k = g.anahtar ? 'S:' + g.anahtar : 'D:' + d.ad + (b.ad ? ' · ' + b.ad : '');
          var h = harita[k];
          if (!h) {
            h = harita[k] = { anahtar: g.anahtar, sinif: g.sinif, ogr: [], dosyalar: [], etiket: g.anahtar || String(d.ad || '').replace(/\.[^.]+$/, '') };
            son.push(h);
          }
          if (h.dosyalar.indexOf(d.ad) < 0) h.dosyalar.push(d.ad);
          var adh = {};
          h.ogr.forEach(function (x) { adh[adAnahtar(x.ad)] = x; });
          g.ogr.forEach(function (x) {
            var v = adh[adAnahtar(x.ad)];
            if (v) { if (!v.no && x.no) v.no = x.no; return; }
            adh[adAnahtar(x.ad)] = x; h.ogr.push(x);
          });
        });
      });
    });
    son.sort(function (a, b) {
      if (!a.sinif || !b.sinif) return (a.sinif ? 0 : 1) - (b.sinif ? 0 : 1);
      return (a.sinif.no - b.sinif.no) || (a.sinif.sube < b.sinif.sube ? -1 : a.sinif.sube > b.sinif.sube ? 1 : 0);
    });
    return son;
  }
  function adDuzelt(ad) {
    ad = String(ad || '');
    if (ad !== ust(ad) && ad !== alt(ad)) return ad;     /* «Ahmet Yılmaz» gibi karışık yazılmış: dokunma */
    return ad.split(' ').map(function (w) {
      return w.split(/([\-'’.])/).map(function (p) { return p.length > 0 && /[^\-'’.]/.test(p) ? ust(p.charAt(0)) + alt(p.slice(1)) : p; }).join('');
    }).join(' ');
  }

  /* ------------------------------------------------------------------
     DOSYA OKUYUCULAR
     ------------------------------------------------------------------ */
  function betikYukle(src) {
    return new Promise(function (ok, red) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = function () { ok(); };
      s.onerror = function () { try { s.parentNode.removeChild(s); } catch (e) { } red(hata('betik', src)); };
      document.head.appendChild(s);
    });
  }
  var _pdfjs = null;
  function pdfjsHazirla() {
    if (window.pdfjsLib && window.pdfjsLib.getDocument) {
      try { if (!pdfjsLib.GlobalWorkerOptions.workerSrc) pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_YEREL + 'pdf.worker.min.js'; } catch (e) { }
      return Promise.resolve(window.pdfjsLib);
    }
    if (_pdfjs) return _pdfjs;
    _pdfjs = betikYukle(PDFJS_YEREL + 'pdf.min.js').then(function () { return PDFJS_YEREL; }, function () {
      return betikYukle(PDFJS_CDN + 'pdf.min.js').then(function () { return PDFJS_CDN; });
    }).then(function (kok) {
      if (!window.pdfjsLib || !window.pdfjsLib.getDocument) throw hata('pdfjs');
      try { pdfjsLib.GlobalWorkerOptions.workerSrc = kok + 'pdf.worker.min.js'; } catch (e) { }
      return window.pdfjsLib;
    });
    _pdfjs.catch(function () { _pdfjs = null; });
    return _pdfjs;
  }
  /* PDF sayfasının yazıları → satırlar (aynı yükseklik), hücreler (geniş boşlukla ayrık) */
  function pdfSatirlar(ogeler, sayfa) {
    var og = [];
    ogeler.forEach(function (it) {
      if (!it || typeof it.str !== 'string') return;
      var s = nfk(it.str);
      if (!s.trim()) return;
      var t = it.transform || [1, 0, 0, 1, 0, 0];
      var a = t[0], b = t[1], c = t[2], d = t[3];
      if (Math.abs(b) > Math.abs(a) * 0.5 + 0.01 || Math.abs(c) > Math.abs(d) * 0.5 + 0.01) return;   /* döndürülmüş */
      var h = Math.abs(d) || Math.abs(a) || it.height || 10;
      var w = it.width > 0 ? it.width : s.length * h * 0.5;
      og.push({ t: s, x0: t[4], x1: t[4] + w, y: t[5], h: h });
    });
    og.sort(function (p, q) { return (q.y - p.y) || (p.x0 - q.x0); });
    var satir = [], cur = null;
    og.forEach(function (o) {
      if (cur && Math.abs(o.y - cur.y) <= Math.max(1.5, Math.min(o.h, cur.h) * 0.45)) cur.og.push(o);
      else { cur = { y: o.y, h: o.h, og: [o] }; satir.push(cur); }
    });
    return satir.map(function (r) {
      r.og.sort(function (p, q) { return p.x0 - q.x0; });
      var hucre = [], son = null;
      r.og.forEach(function (o) {
        var bosluk = son ? o.x0 - son.x1 : 0;
        if (!son || bosluk > Math.max(o.h, son.h) * 0.9) {
          son = { t: o.t.trim(), x0: o.x0, x1: o.x1, h: o.h };
          hucre.push(son);
        } else {
          var ara = (bosluk > Math.min(o.h, son.h) * 0.12 && !/\s$/.test(son.t) && !/^\s/.test(o.t)) ? ' ' : '';
          son.t = (son.t + ara + o.t).replace(/\s+/g, ' ').trim();
          son.x1 = Math.max(son.x1, o.x1);
        }
      });
      return { h: hucre, og: r.og.map(function (o) { return { t: o.t.trim(), x0: o.x0, x1: o.x1 }; }), sayfa: sayfa };
    }).filter(function (r) { return r.h.length; });
  }
  async function pdfOku(buf, ilerleme) {
    var lib = await pdfjsHazirla();
    var gorev = lib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false, disableFontFace: true, useSystemFonts: false, stopAtErrors: false });
    var doc;
    try { doc = await gorev.promise; }
    catch (e) { throw hata(e && e.name === 'PasswordException' ? 'pdf-sifre' : 'pdf-bozuk'); }
    var satirlar = [];
    try {
      for (var p = 1; p <= doc.numPages; p++) {
        if (ilerleme) ilerleme(p, doc.numPages);
        var sayfa = await doc.getPage(p);
        var ic = await sayfa.getTextContent();
        satirlar.push.apply(satirlar, pdfSatirlar(ic.items, p));
        try { sayfa.cleanup(); } catch (e) { }
      }
    } finally { try { doc.destroy(); } catch (e) { } }
    if (!satirlar.length) throw hata('pdf-yazisiz');
    return [{ tur: 'pdf', satirlar: satirlar }];
  }
  /* Küçük ZIP okuyucu (docx / xlsx): merkez dizin + DecompressionStream('deflate-raw') */
  function zipAc(buf) {
    var u8 = new Uint8Array(buf), dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength), son = -1;
    for (var i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { son = i; break; }
    }
    if (son < 0) throw hata('zip');
    var adet = dv.getUint16(son + 10, true), p = dv.getUint32(son + 16, true), g = {};
    var dec = new TextDecoder('utf-8');
    for (var k = 0; k < adet && p + 46 <= u8.length; k++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      var nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true);
      g[dec.decode(u8.subarray(p + 46, p + 46 + nl))] = { y: dv.getUint16(p + 10, true), sb: dv.getUint32(p + 20, true), lo: dv.getUint32(p + 42, true) };
      p += 46 + nl + el + cl;
    }
    return {
      adlar: Object.keys(g),
      metin: function (ad) {
        var e = g[ad];
        if (!e) return Promise.resolve(null);
        var lo = e.lo;
        if (lo + 30 > u8.length || dv.getUint32(lo, true) !== 0x04034b50) return Promise.reject(hata('zip'));
        var bas = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true);
        var ham = u8.subarray(bas, bas + e.sb);
        var bitir = function (b) { return new TextDecoder('utf-8').decode(b); };
        if (e.y === 0) return Promise.resolve(bitir(ham));
        if (e.y !== 8) return Promise.reject(hata('zip'));
        var ds;
        try { ds = new DecompressionStream('deflate-raw'); } catch (x) { return Promise.reject(hata('acma-yok')); }
        return new Response(new Blob([ham]).stream().pipeThrough(ds)).arrayBuffer().then(function (b) { return bitir(new Uint8Array(b)); });
      }
    };
  }
  function xmlAc(s) {
    var d = new DOMParser().parseFromString(s, 'application/xml');
    if (d.getElementsByTagName('parsererror').length) throw hata('xml');
    return d;
  }
  function cocuklar(el) { var o = []; for (var c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 1) o.push(c); return o; }
  /* Word belgesi gövdesi → satırlar: paragraf (sekmeler hücre), tablo satırı (hücreler) */
  function wordSatirlar(xml) {
    var d = xmlAc(xml);
    var kok = d.getElementsByTagNameNS('*', 'body')[0] || d.documentElement;
    var satirlar = [];
    function paraMetin(p, kutular) {
      var s = '';
      (function yuru(el) {
        cocuklar(el).forEach(function (c) {
          var n = c.localName;
          if (n === 't') s += c.textContent;
          else if (n === 'tab' || n === 'ptab') s += '\t';
          else if (n === 'br' || n === 'cr') s += ' ';
          else if (n === 'delText' || n === 'instrText' || n === 'Fallback' || n === 'rPr' || n === 'pPr') { }
          else if (n === 'txbxContent') kutular.push(c);
          else yuru(c);
        });
      })(p);
      return s;
    }
    function gez(el) {
      cocuklar(el).forEach(function (c) {
        var n = c.localName;
        if (n === 'p') {
          var kutular = [], m = paraMetin(c, kutular);
          if (m.replace(/\s/g, '')) {
            satirlar.push({ h: m.split('\t').map(function (t, i) { return { t: nfk(t).trim(), col: i }; }).filter(function (h) { return h.t; }) });
          }
          kutular.forEach(gez);
        } else if (n === 'tbl') tablo(c);
        else if (n === 'Fallback' || n === 'sectPr' || n === 'tblPr' || n === 'tblGrid') { }
        else gez(c);
      });
    }
    function hucreMetni(tc, parca, ic) {
      cocuklar(tc).forEach(function (x) {
        var n = x.localName;
        if (n === 'p') {
          var kutular = [], m = paraMetin(x, kutular);
          if (m.trim()) parca.push(m.replace(/\t/g, ' '));
          kutular.forEach(function (k) { hucreMetni(k, parca, ic); });
        } else if (n === 'tbl') ic.push(x);
        else if (n === 'sdt' || n === 'sdtContent' || n === 'customXml' || n === 'ins') hucreMetni(x, parca, ic);
      });
    }
    function tablo(t) {
      cocuklar(t).forEach(function (tr) {
        var n = tr.localName;
        if (n === 'sdt' || n === 'sdtContent' || n === 'customXml') { tablo(tr); return; }
        if (n !== 'tr') return;
        var hucre = [], col = 0, ic = [];
        cocuklar(tr).forEach(function (x) {
          if (x.localName === 'trPr') {
            var gb = cocuklar(x).filter(function (y) { return y.localName === 'gridBefore'; })[0];
            if (gb) col += parseInt(gb.getAttribute('w:val') || gb.getAttributeNS('*', 'val') || '0', 10) || 0;
            return;
          }
          var tcler = x.localName === 'tc' ? [x] : (x.localName === 'sdt' ? Array.prototype.slice.call(x.getElementsByTagNameNS('*', 'tc')) : []);
          tcler.forEach(function (tc) {
            var span = 1;
            var pr = cocuklar(tc).filter(function (y) { return y.localName === 'tcPr'; })[0];
            if (pr) {
              var gs = cocuklar(pr).filter(function (y) { return y.localName === 'gridSpan'; })[0];
              if (gs) span = parseInt(gs.getAttribute('w:val') || '1', 10) || 1;
            }
            var parca = [];
            hucreMetni(tc, parca, ic);
            hucre.push({ t: nfk(parca.join(' ')).replace(/\s+/g, ' ').trim(), col: col });
            col += span;
          });
        });
        hucre = hucre.filter(function (h) { return h.t; });
        if (hucre.length) satirlar.push({ h: hucre });
        ic.forEach(tablo);
      });
    }
    gez(kok);
    return satirlar;
  }
  async function docxOku(buf) {
    var z = zipAc(buf);
    var ana = await z.metin('word/document.xml');
    if (ana == null) throw hata('docx-bozuk');
    var satirlar = [];
    var ustler = z.adlar.filter(function (n) { return /^word\/header\d*\.xml$/.test(n); }).sort();
    for (var i = 0; i < ustler.length; i++) {
      try { satirlar.push.apply(satirlar, wordSatirlar(await z.metin(ustler[i]))); } catch (e) { }
    }
    satirlar.push.apply(satirlar, wordSatirlar(ana));
    return [{ tur: 'docx', satirlar: satirlar }];
  }
  function sutunNo(ref) {
    var m = String(ref || '').match(/^([A-Z]+)/), n = 0;
    if (!m) return -1;
    for (var i = 0; i < m[1].length; i++) n = n * 26 + (m[1].charCodeAt(i) - 64);
    return n - 1;
  }
  function tumT(el) {
    var s = '';
    var ts = el.getElementsByTagNameNS('*', 't');
    for (var i = 0; i < ts.length; i++) {
      var ata = ts[i].parentNode;
      if (ata && (ata.localName === 'rPh')) continue;
      s += ts[i].textContent;
    }
    return s;
  }
  async function xlsxOku(buf) {
    var z = zipAc(buf);
    var ss = [];
    var ssx = await z.metin('xl/sharedStrings.xml');
    if (ssx) {
      var sd = xmlAc(ssx), si = sd.getElementsByTagNameNS('*', 'si');
      for (var i = 0; i < si.length; i++) ss.push(tumT(si[i]));
    }
    var wbx = await z.metin('xl/workbook.xml');
    if (wbx == null) throw hata('xlsx-bozuk');
    var wb = xmlAc(wbx), rels = {}, relx = await z.metin('xl/_rels/workbook.xml.rels');
    if (relx) {
      var rd = xmlAc(relx), rr = rd.getElementsByTagNameNS('*', 'Relationship');
      for (var r = 0; r < rr.length; r++) rels[rr[r].getAttribute('Id')] = rr[r].getAttribute('Target');
    }
    var sayfalar = wb.getElementsByTagNameNS('*', 'sheet'), belgeler = [];
    for (var s = 0; s < sayfalar.length; s++) {
      var sh = sayfalar[s];
      if (/hidden/i.test(sh.getAttribute('state') || '')) continue;
      var rid = sh.getAttribute('r:id') || sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
      var hedef = rels[rid] || ('worksheets/sheet' + (s + 1) + '.xml');
      var yol = hedef.charAt(0) === '/' ? hedef.slice(1) : ('xl/' + hedef.replace(/^\.\//, ''));
      var x = await z.metin(yol);
      if (x == null) continue;
      var d = xmlAc(x), satirlar = [], rows = d.getElementsByTagNameNS('*', 'row');
      for (var ri = 0; ri < rows.length; ri++) {
        var h = [], cs = rows[ri].getElementsByTagNameNS('*', 'c');
        for (var ci = 0; ci < cs.length; ci++) {
          var c = cs[ci], tip = c.getAttribute('t') || '', v = c.getElementsByTagNameNS('*', 'v')[0], val = '';
          if (tip === 's') val = v ? (ss[parseInt(v.textContent, 10)] || '') : '';
          else if (tip === 'inlineStr') val = tumT(c);
          else if (tip === 'b' || tip === 'e') val = '';
          else if (v) {
            val = v.textContent;
            if (/^-?\d+(\.\d+)?[eE][+\-]?\d+$/.test(val)) { var nn = Number(val); if (isFinite(nn) && Math.abs(nn) < 1e15 && nn === Math.round(nn)) val = String(nn); }
            val = val.replace(/^(\d+)\.0+$/, '$1');
          }
          val = nfk(val).replace(/\s+/g, ' ').trim();
          if (val) h.push({ t: val, col: sutunNo(c.getAttribute('r')) >= 0 ? sutunNo(c.getAttribute('r')) : ci });
        }
        if (h.length) satirlar.push({ h: h });
      }
      belgeler.push({ tur: 'tablo', ad: sh.getAttribute('name') || '', satirlar: satirlar });
    }
    return belgeler;
  }
  function metinCoz(u8) {
    if (u8[0] === 0xFF && u8[1] === 0xFE) return new TextDecoder('utf-16le').decode(u8.subarray(2));
    if (u8[0] === 0xFE && u8[1] === 0xFF) return new TextDecoder('utf-16be').decode(u8.subarray(2));
    try { return new TextDecoder('utf-8', { fatal: true }).decode(u8); } catch (e) { }
    try { return new TextDecoder('windows-1254').decode(u8); } catch (e) { return new TextDecoder('utf-8').decode(u8); }
  }
  function csvBol(l, a) {
    var out = [], cur = '', tir = false;
    for (var i = 0; i < l.length; i++) {
      var ch = l.charAt(i);
      if (tir) { if (ch === '"') { if (l.charAt(i + 1) === '"') { cur += '"'; i++; } else tir = false; } else cur += ch; }
      else if (ch === '"' && !cur.trim()) tir = true;
      else if (ch === a) { out.push(cur); cur = ''; }
      else cur += ch;
    }
    out.push(cur);
    return out;
  }
  function metinSatirlar(s, csv) {
    var sat = s.replace(/^﻿/, '').split(/\r\n|\r|\n/);
    var dolu = sat.filter(function (l) { return l.trim(); }).length || 1;
    var say = function (ch) { return sat.filter(function (l) { return l.indexOf(ch) >= 0; }).length; };
    var ayrac = say('\t') >= dolu * 0.3 ? '\t' : (say(';') >= dolu * 0.3 ? ';' : (csv && say(',') >= dolu * 0.3 ? ',' : null));
    return sat.map(function (l) {
      if (!l.trim()) return null;
      var h = ayrac ? csvBol(l, ayrac) : l.split(/\s{2,}/);
      return { h: h.map(function (t, i) { return { t: nfk(t).replace(/\s+/g, ' ').trim(), col: i }; }).filter(function (x) { return x.t; }) };
    }).filter(function (r) { return r && r.h.length; });
  }
  function htmlSatirlar(s) {
    var d = new DOMParser().parseFromString(s, 'text/html'), satirlar = [];
    var trs = d.querySelectorAll('tr');
    for (var i = 0; i < trs.length; i++) {
      var h = [], col = 0, cells = trs[i].cells || [];
      for (var j = 0; j < cells.length; j++) {
        var t = nfk(cells[j].textContent).replace(/\s+/g, ' ').trim();
        if (t) h.push({ t: t, col: col });
        col += parseInt(cells[j].getAttribute('colspan') || '1', 10) || 1;
      }
      if (h.length) satirlar.push({ h: h });
    }
    if (satirlar.length) return [{ tur: 'tablo', satirlar: satirlar }];
    var govde = d.body ? (d.body.innerText || d.body.textContent || '') : '';
    return [{ tur: 'txt', satirlar: metinSatirlar(govde, false) }];
  }
  function dosyaTuru(ad, u8) {
    var uz = String(ad || '').toLowerCase().split('.').pop();
    if (u8[0] === 0x25 && u8[1] === 0x50 && u8[2] === 0x44 && u8[3] === 0x46) return 'pdf';
    if (u8[0] === 0x50 && u8[1] === 0x4B) {
      if (/^(xlsx|xlsm|xltx)$/.test(uz)) return 'xlsx';
      if (/^(docx|docm|dotx)$/.test(uz)) return 'docx';
      if (/^(odt|ods)$/.test(uz)) return 'odf';
      if (/^(pages|numbers|key)$/.test(uz)) return 'apple';
      return 'zip';
    }
    if (u8[0] === 0xD0 && u8[1] === 0xCF && u8[2] === 0x11 && u8[3] === 0xE0) return uz === 'xls' ? 'xls-eski' : (uz === 'doc' ? 'doc-eski' : 'ole');
    if (/^(png|jpe?g|gif|heic|heif|webp|bmp|tiff?)$/.test(uz)) return 'resim';
    if (/^(pages|numbers|key)$/.test(uz)) return 'apple';
    var bas = alt(metinCoz(u8.subarray(0, 1500)).trim());
    if (bas.indexOf('{\\rtf') === 0) return 'rtf';
    if (/^<(!doctype|html|table|meta|head|body)/.test(bas) || (uz !== 'txt' && /<table/.test(bas))) return 'html';
    return uz === 'csv' ? 'csv' : 'txt';
  }
  /* File → [{tur, ad?, satirlar}] */
  function dosyaBayt(f) {
    if (f.arrayBuffer) return f.arrayBuffer();
    return new Promise(function (ok, red) {                  /* eski Safari: File.arrayBuffer yok */
      var r = new FileReader();
      r.onload = function () { ok(r.result); };
      r.onerror = function () { red(hata('okunamadi')); };
      r.readAsArrayBuffer(f);
    });
  }
  async function dosyaOku(f, ilerleme) {
    if (f.size > EN_BUYUK) throw hata('buyuk');
    var buf = await dosyaBayt(f);
    var u8 = new Uint8Array(buf);
    var tur = dosyaTuru(f.name, u8);
    if (tur === 'zip') {
      try { var zz = zipAc(buf); tur = zz.adlar.indexOf('word/document.xml') >= 0 ? 'docx' : (zz.adlar.indexOf('xl/workbook.xml') >= 0 ? 'xlsx' : 'zip'); } catch (e) { }
    }
    if (tur === 'pdf') return pdfOku(buf, ilerleme);
    if (tur === 'docx') return docxOku(buf);
    if (tur === 'xlsx') return xlsxOku(buf);
    if (tur === 'html') return htmlSatirlar(metinCoz(u8));
    if (tur === 'csv') return [{ tur: 'tablo', satirlar: metinSatirlar(metinCoz(u8), true) }];
    if (tur === 'txt') return [{ tur: 'txt', satirlar: metinSatirlar(metinCoz(u8), false) }];
    throw hata('tur-' + tur);
  }
  var HATA_METNI = {
    'buyuk': 'Dosya çok büyük (30 MB üstü).',
    'pdf-sifre': 'PDF şifreli; şifresiz kaydedip yeniden dene.',
    'pdf-bozuk': 'PDF açılamadı (dosya bozuk olabilir).',
    'pdf-yazisiz': 'Bu PDF\'te yazı yok, taranmış bir görüntü. e-Okul\'dan listeyi PDF ya da Excel olarak indirip dene.',
    'pdfjs': 'PDF okuyucu yüklenemedi; internet bağlantını denetleyip yeniden dene.',
    'betik': 'PDF okuyucu yüklenemedi; internet bağlantını denetleyip yeniden dene.',
    'zip': 'Dosya açılamadı (bozuk ya da şifreli olabilir).',
    'xml': 'Dosyanın içi okunamadı (bozuk olabilir).',
    'docx-bozuk': 'Word dosyası açılamadı (bozuk ya da şifreli olabilir).',
    'xlsx-bozuk': 'Excel dosyası açılamadı (bozuk ya da şifreli olabilir).',
    'acma-yok': 'Bu tarayıcı Word / Excel dosyasını açamıyor. Dosyayı PDF olarak kaydedip dene ya da güncel bir tarayıcı (Chrome, Safari, Edge) kullan.',
    'tur-doc-eski': 'Eski Word biçimi (.doc) okunamıyor. Dosyayı Word\'de açıp «Farklı Kaydet → Word Belgesi (.docx)» ya da PDF olarak kaydet.',
    'tur-xls-eski': 'Eski Excel biçimi (.xls) okunamıyor. Excel\'de açıp «Farklı Kaydet → .xlsx» olarak kaydet ya da e-Okul\'dan PDF indir.',
    'tur-ole': 'Bu dosya biçimi okunamıyor. PDF, Word (.docx), Excel (.xlsx) ya da TXT kullan.',
    'tur-resim': 'Resim dosyası okunamıyor. Listeyi PDF, Word ya da TXT olarak ekle.',
    'tur-apple': 'Pages / Numbers dosyası okunamıyor. «Dışa Aktar → PDF ya da Word / Excel» ile kaydedip dene.',
    'tur-odf': 'LibreOffice dosyası okunamıyor. «Farklı Kaydet → Word (.docx) / Excel (.xlsx)» ya da PDF olarak kaydet.',
    'tur-rtf': 'RTF dosyası okunamıyor. Word\'de açıp .docx ya da PDF olarak kaydet.',
    'tur-zip': 'Bu sıkıştırılmış dosya okunamıyor. Listeyi PDF, Word, Excel ya da TXT olarak ekle.'
  };
  function hataMetni(e) {
    var k = e && e.kod;
    return kd('ly.h_' + (k || 'x'), HATA_METNI[k] || 'Dosya okunamadı.');
  }

  /* ==================================================================
     SİTEYE BAĞLANAN KISIM (Listelerim verisi: data, save, selectClass …)
     ================================================================== */
  function veri() { try { return (typeof data !== 'undefined' && data) ? data : null; } catch (e) { return null; } }
  function acikSinifAl() {
    /* yalnız Listelerim'de gerçekten açık duran sınıf (boş ekran ya da anasayfa değil) */
    if (!gorunur($id('ll-root')) || gorunur($id('ll-select-hint'))) return null;
    try {
      var d = veri(), l = (typeof curLId !== 'undefined') ? curLId : null, c = (typeof curCId !== 'undefined') ? curCId : null;
      if (d && l && c && d.levels[l] && d.levels[l].classes && d.levels[l].classes[c]) return { lId: l, cId: c };
    } catch (e) { }
    return null;
  }
  function seviyeTani(ad) {
    try { if (typeof window.llSeviyeTani === 'function') return window.llSeviyeTani(ad); } catch (e) { }
    var s = sinifBul(ad, { bas: true, dosya: true });
    return s ? { no: s.no, sube: s.sube } : { no: 0, sube: '' };
  }
  function sinifAnahtari(ad) {
    var t = seviyeTani(ad);
    if (t.no && t.sube) return t.no + t.sube;
    return ust(nfk(ad)).replace(/[\s\-\/.]+/g, '');
  }
  /* Var olan sınıflar: [{lId, cId, ad, seviye, no, sube, kurumId}] */
  function siniflar() {
    var d = veri(), out = [];
    if (!d || !d.levels) return out;
    var sira = (d.levelOrder || []).filter(function (x) { return d.levels[x]; });
    Object.keys(d.levels).forEach(function (x) { if (sira.indexOf(x) < 0) sira.push(x); });
    sira.forEach(function (lId) {
      var l = d.levels[lId];
      if (!l) return;
      var ln = seviyeTani(l.name).no;
      Object.keys(l.classes || {}).forEach(function (cId) {
        var c = l.classes[cId];
        if (!c) return;
        var t = seviyeTani(c.name), no = t.no || ln, sube = t.sube;
        if (!sube) { var tek = ust(nfk(c.name || '')).replace(/ŞUBESİ?|ŞUBE/g, '').replace(/[\s\-\/.]/g, ''); if (/^[A-ZÇĞİÖŞÜ]$/.test(tek)) sube = tek; }
        out.push({ lId: lId, cId: cId, ad: c.name || '', seviye: l.name || '', no: no, sube: sube, kurumId: l.kurumId || null });
      });
    });
    return out;
  }
  function eslesenSinif(s, kurumId) {
    if (!s) return null;
    var hepsi = siniflar(), uygun = function (x) { return x.no === s.no && x.sube === s.sube; };
    var ayni = hepsi.filter(function (x) { return uygun(x) && x.kurumId === (kurumId || null); });
    if (ayni.length) return ayni[0];
    var genel = hepsi.filter(function (x) { return uygun(x) && !x.kurumId; });
    if (genel.length) return genel[0];
    var kurumlu = Object.keys((veri() || {}).kurumlar || {}).length > 0;
    if (!kurumlu) { var h = hepsi.filter(uygun); if (h.length) return h[0]; }
    return null;
  }
  function kurumlar() {
    var d = veri(), k = (d && d.kurumlar) || {};
    return Object.keys(k).map(function (id) { return { id: id, ad: (k[id] && k[id].name) || id }; });
  }

  /* ------------------------------------------------------------------
     BİÇEM
     ------------------------------------------------------------------ */
  var SIMGE = '<svg class="ly-svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
    '<path d="M12 4.5h17l9 9V41a2.5 2.5 0 0 1-2.5 2.5h-23A2.5 2.5 0 0 1 10 41V7a2.5 2.5 0 0 1 2.5-2.5z" fill="#fff" stroke="#E67E22" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M29 4.5v9h9" fill="#FCE3CC" stroke="#E67E22" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<g fill="#F5B041"><circle cx="17" cy="21" r="2.1"/><circle cx="17" cy="28" r="2.1"/><circle cx="17" cy="35" r="2.1"/></g>' +
    '<g stroke="#D7C2B0" stroke-width="2.2" stroke-linecap="round"><path d="M22 21h10M22 28h10M22 35h7"/></g>' +
    '<g class="ly-ok"><circle cx="36" cy="36" r="8.6" fill="#16A085"/><path d="M36 31.6v8.4M32.4 36.6l3.6 3.6 3.6-3.6" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    '</svg>';
  function stilEkle() {
    if (document.getElementById('lyStil')) return;
    var s = document.createElement('style');
    s.id = 'lyStil';
    s.textContent = [
      '#lyAlan{display:flex;align-items:center;gap:14px;margin:0 0 18px;padding:12px 16px;border:2px dashed #E8A87C;border-radius:14px;',
      '  background:#FFFBF7;color:#6B4A38;transition:border-color .15s,background .15s,box-shadow .15s}',
      '#lyAlan.ly-ust-uzerinde,#lyIpucu.ly-ust-uzerinde{border-color:#E67E22;background:#FFF1E4;box-shadow:0 0 0 4px rgba(230,126,34,.12)}',
      '#lyAlan .ly-svg{width:44px;height:44px;flex:none}',
      '#lyAlan .ly-yazi{flex:1;min-width:0;line-height:1.45}',
      '#lyAlan .ly-yazi b{display:block;color:#5A3A28;font-size:1.02rem}',
      '#lyAlan .ly-yazi span{font-size:.88rem;color:#8B6A57}',
      '.ly-sec{flex:none;border:0;border-radius:11px;padding:11px 18px;font:inherit;font-weight:800;font-size:.95rem;cursor:pointer;color:#fff;',
      '  background:linear-gradient(135deg,#F39C12,#E67E22);box-shadow:0 4px 12px rgba(230,126,34,.28);transition:filter .15s,transform .12s}',
      '.ly-sec:hover{filter:brightness(1.06);transform:translateY(-1px)}',
      '.ly-sec:active{transform:scale(.98)}',
      '#lyIpucu{display:flex;align-items:center;gap:14px;max-width:560px;margin:26px auto 0;padding:14px 16px;text-align:left;',
      '  border:2px dashed #E8A87C;border-radius:16px;background:#FFFBF7;color:#6B4A38;transition:border-color .15s,background .15s}',
      '#lyIpucu .ly-svg{width:46px;height:46px;flex:none}',
      '#lyIpucu .ly-yazi{flex:1;min-width:0;line-height:1.45;font-size:.9rem;color:#8B6A57}',
      '#lyIpucu .ly-yazi b{display:block;color:#5A3A28;font-size:1rem;margin-bottom:1px}',
      '@media (max-width:620px){#lyAlan,#lyIpucu{flex-wrap:wrap}#lyAlan .ly-sec,#lyIpucu .ly-sec{width:100%}}',
      /* perde */
      '#lyPerde{position:fixed;inset:0;z-index:1000080;display:flex;align-items:center;justify-content:center;padding:24px;',
      '  background:rgba(255,246,238,.9);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}',
      '#lyPerde .ly-perde-kutu{pointer-events:none;width:min(560px,100%);padding:38px 26px;border:3px dashed #E67E22;border-radius:26px;',
      '  background:#fff;text-align:center;color:#6B4A38;box-shadow:0 20px 50px rgba(90,58,40,.18)}',
      '#lyPerde .ly-svg{width:76px;height:76px;display:block;margin:0 auto 12px}',
      '#lyPerde .ly-ok{animation:lyOk 1s ease-in-out infinite}',
      '@keyframes lyOk{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}',
      '#lyPerde b{display:block;font-size:1.35rem;color:#5A3A28;margin-bottom:6px}',
      '#lyPerde span{font-size:.95rem;color:#8B6A57;line-height:1.5}',
      '@media (prefers-reduced-motion:reduce){#lyPerde .ly-ok{animation:none}}',
      /* pencere */
      '#lyPencere{position:fixed;inset:0;z-index:1000085;display:flex;align-items:center;justify-content:center;padding:16px;',
      '  background:rgba(15,23,42,.45);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}',
      '#lyPencere .ly-kutu{position:relative;display:flex;flex-direction:column;width:min(680px,100%);max-height:calc(100vh - 32px);',
      '  background:#FFF8F2;border-radius:20px;box-shadow:0 24px 64px rgba(15,23,42,.3);color:#3E2A20;font-family:inherit;box-sizing:border-box;overflow:hidden}',
      '#lyPencere .ly-ust{display:flex;align-items:center;gap:12px;padding:16px 56px 12px 20px;border-bottom:1px solid #F0E2D5}',
      '#lyPencere .ly-ust .ly-svg{width:40px;height:40px;flex:none}',
      '#lyPencere .ly-ust b{display:block;font-size:1.15rem;color:#5A3A28}',
      '#lyPencere .ly-ust small{display:block;font-size:.84rem;color:#8B6A57;margin-top:1px;overflow-wrap:anywhere}',
      '#lyPencere .ly-kapat{position:absolute;top:13px;right:14px;width:36px;height:36px;border:0;border-radius:50%;background:#F3E6DA;',
      '  color:#6B4A38;font-size:22px;line-height:36px;cursor:pointer}',
      '#lyPencere .ly-govde{flex:1;min-height:0;overflow:auto;padding:14px 20px 8px;-webkit-overflow-scrolling:touch}',
      '#lyPencere .ly-alt{display:flex;justify-content:flex-end;align-items:center;gap:8px;padding:12px 20px 16px;border-top:1px solid #F0E2D5;flex-wrap:wrap}',
      '#lyPencere .ly-alt button{border:0;border-radius:11px;padding:11px 18px;font:inherit;font-weight:800;cursor:pointer}',
      '#lyPencere .ly-vazgec{background:#F3E6DA;color:#6B4A38}',
      '#lyPencere .ly-geri{background:#fff;color:#B34700;border:1px solid #F0DACA !important;margin-right:auto}',
      '#lyPencere .ly-ekle{background:linear-gradient(135deg,#20C997,#16A085);color:#fff;box-shadow:0 4px 12px rgba(22,160,133,.28)}',
      '#lyPencere .ly-ekle[disabled]{opacity:.45;cursor:default;box-shadow:none}',
      '#lyPencere .ly-yuk{display:flex;align-items:center;gap:12px;padding:26px 6px;color:#6B4A38;font-weight:700}',
      '#lyPencere .ly-donen{width:26px;height:26px;border-radius:50%;border:3px solid #F3E6DA;border-top-color:#E67E22;animation:lyDon .8s linear infinite;flex:none}',
      '@keyframes lyDon{to{transform:rotate(360deg)}}',
      '#lyPencere .ly-ayar{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin:0 0 12px}',
      '#lyPencere .ly-ayar label{display:inline-flex;align-items:center;gap:7px;font-size:.9rem;font-weight:700;color:#5A3A28;cursor:pointer}',
      '#lyPencere .ly-ayar small{font-weight:600;color:#8B6A57}',
      '#lyPencere select,#lyPencere input[type=text]{font:inherit;font-size:.9rem;border:1.5px solid #E6D3C3;border-radius:10px;padding:7px 9px;background:#fff;color:#3E2A20;max-width:100%}',
      '#lyPencere input[type=checkbox]{width:18px;height:18px;accent-color:#16A085;flex:none}',
      '#lyPencere .ly-grup{border:1px solid #EADCCF;border-radius:14px;background:#fff;margin:0 0 10px;padding:10px 12px}',
      '#lyPencere .ly-grup.kapali{opacity:.55}',
      '#lyPencere .ly-gust{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px}',
      '#lyPencere .ly-rozet{display:inline-flex;align-items:center;justify-content:center;min-width:44px;padding:4px 10px;border-radius:9px;',
      '  background:#FDEBD8;color:#B34700;font-weight:900;font-size:1rem}',
      '#lyPencere .ly-rozet.bilinmez{background:#EEF1F5;color:#5B6471;font-weight:800;font-size:.85rem}',
      '#lyPencere .ly-sayi{font-size:.9rem;color:#6B4A38}',
      '#lyPencere .ly-sayi b{font-size:1.02rem;color:#3E2A20}',
      '#lyPencere .ly-hedef-kap{display:inline-flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap}',
      '#lyPencere .ly-hedef-kap span{font-size:.82rem;color:#8B6A57;font-weight:700}',
      '#lyPencere .ly-yeniad{width:9em}',
      '#lyPencere .ly-gnot{margin:7px 0 0;font-size:.84rem;line-height:1.45;color:#0E7C66}',
      '#lyPencere .ly-gnot.uyari{color:#B34700}',
      '#lyPencere .ly-gor{border:0;background:none;color:#B34700;font:inherit;font-size:.84rem;font-weight:800;cursor:pointer;padding:4px 2px}',
      '#lyPencere .ly-adlar{list-style:none;margin:8px 0 2px;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:4px 12px}',
      '#lyPencere .ly-adlar li{display:flex;align-items:center;gap:8px;padding:3px 4px;border-bottom:1px dashed #F0E2D5;font-size:.9rem;min-width:0}',
      '#lyPencere .ly-adlar li.var{color:#A08876}',
      '#lyPencere .ly-adlar li.var .ly-ad::after{content:" · listede var";font-size:.76rem;color:#A08876}',
      '#lyPencere .ly-no{flex:none;min-width:3.2em;text-align:right;font-variant-numeric:tabular-nums;color:#8B6A57;font-weight:700}',
      '#lyPencere .ly-ad{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '#lyPencere .ly-cikar{flex:none;width:24px;height:24px;border:0;border-radius:50%;background:#F7EDE4;color:#B34700;cursor:pointer;font-size:15px;line-height:24px}',
      '#lyPencere .ly-gizli{margin:10px 0 4px;font-size:.8rem;line-height:1.5;color:#8B6A57}',
      '#lyPencere .ly-hatalar{margin:0 0 12px;padding:9px 12px;border-radius:12px;background:#FFF1E4;color:#8A4B12;font-size:.86rem;line-height:1.5}',
      '#lyPencere .ly-hatalar b{color:#5A3A28}',
      '#lyPencere .ly-bos{padding:18px 4px;color:#6B4A38;line-height:1.6}',
      '#lyPencere .ly-bos ul{margin:8px 0 0 18px;padding:0;font-size:.9rem;color:#8B6A57}',
      '#lyPencere .ly-sonuc{text-align:center;padding:22px 8px 12px;color:#6B4A38;line-height:1.55}',
      '#lyPencere .ly-tik{width:58px;height:58px;margin:0 auto 10px;border-radius:50%;background:#16A085;color:#fff;font-size:32px;line-height:58px;font-weight:900}',
      '#lyPencere .ly-sonuc b{display:block;font-size:1.25rem;color:#3E2A20;margin-bottom:4px}',
      '@media (max-width:560px){#lyPencere{padding:0}#lyPencere .ly-kutu{width:100%;max-height:100vh;height:100%;border-radius:0}',
      '  #lyPencere .ly-hedef-kap{margin-left:0;width:100%}#lyPencere .ly-hedef-kap select{flex:1}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------
     DURUM VE PENCERE
     ------------------------------------------------------------------ */
  var durum = null;
  function ogretmenMi() {
    try { if (typeof appState !== 'undefined' && appState && appState.userRole === 'student') return false; } catch (e) { }
    try {
      var u = window.firebase && firebase.auth && firebase.auth().currentUser;
      if (u && window.KidefRol && KidefRol.onbellekOku) { var o = KidefRol.onbellekOku(u.uid); if (o && o.rol === 'student') return false; }
    } catch (e) { }
    return true;
  }
  function gorunur(el) {
    if (!el) return false;
    try {
      var c = getComputedStyle(el);
      if (c.display === 'none' || c.visibility === 'hidden') return false;
      if (c.display === 'contents') {                       /* okul penceresi kutusuz kap: çocuklarına bak */
        for (var x = el.firstElementChild; x; x = x.nextElementSibling) if (gorunur(x)) return true;
        return false;
      }
      return el.getClientRects().length > 0;
    } catch (e) { return false; }
  }
  /* Listelerim açıksa sayfanın her yeri; değilse yalnız okul penceresinin / anasayfadaki «Sınıflarım»ın üstü */
  function etkin(e) {
    if (!ogretmenMi() || (durum && durum.asama === 'ekleniyor')) return false;
    if (gorunur($id('ll-root'))) return true;
    var t = e && e.target && e.target.closest ? e.target : null;
    var bolge = t ? t.closest('#llOkulPopup, #siniflarim') : null;
    return !!(bolge && gorunur(bolge));
  }
  function $id(id) { return document.getElementById(id); }
  function pencereKapat() {
    var k = $id('lyPencere');
    if (k && k.parentNode) k.parentNode.removeChild(k);
    if (window._lyEsc) { document.removeEventListener('keydown', window._lyEsc, true); window._lyEsc = null; }
    durum = null;
  }
  function pencereKur() {
    stilEkle();
    var k = $id('lyPencere');
    if (k) return k;
    k = document.createElement('div');
    k.id = 'lyPencere';
    k.setAttribute('role', 'dialog');
    k.setAttribute('aria-modal', 'true');
    k.setAttribute('aria-labelledby', 'lyBas');
    k.innerHTML = '<div class="ly-kutu">' +
      '<button type="button" class="ly-kapat" data-ly="kapat" aria-label="' + kac(kd('g.kapat', 'Kapat')) + '">&times;</button>' +
      '<div class="ly-ust">' + SIMGE + '<div><b id="lyBas">' + kac(kd('ly.baslik', 'Listeden öğrenci ekle')) + '</b><small id="lyAltYazi"></small></div></div>' +
      '<div class="ly-govde" id="lyGovde"></div><div class="ly-alt" id="lyTuslar"></div></div>';
    document.body.appendChild(k);
    k.addEventListener('click', pencereTik);
    k.addEventListener('change', pencereDegis);
    k.addEventListener('input', pencereYaz);
    window._lyEsc = function (e) {
      if (e.key !== 'Escape' || !$id('lyPencere')) return;
      if (document.getElementById('llOnayModal') && getComputedStyle(document.getElementById('llOnayModal')).display !== 'none') return;
      e.stopPropagation(); e.preventDefault();
      if (!durum || durum.asama !== 'ekleniyor') pencereKapat();
    };
    document.addEventListener('keydown', window._lyEsc, true);
    return k;
  }
  function govde(html, tuslar, altYazi) {
    pencereKur();
    $id('lyGovde').innerHTML = html;
    $id('lyTuslar').innerHTML = tuslar || '';
    if (altYazi != null) $id('lyAltYazi').textContent = altYazi;
  }
  function yukleniyor(metin) {
    var g = $id('lyGovde');
    var y = g && g.querySelector('.ly-yuk span.ly-yuk-yazi');
    if (y) { y.textContent = metin; return; }
    govde('<div class="ly-yuk"><span class="ly-donen" aria-hidden="true"></span><span class="ly-yuk-yazi" aria-live="polite">' + kac(metin) + '</span></div>',
      '<button type="button" class="ly-vazgec" data-ly="kapat">' + kac(kd('g.vazgec', 'Vazgeç')) + '</button>');
  }
  function bilgiVer(m, baslik) {
    try { if (typeof window.llBilgi === 'function') { window.llBilgi(m, baslik); return; } } catch (e) { }
    try { alert(m); } catch (e) { }
  }

  /* Dosyalar geldi: oku → çöz → önizle */
  var _sira = 0;
  async function dosyalariAl(liste, baglam) {
    var dosyalar = Array.prototype.slice.call(liste || []).filter(function (f) { return f && f.size >= 0 && f.name; });
    if (!dosyalar.length) return;
    baglam = baglam || {};
    try { if (typeof window.llSaltGorunumMu === 'function' && window.llSaltGorunumMu()) { bilgiVer(kd('ly.giris', 'Öğrenci eklemek için önce giriş yap. Dosya okunmadı.'), kd('ly.giris_bas', 'Giriş gerekiyor')); return; } } catch (e) { }
    if (!veri()) { bilgiVer(kd('ly.veri_yok', 'Listelerin henüz açılmadı; birkaç saniye sonra yeniden dene.')); return; }
    var benim = ++_sira;
    pencereKur();
    durum = { asama: 'okunuyor', baglam: baglam, acik: baglam.acikSinif === undefined ? acikSinifAl() : baglam.acikSinif };
    $id('lyAltYazi').textContent = dosyalar.length === 1 ? dosyalar[0].name : dosyalar.length + ' ' + kd('ly.dosya', 'dosya');
    var okunan = [], hatalar = [];
    for (var i = 0; i < dosyalar.length; i++) {
      var f = dosyalar[i];
      yukleniyor('«' + f.name + '» ' + kd('ly.okunuyor', 'okunuyor…'));
      try {
        var b = await dosyaOku(f, function (p, n) {
          if (benim === _sira && n > 1) yukleniyor('«' + f.name + '» ' + kd('ly.okunuyor', 'okunuyor…') + ' ' + p + ' / ' + n);
        });
        okunan.push({ ad: f.name, belgeler: b });
      } catch (e) {
        hatalar.push({ ad: f.name, metin: hataMetni(e) });
        try { console.warn('listeyukle', f.name, e); } catch (x) { }
      }
      if (benim !== _sira || !$id('lyPencere')) return;      /* kapatıldı ya da yeni dosya geldi */
    }
    var gruplar = [];
    try { gruplar = coz(okunan); } catch (e) { try { console.warn('listeyukle coz', e); } catch (x) { } }
    okunan.forEach(function (o) {
      if (!gruplar.some(function (g) { return g.dosyalar.indexOf(o.ad) >= 0; })) hatalar.push({ ad: o.ad, metin: kd('ly.bulunamadi', 'Öğrenci listesi bulunamadı.') });
    });
    onizlemeKur(gruplar, hatalar, dosyalar);
  }

  function onizlemeKur(gruplar, hatalar, dosyalar) {
    var acik = durum && durum.acik;
    var ks = kurumlar(), kurumId = null;
    if (ks.length) {
      var d = veri();
      if (acik && d.levels[acik.lId] && d.levels[acik.lId].kurumId && d.kurumlar[d.levels[acik.lId].kurumId]) kurumId = d.levels[acik.lId].kurumId;
      else if (window.llKurumFiltre && d.kurumlar[window.llKurumFiltre]) kurumId = window.llKurumFiltre;
      else kurumId = ks[0].id;
    }
    durum.asama = 'onizleme';
    durum.hatalar = hatalar;
    durum.kurumId = kurumId;
    durum.duzelt = true;
    durum.gruplar = gruplar.map(function (g) {
      return { g: g, secili: true, ogr: g.ogr.slice(), acikMi: false, hedef: null, yeniAd: g.sinif ? g.sinif.ad : '', elle: false };
    });
    hedefleriKur();
    var toplam = gruplar.reduce(function (t, g) { return t + g.ogr.length; }, 0);
    $id('lyAltYazi').textContent = (dosyalar.length === 1 ? dosyalar[0].name : dosyalar.length + ' ' + kd('ly.dosya', 'dosya')) +
      (gruplar.length ? ' · ' + (gruplar.length > 1 ? gruplar.length + ' ' + kd('ly.sinif', 'sınıf') + ' · ' : '') + toplam + ' ' + kd('ly.ogrenci', 'öğrenci') : '');
    onizlemeCiz();
  }
  /* Grupların hedefi: tek grup + açık sınıf → açık sınıf; yoksa aynı adlı sınıf; yoksa yeni sınıf */
  function hedefleriKur() {
    var tek = durum.gruplar.length === 1, acik = durum.acik;
    durum.gruplar.forEach(function (x) {
      if (x.elle) return;
      if (tek && acik) { x.hedef = acik.lId + '|' + acik.cId; return; }
      var e = eslesenSinif(x.g.sinif, durum.kurumId);
      x.hedef = e ? e.lId + '|' + e.cId : 'yeni';
    });
  }
  function hedefSinif(x) {
    var d = veri();
    if (x.hedef && x.hedef !== 'yeni') {
      var p = x.hedef.split('|'), l = d.levels[p[0]], c = l && l.classes && l.classes[p[1]];
      return c ? { lId: p[0], cId: p[1], cls: c, lvl: l } : null;
    }
    var ad = (x.yeniAd || '').trim();
    if (!ad) return null;
    var k = sinifAnahtari(ad), bulunan = null;
    siniflar().forEach(function (s) {
      if (bulunan || (s.kurumId || null) !== (durum.kurumId || null) && kurumlar().length) return;
      if (sinifAnahtari(s.ad) === k || (s.no && s.sube && s.no + s.sube === k)) bulunan = s;
    });
    if (bulunan) return { lId: bulunan.lId, cId: bulunan.cId, cls: d.levels[bulunan.lId].classes[bulunan.cId], lvl: d.levels[bulunan.lId], adla: true };
    return null;
  }
  function varMi(cls, o) {
    var k = adAnahtar(o.ad);
    return (cls.students || []).some(function (s) {
      return adAnahtar(s.name || '') === k || (o.no && s.numara != null && String(s.numara) === String(o.no));
    });
  }
  function grupSayilari(x) {
    var h = hedefSinif(x), yeni = 0, var_ = 0;
    x.ogr.forEach(function (o) { if (h && varMi(h.cls, o)) var_++; else yeni++; });
    return { h: h, yeni: yeni, var_: var_ };
  }
  function adGoster(ad) { return durum && durum.duzelt ? adDuzelt(ad) : ad; }
  function hedefSecenekleri(x) {
    var s = siniflar(), ks = kurumlar(), d = veri(), html = '';
    var yeniEt = kd('ly.yeni_sinif', 'Yeni sınıf');
    html += '<option value="yeni"' + (x.hedef === 'yeni' ? ' selected' : '') + '>' + kac(yeniEt) + '</option>';
    var gruplu = {};
    s.forEach(function (c) {
      var kAd = c.kurumId && d.kurumlar && d.kurumlar[c.kurumId] ? d.kurumlar[c.kurumId].name : '';
      var g = (ks.length > 1 && kAd ? kAd + ' · ' : '') + (c.seviye || '');
      (gruplu[g] = gruplu[g] || []).push(c);
    });
    Object.keys(gruplu).forEach(function (g) {
      html += '<optgroup label="' + kac(g || kd('ly.siniflarim', 'Sınıflarım')) + '">';
      gruplu[g].forEach(function (c) {
        var v = c.lId + '|' + c.cId;
        html += '<option value="' + kac(v) + '"' + (x.hedef === v ? ' selected' : '') + '>' + kac(c.ad) + '</option>';
      });
      html += '</optgroup>';
    });
    return html;
  }
  function onizlemeCiz() {
    if (!durum || durum.asama !== 'onizleme') return;
    var g = durum.gruplar, html = '';
    if (durum.hatalar.length) {
      html += '<div class="ly-hatalar">' + durum.hatalar.map(function (h) { return '<div><b>' + kac(h.ad) + ':</b> ' + kac(h.metin) + '</div>'; }).join('') + '</div>';
    }
    if (!g.length) {
      html += '<div class="ly-bos"><b>' + kac(kd('ly.bos_bas', 'Dosyada öğrenci listesi bulunamadı.')) + '</b><ul>' +
        '<li>' + kac(kd('ly.bos_1', 'Listede her öğrenci bir satırda olmalı: okul numarası, adı soyadı (ör. «132 Ahmet Yılmaz»).')) + '</li>' +
        '<li>' + kac(kd('ly.bos_2', 'e-Okul\'dan sınıf listesini PDF ya da Excel olarak indirip doğrudan bırakabilirsin.')) + '</li>' +
        '<li>' + kac(kd('ly.bos_3', 'Taranmış (resim) PDF okunmaz; yazılı PDF, Word, Excel ya da TXT kullan.')) + '</li></ul></div>';
      govde(html, '<button type="button" class="ly-vazgec" data-ly="kapat">' + kac(kd('g.tamam', 'Tamam')) + '</button>');
      return;
    }
    var ks = kurumlar(), buyukVar = false;
    g.forEach(function (x) { x.ogr.forEach(function (o) { if (adDuzelt(o.ad) !== o.ad) buyukVar = true; }); });
    if (ks.length > 1 || buyukVar) {
      html += '<div class="ly-ayar">';
      if (ks.length > 1) {
        html += '<label>' + kac(kd('ly.okul', 'Okul')) + ' <select data-ly="kurum">' + ks.map(function (k) {
          return '<option value="' + kac(k.id) + '"' + (k.id === durum.kurumId ? ' selected' : '') + '>' + kac(k.ad) + '</option>';
        }).join('') + '</select></label>';
      }
      if (buyukVar) {
        html += '<label><input type="checkbox" data-ly="duzelt"' + (durum.duzelt ? ' checked' : '') + '> ' + kac(kd('ly.duzelt', 'Adları düzelt')) +
          ' <small>AHMET YILMAZ → Ahmet Yılmaz</small></label>';
      }
      html += '</div>';
    }
    g.forEach(function (x, i) {
      var sy = grupSayilari(x), h = sy.h, not = '', uyari = false;
      if (x.hedef === 'yeni' && !h) {
        var t = seviyeTani(x.yeniAd || '');
        not = (x.yeniAd || '').trim()
          ? kd('ly.not_yeni', 'Yeni sınıf kurulur') + ': «' + (t.no && t.sube ? t.no + t.sube : x.yeniAd.trim()) + '»' + (t.no ? ' (' + t.no + '. ' + kd('ly.sinif', 'sınıf') + ')' : '') + ' · ' + sy.yeni + ' ' + kd('ly.ogrenci', 'öğrenci')
          : kd('ly.not_ad', 'Yeni sınıfın adını yaz (ör. 5A).');
        if (!(x.yeniAd || '').trim()) uyari = true;
      } else if (h) {
        not = '«' + h.cls.name + '» ' + kd('ly.not_var', 'sınıfına eklenir') + ' · ' + sy.yeni + ' ' + kd('ly.yeni', 'yeni') +
          (sy.var_ ? ' · ' + sy.var_ + ' ' + kd('ly.zaten', 'zaten listede') : '');
        if (durum.gruplar.length === 1 && x.g.sinif && durum.acik && x.hedef === durum.acik.lId + '|' + durum.acik.cId) {
          var ak = sinifAnahtari(h.cls.name);
          if (ak !== x.g.sinif.ad) { not += ' — ' + kd('ly.not_fark', 'dosyada') + ' «' + x.g.sinif.ad + '» ' + kd('ly.not_yaziyor', 'yazıyor'); uyari = true; }
        }
      }
      html += '<section class="ly-grup' + (x.secili ? '' : ' kapali') + '" data-g="' + i + '">' +
        '<div class="ly-gust">' +
        '<input type="checkbox" data-ly="sec" aria-label="' + kac(kd('ly.ekle_bunu', 'Bu sınıfı ekle')) + '"' + (x.secili ? ' checked' : '') + '>' +
        '<span class="ly-rozet' + (x.g.sinif ? '' : ' bilinmez') + '">' + kac(x.g.sinif ? x.g.sinif.ad : (x.g.etiket || kd('ly.liste', 'Liste'))) + '</span>' +
        '<span class="ly-sayi"><b>' + x.ogr.length + '</b> ' + kac(kd('ly.ogrenci', 'öğrenci')) + '</span>' +
        '<button type="button" class="ly-gor" data-ly="gor" aria-expanded="' + (x.acikMi ? 'true' : 'false') + '">' + kac(x.acikMi ? kd('ly.gizle', 'Adları gizle ▴') : kd('ly.goster', 'Adları gör ▾')) + '</button>' +
        '<span class="ly-hedef-kap"><span>→</span><select data-ly="hedef" aria-label="' + kac(kd('ly.hedef', 'Hangi sınıfa?')) + '">' + hedefSecenekleri(x) + '</select>' +
        (x.hedef === 'yeni' ? '<input type="text" class="ly-yeniad" data-ly="yeniad" maxlength="24" placeholder="' + kac(kd('ly.ad_ph', 'Sınıf adı, ör. 5A')) + '" value="' + kac(x.yeniAd || '') + '">' : '') +
        '</span></div>' +
        '<p class="ly-gnot' + (uyari ? ' uyari' : '') + '">' + kac(not) + '</p>';
      if (x.acikMi) {
        html += '<ol class="ly-adlar">' + x.ogr.map(function (o, j) {
          var v = h && varMi(h.cls, o);
          return '<li' + (v ? ' class="var"' : '') + '><span class="ly-no">' + kac(o.no || '–') + '</span><span class="ly-ad" title="' + kac(adGoster(o.ad)) + '">' + kac(adGoster(o.ad)) + '</span>' +
            '<button type="button" class="ly-cikar" data-ly="cikar" data-o="' + j + '" title="' + kac(kd('ly.cikar', 'Listeden çıkar')) + '" aria-label="' + kac(kd('ly.cikar', 'Listeden çıkar')) + '">&times;</button></li>';
        }).join('') + '</ol>';
      }
      html += '</section>';
    });
    html += '<p class="ly-gizli">🔒 ' + kac(kd('ly.gizlilik', 'Dosya bilgisayarından dışarı gönderilmez. Listene yalnız ad soyad ve okul numarası yazılır; T.C. kimlik numarası alınmaz. Her öğrenciye giriş kodu verilir.')) + '</p>';
    var top = toplamYeni(), eksik = durum.gruplar.some(function (x) { return x.secili && x.hedef === 'yeni' && !(x.yeniAd || '').trim(); });
    var g0 = $id('lyGovde'), kay = g0 ? g0.scrollTop : 0;
    govde(html,
      '<button type="button" class="ly-vazgec" data-ly="kapat">' + kac(kd('g.vazgec', 'Vazgeç')) + '</button>' +
      '<button type="button" class="ly-ekle" data-ly="ekle"' + (top && !eksik ? '' : ' disabled') + '>' +
      kac(top ? top + ' ' + kd('ly.ogrenciyi_ekle', 'öğrenciyi ekle') : kd('ly.eklenecek_yok', 'Eklenecek öğrenci yok')) + '</button>');
    if (g0) g0.scrollTop = kay;
  }
  function toplamYeni() {
    return durum.gruplar.reduce(function (t, x) { return t + (x.secili ? grupSayilari(x).yeni : 0); }, 0);
  }
  function grupAl(el) { var s = el.closest ? el.closest('.ly-grup') : null; return s ? durum.gruplar[parseInt(s.getAttribute('data-g'), 10)] : null; }
  function pencereTik(e) {
    var k = $id('lyPencere');
    if (e.target === k) { if (!durum || durum.asama !== 'ekleniyor') pencereKapat(); return; }
    var b = e.target.closest ? e.target.closest('[data-ly]') : null;
    if (!b || b.tagName === 'SELECT' || b.tagName === 'INPUT') return;
    var is = b.getAttribute('data-ly');
    if (is === 'kapat') { if (!durum || durum.asama !== 'ekleniyor') pencereKapat(); return; }
    if (!durum) return;
    if (is === 'gor') { var x = grupAl(b); if (x) { x.acikMi = !x.acikMi; onizlemeCiz(); } return; }
    if (is === 'cikar') {
      var y = grupAl(b), j = parseInt(b.getAttribute('data-o'), 10);
      if (y && y.ogr[j]) { y.ogr.splice(j, 1); onizlemeCiz(); }
      return;
    }
    if (is === 'ekle') { uygula(); return; }
    if (is === 'geri') { geriAl(); return; }
    if (is === 'tamam') { pencereKapat(); return; }
  }
  function pencereDegis(e) {
    var b = e.target, is = b.getAttribute && b.getAttribute('data-ly');
    if (!durum || durum.asama !== 'onizleme' || !is) return;
    if (is === 'kurum') { durum.kurumId = b.value; durum.gruplar.forEach(function (x) { x.elle = false; }); hedefleriKur(); onizlemeCiz(); }
    else if (is === 'duzelt') { durum.duzelt = !!b.checked; onizlemeCiz(); }
    else if (is === 'sec') { var x = grupAl(b); if (x) { x.secili = !!b.checked; onizlemeCiz(); } }
    else if (is === 'hedef') { var y = grupAl(b); if (y) { y.hedef = b.value; y.elle = true; onizlemeCiz(); } }
  }
  function pencereYaz(e) {
    var b = e.target;
    if (!durum || durum.asama !== 'onizleme' || !b.getAttribute || b.getAttribute('data-ly') !== 'yeniad') return;
    var x = grupAl(b);
    if (!x) return;
    x.yeniAd = b.value;
    var bas = b.selectionStart, son = b.selectionEnd;
    onizlemeCiz();
    var yeni = document.querySelector('#lyPencere .ly-grup[data-g="' + durum.gruplar.indexOf(x) + '"] input[data-ly="yeniad"]');
    if (yeni) { try { yeni.focus(); yeni.setSelectionRange(bas, son); } catch (z) { } }
  }

  /* ------------------------------------------------------------------
     EKLE · GERİ AL
     ------------------------------------------------------------------ */
  function yeniId(on, var_) { var n = Date.now(); while (var_[on + n]) n++; var_[on + n] = 1; return on + n; }
  function kodlar() {
    var d = veri(), k = {};
    Object.keys(d.levels || {}).forEach(function (l) {
      Object.keys((d.levels[l] && d.levels[l].classes) || {}).forEach(function (c) {
        ((d.levels[l].classes[c] || {}).students || []).forEach(function (s) { if (s && s.loginCode) k[String(s.loginCode).toUpperCase()] = 1; });
      });
    });
    (d.arsiv || []).forEach(function (a) { ((a && a.veri && a.veri.students) || []).forEach(function (s) { if (s && s.loginCode) k[String(s.loginCode).toUpperCase()] = 1; }); });
    return k;
  }
  function kodUret(kullanilan) {
    var hoca = '';
    try { hoca = localStorage.getItem('teacher_static_code') || ''; } catch (e) { }
    hoca = hoca || 'TCH';
    var ch = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', k, deneme = 0;
    do {
      var r = new Uint32Array(4);
      try { crypto.getRandomValues(r); } catch (e) { for (var q = 0; q < 4; q++) r[q] = Math.floor(Math.random() * 4294967296); }
      k = '';
      for (var i = 0; i < 4; i++) k += ch.charAt(r[i] % ch.length);
      k = (hoca + '-' + k).toUpperCase();
    } while (kullanilan[k] && ++deneme < 500);
    kullanilan[k] = 1;
    return k;
  }
  function sinifKur(ad, kurumId, idler) {
    var d = veri(), t = seviyeTani(ad), lId = null, ss = { seviye: false, sinif: false };
    ad = String(ad).trim();
    var cad = (t.no && t.sube) ? t.no + t.sube : ad;
    if (t.no) {
      (d.levelOrder || []).concat(Object.keys(d.levels)).forEach(function (id) {
        var l = d.levels[id];
        if (!lId && l && (l.kurumId || null) === (kurumId || null) && seviyeTani(l.name).no === t.no) lId = id;
      });
    }
    if (!lId) {
      lId = yeniId('L', idler);
      var tas = (typeof window.llSeviyeTaslak === 'function') ? window.llSeviyeTaslak(t.no ? t.no + '. sınıf' : ad, kurumId)
        : { name: t.no ? t.no + '. sınıf' : ad, kurumId: kurumId || undefined, classes: {}, planText: {}, config: { hw: [], ex: [] } };
      d.levels[lId] = tas;
      if (!d.levelOrder) d.levelOrder = [];
      d.levelOrder.push(lId);
      ss.seviye = true;
    }
    var lvl = d.levels[lId], cId = null, k = sinifAnahtari(cad);
    if (!lvl.classes) lvl.classes = {};
    Object.keys(lvl.classes).forEach(function (c) { if (!cId && sinifAnahtari(lvl.classes[c].name || '') === k) cId = c; });
    if (!cId) { cId = yeniId('C', idler); lvl.classes[cId] = { name: cad, students: [] }; ss.sinif = true; }
    return { lId: lId, cId: cId, yeniSeviye: ss.seviye, yeniSinif: ss.sinif };
  }
  function uygula() {
    if (!durum || durum.asama !== 'onizleme') return;
    try { if (typeof window.llSaltGorunumMu === 'function' && window.llSaltGorunumMu()) { bilgiVer(kd('ly.giris', 'Öğrenci eklemek için önce giriş yap.'), kd('ly.giris_bas', 'Giriş gerekiyor')); return; } } catch (e) { }
    try {
      var u = window.firebase && firebase.auth && firebase.auth().currentUser;
      if (u && window._llBulutGeldi !== u.uid && window._llBulutHata !== u.uid) {
        bilgiVer(kd('ly.inmedi', 'Sınıfların daha yükleniyor. Birkaç saniye sonra «Ekle»ye yeniden bas.'));
        try { if (typeof window.verileriGetir === 'function' && window._llLoadedUid !== u.uid) { window._llLoadedUid = u.uid; window.verileriGetir(u.uid); } } catch (x) { }
        return;
      }
    } catch (e) { }
    var d = veri();
    if (!d) return;
    if (!d.levels) d.levels = {};
    var once = JSON.stringify(d), acikOnce = acikSinifAl();
    var idler = {};
    Object.keys(d.levels).forEach(function (l) { idler[l] = 1; Object.keys((d.levels[l] && d.levels[l].classes) || {}).forEach(function (c) { idler[c] = 1; }); });
    var kul = kodlar(), sonuc = { ogrenci: 0, sinif: 0, seviye: 0, var_: 0, no: 0, ilk: null, hedefler: [] };
    durum.asama = 'ekleniyor';
    try {
      durum.gruplar.forEach(function (x) {
        if (!x.secili || !x.ogr.length) return;
        var h = hedefSinif(x), yer;
        if (h) yer = { lId: h.lId, cId: h.cId };
        else if (x.hedef === 'yeni' && (x.yeniAd || '').trim()) {
          yer = sinifKur(x.yeniAd, durum.kurumId, idler);
          if (yer.yeniSinif) sonuc.sinif++;
          if (yer.yeniSeviye) sonuc.seviye++;
        } else return;
        var cls = d.levels[yer.lId].classes[yer.cId];
        if (!Array.isArray(cls.students)) cls.students = [];
        var eklendi = 0;
        x.ogr.forEach(function (o) {
          var ad = (durum.duzelt ? adDuzelt(o.ad) : o.ad).trim();
          var k = adAnahtar(ad), mevcut = null;
          cls.students.forEach(function (s) {
            if (mevcut) return;
            if (adAnahtar(s.name || '') === k || (o.no && s.numara != null && String(s.numara) === String(o.no))) mevcut = s;
          });
          if (mevcut) {
            sonuc.var_++;
            if (o.no && (mevcut.numara == null || mevcut.numara === '') && !cls.students.some(function (s) { return String(s.numara) === String(o.no); })) { mevcut.numara = String(o.no); sonuc.no++; }
            return;
          }
          var yeni = {
            name: ad,
            loginCode: kodUret(kul),
            hw: [], ex: [], history: [], personalMissions: [],
            skills: { 'Konuşma': 5, 'Yazma': 5, 'Okuma': 5, 'Vezin': 5, 'Sözlük': 5, 'Tercüme': 5 },
            notes: ''
          };
          if (o.no) yeni.numara = String(o.no);
          cls.students.push(yeni);
          eklendi++; sonuc.ogrenci++;
        });
        if (!sonuc.ilk) sonuc.ilk = yer;
        sonuc.hedefler.push({ lId: yer.lId, cId: yer.cId, ad: cls.name, eklendi: eklendi });
      });
    } catch (e) {
      try { console.warn('listeyukle uygula', e); } catch (x) { }
      try { data = JSON.parse(once); } catch (x) { }
      durum.asama = 'onizleme';
      bilgiVer(kd('ly.hata', 'Öğrenciler eklenemedi; hiçbir şey değişmedi.'));
      return;
    }
    try { if (typeof window.save === 'function') window.save(); } catch (e) { try { console.warn('listeyukle save', e); } catch (x) { } }
    durum.geri = { veri: once, acik: acikOnce };
    durum.sonuc = sonuc;
    durum.asama = 'bitti';
    try {
      var ilk = sonuc.ilk;
      if (gorunur($id('llOkulPopup')) && typeof window.llOkulPopupAc === 'function') window.llOkulPopupAc();   /* okul penceresi yeni sınıflarla */
      else if (ilk && typeof window.selectClass === 'function') {
        window.selectClass(ilk.lId, ilk.cId);
        try { if (typeof window.llNotModSec === 'function') window.llNotModSec('liste'); } catch (e) { }
      }
    } catch (e) { }
    sonucCiz();
  }
  function sonucCiz() {
    var s = durum.sonuc, parca = [];
    if (s.sinif) parca.push(s.sinif + ' ' + kd('ly.sinif_kuruldu', 'sınıf kuruldu'));
    if (s.var_) parca.push(s.var_ + ' ' + kd('ly.zaten_vardi', 'öğrenci zaten listedeydi'));
    if (s.no) parca.push(s.no + ' ' + kd('ly.no_eklendi', 'öğrencinin okul numarası eklendi'));
    var hed = s.hedefler.length <= 6 ? s.hedefler.map(function (h) { return h.ad + ' (' + h.eklendi + ')'; }).join(' · ') : '';
    govde('<div class="ly-sonuc"><div class="ly-tik" aria-hidden="true">✓</div><b>' +
      kac(s.ogrenci ? s.ogrenci + ' ' + kd('ly.ogrenci_eklendi', 'öğrenci eklendi') : kd('ly.yeni_yok', 'Yeni öğrenci yok')) + '</b>' +
      (parca.length ? '<div>' + kac(parca.join(' · ')) + '</div>' : '') +
      (hed ? '<div style="margin-top:6px;font-size:.9rem;color:#8B6A57">' + kac(hed) + '</div>' : '') +
      (s.ogrenci ? '<div style="margin-top:8px;font-size:.88rem;color:#8B6A57">' + kac(kd('ly.kod_hazir', 'Her öğrencinin giriş kodu hazır; listede kodun üstüne dokununca görünür.')) + '</div>' : '') +
      '</div>',
      '<button type="button" class="ly-geri" data-ly="geri">' + kac(kd('ly.geri_al', 'Geri al')) + '</button>' +
      '<button type="button" class="ly-ekle" data-ly="tamam">' + kac(kd('g.tamam', 'Tamam')) + '</button>');
    setTimeout(function () { try { var t = document.querySelector('#lyPencere [data-ly="tamam"]'); if (t) t.focus({ preventScroll: true }); } catch (e) { } }, 60);
  }
  function geriAl() {
    if (!durum || !durum.geri) return;
    var g = durum.geri;
    try { data = JSON.parse(g.veri); } catch (e) { return; }
    try { if (typeof window.save === 'function') window.save(); } catch (e) { }
    try {
      if (gorunur($id('llOkulPopup')) && typeof window.llOkulPopupAc === 'function') window.llOkulPopupAc();
      else if (g.acik && data.levels[g.acik.lId] && typeof window.selectClass === 'function') window.selectClass(g.acik.lId, g.acik.cId);
      else {
        try { curLId = null; curCId = null; } catch (e) { }
        if (typeof window.showLLPlaceholder === 'function') window.showLLPlaceholder();
      }
    } catch (e) { }
    pencereKapat();
    bilgiVer(kd('ly.geri_alindi', 'Ekleme geri alındı; listeler eski hâline döndü.'));
  }

  /* ------------------------------------------------------------------
     BIRAKMA ALANLARI, PERDE, DOSYA SEÇ
     ------------------------------------------------------------------ */
  var secici = null;
  function dosyaSec(baglam) {
    if (!secici) {
      secici = document.createElement('input');
      secici.type = 'file';
      secici.multiple = true;
      secici.accept = '.pdf,.docx,.doc,.txt,.csv,.xlsx,.xls,.htm,.html,application/pdf,text/plain,text/csv';
      secici.style.display = 'none';
      secici.id = 'lyDosya';
      secici.addEventListener('change', function () {
        var f = Array.prototype.slice.call(secici.files || []);
        var b = secici._baglam;
        secici.value = '';
        if (f.length) dosyalariAl(f, b);
      });
      document.body.appendChild(secici);
    }
    secici._baglam = baglam || {};
    secici.click();
  }
  function alanKur() {
    stilEkle();
    var tablo = $id('stuTable'), liste = $id('llModListe');
    if (tablo && liste && !$id('lyAlan')) {
      var a = document.createElement('div');
      a.id = 'lyAlan';
      a.innerHTML = SIMGE + '<div class="ly-yazi"><b>' + kac(kd('ly.alan_bas', 'Liste dosyasından ekle')) + '</b><span>' +
        kac(kd('ly.alan_alt', 'PDF, Word ya da TXT dosyasını buraya sürükle bırak; e-Okul listeleri de olur. Dosyada birden çok sınıf varsa sınıflar kendiliğinden kurulur.')) +
        '</span></div><button type="button" class="ly-sec">' + kac(kd('ly.sec', 'Dosya seç')) + '</button>';
      a.querySelector('.ly-sec').addEventListener('click', function () { dosyaSec({ acikSinif: acikSinifAl() }); });
      tablo.parentNode.insertBefore(a, tablo);
    }
    var ip = $id('ll-select-hint');
    if (ip && !$id('lyIpucu')) {
      var c = document.createElement('div');
      c.id = 'lyIpucu';
      c.innerHTML = SIMGE + '<div class="ly-yazi"><b>' + kac(kd('ly.ip_bas', 'Sınıf listen hazır mı?')) + '</b>' +
        kac(kd('ly.ip_alt', 'e-Okul listesini ya da kendi listeni (PDF, Word, TXT) buraya sürükle bırak; sınıflar ve öğrenciler kendiliğinden kurulur.')) +
        '</div><button type="button" class="ly-sec">' + kac(kd('ly.sec', 'Dosya seç')) + '</button>';
      c.querySelector('.ly-sec').addEventListener('click', function () { dosyaSec({ acikSinif: null }); });
      ip.appendChild(c);
    }
  }
  var icSurukle = false, perdeAcik = false, perdeZaman = 0;
  function dosyaSuruklemesi(e) {
    if (icSurukle || !e.dataTransfer) return false;
    var t = e.dataTransfer.types;
    if (!t) return false;
    for (var i = 0; i < t.length; i++) if (t[i] === 'Files') return true;
    return false;
  }
  function perdeAc() {
    perdeZaman = Date.now();
    if (perdeAcik) return;
    stilEkle();
    var p = $id('lyPerde');
    if (!p) {
      p = document.createElement('div');
      p.id = 'lyPerde';
      p.innerHTML = '<div class="ly-perde-kutu">' + SIMGE + '<b>' + kac(kd('ly.perde_bas', 'Bırak, öğrenciler listene eklensin')) + '</b><span>' +
        kac(kd('ly.perde_alt', 'PDF, Word, Excel ya da TXT · e-Okul listeleri de olur · önce önizleme açılır')) + '</span></div>';
      document.body.appendChild(p);
    }
    perdeAcik = true;
  }
  function perdeKapat() {
    var p = $id('lyPerde');
    if (p && p.parentNode) p.parentNode.removeChild(p);
    perdeAcik = false;
    document.querySelectorAll('.ly-ust-uzerinde').forEach(function (x) { x.classList.remove('ly-ust-uzerinde'); });
  }
  function dinleyicileriKur() {
    document.addEventListener('dragstart', function () { icSurukle = true; }, true);
    document.addEventListener('dragend', function () { icSurukle = false; }, true);
    document.addEventListener('dragenter', function (e) {
      if (!dosyaSuruklemesi(e) || !etkin(e)) return;
      e.preventDefault();
      perdeAc();
    }, true);
    document.addEventListener('dragover', function (e) {
      if (!dosyaSuruklemesi(e) || !(perdeAcik || etkin(e))) return;
      e.preventDefault();
      try { e.dataTransfer.dropEffect = 'copy'; } catch (x) { }
      perdeAc();
      var a = e.target && e.target.closest ? e.target.closest('#lyAlan,#lyIpucu') : null;
      document.querySelectorAll('.ly-ust-uzerinde').forEach(function (x) { if (x !== a) x.classList.remove('ly-ust-uzerinde'); });
    }, true);
    document.addEventListener('dragleave', function (e) {
      if (!perdeAcik) return;
      if (!e.relatedTarget || e.clientX <= 0 || e.clientY <= 0 || e.clientX >= innerWidth || e.clientY >= innerHeight) {
        setTimeout(function () { if (Date.now() - perdeZaman > 120) perdeKapat(); }, 150);
      }
    }, true);
    document.addEventListener('drop', function (e) {
      if (!dosyaSuruklemesi(e) || !(perdeAcik || etkin(e))) { if (perdeAcik) perdeKapat(); return; }
      e.preventDefault();
      e.stopPropagation();
      perdeKapat();
      var f = Array.prototype.slice.call((e.dataTransfer && e.dataTransfer.files) || []);
      if (f.length) dosyalariAl(f, {});
    }, true);
    window.addEventListener('blur', function () { if (perdeAcik) setTimeout(function () { if (Date.now() - perdeZaman > 400) perdeKapat(); }, 450); });
  }
  function basla() {
    alanKur();
    /* Listelerim sonradan çizilirse (yönlendirici) alanları yeniden dene */
    var deneme = 0, t = setInterval(function () {
      alanKur();
      if (($id('lyAlan') && $id('lyIpucu')) || ++deneme > 40) clearInterval(t);
    }, 1500);
  }
  if (typeof document !== 'undefined') {
    dinleyicileriKur();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
    else basla();
  }

  window.KidefListeYukle = {
    coz: coz, belgeCoz: belgeCoz, dosyaOku: dosyaOku, dosyalariAl: dosyalariAl, dosyaSec: dosyaSec,
    sinifBul: sinifBul, adDuzelt: adDuzelt, pdfjsHazirla: pdfjsHazirla, parcala: parcala, metinSatirlar: metinSatirlar, _satirIncele: satirIncele,
    _durum: function () { return durum; }
  };
})();
