// Foundation 29-30: numerical, sequence-of-events and validity-boundary examples (561-600).
// Fictional cases; no independent source-rights/claims, editorial or publication acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const guides=[29,30].flatMap(n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides);
const near=(a,b)=>Math.abs(a-b)<1e-7;
const cases=[
 ['ENTRY_PRICE_VERSUS_QUOTED_PRICE',["60 shares","$10.04","40","$10.10","$10.064"],()=>(60*10.04+40*10.10)/100,10.064],
 ['CUMULATIVE_PARTIAL_FILL_RECONCILIATION',["500-share","180","320","still open"],()=>500-180,320],
 ['LIMIT_ORDER_PRICE_PROTECTION',["$24.50","$24.70","unfilled"],()=>24.7>24.5,true],
 ['STOP_TRIGGER_VERSUS_FILL_PRICE',["$15.00","$14.72","100 shares","$28"],()=>(15-14.72)*100,28],
 ['POSITION_SIZE_FROM_RISK_BUDGET',["$120","$0.75","160 shares"],()=>Math.floor(120/.75),160],
 ['PORTFOLIO_HEAT_OPEN_RISK',["$90","$140","$70","$300","1.5%"],()=>[90+140+70,(90+140+70)/20000*100],[300,1.5]],
 ['SCALE_IN_WEIGHTED_AVERAGE_COST',["100 shares","$12","50","$13","$12.3333"],()=>(100*12+50*13)/150,12.333333333333334],
 ['SCALE_OUT_REALIZED_AND_OPEN_QUANTITY',["300 shares","$10","120","$10.80","$96","180"],()=>[(10.8-10)*120,300-120],[96,180]],
 ['BREAK_EVEN_WITH_ROUND_TRIP_COSTS',["200 shares","$25","$8","$25.04"],()=>25+8/200,25.04],
 ['R_MULTIPLE_REALIZED_OUTCOME',["$150","$225","+1.5R"],()=>225/150,1.5],
 ['MAXIMUM_ADVERSE_EXCURSION',["$30","$29.25","$0.75","2.5%"],()=>[30-29.25,(30-29.25)/30*100],[0.75,2.5]],
 ['MAXIMUM_FAVORABLE_EXCURSION',["$12.50","$13.40","$0.90","7.2%"],()=>[13.4-12.5,(13.4-12.5)/12.5*100],[0.9,7.2]],
 ['TIME_STOP_ELAPSED_MARKET_MINUTES',["10:05","30 wall minutes","10:35","still requires"],()=>35-5,30],
 ['TRAILING_REFERENCE_NO_LOOKAHEAD',["$20.10","$20.25","$20.40","before the next bar"],()=>Math.min(20.1,20.25,20.4),20.1],
 ['GAP_RISK_POSITION_LOSS',["150-share","$22","$21.50","$20.90","$165"],()=>(22-20.9)*150,165],
 ['HALT_EXPOSURE_OPEN_POSITION',["200 shares","$9.60","unknown"],()=>null,null],
 ['SHORT_POSITION_BORROW_COST',["$5,000","18%","3/360","$7.50"],()=>5000*.18*3/360,7.5],
 ['SHORT_SQUEEZE_RISK_NOT_SIGNAL',["4 million","20 million","20%","no future"],()=>4/20*100,20],
 ['CORRELATED_POSITIONS_SHARED_RISK',["Three equal","4%","not create three independent"],()=>-4,-4],
 ['DAILY_LOSS_LIMIT_STATE',["−$180","−$20","−$200","exactly"],()=>-180-20,-200],
 ['RISK_OF_RUIN_MODEL_LIMIT',["+0.10R","55%","−0.04R","48%"],()=>[.55*1-.45*1,.48*1-.52*1],[0.1,-0.04]],
 ['EXPECTANCY_FROM_OUTCOME_DISTRIBUTION',["40%","+2R","50%","−1R","10%","+0.3R"],()=>.4*2+.5*(-1)+.1*0,0.3],
 ['WIN_RATE_SAMPLE_SIZE',["18 wins","30","60%","three open"],()=>18/30*100,60],
 ['PROFIT_FACTOR_DENOMINATOR',["$900","−$600","1.5"],()=>900/600,1.5],
 ['MAXIMUM_DRAWDOWN_PATH',["$12,000","$10,800","$1,200","10%"],()=>[12000-10800,(12000-10800)/12000*100],[1200,10]],
 ['RETURN_WITH_EXTERNAL_CASH_FLOW',["$10,000","$2,000","$12,600","5%"],()=>(12600-10000-2000)/(10000+2000)*100,5],
 ['ARITHMETIC_VERSUS_GEOMETRIC_RETURN',["+50%","−50%","0%","$75","−13.4%"],()=>[(50-50)/2,100*1.5*.5,(Math.sqrt(.75)-1)*100],[0,75,-13.397459621556141]],
 ['VOLATILITY_ANNUALIZATION_ASSUMPTION',["1.2%","√252","19.0%"],()=>1.2*Math.sqrt(252),19.04940943966505],
 ['SURVIVORSHIP_BIAS_SAMPLE',["Ten stocks","two delist","eight survivors","20%"],()=>2/10*100,20],
 ['LOOKAHEAD_BIAS_FILING_DATE',["March 31","May 8","April 15","cannot use"],()=>Date.parse('2026-04-15')<Date.parse('2026-05-08'),true],
 ['REVENUE_GROWTH_COMPARABLE_PERIODS',["$40m","$46m","15%"],()=>(46-40)/40*100,15],
 ['GROSS_MARGIN_UNITS',["$80m","$52m","$28m","35%"],()=>[80-52,(80-52)/80*100],[28,35]],
 ['OPERATING_CASH_FLOW_VERSUS_NET_INCOME',["$12m","$7m","$5m","not automatic fraud"],()=>12-7,5],
 ['CURRENT_RATIO_CLASSIFICATION',["$30m","$20m","1.5"],()=>30/20,1.5],
 ['DILUTED_EPS_SHARE_COUNT',["$10m","5m","$2.00"],()=>10/5,2],
 ['STOCK_SPLIT_PER_SHARE_COMPARABILITY',["3-for-1","100 shares","$60","300 shares","$20","$6,000"],()=>[100*60,300*20],[6000,6000]],
 ['CASH_DIVIDEND_EX_DATE_ADJUSTMENT',["$40","$39.60","$0.50","−1%","+0.25%"],()=>[(39.60-40)/40*100,(39.60+.50-40)/40*100],[-1,0.25]],
 ['RIGHTS_OFFERING_DILUTION_CONTEXT',["four old","2.5m","10m","25%"],()=>[10/4,(10/4)/10*100],[2.5,25]],
 ['REVERSE_SPLIT_MECHANICS',["1-for-10","1,000 shares","$0.80","100 shares","$8","$800"],()=>[1000*.8,100*8],[800,800]],
 ['FILING_AMENDMENT_VERSION_CONTROL',["May 1","12 units","May 10","10","May 5"],()=>Date.parse('2026-05-01')<Date.parse('2026-05-05')&&Date.parse('2026-05-05')<Date.parse('2026-05-10'),true],
];
test('40 unique risk, execution, reporting and chronology cases for lessons 561-600',()=>{
 assert.equal(cases.length,40);assert.equal(guides.length,40);
 assert.deepEqual(cases.map(c=>'TALIA_TOPIC_'+c[0]),guides.map(g=>g.code));
});
for(const [i,[suffix,tokens,compute,expected]] of cases.entries())test('Foundation lesson '+(561+i)+': '+suffix,()=>{
 const g=guides[i];assert.equal(g.code,'TALIA_TOPIC_'+suffix);
 assert.match(g.workedCase,/^FICTIONAL:/);
 for(const t of tokens)assert.ok(g.workedCase.includes(t),g.code+' missing scenario '+t);
 const actual=compute();
 if(typeof expected==='number')assert.ok(near(actual,expected),g.code+' numeric difference');
 else if(Array.isArray(expected)){assert.equal(actual.length,expected.length);for(let j=0;j<expected.length;j++)assert.ok(typeof expected[j]==='number'?near(actual[j],expected[j]):actual[j]===expected[j],g.code+' index '+j);}
 else assert.deepEqual(actual,expected,g.code);
 assert.equal(g.independentEditorialApproved,false);assert.equal(g.officialCompetency,false);
 assert.equal(g.editorSourceReview?.independentPublicationAccepted,false);
 assert.match(g.sourceRightsStatus,/not_verified/);
 assert.ok(g.sourceUrls?.length>0&&g.sourceUrls.every(u=>new URL(u).protocol==='https:'));
 assert.ok(g.status.includes('pending_independent_editorial_review'));
});
test('Unknown halt prices and unfiled disclosures must remain unknown',()=>{
 assert.equal(cases[15][2](),null);
 assert.equal(cases[29][2](),true);
 assert.match(guides[15].limit,/unknown|halt|quote|reopen|price|unavailable/i);
 assert.match(guides[39].workedCase,/May 5/);
});
