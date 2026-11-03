import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateFeatureLedger} from '../scripts/qa/learning-lab-engine-feature-audit-v1.mjs';
const read=p=>readFileSync(p,'utf8');
const audit=JSON.parse(read('data/learning-lab-engine-feature-audit-v1.json'));
test('Enterprise research stage work advances only the visible Lab source; Learning remains a non-member source prototype',()=>{
 const rows=validateFeatureLedger(audit);
 assert.equal(rows.learning_ENTERPRISE.length,8);
 assert.equal(rows.lab_ENTERPRISE.length,8);
 assert.equal(rows.learning_ENTERPRISE.find(x=>x.id==='LE-ENT-05').source_status,'prototype');
 assert.equal(rows.lab_ENTERPRISE.find(x=>x.id==='LA-ENT-04').source_status,'partial');
 assert.equal(rows.lab_ENTERPRISE.filter(x=>x.source_status==='partial').length,1);
 assert.equal(rows.learning_ENTERPRISE.filter(x=>x.source_status==='integrated').length,0);
 assert.equal(rows.lab_ENTERPRISE.filter(x=>x.source_status==='integrated').length,0);
 assert.equal(rows.learning_BASIC.filter(x=>x.source_status==='integrated').length,8);
 assert.equal(rows.lab_BASIC.filter(x=>x.source_status==='integrated').length,8);
 for(const x of [...rows.learning_ENTERPRISE,...rows.lab_ENTERPRISE]){
  assert.equal(x.real_member_accepted,false);
  assert.equal(x.independent_release_accepted,false);
 }
 assert.equal(audit.frozen.labIds,419);
 assert.equal(audit.frozen.competencies,30);
 assert.equal(audit.frozen.premiumFeaturesReleased,false);
});
test('Enterprise preview requires independent server authorizations and scrubbed member UI; never grade or assert licensed feeds',()=>{
 const api=read('functions/api/learning-lab-enterprise-journey.js');
 const ui=read('assets/js/learning-lab-edition-panel-v1.js');
 const curriculum=read('functions/_lib/learning-lab-enterprise-journey-v1.js');
 assert.match(api,/authorizeEditionRequest/);
 assert.match(api,/toolAccess/);
 assert.match(api,/publishedLabs\(env\)/);
 assert.match(api,/memberRecordsModified:false/);
 assert.match(ui,/Enterprise cross-course research stages/);
 assert.match(ui,/matchingBookEntitlementStillRequired/);
 assert.match(ui,/serial!==epoch\|\|!alive\(\)/);
 assert.match(curriculum,/marketDataLicensed:false/);
 assert.match(curriculum,/matchingBookEntitlementStillRequired:true/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|payment_intent|officialGrade:true|masteryAwarded:true/);
});
