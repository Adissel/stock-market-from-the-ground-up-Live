import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {coachFoundationReflection} from '../functions/_lib/talia-foundation-reflection-coach-v1.js';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const guides=[...['06','07','13','14'].flatMap(n=>JSON.parse(
 readFileSync('data/talia-foundation-explanations-batch'+n+'-v1.json','utf8')).guides)]
 .filter(g=>g.editorialTrainingReviewV1);
const sample=[
 "I don't know how to start, I am uncertain.",
 'I think this always guarantees a fill.',
 '40 shares at $12.50 and a second fill 20 shares at $13',
 'I can compare the timestamps and identify the evidence.'
];
test('45 individual lessons give different topic-specific coaching under four observed writing conditions',()=>{
 assert.equal(guides.length,45);
 for(const g of guides){
  const replies=sample.map(x=>coachFoundationReflection(g,x));
  assert.equal(new Set(replies).size,4,g.code);
  assert.ok(replies[0].includes('guided clarification'),g.code);
  assert.ok(replies[1].includes('certainty check'),g.code);
  assert.ok(replies[2].includes('calculation check'),g.code);
  assert.ok(replies[3].includes('evidence-building check'),g.code);
  for(const r of replies){
   assert.ok(r.includes(g.editorialTrainingReviewV1.correction||g.editorialTrainingReviewV1.correctiveTeaching),g.code);
   assert.ok(r.includes(g.editorialTrainingReviewV1.limitation),g.code);
   assert.ok(r.includes(g.transferQuestion),g.code);
   assert.doesNotMatch(r,/mastery awarded|your grade is|i diagnosed you as|guaranteed profit/i);
  }
 }
});
test('actual Tutor source review composes authored correction with generic ungraded writing structure',()=>{
 const g=guides.find(x=>x.code==='TALIA_TOPIC_BUY_LIMIT_CANNOT_ASSUME_EXECUTION');
 assert.ok(g);
 const uncertain=answerFromGuide(g,'review',sample[0],'Review my reasoning');
 const numeric=answerFromGuide(g,'review',sample[2],'Review my reasoning');
 assert.ok(uncertain.includes('Talia guided clarification'));
 assert.ok(numeric.includes('Talia calculation check'));
 assert.notEqual(uncertain,numeric);
 assert.ok(uncertain.includes('Reflection-writing check only'));
 assert.ok(uncertain.includes('No rubric was scored and no mastery credit was awarded.'));
 assert.ok(!uncertain.includes('Source correction: The SEC 2023')); // unrelated research not injected
});
test('no raw private reflection echoed, no lesson metadata means no adaptation, falsified approval blocks adaptation',()=>{
 const g=guides[0];
 const secret='PrivateJournalCandidateUserKey987';
 const r=coachFoundationReflection(g,secret+' I am uncertain');
 assert.doesNotMatch(r,/PrivateJournalCandidateUserKey987/);
 assert.equal(coachFoundationReflection({...g,editorialTrainingReviewV1:null},'I am uncertain'),'');
 assert.equal(coachFoundationReflection({...g,editorialTrainingReviewV1:{...g.editorialTrainingReviewV1,independentPublicationApproved:true}},'I am uncertain'),'');
 assert.equal(coachFoundationReflection(g,'' ).includes('guided restart'),true);
 assert.doesNotMatch(coachFoundationReflection(g,''),/score of \d/i);
});
