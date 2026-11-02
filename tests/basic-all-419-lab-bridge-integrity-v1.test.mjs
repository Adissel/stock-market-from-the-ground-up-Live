import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const rows=JSON.parse(readFileSync('data/lab-teaching-bridges-v014168.json','utf8')).entries;
const entries=Object.entries(rows);
test('Exactly 419 distinct canonical authored Lab bridges are present',()=>{assert.equal(entries.length,419);assert.equal(new Set(entries.map(([id])=>id)).size,419)});
for(const [id,record] of entries){
 test('Canonical Lab instructional integrity: '+id,()=>{
  assert.equal(record.labId,id,'Bridge identity mismatch');
  assert.ok(typeof record.title==='string'&&record.title.trim().length>0,'Missing Lab title');
  assert.ok(record.instructionSource,'Missing teaching source');
  assert.equal(record.transfer?.graded??false,false,'Ungraded transfer must never grant an official grade');
  assert.equal(record.transfer?.noLookahead,true,'Transfer must not use future evidence');
  assert.notEqual(record.provenance?.independentEditorialAcceptance,true,'Third-party sign-off must not be inferred from owner approval');
 });
}
