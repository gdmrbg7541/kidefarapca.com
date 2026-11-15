/* ===========================================================================
   PROFİL GÖRÜNÜMÜ — sistem/profilgorunum.js                                  (15.11.2026)
   ---------------------------------------------------------------------------
   Öğretmen: "ayrıca profile tıklayınca daha profesyonel toplu ve bol svg lim animasyonlar
   olsun gözden geçirir misin".

   GÖZDEN GEÇİRME (öğrenci, öğretmen ve yönetici profili ortak «akordiyon» düzenini kullanıyor):
     · her bölüm tam genişlikte, 100 px'lik ayrı bir çubuk; yedi bölüm iki ekran boyu sürüyordu,
     · başlıklarda emoji (cihaza göre başka görünür; sitenin «arayüzde emoji yok» kuralına aykırı),
       «Meydan Okuma» ve «Sınıfım»da hiç simge yoktu, ▸ yazı işareti ok yerine geçiyordu,
     · kime ait olduğunu söyleyen bir üst kart yoktu, kalın renkli alt çizgiler her satırı ayrı bir
       kutu gibi gösteriyordu,
     · öğretmende «Sitede yenilikler» dört uzun paragrafla ilk ekranı dolduruyordu.

   NE YAPAR (yalnız #student-profile-section içinde; sitenin kendi çizimine ve işlevlerine dokunmaz):
     1. ÜST KART — animasyonlu baş harf halkası, selam + ad, rol, e-posta, canlı özet çipleri
        (öğrencide bekleyen görev, tamamlanan/toplam görev ve ilerleme halkası, sınıf, öğretmen;
        öğretmen ve yöneticide çip yok: sınıf/öğrenci sayısı zaten «Bu dönem» kartında),
        sağda sitenin SVG kütüphanesinden öğrenci / öğretmen çizimi, süzülen Arapça harfler, dalgalar.
     2. BÖLÜMLER — her biri 64 px'lik düzgün bir satır: solda kütüphane SVG'si (animasyonlu),
        başlık, rozetler, özel ok. Açılınca vurgulanır, içeriği yumuşakça gelir. Emoji yerine SVG.
     3. SİTEDE YENİLİKLER — ilk kayıt açık, ötekiler tek satır (başlığa dokunca açılır).
     4. GİRİŞ — profil açılırken kartlar sırayla belirir (yalnız o açılışta).
     5. SÜTUN — içerik en çok 980 px'lik ortalı sütunda; telefonda tam genişlik.
   SVG'ler veri/veri_svg.js kütüphanesinden alınır (ogrenci, ogretmen, odev, kupa …): bu dosya onları
   _kaynak/uretici/profilGorunumKur.py ile içine gömer; kütüphanede bir SVG düzeltilirse betik yeniden
   çalıştırılır. «Hareketi azalt» açıksa ya da sitenin düşük güç kipinde (html.dusuk-guc) bütün
   hareket durur, ilk kare kalır.

   İŞLEV: window.KidefProfilGorunum = { yenile(), surum }.   Kapatmak için adrese ?profil=eski.
   =========================================================================== */
