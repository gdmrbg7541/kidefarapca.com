/* Tüm animasyonlar el yazması — tek rAF döngüsü + sticky scrub. */
try{ sessionStorage.setItem('kidefVitrin','1'); }catch(e){}
const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);
const kirp = (v,a,b) => Math.max(a, Math.min(b, v));
const ara = (a,b,t) => a + (b-a)*t;
const eV = t => t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;

let sY = 0, hedefY = 0, vh = innerHeight;
addEventListener('scroll', ()=>{ hedefY = scrollY; }, {passive:true});
addEventListener('resize', ()=>{ vh = innerHeight; boyutlaTuvaller(); etiketYerlestir(); });

function perdeP(el){
  const r = el.getBoundingClientRect();
  const toplam = el.offsetHeight - vh;
  return toplam <= 0 ? 0 : kirp(-r.top / toplam, 0, 1);
}

const okCubuk = $('okCubuk');
const noktalar = [...document.querySelectorAll('#noktalar a')];
const bolumler = noktalar.map(a => $(a.dataset.hedef));

/* ============ 1 · HERO: harf yağmuru (açık zemin tonları) ============ */
const heroT = $('heroTuval'), hCtx = heroT.getContext('2d');
const HARFLER = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
let tanecikler = [];
function heroKur(){
  tanecikler = Array.from({length: innerWidth < 640 ? 36 : 80}, () => ({
    x: Math.random()*heroT.width, y: Math.random()*heroT.height,
    h: HARFLER[Math.floor(Math.random()*HARFLER.length)],
    b: 18 + Math.random()*30, hiz: .15 + Math.random()*.4,
    sal: Math.random()*Math.PI*2, alfa: .16 + Math.random()*.24,
    ton: Math.random() < .25 ? '#F39C12' : '#16A085'
  }));
}
function heroCiz(zaman, kayHiz){
  hCtx.clearRect(0,0,heroT.width,heroT.height);
  for (const t of tanecikler){
    t.y -= t.hiz + kayHiz*.12;
    t.x += Math.sin(zaman*.0006 + t.sal)*.3;
    if (t.y < -40){ t.y = heroT.height + 40; t.x = Math.random()*heroT.width; }
    hCtx.globalAlpha = t.alfa;
    hCtx.fillStyle = t.ton;
    hCtx.font = t.b + "px 'Arakom', 'Amiri', serif";
    hCtx.fillText(t.h, t.x, t.y);
  }
  hCtx.globalAlpha = 1;
}
(function(){
  const b = $('heroBaslik');
  const bol = (s, sinif, kayma) => [...s].map((h,i) =>
    h===' ' ? ' ' : '<span class="harf'+(sinif?' '+sinif:'')+'" style="--i:'+(i+kayma)+'">'+h+'</span>').join('');
  const s1 = 'Marka değil, Misyon:', s2 = 'Kidef Arapça';
  b.innerHTML = bol(s1,'soluk',0) + '<br>' + bol(s2,'',s1.length+2);
})();

/* ============ 2 · ALFABE DUVARI ============ */
const alfabeDuvar = $('alfabeDuvar');
HARFLER.forEach(h => { const s=document.createElement('span'); s.textContent=h; alfabeDuvar.appendChild(s); });
const duvarHarfleri = [...alfabeDuvar.children];
const alfabeSayacB = document.querySelector('#alfabeSayac b');

/* ============ 3 · KELİME FABRİKASI ============ */
const KALIPLAR = [
  {vezin:'فاعِل',    ar:'كاتِب',    tr:'yazar'},
  {vezin:'مَفْعول',  ar:'مَكْتوب',  tr:'mektup'},
  {vezin:'فِعال',    ar:'كِتاب',    tr:'kitap'},
  {vezin:'مَفْعَل',  ar:'مَكْتَب',  tr:'masa / büro'},
  {vezin:'مَفْعَلة', ar:'مَكْتَبة', tr:'kütüphane'}
];
const dovmeKap = $('dovme');
KALIPLAR.forEach(k => {
  const d = document.createElement('div'); d.className='kelime';
  d.innerHTML = '<div class="ar arabic">'+k.ar+'</div><div class="tr">'+k.tr+'</div>';
  dovmeKap.appendChild(d);
});
const kelimeler = [...dovmeKap.children];

