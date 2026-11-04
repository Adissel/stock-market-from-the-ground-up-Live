/* Two-authenticated-identity API contract with stateful, isolated PostgREST
 * simulation. This verifies real Pages function handlers with MOCKED token
 * exchange, grant transitions and private storage. It is NOT genuine member
 * browser acceptance and never accesses live production records.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest as work} from '../functions/api/learning-lab-edition-workspace.js';
import {onRequest as exerciseApi} from '../functions/api/learning-lab-edition-exercise.js';

const A='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const B='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const END='2099-01-01T00:00:00Z';
const ORIGIN='https://local.test';
const PATH='/api/learning-lab-edition-workspace';
const ENV=Object.freeze({
 SUPABASE_URL:'https://mock.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_fixture',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture',
 ENGINE_LEARNING_ADVANCED_RELEASED:'true',ENGINE_LAB_ADVANCED_RELEASED:'true',
 ENGINE_LEARNING_PROFESSIONAL_RELEASED:'true',ENGINE_LAB_PROFESSIONAL_RELEASED:'true',
 ENGINE_LEARNING_ENTERPRISE_RELEASED:'true'
});
const bars=()=>({provenance:'fictional',asOf:12000,completedIndex:11,
 bars:Array.from({length:12},(_,i)=>({timestamp:1000*(i+1),
  open:100+i,high:102+i,low:99+i,close:101+i,volume:100+i}))});
function payload(family,edition='ADVANCED',caseKey='F1-C02-L01',revision=0){
 return {family,edition,caseKey,expectedRevision:revision,
  activity:edition==='ADVANCED'?'advanced_formative_review':'decision_replay_review',
  payload:{evidence:bars(),emaPeriod:9,frameSize:5,
   riskCases:[{entry:40,stop:38,riskBudget:100,availableCash:1000},
    {entry:40,stop:39,riskBudget:100,availableCash:1000}]}
 };
}
function grant(plan='FOUNDING_60',edition='PROFESSIONAL'){
 const item=()=>({active:true,edition,expiresAt:END,revoked:false});
 return {plan,status:'active',starts_at:'2026-01-01T00:00:00Z',ends_at:END,
  metadata:{engine_edition_grants_v1:{learning:item(),lab:item()}}};
}
function harness(){
 const original=globalThis.fetch,rows=new Map(),calls=[],runtimeEnv={...ENV},noTool=new Set(),suspended=new Set();
 const users=new Map([
  [A,grant()],
  [B,{...grant('FOUNDING_14','ADVANCED'),metadata:{}}]
 ]);
 let failConfig=false,tokenOverride=null,stageHook=null;
 const json=(value,status=200)=>new Response(JSON.stringify(value),
  {status,headers:{'content-type':'application/json'}});
 const identity=opts=>{
  const token=String(opts.headers?.get?.('authorization')||
   opts.headers?.authorization||'').replace(/^Bearer\s+/i,'');
  return tokenOverride||({session_a:A,session_b:B}[token]||null);
 };
 const owner=params=>String(params.get('user_id')||'').replace(/^eq\./,'');
 const selected=(params,fld)=>String(params.get(fld)||'').replace(/^eq\./,'');
 const key=(id,family,edition,caseKey)=>[id,family,edition,caseKey].join('|');
 globalThis.fetch=async(raw,opts={})=>{
  const url=new URL(String(raw)),p=url.pathname,method=opts.method||'GET',q=url.searchParams;
  calls.push({path:p,method,query:url.search,body:opts.body||null});
  if(p==='/auth/v1/user'){
   const id=identity(opts);
   return id?json({id}):json({error:'invalid session'},401);
  }
  if(p==='/rest/v1/profiles')return json([{account_kind:'member',deleted_at:null}]);
  if(p==='/rest/v1/admin_user_flags')return json(suspended.has(owner(q))?[{status:'suspended'}]:[]);
  if(p==='/rest/v1/admin_user_roles')return json([]);
  if(p==='/rest/v1/rpc/user_has_tool_access')return json(!noTool.has(JSON.parse(opts.body||'{}').target_user));
  if(p==='/rest/v1/gu_product_access_config_v1')return json(failConfig?{wrong:true}:[]);
  if(p==='/rest/v1/site_subscriptions')return json([]);
  if(p==='/rest/v1/user_plan_grants'){
   const entry=users.get(owner(q));
   if(!entry)return json([]);
   return json([{plan_code:entry.plan,status:entry.status,starts_at:entry.starts_at,
    ends_at:entry.ends_at,metadata:entry.metadata}]);
  }
  if(p==='/rest/v1/competency_definitions')
   return json([{competency_code:'EMA_CONTEXT',metadata:{prerequisites:['CANDLE_READING']}},
    {competency_code:'CANDLE_READING',metadata:{prerequisites:[]}}]);
  if(p==='/rest/v1/competency_evidence'){
   if(stageHook){const fn=stageHook;stageHook=null;fn()}
   return json([{competency_code:'EMA_CONTEXT',source_type:'instructor_review',passed:false,
    critical_error:false,metadata:{mapping_individually_reviewed:true},
    assessed_at:'2026-11-03T10:00:00Z'}]);
  }
  if(p==='/rest/v1/platform_labs'){
   const id=selected(q,'lab_id');
   return json(id==='F1-C02-L01'?[{lab_id:id,book_code:'FOUNDATION_BOOK_1',
    active:true,registry_visible:true}]:[]);
  }
  if(p==='/rest/v1/gu_learning_lab_edition_workspaces_v1'){
   const id=owner(q),family=selected(q,'family'),edition=selected(q,'edition');
   const caseKey=selected(q,'case_key'),expected=selected(q,'revision');
   if(method==='GET'){
    const row=rows.get(key(id,family,edition,caseKey));
    return json(row?[structuredClone(row)]:[]);
   }
   const data=JSON.parse(opts.body),name=key(data.user_id||id,
    data.family||family,data.edition||edition,data.case_key||caseKey);
   if(method==='POST'){
    if(rows.has(name))return json([]);
    const saved={id:rows.size+1,user_id:data.user_id,case_key:data.case_key,
     family:data.family,edition:data.edition,activity:data.activity,
     summary:data.summary,revision:1,updated_at:END};
    rows.set(name,saved);
    return json([{id:saved.id,revision:saved.revision,updated_at:saved.updated_at}]);
   }
   if(method==='PATCH'){
    const existing=rows.get(name);
    if(!existing||existing.revision!==Number(expected))return json([]);
    existing.revision=data.revision;
    existing.summary=data.summary;
    existing.activity=data.activity;
    existing.updated_at=data.updated_at;
    return json([{id:existing.id,revision:existing.revision,updated_at:existing.updated_at}]);
   }
  }
  throw Error('Unexpected stub endpoint '+method+' '+p);
 };
 const headers=id=>({authorization:'Bearer '+(id===A?'session_a':'session_b'),
  'content-type':'application/json',origin:ORIGIN});
 const post=(id,body)=>work({request:new Request(ORIGIN+PATH,
  {method:'POST',headers:headers(id),body:JSON.stringify(body)}),env:runtimeEnv});
 const get=(id,family,edition='ADVANCED',caseKey='F1-C02-L01',activity=null)=>{
  const q=new URLSearchParams({family,edition,caseKey});
  if(activity)q.set('activity',activity);
  return work({request:new Request(ORIGIN+PATH+'?'+q,
   {headers:headers(id)}),env:runtimeEnv});
 };
 const exercise=(id,body)=>exerciseApi({request:new Request(
  ORIGIN+'/api/learning-lab-edition-exercise',
  {method:'POST',headers:headers(id),body:JSON.stringify(body)}),env:runtimeEnv});
 return {A,B,users,rows,calls,post,get,exercise,env:runtimeEnv,
  setStageHook:fn=>{stageHook=fn},denyTool:id=>noTool.add(id),suspend:id=>suspended.add(id),
  restore:()=>{globalThis.fetch=original},
  setTokenOverride:id=>{tokenOverride=id},
  setFailConfig:v=>{failConfig=v}
 };
}

/* Four engine-edition pairs x 24 stateful scenarios = 96 source QA checks.
 * The production handlers are exercised with fake sessions and fake database.
 * No actual member browser authentication or release acceptance is claimed.
 */
