import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const audit=read('data/talia-foundation-batches25-30-review-evidence-v1.json');
const research=read('data/talia-11-research-source-remediation-v1.json');
const guides=[29,30].flatMap(n=>read('data/talia-foundation-explanations-batch'+n+'-v1.json').guides);
test('All 11 context-only source pointers replaced with scoped candidates, no publication promotion',()=>{
 assert.equal(research.items.length,11);
 assert.deepEqual(research.items.map(x=>x.ordinal),[565,566,570,577,578,580,581,586,588,589,598]);
 assert.equal(audit.records.length,120);
 assert.equal(audit.sourceResearchRemediation.totalPreviouslyContextOnly,11);
 assert.equal(audit.sourceResearchRemediation.remediatedCandidatePointers,11);
 assert.equal(audit.sourceResearchRemediation.stillContextOnly,0);
 for(const item of research.items){
  const guide=guides.find(x=>x.code===item.code);
  const e=audit.records.find(x=>x.ordinal===item.ordinal);
  assert.ok(guide&&e,item.code);
  assert.deepEqual(guide.sourceUrls,item.researchCandidateUrls);
  assert.deepEqual(e.sourceUrls,item.researchCandidateUrls);
  assert.deepEqual(guide.sourceResearchTriage.priorContextOnlySourceUrls,item.previousSourceUrls);
  assert.equal(guide.sourceResearchTriage.classification,'SCOPED_CANDIDATE_PENDING_CLAIM_REVIEW');
  assert.equal(e.sourceResearchTriageStatus,guide.sourceResearchTriage.classification);
  assert.equal(guide.independentEditorialApproved,false);
  assert.equal(guide.editorSourceReview.independentPublicationAccepted,false);
  assert.equal(guide.sourceResearchTriage.sourceRedistributionRightsCleared,false);
  assert.equal(guide.sourceResearchTriage.independentMathAccepted,false);
  assert.ok(guide.sourceResearchTriage.limitationsAndOpenQuestions.length>60);
  assert.ok(guide.sourceUrls.every(x=>new URL(x).protocol==='https:'));
  assert.ok(e.fictionalWorkedCase.startsWith('FICTIONAL:'));
 }
 assert.equal(audit.counts.independentEditorialApproved,0);
 assert.equal(audit.counts.sourceRightsCleared,0);
});
test('Risk of ruin candidate explicitly avoids equating expectancy with ruin probability',()=>{
 const x=research.items.find(x=>x.ordinal===581);
 assert.match(x.limitations,/not a numerical risk-of-ruin probability/i);
});
test('Case text remains canonical and authored milestones are not falsely advanced',()=>{
 for(const x of research.items){
  const g=guides.find(z=>z.code===x.code),e=audit.records.find(z=>z.code===x.code);
  assert.equal(g.workedCase,e.fictionalWorkedCase);
  assert.equal(g.officialCompetency,false);
  assert.equal(g.foundationTopic,true);
  assert.match(g.status,/pending_independent_editorial_review/);
 }
});
