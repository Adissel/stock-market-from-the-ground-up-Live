#!/usr/bin/env node
/* SMFGU-ACADEMY-274-DEPTH-AUDIT-V1
 * Read-only source audit of all canonical Academy study days.
 * Produces no official approval, grades, member writes, commerce changes,
 * simulated identities or assertions about actual elapsed study time.
 */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
const programs=['truth5','watchlist7','scanners10','foundations30','charts45','risk60','practicum90',
 'tape10','indicators10','filings7'];
const lengths=[5,7,10,30,45,60,90,10,10,7];
const newCodes=new Set(['tape10','indicators10','filings7']);
const docs=[],grouped={};
assert.deepEqual(academyPrograms.map(p=>p.code),programs,'Never rewrite the Academy course identity/order.');
assert.deepEqual(academyPrograms.map(p=>p.days),lengths,'Never silently change canonical program lengths.');
for(const p of academyPrograms){
 grouped[p.code]={days:p.days,sourceAuthored:0,deepTeachingSourceComplete:0,formativeQuestions:0,advancedCases:0};
 for(const [i,d] of p.curriculum.entries()){
  const id=p.code+':'+(i+1),lesson=d.lesson||{};
  assert.equal(d.day,i+1,'Canonical study day drift '+id);
  assert.equal(d.officiallyGraded,false,'Do not publish an official grade during study '+id);
  assert.equal(d.masteryAwarded,false,'Do not grant independent mastery during study '+id);
  const originalFieldAuthoring=Boolean(lesson.explanation&&lesson.workedExample&&
    lesson.sourceProcedure?.length&&lesson.transfer&&lesson.reviewGuide);
  const formative=Array.isArray(lesson.formativeQuestions)?lesson.formativeQuestions:[];
  const advanced=Array.isArray(lesson.advancedPracticums)?lesson.advancedPracticums:[];
  const uniqueFormative=new Set(formative.map(q=>q.id));
  const uniqueAdvanced=new Set(advanced.map(q=>q.id));
  const sourceSpecificAdvanced=advanced.length>0&&uniqueAdvanced.size===advanced.length&&advanced.every(q=>
   q.scenario?.length>=50&&q.task?.length>=50&&q.worked?.length>=70&&
   q.pitfall?.length>=70&&q.transfer?.length>=70);
  const formativeReady=formative.length===12&&uniqueFormative.size===12&&formative.every(q=>
   q.prompt?.length>=30&&q.review?.length>=30);
  const newReady=formativeReady&&sourceSpecificAdvanced&&lesson.worked?.length>=35&&
   typeof lesson.source?.url==='string'&&/^https:\/\//.test(lesson.source.url);
  const originalAdvancedReady=!newCodes.has(p.code)&&originalFieldAuthoring&&formativeReady&&
   sourceSpecificAdvanced&&typeof lesson.reference?.url==='string'&&
   /^https:\/\//.test(lesson.reference.url);
  const dayAdvancedReady=newReady||originalAdvancedReady;
  const sourceAuthored=newCodes.has(p.code)?newReady:originalFieldAuthoring;
  if(newCodes.has(p.code))assert(newReady,'Incomplete approved Beta deep-teaching source '+id);
  if(sourceAuthored)grouped[p.code].sourceAuthored++;
  if(dayAdvancedReady)grouped[p.code].deepTeachingSourceComplete++;
  grouped[p.code].formativeQuestions+=formative.length;
  grouped[p.code].advancedCases+=advanced.length;
  docs.push({id,program:p.code,day:i+1,title:d.title,originalFieldAuthoring,
    formativeCount:formative.length,advancedCaseCount:advanced.length,
    advancedSourceReady:dayAdvancedReady,individualEditorialAcceptance:newCodes.has(p.code)?
     'OWNER_APPROVED_INVITED_INSTRUCTIONAL_BETA':'NO_INDEPENDENT_ACCEPTANCE_EVIDENCE',
    officialGrading:'DISABLED_BY_SEPARATE_GATE',
    pedagogicalDuration:'SUGGESTED_35_OR_45_MINUTES_NOT_A_TIMED_RESULT',
    sourceFingerprint:createHash('sha256').update(JSON.stringify({
      id,title:d.title,objective:d.objective,lesson
    })).digest('hex')});
 }
}
assert.equal(docs.length,274,'274 study days required');
assert.equal(docs.filter(x=>!newCodes.has(x.program)).length,247);
assert.equal(docs.filter(x=>newCodes.has(x.program)&&x.advancedSourceReady).length,27);
const sourceTotal=docs.filter(x=>x.advancedSourceReady).length;
const originalUpgraded=docs.filter(x=>!newCodes.has(x.program)&&x.advancedSourceReady).length;
assert(originalUpgraded>=80,'Risk60 D01-D60 and Charts45 D01-D20 must retain full advanced source; technical acceptance is independent');
const originalAuthored=docs.filter(x=>!newCodes.has(x.program)&&x.originalFieldAuthoring).length;
const summary={
 schema:'smfgu-academy-274-deep-source-v1',project:'The Stock Market: From the Ground Up',
 status:'SOURCE_PREFLIGHT_ONLY_NOT_INDEPENDENT_EDITORIAL_ACCEPTANCE',
 canonicalDays:274,originalDays:247,newDays:27,
 newDaysWithTwelveFormativeAndAdvanced:sourceTotal-originalUpgraded,
 originalDaysWithAdvancedPackage:originalUpgraded,
 originalDaysWithExistingOriginalCaseFields:originalAuthored,
 originalDaysStillMissingOriginalCaseFields:247-originalAuthored,
 allOriginalDaysStillNeedingNewTwelveQuestionAdvancedPackage:247-originalUpgraded,
 authoredNewFormative:docs.filter(x=>newCodes.has(x.program)).reduce((n,x)=>n+x.formativeCount,0),
 authoredNewAdvanced:docs.filter(x=>newCodes.has(x.program)).reduce((n,x)=>n+x.advancedCaseCount,0),
 gradedPrivateCasesApprovedByAudit:0,realMemberJourneysProvenByAudit:0,
 daysWithProvenThirtyToFortyFiveMinuteElapsedTime:0,
 groups:grouped,sourceRecords:docs,
 note:'A source-ready lesson is NOT independently editorial-reviewed, an actually timed learner session, a graded private assessment or evidence of cross-account isolation.'
};
assert.equal(summary.authoredNewFormative,324);
assert.equal(summary.authoredNewAdvanced,45);
mkdirSync('artifacts',{recursive:true});
writeFileSync('artifacts/academy-274-advanced-source-readiness-v1.json',JSON.stringify(summary,null,2)+'\n');
console.log('PASS 274 canonical Academy days; strict advanced-source package '+sourceTotal+'/274; '+
 '27 new days 324 formative questions 45 advanced cases; '+originalUpgraded+' original advanced packages; original individually authored fields '+
 originalAuthored+'/247, original full advanced package not yet signed off; ZERO official grades.');
