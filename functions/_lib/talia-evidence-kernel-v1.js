/* Talia all-wave evidence kernel v1 — source prototype ONLY, not premium release.
 * Deterministic fictional OHLCV, point-in-time provenance and rights guards.
 * No database access, grades, member progress writes, paid API or live market feed.
 */
export const TALIA_EVIDENCE_PREMIUM_RELEASED=false;
const fail=(reason)=>({ok:false,reason,officialGrade:false,masteryAwarded:false});
const finite=x=>typeof x==='number'&&Number.isFinite(x);
function validBar(x){
 return x&&x.completed===true&&Number.isSafeInteger(x.time)&&x.time>=0&&
  x.time%60000===0&&['open','high','low','close','volume'].every(k=>finite(x[k]))&&
  x.open>0&&x.high>0&&x.low>0&&x.close>0&&x.volume>=0&&
  x.high>=Math.max(x.open,x.close)&&x.low<=Math.min(x.open,x.close);
}
/** Never synthesize partial 3m bars: 200 completed 1m bars = 200/66/40 for 1/3/5m. */
export function completedOHLCVAggregate(rows,minutes=1,{asOf=Number.MAX_SAFE_INTEGER}={}){
 if(![1,3,5].includes(minutes)||!Array.isArray(rows)||!rows.length||rows.length>10000||
   !Number.isSafeInteger(asOf)||asOf<0)return fail('invalid_interval_or_cutoff');
 let prior=-1;
 for(const x of rows){
  if(!validBar(x)||x.time<=prior||prior>=0&&x.time-prior!==60000)
   return fail('missing_incomplete_or_noncontiguous_minute_bar');
  prior=x.time;
 }
 const eligible=rows.filter(x=>x.time+60000<=asOf);
 // The final partial group is never shown as a completed candle.
 const count=Math.floor(eligible.length/minutes),bars=[];
 for(let g=0;g<count;g++){
  const group=eligible.slice(g*minutes,(g+1)*minutes);
  const out={time:group[0].time,closeTime:group.at(-1).time+60000,
   open:group[0].open,high:Math.max(...group.map(x=>x.high)),
   low:Math.min(...group.map(x=>x.low)),close:group.at(-1).close,
   volume:group.reduce((n,x)=>n+x.volume,0),completed:true,
   source:'original_fictional_completed_bars'};
  bars.push(out);
 }
 return {ok:true,minutes,bars,barCount:bars.length,droppedPartial:eligible.length-count*minutes,
  asOf,hasFutureBars:false,officialGrade:false,masteryAwarded:false};
}
/** Seed N-period EMA with the average of the first N valid completed closes. */
export function completedEMA(values,n){
 if(!Array.isArray(values)||values.length>10000||!Number.isInteger(n)||n<2||n>200||
   values.some(x=>!finite(x)||x<=0))return fail('invalid_ema_inputs');
 const out=Array(values.length).fill(null);
 if(values.length<n)return {ok:true,series:out,period:n,warmupComplete:false};
 let ema=values.slice(0,n).reduce((a,b)=>a+b,0)/n;
 out[n-1]=ema;
 const alpha=2/(n+1);
 for(let i=n;i<values.length;i++){ema=(values[i]-ema)*alpha+ema;out[i]=ema}
 return {ok:true,series:out,period:n,warmupComplete:true,seed:'SMA_first_N_completed_closes'};
}
/** Exact fictional trade-print VWAP excludes prints received after the decision cutoff. */
export function fictionalTradeVWAP(prints,{asOf=Number.MAX_SAFE_INTEGER}={}){
 if(!Array.isArray(prints)||!prints.length||prints.length>10000||
  !Number.isSafeInteger(asOf)||asOf<0)return fail('invalid_trade_inputs');
 let previous=-1,weighted=0,shares=0;
 for(const t of prints){
  if(!t||!Number.isSafeInteger(t.time)||!Number.isSafeInteger(t.receivedAt)||
    !finite(t.price)||!finite(t.size)||t.price<=0||t.size<=0||
    t.time<0||t.receivedAt<t.time||t.time<previous)return fail('invalid_trade_print');
  previous=t.time;
  if(t.time<=asOf&&t.receivedAt<=asOf){shares+=t.size;weighted+=t.price*t.size}
 }
 if(shares===0)return fail('no_as_of_trade_prints');
 return {ok:true,value:weighted/shares,unit:'fictional_price',
  label:'Exact trade-print VWAP — original fictional transactions',
  kind:'exact_fictional_trade_print',asOf,officialGrade:false,masteryAwarded:false};
}
/** HLC3-volume is a bar estimate, NEVER an exact trade-print reconstruction. */
export function fictionalHLC3VWAP(bars,{asOf=Number.MAX_SAFE_INTEGER}={}){
 if(!Array.isArray(bars)||!bars.length||bars.length>10000||
  !Number.isSafeInteger(asOf)||asOf<0)return fail('invalid_proxy_inputs');
 let w=0,v=0;
 for(const b of bars){
  if(!validBar(b))return fail('incomplete_or_invalid_bar');
  if(b.time+60000<=asOf){v+=b.volume;w+=(b.high+b.low+b.close)/3*b.volume}
 }
 if(v<=0)return fail('zero_valid_proxy_volume');
 return {ok:true,value:w/v,label:'HLC3 × bar-volume VWAP proxy — NOT exact trade-print VWAP',
  kind:'hlc3_volume_proxy',asOf,officialGrade:false,masteryAwarded:false};
}
const VALID_TIERS=['Foundation','Advanced','Professional','Enterprise'];
const MEMBER_TIER={'Free':'Foundation','Founding 14-Day':'Foundation',
 'Founding 30-Day':'Advanced','Founding 60-Day':'Professional',
 'Full Monthly':'Professional','Full Lifetime':'Enterprise'};
