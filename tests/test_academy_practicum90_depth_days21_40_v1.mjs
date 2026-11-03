import assert from 'node:assert/strict';
import {academyByCode} from '../functions/_lib/bootcamp-academy-v014168.js';
import {practicum90LearnBatch02} from '../functions/_lib/academy-practicum90-learning-batch02-v1.js';
import {practicum90Batch03} from '../functions/_lib/academy-practicum90-batch03-days26-45-v1.js';
import {practicum90DepthDays21to40} from '../functions/_lib/academy-practicum90-depth-days21-40-v1.js';
const originals=[...practicum90LearnBatch02.slice(15),...practicum90Batch03.slice(0,15)],program=academyByCode.practicum90,ids=new Set(),cases=new Set();
for(let i=0;i<20;i++){
 const day=program.curriculum[i+20],original=originals[i],lesson=day.lesson,pack=practicum90DepthDays21to40[i+21];
 assert.equal(day.day,i+21);assert.equal(day.sourceDay,(i+20)%30+1);assert.equal(day.officiallyGraded,false);
 for(const [key,value] of Object.entries(original))assert.strictEqual(lesson[key],value,'Frozen field '+key+' D'+day.day);
 assert.equal(lesson.formativeQuestions.length,12);assert.equal(lesson.advancedPracticums.length,1);
 for(const q of lesson.formativeQuestions){assert(!ids.has(q.id));ids.add(q.id);assert(q.prompt.length>100&&q.review.length>60);}
 const c=lesson.advancedPracticums[0];assert(!cases.has(c.id));cases.add(c.id);for(const k of ['scenario','task','worked','pitfall','transfer'])assert(c[k].length>70,k+' D'+day.day);
 const n=lesson.advancedNumericChecks[0],actual=n.operation==='pct'?(n.a-n.b)/n.b*100:n.operation==='ratio'?n.a/n.b*100:n.operation==='abs'?Math.abs(n.a-n.b):n.a-n.b;
 assert(Math.abs(actual-n.expected)<1e-8);assert.equal(pack.supplementarySourceStatus,'ORIGINAL_PRACTICUM90_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING');
}
assert.equal(ids.size,240);assert.equal(cases.size,20);
console.log('PASS Practicum90 advanced Days 21-40: 240 original ungraded questions/reviews, 20 fictional cases and calculations, frozen lineage, no protected grading.');
