import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/learning-lab-edition-exercise.js';
const actor='11111111-1111-4111-8111-111111111111';
const env={SUPABASE_URL:'https://mock.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_example',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_example',
 ENGINE_LEARNING_ADVANCED_RELEASED:'true',ENGINE_LAB_ADVANCED_RELEASED:'true',
 ENGINE_LAB_PROFESSIONAL_RELEASED:'true',ENGINE_LEARNING_ENTERPRISE_RELEASED:'true'};
const until='2099-01-01T00:00:00.000Z';
function fixture({memberId=actor,active=true,tool=true,plan='FOUNDING_30',edition='ADVANCED',
 family='learning',expiresAt=until,revoked=false,grant=true,
 store='site_subscriptions',startsAt='2026-01-01T00:00:00Z',
 endsAt=until}={}){
 const original=globalThis.fetch,calls=[];
 const res=x=>new Response(JSON.stringify(x),{status:200,headers:{'content-type':'application/json'}});
 globalThis.fetch=async(url,options={})=>{
  const u=new URL(String(url));calls.push({pathname:u.pathname,search:u.search,method:options.method||'GET'});
  if(u.pathname==='/auth/v1/user')return res({id:memberId});
  if(u.pathname==='/rest/v1/profiles')return res([{account_kind:'member',deleted_at:null}]);
  if(u.pathname==='/rest/v1/admin_user_flags'||u.pathname==='/rest/v1/admin_user_roles')return res([]);
  if(u.pathname==='/rest/v1/rpc/user_has_tool_access')return res(tool);
  if(u.pathname==='/rest/v1/gu_product_access_config_v1')return res([]);
  const row={plan_code:plan,status:active?'active':'canceled',
   metadata:{engine_edition_grants_v1:grant?{
     [family]:{active:true,edition,expiresAt,revoked}
   }:{}}};
  if(u.pathname==='/rest/v1/site_subscriptions')
   return res(store==='site_subscriptions'?[{...row,
    current_period_start:startsAt,current_period_end:endsAt}]:[]);
  if(u.pathname==='/rest/v1/user_plan_grants')
   return res(store==='user_plan_grants'?[{...row,
    starts_at:startsAt,ends_at:endsAt}]:[]);
  if(u.pathname==='/rest/v1/competency_definitions')return res([
   {competency_code:'EMA_CONTEXT',metadata:{prerequisites:['CANDLE_READING']}},
   {competency_code:'CANDLE_READING',metadata:{prerequisites:[]}}
  ]);
  if(u.pathname==='/rest/v1/competency_evidence')return res([
   {competency_code:'EMA_CONTEXT',source_type:'quiz',passed:false,critical_error:false,
    metadata:{mapping_individually_reviewed:true},assessed_at:'2026-11-03T12:00:00Z'}
  ]);
  throw Error('Unexpected server-side fixture request '+u.pathname);
 };
 return {calls,restore:()=>globalThis.fetch=original};
}
const evidence=()=>({provenance:'fictional',asOf:12000,completedIndex:11,
 bars:Array.from({length:14},(_,i)=>({timestamp:(i+1)*1000,
 open:100+i,high:101+i,low:99+i,close:100.5+i,volume:100+i}))});
const request=(data,headers={})=>new Request('https://local.test/api/learning-lab-edition-exercise',
 {method:'POST',headers:{authorization:'Bearer member-session','content-type':'application/json',...headers},
 body:JSON.stringify(data)});
const form=(edition='ADVANCED',family='learning')=>({family,edition,
 activity:edition==='ADVANCED'?'advanced_formative_review':
 edition==='PROFESSIONAL'?'decision_replay_review':'chronological_validation',
 payload:{evidence:evidence(),emaPeriod:9,frameSize:5,
 riskCases:[{entry:40,stop:38,riskBudget:100,availableCash:1000}],
 indicators:[{name:'EMA',value:99999,verified:true,asOf:1,method:'user forged'}]}});
