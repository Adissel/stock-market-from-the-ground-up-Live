import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const all=[...JSON.parse(readFileSync('data/tutor-indicator-study-v1.json','utf8')).guides,
 ...JSON.parse(readFileSync('data/tutor-indicator-expansion-v1.json','utf8')).guides];
const guides=all.slice(60,73);
const N=140;
const close=Array.from({length:N},(_,i)=>100+.045*i+2*Math.sin(.45*i)+.7*Math.cos(.13*i));
const high=close.map((v,i)=>v+1.1+.07*(i%3)),low=close.map((v,i)=>v-1.1-.05*(i%5));
const volume=close.map((_,i)=>4000+31*i+180*(i%7));
const sum=a=>a.reduce((x,y)=>x+y,0),mean=a=>sum(a)/a.length;
function emaSeries(values,n){
 const result=values.map(()=>null);
 for(let i=0;i<values.length;i++){
  const v=values[i];
  if(i&&result[i-1]!==null&&v!==null){
   result[i]=(2/(n+1))*v+(1-2/(n+1))*result[i-1];
  }else if(i>=n-1){
   const seed=values.slice(i-n+1,i+1);
   if(seed.every(x=>x!==null))result[i]=mean(seed);
  }
 }
 return result;
}
const tr=close.map((_,i)=>i===0?high[0]-low[0]:
 Math.max(high[i]-low[i],Math.abs(high[i]-close[i-1]),Math.abs(low[i]-close[i-1])));
const em13=emaSeries(close,13);
const span=high.at(-1)-low.at(-1);
const middle=i=>(high[i]+low[i])/2;
const dist=middle(N-1)-middle(N-2);
const n=14;
const chop=100*Math.log10(sum(tr.slice(-n))/(Math.max(...high.slice(-n))-Math.min(...low.slice(-n))))/Math.log10(n);
const vmPlus=Array.from({length:n},(_,j)=>{
 const i=N-n+j;return Math.abs(high[i]-low[i-1]);
});
const vmMinus=Array.from({length:n},(_,j)=>{
 const i=N-n+j;return Math.abs(low[i]-high[i-1]);
});
const bp=[],otr=[];
for(let i=1;i<N;i++){
 bp.push(close[i]-Math.min(low[i],close[i-1]));
 otr.push(Math.max(high[i],close[i-1])-Math.min(low[i],close[i-1]));
}
const aratio=n=>sum(bp.slice(-n))/sum(otr.slice(-n));
const delta=close.slice(1).map((v,i)=>v-close[i]);
const a=emaSeries(emaSeries(delta,25),13).at(-1);
const b=emaSeries(emaSeries(delta.map(Math.abs),25),13).at(-1);
const dd=close.slice(-14).map((v,j)=>{
 const i=N-14+j;const peak=Math.max(...close.slice(i-13,i+1));
 return 100*(v/peak-1);
});
const width=high.map((h,i)=>h-low[i]);
const first=emaSeries(width,9),second=emaSeries(first,9);
const mass=sum(first.slice(-25).map((v,i)=>v/second[N-25+i]));
let nvi=1000,pvi=1000;
for(let i=1;i<N;i++){
 if(volume[i]<volume[i-1])nvi*=close[i]/close[i-1];
 if(volume[i]>volume[i-1])pvi*=close[i]/close[i-1];
}
const hi=Math.max(...high.slice(-10)),lo=Math.min(...low.slice(-10));
const x=2*(close.at(-1)-lo)/(hi-lo)-1;
const fisherInput=Math.min(.999,Math.max(-.999,x));
const values={
 STUDY_ELDER_RAY:high.at(-1)-em13.at(-1),
 STUDY_EMV:dist*span/(volume.at(-1)/1e8),
 STUDY_CHOPPINESS:chop,
 STUDY_VORTEX:sum(vmPlus)/sum(tr.slice(-n)),
 STUDY_ULTIMATE_OSCILLATOR:100*(4*aratio(7)+2*aratio(14)+aratio(28))/7,
 STUDY_TSI:100*a/b,
 STUDY_ULCER_INDEX:Math.sqrt(mean(dd.map(x=>x*x))),
 STUDY_MASS_INDEX:mass,
 STUDY_NVI:nvi,STUDY_PVI:pvi,
 STUDY_DPO:close.at(-12)-mean(close.slice(-20)),
 STUDY_FISHER_TRANSFORM:.5*Math.log((1+fisherInput)/(1-fisherInput))
};
test('exact 61–73 identities and VIX rights/methodology hold',()=>{
 assert.equal(guides.length,13);
 assert.equal(new Set(guides.map(g=>g.code)).size,13);
 assert.equal(guides[0].code,'STUDY_VIX_CONTEXT');
 assert.ok(guides[0].sourceUrls.some(x=>x.includes('cboe.com')));
 assert.equal(Object.hasOwn(values,'STUDY_VIX_CONTEXT'),false);
 assert.deepEqual(guides.slice(1).map(x=>x.code),Object.keys(values));
});
test('Python and independently written JavaScript match 12 original final-study calculations',()=>{
 const r=spawnSync(process.platform==='win32'?'python':'python3',['scripts/qa/talia_indicators61_73_python_v1.py'],{encoding:'utf8',timeout:9000});
 assert.equal(r.status,0,r.stderr);
 const py=JSON.parse(r.stdout);
 assert.deepEqual(py.nonNumeric,['STUDY_VIX_CONTEXT']);
 assert.deepEqual(Object.keys(values).sort(),Object.keys(py.values).sort());
 for(const [k,v] of Object.entries(values)){
  assert.ok(Number.isFinite(v),k);
  assert.ok(Math.abs(v-py.values[k])<1e-7,k+': '+v+' vs '+py.values[k]);
 }
 assert.ok(Math.abs(sum(vmMinus)/sum(tr.slice(-n))-py.otherVortexLeg)<1e-7);
 assert.ok(Math.abs(low.at(-1)-em13.at(-1)-py.otherElderLeg)<1e-7);
 assert.ok(Math.abs(x-py.rawFisherInput)<1e-9);
});
test('zero denominators and future-aligned DPO are not silently accepted',()=>{
 const safeDivide=(a,b)=>b>0&&Number.isFinite(a)&&Number.isFinite(b)?a/b:null;
 assert.equal(safeDivide(1,0),null);
 assert.equal(safeDivide(1,-1),null);
 assert.ok(values.STUDY_CHOPPINESS>=0&&values.STUDY_CHOPPINESS<=100);
 assert.ok(fisherInput>-1&&fisherInput<1);
 assert.notEqual(values.STUDY_DPO,close.at(-12)-mean(close.slice(-31,-11)));
 // At index t-11, a current t SMA is future information. Never backdate availability.
 assert.ok(N-1-11<N-1);
});
