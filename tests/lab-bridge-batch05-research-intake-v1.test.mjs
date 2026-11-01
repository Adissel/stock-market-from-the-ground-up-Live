import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const intake=read('docs/learning/SMFGU-LAB-BATCH05-SOURCE-INTAKE-20261101.json');
const bridges=read('data/lab-teaching-bridges-v014168.json');
const catalog=read('docs/research/master/master-source-registry-v1.json');
const ref=new Map(catalog.sources.map(x=>[x.id,x]));
test('Batch 05: twenty original canonical non-rewritten Lab subjects and candidate rights holds',()=>{
 assert.equal(intake.canonicalLabs,419);
 assert(intake.alreadyAuthored>=80);
 assert.equal(intake.additionalAuthored,0);
 assert.equal(intake.entries.length,20);
 assert.equal(new Set(intake.entries.map(x=>x.labId)).size,20);
 for(const r of intake.entries){
  const b=bridges.entries[r.labId];
  assert(b,'Unknown canonical Lab '+r.labId);
  assert.equal(b.title,r.title);
  assert.equal(b.collection,r.collection);
  assert.equal(b.instructionSource,undefined,'Research intake cannot claim authored source');
  assert(r.reviewFocus.length>=60);
  assert.equal(r.approvedRights,false);
  assert.equal(r.teachingSourceAuthored,false);
  assert.equal(r.protectedGradeNeverPublic,true);
  assert.equal(r.sourceCandidateIds.length,2);
  for(const id of r.sourceCandidateIds){const s=ref.get(id);assert(s);assert.equal(s.publicationRights,'NOT_APPROVED');assert.equal(s.dataIngestionRights,'NOT_APPROVED');}
 }
 assert(intake.entries.filter(x=>/DT-C04-/.test(x.labId)).every(x=>x.reviewFocus.includes('REQUIRES CURRENT')),'Margin and day-trading legal rules require independent up-to-date verification');
});