function carkYolu(R, r, dis){
  const adim = Math.PI*2/dis, yari = adim*.5; let p='';
  for(let i=0;i<dis;i++){
    const a = i*adim;
    const u1=a, u2=a+yari*.35, u3=a+yari*.65, u4=a+yari, v2=a+adim;
    p += (i?'L':'M') + (Math.cos(u1)*r)+','+(Math.sin(u1)*r)+' ';
    p += 'L'+(Math.cos(u2)*R)+','+(Math.sin(u2)*R)+' L'+(Math.cos(u3)*R)+','+(Math.sin(u3)*R)+' ';
    p += 'L'+(Math.cos(u4)*r)+','+(Math.sin(u4)*r)+' L'+(Math.cos(v2)*r)+','+(Math.sin(v2)*r)+' ';
  }
  return p+'Z';
}
function carkSvg(R, r, dis, renk){
  const b = R+4;
  return '<svg width="'+(b*2)+'" height="'+(b*2)+'" viewBox="'+(-b)+' '+(-b)+' '+(b*2)+' '+(b*2)+'">' +
    '<g class="cark"><path d="'+carkYolu(R,r,dis)+'" fill="rgba(255,255,255,.85)" stroke="'+renk+'" stroke-width="2"/>' +
    '<circle r="'+(r*.55)+'" fill="none" stroke="'+renk+'" stroke-width="2" opacity=".7"/>' +
    '<circle r="7" fill="#F39C12"/>' +
    Array.from({length:4},(_,i)=>'<line x1="0" y1="0" x2="'+(Math.cos(i*Math.PI/2)*r*.55)+'" y2="'+(Math.sin(i*Math.PI/2)*r*.55)+'" stroke="'+renk+'" stroke-width="2" opacity=".5"/>').join('') +
    '</g></svg>';
}
const carkSolK = $('carkSol'), carkSagK = $('carkSag');
const kucukCark = innerWidth < 640;
carkSolK.innerHTML = carkSvg(kucukCark?44:86, kucukCark?32:64, 12, 'rgba(22,160,133,.75)') +
                     carkSvg(kucukCark?26:52, kucukCark?18:38, 8,  'rgba(243,156,18,.7)');
carkSagK.innerHTML = carkSvg(kucukCark?44:86, kucukCark?32:64, 12, 'rgba(22,160,133,.75)') +
                     carkSvg(kucukCark?26:52, kucukCark?18:38, 8,  'rgba(243,156,18,.7)');
carkSolK.children[1].style.marginTop = '-14px'; carkSolK.children[1].style.marginLeft = '46%';
carkSagK.children[1].style.marginTop = '-14px'; carkSagK.children[1].style.marginRight = '46%';
const carklar = [...document.querySelectorAll('.cark')];

const kadran = $('kadran'), halka = $('kadranHalka');
const etiketler = KALIPLAR.map((k,i)=>{
  const e = document.createElement('div'); e.className='vezin-etiket';
  e.innerHTML = '<i>'+k.vezin+'</i>'; halka.appendChild(e); return e;
});
function etiketYerlestir(){
  const R = kadran.offsetWidth/2 * .78;
  etiketler.forEach((e,i)=>{
    e.style.transform = 'translate(-50%,-50%) rotate('+(i*72)+'deg) translateY('+(-R)+'px)';
  });
}
etiketYerlestir();

