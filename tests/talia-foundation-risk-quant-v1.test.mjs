import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 technicalRiskDistance,sharesFromRiskBudget,buyingPowerShareCap,concentrationShareCap,
 volumeParticipationCap,restrictiveShareCap,hypotheticalLongStress,grossNetReward,
 conditionalRewardRisk,foundationRiskTeaching,FOUNDATION_RISK_MATH_TOPICS
} from '../functions/_lib/talia-foundation-risk-quant-v1.js';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,'expected '+b+' received '+a);
test('Risk arithmetic applies strict positive distance, whole shares and independently binding caps',()=>{
 close(technicalRiskDistance('long',10,9.7),.3);
 close(technicalRiskDistance('short',10,10.6),.6);
 assert.equal(technicalRiskDistance('short',10,9),null);
 assert.equal(technicalRiskDistance('long',10,10),null);
 assert.equal(sharesFromRiskBudget(75,.4),187);
 assert.equal(sharesFromRiskBudget(45,.28),160);
 assert.equal(sharesFromRiskBudget(75,0),null);
 assert.equal(buyingPowerShareCap(2000,20),100);
 assert.equal(concentrationShareCap(10000,.1,20),50);
 assert.equal(volumeParticipationCap(10000,.02),200);
 assert.equal(restrictiveShareCap([187,100,50,200]),50);
 assert.equal(restrictiveShareCap([120,80,100,60]),60);
 assert.equal(restrictiveShareCap([100,null,40]),null);
 assert.equal(volumeParticipationCap(-1,.02),null);
});
test('Stress-fill loss, cost-adjusted reward and conditional ratio disclose gaps without guaranteed stop-price fills',()=>{
 const stress=hypotheticalLongStress(10,9.8,9.2,100);
 close(stress.planned,20);close(stress.stress,80);
 assert.equal(hypotheticalLongStress(10,10.1,9.2,100),null);
 assert.deepEqual(grossNetReward(10,10.5,.06),{gross:.5,net:.5-.06});
 const rr=conditionalRewardRisk(.5,.2,.06,.05);
 close(rr.reward,.44);close(rr.loss,.25);close(rr.ratio,1.76);
 assert.equal(conditionalRewardRisk(.5,0,.06,.05),null);
});
test('Nine new mathematical Tutor topics have separate original fictional cases, no paid provider or mastery claims',()=>{
 assert.equal(FOUNDATION_RISK_MATH_TOPICS.length,9);
 const j=JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch04-v1.json',import.meta.url),'utf8'));
 for(const code of FOUNDATION_RISK_MATH_TOPICS){
  const g=j.guides.find(x=>x.code===code);
  assert.ok(g,code);
  const a=foundationRiskTeaching(code,'Explain the calculation');
  const b=foundationRiskTeaching(code,'Try another example');
  assert.notEqual(a,b,'Independent fictional case must differ '+code);
  assert.match(a,/ungraded/i);
  assert.match(b,/fictional/i);
  assert.match(a,/stops may fill beyond trigger or fail to execute/);
  const rendered=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(rendered.includes(a));
  assert.doesNotMatch(answerFromGuide(g,'question','','Explain '+g.title),/Original independent calculation and units/);
  assert.doesNotMatch(answerFromGuide(g,'review','My thinking',''),/Original independent calculation and units/);
  assert.doesNotMatch(rendered,/guaranteed profit|verified strategy edge|official mastery awarded/i);
 }
 assert.equal(foundationRiskTeaching('TALIA_TOPIC_UNKNOWN'),null);
});
