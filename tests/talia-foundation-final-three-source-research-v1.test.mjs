import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const records=[...load('06'),...load('10')],codes=['TALIA_TOPIC_DIVIDEND_CASH_VS_RETURN','TALIA_TOPIC_REPLAY_SPLIT_ADJUSTMENT','TALIA_TOPIC_REPLAY_CORPORATE_EVENT_TIMING'];
const lessons=codes.map(code=>records.find(g=>g.code===code));
test('The last three generic sources have targeted corporate-action and data-normalization references',()=>{
 for(const g of lessons){assert.ok(g,g?.code);assert.ok(g.sourceUrls.length>=1&&g.sourceUrls.length<=2);
  assert.ok(g.sourceUrls.every(u=>u.startsWith('https://www.quantconnect.com/docs/')));
  assert.ok(['https://www.investor.gov/introduction-investing','https://www.sec.gov/edgar/search/'].includes(g.previousGenericSourceUrl));
  assert.ok(g.sourceResearchTriage.supportedScope.length>120);assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.length>120);
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
  assert.equal(g.officialCompetency,false);assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
 }
});
test('Dividends must not be counted twice on total-return-adjusted bars',()=>{
 const g=lessons[0];assert.equal(g.sourceScopeReview.primaryPageScopeChecked,false);
 assert.ok(Math.abs(((39-40+1.5)/40)*100-1.25)<1e-12);
 assert.ok(Math.abs(((39-40)/40)*100+2.5)<1e-12);
 assert.match(g.sourceResearchTriage.limitationsAndOpenQuestions,/Do not count cash a second time/);
});
test('Corporate-action event types, price normalization and 2-for-1 adjustment are distinct',()=>{
 assert.equal(10*2,20);assert.equal(40/2,20);assert.equal(10*40,20*20);
 assert.match(lessons[1].commonError,/Mixing a retrospectively split-adjusted chart price/);
 assert.match(lessons[2].commonError,/not yet effective split terms/);
 assert.match(lessons[2].reviewExplanation,/effective July 1/);
});
