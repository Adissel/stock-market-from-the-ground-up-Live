/* Talia premium authorized member-runtime beta, wave 1.
 * No entitlement mutation, paid model, browser-provided progress, raw answer
 * keys, unrestricted historical replay or customer-visible general release.
 * All 9 outputs derive from authenticated existing member records or explicitly
 * reviewed original teaching briefs. Non-beta callers fail closed.
 */
import {toolAccess} from './member-tool-access.js';
import {onRequest as competenciesRoute} from './competencies.js';
import {fictionalReplayPermitted} from '../_lib/fictional-replay-policy-v1.js';
import {
 betaTier,tierIndex,authenticLearningEvidence,authenticReplayEvidence,authenticEnterpriseEvidence
} from '../_lib/talia-member-evidence-v1.js';

const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','vary':'Authorization','x-content-type-options':'nosniff','x-robots-tag':'noindex, nofollow'};
const out=(obj,status=200)=>new Response(JSON.stringify(obj),{headers:H,status});
const fail=(msg,status=400)=>Object.assign(new Error(msg),{status});
const enc=encodeURIComponent;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TIER=new Set(['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE']);
const CODE=/^[A-Z][A-Z0-9_]{2,49}$/;
function dbOptions(env){
 const base=String(env.SUPABASE_URL||'').replace(/\/$/,'');
 const secret=String(env.SUPABASE_SECRET_KEY||'');
 if(!/^https:\/\/[^/]+\.supabase\.co$/.test(base)||!secret)throw fail('Member evidence service unavailable.',503);
 const h={apikey:secret,accept:'application/json'};
 if(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(secret))
  h.authorization='Bearer '+secret;
 return{base,h};
}
async function rest(env,path){
 const {base,h}=dbOptions(env);
 const response=await fetch(base+'/rest/v1/'+path,{headers:h,cache:'no-store'});
 if(!response.ok)throw fail('Member evidence storage unavailable.',503);
 const result=await response.json().catch(()=>null);
 if(!Array.isArray(result))throw fail('Member evidence response malformed.',503);
 return result;
}
export function betaTesterAllowed(env,userId){
 if(!UUID.test(userId)||env?.TALIA_PREMIUM_BETA_ENABLED!=='true')return false;
 const ids=String(env.TALIA_PREMIUM_BETA_USER_IDS||'').split(',')
  .map(x=>x.trim().toLowerCase()).filter(x=>UUID.test(x));
 return ids.length>0&&ids.length<=8&&new Set(ids).size===ids.length&&ids.includes(userId.toLowerCase());
}
function currentPlan(grants,subscriptions,now){
 const active=g=>['active','trialing'].includes(String(g.status||'').toLowerCase());
 const grant=grants.find(g=>active(g)&&Date.parse(g.starts_at||'')<=now&&Number.isFinite(Date.parse(g.starts_at||''))&&
  (g.ends_at==null||Number.isFinite(Date.parse(g.ends_at))&&Date.parse(g.ends_at)>now));
 const sub=subscriptions.find(s=>active(s)&&
  (s.current_period_end==null||Number.isFinite(Date.parse(s.current_period_end))&&Date.parse(s.current_period_end)>now));
 const code=String((grant||sub)?.plan_code||'FREE').toUpperCase();
 return /^[A-Z][A-Z0-9_]{1,63}$/.test(code)?code:'FREE';
}
async function memberTier(env,userId,requested){
 const id=enc(userId);
 const [grants,subscriptions]=await Promise.all([
  rest(env,'user_plan_grants?select=plan_code,status,starts_at,ends_at,updated_at&user_id=eq.'+id+'&order=updated_at.desc&limit=30'),
  rest(env,'site_subscriptions?select=plan_code,status,current_period_end,updated_at&user_id=eq.'+id+'&order=updated_at.desc&limit=30')
 ]);
 if(grants.length>30||subscriptions.length>30)throw fail('Cannot verify all active membership grants.',503);
 const code=currentPlan(grants,subscriptions,Date.now());
 const plans=await rest(env,'platform_plans?select=plan_code,metadata&plan_code=eq.'+enc(code)+'&limit=1');
 if(plans.length!==1||plans[0].plan_code!==code)throw fail('Membership policy could not be verified.',403);
 const saved=plans[0]?.metadata?.talia_market_tutor_v1?.tier;
 const allowed=betaTesterAllowed(env,userId);
 return {...betaTier({planCode:code,configured:saved,requested,allowlisted:allowed,
   enabled:env.TALIA_PREMIUM_BETA_ENABLED==='true',
   allTiers:env.TALIA_PREMIUM_BETA_ALL_TIERS==='true'}),planCode:code};
}
async function readOwnLearning(env,userId){
 const id=enc(userId);
 const [labs,days,enrollments]=await Promise.all([
  rest(env,'site_lab_progress?select=lab_id,status,updated_at&user_id=eq.'+id+'&order=updated_at.desc&limit=80'),
  rest(env,'gu_bootcamp_academy_progress_v014168?select=program_code,day_number,status,updated_at&user_id=eq.'+id+'&order=updated_at.desc&limit=150'),
  rest(env,'gu_bootcamp_academy_enrollments_v014168?select=program_code,status,program_version&user_id=eq.'+id+'&limit=40')
 ]);
 return{labs,days,enrollments};
}
async function competencySkills(request,env){
 // Reuse canonical independently-graded competency computation, not a new
 // guessed score/competency algorithm. Only summarized output goes to the UI.
 const u=new URL(request.url);
 u.pathname='/api/competencies';u.search='?action=summary';
 const req=new Request(u.toString(),{method:'GET',headers:{authorization:request.headers.get('authorization')}});
 const response=await competenciesRoute({request:req,env});
 if(!response.ok)throw fail('Verified competency evidence is unavailable.',response.status===401?401:503);
 const result=await response.json().catch(()=>null);
 if(result?.ok!==true||result.synthetic===true||!Array.isArray(result.skills)||
   result.skills.length!==30)throw fail('Canonical competency status unavailable.',503);
 return result.skills;
}
async function memberReplay(env,userId){
 const id=enc(userId);
 const sessions=await rest(env,'gu_replay_sessions_v01492?select=id,dataset_code,current_index,decision_locked,decision,status,expires_at,created_at&user_id=eq.'+id+
  '&status=eq.active&expires_at=gt.'+enc(new Date().toISOString())+'&dataset_code=like.GUSIM_*&order=created_at.desc&limit=1');
 if(!sessions.length)return null;
 const s=sessions[0];
 if(!UUID.test(s.id)||!Number.isSafeInteger(s.current_index)||s.current_index<0||s.current_index>100000)
  throw fail('Invalid member-owned replay session.',503);
 const datasets=await rest(env,'market_datasets?select=dataset_code,dataset_type,status,source_attribution,license_note,metadata&dataset_code=eq.'+enc(s.dataset_code)+'&limit=1');
 const dataset=datasets[0];
 if(!fictionalReplayPermitted(dataset))throw fail('Replay educational source is not approved.',403);
 const first=Math.max(0,s.current_index-39);
 const bars=await rest(env,'gu_replay_bars_v01492?select=bar_index,bar_at,open,high,low,close,volume&dataset_code=eq.'+enc(s.dataset_code)+
  '&bar_index=gte.'+first+'&bar_index=lte.'+s.current_index+'&order=bar_index.asc&limit=40');
 if(!bars.length||bars.at(-1)?.bar_index!==s.current_index)throw fail('Current authorized replay cursor was not found.',503);
 return authenticReplayEvidence({session:s,bars,dataset});
}
async function originalGuides(env,request){
 if(typeof env.ASSETS?.fetch!=='function')throw fail('First-party teaching source unavailable.',503);
 const r=await env.ASSETS.fetch(new Request(new URL('/data/tutor-indicator-study-v1.json',request.url),{method:'GET'}));
 if(!r.ok)throw fail('First-party source catalogue unavailable.',503);
 const x=await r.json().catch(()=>null);
 if(x?.count!==61||!Array.isArray(x.guides)||x.guides.length!==61)return [];
 return x.guides.filter(g=>['STUDY_VWAP','STUDY_EMA'].includes(g.code)||
  /^(Volume.Weighted Average Price|Exponential Moving Average)$/.test(g.title||'')).slice(0,2);
}
export async function onRequest({request,env}){
 try{
  if(request.method!=='GET')throw fail('Member Tutor beta is read-only.',405);
  const u=new URL(request.url);
  const requested=String(u.searchParams.get('tier')||'').toUpperCase();
  const topic=String(u.searchParams.get('topic')||'').toUpperCase();
  if(requested&&!TIER.has(requested)||topic&&!CODE.test(topic))throw fail('Invalid Tutor tier or competency ID.',400);
  // Authentication and free/premium Tutor eligibility are always validated
  // against canonical member account status, not user_metadata or a UI tier.
  const member=await toolAccess(env,request,'MARKET_TUTOR');
  if(member.freeEligible!==true||!UUID.test(member.userId))throw fail('Eligible member required.',403);
  const entitlement=await memberTier(env,member.userId,requested);
  if(!entitlement.beta||entitlement.requestDenied||tierIndex(entitlement.effective)<0)
   throw fail('Premium member beta is not enabled for this authenticated account or tier.',403);
  const tier=entitlement.effective;
  const result={ok:true,scope:'AUTHENTICATED_MEMBER_BETA',version:1,
   tier,effectiveTier:tier,targetTier:entitlement.target,planCode:entitlement.planCode,
   sourceOnlyTeaching:true,paidAiInvoked:false,premiumCommerciallyReleased:false,
   noLearningProgressModified:true,noOfficialGradesWritten:true,
   independentPremiumReleaseAcceptance:false,features:{}};
  if(tierIndex(tier)>=1){
   const [skills,own]=await Promise.all([competencySkills(request,env),readOwnLearning(env,member.userId)]);
   const summary=authenticLearningEvidence({skills,labs:own.labs,academy:own.days,topicCode:topic});
   result.features.A01=summary.a01;result.features.A02=summary.a02;result.features.A03=summary.a03;
   result.learningLimitations=summary.limitations;
   if(tierIndex(tier)>=3){
    const guides=await originalGuides(env,request);
    const enterprise=authenticEnterpriseEvidence({enrollments:own.enrollments,
     progress:own.days,labs:own.labs,guides});
    result.features.E01=enterprise.e01;
    result.features.E02=enterprise.e02;
    result.features.E03=enterprise.e03;
    result.enterpriseLimitations=enterprise.limitations;
   }
  }
  if(tierIndex(tier)>=2){
   const context=await memberReplay(env,member.userId);
   result.features.P01=context?.p01||{capability:'Verified replay chart',evidenceStatus:'no_active_approved_fictional_replay',
    notice:'Start an authorized fictional replay to connect current completed candles.'};
   result.features.P02=context?.p02||{capability:'No-lookahead replay coaching',evidenceStatus:'no_active_replay'};
   result.features.P03=context?.p03||{capability:'Private decision-point debrief',evidenceStatus:'no_active_replay',
    note:'No decision or outcome can be inferred without an authorized replay.'};
   result.replayLimitations=context?.limitations||['No fictional replay active for this member'];
  }
  // Minimal response excludes UUID, raw assessment, grades, answer keys,
  // other members' data and raw Academy reflections.
  return out(result);
 }catch(e){return out({ok:false,error:e?.message||'Member Tutor beta unavailable.'},
  Number.isInteger(e?.status)?e.status:503)}
}
