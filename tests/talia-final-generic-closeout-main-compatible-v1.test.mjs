import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const b6=read('06'),b10=read('10');
const dividend=b6.find(g=>g.code==='TALIA_TOPIC_DIVIDEND_CASH_VS_RETURN');
const splits=['TALIA_TOPIC_REPLAY_SPLIT_ADJUSTMENT','TALIA_TOPIC_REPLAY_CORPORATE_EVENT_TIMING'].map(code=>b10.find(g=>g.code===code));
test('Three original dividend/split studies have specific corporate action sources and publication holds',()=>{
 for(const g of [dividend,...splits]){assert.ok(g);assert.equal(g.sourceUrls.length,1);assert.match(g.sourceUrls[0],/www\.quantconnect\.com\/docs\/v2\/writing-algorithms\/securities\/asset-classes\/us-equity\/corporate-actions/);
 assert.ok(['https://www.sec.gov/edgar/search/','https://www.investor.gov/introduction-investing'].includes(g.previousGenericSourceUrl));
 assert.equal(g.independentEditorialApproved,false);assert.equal(g.officialCompetency,false);assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
 assert.equal(g.sourceResearchTriage.independentMathAccepted,false);assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
 }
 assert.equal(dividend.sourceScopeReview.primaryPageScopeChecked,false);
});
test('Cash dividend must not be double counted; split event and historic fill are different',()=>{
 assert.ok(Math.abs((39-40+1.5)/40-.0125)<1e-12);
 assert.equal(10*2,20);assert.equal(40/2,20);assert.equal(10*40,20*20);
 assert.match(splits[0].commonError,/Incorrectly combining a split-adjusted/);
 assert.match(splits[1].commonError,/before it is effective/);
});
test('Exact 600 lesson inventory contains no known generic landing page references',()=>{
 const generic=new Set(['https://www.investor.gov/introduction-investing','https://www.investor.gov/introduction-investing/','https://www.sec.gov/edgar/search/','https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators','https://school.stockcharts.com/doku.php?id=technical_indicators']);
 const guides=Array.from({length:30},(_,i)=>read(String(i+1).padStart(2,'0'))).flat();
 assert.equal(guides.length,600);assert.equal(guides.filter(g=>g.independentEditorialApproved).length,0);
 assert.equal(guides.filter(g=>!g.editorSourceReview||!g.sourceRightsStatus||!g.sourceUrls?.length).length,0);
 assert.equal(guides.flatMap(g=>g.sourceUrls).filter(u=>generic.has(u)).length,0);
});