/* kökten ağaca: 12 kök (uçtan gövdeye, aşağıdan yukarı) → kalın gövde → dallanan taç → kelime yaprakları */
(function(){
  const AILELER = [
    {harfler:['ك','ت','ب'], tipX:[402,374,346], renk:'#16A085', acik:'#E6FAF5', hub:[326,214],
     sozler:[['كاتِب',356,66],['مَكْتوب',410,128],['كِتاب',344,182],['مَكْتَب',406,246],['مَكْتَبة',356,306]]},
    {harfler:['ع','ل','م'], tipX:[302,274,246], renk:'#48c9b0', acik:'#EAFBF7', hub:[258,204],
     sozler:[['عالِم',246,50],['مَعْلوم',296,112],['عِلْم',228,168],['تَعْليم',292,232],['مُعَلِّم',240,296]]},
    {harfler:['ف','ت','ح'], tipX:[178,150,122], renk:'#F39C12', acik:'#FFF6E3', hub:[152,208],
     sozler:[['فاتِح',152,62],['مَفْتوح',100,124],['مِفْتاح',172,180],['فَتْح',96,240],['اِفْتِتاح',160,302]]},
    {harfler:['د','ر','س'], tipX:[94,66,38], renk:'#2c3e50', acik:'#ECF0F5', hub:[84,232],
     sozler:[['دارِس',52,100],['مَدْروس',94,158],['دَرْس',36,218],['مُدَرِّس',96,278],['مَدْرَسة',54,336]]}
  ];
  const GX = 220, GA = 640, GT = 372;   /* gövde x, alt, tepe */
  const GOLGE = [ [220,185,140,'rgba(22,160,133,.13)'], [365,170,88,'rgba(72,201,176,.18)'],
    [265,160,90,'rgba(22,160,133,.15)'], [135,175,90,'rgba(72,201,176,.18)'],
    [62,225,78,'rgba(22,160,133,.15)'], [215,70,70,'rgba(72,201,176,.16)'], [210,300,85,'rgba(22,160,133,.12)'] ];
  let kokler='', harfler='', govde='', dallar='', yapraklar='';
  /* kökler: UÇTAN gövdeye çizilir → animasyon aşağıdan yukarı akar */
  AILELER.forEach((a,ai)=>{
    a.tipX.forEach((tx,i)=>{
      const ty = 850 + (i===1 ? 16 : 0) - ai*2;
      kokler += '<path class="cizgi agac-kok" pathLength="100" stroke-width="2.6" d="M'+tx+','+ty+
        ' C'+((GX+tx)/2)+','+(ty-110)+' '+GX+',710 '+GX+','+GA+'"/>';
      harfler += '<text class="kok-yazi" x="'+tx+'" y="'+(ty+26)+'" font-size="21" fill="'+a.renk+'" text-anchor="middle">'+a.harfler[i]+'</text>';
    });
  });
  /* gövde: alttan yukarı, kalından inceye 3 parça */
  govde += '<path class="cizgi agac-govde" pathLength="100" stroke-width="17" d="M'+GX+','+GA+' C216,600 224,560 220,520"/>';
  govde += '<path class="cizgi agac-govde" pathLength="100" stroke-width="12" d="M220,520 C218,480 224,450 221,440"/>';
  govde += '<path class="cizgi agac-govde" pathLength="100" stroke-width="9"  d="M221,440 C219,415 222,392 220,'+GT+'"/>';
  /* ana kollar: gövde tepesinden aile merkezine, kalın→ince iki parça */
  AILELER.forEach(a=>{
    const [hx,hy]=a.hub, mx=(220+hx)/2, my=(GT+hy)/2 - 24;
    dallar += '<path class="cizgi agac-dal" pathLength="100" stroke-width="6.5" d="M220,'+GT+' Q'+mx+','+(my+18)+' '+((220+hx)/2)+','+((GT+hy)/2)+'"/>';
    dallar += '<path class="cizgi agac-dal" pathLength="100" stroke-width="4" d="M'+((220+hx)/2)+','+((GT+hy)/2)+' Q'+((mx+hx)/2)+','+((my+hy)/2)+' '+hx+','+hy+'"/>';
    /* her kelimeye kendi ince dalı */
    a.sozler.forEach((s,si)=>{
      const lx=s[1], ly=s[2];
      const ax = lx + (hx-lx)*.3, ay = ly + (hy-ly)*.3;
      const px = (hx+ax)/2 + (si%2 ? 12 : -12), py = (hy+ay)/2 + (si%2 ? -8 : 8);
      dallar += '<path class="cizgi agac-ince" pathLength="100" stroke-width="2" d="M'+hx+','+hy+' Q'+px+','+py+' '+ax+','+ay+'"/>';
      /* özel yaprak: damarlı, kelimeli */
      const don = [-8,7,-5,6,-3][si];
      yapraklar += '<g transform="translate('+lx+','+ly+') rotate('+don+')"><g class="soz-yaprak">' +
        '<path d="M-44,0 Q-22,-18 0,-18 Q27,-18 44,0 Q27,18 0,18 Q-22,18 -44,0 Z" fill="'+a.acik+'" stroke="'+a.renk+'" stroke-width="1.8"/>' +
        '<line x1="-36" y1="0" x2="36" y2="0" stroke="'+a.renk+'" stroke-width="1" opacity=".3"/>' +
        '<text y="6" font-size="17" fill="'+a.renk+'" text-anchor="middle">'+s[0]+'</text>' +
        '</g></g>';
    });
    /* süs dalcıkları */
    dallar += '<path class="cizgi agac-ince" pathLength="100" stroke-width="1.6" d="M'+hx+','+hy+' q10,-26 6,-44"/>';
    dallar += '<path class="cizgi agac-ince" pathLength="100" stroke-width="1.6" d="M'+hx+','+hy+' q-14,-20 -26,-30"/>';
  });
  document.getElementById('agac').innerHTML =
  '<svg viewBox="0 0 460 900">' +
    GOLGE.map(g=>'<circle class="yaprak" cx="'+g[0]+'" cy="'+g[1]+'" r="'+g[2]+'" fill="'+g[3]+'"/>').join('') +
    kokler + govde + dallar + harfler + yapraklar +
  '</svg>';
})();
const agacEl = $('agac');
const agacKokler = [...agacEl.querySelectorAll('.agac-kok')];
const agacGovdeler = [...agacEl.querySelectorAll('.agac-govde')];
const agacDallar = [...agacEl.querySelectorAll('.agac-dal')];
const agacInceler = [...agacEl.querySelectorAll('.agac-ince')];
const agacYapraklar = [...agacEl.querySelectorAll('.yaprak')];
const agacYazilar = [...agacEl.querySelectorAll('.kok-yazi')];
const agacSozler = [...agacEl.querySelectorAll('.soz-yaprak')];
function cizEl(el, t){ el.style.strokeDashoffset = 100 * (1 - kirp(t, 0, 1)); }

function kokGuncelle(p){
  const giris = eV(kirp(p/.12, 0, 1));
  kadran.style.opacity = giris;
  kadran.style.transform = 'scale(' + ara(.65, 1, giris) + ')';
  const p2 = kirp((p-.15)/.8, 0, 1);
  const DON = eV(p2) * 288;
  halka.style.transform = 'rotate(' + (-DON) + 'deg)';
  const aktifIdx = Math.round(DON/72);
  etiketler.forEach((e,i)=>{
    e.firstChild.style.transform = 'rotate(' + (DON - i*72) + 'deg)';
    e.classList.toggle('aktif', i === kirp(aktifIdx,0,4));
  });
  carklar.forEach((c,i)=>{
    const oran = (i%2===0) ? 1.4 : -2.1;
    c.style.transform = 'rotate(' + (DON*oran + (i*13)) + 'deg)';
  });
  kelimeler.forEach((k,i)=>{ k.classList.toggle('actik', DON >= i*72 - 1); });
  /* ağaç aşağıdan yukarıya büyür: harfler → kökler → gövde → kollar → ince dallar → yapraklar */
  const tp = kirp((p-.42)/.58, 0, 1);
  agacEl.style.opacity = tp > 0 ? .85 : 0;
  agacYazilar.forEach((y,i)=> y.classList.toggle('gel', tp > .01 + i*.006));
  agacKokler.forEach((k,i)=> cizEl(k, (tp - .03 - i*.008)/.14));
  agacGovdeler.forEach((g,i)=> cizEl(g, (tp - .18 - i*.06)/.1));
  agacDallar.forEach((d,i)=> cizEl(d, (tp - .38 - i*.018)/.12));
  agacInceler.forEach((d,i)=> cizEl(d, (tp - .52 - i*.007)/.1));
  agacYapraklar.forEach((y,i)=> y.classList.toggle('gel', tp > .45 + i*.02));
  agacSozler.forEach((s,i)=> s.classList.toggle('gel', tp > .62 + i*.014));
}

