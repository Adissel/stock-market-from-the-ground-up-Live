import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const b10=read('10'),b21=read('21'),b22=read('22');
test('Options and volatility Batches 21/22 hold publication and record forty narrowed sources',()=>{
 const arr=[...b21,...b22];
 assert.equal(arr.length,40);assert.equal(new Set(arr.map(x=>x.code)).size,40);
 for(const [i,g] of arr.entries()){
  assert.equal(g.previousGenericSourceUrl,i<20?'https://www.optionseducation.org/optionsoverview':'https://www.cboe.com/tradable_products/vix/');
  assert.equal(g.sourceUrls.length,1);
  assert.ok(g.sourceUrls[0].startsWith('https://'));
  assert.ok(g.sourceResearchTriage.supportedScope.includes(g.title));
  assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.includes(g.limit));
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
  assert.equal(g.officialCompetency,false);
 }
});
test('Batch10 split and corporate event generic EDGAR index links removed',()=>{
 for(const i of [7,17]){
  const g=b10[i];
  assert.equal(g.previousGenericSourceUrl,'https://www.sec.gov/edgar/search/');
  assert.match(g.sourceUrls[0],/corporate-actions/);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.independentEditorialApproved,false);
 }
});
test('Methodology distinctions are explicit without a paid/live simulator',()=>{
 assert.match(b21[2].sourceResearchTriage.limitationsAndOpenQuestions,/volatility quoting conventions/);
 assert.match(b22[19].sourceUrls[0],/cboe.com/);
 assert.match(b22[17].sourceResearchTriage.limitationsAndOpenQuestions,/settlement styles/);
 assert.ok(b21.every(g=>/^FICTIONAL:/.test(g.workedCase)));
 assert.ok(b22.every(g=>/^FICTIONAL:/.test(g.workedCase)));
});


test('Options and VIX source exceptions resolved; adjusted deliverable is not a premium multiplier',()=>{
 const adjusted=b21[14],assigned=b21[18],variance=b22[4],official=b22[19];
 assert.ok(adjusted.sourceUrls[0].endsWith('/splits-mergers-spinoffs-bankruptcies'));
 assert.ok(assigned.sourceUrls[0].endsWith('/trading-options-understanding-assignment'));
 assert.ok(variance.sourceUrls[0].endsWith('/eda356.htm'));
 assert.ok(official.sourceUrls[0].endsWith('/vix/faqs'));
 assert.match(adjusted.workedCase,/premium multiplier of 150/);
 assert.match(adjusted.workedCase,/multiplier of 100/);
 assert.match(adjusted.workedCase,/\$300 before fees/);
 assert.match(adjusted.workedCase,/\$200/);
 assert.equal(2*150,300);assert.equal(2*100,200);
 assert.ok([...b21,...b22].every(g=>!g.sourceUrls.includes(g.previousGenericSourceUrl)));
 for(const g of [adjusted,assigned,variance,official]){
  assert.ok(g.sourceResearchTriage.supportedScope.includes(g.title));
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
  assert.equal(g.independentEditorialApproved,false);
 }
 const scanner=readFileSync(new URL('../scripts/qa/talia-foundation-source-quality-v1.mjs',import.meta.url),'utf8');
 assert.match(scanner,/unreconciledPriorGenericReferences/);
 assert.match(scanner,/unreconciled_prior_generic_reference/);
});
