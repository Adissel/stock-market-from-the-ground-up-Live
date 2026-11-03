/* Independent contract audit of 240 original guided prompts.
 * Source review and browser rendering are NOT independent editorial acceptance,
 * thirty-to-forty-five-minute learner seat time, protected grading or billing.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {academyByCode} from '../functions/_lib/bootcamp-academy-v014168.js';
import {bootcampCurriculumV014144} from '../functions/_lib/bootcamp-curriculum-v014144.js';
import {foundations30GuidedBank} from '../functions/_lib/academy-foundations30-guided-240-v1.js';
const original=bootcampCurriculumV014144.days,actual=academyByCode.foundations30.curriculum;
assert.equal(original.length,30);assert.equal(actual.length,30);
assert.deepEqual(Object.keys(foundations30GuidedBank).map(Number).sort((a,b)=>a-b),Array.from({length:20},(_,i)=>i+11));
const ids=new Set(),questions=new Set(),reviews=new Set(),types={numerical:0,transfer:0,limitations:0};
for(let day=1;day<=30;day++){
 const source=original[day-1],rendered=actual[day-1];
 assert.equal(rendered.day,day);
 assert.equal(rendered.officiallyGraded,false);assert.equal(rendered.masteryAwarded,false);
 assert.equal(rendered.assessmentSource,'protected_lab_assessment_only');
 for(const [key,value] of Object.entries(source)){
  if(key==='lesson')for(const [field,originalValue] of Object.entries(value))
   assert.strictEqual(rendered.lesson[field],originalValue,'Protected frozen original field '+day+' '+field);
  else assert.strictEqual(rendered[key],value,'Protected canonical day field '+day+' '+key);
 }
 if(day<11)continue;
 const sourceRows=foundations30GuidedBank[day],q=rendered.lesson.formativeQuestions;
 assert.equal(sourceRows.length,12);assert.equal(q.length,12);
 assert.equal(rendered.lesson.advancedPracticums.length,1);
 assert.equal(rendered.lesson.advancedNumericChecks.length,1);
 assert.equal(rendered.lesson.supplementarySourceStatus,'ORIGINAL_FOUNDATIONS30_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING');
 for(let i=0;i<12;i++){
  const row=q[i],authored=sourceRows[i];
  assert.equal(row.id,'FOUNDATIONS30-D'+String(day).padStart(2,'0')+'-ADV-Q'+String(i+1).padStart(2,'0'));
  assert.equal(row.authoredQuestion,authored.question);assert.equal(row.authoredReview,authored.review);
  assert(row.prompt.includes(authored.question)&&row.prompt.includes('FICTIONAL CASE:'));
  assert(row.review.includes(authored.review)&&row.review.includes('ungraded learning'));
  assert(authored.question.length>=48&&authored.review.length>=65,'Substantive feedback missing '+row.id);
  assert(!/correctOption|answerKey|officialScore|lumensReward/i.test(JSON.stringify(row)),'Forbidden grading field '+row.id);
  assert(!ids.has(row.id),'Duplicate ID '+row.id);
  assert(!questions.has(authored.question),'Reused generic question '+row.id);
  assert(!reviews.has(authored.review),'Reused generic feedback '+row.id);
  ids.add(row.id);questions.add(authored.question);reviews.add(authored.review);
  if(/calculate|compute|find the|arithmetic|percentage/i.test(authored.question))types.numerical++;
  if(/construct|design|create|develop|build|draft|new fictional/i.test(authored.question))types.transfer++;
  if(/why|cannot|missing|unsupported|proof|unknown|limitation|not /i.test(authored.question))types.limitations++;
 }
 assert(!Object.hasOwn(rendered.lesson,'correctOption'),'No protected key embedded in learner lesson');
}
assert.equal(ids.size,240);assert.equal(questions.size,240);assert.equal(reviews.size,240);
assert(types.numerical>=20,'Every day needs a numerical reasoning check');
assert(types.transfer>=20,'Every day needs new-evidence transfer practice');
assert(types.limitations>=40,'Uncertainty and misconception correction cannot be superficial');
const ui=readFileSync('assets/js/academy-guided-v1.js','utf8');
assert(ui.includes("day.lesson.formativeQuestions.forEach"),'Shared guided experience must expose each authored question');
assert(ui.includes("reviewedFormative.size!==12"),'All twelve require a review before stage completion');
assert(ui.includes("formativeDrafts.set(item.id,response.value)"),'Retain learner draft locally until stage transition');
console.log('PASS 240 Foundations30 D11–D30 authored prompts/reviews: unique IDs, source fidelity, numeracy, independent transfer, misconception boundaries, shared UI contract, zero protected grades.');
