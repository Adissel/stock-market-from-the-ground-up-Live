/* SMFGU-TALIA-PREMIUM-GAPS-20261103. Three source-only research prototypes.
 * NO browser routing, payments, provider requests, private record retrieval,
 * grading, entitlement grants, market-data imports, or data persistence.
 * All input attestation MUST be established in an authenticated server route;
 * 'verified' flags in browser JSON are never sufficient. These functions must
 * never be invoked directly using untrusted member-supplied evidence.
 */
import {draftEnterpriseClaimCitationIndex} from './talia-tier-research-contracts-v1.js';
export const TALIA_REMAINING3_PREMIUM_RELEASED=false;
const freeze=v=>Object.freeze(v);
const safe=(x,n=120)=>typeof x==='string'?x.replace(/[\u0000-\u001f\u007f<>]/g,' ').trim().slice(0,n):'';
const code=x=>typeof x==='string'&&/^[A-Z][A-Z0-9_-]{2,49}$/.test(x);
const uid=x=>typeof x==='string'&&/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(x);
const validTime=x=>typeof x==='number'&&Number.isSafeInteger(x)&&x>0;
const exactly=(obj,names)=>!!obj&&typeof obj==='object'&&!Array.isArray(obj)&&
 Object.keys(obj).every(key=>names.includes(key));
const summaryFields=['code','status','independentAssessments'];
const patternFields=['topicCode','misconceptionCode','sourceOnlyReviewedPattern','reviewId','correction','transferQuestion'];
const progressFields=['courseCode','topicCode','completedAt','status','serverProgressVerified'];
const caseFields=['memberId','courseCode','caseCode','completedAt','rights','serverRecordVerified','evidenceStatus'];
const researchFields=['id','title','url','publishedAt','rights','independentlyRightsChecked'];
// Closed reference-host inventory. A public URL is still NOT a reuse/license approval.
const approvedHost=new Set(['www.sec.gov','sec.gov','www.investor.gov','investor.gov',
 'www.finra.org','finra.org','syndication.finra.org','chartschool.stockcharts.com',
 'www.cboe.com','www.nationalacademies.org','www.nist.gov',
 'www.quantconnect.com','quantconnect.com']);
const safeCitationUrl=raw=>{
 if(typeof raw!=='string'||raw.length>500)return false;
 try{
  const x=new URL(raw);
  return x.protocol==='https:'&&!x.username&&!x.password&&!x.port&&
   approvedHost.has(x.hostname)&&!['token','api_key','access_token','password'].some(k=>x.searchParams.has(k));
 }catch{return false}
};
const EMPTY_CORRECTION=freeze({status:'source_prototype_not_released',accepted:false,feedback:null,
 officialGrade:false,masteryAwarded:false,premiumEntitlementGranted:false});
const EMPTY_RESEARCH=freeze({status:'source_prototype_not_released',accepted:false,workItems:freeze([]),
 citationGaps:freeze([]),officialGrade:false,sourceRightsGranted:false});
const EMPTY_REPORT=freeze({status:'source_prototype_not_released',accepted:false,courseSummaries:freeze([]),
 totalCases:0,memberIdentifiersReturned:false,stored:false,officialGrade:false});

/** A02: deterministic correction from previously reviewed educational patterns.
 * Source-only; pattern provenance AND evidence identity must be verified by the server.
 * Do not accept a browser assertion of reviewed:true as an authorization decision.
 */
export function draftAdvancedMisconceptionCorrection({evidence,topicCode,misconceptionCode,patterns}={}){
 if(evidence?.ok!==true||evidence?.origin!=='authenticated_competency_summary'||
    !exactly(evidence,['ok','origin','skills'])||
    !Array.isArray(evidence.skills)||evidence.skills.length>40||
    evidence.skills.some(row=>!exactly(row,summaryFields))||
    !code(topicCode)||!code(misconceptionCode)||
    !Array.isArray(patterns)||patterns.length>80||
    patterns.some(row=>!exactly(row,patternFields)))return EMPTY_CORRECTION;
 const progress=evidence.skills.find(s=>s?.code===topicCode);
 if(!progress||!Number.isSafeInteger(progress.independentAssessments)||
    progress.independentAssessments<1||
    !['Needs Practice','Learning','Developing'].includes(progress.status))return EMPTY_CORRECTION;
 const row=patterns.find(p=>p?.topicCode===topicCode&&p?.misconceptionCode===misconceptionCode&&
     p?.sourceOnlyReviewedPattern===true&&code(p.reviewId)&&
     typeof p.correction==='string'&&typeof p.transferQuestion==='string'&&
     p.correction.trim().length>=20&&p.transferQuestion.trim().length>=15);
 if(!row)return EMPTY_CORRECTION;
 const feedback=freeze({topicCode,misconceptionCode,reviewId:row.reviewId,
  correction:safe(row.correction,260),transferQuestion:safe(row.transferQuestion,220),
  observation:'This is an ungraded candidate self-check; prior learning status does not prove this specific misconception.',
  specificMisconceptionVerified:false,factualPublicationApproved:false,answerKeyExposed:false});
 return freeze({...EMPTY_CORRECTION,accepted:true,feedback});
}

