// Hardened source-only wave: 160+ adversarial privacy, evidence and citation cases.
import test from 'node:test';
import assert from 'node:assert/strict';
import {draftAdvancedMisconceptionCorrection,draftEnterpriseCrossCourseResearch,
 draftEnterpriseEvidenceReport,TALIA_REMAINING3_PREMIUM_RELEASED} from '../functions/_lib/talia-tier-remaining3-source-v1.js';
const skill={code:'VWAP_CONTEXT',status:'Needs Practice',independentAssessments:2};
const pattern={topicCode:'VWAP_CONTEXT',misconceptionCode:'VWAP_EXACT',sourceOnlyReviewedPattern:true,
 reviewId:'VWAP_REVIEW_001',correction:'A candle HLC3 approximation is not actual trade-print VWAP.',
 transferQuestion:'How can fictional trade size change a VWAP benchmark without future candles?'};
const progress=(x={})=>({ok:true,origin:'authenticated_competency_summary',skills:[skill],...x});
const correction=x=>draftAdvancedMisconceptionCorrection({
 evidence:progress(),topicCode:'VWAP_CONTEXT',misconceptionCode:'VWAP_EXACT',patterns:[pattern],...x});
const page=(id='SEC_EDU',over={})=>({id,title:'Investor education',url:'https://www.investor.gov/',
 publishedAt:100,rights:'public_reference_only',independentlyRightsChecked:true,...over});
const summary=(x={})=>({ok:true,origin:'server_authorized_course_progress_summary',
 courses:[{courseCode:'COURSE_A',topicCode:'VWAP_CONTEXT',completedAt:200,status:'Learning',serverProgressVerified:true},
 {courseCode:'COURSE_B',topicCode:'RISK_CONTEXT',completedAt:300,status:'Completed',serverProgressVerified:true}],...x});
const research=x=>draftEnterpriseCrossCourseResearch({summary:summary(),allowedCourses:['COURSE_A','COURSE_B'],
 asOf:400,sources:[page()],requestedCitationIds:['SEC_EDU'],...x});
const owner='11111111-1111-1111-1111-111111111111',other='22222222-2222-2222-2222-222222222222';
const caseRecord=(n=1,more={})=>({memberId:owner,courseCode:'COURSE_A',
 caseCode:'CASE_'+String(n).padStart(3,'0'),completedAt:200+n,
 rights:'fictional_internal',serverRecordVerified:true,evidenceStatus:'needs_review',...more});
const report=x=>draftEnterpriseEvidenceReport({scope:{verified:true,origin:'server_authorized_member_scope',memberId:owner},
 cases:[caseRecord()],asOf:400,...x});
test('premium source-only flag and positive controls remain explicitly unreleased',()=>{
 assert.equal(TALIA_REMAINING3_PREMIUM_RELEASED,false);
 const a=correction(),e=research(),r=report();
 assert.equal(a.accepted,true);assert.equal(a.officialGrade,false);
 assert.equal(a.feedback.specificMisconceptionVerified,false);
 assert.match(a.feedback.observation,/does not prove/i);
 assert.equal(e.accepted,true);assert.equal(e.citations.length,1);
 assert.equal(r.accepted,true);assert.equal(r.memberIdentifiersReturned,false);
 for(const x of [a,e,r])assert.ok(Object.isFrozen(x));
});
const unsafeHosts=['https://evil.com/','https://www.sec.gov.evil.com/','http://www.sec.gov/',
 'https://attacker@www.sec.gov/','https://www.sec.gov:8443/private',
 'https://www.sec.gov/?token=secret','https://www.sec.gov/?api_key=secret',
 'https://localhost/private','https://127.0.0.1/private',
 'https://www.sec.gov/?access_token=hidden','https://www.sec.gov/?password=bad',
 'javascript:alert(1)'];
for(const [i,url] of unsafeHosts.entries())test('E01 source metadata never emits unapproved reference '+(i+1),()=>{
 const x=research({sources:[page('SEC_EDU',{url})]});
 assert.equal(x.accepted,false);
 assert.equal(x.citations,undefined);
 assert.equal(JSON.stringify(x).includes('secret'),false);
});
for(let i=0;i<45;i++)test('A02 rejects raw assessment and member fields '+(i+1),()=>{
 const extra='privateField'+i;
 const e=progress({skills:[{...skill,[extra]:'private-value'}]});
 const x=correction({evidence:e});
 assert.equal(x.accepted,false);assert.equal(x.feedback,null);
 assert.equal(x.premiumEntitlementGranted,false);
});
for(let i=0;i<30;i++)test('A02 prevents protected reviewer pattern extras '+(i+1),()=>{
 const x=correction({patterns:[{...pattern,['privateRubric'+i]:'protected-answer'}]});
 assert.equal(x.accepted,false);assert.equal(x.feedback,null);
 assert.equal(JSON.stringify(x).includes('protected-answer'),false);
});
for(let i=0;i<32;i++)test('E01 does not accept unapproved progress fields '+(i+1),()=>{
 const newSummary=summary({courses:[{...summary().courses[0],['privateGrade'+i]:99},summary().courses[1]]});
 const x=research({summary:newSummary});
 assert.equal(x.accepted,false);assert.deepEqual(x.workItems,[]);
});
for(let i=0;i<40;i++)test('E03 refuses all private member-case annotations '+(i+1),()=>{
 const suspicious={['privateAnswer'+i]:'ANSWER_KEY'};
 const x=report({cases:[caseRecord(i+1,suspicious)]});
 assert.equal(x.accepted,false);assert.equal(x.totalCases,0);
 assert.equal(JSON.stringify(x).includes('ANSWER_KEY'),false);
});
for(let i=0;i<25;i++)test('E03 rejects cross-account contamination '+(i+1),()=>{
 const x=report({cases:[caseRecord(i+1),caseRecord(i+51,{memberId:other})]});
 assert.equal(x.accepted,false);
 assert.deepEqual(x.courseSummaries,[]);
 assert.equal(x.memberIdentifiersReturned,false);
});
for(let i=0;i<24;i++)test('E01 must not use later-than-cutoff citations '+(i+1),()=>{
 const x=research({asOf:200,sources:[page('SEC_EDU',{publishedAt:201+i})]});
 assert.equal(x.accepted,false);
 assert.deepEqual(x.workItems,[]);
});
for(let i=0;i<24;i++)test('E03 stable aggregation over synthetic bounded records '+(i+1),()=>{
 const n=1+i%15,rows=Array.from({length:n},(_,j)=>caseRecord(j+1));
 const x=report({cases:rows});
 assert.equal(x.accepted,true);assert.equal(x.totalCases,n);
 assert.equal(x.courseSummaries.length,1);assert.equal(x.courseSummaries[0].count,n);
 assert.equal(x.courseSummaries[0].needsReview,n);
 assert.equal(JSON.stringify(x).includes(owner),false);
 assert.ok(Object.isFrozen(x.courseSummaries[0]));
});
test('Research source input must remain metadata only',()=>{
 const x=research({sources:[page('SEC_EDU',{sourceBody:'copyright text'})]});
 assert.equal(x.accepted,false);
 assert.deepEqual(x.workItems,[]);
});
test('No actual routes, payment writes or authorized production memberships are created by source prototypes',()=>{
 assert.equal(TALIA_REMAINING3_PREMIUM_RELEASED,false);
 assert.equal(correction().premiumEntitlementGranted,false);
 assert.equal(research().sourceRightsGranted,false);
 assert.equal(report().stored,false);
});
