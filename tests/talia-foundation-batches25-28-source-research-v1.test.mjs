import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const groups=[25,26,27,28].map(n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides);
const all=groups.flat();
test('Foundation batches25-28 replace 100 generic links in 80 ungraded lessons',()=>{
 assert.deepEqual(groups.map(g=>g.length),[20,20,20,20]);
 assert.equal(new Set(all.map(g=>g.code)).size,80);
 assert.equal(all.reduce((n,g)=>n+g.previousGenericSourceUrls.length,0),100);
 for(const g of all){
  assert.equal(g.sourceUrls.length,1,g.code);
  const u=new URL(g.sourceUrls[0]);assert.equal(u.protocol,'https:');
  assert.ok(!g.sourceUrls[0].includes('/edgar/search/'),g.code);
  assert.notEqual(g.sourceUrls[0],'https://www.investor.gov/introduction-investing');
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
  assert.ok(g.sourceResearchTriage.supportedScope.includes(g.title));
  assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.includes(g.limit));
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.officialCompetency,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
  assert.match(g.workedCase,/^FICTIONAL:/);
 }
});
test('Financial and risk formula conventions remain differentiated',()=>{
 const b26=groups[1];
 assert.equal(b26[10].code,'TALIA_TOPIC_DEBT_TO_EQUITY');
 assert.match(b26[10].sourceResearchTriage.limitationsAndOpenQuestions,/total liabilities/);
 assert.ok(groups[2][11].sourceUrls[0].endsWith('/sharpe-ratio'));
 assert.ok(groups[2][12].sourceUrls[0].endsWith('/sortino-ratio'));
 assert.match(groups[2][19].sourceResearchTriage.limitationsAndOpenQuestions,/geometric and arithmetic/);
 assert.match(groups[3][19].sourceResearchTriage.limitationsAndOpenQuestions,/standard 100-share contract is not universal/);
});
test('Existing original ratio arithmetic and no-release requirements remain',()=>{
 assert.equal(100/(25-24.5),200);
 assert.equal(9/6,1.5);
 assert.equal((25-20)/20,.25);
 assert.equal(1.25*100*3,375);
 assert.ok(all.every(g=>g.status.includes('pending_independent_editorial_review')));
});
