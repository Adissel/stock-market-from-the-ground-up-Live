import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {enginePolicyForPlan} from '../functions/_lib/learning-engine-tier-policy-v1.js';

/* Owner-directed consolidated 64-feature source audit.
 * This regression protects against partial/prototype inflation.
 * It is not authenticated acceptance, rights clearance, or release approval.
 */
const audit=JSON.parse(readFileSync(new URL('../data/learning-lab-engine-feature-audit-v1.json',import.meta.url),'utf8'));
const features=audit.features;
const editions=['BASIC','ADVANCED','PROFESSIONAL','ENTERPRISE'];
const families=['learning','lab'];
test('64 source-feature IDs: exactly eight per engine and edition',()=>{
 assert.equal(features.length,64);
 assert.equal(new Set(features.map(x=>x.id)).size,64);
 for(const family of families)for(const edition of editions){
  const group=features.filter(x=>x.engine===family&&x.edition===edition);
  assert.equal(group.length,8,`${family}/${edition}`);
  assert.equal(group.filter(x=>x.source_status==='integrated').length,
   audit.counts[`${family}_${edition}`].integrated);
 }
});
test('every partial/prototype remains outside integrated numerator and retains an acceptance criterion',()=>{
 const allowed=new Set(['integrated','partial','prototype','not_implemented']);
 for(const f of features){
  assert.ok(allowed.has(f.source_status),f.id);
  assert.ok(typeof f.acceptance_criterion==='string'&&f.acceptance_criterion.length>30,f.id);
  assert.equal(f.independent_release_accepted,false,f.id);
  assert.equal(f.real_member_accepted,false,f.id);
 }
 const unresolved=features.filter(x=>x.source_status!=='integrated');
 assert.equal(unresolved.length,48);
 assert.equal(unresolved.filter(x=>x.edition==='BASIC').length,0);
 assert.equal(features.filter(x=>x.source_status==='integrated').length,16);
});
test('all Advanced, Professional and Enterprise capabilities remain unavailable in every plan',()=>{
 for(const plan of ['FREE','FOUNDING_30','FOUNDING_60','LIFETIME']){
  const policy=enginePolicyForPlan(plan);
  assert.equal(policy.premiumFeaturesReleased,false,plan);
  assert.equal(policy.addOnCheckoutEnabled,false,plan);
  for(const family of families)assert.equal(policy.effectiveCapabilities[family],'BASIC',plan+'/'+family);
 }
 for(const family of families)for(const edition of editions.slice(1)){
  assert.equal(audit.counts[`${family}_${edition}`].released_features,0);
 }
});
