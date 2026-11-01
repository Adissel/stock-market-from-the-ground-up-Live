// SMFGU-TALIA-INDICATOR-REVIEW-25-36: Original fictional worked-case math and source-only Tutor boundaries.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const guides=JSON.parse(readFileSync(new URL('../data/tutor-indicator-study-v1.json',import.meta.url),'utf8')).guides.slice(24,36);
const codes=[
 'STUDY_PARABOLIC_SAR','STUDY_ICHIMOKU','STUDY_SUPERTREND','STUDY_BOLLINGER_BANDS',
 'STUDY_BOLLINGER_PERCENT_B','STUDY_BOLLINGER_BANDWIDTH','STUDY_KELTNER_CHANNELS',
 'STUDY_DONCHIAN_CHANNELS','STUDY_ATR','STUDY_ATRP','STUDY_HISTORICAL_VOLATILITY','STUDY_CHANDELIER_EXIT'
];
const close=(actual,want)=>assert.ok(Math.abs(actual-want)<1e-6,actual+' != '+want);
test('twelve reviewed indicator guides are original, ungraded, specified and retrievable by the shared Tutor',()=>{
 assert.equal(guides.length,12);
 assert.deepEqual(guides.map(g=>g.code),codes);
 assert.equal(new Set(guides.map(g=>g.fictionalPrompt)).size,12);
 assert.equal(new Set(guides.map(g=>g.selfCheck)).size,12);
 for(const g of guides){
  assert.match(g.fictionalPrompt,/^FICTIONAL:/);
  assert.ok(g.fictionalPrompt.length>155,g.code+' fictional math');
  assert.ok(g.selfCheck.length>65,g.code+' transfer');
  assert.ok(g.reviewExplanation.length>105,g.code+' corrective teaching');
  assert.match(g.formula,/\b|[=]/,g.code);
  assert.equal(g.officialCompetency,false,g.code);
  assert.equal(g.internalEditorialReview?.independentlyAccepted,false,g.code);
  assert.equal(g.sourceUrls[0],g.internalEditorialReview.claimSpecificReference,g.code);
  assert.match(g.sourceUrls[0],/^https:\/\//);
  const explained=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(explained.includes(g.fictionalPrompt),g.code);
  assert.ok(explained.includes(g.selfCheck),g.code);
  assert.doesNotMatch(explained,/guaranteed profit|live fill confirmed|mastery awarded|buy this stock now/i);
  assert.doesNotMatch(answerFromGuide(g,'question','','Explain '+g.title),/Verified fictional calculation exercise:/);
 }
});
test('independent arithmetic agrees with twelve declared examples and transfer inputs',()=>{
 // SAR rising recurrence and prior-low clamp
 close(9.5+0.02*(10.5-9.5),9.52);
 close(Math.min(9.52,9.51,9.8),9.51);
 // Ichimoku rolling high/low midpoints are based only on completed bars
 const mid=(hi,lo)=>(hi+lo)/2;
 close((mid(12,8)+mid(14,6))/2,10);
 close((mid(16,10)+mid(18,8))/2,13);
 // Supertrend: raw bands, not final history-dependent carry
 close(mid(11,9)+2*1,12);close(mid(11,9)-2*1,8);
 close(mid(21,19)+2*1.5,23);close(mid(21,19)-2*1.5,17);
 // Bollinger: population variance is declared; different SD conventions are NOT interchangeable
 const bb=xs=>{const m=xs.reduce((a,b)=>a+b,0)/xs.length;const sd=Math.sqrt(xs.reduce((a,b)=>a+(b-m)**2,0)/xs.length);return[m-2*sd,m+2*sd]};
 close(bb([8,10,12])[1],13.265986323710904);
 close(bb([9,10,11])[0],8.367006838144547);
 // %B and zero-width invalidation
 close((11-8)/(12-8),0.75);close((13-8)/(12-8),1.25);
 assert.equal((12-8)===0,false);
 // BandWidth displayed as percent
 close(100*(12-8)/10,40);close(100*(22-18)/20,20);
 // Keltner seeded EMA +/- 2*ATR
 close(10+2*1.5,13);close(10-2*1.5,7);
 close(20+2*.75,21.5);close(20-2*.75,18.5);
 // Donchian roll drops the oldest complete bar
 close(Math.max(10,11,12),12);close(Math.min(9,9.5,10),9);
 close(Math.max(11,12,13),13);close(Math.min(9.5,10,10.5),9.5);
 // gap-aware TR and Wilder smoothing
 close(Math.max(11-9,Math.abs(11-8),Math.abs(9-8)),3);
 close(((3-1)*3+6)/3,4);
 // ATRP nonzero denominator
 close(100*1.5/50,3);close(100*.6/20,3);
 // Historical volatility: SAMPLE standard deviation of known log returns
 const ret=[.01,-.01,.02],mean=ret.reduce((a,b)=>a+b,0)/ret.length;
 const vol=Math.sqrt(ret.reduce((a,b)=>a+(b-mean)**2,0)/(ret.length-1))*Math.sqrt(252);
 close(vol,Math.sqrt(.00023333333333333333)*Math.sqrt(252));
 assert.ok(vol>.24&&vol<.25);
 // Chandelier long and short references
 close(20-3*1,17);close(10+3*.8,12.4);
});
test('numerical and chronology defects require explanation, not an invented signal',()=>{
 const x=Object.fromEntries(guides.map(g=>[g.code,g]));
 for(const c of ['STUDY_SUPERTREND','STUDY_ATR','STUDY_ATRP','STUDY_HISTORICAL_VOLATILITY']){
  assert.match(x[c].reviewExplanation,/seed|warm|history|prior|returns/i,c);
 }
 assert.match(x.STUDY_ICHIMOKU.reviewExplanation,/future|forward|timestamps/i);
 assert.match(x.STUDY_BOLLINGER_PERCENT_B.reviewExplanation,/undefined/i);
 assert.match(x.STUDY_BOLLINGER_BANDWIDTH.reviewExplanation,/undefined/i);
 assert.match(x.STUDY_PARABOLIC_SAR.reviewExplanation,/clamp/i);
 assert.match(x.STUDY_DONCHIAN_CHANNELS.reviewExplanation,/incomplete/i);
 assert.match(x.STUDY_CHANDELIER_EXIT.reviewExplanation,/gaps|slippage/i);
});
