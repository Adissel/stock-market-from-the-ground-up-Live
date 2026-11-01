/* Deterministic source QA mathematics only. Never a member entitlement,
 * grade, exchange feed, backtest signal or licensed-data redistributor.
 * Caller must separately prove completed status comes from authorized server.
 */
export function completedPrefix(bars,stop,asOf){
 if(!Array.isArray(bars)||bars.length<2||bars.length>10000||
  !Number.isInteger(stop)||stop<1||stop>=bars.length||!Number.isFinite(asOf))return null;
 const prefix=bars.slice(0,stop+1);
 for(let i=0;i<prefix.length;i++){
  const x=prefix[i],p=prefix[i-1];
  if(!x||x.completed!==true||![x.time,x.closeTime,x.open,x.high,x.low,x.close]
    .every(Number.isFinite)||x.time>=x.closeTime||x.closeTime>asOf||
    x.low>Math.min(x.open,x.close)||x.high<Math.max(x.open,x.close)||
    (p&&(x.time<p.closeTime||x.time<=p.time)))return null;
 }
 return prefix;
}
export function wilderDmi(bars,n=14){
 const L=bars.length,tr=[],plus=[],minus=[];
 for(let i=1;i<L;i++){
  const x=bars[i],p=bars[i-1],up=x.high-p.high,down=p.low-x.low;
  tr[i]=Math.max(x.high-x.low,Math.abs(x.high-p.close),Math.abs(x.low-p.close));
  plus[i]=up>down&&up>0?up:0;minus[i]=down>up&&down>0?down:0;
 }
 const adx=Array(L).fill(null),diPlus=Array(L).fill(null),diMinus=Array(L).fill(null);
 const dx=Array(L).fill(null);
 if(L<2*n)return {adx,diPlus,diMinus};
 let trSum=0,pSum=0,mSum=0;
 for(let i=1;i<=n;i++){trSum+=tr[i];pSum+=plus[i];mSum+=minus[i];}
 for(let i=n;i<L;i++){
  if(i>n){trSum+=tr[i]-trSum/n;pSum+=plus[i]-pSum/n;mSum+=minus[i]-mSum/n;}
  if(trSum<=0)continue;
  diPlus[i]=100*pSum/trSum;diMinus[i]=100*mSum/trSum;
  const total=diPlus[i]+diMinus[i];dx[i]=total?100*Math.abs(diPlus[i]-diMinus[i])/total:0;
  if(i===2*n-1){
   const initial=dx.slice(n,2*n);
   if(initial.every(Number.isFinite))adx[i]=initial.reduce((a,b)=>a+b,0)/n;
  }else if(i>2*n-1&&adx[i-1]!==null&&dx[i]!==null){
   adx[i]=(adx[i-1]*(n-1)+dx[i])/n;
  }
 }
 return {adx,diPlus,diMinus};
}
export function parabolicSar(bars,step=.02,maxAF=.2){
 const out=Array(bars.length).fill(null);
 if(bars.length<2)return out;
 let rising=bars[1].close>=bars[0].close;
 let sar=rising?bars[0].low:bars[0].high;
 let ep=rising?Math.max(bars[0].high,bars[1].high):
             Math.min(bars[0].low,bars[1].low);
 let af=step;out[1]=sar;
 for(let i=2;i<bars.length;i++){
  const x=bars[i],p=bars[i-1],pp=bars[i-2];
  let next=sar+af*(ep-sar);
  if(rising){
   next=Math.min(next,p.low,pp.low);
   if(x.low<next){rising=false;sar=ep;ep=x.low;af=step;}
   else{sar=next;if(x.high>ep){ep=x.high;af=Math.min(maxAF,af+step);}}
  }else{
   next=Math.max(next,p.high,pp.high);
   if(x.high>next){rising=true;sar=ep;ep=x.high;af=step;}
   else{sar=next;if(x.low<ep){ep=x.low;af=Math.min(maxAF,af+step);}}
  }
  out[i]=sar;
 }
 return out;
}
export function wilderAtr(bars,n=14){
 const tr=bars.map((b,i)=>i===0?b.high-b.low:
  Math.max(b.high-b.low,Math.abs(b.high-bars[i-1].close),Math.abs(b.low-bars[i-1].close)));
 const result=Array(bars.length).fill(null);
 if(bars.length<n)return result;
 result[n-1]=tr.slice(0,n).reduce((a,b)=>a+b,0)/n;
 for(let i=n;i<bars.length;i++)result[i]=(result[i-1]*(n-1)+tr[i])/n;
 return result;
}
export function supertrend(bars,n=14,multiplier=3){
 const atr=wilderAtr(bars,n),values=Array(bars.length).fill(null);
 let upper=null,lower=null,direction=-1;
 for(let i=n-1;i<bars.length;i++){
  const middle=(bars[i].high+bars[i].low)/2,bu=middle+multiplier*atr[i],
  bl=middle-multiplier*atr[i];
  if(i===n-1){upper=bu;lower=bl;values[i]=upper;continue;}
  const wasUpper=upper,wasLower=lower,prev=bars[i-1].close;
  upper=bu<wasUpper||prev>wasUpper?bu:wasUpper;
  lower=bl>wasLower||prev<wasLower?bl:wasLower;
  if(direction===-1&&bars[i].close>upper)direction=1;
  else if(direction===1&&bars[i].close<lower)direction=-1;
  values[i]=direction===1?lower:upper;
 }
 return values;
}
export function ichimoku(bars){
 const midpoint=(i,n)=>{
  if(i<n-1)return null;
  const x=bars.slice(i-n+1,i+1);
  return (Math.max(...x.map(b=>b.high))+Math.min(...x.map(b=>b.low)))/2;
 };
 return bars.map((b,i)=>{
  const t=midpoint(i,9),k=midpoint(i,26),spanB=midpoint(i,52);
  return {asOf:b.closeTime,plotIndex:i+26,
    tenkan:t,kijun:k,spanA:t===null||k===null?null:(t+k)/2,
    spanB,usesFutureBars:false};
 });
}
