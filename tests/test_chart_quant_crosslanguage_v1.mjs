/* Independent Python vs first-party JS chart math and shipped replay aggregation.
 * Uses generated fictional OHLCV; never publishes, fetches or trades market data.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
const reference=JSON.parse(execFileSync('python3',['scripts/chart-independent-quant-reference-v1.py'],{encoding:'utf8',timeout:60000}));
const source=readFileSync('assets/js/crownlight-indicator-math-v2.js','utf8');
const sandbox={window:{},console,Intl};vm.createContext(sandbox);vm.runInContext(source,sandbox);
const m=sandbox.window.CrownlightIndicatorMath;
assert(m,'Real first-party indicator math API must be present');
const rows=reference.bars.map(b=>({time:new Date(b.ms),open:b.o,high:b.h,low:b.l,close:b.c,volume:b.v}));
const close=rows.map(b=>b.close);
const finiteDifference=(a,b)=>Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
function check(name,actual,expected){
 assert.equal(actual.length,expected.length,name+' series length');
 for(let i=0;i<actual.length;i++){
  const x=actual[i],y=expected[i];
  if(x===null||y===null){assert.equal(x,y,name+' null/warmup at '+i);continue}
  assert(Number.isFinite(x)&&Number.isFinite(y)&&finiteDifference(x,y),name+' at '+i+': '+x+' versus '+y);
 }
}
check('SMA9',m.sma(close,9),reference.studies.sma9);
check('EMA9',m.ema(close,9),reference.studies.ema9);
check('EMA20',m.ema(close,20),reference.studies.ema20);
check('EMA200',m.ema(close,200),reference.studies.ema200);
check('RSI14',m.rsi(rows,14),reference.studies.rsi14);
check('ATR14',m.atr(rows,14),reference.studies.atr14);
const bb=m.bollinger(rows,20,2);
for(const key of ['middle','upper','lower'])check('BB20-'+key,bb[key],reference.studies.bb20[key]);
const macd=m.macd(rows,12,26,9);
for(const key of ['line','signal','histogram'])check('MACD-'+key,macd[key],reference.studies.macd[key]);
check('HLC3VWAP',m.vwapProxy(rows),reference.studies.vwap);
assert.equal(m.ema(close.slice(0,199),200).every(x=>x===null),true,'EMA 200 cannot appear with 199 bars');
assert.equal(m.ema(close,200)[198],null);
assert(Number.isFinite(m.ema(close,200)[199]),'EMA 200 first valid at completed bar 200');
// Compare each shorter prefix against the original full result: no future bar can revise older observations.
for(const n of [8,13,20,40,119,120,125,199,200,201,240]){
 check('EMA9-no-lookahead-'+n,m.ema(close.slice(0,n),9),reference.studies.ema9.slice(0,n));
 check('EMA200-no-lookahead-'+n,m.ema(close.slice(0,n),200),reference.studies.ema200.slice(0,n));
 check('RSI-no-lookahead-'+n,m.rsi(rows.slice(0,n),14),reference.studies.rsi14.slice(0,n));
 check('VWAP-no-lookahead-'+n,m.vwapProxy(rows.slice(0,n)),reference.studies.vwap.slice(0,n));
}
// Test actual shipped 1/3/5-minute aggregation, not a duplicated JS implementation.
const text=readFileSync('assets/js/historical-replay-classroom-v1.js','utf8');
const begin=text.indexOf('function aggregate(source,k){');
assert(begin>0,'Historical Replay Classroom must expose its original source aggregation implementation');
const start=text.indexOf('{',begin);let depth=0,end=-1;
for(let i=start;i<text.length;i++){if(text[i]==='{')depth++;else if(text[i]==='}'&&--depth===0){end=i+1;break}}
assert(end>start,'Original source aggregation body must be balanced');
const aggregate=vm.runInNewContext('('+text.slice(begin,end)+')');
const candles=reference.bars;
const compareBars=(name,got,want)=>{
 assert.equal(got.length,want.length,name+' completed candle count');
 for(let i=0;i<want.length;i++){
  for(const key of ['ms','end','o','h','l','c','v'])
   assert.equal(got[i][key],want[i][key],name+' bar '+i+' '+key);
 }
};
for(const k of [1,3,5]){
 compareBars(k+'m full',aggregate(candles,k),reference.aggregate[String(k)]);
 for(const [n,groups] of Object.entries(reference.prefixes))
  compareBars(k+'m revealed prefix '+n,aggregate(candles.slice(0,Number(n)),k),groups[String(k)]);
}
assert.equal(reference.aggregate['3'].length,80);
assert.equal(reference.aggregate['5'].length,48);
assert(finiteDifference(reference.studies.vwap[120],(rows[120].high+rows[120].low+rows[120].close)/3),'Second-session HLC3 VWAP must reset within floating-point tolerance');
console.log('PASS independent Python vs JS numerical reference: SMA/EMA9/20/200, RSI, ATR, BB, MACD, HLC3 VWAP, no-lookahead prefixes, and actual 1/3/5-minute OHLCV grouping');
