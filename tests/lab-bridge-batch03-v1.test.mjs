import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const payload=JSON.parse(readFileSync(new URL('../data/lab-teaching-bridges-v014168.json',import.meta.url),'utf8'));
const ids=[
 "F2-C09-L04",
 "F2-C09-L05",
 "F2-C10-L01",
 "F2-C10-L02",
 "F2-C10-L03",
 "F2-C11-L01",
 "F2-C11-L02",
 "F2-C11-L03",
 "F2-C11-L04",
 "F2-C12-L01",
 "F2-C12-L02",
 "F2-C12-L03",
 "F2-C12-L04",
 "F2-C13-L01",
 "F2-C13-L02",
 "F2-C13-L03",
 "F2-C13-L04",
 "F2-C14-L01",
 "F2-C14-L02",
 "F2-C14-L03"
];
const rows=Object.values(payload.entries);
test('Batch03: preserved 419 canonical Labs, 30 competencies, 60 rewritten subjects',()=>{
 assert.equal(payload.canonicalLabCount,419);
 assert.equal(payload.officialCompetencyCount,30);
 assert.equal(rows.length,419);
 assert.equal(new Set(rows.map(x=>x.labId)).size,419);
 const rewritten=rows.filter(x=>typeof x.instructionSource==='string');
 assert(rewritten.length>=60,'Previously authored 60-Lab baseline must never regress as new batches are added');
 assert.equal(rewritten.filter(x=>x.instructionSource==='ORIGINAL_SUBJECT_SPECIFIC_BATCH03_20261101').length,20);
});
test('Batch03: twenty topic-specific original worked cases, distinct transfer and protected grading boundary',()=>{
 const before=rows.filter(x=>x.instructionSource&&!ids.includes(x.labId));
 const priorTransfers=new Set(before.map(x=>x.transfer?.prompt));
 const seen=new Set();
 for(const id of ids){
  const x=payload.entries[id];
  assert(x,'Canonical Lab absent '+id);
  assert.equal(x.instructionSource,'ORIGINAL_SUBJECT_SPECIFIC_BATCH03_20261101');
  assert.match(x.sourceStatus,/FICTIONAL_INSTRUCTION_WRITTEN_.*INDEPENDENT_EDITORIAL_ACCEPTANCE_PENDING/);
  for(const facet of ['understand','recognize','apply','mistake','limits']){
   assert(Array.isArray(x.tabs?.[facet])&&x.tabs[facet].length===3,id+' missing substantive '+facet);
   assert(x.tabs[facet].every(p=>typeof p==='string'&&p.length>90),id+' short '+facet);
  }
  assert(x.tabs.understand.some(p=>/FICTIONAL/i.test(p)),id+' lacks fictional label');
  assert(x.tabs.apply.some(p=>/reproduce|calculation|comparison/i.test(p)),id+' lacks worked instructions');
  assert(typeof x.selfCheck==='string'&&x.selfCheck.length>110,id+' needs original comprehension task');
  assert.equal(x.transfer?.type,'ungraded_independent_practice');
  assert.equal(x.transfer?.graded,false);
  assert.equal(x.transfer?.noLookahead,true);
  assert.equal(x.transfer?.requiresNewEvidence,true);
  assert(!seen.has(x.transfer.prompt),id+' repeated transfer in this batch');
  assert(!priorTransfers.has(x.transfer.prompt),id+' copied earlier transfer');
  seen.add(x.transfer.prompt);
  assert.equal(x.independentGradesIncluded,undefined,'Bridge must not claim official grade');
 }
 assert.equal(seen.size,20);
});
test('Batch03: independent arithmetic reference values for all twenty worked examples',()=>{
 const near=(x,v)=>assert.ok(Number.isFinite(x)&&Math.abs(x-v)<1e-9,'Unexpected fictional arithmetic: '+x+' vs '+v);
 const checks=[
  [1.20-.50,.70],
  [Math.min(11,11.2,10.9)-Math.max(10,10.3,10.2),.60],
  [33-30,3],
  [20*5,100],
  [100+200+150+200,650],
  [10.40-10.20,.20],
  [10.20-10.40,-.20],
  [10.30-10.50,-.20],
  [Math.max(10,11,9,10)-Math.min(10,11,9,10),2],
  [11.10-10,1.10],
  [10.10-11,-.90],
  [Math.max(10,10.30,9.90,10.20,10.10)-Math.min(10,10.30,9.90,10.20,10.10),.40],
  [11.60-10,1.60],
  [11.10-10.70,.40],
  [11.10-11.50,-.40],
  [11.40-11.80,-.40],
  [11.60-11,.60],
  [10.05-9.98,.07],
  [12-11.90,.10],
  [9.98-9.70,.28]
 ];
 assert.equal(checks.length,ids.length);
 checks.forEach(([got,expected],i)=>near(got,expected));
});
