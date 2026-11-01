// SMFGU-TALIA-BYOK-001 v1: fictional credentials, no external network or paid model.
import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {onRequest as credentialApi} from '../functions/api/credentials.js';
import {getMemberTutorApiKey,reserveMemberTutorByokRequest,memberTutorByokInferenceAllowed}
 from '../functions/_lib/talia-member-byok-v1.js';
import {callTutorModel} from '../functions/_lib/tutor-provider-v014107.js';
import {parseTutorRequest} from '../functions/_lib/tutor-request-boundary-v014147.js';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222';
const fakeKey='sk-'+ 'fixtureOnlyNoRealApiToken1234567890';
const env={
 SUPABASE_URL:'https://mock.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture',
 SUPABASE_SECRET_KEY:'sb_secret_fixture_is_not_live',
 MARKET_DATA_ENCRYPTION_KEY:'fictional-local-encryption-key-non-production-012345',
 TALIA_BYOK_PROVIDER_APPROVED:'false',TALIA_BYOK_CREDENTIALS_APPROVED:'false',
 TALIA_BYOK_ENABLED:'false',TALIA_BYOK_BILLING_DISCLOSURE_APPROVED:'false',
 TALIA_BYOK_PROVIDER_TERMS_VERSION:'v2026-11-01',
 TALIA_BYOK_ZERO_CHARGE_VERIFICATION_APPROVED:'false',
 TALIA_BYOK_MODEL:'gpt-4.1-mini',TALIA_BYOK_APPROVED_MODELS:'gpt-4.1-mini',
 TALIA_BYOK_MEMBER_DAILY_LIMIT:'3',TALIA_BYOK_GLOBAL_DAILY_LIMIT:'100',
 TALIA_BYOK_GLOBAL_MONTHLY_LIMIT:'1000'
};
const store=new Map();let active=A,modelCalls=0,verifyCalls=0,reserved=0;
const response=(x,status=200)=>new Response(JSON.stringify(x),{status,headers:{'content-type':'application/json'}});
const keyFor=(user,service)=>user+'|'+service;
const original=globalThis.fetch;
globalThis.fetch=async(url,opt={})=>{
 const u=String(url);
 if(u.endsWith('/auth/v1/user'))return response({id:active});
 if(u.includes('/profiles?'))return response([{account_kind:'member'}]);
 if(u.includes('/admin_user_flags?'))return response([{status:'active'}]);
 if(u.includes('/rest/v1/user_secure_credentials')){
  const user=/user_id=eq\.([^&]+)/.exec(u)?.[1];
  assert.ok(user===A||user===B,'credential row must be account-scoped');
  if(opt.method==='POST'){
   const v=JSON.parse(opt.body);
   assert.equal(v.user_id,active);
   assert.ok(v.credential_ciphertext&&!JSON.stringify(v).includes(fakeKey));
   store.set(keyFor(v.user_id,v.service_code),v);return response([]);
  }
  const service=/service_code=eq\.([^&]+)/.exec(u)?.[1];
  if(opt.method==='PATCH'){
   assert.equal(service,'TALIA_OPENAI_BYO');
   const existing=store.get(keyFor(user,service));assert.ok(existing);
   Object.assign(existing,JSON.parse(opt.body));return response([]);
  }
  if(opt.method==='DELETE'){
   assert.equal(service,'TALIA_OPENAI_BYO');
   store.delete(keyFor(user,service));return response([]);
  }
  if(service)return response(store.has(keyFor(user,service))?[store.get(keyFor(user,service))]:[]);
  return response([...store.values()].filter(v=>v.user_id===user).map(
   ({service_code,display_label,masked_hint,status,last_tested_at,metadata})=>
    ({service_code,display_label,masked_hint,status,last_tested_at,metadata})));
 }
 if(u.endsWith('/rest/v1/rpc/gu_v014103_reserve_ai_request')){
  reserved++;
  const v=JSON.parse(opt.body);
  assert.equal(v.p_user,active);
  assert.equal(v.p_member_day_limit,3);
  return response({accepted:true,reason:'accepted',remainingMemberToday:2});
 }
 if(u==='https://api.openai.com/v1/models'){
  verifyCalls++;
  assert.equal(opt.method,'GET');
  assert.equal(opt.headers.authorization,'Bearer '+fakeKey);
  return response({data:[{id:'fixture'}]});
 }
 if(u==='https://api.openai.com/v1/responses'){
  modelCalls++;
  assert.equal(opt.headers.authorization,'Bearer '+fakeKey);
  const v=JSON.parse(opt.body);
  assert.equal(v.model,'gpt-4.1-mini');assert.equal(v.store,false);
  return response({status:'completed',output:[{content:[{type:'output_text',text:'Fictional source-based explanation [1].'}]}]});
 }
 throw Error('Unexpected network: '+u);
};
const request=(action,method='GET',body,origin='https://site.test')=>new Request(
 'https://site.test/api/credentials?action='+action,{method,
 headers:{authorization:'Bearer fiction-member-session',origin,...(body?{'content-type':'application/json'}:{})},
 ...(body?{body:JSON.stringify(body)}:{})});
