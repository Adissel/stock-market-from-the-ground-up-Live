import test from 'node:test';
import assert from 'node:assert/strict';
import {compareOriginalFictionalCases,WORKBENCH_SCHEMA}
 from '../functions/_lib/learning-lab-enterprise-case-workbench-v1.js';
const make=(name,delta=0)=>({caseId:name,evidence:{provenance:'fictional',
 asOf:15000,completedIndex:14,
 bars:Array.from({length:17},(_,i)=>({timestamp:(i+1)*1000,
  open:100+i+delta,high:102+i+delta,low:99+i+delta,
  close:101+i+delta,volume:100+i*5}))}});
test('Two aligned original fictional cases compare training-only values and keep held-out outcomes secret',()=>{
 const x=compareOriginalFictionalCases({cases:[make('ORIGINAL_A'),make('ORIGINAL_B',2)]});
 assert(x);assert.equal(x.schema,WORKBENCH_SCHEMA);assert.equal(x.cases.length,2);
 assert.deepEqual(x.cases.map(z=>z.trainingCount),[9,9]);
 assert.deepEqual(x.cases.map(z=>z.embargoCount),[2,2]);
 assert.deepEqual(x.cases.map(z=>z.heldOutEvaluationCount),[4,4]);
 assert.equal(x.cases[1].trainingMean-x.cases[0].trainingMean,2);
 assert.equal(x.cases[1].trainingOnlyIndicators.EMA-x.cases[0].trainingOnlyIndicators.EMA,2);
 assert.equal(x.holdoutValuesReturned,false);assert.equal(x.graded,false);
 assert.equal(x.masteryAwarded,false);assert.equal(x.persisted,false);
 assert(!Object.hasOwn(x.cases[0],'heldOutValues'));
 assert.equal(Object.isFrozen(x.cases),true);
});
test('Original fictional cases ignore future suffix but reject lookahead once made visible',()=>{
 const before=compareOriginalFictionalCases({cases:[make('ORIGINAL_A'),make('ORIGINAL_B',1)]});
 assert(before);
 const b=make('ORIGINAL_B',1);
 b.evidence.bars[16]={...b.evidence.bars[16],high:999999};
 const after=compareOriginalFictionalCases({cases:[make('ORIGINAL_A'),b]});
 assert.deepEqual(before,after);
 b.evidence.asOf=17000;b.evidence.completedIndex=16;
 assert.equal(compareOriginalFictionalCases({cases:[make('ORIGINAL_A'),b]}),null);
});
test('Duplicate IDs, misaligned timestamps, rights forgery, nonpositive prices and invalid embargo are rejected',()=>{
 const cases=[make('ORIGINAL_A'),make('ORIGINAL_B',1)];
 assert.equal(compareOriginalFictionalCases({cases:[cases[0],cases[0]]}),null);
 cases[1].evidence.bars[4].timestamp=5001;
 assert.equal(compareOriginalFictionalCases({cases}),null);
 const original=make('ORIGINAL_A'),other=make('ORIGINAL_B');
 for(const forbidden of [{externalSource:'https://feed.invalid'},{marketDataRights:'verified'},
  {providerUrl:'https://foo.invalid'},{licensedHistorical:true}]){
  assert.equal(compareOriginalFictionalCases({cases:[original,{...other,...forbidden}]}),null);
 }
 other.evidence.bars[1].low=0;
 assert.equal(compareOriginalFictionalCases({cases:[original,other]}),null);
 assert.equal(compareOriginalFictionalCases({cases:[original,make('ORIGINAL_B')],embargo:0}),null);
});
