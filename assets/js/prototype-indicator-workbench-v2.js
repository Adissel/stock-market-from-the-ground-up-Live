/* Crownlight prototype indicator adapter v2. Synthetic OHLCV, current revealed bars only.
 * Shared original math source: CrownlightIndicatorMath. No side effects, APIs or membership writes.
 */
(function(root){'use strict';
 const specs=[
 ['EMA_FAST','EMA · Fast','Trend','emaFast','Price overlay'],
 ['EMA_SLOW','EMA · Slow','Trend','emaSlow','Price overlay'],
 ['EMA_200','EMA · 200','Trend','ema200','Price overlay — long-period historical context required'],
 ['SMA','Simple moving average','Trend','sma','Price overlay'],
 ['VWAP','Session HLC3 VWAP proxy','Volume/Price',null,'Price overlay — not trade-print VWAP'],
 ['BB','Bollinger Bands','Volatility','bbPeriod','Price overlay'],
 ['HOD','Observed high of day','Price levels',null,'Price overlay'],
 ['LOD','Observed low of day','Price levels',null,'Price overlay'],
 ['OR','Opening range H/L','Price levels','orb','Price overlay'],
 ['STRUCTURE','Confirmed HH/HL/LH/LL','Structure','pivot','Chart markers'],
 ['VOLUME','Volume','Participation',null,'Volume pane'],
 ['VOLMA','Volume moving average','Participation','volPeriod','Volume pane'],
 ['RSI','Wilder RSI','Momentum','rsi','Lower pane'],
 ['MACD','MACD (fast/slow/signal)','Momentum','macdFast','Lower pane'],
 ['ATR','Wilder ATR','Volatility','atr','Lower pane'],
 ['OBV','On-balance volume','Participation',null,'Lower pane']
 ].map(([id,label,family,setting,placement])=>({id,label,family,setting,placement}));
 const defaults=Object.freeze({emaFast:9,emaSlow:20,ema200:200,sma:20,bbPeriod:20,bbDeviation:2,rsi:14,macdFast:12,macdSlow:26,macdSignal:9,atr:14,volPeriod:20,orb:5,pivot:2});
 const enabledDefault=Object.freeze({EMA_FAST:true,EMA_SLOW:true,EMA_200:false,VWAP:true,VOLUME:true,RSI:true,MACD:false,SMA:false,BB:false,HOD:false,LOD:false,OR:false,STRUCTURE:false,VOLMA:false,ATR:false,OBV:false});
 function validSettings(value){
  const r={...defaults};
  for(const [k,def] of Object.entries(defaults)){
   const v=Number(value?.[k]);
   if(!Number.isFinite(v))continue;
   r[k]=k==='bbDeviation'?Math.min(4,Math.max(.5,Math.round(v*10)/10)):Math.min(k==='ema200'?400:k==='orb'?30:k==='pivot'?5:100,Math.max(k==='pivot'?1:2,Math.round(v)));
  }
  // MACD requires fast >= 2, slow >= 3 and fast < slow.
  // Do not let a user-entered slow=2 silently yield an unsupported fast=1.
  r.macdSlow=Math.max(3,r.macdSlow);
  r.macdFast=Math.max(2,Math.min(r.macdFast,r.macdSlow-1));
  return r;
 }
 const finite=Number.isFinite;
 const arr=(n)=>Array(n).fill(null);
 function compute(bars,config,show){
  const math=root.CrownlightIndicatorMath;
  if(!math)throw Error('Shared indicator math source not loaded');
  const settings=validSettings(config);
  const selected={...enabledDefault,...show};
  // Dated bars use the canonical exchange-time session engine. Undated
  // fictional editor fixtures remain one continuous synthetic session.
  const times=bars.map(x=>{
   const raw=x.timestamp??x.time;
   if(raw instanceof Date)return Number.isFinite(raw.getTime())?raw:null;
   if(typeof raw==='number'&&Number.isSafeInteger(raw))return new Date(raw);
   if(typeof raw==='string'&&/^\\d{4}-\\d\\d-\\d\\d[T ]/.test(raw)){
    const value=new Date(raw);return Number.isFinite(value.getTime())?value:null;
   }
   return null;
  });
  const dated=times.every(x=>x instanceof Date);
  if(times.some(x=>x instanceof Date)&&!dated)
   throw Error('Mixed dated and undated bars cannot be assigned an exchange session');
  const b=bars.map((x,i)=>({time:times[i],open:x.o,high:x.h,low:x.l,close:x.c,volume:x.v}));
  const closes=b.map(x=>x.close),volumes=b.map(x=>x.volume);
  const price=[],pane=[],volume=[],marks=[];
  const line=(label,data,color,width=1.8,axis='price')=>{
   const record={label,data:data.map(v=>finite(v)?v:null),color,width};
   if(axis==='price')price.push(record);else if(axis==='volume')volume.push(record);else pane.push({...record,axis});
  };
  if(selected.EMA_FAST)line('EMA '+settings.emaFast,math.ema(closes,settings.emaFast),'#72dfdf');
  if(selected.EMA_SLOW)line('EMA '+settings.emaSlow,math.ema(closes,settings.emaSlow),'#efd07c');
  if(selected.EMA_200)line('EMA '+settings.ema200,math.ema(closes,settings.ema200),'#b899ff',2);
  if(selected.SMA)line('SMA '+settings.sma,math.sma(closes,settings.sma),'#c4a7ff');
  if(selected.VWAP){
   let pv=0,volumeSum=0;
   const fictional=b.map(x=>{
    if(x.volume>0){pv+=((x.high+x.low+x.close)/3)*x.volume;volumeSum+=x.volume}
    return volumeSum>0?pv/volumeSum:null;
   });
   line('HLC3 volume-weighted bar proxy',dated?math.vwapProxy(b):fictional,'#7f9cff',2);
  }
  if(selected.BB){
   const band=math.bollinger(b,settings.bbPeriod,settings.bbDeviation);
   line('Bollinger middle',band.middle,'#a3e0c0',1.2);
   line('Bollinger upper',band.upper,'#cb99ed',1.4);
   line('Bollinger lower',band.lower,'#cb99ed',1.4);
  }
  if((selected.HOD||selected.LOD)&&dated){
   const levels=math.observedLevels(b);
   if(selected.HOD)line('Observed HOD',levels.HOD,'#ffcc9a',1.3);
   if(selected.LOD)line('Observed LOD',levels.LOD,'#e89aa7',1.3);
  }else if(selected.HOD||selected.LOD){let hi=-Infinity,lo=Infinity;const high=[],low=[];
   for(const x of b){hi=Math.max(hi,x.high);lo=Math.min(lo,x.low);high.push(hi);low.push(lo)}
   if(selected.HOD)line('Observed HOD',high,'#ffcc9a',1.3);
   if(selected.LOD)line('Observed LOD',low,'#e89aa7',1.3);
  }
  if(selected.OR&&dated){
   const range=math.openingRange(b,settings.orb);
   line('Opening range high',range.upper,'#cce78a',1.5);
   line('Opening range low',range.lower,'#9ebff2',1.5);
  }else if(selected.OR){const n=settings.orb;let hi=-Infinity,lo=Infinity;const high=[],low=[];
   for(let i=0;i<b.length;i++){if(i<n){hi=Math.max(hi,b[i].high);lo=Math.min(lo,b[i].low)}high.push(i>=n?hi:null);low.push(i>=n?lo:null)}
   line('Opening range high',high,'#cce78a',1.5);line('Opening range low',low,'#9ebff2',1.5);
  }
  if(selected.VOLUME)volume.push({label:'Volume',data:volumes,color:'#57d7b8',kind:'bar'});
  if(selected.VOLMA)line('Volume SMA '+settings.volPeriod,math.sma(volumes,settings.volPeriod),'#e5c86d',2,'volume');
  if(selected.RSI)line('Wilder RSI '+settings.rsi,math.rsi(b,settings.rsi),'#c7a2ef',2,'rsi');
  if(selected.MACD){
   const m=math.macd(b,settings.macdFast,settings.macdSlow,settings.macdSignal);
   line('MACD line',m.line,'#79bcf4',1.8,'macd');
   line('MACD signal',m.signal,'#f4b67b',1.7,'macd');
   pane.push({label:'MACD histogram',data:m.histogram,axis:'macd',kind:'bar',color:'#63d6b6'});
  }
  if(selected.ATR)line('Wilder ATR '+settings.atr,math.atr(b,settings.atr),'#d89dca',1.8,'atr');
  if(selected.OBV){let obv=0;const seq=b.map((x,i)=>{if(i){obv+=x.close> b[i-1].close?x.volume:x.close<b[i-1].close?-x.volume:0}return obv});
   line('On-balance volume',seq,'#80d9a0',1.8,'obv');
  }
  if(selected.STRUCTURE){const found=math.confirmedStructure(b,settings.pivot);
   for(const x of found)if(x.confirmedAt<b.length)marks.push({index:x.index,label:x.label,value:x.price,confirmedAt:x.confirmedAt});
  }
  const panes=[...new Set(pane.map(x=>x.axis))];
  return {price,pane,volume,marks,panes,settings,selected,warmup:Math.max(settings.ema200*(selected.EMA_200?1:0),settings.emaSlow,settings.sma,settings.rsi+1,settings.macdSlow+settings.macdSignal-1)};
 }
 root.CrownlightPrototypeIndicators=Object.freeze({specs,defaults,enabledDefault,validSettings,compute});
 if(typeof module!=='undefined'&&module.exports)module.exports={specs,defaults,enabledDefault,validSettings,compute};
})(typeof window!=='undefined'?window:globalThis);