/* ============ 4 · OYUN SAHASI ============ */
const oyunT = $('oyunTuval'), oCtx = oyunT.getContext('2d');
let toplar = [];
function oyunKur(){
  toplar = Array.from({length: innerWidth < 640 ? 8 : 14}, () => ({
    x: Math.random()*oyunT.width, y: -60 - Math.random()*400,
    r: 18 + Math.random()*20, vy: 0, vx: (Math.random()-.5)*1.4,
    h: HARFLER[Math.floor(Math.random()*HARFLER.length)],
    ton: Math.random() < .5 ? '22,160,133' : '243,156,18',
    z: .55 + Math.random()*.45
  }));
}
function oyunCiz(){
  oCtx.clearRect(0,0,oyunT.width,oyunT.height);
  const zemin = oyunT.height - 20;
  for (const t of toplar){
    t.vy += .16 * t.z; t.y += t.vy; t.x += t.vx;
    if (t.y + t.r > zemin){ t.y = zemin - t.r; t.vy *= -.82; }
    if (t.x < t.r || t.x > oyunT.width - t.r) t.vx *= -1;
    oCtx.beginPath(); oCtx.arc(t.x, t.y, t.r, 0, 7);
    oCtx.fillStyle = 'rgba('+t.ton+',.08)'; oCtx.fill();
    oCtx.strokeStyle = 'rgba('+t.ton+',.30)'; oCtx.stroke();
    oCtx.fillStyle = 'rgba(44,62,80,.55)';
    oCtx.font = (t.r*.95) + "px 'Arakom', 'Amiri', serif";
    oCtx.textAlign='center'; oCtx.textBaseline='middle';
    oCtx.fillText(t.h, t.x, t.y);
  }
}
/* --- özel SVG üreticiler --- */
/* lunapark: dönen dolap + çadır + bayrak */
(function(){
  let kabin='', jant='';
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4, x=95+Math.cos(a)*50, y=78+Math.sin(a)*50;
    jant += '<line x1="95" y1="78" x2="'+x+'" y2="'+y+'" stroke="#2c3e50" stroke-width="2" opacity=".55"/>';
    kabin += '<circle cx="'+x+'" cy="'+y+'" r="8" fill="'+(i%2?'#F39C12':'#16A085')+'" stroke="#ffffff" stroke-width="2.5"/>';
  }
  document.getElementById('lunapark').innerHTML =
  '<svg width="360" height="160" viewBox="0 0 380 160">' +
    '<line x1="70" y1="150" x2="95" y2="82" stroke="#2c3e50" stroke-width="4" stroke-linecap="round"/>' +
    '<line x1="120" y1="150" x2="95" y2="82" stroke="#2c3e50" stroke-width="4" stroke-linecap="round"/>' +
    '<g id="ddCark"><circle cx="95" cy="78" r="50" fill="none" stroke="#2c3e50" stroke-width="3"/>'+jant+kabin+
    '<circle cx="95" cy="78" r="7" fill="#FFC107" stroke="#2c3e50" stroke-width="2"/></g>' +
    '<line x1="230" y1="150" x2="368" y2="150" stroke="#E9EEF5" stroke-width="4" stroke-linecap="round"/>' +
    '<line x1="40" y1="150" x2="150" y2="150" stroke="#E9EEF5" stroke-width="4" stroke-linecap="round"/>' +
    '<rect x="240" y="92" width="112" height="58" rx="6" fill="#ffffff" stroke="#E9EEF5" stroke-width="2"/>' +
    '<path d="M232,92 L296,48 L360,92 Z" fill="#FFC107"/>' +
    '<path d="M252,92 L296,61 L340,92 Z" fill="#F39C12"/>' +
    '<rect x="286" y="116" width="20" height="34" rx="3" fill="#E6FAF5" stroke="#48c9b0" stroke-width="2"/>' +
    '<line x1="296" y1="48" x2="296" y2="26" stroke="#2c3e50" stroke-width="2.5"/>' +
    '<path d="M296,26 L318,32 L296,39 Z" fill="#16A085"/>' +
  '</svg>';
})();
function tacSvg(x,y,renk){
  return '<g transform="translate('+x+','+y+')"><g class="tac-g">' +
    '<path d="M0,16 L3,5 L8,12 L13,0 L18,12 L23,5 L26,16 Z" fill="'+renk+'"/>' +
    '<rect x="0" y="17" width="26" height="4" rx="2" fill="'+renk+'"/></g></g>';
}
function dalgaMotif(){  // deniz motifi
  return '<g opacity=".35"><path d="M20,268 q20,-14 40,0 t40,0 t40,0 t40,0 t40,0" fill="none" stroke="#48c9b0" stroke-width="3"/>' +
    '<path d="M20,282 q20,-12 40,0 t40,0 t40,0 t40,0 t40,0" fill="none" stroke="#16A085" stroke-width="2.5" opacity=".7"/></g>';
}
function gunesMotif(){  // güneş motifi
  let isik='';
  for(let i=0;i<10;i++){ const a=i*Math.PI/5;
    isik += '<line x1="'+(215+Math.cos(a)*22)+'" y1="'+(52+Math.sin(a)*22)+'" x2="'+(215+Math.cos(a)*31)+'" y2="'+(52+Math.sin(a)*31)+'" stroke="#FFC107" stroke-width="3" stroke-linecap="round"/>'; }
  return '<g opacity=".55"><circle cx="215" cy="52" r="15" fill="#FFC107" opacity=".8"/>'+isik+'</g>';
}
function takimSvg(sinif, renk, renk2, motif){
  const uyeler = [0,1,2,3].map(i=>{
    const uzunSac = (i%2===1);
    return '<g transform="translate('+(40+i*60)+',134) scale(1.22)"><g class="uye-g">' +
    /* saç (arka daire) + uzun saçta yan lüleler */
    '<circle cx="0" cy="-13" r="11" fill="#2c3e50"/>' +
    (uzunSac ? '<path d="M-11,-14 q-3.5,9 -1.5,15 l4.5,0 q-2,-8 -0.5,-13 Z" fill="#2c3e50"/>' +
               '<path d="M11,-14 q3.5,9 1.5,15 l-4.5,0 q2,-8 0.5,-13 Z" fill="#2c3e50"/>' : '') +
    /* yüz */
    '<circle cx="0" cy="-11" r="9.6" fill="#FFDFC0"/>' +
    '<circle cx="-3.4" cy="-11.5" r="1.15" fill="#2c3e50"/>' +
    '<circle cx="3.4" cy="-11.5" r="1.15" fill="#2c3e50"/>' +
    '<path d="M-3,-7.4 q3,2.8 6,0" fill="none" stroke="#2c3e50" stroke-width="1.4" stroke-linecap="round"/>' +
    /* gömlek (takım rengi) + yaka */
    '<path class="gomlek" d="M-16,27 v-4 a16,16 0 0 1 32,0 v4 Z"/>' +
    '<path d="M-4,8.5 L0,13 L4,8.5" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    /* koltukta kitap */
    '<g transform="rotate(-10 13 18)"><rect x="8" y="12" width="11" height="14" rx="1.6" fill="#FFC107" stroke="#2c3e50" stroke-width="1.4"/>' +
    '<line x1="13.5" y1="12.5" x2="13.5" y2="25.5" stroke="#ffffff" stroke-width="1.4"/></g>' +
    '</g></g>';
  }).join('');
  return '<svg class="'+sinif+'" width="260" height="310" viewBox="0 0 260 310">' +
    '<rect x="4" y="4" width="252" height="302" rx="20" fill="#ffffff" stroke="#E9EEF5"/>' +
    motif +
    uyeler +
    '<rect x="30" y="208" width="200" height="12" rx="6" fill="#E9EEF5"/>' +
    '<rect class="skorCubuk" x="30" y="208" width="0" height="12" rx="6" fill="'+renk2+'"/>' +
    '<text class="puanYazi" x="130" y="262" text-anchor="middle" font-size="26" fill="#2c3e50"></text>' +
    tacSvg(160, 238, renk) +
    '</svg>';
}
$('takimA').innerHTML = takimSvg('tA','#16A085','#48c9b0', dalgaMotif());
$('takimB').innerHTML = takimSvg('tB','#F39C12','#FFC107', gunesMotif());
const svgA = $('takimA').firstChild, svgB = $('takimB').firstChild;
const uyelerA = [...svgA.querySelectorAll('.uye-g')], uyelerB = [...svgB.querySelectorAll('.uye-g')];
const skorA = svgA.querySelector('.skorCubuk'), skorB = svgB.querySelector('.skorCubuk');
const puanA = svgA.querySelector('.puanYazi'), puanB = svgB.querySelector('.puanYazi');
const tacA = svgA.querySelector('.tac-g'), tacB = svgB.querySelector('.tac-g');

