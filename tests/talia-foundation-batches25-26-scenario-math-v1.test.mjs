// Foundation 25-26 (lessons 481-520): independently recomputed fictional scenario fixtures.
// Not a claim-specific reference audit, trade recommendation, rights approval, or release signoff.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const guides=[25,26].flatMap(n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides);
const near=(a,b)=>Math.abs(a-b)<1e-7;
const cases=[
 ['POSITION_SIZE_FROM_FIXED_DOLLAR_RISK',["$25.00","$24.50","200 shares"],()=>100/(25-24.5),200],
 ['POSITION_SIZE_ROUNDING_DOWN',["187.5","187","$74.80"],()=>[Math.floor(75/.4),Math.floor(75/.4)*.4],[187,74.8]],
 ['GAP_RISK_BEYOND_STOP',["$19.50","$19.10","$90"],()=>[100*(20-19.5),100*(20-19.1)],[50,90]],
 ['PORTFOLIO_HEAT_SUM',["$60","$80","$40","$180"],()=>60+80+40,180],
 ['RISK_PERCENT_OF_EQUITY',["$120","$24,000","0.5%"],()=>120/24000*100,0.5],
 ['REWARD_RISK_RATIO',["$39.20","$41.60","2.0"],()=>(41.6-40)/(40-39.2),2],
 ['BREAKEVEN_WIN_RATE',["$150","$100","40%"],()=>100/(150+100)*100,40],
 ['EXPECTANCY_PER_TRADE',["45%","$120","55%","$70","$15.50"],()=>.45*120-.55*70,15.5],
 ['MAXIMUM_DRAWDOWN',["$10,500","$9,450","10%"],()=>[(10500-9450),(10500-9450)/10500*100],[1050,10]],
 ['RECOVERY_PERCENT_AFTER_LOSS',["$10,000","$8,000","25%"],()=>2000/8000*100,25],
 ['LIMIT_ORDER_PRICE_BOUNDARY',["$15.00","$14.98","not above"],()=>14.98<=15&&15<=15&&15.01>15,true],
 ['MARKET_ORDER_EXECUTION_UNCERTAINTY',["100 shares","50","10.0267"],()=>(100*10+50*10.08)/150,10.026666666666667],
 ['BID_ASK_SPREAD_COST',["$30.00","$30.10","$5"],()=>[30.1-30,(30.1+30)/2-30,100*((30.1+30)/2-30)],[0.1,0.05,5]],
 ['SLIPPAGE_BASIS_POINTS',["$50.00","$50.10","20 bps"],()=>(50.1-50)/50*10000,20],
 ['VOLUME_WEIGHTED_AVERAGE_FILL',["50 shares","$9.90","150","$10.10","$10.05"],()=>(50*9.9+150*10.1)/200,10.05],
 ['PARTIAL_FILL_REMAINING_QUANTITY',["500 shares","120","180","remaining"],()=>[120+180,500-120-180],[300,200]],
 ['STOP_LIMIT_TRIGGER_AND_LIMIT',["$19.50","$19.40","$19.20"],()=>19.2<19.4,true],
 ['TRAILING_STOP_REFERENCE',["$1 trail","$25","$24","$26.20","$25.20"],()=>[25-1,26.2-1],[24,25.2]],
 ['ORDER_CANCELLATION_RACE',["200-share","50-share","30-share","120"],()=>200-50-30,120],
 ['TIME_IN_FORCE_BOUNDARY',["day limit","0 of 100"],()=>100-0,100],
 ['CURRENT_RATIO',["$9 million","$6 million","1.50"],()=>9/6,1.5],
 ['QUICK_RATIO',["$3m","$4m","$5m","1.40"],()=>(3+4)/5,1.4],
 ['WORKING_CAPITAL',["$12m","$9m","$3m"],()=>12-9,3],
 ['GROSS_MARGIN',["$20m","$12m","$8m","40%"],()=>[20-12,(20-12)/20*100],[8,40]],
 ['OPERATING_MARGIN',["$2.4m","$16m","15%"],()=>2.4/16*100,15],
 ['NET_MARGIN',["$1.2m","$24m","5%"],()=>1.2/24*100,5],
 ['REVENUE_GROWTH_RATE',["$40m","$46m","15%"],()=>(46-40)/40*100,15],
 ['EPS_BASIC_VERSUS_DILUTED',["$10m","5m basic","6m diluted","$1.67"],()=>[10/5,10/6],[2,1.6666666666666667]],
 ['FREE_CASH_FLOW_SIMPLIFIED',["$7m","$2m","$5m"],()=>7-2,5],
 ['CASH_RUNWAY_SIMPLE',["$12m","$3m","4 quarters"],()=>12/3,4],
 ['DEBT_TO_EQUITY',["$18m","$12m","1.50"],()=>18/12,1.5],
 ['INTEREST_COVERAGE',["$6m","$2m","3.0"],()=>6/2,3],
 ['INVENTORY_TURNOVER',["$24m","$6m","4.0"],()=>24/6,4],
 ['RECEIVABLE_DAYS',["$5m","$50m","36.5 days"],()=>5/50*365,36.5],
 ['BOOK_VALUE_PER_SHARE',["$45m","15m","$3.00"],()=>45/15,3],
 ['PRICE_TO_EARNINGS',["$30","$2","15×"],()=>30/2,15],
 ['PRICE_TO_SALES',["$120m","$60m","2.0×"],()=>120/60,2],
 ['ENTERPRISE_VALUE_SIMPLE',["$100m","$30m","$20m","$110m"],()=>100+30-20,110],
 ['EV_TO_SALES',["$150m","$75m","2.0×"],()=>150/75,2],
 ['SHARE_COUNT_DILUTION_RATE',["20m","25m","25%"],()=>(25-20)/20*100,25],
];
test('40 independent synthetic order-risk/financial-ratio fixtures retain lesson identity',()=>{
 assert.equal(guides.length,40);assert.equal(cases.length,40);
 assert.deepEqual(cases.map(c=>'TALIA_TOPIC_'+c[0]),guides.map(g=>g.code));
});
for(const [i,[suffix,tokens,compute,expected]] of cases.entries())test('Foundation lesson '+(481+i)+': '+suffix,()=>{
 const g=guides[i];assert.equal(g.code,'TALIA_TOPIC_'+suffix);
 assert.match(g.workedCase,/^FICTIONAL:/);
 for(const t of tokens)assert.ok(g.workedCase.includes(t),g.code+' missing scenario '+t);
 const actual=compute();
 if(typeof expected==='number')assert.ok(near(actual,expected),g.code+' numeric mismatch');
 else if(Array.isArray(expected)){assert.equal(actual.length,expected.length);for(let j=0;j<expected.length;j++)assert.ok(typeof expected[j]==='number'?near(actual[j],expected[j]):actual[j]===expected[j],g.code+' item '+j);}
 else assert.deepEqual(actual,expected,g.code);
 assert.equal(g.independentEditorialApproved,false);assert.equal(g.officialCompetency,false);
 assert.equal(g.editorSourceReview?.independentPublicationAccepted,false);
 assert.equal(g.sourceResearchTriage?.independentMathAccepted,false);
 assert.equal(g.sourceResearchTriage?.independentPublicationApproved,false);
 assert.equal(g.sourceResearchTriage?.sourceRedistributionRightsCleared,false);
 assert.match(g.sourceRightsStatus,/not_verified/);
 assert.ok(g.sourceUrls?.length>0&&g.sourceUrls.every(x=>new URL(x).protocol==='https:'));
});
