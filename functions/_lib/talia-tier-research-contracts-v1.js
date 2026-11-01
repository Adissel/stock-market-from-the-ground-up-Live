/* SMFGU-TALIA-ADVPROENT-001. Source-only deterministic, no member exposure.
 * NOT an entitlement verifier, API, user-visible premium release or source license.
 * Only original ungraded scenarios and caller-supplied already authorized facts.
 */
const safe=(v,n=180)=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,n):'';
const frozen=x=>Object.freeze(x);
export const TALIA_PREMIUM_RESEARCH_RELEASED=false;

/** Source prototype: honest prerequisite selection from previously verified *summary* fields.
 * No PII, official rubric, raw grades, member progress mutation or paid inference.
 */
export function draftAdvancedPrerequisites({evidence,skills,observedNeed}={}){
 const hold=frozen({status:'source_prototype_not_released',items:frozen([]),officialGrade:false,memberProgressModified:false,premiumEntitlementGranted:false});
 if(evidence?.ok!==true||evidence?.origin!=='authenticated_competency_summary'||!Array.isArray(evidence.skills)||!Array.isArray(skills))return hold;
 const need=safe(observedNeed,42).toUpperCase();
 if(!/^[A-Z0-9_]{3,42}$/.test(need))return hold;
 const current=evidence.skills.find(s=>s?.code===need);
 const authorized=skills.find(s=>s?.code===need&&typeof s.title==='string');
 if(!current||!authorized)return hold;
 const assessed=Number.isSafeInteger(current.independentAssessments)&&current.independentAssessments>0;
 const item=frozen({code:need,title:safe(authorized.title,100),
  learnerStatus:assessed?safe(current.status,48)||'Assessed — status unavailable':'Not Yet Assessed',
  prompt:'Review the first-principles definition and a distinct original fictional transfer problem before a new independent attempt.',
  provenance:'authenticated_competency_summary_only',officialGrade:false});
 return frozen({...hold,items:frozen([item])});
}

/** Past-only replay envelope for Professional instructional design. The caller must separately
 * verify provenance/data rights and preserve the immutable true event sequence.
 * This function deliberately does not compute charts, submit trades or award grades.
 */
export function draftProfessionalEvidence({bars,revealedThrough,observationTime}={}){
 const blocked=frozen({status:'insufficient_source_replay_evidence',observations:frozen([]),officialGrade:false,hasFutureBars:false});
 if(!Array.isArray(bars)||!Number.isSafeInteger(revealedThrough)||revealedThrough<0||
    revealedThrough>=bars.length||bars.length>10000||!Number.isFinite(observationTime))return blocked;
 const view=bars.slice(0,revealedThrough+1);
 if(view.some((b,i)=>!b||!Number.isFinite(b.close)||b.close<=0||
  !Number.isFinite(b.time)||b.time>observationTime||
  (i>0&&b.time<=view[i-1].time)))return blocked;
 const observations=view.map(b=>frozen({time:b.time,close:b.close}));
 return frozen({status:'source_prototype_not_released',observations:frozen(observations),
  revealedCount:view.length,asOf:observationTime,noLookahead:true,
  hasFutureBars:false,officialGrade:false});
}

/** Provenance metadata ONLY, no downloaded article, provider data or automatic ingestion.
 * A source's publication time must predate the historical question; permission to cite
 * is not permission to redistribute or train an AI model on its contents.
 */
export function draftEnterpriseProvenance({asOf,sources}={}){
 const empty=frozen({status:'source_prototype_not_released',citations:frozen([]),
  licensedDataImported:false,modelTrained:false,officialGrade:false});
 if(!Number.isFinite(asOf)||!Array.isArray(sources)||sources.length>40)return empty;
 const out=[];
 for(const s of sources){
  if(!s||typeof s!=='object'||!Number.isFinite(s.publishedAt)||s.publishedAt>asOf)continue;
  if(s.rights!=='public_reference_only'||s.independentlyRightsChecked!==true)continue;
  const title=safe(s.title,100),uri=safe(s.url,300),id=safe(s.id,72);
  try{
   const u=new URL(uri);
   if(u.protocol!=='https:'||u.username||u.password||!title||!id)continue;
   out.push(frozen({id,title,url:u.href,publishedAt:s.publishedAt,rights:'citation_only_not_redistribution'}));
  }catch{continue}
 }
 return frozen({...empty,citations:frozen(out)});
}
