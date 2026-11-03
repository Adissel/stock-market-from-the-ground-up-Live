/* Source-only, ungraded Scanners10 advanced-depth regression. No protected approval. */
import assert from 'node:assert/strict';
import {academyByCode} from '../functions/_lib/bootcamp-academy-v014168.js';
import {first22DayLessons} from '../functions/_lib/academy-first22-teaching-v1.js';

const program=academyByCode.scanners10;
assert.equal(program.curriculum.length,10);
const questionIds=new Set(),caseIds=new Set(),evidence=new Set(),operations=new Set();
const arithmetic=(x)=>{
 switch(x.operation){
  case 'ratio':return x.a/x.b*100;
  case 'multiple':return x.a/x.b;
  case 'difference':return x.a-x.b;
  case 'split':return x.a/x.b;
  case 'overlap':return x.a+x.b-x.c;
  case 'remaining':return x.a-(x.b+x.c-x.d);
  default:throw Error('Unsupported scanner exercise '+x.operation);
 }
};
for(let i=0;i<10;i++){
 const day=program.curriculum[i],lesson=day.lesson,original=first22DayLessons.scanners10[i];
 assert.equal(day.title,original.title,'Canonical title drift day '+(i+1));
 for(const [key,value] of Object.entries(original))
  assert.strictEqual(lesson[key],value,'Frozen source field '+key+' day '+(i+1));
 assert.equal(day.sourceStatus,'original_scanners10_advanced_source_authored_technical_acceptance_pending');
 assert.equal(lesson.supplementarySourceStatus,'ORIGINAL_SCANNERS10_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING');
 assert.equal(day.officiallyGraded,false);
 assert.equal(day.masteryAwarded,false);
 assert.equal(lesson.formativeQuestions.length,12);
 assert.equal(lesson.advancedPracticums.length,1);
 assert.equal(lesson.advancedNumericChecks.length,1);
 for(const q of lesson.formativeQuestions){
  assert(!questionIds.has(q.id),'Repeated formative prompt identity '+q.id);
  assert(q.prompt.length>70&&q.review.length>70);
  questionIds.add(q.id);
 }
 const p=lesson.advancedPracticums[0],n=lesson.advancedNumericChecks[0];
 assert(!caseIds.has(p.id));caseIds.add(p.id);
 assert(p.scenario.startsWith('FICTIONAL ADVANCED SCANNER CASE:'));
 assert(p.transfer.includes('INDEPENDENT FICTIONAL TRANSFER'));
 assert(!evidence.has(n.note));evidence.add(n.note);
 assert(Number.isFinite(n.expected)&&Number.isFinite(arithmetic(n)));
 assert(Math.abs(arithmetic(n)-n.expected)<1e-9,'Incorrect numerical exercise day '+(i+1));
 assert(n.units.length>5);operations.add(n.operation);
 assert(!Object.hasOwn(lesson,'correctOption'),'No protected answer key permitted in public instruction');
}
assert.equal(questionIds.size,120);
assert.equal(caseIds.size,10);
assert.equal(evidence.size,10);
assert(operations.size>=4);
console.log('PASS Scanners10 advanced source: 120 ungraded prompts, 10 distinct cases, 10 numeric exercises, frozen original fields, 0 official grades.');
