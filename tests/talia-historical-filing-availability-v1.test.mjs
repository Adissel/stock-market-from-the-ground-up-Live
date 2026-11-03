import test from 'node:test';
import assert from 'node:assert/strict';
import {draftHistoricalFilingVisibility as check} from '../functions/_lib/talia-historical-filing-availability-v1.js';
const verified={periodEnd:100,edgarAcceptedAt:200,firstObservedPublicAt:203,asOf:203,verifiedServerEvidence:true};
test('EDGAR acceptance cannot be used as proof of first public availability',()=>{
 for(const asOf of [100,199,200,201,202]){
  const result=check({...verified,asOf});
  assert.equal(result.visible,false);
  assert.equal(result.hasFutureInformation,false);
  assert.equal(result.officialGrade,false);
 }
 const permitted=check(verified);
 assert.equal(permitted.visible,true);
 assert.equal(permitted.status,'source_prototype_not_released');
 assert.equal(permitted.premiumEntitlementGranted,false);
});
test('historical filing guard rejects unverified provenance and impossible timestamps',()=>{
 assert.equal(check({...verified,verifiedServerEvidence:false}).visible,false);
 assert.equal(check({...verified,periodEnd:300}).visible,false);
 assert.equal(check({...verified,firstObservedPublicAt:199}).visible,false);
 assert.equal(check({...verified,asOf:'203'}).visible,false);
 assert.equal(check({...verified,asOf:100.1}).visible,false);
 assert.equal(check({}).visible,false);
});
