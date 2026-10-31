/* B01 confidential, approved selected-answer feedback only.
 * All secrets/graded outcomes are synthetic fixtures; never read live keys.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {onRequest} from '../functions/api/interactive-training.js';
const route=readFileSync('functions/api/interactive-training.js','utf8');
const migration=readFileSync('supabase/migrations/20261031_b01_private_feedback_v98_draft_only.sql','utf8');
assert(route.includes('approvedSelectedWrongFeedback'));
assert(route.includes("x?.reviewStatus==='INDEPENDENT_EDITORIAL_APPROVED'"));
assert(route.includes("select=questions&lab_id=eq."));
assert(!route.includes('select=questions,answer_key&lab_id=eq.'));
assert(migration.includes("'draft','b01_private_feedback_draft_awaiting_independent_review_v98'"));
assert(migration.includes('feedback_count<>200'));
assert(migration.includes('review_count<>0'));
assert(!migration.includes("'reviewed','b01_private_feedback"));
const old=globalThis.fetch,uid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
let reviewedFeedback='DRAFT_PENDING_SEPARATE_PEDAGOGICAL_APPROVAL';
let scoreCalls=0,assessDenied=0;
const json=x=>new Response(JSON.stringify(x),{headers:{'content-type':'application/json'}});
globalThis.fetch=async(raw,opts={})=>{
 const u=new URL(String(raw)),p=u.pathname;
 if(p==='/auth/v1/user')return json({id:uid});
 if(p==='/rest/v1/profiles')return json([{account_kind:'member'}]);
 if(p==='/rest/v1/admin_user_flags'||p==='/rest/v1/admin_user_roles')return json([]);
 if(p==='/rest/v1/rpc/user_has_tool_access')return json(true);
 if(p==='/rest/v1/platform_labs')return json([{lab_id:'F1-C02-L01',book_code:'FOUNDATION_BOOK_1',active:true,registry_visible:true}]);
 if(p==='/rest/v1/lab_instruction_v014')return json([{book_number:1}]);
 if(p==='/rest/v1/user_library')return json([{product_code:'FOUNDATION_BOOK_1',expires_at:null}]);
 if(p==='/rest/v1/book_key_redemptions'||p==='/rest/v1/user_plan_grants'||p==='/rest/v1/site_subscriptions')return json([]);
 if(p==='/rest/v1/lab_training_attempts_v014')return json([{lab_id:'F1-C02-L01',set_version:98,mode:'guided'}]);
 if(p==='/rest/v1/lab_training_sets_v014'){
  return json([{lab_id:'F1-C02-L01',version:98,review_state:'reviewed',
   source_status:'b01_independently_reviewed_protected_assessment_approved_v1',
   questions:[{id:'Q1',kind:'choice',prompt:'Which claim is justified?',
    options:['Correct evidence','Known wrong conclusion','Unrelated future fact'],
    distractorFeedback:[{option:'Known wrong conclusion',
     feedback:'This answer uses future information that was not available at the decision pause. Retain only completed verified evidence.',
     reviewStatus:reviewedFeedback}]}]}]);
 }
 if(p==='/rest/v1/rpc/v014_training_answer'){
  scoreCalls++;return json({ok:true,complete:false,correct:false,
   explanation:'General existing corrective advice',stepIndex:1});
 }
 throw Error('Unexpected fixture endpoint '+p);
};
const env={SUPABASE_URL:'https://fixture.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_test',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'};
const req=()=>new Request('https://fixture.test/api/interactive-training?action=answer',{method:'POST',
 headers:{authorization:'Bearer fictitious','content-type':'application/json',origin:'https://fixture.test'},
 body:JSON.stringify({attemptId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
 answer:'Known wrong conclusion',expectedStep:0})});
try{
 let r=await onRequest({request:req(),env}),body=await r.json();
 assert.equal(r.status,200);
 assert.equal(body.explanation,'General existing corrective advice',
  'Pending feedback must remain private');
 assert(!JSON.stringify(body).includes('future information'));
 reviewedFeedback='INDEPENDENT_EDITORIAL_APPROVED';
 r=await onRequest({request:req(),env});body=await r.json();
 assert.equal(r.status,200);
 assert.match(body.explanation,/future information/);
 assert(!JSON.stringify(body).includes('distractorFeedback'));
 assert(!JSON.stringify(body).includes('answer_key'));
 assert.equal(scoreCalls,2);
 console.log('PASS B01 private option feedback: pending corrections hidden; independently reviewed chosen misconception only after scoring.');
}finally{globalThis.fetch=old}
