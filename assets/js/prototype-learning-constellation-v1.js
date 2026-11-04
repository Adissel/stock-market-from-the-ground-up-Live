import {mountConstellationGalaxy} from './prototype-constellation-galaxy-v2.js';
/* Owner-only Learning Constellation. Read-only public source metadata.
   Never loads grades, secrets, member progress, market feeds or order APIs. */
const STAGES=['Start','Learn','Experiment','Predict','Practice','Assess','Review','Transfer','Results'];
const STAGE_EXPLAIN=[
 'Define the scope and evidence needed before interpreting price.',
 'Learn the concept, calculation, examples and limitations.',
 'Reveal completed fictional observations one bar at a time. No lookahead.',
 'Record a falsifiable expectation before examining later evidence.',
 'Rehearse the process with free guided explanations.',
 'Protected assessment remains in the existing authenticated engine.',
 'Review the reasoning and preserve first graded attempts.',
 'Transfer understanding to a distinct scenario or timeframe.',
 'Evaluate documented learning progress, not trading profitability.'
];
const PROGRAMS=[
 ['truth5','The Truth Behind the Ticker',5],['watchlist7','Build Your Own Stock Watchlist',7],
 ['scanners10','Mastering Stock Scanners',10],['foundations30','The Complete Trading Foundations Boot Camp',30],
 ['charts45','Chart Reading and Trading Setups',45],['risk60','Risk, Execution, and Trading Discipline',60],
 ['practicum90','Advanced Simulated Trading Practicum',90],['tape10','Reading the Tape & Market Microstructure',10],
 ['indicators10','VWAP, EMA & Technical Indicator Mastery',10],['filings7','SEC Filings, Catalysts & Corporate Actions',7]
];
const modes={journey:'Learning Journey',labs:'Lab Network',academy:'Boot Camp Atlas',tutor:'Indicator Intelligence'};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const pretty=x=>String(x).replace(/_/g,' ').toLowerCase().replace(/\b[a-z]/g,c=>c.toUpperCase());

