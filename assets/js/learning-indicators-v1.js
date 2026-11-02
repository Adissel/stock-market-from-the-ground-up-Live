/* SMFGU-LAB-INDICATOR-001: original FICTIONAL formative calculation.
 * No broker feed, hidden grading, account write, future data, or entitlement.
 */
(function(root){'use strict';
const f=x=>typeof x==='number'&&Number.isFinite(x);
const frozen=a=>Object.freeze(a);
function ema(c,p){
 if(!Array.isArray(c)||!Number.isInteger(p)||p<2||p>100||c.length<p||c.length>500||!c.every(f))return null;
 const series=Array(c.length).fill(null),alpha=2/(p+1);
 let value=c.slice(0,p).reduce((a,b)=>a+b,0)/p;
 if(!f(value))return null;series[p-1]=value;
 for(let i=p;i<c.length;i++){value=alpha*c[i]+(1-alpha)*value;if(!f(value))return null;series[i]=value}
 return frozen(series);
}
function rsi(c,p){
 if(!Array.isArray(c)||!Number.isInteger(p)||p<2||p>100||c.length<p+1||c.length>500||!c.every(x=>f(x)&&x>0))return null;
 let gain=0,loss=0;
 for(let i=1;i<=p;i++){const d=c[i]-c[i-1];gain+=Math.max(0,d);loss+=Math.max(0,-d)}
 gain/=p;loss/=p;
 if(!f(gain)||!f(loss))return null;
 const history=Array(c.length).fill(null),ratio=(g,l)=>l===0?(g===0?50:100):100-100/(1+g/l);
 history[p]=ratio(gain,loss);
 for(let i=p+1;i<c.length;i++){const d=c[i]-c[i-1];gain=(gain*(p-1)+Math.max(0,d))/p;loss=(loss*(p-1)+Math.max(0,-d))/p;if(!f(gain)||!f(loss))return null;history[i]=ratio(gain,loss)}
 return frozen({history:frozen(history),values:frozen([gain,loss,history.at(-1)]),
  convention:'Wilder: seed simple average of first period price changes; then smooth average gains and losses by period; flat average = 50'});
}
function macd(c,fast,slow,signal){
 if(!Array.isArray(c)||!Number.isInteger(fast)||!Number.isInteger(slow)||!Number.isInteger(signal)||
   fast<2||slow<=fast||signal<2||c.length<slow+signal-1||c.length>500||!c.every(x=>f(x)&&x>0))return null;
 const a=ema(c,fast),b=ema(c,slow);
 if(!a||!b)return null;
 const line=c.map((_,i)=>b[i]===null?null:a[i]-b[i]);
 if(!line.every(x=>x===null||f(x)))return null;
 const start=slow-1,seed=ema(line.slice(start),signal);
 if(!seed)return null;
 const sig=c.map((_,i)=>i<start||seed[i-start]===null?null:seed[i-start]);
 const histogram=line.map((v,i)=>v===null||sig[i]===null?null:v-sig[i]);
 return frozen({line:frozen(line),signal:frozen(sig),histogram:frozen(histogram),
  values:frozen([a.at(-1),b.at(-1),line.at(-1)]),
  convention:'Fast/slow EMA seeded by first period SMA; signal EMA seeded by first signal-period valid MACD values; no premature plots'});
}
function atr(b,p){
 if(!Array.isArray(b)||!Number.isInteger(p)||p<2||p>100||b.length<p||b.length>500||
   !b.every(x=>x&&[x.h,x.l,x.c].every(f)&&x.l>0&&x.l<=x.c&&x.c<=x.h))return null;
 const tr=b.map((x,i)=>i===0?x.h-x.l:Math.max(x.h-x.l,Math.abs(x.h-b[i-1].c),Math.abs(x.l-b[i-1].c)));
 if(!tr.every(f))return null;
 const seed=tr.slice(0,p).reduce((a,v)=>a+v,0)/p,history=Array(b.length).fill(null);
 if(!f(seed))return null;
 let value=seed;history[p-1]=value;
 for(let i=p;i<b.length;i++){value=(value*(p-1)+tr[i])/p;if(!f(value))return null;history[i]=value}
 return frozen({tr:frozen(tr),history:frozen(history),values:frozen([tr.at(-1),seed,value]),
  convention:'First true range high-minus-low, later max of range and prior-close gaps; first ATR is SMA of period true ranges, then Wilder smoothing'});
}
function bollinger(c,p,k=2){
 if(!Array.isArray(c)||!Number.isInteger(p)||p<2||p>100||!f(k)||k<=0||k>5||
   c.length<p||c.length>500||!c.every(x=>f(x)&&x>0))return null;
 const center=Array(c.length).fill(null),upper=center.slice(),lower=center.slice(),sd=center.slice();
 for(let i=p-1;i<c.length;i++){
  const w=c.slice(i-p+1,i+1),avg=w.reduce((a,b)=>a+b,0)/p;
  const sigma=Math.sqrt(w.reduce((sum,v)=>sum+(v-avg)**2,0)/p);
  if(!f(avg)||!f(sigma)||!f(avg-k*sigma)||!f(avg+k*sigma))return null;
  center[i]=avg;sd[i]=sigma;lower[i]=avg-k*sigma;upper[i]=avg+k*sigma
 }
 return frozen({center:frozen(center),upper:frozen(upper),lower:frozen(lower),sd:frozen(sd),
  values:frozen([center.at(-1),sd.at(-1),upper.at(-1)]),
  convention:'Simple average and population standard deviation, divided by period; bands are middle ± k×sigma'});
}
const bars=a=>frozen(a.map(x=>frozen(x)));
const definitions=frozen({
 rsi:frozen({label:'RSI · Wilder smoothing',keys:frozen(['Average gain','Average loss','RSI']),units:'0–100',
  intro:'RSI describes momentum; overbought and oversold are not automatic entry signals.',
  workedPrompt:'Fictional closes: 10, 11, 12, 11, 13, 14. Period 3, Wilder method. Compute final smoothed gain, loss and RSI.',
  transferPrompt:'NEW fictional closes: 20, 21, 20, 22, 23, 22. Period 3. Compute only the final RSI.',
  initial:frozen({closes:frozen([10,11,12,11,13,14]),period:3}),
  transfer:frozen({closes:frozen([20,21,20,22,23,22]),period:3}),
  limitation:'Requires period completed price changes plus a starting close. RSI is not a prediction.'}),
 macd:frozen({label:'MACD · multiple EMA warmups',keys:frozen(['Fast EMA','Slow EMA','MACD line']),units:'USD/share',
  intro:'MACD is fast EMA minus slow EMA; its signal line is another EMA of MACD, and histogram is the difference.',
  workedPrompt:'Fictional closes: 10, 11, 12, 11, 13, 14, 15, 14. Use illustrative fast 3, slow 5, signal 3; SMA-seed all EMAs.',
  transferPrompt:'NEW fictional closes: 20, 21, 22, 23, 22, 24, 25, 23. Use fast 3, slow 5, signal 3. Compute only final MACD line.',
  initial:frozen({closes:frozen([10,11,12,11,13,14,15,14]),fast:3,slow:5,signal:3}),
  transfer:frozen({closes:frozen([20,21,22,23,22,24,25,23]),fast:3,slow:5,signal:3}),
  limitation:'Illustrative periods, not standard platform presets. MACD and signal require different warmup lengths.'}),
 atr:frozen({label:'ATR · Wilder true range',keys:frozen(['Latest true range','Initial ATR seed','Latest ATR']),units:'USD/share',
  intro:'ATR estimates recent range variability including gaps, not market direction.',
  workedPrompt:'Fictional H/L/C: (11,9,10) (12,10,11) (13,10,12) (14,11,13) (15,12,14). ATR period 3. Compute latest TR, seed and latest ATR.',
  transferPrompt:'NEW fictional H/L/C: (21,19,20) (22,20,21) (24,20,23) (25,22,24) (26,23,25). ATR period 3. Compute final ATR.',
  initial:frozen({bars:bars([{h:11,l:9,c:10},{h:12,l:10,c:11},{h:13,l:10,c:12},{h:14,l:11,c:13},{h:15,l:12,c:14}]),period:3}),
  transfer:frozen({bars:bars([{h:21,l:19,c:20},{h:22,l:20,c:21},{h:24,l:20,c:23},{h:25,l:22,c:24},{h:26,l:23,c:25}]),period:3}),
  limitation:'First TR has no prior close and uses H−L; then gaps enter TR. This fictional 3-bar period is educational.'}),
 bollinger:frozen({label:'Bollinger Bands · SMA and population sigma',keys:frozen(['Middle SMA','Population sigma','Upper band']),units:'USD/share',
  intro:'Bands use a moving average and a dispersion measure; touching a band alone does not prove reversal.',
  workedPrompt:'Fictional closes: 10, 11, 12, 13, 12, 14. Use period 3, k=2, and population standard deviation. Compute final middle, sigma and upper.',
  transferPrompt:'NEW fictional closes: 20, 22, 21, 23, 24, 22. Use period 3, k=2, population sigma. Compute final upper band.',
  initial:frozen({closes:frozen([10,11,12,13,12,14]),period:3,k:2}),
  transfer:frozen({closes:frozen([20,22,21,23,24,22]),period:3,k:2}),
  limitation:'Different dispersion conventions and warmup periods produce different bands; multiplier and price source must be specified.'})
});
function calculate(id,input){
 if(!definitions[id]||!input)return null;
 if(id==='rsi'){const r=rsi(input.closes,input.period);return r&&frozen({...r,
  chart:frozen([{name:'RSI',type:'line',data:r.history}]),labels:input.closes.map((_,i)=>'Close '+(i+1))})}
 if(id==='macd'){const r=macd(input.closes,input.fast,input.slow,input.signal);return r&&frozen({...r,
  chart:frozen([{name:'MACD',type:'line',data:r.line},{name:'Signal',type:'line',data:r.signal},{name:'Histogram',type:'bar',data:r.histogram}]),
  labels:input.closes.map((_,i)=>'Close '+(i+1))})}
 if(id==='atr'){const r=atr(input.bars,input.period);return r&&frozen({...r,
  chart:frozen([{name:'True range',type:'bar',data:r.tr},{name:'ATR',type:'line',data:r.history}]),
  labels:input.bars.map((_,i)=>'Bar '+(i+1))})}
 const r=bollinger(input.closes,input.period,input.k);return r&&frozen({...r,
  chart:frozen([{name:'Close',type:'line',data:input.closes},{name:'Middle',type:'line',data:r.center},{name:'Upper',type:'line',data:r.upper},{name:'Lower',type:'line',data:r.lower}]),
  labels:input.closes.map((_,i)=>'Close '+(i+1))});
}
const approved=frozen({'F3-C07-L01':'rsi','F3-C07-L02':'rsi','F3-C07-L03':'macd',
 'DT-C19-L03':'atr','F3-C07-L04':'bollinger'});
const topicMatch=frozen({
 rsi:/\bRSI\b/i,macd:/\bMACD\b/i,
 atr:/Range and Volatility|Average True Range|\bATR\b/i,
 bollinger:/narrow price window|Bollinger|volatility bands?/i
});
function select({labId,topic}={}){
 const id=approved[labId];return id&&typeof topic==='string'&&topicMatch[id].test(topic)?id:null;
}
function assess({studyId,inputs,mode,stage,provenance}={}){
 const fail=reason=>frozen({status:'insufficient_evidence',reason,officialGrade:false,masteryAwarded:false});
 const def=definitions[studyId],r=def&&calculate(studyId,def.initial);
 if(!r||!['guided','practice'].includes(mode)||stage!=='practice'||provenance!=='fictional_authored'||
  !Array.isArray(inputs)||inputs.length!==3)return fail('Authorized fictional Guided/Practice evidence is required.');
 const observations=[];
 for(let i=0;i<3;i++){
  const raw=String(inputs[i]??'').trim();
  if(raw.length>24||!/^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw))return fail('Enter three finite decimal inputs.');
  const actual=Number(raw);if(!f(actual))return fail('Nonfinite input');
  observations.push(frozen({label:def.keys[i],actual,expected:r.values[i],matched:Math.abs(actual-r.values[i])<=.011}));
 }
 const first=observations.findIndex(o=>!o.matched);
 return frozen({schema:'smfgu.learning.indicators.formative.v1',status:first<0?'method_steps_matched':'observed_step_mismatch',
  studyId,sourceType:'fictional_authored',observations:frozen(observations),verifiedCause:false,
  code:first<0?'none':studyId+'_step_'+(first+1),correction:r.convention,limitation:def.limitation,
  officialGrade:false,masteryAwarded:false,memberRecordWritten:false,entitlementGranted:false,paidInference:false});
}
function checkTransfer({studyId,submitted,mode}={}){
 const invalid=frozen({accepted:false,correct:false,officialGrade:false,masteryAwarded:false,message:'Invalid ungraded transfer attempt.'});
 const def=definitions[studyId],raw=String(submitted??'').trim();
 if(!def||!['guided','practice'].includes(mode)||raw.length>24||
   !/^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw))return invalid;
 const actual=Number(raw),expected=calculate(studyId,def.transfer)?.values[2];
 if(!f(actual)||!f(expected))return invalid;
 const correct=Math.abs(actual-expected)<=.011;
 return frozen({accepted:true,correct,officialGrade:false,masteryAwarded:false,
  message:correct?'Correct fictional transfer. No official grade or mastery awarded.':'Not yet correct. Review the seed, warmup and intermediate steps.'});
}
const api=frozen({definitions,ema,rsi,macd,atr,bollinger,calculate,select,assess,checkTransfer,approved});
root.GroundUpLearningIndicatorsV1=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
