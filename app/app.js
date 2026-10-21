
const R=[
{n:"Cocoa",loc:"Ivory Coast",lat:6.8,lon:-5.3,sym:"CC=F",u:"$/t",p:6000},
{n:"Coffee",loc:"Minas Gerais, Brazil",lat:-19,lon:-46,sym:"KC=F",u:"¢/lb",p:300},
{n:"Wheat",loc:"Ukraine",lat:49,lon:32,sym:"ZW=F",u:"¢/bu",p:550},
{n:"Palm oil",loc:"Sumatra, Indonesia",lat:2,lon:101,sym:null,u:"MYR/t",p:4000},
{n:"Copper",loc:"Chile",lat:-24,lon:-69,sym:"HG=F",u:"$/lb",p:4.5},
{n:"Sugar",loc:"Maharashtra, India",lat:18.5,lon:76,sym:"SB=F",u:"¢/lb",p:15},
{n:"Corn",loc:"Iowa, USA",lat:42,lon:-93.5,sym:"ZC=F",u:"¢/bu",p:430},
{n:"Cotton",loc:"Texas, USA",lat:32,lon:-101,sym:"CT=F",u:"¢/lb",p:68},
{n:"Crude oil",loc:"Saudi Arabia (Brent)",lat:25,lon:49,sym:"BZ=F",u:"$/bbl",p:70,nw:1},
{n:"Nat gas",loc:"Appalachia, USA (Henry Hub)",lat:41,lon:-78,sym:"NG=F",u:"$/MMBtu",p:3.5,nw:1},
{n:"Soybeans",loc:"Mato Grosso, Brazil",lat:-12.5,lon:-55.5,sym:"ZS=F",u:"¢/bu",p:1050},
{n:"Gold",loc:"Nevada, USA",lat:40.5,lon:-117,sym:"GC=F",u:"$/oz",p:3500,nw:1},
{n:"Silver",loc:"Zacatecas, Mexico",lat:23,lon:-102.5,sym:"SI=F",u:"$/oz",p:40,nw:1},
{n:"Platinum",loc:"Bushveld, South Africa",lat:-25.5,lon:27.5,sym:"PL=F",u:"$/oz",p:1300,nw:1},
{n:"Lumber",loc:"British Columbia, Canada",lat:53,lon:-123,sym:"LBR=F",u:"$/mbf",p:600},
{n:"Orange juice",loc:"Florida, USA",lat:28,lon:-81.5,sym:"OJ=F",u:"¢/lb",p:250},
{n:"Rubber",loc:"Southern Thailand",lat:7.5,lon:100,sym:null,u:"¢/kg",p:170},
{n:"Rice",loc:"Punjab, India",lat:30.5,lon:75.5,sym:"ZR=F",u:"$/cwt",p:12},
{n:"Lithium",loc:"Greenbushes, Australia",lat:-33.9,lon:116.1,sym:null,u:"CNY/t",p:80000,nw:1},
{n:"Iron ore",loc:"Pilbara, Australia",lat:-22.5,lon:118.5,sym:"TIO=F",u:"$/t",p:100,nw:1}];
const X=o=>o+180,Y=a=>90-a;
const $=s=>document.querySelector(s),map=$("#map");
let g='<svg viewBox="0 0 360 180" preserveAspectRatio="none">';
for(let i=-150;i<=150;i+=30)g+=`<path class="g" d="M${X(i)} 0V180"/>`;
for(let i=-60;i<=60;i+=30)g+=`<path class="g" d="M0 ${Y(i)}H360"/>`;
g+=`<path class="land" d="${LAND}"/><path class="bd" d="${BORD}"/>`;
const info=h=>{map.classList.remove("hlmode");document.querySelectorAll(".mk.on").forEach(x=>x.classList.remove("on"));document.querySelectorAll(".ln.hl").forEach(x=>x.classList.remove("hl"));const p=$("#panel");p.innerHTML='<button class="x" id="px">×</button>'+h;p.classList.add("open");if(!h.includes("data-tap")){const tm=document.querySelector(".tapmk");tm&&tm.remove()}$("#px").onclick=()=>{p.classList.remove("open");document.querySelectorAll(".mk.on").forEach(x=>x.classList.remove("on"));document.querySelectorAll(".pin.sel").forEach(x=>x.classList.remove("sel"));const tm=document.querySelector(".tapmk");tm&&tm.remove()}};
const D=p=>{const q=a=>{let d="";for(let i=0;i<a.length;i+=2)d+=(i?"L":"M")+X(a[i])+" "+Y(a[i+1]);return d};return Array.isArray(p[0])?p.map(q).join(""):q(p)};
const CL={o:"#d9692a",a:"#4aa35a",m:"#6b86c9",g:"#a86bd6"};
const LN=[
{n:"Gulf → Asia",c:"o",w:"Crude oil and LNG to China, Japan, Korea, India (tankers, LNG carriers)",v:"Ras Tanura, Hormuz, Malacca, Shanghai",p:[50,26.6,51.5,26.9,54,26.3,56.3,26.5,58.5,24.5,61,22.5,65,18,72,10,78,6,85,5.5,93,6.5,97.5,5.8,101.4,2.5,103.6,1.1,106,2.5,108,5,111,9,115,13.5,118,17,120,23,122.8,29.5,122.5,30.8,121.8,31.2]},
{n:"Gulf → Europe",c:"o",w:"Crude, refined products and LNG to Europe",v:"Ras Tanura, Hormuz, Bab el-Mandeb, Suez, Gibraltar, Rotterdam",p:[50,26.6,51.5,26.9,54,26.3,56.3,26.5,58.5,24.5,61,22.5,59.5,19,55,14,48,12.3,43.3,12.6,41,15.5,38.5,20.5,35.5,26,33.2,28.3,32.55,30,32.4,30.5,32.3,31.3,30,32.6,25,34.2,18,34.5,12,37.2,8,38,2,38,-1,36.2,-5.6,36,-9.5,36.5,-10.5,39.5,-10.5,43.5,-6,46.5,-5,48.5,-1,50,2,51.2,3.5,51.9,4.4,51.9]},
{n:"Singapore → Europe via the Cape",c:"o",w:"Oil, products and containers when the Red Sea is avoided",v:"Malacca, Cape of Good Hope, Rotterdam",p:[103.8,1.3,103.4,1.1,102.4,1.7,101.4,2.5,97.5,5.8,93,6.5,85,5.5,80,4.5,65,-8,50,-20,40,-28,28,-34,19,-35.2,10,-28,2,-15,-5,-2,-12,5,-19,14,-20,22,-17,30,-13,36,-11,41,-10.5,43.5,-6,46.5,-5,48.5,-1,50,2,51.2,3.5,51.9,4.4,51.9]},
{n:"Shanghai → US West Coast",c:"a",w:"Containers; US grain, LNG and crude heading the other way",v:"North Pacific, Los Angeles",p:[[121.8,31.2,122.8,30.5,131,30,138,33.2,145,36,160,40,179,45],[-179,45,-150,46,-132,44,-126,40,-123,36,-120.5,33.5,-118.3,33.7]]},
{n:"Houston → Rotterdam",c:"o",w:"US crude, LNG and grain to Europe",v:"Florida Straits, North Atlantic",p:[-95,29.7,-94.3,28.8,-89,27,-85,24.5,-80.3,24.2,-79.5,26.5,-72,33,-55,39,-30,45,-12,49,-4,50,2,51.2,3.5,51.9,4.4,51.9]},
{n:"Houston → Panama → Shanghai",c:"a",w:"US grain, LNG and products to Asia",v:"Panama Canal",p:[[-95,29.7,-94.3,28.8,-90,27,-86,22,-84,17,-80.5,12,-79.7,9.1],[-79.5,8.5,-84,6,-100,8,-130,10,-160,13,-179,14],[179,14,160,16,140,18,127,22,123,26,122.8,29.5,122.5,30.8,121.8,31.2]]},
{n:"Santos → Shanghai",c:"a",w:"Soy, iron ore, sugar and coffee to China",v:"South Atlantic, Cape, Indian Ocean",p:[-46.3,-23.9,-45,-25.5,-30,-32,-5,-38,19,-35.2,30,-35,40,-30,60,-26,85,-17,100,-9,105.5,-6.5,108,-3.5,107.5,2,110,7,115,13,118,17,120,23,122.8,29.5,122.5,30.8,121.8,31.2]},
{n:"Port Hedland → Shanghai",c:"m",w:"Iron ore, coal and LNG to China (bulk carriers)",v:"Lombok Strait, South China Sea",p:[118.6,-20.3,118,-19,117,-13,115.8,-9.4,115.7,-8,112,-5.5,108,-3.5,107.5,2,110,7,115,13,118,17,120,23,122.8,29.5,122.5,30.8,121.8,31.2]},
{n:"Odesa → Alexandria",c:"a",w:"Wheat, corn and sunflower oil to the Mediterranean",v:"Bosphorus",p:[30.7,46.5,31,44,29.1,41.1,28.2,40.9,26.5,40.3,25.5,38.5,26.5,36.5,27.5,35,29,33,29.9,31.2]},
{n:"Abidjan → Rotterdam",c:"a",w:"Cocoa and other West African exports to Europe",v:"Atlantic coast, Biscay",p:[-4,5.3,-4,4.3,-8,3.8,-13,7,-17.5,11.5,-18,16,-18,21,-14,27,-11,33,-10,37,-10.5,39.5,-10.5,43.5,-6,46.5,-5,48.5,-1,50,2,51.2,3.5,51.9,4.4,51.9]},
{n:"San Antonio → Shanghai",c:"m",w:"Chilean copper cathode and concentrate to China",v:"South Pacific",p:[[-71.6,-33.6,-73,-33.6,-100,-28,-130,-15,-160,-3,-179,3],[179,3,165,9,150,13,135,17,127,21,123,26,122.8,29.5,122.5,30.8,121.8,31.2]]}];
const PL=[
{n:"Druzhba",c:"o",w:"Russian crude to Central Europe",p:[52,53,45,53,37,52,30,52,22,52,14,52]},
{n:"Yamal–Europe",c:"g",w:"Russian gas via Belarus and Poland to Germany",p:[68.5,70.3,53.7,63.6,34.9,57,32,54.8,27.5,53.9,21,52.2,14.5,52.3]},
{n:"Power of Siberia",c:"g",w:"Russian gas to China",p:[128,56,126,50,123,45]},
{n:"Nord Stream",c:"g",w:"Russian gas under the Baltic to Germany",s:"Damaged in 2022, not carrying gas",p:[28.5,60.5,25,59.9,22,59.3,19.8,57.8,17,55.8,14,54.6,13.6,54.1]},
{n:"TurkStream",c:"g",w:"Russian gas under the Black Sea to Turkey and southeast Europe",p:[37.3,44.9,34,43,31,42.4,28.1,41.6]},
{n:"Blue Stream",c:"g",w:"Russian gas under the Black Sea to Turkey",p:[38.7,44.3,37.5,43,36.8,42,36.3,41.3]},
{n:"CPC",c:"o",w:"Kazakh crude to the Black Sea (Novorossiysk)",p:[53.4,46.2,49,46.5,44,45.5,40,45,37.8,44.7]},
{n:"ESPO",c:"o",w:"Siberian crude to the Pacific coast (Kozmino)",p:[98,56,110,55,123.9,54,130,51,134,48.5,133.5,45,132.9,42.7]},
{n:"Baku–Tbilisi–Ceyhan",c:"o",w:"Caspian crude to the Mediterranean",p:[49.9,40.4,44.8,41.7,35.9,36.9]},
{n:"TANAP",c:"g",w:"Azerbaijani gas across Turkey",p:[49.9,40.4,46.5,41.1,43,41.1,38,40,33,40.1,29,40.4,26.3,40.9]},
{n:"TAP",c:"g",w:"Caspian gas from Greece under the Adriatic to Italy",p:[26.3,40.9,23,40.6,20.5,40.6,19.5,40.4,18.3,40.3]},
{n:"Kirkuk–Ceyhan",c:"o",w:"Iraqi crude to Turkey's Mediterranean coast",p:[44.4,35.5,42,36.8,38.5,37,35.9,36.9]},
{n:"Saudi East–West",c:"o",w:"Saudi crude to the Red Sea, bypassing Hormuz",p:[49.7,26.5,38.1,24]},
{n:"Habshan–Fujairah",c:"o",w:"UAE crude to the Gulf of Oman, bypassing Hormuz",p:[53.8,23.8,55,24.3,56.3,25.1]},
{n:"Dolphin",c:"g",w:"Qatari gas under the Gulf to the UAE",p:[51.5,25.9,53,25.6,54.7,24.8]},
{n:"Langeled",c:"g",w:"Norwegian gas under the North Sea to the UK",p:[7.8,63.1,3.5,61,2.5,58.5,2.2,56.5,1.5,54.8,0.2,53.7]},
{n:"Medgaz",c:"g",w:"Algerian gas under the Mediterranean to Spain",p:[-1.4,35.3,-2,36,-2.4,36.8]},
{n:"Transmed",c:"g",w:"Algerian gas via Tunisia and Sicily to Italy",p:[3.3,32.9,8.5,35.5,10.5,36.9,12.6,37.6]},
{n:"Greenstream",c:"g",w:"Libyan gas under the Mediterranean to Sicily",p:[12.3,32.9,13,34.5,13.8,36,14.3,37]},
{n:"West African Gas",c:"g",w:"Nigerian gas along the coast to Benin, Togo and Ghana",p:[3.3,6.2,1.5,5.9,-0.5,5.2,-1.8,4.8]},
{n:"Chad–Cameroon",c:"o",w:"Chadian crude to the Atlantic at Kribi",p:[16.8,8.7,14,6.5,12,5,10.5,3.8,9.9,2.9]},
{n:"Central Asia–China",c:"g",w:"Turkmen gas via Uzbekistan and Kazakhstan to China",p:[62,38,64,40,69,41,72,43.5,76,44.3,80.4,44.2]},
{n:"Myanmar–China",c:"o",w:"Middle East crude landed in Myanmar, piped to Yunnan",p:[93.5,19.4,95,21,97.5,23.5,100,24.5,102.7,25]},
{n:"Keystone",c:"o",w:"Canadian crude to US refineries",p:[-110,53,-98,49,-97,36,-95,29]},
{n:"Trans Mountain",c:"o",w:"Alberta crude to the British Columbia coast",p:[-113.5,53.5,-118,52,-121,50.5,-123,49.3]},
{n:"Colonial",c:"o",w:"Gulf Coast refined products to the US East Coast",p:[-95,29.7,-88,32,-84,34,-78,36,-74,40.7]},
{n:"Trans-Alaska",c:"o",w:"North Slope crude to Valdez",p:[-148.5,70,-146,64,-146,61]},
{n:"Gasbol",c:"g",w:"Bolivian gas to Brazil",p:[-63,-17.8,-57,-20,-52,-22,-47,-23]}];
const MK=[
{k:"choke",id:"chokepoint6",n:"Strait of Hormuz",lat:26.5,lon:56.3,w:"Roughly a fifth of world oil and much of Qatar's LNG"},
{k:"choke",id:"chokepoint4",n:"Bab el-Mandeb",lat:12.6,lon:43.3,w:"Red Sea gateway; trouble here pushes ships round the Cape"},
{k:"choke",id:"chokepoint1",n:"Suez Canal",lat:30.5,lon:32.4,w:"Oil, LNG, grain, containers between Asia and Europe"},
{k:"choke",id:"chokepoint5",n:"Strait of Malacca",lat:2.5,lon:101.4,w:"Gulf oil, palm oil and LNG heading to East Asia"},
{k:"choke",id:"chokepoint2",n:"Panama Canal",lat:9.1,lon:-79.7,w:"US grain, LNG, products to Asia; sensitive to drought"},
{k:"choke",id:"chokepoint3",n:"Bosphorus",lat:41.1,lon:29.1,w:"Black Sea grain, sunflower oil, oil exports"},
{k:"choke",id:"chokepoint8",n:"Gibraltar",lat:36,lon:-5.6,w:"Atlantic to Mediterranean entry"},
{k:"choke",id:"chokepoint7",n:"Cape of Good Hope",lat:-35.2,lon:19,w:"Diversion route when Suez or the Red Sea is avoided"},
{k:"choke",id:"chokepoint9",n:"Dover Strait",lat:51,lon:1.45,w:"World's busiest shipping lane; North Sea and Baltic trade, UK and Rotterdam access"},
{k:"choke",id:"chokepoint11",n:"Taiwan Strait",lat:24.5,lon:119.5,w:"Main lane between north and south Asia; containers, LNG and coal to China, Japan, Korea"},
{k:"choke",id:"chokepoint15",n:"Lombok Strait",lat:-8.75,lon:115.75,w:"Deep-water alternative to Malacca for the largest bulk carriers; Australian iron ore and coal"},
{k:"choke",id:"chokepoint28",n:"Kerch Strait",lat:45.3,lon:36.5,w:"Sea of Azov exit for Russian grain, oil products and fertiliser"},
{k:"ports",n:"Rotterdam",lat:51.9,lon:4.4,w:"Europe's main oil and bulk hub"},
{k:"ports",n:"Singapore",lat:1.3,lon:103.8,w:"Oil trading and bunkering hub"},
{k:"ports",n:"Shanghai",lat:31.2,lon:121.8,w:"Huge importer of metals, oil and agricultural goods"},
{k:"ports",n:"Houston",lat:29.7,lon:-95,w:"US oil, products and LNG"},
{k:"ports",n:"Santos",lat:-23.9,lon:-46.3,w:"Brazil's coffee, sugar and soy outlet"},
{k:"ports",n:"Port Hedland",lat:-20.3,lon:118.6,w:"Iron ore"},
{k:"ports",n:"Odesa",lat:46.5,lon:30.7,w:"Black Sea grain"},
{k:"ports",n:"Abidjan",lat:5.3,lon:-4,w:"Cocoa"},
{k:"ports",n:"Ras Tanura",lat:26.6,lon:50,w:"Saudi crude"},
{k:"ports",n:"Los Angeles",lat:33.7,lon:-118.3,w:"US Pacific gateway for Asia trade"},
{k:"ports",n:"Alexandria",lat:31.2,lon:29.9,w:"Egypt, the world's biggest wheat importer"},
{k:"ports",n:"San Antonio",lat:-33.6,lon:-71.6,w:"Chile's main copper outlet"}];
const lay=(a,k,c)=>`<g class="${c}">`+a.map((r,i)=>`<path id="ln${k}${i}" class="ln ${k=="p"?"pl":""}" stroke="${CL[r.c]}" d="${D(r.p)}"/><path class="hit" data-k="${k}" data-i="${i}" d="${D(r.p)}"/>`).join("")+"</g>";
map.innerHTML=g+lay(LN,"l","L-lanes")+lay(PL,"p","L-pipes")+"</svg>";
map.querySelectorAll(".hit").forEach(h=>h.onclick=()=>{const r=(h.dataset.k=="l"?LN:PL)[h.dataset.i];info(`<h2>${r.n}</h2><div class="row"><span>Carries</span><b>${r.w}</b></div>${r.v?`<div class="row"><span>Via</span><b>${r.v}</b></div>`:""}${r.s?`<div class="row"><span>Status</span><b>${r.s}</b></div>`:""}<div class="note">Indicative route, not an exact track. Flows and status change with politics and sanctions.</div>`)});
MK.forEach(m=>{const e=document.createElement("div");m.el=e;e.className="mk L-"+m.k;e.style.left=X(m.lon)/3.6+"%";e.style.top=Y(m.lat)/1.8+"%";e.innerHTML=`<span>${m.n}</span>`;e.onclick=()=>m.k=="choke"?showChoke(m):info(`<h2>${m.n}</h2><div class="row"><span>Type</span><b>${m.k=="choke"?"Chokepoint":"Port"}</b></div><div class="row"><span>Why it matters</span><b>${m.w}</b></div>`);map.appendChild(e)});
[["lanes","Sea lanes"],["pipes","Pipelines"],["choke","Chokepoints"],["ports","Ports"],["pins","Prices"],["storms","Storms"],["uk","UK energy"],["refin","Refineries"],["quake","Earthquakes"],["enso","ENSO impacts"]].forEach(([k,t])=>{const b=document.createElement("button");b.textContent=t;b.dataset.k=k;b.onclick=()=>{b.classList.toggle("off",map.classList.toggle("off-"+k));layout()};$("#tg").appendChild(b)});
const kr=(k,i,r)=>`<div class="kr${k=="p"?" pl":""}" data-k="${k}" data-i="${i}"><i style="border-color:${CL[r.c]}"></i><div><b>${r.n}</b><small>${r.w}${r.v?" · via "+r.v:""}${r.s?" · "+r.s:""}</small></div></div>`;
function hl(k,i){map.classList.remove(k=="l"?"off-lanes":"off-pipes");const el=document.getElementById("ln"+k+i),on=el.classList.contains("hl");document.querySelectorAll(".ln.hl").forEach(x=>x.classList.remove("hl"));map.classList.toggle("hlmode",!on);if(on)return;el.classList.add("hl");const b=el.getBBox(),s=$("#scroll"),W=map.offsetWidth/360;s.scrollTo({left:(b.x+b.width/2)*W-s.clientWidth/2,top:(b.y+b.height/2)*W-s.clientHeight/2,behavior:"smooth"})}
function openKey(){let s='<h2>Key</h2><div class="note" style="margin:0 0 4px">Tap a row to highlight that route on the map.</div><div class="kh">Shipping lanes</div>';
LN.forEach((r,i)=>s+=kr("l",i,r));s+='<div class="kh">Pipelines (dashed)</div>';PL.forEach((r,i)=>s+=kr("p",i,r));
info(s);document.querySelectorAll("#panel .kr").forEach(e=>e.onclick=()=>hl(e.dataset.k,+e.dataset.i))}
const kb=document.createElement("button");kb.textContent="Key";kb.className="kb";kb.textContent="Line key";kb.onclick=openKey;$("#tg").appendChild(kb);

