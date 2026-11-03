import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const m=require('../assets/js/prototype-60-fictional-method-workbench-v1.js');
const html=readFileSync(new URL('../prototype.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/css/prototype-60-fictional-method-workbench-v1.css',import.meta.url),'utf8');
const themes=['CANDLE','SMA3','BAR_VWAP_PROXY','RISK','BREAKOUT','THREE_MINUTE'];
test('Sixty unique original fictional data cases in exactly six method families',()=>{
 assert.equal(m.cases.length,60);assert.equal(new Set(m.cases.map(x=>x.id)).size,60);
 assert.deepEqual(m.themes.map(x=>x.id),themes);
 assert.deepEqual(themes.map(x=>m.cases.filter(y=>y.theme===x).length),Array(6).fill(10));
 assert.ok(m.cases.every(x=>x.bars.length===6&&x.source==='original_constructed_fictional'));
});
test('Staff gate, no payments or member mutations, and keyboard operable controls',()=>{
 assert.ok(html.includes('id="pt-app" hidden'));assert.ok(html.includes('id="pt-methods60"'));
 assert.ok(html.indexOf('id="pt-methods60"')>html.indexOf('id="pt-app"'));
 assert.ok(html.includes('/assets/js/prototype-60-fictional-method-workbench-v1.js'));assert.ok(html.includes('/assets/css/prototype-60-fictional-method-workbench-v1.css'));
 assert.ok(css.includes(':focus-visible'));assert.ok(css.includes('overflow-x:auto'));
 const src=readFileSync(new URL('../assets/js/prototype-60-fictional-method-workbench-v1.js',import.meta.url),'utf8');
 assert.ok(src.includes("host.closest('#pt-app').hidden"));
 assert.ok(src.includes("if(details.open&&!app.hidden)"));
 assert.ok(!/fetch\s*\(|localStorage|sessionStorage|XMLHttpRequest|sendBeacon/.test(src));
});
for(const c of m.cases){
 test(c.id+' correctly limits completed fictional observations and protects grading',()=>{
  const last=m.evaluate(c,c.bars.length);
  assert.ok(last&&last.ready===true);
  assert.equal(last.caseId,c.id);assert.equal(last.officialGrade,false);assert.equal(last.predictive,false);
  assert.equal(last.rights,'original_fictional_only');assert.equal(last.bars.length,c.bars.length);
  assert.equal(m.evaluate(c,0),null);assert.equal(m.evaluate(c,7),null);
  assert.equal(m.evaluate(c,2.5),null);assert.equal(m.evaluate({},2),null);
  assert.equal(c.bars.length,6);
 });
 test(c.id+' has no lookahead at any as-of point, even if later bars are mutated',()=>{
  for(let n=1;n<=c.bars.length;n++){
   const observed=m.evaluate(c,n);
   assert.equal(observed.bars.length,n);
   assert.deepEqual(observed.bars,c.bars.slice(0,n).map(x=>({...x})));
   assert.ok(observed.bars.every(b=>b.sequence<=n));
   if(observed.ready&&c.theme==='SMA3'){
    assert.equal(observed.values.window,3);
    const expected=c.bars.slice(n-3,n).reduce((s,b)=>s+b.close,0)/3;
    assert.ok(Math.abs(observed.values.sma3-expected)<1e-4);
   }
   if(observed.ready&&c.theme==='CANDLE'){
    const b=c.bars[n-1];
    assert.ok(Math.abs(observed.values.range-(b.high-b.low))<1e-4);
    assert.ok(observed.values.body<=observed.values.range);
   }
   if(observed.ready&&c.theme==='BAR_VWAP_PROXY'){
    const v=c.bars.slice(0,n).reduce((s,b)=>s+b.volume,0);
    const q=c.bars.slice(0,n).reduce((s,b)=>s+(b.high+b.low+b.close)/3*b.volume,0)/v;
    assert.ok(Math.abs(observed.values.hlc3WeightedBarProxy-q)<1e-4);
   }
   if(observed.ready&&c.theme==='THREE_MINUTE'){
    assert.equal(observed.values.completeGroups,Math.floor(n/3));
    assert.equal(observed.values.threeMinuteBars.length,Math.floor(n/3));
   }
  }
 });
}
test('Boundary cases preserve not-ready UNKNOWN and strict no-lookahead distinctions',()=>{
 for(const theme of ['SMA3','THREE_MINUTE'])assert.equal(m.evaluate(m.cases.find(x=>x.theme===theme),1).ready,false);
 assert.equal(m.evaluate(m.cases.find(x=>x.theme==='BREAKOUT'),1).ready,false);
 const v=m.evaluate(m.cases.find(x=>x.theme==='RISK'),1);
 assert.ok(v.values.wholeShares>=0&&Number.isInteger(v.values.wholeShares));
 assert.ok(m.evaluate(m.cases.find(x=>x.theme==='BAR_VWAP_PROXY'),1).explanation.includes('NOT an exact transaction-print VWAP'));
});
