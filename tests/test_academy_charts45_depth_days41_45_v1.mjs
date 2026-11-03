import assert from 'node:assert/strict';
import {academyByCode} from '../functions/_lib/bootcamp-academy-v014168.js';
import {chartCaseBySourcePhase} from '../functions/_lib/academy-charts45-batch04-v1.js';
import {charts45DepthDays41to45} from '../functions/_lib/academy-charts45-depth-days41-45-v1.js';

const program=academyByCode.charts45,questions=new Set(),cases=new Set();
for(let dayNumber=41;dayNumber<=45;dayNumber++){
 const day=program.curriculum[dayNumber-1],lesson=day.lesson,pack=charts45DepthDays41to45[dayNumber];
 const original=chartCaseBySourcePhase[lesson.topicSourceDay][2];
 assert.equal(day.day,dayNumber);assert.equal(day.programCode,'charts45');
 assert.equal(day.officiallyGraded,false);assert.equal(day.masteryAwarded,false);
 for(const [key,value] of Object.entries(original))assert.equal(lesson[key],value,'Frozen field '+key+' changed D'+dayNumber);
 assert.equal(pack,charts45DepthDays41to45[dayNumber]);
 assert.equal(lesson.formativeQuestions.length,12);assert.equal(lesson.advancedPracticums.length,1);
 for(const q of lesson.formativeQuestions){assert(!questions.has(q.id));questions.add(q.id);assert(q.prompt.length>100&&q.review.length>60);}
 const c=lesson.advancedPracticums[0];assert(!cases.has(c.id));cases.add(c.id);
 for(const field of ['scenario','task','worked','pitfall','transfer'])assert(c[field].length>70,field+' D'+dayNumber);
 const n=lesson.advancedNumericChecks[0];
 const actual=n.operation==='pct'?(n.a-n.b)/n.b*100:n.operation==='abs'?Math.abs(n.a-n.b):n.a-n.b;
 assert(Math.abs(actual-n.expected)<1e-9,'Arithmetic D'+dayNumber);
 assert(!JSON.stringify(lesson).includes('answer_key'));
}
assert.equal(questions.size,60);assert.equal(cases.size,5);
console.log('PASS Charts45 original Days 41-45: 60 original ungraded questions/reviews, five fictional cases, five explicit calculations, frozen canonical lineage, no protected grading.');
