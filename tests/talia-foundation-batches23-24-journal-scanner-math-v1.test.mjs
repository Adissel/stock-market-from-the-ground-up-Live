// Foundation Batches 23–24: journal, scanner and watchlist synthetic scenario checks.
// Internal regression only. Sources, rights, graded awards and commercial performance not accepted.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const batches=[load('23'),load('24')],guides=batches.flat();
const near=(x,y)=>Math.abs(x-y)<1e-8;
const fixtures=[
 {code:'TALIA_TOPIC_JOURNAL_PLANNED_ENTRY_VERSUS_ACTUAL_FILL',tokens:['$20','$20.08','50 shares','$4'],calc:()=>(20.08-20)*50,expected:4},
 {code:'TALIA_TOPIC_JOURNAL_OUTCOME_VERSUS_DECISION_QUALITY',tokens:['$20','$30','profit does not erase'],calc:()=>30>0&&20>0,expected:true},
 {code:'TALIA_TOPIC_JOURNAL_RULE_ADHERENCE_PERCENTAGE',tokens:['18 of 24','75%'],calc:()=>18/24*100,expected:75},
 {code:'TALIA_TOPIC_JOURNAL_MISSING_DATA_RATE',tokens:['5 of 40','12.5%'],calc:()=>5/40*100,expected:12.5},
 {code:'TALIA_TOPIC_JOURNAL_REALIZED_VERSUS_UNREALIZED_P_L',tokens:['20 shares','$10','$10.50','$10 unrealized'],calc:()=>20*(10.5-10),expected:10},
 {code:'TALIA_TOPIC_JOURNAL_AVERAGE_HOLDING_DURATION',tokens:['20 and 40 minutes','30 minutes'],calc:()=>(20+40)/2,expected:30},
 {code:'TALIA_TOPIC_JOURNAL_TRADE_GROUPING_BY_SETUP',tokens:['+$20','-$10','+$30','+$40'],calc:()=>20-10+30,expected:40},
 {code:'TALIA_TOPIC_JOURNAL_SAMPLE_SIZE_VERSUS_CLAIMED_EDGE',tokens:['Four wins in five','80%','not a guaranteed'],calc:()=>4/5*100,expected:80},
 {code:'TALIA_TOPIC_JOURNAL_GROSS_TO_NET_RECONCILIATION',tokens:['$50','$4','$1','$45'],calc:()=>50-4-1,expected:45},
 {code:'TALIA_TOPIC_JOURNAL_PLANNED_RISK_VERSUS_REALIZED_R',tokens:['$25','$50','-2R'],calc:()=>-50/25,expected:-2},
 {code:'TALIA_TOPIC_JOURNAL_OPPORTUNITY_COST_IS_NOT_REALIZED_LOSS',tokens:['$2','zero','$0'],calc:()=>0*2,expected:0},
 {code:'TALIA_TOPIC_CHECKLIST_PASS_RATE_VERSUS_PREDICTION',tokens:['Three of four','fails','all four'],calc:()=>3===4,expected:false},
 {code:'TALIA_TOPIC_TRADING_HALT_JOURNAL_RECONSTRUCTION',tokens:['$20','$18','$19.50','did not prove'],calc:()=>20-18,expected:2},
 {code:'TALIA_TOPIC_NO_TRADE_DECISION_DOCUMENTATION',tokens:['10:05','zero shares','no realized'],calc:()=>0,expected:0},
 {code:'TALIA_TOPIC_PRETRADE_INVALIDATION_CONDITION',tokens:['completed 5-minute close','below $25','intrabar touch alone does not'],calc:()=>true,expected:true},
 {code:'TALIA_TOPIC_JOURNAL_RISK_CONCENTRATION_ACROSS_SIMULTANEOUS_PLANS',tokens:['Three independent','$50','$150','before overlap'],calc:()=>3*50,expected:150},
 {code:'TALIA_TOPIC_DAILY_REALIZED_P_L_VERSUS_OPEN_EXPOSURE',tokens:['-$40','+$25','remains -$40'],calc:()=>-40,expected:-40},
 {code:'TALIA_TOPIC_LEARNING_RETRY_VERSUS_GRADED_RETAKE',tokens:['retries','twice','grade remains unchanged'],calc:()=>true,expected:true},
 {code:'TALIA_TOPIC_SELF_REPORTED_CONFIDENCE_VERSUS_DEMONSTRATED_COMPETENCY',tokens:['9/10','not a 90% competency'],calc:()=>true,expected:true},
 {code:'TALIA_TOPIC_PROCESS_IMPROVEMENT_MEASURED_WITH_CONSISTENT_RUBRICS',tokens:['6/10','8/10','two points','20 percentage points'],calc:()=>[(8-6),((8/10)-(6/10))*100],expected:[2,20]},
 {code:'TALIA_TOPIC_SCANNER_THRESHOLD_AND_ELIGIBLE_OBSERVATION_TIME',tokens:['10:00','09:59','$20.10','passes'],calc:()=>20.10>20,expected:true},
 {code:'TALIA_TOPIC_MINIMUM_DOLLAR_VOLUME_FILTER',tokens:['100,000','$20','$2 million'],calc:()=>100000*20,expected:2000000},
 {code:'TALIA_TOPIC_SHARE_FLOAT_VERSUS_TOTAL_SHARES_SCREEN',tokens:['10 million','3 million','7 million'],calc:()=>10-3,expected:7},
 {code:'TALIA_TOPIC_MARKET_CAP_FILTER_AND_QUOTED_PRICE_TIMING',tokens:['5 million','$12','$60 million'],calc:()=>5000000*12,expected:60000000},
 {code:'TALIA_TOPIC_RELATIVE_STRENGTH_RATIO_VERSUS_BENCHMARK',tokens:['110','100','1.10'],calc:()=>110/100,expected:1.10},
 {code:'TALIA_TOPIC_SECTOR_CONCENTRATION_IN_A_WATCHLIST',tokens:['8 symbols','6 in one sector','75%'],calc:()=>6/8*100,expected:75},
 {code:'TALIA_TOPIC_VOLUME_FILTER_AND_LOW_PRICED_STOCKS',tokens:['1 million','$1','200,000','$20','$4m'],calc:()=>[1000000*1,200000*20],expected:[1000000,4000000]},
 {code:'TALIA_TOPIC_BID_ASK_SPREAD_SCREEN_AND_MINIMUM_TICK',tokens:['$0.01','$1','1%','$100','0.01%'],calc:()=>[.01/1*100,.01/100*100],expected:[1,0.01]},
 {code:'TALIA_TOPIC_PRICE_GAP_SCREENER_WITH_CORPORATE_ACTIONS',tokens:['$100','2-for-1','$50','-50%','without wealth collapse'],calc:()=>(50-100)/100*100,expected:-50},
 {code:'TALIA_TOPIC_PREMARKET_VOLUME_VERSUS_REGULAR_SESSION_BENCHMARK',tokens:['10,000','1 million','different windows'],calc:()=>10000/1000000,expected:0.01},
 {code:'TALIA_TOPIC_WATCHLIST_CANDIDATE_VERSUS_EXECUTABLE_TRADE',tokens:['price>$10','volume>100,000','no valid ask'],calc:()=>true,expected:true},
 {code:'TALIA_TOPIC_SCANNER_FALSE_POSITIVES_FROM_DELAYED_FEEDS',tokens:['10:00','$20.20','10:20','unverified'],calc:()=>20,expected:20},
 {code:'TALIA_TOPIC_WATCHLIST_RANKING_BY_COMPOSITE_SCORE',tokens:['80/100','60%','50/100','40%','68/100'],calc:()=>80*.60+50*.40,expected:68},
 {code:'TALIA_TOPIC_MISSING_DATA_EXCLUSION_FROM_CANDIDATE_SCORE',tokens:['lacks liquidity','HOLD','rather than assigning 100'],calc:()=>true,expected:true},
 {code:'TALIA_TOPIC_WATCHLIST_REFRESH_VERSUS_PRICE_ALERT_TRIGGER',tokens:['completed close above $30','$30.20','does not satisfy'],calc:()=>true,expected:true},
 {code:'TALIA_TOPIC_VOLUME_ACCELERATION_VERSUS_RAW_VOLUME_INCREASE',tokens:['1,000 shares','3,000','1,000 versus 600'],calc:()=>[1000/1,3000/5],expected:[1000,600]},
 {code:'TALIA_TOPIC_BREADTH_ADVANCE_DECLINE_RATIO_AND_ZERO_DECLINES',tokens:['300 advances','200 declines','1.5','0 declines','undefined'],calc:()=>[300/200,Number.isFinite(300/0)],expected:[1.5,false]},
 {code:'TALIA_TOPIC_BREADTH_NET_ADVANCES_VERSUS_PERCENTAGE',tokens:['300','200','600','+100','50%'],calc:()=>[300-200,300/600*100],expected:[100,50]},
 {code:'TALIA_TOPIC_MARKET_SESSION_FILTER_AND_EARLY_CLOSE',tokens:['13:00 Eastern','14:00 Eastern','ineligible'],calc:()=>14>13,expected:true},
 {code:'TALIA_TOPIC_DUPLICATE_TICKER_OBSERVATIONS_IN_SCANNER_RESULTS',tokens:['ABC twice','DEF once','count is 2'],calc:()=>new Set(['ABC','ABC','DEF']).size,expected:2}
];
test('Batches 23–24 have 40 distinct and ordered synthetic calculations/boundaries',()=>{
 assert.deepEqual(batches.map(b=>b.length),[20,20]);
 assert.equal(fixtures.length,40);
 assert.equal(new Set(fixtures.map(f=>f.code)).size,40);
 assert.deepEqual(fixtures.map(f=>f.code),guides.map(g=>g.code));
});
for(const [i,f] of fixtures.entries()){
 test('Lesson '+(441+i)+' journal/scanner arithmetic or eligibility: '+f.code,()=>{
  const g=guides[i];
  assert.equal(g.code,f.code);
  assert.match(g.workedCase,/^FICTIONAL:/);
  for(const token of f.tokens)assert.ok(g.workedCase.includes(token),g.code+' missing datum '+token);
  const actual=f.calc(),expected=f.expected;
  if(typeof expected==='number')assert.ok(near(actual,expected),g.code+' numeric value');
  else if(Array.isArray(expected)){assert.equal(actual.length,expected.length,g.code);for(let j=0;j<expected.length;j++)assert.ok(typeof expected[j]==='number'?near(actual[j],expected[j]):Object.is(actual[j],expected[j]),g.code+' index '+j);}
  else assert.deepEqual(actual,expected,g.code);
  assert.equal(g.independentEditorialApproved,false,g.code);
  assert.equal(g.officialCompetency,false,g.code);
  assert.equal(g.editorSourceReview?.independentPublicationAccepted,false,g.code);
  assert.equal(g.sourceResearchTriage?.independentMathAccepted,false,g.code);
  assert.equal(g.sourceResearchTriage?.independentPublicationApproved,false,g.code);
  assert.equal(g.sourceResearchTriage?.sourceRedistributionRightsCleared,false,g.code);
  assert.match(g.sourceRightsStatus||'',/candidate|not_verified|unverified/,g.code);
  assert.ok(g.sourceUrls?.length>0&&g.sourceUrls.every(u=>new URL(u).protocol==='https:'),g.code);
 });
}
test('The journal and scanner remain ungraded instructional examples and not member performance metrics',()=>{
 assert.ok(guides.every(g=>g.workedCase.startsWith('FICTIONAL:')));
 assert.ok(guides.every(g=>g.status.includes('pending_independent_editorial_review')));
 assert.ok(guides.every(g=>!g.independentEditorialApproved));
});
