/* Lumens V1 eight engineering batches, 48 noncharging SOURCE checks.
 * Passing does not represent an approved member release or independent review.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lumenDiscountPolicy as d} from '../functions/_lib/lumen-discount-policy-v1.js';
import {awardPolicy as a} from '../functions/_lib/lumen-learning-award-policy-v1.js';
import {giftingPolicy as g} from '../functions/_lib/lumen-member-gifting-policy-v1.js';
const rd=p=>readFileSync(p,'utf8');
const w=rd('functions/api/member-sparks-balance.js');
const activity=rd('functions/api/member-lumen-activity.js');
const integrity=rd('functions/api/member-lumen-integrity.js');
const gifts=rd('functions/api/member-lumen-gifts.js');
const html=rd('dashboard.html');
const browser=rd('tests/live-member-lumen-dashboard-browser-v1.mjs');
const dual=rd('tests/live-lumen-two-account-isolation-v1.mjs');
const workflow=rd('.github/workflows/lumens-v1-consolidated-batch-20261104.yml');
const build=rd('scripts/build-pages.sh');
const audit=rd('supabase/qa/20261104_lumens_v1_release_eight_batch_audit.sql');
const manual=rd('docs/qa/2026-11-04_LUMENS_V1_ROLLBACK_RUNBOOK.md');
const oat=rd('docs/qa/2026-11-04_LUMENS_V1_FULL_RELEASE_BATCH_AND_SIGNOFF.md');
const included=(s,t)=>assert(s.includes(t),'Missing '+t);
const sets={
 W:[
 ()=>included(w,"request.method!=='GET'"),()=>included(w,'memberIdentity(env,request)'),
 ()=>included(w,'p_user_id:actor.userId'),()=>included(w,'w.included+w.purchased+w.manual!==w.available'),
 ()=>included(w,'private, no-store'),()=>included(activity,'private, no-store')],
 G:[
 ()=>assert.equal(a.enabled,false),()=>assert.equal(a.memberFacingAmount,null),
 ()=>included(a.perCompletionIdempotency,'user_id:scope_type:scope_id:approved_revision'),
 ()=>included(audit,'gu_lumen_assessment_case_release_v1'),
 ()=>included(audit,'gu_lumen_learning_awards_v1'),()=>included(oat,'NO-GO')],
 V:[
 ()=>assert.equal(g.enabled,false),()=>assert.equal(g.releasePhase,'V2_DEFERRED'),
 ()=>included(gifts,"releasePhase!=='V2_RELEASED'"),
 ()=>included(gifts,'legal_gifting_clearance'),()=>included(gifts,'security_gifting_clearance'),
 ()=>included(audit,'gu_lumen_peer_gift_transfers_v1')],
 M:[
 ()=>included(dual,'assert.notEqual(a.id,b.id'),
 ()=>included(dual,'/api/member-lumen-integrity?user_id='),
 ()=>included(dual,'/api/member-lumen-activity?user_id='),
 ()=>included(workflow,'LAB_QA_SECOND_EMAIL'),
 ()=>included(audit,'gu_founder_plans_v014173'),
 ()=>included(audit,'gu_founder_paid_cycles_v014173')],
 C:[
 ()=>assert.equal(d.denominationCents,7),()=>assert.equal(d.cashRedeemable,false),
 ()=>assert.equal(d.bankWithdrawable,false),()=>assert.equal(d.brokeragePurchasingPower,false),
 ()=>assert.equal(d.enabled,false),()=>assert(d.excludedKinds.includes('lumen_bundle'))],
 A:[
 ()=>included(html,'aria-labelledby="member-sparks-wallet-title"'),
 ()=>included(html,'aria-label="Lumens wallet balances"'),
 ()=>included(html,'id="sparks-wallet-status" role="status" aria-live="polite"'),
 ()=>included(browser,'document.activeElement===el'),
 ()=>included(browser,"page.keyboard.press('Enter')"),
 ()=>included(browser,'diagnostic.isVisible')],
 R:[
 ()=>included(workflow,'two-member-wallet-isolation:'),
 ()=>included(workflow,'james-wallet-browser-live-smoke, two-member-wallet-isolation'),
 ()=>included(workflow,'SMFGU_EXPECT_SHA:'),
 ()=>included(build,'release-manifest.json'),
 ()=>included(build,'node tests/lumens-v1-release-eight-batch-source-20261104.mjs'),
 ()=>included(oat,'independent reviewer')],
 B:[
 ()=>included(manual,'deployment ID'),()=>included(manual,'/rollback'),
 ()=>included(manual,'revert commit'),()=>included(manual,'Do not delete ledger rows'),
 ()=>included(manual,'release-manifest.json'),()=>included(manual,'NOT EXECUTED')]
};
let n=0;for(const [batch,tests] of Object.entries(sets)){
 assert.equal(tests.length,6,batch+' requires six source gates');
 for(let i=0;i<tests.length;i++){try{tests[i]();n++}catch(e){throw Error(batch+String(i+1).padStart(2,'0')+': '+e.message,{cause:e})}}
}
assert.equal(n,48);
if(process.env.LUMENS_V1_FORCE_GO==='true')throw Error('HOLD: source assertions cannot authorize live release');
console.log('PASS '+n+' bounded Lumens V1 source assertions across eight parallel workstreams');
console.log('HOLD: human-reviewed protected cases, real second user, paid lifecycle and final SHA release required');
