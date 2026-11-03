// Validate the compiled Foundation Batch25–30 internal source-evidence register.
// This is not a grant of independent editorial, usage rights, or commercial release.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const audit=read('data/talia-foundation-batches25-30-review-evidence-v1.json');
const current=[25,26,27,28,29,30].flatMap(n=>read('data/talia-foundation-explanations-batch'+n+'-v1.json').guides);
const guards=[
 'tests/talia-foundation-batches25-26-scenario-math-v1.test.mjs',
 'tests/talia-foundation-batches27-28-scenario-math-v1.test.mjs',
 'tests/talia-foundation-batches29-30-scenario-math-v1.test.mjs'
];
test('Evidence register tracks exactly 120 current fictional source lessons and immutable rights/editorial hold',()=>{
 assert.equal(audit.records.length,120);
 assert.equal(current.length,120);
 assert.equal(new Set(audit.records.map(x=>x.code)).size,120);
 assert.equal(audit.counts.foundationDrafts,120);
 assert.equal(audit.counts.syntheticWorkedExamples,120);
 assert.equal(audit.counts.sourcePointersPresent,120);
 for(const [i,g] of current.entries()){
  const e=audit.records[i];
  assert.equal(e.ordinal,481+i);
  assert.equal(e.code,g.code);
  assert.equal(e.title,g.title);
  assert.equal(e.fictionalWorkedCase,g.workedCase);
  assert.deepEqual(e.sourceUrls,g.sourceUrls);
  assert.equal(e.sourceRightsStatus,g.sourceRightsStatus);
  assert.equal(e.sourceResearchTriageStatus,g.sourceResearchTriage?.classification||'NOT_YET_REGISTERED');
  assert.equal(e.editorialApproved,false);
  assert.equal(e.sourceRightsCleared,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
  assert.ok(guards.includes(e.syntheticMathScenarioGuard));
 }
});
test('Evidence register reconciles 120 scoped but independently unapproved source references',()=>{
 const withTriage=current.filter(x=>!!x.sourceResearchTriage).length;
 const noTriage=current.length-withTriage;
 assert.equal(audit.counts.sourceResearchTriageObjects,withTriage);
 assert.equal(audit.counts.sourceResearchTriageMissing,noTriage);
 assert.equal(withTriage,120);
 assert.equal(noTriage,0);
 assert.equal(audit.counts.independentEditorialApproved,0);
 assert.equal(audit.counts.sourceRightsCleared,0);
 assert.match(audit.status,/NOT_EDITORIAL_OR_COMMERCIAL_RELEASE/);
 assert.ok(audit.unresolvedGates.length>=5);
 assert.ok(audit.externalMethodologySpotChecks.every(x=>x.publicationApproval===false));
 assert.ok(audit.records.every(x=>x.fictionalWorkedCase.startsWith('FICTIONAL:')));
});
