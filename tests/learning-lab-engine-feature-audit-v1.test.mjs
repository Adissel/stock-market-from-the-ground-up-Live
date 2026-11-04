import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {featureReport,validateFeatureLedger} from '../scripts/qa/learning-lab-engine-feature-audit-v1.mjs';
import {enginePolicyForPlan} from '../functions/_lib/learning-engine-tier-policy-v1.js';
const load=()=>JSON.parse(readFileSync('data/learning-lab-engine-feature-audit-v1.json','utf8'));
test('64 distinct evidence-backed features, eight each by engine and edition',()=>{
 const r=featureReport(load());assert.equal(Object.keys(r).length,8);
 assert.equal(r.learning_BASIC.integrated,8);assert.equal(r.learning_BASIC.pct,100);
 assert.equal(r.lab_BASIC.integrated,8);assert.equal(r.lab_BASIC.pct,100);
 for(const [key,v] of Object.entries(r)){
  assert.equal(v.total,8);assert.equal(v.releaseAccepted,0);
  const [family,edition]=key.split('_');
  assert.equal(v.integrated,load().features.filter(f=>f.engine===family&&f.edition===edition&&f.source_status==='integrated').length);
 }
});
test('status changes cannot silently inflate evidence counts or release approvals',()=>{
 const a=load(),bad=structuredClone(a);bad.features[0].source_status='prototype';
 assert.throws(()=>validateFeatureLedger(bad),/numerator\/denominator mismatch/);
 bad.features[0].source_status='integrated';bad.features[0].independent_release_accepted=true;
 assert.throws(()=>validateFeatureLedger(bad),/Independent release requires member evidence and source integration/);
});
test('validated premium source progress can advance without releasing anything',()=>{
 const amended=load(),entry=amended.features.find(x=>x.id==='LE-ADV-01');
 entry.source_status='integrated';
 amended.counts.learning_ADVANCED.integrated=1;
 amended.counts.learning_ADVANCED.partial=6;
 amended.counts.learning_ADVANCED.integrated_percent=12.5;
 const output=featureReport(amended);
 assert.equal(output.learning_ADVANCED.integrated,1);
 assert.equal(output.learning_ADVANCED.releaseAccepted,0);
});
test('existing server policy preserves Basic effective editions for all plans',()=>{
 for(const [code,target] of [['FREE','BASIC'],['FOUNDING_30','ADVANCED'],['FOUNDING_60','PROFESSIONAL'],['LIFETIME','ENTERPRISE']]){
  const p=enginePolicyForPlan(code);
  assert.equal(p.target.learning,target);assert.equal(p.target.lab,target);
  assert.equal(p.effectiveCapabilities.learning,'BASIC');assert.equal(p.effectiveCapabilities.lab,'BASIC');
  assert.equal(p.premiumFeaturesReleased,false);assert.equal(p.addOnCheckoutEnabled,false);
 }
});
