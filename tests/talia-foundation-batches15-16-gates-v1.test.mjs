import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8'));
const first=load('15'),second=load('16'),rows=[...first.guides,...second.guides];
test('40 original Foundation lessons: source and ungraded integrity',()=>{
 assert.equal(first.count,20);assert.equal(second.count,20);assert.equal(rows.length,40);
 assert.equal(new Set(rows.map(x=>x.code)).size,40);
 assert.equal(new Set(rows.map(x=>x.title.toLowerCase())).size,40);
 for(const x of rows){
  assert.match(x.code,/^TALIA_TOPIC_[A-Z0-9_]+$/);
  for(const key of ['title','concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
    assert.ok(typeof x[key]==='string'&&x[key].length>(key==='title'?15:25),x.code+': '+key);
  assert.match(x.workedCase,/FICTIONAL/);
  assert.match(x.transferQuestion,/FICTIONAL/);
  assert.equal(x.officialCompetency,false);
  assert.equal(x.foundationTopic,true);
  assert.equal(x.independentEditorialApproved,false);
  assert.equal(x.editorSourceReview.independentPublicationAccepted,false);
  assert.ok(x.sourceUrls.every(url=>url.startsWith('https://')));
 }
});
test('existing Tutor and production build both reference the new source batches',()=>{
 const tutor=readFileSync(new URL('../functions/_lib/original-competency-tutor-v014100.js',import.meta.url),'utf8');
 const build=readFileSync(new URL('../scripts/build-pages.sh',import.meta.url),'utf8');
 const workflow=readFileSync(new URL('../.github/workflows/learning-tutor-v01492.yml',import.meta.url),'utf8');
 for(const name of ['talia-foundation-explanations-batch15-v1.json','talia-foundation-explanations-batch16-v1.json']){
  assert.ok(tutor.includes(name));assert.ok(build.includes(name)||build.includes('talia-foundation-explanations-batch{01..30}-v1.json'),'Bash copy range must include '+name);assert.ok(workflow.includes('data/'+name));
 }
});
test('independent fictional arithmetic spot-checks',()=>{
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} vs ${b}`);
 near((20.1+20.3)/2,20.2);
 near(((50.1-49.9)/50)*10000,40);
 near((25.08-25)*80,6.4);
 near((10.2-10)*100-4,16);
 near(Math.min(8000,6000)/40000,.15);
 near(.25*.08,.02);
 near((12400-10000-2000)/10000,.04);
 near(560/(560+300),.6511627906976745);
 near(3000/(3000+1000),.75);
 near(250/750,1/3);
 near((40+60+80)/3,60);
 near((300+100)/(150+50),2);
 near(30-28.5,1.5);
 near(31.2-30,1.2);
 near(40*.5+2,22);
 near(Math.floor((505-5)/24),20);
 near(25/(75+25),.25);
 near((10*20+2)/10,20.2);
 near(1000/50000,.02);
 near(1200000*20,24000000);
 near(1.1*1.1-1,.21);
 near(.01*Math.sqrt(252),.15874507866387544);
 near(Math.log(1.1)+Math.log(1.1),Math.log(1.21));
 near(4/Math.sqrt(4),2);
 near((4+0+4)/3,8/3);
 near(2/1,2);
 near(98.5*5000/100,4925);
 near(1000*.06/2,30);
 near(30*.5,15);
 near(980+12,992);
 near(-5*.002,-.01);
 near(.7*2+.3*8,3.8);
 near(50+40-30,60);
 near((1000-600-250)/1000,.15);
 near(5000000/100000000,.05);
 near(365/(1200/300),91.25);
 near(10000*.073*10/365,20);
 near(1/4,.25);
});

test('Nine scoped Foundation Batch15 references remain ungraded and publication-held',()=>{
 const expected=new Map([["TALIA_TOPIC_MIDPOINT_BETWEEN_TWO_QUOTES","https://www.investor.gov/introduction-investing/investing-basics/glossary/ask-price"],["TALIA_TOPIC_RELATIVE_QUOTED_SPREAD_IN_BASIS_POINTS","https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions/frequently-asked-questions-rule-605-regulation-nms"],["TALIA_TOPIC_PRICE_IMPACT_MEASURED_FROM_AN_ARRIVAL_BENCHMARK","https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order"],["TALIA_TOPIC_DOLLAR_COST_OF_AN_INCOMPLETE_ROUND_TRIP","https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated"],["TALIA_TOPIC_ASSET_WEIGHT_DRIFT_AFTER_A_DECLINE","https://www.investor.gov/introduction-investing/getting-started/asset-allocation"],["TALIA_TOPIC_EQUITY_DRAWDOWN_RECOVERY_AMOUNT","https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/ulcer-index"],["TALIA_TOPIC_DOLLAR_RISK_INCLUDING_A_FIXED_EXIT_FEE","https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated"],["TALIA_TOPIC_FEE_ADJUSTED_BREAK_EVEN_SALE_PRICE","https://www.investor.gov/introduction-investing/getting-started/understanding-fees"],["TALIA_TOPIC_MARKET_CAPITALIZATION_AFTER_NEW_SHARE_ISSUANCE","https://www.investor.gov/introduction-investing/investing-basics/glossary/market-capitalization"]]);
 assert.equal(expected.size,9);
 for(const [code,url] of expected){
  const g=first.guides.find(z=>z.code===code);
  assert.ok(g,code+' must exist');
  assert.deepEqual(g.sourceUrls,[url]);
  assert.equal(g.previousGenericSourceUrl,'https://www.investor.gov/introduction-investing');
  assert.ok(g.sourceResearchTriage.supportedScope.length>45);
  assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.length>45);
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
 }
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10);
 near((20.1+20.3)/2,20.2);
 near(((50.1-49.9)/50)*10000,40);
 near((25.08-25)*80,6.4);
 near((10.2-10)*100-4,16);
 near(560/(560+300),0.6511627906976745);
 near(250/750,1/3);
 near(40*.5+2,22);
 near((10*20+1+1)/10,20.2);
 near(1200000*20,24000000);
});

test('Remaining eleven Batch15 lessons have scoped research and mathematical holds',()=>{
 const expected=new Map([["TALIA_TOPIC_PORTFOLIO_TURNOVER_AS_THE_LESSER_FLOW_CONVENTION","https://www.sec.gov/Archives/edgar/data/2062986/000119312525068685/d940677dn1a.htm"],["TALIA_TOPIC_RETURN_CONTRIBUTION_IN_PERCENTAGE_POINTS","https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/portfolio-performance-evaluation"],["TALIA_TOPIC_PERCENTAGE_CHANGE_IN_ACCOUNT_EQUITY_EXCLUDING_DEPOSITS","https://www.investor.gov/better-understanding-your-brokerage-account-statement"],["TALIA_TOPIC_PORTFOLIO_CASH_WITHDRAWAL_AND_CONCENTRATION","https://www.investor.gov/better-understanding-your-brokerage-account-statement"],["TALIA_TOPIC_AVERAGE_DOLLAR_LOSS_PER_LOSING_TRADE","https://www.quantconnect.com/docs/v2/cloud-platform/api-reference/backtest-management/read-backtest/backtest-statistics"],["TALIA_TOPIC_PROFIT_FACTOR_FROM_CLOSED_TRADES","https://www.quantconnect.com/docs/v2/cloud-platform/api-reference/backtest-management/read-backtest/backtest-statistics"],["TALIA_TOPIC_MAXIMUM_FAVORABLE_EXCURSION_FOR_A_SHORT","https://www.quantconnect.com/docs/v2/cloud-platform/api-reference/backtest-management/read-backtest/trades"],["TALIA_TOPIC_MAXIMUM_ADVERSE_EXCURSION_FOR_A_SHORT","https://www.quantconnect.com/docs/v2/cloud-platform/api-reference/backtest-management/read-backtest/trades"],["TALIA_TOPIC_MAXIMUM_WHOLE_SHARES_WITH_FIXED_PER_ORDER_CHARGES","https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated"],["TALIA_TOPIC_BREAK_EVEN_FRACTION_WITH_UNEQUAL_WIN_AND_LOSS","https://www.quantconnect.com/docs/v2/cloud-platform/api-reference/backtest-management/read-backtest/backtest-statistics"],["TALIA_TOPIC_PARTICIPATION_FRACTION_OF_ELIGIBLE_INTERVAL_VOLUME","https://www.sec.gov/reports/report-practice-preferencing"]]);
 assert.equal(expected.size,11);
 assert.equal(first.guides.filter(g=>g.sourceResearchTriage).length,20);
 assert.equal(first.guides.filter(g=>g.sourceUrls[0]==='https://www.investor.gov/introduction-investing').length,0);
 for(const [code,url] of expected){
  const g=first.guides.find(z=>z.code===code);
  assert.ok(g,code);
  assert.deepEqual(g.sourceUrls,[url]);
  assert.equal(g.previousGenericSourceUrl,'https://www.investor.gov/introduction-investing');
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
  assert.ok(g.sourceResearchTriage.supportedScope.length>45);
  assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.length>45);
 }
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10);
 near(Math.min(8000,6000)/40000,.15);
 near(.25*.08,.02);
 near((12400-10000-2000)/10000,.04);
 near(3000/(3000+1000),.75);
 near((40+60+80)/3,60);
 near((300+100)/(150+50),2);
 near(30-28.5,1.5);
 near(31.2-30,1.2);
 near(Math.floor((505-5)/24),20);
 near(25/(75+25),.25);
 near(1000/50000,.02);
 const helper=readFileSync(new URL('../functions/_lib/original-competency-tutor-v014100.js',import.meta.url),'utf8');
 assert.match(helper,/\'www\.cfainstitute\.org\'/);
});

test('Batch16 source-specific mathematical and publication holds',()=>{
 assert.equal(second.guides.length,20);
 assert.equal(second.guides.filter(g=>g.sourceResearchTriage).length,20);
 for(const g of second.guides){
  assert.equal(g.previousGenericSourceUrl,'https://www.investor.gov/introduction-investing');
  assert.equal(g.sourceUrls.length,1);
  assert.ok(g.sourceUrls[0].startsWith('https://'));
  assert.notEqual(g.sourceUrls[0],g.previousGenericSourceUrl);
  assert.ok(g.sourceResearchTriage.supportedScope.length>45);
  assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.length>45);
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
 }
 const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-9,x+' != '+y);
 near(1.1*1.1-1,.21);near(.01*Math.sqrt(252),.15874507866387544);
 near(Math.log(110/100)+Math.log(121/110),Math.log(121/100));
 near(4/Math.sqrt(4),2);near(8/3,2.6666666666666665);
 near(8/(3-1),4);near((-1*1+0+1*-1)/2,-1);
 near(2/1,2);near(5000*98.5/100,4925);near(1000*.06/2,30);
 near(30*.5,15);near(980+12,992);near(-5*.002,-.01);
 near(.7*2+.3*8,3.8);near(50+40-30,60);
 near((1000-600)/1000,.4);near((1000-600-250)/1000,.15);
 near(5/100,.05);near(365/(1200/300),91.25);
 near(10000*.073*10/365,20);near(1/4,.25);
 const validator=readFileSync(new URL('../functions/_lib/original-competency-tutor-v014100.js',import.meta.url),'utf8');
 assert.ok(validator.includes("'accruedinterest.nga.finra.org'"));
});