/* kum saati: üst hazne boşalır, alt hazne dolar */
$('kumKart').innerHTML = '<svg width="220" height="310" viewBox="0 0 220 310">' +
  '<defs>' +
  '<linearGradient id="kumG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC107"/><stop offset="1" stop-color="#F39C12"/></linearGradient>' +
  '<clipPath id="ustCam"><path d="M72,74 L148,74 C148,112 122,138 112,148 L108,148 C98,138 72,112 72,74 Z"/></clipPath>' +
  '<clipPath id="altCam"><path d="M72,226 L148,226 C148,188 122,162 112,152 L108,152 C98,162 72,188 72,226 Z"/></clipPath>' +
  '</defs>' +
  '<rect x="4" y="4" width="212" height="302" rx="20" fill="#ffffff" stroke="#E9EEF5"/>' +
  '<rect x="58" y="58" width="104" height="12" rx="6" fill="#2c3e50"/>' +
  '<rect x="58" y="230" width="104" height="12" rx="6" fill="#2c3e50"/>' +
  '<path d="M72,74 L148,74 C148,112 122,138 112,148 L108,152 C98,162 72,188 72,226 L148,226 C148,188 122,162 112,152 L108,148 C98,138 72,112 72,74 Z" fill="rgba(230,250,245,.5)" stroke="#48c9b0" stroke-width="2.5" stroke-linejoin="round"/>' +
  '<rect id="kumUst" x="72" y="74" width="76" height="74" fill="url(#kumG)" clip-path="url(#ustCam)"/>' +
  '<rect id="kumAlt" x="72" y="226" width="76" height="0" fill="url(#kumG)" clip-path="url(#altCam)"/>' +
  '<line id="kumAkis" x1="110" y1="150" x2="110" y2="224" stroke="#F39C12" stroke-width="3" stroke-dasharray="4 5" opacity="0"/>' +
  '<text id="zamanSayi" x="110" y="285" text-anchor="middle" font-size="30" fill="#2c3e50">10</text>' +
  '</svg>';
