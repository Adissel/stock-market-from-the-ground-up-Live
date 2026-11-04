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
test('Labs and Boot Camps start at one forming candle; public home alone uses simulated contextual bars',()=>{
 assert.match(home,/const FIRST_REPLAY_MINUTE=0;/);
 assert.match(home,/const playhead=useRef\(context==='home'\?HOME_INITIAL_COMPLETED_CANDLES\*TICKS_PER_MINUTE\+1:1\)/);
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
 for(const x of ['spike=i===17','i===88?0.73','i===112?-0.69','upper=','lower=','volume=','EMA 9','EMA 20','Bar-based VWAP proxy','barMaxWidth:7'])
  assert.ok(home.includes(x),x);
 assert.match(home,/barProxyVWAP\(bars\)/);
 assert.doesNotMatch(home,/supabase|service_role|access_token|WebSocket|\/api\/market-data|fetch\(/i);
});
test('only the public homepage varies automatic speed between 0.1x and 0.4x',()=>{
 assert.match(home,/const \[speed,setSpeed\]=useState\(context==='home'\?0\.1:1\)/);
 assert.match(home,/const actualSpeed=isPublicHome\?/);
 assert.match(home,/\[0\.1,0\.2,0\.4,0\.3\]\[Math\.floor\(playhead\.current\/TICKS_PER_MINUTE\)%4\]/);
 assert.match(home,/carry\+=elapsed\*actualSpeed/);
 assert.match(home,/0\.1×–0\.4× PLAYBACK/);
 assert.match(home,/isPublicHome\?<label className="cl-react-home-type"/);
 assert.match(home,/setPlaying\(x=>!x\)/);
});
test('actual Prototype Center workspaces and all eight experiences replace static primary charts',()=>{
 assert.match(central,/function mountedPrototypeHomeChart\(\)/);
 assert.match(central,/\['labs','bootcamps'\]\.includes\(state\.id\)/);
 assert.match(central,/module\.mountClassicClassroomChart\(host/);
 assert.match(central,/caseBars:disclosedClassicBars\(\)/);
 assert.match(central,/getChartCandles\?\.\(\)/);
 assert.match(proto,/export function mountClassicClassroomChart\(/);
 assert.match(proto,/function ClassicClassroomChart\(/);
 assert.match(proto,/sourceBars=\{available\}/);
 assert.match(protoHtml,/prototype-classic-shared-chart-v1\.css/);
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
test('homepage mounts the same dimensional map as protected prototype without exposing staff navigation',()=>{
 assert.match(index,/id="learning-constellation"/);
 assert.match(index,/id="pt-experiences-root"/);
 assert.match(index,/prototype-learning-constellation-v1\.css\?v=20261104-homegalaxy1/);
 assert.match(index,/home-academy-wide-chart-galaxy-v1\.css\?v=20261104-homegalaxy1/);
 assert.match(index,/home-learning-constellation-v1\.js\?v=20261104-homegalaxy1/);
 assert.doesNotMatch(index,/data-home-stage="/,'Replace old nine-button teaser, not keep a second map');
 assert.match(constellation,/mountLearningConstellation\(host,\{publicPreview:true\}\)/);
 assert.match(constellation,/prototype-learning-constellation-v1\.js/);
 assert.match(owner,/export function mountLearningConstellation\(host,options=\{\}\)/);
 assert.match(owner,/if\(publicPreview\)/);
 assert.match(owner,/side\.replaceChildren\(\)/,'Hide Owner-only navigation on public site');
 for(const word of ['getSession','service_role','Bearer ','assessmentKey','stripe','memberProgress'])
  assert.ok(!constellation.includes(word),word);
 assert.match(owner,/\/prototype\.html\?experience=a&layout=foundations/,'Prototype still supports owner-only preview on protected route');
});
test('public map retains the actual galaxy canvas, four modes, and safe chart/marketing presentation',()=>{
 const galaxy=read('assets/js/prototype-constellation-galaxy-v2.js');
 const prototypeCSS=read('assets/css/prototype-learning-constellation-v1.css');
 const wide=read('assets/css/home-academy-wide-chart-galaxy-v1.css');
 for(const mode of ['journey','labs','academy','tutor'])
  assert.ok(owner.includes('data-mode="'+mode+'"'),'Missing real prototype mode '+mode);
 assert.match(owner,/mountConstellationGalaxy\(galaxyCanvas,\(\)=>state\)/);
 assert.match(galaxy,/webgl/);
 assert.match(prototypeCSS,/#pt-experiences-root \.lc-app/);
 assert.match(wide,/\.gu-premium-home \.gu-home-stage \.wrap\.gu-home-stage-grid/);
 assert.match(wide,/grid-template-columns:minmax\(0,1\.02fr\) minmax\(0,1\.08fr\)/);
 assert.match(wide,/\.cl-react-plot\{height:490px!important/);
 assert.match(index,/id="learning-constellation"/);
 assert.doesNotMatch(index,/No purchase is required to start\. Registration requires age 18\+ and email verification/);
 assert.match(index,/Try Free Chart Practice/);
 assert.match(read('assets/css/home-market-terminal-v1.css'),/cl-react-terminal--home \.cl-react-progress/);
});
