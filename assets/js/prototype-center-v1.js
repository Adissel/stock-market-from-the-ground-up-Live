/* Crownlight Prototype Center v1.0
   Synthetic, read-only experiments. Existing /api/admin?action=context is the role authority.
   No member progress, billing, permissions, grading or other production writes.
*/
(()=>{'use strict';
const groups=[
 ['Workspace',[['overview','Overview'],['classroom','Classroom Builder'],['components','Component Library']]],
 ['Learning & Trading',[['visuals','Charts & Visualization Library'],['studio','Chart Studio'],['labs','Interactive Labs'],['bootcamps','Boot Camp Classroom'],['replay','Historical Replay'],['talia','Talia Tutor'],['watchlist','Watchlist'],['plan','Trade-Plan Builder'],['journal','Trade Journal & Paper Trading']]],
 ['Members & Commerce',[['dashboard','Member Dashboard'],['lumens','Lumens & Rewards'],['store','Store & Memberships'],['community','Community']]],
 ['Operations & Design',[['admin','Admin Control Panel'],['research','Market Research'],['public','Public Site & Books'],['effects','Interactions & Animation'],['3d','3D Experiments']]],
 ['Quality Control',[['test','Test & Acceptance'],['release','Release Manager']]]
];
const workspace=new Map(groups.flatMap(([g,items])=>items.map(([id,name])=>[id,{name,g}])));
const caseWorkspaces=new Set(['classroom','labs','bootcamps','studio','replay','talia','admin']);
const adminGroups=['Overview','Members & Access','Learning Administration','Commerce','Community','Website Management','Support & Operations','Security & Governance'];
const stages=['Welcome and learning objectives','First-principles explanation','Worked numerical example','Guided chart demonstration','Knowledge checkpoint','Guided practice','Independent assessment','Transfer task','Diagnostic feedback and remediation'];
const descriptions={
 overview:'Inventory, boundaries and local prototype status.',classroom:'Build and compare shared Lab and Boot Camp teaching layouts.',
 components:'Examine reusable lesson, chart and assessment components.',visuals:'Test four ECharts visualization patterns with fictional datasets.',
 studio:'Explore Standard, Advanced and Professional Chart Studio presentations.',labs:'Preview nine-stage lesson structures and assessment presentation.',
 bootcamps:'Design multi-day learning using the shared classroom foundation.',replay:'Exercise a fictional, no-lookahead replay interface.',
 talia:'Evaluate chart-integrated instruction and free explanations.',watchlist:'Test watchlist charts, comparisons and research presentation.',
 plan:'Explore chart-based risk/reward and trade-plan composition.',journal:'Compare simulated equity, outcomes and review analytics.',
 dashboard:'Examine competency, progress and activity charts.',lumens:'Design the single Crownlight Lumens wallet visuals.',
 store:'Demonstrate products and member benefits without changing checkout.',community:'Prototype voting, topic and aggregate activity diagrams.',
 admin:'Review all eight approved Admin Control Center groups without mutation.',research:'Experiment with market-research and fundamentals visualizations.',
 public:'Explore educational and book-companion illustrations.',effects:'Compare chart interaction, rendering and responsive behavior.',
 '3d':'Inspect fictional 3D candlesticks and volume in a WebGL laboratory. This prototype does not use live market data or change member records.',
 test:'Run explicit browser-local interface checks; never equate them to production QA.',
 release:'Export design evidence; production release remains subject to CI and Owner acceptance.'
};
const features={
 components:[['Instructional components','Source-aware lesson cards, charts, progress indicators, prompts and assessment shells.'],['Design consistency','Reusable tokens and accessible keyboard navigation.']],
 visuals:[['Financial charts','Candlesticks, volume and overlays with clear provenance.'],['Analytical diagrams','Heatmaps, line plots, bar charts and custom visualizations.']],
 studio:[['Standard','Foundational candles, volume, EMA 9/20 and VWAP.'],['Advanced','Additional indicators, drawings, Fibonacci and configurable layouts.'],['Professional','Synchronized charts, sophisticated analytics and replay.']],
 labs:[['Nine-stage instruction','First principles, worked examples, guided practice, independent assessment and transfer.'],['Protected assessment','Real keys and grading remain in existing protected services.']],
 bootcamps:[['Daily classroom','Same teaching engine across multi-day programs.'],['Progress','Daily checkpoints, prerequisites and competency evidence.']],
 replay:[['No-lookahead','Reveal one fictional candle at a time.'],['Data provenance','Real historical releases require validated datasets.']],
 talia:[['Guided tutor','Explain This Concept, Guided Example, Try Another Example and Teach More Deeply.'],['Chart explanations','Highlight evidence and intermediate calculations.']],
 watchlist:[['Free / full','One watchlist model with entitlement-controlled capabilities.'],['Research','Comparison, relative volume and study indicators.']],
 plan:[['Trade construction','Entry, stop, target, invalidation and risk/reward.'],['Financial correctness','Validated calculations outside visualization layer.']],
 journal:[['Performance','Fictional R-multiples, MFE/MAE and equity development.'],['Evidence','Paper versus live trades must be distinguished.']],
 dashboard:[['Competency','Knowledge, Recognition, Decision and Process.'],['Progress','Study calendar, completion and remediation history.']],
 lumens:[['One currency','Crownlight Lumens; no duplicate wallet or ledger.'],['Rewards','Redemption visuals do not confer entitlements.']],
 store:[['Product demos','Interactive previews using fictional data.'],['Founding Members','Terms and benefits require authoritative commerce catalog.']],
 community:[['Market Commons','Topics and community education graphics.'],['Founders Commons','Privacy-preserving votes and aggregated activity.']],
 research:[['Fundamentals','Valuation, earnings and industry comparison.'],['Licensing','Data must be validated before publication.']],
 public:[['Books','Interactive learning pathways and companion illustrations.'],['Marketing','Real tool previews instead of decorative claims.']],
 effects:[['Chart interactions','Tooltips, zoom, pan, selection and transitions.'],['Accessibility','Keyboard, text alternatives and reduced motion.']],
 '3d':[['3D candlesticks','Three.js/WebGL with fictional OHLCV and camera controls.'],['Accessibility','Responsive source-data table and no-WebGL fallback.'],['Future extensions','Avatar customization and advanced analytics remain separate projects.']]
};
const $=id=>document.getElementById(id),create=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=String(text);if(cls)e.className=cls;return e;};
const state={id:'classroom',mode:'Lab',device:'desktop',kind:'candlestick',stage:0,tier:'Standard',layout:'Balanced',density:'Comfortable',tutor:'Right',adminGroup:adminGroups[0],revealed:8,chart:null,resize:null,user:null,checks:[],saved:null};
const b=(name,fn,pressed)=>{const e=create('button',name);e.type='button';if(pressed!==undefined)e.setAttribute('aria-pressed',String(pressed));e.addEventListener('click',fn);return e;};
const note=v=>{$('pt-feedback').textContent=v;};
let threeDisposer=null,threeLoadTicket=0,deckDisposer=null,deckLoadTicket=0;
async function loadDeck(){
 const ticket=++deckLoadTicket;
 const host=$('pt-command-deck');if(!host||!state.user)return;
 try{
  const module=await import('/assets/js/prototype-deck-v6.bundle.js');
  if(ticket!==deckLoadTicket||!state.user||$('pt-app').hidden||!host.isConnected)return;
  deckDisposer=module.mountPrototypeDeck(host);
  window.dispatchEvent(new CustomEvent('crownlight:prototype-workspace',{detail:{id:state.id}}));
 }catch(error){
  if(ticket!==deckLoadTicket||!host.isConnected)return;
  const fallback=create('div','Use the 23 workspace links in the left navigation. Interactive shortcuts could not load.','pt-note');
  host.replaceChildren(fallback);
  console.warn('Prototype React command deck unavailable',error);
 }
}
function teardownDeck(){
 deckLoadTicket++;
 if(deckDisposer){try{deckDisposer();}catch(error){console.warn('Prototype React command cleanup error',error);}deckDisposer=null;}
}
function teardownThree(){
 threeLoadTicket++;
 if(threeDisposer){try{threeDisposer();}catch(error){console.warn('3D prototype cleanup failed',error);}threeDisposer=null;}
}
async function loadThree(host){
 const ticket=++threeLoadTicket;
 try{
  const module=await import('/assets/js/prototype-three-lab-v1.bundle.js');
  if(ticket!==threeLoadTicket||!host.isConnected||!state.user||$('pt-app').hidden)return;
  threeDisposer=module.mountPrototypeThree(host);
 }catch(error){
  if(ticket!==threeLoadTicket||!host.isConnected)return;
  host.replaceChildren(create('p','3D experiment unavailable. The standard ECharts workspaces remain usable.','pt-note'));
  console.warn('3D experiment failed to load',error);
 }
}
function buttons(values,selected,change){const row=create('div',undefined,'pt-options');for(const v of values)row.append(b(v,()=>change(v),selected===v));return row;}
function card(name,desc){const div=create('article',undefined,'pt-tile');div.append(create('strong',name),create('p',desc));return div;}
function grid(items){const div=create('div',undefined,'pt-grid');for(const [title,desc] of items)div.append(card(title,desc));return div;}
function nav(query=''){const host=$('pt-nav');host.replaceChildren();for(const [group,items] of groups){const list=items.filter(([,name])=>(group+' '+name).toLowerCase().includes(query.toLowerCase()));if(!list.length)continue;const section=create('section');section.append(create('h3',group));for(const [id,name] of list){const action=b(name,()=>{location.hash=id;select(id,true)});action.setAttribute('aria-current',id===state.id?'page':'false');section.append(action);}host.append(section);}}
function classroom(root){
 // One integrated workspace. The existing authenticated case player and ECharts
 // remain mounted in pt-case-host and pt-chart; do not add a second chart or engine.
 const section=(name,css)=>{const el=create('section',undefined,css||'pt-card');el.append(create('h3',name));return el};
 const hero=section('Crownlight Classroom · Integrated Teaching','pt-card pt-v3-hero');
 hero.append(create('p','One teaching workspace connects the approved nine-stage Learning Engine, protected fictional case viewer, Chart Studio canvas and Talia context. This is an ungraded Owner/Admin preview.','pt-note'));
 const navLinks=create('div',undefined,'pt-v3-links');
 const destinations=[
  ['/prototype.html?experience=map','Learning Constellation 3D'],
  ['/prototype.html?experience=a','Advanced Chart Studio'],
  ['/talia-tutor-prototype.html','Talia Tutor Studio']
 ];
 for(const [url,title] of destinations){const a=create('a',title,'pt-v3-link');a.href=url;navLinks.append(a)}
 const inspect=b('Inspect canonical curriculum',()=>{
  const inspector=$('pt-curriculum-parity');
  if(!inspector)return note('Current source inspector unavailable.');
  inspector.open=true;
  inspector.scrollIntoView({block:'start',behavior:'auto'});
  note('Source inspector opened. Content is derived from existing curriculum indexes, not invented.');
 });
 navLinks.append(inspect);
 const orbit=create('div',undefined,'pt-v4-orbit');
 orbit.setAttribute('aria-label','The existing shared teaching system connects nine stages, 419 Labs, ten Boot Camps and source-backed Talia guides.');
 const art=create('div',undefined,'pt-v4-orbit-art');art.setAttribute('aria-hidden','true');
 for(let i=0;i<3;i++)art.append(create('div',undefined,'pt-v4-orbit-ring pt-v4-orbit-ring-'+i));
 const nexus=create('div',undefined,'pt-v4-orbit-nexus');
 nexus.append(create('strong','CROWNLIGHT'),create('small','SHARED LEARNING ENGINE 3.3'));art.append(nexus);
 const totals=create('div',undefined,'pt-v4-orbit-totals');
 [['09','Learning stages'],['419','Canonical Labs'],['10','Boot Camp paths'],['30','Competencies']].forEach(([quantity,title])=>{
  const item=create('div',undefined,'pt-v4-orbit-total');
  item.append(create('strong',quantity),create('span',title));totals.append(item);
 });
 orbit.append(art,totals);hero.append(orbit);
 hero.append(navLinks);root.append(hero);
 const choices=section('Lab and Boot Camp learning workspace','pt-card pt-v3-modes');
 choices.append(buttons(['Lab','Boot Camp'],state.mode,v=>{state.mode=v;state.stage=0;draw()}));
 choices.append(create('p','Mode selection changes only the synthetic presentation; it does not enroll members or modify graded attempts.','pt-note'));
 root.append(choices);
 const layout=section('Classic Builder · Membership design controls','pt-card pt-v3-configuration pt-classroom');
 layout.dataset.layout=state.layout;layout.dataset.density=state.density;layout.dataset.tutor=state.tutor;
 layout.append(create('p','Layout preset'));
 layout.append(buttons(['Balanced','Reading-first','Chart-first'],state.layout,v=>{
  if(window.CrownlightClassroomMemberships)window.CrownlightClassroomMemberships.adjust('layout',v);
  else{state.layout=v;draw()}
 }));
 layout.append(create('p','Content density'));
 layout.append(buttons(['Comfortable','Compact'],state.density,v=>{
  if(window.CrownlightClassroomMemberships)window.CrownlightClassroomMemberships.adjust('density',v);
  else{state.density=v;draw()}
 }));
 layout.append(create('p','Talia docking'));
 layout.append(buttons(['Right','Bottom'],state.tutor,v=>{
  if(window.CrownlightClassroomMemberships)window.CrownlightClassroomMemberships.adjust('tutor',v);
  else{state.tutor=v;draw()}
 }));
 root.append(layout);
 window.CrownlightClassroomMemberships?.render?.(root);
 const stage=section('Shared Learning Engine v3.3 · Nine approved stages','pt-card pt-v3-stage');
 stage.dataset.stage=String(state.stage);
 const names=['Start','Learn','Experiment','Predict','Practice','Assess','Review','Transfer','Results'];
 const explanations=[
  'Establish objectives and the evidence needed before interpreting price.',
  'Define the concept, calculation, examples, counterexamples and limitations.',
  'Reveal completed fictional price bars chronologically, without lookahead.',
  'Record a falsifiable expectation before viewing new price evidence.',
  'Rehearse the method using guided, unlimited, ungraded practice.',
  'Assessment remains protected and unavailable inside this design preview.',
  'Review reasoning and mistakes; the actual first graded attempt remains protected.',
  'Transfer the concept to a distinct scenario, context or timeframe.',
  'Explain the evidence and current learning status without asserting mastery.'
 ];
 const gridNav=create('nav',undefined,'pt-v3-stage-grid');
 gridNav.setAttribute('aria-label','Nine approved classroom stages');
 names.forEach((name,i)=>{
  const btn=b(String(i+1).padStart(2,'0')+' · '+name,()=>{state.stage=i;draw()},state.stage===i);
  btn.className='pt-v3-stage-button';btn.setAttribute('aria-current',state.stage===i?'step':'false');
  btn.title='Preview stage '+(i+1)+'. This does not complete the stage.';
  gridNav.append(btn);
 });
 stage.append(gridNav);
 const selected=create('div',undefined,'pt-v3-stage-context');
 selected.append(create('strong','Stage '+(state.stage+1)+' / 9 — '+names[state.stage]),
  create('p',explanations[state.stage]),
  create('p','Preview position only · actual lesson completion and mode locks are enforced by the authenticated shared learning engine.','pt-note'));
 const navigation=create('div',undefined,'pt-row');
 const prev=b('Previous stage',()=>{state.stage=Math.max(0,state.stage-1);draw()});
 const next=b('Next stage',()=>{state.stage=Math.min(8,state.stage+1);draw()});
 prev.disabled=state.stage===0;next.disabled=state.stage===8;
 navigation.append(prev,next);selected.append(navigation);stage.append(selected);
 root.append(stage);
 const facets=section('Learn from the evidence · Talia Mercer','pt-card pt-v3-tutor');
 const concepts=[
  ['Understand','Define the subject in original language and establish the chart units and context.'],
  ['Recognize','Identify completed evidence such as candle structure, VWAP location and volume.'],
  ['Apply','Work a calculation, practice an interpretation and compare alternate explanations.'],
  ['Common mistake','Explain what price movement or one indicator alone cannot establish.'],
  ['Limitations','Review historical-data rights, incomplete evidence, uncertainty and lookahead bias.']
 ];
 const cards=create('div',undefined,'pt-v3-facet-grid');
 for(const [heading,description] of concepts){const c=create('article',undefined,'pt-v3-facet');c.append(create('strong',heading),create('p',description));cards.append(c)}
 facets.append(cards);
 facets.append(create('p','Explain/Teach remains free. This panel offers source-aware teaching prompts; it does not invent live Tutor responses or reveal assessment answers.','pt-note'));
 const actions=create('div',undefined,'pt-v3-links');
 for(const [name,detail] of [
  ['Explore a candle','Use the protected fictional case below to inspect the actual OHLCV observations.'],
  ['Show indicator mathematics','Inspect the existing ECharts chart, its numerical facts and proxy calculations.'],
  ['Ask Talia','Open the dedicated Tutor Studio without claiming this preview is an authenticated Tutor response.']
 ]){const button=b(name,()=>note(detail));actions.append(button)}
 facets.append(actions);root.append(facets);
 if(state.mode==='Boot Camp'){
  const camp=section('Boot Camp learning pathway','pt-card pt-v3-academy');
  camp.append(create('p','The ten source-authored Boot Camp paths include three controlled draft-beta paths. Authorized day navigation remains in the existing Academy player.','pt-note'));
  const link=create('a','Open the authorized Boot Camp Academy','pt-v3-link');
  link.href='/bootcamp.html';camp.append(link);
  const courses=[
  ['The Truth Behind the Ticker',5,false],
  ['Build Your Own Stock Watchlist',7,false],
  ['Mastering Stock Scanners',10,false],
  ['The Complete Trading Foundations Boot Camp',30,false],
  ['Chart Reading and Trading Setups',45,false],
  ['Risk, Execution, and Trading Discipline',60,false],
  ['Advanced Simulated Trading Practicum',90,false],
  ['Reading the Tape & Market Microstructure',10,true],
  ['VWAP, EMA & Technical Indicator Mastery',10,true],
  ['SEC Filings, Catalysts & Corporate Actions',7,true]
 ];
 const atlas=create('div',undefined,'pt-v3-courses');
 courses.forEach(([title,days,draft])=>{
  const article=create('article',undefined,'pt-v3-course');
  article.append(create('strong',title),create('small',days+' authored days · '+(draft?'Controlled beta draft':'Original curriculum')));
  atlas.append(article);
 });
 camp.append(atlas);
 camp.append(create('p','Original published curriculum and invitation-only drafts are distinct. Course enrollment, lesson-level access, completion, and protected awards remain server-controlled.','pt-note'));
 root.append(camp);
 }else{
  const lab=section('Lab Studio · Connected fictional evidence','pt-card pt-v3-labs');
  lab.append(create('p','The existing single protected case component and ECharts canvas below provide the OHLCV chart and sequential candle disclosure. They are reused here rather than replaced by decorative rectangles.','pt-note'));
  root.append(lab);
 }
}
function admin(root){root.append(create('h3','Approved eight-group Admin taxonomy'));root.append(buttons(adminGroups,state.adminGroup,v=>{state.adminGroup=v;draw()}));root.append(grid([[state.adminGroup,'Read-only layout experiment; changes must use the established authorized Admin workflow.'],['Authority','No role, entitlement, price, payment, security or membership write is permitted from this page.']]));}
function feature(root){root.append(grid(features[state.id]||[]));
 if(state.id==='studio'){root.append(create('h3','Chart Studio membership tier'));root.append(buttons(['Standard','Advanced','Professional'],state.tier,v=>{state.tier=v;draw()}));}
 if(state.id==='replay')root.append(create('p','The shared role-protected case component below controls fictional candle-by-candle replay and the visible chart boundary.','pt-note'));

}
function checks(){
 const results=[['23 workspaces',workspace.size===23],['18 application tabs',groups.slice(1,5).reduce((n,g)=>n+g[1].length,0)===18],['Nine classroom stages',stages.length===9],['Eight Admin groups',adminGroups.length===8],['ECharts rendering',!!state.chart],['Authenticated owner/admin context',!!state.user]];
 state.checks=results.map(([name,pass])=>({name,pass}));draw();note(results.filter(x=>x[1]).length+'/'+results.length+' browser-local checks passed. Not a security, production or end-to-end acceptance test.');
}
function test(root){const pane=create('section',undefined,'pt-card');pane.append(create('h3','Local testing controls'),create('p','These checks inspect the interface only. Real Owner/Admin/Moderator/Free account tests, RLS and CI remain required.'),b('Run local checks',checks));
 if(state.checks.length){const table=create('table',undefined,'pt-table');for(const t of state.checks){const tr=create('tr');tr.append(create('th',t.name),create('td',t.pass?'PASS':'FAIL'));table.append(tr);}pane.append(table);}
 root.append(pane);
}
function release(root){
 const pane=create('section',undefined,'pt-card');pane.append(create('h3','Design review and evidence'));
 const rows=[['Local draft',state.saved||'Not saved'],['Local checks',state.checks.length+' executed'],['Release status','NOT APPROVED — authenticated acceptance and deployment outstanding'],['Production writes','Disabled in this prototype']];
 const table=create('table',undefined,'pt-table');for(const [k,v] of rows){const tr=create('tr');tr.append(create('th',k),create('td',v));table.append(tr)}pane.append(table);
 pane.append(b('Export design evidence',()=>{
 const data={artifact:'SMFGU-PROTOTYPE-001',version:'1.0',at:new Date().toISOString(),workspace:state.id,device:state.device,mode:state.mode,chart:state.kind,checks:state.checks,release:'Unapproved design-only evidence'};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=create('a');a.href=url;a.download='crownlight-prototype-evidence.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);note('Local evidence exported; production remains unchanged.');
 }));root.append(pane);
}
function draw(){
 teardownThree();
 const root=$('pt-content'),caseHost=$('pt-case-host'),experience=$('pt-experience');
 root.replaceChildren();root.dataset.device=state.device;
 caseHost.replaceChildren();caseHost.hidden=!caseWorkspaces.has(state.id)&&state.id!=='3d';
 experience.dataset.workspace=state.id;
 window.CrownlightPrototypeTeaching?.setActiveTab?.(state.id);
 if(state.id==='classroom')classroom(root);else if(state.id==='admin')admin(root);else if(state.id==='test')test(root);else if(state.id==='release')release(root);
 else if(state.id==='overview')root.append(grid([['23 workspaces','18 capability tabs and 5 shared workspaces.'],['Synthetic charts','Deterministic fictional examples using local ECharts.'],['Permission boundary','Owner or Administrator context required.'],['Release boundary','No production writes or member records.']]));
 else feature(root);
 if(state.id==='3d'){
  const host=create('div');host.id='pt-three-lab';host.setAttribute('aria-label','Interactive fictional three-dimensional visualization');
  caseHost.append(host);void loadThree(host);
 }else if(caseWorkspaces.has(state.id)&&window.CrownlightPrototypeTeaching){
  void window.CrownlightPrototypeTeaching.mount(caseHost,state.id,state.mode);
 }
 void plot();
}
function select(id,focus=false){if(!workspace.has(id))return;state.id=id;const x=workspace.get(id);$('pt-title').textContent=x.name;$('pt-group').textContent=x.g;$('pt-desc').textContent=descriptions[id];nav($('pt-search').value);draw();window.dispatchEvent(new CustomEvent('crownlight:prototype-workspace',{detail:{id}}));if(focus)$('pt-title').focus();}
function candles(){const secured=window.CrownlightPrototypeTeaching?.getChartCandles?.();if(Array.isArray(secured)&&secured.length)return secured;let v=100;const result=[];for(let i=0;i<24;i++){const open=v;v=Math.max(12,v+2.4*Math.sin(i*.71)+1.2*Math.cos(i*.39));result.push({t:'T'+String(i+1).padStart(2,'0'),open:+open.toFixed(2),close:+v.toFixed(2),high:+(Math.max(open,v)+1.6).toFixed(2),low:+(Math.min(open,v)-1.4).toFixed(2),volume:500+((i*97)%700)});}return state.id==='replay'?result.slice(0,state.revealed):result;}
const chartView={volume:true,proxy:false,grid:true,mode:'analysis'};
function applyChartMetrics(data){
 const last=data[data.length-1],first=data[0];
 if(!last||!first)return;
 const high=Math.max(...data.map(d=>Number(d.high))),low=Math.min(...data.map(d=>Number(d.low)));
 const delta=Number(last.close)-Number(first.open);
 const pct=Number(first.open)?delta/Number(first.open)*100:0;
 $('pt-metric-close').textContent='$'+Number(last.close).toFixed(2);
 const change=$('pt-metric-change');
 change.textContent=(delta>0?'+':'')+delta.toFixed(2)+' / '+(pct>0?'+':'')+pct.toFixed(2)+'%';
 change.dataset.trend=delta>0?'up':delta<0?'down':'flat';
 $('pt-metric-range').textContent='$'+low.toFixed(2)+' – $'+high.toFixed(2);
 $('pt-metric-count').textContent=String(data.length).padStart(2,'0')+' BARS';
 $('pt-chart-mode').textContent=state.kind.toUpperCase()+' / '+(chartView.volume&&state.kind!=='heatmap'?'VOLUME':'PRICE ONLY');
}
function proxySeries(data){
 let total=0,weighted=0;
 return data.map(c=>{
  const v=Number(c.volume),typical=(Number(c.high)+Number(c.low)+Number(c.close))/3;
  if(!(Number.isFinite(v)&&v>0&&Number.isFinite(typical)))return null;
  total+=v;weighted+=v*typical;return +(weighted/total).toFixed(4);
 });
}
async function plot(){
 try{
  const E=await window.CrownlightECharts.load();if($('pt-app').hidden)return;
  const chartHost=$('pt-chart');
  if(!state.chart){state.chart=E.init(chartHost,null,{renderer:'canvas'});state.resize=new ResizeObserver(()=>state.chart?.resize());state.resize.observe(chartHost);}
  const data=candles(),labels=data.map(x=>x.t),member=window.CrownlightClassroomMemberships;
  const appearance=member?.chartOptions?.(data);
  if(appearance&&chartHost){
   const height=Math.min(600,Math.max(350,Number(appearance.height)||450))+'px';
   if(chartHost.style.height!==height){chartHost.style.height=height;state.chart.resize();}
  }
  applyChartMetrics(data);
  const hasVolume=chartView.volume&&state.kind!=='heatmap'&&state.kind!=='bar';
  const isHeatmap=state.kind==='heatmap';
  const prices=data.map(x=>[x.open,x.close,x.low,x.high]);
  const sharedColor={color:'#56dfbc',color0:'#f07189',borderColor:'#56dfbc',borderColor0:'#f07189'};
  const splitting=chartView.grid&&appearance?.axisSplit?.show!==false;
  const axisStyle={axisLine:{lineStyle:{color:'#315267'}},axisTick:{show:false},axisLabel:{color:'#a5bac8',fontSize:10},splitLine:{show:splitting,lineStyle:{color:'#263c4c',type:'dashed',width:.8}}};
  const priceXAxis={type:'category',data:labels,boundaryGap:true,axisLine:{lineStyle:{color:'#375466'}},
    axisLabel:{show:!hasVolume,color:'#8daebd',fontSize:10,hideOverlap:true},axisTick:{show:false},splitLine:{show:false}};
  const priceYAxis={type:'value',scale:true,position:'right',...axisStyle};
  const base={animation:false,backgroundColor:'transparent',textStyle:{color:'#d7e7ef'},
    tooltip:{trigger:'axis',renderMode:'richText',axisPointer:{type:'cross',lineStyle:{color:'#8bc5bf',width:1,type:'dashed'}},formatter:appearance?.tooltip},
    grid:hasVolume?[{left:18,right:65,top:14,height:'63%'},{left:18,right:65,top:'80%',height:'11%'}]:{left:18,right:65,top:16,bottom:66},
    xAxis:hasVolume?[{...priceXAxis,gridIndex:0},{...priceXAxis,gridIndex:1,axisLabel:{color:'#90abb9',fontSize:10}}]:priceXAxis,
    yAxis:hasVolume?[{...priceYAxis,gridIndex:0},{type:'value',gridIndex:1,scale:true,axisLabel:{color:'#7898a9',fontSize:9},axisLine:{show:false},splitLine:{show:false},axisTick:{show:false}}]:priceYAxis,
    dataZoom:[{type:'inside',xAxisIndex:hasVolume?[0,1]:[0],filterMode:'none'},{type:'slider',xAxisIndex:hasVolume?[0,1]:[0],bottom:7,height:13,showDetail:false,brushSelect:false,
      borderColor:'#325469',fillerColor:'#3f8b8650',handleStyle:{color:'#7296a0',borderColor:'#b1ced5'},textStyle:{color:'#b0c3ce'}}],
    series:[]};
  if(state.kind==='candlestick'){
   base.series.push({name:'Fictional OHLC',type:'candlestick',data:prices,itemStyle:appearance?.itemStyle||sharedColor,
     barWidth:appearance?.barWidth||'65%',xAxisIndex:0,yAxisIndex:0});
  }else if(state.kind==='line'){
   base.series.push({name:'Fictional close',type:'line',smooth:.16,showSymbol:data.length<=5,symbolSize:6,
     data:data.map(x=>x.close),lineStyle:{color:'#65d7cb',width:2.5},itemStyle:{color:'#8eeadc'},
     areaStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'#4fcabb3b'},{offset:1,color:'#4fcabb00'}]}},
     xAxisIndex:0,yAxisIndex:0});
  }else if(state.kind==='bar'){
   base.series.push({name:'Fictional volume',type:'bar',data:data.map(x=>({value:x.volume,itemStyle:{color:x.close>=x.open?'#61f1cb':'#ff8a9d',borderRadius:[3,3,0,0]}})),barMaxWidth:23});
  }else if(isHeatmap){
   base.grid={left:85,right:38,top:24,bottom:95};
   base.xAxis={type:'category',data:labels,axisLabel:{color:'#9bb9c8'}};
   base.yAxis={type:'category',data:['Knowledge','Recognition','Decision','Process'],axisLabel:{color:'#b9ccd7'}};
   base.visualMap={min:0,max:100,calculable:true,orient:'horizontal',bottom:28,textStyle:{color:'#e0eef7'},inRange:{color:['#17344b','#2a7699','#66dbcc','#f3d491']}};
   base.series=[{type:'heatmap',name:'Fictional competency',data:data.flatMap((x,i)=>[0,1,2,3].map(j=>[i,j,30+(i*13+j*11)%69]))}];
  }
  if(chartView.proxy&&(state.kind==='candlestick'||state.kind==='line')){
   base.series.push({name:'OHLCV typical-price proxy (not trade VWAP)',type:'line',data:proxySeries(data),showSymbol:false,
    lineStyle:{color:'#e5c480',width:1.7,type:'dashed'},z:4,xAxisIndex:0,yAxisIndex:0,
    tooltip:{valueFormatter:value=>value===null?'N/A':'$'+Number(value).toFixed(4)}});
  }
  if(hasVolume){
   base.series.push({name:'Fictional bar volume',type:'bar',data:data.map(c=>({
     value:c.volume,itemStyle:{color:c.close>=c.open?'#50dcb3':'#e77b91',borderRadius:[3,3,0,0]}
   })),xAxisIndex:1,yAxisIndex:1,barMaxWidth:25});
   base.axisPointer={link:[{xAxisIndex:[0,1]}]};
  }
  state.chart.setOption(base,{notMerge:true});
  state.chart.off('click');
  state.chart.on('click',event=>{
   if(Number.isInteger(event?.dataIndex))member?.inspector?.($('pt-bar-inspector'),data,event.dataIndex);
  });
  member?.inspector?.($('pt-bar-inspector'),data,data.length-1);
  $('pt-chart-status').textContent='Interactive '+state.kind+' · '+data.length+' visible fictional bars · controls operate this preview only. The dashed line is an OHLCV typical-price proxy, not transaction VWAP.';
 }catch(e){$('pt-chart-status').textContent='ECharts unavailable: '+(e?.message||'Renderer error');}
}
function save(){window.CrownlightClassroomMemberships?.save?.();try{const obj={id:state.id,mode:state.mode,device:state.device,kind:state.kind,stage:state.stage,tier:state.tier,layout:state.layout,density:state.density,tutor:state.tutor,adminGroup:state.adminGroup,revealed:state.revealed,saved:new Date().toISOString()};localStorage.setItem('crownlight:prototype:v1:'+state.user,JSON.stringify(obj));state.saved=obj.saved;note('Saved locally for this administrator in this browser. No server records changed.');}catch{note('Local draft could not be saved.');}}
function restore(){try{const data=JSON.parse(localStorage.getItem('crownlight:prototype:v1:'+state.user)||'null');if(!data)return;for(const k of ['mode','device','kind','stage','tier','layout','density','tutor','adminGroup','revealed','saved'])if(Object.hasOwn(data,k))state[k]=data[k];if(workspace.has(data.id))state.id=data.id;if(!['desktop','tablet','mobile'].includes(state.device))state.device='desktop';if(!['candlestick','bar','line','heatmap'].includes(state.kind))state.kind='candlestick';state.stage=Math.max(0,Math.min(8,Number(state.stage)||0));if(!['Balanced','Reading-first','Chart-first'].includes(state.layout))state.layout='Balanced';if(!['Comfortable','Compact'].includes(state.density))state.density='Comfortable';if(!['Right','Bottom'].includes(state.tutor))state.tutor='Right';}catch{}}
/* Refresh staff authority when a previously open private workbench regains focus.
 * Missing permissions or provider failures fail closed; no stale UI remains visible. */
