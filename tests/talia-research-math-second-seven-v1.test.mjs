import test from 'node:test';
import assert from 'node:assert/strict';
import {samplePearson,sampleSem,matchedSharpe,callDebitSpread,longStraddle,researchMathTeaching,TALIA_RESEARCH_MATH_CODES} from '../functions/_lib/talia-research-math-v1.js';
const near=(a,b)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<1e-8, String(a)+' ≠ '+b);
test('08 matched-period CPI variant uses baseline denominator',()=>{
 for(const [early,later,expected] of [[280,294,5],[260,273,5]])near(100*(later/early-1),expected);
 assert.match(researchMathTeaching('TALIA_TOPIC_CPI_TWELVE_MONTH_COMPARE'),/5\.0000%/);
});
test('09 Pearson correlation rejects constant and unmatched arrays, and preserves signs',()=>{
 near(samplePearson([1,2,3],[2,4,6]),1);near(samplePearson([1,2,3],[6,4,2]),-1);
 assert.equal(samplePearson([1,1,1],[1,2,3]),null);
 assert.equal(samplePearson([1,2],[1]),null);
 assert.equal(samplePearson([1e308,1e308/2],[1,2]),null);
 assert.notEqual(researchMathTeaching('TALIA_TOPIC_CORRELATION_NOT_CAUSATION'),researchMathTeaching('TALIA_TOPIC_CORRELATION_NOT_CAUSATION','another'));
});
test('10 standard error uses n-1 sample variance and sqrt(n), rejects invalid and overflowing',()=>{
 const x=sampleSem([1,2,3]);near(x.mean,2);near(x.sampleSd,1);near(x.standardError,1/Math.sqrt(3));
 assert.equal(sampleSem([1]),null);assert.equal(sampleSem([1,NaN]),null);
 assert.equal(sampleSem([1e308,-1e308]),null);
 assert.match(researchMathTeaching('TALIA_TOPIC_STANDARD_ERROR_SAMPLE'),/SEM=SD\/sqrt\(n\)/);
});
test('11 matched Sharpe uses identical return frequency and nonzero dispersion',()=>{
 near(matchedSharpe(.01,.002,.02),.4);near(matchedSharpe(.008,.003,.025),.2);
 assert.equal(matchedSharpe(.01,.002,0),null);assert.equal(matchedSharpe(.01,.002,-1),null);
 assert.equal(matchedSharpe(1e308,-1e308,1),null);
});
test('12 call debit spread enforces same expiry conceptual boundary and finite width and premiums',()=>{
 const x=callDebitSpread(50,55,4,2);near(x.debit,2);near(x.maximumLoss,200);near(x.maximumGain,300);near(x.breakeven,52);
 assert.equal(callDebitSpread(50,50,4,2),null);assert.equal(callDebitSpread(50,55,7,1),null);
 assert.equal(callDebitSpread(1,1e308,1e308,0,100),null);
});
test('13 long straddle expiry bounds correctly handle lower bound below zero',()=>{
 const x=longStraddle(50,3,2);near(x.lowerBreakeven,45);near(x.upperBreakeven,55);near(x.maximumLoss,500);
 assert.equal(longStraddle(3,3,2).lowerBreakeven,null);
 assert.equal(longStraddle(50,-1,3),null);
 assert.equal(longStraddle(1e308,1e308,1e308),null);
});
test('14 vertical expiration breakeven uses actual net debit and multiplier',()=>{
 const x=callDebitSpread(60,65,4.25,2);near(x.debit,2.25);near(x.breakeven,62.25);near(x.maximumGain,275);near(x.maximumLoss,225);
 assert.equal(callDebitSpread(70,70,3,1.2),null);
 const names=TALIA_RESEARCH_MATH_CODES.slice(7);
 assert.equal(names.length,7);
 for(const name of names){const a=researchMathTeaching(name),b=researchMathTeaching(name,'try another example');assert.notEqual(a,b,name);assert.match(a,/fictional/i);assert.doesNotMatch(a,/mastery awarded|guaranteed gains/i)}
});
