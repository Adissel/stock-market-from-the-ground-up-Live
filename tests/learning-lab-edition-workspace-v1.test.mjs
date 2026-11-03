import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/learning-lab-edition-workspace.js';
const uid='11111111-1111-4111-8111-111111111111';
const base='https://local.test/api/learning-lab-edition-workspace';
const env={SUPABASE_URL:'https://mock.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_fixture',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture',ENGINE_LAB_ADVANCED_RELEASED:'true'};
const evidence=()=>({provenance:'fictional',asOf:12000,completedIndex:11,
 bars:Array.from({length:12},(_,i)=>({timestamp:1000*(i+1),open:100+i,
 high:102+i,low:99+i,close:101+i,volume:50+i}))});
const exercise=({revision=0,caseKey='F1-C02-L01',edition='ADVANCED'}={})=>({
 caseKey,expectedRevision:revision,family:'lab',edition,
 activity:'advanced_formative_review',payload:{evidence:evidence(),emaPeriod:9}
});
const req=(body,headers={})=>new Request(base,{method:'POST',headers:{
 authorization:'Bearer valid',origin:'https://local.test','content-type':'application/json',
 ...headers},body:JSON.stringify(body)});
const readReq=(caseKey='F1-C02-L01')=>new Request(base+'?family=lab&edition=ADVANCED&caseKey='+caseKey,
 {headers:{authorization:'Bearer valid'}});
function setup({grant=true,revoked=false,expired=false,suspended=false,
 existing=null,writeRevision=1,conflict=false}={}){
 const original=globalThis.fetch,logs=[];
 const ok=data=>new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}});
 globalThis.fetch=async(url,opts={})=>{
  const loc=new URL(String(url)),method=opts.method||'GET';
  logs.push({pathname:loc.pathname,method,search:loc.search,body:opts.body});
  if(loc.pathname==='/auth/v1/user')return ok({id:uid});
  if(loc.pathname==='/rest/v1/profiles')return ok([{account_kind:'member',deleted_at:null}]);
  if(loc.pathname==='/rest/v1/admin_user_flags')return ok(suspended?[{status:'suspended'}]:[]);
  if(loc.pathname==='/rest/v1/admin_user_roles')return ok([]);
  if(loc.pathname==='/rest/v1/rpc/user_has_tool_access')return ok(true);
  if(loc.pathname==='/rest/v1/gu_product_access_config_v1')return ok([]);
  if(loc.pathname==='/rest/v1/site_subscriptions')return ok([{plan_code:'FOUNDING_30',
   status:'active',current_period_end:'2099-01-01T00:00:00Z',
   metadata:{engine_edition_grants_v1:grant?{lab:{active:true,edition:'ADVANCED',
    expiresAt:expired?'2020-01-01T00:00:00Z':'2098-01-01T00:00:00Z',revoked}}:{}}}]);
  if(loc.pathname==='/rest/v1/competency_definitions')return ok([
   {competency_code:'EMA_CONTEXT',metadata:{prerequisites:['CANDLE_READING']}}
  ]);
  if(loc.pathname==='/rest/v1/competency_evidence')return ok([
   {competency_code:'EMA_CONTEXT',source_type:'quiz',passed:false,critical_error:false,
    metadata:{mapping_individually_reviewed:true},assessed_at:'2026-11-03T12:00:00Z'}
  ]);
  if(loc.pathname==='/rest/v1/platform_labs'){
   const match=(loc.searchParams.get('lab_id')||'').replace(/^eq\./,'');
   return ok(match==='F1-C02-L01'?[{lab_id:match,book_code:'FOUNDATION_BOOK_1',
    active:true,registry_visible:true}]:[]);
  }
  if(loc.pathname==='/rest/v1/gu_learning_lab_edition_workspaces_v1'){
   if(method==='GET')return ok(existing?[existing]:[]);
   return ok(conflict?[]:[{id:17,revision:writeRevision,updated_at:'2026-11-02T20:00:00Z'}]);
  }
  throw Error('Unrecognized database endpoint '+loc.pathname);
 };
 return {logs,restore:()=>globalThis.fetch=original};
}
test('GET denies plan targets with no explicit edition grant',async()=>{
 const f=setup({grant:false});try{
  const r=await onRequest({request:readReq(),env});
  assert.equal(r.status,403);assert.equal(f.logs.some(x=>x.pathname.includes('workspaces_v1')),false);
 }finally{f.restore()}
});
test('GET denies expired, revoked and suspended member grants',async()=>{
 for(const args of [{expired:true},{revoked:true},{suspended:true}]){
  const f=setup(args);try{const r=await onRequest({request:readReq(),env});
   assert.equal(r.status,403,JSON.stringify(args));}finally{f.restore()}
 }
});
test('GET authorized member returns only scoped case and revision',async()=>{
 const f=setup({existing:{id:17,case_key:'F1-C02-L01',revision:2,summary:{graded:false}}});
 try{const r=await onRequest({request:readReq(),env});
  assert.equal(r.status,200);const b=await r.json();assert.equal(b.workspace.revision,2);
  const query=f.logs.find(x=>x.pathname.includes('workspaces_v1')).search;
  assert.match(query,/user_id=eq\./);assert.match(query,/case_key=eq\.F1-C02-L01/);
  assert.equal(b.masteryAwarded,false);
 }finally{f.restore()}
});
test('POST saves server-computed research evidence on initial revision',async()=>{
 const f=setup();try{
  const r=await onRequest({request:req(exercise()),env});
  assert.equal(r.status,200);const b=await r.json();
  assert.equal(b.workspace.revision,1);assert.equal(b.officialGrade,false);
  const write=f.logs.find(x=>x.method==='POST'&&x.pathname.includes('workspaces_v1'));
  assert.ok(write);const record=JSON.parse(write.body);
  assert.equal(record.user_id,uid);assert.equal(record.summary.edition,'ADVANCED');
  assert.equal(record.summary.evidence.indicators.some(x=>x.name==='EMA'),true);
  assert.equal(JSON.stringify(record).includes('privateAnswerKey'),false);
 }finally{f.restore()}
});
test('POST compare-and-swap prevents stale revision data overwrite',async()=>{
 const f=setup({writeRevision:3});try{
  const r=await onRequest({request:req(exercise({revision:2})),env});
  assert.equal(r.status,200);
  const write=f.logs.find(x=>x.method==='PATCH');
  assert.ok(write);assert.match(write.search,/revision=eq\.2/);
  assert.equal(JSON.parse(write.body).revision,3);
 }finally{f.restore()}
});
test('POST returns 409 when old or duplicate revision writes no row',async()=>{
 const f=setup({conflict:true});try{
  const r=await onRequest({request:req(exercise({revision:7})),env});
  assert.equal(r.status,409);assert.equal((await r.json()).ok,false);
 }finally{f.restore()}
});
test('Malformed keys and invalid optimistic revisions fail before DB lookups',async()=>{
 const f=setup();try{
  for(const body of [exercise({caseKey:'A<script>'}),exercise({revision:-1}),exercise({revision:1.5})]){
   const r=await onRequest({request:req(body),env});assert.equal(r.status,400);
  }
 }finally{f.restore()}
});
test('Forbidden external research source is never stored',async()=>{
 const f=setup();try{
  const body=exercise();body.payload.evidence.provenance='licensed_historical';
  const r=await onRequest({request:req(body),env});
  assert.equal(r.status,400);assert.equal(f.logs.some(x=>x.method==='POST'&&x.pathname.includes('workspaces_v1')),false);
 }finally{f.restore()}
});
test('Cross-site request is denied before member lookup',async()=>{
 const f=setup();try{
  const r=await onRequest({request:req(exercise(),{origin:'https://attacker.invalid'}),env});
  assert.equal(r.status,403);assert.equal(f.logs.length,0);
 }finally{f.restore()}
});
test('GET cannot read premium workspace after release switch is disabled',async()=>{
 const f=setup();try{
  const r=await onRequest({request:readReq(),env:{...env,ENGINE_LAB_ADVANCED_RELEASED:'false'}});
  assert.equal(r.status,403);
 }finally{f.restore()}
});

test('Premium Lab storage requires actual active canonical Lab identity',async()=>{
 const f=setup();try{
  const r=await onRequest({request:req(exercise({caseKey:'NONCANONICAL_LAB'})),env});
  assert.equal(r.status,404);
  assert.equal(f.logs.some(x=>x.method==='POST'&&x.pathname.includes('workspaces_v1')),false);
 }finally{f.restore()}
});
