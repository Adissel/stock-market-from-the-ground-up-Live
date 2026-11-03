/* 64 independent negative/positive authorization matrix checks.
 * Exercising actual API logic with mocked identity, grant and database transport.
 * NOT authenticated production-member or real two-account acceptance.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/learning-lab-edition-exercise.js';

const memberId='11111111-1111-4111-8111-111111111111';
const envBase={
 SUPABASE_URL:'https://mock.supabase.co',
 SUPABASE_SECRET_KEY:'sb_secret_local_test_only',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_local_test_only',
 ENGINE_LEARNING_ADVANCED_RELEASED:'true',
 ENGINE_LAB_ADVANCED_RELEASED:'true',
 ENGINE_LEARNING_PROFESSIONAL_RELEASED:'true',
 ENGINE_LAB_PROFESSIONAL_RELEASED:'true'
};
const combinations=[
 {family:'learning',edition:'ADVANCED',plan:'FOUNDING_30'},
 {family:'lab',edition:'ADVANCED',plan:'FOUNDING_30'},
 {family:'learning',edition:'PROFESSIONAL',plan:'FOUNDING_60'},
 {family:'lab',edition:'PROFESSIONAL',plan:'FOUNDING_60'}
];
const scenarios=[
 ['valid',200],['release_disabled',403],['missing_grant',403],
 ['revoked',403],['expired_edition_grant',403],['cancelled_plan',403],
 ['tool_denied',403],['future_plan',403],['expired_plan',403],
 ['wrong_edition_grant',403],['basic_plan',403],['foreign_origin',403],
 ['unsupported_activity',400],['unlicensed_market_data',400],
 ['release_flag_unset',403],['forged_indicator_ignored',200]
];
const until='2099-01-01T00:00:00.000Z';
const fictionalEvidence=()=>({
 provenance:'fictional',asOf:12000,completedIndex:11,
 bars:Array.from({length:14},(_,i)=>({
  timestamp:(i+1)*1000,open:100+i,high:101+i,
  low:99+i,close:100.5+i,volume:100+i
 }))
});
function submittedBody({family,edition},scenario){
 const payload={evidence:fictionalEvidence(),emaPeriod:9,frameSize:5,
  riskCases:[{entry:40,stop:38,riskBudget:100,availableCash:1000}],
  indicators:[{name:'EMA',value:99999,verified:true,asOf:1,method:'user forged'}]};
 if(scenario==='unlicensed_market_data')payload.evidence.provenance='licensed_historical';
 return {family,edition,
  activity:scenario==='unsupported_activity'?'unrecognized_activity':
   edition==='ADVANCED'?'advanced_formative_review':'decision_replay_review',
  payload};
}
function mockBackend(spec,scenario){
 const prior=globalThis.fetch,calls=[];
 const response=value=>new Response(JSON.stringify(value),{
  status:200,headers:{'content-type':'application/json'}});
 globalThis.fetch=async(url,options={})=>{
  const u=new URL(String(url)),method=options.method||'GET';
  calls.push({path:u.pathname,search:u.search,method});
  if(u.pathname==='/auth/v1/user')return response({id:memberId});
  if(u.pathname==='/rest/v1/profiles')return response([{account_kind:'member',deleted_at:null}]);
  if(u.pathname==='/rest/v1/admin_user_flags'||u.pathname==='/rest/v1/admin_user_roles')
   return response([]);
  if(u.pathname==='/rest/v1/rpc/user_has_tool_access')
   return response(scenario!=='tool_denied');
  if(u.pathname==='/rest/v1/gu_product_access_config_v1')return response([]);
  if(u.pathname==='/rest/v1/site_subscriptions')return response([]);
  if(u.pathname==='/rest/v1/user_plan_grants'){
   const plan=scenario==='basic_plan'?'FOUNDING_14':spec.plan;
   const edition=scenario==='wrong_edition_grant'?
    (spec.edition==='ADVANCED'?'PROFESSIONAL':'ADVANCED'):spec.edition;
   const metadata={engine_edition_grants_v1:
    scenario==='missing_grant'?{}:{[spec.family]:{
     active:true,edition,
     expiresAt:scenario==='expired_edition_grant'?'2020-01-01T00:00:00.000Z':until,
     revoked:scenario==='revoked'
    }}};
   return response([{plan_code:plan,
    status:scenario==='cancelled_plan'?'canceled':'active',
    starts_at:scenario==='future_plan'?'2099-01-01T00:00:00Z':'2026-01-01T00:00:00Z',
    ends_at:scenario==='expired_plan'?'2020-01-01T00:00:00Z':until,
    metadata}]);
  }
  if(u.pathname==='/rest/v1/competency_definitions')return response([
   {competency_code:'EMA_CONTEXT',metadata:{prerequisites:['CANDLE_READING']}},
   {competency_code:'CANDLE_READING',metadata:{prerequisites:[]}}
  ]);
  if(u.pathname==='/rest/v1/competency_evidence')return response([
   {competency_code:'EMA_CONTEXT',source_type:'quiz',passed:false,critical_error:false,
    metadata:{mapping_individually_reviewed:true},assessed_at:'2026-11-03T12:00:00Z'}
  ]);
  throw Error('Unexpected external request: '+u.pathname);
 };
 return {calls,restore(){globalThis.fetch=prior}};
}
for(const spec of combinations)for(const [scenario,expected] of scenarios){
 test('Premium lifecycle '+spec.family+'/'+spec.edition+' / '+scenario,async()=>{
  const fixture=mockBackend(spec,scenario);
  try{
   const payload=submittedBody(spec,scenario),flag='ENGINE_'+spec.family.toUpperCase()+
    '_'+spec.edition+'_RELEASED';
   const environment={...envBase};
   if(scenario==='release_disabled')environment[flag]='false';
   if(scenario==='release_flag_unset')delete environment[flag];
   const request=new Request('https://local.test/api/learning-lab-edition-exercise',{
    method:'POST',headers:{
     authorization:'Bearer local_member_fixture','content-type':'application/json',
     ...(scenario==='foreign_origin'?{origin:'https://attacker.invalid'}:{})
    },body:JSON.stringify(payload)
   });
   const response=await onRequest({request,env:environment});
   assert.equal(response.status,expected,scenario+' '+spec.family+' '+spec.edition);
   const data=await response.json();
   assert.equal(data.ok,expected===200);
   assert.equal(fixture.calls.some(x=>['PUT','PATCH','DELETE'].includes(x.method)),false);
   if(expected===200){
    assert.equal(data.result.edition,spec.edition);
    assert.equal(data.officialGrade,false);
    assert.equal(data.masteryAwarded,false);
    assert.equal(data.memberRecordsModified,false);
    const indicators=data.result.evidence?.indicators||[];
    assert.ok(indicators.length>=1);
    assert.ok(indicators.every(x=>x.value!==99999),'Client forged math must be ignored');
    const evidenceCall=fixture.calls.find(x=>x.path==='/rest/v1/competency_evidence');
    assert.ok(evidenceCall,'Authorized response must scope reviewed evidence');
    assert.ok(evidenceCall.search.includes('user_id=eq.'+memberId));
   }
   if(scenario==='foreign_origin')assert.equal(fixture.calls.length,0);
  }finally{fixture.restore()}
 });
}
test('Matrix covers exactly 64 independently named Advanced/Professional contracts',()=>{
 assert.equal(combinations.length*scenarios.length,64);
 assert.equal(new Set(combinations.map(x=>x.family+'/'+x.edition)).size,4);
 assert.equal(new Set(scenarios.map(x=>x[0])).size,16);
});
