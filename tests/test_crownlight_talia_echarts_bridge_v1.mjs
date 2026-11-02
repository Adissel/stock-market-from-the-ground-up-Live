/* No-pay source/runtime contract. The chart-to-Talia bridge never authenticates
 * a learning entitlement by trusting the event, and never shows future bars.
 * Actual browser and authenticated multi-account acceptance are separate.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(p,'utf8');
for(const file of ['simulator.html','verified-replay.html']){
 const html=read(file);
 assert(html.includes('id="crownlight-talia-echarts-visual"'));
 for(const asset of ['crownlight-visual-kit-v1.js','crownlight-talia-echarts-bridge-v1.js'])
  assert(html.includes(asset),file+' must load '+asset);
 assert(html.indexOf('crownlight-visual-kit-v1.js')<
   html.indexOf('crownlight-talia-echarts-bridge-v1.js'));
}
const source=read('assets/js/crownlight-talia-echarts-bridge-v1.js');
assert.doesNotMatch(source,/\bfetch\s*\(|\blocalStorage\b|\bsessionStorage\b|\binnerHTML\b/,
 'No own data read, private cache or raw HTML injection');
const listeners=new Map(),put=(name,cb)=>{listeners.set(name,cb)};
class Node{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.attrs={};this.hidden=false;this.textContent='';this.scope='';}
 append(...xs){this.children.push(...xs);}
 replaceChildren(...xs){this.children=[...xs]}
 setAttribute(k,v){this.attrs[k]=String(v)}
 getAttribute(k){return this.attrs[k]}
}
const plot=new Node('div'),body=new Node('tbody'),status=new Node('p'),teaching=new Node('div');
const host={querySelector:s=>({
 '[data-talia-echarts-plot]':plot,
 '[data-talia-echarts-values]':body,
 '[data-talia-echarts-status]':status,
 '[data-talia-echarts-teaching]':teaching
})[s]};
const document={getElementById:id=>id==='crownlight-talia-echarts-visual'?host:null,
 createElement:name=>new Node(name)};
const authListeners=[];
let userId='member-A';
const auth={
 getSession:async()=>userId?{data:{session:{user:{id:userId}}}}:{data:{session:null}},
 getUser:async()=>userId?{data:{user:{id:userId}}}:{data:{user:null},error:{message:'signed out'}},
 onAuthStateChange:fn=>{authListeners.push(fn);return {data:{subscription:{unsubscribe(){}}}}}
};
let charts=[],instances=0;
const window={
 addEventListener:put,
 matchMedia:()=>({matches:true}),
 getSupabaseClient:async()=>({auth}),
 CrownlightECharts:{load:async()=>({init:()=>{
  const chart={option:null,disposed:false,setOption(v){this.option=v},resize(){},dispose(){this.disposed=true}};
  charts.push(chart);instances++;return chart;
 }})}
};
const context=vm.createContext({window,document,globalThis:window});
for(const path of [
 'assets/js/crownlight-indicator-math-v2.js',
 'assets/js/crownlight-chart-tutor-v1.js',
 'assets/js/crownlight-visual-kit-v1.js',
 'assets/js/crownlight-talia-echarts-bridge-v1.js'
])vm.runInContext(read(path),context,{filename:path,timeout:5000});
assert.equal(window.CrownlightVisualKitV1.version,'1.1.0');
const api=window.CrownlightTaliaEChartsBridgeV1;
const flush=async()=>{for(let i=0;i<15;i++)await Promise.resolve()};
const base=1710000000000;
const bars=Array.from({length:25},(_,i)=>({
 timestamp:base+i*60000,open:100+i,high:101.5+i,
 low:99.5+i,close:101+i,volume:100+i
}));
const notify=detail=>{listeners.get('crownlight:revealed-bars')({detail})};
notify({source:'fictional',bars:bars.slice(0,5)});await flush();
assert.equal(api.getStatus().visibleCount,5);
assert.equal(api.getStatus().memberVerified,true);
assert.equal(body.children.length,5);
assert.match(body.children[2].children[1].textContent,/Warm-up/);
assert.equal(charts.at(-1).option.series.length,3);
assert.equal(charts.at(-1).option.series[0].data.length,5);
assert(charts.at(-1).option.series.every(s=>s.data.every(p=>p[0]<=4)));
assert.match(teaching.children.at(-1).textContent,/no future/i);
notify({source:'fictional',bars});await flush();
assert.equal(api.getStatus().visibleCount,25);
assert.equal(charts.at(-1).option.series[0].data.length,25);
assert(charts.at(-1).option.series.every(s=>s.data.every(p=>p[0]<=24)));
assert.notEqual(body.children[2].children[1].textContent,'Warm-up / unavailable');
const malformed=[...bars,{...bars.at(-1),timestamp:bars.at(-1).timestamp}];
notify({source:'fictional',bars:malformed});await flush();
assert.equal(api.getStatus().visibleCount,0);
assert.equal(body.children.length,0);
notify({source:'fictional',bars});await flush();
assert.equal(api.getStatus().visibleCount,25);
userId=null;for(const fn of authListeners)fn('SIGNED_OUT',{user:null});
assert.equal(api.getStatus().memberVerified,false);
assert.equal(api.getStatus().visibleCount,0);
assert.equal(body.children.length,0);
notify({source:'fictional',bars});await flush();
assert.equal(api.getStatus().visibleCount,0,'Signed-out member must not display forged reveal event');
userId='member-B';
notify({source:'fictional',bars:bars.slice(0,9)});await flush();
assert.equal(api.getStatus().visibleCount,9);
// Exercise a switch where a delayed Auth callback has not yet fired.
userId='member-C';
notify({source:'fictional',bars:bars.slice(0,6)});await flush();
assert.equal(api.getStatus().visibleCount,6);
assert.equal(api.getStatus().memberVerified,true);
listeners.get('crownlight:member-changed')();
assert.equal(api.getStatus().visibleCount,0);
assert.equal(api.getStatus().memberVerified,false);
console.log('PASS chart-Talia bridge: source math, warmup, strict visible-only overlays, malformed bars, Supabase auth and account-change disposal');
