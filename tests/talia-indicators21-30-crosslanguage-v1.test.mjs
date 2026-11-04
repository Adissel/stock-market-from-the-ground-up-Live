import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const c=Array.from({length:120},(_,i)=>100+i*.11+((i%7)-3)*.31);
const h=c.map(v=>v+1.2),l=c.map(v=>v-1.1),n=14;
function ar(a,maximum=true){const w=a.slice(-25),m=maximum?Math.max(...w):Math.min(...w);return 100*(25-(24-w.lastIndexOf(m)))/25;}
function dmi(){
 const tr=[],plus=[],minus=[];
 for(let i=1;i<120;i++){
  tr.push(Math.max(h[i]-l[i],Math.abs(h[i]-c[i-1]),Math.abs(l[i]-c[i-1])));
  const u=h[i]-h[i-1],d=l[i-1]-l[i];
  plus.push(u>d&&u>0?u:0);minus.push(d>u&&d>0?d:0);
 }
 let rt=tr.slice(0,n).reduce((a,b)=>a+b),rp=plus.slice(0,n).reduce((a,b)=>a+b),rm=minus.slice(0,n).reduce((a,b)=>a+b);
 const dx=[];let p=0,m=0;
 for(let i=n-1;i<tr.length;i++){
  if(i>=n){rt=rt-rt/n+tr[i];rp=rp-rp/n+plus[i];rm=rm-rm/n+minus[i]}
  p=100*rp/rt;m=100*rm/rt;dx.push(p+m?100*Math.abs(p-m)/(p+m):0);
 }
 let adx=dx.slice(0,n).reduce((a,b)=>a+b)/n;
 for(const v of dx.slice(n))adx=(adx*13+v)/14;
 return {adx,difference:p-m};
}
const w=c.slice(-20),middle=w.reduce((a,b)=>a+b)/20;
const sd=Math.sqrt(w.reduce((a,b)=>a+(b-middle)**2,0)/20);
const upper=middle+2*sd,lower=middle-2*sd;
const mid=k=>(Math.max(...h.slice(-k))+Math.min(...l.slice(-k)))/2;
const dm=dmi();
const calc={
 STUDY_AROON:ar(h),STUDY_AROON_OSCILLATOR:ar(h)-ar(l,false),
 STUDY_ADX:dm.adx,STUDY_DIRECTIONAL_MOVEMENT:dm.difference,
 STUDY_ICHIMOKU:(mid(9)+mid(26))/2,
 STUDY_BOLLINGER_BANDS:upper,
 STUDY_BOLLINGER_PERCENT_B:(c.at(-1)-lower)/(upper-lower),
 STUDY_BOLLINGER_BANDWIDTH:100*(upper-lower)/middle
};
test('independent Python vs JavaScript calculation values match for eight canonical 21–30 studies',()=>{
 const p=spawnSync(process.platform==='win32'?'python':'python3',['scripts/qa/talia_indicator21_30_python_v1.py'],{encoding:'utf8',timeout:10000});
 assert.equal(p.status,0,p.stderr);
 const ref=JSON.parse(p.stdout);
 assert.deepEqual(Object.keys(ref).sort(),Object.keys(calc).sort());
 for(const [code,value] of Object.entries(calc)){
  assert.ok(Number.isFinite(value),code);
  assert.ok(Math.abs(value-ref[code])<1e-8,code+' reference mismatch '+value+' '+ref[code]);
 }
});
test('SAR and Supertrend are still held for specified initialization/flip algorithms',()=>{
 assert.equal(Object.hasOwn(calc,'STUDY_PARABOLIC_SAR'),false);
 assert.equal(Object.hasOwn(calc,'STUDY_SUPERTREND'),false);
});
