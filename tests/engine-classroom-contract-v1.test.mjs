import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CLASSROOM_SCHEMA,classroomForMember} from '../functions/_lib/engine-classroom-contract-v1.js';
const FROZEN={learning:'LEARNING_V33_FREEZE_20261101',lab:'LAB_V32_FREEZE_20261101',tutor:'TALIA_FREEZE_20261101'};
const CURRENT={learning:'LEARNING_V33_CURRENT',lab:'LAB_V32_CURRENT',tutor:'TALIA_CURRENT'};
const plans={
 FREE:['BASIC','BASIC','FOUNDATION'],FOUNDING_14:['BASIC','BASIC','FOUNDATION'],
 PICK_WHAT_YOU_WANT:['BASIC','BASIC','FOUNDATION'],
 FOUNDING_30:['ADVANCED','ADVANCED','ADVANCED'],
 FOUNDING_60:['PROFESSIONAL','PROFESSIONAL','PROFESSIONAL'],
 FULL_MONTHLY:['PROFESSIONAL','PROFESSIONAL','PROFESSIONAL'],
 LIFETIME:['ENTERPRISE','ENTERPRISE','ENTERPRISE'],
 ONDEMAND_MONTHLY:['PRODUCT_DEPENDENT','PRODUCT_DEPENDENT','PRODUCT_DEPENDENT']
};
test('One shared, read-only runtime contract for all three engine families and eight known plans',()=>{
 for(const [plan,target] of Object.entries(plans)){
  const source=['FREE','FOUNDING_14','PICK_WHAT_YOU_WANT'].includes(plan)?FROZEN:CURRENT;
  const c=classroomForMember(plan,source);
  assert.equal(c.schema,CLASSROOM_SCHEMA);
  assert.equal(c.releaseState,'basic_only');
  assert.deepEqual(Object.keys(c.engines),['learning','lab','tutor']);
  assert.deepEqual(Object.values(c.engines).map(e=>e.configuredTarget),target,plan);
  assert.deepEqual(Object.values(c.engines).map(e=>e.effectiveEdition),['BASIC','BASIC','FOUNDATION'],plan);
  assert.deepEqual(Object.values(c.engines).map(e=>e.sourceVersion),Object.values(source),plan);
  assert(Object.values(c.engines).every(e=>e.premiumFeaturesReleased===false));
  assert.equal(c.entitlementGrant,false);assert.equal(c.officialGradeGrant,false);
  assert.equal(c.paidAiGrant,false);assert.equal(c.memberProgressModified,false);
  assert(c.teachingQuality.explanationsAndOrdinaryRetriesDoNotRequireExtraPayment);
  assert(c.sourceBoundaries.noFutureBarsBeforeDecision);
 }
});
test('Unknown legacy plans and malformed source metadata cannot select unreleased edition',()=>{
 for(const plan of ['FULL_ANNUAL','FOUNDING_MONTHLY','FOUNDING_ANNUAL','UNRECOGNIZED']){
  const c=classroomForMember(plan,{learning:'ENTERPRISE',lab:'PAID',tutor:'PROFESSIONAL'});
  assert.deepEqual(Object.values(c.engines).map(e=>e.configuredTarget),['UNASSIGNED','UNASSIGNED','UNASSIGNED']);
  assert.deepEqual(Object.values(c.engines).map(e=>e.sourceVersion),Object.values(FROZEN));
  assert(Object.values(c.engines).every(e=>e.premiumFeaturesReleased===false));
 }
});
test('API exposes identical server-derived classroom boundary without creating a new entitlement system',()=>{
 const api=readFileSync('functions/api/member-learning-engine-versions.js','utf8');
 assert.match(api,/classroom:classroomForMember\(planCode,selected\)/);
 assert.match(api,/engineTierPolicy:enginePolicyForPlan\(planCode\)/);
 assert.match(api,/site_subscriptions/);
 const moduleSource=readFileSync('functions/_lib/engine-classroom-contract-v1.js','utf8');
 for(const forbidden of ['stripeCheckout','grantEntitlement','supabaseAdmin','masteryAwarded = true','apiKey'])
  assert(!moduleSource.includes(forbidden));
});
test('The source catalog and instructor stay shared; higher tiers do not truncate the learner library',()=>{
 const labs=JSON.parse(readFileSync('data/competency-lab-paths-v01499.json','utf8'));
 const indicators=JSON.parse(readFileSync('data/tutor-indicator-study-v1.json','utf8'));
 assert.equal(Object.keys(labs.byLab).length,419);
 assert.equal(indicators.guides.length,61);
 const c=classroomForMember('FOUNDING_60',CURRENT);
 assert.equal(c.lessonAccess,'separately_authorized_per_member_and_product');
 assert.equal(c.teachingQuality.premiumAddsToolsNotWithheldBasicUnderstanding,true);
 assert.equal(c.protectedAnswersIncluded,false);
});
