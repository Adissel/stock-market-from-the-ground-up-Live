import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const get=n=>JSON.parse(readFileSync('data/talia-foundation-explanations-batch'+n+'-v1.json','utf8')).guides;
const topics=[...get('06'),...get('07')];
test('forty source-only topics have differentiated initial, depth, misconception, correction and independent transfer',()=>{
 assert.equal(topics.length,40);
 for(const g of topics){
  const first=answerFromGuide(g,'explain','','Explain this topic');
  const deep=answerFromGuide(g,'explain','','Walk me through this step-by-step in more depth');
  const correction=answerFromGuide(g,'explain','','Explain the common mistake');
  const review=answerFromGuide(g,'review','I think this is guaranteed','Review my reasoning');
  const prompt=answerFromGuide(g,'question','','Please quiz me');
  assert.ok(first.includes(g.workedCase),g.code+' missing fictional example');
  assert.ok(first.includes(g.transferQuestion),g.code+' missing transfer');
  assert.ok(deep.includes(g.workedCase)&&deep.includes(g.transferQuestion));
  assert.ok(correction.includes(g.commonError)&&correction.includes(g.transferQuestion));
  assert.ok(prompt.includes(g.selfCheck));
  assert.ok(review.includes(g.reviewExplanation));
  assert.notEqual(deep,first);
  for(const output of [first,deep,correction,review,prompt]){
   assert.doesNotMatch(output,/guaranteed (profit|win)|official (mastery|grade) awarded/i);
   assert.ok(!output.includes('private_answer_key'));
  }
 }
});
test('forty topics do not recycle identical independent transfer questions or misconception feedback',()=>{
 assert.equal(new Set(topics.map(g=>g.transferQuestion)).size,40);
 assert.equal(new Set(topics.map(g=>g.commonError)).size,40);
});
