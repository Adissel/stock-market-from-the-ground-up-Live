import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../data/lab-128-source-regulatory-research-v1.json',import.meta.url),'utf8'));
const memo=readFileSync(new URL('../docs/qa/2026-11-03_LAB_128_SOURCE_AND_REGULATORY_RESEARCH_V1.md',import.meta.url),'utf8');
const raw=readFileSync(new URL('../docs/research/stockstotrade/canonical_419_lab_source_candidates_v2.csv',import.meta.url),'utf8');
const parse=line=>[...line.matchAll(/"((?:[^"]|"")*)"|([^,]+)/g)].map(m=>(m[1]??m[2]).replaceAll('""','"'));
const lines=raw.trim().split(/\r?\n/),headers=parse(lines[0]);
const original=lines.slice(1).map(line=>Object.fromEntries(parse(line).map((v,i)=>[headers[i],v])));
const lookup=new Map(manifest.sources.map(x=>[x.id,x]));
const rows=manifest.records;
test('Registry scope and frozen release controls: 419 total, exactly 128 sequential Labs in wave 2',()=>{
 assert.equal(original.length,419);assert.equal(new Set(original.map(x=>x.lab_id)).size,419);
 assert.equal(rows.length,128);assert.equal(new Set(rows.map(x=>x.labId)).size,128);
 assert.deepEqual(rows.map(x=>x.labId),original.slice(64,192).map(x=>x.lab_id));
 assert.equal(manifest.status,'TOPIC_RESEARCH_CANDIDATES_ONLY_NO_INDEPENDENT_RELEASE');
 assert.equal(manifest.releases.learningBasic,'v3.3');assert.equal(manifest.releases.labBasic,'v3.2');
 assert.equal(manifest.releases.premiumEnabled,false);assert.equal(manifest.releases.gradingEnabled,false);
 assert.equal(manifest.releases.marketDataRedistribution,false);assert.equal(manifest.releases.lumensAwards,false);
});
test('Sources use explicit original rights-hold metadata and appropriate research URLs',()=>{
 assert.equal(lookup.size,19);
 assert.equal(new Set(manifest.sources.map(x=>x.url)).size,19);
 for(const ref of lookup.values()){
  assert.match(ref.url,/^https:\/\//);assert.equal(ref.rights,'RESEARCH_METADATA_ONLY_NO_COPYING');
  assert.equal(ref.externalMediaRightsGranted,false);assert.ok(memo.includes(ref.url)||!rows.some(x=>x.referenceIds.includes(ref.id)));
 }
});
for(const x of rows){
 test('Canonical Lab '+x.sequence+' '+x.labId+' maintains original content, source status and legal holds',()=>{
  const originalRow=original[x.sequence-1];assert.equal(x.labId,originalRow.lab_id);
  assert.equal(x.title,originalRow.title);assert.equal(x.collection,originalRow.collection);
  assert.deepEqual(x.competencies,originalRow.competencies.split(';'));
  assert.equal(x.oldSourceId,originalRow.source_id);assert.equal(x.oldMappingBasis,originalRow.mapping_basis);
  assert.equal(x.oldMappingStatus,originalRow.mapping_status);
  assert.equal(x.oldVerificationStatus,originalRow.verification_status);
  assert.equal(x.oldEditorialStatus,'not_accepted');
  assert.equal(x.sourceEvidenceClassification,'TOPIC_RESEARCH_CANDIDATE_ONLY_NOT_LESSON_VERIFIED');
  assert.equal(x.individualClaimReview,'PENDING');assert.equal(x.ownerEditorialApprovalPreserved,true);
  assert.equal(x.independentThirdPartyReleaseApproval,false);
  assert.equal(x.rightsForContentImagesMarketData,'NOT_GRANTED');
  assert.ok(x.referenceIds.length>=2&&x.referenceIds.every(id=>lookup.has(id)));
  assert.ok(memo.includes('| '+x.labId+' |'));
 });
}
for(const fam of manifest.topicFamilies){
 test('Family coverage '+fam.key+' has declared bounded non-overlap',()=>{
  assert.equal(rows.filter(x=>x.topicFamily===fam.key).length,fam.end-fam.start+1);
  assert.ok(fam.note.length>70);assert.ok(fam.sources.every(id=>lookup.has(id)));
 });
}
test('A dated regulatory transition is mandatory for all three DT margin lessons',()=>{
 const items=rows.filter(x=>x.sequence>=104&&x.sequence<=106);
 assert.equal(items.length,3);
 for(const x of items){assert.ok(x.reviewFlags.includes('FINRA_RULE_4210_2026_TRANSITION_REQUIRES_LICENSED_COMPLIANCE_REVIEW'));assert.ok(x.referenceIds.includes('SEC_MARGIN'));assert.ok(x.referenceIds.includes('FINRA_INTRADAY'));}
 assert.match(memo,/June 4, 2026/);assert.match(memo,/October 20, 2027/);
});
test('Research cannot silently accept placeholder authored Lab titles or exact VWAP from a proxy',()=>{
 assert.equal(rows.filter(x=>x.reviewFlags.includes('TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY')).length,13);
 for(const x of rows.filter(x=>x.referenceIds.includes('TOS_VWAP'))){assert.ok(x.limitations.includes('VWAP')||x.sourceEvidenceClassification.includes('NOT_LESSON_VERIFIED'));}
 assert.ok(memo.includes('exact transaction-print VWAP'));
});
test('Group intervals and research-waves cover 1 through 192 without overlap',()=>{
 const covered=manifest.topicFamilies.flatMap(x=>Array.from({length:x.end-x.start+1},(_,i)=>x.start+i));
 assert.equal(covered.length,128);assert.equal(new Set(covered).size,128);
 assert.deepEqual(covered,Array.from({length:128},(_,i)=>i+65));
 assert.equal(manifest.stats.batchLabRecords,128);
 assert.equal(manifest.stats.independentlyReviewedIndividualLabClaims,0);
 assert.equal(manifest.stats.labSourcePublicationApprovalsAdded,0);
 assert.equal(manifest.stats.gradedReleaseEnabled,false);
});
