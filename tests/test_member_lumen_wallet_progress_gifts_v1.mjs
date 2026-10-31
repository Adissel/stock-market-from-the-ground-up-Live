import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {awardPolicy,PLANNED_LUMEN_AMOUNT_V1,plannedCompletionAmount,rewardPreview} from '../functions/_lib/lumen-learning-award-policy-v1.js';
import {giftingPolicy,validateGiftAmount} from '../functions/_lib/lumen-member-gifting-policy-v1.js';
import {onRequest as giftRoute} from '../functions/api/member-lumen-gifts.js';
import {onRequest as studyRoute} from '../functions/api/member-learning-quick-view.js';
import {onRequest as activityRoute} from '../functions/api/member-lumen-activity.js';
import {onRequest as integrityRoute} from '../functions/api/member-lumen-integrity.js';
assert.equal(awardPolicy.enabled,false);
assert.equal(giftingPolicy.enabled,false);
assert.equal(rewardPreview({}).lumens,null);
assert.equal(PLANNED_LUMEN_AMOUNT_V1.canonicalLab,2);
assert.equal(plannedCompletionAmount('bootcamp','risk60'),130);
assert.equal(plannedCompletionAmount('bootcamp','not-known'),null);
for(const bad of [0,9,201,10.5,'100',null])assert.equal(validateGiftAmount(bad),false);
for(const ok of [10,100,200])assert.equal(validateGiftAmount(ok),true);
const get=url=>new Request('https://example.invalid'+url,{method:'GET'});
for(const route of [giftRoute,studyRoute,activityRoute,integrityRoute]){
 const x=await route({request:get('/api/test'),env:{}});
 assert.equal(x.status,401,'Private API must deny anonymous requests');
}
const foreign=await giftRoute({request:new Request('https://example.invalid/api/member-lumen-gifts',{method:'POST',
 headers:{origin:'https://evil.invalid','content-type':'application/json'},body:'{}'}),env:{}});
assert.equal(foreign.status,403);
const sources=[
 'functions/api/member-learning-quick-view.js',
 'functions/api/member-lumen-activity.js',
 'functions/api/member-lumen-gifts.js',
 'assets/js/crownlight-member-quickview-v1.js',
 'assets/js/site.js',
 'assets/js/navigation.js',
 'dashboard.html'
].map(f=>readFileSync(f,'utf8'));
assert.match(sources[0],/memberIdentity/);
assert.match(sources[0],/site_lab_progress/);
assert.match(sources[0],/gu_bootcamp_academy_progress_v014168/);
assert.match(sources[1],/groundup_question_pass_buckets/);
assert.match(sources[1],/gu_lumen_mixed_intents_v1/);
assert.match(sources[1],/gu_lumen_mixed_debits_v1/);
assert.match(sources[1],/Mixed-checkout Lumens restored/);
assert.match(sources[2],/gu_lumen_peer_send_v1/);
assert.match(sources[3],/member-learning-quick-view/);
assert.match(sources[5],/Crownlight Lumens/);
assert.match(sources[6],/data-member-lumen-history/);
assert.doesNotMatch(sources[3],/awardLumens\(|grantCredits\(|transferLumens\(/);

const cards=readFileSync('assets/js/crownlight-learning-reward-badges-v1.js','utf8');
const preview=readFileSync('functions/api/learning-reward-preview.js','utf8');
assert.match(cards,/lab-card-heading/);
assert.match(cards,/academy-program-compact-link/);
assert.match(cards,/not yet earnable/);
assert.match(preview,/planned_not_yet_earnable/);
assert.match(preview,/gu_lumen_learning_rewards_v1/);
assert.match(preview,/gu_lumen_completion_release_v1/);
assert.match(preview,/rows.length!==429/);
const reconcile=readFileSync('functions/api/member-lumen-integrity.js','utf8');
assert.match(reconcile,/gu_lumen_member_wallet_integrity_v1/);
assert.match(reconcile,/memberIdentity/);
assert.match(sources[1],/gift-received-reversal/);
assert.match(sources[3],/refreshIntegrity/);
const giftUi=readFileSync('assets/js/crownlight-member-gifting-v1.js','utf8');
assert.match(giftUi,/member-lumen-gifts/);
assert.match(giftUi,/toggle\(false\)/);
assert.match(giftUi,/Verify recipient/);
assert.match(giftUi,/Review and send Lumens/);
assert.match(giftUi,/window\.confirm/);

const outboxSql=readFileSync('supabase/migrations/20261031_lumen_protected_grade_outbox_v1.sql','utf8');
assert.match(outboxSql,/source_type IS DISTINCT FROM 'system_assessment'/);
assert.match(outboxSql,/grading_mode' IS DISTINCT FROM 'protected_independent'/);
assert.match(outboxSql,/human_beta_accepted' IS DISTINCT FROM 'true'/);
assert.match(outboxSql,/learning_rewards_enabled=true/);
assert.match(outboxSql,/FOR UPDATE SKIP LOCKED/);
assert.match(outboxSql,/gu_lumen_issue_from_protected_assessment_v1/);
assert.match(outboxSql,/GRANT EXECUTE ON FUNCTION public.gu_lumen_process_reviewed_grade_outbox_v1\(integer\) TO service_role/);
assert.match(outboxSql,/REVOKE ALL ON public.gu_lumen_reviewed_grade_outbox_v1 FROM PUBLIC,anon,authenticated/);
console.log('PASS: read-only wallet/activity/progress, single-currency draft rewards, gifts gated; anonymous/foreign-origin requests rejected.');
