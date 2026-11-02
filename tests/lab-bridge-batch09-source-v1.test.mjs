import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const load=p=>JSON.parse(readFileSync(p,'utf8'));
const bridge=load('data/lab-teaching-bridges-v014168.json');
const paths=load('data/competency-lab-paths-v01499.json').byLab;
const expected=['DT-C27-L02','DT-C27-L03','DT-C28-L01','DT-C28-L02','DT-C28-L03','DT-C29-L01','DT-C29-L02','DT-C29-L03','DT-C30-L01','DT-C30-L02','DT-C30-L03','DT-C31-L01','DT-C31-L02','DT-C31-L03','DT-C32-L01','DT-C32-L02','DT-C32-L03','DT-C33-L01','DT-C33-L02','DT-C33-L03'];
const rows=Object.values(bridge.entries).filter(x=>x.instructionSource==='ORIGINAL_SUBJECT_SPECIFIC_BATCH09_20261102');

test('Batch09 authors exactly the reserved twenty titled canonical Labs',()=>{
 assert.equal(bridge.canonicalLabCount,419);
 assert.equal(bridge.officialCompetencyCount,30);
 assert.deepEqual(rows.map(x=>x.labId),expected);
 assert.equal(new Set(rows.map(x=>x.title)).size,20);
 assert(rows.every(x=>x.title!==x.labId));
});

test('Batch09 retains the nine-stage engine and ten visible-step contract',()=>{
 for(const row of rows){
  assert.deepEqual(row.instructionalArchitecture.stages,['Start','Learn','Experiment','Predict','Practice','Assess','Review','Transfer','Results'],row.labId);
  assert.deepEqual(row.instructionalArchitecture.visibleSteps,['Start','Learn','Calculate','Experiment','Predict','Replay / Practice','Assess','Review & Retry','Transfer Challenge','Results'],row.labId);
  assert.equal(row.prerequisites.length,1,row.labId);
  assert(bridge.entries[row.prerequisites[0]],row.labId+' prerequisite must be canonical');
  assert.deepEqual(row.competencies,paths[row.labId].relatedCompetencies,row.labId);
 }
});

test('Batch09 teaching is original, complete, distinct, Talia-ready, and ungraded',()=>{
 const transfers=new Set(),worked=new Set(),selfChecks=new Set();
 for(const row of rows){
  assert.match(row.sourceStatus,/AI_EDITORIAL_PREFLIGHT_PENDING/);
  for(const key of ['understand','recognize','apply','mistake','limits']){
   assert.equal(row.tabs[key].length,3,row.labId+' '+key);
   assert(row.tabs[key].every(x=>x.length>80),row.labId+' '+key);
  }
  assert(!worked.has(row.tabs.apply[0]),row.labId);worked.add(row.tabs.apply[0]);
  assert(!transfers.has(row.transfer.prompt),row.labId);transfers.add(row.transfer.prompt);
  assert(!selfChecks.has(row.selfCheck),row.labId);selfChecks.add(row.selfCheck);
  assert.equal(row.transfer.graded,false);assert.equal(row.transfer.noLookahead,true);assert.equal(row.transfer.requiresNewEvidence,true);
  assert.equal(row.taliaContext.saveHistory,false);assert.equal(row.taliaContext.mayRevealProtectedAnswerKey,false);
  assert.equal(row.provenance.fictionalExamples,true);assert.equal(row.provenance.publicationRights,'NOT_APPROVED');
  assert.equal(row.provenance.dataIngestionRights,'NOT_APPROVED');assert.equal(row.provenance.aiEditorialPreflight,false);
  assert.equal(row.provenance.independentEditorialAcceptance,false);assert.equal(row.provenance.memberAcceptance,false);
 }
});

