import test from 'node:test';
import assert from 'node:assert/strict';
import {enginePolicyForPlan} from '../functions/_lib/learning-engine-tier-policy-v1.js';
import {TALIA_PREMIUM_RESEARCH_RELEASED,draftAdvancedPrerequisites,draftProfessionalEvidence,draftEnterpriseProvenance}
 from '../functions/_lib/talia-tier-research-contracts-v1.js';
test('all premium plans are targets and no member obtains premium capabilities from the source prototype',()=>{
 assert.equal(TALIA_PREMIUM_RESEARCH_RELEASED,false);
 for(const [plan,target] of [['FOUNDING_30','ADVANCED'],['FOUNDING_60','PROFESSIONAL'],['LIFETIME','ENTERPRISE']]){
  const x=enginePolicyForPlan(plan);
  assert.equal(x.target.tutor,target);
  assert.equal(x.effectiveCapabilities.tutor,'FOUNDATION');
  assert.equal(x.premiumFeaturesReleased,false);
  assert.equal(x.addOnCheckoutEnabled,false);
 }
});
test('Advanced consumes only actual verified summary evidence, never grades or account history',()=>{
 const skills=[{code:'VWAP_CONTEXT',title:'VWAP Context'}];
 const evidence={ok:true,origin:'authenticated_competency_summary',
   skills:[{code:'VWAP_CONTEXT',status:'Learning',independentAssessments:1}]};
 const result=draftAdvancedPrerequisites({evidence,skills,observedNeed:'VWAP_CONTEXT'});
 assert.equal(result.status,'source_prototype_not_released');
 assert.equal(result.items.length,1);assert.equal(result.items[0].learnerStatus,'Learning');
 assert.equal(result.officialGrade,false);assert.equal(result.premiumEntitlementGranted,false);
 assert.deepEqual(draftAdvancedPrerequisites({evidence:{...evidence,ok:false},skills,observedNeed:'VWAP_CONTEXT'}).items,[]);
 assert.deepEqual(draftAdvancedPrerequisites({evidence:{...evidence,origin:'browser_guess'},skills,observedNeed:'VWAP_CONTEXT'}).items,[]);
});
test('Professional replay only returns completed revealed prefix and denies future timestamp contamination',()=>{
 const candles=[{time:1000,closeTime:1500,completed:true,close:10},{time:2000,closeTime:2500,completed:true,close:11},{time:3000,closeTime:3500,completed:true,close:20}];
 const x=draftProfessionalEvidence({bars:candles,revealedThrough:1,observationTime:2500});
 assert.equal(x.status,'source_prototype_not_released');assert.equal(x.observations.length,2);
 assert.equal(x.observations[1].close,11);assert.equal(x.observations[1].closeTime,2500);assert.equal(x.noLookahead,true);
 assert.equal(x.hasFutureBars,false);assert.equal(x.officialGrade,false);
 const corrupt=draftProfessionalEvidence({bars:candles,revealedThrough:2,observationTime:2500});
 assert.equal(corrupt.status,'insufficient_source_replay_evidence');
 assert.equal(draftProfessionalEvidence({bars:[{time:2,closeTime:3,completed:true,close:1},{time:1,closeTime:2,completed:true,close:2}],revealedThrough:1,observationTime:3}).status,'insufficient_source_replay_evidence');
 // A completed final close in a 10:00–10:05 candle is NOT known at 10:02.
 assert.equal(draftProfessionalEvidence({bars:[{time:1000,closeTime:1300,completed:true,close:10}],revealedThrough:0,observationTime:1100}).status,'insufficient_source_replay_evidence');
 // A timestamp without a close timestamp cannot prove a bar has finished.
 assert.equal(draftProfessionalEvidence({bars:[{time:1000,close:10}],revealedThrough:0,observationTime:2000}).status,'insufficient_source_replay_evidence');
 // Unfinalized higher-timeframe candle cannot be passed from a shorter frame.
 assert.equal(draftProfessionalEvidence({bars:[{time:1000,closeTime:1300,completed:false,close:10}],revealedThrough:0,observationTime:1400}).status,'insufficient_source_replay_evidence');
 // Overlap in completed events also requires explicit backfill/clock audit.
 assert.equal(draftProfessionalEvidence({bars:[{time:1000,closeTime:1600,completed:true,close:10},{time:1500,closeTime:1900,completed:true,close:11}],revealedThrough:1,observationTime:2200}).status,'insufficient_source_replay_evidence');
});
test('Enterprise provenance lists only approved prior citations, not records licensed for AI training',()=>{
 const s=[{id:'public1',title:'Historical Rule',url:'https://www.sec.gov/example',publishedAt:100,rights:'public_reference_only',independentlyRightsChecked:true},
 {id:'future',title:'Future Revision',url:'https://www.sec.gov/future',publishedAt:400,rights:'public_reference_only',independentlyRightsChecked:true},
 {id:'unreviewed',title:'Unreviewed',url:'https://www.sec.gov/file',publishedAt:90,rights:'public_reference_only',independentlyRightsChecked:false},
 {id:'bad',title:'Invalid',url:'http://example.org',publishedAt:50,rights:'public_reference_only',independentlyRightsChecked:true}];
 const x=draftEnterpriseProvenance({asOf:200,sources:s});
 assert.equal(x.status,'source_prototype_not_released');
 assert.deepEqual(x.citations.map(z=>z.id),['public1']);
 assert.equal(x.modelTrained,false);assert.equal(x.licensedDataImported,false);
 assert.equal(x.citations[0].rights,'citation_only_not_redistribution');
});
