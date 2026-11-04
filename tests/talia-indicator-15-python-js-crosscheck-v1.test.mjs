// SMFGU-TALIA-INDICATOR-CROSSCHECK-015: original, independent JS/Python math.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const indicators=[...JSON.parse(readFileSync('data/tutor-indicator-study-v1.json','utf8')).guides,
 ...JSON.parse(readFileSync('data/tutor-indicator-expansion-v1.json','utf8')).guides];
const codes=['STUDY_SMA','STUDY_EMA','STUDY_WMA','STUDY_HMA','STUDY_DEMA','STUDY_TEMA',
'STUDY_KAMA','STUDY_MOVING_AVERAGE_RIBBON','STUDY_MACD','STUDY_MACD_HISTOGRAM',
'STUDY_PPO','STUDY_RSI','STUDY_STOCHASTIC','STUDY_STOCH_RSI','STUDY_CCI'];
const cnt=150,close=Array.from({length:cnt},(_,i)=>100+.11*i+((i%11)-5)*.23+((i%7)-3)*.07);
const high=close.map((v,i)=>v+1.20+.01*(i%5));
const low=close.map((v,i)=>v-1.10-.01*(i%4));
const sum=a=>a.reduce((x,y)=>x+y,0);
function sma(a,n){return a.map((_,i)=>i<n-1||a.slice(i-n+1,i+1).some(x=>x===null)?null:sum(a.slice(i-n+1,i+1))/n)}
function ema(a,n){
 const z=a.map(()=>null),alpha=2/(n+1);let count=0,rolling=[];
 for(let i=0;i<a.length;i++){
  const x=a[i];if(x===null){count=0;rolling=[];continue}
  if(i>0&&z[i-1]!==null){z[i]=alpha*x+(1-alpha)*z[i-1];continue}
  rolling.push(x);count++;
  if(count===n){z[i]=sum(rolling)/n;count=0;rolling=[]}
 }
 return z;
}
function wma(a,n){return a.map((_,i)=>{
 const x=a.slice(i-n+1,i+1);
 return i<n-1||x.some(v=>v===null)?null:x.reduce((v,p,j)=>v+p*(j+1),0)/(n*(n+1)/2);
})}
function hma(a,n){const h=wma(a,n/2),l=wma(a,n);return wma(a.map((_,i)=>h[i]===null||l[i]===null?null:2*h[i]-l[i]),Math.sqrt(n))}
function kama(a,n){
 let prior=null;
 return a.map((x,i)=>{
  if(i<n-1)return null;
  if(i===n-1){prior=sum(a.slice(0,n))/n;return prior}
  const direction=Math.abs(x-a[i-n]);
  const change=a.slice(i-n+1,i+1).reduce((v,y,j)=>v+Math.abs(y-a[i-n+j]),0);
  const er=change?direction/change:0;
  prior=prior+(er*(2/3-2/31)+2/31)**2*(x-prior);
  return prior;
 });
}
function rsi(a,n=14){
 let ag=0,al=0;
 return a.map((v,i)=>{
  if(i===0)return null;
  const change=v-a[i-1],g=Math.max(change,0),l=Math.max(-change,0);
  if(i<=n){ag+=g;al+=l;if(i<n)return null;ag/=n;al/=n}
  else{ag=(ag*(n-1)+g)/n;al=(al*(n-1)+l)/n}
  return ag===0&&al===0?50:al===0?100:100-100/(1+ag/al);
 });
}
function stochastic(a,h,l,n=14){return a.map((v,i)=>{
 if(i<n-1)return null;
 const hi=Math.max(...h.slice(i-n+1,i+1)),lo=Math.min(...l.slice(i-n+1,i+1));
 return hi===lo?null:100*(v-lo)/(hi-lo);
})}
function stochRsi(r,n=14){return r.map((v,i)=>{
 const a=r.slice(i-n+1,i+1);
 if(i<n-1||a.some(x=>x===null)||a.length!==n)return null;
 const lo=Math.min(...a),hi=Math.max(...a);
 return lo===hi?null:(v-lo)/(hi-lo);
})}
function cci(h,l,c,n=20){
 const typical=c.map((x,i)=>(h[i]+l[i]+x)/3);
 const mean=sma(typical,n);
 return mean.map((m,i)=>{
  if(m===null)return null;
  const window=typical.slice(i-n+1,i+1);
  const dev=sum(window.map(x=>Math.abs(x-m)))/n;
  return dev===0?null:(typical[i]-m)/(.015*dev);
 });
}
const e=ema(close,10),e2=ema(e,10),e3=ema(e2,10);
const f=ema(close,12),s=ema(close,26);
const macd=close.map((_,i)=>f[i]===null||s[i]===null?null:f[i]-s[i]);
const signal=ema(macd,9);
const js={
 STUDY_SMA:sma(close,10),STUDY_EMA:e,STUDY_WMA:wma(close,10),STUDY_HMA:hma(close,16),
 STUDY_DEMA:e.map((x,i)=>e2[i]===null?null:2*x-e2[i]),
 STUDY_TEMA:e.map((x,i)=>e3[i]===null?null:3*x-3*e2[i]+e3[i]),
 STUDY_KAMA:kama(close,10),STUDY_MOVING_AVERAGE_RIBBON:sma(close,20),
 STUDY_MACD:macd,STUDY_MACD_HISTOGRAM:macd.map((x,i)=>signal[i]===null?null:x-signal[i]),
 STUDY_PPO:close.map((_,i)=>s[i]===null||s[i]===0?null:100*(f[i]-s[i])/s[i]),
 STUDY_RSI:rsi(close),STUDY_STOCHASTIC:stochastic(close,high,low),
 STUDY_STOCH_RSI:stochRsi(rsi(close)),STUDY_CCI:cci(high,low,close),
};
test('all 15 canonical indicator lesson identities and formulas are present; not automatically released',()=>{
 assert.deepEqual(indicators.slice(0,15).map(x=>x.code),codes);
 for(const g of indicators.slice(0,15)){
  assert.ok(g.formula.length>14);assert.ok(g.sourceUrls.length>=1);
  assert.equal(g.officialCompetency,false);
 }
});
test('Python and JavaScript independently agree for 15 fictional studies and declared warmup indices',()=>{
 const process=spawnSync(globalThis.process.platform==='win32'?'python':'python3',['scripts/qa/talia_indicator_15_reference_v1.py'],{encoding:'utf8',timeout:8000});
 assert.equal(process.status,0,process.stderr);
 const reference=JSON.parse(process.stdout);assert.deepEqual(Object.keys(reference).sort(),codes.slice().sort());
 for(const id of codes){
  const arr=js[id];const last=arr.at(-1);
  assert.ok(Number.isFinite(last),id+' expected completed sample');
  assert.ok(Math.abs(last-reference[id].last)<1e-8,id+': JS '+last+' Python '+reference[id].last);
  assert.equal(arr.findIndex(x=>x!==null),reference[id].firstValid,id+' warmup');
 }
});
test('zero-denominator, absent window, no-lookahead interpretation remain explicit',()=>{
 assert.equal(sma([1,2],3).at(-1),null);
 assert.equal(stochastic([10,10,10],[10,10,10],[10,10,10],3).at(-1),null);
 assert.equal(cci([10,10,10],[10,10,10],[10,10,10],3).at(-1),null);
 assert.equal(rsi(Array.from({length:20},()=>10)).at(-1),50);
 assert.equal(rsi(Array.from({length:20},(_,i)=>10+i)).at(-1),100);
 assert.equal(js.STUDY_HMA.findIndex(v=>v!==null),18); // 16-period HMA + 4-period smoothing
 assert.equal(js.STUDY_MACD_HISTOGRAM.findIndex(v=>v!==null),33);
});
