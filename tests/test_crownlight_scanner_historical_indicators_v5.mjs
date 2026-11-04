import test from 'node:test';
import assert from 'node:assert/strict';
import {C,args} from './_crownlight_scanner_wave5_helper.mjs';
const E=C.CrownlightScannerHistoricalV5,close=(a,b)=>Math.abs(a-b)<1e-9*Math.max(1,Math.abs(b));
test('EMA SMA-seeding, Wilder RSI and ATR with independent numerical examples',()=>{
 const I=C.CrownlightIndicatorMath,S=C.GroundUpScannerV014145;
 assert.ok(close(I.ema([10,11,12],2).at(-1),11.5));
 const up=Array.from({length:16},(_,i)=>({close:10+i,high:10+i+.5,low:10+i-.5}));
 assert.equal(I.rsi(up,14).at(-1),100);
 const flat=Array.from({length:16},()=>({close:10,high:11,low:9,volume:10}));
 assert.equal(I.rsi(flat,14).at(-1),50);
 assert.ok(close(S.wilderAtr(flat,14).value,2));
 const proxy=S.typicalPriceVwap([{high:12,low:9,close:9,volume:1},{high:22,low:19,close:19,volume:3}]);
 assert.ok(close(proxy.value,17.5));
 assert.equal(proxy.source,'TYPICAL_PRICE_OHLCV_APPROXIMATION');
});
test('EMA 9/20/200 warmup is not padded with future data',()=>{
 const full=E.evaluate({...args,asOf:'2026-10-30T17:30:00Z'});
 assert.notEqual(full.row.ema_9,null);assert.notEqual(full.row.ema_20,null);assert.notEqual(full.row.ema_200,null);
 const early=E.evaluate({...args,asOf:'2026-10-28T14:05:00Z'});
 assert.equal(early.row.ema_9,null);assert.equal(early.row.ema_20,null);assert.equal(early.row.ema_200,null);
});
test('five-minute change, two-session denominator and prior volume',()=>{
 const r=E.evaluate(args).row;
 assert.ok(close(r.change_5m_pct,(12.44/12.42-1)*100));
 assert.ok(close(r.change_2d_pct,(12.44/10.77-1)*100));
 assert.equal(r.volume,3600);assert.equal(r.yesterday_volume,78*1100);
 assert.ok(close(r.bar_vwap_proxy,12.42-0.02/3));
});
test('the HLC3 proxy is never treated as provided trade-print VWAP',()=>{
 const F=C.CrownlightScannerRulesV1.FIELDS;
 for(const k of ['bar_vwap_proxy','ema_9','ema_20','ema_200','rsi_14','atr_14'])assert.equal(typeof F[k],'string');
 assert.match(F.bar_vwap_proxy,/not trade VWAP/);
 const row=E.evaluate(args).row;
 assert.equal(C.CrownlightScannerRulesV1.read(row,'vwap'),null);
 assert.ok(close(C.CrownlightScannerRulesV1.read(row,'bar_vwap_proxy'),12.42-0.02/3));
});
