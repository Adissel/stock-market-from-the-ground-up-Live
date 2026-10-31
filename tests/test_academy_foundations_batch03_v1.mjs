import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {bootcampCurriculumV014144} from '../functions/_lib/bootcamp-curriculum-v014144.js';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {foundationsBatch03} from '../functions/_lib/academy-foundations-batch03-v1.js';
const p=academyPrograms.find(x=>x.code==='foundations30');
assert.equal(foundationsBatch03.length,10);
assert.equal(p.curriculum.length,30);
const seen=new Set();
let math=0;
for(let i=20;i<30;i++){
 const row=bootcampCurriculumV014144.days[i],d=p.curriculum[i],l=d.lesson;
 assert.equal(row.day,i+1);assert.equal(d.day,i+1);
 assert.equal(d.title,row.title);assert.equal(d.objective,row.objective);assert.equal(d.practice,row.practice);
 assert.equal(d.lesson,row.lesson);
 assert(l.explanation.length>90&&l.workedExample.length>120&&l.sourceProcedure.length>=3);
 assert(l.reviewGuide.length>40&&l.error.length>30&&l.transfer.length>40);
 assert(l.status==='ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
 assert(d.officiallyGraded===false&&d.masteryAwarded===false);
 assert(/FICTIONAL EDUCATIONAL CASE/.test(l.workedExample));
 assert(!seen.has(l.workedExample));seen.add(l.workedExample);
 assert(l.reference?.url.startsWith('https://'));
 for(const n of l.numericChecks){
  const [a,b]=n.inputs;let actual;
  switch(n.operation){
   case 'sum':actual=n.inputs.reduce((x,y)=>x+y,0);break;
   case 'subtract':actual=a-b;break;
   case 'ratio':actual=a/b;break;
   case 'ratioPercent':actual=a/b*100;break;
   case 'multiply':actual=a*b;break;
   default:throw Error('unknown operation '+n.operation);
  }
  assert(Number.isFinite(actual)&&Math.abs(actual-n.expected)<=Math.max(n.tolerance,1e-6));
  math++;
 }
}
execFileSync(process.execPath,['scripts/bootcamp-247-editorial-preflight-v1.mjs'],{stdio:'inherit'});
const m=JSON.parse(readFileSync('artifacts/bootcamp-247-batch-manifest.json','utf8'));
assert.equal(m.registeredDays,247);
assert.equal(m.authoredTotal,52);
assert.equal(m.parentDaysNewlyAuthored,30);
assert.equal(m.parentDaysStillNeedingLesson,195);
assert.equal(m.approvedByThisScript,0);
assert.equal(m.protectedAssessmentsApprovedByThisScript,0);
console.log('PASS original Foundations Days 21–30: ten unique fictional cases; '+math+' arithmetic fixtures; original fields, permissions and review gates preserved.');
