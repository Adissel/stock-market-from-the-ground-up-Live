import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const m=require('../assets/js/learning-indicators-v1.js');
const bridges=JSON.parse(readFileSync('data/lab-teaching-bridges-v014168.json','utf8')).entries;
test('EMA seeded by period SMA never exposes premature values',()=>{
 const a=m.ema([10,12,14,16],3);assert.deepEqual(a,[null,null,12,14]);assert.equal(m.ema([10,12],3),null);
});
test('Wilder RSI uses period price changes, including flat market midpoint',()=>{
 assert.deepEqual(m.rsi([10,10,10,10],3).history,[null,null,null,50]);
 assert.equal(m.rsi([10,11,12],3),null);
 assert.equal(m.rsi([10,11,12,13],3).history[3],100);
});
test('MACD signal and histogram require independent signal warmup',()=>{
 const a=m.macd([10,11,12,13,14,15,16],3,5,3);
 assert(a);assert.deepEqual(a.line.slice(0,4),[null,null,null,null]);
 assert.deepEqual(a.signal.slice(0,6),[null,null,null,null,null,null]);
 assert.equal(a.signal[6],a.line.slice(4,7).reduce((x,y)=>x+y,0)/3);
 assert.equal(a.histogram[5],null);
});
test('ATR includes prior-close gap and does not plot before initial seed',()=>{
 const a=m.atr([{h:11,l:9,c:10},{h:14,l:13,c:13.5},{h:15,l:14,c:14.5}],2);
 assert(a);assert.deepEqual(a.tr,[2,4,1.5]);assert.equal(a.history[0],null);assert.equal(a.history[1],3);assert.equal(a.history[2],2.25);
});
test('Bollinger uses population deviation and suppresses pre-period bands',()=>{
 const a=m.bollinger([10,12,14],3,2);assert(a);assert.deepEqual(a.center,[null,null,12]);
 assert(Math.abs(a.sd[2]-Math.sqrt(8/3))<1e-12);
 assert.equal(a.upper[0],null);assert.equal(a.lower[1],null);
});
test('canonical mapped Lab topics reject swapped indicators and unknown IDs',()=>{
 for(const [id,indicator] of Object.entries(m.approved)){
  assert(bridges[id],id);assert.equal(m.select({labId:id,topic:bridges[id].title}),indicator,id);
  assert.equal(m.select({labId:'unknown',topic:bridges[id].title}),null);
 }
 assert.equal(m.select({labId:'DT-C19-L03',topic:bridges['F3-C07-L04'].title}),null);
});
test('all named indicator lessons are source-only and ungraded',()=>{
 for(const id of ['rsi','macd','atr','bollinger']){
  const def=m.definitions[id];assert(def);assert.match(def.workedPrompt,/simulated/i);
  assert.match(def.transferPrompt,/simulated/i);assert.equal(m.assess({studyId:id,inputs:['0','0','0'],mode:'guided',stage:'practice',provenance:'fictional_authored'}).officialGrade,false);
 }
});