const SPECS=[
 {family:'learning',edition:'ADVANCED'},{family:'lab',edition:'ADVANCED'},
 {family:'learning',edition:'PROFESSIONAL'},{family:'lab',edition:'PROFESSIONAL'}
];
const CASES=[
 'save_new','restore_own','basic_account_denied','second_account_own_row',
 'optimistic_revision','concurrent_cas','downgrade_denies_read',
 'revocation_denies_read','forged_key_not_saved','unlicensed_history_denied',
 'midflight_revocation','midflight_downgrade','midflight_identity_switch',
 'midflight_release_switch','midflight_expired_grant','midflight_tool_denial',
 'midflight_suspension','midflight_cancellation','midflight_optional_config_irrelevant',
 'canonical_lab_or_case_guard','no_lookahead_guard','cross_origin_guard',
 'regrant_restores_private_row','first_account_cannot_read_second'
];
function specSetup(f,spec){
 const plan=spec.edition==='ADVANCED'?'FOUNDING_30':'FOUNDING_60';
 f.users.set(A,grant(plan,spec.edition));
 return {b:(rev=0,key='F1-C02-L01')=>payload(spec.family,spec.edition,key,rev),
  flag:'ENGINE_'+spec.family.toUpperCase()+'_'+spec.edition+'_RELEASED',
  upgradeB:()=>f.users.set(B,grant(plan,spec.edition))};
}
async function exerciseCase(name,f,spec){
 const {b,flag,upgradeB}=specSetup(f,spec);
 const writes=()=>f.calls.filter(x=>x.path.includes('gu_learning_lab_edition_workspaces_v1')&&['POST','PATCH'].includes(x.method));
 const row=id=>[...f.rows.values()].find(x=>x.user_id===id);
 const first=async()=>{const r=await f.post(A,b());assert.equal(r.status,200,name);return r.json()};
 const noWrite=async(expected=403)=>{
  const r=await f.post(A,b());assert.equal(r.status,expected,name);
  assert.equal(writes().length,0,'No private record write after entitlement change');
  assert.equal(f.rows.size,0);
 };
 const aGrant=()=>f.users.get(A).metadata.engine_edition_grants_v1[spec.family];
 if(name==='save_new'){
  const d=await first();assert.equal(d.workspace.revision,1);
  assert.equal(d.officialGrade,false);assert.equal(d.masteryAwarded,false);
  assert.equal(row(A).family,spec.family);assert.equal(row(A).edition,spec.edition);
 }else if(name==='restore_own'){
  await first();const r=await f.get(A,spec.family,spec.edition);assert.equal(r.status,200);
  const d=await r.json();assert.equal(d.found,true);assert.equal(d.workspace.user_id,A);
 }else if(name==='basic_account_denied'){
  assert.equal((await f.get(B,spec.family,spec.edition)).status,403);
  assert.equal((await f.post(B,b())).status,403);assert.equal(writes().length,0);
 }else if(name==='second_account_own_row'){
  await first();upgradeB();const r=await f.get(B,spec.family,spec.edition);
  assert.equal(r.status,200);assert.equal((await r.json()).found,false);
  assert.equal((await f.post(B,b())).status,200);assert.equal(f.rows.size,2);
  assert.equal(row(B).user_id,B);
 }else if(name==='optimistic_revision'){
  await first();const r=await f.post(A,b(1));assert.equal(r.status,200);
  assert.equal((await r.json()).workspace.revision,2);
  assert.equal((await f.post(A,b(1))).status,409);assert.equal(row(A).revision,2);
 }else if(name==='concurrent_cas'){
  await first();const both=await Promise.all([f.post(A,b(1)),f.post(A,b(1))]);
  assert.deepEqual(both.map(x=>x.status).sort(),[200,409]);assert.equal(row(A).revision,2);
 }else if(name==='downgrade_denies_read'){
  await first();f.users.set(A,{...grant('FOUNDING_14','BASIC'),metadata:{}});
  assert.equal((await f.get(A,spec.family,spec.edition)).status,403);assert.equal(f.rows.size,1);
 }else if(name==='revocation_denies_read'){
  await first();aGrant().revoked=true;
  assert.equal((await f.get(A,spec.family,spec.edition)).status,403);assert.equal(f.rows.size,1);
 }else if(name==='forged_key_not_saved'){
  const input=b();input.payload.privateAnswerKey='FAKE_SECRET';
  input.payload.claimedMastery=100;input.claimedGrade=100;
  assert.equal((await f.post(A,input)).status,200);
  assert.equal(JSON.stringify(row(A)).includes('FAKE_SECRET'),false);
  assert.equal(JSON.stringify(row(A)).includes('claimedMastery'),false);
 }else if(name==='unlicensed_history_denied'){
  const input=b();input.payload.evidence.provenance='licensed_historical';
  assert.equal((await f.post(A,input)).status,400);assert.equal(writes().length,0);
 }else if(name==='midflight_revocation'){
  f.setStageHook(()=>{aGrant().revoked=true});await noWrite();
 }else if(name==='midflight_downgrade'){
  f.setStageHook(()=>f.users.set(A,{...grant('FOUNDING_14','BASIC'),metadata:{}}));
  await noWrite();
 }else if(name==='midflight_identity_switch'){
  upgradeB();f.setStageHook(()=>f.setTokenOverride(B));await noWrite();
 }else if(name==='midflight_release_switch'){
  f.setStageHook(()=>{f.env[flag]='false'});await noWrite();
 }else if(name==='midflight_expired_grant'){
  f.setStageHook(()=>{aGrant().expiresAt='2020-01-01T00:00:00Z'});await noWrite();
 }else if(name==='midflight_tool_denial'){
  f.setStageHook(()=>f.denyTool(A));await noWrite();
 }else if(name==='midflight_suspension'){
  f.setStageHook(()=>f.suspend(A));await noWrite();
 }else if(name==='midflight_cancellation'){
  f.setStageHook(()=>{f.users.get(A).status='canceled'});await noWrite();
 }else if(name==='midflight_optional_config_irrelevant'){
  // Optional product-display config is NOT an authorization grant or deny.
  // Only the server-owned active edition grant and tool permission decide.
  f.setStageHook(()=>f.setFailConfig(true));
  const result=await f.post(A,b());assert.equal(result.status,200);
  assert.equal(writes().length,1);assert.equal(f.rows.size,1);
 }else if(name==='canonical_lab_or_case_guard'){
  const key=spec.family==='lab'?'NOT_IN_CANONICAL_LABS':'INVALID!';
  assert.equal((await f.post(A,b(0,key))).status,spec.family==='lab'?404:400);
  assert.equal(writes().length,0);
 }else if(name==='no_lookahead_guard'){
  const input=b();input.payload.evidence.asOf=2000;
  assert.equal((await f.post(A,input)).status,400);assert.equal(writes().length,0);
 }else if(name==='cross_origin_guard'){
  const params=new URLSearchParams({family:spec.family,edition:spec.edition,caseKey:'F1-C02-L01'});
  const r=await work({request:new Request(ORIGIN+PATH+'?'+params,{
   headers:{authorization:'Bearer session_a',origin:'https://attacker.invalid'}}),env:f.env});
  assert.equal(r.status,403);assert.equal(f.calls.length,0);
 }else if(name==='regrant_restores_private_row'){
  await first();f.users.set(A,{...grant('FOUNDING_14','BASIC'),metadata:{}});
  assert.equal((await f.get(A,spec.family,spec.edition)).status,403);
  f.users.set(A,grant(spec.edition==='ADVANCED'?'FOUNDING_30':'FOUNDING_60',spec.edition));
  const r=await f.get(A,spec.family,spec.edition);
  assert.equal(r.status,200);assert.equal((await r.json()).found,true);assert.equal(f.rows.size,1);
 }else if(name==='first_account_cannot_read_second'){
  upgradeB();assert.equal((await f.post(B,b())).status,200);
  const r=await f.get(A,spec.family,spec.edition);
  assert.equal(r.status,200);assert.equal((await r.json()).found,false);
 }else throw Error('Missing scenario '+name);
}
for(const spec of SPECS)for(const name of CASES){
 test('AP Wave3 '+spec.family+'/'+spec.edition+' '+name,async()=>{
  const f=harness();try{await exerciseCase(name,f,spec)}finally{f.restore()}
 });
}
test('Wave3 verifies unique 96-case Advanced Professional source matrix',()=>{
 assert.equal(SPECS.length,4);assert.equal(CASES.length,24);
 assert.equal(new Set(CASES).size,24);
 assert.equal(SPECS.length*CASES.length,96);
});
