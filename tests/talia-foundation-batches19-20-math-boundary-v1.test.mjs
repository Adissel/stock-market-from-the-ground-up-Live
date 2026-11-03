// Tutor Foundation Batches 19–20: independent synthetic scenario arithmetic and chronology.
// Internal automated regression only. NOT an independent editorial, source-rights,
// mathematical publication, investment advice, or paid-feature approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const load=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const batch19=load('19'), batch20=load('20');
const lessons=[...batch19,...batch20];
const near=(a,b)=>Math.abs(a-b)<1e-8;
const scenarios=[
 // Batch 19: reporting, financial statements, valuation and capital structure.
 {code:'TALIA_TOPIC_REVENUE_RECOGNITION_VERSUS_CASH_COLLECTION',tokens:['$10,000','$6,000','$4,000'],calculate:()=>10000-6000,expected:4000},
 {code:'TALIA_TOPIC_GROSS_RECEIVABLES_VERSUS_ALLOWANCE_FOR_CREDIT_LOSSES',tokens:['$20,000','$1,500','$18,500'],calculate:()=>20000-1500,expected:18500},
 {code:'TALIA_TOPIC_INVENTORY_COST_VERSUS_SALE_PRICE',tokens:['ten units','$8','$80','$15'],calculate:()=>10*8,expected:80},
 {code:'TALIA_TOPIC_DEPRECIATION_IS_EXPENSE_ALLOCATION_RATHER_THAN_CASH_PAYMENT',tokens:['$12,000','$2,000','five years'],calculate:()=>(12000-2000)/5,expected:2000},
 {code:'TALIA_TOPIC_DEPRECIATION_BOOK_VALUE_AFTER_ELAPSED_YEARS',tokens:['$10,000','$1,500','three full years','$5,500'],calculate:()=>10000-3*1500,expected:5500},
 {code:'TALIA_TOPIC_ACCOUNTS_PAYABLE_VERSUS_CASH_EXPENSE_TIMING',tokens:['$4,000','$1,500','$2,500'],calculate:()=>4000-1500,expected:2500},
 {code:'TALIA_TOPIC_CURRENT_ASSETS_MINUS_CURRENT_LIABILITIES_AS_WORKING_CAPITAL',tokens:['$30,000','$18,000','$12,000','1.667'],calculate:()=>[30000-18000,Number((30000/18000).toFixed(3))],expected:[12000,1.667]},
 {code:'TALIA_TOPIC_QUICK_RATIO_EXCLUDING_INVENTORY_AND_PREPAYMENTS',tokens:['$5,000','$2,000','$3,000','$8,000','1.25'],calculate:()=>(5000+2000+3000)/8000,expected:1.25},
 {code:'TALIA_TOPIC_EQUITY_BOOK_VALUE_FROM_THE_ACCOUNTING_EQUATION',tokens:['$100,000','$65,000','$35,000'],calculate:()=>100000-65000,expected:35000},
 {code:'TALIA_TOPIC_BOOK_VALUE_PER_COMMON_SHARE',tokens:['$900,000','300,000','$3'],calculate:()=>900000/300000,expected:3},
 {code:'TALIA_TOPIC_PRICE_TO_BOOK_RATIO',tokens:['$18','$6','P/B of 3'],calculate:()=>18/6,expected:3},
 {code:'TALIA_TOPIC_OPERATING_CASH_FLOW_BEFORE_CAPITAL_EXPENDITURES',tokens:['$50,000','$15,000','$35,000'],calculate:()=>50000-15000,expected:35000},
 {code:'TALIA_TOPIC_OPERATING_CASH_CONVERSION_RATIO',tokens:['$75,000','$50,000','1.5'],calculate:()=>75000/50000,expected:1.5},
 {code:'TALIA_TOPIC_INTEREST_EXPENSE_VERSUS_PRINCIPAL_REPAYMENT',tokens:['$600','$100','$500'],calculate:()=>100+500,expected:600},
 {code:'TALIA_TOPIC_SHARE_COUNT_IN_EPS_DENOMINATOR',tokens:['$1.2m','600,000','EPS $2'],calculate:()=>1200000/600000,expected:2},
 {code:'TALIA_TOPIC_QUARTERLY_ANNUALIZATION_VERSUS_TRAILING_TWELVE_MONTHS',tokens:['$2m','$8m','$11m'],calculate:()=>[2*4,2+3+2+4],expected:[8,11]},
 {code:'TALIA_TOPIC_REVENUE_GROWTH_WITH_A_NEGATIVE_BASE',tokens:['-$100','$20','+$120','-120%','undefined'],calculate:()=>[20-(-100),((20-(-100))/(-100))*100,Number.isFinite(20/0)],expected:[120,-120,false]},
 {code:'TALIA_TOPIC_CAPITAL_EXPENDITURE_VERSUS_ACQUISITION_SPENDING',tokens:['$25,000','$100,000','$125,000','not automatically'],calculate:()=>25000+100000,expected:125000},
 {code:'TALIA_TOPIC_DEBT_MATURITY_SCHEDULE_VERSUS_INTEREST_COVERAGE',tokens:['$500,000','$100,000','5×','$2m'],calculate:()=>500000/100000,expected:5},
 {code:'TALIA_TOPIC_DILUTION_MEASURED_WITH_UNCHANGED_INVESTOR_SHARES',tokens:['100','1,000','10%','1,250','8%'],calculate:()=>[100/1000,100/(1000+250)],expected:[0.10,0.08]},
 // Batch 20: time-available evidence, microstructure, replay integrity and model risk.
 {code:'TALIA_TOPIC_POINT_IN_TIME_RESEARCH_DATASET_VERSUS_CURRENT_REVISED_VALUE',tokens:['1.5%','2.0%','May 10'],calculate:()=>Date.parse('2026-05-01T00:00:00Z')<Date.parse('2026-05-10T00:00:00Z')&&Date.parse('2026-05-10T00:00:00Z')<Date.parse('2026-06-01T00:00:00Z'),expected:true},
 {code:'TALIA_TOPIC_PRICE_TIMESTAMP_VERSUS_PROVIDER_RECEIPT_TIMESTAMP',tokens:['10:00:00.100','10:00:00.300','200 milliseconds'],calculate:()=>300-100,expected:200},
 {code:'TALIA_TOPIC_PROVIDER_FEED_COVERAGE_VERSUS_CONSOLIDATED_TRADING_VOLUME',tokens:['30,000','100,000','30%'],calculate:()=>30000/100000,expected:0.30},
 {code:'TALIA_TOPIC_MISSING_QUOTE_VERSUS_ZERO_PRICE_QUOTE',tokens:['10:03','10:02','$12.50','$0 bid','not valid'],calculate:()=>null!==0,expected:true},
 {code:'TALIA_TOPIC_TIMESTAMP_ORDER_IN_REPLAY_EVENT_PROCESSING',tokens:['10:00:02','10:00:01','10:00:03','01,02,03'],calculate:()=>[2,1,3].sort((a,b)=>a-b),expected:[1,2,3]},
 {code:'TALIA_TOPIC_CORPORATE_SPLIT_EFFECTIVE_DATE_ADJUSTMENT',tokens:['2-for-1','$100','$50','10','20','$1,000'],calculate:()=>[10*100,20*50],expected:[1000,1000]},
 {code:'TALIA_TOPIC_DIVIDEND_ADJUSTED_TOTAL_RETURN_INDEX_CONVENTION',tokens:['$100','$101','$2','3%'],calculate:()=>((101-100)+2)/100*100,expected:3},
 {code:'TALIA_TOPIC_VOLUME_WEIGHTED_BENCHMARK_VERSUS_ARITHMETIC_BENCHMARK',tokens:['10 shares','$20','90','$21','$20.90','$20.50'],calculate:()=>[(10*20+90*21)/(10+90),(20+21)/2],expected:[20.90,20.50]},
 {code:'TALIA_TOPIC_BID_ASK_SPREAD_VERSUS_LAST_TRADE_DISPLACEMENT',tokens:['$10.00','$10.10','$0.10','$10.30','$0.25','$10.05'],calculate:()=>[10.10-10.00,(10.10+10.00)/2,10.30-(10.10+10.00)/2],expected:[0.10,10.05,0.25]},
 {code:'TALIA_TOPIC_TRADE_CORRECTION_AND_CUMULATIVE_VOLUME_REVISION',tokens:['100','200','300','revises eligible total to 100'],calculate:()=>[100+200,100+200-200],expected:[300,100]},
 {code:'TALIA_TOPIC_REPLAY_WARMUP_WINDOW_AND_DECISION_WINDOW',tokens:['20-period','19 earlier','first completed replay close'],calculate:()=>19+1,expected:20,limit:'first bar open'},
 {code:'TALIA_TOPIC_CHART_VIEWPORT_CHANGES_AND_DATA_INTEGRITY',tokens:['10.50','index 100','80–120'],calculate:()=>10.50,expected:10.50},
 {code:'TALIA_TOPIC_FICTIONAL_VERSUS_LICENSED_HISTORICAL_CANDLE_PROVENANCE',tokens:['$10/$11/$9/$10.50','FICTIONAL'],calculate:()=>11>=Math.max(10,10.50)&&9<=Math.min(10,10.50),expected:true},
 {code:'TALIA_TOPIC_STUDY_SAMPLE_SURVIVORSHIP_AUDIT',tokens:['100','80','20%'],calculate:()=>(100-80)/100*100,expected:20},
 {code:'TALIA_TOPIC_STRATEGY_SELECTION_VERSUS_OUT_OF_SAMPLE_EVIDENCE',tokens:['20 strategies','contaminates the holdout'],calculate:()=>20>1,expected:true,limit:'separate future evaluation'},
 {code:'TALIA_TOPIC_SIMULATED_SLIPPAGE_VERSUS_OBSERVED_EXECUTION_COST',tokens:['100-share','$20','0.02/share','$2'],calculate:()=>100*0.02,expected:2},
 {code:'TALIA_TOPIC_TRANSACTION_COST_SENSITIVITY_OF_SMALL_SIGNALS',tokens:['$15','$8','$10','-$3'],calculate:()=>15-8-10,expected:-3},
 {code:'TALIA_TOPIC_STRATEGY_EXPECTANCY_CONFIDENCE_VERSUS_POINT_ESTIMATE',tokens:['25 independent','mean $4','SD $20','standard error $4'],calculate:()=>20/Math.sqrt(25),expected:4,limit:'Heavy tails'},
 {code:'TALIA_TOPIC_DRAWDOWN_RECOVERY_WITH_CASH_FLOWS_EXCLUDED',tokens:['$1000','$800','$200','not an earned 25%'],calculate:()=>[(800-1000)/1000,200/800,800+200],expected:[-0.20,0.25,1000]},
 {code:'TALIA_TOPIC_UNCERTAINTY_OF_A_LEVEL_CROSSING_ON_INCOMPLETE_BARS',tokens:['$30','$30.50','$29.80','not met'],calculate:()=>[30.50>30,29.80>30],expected:[true,false]}
];

