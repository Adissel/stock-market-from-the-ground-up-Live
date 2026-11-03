import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {summarizeFeatureEvidence,loadScorecard,FAMILIES,EDITIONS} from '../scripts/learning-lab-progress-scorecard-v2.mjs';
import {enginePolicyForPlan} from '../functions/_lib/learning-engine-tier-policy-v1.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const audit=JSON.parse(readFileSync(new URL('../data/learning-lab-engine-feature-audit-v1.json',import.meta.url),'utf8'));
const score=loadScorecard();
const clone=()=>structuredClone(audit);
test('Summary is computed, not a fixed 16/64 or 25% assertion',()=>{
 assert.equal(score.totals.total,64);
 assert.equal(score.totals.integrated,audit.features.filter(x=>x.source_status==='integrated').length);
 assert.equal(score.totals.sourceCovered,audit.features.filter(x=>x.source_status!=='not_implemented').length);
 assert.equal(score.totals.realMemberAccepted,audit.features.filter(x=>x.real_member_accepted).length);
 assert.equal(score.totals.independentReleaseAccepted,audit.features.filter(x=>x.independent_release_accepted).length);
 assert.equal(score.basis.includes('not the whole website'),true);
});
test('Basic owner approval stays distinct from independent member release',()=>{
 assert.equal(audit.owner_signoff_BASIC.approved_count,16);
 assert.equal(score.frozen.learningBasic,'v3.3');
 assert.equal(score.frozen.labBasic,'v3.2');
 assert.equal(score.frozen.labIds,419);
 assert.equal(score.frozen.competencies,30);
 for(const feature of audit.features.filter(x=>x.edition==='BASIC'))
  assert.equal(feature.source_status,'integrated');
});
for(const family of FAMILIES)for(const edition of EDITIONS){
 test('Edition status is reconstructed from rows: '+family+' '+edition,()=>{
  const rows=audit.features.filter(x=>x.engine===family&&x.edition===edition);
  const summary=score.byEdition[family+'_'+edition];
  assert.equal(rows.length,8);
  assert.equal(summary.sourceCovered,rows.filter(x=>x.source_status!=='not_implemented').length);
  assert.equal(summary.integrated,rows.filter(x=>x.source_status==='integrated').length);
  assert.equal(summary.realMemberAccepted,rows.filter(x=>x.real_member_accepted).length);
  assert.equal(summary.independentReleaseAccepted,rows.filter(x=>x.independent_release_accepted).length);
  assert.equal(summary.sourceCoveragePercent,summary.sourceCovered*100/8);
 });
}
for(const feature of audit.features){
 test('Requirement evidence is separately reported: '+feature.id,()=>{
  assert.match(feature.id,/^L[EA]-(BAS|ADV|PRO|ENT)-0[1-8]$/);
  assert.ok(feature.acceptance_criterion?.length>20);
  assert.ok(feature.unresolved?.length>15);
  assert.equal(typeof feature.real_member_accepted,'boolean');
  assert.equal(typeof feature.independent_release_accepted,'boolean');
  if(feature.evidence_file)assert.ok(existsSync(join(root,feature.evidence_file)),feature.id);
  if(feature.existing_test_file)assert.ok(existsSync(join(root,feature.existing_test_file)),feature.id);
  if(feature.independent_release_accepted)assert.equal(feature.real_member_accepted,true);
 });
}
test('A documented, genuinely integrated member-tested future feature can advance scorecard',()=>{
 const sample=clone();
 const entry=sample.features.find(x=>x.id==='LE-ADV-01');
 entry.source_status='integrated';entry.real_member_accepted=true;
 sample.counts.learning_ADVANCED.integrated++;
 sample.counts.learning_ADVANCED.partial--;
 const changed=summarizeFeatureEvidence(sample);
 assert.equal(changed.totals.integrated,score.totals.integrated+1);
 assert.equal(changed.totals.realMemberAccepted,score.totals.realMemberAccepted+1);
 assert.equal(changed.totals.independentReleaseAccepted,score.totals.independentReleaseAccepted);
});
test('Reject forged completed or inconsistent accepted states',()=>{
 const sample=clone();
 sample.features[0].independent_release_accepted=true;
 assert.throws(()=>summarizeFeatureEvidence(sample),/release cannot precede/);
 const second=clone();second.features[0].source_status='not_implemented';
 assert.throws(()=>summarizeFeatureEvidence(second),/stale source count/);
});
test('Release locks are independent of evidence counts and remain off',()=>{
 for(const plan of ['FREE','FOUNDING_14','FOUNDING_30','FOUNDING_60','FULL_MONTHLY','LIFETIME']){
  const policy=enginePolicyForPlan(plan);
  assert.equal(policy.premiumFeaturesReleased,false,plan);
  assert.equal(policy.addOnCheckoutEnabled,false,plan);
  for(const family of FAMILIES)
   assert.equal(policy.effectiveCapabilities[family],'BASIC',plan+'/'+family);
 }
});