const SV=map.querySelector("svg"),wx=document.createElement("canvas"),wp=document.createElement("canvas"),OV=document.createElementNS("http://www.w3.org/2000/svg","svg");
wx.id="wx";wp.id="wp";OV.id="ov";OV.setAttribute("viewBox","0 0 360 180");OV.setAttribute("preserveAspectRatio","none");
OV.innerHTML=`<path class="cst" d="${LAND}"/>`;const WL=document.createElement("div");WL.id="wxl";WL.append(wx,wp);SV.after(WL,OV);
[".bd",".L-lanes",".L-pipes"].forEach(s=>{const n=SV.querySelector(s);if(n)OV.appendChild(n)});
const SC={t:[[-35,"#7b3fa0"],[-20,"#3b5bd6"],[-8,"#4aa8e8"],[0,"#a9e3f2"],[8,"#5cc489"],[16,"#c9de52"],[24,"#f2b632"],[32,"#ea6a2a"],[42,"#b51f3a"]],
p:[[0,"#2a7fd400"],[.6,"#4aa3ff00"],[1.5,"#4aa3ff99"],[3,"#2f7de0dd"],[4,"#36b37e"],[8,"#f0d43a"],[15,"#f08a2a"],[30,"#d0304a"],[60,"#a03cc0"]],
w:[[0,"#2b3d7a"],[3,"#2f78b8"],[6,"#2fb0a8"],[9,"#5cc45c"],[12,"#d6d64a"],[16,"#f0a03a"],[20,"#e0503a"],[28,"#a8307a"]]};
const UN={t:"°C",p:"mm / 6h",w:"m/s"};
function hx(c){const n=parseInt(c.slice(1),16);return c.length>7?[n>>>24&255,n>>16&255,n>>8&255,(n&255)/255]:[n>>16&255,n>>8&255,n&255,1]}
const SCX={};for(const k in SC)SCX[k]=SC[k].map(([v,c])=>[v,hx(c)]);
function col(k,v){const s=SCX[k];if(v<=s[0][0])return s[0][1];for(let i=1;i<s.length;i++)if(v<=s[i][0]){const a=s[i-1],b=s[i],f=(v-a[0])/(b[0]-a[0]);return a[1].map((x,j)=>x+(b[1][j]-x)*f)}return s[s.length-1][1]}
let G=null,wm="p",wf=0,streak=true,PA=[],raf=0;
function gval(k,fr,ri,ci){const C=G.lons.length;ri=Math.max(0,Math.min(G.lats.length-1,ri));ci=((ci%C)+C)%C;const i=ri*C+ci;
if(k=="w"){const u=G.u[fr][i],v=G.v[fr][i];return Math.hypot(u,v)/10}return k=="p"?G.p[fr][i]/10:G.t[fr][i]}
/* Weather is drawn into a viewport-sized layer that sticks to the screen, so its cost no longer grows with zoom. */
const SCR=$("#scroll");let WSM=null,smKey="",wxRAF=0;const DPR=1;let AFT=[],ASK=0;
let GEO=null;function wlGeo(){const W=map.offsetWidth,H=map.offsetHeight,w=Math.min(SCR.clientWidth,W),h=Math.min(SCR.clientHeight,H);if(!GEO||GEO.w!=w||GEO.h!=h){WL.style.width=w+"px";WL.style.height=h+"px";WL.style.marginBottom=-h+"px"}GEO={W,H,w,h,ml:map.offsetLeft,mt:map.offsetTop};return GEO}
function wlSize(){const g=wlGeo();return[g.w,g.h]}
function wlOff(){const g=GEO||wlGeo();return[Math.max(0,Math.min(g.W-g.w,SCR.scrollLeft-g.ml)),Math.max(0,Math.min(g.H-g.h,SCR.scrollTop-g.mt))]}
function smGrid(){const key=wm+wf+(G?G.updated:"");if(WSM&&smKey==key)return WSM;const R=G.lats.length,C=G.lons.length,sm=document.createElement("canvas");sm.width=C+1;sm.height=R+2;const sx=sm.getContext("2d"),im=sx.createImageData(C+1,R+2);
for(let y=0;y<R+2;y++)for(let x=0;x<=C;x++){const v=gval(wm,wf,y-1,x),q=col(wm,v),o=(y*(C+1)+x)*4;im.data[o]=q[0];im.data[o+1]=q[1];im.data[o+2]=q[2];im.data[o+3]=q[3]*255}
sx.putImageData(im,0,0);WSM=sm;smKey=key;return sm}
function drawWx(){const[w,h]=wlSize();if(wx.width!=w||wx.height!=h){wx.width=w;wx.height=h}const c=wx.getContext("2d");c.clearRect(0,0,w,h);
if(!G||wm=="off"){legend();return}const sm=smGrid(),W=GEO.W,H=GEO.H,[ox,oy]=wlOff(),C=G.lons.length,R=G.lats.length,cw=W/C,ch=H/(R+1);
c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high";c.drawImage(sm,-cw/2-ox,-ch/2-oy,W+cw,H+ch);legend()}
SCR.addEventListener("scroll",()=>{if(!wxRAF)wxRAF=requestAnimationFrame(()=>{wxRAF=0;if(G&&wm!="off"&&GEO)drawWxFast()})},{passive:true});
function drawWxFast(){const c=wx.getContext("2d"),g=GEO,[ox,oy]=wlOff(),C=G.lons.length,R=G.lats.length,cw=g.W/C,ch=g.H/(R+1);c.clearRect(0,0,wx.width,wx.height);c.drawImage(smGrid(),-cw/2-ox,-ch/2-oy,g.W+cw,g.H+ch)}
function uv(lon,lat){const C=G.lons.length,R=G.lats.length,fx=(lon+180)/G.step,fy=(G.lats[0]-lat)/G.step,x0=Math.floor(fx),y0=Math.floor(fy),tx=fx-x0,ty=fy-y0;
const g=(a,ri,ci)=>{ri=Math.max(0,Math.min(R-1,ri));ci=((ci%C)+C)%C;return a[wf][ri*C+ci]/10};
const bl=a=>g(a,y0,x0)*(1-tx)*(1-ty)+g(a,y0,x0+1)*tx*(1-ty)+g(a,y0+1,x0)*(1-tx)*ty+g(a,y0+1,x0+1)*tx*ty;return[bl(G.u),bl(G.v)]}
function seed(W,H){return{x:Math.random()*W,y:Math.random()*H,a:Math.random()*80|0}}
function sizeP(){const[w,h]=wlSize();wp.width=Math.round(w*DPR);wp.height=Math.round(h*DPR);const n=Math.min(2600,Math.round(w*h/850));PA=Array.from({length:n},()=>seed(w,h));PO=null}
let PO=null;
function anim(ts){raf=0;const c=wp.getContext("2d");if(ts){AFT.push(ts);if(AFT.length>40)AFT.shift();const slow=AFT.length>20&&(AFT.at(-1)-AFT[0])/(AFT.length-1)>22;if(slow&&(ASK^=1)){raf=requestAnimationFrame(anim);return}}if(!G||wm=="off"||!streak){c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,wp.width,wp.height);return}
const g=GEO||wlGeo(),w=wp.width/DPR,h=wp.height/DPR,W=g.W,H=g.H,k=W/900*.16,[ox,oy]=wlOff();c.setTransform(DPR,0,0,DPR,0,0);
if(PO&&(PO[0]!=ox||PO[1]!=oy)){const dx=ox-PO[0],dy=oy-PO[1];for(const p of PA){p.x-=dx;p.y-=dy}c.clearRect(0,0,w,h)}PO=[ox,oy];
c.globalCompositeOperation="destination-in";c.fillStyle="rgba(0,0,0,.9)";c.fillRect(0,0,w,h);c.globalCompositeOperation="source-over";
c.strokeStyle="rgba(255,255,255,.75)";c.lineWidth=1;c.beginPath();
for(const p of PA){if(p.a--<=0||p.x<0||p.x>w||p.y<0||p.y>h){Object.assign(p,seed(w,h),{a:60+Math.random()*60|0});continue}
const lon=(p.x+ox)/W*360-180,lat=90-(p.y+oy)/H*180;if(lat>84||lat<-84){p.a=0;continue}const[u,v]=uv(lon,lat),nx=p.x+u*k,ny=p.y-v*k;
c.moveTo(p.x,p.y);c.lineTo(nx,ny);p.x=nx;p.y=ny}
c.stroke();raf=requestAnimationFrame(anim)}
function startA(){if(!raf)raf=requestAnimationFrame(anim)}
function legend(){const L=$("#wxlg");if(!G){L.innerHTML="";return}if(wm=="off"){L.innerHTML="";return}
const s=SC[wm],g=s.map(([v,c],i)=>`${c.length>7?c.slice(0,7)+(i?"":"00"):c} ${i/(s.length-1)*100}%`).join(",");
L.innerHTML=`<i style="background:linear-gradient(90deg,${g})"></i><small>${s[0][0]}</small><small>${UN[wm]}</small><small>${s[s.length-1][0]}+</small>`}
function tlabel(){if(!G){$("#wxtl").textContent="weather loading…";return}const d=new Date(G.times[wf]+"Z"),fh=wf*6;
$("#wxtl").textContent=(fh?"+"+fh+"h · ":"Now · ")+d.toLocaleString("en-GB",{weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Europe/London"})+" UK"}
function wxResize(){drawWx();sizeP();startA()}
[["off","Off"],["p","Rain"],["t","Temp"],["w","Wind"],["s","Streaks"]].forEach(([k,t])=>{const b=document.createElement("button");b.textContent=t;b.dataset.k=k;
b.onclick=()=>{if(k=="s"){streak=!streak}else wm=k;segs();drawWx();startA()};$("#wxm").appendChild(b)});
function segs(){document.body.classList.toggle("wxon",wm!="off");document.querySelectorAll("#wxm button").forEach(b=>b.classList.toggle("on",b.dataset.k=="s"?streak&&wm!="off":b.dataset.k==wm))}
$("#wxt").oninput=e=>{wf=+e.target.value;e.target.style.setProperty("--pc",wf/(+e.target.max||1)*100+"%");tlabel();drawWx()};
async function grid(){const m=location.hostname.match(/^([^.]+)\.github\.io$/),rp=location.pathname.split("/")[1];
const urls=m&&rp?[`https://raw.githubusercontent.com/${m[1]}/${rp}/data/grid.json?t=${Date.now()/3e5|0}`,"grid.json"]:["grid.json"];
for(const u of urls){try{const r=await fetch(u);if(r.ok){G=await r.json();break}}catch(e){}}
if(G){$("#wxt").max=G.times.length-1;$("#wxs").textContent="Model data via Open-Meteo, updated "+new Date(G.updated*1000).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
else $("#wxs").textContent="Weather layer not available yet";tlabel();wxResize()}
segs();grid();
function gridAt(lon,lat){if(!G)return null;const C=G.lons.length,Rn=G.lats.length,fx=(lon+180)/G.step,fy=(G.lats[0]-lat)/G.step,x0=Math.floor(fx),y0=Math.floor(fy),tx=fx-x0,ty=fy-y0;
const g=(a,ri,ci)=>{ri=Math.max(0,Math.min(Rn-1,ri));ci=((ci%C)+C)%C;return a[wf][ri*C+ci]};const bl=a=>g(a,y0,x0)*(1-tx)*(1-ty)+g(a,y0,x0+1)*tx*(1-ty)+g(a,y0+1,x0)*(1-tx)*ty+g(a,y0+1,x0+1)*tx*ty;
const u=bl(G.u)/10,v=bl(G.v)/10;return{t:bl(G.t),p:Math.max(0,bl(G.p)/10),ws:Math.hypot(u,v),wd:(Math.atan2(-u,-v)*180/Math.PI+360)%360}}
const CMP=d=>["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.round(d/22.5)%16];
const ll=(la,lo)=>`${Math.abs(la).toFixed(1)}°${la>=0?"N":"S"} ${Math.abs(lo).toFixed(1)}°${lo>=0?"E":"W"}`;
async function tapAt(lon,lat){document.querySelectorAll(".tapmk").forEach(x=>x.remove());const mk=document.createElement("div");mk.className="tapmk";mk.style.left=(lon+180)/3.6+"%";mk.style.top=(90-lat)/1.8+"%";map.appendChild(mk);
const gv=gridAt(lon,lat),near=R.map(r=>({n:r.n,d:km(lat,lon,r.lat,r.lon),i:R.indexOf(r)})).filter(x=>x.d<900).sort((a,b)=>a.d-b.d).slice(0,3),
nm=MK.map(m=>({n:m.n,k:m.k,d:km(lat,lon,m.lat,m.lon)})).sort((a,b)=>a.d-b.d)[0];
const when=G?$("#wxtl").textContent:"";
info(`<h2 data-tap>📍 ${ll(lat,lon)}</h2>${gv?`<div class="kh">Model grid · ${when}</div>
<div class="tgrid"><div><b>${f(gv.t,0)}°C</b><small>temperature</small></div><div><b>${f(gv.p,1)} mm</b><small>rain, 6 h</small></div><div><b>${f(gv.ws*3.6,0)} km/h</b><small>wind from ${CMP(gv.wd)}</small></div></div>
<div class="note">From the coarse global grid (about 650 km between points), so treat it as the regional picture. Move the forecast slider and tap again to see later times.</div>`:'<div class="note">Weather grid not loaded yet.</div>'}
<div class="kh">7-day outlook for this point</div><div id="tap7"><div class="note">Loading…</div></div>
${near.length?`<div class="kh">Nearby commodity regions</div>${near.map(x=>`<div class="row" style="cursor:pointer" onclick="show(${x.i})"><span>${x.n}</span><b>~${Math.round(x.d/50)*50} km ›</b></div>`).join("")}`:""}
${nm&&nm.d<1500?`<div class="row"><span>Nearest ${nm.k=="choke"?"chokepoint":"port"}</span><b>${nm.n} · ~${Math.round(nm.d/50)*50} km</b></div>`:""}`);
const box=$("#tap7");try{const q=new URLSearchParams({latitude:lat.toFixed(3),longitude:lon.toFixed(3),daily:"precipitation_sum,temperature_2m_max,temperature_2m_min,wind_speed_10m_max",forecast_days:7,timezone:"auto"});
const j=await(await fetch("https://api.open-meteo.com/v1/forecast?"+q)).json(),d=j.daily;if(!d)throw 0;if(!box.isConnected)return;
box.innerHTML=`<table class="ftb"><tr><th>Day</th><th>Rain</th><th>High / low</th><th>Wind max</th></tr>${d.time.map((t,i)=>`<tr><td>${new Date(t+"T12:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric"})}</td><td>${f(d.precipitation_sum[i],1)} mm</td><td>${f(d.temperature_2m_max[i],0)}° / ${f(d.temperature_2m_min[i],0)}°</td><td>${f(d.wind_speed_10m_max[i],0)} km/h</td></tr>`).join("")}</table><div class="note">Point forecast from Open-Meteo, local days.</div>`}
catch(e){if(box.isConnected)box.innerHTML='<div class="note">The detailed point forecast isn\'t reachable from this network. The grid values above still apply.</div>'}}
let tapT=null;map.addEventListener("click",e=>{if(e.target.closest(".pin,.mk,.hit,.enr,.ssym,.tapmk"))return;const r=map.getBoundingClientRect(),lon=(e.clientX-r.left)/r.width*360-180,lat=90-(e.clientY-r.top)/r.height*180;
if(lat>85||lat<-85)return;clearTimeout(tapT);tapT=setTimeout(()=>tapAt(lon,lat),260)});
map.addEventListener("dblclick",()=>clearTimeout(tapT));

map.classList.add("off-enso");{const eb=document.querySelector('#tg button[data-k="enso"]');if(eb)eb.classList.add("off")}
const SM=["DJF","JFM","FMA","MAM","AMJ","MJJ","JJA","JAS","ASO","SON","OND","NDJ"],SMN=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ENI=[
{n:"West Africa cocoa belt",b:[-9,4,2,10.5],m:[12,1,2],e:"dry"},
{n:"Southern Africa",b:[16,-34,36,-14],m:[12,1,2,3],e:"dry"},
{n:"Maritime Southeast Asia",b:[94,-10,142,8.5],m:[6,7,8,9,10,11],e:"dry"},
{n:"Northern Australia & eastern Indonesia",b:[118,-20,150,-8],m:[12,1,2,3],e:"dry"},
{n:"Eastern Australia",b:[138,-39,154,-24],m:[6,7,8,9,10,11],e:"dry"},
{n:"India (monsoon)",b:[68,8,89,31],m:[6,7,8,9],e:"dry"},
{n:"Northern South America",b:[-76,-5,-44,10],m:[12,1,2,3],e:"dry"},
{n:"Central America & Caribbean",b:[-92,8,-60,20],m:[6,7,8,9,10],e:"dry"},
{n:"Sahel",b:[-16,10,30,18],m:[7,8,9],e:"dry"},
{n:"Southeast South America",b:[-62,-36,-48,-22],m:[9,10,11,12,1],e:"wet"},
{n:"Peru & Ecuador coast",b:[-82,-9,-78,0],m:[12,1,2,3],e:"wet"},
{n:"East Africa (short rains)",b:[33,-8,45,5],m:[10,11,12],e:"wet"},
{n:"Southern US & Gulf coast",b:[-110,25,-78,36],m:[11,12,1,2,3],e:"wet"},
{n:"Central Chile",b:[-74,-38,-69,-30],m:[6,7,8],e:"wet"},
{n:"Northern US & Canada",b:[-127,38,-75,58],m:[12,1,2],e:"warm"}];
let EN=null;
const enStr=v=>{const a=Math.abs(v);return a<.5?"neutral":a<1?"weak":a<1.5?"moderate":a<2?"strong":"very strong"};
function enPhase(){if(!EN)return 0;const s=(EN.status||"").toLowerCase(),v=EN.roni&&EN.roni.length?EN.roni[EN.roni.length-1][2]:0;
if(s.includes("el ni")&&s.includes("advisory"))return 1;if(s.includes("la ni")&&s.includes("advisory"))return -1;return v>=.5?1:v<=-.5?-1:0}
const effOf=(r,ph)=>ph>0?r.e:r.e=="dry"?"wet":r.e=="wet"?"dry":"cold";
const effTxt={dry:"drier than usual",wet:"wetter than usual",warm:"milder winter than usual",cold:"colder winter than usual"};
const mRange=m=>m.length==1?SMN[m[0]-1]:SMN[m[0]-1]+"–"+SMN[m[m.length-1]-1];
function enRegionsFor(lat,lon){return ENI.filter(r=>lon>=r.b[0]&&lon<=r.b[2]&&lat>=r.b[1]&&lat<=r.b[3])}
function enNote(r){const ph=enPhase();if(!ph||(r.nw&&r.n!="Nat gas"))return"";const rs=enRegionsFor(r.lat,r.lon);if(!rs.length)return"";const nm=ph>0?"El Niño":"La Niña",m=new Date().getMonth()+1;
return rs.map(x=>`<div class="row" style="cursor:pointer" onclick="showEnso()"><span>🌊 ${nm} (${enStr(EN.roni.at(-1)[2])})</span><b class="wrap">Typically ${effTxt[effOf(x,ph)]} here ${mRange(x.m)}${x.m.includes(m)?" · now":""} ›</b></div>`).join("")}
function drawEnLayer(){let g=OV.querySelector("g.L-enso");if(!g){g=document.createElementNS("http://www.w3.org/2000/svg","g");g.setAttribute("class","L-enso");OV.insertBefore(g,OV.firstChild.nextSibling)}g.innerHTML="";
const ph=enPhase();if(!ph)return;const m=new Date().getMonth()+1,soon=[m,m%12+1,(m+1)%12+1];
ENI.forEach((r,i)=>{if(!r.m.some(x=>soon.includes(x)))return;const e=effOf(r,ph);
g.insertAdjacentHTML("beforeend",`<rect class="enr en-${e}" data-i="${i}" x="${r.b[0]+180}" y="${90-r.b[3]}" width="${r.b[2]-r.b[0]}" height="${r.b[3]-r.b[1]}" rx="2"/>`)});
g.querySelectorAll(".enr").forEach(el=>el.onclick=()=>{const r=ENI[+el.dataset.i];info(`<h2>🌊 ${r.n}</h2><div class="row"><span>Typical ${ph>0?"El Niño":"La Niña"} effect</span><b class="wrap">${effTxt[effOf(r,ph)]}</b></div><div class="row"><span>Season</span><b>${mRange(r.m)}</b></div>
<div class="note">A typical pattern from past events, not a forecast. Individual events differ. <a href="#" onclick="showEnso();return false" style="color:inherit">ENSO detail ›</a></div>`)})}
function lineChart(box,o){const W=box.clientWidth||340,Ht=o.h||170,pl=4,pr=40,pt=8,pb=20,iw=W-pl-pr,ih=Ht-pt-pb,N=o.labels.length;
const all=o.series.flatMap(s=>s.v.filter(v=>v!=null));let lo=Math.min(-.6,...all),hi=Math.max(.6,...all);const pd=(hi-lo)*.06;lo-=pd;hi+=pd;
const x=i=>pl+i/(N-1)*iw,y=v=>pt+(hi-v)/(hi-lo)*ih;let g="";
[[.5,1,"#eb683414"],[1,1.5,"#eb683428"],[1.5,2,"#eb68343d"],[2,9,"#eb683455"],[-1,-.5,"#2a78d614"],[-1.5,-1,"#2a78d628"],[-2,-1.5,"#2a78d63d"],[-9,-2,"#2a78d655"]].forEach(([a,b,c])=>{const A=Math.max(lo,Math.min(hi,a)),Bv=Math.max(lo,Math.min(hi,b));if(Bv>A)g+=`<rect x="${pl}" width="${iw}" y="${y(Bv)}" height="${y(A)-y(Bv)}" fill="${c}"/>`});
[[.5,"weak"],[1,"moderate"],[1.5,"strong"],[2,"very strong"]].forEach(([v,t])=>{if(v<hi-.1)g+=`<text x="${pl+3}" y="${y(v)-3}" class="ax bl">${t}</text>`});
const tks=[];for(let t=Math.ceil(lo*2)/2;t<=hi;t+=.5)tks.push(t);const st=tks.length>8?2:1;tks.forEach((t,k)=>{if(k%st)return;g+=`<line x1="${pl}" x2="${pl+iw}" y1="${y(t)}" y2="${y(t)}" class="gl"${t==0?' style="stroke:var(--mut)"':""}/><text x="${W-2}" y="${y(t)+3.5}" class="ax" text-anchor="end">${t>0?"+":""}${t.toFixed(1)}</text>`});
o.labels.forEach((l,i)=>{if(l&&o.tick(i))g+=`<text x="${x(i)}" y="${Ht-5}" class="ax" text-anchor="middle">${l}</text>`});
o.series.forEach(s=>{let d="",on=0;s.v.forEach((v,i)=>{if(v==null){on=0;return}d+=(on?"L":"M")+x(i).toFixed(1)+" "+y(v).toFixed(1);on=1});g+=`<path d="${d}" fill="none" stroke="${s.c}" stroke-width="${s.w||2}" stroke-linejoin="round" stroke-linecap="round"/>`});
const last=o.series[0];for(let i=N-1;i>=0;i--)if(last.v[i]!=null){g+=`<circle cx="${x(i)}" cy="${y(last.v[i])}" r="4" fill="${last.c}" stroke="var(--card)" stroke-width="2"/>`;break}
box.innerHTML=`<svg width="${W}" height="${Ht}" class="chs">${g}<line class="cx" y1="${pt}" y2="${pt+ih}" style="display:none"/><rect x="${pl}" y="0" width="${iw}" height="${Ht}" fill="transparent" class="hz"/></svg><div class="tt" style="display:none"></div>`;
const hz=box.querySelector(".hz"),cx=box.querySelector(".cx"),tt=box.querySelector(".tt");
const mv=e=>{const px=e.clientX-hz.getBoundingClientRect().left,i=Math.max(0,Math.min(N-1,Math.round(px/iw*(N-1))));cx.setAttribute("x1",x(i));cx.setAttribute("x2",x(i));cx.style.display="";
tt.textContent="";const hd=document.createElement("div");hd.className="th";hd.textContent=o.full(i);tt.appendChild(hd);
o.series.forEach(s=>{const v=s.v[i];if(v==null)return;const rw=document.createElement("div");rw.className="tr";const k=document.createElement("i");k.style.background=s.c;const b=document.createElement("b");b.textContent=(v>0?"+":"")+v.toFixed(2);const sp=document.createElement("span");sp.textContent=s.n+" · "+enStr(v);rw.append(k,b,sp);tt.appendChild(rw)});
tt.style.display="";const tw=tt.offsetWidth;tt.style.left=(x(i)>W/2?Math.max(0,x(i)-tw-10):Math.min(W-tw,x(i)+10))+"px"};
hz.addEventListener("pointermove",mv);hz.addEventListener("pointerdown",mv);hz.addEventListener("pointerleave",()=>{cx.style.display="none";tt.style.display="none"})}
function gauge(v){const a=Math.max(-3,Math.min(3,v)),W=240,H=130,cx=120,cy=115,R=95,ang=t=>Math.PI*(1-(t+3)/6),pt=(t,r)=>[cx+r*Math.cos(ang(t)),cy-r*Math.sin(ang(t))];
const arc=(t0,t1,c)=>{const[a0,b0]=pt(t0,R),[a1,b1]=pt(t1,R);return`<path d="M${a0} ${b0}A${R} ${R} 0 0 1 ${a1} ${b1}" stroke="${c}" stroke-width="14" fill="none"/>`};
let s=[[-3,-2,"#2a78d6"],[-2,-1.5,"#2a78d6bb"],[-1.5,-1,"#2a78d688"],[-1,-.5,"#2a78d655"],[-.5,.5,"#8a949a55"],[.5,1,"#eb683455"],[1,1.5,"#eb683488"],[1.5,2,"#eb6834bb"],[2,3,"#eb6834"]].map(([p,q,c])=>arc(p+.02,q-.02,c)).join("");
const[nx,ny]=pt(a,R-22);s+=`<line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="6" fill="var(--ink)"/>`;
[[-2,"−2"],[0,"0"],[2,"+2"]].forEach(([t,l])=>{const[a1,b1]=pt(t,R+16);s+=`<text x="${a1}" y="${b1+4}" text-anchor="middle" class="ax">${l}</text>`});
s+=`<text x="16" y="${H-2}" class="ax">La Niña</text><text x="${W-16}" y="${H-2}" class="ax" text-anchor="end">El Niño</text>`;
return`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block;margin:6px auto 0" role="img" aria-label="ENSO gauge at ${v.toFixed(2)}">${s}</svg>`}
function showEnso(){if(!EN)return;const ph=enPhase(),rv=EN.roni.at(-1),ov=EN.oni&&EN.oni.at(-1),nm=ph>0?"El Niño":ph<0?"La Niña":"ENSO-neutral",m=new Date().getMonth()+1,soon=[m,m%12+1,(m+1)%12+1];
const act=ph?ENI.filter(r=>r.m.some(x=>soon.includes(x))):[];
info(`<h2>🌊 ${nm}${ph?" · "+enStr(rv[2]):""}</h2>${gauge(rv[2])}<div style="text-align:center;font-size:12px;color:var(--mut);margin-bottom:6px">Official index (RONI) ${rv[2]>0?"+":""}${rv[2].toFixed(2)} for ${rv[0]} ${rv[1]}</div>
${EN.synopsis?`<div class="syn">“${EN.synopsis}”<small>NOAA Climate Prediction Center${EN.issued?", "+EN.issued:""}</small></div>`:""}
<div class="row"><span>NOAA alert status</span><b>${EN.status||"—"}</b></div>
${ov?`<div class="row"><span>Traditional index (ONI), ${ov[0]} ${ov[1]}</span><b>${ov[2]>0?"+":""}${ov[2].toFixed(2)} · ${enStr(ov[2])}</b></div>`:""}
${EN.weekly?`<div class="row"><span>Latest weekly Niño-3.4</span><b>${EN.weekly.nino34>0?"+":""}${EN.weekly.nino34.toFixed(1)}°C</b></div>`:""}
${(EN.odds||[]).map(s=>`<div class="note">${s}</div>`).join("")}
<div class="kh">Intensity, last 2½ years</div><div class="lgd"><span><i style="background:var(--s1)"></i>Official (RONI)</span><span><i style="background:var(--s2)"></i>Traditional (ONI)</span></div><div id="enc1" class="pc"></div>
<div class="kh">Compared with past big El Niños</div><div class="lgd" style="flex-wrap:wrap"><span><i style="background:var(--s1);height:3px"></i>${new Date().getFullYear()}–${String(new Date().getFullYear()+1).slice(2)}</span><span><i style="background:var(--s2)"></i>1997–98</span><span><i style="background:var(--s3)"></i>2015–16</span><span><i style="background:var(--s4)"></i>2023–24</span></div><div id="enc2" class="pc"></div>
<div class="note" style="margin-top:2px">Traditional index, lined up by calendar month from January of the onset year.</div>
${ph?`<div class="kh">Typical ${nm} effects, next 3 months</div><ul class="dl">${act.map(r=>`<li><b>${r.n}</b> · ${effTxt[effOf(r,ph)]} (${mRange(r.m)})</li>`).join("")}</ul><button id="enmap" style="margin-top:8px;font-size:12px;padding:5px 12px">${map.classList.contains("off-enso")?"Show":"Hide"} on map</button>`:""}
<div class="kh">Ocean temperatures now</div><img src="${EN.fig1}" alt="NOAA map of sea surface temperature anomalies" style="width:100%;border-radius:8px;background:#fff" onerror="this.previousElementSibling.remove();this.nextElementSibling.remove();this.remove()"><div class="note">NOAA's sea surface temperature anomaly map (Figure 1 of its latest discussion). Warm colours along the equatorial Pacific mark El Niño.</div>
<div class="note">Strength bands (0.5 / 1.0 / 1.5 / 2.0°C) are the conventional thresholds. Impacts are typical patterns, not forecasts.${EN.next?" Next NOAA update: "+EN.next+".":""}</div>`);
const ix=(a,s,y)=>{const k=a.findIndex(r=>r[0]==s&&r[1]==y);return k<0?null:a[k][2]};
const tailN=30,R0=EN.roni.slice(-tailN),lab=R0.map(r=>SMN[SM.indexOf(r[0])]),yrs=R0.map(r=>r[1]);
lineChart($("#enc1"),{labels:lab,tick:i=>SM.indexOf(R0[i][0])%3==0,full:i=>R0[i][0]+" "+R0[i][1],series:[{n:"Official RONI",c:"var(--s1)",v:R0.map(r=>r[2]),w:2.5},{n:"Traditional ONI",c:"var(--s2)",v:R0.map(r=>EN.oni?ix(EN.oni,r[0],r[1]):null)}]});
const cy=new Date().getFullYear(),evs=[[cy,"var(--s1)",3],[1997,"var(--s2)"],[2015,"var(--s3)"],[2023,"var(--s4)"]],L2=[];for(let k=0;k<24;k++)L2.push(SMN[k%12]);
lineChart($("#enc2"),{labels:L2,tick:i=>i%6==0,full:i=>SMN[i%12]+(i<12?", onset year":", following year"),h:180,series:evs.map(([y0,c,w])=>({n:y0+"–"+String(y0+1).slice(2),c,w:w||1.75,v:Array.from({length:24},(_,k)=>EN.oni?ix(EN.oni,SM[k%12],y0+(k<12?0:1)):null)}))});
const bm=$("#enmap");if(bm)bm.onclick=()=>{const off=map.classList.toggle("off-enso");bm.textContent=(off?"Show":"Hide")+" on map";const eb=document.querySelector('#tg button[data-k="enso"]');if(eb)eb.classList.toggle("off",off)}}
(async()=>{try{const r=await fetch("enso.json?t="+(Date.now()/36e5|0));if(!r.ok)return;EN=await r.json();if(!EN.roni||!EN.roni.length)return;
const ph=enPhase(),v=EN.roni.at(-1)[2],b=$("#enb");b.textContent=`🌊 ${ph>0?"El Niño":ph<0?"La Niña":"ENSO neutral"}${ph?" · "+enStr(v):""}`;b.className="enb "+(ph>0?"pos":ph<0?"neg":"");b.style.display="";b.onclick=showEnso;drawEnLayer()}catch(e){}})();

const ALLC=R.map(r=>r.n),GR=["Corn","Wheat","Soybeans","Cotton","Rice"];
const TZF={};function tzAt(y,mo,d,hh,mi,tz){const g=Date.UTC(y,mo-1,d,hh,mi);const p=(TZF[tz]||(TZF[tz]=new Intl.DateTimeFormat("en-US",{timeZone:tz,timeZoneName:"shortOffset"}))).formatToParts(new Date(g)).find(x=>x.type=="timeZoneName").value;
const m=p.match(/GMT([+-]\d+)(?::(\d+))?/),off=m?(+m[1])*60+Math.sign(+m[1])*(+(m[2]||0)):0;return new Date(g-off*6e4)}
const ET=(s,hm)=>{const[y,mo,d]=s.split("-").map(Number),[hh,mi]=hm.split(":").map(Number);return tzAt(y,mo,d,hh,mi,"America/New_York")};
const EVF=[];const add=(t,n,c,k,x={})=>EVF.push(Object.assign({t,n,c,k},x));
["2026-11-10","2026-12-10"].forEach(d=>add(ET(d,"12:00"),"USDA WASDE",[...GR,"Sugar"],"r"));
["2026-10-28","2026-12-09","2027-01-27","2027-03-17","2027-04-28","2027-06-09","2027-07-28","2027-09-15","2027-10-27","2027-12-08"].forEach(d=>add(ET(d,"14:00"),"Fed rate decision (FOMC)",["Gold","Silver","Crude oil","Copper"],"m"));
["2026-11-10","2026-12-10","2027-01-13","2027-02-11","2027-03-10","2027-04-13","2027-05-12","2027-06-10","2027-07-14","2027-08-11","2027-09-14","2027-10-14","2027-11-10","2027-12-10"].forEach(d=>add(ET(d,"08:30"),"US CPI inflation",["Gold","Silver"],"r"));
add(ET("2026-11-01","09:00"),"OPEC+ meeting (7 countries)",["Crude oil"],"m",{ap:"time not announced"});
add(ET("2027-01-15","09:00"),"Q4 cocoa grind data",["Cocoa"],"r",{ap:"approximate date"});add(ET("2027-04-15","09:00"),"Q1 cocoa grind data",["Cocoa"],"r",{ap:"approximate date"});
for(let k=0;k<14;k++){const d=new Date(Date.UTC(2026,10+k,10)),wd=d.getUTCDay(),dd=wd==6?12:wd==0?11:10;add(tzAt(d.getUTCFullYear(),d.getUTCMonth()+1,dd,12,30,"Asia/Kuala_Lumpur"),"Malaysian palm oil data (MPOB)",["Palm oil"],"r",{ap:"around the 10th"})}
const US=[["2026-11-26","Thanksgiving"],["2026-12-25","Christmas"],["2027-01-01","New Year's Day"],["2027-01-18","Martin Luther King Day"],["2027-02-15","Presidents' Day"],["2027-03-26","Good Friday"],["2027-05-31","Memorial Day"],["2027-06-18","Juneteenth (observed)"],["2027-07-05","Independence Day (observed)"],["2027-09-06","Labor Day"],["2027-11-25","Thanksgiving"],["2027-12-24","Christmas (observed)"]];

let HOL=null;
function holEvents(){if(!HOL)return[];const by={};
HOL.x.forEach(x=>[["closed","closed"],["short","shortened session"],["early","early close"]].forEach(([k,st])=>Object.entries(x[k]).forEach(([d,n])=>{(by[d]=by[d]||[]).push({x:x.label,code:x.code,f:x.flag,s:st,n,c:x.c,note:x.note})})));
return Object.entries(by).map(([d,it])=>{const[y,mo,dd]=d.split("-").map(Number);const cl=it.filter(i=>i.s=="closed"),oth=it.filter(i=>i.s!="closed");
const fl=[...new Set(it.map(i=>i.f))],flags=fl.slice(0,4).join("")+(fl.length>4?"+":"");const nms=[...new Set(it.map(i=>i.n.replace(/ \(observed\)/,"").replace(/^Early close \((.*)\)$/,"$1").replace(/ \(Spring Festival\)/,"")))],nm=nms.length==1?nms[0]:"Market holidays";
const short=[cl.length?cl.map(i=>i.code).join(", ")+" closed":"",oth.length?oth.map(i=>i.code).join(", ")+" "+(oth[0].s=="early close"?"early close":"shortened"):""].filter(Boolean).join("; ");
return{t:tzAt(y,mo,dd,0,0,"Europe/London"),n:flags+" "+nm+": "+short,c:[...new Set(it.flatMap(i=>i.c))],k:"h",allday:1,items:it,tz:"Europe/London"}})}
(async()=>{try{const r=await fetch("holidays.json?t="+(Date.now()/36e5|0));if(r.ok){HOL=await r.json();ticker()}}catch(e){}})();
function hol(d){const s=d.toLocaleDateString("en-CA",{timeZone:"America/New_York"});return US.some(x=>x[0]==s)}
function weekly(){const out=[],now=new Date(),thx=US.filter(x=>x[1]=="Thanksgiving").map(x=>x[0]);
for(let k=-1;k<60;k++){const d=new Date(now.getTime()+k*864e5),s=d.toLocaleDateString("en-CA",{timeZone:"America/New_York"}),wd=new Date(s+"T12:00:00Z").getUTCDay();
const mon=new Date(new Date(s+"T12:00:00Z").getTime()-((wd+6)%7)*864e5),wk=[0,1,2,3,4].map(i=>new Date(mon.getTime()+i*864e5).toISOString().slice(0,10)),hw=US.some(x=>wk.includes(x[0])),th=thx.some(x=>wk.includes(x));
const fl=hw?{ap:"holiday week: timing may shift"}:{};const P=(n,hm,c,dd=s)=>out.push(Object.assign({t:ET(dd,hm),n,c,k:"r"},fl));
const sh=(n)=>{const x=new Date(new Date(s+"T12:00:00Z").getTime()+n*864e5);return x.toISOString().slice(0,10)};
if(wd==3)P("EIA crude oil inventories",hw?"11:00":"10:30",["Crude oil"],hw&&!th?sh(1):s);
if(wd==4)th?P("EIA natural gas storage","12:00",["Nat gas"],sh(-1)):P("EIA natural gas storage","10:30",["Nat gas"]);
if(wd==4)P("USDA export sales","08:30",GR,th?sh(1):s);
if(wd==5)P("Baker Hughes rig count","13:00",["Crude oil","Nat gas"],th?sh(-1):s);
if(wd==5)P("CFTC positioning (COT)","15:30",ALLC,th?sh(3):s);
if(wd==1&&(d<new Date("2026-12-01")||(d>=new Date("2027-04-05")&&d<new Date("2027-12-01")))&&!hol(d))P("USDA crop progress","16:00",["Corn","Soybeans","Cotton","Wheat"])}
return out}
let EVS=[];function evRefresh(){const now=Date.now();const seen=new Set();EVS=[...EVF,...weekly(),...holEvents()].filter(e=>{const k=e.n+e.t.getTime();if(seen.has(k))return false;seen.add(k);return true}).filter(e=>e.t.getTime()+(e.allday?864e5:36e5)>now).sort((a,b)=>a.t-b.t)}
const UKT={timeZone:"Europe/London"};const fmtT=e=>e.allday?e.t.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",timeZone:e.tz||"America/New_York"}):e.t.toLocaleString("en-GB",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",hour12:false,...UKT})+" UK";
function cd(e){const ms=e.t-Date.now();if(ms<=0)return e.allday?"today":"now";const m=Math.round(ms/6e4),d=Math.floor(m/1440),hh=Math.floor(m%1440/60),mm=m%60;return d?`in ${d}d ${hh}h`:hh?`in ${hh}h ${mm}m`:`in ${mm}m`}
function evRow(e){const el=document.createElement("div");el.className="evr ev"+e.k;const a=document.createElement("b");a.textContent=e.n;const t=document.createElement("small");t.textContent=fmtT(e)+" · ";const c=document.createElement("span");c.className="cd";c.dataset.t=e.t.getTime();c.textContent=cd(e);t.appendChild(c);
if(e.items){a.textContent=e.n.split(":")[0]+": market holiday";el.append(a,t);e.items.forEach(i=>{const s=document.createElement("small");s.className="hx";const st=document.createElement("b");st.textContent=i.s;s.append(i.f+" "+i.x+" · ",st,i.n&&!i.n.startsWith("Early close")?" ("+i.n.replace(/\s*\(observed\)/," observed")+")":"");el.appendChild(s);if(i.note){const nt=document.createElement("small");nt.className="tg hn";nt.textContent=i.note;el.appendChild(nt)}});return el}
const tg=document.createElement("small");tg.className="tg";tg.textContent=(e.c.length>=ALLC.length?"All markets":e.c.join(", "))+(e.ap?" · "+e.ap:"");el.append(a,t,tg);return el}
let evf="all";
function calBody(container,days){container.textContent="";const fl=document.createElement("div");fl.className="seg";[["all","All"],["r","Reports"],["m","Central banks & OPEC"],["h","Holidays"]].forEach(([k,t])=>{const b=document.createElement("button");b.textContent=t;b.classList.toggle("on",evf==k);b.onclick=()=>{evf=k;calBody(container,days)};fl.appendChild(b)});container.appendChild(fl);
const lim=Date.now()+days*864e5;let last="";EVS.filter(e=>e.t<lim&&(evf=="all"||e.k==evf)).forEach(e=>{const dl=e.t.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",...UKT});if(dl!=last){const hd=document.createElement("div");hd.className="kh";hd.textContent=dl;container.appendChild(hd);last=dl}container.appendChild(evRow(e))});
const nt=document.createElement("div");nt.className="note";nt.textContent="Times are UK time (GMT/BST), converted from each exchange's local time. Holidays come from published exchange calendars, refreshed weekly; check your broker for exact session hours. Weekly US reports move in holiday weeks, so confirm exact times on the day. 2027 WASDE dates are not published yet.";container.appendChild(nt)}
function openCal(){info('<h2>Market calendar</h2><div id="calp"></div>');calBody($("#calp"),45)}
function wkRange(){const uk=d=>d.toLocaleDateString("en-CA",{timeZone:"Europe/London"}),t=uk(new Date()),wd=new Date(t+"T12:00:00Z").getUTCDay(),
mon=new Date(new Date(t+"T12:00:00Z").getTime()+(wd==0?1:1-wd)*864e5),fri=new Date(mon.getTime()+4*864e5);return[mon.toISOString().slice(0,10),fri.toISOString().slice(0,10),uk]}
function ticker(){evRefresh();const tk=$("#tk");tk.textContent="";const[wm,wf,uk]=wkRange();
const inWk=e=>{const d=uk(e.t);return d>=wm&&d<=wf};let items=EVS.filter(e=>e.t<Date.now()+10*864e5&&(!e.items||inWk(e)));
if(HOL&&!EVS.some(e=>e.items&&inWk(e)))items.unshift({n:"✓ No market holidays this week",t:new Date(wm+"T00:00:00Z"),c:[],k:"h",allday:1,tz:"Europe/London",none:1});
items=items.slice(0,14);const brk=nwBreaking().slice(0,4);
const mk=()=>{const f=document.createDocumentFragment();brk.forEach(x=>{const s=document.createElement("span");s.className="ti evn";const n=document.createElement("b");n.textContent=x.t;const t=document.createElement("span");t.textContent="· "+x.s+" ·";const a=document.createElement("span");a.className="ago";a.textContent=ago(x.d);s.append(n,t,a);f.appendChild(s)});items.forEach(e=>{const s=document.createElement("span");s.className="ti ev"+e.k;const n=document.createElement("b");n.textContent=e.n;const t=document.createElement("span");t.textContent="· "+fmtT(e)+" ·";if(e.none){s.append(n);f.appendChild(s);return}const c=document.createElement("span");c.className="cd";c.dataset.t=e.t.getTime();c.textContent=cd(e);s.append(n,t,c);f.appendChild(s)});return f};
const a=document.createElement("div");a.className="tseq";a.appendChild(mk());const b=a.cloneNode(true);b.setAttribute("aria-hidden","true");tk.append(a,b);
tk.style.animationDuration=Math.max(30,a.scrollWidth/40)+"s";
if(matchMedia("(prefers-reduced-motion: reduce)").matches){clearInterval(window._tkI);let ti=0;const its=[...a.children];const show=()=>{if(!its.length)return;tk.classList.add("fade");setTimeout(()=>{tk.style.transform=`translateX(${-its[ti].offsetLeft+14}px)`;tk.classList.remove("fade");ti=(ti+1)%its.length},350)};show();window._tkI=setInterval(show,5000)}
const side=$("#calside");side.textContent="";const hd=document.createElement("div");hd.className="sh";hd.textContent="Next 14 days";side.appendChild(hd);const bx=document.createElement("div");side.appendChild(bx);calBody(bx,14);
document.querySelectorAll(".chip.evsoon").forEach(x=>x.classList.remove("evsoon"));const soon=Date.now()+864e5;
R.forEach((r,i)=>{if(EVS.some(e=>e.t<soon&&e.k!="h"&&e.c.length<ALLC.length&&e.c.includes(r.n))){const c=$("#c"+i);c&&c.classList.add("evsoon")}});}
function evFor(r){const sn=new Set(),L=EVS.filter(e=>!e.items&&e.c.includes(r.n)&&e.c.length<ALLC.length&&!sn.has(e.n)&&sn.add(e.n)).slice(0,4).concat(EVS.filter(e=>e.items&&e.c.includes(r.n)).slice(0,2).map(e=>{const it=e.items.filter(i=>i.c.includes(r.n));return Object.assign({},e,{n:[...new Set(it.map(i=>i.f))].join("")+" "+it.map(i=>i.code+" "+(i.s=="closed"?"closed":i.s)).join(", ")+" ("+it[0].n.replace(/^Early close \((.*)\)$/,"$1")+")"})}));if(!L.length)return"";
return'<div class="kh">Upcoming events</div><div class="evl">'+L.sort((a,b)=>a.t-b.t).map(e=>`<div class="evr ev${e.k}"><b>${e.n}</b><small>${fmtT(e)} · <span class="cd" data-t="${e.t.getTime()}">${cd(e)}</span>${e.ap?" · "+e.ap:""}</small></div>`).join("")+"</div>"}






/* ---- earthquakes (USGS live feed) and plate boundaries (Bird 2003 via Ahlenius/Nordpil, ODC-By) ---- */

fetch("faults.json").then(r=>r.json()).then(FLT=>{let g=document.createElementNS("http://www.w3.org/2000/svg","g");g.setAttribute("class","L-quake");let d="";FLT.forEach(a=>{for(let i=0;i<a.length;i+=2)d+=(i?"L":"M")+(a[i]+180).toFixed(1)+" "+(90-a[i+1]).toFixed(1)});g.innerHTML=`<path class="flt" d="${d}"/>`;OV.insertBefore(g,OV.firstChild.nextSibling)})
const MINES=[["Escondida copper mine",-24.27,-69.07],["Collahuasi copper mine",-20.98,-68.64],["Codelco El Teniente copper mine",-34.09,-70.35],["Antamina copper-zinc mine",-9.54,-77.05],["Las Bambas copper mine",-14.21,-72.1],["Cerro Verde copper mine",-16.53,-71.6],["Grasberg copper-gold mine",-4.05,137.11],["Morenci copper mine",33.08,-109.36],["Cobre Panamá copper mine",8.84,-80.65],["Kamoa-Kakula copper mine",-10.8,25.4],["Oyu Tolgoi copper mine",43.0,106.85],["Norilsk nickel-palladium",69.35,88.2],["Weda Bay nickel",0.47,127.9],["Sorowako nickel",-2.53,121.36],["Carajás iron ore",-6.06,-50.17],["Greenbushes lithium",-33.86,116.06],["Atacama lithium brines",-23.5,-68.3],["Taiwan chip fabs (Hsinchu)",24.8,120.97],["Kashiwazaki-Kariwa nuclear",37.43,138.6]];
let QK=[];
function qAssets(lat,lon){const out=[],add=(n,la,lo,k)=>{const d=km(lat,lon,la,lo);if(d<350)out.push({n,d,k})};
R.forEach(r=>add(r.n+" ("+r.loc+")",r.lat,r.lon,"Commodity"));MK.forEach(m=>add(m.n,m.lat,m.lon,m.k=="choke"?"Chokepoint":"Port"));REFS.forEach(r=>add(r[0]+" refinery",r[1],r[2],"Refinery"));MINES.forEach(m=>add(m[0],m[1],m[2],"Mine / site"));return out.sort((a,b)=>a.d-b.d)}
const QC={green:"#3fcf8e",yellow:"#f2c94c",orange:"#ff8a3d",red:"#ff4d4d"};
function showQuake(q){const p=q.properties,[lon,lat,dep]=q.geometry.coordinates,A=qAssets(lat,lon),al=p.alert;
info(`<h2>M${p.mag.toFixed(1)} · ${esc(p.place||"Earthquake")}</h2>
<div class="row"><span>Time</span><b>${new Date(p.time).toLocaleString("en-GB",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Europe/London"})} UK · ${ago(p.time/1000)}</b></div>
<div class="row"><span>Depth</span><b>${Math.round(dep)} km${dep<70?" (shallow: stronger shaking)":""}</b></div>
<div class="row"><span>USGS damage estimate</span><b>${al?`<span class="qtag" style="--qc:${QC[al]}">${al[0].toUpperCase()+al.slice(1)}</span>`:"Not issued"}</b></div>
${p.tsunami?'<div class="row"><span>Tsunami</span><b>Ocean event flagged; check official warnings</b></div>':""}
<div class="kh">Within 350 km</div>${A.length?A.slice(0,8).map(a=>`<div class="row"><span>${esc(a.n)}<small class="dn2">${a.k}</small></span><b>${Math.round(a.d)} km</b></div>`).join(""):'<div class="note" style="margin-top:2px">No tracked commodity regions, mines, ports or refineries nearby.</div>'}
<div class="note">USGS PAGER colours estimate likely damage and losses: green little, yellow some, orange significant, red extensive. Markets usually react only when production, ports or power are hit. ${p.url?`<a href="${esc(safeU(p.url))}" target="_blank" rel="noopener">USGS event page ↗</a>`:""}</div>`)}
function drawQuakes(){document.querySelectorAll(".mk.L-quake").forEach(e=>e.remove());const now=Date.now();
QK.slice().sort((a,b)=>a.properties.mag-b.properties.mag).forEach(q=>{const p=q.properties,[lon,lat]=q.geometry.coordinates,age=(now-p.time)/36e5,e=document.createElement("div");
e.className="mk L-quake"+(age<6&&p.mag>=5.5?" qr":"");e.style.left=X(lon)/3.6+"%";e.style.top=Y(lat)/1.8+"%";e.style.setProperty("--qs",Math.round(7+Math.max(0,p.mag-4.5)*7)+"px");e.style.setProperty("--qc",p.alert?QC[p.alert]:"#ffb020");e.style.opacity=Math.max(.35,1-age/168*.65).toFixed(2);
e.title=`M${p.mag.toFixed(1)} · ${p.place||""}`;e.onclick=ev=>{ev.stopPropagation();showQuake(q);e.classList.add("on")};map.appendChild(e)});layout()}
async function quakes(){try{const r=await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");if(!r.ok)return;const j=await r.json();QK=(j.features||[]).filter(q=>q.properties&&q.properties.mag!=null);drawQuakes()}catch(e){}}
quakes();setInterval(quakes,10*6e4);
/* ---- refining: 3-2-1 crack from futures + EIA weekly data (Update refining job) ---- */
let RF=null;
const REFS=[["Jamnagar (Reliance)",22.35,69.85,1400,"India · world's largest refining complex; big diesel and gasoline exporter"],["Paraguaná (PDVSA)",11.75,-70.2,940,"Venezuela · nameplate capacity, runs far below it"],["Ruwais (ADNOC)",24.1,52.73,920,"UAE · major product exporter to Asia and Africa"],["Ulsan (SK Energy)",35.47,129.37,840,"South Korea · key Asian product exporter"],["Yeosu (GS Caltex)",34.86,127.69,800,"South Korea"],["Zhoushan (ZPC)",29.95,122.28,800,"China · Rongsheng's integrated refinery-petrochemical complex"],["Dangote",6.43,4.0,650,"Nigeria · changing West African gasoline import flows"],["Port Arthur (Motiva)",29.9,-93.95,630,"US Gulf Coast · largest US refinery; hurricane exposed"],["Galveston Bay (Marathon)",29.37,-94.92,630,"US Gulf Coast · hurricane exposed"],["Al-Zour (KIPIC)",28.73,48.37,615,"Kuwait · low-sulphur fuel oil and diesel for export"],["Garyville (Marathon)",30.06,-90.6,600,"US Gulf Coast · Mississippi river refinery"],["Jurong Island (ExxonMobil)",1.26,103.69,590,"Singapore · Asian pricing hub"],["Baytown (ExxonMobil)",29.75,-95.0,560,"US Gulf Coast"],["Ras Tanura (Aramco)",26.64,50.16,550,"Saudi Arabia"],["Pernis (Shell)",51.88,4.38,400,"Rotterdam · Europe's largest refinery; ARA pricing hub"],["Pembroke (Valero)",51.68,-5.0,270,"UK · one of the UK's four remaining large refineries"],["Fawley (ExxonMobil)",50.83,-1.33,270,"UK · the UK's largest refinery"]];
REFS.forEach(([n,lat,lon,cap,w])=>{const e=document.createElement("div");e.className="mk L-refin";e.style.left=X(lon)/3.6+"%";e.style.top=Y(lat)/1.8+"%";{const sp=document.createElement("span");sp.textContent=n.split(" (")[0];e.appendChild(sp)}e.title=`${n} · ~${cap.toLocaleString("en")} kb/d`;e.onclick=()=>{showRef({n,cap,w});e.classList.add("on")};map.appendChild(e)});
function crackSeries(){if(!HI)return null;const a=HI.s["CL=F"],b=HI.s["RB=F"],c=HI.s["HO=F"];if(!a||!b||!c)return null;const mb=new Map(b.t.map((t,i)=>[t,b.c[i]])),mc=new Map(c.t.map((t,i)=>[t,c.c[i]]));
const t=[],v=[];a.t.forEach((d,i)=>{const r=mb.get(d),h=mc.get(d);if(r==null||h==null)return;const x=(2*r*42+h*42-3*a.c[i])/3;if(x>-20&&x<150){t.push(d);v.push(x)}});return{t,v}}
function crackNow(){const a=PX["CL=F"],b=PX["RB=F"],c=PX["HO=F"];if(!a||!b||!c)return null;const f=(x,y,z)=>(2*y*42+z*42-3*x)/3;
const now=f(a.price,b.price,c.price),prev=f(a.prev,b.prev,c.prev),n=Math.min((a.c||[]).length,(b.c||[]).length,(c.c||[]).length);
const cc=n?[...Array(n)].map((_,i)=>f(a.c[a.c.length-n+i],b.c[b.c.length-n+i],c.c[c.c.length-n+i])):[];return{price:now,prev,c:cc}}
function rfStat(k){const S=RF&&RF.s[k];if(!S)return null;const n=S.v.length,L=S.d[n-1],v=S.v[n-1],w=S.v[n-2],ld=new Date(L+"T12:00Z");
const pool=[];for(let y=1;y<=5;y++){const tgt=new Date(ld);tgt.setUTCFullYear(ld.getUTCFullYear()-y);let best=null,bd=9e15;S.d.forEach((d,i)=>{const dd=Math.abs(new Date(d+"T12:00Z")-tgt);if(dd<bd){bd=dd;best=S.v[i]}});if(bd<5*864e5)pool.push(best)}
const avg=pool.length?pool.reduce((a,b)=>a+b,0)/pool.length:null;return{S,L,v,w,ch:v-w,avg,lo:pool.length?Math.min(...pool):null,hi:pool.length?Math.max(...pool):null,n:pool.length}}
function stkRow(k,big){const s=rfStat(k);if(!s)return"";const pct=s.S.u=="%",fv=x=>pct?x.toFixed(1)+"%":big?(x/1000).toFixed(1)+" mb":Math.round(x).toLocaleString("en")+" kb/d",fc=x=>pct?(x>=0?"+":"−")+Math.abs(x).toFixed(1)+" pts":(x>=0?"+":"−")+(big?(Math.abs(x)/1000).toFixed(1)+" mb":Math.round(Math.abs(x)).toLocaleString("en")+" kb/d");
const lo=Math.min(s.lo,s.v),hi=Math.max(s.hi,s.v),pos=hi>lo?(s.v-lo)/(hi-lo)*100:50,ra=hi>lo?(s.lo-lo)/(hi-lo)*100:0,rb=hi>lo?(s.hi-lo)/(hi-lo)*100:100,vs=s.avg?(pct?s.v-s.avg:(s.v/s.avg-1)*100):null;
return`<div class="stk"><span>${esc(s.S.n)}</span><b>${fv(s.v)} <i style="font-style:normal;color:var(--mut)">${fc(s.ch)}</i></b>${s.n>=3?`<div class="rb"><em style="left:${ra}%;width:${rb-ra}%"></em><i style="left:${pos}%"></i></div><small>${vs!=null&&Math.abs(vs)<.05?"In line with the 5-year average for this week":vs!=null?(pct?`${vs>=0?"+":"−"}${Math.abs(vs).toFixed(1)} pts`:`${vs>=0?"+":"−"}${Math.abs(vs).toFixed(1)}%`)+" vs 5-year average for this week":""}${s.v<s.lo?" · below the 5-year range":s.v>s.hi?" · above the 5-year range":""}</small>`:""}</div>`}
function showRef(r){const cn=crackNow();
const top=r?`<h2>${esc(r.n)}</h2><div class="row"><span>Capacity (approx.)</span><b>${r.cap.toLocaleString("en")} kb/d</b></div><div style="font-size:13px;margin:6px 0 2px">${esc(r.w)}</div>`:`<h2>Refining</h2>`;
const u=rfStat("util"),runs=rfStat("runs");
info(`${top}<div class="tgrid"><div><span class="note" style="margin:0">3-2-1 crack</span><b>${cn?"$"+cn.price.toFixed(1):"—"}</b><small>/bbl${cn?` · ${cn.price-cn.prev>=0?"+":"−"}$${Math.abs(cn.price-cn.prev).toFixed(2)} today`:""}</small></div>
<div><span class="note" style="margin:0">US utilisation</span><b>${u?u.v.toFixed(1)+"%":"—"}</b><small>${u?(u.ch>=0?"+":"−")+Math.abs(u.ch).toFixed(1)+" pts w/w":"EIA weekly"}</small></div>
<div><span class="note" style="margin:0">US crude runs</span><b>${runs?(runs.v/1000).toFixed(2):"—"}</b><small>mb/d</small></div></div>
<div class="kh">Refining margin · 3-2-1 crack, last 12 months</div><div class="ukl"><span><i style="background:var(--amb)"></i>This year</span><span><i style="background:var(--mut)"></i>Year before</span></div><div class="ukc2" id="rfc"></div>
<div class="kh">US weekly data (EIA)${u?" · week to "+new Date(u.L+"T12:00Z").toLocaleDateString("en-GB",{day:"numeric",month:"short"}):""}</div>
${RF?stkRow("util")+stkRow("runs")+stkRow("crude",1)+stkRow("cush",1)+stkRow("gas",1)+stkRow("dist",1):`<div class="note">EIA data loads once the Update refining job has run with your EIA_API_KEY secret.</div>`}
${RF&&RF.s.util?`<div class="kh">US utilisation through the year</div><div class="ukl"><span><i style="background:var(--amb)"></i>This year</span><span><i style="background:var(--ink)"></i>5-year average</span><span><i style="background:color-mix(in srgb,var(--ink) 25%,transparent);height:8px"></i>5-year range</span></div><div class="ukc2" id="rfu"></div>`:""}
<div class="note">The 3-2-1 crack is the gross margin for turning 3 barrels of WTI into 2 of gasoline and 1 of diesel (NYMEX front months). High cracks pull refiners to run hard and support crude demand; maintenance season (spring and autumn) lowers utilisation. Shaded bars show the 5-year range for the same week, with the marker at today's level. EIA data comes out Wednesdays 15:30 UK.</div>`);
setTimeout(()=>{const cs=crackSeries(),box=$("#rfc");if(cs&&box&&cs.t.length>300){const N=cs.t.length,a=Math.max(0,N-260),T=cs.t.slice(a).map(d=>d*864e5),m=new Map(cs.t.map((d,i)=>[d,cs.v[i]])),ly=cs.t.slice(a).map(d=>{for(let k=0;k<4;k++){const v=m.get(d-364-k);if(v!=null)return v}return null});
tsChart(box,{t:T,h:140,series:[{n:"This year",c:"var(--amb)",v:cs.v.slice(a)},{n:"Year before",c:"var(--mut)",v:ly,w:1.3}],fmt:v=>"$"+v.toFixed(1)+"/bbl",lab:t=>new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})})}
else if(box)box.innerHTML='<div class="note">Crack history appears once the price history job has gasoline and heating oil.</div>';
const ub=$("#rfu"),S=RF&&RF.s.util;if(ub&&S){const wk=d=>Math.min(52,Math.floor((Date.UTC(+d.slice(0,4),+d.slice(5,7)-1,+d.slice(8,10))-Date.UTC(+d.slice(0,4),0,1))/864e5/7)),cy=S.d.at(-1).slice(0,4);
const cur=Array(53).fill(null),by={};S.d.forEach((d,i)=>{const y=d.slice(0,4),w=wk(d);if(y==cy)cur[w]=S.v[i];else if(+cy-+y<=5){(by[w]=by[w]||[]).push(S.v[i])}});
const avg=[],lo=[],hi=[];for(let w=0;w<53;w++){const v=by[w]||[];avg.push(v.length?v.reduce((a,b)=>a+b,0)/v.length:null);lo.push(v.length>=3?Math.min(...v):null);hi.push(v.length>=3?Math.max(...v):null)}
tsChart(ub,{t:[...Array(53)].map((_,w)=>Date.UTC(2001,0,1+w*7)),h:140,band:{lo,hi},series:[{n:cy,c:"var(--amb)",v:cur},{n:"5-yr avg",c:"var(--ink)",v:avg,w:1.3,dash:1}],fmt:v=>v.toFixed(1)+"%",tk:v=>v+"%",lab:t=>"Week of "+new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"short",timeZone:"UTC"})})}},0)}
(async()=>{for(const u of rawUrls("refining","refining.json")){try{const r=await fetch(u);if(r.ok){RF=await r.json();break}}catch(e){}}})();
/* ---- futures curves & seasonal patterns ---- */
let CV=null,SN=null,snP=null;
(async()=>{for(const u of rawUrls("curves","curves.json")){try{const r=await fetch(u);if(r.ok){CV=await r.json();break}}catch(e){}}})();
function snLoad(){if(!snP)snP=(async()=>{for(const u of rawUrls("seasonal","seasonal.json")){try{const r=await fetch(u);if(r.ok){SN=await r.json();break}}catch(e){}}return SN})();return snP}
const cvRoot=sym=>sym&&sym.endsWith("=F")?sym.slice(0,-2):null;
function cvHTML(sym){const k=cvRoot(sym);if(!k||!CV||!CV.c[k])return"";return`<div class="kh">Futures curve</div><div class="cvs" id="cvs"></div><div class="ukl"><span><i style="background:var(--amb)"></i>Today</span><span><i style="background:var(--mut)"></i>1 week ago</span><span><i style="background:var(--mut);opacity:.5"></i>1 month ago</span></div><div class="ukc2" id="cvc"></div>`}
function cvDraw(sym){const box=$("#cvc"),P=CV&&CV.c[cvRoot(sym)];if(!box||!P)return;
const N=P.length,mo=s=>{const[m,y]=[ "FGHJKMNQUVXZ".indexOf(s.c[0]),+s.c.slice(1)];return y*12+m},m0=mo(P[0]);let j=N-1;for(let i=1;i<N;i++){if(mo(P[i])-m0>=11){j=i;break}}
const pct=(P[j].p/P[0].p-1)*100,mpct=P[0].m&&P[j].m?(P[j].m/P[0].m-1)*100:null,spr=P[0].p-P[1].p,dp=v=>Math.abs(v)<1?3:Math.abs(v)<20?2:Math.abs(v)<1000?1:0;
const st=pct<-1?["bw","Backwardation"]:pct>1?["ct","Contango"]:["","Flat"];
$("#cvs").innerHTML=`<span class="${st[0]}"><b>${st[1]}</b></span><span>${P[j].l} vs front <b>${pct>=0?"+":"−"}${Math.abs(pct).toFixed(1)}%</b></span><span>1st–2nd spread <b>${spr>=0?"+":"−"}${Math.abs(spr).toFixed(dp(spr))}</b></span>${mpct!=null?`<span>Same spread 1 month ago <b>${mpct>=0?"+":"−"}${Math.abs(mpct).toFixed(1)}%</b></span>`:""}`;
const W=box.clientWidth||340,Ht=160,pl=4,pr=44,pt=8,pb=20,iw=W-pl-pr,ih=Ht-pt-pb,all=P.flatMap(q=>[q.p,q.w,q.m]).filter(v=>v!=null);let lo=Math.min(...all),hi=Math.max(...all);const pd=(hi-lo)*.1||hi*.02;lo-=pd;hi+=pd;
const x=i=>pl+i/(N-1)*iw,y=v=>pt+(hi-v)/(hi-lo)*ih;let g="";const step=[.001,.002,.005,.01,.02,.05,.1,.2,.25,.5,1,2,5,10,20,25,50,100,200,250,500,1000].find(q=>(hi-lo)/q<=4)||2000;
for(let v=Math.ceil(lo/step)*step;v<=hi;v+=step){const vv=+v.toFixed(4);g+=`<line x1="${pl}" x2="${pl+iw}" y1="${y(vv)}" y2="${y(vv)}" class="gl"/><text x="${W-2}" y="${y(vv)+3.5}" class="ax" text-anchor="end">${vv.toLocaleString("en")}</text>`}
const nl=Math.min(N-1,W<380?4:5),LS=new Set([...Array(nl+1)].map((_,k)=>Math.round(k*(N-1)/nl))),showL=i=>LS.has(i);P.forEach((q,i)=>{if(showL(i))g+=`<text x="${x(i)}" y="${Ht-5}" class="ax" text-anchor="${i==0?"start":i==N-1?"end":"middle"}">${q.l}</text>`});
const ln=(k,c,w,op,da)=>{let d="",on=0;P.forEach((q,i)=>{if(q[k]==null){on=0;return}d+=(on?"L":"M")+x(i).toFixed(1)+" "+y(q[k]).toFixed(1);on=1});return`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${op}"${da?' stroke-dasharray="4 3"':""} stroke-linejoin="round"/>`};
g+=ln("m","var(--mut)",1.3,.5)+ln("w","var(--mut)",1.3,1,1)+ln("p","var(--amb)",2,1);P.forEach((q,i)=>g+=`<circle cx="${x(i)}" cy="${y(q.p)}" r="3" fill="var(--amb)" stroke="var(--card)" stroke-width="1.5"/>`);
box.innerHTML=`<svg width="${W}" height="${Ht}" class="chs">${g}<line class="cx" y1="${pt}" y2="${pt+ih}" style="display:none"/><rect x="0" y="0" width="${pl+iw+6}" height="${Ht}" fill="transparent" class="hz"/></svg><div class="tt" style="display:none"></div>`;
const hz=box.querySelector(".hz"),cx=box.querySelector(".cx"),tt=box.querySelector(".tt");
const mv=e=>{const px=e.clientX-hz.getBoundingClientRect().left,i=Math.max(0,Math.min(N-1,Math.round((px-pl)/iw*(N-1)))),q=P[i];cx.setAttribute("x1",x(i));cx.setAttribute("x2",x(i));cx.style.display="";tt.textContent="";
const hd=document.createElement("div");hd.className="th";hd.textContent=q.l+" contract ("+q.c+")";tt.appendChild(hd);
[["var(--amb)","Today",q.p],["var(--mut)","1 week ago",q.w],["var(--mut)","1 month ago",q.m]].forEach(([c,l,v])=>{if(v==null)return;const rw=document.createElement("div");rw.className="tr";const k=document.createElement("i");k.style.background=c;const sp=document.createElement("span");sp.textContent=l;const b=document.createElement("b");b.textContent=v.toLocaleString("en",{maximumFractionDigits:dp(v)+1});rw.append(k,sp,b);tt.appendChild(rw)});
if(i){const rw=document.createElement("div");rw.className="tr";const sp=document.createElement("span");sp.textContent="vs front";const b=document.createElement("b");const d=(q.p/P[0].p-1)*100;b.textContent=(d>=0?"+":"−")+Math.abs(d).toFixed(1)+"%";rw.append(document.createElement("i"),sp,b);tt.appendChild(rw)}
tt.style.display="";const tw=tt.offsetWidth;tt.style.left=Math.min(W-tw-2,Math.max(0,x(i)+10+tw>W?x(i)-tw-10:x(i)+10))+"px"};
hz.addEventListener("pointermove",mv);hz.addEventListener("pointerdown",mv);hz.addEventListener("pointerleave",()=>{cx.style.display="none";tt.style.display="none"})}
function snHTML(sym){return`<div class="kh">Seasonal pattern</div><div id="sns" class="sst"><span class="note">Loading seasonal history…</span></div><div class="ukl" id="snl"></div><div class="ukc2" id="snc"></div>`}
async function snDraw(sym){await snLoad();const box=$("#snc"),st=$("#sns");if(!box||!st)return;const S=SN&&SN.s[sym];
if(!S){st.innerHTML=`<span class="note">${SN?"No long history for this market.":"Seasonal data loads once the Update seasonal patterns job has run."}</span>`;return}
const cur=S.y[S.cur]||[],past=Object.keys(S.y).filter(k=>k!=S.cur).sort(),p5=past.slice(-5),p10=past.slice(-10),ly=S.y[past.at(-1)];
const med=a=>{const s=a.slice().sort((x,y)=>x-y),m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2};
const avg=[],lo=[],hi=[];for(let w=0;w<53;w++){const v=p5.map(k=>S.y[k][w]).filter(v=>v!=null).sort((a,b)=>a-b);avg.push(v.length?med(v):null);lo.push(v.length>=4?v[1]:v.length>=3?v[0]:null);hi.push(v.length>=4?v[v.length-2]:v.length>=3?v[v.length-1]:null)}
let wc=-1;cur.forEach((v,i)=>{if(v!=null)wc=i});
const L=(Y,w)=>{const a=S.y[Y];if(!a)return null;let k=w;while(k>=0&&a[k]==null)k--;return k<0?1:1+a[k]/100};
let up=0,n=0,sum=0;const rs=[];if(wc>=0)p10.forEach(Y=>{const a=L(Y,wc);if(a==null)return;let b;const w2=wc+13;if(w2<=52)b=L(Y,w2);else{const nx=String(+Y+1);if(!S.y[nx]||nx==S.cur&&cur.filter(v=>v!=null).length<w2-52)return;b=L(Y,52)*L(nx,w2-53)}if(b==null)return;const r=(b/a-1)*100;n++;sum+=r;rs.push(r);if(r>0)up++});
const vs=wc>=0&&avg[wc]!=null&&cur[wc]!=null?cur[wc]-avg[wc]:null,sg=v=>(v>=0?"+":"−")+Math.abs(v).toFixed(1);
st.innerHTML=(wc>=0&&cur[wc]!=null?`This year <b>${sg(cur[wc])}%</b> so far${vs!=null?`, <b>${Math.abs(vs).toFixed(1)} pts</b> ${vs>=0?"above":"below"} the usual (5-year median) path`:""}. `:"")+(n>=4?`Next 3 months: up in <b>${up} of ${n}</b> years, typical move <b>${sg(med(rs))}%</b>.`:"");
$("#snl").innerHTML=`<span><i style="background:var(--amb)"></i>${S.cur}</span><span><i style="background:var(--mut)"></i>${past.at(-1)}</span><span><i style="background:var(--ink)"></i>5-year median</span><span><i style="background:color-mix(in srgb,var(--ink) 25%,transparent);height:8px"></i>usual range (middle 3 of 5 years)</span>`;
const T=[...Array(53)].map((_,w)=>Date.UTC(2001,0,1+w*7));
tsChart(box,{t:T,h:160,band:{lo,hi},zl:1,series:[{n:S.cur,c:"var(--amb)",v:cur},{n:past.at(-1),c:"var(--mut)",v:ly||[],w:1.3},{n:"5-yr median",c:"var(--ink)",v:avg,w:1.3,dash:1}],
fmt:v=>(v>=0?"+":"−")+Math.abs(v).toFixed(1)+"%",tk:v=>(v>0?"+":"")+v+"%",lab:t=>"Week of "+new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"short",timeZone:"UTC"})})}
/* ---- UK energy (NESO carbon intensity + Elexon + optional GIE gas), built every 30 min by Update UK energy ---- */
let UK=null;
const UKF=[["nuclear","Nuclear","--f-nuc"],["biomass","Biomass & hydro","--f-bio"],["gas","Gas","--f-gas"],["wind","Wind","--f-wind"],["solar","Solar","--f-sol"],["other","Other & coal","--f-oth"],["imports","Imports","--f-imp"]];
function ukSeries(){const m=UK&&UK.mix;if(!m)return null;const f=m.f,S={nuclear:f.nuclear,biomass:f.biomass.map((v,i)=>v+(f.hydro[i]||0)),gas:f.gas,wind:f.wind,solar:f.solar,other:f.other.map((v,i)=>v+(f.coal[i]||0)),imports:f.imports};return{t:m.t.map(x=>Date.parse(x)),S}}
const ukTm=ms=>new Date(ms).toLocaleString("en-GB",{weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Europe/London"})+" UK";
const cssv=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function tsChart(box,o){const W=box.clientWidth||340,Ht=o.h||150,pl=4,pr=40,pt=8,pb=20,iw=W-pl-pr,ih=Ht-pt-pb,T=o.t,N=T.length;if(N<2){box.innerHTML='<div class="note">Not enough data yet.</div>';return}
const t0=T[0],t1=T[N-1],x=t=>pl+(t-t0)/(t1-t0||1)*iw;let lo,hi;
if(o.stack){lo=0;hi=100}else{const all=o.series.flatMap(s=>s.v.filter(v=>v!=null)).concat(o.band?o.band.lo.concat(o.band.hi).filter(v=>v!=null):[]);lo=Math.min(...all);hi=Math.max(...all);if(o.zero)lo=Math.min(0,lo);const pd=(hi-lo)*.08||1;lo-=lo==0?0:pd;hi+=pd}
const y=v=>pt+(hi-v)/(hi-lo)*ih;let g="";
const step=[.01,.02,.05,.1,.2,.25,.5,1,2,5,10,20,25,50,100,200,250,500,1000,2000,5000].find(q=>(hi-lo)/q<=4)||1e4;for(let v=Math.ceil(lo/step)*step;v<=hi+1e-9;v+=step){const vv=+v.toFixed(4);g+=`<line x1="${pl}" x2="${pl+iw}" y1="${y(vv)}" y2="${y(vv)}" class="gl"${o.zl&&vv==0?' style="stroke:var(--mut)"':""}/><text x="${W-2}" y="${y(vv)+3.5}" class="ax" text-anchor="end">${(o.tk?o.tk(vv):vv)}${o.stack?"%":""}</text>`}
const day=864e5;if(t1-t0<=3*day){for(let t=Math.ceil(t0/36e5)*36e5;t<=t1;t+=36e5){const d=new Date(t),hh=+d.toLocaleString("en-GB",{hour:"2-digit",hour12:false,timeZone:"Europe/London"});if(hh%12)continue;g+=`<text x="${x(t)}" y="${Ht-5}" class="ax" text-anchor="middle">${hh==0?d.toLocaleDateString("en-GB",{weekday:"short",timeZone:"Europe/London"}):"12:00"}</text>`}}
else{for(let t=t0;t<=t1;t+=day){const d=new Date(t);if(d.getUTCDate()==1)g+=`<text x="${x(t)}" y="${Ht-5}" class="ax" text-anchor="middle">${d.toLocaleDateString("en-GB",{month:"short"})}</text>`}}
if(o.stack){const acc=new Array(N).fill(0);o.series.forEach(s=>{const top=s.v.map((v,i)=>acc[i]+(v||0));let d="M"+T.map((t,i)=>x(t).toFixed(1)+" "+y(Math.min(100,top[i])).toFixed(1)).join("L");for(let i=N-1;i>=0;i--)d+="L"+x(T[i]).toFixed(1)+" "+y(Math.min(100,acc[i])).toFixed(1);g+=`<path d="${d}Z" fill="var(${s.c})" stroke="var(--card)" stroke-width="1" stroke-linejoin="round"/>`;top.forEach((v,i)=>acc[i]=v)})}
else{if(o.band){let d="",bk="";T.forEach((t,i)=>{const a=o.band.lo[i],b=o.band.hi[i];if(a==null||b==null)return;d+=(d?"L":"M")+x(t).toFixed(1)+" "+y(b).toFixed(1);bk="L"+x(t).toFixed(1)+" "+y(a).toFixed(1)+bk});if(d)g+=`<path d="${d}${bk}Z" fill="color-mix(in srgb,var(--ink) 9%,transparent)" stroke="none"/>`}
if(o.ref!=null)g+=`<line x1="${pl}" x2="${pl+iw}" y1="${y(o.ref)}" y2="${y(o.ref)}" style="stroke:var(--mut);stroke-dasharray:4 3"/>`;
o.series.forEach(s=>{let d="",on=0;s.v.forEach((v,i)=>{if(v==null){on=0;return}d+=(on?"L":"M")+x(T[i]).toFixed(1)+" "+y(v).toFixed(1);on=1});g+=`<path d="${d}" fill="none" stroke="${s.c}" stroke-width="${s.w||2}" stroke-linejoin="round" stroke-linecap="round"${s.dash?' stroke-dasharray="4 3"':""}/>`});
const s0=o.series[0];for(let i=N-1;i>=0;i--)if(s0.v[i]!=null){g+=`<circle cx="${x(T[i])}" cy="${y(s0.v[i])}" r="4" fill="${s0.c}" stroke="var(--card)" stroke-width="2"/>`;break}}
box.innerHTML=`<svg width="${W}" height="${Ht}" class="chs">${g}<line class="cx" y1="${pt}" y2="${pt+ih}" style="display:none"/><rect x="${pl}" y="0" width="${iw}" height="${Ht}" fill="transparent" class="hz"/></svg><div class="tt" style="display:none"></div>`;
const hz=box.querySelector(".hz"),cx=box.querySelector(".cx"),tt=box.querySelector(".tt");
const mv=e=>{const px=e.clientX-hz.getBoundingClientRect().left,tq=t0+px/iw*(t1-t0);let i=0,bd=1e18;T.forEach((t,k)=>{const d=Math.abs(t-tq);if(d<bd){bd=d;i=k}});cx.setAttribute("x1",x(T[i]));cx.setAttribute("x2",x(T[i]));cx.style.display="";tt.textContent="";
const hd=document.createElement("div");hd.className="th";hd.textContent=o.lab?o.lab(T[i]):ukTm(T[i]);tt.appendChild(hd);
(o.stack?o.series.slice().reverse():o.series).forEach(s=>{const v=s.v[i];if(v==null)return;const rw=document.createElement("div");rw.className="tr";const k=document.createElement("i");k.style.background=o.stack?`var(${s.c})`:s.c;k.style.height=o.stack?"8px":"2px";const sp=document.createElement("span");sp.textContent=s.n;const b=document.createElement("b");b.textContent=o.fmt(v);rw.append(k,sp,b);tt.appendChild(rw)});
tt.style.display="";const tw=tt.offsetWidth,X0=x(T[i]);tt.style.left=Math.min(W-tw-2,Math.max(0,X0+10+tw>W?X0-tw-10:X0+10))+"px"};
hz.addEventListener("pointermove",mv);hz.addEventListener("pointerdown",mv);hz.addEventListener("pointerleave",()=>{cx.style.display="none";tt.style.display="none"})}
function ukNow(){const s=ukSeries();if(!s)return null;const i=s.t.length-1,o={};UKF.forEach(([k])=>o[k]=s.S[k][i]||0);return{t:s.t[i],o}}
function ukPrice(){const m=UK&&(UK.mid&&UK.mid.p.length?UK.mid:UK.sp);if(!m)return null;let i=m.p.length-1;return{p:m.p[i],t:Date.parse(m.t[i]),k:m===UK.mid?"mid":"sp"}}
function ukPin(){let e=document.querySelector(".pin.ukp");if(!e){e=document.createElement("div");e.className="pin ukp";e.style.left=X(-2.5)/3.6+"%";e.style.top=Y(54.6)/1.8+"%";e.innerHTML='<div class="chip ukc"><b>UK power</b><span id="pukp">—</span></div><div class="dot"></div>';e.onclick=()=>{showUK();document.querySelectorAll(".pin").forEach(x=>x.classList.remove("sel"));e.classList.add("sel");layout()};map.appendChild(e)}
const pr=ukPrice(),n=ukNow();$("#pukp").innerHTML=(pr?`£${Math.round(pr.p)}`:"—")+(n?` <i style="color:var(--f-wind)">wind ${Math.round(n.o.wind)}%</i>`:"")}
const sumL=(a,n)=>{const s=a.slice(-n).filter(v=>v!=null);return s.length?s.reduce((x,y)=>x+y,0)/s.length:null};
function showUK(){if(!UK){info(`<h2>UK energy</h2><div class="note">This loads once the Update UK energy job has run in GitHub Actions.</div>`);return}
const n=ukNow(),pr=ukPrice(),ci=UK.ci&&UK.ci.now,F=UK.fuel;
let mixH="";if(n){mixH=`<div class="kh">Generation mix now · ${ukTm(n.t)}</div><div class="mixbar">${UKF.map(([k,l,c])=>n.o[k]>0?`<i style="flex:${n.o[k]};background:var(${c})" title="${l} ${n.o[k].toFixed(0)}%"></i>`:"").join("")}</div>
<div class="mixl">${UKF.slice().sort((a,b)=>n.o[b[0]]-n.o[a[0]]).map(([k,l,c])=>`<div><i style="background:var(${c})"></i><span>${l}</span><b>${n.o[k].toFixed(0)}%</b></div>`).join("")}</div>`}
let gas="";if(UK.lng||UK.eu){const L=UK.lng,E=UK.eu;let lt="",et="";
if(L){const s7=sumL(L.s,7),ly=L.s.length>372?sumL(L.s.slice(0,L.s.length-358),7):null;lt=`<div><span class="note" style="margin:0">LNG send-out, 7d avg</span><b>${s7!=null?Math.round(s7):"—"}</b><small>GWh/day${ly?` · ${s7>=ly?"+":"−"}${Math.abs(Math.round((s7/ly-1)*100))}% y/y`:""}</small></div>`}
if(E){const f=E.full.at(-1),ly=E.full.length>365?E.full[E.full.length-366]:null;et=`<div><span class="note" style="margin:0">EU storage</span><b>${f!=null?f.toFixed(1)+"%":"—"}</b><small>full${ly!=null?` · ${f>=ly?"+":"−"}${Math.abs(f-ly).toFixed(1)} pts y/y`:""}</small></div>`}
gas=`<div class="kh">Gas</div><div class="tgrid" style="grid-template-columns:repeat(2,1fr)">${lt}${et}</div>${L?`<div class="ukl"><span><i style="background:var(--amb)"></i>LNG into GB, last 120 days</span><span><i style="background:var(--mut)"></i>same days last year</span></div><div class="ukc2" id="ukg"></div>`:""}${E?`<div class="ukl"><span><i style="background:var(--s1)"></i>EU storage % full</span><span><i style="background:var(--mut)"></i>last year</span></div><div class="ukc2" id="uke"></div>`:""}`}
else gas=`<div class="kh">Gas</div><div class="note">LNG send-out and EU storage need a free GIE account key. Add it as the GIE_API_KEY secret in GitHub to switch this on.</div>`;
info(`<h2>UK energy</h2><div class="tgrid"><div><span class="note" style="margin:0">Power price</span><b>${pr?"£"+Math.round(pr.p):"—"}</b><small>/MWh${pr?" · "+(pr.k=="mid"?"wholesale":"system"):""}</small></div>
<div><span class="note" style="margin:0">Wind share</span><b>${n?Math.round(n.o.wind)+"%":"—"}</b><small>${F?"gas "+(F.gas/1000).toFixed(1)+" GW":""}</small></div>
<div><span class="note" style="margin:0">Carbon</span><b>${ci?ci.v:"—"}</b><small>g/kWh${ci&&ci.idx?" · "+esc(ci.idx):""}</small></div></div>
${mixH}<div class="kh">Mix, last 48 hours</div><div class="ukc2" id="ukm"></div>
<div class="kh">Power price, last 48 hours</div><div class="ukl">${UK.mid?'<span><i style="background:var(--amb)"></i>Wholesale (market index)</span>':""}${UK.sp?'<span><i style="background:var(--mut)"></i>System (imbalance) price</span>':""}</div><div class="ukc2" id="ukp"></div>
${gas}<div class="note">Why it matters: low wind means more gas burned for power, which supports UK (NBP) and European (TTF) gas prices. Strong LNG send-out and full storage ease winter supply worries. Sources: NESO Carbon Intensity, Elexon${UK.lng||UK.eu?", GIE":""}. Updated ${ago(UK.updated)}.</div>`);
setTimeout(()=>{const s=ukSeries();if(s)tsChart($("#ukm"),{t:s.t,stack:1,h:150,series:UKF.map(([k,l,c])=>({n:l,c,v:s.S[k]})),fmt:v=>v.toFixed(0)+"%"});
const ser=[];let T=null;if(UK.mid){T=UK.mid.t.map(Date.parse);ser.push({n:"Wholesale",c:"var(--amb)",v:UK.mid.p})}
if(UK.sp){const st=UK.sp.t.map(Date.parse);if(!T){T=st;ser.push({n:"System",c:"var(--mut)",v:UK.sp.p,w:1.3})}else{const mp=new Map(st.map((t,i)=>[t,UK.sp.p[i]]));ser.push({n:"System",c:"var(--mut)",v:T.map(t=>mp.get(t)??null),w:1.3})}}
if(T)tsChart($("#ukp"),{t:T,series:ser,fmt:v=>"£"+v.toFixed(0)+"/MWh",zero:0});
const lab=t=>new Date(t).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
if(UK.lng&&$("#ukg")){const L=UK.lng,n=L.d.length,a=Math.max(0,n-120),T2=L.d.slice(a).map(d=>Date.parse(d+"T12:00Z")),ly=L.d.slice(a).map((d,i)=>{const j=a+i-364;return j>=0?L.s[j]:null});
tsChart($("#ukg"),{t:T2,h:130,series:[{n:"This year",c:"var(--amb)",v:L.s.slice(a)},{n:"Last year",c:"var(--mut)",v:ly,w:1.3}],fmt:v=>Math.round(v)+" GWh/d",lab,zero:1})}
if(UK.eu&&$("#uke")){const E=UK.eu,n=E.d.length,a=Math.max(0,n-120),T3=E.d.slice(a).map(d=>Date.parse(d+"T12:00Z")),ly=E.d.slice(a).map((d,i)=>{const j=a+i-365;return j>=0?E.full[j]:null});
tsChart($("#uke"),{t:T3,h:130,series:[{n:"This year",c:"var(--s1)",v:E.full.slice(a)},{n:"Last year",c:"var(--mut)",v:ly,w:1.3}],fmt:v=>v.toFixed(1)+"% full",lab})}},0)}
async function ukLoad(){for(const u of rawUrls("uk","uk.json")){try{const r=await fetch(u.replace(/\?t=\d+/,"?t="+(Date.now()/3e5|0)));if(r.ok){UK=await r.json();break}}catch(e){}}if(UK){ukPin();layout()}}
ukLoad();setInterval(ukLoad,15*6e4);
/* ---- markets board (delayed Yahoo quotes from prices.json) ---- */
const MKG=[["Energy",[["BZ=F","Brent crude","$/bbl"],["CL=F","WTI crude","$/bbl"],["NG=F","Henry Hub gas","$/MMBtu"],["HO=F","Heating oil (diesel)","$/gal"],["RB=F","Gasoline (RBOB)","$/gal"]]],
["Metals",[["GC=F","Gold","$/oz"],["SI=F","Silver","$/oz"],["PL=F","Platinum","$/oz"],["PA=F","Palladium","$/oz"],["HG=F","Copper","$/lb"],["ALI=F","Aluminium","$/t"],["TIO=F","Iron ore","$/t"]]],
["Grains and oilseeds",[["ZC=F","Corn","¢/bu"],["ZW=F","Wheat, Chicago","¢/bu"],["KE=F","Wheat, Kansas","¢/bu"],["ZS=F","Soybeans","¢/bu"],["ZM=F","Soymeal","$/short t"],["ZL=F","Soy oil","¢/lb"],["ZO=F","Oats","¢/bu"],["ZR=F","Rough rice","$/cwt"]]],
["Softs",[["CC=F","Cocoa","$/t"],["KC=F","Coffee","¢/lb"],["SB=F","Sugar","¢/lb"],["CT=F","Cotton","¢/lb"],["OJ=F","Orange juice","¢/lb"],["LBR=F","Lumber","$/1000 bd ft"]]],
["Livestock",[["LE=F","Live cattle","¢/lb"],["GF=F","Feeder cattle","¢/lb"],["HE=F","Lean hogs","¢/lb"]]],
["US rates",[["ZT=F","2-year note future","pts"],["ZF=F","5-year note future","pts"],["ZN=F","10-year note future","pts"],["ZB=F","30-year bond future","pts"],["^IRX","3-month bill yield","%","y"],["^FVX","5-year yield","%","y"],["^TNX","10-year yield","%","y"],["^TYX","30-year yield","%","y"]]],
["Equity indices",[["ES=F","S&P 500 future","pts"],["NQ=F","Nasdaq 100 future","pts"],["YM=F","Dow future","pts"],["RTY=F","Russell 2000 future","pts"],["^FTSE","FTSE 100","index"],["^GDAXI","DAX","index"],["^STOXX50E","Euro Stoxx 50","index"],["^N225","Nikkei 225","index"],["^HSI","Hang Seng","index"],["000001.SS","Shanghai Composite","index"]]],
["Refining",[["CRACK","3-2-1 crack (WTI)","$/bbl"]]],
["FX and volatility",[["DX-Y.NYB","US dollar index","index"],["EURUSD=X","EUR/USD","rate"],["GBPUSD=X","GBP/USD","rate"],["JPY=X","USD/JPY","rate"],["CNY=X","USD/CNY","rate"],["BRL=X","USD/BRL","rate"],["^VIX","VIX","index"]]]];
let MKS=null,MKSEL=null;
function mkRow(s){const q=s[0]=="CRACK"?crackNow():PX[s[0]];if(!q||q.price==null)return null;const c=(q.c||[]).slice(),y=s[3]=="y",n=c.length,p=q.price;
const ch=(ref)=>ref==null||!ref?null:y?(p-ref)*100:(p/ref-1)*100;
const o={sym:s[0],n:s[1],u:s[2],y,p,d1:ch(q.prev),w1:n>=6?ch(c[n-6]):null,m1:n>=20?ch(c[0]):null,c};
if(!y&&o.d1!=null&&Math.abs(o.d1)>25)o.d1=null;return o}
function spark(o){const v=o.c.slice();if(!v.length)return"";v[v.length-1]=o.p;const lo=Math.min(...v),hi=Math.max(...v),W=64,H=20,x=i=>i/(v.length-1||1)*W,yy=t=>H-2-(hi>lo?(t-lo)/(hi-lo):.5)*(H-4);
const up=v[v.length-1]>=v[0];return`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${v.map((t,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+yy(t).toFixed(1)).join("")}" fill="none" stroke="var(--${up?"up":"dn"})" stroke-width="1.4" vector-effect="non-scaling-stroke"/></svg>`}
function cgc(v,sc,y){if(v==null)return`<span class="cg" style="color:var(--mut)">—</span>`;const a=Math.min(1,Math.abs(v)/sc)*38,k=v>=0?"up":"dn";
return`<span class="cg" style="color:var(--${k});background:color-mix(in srgb,var(--${k}) ${a.toFixed(0)}%,transparent)">${v>=0?"+":"−"}${Math.abs(v).toFixed(y?0:Math.abs(v)<10?2:1)}${y?"bp":"%"}</span>`}
const pxf=o=>o.p>=1000?o.p.toLocaleString("en",{maximumFractionDigits:0}):o.p>=100?o.p.toFixed(1):o.p>=10?o.p.toFixed(2):o.p.toFixed(o.u=="rate"?4:3);
function rowH(o){return`<div class="mkr${MKSEL==o.sym?" sel":""}" data-s="${esc(o.sym)}" title="${esc(o.n)} · ${esc(o.u)}"><span>${esc(o.n)}<small>${esc(o.u)}</small></span>${spark(o)}<span class="px">${pxf(o)}</span>${cgc(o.d1,o.y?10:2,o.y)}${cgc(o.w1,o.y?25:5,o.y)}${cgc(o.m1,o.y?50:10,o.y)}</div>`}
window.MKTAB=window.MKTAB||"px";
function mkHead(tab){return`<div class="mkh"><div class="mktabs" role="tablist"><button data-tab="px" role="tab" aria-selected="${tab=="px"}" class="${tab=="px"?"on":""}">Markets</button><button data-tab="risk" role="tab" aria-selected="${tab=="risk"}" class="${tab=="risk"?"on":""}">Weather risk</button></div><small>${tab=="px"?"Delayed ~15 min · "+(pT?new Date(pT*1000).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Europe/London"})+" UK":"—"):"Crop regions vs normal"}</small><button class="x" id="mkx" aria-label="Close">×</button></div>`}
function mkBoard(){const el=$("#mkp");if(!document.body.classList.contains("mkopen"))return;if(MKTAB=="risk"&&typeof renderRisk=="function"){renderRisk(el);return}const rows=MKG.map(([g,L])=>[g,L.map(mkRow).filter(Boolean)]);
const all=rows.flatMap(r=>r[1]),mv=all.filter(o=>!o.y&&o.d1!=null).sort((a,b)=>b.d1-a.d1);
const hd=[["n","Market"],[null,""],[null,"Last"],["d1","1D"],["w1","1W"],["m1","1M"]].map(([k,t])=>k?`<button data-k="${k}"${MKS&&MKS[0]==k?` class="on" data-d="${MKS[1]>0?"↓":"↑"}"`:""}>${t}</button>`:`<span style="text-align:right">${t}</span>`).join("");
let body="";if(!all.length)body=`<div class="note" style="padding:16px">Prices load once the Update prices job has run with the new markets list.</div>`;
else if(MKS){const[k,d]=MKS,val=o=>o.y||o[k]==null?null:o[k];const pct=all.filter(o=>k=="n"||val(o)!=null),rest=all.filter(o=>!pct.includes(o));body=pct.sort((a,b)=>k=="n"?-d*a.n.localeCompare(b.n):(val(b)-val(a))*d).map(rowH).join("")+(rest.length?`<div class="mkg">Yields and no data</div>`+rest.map(rowH).join(""):"")}
else body=rows.filter(r=>r[1].length).map(([g,L])=>`<div class="mkg">${g}</div>${L.map(rowH).join("")}`).join("");
const top=a=>a.map(o=>`<a data-s="${esc(o.sym)}"><span>${esc(o.n)}</span>${cgc(o.d1,2)}</a>`).join("");
el.innerHTML=`${mkHead("px")}
${mv.length>5?`<div class="mvs"><div><span>Top gainers today</span>${top(mv.slice(0,3))}</div><div><span>Top fallers today</span>${top(mv.slice(-3).reverse())}</div></div>`:""}
<div class="mkt"><div class="mkr mkhd">${hd}</div>${body}</div><div class="mkf">Yields move in basis points (bp), everything else in %. Bund and Gilt futures aren't in the free feed, so they're missing for now. Tap a row for its chart.</div>`;
$("#mkx").onclick=()=>mkOpen(false);el.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{MKTAB=b.dataset.tab;mkBoard()});el.querySelectorAll(".mkhd button").forEach(b=>b.onclick=()=>{const k=b.dataset.k;MKS=MKS&&MKS[0]==k?(MKS[1]>0?[k,-1]:null):[k,k=="n"?-1:1];mkBoard()});
el.querySelectorAll("[data-s]").forEach(r=>r.onclick=()=>mkShow(r.dataset.s))}
function mkShow(sym){MKSEL=sym;if(sym=="CRACK"){showRef();document.querySelectorAll("#mkp .mkr").forEach(r=>r.classList.toggle("sel",r.dataset.s==sym));return}const i=R.findIndex(r=>r.sym==sym);if(i>=0){show(i)}else{const s=MKG.flatMap(g=>g[1]).find(x=>x[0]==sym),o=mkRow(s);if(!o)return;
const o2={n:s[1],sym,u:s[2],p:o.p};info(`<h2>${esc(s[1])}</h2><div class="row"><span>Last (delayed)</span><b>${pxf(o)} ${esc(s[2])}</b></div>
<div class="row"><span>Day · week · month</span><b>${cgc(o.d1,o.y?10:2,o.y)} ${cgc(o.w1,o.y?25:5,o.y)} ${cgc(o.m1,o.y?50:10,o.y)}</b></div>${chartHTML(o2)}${cvHTML(sym)}${snHTML(sym)}<div class="note">Symbol ${esc(sym)} on Yahoo Finance, delayed. Futures are the front month and can jump when the contract rolls.</div>`);setTimeout(()=>{drawChart(o2);cvDraw(sym);snDraw(sym)},0)}
document.querySelectorAll("#mkp .mkr").forEach(r=>r.classList.toggle("sel",r.dataset.s==sym))}
function mkOpen(o){if(o&&!WIDE()){const pp=$("#panel");if(pp.classList.contains("open"))$("#px").click()}document.body.classList.toggle("mkopen",o);$("#mkb").setAttribute("aria-pressed",o);if(o)mkBoard()}
$("#mkb").onclick=()=>mkOpen(!document.body.classList.contains("mkopen"));
addEventListener("keydown",e=>{if(e.target.closest("input,textarea"))return;if(e.key=="m"||e.key=="M")mkOpen(!document.body.classList.contains("mkopen"));if(e.key=="Escape"&&document.body.classList.contains("mkopen")&&!$("#panel").classList.contains("open"))mkOpen(false)});
setInterval(async()=>{await prices();mkBoard()},5*6e4);
/* ---- news (Google News headlines, built every 20 min by the Update news job) ---- */
let NW=null,nwf="all";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeU=u=>/^https?:\/\//i.test(u||"")?u:"#";
function ago(d){const m=Math.max(0,Math.round((Date.now()/1000-d)/60));return m<60?m+"m ago":m<1440?Math.round(m/60)+"h ago":new Date(d*1000).toLocaleDateString("en-GB",{day:"numeric",month:"short",timeZone:"Europe/London"})}
const isBrk=x=>x.sc>=6&&Date.now()/1000-x.d<6*3600;
function nwBreaking(){if(!NW)return[];const out=[],seen=[];NW.items.filter(isBrk).sort((a,b)=>b.d-a.d).forEach(x=>{const w=new Set(x.t.toLowerCase().match(/[a-z0-9]{3,}/g)||[]);if(seen.some(s=>{let n=0;w.forEach(v=>s.has(v)&&n++);return n/Math.max(1,new Set([...w,...s]).size)>=.4}))return;seen.push(w);out.push(x)});return out}
const NCAT={energy:["Crude oil","Nat gas"],ags:["Cocoa","Coffee","Wheat","Palm oil","Sugar","Corn","Cotton","Soybeans","Lumber","Orange juice","Rubber","Rice"],metals:["Copper","Gold","Silver","Platinum","Lithium","Iron ore"]};
const CKN={chokepoint1:"Suez",chokepoint2:"Panama",chokepoint3:"Bosphorus",chokepoint4:"Red Sea",chokepoint5:"Malacca",chokepoint6:"Hormuz",chokepoint11:"Taiwan Strait",macro:"Macro"};
function nwRow(x,tags){const tg=tags?x.k.slice(0,3).map(k=>`<i class="nwt">${esc(CKN[k]||k)}</i>`).join(""):"";
return`<a class="nwi" href="${esc(safeU(x.u))}" target="_blank" rel="noopener noreferrer"><b>${isBrk(x)?'<span class="bk">⚡ Breaking</span>':""}${esc(x.t)}</b><small><i>${esc(x.s)}</i><i>${ago(x.d)}</i>${x.n>1?`<i>${x.n} outlets</i>`:""}${tg}</small></a>`}
function nwHTML(key,n){if(!NW)return"";const L=NW.items.filter(x=>x.k.includes(key)).sort((a,b)=>(isBrk(b)-isBrk(a))||(b.d-a.d)).slice(0,n);
if(!L.length)return"";return`<div class="kh">Latest news</div><div class="nwl">${L.map(x=>nwRow(x)).join("")}</div>`}
function openNews(f){if(f)nwf=f;if(!NW){info(`<h2>Market news</h2><div class="note">Headlines load once the Update news job has run in GitHub Actions.</div>`);return}
const fl=[["all","All"],["brk","Breaking"],["energy","Energy"],["ags","Ags"],["metals","Metals"],["ship","Shipping"],["macro","Macro"]];
const pick=x=>nwf=="all"?true:nwf=="brk"?isBrk(x):nwf=="ship"?x.k.some(k=>k.startsWith("chokepoint")):nwf=="macro"?x.k.includes("macro"):x.k.some(k=>NCAT[nwf].includes(k));
const seen=new Set(),L=NW.items.filter(pick).sort((a,b)=>b.d-a.d).filter(x=>{const k=x.t.toLowerCase().slice(0,40);if(seen.has(k))return false;seen.add(k);return true}).slice(0,50);
info(`<h2>Market news</h2><div class="seg" id="nwf">${fl.map(([k,t])=>`<button data-k="${k}" class="${k==nwf?"on":""}">${t}</button>`).join("")}</div>
<div class="nwl">${L.length?L.map(x=>nwRow(x,1)).join(""):'<div class="note">Nothing in this group right now.</div>'}</div>
<div class="note">Headlines via Google News, refreshed every 20 minutes. Updated ${ago(NW.updated)}. ⚡ Breaking = strong market-moving words, carried by several outlets, in the last 6 hours.</div>`);
document.querySelectorAll("#nwf button").forEach(b=>b.onclick=()=>openNews(b.dataset.k))}
async function news(){for(const u of rawUrls("news","news.json")){try{const r=await fetch(u.replace(/\?t=\d+/,"?t="+(Date.now()/12e4|0)));if(r.ok){NW=await r.json();break}}catch(e){}}
if(!NW)return;const B=nwBreaking();$("#nwb").classList.toggle("hot",B.length>0);
R.forEach((r,i)=>{const c=$("#c"+i);c&&c.classList.toggle("brk",B.some(x=>x.k.includes(r.n)))});ticker()}
$("#nwb").onclick=()=>openNews("all");news();setInterval(news,10*6e4);
$("#tick").onclick=e=>{e.target.closest(".ti.evn")?openNews("brk"):openCal()};setTimeout(ticker,0);
setInterval(()=>{document.querySelectorAll(".cd[data-t]").forEach(s=>{const t=+s.dataset.t;s.textContent=cd({t:new Date(t),allday:0})})},6e4);
setInterval(ticker,30*6e4);

let COT=null;(async()=>{try{const r=await fetch("cot.json?t="+(Date.now()/3e5|0));if(r.ok)COT=await r.json()}catch(e){}})();
function cotHTML(r){if(r.n=="Rubber"||r.n=="Iron ore")return`<div class="kh">Fund positioning</div><div class="note">The CFTC doesn't report this market.</div>`;
return`<div class="kh">Fund positioning · CFTC, weekly</div><div class="lgd"><span><i style="background:var(--s1)"></i>Net long</span><span><i style="background:var(--s2)"></i>Net short</span><span>managed money, last 52 weeks</span></div><div id="cc" class="pc"><div class="note">Loading positioning…</div></div><div id="cst"></div>`}
function drawCot(r){const box=$("#cc");if(!box)return;const c=COT&&COT.c[r.n];
if(!c){box.innerHTML=`<div class="note">${COT?"No CFTC data for this market.":"Positioning not loaded yet. Run the Update COT positioning job."}</div>`;return}
const N=c.d.length,a=Math.max(0,N-52),mm=c.mm,W=box.clientWidth||340,Ht=120,pr=44,pt=8,pb=18,iw=W-pr,ih=Ht-pt-pb;
const sl=mm.slice(a),mx=Math.max(1,...sl.map(Math.abs)),y0=pt+ih/2,sc=v=>v/mx*(ih/2),bw=iw/(N-a),fmtK=v=>(v<0?"−":"+")+Math.abs(v).toLocaleString("en");
let g=`<line x1="0" x2="${iw}" y1="${y0}" y2="${y0}" class="gl"/><text x="${W-2}" y="${pt+8}" class="ax" text-anchor="end">${fmtK(Math.round(mx/1000))}k</text><text x="${W-2}" y="${y0+3.5}" class="ax" text-anchor="end">0</text><text x="${W-2}" y="${pt+ih}" class="ax" text-anchor="end">${fmtK(-Math.round(mx/1000))}k</text>`;
for(let i=a;i<N;i++){const v=mm[i],hgt=Math.max(1,Math.abs(sc(v))),xx=(i-a)*bw+.75;g+=`<rect x="${xx.toFixed(1)}" y="${(v>=0?y0-hgt:y0).toFixed(1)}" width="${Math.max(1,bw-1.5).toFixed(1)}" height="${hgt.toFixed(1)}" rx="1.5" class="${v>=0?"cb1":"cb2"}" data-i="${i}"/>`}
let lm=-1;for(let i=a;i<N;i++){const mo=+c.d[i].slice(5,7);if(mo!=lm&&i>a&&mo%3==1)g+=`<text x="${((i-a)*bw).toFixed(1)}" y="${Ht-4}" class="ax">${new Date(c.d[i]).toLocaleDateString("en-GB",{month:"short",timeZone:"UTC"})}</text>`;lm=mo}
box.innerHTML=`<svg width="${W}" height="${Ht}" class="chs">${g}<rect x="0" y="0" width="${iw}" height="${Ht}" fill="transparent" id="chit2"/></svg><div class="tt" id="tt2" style="display:none"></div>`;
const hit=box.querySelector("#chit2"),tt=box.querySelector("#tt2");
const mv=e=>{const px=e.clientX-hit.getBoundingClientRect().left,i=Math.max(a,Math.min(N-1,a+Math.floor(px/bw)));
box.querySelectorAll("rect[data-i]").forEach(b=>b.classList.toggle("hv",+b.dataset.i==i));
tt.textContent="";const hd=document.createElement("div");hd.className="th";hd.textContent=new Date(c.d[i]).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"});
const rw=document.createElement("div");rw.className="tr";const k=document.createElement("i");k.style.background=`var(${mm[i]>=0?"--s1":"--s2"})`;const b=document.createElement("b");b.textContent=fmtK(mm[i]);const s=document.createElement("span");s.textContent=(c.oi[i]?(Math.abs(mm[i])/c.oi[i]*100).toFixed(0)+"% of OI":"");rw.append(k,b,s);tt.append(hd,rw);
tt.style.display="";const X0=(i-a)*bw,tw=tt.offsetWidth;tt.style.left=(X0>W/2?Math.max(0,X0-tw-8):Math.min(W-tw,X0+bw+8))+"px"};
hit.addEventListener("pointermove",mv);hit.addEventListener("pointerdown",mv);hit.addEventListener("pointerleave",()=>{tt.style.display="none";box.querySelectorAll("rect.hv").forEach(b=>b.classList.remove("hv"))});
const L=mm[N-1],wk=N>1?L-mm[N-2]:0,hist=mm.slice(Math.max(0,N-156)),pct=Math.round(hist.filter(v=>v<L).length/(hist.length-1||1)*100);
const lg=L>=0,lab=pct>=90?(lg?"Crowded long: near a 3-year high":"Least short in 3 years"):pct>=75?(lg?"Heavily long vs its history":"Shorts shrinking vs its history"):pct<=10?(lg?"Least long in 3 years":"Crowded short: near a 3-year low"):pct<=25?(lg?"Lightly long vs its history":"Heavily short vs its history"):"Middle of its 3-year range";
const oi=c.oi[N-1],dt=new Date(c.d[N-1]).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",timeZone:"UTC"});
$("#cst").innerHTML=`<div class="row"><span>Funds net (managed money)</span><b>${fmtK(L)} contracts${oi?` · ${(Math.abs(L)/oi*100).toFixed(0)}% of OI`:""}</b></div>
<div class="row"><span>Change on the week</span><b><i class="${wk>=0?"up":"dn"}">${wk>=0?"▲":"▼"}${Math.abs(wk).toLocaleString("en")}</i></b></div>
<div class="row"><span>3-year percentile</span><b class="wrap">${pct}${(pct%100>10&&pct%100<14)?"th":["th","st","nd","rd"][pct%10]||"th"} · ${lab}</b></div><div class="rb"><i style="left:${pct}%"></i></div>
<div class="row"><span>Producers & merchants net</span><b>${fmtK(c.pm[N-1])}</b></div>
<div class="note">As of ${dt}, published the following Friday.${r.n=="Crude oil"?" Uses WTI (NYMEX) positioning; Brent is not reported by the CFTC.":""} Extreme positioning can mean a crowded trade at risk of reversing, not a timing signal on its own.</div>`}

let HI=null;
function rawUrls(br,file){const m=location.hostname.match(/^([^.]+)\.github\.io$/),rp=location.pathname.split("/")[1];
return m&&rp?[`https://raw.githubusercontent.com/${m[1]}/${rp}/${br}/${file}?t=${Date.now()/3e5|0}`,file]:[file]}
async function hist(){for(const u of rawUrls("hist","history.json")){try{const r=await fetch(u);if(r.ok){HI=await r.json();break}}catch(e){}}}
hist();
const sma=(c,n)=>c.map((_,i)=>{if(i<n-1)return null;let s=0;for(let k=i-n+1;k<=i;k++)s+=c[k];return s/n});
let CR=126;
function chartHTML(r){if(!r.sym)return`<div class="kh">Price history</div><div class="note">No free price history for this one.</div>`;
return`<div class="kh">Price history</div><div class="rng" id="rng">${[[21,"1M"],[63,"3M"],[126,"6M"],[252,"1Y"]].map(([n,t])=>`<button data-n="${n}"${n==CR?' class="on"':""}>${t}</button>`).join("")}</div>
<div class="lgd"><span><i style="background:var(--s1)"></i>Price</span><span><i style="background:var(--s2)"></i>50-day avg</span><span><i style="background:var(--s3)"></i>200-day avg</span></div>
<div id="pc" class="pc"><div class="note">Loading history…</div></div><div id="pst"></div>`}
function drawChart(r){const box=$("#pc");if(!box||!r.sym)return;const H=HI&&HI.s[r.sym];
if(!H){box.innerHTML=`<div class="note">${HI?"No history for this contract yet.":"History not loaded yet. Run the Update price history job."}</div>`;return}
const C=H.c,T=H.t,m50=sma(C,50),m200=sma(C,200),N=C.length,a=Math.max(0,N-CR);
const W=box.clientWidth||340,Ht=180,pl=4,pr=44,pt=10,pb=22,iw=W-pl-pr,ih=Ht-pt-pb;
const vals=[];for(let i=a;i<N;i++){vals.push(C[i]);if(m50[i]!=null)vals.push(m50[i]);if(m200[i]!=null)vals.push(m200[i])}
let lo=Math.min(...vals),hi=Math.max(...vals);const pad=(hi-lo)*.08||1;lo-=pad;hi+=pad;
const x=i=>pl+(i-a)/(N-1-a||1)*iw,y=v=>pt+(hi-v)/(hi-lo)*ih;
const path=s=>{let d="",on=false;for(let i=a;i<N;i++){if(s[i]==null){on=false;continue}d+=(on?"L":"M")+x(i).toFixed(1)+" "+y(s[i]).toFixed(1);on=true}return d};
const dp=Math.abs(hi)<20?2:0,fmt=v=>v.toLocaleString("en",{minimumFractionDigits:dp,maximumFractionDigits:dp});
let g="";for(let k=0;k<=3;k++){const v=lo+pad+(hi-lo-2*pad)*k/3,yy=y(v);g+=`<line x1="${pl}" x2="${pl+iw}" y1="${yy}" y2="${yy}" class="gl"/><text x="${W-2}" y="${yy+3.5}" class="ax" text-anchor="end">${fmt(v)}</text>`}
const D=i=>new Date(T[i]*864e5);let lastM=-1;for(let i=a;i<N;i++){const d=D(i),mo=d.getUTCMonth();if(mo!=lastM&&i>a){const step=CR<=63?1:CR<=126?2:3;if(mo%step==0)g+=`<text x="${x(i)}" y="${Ht-6}" class="ax" text-anchor="middle">${d.toLocaleDateString("en-GB",{month:"short",timeZone:"UTC"})}</text>`}lastM=mo}
box.innerHTML=`<svg width="${W}" height="${Ht}" viewBox="0 0 ${W} ${Ht}" class="chs">${g}<path d="${path(m200)}" class="l3"/><path d="${path(m50)}" class="l2"/><path d="${path(C)}" class="l1"/>
<line id="cx" class="cx" y1="${pt}" y2="${pt+ih}" style="display:none"/><g id="cd" style="display:none"><circle r="4" class="d1"/><circle r="4" class="d2"/><circle r="4" class="d3"/></g><rect x="${pl}" y="0" width="${iw}" height="${Ht}" fill="transparent" id="chit"/></svg><div class="tt" id="tt" style="display:none"></div>`;
const hit=box.querySelector("#chit"),cx=box.querySelector("#cx"),cd=box.querySelector("#cd"),tt=box.querySelector("#tt");
const mv=e=>{const bx=hit.getBoundingClientRect(),px=(e.touches?e.touches[0].clientX:e.clientX)-bx.left,i=Math.max(a,Math.min(N-1,Math.round(a+px/iw*(N-1-a))));
const X0=x(i);cx.setAttribute("x1",X0);cx.setAttribute("x2",X0);cx.style.display="";cd.style.display="";
[[C,".d1"],[m50,".d2"],[m200,".d3"]].forEach(([s,c])=>{const el=cd.querySelector(c);if(s[i]==null){el.style.display="none"}else{el.style.display="";el.setAttribute("cx",X0);el.setAttribute("cy",y(s[i]))}});
tt.textContent="";const hd=document.createElement("div");hd.className="th";hd.textContent=D(i).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"});tt.appendChild(hd);
[[C[i],"Price","--s1"],[m50[i],"50-day","--s2"],[m200[i],"200-day","--s3"]].forEach(([v,l,cv])=>{if(v==null)return;const rw=document.createElement("div");rw.className="tr";const k=document.createElement("i");k.style.background=`var(${cv})`;const b=document.createElement("b");b.textContent=fmt(v);const s=document.createElement("span");s.textContent=l;rw.append(k,b,s);tt.appendChild(rw)});
tt.style.display="";const tw=tt.offsetWidth;tt.style.left=(X0>W/2?Math.max(0,X0-tw-10):Math.min(W-tw,X0+10))+"px"};
const out=()=>{cx.style.display="none";cd.style.display="none";tt.style.display="none"};
hit.addEventListener("pointermove",mv);hit.addEventListener("pointerdown",mv);hit.addEventListener("pointerleave",out);
// stats
const ch=n=>N>n?(C[N-1]/C[N-1-n]-1)*100:null,yr=C.slice(Math.max(0,N-252)),yl=Math.min(...yr),yh=Math.max(...yr),pos=(C[N-1]-yl)/(yh-yl||1)*100;
const lr=[];for(let i=Math.max(1,N-20);i<N;i++)lr.push(Math.log(C[i]/C[i-1]));const mu=lr.reduce((s,v)=>s+v,0)/lr.length,vol=Math.sqrt(lr.reduce((s,v)=>s+(v-mu)**2,0)/(lr.length-1))*Math.sqrt(252)*100;
const L=C[N-1],a50=m50[N-1],a200=m200[N-1];let tr="Not enough history";
if(a200!=null){const up=L>a200,g=a50>a200;tr=up&&g?"Uptrend: price and 50-day both above 200-day":!up&&!g?"Downtrend: price and 50-day both below 200-day":up?"Mixed: price above 200-day, 50-day still below":"Mixed: price below 200-day, 50-day still above"}
const pc=v=>v==null?"—":`<i class="${v>=0?"up":"dn"}">${v>=0?"▲":"▼"}${f(Math.abs(v))}%</i>`;
$("#pst").innerHTML=`<div class="row"><span>Change 1M · 3M · 1Y</span><b>${pc(ch(21))} · ${pc(ch(63))} · ${pc(ch(252))}</b></div>
<div class="row"><span>52-week range</span><b>${fmt(yl)} – ${fmt(yh)}</b></div><div class="rb"><i style="left:${pos}%"></i></div>
<div class="row"><span>Trend</span><b class="wrap">${tr}</b></div>
<div class="row"><span>Volatility (20-day, annualised)</span><b>${f(vol)}%</b></div>`;
box.parentNode.querySelectorAll("#rng button").forEach(b=>b.onclick=()=>{CR=+b.dataset.n;box.parentNode.querySelectorAll("#rng button").forEach(x=>x.classList.toggle("on",x==b));drawChart(r)})}


const SSC=[[34,"#5ebaff","TD","D","Depression"],[64,"#00d9d0","TS","S","Tropical storm"],[83,"#ffe66d","H1","H","Category 1"],[96,"#ffc140","H2","H","Category 2"],[113,"#ff8f20","H3","M","Category 3"],[137,"#ff5050","H4","M","Category 4"],[999,"#c23cff","H5","M","Category 5"]];
const ssc=kt=>SSC.find(c=>(kt||0)<c[0]);

function nhcT(t){if(!t)return null;let m=t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*([A-Z]{3,4})\s+([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
const OFF={EDT:-4,EST:-5,CDT:-5,CST:-6,MDT:-6,MST:-7,PDT:-7,PST:-8,HST:-10,AST:-4,UTC:0,GMT:0,Z:0};
if(m){let hh=+m[1]%12+(m[3]=="PM"?12:0);const mo=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].indexOf(m[5].slice(0,3).toLowerCase());if(mo<0||OFF[m[4]]==null)return null;return new Date(Date.UTC(+m[7],mo,+m[6],hh-OFF[m[4]],+m[2]))}
m=t.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);if(m)return new Date(Date.UTC(+m[1],m[2]-1,+m[3],+m[4],+m[5]));return null}
const ukT=t=>{const d=nhcT(t);return d?d.toLocaleString("en-GB",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Europe/London"}):(t||"—")};
function stormSym(kt,south,sz=34,spin=true){const c=ssc(kt),col=c[1],L=c[3],hu=(kt||0)>=64,ts=(kt||0)>=34,sx=south?-1:1;
const arms=ts?`<g transform="scale(${sx},1)" fill="none" stroke="${col}" stroke-width="${hu?4.2:3}" stroke-linecap="round"><path d="M0,-8 C-5,-15 -12,-16 -17,-12"/><path d="M0,8 C5,15 12,16 17,12"/></g>
<g transform="scale(${sx},1)" fill="none" stroke="#0b0f12" stroke-width="${hu?1.2:1}" stroke-linecap="round" opacity=".55"><path d="M0,-8 C-5,-15 -12,-16 -17,-12"/><path d="M0,8 C5,15 12,16 17,12"/></g>`:"";
return`<svg viewBox="-24 -24 48 48" width="${sz}" height="${sz}" class="ssym" overflow="visible" aria-hidden="true"><g class="${spin?(south?"spcw":"spccw"):""}">${arms}</g>
<circle r="8.2" fill="${hu?col:"#0b0f12cc"}" stroke="${col}" stroke-width="2.4"/><circle r="9.6" fill="none" stroke="#0b0f12" stroke-width="1" opacity=".5"/>
<text y="3.6" text-anchor="middle" font-size="10" font-weight="800" font-family="ui-monospace,Menlo,Consolas,monospace" fill="${hu?"#0b0f12":col}">${L}</text></svg>`}
function sscStrip(kt){const lab=["TD","TS","1","2","3","4","5"],cur=SSC.indexOf(ssc(kt));
return`<div class="ssk">${SSC.map((c,i)=>`<span style="--c:${c[1]}"${i==cur?' class="on"':""}>${lab[i]}</span>`).join("")}</div><div class="sskl"><span>&lt;34 kt</span><span>Saffir–Simpson scale</span><span>≥137 kt</span></div>`}
function cat(s){const k=s.kt;if(k>=137)return"Cat 5";if(k>=113)return"Cat 4";if(k>=96)return"Cat 3";if(k>=83)return"Cat 2";if(k>=64)return"Cat 1";if(k>=34)return"Trop. storm";return"Depression"}
function km(a,b,c,d){const r=Math.PI/180,x=Math.sin((c-a)*r/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin((d-b)*r/2)**2;return 12742*Math.asin(Math.sqrt(x))}
function wrapPath(pts,close){let d="",pl=null;pts.forEach(([lo,la],i)=>{if(pl!==null&&Math.abs(lo-pl)>180)d+="M";else d+=i?"L":"M";d+=(lo+180).toFixed(2)+" "+(90-la).toFixed(2);pl=lo});return d+(close?"Z":"")}
let STM=[];
function atRisk(s){const P=[[s.lon,s.lat],...s.track],out=[];
const near=(la,lo)=>Math.min(...P.map(p=>km(la,lo,p[1],p[0])));
R.forEach((r,i)=>{const d=near(r.lat,r.lon);if(d<700)out.push({n:r.n,k:"Commodity",d,i})});
MK.forEach(m=>{const d=near(m.lat,m.lon);if(d<500)out.push({n:m.n,k:m.k=="choke"?"Chokepoint":"Port",d})});return out.sort((a,b)=>a.d-b.d)}
function showStorm(s){const rk=atRisk(s),age=s.time?Math.round((Date.now()-new Date(s.time.endsWith("Z")?s.time:s.time+"Z"))/36e5):null;
const cc=ssc(s.kt);info(`<h2 style="display:flex;align-items:center;gap:8px">${stormSym(s.kt,s.lat<0,40,false)}<span>${s.name} · ${cc[4]}</span></h2>${sscStrip(s.kt)}
<div class="row"><span>Max wind</span><b>${s.kt} kt (${Math.round(s.kt*1.852)} km/h)</b></div>
${s.mb?`<div class="row"><span>Pressure</span><b>${s.mb} mb</b></div>`:""}
${s.spd!=null?`<div class="row"><span>Moving</span><b>${s.spd} mph towards the ${["N","NE","E","SE","S","SW","W","NW"][Math.round(s.dir/45)%8]}</b></div>`:""}
<div class="row"><span>Position</span><b>${Math.abs(s.lat).toFixed(1)}°${s.lat>=0?"N":"S"} ${Math.abs(s.lon).toFixed(1)}°${s.lon>=0?"E":"W"}</b></div>
<div class="row"><span>Source</span><b>${s.src=="NHC"?"US National Hurricane Center":"GDACS (global alerts)"}${age!=null?" · "+age+"h ago":""}</b></div>
${s.fc&&s.fc.length?`<div class="kh">Forecast track</div><table class="ftb"><tr><th>Valid (UK)</th><th>Position</th><th>Wind</th></tr>${s.fc.map(f=>`<tr><td>${ukT(f.t)}</td><td>${Math.abs(f.p[1]).toFixed(1)}°${f.p[1]>=0?"N":"S"} ${Math.abs(f.p[0]).toFixed(1)}°${f.p[0]>=0?"E":"W"}</td><td>${f.kt!=null?`<span class="fsw" style="--c:${ssc(f.kt)[1]}"></span>${f.kt} kt · ${ssc(f.kt)[2]}`:"—"}</td></tr>`).join("")}</table>`:""}
<div class="kh">Within reach of its forecast path</div>${rk.length?'<ul class="dl">'+rk.map(x=>`<li><b>${x.n}</b> · ${x.k}, ~${Math.round(x.d/50)*50} km</li>`).join("")+"</ul>":'<div class="note" style="margin-top:4px">No tracked commodity regions, ports or chokepoints near its path.</div>'}
${s.url?`<div class="note"><a href="${s.url}" target="_blank" rel="noopener" style="color:inherit">Official advisory ↗</a></div>`:""}
<div class="note">Solid line: where it has been. Dashed: forecast track${s.fc.some(f=>f.kt!=null)?", dots coloured by forecast strength":""}. ${s.cone.length?(s.src=="NHC"?"Grey area: NHC forecast cone, the likely path of the centre, not the size of the storm.":"Grey area: forecast reach of 60 km/h winds."):""} Distances are rough.</div>`)}
async function storms(){let j=null;try{const r=await fetch("storms.json?t="+Date.now());if(r.ok)j=await r.json()}catch(e){}
document.querySelectorAll(".mk.L-storms").forEach(x=>x.remove());document.querySelectorAll(".chip.storm").forEach(x=>x.classList.remove("storm"));
let g=OV.querySelector("g.L-storms");if(!g){g=document.createElementNS("http://www.w3.org/2000/svg","g");g.setAttribute("class","L-storms");OV.appendChild(g)}g.innerHTML="";
STM=j?j.storms:[];
STM.forEach((s,si)=>{s.past=s.past||[];s.fc=s.fc||[];s.cone.forEach(c=>g.insertAdjacentHTML("beforeend",`<path class="stc" d="${wrapPath(c,1)}"/>`));
if(s.past.length>1)g.insertAdjacentHTML("beforeend",`<path class="stp" d="${wrapPath(s.past.concat([[s.lon,s.lat]]),0)}"/>`);
if(s.track.length>1)g.insertAdjacentHTML("beforeend",`<path class="stt" d="${wrapPath(s.track,0)}"/>`);
const south=s.lat<0,cc=ssc(s.kt);
s.fc.forEach((f,fi)=>{if(fi==0&&Math.abs(f.p[0]-s.lon)<.3&&Math.abs(f.p[1]-s.lat)<.3)return;const e=document.createElement("div");e.className="mk L-storms sfp";e.style.left=X(f.p[0])/3.6+"%";e.style.top=Y(f.p[1])/1.8+"%";
e.innerHTML=f.kt!=null?stormSym(f.kt,f.p[1]<0,16,false):`<i></i>`;e.title=ukT(f.t)+" UK"+(f.kt?" · "+f.kt+" kt":"");e.onclick=()=>showStorm(s);map.appendChild(e)});
const e=document.createElement("div");e.className="mk L-storms sym";e.style.left=X(s.lon)/3.6+"%";e.style.top=Y(s.lat)/1.8+"%";
e.innerHTML=stormSym(s.kt,south)+`<span class="stag" style="--c:${cc[1]}">${s.name.toUpperCase()} · ${cc[2]}</span>`;e.onclick=()=>{showStorm(s);e.classList.add("on")};map.appendChild(e);
atRisk(s).forEach(x=>{if(x.i!=null){const c=$("#c"+x.i);c&&c.classList.add("storm");R[x.i].st={n:s.name,c:cat(s),d:x.d,si}}})});
layout()}
storms();

/* ---- chokepoint traffic (IMF PortWatch) ---- */
let CK=null;const CST={severe:["#d33b3b","Severe drop"],low:["#e0a020","Below normal"],ok:["#3a9a5b","Normal"],high:["#2a78d6","Busier than normal"]};
const ra7=(v,i)=>{let s=0,n=0;for(let k=Math.max(0,i-6);k<=i;k++){s+=v[k];n++}return s/n};
function ckStat(c){const N=c.d.length,bl=a=>{const s=a.slice(Math.max(0,N-365),N-30);return s.length?s.reduce((x,y)=>x+y,0)/s.length:0},cur=a=>ra7(a,N-1);
const o={};["tot","tank","cont","bulk","cap"].forEach(k=>{const a=c[k]||[],b=bl(a),v=cur(a);o[k]={v,b,p:b>0?v/b-1:null,y:N>371?ra7(a,N-365):null}});
const p=o.tot.p;o.lv=p==null||o.tot.b<3?"ok":p<=-.4?"severe":p<=-.2?"low":p>=.3?"high":"ok";o.last=c.d[N-1];return o}
async function chokes(){try{const r=await fetch("chokes.json?t="+Date.now());if(r.ok)CK=await r.json()}catch(e){}
if(!CK)return;MK.forEach(m=>{if(m.k!="choke"||!m.el)return;const c=CK.c[m.id];m.el.querySelector("b.cb")?.remove();if(!c||c.d.length<60)return;
const s=m.cs=ckStat(c);m.el.style.setProperty("--cs",CST[s.lv][0]);m.el.classList.add("cdat");
if(s.lv!="ok"&&s.tot.p!=null)m.el.insertAdjacentHTML("beforeend",`<b class="cb">${s.tot.p>0?"+":"−"}${Math.abs(Math.round(s.tot.p*100))}%</b>`);
m.el.title=`${m.n}: ${Math.round(s.tot.v)} ships/day, ${s.tot.p>=0?"+":"−"}${Math.abs(Math.round(s.tot.p*100))}% vs normal`});layout()}
function ckChart(box,c,s){const N=c.d.length,D=Math.min(120,N),a=N-D,W=box.clientWidth||340,Ht=170,pl=4,pr=36,pt=8,pb=20,iw=W-pl-pr,ih=Ht-pt-pb;
const cur=[],ly=[];for(let i=a;i<N;i++){cur.push(ra7(c.tot,i));ly.push(i-364>=6?ra7(c.tot,i-364):null)}
const mx=Math.max(s.tot.b,...cur,...ly.filter(v=>v!=null))*1.12,x=i=>pl+i/(D-1)*iw,y=v=>pt+(1-v/mx)*ih;
const st=[1,2,5,10,20,25,50,100,200,250,500].find(q=>mx/q<=5)||1000;let g="";
for(let t=0;t<=mx;t+=st)g+=`<line x1="${pl}" x2="${pl+iw}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${W-2}" y="${y(t)+3.5}" class="ax" text-anchor="end">${t}</text>`;
const md=k=>new Date(c.d[a+k]+"T12:00Z");for(let k=0;k<D;k++){const d=md(k);if(d.getUTCDate()==1)g+=`<line x1="${x(k)}" x2="${x(k)}" y1="${pt}" y2="${pt+ih}" class="gl" style="opacity:.5"/><text x="${x(k)}" y="${Ht-5}" class="ax" text-anchor="middle">${d.toLocaleString("en-GB",{month:"short"})}</text>`}
g+=`<line x1="${pl}" x2="${pl+iw}" y1="${y(s.tot.b)}" y2="${y(s.tot.b)}" style="stroke:var(--mut);stroke-dasharray:4 3;stroke-width:1.2"/><text x="${pl+3}" y="${y(s.tot.b)-4}" class="ax bl">normal ${Math.round(s.tot.b)}/day</text>`;
const pth=v=>{let d="",on=0;v.forEach((q,i)=>{if(q==null){on=0;return}d+=(on?"L":"M")+x(i).toFixed(1)+" "+y(q).toFixed(1);on=1});return d};
const col=CST[s.lv][0];g+=`<path d="${pth(ly)}" fill="none" stroke="var(--mut)" stroke-width="1.3" opacity=".7"/><path d="${pth(cur)}" fill="none" stroke="${col}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="${x(D-1)}" cy="${y(cur[D-1])}" r="4" fill="${col}" stroke="var(--card)" stroke-width="2"/>`;
box.innerHTML=`<svg width="${W}" height="${Ht}" class="chs">${g}<line class="cx" y1="${pt}" y2="${pt+ih}" style="display:none"/><rect x="${pl}" y="0" width="${iw}" height="${Ht}" fill="transparent" class="hz"/></svg><div class="tt" style="display:none"></div>`;
const hz=box.querySelector(".hz"),cx=box.querySelector(".cx"),tt=box.querySelector(".tt");
const mv=e=>{const px=e.clientX-hz.getBoundingClientRect().left,i=Math.max(0,Math.min(D-1,Math.round(px/iw*(D-1))));cx.setAttribute("x1",x(i));cx.setAttribute("x2",x(i));cx.style.display="";tt.textContent="";
const hd=document.createElement("div");hd.className="th";hd.textContent=md(i).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"})+" · 7-day avg";tt.appendChild(hd);
[[col,"This year",cur[i]],["var(--mut)","Last year",ly[i]],["var(--mut)","Normal",s.tot.b],[null,"That day",c.tot[a+i]]].forEach(([cc,l,v])=>{if(v==null)return;const rw=document.createElement("div");rw.className="tr";const k=document.createElement("i");k.style.background=cc||"transparent";const sp=document.createElement("span");sp.textContent=l;const b=document.createElement("b");b.textContent=Math.round(v)+" ships";rw.append(k,sp,b);tt.appendChild(rw)});
tt.style.display="";const tw=tt.offsetWidth;tt.style.left=Math.min(W-tw-2,Math.max(0,x(i)+10>W-tw?x(i)-tw-10:x(i)+10))+"px"};
hz.addEventListener("pointermove",mv);hz.addEventListener("pointerdown",mv);hz.addEventListener("pointerleave",()=>{cx.style.display="none";tt.style.display="none"})}
function showChoke(m){const c=CK&&CK.c[m.id],why=`<div class="kh">Why it matters</div><div style="font-size:13px;line-height:1.4">${m.w}</div>`;
if(!c||!m.cs){info(`<h2>⚓ ${m.n}</h2>${why}${nwHTML(m.id,4)}<div class="note">${CK?"No traffic data for this chokepoint.":"Traffic data loads once the Update chokepoints job has run in GitHub Actions."}</div>`);m.el&&m.el.classList.add("on");return}
const s=m.cs,P=v=>v==null?"—":(v>=0?"+":"−")+Math.abs(Math.round(v*100))+"%",pc=v=>v==null?"":v<=-.2?"dn":v>=.2?"up":"",lag=Math.round((Date.now()-new Date(s.last+"T12:00Z"))/864e5);
const yoy=s.tot.y?s.tot.v/s.tot.y-1:null,cap=s.cap.v*1000,capT=cap>=1e6?(cap/1e6).toFixed(1)+"m t":Math.round(cap/1e3)+"k t";
const rows=[["tank","Tankers","oil, products, LNG, chemicals"],["cont","Containers","manufactured goods"],["bulk","Dry bulk","grain, ore, coal"]].map(([k,l])=>{const o=s[k];return o.b<.5&&o.v<.5?"":`<span>${l}</span><b>${o.v.toFixed(o.v<10?1:0)}/day</b><b class="${pc(o.p)}">${P(o.p)}</b>`}).join("");
info(`<h2>⚓ ${m.n} <span class="cpill" style="--cs:${CST[s.lv][0]}">${CST[s.lv][1]}</span></h2>
<div class="tgrid"><div><span class="note" style="margin:0">Ships/day (7d)</span><b>${Math.round(s.tot.v)}</b></div><div><span class="note" style="margin:0">vs normal</span><b class="${pc(s.tot.p)}">${P(s.tot.p)}</b></div><div><span class="note" style="margin:0">vs last year</span><b class="${pc(yoy)}">${P(yoy)}</b></div></div>
<div id="ckc" style="position:relative;margin:6px 0"></div>
<div class="ckey"><span><i style="background:${CST[s.lv][0]}"></i>7-day average</span><span><i style="background:var(--mut);opacity:.7"></i>same time last year</span><span>╌ normal (past year)</span></div>
<div class="kh">By ship type · last 7 days vs normal</div><div class="ctype">${rows}</div>
<div class="row"><span>Cargo capacity</span><b>${capT}/day <span class="${pc(s.cap.p)}">${P(s.cap.p)}</span></b></div>${why}${nwHTML(m.id,4)}
<div class="note">IMF PortWatch, counted from satellite ship tracking (AIS). Runs about ${lag} days behind: latest day ${new Date(s.last+"T12:00Z").toLocaleDateString("en-GB",{day:"numeric",month:"short"})}. Normal = average of the past year excluding the last 30 days. Colours: <b style="color:${CST.severe[0]}">red</b> 40%+ below normal, <b style="color:${CST.low[0]}">amber</b> 20%+ below, <b style="color:${CST.high[0]}">blue</b> 30%+ above. <a href="https://portwatch.imf.org/" target="_blank" rel="noopener">PortWatch ↗</a></div>`);
m.el&&m.el.classList.add("on");requestAnimationFrame(()=>ckChart($("#ckc"),c,s))}
chokes();

$("#tg").insertAdjacentHTML("beforeend",'<div class="lg"><i style="color:#d9692a">━ oil</i><i style="color:#4aa35a">━ ag</i><i style="color:#6b86c9">━ metals</i><i style="color:#a86bd6">╌ gas</i><i>dashed = pipeline</i></div>');
const LD=document.createElementNS("http://www.w3.org/2000/svg","svg");LD.id="ld";map.appendChild(LD);
R.forEach((r,i)=>{const e=document.createElement("div");e.className="pin";e.style.left=X(r.lon)/3.6+"%";e.style.top=Y(r.lat)/1.8+"%";
e.innerHTML=`<div class="chip" id="c${i}"><b>${r.n}</b><span id="p${i}"></span></div><div class="dot"></div>`;
e.onclick=()=>{show(i);document.querySelectorAll(".pin").forEach(x=>x.classList.remove("sel"));e.classList.add("sel");layout();const s=$("#scroll");s.scrollTo({left:e.offsetLeft-s.clientWidth/2,top:Math.max(0,e.offsetTop-s.clientHeight/3),behavior:"smooth"})};map.appendChild(e)});
function layout(){const W=map.offsetWidth,H=map.offsetHeight;LD.setAttribute("width",W);LD.setAttribute("height",H);
document.querySelectorAll(".chip.hid").forEach(c=>c.classList.remove("hid"));const P=[...document.querySelectorAll(".pin")].filter(p=>p.offsetWidth).sort((a,b)=>b.classList.contains("sel")-a.classList.contains("sel"));
const ob=P.map(p=>[p.offsetLeft-7,p.offsetTop-2,p.offsetLeft+7,p.offsetTop+12]);
document.querySelectorAll(".mk").forEach(m=>{if(!m.offsetWidth)return;ob.push([m.offsetLeft-9,m.offsetTop-9,m.offsetLeft+9,m.offsetTop+9]);const b=m.querySelector("b.cb");if(b&&b.offsetWidth)ob.push([m.offsetLeft-b.offsetWidth/2-2,m.offsetTop-28,m.offsetLeft+b.offsetWidth/2+2,m.offsetTop-9]);const t=m.querySelector(".stag");if(t&&t.offsetWidth)ob.push([m.offsetLeft+17,m.offsetTop-12,m.offsetLeft+21+t.offsetWidth,m.offsetTop+12])});
const hit=(a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];
const placed=[];let ln="";
P.forEach(p=>{const c=p.firstElementChild,w=c.offsetWidth,h=c.offsetHeight,ax=p.offsetLeft,ay=p.offsetTop,g=6;
const C=[[0,-h/2-g],[w/2,-h/2-g],[-w/2,-h/2-g],[w/2+10,0],[-w/2-10,0],[w/2+4,h/2+14],[-w/2-4,h/2+14],[0,h/2+14],[0,-h*1.5-g-4],[w/2,-h*1.5-g-4],[-w/2,-h*1.5-g-4],[w/2+10,-h-4],[-w/2-10,-h-4],[w/2+10,h+6],[-w/2-10,h+6],[w+14,-h/2-g],[-w-14,-h/2-g],[0,-h*2.5-g-8],[w/2+10,-h*2-8],[-w/2-10,-h*2-8],[w/2+10,h*2+8],[-w/2-10,h*2+8]];
let pick=null;
for(const k of C){const r=[ax+k[0]-w/2-3,ay+k[1]-h/2-3,ax+k[0]+w/2+3,ay+k[1]+h/2+3];
if(r[0]<0||r[2]>W||r[1]<0||r[3]>H)continue;
if(placed.some(q=>hit(r,q))||ob.some(q=>hit(r,q)))continue;pick=k;break}
if(!pick){c.classList.add("hid");return}
const q=[ax+pick[0]-w/2,ay+pick[1]-h/2,ax+pick[0]+w/2,ay+pick[1]+h/2];placed.push(q);
c.style.transform=`translate(${pick[0]}px,${pick[1]+h/2}px)`;
const nx=Math.max(q[0],Math.min(ax,q[2])),ny=Math.max(q[1],Math.min(ay+4,q[3]));
if(Math.hypot(nx-ax,ny-ay-4)>7)ln+=`<line x1="${ax}" y1="${ay+4}" x2="${nx}" y2="${ny}" style="stroke:var(--mut);stroke-width:1"/>`});
LD.innerHTML=ln}
requestAnimationFrame(layout);
const f=(v,d=1)=>v==null?"—":Number(v).toLocaleString("en",{maximumFractionDigits:d});
function paint(i){const r=R[i];$("#p"+i).innerHTML=f(r.p,r.p<20?2:0)+(r.gl?' <i class="glw">⚠ check</i>':r.ch!=null?` <i class="${r.ch>=0?"up":"dn"}">${r.ch>=0?"▲":"▼"}${f(Math.abs(r.ch))}%</i>`:"");
const c=$("#c"+i);c.classList.remove("wet","dry","hot","cold");c.classList.toggle("smp",!r.live);const sg=sig(r)[0];if(sg)c.classList.add(sg)}
const MAC={"DX-Y.NYB":["US dollar index",2,"a stronger dollar usually weighs on commodity prices"],"^TNX":["US 10-year yield",2,"higher yields raise the cost of holding gold"],"^VIX":["VIX fear gauge",1,"spikes signal risk-off buying of havens"],
"BRL=X":["USD/BRL",3,"higher = weaker Brazilian real, which encourages Brazilian selling"],"ZAR=X":["USD/ZAR",2,"higher = weaker rand, cheaper South African supply"],"CNY=X":["USD/CNY",3,"higher = weaker yuan, dearer imports for China"],
"INR=X":["USD/INR",2,"higher = weaker rupee, encourages Indian exports"],"MYR=X":["USD/MYR",3,"higher = weaker ringgit, cheaper Malaysian palm oil"],"CAD=X":["USD/CAD",3,"higher = weaker Canadian dollar, cheaper Canadian lumber"],
"000001.SS":["Shanghai Composite",0,"a rough read on Chinese demand sentiment"],"LIT":["Lithium & battery ETF (LIT)",2,"equity proxy, as lithium has no free futures feed"],"ITB":["US homebuilders ETF (ITB)",2,"proxy for US housing demand"],
"CL=F":["WTI crude",2,"US benchmark crude"],"BZ=F":["Brent crude",2,"oil feeds fertiliser, transport and biofuel demand"],"GC=F":["Gold",0,"silver tends to follow gold"],"ZL=F":["Soybean oil",2,"palm oil's closest substitute"],"HG=F":["Copper",2,"a read on industrial demand"]};
const DRV={
"Cocoa":[[],["West Africa rain and the dry Harmattan winds (Dec to Feb)","Crop disease such as swollen shoot virus","Quarterly grind figures (demand)","Ivory Coast and Ghana set farmgate prices"]],
"Coffee":[["BRL=X"],["Brazil frost (Jun to Aug) and flowering rain (Sep to Oct)","Vietnam robusta crop","ICE certified stocks"]],
"Wheat":[["DX-Y.NYB","BZ=F"],["Black Sea war and the export corridor","Russia's export quotas and taxes","Northern hemisphere crop weather"]],
"Palm oil":[["MYR=X","ZL=F","BZ=F"],["Rain affects yields 6 to 12 months later","Indonesia's export rules and biodiesel mandate","Malaysian export and stock data (monthly)"]],
"Copper":[["000001.SS","CNY=X","DX-Y.NYB"],["China property, grid and EV demand","Mine strikes and disruptions in Chile and Peru","LME and Shanghai warehouse stocks"]],
"Sugar":[["BRL=X","INR=X","BZ=F"],["Indian monsoon","Brazil's cane crush (UNICA reports, fortnightly)","High oil prices divert Brazilian cane to ethanol","India's export rules"]],
"Corn":[["DX-Y.NYB","BZ=F"],["US Midwest weather in July (pollination)","USDA WASDE reports (monthly)","Ethanol demand, which tracks oil"]],
"Cotton":[["DX-Y.NYB","BZ=F"],["West Texas drought","China's import demand","Polyester competition, which tracks oil"]],
"Crude oil":[["DX-Y.NYB","CL=F"],["OPEC+ output decisions","Hormuz, Red Sea and sanctions risk","US inventories (EIA, Wednesdays)","China demand","Gulf of Mexico hurricanes"]],
"Nat gas":[[],["US temperature: cold winters and hot summers raise demand","Storage report (EIA, Thursdays)","LNG export flows","Gulf hurricanes hitting production or export terminals"]],
"Soybeans":[["BRL=X","CNY=X","DX-Y.NYB"],["Brazil and Argentina weather","China's purchases","US crush and biofuel demand"]],
"Gold":[["^TNX","DX-Y.NYB","^VIX"],["Real (inflation-adjusted) interest rates","Central bank buying","Geopolitical risk and safe-haven demand"]],
"Silver":[["GC=F","^TNX","DX-Y.NYB"],["Solar panel and electronics demand","Mine supply from Mexico and Peru","Moves with gold, but more volatile"]],
"Platinum":[["ZAR=X","DX-Y.NYB"],["South African mine output and power cuts","Car catalyst demand (diesel and hybrid)","Supply from Russia"]],
"Lumber":[["ITB","^TNX","CAD=X"],["US housing starts and mortgage rates","British Columbia wildfires and sawmill closures","US duties on Canadian softwood"]],
"Orange juice":[["BRL=X"],["Florida hurricanes and freezes","Citrus greening disease","Brazil's São Paulo crop (biggest exporter)"]],
"Rubber":[["BZ=F","000001.SS"],["Thai monsoon: heavy rain stops tapping","China car and tyre demand","Oil prices set the cost of synthetic rubber"]],
"Rice":[["INR=X"],["Indian monsoon","India's export bans and duties","Asian import demand"]],
"Lithium":[["LIT","CNY=X","000001.SS"],["EV sales, especially in China","New supply from Australia, Chile, Argentina and Africa","Chinese battery maker stockpiling"]],
"Iron ore":[["000001.SS","CNY=X","HG=F"],["China steel output and property activity","Supply from Australia and Brazil","Pilbara cyclone season (Nov to Apr)"]]};
let PX={};
function drv(r){const d=DRV[r.n];if(!d)return"";let s='<div class="kh">Drivers to watch</div>';
d[0].forEach(k=>{const m=MAC[k],q=PX[k];s+=`<div class="row"><span>${m[0]}<small class="dn2">${m[2]}</small></span><b>${q?f(q.price,m[1])+` <i class="${q.price>=q.prev?"up":"dn"}">${q.price>=q.prev?"▲":"▼"}${f(Math.abs((q.price/q.prev-1)*100))}%</i>`:"—"}</b></div>`});
return s+'<ul class="dl">'+d[1].map(x=>"<li>"+x+"</li>").join("")+"</ul>"}
const MO="JFMAMJJASOND",MN=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CAL={
"Cocoa":[[[12,1,2,3],"Main crop harvest in the Harmattan dry season; dryness hurts next crop",2],[[4,5,6,7],"Main rainy season: mid-crop harvest, pods set for main crop",2],[[8],"Short dry spell",1],[[9,10,11],"Short rains; main crop harvest starts in October",2]],
"Coffee":[[[12,1,2,3],"Bean filling: needs steady rain",2],[[4,5],"Ripening; harvest starts in May",1],[[6,7,8],"Harvest; frost risk in the coffee belt",2],[[9,10,11],"Flowering after the first rains: critical",2]],
"Wheat":[[[9,10],"Winter wheat sowing: needs soil moisture",2],[[11,12,1,2],"Winter dormancy; frost-kill risk without snow cover",1],[[3,4],"Spring regrowth",1],[[5,6],"Flowering and grain fill: critical",2],[[7,8],"Harvest; rain hurts quality",1]],
"Palm oil":[[[1,2,3,4],"Seasonally low output",1],[[5,6,7],"Output rising",1],[[8,9,10,11],"Peak output season",1],[[12],"Output easing; monsoon rain can slow harvesting",1]],
"Sugar":[[[1,2,3,4],"Crushing season; new planting",1],[[5],"Hot, dry pre-monsoon",1],[[6,7,8,9],"Monsoon: drives cane growth, critical",2],[[10,11,12],"Crushing season begins",1]],
"Corn":[[[12,1,2,3],"Off-season",0],[[4,5],"Planting: wet fields cause delays",1],[[6],"Vegetative growth",1],[[7],"Pollination: most critical month",2],[[8],"Grain fill: needs rain",2],[[9,10,11],"Harvest",1]],
"Cotton":[[[12,1,2,3,4],"Off-season",0],[[5,6],"Planting: needs soil moisture",2],[[7,8],"Flowering and boll set: needs rain",2],[[9,10,11],"Harvest; rain hurts fibre quality",1]],
"Soybeans":[[[5,6,7,8],"Dry season, off-season",0],[[9,10,11],"Planting with the first rains: critical",2],[[12,1],"Flowering and pod fill: critical",2],[[2,3,4],"Harvest; heavy rain delays it",1]],
"Orange juice":[[[12,1,2],"Harvest; freeze risk",2],[[3,4,5],"Bloom and Valencia harvest",1],[[6,7],"Hurricane season starts",1],[[8,9,10],"Hurricane season peak",2],[[11],"Harvest begins",1]],
"Rubber":[[[2,3,4],"Wintering: leaf fall, low output",1],[[5,6,7,8,9],"Main tapping season",1],[[10,11,12],"Monsoon: heavy rain stops tapping",2],[[1],"Tapping; output easing",1]],
"Rice":[[[12,1,2,3,4,5],"Off-season (wheat grown instead)",0],[[6,7],"Transplanting with the monsoon: critical",2],[[8,9],"Growth and flowering: needs rain",2],[[10,11],"Harvest",1]],
"Lumber":[[[12,1,2],"Winter logging",0],[[3,4,5],"Spring thaw slows logging",1],[[6],"Fire season starts",1],[[7,8,9],"Wildfire peak: dry heat risk",2],[[10,11],"Autumn logging",0]]};
function stg(r){const c=CAL[r.n];if(!c)return null;const m=new Date().getMonth()+1;return c.find(s=>s[0].includes(m))}
function cal(r){const c=CAL[r.n];if(!c)return"";const m=new Date().getMonth()+1,s=stg(r);
let cells="";for(let i=1;i<=12;i++){const q=c.find(x=>x[0].includes(i));cells+=`<span class="cm s${q?q[2]:0}${i==m?" now":""}">${MO[i-1]}</span>`}
const rng=a=>a.length==1?MN[a[0]-1]:MN[a[0]-1]+"–"+MN[a[a.length-1]-1];
return `<div class="kh">Crop calendar</div><div class="row"><span>Stage now</span><b class="wrap">${s?s[1]:"—"}</b></div><div class="cal">${cells}</div><div class="cl"><i class="s0"></i>little impact<i class="s1"></i>moderate<i class="s2"></i>weather critical</div><ul class="dl">${c.map(x=>`<li><b>${rng(x[0])}</b> · ${x[1]}</li>`).join("")}</ul>`}
function sig(r){const s=sig0(r),t=stg(r);if(!t||r.nw||!r.w)return s;
if(t[2]==0)return["","Off-season, so weather matters little now"+(s[0]?" ("+s[1].split(":")[0].toLowerCase()+")":"")];
if(!s[0])return s;return t[2]==2?[s[0],s[1]+" · at a critical stage"]:[s[0],s[1]+" · moderate impact at this stage"]}
function sig0(r){const w=r.w;if(!w)return["","No weather data"];if(r.n=="Nat gas"){if(w.tn==null)return["","No temperature data"];if(r.ct==null)return["","Temperature normal not loaded yet"];const d=w.tn-r.ct,mo=new Date().getMonth()+1,win=mo>=10||mo<=3,sum=mo>=5&&mo<=9;if(Math.abs(d)<2.5)return["","Temperature close to normal"];if(d<0)return win?["cold","Colder than normal: heating demand up"]:["","Cooler than normal: little effect off-season"];return sum?["hot","Hotter than normal: cooling demand up"]:win?["","Milder than normal: heating demand down"]:["","Warmer than normal: little effect off-season"]}
if(r.nw)return["","Weather is a weak driver: see drivers below"];const n=r.cn;
if(n==null)return w.past>=60?["wet","Wet: heavy rain over last 7 days"]:(w.past<=5&&w.next<=5)?["dry","Dry: little rain past and next 7 days"]:["","Rainfall unremarkable (no seasonal data yet)"];
const d=w.past-n,pc=n>=5?Math.round(d/n*100):null;
if(w.past>n*1.5&&d>15)return["wet","Wet: "+(pc!=null?"+"+pc+"% vs normal":"well above normal")];
if(w.past<n*.5&&-d>15)return["dry","Dry: "+(pc!=null?pc+"% vs normal":"well below normal")];
return["","Close to normal for the season"]}
function show(i){const r=R[i],w=r.w,flag=sig(r)[1];
info(`<h2>${r.n} · ${r.loc}</h2>
<div class="row"><span>Price ${r.live?"(delayed)":"(SAMPLE)"}</span><b>${f(r.p,r.p<20?2:0)} ${r.u}</b></div>${r.gl?'<div class="note">⚠ The feed jumped more than 25% from the previous close, which usually means a contract roll or a data error. Treat this price with caution.</div>':""}${nwHTML(r.n,3)}${evFor(r)}${chartHTML(r)}${cvHTML(r.sym)}${r.sym?snHTML(r.sym):""}${cotHTML(r)}
${r.nw?"":`<div class="row"><span>Rain, last 7 days</span><b>${w?f(w.past)+" mm":"—"}${r.cn!=null?" (normal "+f(r.cn)+")":""}</b></div>
<div class="row"><span>Rain, next 7 days</span><b>${w?f(w.next)+" mm":"—"}${r.cx!=null?" (normal "+f(r.cx)+")":""}</b></div>
`}${r.nw&&r.n!="Nat gas"?"":`<div class="row"><span>Temp, next 7 days avg</span><b>${w&&w.tn!=null?f(w.tn)+"°C":"—"}${r.ct!=null?" (normal "+f(r.ct)+")":""}</b></div>
<div class="row"><span>Now</span><b>${w?f(w.t)+"°C · cloud "+f(w.cl,0)+"%":"—"}</b></div>
`}${r.st?`<div class="row" style="cursor:pointer" onclick="showStorm(STM[${r.st.si}])"><span>🌀 Storm nearby</span><b class="wrap">${r.st.n} (${r.st.c}), ~${Math.round(r.st.d/50)*50} km from its path ›</b></div>`:""}<div class="row"><span>Signal</span><b class="wrap">${flag}</b></div>${typeof enNote=="function"?enNote(r):""}${cal(r)}
${drv(r)}<div class="note">These are leading indicators, not guarantees: markets already price in forecasts.</div>`);setTimeout(()=>{drawChart(r);drawCot(r);cvDraw(r.sym);if(r.sym)snDraw(r.sym)},0)}
R.forEach((r,i)=>paint(i));
let wOK=false,pOK=0;
async function weather(){try{const q=k=>R.map(r=>r[k]).join(",");
const j=await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${q("lat")}&longitude=${q("lon")}&current=temperature_2m,cloud_cover&daily=precipitation_sum,temperature_2m_mean&past_days=7&forecast_days=7&timezone=auto`)).json();
const a=Array.isArray(j)?j:[j];a.forEach((d,i)=>{const s=d.daily.precipitation_sum,sum=x=>x.reduce((m,v)=>m+(v||0),0);
const tt=(d.daily.temperature_2m_mean||[]).slice(7,14).filter(v=>v!=null);R[i].w={tn:tt.length?tt.reduce((a,b)=>a+b,0)/tt.length:null,past:sum(s.slice(0,7)),next:sum(s.slice(7,14)),t:d.current.temperature_2m,cl:d.current.cloud_cover};paint(i)});wOK=true}catch(e){try{for(const u of rawUrls("data","pins.json")){const r=await fetch(u);if(!r.ok)continue;const P=await r.json(),A=Array.isArray(P.data)?P.data:[P.data];
R.forEach((r,i)=>{const k=P.names.indexOf(r.n);const d=A[k];if(!d)return;const s=d.daily.precipitation_sum,sum=x=>x.reduce((m,v)=>m+(v||0),0),tt=(d.daily.temperature_2m_mean||[]).slice(7,14).filter(v=>v!=null);
r.w={tn:tt.length?tt.reduce((a,b)=>a+b,0)/tt.length:null,past:sum(s.slice(0,7)),next:sum(s.slice(7,14)),t:d.current.temperature_2m,cl:d.current.cloud_cover};paint(i)});wOK="gh";break}}catch(e2){}}}
let pT=0;
async function prices(){try{const j=await(await fetch("prices.json?t="+Date.now())).json();pT=j.updated;PX=j.prices;R.forEach((r,i)=>{const m=r.sym&&j.prices[r.sym];if(!m)return;r.p=m.price;r.ch=(m.price/m.prev-1)*100;r.live=1;r.gl=Math.abs(r.ch)>25;if(r.gl)r.ch=null;pOK++;paint(i)})}catch(e){}}
async function climate(){try{const j=await(await fetch("climate.json?t="+Date.now())).json();R.forEach(r=>{const c=j.regions[r.n];if(c){r.cn=c.past;r.cx=c.next;r.ct=c.tnext}})}catch(e){}}
Promise.all([weather(),prices(),climate()]).then(()=>{R.forEach((r,i)=>paint(i));layout();$("#st").innerHTML=`Weather: ${wOK=="gh"?"via GitHub (6-hourly)":wOK?"live":"unavailable here"}<br>Prices: ${pOK?"delayed, "+new Date(pT*1000).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Europe/London"})+" UK":"sample values"}`});
let BW=1800;const WIDE=()=>innerWidth>=1000;
function fit(){BW=Math.round(Math.max(innerWidth,innerHeight*2))}
fit();let z=1;map.style.width=BW*z+"px";
const MSC=$("#scroll");let heavyT;
function setZoom(nz,cx,cy,quick){const zmin=Math.min(1,innerWidth/BW);nz=Math.min(5,Math.max(zmin,nz));if(cx==null){cx=MSC.clientWidth/2;cy=MSC.clientHeight/2}
const W0=map.offsetWidth,H0=map.offsetHeight,wx=(MSC.scrollLeft+cx)/W0,wy=(MSC.scrollTop+cy)/H0;z=nz;map.style.width=BW*z+"px";
const W1=map.offsetWidth,H1=map.offsetHeight;MSC.scrollLeft=wx*W1-cx;MSC.scrollTop=wy*H1-cy;map.classList.toggle("big",W1>=Math.max(2000,innerWidth*1.25));map.classList.toggle("zm",W1>=Math.max(2600,innerWidth*1.4));
clearTimeout(heavyT);if(quick)heavyT=setTimeout(()=>{layout();wxResize();coastLOD()},160);else{layout();wxResize();coastLOD()}}
let C50=null,C50p=null,cLvl=0;
function coastLOD(){const want=map.offsetWidth>=2200?1:0;if(want==cLvl)return;
const apply=(L,B)=>{map.querySelectorAll("path.land,path.cst").forEach(p=>p.setAttribute("d",L));map.querySelectorAll("path.bd").forEach(p=>p.setAttribute("d",B))};
if(!want){cLvl=0;apply(LAND,BORD);return}
if(C50){cLvl=1;apply(C50.land,C50.borders);return}
if(!C50p)C50p=fetch("coast50.json").then(r=>r.ok?r.json():null).then(j=>{C50=j;C50p=null;coastLOD()}).catch(()=>{C50p=null})}
const zz=d=>setZoom(d==0?z:z*(d>0?1.5:1/1.5));
$("#zi").onclick=()=>zz(1);$("#zo").onclick=()=>zz(-1);
MSC.addEventListener("wheel",e=>{e.preventDefault();const r=MSC.getBoundingClientRect();setZoom(z*Math.exp(-e.deltaY*(e.ctrlKey?.01:.0018)),e.clientX-r.left,e.clientY-r.top,1)},{passive:false});
MSC.addEventListener("dblclick",e=>{if(e.target.closest(".pin,.mk,.hit,.enr"))return;const r=MSC.getBoundingClientRect();setZoom(z*1.8,e.clientX-r.left,e.clientY-r.top)});
let dg=null,suppress=false;
MSC.addEventListener("pointerdown",e=>{if(e.pointerType!="mouse"||e.button!==0)return;dg={x:e.clientX,y:e.clientY,l:MSC.scrollLeft,t:MSC.scrollTop,m:false}});
addEventListener("pointermove",e=>{if(!dg)return;const dx=e.clientX-dg.x,dy=e.clientY-dg.y;if(!dg.m&&Math.hypot(dx,dy)>4){dg.m=true;MSC.classList.add("dragging")}if(dg.m){MSC.scrollLeft=dg.l-dx;MSC.scrollTop=dg.t-dy}});
addEventListener("pointerup",()=>{if(dg&&dg.m){suppress=true;setTimeout(()=>suppress=false,0)}dg=null;MSC.classList.remove("dragging")});
MSC.addEventListener("click",e=>{if(suppress){e.stopPropagation();e.preventDefault()}},true);
let pin2=null;
MSC.addEventListener("touchstart",e=>{if(e.touches.length==2){const[a,b]=e.touches,r=MSC.getBoundingClientRect();pin2={d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),z0:z,cx:(a.clientX+b.clientX)/2-r.left,cy:(a.clientY+b.clientY)/2-r.top}}},{passive:true});
MSC.addEventListener("touchmove",e=>{if(pin2&&e.touches.length==2){e.preventDefault();const[a,b]=e.touches;setZoom(pin2.z0*Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/pin2.d,pin2.cx,pin2.cy,1)}},{passive:false});
MSC.addEventListener("touchend",e=>{if(e.touches.length<2)pin2=null},{passive:true});
map.classList.toggle("big",map.offsetWidth>=Math.max(2000,innerWidth*1.25));MSC.scrollLeft=(WIDE()?190:200)/360*map.offsetWidth-innerWidth/2;MSC.scrollTop=(90-18)/180*map.offsetHeight-innerHeight/2;
/* ---- chrome behaviour ---- */
(()=>{const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const body=document.body,lyr=$("#lyr"),lyb=$("#lyb"),pb=$("#pinb"),cb=$("#calb"),thb=$("#thb");
let pinned=ls("cm_pin")!=="0",idle;
const awake=()=>{body.classList.add("awake");clearTimeout(idle);idle=setTimeout(()=>{if(!document.querySelector("#dock:hover,#top:hover,#calside:hover")&&!lyr.classList.contains("open"))body.classList.remove("awake")},2600)};
const applyPin=()=>{body.classList.toggle("unpinned",!pinned);pb.setAttribute("aria-pressed",pinned);pb.title=pinned?"Hide controls when idle":"Keep controls visible";if(!pinned)awake()};
pb.onclick=()=>{pinned=!pinned;ls("cm_pin",pinned?"1":"0");applyPin()};applyPin();
addEventListener("pointermove",e=>{if(!pinned&&e.pointerType=="mouse"&&(e.clientY>innerHeight-130||e.clientY<80||(WIDE()&&body.classList.contains("calopen")&&e.clientX>innerWidth-350)))awake()});
$("#hdl").onclick=awake;MSC.addEventListener("scroll",()=>{if(!pinned&&body.classList.contains("awake"))awake()},{passive:true});
const setL=o=>{lyr.classList.toggle("open",o);lyb.setAttribute("aria-expanded",o);lyb.classList.toggle("on",o)};
lyb.onclick=e=>{e.stopPropagation();setL(!lyr.classList.contains("open"))};
document.addEventListener("pointerdown",e=>{if(lyr.classList.contains("open")&&!e.target.closest("#lyr,#lyb"))setL(false)});
addEventListener("keydown",e=>{if(e.key=="Escape"){setL(false);const p=$("#panel");if(p.classList.contains("open"))$("#px").click()}
if(e.target.closest("input,textarea"))return;if(e.key=="l"||e.key=="L")setL(!lyr.classList.contains("open"));if(e.key=="+"||e.key=="=")zz(1);if(e.key=="-")zz(-1)});
const setC=o=>{body.classList.toggle("calopen",o);cb.setAttribute("aria-pressed",o);ls("cm_cal",o?"1":"0")};
cb.onclick=()=>{if(!WIDE()){openCal();return}setC(!body.classList.contains("calopen"))};setC(ls("cm_cal")=="1");
const th=()=>document.documentElement.dataset.theme=="light";const thl=()=>{thb.textContent=th()?"Dark mode":"Light mode";document.querySelector('meta[name="theme-color"]').content=th()?"#e9eef1":"#070f15"};
thb.onclick=()=>{const t=th()?"dark":"light";document.documentElement.dataset.theme=t;ls("cm_theme",t);thl();drawWx()};thl();
const clk=$("#clk"),tick=()=>{clk.textContent=new Date().toLocaleTimeString("en-GB",{timeZone:"Europe/London",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false})+" UK"};tick();setInterval(tick,1000);
const wt=$("#wxt");wt.style.setProperty("--pc",(+wt.value)/(+wt.max||1)*100+"%");segs()})();
let rsT;addEventListener("resize",()=>{clearTimeout(rsT);rsT=setTimeout(()=>{fit();zz(0)},200)});
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
