import test from 'node:test';
import assert from 'node:assert/strict';
import {TALIA_REMAINING3_PREMIUM_RELEASED,
 draftAdvancedMisconceptionCorrection,draftEnterpriseCrossCourseResearch,
 draftEnterpriseEvidenceReport} from '../functions/_lib/talia-tier-remaining3-source-v1.js';
import {enginePolicyForPlan} from '../functions/_lib/learning-engine-tier-policy-v1.js';

test('all new Talia source prototypes remain unreleased and effective Tutor falls back to Foundation',()=>{
 assert.equal(TALIA_REMAINING3_PREMIUM_RELEASED,false);
 for(const plan of ['FREE','FOUNDING_30','FOUNDING_60','LIFETIME']){
  const p=enginePolicyForPlan(plan);
  assert.equal(p.effectiveCapabilities.tutor,'FOUNDATION');
  assert.equal(p.premiumFeaturesReleased,false);
  assert.equal(p.addOnCheckoutEnabled,false);
 }
});
const progress={ok:true,origin:'authenticated_competency_summary',skills:[
 {code:'VWAP_CONTEXT',status:'Needs Practice',independentAssessments:2}]};
const pattern={topicCode:'VWAP_CONTEXT',misconceptionCode:'VWAP_EXACT',
 sourceOnlyReviewedPattern:true,reviewId:'VWAP_REVIEW_001',
 correction:'Bar-based HLC3 VWAP is an approximation, not an exact transaction-price VWAP.',
 transferQuestion:'How might individual transaction sizes alter VWAP relative to the HLC3 proxy?'};
test('A02 emits bounded topic-specific formative correction, never official mastery',()=>{
 const x=draftAdvancedMisconceptionCorrection({evidence:progress,topicCode:'VWAP_CONTEXT',
  misconceptionCode:'VWAP_EXACT',patterns:[pattern]});
 assert.equal(x.accepted,true);assert.equal(x.feedback.reviewId,'VWAP_REVIEW_001');
 assert.equal(x.feedback.answerKeyExposed,false);assert.equal(x.officialGrade,false);
 assert.equal(x.masteryAwarded,false);assert.equal(x.premiumEntitlementGranted,false);
 assert.equal(draftAdvancedMisconceptionCorrection({evidence:{...progress,origin:'browser_guess'},
  topicCode:'VWAP_CONTEXT',misconceptionCode:'VWAP_EXACT',patterns:[pattern]}).accepted,false);
 assert.equal(draftAdvancedMisconceptionCorrection({evidence:progress,topicCode:'VWAP_CONTEXT',
  misconceptionCode:'VWAP_EXACT',patterns:[{...pattern,sourceOnlyReviewedPattern:false}]}).accepted,false);
 assert.equal(draftAdvancedMisconceptionCorrection({evidence:{...progress,skills:[]},
  topicCode:'VWAP_CONTEXT',misconceptionCode:'VWAP_EXACT',patterns:[pattern]}).accepted,false);
});
const sources=[{id:'SEC-EDU',title:'SEC teaching research',url:'https://www.investor.gov/',
 publishedAt:100,rights:'public_reference_only',independentlyRightsChecked:true}];
const authorizedSummary={ok:true,origin:'server_authorized_course_progress_summary',courses:[
 {courseCode:'COURSE_A',topicCode:'VWAP_TOPIC',completedAt:200,status:'Learning',serverProgressVerified:true},
 {courseCode:'COURSE_B',topicCode:'RISK_TOPIC',completedAt:300,status:'Completed',serverProgressVerified:true}]};
test('E01 requires 2 authorized courses, verified source IDs, and chronological cutoff',()=>{
 const args={summary:authorizedSummary,allowedCourses:['COURSE_A','COURSE_B'],asOf:400,
  sources,requestedCitationIds:['SEC-EDU','UNSUPPORTED']};
 const x=draftEnterpriseCrossCourseResearch(args);
 assert.equal(x.accepted,true);
 assert.equal(x.workItems.length,2);
 assert.deepEqual(x.citations.map(y=>y.id),['SEC-EDU']);
 assert.deepEqual(x.citationGaps,['UNSUPPORTED']);
 assert.equal(x.officialGrade,false);assert.equal(x.sourceRightsGranted,false);
 assert.equal(draftEnterpriseCrossCourseResearch({...args,asOf:250}).accepted,false);
 assert.equal(draftEnterpriseCrossCourseResearch({...args,allowedCourses:['COURSE_A']}).accepted,false);
 assert.equal(draftEnterpriseCrossCourseResearch({...args,sources:[]}).accepted,false);
 assert.equal(draftEnterpriseCrossCourseResearch({...args,summary:{...authorizedSummary,origin:'client_guess'}}).accepted,false);
 assert.equal(draftEnterpriseCrossCourseResearch({...args,summary:{...authorizedSummary,courses:[
   {...authorizedSummary.courses[0],serverProgressVerified:false},authorizedSummary.courses[1]]}}).accepted,false);
});
const member='11111111-1111-1111-1111-111111111111',other='22222222-2222-2222-2222-222222222222';
const scope={origin:'server_authorized_member_scope',verified:true,memberId:member};
const cases=[{memberId:member,courseCode:'COURSE_A',caseCode:'CASE_001',completedAt:200,
 rights:'fictional_internal',serverRecordVerified:true,evidenceStatus:'reviewed_source_only'},
 {memberId:member,courseCode:'COURSE_A',caseCode:'CASE_002',completedAt:250,
 rights:'fictional_internal',serverRecordVerified:true,evidenceStatus:'needs_review'}];
test('E03 returns minimum-necessary fictional aggregate and never a second account record',()=>{
 const x=draftEnterpriseEvidenceReport({scope,cases,asOf:300});
 assert.equal(x.accepted,true);assert.equal(x.totalCases,2);
 assert.equal(x.courseSummaries[0].needsReview,1);
 assert.equal(x.memberIdentifiersReturned,false);assert.equal(x.stored,false);
 assert.equal(x.officialGrade,false);assert.equal(JSON.stringify(x).includes(member),false);
 assert.equal(draftEnterpriseEvidenceReport({scope,cases:[...cases,{...cases[0],memberId:other,caseCode:'CASE_003'}],asOf:300}).accepted,false);
 assert.equal(draftEnterpriseEvidenceReport({scope,cases:[...cases,{...cases[0],caseCode:'CASE_003',completedAt:400}],asOf:300}).accepted,false);
 assert.equal(draftEnterpriseEvidenceReport({scope,cases:[...cases,{...cases[0],caseCode:'CASE_003',rights:'licensed_private'}],asOf:300}).accepted,false);
 assert.equal(draftEnterpriseEvidenceReport({scope:{...scope,verified:false},cases,asOf:300}).accepted,false);
 assert.equal(draftEnterpriseEvidenceReport({scope,cases:[...cases,cases[0]],asOf:300}).accepted,false);
});
