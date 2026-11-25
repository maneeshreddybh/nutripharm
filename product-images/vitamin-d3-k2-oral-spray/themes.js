/* Background themes: decorative layers only — product and copy are untouched.
   Pick one with the URL hash: source.html#sunshine | #science | #citrus (none = plain). */
(function(){
const theme = location.hash.replace('#','');
if(!theme) return;
const NS='http://www.w3.org/2000/svg';
let n=0; const uid=p=>p+(n++);
let seed=11; const R=()=>(seed=(seed*16807)%2147483647)/2147483647;

/* ---------- art helpers (all return SVG markup, 1000x1000 space) ---------- */
function glow(cx,cy,r,col,op){const id=uid('g');return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`;}
function rays(cx,cy,r,col,op,count=28){const id=uid('m');let p='';for(let i=0;i<count;i++){const a=i/count*Math.PI*2,w=Math.PI/count*0.55;p+=`M${cx} ${cy} L${cx+Math.cos(a-w)*r} ${cy+Math.sin(a-w)*r} L${cx+Math.cos(a+w)*r} ${cy+Math.sin(a+w)*r}Z`;}
  return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".25" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="${id}k"><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/></mask></defs><path d="${p}" fill="${col}" opacity="${op}" mask="url(#${id}k)"/>`;}
function bokeh(x0,y0,x1,y1,k,col,maxop){let s='';for(let i=0;i<k;i++){const r=6+R()*26;s+=`<circle cx="${x0+R()*(x1-x0)}" cy="${y0+R()*(y1-y0)}" r="${r}" fill="${col}" opacity="${(0.08+R()*maxop).toFixed(2)}"/>`;}return s;}
function sunDisc(cx,cy,r){return glow(cx,cy,r*3.2,'#ffd36b',.55)+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffd25c" opacity=".55"/><circle cx="${cx}" cy="${cy}" r="${r*.7}" fill="#ffe08a" opacity=".6"/>`;}

function hexPattern(col,op,size=34,area='0 0 1000 1000'){const id=uid('h'),w=size*Math.sqrt(3),h=size*3;
  return `<defs><pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"><path d="M${w/2} 0 L${w} ${size/2} L${w} ${size*1.5} L${w/2} ${size*2} L0 ${size*1.5} L0 ${size/2}Z M${w/2} ${size*2} L${w/2} ${h}" fill="none" stroke="${col}" stroke-width="1.4"/></pattern></defs><rect x="${area.split(' ')[0]}" y="${area.split(' ')[1]}" width="${area.split(' ')[2]}" height="${area.split(' ')[3]}" fill="url(#${id})" opacity="${op}"/>`;}
function liposome(cx,cy,r,col,op){let s=`<g opacity="${op}"><circle cx="${cx}" cy="${cy}" r="${r*.78}" fill="${col}" fill-opacity=".10"/>`;
  const k=Math.max(14,Math.round(r*0.9));
  for(const [rr,rad] of [[r,r*.11],[r*.82,r*.08]]) for(let i=0;i<k;i++){const a=i/k*Math.PI*2;s+=`<circle cx="${cx+Math.cos(a)*rr}" cy="${cy+Math.sin(a)*rr}" r="${rad}" fill="${col}"/>`;}
  return s+`<circle cx="${cx}" cy="${cy}" r="${r*.3}" fill="${col}" opacity=".35"/></g>`;}
function bone(cx,cy,len,rot,col,op,sw=4){const L=len/2,k=len*.13;
  const d=`M${-L+k} ${-k*.55} L${L-k} ${-k*.55} A${k} ${k} 0 1 1 ${L-k*.2} ${0} A${k} ${k} 0 1 1 ${L-k} ${k*.55} L${-L+k} ${k*.55} A${k} ${k} 0 1 1 ${-L+k*.2} 0 A${k} ${k} 0 1 1 ${-L+k} ${-k*.55}Z`;
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})" opacity="${op}"><path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linejoin="round"/></g>`;}
function caDots(x0,y0,x1,y1,k,col,op){let s='';for(let i=0;i<k;i++){const x=x0+R()*(x1-x0),y=y0+R()*(y1-y0),r=12+R()*10;s+=`<g opacity="${op}"><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="2"/><text x="${x}" y="${y+r*.38}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${r*.95}" fill="${col}">Ca</text></g>`;}return s;}

function orangeSlice(cx,cy,r,rot,op=1,c='#f7a12a'){let seg='';const k=10;for(let i=0;i<k;i++){const a0=i/k*Math.PI*2+0.05,a1=(i+1)/k*Math.PI*2-0.05,ri=r*.12,ro=r*.8;
  seg+=`<path d="M${Math.cos(a0)*ri} ${Math.sin(a0)*ri} L${Math.cos(a0)*ro} ${Math.sin(a0)*ro} A${ro} ${ro} 0 0 1 ${Math.cos(a1)*ro} ${Math.sin(a1)*ro} L${Math.cos(a1)*ri} ${Math.sin(a1)*ri}Z" fill="${c}" opacity=".85"/>`;}
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})" opacity="${op}"><circle r="${r}" fill="${c}"/><circle r="${r*.9}" fill="#fff4dc"/>${seg}<circle r="${r*.06}" fill="#fff4dc"/></g>`;}
function leaf(x,y,s,rot,c='#5cb85c',op=1){return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="${op}"><path d="M0 0 C 20 -30, 70 -34, 100 0 C 70 34, 20 30, 0 0Z" fill="${c}"/><path d="M4 0 L92 0" stroke="#fff" stroke-opacity=".45" stroke-width="2.5"/>${[22,42,62].map(t=>`<path d="M${t} 0 L${t+14} -12 M${t} 0 L${t+14} 12" stroke="#fff" stroke-opacity=".3" stroke-width="1.8"/>`).join('')}</g>`;}
function drop(x,y,s,c,op){return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}"><path d="M0 -20 C -8 -6 -12 0 -12 6 a12 12 0 0 0 24 0 c0 -6 -4 -12 -12 -26z" fill="${c}"/><circle cx="-4" cy="4" r="3" fill="#fff" opacity=".7"/></g>`;}
function strawberry(x,y,s,rot){let seeds='';for(let i=0;i<22;i++){const a=R(),b=R();const px=(a-.5)*70*(1-b*.6),py=-28+b*80;seeds+=`<ellipse cx="${px}" cy="${py}" rx="2.2" ry="3.4" fill="#ffe38a"/>`;}
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 62 C -40 40 -55 -10 -40 -30 C -25 -48 25 -48 40 -30 C 55 -10 40 40 0 62Z" fill="#e8344e"/><path d="M-18 -30 C -10 -20 10 -20 18 -30" stroke="#fff" stroke-opacity=".25" stroke-width="6" fill="none"/>${seeds}<path d="M0 -36 L-26 -48 L-10 -40 L-18 -58 L0 -44 L18 -58 L10 -40 L26 -48Z" fill="#3aa35a"/><path d="M0 -44 L2 -62" stroke="#2c7c45" stroke-width="4"/></g>`;}
function mango(x,y,s,rot){const id=uid('mg');return `<defs><radialGradient id="${id}" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#ffd84a"/><stop offset=".6" stop-color="#ffb020"/><stop offset="1" stop-color="#f07b12"/></radialGradient></defs><g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-10 -55 C 40 -62 70 -10 55 30 C 42 62 -10 70 -40 45 C -66 22 -58 -40 -10 -55Z" fill="url(#${id})"/><path d="M-6 -56 C -4 -66 0 -72 6 -76" stroke="#6b4a1e" stroke-width="4" fill="none"/>${leaf(4,-74,.55,-30,'#3f9b4f')}</g>`;}
function mintSprig(x,y,s,rot){let l='';[[-0,0,-35],[0,0,35],[0,-40,-40],[0,-40,40],[0,-78,-45],[0,-78,45],[0,-108,-90]].forEach(([dx,dy,r],i)=>{l+=leaf(dx,dy,.62-(i>5?.1:0),r-90,i%2?'#2fb37b':'#25a06c')});
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 40 L0 -110" stroke="#1f8a5b" stroke-width="5"/>${l}</g>`;}

/* ---------- per-theme, per-slide layers ---------- */
const T = {
 sunshine:{
  s1: rays(500,470,640,'#ffc94d',.16)+glow(500,470,560,'#ffd77a',.45)+bokeh(40,60,960,940,16,'#ffc04a',.12),
  s2: rays(760,380,620,'#ffb733',.18)+sunDisc(760,330,70)+bokeh(560,80,980,960,14,'#ffffff',.35),
  s3: sunDisc(930,40,60)+rays(930,40,520,'#ffb733',.22)+bokeh(0,0,1000,250,12,'#ffffff',.4),
  s4: rays(755,500,760,'#fff3c4',.22)+glow(755,500,420,'#fff1b0',.55)+bokeh(560,60,990,960,16,'#ffffff',.25),
  s5: sunDisc(70,50,55)+rays(70,50,560,'#ffb733',.2)+glow(950,980,420,'#ffd77a',.5),
  s6: sunDisc(940,50,55)+rays(940,50,520,'#ffb733',.22)+bokeh(0,0,1000,220,10,'#ffc04a',.15),
  s7: rays(500,400,700,'#ffb733',.2)+sunDisc(500,380,95)+bokeh(30,160,970,680,18,'#ffffff',.4),
  s8: sunDisc(500,-20,60)+rays(500,-20,560,'#ffb733',.2),
  card:(c1)=>glow(105,260,190,'#fff2b3',.9)+rays(105,260,260,'#ffffff',.5,20)
 },
 science:{
  s1: hexPattern('#e9800f',.07)+liposome(110,170,62,'#f0a040',.55)+liposome(890,820,80,'#f0a040',.5)+liposome(880,160,34,'#f0a040',.5)+liposome(120,830,40,'#f0a040',.5),
  s2: hexPattern('#e9800f',.07,34,'560 0 440 1000')+bone(770,560,560,-62,'#e9800f',.16,6)+liposome(930,140,46,'#e9800f',.35)+liposome(600,860,36,'#e9800f',.3)+caDots(560,620,990,980,6,'#e9800f',.28),
  s3: hexPattern('#e9800f',.09,30,'0 0 1000 260')+liposome(70,70,46,'#e9800f',.35)+liposome(940,170,40,'#e9800f',.35)+caDots(820,20,1000,120,3,'#e9800f',.3),
  s4: hexPattern('#ffffff',.10)+liposome(900,140,70,'#ffffff',.35)+liposome(610,880,50,'#ffffff',.3)+bone(760,520,640,-62,'#ffffff',.14,6),
  s5: hexPattern('#e9800f',.08,30,'0 0 1000 210')+caDots(15,20,180,200,3,'#e9800f',.35)+caDots(830,20,990,200,3,'#e9800f',.35)+bone(500,965,620,0,'#e9800f',.14,5),
  s6: hexPattern('#e9800f',.08,30,'0 0 1000 230')+liposome(80,90,44,'#e9800f',.35)+liposome(925,95,48,'#e9800f',.35)+liposome(500,968,24,'#e9800f',.3),
  s7: hexPattern('#e9800f',.07)+bone(210,440,360,-60,'#e9800f',.18,6)+liposome(790,330,70,'#e9800f',.4)+liposome(880,560,40,'#e9800f',.35)+caDots(80,180,330,640,5,'#e9800f',.3),
  s8: hexPattern('#e9800f',.08,30,'0 0 1000 235')+liposome(80,90,40,'#e9800f',.35)+liposome(925,95,40,'#e9800f',.35),
  card:(c1)=>liposome(60,120,34,c1,.45)+liposome(175,420,44,c1,.4)+liposome(40,470,20,c1,.4)
 },
 citrus:{
  s1: orangeSlice(70,930,150,15,.95)+orangeSlice(960,880,110,40,.95)+leaf(150,800,1.4,-60)+leaf(830,860,1.1,-140,'#4caf50')+orangeSlice(930,110,70,10,.9)+leaf(860,60,.9,160,'#66bb6a')+drop(90,140,1.2,'#ffc46b',.6)+drop(130,200,.8,'#ffc46b',.5),
  s2: orangeSlice(930,910,170,20)+orangeSlice(640,960,90,60,.95)+leaf(870,130,1.3,150)+leaf(930,230,1,200,'#66bb6a')+drop(600,140,1,'#ffc46b',.5)+drop(980,520,1.1,'#ffc46b',.5),
  s3: orangeSlice(40,40,90,10)+leaf(20,215,.9,-20)+orangeSlice(970,200,80,40)+leaf(985,40,.9,170,'#66bb6a'),
  s4: orangeSlice(950,930,190,25,.9)+orangeSlice(600,970,100,0,.85)+leaf(930,120,1.4,150,'#7cc576',.9)+leaf(880,250,1,200,'#7cc576',.8),
  s5: orangeSlice(40,40,90,10)+leaf(20,190,.9,-20)+orangeSlice(960,60,75,40)+leaf(985,190,.9,170,'#66bb6a')+orangeSlice(980,990,110,0,.8),
  s6: orangeSlice(50,50,85,10)+leaf(15,195,.9,-20)+orangeSlice(955,70,75,40)+leaf(985,195,.9,170,'#66bb6a'),
  s7: orangeSlice(180,470,120,20)+orangeSlice(300,620,70,60,.95)+leaf(120,300,1.3,-40)+orangeSlice(820,500,110,0)+leaf(900,330,1.2,210,'#66bb6a')+drop(260,260,1.2,'#ffc46b',.6)+drop(740,640,1,'#ffc46b',.5),
  s8: leaf(10,60,.9,-10)+leaf(15,170,.75,25,'#66bb6a')+leaf(990,60,.9,190)+leaf(985,170,.75,155,'#66bb6a'),
  card:(c1,name)=>({Strawberry:strawberry(170,560,1.1,20)+strawberry(50,470,.75,-25),Mint:mintSprig(175,600,1.05,18)+mintSprig(40,520,.7,-20),Orange:orangeSlice(180,540,72,10)+orangeSlice(40,470,48,40),Mango:mango(175,545,1.05,15)+mango(45,480,.7,-30)})[name]
 }
}[theme];
if(!T) return;

const style=document.createElement('style');
style.textContent=`.slide{isolation:isolate}.deco{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}`;
document.head.appendChild(style);

function addLayer(el,svg,w=1000,h=1000){
  const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox',`0 0 ${w} ${h}`);s.setAttribute('class','deco');s.setAttribute('preserveAspectRatio','none');
  s.innerHTML=svg; el.insertBefore(s, el.firstChild);
}
for(let i=1;i<=8;i++){
  const sl=document.getElementById('s'+i);
  // full-bleed background panels (e.g. the cream header band) stay beneath the decoration
  [...sl.children].forEach(c=>{ if(c.style && c.style.inset==='0px') c.style.zIndex='-1'; });
  addLayer(sl,T['s'+i]);
}
// flavour cards: art behind each bottle
document.querySelectorAll('#flv > div').forEach(card=>{
  const name=card.textContent.trim(); const c1=card.querySelector('.blob')?.style.background;
  addLayer(card,T.card(c1,name),218,690);
});
})();
