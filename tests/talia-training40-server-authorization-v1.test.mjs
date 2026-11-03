/* Original 40-case server-route QA. SYNTHETIC GoTrue and PostgREST only:
 * this is NOT real account acceptance or official grading and makes no network calls. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {onRequest} from '../functions/api/market-tutor-v01492.js';
const read=p=>JSON.parse(readFileSync('data/'+p,'utf8'));
const cases=read('talia-tutor-evaluation40-v1.json').scenarios;
const A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222';
const dataAsset='/data/competency-study-guides-v01499.json';
let requests=0,providerCalls=0;
const env={SUPABASE_URL:'https://fixture.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture',
 SUPABASE_SECRET_KEY:'sb_secret_fixture',AI_SERVICE_ENABLED:'false',
 ASSETS:{fetch:async request=>{
  const path=new URL(request.url).pathname;
  try{return Response.json(read(path.replace(/^\/data\//,'')))}catch{return Response.json({error:'not present'},{status:404})}
 }}};
const oldFetch=globalThis.fetch;
let active=A,blocked=false;
globalThis.fetch=async (url,opts={})=>{
 const path=String(url);
 if(!path.startsWith(env.SUPABASE_URL)){providerCalls++;throw Error('External request blocked '+path)}
 if(path.endsWith('/auth/v1/user'))return Response.json({id:active,user_metadata:{market_tutor_ai_enabled:false}});
 if(path.includes('/rest/v1/profiles?'))return Response.json([{account_kind:'member',deleted_at:null}]);
 if(path.includes('/rest/v1/admin_user_flags?'))return Response.json(blocked?[{status:'suspended'}]:[]);
 if(path.includes('/rest/v1/admin_user_roles?'))return Response.json([]);
 if(path.includes('/rest/v1/rpc/user_has_tool_access')){
  assert.equal(JSON.parse(opts.body).target_user,active);
  return Response.json(true);
 }
 if(path.includes('/rest/v1/gu_product_access_config_v1?'))return Response.json([]);
 if(path.includes('/rest/v1/rpc/gu_v014107_take_tutor_request')){
  const p=JSON.parse(opts.body);
  assert.equal(p.p_user,active);
  return Response.json({accepted:true,reason:'allowed'});
 }
 throw Error('Unexpected private database endpoint '+path);
};
const send=async (guide,mode='explain',questionOverride='')=>{
 const question=questionOverride||(mode==='explain'?'Explain ':mode==='review'?'Review ':'Explain ')+guide.title;
 const req=new Request('https://tutor.fixture/api/market-tutor-v01492',{
  method:'POST',headers:{authorization:'Bearer synthetic-'+active,'content-type':'application/json'},
  body:JSON.stringify({question,mode,learnerAnswer:mode==='review'?'I thought the quote proves a fill.':'',
    allowModel:false,saveHistory:false})
 });
 const response=await onRequest({request:req,env});requests++;
 return {http:response.status,body:await response.json()};
};
try{
 test('40 authored scenarios reach actual existing Tutor server route under two verified synthetic member identities',async()=>{
  assert.equal(cases.length,40);
  for(let i=0;i<cases.length;i++){
   active=i%2?A:B;
   const sc=cases[i];
   const guide=read('talia-foundation-explanations-batch'+sc.batch+'-v1.json').guides.find(g=>g.code===sc.code);
   assert.ok(guide,sc.id+' registered');
   const result=await send(guide,sc.category==='MISCONCEPTION_FOLLOWUP'?'review':'explain');
   assert.equal(result.http,200,sc.id+' route status');
   assert.equal(result.body.ok,true,sc.id);
   assert.equal(result.body.generation,'original-competency-guide',sc.id);
   assert.equal(result.body.sources?.[0]?.id,sc.code,sc.id+' exact source routing');
   assert.equal(result.body.graded,false,sc.id);
   assert.equal(result.body.masteryAwarded,false,sc.id);
   assert.equal(result.body.historySaved,false,sc.id);
   assert.equal(result.body.verifiedFollowupContext,false,sc.id);
   assert.ok(result.body.answer.includes(guide.editorialTrainingReviewV1.diagnosticQuestion),sc.id+' diagnostic');
   if(sc.category==='MISCONCEPTION_FOLLOWUP'){
    assert.match(result.body.answer,/Ungraded review criterion:/,sc.id+' review criterion');
    assert.match(result.body.answer,/No rubric was scored and no mastery credit was awarded/,sc.id+' protected grade');
    assert.ok(result.body.answer.includes(guide.reviewExplanation),sc.id+' authored review correction');
   }else{
    assert.ok(result.body.answer.includes(guide.transferQuestion),sc.id+' ungraded transfer');
    assert.ok(result.body.answer.includes(guide.workedCase),sc.id+' fictional teaching');
   }
   assert.doesNotMatch(JSON.stringify(result.body),/private.answer.key|masteryAwarded":true/i);
  }
  assert.equal(requests,40);
  assert.equal(providerCalls,0);
 });
 test('actual authenticated Tutor route honors all five gradual-release methods without provider inference',async()=>{
  active=A;
  const guide=read('talia-foundation-explanations-batch13-v1.json').guides[0];
  const expected={
   'I DO':/watch the reasoning sequence/i,
   'WE DO':/Hint before a solution/i,
   'YOU DO':/complete an ungraded attempt before reviewing/i,
   'REVIEW':/Likely misconception:/i,
   'TRANSFER':/genuinely different fictional evidence/i
  };
  for(const [method,pattern] of Object.entries(expected)){
   const question=`Instructional perspective: Understand. Method: ${method}. Teach ${guide.title}.`;
   const result=await send(guide,method==='REVIEW'?'review':'explain',question);
   assert.equal(result.http,200,method);
   assert.equal(result.body.sources?.[0]?.id,guide.code,method+' exact reviewed guide');
   assert.match(result.body.answer,pattern,method);
   assert.notEqual(result.body.generation,'grounded-model-draft',method);
   assert.notEqual(result.body.aiReason,'ai_generated',method);
   assert.equal(result.body.graded,false,method);
   assert.equal(result.body.masteryAwarded,false,method);
  }
  assert.equal(providerCalls,0);
 });
 test('source-only Tutor must deny suspended membership before returning teaching content',async()=>{
  blocked=true;active=A;
  const guide=read('talia-foundation-explanations-batch13-v1.json').guides[0];
  const result=await send(guide);
  assert.equal(result.http,403);
  assert.ok(!('sources' in result.body));
  blocked=false;
 });
}finally{
 // test callbacks execute after module parse, restore in after() below.
}
import {after} from 'node:test';
after(()=>{globalThis.fetch=oldFetch;});
