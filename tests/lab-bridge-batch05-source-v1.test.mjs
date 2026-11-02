import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const data=read('data/lab-teaching-bridges-v014168.json');
const cases=read('data/lab-bridge-batch05-quant-fixtures-v1.json');
const intake=read('docs/learning/SMFGU-LAB-BATCH05-SOURCE-INTAKE-20261101.json');
const sources=read('docs/research/master/master-source-registry-v1.json');
const src=new Map(sources.sources.map(s=>[s.id,s]));
test('Batch 05 canonical 20, original 419 and 30 unchanged, 100 source-only rewrites',()=>{
 assert.equal(data.canonicalLabCount,419);assert.equal(data.officialCompetencyCount,30);
 assert.equal(Object.keys(data.entries).length,419);
 assert.equal(data.independentGradesIncluded,false);assert.equal(data.historicalBarDataIncluded,false);
 assert(Object.values(data.entries).filter(x=>x.instructionSource).length>=100);
 assert.equal(Object.values(data.entries).filter(x=>x.instructionSource==='ORIGINAL_SUBJECT_SPECIFIC_BATCH05_20261101').length,20);
 assert.equal(cases.cases.length,20);assert.equal(intake.entries.length,20);
 assert.deepEqual(new Set(cases.cases.map(x=>x.labId)),new Set(intake.entries.map(x=>x.labId)));
});
test('Batch 05 source and protected-grade boundaries, original no-lookahead transfer',()=>{
 const seen=new Set(),old=new Set(Object.values(data.entries).filter(x=>x.instructionSource!=='ORIGINAL_SUBJECT_SPECIFIC_BATCH05_20261101').map(x=>x.transfer?.prompt));
 for(const x of intake.entries){
  const row=data.entries[x.labId];
  assert.equal(row.title,x.title);assert.equal(row.collection,x.collection);
  assert.equal(row.instructionSource,'ORIGINAL_SUBJECT_SPECIFIC_BATCH05_20261101');
  assert.match(row.sourceStatus,/EDITORIAL_ACCEPTANCE_PENDING/);
  for(const key of ['understand','recognize','apply','mistake','limits']){
   assert.equal(row.tabs[key].length,3);
   assert(row.tabs[key].every(s=>typeof s==='string'&&s.length>=95),x.labId+' '+key);
  }
  assert(row.tabs.understand.join(' ').includes('FICTIONAL'));
  assert(row.tabs.apply.join(' ').includes('FICTIONAL'));
  assert(row.tabs.limits.join(' ').includes('research')||row.tabs.limits.join(' ').includes('Research'));
  assert(row.selfCheck.length>=150);
  assert.equal(row.transfer.type,'ungraded_independent_practice');
  assert.equal(row.transfer.graded,false);assert.equal(row.transfer.noLookahead,true);assert.equal(row.transfer.requiresNewEvidence,true);
  assert(!old.has(row.transfer.prompt));assert(!seen.has(row.transfer.prompt));seen.add(row.transfer.prompt);
  assert.equal(row.independentGradesIncluded,undefined);assert.equal(row.protectedAnswerKey,undefined);
  for(const id of x.sourceCandidateIds){const s=src.get(id);assert(s,id);assert.equal(s.publicationRights,'NOT_APPROVED');assert.equal(s.dataIngestionRights,'NOT_APPROVED');}
 }
 assert.equal(seen.size,20);
});
test('Batch 05 twenty original arithmetic source cases and legal risk hold',()=>{
 const found=new Set();
 for(const x of cases.cases){
  assert(!found.has(x.labId));found.add(x.labId);
  assert.equal(x.differenceKind,'ABSOLUTE_DIFFERENCE_IN_DECLARED_UNITS');
  assert.equal(x.inputs.length,2);assert(x.inputs.every(Number.isFinite));
  assert(Math.abs(Math.abs(x.inputs[0]-x.inputs[1])-x.expected)<1e-9);
  const row=data.entries[x.labId];
  assert(row.tabs.apply.join(' ').includes('$'+x.inputs[0].toFixed(2)));
  assert(row.tabs.apply.join(' ').includes('$'+x.inputs[1].toFixed(2)));
  assert(row.tabs.apply.join(' ').includes('$'+x.expected.toFixed(2)));
  assert.equal(row.transfer.prompt,x.transferPrompt);
 }
 for(const id of ['DT-C04-L01','DT-C04-L02','DT-C04-L03']){
  const x=data.entries[id];assert.match(x.tabs.limits.join(' '),/regulatory|margin/i);
  assert.match(x.tabs.limits.join(' '),/current-rule|current authoritative|verification|review/i);
 }
});
