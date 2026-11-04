/* Crownlight P2: source-authorized fictional indicator teaching mathematics.
 * Delegates arithmetic to the existing Learning Indicators v1 method implementations.
 * No answer keys, member data, broker feeds, entitlements or persistence.
 */
(function(root){'use strict';
const engine=root.GroundUpLearningIndicatorsV1;
const freeze=Object.freeze,finite=n=>typeof n==='number'&&Number.isFinite(n);
const names=freeze(['ema','rsi','macd','bollinger']);
const fixtures=freeze([10,11,12,11,13,14,15,14,15.2,16.1,15.4,17.2]);
const definitions=freeze({
 ema:freeze({label:'SMA-seeded EMA',units:'USD/share',formula:'alpha = 2 / (period + 1); EMA = alpha × close + (1 − alpha) × prior EMA',
  limitation:'EMA weighting and seed choices vary by platform; a moving average is not a forward price forecast.'}),
 rsi:freeze({label:'Wilder RSI',units:'0–100',formula:'RSI = 100 − 100 / (1 + smoothed average gain / smoothed average loss)',
  limitation:'RSI describes the relative size of observed gains and losses, not a reversal guarantee.'}),
 macd:freeze({label:'MACD line / signal / histogram',units:'USD/share',formula:'MACD = fast EMA − slow EMA; signal = EMA of valid MACD; histogram = MACD − signal',
  limitation:'Different EMA initialization, warmup periods and settings alter results; divergence does not guarantee future direction.'}),
 bollinger:freeze({label:'Bollinger bands',units:'USD/share',formula:'Middle = SMA; upper/lower = middle ± multiplier × population standard deviation',
  limitation:'Bands describe dispersion in an observed window, not a statistically guaranteed containment or trade signal.'})
});
function calculate(study,closes,{period=3,fast=3,slow=5,signal=3,multiplier=2}={}){
 if(!engine||!names.includes(study)||!Array.isArray(closes)||closes.length<5||closes.length>500||
  !closes.every(v=>finite(v)&&v>0)||!Number.isInteger(period)||period<2||period>10||
  !Number.isInteger(fast)||fast<2||fast>10||!Number.isInteger(slow)||slow<=fast||slow>20||
  !Number.isInteger(signal)||signal<2||signal>10||!finite(multiplier)||multiplier<=0||multiplier>5)return null;
 let result=null,lines=[];
 if(study==='ema'){
  result=engine.ema(closes,period);
  if(result)lines=[{name:'Fictional close',data:closes.slice()},{name:'EMA',data:result.slice()}];
 }else if(study==='rsi'){
  result=engine.rsi(closes,period);
  if(result)lines=[{name:'Wilder RSI',data:result.history.slice()}];
 }else if(study==='macd'){
  result=engine.macd(closes,fast,slow,signal);
  if(result)lines=[{name:'MACD',data:result.line.slice()},{name:'Signal',data:result.signal.slice()},
   {name:'Histogram',data:result.histogram.slice()}];
 }else if(study==='bollinger'){
  result=engine.bollinger(closes,period,multiplier);
  if(result)lines=[{name:'Close',data:closes.slice()},{name:'Middle SMA',data:result.center.slice()},
   {name:'Upper',data:result.upper.slice()},{name:'Lower',data:result.lower.slice()}];
 }
 if(!result||!lines.every(s=>s.data.every(v=>v===null||finite(v))))return null;
 const current=study==='ema'?result.at(-1):study==='rsi'?result.history.at(-1):
  study==='macd'?result.line.at(-1):result.center.at(-1);
 if(!finite(current))return null;
 const detail=study==='ema'?freeze({alpha:2/(period+1),seed:closes.slice(0,period).reduce((a,b)=>a+b,0)/period,
  current}):study==='rsi'?freeze({gain:result.values[0],loss:result.values[1],rsi:current}):
  study==='macd'?freeze({fast:engine.ema(closes,fast).at(-1),slow:engine.ema(closes,slow).at(-1),
   macd:current,signal:result.signal.at(-1),histogram:result.histogram.at(-1)}):
  freeze({middle:current,deviation:result.sd.at(-1),upper:result.upper.at(-1),lower:result.lower.at(-1)});
 if(!Object.values(detail).every(v=>v===null||finite(v)))return null;
 return freeze({study,source:'fictional_authored_completed_closes',label:definitions[study].label,
  units:definitions[study].units,formula:definitions[study].formula,limitation:definitions[study].limitation,
  steps:freeze(closes.map((close,i)=>freeze({index:i+1,close}))),
  lines:freeze(lines.map(s=>freeze({name:s.name,data:freeze(s.data)}))),current,detail});
}
function compare(first,second,closes,params){
 if(!names.includes(first)||!names.includes(second)||first===second)return null;
 const a=calculate(first,closes,params),b=calculate(second,closes,params);
 if(!a||!b)return null;
 return freeze({first:a,second:b,relationship:'Different units, warmup and calculation methods are not comparable as automatic votes. Indicator disagreement means the evidence is inconclusive, not an entry or exit instruction.'});
}
const api=freeze({schema:'crownlight-indicators-experiment-v1',names,definitions,fixtures,calculate,compare});
root.CrownlightIndicatorExperimentsV1=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
