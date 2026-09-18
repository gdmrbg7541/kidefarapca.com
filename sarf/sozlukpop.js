/* =========================================================================
   KİDEF — AÇILIR SÖZLÜK                                        (index.html)
   -------------------------------------------------------------------------
   Başlıktaki animasyonlu sözlük simgesi bunu açar: sozluk.html bir çerçeve
   (iframe) içinde, sayfadan çıkmadan. Öğretmen anlatırken bir kelimeye
   bakıp kaldığı yerden devam edebilsin diye pencere:
     · köşesinden tutulup BÜYÜTÜLEBİLİR (Geylani: "popup şeklinde ama
       büyütülebilir olmalı"),
     · başlıktaki ⛶ tuşu sözlüğü YENİ SEKMEDE tam sayfa açar,
     · boyutu hatırlanır (localStorage).
   Sözlüğün kendisi sozluk.html'de; burada yalnız pencere var.
   ========================================================================= */
(function () {
    'use strict';

    var ANAHTAR = 'kidef_sozluk_pencere';
    var perde = null, kutu = null, cerceve = null;

    function olcuYukle() {
        try {
            var o = JSON.parse(localStorage.getItem(ANAHTAR) || 'null');
            if (o && typeof o === 'object') return o;
        } catch (e) { }
        return null;
    }
    function olcuYaz() {
        if (!kutu) return;
        try {
            /* Yalnız ÖLÇÜ hatırlanıyor. "Tam ekran" durumu kalktı: o tuş
               artık yeni sekme açıyor, pencerenin büyütülmüş hâli yok. */
            localStorage.setItem(ANAHTAR, JSON.stringify({
                g: kutu.style.width || '', y: kutu.style.height || ''
            }));
        } catch (e) { }
    }

    /* ---- ARKA SAYFAYI KİLİTLE ----------------------------------------
       Pencere açıkken iki parmakla index kayıyordu. Sebep: kilit yalnız
       body'ye konuyordu, index'te ise "html { overflow-y: scroll }" var —
       html'in overflow'u "visible" olmadığı için body'ninki görüntü alanına
       HİÇ geçmiyor, yani kilit hiçbir şey yapmıyordu (ölçüldü: arka sayfa
       209'dan 2220'ye kaydı). Kilit artık asıl kaydırılan öğeye de konuyor.
       Çubuk gizlenince sayfa yana sıçramasın diye çubuğun kapladığı kadar
       sağ dolgu veriliyor (macOS'ta bu 0'dır, dolgu da konmaz). */
    var _kilit = null;
    function kaydirmaKilitle() {
        if (_kilit) return;
        var h = document.documentElement, g = document.body;
        var bosluk = window.innerWidth - h.clientWidth;
        _kilit = { hOv: h.style.overflow, hPad: h.style.paddingRight, gOv: g.style.overflow };
        h.style.overflow = 'hidden';
        g.style.overflow = 'hidden';
        if (bosluk > 0) h.style.paddingRight = bosluk + 'px';
    }
    function kaydirmaAc() {
        if (!_kilit) return;
        var h = document.documentElement, g = document.body;
        h.style.overflow = _kilit.hOv;
        h.style.paddingRight = _kilit.hPad;
        g.style.overflow = _kilit.gOv;
        _kilit = null;
    }

    /* Kayıtlı ölçüyü UYGULA — ama bu ekranda anlamlıysa. Çok dar ya da
       ekrandan taşan bir kayıt (başka/daha küçük bir ekranda bırakılmış
       olabilir) yok sayılır, pencere varsayılanıyla açılır. */
    function olcuUygula() {
        var o = olcuYukle(); if (!o || !kutu) return;
        var g = parseFloat(o.g), y = parseFloat(o.y);
        var gAz = 340, gCok = window.innerWidth * 0.96;
        var yAz = 320, yCok = window.innerHeight * 0.94;
        if (g >= gAz && g <= gCok) kutu.style.width = g + 'px';
        if (y >= yAz && y <= yCok) kutu.style.height = y + 'px';
    }
    function olcuSifirla() {
        if (!kutu) return;
        kutu.style.width = '';
        kutu.style.height = '';
        try { localStorage.removeItem(ANAHTAR); } catch (e) { }
    }

    function stilKur() {
        if (document.getElementById('szp-stil')) return;
        var s = document.createElement('style');
        s.id = 'szp-stil';
        s.textContent =
            '#szp-perde{position:fixed;inset:0;z-index:100050;display:none;' +
            'align-items:center;justify-content:center;padding:18px;' +
            /* perdenin üstündeki kaydırma alttaki sayfaya geçmesin */
            'overscroll-behavior:contain;touch-action:none;' +
            'background:rgba(18,24,33,.5);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}' +
            '#szp-perde.acik{display:flex}' +
            '#szp-kutu{position:relative;display:flex;flex-direction:column;' +
            'width:min(880px,94vw);height:min(660px,88vh);min-width:340px;min-height:320px;' +
            'max-width:96vw;max-height:94vh;resize:both;overflow:hidden;' +
            'background:#fff;border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.4);' +
            'animation:szpGel .22s cubic-bezier(.22,1,.36,1)}' +
            '@keyframes szpGel{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}' +
            '#szp-bas{flex:0 0 auto;display:flex;align-items:center;gap:10px;padding:9px 12px;' +
            'background:linear-gradient(120deg,#16A085,#0E7C66);color:#fff;font-weight:800;' +
            "font-family:'Marhey',system-ui,sans-serif;font-size:1.02rem}" +
            '#szp-bas .szp-ad{display:flex;align-items:center;gap:8px}' +
            '#szp-bas svg{width:21px;height:21px;display:block}' +
            '#szp-bas .szp-tus{margin-inline-start:auto;display:flex;gap:6px}' +
            '#szp-bas button{border:0;background:rgba(255,255,255,.18);color:#fff;cursor:pointer;' +
            'width:32px;height:32px;border-radius:9px;font-size:1rem;line-height:1;font-family:inherit;' +
            'display:grid;place-items:center;transition:background .15s}' +
            '#szp-bas button:hover{background:rgba(255,255,255,.34)}' +
            '#szp-cerceve{flex:1 1 auto;width:100%;border:0;display:block;background:#EEF1F5}' +
            /* sağ alt köşedeki tutamak görünür olsun: resize:both varsayılanı silik */
            '#szp-kutu::after{content:"";position:absolute;right:2px;bottom:2px;width:16px;height:16px;' +
            'pointer-events:none;opacity:.5;' +
            'background:linear-gradient(135deg,transparent 45%,#94a3b8 45%,#94a3b8 55%,transparent 55%,' +
            'transparent 70%,#94a3b8 70%,#94a3b8 80%,transparent 80%)}' +
            /* YÜZEN "KAMUS" DÜĞMESİ — index'te Sarf Motoru ile İletişim
               arasında durur (Geylani: "kamus index teki header kısmı yerine
               sarf motorunun üstünde olsun, iletişim popup ın altında
               olsun"). Dikey konumu index'teki positionFeedbackFab()
               hesaplar, BAŞLANGIÇ konumu da index.html'in kendi stilinde
               (bu dosya sonradan yüklendiği için ilk karede geç kalıyordu);
               burası yalnız biçim. Sarf Motoru'nun hapıyla aynı kalıp,
               sözlüğün kendi yeşili. */
            /* Hap İKİ SAYFA gibi kuruldu: gövde (sol sayfa + oluk + sağ sayfa) ve
               açılışta bir kez dönen sayfa. Zemin/dolgu artık bağlantının
               kendisinde değil .kb-govde'de; bağlantı yalnız konum kutusu,
               böylece dönen sayfa kırpılmadan üstünde durabiliyor. */
            '#kamusFab{display:inline-flex;align-items:center;color:#fff;' +
            'background:none;padding:0;box-shadow:none;border-radius:30px;' +
            'line-height:1;perspective:900px}' +
            /* İKİ EŞİT SAYFA: inline-grid'de 1fr|1px|1fr iki sütunu da geniş
               olanın enine eşitliyor. Eşit olmaları şart — dönen sayfa
               oluğun solundaki yarıya katlanıyor; yarılar eşit değilse
               katlı sayfa hapın solundan taşıyordu (ölçüldü: 20px). */
            '#kamusFab .kb-govde{display:inline-grid;align-items:center;' +
            'grid-template-columns:1fr 1px 1fr;column-gap:9px;' +
            'background:linear-gradient(120deg,#16A085,#0E7C66);' +
            'padding:11px 17px;border-radius:30px;line-height:1;' +
            'box-shadow:0 4px 12px rgba(0,0,0,.22)}' +
            '#kamusFab .kb-govde>*{justify-self:center}' +
            '#kamusFab:hover .kb-govde{background:linear-gradient(120deg,#1ABC9C,#12907A)}' +
            /* oluk: iki sayfanın arası — kitap cildi gibi ince bir çizgi */
            '#kamusFab .kb-oluk{width:1px;align-self:stretch;margin:2px 0;' +
            'background:rgba(255,255,255,.32);border-radius:1px;flex:0 0 auto}' +
            /* Yazı TAM BEYAZ ve belirgin (Geylani: "kamus yazısı daha beyaz
               ve belirgin olsun"): gölgeli, geniş harf aralıklı, kalın. */
            "#kamusFab .szp-ad{font-family:'Marhey',system-ui,sans-serif;" +
            'font-size:1.02rem;font-weight:700;letter-spacing:.06em;' +
            'color:#fff;opacity:1;text-shadow:0 1px 3px rgba(0,0,0,.35)}' +
            '#kamusFab .szp-ik{width:26px;height:26px;overflow:visible;flex:0 0 auto}' +
            '@media(max-width:768px){#kamusFab .kb-govde{padding:10px 14px}' +
            '#kamusFab .szp-ad{font-size:.95rem}#kamusFab .szp-ik{width:23px;height:23px}}' +
            '#kamusFab .szp-mercek{transform-box:fill-box;transform-origin:50% 50%;' +
            'animation:szpMercek 4.2s ease-in-out infinite}' +
            '@keyframes szpMercek{0%,100%{transform:translate(0,0)}' +
            '30%{transform:translate(-3.5px,-2.5px)}60%{transform:translate(2.5px,1.5px)}}' +
            '#kamusFab .szp-sayfa{transform-box:fill-box;transform-origin:50% 100%;' +
            'animation:szpSayfa 4.2s ease-in-out infinite}' +
            '@keyframes szpSayfa{0%,58%,100%{transform:rotateX(0);opacity:1}' +
            '70%{transform:rotateX(-55deg);opacity:.55}82%{transform:rotateX(0);opacity:1}}' +
            '#kamusFab .szp-parilti{animation:szpParilti 4.2s ease-in-out infinite}' +
            '@keyframes szpParilti{0%,42%,100%{opacity:0}50%{opacity:1}58%{opacity:0}}' +
            '@media (prefers-reduced-motion:reduce){#kamusFab .szp-ik *{animation:none!important}}' +
            'html.dusuk-guc #kamusFab .szp-ik *{animation:none!important}';
        document.head.appendChild(s);
    }

    function kur() {
        if (perde) return;
        stilKur();
        perde = document.createElement('div');
        perde.id = 'szp-perde';
        perde.innerHTML =
            '<div id="szp-kutu" role="dialog" aria-modal="true" aria-label="Sözlük">' +
              '<div id="szp-bas" title="Boyutu sıfırlamak için çift tıkla">' +
                '<span class="szp-ad">' +
                  '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">' +
                    '<path d="M8 10a4 4 0 0 1 4-4h10a5 5 0 0 1 5 5v29a4 4 0 0 0-4-4H12a4 4 0 0 1-4-4z" fill="#fff" opacity=".92"/>' +
                    '<path d="M40 10a4 4 0 0 0-4-4H26a5 5 0 0 0-5 5v29a4 4 0 0 1 4-4h11a4 4 0 0 0 4-4z" fill="#fff" opacity=".7"/>' +
                    '<circle cx="33" cy="30" r="8" fill="none" stroke="#F39C12" stroke-width="3.2"/>' +
                    '<line x1="39" y1="36" x2="45" y2="42" stroke="#F39C12" stroke-width="3.6" stroke-linecap="round"/>' +
                  '</svg>Sözlük</span>' +
                '<span class="szp-tus">' +
                  '<button type="button" id="szp-tam" title="Tam sayfa aç (yeni sekme)" aria-label="Tam sayfa aç">⛶</button>' +
                  '<button type="button" id="szp-kapat" title="Kapat" aria-label="Kapat">✕</button>' +
                '</span>' +
              '</div>' +
              '<iframe id="szp-cerceve" title="Sözlük" loading="lazy"></iframe>' +
            '</div>';
        document.body.appendChild(perde);
        kutu = perde.querySelector('#szp-kutu');
        cerceve = perde.querySelector('#szp-cerceve');

        perde.addEventListener('click', function (e) { if (e.target === perde) kapat(); });
        perde.querySelector('#szp-kapat').addEventListener('click', kapat);
        /* TAM EKRAN = YENİ SEKME (Geylani: "popup tam ekrana çevrildiğinde
           ayrı sekmede açılsın, kapatılırsa sekme kapansın, ama index te
           küçük hali kalsın aynı şekilde"). Çerçeve içinde büyütmek yerine
           sözlüğü tam sayfa açıyoruz; o sekmenin geri tuşu (sistem/geri.js)
           window.opener'ı görüp sekmeyi kapatıyor, altta index kalıyor.
           Yazılmış sorgu da beraber gidiyor, öğretmen baştan yazmasın. */
        perde.querySelector('#szp-tam').addEventListener('click', function () {
            var q = '';
            try {
                var g = cerceve.contentWindow.document.getElementById('szkGiris');
                if (g) q = g.value.trim();
            } catch (h) { }
            window.open('sozluk.html?v=3' + (q ? '&q=' + encodeURIComponent(q) : ''), '_blank');
            kapat();
        });
        /* Kullanıcı köşeden boyut değiştirdiyse hatırla */
        if (window.ResizeObserver) {
            var z = null;
            new ResizeObserver(function () {
                if (!perde.classList.contains('acik')) return;
                clearTimeout(z); z = setTimeout(olcuYaz, 400);
            }).observe(kutu);
        }

        olcuUygula();
        /* Başlığa ÇİFT TIKLA: pencere varsayılan ölçüsüne döner ve kayıt
           silinir. Buna ihtiyaç var, çünkü ölçü tarayıcıda SİTE BAŞINA
           saklanıyor: localStorage her köken için ayrıdır, yani
           kidefarapca.com'da bir kez köşesinden daralttıysan pencere orada
           hep dar açılır; yerel kopyada (ayrı köken) kayıt olmadığı için
           geniş açılır. Geylani: "siteye yükleyince daralıyor, yüklemediğim
           hâlinde daha uzun" — sebebi buydu, dosyalarda bir fark yok. */
        perde.querySelector('#szp-bas').addEventListener('dblclick', function (e) {
            if (e.target.closest && e.target.closest('button')) return;
            olcuSifirla();
        });
    }

    function ac(sorgu) {
        kur();
        var adres = 'sozluk.html?v=3' + (sorgu ? '&q=' + encodeURIComponent(sorgu) : '');
        if (cerceve.getAttribute('data-yuklendi') !== '1' || sorgu) {
            cerceve.src = adres;
            cerceve.setAttribute('data-yuklendi', '1');
        }
        perde.classList.add('acik');
        kaydirmaKilitle();
    }

    function kapat() {
        if (!perde) return;
        perde.classList.remove('acik');
        kaydirmaAc();
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && perde && perde.classList.contains('acik')) kapat();
    });

    window.SozlukPop = { ac: ac, kapat: kapat, olcuSifirla: olcuSifirla };

    /* STİL SAYFA AÇILIRKEN KURULUR, pencere açılırken DEĞİL.
       Başlıktaki simgenin görünürlüğü (yalnız masaüstü) ve animasyonu da
       bu stilde; kur() ilk açılışta çalıştığı için simge o ana kadar
       stilsiz kalıyordu: masaüstünde display düzeltilmiyor, animasyon hiç
       başlamıyordu (ölçüldü). */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', stilKur, { once: true });
    } else {
        stilKur();
    }
})();
