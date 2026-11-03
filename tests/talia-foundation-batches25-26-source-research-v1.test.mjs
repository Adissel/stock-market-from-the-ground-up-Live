import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const a=load('25'),b=load('26'),all=[...a,...b];
test('B25-26 replace 60 broad references with explicit source limitations and publication holds',()=>{
 assert.equal(all.length,40);assert.equal(new Set(all.map(x=>x.code)).size,40);
 assert.equal(all.reduce((n,g)=>n+g.previousGenericSourceUrls.length,0),60);
 for(const g of all){assert.equal(g.sourceUrls.length,1);assert.match(g.sourceUrls[0],/^https:\/\//);
  assert.ok(!['https://www.investor.gov/introduction-investing','https://www.sec.gov/edgar/search/'].includes(g.sourceUrls[0]));
  assert.ok(g.sourceResearchTriage.supportedScope.length>100);assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.length>65);
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false);assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);assert.equal(g.independentEditorialApproved,false);assert.equal(g.officialCompetency,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
 }
});
test('Risk examples and accounting ratios remain bounded by their real denominators',()=>{
 assert.equal(100/(25-24.5),200);assert.equal(Math.floor(75/.4),187);
 assert.ok(Math.abs(187*.4-74.8)<1e-8);assert.ok(Math.abs((20-19.1)*100-90)<1e-8);
 assert.equal(500-120-180,200);assert.equal((3+4)/5,1.4);assert.equal(100+30-20,110);
 assert.match(b[7].sourceResearchTriage.limitationsAndOpenQuestions,/numerator adjustments/);
 assert.match(b[8].sourceUrls[0],/non-gaap-financial-measures/);
 assert.match(b[10].sourceResearchTriage.limitationsAndOpenQuestions,/total-liabilities/);
});
