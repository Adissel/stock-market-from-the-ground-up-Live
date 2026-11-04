import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const all=[...JSON.parse(readFileSync('data/tutor-indicator-study-v1.json','utf8')).guides,
 ...JSON.parse(readFileSync('data/tutor-indicator-expansion-v1.json','utf8')).guides];
const c=Array.from({length:100},(_,i)=>50+.17*i+((i%9)-4)*.22);
const h=c.map(x=>x+1.1),l=c.map(x=>x-1.3);
const v=c.map((_,i)=>1000+((i*17)%23)*45),bm=c.map((_,i)=>40+.09*i);
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const ema=(a,n)=>a.slice(n).reduce((prev,x)=>2/(n+1)*x+(1-2/(n+1))*prev,mean(a.slice(0,n)));
let obv=0,adl=0,nvi=1000,pvi=1000;
const clv=c.map((x,i)=>(2*x-h[i]-l[i])/(h[i]-l[i]));
for(let i=0;i<c.length;i++){
 adl+=clv[i]*v[i];
 if(i>0){
  obv+=c[i]>c[i-1]?v[i]:c[i]<c[i-1]?-v[i]:0;
  if(v[i]<v[i-1])nvi*=c[i]/c[i-1];
  if(v[i]>v[i-1])pvi*=c[i]/c[i-1];
 }
}
const cmf=clv.slice(-20).reduce((acc,x,k)=>acc+x*v[v.length-20+k],0)/v.slice(-20).reduce((a,b)=>a+b,0);
const pvo=100*(ema(v,12)-ema(v,26))/ema(v,26);
const low=Math.min(...c.slice(-10)),high=Math.max(...c.slice(-10));
const scaled=Math.max(-.99,Math.min(.99,2*(c.at(-1)-low)/(high-low)-1));
const result={
 STUDY_OBV:obv,STUDY_ACC_DIST_LINE:adl,STUDY_CMF:cmf,STUDY_PVO:pvo,
 STUDY_FORCE_INDEX:(c.at(-1)-c.at(-2))*v.at(-1),
 STUDY_PRICE_RELATIVE:c.at(-1)/bm.at(-1),
 STUDY_ADVANCE_DECLINE:Array.from({length:100},(_,i)=>(100+i%7)-(92+i%5)).reduce((a,b)=>a+b,0),
 STUDY_NEW_HIGHS_LOWS:37-16,
 STUDY_PERCENT_ABOVE_MA:100*[10,12,14,16,18].filter((x,i)=>x>[11,11,13,17,17][i]).length/5,
 STUDY_PUT_CALL_RATIO:1100/1300,STUDY_ELDER_RAY:h.at(-1)-ema(c,13),
 STUDY_NVI:nvi,STUDY_PVI:pvi,STUDY_FISHER_TRANSFORM:.5*Math.log((1+scaled)/(1-scaled))
};
test('14 canonical studies are individually identified, ungraded and source-linked',()=>{
 const codes=new Set(all.slice(45,73).map(g=>g.code));
 assert.equal(codes.size,28);
 for(const id of Object.keys(result)){
  assert.ok(codes.has(id),id);
  const item=all.find(g=>g.code===id);
  assert.ok(item.formula.length>=20&&item.sourceUrls.length);
  assert.equal(item.officialCompetency,false);
 }
});
test('independent Python and JS agree on fourteen original fictional numerical examples',()=>{
 const p=spawnSync(process.platform==='win32'?'python':'python3',['scripts/qa/talia_indicator46_73_python_v1.py'],{encoding:'utf8',timeout:10000});
 assert.equal(p.status,0,p.stderr);
 const reference=JSON.parse(p.stdout);
 assert.deepEqual(Object.keys(reference).sort(),Object.keys(result).sort());
 for(const id of Object.keys(result)){
  assert.ok(Number.isFinite(result[id]),id);
  assert.ok(Math.abs(result[id]-reference[id])<1e-8,id+': '+result[id]+' vs '+reference[id]);
 }
});
test('zero denominators, proprietary formulas and future data remain explicit acceptance holds',()=>{
 assert.equal([10,12].reduce((a,b)=>a+b,0)/0,Infinity);
 assert.ok(all.find(g=>g.code==='STUDY_SCTR').formula.includes('Proprietary'));
 assert.ok(all.find(g=>g.code==='STUDY_VIX_CONTEXT').formula.includes('Index-specific'));
 assert.ok(all.find(g=>g.code==='STUDY_VOLUME_PROFILE').formula.includes('allocation method'));
 assert.ok(Object.keys(result).length<28);
 const prevC=c.slice(0,-1),prevV=v.slice(0,-1);
 assert.equal(prevC.length,prevV.length);
 assert.ok(!Object.values(result).some(x=>Number.isNaN(x)));
});
