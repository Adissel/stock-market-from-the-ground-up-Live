/* SMFGU-ACADEMY-42-SENTENCE-AUDIT-001
 * Generate reviewer queue from source-current original lessons.
 * NO private answer keys, DB queries, member records, automated source
 * approval, or historical-trade authenticity claims. Reproducible on main.
 */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
const programs=Object.freeze({truth5:5,watchlist7:7,scanners10:10,foundations30:20});
const sourceFields=['explanation','workedExample','why','error','reviewGuide','selfCheck',
 'whenNot','transfer','investigation'];
const listed=['sourceProcedure','reviewPrompts'];
const q=s=>'"'+String(s??'').replaceAll('"','""')+'"';
const split=s=>String(s??'').trim().split(/(?<=[.!?])\s+(?=[A-Z"‘“(])/u).map(x=>x.trim()).filter(Boolean);
const entries=[],seenDays=new Set();
for(const [program,max] of Object.entries(programs)){
 const course=academyPrograms.find(p=>p.code===program);
 assert(course&&course.curriculum.length>=max,'Missing Academy program '+program);
 for(const day of course.curriculum.slice(0,max)){
  const key=program+':'+day.day;
  assert(day.lesson,'Missing lesson body '+key);
  assert(!seenDays.has(key),'Duplicate day '+key);
  seenDays.add(key);
  const l=day.lesson;
  const fields={...Object.fromEntries(sourceFields.map(f=>[f,l[f]]))};
  if(l.sourceClaimCase){
   fields.sourceReportedObservation=l.sourceClaimCase.observation;
   fields.sourceReportedLimitations=l.sourceClaimCase.limits;
   fields.sourceReportedQuestion=l.sourceClaimCase.question;
  }
  for(const [field,raw] of Object.entries(fields)){
   if(typeof raw!=='string'||!raw.trim())continue;
   for(const [i,claim] of split(raw).entries())
    entries.push({key,title:day.title,field,sequence:i+1,text:claim,
     classification:/fictional|synthetic/i.test(raw)?'SYNTHETIC_TEACHING_OR_TRANSFER':
      field.startsWith('sourceReported')?'PUBLISHER_REPORTED_NOT_INDEPENDENTLY_RECONCILED':
      'MATERIAL_EDUCATIONAL_ASSERTION',
     review:'PENDING_SENTENCE_LEVEL_AUTHORITY_AND_ARITHMETIC_CHECK'});
  }
  for(const field of listed)if(Array.isArray(l[field])){
   for(const [i,claim] of l[field].entries())if(typeof claim==='string'&&claim.trim())
    entries.push({key,title:day.title,field,sequence:i+1,text:claim,
     classification:'EDUCATIONAL_METHOD_STEP',
     review:'PENDING_SENTENCE_LEVEL_AUTHORITY_AND_ARITHMETIC_CHECK'});
  }
  assert(entries.filter(x=>x.key===key).length>=7,'Insufficient visible instructional material: '+key);
 }
}
assert.equal(seenDays.size,42);
assert(entries.length>=300,'Sentence claim inventory unexpectedly sparse');
assert(entries.every(x=>!/(answer_key|grader_secret|correct_choice|private_rubric)/i.test(x.text)),
 'Private assessment material must never enter the source claim inventory');
const headers=['day_key','canonical_title','source_field','sentence_order',
 'claim_or_instruction','claim_class','review_status','source_commit'];
mkdirSync('artifacts',{recursive:true});
const sha=process.env.GITHUB_SHA||'LOCAL_UNVERIFIED_HEAD';
const body=[headers.map(q).join(','),
 ...entries.map(x=>[x.key,x.title,x.field,x.sequence,x.text,x.classification,x.review,sha].map(q).join(','))].join('\n')+'\n';
writeFileSync('artifacts/bootcamp-first42-claim-inventory.csv',body);
writeFileSync('artifacts/bootcamp-first42-claim-inventory-manifest.json',
 JSON.stringify({project:'SMFGU',documentId:'SMFGU-ACADEMY-42-SENTENCE-AUDIT-001',
   generatedOn:'CI_AT_SOURCE_COMMIT',sourceCommit:sha,days:seenDays.size,
   records:entries.length,claimReviewStatus:'NONE_AUTO_APPROVED',
   independentProtectedAssessmentsApproved:0,editorialDecisions:0},null,2)+'\n');
console.log('PASS first-42 source claim inventory: '+entries.length+' sentences/steps across 42 canonical days; every item requires individual verification');
