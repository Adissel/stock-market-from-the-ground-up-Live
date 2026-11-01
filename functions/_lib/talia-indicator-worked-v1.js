/* SMFGU-TALIA-INDICATOR-MATH-001.
 * Source-only original deterministic fictional numeric instruction. Not a
 * Chart Studio overlay, paid inference, current market feed or grade.
 */
const ok=x=>typeof x==='number'&&Number.isFinite(x);
export const TALIA_STUDY_CALCULATED=Object.freeze(['STUDY_ELDER_RAY','STUDY_VORTEX','STUDY_NVI','STUDY_PVI','STUDY_ULCER_INDEX','STUDY_EMV','STUDY_CHOPPINESS','STUDY_FISHER_TRANSFORM']);
export function elderRayExample(high,low,ema13){
 if(![high,low,ema13].every(ok)||low>high)return null;
 return {bull:high-ema13,bear:low-ema13};
}
export function vortexExample(bars,period){
 if(!Array.isArray(bars)||!Number.isInteger(period)||period<2||bars.length<period+1)return null;
 const data=bars.slice(-(period+1));
 for(const b of data)if(!b||![b.high,b.low,b.close].every(ok)||b.high<b.low)return null;
 let plus=0,minus=0,range=0;
 for(let i=1;i<data.length;i++){
  const x=data[i],before=data[i-1];
  plus+=Math.abs(x.high-before.low);
  minus+=Math.abs(x.low-before.high);
  range+=Math.max(x.high-x.low,Math.abs(x.high-before.close),Math.abs(x.low-before.close));
 }
 return range>0?{plus:plus/range,minus:minus/range,period,trueRangeSum:range}:null;
}
export function volumeIndexExample(closes,volumes,kind,seed=1000){
 if(!Array.isArray(closes)||!Array.isArray(volumes)||closes.length!==volumes.length||
    !['NVI','PVI'].includes(kind)||!ok(seed)||seed<=0||closes.length<2||closes.some(x=>!ok(x)||x<=0)||
    volumes.some(x=>!ok(x)||x<0))return null;
 const series=[seed];let current=seed,updates=0;
 for(let i=1;i<closes.length;i++){
  const qualifies=kind==='NVI'?volumes[i]<volumes[i-1]:volumes[i]>volumes[i-1];
  if(qualifies){current*=closes[i]/closes[i-1];updates++;}
  series.push(current);
 }
 return {kind,seed,value:current,series,updates};
}
export function ulcerExample(drawdownPercent){
 if(!Array.isArray(drawdownPercent)||drawdownPercent.length<2||
    drawdownPercent.some(x=>!ok(x)||x>0||x< -100))return null;
 return Math.sqrt(drawdownPercent.reduce((a,x)=>a+x*x,0)/drawdownPercent.length);
}
export function easeOfMovementExample(pHigh,pLow,high,low,volume,scale=10000){
 if(![pHigh,pLow,high,low,volume,scale].every(ok)||pHigh<pLow||high<=low||volume<=0||scale<=0)return null;
 const movement=(high+low-pHigh-pLow)/2,boxRatio=(volume/scale)/(high-low);
 return boxRatio>0?{movement,boxRatio,value:movement/boxRatio,scale}:null;
}
export function choppinessExample(bars,period){
 if(!Array.isArray(bars)||!Number.isInteger(period)||period<2||bars.length<period+1)return null;
 const a=bars.slice(-(period+1));
 if(a.some(x=>!x||![x.high,x.low,x.close].every(ok)||x.high<x.low))return null;
 let sum=0,top=-Infinity,bottom=Infinity;
 for(let i=1;i<a.length;i++){
  const x=a[i],prior=a[i-1];
  sum+=Math.max(x.high-x.low,Math.abs(x.high-prior.close),Math.abs(x.low-prior.close));
  top=Math.max(top,x.high);bottom=Math.min(bottom,x.low);
 }
 return sum>0&&top>bottom?{period,sum,range:top-bottom,value:100*Math.log10(sum/(top-bottom))/Math.log10(period)}:null;
}
export function fisherNormalizedExample(x){
 return ok(x)&&x>-1&&x<1?.5*Math.log((1+x)/(1-x)):null;
}
const money=n=>'$'+n.toFixed(2),rounded=n=>Number(n).toFixed(4);
export function indicatorWorkedTeaching(code,question=''){
 if(!TALIA_STUDY_CALCULATED.includes(code))return null;
 const another=/\b(?:another|different|new example|try again)\b/i.test(String(question));
 const i=another?1:0;
 const head=['Original fictional numerical indicator teaching — ungraded.',
  'This is source-only arithmetic using completed hypothetical data. It is not an executable or predictive indicator signal.'];
 const details=[];
 if(code==='STUDY_ELDER_RAY'){
  const cases=[{high:10.5,low:9.6,ema:10},{high:20.7,low:19.8,ema:20.2}],x=cases[i],v=elderRayExample(x.high,x.low,x.ema);
  details.push('Declared seeded 13-period EMA '+money(x.ema)+', completed high '+money(x.high)+', completed low '+money(x.low)+'.',
   'Bull power = high − EMA13 = '+money(v.bull)+' per share.',
   'Bear power = low − EMA13 = '+money(v.bear)+' per share.',
   'EMA13 seed/history and the completed-bar cutoff must be verified independently.');
 }else if(code==='STUDY_VORTEX'){
  const cases=[
   [{high:10.2,low:9.8,close:10},{high:10.5,low:9.9,close:10.3},{high:10.8,low:10.1,close:10.7}],
   [{high:20.4,low:20.0,close:20.2},{high:20.5,low:19.8,close:20},{high:20.3,low:19.5,close:19.7}]
  ],v=vortexExample(cases[i],2);
  details.push('Illustrative two-interval Vortex only, three consecutive completed OHLC bars: '+JSON.stringify(cases[i])+'.',
   'SUM(true range)='+rounded(v.trueRangeSum)+' price units; VI+='+rounded(v.plus)+' and VI−='+rounded(v.minus)+'.',
   'This two-interval teaching calculation is not a substitute for a platform 14-period setting.');
 }else if(code==='STUDY_NVI'||code==='STUDY_PVI'){
  const cases=[
   {closes:[10,11,10.5,12],volumes:[100,80,120,90]},
   {closes:[20,19,20,21],volumes:[300,400,200,500]}
  ],x=cases[i],kind=code.slice(-3),v=volumeIndexExample(x.closes,x.volumes,kind,1000);
  details.push('Fictional completed closing prices '+x.closes.map(money).join(', ')+' and volume shares '+x.volumes.join(', ')+'.',
   'Seed=1000 index units; '+kind+' updates on strictly '+(kind==='NVI'?'lower':'higher')+' volume than the immediately preceding completed bar.',
   'Computed path '+v.series.map(rounded).join(' → ')+'; qualifying updates='+v.updates+'.',
   'Index seed level is arbitrary and does not identify informed counterparties or buyers.');
 }else if(code==='STUDY_EMV'){
  const x=[{prev:[10.2,9.8],now:[10.7,10.1],vol:1200,scale:10000},
   {prev:[20.6,20],now:[20.3,19.5],vol:800,scale:10000}][i];
  const v=easeOfMovementExample(...x.prev,...x.now,x.vol,x.scale);
  details.push('Completed prior and current high-low: '+x.prev.join(',')+' and '+x.now.join(',')+'; volume '+x.vol+' shares; scale '+x.scale+'.',
   'Midpoint movement='+rounded(v.movement)+'; box ratio='+rounded(v.boxRatio)+'; illustrative 1-period EMV='+rounded(v.value)+'.',
   'Actual smoothing and vendor volume scales require independent warmup and convention checks.');
 }else if(code==='STUDY_CHOPPINESS'){
  const data=[
   [{high:10.2,low:9.8,close:10},{high:10.6,low:9.9,close:10.4},{high:10.8,low:10.1,close:10.7}],
   [{high:20.3,low:19.9,close:20},{high:20.5,low:19.6,close:19.8},{high:20.6,low:19.4,close:20.4}]
  ][i],v=choppinessExample(data,2);
  details.push('Three fictional completed OHLC bars, two-window CHOP demonstration: '+JSON.stringify(data)+'.',
   'Gap-aware TR sum='+rounded(v.sum)+'; window high-low range='+rounded(v.range)+'.',
   'CHOP(2)=100×log10(TRsum/windowRange)/log10(2)='+rounded(v.value)+'. The default fourteen-period version needs more bars.');
 }else if(code==='STUDY_FISHER_TRANSFORM'){
  const x=[.5,-.5][i],v=fisherNormalizedExample(x);
  details.push('Already-normalized hypothetical x='+rounded(x)+' in open interval (−1,+1).',
   'Core 0.5×ln((1+x)/(1−x))='+rounded(v)+'.',
   'This is not a complete platform Fisher chart: normalization, clamping, recursive smoothing and signals are absent.');
 }else if(code==='STUDY_ULCER_INDEX'){
  const cases=[[-10,-5,0],[-20,-10,0]],xs=cases[i],v=ulcerExample(xs);
  details.push('Three illustrative completed percentage drawdowns from previously observed rolling price peaks: '+xs.join('%, ')+'%.',
   'Ulcer Index = square root of mean squared drawdowns = '+rounded(v)+' percentage points.',
   'Peaks and the window must be computed from known completed closes; drawdowns supplied here are synthetic illustrative inputs.');
 }
 return [...head,...details,
  'Limitation: different period, seed, source, chart feed or data adjustment conventions change results. No future bars or official assessment answers.',
  'Independent transfer: change the final fictional observation, recompute in consistent units, and state one unsupported market conclusion.'].join('\n\n');
}
