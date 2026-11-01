// Talia Market Tutor — indicator guides 61–73: original ungraded synthetic arithmetic.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=n=>JSON.parse(readFileSync(new URL('../data/'+n,import.meta.url),'utf8'));
const guides=[read('tutor-indicator-study-v1.json').guides.at(-1),...read('tutor-indicator-expansion-v1.json').guides];
const codes=['VIX_CONTEXT','ELDER_RAY','EMV','CHOPPINESS','VORTEX','ULTIMATE_OSCILLATOR','TSI','ULCER_INDEX','MASS_INDEX','NVI','PVI','DPO','FISHER_TRANSFORM'].map(x=>'STUDY_'+x);
const close=(a,b,t=1e-6)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<t,`${a} != ${b}`);
test('last 13 teaching guides are distinct, retrievable and never independently release-approved',()=>{
 assert.deepEqual(guides.map(g=>g.code),codes);
 for(const k of ['fictionalPrompt','reviewExplanation','selfCheck'])assert.equal(new Set(guides.map(g=>g[k])).size,13,k);
 for(const g of guides){
  assert.match(g.fictionalPrompt,/^FICTIONAL:/);assert.ok(g.fictionalPrompt.length>145);
  assert.match(g.selfCheck,/FICTIONAL INDEPENDENT TRANSFER/);
  assert.ok(g.reviewExplanation.length>210);
  assert.equal(g.internalEditorialReview.independentlyAccepted,false);
  assert.equal(g.internalEditorialReview.claimSpecificReference,g.sourceUrls[0]);
  assert.match(g.sourceUrls[0],/^https:\/\//);
  assert.equal(g.officialCompetency,false,g.code);
  const response=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(response.includes(g.fictionalPrompt)&&response.includes(g.selfCheck),g.code);
  assert.doesNotMatch(response,/guaranteed profit|mastery awarded|live fill confirmed|buy this stock now/i);
 }
});
test('individual calculations use declared synthetic inputs and explicit methods',()=>{
 close(22-18,4);close(100*(22-18)/18,22.2222222222);
 close(10.5-10,.5);close(9.6-10,-.4);
 close((11-10)/((200000/100000)/2),1);
 close(100*Math.log10(12/6)/Math.log10(4),50);
 close(Math.abs(12-9)/4,.75);close(Math.abs(10-11)/4,.25);
 close(100*(4*.6+2*.5+.4)/7,54.2857142857);
 close(100*.2/.5,40);
 close(Math.sqrt((100+25+0)/3),6.45497224368);
 close(1.1+1.2,2.3);
 close(1000*(11/10),1100);
 close(1000*(21/20),1050);
 close(52-50,2);
 close(.5*Math.log((1+.5)/(1-.5)),.549306144334);
 close(.5*Math.log((1-.5)/(1+.5)),-.549306144334);
});
test('no-lookahead DPO and methodological disclosure are explicit',()=>{
 const by=Object.fromEntries(guides.map(g=>[g.code,g]));
 assert.match(by.STUDY_DPO.reviewExplanation,/plotted past point uses later bars|replay/i);
 assert.match(by.STUDY_VIX_CONTEXT.reviewExplanation,/not reconstructible/i);
 assert.match(by.STUDY_MASS_INDEX.reviewExplanation,/25 periods/);
 assert.match(by.STUDY_EMV.reviewExplanation,/scal|scale/);
 assert.match(by.STUDY_NVI.reviewExplanation,/seed|price-relative/);
 assert.match(by.STUDY_FISHER_TRANSFORM.reviewExplanation,/clamp|strictly/);
});
