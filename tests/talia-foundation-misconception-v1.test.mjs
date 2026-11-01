import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const core=JSON.parse(read('data/competency-study-guides-v01499.json')).guides;
const indicator=JSON.parse(read('data/tutor-indicator-expansion-v1.json')).guides;
const topics=JSON.parse(read('data/talia-foundation-explanations-batch02-v1.json')).guides;
test('Source-only correction works for canonical, supplemental and indicator guide families',()=>{
 for(const g of [core[1],indicator[0],topics[1]]){
  const explanation=answerFromGuide(g,'explain','','Explain the common mistake: '+g.title);
  assert.match(explanation,/Original, ungraded misconception coaching/);
  assert.ok(explanation.includes(g.commonError));
  assert.ok(explanation.includes(g.concept));
  assert.ok(explanation.includes(g.limit));
  assert.match(explanation,/not a claim about what you personally believed/);
  assert.match(explanation,/Fresh independent transfer prompt/);
  assert.doesNotMatch(explanation,/mastery awarded|verified profit|official score awarded/);
  const selfCheck=answerFromGuide(g,'question','','Explain the common mistake: '+g.title);
  assert.doesNotMatch(selfCheck,/Original, ungraded misconception coaching/);
 }
});
test('Misconception button is actionable, zero-cost and cannot opt member into AI',()=>{
 const js=read('assets/js/market-tutor.js');
 assert.match(js,/Explain the common mistake \(source-only\)/);
 assert.match(js,/sourceOnlyMisconceptionPrompt\(record\)/);
 assert.match(js,/consent\.checked=false/);
 const api=read('functions/api/market-tutor-v01492.js');
 assert.match(api,/const deepSourceOnly=.*common mistakes/);
 assert.match(api,/deepSourceOnly\?\{text:null,reason:'source_only_deep_teaching'/);
});
