import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(p,'utf8');
const lab=read('lab-player.html'),boot=read('bootcamp-academy.html');
const prototype=read('prototype.html'),classic=read('assets/js/prototype-center-v1.js');
const source=read('src/prototype/PrototypeExperiences.tsx');
const bridge=read('assets/js/crownlight-classroom-chart-bridge-v1.js');
const css=read('assets/css/crownlight-shared-classroom-v1.css');
test('Classic Prototype Lab and Boot Camp views mount exact Experience B technical chart',()=>{
 assert.match(source,/export function mountClassicClassroomChart\(/);
 assert.match(source,/sourceBars=\{available\}/);
 assert.match(source,/function PrototypeChartContextMenu\(/);
 assert.match(source,/function IndicatorDock\(/);
 assert.match(source,/function ChartCustomizer\(/);
 assert.match(classic,/module\.mountClassicClassroomChart\(host/);
 assert.match(classic,/getChartCandles\?\.\(\)/,'Never expose hidden future case bars');
 assert.match(classic,/epoch!==prototypeHomeEpoch/,'Discard stale unauthorized React mounts');
 assert.match(classic,/disposePrototypeHomeChart\(\)/);
 assert.match(prototype,/prototype-classic-shared-chart-v1\.css/);
});
test('all registered Lab and Boot Camp classrooms share visual shell without replacing their engines',()=>{
 assert.match(lab,/class="gu-shared-classroom gu-lab-member gu-teaching-wide"/);
 assert.match(boot,/class="gu-shared-classroom gu-bc-learning gu-teaching-wide"/);
 for(const html of [lab,boot]){
  assert.match(html,/crownlight-shared-classroom-v1\.css/);
  assert.match(html,/crownlight-classroom-chart-bridge-v1\.js/);
  assert.match(html,/cl-classroom-banner/);
  assert.match(html,/cl-classroom-chart-note/);
 }
 assert.match(lab,/id="lab-player-content" hidden/);
 assert.match(lab,/id="player-workspace" aria-label="Active learning stage"/);
 assert.match(lab,/id="player-mode-select"/);
 assert.match(boot,/id="academy-lab-slot"/);
 assert.match(boot,/id="academy-official-assessment"/);
 assert.match(boot,/id="academy-reflection"/);
 assert.match(css,/cl-classroom-chart-host/);
 assert.match(css,/font-size:clamp\(16px,1\.1vw,19px\)/);
 assert.match(css,/max-width:750px/);
});
test('supplemental chart does not accept grades, billing, private data or entitlements',()=>{
 assert.match(bridge,/window\.CrownlightHomeMarketTerminal\?\.mountInto/);
 assert.match(bridge,/startPaused:true/);
 assert.match(bridge,/\['blind','assessment'\]/);
 assert.match(bridge,/assessment&&!assessment\.hidden/);
 assert.match(bridge,/gate\.hidden/);
 assert.doesNotMatch(bridge,/fetch\(|supabase|localStorage|sessionStorage|service_role|\.innerHTML|POST|PATCH|grade.*save|membership.*update/i);
});
function simulate(kind){
 const events={};let mounts=0,disposals=0;
 const make=(id)=>({
  id,isConnected:true,hidden:false,open:false,value:'guided',textContent:'',
  listeners:{},addEventListener(type,fn){this.listeners[type]=fn},
  replaceChildren(){},dispatch(type){this.listeners[type]?.()}
 });
 const ids={};
 if(kind==='lab'){
  for(const id of ['cl-lab-classroom-chart','cl-lab-classroom-chart-host','cl-lab-classroom-chart-status','lab-player-content','player-mode-select','lab-player-gate'])ids[id]=make(id);
  ids['lab-player-content'].hidden=true;
 }else{
  for(const id of ['cl-bootcamp-classroom-chart','cl-bootcamp-classroom-chart-host','cl-bootcamp-classroom-chart-status','academy-workspace','academy-official-assessment'])ids[id]=make(id);
  ids['academy-workspace'].hidden=true;ids['academy-official-assessment'].hidden=true;
 }
 const target=kind==='lab'?'cl-lab-classroom-chart':'cl-bootcamp-classroom-chart';
 const gate=kind==='lab'?'lab-player-content':'academy-workspace';
 class Watch{constructor(fn){events.observe=fn}observe(){}disconnect(){}}
 const context={
  window:{CrownlightHomeMarketTerminal:{mountInto(){mounts++;return {dispose(){disposals++}}}},addEventListener(){}},
  document:{readyState:'complete',getElementById(id){return ids[id]||null}},
  MutationObserver:Watch
 };
 vm.runInNewContext(bridge,context,{timeout:1000});
 const details=ids[target];
 details.open=true;details.dispatch('toggle');
 assert.equal(mounts,0,'Never mount before authorized learning workspace visible');
 assert.equal(details.open,false,'Unauthorized open must close');
 ids[gate].hidden=false;
 details.open=true;details.dispatch('toggle');
 assert.equal(mounts,1,'One authenticated optional chart mount');
 details.dispatch('toggle');
 assert.equal(mounts,1,'No duplicate chart root on repeat toggle');
 if(kind==='lab'){ids['player-mode-select'].value='assessment';ids['player-mode-select'].dispatch('change')}
 else{ids['academy-official-assessment'].hidden=false;events.observe()}
 assert.equal(disposals,1,'Assessment boundary disposes supplemental chart');
 assert.equal(details.open,false,'Assessment cannot leave chart open');
}
test('Lab bridge fails closed on unauthorized sessions and graded modes',()=>simulate('lab'));
test('Boot Camp bridge fails closed on assessment visibility',()=>simulate('bootcamp'));
