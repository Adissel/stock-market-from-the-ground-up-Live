/* QA: Owner's existing private rubric editor cannot falsely approve B01.
 * Synthetic data only; does NOT read or log protected answer keys.
 */
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/training-editor.js';
const actor='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const answer=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
const state={version:98,source:'b01_private_feedback_draft_awaiting_independent_review_v98',owner:true,patches:0};
const prior=globalThis.fetch;
globalThis.fetch=async(request,opts={})=>{
 const u=new URL(String(request)),p=u.pathname;
 if(p==='/auth/v1/user')return answer({id:actor});
 if(p==='/rest/v1/profiles')return answer([{account_kind:'member'}]);
 if(p==='/rest/v1/admin_user_roles')return answer(state.owner?[{role_code:'OWNER',expires_at:null}]:[]);
 if(p==='/rest/v1/admin_user_flags')return answer([]);
 if(p==='/rest/v1/lab_training_sets_v014'&&opts.method==='PATCH'){
  state.patches++;return answer([{lab_id:'F1-C02-L01',version:state.version,review_state:'reviewed'}]);
 }
 if(p==='/rest/v1/lab_training_sets_v014')return answer([{
  lab_id:'F1-C02-L01',version:state.version,review_state:'draft',
  source_status:state.source,updated_at:'2026-10-31T18:10:00.000Z',
  answer_key:{Q101:'Observed evidence'},questions:[{id:'Q101',kind:'choice',
   prompt:'What can the learner establish from these observations?',
   options:['Observed evidence','Future prediction','Unseen outcome'],
   explanation:'A historical observation is not a prediction of an unseen outcome.'}]
 }]);
 throw Error('Unexpected fixture '+p);
};
const req=()=>new Request('https://fixture.example/api/training-editor?action=review',{
 method:'POST',headers:{authorization:'Bearer synthetic-owner-token',origin:'https://fixture.example','content-type':'application/json'},
 body:JSON.stringify({labId:'F1-C02-L01',version:state.version,
  expectedUpdatedAt:'2026-10-31T18:10:00.000Z',confirmPhrase:'REVIEW BOOK RUBRIC'})
});
try{
 for(const [version,source] of [
   [97,'original_hypothetical_b01_individual_review_pending_v01497'],
   [98,'b01_private_feedback_draft_awaiting_independent_review_v98'],
   [98,'renamed_unverified_edits'],
   [99,'b01_private_feedback_draft_awaiting_independent_review_v99']
 ]){
  state.version=version;state.source=source;
  const response=await onRequest({request:req(),env:{SUPABASE_URL:'https://db.fixture.example',
   SUPABASE_PUBLISHABLE_KEY:'fake-public',SUPABASE_SECRET_KEY:'fake-private'}});
  const result=await response.json();
  assert.equal(response.status,409,source+' must not have an Owner bypass');
  assert.match(result.error,/independent editorial acceptance/i);
  assert.equal(state.patches,0,'Protected rubric must never be updated');
 }
 state.owner=false;
 const refused=await onRequest({request:req(),env:{SUPABASE_URL:'https://db.fixture.example',
 SUPABASE_PUBLISHABLE_KEY:'fake-public',SUPABASE_SECRET_KEY:'fake-private'}});
 assert.equal(refused.status,403);
 assert.equal(state.patches,0);
}finally{globalThis.fetch=prior}
console.log('PASS: v97 frozen and v98/v99 B01 independent review gates reject Owner and unauthorized rubric promotion; zero writes, no private keys.');
