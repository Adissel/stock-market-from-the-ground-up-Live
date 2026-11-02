import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const bridge=load('data/lab-teaching-bridges-v014168.json');
const cases=load('data/lab-bridge-batch06-quant-fixtures-v1.json');
const intake=load('docs/learning/SMFGU-LAB-BATCH06-SOURCE-INTAKE-20261101.json');
const registry=load('docs/research/master/master-source-registry-v1.json');
const refs=new Map(registry.sources.map(x=>[x.id,x]));
const rows=Object.values(bridge.entries).filter(x=>x.instructionSource==='ORIGINAL_SUBJECT_SPECIFIC_BATCH06_20261101');
test('Batch06 retains official 419 Labs, 30 competencies, no protected grades and 120 individually authored cases',()=>{
 assert.equal(bridge.canonicalLabCount,419);
 assert.equal(bridge.officialCompetencyCount,30);
 assert.equal(bridge.independentGradesIncluded,false);
 assert.equal(bridge.historicalBarDataIncluded,false);
 assert.equal(Object.keys(bridge.entries).length,419);
 assert(Object.values(bridge.entries).filter(x=>x.instructionSource).length>=120);
 assert.equal(rows.length,20);
 assert.equal(intake.entries.length,20);
 assert.equal(cases.cases.length,20);
 assert.deepEqual(new Set(rows.map(x=>x.labId)),new Set(intake.entries.map(x=>x.labId)));
 const publicLabs=load('data/labs.json');
 for(const id of intake.excludedUnresolvedCanonTitles){const recovered=publicLabs.find(x=>x.id===id)?.concept;assert(recovered&&recovered!==id);assert.equal(bridge.entries[id].title,recovered)}
});
test('Batch06 every source individually original, financial-rights held, no-lookahead ungraded transfer',()=>{
 const observed=new Set(),prior=new Set(Object.values(bridge.entries).filter(x=>x.instructionSource!=='ORIGINAL_SUBJECT_SPECIFIC_BATCH06_20261101').map(x=>x.transfer?.prompt));
 for(const x of intake.entries){
  const row=bridge.entries[x.labId];assert.equal(row.title,x.title);
  assert.equal(row.collection,x.collection);
  assert.match(row.sourceStatus,/EDITORIAL_ACCEPTANCE_PENDING/);
  assert.equal(row.instructionSource,'ORIGINAL_SUBJECT_SPECIFIC_BATCH06_20261101');
  const facets=['understand','recognize','apply','mistake','limits'];
  for(const f of facets){assert.equal(row.tabs[f].length,3);assert(row.tabs[f].every(y=>typeof y==='string'&&y.length>95),x.labId+' '+f);}
  assert(row.tabs.understand.join(' ').includes('FICTIONAL'));
  assert(row.tabs.apply.join(' ').includes('FICTIONAL'));
  assert(row.tabs.limits.join(' ').includes('NOT')||row.tabs.limits.join(' ').includes('not'));
  assert(row.selfCheck.length>160);
  assert.equal(row.transfer.type,'ungraded_independent_practice');
  assert.equal(row.transfer.graded,false);
  assert.equal(row.transfer.noLookahead,true);
  assert.equal(row.transfer.requiresNewEvidence,true);
  assert(!observed.has(row.transfer.prompt)&&!prior.has(row.transfer.prompt));
  observed.add(row.transfer.prompt);
  assert.equal(x.individualClaimReview,false);
  assert.equal(x.independentMathReview,false);
  assert.equal(x.memberAcceptance,false);
  for(const id of x.sourceCandidateIds){
   const s=refs.get(id);assert(s,id);assert.equal(s.publicationRights,'NOT_APPROVED');assert.equal(s.dataIngestionRights,'NOT_APPROVED');
  }
 }
 assert.equal(observed.size,20);
});
test('Batch06 twenty quantitative fixtures match their original fictional lessons',()=>{
 for(const f of cases.cases){
  const row=bridge.entries[f.labId];
  assert.equal(row.title,f.title);
  assert.equal(f.inputs.length,2);assert(f.inputs.every(Number.isFinite));
  assert.equal(Number(Math.abs(f.inputs[0]-f.inputs[1]).toFixed(10)),f.expected);
  assert(row.tabs.apply.join(' ').includes(String(f.expected.toFixed(f.unit==='shares'?0:2))),f.labId);
  assert.equal(row.transfer.prompt,f.transferPrompt);
  assert.equal(f.status,'FICTIONAL_MATH_ONLY_NO_EDITORIAL_ACCEPTANCE');
 }
});
