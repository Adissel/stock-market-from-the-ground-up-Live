/* SMFGU-TALIA-FOUNDATION-MATH-001 v1.0 — source-only, original ungraded
 * fictional worked mathematics for existing public competency guide IDs.
 * No trades, private rubrics, member data, persistence, market feed, model or
 * vendor inference. This module owns examples, NOT curriculum identity.
 */
const money=n=>'$'+n.toFixed(2);
const qty=n=>n.toLocaleString('en-US');
const examples=Object.freeze({
 CANDLE_READING: Object.freeze([
  {o:10,h:10.6,l:9.8,c:10.4},
  {o:20.4,h:20.7,l:19.9,c:20}
 ]),
 VWAP_CONTEXT: Object.freeze([
  {prices:[10,10.2,10.4],volumes:[100,100,800]},
  {prices:[20,20.1,20.3],volumes:[400,400,200]}
 ]),
 EMA_CONTEXT: Object.freeze([
  {closes:[10,11,12,13]},
  {closes:[20,18,19,21]}
 ]),
 RISK_PER_SHARE: Object.freeze([
  {entry:10,stop:9.8},
  {entry:25,stop:24.75}
 ]),
 POSITION_SIZING: Object.freeze([
  {entry:10,stop:9.8,budget:20},
  {entry:25,stop:24.75,budget:50}
 ]),
 VOLUME_ANALYSIS: Object.freeze([
  {prior:[1000,2000],current:1500},
  {prior:[1000,2000],current:3000}
 ]),
 RISK_REWARD: Object.freeze([
  {entry:10,stop:9.8,target:10.4},
  {entry:10,stop:9.8,target:10.3}
 ])
});
export const FOUNDATION_WORKED_MATH_CODES=Object.freeze(Object.keys(examples));
export function foundationWorkedMath(code,question=''){
 const scenarios=examples[String(code||'')];
 if(!scenarios)return null;
 const alternate=/\b(?:try another|another (?:worked )?example|different (?:worked )?example)\b/i.test(String(question));
 const x=scenarios[alternate?1:0];
 const head=['Original fictional worked example — ungraded',
  'This is invented teaching data, not a live quote, historical replay, trading strategy, or assessment answer.'];
 const steps=[];
 if(code==='CANDLE_READING'){
  const body=Math.abs(x.c-x.o),range=x.h-x.l,upper=x.h-Math.max(x.o,x.c),lower=Math.min(x.o,x.c)-x.l;
  steps.push('1. Define one completed fictional candle: open '+money(x.o)+', high '+money(x.h)+', low '+money(x.l)+', close '+money(x.c)+'.',
   '2. Body size = |close − open| = '+money(body)+'; direction = '+(x.c>x.o?'bullish':x.c<x.o?'bearish':'doji')+'.',
   '3. Total range = high − low = '+money(range)+'.',
   '4. Upper wick = high − max(open, close) = '+money(upper)+'; lower wick = min(open, close) − low = '+money(lower)+'.',
   'Limitation: OHLC does not disclose whether the high happened before the low, who traded, or what the next candle will do.',
   'Try independently: change the fictional close while keeping the same high and low; recompute body and both wicks.');
 }else if(code==='VWAP_CONTEXT'){
  const products=x.prices.map((p,i)=>p*x.volumes[i]);
  const numerator=products.reduce((a,b)=>a+b,0);
  const volume=x.volumes.reduce((a,b)=>a+b,0);
  const estimate=numerator/volume;
  steps.push('1. Use three completed fictional bars whose high, low and close all equal their listed price: '+x.prices.map(money).join(', ')+'.',
   '2. Volumes in shares: '+x.volumes.map(qty).join(', ')+'. Each bar typical price = (high + low + close) / 3.',
   '3. Sum(typical price × shares) = '+products.map(money).join(' + ')+' = '+money(numerator)+' price×share units.',
   '4. Total shares = '+x.volumes.map(qty).join(' + ')+' = '+qty(volume)+' shares.',
   '5. Completed-bar HLC3×volume VWAP proxy = '+money(numerator)+' ÷ '+qty(volume)+' = '+money(estimate)+' per share.',
   'Limitation: this is a bar-volume proxy, not a tick-exact execution VWAP; real VWAP depends on the feed, session, source and underlying prints.',
   'Try independently: double the final fictional bar volume, then recompute both numerator and denominator. Does the proxy move toward its price?');
 }else if(code==='EMA_CONTEXT'){
  const p=3,seed=x.closes.slice(0,p).reduce((a,b)=>a+b,0)/p,alpha=2/(p+1);
  const next=alpha*x.closes[p]+(1-alpha)*seed;
  steps.push('1. Declare an illustrative three-bar EMA and four completed fictional closing prices: '+x.closes.map(money).join(', ')+'.',
   '2. Initial EMA at completed bar 3 = SMA(three closes) = ('+x.closes.slice(0,3).map(money).join(' + ')+') ÷ 3 = '+money(seed)+'.',
   '3. Smoothing factor α = 2 ÷ (period + 1) = 2 ÷ 4 = '+alpha.toFixed(2)+'.',
   '4. EMA at completed bar 4 = α × new close + (1 − α) × prior EMA = '+alpha.toFixed(2)+' × '+money(x.closes[3])+' + '+(1-alpha).toFixed(2)+' × '+money(seed)+' = '+money(next)+'.',
   'Limitation: a three-bar teaching example is not EMA 9, EMA 20 or EMA 200. Those require their declared period and sufficient earlier completed closes. An EMA is not an entry signal.',
   'Try independently: replace only the fourth fictional close and recompute the next EMA using the same earlier seed.');
 }else if(code==='RISK_PER_SHARE'||code==='POSITION_SIZING'){
  const distance=Math.abs(x.entry-x.stop);
  steps.push('1. Hypothetical long entry '+money(x.entry)+' and invalidation/stop reference '+money(x.stop)+'.',
   '2. Planned price distance per share = |entry − stop| = '+money(distance)+' per share.',
   ...(code==='POSITION_SIZING'?[
    '3. Fictional maximum planned price-risk budget = '+money(x.budget)+'.',
    '4. Mathematical share ceiling = floor('+money(x.budget)+' ÷ '+money(distance)+') = '+qty(Math.floor(x.budget/distance))+' shares, BEFORE transaction costs, margin, spread, slippage and buying-power constraints.'
   ]:['3. For 10 illustrative shares, price-distance risk = 10 × '+money(distance)+' = '+money(10*distance)+' before execution costs.']),
   'Limitation: stop orders do not guarantee a fill at the stop price; this is not a position-size recommendation or verified loss cap.',
   'Try independently: move the fictional invalidation price farther from entry and recalculate the price-distance risk'+(code==='POSITION_SIZING'?' and share ceiling':'')+'.');
 }else if(code==='VOLUME_ANALYSIS'){
  const avg=x.prior.reduce((a,b)=>a+b,0)/x.prior.length,ratio=x.current/avg;
  steps.push('1. Completed fictional volumes for two preceding comparable bars: '+x.prior.map(qty).join(' and ')+' shares.',
   '2. Their arithmetic mean = ('+x.prior.map(qty).join(' + ')+') ÷ 2 = '+qty(avg)+' shares/bar.',
   '3. Current completed fictional bar = '+qty(x.current)+' shares.',
   '4. Relative-to-this-sample volume = '+qty(x.current)+' ÷ '+qty(avg)+' = '+ratio.toFixed(2)+'×.',
   'Limitation: this is a short within-sample comparison, NOT institutional-flow evidence or time-of-day relative volume. Comparable times, venues, data feeds and sessions must be specified.',
   'Try independently: change one preceding bar volume and recompute the baseline before interpreting the ratio.');
 }else if(code==='RISK_REWARD'){
  const risk=Math.abs(x.entry-x.stop),reward=x.target-x.entry,rr=reward/risk;
  steps.push('1. Fictional planned long entry '+money(x.entry)+', invalidation '+money(x.stop)+' and hypothetical target '+money(x.target)+'.',
   '2. Planned distance to invalidation = '+money(x.entry)+' − '+money(x.stop)+' = '+money(risk)+' per share.',
   '3. Planned distance to target = '+money(x.target)+' − '+money(x.entry)+' = '+money(reward)+' per share.',
   '4. Planned reward ÷ planned risk = '+money(reward)+' ÷ '+money(risk)+' = '+rr.toFixed(2)+':1, before costs.',
   'Limitation: a favorable planned ratio does not imply a success probability, that the target will be reached, or that the stop will fill.',
   'Try independently: change the hypothetical target without changing the invalidation; recompute the ratio.');
 }
 return [...head,...steps,'Independent transfer is ungraded: write each input, its unit, the calculation, what it can establish and what it cannot establish.'].join('\n\n');
}
