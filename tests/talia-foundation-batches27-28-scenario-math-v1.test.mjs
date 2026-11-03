// Foundation 27-28: independent synthetic return-statistics and portfolio/corporate-action mathematics.
// This validates stated fictional conventions only, NOT financial advice, rights, publication, or real-market accuracy.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const guides=[27,28].flatMap(n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides);
const close=(a,b)=>Math.abs(a-b)<1e-7;
const cases=[
 ['ARITHMETIC_MEAN_RETURN',["2%","−1%","3%","1.33%"],()=>(2-1+3)/3,1.3333333333333333],
 ['GEOMETRIC_MEAN_RETURN',["+10%","−10%","0.99","−0.50%"],()=>(Math.sqrt(1.1*.9)-1)*100,-0.5012562893380035],
 ['COMPOUND_CUMULATIVE_RETURN',["+5%","+4%","−2%","7.016%"],()=>(1.05*1.04*.98-1)*100,7.016],
 ['LOG_RETURN',["$50","$52","3.922%"],()=>Math.log(52/50)*100,3.922071315328133],
 ['SAMPLE_VARIANCE',["2,4,6","8","variance=8/(3−1)=4"],()=>[ (2+4+6)/3,((2-4)**2+(4-4)**2+(6-4)**2)/2 ],[4,4]],
 ['STANDARD_DEVIATION_OF_RETURNS',["0.0004","0.02=2%"],()=>Math.sqrt(.0004)*100,2],
 ['DOWNSIDE_DEVIATION',["2%","−3%","−1%","1.826%"],()=>Math.sqrt((.03**2+.01**2)/3)*100,1.8257418583505536],
 ['COVARIANCE',["0.0002","population covariance"],()=>((.02*.01)+(-.02)*(-.01))/2,0.0002],
 ['CORRELATION_COEFFICIENT',["0.00015","0.02","0.01","0.75"],()=>.00015/(.02*.01),0.75],
 ['BETA_FROM_COVARIANCE',["0.0003","0.0002","1.5"],()=>.0003/.0002,1.5],
 ['ALPHA_SIMPLE_REGRESSION',["1.2%","1.1","0.8%","0.32%"],()=>1.2-1.1*.8,0.32],
 ['SHARPE_RATIO_SIMPLE',["1.0%","0.2%","2.0%","0.40"],()=>(1-.2)/2,0.4],
 ['SORTINO_RATIO_SIMPLE',["0.9%","0.1%","1.6%","0.50"],()=>(.9-.1)/1.6,0.5],
 ['CALMAR_RATIO_SIMPLE',["12%","20%","0.60"],()=>12/20,0.6],
 ['VALUE_AT_RISK_HISTORICAL_QUANTILE',["Twenty","5%","−4%","4%"],()=>20*.05,1],
 ['EXPECTED_SHORTFALL_SIMPLE',["−6%","−4%","−2%","average is −4%"],()=>(-6-4-2)/3,-4],
 ['TRACKING_ERROR',["1%","−1%","0%","1%"],()=>Math.sqrt((.01**2+(-.01)**2)/2)*100,1],
 ['INFORMATION_RATIO',["0.4%","1.0%","0.40"],()=>.4/1,0.4],
 ['UP_CAPTURE_RATIO',["12%","10%","120%"],()=>12/10*100,120],
 ['DOWN_CAPTURE_RATIO',["−6%","−10%","60%"],()=>-6/-10*100,60],
 ['PORTFOLIO_WEIGHT_FROM_MARKET_VALUE',["$12,000","$60,000","20%"],()=>12000/60000*100,20],
 ['WEIGHTED_PORTFOLIO_RETURN',["60%","40%","5%","−2%","2.2%"],()=>.6*5+.4*(-2),2.2],
 ['REBALANCE_TRADE_AMOUNT',["$100,000","30%","$24,000","$6,000"],()=>100000*.3-24000,6000],
 ['CONCENTRATION_HERFINDAHL_INDEX',["50%,30%,20%","0.38"],()=>.5**2+.3**2+.2**2,0.38],
 ['EQUAL_WEIGHT_ALLOCATION',["$24,000","6 holdings","$4,000","16.67%"],()=>[24000/6,100/6],[4000,16.666666666666668]],
 ['RISK_CONTRIBUTION_SIMPLE',["30%","20%","6 percentage-point"],()=>.3*20,6],
 ['CASH_WEIGHT',["$8,000","$40,000","20%"],()=>8000/40000*100,20],
 ['TURNOVER_RATIO_SIMPLE',["$30,000","$25,000","$100,000","25%"],()=>Math.min(30000,25000)/100000*100,25],
 ['DIVIDEND_YIELD',["$0.25","$1","$20","5%"],()=>.25*4/20*100,5],
 ['PAYOUT_RATIO_SIMPLE',["$4m","$10m","40%"],()=>4/10*100,40],
 ['EX_DIVIDEND_PRICE_ADJUSTMENT',["$30","$0.40","$29.60"],()=>30-.4,29.6],
 ['SPLIT_ADJUSTED_SHARE_COUNT',["200 shares","$50","400","$25","$10,000"],()=>[200*50,400*25],[10000,10000]],
 ['RIGHTS_OFFERING_SUBSCRIPTION_RATIO',["5 rights","500 rights","100 shares"],()=>500/5,100],
 ['WARRANT_INTRINSIC_VALUE',["$12","$10","$2"],()=>Math.max(12-10,0),2],
 ['CONVERTIBLE_CONVERSION_SHARES',["$1,000","$20","50 shares"],()=>1000/20,50],
 ['OPTION_CONTRACT_NOTIONAL',["2 contracts","100 shares","$30","$6,000"],()=>2*100*30,6000],
 ['CALL_INTRINSIC_VALUE',["$55","$50","$5","$500"],()=>[Math.max(55-50,0),Math.max(55-50,0)*100],[5,500]],
 ['PUT_INTRINSIC_VALUE',["$40","$36","$4","$400"],()=>[Math.max(40-36,0),Math.max(40-36,0)*100],[4,400]],
 ['OPTION_BREAKEVEN_AT_EXPIRATION',["$50","$3","$53"],()=>50+3,53],
 ['OPTION_PREMIUM_TOTAL_COST',["$1.25","×100×3","$375"],()=>1.25*100*3,375],
];
test('40 independent statistical and allocation scenario fixtures preserve chronology and identities',()=>{
 assert.equal(guides.length,40);assert.equal(cases.length,40);
 assert.deepEqual(cases.map(c=>'TALIA_TOPIC_'+c[0]),guides.map(g=>g.code));
});
for(const [i,[suffix,tokens,compute,expected]] of cases.entries())test('Foundation lesson '+(521+i)+': '+suffix,()=>{
 const g=guides[i];assert.equal(g.code,'TALIA_TOPIC_'+suffix);assert.match(g.workedCase,/^FICTIONAL:/);
 for(const t of tokens)assert.ok(g.workedCase.includes(t),g.code+' missing scenario '+t);
 const actual=compute();
 if(typeof expected==='number')assert.ok(close(actual,expected),g.code+' result');
 else if(Array.isArray(expected)){assert.equal(actual.length,expected.length);for(let j=0;j<expected.length;j++)assert.ok(typeof expected[j]==='number'?close(actual[j],expected[j]):actual[j]===expected[j],g.code+' result '+j);}
 else assert.deepEqual(actual,expected,g.code);
 assert.equal(g.independentEditorialApproved,false);assert.equal(g.officialCompetency,false);
 assert.equal(g.editorSourceReview?.independentPublicationAccepted,false);
 assert.equal(g.sourceResearchTriage?.independentMathAccepted,false);
 assert.equal(g.sourceResearchTriage?.independentPublicationApproved,false);
 assert.equal(g.sourceResearchTriage?.sourceRedistributionRightsCleared,false);
 assert.match(g.sourceRightsStatus,/not_verified/);
 assert.ok(g.sourceUrls?.length>0&&g.sourceUrls.every(u=>new URL(u).protocol==='https:'));
});
