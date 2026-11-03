import test from 'node:test';
import assert from 'node:assert/strict';
import {C,bars,args} from './_crownlight_scanner_wave5_helper.mjs';
const E=C.CrownlightScannerHistoricalV5,near=(a,b)=>Math.abs(a-b)<1e-10*Math.max(1,Math.abs(b));
test('strict five-minute visible-only research and two prior full observed sessions',()=>{
 const r=E.evaluate(args),close=12.44,prev=12.42,twoDayBasis=10.77;
 assert.equal(r.available,true);assert.equal(r.observedBars,159);
 assert.equal(r.visibleCurrentBars,3);assert.equal(Date.parse(r.lastCompletedAt),Date.parse(args.asOf));
 assert.ok(near(r.row.price,close));
 assert.ok(near(r.row.change_5m_pct,(close/prev-1)*100));
 assert.ok(near(r.row.change_2d_pct,(close/twoDayBasis-1)*100));
 assert.ok(near(r.row.change_pct,(close/11.97-1)*100));
 assert.deepEqual(Array.from(r.previousCompleteSessions),['2026-10-28','2026-10-29']);
 assert.equal(r.sourceStatus,'UNVERIFIED_MEMBER_SUPPLIED_OHLCV');
 assert.equal(r.row.ema_200,null);assert.notEqual(r.row.bar_vwap_proxy,null);
 assert.equal(r.row.vwap,undefined);assert.equal(r.tradeSignal,false);
 assert.equal(r.marketDataVerified,false);assert.equal(r.liveFeed,false);
 assert.ok(r.visibleBars.every(b=>Date.parse(b.time)+E.FRAME<=Date.parse(args.asOf)));
});
test('future append cannot change even one visible indicator or rule outcome',()=>{
 const first=E.evaluate(args);
 const after={...bars.at(-1),time:new Date('2026-11-02T14:30:00Z'),close:999999,open:999999,high:999999,low:999999};
 const second=E.evaluate({...args,bars:[...bars,after]});
 assert.equal(JSON.stringify(first),JSON.stringify(second));
 const rule={type:'rule',field:'price',op:'GT',compareField:'ema_9'};
 assert.equal(E.evaluateRule(first,rule),E.evaluateRule(second,rule));
});
test('first bar and incomplete source coverage preserve UNKNOWN',()=>{
 const start=E.evaluate({...args,asOf:'2026-10-28T13:35:00Z'});
 assert.equal(start.row.change_5m_pct,null);
 assert.equal(start.row.change_2d_pct,null);assert.equal(start.row.ema_9,null);
 assert.equal(E.evaluateRule(start,{type:'rule',field:'change_2d_pct',op:'GTE',value:0}),'UNKNOWN');
 const incomplete=E.evaluate({...args,bars:bars.slice(1)});
 assert.equal(incomplete.row.change_2d_pct,null);
 assert.equal(incomplete.row.ema_9,null);
});
test('missing RVOL, float, spread never silently become zero',()=>{
 const a=E.evaluate(args);
 assert.equal(a.row.rvol,null);assert.equal(a.row.float,null);assert.equal(a.row.spread_pct,null);
 const r=E.evaluate({...args,metadata:{rvol:'2.3',float:'10000000',spread_pct:'1.5'}});
 assert.equal(r.row.rvol,2.3);assert.equal(r.row.float,10000000);
 assert.equal(r.row.spread_pct,1.5);
 assert.equal(E.evaluateRule(r,{type:'rule',field:'ema_9',op:'GT',value:0}),'PASS');
 assert.equal(E.evaluateRule(a,{type:'not',child:{type:'rule',field:'rvol',op:'GT',value:0}}),'UNKNOWN');
});
test('source, cutoff, metadata and ticker validation',()=>{
 for(const bad of ['2026-10-30','2026-10-30T13:45','2026-10-30T13:45:00','bad'])
  assert.throws(()=>E.evaluate({...args,asOf:bad}),/cutoff|timestamp/);
 assert.throws(()=>E.evaluate({...args,symbol:'../SECRET'}),/ticker/);
 assert.throws(()=>E.evaluate({...args,sourceNote:'short'}),/source/);
 assert.throws(()=>E.evaluate({...args,metadata:{apiKey:'secret'}}),/metadata/);
 assert.throws(()=>E.evaluate({...args,metadata:{float:'nan'}}),/float/);
 assert.throws(()=>E.evaluate({...args,metadata:{rvol:'-1'}}),/RVOL/);
 assert.throws(()=>E.evaluate({...args,bars:[]}),/observations/);
});
test('missing five-minute candles and false historical completeness',()=>{
 const cut=bars.filter((b,i)=>i!==15);
 const r=E.evaluate({...args,bars:cut});
 assert.equal(r.row.change_2d_pct,null);assert.equal(r.row.ema_9,null);
 const gap=bars.filter((b,i)=>i!==157);
 const z=E.evaluate({...args,bars:gap});
 assert.equal(z.row.change_5m_pct,null);assert.equal(z.row.bar_vwap_proxy,null);
});
test('50 explicit cutoff steps cannot disclose a future completed candle',()=>{
 for(let i=1;i<=50;i++){
  const at=new Date(bars[i-1].time.getTime()+E.FRAME).toISOString();
  const r=E.evaluate({...args,asOf:at});
  assert.equal(r.available,true);assert.equal(r.observedBars,i);
  assert.equal(r.lastCompletedAt,at);
  assert.ok(r.visibleBars.every(b=>Date.parse(b.time)+E.FRAME<=Date.parse(at)));
 }
});