try{
 await test('disabled-by-default: no key acceptance or member model request',async()=>{
  let r=await credentialApi({request:request('save','POST',{serviceCode:'TALIA_OPENAI_BYO',values:{apiKey:fakeKey},confirmProviderCharges:true}),env});
  assert.equal(r.status,403);
  assert.equal(await getMemberTutorApiKey(env,A),null);
  assert.equal(memberTutorByokInferenceAllowed(env),false);
  const draft=await callTutorModel(env,{memberApiKey:fakeKey,instructions:'fictional',input:'fictional'});
  assert.equal(draft.ok,false);assert.equal(modelCalls,0);assert.equal(reserved,0);
 });
 await test('strict user input and cross-origin credential storage denial',async()=>{
  env.TALIA_BYOK_PROVIDER_APPROVED='true';env.TALIA_BYOK_CREDENTIALS_APPROVED='true';
  let r=await credentialApi({request:request('save','POST',{serviceCode:'TALIA_OPENAI_BYO',values:{apiKey:fakeKey},confirmProviderCharges:true},'https://evil.test'),env});
  assert.equal(r.status,403);
  r=await credentialApi({request:request('save','POST',{serviceCode:'TALIA_OPENAI_BYO',values:{apiKey:fakeKey}}),env});
  assert.equal(r.status,400);
  r=await credentialApi({request:request('save','POST',{serviceCode:'TALIA_OPENAI_BYO',values:{apiKey:'bad-key'},confirmProviderCharges:true}),env});
  assert.equal(r.status,400);
  const badRequest=new Request('https://site.test/api/market-tutor',{
   method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:'What is EMA?',useMemberKey:'yes'})});
  await assert.rejects(()=>parseTutorRequest(badRequest),/Invalid Tutor request/);
 });
 await test('original vault: encrypted personal key stored pending verification, no plaintext response',async()=>{
  const r=await credentialApi({request:request('save','POST',{serviceCode:'TALIA_OPENAI_BYO',values:{apiKey:fakeKey},confirmProviderCharges:true}),env});
  assert.equal(r.status,200);
  const v=await r.json();assert.equal(v.savedPendingVerification,true);assert.equal(v.verified,false);
  assert.ok(!JSON.stringify(v).includes(fakeKey));
  assert.equal(store.get(keyFor(A,'TALIA_OPENAI_BYO')).status,'saved_unverified');
  assert.equal(await getMemberTutorApiKey(env,A),null);
  const list=await credentialApi({request:request('list'),env});
  const shown=await list.json();assert.equal(shown.tutorByokAvailable,true);
  assert.ok(!JSON.stringify(shown).includes(fakeKey));
  assert.ok(!JSON.stringify(shown).includes('credential_ciphertext'));
 });
 await test('verification gate, valid-key verification, account isolation and no funded fallback',async()=>{
  let r=await credentialApi({request:request('verify','POST',{serviceCode:'TALIA_OPENAI_BYO'}),env});
  assert.equal(r.status,403);assert.equal(verifyCalls,0);
  env.TALIA_BYOK_ZERO_CHARGE_VERIFICATION_APPROVED='true';
  r=await credentialApi({request:request('verify','POST',{serviceCode:'TALIA_OPENAI_BYO'}),env});
  assert.equal(r.status,200);assert.equal(verifyCalls,1);
  env.TALIA_BYOK_ENABLED='true';env.TALIA_BYOK_BILLING_DISCLOSURE_APPROVED='true';
  assert.equal(await getMemberTutorApiKey(env,A),fakeKey);
  active=B;
  assert.equal(await getMemberTutorApiKey(env,B),null);
  const missing=await reserveMemberTutorByokRequest(env,B,'33333333-3333-4333-8333-333333333333');
  assert.equal(missing.accepted,true); // quota alone does not grant any key
  active=A;
  const accepted=await reserveMemberTutorByokRequest(env,A,'44444444-4444-4444-8444-444444444444');
  assert.equal(accepted.accepted,true);
  const draft=await callTutorModel(env,{memberApiKey:fakeKey,instructions:'Only cited fictional cases.',input:'What is EMA?'});
  assert.equal(draft.ok,true);assert.equal(modelCalls,1);
  env.TALIA_BYOK_ENABLED='false';
  assert.equal(await getMemberTutorApiKey(env,A),null);
  const blocked=await callTutorModel(env,{memberApiKey:fakeKey,instructions:'instruction',input:'question'});
  assert.equal(blocked.ok,false);assert.equal(modelCalls,1);
 });
 await test('disconnect removes only the authenticated member credential and preserves source-only operation',async()=>{
  const r=await credentialApi({request:request('delete','POST',{serviceCode:'TALIA_OPENAI_BYO'}),env});
  assert.equal(r.status,200);
  assert.ok(!store.has(keyFor(A,'TALIA_OPENAI_BYO')));
  assert.equal(await getMemberTutorApiKey(env,A),null);
  assert.equal(modelCalls,1);
 });
 await test('source integration and original market-data provider regression boundaries',()=>{
  const tutor=readFileSync('functions/api/market-tutor-v01492.js','utf8');
  const parser=readFileSync('functions/_lib/tutor-request-boundary-v014147.js','utf8');
  const base=readFileSync('functions/api/marketdata.js','utf8');
  const ui=readFileSync('src/ts/production-completion.ts','utf8');
  assert.match(tutor,/body\.useMemberKey===true\?await getMemberTutorApiKey/);
  assert.match(tutor,/await reserveMemberTutorByokRequest/);
  assert.match(parser,/useMemberKey:body\.useMemberKey===true/);
  assert.match(ui,/result\.tutorByokAvailable===true/);
  assert.match(base,/\['TIINGO_BYO','ALPACA_BYO'\]/);
  assert.doesNotMatch(ui,/localStorage\.setItem.*apiKey/);
 });
}finally{globalThis.fetch=original}
console.log('PASS Talia BYOK: existing vault, explicit provider/billing gates, optional member-only model, tenant isolation, deletion and source-only fallback');
