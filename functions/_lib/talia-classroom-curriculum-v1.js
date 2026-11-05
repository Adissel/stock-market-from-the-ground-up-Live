/* Crownlight Talia curriculum v1 — original, ungraded, source-only lessons.
 * No third-party screen copies, licensed feeds, trading signals, hidden bars,
 * official grading, commercial entitlement mutation, or generative inference.
 */
import {buildTaliaChartLesson} from './talia-chart-teaching-v1.js';
export const TEACHING_DEPTHS=Object.freeze(['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE']);
export const LESSON_PHASES=Object.freeze(['explain','demonstrate','practice','correct','transfer']);
export const TUTOR_LESSONS=Object.freeze([
 {id:'candlesticks',title:'Reading candlesticks',chart:true,objective:'Calculate what a completed candle shows without predicting the next candle.',evidence:'Open, high, low, close, body, range and wicks.',limitation:'A candle describes past prices, not the next move.'},
 {id:'vwap',title:'Understanding VWAP',chart:true,objective:'Calculate weighted average prices and distinguish exact trade-print VWAP from bar proxies.',evidence:'Trade price, share quantity, traded dollars and session boundary.',limitation:'HLC3 bar-based VWAP is an approximation, never an exact reconstruction.'},
 {id:'ema',title:'Moving averages and EMA',chart:true,objective:'Explain EMA weighting, compute one update and recognize the effect of warmup.',evidence:'Completed closes, EMA period, prior EMA and smoothing factor.',limitation:'Crossovers lag; early values depend on initialization.'},
 {id:'scanner',title:'Building a stock scanner',chart:false,objective:'Construct AND/OR filters and detect missing or stale observations.',evidence:'Rule thresholds, observed fields, timestamps and halt status.',limitation:'A scanner match is a research candidate, not a trade recommendation.'},
 {id:'volume',title:'Price and volume',chart:true,objective:'Compute an average and interpret volume with its observation window.',evidence:'Completed bars, interval units and the comparison baseline.',limitation:'Simulated volume does not establish real order flow or liquidity.'},
 {id:'structure',title:'Market structure and risk',chart:true,objective:'Compare completed highs and lows while respecting confirmation and invalidation.',evidence:'Confirmed swing highs, lows, timestamps and swing-selection rule.',limitation:'A single swing does not prove a trend or a future breakout.'}
]);
const CATALOG={
 candlesticks:{
  concept:'A completed candle records open, high, low, and close over one specified interval. Its body is the absolute distance between open and close; its full range is high minus low.',
  example:'Original simulated example: open $31.00, high $32.50, low $30.50, close $32.00. Body = |32−31| = $1.00; range = 32.50−30.50 = $2.00; body is 50% of the full range.',
  counter:'A green candle is evidence of a close above its open. It cannot establish what the next candle will do.',
  challenge:'From a completed candle with open $20.00, high $20.80, low $19.80 and close $20.40, identify body, range and body percentage.',
  solution:'Worked check for this practice candle: body = |$20.40 − $20.00| = $0.40; range = $20.80 − $19.80 = $1.00; body percentage = ($0.40 / $1.00) × 100 = 40%. The candle closed above its open; this does not predict the next candle.',
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
  solution:'Worked check for the practice trades: 100 × $10 = $1,000; 300 × $12 = $3,600; total traded dollars = $4,600; shares = 400; exact trade-print VWAP = $4,600 / 400 = $11.50 per share. These are transaction prices, not HLC3 proxies.',
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
  solution:'Worked check for the EMA 9 practice: alpha = 2/(9+1) = 0.20; next EMA = 0.20 × $26.00 + 0.80 × $25.00 = $25.20. This assumes the previous EMA was already initialized and sufficiently warmed.',
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
  solution:'Worked check for the practice symbol: $4.20 is at least $0.10 and at most $6.50; 9% is at least 8%; volume 12,000 is at least 10,000. All four numeric AND rules pass on these supplied values. Missing volume means the full AND result cannot be verified; do not silently treat missing as passing.',
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
  solution:'Worked check for the three practice bars: (300 + 600 + 900) / 3 = 600 volume units per completed bar. The 900-unit bar is above the average; the 300-unit bar is below it; the 600-unit bar equals it. These simulated units do not identify buyer or seller intent.',
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
  solution:'Worked check for the completed swings: $29.70 is lower than $30.00, so the second high is a lower high; $29.10 is lower than $29.30, so the second low is a lower low. This is an observed directional comparison, not a prediction. Confirmation still depends on the swing rule.',
  transfer:'Compare two valid swing-identification methods. Explain how they can disagree and when incomplete confirmation should lead to NO TRADE.',
  advanced:'Build explicit swing-confirmation rules, check lag and distinguish a pullback from a reversal with multiple completed observations.',
  professional:'Test alternative structure definitions across timeframes and volatility regimes, recording the rule, timestamp, invalidation and false-break scenarios.',
  enterprise:'Design an auditable past-only structure detector with deterministic tie-breaking, lookback warmup, swing confirmation latency and out-of-sample evaluation.'
 }
};

