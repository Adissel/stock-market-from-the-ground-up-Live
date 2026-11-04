/* Crownlight evidence toolkit · deterministic fictional-only ungraded calculations.
 * No networking, data persistence, private rubrics, grades or trading execution.
 * Inputs to each function must be an already revealed chronological prefix.
 */
(function(root){'use strict';
 const finite=n=>typeof n==='number'&&Number.isFinite(n);
 function candle(b){
  if(!b||!['open','high','low','close'].every(k=>finite(b[k])))return null;
  const {open,high,low,close}=b;
  if(low>high||low>Math.min(open,close)||high<Math.max(open,close))return null;
  const body=Math.abs(close-open),range=high-low;
  return Object.freeze({open,high,low,close,body,range,upperWick:high-Math.max(open,close),
   lowerWick:Math.min(open,close)-low,bodyPercent:range?100*body/range:0,
   direction:close>open?'up':close<open?'down':'unchanged'});
 }
 function validate(trades,count){
  if(!Array.isArray(trades)||trades.length>10000||!Number.isSafeInteger(count)||count<0||count>trades.length)return false;
  let minute=-1;
  // Validate only observations already visible at this cursor: no future-input dependency.
  for(let i=0;i<count;i++){
   const t=trades[i];
   if(!t||!Number.isSafeInteger(t.minute)||t.minute<0||t.minute<minute||
    !finite(t.price)||t.price<=0||!Number.isSafeInteger(t.shares)||t.shares<=0)return false;
   minute=t.minute;
  }
  return true;
 }
 function prefix(trades,count){
  if(!validate(trades,count))return null;
  return trades.slice(0,count);
 }
 function vwap(trades,count){
  const visible=prefix(trades,count);if(!visible)return null;
  let dollars=0,volume=0;const steps=[];
  for(const t of visible){
   const notional=t.price*t.shares;
   dollars+=notional;volume+=t.shares;
   if(![notional,dollars,volume].every(finite))return null;
   steps.push(Object.freeze({minute:t.minute,price:t.price,shares:t.shares,notional,
    cumulativeNotional:dollars,cumulativeVolume:volume,vwap:dollars/volume}));
  }
  return Object.freeze({revealed:count,total:trades.length,volume,dollars,
   value:volume?dollars/volume:null,steps});
 }
 function aggregate(trades,count,timeframe=1){
  if(![1,3,5].includes(timeframe))return null;
  const visible=prefix(trades,count);if(!visible)return null;
  const bars=[];
  for(const t of visible){
   const minute=Math.floor(t.minute/timeframe)*timeframe;
   let b=bars[bars.length-1];
   if(!b||b.minute!==minute){
    b={minute,open:t.price,high:t.price,low:t.price,close:t.price,volume:0};
    bars.push(b);
   }
   b.high=Math.max(b.high,t.price);b.low=Math.min(b.low,t.price);
   b.close=t.price;b.volume+=t.shares;
   if(!finite(b.volume))return null;
  }
  return bars.map(b=>Object.freeze({...b}));
 }
 // A pivot at i is not confirmed until the observation at i+1 exists.
 function structure(bars){
  if(!Array.isArray(bars)||bars.length>10000||bars.some(b=>!candle(b)))return null;
  const out=[];let high=null,low=null;
  for(let i=1;i<bars.length-1;i++){
   const left=bars[i-1],b=bars[i],right=bars[i+1];
   if(b.high>left.high&&b.high>right.high){
    const label=high===null?'Swing high':b.high>high?'HH':b.high<high?'LH':'Equal high';
    out.push({index:i,type:'high',price:b.high,label,confirmedAt:i+1});high=b.high;
   }
   if(b.low<left.low&&b.low<right.low){
    const label=low===null?'Swing low':b.low>low?'HL':b.low<low?'LL':'Equal low';
    out.push({index:i,type:'low',price:b.low,label,confirmedAt:i+1});low=b.low;
   }
  }
  return out;
 }
 function candleContrast(a,b){
  const x=candle(a),y=candle(b);if(!x||!y)return null;
  return {first:x,second:y,bodyPercentDelta:y.bodyPercent-x.bodyPercent,
   evidence:'Similar candlesticks can have different context. A wick cannot establish intrabar transaction order or predict the next candle.'};
 }
 const api=Object.freeze({schema:'crownlight-evidence-v1',candle,prefix,vwap,aggregate,structure,candleContrast});
 root.CrownlightEvidenceCoreV1=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
