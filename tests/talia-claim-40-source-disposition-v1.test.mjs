import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync('data/'+name,'utf8'));
const prev=read('talia-claims-101-140-evidence-batch-v1.json');
const next=read('talia-claims-remaining21-source-review-v1.json');
const reg=read('talia-claim-regulatory-risk-104-133-v1.json');
test('all 40 claim IDs have individual source-scope dispositions, no duplicates or rights approval',()=>{
 const laterIds=new Set(next.items.map(x=>x.number));
 const prior=prev.rows.filter(x=>!laterIds.has(x.number));
 assert.equal(prior.length,19);assert.equal(next.items.length,21);
 const all=[...prior.map(x=>x.number),...next.items.map(x=>x.number)];
 assert.equal(new Set(all).size,40);
 assert.deepEqual(all.slice().sort((a,b)=>a-b),Array.from({length:40},(_,i)=>101+i));
 for(const entry of next.items){
  const a=prev.rows.find(x=>x.number===entry.number);
  assert.equal(a.code,entry.code);assert.match(entry.source,/^https:\/\//);
  assert.equal(entry.independentPublicationAccepted,false);
  assert.ok(entry.scope.length>=30);
 }
 assert.equal(next.items.filter(x=>x.review==='SOURCE_MISMATCH').length,0);
 assert.equal(next.items.filter(x=>x.review==='SOURCE_MATCH_CORRECTED_RELEASE_HOLD').length,1);
 assert.equal(next.items.filter(x=>x.review==='CORRECTION_REQUIRED').length,0);
 assert.equal(next.items.filter(x=>x.review==='REGULATORY_HISTORICAL_HOLD').length,1);
 assert.equal(next.items.filter(x=>x.review==='POINT_IN_TIME_ACCEPTANCE_HOLD').length,1);
});
test('SEC vacatur and EDGAR first-public-availability uncertainties are release blockers',()=>{
 assert.deepEqual(reg.critical.map(x=>x.number),[104,133]);
 assert.match(reg.critical[0].finding,/December 19, 2023/);
 assert.match(reg.critical[1].finding,/not timestamped/);
 assert.equal(next.items.find(x=>x.number===104).review,'REGULATORY_HISTORICAL_HOLD');
 assert.equal(next.items.find(x=>x.number===133).review,'POINT_IN_TIME_ACCEPTANCE_HOLD');
 assert.equal(prev.rows.every(x=>x.independentPublicationApproved===false),true);
});

test('corrected P2 reference status does not authorize HHI or EDGAR publication',()=>{
 const hhi=next.items.find(x=>x.number===129);
 const filing=next.items.find(x=>x.number===133);
 assert.equal(hhi.review,'SOURCE_MATCH_CORRECTED_RELEASE_HOLD');
 assert.match(hhi.source,/^https:\/\/www\.ssga\.com\//);
 assert.equal(filing.review,'POINT_IN_TIME_ACCEPTANCE_HOLD');
 assert.equal(filing.source,'https://www.sec.gov/about/webmaster-frequently-asked-questions');
 for(const x of [hhi,filing])assert.equal(x.independentPublicationAccepted,false);
});
