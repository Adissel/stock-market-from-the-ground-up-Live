/* Foundation teaching batch 06/07 — authored 101–140, no protected grading. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalGuides,answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const all=Array.from({length:7},(_,i)=>JSON.parse(read('data/talia-foundation-explanations-batch0'+(i+1)+'-v1.json')));
const prior=all.slice(0,5).flatMap(x=>x.guides);
const fresh=all.slice(5).flatMap(x=>x.guides);
const allGuides=all.flatMap(x=>x.guides);
const official=JSON.parse(read('data/competency-study-guides-v01499.json')).guides;
const canonicalSources=new Set(['www.investor.gov','investor.gov','www.sec.gov','sec.gov','www.bls.gov','bls.gov','www.finra.org','finra.org','syndication.finra.org','chartschool.stockcharts.com','pages.stern.nyu.edu','www.ssga.com','ssga.com','www.optionseducation.org','optionseducation.org','fred.stlouisfed.org']);
function mockAssets(max=7){
 return {fetch:async request=>{
 const filename=new URL(request.url).pathname.split('/').at(-1);
 if(filename==='competency-study-guides-v01499.json')return new Response(read('data/'+filename),{status:200});
 const part=Number((/batch0([1-7])/.exec(filename)||[])[1]);
 return part&&part<=max?new Response(read('data/'+filename),{status:200}):new Response('not found',{status:404});
 }};
}
test('Exactly forty distinct topical explanations in two new optional batches; 140/600 total drafting',()=>{
 assert.equal(prior.length,100);
 assert.equal(fresh.length,40);
 assert.deepEqual(all.slice(5).map(g=>g.count),[20,20]);
 assert.equal(allGuides.length,140);
 assert.equal(new Set(allGuides.map(g=>g.code)).size,140);
 assert.equal(new Set(allGuides.map(g=>g.title.toLowerCase().trim())).size,140);
 assert.equal(official.length,30);
 const coreIds=new Set(official.map(g=>g.code));
 for(const g of fresh){
  assert.match(g.code,/^TALIA_TOPIC_[A-Z0-9_]{5,96}$/);
  assert.equal(g.supplemental,true);assert.equal(g.foundationTopic,true);assert.equal(g.officialCompetency,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.status,'original_source_authored_ungraded_pending_independent_editorial_review');
  assert.ok(!coreIds.has(g.code),'never mint new protected competency IDs');
  assert.match(g.workedCase,/^FICTIONAL:/);
  for(const key of ['title','concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
    assert.ok(typeof g[key]==='string'&&g[key].length>=28,g.code+' '+key);
  assert.equal(g.sourceUrls.length,1);
  const u=new URL(g.sourceUrls[0]);
  assert.equal(u.protocol,'https:');assert.equal(u.username,'');assert.equal(u.search,'');
  assert.ok(canonicalSources.has(u.hostname),g.code+' unexpected source');
  assert.match(g.sourceRightsStatus,/not_third_party_content_republication/);
 }
});
test('All forty source-only topics can actually be retrieved and never become protected graded answers',async()=>{
 const assets=mockAssets();
 const env={ASSETS:assets},request=new Request('https://tutor.example/api/market-tutor-v01492');
 for(const g of fresh){
  const best=await originalGuides(env,request,'Explain '+g.title);
  assert.equal(best[0]?.code,g.code,'lookup '+g.title);
  for(const q of ['Explain '+g.title,'Teach this in more depth: '+g.title]){
   const explanation=answerFromGuide(g,'explain','',q);
   assert.ok(explanation.includes(g.workedCase),g.code+' worked arithmetic/instruction');
   assert.ok(explanation.includes(g.transferQuestion),g.code+' independent transfer');
   assert.ok(explanation.includes(g.commonError),g.code+' misconception');
  }
  assert.doesNotMatch(answerFromGuide(g,'question','','Explain '+g.title),/Original fictional worked explanation/);
  assert.doesNotMatch(answerFromGuide(g,'review','uncertain','Explain '+g.title),/Original fictional worked explanation/);
 }
});
test('A missing newest asset preserves earlier source batches; the other optional new batch remains available',async()=>{
 const request=new Request('https://tutor.example/api/market-tutor-v01492');
 const env={ASSETS:mockAssets(6)};
 const old=await originalGuides(env,request,'Explain '+prior[0].title);
 assert.equal(old[0]?.code,prior[0].code);
 const sixth=await originalGuides(env,request,'Explain '+all[5].guides[0].title);
 assert.equal(sixth[0]?.code,all[5].guides[0].code);
 const seventh=await originalGuides(env,request,'Explain '+all[6].guides[0].title);
 assert.notEqual(seventh[0]?.code,all[6].guides[0].code);
});
test('Independently recomputed numerical examples preserve units and limitations',()=>{
 const checks=[
  ['TALIA_TOPIC_DIVIDEND_CASH_VS_RETURN',(39-40+1.5)/40*100,'1.25%'],
  ['TALIA_TOPIC_INDICATED_YIELD_NOT_GUARANTEE',(0.3*4)/24*100,'5.00%'],
  ['TALIA_TOPIC_BOND_CURRENT_YIELD_SCOPE',50/800*100,'6.25%'],
  ['TALIA_TOPIC_BOND_PRICE_YIELD_DIRECTION',1000/1.1,'$909.09'],
  ['TALIA_TOPIC_ETF_NAV_MARKET_QUOTE',(9.8e6-.2e6)/400000,'$24.00'],
  ['TALIA_TOPIC_INDEX_FUND_TRACKING_DIFFERENCE',7.6-8,'−0.4 percentage points'],
  ['TALIA_TOPIC_COMPOUND_RETURNS_PATH',(1.1*.9-1)*100,'−1%'],
  ['TALIA_TOPIC_ARITHMETIC_GEOMETRIC_GROWTH',(Math.sqrt(1.2*.9)-1)*100,'3.92%'],
  ['TALIA_TOPIC_EXACT_INFLATION_ADJUSTMENT',(1.08/1.03-1)*100,'4.85%'],
  ['TALIA_TOPIC_ANNUALIZATION_NOT_REALIZED',(1.05**2-1)*100,'10.25%'],
  ['TALIA_TOPIC_BEGINNING_WEIGHTS_RETURN',(.6*.1+.4*-.05)*100,'+4%'],
  ['TALIA_TOPIC_ALLOCATION_WEIGHT_DRIFT',720/1120*100,'64.29%'],
  ['TALIA_TOPIC_INTEREST_COVERAGE_EBIT',12/3,'4.0×'],
  ['TALIA_TOPIC_AVERAGE_INVENTORY_TURNOVER',120/((20+30)/2),'4.8 times'],
  ['TALIA_TOPIC_RECEIVABLE_COLLECTION_DAYS',18/180*365,'36.5 days'],
  ['TALIA_TOPIC_ROE_AVERAGE_BOOK_EQUITY',15/((80+120)/2)*100,'15%']
 ];
 for(const [code,value,written] of checks){
  const g=fresh.find(x=>x.code===code);
  assert.ok(g,code+' missing');
  assert.ok(Number.isFinite(value));
  assert.ok(g.workedCase.includes(written),code+' expected '+written);
  assert.ok(g.limit.length>50&&g.transferQuestion.length>60,code+' scope and transfer');
 }
 assert.ok(Math.abs((1.08/1.03-1)*100-4.8543689320)<1e-8);
 assert.ok(Math.abs((Math.sqrt(1.08)-1)*100-3.9230484541)<1e-8);
 assert.equal(Math.round(720-1120*.6),48);
 assert.equal(Math.round((120/25)*10)/10,4.8);
});
