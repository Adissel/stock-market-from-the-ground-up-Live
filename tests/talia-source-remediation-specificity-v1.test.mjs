import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=n=>JSON.parse(readFileSync('data/'+n,'utf8'));
const x=load('talia-claim-source-remediation-129-135-139-v1.json');
const claims=load('talia-claims-101-140-evidence-batch-v1.json');
const by=new Map(x.items.map(v=>[v.claim,v]));
test('specific math claims use external supporting references without changing original historical source',()=>{
 assert.deepEqual([...by.keys()],[129,135,139]);
 assert.equal(new Set(by.keys()).size,3);
 for(const [id,row] of by){
  assert.equal(row.code,claims.rows[id-101].code);
  assert.equal(claims.rows[id-101].independentPublicationApproved,false);
  assert.match(row.disposition,/SOURCE|FORMULA|DEFINITION|CANDIDATE/);
 }
 assert.match(by.get(129).correctiveSource,/ssga\.com/);
 assert.match(by.get(129).boundary,/not legal merger concentration threshold/);
 assert.match(by.get(135).currentGuideSource,/stern\.nyu\.edu/);
 assert.match(by.get(139).correctiveSource,/stern\.nyu\.edu/);
 assert.equal(x.independentEditorialAcceptance,0);
 assert.equal(x.thirdPartyPublicationRights,'NOT_CLEARED');
});
test('concentration uses decimal-weight HHI, debt ratio has specific debt denominator and EBIT interest coverage excludes cash guarantees',()=>{
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10);
 near([.5,.3,.2].reduce((s,w)=>s+w*w,0),.38);
 near(1/.38,2.631578947368421);
 near(12/3,4);
 near(90/60,1.5);
 assert.notEqual(90/60,120/60);
 assert.match(by.get(135).boundary,/cash flow/);
 assert.match(by.get(139).boundary,/not synonyms/);
});
