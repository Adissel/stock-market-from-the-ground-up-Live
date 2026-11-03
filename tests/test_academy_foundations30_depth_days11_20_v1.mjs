import assert from 'node:assert/strict';
import {academyByCode} from '../functions/_lib/bootcamp-academy-v014168.js';
import {bootcampCurriculumV014144} from '../functions/_lib/bootcamp-curriculum-v014144.js';
const program=academyByCode.foundations30;
assert.equal(program.curriculum.length,30);
const seenPrompts=new Set(),seenCases=new Set(),seenEvidence=new Set();
function numeric(n){
 const v=n.inputs;
 if(n.operation==='weighted-average')return(v[0]*v[1]+v[2]*v[3])/(v[0]+v[2]);
 if(n.operation==='difference')return v[0]-v[1];
 if(n.operation==='ratio-percent')return v[0]/v[1]*100;
 if(n.operation==='percent-change')return(v[1]-v[0])/v[0]*100;
 throw Error('Unknown math: '+n.operation);
}
for(let i=0;i<30;i++){
 const base=bootcampCurriculumV014144.days[i],day=program.curriculum[i];
 assert.equal(day.day,i+1);
 assert.equal(day.programCode,'foundations30');
 assert.equal(day.officiallyGraded,false);assert.equal(day.masteryAwarded,false);
 assert.equal(day.assessmentSource,'protected_lab_assessment_only');
 for(const [k,v] of Object.entries(base)){
  if(k==='lesson'){for(const [field,value] of Object.entries(v))
   assert.strictEqual(day.lesson[field],value,'Frozen original lesson field '+field+' day '+(i+1));}
  else assert.strictEqual(day[k],v,'Frozen base field '+k+' day '+(i+1));
 }
 if(i<10||i>=20)continue;
 const lesson=day.lesson;
 assert.equal(lesson.supplementarySourceStatus,'ORIGINAL_FOUNDATIONS30_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING');
 assert.equal(lesson.formativeQuestions.length,12);
 assert.equal(lesson.advancedPracticums.length,1);
 assert.equal(lesson.advancedNumericChecks.length,1);
 assert(lesson.advancedSupplementalCoaching?.reference?.url?.startsWith('https://'));
 assert(lesson.advancedSupplementalCoaching?.sourceProcedure?.length>=3);
 for(const q of lesson.formativeQuestions){assert(!seenPrompts.has(q.id));seenPrompts.add(q.id);assert(q.prompt.length>90&&q.review.length>70);}
 const p=lesson.advancedPracticums[0],n=lesson.advancedNumericChecks[0];
 assert(p.scenario.startsWith('FICTIONAL ADVANCED FOUNDATIONS CASE'));
 assert(p.transfer.includes('INDEPENDENT FICTIONAL TRANSFER'));
 assert(!seenCases.has(p.id));seenCases.add(p.id);
 assert(!seenEvidence.has(n.note));seenEvidence.add(n.note);
 assert(n.inputs.every(Number.isFinite)&&Number.isFinite(n.expected));
 assert(Math.abs(numeric(n)-n.expected)<1e-7,'Incorrect independent arithmetic day '+(i+1));
 assert(!Object.hasOwn(lesson,'correctOption'),'Private answer key in public lesson');
}
assert.equal(seenPrompts.size,120);assert.equal(seenCases.size,10);assert.equal(seenEvidence.size,10);
console.log('PASS Foundations30 days 11–20 original field preservation, 120 ungraded prompts, 10 fictional cases and 10 independent numerical checks.');
