import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const audit=read('docs/learning/SMFGU-LAB-BATCH04-INTERNAL-QA-20261101.json');
const source=read('data/lab-teaching-bridges-v014168.json');
const fixture=read('data/lab-bridge-batch04-quant-fixtures-v1.json');
const prior=new Map(fixture.items.map(x=>[x.labId,x]));
test('Batch 04 individual internal audit does not grant external editorial, rights, official grade or member acceptance',()=>{
 assert.equal(audit.entries.length,20);
 assert.equal(audit.counts.independentFinancialEditorialAccepted,0);
 assert.equal(audit.counts.authenticatedAccepted,0);
 assert.equal(audit.counts.publicationRightsApproved,0);
 assert.equal(audit.publicationAcceptance,false);
 assert.equal(new Set(audit.entries.map(x=>x.labId)).size,20);
 for(const e of audit.entries){
  const row=source.entries[e.labId],f=prior.get(e.labId);
  assert(row&&f,'Missing canonical authored Lab or quant fixture');
  assert.equal(row.title,e.title);
  assert.equal(row.instructionSource,'ORIGINAL_SUBJECT_SPECIFIC_BATCH04_20261101');
  assert.match(row.sourceStatus,/EDITORIAL_ACCEPTANCE_PENDING/);
  assert.equal(e.arithmetic.method,'ABSOLUTE_DIFFERENCE');
  assert.deepEqual(e.arithmetic.values,f.inputs);
  assert.equal(e.arithmetic.expected,f.expected);
  assert.equal(e.independentEditorialSignoff,false);
  assert.equal(e.memberBrowser,'NOT_ACCEPTED');
  assert.equal(e.privateOfficialAnswerKeyInspected,false);
  assert.match(e.rights,/NOT_APPROVED/);
  assert(e.finding.length>=65,'Every case must have a substantive individual QA finding');
 }
});
