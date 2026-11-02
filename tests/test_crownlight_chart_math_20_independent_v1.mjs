/* Twenty independent runtime regressions for the REAL Crownlight chart indicator engine.
 * Deterministic fictional candles only; no network, trades, private data or paid APIs.
 * Math inputs and expected outputs were executed against deployed-source commit aaf87e05.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import '../assets/js/crownlight-indicator-math-v2.js';
const m=globalThis.CrownlightIndicatorMath;
assert.ok(m&&typeof m.ema==='function','Load the actual shipped indicator module');
const equal=(a,b)=>a===b||(typeof a==='number'&&typeof b==='number'&&Math.abs(a-b)<1e-8);
function match(actual,expected){
  assert.equal(actual.length,expected.length,'series length');
  actual.forEach((x,i)=>assert.ok(equal(x,expected[i]),'bar '+i+': '+x+' versus '+expected[i]));
}
const bar=(close,time='2026-11-02T14:30:00Z',volume=100,high=close+1,low=close-1)=>({open:close,high,low,close,volume,time});
const bars=closes=>closes.map(c=>bar(c));
test('01 SMA period-three warmup and rolling arithmetic',()=>match(m.sma([10,12,14,16,18],3),[null,null,12,14,16]));
test('02 SMA missing observation never becomes an incomplete window',()=>match(m.sma([1,2,NaN,4,5,6],3),[null,null,null,null,null,5]));
test('03 invalid SMA period fails closed',()=>match(m.sma([1,2,3],1),[null,null,null]));
test('04 EMA period-three SMA seed and recurrence',()=>match(m.ema([10,12,14,16,18],3),[null,null,12,14,16]));
test('05 EMA missing sample never fabricates a chart point',()=>match(m.ema([10,12,14,NaN,18,20],3),[null,null,12,null,15,17.5]));
test('06 EMA insufficient observations remain null',()=>match(m.ema([10,12],3),[null,null]));
test('07 Wilder RSI gain-only fixture reaches 100',()=>match(m.rsi(bars([10,11,12,13,14]),3),[null,null,null,100,100]));
test('08 Wilder RSI flat fixture is neutral 50',()=>match(m.rsi(bars([10,10,10,10,10]),3),[null,null,null,50,50]));
test('09 Wilder RSI loss-only fixture reaches zero',()=>match(m.rsi(bars([10,9,8,7,6]),3),[null,null,null,0,0]));
test('10 ATR constant true ranges seed and persist',()=>match(m.atr(bars([10,10,10,10]),3),[null,null,2,2]));
test('11 ATR includes previous-close gaps in true range',()=>{
  const x=[bar(10,'2026-11-02T14:30:00Z',100,11,9),bar(13,'2026-11-02T14:31:00Z',100,14,12),bar(12,'2026-11-02T14:32:00Z',100,13,11)];
  assert.ok(equal(m.atr(x,3)[2],8/3));
});
test('12 Bollinger uses population sigma and symmetric bands',()=>{
  const x=m.bollinger(bars([1,2,3,4]),3,2);
  assert.ok(equal(x.middle[2],2)&&equal(x.upper[2],2+2*Math.sqrt(2/3))&&equal(x.lower[2],2-2*Math.sqrt(2/3)));
});
test('13 Bollinger flat-price bands coincide with average',()=>{
  const x=m.bollinger(bars([5,5,5]),3,2);
  assert.equal(x.middle[2],5);assert.equal(x.upper[2],5);assert.equal(x.lower[2],5);
});
test('14 MACD warmup distinguishes slow EMA and signal arrival',()=>{
  const x=m.macd(bars(Array.from({length:9},(_,i)=>i+1)),3,5,2);
  assert.ok(x.line.slice(0,4).every(v=>v===null));
  assert.ok(Number.isFinite(x.line[4])&&x.signal.slice(0,5).every(v=>v===null));
  assert.ok(Number.isFinite(x.signal[5])&&x.histogram[4]===null);
});
test('15 constant-price MACD line signal and histogram all zero',()=>{
  const x=m.macd(bars(Array(12).fill(20)),3,5,2);
  assert.ok(x.line.slice(4).every(v=>v===0)&&x.signal.slice(5).every(v=>v===0)&&x.histogram.slice(5).every(v=>v===0));
});
const first=bar(12,'2026-11-02T14:30:00Z',100,12,9),second=bar(15,'2026-11-02T14:31:00Z',300,15,12);
test('16 HLC3 volume-weighted approximation follows exact bar arithmetic',()=>match(m.vwapProxy([first,second]),[11,13.25]));
test('17 VWAP approximation resets on the next Eastern session day',()=>match(m.vwapProxy([first,second,bar(21,'2026-11-03T14:30:00Z',100,22,20)]),[11,13.25,21]));
test('18 zero-volume bar cannot distort an existing session VWAP',()=>match(m.vwapProxy([first,bar(80,'2026-11-02T14:31:00Z',0,90,70)]),[11,11]));
test('19 opening range is withheld before its two-minute boundary',()=>{
  const x=m.openingRange([bar(9,'2026-11-02T14:30:00Z',1,10,8),bar(10,'2026-11-02T14:31:00Z',1,12,7),bar(20,'2026-11-02T14:32:00Z',1,21,19)],2);
  match(x.upper,[null,null,12]);match(x.lower,[null,null,7]);
});
test('20 confirmed structure waits for future bar confirmation; no lookahead',()=>{
  const x=[10,11,15,11,10].map((v,i)=>bar(7,'2026-11-02T14:3'+i+':00Z',1,v,[5,4,3,4,5][i]));
  assert.equal(m.confirmedStructure(x.slice(0,4),2).length,0);
  assert.ok(m.confirmedStructure(x,2).some(v=>v.index===2&&v.confirmedAt===4&&v.kind==='high'));
});
