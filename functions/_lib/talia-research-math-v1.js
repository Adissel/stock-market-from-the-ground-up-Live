/* SMFGU-TALIA-RESEARCH-MATH-001
 * Independently authored, deterministic fictional Tutor calculations for
 * research-led Foundation teaching. No external data, trading, model,
 * personalized valuation, paid provider or protected grading.
 */
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const valid=(...numbers)=>numbers.every(finite);
export function grossMargin(revenue,cogs){
 if(!valid(revenue,cogs)||revenue<=0||cogs<0)return null;
 const grossProfit=revenue-cogs,percent=100*grossProfit/revenue;
 return valid(grossProfit,percent)?{grossProfit,percent}:null;
}
export function liquidityRatios(currentAssets,currentLiabilities){
 if(!valid(currentAssets,currentLiabilities)||currentAssets<0||currentLiabilities<=0)return null;
 const ratio=currentAssets/currentLiabilities,workingCapital=currentAssets-currentLiabilities;
 return valid(ratio,workingCapital)?{ratio,workingCapital}:null;
}
export function simplifiedEnterpriseValue(equity,interestDebt,excessCash){
 if(!valid(equity,interestDebt,excessCash)||[equity,interestDebt,excessCash].some(x=>x<0))return null;
 const result=equity+interestDebt-excessCash;
 return finite(result)?result:null;
}
export function basicWacc(equityWeight,costEquity,debtWeight,costDebt,taxRate){
 if(!valid(equityWeight,costEquity,debtWeight,costDebt,taxRate)||equityWeight<0||debtWeight<0||costEquity<0||costDebt<0||taxRate<0||taxRate>1||Math.abs(equityWeight+debtWeight-1)>1e-9)return null;
 const result=equityWeight*costEquity+debtWeight*costDebt*(1-taxRate);
 return finite(result)?result:null;
}
export function presentValue(cash,rate,periods){
 if(!valid(cash,rate)||rate<=-1||!Number.isInteger(periods)||periods<1||periods>100)return null;
 const result=cash/(1+rate)**periods;
 return finite(result)?result:null;
}
export function hypotheticalExpenseDrag(principal,grossRate,annualFee,years){
 if(!valid(principal,grossRate,annualFee)||principal<0||annualFee<0||annualFee>1||!Number.isInteger(years)||years<1||years>80||1+grossRate-annualFee<=0||1+grossRate<=0)return null;
 const gross=principal*(1+grossRate)**years,simplifiedNet=principal*(1+grossRate-annualFee)**years;
 return valid(gross,simplifiedNet)?{gross,simplifiedNet}:null;
}
export function indexPercentChange(earlier,later){
 if(!valid(earlier,later)||earlier<=0||later<0)return null;
 const change=100*(later/earlier-1);
 return finite(change)?change:null;
}
export function samplePearson(x,y){
 if(!Array.isArray(x)||!Array.isArray(y)||x.length!==y.length||x.length<2||x.some(v=>!finite(v))||y.some(v=>!finite(v)))return null;
 const mx=x.reduce((a,b)=>a+b,0)/x.length,my=y.reduce((a,b)=>a+b,0)/y.length;
 let cov=0,vx=0,vy=0;
 for(let i=0;i<x.length;i++){const dx=x[i]-mx,dy=y[i]-my;cov+=dx*dy;vx+=dx*dx;vy+=dy*dy;}
 const denom=Math.sqrt(vx)*Math.sqrt(vy); const result=denom>0?cov/denom:null;
 return finite(result)&&Math.abs(result)<=1+1e-10?Math.max(-1,Math.min(1,result)):null;
}
export function sampleSem(values){
 if(!Array.isArray(values)||values.length<2||values.some(v=>!finite(v)))return null;
 const m=values.reduce((a,b)=>a+b,0)/values.length;
 const variance=values.reduce((n,x)=>n+(x-m)**2,0)/(values.length-1);
 const sampleSd=Math.sqrt(variance),standardError=Math.sqrt(variance/values.length);
 return valid(m,variance,sampleSd,standardError)?{mean:m,sampleSd,standardError}:null;
}
/** Fictional historical sample Sharpe: matching periodic units, sample n-1 dispersion.
 * No annualization, external feed, private assessment, or investment recommendation.
 */
