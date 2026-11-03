import assert from 'node:assert/strict';
import {academyByCode} from '../functions/_lib/bootcamp-academy-v014168.js';
import {bootcampCurriculumV014144} from '../functions/_lib/bootcamp-curriculum-v014144.js';
const all=academyByCode.foundations30.curriculum;
assert.equal(all.length,30);
const cases=new Set(),questions=new Set(),evidence=new Set();
for(let i=0;i<30;i++){
 const canonical=bootcampCurriculumV014144.days[i],day=all[i];
 assert.equal(day.programCode,'foundations30');assert.equal(day.day,i+1);
 for(const [k,v] of Object.entries(canonical)){
  if(k==='lesson'){for(const [field,original] of Object.entries(v))
   assert.strictEqual(day.lesson[field],original,'Changed original lesson '+field+' D'+(i+1));}
  else assert.strictEqual(day[k],v,'Changed canonical day '+k+' D'+(i+1));
 }
 assert.equal(day.officiallyGraded,false);assert.equal(day.masteryAwarded,false);
 assert.equal(day.assessmentSource,'protected_lab_assessment_only');
 if(i<20)continue;
 const lesson=day.lesson,coaching=lesson.advancedSupplementalCoaching;
 assert.equal(lesson.supplementarySourceStatus,'ORIGINAL_FOUNDATIONS30_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING');
 assert.equal(lesson.formativeQuestions.length,12);
 assert.equal(lesson.advancedPracticums.length,1);
 assert.equal(lesson.advancedNumericChecks.length,1);
 assert(coaching.reference.url.startsWith('https://')&&coaching.sourceProcedure.length>=3);
 assert(lesson.formativeQuestions.every(q=>q.prompt.length>90&&q.review.length>70));
 for(const q of lesson.formativeQuestions){assert(!questions.has(q.id));questions.add(q.id);}
 const caseRow=lesson.advancedPracticums[0],n=lesson.advancedNumericChecks[0];
 assert(!cases.has(caseRow.id));cases.add(caseRow.id);
 assert(caseRow.scenario.startsWith('FICTIONAL ADVANCED FOUNDATIONS CASE'));
 assert(caseRow.transfer.includes('INDEPENDENT FICTIONAL TRANSFER'));
 assert(!evidence.has(n.note));evidence.add(n.note);
 assert(n.inputs.every(Number.isFinite)&&Number.isFinite(n.expected));
 const actual=n.operation==='ratio-percent'?n.inputs[0]/n.inputs[1]*100:n.operation==='difference'?n.inputs[0]-n.inputs[1]:NaN;
 assert(Math.abs(actual-n.expected)<1e-8,'Numerical exercise wrong at D'+(i+1));
 assert(!Object.hasOwn(lesson,'correctOption'));
}
assert.equal(questions.size,120);assert.equal(cases.size,10);assert.equal(evidence.size,10);
console.log('PASS Foundations30 D21-D30: ten original days, 120 formative questions, ten day-specific fictional cases/calculations, unchanged canonical instruction and no official grades.');
