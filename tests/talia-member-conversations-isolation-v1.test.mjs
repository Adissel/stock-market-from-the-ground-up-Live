import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest as conversations} from '../functions/api/member-tutor-conversations.js';
const A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222';
const AC='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',BC='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const env={SUPABASE_URL:'https://fixture.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture',
 SUPABASE_SECRET_KEY:'sb_secret_fixture'};
const reply=(x,code=200)=>new Response(JSON.stringify(x),{status:code,headers:{'content-type':'application/json'}});
let active=A,restricted=false;
const original=globalThis.fetch;
globalThis.fetch=async(url,opts={})=>{
 const u=String(url);
 if(u.endsWith('/auth/v1/user')){
  active=opts.headers.authorization.endsWith('token-free')?A:B;
  return reply({id:active});
 }
 if(u.includes('/rest/v1/profiles?'))return reply([{account_kind:'member',deleted_at:null}]);
 if(u.includes('/rest/v1/admin_user_flags?'))return reply(restricted?[{status:'restricted'}]:[]);
 if(u.includes('/rest/v1/admin_user_roles?'))return reply([]);
 if(u.includes('/rest/v1/rpc/user_has_tool_access'))return reply(active===B);
 if(u.includes('/rest/v1/gu_product_access_config_v1?'))return reply([]);
 if(u.includes('/rest/v1/rpc/gu_v014149_create_tutor_conversation')){
  const b=JSON.parse(opts.body);assert.equal(b.p_user,active);
  return reply(active===A?AC:BC);
 }
 if(u.includes('/rest/v1/gu_member_tutor_conversations_v014149?')){
  const uid=/user_id=eq\.([^&]+)/.exec(u)?.[1],id=/&id=eq\.([^&]+)/.exec(u)?.[1];
  assert.ok(uid===A||uid===B,'member row query must include user_id');
  const mine=uid===A?AC:BC;
  if(id)return reply(id===mine?[{id:mine}]:[]);
  return reply([{id:mine,title:uid===A?'Free private draft':'Founding private draft'}]);
 }
 throw Error('unexpected backend operation '+u);
};
const request=(key,method='GET',query='',payload=null)=>new Request('https://tutor.test/api/member-tutor-conversations'+query,{
 method,headers:{authorization:'Bearer '+key,...(payload?{'content-type':'application/json',origin:'https://tutor.test'}:{})},
 ...(payload?{body:JSON.stringify(payload)}:{})
});
try{
 await test('eligible Free and Founding members see only their own conversation list',async()=>{
  const a=await conversations({request:request('token-free'),env});
  const b=await conversations({request:request('token-paid'),env});
  assert.equal(a.status,200);assert.equal(b.status,200);
  const av=(await a.json()).conversations,bv=(await b.json()).conversations;
  assert.deepEqual(av.map(x=>x.id),[AC]);assert.deepEqual(bv.map(x=>x.id),[BC]);
  assert.ok(!JSON.stringify(av).includes(BC));
 });
 await test('Free member can create a private Tutor draft without a paid plan or model key',async()=>{
  const r=await conversations({request:request('token-free','POST','',{title:'My EMA Lesson'}),env});
  assert.equal(r.status,201);
  assert.equal((await r.json()).id,AC);
 });
 await test('cross-account identifiers cannot grant access to another saved conversation',async()=>{
  const r=await conversations({request:request('token-free','DELETE','?id='+BC),env});
  assert.equal(r.status,404);
  assert.equal((await r.json()).ok,false);
 });
 await test('restricted accounts cannot access history regardless of plan',async()=>{
  restricted=true;
  const r=await conversations({request:request('token-paid'),env});
  assert.equal(r.status,403);restricted=false;
 });
 await test('anonymous session never reaches member data',async()=>{
  const r=await conversations({request:new Request('https://tutor.test/api/member-tutor-conversations'),env});
  assert.equal(r.status,503); // auth guard maps failures to generic unavailable response
 });
}finally{globalThis.fetch=original}
