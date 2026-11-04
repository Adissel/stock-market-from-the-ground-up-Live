import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
require('../assets/js/learning-indicators-v1.js');
require('../assets/js/learning-quant-studies-v1.js');
const studies=require('../assets/js/crownlight-indicator-experiments-v1.js');
const old=require('../assets/js/learning-indicators-v1.js');
const read=p=>readFileSync(p,'utf8');
const approx=(a,b)=>assert(Math.abs(a-b)<1e-9,String(a)+' != '+String(b));
const prices=studies.fixtures.slice();
for(const kind of ['ema','rsi','macd','bollinger']){
 for(let n=8;n<=12;n++){
  test('P2 '+kind+' does not revise earlier completed observations when one new close appears after '+n,()=>{
   const base=studies.calculate(kind,prices.slice(0,n));
   const extended=studies.calculate(kind,[...prices.slice(0,n),99.25]);
   assert(base&&extended,'Both datasets must satisfy the authored warmup');
   for(let j=0;j<base.lines.length;j++){
    assert.equal(base.lines[j].name,extended.lines[j].name);
    assert.deepEqual(base.lines[j].data,extended.lines[j].data.slice(0,n));
   }
  });
 }
}
for(const period of [2,3,4,5]){
 for(const kind of ['ema','rsi','macd','bollinger']){
  test('P2 '+kind+' yields finite numbers with declared period '+period,()=>{
   const out=studies.calculate(kind,prices,{period});
   assert(out&&Number.isFinite(out.current));
   assert(out.lines.every(line=>line.data.every(n=>n===null||Number.isFinite(n))));
   assert(out.steps.every((x,i)=>x.close===prices[i]));
   assert.equal(out.source,'fictional_authored_completed_closes');
  });
 }
}
test('EMA workshop matches the canonical SMA-seeded Learning Indicators engine',()=>{
 const a=studies.calculate('ema',prices,{period:4});
 assert.deepEqual(a.lines[1].data,old.ema(prices,4));
 approx(a.detail.alpha,2/5);
 approx(a.detail.seed,prices.slice(0,4).reduce((a,b)=>a+b,0)/4);
});
test('RSI workshop matches Wilder smoothing and includes intermediate gain/loss',()=>{
 const a=studies.calculate('rsi',prices,{period:3}),b=old.rsi(prices,3);
 assert.deepEqual(a.lines[0].data,b.history);
 approx(a.detail.gain,b.values[0]);approx(a.detail.loss,b.values[1]);
});
test('MACD workshop displays fast, slow, MACD, signal, histogram',()=>{
 const a=studies.calculate('macd',prices,{fast:3,slow:5,signal:3});
 const b=old.macd(prices,3,5,3);
 assert.deepEqual(a.lines[0].data,b.line);
 assert.deepEqual(a.lines[1].data,b.signal);
 assert.deepEqual(a.lines[2].data,b.histogram);
 approx(a.detail.histogram,a.detail.macd-a.detail.signal);
});
test('Bollinger workshop displays exact declared population sigma',()=>{
 const a=studies.calculate('bollinger',prices,{period:3,multiplier:2.5});
 const b=old.bollinger(prices,3,2.5);
 assert.deepEqual(a.lines[1].data,b.center);
 assert.deepEqual(a.lines[2].data,b.upper);
 assert.deepEqual(a.lines[3].data,b.lower);
 approx(a.detail.upper,a.detail.middle+2.5*a.detail.deviation);
});
test('Indicator comparator is not a trading signal or a votes engine',()=>{
 const a=studies.compare('rsi','macd',prices,{period:3});
 assert(a&&a.first.units!==a.second.units);
 assert.match(a.relationship,/not an entry or exit instruction/);
 assert.match(a.relationship,/different units/i);
 assert.equal(studies.compare('rsi','rsi',prices),null);
 assert.equal(studies.compare('rsi','notReal',prices),null);
});
test('Invalid and nonfinite indicator inputs fail closed',()=>{
 const invalid=[[10,11,NaN,13,14],[10,11,-1,13,14],Array(501).fill(1)];
 for(const prices of invalid)for(const name of studies.names)assert.equal(studies.calculate(name,prices),null);
 assert.equal(studies.calculate('rsi',studies.fixtures,{period:0}),null);
 assert.equal(studies.calculate('macd',studies.fixtures,{fast:5,slow:3}),null);
 assert.equal(studies.calculate('bollinger',studies.fixtures,{multiplier:6}),null);
});
test('Dynamic learning surface rechecks canonical approved lesson topic before mounting',()=>{
 const ui=read('assets/js/crownlight-indicator-explorer-v1.js');
 const parent=read('assets/js/learning-quant-studies-ui-v1.js'),page=read('lab-player.html');
 assert(ui.includes("math?.select?.(context||{})!==studyId"));
 assert(ui.includes("!['guided','practice'].includes(mode)"));
 assert(parent.includes("const indicatorSession=root.CrownlightIndicatorExplorerV1?.mount?."));
 assert(parent.includes("indicatorSession?.dispose?.()"));
 assert(page.indexOf('crownlight-indicator-experiments-v1.js')<page.indexOf('crownlight-indicator-explorer-v1.js'));
 assert(page.indexOf('crownlight-indicator-explorer-v1.js')<page.indexOf('learning-quant-studies-ui-v1.js'));
});
test('No storage or network paths entered the P2 interactive client',()=>{
 for(const path of ['assets/js/crownlight-indicator-experiments-v1.js','assets/js/crownlight-indicator-explorer-v1.js']){
  const code=read(path);
  for(const term of ['fetch(', 'localStorage','sessionStorage','supabase','answer_key','innerHTML','stripe','service_role'])
   assert(!code.includes(term),path+' must not contain '+term);
 }
 assert.equal(Object.keys(JSON.parse(read('data/competency-lab-paths-v01499.json')).byLab).length,419);
});
test('Accessible table, chart, mobile controls and no guessing by absent indicator data',()=>{
 const ui=read('assets/js/crownlight-indicator-explorer-v1.js'),css=read('assets/css/learning-quant-studies-v1.css');
 for(const s of ['aria-live','aria-label','Numerical evidence','Warmup','CrownlightECharts','setOption',
  'addEventListener','Indicator Evidence Comparator','Review evidence limits'])assert(ui.includes(s),s);
 for(const s of ['cl-indicator-controls','focus-visible','min-height:44px','prefers-reduced-motion'])assert(css.includes(s),s);
});
test('P2 tests are an actual blocking Pages build gate',()=>{
 assert(read('scripts/build-pages.sh').includes('node --test tests/crownlight-indicator-experiments-v1.test.mjs'));
});
