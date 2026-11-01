/* Server-selected UI engine versions: never grants member access, scores, or Tutor AI. */
import {enginePolicyForPlan} from '../_lib/learning-engine-tier-policy-v1.js';
const h={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','vary':'Authorization'};
const out=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:h});
const bad=(m,s)=>Object.assign(new Error(m),{status:s});
const versions={learning:['LEARNING_V33_FREEZE_20261101','LEARNING_V33_CURRENT'],lab:['LAB_V32_FREEZE_20261101','LAB_V32_CURRENT'],tutor:['TALIA_FREEZE_20261101','TALIA_CURRENT']};
const fallback=code=>Object.fromEntries(Object.entries(versions).map(([k,v])=>[k,['FREE','PICK_WHAT_YOU_WANT','FOUNDING_14'].includes(code)?v[0]:v[1]]));
const tutorDefault=code=>({
 FREE:'FOUNDATION',PICK_WHAT_YOU_WANT:'FOUNDATION',FOUNDING_14:'FOUNDATION',
 FOUNDING_30:'ADVANCED',FOUNDING_60:'PROFESSIONAL',FULL_MONTHLY:'PROFESSIONAL',
 LIFETIME:'ENTERPRISE',ONDEMAND_MONTHLY:'PRODUCT_DEPENDENT'
})[code]||'UNASSIGNED';
const editions=['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE','PRODUCT_DEPENDENT'];
async function read(url,headers){const r=await fetch(url,{headers,cache:'no-store'}),j=await r.json().catch(()=>null);if(!r.ok)throw bad('Membership version service unavailable',503);return j}
export async function onRequest({request,env}){try{
 if(request.method!=='GET')return out({ok:false,error:'Method not allowed'},405);
 const base=String(env.SUPABASE_URL||'').replace(/\/$/,''),secret=String(env.SUPABASE_SECRET_KEY||''),pub=String(env.SUPABASE_PUBLISHABLE_KEY||'');
 if(!/^https:\/\//.test(base)||!secret||!pub)throw bad('Version service unavailable',503);
 const dbHeaders={apikey:secret,...(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(secret)?{authorization:'Bearer '+secret}:{})};
 const token=/^Bearer\s+(.+)$/i.exec(request.headers.get('authorization')||'')?.[1];
 let planCode='FREE';
 if(token){
  const user=await read(base+'/auth/v1/user',{apikey:pub,authorization:'Bearer '+token});
  if(!user?.id)throw bad('Invalid member session',401);
  const id=encodeURIComponent(user.id);
  const [profiles,flags,roles,subs]=await Promise.all([
   read(base+'/rest/v1/profiles?select=account_kind,deleted_at&id=eq.'+id+'&limit=1',dbHeaders),
   read(base+'/rest/v1/admin_user_flags?select=status&user_id=eq.'+id+'&limit=1',dbHeaders),
   read(base+'/rest/v1/admin_user_roles?select=role_code,expires_at&user_id=eq.'+id,dbHeaders),
   read(base+'/rest/v1/site_subscriptions?select=plan_code,status,current_period_end,updated_at&user_id=eq.'+id+'&order=updated_at.desc&limit=30',dbHeaders)
  ]);
  if(profiles[0]?.account_kind!=='member'||profiles[0].deleted_at!==null||
   ['suspended','restricted'].includes(String(flags[0]?.status||'').toLowerCase())||
   roles.some(r=>r.role_code==='SHOWCASE_VIEWER'&&(!r.expires_at||Date.parse(r.expires_at)>Date.now())))
   throw bad('Account ineligible for member versions',403);
  const chosen=subs.find(s=>['active','trialing'].includes(String(s.status||'').toLowerCase())&&
   (!s.current_period_end||Date.parse(s.current_period_end)>Date.now()));
  if(chosen&&/^[A-Z][A-Z0-9_]{1,63}$/.test(chosen.plan_code))planCode=chosen.plan_code;
 }
 const plans=await read(base+'/rest/v1/platform_plans?select=plan_code,metadata&plan_code=eq.'+encodeURIComponent(planCode)+'&limit=1',dbHeaders);
 const stored=plans[0]?.metadata?.learning_engines_v1,selected=fallback(planCode);
 for(const key of Object.keys(versions))if(versions[key].includes(stored?.[key]))selected[key]=stored[key];
 const savedEdition=plans[0]?.metadata?.talia_market_tutor_v1?.tier;
 const configuredEdition=editions.includes(savedEdition)?savedEdition:tutorDefault(planCode);
 // Higher-tier Talia functionality has not cleared production acceptance. Do
 // not interpret the plan's target edition as operational access or an AI grant.
 const effectiveEdition='FOUNDATION';
 return out({ok:true,planCode,versions:selected,
  engineTierPolicy:enginePolicyForPlan(planCode),
  tutorEdition:{configured:configuredEdition,effective:effectiveEdition,
   releaseStatus:configuredEdition==='FOUNDATION'?'foundation_source_only':
    configuredEdition==='UNASSIGNED'?'not_assigned':
    configuredEdition==='PRODUCT_DEPENDENT'?'verified_product_required':'premium_edition_not_released',
   featuresReleased:['source_grounded_teaching','ungraded_practice','existing_member_lesson_context'],
   premiumFeaturesAvailable:false},
  source:stored?'owner_assignment':'safe_default',
  notice:'Version choice does not grant any Lab, Boot Camp, Tutor AI, grade, historical replay or other entitlement.'});
 }catch(e){return out({ok:false,error:e.message||'Version selection failed'},e.status||503)}}
