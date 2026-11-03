// Seven researched indicator methodologies; all inputs are authored fictional examples.
// Source-method and numeric integrity only. NOT licensed-feed, screen-reader, or production evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const engine=require('../assets/js/learning-indicators-v1.js');
const ledger=JSON.parse(readFileSync(new URL('../data/learning-lab-indicator-methods-research-v1.json',import.meta.url),'utf8'));
const document=readFileSync(new URL('../docs/qa/2026-11-03_LEARNING_LAB_7_INDICATOR_METHODOLOGY_RESEARCH_V1.md',import.meta.url),'utf8');
const near=(actual,expected)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<1e-8,String(actual)+' != '+String(expected));
test('Research manifest fixes seven unambiguous methods and does not claim a public release',()=>{
 assert.equal(ledger.schema,'smfgu.learning-lab.indicator-method-research.v1');
 assert.equal(ledger.records.length,7);
 assert.deepEqual(ledger.records.map(x=>x.id),['EMA','RSI','MACD','ATR','BOLLINGER','VWAP-TRADE','VWAP-HLC3']);
 assert.equal(new Set(ledger.records.map(x=>x.id)).size,7);
 assert.equal(ledger.rights.commercial_republication_cleared,false);
 assert.equal(ledger.quality.authenticated_member_accepted,false);
 assert.equal(ledger.quality.market_data_rights_accepted,false);
 assert.equal(ledger.status.includes('NOT_A_PREMIUM_RELEASE'),true);
});
for(const record of ledger.records){
 test('Method source '+record.id+' has exact official/topic-specific URL, convention and rights hold',()=>{
  assert.match(record.url,/^https:\/\//);
  assert.ok(record.url.includes('stockcharts.com')||record.url.includes('thinkorswim.com')||record.url.includes('tradingview.com'));
  assert.equal(record.accessDate,'2026-11-03');
  assert.ok(record.method.length>30 && record.inputs.length>20 && record.warmup.length>25 && record.limitation.length>35);
  assert.equal(record.rightsStatus,'RESEARCH_REFERENCE_ONLY_NO_REPUBLICATION_CLEARANCE');
  assert.ok(document.includes(record.url));
  assert.ok(document.includes('| '+record.id+' |'));
 });
}
test('SMA-seeded EMA reference exactly matches the existing teaching implementation',()=>{
 const x=ledger.records[0].example;near(engine.ema(x.closes,x.period).at(-1),x.expected_final);
 assert.deepEqual(engine.ema(x.closes,x.period).slice(0,2),[null,null]);
});
test('Wilder RSI reference matches final smoothed gains/losses and cannot read future closes',()=>{
 const x=ledger.records[1].example;near(engine.rsi(x.closes,x.period).values[2],x.expected_final);
 const more=engine.rsi([...x.closes,100],x.period);
 assert.deepEqual(more.history.slice(0,x.closes.length),engine.rsi(x.closes,x.period).history);
});
test('MACD source distinguishes line, signal, histogram, and withheld warmup',()=>{
 const x=ledger.records[2].example,r=engine.macd(x.closes,x.fast,x.slow,x.signal);
 near(r.line.at(-1),x.expected_line);near(r.signal.at(-1),x.expected_signal);near(r.histogram.at(-1),x.expected_histogram);
 assert.equal(r.signal[5],null);
});
test('ATR source distinguishes true range gaps and Wilder smoothing',()=>{
 const x=ledger.records[3].example,r=engine.atr(x.bars,x.period);
 near(r.history.at(-1),x.expected_final);
 assert.deepEqual(r.tr,[2,2,3,3,3]);
});
test('Bollinger source uses population rather than sample deviation and declares multiplier',()=>{
 const x=ledger.records[4].example,r=engine.bollinger(x.closes,x.period,x.k);
 near(r.center.at(-1),x.expected_middle);near(r.sd.at(-1),x.expected_sigma);near(r.upper.at(-1),x.expected_upper);
});
test('Transaction-print VWAP reference uses actual size-weighted prices, no HLC3 substitution',()=>{
 const x=ledger.records[5].example;
 const volume=x.trades.reduce((sum,t)=>sum+t.volume,0);
 const vwap=x.trades.reduce((sum,t)=>sum+t.price*t.volume,0)/volume;
 near(vwap,x.expected_final);
});
test('Single-bar HLC3 VWAP proxy is not exact trade VWAP for the same tape',()=>{
 const x=ledger.records[6].example;
 const volume=x.bars.reduce((sum,b)=>sum+b.v,0);
 const proxy=x.bars.reduce((sum,b)=>sum+(b.h+b.l+b.c)/3*b.v,0)/volume;
 near(proxy,x.expected_final);
 assert.ok(Math.abs(proxy-ledger.records[5].example.expected_final)>0.1);
 assert.match(document,/cannot be presented as an exact reconstruction/i);
});
test('Owner historical 5/8 baseline explicitly superseded, independent technical signoff still open',()=>{
 const owner=readFileSync(new URL('../docs/learning/SMFGU-BASIC-OWNER-APPROVAL-20261102.md',import.meta.url),'utf8');
 assert.match(owner,/historical 5\/8 snapshot/i);
 assert.match(owner,/8\/8 source-integrated/i);
 assert.match(owner,/independent authenticated-member.*OPEN/i);
 assert.match(owner,/v1\.2/);
});
test('No protected grading or licensed market-data ingestion introduced by the method register',()=>{
 assert.ok(!document.includes('licensed data may be distributed'));
 assert.equal(ledger.quality.assistive_technology_accepted,false);
 assert.equal(ledger.scope.lab_catalogue,419);
 assert.equal(ledger.scope.existing_engine_methods,5);
 assert.equal(ledger.scope.independent_vwap_distinctions,2);
});
