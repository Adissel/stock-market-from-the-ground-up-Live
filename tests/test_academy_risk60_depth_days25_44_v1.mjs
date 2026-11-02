/* Independent original Academy Risk60 D25–D44 source/contract acceptance.
 * No protected case grade, paid access or fabricated member session.
 */
import assert from 'node:assert/strict';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {risk60DeepDays25to44V1} from '../functions/_lib/academy-risk60-advanced-depth-days25-44-v1.js';
import {risk60PracticeBatch02} from '../functions/_lib/academy-risk60-practice-batch02-v1.js';
import {risk60TransferBatch03} from '../functions/_lib/academy-risk60-transfer-batch03-v1.js';
import {risk60SourceDays} from '../functions/_lib/academy-risk60-learning-batch01-v1.js';
const r=academyPrograms.find(x=>x.code==='risk60');
assert.equal(r?.curriculum.length,60);
const operations={difference:v=>v[0]-v[1],product:v=>v[0]*v[1],ratio:v=>v[0]/v[1],percent:v=>100*v[0]/v[1],returnPct:v=>100*(v[1]-v[0])/v[0],spreadPct:v=>100*(v[1]-v[0])/((v[0]+v[1])/2),weighted2:v=>(v[0]*v[1]+v[2]*v[3])/(v[0]+v[2]),floorDiv:v=>Math.floor(v[0]/v[1])};
const prompts=new Set(),reviews=new Set(),transfers=new Set();
for(let day=25;day<=44;day++){
 const a=risk60DeepDays25to44V1[day], runtime=r.curriculum[day-1], lesson=runtime.lesson;
 assert(a&&lesson,'Missing advanced-depth unit '+day);
 const origin=day<=40?risk60PracticeBatch02[day-21]:risk60TransferBatch03[day-41];
 assert.strictEqual(lesson,origin,'Runtime must use existing member-facing engine');
 assert.equal(runtime.programCode,'risk60');assert.equal(runtime.day,day);
 assert.equal(lesson.topicSourceDay,risk60SourceDays[day<=40?day-21:day-41], 'Retain frozen nonsequential source-day mapping D'+day);
 assert.equal(Object.hasOwn(a,'topicSourceDay'),false,'Supplemental depth must never override canonical source registry');
 assert.equal(lesson.instructionalFocus,a.instructionalFocus);
 assert.equal(lesson.title.endsWith(day<=40?' — guided new-case rehearsal':' — independent unfamiliar case'),true,'Original course lesson title must survive supplemental source merge');
 assert.equal(runtime.officiallyGraded,false);assert.equal(runtime.masteryAwarded,false);
 assert.equal(lesson.status,'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
 assert.equal(lesson.formativeQuestions.length,12);assert.equal(lesson.advancedPracticums.length,1);
 assert(lesson.reference.url.startsWith('https://'));
 for(const [i,q] of lesson.formativeQuestions.entries()){
  assert.equal(q.id,'risk60-D'+String(day).padStart(2,'0')+'-Q'+String(i+1).padStart(2,'0'));
  assert(q.prompt.length>=35&&q.review.length>=45);
  assert.equal(q.graded,false);
  assert(!prompts.has(q.prompt),'Duplicate prompt');prompts.add(q.prompt);
  assert(!reviews.has(q.review),'Duplicate feedback');reviews.add(q.review);
 }
 const t=lesson.advancedPracticums[0];assert(t.id.includes('D'+String(day).padStart(2,'0')));
 for(const key of ['scenario','task','worked','pitfall','transfer'])assert(t[key].length>=95);
 assert(!transfers.has(t.transfer));transfers.add(t.transfer);
 const {operation,inputs,expected}=lesson.numericCheck;
 assert(operations[operation]&&inputs.every(Number.isFinite)&&Number.isFinite(expected));
 const result=operations[operation](inputs);
 assert(Math.abs(result-expected)<1e-8,'Incorrect independently recalculated D'+day+': '+result+' vs '+expected);
 for(const hidden of ['answerKey','correctAnswer','correctOption','grader','masteryScore'])assert.equal(Object.hasOwn(lesson,hidden),false);
}
assert.equal(prompts.size,240);assert.equal(reviews.size,240);assert.equal(transfers.size,20);
console.log('PASS original risk60 D25-D44: 20 individual lessons, 240 unique guided prompts/feedback, 20 unseen cases, 20 math rechecks, zero private grading; not independent human or member acceptance');
