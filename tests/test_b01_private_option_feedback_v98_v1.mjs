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
assert(route.includes('select=questions,reviewed_by,reviewed_at&lab_id=eq.'));
assert(!route.includes('select=questions,answer_key&lab_id=eq.'));
assert(route.includes("source_status"),'Approved feedback must not bypass pending-source status');
assert(route.includes("reviewerRole!=='INDEPENDENT_EDITOR'"),'AI-only draft status must not substitute for a separate reviewed-feedback field');
assert(route.includes("proof?.actualQuestionReviewed!==true"),'Question-specific evidence is mandatory');
assert(route.includes("proof?.correctiveFeedbackReviewed!==true"),'Wrong-option feedback-specific evidence is mandatory');
assert(!route.includes("aiEditorialDecision"),'Publisher AI Draft metadata is not a member-facing grading authorization');
assert(migration.includes("'draft','b01_private_feedback_draft_awaiting_independent_review_v98'"));
assert(migration.includes('feedback_count<>200'));
assert(migration.includes('review_count<>0'));
assert(!migration.includes("'reviewed','b01_private_feedback"));
const old=globalThis.fetch,uid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
let reviewedFeedback='AI_REVISED_DRAFT_PENDING_INDEPENDENT_EDITORIAL_APPROVAL';
let attributableReview=null;
let feedbackText='This answer uses future information that was not available at the decision pause. Retain only completed verified evidence.';
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
   reviewed_by:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',reviewed_at:'2026-10-31T18:00:00Z',
   source_status:'b01_independently_reviewed_protected_assessment_approved_v1',
   questions:[{id:'Q1',kind:'choice',prompt:'Which claim is justified?',
    options:['Correct evidence','Known wrong conclusion','Unrelated future fact'],
    distractorFeedback:[{option:'Known wrong conclusion',
     feedback:feedbackText,
     reviewStatus:reviewedFeedback,independentReview:attributableReview}]}]}]);
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
 // Merely flipping a status flag is not independent reviewer attribution.
 r=await onRequest({request:req(),env});body=await r.json();
 assert.equal(body.explanation,'General existing corrective advice');
 attributableReview={reviewerRole:'INDEPENDENT_EDITOR',
  reviewerUserId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  evidenceRef:'SMFGU-B01-PRIVATE-EDITORIAL-CASE-Q1-001',
  decisionAt:'2026-10-31T18:00:00Z',actualQuestionReviewed:true,correctiveFeedbackReviewed:true};
 r=await onRequest({request:req(),env});body=await r.json();
 assert.equal(r.status,200);
 assert.match(body.explanation,/future information/);
 assert(!JSON.stringify(body).includes('distractorFeedback'));
 assert(!JSON.stringify(body).includes('answer_key'));
 // A mechanical copy of v98's generic generated template must still be
 // suppressed if someone flips only a reviewStatus field without rewriting it.
 feedbackText='Why this choice is incorrect: Known wrong conclusion / Correction: '+
  'Only completed evidence belongs in an assessment. Review the case evidence: '+
  'Always separate assumptions from the information available at the pause.';
 r=await onRequest({request:req(),env});body=await r.json();
 assert.equal(r.status,200);
 assert.equal(body.explanation,'General existing corrective advice',
  'Mechanical template cannot become approved option-specific teaching through a flag');
 assert(!JSON.stringify(body).includes(' / Correction: '));
 assert.equal(scoreCalls,4);
 console.log('PASS B01 protected feedback: draft and unattributed approval-status suppressed, documented independent reviewer attribution required; original mechanical template stays hidden, remediation after scoring only.');
}finally{globalThis.fetch=old}
