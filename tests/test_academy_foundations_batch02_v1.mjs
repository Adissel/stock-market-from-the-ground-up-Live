import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bootcampCurriculumV014144} from '../functions/_lib/bootcamp-curriculum-v014144.js';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {foundationsBatch02} from '../functions/_lib/academy-foundations-batch02-v1.js';
assert.equal(foundationsBatch02.length,20);
assert.equal(bootcampCurriculumV014144.days.length,30);
const f=academyPrograms.find(x=>x.code==='foundations30');
assert(f&&f.curriculum.length===30);
let examples=new Set(),fresh=new Set(),checkpointQuestions=new Set(),numeric=0;
for(let i=0;i<30;i++){
 const original=bootcampCurriculumV014144.days[i],academy=f.curriculum[i];
 assert.equal(original.day,i+1);assert.equal(academy.day,i+1);
 assert.equal(original.title,academy.title,'Canonical day title must stay frozen');
 assert.equal(original.objective,academy.objective,'Original learning objective retained');
 assert.equal(original.practice,academy.practice,'Existing day exercise retained');
 assert.equal(original.officiallyGraded,undefined,'Only global course grade is assigned');
 assert.equal(academy.officiallyGraded,false);assert.equal(academy.masteryAwarded,false);
 if(i>=20)continue;
 const lesson=original.lesson;
 assert(lesson&&academy.lesson,'Original and Academy routes must both carry new instruction');
 for(const [field,value] of Object.entries(lesson))
  assert.strictEqual(academy.lesson[field],value,'Original frozen lesson field changed '+(i+1)+' '+field);
 for(const k of ['explanation','workedExample','error','reviewGuide','transfer','investigation','selfCheck','whenNot'])
  assert(typeof lesson[k]==='string'&&lesson[k].length>40,'Missing '+k+' on '+(i+1));
 assert(lesson.sourceProcedure.length>=3,'Missing day-specific sequence '+(i+1));
 assert(/FICTIONAL EDUCATIONAL CASE/.test(lesson.workedExample),'Synthetic scenario must be labeled');
 assert(/^https:$/.test(new URL(lesson.reference.url).protocol)&&/^(?:[a-z0-9-]+\.)*(?:investor\.gov|sec\.gov|finra\.org|nyse\.com)$/.test(new URL(lesson.reference.url).hostname),'Source must be an authoritative public topical reference');
 assert(!examples.has(lesson.workedExample));examples.add(lesson.workedExample);
 assert(!fresh.has(lesson.investigation));fresh.add(lesson.investigation);
 assert(lesson.selfCheck.startsWith('FICTIONAL:'),'Missing specific formative question Day '+(i+1));
 assert(!checkpointQuestions.has(lesson.selfCheck),'Repeated formative question Day '+(i+1));
 checkpointQuestions.add(lesson.selfCheck);
 for(const x of lesson.numericChecks){
  numeric++;
  const [a,b]=x.inputs;let val;
  switch(x.operation){
   case 'sum':val=x.inputs.reduce((p,c)=>p+c,0);break;
   case 'subtract':val=a-b;break;
   case 'average':val=x.inputs.reduce((p,c)=>p+c,0)/x.inputs.length;break;
   case 'ratio':val=a/b;break;
   case 'ratioPercent':val=(a/b)*100;break;
   case 'multiply':val=a*b;break;
   default:throw Error('Unexpected math '+x.operation);
  }
  assert(Number.isFinite(val)&&Math.abs(val-x.expected)<=Math.max(x.tolerance,1e-6),'Recompute error Day '+(i+1)+' '+x.operation+' '+val+' expected '+x.expected);
 }
 assert.equal(lesson.status,'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
}
assert.equal(checkpointQuestions.size,20,'Every first-20 day must have its own formative case');
assert(numeric>=12,'Arithmetic fixture coverage unexpectedly sparse: '+numeric);
const ui=readFileSync('assets/js/academy-guided-v1.js','utf8');
assert(ui.includes('d.lesson?.status'));
console.log('PASS original 30-day curriculum remains canonical; 20 uniquely authored cases, '+numeric+' verified synthetic calculations, 10 unchanged later days; grades not conferred.');
