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

export function mountLearningConstellation(host){
 if(!host)throw Error('Owner/Admin prototype host required');
 const root=document.createElement('section');root.className='lc-app';
 root.innerHTML='<div class="lc-head"><div><span class="lc-eyebrow">CROWNLIGHT · VISUAL LEARNING SYSTEM / PROTOTYPE 01</span>'+
 '<h1>THE LEARNING <em>CONSTELLATION</em></h1><p>Stop looking at lists. Explore how every Lab, Boot Camp and indicator connects.</p></div>'+
 '<div class="lc-head-side"><strong class="lc-live"><i></i>INTERACTIVE / OWNER PREVIEW</strong>'+
 '<a href="/prototype.html?experience=a">Return to Chart Studio</a></div></div>'+
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
 '<span>Choose a glowing node. Drag it. Follow its connections.</span></div>'+
 '<div class="lc-map-tools"><button data-lc="minus" type="button" aria-label="Zoom out">−</button>'+
 '<span data-lc="scale">100%</span><button data-lc="plus" type="button" aria-label="Zoom in">+</button>'+
 '<button data-lc="reset" type="button">Reset</button></div></div>'+
 '<div class="lc-canvas" data-lc="canvas" aria-label="Draggable learning network">'+
 '<div class="lc-stars" aria-hidden="true"></div><div class="lc-world" data-lc="world">'+
 '<svg viewBox="0 0 1000 650" class="lc-edges" aria-hidden="true"></svg>'+
 '<div class="lc-points" data-lc="points"></div></div>'+
 '<span class="lc-map-tip">DRAG NODES TO REARRANGE · DRAG BACKGROUND TO PAN · ZOOM + / −</span></div>'+
 '<footer class="lc-legend"><span>◈ LEARNING</span><span>◈ LABS</span><span>◈ BOOT CAMPS</span>'+
 '<span>◈ TALIA</span><span>EDUCATIONAL · NO MARKET SIGNALS</span></footer></section>'+
 '<aside class="lc-detail"><div class="lc-talia"><span class="lc-avatar">T</span><div>'+
 '<span class="lc-eyebrow">TALIA MERCER / MARKET TUTOR</span><strong>Explore the evidence.</strong></div></div>'+
 '<span class="lc-eyebrow" data-lc="kind">SYSTEM MAP</span><h2 data-lc="title">Shared Learning Engine</h2>'+
 '<p class="lc-meta" data-lc="meta"></p><div class="lc-explain"><span class="lc-eyebrow">UNDERSTAND THE CONNECTION</span>'+
 '<p data-lc="detail"></p></div><div class="lc-facts"><span class="lc-eyebrow">SOURCE EVIDENCE</span>'+
 '<ul data-lc="evidence"></ul></div><footer><b>EXPLAIN / TEACH IS ALWAYS FREE</b>'+
 '<p>Uses real curriculum indexes; no key exposure or future candle data.</p></footer></aside></div>';
 host.replaceChildren(root);
 const q=n=>root.querySelector('[data-lc="'+n+'"]');
 const canvas=q('canvas'),world=q('world'),points=q('points'),svg=root.querySelector('.lc-edges');
 const source={labs:null,guides:[]};
 const state={mode:'journey',selected:'hub',items:[],edges:[],positions:new Map(),zoom:1,x:0,y:0,drag:null};
 const abort=new AbortController();let closed=false;
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
 function drawEdges(){
  svg.replaceChildren();const map=new Map(state.items.map(n=>[n.id,n]));
  state.edges.forEach(([u,v])=>{
    const a=map.get(u),b=map.get(v);if(!a||!b)return;
    const p=getPos(a),r=getPos(b);
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    for(const [key,value] of Object.entries({x1:p.x,y1:p.y,x2:r.x,y2:r.y}))line.setAttribute(key,value);
    line.setAttribute('class','lc-edge'+(state.selected===u||state.selected===v?' is-on':''));
    svg.append(line);
  });
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
      state.drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:state.x,y:state.y,
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
  q('scale').textContent=Math.round(state.zoom*100)+'%';}
 function fit(){const w=canvas.clientWidth,h=canvas.clientHeight;if(w<10)return;
  state.zoom=clamp(Math.min((w-20)/1000,(h-20)/650),.35,1.25);
  state.x=(w-1000*state.zoom)/2;state.y=(h-650*state.zoom)/2;transform();}
 function zoom(mult){const old=state.zoom;state.zoom=clamp(old*mult,.34,2.3);
  const x=canvas.clientWidth/2,y=canvas.clientHeight/2;
  state.x=x-(x-state.x)*state.zoom/old;state.y=y-(y-state.y)*state.zoom/old;transform();}
 canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  const btn=e.target.closest('.lc-point'),n=btn&&state.items.find(x=>x.id===btn.dataset.nodeId);
  state.drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:state.x,y:state.y,
    n,btn,pos:n?{...getPos(n)}:null,moved:false};
  try{canvas.setPointerCapture(e.pointerId)}catch{}
 });
 canvas.addEventListener('pointermove',e=>{
  const d=state.drag;if(!d||d.id!==e.pointerId)return;
  const dx=e.clientX-d.startX,dy=e.clientY-d.startY;
  if(Math.abs(dx)+Math.abs(dy)>6)d.moved=true;
  if(d.n){const x=clamp(d.pos.x+dx/state.zoom,105,895),y=clamp(d.pos.y+dy/state.zoom,52,598);
   state.positions.set(d.n.id,{x,y});d.btn.style.left=x+'px';d.btn.style.top=y+'px';drawEdges();
  }else{state.x=d.x+dx;state.y=d.y+dy;transform();}
 });
 const release=e=>{const d=state.drag;if(!d||d.id!==e.pointerId)return;
  // Pointer capture retargets click to the canvas. Select on pointerup so
  // a node remains clickable by mouse/touch after the pan/drag guard.
  if(d.n){if(d.moved)d.btn.dataset.dragged='1';choose(d.n.id)}
  state.drag=null;try{canvas.releasePointerCapture(e.pointerId)}catch{}};
 canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.09:.92)},{passive:false});
 q('plus').addEventListener('click',()=>zoom(1.2));
 q('minus').addEventListener('click',()=>zoom(1/1.2));
 q('reset').addEventListener('click',()=>{layout();fit()});
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
 return()=>{closed=true;abort.abort();observer.disconnect();root.remove()};
}
