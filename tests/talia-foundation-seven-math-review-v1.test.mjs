// SMFGU-TALIA-REVIEW-MATH-7-001 — independent first-seven research-math boundary checks.
// Mathematical and input-boundary acceptance, not verification of third-party source rights.
import test from 'node:test';
import assert from 'node:assert/strict';
import {grossMargin,liquidityRatios,simplifiedEnterpriseValue,basicWacc,presentValue,hypotheticalExpenseDrag,indexPercentChange} from '../functions/_lib/talia-research-math-v1.js';
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(b)),label+' '+a+' != '+b);
test('1. Gross margin: independent percentage arithmetic, negative earnings and zero/overflow',()=>{
 let a=grossMargin(80,100);near(a.grossProfit,-20,'loss');near(a.percent,-25,'percentage');
 near(grossMargin(100,60).percent,40,'ordinary');
 assert.equal(grossMargin(0,0),null);
 assert.equal(grossMargin(Infinity,20),null);
 assert.equal(grossMargin(1e-300,1e300),null,'overflowed percent must not become a lesson');
});
test('2. Liquidity ratio: working capital can be negative but invalid denominator must be rejected',()=>{
 const r=liquidityRatios(90,100);near(r.ratio,.9,'current ratio');near(r.workingCapital,-10,'capital');
 assert.equal(liquidityRatios(10,0),null);
 assert.equal(liquidityRatios(-1,10),null);
 assert.equal(liquidityRatios(1e308,1e-308),null,'overflowed ratio');
});
test('3. Simplified enterprise-value bridge: sign of excess cash and numeric overflow',()=>{
 near(simplifiedEnterpriseValue(300,90,30),360,'EV');
 near(simplifiedEnterpriseValue(100,0,150),-50,'negative simplified EV not itself impossible');
 assert.equal(simplifiedEnterpriseValue(-1,100,20),null);
 assert.equal(simplifiedEnterpriseValue(1e308,1e308,0),null);
});
test('4. WACC: weights sum to one, tax boundaries and rate units',()=>{
 near(basicWacc(.75,.12,.25,.06,.2),.102,'WACC decimal');
 near(basicWacc(.6,.1,.4,.05,.25),.075,'alternate');
 assert.equal(basicWacc(.6,.1,.39,.05,.25),null);
 assert.equal(basicWacc(.5,.1,.5,.05,-.01),null);
 assert.equal(basicWacc(.5,1e308,.5,1e308,.25),null,'overflow');
});
test('5. PV: 0% rate, negative but greater than -100%, invalid horizon and overflow',()=>{
 near(presentValue(100,0,3),100,'zero rate');
 near(presentValue(100,-.5,1),200,'negative discount');
 assert.equal(presentValue(100,-1,1),null);
 assert.equal(presentValue(100,0,0),null);
 assert.equal(presentValue(100,0,101),null);
 assert.equal(presentValue(1e308,-.99,90),null,'unrepresentable PV');
});
test('6. Annual expense drag: total horizon exponent, zero-fee identity and overflow',()=>{
 const r=hypotheticalExpenseDrag(10000,.05,.01,5);
 near(r.gross,10000*(1.05**5),'gross');
 near(r.simplifiedNet,10000*(1.04**5),'net');
 near(hypotheticalExpenseDrag(10000,.05,0,5).gross,hypotheticalExpenseDrag(10000,.05,0,5).simplifiedNet,'zero fee');
 assert.equal(hypotheticalExpenseDrag(10000,-1,.01,3),null);
 assert.equal(hypotheticalExpenseDrag(1e308,1,.1,80),null,'unrepresentable accumulation');
});
test('7. Percent change: base period is denominator and zero/overflow input is invalid',()=>{
 near(indexPercentChange(300,301.5),.5,'monthly');
 near(indexPercentChange(280,294),5,'matched annual');
 near(indexPercentChange(200,0),-100,'loss of whole index');
 assert.equal(indexPercentChange(0,100),null);
 assert.equal(indexPercentChange(-1,100),null);
 assert.equal(indexPercentChange(1e-300,1e300),null,'unrepresentable ratio');
});
