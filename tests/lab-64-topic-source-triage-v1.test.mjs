// Sixty-four canonical existing Lab IDs, source-topic research triage only.
// No claim-specific editorial approval, third-party copying, rights, grading, or member acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../data/lab-64-topic-source-triage-v1.json',import.meta.url),'utf8'));
const raw=readFileSync(new URL('../docs/research/stockstotrade/canonical_419_lab_source_candidates_v2.csv',import.meta.url),'utf8');
const memo=readFileSync(new URL('../docs/qa/2026-11-03_LAB_64_TOPIC_SOURCE_TRIAGE_V1.md',import.meta.url),'utf8');
const lines=raw.trim().split(/\r?\n/);
const unquote=(s)=>[...s.matchAll(/"((?:[^"]|"")*)"|([^,]+)/g)].map(m=>(m[1]??m[2]).replaceAll('""','"'));
const fields=unquote(lines[0]);const canonical=lines.slice(1).map(line=>Object.fromEntries(unquote(line).map((v,i)=>[fields[i],v])));
const catalog=new Map(canonical.map(x=>[x.lab_id,x]));
const map=new Map(data.sources.map(x=>[x.id,x]));
const mandatory=new Set(['INTERNAL_RESEARCH_TRIAGE_NOT_SOURCE_ACCEPTANCE','TOPIC_FAMILY_SOURCE_ONLY_NOT_CLAIM_LEVEL_VERIFIED']);
test('All original 419 source-candidate Lab records remain distinct',()=>{assert.equal(canonical.length,419);assert.equal(catalog.size,419);});
test('64 selected records match the first 64 canonical records, with no new Lab IDs',()=>{
 assert.equal(data.records.length,64);assert.equal(new Set(data.records.map(x=>x.labId)).size,64);
 assert.deepEqual(data.records.map(x=>x.labId),canonical.slice(0,64).map(x=>x.lab_id));
 assert.equal(data.canonicalCatalogueSize,419);
});
test('Source pages are distinct, allowlisted topic references with no copied text',()=>{
 assert.equal(map.size,12);
 for(const s of map.values()){
  assert.match(s.url,/^https:\/\//);
  assert.ok(['www.investor.gov','www.nyse.com','www.sec.gov','chartschool.stockcharts.com'].includes(new URL(s.url).hostname),s.id+' unexpected host');
  assert.equal(s.rights,'RESEARCH_CITATION_ONLY');
  assert.equal(s.externalContentCopied,false);assert.equal(s.claimLevelReview,'OPEN');
  assert.ok(memo.includes(s.url));
 }
});
for(const [i,item] of data.records.entries()){
 test('Lab '+String(i+1).padStart(2,'0')+' of 64: '+item.labId+' retains identity, review holds and relevant sources',()=>{
  const old=catalog.get(item.labId);assert.ok(old);
  assert.equal(item.title,old.title);assert.equal(item.collection,old.collection);
  assert.deepEqual(item.competencies,old.competencies.split(';'));
  assert.equal(item.canonicalCandidateSourceId,old.source_id);
  assert.equal(item.canonicalMappingStatus,old.mapping_status);
  assert.equal(item.canonicalEditorialStatus,'not_accepted');
  assert.equal(item.canonicalVerificationStatus,old.verification_status);
  assert.equal(item.candidateResearchUse,'TOPIC_FAMILY_SOURCE_ONLY_NOT_CLAIM_LEVEL_VERIFIED');
  assert.equal(item.reviewOutcome,'UNREVIEWED_FOR_INDIVIDUAL_CLAIM');
  assert.equal(item.publishedRights,'NOT_CLEARED');
  assert.equal(item.actualHistoricalDataRights,'NOT_CLEARED');
  assert.equal(item.requiresOriginalFictionalExample,true);
  assert.equal(item.independentMemberAcceptance,false);
  assert.equal(item.researchReferences.length,2);
  for(const id of item.researchReferences)assert.ok(map.has(id),item.labId+' missing research source '+id);
  assert.ok(memo.includes('| '+item.labId+' |'));
 });
}
for(const group of data.families){
 test('Source-family count and limitation: '+group.key,()=>{
  assert.equal(data.records.filter(x=>x.sourceFamily===group.key).length,group.expectedCount);
  assert.ok(group.limitation.length>35);
 });
}
test('Suspicious SEC_FILINGS classification is surfaced, not silently repaired',()=>{
 const row=data.records.find(x=>x.labId==='F2-C10-L01');
 assert.ok(row.competencies.includes('SEC_FILINGS'));
 assert.equal(row.sourceMisalignmentFlag,'SEC_FILINGS_COMPETENCY_IN_MULTI_TIMEFRAME_LAB_NEEDS_EDITORIAL_TRIAGE');
 assert.match(memo,/F2-C10-L01/);
 assert.equal(data.records.filter(x=>x.sourceMisalignmentFlag!==null).length,1);
});
test('Original owner decisions, zero licensing and nonrelease safeguards retained',()=>{
 assert.ok(mandatory.has(data.status));
 assert.equal(data.ownerEditorialApprovalPreserved,true);
 assert.equal(data.controls.verifiedCanonicalIdCount,419);
 assert.equal(data.controls.selectedLabIdCount,64);
 assert.equal(data.controls.realMemberAccepted,0);
 assert.equal(data.controls.sourceClaimEditorialAccepted,0);
 assert.equal(data.controls.commercialRightsAccepted,0);
 assert.equal(data.controls.gradedRelease,false);
 assert.equal(data.controls.premiumRelease,false);
 assert.equal(data.controls.masteryOrLumens,false);
 assert.match(memo,/whole site has no validated denominator/i);
});
