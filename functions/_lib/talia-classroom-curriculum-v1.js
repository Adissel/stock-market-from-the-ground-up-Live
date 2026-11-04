/* Crownlight Talia curriculum v1 — original, ungraded, source-only lessons.
 * No third-party screen copies, licensed feeds, trading signals, hidden bars,
 * official grading, commercial entitlement mutation, or generative inference.
 */
export const TEACHING_DEPTHS=Object.freeze(['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE']);
export const LESSON_PHASES=Object.freeze(['explain','demonstrate','practice','correct','transfer']);
export const TUTOR_LESSONS=Object.freeze([
 {id:'candlesticks',title:'Reading candlesticks',chart:true},
 {id:'vwap',title:'Understanding VWAP',chart:true},
 {id:'ema',title:'Moving averages and EMA',chart:true},
 {id:'scanner',title:'Building a stock scanner',chart:false},
 {id:'volume',title:'Price and volume',chart:true},
 {id:'structure',title:'Market structure and risk',chart:true}
]);
const CATALOG={
 candlesticks:{
  concept:'A completed candle records open, high, low, and close over one specified interval. Its body is the absolute distance between open and close; its full range is high minus low.',
  example:'Original simulated example: open $31.00, high $32.50, low $30.50, close $32.00. Body = |32−31| = $1.00; range = 32.50−30.50 = $2.00; body is 50% of the full range.',
  counter:'A green candle is evidence of a close above its open. It cannot establish what the next candle will do.',
  challenge:'From a completed candle with open $20.00, high $20.80, low $19.80 and close $20.40, identify body, range and body percentage.',
  transfer:'Compare a narrow-body candle with a wide-range candle. Explain what is observable, what remains uncertain, and why an entry would require additional evidence.',
  advanced:'Compare relative body size, upper/lower wicks and successive completed bars. A larger wick alone is not proof of rejection or future reversal.',
  professional:'Test the inference against alternate timeframes, session boundaries, volatile openings and incomplete-bar bias. Separate description from a conditional hypothesis.',
  enterprise:'Specify timestamp alignment, OHLC data validation, split adjustment policy, missing intervals and reproducible replay assumptions before any aggregate candle inference.'
 },
 vwap:{
  concept:'Trade-print VWAP is total traded dollars divided by total traded shares over the chosen session. A candle-derived HLC3 volume-weighted estimate is a proxy, not exact trade-print VWAP.',
  example:'Original simulated transactions: 200 shares at $8 and 100 shares at $10. Dollar total = 200×8 + 100×10 = $2,600; shares = 300; VWAP = $8.6667 per share.',
  counter:'A price above a VWAP estimate does not guarantee continuation or define a suitable entry. A bar proxy must not be labeled exact transaction VWAP.',
  challenge:'Calculate trade-print VWAP for 100 shares at $10 and 300 shares at $12. State units and show your subtotals.',
  transfer:'Compare exact trade-print VWAP with a completed-candle proxy. Identify which additional trade-level data would be needed to measure the approximation error.',
  advanced:'Show incremental dollar×share subtotals; distinguish session reset, nonzero volume, chart timeframe and weighted versus simple average.',
  professional:'Evaluate session definitions, thin liquidity, crossing bars and proxy error. Compare conditions where the same last price is above one reference but below another.',
  enterprise:'Define a reproducible VWAP computation from event-time trade prints with corrections, sale-condition eligibility, clock boundaries, rights checks and missing-trade safeguards.'
 },
 ema:{
  concept:'An exponential moving average assigns greater weight to recent observations. Its period and warmup determine what the displayed line can support.',
  example:'For EMA 9, smoothing factor = 2/(9+1) = 0.20. If a properly warmed prior EMA is $10.00 and the latest completed close is $11.00, new EMA = 0.20×11 + 0.80×10 = $10.20.',
  counter:'An EMA crossover is a delayed description of selected closes, not proof that a future trade will succeed.',
  challenge:'Given previous EMA 9 of $25.00 and a newly completed close of $26.00, calculate the next EMA. State the smoothing factor.',
  transfer:'Compare EMA 9 and EMA 20 on the same completed bars. Explain warmup, possible lag and what additional evidence would challenge an interpretation.',
  advanced:'Compare lookback choices, valid warmup, line slopes and paired EMA conditions. Inspect what changes when one candle is removed.',
  professional:'Study crossover whipsaws, volatility regimes, parameter sensitivity and multi-timeframe disagreement without using future candles.',
  enterprise:'Specify indicator initialization, historical continuity, corporate-action adjustment, reproducible parameter sweeps and out-of-sample validation to avoid overfitting.'
 },
 scanner:{
  concept:'A scanner filters observations using explicit rules. AND requires every condition to hold; OR allows at least one. It identifies candidates for education, not validated buy signals.',
  example:'Original classroom filter: price at least $0.10 AND price at most $6.50 AND observed price change at least 8% AND observed volume at least 10,000. Add a separate halted-status rule only when that field is confirmed and timestamped.',
  counter:'A halted symbol may be impossible to trade at the quoted price. Thin liquidity, stale values and missing fields can make an apparent match unreliable.',
  challenge:'A symbol has price $4.20, change 9% and volume 12,000. Which four numeric rules does it satisfy? What happens if the volume field is missing?',
  transfer:'Rewrite the classroom filter with OR groups. Name one possible false positive and explain how to verify the observation before drawing conclusions.',
  advanced:'Build nested AND/OR/NOT groups, inclusive boundaries and explicit missing-data behavior. Compare a percent change value with the correct session baseline.',
  professional:'Compare filter configurations on distinct simulated cases; study false positives, time-of-day changes, trading halts and cross-sectional selection bias.',
  enterprise:'Specify the scanner evaluation contract: source provenance, event-time timestamps, exchange status semantics, null handling, unit normalization and repeatable backtests without lookahead.'
 },
 volume:{
  concept:'Volume counts eligible observed shares or trades over a stated interval. The classroom chart may use simulated proxy volume, which is not an exchange print.',
  example:'Simulated bars with volume 200, 600 and 400 have a three-bar simple average of (200+600+400)/3 = 400 units per bar. Compare each bar with 400 rather than predicting a next close.',
  counter:'A large volume bar does not by itself establish whether buyers or sellers were in control. Simulated proxy volume is not suitable for claims about actual liquidity.',
  challenge:'If three completed bars show 300, 600 and 900 units, calculate their average and identify the bar above the average.',
  transfer:'Compare equal-price-change bars with different volumes. State two possible explanations and what market-data rights or source evidence would be necessary to test them.',
  advanced:'Compare relative volume, rolling-window length, missing intervals, outlier handling and session-specific baselines.',
  professional:'Examine apparent volume spikes around opens, closes, halted markets and thinly traded securities, distinguishing a relative statistic from a market interpretation.',
  enterprise:'Define eligible trade conditions, corrections, odd lots, timestamp ordering, venue coverage and source-rights audit before any research-grade volume calculation.'
 },
 structure:{
  concept:'Market structure compares completed swing observations such as higher highs, higher lows, lower highs and lower lows. A single point cannot confirm a continuing trend.',
  example:'Simulated completed swing highs of $20.00 then $20.60 and swing lows of $19.50 then $19.90 form a candidate higher-high/higher-low sequence. Confirmation depends on the selected swing rule.',
  counter:'A candidate breakout is not the same as a completed confirmed structure change. Define invalidation and keep NO TRADE available.',
  challenge:'Completed swing highs are $30.00 and $29.70; lows are $29.30 and $29.10. Describe the directional comparison without predicting the next swing.',
  transfer:'Compare two valid swing-identification methods. Explain how they can disagree and when incomplete confirmation should lead to NO TRADE.',
  advanced:'Build explicit swing-confirmation rules, check lag and distinguish a pullback from a reversal with multiple completed observations.',
  professional:'Test alternative structure definitions across timeframes and volatility regimes, recording the rule, timestamp, invalidation and false-break scenarios.',
  enterprise:'Design an auditable past-only structure detector with deterministic tie-breaking, lookback warmup, swing confirmation latency and out-of-sample evaluation.'
 }
};
const normalize=x=>String(x||'').trim().toUpperCase();
export const depthIndex=depth=>TEACHING_DEPTHS.indexOf(normalize(depth));
export const availableDepths=max=>{
 const index=depthIndex(max);return index<0?['FOUNDATION']:TEACHING_DEPTHS.slice(0,index+1);
};
export function buildTaliaLesson({topic,depth='FOUNDATION',phase='explain'}={}){
 if(!TUTOR_LESSONS.some(t=>t.id===topic)||depthIndex(depth)<0||!LESSON_PHASES.includes(phase))
  throw Object.assign(new Error('Unrecognized classroom topic, teaching depth or step.'),{status:400});
 const entry=CATALOG[topic];
 const name=TUTOR_LESSONS.find(t=>t.id===topic).title;
 const extension=depth==='FOUNDATION'?'':depth==='ADVANCED'?entry.advanced:
  depth==='PROFESSIONAL'?entry.advanced+'\n\n'+entry.professional:
  entry.advanced+'\n\n'+entry.professional+'\n\n'+entry.enterprise;
 const intro='Talia · '+name+' · '+depth.charAt(0)+depth.slice(1).toLowerCase()+' depth\n\n';
 const teaching={
  explain:entry.concept+'\n\n'+(extension?extension+'\n\n':'')+'What would you like me to clarify before the worked example?',
  demonstrate:'Watch me work through an original, simulated example.\n\n'+entry.example+'\n\n'+(extension?extension+'\n\n':'')+'Note: '+entry.counter,
  practice:'Your turn — ungraded.\n\n'+entry.challenge+'\n\nExplain your steps; I can review your reasoning without assigning a grade. No future chart values are disclosed.',
  correct:'Check the reasoning, not just the result.\n\n'+entry.counter+'\n\nIf a calculation was wrong, write your working and compare its units, inputs and completed evidence with this reference: '+entry.example,
  transfer:'Use a different simulated case.\n\n'+entry.transfer+'\n\n'+(extension?extension+'\n\n':'')+'Identify uncertainty, a counterexample and when NO TRADE is the appropriate conclusion.'
 };
 return {topic,depth,phase,title:name,answer:intro+teaching[phase],sourceLabel:'Original Crownlight source-only classroom lesson',graded:false,officialGrade:false,masteryAwarded:false,hasFutureBars:false,commercialPremiumFeaturesGranted:false};
}
