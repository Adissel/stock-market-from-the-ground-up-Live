import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const core=require('../assets/js/crownlight-evidence-core-v1.js');
const s=require('../assets/js/crownlight-evidence-scenarios-v1.js');
const read=p=>readFileSync(p,'utf8');
const ui=read('assets/js/crownlight-interactive-evidence-v1.js');
const fixture=Array.from({length:10},(_,i)=>({minute:i,price:100+i,shares:10}));
for(let count=0;count<=4;count++){
 test('P1 high-first candle only exposes '+count+' observed trades',()=>{
  const x=s.wick('highFirst',count);assert.equal(x.prints.length,count);
  assert.equal(x.revealed,count);assert.equal(x.complete,count===4);
  assert.equal(x.bar?.volume??0,count*100);
 });
 test('P1 low-first candle only exposes '+count+' observed trades',()=>{
  const x=s.wick('lowFirst',count);assert.equal(x.prints.length,count);
  assert.equal(x.revealed,count);assert.equal(x.complete,count===4);
  assert.equal(x.bar?.volume??0,count*100);
 });
 test('P1 rising pattern only exposes '+count+' finished examples',()=>{
  const x=s.pattern('rising',count);assert.equal(x.bars.length,count);
  assert.equal(x.summary===null,count<5);
 });
 test('P1 falling pattern only exposes '+count+' finished examples',()=>{
  const x=s.pattern('falling',count);assert.equal(x.bars.length,count);
  assert.equal(x.summary===null,count<5);
 });
}
for(let count=0;count<10;count++){
 test('P1 malformed future observation does not affect previous frame '+count,()=>{
  const old=fixture.slice(0,count),spoof=[...old,{minute:count,price:Number.NaN,shares:-1}];
  assert.deepEqual(core.aggregate(spoof,count,1),core.aggregate(old,count,1));
  const first=core.vwap(old,count),after=core.vwap(spoof,count);
  assert.equal(first.volume,after.volume);assert.equal(first.value,after.value);
  assert.deepEqual(first.steps,after.steps);
 });
}
for(let count=0;count<=5;count++){
 test('P1 authored pattern prefix independence at '+count,()=>{
  const short=s.pattern('rising',count),complete=s.pattern('rising',5);
  assert.deepEqual(short.bars,complete.bars.slice(0,count));
  if(count!==5)assert.equal(short.summary,null);
 });
}
test('The exact two fictional wick examples finish with identical candles but opposite chronology',()=>{
 const a=s.wick('highFirst',4),b=s.wick('lowFirst',4);
 assert.deepEqual(a.bar,b.bar);assert.equal(a.bar.high,103);assert.equal(a.bar.low,99);
 assert.equal(a.bar.open,100);assert.equal(a.bar.close,101);assert.equal(a.bar.volume,400);
 assert.notDeepEqual(a.prints.map(x=>x.price),b.prints.map(x=>x.price));
});
test('Pattern comparison has identical final geometry, different trend and share volume',()=>{
 const a=s.pattern('rising',5),b=s.pattern('falling',5);
 assert.deepEqual(a.summary.current,b.summary.current);
 assert(a.summary.priorChange>0);assert(b.summary.priorChange<0);
 assert.notEqual(a.summary.lastVolume,b.summary.lastVolume);
});
test('Invalid and out-of-range case selection never fabricates evidence',()=>{
 for(const x of [undefined,0,6,-1,NaN])if(x!==0)assert.equal(s.pattern('rising',x),null);
 assert.equal(s.wick('unknown',4),null);assert.equal(s.wick('highFirst',5),null);
 assert.equal(s.pattern('unknown',5),null);assert.equal(s.pattern('rising',-1),null);
});
test('Five P1 investigations have genuine wired controls and accessible labels',()=>{
 for(const key of ['anatomy','timeline','structure','patterns','wicks'])assert(ui.includes("select.value==='"+key+"'"),key);
 for(const key of ['Identify and draw swing','Reset structure investigation','Reveal next trade print',
  'Reveal earlier context','Conceal earlier context','Reveal next fictional print',
  'Reset wick investigation','createElementNS','aria-live','core.structure(completed)'])assert(ui.includes(key),key);
});
test('Structure marker checks only completed candle neighbors',()=>{
 assert(ui.includes("const completed=(core.aggregate(sequence,count,frame)||[]).slice(0,-1)"));
 assert(ui.includes("core.structure(completed)||[]"));
 assert(ui.includes("accepted.set(confirmed.type+':'+confirmed.index,confirmed)"));
});
test('Scenarios preserve existing nine-stage, entitlement, future-bar and privacy boundaries',()=>{
 const page=read('lab-player.html'),engine=read('assets/js/lab-engine-v32-universal.js');
 const code=read('assets/js/crownlight-evidence-scenarios-v1.js');
 for(const forbidden of ['fetch(', 'localStorage','sessionStorage','supabase','answer_key','innerHTML','stripe'])
  assert(!code.includes(forbidden),'No unintended data source '+forbidden);
 assert(page.indexOf('crownlight-evidence-core-v1.js')<page.indexOf('crownlight-evidence-scenarios-v1.js'));
 assert(page.indexOf('crownlight-evidence-scenarios-v1.js')<page.indexOf('crownlight-interactive-evidence-v1.js'));
 assert(engine.includes("!academyScope&&['candle','vwap'].includes(visualType)"));
 assert.equal(Object.keys(JSON.parse(read('data/competency-lab-paths-v01499.json')).byLab).length,419);
});
