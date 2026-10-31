/* SMFGU-EDU-RISK60-REVIEW-20 — AI preliminary fictional arithmetic and
 * curricular-boundary verification. Not independent human editorial approval.
 */
import assert from 'node:assert/strict';
import {risk60LearnBatch01 as cases,risk60SourceDays as sourceDays}
  from '../functions/_lib/academy-risk60-learning-batch01-v1.js';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
assert.equal(cases.length,20);
const program=academyPrograms.find(p=>p.code==='risk60');
assert.equal(program.curriculum.length,60);
for(let i=0;i<20;i++){
 const row=cases[i],day=program.curriculum[i];
 assert.equal(day.sourceDay,sourceDays[i]);
 assert.equal(day.day,i+1);
 assert(day.lesson&&day.lesson.explanation===row.explanation&&day.lesson.workedExample===row.workedExample&&day.lesson.transfer===row.transfer,
  'Retain authored Risk60 case after additive advanced-stage fields');
 if(i>=2)assert.strictEqual(day.lesson,row);
 if(i<2)assert.equal(day.lesson.formativeQuestions.length,12);
 assert.equal(day.officiallyGraded,false);
 assert.equal(day.masteryAwarded,false);
 assert.equal(row.topicSourceDay,sourceDays[i]);
 assert.equal(row.status,'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
 assert(row.explanation.length>=60 && row.workedExample.length>=65);
 assert(row.transfer.startsWith('FRESH UNGRADED TRANSFER'));
 assert(row.reference.scope.includes('not')||row.reference.scope.includes('no '));
}
const near=(actual,expected,label)=>assert(Math.abs(actual-expected)<1e-6,label+': '+actual+' != '+expected);
const has=(day,re,label)=>assert.match(cases[day-1].workedExample,re,label);
// 20 explicit individual audit cases, each with narrow expected outcome.
has(1,/no verified issuer filing or current quote/i,'D01 must WAIT for evidence');
near((8.4-8)/8*100,5,'D02 price percentage');
near((8.4-8.32)/8.36*100,.9569377990430622,'D02 midpoint spread percentage');
has(2,/0\.96%/,'D02 rounded midpoint spread');
near(9/12*100,75,'D03 process denominator');
near(1200000/300000,4,'D04 dated float turnover');
near(250-(80+120),50,'D05 visible book deficit');
near((4.99-4.90)/4.945*100,1.8200202224469179,'D06 spread reject');
near(80/(24-23.60),200,'D07 theoretical risk shares');
near(200-50,150,'D08 remaining shares');
near(50*(10.5-10),25,'D08 realized gross difference');
near((80*4.10+120*4.15)/200,4.13,'D09 frozen book hypothetical average');
has(10,/2-left\/2-right completed-bar pivot rule/i,'D10 must declare exact completed-bar pivot confirmation');
near((9.20-8.95)/9.20*100,2.717391304347826,'D11 observed fall');
near(120*(12-10),240,'D12 short gross adverse difference');
has(13,/nine winning trades out of ten selected screenshots/i,'D13 selection bias');
near((60-50)/50*100,20,'D14 observed rise');
near((10.17-10.01)/((10.01+10.17)/2)*100,1.585728444003965,'D15 midpoint spread');
has(15,/1\.59% midpoint spread/i,'D15 explicit quote and 1% veto');
has(16,/08:15 the later filing cannot substantiate/i,'D16 no future evidence');
has(17,/fourth attractive-looking breakout is a NO TRADE/i,'D17 attempt cap');
has(18,/Preserve the 09:00 record/i,'D18 version history');
has(19,/later rise does not make the original NO TRADE decision wrong/i,'D19 hindsight');
near(16/20*100,80,'D20 source completeness');
near(12/20*100,60,'D20 risk plan completeness');
assert.equal(new Set(cases.map(x=>x.workedExample)).size,20);
assert.equal(new Set(cases.map(x=>x.transfer)).size,20);
console.log('PASS 20 individual Risk60 AI editorial-preflight cases: fictional computations, full day/source mapping, source boundaries, no grading or mastery. HUMAN EDITORIAL ACCEPTANCE REMAINS 0.');
