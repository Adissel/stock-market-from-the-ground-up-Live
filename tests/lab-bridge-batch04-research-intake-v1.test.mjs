import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const ledger=JSON.parse(read('docs/learning/SMFGU-LAB-BATCH04-SOURCE-INTAKE-20261101.json'));
const sources=JSON.parse(read('docs/research/master/master-source-registry-v1.json'));
const bridges=JSON.parse(read('data/lab-teaching-bridges-v014168.json'));
const csv=read('docs/419_LAB_EDITORIAL_ACCEPTANCE_v014100.csv').split(/\r?\n/).slice(1);
const canonical=new Map(csv.map(row=>row.match(/^"([^"]+)","([^"]*)","([^"]*)","([^"]*)"/)).filter(Boolean).map(a=>[a[1],a[4]]));
const sourceById=new Map(sources.sources.map(s=>[s.id,s]));

test('Batch04 source intake preserves approved denominators and does not misstate additional authored Labs',()=>{
 assert.equal(canonical.size,419);
 assert.equal(bridges.canonicalLabCount,419);
 assert.equal(Object.keys(bridges.entries).length,419);
 assert.equal(ledger.canonicalOriginalLabCount,419);
 assert.equal(ledger.priorAuthoredRewrites,60);
 assert.equal(ledger.additionalRewritesThisGate,0);
 assert.equal(ledger.academyAcceptedUnits,93);
 assert.equal(ledger.academyTotalUnits,380);
 assert.equal(ledger.entries.length,20);
 assert.equal(new Set(ledger.entries.map(e=>e.labId)).size,20);
 assert.match(ledger.status,/RESEARCH_INTAKE_ONLY/);
 assert.equal(ledger.publicationRightsVerified,false);
});
test('Batch04 primary evidence has 20 accurate Lab subjects, two valid source candidates and rights holds',()=>{
 for(const e of ledger.entries){
  assert.equal(canonical.get(e.labId),e.title,'Canonical lesson title must match, no invented subjects: '+e.labId);
  assert.notEqual(e.title,e.labId,'ID-only title is an unresolved curriculum gap: '+e.labId);
  assert(bridges.entries[e.labId],'Research case must map to a real Lab: '+e.labId);
  assert.equal(e.completedBarBoundary,true);
  assert.equal(e.fictionalWorkedExampleRequired,true);
  assert.equal(e.ungradedNewTransferRequired,true);
  assert.equal(e.privateKeyMayBeCopied,false);
  assert.equal(e.lessonAuthoredInThisBatch,false);
  assert.equal(e.independentReviewerAccepted,false);
  assert.equal(e.memberBrowserAccepted,false);
  assert.match(e.sourceClaimStatus,/NOT_INDIVIDUALLY_VERIFIED/);
  assert.match(e.sourceRights,/NOT_APPROVED/);
  assert(e.editorialFocus.length>=60,'Subject-specific editorial goal required: '+e.labId);
  assert.equal(e.sourceCandidateIds.length,2);
  assert.notEqual(e.sourceCandidateIds[0],e.sourceCandidateIds[1]);
  for(const id of e.sourceCandidateIds){
   const s=sourceById.get(id);assert(s,'Unknown research source ID: '+id);
   assert.equal(s.publicationRights,'NOT_APPROVED');
   assert.equal(s.dataIngestionRights,'NOT_APPROVED');
  }
 }
});
test('Batch04 excludes existing ID-only canonical titles rather than assigning invented subjects',()=>{
 for(const id of ledger.excludedAmbiguousCanonTitles){
  assert.equal(canonical.get(id),id,'Exclusion only for currently uninformative canonical label');
  assert(!ledger.entries.some(e=>e.labId===id));
 }
 assert.equal(ledger.externalReferencesObserved.length,6);
 assert(ledger.externalReferencesObserved.every(x=>x.startsWith('https://chartschool.stockcharts.com/')));
});
