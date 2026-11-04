/* Server-verified Talia source-only teaching depth. The OWNER configured
 * target for a plan can enable authored curricular complexity, NOT unreleased
 * premium analytics, model inference, grade, or member access changes.
 * Add-on recognition requires an ACTIVE, server-issued product entitlement.
 */
import {depthIndex,availableDepths} from './talia-classroom-curriculum-v1.js';
import {TARGET_BY_PLAN} from './talia-member-evidence-v1.js';
const error=(message,status=503)=>Object.assign(new Error(message),{status});
const safeCode=x=>/^[A-Z][A-Z0-9_]{1,63}$/.test(String(x||''))?x:null;
const activeStatus=x=>['active','trialing'].includes(String(x||'').toLowerCase());
export function isActiveGrant(g,now){
 const start=Date.parse(g?.starts_at||'');
 const end=g?.ends_at==null?Infinity:Date.parse(g.ends_at);
 return activeStatus(g?.status)&&Number.isFinite(start)&&start<=now&&
  (end===Infinity||Number.isFinite(end)&&end>now);
}
export function isActiveSubscription(s,now){
 const end=s?.current_period_end==null?Infinity:Date.parse(s.current_period_end);
 return activeStatus(s?.status)&&(end===Infinity||Number.isFinite(end)&&end>now);
}
export function isActiveProduct(e,now){
 const start=e?.starts_at==null?null:Date.parse(e.starts_at);
 const end=e?.ends_at==null?Infinity:Date.parse(e.ends_at);
 return activeStatus(e?.status)&&start!==null&&Number.isFinite(start)&&start<=now&&
  (end===Infinity||Number.isFinite(end)&&end>now);
}
const ADDON_DEPTHS=Object.freeze({
 TALIA_TUTOR_ADVANCED:'ADVANCED',TALIA_TUTOR_PROFESSIONAL:'PROFESSIONAL',
 TALIA_TUTOR_ENTERPRISE:'ENTERPRISE'
});
export function teachingDepthFromVerifiedRows({grants=[],subscriptions=[],plans=[],products=[],now=Date.now()}={}){
 if(!Array.isArray(grants)||!Array.isArray(subscriptions)||!Array.isArray(plans)||!Array.isArray(products)||
   grants.length>30||subscriptions.length>30||products.length>30)
  throw error('Tutor entitlement records are unavailable.');
 const activePlans=[
  ...grants.filter(g=>isActiveGrant(g,now)).map(g=>safeCode(g.plan_code)),
  ...subscriptions.filter(s=>isActiveSubscription(s,now)).map(s=>safeCode(s.plan_code))
 ].filter(Boolean);
 const lookup=new Map(plans.filter(p=>safeCode(p?.plan_code)).map(p=>[p.plan_code,p]));
 let max='FOUNDATION',source='eligible_member';
 for(const code of activePlans){
  const policy=lookup.get(code);
  // An unregistered, unconfigured or product-dependent plan NEVER grants a tier.
  const configured=policy?.metadata?.talia_market_tutor_v1?.tier;
  const target=TARGET_BY_PLAN[code];
  if(!target||!policy||depthIndex(configured)<0)continue;
  // Registered Owner assignment may restrict, but cannot silently exceed the
  // expressly approved membership target. Future changes need new policy review.
  const ceiling=depthIndex(configured)<depthIndex(target)?configured:target;
  if(depthIndex(ceiling)>depthIndex(max)){max=ceiling;source='active_plan'}
 }
 for(const entitlement of products){
  if(!isActiveProduct(entitlement,now))continue;
  const depth=ADDON_DEPTHS[String(entitlement.product_key||'').toUpperCase()];
  if(depth&&depthIndex(depth)>depthIndex(max)){max=depth;source='active_tutor_addon'}
 }
 return {maximumDepth:max,allowedDepths:availableDepths(max),source,
  premiumFeaturesReleased:false,scope:'original_source_only_instruction'};
}
const tokenHeaders=secret=>{
 const h={apikey:secret,accept:'application/json'};
 if(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(secret))
  h.authorization='Bearer '+secret;
 return h;
};
export async function verifyTaliaTeachingDepth(env,userId){
 const base=String(env.SUPABASE_URL||'').replace(/\/$/,''),
  secret=String(env.SUPABASE_SECRET_KEY||'');
 if(!/^https:\/\/[^/]+$/.test(base)||!secret||!/^[a-f0-9-]{36}$/i.test(String(userId||'')))
  throw error('Tutor entitlement verifier unavailable.');
 const id=encodeURIComponent(userId),headers=tokenHeaders(secret);
 async function rows(path){
  const response=await fetch(base+'/rest/v1/'+path,{headers,cache:'no-store'});
  if(!response.ok)throw error('Tutor entitlement verification unavailable.');
  const data=await response.json().catch(()=>null);
  if(!Array.isArray(data))throw error('Tutor entitlement response invalid.');
  return data;
 }
 const [grants,subscriptions,products]=await Promise.all([
  rows('user_plan_grants?select=plan_code,status,starts_at,ends_at&user_id=eq.'+id+'&order=updated_at.desc&limit=30'),
  rows('site_subscriptions?select=plan_code,status,current_period_end&user_id=eq.'+id+'&order=updated_at.desc&limit=30'),
  rows('entitlements?select=product_key,status,starts_at,ends_at&user_id=eq.'+id+'&limit=30')
 ]);
 if(grants.length>=30||subscriptions.length>=30||products.length>=30)
  throw error('Tutor entitlement record limit reached: review required.');
 const codes=[...new Set([...grants.map(g=>g.plan_code),...subscriptions.map(s=>s.plan_code)]
  .filter(safeCode))];
 // Always require the registered Owner plan policy; FREE itself is Foundation.
 const plans=codes.length?await rows('platform_plans?select=plan_code,metadata&plan_code=in.('+codes.join(',')+')&limit=30'):[];
 return teachingDepthFromVerifiedRows({grants,subscriptions,plans,products});
}
