import assert from 'node:assert/strict';
import {academyByCode} from '../functions/_lib/bootcamp-academy-v014168.js';
import {chartCaseBySourcePhase} from '../functions/_lib/academy-charts45-batch04-v1.js';
import {charts45DepthDays01to20} from '../functions/_lib/academy-charts45-depth-days01-20-v1.js';
const sourceDays=[5,9,13,14,15,16,18,20,21,22,23,26,27,28,29];
const program=academyByCode.charts45,allQuestions=new Set(),allCases=new Set();
assert.equal(program.days,45);
assert.equal(program.curriculum.length,45);
for(let i=0;i<20;i++){
 const day=program.curriculum[i],lesson=day.lesson,pack=charts45DepthDays01to20[i+1];
 const source=sourceDays[i%15],phase=Math.floor(i/15),original=chartCaseBySourcePhase[source][phase];
 assert.equal(day.day,i+1);
 assert.equal(day.programCode,'charts45');
 assert.equal(day.officiallyGraded,false);
 assert.equal(day.masteryAwarded,false);
 assert.equal(lesson.title,original.title,'Preserve original lesson title');
 assert.equal(lesson.reference.url,original.reference.url,'Preserve original source');
 assert.equal(lesson.topicSourceDay,source,'Preserve original source-day mapping');
 assert.equal(pack.topicSourceDay,source);
 assert.equal(lesson.formativeQuestions.length,12);
 assert.equal(lesson.advancedPracticums.length,1);
 for(const q of lesson.formativeQuestions){
  assert(!allQuestions.has(q.id));
  allQuestions.add(q.id);
  assert(q.prompt.length>=30&&q.review.length>=30,'Substantive instructional answer');
 }
 const ac=lesson.advancedPracticums[0];
 assert(!allCases.has(ac.id));allCases.add(ac.id);
 for(const k of ['scenario','task','worked','pitfall','transfer'])
  assert(ac[k].length>=70,'Advanced field '+k+' day '+day.day);
 const v=lesson.advancedNumericChecks[0];
 const result=v.operation==='pct'?(v.a-v.b)/v.b*100:v.operation==='ratio'?v.a/v.b*100:
  v.operation==='abs'?Math.abs(v.a-v.b):v.a-v.b;
 assert(Number.isFinite(result)&&Math.abs(result-v.expected)<1e-7,
  'Numerical mismatch day '+day.day);
 assert(!JSON.stringify(lesson).includes('answer_key'),'No private assessment keys');
}
assert.equal(allQuestions.size,240);
assert.equal(allCases.size,20);
console.log('PASS Charts45 original Days 1–20: canonical titles/source lineage, 240 original ungraded questions/reviews, 20 fictional cases and 20 independent numeric checks; no protected grading.');
