import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../data/lab-teaching-bridges-v014168.json',import.meta.url),'utf8'));
const rows=Object.values(data.entries).filter(x=>x.instructionSource==='ORIGINAL_SUBJECT_SPECIFIC_BATCH12_20261102');
const authored=Object.values(data.entries).filter(x=>Boolean(x.instructionSource));
test('Batch12 contributes twenty new canonical Day Trading bridges for 240/419',()=>{
 assert.equal(rows.length,20);assert.equal(authored.length,240);assert.equal(new Set(rows.map(x=>x.labId)).size,20);
 assert.deepEqual(rows.map(x=>x.labId),['DT-C43-L01','DT-C43-L02','DT-C43-L03','DT-C44-L01','DT-C44-L02','DT-C44-L03','DT-C45-L01','DT-C45-L02','DT-C45-L03','DT-C46-L01','DT-C46-L02','DT-C46-L03','DT-C47-L01','DT-C47-L02','DT-C48-L01','DT-C48-L02','DT-C49-L01','DT-C49-L02','DT-C50-L01','DT-C50-L02']);
});
test('Batch12 is distinct, calculation-explicit, ungraded, no-lookahead and provenance-safe',()=>{
 assert.equal(new Set(rows.map(x=>x.tabs.apply[0])).size,20);assert.equal(new Set(rows.map(x=>x.transfer.prompt)).size,20);
 for(const x of rows){assert.equal(x.instructionalArchitecture.stages.length,9);assert.equal(x.instructionalArchitecture.visibleSteps.length,10);assert(x.competencies.length);assert(x.prerequisites.length);assert.match(x.tabs.apply[0],/FICTIONAL|No rights-cleared/);assert.match(x.tabs.mistake[0],/Common misconception/);assert.equal(x.transfer.graded,false);assert.equal(x.transfer.noLookahead,true);assert.equal(x.taliaContext.mayRevealProtectedAnswerKey,false);assert.equal(x.provenance.publicationRights,'NOT_APPROVED');assert.equal(x.provenance.aiEditorialPreflight,false);assert.equal(x.provenance.independentEditorialAcceptance,false);}
});
test('named-security cases distinguish fictional practice from unavailable historical facts',()=>{
 for(const id of ['DT-C50-L01','DT-C50-L02']){const x=data.entries[id];assert.match(x.tabs.understand[0],/must not invent|provenance/);assert.match(x.tabs.apply[0],/No rights-cleared GRML/);assert.equal(x.provenance.dataIngestionRights,'NOT_APPROVED');}
});
