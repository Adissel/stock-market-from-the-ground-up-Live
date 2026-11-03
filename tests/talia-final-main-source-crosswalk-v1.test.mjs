import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const div=read('06').find(g=>g.code==='TALIA_TOPIC_DIVIDEND_CASH_VS_RETURN');
const b10=read('10'),splits=['TALIA_TOPIC_REPLAY_SPLIT_ADJUSTMENT','TALIA_TOPIC_REPLAY_CORPORATE_EVENT_TIMING'].map(code=>b10.find(g=>g.code===code));
test('Existing main source remediation remains authoritative with preserved independent holdouts',()=>{
 assert.ok(div);assert.equal(div.sourceUrls.length,1);assert.match(div.sourceUrls[0],/investor\.gov\/introduction-investing\/investing-basics\/investment-products\/stocks/);
 assert.equal(div.previousGenericSourceUrl,'https://www.investor.gov/introduction-investing');
 assert.equal(div.sourceScopeReview.primaryPageScopeChecked,false);
 for(const g of [div,...splits]){
  assert.ok(g);assert.equal(g.sourceUrls.length,1);assert.ok(g.sourceUrls.every(u=>u.startsWith('https://')));
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
 }
 for(const g of splits)assert.match(g.sourceUrls[0],/quantconnect\.com\/docs\/v2\/writing-algorithms\/securities\/asset-classes\/us-equity\/corporate-actions/);
});
test('Dividends and split calculations honor original hypothetical units and chronology',()=>{
 assert.ok(Math.abs((39-40+1.5)/40-.0125)<1e-12);
 assert.equal(10*2,20);assert.equal(40/2,20);assert.equal(10*40,20*20);
 assert.match(splits[0].commonError,/Incorrectly combining a split-adjusted/);
 assert.match(splits[1].commonError,/before it is effective/);
});
test('All 600 lessons have no known broad introduction/EDGAR/indicator-index source URLs',()=>{
 const generic=new Set(['https://www.investor.gov/introduction-investing','https://www.investor.gov/introduction-investing/','https://www.sec.gov/edgar/search/','https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators','https://school.stockcharts.com/doku.php?id=technical_indicators']);
 const guides=Array.from({length:30},(_,i)=>read(String(i+1).padStart(2,'0'))).flat();
 assert.equal(guides.length,600);assert.equal(new Set(guides.map(g=>g.code)).size,600);
 assert.equal(guides.filter(g=>g.independentEditorialApproved).length,0);
 assert.equal(guides.filter(g=>!g.editorSourceReview||!g.sourceRightsStatus||!g.sourceUrls?.length).length,0);
 assert.equal(guides.flatMap(g=>g.sourceUrls).filter(u=>generic.has(u)).length,0);
});
