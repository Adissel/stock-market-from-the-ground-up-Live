import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/learning-lab-enterprise-journey.js';
const actor='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const env={SUPABASE_URL:'https://mock.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_fixture',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture',
 ENGINE_LEARNING_ENTERPRISE_RELEASED:'true',ENGINE_LAB_ENTERPRISE_RELEASED:'true'};
const req=(family='learning',headers={})=>new Request(
 'https://local.test/api/learning-lab-enterprise-journey?family='+family,
 {headers:{authorization:'Bearer member-test',...headers}});
function mock({grant=true,revoked=false,training=true,lab=true,malformed=false}={}){
 const previous=globalThis.fetch,calls=[];
 const json=(obj,status=200)=>new Response(JSON.stringify(obj),{status,
  headers:{'content-type':'application/json'}});
 globalThis.fetch=async(raw,opts={})=>{
  const u=new URL(String(raw));calls.push({path:u.pathname,method:opts.method||'GET',
   body:opts.body,search:u.search});
  if(u.pathname==='/auth/v1/user')return json({id:actor});
  if(u.pathname==='/rest/v1/profiles')return json([{account_kind:'member',deleted_at:null}]);
  if(u.pathname==='/rest/v1/admin_user_flags'||u.pathname==='/rest/v1/admin_user_roles')return json([]);
  if(u.pathname==='/rest/v1/gu_product_access_config_v1')return json([]);
  if(u.pathname==='/rest/v1/rpc/user_has_tool_access'){
   const tool=JSON.parse(opts.body).target_tool;
   return json(tool==='ONDEMAND_TRAINING'?training:lab);
  }
  if(u.pathname==='/rest/v1/site_subscriptions')return json([]);
  if(u.pathname==='/rest/v1/user_plan_grants')return json([{
   plan_code:'LIFETIME',status:'active',
   starts_at:'2026-01-01T00:00:00Z',ends_at:'2099-01-01T00:00:00Z',
   metadata:{engine_edition_grants_v1:grant?{
    learning:{active:true,edition:'ENTERPRISE',revoked,expiresAt:'2098-01-01T00:00:00Z'},
    lab:{active:true,edition:'ENTERPRISE',revoked,expiresAt:'2098-01-01T00:00:00Z'}
   }:{}}}]);
  if(u.pathname==='/rest/v1/platform_labs')return json(malformed?{}:[]);
  throw Error('Unrecognized QA endpoint '+u.pathname);
 };
 return {calls,restore:()=>globalThis.fetch=previous};
}
test('Read-only Enterprise Learning source path is seven verified Academy stages and no progress change',async()=>{
 const f=mock();try{
  const r=await onRequest({request:req('learning'),env});
  assert.equal(r.status,200);const data=await r.json();
  assert.equal(data.journey.stages.length,7);
  assert.equal(data.journey.academyDays,274);
  assert.equal(data.journey.trainingRouteAccess,undefined);
  assert.equal(data.journey.stages.every(s=>s.trainingLocked===false),true);
  assert.equal(data.externalResearchDataDelivered,false);
  assert.equal(data.memberRecordsModified,false);
  assert.equal(data.officialGrade,false);
  assert(f.calls.every(c=>!['PATCH','PUT','DELETE'].includes(c.method)));
  assert(f.calls.some(c=>c.path==='/rest/v1/platform_labs'));
 }finally{f.restore()}
});
test('Lab Enterprise cannot infer Academy access from separate Lab entitlement',async()=>{
 const f=mock({lab:true,training:false});try{
  const r=await onRequest({request:req('lab'),env});
  assert.equal(r.status,200);const d=await r.json();
  assert(d.journey.stages.every(s=>s.trainingLocked===true&&s.trainingHref===null));
  assert.equal(d.journey.bookLinksAreNotEntitlements,true);
 }finally{f.restore()}
});
test('Unreleased, missing, revoked, and missing family tool rights fail closed',async()=>{
 for(const config of [{grant:false},{revoked:true},{training:false},{lab:false}]){
  const f=mock(config);try{
   const family=config.lab===false?'lab':'learning';
   const r=await onRequest({request:req(family),env});
   assert.equal(r.status,403,JSON.stringify(config));
   assert(!f.calls.some(c=>c.path==='/rest/v1/platform_labs'));
  }finally{f.restore()}
 }
 const f=mock();try{
  assert.equal((await onRequest({request:req(),env:{
   ...env,ENGINE_LEARNING_ENTERPRISE_RELEASED:'false'}})).status,403);
 }finally{f.restore()}
});
test('Cross-site, unsupported family, and invalid registry cannot release path',async()=>{
 const f=mock();try{
  assert.equal((await onRequest({request:req('learning',{origin:'https://attacker.invalid'}),env})).status,403);
  assert.equal(f.calls.length,0);
  assert.equal((await onRequest({request:req('INVALID'),env})).status,400);
 }finally{f.restore()}
 const g=mock({malformed:true});try{
  assert.equal((await onRequest({request:req(),env})).status,503);
 }finally{g.restore()}
});
