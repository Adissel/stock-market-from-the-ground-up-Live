// Seven-priority Tutor batch 021: source evidence only, not release acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TALIA_PREMIUM_RESEARCH_RELEASED,draftAdvancedGapSequence,draftProfessionalCloseDebrief,draftEnterpriseProvenance,draftEnterpriseClaimCitationIndex} from '../functions/_lib/talia-tier-research-contracts-v1.js';
const load=p=>JSON.parse(readFileSync('data/'+p,'utf8'));
const batches=Array.from({length:30},(_,i)=>load('talia-foundation-explanations-batch'+String(i+1).padStart(2,'0')+'-v1.json'));
const all=batches.flatMap(b=>b.guides);
const sources=load('talia-claims-101-140-evidence-batch-v1.json');
const secondary=load('talia-claims-remaining21-source-review-v1.json');
const indicators=[...load('tutor-indicator-study-v1.json').guides,...load('tutor-indicator-expansion-v1.json').guides];
const restricted=load('talia-indicators61-73-evidence-v1.json');
for(let n=0;n<30;n++)test('Foundation batch '+String(n+1).padStart(2,'0')+': 20 ungraded sourced lessons',()=>{
 const b=batches[n];assert.equal(b.guides.length,20);
 const ids=new Set(),titles=new Set();
 for(const g of b.guides){
  assert.match(g.code,/^TALIA_TOPIC_[A-Z0-9_]+$/);
  assert.ok(!ids.has(g.code));ids.add(g.code);
  assert.ok(!titles.has(g.title.toLowerCase()));titles.add(g.title.toLowerCase());
  for(const f of ['title','concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
   assert.ok(typeof g[f]==='string'&&g[f].trim().length>=(f==='title'?4:12),g.code+' '+f);
  assert.match(g.workedCase,/^FICTIONAL:/i);
  assert.ok(Array.isArray(g.sourceUrls)&&g.sourceUrls.length>0);
  for(const url of g.sourceUrls)assert.match(url,/^https:\/\//);
  assert.equal(g.foundationTopic,true);assert.equal(g.supplemental,true);assert.equal(g.officialCompetency,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.match(g.status,/pending_independent_editorial_review/);
  assert.equal(Object.hasOwn(g,'privateRubric'),false);assert.equal(Object.hasOwn(g,'correctAnswer'),false);
 }
});
test('600 distinct original topics exist but none is independently editorially accepted',()=>{
 assert.equal(all.length,600);
 assert.equal(new Set(all.map(g=>g.code)).size,600);
 assert.equal(new Set(all.map(g=>g.title.trim().toLowerCase())).size,600);
 assert.equal(all.filter(g=>g.independentEditorialApproved).length,0);
});
test('P2 forty claim dispositions and two source registers are aligned without publishing',()=>{
 assert.equal(sources.rows.length,40);assert.equal(secondary.items.length,21);
 for(const row of sources.rows){
  const lesson=all[row.number-1];
  assert.equal(lesson.code,row.code);
  assert.equal(lesson.sourceUrls[0],row.source);
  assert.equal(row.independentPublicationApproved,false);
 }
 for(const n of [103,122]){
  const r=sources.rows[n-101],v=secondary.items.find(x=>x.number===n);
  assert.equal(v.source,r.source);assert.equal(v.independentPublicationAccepted,false);
  assert.match(v.priorSourceResearchCandidate,/^https:\/\//);
 }
});
test('P3 SCTR and official VIX are not claimed as reproduced numeric indicators',()=>{
 assert.equal(indicators.length,73);
 assert.equal(new Set(indicators.map(g=>g.code)).size,73);
 assert.equal(indicators[54].code,'STUDY_SCTR');
 assert.equal(indicators[60].code,'STUDY_VIX_CONTEXT');
 assert.match(indicators[54].formula,/Proprietary/);
 assert.match(indicators[60].formula,/Index-specific/);
 assert.equal(restricted.items.length,13);
 assert.equal(restricted.items[0].code,'STUDY_VIX_CONTEXT');
 assert.equal(restricted.items[0].numericalTestStatus,'NO_NUMERICAL_EMULATION_OFFICIAL_BENCHMARK');
 assert.equal(restricted.items.filter(x=>x.commercialRightsAccepted||x.chartStudioParityAccepted||x.independentPublicationApproved).length,0);
});
test('P5/P6 member-source tests are synthetic and premium editions remain gated',()=>{
 assert.equal(TALIA_PREMIUM_RESEARCH_RELEASED,false);
 const matrix=load('talia-master-capability-inventory-v1.json');
 for(const edition of ['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE'])assert.equal(matrix.editionReleaseAcceptance[edition],'OPEN');
 const synthetic=readFileSync('tests/talia-membership-history-matrix-v1.test.mjs','utf8');
 assert.match(synthetic,/synthetic-/);
});
test('P6 Advanced accepts verified summary-shaped gaps only without progress writes',()=>{
 const skills=[{code:'VWAP_CONTEXT',title:'VWAP'}];
 const evidence={ok:true,origin:'authenticated_competency_summary',skills:[{code:'VWAP_CONTEXT',status:'Learning',independentAssessments:2}]};
 const r=draftAdvancedGapSequence({skills,evidence,maxItems:1});
 assert.deepEqual(r.items.map(x=>x.code),['VWAP_CONTEXT']);
 assert.equal(r.memberProgressModified,false);assert.equal(r.officialGrade,false);
 assert.deepEqual(draftAdvancedGapSequence({skills,evidence:{...evidence,origin:'browser'},maxItems:1}).items,[]);
});
test('P6 Professional blocks unseen or uncompleted future candles',()=>{
 const bars=[{time:100,closeTime:160,completed:true,close:10},{time:160,closeTime:220,completed:true,close:11},{time:220,closeTime:280,completed:true,close:999}];
 const ok=draftProfessionalCloseDebrief({bars,revealedThrough:1,observationTime:220});
 assert.equal(ok.accepted,true);assert.equal(ok.priceChange,1);
 assert.equal(draftProfessionalCloseDebrief({bars,revealedThrough:2,observationTime:220}).accepted,false);
 assert.equal(draftProfessionalCloseDebrief({bars,revealedThrough:1,observationTime:190}).accepted,false);
});
test('P6 Enterprise prevents duplicate citation identity substitution',()=>{
 const s={id:'SEC-123',title:'Prior source',url:'https://www.sec.gov/a',publishedAt:50,rights:'public_reference_only',independentlyRightsChecked:true};
 const entries=[s,{...s,url:'https://example.com/altered'}, {...s,id:'SEC-456',publishedAt:500}];
 const r=draftEnterpriseProvenance({asOf:100,sources:entries});
 assert.deepEqual(r.citations.map(x=>x.id),['SEC-123']);
 assert.equal(r.citations[0].url,'https://www.sec.gov/a');
 assert.equal(r.modelTrained,false);assert.equal(r.licensedDataImported,false);
 const selected=draftEnterpriseClaimCitationIndex({asOf:100,sources:entries,requestedIds:['SEC-123','SEC-456']});
 assert.deepEqual(selected.citations.map(x=>x.id),['SEC-123']);
 assert.deepEqual(selected.evidenceGaps,['SEC-456']);
});
test('P1 Linux Pages build remains LF with repo policy',()=>{
 assert.equal(readFileSync('scripts/build-pages.sh').includes(13),false);
 assert.match(readFileSync('.gitattributes','utf8'),/^\*\.sh text eol=lf/m);
});
test('P7 twenty 261-280 source lessons remain original and unapproved',()=>{
 const batch=batches[13].guides;
 assert.equal(batch.length,20);assert.equal(new Set(batch.map(x=>x.code)).size,20);
 for(const g of batch){assert.equal(g.independentEditorialApproved,false);assert.equal(g.editorSourceReview?.independentPublicationAccepted,false);}
});
