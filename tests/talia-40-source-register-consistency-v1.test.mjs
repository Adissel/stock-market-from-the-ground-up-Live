// 40 Foundation primary-source claims: normalize the two existing registers without
// promoting a source triage, a regulatory rule, or any lesson to publication acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=p=>JSON.parse(readFileSync('data/'+p,'utf8'));
const register=load('talia-claims-101-140-evidence-batch-v1.json');
const reviews=load('talia-claims-remaining21-source-review-v1.json');
const regulatory=load('talia-claim-regulatory-risk-104-133-v1.json');
const six=load('talia-foundation-explanations-batch06-v1.json').guides;
const seven=load('talia-foundation-explanations-batch07-v1.json').guides;
const guides=[...six,...seven];
test('all 40 numbered primary source claims have a reviewed disposition but zero publication signoffs',()=>{
 assert.equal(register.rows.length,40);
 assert.deepEqual(register.rows.map(r=>r.number),Array.from({length:40},(_,i)=>i+101));
 assert.equal(register.rows.filter(r=>r.sourceStatus==='CANONICAL_URL_AND_CONCEPT_MAPPED').length,0);
 assert.equal(register.rows.filter(r=>r.sourceStatus==='CLAIM_SCOPE_DISPOSITION_REVIEWED_2026_11_01').length,12);
 assert.equal(register.rows.filter(r=>r.independentPublicationApproved===true).length,0);
 assert.equal(guides.length,40);
 for(let i=0;i<40;i++){
  const row=register.rows[i],lesson=guides[i];
  assert.equal(lesson.code,row.code,'lesson and claim code mismatch '+row.number);
  assert.equal(lesson.sourceUrls[0],row.source,'lesson and claim source mismatch '+row.number);
  assert.equal(lesson.independentEditorialApproved,false,'unreviewed lesson wrongly released '+row.number);
 }
});
test('earlier independent 21-row source register remains intact and regulation risks remain held',()=>{
 assert.equal(reviews.items.length,21);
 for(const r of reviews.items){
  const item=register.rows.find(x=>x.number===r.number);
  assert.ok(item,'previous source review lost '+r.number);
  assert.equal(item.code,r.code);
  assert.equal(r.independentPublicationAccepted,false);
 }
 assert.deepEqual(regulatory.critical.map(x=>x.number),[104,133]);
 assert.match(regulatory.critical[0].finding,/December 19, 2023/);
 assert.match(regulatory.critical[1].finding,/not timestamped/);
 const repurchase=reviews.items.find(x=>x.number===104);
 assert.equal(repurchase.review,'CORRECTION_REQUIRED');
 assert.match(repurchase.source,/s7-21-21/);
 assert.equal(register.rows.find(x=>x.number===104).independentPublicationApproved,false);
 assert.equal(register.rows.find(x=>x.number===133).independentPublicationApproved,false);
});
test('newly dispositioned primary pages specify supported or held scope, not release rights',()=>{
 const changed=register.rows.filter(r=>r.sourceStatus==='CLAIM_SCOPE_DISPOSITION_REVIEWED_2026_11_01');
 assert.equal(changed.length,12);
 assert.equal(changed.filter(r=>r.internalScopeVerification.decision.startsWith('SOURCE_SCOPE_SUPPORTED')).length,6);
 assert.equal(changed.filter(r=>r.internalScopeVerification.decision.startsWith('HOLD_')).length,6);
 for(const r of changed){
  assert.ok(r.sourceFactScope.length>=90,r.code);
  assert.match(r.source,/^https:\/\//);
  assert.equal(r.internalScopeVerification.independentPublicationAccepted,false);
  assert.equal(r.internalScopeVerification.formulaAndNumericReleaseAccepted,false);
 }
});
