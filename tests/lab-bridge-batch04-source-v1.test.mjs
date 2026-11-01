import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const source=JSON.parse(read('data/lab-teaching-bridges-v014168.json'));
const fixture=JSON.parse(read('data/lab-bridge-batch04-quant-fixtures-v1.json'));
const intake=JSON.parse(read('docs/learning/SMFGU-LAB-BATCH04-SOURCE-INTAKE-20261101.json'));
const rights=JSON.parse(read('docs/research/master/master-source-registry-v1.json'));
const refs=new Map(rights.sources.map(s=>[s.id,s]));
const authored=Object.values(source.entries).filter(x=>x.instructionSource);
const batch=authored.filter(x=>x.instructionSource==='ORIGINAL_SUBJECT_SPECIFIC_BATCH04_20261101');

test('Batch 04: exactly twenty mapped canonical source rewrites, no official competency or grading change',()=>{
 assert.equal(source.canonicalLabCount,419);
 assert.equal(source.officialCompetencyCount,30);
 assert.equal(source.independentGradesIncluded,false);
 assert.equal(source.historicalBarDataIncluded,false);
 assert.equal(Object.keys(source.entries).length,419);
 assert.equal(new Set(Object.values(source.entries).map(x=>x.labId)).size,419);
 assert(authored.length>=80,'At least 80 subject-specific authored sources required');
 assert.equal(batch.length,20);
 assert.equal(fixture.schema,'SMFGU-LAB-BATCH04-QUANT-V1');
 assert.equal(fixture.items.length,20);
 assert.deepEqual(new Set(batch.map(x=>x.labId)),new Set(intake.entries.map(x=>x.labId)));
});
test('Batch 04: five substantive subject-specific facets, no-lookahead fresh transfer and rights holds',()=>{
 const priorTransfers=new Set(Object.values(source.entries).filter(x=>x.instructionSource!=='ORIGINAL_SUBJECT_SPECIFIC_BATCH04_20261101').map(x=>x.transfer?.prompt));
 const observed=new Set();
 for(const src of intake.entries){
  const row=source.entries[src.labId];
  assert.equal(row.title,src.title);
  assert.equal(row.instructionSource,'ORIGINAL_SUBJECT_SPECIFIC_BATCH04_20261101');
  assert.match(row.sourceStatus,/FICTIONAL_INSTRUCTION_WRITTEN_.*INDEPENDENT_EDITORIAL_ACCEPTANCE_PENDING/);
  for(const key of ['understand','recognize','apply','mistake','limits']){
   assert.equal(row.tabs[key]?.length,3,src.labId+' '+key);
   assert(row.tabs[key].every(s=>typeof s==='string'&&s.length>95),src.labId+' must be substantive '+key);
   assert(row.tabs[key].join(' ').includes(row.title)||['apply','limits'].includes(key),src.labId+' facet should anchor the original topic '+key);
  }
  const all=Object.values(row.tabs).flat().join(' ');
  assert.match(all,/FICTIONAL/);
  assert.match(all,/completed/);
  assert.match(all,/calculation|comparison|reproduce/i);
  assert(!/guaranteed (?:return|profit)|unlicensed real tape|past member fill/i.test(all));
  for(const ref of src.sourceCandidateIds) {
   assert(refs.has(ref),'Unknown candidate source '+ref);
   assert.equal(refs.get(ref).dataIngestionRights,'NOT_APPROVED');
   assert.equal(refs.get(ref).publicationRights,'NOT_APPROVED');
  }
  assert(row.selfCheck.length>110);
  assert.equal(row.transfer?.type,'ungraded_independent_practice');
  assert.equal(row.transfer?.graded,false);
  assert.equal(row.transfer?.requiresNewEvidence,true);
  assert.equal(row.transfer?.noLookahead,true);
  assert(!priorTransfers.has(row.transfer.prompt),src.labId+' transfer was previously used');
  assert(!observed.has(row.transfer.prompt),src.labId+' repeated transfer');
  observed.add(row.transfer.prompt);
  assert.equal(row.independentGradesIncluded,undefined);
  assert.equal(row.officialGrade,undefined);
  assert.equal(row.protectedAnswerKey,undefined);
 }
 assert.equal(observed.size,20);
});
test('Batch 04: twenty independent fictional arithmetic fixtures and explained input units',()=>{
 const seen=new Set();
 for(const f of fixture.items){
  assert(source.entries[f.labId]);
  assert(!seen.has(f.labId));
  seen.add(f.labId);
  assert.equal(f.kind,'independent_fictional_pair_difference');
  assert.equal(f.inputs.length,2);
  assert(f.inputs.every(Number.isFinite));
  const got=Math.abs(f.inputs[0]-f.inputs[1]);
  assert(Math.abs(got-f.expected)<1e-9,f.labId+' fictional worked arithmetic mismatch');
  const explanation=source.entries[f.labId].tabs.apply.join(' ');
  for(const val of f.inputs)assert(explanation.includes('$'+val.toFixed(2)),f.labId+' lost its declared input');
  assert(explanation.includes('$'+f.expected.toFixed(2)),f.labId+' lost its answer');
  assert.equal(f.distinctTransferPrompt,source.entries[f.labId].transfer.prompt);
 }
 assert.equal(seen.size,20);
});
