import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 grossMargin,liquidityRatios,simplifiedEnterpriseValue,basicWacc,presentValue,
 hypotheticalExpenseDrag,indexPercentChange,samplePearson,sampleSem,matchedSharpe,sampleSharpeFromReturns,
 callDebitSpread,longStraddle,researchMathTeaching,TALIA_RESEARCH_MATH_CODES
} from '../functions/_lib/talia-research-math-v1.js';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-8,'value='+x+' expected='+y);
test('Income, liquidity, EV and simple WACC use consistent valid denominators and capital weights',()=>{
 const g=grossMargin(100,65);near(g.grossProfit,35);near(g.percent,35);
 const cr=liquidityRatios(120,80);near(cr.ratio,1.5);near(cr.workingCapital,40);
 near(simplifiedEnterpriseValue(500,150,50),600);
 near(basicWacc(.75,.12,.25,.06,.2),.102);
 near(basicWacc(.6,.1,.4,.05,.25),.075);
 assert.equal(grossMargin(0,10),null);assert.equal(liquidityRatios(10,0),null);
 assert.equal(basicWacc(.5,.12,.6,.05,.2),null);
 assert.equal(simplifiedEnterpriseValue(100,-1,5),null);
});
test('PV, hypothetical annual fund fee compounding and compatible CPI rates have explicit boundaries',()=>{
 near(presentValue(110,.1,1),100);near(presentValue(121,.1,2),100);
 assert.equal(presentValue(100,-1,1),null);assert.equal(presentValue(100,.1,0),null);
 const fee=hypotheticalExpenseDrag(10000,.05,.01,5);
 near(fee.gross,10000*Math.pow(1.05,5));near(fee.simplifiedNet,10000*Math.pow(1.04,5));
 assert.ok(fee.gross>fee.simplifiedNet);
 assert.equal(hypotheticalExpenseDrag(10000,.05,1.5,5),null);
 near(indexPercentChange(300,301.5),.5);near(indexPercentChange(280,294),5);
 assert.equal(indexPercentChange(0,300),null);
});
test('Sample dispersion, correlation and Sharpe-like ratio reject degenerate statistical samples',()=>{
 near(samplePearson([1,2,3],[2,4,6]),1);
 near(samplePearson([1,2,3],[6,4,2]),-1);
 assert.equal(samplePearson([1,1,1],[2,3,4]),null);
 assert.equal(samplePearson([1,2],[1]),null);
 const sem=sampleSem([1,2,3]);near(sem.mean,2);near(sem.sampleSd,1);near(sem.standardError,1/Math.sqrt(3));
 assert.equal(sampleSem([1]),null);
 near(matchedSharpe(.01,.002,.02),.4);
 near(matchedSharpe(.008,.003,.025),.2);
 const sample=sampleSharpeFromReturns([.01,.03,.02,.04],.005);
 near(sample.mean,.025);near(sample.ratio,1.5491933384829668);
 assert.equal(sample.annualized,false);
 assert.equal(sampleSharpeFromReturns([.01,.01,.01],0),null);
 assert.equal(sampleSharpeFromReturns([.01],0),null);
 assert.match(researchMathTeaching('TALIA_TOPIC_SHARPE_SAMPLING_UNITS'),/Sample standard deviation/);
 assert.match(researchMathTeaching('TALIA_TOPIC_SHARPE_SAMPLING_UNITS'),/Unannualized Sharpe/);
 assert.equal(matchedSharpe(.01,.002,0),null);
});
test('Options expiration arithmetic honors net debit, width, standard multiplier and invalid contracts',()=>{
 const vertical=callDebitSpread(50,55,4,2);
 near(vertical.debit,2);near(vertical.maximumLoss,200);near(vertical.maximumGain,300);near(vertical.breakeven,52);
 const second=callDebitSpread(40,45,3,1.5);
 near(second.maximumLoss,150);near(second.maximumGain,350);near(second.breakeven,41.5);
 assert.equal(callDebitSpread(50,50,4,2),null);
 assert.equal(callDebitSpread(50,55,7,1),null);
 const straddle=longStraddle(50,3,2);
 near(straddle.debit,5);near(straddle.lowerBreakeven,45);near(straddle.upperBreakeven,55);near(straddle.maximumLoss,500);
 assert.equal(longStraddle(-1,3,2),null);
});
test('All fourteen new numerical guides have alternate original fictional teaching and never leak protected answers',()=>{
 assert.equal(TALIA_RESEARCH_MATH_CODES.length,14);
 assert.equal(new Set(TALIA_RESEARCH_MATH_CODES).size,14);
 const file=JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch05-v1.json',import.meta.url),'utf8'));
 for(const code of TALIA_RESEARCH_MATH_CODES){
  const g=file.guides.find(x=>x.code===code);assert.ok(g,code);
  const first=researchMathTeaching(code,'Explain the example');
  const second=researchMathTeaching(code,'Try another example');
  assert.notEqual(first,second,'Alternate teaching must not repeat inputs');
  for(const text of [first,second]){
   assert.match(text,/fictional/i);assert.match(text,/not investment guidance|not investment guidance or official mastery|not investment guidance/i);
   assert.doesNotMatch(text,/guaranteed profit|verified live trade|mastery awarded/i);
  }
  assert.ok(answerFromGuide(g,'explain','','Explain '+g.title).includes(first));
  assert.ok(answerFromGuide(g,'explain','','Try another example: '+g.title).includes(second));
  assert.doesNotMatch(answerFromGuide(g,'question','','Explain '+g.title),/Original independent calculation and units/);
  assert.doesNotMatch(answerFromGuide(g,'review','incorrect',''),/Original independent calculation and units/);
 }
 assert.equal(researchMathTeaching('TALIA_TOPIC_UNREGISTERED'),null);
});
