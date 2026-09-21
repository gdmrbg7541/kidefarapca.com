/* =====================================================================
   KIDEF · ARAPÇA KLAVYE — sinifici/arapcaklavye.js
   ---------------------------------------------------------------------
   · Harf klavyesi kaliplartablosu.html'deki klavyenin AYNISI
     (universalKeyboardLayout dizilimi, harf ailesi renkleri, elif'e
     uzun basınca أ إ آ).
   · Klavyenin ÜSTÜNDE ayrı hareke alanı, iki satır: harekeler, şedde,
     tenvinler, çekerler, med, hemze, cc · sav. Harekeler harf üstünde
     değil, tek başına (◌ çemberin üstünde/altında) çizilir.
   · "؟١٢" tuşu sembol katmanını açar: noktalama, rakamlar, mühür ve dinî
     ifadeler, Kur'an işaretleri (vakıf, âyet), görünmez işaretler.
     Sekmeler kaliplartablosu'ndaki mücerred/mezid sekmesi gibi: kırmızı
     kayan vurgu, içerik yana kayarak değişir.
   · ⓘ rozetli tuşlar ne işe yaradığını animasyonlu SVG ile anlatır.
   · Kopyala: hedef programa göre (Word, Google Dokümanlar, Pages,
     LibreOffice, PowerPoint, Not Defteri, WhatsApp) okunaklı yazı tipi
     kodlarıyla panoya yazar; .rtf / .txt / .png olarak da kaydeder.
   ===================================================================== */
