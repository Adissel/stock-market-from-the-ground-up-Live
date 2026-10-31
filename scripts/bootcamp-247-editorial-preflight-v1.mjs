#!/usr/bin/env node
/* SMFGU-BC-247-ACCEPTANCE-V1. Deterministic, nonapproving authoring queue.
 * Outputs are reports, not member state or official editorial decisions.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {FIRST22_REFERENCE} from '../functions/_lib/academy-first22-teaching-v1.js';
const programCodes=['truth5','watchlist7','scanners10','foundations30','charts45','risk60','practicum90'];
const expected=[5,7,10,30,45,60,90], programs=programCodes.map(c=>academyPrograms.find(p=>p.code===c));
const fail=m=>{throw new Error('STOP: '+m)};
if(programs.some((p,i)=>!p||p.days!==expected[i]))fail('canonical seven-course identity or length drift');
if(programs.reduce((n,p)=>n+p.curriculum.length,0)!==247)fail('247-day source inventory changed');
if(Object.entries(FIRST22_REFERENCE).map(([,v])=>v).join(',')!=='5,7,10')fail('reference-batch scope changed');
const escape=v=>'"'+String(v??'').replace(/"/g,'""').replace(/\r?\n/g,' ')+'"';
const hashes=new Set(),rows=[],batchIndex={};
for(const p of programs){
 for(const d of p.curriculum){
  const id=p.code+':'+d.day;
  if(hashes.has(id))fail('duplicate day ID '+id);hashes.add(id);
  if(!d.title||!d.objective||!d.observe||!d.practice||d.officiallyGraded!==false||d.masteryAwarded!==false)fail('invalid canonical subject or unapproved mastery '+id);
  const n=rows.length,first=n<22,batch=first?'REFERENCE-01':'PARENT-'+String(Math.floor((n-22)/20)+2).padStart(2,'0');
  const authored=Boolean(d.lesson?.explanation&&d.lesson?.workedExample&&d.lesson?.sourceProcedure?.length&&d.lesson?.transfer&&d.lesson?.reviewGuide);
  if(first&&!authored)fail('reference day lacks individually authored teaching '+id);
  const digest=createHash('sha256').update(JSON.stringify({id,title:d.title,objective:d.objective,observe:d.observe,practice:d.practice,lesson:d.lesson||null})).digest('hex');
  const numeric=Array.isArray(d.lesson?.numericChecks)?d.lesson.numericChecks.length:0;
  const parts=[id,p.code,d.day,d.title,d.sourceDay??'',batch,authored?'YES_SOURCE_FIELD':'NO',
    first?'REFERENCE_AUTHORED_NOT_APPROVED':'PARENT_DERIVED_NOT_APPROVED',numeric,
    'NOT_VERIFIED_CLAIM_BY_CLAIM','NOT_REVIEWED_PROTECTED_ASSESSMENT','NOT_REVIEWED_INDEPENDENT_EDITOR','NOT_ACCEPTED',
    first?'Independently inspect actual day teaching, calculation, counterexample and transfer; preserve B01 frozen scope.':
     'Author distinct evidence-linked lesson for THIS day, not generic parent tabs; verify numerical case and source claim.',
    digest];
  rows.push(parts);(batchIndex[batch]||=[]).push(id);
 }
}
if(rows.length!==247||Object.keys(batchIndex).length!==13||batchIndex['REFERENCE-01'].length!==22)fail('unexpected batch manifest');
const out=path.resolve('artifacts');
fs.mkdirSync(out,{recursive:true});
const cols=['canonical_day_id','program_code','day_number','day_title','source_day','work_batch',
 'individually_authored_fields','authoring_status','numeric_check_count','source_claim_review','protected_assessment_review',
 'independent_editorial_review','acceptance_status','required_next_action','content_sha256'];
fs.writeFileSync(path.join(out,'bootcamp-247-editorial-queue.csv'),[cols.map(escape).join(','),...rows.map(x=>x.map(escape).join(','))].join('\n')+'\n');
const manifest={schema:'smfgu-bootcamp-247-v1',date:'2026-10-31',status:'PARTIAL_AUTHORING_NO_EDITORIAL_APPROVAL',
 lockedPrograms:programCodes,registeredDays:247,referenceBatch:22,parentDerivedQueue:225,
 approvedByThisScript:0,protectedAssessmentsApprovedByThisScript:0,
 additionalDraftDaysOutsideScope:27,batches:Object.fromEntries(Object.entries(batchIndex).map(([k,v])=>[k,{count:v.length,dayIds:v}])),
 note:'Topic-level citations and code tests never satisfy individual source verification, independent assessment or reviewer acceptance.'};
fs.writeFileSync(path.join(out,'bootcamp-247-batch-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('PASS 247 canonical days: 22 reference authored; 225 parent-day candidates in 12 follow-on batches; ZERO approved by automation.');