(function () {
  'use strict';
  if (window.KidefProfilGorunum) return;
  var PG = window.KidefProfilGorunum = { surum: '1' };
  var SEC_ID = 'student-profile-section';
  try { if (/[?&]profil=eski(&|$)/.test(location.search)) return; } catch (e) { }

  /* ---- SİTENİN SVG KÜTÜPHANESİNDEN (veri/veri_svg.js) ALINAN 18 SİMGE — _kaynak/uretici/profilGorunumKur.py gömer;
        kütüphanede düzeltilirse betik yeniden çalıştırılır. ---- */
  var SVG = {
    "odev": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" style=\"overflow:visible;\"><style>@keyframes ks-odev-k1{0%,6%{stroke-dashoffset:13;opacity:0;}7%{opacity:1;}16%,88%{stroke-dashoffset:0;opacity:1;}97%,100%{stroke-dashoffset:0;opacity:0;}}@keyframes ks-odev-k2{0%,38%{stroke-dashoffset:13;opacity:0;}39%{opacity:1;}49%,88%{stroke-dashoffset:0;opacity:1;}97%,100%{stroke-dashoffset:0;opacity:0;}}@keyframes ks-odev-k3{0%,71%{stroke-dashoffset:13;opacity:0;}72%{opacity:1;}82%,88%{stroke-dashoffset:0;opacity:1;}97%,100%{stroke-dashoffset:0;opacity:0;}}@keyframes ks-odev-k4{0%,6%{transform:translate(0px,0px);}11%{transform:translate(-1.5px,1px);}16%,22%{transform:translate(0px,0px);}33%,39%{transform:translate(-2px,11.5px);}44%{transform:translate(-3.5px,12.5px);}49%,55%{transform:translate(-2px,11.5px);}66%,72%{transform:translate(-4px,23px);}77%{transform:translate(-5.5px,24px);}82%,88%{transform:translate(-4px,23px);}100%{transform:translate(0px,0px);}}</style><rect x=\"19\" y=\"5\" width=\"34\" height=\"44\" rx=\"4\" fill=\"#EDE7FB\" stroke=\"#7C3AED\" stroke-width=\"2.6\" transform=\"rotate(9 36 27)\"/><rect x=\"9\" y=\"11\" width=\"34\" height=\"46\" rx=\"4\" fill=\"#fff\" stroke=\"#7C3AED\" stroke-width=\"3\"/><g fill=\"none\" stroke=\"#7C3AED\" stroke-width=\"2.4\"><rect x=\"14\" y=\"19\" width=\"7.5\" height=\"7.5\" rx=\"1.8\"/><rect x=\"14\" y=\"30.5\" width=\"7.5\" height=\"7.5\" rx=\"1.8\"/><rect x=\"14\" y=\"42\" width=\"7.5\" height=\"7.5\" rx=\"1.8\"/></g><g stroke=\"#C9B8F5\" stroke-width=\"3.2\" stroke-linecap=\"round\"><line x1=\"26\" y1=\"22.75\" x2=\"37\" y2=\"22.75\"/><line x1=\"26\" y1=\"34.25\" x2=\"35\" y2=\"34.25\"/><line x1=\"26\" y1=\"45.75\" x2=\"33\" y2=\"45.75\"/></g><g fill=\"none\" stroke=\"#16A085\" stroke-width=\"3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15.2 22.6 l2.6 2.8 l5.6 -6.6\" style=\"animation-name:ks-odev-k1;animation-duration:3.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;stroke-dasharray:13px, 13px;\"/><path d=\"M15.2 34.1 l2.6 2.8 l5.6 -6.6\" style=\"animation-name:ks-odev-k2;animation-duration:3.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;stroke-dasharray:13px, 13px;\"/><path d=\"M15.2 45.6 l2.6 2.8 l5.6 -6.6\" style=\"animation-name:ks-odev-k3;animation-duration:3.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;stroke-dasharray:13px, 13px;\"/></g><g style=\"animation-name:ks-odev-k4;animation-duration:3.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;\"><g transform=\"translate(38 23) rotate(-45)\"><path d=\"M0 0 l7 -3.8 v7.6 Z\" fill=\"#F6D7A7\"/><path d=\"M0 0 l2.8 -1.5 v3 Z\" fill=\"#33415C\"/><rect x=\"7\" y=\"-3.8\" width=\"15\" height=\"7.6\" fill=\"#F39C12\"/><rect x=\"22\" y=\"-3.8\" width=\"3\" height=\"7.6\" fill=\"#94A3B8\"/><rect x=\"25\" y=\"-3.8\" width=\"4.6\" height=\"7.6\" rx=\"1.8\" fill=\"#EE5253\"/></g></g></svg>",
    "tahta": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" style=\"overflow:visible;\"><style>@keyframes ks-tahta-k1{0%,12%{stroke-dashoffset:34;}45%,78%{stroke-dashoffset:0;}92%,100%{stroke-dashoffset:34;}}@keyframes ks-tahta-k2{0%,100%{transform:translate(0px,0px);}30%{transform:translate(-2.4px,-2.4px);}60%{transform:translate(1.4px,1.4px);}}</style><rect x=\"8\" y=\"10\" width=\"48\" height=\"34\" rx=\"4\" fill=\"#2C6E49\"/><rect x=\"8\" y=\"10\" width=\"48\" height=\"34\" rx=\"4\" fill=\"none\" stroke=\"#8D6E63\" stroke-width=\"3\"/><path d=\"M20 28l7 7 16-16\" fill=\"none\" stroke=\"#FFF3E0\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-dasharray=\"34\" stroke-dashoffset=\"0\" style=\"animation-name:ks-tahta-k1;animation-duration:3.4s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;\"/><path d=\"M14 52h22\" stroke=\"#D5BFAE\" stroke-width=\"3\" stroke-linecap=\"round\"/><g style=\"animation-name:ks-tahta-k2;animation-duration:3.4s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;\"><path d=\"M44 56l10-10 4 4-10 10-5.2 1.2z\" fill=\"#F39C12\" stroke=\"#B9770E\" stroke-width=\"1.4\"/><path d=\"M54 46l4 4\" stroke=\"#8D6E63\" stroke-width=\"3\" stroke-linecap=\"round\"/></g></svg>",
    "ok-ve-hedef": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" style=\"overflow:visible;\"><style>@keyframes ks-ok-ve-hedef-k1{0%,42%{transform:scale(1);}52%{transform:scale(1.18);}66%,100%{transform:scale(1);}}@keyframes ks-ok-ve-hedef-k2{0%,15%{transform:translate(14px,-14px) rotate(45deg);opacity:0;}25%{opacity:1;}45%,80%{transform:translate(0px,0px) rotate(45deg);opacity:1;}100%{transform:translate(0px,0px) rotate(45deg);opacity:0;}}</style><g style=\"animation-name:ks-ok-ve-hedef-k1;animation-duration:2.2s;animation-timing-function:ease-out;animation-iteration-count:infinite;transform-origin:20px 20px;transform-box:fill-box;\"><circle cx=\"28\" cy=\"36\" r=\"20\" fill=\"#fff\"/><circle cx=\"28\" cy=\"36\" r=\"13.5\" fill=\"#EE5253\"/><circle cx=\"28\" cy=\"36\" r=\"7\" fill=\"#fff\"/><circle cx=\"28\" cy=\"36\" r=\"2.8\" fill=\"#EE5253\"/></g><g style=\"animation-name:ks-ok-ve-hedef-k2;animation-duration:2.2s;animation-timing-function:cubic-bezier(0.5, 0, 0.4, 1);animation-iteration-count:infinite;\"><line x1=\"28\" y1=\"36\" x2=\"46\" y2=\"18\" stroke=\"#ffd54f\" stroke-width=\"3.6\" stroke-linecap=\"round\" transform=\"rotate(-45 28 36)\"/><path d=\"M46 18 l-7 1.5 M46 18 l-1.5 7\" stroke=\"#ffd54f\" stroke-width=\"3.6\" stroke-linecap=\"round\" transform=\"rotate(-45 28 36)\"/></g></svg>",
    "kupa": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" style=\"overflow:visible;\"><style>@keyframes ks-kupa-k1{0%,60%,100%{opacity:0;transform:scale(0.4);}20%,40%{opacity:1;transform:scale(1.15);}}@keyframes ks-kupa-k2{0%,100%{transform:rotate(0deg);}30%{transform:rotate(-6deg);}60%{transform:rotate(5deg);}}</style><path d=\"M32 2 l1.8 4.6 4.6 1.8 -4.6 1.8 -1.8 4.6 -1.8 -4.6 -4.6 -1.8 4.6 -1.8 Z\" fill=\"#ffd54f\" style=\"animation-name:ks-kupa-k1;animation-duration:2.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:6.4px 6.4px;transform-box:fill-box;\"/><g style=\"animation-name:ks-kupa-k2;animation-duration:2.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:19.0722px 30.15px;transform-box:fill-box;\"><path d=\"M20 18 h24 v10 a12 12 0 0 1 -24 0 Z\" fill=\"#F39C12\"/><path d=\"M20 20 h-7 a8 8 0 0 0 9 9 M44 20 h7 a8 8 0 0 1 -9 9\" fill=\"none\" stroke=\"#F39C12\" stroke-width=\"3.4\"/><rect x=\"28.5\" y=\"39\" width=\"7\" height=\"7\" fill=\"#c87f0a\"/><rect x=\"22\" y=\"46\" width=\"20\" height=\"5.5\" rx=\"2.4\" fill=\"#c87f0a\"/></g></svg>",
    "mezuniyet-kepi": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" style=\"overflow:visible;\"><style>@keyframes ks-mezuniyet-kepi-k1{0%,100%{transform:translateY(0px) rotate(0deg);}40%{transform:translateY(-4px) rotate(-8deg);}55%{transform:translateY(-2px) rotate(3deg);}}</style><g style=\"animation-name:ks-mezuniyet-kepi-k1;animation-duration:2.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;\"><polygon points=\"32,16 58,27 32,38 6,27\" fill=\"#2c3e50\"/><path d=\"M21 34 v9 q11 6 22 0 v-9\" fill=\"none\" stroke=\"#2c3e50\" stroke-width=\"4.6\"/><line x1=\"55\" y1=\"28\" x2=\"55\" y2=\"40\" stroke=\"#F39C12\" stroke-width=\"2.4\"/><circle cx=\"55\" cy=\"42.5\" r=\"2.6\" fill=\"#F39C12\"/></g></svg>",
    "karekod": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\" fill=\"none\" style=\"overflow:visible;\"><style>@keyframes ks-karekod-k1{0%,100%{opacity:0.35;}50%{opacity:1;}}@keyframes ks-karekod-k2{0%{transform:translateY(0px);}50%{transform:translateY(24px);}100%{transform:translateY(0px);}}</style><rect x=\"3\" y=\"3\" width=\"34\" height=\"34\" rx=\"7\" fill=\"#FFF6E8\" stroke=\"#F39C12\" stroke-width=\"2\"/><g fill=\"#2c3e50\"><rect x=\"8\" y=\"8\" width=\"8\" height=\"8\" rx=\"1.6\"/><rect x=\"10\" y=\"10\" width=\"4\" height=\"4\" rx=\".8\" fill=\"#FFF6E8\"/><rect x=\"24\" y=\"8\" width=\"8\" height=\"8\" rx=\"1.6\"/><rect x=\"26\" y=\"10\" width=\"4\" height=\"4\" rx=\".8\" fill=\"#FFF6E8\"/><rect x=\"8\" y=\"24\" width=\"8\" height=\"8\" rx=\"1.6\"/><rect x=\"10\" y=\"26\" width=\"4\" height=\"4\" rx=\".8\" fill=\"#FFF6E8\"/></g><g fill=\"#16A085\"><rect x=\"18\" y=\"8\" width=\"3.4\" height=\"3.4\" style=\"animation-name:ks-karekod-k1;animation-duration:2.4s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;\"/><rect x=\"18\" y=\"13\" width=\"3.4\" height=\"3.4\" style=\"animation-name:ks-karekod-k1;animation-duration:2.4s;animation-timing-function:ease-in-out;animation-delay:0.6s;animation-iteration-count:infinite;\"/><rect x=\"18\" y=\"19\" width=\"3.4\" height=\"3.4\" style=\"animation-name:ks-karekod-k1;animation-duration:2.4s;animation-timing-function:ease-in-out;animation-delay:1.2s;animation-iteration-count:infinite;\"/><rect x=\"24\" y=\"19\" width=\"3.4\" height=\"3.4\" style=\"animation-name:ks-karekod-k1;animation-duration:2.4s;animation-timing-function:ease-in-out;animation-delay:1.8s;animation-iteration-count:infinite;\"/><rect x=\"29\" y=\"19\" width=\"3.4\" height=\"3.4\" style=\"animation-name:ks-karekod-k1;animation-duration:2.4s;animation-timing-function:ease-in-out;animation-delay:0.6s;animation-iteration-count:infinite;\"/><rect x=\"8\" y=\"19\" width=\"3.4\" height=\"3.4\" style=\"animation-name:ks-karekod-k1;animation-duration:2.4s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;\"/><rect x=\"13\" y=\"19\" width=\"3.4\" height=\"3.4\" style=\"animation-name:ks-karekod-k1;animation-duration:2.4s;animation-timing-function:ease-in-out;animation-delay:1.2s;animation-iteration-count:infinite;\"/><rect x=\"24\" y=\"25\" width=\"3.4\" height=\"3.4\" style=\"animation-name:ks-karekod-k1;animation-duration:2.4s;animation-timing-function:ease-in-out;animation-delay:1.8s;animation-iteration-count:infinite;\"/><rect x=\"29\" y=\"29\" width=\"3.4\" height=\"3.4\" style=\"animation-name:ks-karekod-k1;animation-duration:2.4s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;\"/><rect x=\"24\" y=\"31\" width=\"3.4\" height=\"3.4\" style=\"animation-name:ks-karekod-k1;animation-duration:2.4s;animation-timing-function:ease-in-out;animation-delay:0.6s;animation-iteration-count:infinite;\"/></g><rect x=\"6\" y=\"7\" width=\"28\" height=\"2.6\" rx=\"1.3\" fill=\"#F39C12\" opacity=\".65\" style=\"animation-name:ks-karekod-k2;animation-duration:2.8s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;\"/></svg>",
    "para": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 120\"><circle cx=\"60\" cy=\"60\" r=\"54\" fill=\"#16A34A\" opacity=\".10\"/><g transform=\"rotate(-10 46 52)\"><rect x=\"12\" y=\"34\" width=\"68\" height=\"38\" rx=\"5\" fill=\"#22C55E\"/><rect x=\"17\" y=\"39\" width=\"58\" height=\"28\" rx=\"3\" fill=\"none\" stroke=\"#BBF7D0\" stroke-width=\"2\"/><circle cx=\"46\" cy=\"53\" r=\"9\" fill=\"#BBF7D0\"/><text x=\"46\" y=\"58\" font-family=\"Arial, sans-serif\" font-size=\"13\" font-weight=\"700\" fill=\"#15803D\" text-anchor=\"middle\">₺</text></g><ellipse cx=\"78\" cy=\"100\" rx=\"18\" ry=\"6\" fill=\"#F59E0B\" stroke=\"#D97706\" stroke-width=\"1.6\"/><ellipse cx=\"78\" cy=\"93\" rx=\"18\" ry=\"6\" fill=\"#F59E0B\" stroke=\"#D97706\" stroke-width=\"1.6\"/><ellipse cx=\"78\" cy=\"86\" rx=\"18\" ry=\"6\" fill=\"#F59E0B\" stroke=\"#D97706\" stroke-width=\"1.6\"/><g transform=\"translate(86 52)\"><g><animateTransform attributeName=\"transform\" type=\"scale\" values=\"1 1;-1 1;1 1\" dur=\"1.6s\" repeatCount=\"indefinite\"/><circle r=\"16\" fill=\"#FACC15\" stroke=\"#D97706\" stroke-width=\"2.4\"/><circle r=\"11\" fill=\"none\" stroke=\"#FDE68A\" stroke-width=\"2\"/><text x=\"0\" y=\"5.4\" font-family=\"Arial, sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#B45309\" text-anchor=\"middle\">₺</text></g></g></svg>",
    "kimlik-karti": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 48 48\"><style>@keyframes ks-kimlik-karti-k1{0%,12%{opacity:0;transform:translateX(-9px);}26%,74%{opacity:1;transform:none;}90%,100%{opacity:0;transform:translateX(-9px);}}</style><rect x=\"5\" y=\"10\" width=\"38\" height=\"29\" rx=\"4\" fill=\"#E9F8F4\" stroke=\"#16A085\" stroke-width=\"2.2\"/><path d=\"M6 17.5 h36\" stroke=\"#16A085\" stroke-width=\"2.2\"/><circle cx=\"16.4\" cy=\"26\" r=\"4.6\" fill=\"#16A085\"/><path d=\"M9.6 35.6 a6.9 6.9 0 0 1 13.6 0 Z\" fill=\"#16A085\" opacity=\".85\"/><g style=\"animation-name:ks-kimlik-karti-k1;animation-duration:5.4s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:6.25px 6.8px;transform-box:fill-box;\"><rect x=\"27\" y=\"23\" width=\"12.5\" height=\"2.6\" rx=\"1.3\" fill=\"#16A085\" opacity=\".5\"/><rect x=\"27\" y=\"28.5\" width=\"9.5\" height=\"2.6\" rx=\"1.3\" fill=\"#16A085\" opacity=\".36\"/><rect x=\"27\" y=\"34\" width=\"11\" height=\"2.6\" rx=\"1.3\" fill=\"#16A085\" opacity=\".24\"/></g></svg>",
    "takvim": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" style=\"overflow:visible;\"><style>@keyframes ks-takvim-k1{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.55;transform:scale(0.86);}}</style><rect x=\"3\" y=\"5\" width=\"18\" height=\"16.2\" rx=\"2.2\" fill=\"#ecf0f1\" stroke=\"#90A4AE\" stroke-width=\".9\"/><path d=\"M3 5a2.2 2.2 0 0 1 2.2-2.2h13.6A2.2 2.2 0 0 1 21 5v3.6H3z\" fill=\"#e74c3c\"/><rect x=\"6.6\" y=\"1.6\" width=\"2.2\" height=\"4.4\" rx=\"1.1\" fill=\"#c0392b\"/><rect x=\"15.2\" y=\"1.6\" width=\"2.2\" height=\"4.4\" rx=\"1.1\" fill=\"#c0392b\"/><g fill=\"#bdc3c7\"><rect x=\"6\" y=\"11\" width=\"3\" height=\"2.6\" rx=\".6\"/><rect x=\"10.5\" y=\"11\" width=\"3\" height=\"2.6\" rx=\".6\"/><rect x=\"15\" y=\"11\" width=\"3\" height=\"2.6\" rx=\".6\"/><rect x=\"6\" y=\"15.4\" width=\"3\" height=\"2.6\" rx=\".6\"/></g><rect x=\"10.5\" y=\"15.4\" width=\"3\" height=\"2.6\" rx=\".6\" fill=\"#3498db\" style=\"animation-name:ks-takvim-k1;animation-duration:2.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-box:fill-box;\"/></svg>",
    "tarama": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><style>@keyframes ks-tarama-k1{0%,100%{transform:scale(1);opacity:0.14;}50%{transform:scale(1.12);opacity:0.28;}}@keyframes ks-tarama-k2{100%{stroke-dashoffset:0;}}@keyframes ks-tarama-k3{0%,100%{transform:translateY(-13px);opacity:0.35;}50%{transform:translateY(13px);opacity:1;}}</style><circle cx=\"32\" cy=\"32\" r=\"27\" fill=\"url(#ks-tarama-i1)\" opacity=\".14\" style=\"animation-name:ks-tarama-k1;animation-duration:3.2s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:32px 32px;\"/><g fill=\"none\" stroke=\"url(#ks-tarama-i1)\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M14 24V16a2 2 0 0 1 2-2h8\" style=\"animation-name:ks-tarama-k2;animation-duration:1s;animation-timing-function:ease-out;animation-fill-mode:forwards;stroke-dasharray:20px;stroke-dashoffset:20px;\"/><path d=\"M50 24V16a2 2 0 0 0-2-2h-8\" style=\"animation-name:ks-tarama-k2;animation-duration:1s;animation-timing-function:ease-out;animation-fill-mode:forwards;stroke-dasharray:20px;stroke-dashoffset:20px;\"/><path d=\"M14 40v8a2 2 0 0 0 2 2h8\" style=\"animation-name:ks-tarama-k2;animation-duration:1s;animation-timing-function:ease-out;animation-fill-mode:forwards;stroke-dasharray:20px;stroke-dashoffset:20px;\"/><path d=\"M50 40v8a2 2 0 0 1-2 2h-8\" style=\"animation-name:ks-tarama-k2;animation-duration:1s;animation-timing-function:ease-out;animation-fill-mode:forwards;stroke-dasharray:20px;stroke-dashoffset:20px;\"/></g><g fill=\"url(#ks-tarama-i1)\" opacity=\".85\"><rect x=\"21\" y=\"21\" width=\"8\" height=\"8\" rx=\"1.5\"/><rect x=\"35\" y=\"21\" width=\"8\" height=\"8\" rx=\"1.5\"/><rect x=\"21\" y=\"35\" width=\"8\" height=\"8\" rx=\"1.5\"/><rect x=\"35\" y=\"35\" width=\"4\" height=\"4\" rx=\"1\"/><rect x=\"39\" y=\"39\" width=\"4\" height=\"4\" rx=\"1\"/></g><line x1=\"16\" y1=\"32\" x2=\"48\" y2=\"32\" stroke=\"url(#ks-tarama-i2)\" stroke-width=\"2.5\" stroke-linecap=\"round\" style=\"animation-name:ks-tarama-k3;animation-duration:2.2s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;\"/><defs><linearGradient id=\"ks-tarama-i1\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#34d399\"/><stop offset=\"100%\" stop-color=\"#10b981\"/></linearGradient><linearGradient id=\"ks-tarama-i2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#fbbf24\"/><stop offset=\"100%\" stop-color=\"#f59e0b\"/></linearGradient></defs></svg>",
    "anahtar": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" style=\"overflow:visible;\"><style>@keyframes ks-anahtar-k1{0%,100%{transform:rotate(-9deg);}50%{transform:rotate(9deg);}}</style><g style=\"animation-name:ks-anahtar-k1;animation-duration:2.8s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:5.04px 5.28px;transform-box:fill-box;\"><circle cx=\"8\" cy=\"8\" r=\"4.6\" fill=\"none\" stroke=\"#f1c40f\" stroke-width=\"2.4\"/><path d=\"M11.2 11.2l9 9\" stroke=\"#f1c40f\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M17 17l2 2M15 19l2 2\" stroke=\"#f39c12\" stroke-width=\"2.2\" stroke-linecap=\"round\"/></g></svg>",
    "seviye": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><style>@keyframes ks-seviye-k1{0%,100%{transform:scale(1);opacity:0.14;}50%{transform:scale(1.12);opacity:0.28;}}@keyframes ks-seviye-k2{0%,100%{transform:scaleY(1);}45%{transform:scaleY(0.72);}}</style><circle cx=\"32\" cy=\"32\" r=\"26\" fill=\"url(#ks-seviye-i1)\" opacity=\".14\" style=\"animation-name:ks-seviye-k1;animation-duration:3.2s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:32px 32px;\"/><g><rect x=\"14\" y=\"36\" width=\"9\" height=\"14\" rx=\"2.6\" fill=\"url(#ks-seviye-i2)\" style=\"animation-name:ks-seviye-k2;animation-duration:3.2s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:32px 64px;\"/><rect x=\"27.5\" y=\"27\" width=\"9\" height=\"23\" rx=\"2.6\" fill=\"url(#ks-seviye-i1)\" style=\"animation-name:ks-seviye-k2;animation-duration:3.2s;animation-timing-function:ease-in-out;animation-delay:0.18s;animation-iteration-count:infinite;transform-origin:32px 64px;\"/><rect x=\"41\" y=\"18\" width=\"9\" height=\"32\" rx=\"2.6\" fill=\"#EE5253\" style=\"animation-name:ks-seviye-k2;animation-duration:3.2s;animation-timing-function:ease-in-out;animation-delay:0.36s;animation-iteration-count:infinite;transform-origin:32px 64px;\"/></g><path d=\"M11 52h42\" stroke=\"#CBD5E1\" stroke-width=\"3\" stroke-linecap=\"round\"/><defs><linearGradient id=\"ks-seviye-i1\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#fbbf24\"/><stop offset=\"100%\" stop-color=\"#f59e0b\"/></linearGradient><linearGradient id=\"ks-seviye-i2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#34d399\"/><stop offset=\"100%\" stop-color=\"#10b981\"/></linearGradient></defs></svg>",
    "hediye": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 120\"><circle cx=\"60\" cy=\"60\" r=\"54\" fill=\"#EC4899\" opacity=\".10\"/><rect x=\"26\" y=\"58\" width=\"68\" height=\"46\" rx=\"5\" fill=\"#EC4899\"/><rect x=\"54\" y=\"58\" width=\"12\" height=\"46\" fill=\"#FDE68A\"/><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0;0 0;0 -14;0 0;0 0\" dur=\"2s\" keyTimes=\"0;.5;.62;.78;1\" repeatCount=\"indefinite\"/><rect x=\"20\" y=\"44\" width=\"80\" height=\"16\" rx=\"4\" fill=\"#DB2777\"/><rect x=\"54\" y=\"44\" width=\"12\" height=\"16\" fill=\"#FACC15\"/><path d=\"M60 44 q-22-22-24-6 q0 8 24 6 q22-22 24-6 q0 8-24 6\" fill=\"#FACC15\" stroke=\"#EAB308\" stroke-width=\"1.6\"/></g><rect x=\"40\" y=\"40\" width=\"5\" height=\"9\" rx=\"1.5\" fill=\"#3B82F6\" opacity=\"0\" transform=\"rotate(20 40 40)\"><animate attributeName=\"opacity\" values=\"0;0;1;0\" dur=\"2s\" keyTimes=\"0;.55;.65;1\" repeatCount=\"indefinite\"/><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0;0 0;-10 -16\" dur=\"2s\" keyTimes=\"0;.55;1\" repeatCount=\"indefinite\"/></rect><rect x=\"78\" y=\"38\" width=\"5\" height=\"9\" rx=\"1.5\" fill=\"#22C55E\" opacity=\"0\" transform=\"rotate(-20 78 38)\"><animate attributeName=\"opacity\" values=\"0;0;1;0\" dur=\"2s\" keyTimes=\"0;.55;.65;1\" repeatCount=\"indefinite\"/><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0;0 0;10 -16\" dur=\"2s\" keyTimes=\"0;.55;1\" repeatCount=\"indefinite\"/></rect><rect x=\"60\" y=\"30\" width=\"5\" height=\"9\" rx=\"1.5\" fill=\"#F59E0B\" opacity=\"0\" transform=\"rotate(0 60 30)\"><animate attributeName=\"opacity\" values=\"0;0;1;0\" dur=\"2s\" keyTimes=\"0;.55;.65;1\" repeatCount=\"indefinite\"/><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0;0 0;0 -16\" dur=\"2s\" keyTimes=\"0;.55;1\" repeatCount=\"indefinite\"/></rect><rect x=\"30\" y=\"50\" width=\"5\" height=\"9\" rx=\"1.5\" fill=\"#8B5CF6\" opacity=\"0\" transform=\"rotate(40 30 50)\"><animate attributeName=\"opacity\" values=\"0;0;1;0\" dur=\"2s\" keyTimes=\"0;.55;.65;1\" repeatCount=\"indefinite\"/><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0;0 0;-14 -16\" dur=\"2s\" keyTimes=\"0;.55;1\" repeatCount=\"indefinite\"/></rect><rect x=\"90\" y=\"50\" width=\"5\" height=\"9\" rx=\"1.5\" fill=\"#EF4444\" opacity=\"0\" transform=\"rotate(-40 90 50)\"><animate attributeName=\"opacity\" values=\"0;0;1;0\" dur=\"2s\" keyTimes=\"0;.55;.65;1\" repeatCount=\"indefinite\"/><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0;0 0;14 -16\" dur=\"2s\" keyTimes=\"0;.55;1\" repeatCount=\"indefinite\"/></rect><g transform=\"translate(100 28)\"><path d=\"M0 -6 Q0 0 6 0 Q0 0 0 6 Q0 0 -6 0 Q0 0 0 -6 Z\" fill=\"#FDE68A\"><animateTransform attributeName=\"transform\" type=\"scale\" values=\"0;1;0;0\" keyTimes=\"0;.25;.5;1\" dur=\"2.2s\" begin=\"0.4s\" repeatCount=\"indefinite\"/></path></g></svg>",
    "zil": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" style=\"overflow:visible;\"><style>@keyframes ks-zil-k1{0%,100%{opacity:0.15;}50%{opacity:1;}}@keyframes ks-zil-k2{0%,55%,100%{opacity:0.15;transform:scale(0.55);}25%{opacity:1;transform:scale(1.15);}}@keyframes ks-zil-k3{0%,100%{transform:translateY(0px);}40%{transform:translateY(5px);}55%{transform:translateY(5px);}}</style><g stroke=\"#F39C12\" stroke-width=\"2.6\" fill=\"none\" stroke-linecap=\"round\"><path d=\"M14 26 a12 12 0 0 1 4-8.4\" style=\"animation-name:ks-zil-k1;animation-duration:1.5s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-box:fill-box;\"/><path d=\"M7 28 a19 19 0 0 1 6.4-13.4\" style=\"animation-name:ks-zil-k1;animation-duration:1.5s;animation-timing-function:ease-in-out;animation-delay:0.4s;animation-iteration-count:infinite;transform-box:fill-box;\"/></g><g style=\"animation-name:ks-zil-k2;animation-duration:2.4s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:10px 10px;transform-box:fill-box;\"><circle cx=\"46\" cy=\"15\" r=\"10\" fill=\"#fff\" stroke=\"#2563EB\" stroke-width=\"2.6\"/><path d=\"M42.5 12.2 a3.7 3.7 0 0 1 6.8 2 c0 2.2-3 2.4-3 4.5\" stroke=\"#2563EB\" stroke-width=\"2.4\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"46.2\" cy=\"21.4\" r=\"1.7\" fill=\"#2563EB\"/></g><rect x=\"9\" y=\"45\" width=\"46\" height=\"9.5\" rx=\"4.75\" fill=\"#0E9E86\"/><rect x=\"14\" y=\"41\" width=\"36\" height=\"6\" rx=\"3\" fill=\"#16A085\"/><g style=\"animation-name:ks-zil-k3;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-box:fill-box;\"><path d=\"M18 42 a14 14 0 0 1 28 0 Z\" fill=\"#EE5253\"/><path d=\"M23.5 39 a9 9 0 0 1 7.5-6.6\" stroke=\"rgba(255,255,255,.8)\" stroke-width=\"2.6\" fill=\"none\" stroke-linecap=\"round\"/></g></svg>",
    "dunya-kuresi": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" style=\"overflow:visible;\"><style>@keyframes ks-dunya-kuresi-k1{100%{transform:rotate(360deg);}}</style><circle cx=\"32\" cy=\"32\" r=\"24\" fill=\"#e8f4fd\" stroke=\"#2563EB\" stroke-width=\"3\"/><g style=\"animation-name:ks-dunya-kuresi-k1;animation-duration:7s;animation-timing-function:linear;animation-iteration-count:infinite;transform-origin:19px 24px;transform-box:fill-box;\"><ellipse cx=\"32\" cy=\"32\" rx=\"10\" ry=\"24\" fill=\"none\" stroke=\"#5AB4FF\" stroke-width=\"2.2\"/><ellipse cx=\"32\" cy=\"32\" rx=\"19\" ry=\"24\" fill=\"none\" stroke=\"rgba(90,180,255,.5)\" stroke-width=\"1.8\"/></g><line x1=\"8\" y1=\"32\" x2=\"56\" y2=\"32\" stroke=\"#5AB4FF\" stroke-width=\"2.2\"/><path d=\"M13 19 a24 24 0 0 1 38 0 M13 45 a24 24 0 0 0 38 0\" fill=\"none\" stroke=\"rgba(90,180,255,.55)\" stroke-width=\"1.8\"/></svg>",
    "mesaj": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" style=\"overflow:visible;\"><style>@keyframes ks-mesaj-k1{0%,100%{opacity:0.3;}50%{opacity:1;}}</style><path d=\"M4 5h24v15H14l-7 7v-7H4z\" fill=\"#4ECDC4\"/><circle cx=\"10.5\" cy=\"12.5\" r=\"2\" fill=\"#fff\" style=\"animation-name:ks-mesaj-k1;animation-duration:1.8s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;\"/><circle cx=\"16\" cy=\"12.5\" r=\"2\" fill=\"#fff\" style=\"animation-name:ks-mesaj-k1;animation-duration:1.8s;animation-timing-function:ease-in-out;animation-delay:0.3s;animation-iteration-count:infinite;\"/><circle cx=\"21.5\" cy=\"12.5\" r=\"2\" fill=\"#fff\" style=\"animation-name:ks-mesaj-k1;animation-duration:1.8s;animation-timing-function:ease-in-out;animation-delay:0.6s;animation-iteration-count:infinite;\"/></svg>",
    "ogrenci": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><style>@keyframes ks-ogrenci-k1{0%,100%{transform:scale(1);opacity:0.14;}50%{transform:scale(1.12);opacity:0.28;}}@keyframes ks-ogrenci-k2{0%,100%{transform:translateY(0px);}50%{transform:translateY(-3px);}}@keyframes ks-ogrenci-k3{0%,100%{opacity:0.25;}50%{opacity:1;}}</style><circle cx=\"32\" cy=\"32\" r=\"26\" fill=\"url(#ks-ogrenci-i1)\" opacity=\".14\" style=\"animation-name:ks-ogrenci-k1;animation-duration:3.2s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:32px 32px;\"/><g><circle cx=\"32\" cy=\"24\" r=\"8\" fill=\"url(#ks-ogrenci-i1)\"/><path d=\"M17 50c0-8 6.7-13 15-13s15 5 15 13z\" fill=\"url(#ks-ogrenci-i1)\" opacity=\".75\"/></g><g style=\"animation-name:ks-ogrenci-k2;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:46px 29px;\"><rect x=\"44\" y=\"14\" width=\"5\" height=\"15\" rx=\"2.5\" fill=\"url(#ks-ogrenci-i2)\"/></g><circle cx=\"46.5\" cy=\"9\" r=\"3.2\" fill=\"url(#ks-ogrenci-i2)\" style=\"animation-name:ks-ogrenci-k3;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;\"/><defs><linearGradient id=\"ks-ogrenci-i1\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#34d399\"/><stop offset=\"100%\" stop-color=\"#10b981\"/></linearGradient><linearGradient id=\"ks-ogrenci-i2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#fbbf24\"/><stop offset=\"100%\" stop-color=\"#f59e0b\"/></linearGradient></defs></svg>",
    "ogretmen": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 120\"><circle cx=\"60\" cy=\"60\" r=\"54\" fill=\"#2563EB\" opacity=\".10\"/><rect x=\"26\" y=\"30\" width=\"68\" height=\"48\" rx=\"4\" fill=\"#1F3A5F\"/><rect x=\"26\" y=\"30\" width=\"68\" height=\"48\" rx=\"4\" fill=\"none\" stroke=\"#2563EB\" stroke-width=\"4\"/><path d=\"M38 50 h40\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-dasharray=\"40\" stroke-dashoffset=\"40\"><animate attributeName=\"stroke-dashoffset\" values=\"40;0;0;40\" dur=\"3.2s\" repeatCount=\"indefinite\"/></path><path d=\"M38 62 h26\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" opacity=\".75\" stroke-dasharray=\"26\" stroke-dashoffset=\"26\"><animate attributeName=\"stroke-dashoffset\" values=\"26;26;0;26\" dur=\"3.2s\" repeatCount=\"indefinite\"/></path><rect x=\"24\" y=\"78\" width=\"72\" height=\"6\" rx=\"3\" fill=\"#2563EB\"/><path d=\"M40 84 l-6 14 M80 84 l6 14\" stroke=\"#2563EB\" stroke-width=\"5\" stroke-linecap=\"round\"/><rect x=\"52\" y=\"86\" width=\"14\" height=\"4\" rx=\"2\" fill=\"#fff\" opacity=\".9\"/><circle cx=\"86\" cy=\"62\" r=\"5\" fill=\"#FFD166\"><animate attributeName=\"cx\" values=\"40;86;86;40\" dur=\"3.2s\" repeatCount=\"indefinite\"/></circle></svg>"
  };

  /* -------------------------------------------------------------- yardımcılar */
  var sayac = 0;
  function svg(id) {
    var s = SVG[id];
    if (!s) return '';
    var n = ++sayac, on = 'ks-' + id + '-i';
    s = s.split(on).join('ks-' + id + '-p' + n + 'i');
    return s.replace(/^<svg\b/, '<svg class="pg-svg" aria-hidden="true" focusable="false" data-pg-svg="' + id + '"');
  }
  function T(k, tr) {
    try { if (window.KidefDil && typeof KidefDil.metin === 'function') return KidefDil.metin(k, tr); } catch (e) { }
    return tr;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function sec() { return document.getElementById(SEC_ID); }
  function gorunur(s) { return !!s && s.style.display !== 'none'; }
  function durum() { try { return (typeof appState !== 'undefined') ? appState : null; } catch (e) { return null; } }
  function hareketYok() {
    try {
      return (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) ||
        document.documentElement.classList.contains('dusuk-guc');
    } catch (e) { return false; }
  }
  /* emoji (BMP simgeleri + yüzey çiftleri + VS16/ZWJ) — \p{} kullanılmaz: eski Safari'de söz dizimi hatası verir */
  var EMOJI_BAS = /^[\s\uFE0F\u200D]*(?:[\u2300-\u23FF\u2600-\u27BF\u2B00-\u2BFF]|[\uD83C-\uD83E][\uDC00-\uDFFF])+[\uFE0F\u200D\u20E3]*\s*/;
  function ilkEmoji(t) { var m = String(t || '').match(EMOJI_BAS); return m ? m[0].replace(/\s/g, '') : ''; }

  /* emoji → kütüphane simgesi (başlığında emoji olup kimliği bilinmeyen bölümler için) */
  var EMOJI_IKON = {
    '\uD83D\uDC64': 'kimlik-karti', '\uD83D\uDCCB': 'odev', '\uD83C\uDFC6': 'kupa', '\uD83C\uDFAB': 'karekod',
    '\uD83D\uDED2': 'para', '\uD83C\uDF10': 'dunya-kuresi', '\uD83C\uDFD6': 'takvim', '\uD83D\uDD0E': 'tarama',
    '\uD83D\uDD10': 'anahtar', '\uD83C\uDF31': 'seviye', '\u2728': 'hediye', '\uD83D\uDD14': 'zil',
    '\uD83D\uDCAC': 'mesaj', '\uD83C\uDF93': 'mezuniyet-kepi'
  };
  /* bölüm kimliği → simge */
  var KIMLIK_IKON = {
    prfGorevler: 'odev', prfSinifim: 'tahta', prfMeydan: 'ok-ve-hedef', prfSonuclar: 'kupa',
    prfOgretmenler: 'mezuniyet-kepi', prfKodum: 'karekod', prfSatinAlma: 'para',
    tpKisisel: 'kimlik-karti', tpTatil: 'takvim', tpTarama: 'tarama', tpKilit: 'anahtar',
    tpDonem: 'seviye', tpYenilik: 'hediye', tpBildirim: 'zil'
  };

  /* ------------------------------------------------------------------ stil */
  function stil() {
    if (document.getElementById('pgStil')) return;
    var P = '#student-profile-section.pg';
    var c = [
      /* sütun */
      P + '{max-width:980px; margin-left:auto; margin-right:auto;}',
      P + ' > .pg-oge, ' + P + ' > .glass-card, ' + P + ' > details{margin:0 0 12px !important;}',
      P + ' > #gvProfilKart{margin:0 !important;}',
      P + ' #gvProfilKart > *{margin:0 0 12px !important;}',

      /* satır (akordiyon) */
      /* sol renk çizgisi = kenarlık (bölümün kendi rengi): taşma kırpması yok, içerikteki açılır öğeler kesilmez */
      P + ' details.pg-satir{position:relative; padding:0 !important; border-radius:18px !important; background:#fff !important;' +
        ' border:1px solid #E6ECF3 !important; border-left:5px solid rgb(var(--pg-rgb,22,160,133)) !important;' +
        ' box-shadow:0 2px 10px rgba(30,60,90,.06) !important; transition:box-shadow .25s, border-color .25s;}',
      P + ' details.pg-satir[open]{border-color:rgba(var(--pg-rgb,22,160,133),.45) !important; border-left-color:rgb(var(--pg-rgb,22,160,133)) !important;' +
        ' padding-bottom:18px !important; box-shadow:0 10px 28px rgba(var(--pg-rgb,22,160,133),.14) !important;}',
      P + ' details.pg-satir > summary{padding:12px 16px 12px 16px !important; gap:14px !important; min-height:64px; box-sizing:border-box;' +
        ' font-size:1.06rem !important; color:#23394A !important; cursor:pointer; -webkit-tap-highlight-color:transparent;' +
        ' -webkit-user-select:none; user-select:none;}',
      P + ' details.pg-satir[open] > summary{border-radius:13px 13px 0 0; background:linear-gradient(90deg, rgba(var(--pg-rgb,22,160,133),.09), rgba(var(--pg-rgb,22,160,133),0) 72%);}',
      P + ' details.pg-satir > summary:focus-visible{outline:3px solid rgba(var(--pg-rgb,22,160,133),.5); outline-offset:-3px;}',
      P + ' details.pg-satir > :not(summary){margin-left:16px !important; margin-right:16px !important;}',
      P + ' details.pg-satir[open] > :not(summary){animation:pgAc .38s ease backwards;}',
      /* özel ok: yazı işareti gizli, çizgiyle ok; açılınca mevcut kural 90° döndürür */
      P + ' details.pg-satir > summary > .acc-chevron{font-size:0 !important; width:30px; height:30px; flex:none; border-radius:50%;' +
        ' display:inline-flex; align-items:center; justify-content:center; background:rgba(var(--pg-rgb,22,160,133),.10);' +
        ' color:rgb(var(--pg-rgb,22,160,133)) !important; margin-left:auto; transition:transform .25s, background .25s !important;}',
      P + ' details.pg-satir > summary > .acc-chevron::before{content:""; display:block; width:7px; height:7px; border-right:2.5px solid currentColor;' +
        ' border-bottom:2.5px solid currentColor; transform:rotate(-45deg); margin-left:-2px;}',

      /* simge karesi */
      '.pg-ik{flex:none; width:46px; height:46px; border-radius:14px; display:inline-flex; align-items:center; justify-content:center;' +
        ' background:linear-gradient(145deg, rgba(var(--pg-rgb,22,160,133),.15), rgba(var(--pg-rgb,22,160,133),.05));' +
        ' border:1px solid rgba(var(--pg-rgb,22,160,133),.18); transition:transform .3s;}',
      '.pg-ik svg{width:34px; height:34px; display:block; overflow:visible;}',
      P + ' details.pg-satir[open] .pg-ik{transform:scale(1.07) rotate(-3deg);}',
      /* üzerine gelme yalnız fareli cihazlarda (dokunmatik tahtada «yapışan» hover kalmasın) */
      '@media (hover:hover){' +
        P + ' details.pg-satir:hover{box-shadow:0 8px 22px rgba(30,60,90,.10) !important;}' +
        P + ' details.pg-satir:hover > summary > .acc-chevron{background:rgba(var(--pg-rgb,22,160,133),.18);}' +
        P + ' details.pg-satir:hover .pg-ik{transform:scale(1.07) rotate(-3deg);}' +
      '}',
      /* başlıktaki küçük rozetler (Öğrenci, 0 kayıt, tüm sınıflar, bayrak) */
      P + ' details.pg-satir > summary > span:not(.pg-ik):not(.acc-chevron) + span{white-space:nowrap;}',

      /* üstte duran şeritler / kartlar (bu dönem, yenilikler, bildirim, destek) */
      P + ' .glass-card:not(details){border-radius:18px !important; border-top:1px solid #E6ECF3 !important; border-right:1px solid #E6ECF3 !important;' +
        ' border-bottom:1px solid #E6ECF3 !important; box-shadow:0 2px 10px rgba(30,60,90,.06) !important; padding:14px 18px !important;}',
      P + ' .glass-card:not(details) .pg-ik-d{border-radius:14px !important; width:46px !important; height:46px !important; background:linear-gradient(145deg, rgba(var(--pg-rgb,22,160,133),.15), rgba(var(--pg-rgb,22,160,133),.05)) !important;' +
        ' border:1px solid rgba(var(--pg-rgb,22,160,133),.18); font-size:0 !important;}',
      P + ' .glass-card:not(details) .pg-ik-d svg{width:34px; height:34px;}',

      /* sitede yenilikler: kayıtlar tek satır, başlığa dokununca açılır */
      P + ' #tpYenilik ul{list-style:none; margin:0 !important; padding:0 !important;}',
      P + ' #tpYenilik li{margin:0 0 6px !important; padding:9px 12px; border-radius:12px; background:#F7F5FB; border:1px solid #EEE9F6;}',
      P + ' #tpYenilik li > b{cursor:pointer; display:inline-block; outline:none;}',
      P + ' #tpYenilik li > b::after{content:""; display:inline-block; width:7px; height:7px; margin-left:9px; border-right:2px solid #8E44AD;' +
        ' border-bottom:2px solid #8E44AD; transform:rotate(45deg) translateY(-2px); transition:transform .2s; vertical-align:middle;}',
      P + ' #tpYenilik li.pg-ac > b::after{transform:rotate(-135deg) translateY(-1px);}',
      P + ' #tpYenilik li > b:focus-visible{outline:2px solid #8E44AD; outline-offset:3px; border-radius:4px;}',
      P + ' #tpYenilik li.pg-kapali > span:last-child{display:none !important;}',
      P + ' #tpYenilik li.pg-ac > span:last-child{animation:pgAc .3s ease backwards;}',

      /* ÜST KART */
      '#pgHero{position:relative; overflow:hidden; border-radius:22px; padding:22px 24px; color:#fff;' +
        ' background:radial-gradient(120% 140% at 100% 0%, rgba(255,255,255,.20) 0, rgba(255,255,255,0) 56%), linear-gradient(120deg,#0B6E63 0%,#12997F 54%,#34C79B 100%);' +
        ' box-shadow:0 14px 34px rgba(18,120,100,.26); display:grid; grid-template-columns:auto 1fr auto;' +
        ' grid-template-areas:"av kim res" "oz oz oz"; gap:16px 22px; align-items:center; box-sizing:border-box;}',
      '#pgHero.pg-ozetsiz{grid-template-areas:"av kim res"; row-gap:0;}',
      '#pgHero.pg-r-teacher{background:radial-gradient(120% 140% at 100% 0%, rgba(255,255,255,.20) 0, rgba(255,255,255,0) 56%), linear-gradient(120deg,#12586E 0%,#1B8A9E 54%,#3DC0CF 100%); box-shadow:0 14px 34px rgba(27,110,130,.26);}',
      '#pgHero.pg-r-admin{background:radial-gradient(120% 140% at 100% 0%, rgba(255,255,255,.20) 0, rgba(255,255,255,0) 56%), linear-gradient(120deg,#2E3A87 0%,#4C5CC4 54%,#7E8BEA 100%); box-shadow:0 14px 34px rgba(60,75,170,.28);}',
      '#pgHero .pg-arka{position:absolute; left:0; top:0; right:0; bottom:0; pointer-events:none; overflow:hidden;}',
      '#pgHero .pg-dalga{position:absolute; left:0; bottom:-6px; width:200%; height:64px; animation:pgDalga 22s linear infinite; opacity:.9;}',
      '#pgHero .pg-dalga.b{bottom:-14px; height:56px; animation-duration:31s; animation-direction:reverse; opacity:.6;}',
      '#pgHero .pg-harf{position:absolute; font-weight:700; color:#fff; opacity:.12; line-height:1; animation:pgYuz 9s ease-in-out infinite;}',
      '#pgHero .pg-yild{position:absolute; width:16px; height:16px; animation:pgYildiz 3.6s ease-in-out infinite;}',
      '#pgHero .pg-yild svg{width:100%; height:100%; display:block;}',
      '#pgHero > :not(.pg-arka){position:relative;}',
      '#pgHero .pg-av{grid-area:av; position:relative; width:94px; height:94px;}',
      '#pgHero .pg-halka{position:absolute; left:0; top:0; width:100%; height:100%; animation:pgDon 7s linear infinite;}',
      '#pgHero .pg-bas{position:absolute; left:9px; top:9px; right:9px; bottom:9px; border-radius:50%; background:linear-gradient(145deg,#fff,#E6FAF3);' +
        ' color:#0E7C6B; display:flex; align-items:center; justify-content:center; font-size:1.9rem; font-weight:800; letter-spacing:1px;' +
        ' box-shadow:inset 0 -5px 12px rgba(14,124,107,.16), 0 4px 12px rgba(0,0,0,.18);}',
      '#pgHero.pg-r-teacher .pg-bas{color:#16687C;} #pgHero.pg-r-admin .pg-bas{color:#3B49A8;}',
      '#pgHero .pg-nokta{position:absolute; right:6px; bottom:8px; width:15px; height:15px; border-radius:50%; background:#2ECC71; border:3px solid #fff; animation:pgNabiz 2.2s infinite;}',
      '#pgHero .pg-kim{grid-area:kim; min-width:0;}',
      '#pgHero .pg-selam{font-size:.95rem; opacity:.92; margin:0 0 2px;}',
      '#pgHero .pg-ad{font-size:1.7rem; font-weight:800; line-height:1.15; overflow-wrap:anywhere; text-shadow:0 2px 8px rgba(0,0,0,.14);}',
      '#pgHero .pg-etiket{display:flex; flex-wrap:wrap; align-items:center; gap:8px 10px; margin-top:9px;}',
      '#pgHero .pg-rol{display:inline-flex; align-items:center; gap:6px; padding:4px 12px 4px 8px; border-radius:999px; background:#fff; color:#0E7C6B; font-weight:800; font-size:.8rem; letter-spacing:.2px;}',
      '#pgHero.pg-r-teacher .pg-rol{color:#16687C;} #pgHero.pg-r-admin .pg-rol{color:#3B49A8;}',
      '#pgHero .pg-rol svg{width:16px; height:16px;}',
      '#pgHero .pg-posta{opacity:.9; font-size:.86rem; overflow-wrap:anywhere;}',
      '#pgHero .pg-resim{grid-area:res;}',
      '#pgHero .pg-plaka{display:flex; align-items:center; justify-content:center; width:108px; height:108px; border-radius:50%; background:#fff;' +
        ' box-shadow:0 10px 24px rgba(0,0,0,.20), 0 0 0 6px rgba(255,255,255,.22); animation:pgSalin 5s ease-in-out infinite;}',
      '#pgHero .pg-plaka svg{width:88px; height:88px; display:block;}',
      '#pgHero .pg-ozet{grid-area:oz; display:flex; flex-wrap:wrap; gap:10px;}',
      '#pgHero .pg-chip{display:inline-flex; align-items:center; gap:8px; padding:7px 14px 7px 9px; border-radius:999px; background:rgba(255,255,255,.17);' +
        ' border:1px solid rgba(255,255,255,.30); font-weight:700; font-size:.9rem; white-space:nowrap;}',
      '#pgHero .pg-chip b{font-size:1.05rem; font-weight:800; margin-right:1px;}',
      '#pgHero .pg-ci{display:inline-flex; width:24px; height:24px; align-items:center; justify-content:center; border-radius:50%; background:rgba(255,255,255,.22); flex:none;}',
      '#pgHero .pg-ci svg{width:16px; height:16px; display:block; overflow:visible;}',
      '#pgHero .pg-cz{stroke-dasharray:30; stroke-dashoffset:30; animation:pgCiz .7s .5s ease forwards;}',
      '#pgHero .pg-bk{display:block; width:10px; height:10px; border-radius:50%; background:#FFC107; animation:pgNabiz 1.8s infinite;}',
      '#pgHero .pg-hlk{width:26px; height:26px; transform:rotate(-90deg);}',
      '#pgHero .pg-hlk .iz{fill:none; stroke:rgba(255,255,255,.28); stroke-width:4;}',
      '#pgHero .pg-hlk .dl{fill:none; stroke:#fff; stroke-width:4; stroke-linecap:round; stroke-dasharray:var(--pg-c,81.7); stroke-dashoffset:var(--pg-d,0); animation:pgDol 1.2s .3s ease backwards;}',

      /* animasyonlar */
      '@keyframes pgDon{to{transform:rotate(360deg);}}',
      '@keyframes pgSalin{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-6px) rotate(2deg);}}',
      '@keyframes pgYuz{0%,100%{transform:translateY(0) rotate(-5deg); opacity:.09;}50%{transform:translateY(-16px) rotate(6deg); opacity:.2;}}',
      '@keyframes pgDalga{from{transform:translateX(0);}to{transform:translateX(-50%);}}',
      '@keyframes pgNabiz{0%{box-shadow:0 0 0 0 rgba(255,255,255,.65);}70%{box-shadow:0 0 0 9px rgba(255,255,255,0);}100%{box-shadow:0 0 0 0 rgba(255,255,255,0);}}',
      '@keyframes pgYildiz{0%,100%{transform:scale(.3) rotate(0); opacity:.1;}50%{transform:scale(1) rotate(45deg); opacity:.95;}}',
      '@keyframes pgGir{from{opacity:0; transform:translateY(16px) scale(.985);}to{opacity:1; transform:none;}}',
      '@keyframes pgAc{from{opacity:0; transform:translateY(-8px);}to{opacity:1; transform:none;}}',
      '@keyframes pgCiz{to{stroke-dashoffset:0;}}',
      '@keyframes pgDol{from{stroke-dashoffset:var(--pg-c,81.7);}to{stroke-dashoffset:var(--pg-d,0);}}',
      P + '.pg-giris .pg-oge{animation:pgGir .6s cubic-bezier(.2,.75,.2,1) backwards; animation-delay:calc(var(--pg-i,0) * 60ms);}',

      /* telefon */
      '@media (max-width:620px){' +
        P + '{max-width:none;}' +
        '#pgHero{grid-template-columns:auto 1fr; grid-template-areas:"av kim" "oz oz"; padding:16px 16px 14px; gap:12px 14px; border-radius:20px;}' +
        '#pgHero.pg-ozetsiz{grid-template-areas:"av kim"; row-gap:0;}' +
        '#pgHero .pg-av{width:72px; height:72px;} #pgHero .pg-bas{left:7px; top:7px; right:7px; bottom:7px; font-size:1.45rem;}' +
        '#pgHero .pg-ad{font-size:1.28rem;} #pgHero .pg-resim{display:none;}' +
        '#pgHero .pg-ozet{gap:8px;} #pgHero .pg-chip{font-size:.78rem; padding:5px 10px 5px 6px; gap:6px;} #pgHero .pg-chip b{font-size:.95rem;}' +
        '#pgHero .pg-ci{width:22px; height:22px;}' +
        P + ' details.pg-satir > summary{padding:10px 12px 10px 12px !important; gap:11px !important; min-height:60px; font-size:1rem !important;}' +
        '.pg-ik{width:42px; height:42px;} .pg-ik svg{width:31px; height:31px;}' +
        P + ' details.pg-satir > :not(summary){margin-left:12px !important; margin-right:12px !important;}' +
      '}',

      /* hareketi azalt / düşük güç: her şey durur, ilk kare kalır */
      '@media (prefers-reduced-motion: reduce){#pgHero *, #pgHero, ' + P + ' .pg-oge, ' + P + ' details.pg-satir{animation:none !important; transition:none !important;}' +
        P + ' .pg-svg, ' + P + ' .pg-svg *{animation-play-state:paused !important;}}',
      'html.dusuk-guc #pgHero *, html.dusuk-guc #pgHero, html.dusuk-guc ' + P + ' .pg-oge, html.dusuk-guc ' + P + ' details.pg-satir{animation:none !important; transition:none !important;}',
      'html.dusuk-guc ' + P + ' .pg-svg, html.dusuk-guc ' + P + ' .pg-svg *{animation-play-state:paused !important;}',
      '@media (prefers-reduced-motion: reduce){#pgHero .pg-cz{stroke-dashoffset:0 !important;}}',
      'html.dusuk-guc #pgHero .pg-cz{stroke-dashoffset:0 !important;}'
    ];
    var s = document.createElement('style');
    s.id = 'pgStil';
    s.textContent = c.join('\n');
    (document.head || document.documentElement).appendChild(s);
  }

  /* ------------------------------------------------------------- üst kart */
  var SELAM_YILDIZ = '<svg viewBox="0 0 24 24"><path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2z" fill="#fff"/></svg>';
  var IK = {
    kisi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c.8-4 4-6 7.5-6s6.7 2 7.5 6"/></svg>',
    sinif: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    kep: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path class="pg-cz" d="M5 12.5l4.4 4.4L19 7.4" pathLength="30"/></svg>',
    kalkan: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2.2 2.2L15.5 10"/></svg>'
  };
  var HARFLER = [['ا', 7, 18, 46], ['ب', 22, 62, 38], ['ت', 41, 14, 30], ['ج', 58, 66, 44],
                 ['د', 74, 20, 36], ['ر', 88, 58, 40], ['ك', 31, 70, 28], ['م', 66, 40, 26]];
  var YILDIZLAR = [[12, 12], [47, 28], [80, 12], [93, 36], [24, 54]];

  function selam() {
    var h = new Date().getHours();
    if (h >= 5 && h < 11) return T('pg.selam.sabah', 'Günaydın');
    if (h >= 11 && h < 18) return T('pg.selam.gun', 'İyi günler');
    if (h >= 18 && h < 23) return T('pg.selam.aksam', 'İyi akşamlar');
    return T('pg.selam.gece', 'İyi geceler');
  }
  function baslar(ad, eposta) {
    var k = String(ad || eposta || '?').replace(/@.*/, '').trim().split(/[\s._-]+/).filter(function (x) { return x; });
    var s = (k[0] || '?').charAt(0) + (k.length > 1 ? k[k.length - 1].charAt(0) : '');
    try { return s.toLocaleUpperCase('tr'); } catch (e) { return s.toUpperCase(); }
  }
  function heroBilgi() {
    var a = durum() || {};
    var rol = a.userRole === 'admin' ? 'admin' : (a.userRole === 'teacher' ? 'teacher' : 'student');
    var ad = (a.currentUserName && a.currentUserName !== 'Belirtilmedi' && a.currentUserName !== 'Öğrenci') ? a.currentUserName : '';
    var eposta = a.currentUser || '';
    if (eposta === 'Misafir Öğrenci' || eposta === 'anonim') eposta = '';
    if (!ad && eposta) ad = eposta.split('@')[0];
    var b = { rol: rol, ad: ad, eposta: eposta, chip: [] };
    if (rol === 'student') {
      var G = (window.GV && GV.ogrGorevler) || null, S = (window.GV && GV.ogrSonuclar) || {};
      var bag = (window.OH && OH.bag && OH.bag.durum === 'onayli') ? OH.bag : null;
      if (G && bag) {
        var bek = G.filter(function (v) { return !S[v._id]; }).length, bit = G.length - bek;
        b.chip.push(bek ? { t: 'bek', n: bek, y: T('pg.bekleyen', 'bekleyen görev') } : { t: 'ok', y: T('pg.bekleyenyok', 'Bekleyen görev yok') });
        if (G.length) b.chip.push({ t: 'oran', oran: Math.round(bit * 100 / G.length), bit: bit, top: G.length, y: T('pg.tamam', 'tamamlandı') });
      }
      if (bag && (bag.sinifAd || bag.seviyeAd)) b.chip.push({ t: 'sinif', y: (bag.seviyeAd ? bag.seviyeAd + (bag.sinifAd ? ' / ' : '') : '') + (bag.sinifAd || '') });
      if (bag && bag.ogretmenAd) b.chip.push({ t: 'ogt', y: bag.ogretmenAd });
    }
    /* öğretmen / yönetici: sınıf ve öğrenci sayıları zaten «Bu dönem» kartında; burada tekrarlanmaz */
    return b;
  }
  function rolYazi(rol) {
    return rol === 'admin' ? T('pg.rol.yonetici', 'Yönetici') : (rol === 'teacher' ? T('pg.rol.ogretmen', 'Öğretmen') : T('pg.rol.ogrenci', 'Öğrenci'));
  }
  function chipHtml(c) {
    var ik = '', n = (c.n != null) ? '<b data-pg-n="' + c.n + '">' + c.n + '</b>' : '';
    if (c.t === 'bek') ik = '<span class="pg-ci"><i class="pg-bk"></i></span>';
    else if (c.t === 'ok') ik = '<span class="pg-ci">' + IK.check + '</span>';
    else if (c.t === 'oran') {
      var C = 2 * Math.PI * 10.5, D = C * (1 - c.oran / 100);
      return '<span class="pg-chip" title="%' + c.oran + '"><span class="pg-ci"><svg class="pg-hlk" viewBox="0 0 26 26" style="--pg-c:' + C.toFixed(1) + ';--pg-d:' + D.toFixed(1) + '">' +
        '<circle class="iz" cx="13" cy="13" r="10.5"/><circle class="dl" cx="13" cy="13" r="10.5"/></svg></span><b>' + c.bit + '/' + c.top + '</b><span>' + esc(c.y) + '</span></span>';
    }
    else if (c.t === 'sinif') ik = '<span class="pg-ci">' + IK.sinif + '</span>';
    else if (c.t === 'ogt') ik = '<span class="pg-ci">' + IK.kep + '</span>';
    return '<span class="pg-chip">' + ik + n + '<span>' + esc(c.y) + '</span></span>';
  }
  /* dalga parçaları: "T x y" ile periyodik eğri — periyot, yarım genişliği (1200) tam bölmeli ki döngü kesintisiz olsun */
  function dalgaT(periyot, son, y) {
    var s = '', x, yarim = periyot / 2;
    for (x = periyot; x <= son; x += yarim) s += 'T' + x + ' ' + y;
    return s;
  }
  function heroHtml(b) {
    var sv = b.rol === 'student' ? svg('ogrenci') : svg('ogretmen');
    var arka = '<div class="pg-arka" aria-hidden="true">' +
      '<svg class="pg-dalga" viewBox="0 0 2400 64" preserveAspectRatio="none"><path d="M0 30Q100 10 200 30' + dalgaT(400, 2400, 30) + 'V64H0Z" fill="rgba(255,255,255,.10)"/></svg>' +
      '<svg class="pg-dalga b" viewBox="0 0 2400 56" preserveAspectRatio="none"><path d="M0 26Q150 6 300 26' + dalgaT(600, 2400, 26) + 'V56H0Z" fill="rgba(255,255,255,.08)"/></svg>';
    HARFLER.forEach(function (h, i) {
      arka += '<span class="pg-harf" style="left:' + h[1] + '%;top:' + h[2] + '%;font-size:' + h[3] + 'px;animation-delay:-' + (i * 1.3) + 's;animation-duration:' + (8 + (i % 4) * 1.7) + 's">' + h[0] + '</span>';
    });
    YILDIZLAR.forEach(function (y, i) {
      arka += '<span class="pg-yild" style="left:' + y[0] + '%;top:' + y[1] + '%;animation-delay:-' + (i * 0.9) + 's">' + SELAM_YILDIZ + '</span>';
    });
    arka += '</div>';
    var av = '<div class="pg-av"><svg class="pg-halka" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="pgHalkaG" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#FFE082"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient></defs>' +
      '<circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,.26)" stroke-width="3.5"/>' +
      '<circle cx="50" cy="50" r="46" fill="none" stroke="url(#pgHalkaG)" stroke-width="4" stroke-linecap="round" stroke-dasharray="120 170"/></svg>' +
      '<span class="pg-bas">' + esc(baslar(b.ad, b.eposta)) + '</span><i class="pg-nokta"></i></div>';
    var kim = '<div class="pg-kim"><div class="pg-selam">' + esc(selam()) + ',</div><div class="pg-ad">' + esc(b.ad || rolYazi(b.rol)) + '</div>' +
      '<div class="pg-etiket"><span class="pg-rol">' + (b.rol === 'student' ? IK.kisi : IK.kalkan.replace(/#fff/g, 'currentColor')) + esc(rolYazi(b.rol)) + '</span>' +
      (b.eposta ? '<span class="pg-posta">' + esc(b.eposta) + '</span>' : '') + '</div></div>';
    var resim = '<div class="pg-resim"><span class="pg-plaka">' + sv + '</span></div>';
    var chips = '';
    b.chip.forEach(function (c) { chips += chipHtml(c); });
    return arka + av + kim + resim + (chips ? '<div class="pg-ozet">' + chips + '</div>' : '');
  }
  function sayiAnim(kok) {
    if (hareketYok()) return;
    var l = kok.querySelectorAll('b[data-pg-n]');
    for (var i = 0; i < l.length; i++) (function (el) {
      var hedef = parseInt(el.getAttribute('data-pg-n'), 10) || 0, t0 = null;
      if (hedef < 1) return;
      function adim(t) {
        if (t0 == null) t0 = t;
        var k = Math.min(1, (t - t0) / 800), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(hedef * e);
        if (k < 1) requestAnimationFrame(adim);
      }
      el.textContent = '0';
      requestAnimationFrame(adim);
    })(l[i]);
  }
  function heroKur(s) {
    var b = heroBilgi();
    var imza = [b.rol, b.ad, b.eposta, JSON.stringify(b.chip)].join('|');
    var h = document.getElementById('pgHero');
    if (h && h.parentNode === s && h.getAttribute('data-imza') === imza) {
      if (s.firstChild !== h) s.insertBefore(h, s.firstChild);
      return h;
    }
    var yeni = !h;
    if (!h) { h = document.createElement('div'); h.id = 'pgHero'; }
    h.className = 'pg-oge pg-r-' + b.rol + ((b.chip.length) ? '' : ' pg-ozetsiz');
    h.setAttribute('data-imza', imza);
    h.setAttribute('role', 'region');
    h.setAttribute('aria-label', T('pg.kimlik', 'Hesabım'));
    h.innerHTML = heroHtml(b);
    if (h.parentNode !== s || s.firstChild !== h) s.insertBefore(h, s.firstChild);
    if (hareketYok()) { var l = h.querySelectorAll('svg.pg-svg'); for (var i = 0; i < l.length; i++) { try { l[i].pauseAnimations(); } catch (e) { } } }
    if (yeni || true) sayiAnim(h);
    return h;
  }

  /* --------------------------------------------------------- satır / şerit */
  function rgbOku(renk) {
    var m = /rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/.exec(renk || '');
    return m ? (m[1] + ',' + m[2] + ',' + m[3]) : '';
  }
  /* bölüm rengi = öğenin KENDİ satır içi çizgi rengi (kendi kurallarımız bu değeri bozamaz) */
  function bolumRengi(el, taraf) {
    var r = rgbOku(el.style[taraf]);
    if (r) return r;
    try { r = rgbOku(getComputedStyle(el)[taraf]); } catch (e) { }
    return r;
  }
  function ikonBul(d, metin) {
    if (d.id && KIMLIK_IKON[d.id]) return KIMLIK_IKON[d.id];
    if (d.classList.contains('kd-dil-kart')) return 'dunya-kuresi';
    var e = ilkEmoji(metin);
    return e ? (EMOJI_IKON[e] || EMOJI_IKON[e.replace(/\uFE0F/g, '')] || '') : '';
  }
  function ikHtml(id, sinif) { return '<span class="' + sinif + '" aria-hidden="true">' + svg(id) + '</span>'; }
  function satir(d) {
    if (d.getAttribute('data-pg') !== '1') {
      d.setAttribute('data-pg', '1');
      d.className = (d.className ? d.className + ' ' : '') + 'pg-satir pg-oge';
      var rgb = bolumRengi(d, 'borderBottomColor');
      if (rgb) d.style.setProperty('--pg-rgb', rgb);
    }
    /* başlık başka bir kod tarafından yeniden yazılabilir (ör. dil değişince dil kartı): simge her turda denetlenir */
    var sm = null, i;
    for (i = 0; i < d.children.length; i++) if (d.children[i].tagName === 'SUMMARY') { sm = d.children[i]; break; }
    if (!sm || sm.getElementsByClassName('pg-ik').length) return;
    var ilk = null;
    for (i = 0; i < sm.children.length; i++) {
      var c = sm.children[i];
      if (c.tagName === 'SPAN' && !c.classList.contains('acc-chevron') && !c.classList.contains('pg-ik')) { ilk = c; break; }
    }
    var yazi = ilk ? (ilk.textContent || '') : '';
    var ik = ikonBul(d, yazi);
    if (!ik || !SVG[ik]) return;
    /* başlıktaki emoji gider (metin düğümü), yerine SVG karesi gelir */
    if (ilk) {
      var w = ilk.firstChild;
      while (w && w.nodeType !== 3) w = w.nextSibling;
      if (w && EMOJI_BAS.test(w.nodeValue)) w.nodeValue = w.nodeValue.replace(EMOJI_BAS, '');
    }
    sm.insertAdjacentHTML('afterbegin', ikHtml(ik, 'pg-ik'));
    if (hareketYok()) { var sv = sm.querySelector('svg.pg-svg'); if (sv) { try { sv.pauseAnimations(); } catch (e2) { } } }
  }
  function serit(b) {
    if (b.getAttribute('data-pg') !== '1') {
      b.setAttribute('data-pg', '1');
      b.className = (b.className ? b.className + ' ' : '') + 'pg-oge';
      var rgb = bolumRengi(b, 'borderLeftColor');
      if (rgb) b.style.setProperty('--pg-rgb', rgb);
    }
    if (b.id === 'tpDestek' || b.getElementsByClassName('pg-ik-d').length) return;   /* tpDestek'in kendi kalp çizimi var */
    var yuv = b.querySelectorAll('span'), i, hedef = null;
    for (i = 0; i < yuv.length; i++) {
      var st = yuv[i].getAttribute('style') || '';
      if (/border-radius:\s*50%/.test(st) && /width:\s*40px/.test(st) && ilkEmoji(yuv[i].textContent)) { hedef = yuv[i]; break; }
    }
    if (!hedef) return;
    var ik = KIMLIK_IKON[b.id] || EMOJI_IKON[ilkEmoji(hedef.textContent)] || EMOJI_IKON[ilkEmoji(hedef.textContent).replace(/\uFE0F/g, '')] || '';
    if (!ik || !SVG[ik]) return;
    hedef.className = (hedef.className ? hedef.className + ' ' : '') + 'pg-ik pg-ik-d';
    hedef.innerHTML = svg(ik);
    if (hareketYok()) { var sv = hedef.querySelector('svg.pg-svg'); if (sv) { try { sv.pauseAnimations(); } catch (e2) { } } }
  }
  /* öğretmende «Sitede yenilikler»: ilk kayıt açık, öbürleri başlığa dokununca açılır */
  function yenilik(s) {
    var k = s.querySelector('#tpYenilik');
    if (!k || k.getAttribute('data-pg-y') === '1') return;
    k.setAttribute('data-pg-y', '1');
    var l = k.querySelectorAll('ul > li'), i, dar = false;
    try { dar = window.innerWidth < 620; } catch (e) { }
    for (i = 0; i < l.length; i++) (function (li, ilk) {
      var bas = li.querySelector('b');
      if (!bas) return;
      li.className = (li.className ? li.className + ' ' : '') + (ilk ? 'pg-ac' : 'pg-kapali');
      bas.setAttribute('role', 'button'); bas.setAttribute('tabindex', '0'); bas.setAttribute('aria-expanded', ilk ? 'true' : 'false');
      function degis() {
        var ac = li.classList.contains('pg-kapali');
        li.classList.toggle('pg-kapali', !ac); li.classList.toggle('pg-ac', ac);
        bas.setAttribute('aria-expanded', ac ? 'true' : 'false');
      }
      bas.addEventListener('click', degis);
      bas.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); degis(); } });
    })(l[i], i === 0 && !dar);
  }

  /* -------------------------------------------------------------- ana akış */
  var onceGorunur = false, girisZaman = null, izleyici = null, stilIzleyici = null;
  function girisBaslat(s) {
    if (hareketYok()) return;
    s.classList.add('pg-giris');
    clearTimeout(girisZaman);
    girisZaman = setTimeout(function () { try { s.classList.remove('pg-giris'); } catch (e) { } }, 1300);
  }
  function uygula() {
    var s = sec();
    if (!s) return;
    var simdi = gorunur(s);
    if (simdi && !onceGorunur) girisBaslat(s);
    onceGorunur = simdi;
    if (!simdi) return;
    stil();
    if (!s.classList.contains('pg')) s.classList.add('pg');
    var hero = heroKur(s);
    var cocuk = [], i, j;
    for (i = 0; i < s.children.length; i++) {
      var c = s.children[i];
      if (c === hero) continue;
      if (c.id === 'gvProfilKart') { for (j = 0; j < c.children.length; j++) cocuk.push(c.children[j]); }
      else cocuk.push(c);
    }
    for (i = 0; i < cocuk.length; i++) {
      var o = cocuk[i];
      if (o.nodeType !== 1) continue;
      if (o.tagName === 'DETAILS' && o.classList.contains('profile-accordion')) satir(o);
      else if (o.classList.contains('glass-card')) serit(o);
      else if (!o.classList.contains('pg-oge')) o.className = (o.className ? o.className + ' ' : '') + 'pg-oge';
      o.style.setProperty('--pg-i', String(i + 1));
    }
    hero.style.setProperty('--pg-i', '0');
    yenilik(s);
  }
  function calistir() {
    var s = sec();
    if (!s) return;
    if (izleyici) { izleyici.disconnect(); stilIzleyici.disconnect(); }
    try { uygula(); } catch (e) { try { console.warn('profilgorunum', e); } catch (e2) { } }
    if (izleyici) izle(s);
  }
  function izle(s) {
    /* içerik değişimi (alt ağaç) + bölümün KENDİ görünürlüğü (satır içi display) ayrı izlenir:
       iç öğelerin her stil değişimi (sayaçlar, ilerleme çubukları) bizi uyandırmasın */
    izleyici.observe(s, { childList: true, subtree: true });
    stilIzleyici.observe(s, { attributes: true, attributeFilter: ['style'] });
  }
  function basla() {
    var s = sec();
    if (!s || typeof MutationObserver === 'undefined') return;
    izleyici = new MutationObserver(function () { calistir(); });
    stilIzleyici = new MutationObserver(function () { calistir(); });
    izle(s);
    calistir();
    /* dış veri (görevler, bağ, dil) geç gelirse üst kart kendini tazeler */
    setInterval(function () { try { if (gorunur(sec())) calistir(); } catch (e) { } }, 2500);
  }
  PG.yenile = calistir;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
  else basla();
})();
