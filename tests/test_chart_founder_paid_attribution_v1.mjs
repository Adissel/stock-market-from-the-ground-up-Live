import assert from 'node:assert/strict';
import {crownlightChartEntitlement} from '../functions/api/chart-tier-access.js';

/* Pure in-process provider fixtures: NO real users, payments, wallets or writes.
 * Separates verified founder billing cycles from noncommercial chart QA and
 * from temporary single-wallet Crownlight Lumen access.
 */
const uid='c1cae99f-b6a0-4fc2-9369-d0c3a4de0991';
const root='https://oxihglyfgzywsupnyicb.supabase.co';
const env={SUPABASE_URL:root,SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture_only',
 SUPABASE_SECRET_KEY:'sb_secret_fixture_only'};
const request=new Request('https://academy.example/api/chart-tier-access?tier=PROFESSIONAL',
 {headers:{authorization:'Bearer fixture-member-jwt','x-membership-plan':'FOUNDING_60'}});
const now=Date.now(),day=86400000;
const date=n=>new Date(now+n*day).toISOString();
const billing=(plan,{reversed=false,expired=false}={})=>({
 plan_code:plan,billing_start:date(expired?-64:-2),billing_end:date(expired?-1:60),
 reversed_at:reversed?date(-1):null
});
const fixture=(state={})=>async (input,options={})=>{
 const u=new URL(String(input));
 const p=u.pathname;
 let data;
 if(p==='/auth/v1/user')data={id:uid};
 else if(p.startsWith('/auth/v1/admin/users/'))return new Response('{}',{status:404});
 else if(p.endsWith('/profiles'))data=[{account_kind:'member',deleted_at:null}];
 else if(p.endsWith('/admin_user_flags'))data=[];
 else if(p.endsWith('/admin_user_roles'))data=[];
 else if(p.endsWith('/rpc/user_has_tool_access'))data=true;
 else if(p.endsWith('/gu_product_access_config_v1'))data=[];
 else if(p.endsWith('/gu_founder_release_v014173'))data=[{public_launch_open:false,enrollment_enabled:false}];
 else if(p.endsWith('/gu_founder_members_v014173'))data=u.searchParams.get('select')==='revoked_at'
  ?(state.member===false?[]:[{revoked_at:state.revoked?date(-1):null}])
  :[{founder_number:101}];
 else if(p.endsWith('/gu_founder_reservations_v014173'))data=[];
 else if(p.endsWith('/gu_storefront_items_v014174'))data=[];
 else if(p.endsWith('/gu_founder_paid_cycles_v014173'))data=state.cycles||[];
 else if(p.endsWith('/user_plan_grants'))data=[];
 else if(p.endsWith('/crownlight_chart_qa_grants_v1'))data=state.chartQA||[];
 else if(p.endsWith('/gu_sparks_chart_passes_v1'))data=state.passes||[];
 else if(p.endsWith('/crownlight_chart_cash_upgrades_v1'))data=[];
 else throw Error('Unexpected chart permission dependency '+p);
 return new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}});
};
async function check(name,state,tier,reasonFragment){
 const saved=globalThis.fetch;globalThis.fetch=fixture(state);
 try {
  const v=await crownlightChartEntitlement(env,request);
  assert.equal(v.ok,true,name);assert.equal(v.tier,tier,name);
  assert(v.reason.includes(reasonFragment),name+': unexpected access origin '+v.reason);
  assert.deepEqual(v.allowed,tier==='PROFESSIONAL'
   ?['STANDARD','ADVANCED','PROFESSIONAL']
   :tier==='ADVANCED'?['STANDARD','ADVANCED']:['STANDARD'],name);
  if(reasonFragment.includes('paid term'))assert.equal(v.noncommercialChartQa,false,
   'A verified paid cycle must not be classified as QA access');
 }finally{globalThis.fetch=saved}
}
await check('60-day actual non-reversed verified billing cycle',
 {cycles:[billing('FOUNDING_60')]},'PROFESSIONAL','Verified active FOUNDING_60 paid term');
await check('30-day actual non-reversed verified billing cycle',
 {cycles:[billing('FOUNDING_30')]},'ADVANCED','Verified active FOUNDING_30 paid term');
await check('14-day actual non-reversed verified billing cycle',
 {cycles:[billing('FOUNDING_14')]},'STANDARD','Free Membership');
await check('60-day paid cycle reversed',
 {cycles:[billing('FOUNDING_60',{reversed:true})]},'STANDARD','Free Membership');
await check('60-day paid cycle expired',
 {cycles:[billing('FOUNDING_60',{expired:true})]},'STANDARD','Free Membership');
await check('60-day paid cycle but no founder member row',
 {member:false,cycles:[billing('FOUNDING_60')]},'STANDARD','Free Membership');
await check('60-day paid cycle with founder member revoked',
 {revoked:true,cycles:[billing('FOUNDING_60')]},'STANDARD','Free Membership');
await check('claimed Professional in client query/header without paid cycle',
 {},'STANDARD','Free Membership');
await check('expired paid 60-day cycle retains only independent Advanced Lumen pass',
 {cycles:[billing('FOUNDING_60',{expired:true})],
  passes:[{tier:'ADVANCED',expires_at:date(3)}]},
 'ADVANCED','Active Crownlight Sparks Chart Studio pass');
await check('noncommercial scoped Professional access does not confer 60-day paid membership',
 {chartQA:[{tier:'PROFESSIONAL',scope:'CHART_STUDIO_ONLY',
  starts_at:date(-1),ends_at:date(3),revoked_at:null}]},
 'PROFESSIONAL','Temporary noncommercial Chart Studio testing');
console.log('PASS 10/10 source-level provider-fixture Chart Studio paid-plan, expiry, reversal, 14/30/60, forged-label and chart-only attribution checks; NO provider/production activity.');
