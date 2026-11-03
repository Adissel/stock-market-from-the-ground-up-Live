import assert from 'node:assert/strict';
import {academyByCode} from '../functions/_lib/bootcamp-academy-v014168.js';
import {practicum90LearnBatch01} from '../functions/_lib/academy-practicum90-learning-batch01-v1.js';
import {practicum90LearnBatch02} from '../functions/_lib/academy-practicum90-learning-batch02-v1.js';
import {practicum90DepthDays01to20} from '../functions/_lib/academy-practicum90-depth-days01-20-v1.js';
const originals=[...practicum90LearnBatch01,...practicum90LearnBatch02],program=academyByCode.practicum90;
const ids=new Set(),cases=new Set();
for(let i=0;i<20;i++){
 const day=program.curriculum[i],lesson=day.lesson,original=originals[i],pack=practicum90DepthDays01to20[i+1];
 assert.equal(day.day,i+1);assert.equal(day.sourceDay,i+1);assert.equal(day.officiallyGraded,false);assert.equal(day.masteryAwarded,false);
 for(const [key,value] of Object.entries(original))assert.equal(lesson[key],value,'Frozen original field '+key+' D'+(i+1));
 assert.equal(lesson.formativeQuestions.length,12);assert.equal(lesson.advancedPracticums.length,1);
 for(const q of lesson.formativeQuestions){assert(!ids.has(q.id));ids.add(q.id);assert(q.prompt.length>100&&q.review.length>60);}
 const c=lesson.advancedPracticums[0];assert(!cases.has(c.id));cases.add(c.id);
 for(const field of ['scenario','task','worked','pitfall','transfer'])assert(c[field].length>70,field+' D'+(i+1));
 const n=lesson.advancedNumericChecks[0];
 const actual=n.operation==='pct'?(n.a-n.b)/n.b*100:n.operation==='ratio'?n.a/n.b*100:n.operation==='abs'?Math.abs(n.a-n.b):n.a-n.b;
 assert(Math.abs(actual-n.expected)<1e-8,'Arithmetic D'+(i+1));
 assert.equal(pack.supplementarySourceStatus,'ORIGINAL_PRACTICUM90_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING');
 assert(!JSON.stringify(lesson).includes('answer_key'));
}
assert.equal(ids.size,240);assert.equal(cases.size,20);
console.log('PASS Practicum90 advanced Days 01-20: 240 original ungraded questions/reviews, 20 fictional cases, 20 calculations, frozen original lineage, no protected grading.');
