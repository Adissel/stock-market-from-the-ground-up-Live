/* Talia evidence-anchored original lessons. Server computes every figure from
 * the public fictional chart fixture, not browser-submitted OHLC or future bars.
 */
import {getTaliaChartEvidence} from '../../src/tutor/talia-chart-evidence-v1.js';
const usd=n=>'$'+n.toFixed(2);
const pc=n=>n.toFixed(1)+'%';
const label=e=>'completed '+e.timeframe+'-minute candle #'+e.selectedNumber+
 ' (source bars '+e.firstSourceBar+'–'+e.lastSourceBar+'; '+e.visible+' revealed)';
function deeper(topic,depth,e){
 const b=e.bar,p=e.previous;
 const previous=p?'Prior completed bar: H '+usd(p.high)+', L '+usd(p.low)+', C '+usd(p.close)+', body/range '+pc(p.bodyPercent)+'.':
  'No prior complete interval exists for a comparison.';
 const advanced={
  candlesticks:'Compare the selected '+pc(b.bodyPercent)+' body/range with the previous completed candle. '+previous+' A change of color, size or wick does not prove rejection or a reversal.',
  vwap:'This selected bar has '+b.volume+' synthetic volume units. The cumulative HLC3-volume estimate through this observation is '+usd(e.proxyVWAP)+', not exact transaction VWAP.',
  ema:'EMA 9: '+(e.ema9===null?'not initialized from nine completed closes':usd(e.ema9))+
   '. EMA 20: '+(e.ema20===null?'not initialized from twenty completed closes':usd(e.ema20))+'. Never use hidden candles to fill a warmup.',
  volume:'The selected bar has '+b.volume+' artificial volume units versus '+e.meanVolume.toFixed(2)+' mean units per completed bar through this observation.',
  structure:previous+' This bar H '+usd(b.high)+' / L '+usd(b.low)+' is an observation, not a confirmed swing pivot.'
 };
 const alt=e.timeframe===1?3:1;
 const n=Math.floor(e.lastSourceBar/alt);
 const other=n>0?getTaliaChartEvidence({visible:e.lastSourceBar,index:n-1,timeframe:alt}):null;
 const professional={
  candlesticks:other?
   'A different '+alt+'-minute view using ONLY source bars through the current cutoff ends with completed bar #'+other.selectedNumber+
   ': O '+usd(other.bar.open)+' H '+usd(other.bar.high)+' L '+usd(other.bar.low)+' C '+usd(other.bar.close)+
   ', body/range '+pc(other.bar.bodyPercent)+'. '+(e.lastSourceBar%alt?'The next '+alt+'-minute group remains incomplete.':'No later bar was used.'):
   'Another timeframe is not yet complete at this historical cutoff.',
  vwap:'Changing the grouping and session cutoff changes the HLC3-volume proxy. No transaction prints are available to measure an exact live-trade VWAP.',
  ema:'Changing timeframe changes the close sequence and warmup length. Line crossovers must be tested under consistent, past-only observation boundaries.',
  volume:'Evaluate the baseline and sample window; fictional volume does not establish real liquidity or trader intent.',
  structure:'One adjacent completed high/low comparison does not supply a confirmed swing rule. Confirmation latency and invalidation matter.'
 };
 const enterprise={
  candlesticks:'Validate finite prices and low ≤ open/close ≤ high for every in-scope row. B001-style labels are ordinal, NOT actual UTC exchange timestamps; no split or source timestamp policy can be verified from this fixture.',
  vwap:'Reproduction requires trade eligibility, corrections, volume units, timestamp policy, data rights and a declared proxy-versus-trade-data distinction.',
  ema:'Document SMA seeding, alpha 2/(n+1), complete-bar cutoff, missing observations, precision and adjustment policy. An unavailable EMA must not be replaced with zero.',
  volume:'These artificial volumes are not exchange prints. Real research requires venue, sale-condition, correction and licensing controls.',
  structure:'Specify deterministic swing lookback, ties, confirmation lag, session clock and strictly past-only evaluation.'
 };
 let result='';
 if(depth!=='FOUNDATION')result+='\n\nADVANCED — OBSERVATIONAL COMPARISON\n'+advanced[topic];
 if(depth==='PROFESSIONAL'||depth==='ENTERPRISE')result+='\n\nPROFESSIONAL — TIMEFRAME AND INFERENCE TEST\n'+professional[topic];
 if(depth==='ENTERPRISE')result+='\n\nENTERPRISE — VALIDATION AND REPRODUCIBILITY\n'+enterprise[topic];
 return result;
}
export function buildTaliaChartLesson({topic,depth,phase,chartContext}){
 if(!['candlesticks','vwap','ema','volume','structure'].includes(topic))
  throw Object.assign(new Error('Selected topic does not support chart instruction.'),{status:400});
 const e=getTaliaChartEvidence(chartContext),b=e.bar,p=e.previous;
 const heading='I DO — READ YOUR ACTUAL FICTIONAL CHART\nSelected '+label(e)+'\n'+
  'O '+usd(b.open)+' · H '+usd(b.high)+' · L '+usd(b.low)+' · C '+usd(b.close)+' ('+b.direction+').';
 const math='Body = |'+usd(b.close)+' − '+usd(b.open)+'| = '+usd(b.body)+
  '. Full range = '+usd(b.high)+' − '+usd(b.low)+' = '+usd(b.range)+
  '. Upper wick '+usd(b.upperWick)+', lower wick '+usd(b.lowerWick)+
  ', body/range '+pc(b.bodyPercent)+'.';
 const first={
  candlesticks:heading+'\n'+math+'\nColor, body and wicks describe this completed interval, not the next candle.',
  vwap:heading+'\nFictional bar volume '+b.volume+' units. The cumulative HLC3-volume proxy through THIS selected completed bar is '+
   usd(e.proxyVWAP)+'. It is NOT an exact transaction-print VWAP.',
  ema:heading+'\nOnly '+e.selectedNumber+' completed '+e.timeframe+'-minute closes are available through this selected bar. SMA-seeded EMA 9: '+
   (e.ema9===null?'UNAVAILABLE before nine complete closes':usd(e.ema9))+
   '. EMA 20: '+(e.ema20===null?'UNAVAILABLE before twenty complete closes':usd(e.ema20))+'.',
  volume:heading+'\nThis completed candle has '+b.volume+' synthetic volume units. The average through this selected bar is '+
   e.meanVolume.toFixed(2)+' fictional units per completed timeframe bar. These are NOT market prints.',
  structure:heading+'\n'+(p?'Previous completed bar high '+usd(p.high)+' and low '+usd(p.low)+
   '; selected high '+usd(b.high)+' and low '+usd(b.low)+'. Compare before interpreting a swing.':
   'There is no previous completed candle in this timeframe; trend inference is unsupported.')
 };
 const error={
  candlesticks:'A wick cannot prove the transaction sequence, future direction, or automatic market rejection.',
  vwap:'Bar-based HLC3 estimates and exact trade-print VWAP use different inputs. The latter is unavailable here.',
  ema:'Do not calculate an EMA from future candles or present warmup-dependent values without stating the seed.',
  volume:'Synthetic volume is not actual order-flow or liquidity evidence.',
  structure:'A single higher high is not an independently confirmed swing high.'
 }[topic];
 const guided={
  candlesticks:'Which two displayed prices bound the body, and which two bound the full range?',
  vwap:'Which additional trade-level data would be required to compute exact VWAP rather than this proxy?',
  ema:'How many completed closes do we need before EMA 9 and EMA 20 can be initialized?',
  volume:'What is the role of the comparison window when judging relative volume?',
  structure:'What observation distinguishes adjacent bar highs from a confirmed swing pivot?'
 }[topic];
 const practice={
  candlesticks:'Calculate body, range, upper wick and body percentage for selected candle #'+e.selectedNumber+
   ' using O '+usd(b.open)+' H '+usd(b.high)+' L '+usd(b.low)+' C '+usd(b.close)+'.',
  vwap:'Using H '+usd(b.high)+' L '+usd(b.low)+' C '+usd(b.close)+
   ', calculate this single bar’s HLC3 and explain why it is not exact transaction VWAP.',
  ema:'Count '+e.selectedNumber+' completed closes through this selection. Determine whether a properly SMA-seeded EMA 9 or EMA 20 exists and explain why.',
  volume:'Compute the ratio between '+b.volume+' illustrative units and the '+e.meanVolume.toFixed(2)+'-unit average, then identify the data limitation.',
  structure:'Compare selected H '+usd(b.high)+' and L '+usd(b.low)+' to '+
   (p?'previous H '+usd(p.high)+' and L '+usd(p.low):'the unavailable earlier bar')+
   '. Which claims are observable and which still require confirmation?'
 }[topic];
 const correction={
  candlesticks:math,
  vwap:'Single-bar HLC3 = ('+usd(b.high)+' + '+usd(b.low)+' + '+usd(b.close)+') / 3 = '+
   usd((b.high+b.low+b.close)/3)+'. Through selected bar #'+e.selectedNumber+', cumulative bar-proxy VWAP = '+
   usd(e.proxyVWAP)+'. Neither is an exact transaction-print VWAP.',
  ema:'EMA 9 = '+(e.ema9===null?'unavailable (fewer than nine completed closes)':usd(e.ema9))+
   '; EMA 20 = '+(e.ema20===null?'unavailable (fewer than twenty completed closes)':usd(e.ema20))+
   '. Both use disclosed SMA seeding and only completed observations.',
  volume:'Relative sample volume = '+b.volume+' / '+e.meanVolume.toFixed(2)+' = '+
   (b.volume/e.meanVolume).toFixed(2)+'×. Sample volumes are fictional.',
  structure:(p?'The selected high '+usd(b.high)+(b.high>p.high?' exceeds ':b.high<p.high?' falls below ':' equals ')+usd(p.high)+
   '; selected low '+usd(b.low)+(b.low>p.low?' exceeds ':b.low<p.low?' falls below ':' equals ')+usd(p.low)+'.':
   'No previous completed candle supports a comparison.')+' Neither conclusion automatically confirms a swing or a trade.'
 }[topic];
 const transfer=e.index>0?(()=>{
  const x=getTaliaChartEvidence({visible:e.visible,index:e.index-1,timeframe:e.timeframe}),c=x.bar;
  return 'Inspect DIFFERENT previously completed '+e.timeframe+'-minute bar #'+x.selectedNumber+
   ' (O '+usd(c.open)+' H '+usd(c.high)+' L '+usd(c.low)+' C '+usd(c.close)+
   '). Independently apply this topic and explain one limitation; NO TRADE is acceptable.';
 })():'Reveal another complete interval before attempting a new chart-based transfer. Never inspect future bars.';
 const teaching={
  explain:first[topic]+deeper(topic,depth,e)+'\n\nCOMMON MISTAKE AND LIMITATION\n'+error+
   '\n\nWE DO — '+guided+'\n\nYOU DO — Select Practice to work from this highlighted candle; explanations and retries are always free.',
  demonstrate:first[topic]+deeper(topic,depth,e)+'\n\nWE DO — '+guided+'\n\nLIMITATION\n'+error,
  practice:'YOU DO — UNGRADED\nSelected '+label(e)+'\n'+practice[topic]+
   '\n\nWrite your reasoning before choosing Correct. This step deliberately withholds the worked check.',
  correct:'REVIEW — SAME CHART CANDLE\nSelected '+label(e)+'\n'+correction+
   '\n\nCommon mistake: '+error+'\n\nThis is a worked reference, not an automated grade or a comparison against private notes.',
  transfer:'TRANSFER — DIFFERENT REVEALED CANDLE\n'+transfer+
   '\n\nDescribe uncertainty; do not use a future candle or predict an outcome.'
 };
 return {answer:teaching[phase],evidence:{
  source:e.source,visible:e.visible,index:e.index,timeframe:e.timeframe,selectedNumber:e.selectedNumber,
  firstSourceBar:e.firstSourceBar,lastSourceBar:e.lastSourceBar,
  open:b.open,high:b.high,low:b.low,close:b.close,body:b.body,range:b.range,
  upperWick:b.upperWick,lowerWick:b.lowerWick,bodyPercent:b.bodyPercent,
  clock:e.clock,noFuture:true,sourceOnly:true
 }};
}
