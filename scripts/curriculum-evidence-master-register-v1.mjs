#!/usr/bin/env node
/** SMFGU-CURRICULUM-EVIDENCE-REGISTER-001 v1.0.
 * Deterministically project canonical content + publication holds into ONE
 * evidence register. Never maintain a second list of IDs; no protected data.
 * --write emits a private build-time register under docs/qa/generated (not
 * exported into public Pages data and not an authenticated endpoint).
 */
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const official=read('data/competency-lab-paths-v01499.json');
const ics=[...read('data/tutor-indicator-study-v1.json').guides,
 ...read('data/tutor-indicator-expansion-v1.json').guides];
const indicatorReview=read('data/talia-claim-triage-181-240-and-indicators-v1.json');
const forty=read('data/talia-claims-101-140-evidence-batch-v1.json');
const remaining21=read('data/talia-claims-remaining21-source-review-v1.json');
const fourth15=read('data/talia-indicators46-60-evidence-v1.json');
const final13=read('data/talia-indicators61-73-evidence-v1.json');
const claims181=indicatorReview.topics;
const stages={explanations:[],indicators:[],labs:[],academy:[]};
const knownTopics=[];
const batchNumbers=readdirSync(new URL('../data/',import.meta.url))
 .map(f=>/^talia-foundation-explanations-batch(\d{2})-v1\.json$/.exec(f))
 .filter(Boolean).map(x=>Number(x[1])).sort((a,b)=>a-b);
assert.ok(batchNumbers.length>=12&&batchNumbers.length<=30,'Expected 12-30 authored batches');
for(let i=0;i<batchNumbers.length;i++)assert.equal(batchNumbers[i],i+1,'Noncontiguous authored batch');
for(const n of batchNumbers){
 const b=read('data/talia-foundation-explanations-batch'+String(n).padStart(2,'0')+'-v1.json');
 assert.equal(b.guides.length,20,'Source batch drift '+n);
 knownTopics.push(...b.guides);
}
assert.equal(knownTopics.length,batchNumbers.length*20);
assert.equal(new Set(knownTopics.map(x=>x.code)).size,knownTopics.length);
assert.equal(forty.rows.length,40);
const check40=new Map(forty.rows.map(x=>[x.code,x]));
const check181=new Map(claims181.map(x=>[x.code,x]));
assert.equal(check40.size,40);assert.equal(check181.size,60);
assert.equal(remaining21.items.length,21);
const laterIds=new Set(remaining21.items.map(x=>x.number));
const prior19=forty.rows.filter(x=>!laterIds.has(x.number));
assert.equal(prior19.length,19);
const covered40=[...prior19.map(x=>x.number),...remaining21.items.map(x=>x.number)];
assert.equal(new Set(covered40).size,40,'duplicate source review identity');
assert.deepEqual(covered40.sort((a,b)=>a-b),Array.from({length:40},(_,i)=>i+101));
for(const item of remaining21.items){
 assert.equal(forty.rows[item.number-101]?.code,item.code);
 assert.equal(item.independentPublicationAccepted,false);
}
const remainingIndex=new Map(remaining21.items.map(x=>[x.number,x]));
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
  itemSourceDisposition:n>=101&&n<=140?(remainingIndex.get(n)?.review||'PRIOR_PRIMARY_PAGE_SCOPE_REVIEW'):null,
  fictionalUngraded:g?.supplemental===true&&g?.officialCompetency===false
 });
}
assert.equal(ics.length,73);assert.equal(indicatorReview.indicators.length,73);
assert.equal(fourth15.records.length,15);
assert.deepEqual(fourth15.records.map(x=>x.id),ics.slice(45,60).map(x=>x.code));
assert.equal(fourth15.records.filter(x=>x.publicationAccepted).length,0);
assert.equal(final13.items.length,13);
assert.deepEqual(final13.items.map(x=>x.code),ics.slice(60).map(x=>x.code));
assert.equal(final13.items.filter(x=>x.independentPublicationApproved).length,0);
assert.equal(final13.items.filter(x=>x.numericalTestStatus.startsWith('INDEPENDENT')).length,12);
assert.equal(new Set(ics.map(x=>x.code)).size,73);
stages.indicators=ics.map((g,i)=>{
 const r=indicatorReview.indicators[i];assert.equal(r.code,g.code);
 return {id:g.code,ordinal:i+1,title:g.title,formula:g.formula,
  sourceUrls:g.sourceUrls,review:'SOURCE_GUIDE_AUTHORED_FORMULA_RIGHTS_HOLD',
  crosscheck15:i<15?'JS_PYTHON_REFERENCE_TEST_CONFIGURED':
    i<30?'SECOND_15_COMPONENT_TEST_CONFIGURED':i<45?'THIRD_15_PYTHON_JS_CASE_TEST_CONFIGURED':i===54?'PROPRIETARY_SCTR_NOT_NUMERICALLY_ACCEPTED':i<60?'FOURTH_14_PYTHON_JS_CASE_CONFIGURED':i===60?'OFFICIAL_VIX_BENCHMARK_RESTRICTED':i<73?'FIFTH_12_PYTHON_JS_CASE_CONFIGURED':'NOT_IN_73_CANONICAL_GUIDES',
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
 totals:{all:1366,explanationTargets:600,explanationsAuthored:knownTopics.length,explanationsNotAuthored:600-knownTopics.length,
  indicators:73,indicatorGuidesAuthored:73,indicatorNumericCaseCoverage:71,indicatorProprietaryOrMethodologyHold:2,indicatorSourceBatchThrough:73,labIds:419,academyDayIds:274,
  fortyClaimScopeRows:40,fortySourceScopeDispositions:40,sourceScopeCorrections:[104,133],claimScope141to180:40,claimScope181to240:60,
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
