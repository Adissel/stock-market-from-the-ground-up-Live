import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyEditionAuthorization,advancedFormativeStudy,professionalDecisionStudy,
 enterpriseResearchStudy,runEditionExercise,deriveFictionalCompletedStudies,deriveFictionalCompletedFrames,EDITION_SCHEMA} from '../functions/_lib/learning-lab-edition-exercises-v1.js';
const id='11111111-1111-4111-8111-111111111111',other='22222222-2222-4222-8222-222222222222';
const now=1800000000000,days=86400000;
const fictional=()=>({provenance:'fictional',asOf:6000,completedIndex:4,
 bars:Array.from({length:7},(_,i)=>({timestamp:1000*(i+1),open:100+i,high:102+i,low:99+i,close:101+i,volume:100+i*10}))});
const indicators=()=>[{name:'EMA',value:103.25,asOf:5000,method:'SMA seed then exponential smoothing',verified:true},
 {name:'RSI',value:59.5,asOf:5000,method:'Wilder smoothing',verified:true}];
const observations=[{kind:'formative_observation',competencyId:'EMA',reviewed:true,outcome:'needs_review'}];
const competencies=[{id:'EMA',prerequisites:['CANDLE','CANDLE','VOLUME']}];
const riskCases=[{entry:40,stop:38,riskBudget:100,availableCash:1000}];
const frames=[{label:'5m completed frame',completedThrough:5000,close:102,sourceVerified:true}];
const grant=(family='learning',edition='ADVANCED',who=id)=>({memberId:who,family,edition,serverVerified:true,revoked:false,expiresAt:now+days});
const auth=(family='learning',edition='ADVANCED')=>verifyEditionAuthorization({actorId:id,family,requested:edition,planTarget:edition,grant:grant(family,edition),releaseEnabled:true,now});
test('unrecognized account, absent flag, and bare policy target never authorize premium',()=>{
 assert.equal(verifyEditionAuthorization({actorId:'-',family:'learning',requested:'ADVANCED',planTarget:'ADVANCED',grant:grant(),releaseEnabled:true,now}).ok,false);
 assert.equal(verifyEditionAuthorization({actorId:id,family:'learning',requested:'ADVANCED',planTarget:'ADVANCED',grant:grant(),releaseEnabled:false,now}).ok,false);
 assert.equal(verifyEditionAuthorization({actorId:id,family:'learning',requested:'ADVANCED',planTarget:'ADVANCED',releaseEnabled:true,now}).ok,false);
});
test('positive authorization matches member, family, tier, date and explicit grant',()=>{
 const a=auth();assert.equal(a.ok,true);assert.equal(a.graded,false);assert.equal(a.masteryAwarded,false);
 for(const bad of [
  {actorId:other,family:'learning',requested:'ADVANCED',planTarget:'ADVANCED',grant:grant(),releaseEnabled:true,now},
  {actorId:id,family:'lab',requested:'ADVANCED',planTarget:'ADVANCED',grant:grant(),releaseEnabled:true,now},
  {actorId:id,family:'learning',requested:'PROFESSIONAL',planTarget:'ADVANCED',grant:grant(),releaseEnabled:true,now},
  {actorId:id,family:'learning',requested:'ENTERPRISE',planTarget:'ENTERPRISE',grant:grant('learning','PROFESSIONAL'),releaseEnabled:true,now},
  {actorId:id,family:'learning',requested:'ADVANCED',planTarget:'ADVANCED',grant:{...grant(),revoked:true},releaseEnabled:true,now},
  {actorId:id,family:'learning',requested:'ADVANCED',planTarget:'ADVANCED',grant:{...grant(),expiresAt:now},releaseEnabled:true,now},
  {actorId:id,family:'learning',requested:'ADVANCED',planTarget:'ADVANCED',grant:{...grant(),serverVerified:false},releaseEnabled:true,now},
 ])assert.equal(verifyEditionAuthorization(bad).ok,false,JSON.stringify(bad));
});
test('verified higher tier grants can use cumulative lower edition only if requested',()=>{
 const a=verifyEditionAuthorization({actorId:id,family:'lab',requested:'ADVANCED',planTarget:'PROFESSIONAL',
 grant:grant('lab','PROFESSIONAL'),releaseEnabled:true,now});assert.equal(a.ok,true);
 assert.equal(a.edition,'ADVANCED');
});
test('reviewed observations produce deduplicated Advanced remediation',()=>{
 const v=advancedFormativeStudy({competencies,observations,evidence:fictional(),indicators:indicators()});
 assert.equal(v.schema,EDITION_SCHEMA);assert.equal(v.evidence.sampleSize,5);
 assert.equal(v.remediation.length,1);assert.deepEqual(v.remediation[0].prerequisites,['CANDLE','VOLUME']);
 assert.equal(v.graded,false);assert.equal(v.evidence.futureBarsIncluded,false);
 assert.equal(JSON.stringify(v).includes('timestamp":6000'),false,'future evidence must not leak');
});
test('Advanced denies future indication, unverified math and unauthorized historical sources',()=>{
 assert.equal(advancedFormativeStudy({competencies,observations,evidence:{...fictional(),asOf:4000},indicators:indicators()}),null);
 assert.equal(advancedFormativeStudy({competencies,observations,evidence:fictional(),indicators:[{...indicators()[0],asOf:6000}]}),null);
 assert.equal(advancedFormativeStudy({competencies,observations,evidence:fictional(),indicators:[{...indicators()[0],verified:false}]}),null);
 assert.equal(advancedFormativeStudy({competencies,observations,evidence:{...fictional(),provenance:'licensed_historical'},indicators:indicators()}),null);
});
test('Professional fictional risk analysis validates bounded whole shares and synchronized completed frames',()=>{
 const x=professionalDecisionStudy({evidence:fictional(),indicators:indicators(),riskCases,frames});
 assert.equal(x.edition,'PROFESSIONAL');assert.equal(x.hypotheticalRisk[0].shares,25);
 assert.equal(x.noLookahead,true);assert.equal(x.frames[0].completedThrough,5000);
});
test('Professional denies invalid risk cases and lookahead in timeframe comparison',()=>{
 assert.equal(professionalDecisionStudy({evidence:fictional(),indicators:indicators(),riskCases:[{...riskCases[0],stop:40}],frames}),null);
 assert.equal(professionalDecisionStudy({evidence:fictional(),indicators:indicators(),riskCases,frames:[{...frames[0],completedThrough:6000}]}),null);
 assert.equal(professionalDecisionStudy({evidence:fictional(),indicators:indicators(),riskCases,frames:[{...frames[0],sourceVerified:false}]}),null);
});
const manifest=[{id:'source-A',methodVersion:'v1',reference:'Approved original fictional research file',asOf:15000,
 rights:'verified_for_requested_use',serverRightsVerified:true}];