export function sampleSharpeFromReturns(returns,reference){
 if(!Array.isArray(returns)||returns.length<2||returns.length>10000||
  returns.some(v=>!finite(v))||!finite(reference))return null;
 const n=returns.length,mean=returns.reduce((a,b)=>a+b,0)/n;
 const sampleVariance=returns.reduce((a,b)=>a+(b-mean)**2,0)/(n-1);
 const sampleSD=Math.sqrt(sampleVariance);
 if(!finite(mean)||!finite(sampleVariance)||!finite(sampleSD)||sampleSD<=0)return null;
 const meanExcess=mean-reference,ratio=matchedSharpe(mean,reference,sampleSD);
 return ratio===null||!finite(meanExcess)||!finite(ratio)?null:
  {n,mean,reference,meanExcess,sampleVariance,sampleSD,ratio,annualized:false,sdConvention:'sample_n_minus_1'};
}
export function matchedSharpe(mean,reference,sd){
 if(!valid(mean,reference,sd)||sd<=0)return null;
 const ratio=(mean-reference)/sd;
 return finite(ratio)?ratio:null;
}
export function callDebitSpread(lowStrike,highStrike,premiumPaid,premiumReceived,multiplier=100){
 if(!valid(lowStrike,highStrike,premiumPaid,premiumReceived,multiplier)||lowStrike<0||highStrike<=lowStrike||premiumPaid<0||premiumReceived<0||multiplier<=0)return null;
 const debit=premiumPaid-premiumReceived,width=highStrike-lowStrike;
 if(debit<=0||debit>=width)return null;
 const maximumLoss=debit*multiplier,maximumGain=(width-debit)*multiplier,breakeven=lowStrike+debit;
 return valid(maximumLoss,maximumGain,breakeven)?{debit,width,maximumLoss,maximumGain,breakeven}:null;
}
export function longStraddle(strike,callPremium,putPremium,multiplier=100){
 if(!valid(strike,callPremium,putPremium,multiplier)||strike<0||callPremium<0||putPremium<0||multiplier<=0)return null;
 const debit=callPremium+putPremium;
 const lowerBreakeven=strike-debit>=0?strike-debit:null,upperBreakeven=strike+debit,maximumLoss=debit*multiplier;
 return valid(upperBreakeven,maximumLoss)?{debit,lowerBreakeven,upperBreakeven,maximumLoss}:null;
}
const cases=Object.freeze({
 TALIA_TOPIC_GROSS_MARGIN_COGS:[{revenue:100,cogs:65},{revenue:80,cogs:52}],
 TALIA_TOPIC_CURRENT_RATIO_WORKING_CAPITAL:[{assets:120,liabilities:80},{assets:90,liabilities:100}],
 TALIA_TOPIC_NET_DEBT_EV_BRIDGE:[{equity:500,debt:150,cash:50},{equity:300,debt:90,cash:30}],
 TALIA_TOPIC_WACC_CAPITAL_WEIGHTS:[{ew:.75,ke:.12,dw:.25,kd:.06,tax:.20},{ew:.60,ke:.10,dw:.40,kd:.05,tax:.25}],
 TALIA_TOPIC_DISCOUNT_SINGLE_CASHFLOW:[{cash:110,rate:.1,periods:1},{cash:121,rate:.1,periods:2}],
 TALIA_TOPIC_FUND_FEES_COMPOUNDING:[{principal:10000,gross:.05,fee:.01,years:5},{principal:10000,gross:.05,fee:.005,years:5}],
 TALIA_TOPIC_CPI_INDEX_MONTHLY_CHANGE:[{earlier:300,later:301.5},{earlier:250,later:251.25}],
 TALIA_TOPIC_CPI_TWELVE_MONTH_COMPARE:[{earlier:280,later:294},{earlier:260,later:273}],
 TALIA_TOPIC_CORRELATION_NOT_CAUSATION:[{x:[1,2,3],y:[2,4,6]},{x:[1,2,3],y:[6,4,2]}],
 TALIA_TOPIC_STANDARD_ERROR_SAMPLE:[{values:[1,2,3]},{values:[2,4,6,8]}],
 TALIA_TOPIC_SHARPE_SAMPLING_UNITS:[{mean:.01,reference:.002,sd:.02,returns:[-.01,.01,.03]},{mean:.008,reference:.003,sd:.025,returns:[-.017,.008,.033]}],
 TALIA_TOPIC_BULL_CALL_VERTICAL_DEBIT:[{low:50,high:55,paid:4,received:2},{low:40,high:45,paid:3,received:1.5}],
 TALIA_TOPIC_STRADDLE_EXPIRY_BOUNDS:[{strike:50,call:3,put:2},{strike:100,call:5,put:3}],
 TALIA_TOPIC_OPTION_VERTICAL_DEBIT_BREAKEVEN:[{low:60,high:65,paid:4.25,received:2},{low:70,high:75,paid:3,received:1.2}]
});
export const TALIA_RESEARCH_MATH_CODES=Object.freeze(Object.keys(cases));
const fixed=(x,d=4)=>Number(x).toFixed(d);
export function researchMathTeaching(code,question=''){
 const c=cases[String(code||'')];if(!c)return null;
 const another=/\b(?:another|different|fresh|try again|new example)\b/i.test(String(question));
 const x=c[another?1:0],steps=['Original independently calculated fictional Foundation example, not investment guidance or official mastery.'];
 if('revenue' in x){
  const v=grossMargin(x.revenue,x.cogs);
  steps.push('Revenue='+fixed(x.revenue,2)+' million; COGS='+fixed(x.cogs,2)+' million.',
   'Gross profit = revenue − COGS = '+fixed(v.grossProfit,2)+' million; gross margin = '+fixed(v.percent,2)+'%.');
 }else if('assets' in x){
  const v=liquidityRatios(x.assets,x.liabilities);
  steps.push('Current assets '+fixed(x.assets,2)+' million; current liabilities '+fixed(x.liabilities,2)+' million.',
   'Ratio=assets/liabilities='+fixed(v.ratio)+'; net working capital='+fixed(v.workingCapital,2)+' million.');
 }else if('equity' in x){
  steps.push('Equity cap '+x.equity+' million + debt '+x.debt+' million − excess cash '+x.cash+' million.',
   'Illustrative EV bridge = '+fixed(simplifiedEnterpriseValue(x.equity,x.debt,x.cash),2)+' million, excluding other claims.');
 }else if('ew' in x){
  const v=basicWacc(x.ew,x.ke,x.dw,x.kd,x.tax);
  steps.push('Market-value debt/equity weights '+fixed(x.dw)+' / '+fixed(x.ew)+'; costs '+fixed(x.kd)+' / '+fixed(x.ke)+'; marginal tax assumption '+fixed(x.tax)+'.',
   'Simplified WACC = equityWeight×costEquity + debtWeight×costDebt×(1−tax) = '+fixed(100*v,2)+'% per year.');
 }else if('cash' in x&&'periods' in x){
  steps.push('Cash '+fixed(x.cash,2)+' after '+x.periods+' period(s) at '+fixed(100*x.rate,2)+'% per period.',
   'PV = cash/(1+rate)^periods = '+fixed(presentValue(x.cash,x.rate,x.periods),4)+' hypothetical currency units.');
 }else if('principal' in x){
  const v=hypotheticalExpenseDrag(x.principal,x.gross,x.fee,x.years);
  steps.push('Hypothetical initial '+fixed(x.principal,2)+', gross rate '+fixed(100*x.gross,2)+'%, annual simplified fee '+fixed(100*x.fee,2)+'%, years '+x.years+'.',
   'Gross compounded value='+fixed(v.gross,2)+'; simplified net annual-drag value='+fixed(v.simplifiedNet,2)+'; this is not exact fund NAV accrual.');
 }else if('earlier' in x){
  steps.push('Compatible earlier index='+fixed(x.earlier,3)+'; later index='+fixed(x.later,3)+'.',
   'Percent change=(later/earlier−1)×100='+fixed(indexPercentChange(x.earlier,x.later),4)+'%; unchanged source base required.');
 }else if('x' in x){
  const v=samplePearson(x.x,x.y);
  steps.push('Paired X=['+x.x+'] and Y=['+x.y+'] (completed synchronized hypothetical observations).',
   'Pearson correlation='+fixed(v)+'. Sign and scale do not establish causality or future returns.');
 }else if('values' in x){
  const v=sampleSem(x.values);
  steps.push('Independent hypothetical sample ['+x.values+'] with n='+x.values.length+'.',
   'Sample mean='+fixed(v.mean)+'; sample SD='+fixed(v.sampleSd)+'; SEM=SD/sqrt(n)='+fixed(v.standardError)+'.');
 }else if('mean' in x){
  const v=sampleSharpeFromReturns(x.returns,x.reference);
  if(!v||Math.abs(v.mean-x.mean)>1e-10||Math.abs(v.sampleSD-x.sd)>1e-10)return null;
  steps.push('Completed hypothetical monthly returns ['+x.returns.map(r=>fixed(100*r,2)+'%').join(', ')+']; n='+v.n+'.',
   'Mean = sum(returns)/n = '+fixed(100*v.mean,2)+'% per month; matched risk-free comparison='+fixed(100*x.reference,2)+'% per month.',
   'Sample standard deviation = sqrt(sum((return−mean)^2)/(n−1)) = '+fixed(100*v.sampleSD,2)+' percentage points.',
   'Unannualized Sharpe = (mean−risk-free comparison)/sample SD = '+fixed(v.ratio)+' (dimensionless, not percentage return).',
   'Do not multiply by sqrt(12) without validating dependence, distribution, and period assumptions.');
 }else if('low' in x){
  const v=callDebitSpread(x.low,x.high,x.paid,x.received);
  steps.push('Fictional long call '+x.low+' premium '+fixed(x.paid,2)+'; short call '+x.high+' premium '+fixed(x.received,2)+'; same expiry and 100-share standard deliverable.',
   'Debit='+fixed(v.debit,2)+' per share; capped max gain='+fixed(v.maximumGain,2)+' dollars/contract; max debit loss='+fixed(v.maximumLoss,2)+' dollars/contract; expiration breakeven='+fixed(v.breakeven,2)+'.');
 }else if('strike' in x){
  const v=longStraddle(x.strike,x.call,x.put);
  steps.push('Fictional strike '+x.strike+', call premium '+fixed(x.call,2)+' and put premium '+fixed(x.put,2)+' per share.',
   'Combined debit='+fixed(v.debit,2)+'; expiration lower/upper breakeven='+fixed(v.lowerBreakeven,2)+' / '+fixed(v.upperBreakeven,2)+'; max standard-contract debit loss='+fixed(v.maximumLoss,2)+'.');
 }
 steps.push('Calculation boundary: exact source definitions, contract changes, forecast rates, vintage, and assumptions can change interpretations; no real-time price or personalized action.',
 'Independent transfer: modify one input and compute a new result, explaining why it is not a validated trading advantage.');
 return steps.join('\n\n');
}