test('Exactly forty existing synthetic lesson scenarios, with stable code order and no duplicates',()=>{
 assert.deepEqual([batch19.length,batch20.length],[20,20]);
 assert.equal(scenarios.length,40);
 assert.equal(new Set(scenarios.map(s=>s.code)).size,40);
 assert.deepEqual(scenarios.map(s=>s.code),lessons.map(g=>g.code));
});

for(const [i,s] of scenarios.entries()){
 test('Lesson '+(361+i)+' synthetic arithmetic / temporal / boundary: '+s.code,()=>{
  const g=lessons[i];
  assert.equal(g.code,s.code);
  assert.match(g.workedCase,/^FICTIONAL:/);
  for(const token of s.tokens)assert.ok(g.workedCase.includes(token),s.code+' missing worked-example datum '+token);
  const actual=s.calculate(),expected=s.expected;
  if(typeof expected==='number')assert.ok(near(actual,expected),s.code+': numerical disagreement');
  else if(Array.isArray(expected)){assert.equal(actual.length,expected.length,s.code);for(let j=0;j<expected.length;j++)assert.ok(typeof expected[j]==='number'?near(actual[j],expected[j]):Object.is(actual[j],expected[j]),s.code+': result '+j+' disagreement');}
  else assert.deepEqual(actual,expected,s.code+': chronological or boundary disagreement');
  if(s.limit)assert.ok(g.limit.includes(s.limit),s.code+' missing limitation');
  assert.equal(g.independentEditorialApproved,false,s.code);
  assert.equal(g.officialCompetency,false,s.code);
  assert.equal(g.sourceResearchTriage?.independentMathAccepted,false,s.code);
  assert.equal(g.sourceResearchTriage?.independentPublicationApproved,false,s.code);
  assert.equal(g.sourceResearchTriage?.sourceRedistributionRightsCleared,false,s.code);
  assert.equal(g.editorSourceReview?.independentPublicationAccepted,false,s.code);
  assert.match(g.sourceRightsStatus||'',/not_claim_verified|not_verified|unverified/,s.code+' must retain an explicit source-rights review hold');
  assert.ok(Array.isArray(g.sourceUrls)&&g.sourceUrls.every(u=>new URL(u).protocol==='https:'),s.code);
 });
}

test('Guard classification: calculations do not imply real provider records or permission to publish',()=>{
 assert.ok(scenarios.every(s=>typeof s.calculate==='function'));
 assert.ok(lessons.every(g=>g.workedCase.startsWith('FICTIONAL:')));
 assert.ok(lessons.every(g=>g.status.includes('pending_independent_editorial_review')));
 assert.ok(lessons.every(g=>g.independentEditorialApproved===false));
});