const kumUst = $('kumUst'), kumAlt = $('kumAlt'), kumAkis = $('kumAkis'), zamanSayi = $('zamanSayi');
function renkKaristir(c1, c2, t){
  return 'rgb(' + c1.map((v,i)=>Math.round(ara(v, c2[i], t))).join(',') + ')';
}
let sonSaniye = -1, akisFaz = 0;
function oyunGuncelle(p){
  /* dönme dolap kaydırmayla döner */
  const dd = $('ddCark'); if (dd) dd.setAttribute('transform', 'rotate(' + (p*420) + ' 95 78)');
  /* takım üyeleri sırayla sahaya iner */
  const uyeP = kirp((p-.05)/.4, 0, 1);
  const toplamUye = uyelerA.length + uyelerB.length;
  const gelen = Math.round(uyeP * toplamUye);
  for (let i=0; i<toplamUye; i++){
    const takimA = (i%2===0), sira = Math.floor(i/2);
    (takimA ? uyelerA : uyelerB)[sira].classList.toggle('geldi', i < gelen);
  }
  /* kum saati: üst boşalır, alt dolar */
  const zP = kirp((p-.2)/.7, 0, 1);
  kumUst.setAttribute('y', 74 + 74*zP);
  kumUst.setAttribute('height', 74*(1-zP));
  kumAlt.setAttribute('y', 226 - 74*zP);
  kumAlt.setAttribute('height', 74*zP);
  kumAkis.style.opacity = (zP > 0 && zP < 1) ? .9 : 0;
  akisFaz -= .8; kumAkis.setAttribute('stroke-dashoffset', akisFaz);
  const saniye = Math.ceil(10 * (1-zP));
  if (saniye !== sonSaniye){ zamanSayi.textContent = saniye; sonSaniye = saniye; }
  const deniz=[22,160,133], amber=[243,156,18], kirmizi=[239,83,80];
  zamanSayi.setAttribute('fill', zP > .8 ? 'rgb(239,83,80)' : '#2c3e50');
  /* skor yarışı — önde giden el değiştirir */
  const sP = kirp((p-.04)/.82, 0, 1);
  const a = eV(sP) * 88 * (1 + Math.sin(sP*7)*.10);
  const b = eV(sP) * 84 * (1 - Math.sin(sP*7)*.12);
  skorA.setAttribute('width', kirp(a,0,100)*2);
  skorB.setAttribute('width', kirp(b,0,100)*2);
  const pa = Math.round(a*10), pb = Math.round(b*10);
  puanA.textContent = pa > 0 ? pa : '';
  puanB.textContent = pb > 0 ? pb : '';
  tacA.classList.toggle('goster', sP > .9 && a >= b);
  tacB.classList.toggle('goster', sP > .9 && b > a);
}

