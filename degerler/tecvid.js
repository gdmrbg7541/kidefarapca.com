/* ==========================================================
   TECVİD — sunum betiği (degerler/tecvid.js)
   İskelet sunumlar.html ile ORTAK: liste/harita ekranı, kumanda,
   adımlar (data-g), içindekiler önizlemesi, Esc şeridi, çıkış onayı,
   tam ekran, 2rem yazı tabanı, canlı konu haritası.
   Bu sunuma özel: SAHNE motoru (Arapça glifler durumdan duruma
   kayar — "sihirli geçiş"), zaman çizelgesiyle kendiliğinden oynar.
   ========================================================== */
(function(){
  'use strict';

  var tuval    = document.getElementById('tuval');
  var listeEl  = document.getElementById('liste');
  var onayEl   = document.getElementById('onay');
  var sayacEl  = document.getElementById('sayac');
  var ilerleme = document.getElementById('ilerleme');
  var icPanel  = document.getElementById('icindekiler');
  var icListe  = document.getElementById('icListe');
  var icBaslik = icPanel.querySelector('h3');
  var H = document.documentElement;

  /* ---------- İÇİNDEKİLER: iki kip ----------
     'izgara' = tüm ekranı kaplayan önizleme ızgarası (O / menü tuşu)
     'serit'  = Esc ile açılan, ekranın ALTINDA yatay duran küçük slaytlar */
  function icKapat(){
    icPanel.classList.remove('acik','serit');
    document.body.classList.remove('seritli');
  }
  function icAc(serit){
    icPanel.classList.toggle('serit', !!serit);
    icBaslik.textContent = serit ? 'Slaytlar' : 'İçindekiler';
    icPanel.classList.add('acik');
    document.body.classList.toggle('seritli', !!serit);
    if(serit){
      document.body.style.setProperty('--seritY', (icPanel.offsetHeight + 8) + 'px');
      seritOrtala(false);
    }
  }
  function icDegistir(serit){
    if(icPanel.classList.contains('acik') && icPanel.classList.contains('serit') === !!serit) icKapat();
    else icAc(serit);
  }
  function seritOrtala(yumusak){
    if(!icPanel.classList.contains('serit')) return;
    var k = icListe.children[s];
    if(!k) return;
    var hedef = k.offsetLeft - (icListe.clientWidth - k.offsetWidth) / 2;
    hedef = Math.max(0, Math.min(hedef, icListe.scrollWidth - icListe.clientWidth));
    try{ icListe.scrollTo({left:hedef, behavior: yumusak ? 'smooth' : 'auto'}); }
    catch(e){ icListe.scrollLeft = hedef; }
  }
  var kumanda  = document.getElementById('kumanda');
  var yardim   = document.getElementById('yardim');
  var sunumlar = [].slice.call(document.querySelectorAll('.sunum'));

  var aktif = null;      // açık sunum (DOM)
  var slaytlar = [];     // aktif sunumun slaytları
  var s = 0, a = 0;      // slayt · adım

  var par = new URLSearchParams(location.search);

  /* ---------- YAZI BOYU TABANI: hiçbir yazı 2rem'den küçük değil ---------- */
  var TABAN = 32;
  function yaziBuyut(kok){
    if (!kok || kok.dataset.buyutuldu) return;
    kok.dataset.buyutuldu = '1';
    var ler = kok.querySelectorAll('*');
    for (var i = 0; i < ler.length; i++){
      var e = ler[i];
      if (e.ownerSVGElement || e.tagName.toLowerCase() === 'svg') continue;
      if (e.closest && e.closest('.hxKutu')) continue;
      var b = parseFloat(getComputedStyle(e).fontSize) || 0;
      if (b && b < TABAN){ e.style.fontSize = TABAN + 'px'; e.classList.add('buyutuldu'); }
    }
    var kb = parseFloat(getComputedStyle(kok).fontSize) || 0;
    if (kb && kb < TABAN) kok.style.fontSize = TABAN + 'px';
  }

  /* ==========================================================
     SAHNE MOTORU
     .sahne > svg.sahne-svg[data-sure][data-dongu] içinde:
       .iz[data-p="x,y,o,renk,bayrak; ..."]  → her durumda glifin yeri
       [data-ts="0 2"]                        → yalnız o durumlarda görünür
     Sahne, bulunduğu adım göründüğünde kendiliğinden oynar; dokununca
     baştan başlar. Düşük güç kipinde geçişler anlık olur (CSS).
     ========================================================== */
  var RENK = {d:'var(--mur)', k:'var(--tk)', y:'var(--ty)', s:'var(--ts)', a:'var(--vr)', b:'var(--tb)',
              '1':'var(--h1)', '2':'var(--h2)', '3':'var(--h3)', '4':'var(--h4)', '5':'var(--h5)'};
  function sahneHazirla(el){
    if (el._hz) return el._hz;
    var svg = el.querySelector('.sahne-svg');
    var izler = [].map.call(el.querySelectorAll('.iz'), function(g){
      return { g: g, p: g.getAttribute('data-p').split(';').map(function(x){ var q = x.split(','); return {x:q[0], y:q[1], o:+q[2], c:q[3], f:q[4]}; }) };
    });
    var sure = (svg && svg.getAttribute('data-sure') || '1600').split(',').map(Number);
    var n = izler.length ? izler[0].p.length : sure.length;
    el._hz = { izler: izler, sure: sure, n: n, dongu: svg && svg.getAttribute('data-dongu') === '1',
               ts: [].slice.call(el.querySelectorAll('[data-ts]')) };
    return el._hz;
  }
  function sahneUygula(el, t, anlik){
    var hz = sahneHazirla(el);
    el._t = t;
    el.setAttribute('data-t', t);
    hz.izler.forEach(function(iz){
      var p = iz.p[Math.min(t, iz.p.length - 1)], st = iz.g.style;
      if (anlik) st.transition = 'none';
      st.transform = 'translate(' + p.x + 'px,' + p.y + 'px)';
      st.opacity = p.o ? (p.f === 'h' ? .32 : 1) : 0;
      st.fill = RENK[p.c] || RENK.d;
      iz.g.classList.toggle('v', p.f === 'v');
      iz.g.classList.toggle('h', p.f === 'h');
      iz.g.classList.toggle('z', p.f === 'z');
    });
    hz.ts.forEach(function(e){
      e.classList.toggle('gor', (' ' + e.getAttribute('data-ts') + ' ').indexOf(' ' + t + ' ') >= 0);
    });
    if (anlik){ void el.offsetWidth; hz.izler.forEach(function(iz){ iz.g.style.transition = ''; }); }
  }
  function sahneDurdur(el){ if (el._z){ clearTimeout(el._z); el._z = 0; } el._oyn = false; }
  function sahneBaslat(el){
    sahneDurdur(el);
    var hz = sahneHazirla(el);
    el._oyn = true;
    sahneUygula(el, 0, true);
    (function sonraki(){
      var t = el._t;
      el._z = setTimeout(function(){
        if (!el._oyn) return;
        if (t < hz.n - 1){ sahneUygula(el, t + 1, false); sonraki(); }
        else if (hz.dongu){ el._z = setTimeout(function(){ if (el._oyn) sahneBaslat(el); }, 600); }
        else { el._oyn = false; }
      }, hz.sure[Math.min(t, hz.sure.length - 1)] || 1600);
    })();
  }
  function sahneSon(el){ sahneDurdur(el); var hz = sahneHazirla(el); sahneUygula(el, hz.n - 1, true); }
  /* Görünür mü? — içinde bulunduğu bütün .adim'ler açık olmalı */
  function acikMi(el, sl){
    var n = el;
    while (n && n !== sl){ if (n.classList && n.classList.contains('adim') && !n.classList.contains('gor')) return false; n = n.parentNode; }
    return true;
  }
  function sahneleriTetikle(sl){
    [].forEach.call(sl.querySelectorAll('.sahne'), function(el){
      var acik = acikMi(el, sl);
      if (acik && !el._basladi){ el._basladi = true; sahneBaslat(el); }
      else if (!acik && el._basladi){ el._basladi = false; sahneDurdur(el); sahneUygula(el, 0, true); }
    });
  }
  function sahneleriDurdur(sl){
    if (!sl) return;
    [].forEach.call(sl.querySelectorAll('.sahne'), function(el){ el._basladi = false; sahneDurdur(el); sahneUygula(el, 0, true); });
  }
  document.addEventListener('click', function(e){
    var sh = e.target.closest && e.target.closest('.sahne');
    if (!sh || sh.closest('.onizKutu')) return;
    sh._basladi = true; sahneBaslat(sh);
  });

  /* ---------- adım grupları ---------- */
  function gruplar(slayt){
    var g = [], gor = {};
    [].forEach.call(slayt.querySelectorAll('.adim'), function(el){
      var k = el.getAttribute('data-g') || '0';
      if(!gor[k]){ gor[k] = []; g.push(gor[k]); }
      gor[k].push(el);
    });
    return g;
  }
  function adimUygula(){
    var sl = slaytlar[s];
    gruplar(sl).forEach(function(grup, i){
      grup.forEach(function(el){ el.classList.toggle('gor', i < a); });
    });
    sl.setAttribute('data-a', a);
    hxAdim(sl);
    sahneleriTetikle(sl);
  }
  /* ==========================================================
     CANLI KONU HARİTASI — gezilebilir şema
     Ağaç tek yerde tanımlı (HXA); iki sunum da aynı ağacı kullanır,
     yalnız "buradayız" işareti ve açılış odağı farklıdır.
     Bir kutuya basınca şema o dala DALIŞ yapar, kırıntı yolundan
     geri çıkılır. Sahne, pencereye sığacak şekilde kendiliğinden
     büyür/küçülür — kalabalık dallar uzaklaşmış gibi görünür.
     ========================================================== */
  var HXS = {
    genel:'<rect x="4.6" y="7.4" width="14.8" height="9.2" rx="3.2"/>',
    kok:'<path d="M12 7.2C10.4 5.8 8.2 5.2 5 5.2v12c3.2 0 5.4.6 7 2 1.6-1.4 3.8-2 7-2v-12c-3.2 0-5.4.6-7 2z"/><path d="M12 7.2V19.2"/>',
    kelime:'<rect x="3.6" y="8.6" width="16.8" height="7" rx="3.4"/>',
    tamlama:'<rect x="1.4" y="8.8" width="9.4" height="6.6" rx="2.4"/><rect x="13.2" y="8.8" width="9.4" height="6.6" rx="2.4"/><path d="M10.8 12.1h2.4"/>',
    cumle:'<path d="M4 5h16a2 2 0 0 1 2 2v7.6a2 2 0 0 1-2 2H9.4L4.6 20v-3.4H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M6.4 9.4h11M6.4 12.6h7"/>',
    isim:'<path d="M4 6.6h11l5 5.4-5 5.4H4a1.6 1.6 0 0 1-1.6-1.6V8.2A1.6 1.6 0 0 1 4 6.6z"/><circle cx="16.2" cy="12" r="1.5" class="dolu"/>',
    fiil:'<path d="M13.4 2.6 5.4 13.9h5.3l-1 7.5 8.9-11.6h-5.2z"/>',
    harf:'<path d="M9.6 8.2H7.4a3.8 3.8 0 0 0 0 7.6h2.2M14.4 8.2h2.2a3.8 3.8 0 0 1 0 7.6h-2.2"/><path d="M8.6 12h6.8"/>',
    marife:'<rect x="7.2" y="8.6" width="14" height="7" rx="3.5" class="dolu"/><rect x="2.4" y="8.6" width="3.4" height="7" rx="1.7" class="dolu"/>',
    nekra:'<rect x="4" y="8.6" width="16" height="7" rx="3.5" stroke-dasharray="3.2 2.6"/><circle cx="10" cy="5.2" r="1.1" class="dolu"/><circle cx="14" cy="5.2" r="1.1" class="dolu"/>',
    sems:'<circle cx="12" cy="12" r="4.2"/><path d="M12 3.4v2.2M12 18.4v2.2M3.4 12h2.2M18.4 12h2.2M5.9 5.9l1.6 1.6M16.5 16.5l1.6 1.6M18.1 5.9l-1.6 1.6M7.5 16.5l-1.6 1.6"/>',
    kamer:'<path d="M20.2 14.9A8.7 8.7 0 1 1 9.3 4.1a6.9 6.9 0 0 0 10.9 10.8z"/>',
    erkek:'<circle cx="10" cy="14.2" r="5.2"/><path d="M14.4 9.8L20 4.2M15.6 4.2H20v4.4"/>',
    disi:'<circle cx="12" cy="9.4" r="5.2"/><path d="M12 14.6v6.2M9 18h6"/>',
    tekil:'<circle cx="12" cy="12" r="3.3" class="dolu"/>',
    ikil:'<circle cx="8.2" cy="12" r="3" class="dolu"/><circle cx="15.8" cy="12" r="3" class="dolu"/>',
    cogul:'<circle cx="5.8" cy="12" r="2.7" class="dolu"/><circle cx="12" cy="12" r="2.7" class="dolu"/><circle cx="18.2" cy="12" r="2.7" class="dolu"/>',
    kirik:'<circle cx="5.6" cy="8.6" r="2.5" class="dolu"/><circle cx="12.6" cy="15" r="2.5" class="dolu"/><circle cx="18.6" cy="8" r="2.5" class="dolu"/>',
    merfu:'<path d="M3.4 14.4h17.2"/><circle cx="11" cy="8.2" r="2.2"/><path d="M12.9 9.5c.9.9 1.9 1.1 3 .6"/>',
    mansub:'<path d="M3.4 14.4h17.2"/><path d="M8.4 9.6l7.2-3.2" stroke-width="2.8"/>',
    mecrur:'<path d="M3.4 9.6h17.2"/><path d="M8.4 17.6l7.2-3.2" stroke-width="2.8"/>',
    cezm:'<path d="M3.4 15.4h17.2"/><circle cx="12" cy="8.2" r="2.6"/>',
    masdar:'<path d="M12 21v-9.4"/><path d="M12 11.6c0-3.8 2.8-5.8 6.8-5.8 0 3.8-2.8 5.8-6.8 5.8z"/><path d="M12 14c0-2.9-2.4-4.8-5.8-4.8 0 2.9 2.4 4.8 5.8 4.8z"/>',
    kisi:'<circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c0-3.6 2.9-6.4 6.5-6.4s6.5 2.8 6.5 6.4"/>',
    hedef:'<circle cx="12" cy="12" r="7.6"/><circle cx="12" cy="12" r="2.8" class="dolu"/>',
    yildiz:'<path d="M12 3.2l2.4 5.7 6.1.5-4.7 4 1.4 6-5.2-3.2-5.2 3.2 1.4-6-4.7-4 6.1-.5z"/>',
    kiyas:'<rect x="3.6" y="13.4" width="4.4" height="6.6" rx="1.6" class="dolu"/><rect x="9.8" y="9.2" width="4.4" height="10.8" rx="1.6" class="dolu"/><rect x="16" y="4.6" width="4.4" height="15.4" rx="1.6" class="dolu"/>',
    saat:'<circle cx="12" cy="12" r="8.2"/><path d="M12 7.2V12l3.2 2.1"/>',
    alet:'<path d="M14.9 3.4a5.1 5.1 0 0 0-6.1 6.6L3.5 15.3a2.1 2.1 0 0 0 3 3l5.3-5.3a5.1 5.1 0 0 0 6.6-6.1l-2.9 2.9-2.5-2.5z"/>',
    geri:'<path d="M4.4 12a7.8 7.8 0 1 0 2.3-5.5"/><path d="M4.4 4.4v4.2h4.2"/>',
    ileri:'<path d="M19.6 12a7.8 7.8 0 1 1-2.3-5.5"/><path d="M19.6 4.4v4.2h-4.2"/>',
    unlem:'<path d="M12 3.8v10.4"/><circle cx="12" cy="19.2" r="1.7" class="dolu"/>',
    mucerred:'<rect x="4" y="8.8" width="16" height="6.6" rx="3.2"/>',
    mezid:'<rect x="2.6" y="8.8" width="11.4" height="6.6" rx="3.2"/><path d="M18.6 8.4v7.4M14.9 12.1h7.4"/>',
    goz:'<path d="M2.4 12S6 6.4 12 6.4 21.6 12 21.6 12 18 17.6 12 17.6 2.4 12 2.4 12z"/><circle cx="12" cy="12" r="2.7"/>',
    gozkapali:'<path d="M2.4 12S6 6.4 12 6.4c1.6 0 3 .4 4.2 1M21.6 12s-3.6 5.6-9.6 5.6c-1.7 0-3.2-.5-4.4-1.1"/><path d="M4.2 19.8L19.8 4.2"/>',
    saglam:'<circle cx="12" cy="12" r="8.2"/><path d="M8.3 12.3l2.6 2.6 4.8-5.2"/>',
    kirikcember:'<circle cx="12" cy="12" r="8.2" stroke-dasharray="3.6 3.2"/><path d="M8.8 12h6.4"/>',
    catal:'<path d="M12 20.4v-8.8M12 11.6L6.2 5.6M12 11.6l5.8-6"/>',
    soru:'<path d="M8.8 9a3.2 3.2 0 1 1 3.9 3.1c-1 .2-1.7 1-1.7 2v.7"/><circle cx="11.9" cy="18.6" r="1.6" class="dolu"/>',
    megafon:'<path d="M3.6 9.8v4.4h3.2l7.4 4.2V5.6L6.8 9.8H3.6z"/><path d="M17.6 9.2a4.2 4.2 0 0 1 0 5.6"/>',
    isaretp:'<path d="M5.2 3.6L19.4 10.4l-6.2 1.8-1.8 6.2z"/>'
  };
  function hxSim(a){ return '<svg class="hxs" viewBox="0 0 24 24" aria-hidden="true">' + (HXS[a] || HXS.genel) + '</svg>'; }
  var HXPIN = '<span class="hxpin" aria-hidden="true"><svg viewBox="0 0 24 31">' +
    '<ellipse class="pg" cx="12" cy="28.2" rx="4.6" ry="1.6"/>' +
    '<g class="pk"><circle class="ph" cx="12" cy="10.2" r="7.4"/>' +
    '<path class="pb" d="M12 1.8a8.4 8.4 0 0 0-8.4 8.4c0 6.2 8.4 14.4 8.4 14.4s8.4-8.2 8.4-14.4A8.4 8.4 0 0 0 12 1.8z"/>' +
    '<circle class="pi" cx="12" cy="10.2" r="3.2"/></g></svg></span>';


  /* ---------- tecvide özel simgeler ---------- */
  HXS.tecvid = '<path d="M12 7.2C10.4 5.8 8.2 5.2 5 5.2v12c3.2 0 5.4.6 7 2 1.6-1.4 3.8-2 7-2v-12c-3.2 0-5.4.6-7 2z"/><path d="M12 7.2V19.2"/>';
  HXS.med = '<path d="M3.5 12h17"/><path d="M7.4 8.2L3.5 12l3.9 3.8M16.6 8.2l3.9 3.8-3.9 3.8"/>';
  HXS.elif = '<path d="M12 4v16"/><path d="M9 20h6"/>';
  HXS.nun = '<path d="M5.2 10.8a6.8 6.8 0 0 0 13.6 0"/><circle cx="12" cy="6" r="1.5" class="dolu"/>';
  HXS.mim = '<circle cx="14.6" cy="9.4" r="3.4"/><path d="M11.4 10.6C8.8 12.6 7.4 15.6 6.6 20"/>';
  HXS.birles = '<path d="M4 5.4c4.6 0 8 2.6 8 7.2M20 5.4c-4.6 0-8 2.6-8 7.2v6.8"/><path d="M9.6 16.6L12 19.4l2.4-2.8"/>';
  HXS.don = '<path d="M5 9a7 7 0 0 1 12.4-2.6L19 8.4"/><path d="M19 4.4v4h-4"/><path d="M19 15a7 7 0 0 1-12.4 2.6L5 15.6"/><path d="M5 19.6v-4h4"/>';
  HXS.acik = '<path d="M2.4 12S6 6.4 12 6.4 21.6 12 21.6 12 18 17.6 12 17.6 2.4 12 2.4 12z"/><circle cx="12" cy="12" r="2.7"/>';
  HXS.gizli = '<path d="M2.4 12S6 6.4 12 6.4c1.6 0 3 .4 4.2 1M21.6 12s-3.6 5.6-9.6 5.6c-1.7 0-3.2-.5-4.4-1.1"/><path d="M4.2 19.8L19.8 4.2"/>';
  HXS.dudak = '<path d="M3 12c3-3.8 6-4 9-2 3-2 6-1.8 9 2-3 3.8-6 5-9 5s-6-1.2-9-5z"/><path d="M3.4 12h17.2"/>';
  HXS.kilit = '<rect x="5" y="11" width="14" height="9.4" rx="2.6"/><path d="M8.2 11V8a3.8 3.8 0 0 1 7.6 0v3"/>';
  HXS.dur = '<path d="M8.4 3h7.2L21 8.4v7.2L15.6 21H8.4L3 15.6V8.4z"/><path d="M8 12h8"/>';
  HXS.zipla = '<path d="M4 19h16"/><circle cx="12" cy="10.4" r="3.4"/><path d="M6.4 6.6L5 5.2M17.6 6.6L19 5.2M12 4.4V2.6"/>';
  HXS.dalga = '<path d="M3 12h2.2l2.2-5.2 3.4 10.4 3.2-12 3 9.4 1.8-2.6H21"/>';
  HXS.seddeli = '<path d="M5 14c1.4-3 3-3 3.8 0 .8-3 2.4-3 3.2 0 .8-3 2.4-3 3.2 0"/><path d="M5 18h14"/>';
  HXS.hemze = '<path d="M15 7.4a3.6 3.6 0 1 0-3.6 3.6H16"/><path d="M8 16.6l8-3"/>';

  /* ==========================================================
     TECVİD AĞACI — sunumlar.html'deki HXA ile aynı biçim.
     sunum: bu başlığın anlatıldığı SLAYTIN anahtarı (data-k)
     ========================================================== */
  var HXDERIN = 1;     /* kök → 5 bölüm kutusu; kurallar bölüm kutusunun içinde etiket */
  var HXA = {
    kok:{ad:'Tecvid',ik:'tecvid',ar:'تَجْوِيد',sunum:'kapak',
      g:[{ad:'Konular',d:['med','nun','mim','idgam','kalkale']}]},

    med:{ad:'Med (Uzatma)',ik:'med',ar:'مَدّ',sunum:'b-med',
      g:[{ad:'Temel kavramlar',d:['harfimed','sebebimed']},
         {ad:'Med çeşitleri',d:['tabii','muttasil','munfasil','ariz','lazim','lin']}]},
    harfimed:{ad:'Harf-i med',ik:'elif',ar:'ا و ى',sunum:'harfimed'},
    sebebimed:{ad:'Sebeb-i med',ik:'hemze',ar:'ء ـْ ـّ',sunum:'sebebimed'},
    tabii:{ad:'Medd-i Tabîî',ik:'med',sunum:'tabii'},
    muttasil:{ad:'Medd-i Muttasıl',ik:'med',sunum:'muttasil'},
    munfasil:{ad:'Medd-i Munfasıl',ik:'med',sunum:'munfasil'},
    ariz:{ad:'Medd-i Ârız',ik:'dur',sunum:'ariz'},
    lazim:{ad:'Medd-i Lâzım',ik:'kilit',sunum:'lazim'},
    lin:{ad:'Medd-i Lîn',ik:'med',sunum:'lin'},

    nun:{ad:'Sâkin nûn ve tenvin',ik:'nun',ar:'نْ ـً',sunum:'b-nun',
      g:[{ad:'Kuralları',d:['meal','bila','iklab','izhar','ihfa']}]},
    meal:{ad:'İdgâm-ı meal gunne',ik:'birles',ar:'ى م ن و',sunum:'meal'},
    bila:{ad:'İdgâm-ı bilâ gunne',ik:'birles',ar:'ل ر',sunum:'bila'},
    iklab:{ad:'İklâb',ik:'don',ar:'ب',sunum:'iklab'},
    izhar:{ad:'İzhâr',ik:'acik',ar:'ا ح خ ع غ ه',sunum:'izhar'},
    ihfa:{ad:'İhfâ',ik:'gizli',ar:'15 harf',sunum:'ihfa'},

    mim:{ad:'Sâkin mîm',ik:'mim',ar:'مْ',sunum:'b-mim',
      g:[{ad:'Hâlleri',d:['mmisleyn','sihfa','sizhar']}]},
    mmisleyn:{ad:'İdgâm-ı misleyn meal gunne',ik:'birles',ar:'مْ م',sunum:'mmisleyn'},
    sihfa:{ad:'İhfâ-i şefeviyye',ik:'dudak',ar:'مْ ب',sunum:'sihfa'},
    sizhar:{ad:'İzhâr-ı şefeviyye',ik:'dudak',ar:'مْ + 26',sunum:'sizhar'},

    idgam:{ad:'Diğer idgâmlar',ik:'birles',ar:'إِدْغَام',sunum:'b-idg',
      g:[{ad:'Çeşitleri',d:['misleyn','misleyng','mutecanis','mutekarib']}]},
    misleyn:{ad:'İdgâm-ı misleyn',ik:'seddeli',sunum:'misleyn'},
    misleyng:{ad:'Misleyn meal gunne',ik:'birles',sunum:'misleyng'},
    mutecanis:{ad:'Mütecâniseyn',ik:'birles',ar:'ت د ط · ث ذ ظ · م ب',sunum:'mutecanis'},
    mutekarib:{ad:'Mütekâribeyn',ik:'birles',ar:'ر ل · ك ق',sunum:'mutekarib'},

    kalkale:{ad:'Kalkale',ik:'zipla',ar:'ق ط ج د ب',sunum:'kalkale'}
  };
  /* ---------- ağacı bir kez çiz: tüm dallar hep açık ---------- */
  function hxAdlar(id, isaret, sunumlu){     /* derin dallar: satır içi mini liste */
    var n = HXA[id]; if(!n || !n.g) return '';
    var p = [];
    n.g.forEach(function(g){ g.d.forEach(function(c){
      var k = HXA[c]; if(!k) return;
      var ic = hxAdlarDuz(c);
      p.push('<span class="hxm'+(c===isaret?' hxburada':'')+(sunumlu&&k.sunum?' hxsunlu':'')+'" data-id="'+c+'">'+k.ad+
             (ic?' <em>('+ic+')</em>':'') + (c===isaret?HXPIN:'') +
             (sunumlu && k.sunum ? '<button class="hxsun mini" data-sunum="'+k.sunum+'" title="Sunumu aç">'+HXSUNSIM+'</button>' : '') +
             '</span>');
    }); });
    return p.length ? '<span class="hxmini">'+p.join('')+'</span>' : '';
  }
  function hxAdlarDuz(id){
    var n = HXA[id]; if(!n || !n.g) return '';
    var p = [];
    n.g.forEach(function(g){ g.d.forEach(function(c){ if(HXA[c]) p.push(HXA[c].ad); }); });
    return p.join(' · ');
  }
  /* Bir başlığın altında toplam kaç konu var? Kutunun boyu buna göre. */
  var HXSAY = {};
  function hxSay(id, d){
    if (HXSAY[id] != null) return HXSAY[id];
    if ((d || 0) > 8) return 0;
    var n = HXA[id], t = 0;
    ((n && n.g) || []).forEach(function(g){
      g.d.forEach(function(c){ if (HXA[c]) t += 1 + hxSay(c, (d || 0) + 1); });
    });
    HXSAY[id] = t;
    return t;
  }
  function hxKademe(id){
    if (id === 'kok') return 6;                       /* kök hep en iri */
    var t = hxSay(id);
    return t >= 40 ? 5 : t >= 15 ? 4 : t >= 6 ? 3 : t >= 1 ? 2 : 1;
  }
  var HXSUNSIM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.6l10 6.4-10 6.4z"/></svg>';
  function hxDugum(id, d, isaret, sunumlu){
    var n = HXA[id]; if(!n) return '';
    var dal = '';
    if (n.g && n.g.length && d < HXDERIN){
      var cd = d + 1;
      /* Çocuğun kendi dalı var mı? (ayırıcı yalnız dallı kardeşler arasına) */
      var dalli = function(c){ var x = HXA[c]; return !!(x && x.g && x.g.length && cd < HXDERIN); };
      dal = '<div class="hxgs">' + n.g.map(function(g){
        var ic = '';
        g.d.forEach(function(c, i){
          if (i && dalli(c) && dalli(g.d[i-1])) ic += '<div class="hxay" aria-hidden="true"></div>';
          ic += hxDugum(c, cd, isaret, sunumlu);
        });
        return '<div class="hxg" data-ad="'+g.ad+'" data-ust="'+n.ad+'"><span class="hxgad">'+g.ad+'</span>' +
               ic + '</div>';
      }).join('') + '</div>';
    }
    return '<div class="hxn d'+d+(id===isaret?' burada':'')+'" data-id="'+id+'">' +
      '<div class="hxb'+(sunumlu && n.sunum ? ' sunumlu' : '')+' s'+hxKademe(id)+'" data-id="'+id+'" tabindex="0">' + hxSim(n.ik) +
        '<span class="hxad">'+n.ad+'</span>' +
        (n.ar ? '<i class="hxar">'+n.ar+'</i>' : '') +
        (n.bag ? '<a class="hxbag" href="'+n.bag+'" target="_blank" rel="noopener" title="'+(n.bagAd||'Sayfayı aç')+'">'+
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 15L19 5M12 5h7v7"/>'+
          '<path d="M17.5 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h4.6"/></svg></a>' : '') +
        (d >= HXDERIN ? hxAdlar(id, isaret, sunumlu) : '') +
        (id === isaret ? HXPIN : '') +
        (sunumlu && n.sunum ? '<button class="hxsun" data-sunum="'+n.sunum+'" title="Sunumu aç">' +
           HXSUNSIM + '<span>Sunum</span></button>' : '') +
      '</div>' + dal + '</div>';
  }

  /* ---------- kamera: ölçek + kaydırma ---------- */
  function hxYer(e, tuv){
    var x=0, y=0, n=e;
    while(n && n !== tuv){ x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return {x:x, y:y, w:e.offsetWidth, h:e.offsetHeight};
  }
  function hxTemel(el){                        /* genişliğe sığdıran taban ölçek */
    var pen = el.querySelector('.hx-pencere'), tuv = el.querySelector('.hx-tuval');
    var nw = parseFloat(el.getAttribute('data-nw')) || tuv.offsetWidth;
    return Math.min(1.05, Math.max(0.3, (pen.clientWidth - 16) / Math.max(1, nw)));
  }
  /* TEK KAMERA ANİMASYONU — ölçek, tuval boyutu ve kaydırma aynı karede
     birlikte yürür. Önceden ölçek CSS geçişiyle, kaydırma ayrı bir döngüyle
     yapılıyordu; tuvalin boyutu ise anında değiştiği için tarayıcı kaydırmayı
     kırpıp sıçratıyordu. Şimdi her karede kameranın MERKEZİ (harita
     koordinatında) ve ölçek birlikte yumuşatılıyor: sıçrama yok.
     Yumuşatma easeInOut — hem başlangıç hem bitiş yumuşak. */
  function hxAzalt(){
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  }
  function hxKamera(el, k, hedef, yumusak, basaAl, dogrudan){
    var pen = el.querySelector('.hx-pencere'), olcu = el.querySelector('.hx-olcu'),
        tuv = el.querySelector('.hx-tuval');
    if (!pen || !olcu || !tuv) return;
    var nw = parseFloat(el.getAttribute('data-nw')) || tuv.offsetWidth,
        nh = parseFloat(el.getAttribute('data-nh')) || tuv.offsetHeight;
    var W = pen.clientWidth, Y = pen.clientHeight;
    var k0 = el._k || parseFloat(el.getAttribute('data-k')) || k;
    function yaz(kk, cx, cy){
      el._k = kk;
      tuv.style.transform = 'scale(' + kk + ')';
      olcu.style.width  = (nw * kk) + 'px';
      olcu.style.height = (nh * kk) + 'px';
      var enX = Math.max(0, nw * kk - W), enY = Math.max(0, nh * kk - Y);
      pen.scrollLeft = Math.max(0, Math.min(enX, cx * kk - W / 2));
      pen.scrollTop  = Math.max(0, Math.min(enY, cy * kk - Y / 2));
    }
    var c1;
    if (hedef){ var y = hxYer(hedef, tuv); c1 = { x: y.x + y.w/2, y: y.y + y.h/2 }; }
    else if (basaAl){ c1 = { x: W / (2 * k), y: Y / (2 * k) }; }   /* açılış: sol üst */
    else { c1 = { x: (pen.scrollLeft + W/2) / k0, y: (pen.scrollTop + Y/2) / k0 }; }
    /* VARIŞ MERKEZİNİ SINIRLARA OTURT: harita bitiş ölçeğinde ekrana sığıyorsa
       hedefin merkezi ulaşılamaz olur; kamera yol boyunca kenara dayanıp
       yatayda birden durur/sıçrardı. Ulaşılabilir merkeze göre yol çiziliyor. */
    (function(){
      var enX = Math.max(0, nw * k - W), enY = Math.max(0, nh * k - Y);
      var sx = Math.max(0, Math.min(enX, c1.x * k - W/2));
      var sy = Math.max(0, Math.min(enY, c1.y * k - Y/2));
      c1 = { x: (sx + W/2) / k, y: (sy + Y/2) / k };
    })();
    if (el._an){ cancelAnimationFrame(el._an); el._an = 0; }
    el.setAttribute('data-k', k);
    if (!yumusak || hxAzalt()){ yaz(k, c1.x, c1.y); return; }
    var c0 = { x: (pen.scrollLeft + W/2) / k0, y: (pen.scrollTop + Y/2) / k0 };
    var dx = c1.x - c0.x, dy = c1.y - c0.y, uzak = Math.sqrt(dx*dx + dy*dy);
    /* Uzun yol daha uzun sürsün; "Tüm harita" / "Dersin yeri" gibi haritanın bir
       ucundan öbürüne giden sıçramalar aceleye gelmesin. */
    var sure = Math.max(1000, Math.min(2400, 900 + uzak * 0.95));
    /* Ölçek DOĞRUSAL değil GEOMETRİK yumuşatılır (göz yakınlaşmayı böyle görür),
       ayrıca uzun yolda kamera ortada bir miktar geri çekilir: önce biraz
       uzaklaşıp süzülür, sonra hedefe iner — böylece yakınken ekranın önünden
       kutular hızla akıp gitmez. */
    var temel = hxTemel(el);
    /* Geri çekilme YALNIZ haritanın bambaşka bir köşesine atlarken yapılır.
       Üst başlıktan kendi alt başlığına inerken (ya da tersi) bu kötü duruyordu:
       önce uzaklaşıp sonra yaklaşıyordu. O yüzden iç içe geçişlerde çukur yok. */
    var cukur = dogrudan ? 0 : Math.min(0.55, (uzak / Math.max(1, nw)) * 1.1);
    var t0 = null;
    function adim(t){
      if (t0 === null) t0 = t;
      var o = Math.min(1, (t - t0) / sure);
      /* easeInOutSine: tepe hızı en düşük eğri — göze en akıcı gelen bu */
      var e = (1 - Math.cos(Math.PI * o)) / 2;
      var kk = k0 * Math.pow(k / k0, e);
      if (cukur > 0.02) kk = kk * (1 - cukur * Math.sin(Math.PI * e));
      if (kk < temel * 0.9) kk = temel * 0.9;
      yaz(kk, c0.x + dx * e, c0.y + dy * e);
      el._an = o < 1 ? requestAnimationFrame(adim) : 0;
    }
    el._an = requestAnimationFrame(adim);
  }
  /* Bir hedefe giden KADEME zinciri: önce onu taşıyan ana başlık (İsim gibi),
     sonra içindeki boyut kutusu (Cinsiyet gibi), en sonda kutunun kendisi.
     Böylece tek tıkta çok büyümek yerine parça parça yaklaşılır. */
  function hxZincir(hedefEl, tuv){
    if (hedefEl.classList.contains('hxn') &&
        (hedefEl.classList.contains('d0') || hedefEl.classList.contains('d1') || hedefEl.classList.contains('d2')))
      return [hedefEl];
    var z = [], n = hedefEl, guv = 0;
    while (n && n !== tuv && guv++ < 40){
      if (n.classList && (n.classList.contains('hxn') || n.classList.contains('hxg'))) z.unshift(n);
      if (n.classList && n.classList.contains('hxn') && n.classList.contains('d2')) break;
      n = n.parentNode;
    }
    return z.length ? z : [hedefEl];
  }
  function hxYaklas(el, id){
    var tuv = el.querySelector('.hx-tuval');
    var dugum = tuv.querySelector('.hxn[data-id="' + id + '"]'), mini = null;
    if (!dugum){                                        /* derin dal: mini etiket */
      mini = tuv.querySelector('.hxm[data-id="' + id + '"]');
      if (!mini) return;
      dugum = mini.closest('.hxn');
      if (!dugum) return;
    }
    hxOdakla(el, dugum, mini, id);
  }
  function hxOdakla(el, dugum, mini, bilgiId){
    var tuv = el.querySelector('.hx-tuval'), pen = el.querySelector('.hx-pencere');
    [].forEach.call(tuv.querySelectorAll('.odakli,.hxm.sec,.ata'), function(x){
      x.classList.remove('odakli'); x.classList.remove('sec'); x.classList.remove('ata'); });
    var onceki = el._odakEl;
    dugum.classList.add('odakli');
    el._odakEl = dugum;
    if (mini) mini.classList.add('sec');
    /* Odağın ÜSTÜNDEKİ kutular solmamalı: ana öğenin opaklığı çocuğunkini ezer. */
    var ust = dugum.parentNode;
    while (ust && ust !== tuv){
      if (ust.classList && ust.classList.contains('hxg')) ust.classList.add('ata');
      ust = ust.parentNode;
    }
    el.classList.add('yakin');
    var yeni = bilgiId || dugum.getAttribute('data-id') || '';
    el.setAttribute('data-odak', yeni);
    el.classList.toggle('asilKonu', !!yeni && yeni === (el.getAttribute('data-isaret') || ''));
    var t = hxTemel(el), y = hxYer(dugum, tuv);
    var k = Math.min((pen.clientWidth - 24) / Math.max(1, y.w), (pen.clientHeight - 24) / Math.max(1, y.h));
    k = Math.max(t, Math.min(2.9, k));
    var icIce = !onceki || onceki === dugum ||
                (onceki.contains && (onceki.contains(dugum) || dugum.contains(onceki)));
    hxKamera(el, k, dugum, true, false, icIce);
    var tumTus = el.querySelector('[data-tum]'); if(tumTus) tumTus.classList.remove('gizli');
  }
  function hxUzaklas(el){
    var tuv = el.querySelector('.hx-tuval');
    el._odakEl = null;
    var eski = el.getAttribute('data-odak');
    [].forEach.call(tuv.querySelectorAll('.odakli,.hxm.sec,.ata'), function(x){
      x.classList.remove('odakli'); x.classList.remove('sec'); x.classList.remove('ata'); });
    el.classList.remove('yakin');
    el.classList.remove('asilKonu');
    el.removeAttribute('data-odak');
    var hedef = eski ? tuv.querySelector('.hxn[data-id="' + eski + '"]') : null;
    hxKamera(el, hxTemel(el), hedef, true, false, true);
    var tumTus = el.querySelector('[data-tum]'); if(tumTus) tumTus.classList.add('gizli');
  }
  /* İlerleme adımları: slayt açılınca harita bütün görünür, her ileri
     basışında konunun yerine bir kademe daha yaklaşılır; son kademeden
     sonraki ileri, konunun kendi slaytına geçer. */
  function hxAdim(sl){
    if(!sl) return;
    var el = sl.querySelector('.hx'); if(!el || !el.getAttribute('data-kuruldu')) return;
    var hedef = '';
    [].forEach.call(sl.querySelectorAll('.hxadim'), function(m){
      if (m.classList.contains('gor')) hedef = m.getAttribute('data-hedef') || '';
    });
    if (hedef){ if (el.getAttribute('data-odak') !== hedef) hxYaklas(el, hedef); }
    else if (el.classList.contains('yakin')) hxUzaklas(el);
  }
  /* ---------- DOKUNSAL GEZİNME ----------
     Parmakla/fareyle sürükleyerek kaydır, iki parmakla (ya da ctrl+tekerlek /
     trackpad kıstırma) yakınlaş–uzaklaş. Sürükleme sırasında tıklama iptal
     olur, dokunuş olayları sunumun kaydırma jestine sızmaz. */
  function hxHam(el, kk, sl, st){
    var pen = el.querySelector('.hx-pencere'), olcu = el.querySelector('.hx-olcu'),
        tuv = el.querySelector('.hx-tuval');
    var nw = parseFloat(el.getAttribute('data-nw')), nh = parseFloat(el.getAttribute('data-nh'));
    el._k = kk;
    el.setAttribute('data-k', kk);
    tuv.style.transform = 'scale(' + kk + ')';
    olcu.style.width  = (nw * kk) + 'px';
    olcu.style.height = (nh * kk) + 'px';
    pen.scrollLeft = Math.max(0, Math.min(Math.max(0, nw*kk - pen.clientWidth), sl));
    pen.scrollTop  = Math.max(0, Math.min(Math.max(0, nh*kk - pen.clientHeight), st));
  }
  function hxDur(el){ if (el._an){ cancelAnimationFrame(el._an); el._an = 0; } }
  function hxDokunsal(el){
    var pen = el.querySelector('.hx-pencere');
    var nk = {}, suru = null, kis = null;
    function oran(){ var r = pen.getBoundingClientRect(); return r.width / Math.max(1, pen.clientWidth); }
    function say(){ var n = 0; for (var i in nk) if (nk.hasOwnProperty(i)) n++; return n; }
    pen.addEventListener('pointerdown', function(e){
      if (e.target.closest && e.target.closest('.hxbag')) return;
      nk[e.pointerId] = { x: e.clientX, y: e.clientY };
      hxDur(el);
      if (say() === 2){
        var d = [], i;
        for (i in nk) if (nk.hasOwnProperty(i)) d.push(nk[i]);
        kis = { u: Math.hypot(d[0].x - d[1].x, d[0].y - d[1].y) || 1, k: el._k || 1 };
        suru = null;
      } else {
        suru = { x: e.clientX, y: e.clientY, sl: pen.scrollLeft, st: pen.scrollTop, tasindi: false };
      }
    });
    pen.addEventListener('pointermove', function(e){
      if (!nk[e.pointerId]) return;
      nk[e.pointerId] = { x: e.clientX, y: e.clientY };
      var o = oran(), i, d = [];
      if (say() >= 2 && kis){
        for (i in nk) if (nk.hasOwnProperty(i)) d.push(nk[i]);
        var u = Math.hypot(d[0].x - d[1].x, d[0].y - d[1].y) || 1;
        var r = pen.getBoundingClientRect();
        var mx = ((d[0].x + d[1].x) / 2 - r.left) / o, my = ((d[0].y + d[1].y) / 2 - r.top) / o;
        var kEski = el._k || 1;
        var kYeni = Math.max(hxTemel(el) * 0.85, Math.min(3, kis.k * (u / kis.u)));
        var hx = (pen.scrollLeft + mx) / kEski, hy = (pen.scrollTop + my) / kEski;
        hxHam(el, kYeni, hx * kYeni - mx, hy * kYeni - my);
        el.classList.remove('yakin');
        return;
      }
      if (!suru) return;
      var dx = e.clientX - suru.x, dy = e.clientY - suru.y;
      if (!suru.tasindi && (Math.abs(dx) > 6 || Math.abs(dy) > 6)){
        suru.tasindi = true; pen.classList.add('suruklu');
        /* Yakalamayı ancak GERÇEK sürükleme başlayınca al: erken alınırsa
           tıklama olayı kutuya değil pencereye gidiyor ve yakınlaşma çalışmıyor. */
        try { pen.setPointerCapture(e.pointerId); } catch(x){}
      }
      if (suru.tasindi){ pen.scrollLeft = suru.sl - dx / o; pen.scrollTop = suru.st - dy / o; }
    });
    function birak(e){
      if (nk[e.pointerId]) delete nk[e.pointerId];
      if (say() < 2) kis = null;
      if (suru && suru.tasindi){ el._tasindi = 1; setTimeout(function(){ el._tasindi = 0; }, 60); }
      if (say() === 0){ suru = null; pen.classList.remove('suruklu'); }
    }
    pen.addEventListener('pointerup', birak);
    pen.addEventListener('pointercancel', birak);
    /* ctrl+tekerlek (trackpad kıstırma) ile imlecin olduğu yerden yakınlaş */
    pen.addEventListener('wheel', function(e){
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault(); hxDur(el);
      var o = oran(), r = pen.getBoundingClientRect();
      var mx = (e.clientX - r.left) / o, my = (e.clientY - r.top) / o;
      var kEski = el._k || 1;
      var kYeni = Math.max(hxTemel(el) * 0.85, Math.min(3, kEski * Math.pow(0.998, e.deltaY)));
      var hx = (pen.scrollLeft + mx) / kEski, hy = (pen.scrollTop + my) / kEski;
      hxHam(el, kYeni, hx * kYeni - mx, hy * kYeni - my);
      el.classList.remove('yakin');
    }, { passive: false });
    /* dokunuşlar sunumun sağa-sola kaydırma jestine karışmasın */
    ['touchstart','touchmove','touchend'].forEach(function(t){
      pen.addEventListener(t, function(e){ e.stopPropagation(); }, { passive: true });
    });
  }
  function hxYenile(kok){
    if(!kok) return;
    hxTasmaOlc(!!kok.querySelector('.hx'));
    [].forEach.call(kok.querySelectorAll('.hx'), function(el){
      if (!el.getAttribute('data-kuruldu')){
        el.setAttribute('data-kuruldu','1');
        var isaret = el.getAttribute('data-isaret') || '';
        el.innerHTML =
          '<div class="hx-serit">' +
          (isaret ? '<button class="hx-tus" data-derse="1">'+HXPIN+' Dersin yeri</button>' : '') +
          '<button class="hx-tus gizli" data-tum="1">Tüm harita</button></div>' +
          '<div class="hx-pencere"><div class="hx-olcu"><div class="hx-tuval">' +
            hxDugum('kok', 0, isaret, el.getAttribute('data-sunumlu') === '1') + '</div></div></div>';
        hxDokunsal(el);
        el.addEventListener('click', function(e){
          if (e.target.closest && e.target.closest('.hxbag')) return;      /* bağlantı kendi işini görsün */
          if (el._tasindi) return;                                        /* sürükleme sonrası tıklama sayılmaz */
          var sd = e.target.closest && e.target.closest('.hxsun');
          if (sd){ e.stopPropagation(); sunumAc('tecvid', anahtarNo(sd.getAttribute('data-sunum'))); return; }
          var t = e.target.closest && e.target.closest('[data-tum]');
          if (t){ hxUzaklas(el); return; }
          var dr = e.target.closest && e.target.closest('[data-derse]');
          if (dr){ hxYaklas(el, el.getAttribute('data-isaret')); return; }
          var tuv = el.querySelector('.hx-tuval');
          var m = e.target.closest && e.target.closest('.hxm');
          var b = e.target.closest && e.target.closest('.hxb');
          if (m || b){
            var mini = (m && m.getAttribute('data-id')) ? m : null;
            var dugum = (mini || b).closest('.hxn');
            if (!dugum) return;
            /* ALT BAŞLIĞA basılınca DOĞRUDAN oraya yaklaşılır — kendi alt
               konuları olan her kutu böyle. Yalnız yaprak kutularda (altında
               konu yok) kademeli yol izlenir: önce kapsayan başlık, sonra
               boyut kutusu, sonra kendisi. */
            var dnd = HXA[dugum.getAttribute('data-id')];
            if (dnd && dnd.g && dnd.g.length){
              if (el._odakEl === dugum && !(mini && !mini.classList.contains('sec')))
                hxUzaklas(el);
              else
                hxOdakla(el, dugum, mini, (mini && mini.getAttribute('data-id')) || dugum.getAttribute('data-id'));
              return;
            }
            /* ALT BAŞLIĞA basılınca DOĞRUDAN oraya yaklaşılır (altında konusu
               olan her kutu böyle). Yalnız yaprak kutularda kademeli yol
               izlenir: önce kapsayan başlık, sonra boyut kutusu, sonra kendisi. */
            var dnd = HXA[dugum.getAttribute('data-id')];
            if (dnd && dnd.g && dnd.g.length){
              if (el._odakEl === dugum && !(mini && !mini.classList.contains('sec'))) hxUzaklas(el);
              else hxOdakla(el, dugum, mini, (mini && mini.getAttribute('data-id')) || dugum.getAttribute('data-id'));
              return;
            }
            var z = hxZincir(dugum, tuv);
            var su = el._odakEl, i = z.indexOf(su);
            if (i < 0) hxOdakla(el, z[0], null, z[0].getAttribute('data-id'));
            else if (i < z.length - 1) hxOdakla(el, z[i+1], null, z[i+1].getAttribute('data-id'));
            else if (mini && !mini.classList.contains('sec'))
              hxOdakla(el, dugum, mini, mini.getAttribute('data-id'));
            else hxUzaklas(el);
            return;
          }
          if (el.classList.contains('yakin')) hxUzaklas(el);
        });
        hxOlcuAl(el);
      } else {
        hxOlcuAl(el);
      }
    });
  }
  /* Tuvalin dışında kalan yan boşlukları ölç: geniş ekranda harita oraya da uzansın. */
  function hxTasmaOlc(acik){
    var t = document.getElementById('tuval'); if(!t) return;
    if (!acik){ t.classList.remove('tasmali'); return; }
    var r = t.getBoundingClientRect();
    var k = (r.width / (t.offsetWidth || 1)) || 1;
    var artan = Math.max(0, (window.innerWidth / k - t.offsetWidth) / 2);
    t.style.setProperty('--hxTas', Math.round(artan) + 'px');
    t.classList.add('tasmali');
  }
  function hxOlcuAl(el){
    var tuv = el.querySelector('.hx-tuval'); if(!tuv) return;
    tuv.classList.add('anisiz');
    tuv.style.transform = 'scale(1)';
    el.setAttribute('data-nw', tuv.offsetWidth);
    el.setAttribute('data-nh', tuv.offsetHeight);
    var odak = el.getAttribute('data-odak');
    if (odak) hxYaklas(el, odak); else hxKamera(el, hxTemel(el), null, false, true);
  }
  window.addEventListener('resize', function(){
    var sl = document.querySelector('.slayt.aktif'); if(sl) hxYenile(sl);
  });


  function goster(yeni, geri, sonAdim){
    if(!slaytlar.length || yeni < 0 || yeni >= slaytlar.length) return;
    var eski = slaytlar[s];
    if (eski && eski !== slaytlar[yeni]) sahneleriDurdur(eski);
    slaytlar.forEach(function(sl){ sl.classList.remove('aktif','geri'); });
    s = yeni;
    var sl = slaytlar[s];
    if(geri) sl.classList.add('geri');
    sl.classList.add('aktif');
    yaziBuyut(sl); hxYenile(sl);
    [].forEach.call(sl.querySelectorAll('.sahne'), function(el){ el._basladi = false; sahneDurdur(el); sahneUygula(el, 0, true); });
    a = 0; adimUygula(); void sl.offsetWidth;
    a = sonAdim ? gruplar(sl).length : 1;
    adimUygula();
    guncelle();
  }
  function guncelle(){
    sayacEl.textContent = (s+1) + ' / ' + slaytlar.length;
    ilerleme.style.width = ((s+1)/slaytlar.length*100) + '%';
    [].forEach.call(icListe.children, function(d,i){ d.classList.toggle('simdi', i === s); });
    seritOrtala(true);
    try{ history.replaceState(null, '', '#' + aktif.dataset.s + '-' + (s+1)); }catch(e){}
  }

  /* Slayt anahtarı (data-k) → sıra numarası (1'den) */
  function anahtarNo(k){
    if (!k) return 1;
    if (/^\d+$/.test(k)) return +k;
    var hedef = sunumlar[0] ? sunumlar[0].querySelector('.slayt[data-k="' + k + '"]') : null;
    if (!hedef) return 1;
    return [].indexOf.call(sunumlar[0].querySelectorAll('.slayt'), hedef) + 1;
  }

  /* ---------- sunum aç / liste ---------- */
  function sunumAc(ad, slaytNo){
    var hedef = sunumlar.filter(function(x){ return x.dataset.s === ad; })[0] || sunumlar[0];
    sunumlar.forEach(function(x){ x.style.display = (x === hedef) ? '' : 'none'; });
    aktif = hedef;
    slaytlar = [].slice.call(hedef.querySelectorAll('.slayt'));
    listeEl.classList.remove('acik');
    icKapat();
    icListeKur();
    hxTasmaOlc(false);
    goster(Math.min(slaytlar.length, Math.max(1, slaytNo || 1)) - 1, false, false);
    tamEkranGir();
  }
  var listeGor = 'liste';
  function listeGorunum(g){
    listeGor = (g === 'harita') ? 'harita' : 'liste';
    listeEl.classList.toggle('harita', listeGor === 'harita');
    [].forEach.call(listeEl.querySelectorAll('.lsek'), function(b){
      b.classList.toggle('etkin', b.getAttribute('data-gor') === listeGor);
    });
    hxTasmaOlc(true);
    if (listeGor === 'harita') hxYenile(listeEl);
    kaydirmaIsareti();
  }
  var lizgaraEl = document.querySelector('#liste .lizgara');
  function kaydirmaIsareti(){
    if (!lizgaraEl) return;
    var kalan = lizgaraEl.scrollHeight - lizgaraEl.clientHeight - lizgaraEl.scrollTop;
    listeEl.classList.toggle('dahaVar', kalan > 4);
  }
  if (lizgaraEl) lizgaraEl.addEventListener('scroll', kaydirmaIsareti, {passive:true});
  window.addEventListener('resize', kaydirmaIsareti);
  function listeGoster(g){
    if (aktif) sahneleriDurdur(slaytlar[s]);
    sunumlar.forEach(function(x){ x.style.display = 'none'; });
    aktif = null; slaytlar = [];
    icKapat();
    listeEl.classList.add('acik');
    listeGorunum(g || listeGor);
    sayacEl.textContent = '—';
    ilerleme.style.width = '0%';
    try{ history.replaceState(null, '', location.pathname + location.search); }catch(e){}
  }
  /* SİTEYE DÖN = SEKMEYİ KAPAT (sayfa index'ten yeni sekmede açılıyor).
     Kapanmazsa ana sayfanın Değerler Eğitimi bölümüne gidilir. */
  function siteyeDon(){
    try { window.close(); } catch(e){}
    setTimeout(function(){ if(!window.closed) location.href = 'index.html#degerler-egitimi'; }, 180);
  }
  document.getElementById('dSite').addEventListener('click', siteyeDon);
  [].forEach.call(document.querySelectorAll('.lkart'), function(b){
    b.addEventListener('click', function(e){
      if (e.target.closest && e.target.closest('a')) return;          /* kartın içindeki bağlantı (İndir) kendi işini görsün */
      var dis = b.getAttribute('data-dis');
      if (dis){ window.open(dis, '_blank', 'noopener'); return; }
      sunumAc(b.dataset.git, anahtarNo(b.getAttribute('data-k')));
    });
  });
  [].forEach.call(document.querySelectorAll('.lsek'), function(b){
    b.addEventListener('click', function(){ listeGorunum(b.getAttribute('data-gor')); });
  });
  [].forEach.call(document.querySelectorAll('.lkume'), function(k){
    var y = k.querySelector('.lksay'); if (!y) return;
    var n = k.querySelectorAll('.lkart').length;
    y.textContent = n ? n + ' ' + (k.getAttribute('data-birim') || 'öge') : 'yakında';
  });

  /* ---------- İÇİNDEKİLER: küçük slayt önizlemeleri ---------- */
  function icListeKur(){
    icListe.innerHTML = '';
    slaytlar.forEach(function(sl,i){
      var d = document.createElement('button');
      d.className = 'icOge onizleme';
      var kutu = document.createElement('div');
      kutu.className = 'onizKutu';
      var klon = sl.cloneNode(true);
      klon.classList.add('aktif');
      klon.style.animation = 'none';
      [].forEach.call(klon.querySelectorAll('.adim'), function(e){ e.classList.add('gor'); });
      klon.setAttribute('data-a', gruplar(sl).length || 1);
      [].forEach.call(klon.querySelectorAll('.soru'), function(e){ e.classList.add('acik'); });
      /* önizlemede sahneler SON durumunda dursun */
      [].forEach.call(klon.querySelectorAll('.sahne'), function(el){ el._hz = null; sahneUygula(el, sahneHazirla(el).n - 1, true); });
      /* önizlemedeki canlı harita boş kalmasın: kutusu gizlenir, yerine ad yazılır */
      [].forEach.call(klon.querySelectorAll('.hx'), function(h){ h.removeAttribute('data-kuruldu'); h.innerHTML = ''; });
      [].forEach.call(klon.querySelectorAll('[id]'), function(e){ e.removeAttribute('id'); });
      kutu.appendChild(klon);
      var et = document.createElement('span');
      et.className = 'onizAd';
      et.innerHTML = '<b>' + (i+1) + '</b> ' + (sl.getAttribute('data-ad') || ('Slayt ' + (i+1)));
      d.appendChild(kutu); d.appendChild(et);
      d.addEventListener('click', function(){ icKapat(); goster(i,false,false); });
      icListe.appendChild(d);
    });
  }

  /* ---------- gezinme ---------- */
  function ileri(){
    if(!aktif) return;
    var n = gruplar(slaytlar[s]).length;
    if(a < n){ a++; adimUygula(); }
    else if(s < slaytlar.length-1){ goster(s+1,false,false); }
  }
  function geriGit(){
    if(!aktif) return;
    if(a > 1){ a--; adimUygula(); }
    else if(s > 0){ goster(s-1,true,true); }
  }

  /* ---------- ÇIKIŞ (onaylı) ---------- */
  var listedenCikis = false;
  function cikisSor(){
    listedenCikis = !aktif;
    document.getElementById('onayNere').textContent = listedenCikis
      ? 'siteye' : (listeGor === 'harita' ? 'tecvid haritasına' : 'tecvid sayfasına');
    onayEl.classList.add('acik');
  }
  document.getElementById('oVaz').addEventListener('click', function(){ onayEl.classList.remove('acik'); });
  document.getElementById('oCik').addEventListener('click', function(){
    onayEl.classList.remove('acik');
    icKapat();
    if(listedenCikis){ siteyeDon(); return; }
    tamEkranCik();
    listeGoster();
  });

  /* ---------- ölçekleme ---------- */
  function olcekle(){
    var k = Math.min(window.innerWidth/1280, window.innerHeight/720);
    tuval.style.transform = 'scale(' + k + ')';
  }
  window.addEventListener('resize', olcekle); olcekle();

  /* ---------- klavye ---------- */
  document.addEventListener('keydown', function(e){
    if(onayEl.classList.contains('acik')){
      if(e.key === 'Escape'){ onayEl.classList.remove('acik'); }
      return;
    }
    if(e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); ileri(); }
    else if(e.key === 'ArrowLeft' || e.key === 'PageUp'){ e.preventDefault(); geriGit(); }
    else if(e.key === 'Home'){ e.preventDefault(); goster(0,false,false); }
    else if(e.key === 'End'){ e.preventDefault(); goster(slaytlar.length-1,false,true); }
    else if(e.key === 'o' || e.key === 'O'){ if(aktif) icDegistir(false); }
    else if(e.key === 'f' || e.key === 'F'){ tamEkran(); }
    else if(e.key === 'Escape'){
      if(icPanel.classList.contains('acik')) icKapat();
      else if(aktif) icAc(true);
      else cikisSor();
    }
  });

  /* ---------- kumanda ---------- */
  document.getElementById('dOnce').addEventListener('click', geriGit);
  document.getElementById('dSonra').addEventListener('click', ileri);
  document.getElementById('dIcindekiler').addEventListener('click', function(){ if(aktif) icDegistir(false); });
  document.getElementById('dTam').addEventListener('click', tamEkran);
  document.getElementById('dCikis').addEventListener('click', cikisSor);
  document.getElementById('seritKapat').addEventListener('click', icKapat);
  function tamEkran(){
    var d = document.documentElement;
    if(!document.fullscreenElement){ (d.requestFullscreen || d.webkitRequestFullscreen || function(){}).call(d); }
    else{ (document.exitFullscreen || document.webkitExitFullscreen || function(){}).call(document); }
  }
  function tamEkranGir(){
    try{
      if(document.fullscreenElement) return;
      var d = document.documentElement;
      var f = d.requestFullscreen || d.webkitRequestFullscreen;
      if(!f) return;
      var p = f.call(d);
      if(p && p.catch) p.catch(function(){});
    }catch(e){}
  }
  function tamEkranCik(){
    try{
      if(!document.fullscreenElement && !document.webkitFullscreenElement) return;
      (document.exitFullscreen || document.webkitExitFullscreen || function(){}).call(document);
    }catch(e){}
  }
  function tamEkranIsaretle(){
    document.body.classList.toggle('tamekran', !!(document.fullscreenElement || document.webkitFullscreenElement));
  }
  document.addEventListener('fullscreenchange', tamEkranIsaretle);
  document.addEventListener('webkitfullscreenchange', tamEkranIsaretle);
  tamEkranIsaretle();
  /* Tam ekrandan çıkıldıysa slayda dokununca geri gir (kumanda, çıkış, PDF bağlantısı hariç). */
  document.addEventListener('click', function(e){
    if(!aktif) return;
    if(document.fullscreenElement || document.webkitFullscreenElement) return;
    if(onayEl && onayEl.classList.contains('acik')) return;
    var t = e.target;
    if(t && t.closest && t.closest('#kumanda, #dCikis, #onay, a')) return;
    tamEkranGir();
  }, true);

  /* ---------- fare hareketiyle kumanda ---------- */
  var zaman;
  var cikisDug = document.getElementById('dCikis');
  document.addEventListener('mousemove', function(){
    kumanda.classList.add('gorunur'); yardim.classList.add('gor'); cikisDug.classList.add('gorunur');
    clearTimeout(zaman);
    zaman = setTimeout(function(){
      kumanda.classList.remove('gorunur'); yardim.classList.remove('gor'); cikisDug.classList.remove('gorunur');
    }, 2200);
  });

  /* ---------- dokunmatik ---------- */
  var bx=0, by=0;
  tuval.addEventListener('touchstart', function(e){ bx=e.changedTouches[0].clientX; by=e.changedTouches[0].clientY; }, {passive:true});
  tuval.addEventListener('touchend', function(e){
    var dx=e.changedTouches[0].clientX-bx, dy=e.changedTouches[0].clientY-by;
    if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)){ dx<0 ? ileri() : geriGit(); }
  }, {passive:true});

  /* ---------- tecvid haritası: bölüme dokununca oraya git ---------- */
  document.addEventListener('click', function(e){
    var d = e.target.closest && e.target.closest('.rm-dugum');
    if (!d || d.closest('.onizKutu') || !aktif) return;
    goster(anahtarNo(d.getAttribute('data-k')) - 1, false, false);
  });

  /* ---------- bil bakalım kartları ---------- */
  document.addEventListener('click', function(e){
    if(!e.target.closest) return;
    var k = e.target.closest('.soru');
    if(k && !k.closest('.onizKutu')) k.classList.toggle('acik');
    var d = e.target.closest('.mdug');
    if(d){
      var izg = d.closest('.slayt').querySelectorAll('.soru');
      [].forEach.call(izg, function(x){ x.classList.toggle('acik', d.dataset.is === 'ac'); });
    }
  });

  /* ---------- açılış ---------- */
  var isim = par.get('s') || (location.hash || '').replace('#','').split('-')[0];
  var no = parseInt(((location.hash||'').split('-')[1] || par.get('n') || '1'), 10) || 1;
  if (par.get('k')) no = anahtarNo(par.get('k'));
  var acilis = (par.get('gorunum') === 'harita') ? 'harita' : 'liste';
  if(isim && sunumlar.some(function(x){ return x.dataset.s === isim; })) { listeGor = acilis; sunumAc(isim, no); }
  else listeGoster(acilis);
  yardim.classList.add('gor');
  setTimeout(function(){ yardim.classList.remove('gor'); }, 4200);
})();
