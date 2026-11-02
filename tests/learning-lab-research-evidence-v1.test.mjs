import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeFictionalOutcomes,chronologicalHoldout,researchCaseManifest,compareModelSensitivity}
 from '../functions/_lib/learning-lab-research-evidence-v1.js';
test('synthetic statistical summary is finite and cannot claim official mastery',()=>{
 const x=summarizeFictionalOutcomes({values:[1,2,3,4],source:'fictional_constructed_no_feed'});
 assert.equal(x.n,4);assert.equal(x.mean,2.5);assert.equal(x.officialMastery,false);
 assert.equal(x.sampleVariance,5/3);
 assert.equal(summarizeFictionalOutcomes({values:[1,2],source:'unauthorized_feed'}),null);
 assert.equal(summarizeFictionalOutcomes({values:[1,Infinity],source:'fictional_constructed_no_feed'}),null);
});
test('chronological holdout separates train embargo and test without overlap',()=>{
 const x=chronologicalHoldout({sampleCount:20,trainCount:12,embargo:2});
 assert.deepEqual(x.train,{start:0,endExclusive:12});
 assert.deepEqual(x.embargo,{start:12,endExclusive:14});
 assert.deepEqual(x.test,{start:14,endExclusive:20});
 assert.equal(chronologicalHoldout({sampleCount:10,trainCount:9}),null);
 assert.equal(chronologicalHoldout({sampleCount:20,trainCount:12,embargo:-1}),null);
});
test('manifest blocks unverified data rights, is nonpersistent and unpublished',()=>{
 const x=researchCaseManifest({caseId:'case-1',methodVersion:'v1.0',datasetId:'synthetic-1',
  source:'fictional_constructed_no_feed',rights:'fictional_original',assumptions:['Zero trading costs']});
 assert.equal(x.publicationApproved,false);assert.equal(x.persisted,false);
 assert.equal(researchCaseManifest({caseId:'case-1',methodVersion:'v1',datasetId:'data',
  source:'historical_authorized',rights:'fictional_original'}),null);
});
test('model sensitivity forbids fabricated independent validation claims',()=>{
 const holdout=chronologicalHoldout({sampleCount:20,trainCount:12,embargo:2});
 const result=compareModelSensitivity({holdout,candidates:[
  {id:'caseA',testOutcomes:[1,2,3]},{id:'caseB',testOutcomes:[2,3,4]}]});
 assert.equal(result.rows.length,2);
 assert.equal(result.selectionOnTestSetInvalidatesIndependentHoldout,true);
 assert.equal(result.officialGrade,false);
 assert.equal(compareModelSensitivity({holdout:{...holdout,overlapping:true},
  candidates:[{id:'a',testOutcomes:[1,2]},{id:'b',testOutcomes:[2,3]}]}),null);
});
