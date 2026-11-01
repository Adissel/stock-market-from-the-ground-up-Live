// SMFGU-TALIA-CLAIM-TRIAGE-012 v1 — source-catalog provenance and fictional math regression.
// Each item is a HOLD; source URLs cannot silently become publication rights or factual certification.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=name=>JSON.parse(readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));
const triage=data('talia-claim-triage-181-240-and-indicators-v1.json');
const topics=[10,11,12].flatMap(n=>data('talia-foundation-explanations-batch'+n+'-v1.json').guides);
const indicators=[...data('tutor-indicator-study-v1.json').guides,...data('tutor-indicator-expansion-v1.json').guides];
const close=(got,want)=>assert.ok(Number.isFinite(got)&&Math.abs(got-want)<1e-8,got+' ≠ '+want);
test('all 140 topic-source review records are present and none pre-approved',()=>{
 assert.equal(triage.topics.length,60);
 assert.equal(triage.ranges.totalItemizedTriaged,140);
 assert.equal(new Set(triage.topics.map(x=>x.code)).size,60);
 triage.topics.forEach((r,i)=>{
  assert.equal(r.number,i+181);assert.equal(r.code,topics[i].code);
  assert.equal(r.candidateReference,topics[i].sourceUrls[0]);
  assert.equal(r.finalEditorialDecision,'HOLD');assert.equal(r.officialGrade,false);
  assert.ok(r.specificReviewFocus.length>30);
  assert.ok(r.actionNeeded.length>35);
  assert.match(r.candidateReference,/^https:\/\//);
  if(r.number>=201&&r.number<=220)assert.equal(r.memberCurriculumPlacement,'ADVANCED_SPECIALIST_PLACEMENT_REVIEW');
 });
 assert.equal(triage.topics.filter(x=>x.finalEditorialDecision==='HOLD').length,60);
});
test('all 73 indicator formula and rights reviews remain independent of content authoring',()=>{
 assert.equal(triage.indicators.length,73);
 assert.equal(new Set(triage.indicators.map(x=>x.code)).size,73);
 triage.indicators.forEach((r,i)=>{
  assert.equal(r.number,i+1);assert.equal(r.code,indicators[i].code);
  assert.equal(r.formula,indicators[i].formula);
  assert.equal(r.candidateSource,indicators[i].sourceUrls[0]);
  assert.equal(r.independentlyAccepted,false);
  assert.equal(r.formulaDefinition,'PENDING_INDEPENDENT_FORMULA_CONVENTION');
  assert.equal(r.dataLicense,'NO_VENDOR_CODE_CHART_OR_FEED_REPUBLICATION_APPROVED');
 });
});
test('corrected source scope explicitly separates stop mechanics, backtesting, fees, filing dates and FRED rights',()=>{
 const by=Object.fromEntries(triage.topics.map(t=>[t.code,t]));
 const stop='https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15';
 for(const id of ['TALIA_TOPIC_STOP_ORDER_FILL_UNCERTAINTY','TALIA_TOPIC_STOP_LIMIT_NONFILL','TALIA_TOPIC_GAP_LOSS_ABOVE_PLAN'])assert.equal(by[id].candidateReference,stop);
 for(const id of ['TALIA_TOPIC_REPLAY_TRAIN_TEST_SPLIT','TALIA_TOPIC_BACKTEST_MULTIPLE_TEST_BIAS'])assert.match(by[id].candidateReference,/quantconnect\.com\/docs\/v2\/cloud-platform\/backtesting\/research-guide/);
 assert.match(by.TALIA_TOPIC_REPLAY_FILING_AVAILABILITY.candidateReference,/sec\.gov\/about\/webmaster-frequently-asked-questions/);
 assert.match(by.TALIA_TOPIC_REPLAY_ECONOMIC_VINTAGE.actionNeeded,/FRED Terms restrict AI\/ML/);
});
test('independent fictional arithmetic and denominator checks for Batch 12',()=>{
 close((9.9-10.1)*100,-20);close((18.60-20)*50,-70);
 // Stop-limit deliberately makes no guaranteed fill claim.
 const stop=19.5,limit=19.4,bid=19.2;assert.equal(bid>=limit,false);assert.ok(stop>limit);
 close(50*(50-49),50);close(Math.floor(75/1.4),53);close(53*1.4,74.2);
 close(100*40/8000,.5);close(60*40,2400);close(60*(40-39),60);
 close(15000/10000,1.5);close(3/2,1.5);close(12/8,1.5);
 close(.4*12-.6*6,1.2);close(8/(12+8),.4);
 close(100*(.9*1.1-1),-1);close(100*(8500/10000-1),-15);
 close(100*(10000/8500-1),100*1500/8500);
 close(100*8/20,40);close(60-8,52);
 close(100*((30-28.6)/(30-29)-1),40);
 close(50+40,90);close(4/2000*10000,20);
});