/* ============ FİNAL ÖZELLİK AMBLEMLERİ (özel SVG) ============ */
(function(){
  /* 1) kronometre — kısa sürede */
  let tik='';
  for(let i=0;i<12;i++){ const a=i*Math.PI/6;
    tik += '<line x1="'+(60+Math.cos(a)*40)+'" y1="'+(84+Math.sin(a)*40)+'" x2="'+(60+Math.cos(a)*46)+'" y2="'+(84+Math.sin(a)*46)+'" stroke="#2c3e50" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>'; }
  $('ozKron').innerHTML =
    '<svg width="130" height="150" viewBox="0 0 120 150">' +
    '<rect x="52" y="6" width="16" height="11" rx="4" fill="#2c3e50"/>' +
    '<rect x="57" y="15" width="6" height="18" fill="#2c3e50"/>' +
    '<line x1="96" y1="48" x2="104" y2="39" stroke="#2c3e50" stroke-width="6" stroke-linecap="round"/>' +
    '<circle cx="60" cy="84" r="52" fill="#ffffff" stroke="#16A085" stroke-width="4"/>' + tik +
    '<line id="kronIbre" x1="60" y1="84" x2="60" y2="48" stroke="#F39C12" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="60" cy="84" r="5" fill="#F39C12"/>' +
    '<g stroke="#48c9b0" stroke-width="3.5" stroke-linecap="round" opacity=".8">' +
    '<line id="hiz1" x1="2" y1="66" x2="20" y2="66"/><line id="hiz2" x1="-4" y1="84" x2="18" y2="84"/><line id="hiz3" x1="2" y1="102" x2="20" y2="102"/></g>' +
    '</svg><div class="ad">Kısa sürede</div><div class="alt">dakikalar yeter</div>';

  /* 2) hedef — etkili */
  $('ozHedef').innerHTML =
    '<svg width="130" height="150" viewBox="0 0 120 150">' +
    '<g class="halka-g" id="hh1"><circle cx="60" cy="80" r="48" fill="#E6FAF5" stroke="#48c9b0" stroke-width="3"/></g>' +
    '<g class="halka-g" id="hh2"><circle cx="60" cy="80" r="32" fill="#ffffff" stroke="#48c9b0" stroke-width="2.5"/></g>' +
    '<g class="halka-g" id="hh3"><circle cx="60" cy="80" r="17" fill="#FFF6E3" stroke="#FFC107" stroke-width="2.5"/></g>' +
    '<circle id="vurus" cx="60" cy="80" r="8" fill="none" stroke="#F39C12" stroke-width="3" opacity="0"/>' +
    '<g id="okG" opacity="0">' +
    '<line x1="68.5" y1="71.5" x2="94" y2="46" stroke="#2c3e50" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M60,80 L72,75.1 L64.9,68 Z" fill="#F39C12"/>' +
    '<path d="M94,46 L105,43.5 L101,40 Z" fill="#16A085"/>' +
    '<path d="M94,46 L96.5,35 L100,39 Z" fill="#16A085"/>' +
    '</g>' +
    '<circle id="hedefGoz" cx="60" cy="80" r="6" fill="#F39C12" opacity="0"/>' +
    '</svg><div class="ad">Etkili</div><div class="alt">tam on ikiden</div>';

  /* 3) odak — konsantre: dağınık harfler tek kelimede toplanır */
  const dagilim = [[-46,-34,'ع'],[44,-40,'ل'],[-52,18,'م'],[50,26,'ك'],[-16,-52,'ب'],[20,52,'ت']];
  $('ozOdak').innerHTML =
    '<svg width="130" height="150" viewBox="0 0 120 150">' +
    '<circle cx="60" cy="80" r="48" fill="#ffffff" stroke="#16A085" stroke-width="3" stroke-dasharray="5 7" id="odakCember"/>' +
    dagilim.map((d,i)=>'<text class="odak-harf ar-harf" data-dx="'+d[0]+'" data-dy="'+d[1]+'" x="'+(60+d[0])+'" y="'+(84+d[1])+'" text-anchor="middle" font-size="18" fill="#48c9b0">'+d[2]+'</text>').join('') +
    '<text id="odakSoz" x="60" y="90" text-anchor="middle" font-size="26" fill="#16A085" opacity="0" style="font-family:\'Arakom\',\'Amiri\',serif">عِلْم</text>' +
    '</svg><div class="ad">Konsantre</div><div class="alt">tek hedef: öğrenmek</div>';
})();
const kronIbre = $('kronIbre'), okG = $('okG'), vurus = $('vurus'), hedefGoz = $('hedefGoz');
const odakHarfler = [...document.querySelectorAll('.odak-harf')], odakSoz = $('odakSoz'), odakCember = $('odakCember');
function ozellikGuncelle(p){
  const q = kirp(p/.55, 0, 1);
  /* kronometre: ibre hızla tur atar, hız çizgileri titrer */
  kronIbre.setAttribute('transform', 'rotate(' + (eV(q)*720) + ' 60 84)');
  const sal = Math.sin(performance.now()*.02)*3;
  ['hiz1','hiz2','hiz3'].forEach((id,i)=>{ $(id).setAttribute('transform','translate('+(q>0&&q<1?sal*(i%2?1:-1):0)+',0)'); });
  /* hedef: halkalar sırayla, ok uçar, vuruş dalgası */
  $('hh1').classList.toggle('gel', q > .06);
  $('hh2').classList.toggle('gel', q > .16);
  $('hh3').classList.toggle('gel', q > .26);
  const ot = eV(kirp((q-.34)/.3, 0, 1));
  okG.setAttribute('opacity', ot > 0 ? 1 : 0);
  okG.setAttribute('transform', 'translate(' + ara(70,0,ot) + ',' + ara(-70,0,ot) + ')');
  hedefGoz.setAttribute('opacity', ot >= 1 ? 1 : 0);
  const vp = kirp((q-.66)/.3, 0, 1);
  vurus.setAttribute('r', 8 + vp*34);
  vurus.setAttribute('opacity', vp > 0 ? (1-vp)*.9 : 0);
  /* odak: harfler merkeze akar, kelime belirir */
  const cv = eV(kirp((q-.15)/.5, 0, 1));
  odakHarfler.forEach(hf=>{
    const dx = +hf.dataset.dx, dy = +hf.dataset.dy;
    hf.setAttribute('transform', 'translate(' + (-dx*cv) + ',' + (-dy*cv) + ')');
    hf.style.opacity = 1 - cv*.92;
  });
  odakSoz.setAttribute('opacity', kirp((cv-.55)/.45, 0, 1));
  odakCember.setAttribute('transform', 'rotate(' + (q*70) + ' 60 80)');
}

