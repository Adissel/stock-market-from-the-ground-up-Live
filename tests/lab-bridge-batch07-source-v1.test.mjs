import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const bridge=load('data/lab-teaching-bridges-v014168.json');
const rows=Object.values(bridge.entries).filter(x=>x.instructionSource==='ORIGINAL_SUBJECT_SPECIFIC_BATCH07_20261102');
test('Batch07 adds exactly twenty new canonical subject-specific bridges',()=>{
 assert.equal(bridge.canonicalLabCount,419);assert.equal(bridge.officialCompetencyCount,30);assert.equal(rows.length,20);
 assert(Object.values(bridge.entries).filter(x=>x.instructionSource).length>=140);
 assert.equal(new Set(rows.map(x=>x.labId)).size,20);assert.equal(new Set(rows.map(x=>x.title)).size,20);
});
test('Batch07 instruction is distinct, complete, rights-gated and ungraded',()=>{
 const transfers=new Set(),worked=new Set();
 for(const row of rows){
  assert.match(row.sourceStatus,/EDITORIAL_REVIEW_PENDING/);assert(row.competencies.length>0,row.labId);
  for(const key of ['understand','recognize','apply','mistake','limits']){assert.equal(row.tabs[key].length,3);assert(row.tabs[key].every(x=>x.length>80),row.labId+' '+key)}
  assert.equal(row.transfer.graded,false);assert.equal(row.transfer.noLookahead,true);assert.equal(row.transfer.requiresNewEvidence,true);
  assert(!transfers.has(row.transfer.prompt));transfers.add(row.transfer.prompt);
  assert(!worked.has(row.tabs.apply[0]));worked.add(row.tabs.apply[0]);
  assert.equal(row.provenance.publicationRights,'NOT_APPROVED');assert.equal(row.provenance.dataIngestionRights,'NOT_APPROVED');
  assert.equal(row.provenance.editorialAcceptance,false);assert.equal(row.provenance.memberAcceptance,false);
 }
});