export function verifiedEffectiveEdition({actorId,grant}={}){
 if(typeof actorId!=='string'||!actorId||!grant||grant.userId!==actorId||
  grant.origin!=='server_verified_membership_entitlement'||grant.active!==true||
  !Number.isSafeInteger(grant.verifiedAt)||grant.verifiedAt<=0||
  grant.effectiveVersion!==MEMBER_TIER[grant.planCode])
   return {authorized:false,edition:'Foundation',premiumEnabled:false,reason:'unverified_or_unresolved_tier'};
 const edition=MEMBER_TIER[grant.planCode];
 return {authorized:true,edition,premiumEnabled:edition!=='Foundation',
  // Premium research is source-only pending the genuine authenticated gate.
  premiumRuntimeReleased:false,officialGrade:false};
}
export function boundedStudyRecommendations({actorId,identity,verifiedSkills,registry,entitledLabIds}={}){
 if(typeof actorId!=='string'||identity?.userId!==actorId||
  identity?.origin!=='server_authenticated_competency_summary'||
  !Array.isArray(verifiedSkills)||!Array.isArray(registry)||!Array.isArray(entitledLabIds))
  return fail('member_owned_prerequisite_evidence_missing');
 const allowed=new Set(entitledLabIds),accepted=[];
 for(const row of verifiedSkills){
  if(row?.userId!==actorId||row?.source!=='verified_own_learning_summary')continue;
  const target=registry.find(x=>x?.code===row.code&&allowed.has(x.labId));
  if(target&&typeof target.labId==='string'&&/^[A-Za-z0-9_-]{3,90}$/.test(target.labId)&&
   Number.isSafeInteger(row.independentAssessments)&&row.independentAssessments>0)
    accepted.push({code:row.code,labId:target.labId,reviewOnly:true,award:false});
 }
 return {ok:true,recommendations:accepted.slice(0,5),officialGrade:false,memberProgressWritten:false};
}
export function guardedEditorialRevision({expectedRevision,currentRevision,authorizedOwner,auditReady}={}){
 if(authorizedOwner!==true||auditReady!==true)return fail('owner_audit_authority_missing');
 if(!Number.isSafeInteger(expectedRevision)||expectedRevision<1||
  !Number.isSafeInteger(currentRevision)||currentRevision<1)return fail('revision_missing');
 if(expectedRevision!==currentRevision)return fail('stale_revision_rejected');
 return {ok:true,nextRevision:currentRevision+1,auditRequired:true,mayPublish:false};
}
/** Enterprise prototype: references only, no redistribution, as-of leakage or vendor computation. */
export function citationAsOfGuard({asOf,sources}={}){
 if(!Number.isSafeInteger(asOf)||asOf<0||!Array.isArray(sources)||sources.length>40)
  return fail('invalid_as_of_provenance');
 const references=[],rejected=[];
 for(const s of sources){
  if(!s||typeof s.id!=='string'||!/^[A-Za-z0-9_-]{3,80}$/.test(s.id)||
   s.rights!=='public_reference_only'||s.independentlyRightsChecked!==true||
   !Number.isSafeInteger(s.publishedAt)||s.publishedAt>asOf||
   typeof s.url!=='string'||!/^https:\/\//i.test(s.url)){
   rejected.push(typeof s?.id==='string'?s.id.slice(0,80):'unknown');continue;
  }
  references.push({id:s.id,url:s.url,publishedAt:s.publishedAt,
   license:'link_only_no_vendor_chart_or_quotation',asOf});
 }
 return {ok:true,references,rejected,rawFeedIncluded:false,officialGrade:false,
  premiumRuntimeReleased:false};
}
export function officialMethodHold(studyId){
 const id=String(studyId||'').toUpperCase();
 if(id==='STUDY_SCTR'||id==='STUDY_VIX_CONTEXT')
  return {approved:false,computedValue:null,
   reason:'vendor_specific_official_method_not_independently_licensed_or_verified',
   teaching:'concept_only'};
 return {approved:false,computedValue:null,
  reason:'independent_73_indicator_numerical_rights_and_runtime_acceptance_pending',
  teaching:'original_source_method_only'};
}
export function pointInTimeDebrief({before,after,decisionTime,afterReleased=false}={}){
 if(!Number.isSafeInteger(decisionTime)||!Array.isArray(before)||before.length>10000||
  before.some(x=>!validBar(x)||x.time+60000>decisionTime))
  return fail('incomplete_or_future_decision_evidence');
 const observed=before.map(x=>({time:x.time,close:x.close}));
 const afterSummary=afterReleased===true&&Array.isArray(after)&&
  after.every(x=>validBar(x)&&x.time>=decisionTime)?{
  count:after.length,observedLaterCloses:after.slice(0,100).map(x=>({time:x.time,close:x.close}))
 }:null;
 return {ok:true,decisionTime,knownAtDecision:observed,laterReleasedEvidence:afterSummary,
  advice:false,officialGrade:false,masteryAwarded:false,
  explanation:'Prior evidence and subsequently revealed results are separate. No trade recommendation.'};
}