/** E01: cross-course research route from a SERVER-verified prior progress summary.
 * As-of citation filtering protects history; no restricted source text is ingested.
 */
export function draftEnterpriseCrossCourseResearch({summary,allowedCourses,asOf,sources,requestedCitationIds}={}){
 if(summary?.ok!==true||summary?.origin!=='server_authorized_course_progress_summary'||
    !exactly(summary,['ok','origin','courses'])||
    !Array.isArray(summary.courses)||!Array.isArray(allowedCourses)||allowedCourses.length>30||
    allowedCourses.some(x=>!code(x))||
    !validTime(asOf)||!Array.isArray(requestedCitationIds)||
    requestedCitationIds.length>12||requestedCitationIds.some(x=>!code(x))||
    !Array.isArray(sources)||sources.length>40||
    sources.some(s=>!exactly(s,researchFields)||!safeCitationUrl(s.url))||
    summary.courses.some(c=>!exactly(c,progressFields)))return EMPTY_RESEARCH;
 const allow=new Set(allowedCourses.filter(code));
 if(allow.size<2||summary.courses.length>100)return EMPTY_RESEARCH;
 const items=[],seen=new Set();
 for(const row of summary.courses){
  if(!row||!code(row.courseCode)||!code(row.topicCode)||
     !allow.has(row.courseCode)||!validTime(row.completedAt)||
     row.completedAt>asOf||row.serverProgressVerified!==true||
     !['Learning','Completed'].includes(row.status))return EMPTY_RESEARCH;
  const key=row.courseCode+'/'+row.topicCode;
  if(seen.has(key))continue;seen.add(key);
  items.push(freeze({courseCode:row.courseCode,topicCode:row.topicCode,
   status:row.status,completedAt:row.completedAt,
   nextStep:'Compare original hypothetical evidence; identify limitations and missing sources.'}));
 }
 if(items.length<2||new Set(items.map(x=>x.courseCode)).size<2)return EMPTY_RESEARCH;
 const cited=draftEnterpriseClaimCitationIndex({asOf,sources,requestedIds:requestedCitationIds});
 if(cited.citations.length===0)return EMPTY_RESEARCH;
 return freeze({...EMPTY_RESEARCH,accepted:true,workItems:freeze(items),
  citations:freeze(cited.citations),citationGaps:freeze(cited.evidenceGaps),
  researchLimitation:'Point-in-time sources and completed lessons do not establish predictive skill.'});
}

/** E03: minimum necessary fictional-only member evidence aggregate.
 * A single cross-member, unreviewed-rights or future row fails CLOSED instead
 * of silently dropping it and returning a misleading partial report.
 */
export function draftEnterpriseEvidenceReport({scope,cases,asOf}={}){
 if(scope?.verified!==true||scope?.origin!=='server_authorized_member_scope'||
    !exactly(scope,['origin','verified','memberId'])||
    !uid(scope.memberId)||!Array.isArray(cases)||cases.length<1||cases.length>500||
    cases.some(row=>!exactly(row,caseFields))||
    !validTime(asOf))return EMPTY_REPORT;
 const byCourse=new Map(),seen=new Set();
 for(const row of cases){
  if(!row||row.memberId!==scope.memberId||!code(row.courseCode)||
     !code(row.caseCode)||!validTime(row.completedAt)||row.completedAt>asOf||
     row.rights!=='fictional_internal'||row.serverRecordVerified!==true||
     !['reviewed_source_only','needs_review'].includes(row.evidenceStatus))return EMPTY_REPORT;
  const key=row.courseCode+'/'+row.caseCode;
  if(seen.has(key))return EMPTY_REPORT;
  seen.add(key);
  const current=byCourse.get(row.courseCode)||{courseCode:row.courseCode,count:0,needsReview:0};
  current.count++; if(row.evidenceStatus==='needs_review')current.needsReview++;
  byCourse.set(row.courseCode,current);
 }
 const courseSummaries=freeze([...byCourse.values()].sort((a,b)=>a.courseCode.localeCompare(b.courseCode))
  .map(r=>freeze(r)));
 return freeze({...EMPTY_REPORT,accepted:true,courseSummaries,totalCases:cases.length,
  limitation:'Source-only fictional learning activity is not a grade, certification, or investment result.'});
}
