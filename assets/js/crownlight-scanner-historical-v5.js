/* Crownlight Scanner Wave 5: offline five-minute member research.
 * Reuses canonical OHLCV and Crownlight maths; no exchange license claims,
 * live data, trade signals, historical grade or private saved market data.
 */
(function(root){
'use strict';
const RE=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/;
const SYMBOL=/^[A-Z][A-Z0-9.-]{0,11}$/;
const MINUTE=60000,FRAME=5*MINUTE,MAX=20000;
const error=m=>Object.assign(new Error(m),{code:'SCANNER_HISTORICAL_INVALID'});
function cutoff(value){
 if(typeof value!=='string'||!RE.test(value))throw error('An exact as-of timestamp with UTC offset is required.');
 // Date.parse silently normalizes nonexistent days (for example 2026-02-30).
 // Validate the written calendar and actual worldwide UTC-offset limit first.
 const year=Number(value.slice(0,4)),month=Number(value.slice(5,7)),
       day=Number(value.slice(8,10)),hour=Number(value.slice(11,13)),
       minute=Number(value.slice(14,16)),second=Number(value.slice(17,19));
 const leap=year%4===0&&(year%100!==0||year%400===0);
 const days=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
 const zone=value.match(/([+-])(\d{2}):(\d{2})$/);
 if(month<1||month>12||day<1||day>days[month-1]||
    hour>23||minute>59||second>59||
    (zone&&Number(zone[2])===14&&Number(zone[3])!==0))
  throw error('Invalid calendar date or UTC offset for as-of cutoff.');
 const ms=Date.parse(value);
 if(!Number.isFinite(ms))throw error('Invalid calendar date for as-of cutoff.');
 const iso=new Date(ms).toISOString();
 if(Number.isNaN(Date.parse(iso)))throw error('Invalid cutoff.');
 return ms;
}
function positiveOptional(value,label,zero=false){
 if(value===null||value===undefined||value==='')return null;
 if(typeof value!=='string'&&typeof value!=='number')throw error('Invalid '+label+'.');
 const s=String(value).trim();
 if(!/^\d+(?:\.\d+)?$/.test(s))throw error('Invalid '+label+'.');
 const n=Number(s);
 if(!Number.isFinite(n)||(zero?n<0:n<=0))throw error('Invalid '+label+'.');
 return n;
}
function pct(last,basis){return basis&&basis>0?(last/basis-1)*100:null;}
function evaluate({bars,asOf,symbol,sourceNote,metadata={}}){
 const at=cutoff(asOf),ticker=String(symbol||'').trim().toUpperCase();
 if(!SYMBOL.test(ticker))throw error('A valid research ticker is required.');
 if(typeof sourceNote!=='string'||sourceNote.trim().length<8||sourceNote.length>180)
  throw error('Describe the source and your permission to use the member-provided bars (8–180 characters).');
 if(!Array.isArray(bars)||bars.length<1||bars.length>MAX)throw error('Provide 1–20,000 five-minute OHLCV observations.');
 if(!metadata||typeof metadata!=='object'||Array.isArray(metadata)||
    Object.keys(metadata).some(k=>!['rvol','float','spread_pct'].includes(k)))
  throw error('Unsupported source metadata.');
 const I=root.CrownlightIndicatorMath,S=root.GroundUpScannerV014145,C=root.CrownlightScannerRulesV1;
 if(!I?.session||!I.ema||!I.rsi||!S?.wilderAtr||!S.typicalPriceVwap||!C?.validate)
  throw error('Canonical Crownlight calculation dependencies unavailable.');
 const context={
  rvol:positiveOptional(metadata.rvol,'provided RVOL',true),
  float:positiveOptional(metadata.float,'reported float'),
  spread_pct:positiveOptional(metadata.spread_pct,'provided spread percent',true)
 };
 const seen=[],sessions=[];let prior=-Infinity,prevDay='';
 for(const bar of bars){
  const ms=bar?.time instanceof Date?bar.time.getTime():NaN;
  if(!Number.isFinite(ms))throw error('Bar timestamps must be validated Date objects.');
  if(ms+FRAME>at)break; // Do not inspect or calculate from unrevealed future bars.
  if(ms<=prior)throw error('Completed bars must be chronological, without duplicates.');
  const o=bar.open,h=bar.high,low=bar.low,cl=bar.close,v=bar.volume;
  if(![o,h,low,cl,v].every(Number.isFinite)||o<=0||h<Math.max(o,cl)||
     low<=0||low>Math.min(o,cl)||!Number.isSafeInteger(v)||v<0)
    throw error('Invalid completed OHLCV observation.');
  const session=I.session(bar);
  if(session.kind!=='regular'||session.minute<570||session.minute>955||session.minute%5!==0)
    throw error('Only properly aligned completed 5-minute NYSE regular-session bars are supported.');
  if(ms%FRAME!==0)throw error('Bar timestamp must align with a five-minute boundary.');
  if(session.day!==prevDay){
   if(sessions.length&&session.day<=prevDay)throw error('Session dates must be chronological.');
   sessions.push({day:session.day,bars:[],startsAtOpen:session.minute===570,continuous:true});
   prevDay=session.day;
  }
  const group=sessions[sessions.length-1],last=group.bars.at(-1);
  if(last&&(ms-last.time.getTime())!==FRAME)group.continuous=false;
  group.bars.push(bar);seen.push(bar);prior=ms;
 }
 if(!seen.length)return Object.freeze({available:false,reason:'NO_COMPLETED_FIVE_MINUTE_BAR',asOf:new Date(at).toISOString(),sourceStatus:'UNVERIFIED_MEMBER_SUPPLIED_OHLCV',tradeSignal:false,marketDataVerified:false});
 const current=sessions.at(-1),prev=sessions.at(-2),prev2=sessions.at(-3);
 const complete=g=>!!g&&g.startsAtOpen&&g.continuous&&g.bars.length===78&&
  I.session(g.bars.at(-1)).minute===955;
 const currentContinuous=current.startsAtOpen&&current.continuous;
 const latest=current.bars.at(-1);
 const cutoffLagMinutes=(at-(latest.time.getTime()+FRAME))/MINUTE;
 const last=latest.close,previous=current.bars.at(-2);
 const lastPrev=complete(prev)?prev.bars.at(-1).close:null;
 const secondPrev=complete(prev)&&complete(prev2)?prev2.bars.at(-1).close:null;
 const vwap=currentContinuous?S.typicalPriceVwap(current.bars):null;
 const allContinuous=sessions.every(s=>s.startsAtOpen&&s.continuous&&
  (s===current||complete(s)));
 const closeSeries=seen.map(b=>b.close);
 const e9=allContinuous?I.ema(closeSeries,9).at(-1):null;
 const e20=allContinuous?I.ema(closeSeries,20).at(-1):null;
 const e200=allContinuous?I.ema(closeSeries,200).at(-1):null;
 const rsi=allContinuous?I.rsi(seen,14).at(-1):null;
 const atr=allContinuous?S.wilderAtr(seen,14):null;
 const volume=currentContinuous?current.bars.reduce((n,b)=>n+b.volume,0):null;
 if(volume!==null&&!Number.isSafeInteger(volume))throw error('Unsafe cumulative volume.');
 const row=Object.freeze({
  symbol:ticker,price:last,volume,
  change_5m_pct:currentContinuous&&previous?pct(last,previous.close):null,
  change_2d_pct:currentContinuous&&secondPrev!==null?pct(last,secondPrev):null,
  change_pct:currentContinuous&&lastPrev!==null?pct(last,lastPrev):null,
  prev_close:lastPrev,yesterday_volume:complete(prev)?prev.bars.reduce((n,b)=>n+b.volume,0):null,
  day_high:currentContinuous?Math.max(...current.bars.map(x=>x.high)):null,
  day_low:currentContinuous?Math.min(...current.bars.map(x=>x.low)):null,
  bar_vwap_proxy:vwap?.value??null,
  ema_9:Number.isFinite(e9)?e9:null,ema_20:Number.isFinite(e20)?e20:null,
  ema_200:Number.isFinite(e200)?e200:null,
  rsi_14:Number.isFinite(rsi)?rsi:null,atr_14:Number.isFinite(atr?.value)?atr.value:null,
  rvol:context.rvol,float:context.float,spread_pct:context.spread_pct
 });
 const warnings=[
  'Unverified member-supplied observations: provider, completeness, adjustments, entitlement and redistribution rights not certified.',
  'Two-session comparison is relative to two preceding FULL observed sessions, not proof of two consecutive exchange trading days.',
  'bar_vwap_proxy uses HLC3 bar-weighting, not individual trade-print VWAP.',
  'EMA uses SMA seeding; RSI uses Wilder smoothing; ATR uses the first 14 complete prior-close true ranges.'
 ];
 if(!currentContinuous)warnings.push('Current session opens late or contains missing 5-minute observations; derived metrics remain unknown.');
 if(!complete(prev)||!complete(prev2))warnings.push('Two complete earlier regular sessions required for two-session percentage.');
 if(!allContinuous)warnings.push('Warmup history is incomplete; recursive indicators withheld.');
 if(cutoffLagMinutes>=5)warnings.push('The latest supplied completed bar ends '+cutoffLagMinutes+' minutes before cutoff; subsequent observations were not supplied.');
 return Object.freeze({
  available:true,asOf:new Date(at).toISOString(),lastCompletedAt:new Date(latest.time.getTime()+FRAME).toISOString(),
  symbol:ticker,sessionDay:current.day,observedBars:seen.length,visibleCurrentBars:current.bars.length,
  cutoffLagMinutes,sourceFreshness:cutoffLagMinutes>=5?'NO_OBSERVATION_AT_CUTOFF':'RECENT_COMPLETED_OBSERVATION',
  previousCompleteSessions:[prev2,prev].filter(complete).map(x=>x.day),
  row,sourceStatus:'UNVERIFIED_MEMBER_SUPPLIED_OHLCV',
  basis:'TWO_PRECEDING_FULL_OBSERVED_SESSIONS_NOT_EXCHANGE_CALENDAR_VERIFIED',
  indicatorSeeding:'SMA_SEEDED_EMA_WILDER_RSI_PRIOR_CLOSE_ATR_HLC3_BAR_VWAP_PROXY',
  tradeSignal:false,marketDataVerified:false,liveFeed:false,authenticatedHistoricalReplay:false,
  warnings:Object.freeze(warnings),
  // Visible completed bar observations ONLY; charts cannot request future values.
  visibleBars:seen.slice(-120).map(b=>Object.freeze({
   time:b.time.toISOString(),close:b.close,volume:b.volume
  }))
 });
}
function evaluateRule(snapshot,rule){
 if(!snapshot?.available||!snapshot.row)return 'UNKNOWN';
 const C=root.CrownlightScannerRulesV1;
 const verdict=C.evaluate(C.validate(rule),snapshot.row);
 return verdict===null?'UNKNOWN':verdict?'PASS':'FAIL';
}
root.CrownlightScannerHistoricalV5=Object.freeze({evaluate,evaluateRule,cutoff,FRAME});
})(globalThis);
