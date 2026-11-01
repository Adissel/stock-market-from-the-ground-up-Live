#!/usr/bin/env node
/** SMFGU-CURRICULUM-EVIDENCE-REGISTER-001 v1.0.
 * Deterministically project canonical content + publication holds into ONE
 * evidence register. Never maintain a second list of IDs; no protected data.
 * --write emits a private build-time register under docs/qa/generated (not
 * exported into public Pages data and not an authenticated endpoint).
 */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const official=read('data/competency-lab-paths-v01499.json');
const ics=[...read('data/tutor-indicator-study-v1.json').guides,
 ...read('data/tutor-indicator-expansion-v1.json').guides];
const indicatorReview=read('data/talia-claim-triage-181-240-and-indicators-v1.json');
const forty=read('data/talia-claims-101-140-evidence-batch-v1.json');
const claims181=indicatorReview.topics;
const stages={explanations:[],indicators:[],labs:[],academy:[]};
const knownTopics=[];
for(let n=1;n<=12;n++){
 const b=read('data/talia-foundation-explanations-batch'+String(n).padStart(2,'0')+'-v1.json');
 assert.equal(b.guides.length,20,'Source batch drift '+n);
 knownTopics.push(...b.guides);
}
assert.equal(knownTopics.length,240);
assert.equal(new Set(knownTopics.map(x=>x.code)).size,240);
assert.equal(forty.rows.length,40);
const check40=new Map(forty.rows.map(x=>[x.code,x]));
const check181=new Map(claims181.map(x=>[x.code,x]));
assert.equal(check40.size,40);assert.equal(check181.size,60);
for(let n=1;n<=600;n++){
 const g=knownTopics[n-1];
 const identified=g?check40.get(g.code)||check181.get(g.code):null;
 const audit=identified?(n<=140?'STRUCTURE_AND_SOURCE_SCOPE_CHECKED_RELEASE_HOLD':'CLAIM_TRIAGED_RELEASE_HOLD'):
   n>=141&&n<=180?'SOURCE_SCOPE_TRIAGED_IN_PRIOR_DOCUMENT_RELEASE_HOLD':
   g?'AUTHORED_SOURCE_ONLY':'NOT_YET_SOURCE_AUTHORED';
 stages.explanations.push({
  id:'TALIA-FOUNDATION-'+String(n).padStart(3,'0'),ordinal:n,
  canonicalTopicCode:g?.code??null,title:g?.title??null,
  authored:!!g,sourceBatch:g?Math.ceil(n/20):null,
  researchUrl:g?.sourceUrls?.[0]??null,sourceScope:audit,
  evidenceSource:identified?n<=140?
    'data/talia-claims-101-140-evidence-batch-v1.json':
    'data/talia-claim-triage-181-240-and-indicators-v1.json':
    n>=141&&n<=180?'docs/qa/2026-11-01_TALIA_FOUNDATION_EXECUTION_010_v1.md':null,
  independentPublicationAccepted:false,dataRightsAccepted:false,
  fictionalUngraded:g?.supplemental===true&&g?.officialCompetency===false
 });
}
assert.equal(ics.length,73);assert.equal(indicatorReview.indicators.length,73);
assert.equal(new Set(ics.map(x=>x.code)).size,73);
stages.indicators=ics.map((g,i)=>{
 const r=indicatorReview.indicators[i];assert.equal(r.code,g.code);
 return {id:g.code,ordinal:i+1,title:g.title,formula:g.formula,
  sourceUrls:g.sourceUrls,review:'SOURCE_GUIDE_AUTHORED_FORMULA_RIGHTS_HOLD',
  crosscheck15:i<15?'JS_PYTHON_REFERENCE_TEST_CONFIGURED':'NOT_IN_15_CROSSCHECK_BATCH',
  independentlyReleased:false,formulaRightsAccepted:false};
});
const ids=Object.keys(official.byLab||{});
assert.equal(ids.length,419);
stages.labs=ids.map(id=>{
 const lab=official.byLab[id];
 return {id,code:id,title:lab.title,bookCode:lab.bookCode??null,
  relatedCompetencies:lab.relatedCompetencies||[],
  source:'data/competency-lab-paths-v01499.json',
  status:'CANONICAL_ID_PROVISIONAL_TEACHING_CROSSWALK',
  independentCurriculumAccepted:false,protectedGradeAccepted:false};
});
assert.equal(academyPrograms.length,10);
assert.equal(academyPrograms.reduce((n,p)=>n+p.days,0),274);
stages.academy=academyPrograms.flatMap(program=>{
 assert.equal(program.curriculum.length,program.days,program.code);
 return program.curriculum.map((day,i)=>({
  id:program.code+':DAY-'+String(day.day??(i+1)).padStart(3,'0'),
  programCode:program.code,dayNumber:day.day??i+1,title:day.title??null,
  source:'functions/_lib/bootcamp-academy-v014168.js',
  status:'CANONICAL_ACADEMY_DAY_SOURCE_NOT_INDEPENDENTLY_ACCEPTED',
  independentCurriculumAccepted:false,memberAcceptance:false
 }));
});
for(const [category,entries] of Object.entries(stages)){
 assert.equal(new Set(entries.map(x=>x.id)).size,entries.length,'duplicate canonical '+category);
}
const total=Object.values(stages).reduce((a,x)=>a+x.length,0);
assert.equal(total,1366);
const summary={version:'1.0',documentId:'SMFGU-CURRICULUM-EVIDENCE-REGISTER-001',
 generatedFrom:'GitHub main canonical files; read-only source-only projection',
 date:'2026-11-01',status:'DEVELOPMENT_EVIDENCE_NOT_MEMBER_RELEASE_ACCEPTANCE',
 totals:{all:1366,explanationTargets:600,explanationsAuthored:240,explanationsNotAuthored:360,
  indicators:73,indicatorGuidesAuthored:73,labIds:419,academyDayIds:274,
  fortyClaimScopeRows:40,claimScope141to180:40,claimScope181to240:60,
  verifiedPublications:0,matchedPremiumReleaseClaims:0},
 references:{researchDirectory:'docs/research/master/master-source-registry-v1.json',
  labs:'data/competency-lab-paths-v01499.json',
  academy:'functions/_lib/bootcamp-academy-v014168.js',
  studies:'data/tutor-indicator-study-v1.json + tutor-indicator-expansion-v1.json'},
 stages};
if(process.argv.includes('--write')){
 const filename=new URL('../docs/qa/generated/SMFGU-CURRICULUM-EVIDENCE-REGISTER-001.json',import.meta.url);
 mkdirSync(new URL('../docs/qa/generated/',import.meta.url),{recursive:true});
 writeFileSync(filename,JSON.stringify(summary,null,2)+'\n');
}
console.log('SMFGU evidence register: '+JSON.stringify(summary.totals));
