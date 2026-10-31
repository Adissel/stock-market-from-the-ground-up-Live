import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {practicum90LearnBatch01 as cases} from '../functions/_lib/academy-practicum90-learning-batch01-v1.js';
const p=academyPrograms.find(x=>x.code==='practicum90');
assert.equal(p.curriculum.length,90);
assert.equal(cases.length,5);
const uniqueExamples=new Set(),uniqueTransfers=new Set();
for(let i=0;i<5;i++){
 const d=p.curriculum[i],c=cases[i];
 assert.equal(d.day,i+1);assert.equal(d.sourceDay,i+1);
 assert.equal(d.phase,'learn');assert.strictEqual(d.lesson,c);
 assert.equal(d.sourceStatus,'original_practicum90_learning_day_specific_ungraded_editorial_review_pending');
 assert.equal(d.officiallyGraded,false);assert.equal(d.masteryAwarded,false);
 assert.equal(c.day,i+1);assert.equal(c.topicSourceDay,i+1);
 assert.equal(c.status,'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
 assert(c.explanation.length>=95&&c.workedExample.length>=180);
 assert(c.reviewGuide.length>=130);
 assert(c.transfer.startsWith('FRESH FICTIONAL TRANSFER'));
 assert(c.sourceProcedure.length===3);assert(c.reference.url.startsWith('https://www.investor.gov/'));
 assert(!uniqueExamples.has(c.workedExample));uniqueExamples.add(c.workedExample);
 assert(!uniqueTransfers.has(c.transfer));uniqueTransfers.add(c.transfer);
}
const near=(x,y)=>assert(Math.abs(x-y)<.00001,'Numerical fixture mismatch '+x+' vs '+y);
near(56-31,25); // D01 quote age from 08:31 through 08:56.
near((10.70-10)/10*100,7);
near((10.82-10.64)/((10.82+10.64)/2)*100,1.6775396085740916);
near(9/12*100,75);near(8/12*100,66.66666666666666);near(6/12*100,50);
near(720000/480000,1.5);
near(21.40-20.80,.60);near(Math.abs(21.30-21.00),.30);
execFileSync(process.execPath,['scripts/bootcamp-247-editorial-preflight-v1.mjs'],{stdio:'inherit'});
const m=JSON.parse(readFileSync('artifacts/bootcamp-247-batch-manifest.json','utf8'));
assert.equal(m.registeredDays,247);
assert.equal(m.authoredTotal,162);
assert.equal(m.parentDaysNewlyAuthored,140);
assert.equal(m.parentDaysStillNeedingLesson,85);
assert.equal(m.approvedByThisScript,0);assert.equal(m.protectedAssessmentsApprovedByThisScript,0);
console.log('PASS first five Advanced Practicum original source-day cases and 162/247 curriculum source authoring. Private grades and human reviewer acceptance remain unapproved.');
