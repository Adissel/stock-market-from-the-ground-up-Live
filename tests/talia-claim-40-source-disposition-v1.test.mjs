import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync('data/'+name,'utf8'));
const prev=read('talia-claims-101-140-evidence-batch-v1.json');
const next=read('talia-claims-remaining21-source-review-v1.json');
const reg=read('talia-claim-regulatory-risk-104-133-v1.json');
test('all 40 claim IDs have individual source-scope dispositions, no duplicates or rights approval',()=>{
 const prior=prev.rows.filter(x=>x.sourceStatus==='SELECTED_PRIMARY_PAGE_CONTENT_EXAMINED');
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
 assert.equal(next.items.filter(x=>x.review==='SOURCE_MISMATCH').length,1);
 assert.equal(next.items.filter(x=>x.review==='CORRECTION_REQUIRED').length,2);
});
test('SEC vacatur and EDGAR first-public-availability uncertainties are release blockers',()=>{
 assert.deepEqual(reg.critical.map(x=>x.number),[104,133]);
 assert.match(reg.critical[0].finding,/December 19, 2023/);
 assert.match(reg.critical[1].finding,/not timestamped/);
 assert.equal(next.items.find(x=>x.number===104).review,'CORRECTION_REQUIRED');
 assert.equal(next.items.find(x=>x.number===133).review,'CORRECTION_REQUIRED');
 assert.equal(prev.rows.every(x=>x.independentPublicationApproved===false),true);
});
