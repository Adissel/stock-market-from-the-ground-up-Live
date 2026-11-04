import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const api=require('../assets/js/crownlight-evidence-core-v1.js');
const prints=[
 {minute:0,price:100,shares:100},{minute:0,price:100.5,shares:150},
 {minute:1,price:100.25,shares:200},{minute:1,price:102,shares:250},
 {minute:3,price:101.5,shares:300}
];
test('36 canonical proposed experiences have unique identifiers, six packages and no false launch claims',()=>{
 const x=JSON.parse(readFileSync('data/interactive-evidence-features-v1.json','utf8'));
 const all=x.groups.flatMap(g=>g.features);
 assert.equal(x.groups.length,6);assert.equal(all.length,36);
 assert.equal(new Set(all.map(f=>f.id)).size,36);
 assert.deepEqual([...new Set(all.map(f=>f.package))].sort(),['P1','P2','P3','P4','P5','P6']);
 assert(all.every(f=>f.status==='proposed'&&f.releaseGate==='independent_acceptance_required'));
});
test('trade-print VWAP exact four-print case and fifth causal observation',()=>{
 assert.equal(api.vwap(prints,0).value,null);
 const four=api.vwap(prints,4);assert.equal(four.volume,700);
 assert.equal(four.dollars,70625);
 assert(Math.abs(four.value-100.89285714285714)<1e-10);
 assert.equal(four.steps.length,4);
 const five=api.vwap(prints,5);
 assert.equal(five.volume,1000);assert.equal(five.dollars,101075);
 assert.equal(five.value,101.075);
 const extended=api.vwap([...prints,{minute:7,price:9999,shares:4}],4);
 assert.equal(extended.volume,four.volume);assert.equal(extended.dollars,four.dollars);
 assert.deepEqual(extended.steps,four.steps);assert.equal(extended.value,four.value);
});
test('fictional OHLC anatomy enforces bounds, wicks and doji range',()=>{
 const c=api.candle({open:31,high:32.5,low:30.5,close:32});
 assert.equal(c.body,1);assert.equal(c.range,2);assert.equal(c.bodyPercent,50);
 assert.equal(c.upperWick,.5);assert.equal(c.lowerWick,.5);
 assert.equal(api.candle({open:1,high:1,low:1,close:1}).bodyPercent,0);
 for(const bad of [{open:2,high:1,low:0,close:2},{open:1,high:3,low:2,close:1},
  {open:1,high:2,low:0,close:Infinity}])assert.equal(api.candle(bad),null);
});
test('all three timeframes use only revealed observations',()=>{
 for(const timeframe of [1,3,5]){
  for(let n=0;n<=prints.length;n++){
   const current=api.aggregate(prints,n,timeframe),later=api.aggregate([...prints,{minute:8,price:44,shares:99}],n,timeframe);
   assert.deepEqual(current,later,'future print not visible at prefix '+n);
   assert.equal(current.reduce((sum,b)=>sum+b.volume,0),prints.slice(0,n).reduce((sum,t)=>sum+t.shares,0));
  }
 }
 assert.deepEqual(api.aggregate(prints,4,1).map(b=>b.minute),[0,1]);
 assert.deepEqual(api.aggregate(prints,5,3).map(b=>b.minute),[0,3]);
 assert.deepEqual(api.aggregate(prints,5,5).map(b=>b.minute),[0]);
});
test('market structure requires right-hand confirmation, then labels HH/HL/LH/LL',()=>{
 const highs=[9,12,10,14,11,13,9],lows=[7,8,7.5,9,8.5,9,7.5];
 const bars=highs.map((h,i)=>({open:lows[i]+.2,high:h,low:lows[i],close:h-.2}));
 const xs=api.structure(bars);
 assert(xs.some(x=>x.label==='HH'&&x.confirmedAt===4));
 assert(xs.some(x=>x.label==='LH'&&x.confirmedAt===6));
 assert(api.structure(bars.slice(0,4)).every(x=>x.confirmedAt<=3));
 const earlier=api.structure(bars.slice(0,5));
 assert.deepEqual(api.structure([...bars.slice(0,5),...bars.slice(5).map(b=>({...b,high:100}))]).filter(x=>x.confirmedAt<5),earlier);
});
test('invalid prices, volume, order and count fail closed',()=>{
 for(const wrong of [[{minute:0,price:10,shares:0}], [{minute:1,price:2,shares:1},{minute:0,price:3,shares:1}],
  [{minute:0,price:Infinity,shares:1}]]){
  assert.equal(api.vwap(wrong,wrong.length),null);assert.equal(api.aggregate(wrong,wrong.length,1),null);
 }
 assert.equal(api.vwap(prints,6),null);assert.equal(api.aggregate(prints,-1,3),null);
 assert.equal(api.aggregate(prints,3,2),null);assert.equal(api.structure([{open:5,high:1,low:0,close:3}]),null);
});
test('no alternate entitlement, grade, data feed, network or progress store is created',()=>{
 const js=readFileSync('assets/js/crownlight-evidence-core-v1.js','utf8');
 assert.doesNotMatch(js,/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|supabase|service_role|answer_key|stripe|memberRecordWritten|paidInference/i);
 const labs=JSON.parse(readFileSync('data/competency-lab-paths-v01499.json','utf8'));
 assert.equal(Object.keys(labs.byLab).length,419);
});
