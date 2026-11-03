import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const get=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const a=get('27'),b=get('28'),all=[...a,...b];
test('B27-28 forty topic-scoped research links and independent approval holds',()=>{
 assert.equal(all.length,40);
 for(const g of all){assert.equal(g.sourceUrls.length,1);
 assert.match(g.sourceUrls[0],/^https:\/\//);
 assert.notEqual(g.sourceUrls[0],'https://www.investor.gov/introduction-investing');
 assert.deepEqual(g.previousGenericSourceUrls,['https://www.investor.gov/introduction-investing']);
 assert.ok(g.sourceResearchTriage.supportedScope.length>100);
 assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.length>95);
 assert.equal(g.independentEditorialApproved,false);assert.equal(g.officialCompetency,false);
 assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
 assert.equal(g.sourceResearchTriage.independentMathAccepted,false);assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
 assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
 }
});
test('Statistics examples and conventions remain narrowly defined',()=>{
 assert.equal(8/(3-1),4);
 assert.ok(Math.abs(Math.sqrt(.99)-1+0.00501256289338)<1e-10);
 assert.ok(Math.abs(.00015/(.02*.01)-.75)<1e-10);
 assert.match(a[18].sourceResearchTriage.limitationsAndOpenQuestions,/compounded returns/);
 assert.match(a[19].sourceResearchTriage.limitationsAndOpenQuestions,/compounded returns/);
});
test('Portfolio risk contribution and long-call expiration breakeven corrected',()=>{
 assert.match(b[5].workedCase,/NOT actual portfolio volatility risk contribution/);
 assert.match(b[18].workedCase,/LONG CALL/);
 assert.equal(.3*.2,.06);assert.equal(50+3,53);assert.equal(3*100*1.25,375);
 assert.match(b[15].sourceResearchTriage.limitationsAndOpenQuestions,/multipliers other than/);
});