let checkingStaff=false;
async function recheckStaffAccess(){
 if(!state.user||checkingStaff)return;
 // Keep the authorized workbench mounted while an in-flight role check runs.
 // Hiding the entire page on window focus reset scroll and ECharts layouts.
 // APIs enforce permissions independently; any revoked/invalid session still
 // clears the workbench in the catch branch below.
 checkingStaff=true;
 try{
  const sb=await window.getSupabaseClient?.();
  const {data:{session}}=await sb.auth.getSession();
  const identity=await sb.auth.getUser();
  if(!session?.access_token||identity.error||identity.data?.user?.id!==state.user)throw Error('Staff session is no longer valid.');
  const response=await fetch('/api/admin?action=context',{headers:{authorization:'Bearer '+session.access_token,accept:'application/json'},cache:'no-store',credentials:'same-origin'});
  if(!response.ok)throw Error('Administrative authorization could not be verified.');
  const ctx=await response.json();
  const roles=Array.isArray(ctx.roles)?ctx.roles:[],permissions=Array.isArray(ctx.permissions)?ctx.permissions:[];
  if(ctx.ok!==true||roles.includes('SHOWCASE_VIEWER')||!roles.some(role=>['OWNER','ADMIN','TECH_ADMIN'].includes(role))||!permissions.includes('control_panel.access'))
   throw Error('Your account no longer has Prototype Center permissions.');
  $('pt-role').textContent=roles.includes('OWNER')?'Owner':roles.includes('ADMIN')?'Administrator':'Technical Administrator';
  $('pt-gate').hidden=true;
  // A successful focus/visibility recheck must not remount or jump the page.
  if($('pt-app').hidden){$('pt-app').hidden=false;state.chart?.resize();}
 }catch(error){
  state.resize?.disconnect();state.chart?.dispose();state.chart=null;teardownThree();teardownDeck();
  window.CrownlightPrototypeTeaching?.reset?.();window.CrownlightClassroomMemberships?.clear?.();window.CrownlightClassroomPresetSync?.clear?.();state.user=null;
  $('pt-app').hidden=true;$('pt-gate').hidden=false;
  $('pt-gate').textContent=error?.message||'Staff authorization unavailable.';
 }finally{checkingStaff=false;}
}
function controls(){
 window.addEventListener('focus',()=>void recheckStaffAccess());
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)void recheckStaffAccess();});
 window.addEventListener('crownlight:prototype-navigate',e=>{
  const id=e.detail?.id;
  if(typeof id!=='string'||!workspace.has(id)||!state.user)return;
  if(id===state.id){$('pt-title').focus();return;}
  location.hash=id;select(id,true);
 });
 $('pt-search').addEventListener('input',e=>nav(e.target.value.trim()));
 $('pt-device').addEventListener('change',e=>{state.device=e.target.value;draw()});
 $('pt-kind').addEventListener('change',e=>{state.kind=e.target.value;void plot()});
 const tools=[['pt-chart-volume','volume'],['pt-chart-proxy','proxy'],['pt-chart-grid','grid']];
 for(const [id,key] of tools)$(id).addEventListener('click',()=>{
  chartView[key]=!chartView[key];
  $(id).setAttribute('aria-pressed',String(chartView[key]));
  void plot();
 });
 $('pt-chart-reset').addEventListener('click',()=>{
  state.chart?.dispatchAction({type:'dataZoom',start:0,end:100});
  $('pt-chart-status').textContent='Interactive '+state.kind+' · zoom reset to the visible fictional dataset.';
 });
 window.addEventListener('crownlight:prototype-view',event=>{
  if(!state.user)return;
  const mode=event.detail?.mode;
  if(!['analysis','focus-chart','focus-lesson'].includes(mode))return;
  chartView.mode=mode;$('pt-experience').dataset.view=mode;
  requestAnimationFrame(()=>state.chart?.resize());
 });
 $('pt-save').addEventListener('click',save);
 $('pt-reset').addEventListener('click',()=>{window.CrownlightClassroomMemberships?.reset?.();state.mode='Lab';state.device='desktop';state.kind='candlestick';state.stage=0;state.tier='Standard';state.layout='Balanced';state.density='Comfortable';state.tutor='Right';state.revealed=8;$('pt-device').value=state.device;$('pt-kind').value=state.kind;draw();note('Reset local controls only.');});
 window.addEventListener('hashchange',()=>select(location.hash.slice(1)||state.id));
 window.addEventListener('crownlight:prototype-case-change',()=>{void plot()});
 window.addEventListener('pagehide',()=>{teardownDeck();teardownThree();state.resize?.disconnect();state.chart?.dispose();state.chart=null;window.CrownlightPrototypeTeaching?.reset?.();window.CrownlightClassroomMemberships?.clear?.();});
}
async function start(){try{
 const sb=await window.getSupabaseClient?.();if(!sb)throw Error('Authentication service unavailable.');
 const {data:{session}}=await sb.auth.getSession();if(!session?.access_token){location.replace('/signin.html?next='+encodeURIComponent(location.pathname));return;}
 const verified=await sb.auth.getUser();if(verified.error||verified.data?.user?.id!==session.user?.id)throw Error('Verified sign-in required.');
 const reply=await fetch('/api/admin?action=context',{method:'GET',headers:{authorization:'Bearer '+session.access_token,accept:'application/json'},cache:'no-store',credentials:'same-origin'});
 if(!reply.ok)throw Error('Administrative access check failed.');
 const ctx=await reply.json(),roles=Array.isArray(ctx.roles)?ctx.roles:[],perms=Array.isArray(ctx.permissions)?ctx.permissions:[];
 if(ctx.ok!==true||roles.includes('SHOWCASE_VIEWER')||!roles.some(role=>['OWNER','ADMIN','TECH_ADMIN'].includes(role))||!perms.includes('control_panel.access'))throw Error('Owner or authorized Administrator access required.');
 state.user=session.user.id;restore();$('pt-role').textContent=roles.includes('OWNER')?'Owner':roles.includes('ADMIN')?'Administrator':'Technical Administrator';
 $('pt-gate').hidden=true;$('pt-app').hidden=false;controls();void loadDeck();
 window.CrownlightClassroomMemberships?.init?.({userId:state.user,onChange:()=>{
  const design=window.CrownlightClassroomMemberships?.selected?.();
  if(design){state.layout=design.layout;state.density=design.density;state.tutor=design.tutor;}
  draw();
 }});
 window.CrownlightClassroomPresetSync?.start?.(state.user);
 $('pt-device').value=state.device;$('pt-kind').value=state.kind;select(workspace.has(location.hash.slice(1))?location.hash.slice(1):state.id);
 if(state.saved)note('Restored local draft saved '+state.saved+'. Drafts are not synchronized across devices.');
 sb.auth.onAuthStateChange((event,s)=>{if(event==='SIGNED_OUT'||(s?.user?.id&&s.user.id!==state.user)){teardownDeck();teardownThree();state.chart?.dispose();state.chart=null;window.CrownlightPrototypeTeaching?.reset?.();window.CrownlightClassroomMemberships?.clear?.();window.CrownlightClassroomPresetSync?.clear?.();$('pt-app').hidden=true;$('pt-gate').hidden=false;$('pt-gate').textContent='Session ended; sign in again.';state.user=null;}});
 }catch(e){$('pt-app').hidden=true;$('pt-gate').hidden=false;$('pt-gate').textContent=e?.message||'Access denied.';}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else void start();
})();
