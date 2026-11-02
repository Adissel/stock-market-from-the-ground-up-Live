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
 // A bar timestamp is often its OPEN. Its eventual close cannot be used at
 // that opening timestamp. Require an independently verified completion time.
 // "completed" is expected from the authorized replay server, not a UI toggle.
 if(view.some((b,i)=>!b||b.completed!==true||!Number.isFinite(b.close)||b.close<=0||
  !Number.isFinite(b.time)||!Number.isFinite(b.closeTime)||b.closeTime<=b.time||
  b.closeTime>observationTime||
  (i>0&&(b.time<=view[i-1].time||b.time<view[i-1].closeTime))))return blocked;
 const observations=view.map(b=>frozen({time:b.time,closeTime:b.closeTime,close:b.close}));
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

/** Advanced source prototype: deterministic study order for distinct assessed gaps.
 * This does not receive raw grades, history, PII or editable browser "competency" claims.
 * Caller must validate provenance and member identity at a protected server route.
 */
export function draftAdvancedGapSequence({evidence,skills,maxItems=3}={}){
 const empty=frozen({status:'source_prototype_not_released',items:frozen([]),officialGrade:false,memberProgressModified:false,premiumEntitlementGranted:false});
 if(evidence?.ok!==true||evidence?.origin!=='authenticated_competency_summary'||
    !Array.isArray(evidence.skills)||!Array.isArray(skills)||
    !Number.isSafeInteger(maxItems)||maxItems<1||maxItems>5)return empty;
 const names=new Map(skills.filter(s=>s&&/^[A-Z0-9_]{3,42}$/.test(s.code)&&typeof s.title==='string')
   .map(s=>[s.code,safe(s.title,96)]));
 const seen=new Set(),items=[];
 for(const entry of evidence.skills){
  if(!entry||!names.has(entry.code)||seen.has(entry.code))continue;
  seen.add(entry.code);
  if(!Number.isSafeInteger(entry.independentAssessments)||entry.independentAssessments<1)continue;
  const category=safe(entry.status,32);
  if(!['Needs Practice','Learning','Developing'].includes(category))continue;
  items.push(frozen({code:entry.code,title:names.get(entry.code),status:category,
   prompt:'Review a distinct fictional example, explain one error, and attempt an independent transfer.',
   evidenceType:'authorized_summary_only',officialGrade:false}));
  if(items.length===maxItems)break;
 }
 return frozen({...empty,items:frozen(items)});
}

/** Professional source prototype: previous-completed-close comparison.
 * Requires independently validated completed replay timestamps; never returns
 * the hidden future data or interprets a change as a trade-fill recommendation.
 */
export function draftProfessionalCloseDebrief(input={}){
 const base=draftProfessionalEvidence(input);
 const empty=frozen({status:'source_prototype_not_released',accepted:false,
  explanation:'Insufficient verified completed-bar context.',hasFutureBars:false,officialGrade:false});
 if(base.status!=='source_prototype_not_released'||base.observations.length<2)return empty;
 const list=base.observations,last=list[list.length-1],prior=list[list.length-2];
 if(!Number.isFinite(prior.close)||prior.close<=0)return empty;
 const delta=last.close-prior.close,pct=100*delta/prior.close;
 if(!Number.isFinite(pct))return empty;
 return frozen({status:'source_prototype_not_released',accepted:true,
  observationTime:base.asOf,lastCompletedTime:last.closeTime,
  previousCompletedTime:prior.closeTime,priceChange:delta,percentChange:pct,
  question:'What additional completed historical evidence would you require before inferring a trend?',
  provenance:'source_only_revealed_completed_candles',hasFutureBars:false,officialGrade:false,
  notARealFill:true});
}

/** Enterprise source prototype: as-of limited citation IDs only.
 * No article text, private documents, licensed provider data or auto-ingestion.
 */
export function draftEnterpriseClaimCitationIndex({asOf,sources,requestedIds}={}){
 const empty=frozen({status:'source_prototype_not_released',citations:frozen([]),
  evidenceGaps:frozen([]),licensedDataImported:false,officialGrade:false});
 if(!Array.isArray(requestedIds)||requestedIds.length>12||
    requestedIds.some(id=>!/^[-A-Za-z0-9_]{3,72}$/.test(String(id))))return empty;
 const base=draftEnterpriseProvenance({asOf,sources});
 const byId=new Map(base.citations.map(c=>[c.id,c]));
 const citations=[],gaps=[],used=new Set();
 for(const id of requestedIds){
  if(used.has(id))continue;used.add(id);
  if(byId.has(id))citations.push(byId.get(id));
  else gaps.push(id);
 }
 return frozen({...empty,citations:frozen(citations),evidenceGaps:frozen(gaps)});
}