(function () {
  'use strict';

  var $ = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };
  var DEPO = 'kidef-arapcaklavye-v1';
  var ta = $('#metin');

  /* =====================================================================
     1) VERİ
     ===================================================================== */
  /* kaliplartablosu.js → universalKeyboardLayout ile aynı (soldan sağa) */
  var DIZILIM = [
    ['ذ', 'ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
    ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
    ['ئ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ', 'SIL']
  ];
  /* kaliplartablosu.js → getLetterColor ile aynı */
  var RENK = {
    'ب': '#d4efdf', 'ت': '#d4efdf', 'ث': '#d4efdf', 'ج': '#fadbd8', 'ح': '#fadbd8', 'خ': '#fadbd8',
    'د': '#fae5d3', 'ذ': '#fae5d3', 'ر': '#fcf3cf', 'ز': '#fcf3cf', 'س': '#d6eaf8', 'ش': '#d6eaf8',
    'ص': '#e8daef', 'ض': '#e8daef', 'ط': '#d1f2eb', 'ظ': '#d1f2eb', 'ع': '#f5b7b1', 'غ': '#f5b7b1',
    'ف': '#d4e6f1', 'ق': '#d4e6f1', 'ا': '#ebedef', 'ء': '#ebedef', 'ؤ': '#ebedef', 'ئ': '#ebedef',
    'ي': '#d7bde2', 'ى': '#d7bde2'
  };
  /* uzun basınca açılan harfler */
  var UZUN = {
    'ا': ['أ', 'إ', 'آ', 'ٱ'], 'ه': ['ة'], 'ة': ['ه', 'ت'], 'ي': ['ى', 'ئ'], 'ى': ['ي', 'ئ'],
    'و': ['ؤ'], 'ء': ['أ', 'إ', 'ؤ', 'ئ'], 'ل': ['لا', 'لأ', 'لإ', 'لآ']
  };

  var D = '\u25CC';                                  /* ◌ taşıyıcı çember */
  /* Hareke tuşu yüzleri: işaret HARFSİZ, ◌ çemberin üstünde/altında. Yollar yazı tipinden
     çıkarıldı (Arakom; Arakomda boş olan dik esre / ters ötre ve Kur'an işaretleri Amiri).
     Üreten betik: isaret_yol.py */
  var IS_R = 150;
  var IS_KUTU = {"hu": "-495 -664 990 836", "ha": "-495 -172 990 836", "ku": "-403 -923 807 1095", "ka": "-403 -172 807 1095"};
  var IS_YOL = {
    '\u064B': ['hu', 'M169 -628Q169 -560 134 -542L-169 -370Q-168 -391 -165 -404Q-162 -418 -154 -429Q-147 -440 -135 -449Q-123 -458 -103 -470L169 -628ZM169 -480Q169 -417 134 -394L-169 -222Q-168 -243 -165 -257Q-162 -271 -154 -282Q-147 -293 -135 -303Q-123 -313 -103 -325L169 -480Z'],
    '\u064C': ['hu', 'M200 -368Q200 -351 200 -336Q200 -321 198 -308Q178 -319 154 -334Q132 -349 106 -368Q-20 -239 -134 -222Q-90 -317 -90 -351Q-90 -407 -140 -407Q-184 -407 -190 -331Q-194 -346 -197 -358Q-200 -371 -200 -382Q-200 -430 -175 -462Q-150 -493 -116 -493Q-48 -493 -48 -392L-54 -300Q-22 -314 8 -336Q40 -358 68 -390Q4 -437 4 -484Q4 -510 13 -536Q22 -562 42 -585Q82 -632 126 -632Q138 -632 150 -624Q162 -617 171 -605Q180 -593 187 -579Q194 -565 194 -552Q194 -521 182 -494Q172 -466 160 -437Q180 -423 190 -406Q200 -388 200 -368ZM124 -511Q124 -564 84 -564Q56 -564 56 -542Q56 -517 120 -472Q124 -485 124 -511Z'],
    '\u064D': ['ha', 'M169 222Q169 287 134 308L-169 480Q-168 459 -165 446Q-162 432 -154 421Q-147 410 -135 400Q-123 390 -103 378L169 222ZM169 370Q169 433 134 456L-169 628Q-168 607 -165 593Q-162 579 -154 568Q-147 556 -135 546Q-123 537 -103 525L169 370Z'],
    '\u064E': ['hu', 'M169 -480Q169 -417 134 -394L-169 -222Q-168 -243 -165 -257Q-162 -271 -154 -282Q-147 -293 -135 -303Q-123 -313 -103 -325L169 -480Z'],
    '\u064F': ['hu', 'M164 -314 84 -368Q-36 -222 -113 -222Q-133 -222 -172 -235Q-121 -264 -68 -302Q-15 -341 41 -390Q-20 -436 -20 -480Q-20 -511 -9 -542Q2 -573 25 -605Q55 -648 96 -648Q164 -648 164 -560Q164 -514 133 -443Q141 -438 150 -431Q160 -424 172 -415ZM102 -503Q102 -526 86 -544Q69 -562 49 -562Q31 -562 31 -544Q31 -512 96 -468Q102 -489 102 -503Z'],
    '\u0650': ['ha', 'M169 222Q169 290 134 308L-169 480Q-168 459 -165 445Q-162 431 -154 420Q-147 410 -135 400Q-123 391 -103 380L169 222Z'],
    '\u0651': ['hu', 'M177 -456Q177 -288 73 -288Q36 -288 9 -308Q5 -292 -5 -276Q-15 -261 -29 -249Q-43 -237 -60 -230Q-77 -222 -95 -222Q-177 -222 -177 -331Q-177 -353 -154 -431L-132 -435Q-132 -325 -93 -325Q-30 -325 -3 -486L16 -493Q37 -394 73 -394Q131 -394 140 -542L163 -552Q171 -524 174 -500Q177 -476 177 -456Z'],
    '\u0652': ['hu', 'M129 -386Q129 -354 116 -324Q104 -295 83 -272Q62 -250 34 -236Q7 -222 -23 -222Q-129 -222 -129 -343Q-129 -385 -119 -420Q-109 -456 -91 -482Q-73 -507 -48 -522Q-23 -536 8 -536Q32 -536 54 -523Q76 -510 92 -489Q109 -468 119 -441Q129 -414 129 -386ZM74 -364Q74 -386 31 -421Q11 -435 -6 -442Q-23 -450 -37 -450Q-96 -450 -96 -380Q-96 -323 -4 -323Q74 -323 74 -364Z'],
    '\u0653': ['hu', 'M435 -357Q285 -222 61 -222Q32 -222 -11 -228Q-54 -234 -111 -247Q-168 -261 -212 -268Q-256 -274 -285 -274Q-311 -274 -343 -266Q-375 -259 -410 -245L-435 -259Q-340 -392 -245 -392Q-171 -392 -25 -362Q117 -331 196 -331Q233 -331 288 -342Q343 -352 415 -374L435 -357Z'],
    '\u0654': ['hu', 'M154 -365Q152 -351 149 -342Q146 -334 144 -329Q136 -305 122 -302L-154 -222Q-150 -242 -143 -254Q-136 -267 -126 -275Q-110 -292 -54 -310Q-120 -345 -120 -390Q-120 -411 -104 -433Q-18 -552 60 -552Q112 -552 112 -494Q112 -475 84 -427Q30 -460 4 -460Q-24 -460 -64 -427Q14 -351 76 -351Q90 -351 109 -354Q128 -357 154 -365Z'],
    '\u0655': ['ha', 'M154 406Q152 420 149 429Q146 438 144 443Q140 455 134 462Q130 470 122 472L-154 552Q-150 532 -143 518Q-136 504 -126 496Q-118 488 -100 480Q-82 473 -54 462Q-120 430 -120 384Q-120 363 -104 341Q-18 222 60 222Q112 222 112 277Q112 290 104 307Q98 324 84 347Q30 312 4 312Q-24 312 -64 347Q16 421 76 421Q102 421 154 406Z'],
    '\u0656': ['ha', 'M-48 232Q-42 211 -24 233Q107 379 66 602Q64 615 52 617Q41 619 38 602Q19 458 -68 350Q-79 338 -75 320Z'],
    '\u0657': ['hu', 'M-84 -223Q-104 -218 -122 -245Q-157 -298 -122 -388Q-133 -393 -141 -398Q-148 -403 -154 -406Q-172 -414 -162 -433L-147 -462Q-139 -476 -126 -472Q-121 -469 -111 -465Q-102 -461 -89 -454Q6 -580 127 -640Q153 -653 163 -637Q174 -616 143 -600Q21 -528 -53 -433Q-12 -411 4 -395Q37 -364 22 -327Q-16 -234 -84 -223ZM-69 -311Q-38 -283 -19 -315Q-14 -323 -26 -335Q-40 -349 -84 -370Q-91 -327 -69 -311Z'],
    '\u0670': ['hu', 'M64 -396Q64 -267 6 -222L10 -259L14 -335Q14 -410 -2 -452Q-18 -495 -40 -515L-58 -544L-64 -562Q-64 -586 -18 -640L6 -607L32 -552Q40 -535 46 -517Q50 -499 56 -480L62 -439L64 -396Z'],
    '\u06D6': ['ku', 'M-194 -513Q-196 -532 -197 -560Q-198 -588 -201 -624Q-203 -634 -203 -659Q-204 -685 -207 -725Q-208 -751 -203 -759L-186 -784Q-161 -824 -158 -777Q-149 -537 -135 -507Q-117 -464 -83 -469Q-52 -473 -11 -518Q4 -533 12 -528Q58 -499 73 -495Q76 -496 89 -508Q102 -520 125 -542Q206 -615 271 -621Q307 -626 326 -595Q345 -564 321 -507Q282 -423 201 -411Q98 -396 -8 -452Q-39 -418 -46 -412Q-91 -371 -135 -409Q-165 -437 -175 -489Q-185 -430 -212 -386Q-240 -343 -298 -308Q-233 -297 -134 -295Q-65 -294 3 -295Q70 -297 135 -302Q151 -305 198 -309Q245 -313 322 -320Q345 -323 333 -303L301 -257Q293 -244 285 -243Q245 -237 172 -233Q99 -228 -7 -224Q-201 -218 -300 -232Q-329 -236 -336 -261Q-342 -298 -321 -334Q-298 -374 -271 -392Q-193 -448 -194 -513ZM270 -536Q220 -591 98 -489Q137 -481 182 -480Q227 -480 277 -488Q285 -521 270 -536Z'],
    '\u06D7': ['ku', 'M-55 -466Q18 -466 74 -522Q73 -543 66 -554Q56 -568 52 -558Q34 -513 -4 -511Q-66 -509 -69 -584Q-72 -624 -40 -674Q-17 -712 9 -714Q37 -716 67 -678Q111 -624 109 -550Q107 -507 84 -470Q33 -390 -55 -390Q-154 -390 -175 -489Q-185 -430 -212 -386Q-240 -343 -298 -308Q-233 -297 -134 -295Q-54 -294 14 -295Q81 -297 135 -302Q191 -309 237 -313Q283 -317 322 -320Q345 -323 333 -303L301 -257Q293 -244 285 -243Q245 -237 172 -233Q99 -228 -7 -224Q-201 -218 -300 -232Q-329 -236 -336 -261Q-342 -298 -321 -334Q-298 -374 -271 -392Q-193 -448 -194 -513Q-196 -532 -197 -560Q-198 -588 -201 -624Q-203 -634 -203 -659Q-204 -685 -207 -725Q-208 -751 -203 -759L-186 -784Q-161 -824 -158 -777Q-149 -537 -135 -507Q-116 -466 -55 -466ZM-43 -887Q-41 -891 -36 -888Q-8 -880 12 -864L40 -905Q41 -909 47 -906Q53 -905 67 -897Q81 -890 103 -875Q107 -872 104 -866L66 -807Q65 -803 59 -809Q58 -811 46 -818Q34 -824 14 -836L-17 -789Q-18 -788 -24 -791Q-32 -795 -46 -803Q-61 -811 -80 -825Q-83 -828 -81 -829Z'],
    '\u06D8': ['ku', 'M50 -393Q-27 -257 -164 -225Q-194 -218 -198 -228Q-206 -247 -177 -261Q-47 -325 17 -419Q46 -587 119 -584Q200 -581 200 -434L175 -382Q172 -375 161 -375Q91 -378 50 -393Z'],
    '\u06D9': ['ku', 'M105 -419Q158 -536 141 -752Q140 -781 144 -791Q152 -806 158 -816Q163 -825 165 -827Q167 -831 171 -831Q176 -831 178 -825Q185 -803 191 -788Q196 -773 202 -766Q216 -754 203 -741L181 -719Q188 -523 119 -388Q130 -359 137 -333Q144 -308 145 -284Q148 -238 122 -232Q48 -214 -41 -228Q-50 -229 -52 -233Q-65 -268 -47 -291Q-41 -301 -36 -298Q-30 -297 -22 -297Q-14 -297 -8 -295V-297Q50 -328 85 -382Q5 -551 -114 -663L-125 -642Q-136 -635 -144 -645L-199 -704Q-211 -718 -208 -735L-197 -805Q-195 -816 -191 -816Q-174 -819 -101 -729Q42 -558 105 -419ZM98 -351Q89 -335 76 -322Q64 -308 50 -294V-293Q96 -293 111 -300Q110 -322 98 -351Z'],
    '\u06DA': ['ku', 'M177 -811 157 -767Q153 -762 149 -762Q-40 -737 -118 -686Q-268 -587 -235 -449Q-217 -375 -119 -331Q-93 -320 -51 -312Q-9 -304 47 -301Q104 -298 157 -298Q210 -298 258 -302Q270 -304 274 -299Q278 -295 274 -290Q270 -283 265 -281Q241 -275 221 -267Q201 -259 188 -251Q146 -226 138 -226Q-97 -206 -199 -281Q-304 -359 -267 -518Q-229 -682 -74 -755Q-180 -781 -235 -750Q-238 -748 -245 -748Q-249 -748 -249 -752Q-249 -772 -241 -792Q-227 -834 -163 -838Q-148 -839 -124 -836Q-100 -832 -66 -825Q3 -813 47 -813Q94 -813 161 -825Q185 -829 177 -811ZM-29 -554Q-27 -558 -22 -555Q10 -544 35 -522Q38 -520 36 -516L-2 -455Q-4 -452 -11 -456Q-13 -459 -27 -467Q-41 -476 -66 -491Q-70 -493 -67 -496Z'],
    '\u06DB': ['ku', 'M-5 -499Q-1 -503 5 -500Q25 -489 42 -475Q58 -460 72 -441Q76 -434 72 -430L6 -358Q1 -353 -5 -361Q-8 -365 -25 -381Q-42 -397 -72 -423Q-75 -427 -72 -430ZM-103 -364Q-97 -369 -93 -365Q-53 -343 -24 -306Q-20 -300 -24 -296L-92 -223Q-93 -221 -103 -228L-169 -289Q-172 -292 -170 -296ZM91 -364Q94 -367 100 -365Q142 -342 169 -306Q173 -300 169 -296L101 -223Q97 -219 91 -228Q91 -228 74 -243Q57 -259 24 -289Q21 -292 23 -296Z'],
    '\u06DC': ['ku', 'M315 -694Q316 -701 323 -701Q330 -701 334 -696Q344 -681 344 -642Q344 -613 338 -587Q331 -561 316 -537Q308 -525 297 -524Q261 -515 210 -546Q175 -481 108 -491Q107 -456 101 -427Q95 -397 86 -372Q70 -323 29 -290Q-61 -218 -172 -222Q-310 -226 -340 -335Q-344 -350 -344 -373Q-343 -396 -338 -425Q-331 -453 -319 -484Q-307 -515 -289 -550Q-288 -555 -281 -555Q-276 -555 -274 -553Q-271 -548 -274 -543Q-325 -444 -316 -414Q-287 -310 -165 -306Q0 -302 71 -414Q75 -474 40 -551Q35 -559 37 -564Q53 -601 66 -617Q70 -621 73 -619Q75 -617 80 -610Q85 -604 91 -593Q102 -572 110 -569Q151 -561 192 -594Q209 -608 223 -667Q225 -674 228 -675Q232 -678 236 -675Q246 -668 238 -630Q270 -606 308 -610Q308 -623 304 -627Q298 -632 301 -637Z'],
    '\u06E1': ['ku', 'M113 -401Q145 -393 131 -356Q123 -335 105 -317Q80 -292 61 -275Q43 -258 29 -247Q7 -228 -19 -224Q-63 -218 -125 -232Q-137 -233 -135 -247Q-132 -257 -125 -257Q-19 -265 50 -319Q10 -335 -26 -338Q-62 -339 -98 -324Q-107 -320 -113 -327Q-121 -339 -114 -349Q-98 -369 -82 -385Q-67 -400 -53 -409Q-22 -434 29 -422Z'],
    '\u06E2': ['ku', 'M-50 -612Q-81 -587 -68 -621Q-61 -643 -50 -662Q-38 -680 -24 -694Q2 -723 50 -696Q86 -676 108 -634Q115 -623 112 -610L105 -565Q102 -550 83 -547Q-71 -526 -85 -474Q-27 -320 -23 -251Q-21 -225 -34 -222Q-46 -221 -53 -244Q-57 -262 -66 -289Q-74 -316 -88 -351Q-116 -426 -112 -481Q-104 -583 18 -610Q-12 -645 -50 -612Z'],
    '\u06E8': ['ku', 'M120 -641Q136 -614 147 -583Q159 -552 167 -515Q184 -444 173 -372Q167 -335 149 -307Q104 -236 -12 -223Q-94 -215 -137 -255Q-181 -296 -177 -367Q-173 -440 -127 -501Q-122 -510 -116 -506Q-112 -503 -118 -490Q-167 -408 -136 -356Q-105 -305 -16 -305Q89 -307 152 -373Q154 -375 154 -380Q154 -416 130 -479Q107 -541 87 -570Q82 -577 85 -584L109 -643Q114 -653 120 -641ZM-27 -760Q-25 -764 -20 -762Q12 -751 37 -729Q39 -726 38 -722L-1 -661Q-2 -658 -9 -663Q-12 -665 -25 -674Q-39 -682 -64 -697Q-68 -700 -65 -702Z'],
    '\u06ED': ['ka', 'M-50 319Q-81 344 -68 310Q-61 288 -50 269Q-38 251 -24 237Q2 208 50 235Q86 255 108 297Q115 308 112 321L105 366Q102 381 83 384Q-71 405 -85 457Q-27 611 -23 680Q-21 706 -34 709Q-46 710 -53 687Q-57 669 -66 642Q-74 615 -88 580Q-116 505 -112 450Q-104 348 18 321Q-12 286 -50 319Z']
  };

  /* HAREKE ALANI — klavyenin üstünde, iki satır, iki blok (sağdan sola).
     Sağ blok: kısa harekeler ve hemen altlarında uzatan eşleri (üstün/dik üstün,
     esre/dik esre, ötre/ters ötre, cezm/med). Sol blok: şedde, tenvinler,
     hemzeler, cc · sav. Şeddeli birleşimler yok: şedde ile hareke ayrı ayrı
     basılır, ikisi birlikte durur. ⓘ yalnız her grubun ilk tuşunda. */
  var HAREKE = [
    [ /* sağ blok */
      [{ c: 'َ', ad: 'üstün', grup: 'hareke', bilgi: 'hareke' }, { c: 'ِ', ad: 'esre', grup: 'hareke' },
       { c: 'ُ', ad: 'ötre', grup: 'hareke' }, { c: 'ْ', ad: 'cezm', grup: 'hareke' }],
      [{ c: 'ٰ', ad: 'dik üstün', grup: 'ceker', bilgi: 'ceker' }, { c: 'ٖ', ad: 'dik esre', grup: 'ceker' },
       { c: 'ٗ', ad: 'ters ötre', grup: 'ceker' }, { c: 'ٓ', ad: 'med', grup: 'ceker' }]],
    [ /* sol blok */
      [{ c: 'ّ', ad: 'şedde', grup: 'sedde', bilgi: 'sedde' },
       { c: 'ً', ad: 'iki üstün', grup: 'tenvin', bilgi: 'tenvin' }, { c: 'ٍ', ad: 'iki esre', grup: 'tenvin' },
       { c: 'ٌ', ad: 'iki ötre', grup: 'tenvin' }],
      [{ c: 'ٔ', ad: 'üstte hemze', grup: 'hemze', bilgi: 'hemze' }, { c: 'ٕ', ad: 'altta hemze', grup: 'hemze' },
       { c: 'ﷻ', ad: 'cc', uzun: 'celle celâlühû', grup: 'muhur', harfli: true, bilgi: 'muhur' },
       { c: 'ﷺ', ad: 'sav', uzun: 'sallallâhu aleyhi ve sellem', grup: 'muhur', harfli: true }]]
  ];

  /* sembol katmanı sekmeleri */
  var SEMBOL = [
    { id: 'nokta', ad: 'Noktalama', bolum: [
      { baslik: 'Arapça noktalama', bilgi: 'noktalama', tus: [
        ['،', 'virgül'], ['؛', 'noktalı virgül'], ['؟', 'soru'], ['.', 'nokta'], [':', 'iki nokta'], ['!', 'ünlem'], ['…', 'üç nokta']] },
      { baslik: 'Ayraç ve tırnak', tus: [
        ['«»', 'tırnak', null, 'cift'], ['()', 'parantez', null, 'cift'], ['[]', 'köşeli', null, 'cift'], ['{}', 'süslü', null, 'cift'],
        ['"', 'çift tırnak'], ["'", 'kesme'], ['-', 'kısa çizgi'], ['–', 'uzun çizgi'], ['/', 'eğik çizgi'], ['*', 'yıldız'], ['•', 'madde imi'], ['@', 'et']] }] },
    { id: 'rakam', ad: 'Rakamlar', kisa: 'Rakam', bolum: [
      { baslik: 'Arapça rakamlar', bilgi: 'rakam', tus: '٠١٢٣٤٥٦٧٨٩'.split('').map(function (c, i) { return [c, String(i)]; })
          .concat([['٫', 'ondalık'], ['٬', 'binlik']]) },
      { baslik: 'Latin rakamlar', tus: '0123456789'.split('').map(function (c) { return [c, '']; }) },
      { baslik: 'İşlem', tus: [['+', 'artı'], ['−', 'eksi'], ['×', 'çarpı'], ['÷', 'bölü'], ['=', 'eşit'], ['٪', 'yüzde (Arapça)'], ['%', 'yüzde']] }] },
    { id: 'muhur', ad: 'Mühür · İfade', kisa: 'Mühür', bolum: [
      { baslik: 'Tek karakterlik mühürler', bilgi: 'muhur', tus: [
        ['\uFDF2', 'Allah', 'muhur', 'muhur'], ['\uFDFB', 'cc · celle celâlühû', 'muhur', 'muhur'],
        ['\uFDFA', 'sav · sallallâhu aleyhi ve sellem', 'muhur', 'muhur'], ['\uFDFD', 'Besmele', 'muhur', 'muhur'],
        ['\uFDF4', 'Muhammed', 'muhur', 'muhur']] },
      { baslik: 'Açık yazılışlar', bilgi: 'muhur', tus: [
        ['اللّٰهُ', 'Allah', null, 'ifade'], ['جَلَّ جَلَالُهُ', 'cc · celle celâlühû', null, 'ifade'],
        ['صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ', 'sav', null, 'ifade'], ['بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ', 'Besmele', null, 'ifade'],
        ['عَلَيْهِ السَّلَامُ', 'as · aleyhisselâm', null, 'ifade'], ['رَضِيَ اللّٰهُ عَنْهُ', 'ra · radıyallâhu anh', null, 'ifade'],
        ['رَضِيَ اللّٰهُ عَنْهَا', 'radıyallâhu anhâ', null, 'ifade'], ['رَضِيَ اللّٰهُ عَنْهُمْ', 'radıyallâhu anhüm', null, 'ifade'],
        ['رَحِمَهُ اللّٰهُ', 'rh · rahimehullâh', null, 'ifade'], ['سُبْحَانَهُ وَتَعَالَى', 'st · sübhânehû ve teâlâ', null, 'ifade'],
        ['عَزَّ وَجَلَّ', 'azze ve celle', null, 'ifade'], ['تَبَارَكَ وَتَعَالَى', 'tebâreke ve teâlâ', null, 'ifade']] },
      { baslik: 'Günlük dinî ifadeler', tus: [
        ['السَّلَامُ عَلَيْكُمْ', 'selâmün aleyküm', null, 'ifade'], ['وَعَلَيْكُمُ السَّلَامُ', 've aleykümüsselâm', null, 'ifade'],
        ['إِنْ شَاءَ اللّٰهُ', 'inşâallah', null, 'ifade'], ['مَا شَاءَ اللّٰهُ', 'mâşâallah', null, 'ifade'],
        ['الْحَمْدُ لِلّٰهِ', 'elhamdülillâh', null, 'ifade'], ['سُبْحَانَ اللّٰهِ', 'sübhânallah', null, 'ifade'],
        ['اللّٰهُ أَكْبَرُ', 'Allâhu ekber', null, 'ifade'], ['جَزَاكَ اللّٰهُ خَيْرًا', 'cezâkallâhu hayran', null, 'ifade']] }] },
    { id: 'kuran', ad: 'Kur\u2019an', bolum: [
      { baslik: 'Âyet', bilgi: 'ayet', tus: [
        ['\uFD3F\uFD3E', 'âyet ayracı', 'ayet', 'cift'], ['\u06DD', 'âyet sonu', 'ayet'], ['\u06DE', 'hizb', 'ayet'], ['\u06E9', 'secde', 'ayet']] },
      { baslik: 'Vakıf (durak) işaretleri', bilgi: 'vakif', tus: [
        ['\u06D8', 'lâzım (dur)', 'vakif', 'kucuk'], ['\u06D9', 'lâ (durma)', 'vakif', 'kucuk'], ['\u06DA', 'câiz', 'vakif', 'kucuk'],
        ['\u06D6', 'sılâ evlâ', 'vakif', 'kucuk'], ['\u06D7', 'kılâ evlâ', 'vakif', 'kucuk'], ['\u06DB', 'muânaka', 'vakif', 'kucuk'],
        ['\u06DC', 'sekte', 'vakif', 'kucuk']] },
      { baslik: 'Kur\u2019an imlâsı', bilgi: 'imla', tus: [
        ['\u0671', 'vasla elifi', 'vasla'], ['\u06E5', 'küçük vav', 'imla', 'kucuk'], ['\u06E6', 'küçük ye', 'imla', 'kucuk'], ['\u06E2', 'iklâb mimi', 'imla', 'kucuk'],
        ['\u06E1', 'Kur\u2019an cezmi', 'imla', 'kucuk'], ['\u06E8', 'küçük nun', 'imla', 'kucuk'], ['\u06ED', 'alt mim', 'imla', 'kucuk']] }] },
    { id: 'ozel', ad: 'Özel', bolum: [
      { baslik: 'Uzatma', bilgi: 'tatvil', tus: [['ـ', 'tatvil', 'tatvil'], ['ـــ', 'üçlü tatvil', 'tatvil']] },
      { baslik: 'Görünmez işaretler', bilgi: 'gorunmez', tus: [
        ['\u200C', 'bitiştirme', 'gorunmez', 'gorunmez', 'ZWNJ'], ['\u200D', 'bitiştir', 'gorunmez', 'gorunmez', 'ZWJ'],
        ['\u200F', 'sağdan-sola', 'gorunmez', 'gorunmez', 'RLM'], ['\u200E', 'soldan-sağa', 'gorunmez', 'gorunmez', 'LRM'],
        ['\u00A0', 'bölünmez boşluk', 'gorunmez', 'gorunmez', 'NBSP'], [D, 'taşıyıcı çember', 'gorunmez']] }] }
  ];

  /* hareke sayılan işaretler (akıllı değiştirme için) */
  var UNLU = '\u064B\u064C\u064D\u064E\u064F\u0650\u0652\u0670\u0656\u0657';   /* aynı yuvaya oturanlar */
  var ISARET = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/;
  var ISARETLER = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g;
  var HAREKE_TEMIZ = ISARETLER;

  /* ---------- kopyalama hedefleri ("not kodları") ---------- */
  var HEDEF = {
    word:   { ad: 'Word', renk: '#2B579A', harf: 'W', font: 'Sakkal Majalla', pt: 20,
              not: 'Windows ve Mac Word. Arapça kısım <b>Sakkal Majalla 20 pt</b> gelir. Word Arapçayı “karmaşık betik” yazı tipiyle gösterir; bunun için <code>mso-bidi-font-family</code> kodu eklenir.' },
    ppt:    { ad: 'PowerPoint', renk: '#C43E1C', harf: 'P', font: 'Sakkal Majalla', pt: 36,
              not: 'Sunum için büyük: <b>Sakkal Majalla 36 pt</b>, sağa hizalı.' },
    gdocs:  { ad: 'Google Dokümanlar', renk: '#1A73E8', harf: 'G', font: 'Amiri', pt: 20,
              not: 'Dokümanlar’ın yazı tipi listesindeki <b>Amiri 20 pt</b> ile yapışır; paragraf sağdan sola ayarlanır.' },
    pages:  { ad: 'Pages · Keynote · TextEdit', renk: '#F7A600', harf: '', font: 'Geeza Pro', pt: 22,
              not: 'Mac’in Arapça yazı tipi <b>Geeza Pro 22 pt</b>. TextEdit’te Biçim › “Zengin Metin” açık olmalı.' },
    libre:  { ad: 'LibreOffice', renk: '#18A303', harf: 'L', font: 'Amiri', pt: 20,
              not: 'LibreOffice ile birlikte kurulan <b>Amiri 20 pt</b>.' },
    duz:    { ad: 'Not Defteri · TXT', renk: '#475569', harf: 'T', duz: true, rlm: true,
              not: 'Düz metin yazı tipi taşımaz. Noktalama doğru yerde dursun diye satır başı ve sonuna görünmez yön işareti (RLM) eklenir. Not Defteri’nde Biçim › Yazı Tipi › <b>Sakkal Majalla</b>; sağ tık › “Sağdan sola okuma sırası”.' },
    mesaj:  { ad: 'WhatsApp · Telegram · E-posta', renk: '#25D366', harf: '', duz: true,
              not: 'Düz metin; uygulama kendi yazı tipini kullanır, harekeler korunur. Görünüşü aynen korumak için “Kaydet › Resim (.png)”.' }
  };
  var HEDEF_SIRA = ['word', 'gdocs', 'ppt', 'pages', 'libre', 'duz', 'mesaj'];

  var ayar = { hedef: 'word', boy: 0, harekesiz: false, cihaz: false, yt: 'arakom' };
  /* Arakom'da boş ya da yanlış çizilen işaretler → bunlar yazılınca yazı tipi Amiri'ye geçer */
  var AMIRI_GEREK = /[\u0656\u0657\u06D6-\u06DC\u06DD]/;
  var AMIRI_TUS = /[\u0656\u0657\u06D6-\u06DC\u06E1\u06E2\u06E8\u06ED]/;
  var VAKIF = /[\u06D6-\u06DC]/;
  var gecmis = [], ileri = [];

  /* =====================================================================
     2) YARDIMCILAR
     ===================================================================== */
  function kac(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function isaretMi(c) { return !!c && ISARET.test(c); }
  /* tuş yüzü: hareke HARFSİZ — ◌ çember + yazı tipinden alınmış işaret yolu (IS_YOL).
     Yazı tipine bırakılmaz: Arakom ◌ üstüne işareti kaydırarak koyuyor, bazılarını hiç çizmiyor. */
  function gosterge(c) {
    var y = c && IS_YOL[c];
    if (!y) return kac(c);
    return '<svg class="isr" viewBox="' + IS_KUTU[y[0]] + '" aria-hidden="true" focusable="false">' +
      '<circle class="isr-c" r="' + IS_R + '"/><path class="isr-y" d="' + y[1] + '"/></svg>';
  }
  function ytUygula() {
    document.body.classList.toggle('yt-amiri', ayar.yt === 'amiri');
    $$('.yazi-tipi [data-yt]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-yt') === ayar.yt)); });
  }
  function ytGerekirse(eklenen) {
    if (ayar.yt === 'amiri' || !AMIRI_GEREK.test(eklenen)) return;
    ayar.yt = 'amiri'; ytUygula(); kaydet();
    bildir('Bu işaret Arakom yazı tipinde görünmüyor — yazı tipi Amiri yapıldı.');
  }
  function titret() { try { if (navigator.vibrate) navigator.vibrate(7); } catch (e) {} }
  function kaydet() {
    try { localStorage.setItem(DEPO, JSON.stringify({ metin: ta.value, ayar: ayar })); } catch (e) {}
  }
  function geriYukle() {
    try {
      var d = JSON.parse(localStorage.getItem(DEPO) || 'null');
      if (!d) return;
      if (typeof d.metin === 'string') ta.value = d.metin;
      if (d.ayar) Object.keys(ayar).forEach(function (k) { if (k in d.ayar) ayar[k] = d.ayar[k]; });
      if (!HEDEF[ayar.hedef]) ayar.hedef = 'word';
    } catch (e) {}
  }
  var bildirimZaman = null;
  function bildir(m, hata) {
    var b = $('#bildirim');
    b.textContent = m; b.className = 'bildirim' + (hata ? ' hata' : ''); b.hidden = false;
    clearTimeout(bildirimZaman);
    bildirimZaman = setTimeout(function () { b.hidden = true; }, 2600);
  }

  /* ---------- geçmiş (geri al / yinele) ---------- */
  function anlik() { return { v: ta.value, s: ta.selectionStart, e: ta.selectionEnd }; }
  function gecmisEkle() {
    var a = anlik(), son = gecmis[gecmis.length - 1];
    if (son && son.v === a.v) return;
    gecmis.push(a); if (gecmis.length > 300) gecmis.shift();
    ileri = [];
  }
  function uygula(a) { ta.value = a.v; ta.setSelectionRange(a.s, a.e); sonra(); }
  function geriAl() {
    if (!gecmis.length) return;
    ileri.push(anlik()); uygula(gecmis.pop());
  }
  function yinele() {
    if (!ileri.length) return;
    gecmis.push(anlik()); uygula(ileri.pop());
  }

  /* ---------- metne yazma ---------- */
  function odak() {
    try { ta.focus({ preventScroll: true }); } catch (e) { ta.focus(); }
  }
  /* İmleç hep görünsün: ekran klavyesiyle yazınca tarayıcı yazı alanını kendiliğinden
     kaydırmaz. İmlecin satırı gizli bir «ayna» kutuda ölçülür, alan o satıra kaydırılır. */
  var ayna = null;
  function imleciGoster() {
    if (!ta || ta.scrollHeight <= ta.clientHeight + 1) return;
    var s = ta.selectionEnd, v = ta.value;
    if (s >= v.length) { ta.scrollTop = ta.scrollHeight; return; }
    var cs = getComputedStyle(ta);
    if (!ayna) { ayna = document.createElement('div'); ayna.setAttribute('aria-hidden', 'true'); document.body.appendChild(ayna); }
    ayna.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:pre-wrap;overflow-wrap:break-word;' +
      'word-wrap:break-word;box-sizing:border-box;border:0;overflow:hidden;height:auto;width:' + ta.clientWidth + 'px';
    ['font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'word-spacing', 'direction',
     'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'tab-size'].forEach(function (k) {
      ayna.style.setProperty(k, cs.getPropertyValue(k), 'important');     /* arakom.css'in !important kuralını geçsin */
    });
    ayna.textContent = v.slice(0, s);
    var im = document.createElement('span'); im.textContent = v.slice(s, s + 1) || '.'; ayna.appendChild(im);
    var y = im.offsetTop, sat = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.9, pt = parseFloat(cs.paddingTop) || 0;
    if (y - pt < ta.scrollTop) ta.scrollTop = Math.max(0, y - pt);
    else if (y + sat + pt > ta.scrollTop + ta.clientHeight) ta.scrollTop = y + sat + pt - ta.clientHeight;
  }
  function sonra() {
    kaydet(); sayacYaz(); imleciGoster();
    $('#geriAl').disabled = !gecmis.length; $('#yinele').disabled = !ileri.length;
  }
  function yaz(metin, secimArasi) {
    var s = ta.selectionStart, e = ta.selectionEnd;
    gecmisEkle();
    if (secimArasi != null) {            /* çift ayraç: seçili metni sarar, imleç araya */
      var ic = ta.value.slice(s, e);
      ta.setRangeText(metin.slice(0, secimArasi) + ic + metin.slice(secimArasi), s, e, 'end');
      var yer = s + secimArasi + ic.length;
      ta.setSelectionRange(yer, yer);
    } else {
      ta.setRangeText(metin, s, e, 'end');
    }
    odak(); sonra(); ytGerekirse(metin);
  }
  /* Harekeyi harften sonraki işaret dizisine akıllıca yerleştirir:
     · aynı yuvadaki (üstün/esre/ötre/cezm/tenvin/çeker) eski hareke yenisiyle değişir
     · şedde iki kez eklenmez; şedde + hareke birlikte durur
     · aynı hareke yeniden basılırsa hiçbir şey olmaz (çift hareke oluşmaz) */
  function harekeYaz(m) {
    var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
    if (s !== e) { yaz(m); return; }
    var bas = s;
    while (bas > 0 && isaretMi(v.charAt(bas - 1))) bas--;
    var dizi = v.slice(bas, s);
    var yeniUnlu = m.split('').some(function (c) { return UNLU.indexOf(c) >= 0; });
    var yeniSedde = m.indexOf('\u0651') >= 0;
    var kalan = dizi.split('').filter(function (c) {
      if (yeniUnlu && UNLU.indexOf(c) >= 0) return false;
      if (yeniSedde && c === '\u0651') return false;
      if (m.indexOf(c) >= 0) return false;
      return true;
    }).join('');
    var sonuc = kalan + m;
    /* şedde önde dursun (yazı tiplerinde en tutarlı görünüm) */
    if (sonuc.indexOf('\u0651') > 0) sonuc = '\u0651' + sonuc.replace('\u0651', '');
    if (sonuc === dizi) { odak(); return; }
    gecmisEkle();
    ta.setRangeText(sonuc, bas, s, 'end');
    odak(); sonra(); ytGerekirse(m);
  }
  function sil(ileriDogru) {
    var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
    if (s !== e) { gecmisEkle(); ta.setRangeText('', s, e, 'end'); odak(); sonra(); return; }
    if (ileriDogru ? s >= v.length : s <= 0) return;
    gecmisEkle();
    /* tek kod noktası siler: önce hareke, sonra harf (Arapça klavye alışkanlığı) */
    var adim = 1, c = ileriDogru ? v.charCodeAt(s) : v.charCodeAt(s - 1);
    if (!ileriDogru && c >= 0xDC00 && c <= 0xDFFF) adim = 2;
    if (ileriDogru) ta.setRangeText('', s, s + adim, 'end'); else ta.setRangeText('', s - adim, s, 'end');
    odak(); sonra();
  }
  /* imleci harf + harekeleriyle birlikte (küme küme) taşır */
  function imlec(geri) {
    var v = ta.value, s = geri ? ta.selectionStart : ta.selectionEnd;
    if (geri) { if (s > 0) { s--; while (s > 0 && isaretMi(v.charAt(s))) s--; } }
    else { if (s < v.length) { s++; while (s < v.length && isaretMi(v.charAt(s))) s++; } }
    ta.setSelectionRange(s, s); odak(); imleciGoster();
  }

  function sayacYaz() {
    var v = ta.value;
    var harf = (v.match(/[\u0621-\u063F\u0641-\u064A\u0671-\u06D3\uFB50-\uFDFF\uFE70-\uFEFC]/g) || []).length;
    var hareke = (v.match(ISARETLER) || []).length;
    var kelime = v.trim() ? v.trim().split(/\s+/).length : 0;
    $('#sayac').textContent = kelime + ' kelime · ' + harf + ' harf · ' + hareke + ' hareke';
  }

  /* =====================================================================
     3) TUŞ ÇİZİMİ
     ===================================================================== */
  function bilgiRozet(konu) {
    return konu ? '<span class="bilgi-dug" role="button" tabindex="0" data-bilgi="' + konu + '" aria-label="Bilgi"></span>' : '';
  }
  function harfSatirlari() {
    return DIZILIM.map(function (satir) {
      return '<div class="kb-row">' + satir.map(function (c) {
        if (c === 'SIL') return '<button type="button" class="tus sil" data-is="sil" aria-label="Sil">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 5H9l-6 7 6 7h12z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/></svg></button>';
        var bg = RENK[c] ? ' style="--key-bg:' + RENK[c] + '"' : '';
        return '<button type="button" class="tus" data-c="' + c + '"' + bg + '>' + (c === 'ه' ? 'هـ' : c) +
          (UZUN[c] ? '<span class="uzun-ip" aria-hidden="true"></span>' : '') + '</button>';
      }).join('') + '</div>';
    }).join('');
  }
  /* alt sıra iki katmanda ortak; sembol katmanında sil tuşu da çıkar */
  function altSatir() {
    return '<div class="kb-row kb-alt">' +
      '<button type="button" class="tus katman" data-is="katman" aria-label="Semboller ve noktalama">؟ ١٢ ﷺ</button>' +
      '<button type="button" class="tus" data-c="ـ" style="--key-bg:#FFF4E5" aria-label="Tatvil (uzatma çizgisi)">ـــ' +
        '<span class="alt-ad">tatvil</span>' + bilgiRozet('tatvil') + '</button>' +
      '<button type="button" class="tus" data-c="،" aria-label="Arapça virgül">،</button>' +
      '<button type="button" class="tus bosluk" data-c=" " aria-label="Boşluk"></button>' +
      '<button type="button" class="tus" data-c="." aria-label="Nokta">.</button>' +
      '<button type="button" class="tus" data-c="؟" aria-label="Soru işareti">؟</button>' +
      '<button type="button" class="tus sil sem-sil" data-is="sil" aria-label="Sil" hidden>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 5H9l-6 7 6 7h12z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/></svg></button>' +
      '<button type="button" class="tus enter" data-c="\n" aria-label="Yeni satır">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 5v7a3 3 0 0 1-3 3H5"/><path d="M9 11l-4 4 4 4"/></svg></button>' +
    '</div>';
  }

  /* ---------- sembol katmanı: başlık solda, tuşlar yanında ---------- */
  function semTus(x, bolumBilgi) {
    var c = x[0], ad = x[1], bilgi = x[2], tur = x[3], kisa = x[4];
    var cift = tur === 'cift', isr = c.length === 1 && !!IS_YOL[c];
    var gor = tur === 'gorunmez' ? (kisa || '') : (cift ? c.charAt(0) + ' ' + c.charAt(1) : c);
    if (c === '﴿﴾') gor = '﴿ ﴾';
    var gl = 'gl' + (/[\u06dd\u06e9\ufdfd]/.test(c) ? ' amiri' : '') + (c === '\ufdfd' ? ' bes' : '');
    var sinif = 'sem' + (tur === 'muhur' ? ' muhur' : '') + (tur === 'ifade' || c === '﷽' ? ' ifade' : '') +
      (tur === 'gorunmez' ? ' gorunmez' : '') + (isr ? ' isaretli' : '');
    /* bölüm başlığında ⓘ varsa aynı konu için her tuşa ayrıca rozet konmaz (kalabalık olmasın) */
    var rozet = bilgi && bilgi !== bolumBilgi && tur !== 'ifade' && tur !== 'cift' ? bilgiRozet(bilgi) : '';
    return '<button type="button" class="' + sinif + '" data-c="' + kac(c) + '"' + (cift ? ' data-cift="1"' : '') +
      (ad ? ' title="' + kac(ad) + '"' : '') + '>' +
      '<span class="' + gl + '" dir="rtl">' + (isr ? gosterge(c) : kac(gor)) + '</span>' +
      (ad ? '<span class="ad">' + kac(ad) + '</span>' : '') + rozet + '</button>';
  }
  function semSayfa(t) {
    return '<div class="sem-sayfa" data-sekme="' + t.id + '" role="tabpanel" aria-label="' + kac(t.ad) + '">' +
      t.bolum.map(function (b) {
        return '<div class="sem-bolum"><div class="sem-baslik"><span>' + kac(b.baslik) + '</span>' + bilgiRozet(b.bilgi) + '</div>' +
          '<div class="sem-tuslar">' + b.tus.map(function (x) { return semTus(x, b.bilgi); }).join('') +
          (b.bilgi === 'ayet' ? '<div class="ayet-sat"><span>Âyet numarası:</span><input type="number" id="ayetNo" min="1" max="286" value="1" aria-label="Âyet numarası">' +
            '<button type="button" id="ayetEkle">﴿…﴾ ۝ ekle</button></div>' : '') + '</div></div>';
      }).join('') + '</div>';
  }

  /* ---------- klavye: harfler + sembol sayfaları tek bir kayan bantta ----------
     Sekmeler yazı alanının altında HEP açık: Harfler · Noktalama · Rakamlar · Mühür · Kur'an · Özel.
     Klavyenin yüksekliği hep harf sayfası kadar kalır (yazı alanı zıplamaz); uzun sembol
     sayfaları kendi içinde kayar, boşluk tuşlu alt sıra hep yerinde durur. */
  var SEKMELER = [{ id: 'harf', ad: 'Harfler', kisa: 'Harf' }].concat(SEMBOL);
  var katman = 'harf';                     /* açık sekmenin id'si */
  var sonSekme = SEMBOL[0].id;             /* ؟١٢ tuşu en son açılan sembol sekmesine döner */
  function klavyeKur() {
    $('#klGovde').innerHTML =
      '<div class="kl-pencere" id="semPencere"><div class="sem-bant" id="semBant">' +
        '<div class="sem-sayfa harf-sayfa" data-sekme="harf" role="tabpanel" aria-label="Harfler">' + harfSatirlari() + '</div>' +
        SEMBOL.map(semSayfa).join('') + '</div></div>' + altSatir();
    var sek = $('#klSekmeler');
    sek.setAttribute('role', 'tablist');
    sek.style.setProperty('--n', SEKMELER.length);
    sek.innerHTML = '<span class="sekme-isik" aria-hidden="true"></span>' + SEKMELER.map(function (t) {
      return '<button type="button" class="kl-sekme" role="tab" data-sekme="' + t.id + '" aria-selected="false">' +
        (t.kisa ? '<span class="sk-uzun">' + kac(t.ad) + '</span><span class="sk-kisa">' + kac(t.kisa) + '</span>' : kac(t.ad)) + '</button>';
    }).join('');
  }
  function katmanGoster() { sekmeGit(katman, false); }
  /* kaliplartablosu'ndaki mücerred/mezid sekmesi gibi: kırmızı vurgu (= açık olan) kayar,
     içerik yana kayarak değişir. Geçiş yalnız gerçek sekme değişiminde açılır; ilk açılışta
     ve pencere boyu değişince bant kaymaz. */
  function sekmeGit(id, kay) {
    var i = 0;
    SEKMELER.forEach(function (t, j) { if (t.id === id) i = j; });
    katman = SEKMELER[i].id;
    if (katman !== 'harf') sonSekme = katman;
    var sek = $('#klSekmeler'), bant = $('#semBant');
    [sek, bant].forEach(function (el) { el.classList.toggle('kayar', !!kay); });
    sek.style.setProperty('--i', i);
    $$('.kl-sekme', sek).forEach(function (b, j) { b.setAttribute('aria-selected', String(j === i)); });
    bant.style.transform = 'translateX(' + (-100 * i) + '%)';
    $$('.sem-sayfa', bant).forEach(function (sy, j) {
      var acik = j === i;
      sy.classList.toggle('acik', acik);
      if ('inert' in sy) sy.inert = !acik; else sy.setAttribute('aria-hidden', String(!acik));
      if (acik && kay) sy.scrollTop = 0;
    });
    var sem = katman !== 'harf', k = $('#klGovde .tus.katman');
    $('#klavye').classList.toggle('sem-acik', sem);
    $('#klGovde .sem-sil').hidden = !sem;
    k.classList.toggle('acik', sem);
    k.textContent = sem ? 'ا ب ت' : '؟ ١٢ ﷺ';
    k.setAttribute('aria-label', sem ? 'Harflere dön' : 'Semboller ve noktalama');
    pencereBoy();
  }
  /* pencere = harf sayfasının doğal yüksekliği; sembol sayfaları bu yüksekliğe sığmazsa içinde kayar */
  function pencereBoy() {
    var pen = $('#semPencere'), hs = $('#semBant .harf-sayfa');
    if (!pen || !hs) return;
    pen.style.removeProperty('--pen-h');
    var h = hs.scrollHeight;
    pen.style.setProperty('--pen-h', h + 'px');
    $$('#semBant .sem-sayfa').forEach(function (sy) {
      sy.classList.toggle('tasiyor', sy.scrollHeight > h + 2);
    });
  }

  /* ---------- hareke alanı (klavyenin üstünde, iki satır) ---------- */
  function panelCiz() {
    $('#panel').innerHTML = HAREKE.map(function (blok, bi) {
      return '<div class="hr-blok ' + (bi ? 'sol' : 'sag') + '">' + blok.map(function (satir) {
        return satir.map(function (t) {
          return '<button type="button" class="hk ' + t.grup + '" data-h="' + kac(t.c) + '"' + (t.harfli ? ' data-harf="1"' : '') +
            ' title="' + kac(t.uzun || t.ad) + '">' +
            '<span class="gl" dir="rtl">' + (t.harfli ? kac(t.c) : gosterge(t.c)) + '</span>' +
            '<span class="ad">' + kac(t.ad) + '</span>' + (t.bilgi ? bilgiRozet(t.bilgi) : '') + '</button>';
        }).join('');
      }).join('') + '</div>';
    }).join('');
  }

  /* =====================================================================
     4) BASMA — işaretçi olayları (dokunma + fare aynı yoldan)
     ===================================================================== */
  var basili = null, uzunZaman = null, uzunAcik = false, yapiskan = false, tekrarZaman = null, tekrarAralik = null;
  var sonIsaretci = 0;                     /* dokunuşun ardından gelen click (detail=0 olabilir) yok sayılır */

  function tusBul(el) { return el && el.closest ? el.closest('.tus, .hk, .sem') : null; }

  function bas(tus) {
    if (tus.classList.contains('hk')) {
      var h = tus.getAttribute('data-h');
      if (tus.getAttribute('data-harf')) yaz(h); else harekeYaz(h);
      return;
    }
    var is = tus.getAttribute('data-is');
    if (is === 'katman') { sekmeGit(katman === 'harf' ? sonSekme : 'harf', true); return; }
    if (is === 'sil') return;                       /* sil basınca (pointerdown) çalışır */
    var c = tus.getAttribute('data-c');
    if (c == null) return;
    if (tus.getAttribute('data-cift')) { yaz(c, 1); return; }
    if (tus.classList.contains('sem') && c.length === 1 && ISARET.test(c)) { harekeYaz(c); return; }
    yaz(c);
  }

  function uzunMenuAc(tus) {
    var c = tus.getAttribute('data-c'), liste = UZUN[c];
    if (!liste) return;
    var m = $('#uzunMenu');
    m.innerHTML = [c].concat(liste).map(function (v, i) {
      return '<button type="button" class="uz-tus' + (i === 0 ? ' secili' : '') + '" data-v="' + v + '">' + v + '</button>';
    }).join('');
    m.hidden = false;
    var r = tus.getBoundingClientRect(), w = m.offsetWidth, h = m.offsetHeight;
    var x = Math.max(6, Math.min(window.innerWidth - w - 6, r.left + r.width / 2 - w / 2));
    var y = Math.max(6, r.top - h - 8);
    m.style.left = x + 'px'; m.style.top = y + 'px';
    uzunAcik = true; titret();
  }
  function uzunMenuKapat() { $('#uzunMenu').hidden = true; uzunAcik = false; yapiskan = false; }
  function uzunSecili(x, y) {
    var el = document.elementFromPoint(x, y);
    var b = el && el.closest ? el.closest('.uz-tus') : null;
    $$('.uz-tus').forEach(function (u) { u.classList.toggle('secili', u === b); });
    return b;
  }

  function temizlikZaman() {
    clearTimeout(uzunZaman); clearTimeout(tekrarZaman); clearInterval(tekrarAralik);
    uzunZaman = tekrarZaman = tekrarAralik = null;
  }

  document.addEventListener('pointerdown', function (e) {
    if (uzunAcik && yapiskan) {                       /* açık kalan harf menüsünden seçim */
      var u = e.target.closest('.uz-tus');
      e.preventDefault(); uzunMenuKapat();
      if (u) { yaz(u.getAttribute('data-v')); titret(); return; }
    }
    if (e.target.closest('.bilgi-dug')) { e.preventDefault(); return; }
    var tus = tusBul(e.target);
    if (!tus || !tus.closest('#ak')) return;
    e.preventDefault();                               /* odak metin kutusunda kalsın */
    basili = tus; tus.classList.add('basili');
    try { tus.setPointerCapture(e.pointerId); } catch (x) {}
    if (tus.getAttribute('data-is') === 'sil') {        /* sil: basınca sil, basılı tutunca tekrarla */
      sil(false); titret();
      tekrarZaman = setTimeout(function () { tekrarAralik = setInterval(function () { sil(false); }, 65); }, 420);
      return;
    }
    if (UZUN[tus.getAttribute('data-c')]) {
      uzunZaman = setTimeout(function () { uzunMenuAc(tus); }, 380);
    }
  });
  document.addEventListener('pointermove', function (e) {
    if (uzunAcik && !yapiskan && basili) uzunSecili(e.clientX, e.clientY);
  });
  document.addEventListener('pointerup', function (e) {
    var tus = basili; basili = null;
    if (tus) sonIsaretci = Date.now();
    temizlikZaman();
    if (!tus) return;
    tus.classList.remove('basili');
    if (uzunAcik) {
      var b = uzunSecili(e.clientX, e.clientY);
      if (b) { uzunMenuKapat(); yaz(b.getAttribute('data-v')); titret(); }
      else { yapiskan = true; $$('.uz-tus').forEach(function (u) { u.classList.remove('secili'); }); }
      return;
    }
    if (tus.getAttribute('data-is') === 'sil') return;
    /* parmak tuşun dışında bırakıldıysa vazgeçilmiş say */
    var r = tus.getBoundingClientRect();
    if (e.clientX < r.left - 8 || e.clientX > r.right + 8 || e.clientY < r.top - 8 || e.clientY > r.bottom + 8) return;
    bas(tus); titret();
  });
  document.addEventListener('pointercancel', function () {
    temizlikZaman(); if (basili) basili.classList.remove('basili'); basili = null; uzunMenuKapat();
  });
  /* klavyeyle (Tab + Enter/Boşluk) etkinleştirme: click olayı, detail = 0 */
  document.addEventListener('click', function (e) {
    var rozet = e.target.closest('.bilgi-dug, .bilgi-bag');
    if (rozet) { e.preventDefault(); e.stopPropagation(); bilgiAc(rozet.getAttribute('data-bilgi')); return; }
    var sek = e.target.closest('.kl-sekme');
    if (sek) { sekmeGit(sek.getAttribute('data-sekme'), true); return; }
    if (e.target.closest('#ayetEkle')) { ayetEkle(); return; }
    var tus = tusBul(e.target);
    if (tus && e.detail === 0 && tus.closest('#ak') && Date.now() - sonIsaretci > 700) {
      if (tus.getAttribute('data-is') === 'sil') sil(false); else bas(tus);
    }
  });
  document.addEventListener('keydown', function (e) {
    var rozet = e.target.closest && e.target.closest('.bilgi-dug, .bilgi-bag');
    if (rozet && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); bilgiAc(rozet.getAttribute('data-bilgi')); return; }
    if (e.key === 'Escape') { bilgiKapat(); menuleriKapat(); }
    if ((e.ctrlKey || e.metaKey) && !e.altKey && e.target === ta) {
      var k = e.key.toLowerCase();
      if (k === 'z' && !e.shiftKey) { e.preventDefault(); geriAl(); }
      else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); yinele(); }
    }
  });

  function ayetEkle() {
    var n = Math.max(1, Math.min(999, parseInt(($('#ayetNo') || {}).value, 10) || 1));
    var ar = String(n).replace(/[0-9]/g, function (d) { return '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669'.charAt(+d); });
    /* ﴿ âyet ﴾ ۝n — imleç ayraçların arasına */
    yaz('\uFD3F\uFD3E \u06DD' + ar, 1);
  }

  /* fiziksel klavyeyle yazılanlar da geçmişe girsin */
  var sonDeger = '';
  ta.addEventListener('beforeinput', function () { gecmisEkle(); });
  ta.addEventListener('input', function () { sonra(); sonDeger = ta.value; });

  /* =====================================================================
     5) BİLGİ PENCERELERİ (animasyonlu SVG)
     ===================================================================== */
  function svg(ic, stil, boy) {
    return '<svg viewBox="0 0 440 ' + (boy || 206) + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<style>text{font-family:Arakom,Amiri,serif}.lbl{font-size:15px;fill:#6B7A8C;font-family:inherit}' + (stil || '') + '</style>' + ic + '</svg>';
  }
  /* bilgi animasyonlarında harfsiz işaret: (x, y) merkezli, h px yükseklikte ◌ + işaret */
  function isaretG(c, x, y, h, renk) {
    var yv = IS_YOL[c]; if (!yv) return '';
    var vb = IS_KUTU[yv[0]].split(' ').map(Number), k = h / vb[3];
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + k.toFixed(4) + ') translate(' + (-(vb[0] + vb[2] / 2)) + ' ' + (-(vb[1] + vb[3] / 2)) + ')">' +
      '<circle r="' + IS_R + '" fill="none" stroke="#B9C4CF" stroke-width="28" stroke-dasharray="0 58.9" stroke-linecap="round"/>' +
      '<path d="' + yv[1] + '" fill="' + renk + '"/></g>';
  }
  function T(x, y, s, t, ek) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + s + '" text-anchor="middle"' + (ek || '') + '>' + t + '</text>';
  }
  /* sırayla beliren kareler: n kare, her biri toplam/n saniye */
  function sira(ad, n, sure) {
    var p = 100 / n, css = '';
    for (var i = 0; i < n; i++) {
      css += '.' + ad + i + '{opacity:0;animation:' + ad + ' ' + sure + 's infinite;animation-delay:' + (i * sure / n).toFixed(2) + 's}';
    }
    css += '@keyframes ' + ad + '{0%{opacity:0;transform:translateY(10px)}' + (p * .12).toFixed(1) + '%{opacity:1;transform:none}' +
      (p * .86).toFixed(1) + '%{opacity:1;transform:none}' + (p * .98).toFixed(1) + '%,100%{opacity:0;transform:translateY(-6px)}}';
    return css;
  }

  /* Tatvil penceresi animasyonu (20 sn): ع tek → soluna tatvil: baştaki → iki yanına: ortadaki →
     yalnız sağına: sondaki; ardından كتاب → كـــتـــاب. Harfler Arakom glifleri, HarfBuzz ile dizildi;
     yazı tipi yüklenmese de aynı görünür. Üreten betik: tatvil_svg.py */
  var TATVIL_SVG = { ic: "<defs><path id=\"tvg-uni0627_fina\" d=\"M541 -41Q541 -21 524 -10Q506 0 483 0Q304 0 238 -84Q182 -155 182 -326Q182 -386 176 -478Q171 -569 160 -696Q160 -752 156 -810Q151 -868 143 -930Q132 -996 126 -1042Q120 -1088 115 -1114L213 -1227Q220 -1098 226 -998Q231 -899 231 -811Q231 -687 246 -555Q254 -481 260 -429Q265 -377 270 -348Q277 -302 290 -268Q302 -235 322 -215Q373 -160 500 -160Q518 -160 530 -151Q541 -142 541 -119V-41Z\"/><path id=\"tvg-uni0628\" d=\"M1452 -653Q1472 -622 1486 -592Q1500 -561 1511 -532Q1522 -503 1527 -473Q1532 -443 1532 -408Q1532 -382 1524 -349Q1516 -316 1497 -268Q1456 -168 1417 -147Q1354 -113 1274 -84Q1194 -55 1094 -31Q976 -2 856 12Q736 25 606 25Q467 25 367 4Q304 -8 256 -30Q207 -51 172 -80Q94 -149 94 -256Q94 -310 106 -358Q118 -406 141 -451Q182 -528 211 -528Q223 -528 223 -514Q223 -511 217 -502Q194 -471 184 -446Q174 -422 174 -393Q174 -283 311 -213Q377 -181 460 -164Q543 -147 643 -147Q731 -147 824 -156Q917 -166 1022 -184Q1109 -201 1184 -220Q1259 -239 1325 -262Q1458 -309 1458 -330Q1458 -343 1452 -362Q1446 -381 1436 -402Q1425 -424 1410 -448Q1396 -471 1380 -494L1452 -653ZM805 234Q817 220 830 198Q844 177 852 160L913 220Q933 235 950 247Q968 259 985 267Q960 296 938 330Q916 364 897 402L827 349Q809 335 790 324Q772 313 752 302Z\"/><path id=\"tvg-uni062A_medi\" d=\"M63 -649Q74 -666 82 -682Q89 -697 95 -712Q124 -686 155 -664Q186 -641 218 -624Q232 -640 242 -652Q253 -664 259 -675Q278 -703 292 -735L372 -669Q383 -663 397 -656Q411 -649 429 -641L380 -577Q369 -560 360 -544Q350 -527 341 -510Q294 -559 224 -598Q213 -585 204 -571Q194 -557 183 -540Q177 -529 170 -515Q163 -501 155 -481Q142 -493 124 -510Q106 -526 89 -538Q72 -552 54 -564Q36 -576 16 -587ZM-59 -115Q-59 -156 -16 -156Q42 -156 90 -167Q137 -178 174 -201L287 -299L322 -227Q352 -156 471 -156Q512 -156 512 -115V-41Q512 -21 496 -8Q486 -3 476 -2Q466 0 455 0Q429 0 404 -4Q380 -9 360 -20Q333 -37 305 -63L272 -106Q257 -125 250 -125Q225 -101 197 -78Q169 -55 138 -38Q107 -20 73 -9Q39 2 2 2Q-23 2 -40 -7Q-57 -16 -57 -39L-59 -115Z\"/><path id=\"tvg-uni0639\" d=\"M621 -684Q621 -674 588 -674Q458 -674 346 -612Q238 -553 238 -471Q238 -460 258 -444Q277 -427 319 -406Q404 -365 465 -365Q490 -365 510 -370Q531 -375 557 -387Q607 -411 813 -530Q818 -532 822 -534Q827 -535 834 -537Q848 -537 848 -524Q848 -514 840 -506L750 -377L598 -289Q513 -235 446 -179Q379 -123 328 -63Q182 109 182 289Q182 343 199 394Q216 445 248 496Q322 606 467 674Q628 750 862 750H944Q1006 748 1038 746Q1069 745 1071 745L1274 733Q1307 733 1307 741Q1307 760 1225 803Q1187 823 1138 840Q1089 857 1032 872Q905 909 803 909Q447 909 258 748Q92 603 92 379Q92 307 112 223Q132 139 174 45Q214 -43 260 -115Q305 -187 356 -244Q283 -256 231 -293Q168 -338 168 -403Q168 -520 248 -641Q333 -776 440 -776Q492 -776 543 -750Q563 -739 580 -728Q596 -716 610 -702Z\"/><path id=\"tvg-uni0640\" d=\"M-31 0V-152H238V0Z\"/><path id=\"tvg-uni0643_init\" d=\"M-59 -117Q-59 -158 -16 -158H190Q323 -158 416 -188Q530 -225 530 -268Q530 -304 436 -397Q325 -505 190 -563Q155 -578 134 -594Q112 -610 100 -630Q87 -650 82 -676Q78 -703 78 -741Q78 -814 92 -838Q106 -863 172 -903Q235 -941 310 -978Q384 -1016 471 -1051Q537 -1077 617 -1106Q697 -1134 791 -1165L707 -1001Q678 -993 633 -980Q588 -967 514 -938Q436 -912 373 -888Q310 -863 260 -842Q133 -786 133 -768Q133 -748 152 -732Q172 -717 225 -698Q356 -650 459 -549Q588 -420 588 -264Q588 -115 461 -47Q411 -21 344 -8Q276 4 188 4H0Q-25 4 -42 -5Q-59 -14 -59 -37V-117Z\"/><path id=\"tvg-uni1D25_1\" d=\"M-59 -117Q-59 -158 -16 -158Q56 -158 120 -167Q185 -176 227 -195Q190 -229 168 -264Q157 -284 151 -305Q145 -326 145 -348Q145 -394 195 -483Q219 -528 250 -566Q280 -603 317 -635Q409 -707 489 -707Q525 -707 558 -696Q591 -685 623 -664Q644 -648 666 -626Q688 -605 711 -578L715 -565Q715 -558 709 -555Q707 -553 704 -553Q701 -553 698 -553H692Q652 -567 615 -571Q578 -575 559 -575Q467 -575 367 -535Q268 -494 268 -457Q268 -416 346 -356Q425 -301 498 -301Q555 -301 715 -383L840 -449Q840 -437 840 -429Q840 -421 839 -413Q838 -405 836 -394Q834 -383 831 -365Q829 -348 826 -332Q822 -317 817 -301Q805 -290 760 -267Q716 -244 639 -207Q561 -170 501 -144Q441 -117 397 -98Q349 -77 297 -60Q245 -43 193 -30Q141 -18 92 -11Q42 -4 -2 -4Q-27 -4 -44 -13Q-61 -22 -61 -45L-59 -117Z\"/><path id=\"tvg-uni1D25_2\" d=\"M279 -416 402 -319Q401 -318 401 -318Q404 -316 417 -308Q428 -301 431 -300Q445 -310 449 -313L556 -416Q503 -455 415 -467Q329 -455 279 -416ZM-59 -117Q-59 -158 -16 -158Q38 -158 82 -162Q127 -166 164 -174Q256 -195 315 -248Q310 -261 296 -276Q283 -290 264 -303Q246 -316 224 -326Q202 -335 180 -338Q161 -338 158 -352Q158 -406 202 -486Q292 -567 417 -567Q469 -567 526 -546Q584 -525 612 -502Q641 -478 656 -446Q670 -415 670 -381Q670 -335 604 -283L547 -242Q572 -220 599 -204Q626 -189 658 -179Q690 -169 729 -164Q768 -160 817 -160Q840 -160 850 -152Q860 -144 860 -119V-45Q860 -24 842 -12Q827 -4 801 -4Q756 -4 725 -6Q694 -7 676 -12Q657 -17 636 -29Q615 -41 590 -61L494 -141Q444 -182 422 -182Q406 -182 354 -152Q331 -138 318 -130Q306 -122 301 -119Q299 -117 290 -111Q281 -105 264 -92Q227 -68 198 -51Q168 -34 140 -24Q111 -13 80 -8Q48 -4 8 -4Q-9 -4 -16 -5Q-23 -6 -31 -12Q-42 -17 -46 -26Q-51 -34 -51 -45Z\"/><path id=\"tvg-uni1D25_3\" d=\"M411 -377 546 -294Q566 -284 551 -290Q566 -281 584 -294L727 -376Q641 -435 560 -441Q482 -423 411 -377ZM1053 -41Q1053 -21 1033 -10Q1013 0 993 0Q894 0 828 -6Q763 -13 729 -27Q681 -44 638 -84Q596 -125 538 -186Q397 -115 291 23Q184 163 184 317Q184 382 198 438Q212 493 238 541Q269 596 319 639Q369 682 440 711Q602 778 866 778Q919 778 969 776Q1019 773 1067 768L1260 752Q1290 752 1290 764Q1290 783 1198 825Q1112 866 985 899Q916 918 858 927Q801 936 756 936Q594 936 471 900Q348 863 260 791Q94 651 94 416Q94 347 106 282Q118 217 141 154Q182 44 268 -63Q332 -147 453 -250Q415 -280 375 -294Q335 -307 293 -307Q317 -393 379 -458Q462 -537 568 -537Q615 -537 658 -519Q701 -501 730 -488Q758 -476 780 -442Q801 -408 801 -363Q801 -318 737 -279L651 -233Q719 -191 778 -176Q807 -168 866 -165Q926 -162 1014 -162Q1034 -162 1046 -153Q1057 -144 1057 -121Z\"/></defs><g transform=\"translate(0 108) scale(0.05469)\"><g class=\"tvf0\"><use href=\"#tvg-uni0639\" x=\"3613\" class=\"tv-h\"/></g><g class=\"tvf1\"><use href=\"#tvg-uni0640\" x=\"3206\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"3415\" class=\"tv-t\"/><use href=\"#tvg-uni1D25_1\" x=\"3624\" class=\"tv-h\"/></g><g class=\"tvf2\"><use href=\"#tvg-uni0640\" x=\"3206\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"3415\" class=\"tv-t\"/><use href=\"#tvg-uni1D25_2\" x=\"3624\" class=\"tv-h\"/><use href=\"#tvg-uni0640\" x=\"4421\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"4630\" class=\"tv-t\"/></g><g class=\"tvf3\"><use href=\"#tvg-uni1D25_3\" x=\"3428\" class=\"tv-h\"/><use href=\"#tvg-uni0640\" x=\"4421\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"4630\" class=\"tv-t\"/></g><g class=\"tvp1\"><use href=\"#tvg-uni0640\" x=\"3206\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"3415\" class=\"tv-t\"/></g><g class=\"tvp2\"><use href=\"#tvg-uni0640\" x=\"4421\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"4630\" class=\"tv-t\"/></g><g class=\"tvp3\"><use href=\"#tvg-uni0640\" x=\"3206\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"3415\" class=\"tv-t\"/></g></g><text class=\"tvy0 tv-yazi\" x=\"220\" y=\"184\" text-anchor=\"middle\"><tspan fill=\"#6B7A8C\">tek başına: </tspan><tspan fill=\"#16324F\" font-weight=\"700\">normal şekli</tspan></text><text class=\"tvy1 tv-yazi\" x=\"220\" y=\"184\" text-anchor=\"middle\"><tspan fill=\"#16A085\" font-weight=\"700\">soluna tatvil</tspan><tspan fill=\"#6B7A8C\"> → </tspan><tspan fill=\"#16324F\" font-weight=\"700\">baştaki şekil</tspan></text><text class=\"tvy2 tv-yazi\" x=\"220\" y=\"184\" text-anchor=\"middle\"><tspan fill=\"#16A085\" font-weight=\"700\">iki yanına tatvil</tspan><tspan fill=\"#6B7A8C\"> → </tspan><tspan fill=\"#16324F\" font-weight=\"700\">ortadaki şekil</tspan></text><text class=\"tvy3 tv-yazi\" x=\"220\" y=\"184\" text-anchor=\"middle\"><tspan fill=\"#16A085\" font-weight=\"700\">yalnız sağına tatvil</tspan><tspan fill=\"#6B7A8C\"> → </tspan><tspan fill=\"#16324F\" font-weight=\"700\">sondaki şekil</tspan></text><g class=\"tv-serit\"><rect class=\"tvs-f0\" x=\"337\" y=\"200\" width=\"70\" height=\"46\" rx=\"10\"/><g transform=\"translate(365.1 230) scale(0.01465)\"><use href=\"#tvg-uni0639\" x=\"0\" class=\"tv-h\"/></g><text x=\"372\" y=\"262\" text-anchor=\"middle\" class=\"tv-kucuk\">tek</text><rect class=\"tvs-f1\" x=\"257\" y=\"200\" width=\"70\" height=\"46\" rx=\"10\"/><g transform=\"translate(282.2 230) scale(0.01465)\"><use href=\"#tvg-uni0640\" x=\"0\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"209\" class=\"tv-t\"/><use href=\"#tvg-uni1D25_1\" x=\"418\" class=\"tv-h\"/></g><text x=\"292\" y=\"262\" text-anchor=\"middle\" class=\"tv-kucuk\">baş</text><rect class=\"tvs-f2\" x=\"169\" y=\"200\" width=\"70\" height=\"46\" rx=\"10\"/><g transform=\"translate(192.0 230) scale(0.01465)\"><use href=\"#tvg-uni0640\" x=\"0\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"209\" class=\"tv-t\"/><use href=\"#tvg-uni1D25_2\" x=\"418\" class=\"tv-h\"/><use href=\"#tvg-uni0640\" x=\"1215\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"1424\" class=\"tv-t\"/></g><text x=\"204\" y=\"262\" text-anchor=\"middle\" class=\"tv-kucuk\">orta</text><rect class=\"tvs-f3\" x=\"81\" y=\"200\" width=\"70\" height=\"46\" rx=\"10\"/><g transform=\"translate(105.7 230) scale(0.01465)\"><use href=\"#tvg-uni1D25_3\" x=\"0\" class=\"tv-h\"/><use href=\"#tvg-uni0640\" x=\"993\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"1202\" class=\"tv-t\"/></g><text x=\"116\" y=\"262\" text-anchor=\"middle\" class=\"tv-kucuk\">son</text></g><g class=\"tvk\" transform=\"translate(0 116) scale(0.05078)\"><g class=\"tvk0\"><use href=\"#tvg-uni0628\" x=\"2032\" class=\"tv-h\"/></g><g class=\"tvk1\"><use href=\"#tvg-uni0627_fina\" x=\"3646\" class=\"tv-h\"/></g><g class=\"tvk2\"><use href=\"#tvg-uni062A_medi\" x=\"4754\" class=\"tv-h\"/></g><g class=\"tvk3\"><use href=\"#tvg-uni0643_init\" x=\"5836\" class=\"tv-h\"/></g><g class=\"tvkt0\"><use href=\"#tvg-uni0640\" x=\"4127\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"4336\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"4545\" class=\"tv-t\"/></g><g class=\"tvkt1\"><use href=\"#tvg-uni0640\" x=\"5209\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"5418\" class=\"tv-t\"/><use href=\"#tvg-uni0640\" x=\"5627\" class=\"tv-t\"/></g></g><text class=\"tvky0 tv-yazi\" x=\"220\" y=\"184\" text-anchor=\"middle\"><tspan fill=\"#6B7A8C\">“kitâb” kelimesi</tspan></text><text class=\"tvky1 tv-yazi\" x=\"220\" y=\"204\" text-anchor=\"middle\"><tspan fill=\"#16A085\" font-weight=\"700\">kelime uzar</tspan><tspan fill=\"#6B7A8C\"> · harfler ve okunuş aynı kalır</tspan></text><g class=\"tvke\"><text x=\"144.2\" y=\"166\" text-anchor=\"middle\" class=\"tv-et\">tek</text><text x=\"197.4\" y=\"166\" text-anchor=\"middle\" class=\"tv-et\">son</text><text x=\"253.0\" y=\"166\" text-anchor=\"middle\" class=\"tv-et\">orta</text><text x=\"316.6\" y=\"166\" text-anchor=\"middle\" class=\"tv-et\">baş</text></g>",
    stil: ".tv-h{fill:#16324F}.tv-t{fill:#16A085}.tv-yazi{font-size:16.5px}.tv-kucuk{font-size:12.5px;font-weight:700;fill:#6B7A8C}.tv-et{font-size:13.5px;font-weight:700;fill:#16A085}.tv-serit rect{fill:none}.tvf0{opacity:0;animation:tvf0 20.0s linear infinite}@keyframes tvf0{0%,18.00%{opacity:1}18.60%,100%{opacity:0}}.tvf1{opacity:0;animation:tvf1 20.0s linear infinite}@keyframes tvf1{0%,17.40%{opacity:0}18.00%,37.00%{opacity:1}37.60%,100%{opacity:0}}.tvf2{opacity:0;animation:tvf2 20.0s linear infinite}@keyframes tvf2{0%,36.40%{opacity:0}37.00%,52.00%{opacity:1}52.60%,100%{opacity:0}}.tvf3{opacity:0;animation:tvf3 20.0s linear infinite}@keyframes tvf3{0%,51.40%{opacity:0}52.00%,69.00%{opacity:1}69.60%,100%{opacity:0}}.tvp1{opacity:0;animation:tvp1 20.0s cubic-bezier(.25,1,.5,1) infinite}@keyframes tvp1{0%,13.99%{opacity:0;transform:translateX(-900px)}14.00%{opacity:1;transform:translateX(-900px)}18.00%{opacity:1;transform:none}18.01%,100%{opacity:0;transform:none}}.tvp2{opacity:0;animation:tvp2 20.0s cubic-bezier(.25,1,.5,1) infinite}@keyframes tvp2{0%,32.99%{opacity:0;transform:translateX(900px)}33.00%{opacity:1;transform:translateX(900px)}37.00%{opacity:1;transform:none}37.01%,100%{opacity:0;transform:none}}.tvp3{opacity:0;animation:tvp3 20.0s cubic-bezier(.25,1,.5,1) infinite}@keyframes tvp3{0%,51.99%{opacity:0;transform:none}52.00%{opacity:1;transform:none}56.50%{opacity:0;transform:translateX(-900px)}56.51%,100%{opacity:0;transform:translateX(-900px)}}.tvy0{opacity:0;animation:tvy0 20.0s linear infinite}@keyframes tvy0{0%,13.00%{opacity:1}13.90%,100%{opacity:0}}.tvy1{opacity:0;animation:tvy1 20.0s linear infinite}@keyframes tvy1{0%,13.35%{opacity:0}14.25%,32.00%{opacity:1}32.90%,100%{opacity:0}}.tvy2{opacity:0;animation:tvy2 20.0s linear infinite}@keyframes tvy2{0%,32.35%{opacity:0}33.25%,51.00%{opacity:1}51.90%,100%{opacity:0}}.tvy3{opacity:0;animation:tvy3 20.0s linear infinite}@keyframes tvy3{0%,51.35%{opacity:0}52.25%,69.00%{opacity:1}69.90%,100%{opacity:0}}.tvs-f0{opacity:0;fill:#E8F6F2;stroke:#16A085;stroke-width:1.5;animation:tvs-f0 20.0s linear infinite}@keyframes tvs-f0{0%,18.00%{opacity:1}19.25%,100%{opacity:0}}.tvs-f1{opacity:0;fill:#E8F6F2;stroke:#16A085;stroke-width:1.5;animation:tvs-f1 20.0s linear infinite}@keyframes tvs-f1{0%,17.50%{opacity:0}18.75%,37.00%{opacity:1}38.25%,100%{opacity:0}}.tvs-f2{opacity:0;fill:#E8F6F2;stroke:#16A085;stroke-width:1.5;animation:tvs-f2 20.0s linear infinite}@keyframes tvs-f2{0%,36.50%{opacity:0}37.75%,52.00%{opacity:1}53.25%,100%{opacity:0}}.tvs-f3{opacity:0;fill:#E8F6F2;stroke:#16A085;stroke-width:1.5;animation:tvs-f3 20.0s linear infinite}@keyframes tvs-f3{0%,51.50%{opacity:0}52.75%,69.00%{opacity:1}70.25%,100%{opacity:0}}.tv-serit{opacity:0;animation:tv-serit 20.0s linear infinite}@keyframes tv-serit{0%,69.00%{opacity:1}70.75%,100%{opacity:0}}.tvk0{animation:tvk0 20.0s cubic-bezier(.25,1,.5,1) infinite}@keyframes tvk0{0%,76.00%{transform:translateX(627px)}82.00%,100%{transform:none}}.tvk1{animation:tvk1 20.0s cubic-bezier(.25,1,.5,1) infinite}@keyframes tvk1{0%,76.00%{transform:translateX(627px)}82.00%,100%{transform:none}}.tvk2{animation:tvk2 20.0s cubic-bezier(.25,1,.5,1) infinite}@keyframes tvk2{0%,76.00%{transform:translateX(0px)}82.00%,100%{transform:none}}.tvk3{animation:tvk3 20.0s cubic-bezier(.25,1,.5,1) infinite}@keyframes tvk3{0%,76.00%{transform:translateX(-627px)}82.00%,100%{transform:none}}.tvkt0{transform-box:fill-box;transform-origin:center;animation:tvkt0 20.0s cubic-bezier(.25,1,.5,1) infinite}@keyframes tvkt0{0%,76.00%{transform:translateX(314px) scaleX(0)}82.00%,100%{transform:none}}.tvkt1{transform-box:fill-box;transform-origin:center;animation:tvkt1 20.0s cubic-bezier(.25,1,.5,1) infinite}@keyframes tvkt1{0%,76.00%{transform:translateX(-314px) scaleX(0)}82.00%,100%{transform:none}}.tvk{opacity:0;animation:tvk 20.0s linear infinite}@keyframes tvk{0%,69.25%{opacity:0}71.00%,98.00%{opacity:1}99.75%,100%{opacity:0}}.tvky0{opacity:0;animation:tvky0 20.0s linear infinite}@keyframes tvky0{0%,70.60%{opacity:0}71.50%,76.50%{opacity:1}77.40%,100%{opacity:0}}.tvky1{opacity:0;animation:tvky1 20.0s linear infinite}@keyframes tvky1{0%,81.10%{opacity:0}82.00%,98.00%{opacity:1}98.90%,100%{opacity:0}}.tvke{opacity:0;animation:tvke 20.0s linear infinite}@keyframes tvke{0%,80.75%{opacity:0}82.50%,98.00%{opacity:1}99.75%,100%{opacity:0}}" };

  var BILGI = {
    tatvil: {
      baslik: 'Tatvil (uzatma çizgisi) ـ', oran: '440 / 270', durgun: 18,
      svg: function () { return svg(TATVIL_SVG.ic, TATVIL_SVG.stil, 270); },
      metin: '<p><b>Tatvil</b> (keşîde) harfleri birbirine bağlayan yatay çizgidir; <b>okunuşu yoktur</b>, yalnız görünüşü değiştirir.</p>' +
        '<p><b>1. Harfin şekillerini gösterir.</b> Harfin <b>soluna</b> eklenince baştaki, <b>iki yanına</b> eklenince ortadaki, ' +
        'yalnız <b>sağına</b> eklenince sondaki şekli görünür:</p>' +
        '<table class="tv-tablo" dir="rtl"><thead><tr><th>tek</th><th>başta</th><th>ortada</th><th>sonda</th></tr></thead><tbody>' +
        '<tr><td class="ar">ع</td><td class="ar">عـ</td><td class="ar">ـعـ</td><td class="ar">ـع</td></tr>' +
        '<tr><td class="ar">ه</td><td class="ar">هـ</td><td class="ar">ـهـ</td><td class="ar">ـه</td></tr>' +
        '<tr><td class="ar">ك</td><td class="ar">كـ</td><td class="ar">ـكـ</td><td class="ar">ـك</td></tr></tbody></table>' +
        '<p><b>2. Kelimeyi uzatır</b> (başlık, iki yana yaslama): <span class="ar">كتاب</span> → <span class="ar">كـــتـــاب</span>. ' +
        'Harfler ve okunuş aynı kalır: <span class="ar">كـ</span> baş, <span class="ar">ـتـ</span> orta, <span class="ar">ـا</span> son, <span class="ar">ب</span> tek.</p>' +
        '<p><b>3.</b> Hareke gösterirken taşıyıcı olur: <span class="ar">ــَ&nbsp; ــِ&nbsp; ــُ</span></p>' +
        '<p><b>Dikkat:</b> tatvilli kelime aramada ve sözlükte bulunmaz (<span class="ar">كـتـاب</span> ≠ <span class="ar">كتاب</span>). Gerekmiyorsa kullanma.</p>',
      ekle: [['ـ', 'tatvil']], kod: 'U+0640 ARABIC TATWEEL'
    },
    hareke: {
      baslik: 'Harekeler: üstün, esre, ötre, cezm',
      svg: function () {
        function k(i, harf, tam, ad, ses) {
          return '<g class="hr' + i + '">' + T(150, 138, 104, tam, ' fill="#EE5253"') + T(150, 138, 104, harf, ' fill="#16324F"') +
            T(318, 92, 26, ad, ' fill="#16324F" font-weight="700"') + T(318, 132, 22, ses, ' fill="#16A085"') + '</g>';
        }
        return svg(k(0, 'ب', 'بَ', 'üstün', '“be / ba”') + k(1, 'ب', 'بِ', 'esre', '“bi”') + k(2, 'ب', 'بُ', 'ötre', '“bu”') + k(3, 'ب', 'بْ', 'cezm', 'sessiz: “b”') +
          T(220, 190, 15, 'hareke harfin üstüne ya da altına gelir, sesli harfi verir', ' class="lbl"'), sira('hr', 4, 8));
      },
      metin: '<p>Arapçada kısa sesliler harfin üstüne ya da altına konan işaretlerle yazılır.</p>' +
        '<ul><li><b>Üstün</b> (fetha) <span class="ar">بَ</span> “e/a”, <b>esre</b> (kesra) <span class="ar">بِ</span> “i”, <b>ötre</b> (damme) <span class="ar">بُ</span> “u”.</li>' +
        '<li><b>Cezm</b> (sükûn) <span class="ar">بْ</span> harfin sessiz okunduğunu gösterir.</li></ul>' +
        '<p>Klavyede önce harfe, sonra harekeye bas. Yanlış harekeyi silmen gerekmez: yenisine basınca eskisi değişir.</p>',
      ekle: [['\u064E', 'üstün'], ['\u0650', 'esre'], ['\u064F', 'ötre'], ['\u0652', 'cezm']], hareke: true, kod: 'U+064E · U+0650 · U+064F · U+0652'
    },
    sedde: {
      baslik: 'Şedde — harfi iki kez okut',
      svg: function () {
        return svg('<g class="sd0">' + T(220, 110, 76, 'مَدْدَ', ' fill="#16324F"') + T(220, 160, 20, 'aynı harf iki kez: د + د', ' fill="#16A085"') + '</g>' +
          '<g class="sd1">' + T(220, 110, 76, 'مَدَّ', ' fill="#F39C12"') + T(220, 110, 76, 'مد', ' fill="#16324F"') +
          T(220, 160, 20, 'tek harf + şedde → “medde”', ' fill="#E67E22"') + '</g>' +
          T(220, 192, 15, 'şeddeli harf önce sessiz, sonra harekeli okunur', ' class="lbl"'), sira('sd', 2, 5));
      },
      metin: '<p><b>Şedde</b> bir harfin <b>iki kez</b> okunduğunu gösterir: ilki cezimli, ikincisi harekeli. <span class="ar">مَدْدَ</span> yerine <span class="ar">مَدَّ</span> yazılır.</p>' +
        '<p>Şedde her zaman bir harekeyle birlikte kullanılır: önce harfe, sonra <b>şedde</b>ye, sonra harekeye bas (sıra fark etmez). ' +
        'İkisi birlikte durur; yeni bir harekeye basarsan yalnız hareke değişir, şedde kalır.</p>',
      ekle: [['\u0651', 'şedde']], hareke: true, kod: 'U+0651 ARABIC SHADDA'
    },
    tenvin: {
      baslik: 'Tenvin — kelime sonunda “n” sesi',
      svg: function () {
        function k(i, tam, ses) {
          return '<g class="tn' + i + '">' + T(200, 118, 80, tam, ' fill="#16324F"') + T(362, 110, 26, ses, ' fill="#2563EB" font-weight="700"') +
            '<path class="tn-d" d="M312 74q16 30 0 60M300 84q10 20 0 40" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round"/></g>';
        }
        return svg(k(0, 'كِتَابٌ', '-un') + k(1, 'كِتَابًا', '-en') + k(2, 'كِتَابٍ', '-in') +
          T(220, 188, 15, 'belirsiz isimlerin sonuna gelir: “bir kitap”', ' class="lbl"'),
          sira('tn', 3, 6.6) + '.tn-d{animation:tnD .9s ease-in-out infinite}@keyframes tnD{0%,100%{opacity:.25}50%{opacity:1}}');
      },
      metin: '<p><b>Tenvin</b> çift yazılan harekedir; kelimenin sonunda “n” sesi verir: <span class="ar">كِتَابٌ</span> kitâbun, <span class="ar">كِتَابٍ</span> kitâbin, <span class="ar">كِتَابًا</span> kitâben.</p>' +
        '<p><b>İki üstün</b> çoğunlukla bir <b>elif</b> ile yazılır (<span class="ar">ـًا</span>): önce iki üstüne, sonra elife bas. Yuvarlak te (<span class="ar">ة</span>) ve hemzeden sonra elif gelmez: <span class="ar">مَدْرَسَةً</span>.</p>',
      ekle: [['\u064B', 'iki üstün'], ['\u064D', 'iki esre'], ['\u064C', 'iki ötre']], hareke: true, kod: 'U+064B · U+064C · U+064D'
    },
    ceker: {
      baslik: 'Çekerler — uzatarak oku',
      svg: function () {
        function k(i, tam, yal, ses, ad) {
          return '<g class="ck' + i + '">' + T(170, 120, 82, tam, ' fill="#7C3AED"') + T(170, 120, 82, yal, ' fill="#16324F"') +
            T(340, 92, 22, ad, ' fill="#16324F" font-weight="700"') + T(340, 128, 24, ses, ' fill="#7C3AED"') +
            '<rect class="ck-u" x="280" y="146" width="120" height="7" rx="3.5" fill="#7C3AED"/></g>';
        }
        return svg(k(0, 'هٰذَا', 'هذَا', '“hâzâ”', 'dik üstün') + k(1, 'بِهٖ', 'بِه', '“bihî”', 'dik esre') + k(2, 'لَهٗ', 'لَه', '“lehû”', 'ters ötre') +
          T(220, 190, 15, 'çekerli harf iki hareke süresi uzatılır', ' class="lbl"'),
          sira('ck', 3, 7.5) + '.ck-u{transform-box:fill-box;transform-origin:left;animation:ckU 2.5s ease-out infinite}@keyframes ckU{0%,10%{transform:scaleX(.1)}70%,100%{transform:scaleX(1)}}');
      },
      metin: '<p><b>Çekerler</b> harfin uzatılarak okunacağını gösteren küçük işaretlerdir (Kur’an ve dinî metinlerde sık geçer).</p>' +
        '<ul><li><b>Dik üstün</b> (hançerî elif) <span class="ar">هٰذَا</span> — “â” diye uzatılır. <span class="ar">اللّٰهُ ، الرَّحْمٰنُ</span></li>' +
        '<li><b>Dik esre</b> <span class="ar">بِهٖ</span> — “î”, <b>ters ötre</b> <span class="ar">لَهٗ</span> — “û”.</li>' +
        '<li><b>Med</b> (<span class="ar">ٓ</span>) daha uzun çekişi gösterir. <span class="bilgi-bag" role="button" tabindex="0" data-bilgi="med">Med nasıl okunur? ›</span></li></ul>',
      ekle: [['\u0670', 'dik üstün'], ['\u0656', 'dik esre'], ['\u0657', 'ters ötre'], ['\u0653', 'med']], hareke: true, kod: 'U+0670 · U+0656 · U+0657'
    },
    med: {
      baslik: 'Med — uzun çekiş',
      svg: function () {
        return svg(T(160, 122, 86, 'جَآءَ', ' fill="#16324F"') +
          '<path class="md-d" d="M118 52q12-12 24 0t24 0t24 0" fill="none" stroke="#E67E22" stroke-width="4" stroke-linecap="round"/>' +
          T(330, 100, 30, '“câââe”', ' fill="#E67E22" font-weight="700"') +
          '<g class="md-b">' + [0, 1, 2, 3].map(function (i) { return '<rect x="' + (270 + i * 30) + '" y="126" width="22" height="10" rx="5" fill="#E67E22" style="animation-delay:' + (i * .35) + 's"/>'; }).join('') + '</g>' +
          T(220, 186, 15, 'med işareti sesi 2–5 elif süresi uzatır', ' class="lbl"'),
          '.md-d{animation:mdD 1.6s ease-in-out infinite}@keyframes mdD{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}' +
          '.md-b rect{opacity:.15;animation:mdB 2.1s infinite}@keyframes mdB{0%{opacity:.15}20%,70%{opacity:1}100%{opacity:.15}}');
      },
      metin: '<p><b>Med</b> (medde) işareti uzatma harfinin (<span class="ar">ا و ي</span>) üstüne konur ve sesin <b>uzun çekileceğini</b> gösterir: <span class="ar">جَآءَ ، آمَنَ</span>.</p>' +
        '<p>Kelime başındaki <span class="ar">آ</span> (medli elif) klavyede elife <b>uzun basınca</b> da çıkar.</p>',
      ekle: [['\u0653', 'med'], ['آ', 'medli elif']], hareke: true, kod: 'U+0653 ARABIC MADDAH ABOVE'
    },
    hemze: {
      baslik: 'Hemze ve taşıyıcıları',
      svg: function () {
        var yer = [[330, 'ا', 'elif'], [240, 'و', 'vav'], [150, 'ى', 'ye'], [66, '', 'satırda']];
        return svg(yer.map(function (y) {
          return (y[1] ? T(y[0], 130, 70, y[1], ' fill="#16324F"') : '<rect x="' + (y[0] - 26) + '" y="126" width="52" height="4" rx="2" fill="#CBD5E1"/>') +
            T(y[0], 170, 15, y[2], ' class="lbl"');
        }).join('') +
          '<g class="hm-z">' + T(0, 0, 40, 'ء', ' fill="#16A085"') + '</g>' +
          T(220, 196, 14, 'hemze, önceki ve kendi harekesine göre taşıyıcı seçer', ' class="lbl"'),
          '.hm-z{animation:hmZ 6s ease-in-out infinite}' +
          '@keyframes hmZ{0%,14%{transform:translate(334px,56px)}24%,38%{transform:translate(244px,72px)}48%,62%{transform:translate(156px,92px)}72%,86%{transform:translate(66px,120px)}100%{transform:translate(334px,56px)}}');
      },
      metin: '<p><b>Hemze</b> (<span class="ar">ء</span>) bir harf değil, bir “kesik ses”tir; yazılırken bir taşıyıcıya oturur: <span class="ar">أ إ ؤ ئ</span> ya da satırda <span class="ar">ء</span>.</p>' +
        '<ul><li>Elife <b>uzun bas</b>: <span class="ar">أ إ آ ٱ</span></li><li>Hareke alanındaki <b>üstte / altta hemze</b> tuşları hemzeyi harfin üstüne ya da altına ekler.</li>' +
        '<li>Kelime başındaki okunmayan elif: <span class="bilgi-bag" role="button" tabindex="0" data-bilgi="vasla">vasla ٱ ›</span></li></ul>',
      ekle: [['\u0654', 'üstte hemze'], ['\u0655', 'altta hemze'], ['ء', 'hemze']], kod: 'U+0621 · U+0654 · U+0655'
    },
    vasla: {
      baslik: 'Vasla ٱ — okunmayan elif',
      svg: function () {
        return svg(T(310, 112, 64, 'فِي', ' fill="#16324F"') + T(160, 112, 64, 'ٱلْبَيْتِ', ' fill="#16324F"') +
          '<path class="vs-k" d="M292 132q-50 44-96 0" fill="none" stroke="#16A085" stroke-width="3.5" stroke-dasharray="7 6" stroke-linecap="round"/>' +
          '<circle class="vs-e" cx="205" cy="58" r="23" fill="none" stroke="#EE5253" stroke-width="3"/>' +
          T(220, 182, 22, '“fil-beyti”', ' fill="#16A085" font-weight="700"'),
          '.vs-k{stroke-dashoffset:26;animation:vsK 1.4s linear infinite}@keyframes vsK{to{stroke-dashoffset:0}}' +
          '.vs-e{transform-box:fill-box;transform-origin:center;animation:vsE 2s ease-in-out infinite}@keyframes vsE{0%,100%{opacity:.25;transform:scale(.9)}50%{opacity:1;transform:scale(1.05)}}');
      },
      metin: '<p><b>Vasla</b> (<span class="ar">ٱ</span>) kelime başındaki elifin <b>ulanarak okunduğunu</b>, yani okunmadığını gösterir: <span class="ar">فِي ٱلْبَيْتِ</span> “fil-beyti”.</p>' +
        '<p>Kur’an yazımında ve harf-i tarif (<span class="ar">ٱلْ</span>) öğretiminde kullanılır. Klavyede elife uzun basınca da çıkar; sembollerde <b>Kur’an</b> sekmesinde de var.</p>',
      ekle: [['\u0671', 'vasla elifi']], kod: 'U+0671 ARABIC LETTER ALEF WASLA'
    },
    muhur: {
      baslik: 'Mühürler — ﷲ ﷻ ﷺ ﷽',
      svg: function () {
        function k(i, c, a) {
          return '<g class="mh' + i + '"><g class="mh-d">' + T(220, 124, 66, c, ' fill="#7A4A00"') + '</g>' + T(220, 188, 17, a, ' fill="#7A4A00" font-weight="700"') + '</g>';
        }
        return svg('<circle class="mh-h" cx="220" cy="100" r="66" fill="#FFF8E6" stroke="#E9C46A" stroke-width="4"/>' +
          '<circle class="mh-hh" cx="220" cy="100" r="76" fill="none" stroke="#E9C46A" stroke-width="2" stroke-dasharray="4 7"/>' +
          k(0, '\uFDFA', 'sallallâhu aleyhi ve sellem (sav)') + k(1, '\uFDFB', 'celle celâlühû (cc)') + k(2, '\uFDF2', 'Allah') + k(3, '\uFDFD', 'Besmele'),
          sira('mh', 4, 9.6) + '.mh-d{transform-box:fill-box;transform-origin:center;animation:mhD 2.4s cubic-bezier(.3,1.6,.5,1) infinite}' +
          '@keyframes mhD{0%{transform:scale(1.6)}14%,100%{transform:scale(1)}}' +
          '.mh-hh{transform-box:fill-box;transform-origin:center;animation:mhH 14s linear infinite}@keyframes mhH{to{transform:rotate(360deg)}}');
      },
      metin: '<p>Bu işaretler <b>tek bir karakter</b> olarak yazılan hazır bağlamalardır (Unicode “ligature”):</p>' +
        '<ul><li><span class="ar">ﷲ</span> <b>Allah</b> lafzı</li><li><span class="ar">ﷻ</span> <b>celle celâlühû</b> (cc) — Allah’ın adından sonra</li>' +
        '<li><span class="ar">ﷺ</span> <b>sallallâhu aleyhi ve sellem</b> (sav) — Peygamberimizin adından sonra</li><li><span class="ar">﷽</span> <b>Besmele</b></li></ul>' +
        '<p><b>Dikkat:</b> Her yazı tipinde bulunmazlar; bulunmayanda kutucuk (□) görünür. Word’de Sakkal Majalla, Dokümanlar’da Amiri bunları gösterir. Emin değilsen <b>Mühür · İfade</b> sekmesindeki <b>açık yazılışları</b> kullan: <span class="ar">صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ</span>.</p>',
      ekle: [['\uFDFA', 'sav'], ['\uFDFB', 'cc'], ['\uFDF2', 'Allah']], kod: 'U+FDFA · U+FDFB · U+FDF2 · U+FDFD'
    },
    ayet: {
      baslik: 'Âyet ayracı ve âyet sonu',
      svg: function () {
        return svg(T(220, 110, 44, 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', ' fill="#16324F"') +
          '<g class="ay-s">' + T(392, 114, 58, '\uFD3F', ' fill="#16A085"') + '</g>' +
          '<g class="ay-l">' + T(48, 114, 58, '\uFD3E', ' fill="#16A085"') + '</g>' +
          '<g class="ay-n"><circle cx="220" cy="160" r="19" fill="#FFF8E6" stroke="#E9C46A" stroke-width="3"/>' + T(220, 168, 22, '٦', ' fill="#7A4A00"') + '</g>' +
          T(220, 200, 13, 'İnşirâh 6 · ayraç âyeti sarar, numara sonuna gelir', ' class="lbl"'),
          '.ay-s{animation:ayS 4s ease-in-out infinite}@keyframes ayS{0%,8%{transform:translateX(40px);opacity:0}28%,88%{transform:none;opacity:1}100%{opacity:0}}' +
          '.ay-l{animation:ayL 4s ease-in-out infinite}@keyframes ayL{0%,8%{transform:translateX(-40px);opacity:0}28%,88%{transform:none;opacity:1}100%{opacity:0}}' +
          '.ay-n{transform-box:fill-box;transform-origin:center;animation:ayN 4s ease-in-out infinite}@keyframes ayN{0%,34%{transform:scale(0)}46%{transform:scale(1.2)}52%,88%{transform:scale(1)}100%{transform:scale(0)}}');
      },
      metin: '<p><b>Âyet ayracı</b> <span class="ar">﴿ ﴾</span> alıntılanan âyeti sarar. Tuş ikisini birden ekler, imleç araya girer; seçili metin varsa onu sarar.</p>' +
        '<p><b>Âyet sonu</b> <span class="ar">۝</span> ardından gelen Arapça rakamla âyet numarasını gösterir (yazı tipi destekliyorsa numara çemberin içine girer). “Âyet numarası” kutusu ikisini birlikte ekler. <span class="ar">۞</span> hizb, <span class="ar">۩</span> secde işaretidir.</p>',
      ekle: [['\uFD3F\uFD3E', 'âyet ayracı', 1], ['\u06DD', 'âyet sonu'], ['\u06DE', 'hizb']], kod: 'U+FD3F · U+FD3E · U+06DD · U+06DE · U+06E9'
    },
    vakif: {
      baslik: 'Vakıf (durak) işaretleri',
      svg: function () {
        var l = [[360, '\u06D8', '#EE5253', 'dur (lâzım)'], [220, '\u06D9', '#475569', 'durma (lâ)'], [80, '\u06DA', '#16A085', 'durabilirsin']];
        return svg(l.map(function (x, i) {
          return '<g class="vk' + i + '"><circle cx="' + x[0] + '" cy="86" r="44" fill="#fff" stroke="' + x[2] + '" stroke-width="7"/>' +
            isaretG(x[1], x[0], 86, 64, x[2]) + T(x[0], 162, 16, x[3], ' fill="' + x[2] + '" font-weight="700"') + '</g>';
        }).join('') + T(220, 196, 14, 'Kur’an’da nerede durulacağını gösterir', ' class="lbl"'),
          '.vk0,.vk1,.vk2{transform-box:fill-box;transform-origin:center;animation:vk 5s ease-in-out infinite}.vk1{animation-delay:.4s}.vk2{animation-delay:.8s}' +
          '@keyframes vk{0%,6%{transform:scale(0)}16%{transform:scale(1.12)}22%,86%{transform:scale(1)}96%,100%{transform:scale(0)}}');
      },
      metin: '<p>Kur’an metninde kelimenin üstüne küçük harflerle yazılan <b>durak işaretleri</b>:</p>' +
        '<ul><li><span class="ar">ۘ</span> <b>lâzım</b>: durmak gerekir · <span class="ar">ۙ</span> <b>lâ</b>: durulmaz</li>' +
        '<li><span class="ar">ۚ</span> <b>câiz</b>: durulabilir · <span class="ar">ۖ</span> sılâ evlâ (geçmek daha iyi) · <span class="ar">ۗ</span> kılâ evlâ (durmak daha iyi)</li>' +
        '<li><span class="ar">ۛ</span> <b>muânaka</b>: iki yerden birinde durulur · <span class="ar">ۜ</span> <b>sekte</b>: nefes almadan kısa durulur</li></ul>' +
        '<p>İşaretler bir önceki harfin üstüne yerleşir (hareke gibi).</p>',
      ekle: [['\u06D8', 'lâzım'], ['\u06DA', 'câiz'], ['\u06D9', 'lâ']], hareke: true, kod: 'U+06D6 – U+06DC'
    },
    imla: {
      baslik: 'Kur’an imlâsı işaretleri',
      svg: function () {
        return svg('<g class="im0">' + T(220, 112, 70, 'لَهُۥ', ' fill="#16324F"') + T(220, 166, 18, 'küçük vav: “lehû”', ' fill="#2563EB"') + '</g>' +
          '<g class="im1">' + T(220, 112, 70, 'مِنۢ بَعْدِ', ' fill="#16324F"') + T(220, 166, 18, 'iklâb mimi: n → m', ' fill="#2563EB"') + '</g>', sira('im', 2, 6));
      },
      metin: '<p>Mushaf yazımına özgü küçük işaretler:</p><ul><li><span class="ar">ۥ</span> küçük vav, <span class="ar">ۦ</span> küçük ye — zamirin uzatılarak okunduğunu gösterir.</li>' +
        '<li><span class="ar">ۢ</span> iklâb mimi — nun sesinin “m” okunacağını gösterir.</li><li><span class="ar">ۡ</span> Kur’an cezmi, <span class="ar">ۨ</span> küçük nun, <span class="ar">ۭ</span> alt mim.</li></ul>',
      ekle: [['\u06E5', 'küçük vav'], ['\u06E2', 'iklâb mimi']], hareke: true, kod: 'U+06E1 · U+06E2 · U+06E5 · U+06E6 · U+06E8 · U+06ED'
    },
    noktalama: {
      baslik: 'Arapça noktalama — ters dönen işaretler',
      svg: function () {
        function k(i, lat, ar, ad) {
          return '<g class="nk' + i + '">' + T(130, 120, 84, lat, ' fill="#94A3B8"') +
            '<path d="M190 96h60M236 84l14 12-14 12" fill="none" stroke="#16A085" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
            T(310, 120, 84, ar, ' fill="#16324F"') + T(220, 176, 18, ad, ' fill="#16324F" font-weight="700"') + '</g>';
        }
        return svg(k(0, '?', '؟', 'soru işareti') + k(1, ',', '،', 'virgül') + k(2, ';', '؛', 'noktalı virgül'), sira('nk', 3, 6.6));
      },
      metin: '<p>Arapça sağdan sola yazıldığı için bazı noktalama işaretleri <b>ters</b> çevrilir: soru <span class="ar">؟</span>, virgül <span class="ar">،</span>, noktalı virgül <span class="ar">؛</span>.</p>' +
        '<p>Nokta, ünlem ve iki nokta aynıdır. Parantez ve tırnak tuşları açanı ve kapatanı birlikte ekler.</p>',
      ekle: [['؟', 'soru'], ['،', 'virgül'], ['؛', 'noktalı virgül']], kod: 'U+061F · U+060C · U+061B'
    },
    rakam: {
      baslik: 'Arapça rakamlar',
      svg: function () {
        var lat = '12345'.split(''), ar = '١٢٣٤٥'.split('');
        return svg(lat.map(function (d, i) {
          var x = 90 + i * 65;
          return '<g><text class="rk-l" x="' + x + '" y="112" font-size="56" text-anchor="middle" fill="#94A3B8" style="animation-delay:' + (i * .25) + 's">' + d + '</text>' +
            '<text class="rk-a" x="' + x + '" y="112" font-size="60" text-anchor="middle" fill="#16324F" style="animation-delay:' + (i * .25) + 's">' + ar[i] + '</text></g>';
        }).join('') + T(220, 168, 20, '٢٠٢٦ → soldan sağa okunur', ' fill="#16A085" font-weight="700"'),
          '.rk-l{animation:rkL 4.4s ease-in-out infinite}.rk-a{animation:rkA 4.4s ease-in-out infinite}' +
          '@keyframes rkL{0%,25%{opacity:1}40%,80%{opacity:0}95%,100%{opacity:1}}@keyframes rkA{0%,25%{opacity:0}40%,80%{opacity:1}95%,100%{opacity:0}}');
      },
      metin: '<p>Arap dünyasının çoğunda <span class="ar">٠١٢٣٤٥٦٧٨٩</span> rakamları kullanılır (Mağrib’de Latin rakamları).</p>' +
        '<p><b>Önemli:</b> Yazı sağdan sola olsa da <b>sayılar soldan sağa</b> yazılır ve okunur: <span class="ar">٢٠٢٦</span> = 2026. Ondalık ayırıcı <span class="ar">٫</span>, binlik ayırıcı <span class="ar">٬</span>, yüzde <span class="ar">٪</span>.</p>',
      ekle: [['١', '1'], ['٢', '2'], ['٣', '3']], kod: 'U+0660 – U+0669'
    },
    gorunmez: {
      baslik: 'Görünmez işaretler',
      svg: function () {
        return svg('<g class="gz0">' + T(220, 118, 84, 'بب', ' fill="#16324F"') + T(220, 170, 18, 'harfler bitişik', ' fill="#16A085"') + '</g>' +
          '<g class="gz1">' + T(220, 118, 84, 'ب\u200Cب', ' fill="#16324F"') +
          '<path d="M220 40v96" stroke="#2563EB" stroke-width="3" stroke-dasharray="6 6"/>' + T(220, 170, 18, 'ZWNJ: bitişme kesildi', ' fill="#2563EB"') + '</g>',
          sira('gz', 2, 5));
      },
      metin: '<ul><li><b>ZWNJ</b> (bitiştirme): iki harfin birbirine bağlanmasını keser — harf tanıtırken işe yarar: <span class="ar">ب\u200cب</span></li>' +
        '<li><b>ZWJ</b> (bitiştir): harfin bağlı şeklini zorlar.</li>' +
        '<li><b>RLM / LRM</b>: yön işaretleri. Arapça cümle Türkçe bir belgede sona noktalama alınca yanlış tarafa kaçıyorsa satırın sonuna RLM koy.</li>' +
        '<li><b>Bölünmez boşluk</b>: iki kelimenin satır sonunda ayrılmasını önler (ﷺ gibi mühürlerden önce).</li></ul>' +
        '<p>Bu işaretler ekranda görünmez; silmek için imleci yanına getirip sil tuşuna bas.</p>',
      ekle: [['\u200C', 'ZWNJ'], ['\u200F', 'RLM']], kod: 'U+200C · U+200D · U+200F · U+200E · U+00A0'
    },
    kopya: {
      baslik: 'Kopyalama: okunaklı yazı tipiyle',
      svg: function () {
        return svg('<rect x="40" y="46" width="120" height="120" rx="14" fill="#fff" stroke="#16A085" stroke-width="3"/>' +
          T(100, 116, 38, 'كَتَبَ', ' fill="#16324F"') +
          '<path class="kp-o" d="M176 106h86M250 94l14 12-14 12" fill="none" stroke="#16A085" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<g class="kp-d"><rect x="282" y="36" width="118" height="140" rx="10" fill="#fff" stroke="#2B579A" stroke-width="3"/>' +
          '<rect x="282" y="36" width="118" height="26" rx="10" fill="#2B579A"/>' + T(341, 56, 16, 'Word', ' fill="#fff" font-weight="700"') +
          T(341, 118, 36, 'كَتَبَ', ' fill="#16324F"') + T(341, 156, 12, 'Sakkal Majalla · 20 pt', ' fill="#2B579A"') + '</g>',
          '.kp-o{stroke-dasharray:110;stroke-dashoffset:110;animation:kpO 3s ease-in-out infinite}@keyframes kpO{0%,10%{stroke-dashoffset:110}45%,100%{stroke-dashoffset:0}}' +
          '.kp-d{animation:kpD 3s ease-in-out infinite}@keyframes kpD{0%,40%{opacity:.25;transform:translateY(6px)}55%,92%{opacity:1;transform:none}100%{opacity:.25}}');
      },
      metin: '<p>Düz metin (TXT, WhatsApp) <b>yazı tipi taşımaz</b>; açıldığı program kendi yazı tipini kullanır. Bu yüzden “Kopyala” düğmesi metni hem düz metin hem de <b>biçimli metin</b> olarak panoya koyar. Biçimli metinde hedef programın tanıdığı kodlar vardır:</p>' +
        '<ul><li><b>Word / PowerPoint</b>: <code>mso-bidi-font-family: Sakkal Majalla</code> — Word Arapçayı bu ayardan okur.</li>' +
        '<li><b>Google Dokümanlar, LibreOffice</b>: Amiri (ikisinde de hazır).</li><li><b>Pages, TextEdit</b>: Geeza Pro.</li>' +
        '<li><b>Not Defteri</b>: görünmez yön işareti (RLM) — noktalama doğru yerde durur.</li></ul>' +
        '<p><b>Kaydet</b> menüsündeki <b>.rtf</b> dosyası yazı tipini dosyanın içine yazar; Word, WordPad, Pages ve LibreOffice’te aynen açılır. <b>Resim</b> ise her yerde birebir aynı görünür.</p>',
      kod: 'text/html + text/plain · RTF \\fcharset178'
    }
  };

  function bilgiAc(konu) {
    var b = BILGI[konu];
    if (!b) return;
    menuleriKapat();
    var kutu = $('#bilgiSvg');
    kutu.innerHTML = b.svg();
    kutu.style.aspectRatio = b.oran || '';
    $('#bilgiBaslik').textContent = b.baslik;
    $('#bilgiMetin').innerHTML = b.metin;
    /* Arapça parçalar kendi yönünde dursun (ayraçlar, noktalama doğru tarafta);
       tek başına duran işaret harfsiz çizilir (metinde önceki harfin üstüne kaymasın) */
    $$('#bilgiMetin .ar').forEach(function (el) {
      el.setAttribute('dir', 'rtl');
      var t = el.textContent;
      if (t.length === 1 && IS_YOL[t]) { el.innerHTML = gosterge(t); el.classList.add('isr-i'); }
    });
    $('#bilgiAlt').innerHTML = (b.ekle || []).map(function (e, i) {
      var gor = IS_YOL[e[0]] ? gosterge(e[0]) : kac(e[0] === '\uFD3F\uFD3E' ? '\uFD3F \uFD3E' : e[0]);
      return '<button type="button" class="bilgi-ekle" data-i="' + i + '"><b dir="rtl">' + gor + '</b>' + kac(e[1]) + ' ekle</button>';
    }).join('') + (b.kod ? '<span class="bilgi-kod">' + kac(b.kod) + '</span>' : '');
    $$('#bilgiAlt .bilgi-ekle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var e = b.ekle[+btn.getAttribute('data-i')];
        bilgiKapat();
        if (e[2]) yaz(e[0], e[2]);
        else if (ISARET.test(e[0].charAt(0))) harekeYaz(e[0]);
        else yaz(e[0]);
      });
    });
    $('#bilgi').hidden = false;
    /* hareketi azalt ayarında animasyon, konuyu anlatan bir karede durur (pencere görünür olunca) */
    try {
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches && kutu.getAnimations) {
        kutu.getAnimations({ subtree: true }).forEach(function (a) { a.pause(); a.currentTime = (b.durgun || 1) * 1000; });
      }
    } catch (e) {}
    $('#bilgiKapat').focus();
  }
  function bilgiKapat() {
    if ($('#bilgi').hidden) return;
    $('#bilgi').hidden = true; $('#bilgiSvg').innerHTML = '';
  }
  $('#bilgiKapat').addEventListener('click', bilgiKapat);
  $('#bilgi').addEventListener('click', function (e) { if (e.target === this) bilgiKapat(); });

  /* =====================================================================
     6) KOPYALAMA · KAYDETME
     ===================================================================== */
  function harekesizMetin(s) { return s.replace(HAREKE_TEMIZ, ''); }
  function cikti() {
    var v = ta.value;
    if (ayar.harekesiz) v = harekesizMetin(v);
    return v.replace(/\r\n?/g, '\n');
  }
  /* Word / Dokümanlar / Pages / LibreOffice için biçimli metin.
     mso-* kodları Word'e özeldir: Arapça "karmaşık betik" (bidi) sayılır,
     Word yazı tipini font-family'den değil mso-bidi-font-family'den alır. */
  function htmlYap(metin, h) {
    var f = h.font, pt = h.pt;
    var yazi = "font-family:'" + f + "';font-size:" + pt + 'pt;mso-ascii-font-family:\'' + f + "';mso-hansi-font-family:'" + f +
      "';mso-bidi-font-family:'" + f + "';mso-bidi-font-size:" + pt + 'pt;mso-bidi-language:AR-SA';
    var par = 'direction:rtl;unicode-bidi:embed;text-align:right;margin:0 0 6pt 0;line-height:150%;' + yazi;
    var govde = metin.split('\n').map(function (s) {
      return '<p class="MsoNormal" dir="RTL" align="right" style="' + par + '"><span lang="AR-SA" dir="RTL" style="' + yazi + '">' +
        (kac(s) || '&nbsp;') + '</span></p>';
    }).join('');
    return '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" lang="ar"><head>' +
      '<meta charset="utf-8"><meta name="ProgId" content="Word.Document"></head><body dir="rtl"><!--StartFragment-->' + govde + '<!--EndFragment--></body></html>';
  }
  function duzYap(metin, h) {
    if (!h.rlm) return metin;
    return metin.split('\n').map(function (s) { return s ? '\u200F' + s + '\u200F' : s; }).join('\n');
  }

  function kopyala() {
    var metin = cikti();
    if (!metin.trim()) { bildir('Önce bir şey yaz.', true); return; }
    var h = HEDEF[ayar.hedef] || HEDEF.word;
    var duz = duzYap(metin, h), html = h.duz ? null : htmlYap(metin, h);
    var tamam = function () { bildir('Kopyalandı — ' + h.ad + (h.duz ? ' (düz metin)' : ' · ' + h.font + ' ' + h.pt + ' pt')); };
    var yedek = function () {
      /* eski yol: kopyalama olayında iki biçimi birden koy */
      var dinle = function (e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', duz);
        if (html) e.clipboardData.setData('text/html', html);
      };
      document.addEventListener('copy', dinle);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (x) {}
      document.removeEventListener('copy', dinle);
      if (ok) tamam(); else bildir('Kopyalanamadı. Metni seçip Ctrl+C ile kopyala.', true);
    };
    try {
      if (navigator.clipboard && window.ClipboardItem && html) {
        var item = new ClipboardItem({
          'text/plain': new Blob([duz], { type: 'text/plain' }),
          'text/html': new Blob([html], { type: 'text/html' })
        });
        navigator.clipboard.write([item]).then(tamam, yedek);
      } else if (navigator.clipboard && navigator.clipboard.writeText && !html) {
        navigator.clipboard.writeText(duz).then(tamam, yedek);
      } else yedek();
    } catch (e) { yedek(); }
  }

  /* RTF: yazı tipini dosyanın İÇİNE yazar (Word, WordPad, Pages, TextEdit, LibreOffice).
     \fcharset178 = Arapça; \rtlpar sağdan sola paragraf; \af ile Word'ün
     karmaşık betik yazı tipi de aynı olsun. Her Arapça karakter \uN? kaçışıyla. */
  function rtfYap(metin, font, pt) {
    var fs = Math.round(pt * 2), g = '';
    for (var i = 0; i < metin.length; i++) {
      var ch = metin.charAt(i), c = metin.charCodeAt(i);
      if (ch === '\n') { g += '\\par\n'; continue; }
      if (ch === '\\' || ch === '{' || ch === '}') { g += '\\' + ch; continue; }
      if (c === 9) { g += '\\tab '; continue; }
      if (c < 128) { g += ch; continue; }
      g += '\\u' + (c > 32767 ? c - 65536 : c) + '?';
    }
    return '{\\rtf1\\ansi\\ansicpg1254\\deff0\\deflang1055\\adeflang1025' +
      '{\\fonttbl{\\f0\\fnil\\fcharset178 ' + font + ';}{\\f1\\fswiss\\fcharset162 Arial;}}' +
      '\\viewkind4\\uc1\\pard\\rtlpar\\qr\\sl360\\slmult1\\rtlch\\fcs1\\af0\\afs' + fs + '\\alang1025\\ltrch\\fcs0\\f0\\fs' + fs + '\\lang1025 ' +
      g + '\\par}';
  }
  function indirDosya(ad, icerik, tur) {
    var blob = icerik instanceof Blob ? icerik : new Blob([icerik], { type: tur });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = ad;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function dosyaKoku() {
    var d = new Date();
    return 'arapca-metin-' + d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
  }
  function kaydetRtf() {
    var m = cikti(); if (!m.trim()) { bildir('Önce bir şey yaz.', true); return; }
    var h = HEDEF[ayar.hedef]; var font = h.font || 'Sakkal Majalla', pt = h.pt || 20;
    indirDosya(dosyaKoku() + '.rtf', rtfYap(m, font, pt), 'application/rtf');
    bildir('.rtf kaydedildi · ' + font + ' ' + pt + ' pt');
  }
  function kaydetTxt() {
    var m = cikti(); if (!m.trim()) { bildir('Önce bir şey yaz.', true); return; }
    /* Not Defteri için: UTF-8 imzası (BOM) + Windows satır sonu + RLM */
    var t = '\uFEFF' + duzYap(m, { rlm: true }).replace(/\n/g, '\r\n');
    indirDosya(dosyaKoku() + '.txt', t, 'text/plain;charset=utf-8');
    bildir('.txt kaydedildi (UTF-8)');
  }
  function kaydetPng() {
    var m = cikti(); if (!m.trim()) { bildir('Önce bir şey yaz.', true); return; }
    var fontAd = ayar.yt === 'amiri' ? 'AmiriK, Arakom' : 'Arakom, AmiriK';
    var hazir = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('64px Arakom', m), document.fonts.load('64px AmiriK', m)]) : Promise.resolve();
    hazir.then(function () {
      var G = 1600, pad = 90, boy = 64, satirY = Math.round(boy * 1.9);
      var olc = document.createElement('canvas').getContext('2d');
      olc.font = boy + 'px ' + fontAd + ', serif';
      var satirlar = [];
      m.split('\n').forEach(function (p) {
        if (!p) { satirlar.push(''); return; }
        var kel = p.split(' '), sat = '';
        kel.forEach(function (k) {
          var den = sat ? sat + ' ' + k : k;
          if (olc.measureText(den).width > G - pad * 2 && sat) { satirlar.push(sat); sat = k; } else sat = den;
        });
        satirlar.push(sat);
      });
      var H = pad * 2 + satirlar.length * satirY + 40;
      var cv = document.createElement('canvas'); cv.width = G; cv.height = H;
      var x = cv.getContext('2d');
      x.fillStyle = '#ffffff'; x.fillRect(0, 0, G, H);
      x.fillStyle = '#E8F6F2'; x.fillRect(0, H - 46, G, 46);
      x.font = boy + 'px ' + fontAd + ', serif'; x.fillStyle = '#0b1b2b';
      x.direction = 'rtl'; x.textAlign = 'right'; x.textBaseline = 'alphabetic';
      satirlar.forEach(function (s, i) { x.fillText(s, G - pad, pad + boy + i * satirY); });
      x.direction = 'ltr'; x.textAlign = 'left'; x.font = '22px Arakom, sans-serif'; x.fillStyle = '#0E7C66';
      x.fillText('kidefarapca.com', 30, H - 16);
      cv.toBlob(function (b) { indirDosya(dosyaKoku() + '.png', b); bildir('Resim kaydedildi (.png)'); }, 'image/png');
    });
  }

  /* ---------- açılır menüler ---------- */
  function menuKonumla(m, dug) {
    m.hidden = false;
    var r = dug.getBoundingClientRect(), w = m.offsetWidth;
    m.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left)) + 'px';
    m.style.top = Math.min(r.bottom + 6, window.innerHeight - 40) + 'px';
    dug.setAttribute('aria-expanded', 'true');
  }
  function menuleriKapat() {
    ['#hedefMenu', '#indirMenu'].forEach(function (s) { $(s).hidden = true; });
    $('#hedefDug').setAttribute('aria-expanded', 'false'); $('#indirDug').setAttribute('aria-expanded', 'false');
  }
  function hedefMenuCiz() {
    var m = $('#hedefMenu');
    m.innerHTML = '<h4>Nereye yapıştıracaksın?</h4>' + HEDEF_SIRA.map(function (k) {
      var h = HEDEF[k];
      return '<button type="button" class="menu-sec" role="menuitemradio" data-hedef="' + k + '" aria-checked="' + (ayar.hedef === k) + '">' +
        '<span class="ik" style="background:' + h.renk + '">' + (h.harf || (k === 'pages' ? '' : '✉')) + '</span>' +
        '<span><b>' + h.ad + '</b><small>' + h.not + '</small></span></button>';
    }).join('') +
      '<label class="menu-alt"><input type="checkbox" id="harekesizKopya"' + (ayar.harekesiz ? ' checked' : '') + '> Harekesiz kopyala / kaydet</label>' +
      '<div class="menu-alt"><span class="bilgi-dug" role="button" tabindex="0" data-bilgi="kopya" aria-label="Bilgi" style="position:static"></span> Yazı tipi neden taşınmaz?</div>';
  }
  function indirMenuCiz() {
    var h = HEDEF[ayar.hedef];
    var f = h.duz ? 'Sakkal Majalla 20 pt' : h.font + ' ' + h.pt + ' pt';
    $('#indirMenu').innerHTML = '<h4>Dosya olarak kaydet</h4>' +
      '<button type="button" class="menu-sec" data-kaydet="rtf"><span class="ik" style="background:#2B579A">RTF</span><span><b>Zengin metin (.rtf)</b><small>Word, WordPad, Pages, TextEdit, LibreOffice’te yazı tipiyle açılır · <code>' + kac(f) + '</code></small></span></button>' +
      '<button type="button" class="menu-sec" data-kaydet="txt"><span class="ik" style="background:#475569">TXT</span><span><b>Düz metin (.txt)</b><small>UTF-8, Not Defteri uyumlu; yazı tipi taşımaz</small></span></button>' +
      '<button type="button" class="menu-sec" data-kaydet="png"><span class="ik" style="background:#16A085">PNG</span><span><b>Resim (.png)</b><small>Harekeler ve yazı tipi birebir; WhatsApp’ta, sunumda paylaş</small></span></button>';
  }
  function hedefYaz() {
    var h = HEDEF[ayar.hedef];
    $('#hedefAd').textContent = h.ad.split(' · ')[0];
  }
  $('#hedefDug').addEventListener('click', function (e) {
    e.stopPropagation();
    var m = $('#hedefMenu'), acik = !m.hidden; menuleriKapat();
    if (!acik) { hedefMenuCiz(); menuKonumla(m, this); }
  });
  $('#indirDug').addEventListener('click', function (e) {
    e.stopPropagation();
    var m = $('#indirMenu'), acik = !m.hidden; menuleriKapat();
    if (!acik) { indirMenuCiz(); menuKonumla(m, this); }
  });
  $('#hedefMenu').addEventListener('click', function (e) {
    e.stopPropagation();
    var b = e.target.closest('[data-hedef]');
    if (b) { ayar.hedef = b.getAttribute('data-hedef'); kaydet(); hedefYaz(); menuleriKapat(); bildir('Kopyalama hedefi: ' + HEDEF[ayar.hedef].ad); return; }
    var r = e.target.closest('.bilgi-dug');
    if (r) { menuleriKapat(); bilgiAc('kopya'); }
  });
  $('#hedefMenu').addEventListener('change', function (e) {
    if (e.target.id === 'harekesizKopya') { ayar.harekesiz = e.target.checked; kaydet(); }
  });
  $('#indirMenu').addEventListener('click', function (e) {
    e.stopPropagation();
    var b = e.target.closest('[data-kaydet]'); if (!b) return;
    menuleriKapat();
    ({ rtf: kaydetRtf, txt: kaydetTxt, png: kaydetPng })[b.getAttribute('data-kaydet')]();
  });
  document.addEventListener('pointerdown', function (e) {
    if (!e.target.closest('.acilir, #hedefDug, #indirDug')) menuleriKapat();
  }, true);
  window.addEventListener('resize', function () { menuleriKapat(); pencereBoy(); imleciGoster(); });

  /* =====================================================================
     7) ARAÇ ÇUBUĞU
     ===================================================================== */
  function boyUygula() {
    if (ayar.boy) ta.style.setProperty('--boy', ayar.boy + 'px'); else ta.style.removeProperty('--boy');
  }
  function boyDegis(d) {
    var su = parseFloat(getComputedStyle(ta).fontSize) || 40;
    ayar.boy = Math.max(18, Math.min(110, Math.round(su + d)));
    boyUygula(); kaydet(); imleciGoster();
  }
  $('#kopyala').addEventListener('click', kopyala);
  $('#geriAl').addEventListener('click', function () { geriAl(); odak(); });
  $('#yinele').addEventListener('click', function () { yinele(); odak(); });
  $('#kucult').addEventListener('click', function () { boyDegis(-6); });
  $('#buyut').addEventListener('click', function () { boyDegis(6); });
  $('#harekesiz').addEventListener('click', function () {
    var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
    if (!v) return;
    gecmisEkle();
    if (s !== e) { var yeni = harekesizMetin(v.slice(s, e)); ta.setRangeText(yeni, s, e, 'select'); }
    else ta.value = harekesizMetin(v);
    odak(); sonra(); bildir(s !== e ? 'Seçili kısmın harekeleri kaldırıldı.' : 'Bütün harekeler kaldırıldı. Geri almak için ↶');
  });
  $('#temizle').addEventListener('click', function () {
    if (!ta.value) return;
    gecmisEkle(); ta.value = ''; odak(); sonra(); bildir('Silindi. Geri almak için ↶');
  });
  $$('.yazi-tipi [data-yt]').forEach(function (b) {
    b.addEventListener('click', function () { ayar.yt = b.getAttribute('data-yt'); ytUygula(); kaydet(); odak(); });
  });
  $('#imlecSag').addEventListener('click', function () { imlec(true); });
  $('#imlecSol').addEventListener('click', function () { imlec(false); });
  $('#cihazKlavye').addEventListener('change', function () {
    ayar.cihaz = this.checked; ta.setAttribute('inputmode', ayar.cihaz ? 'text' : 'none'); kaydet(); ta.blur(); odak();
  });
  $('#tamEkran').addEventListener('click', function () {
    var d = document, el = d.documentElement;
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    } catch (e) { bildir('Tam ekran bu tarayıcıda açılamadı.', true); }
  });

  /* =====================================================================
     8) AÇILIŞ
     ===================================================================== */
  geriYukle();
  $('#cihazKlavye').checked = !!ayar.cihaz;
  ta.setAttribute('inputmode', ayar.cihaz ? 'text' : 'none');
  boyUygula(); ytUygula(); hedefYaz(); klavyeKur(); katmanGoster(); panelCiz(); sonra();
  ta.setSelectionRange(ta.value.length, ta.value.length); imleciGoster();
  /* yazı tipi gelince ölçüler değişir: sembol penceresi ve imleç yeniden */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { pencereBoy(); imleciGoster(); });

  window.ArapcaKlavye = { yaz: yaz, harekeYaz: harekeYaz, sil: sil, metin: function () { return ta.value; },
    htmlYap: htmlYap, rtfYap: rtfYap, bilgiAc: bilgiAc, sekmeGit: sekmeGit, BILGI: BILGI, HEDEF: HEDEF };
})();
