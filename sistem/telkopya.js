/* =====================================================================
   KİDEF · TELEFONU TEK TIKLA KOPYALA     (sistem/telkopya.js)
   ---------------------------------------------------------------------
   Öğretmen (05.10.2026): "yönetici siteye giriş yapınca öğretmen
   onaylarını yaparken öğretmen telefonunu kolayca kopyalayabilsin."

   Öncesinde telefon onay satırında düz yazıydı ("… · 5321234567"):
   kopyalamak için fareyle tam seçmek gerekiyordu, satırda e-posta ve
   meslek de aynı yazının içinde olduğu için seçim sürekli kayıyordu.

   BU DOSYA NE YAPAR
     · KidefTelKopya.rozet(tel) → tıklanınca numarayı panoya kopyalayan
       küçük bir düğme (HTML metni) döndürür.
     · Tıklamayı TEK bir yerden (belge üstünde) dinler; satırlar her
       yeniden çizildiğinde olay bağlamak gerekmiyor, inline onclick
       içinde tırnak kaçırma derdi de yok.
     · Numarayı okunur yazar (0532 123 45 67), KOPYALARKEN boşluksuz
       verir (05321234567) — telefon ve WhatsApp bu hâlini kabul ediyor.
     · Biçimi tanımadığı numarayı olduğu gibi gösterir ve kopyalar;
       yani veri ne hâlde olursa olsun düğme çalışır.

   NEREDE KULLANILIYOR
     hesap/teacher-admin.js → Öğretmen Onayları listesi
                            → Öğretmenler tablosu
   Başka bir yere eklemek için: ilgili HTML'de telefonun yerine
   KidefTelKopya.rozet(numara) yazmak yeter.

   NOT — PANOYA YAZMA: navigator.clipboard yalnız güvenli bağlamda
   (https / localhost) çalışıyor. Site https olduğu için sorun yok; yine
   de eski tarayıcılar için gizli bir alan + execCommand yedeği var.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefTelKopya) return;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Sayfadaki her türlü yazımı ortak bir hâle getirir: 5XXXXXXXXX,
     0 5XX…, +90 5XX…, aralarında boşluk/tire olanlar. */
  function duzelt(t) {
    var d = String(t == null ? '' : t).replace(/\D/g, '');
    if (d.length === 12 && d.slice(0, 2) === '90') d = '0' + d.slice(2);
    else if (d.length === 13 && d.slice(0, 3) === '090') d = '0' + d.slice(3);
    else if (d.length === 10 && d.charAt(0) === '5') d = '0' + d;
    return d;
  }
  function gosterim(t) {
    var d = duzelt(t);
    if (d.length === 11 && d.charAt(0) === '0') {
      return d.slice(0, 4) + ' ' + d.slice(4, 7) + ' ' + d.slice(7, 9) + ' ' + d.slice(9);
    }
    return String(t == null ? '' : t);     /* tanımadıysa olduğu gibi */
  }
  function kopyaMetni(t) {
    var d = duzelt(t);
    return (d.length === 11 && d.charAt(0) === '0') ? d : String(t == null ? '' : t).trim();
  }

  var SVG_TEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M6.3 3.6h3l1.5 3.8-1.9 1.2a11 11 0 0 0 4.5 4.5l1.2-1.9 3.8 1.5v3a1.8 1.8 0 0 1-2 1.8' +
    'A14.6 14.6 0 0 1 4.5 5.6a1.8 1.8 0 0 1 1.8-2z"/></svg>';
  var SVG_KOPYA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="9" y="9" width="11" height="11" rx="2.2"/>' +
    '<path d="M5.5 15H5a1.9 1.9 0 0 1-1.9-1.9V5A1.9 1.9 0 0 1 5 3.1h8.1A1.9 1.9 0 0 1 15 5v.5"/></svg>';
  var SVG_TAMAM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  /* Numarası olmayan kayıtta düğme basılmaz — boş rozet kafa karıştırır. */
  function rozet(tel) {
    var ham = String(tel == null ? '' : tel).trim();
    if (!ham || ham === 'Belirtilmedi' || !/\d/.test(ham)) return '';
    return '<button type="button" class="tk-roz" data-tel="' + esc(kopyaMetni(ham)) + '" ' +
           'title="Numarayı kopyala" aria-label="Telefon numarasını kopyala: ' + esc(gosterim(ham)) + '">' +
           '<span class="tk-ik tk-tel">' + SVG_TEL + '</span>' +
           '<span class="tk-no">' + esc(gosterim(ham)) + '</span>' +
           '<span class="tk-ik tk-kop">' + SVG_KOPYA + '</span>' +
           '</button>';
  }

  function panoyaYaz(metin) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(metin);
      }
    } catch (e) {}
    /* Eski tarayıcı yedeği */
    return new Promise(function (coz, red) {
      try {
        var a = document.createElement('textarea');
        a.value = metin;
        a.setAttribute('readonly', '');
        a.style.position = 'fixed';
        a.style.top = '-1000px';
        document.body.appendChild(a);
        a.select();
        var oldu = document.execCommand('copy');
        document.body.removeChild(a);
        oldu ? coz() : red(new Error('execCommand'));
      } catch (e) { red(e); }
    });
  }

  function geriBildir(dugme, oldu) {
    var no = dugme.querySelector('.tk-no');
    var kop = dugme.querySelector('.tk-kop');
    if (!no || !kop || dugme.__tkMesgul) return;
    dugme.__tkMesgul = 1;
    var eskiNo = no.textContent, eskiKop = kop.innerHTML;
    no.textContent = oldu ? 'Kopyalandı' : 'Kopyalanamadı';
    kop.innerHTML = oldu ? SVG_TAMAM : eskiKop;
    dugme.classList.add(oldu ? 'tk-oldu' : 'tk-olmadi');
    setTimeout(function () {
      no.textContent = eskiNo;
      kop.innerHTML = eskiKop;
      dugme.classList.remove('tk-oldu', 'tk-olmadi');
      dugme.__tkMesgul = 0;
    }, 1400);
  }

  /* Tek dinleyici: liste her yeniden çizildiğinde yeniden bağlamak yok. */
  document.addEventListener('click', function (e) {
    var d = e.target && e.target.closest ? e.target.closest('[data-tel]') : null;
    if (!d) return;
    e.preventDefault();
    e.stopPropagation();                 /* satırın kendi tıklaması tetiklenmesin */
    var metin = d.getAttribute('data-tel') || '';
    if (!metin) return;
    panoyaYaz(metin).then(function () { geriBildir(d, true); },
                         function () { geriBildir(d, false); });
  }, true);

  /* Biçim — dosyanın kendi içinde, ayrı css dosyası gerekmesin. */
  (function stil() {
    if (document.getElementById('tk-stil')) return;
    var s = document.createElement('style');
    s.id = 'tk-stil';
    s.textContent = [
      '.tk-roz{display:inline-flex;align-items:center;gap:6px;vertical-align:middle;',
      '  margin:2px 0;padding:4px 10px 4px 8px;border:1px solid #D7E3EF;border-radius:999px;',
      '  background:#F4F9FD;color:#2C6E8F;font:inherit;font-size:.86rem;font-weight:600;',
      '  cursor:pointer;line-height:1.2;transition:background .15s,border-color .15s,transform .1s}',
      '.tk-roz:hover{background:#E7F3FB;border-color:#B9D6EA}',
      '.tk-roz:active{transform:scale(.97)}',
      '.tk-roz:focus-visible{outline:2px solid #16A085;outline-offset:2px}',
      '.tk-roz .tk-ik{display:inline-flex;width:15px;height:15px;flex:0 0 auto}',
      '.tk-roz .tk-ik svg{width:100%;height:100%}',
      '.tk-roz .tk-no{letter-spacing:.2px;white-space:nowrap}',
      '.tk-roz .tk-kop{opacity:.6}',
      '.tk-roz:hover .tk-kop{opacity:1}',
      '.tk-roz.tk-oldu{background:#E6FAF3;border-color:#9FE0CB;color:#0E7C66}',
      '.tk-roz.tk-oldu .tk-kop{opacity:1}',
      '.tk-roz.tk-olmadi{background:#FDECEA;border-color:#F3B9B3;color:#C0392B}'
    ].join('');
    (document.head || document.documentElement).appendChild(s);
  })();

  window.KidefTelKopya = { rozet: rozet, duzelt: duzelt, gosterim: gosterim };
})();
