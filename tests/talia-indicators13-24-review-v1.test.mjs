import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const guides=JSON.parse(readFileSync(new URL('../data/tutor-indicator-study-v1.json',import.meta.url),'utf8')).guides.slice(12,24);
const calculations=[
 [80,100*(108-100)/(110-100)], [.5,(60-40)/(80-40)],
 [100,(12-11)/(.015*((1+0+1)/3))], [-20,-100*(110-108)/(110-100)],
 [25,100*(15/12-1)], [3,15-12],
 [100*(100/99-1),100*(100/99-1)], [30,1*1+2*2+3*3+4*4],
 [80,100*(10-2)/10],[40,80-40],
 [34,((5-1)*30+50)/5],[60,100*Math.abs(20-5)/(20+5)]
];
test('Review of study guides 13-24 has twelve original numerical, conditional and independent prompts',()=>{
 assert.equal(guides.length,12);assert.equal(new Set(guides.map(g=>g.code)).size,12);
 assert.equal(new Set(guides.map(g=>g.fictionalPrompt)).size,12);
 assert.equal(new Set(guides.map(g=>g.selfCheck)).size,12);
 for(const [i,g] of guides.entries()){
  assert.match(g.fictionalPrompt,/^FICTIONAL:/,g.code);
  assert.ok(g.fictionalPrompt.length>155,g.code+' math');
  assert.ok(g.selfCheck.length>65,g.code+' practice');
  assert.ok(g.reviewExplanation.length>105,g.code+' correction');
  assert.ok(g.sourceUrls?.length>=1,g.code+' references');
  assert.ok(g.formula.length>24,g.code+' declared formula');
  assert.ok(Number.isFinite(calculations[i][0])&&Number.isFinite(calculations[i][1]));
  assert.ok(Math.abs(calculations[i][0]-calculations[i][1])<1e-8,g.code);
  const out=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(out.includes(g.fictionalPrompt));
  assert.ok(out.includes(g.selfCheck));
  assert.doesNotMatch(out,/guaranteed return|actual stock recommendation|protected mastery result/i);
  assert.doesNotMatch(answerFromGuide(g,'question','','Explain '+g.title),/Verified fictional calculation exercise:/);
 }
});
test('Review requires warmup and numerical invalidation for harder oscillators',()=>{
 for(const i of [1,2,6,7,10,11]){
  const g=guides[i];const all=g.fictionalPrompt+' '+g.selfCheck+' '+g.reviewExplanation;
  assert.match(all,/seed|valid|warm|undefined|requir|smoothing|history|input/i,g.code);
 }
 const k=guides.find(g=>g.code==='STUDY_STOCHASTIC');assert.match(k.reviewExplanation,/undefined/);
 const p=guides.find(g=>g.code==='STUDY_ROC');assert.match(p.reviewExplanation,/zero/);
 const d=guides.find(g=>g.code==='STUDY_DIRECTIONAL_MOVEMENT');assert.match(d.reviewExplanation,/zero/);
});
