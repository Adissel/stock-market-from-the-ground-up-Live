// Historical V2 evidence was generated on 2026-11-03 from its PINNED blob.
// Do not compare that frozen artifact with a later changing production source.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../data/lab-419-current-body-quality-evidence-v2.json',import.meta.url),'utf8'));
test('Historical V2 record remains immutable, clearly dated and source-pinned',()=>{
 assert.equal(data.schema,'smfgu.lab419.live-source-evidence.v2');
 assert.equal(data.version,'2.0');
 assert.equal(data.date,'2026-11-03');
 assert.equal(data.sourceBlobSha,'db6409b8d9f4a55380048b0558a014e9bc6da373');
 assert.equal(data.status,'SOURCE_QA_ONLY_NO_INDIVIDUAL_EDITORIAL_ACCEPTANCE');
 assert.equal(data.summary.count,419);
 assert.equal(data.records.length,419);
});
test('Historical V2 record and its counts are internally consistent without rewriting its underlying evidence',()=>{
 const rows=data.records;
 const seen=new Set();
 for(let i=0;i<rows.length;i++){
  const q=rows[i];
  assert.equal(q.ordinal,i+1);
  assert.ok(q.labId&&!seen.has(q.labId));
  seen.add(q.labId);
  assert.ok(q.title&&Number.isInteger(q.transferPromptLength)&&q.transferPromptLength>=0);
  assert.equal(q.sourceClaimAccepted,false);
  assert.equal(q.rightsAccepted,false);
  assert.equal(q.memberAccepted,false);
  assert.equal(q.gradedReleased,false);
 }
 for(const [field,fn] of Object.entries({
  completeTabs:x=>x.tabsComplete,transferPresent:x=>x.transferPresent,
  transferPromptOver45:x=>x.transferPromptLength>45,
  transferRequiresNew:x=>x.transferNewEvidence,transferNoLookahead:x=>x.transferNoLookahead,
  transferUngraded:x=>x.transferUngraded,previousTemplateSentence:x=>x.legacyBoilerplateRetained,
  numericalSignal:x=>x.numericSignalDetected
 })){
  assert.equal(data.summary[field],rows.filter(fn).length,field);
 }
 assert.deepEqual(data.summary.shortTransferCases,rows.filter(x=>x.transferPromptLength<=45).map(x=>x.labId));
 assert.equal(data.summary.sourceClaimAccepted,0);
});
