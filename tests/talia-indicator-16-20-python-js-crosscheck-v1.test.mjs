// Talia numerical source audit — independent JS/Python studies 16–20.
// Unreleased original educational calculations from fictional completed OHLC, no market data.
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const docs=[...JSON.parse(readFileSync('data/tutor-indicator-study-v1.json','utf8')).guides,
 ...JSON.parse(readFileSync('data/tutor-indicator-expansion-v1.json','utf8')).guides];
const codes=['STUDY_WILLIAMS_R','STUDY_ROC','STUDY_PRICE_MOMENTUM','STUDY_TRIX','STUDY_KST'];
const closes=Array.from({length:150},(_,t)=>100+.11*t+((t%11)-5)*.23+((t%7)-3)*.07);
const highs=closes.map((x,t)=>x+1.20+.01*(t%5)),lows=closes.map((x,t)=>x-1.10-.01*(t%4));
function mean(a,n){
 return a.map((_,t)=>t<n-1||a.slice(t-n+1,t+1).some(x=>x===null)?null:
  a.slice(t-n+1,t+1).reduce((x,y)=>x+y,0)/n)
}
function movingExponential(a,n){
 const out=Array(a.length).fill(null),alpha=2/(n+1);
 for(let t=0;t<a.length;t++){
  if(a[t]===null)continue;
  if(t>0&&out[t-1]!==null){out[t]=alpha*a[t]+(1-alpha)*out[t-1];continue}
  if(t>=n-1){
   const window=a.slice(t-n+1,t+1);
   if(window.length===n&&window.every(x=>x!==null))out[t]=window.reduce((p,v)=>p+v,0)/n;
  }
 }
 return out
}
function change(a,n){
 return a.map((x,i)=>i<n||a[i-n]===null||a[i-n]===0||x===null?null:100*(x/a[i-n]-1));
}
function percentR(c,h,l,n){
 return c.map((x,t)=>{
  if(t<n-1)return null;
  const max=Math.max(...h.slice(t-n+1,t+1)),min=Math.min(...l.slice(t-n+1,t+1));
  return max===min?null:-100*(max-x)/(max-min);
 });
}
function tripleRoc(c,n){
 const first=movingExponential(c,n),second=movingExponential(first,n),third=movingExponential(second,n);
 return third.map((x,i)=>i===0||third[i-1]===null||third[i-1]===0||x===null?
  null:100*(x/third[i-1]-1))
}
function kst(c){
 const configs=[[10,10,1],[15,10,2],[20,10,3],[30,15,4]];
 const sequences=configs.map(([period,smooth])=>mean(change(c,period),smooth));
 return c.map((_,i)=>sequences.some(a=>a[i]===null)?null:
  sequences.reduce((acc,a,k)=>acc+a[i]*configs[k][2],0))
}
const study={
 STUDY_WILLIAMS_R:percentR(closes,highs,lows,14),
 STUDY_ROC:change(closes,10),
 STUDY_PRICE_MOMENTUM:closes.map((x,i)=>i<10?null:x-closes[i-10]),
 STUDY_TRIX:tripleRoc(closes,9),
 STUDY_KST:kst(closes)
};
test('next five indicator IDs are exactly canonical guide positions 16–20',()=>{
 assert.deepEqual(docs.slice(15,20).map(g=>g.code),codes);
 assert.equal(new Set(codes).size,5);
 for(const g of docs.slice(15,20)){
  assert.ok(g.formula.length>14&&g.sourceUrls.length>=1);
  assert.equal(g.officialCompetency,false);
 }
});
test('independent Python reference matches five JavaScript values and first-valid indices',()=>{
 const child=spawnSync(process.platform==='win32'?'python':'python3',['scripts/qa/talia_indicator_16_20_reference_v1.py'],{encoding:'utf8',timeout:8000});
 assert.equal(child.status,0,child.stderr);
 const reference=JSON.parse(child.stdout);
 assert.deepEqual(Object.keys(reference).sort(),codes.slice().sort());
 for(const id of codes){
  const a=study[id],b=reference[id];
  assert.ok(Number.isFinite(a.at(-1))&&Number.isFinite(a[59]),id+' incomplete end/prefix');
  assert.ok(Math.abs(a.at(-1)-b.last)<1e-8,id+' disagreement at final bar');
  assert.ok(Math.abs(a[59]-b.prefix60)<1e-8,id+' disagreement at earlier completed bar');
  assert.equal(a.findIndex(x=>x!==null),b.firstValid,id+' warmup mismatch');
 }
});
test('correct warmup, flat-range, denominator and past-only regression',()=>{
 assert.deepEqual(codes.map(id=>study[id].findIndex(x=>x!==null)),[13,10,10,25,44]);
 assert.equal(percentR([10,10,10],[10,10,10],[10,10,10],3)[2],null);
 assert.equal(change([0,10],1)[1],null);
 assert.equal(tripleRoc([10,11,12,13],9).at(-1),null);
 assert.equal(kst(closes.slice(0,44)).at(-1),null);
 const earlier=closes.slice(0,90),upper=highs.slice(0,90),lower=lows.slice(0,90);
 assert.equal(percentR(earlier,upper,lower,14).at(-1),study.STUDY_WILLIAMS_R[89]);
 assert.equal(change(earlier,10).at(-1),study.STUDY_ROC[89]);
 assert.equal(tripleRoc(earlier,9).at(-1),study.STUDY_TRIX[89]);
 assert.equal(kst(earlier).at(-1),study.STUDY_KST[89]);
});
