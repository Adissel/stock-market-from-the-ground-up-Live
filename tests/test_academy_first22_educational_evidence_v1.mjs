/* SMFGU-ACADEMY-EDU-22-QA-001
 * Deterministic evidence tests, not independent editorial certification,
 * member/browser QA, historical-data verification or protected grading.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {first22DayLessons,approvedB01Supplements,FIRST22_REFERENCE} from '../functions/_lib/academy-first22-teaching-v1.js';

const expected={truth5:5,watchlist7:7,scanners10:10};
const original=academyPrograms.slice(0,7);
assert.deepEqual(Object.fromEntries(original.slice(0,3).map(p=>[p.code,p.days])),expected);
assert.equal(original.reduce((total,p)=>total+p.days,0),247);
assert.equal(academyPrograms.reduce((total,p)=>total+p.days,0),274);
assert.deepEqual(FIRST22_REFERENCE,expected);
assert.deepEqual(Object.keys(approvedB01Supplements).sort(),['1','3','4']);
const qa=readFileSync(new URL('../docs/research/stockstotrade/252_instruction_source_field_QA_v2.csv',import.meta.url),'utf8');
const reviewRows=qa.split(/\r?\n/).slice(1).filter(row=>/^(?:"?)(?:truth5|watchlist7|scanners10)(?:"?),/.test(row));
assert.equal(reviewRows.length,22,'All first-22 canonical rows must remain identifiable');
for(const row of reviewRows){
 assert(row.includes('NOT_ACCEPTED'),'No unit may be certified by a purely technical regression test: '+row);
}
for(const day of original[0].curriculum){
 assert.equal(day.officiallyGraded,false);
 assert.equal(day.masteryAwarded,false);
 assert(day.lesson?.explanation?.length>120);
 assert(day.lesson?.investigation?.includes('FICTIONAL INDEPENDENT'));
}
const compute=(op,values)=>{
 switch(op){
  case 'subtract':return values[0]-values[1];
  case 'sum':return values.reduce((a,b)=>a+b,0);
  case 'average':return values.reduce((a,b)=>a+b,0)/values.length;
  case 'ratio':return values[0]/values[1];
  case 'ratioPercent':return 100*values[0]/values[1];
  default:throw Error('Unsupported arithmetic operation: '+op);
 }
};
let numerical=0,scoped=0;
const seenQuestions=new Set();
for(const code of ['watchlist7','scanners10']){
 const program=original.find(p=>p.code===code);
 const authored=first22DayLessons[code];
 assert.equal(authored.length,expected[code]);
 assert.equal(program.curriculum.length,authored.length);
 for(let i=0;i<authored.length;i++){
  const lesson=authored[i],day=program.curriculum[i],id=code+':'+(i+1);
  assert.equal(day.title,lesson.title,'Canonical day identity drift: '+id);
  if(code==='watchlist7'){
   // Keep every frozen original field, with no promotion of the additive ungraded overlay.
   for(const [key,value] of Object.entries(lesson))
    assert.strictEqual(day.lesson[key],value,'Original first-22 case field changed: '+id+' '+key);
   assert.equal(day.lesson.supplementarySourceStatus,
    'ORIGINAL_WATCHLIST7_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING');
  }else{
   assert.strictEqual(day.lesson,lesson,'Academy runtime must use this original case: '+id);
  }
  assert.equal(day.officiallyGraded,false);
  assert.equal(day.masteryAwarded,false);
  assert.equal(day.sourceStatus,code==='watchlist7'
   ?'original_watchlist7_advanced_source_authored_technical_acceptance_pending'
   :'original_day_specific_ungraded_independent_review_pending');
  for(const key of ['explanation','workedExample','reviewGuide','transfer','investigation','selfCheck','whenNot']){
   assert.equal(typeof lesson[key],'string','Missing '+key+' in '+id);
   assert(lesson[key].length>=45,'Trivial '+key+' in '+id);
  }
  assert(lesson.workedExample.startsWith('FICTIONAL TRAINING CASE'));
  assert(lesson.investigation.startsWith('FRESH FICTIONAL TRANSFER CASE'));
  assert(lesson.sourceProcedure.length>=3,'No day-specific method: '+id);
  assert(lesson.selfCheck.startsWith('FICTIONAL:'),'Day-specific checkpoint missing: '+id);
  assert(!seenQuestions.has(lesson.selfCheck),'Reused formative checkpoint: '+id);
  seenQuestions.add(lesson.selfCheck);
  assert(lesson.reference.url.startsWith('https://www.investor.gov/')||lesson.reference.url.startsWith('https://www.sec.gov/'));
  assert.equal(lesson.status,'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
  for(const check of lesson.numericChecks){
   numerical++;
   const actual=compute(check.operation,check.inputs);
   assert(check.inputs.every(Number.isFinite),'Non-numeric input '+id);
   assert(Number.isFinite(actual)&&Number.isFinite(check.expected),'Undefined arithmetic: '+id);
   assert(Math.abs(actual-check.expected)<=check.tolerance+1e-10,'Incorrect '+id+' '+check.operation);
   assert(check.unit?.length>0,'Missing quantity unit: '+id);
  }
  scoped++;
 }
}
assert.equal(scoped,17);
assert(numerical>=10,'Expected reviewed arithmetic expressions');
assert.equal(seenQuestions.size,17);
console.log('PASS first-22 evidence contracts: 5 frozen B01 days, 17 unique formative checks, '+numerical+' checked arithmetic expressions; all 22 remain unaccepted for independent editorial/mastery purposes');
