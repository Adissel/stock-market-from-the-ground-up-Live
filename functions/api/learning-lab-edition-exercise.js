/* Optional Learning/Lab premium formative exercises, server-side permissioned.
 * ZERO live commerce writes, answer keys, official grading, member history or
 * market feed. Premium remains locked until BOTH release switch and an explicit
 * effective member PRODUCT GRANT exist. Plan targets alone never grant access.
 */
import {toolAccess} from './member-tool-access.js';
import {enginePolicyForPlan} from '../_lib/learning-engine-tier-policy-v1.js';
import {verifyEditionAuthorization,deriveFictionalCompletedStudies,
 deriveFictionalCompletedFrames,advancedFormativeStudy,professionalDecisionStudy,
 enterpriseResearchStudy}
 from '../_lib/learning-lab-edition-exercises-v1.js';
const HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store',
 'vary':'Authorization','x-content-type-options':'nosniff'};
const respond=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:HEADERS});
const err=(message,status)=>Object.assign(new Error(message),{status});
const LIMIT=24000;
const EDITIONS=['ADVANCED','PROFESSIONAL','ENTERPRISE'];
const FAMILY_TO_TOOL=Object.freeze({learning:'ONDEMAND_TRAINING',lab:'INTERACTIVE_LEARNING'});
function config(env){
 const base=String(env?.SUPABASE_URL||'').replace(/\/$/,'');
 const secret=String(env?.SUPABASE_SECRET_KEY||'');
 if(!/^https:\/\/[^/]+\.supabase\.co$/.test(base)||!secret)
  throw err('Member rights storage is unavailable.',503);
 const headers={apikey:secret,accept:'application/json'};
 if(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(secret))
  headers.authorization='Bearer '+secret;
 return {base,headers};
}
async function records(env,memberId){
 const c=config(env);
 const actor=encodeURIComponent(memberId);
 // Memberships can be represented by either current site subscriptions or
 // independently issued user-plan grants. Both are server-owned sources.
 // A plan target alone NEVER grants premium access: each row must contain an
 // explicit edition grant checked for revocation, expiry and release enablement.
 const siteUrl=c.base+'/rest/v1/site_subscriptions?select=plan_code,status,current_period_start,current_period_end,metadata'+
  '&user_id=eq.'+actor+'&order=updated_at.desc&limit=20';
 const grantUrl=c.base+'/rest/v1/user_plan_grants?select=plan_code,status,starts_at,ends_at,metadata'+
  '&user_id=eq.'+actor+'&order=updated_at.desc&limit=20';
 const [siteResponse,grantResponse]=await Promise.all([
  fetch(siteUrl,{headers:c.headers,cache:'no-store'}),
  fetch(grantUrl,{headers:c.headers,cache:'no-store'})
 ]);
 if(!siteResponse.ok||!grantResponse.ok)
  throw err('Member subscription verification unavailable.',503);
 const [sites,grants]=await Promise.all([
  siteResponse.json().catch(()=>null),grantResponse.json().catch(()=>null)
 ]);
 if(!Array.isArray(sites)||sites.length>20||!Array.isArray(grants)||grants.length>20)
  throw err('Member subscription records invalid.',503);
 return [
  ...grants.map(row=>({...row,source:'user_plan_grants',
   current_period_start:row.starts_at,current_period_end:row.ends_at})),
  ...sites.map(row=>({...row,source:'site_subscriptions'}))
 ];
}
async function reviewedRoute(env,memberId){
 const c=config(env),encode=encodeURIComponent;
 const definitionsUrl=c.base+'/rest/v1/competency_definitions?select=competency_code,metadata'+
  '&active=eq.true&order=sort_order.asc&limit=100';
 const evidenceUrl=c.base+'/rest/v1/competency_evidence?select=competency_code,source_type,passed,critical_error,metadata,assessed_at'+
  '&user_id=eq.'+encode(memberId)+'&order=assessed_at.desc&limit=500';
 const [definitionsResponse,evidenceResponse]=await Promise.all([
  fetch(definitionsUrl,{headers:c.headers,cache:'no-store'}),
  fetch(evidenceUrl,{headers:c.headers,cache:'no-store'})
 ]);
 if(!definitionsResponse.ok||!evidenceResponse.ok)
  throw err('Reviewed learning evidence is unavailable.',503);
 const definitions=await definitionsResponse.json().catch(()=>null);
 const evidence=await evidenceResponse.json().catch(()=>null);
 if(!Array.isArray(definitions)||definitions.length>100||
    !Array.isArray(evidence)||evidence.length>500)
  throw err('Reviewed learning evidence is invalid.',503);
 const competencies=definitions.filter(x=>typeof x?.competency_code==='string').map(x=>({
  id:x.competency_code,
  prerequisites:Array.isArray(x.metadata?.prerequisites)?x.metadata.prerequisites:[]
 }));
 const observations=[];
 const seen=new Set();
 for(const row of evidence){
  const code=row?.competency_code;
  if(typeof code!=='string'||seen.has(code))continue;
  const reviewed=row.metadata?.mapping_individually_reviewed===true||
   row.metadata?.reviewed===true||['instructor_review','system_assessment','capstone'].includes(row.source_type);
  if(!reviewed)continue;
  seen.add(code);
  observations.push({kind:'formative_observation',reviewed:true,competencyId:code,
   outcome:row.passed===true&&row.critical_error!==true?'correct':'needs_review'});
 }
 return {competencies,observations};
}
function released(env,family,edition){
 return env?.['ENGINE_'+family.toUpperCase()+'_'+edition+'_RELEASED']==='true';
}
function entitlement(rows,actorId,family,edition,env){
 const now=Date.now();
 // Explicit, current, server-owned subscription metadata; no legacy target
 // can implicitly unlock a new engine.
 for(const row of rows){
  if(!row||row.status!=='active'||typeof row.plan_code!=='string')continue;
  const start=row.current_period_start==null?null:Date.parse(row.current_period_start);
  if(start!==null&&(!Number.isFinite(start)||start>now))continue;
  const target=enginePolicyForPlan(row.plan_code).target[family];
  const saved=row.metadata?.engine_edition_grants_v1?.[family];
  if(!saved||saved.active!==true||typeof saved.expiresAt!=='string')continue;
  const expiration=Date.parse(saved.expiresAt);
  if(!Number.isFinite(expiration)||expiration<=now)continue;
  // A lifetime plan grant may have no ends_at, but its specific engine grant
  // must always have a finite expiration and remain independently revocable.
  const period=row.current_period_end==null&&row.source==='user_plan_grants'?
   expiration:Date.parse(row.current_period_end||'');
  if(!Number.isFinite(period)||period<=now)continue;
  const auth=verifyEditionAuthorization({actorId,family,requested:edition,
   planTarget:target,grant:{serverVerified:true,memberId:actorId,family,
    edition:saved.edition,revoked:saved.revoked===true,expiresAt:Math.min(expiration,period)},
   releaseEnabled:released(env,family,edition),now});
  if(auth.ok)return auth;
 }
 return null;
}
export async function authorizeEditionRequest({request,env,family,edition}){
 if(!['learning','lab'].includes(family)||!EDITIONS.includes(edition))
  throw err('Unsupported edition or exercise.',400);
 const access=await toolAccess(env,request,FAMILY_TO_TOOL[family]);
 if(access.authorized!==true||!access.userId)
  throw err(access.reason||'Premium learning edition access required.',403);
 const rows=await records(env,access.userId);
 const authorization=entitlement(rows,access.userId,family,edition,env);
 if(!authorization?.ok)
  throw err('Requested learning edition is not authorized.',403);
 return {memberId:access.userId,family,edition,authorization};
}
function sameOrigin(req){
 const origin=req.headers.get('origin'),site=req.headers.get('sec-fetch-site');
 if(origin&&origin!==new URL(req.url).origin)throw err('Cross-origin requests denied.',403);
 if(site&&!['same-origin','none'].includes(site))throw err('Cross-site requests denied.',403);
}
export async function onRequest({request,env}){
 try{
  if(request.method!=='POST')return respond({ok:false,error:'Method not allowed'},405);
  sameOrigin(request);
  const size=Number(request.headers.get('content-length')||0);
  if(size>LIMIT)throw err('Request too large.',413);
  const raw=await request.text();
  if(raw.length>LIMIT)throw err('Request too large.',413);
  let body;try{body=JSON.parse(raw)}catch{throw err('Invalid exercise request.',400)}
  if(!body||typeof body!=='object'||Array.isArray(body)||
     !['learning','lab'].includes(body.family)||!EDITIONS.includes(body.edition)||
     !body.payload||typeof body.payload!=='object'||Array.isArray(body.payload))
   throw err('Unsupported edition or exercise.',400);
  const rights=await authorizeEditionRequest({request,env,family:body.family,edition:body.edition});
  // Original exercises from caller-provided fictional bars ONLY. A client
  // cannot label an indicator as verified or assert licensed market rights.
  const evidence=body.payload.evidence;
  const derived=deriveFictionalCompletedStudies({
   evidence,emaPeriod:body.payload.emaPeriod??9});
  if(!derived)throw err('Valid completed fictional evidence required.',400);
  let answer=null;
  if(body.edition==='ADVANCED'&&body.activity==='advanced_formative_review'){
   const route=await reviewedRoute(env,rights.memberId);
   answer=advancedFormativeStudy({competencies:route.competencies,observations:route.observations,
    evidence:derived.evidence,indicators:derived.indicators});
  }else if(body.edition==='PROFESSIONAL'&&body.activity==='decision_replay_review'){
   const route=await reviewedRoute(env,rights.memberId);
   const frames=deriveFictionalCompletedFrames({
    evidence:derived.evidence,frameSize:body.payload.frameSize??5});
   if(frames)answer=professionalDecisionStudy({evidence:derived.evidence,
    indicators:derived.indicators,riskCases:body.payload.riskCases,frames,
    competencies:route.competencies,observations:route.observations});
  }else if(body.edition==='ENTERPRISE'&&body.activity==='chronological_validation'){
   // Original MEMBER-LABELED FICTIONAL observations only. Do not accept a
   // client-asserted provider rights manifest, license, held-out test selection
   // or historical source. No external market datasets are supported here.
   if(body.payload.manifest!==undefined||body.payload.sourceRights!==undefined||
      body.payload.historical!==undefined)
    throw err('External research sources require separately verified rights.',403);
   const embargo=body.payload.embargo??2;
   if(!Number.isSafeInteger(embargo)||embargo<1||embargo>3)
    throw err('Chronological holdout embargo must be 1 to 3 observations.',400);
   const completed=derived.evidence.bars;
   const trainEnd=Math.floor(completed.length*.6);
   const training=completed.slice(0,trainEnd).map(x=>x.close);
   if(training.length>=5){
    const mean=n=>training.slice(-n).reduce((a,b)=>a+b,0)/n;
    answer=enterpriseResearchStudy({
     manifest:[{id:'original-fictional-member-input',methodVersion:'v1',
      reference:'Member-entered fictional training data, not a licensed market dataset',
      asOf:derived.evidence.asOf,rights:'verified_for_requested_use',
      serverRightsVerified:true}],
     observations:completed.map(x=>({timestamp:x.timestamp,value:x.close})),
     embargo,
     sensitivity:[{method:'Training-only trailing mean',parameter:3,result:mean(3),
      holdoutUsedForSelection:false},
      {method:'Training-only trailing mean',parameter:5,result:mean(5),
       holdoutUsedForSelection:false}]
    });
   }
  }
  if(!answer)throw err('Exercise inputs or activity are invalid.',400);
  return respond({ok:true,family:body.family,edition:body.edition,
   result:answer,source:'MEMBER_SUPPLIED_FICTIONAL_UNGRADED',
   officialGrade:false,masteryAwarded:false,memberRecordsModified:false});
 }catch(error){
  const status=[400,401,403,405,413].includes(error?.status)?error.status:503;
  return respond({ok:false,error:status===503?'Learning edition service unavailable.':
   error.message||'Exercise unavailable.'},status);
 }
}
