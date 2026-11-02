/* SMFGU-ACADEMY-RISK60-D21-24-SOURCE-GATE v1.0
 * Source-only technical and arithmetic verification; NO human editorial,
 * production-member, accessibility, grading or market-data rights approval.
 */
import assert from 'node:assert/strict';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {risk60PracticeBatch02} from '../functions/_lib/academy-risk60-practice-batch02-v1.js';
import {risk60PracticeDeepDay21to22V1} from '../functions/_lib/academy-risk60-practice-depth-day21-22-v1.js';
import {risk60PracticeDeepDay23to24V1} from '../functions/_lib/academy-risk60-practice-depth-day23-24-v1.js';

const program=academyPrograms.find(p=>p.code==='risk60');
assert(program,'Original canonical Risk60 program missing');
assert.equal(program.days,60);
assert.equal(program.curriculum.length,60);
assert.equal(risk60PracticeBatch02.length,20);
const allQuestions=new Set(),allReviews=new Set(),allScenarios=new Set(),allTransfers=new Set();
for(let dayNo=21;dayNo<=24;dayNo++){
 const day=program.curriculum[dayNo-1];
 const lesson=risk60PracticeBatch02[dayNo-21];
 const authored=dayNo<=22?risk60PracticeDeepDay21to22V1[dayNo]:risk60PracticeDeepDay23to24V1[dayNo];
 assert(authored,'Missing day-specific independent source package D'+dayNo);
 assert.equal(day.programCode,'risk60');
 assert.equal(day.day,dayNo);
 assert.equal(day.phase,'practice');
 assert.strictEqual(day.lesson,lesson,'Member-facing lesson did not receive depth D'+dayNo);
 assert.equal(lesson.topicSourceDay,dayNo-20);
 assert.equal(lesson.status,'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
 assert.equal(day.officiallyGraded,false);
 assert.equal(day.masteryAwarded,false);
 assert.equal(lesson.formativeQuestions.length,12,'Exactly twelve guided prompts D'+dayNo);
 assert.equal(lesson.advancedPracticums.length,1,'One independent worked case D'+dayNo);
 assert.equal(lesson.reference?.url?.startsWith('https://'),true,'Attributed inherited source D'+dayNo);
 assert.equal(lesson.whenNot.includes('no independently reviewed protected keys'),true);
 for(const [i,q] of lesson.formativeQuestions.entries()){
  assert.equal(q.id,'risk60-D'+dayNo+'-Q'+String(i+1).padStart(2,'0'));
  assert(q.prompt.length>=30 && q.review.length>=30,'Substantive prompt and feedback required');
  assert(!allQuestions.has(q.prompt),'Duplicate guided prompt: '+q.id);
  assert(!allReviews.has(q.review),'Duplicate feedback: '+q.id);
  allQuestions.add(q.prompt);allReviews.add(q.review);
 }
 const a=lesson.advancedPracticums[0];
 assert.equal(a.id,'risk60-D'+dayNo+'-A01');
 for(const key of ['scenario','task','worked','pitfall','transfer'])
  assert(a[key].length>=70,'Substantive independent '+key+' D'+dayNo);
 assert(!allScenarios.has(a.scenario),'Repeated advanced case D'+dayNo);
 assert(!allTransfers.has(a.transfer),'Repeated advanced transfer D'+dayNo);
 allScenarios.add(a.scenario);allTransfers.add(a.transfer);
 for(const blocked of ['answerKey','correctAnswer','correctOption','grader','rubric','masteryScore'])
  assert.equal(Object.hasOwn(lesson,blocked),false,'Private grading field leaked to instructional lesson: '+blocked);
}
assert.equal(allQuestions.size,48);
assert.equal(allReviews.size,48);
assert.equal(allScenarios.size,4);
assert.equal(allTransfers.size,4);
const near=(actual,expected,label)=>assert(Math.abs(actual-expected)<1e-9,label+': '+actual+' instead of '+expected);
near((18/24)*100,75,'D23 decision-source completeness');
near(24-18,6,'D23 undocumented decisions');
near((10/15)*100,66.66666666666667,'D23 independent transfer cohort');
near(75-(10/15)*100,8.333333333333329,'D23 percentage-point difference');
near((33/40)*100,82.5,'D23 fresh transfer percentage');
near(40-33,7,'D23 fresh transfer missing records');
near(900000/600000,1.5,'D24 mechanical float turnover');
near(900000/750000,1.2,'D24 alternate dated float estimate');
near(300000/1200000,.25,'D24 independent practice turnover');
near(180000/720000,.25,'D24 fresh transfer turnover');
const d23=risk60PracticeBatch02[2],d24=risk60PracticeBatch02[3];
assert.match(d23.advancedPracticums[0].worked,/75\.0%/);
assert.match(d23.advancedPracticums[0].worked,/8\.333/);
assert.match(d24.advancedPracticums[0].worked,/1\.50/);
assert.match(d24.advancedPracticums[0].worked,/1\.20/);
assert.match(d24.advancedPracticums[0].pitfall,/unique-owner census/);
console.log('PASS source-only Academy Risk60 D21-D24: 48 unique teaching checks, 4 original advanced cases, 4 separate transfers, independent numerical verification, zero grades; independent review and real-member tests remain open.');
