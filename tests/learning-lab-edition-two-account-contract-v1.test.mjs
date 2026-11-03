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
 ENGINE_LEARNING_PROFESSIONAL_RELEASED:'true',ENGINE_LAB_PROFESSIONAL_RELEASED:'true'
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
 const original=globalThis.fetch,rows=new Map(),calls=[];
 const users=new Map([
  [A,grant()],
  [B,{...grant('FOUNDING_14','ADVANCED'),metadata:{}}]
 ]);
 let failConfig=false,tokenOverride=null;
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
  if(p==='/rest/v1/admin_user_flags'||p==='/rest/v1/admin_user_roles')return json([]);
  if(p==='/rest/v1/rpc/user_has_tool_access')return json(true);
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
  if(p==='/rest/v1/competency_evidence')return json([
   {competency_code:'EMA_CONTEXT',source_type:'instructor_review',passed:false,
    critical_error:false,metadata:{mapping_individually_reviewed:true},
    assessed_at:'2026-11-03T10:00:00Z'}
  ]);
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
  {method:'POST',headers:headers(id),body:JSON.stringify(body)}),env:ENV});
 const get=(id,family,edition='ADVANCED',caseKey='F1-C02-L01')=>{
  const q=new URLSearchParams({family,edition,caseKey});
  return work({request:new Request(ORIGIN+PATH+'?'+q,
   {headers:headers(id)}),env:ENV});
 };
 const exercise=(id,body)=>exerciseApi({request:new Request(
  ORIGIN+'/api/learning-lab-edition-exercise',
  {method:'POST',headers:headers(id),body:JSON.stringify(body)}),env:ENV});
 return {A,B,users,rows,calls,post,get,exercise,
  restore:()=>{globalThis.fetch=original},
  setTokenOverride:id=>{tokenOverride=id},
  setFailConfig:v=>{failConfig=v}
 };
}
test('Both engine families isolate private case keys and exact actor identities',async()=>{
 const f=harness();
 try{
  for(const family of ['learning','lab']){
   const response=await f.post(A,payload(family));
   assert.equal(response.status,200,family);
   const body=await response.json();
   assert.equal(body.workspace.revision,1);
   assert.equal(body.officialGrade,false);
   assert.equal(body.masteryAwarded,false);
   const read=await f.get(A,family);
   assert.equal(read.status,200,family);
   const result=await read.json();
   assert.equal(result.found,true);
   assert.equal(result.workspace.family,family);
   assert.equal(result.workspace.user_id,A);
   assert.equal(result.workspace.summary.edition,'ADVANCED');
  }
  assert.equal(f.rows.size,2);
  assert.equal(f.calls.filter(x=>x.path.includes('workspaces_v1')&&x.method==='POST').length,2);
  assert.equal(f.calls.filter(x=>x.path.includes('workspaces_v1')&&x.method==='PATCH').length,0);
 }finally{f.restore()}
});
test('Basic second member cannot read or write another member premium workspaces',async()=>{
 const f=harness();
 try{
  assert.equal((await f.post(A,payload('lab'))).status,200);
  const before=f.calls.filter(x=>x.path.includes('workspaces_v1')).length;
  assert.equal((await f.get(B,'lab')).status,403);
  assert.equal((await f.get(B,'learning')).status,403);
  assert.equal((await f.post(B,payload('lab'))).status,403);
  assert.equal(f.calls.filter(x=>x.path.includes('workspaces_v1')).length,before);
  assert.equal(f.rows.size,1);
 }finally{f.restore()}
});
test('Second member with its own verified grant receives a separate empty workspace',async()=>{
 const f=harness();
 try{
  assert.equal((await f.post(A,payload('learning'))).status,200);
  f.users.set(B,grant('FOUNDING_30','ADVANCED'));
  const read=await f.get(B,'learning');
  assert.equal(read.status,200);
  assert.equal((await read.json()).found,false);
  assert.equal((await f.post(B,payload('learning'))).status,200);
  assert.equal(f.rows.size,2);
  assert.equal((await (await f.get(A,'learning')).json()).workspace.user_id,A);
  assert.equal((await (await f.get(B,'learning')).json()).workspace.user_id,B);
 }finally{f.restore()}
});
test('Downgrade, explicit revocation and expiry immediately hide previously saved work',async()=>{
 const f=harness();
 try{
  for(const family of ['learning','lab']){
   assert.equal((await f.post(A,payload(family))).status,200);
  }
  const previous=structuredClone(f.users.get(A));
  f.users.set(A,{...previous,plan:'FOUNDING_14',metadata:{}});
  assert.equal((await f.get(A,'learning')).status,403);
  assert.equal((await f.get(A,'lab')).status,403);
  assert.equal(f.rows.size,2,'Downgrade retains but hides owned private work');
  f.users.set(A,previous);
  assert.equal((await f.get(A,'lab')).status,200);
  const revoked=structuredClone(previous);
  revoked.metadata.engine_edition_grants_v1.lab.revoked=true;
  f.users.set(A,revoked);
  assert.equal((await f.get(A,'lab')).status,403);
  assert.equal((await f.post(A,payload('lab', 'ADVANCED','F1-C02-L01',1))).status,403);
  assert.equal((await f.get(A,'learning')).status,200,'Edition families revoke independently');
  const expired=structuredClone(previous);
  expired.metadata.engine_edition_grants_v1.learning.expiresAt='2020-01-01T00:00:00Z';
  f.users.set(A,expired);
  assert.equal((await f.get(A,'learning')).status,403);
  assert.equal((await f.get(A,'lab')).status,200);
 }finally{f.restore()}
});
test('Professional Learning and Lab snapshots restore separately after revision conflict',async()=>{
 const f=harness();
 try{
  for(const family of ['learning','lab']){
   const data=payload(family,'PROFESSIONAL');
   assert.equal((await f.post(A,data)).status,200);
   const updated=payload(family,'PROFESSIONAL','F1-C02-L01',1);
   updated.payload.riskCases[0].riskBudget=150;
   assert.equal((await f.post(A,updated)).status,200);
   assert.equal((await f.post(A,updated)).status,409,'Stale revision rejected');
   const restored=await (await f.get(A,family,'PROFESSIONAL')).json();
   assert.equal(restored.found,true);
   assert.equal(restored.workspace.revision,2);
   assert.equal(restored.workspace.summary.edition,'PROFESSIONAL');
   assert.equal(restored.workspace.summary.graded,false);
   assert.equal(restored.workspace.summary.masteryAwarded,false);
   assert.equal(restored.workspace.summary.hypotheticalRisk.length,2);
  }
  assert.equal(f.rows.size,2);
 }finally{f.restore()}
});
test('Simultaneous saves and initial duplicate cannot overwrite a newer revision',async()=>{
 const f=harness();
 try{
  const basic=payload('lab');
  assert.equal((await f.post(A,basic)).status,200);
  const same=payload('lab','ADVANCED','F1-C02-L01',1);
  const [r1,r2]=await Promise.all([f.post(A,same),f.post(A,same)]);
  assert.deepEqual([r1.status,r2.status].sort(),[200,409]);
  assert.equal((await f.post(A,basic)).status,409);
  const current=await (await f.get(A,'lab')).json();
  assert.equal(current.workspace.revision,2);
 }finally{f.restore()}
});
test('Server denies cross-user identity substitution and does not trust browser plan metadata',async()=>{
 const f=harness();
 try{
  const body=payload('learning');
  body.userId=B;body.memberId=B;body.plan_code='LIFETIME';
  assert.equal((await f.post(A,body)).status,200);
  const save=[...f.rows.values()][0];
  assert.equal(save.user_id,A,'Never trust submitted actor IDs');
  f.setTokenOverride(B);
  assert.equal((await f.get(A,'learning')).status,403,'Identity lookup controls rights, not the request label');
  f.setTokenOverride(null);
  assert.equal((await f.get(A,'learning')).status,200);
 }finally{f.restore()}
});
