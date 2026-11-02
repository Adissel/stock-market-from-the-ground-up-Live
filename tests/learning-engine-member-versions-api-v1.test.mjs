/* Noncharging endpoint behavior: mocked provider, no real accounts or Supabase writes. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest as ownerEndpoint} from '../functions/api/admin-learning-engine-versions.js';
import {onRequest as memberEndpoint} from '../functions/api/member-learning-engine-versions.js';
const env={SUPABASE_URL:'https://mock.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_fake',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fake'};
const FREE={learning:'LEARNING_V33_FREEZE_20261101',lab:'LAB_V32_FREEZE_20261101',tutor:'TALIA_FREEZE_20261101'};
const CURRENT={learning:'LEARNING_V33_CURRENT',lab:'LAB_V32_CURRENT',tutor:'TALIA_CURRENT'};
const freePlan={plan_code:'FREE',name:'Free Membership',active:true,public_visible:true,
 metadata:{learning_engines_v1:{...FREE,revision:1}}};
const flexPlan={plan_code:'PICK_WHAT_YOU_WANT',name:'Pick What You Want',active:true,public_visible:false,
 metadata:{learning_engines_v1:{...FREE,revision:1}}};
const fullPlan={plan_code:'FULL_MONTHLY',name:'Full Platform',active:true,public_visible:false,metadata:{}};
const allPlans=[freePlan,flexPlan,fullPlan];
function setup({role='OWNER',flag='',sub=null}={}){
 const calls=[],saved=[];const original=globalThis.fetch;
 globalThis.fetch=async(url,opts={})=>{
  const u=new URL(String(url)),path=u.pathname;
  calls.push({path,method:opts.method||'GET'});
  const result=data=>new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}});
  if(path.endsWith('/auth/v1/user'))return result({id:'11111111-1111-4111-8111-111111111111'});
  if(path.endsWith('/rest/v1/profiles'))return result([{account_kind:'member',deleted_at:null}]);
  if(path.endsWith('/rest/v1/admin_user_roles'))
   return result(['OWNER','SHOWCASE_VIEWER'].includes(role)?[{role_code:role,expires_at:null}]:[]);
  if(path.endsWith('/rest/v1/admin_user_flags'))return result(flag?[{status:flag}]:[]);
  if(path.endsWith('/rest/v1/site_subscriptions'))return result(sub?[sub]:[]);
  if(path.endsWith('/rest/v1/platform_plans')){
   const code=/plan_code=eq\.([A-Z_0-9]+)/.exec(u.search);
   return result(code?allPlans.filter(p=>p.plan_code===code[1]):allPlans);
  }
  if(path.endsWith('/rest/v1/rpc/gu_owner_assign_learning_engines_v1')){
   const payload=JSON.parse(opts.body);saved.push(payload);
   return result({learning:payload.p_learning,lab:payload.p_lab,tutor:payload.p_tutor,revision:payload.p_expected_revision+1});
  }
  throw Error('Unexpected mock provider request: '+path);
 };
 return {calls,saved,restore:()=>{globalThis.fetch=original}};
}
const auth={'authorization':'Bearer mock-signed-token'};
const make=(path,opts={})=>new Request('https://local.test'+path,opts);
test('Only active Owner may read all plan version assignments',async()=>{
 const mock=setup();try{
  let r=await ownerEndpoint({request:make('/api/admin-learning-engine-versions',{headers:auth}),env});
  assert.equal(r.status,200);const json=await r.json();
  assert.equal(json.assignments.length,3);
  assert.equal(json.assignments.find(x=>x.planCode==='FREE').learning,FREE.learning);
  assert.equal(json.assignments.find(x=>x.planCode==='PICK_WHAT_YOU_WANT').tutor,FREE.tutor);
 }finally{mock.restore()}
 const noOwner=setup({role:'MODERATOR'});try{
  let r=await ownerEndpoint({request:make('/api/admin-learning-engine-versions',{headers:auth}),env});
  assert.equal(r.status,403);assert.equal(noOwner.saved.length,0);
 }finally{noOwner.restore()}
 const restricted=setup({flag:'restricted'});try{
  let r=await ownerEndpoint({request:make('/api/admin-learning-engine-versions',{headers:auth}),env});
  assert.equal(r.status,403);
 }finally{restricted.restore()}
});
test('Owner update validates versions and uses one atomic RPC',async()=>{
 const mock=setup();try{
  const headers={...auth,'content-type':'application/json'};
  let r=await ownerEndpoint({request:make('/api/admin-learning-engine-versions',{method:'POST',headers,
   body:JSON.stringify({planCode:'FREE',learning:'LEARNING_V33_UNKNOWN',lab:FREE.lab,tutor:FREE.tutor,revision:1})}),env});
  assert.equal(r.status,400);assert.equal(mock.saved.length,0);
  r=await ownerEndpoint({request:make('/api/admin-learning-engine-versions',{method:'POST',headers,
   body:JSON.stringify({planCode:'FREE',...CURRENT,revision:1})}),env});
  assert.equal(r.status,200);assert.equal(mock.saved.length,1);
  assert.deepEqual({learning:mock.saved[0].p_learning,lab:mock.saved[0].p_lab,tutor:mock.saved[0].p_tutor},CURRENT);
 }finally{mock.restore()}
});
test('Member resolver selects frozen FREE and individually entitled Flex defaults without grants',async()=>{
 const mock=setup();try{
  const r=await memberEndpoint({request:make('/api/member-learning-engine-versions'),env});
  assert.equal(r.status,200);const x=await r.json();
  assert.equal(x.planCode,'FREE');assert.deepEqual(x.versions,FREE);
  assert(mock.calls.every(c=>c.method==='GET'));
 }finally{mock.restore()}
 const flex=setup({sub:{plan_code:'PICK_WHAT_YOU_WANT',status:'active',current_period_end:'2099-01-01T00:00:00Z'}});
 try{const r=await memberEndpoint({request:make('/api/member-learning-engine-versions',{headers:auth}),env});
  assert.equal(r.status,200);const x=await r.json();assert.deepEqual(x.versions,FREE);
 }finally{flex.restore()}
});
test('Member resolver returns current for paid active plan but not revoked or restricted',async()=>{
 const active=setup({sub:{plan_code:'FULL_MONTHLY',status:'active',current_period_end:'2099-01-01T00:00:00Z'}});
 try{const r=await memberEndpoint({request:make('/api/member-learning-engine-versions',{headers:auth}),env});
  assert.equal(r.status,200);const x=await r.json();assert.equal(x.planCode,'FULL_MONTHLY');assert.deepEqual(x.versions,CURRENT);
 }finally{active.restore()}
 const expired=setup({sub:{plan_code:'FULL_MONTHLY',status:'canceled',current_period_end:'2026-01-01T00:00:00Z'}});
 try{const r=await memberEndpoint({request:make('/api/member-learning-engine-versions',{headers:auth}),env});
  assert.equal(r.status,200);assert.deepEqual((await r.json()).versions,FREE);
 }finally{expired.restore()}
 const restricted=setup({flag:'restricted'});
 try{const r=await memberEndpoint({request:make('/api/member-learning-engine-versions',{headers:auth}),env});
  assert.equal(r.status,403);
 }finally{restricted.restore()}
});

test('Unknown subscription plan fails closed to registered FREE without current engine editions',async()=>{
 const unknown=setup({sub:{plan_code:'UNREGISTERED_PREMIUM',status:'active',current_period_end:'2099-01-01T00:00:00Z'}});
 try{
  const r=await memberEndpoint({request:make('/api/member-learning-engine-versions',{headers:auth}),env});
  assert.equal(r.status,200);
  const payload=await r.json();
  assert.equal(payload.planCode,'FREE');
  assert.deepEqual(payload.versions,FREE);
  assert.equal(payload.engineTierPolicy.premiumFeaturesReleased,false);
  assert(unknown.calls.some(call=>call.path.endsWith('/rest/v1/platform_plans')));
  assert(unknown.calls.every(call=>call.method==='GET'));
 }finally{unknown.restore()}
});

test('Member-version endpoint denies writes and malformed provider configuration before network access',async()=>{
 const post=await memberEndpoint({request:make('/api/member-learning-engine-versions',{method:'POST'}),env});
 assert.equal(post.status,405);
 const unavailable=await memberEndpoint({request:make('/api/member-learning-engine-versions'),env:{SUPABASE_URL:'http://insecure.example',SUPABASE_SECRET_KEY:'x',SUPABASE_PUBLISHABLE_KEY:'x'}});
 assert.equal(unavailable.status,503);
});
test('Suspended member cannot inspect engine versions even with an active subscription',async()=>{
 const m=setup({flag:'suspended',sub:{plan_code:'FULL_MONTHLY',status:'active',current_period_end:'2099-01-01T00:00:00Z'}});
 try{
  const response=await memberEndpoint({request:make('/api/member-learning-engine-versions',{headers:auth}),env});
  assert.equal(response.status,403);
  assert(m.calls.every(x=>x.method==='GET'));
 }finally{m.restore()}
});
test('Showcase-only access cannot inherit member version selection',async()=>{
 const m=setup({role:'SHOWCASE_VIEWER',sub:{plan_code:'FULL_MONTHLY',status:'active',current_period_end:'2099-01-01T00:00:00Z'}});
 try{
  const response=await memberEndpoint({request:make('/api/member-learning-engine-versions',{headers:auth}),env});
  assert.equal(response.status,403);
 }finally{m.restore()}
});

test('Expired active paid subscription cannot select current premium engine editions',async()=>{
 const m=setup({sub:{plan_code:'FULL_MONTHLY',status:'active',current_period_end:'2026-01-01T00:00:00Z'}});
 try{
  const response=await memberEndpoint({request:make('/api/member-learning-engine-versions',{headers:auth}),env});
  assert.equal(response.status,200);
  const result=await response.json();
  assert.equal(result.planCode,'FREE');
  assert.deepEqual(result.versions,FREE);
 }finally{m.restore()}
});
test('Valid trialing member resolves currently assigned plan without granting premium features',async()=>{
 const m=setup({sub:{plan_code:'FULL_MONTHLY',status:'trialing',current_period_end:'2099-01-01T00:00:00Z'}});
 try{
  const response=await memberEndpoint({request:make('/api/member-learning-engine-versions',{headers:auth}),env});
  assert.equal(response.status,200);
  const result=await response.json();
  assert.equal(result.planCode,'FULL_MONTHLY');
  assert.deepEqual(result.versions,CURRENT);
  assert.equal(result.engineTierPolicy.premiumFeaturesReleased,false);
  assert.equal(result.tutorEdition.premiumFeaturesAvailable,false);
 }finally{m.restore()}
});

test('Explicitly invalid bearer session never falls back to anonymous Free silently',async()=>{
 const m=setup();
 try{
  const original=globalThis.fetch;
  globalThis.fetch=async(url,opts={})=>{
   if(String(url).includes('/auth/v1/user'))return new Response(JSON.stringify({error:'invalid JWT'}),{status:401,headers:{'content-type':'application/json'}});
   return original(url,opts);
  };
  const response=await memberEndpoint({request:make('/api/member-learning-engine-versions',{headers:auth}),env});
  assert.equal(response.status,503);
  assert.equal((await response.json()).ok,false);
 }finally{m.restore()}
});
test('Unknown subscription state cannot select paid-plan versions',async()=>{
 const m=setup({sub:{plan_code:'FULL_MONTHLY',status:'past_due',current_period_end:'2099-01-01T00:00:00Z'}});
 try{
  const response=await memberEndpoint({request:make('/api/member-learning-engine-versions',{headers:auth}),env});
  assert.equal(response.status,200);
  assert.equal((await response.json()).planCode,'FREE');
 }finally{m.restore()}
});

test('Anonymous request cannot produce premium member versions',async()=>{
 const m=setup({sub:{plan_code:'FULL_MONTHLY',status:'active',current_period_end:'2099-01-01T00:00:00Z'}});
 try{
  const response=await memberEndpoint({request:make('/api/member-learning-engine-versions'),env});
  assert.equal(response.status,200);
  const payload=await response.json();
  assert.equal(payload.planCode,'FREE');
  assert.deepEqual(payload.versions,FREE);
  assert.equal(payload.tutorEdition.premiumFeaturesAvailable,false);
 }finally{m.restore()}
});
