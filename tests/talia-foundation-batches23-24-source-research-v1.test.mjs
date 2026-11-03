import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const a=read('23'),b=read('24'),all=[...a,...b];
test('Batch23-24 forty contextual references preserve all release boundaries',()=>{
 assert.deepEqual([a.length,b.length],[20,20]);assert.equal(new Set(all.map(x=>x.code)).size,40);
 for(const g of all){assert.equal(g.previousGenericSourceUrl,'https://www.investor.gov/introduction-investing');assert.equal(g.sourceUrls.length,1);
  assert.ok(g.sourceUrls[0].startsWith('https://'));assert.notEqual(g.sourceUrls[0],g.previousGenericSourceUrl);
  assert.ok(g.sourceResearchTriage.supportedScope.length>65);assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.length>65);
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false);assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);assert.equal(g.independentEditorialApproved,false);assert.equal(g.officialCompetency,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
 }
});
test('Journal-specific process and scanner citations are not represented as regulatory endorsement',()=>{
 assert.match(a[17].sourceResearchTriage.limitationsAndOpenQuestions,/internal SMFGU rules/);
 assert.match(a[18].sourceResearchTriage.limitationsAndOpenQuestions,/internal/);
 assert.match(b[2].sourceResearchTriage.limitationsAndOpenQuestions,/not the SEC public-float calculation/);
 assert.match(b[12].sourceResearchTriage.limitationsAndOpenQuestions,/authored rubric/);
});
test('Breadth with zero declines has a safe undefined state and fixed earlier ratio',()=>{
 const g=b[16];assert.match(g.workedCase,/0 declines/);assert.match(g.workedCase,/undefined/);
 assert.equal(300/200,1.5);assert.equal(Number.isFinite(300/0),false);assert.equal(g.independentEditorialApproved,false);
});
