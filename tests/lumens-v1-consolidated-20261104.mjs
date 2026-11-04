/* Crownlight Lumens V1 release batch — noncharging regression.
 * Synthetic fixtures and source assertions only; not human approvals,
 * real checkout or a real learner award. No external network is used.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {previewLumenDiscount,lumenDiscountPolicy as discount} from '../functions/_lib/lumen-discount-policy-v1.js';
import {awardPolicy,rewardPreview,plannedCompletionAmount} from '../functions/_lib/lumen-learning-award-policy-v1.js';
import {giftingPolicy,validateGiftAmount} from '../functions/_lib/lumen-member-gifting-policy-v1.js';
import {onRequest as gifts} from '../functions/api/member-lumen-gifts.js';
import {onRequest as catalog} from '../functions/api/learning-reward-preview.js';
let checked=0;
const eq=(a,b,why)=>{checked++;assert.equal(a,b,why)};
const has=(s,p,why)=>{checked++;assert.match(s,p,why)};
const no=(s,p,why)=>{checked++;assert.doesNotMatch(s,p,why)};
const read=p=>readFileSync(p,'utf8');
const env={SUPABASE_URL:'https://mock.supabase.co',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fake',
 SUPABASE_SECRET_KEY:'sb_secret_fake'};
const original=globalThis.fetch;

// Monetary and credit-source policy.
for(const [actual,want,why] of [
 [discount.enabled,false,'No premature universal purchase activation'],
 [discount.denominationCents,7,'Seven-cent discount denomination'],
 [discount.maxPercentBasisPoints,10000,'Whole eligible subtotal cap'],
 [discount.maxOrderDiscountCents,null,'No obsolete $10 maximum'],
 [discount.currency,'USD','Supported denomination'],
 [discount.cashRedeemable,false,'No cash exchange'],
 [discount.bankWithdrawable,false,'No bank withdrawal'],
 [discount.moneyTransferable,false,'No financial transfers'],
 [discount.brokeragePurchasingPower,false,'No brokerage value'],
 [discount.nonExpiring,true,'Nonexpiring eligible wallet credits'],
 [discount.redemptionValueNotCashExchangeRate,true,'Not an FX quote'],
 [discount.trialAutoRenew,false,'No surprise trial renewal'],
 [discount.excludedKinds.includes('tax'),true,'Tax exclusion'],
 [discount.excludedKinds.includes('shipping'),true,'Shipping exclusion'],
 [discount.excludedKinds.includes('gift_card'),true,'Gift-card exclusion'],
 [discount.excludedKinds.includes('lumen_bundle'),true,'Lumen bundle exclusion'],
 [discount.excludedKinds.includes('donation'),true,'Donation exclusion'],
 [awardPolicy.enabled,false,'Unreleased learning earning'],
 [awardPolicy.memberFacingAmount,null,'No unsourced published amount'],
 [awardPolicy.nonExpiring,true,'Nonexpiring earned credit'],
 [awardPolicy.excluded.includes('answer_reveal'),true,'Reveal cannot earn'],
 [awardPolicy.excluded.includes('skip'),true,'Skip cannot earn'],
 [awardPolicy.excluded.includes('client_progress_percent'),true,'Progress not a grade'],
 [giftingPolicy.enabled,false,'No V1 peer gifting'],
 [giftingPolicy.releasePhase,'V2_DEFERRED','Separate V2 roadmap']
])eq(actual,want,why);
eq(rewardPreview({}).published,false,'Unknown award is unpublished');
eq(rewardPreview({scopeType:'canonical_lab',scopeId:'AB-12',amount:2,approved:true,
 approvedRevision:'v1',serverEvidenceRequired:true}).lumens,null,'Client preview cannot award');
eq(plannedCompletionAmount('lab','AB-12'),2,'Two-credit draft only');
eq(plannedCompletionAmount('bootcamp','risk60'),130,'Boot Camp draft only');
eq(plannedCompletionAmount('bootcamp','unknown'),null,'No unknown awards');

// Arithmetic: explicit expected cent and whole-Lumen values, including the
// last partially applied Lumen. These are independent fixture expectations.
const amounts=[
 [0,5,5,'digital_tool',0,0,0,5],
 [1,1,1,'digital_tool',1,1,0,0],
 [6,1,1,'digital_tool',1,6,0,0],
 [7,1,1,'digital_tool',1,7,0,0],
 [8,2,1,'digital_tool',1,7,1,1],
 [8,2,2,'digital_tool',2,8,0,0],
 [1999,80,0,'digital_tool',0,0,1999,80],
 [1999,80,40,'digital_tool',40,280,1719,40],
 [1999,80,80,'digital_tool',80,560,1439,0],
 [1999,286,285,'digital_tool',285,1995,4,1],
 [1999,286,286,'digital_tool',286,1999,0,0],
 [1999,40,80,'digital_tool',40,280,1719,0],
 [49,7,7,'digital_book',7,49,0,0],
 [100,7,7,'physical_product',7,49,51,0],
 [100,7,7,'tax',0,0,100,7],
 [100,7,7,'shipping',0,0,100,7],
 [100,7,7,'gift_card',0,0,100,7],
 [100,7,7,'lumen_bundle',0,0,100,7]
];
for(const [price,balance,want,kind,used,cents,due,left] of amounts){
 const p=previewLumenDiscount({eligibleNetCents:price,availableLumens:balance,
 requestedLumens:want,productKind:kind});
 eq(p.appliedLumens,used,'Whole credits used');
 eq(p.discountCents,cents,'Discount cents match fixture');
 eq(p.remainingSubtotalCents,due,'No accidental cash overcharge');
 eq(p.remainingLumens,left,'No extra credit deducted');
 eq(p.status,'PREVIEW_ONLY','Arithmetic is never payment authorization');
}
for(const x of [-1,1.5,'7',NaN,Infinity,Number.MAX_SAFE_INTEGER+1]){
 checked++;assert.throws(()=>previewLumenDiscount({
 eligibleNetCents:x,availableLumens:10,requestedLumens:2,productKind:'digital_tool'}));
}
for(const x of [-1,1.5,'7',NaN,Infinity]){
 checked++;assert.throws(()=>previewLumenDiscount({
 eligibleNetCents:100,availableLumens:x,requestedLumens:2,productKind:'digital_tool'}));
 checked++;assert.throws(()=>previewLumenDiscount({
 eligibleNetCents:100,availableLumens:10,requestedLumens:x,productKind:'digital_tool'}));
}
for(const v of [0,1,9,201,-10,10.5,'100',null,undefined,Infinity,NaN])
 eq(validateGiftAmount(v),false,'Invalid V2 draft gift amount');
for(const v of [10,11,100,199,200])
 eq(validateGiftAmount(v),true,'V2 draft amount validation only');

// Browser/server route identity checked with fake, deliberately true DB flags.
const uid='11111111-1111-4111-8111-111111111111';
const mkRequest=(path,method='GET',body)=>new Request('https://site.example'+path,{
 method,headers:{authorization:'Bearer mocked-session',origin:'https://site.example',
 ...(body===undefined?{}:{'content-type':'application/json'})},
 ...(body===undefined?{}:{body:JSON.stringify(body)})});
const mockGift=({kind='member',deleted=null,restricted=[]}={})=>{
 const calls=[];
 globalThis.fetch=async (url,opt={})=>{
  const path=new URL(url).pathname;calls.push(path);
  const send=v=>new Response(JSON.stringify(v),{status:200});
  if(path==='/auth/v1/user')return send({id:uid});
  if(path==='/rest/v1/profiles')return send([{account_kind:kind,deleted_at:deleted}]);
  if(path==='/rest/v1/admin_user_flags')return send(restricted.map(status=>({status})));
  if(path==='/rest/v1/gu_lumen_completion_release_v1')return send([{
   member_gifts_enabled:true,legal_gifting_clearance:true,security_gifting_clearance:true}]);
  throw Error('Unexpected transfer, opt-in or enumeration endpoint: '+path);
 };
 return calls;
};
try{
 let r=await gifts({request:new Request('https://site.example/api/member-lumen-gifts'),env});
 eq(r.status,401,'Guest cannot use API');
 r=await gifts({request:mkRequest('/api/member-lumen-gifts','PUT'),env});
 eq(r.status,405,'Method constrained');
 r=await gifts({request:new Request('https://site.example/api/member-lumen-gifts',{
  method:'POST',headers:{origin:'https://foreign.example'},body:'{}'}),env});
 eq(r.status,403,'Cross-origin gifting denied');
 const calls=mockGift();
 r=await gifts({request:mkRequest('/api/member-lumen-gifts'),env});
 eq(r.status,200,'Member may see disabled feature status');
 eq((await r.json()).enabled,false,'All DB flags true cannot activate V1 gifts');
 eq(calls.includes('/rest/v1/gu_lumen_completion_release_v1'),false,'V1 application hard stop first');
 r=await gifts({request:mkRequest('/api/member-lumen-gifts?handle=%40abc'),env});
 eq(r.status,409,'Recipient discovery disabled');
 r=await gifts({request:mkRequest('/api/member-lumen-gifts','POST',{
 action:'optin',discoverable:true,receivingEnabled:true}),env});
 eq(r.status,409,'Recipient opt-in disabled');
 r=await gifts({request:mkRequest('/api/member-lumen-gifts','POST',{
 action:'send',recipient:'@abc',lumens:10,
 requestId:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'}),env});
 eq(r.status,409,'Gift submission disabled');
 eq(calls.some(x=>x.includes('gu_lumen_peer_send_v1')),false,'No transfer RPC');
 eq(calls.some(x=>x.includes('gu_lumen_peer_gift_optin_v1')),false,'No consent writes');
 eq(calls.some(x=>x.includes('username=eq.')),false,'No private recipient enumeration');
 for(const fixture of [
  {kind:'staff'}, {deleted:'2026-11-01T00:00:00Z'},
  {restricted:['restricted']},{restricted:['suspended']}
 ]){
  mockGift(fixture);
  r=await gifts({request:mkRequest('/api/member-lumen-gifts'),env});
  eq(r.status,403,'Noneligible member denied');
 }
}finally{globalThis.fetch=original}

// Reward catalog mocked: no actual grade, review or Supabase writes.
const camps={truth5:15,watchlist7:25,scanners10:35,foundations30:70,
 charts45:95,risk60:130,practicum90:180,tape10:35,indicators10:35,filings7:25};
const rows=()=>[
 ...Array.from({length:419},(_,i)=>({scope_type:'lab',
  scope_id:'LAB_'+String(i).padStart(3,'0'),
  amount:2,published:false,reviewed_by:null,reviewed_at:null})),
 ...Object.entries(camps).map(([scope_id,amount])=>({
  scope_type:'bootcamp',scope_id,amount,published:false,reviewed_by:null,reviewed_at:null}))
];
async function previewScenario(input,flags=[{learning_rewards_enabled:false}]){
 globalThis.fetch=async url=>{
  const path=new URL(url).pathname;
  if(path.endsWith('/gu_lumen_learning_rewards_v1'))
   return new Response(JSON.stringify(input),{status:200});
  if(path.endsWith('/gu_lumen_completion_release_v1'))
   return new Response(JSON.stringify(flags),{status:200});
  throw Error('Unexpected network URL '+url);
 };
 const response=await catalog({request:new Request('https://site.example/api/learning-reward-preview'),env});
 return {status:response.status,body:await response.json(),cache:response.headers.get('cache-control')};
}
try{
 let d=await previewScenario(rows());
 eq(d.status,200,'Complete draft catalog is readable');
 eq(d.body.itemCount,429,'429 canonical definitions');
 eq(d.body.lab,2,'Draft Lab amount');
 eq(Object.keys(d.body.bootcamps).length,10,'Ten Boot Camps');
 eq(d.body.enabled,false,'Unpublished catalog remains disabled');
 eq(d.body.status,'planned_not_yet_earnable','Draft amount cannot imply award');
 eq(d.cache,'no-store','Release state should not persist in public caches');
 d=await previewScenario(rows(),[{learning_rewards_enabled:true}]);
 eq(d.body.enabled,false,'Switch alone does not publish unreviewed awards');
 d=await previewScenario(rows().slice(1));
 eq(d.status,503,'Incomplete 428-row catalog fails');
 let a=rows();a[1]={...a[1],scope_id:a[0].scope_id};
 d=await previewScenario(a);eq(d.status,503,'Duplicate Lab scope fails');
 a=rows();a[0]={...a[0],scope_id:'NOT ALLOWED!'};
 d=await previewScenario(a);eq(d.status,503,'Malformed Lab identifier fails');
 a=rows();a[0]={...a[0],amount:3};
 d=await previewScenario(a);eq(d.status,503,'Wrong Lab amount fails');
 a=rows();a[420]={...a[420],amount:0};
 d=await previewScenario(a);eq(d.status,503,'Nonpositive program reward fails');
 a=rows();a[420]={...a[420],scope_id:a[419].scope_id};
 d=await previewScenario(a);eq(d.status,503,'Duplicate Boot Camp scope fails');
 d=await previewScenario(rows(),[]);
 eq(d.status,503,'Missing release switch row fails');
 d=await previewScenario(rows(),[{learning_rewards_enabled:true},{learning_rewards_enabled:false}]);
 eq(d.status,503,'Multiple release switch rows fail');
 a=rows().map(x=>({...x,published:true,reviewed_by:uid,reviewed_at:'2026-11-04T00:00:00Z'}));
 a[0].reviewed_by=null;
 d=await previewScenario(a,[{learning_rewards_enabled:true}]);
 eq(d.body.enabled,false,'Missing reviewer denies full publication');
 a[0].reviewed_by=uid;
 d=await previewScenario(a,[{learning_rewards_enabled:true}]);
 eq(d.body.enabled,true,'Synthetic positive publication contract, not a real approval');
 eq(d.body.status,'active','Synthetic positive-only status');
 globalThis.fetch=async()=>new Response('failure',{status:500});
 const bad=await catalog({request:new Request('https://site.example/api/learning-reward-preview'),env});
 eq(bad.status,503,'Upstream failure fails closed');
 const method=await catalog({request:new Request('https://site.example/api/learning-reward-preview',
 {method:'POST'}),env});
 eq(method.status,405,'No write method');
}finally{globalThis.fetch=original}

// Review durable SQL and client hard-stop controls. These do not claim deployment.
const policy=read('supabase/migrations/20261031_lumen_learning_rewards_and_gifts_v1.sql');
const issuer=read('supabase/migrations/20261031_lumen_reward_issuer_and_gift_atomic_v1.sql');
const grading=read('supabase/migrations/20261102_lumen_immutable_grade_issuer_provenance_hardening_v1.sql');
const api=read('functions/api/member-lumen-gifts.js');
const preview=read('functions/api/learning-reward-preview.js');
for(const [source,pattern,why] of [
 [policy,/learning_rewards_enabled boolean NOT NULL DEFAULT false/,'Learning switch false by default'],
 [policy,/member_gifts_enabled boolean NOT NULL DEFAULT false/,'Gift switch false by default'],
 [policy,/UNIQUE\(user_id,scope_type,scope_id,approved_revision\)/,'Award idempotency'],
 [policy,/ENABLE ROW LEVEL SECURITY/,'RLS present'],
 [issuer,/LEARNING_REWARDS_DISABLED/,'DB earning switch'],
 [issuer,/INDEPENDENT_COMPLETION_NOT_VERIFIED/,'Independent grading requirement'],
 [issuer,/pg_advisory_xact_lock/,'Atomic concurrency lock'],
 [issuer,/v_approved.amount,v_approved.amount,null/,'No expiry of earned bucket'],
 [issuer,/GIFTING_NOT_RELEASED/,'DB gifts guarded'],
 [grading,/IMMUTABLE_GRADE_NOT_FOUND/,'Immutable evidence required'],
 [grading,/INDEPENDENT_CASE_NOT_RELEASED/,'Editorial release required'],
 [grading,/INDEPENDENT_REVIEWER_REQUIRED/,'Reviewer provenance required'],
 [api,/giftingPolicy.enabled!==true/,'V1 API hard stop'],
 [api,/giftingPolicy.releasePhase!=='V2_RELEASED'/,'New V2 decision required'],
 [preview,/labIds.size!==419/,'Duplicate Lab detection'],
 [preview,/cache-control':'no-store'/,'Fresh release state'],
 [read('functions/api/member-lumen-checkout-quote.js'),/checkoutDiscountActive:false/,'Preview cannot charge'],
 [read('functions/api/member-lumen-activity.js'),/Mixed-checkout Lumens restored/,'Refund events displayed'],
 [read('assets/js/crownlight-member-gifting-v1.js'),/V1_MEMBER_GIFTING_DEFERRED=true/,'No UI gift form'],
 [read('docs/qa/2026-11-02_LUMENS_V1_SCOPE_REBASE_V2_BACKLOG.md'),/81.8%/,'Controlling 9 of 11 acceptance']
])has(source,pattern,why);
no(api,/releasePhase==='V1'/,'No accidental V1 gifting bypass');
console.log('PASS '+checked+' Lumens V1 noncharging fixture and invariant assertions. External approvals and exact-SHA deployment remain separate.');
