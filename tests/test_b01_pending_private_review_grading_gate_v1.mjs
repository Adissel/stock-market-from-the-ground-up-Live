/* SMFGU-B01-UNGR-RELEASE-001 — server-side regression.
 * Synthetic identities only. No production grading, paid actions or key export.
 */
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/interactive-training.js';
const lab='F1-C02-L01',uid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
 attempt='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const env={SUPABASE_URL:'https://fixture.supabase.co',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_mock',
 SUPABASE_SECRET_KEY:'sb_secret_mock'};
let activeMode='assessment',source='original_hypothetical_b01_individual_review_pending_v01497',
 startCalls=0,gradeCalls=0;
const oldFetch=globalThis.fetch;
const json=x=>new Response(JSON.stringify(x),{headers:{'content-type':'application/json'}});
const request=(action,method='GET',body)=>new Request('https://fixture.example/api/interactive-training?action='+action,{
 method,headers:{authorization:'Bearer local-review-fixture',...(method==='POST'?
  {origin:'https://fixture.example','content-type':'application/json'}:{})},
 body:body?JSON.stringify(body):undefined
});
const question={id:'Q1',kind:'choice',prompt:'Original fictional placeholder?',
 options:['A','B','C'],explanation:'A fictional explanation only'};
globalThis.fetch=async(input,opts={})=>{
 const u=new URL(String(input)),p=u.pathname;
 if(p==='/auth/v1/user')return json({id:uid});
 if(p==='/rest/v1/profiles')return json([{account_kind:'member',deleted_at:null}]);
 if(p==='/rest/v1/admin_user_flags'||p==='/rest/v1/admin_user_roles')return json([]);
 if(p==='/rest/v1/rpc/user_has_tool_access')return json(true);
 if(p==='/rest/v1/platform_labs')return json([{lab_id:lab,book_code:'FOUNDATION_BOOK_1',active:true,registry_visible:true}]);
 if(p==='/rest/v1/lab_instruction_v014')return json([{book_number:1}]);
 if(p==='/rest/v1/user_library')return json([{product_code:'FOUNDATION_BOOK_1',expires_at:null}]);
 if(p==='/rest/v1/book_key_redemptions'||p==='/rest/v1/user_plan_grants'||p==='/rest/v1/site_subscriptions')return json([]);
 if(p==='/rest/v1/lab_training_sets_v014')return json([{
  lab_id:lab,version:97,review_state:'reviewed',source_status:source,
  questions:[question]
 }]);
 if(p==='/rest/v1/lab_training_attempts_v014')return json([{
  id:attempt,user_id:uid,lab_id:lab,set_version:97,mode:activeMode,
  step_index:0,completed_at:null,report:null
 }]);
 if(p==='/rest/v1/rpc/v014_training_start'){
  startCalls++;return json({id:attempt,lab_id:lab,set_version:97,mode:activeMode,
   step_index:0,completed_at:null,resumed:false});
 }
 if(p==='/rest/v1/rpc/v014_training_answer'){
  gradeCalls++;return json({ok:true,complete:false,correct:true,stepIndex:1});
 }
 throw Error('Unexpected fixture network call '+p);
};
try{
 let r=await onRequest({request:request('start','POST',{labId:lab,mode:'assessment'}),env});
 assert.equal(r.status,409,'A database-level reviewed flag cannot grant unapproved official B01 grading');
 assert.match((await r.json()).error,/individual editorial review/i);
 assert.equal(startCalls,0,'Assessment request must fail before creating an attempt');
 for(const mode of ['guided','practice','blind']){
  activeMode=mode;
  r=await onRequest({request:request('start','POST',{labId:lab,mode}),env});
  assert.equal(r.status,201,'Pending editorial release must not block ungraded '+mode+' study');
  const body=await r.json();
  assert.equal(body.question.id,'Q1');
  assert.equal(body.sourceStatus,source);
  assert(!JSON.stringify(body).includes('answer_key'));
 }
 assert.equal(startCalls,3);
 activeMode='assessment';
 r=await onRequest({request:request('resume','GET'),env});
 assert.equal(r.status,400,'Resume missing ID must fail validation');
 r=await onRequest({request:request('resume','GET'),env}); 
 assert.equal(r.status,400);
 r=await onRequest({request:new Request('https://fixture.example/api/interactive-training?action=resume&id='+attempt,
  {headers:{authorization:'Bearer local-review-fixture'}}),env});
 assert.equal(r.status,409,'Old official B01 assessment must not resume while editorial review pending');
 r=await onRequest({request:request('answer','POST',{attemptId:attempt,answer:'A',expectedStep:0}),env});
 assert.equal(r.status,409,'Old B01 official assessment attempt must not grade');
 assert.equal(gradeCalls,0,'Unapproved B01 grade RPC never invoked');
 activeMode='guided';
 r=await onRequest({request:request('answer','POST',{attemptId:attempt,answer:'A',expectedStep:0}),env});
 assert.equal(r.status,200,'Guided educational correction still functions');
 assert.equal(gradeCalls,1);
 source='editorially_reviewed_fully_approved_independent_lab_v2';
 activeMode='assessment';
 r=await onRequest({request:request('start','POST',{labId:lab,mode:'assessment'}),env});
 assert.equal(r.status,201,'An independently approved later rubric is not blocked by B01 pending-version string');
 console.log('PASS B01 pending individual-review gate: assessment start/resume/answer rejected, no scoring RPC; guided/practice/blind retain access, later approved review permitted');
}finally{globalThis.fetch=oldFetch}
