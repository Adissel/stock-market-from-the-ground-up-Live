// 419 canonical review-source assertions; not 419 independent editorial approvals.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../data/lab-419-editorial-reconciliation-register-v1.json',import.meta.url),'utf8'));
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const parse=line=>[...line.matchAll(/"((?:[^"]|"")*)"|([^,]+)/g)].map(m=>(m[1]??m[2]).replaceAll('""','"'));
const rows=path=>{const lines=read(path).trim().split(/\r?\n/),heads=parse(lines[0]);return lines.slice(1).map(line=>Object.fromEntries(parse(line).map((v,i)=>[heads[i],v])))};
const [src,body,quality]=data.canonicalSources.map(rows);
const waves=data.researchWaves.map(path=>JSON.parse(read(path)));
const get=(w,id)=>w.records.find(x=>x.labId===id);
const doc=read('docs/qa/2026-11-03_LAB419_SOURCE_BODY_REMEDIATION_V1.md');
test('Immutable catalogue totals and full 64+128+227 sequence',()=>{
 assert.equal(src.length,419);assert.equal(body.length,419);assert.equal(quality.length,419);
 assert.equal(data.records.length,419);assert.equal(new Set(data.records.map(x=>x.labId)).size,419);
 assert.deepEqual(data.records.map(x=>x.labId),src.map(x=>x.lab_id));
 assert.deepEqual(waves.map(w=>w.records.length),[64,128,227]);
 assert.deepEqual(waves.flatMap(w=>w.records.map(x=>x.labId)),src.map(x=>x.lab_id));
 assert.equal(data.frozen.labCount,419);assert.equal(data.frozen.competencyCount,30);
});
test('Documented 419 quality findings reproduce independently from three exported CSVs',()=>{
 assert.equal(data.metrics.templatedBridges,quality.filter(x=>x.template_reused==='true').length);
 assert.equal(data.metrics.missingExplicitFreshTransfer,quality.filter(x=>x.has_explicit_fresh_transfer!=='true').length);
 assert.equal(data.metrics.missingDetectableNumericWorkedExample,body.filter(x=>x.has_quantitative_example!=='true').length);
 assert.equal(data.metrics.hasSelfCheck,body.filter(x=>x.has_self_check==='true').length);
 assert.equal(data.metrics.missingVerifiedHistoricalOHLCV,body.filter(x=>x.has_historical_ohlcv!=='true').length);
 assert.equal(data.metrics.sourceMappingNotAccepted,src.filter(x=>x.editorial_status==='not_accepted').length);
 assert.equal(data.metrics.independentPublishedClaims,0);assert.equal(data.metrics.genuineMemberAccepted,0);
});
for(const [i,item] of data.records.entries()){
 test('Evidence reconciliation '+String(i+1).padStart(3,'0')+' — '+item.labId,()=>{
  const x=src[i],b=body[i],q=quality[i],w=waves[item.wave-1],triage=get(w,item.labId);
  assert.ok(triage,item.labId+' must exist in its matching research wave');
  assert.equal(item.ordinal,i+1);assert.equal(item.labId,x.lab_id);
  assert.equal(item.labId,b.lab_id);assert.equal(item.labId,q.lab_id);
  assert.equal(item.canonicalTitle,x.title);assert.equal(item.collection,x.collection);
  assert.deepEqual(item.officialCompetencies,x.competencies.split(';'));
  assert.equal(item.legacyCandidateSource,x.source_id);assert.equal(item.legacySourceMapping,x.mapping_status);
  assert.equal(item.legacyEditorialDisposition,x.editorial_status);
  assert.equal(item.legacySourceVerification,x.verification_status);
  assert.equal(item.bodyQuality.wordCount,Number(b.word_count));
  assert.equal(item.bodyQuality.selfCheckDetected,b.has_self_check==='true');
  assert.equal(item.bodyQuality.numericalCaseDetected,b.has_quantitative_example==='true');
  assert.equal(item.bodyQuality.structuralQC,b.structural_qc);
  assert.equal(item.defectEvidence.genericTemplate,q.template_reused==='true');
  assert.equal(item.defectEvidence.explicitFreshTransfer,q.has_explicit_fresh_transfer==='true');
  assert.equal(item.defectEvidence.detectableNumericalCase,q.detectable_numerical_worked_case==='true');
  assert.equal(item.individualSourceClaimAccepted,false);
  assert.equal(item.thirdPartyContentRightsApproved,false);
  assert.equal(item.actualTwoAccountMemberAccepted,false);
  assert.equal(item.protectedAssessmentPublished,false);
  assert.equal(item.liveReleaseDecision,'HOLD_INDEPENDENT_CONTENT_AND_MEMBER_TESTS');
  assert.equal(item.ownerAuthoredEditorialDecisionsRetained,true);
 });
}
test('Release gating and accepted feature metric remain unchanged',()=>{
 assert.equal(data.frozen.learningBasicVersion,'v3.3');assert.equal(data.frozen.labBasicVersion,'v3.2');
 assert.equal(data.frozen.independentPremiumFeaturesGranted,0);
 assert.equal(data.frozen.officialGradingEnabled,false);
 assert.equal(data.frozen.paidCheckoutChanged,false);
 assert.equal(data.frozen.memberProgressModified,false);
 assert.match(doc,/Source, Body and Transfer Evidence Reconciliation/);
 assert.match(doc,/16\/64 = 25.0%/);
});
