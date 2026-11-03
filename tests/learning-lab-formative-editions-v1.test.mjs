import test from 'node:test';
import assert from 'node:assert/strict';
import {capabilityCatalog,recommendFormativeRoute,completedReplayPrefix,compareFictionalRiskCases}
 from '../functions/_lib/learning-lab-formative-editions-v1.js';

test('four cumulative editions never grant premium, mastery, or grades',()=>{
 const editions=capabilityCatalog();
 assert.deepEqual(editions.map(x=>x.edition),['BASIC','ADVANCED','PROFESSIONAL','ENTERPRISE']);
 assert.equal(editions[0].features.includes('independent_transfer'),true);
 assert.equal(editions[3].features.includes('research_provenance'),true);
 for(const x of editions){
  assert.equal(x.released,false);
  assert.equal(x.grantsEntitlement,false);
  assert.equal(x.writesOfficialGrades,false);
  assert.equal(Object.isFrozen(x.features),true);
 }
});
test('only reviewed evidence changes a formative recommendation, never mastery',()=>{
 const competencies=[{id:'VWAP',prerequisites:['CANDLE','VOLUME','VOLUME']},{id:'EMA',prerequisites:['CANDLE']}];
 const route=recommendFormativeRoute({competencies,observations:[
  {competencyId:'EMA',reviewed:false,kind:'formative_observation',outcome:'needs_review'},
  {competencyId:'VWAP',reviewed:true,kind:'formative_observation',outcome:'needs_review'},
  {competencyId:'EMA',reviewed:true,kind:'self_rating',outcome:'needs_review'}
 ]});
 assert.equal(route.length,1);
 assert.equal(route[0].competencyId,'VWAP');
 assert.deepEqual(route[0].prerequisites,['CANDLE','VOLUME']);
 assert.deepEqual(route[0].sequence,['CANDLE','VOLUME','VWAP']);
 assert.equal(route[0].changesMastery,false);
 assert.equal(route[0].changesAccess,false);
 assert.deepEqual(recommendFormativeRoute({competencies,observations:[]}),[]);
});
test('replay reveals completed prefix, cannot mutate future or reveal hidden suffix',()=>{
 const bars=[10,11,12].map((v,i)=>({timestamp:i+1,open:v,high:v+1,low:v-1,close:v,volume:100}));
 const visible=completedReplayPrefix({bars,lastCompletedIndex:1,provenance:'fictional'});
 assert.equal(visible.bars.length,2);
 assert.equal(visible.futureBarsIncluded,false);
 assert.equal(visible.bars.some(b=>b.timestamp===3),false);
 assert.equal(completedReplayPrefix({bars,lastCompletedIndex:3,provenance:'fictional'}),null);
 assert.equal(completedReplayPrefix({bars,lastCompletedIndex:1,provenance:'licensed_historical'}),null);
 assert.equal(completedReplayPrefix({bars:[{...bars[0],high:8}],lastCompletedIndex:0,provenance:'fictional'}),null);
 assert.equal(completedReplayPrefix({bars,lastCompletedIndex:1,provenance:'licensed_historical',rights:'verified_for_requested_use'})?.bars.length,2);
});
test('fictional risk scenarios have bounded, deterministic whole shares',()=>{
 const cases=compareFictionalRiskCases([{entry:40,stop:38,riskBudget:100,availableCash:1000}]);
 assert.equal(cases[0].shares,25);
 assert.equal(cases[0].plannedRisk,50);
 assert.equal(cases[0].exposure,1000);
 assert.equal(compareFictionalRiskCases([{entry:40,stop:40,riskBudget:100,availableCash:1000}]),null);
 assert.equal(compareFictionalRiskCases([{entry:40,stop:38,riskBudget:NaN,availableCash:1000}]),null);
});