/* ============ 5 · SİS ODASI ============ */
const gizemSahne = $('gizemSahne'), sisOrtusu = $('sisOrtusu');
/* sisin altında klasik hatla kelimeler */
(function(){
  const K = [
    ['عِلْم',8,6,2.4,'#16A085',-8], ['حِكْمَة',78,4,2.0,'#F39C12',6], ['نُور',88,22,2.6,'#16A085',10],
    ['كِتاب',4,38,2.2,'#F39C12',-12], ['قَلَم',90,58,2.1,'#16A085',-6], ['مَعْرِفَة',6,72,2.3,'#F39C12',8],
    ['صَبْر',80,80,2.5,'#16A085',-10], ['أَدَب',16,88,2.0,'#F39C12',5], ['فَهْم',48,7,1.9,'#16A085',12],
    ['قِرَاءَة',38,86,2.2,'#16A085',-5], ['حَرْف',66,90,1.9,'#F39C12',9], ['دَرْس',2,55,1.9,'#16A085',7]
  ];
  $('sisKelimeler').innerHTML = K.map(k=>
    '<span style="left:'+k[1]+'%;top:'+k[2]+'%;font-size:'+k[3]+'rem;color:'+k[4]+';transform:rotate('+k[5]+'deg)">'+k[0]+'</span>').join('');
})();
let felX = innerWidth/2, felY = innerHeight/2, felHX = felX, felHY = felY;
gizemSahne.addEventListener('mousemove', e => { felHX = e.clientX; felHY = e.clientY; });
gizemSahne.addEventListener('touchmove', e => { felHX = e.touches[0].clientX; felHY = e.touches[0].clientY; }, {passive:true});

/* ---------- tuvaller ---------- */
function boyutlaTuvaller(){
  [[heroT, $('hero')], [oyunT, $('oyunSahne')]].forEach(([c, kap])=>{
    c.width = kap.offsetWidth; c.height = kap.offsetHeight;
  });
  heroKur(); oyunKur();
}
boyutlaTuvaller();

const hale = $('hale');
addEventListener('mousemove', e => { hale.style.left = e.clientX+'px'; hale.style.top = e.clientY+'px'; });

/* =================== ANA DÖNGÜ =================== */
const alfabePerde = $('alfabePerde'), kokPerde = $('kokPerde'), oyunPerde = $('oyunPerde');
const gizemPerde = $('gizemPerde'), finalPerde = $('finalPerde');
const isik = $('isik'), kapiSol = $('kapiSol'), kapiSag = $('kapiSag');
const dokuman = document.documentElement;
let sonSayi = -1, yonlendi = false;

function dongu(zaman){
  const kayHiz = kirp(Math.abs(hedefY - sY)*.06, 0, 8);
  sY = ara(sY, hedefY, .12);

  okCubuk.style.width = (hedefY / (dokuman.scrollHeight - vh) * 100) + '%';
  let aktifIdx = 0;
  bolumler.forEach((b,i)=>{ if (b.getBoundingClientRect().top <= vh*.5) aktifIdx = i; });
  noktalar.forEach((n,i)=> n.classList.toggle('aktif', i === aktifIdx));

  if (hedefY < vh * 1.2 && !azHareket) heroCiz(zaman, kayHiz);

  { /* alfabe */
    const p = perdeP(alfabePerde);
    const yanan = Math.round(p * 28);
    if (yanan !== sonSayi){
      duvarHarfleri.forEach((h,i)=>{
        h.classList.toggle('yandi', i < yanan);
        h.classList.toggle('son', i === yanan-1);
      });
      alfabeSayacB.textContent = yanan; sonSayi = yanan;
    }
  }

  kokGuncelle(perdeP(kokPerde));

  { /* oyun sahası */
    const r = oyunPerde.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0){
      if (!azHareket) oyunCiz();
      oyunGuncelle(perdeP(oyunPerde));
    }
  }

  { /* sis */
    const p = perdeP(gizemPerde);
    felX = ara(felX, felHX, .14); felY = ara(felY, felHY, .14);
    sisOrtusu.style.setProperty('--x', felX + 'px');
    sisOrtusu.style.setProperty('--y', felY + 'px');
    const yaricap = ara(120, Math.max(innerWidth, innerHeight)*1.2, eV(kirp((p-.25)/.7, 0, 1)));
    sisOrtusu.style.setProperty('--r', yaricap + 'px');
    $('gizemIpucu').style.opacity = 1 - kirp(p/.3,0,1);
  }

  { /* final: güneş doğar, en dipte site kendiliğinden açılır */
    const p = perdeP(finalPerde);
    ozellikGuncelle(p);
    isik.style.opacity = eV(kirp(p/.3, 0, 1)) * .8;
    const e = eV(kirp((p-.62)/.36, 0, 1));   // en sonda kapanır
    kapiSol.style.transform = 'translateX(' + ((-1+e)*104) + '%)';
    kapiSag.style.transform = 'translateX(' + ((1-e)*104) + '%)';
    if (!yonlendi && hedefY + vh >= dokuman.scrollHeight - 4){
      yonlendi = true;
      $('gecis').classList.add('aktif');
      setTimeout(()=>{ location.href = 'index.html'; }, 850);
    }
  }

  requestAnimationFrame(dongu);
}
requestAnimationFrame(dongu);

noktalar.forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  $(a.dataset.hedef).scrollIntoView({behavior:'smooth'});
}));