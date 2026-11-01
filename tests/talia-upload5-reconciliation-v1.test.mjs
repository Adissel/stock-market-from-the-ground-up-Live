// Talia upload (5) research intake: compare source identities without modifying the canonical master registry.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const rd=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const master=rd('docs/research/master/master-source-registry-v1.json');
const intake=rd('data/talia-upload5-source-reconciliation-v1.json');
const normalize=x=>x.replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/(?=\?|$)/,'').replace(/\?utm_[^\s]*$/,'').toLowerCase();
test('uploaded 98 links yield 92 individually mapped canonical URL candidates and preserve 73 master source IDs',()=>{
 assert.equal(intake.sourceUpload,'Master Research Source Directory(5).odt');
 assert.equal(intake.rawHyperlinks,98);
 assert.equal(intake.canonicalUploadedUrls,92);
 assert.equal(intake.records.length,92);
 assert.equal(master.sources.length,73);
 assert.deepEqual(new Set(intake.records.map(x=>x.index)).size,92);
 assert.equal(new Set(intake.records.map(x=>normalize(x.url))).size,92);
 assert.equal(intake.records.filter(x=>x.classification==='EXACT_CANONICAL_URL').length,32);
 assert.equal(intake.records.filter(x=>x.classification==='SAME_PROVIDER_CANDIDATE').length,55);
 assert.equal(intake.records.filter(x=>x.classification==='NO_PROVIDER_CANDIDATE').length,5);
 const ids=new Set(master.sources.map(x=>x.id));
 for(const row of intake.records){
  assert.ok(/^https:\/\//.test(row.url));
  assert.ok(row.candidateIds.every(x=>ids.has(x)),row.url);
  assert.equal(row.sourceClaimAcceptance,false);
  assert.equal(row.thirdPartyDataIngestionApproved,false);
 }
});
