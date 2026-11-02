import test from 'node:test';
import assert from 'node:assert/strict';
import{createRequire}from'node:module';
const require=createRequire(import.meta.url),m=require('../assets/js/learning-indicators-v1.js');
const near=(x,y,eps=1e-8)=>assert(Math.abs(x-y)<eps,String(x)+' != '+String(y));
test('Wilder RSI seed and zero-divisor cases',()=>{
 const r=m.rsi([10,11,12,11,13,14],3);
 assert.deepEqual(r.history.slice(0,3),[null,null,null]);near(r.history[3],66.6666666667,1e-6);
 near(r.values[0],29/27);near(r.values[1],4/27);
 assert.equal(m.rsi([10,10,10,10],3).values[2],50);
 assert.equal(m.rsi([10,11,12,13],3).values[2],100);
 assert.equal(m.rsi([10,9,8,7],3).values[2],0);
 assert.equal(m.rsi([10,11,12],3),null);
});
test('MACD fast slow signal series do not disclose early values',()=>{
 const r=m.macd([10,11,12,11,13,14,15,14],3,5,3);
 assert.deepEqual(r.line.slice(0,4),[null,null,null,null]);
 assert.deepEqual(r.signal.slice(0,6),[null,null,null,null,null,null]);
 near(r.values[2],r.line.at(-1));near(r.histogram.at(-1),r.line.at(-1)-r.signal.at(-1));
 assert.equal(m.macd([10,11,12,13,14],3,5,3),null);
});
test('ATR Wilder seed gaps and invalid OHLC',()=>{
 const r=m.atr(m.definitions.atr.initial.bars,3);
 assert.deepEqual(r.tr,[2,2,3,3,3]);near(r.values[1],7/3);near(r.values[2],73/27);
 assert.deepEqual(r.history.slice(0,2),[null,null]);
 assert.equal(m.atr([{h:11,l:9,c:10},{h:21,l:19,c:20}],2).tr[1],11);
 assert.equal(m.atr([{h:1,l:2,c:2},{h:2,l:1,c:1}],2),null);
});
test('Bollinger uses declared population deviation and period',()=>{
 const r=m.bollinger([10,11,12,13,12,14],3,2);
 near(r.values[0],13);near(r.values[1],Math.sqrt(2/3));near(r.values[2],13+2*Math.sqrt(2/3));
 near(r.lower.at(-1),13-2*Math.sqrt(2/3));
 assert.deepEqual(r.center.slice(0,2),[null,null]);
 assert.equal(m.bollinger([5,5,5],3,2).upper.at(-1),5);
});
test('Independent transfer and formative diagnostic do not grade or persist',()=>{
 for(const id of Object.keys(m.definitions)){
  const def=m.definitions[id],base=m.calculate(id,def.initial),next=m.calculate(id,def.transfer);
  assert.notDeepEqual(base.values,next.values);
  const r=m.assess({studyId:id,inputs:base.values.map(String),mode:'guided',stage:'practice',provenance:'fictional_authored'});
  assert.equal(r.status,'method_steps_matched');assert.equal(r.officialGrade,false);
  assert.equal(r.memberRecordWritten,false);
  const wrong=m.assess({studyId:id,inputs:['999',String(base.values[1]),String(base.values[2])],mode:'practice',stage:'practice',provenance:'fictional_authored'});
  assert.equal(wrong.status,'observed_step_mismatch');assert.equal(wrong.verifiedCause,false);
  assert.equal(m.checkTransfer({studyId:id,submitted:next.values[2],mode:'guided'}).correct,true);
 }
});
test('Authored Lab bridges and assessment boundary fail closed',()=>{
 assert.equal(m.select({labId:'F3-C07-L01',topic:'RSI overbought'}),'rsi');
 assert.equal(m.select({labId:'F3-C07-L03',topic:'MACD lag'}),'macd');
 assert.equal(m.select({labId:'F1-C01-L01',topic:'RSI'}),null);
 assert.equal(m.select({labId:'F3-C07-L01',topic:'MACD'}),null);
 const inputs=m.calculate('rsi',m.definitions.rsi.initial).values.map(String);
 for(const bad of [{mode:'assessment'},{mode:'blind'},{stage:'assess'},{provenance:'historical_unverified'},{inputs:['Infinity',inputs[1],inputs[2]]}]){
  assert.equal(m.assess({studyId:'rsi',inputs,mode:'guided',stage:'practice',provenance:'fictional_authored',...bad}).status,'insufficient_evidence');
 }
});

