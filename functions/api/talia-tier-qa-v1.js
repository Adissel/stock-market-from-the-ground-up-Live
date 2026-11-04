/* Staff-only Talia four-tier source QA. No actual premium release or member impersonation.
 * Server re-verifies Owner/Admin privilege on EVERY request. Inputs are fixed fictional
 * specimens; real progress, auth claims, provider model calls and billing are excluded.
 */
import {verifyPrototypeStaff} from './prototype-training-cases.js';
import {
 draftAdvancedPrerequisites,draftAdvancedGapSequence,draftProfessionalEvidence,
 draftProfessionalCloseDebrief,draftEnterpriseProvenance,draftEnterpriseClaimCitationIndex
} from '../_lib/talia-tier-research-contracts-v1.js';
import {
 draftAdvancedMisconceptionCorrection,draftEnterpriseCrossCourseResearch,
 draftEnterpriseEvidenceReport
} from '../_lib/talia-tier-remaining3-source-v1.js';

const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store, max-age=0','vary':'Authorization','x-content-type-options':'nosniff','x-robots-tag':'noindex, nofollow'};
const reply=(body,status=200)=>new Response(JSON.stringify(body),{headers:H,status});
const tiers=Object.freeze(['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE']);
const fixtureProgress={ok:true,origin:'authenticated_competency_summary',skills:[
 {code:'VWAP_CONTEXT',status:'Needs Practice',independentAssessments:2},
 {code:'EMA_CONTEXT',status:'Learning',independentAssessments:1}
]};
// Important: only the QA server constructs these synthetic 'authenticated'-shaped
// fixtures, and the response explicitly labels them simulated. Never accept evidence
// objects from the browser or reuse these claims for an actual member entitlement.
const skills=[{code:'VWAP_CONTEXT',title:'VWAP context'},{code:'EMA_CONTEXT',title:'EMA context'}];
const bars=[
 {time:100,closeTime:160,completed:true,close:10},
 {time:160,closeTime:220,completed:true,close:11},
 {time:220,closeTime:280,completed:true,close:99}
];
const sources=[
 {id:'SEC-EDU',title:'SEC investor education reference',url:'https://www.investor.gov/',publishedAt:80,rights:'public_reference_only',independentlyRightsChecked:true},
 {id:'FUTURE',title:'Unavailable at cutoff',url:'https://www.sec.gov/',publishedAt:500,rights:'public_reference_only',independentlyRightsChecked:true}
];
const curriculum={ok:true,origin:'server_authorized_course_progress_summary',courses:[
 {courseCode:'COURSE_A',topicCode:'VWAP_TOPIC',completedAt:140,status:'Learning',serverProgressVerified:true},
 {courseCode:'COURSE_B',topicCode:'RISK_TOPIC',completedAt:180,status:'Completed',serverProgressVerified:true}
]};
const fakeScope={origin:'server_authorized_member_scope',verified:true,memberId:'11111111-1111-1111-1111-111111111111'};
const fakeCases=[
 {memberId:fakeScope.memberId,courseCode:'COURSE_A',caseCode:'CASE_001',completedAt:120,rights:'fictional_internal',serverRecordVerified:true,evidenceStatus:'reviewed_source_only'},
 {memberId:fakeScope.memberId,courseCode:'COURSE_B',caseCode:'CASE_002',completedAt:150,rights:'fictional_internal',serverRecordVerified:true,evidenceStatus:'needs_review'}
];
const item=(id,title,result)=>({id,title,result});
export function buildTierScenario(tier){
 if(!tiers.includes(tier))return null;
 let items=[];
 if(tier==='FOUNDATION')items=[
  item('F01','Source-grounded competency retrieval',{status:'source_evidenced',guideCount:30}),
  item('F02','Explain, Teach Deeper and Try Another',{status:'source_evidenced',freeOrdinaryExplanation:true}),
  item('F03','Original fictional calculations',{status:'source_evidenced',workedDomains:7}),
  item('F04','Stepwise mistakes, limits and transfer',{status:'source_evidenced',ungraded:true}),
  item('F05','Practice, correction, retry and private history',{status:'source_evidenced',historyRequiresMemberConsent:true}),
  item('F06','Indicator guide access',{status:'source_evidenced',originalGuideCount:61,additionalGuideResearch:12})
 ];
 else if(tier==='ADVANCED')items=[
  item('A01','Prerequisite diagnostics',draftAdvancedPrerequisites({evidence:fixtureProgress,skills,observedNeed:'VWAP_CONTEXT'})),
  item('A02','Misconception-specific correction',draftAdvancedMisconceptionCorrection({
   evidence:fixtureProgress,topicCode:'VWAP_CONTEXT',misconceptionCode:'VWAP_EXACT',
   patterns:[{topicCode:'VWAP_CONTEXT',misconceptionCode:'VWAP_EXACT',sourceOnlyReviewedPattern:true,
    reviewId:'VWAP_REVIEW_001',correction:'Bar-based HLC3 VWAP approximates the observed volume-weighted price; it is not exact transaction VWAP.',
    transferQuestion:'How would a very large trade affect true VWAP relative to the bar-based estimate?'}]
  })),
  item('A03','Verified skill-gap study sequence',draftAdvancedGapSequence({evidence:fixtureProgress,skills,maxItems:3}))
 ];
 else if(tier==='PROFESSIONAL')items=[
  item('P01','Completed-bar bounded chart evidence',draftProfessionalEvidence({bars,revealedThrough:1,observationTime:220})),
  item('P02','Future-bar exclusion',{...draftProfessionalEvidence({bars,revealedThrough:2,observationTime:220}),expectedNegativeCase:true}),
  item('P03','Decision-point debrief',draftProfessionalCloseDebrief({bars,revealedThrough:1,observationTime:220}))
 ];
 else items=[
  item('E01','Cross-course point-in-time research',draftEnterpriseCrossCourseResearch({
   summary:curriculum,allowedCourses:['COURSE_A','COURSE_B'],asOf:300,sources,requestedCitationIds:['SEC-EDU']
  })),
  item('E02','Citation provenance and gap comparison',{
   provenance:draftEnterpriseProvenance({asOf:300,sources}),
   comparison:draftEnterpriseClaimCitationIndex({asOf:300,sources,requestedIds:['SEC-EDU','FUTURE']})
  }),
  item('E03','Member-scoped fictional evidence aggregation',draftEnterpriseEvidenceReport({scope:fakeScope,cases:fakeCases,asOf:300}))
 ];
 return {ok:true,tier,scope:'STAFF_TEST_ONLY',source:'DETERMINISTIC_SYNTHETIC_FIXTURES',
  sourcePrototypePreviewEnabled:true,premiumMemberFeatureReleased:false,
  authenticMemberTierAccepted:false,independentContentApprovalInferred:false,
  existingMemberTutorStillFoundation:true,noBillingChange:true,noPaidModelCall:true,
  noRealUserProgressRead:true,noRealAccountImpersonation:true,
  inheritedFoundation:tier!=='FOUNDATION',featureCount:items.length,features:items,
  notice:'Owner/Admin testing preview: source examples and known limitation cases, NOT authenticated premium member-runtime acceptance.'};
}
export async function onRequest({request,env}){
 if(request.method!=='GET')return reply({ok:false,error:'Method not allowed'},405);
 try{
  const actor=await verifyPrototypeStaff(request,env);
  if(actor.status!==200)return reply({ok:false,error:'Verified Owner/Administrator session required'},actor.status);
  const tier=new URL(request.url).searchParams.get('tier');
  const data=buildTierScenario(tier);
  if(!data)return reply({ok:false,error:'Invalid Tutor QA tier'},400);
  return reply(data);
 }catch{return reply({ok:false,error:'Tutor QA authorization unavailable'},503)}
}
