/* Owner Nov 1 policy. No Stripe charges, database writes, premium grants, or fabricated editions. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {enginePolicyForPlan,TARGET_TIERS,ENGINE_FAMILIES} from '../functions/_lib/learning-engine-tier-policy-v1.js';
const pairs=[
 ['FREE','BASIC','BASIC','FOUNDATION'],
 ['FOUNDING_14','BASIC','BASIC','FOUNDATION'],
 ['PICK_WHAT_YOU_WANT','BASIC','BASIC','FOUNDATION'],
 ['FOUNDING_30','ADVANCED','ADVANCED','ADVANCED'],
 ['FOUNDING_60','PROFESSIONAL','PROFESSIONAL','PROFESSIONAL'],
 ['FULL_MONTHLY','PROFESSIONAL','PROFESSIONAL','PROFESSIONAL'],
 ['LIFETIME','ENTERPRISE','ENTERPRISE','ENTERPRISE'],
 ['ONDEMAND_MONTHLY','PRODUCT_DEPENDENT','PRODUCT_DEPENDENT','PRODUCT_DEPENDENT']
];
test('Three independent engine policy targets preserve exact Owner tier matrix',()=>{
 assert.deepEqual(ENGINE_FAMILIES,['learning','lab','tutor']);
 assert.equal(Object.keys(TARGET_TIERS).length,8);
 for(const [plan,learning,lab,tutor] of pairs){
  const row=enginePolicyForPlan(plan);
  assert.deepEqual(row.target,{learning,lab,tutor},plan);
  assert.equal(row.premiumFeaturesReleased,false,plan);
  assert.equal(row.addOnCheckoutEnabled,false,plan);
  assert.equal(row.equalTeachingQualityWithinAccessibleLesson,true,plan);
  assert.deepEqual(row.effectiveCapabilities,{learning:'BASIC',lab:'BASIC',tutor:'FOUNDATION'},plan);
  assert.deepEqual(row.independentlyUpgradeable,['learning','lab','tutor'],plan);
 }
});
test('Basic included for Free / 14-day / Pick, OnDemand requires product check',()=>{
 for(const code of ['FREE','FOUNDING_14','PICK_WHAT_YOU_WANT'])
  assert.equal(enginePolicyForPlan(code).basicIncluded,true,code);
 for(const code of ['FOUNDING_30','FOUNDING_60','FULL_MONTHLY','LIFETIME','ONDEMAND_MONTHLY'])
  assert.equal(enginePolicyForPlan(code).basicIncluded,false,code);
 assert.equal(enginePolicyForPlan('ONDEMAND_MONTHLY').requiresVerifiedProduct,true);
 assert.equal(enginePolicyForPlan('FOUNDING_30').requiresVerifiedProduct,false);
});
test('Unassigned annual and legacy plans never inherit premium entitlement by assumption',()=>{
 for(const code of ['FULL_ANNUAL','FOUNDING_ANNUAL','FOUNDING_MONTHLY','UNKNOWN','']){
  const row=enginePolicyForPlan(code);
  assert.equal(row.recognized,false);
  assert.deepEqual(row.target,{learning:'UNASSIGNED',lab:'UNASSIGNED',tutor:'UNASSIGNED'});
  assert.equal(row.addOnCheckoutEnabled,false);
  assert.equal(row.releaseState,'owner_assignment_required');
 }
});
test('Member API, Owner plan editor and admin UI display policy independently of source version',()=>{
 const member=readFileSync('functions/api/member-learning-engine-versions.js','utf8');
 const admin=readFileSync('functions/api/admin-learning-engine-versions.js','utf8');
 const ui=readFileSync('assets/js/admin-learning-engine-versions-v1.js','utf8');
 assert.match(member,/engineTierPolicy:enginePolicyForPlan\(planCode\)/);
 assert.match(admin,/engineTierPolicy:enginePolicyForPlan\(p\.plan_code\)/);
 assert.match(ui,/Owner policy tier targets \(not released\)/);
 assert.match(ui,/premium add-ons NOT released or priced/);
 assert.match(ui,/Owner policy target and stored Tutor assignment differ/);
 assert.doesNotMatch(member,/\b(?:INSERT|PATCH|DELETE|stripe|checkout_enabled|payment_intent)\b/);
 assert.doesNotMatch(admin,/\b(?:checkout_enabled|payment_intent|stripe_checkout)\b/);
});
