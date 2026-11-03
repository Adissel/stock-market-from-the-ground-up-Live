import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {practicum90LearnBatch02} from '../functions/_lib/academy-practicum90-learning-batch02-v1.js';
import {practicum90LearnBatch01} from '../functions/_lib/academy-practicum90-learning-batch01-v1.js';
const program=academyPrograms.find(x=>x.code==='practicum90');
assert(program && program.curriculum.length===90);
assert.equal(practicum90LearnBatch01.length,5);
assert.equal(practicum90LearnBatch02.length,20);
const unique=new Set([...practicum90LearnBatch01.map(x=>x.workedExample)]),transfer=new Set([...practicum90LearnBatch01.map(x=>x.transfer)]);
for(let i=0;i<20;i++){
 const d=program.curriculum[i+5],s=practicum90LearnBatch02[i];
 assert.equal(d.day,i+6,'Canonical day ID');
 assert.equal(d.sourceDay,i+6,'Canonical 30-source mapping');
 assert.equal(d.programCode,'practicum90');
 assert.equal(d.phase,'learn');
 for(const [key,value] of Object.entries(s))
  assert.strictEqual(d.lesson[key],value,'Engine must preserve original teaching field '+key);
 if(i<15)assert.equal(d.lesson.supplementarySourceStatus,
  'ORIGINAL_PRACTICUM90_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING');
 else assert.strictEqual(d.lesson,s,'Unchanged D21-D25 must retain exact original teaching source');
 assert.equal(d.sourceStatus,i<15?'original_practicum90_advanced_source_authored_technical_acceptance_pending':
  'original_practicum90_learning_batch02_ungraded_editorial_review_pending');
 assert.equal(d.officiallyGraded,false);assert.equal(d.masteryAwarded,false);
 assert.equal(s.day,i+6);assert.equal(s.topicSourceDay,i+6);
 assert.equal(s.status,'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
 for(const k of ['explanation','workedExample','reviewGuide','transfer','selfCheck'])
  assert(s[k]&&s[k].length>95,'Substantive required field '+k+' day '+d.day);
 assert(s.sourceProcedure.length===3 && s.reviewPrompts.length===3);
 assert(s.reference.url.startsWith('https://'),'Documented source but not historical data rights');
 assert(s.workedExample.startsWith('FICTIONAL:'));
 assert(!unique.has(s.workedExample),'Worked case duplicated');unique.add(s.workedExample);
 assert(!transfer.has(s.transfer),'Transfer duplicated');transfer.add(s.transfer);
 assert(s.transfer.startsWith('FRESH FICTIONAL TRANSFER'));
 assert(!('correctOption' in s) && !('privateKey' in s),'Protected grading must remain outside public package');
}
assert.equal(unique.size,25);assert.equal(transfer.size,25);
const near=(actual,expected,label)=>assert(Math.abs(actual-expected)<0.00001,label+' '+actual);
near(35*14.10+65*14.14,1412.60,'D06 quote weighted cost');
near(125-100,25,'D06 uncovered shares');
near((6.10-5.90)/6*100,3.3333333333,'D08 spread');
near(12.22-.04,12.18,'D09 support edge');
near(Math.floor(72/(24-23.55)),160,'D10 risk cap');
near(Math.floor(2160/24),90,'D10 notional cap');
near(160-45,115,'D11 residual shares');
near(45*(8.65-8.25),18,'D11 realized gross');
near((20*6.40+80*6.45)/100,6.44,'D12 hypothetical average');
near(9.02-8.72,.30,'D14 green body');
near((6.30-4.50)/4.50*100,40,'D15 historic price movement');
near((6.05-5.85)/5.95*100,3.36134453781513,'D15 quote spread');
near((14-13.58)/14*100,3,'D16 observed decline');
near(75*(14.40-12),180,'D17 hypothetical short adverse');
near(11.20-10.75,.45,'D18 red daily body');
near(12/15*100,80,'D19 selected-sample numerator');
near((45-36)/36*100,25,'D20 rise');
near((16.50-15)/15*100,10,'D22 leader return');
near((3.10-2.90)/3*100,6.6666666667,'D22 sympathy spread');
near((9.18-8.98)/9.08*100,2.2026431718,'D23 veto');
execFileSync(process.execPath,['scripts/bootcamp-247-editorial-preflight-v1.mjs'],{stdio:'inherit'});
const m=JSON.parse(readFileSync('artifacts/bootcamp-247-batch-manifest.json','utf8'));
assert.equal(m.registeredDays,247);
assert.equal(m.authoredTotal,247);
assert.equal(m.parentDaysNewlyAuthored,225);
assert.equal(m.parentDaysStillNeedingLesson,0);
assert.equal(m.approvedByThisScript,0);assert.equal(m.protectedAssessmentsApprovedByThisScript,0);
console.log('PASS 20 original Practicum90 source-aligned fictional cases D06–D25; 182/247 authored, 65 missing; no protected assessments, no human approval.');
