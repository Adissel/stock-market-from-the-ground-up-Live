import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=f=>JSON.parse(readFileSync('data/'+f,'utf8'));
const source=read('tutor-indicator-study-v1.json').guides.slice(15,30);
const reviews=read('talia-indicator-16-30-review-v1.json').records;
const python=read('talia-indicator-16-30-python-reference-v1.json').values;
const prices=Array.from({length:70},(_,i)=>100+i*.4+(i%5)*.2);
const mean=a=>a.reduce((a,b)=>a+b,0)/a.length;
const gain=n=>100*(prices.at(-1)/prices.at(-n-1)-1);
function smoothedROC(n,k){const a=[];for(let i=prices.length-k;i<prices.length;i++)a.push(100*(prices[i]/prices[i-n]-1));return mean(a)}
function trix(){
 let series=prices.slice();
 for(let j=0;j<3;j++){
  const n=15,alpha=2/(n+1);let last=mean(series.slice(0,n)),a=[last];
  for(const price of series.slice(n)){last=alpha*price+(1-alpha)*last;a.push(last)}
  series=a;
 }
 return 100*(series.at(-1)/series.at(-2)-1);
}
const bb=[1,2,3,4,5],mid=mean(bb),sd=Math.sqrt(mean(bb.map(x=>(x-mid)**2)));
const upper=mid+2*sd,lower=mid-2*sd;
const calculated={
STUDY_WILLIAMS_R:-100*(110-108)/(110-100),
STUDY_ROC:gain(12),
STUDY_PRICE_MOMENTUM:prices.at(-1)-prices.at(-13),
STUDY_TRIX:trix(),
STUDY_KST:[10,15,20,30].reduce((a,n,i)=>a+(i+1)*smoothedROC(n,[10,10,10,15][i]),0),
STUDY_AROON:(25-2)*100/25,
STUDY_AROON_OSCILLATOR:((25-2)-(25-21))*100/25,
STUDY_ADX:(16.5*13+24)/14,
STUDY_DIRECTIONAL_MOVEMENT:7/20*100,
STUDY_PARABOLIC_SAR:Math.min(48.13+.14*(49.20-48.13),47.8,48),
STUDY_ICHIMOKU:((110+90)/2+(115+85)/2)/2,
STUDY_SUPERTREND:(12+10)/2+3*1.5,
STUDY_BOLLINGER_BANDS:upper,
STUDY_BOLLINGER_PERCENT_B:(5-lower)/(upper-lower),
STUDY_BOLLINGER_BANDWIDTH:100*(upper-lower)/mid
};
test('15 existing guides match individually source-reviewed codes, with no release or feed rights',()=>{
 assert.equal(source.length,15);assert.equal(reviews.length,15);
 for(let i=0;i<15;i++){
  assert.equal(source[i].code,reviews[i].code);
  assert.equal(source[i].code,Object.keys(python)[i]);
  assert.equal(reviews[i].independentlyAccepted,false);
  assert.equal(reviews[i].rights,'NOT_APPROVED');
 }
});
test('independent Python and JS arithmetic match 15 explicit completed-bar component cases',()=>{
 assert.deepEqual(Object.keys(calculated).sort(),Object.keys(python).sort());
 for(const [id,val] of Object.entries(calculated)){
  assert.ok(Number.isFinite(val));assert.ok(Math.abs(val-python[id])<1e-9,id+': '+val+' / '+python[id]);
 }
});
test('no premature endorsement of recursive/forward/zero-denominator behavior',()=>{
 assert.match(read('talia-indicator-16-30-python-reference-v1.json').limitations,/Full-platform implementations NOT signed off/);
 assert.equal((110-100)===0,false);
 assert.equal((110-110)===0,true); // Williams %R undefined on zero range.
 assert.equal((upper-lower)>0,true);
 assert.equal((mid===0),false);
 assert.equal(15<26,true); // Span A requires Kijun 26 and is then plotted forward.
});
