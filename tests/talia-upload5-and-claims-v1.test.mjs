// Source-only data reconciliation and exact-claim evidence integrity for Talia.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const rd=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const file=rd('data/talia-primary-scope-124-140-v1.json');
const existing=rd('data/talia-claims-101-140-evidence-batch-v1.json');
test('six real source-scope corrections map to exact numbered Foundation claims and do not auto-release',()=>{
 assert.equal(file.itemsExamined,6);
 assert.equal(file.independentPublicationAccepted,0);
 assert.deepEqual(file.sourceNotes.map(x=>x.n),[124,135,137,138,139,140]);
 const rows=new Map(existing.rows.map(x=>[x.number,x]));
 for(const note of file.sourceNotes){
  const item=rows.get(note.n);assert.equal(note.code,item.code);
  assert.match(note.url,/^https:\/\//);
  assert.ok(note.note.length>=90&&note.fix.length>=65);
  assert.equal(item.independentPublicationApproved,false);
 }
 assert.equal(file.sourceNotes.filter(x=>x.verdict==='SOURCE_SCOPE_TOO_BROAD').length,3);
 assert.match(file.sourceNotes.find(x=>x.n===139).note,/TOTAL LIABILITIES/);
 assert.match(file.sourceNotes.find(x=>x.n===124).note,/nominal/);
});
