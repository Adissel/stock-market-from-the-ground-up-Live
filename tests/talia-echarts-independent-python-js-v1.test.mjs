import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import math from '../assets/js/crownlight-indicator-math-v2.js';

const N=225,start=Date.UTC(2024,4,7,13,30);
const bars=Array.from({length:N},(_,i)=>{
 const close=100+i*.045+Math.sin(i*.21)*.6;
 const open=close+(i%2===0?-.18:.14);
 return {time:new Date(start+i*60000),open,high:Math.max(close,open)+.25,
  low:Math.min(close,open)-.29,close,volume:1000+(i%17)*39};
});
const values=arr=>arr.map(x=>x===null?null:x);
function calculated(source){
 const c=source.map(x=>x.close);
 const bb=math.bollinger(source,20,2);
 const md=math.macd(source,12,26,9);
 const levels=math.observedLevels(source);
 const range=math.openingRange(source,5);
 return {
 EMA9:math.ema(c,9),EMA20:math.ema(c,20),EMA200:math.ema(c,200),
 SMA20:math.sma(c,20),VOLUME_SMA20:math.sma(source.map(x=>x.volume),20),
 RSI14:math.rsi(source,14),ATR14:math.atr(source,14),
 BB20_MIDDLE:bb.middle,BB20_UPPER:bb.upper,BB20_LOWER:bb.lower,
 MACD_LINE:md.line,MACD_SIGNAL:md.signal,MACD_HIST:md.histogram,
 VWAP_HLC3_PROXY:math.vwapProxy(source),
 HOD:levels.HOD,LOD:levels.LOD,
 OPEN_RANGE5_UPPER:range.upper,OPEN_RANGE5_LOWER:range.lower
 };
}
test('independent Python and production JS match all chart study series, including every warmup index',()=>{
 const r=spawnSync(process.platform==='win32'?'python':'python3',
  ['scripts/qa/talia_echarts_member_math_python_v1.py'],{encoding:'utf8',timeout:10000});
 assert.equal(r.status,0,r.stderr);
 const reference=JSON.parse(r.stdout),actual=calculated(bars);
 assert.equal(reference.bars,N);assert.equal(reference.studyCount,18);
 assert.deepEqual(Object.keys(actual).sort(),Object.keys(reference.fullSeries).sort());
 for(const [key,py] of Object.entries(reference.fullSeries)){
  const js=actual[key];
  assert.equal(js.length,N,key);
  for(let i=0;i<N;i++){
   if(py[i]===null){assert.equal(js[i],null,key+' missing warmup at '+i);continue}
   assert.ok(Number.isFinite(js[i])&&Math.abs(js[i]-py[i])<1e-7,key+' index='+i+
    ' Python='+py[i]+' JS='+js[i]);
  }
 }
 assert.equal(actual.EMA200[198],null);
 assert.ok(Number.isFinite(actual.EMA200[199]));
 assert.equal(actual.RSI14[13],null);
 assert.ok(Number.isFinite(actual.RSI14[14]));
 assert.equal(actual.OPEN_RANGE5_UPPER[4],null);
 assert.ok(Number.isFinite(actual.OPEN_RANGE5_UPPER[5]));
 assert.equal(reference.limitations.includes('not trade print VWAP'),true);
});
test('chronological replay prefix cannot change any already-observed original indicator value',()=>{
 const full=calculated(bars),prefix=calculated(bars.slice(0,50));
 for(const [key,short] of Object.entries(prefix)){
  assert.equal(short.length,50);
  for(let i=0;i<50;i++){
   const old=full[key][i],now=short[i];
   if(old===null){assert.equal(now,null,key+' warmup '+i);continue}
   assert.ok(Number.isFinite(now)&&Math.abs(now-old)<1e-8,key+' leaked future bar at '+i);
  }
 }
 assert.equal(prefix.EMA200.every(x=>x===null),true);
 assert.equal(prefix.MACD_SIGNAL[32],null);
 assert.ok(Number.isFinite(prefix.MACD_SIGNAL[33]));
});
test('zero-volume bar is not converted to exact transaction VWAP',()=>{
 const prefix=bars.slice(0,8).map(b=>({...b}));
 prefix[0].volume=0;prefix[1].volume=0;
 const v=math.vwapProxy(prefix);
 assert.equal(v[0],null);
 assert.equal(v[1],null);
 assert.ok(Number.isFinite(v[2]));
 const close=prefix[2].close;
 assert.notEqual(v[2],close);
});
