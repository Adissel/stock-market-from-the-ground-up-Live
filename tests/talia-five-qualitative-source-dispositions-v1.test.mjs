import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=f=>JSON.parse(readFileSync('data/'+f,'utf8'));
const reviewed=read('talia-claims-five-qualitative-editorial-review-v1.json');
const claims=read('talia-claims-101-140-evidence-batch-v1.json');
const first=read('talia-foundation-explanations-batch06-v1.json').guides;
const second=read('talia-foundation-explanations-batch07-v1.json').guides;
const cases=[...first,...second];
const expected=[105,119,131,132,133];
test('five qualitative editorial dispositions have exact original source identities and individualized evidence',()=>{
 assert.equal(reviewed.count,5);assert.equal(reviewed.publicationApproved,0);
 assert.deepEqual(reviewed.individualRecords.map(x=>x.claim),expected);
 assert.equal(new Set(reviewed.individualRecords.map(x=>x.claim)).size,5);
 for(const row of reviewed.individualRecords){
  assert.equal(row.code,cases[row.claim-101].code);
  assert.equal(claims.rows[row.claim-101].independentPublicationApproved,false);
  assert.match(row.source,/^https:\/\//);assert.match(row.alternate,/^https:\/\//);
  assert.ok(row.validation.length>=100);
  assert.ok(row.risk.length>=60);
  assert.equal(row.productionReleaseApproved,false);
 }
 assert.equal(reviewed.rightsCleared,false);
});
test('preferred, bond, 10-Q, 8-K, EDGAR all retain meaningful and distinct compliance boundaries',()=>{
 const map=new Map(reviewed.individualRecords.map(x=>[x.claim,x]));
 assert.match(map.get(105).validation,/noncumulative/);
 assert.match(map.get(119).validation,/Macaulay duration/);
 assert.match(map.get(131).validation,/unaudited/);
 assert.match(map.get(132).validation,/Item 1.01.*Item 2.01/);
 assert.match(map.get(133).validation,/no first-public-availability timestamp exists/);
 assert.match(map.get(133).risk,/conservative lag/);
 assert.match(map.get(133).decision,/NO_LOOKAHEAD/);
 // Not all qualitative questions reduce to a single numerical calculated response.
 for(const id of expected)assert.match(cases[id-101].workedCase,/^FICTIONAL:/);
});
