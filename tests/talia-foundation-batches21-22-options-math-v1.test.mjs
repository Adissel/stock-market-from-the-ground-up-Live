// Foundation Batches 21–22: options, volatility and derivative payoff examples.
// Deterministic fictional math/contract-convention regressions only. No trading,
// brokerage permissions, independent editorial approval or licensed data validation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const batches=[load('21'),load('22')],lessons=batches.flat();
const close=(a,b)=>Math.abs(a-b)<1e-9;
const cases=[
 {code:'TALIA_TOPIC_DELTA_SENSITIVITY_AS_A_LOCAL_APPROXIMATION',tokens:['+0.40','+$0.50','+$0.20'],actual:()=>0.40*0.50,expected:0.20,limit:'local linear estimates'},
 {code:'TALIA_TOPIC_GAMMA_AND_THE_CHANGE_IN_DELTA',tokens:['0.05','+$2','+0.10'],actual:()=>0.05*2,expected:0.10},
 {code:'TALIA_TOPIC_VEGA_PER_VOLATILITY_POINT_VERSUS_PER_DECIMAL',tokens:['$0.12','+2-point','+$0.24'],actual:()=>0.12*2,expected:0.24},
 {code:'TALIA_TOPIC_THETA_INTERPRETATION_UNDER_STATED_TIME_UNITS',tokens:['-$0.04','-$0.12','three'],actual:()=>-0.04*3,expected:-0.12},
 {code:'TALIA_TOPIC_RHO_AND_INTEREST_RATE_SENSITIVITY',tokens:['+$0.05','two-point','+$0.10'],actual:()=>0.05*2,expected:0.10},
 {code:'TALIA_TOPIC_OPTION_OPEN_INTEREST_VERSUS_DAILY_VOLUME',tokens:['2,000 contracts','600 contracts','do not mean 2,600'],actual:()=>2000+600,expected:2600},
 {code:'TALIA_TOPIC_OPTION_PREMIUM_BID_ASK_SPREAD_IN_DOLLARS',tokens:['$1.20','$1.30','100-share','$10'],actual:()=>(1.30-1.20)*100,expected:10},
 {code:'TALIA_TOPIC_CASH_SECURED_SHORT_PUT_COLLATERAL_ILLUSTRATION',tokens:['$25','100','$2,500'],actual:()=>25*100,expected:2500},
 {code:'TALIA_TOPIC_COVERED_CALL_SHARES_PER_CONTRACT',tokens:['200 owned','two standard','100-share'],actual:()=>200/100,expected:2},
 {code:'TALIA_TOPIC_CREDIT_VERTICAL_SPREAD_MAXIMUM_LOSS_AT_EXPIRATION',tokens:['$5','$1.20','$3.80','$380'],actual:()=>[(5-1.2),(5-1.2)*100],expected:[3.8,380]},
 {code:'TALIA_TOPIC_DEBIT_VERTICAL_SPREAD_EXPIRATION_GAIN_CAP',tokens:['$5','$1.50','$3.50','$350'],actual:()=>[5-1.5,(5-1.5)*100],expected:[3.5,350]},
 {code:'TALIA_TOPIC_OPTION_PARITY_UNDER_ZERO_DIVIDEND_SIMPLIFICATION',tokens:['S=100','PV(K)=98','call=7','put=5'],actual:()=>7-(100-98),expected:5},
 {code:'TALIA_TOPIC_INTRINSIC_VERSUS_EXTRINSIC_VALUE_BEFORE_EXPIRATION',tokens:['$20','$23','$4.50','$3','$1.50'],actual:()=>[Math.max(23-20,0),4.5-Math.max(23-20,0)],expected:[3,1.5]},
 {code:'TALIA_TOPIC_CALENDAR_DAY_AND_TRADING_DAY_COUNTS_TO_EXPIRATION',tokens:['14 calendar','ten remaining','not interchangeable'],actual:()=>14>10,expected:true},
 {code:'TALIA_TOPIC_CONTRACT_MULTIPLIER_FOLLOWING_ADJUSTED_DELIVERABLES',tokens:['150 shares','$2','$300'],actual:()=>150*2,expected:300},
 {code:'TALIA_TOPIC_BREAK_EVEN_SHORT_PUT_AT_EXPIRATION',tokens:['$30','$2.00','$28'],actual:()=>30-2,expected:28},
 {code:'TALIA_TOPIC_BREAK_EVEN_SHORT_CALL_AT_EXPIRATION',tokens:['$20','$1.50','$21.50'],actual:()=>20+1.5,expected:21.5},
 {code:'TALIA_TOPIC_SHORT_OPTION_PREMIUM_CREDIT_IS_NOT_EARNED_PROFIT',tokens:['$1.20','100-share','$120','remains open'],actual:()=>1.2*100,expected:120},
 {code:'TALIA_TOPIC_OPTION_ASSIGNMENT_CASH_AND_STOCK_MECHANICS',tokens:['$25','100 shares','$2,500'],actual:()=>25*100,expected:2500},
 {code:'TALIA_TOPIC_IMPLIED_VOLATILITY_IS_MODEL_INFERRED_NOT_A_PRICE_FORECAST',tokens:['20%','30%','not a guaranteed'],actual:()=>20!==30,expected:true},
 {code:'TALIA_TOPIC_HISTORICAL_REALIZED_VOLATILITY_OF_SIMPLE_RETURNS',tokens:['+1%','-1%','population standard deviation 1 percentage point'],actual:()=>Math.sqrt((0.01**2+(-0.01)**2)/2)*100,expected:1},
 {code:'TALIA_TOPIC_ANNUALIZED_VARIANCE_VERSUS_ANNUALIZED_STANDARD_DEVIATION',tokens:['0.0001','252','0.0252','sqrt(0.0252)'],actual:()=>[0.0001*252,Math.sqrt(0.0001*252)],expected:[0.0252,Math.sqrt(0.0252)]},
 {code:'TALIA_TOPIC_IMPLIED_VOLATILITY_TERM_STRUCTURE',tokens:['30-day IV 25%','90-day IV 30%','5 percentage points'],actual:()=>30-25,expected:5},
 {code:'TALIA_TOPIC_VOLATILITY_SKEW_ACROSS_STRIKES',tokens:['35%','25%','10 percentage-point'],actual:()=>35-25,expected:10},
 {code:'TALIA_TOPIC_VARIANCE_VERSUS_VOLATILITY_QUOTE_UNITS',tokens:['20%=0.20','variance 0.04'],actual:()=>0.20**2,expected:0.04},
 {code:'TALIA_TOPIC_DELTA_NEUTRAL_HEDGE_APPROXIMATION',tokens:['+0.60','100-share','+60','short 60'],actual:()=>0.60*100,expected:60},
 {code:'TALIA_TOPIC_GAMMA_DOLLAR_EXPOSURE_CONVENTION',tokens:['0.02','100','$1','2 share-equivalents'],actual:()=>0.02*100*1,expected:2},
 {code:'TALIA_TOPIC_SIMPLE_STRANGLE_EXPIRATION_BREAKEVENS',tokens:['90','110','$5','85','115'],actual:()=>[90-5,110+5],expected:[85,115]},
 {code:'TALIA_TOPIC_LONG_STRADDLE_VERSUS_LONG_STRANGLE_INITIAL_COST',tokens:['$3','$4','$7','regardless'],actual:()=>3+4,expected:7},
 {code:'TALIA_TOPIC_IRON_CONDOR_EXPIRATION_MAXIMUM_PROFIT',tokens:['100-share','$1.25','$125'],actual:()=>1.25*100,expected:125},
 {code:'TALIA_TOPIC_IRON_CONDOR_WING_WIDTH_AND_LOSS_CAP',tokens:['$5','$1.20','$3.80'],actual:()=>5-1.2,expected:3.8},
 {code:'TALIA_TOPIC_CALENDAR_SPREAD_EXPIRATION_MISMATCH_RISK',tokens:['seven days','35 days','28 calendar days'],actual:()=>35-7,expected:28},
 {code:'TALIA_TOPIC_OPTIONS_CONTRACT_SETTLEMENT_MODE_DISTINCTION',tokens:['cash-settled','$3','100','$300'],actual:()=>3*100,expected:300},
 {code:'TALIA_TOPIC_AMERICAN_VERSUS_EUROPEAN_EXERCISE_STYLE',tokens:['American-style','early exercise','European-style','restricted'],actual:()=>true,expected:true},
 {code:'TALIA_TOPIC_EARLY_EXERCISE_AND_REMAINING_EXTRINSIC_PREMIUM',tokens:['$5.00','$4.00','$1.00','sacrificed'],actual:()=>5-4,expected:1},
 {code:'TALIA_TOPIC_OPTIONS_MARKET_MAKER_QUOTE_INVENTORY_UNCERTAINTY',tokens:['1.10','1.30','$0.20','no dealer net inventory'],actual:()=>1.30-1.10,expected:0.20},
 {code:'TALIA_TOPIC_OPTION_CONTRACT_NOTIONAL_DELTA_EXPOSURE',tokens:['Three long calls','+0.40','100','+120'],actual:()=>3*0.40*100,expected:120},
 {code:'TALIA_TOPIC_EXERCISE_BY_EXCEPTION_VERSUS_EXPLICIT_INSTRUCTIONS',tokens:['$0.02','may fall','actual handling requires'],actual:()=>true,expected:true},
 {code:'TALIA_TOPIC_OPTION_EXPIRATION_PAYOFF_VERSUS_PRE_EXPIRATION_MARK',tokens:['$50','$52','$2','$2.80','$0.80'],actual:()=>[52-50,2.80-(52-50)],expected:[2,0.80]},
 {code:'TALIA_TOPIC_OFFICIAL_VOLATILITY_INDEX_VERSUS_EDUCATIONAL_APPROXIMATION',tokens:['20% annualized','not the official Cboe VIX'],actual:()=>true,expected:true}
];
test('All 40 B21–B22 option and volatility topics have one canonical synthetic regression',()=>{
 assert.deepEqual(batches.map(x=>x.length),[20,20]);
 assert.equal(cases.length,40);
 assert.equal(new Set(cases.map(x=>x.code)).size,40);
 assert.deepEqual(cases.map(x=>x.code),lessons.map(x=>x.code));
});
for(const [i,s] of cases.entries()){
 test('Lesson '+(401+i)+' option and volatility teaching boundary: '+s.code,()=>{
  const g=lessons[i];
  assert.equal(g.code,s.code);
  assert.match(g.workedCase,/^FICTIONAL:/);
  for(const token of s.tokens)assert.ok(g.workedCase.includes(token),s.code+' missing datum '+token);
  const actual=s.actual(),expected=s.expected;
  if(typeof expected==='number')assert.ok(close(actual,expected),s.code+' calculation mismatch');
  else if(Array.isArray(expected)){assert.equal(actual.length,expected.length,s.code);for(let j=0;j<expected.length;j++)assert.ok(close(actual[j],expected[j]),s.code+' calculation '+j);}
  else assert.deepEqual(actual,expected,s.code);
  if(s.limit)assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.includes(s.limit),s.code+' missing model limitation');
  assert.equal(g.independentEditorialApproved,false,s.code);
  assert.equal(g.officialCompetency,false,s.code);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false,s.code);
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false,s.code);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false,s.code);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false,s.code);
  assert.match(g.sourceRightsStatus,/candidate|unverified|not_verified/,s.code);
  assert.ok(g.sourceUrls.length>0&&g.sourceUrls.every(u=>new URL(u).protocol==='https:'),s.code);
 });
}
test('No option expiry formula is accepted as an early assignment, broker execution, or VIX replication guarantee',()=>{
 assert.ok(lessons.every(g=>g.status.includes('pending_independent_editorial_review')));
 assert.ok(lessons.every(g=>g.workedCase.startsWith('FICTIONAL:')));
 assert.ok(lessons.every(g=>!g.independentEditorialApproved));
 assert.match(lessons[19].workedCase,/not a guaranteed/);
 assert.match(lessons[39].workedCase,/not the official Cboe VIX/);
});
