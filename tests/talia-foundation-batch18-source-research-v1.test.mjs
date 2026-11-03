import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const guides=JSON.parse(readFileSync('data/talia-foundation-explanations-batch18-v1.json','utf8')).guides;
test('Batch18 20 sources are claim-scoped and retain all editorial holds',()=>{
 assert.equal(guides.length,20);
 for(const g of guides){
  assert.equal(g.previousGenericSourceUrl,'https://www.investor.gov/introduction-investing');
  assert.ok(g.sourceUrls[0].startsWith('https://'));
  assert.notEqual(g.sourceUrls[0],g.previousGenericSourceUrl);
  assert.ok(g.sourceResearchTriage.supportedScope.length>55);
  assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.length>65);
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.officialCompetency,false);
 }
});
test('original risk/candles/order book math is descriptive only',()=>{
 assert.equal(.8*2*50,80);
 assert.equal(Math.floor(100/(2*.6)),83);
 assert.ok(Math.abs((20.1-20)/20*10000-50)<1e-9);
 assert.equal(120000/80000,1.5);
 assert.ok(Math.abs((50.6-50)/50-.012)<1e-9);
 assert.ok(Math.abs((10.6-10)/(11-9)-.3)<1e-9);
 assert.equal((3000-1000)/(3000+1000),.5);
 assert.equal(300/500,.6);
 assert.equal((50+100+150+100)/4,100);
 assert.match(guides[13].sourceResearchTriage.limitationsAndOpenQuestions,/not the StockCharts EMV formula/);
 assert.match(guides[16].sourceResearchTriage.limitationsAndOpenQuestions,/not a standardized market-wide predictive indicator/);
 assert.match(guides[19].sourceResearchTriage.limitationsAndOpenQuestions,/mutual funds, not probabilities/);
});
test('no live executions, paid model or release acceptance can be inferred',()=>{
 assert.ok(guides.every(g=>!g.independentEditorialApproved));
 assert.ok(guides.every(g=>g.sourceResearchTriage.classification.length>12));
 assert.ok(guides.every(g=>!g.sourceResearchTriage.independentPublicationApproved));
});
