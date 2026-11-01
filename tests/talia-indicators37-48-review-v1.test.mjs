import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const guides=JSON.parse(readFileSync(new URL('../data/tutor-indicator-study-v1.json',import.meta.url),'utf8')).guides.slice(36,48);
const expected=['PIVOT_POINTS','FIBONACCI_RETRACEMENT','VWAP','ANCHORED_VWAP','VWAP_BANDS','VOLUME_SMA','RVOL','MATCHED_TIME_RVOL','DOLLAR_VOLUME','OBV','ACC_DIST_LINE','CMF'].map(v=>'STUDY_'+v);
const close=(a,b)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<1e-8,a+' != '+b);
test('individual indicator teaching and source evidence',()=>{
 assert.deepEqual(guides.map(g=>g.code),expected);
 for(const field of ['fictionalPrompt','selfCheck','reviewExplanation','procedure'])assert.equal(new Set(guides.map(g=>g[field])).size,12);
 for(const g of guides){
  assert.ok(g.fictionalPrompt.startsWith('FICTIONAL:')&&g.fictionalPrompt.length>155);
  assert.ok(g.selfCheck.length>65&&g.reviewExplanation.length>105);
  assert.equal(g.officialCompetency,false);
  assert.equal(g.internalEditorialReview.independentlyAccepted,false);
  assert.equal(g.internalEditorialReview.claimSpecificReference,g.sourceUrls[0]);
  const answer=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(answer.includes(g.fictionalPrompt)&&answer.includes(g.selfCheck),g.code);
 }
});
test('twelve independently specified synthetic calculations',()=>{
 const mean=v=>v.reduce((a,b)=>a+b,0)/v.length;
 const weighted=v=>v.reduce((s,[p,n])=>s+p*n,0)/v.reduce((s,[p,n])=>s+n,0);
 const clv=(h,l,c)=>h>l?(2*c-h-l)/(h-l):null;
 // 37: pivots
 const p=mean([120,100,110]);close(p,110);close(2*p-100,120);close(2*p-120,100);
 // 38: retracement
 close(30-.382*(30-20),26.18);close(40-.618*(40-20),27.64);
 // 39: trade-print VWAP
 close(weighted([[10,100],[12,300]]),11.5);close(weighted([[8,200],[10,200]]),9);
 // 40: anchored VWAP
 close(weighted([[10,100],[14,300]]),13);close(weighted([[12,100],[18,100]]),15);
 // 41: given VWAP and specified standard deviation
 close(10+2*1.5,13);close(20-1.5*2,17);
 // 42: volume SMA
 close(mean([100,200,300]),200);close(mean([200,300,400]),300);
 // 43: completed bar RVOL
 close(600/mean([200,300,400]),2);close(150/300,.5);
 // 44: equal-time cumulative RVOL
 close(900/mean([300,600,900]),1.5);close(300/mean([200,400]),1);
 // 45: trade notional
 close(10*100+12*50,1600);close(20*40+21*20,1220);
 // 46: OBV
 close(0+200-50,150);close(100+60,160);
 // 47: accumulation distribution
 close(clv(12,8,11),.5);close(20+clv(12,8,11)*200,120);
 close(120+clv(10,6,7)*100,70);assert.equal(clv(10,10,10),null);
 // 48: CMF rolling
 close((clv(12,8,11)*100+clv(10,8,8)*100)/200,-.25);
 close((clv(10,8,10)*100+clv(10,6,7)*200)/300,0);
});