const records=Array.from({length:12},(_,i)=>({timestamp:1000*(i+1),value:i+1}));
const methods=[{method:'EMA sensitivity check',parameter:9,result:0.12,holdoutUsedForSelection:false}];
test('Enterprise separates chronology, embargo and holdout without scoring',()=>{
 const x=enterpriseResearchStudy({manifest,observations:records,embargo:2,sensitivity:methods});
 assert.equal(x.schema,EDITION_SCHEMA);assert.equal(x.training.count,7);
 assert.equal(x.embargo.count,2);assert.equal(x.evaluation.count,3);
 assert.equal(x.holdoutProtected,true);assert.equal(x.graded,false);
});
test('Enterprise refuses missing provider rights and source manifests with duplicated identities',()=>{
 for(const bad of [
  {...manifest[0],rights:'unknown'}, {...manifest[0],serverRightsVerified:false},
  {...manifest[0],asOf:6000}
 ])assert.equal(enterpriseResearchStudy({manifest:[bad],observations:records,embargo:2,sensitivity:methods}),null);
 assert.equal(enterpriseResearchStudy({manifest:[manifest[0],manifest[0]],observations:records,embargo:2,sensitivity:methods}),null);
});
test('Enterprise refuses holdout-influenced method selection and nonchronological data',()=>{
 assert.equal(enterpriseResearchStudy({manifest,observations:records,embargo:2,sensitivity:[{...methods[0],holdoutUsedForSelection:true}]}),null);
 assert.equal(enterpriseResearchStudy({manifest,observations:[records[0],records[0],...records.slice(2)],embargo:2,sensitivity:methods}),null);
 assert.equal(enterpriseResearchStudy({manifest,observations:records,embargo:100,sensitivity:methods}),null);
});
test('Dispatcher refuses cross-edition actions and falsified premium authorization',()=>{
 assert.equal(runEditionExercise({authorized:{ok:true,edition:'BASIC',family:'lab'},activity:'advanced_formative_review',payload:{}}),null);
 assert.equal(runEditionExercise({authorized:{ok:false,edition:'ADVANCED',family:'lab'},activity:'advanced_formative_review',payload:{}}),null);
 assert.equal(runEditionExercise({authorized:auth(),activity:'decision_replay_review',payload:{}}),null);
 const x=runEditionExercise({authorized:auth(),activity:'advanced_formative_review',payload:{competencies,observations,evidence:fictional(),indicators:indicators()}});
 assert.equal(x.edition,'ADVANCED');
});
test('Returned structures are immutable and contain no official grades or private keys',()=>{
 const x=professionalDecisionStudy({evidence:fictional(),indicators:indicators(),riskCases,frames});
 assert.equal(Object.isFrozen(x),true);assert.equal(Object.isFrozen(x.hypotheticalRisk),true);
 assert.equal(Object.isFrozen(x.evidence.indicators),true);
 assert.equal(JSON.stringify(x).includes('correctAnswer'),false);
});

test('server derives independently calculated multi-indicator context from completed fictional prices',()=>{
 const derived=deriveFictionalCompletedStudies({evidence:fictional(),emaPeriod:3});
 assert.equal(derived.indicators.length,6);
 assert.equal(derived.indicators[0].name,'EMA');
 assert.equal(derived.indicators[1].name,'VWAP');
 for(const name of ['RSI','MACD','ATR','BOLL'])assert.equal(derived.indicators.some(x=>x.name===name),true,name);
 assert.equal(derived.indicators[0].asOf,5000);
 assert.equal(derived.evidence.bars.length,5);
 assert.equal(deriveFictionalCompletedStudies({evidence:{...fictional(),provenance:'licensed_historical'}}),null);
 assert.equal(deriveFictionalCompletedStudies({evidence:fictional(),emaPeriod:100}),null);
});
test('server derives only fully completed frames and refuses forged sources',()=>{
 const x=deriveFictionalCompletedFrames({evidence:fictional(),frameSize:2});
 assert.equal(x.length,2);assert.equal(x[0].completedThrough,2000);
 assert.equal(x[1].completedThrough,4000);
 assert.equal(deriveFictionalCompletedFrames({evidence:{...fictional(),provenance:'licensed_historical'}}),null);
});
