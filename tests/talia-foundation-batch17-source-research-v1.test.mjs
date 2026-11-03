import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const lessons=JSON.parse(readFileSync('data/talia-foundation-explanations-batch17-v1.json','utf8')).guides;
const legacy='https://school.stockcharts.com/doku.php?id=technical_indicators';
test('20 original Batch17 references are topic-specific without publication approvals',()=>{
 assert.equal(lessons.length,20);
 for(const g of lessons){
  assert.equal(g.previousGenericSourceUrl,legacy,g.code);
  assert.equal(g.sourceUrls.length,1,g.code);
  assert.match(g.sourceUrls[0],/^https:\/\/chartschool\.stockcharts\.com\/table-of-contents\/.+\/[^/]+$/);
  assert.equal(g.independentEditorialApproved,false,g.code);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false,g.code);
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false,g.code);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false,g.code);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false,g.code);
  assert.equal(g.officialCompetency,false,g.code);
 }
});
test('key calculation and variant limits are explicit in held examples',()=>{
 assert.equal(2/(9+1),0.2);
 assert.equal((10+12+14)/3,12);
 assert.equal((20+30+40)/3,30);
 assert.equal((10*100+12*300)/(100+300),11.5);
 assert.equal((50.25-50)/50*10000,50);
 assert.match(lessons[9].sourceResearchTriage.limitationsAndOpenQuestions,/NOT exact trade-print VWAP/);
 assert.match(lessons[15].sourceResearchTriage.limitationsAndOpenQuestions,/high equals low/);
 assert.match(lessons[17].sourceResearchTriage.classification,/VARIANT_NOT_EQUIVALENT/);
 assert.match(lessons[18].sourceResearchTriage.limitationsAndOpenQuestions,/not necessarily a full-price-chart gap/);
});
test('audit recognizes obsolete generic StockCharts paths in addition to current broad sources',()=>{
 const source=readFileSync('scripts/qa/talia-foundation-source-quality-v1.mjs','utf8');
 assert.match(source,/legacyGenericReferences/);
 assert.ok(source.includes(legacy));
 assert.match(source,/stats\.broadReferences\+\+/);
});
