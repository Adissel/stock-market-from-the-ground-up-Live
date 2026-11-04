import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const home=read('src/experience/HomeMarketTerminal.tsx');
const proto=read('src/prototype/PrototypeExperiences.tsx');
const central=read('assets/js/prototype-center-v1.js');
const index=read('index.html');
const protoHtml=read('prototype.html');
const constellation=read('assets/js/home-learning-constellation-v1.js');
const owner=read('assets/js/prototype-learning-constellation-v1.js');
const css=read('assets/css/home-learning-constellation-v1.css');
test('all shared charts start from one, and only one, fictional forming candle',()=>{
 assert.match(home,/const FIRST_REPLAY_MINUTE=0;/);
 assert.match(home,/const playhead=useRef\(1\)/);
 assert.match(home,/const minutes=DATA\.slice\(0,first\+Math\.floor\(safe\/TICKS_PER_MINUTE\)\)/);
 assert.match(home,/if\(next<DATA\.length\)minutes\.push\(partialMinute\(next,safe%TICKS_PER_MINUTE\)\)/);
 assert.match(proto,/\[reveal,setReveal\]=useState\(1\)/);
 assert.match(proto,/\[focus,setFocus\]=useState\(0\)/);
 assert.match(proto,/const context:Bar\[\]=\[\],offset=context\.length/);
 assert.doesNotMatch(home,/FIRST_REPLAY_MINUTE=100/);
});
test('original market-like candles provide volatility regimes and moving studies with no feed',()=>{
 assert.match(home,/seed=773217/);
 assert.match(home,/Math\.imul\(seed,1664525\)/);
 assert.match(home,/const regimes=\[/);
 for(const x of ['spike=i===17','i===88?0.73','i===112?-0.69','upper=','lower=','volume=','EMA 9','EMA 20','Bar-based VWAP proxy','barMaxWidth:9'])
  assert.ok(home.includes(x),x);
 assert.match(home,/barProxyVWAP\(bars\)/);
 assert.doesNotMatch(home,/supabase|service_role|access_token|WebSocket|\/api\/market-data|fetch\(/i);
});
test('only the public homepage automatically alternates 0.1x and 0.5x',()=>{
 assert.match(home,/const \[speed,setSpeed\]=useState\(context==='home'\?0\.1:1\)/);
 assert.match(home,/const actualSpeed=isPublicHome\?/);
 assert.match(home,/Math\.floor\(playhead\.current\/TICKS_PER_MINUTE\)%2===0\?0\.1:0\.5/);
 assert.match(home,/actualSpeed\);/);
 assert.match(home,/0\.1× ↔ 0\.5× per completed candle/);
 assert.match(home,/isPublicHome\?<div className="cl-react-home-speed"/);
 assert.match(home,/setPlaying\(x=>!x\)/);
});
test('actual Prototype Center workspaces and all eight experiences replace static primary charts',()=>{
 assert.match(central,/function mountedPrototypeHomeChart\(\)/);
 assert.match(central,/\['labs','bootcamps'\]\.includes\(state\.id\)/);
 assert.match(central,/window\.CrownlightHomeMarketTerminal\.mountInto\(chartHost/);
 assert.match(central,/disposePrototypeHomeChart\(\)/);
 assert.match(central,/if\(state\.chart\)\{state\.resize\?\.disconnect/);
 assert.match(proto,/function HomeMarketEmbed\(/);
 assert.match(proto,/\(window as ChartWindow\)\.CrownlightHomeMarketTerminal\?\.mountInto/);
 assert.match(proto,/const displayChart=<div className="cx-lp-card cx-lp-visual">/);
 assert.match(proto,/<HomeMarketEmbed key=\{selected\} context=\{selected===/);
 assert.match(proto,/<HomeMarketEmbed context="lab"\/>/);
 assert.match(protoHtml,/id="pt-chart" role="region"/);
 for(const id of ['foundations','indicator','replay','tape','scanner','risk','filings','academy'])
  assert.ok(proto.includes("id:'"+id+"'"),id);
});
test('public constellation shows nine stages without opening protected owner metadata',()=>{
 assert.match(index,/id="learning-constellation"/);
 assert.equal((index.match(/data-home-stage="/g)||[]).length,9);
 assert.match(index,/OUR TEACHING STYLE/);
 assert.match(index,/home-learning-constellation-v1\.js\?v=20261104-showcase1/);
 assert.match(css,/@media\(max-width:450px\)/);
 assert.match(owner,/\/index\.html#learning-constellation/);
 assert.match(owner,/\/prototype\.html\?experience=a&layout=foundations/);
 for(const word of ['supabase','getSession','service_role','Bearer ','assessmentKey','stripe','memberProgress'])
  assert.ok(!constellation.includes(word),word);
 assert.match(index,/419<\/b> catalogued Labs/);
 assert.match(index,/10<\/b> Boot Camp paths/);
});
test('constellation public buttons change teaching description and do not generate grades',()=>{
 const nodes=new Map();
 function el(id){return {id,textContent:'',attributes:{},dataset:{},handlers:{},
  setAttribute(k,v){this.attributes[k]=v},addEventListener(k,fn){this.handlers[k]=fn},
  click(){this.handlers.click?.()}}}
 const root=el('learning-constellation'),buttons=Array.from({length:9},(_,i)=>{const b=el('b'+i);b.dataset.homeStage=String(i);return b});
 const kicker=el('kicker');root.querySelectorAll=()=>buttons;root.querySelector=()=>kicker;
 nodes.set('learning-constellation',root);
 for(const id of ['gu-lc-public-selected','gu-lc-public-explain','gu-lc-public-action'])nodes.set(id,el(id));
 const document={readyState:'complete',getElementById:id=>nodes.get(id)};
 vm.runInNewContext(constellation,{document,console},{timeout:1000});
 buttons[2].click();assert.equal(buttons[2].attributes['aria-pressed'],'true');
 assert.equal(buttons[0].attributes['aria-pressed'],'false');
 assert.match(nodes.get('gu-lc-public-selected').textContent,/Experiment/);
 buttons[5].click();assert.match(nodes.get('gu-lc-public-explain').textContent,/protected/);
});
