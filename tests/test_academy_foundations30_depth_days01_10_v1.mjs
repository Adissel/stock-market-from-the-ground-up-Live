import assert from 'node:assert/strict';
import {academyByCode} from '../functions/_lib/bootcamp-academy-v014168.js';
import {bootcampCurriculumV014144} from '../functions/_lib/bootcamp-curriculum-v014144.js';
const lessons=academyByCode.foundations30.curriculum;
assert.equal(lessons.length,30);
const ids=new Set(),worked=new Set();
function calculate(s){const x=s.inputs;
 if(s.operation==='ratio-percent')return x[0]/x[1]*100;
 if(s.operation==='percent-change')return (x[1]-x[0])/x[0]*100;
 if(s.operation==='difference')return x[0]-x[1];
 if(s.operation==='min-floors')return Math.min(Math.floor(x[0]/x[1]),Math.floor(x[2]/x[3]));
 throw Error('Missing independent arithmetic: '+s.operation);
}
for(let i=0;i<30;i++){
 const day=lessons[i],original=bootcampCurriculumV014144.days[i];
 for(const [key,value] of Object.entries(original)){
  if(key==='lesson'){
   for(const [field,originalValue] of Object.entries(value))
    assert.strictEqual(day.lesson[field],originalValue,'Frozen original day lesson: '+(i+1)+' '+field);
  }else assert.strictEqual(day[key],value,'Frozen v0.14.0.144 field drift: '+(i+1)+' '+key);
 }
 assert.equal(day.day,i+1);
 assert.equal(day.programCode,'foundations30');
 assert.equal(day.officiallyGraded,false);
 assert.equal(day.masteryAwarded,false);
 assert.equal(day.assessmentSource,'protected_lab_assessment_only');
 if(i>=10){assert.strictEqual(day.lesson,original.lesson,'Later original lesson remains unchanged');continue;}
 const lesson=day.lesson;
 assert.equal(lesson.title,original.lesson.title,'Preserve original day-specific lesson title');
 assert.equal(lesson.supplementarySourceStatus,'ORIGINAL_FOUNDATIONS30_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING');
 assert.equal(lesson.formativeQuestions.length,12);
 assert.equal(lesson.advancedPracticums.length,1);
 assert.equal(lesson.advancedNumericChecks.length,1);
 assert(lesson.reference.url.startsWith('https://'));
 assert(lesson.sourceProcedure.length>=3);
 for(const q of lesson.formativeQuestions){
  assert(!ids.has(q.id),'Repeated question '+q.id);ids.add(q.id);
  assert(q.prompt.length>90&&q.review.length>70);
 }
 const p=lesson.advancedPracticums[0],n=lesson.advancedNumericChecks[0];
 assert(p.scenario.startsWith('FICTIONAL ADVANCED FOUNDATIONS CASE'));
 assert(p.transfer.includes('INDEPENDENT FICTIONAL TRANSFER'));
 assert(!worked.has(n.note));worked.add(n.note);
 assert(Number.isFinite(calculate(n))&&Number.isFinite(n.expected));
 assert(Math.abs(calculate(n)-n.expected)<1e-8,'Wrong math '+(i+1));
 assert(!Object.hasOwn(lesson,'correctOption'),'Protected answer-key exposure');
}
assert.equal(ids.size,120);
assert.equal(worked.size,10);
console.log('PASS Foundations30 D01-D10: frozen 30 canonical days, 120 ungraded prompts, 10 fictional cases, 10 checked calculations, zero grades.');
