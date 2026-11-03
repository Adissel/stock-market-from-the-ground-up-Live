import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const data=JSON.parse(readFileSync(new URL('../data/lab-227-remaining-source-internal-evidence-v1.json',import.meta.url),'utf8'));
const doc=readFileSync(new URL('../docs/qa/2026-11-03_419_LAB_SOURCE_TRIAGE_CLOSEOUT_V1.md',import.meta.url),'utf8');
const csv=readFileSync(new URL('../docs/research/stockstotrade/canonical_419_lab_source_candidates_v2.csv',import.meta.url),'utf8');
const parse=line=>[...line.matchAll(/"((?:[^"]|"")*)"|([^,]+)/g)].map(m=>(m[1]??m[2]).replaceAll('""','"'));
const lines=csv.trim().split(/\r?\n/),headers=parse(lines[0]);
const original=lines.slice(1).map(line=>Object.fromEntries(parse(line).map((v,i)=>[headers[i],v])));
const byId=new Map([...data.externalReferences,...data.internalEvidenceCandidates].map(x=>[x.id,x]));
test('Exactly 419 original Lab ids, 227 wave 3 and 64+128+227 full nonoverlap',()=>{
 assert.equal(original.length,419);assert.equal(new Set(original.map(x=>x.lab_id)).size,419);
 assert.equal(data.records.length,227);assert.equal(data.sourceWaves.wave1.count,64);
 assert.equal(data.sourceWaves.wave2.count,128);assert.equal(data.sourceWaves.wave3.count,227);
 assert.equal(data.sourceWaves.triagedMetadataCount,419);
 assert.deepEqual(data.records.map(x=>x.labId),original.slice(192).map(x=>x.lab_id));
 assert.equal(data.status,'RESEARCH_AND_INTERNAL_FILE_INVENTORY_ONLY');
});
test('Separate external research URLs from site internal implementation file candidates',()=>{
 assert.equal(data.externalReferences.length,8);assert.equal(data.internalEvidenceCandidates.length,25);
 assert.equal(byId.size,33);
 for(const source of data.externalReferences){assert.match(source.uri,/^https:\/\//);assert.equal(source.licensedDataAccess,false);assert.equal(source.researchRights,'CITATION_ONLY_NO_COPYING');assert.ok(doc.includes(source.uri));}
 for(const source of data.internalEvidenceCandidates){
  assert.equal(source.paths.length,2);
  assert.equal(source.evidenceObserved,'FILES_PRESENT_ONLY_BEHAVIOR_NOT_VERIFIED');
  for(const path of source.paths){assert.ok(existsSync(join(root,path)),path+' missing');assert.ok(doc.includes(path));}
 }
});
for(const row of data.records){
 test('Canonical Lab '+row.ordinal+' '+row.labId+' original status and source rights protected',()=>{
  const prev=original[row.ordinal-1];assert.equal(row.labId,prev.lab_id);assert.equal(row.title,prev.title);
  assert.equal(row.collection,prev.collection);assert.deepEqual(row.competencies,prev.competencies.split(';'));
  assert.equal(row.legacySourceId,prev.source_id);assert.equal(row.legacyMappingStatus,prev.mapping_status);
  assert.equal(row.legacyVerificationStatus,prev.verification_status);assert.equal(row.legacyEditorialStatus,'not_accepted');
  assert.equal(row.independentClaimAccepted,false);assert.equal(row.ownerAuthoredContentApprovalPreserved,true);
  assert.equal(row.memberAccessibilityAccepted,false);assert.equal(row.officialAssessmentEnabled,false);
  assert.equal(row.proprietarySourceRightsGranted,false);assert.ok(row.sourceIds.length>=1);
  assert.ok(row.sourceIds.every(id=>byId.has(id)));
  assert.ok(doc.includes('| '+row.labId+' |'));
  if(row.ordinal>=320){assert.equal(row.domain,'platform_internal');assert.equal(row.sourceIds.length,1);assert.ok(row.requiredChecks.includes('INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE'));}
  else{assert.equal(row.domain,'market_education');assert.equal(row.sourceIds.length,2);}
 });
}
for(const g of data.marketEducationFamilies){
 test('Market education source family '+g.key+' has contiguous declared coverage',()=>{
  assert.equal(data.records.filter(x=>x.topicFamily===g.key).length,g.last-g.first+1);
  assert.ok(g.refs.every(x=>byId.has(x)));
 });
}
for(const g of data.platformFamilies){
 test('SITE product family '+g.key+' contains exactly four canonical workflow Labs',()=>{
  assert.equal(data.records.filter(x=>x.topicFamily===g.key).length,4);
  assert.ok(byId.has(g.sourceId));
 });
}
test('Advanced 52 + tape 75 + site 100 boundary, rights and grading all hold',()=>{
 assert.equal(data.records.filter(x=>x.ordinal>=193&&x.ordinal<=244).length,52);
 assert.equal(data.records.filter(x=>x.ordinal>=245&&x.ordinal<=319).length,75);
 assert.equal(data.records.filter(x=>x.ordinal>=320&&x.ordinal<=419).length,100);
 assert.equal(data.sourceWaves.individuallyAcceptedSourceClaims,0);
 assert.equal(data.legalControls.tradePrintDataRedistributed,false);
 assert.equal(data.legalControls.officialGradingActivated,false);
 assert.equal(data.legalControls.savedMemberProgressChanged,false);
 assert.match(doc,/419\/419 candidate metadata coverage is not 419\/419 editorial approval/i);
});
test('Market-feed and curriculum anomaly highlights retained in review queues',()=>{
 assert.ok(data.records.find(x=>x.labId==='DT-C50-L01').requiredChecks.includes('ARCHIVED_SYMBOL_SOURCE_RIGHTS_AND_TIMEZONE_EVIDENCE_REQUIRED'));
 assert.ok(data.records.find(x=>x.labId==='TAPE-C09-L01').requiredChecks.includes('LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED'));
 assert.ok(data.records.find(x=>x.labId==='TAPE-C17-L02').requiredChecks.includes('EMA_COMPETENCY_IN_FEED_LIMITATIONS_TOPIC_REQUIRES_REVIEW'));
});
