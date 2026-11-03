import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/learning-lab-enterprise-case-workbench.js';
const ACTOR='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const env={SUPABASE_URL:'https://mock.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_test',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',
 ENGINE_LAB_ENTERPRISE_RELEASED:'true',ENGINE_LEARNING_ENTERPRISE_RELEASED:'true'};
const caseFor=(id,shift=0)=>({caseId:id,evidence:{provenance:'fictional',
 asOf:15000,completedIndex:14,
 bars:Array.from({length:17},(_,i)=>({timestamp:(i+1)*1000,
  open:100+i+shift,high:102+i+shift,low:99+i+shift,
  close:101+i+shift,volume:100+i*5}))}});
const form=family=>({family,cases:[caseFor('ORIGINAL_A'),caseFor('ORIGINAL_B',1)],embargo:2});
const request=(body,headers={})=>new Request('https://local.test/api/learning-lab-enterprise-case-workbench',
 {method:'POST',headers:{authorization:'Bearer current-member','content-type':'application/json',
  ...headers},body:JSON.stringify(body)});
function mock({family='lab',active=true,revoked=false,grant=true,tool=true}={}){
 const original=globalThis.fetch,calls=[];
 const json=v=>new Response(JSON.stringify(v),{status:200,
  headers:{'content-type':'application/json'}});
 globalThis.fetch=async(raw,opts={})=>{
  const u=new URL(String(raw));calls.push({path:u.pathname,method:opts.method||'GET'});
  if(u.pathname==='/auth/v1/user')return json({id:ACTOR});
  if(u.pathname==='/rest/v1/profiles')return json([{account_kind:'member',deleted_at:null}]);
  if(u.pathname==='/rest/v1/admin_user_flags'||u.pathname==='/rest/v1/admin_user_roles')return json([]);
  if(u.pathname==='/rest/v1/rpc/user_has_tool_access')return json(tool);
  if(u.pathname==='/rest/v1/gu_product_access_config_v1')return json([]);
  if(u.pathname==='/rest/v1/site_subscriptions')return json([]);
  if(u.pathname==='/rest/v1/user_plan_grants')return json([{
   plan_code:'LIFETIME',status:active?'active':'canceled',
   starts_at:'2026-01-01T00:00:00Z',ends_at:'2099-01-01T00:00:00Z',
   metadata:{engine_edition_grants_v1:grant?{
    [family]:{active:true,revoked,edition:'ENTERPRISE',
     expiresAt:'2098-01-01T00:00:00Z'}}:{}}}]);
  throw Error('Unexpected fixture path '+u.pathname);
 };
 return {calls,restore:()=>globalThis.fetch=original};
}
test('Both engine families compute only authorized fictional training evidence without member writes',async()=>{
 for(const family of ['learning','lab']){
  const s=mock({family});try{
   const r=await onRequest({request:request(form(family)),env});
   assert.equal(r.status,200,family);
   const d=await r.json();
   assert.equal(d.ok,true);assert.equal(d.result.cases.length,2);
   assert.equal(d.result.heldOutEvaluationCount,undefined);
   assert.equal(d.result.holdoutValuesReturned,false);
   assert.equal(d.memberRecordsModified,false);
   assert.equal(d.officialGrade,false);
   assert(s.calls.every(x=>!['PATCH','PUT','DELETE'].includes(x.method)));
  }finally{s.restore()}
 }
});
test('Unreleased, revoked, missing, and canceled plan grants deny both engine family cases',async()=>{
 for(const variant of [{revoked:true},{grant:false},{active:false},{tool:false}]){
  const s=mock(variant);try{
   const r=await onRequest({request:request(form('lab')),env});
   assert.equal(r.status,403,JSON.stringify(variant));
  }finally{s.restore()}
 }
 const s=mock();try{
  const r=await onRequest({request:request(form('lab')),
   env:{...env,ENGINE_LAB_ENTERPRISE_RELEASED:'false'}});
  assert.equal(r.status,403);
 }finally{s.restore()}
});
test('Cross-origin, external rights forgery and invalid chronological inputs fail closed',async()=>{
 const s=mock();try{
  const cross=await onRequest({request:request(form('lab'),{origin:'https://attacker.invalid'}),env});
  assert.equal(cross.status,403);assert.equal(s.calls.length,0);
  const input=form('lab');input.cases[1].providerUrl='https://feed.invalid';
  assert.equal((await onRequest({request:request(input),env})).status,400);
  const invalid=form('lab');invalid.cases[1].evidence.asOf=17000;
  assert.equal((await onRequest({request:request(invalid),env})).status,400);
 }finally{s.restore()}
});
