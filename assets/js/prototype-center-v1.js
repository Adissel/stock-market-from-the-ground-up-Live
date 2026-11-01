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
 '3d':'Review 3D requirements; V1 uses 2D only. ECharts GL is not installed.',
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
 '3d':[['3D evaluation','ECharts GL feasibility is future engineering work.'],['Avatars','Evaluate a dedicated 3D engine instead of ECharts.']]
};
const $=id=>document.getElementById(id),create=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=String(text);if(cls)e.className=cls;return e;};
const state={id:'classroom',mode:'Lab',device:'desktop',kind:'candlestick',stage:0,tier:'Standard',layout:'Balanced',density:'Comfortable',tutor:'Right',adminGroup:adminGroups[0],revealed:8,chart:null,resize:null,user:null,checks:[],saved:null};
const b=(name,fn,pressed)=>{const e=create('button',name);e.type='button';if(pressed!==undefined)e.setAttribute('aria-pressed',String(pressed));e.addEventListener('click',fn);return e;};
const note=v=>{$('pt-feedback').textContent=v;};
function buttons(values,selected,change){const row=create('div',undefined,'pt-options');for(const v of values)row.append(b(v,()=>change(v),selected===v));return row;}
function card(name,desc){const div=create('article',undefined,'pt-tile');div.append(create('strong',name),create('p',desc));return div;}
function grid(items){const div=create('div',undefined,'pt-grid');for(const [title,desc] of items)div.append(card(title,desc));return div;}
function nav(query=''){const host=$('pt-nav');host.replaceChildren();for(const [group,items] of groups){const list=items.filter(([,name])=>(group+' '+name).toLowerCase().includes(query.toLowerCase()));if(!list.length)continue;const section=create('section');section.append(create('h3',group));for(const [id,name] of list){const action=b(name,()=>{location.hash=id;select(id,true)});action.setAttribute('aria-current',id===state.id?'page':'false');section.append(action);}host.append(section);}}
function classroom(root){
 const area=create('section',undefined,'pt-card');area.append(create('h3','Classroom mode'));
 area.append(buttons(['Lab','Boot Camp'],state.mode,v=>{state.mode=v;draw()}));
 const options=create('section',undefined,'pt-card');options.append(create('h3','Classroom layout designer'));
options.append(create('p','Layout preset'));options.append(buttons(['Balanced','Reading-first','Chart-first'],state.layout,v=>{state.layout=v;draw()}));
options.append(create('p','Content density'));options.append(buttons(['Comfortable','Compact'],state.density,v=>{state.density=v;draw()}));
options.append(create('p','Instructor placement'));options.append(buttons(['Right','Bottom'],state.tutor,v=>{state.tutor=v;draw()}));
const panes=grid([['Teaching pane','First-principles lesson content, numerical worked examples and guided practice.'],['Talia Mercer','Free explanations, contextual guidance, diagnostic feedback and instructional retries.'],['Chart laboratory','Fictional candlesticks, indicators and instructor annotations.']]);
panes.classList.add('pt-classroom');panes.dataset.layout=state.layout;panes.dataset.density=state.density;panes.dataset.tutor=state.tutor;
root.append(area,options,panes);
 window.CrownlightClassroomMemberships?.render?.(root);
 const stage=create('section',undefined,'pt-card');stage.append(create('h3','Shared nine-stage learning sequence'));
 const box=create('div',undefined,'pt-stage');box.append(create('strong','Stage '+(state.stage+1)+' / 9 — '+stages[state.stage]));
 const explain=[
 'Identify objectives and prerequisites before introducing technical terms.',
 'Define all terms, chart axes and units before asking for decisions.',
 'Show each calculation, its inputs, units and intermediate steps.',
 'Reveal the fictional chart with a guided instructor walkthrough.',
 'Ask a focused conceptual question; explain why alternatives fail.',
 'Let the student practice with guidance and diagnostic feedback.',
 'Preview the protected assessment shell; do not expose private answer keys.',
 'Apply the concept to a distinct, unseen fictional scenario.',
 'Review errors, provide remediation and assess readiness for another attempt.'
 ];box.append(create('p',explain[state.stage]));stage.append(box);
 const row=create('div',undefined,'pt-row'),prev=b('Previous stage',()=>{state.stage--;draw()}),next=b('Next stage',()=>{state.stage++;draw()});prev.disabled=state.stage<=0;next.disabled=state.stage>=8;row.append(prev,next);stage.append(row);
 if(state.mode==='Boot Camp')stage.append(card('Boot Camp day structure','Day-level navigation, distinct case sets and completion evidence use the same protected engine.'));
 root.append(stage,create('p','Synthetic teaching shell only. No assessment answer keys or member progress are loaded.','pt-note'));
}
function admin(root){root.append(create('h3','Approved eight-group Admin taxonomy'));root.append(buttons(adminGroups,state.adminGroup,v=>{state.adminGroup=v;draw()}));root.append(grid([[state.adminGroup,'Read-only layout experiment; changes must use the established authorized Admin workflow.'],['Authority','No role, entitlement, price, payment, security or membership write is permitted from this page.']]));}
function feature(root){root.append(grid(features[state.id]||[]));
 if(state.id==='studio'){root.append(create('h3','Chart Studio membership tier'));root.append(buttons(['Standard','Advanced','Professional'],state.tier,v=>{state.tier=v;draw()}));}
 if(state.id==='replay')root.append(create('p','The shared role-protected case component below controls fictional candle-by-candle replay and the visible chart boundary.','pt-note'));
 if(state.id==='3d')root.append(create('p','This experiment remains two-dimensional; no actual 3D functionality is claimed.','pt-note'));
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
function draw(){const root=$('pt-content');root.replaceChildren();root.dataset.device=state.device;
 window.CrownlightPrototypeTeaching?.setActiveTab?.(state.id);
 if(state.id==='classroom')classroom(root);else if(state.id==='admin')admin(root);else if(state.id==='test')test(root);else if(state.id==='release')release(root);
 else if(state.id==='overview')root.append(grid([['23 workspaces','18 capability tabs and 5 shared workspaces.'],['Synthetic charts','Deterministic fictional examples using local ECharts.'],['Permission boundary','Owner or Administrator context required.'],['Release boundary','No production writes or member records.']]));
 else feature(root);
 if(window.CrownlightPrototypeTeaching)void window.CrownlightPrototypeTeaching.mount(root,state.id,state.mode);
 void plot();
}
function select(id,focus=false){if(!workspace.has(id))return;state.id=id;const x=workspace.get(id);$('pt-title').textContent=x.name;$('pt-group').textContent=x.g;$('pt-desc').textContent=descriptions[id];nav($('pt-search').value);draw();if(focus)$('pt-title').focus();}
function candles(){const secured=window.CrownlightPrototypeTeaching?.getChartCandles?.();if(Array.isArray(secured)&&secured.length)return secured;let v=100;const result=[];for(let i=0;i<24;i++){const open=v;v=Math.max(12,v+2.4*Math.sin(i*.71)+1.2*Math.cos(i*.39));result.push({t:'T'+String(i+1).padStart(2,'0'),open:+open.toFixed(2),close:+v.toFixed(2),high:+(Math.max(open,v)+1.6).toFixed(2),low:+(Math.min(open,v)-1.4).toFixed(2),volume:500+((i*97)%700)});}return state.id==='replay'?result.slice(0,state.revealed):result;}
async function plot(){
 try{
  const E=await window.CrownlightECharts.load();if($('pt-app').hidden)return;
  if(!state.chart){state.chart=E.init($('pt-chart'),null,{renderer:'canvas'});state.resize=new ResizeObserver(()=>state.chart?.resize());state.resize.observe($('pt-chart'));}
  const data=candles(),labels=data.map(x=>x.t),member=window.CrownlightClassroomMemberships;
  const appearance=member?.chartOptions?.(data);
  const chartHost=$('pt-chart');
  if(appearance&&chartHost){const height=appearance.height+'px';if(chartHost.style.height!==height){chartHost.style.height=height;state.chart.resize();}}
  const base={animation:false,backgroundColor:'transparent',textStyle:{color:'#d7e7ef'},tooltip:{trigger:'axis',renderMode:'richText',formatter:appearance?.tooltip},grid:{left:52,right:25,top:35,bottom:57},xAxis:{type:'category',data:labels,axisLabel:{color:'#b8d0dd'}},yAxis:{type:'value',scale:true,axisLabel:{color:'#b8d0dd'},splitLine:appearance?.axisSplit||{lineStyle:{color:'#274355'}}},dataZoom:[{type:'inside'},{type:'slider',bottom:10,height:18,textStyle:{color:'#ccddea'}}]};
  if(state.kind==='candlestick')base.series=[{name:'Fictional OHLC',type:'candlestick',data:data.map(x=>[x.open,x.close,x.low,x.high]),itemStyle:appearance?.itemStyle||{color:'#46c1a4',color0:'#db7474',borderColor:'#46c1a4',borderColor0:'#db7474'},barWidth:appearance?.barWidth}];
  if(state.kind==='line')base.series=[{name:'Fictional close',type:'line',showSymbol:false,data:data.map(x=>x.close),lineStyle:{color:'#63c2df'}}];
  if(state.kind==='bar')base.series=[{name:'Fictional volume',type:'bar',data:data.map(x=>x.volume),itemStyle:{color:'#5c9cda'}}];
  if(state.kind==='heatmap'){base.xAxis={type:'category',data:labels};base.yAxis={type:'category',data:['Knowledge','Recognition','Decision','Process']};base.grid.bottom=94;base.visualMap={min:0,max:100,calculable:true,orient:'horizontal',bottom:28,textStyle:{color:'#e0eef7'}};base.series=[{type:'heatmap',name:'Fictional competency',data:data.flatMap((x,i)=>[0,1,2,3].map(j=>[i,j,30+(i*13+j*11)%69]))}];}
  state.chart.setOption(base,{notMerge:true});
  state.chart.off('click');
  state.chart.on('click',event=>{if(Number.isInteger(event?.dataIndex))member?.inspector?.($('pt-bar-inspector'),data,event.dataIndex)});
  member?.inspector?.($('pt-bar-inspector'),data,data.length-1);
  $('pt-chart-status').textContent='Interactive '+state.kind+' — detailed fictional OHLC, selectable inspection and membership-specific visual design. Not live market data.';
 }catch(e){$('pt-chart-status').textContent='ECharts unavailable: '+(e?.message||'Renderer error');}
}
function save(){window.CrownlightClassroomMemberships?.save?.();try{const obj={id:state.id,mode:state.mode,device:state.device,kind:state.kind,stage:state.stage,tier:state.tier,layout:state.layout,density:state.density,tutor:state.tutor,adminGroup:state.adminGroup,revealed:state.revealed,saved:new Date().toISOString()};localStorage.setItem('crownlight:prototype:v1:'+state.user,JSON.stringify(obj));state.saved=obj.saved;note('Saved locally for this administrator in this browser. No server records changed.');}catch{note('Local draft could not be saved.');}}
function restore(){try{const data=JSON.parse(localStorage.getItem('crownlight:prototype:v1:'+state.user)||'null');if(!data)return;for(const k of ['mode','device','kind','stage','tier','layout','density','tutor','adminGroup','revealed','saved'])if(Object.hasOwn(data,k))state[k]=data[k];if(workspace.has(data.id))state.id=data.id;if(!['desktop','tablet','mobile'].includes(state.device))state.device='desktop';if(!['candlestick','bar','line','heatmap'].includes(state.kind))state.kind='candlestick';state.stage=Math.max(0,Math.min(8,Number(state.stage)||0));if(!['Balanced','Reading-first','Chart-first'].includes(state.layout))state.layout='Balanced';if(!['Comfortable','Compact'].includes(state.density))state.density='Comfortable';if(!['Right','Bottom'].includes(state.tutor))state.tutor='Right';}catch{}}
/* Refresh staff authority when a previously open private workbench regains focus.
 * Missing permissions or provider failures fail closed; no stale UI remains visible. */
let checkingStaff=false;
async function recheckStaffAccess(){
 if(!state.user||checkingStaff)return;
 checkingStaff=true;$('pt-app').hidden=true;$('pt-gate').hidden=false;
 $('pt-gate').textContent='Revalidating administrative permissions…';
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
  $('pt-gate').hidden=true;$('pt-app').hidden=false;state.chart?.resize();
 }catch(error){
  state.resize?.disconnect();state.chart?.dispose();state.chart=null;
  window.CrownlightPrototypeTeaching?.reset?.();window.CrownlightClassroomMemberships?.clear?.();state.user=null;
  $('pt-app').hidden=true;$('pt-gate').hidden=false;
  $('pt-gate').textContent=error?.message||'Staff authorization unavailable.';
 }finally{checkingStaff=false;}
}
function controls(){
 window.addEventListener('focus',()=>void recheckStaffAccess());
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)void recheckStaffAccess();});
 $('pt-search').addEventListener('input',e=>nav(e.target.value.trim()));
 $('pt-device').addEventListener('change',e=>{state.device=e.target.value;draw()});
 $('pt-kind').addEventListener('change',e=>{state.kind=e.target.value;void plot()});
 $('pt-save').addEventListener('click',save);
 $('pt-reset').addEventListener('click',()=>{window.CrownlightClassroomMemberships?.reset?.();state.mode='Lab';state.device='desktop';state.kind='candlestick';state.stage=0;state.tier='Standard';state.layout='Balanced';state.density='Comfortable';state.tutor='Right';state.revealed=8;$('pt-device').value=state.device;$('pt-kind').value=state.kind;draw();note('Reset local controls only.');});
 window.addEventListener('hashchange',()=>select(location.hash.slice(1)||state.id));
 window.addEventListener('crownlight:prototype-case-change',()=>{void plot()});
 window.addEventListener('pagehide',()=>{state.resize?.disconnect();state.chart?.dispose();state.chart=null;window.CrownlightPrototypeTeaching?.reset?.();window.CrownlightClassroomMemberships?.clear?.();});
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
 $('pt-gate').hidden=true;$('pt-app').hidden=false;controls();
 window.CrownlightClassroomMemberships?.init?.({userId:state.user,onChange:()=>{
  const design=window.CrownlightClassroomMemberships?.selected?.();
  if(design){state.layout=design.layout;state.density=design.density;state.tutor=design.tutor;}
  draw();
 }});
 $('pt-device').value=state.device;$('pt-kind').value=state.kind;select(workspace.has(location.hash.slice(1))?location.hash.slice(1):state.id);
 if(state.saved)note('Restored local draft saved '+state.saved+'. Drafts are not synchronized across devices.');
 sb.auth.onAuthStateChange((event,s)=>{if(event==='SIGNED_OUT'||(s?.user?.id&&s.user.id!==state.user)){state.chart?.dispose();state.chart=null;window.CrownlightPrototypeTeaching?.reset?.();window.CrownlightClassroomMemberships?.clear?.();$('pt-app').hidden=true;$('pt-gate').hidden=false;$('pt-gate').textContent='Session ended; sign in again.';state.user=null;}});
 }catch(e){$('pt-app').hidden=true;$('pt-gate').hidden=false;$('pt-gate').textContent=e?.message||'Access denied.';}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else void start();
})();