test('Authorized member Lab integration and no premature independent-case answer',()=>{
 const fs=require('node:fs');
 const ui=fs.readFileSync('assets/js/learning-quant-studies-ui-v1.js','utf8');
 const lab=fs.readFileSync('assets/js/lab-engine-v32-universal.js','utf8');
 const html=fs.readFileSync('lab-player.html','utf8');
 assert.match(ui,/const indicator=root\.GroundUpLearningIndicatorsV1/);
 assert.match(ui,/const values=Array\.isArray\(base\.chart\)/);
 assert.match(ui,/const selected=math\?\.select\?\.\(context\|\|\{\}\)/);
 assert.match(ui,/selected!==studyId/);
 assert.match(lab,/context:\{\s*labId,topic,competencies:codes,primaryCode:codes\[0\]\|\|null/);
 assert(!ui.includes('New case steps'));
 assert(!ui.includes("node('td',later.values"));
 assert.match(lab,/GroundUpLearningIndicatorsV1\?\.select/);
 assert(html.indexOf('learning-indicators-v1.js')<html.indexOf('lab-engine-v32-universal.js'));
});

test('Reject non-finite derived indicator results even from finite inputs',()=>{
 // Every input passes the existing finite-input checks; arithmetic must
 // nevertheless fail closed rather than exposing Infinity/NaN to a learner.
 assert.equal(m.ema([1e308,1e308,1e308],2),null);
 assert.equal(m.rsi([1,1e308,1,1e308,1,1e308,1],5),null);
 assert.equal(m.macd(Array(8).fill(1e308),3,5,3),null);
 const hugeBars=Array.from({length:3},()=>({h:1e308,l:1,c:1e308}));
 assert.equal(m.atr(hugeBars,2),null);
 assert.equal(m.bollinger([1e308,1e308,1e308],2,2),null);
 assert.equal(m.bollinger([1e155,2e155,3e155],2,2),null);
 // Supported realistic fictional cases must retain finite, independently
 // checkable output and never cause a hidden grade or member-data write.
 for(const [id,def] of Object.entries(m.definitions)){
  const r=m.calculate(id,def.initial);
  assert(r&&r.values.every(Number.isFinite),id+' still produces finite worked evidence');
 }
});

// Independent hand-calculated reference: SMA-seeded EMA(3)/EMA(5),
// MACD(3,5), then signal EMA(3) seeded by the first three MACD values.
test('MACD independent numerical reference checks signal and histogram',()=>{
 const r=m.macd([10,11,12,11,13,14,15,14],3,5,3);
 near(r.line[4],0.6);near(r.line[5],11/15);near(r.line[6],37/45);
 near(r.line[7],74/135);
 near(r.signal[6],97/135);near(r.signal[7],19/30);
 near(r.histogram[7],-23/270);
 assert.deepEqual(r.signal.slice(0,6),Array(6).fill(null));
});
test('Completed-bar prefix independence for five Learning/Lab indicator calculations',()=>{
 const prices=[10,11,12,11,13,14,15,14],future=[...prices,100];
 for(const [name,period] of [['ema',3],['rsi',3]]){
  const now=m[name](prices,period),later=m[name](future,period);
  const current=name==='ema'?now:now.history;
  const extended=name==='ema'?later:later.history;
  assert.deepEqual(extended.slice(0,prices.length),current,name+' does not revise completed history');
 }
 for(const key of ['line','signal','histogram']){
  const now=m.macd(prices,3,5,3),later=m.macd(future,3,5,3);
  assert.deepEqual(later[key].slice(0,prices.length),now[key],key+' does not use unseen bars');
 }
 const bollNow=m.bollinger(prices,3,2),bollLater=m.bollinger(future,3,2);
 for(const key of ['center','upper','lower','sd']){
  assert.deepEqual(bollLater[key].slice(0,prices.length),bollNow[key],key+' no future dependence');
 }
 const bars=m.definitions.atr.initial.bars;
 const later=m.atr([...bars,{h:110,l:99,c:100}],3),now=m.atr(bars,3);
 assert.deepEqual(later.tr.slice(0,bars.length),now.tr);
 assert.deepEqual(later.history.slice(0,bars.length),now.history);
});
