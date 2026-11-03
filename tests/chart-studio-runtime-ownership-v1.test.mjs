/* Chart Studio: actual async renderer functions with deferred library promises.
 * No account, payment, or provider operations.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync('assets/js/crownlight-chart-tiers-v1.js','utf8');
const build=readFileSync('scripts/build-pages.sh','utf8');
function slice(start,end){
 const a=source.indexOf(start),b=source.indexOf(end,a);
 assert.ok(a>=0&&b>a,'Missing engine source boundary '+start);
 return source.slice(a,b);
}
const program=slice('function stopCharts(){','const requirements=')+'\n'+
 slice('async function choose(tier){','function createControls(){')+
 '\nthis.actions={choose,stopCharts};';
function future(){let ok,fail;const promise=new Promise((a,b)=>{ok=a;fail=b});return {promise,ok,fail}}
function rig(){
 const pending=[],echarts=[],mounted=[],events=[];let unmounts=0;
 const panels={replaceChildren(){}},enhanced={hidden:true,querySelector:()=>panels};
 const state={visible:['STANDARD','ADVANCED','PROFESSIONAL','ECHARTS'],
  allowed:['STANDARD','ADVANCED','PROFESSIONAL'],verified:true,
  tier:'PROFESSIONAL',selected:'STANDARD',version:0,charts:[],bars:[],
  resizeFrame:0,resizeObserver:null,
  view:{querySelector:key=>key==='[data-cl-tier-advanced]'?enhanced:panels}};
 const scope={state,document:{body:{classList:{add(){},remove(){}}}},
  window:{CrownlightEChartsStudio:{
    unmount(){unmounts++},mount(){const f=future();echarts.push(f);return f.promise}},
   dispatchEvent:e=>events.push(e.detail.tier)},
  CustomEvent:class {constructor(type,opts){this.type=type;this.detail=opts.detail}},
  status(){},renderChoices(){enhanced.hidden=state.selected==='STANDARD'},
  isEntitled:t=>state.verified&&state.allowed.includes(t==='ECHARTS'?'STANDARD':t),
  loadEngine(){const f=future();pending.push(f);return f.promise},
  makeView:(id,type)=>mounted.push({id,type}),
  initOne:(id,type)=>({id,type,host:{parentElement:{}},chart:{resize(){}}}),
  balancePanels(){},updateCompactReadout(){},
  ResizeObserver:undefined,cancelAnimationFrame(){},requestAnimationFrame(){return 1}};
 vm.runInNewContext(program,scope,{timeout:1000});
 return {state,pending,echarts,mounted,events,actions:scope.actions,unmounts:()=>unmounts};
}
test('Standard selection cancels pending Professional chart',async()=>{
 const x=rig(),old=x.actions.choose('PROFESSIONAL');
 assert.equal(x.pending.length,1);
 await x.actions.choose('STANDARD');
 x.pending[0].ok();await old;
 assert.equal(x.state.selected,'STANDARD');
 assert.equal(x.mounted.length,0);
 assert.equal(x.state.charts.length,0);
 assert.deepEqual(x.events,['STANDARD']);
});
test('old rejected Professional load cannot clear newer Advanced chart',async()=>{
 const x=rig(),old=x.actions.choose('PROFESSIONAL');
 const newer=x.actions.choose('ADVANCED');
 x.pending[0].fail(Error('Old library failed'));await old;
 assert.equal(x.state.selected,'ADVANCED');
 x.pending[1].ok();await newer;
 assert.equal(x.state.charts.length,1);
 assert.deepEqual(x.events,['ADVANCED']);
});
test('revoked chart permission cancels pending enhanced renderer',async()=>{
 const x=rig(),old=x.actions.choose('PROFESSIONAL');
 x.state.verified=false;x.state.selected='STANDARD';x.actions.stopCharts();
 x.pending[0].ok();await old;
 assert.equal(x.mounted.length,0);
 assert.equal(x.state.charts.length,0);
});
test('stale ECharts response cannot dispose newer Standard view',async()=>{
 const x=rig(),old=x.actions.choose('ECHARTS');
 assert.equal(x.echarts.length,1);
 await x.actions.choose('STANDARD');const previous=x.unmounts();
 x.echarts[0].ok(false);await old;
 assert.equal(x.unmounts(),previous);
 assert.equal(x.state.selected,'STANDARD');
});
test('production build requires runtime ownership tests',()=>{
 assert.match(build,/node --test tests\/chart-studio-runtime-ownership-v1\.test\.mjs/);
});
