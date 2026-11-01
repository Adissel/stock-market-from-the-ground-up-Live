import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {smaSeededEma,trueRange,standardDeviations,hypotheticalExpectancy,fixedPayoffBreakEven,optionPremiumNotional,optionDecomposition,foundationQuantTeaching,FOUNDATION_QUANT_TOPICS} from '../functions/_lib/talia-foundation-quant-v1.js';
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-9,'actual='+actual+' expected='+expected);
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('EMA9 and EMA200 require completed histories, use declared SMA seed and no future values',()=>{
 assert.equal(smaSeededEma(Array(8).fill(10),9),null);
 assert.equal(smaSeededEma(Array(199).fill(20),200),null);
 const e9=smaSeededEma([...Array(9).fill(10),10.5],9);
 const e200=smaSeededEma([...Array(200).fill(20),21],200);
 near(e9.alpha,.2);near(e9.seed,10);near(e9.value,10.1);assert.equal(e9.series.length,10);
 near(e200.alpha,2/201);near(e200.seed,20);near(e200.value,20+2/201);
 assert.equal(e200.series[198],null);near(e200.series[199],20);
 assert.equal(smaSeededEma([1,2,3,Infinity],3),null);
});
test('Gap-aware true range and dispersion use independent correct denominators',()=>{
 near(trueRange(10,10.8,10.6),.8);near(trueRange(10,9.5,9.2),.8);
 assert.throws(()=>trueRange(10,9.2,9.5),RangeError);
 const sd=standardDeviations([1,0,-1]);near(sd.mean,0);near(sd.population,Math.sqrt(2/3));near(sd.sample,1);
 assert.equal(standardDeviations([1]),null);
});
test('Expectation, fixed-payoff break-even and options arithmetic disclose hypotheticals',()=>{
 near(hypotheticalExpectancy(.4,30,10),6);
 near(hypotheticalExpectancy(.4,30,25),-3);
 near(fixedPayoffBreakEven(20,10,2),.4);
 near(fixedPayoffBreakEven(40,20,4),.4);
 assert.equal(fixedPayoffBreakEven(1,1,5),null);
 assert.throws(()=>hypotheticalExpectancy(1.1,20,10),RangeError);
 near(optionPremiumNotional(2.5,100,1),250);
 near(optionPremiumNotional(1.35,100,2),270);
 assert.deepEqual(optionDecomposition('call',55,50,7),{intrinsic:5,extrinsic:2});
 assert.deepEqual(optionDecomposition('put',37,40,4.25),{intrinsic:3,extrinsic:1.25});
 assert.deepEqual(optionDecomposition('call',55,60,1),{intrinsic:0,extrinsic:1});
 assert.equal(optionDecomposition('call',55,50,2),null,'Do not invent negative extrinsic when stale quote is below intrinsic');
});
test('All nine new source-only numeric Tutor topics have distinct alternate teaching cases',()=>{
 assert.equal(FOUNDATION_QUANT_TOPICS.length,9);
 const ids=new Set(FOUNDATION_QUANT_TOPICS);assert.equal(ids.size,9);
 const asset=JSON.parse(read('data/talia-foundation-explanations-batch02-v1.json'));
 for(const id of ids){
  assert.ok(asset.guides.some(g=>g.code===id),'Missing source-backed topic '+id);
  const first=foundationQuantTeaching(id,'Explain this');
  const second=foundationQuantTeaching(id,'Try another worked example');
  assert.notEqual(first,second,id+' must switch to a genuinely distinct hypothetical');
  for(const rendered of [first,second]){
   assert.match(rendered,/fictional/);
   assert.match(rendered,/ungraded/);
   assert.match(rendered,/no model inference|no model inference/i);
   assert.doesNotMatch(rendered,/guaranteed profit|buy now|sell immediately|future candle revealed|mastery awarded/i);
  }
 }
 assert.equal(foundationQuantTeaching('TALIA_TOPIC_UNKNOWN'),null);
});
