import test from 'node:test';
import assert from 'node:assert/strict';
import {TALIA_PREMIUM_RESEARCH_RELEASED,draftAdvancedGapSequence,
 draftProfessionalCloseDebrief,draftEnterpriseClaimCitationIndex} from '../functions/_lib/talia-tier-research-contracts-v1.js';
test('advanced source path uses only authenticated-summary-shaped prior assessment and never grades',()=>{
 assert.equal(TALIA_PREMIUM_RESEARCH_RELEASED,false);
 const evidence={ok:true,origin:'authenticated_competency_summary',skills:[
  {code:'SMA_CONTEXT',status:'Learning',independentAssessments:1},
  {code:'VWAP_CONTEXT',status:'Needs Practice',independentAssessments:2},
  {code:'NEW_TOPIC',status:'Not Yet Assessed',independentAssessments:0},
  {code:'SMA_CONTEXT',status:'Learning',independentAssessments:1}]};
 const skills=[{code:'SMA_CONTEXT',title:'SMA context'},{code:'VWAP_CONTEXT',title:'VWAP context'},
  {code:'NEW_TOPIC',title:'A new topic'}];
 const result=draftAdvancedGapSequence({evidence,skills,maxItems:2});
 assert.deepEqual(result.items.map(x=>x.code),['SMA_CONTEXT','VWAP_CONTEXT']);
 assert.equal(result.officialGrade,false);assert.equal(result.memberProgressModified,false);
 assert.equal(result.premiumEntitlementGranted,false);
 assert.ok(Object.isFrozen(result.items));
 assert.deepEqual(draftAdvancedGapSequence({evidence:{...evidence,origin:'unverified_browser'},skills}).items,[]);
 assert.deepEqual(draftAdvancedGapSequence({evidence:{...evidence,ok:false},skills}).items,[]);
 assert.deepEqual(draftAdvancedGapSequence({evidence,skills,maxItems:1000}).items,[]);
});
test('professional debrief only uses completed candles available before observationTime',()=>{
 const bars=[
  {time:100,closeTime:160,completed:true,close:10},
  {time:160,closeTime:220,completed:true,close:11},
  {time:220,closeTime:280,completed:true,close:999}];
 const r=draftProfessionalCloseDebrief({bars,revealedThrough:1,observationTime:220});
 assert.equal(r.accepted,true);
 assert.equal(r.priceChange,1);assert.equal(r.percentChange,10);
 assert.equal(r.lastCompletedTime,220);
 assert.equal(r.hasFutureBars,false);assert.equal(r.notARealFill,true);
 assert.equal(r.officialGrade,false);
 const blocked=draftProfessionalCloseDebrief({bars,revealedThrough:2,observationTime:220});
 assert.equal(blocked.accepted,false);
 assert.equal(blocked.hasFutureBars,false);
 const openingTime=draftProfessionalCloseDebrief({bars,revealedThrough:1,observationTime:161});
 assert.equal(openingTime.accepted,false);
 const unfinalized=draftProfessionalCloseDebrief({bars:[bars[0],{...bars[1],completed:false}],revealedThrough:1,observationTime:220});
 assert.equal(unfinalized.accepted,false);
});
test('enterprise citation index filters post-event, unverified, unapproved and duplicated citations',()=>{
 const sources=[
  {id:'SEC-A',title:'Completed reference',url:'https://www.sec.gov/a',publishedAt:50,rights:'public_reference_only',independentlyRightsChecked:true},
  {id:'SEC-B',title:'Future source',url:'https://www.sec.gov/b',publishedAt:400,rights:'public_reference_only',independentlyRightsChecked:true},
  {id:'PRIVATE-C',title:'Private source',url:'https://example.com/c',publishedAt:10,rights:'licensed_private',independentlyRightsChecked:true},
  {id:'NOT-REVIEWED',title:'Unverified source',url:'https://example.com/d',publishedAt:30,rights:'public_reference_only',independentlyRightsChecked:false}];
 const r=draftEnterpriseClaimCitationIndex({asOf:200,sources,requestedIds:['SEC-A','SEC-A','SEC-B','PRIVATE-C','NOT-REVIEWED']});
 assert.deepEqual(r.citations.map(x=>x.id),['SEC-A']);
 assert.deepEqual(r.evidenceGaps,['SEC-B','PRIVATE-C','NOT-REVIEWED']);
 assert.equal(r.licensedDataImported,false);
 assert.equal(r.officialGrade,false);
 assert.equal(TALIA_PREMIUM_RESEARCH_RELEASED,false);
 assert.ok(Object.isFrozen(r.citations));
});
