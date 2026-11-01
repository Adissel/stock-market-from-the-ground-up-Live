import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
const read=p=>readFileSync(p,'utf8');
const bridges=JSON.parse(read('data/lab-teaching-bridges-v014168.json'));
const batch=JSON.parse(read('docs/learning/SMFGU-LAB-BATCH01-20261101.json'));
test('First 20 Labs are canonical and source-specific without changing 419 registry',()=>{
 assert.equal(Object.keys(bridges.entries).length,419);assert.equal(bridges.canonicalLabCount,419);
 assert.equal(batch.entries.length,20);assert.equal(new Set(batch.entries.map(x=>x.id)).size,20);
 assert.deepEqual(batch.entries.map(x=>x.id),Object.keys(bridges.entries).slice(0,20));
 assert.equal(bridges.independentGradesIncluded,false);
 assert.equal(bridges.historicalBarDataIncluded,false);
 for(const {id} of batch.entries){const row=bridges.entries[id];
  for(const tab of ['understand','recognize','apply','mistake','limits']){
   assert(Array.isArray(row.tabs[tab])&&row.tabs[tab].length>=2,id+' '+tab);
   assert(row.tabs[tab].every(s=>s.length>=60),id+' '+tab+' needs substance');
   assert.doesNotMatch(row.tabs[tab].join(' '),/We will learn about|Let us practice|Here is how to recognize|What .* cannot establish:/i,id);
  }
  assert(row.selfCheck.length>70,id+' missing individual self-check');
  assert(row.transfer.prompt.length>100,id+' missing new-case transfer');
  assert.equal(row.transfer.graded,false);
  assert.equal(row.transfer.noLookahead,true);
  assert.equal(row.transfer.requiresNewEvidence,true);
  assert.equal(row.transfer.topic,row.title);
 }
});
test('No hidden grades or membership changes in editorial-only data',()=>{
 const raw=read('data/lab-teaching-bridges-v014168.json');
 for(const prohibited of ['"privateRubric"','"answerKey"','"masteryAwarded":true','"stripePayment"'])
  assert(!raw.includes(prohibited),'Protected information in public Lab text');
});