test('No flag means premium source never becomes a grant',async()=>{
 const f=fixture();try{const r=await onRequest({request:request(form()),env:{...env,ENGINE_LEARNING_ADVANCED_RELEASED:'false'}});
  assert.equal(r.status,403);assert.equal((await r.json()).ok,false);}finally{f.restore()}
});
test('A plan TARGET without explicit grant does not enable premium',async()=>{
 const f=fixture({grant:false});try{const r=await onRequest({request:request(form()),env});
 assert.equal(r.status,403)}finally{f.restore()}
});
test('An expired or revoked member grant is denied',async()=>{
 for(const overrides of [{expiresAt:'2020-01-01T00:00:00Z'},{revoked:true},{active:false},{tool:false}]){
  const f=fixture(overrides);try{const r=await onRequest({request:request(form()),env});
  assert.equal(r.status,403,JSON.stringify(overrides))}finally{f.restore()}
 }
});
test('An Advanced grant cannot unlock Professional through plan claims',async()=>{
 const f=fixture({plan:'FOUNDING_60',family:'lab',edition:'ADVANCED'});try{
 const r=await onRequest({request:request(form('PROFESSIONAL','lab')),env});assert.equal(r.status,403)
 }finally{f.restore()}
});
test('Approved Advanced source works using server-computed fictional math, ignoring forged client indicator claims',async()=>{
 const f=fixture();try{const r=await onRequest({request:request(form()),env});assert.equal(r.status,200);
 const body=await r.json();assert.equal(body.ok,true);assert.equal(body.result.edition,'ADVANCED');
 const values=body.result.evidence.indicators;assert.equal(values.length,6);
 assert.equal(body.result.remediation.length,1);
 assert.deepEqual(body.result.remediation[0].sequence,['CANDLE_READING','EMA_CONTEXT']);
 const evidenceCall=f.calls.find(x=>x.pathname==='/rest/v1/competency_evidence');
 assert.ok(evidenceCall);assert.match(evidenceCall.search,/user_id=eq\.11111111-1111-4111-8111-111111111111/);
 assert(values.some(x=>x.name==='EMA'));assert(values.some(x=>x.name==='VWAP'));
 for(const name of ['RSI','MACD','ATR','BOLL'])assert(values.some(x=>x.name===name),name);
 assert(values.every(x=>x.value!==99999));assert.equal(body.officialGrade,false);
 assert.equal(body.memberRecordsModified,false);
 assert(f.calls.every(x=>!['PATCH','PUT','DELETE'].includes(x.method)));
 }finally{f.restore()}
});
test('Approved Professional source returns ungraded risk and aligned completed frames',async()=>{
 const f=fixture({plan:'FOUNDING_60',edition:'PROFESSIONAL',family:'lab'});
 try{const r=await onRequest({request:request(form('PROFESSIONAL','lab')),env});assert.equal(r.status,200);
 const result=(await r.json()).result;assert.equal(result.hypotheticalRisk[0].shares,25);
 assert.equal(result.frames.length,2);assert.equal(result.noLookahead,true);
 assert.equal(result.frames[1].changeFromPrior,5);
 assert.deepEqual(result.remediation[0].sequence,['CANDLE_READING','EMA_CONTEXT']);
 assert.equal(result.graded,false);assert.equal(result.masteryAwarded,false);
 }finally{f.restore()}
});
test('Premium endpoints forbid browser-asserted market data rights, even with an entitlement',async()=>{
 const f=fixture();try{
 const body=form();body.payload.evidence.provenance='licensed_historical';
 const r=await onRequest({request:request(body),env});assert.equal(r.status,400);
 }finally{f.restore()}
});
test('Enterprise grant produces fictional training-only chronology, embargo, and protected holdout',async()=>{
 const f=fixture({family:'learning',plan:'LIFETIME',edition:'ENTERPRISE'});try{
 const r=await onRequest({request:request(form('ENTERPRISE','learning')),env});
 assert.equal(r.status,200);const response=await r.json();
 assert.equal(response.ok,true);assert.equal(response.result.edition,'ENTERPRISE');
 assert.equal(response.result.holdoutProtected,true);
 assert.equal(response.result.training.count,7);
 assert.equal(response.result.embargo.count,2);
 assert.equal(response.result.evaluation.count,3);
 assert.equal(response.result.graded,false);
 assert.equal(response.memberRecordsModified,false);
 }finally{f.restore()}
});
test('Enterprise refuses browser-supplied external rights or provider manifests',async()=>{
 const f=fixture({family:'learning',plan:'LIFETIME',edition:'ENTERPRISE'});try{
 const forged=form('ENTERPRISE','learning');
 forged.payload.manifest=[{id:'unlicensed',serverRightsVerified:true}];
 const r=await onRequest({request:request(forged),env});
 assert.equal(r.status,403);assert.match((await r.json()).error,/verified rights/i);
 }finally{f.restore()}
});
test('Forged cross-origin POST denied before any service-role or member lookup',async()=>{
 const f=fixture();try{
 const r=await onRequest({request:request(form(),{origin:'https://attacker.invalid'}),env});
 assert.equal(r.status,403);assert.equal(f.calls.length,0);
 }finally{f.restore()}
});
test('Malformed body and GET are rejected without membership service calls',async()=>{
 const f=fixture();try{
 const bad=await onRequest({request:request({family:'lab',edition:'PROFESSIONAL'}),env});
 assert.equal(bad.status,400);
 const get=await onRequest({request:new Request('https://local.test/api/learning-lab-edition-exercise'),env});
 assert.equal(get.status,405);assert.equal(f.calls.length,0);
 }finally{f.restore()}
});

test('Authoritative active user_plan_grants metadata works without site subscriptions',async()=>{
 const f=fixture({store:'user_plan_grants',plan:'FOUNDING_60',edition:'PROFESSIONAL',family:'lab'});
 try{
  const r=await onRequest({request:request(form('PROFESSIONAL','lab')),env});
  assert.equal(r.status,200);assert.equal((await r.json()).result.edition,'PROFESSIONAL');
  assert(f.calls.some(x=>x.pathname==='/rest/v1/user_plan_grants'));
  assert(f.calls.some(x=>x.pathname==='/rest/v1/site_subscriptions'));
  assert(f.calls.find(x=>x.pathname==='/rest/v1/user_plan_grants').search.includes('user_id=eq.'));
 }finally{f.restore()}
});
test('User-plan grants remain fail closed for revoked, expired, future or missing grants',async()=>{
 const variants=[
  {revoked:true},{expiresAt:'2020-01-01T00:00:00Z'},
  {endsAt:'2020-01-01T00:00:00Z'},
  {startsAt:'2099-01-01T00:00:00Z'},{active:false},{grant:false},
  {plan:'FOUNDING_14'}
 ];
 for(const variant of variants){
  const f=fixture({store:'user_plan_grants',plan:'FOUNDING_60',
   edition:'PROFESSIONAL',family:'lab',...variant});
  try{
   const r=await onRequest({request:request(form('PROFESSIONAL','lab')),env});
   assert.equal(r.status,403,JSON.stringify(variant));
  }finally{f.restore()}
 }
});
test('Lifetime user-plan grant requires explicit unexpired engine grant even with no plan end',async()=>{
 const f=fixture({store:'user_plan_grants',plan:'LIFETIME',family:'learning',
  edition:'ENTERPRISE',endsAt:null});
 try{
  const r=await onRequest({request:request(form('ENTERPRISE','learning')),env});
  assert.equal(r.status,200);
 }finally{f.restore()}
});