// Reviewed original fictional cases used to differentiate instructional depth,
// not merely append vocabulary. Each deeper edition inherits the prior teaching.
const DEPTH_WORKED_CASES=Object.freeze({
 candlesticks:{
  FOUNDATION:'Now identify the wicks on our $31.00/$32.50/$30.50/$32.00 example: upper wick = $32.50 − $32.00 = $0.50; lower wick = $31.00 − $30.50 = $0.50. The candle closes above its open, but the next candle is unknown.',
  ADVANCED:'Compare a second, completed fictional one-minute candle: O $32.00, H $32.20, L $31.10, C $31.40. Body = $0.60; range = $1.10; body/range = 54.55%; upper wick = $0.20 and lower wick = $0.30. The second candle closes below its open. Different body percentages and wick lengths describe observations; they do not prove a reversal or rejection.',
  PROFESSIONAL:'Now aggregate those two consecutive completed one-minute candles into ONE two-minute candle: open = first open $31.00; high = max($32.50,$32.20) = $32.50; low = min($30.50,$31.10) = $30.50; close = second close $31.40. The aggregated body is $0.40 on a $2.00 range, or 20%. The first green candle and second red candle therefore produce a green combined candle; interpretation changes with the interval. This example assumes aligned, consecutive observations in the same session.',
  ENTERPRISE:'Validate the original OHLC inputs before comparing aggregates: for every completed row require low ≤ min(open,close) and high ≥ max(open,close), finite positive prices, unique ordered interval timestamps and no missing one-minute intervals. A proposed first row with high $31.80 and close $32.00 is invalid; reject it rather than silently charting it. Define UTC/session boundaries, split-adjustment basis, correction policy, deterministic aggregation and reproducible source provenance.'
 },
 vwap:{
  ADVANCED:'For the demonstrated 200 shares at $8 and 100 at $10, the unweighted price mean is $9.00 but trade-print VWAP is $8.6667. The 200-share trade receives twice the weight. Track $1,600 and $1,000 in separate traded-dollar subtotals.',
  PROFESSIONAL:'Suppose a separate simulated single OHLCV bar is H $10, L $8, C $10, V 300. HLC3 = ($10+$8+$10)/3 = $9.3333, so its bar proxy is $9.3333—not the transaction VWAP $8.6667 from the two prints. They use different inputs; this does not measure a universal proxy error.',
  ENTERPRISE:'For reproducible trade-print VWAP, specify eligible sale conditions, event-time window, trade corrections and cancellations, zero-volume handling and rights. For the two fictional prints, preserve 200×$8 + 100×$10 = $2,600 and 300 shares as auditable intermediate totals.'
 },
 ema:{
  ADVANCED:'For the same previously warmed $10.00 reference and completed $11.00 close, EMA 9 updates to $10.20, while EMA 20 uses alpha 2/21 and updates to approximately $10.0952. The apparent difference is caused by weighting, not foresight.',
  PROFESSIONAL:'If the next *completed* fictional close is $9.00, EMA 9 updates from $10.20 to $9.96. EMA 20 updates from approximately $10.0952 to $9.9909. A line-order change can occur with no reliable future-price conclusion; neither input includes an unrevealed candle.',
  ENTERPRISE:'Document EMA 9 and EMA 20 seeding (for example, initial period SMA), minimum warmup, adjustment policy, missing-close rule and numerical tolerance. Never compare warmup-dependent early results from incompatible seed conventions as if they were identical.'
 },
 scanner:{
  ADVANCED:'The fictional symbol at $4.20, +9% and 12,000 shares passes the four stated numeric AND filters. If halted=true, an added NOT-halted condition fails. If halted status is unknown, the complete five-rule result is unverified—not automatically true.',
  PROFESSIONAL:'Compare the same symbol at two observation times: $4.20/+9%/12,000 shares passes, but a later $4.20/+7%/12,000 shares fails the ≥8% change rule. A screener is a time-stamped research filter, not a durable trade signal.',
  ENTERPRISE:'A reproducible scanner records each parameter name, comparison operator, units, event-time observation, field provenance, null policy and AND/OR grouping. Never treat a missing halt flag as false or infer a verified live result from fictional inputs.'
 },
 volume:{
  ADVANCED:'Three completed fictional volumes of 200, 600 and 400 average 400 units. The 600-unit bar is 600/400 = 1.5× this small comparison baseline; the ratio changes if the window changes.',
  PROFESSIONAL:'The same 600-unit observation could be ordinary at a busy open and exceptional in another session segment. Compare matched intervals and report the baseline count before calling a bar unusually active.',
  ENTERPRISE:'Specify which trade conditions count, unit normalization, corrections, timestamps, venue coverage and rights. The fictional numbers 200, 600 and 400 cannot be used as actual market liquidity evidence.'
 },
 structure:{
  ADVANCED:'Completed fictional swing highs $20.00 then $20.60 and lows $19.50 then $19.90 support a higher-high/higher-low comparison, provided both highs and lows meet the same confirmation rule.',
  PROFESSIONAL:'If confirmation requires one completed bar on each side of a candidate swing, do not label the current final bar a confirmed pivot. Record the confirmation delay and a clear invalidation level before discussing a hypothetical decision.',
  ENTERPRISE:'A reproducible swing detector must specify lookback, tie-breaking on equal highs/lows, confirmation latency, timestamp policy and strictly past-only evaluation. Comparing unconfirmed extrema to confirmed extrema introduces lookahead bias.'
 }
});
const DEPTH_GUIDANCE=Object.freeze({
 ADVANCED:'ADVANCED — Compare two observations and test a common misconception.',
 PROFESSIONAL:'PROFESSIONAL — Test timeframe, regime and evidence-boundary sensitivity.',
 ENTERPRISE:'ENTERPRISE — Make data integrity and the reasoning reproducible.'
});
const normalize=x=>String(x||'').trim().toUpperCase();
export const depthIndex=depth=>TEACHING_DEPTHS.indexOf(normalize(depth));
export const availableDepths=max=>{
 const index=depthIndex(max);return index<0?['FOUNDATION']:TEACHING_DEPTHS.slice(0,index+1);
};
export function buildTaliaLesson({topic,depth='FOUNDATION',phase='explain',chartContext=null}={}){
 if(!TUTOR_LESSONS.some(t=>t.id===topic)||depthIndex(depth)<0||!LESSON_PHASES.includes(phase))
  throw Object.assign(new Error('Unrecognized classroom topic, teaching depth or step.'),{status:400});
 const entry=CATALOG[topic];
 const chartLesson=chartContext?buildTaliaChartLesson({topic,depth,phase,chartContext}):null;
 const name=TUTOR_LESSONS.find(t=>t.id===topic).title;
 const extension=depth==='FOUNDATION'?'':depth==='ADVANCED'?entry.advanced:
  depth==='PROFESSIONAL'?entry.advanced+'\n\n'+entry.professional:
  entry.advanced+'\n\n'+entry.professional+'\n\n'+entry.enterprise;
 const deeperCases=TEACHING_DEPTHS.slice(1,depthIndex(depth)+1).map(t=>
  DEPTH_GUIDANCE[t]+'\n'+(DEPTH_WORKED_CASES[topic][t]||'')).join('\n\n');
 const intro='Talia · '+name+' · '+depth.charAt(0)+depth.slice(1).toLowerCase()+' depth\n\n';
 const teaching={
  explain:[
   'I DO — UNDERSTAND',
   entry.concept,
   'I DO — SHOW THE EVIDENCE AND WORK THE NUMBERS (FICTIONAL)',
   entry.example,
   ...(DEPTH_WORKED_CASES[topic].FOUNDATION?[DEPTH_WORKED_CASES[topic].FOUNDATION]:[]),
   ...(deeperCases?[deeperCases]:[]),
   'WE DO — RECOGNIZE WHAT THE EVIDENCE SUPPORTS',
   extension||'Describe what is directly observable before making an interpretation.',
   'COMMON MISTAKE AND LIMITATION',
   entry.counter,
   'YOU DO — UNGRADED CHECK',
   entry.challenge,
   'Tell me your first step or select Practice to write your reasoning. I will help with hints and correction; no grade, future candle or paid explanation is involved.'
  ].join('\n\n'),
  demonstrate:'I DO — WORKED FICTIONAL EXAMPLE\n\n'+entry.example+'\n\n'+
   (DEPTH_WORKED_CASES[topic].FOUNDATION?DEPTH_WORKED_CASES[topic].FOUNDATION+'\n\n':'')+
   (deeperCases?deeperCases+'\n\n':'')+'WHAT THIS DOES NOT PROVE\n\n'+entry.counter+
   '\n\nWE DO — Which supplied observation supports the calculation?',
  practice:'YOU DO — UNGRADED PRACTICE\n\n'+entry.challenge+
   '\n\nShow your own steps before opening the worked check. I can provide hints and review your reasoning without assigning a grade or revealing future chart values.',
  correct:'REVIEW — UNGRADED WORKED CHECK\n\n'+entry.solution+
   '\n\nCOMMON MISTAKE\n\n'+entry.counter+
   '\n\nCompare the process, not just the final number. This is not an automated grade; ask about the step you found difficult.',
  transfer:'TRANSFER — INDEPENDENT FICTIONAL CASE\n\n'+entry.transfer+'\n\n'+
   (extension?extension+'\n\n':'')+'Identify uncertainty, a counterexample and when NO TRADE is the appropriate conclusion.'
 };
 return {topic,depth,phase,title:name,answer:intro+(chartLesson?chartLesson.answer:teaching[phase]),...(chartLesson?{chartEvidence:chartLesson.evidence}:{}),sourceLabel:'Original Crownlight source-only classroom lesson',graded:false,officialGrade:false,masteryAwarded:false,hasFutureBars:false,commercialPremiumFeaturesGranted:false};
}
