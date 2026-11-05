/* Talia canonical fictional replay evidence, shared by browser and trusted lesson service.
 * Source OHLC tuple order: [open, close, low, high], all prices illustrative.
 * No exchange feed, member progress, protected cases or unobserved future bars.
 */
export const TALIA_REPLAY_ID='CROWN-TALIA-FICTIONAL-OHLC-001';
export const TALIA_REPLAY=[
 [20,20.16,19.90,20.27],[20.16,20.25,20.04,20.34],
 [20.25,20.12,20.02,20.32],[20.12,20.40,20.08,20.48],
 [20.40,20.35,20.27,20.55],[20.35,20.62,20.29,20.71],
 [20.62,20.58,20.44,20.73],[20.58,20.79,20.52,20.91],
 [20.79,20.85,20.71,20.96],[20.85,20.66,20.60,20.94],
 [20.66,20.49,20.40,20.73],[20.49,20.57,20.43,20.65]
];
for(let i=0;i<248;i++){
 const previous=TALIA_REPLAY[TALIA_REPLAY.length-1][1];
 const close=Number((previous+0.038*Math.sin(i*0.37)+0.027*Math.cos(i*0.13)-(i%19===0?0.055:0)).toFixed(2));
 const high=Number((Math.max(previous,close)+0.03+(i%4)*0.01).toFixed(2));
 const low=Number((Math.min(previous,close)-0.03-(i%3)*0.01).toFixed(2));
 TALIA_REPLAY.push([previous,close,low,high]);
}
export function taliaSyntheticVolume(bar,index){
 return 200+Math.round(Math.abs(bar[1]-bar[0])*3700)+index*17;
}
const invalid=reason=>Object.assign(new Error(reason),{status:400});
const compact=(rows,start,frame)=>{
 const slice=rows.slice(start,start+frame);
 if(slice.length!==frame)throw invalid('The requested candle is not completed at this reveal boundary.');
 const open=slice[0][0],close=slice[frame-1][1];
 return {open,close,low:Math.min(...slice.map(x=>x[2])),high:Math.max(...slice.map(x=>x[3])),
  volume:slice.reduce((n,x,i)=>n+taliaSyntheticVolume(x,start+i),0)};
};
const derived=(candle)=>({
 ...candle,body:Math.abs(candle.close-candle.open),range:candle.high-candle.low,
 upperWick:candle.high-Math.max(candle.open,candle.close),
 lowerWick:Math.min(candle.open,candle.close)-candle.low,
 direction:candle.close>candle.open?'bullish':candle.close<candle.open?'bearish':'doji',
 bodyPercent:candle.high>candle.low?100*Math.abs(candle.close-candle.open)/(candle.high-candle.low):0
});
export function getTaliaChartEvidence(context){
 if(!context||typeof context!=='object'||Array.isArray(context)||Object.keys(context).some(k=>!['visible','index','timeframe'].includes(k)))
  throw invalid('Unsupported chart evidence fields.');
 const {visible,index,timeframe}=context;
 if(!Number.isInteger(visible)||visible<1||visible>TALIA_REPLAY.length)
  throw invalid('Invalid completed-candle reveal boundary.');
 if(![1,3,5].includes(timeframe))
  throw invalid('The chart interval must be 1, 3, or 5 completed minutes.');
 const completeCount=Math.floor(visible/timeframe);
 if(!Number.isInteger(index)||index<0||index>=completeCount)
  throw invalid('Selected candle is outside the completed revealed chart.');
 const end=(index+1)*timeframe;
 const bar=derived(compact(TALIA_REPLAY,index*timeframe,timeframe));
 const previous=index>0?derived(compact(TALIA_REPLAY,(index-1)*timeframe,timeframe)):null;
 const completed=[];
 for(let start=0;start<end;start+=timeframe)completed.push(compact(TALIA_REPLAY,start,timeframe));
 const sample=completed.map((b,i)=>({close:b.close,volume:b.volume,typical:(b.high+b.low+b.close)/3,index:i}));
 const totalVolume=sample.reduce((n,x)=>n+x.volume,0);
 const dollars=sample.reduce((n,x)=>n+x.typical*x.volume,0);
 const meanVolume=totalVolume/sample.length;
 const proxyVWAP=dollars/totalVolume;
 const ema=period=>{
  if(sample.length<period)return null;
  let value=sample.slice(0,period).reduce((n,x)=>n+x.close,0)/period;
  for(let i=period;i<sample.length;i++)value=value+(sample[i].close-value)*2/(period+1);
  return value;
 };
 return {
  source:TALIA_REPLAY_ID,visible,index,timeframe,completeCount,
  firstSourceBar:index*timeframe+1,lastSourceBar:end,
  selectedNumber:index+1,bar,previous,totalVolume,meanVolume,proxyVWAP,ema9:ema(9),ema20:ema(20),
  hiddenSourceBars:TALIA_REPLAY.length-visible,uncompletedSourceBars:visible-Math.floor(visible/timeframe)*timeframe,
  // This replay has no real event-time timestamps; B001 etc. are ordinals.
  clock:'fictional_ordinal_no_exchange_timestamp'
 };
}
