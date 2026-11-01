/* Section C: independent Decimal-vs-production-math boundary cases.
 * Explicitly fictional, no external data, grading, network or member changes. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const expected=JSON.parse(execFileSync('python3',
 ['scripts/qa/section_c_indicator_edge_reference_v1.py'],{encoding:'utf8',timeout:8000}));
const ctx={window:{},Intl,console};
vm.createContext(ctx);
vm.runInContext(readFileSync('assets/js/crownlight-indicator-math-v2.js','utf8'),ctx);
const m=ctx.window.CrownlightIndicatorMath;
assert(m,'Use existing production mathematical implementation');
const eq=(name,got,want)=>{
 assert.equal(got.length,want.length,name+' size');
 for(let i=0;i<got.length;i++){
  if(want[i]===null){assert.equal(got[i],null,name+' missing at '+i);continue}
  assert(Number.isFinite(got[i])&&Math.abs(got[i]-want[i])<1e-10,
   name+' at '+i+': '+got[i]+' vs '+want[i]);
 }
};
eq('SMA full-window null handling',m.sma([1,2,null,4,5,6],2),expected.sma_gapped);
eq('EMA post-seed missing observation pause',
 m.ema([1,2,3,null,5,6],3),expected.ema_gapped);
eq('EMA incomplete first seed',m.ema([1,null,3,4,5,6],3),expected.ema_missing_seed);
eq('RSI flat series neutral boundary',m.rsi(Array.from({length:5},()=>({close:10})),3),expected.rsi_flat);
const t=Date.UTC(2024,4,7,13,29);
const raw=[
 {time:new Date(t),open:10,high:10,low:10,close:10,volume:4},
 {time:new Date(t+60000),open:20,high:20,low:20,close:20,volume:2},
 {time:new Date(t+120000),open:30,high:30,low:30,close:30,volume:0}
];
eq('Premarket to regular session reset and zero volume',m.vwapProxy(raw),
 expected.vwap_pre_regular_zero_volume);
assert.equal(m.session(raw[0]).kind,'pre');
assert.equal(m.session(raw[1]).kind,'regular');
const two=[{high:10,low:8,close:9},{high:13,low:10,close:12}];
eq('True range price gap with Wilder seed',m.atr(two,2),
 [null,expected.atr_two_bar_gap_seed]);
const constant=Array.from({length:3},()=>({close:5,high:5,low:5}));
const bb=m.bollinger(constant,3,2);
for(const key of ['middle','upper','lower'])eq('BB zero variance '+key,bb[key],expected.bb_constant[key]);
assert(Math.abs(expected.vwap_trade_print-19)<1e-12);
assert(Math.abs(expected.vwap_bar_hlc3-16.666666666666668)<1e-12);
assert.notEqual(expected.vwap_trade_print,expected.vwap_bar_hlc3,
 'Trade-level VWAP cannot be inferred from a bar HLC3 alone');
assert(m.ema(Array.from({length:199},()=>1),200).every(v=>v===null));
console.log('PASS Section C independent Python Decimal vs JS: SMA/EMA gaps, missing seeds, RSI flat, VWAP sessions, ATR gaps, zero-volatility bands, and true/proxy VWAP');