export function mountLearningConstellation(host,options={}){
 const publicPreview=options.publicPreview===true;
 if(!host)throw Error('Learning Constellation host required');
 const root=document.createElement('section');root.className='lc-app';
 root.innerHTML='<div class="lc-head"><div><span class="lc-eyebrow">CROWNLIGHT · VOLUMETRIC LEARNING GALAXY / PROTOTYPE V4</span>'+
 '<h1>THE LEARNING <em>CONSTELLATION</em></h1><p>Explore the full nine-stage learning journey, source-linked 419 Labs, ten Boot Camp paths and Talia teaching guides. The public homepage presents a limited educational showcase; this dimensional map stays protected.</p></div>'+
 '<div class="lc-head-side"><strong class="lc-live"><i></i>INTERACTIVE / OWNER PREVIEW</strong>'+
 '<a href="/prototype.html?view=classic">Open Classic Builder</a><a href="/prototype.html?experience=a&layout=foundations">Inspect animated classroom</a><a href="/index.html#learning-constellation">Review public teaching-style showcase</a></div></div>'+
 '<div class="lc-metrics"><div><strong data-lc="labs-num">419</strong><span>CANONICAL LABS</span></div>'+
 '<div><strong>10</strong><span>BOOT CAMP PATHS</span></div><div><strong>9</strong><span>LEARNING STAGES</span></div>'+
 '<div><strong data-lc="tutor-num">73</strong><span>INDICATOR GUIDES</span></div></div>'+
 '<nav class="lc-tabs" aria-label="Visual learning views">'+
 '<button type="button" data-mode="journey">01 <span>LEARNING JOURNEY</span></button>'+
 '<button type="button" data-mode="labs">02 <span>LAB NETWORK</span></button>'+
 '<button type="button" data-mode="academy">03 <span>BOOT CAMP ATLAS</span></button>'+
 '<button type="button" data-mode="tutor">04 <span>INDICATOR INTELLIGENCE</span></button></nav>'+
 '<div class="lc-layout">'+
 '<aside class="lc-explorer"><span class="lc-eyebrow">CURRICULUM EXPLORER</span><h2 data-lc="aside-title">Learning Journey</h2>'+
 '<label for="lc-node-search">Find a concept</label><input type="search" id="lc-node-search" placeholder="VWAP, candle, risk…" autocomplete="off"/>'+
 '<p data-lc="status" role="status" aria-live="polite">Loading the original curriculum index…</p>'+
 '<div class="lc-item-list" data-lc="list"></div>'+
 '<div class="lc-guard"><b>FICTIONAL / INSTRUCTIONAL</b><p>No member records, protected answers or brokerage trades.</p></div></aside>'+
 '<section class="lc-center"><div class="lc-map-head"><div><strong data-lc="map-title">One system. Nine stages.</strong>'+
 '<span>Spatial curriculum exploration · source-linked nodes · full keyboard and 2D fallback.</span></div>'+
 '<div class="lc-map-tools"><button data-lc="minus" type="button" aria-label="Zoom out">−</button>'+
 '<span data-lc="scale">100%</span><button data-lc="plus" type="button" aria-label="Zoom in">+</button>'+
 '<button data-lc="orbit-left" type="button" aria-label="Orbit left">↶</button>'+'<button data-lc="orbit-right" type="button" aria-label="Orbit right">↷</button>'+'<button data-lc="pitch-up" type="button" aria-label="Tilt map upward">↑</button>'+'<button data-lc="pitch-down" type="button" aria-label="Tilt map downward">↓</button>'+'<label class="lc-depth-label" for="lc-depth">Depth <input id="lc-depth" data-lc="depth" type="range" min="0" max="100" value="68" aria-label="3D depth intensity"></label>'+'<button data-lc="focus" type="button">Focus node</button>'+'<button data-lc="stars-toggle" type="button" aria-pressed="true" aria-label="Toggle dimensional starfield">Stars on</button>'+'<button data-lc="interaction" type="button" aria-pressed="true">Orbit drag</button>'+'<button data-lc="flatten" type="button" aria-pressed="false">2D view</button>'+'<button data-lc="reset" type="button">Reset</button></div></div>'+
 '<div class="lc-canvas" data-lc="canvas" tabindex="0" role="group" aria-label="Interactive perspective 3D curriculum map. Arrow keys orbit, plus or minus zoom. A 2D view is available.">'+
 '<canvas class="lc-galaxy-layer" data-lc="galaxy" aria-hidden="true"></canvas>'+'<div class="lc-stars" aria-hidden="true"></div><div class="lc-world" data-lc="world">'+
 '<svg viewBox="0 0 1000 650" class="lc-edges" aria-hidden="true"></svg>'+
 '<div class="lc-points" data-lc="points"></div></div>'+
 '<span class="lc-map-tip">DRAG NODES TO REARRANGE · ORBIT / PAN BACKGROUND · ARROW KEYS TO ROTATE · FLAT VIEW AVAILABLE</span></div>'+
 '<footer class="lc-legend"><span>◈ LEARNING</span><span>◈ LABS</span><span>◈ BOOT CAMPS</span>'+
 '<span>◈ TALIA</span><span>EDUCATIONAL · NO MARKET SIGNALS</span></footer></section>'+
 '<aside class="lc-detail"><div class="lc-talia"><span class="lc-avatar">T</span><div>'+
 '<span class="lc-eyebrow">TALIA MERCER / MARKET TUTOR</span><strong>Explore the evidence.</strong></div></div>'+
 '<span class="lc-eyebrow" data-lc="kind">SYSTEM MAP</span><h2 data-lc="title">Shared Learning Engine</h2>'+
 '<p class="lc-meta" data-lc="meta"></p><div class="lc-explain"><span class="lc-eyebrow">UNDERSTAND THE CONNECTION</span>'+
 '<p data-lc="detail"></p></div><div class="lc-facts"><span class="lc-eyebrow">SOURCE EVIDENCE</span>'+
 '<ul data-lc="evidence"></ul></div><footer><b>EXPLAIN / TEACH IS ALWAYS FREE</b>'+
 '<p>Uses real curriculum indexes; no key exposure or future candle data.</p></footer></aside></div>';
 // Public homepage reuses the exact dimensional map and its data-only nodes.
 // Staff-only Prototype navigation remains inaccessible from this presentation.
 if(publicPreview){
  root.classList.add('lc-app--public');
  root.querySelector('.lc-head .lc-eyebrow').textContent='CROWNLIGHT · INTERACTIVE LEARNING CONSTELLATION';
  root.querySelector('.lc-head p').textContent='Explore the nine learning stages, the 419-Lab network, ten Boot Camp paths and Talia\'s source-based indicator guides. Select a node to explore the teaching evidence.';
  const heading=root.querySelector('.lc-head h1');
  const levelTwo=document.createElement('h2');levelTwo.innerHTML=heading.innerHTML;heading.replaceWith(levelTwo);
  const side=root.querySelector('.lc-head-side');side.replaceChildren();
  const label=document.createElement('strong');label.className='lc-live';
  label.textContent='INTERACTIVE · EDUCATIONAL';side.append(label);
 }
 host.replaceChildren(root);
 const q=n=>root.querySelector('[data-lc="'+n+'"]');
 const canvas=q('canvas'),world=q('world'),points=q('points'),svg=root.querySelector('.lc-edges'),galaxyCanvas=q('galaxy');
 const source={labs:null,guides:[]};
 const state={mode:'journey',selected:'hub',items:[],edges:[],positions:new Map(),zoom:1,x:0,y:0,drag:null,yaw:.27,pitch:.16,depth:.68,flat:false,interaction:'orbit'};
 const abort=new AbortController();let closed=false;
 const galaxy=mountConstellationGalaxy(galaxyCanvas,()=>state);
 const node=(id,title,meta,x,y,kind,description,evidence)=>({id,title,meta,x,y,kind,description,evidence});
 function makeModel(){
  const items=[],edges=[];
  if(state.mode==='journey'){
   items.push(node('hub','LEARNING ENGINE','v3.3 / SHARED',500,310,'hub',
    'Nine stages in one approved learning engine; this is a navigable map, not a replacement engine.',
    ['Shared Learning Engine v3.3','Shared Lab Engine v3.2','Original member progress stays untouched']));
   STAGES.forEach((name,i)=>{
    const a=i*2*Math.PI/STAGES.length-Math.PI/2;
    items.push(node('stage'+i,name,'STAGE '+String(i+1).padStart(2,'0'),
      500+355*Math.cos(a),310+223*Math.sin(a),'journey',STAGE_EXPLAIN[i],
      ['Original nine-stage flow','Protected assessments stay server-side']));
    edges.push(['hub','stage'+i]);
   });
  }else if(state.mode==='labs'){
   items.push(node('hub','419 LABS','UNIQUE SOURCE IDS',500,310,'hub',
    'The real 419-Lab source index groups original educational Labs by 30 official competencies. Editorial links are not graded evidence.',
    ['419 unique canonical Labs','Five teaching facets per Lab','No private grades or answer keys']));
   const skills=['CANDLE_READING','VWAP_CONTEXT','EMA_CONTEXT','VOLUME_ANALYSIS','CHART_STRUCTURE',
    'MULTI_TIMEFRAME','BREAKOUT_RECOGNITION','FAILED_BREAKOUT','PULLBACK_RECOGNITION',
    'HOD_PM_LEVELS','RISK_PER_SHARE','POSITION_SIZING'];
   skills.forEach((skill,i)=>{
    const a=i*2*Math.PI/skills.length-Math.PI/2,ids=source.labs?.bySkill?.[skill]||[];
    const details=ids.slice(0,8).map(id=>id+(source.labs?.byLab?.[id]?.title?' · '+source.labs.byLab[id].title:''));
    items.push(node('skill'+skill,pretty(skill),ids.length+' LINKED LABS',
      500+370*Math.cos(a),310+235*Math.sin(a),'labs',
      'Real instructional topic mapping for '+pretty(skill)+'. Access the approved Lab player to teach the actual content.',
      details.length?details:['Curriculum data is loading or temporarily unavailable']));
    edges.push(['hub','skill'+skill]);
   });
  }else if(state.mode==='academy'){
   items.push(node('hub','BOOT CAMP ATLAS','10 PATHS / 274 DAYS',500,310,'hub',
     'Ten source-defined study paths use the existing Academy and shared Lab Engine. Three additional paths are controlled invitation-beta instruction.',
     ['247 original day positions','27 new draft beta positions','Graded awards are separately gated']));
   PROGRAMS.forEach(([id,title,days],i)=>{
    const a=i*2*Math.PI/PROGRAMS.length-Math.PI/2;
    items.push(node('camp'+id,title,days+' LEARNING DAYS',500+370*Math.cos(a),310+235*Math.sin(a),
      'academy','Authored '+days+'-day curriculum path. Enrollment, progress and available lessons remain controlled by the existing Academy services.',
      ['Source program: '+id,'Original progress preservation','No automatic graded mastery']));
    edges.push(['hub','camp'+id]);
   });
  }else{
   items.push(node('hub','TALIA INTELLIGENCE','73 GUIDES / SOURCE',500,310,'hub',
     'Instructional guides explain mathematics, evidence and limits. Not every guide is a calculated Chart Studio overlay.',
     ['61 established + 12 expanded guides','16 computed prototype study choices','No automated trade signals']));
   let guideList=source.guides;
   const preferred=['SMA','EMA','VWAP','RSI','MACD','ATR','BOLLINGER','VOLUME','STOCH','OBV','FIBONACCI','ICHIMOKU'];
   const selected=[];
   preferred.forEach(term=>{const g=guideList.find(v=>!selected.includes(v)&&
     String(v.title+' '+v.code).toUpperCase().includes(term));if(g)selected.push(g)});
   if(!selected.length)selected.push(...preferred.map(s=>({code:s,title:s,concept:'Authored teaching source is loading.'})));
   selected.slice(0,12).forEach((g,i)=>{
    const a=i*2*Math.PI/Math.min(selected.length,12)-Math.PI/2;
    items.push(node('guide'+g.code,g.title,'TALIA GUIDE',500+370*Math.cos(a),310+235*Math.sin(a),'tutor',
      g.concept||g.whyUse||'Source-backed educational indicator interpretation.',
      [g.formula?'Formula: '+g.formula:'',g.limits?'Limits: '+g.limits:''].filter(Boolean)));
    edges.push(['hub','guide'+g.code]);
   });
  }
  return{items,edges};
 }
 function getPos(n){return state.positions.get(n.id)||{x:n.x,y:n.y};}
 // Project the curriculum graph into an actual x/y/z camera coordinate system.
 // DOM buttons stay keyboard accessible and the SVG edges use identical projection.
 // Rendering is lightweight and local: no new paid 3D runtime or feed.
 function projectXYZ(x,y,z){
  const yaw=state.flat?0:state.yaw,pitch=state.flat?0:state.pitch;
  const dx=x-500,dy=y-310;
  const rx=dx*Math.cos(yaw)+z*Math.sin(yaw),rz=-dx*Math.sin(yaw)+z*Math.cos(yaw);
  const ry=dy*Math.cos(pitch)-rz*Math.sin(pitch),depth=dy*Math.sin(pitch)+rz*Math.cos(pitch);
  const scale=state.flat?1:clamp(860/(860-depth),.67,1.43);
  return {x:500+rx*scale,y:310+ry*scale,scale,depth};
 }
 function project(n){
  const p=getPos(n),i=state.items.indexOf(n);
  const z=state.flat?0:(n.kind==='hub'?115:Math.sin((i+1)*2.399963229728653)*170)*state.depth;
  return projectXYZ(p.x,p.y,z);
 }
 function drawEdges(){
  svg.replaceChildren();
  if(!state.flat){
   for(const [rx,ry,z] of [[405,260,-70],[300,195,25],[185,120,85]]){
    const path=document.createElementNS('http://www.w3.org/2000/svg','path'),segments=[];
    for(let i=0;i<=72;i++){
     const a=i*Math.PI/36,p=projectXYZ(500+rx*Math.cos(a),310+ry*Math.sin(a),z*state.depth);
     segments.push((i?'L':'M')+p.x.toFixed(2)+' '+p.y.toFixed(2));
    }
    path.setAttribute('d',segments.join(' ')+' Z');path.setAttribute('class','lc-orbit-ring');svg.append(path);
   }
  }
  const map=new Map(state.items.map(n=>[n.id,n]));
  state.edges.forEach(([u,v])=>{
   const a=map.get(u),b=map.get(v);if(!a||!b)return;
   const p=project(a),r=project(b);
   const line=document.createElementNS('http://www.w3.org/2000/svg','line');
   for(const [key,value] of Object.entries({x1:p.x,y1:p.y,x2:r.x,y2:r.y}))line.setAttribute(key,value);
   line.setAttribute('class','lc-edge'+(state.selected===u||state.selected===v?' is-on':''));
   line.style.opacity=String(clamp(.42+(p.scale+r.scale-2)*.38,.25,1));svg.append(line);
  });
  points.querySelectorAll('.lc-point').forEach(btn=>{
   const n=map.get(btn.dataset.nodeId);if(!n)return;
   const p=project(n);
   btn.style.left=p.x+'px';btn.style.top=p.y+'px';
   btn.style.transform='translate(-50%,-50%) scale('+p.scale.toFixed(3)+')';
   btn.style.zIndex=String(Math.round(50+p.depth/8)+(state.selected===n.id?100:0));
  });
  galaxy.render();
 }

 function choose(id){
  const n=state.items.find(o=>o.id===id);if(!n)return;state.selected=id;
  q('kind').textContent=n.kind.toUpperCase()==='HUB'?'SYSTEM HUB':n.kind.toUpperCase()+' / SOURCE';
  q('title').textContent=n.title;q('meta').textContent=n.meta;q('detail').textContent=n.description;
  const ul=q('evidence');ul.replaceChildren();
  (n.evidence||[]).forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.append(li)});
  root.querySelectorAll('.lc-point,.lc-list-item').forEach(el=>{
    const yes=el.dataset.nodeId===id;el.classList.toggle('is-picked',yes);
    if(el.classList.contains('lc-point'))el.setAttribute('aria-pressed',String(yes));
  });
  drawEdges();
 }
 function renderList(){
  const s=root.querySelector('#lc-node-search').value.trim().toLowerCase();
  const filtered=state.items.filter(n=>(n.title+' '+n.meta).toLowerCase().includes(s));
  const box=q('list');box.replaceChildren();
  filtered.forEach(n=>{
    const b=document.createElement('button');b.type='button';b.className='lc-list-item';
    b.dataset.nodeId=n.id;b.textContent=n.title;
    const small=document.createElement('small');small.textContent=n.meta;b.appendChild(small);
    b.addEventListener('click',()=>choose(n.id));box.append(b);
  });
  q('status').textContent=filtered.length+' visible nodes · '+modes[state.mode];
  root.querySelectorAll('.lc-list-item').forEach(el=>el.classList.toggle('is-picked',el.dataset.nodeId===state.selected));
 }
 function layout(){
  const model=makeModel();state.items=model.items;state.edges=model.edges;state.positions.clear();
  points.replaceChildren();
  state.items.forEach(n=>{
    const b=document.createElement('button');b.type='button';b.className='lc-point lc-point-'+n.kind;
    b.dataset.nodeId=n.id;b.setAttribute('aria-label',n.title+' — '+n.meta);
    b.style.left=n.x+'px';b.style.top=n.y+'px';
    const title=document.createElement('strong');title.textContent=n.title;
    const meta=document.createElement('small');meta.textContent=n.meta;b.append(title,meta);
    // Capture on the actual node: canvas-level capture can otherwise turn
    // a drag into background pan on transformed children.
    b.addEventListener('pointerdown',e=>{
      if(e.button!==0)return;
      state.drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:state.x,y:state.y,yaw:state.yaw,pitch:state.pitch,
        n,btn:b,pos:{...getPos(n)},moved:false};
      e.stopPropagation();try{b.setPointerCapture(e.pointerId)}catch{}
    });
    b.addEventListener('click',()=>{if(b.dataset.dragged==='1'){b.dataset.dragged='0';return}choose(n.id)});
    points.append(b);
  });
  root.querySelectorAll('[data-mode]').forEach(b=>{
    const active=b.dataset.mode===state.mode;b.classList.toggle('is-active',active);
    b.setAttribute('aria-pressed',String(active));
  });
  const titles={journey:'Nine stages. One shared learning engine.',labs:'419 real Labs. Connected by competency.',
    academy:'Ten Boot Camps. One Academy.',tutor:'73 teaching guides. Evidence, not signals.'};
  q('map-title').textContent=titles[state.mode];q('aside-title').textContent=modes[state.mode];
  choose('hub');renderList();
 }
 function transform(){world.style.transform='translate('+state.x+'px,'+state.y+'px) scale('+state.zoom+')';
  q('scale').textContent=Math.round(state.zoom*100)+'%';galaxy.render();}
 function fit(){const w=canvas.clientWidth,h=canvas.clientHeight;if(w<10)return;
  state.zoom=clamp(Math.min((w-20)/1000,(h-20)/650),.35,1.25);
  state.x=(w-1000*state.zoom)/2;state.y=(h-650*state.zoom)/2;transform();}
 function zoom(mult){const old=state.zoom;state.zoom=clamp(old*mult,.34,2.3);
  const x=canvas.clientWidth/2,y=canvas.clientHeight/2;
  state.x=x-(x-state.x)*state.zoom/old;state.y=y-(y-state.y)*state.zoom/old;transform();}
 canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  const btn=e.target.closest('.lc-point'),n=btn&&state.items.find(x=>x.id===btn.dataset.nodeId);
  state.drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:state.x,y:state.y,yaw:state.yaw,pitch:state.pitch,
    n,btn,pos:n?{...getPos(n)}:null,moved:false};
  try{canvas.setPointerCapture(e.pointerId)}catch{}
 });
 canvas.addEventListener('pointermove',e=>{
  const d=state.drag;if(!d||d.id!==e.pointerId)return;
  const dx=e.clientX-d.startX,dy=e.clientY-d.startY;
  if(Math.abs(dx)+Math.abs(dy)>6)d.moved=true;
  if(d.n){const x=clamp(d.pos.x+dx/state.zoom,105,895),y=clamp(d.pos.y+dy/state.zoom,52,598);
   state.positions.set(d.n.id,{x,y});drawEdges();
  }else if(state.interaction==='orbit'&&!state.flat){state.yaw=clamp(d.yaw+dx/310,-1.25,1.25);state.pitch=clamp(d.pitch-dy/310,-.85,.85);drawEdges();}
   else{state.x=d.x+dx;state.y=d.y+dy;transform();}
 });
 const release=e=>{const d=state.drag;if(!d||d.id!==e.pointerId)return;
  // Release capture from the element that owns it; never leave chart motion latched.
  if(e.type==='pointerup'&&d.n){if(d.moved)d.btn.dataset.dragged='1';choose(d.n.id)}
  state.drag=null;
  const owner=d.btn&&d.btn.hasPointerCapture?.(e.pointerId)?d.btn:canvas;
  try{if(owner.hasPointerCapture?.(e.pointerId))owner.releasePointerCapture(e.pointerId)}catch{}
 };
 canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.09:.92)},{passive:false});
 q('plus').addEventListener('click',()=>zoom(1.2));
 q('minus').addEventListener('click',()=>zoom(1/1.2));
 function orbit(dx,dy){
  state.flat=false;state.yaw=clamp(state.yaw+dx,-1.25,1.25);
  state.pitch=clamp(state.pitch+dy,-.85,.85);
  q('flatten').setAttribute('aria-pressed','false');
  q('flatten').textContent='2D view';drawEdges();
 }
 q('focus').addEventListener('click',()=>{
  const n=state.items.find(n=>n.id===state.selected);
  if(!n)return;
  const p=project(n);
  state.x=canvas.clientWidth/2-p.x*state.zoom;
  state.y=canvas.clientHeight/2-p.y*state.zoom;
  transform();
 });
 q('stars-toggle').addEventListener('click',()=>{
  galaxyCanvas.hidden=!galaxyCanvas.hidden;
  q('stars-toggle').textContent=galaxyCanvas.hidden?'Stars off':'Stars on';
  q('stars-toggle').setAttribute('aria-pressed',String(!galaxyCanvas.hidden));
  if(!galaxyCanvas.hidden)galaxy.render();
 });
 q('orbit-left').addEventListener('click',()=>orbit(-.16,0));
 q('orbit-right').addEventListener('click',()=>orbit(.16,0));
 q('pitch-up').addEventListener('click',()=>orbit(0,.12));
 q('pitch-down').addEventListener('click',()=>orbit(0,-.12));
 q('depth').addEventListener('input',e=>{state.depth=Number(e.target.value)/100;drawEdges()});
 q('interaction').addEventListener('click',()=>{
  state.interaction=state.interaction==='orbit'?'pan':'orbit';
  q('interaction').textContent=state.interaction==='orbit'?'Orbit drag':'Pan drag';
  q('interaction').setAttribute('aria-pressed',String(state.interaction==='orbit'));
 });
 q('flatten').addEventListener('click',()=>{
  state.flat=!state.flat;q('flatten').setAttribute('aria-pressed',String(state.flat));
  q('flatten').textContent=state.flat?'3D view':'2D view';drawEdges();
 });
 canvas.addEventListener('keydown',e=>{
  if(e.target!==canvas)return;
  const moves={ArrowLeft:[-.12,0],ArrowRight:[.12,0],ArrowUp:[0,.1],ArrowDown:[0,-.1]};
  if(moves[e.key]){e.preventDefault();orbit(...moves[e.key])}
  else if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.15)}
  else if(e.key==='-'){e.preventDefault();zoom(1/1.15)}
 });
 q('reset').addEventListener('click',()=>{
  state.yaw=.27;state.pitch=.16;state.depth=.68;state.flat=false;state.interaction='orbit';
  q('depth').value='68';q('flatten').textContent='2D view';
  q('flatten').setAttribute('aria-pressed','false');q('interaction').textContent='Orbit drag';
  q('interaction').setAttribute('aria-pressed','true');layout();fit();
 });
 root.querySelector('#lc-node-search').addEventListener('input',renderList);
 root.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{
  state.mode=b.dataset.mode;root.querySelector('#lc-node-search').value='';layout();fit();
 }));
 const observer=new ResizeObserver(fit);observer.observe(canvas);
 layout();requestAnimationFrame(fit);
 async function readIndex(url){const res=await fetch(url,{credentials:'same-origin',cache:'no-store',signal:abort.signal});
  if(!res.ok)throw Error('Source '+res.status);return res.json();}
 Promise.allSettled([readIndex('/data/competency-lab-paths-v01499.json'),
   readIndex('/data/tutor-indicator-study-v1.json'),
   readIndex('/data/tutor-indicator-expansion-v1.json')]).then(([a,b,c])=>{
  if(closed)return;
  if(a.status==='fulfilled'&&a.value.totalCanonicalLabs===419){
    source.labs=a.value;q('labs-num').textContent=String(a.value.totalCanonicalLabs);}
  source.guides=[...(b.status==='fulfilled'?b.value.guides||[]:[]),
    ...(c.status==='fulfilled'?c.value.guides||[]:[])];
  if(source.guides.length)q('tutor-num').textContent=String(source.guides.length);
  layout();fit();
 }).catch(()=>{});
 return()=>{closed=true;abort.abort();observer.disconnect();galaxy.dispose();root.remove()};
}
