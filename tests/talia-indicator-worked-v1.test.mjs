import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {elderRayExample,vortexExample,volumeIndexExample,ulcerExample,easeOfMovementExample,choppinessExample,fisherNormalizedExample,indicatorWorkedTeaching,TALIA_STUDY_CALCULATED} from '../functions/_lib/talia-indicator-worked-v1.js';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,'computed '+a+' expected '+b);
const guides=JSON.parse(readFileSync(new URL('../data/tutor-indicator-expansion-v1.json',import.meta.url),'utf8')).guides;
test('Elder-Ray, Vortex, NVI, PVI and Ulcer formula examples compute from completed inputs with zero denominator guards',()=>{
 const elder=elderRayExample(10.5,9.6,10);near(elder.bull,.5);near(elder.bear,-.4);
 assert.equal(elderRayExample(1,3,2),null);
 const bars=[{high:10.2,low:9.8,close:10},{high:10.5,low:9.9,close:10.3},{high:10.8,low:10.1,close:10.7}];
 const v=vortexExample(bars,2);
 near(v.trueRangeSum,1.3);near(v.plus,1.6/1.3);near(v.minus,.7/1.3);
 assert.equal(vortexExample(bars.slice(0,2),2),null);
 assert.equal(vortexExample(Array.from({length:3},()=>({high:10,low:10,close:10})),2),null);
 const prices=[10,11,10.5,12],volume=[100,80,120,90];
 const n=volumeIndexExample(prices,volume,'NVI');const p=volumeIndexExample(prices,volume,'PVI');
 near(n.series[1],1100);near(n.series[2],1100);near(n.value,1100*12/10.5);
 near(p.series[1],1000);near(p.series[2],1000*10.5/11);near(p.value,p.series[2]);
 assert.equal(n.updates,2);assert.equal(p.updates,1);
 assert.equal(volumeIndexExample(prices,volume,'NVI',0),null);
 near(ulcerExample([-10,-5,0]),Math.sqrt(125/3));
 assert.equal(ulcerExample([-1,1]),null);
});
test('Eight indicator source-only examples use distinct fictional cases and never claim Chart Studio overlay or official grading',()=>{
 assert.equal(TALIA_STUDY_CALCULATED.length,8);assert.equal(new Set(TALIA_STUDY_CALCULATED).size,8);
 for(const id of TALIA_STUDY_CALCULATED){
  const g=guides.find(x=>x.code===id);assert.ok(g,'New source guide required '+id);
  const first=indicatorWorkedTeaching(id,'Explain source calculation');
  const second=indicatorWorkedTeaching(id,'Try another worked example');
  assert.notEqual(first,second,id+' second fictional scenario must differ');
  for(const result of [first,second]){
   assert.match(result,/Original fictional numerical indicator teaching/);
   assert.match(result,/ungraded/);
   assert.match(result,/Limitation: different period/);
   assert.doesNotMatch(result,/buy now|guaranteed|future price confirmed|protected assessment answer key/i);
  }
  const explanation=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(explanation.includes(first),'Guide must render computed source-only example');
  const another=answerFromGuide(g,'explain','','Try another worked example: '+g.title);
  assert.ok(another.includes(second),'Guide must render a distinct case');
  assert.doesNotMatch(answerFromGuide(g,'question','','Explain '+g.title),/Verified fictional calculation exercise/);
  assert.doesNotMatch(answerFromGuide(g,'review','My reasoning',''),/Verified fictional calculation exercise/);
 }
});

test('EMV scale/zero-volume, CHOP warmup and normalized Fisher enforce numerical boundaries',()=>{
 const up=easeOfMovementExample(10.2,9.8,10.7,10.1,1200,10000);
 near(up.movement,.4);near(up.boxRatio,.2);near(up.value,2);
 const down=easeOfMovementExample(20.6,20,20.3,19.5,800,10000);
 near(down.value,-4);
 assert.equal(easeOfMovementExample(10,9,10,10,1000,10000),null);
 assert.equal(easeOfMovementExample(10,9,10.5,9.5,0,10000),null);
 const bars=[{high:10.2,low:9.8,close:10},{high:10.6,low:9.9,close:10.4},{high:10.8,low:10.1,close:10.7}];
 const v=choppinessExample(bars,2);
 near(v.sum,1.4);near(v.range,.9);
 near(v.value,100*Math.log10(1.4/.9)/Math.log10(2));
 assert.equal(choppinessExample(bars.slice(0,2),2),null);
 assert.equal(choppinessExample(Array(3).fill({high:1,low:1,close:1}),2),null);
 near(fisherNormalizedExample(.5),.5*Math.log(3));
 near(fisherNormalizedExample(-.5),-.5*Math.log(3));
 assert.equal(fisherNormalizedExample(1),null);
 assert.equal(fisherNormalizedExample(-1),null);
});
