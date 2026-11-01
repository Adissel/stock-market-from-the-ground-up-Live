/* Unpaid read-only numerical cross-check: first-party Chart Studio values vs fixed fictional truth cases. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import '../assets/js/crownlight-indicator-math-v2.js';
import {hypotheticalExpectancy} from '../functions/_lib/talia-foundation-quant-v1.js';
import {sampleSharpeFromReturns} from '../functions/_lib/talia-research-math-v1.js';
const fixture=JSON.parse(readFileSync(new URL('../docs/research/master/formula-verification-fixtures-v1.json',import.meta.url),'utf8'));
assert.equal(fixture.status,'SOURCE_TEST_FIXTURES_UNGRADED_NO_EDITORIAL_APPROVAL');
assert.equal(fixture.cases.length,11);
const m=globalThis.CrownlightIndicatorMath;
assert(m&&typeof m.ema==='function','Must use existing shared chart math');
const near=(a,b)=>{assert.equal(typeof a,'number');assert.ok(Number.isFinite(a));assert.ok(Math.abs(a-b)<1e-9,JSON.stringify({actual:a,expected:b}))};
const sample=closes=>closes.map(close=>({close,high:close+1,low:close-1,volume:100}));
const printVWAP=(prints)=>{let size=0,notional=0;for(const p of prints){assert(Number.isFinite(p.price)&&p.price>=0&&Number.isFinite(p.shares)&&p.shares>=0);size+=p.shares;notional+=p.price*p.shares;}return size>0?{value:notional/size,totalShares:size,totalNotional:notional}:null;};
let passed=0;
for(const c of fixture.cases){
 const x=c.inputs,e=c.expected;
 switch(c.id){
 case 'SMA':{const a=m.sma(x.closes,x.period);assert(a[1]===null);near(a[e.firstValidIndex],12);near(a.at(-1),e.valueAtIndex3);break}
 case 'EMA':{const a=m.ema(x.closes,x.period);assert(a[1]===null);near(2/(x.period+1),e.alpha);near(a[2],e.seed);near(a.at(-1),e.valueAtIndex3);break}
 case 'VWAP_PRINTS':{const z=printVWAP(x.prints);for(const k of ['value','totalShares','totalNotional'])near(z[k],e[k]);assert.equal(printVWAP([]),null);break}
 case 'VWAP_OHLCV_PROXY':{const a=m.vwapProxy(x.bars);near(a.at(-1),e.value);assert(Math.abs(e.value-11.5)>0.1,'Proxy is not transaction VWAP');break}
 case 'RSI':{const a=m.rsi(sample(x.closes),x.period);assert(a[e.firstValidIndex-1]===null);near(a[e.firstValidIndex],100);near(a.at(-1),e.valueAtIndex4);break}
 case 'MACD':{const a=m.macd(sample(x.closes),x.fast,x.slow,x.signal);assert(a.line[e.firstLineIndex-1]===null);assert(a.signal[e.firstSignalIndex-1]===null);for(const [k,v] of [['line','lineAtIndex5'],['signal','signalAtIndex5'],['histogram','histogramAtIndex5']])near(a[k].at(-1),e[v]);break}
 case 'ATR':{const a=m.atr(x.bars,x.period);assert(a[e.firstValidIndex-1]===null);near(a[e.firstValidIndex],e.seed);near(a.at(-1),e.valueAtIndex3);break}
 case 'BOLLINGER':{const a=m.bollinger(sample(x.closes),x.period,x.multiplier);assert(a.middle[0]===null);near(a.middle.at(-1),e.middle);near(a.upper.at(-1),e.upper);near(a.lower.at(-1),e.lower);break}
 case 'SHARPE':{
  const got=sampleSharpeFromReturns(x.returns,x.riskFreePerPeriod);
  assert(got,'sample Sharpe returns finite case');
  near(got.n,e.n);near(got.mean,e.meanReturn);near(got.meanExcess,e.meanExcessReturn);
  near(got.sampleVariance,e.sampleVariance);near(got.sampleSD,e.sampleStandardDeviation);near(got.ratio,e.unannualizedSharpe);
  assert.equal(got.annualized,false);
  assert.equal(sampleSharpeFromReturns([.02,.02,.02],0),null);
  assert.equal(sampleSharpeFromReturns([.01],0),null);
  assert.equal(sampleSharpeFromReturns([.01,.03],NaN),null);
  break;
 }
 case 'EXPECTANCY':near(hypotheticalExpectancy(x.winProbability,x.gain,x.loss,x.cost),e.netPerTrade);break;
 case 'POSITION_SIZING':{assert(x.entry>x.stop&&x.stop>0&&x.capital>=0&&x.riskBudget>=0);const risk=x.entry-x.stop,shares=Math.floor(Math.min(x.riskBudget/risk,x.capital/x.entry));near(risk,e.perShareRisk);near(Math.floor(x.riskBudget/risk),e.riskLimitedShares);near(Math.floor(x.capital/x.entry),e.cashLimitedShares);near(shares,e.wholeShares);near(shares*risk,e.plannedStopRisk);break}
 default:throw Error('Unexpected research case '+c.id);
 }
 assert(c.working&&c.boundary&&c.guide&&c.inputs&&c.expected,'Missing worked example or uncertainty bound');
 passed++;
}
const reg=JSON.parse(readFileSync(new URL('../docs/research/master/master-source-registry-v1.json',import.meta.url),'utf8'));
assert.equal(reg.subjectEvidencePilot.length,11);
assert.deepEqual(new Set(reg.subjectEvidencePilot.map(x=>x.subject)),new Set(fixture.cases.map(x=>x.id)));
assert(reg.subjectEvidencePilot.every(x=>x.status==='REFERENCES_IDENTIFIED_NUMERICAL_ACCEPTANCE_PENDING'));
console.log('PASS first-party JavaScript numerical regression: '+passed+'/11 fictional method cases; no official grades, external feed or editorial approval.');
