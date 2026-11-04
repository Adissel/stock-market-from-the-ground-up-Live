/* Prototype Center v1: same production React market terminal as Labs/Academy.
 * Mocked DOM tests enforce staff gate, no duplicate React root, account-change
 * teardown, fictional question responses and no payment/progress mutations.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const html=read('prototype.html');
const source=read('assets/js/prototype-shared-learning-market-v1.js');
const home=read('src/experience/HomeMarketTerminal.tsx');
const core=read('assets/js/prototype-center-v1.js');
const css=read('assets/css/prototype-shared-learning-market-v1.css');

test('Exact homepage React chart is added inside existing staff-gated Prototype Center',()=>{
 const app=html.indexOf('<section id="pt-app" hidden');
 const preview=html.indexOf('<details id="pt-shared-learning-market"');
 const curriculum=html.indexOf('<details id="pt-curriculum-parity"');
 assert.ok(app>=0&&preview>app&&curriculum>preview);
 assert.match(html,/data-route-access="staff"/);
 assert.match(core,/\/api\/admin\?action=context/);
 assert.match(core,/control_panel\.access/);
 for(const thing of ['home-market-terminal-v1.bundle.js?v=20261104-academy1',
  'home-market-terminal-v1.css?v=20261104-academy1',
  'learning-home-market-replay-v1.css?v=20261104-realism1',
  'prototype-shared-learning-market-v1.css?v=20261103-proto1',
  'prototype-shared-learning-market-v1.js?v=20261103-proto1',
  'pt-shared-lab','pt-shared-bootcamp','pt-shared-market-host','pt-shared-question'])
  assert.ok(html.includes(thing),thing);
 const bundle=html.indexOf('home-market-terminal-v1.bundle.js');
 const init=html.indexOf('prototype-shared-learning-market-v1.js');
 assert.ok(bundle>=0&&init>bundle,'Home React module must load before staff prototype adapter');
});
test('Shared engine provides the actual homepage candle animation, not a duplicate static renderer',()=>{
 assert.match(home,/window\.CrownlightHomeMarketTerminal=Object\.freeze\(\{mountInto\}\)/);
 assert.match(home,/createRoot\(target\)/);
 assert.match(home,/root\.render\(<Terminal context=/);
 assert.match(source,/CrownlightHomeMarketTerminal/);
 assert.match(source,/api\.mountInto\(host,\{context:selected,startPaused:false\}\)/);
 for(const feature of ['partialMinute(index:number,ticks:number)','revealedBars(cfg.frame,playhead.current)',
  'Replay speed','0.1×','0.5×','3×','Timeframe','1m','3m','5m','zoomOnMouseWheel:true',
  'moveOnMouseMove:true','Open','High','Low','Close','Simulated volume'])
   assert.ok(home.includes(feature),feature);
 assert.doesNotMatch(source,/CrownlightLearningEChartsV1\.mount|createRoot\(|\.setOption\(/);
});
test('Responsive prototype layout includes safe math/source disclaimers and accessible quiz feedback',()=>{
 for(const part of ['pt-shared-market-grid','pt-shared-market-lesson',
  'pt-shared-market-host','@media(max-width:620px)','prefers-reduced-motion'])
  assert.ok(css.includes(part),part);
 assert.match(html,/Check my ungraded answer/);
 assert.match(html,/No formal grade or Lumens are used/);
 assert.match(html,/original simulated examples/);
 assert.match(html,/SIMULATED · STAFF DESIGN VIEW/);
 assert.match(html,/role="status" aria-live="polite"/);
 assert.match(html,/market=lab/);
 assert.doesNotMatch(source,/localStorage|sessionStorage|service_role|stripe|checkout|protectedAnswer|assessmentResults|marketBuy/);
});
function harness(search='?market=lab'){
 const calls=[],listeners=new Map(),nodes=new Map();
 const ids=['pt-app','pt-shared-learning-market','pt-shared-market-host',
  'pt-shared-market-status','pt-shared-lab','pt-shared-bootcamp',
  'pt-shared-stage-title','pt-shared-lesson-heading','pt-shared-lesson-copy',
  'pt-shared-feedback','pt-shared-question','pt-shared-pause','pt-shared-resume','pt-shared-replay'];
 for(const id of ids){
  const listenersFor=new Map();
  const node={id,hidden:false,open:false,isConnected:true,textContent:'',
   pressed:{},addEventListener:(name,cb)=>listenersFor.set(name,cb),
   fire:(name,event={preventDefault(){}})=>listenersFor.get(name)?.(event),
   setAttribute(name,value){this.pressed[name]=value},
   replaceChildren(){},scrollIntoView(){},reset(){},
   querySelector(){return {value:node.answer||'observed'}},answer:'observed'};
  nodes.set(id,node);
 }
 const app=nodes.get('pt-app'),details=nodes.get('pt-shared-learning-market');
 app.hidden=true;
 let observe=null;
 class Observer{constructor(cb){observe=cb}observe(target,options){calls.push(['watch',target.id,options.attributeFilter?.join(',')])}disconnect(){calls.push(['disconnect'])}}
 const window={CrownlightHomeMarketTerminal:{mountInto:(host,options)=>{
  calls.push(['mount',options.context,options.startPaused]);
  return{pause(){calls.push(['pause'])},resume(){calls.push(['resume'])},dispose(){calls.push(['dispose'])}};
 }},addEventListener:(event,cb)=>listeners.set(event,cb)};
 const document={readyState:'complete',getElementById:id=>nodes.get(id)||null};
 const location={search};
 vm.runInNewContext(source,{document,window,location,URLSearchParams,
  MutationObserver:Observer,requestAnimationFrame:cb=>cb(),console},{timeout:1500});
 return{calls,nodes,app,details,observer:()=>observe,window};
}
test('Prototype never mounts before staff auth and disposes on sign-out or access revocation',()=>{
 const h=harness();
 assert.equal(h.calls.filter(x=>x[0]==='mount').length,0);
 h.details.fire('toggle');
 assert.equal(h.calls.filter(x=>x[0]==='mount').length,0);
 h.app.hidden=false;h.observer()();
 assert.equal(h.calls.filter(x=>x[0]==='mount').length,1);
 assert.equal(h.calls.find(x=>x[0]==='mount')[1],'lab');
 h.details.fire('toggle');
 assert.equal(h.calls.filter(x=>x[0]==='mount').length,1,'Avoid double React root');
 h.app.hidden=true;h.observer()();
 assert.equal(h.calls.filter(x=>x[0]==='dispose').length,1);
 h.nodes.get('pt-shared-bootcamp').fire('click');
 assert.equal(h.calls.filter(x=>x[0]==='mount').length,1,'No mount after staff authorization ends');
});
test('Owner can switch the actual chart between Lab and Boot Camp, pause and resume safely',()=>{
 const h=harness('?market=bootcamp');h.app.hidden=false;h.observer()();
 assert.deepEqual(h.calls.filter(x=>x[0]==='mount').map(x=>x[1]),['bootcamp']);
 h.nodes.get('pt-shared-pause').fire('click');
 assert.equal(h.calls.filter(x=>x[0]==='pause').length,1);
 h.nodes.get('pt-shared-resume').fire('click');
 assert.equal(h.calls.filter(x=>x[0]==='resume').length,1);
 h.nodes.get('pt-shared-lab').fire('click');
 assert.deepEqual(h.calls.filter(x=>x[0]==='mount').map(x=>x[1]),['bootcamp','lab']);
 assert.equal(h.calls.filter(x=>x[0]==='dispose').length,1);
 h.nodes.get('pt-shared-replay').fire('click');
 assert.equal(h.calls.filter(x=>x[0]==='mount').length,3,'Replay remounts same original component');
 h.nodes.get('pt-shared-question').answer='forecast';
 h.nodes.get('pt-shared-question').fire('submit');
 assert.match(h.nodes.get('pt-shared-feedback').textContent,/Not supported/);
 h.nodes.get('pt-shared-question').answer='observed';
 h.nodes.get('pt-shared-question').fire('submit');
 assert.match(h.nodes.get('pt-shared-feedback').textContent,/Correct/);
 assert.ok(h.calls.filter(x=>x[0]==='resume').length>=2);
 h.details.open=false;h.details.fire('toggle');
 assert.equal(h.calls.filter(x=>x[0]==='dispose').length,3);
});
