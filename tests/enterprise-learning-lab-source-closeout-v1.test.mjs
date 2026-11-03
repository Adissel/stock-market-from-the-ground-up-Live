import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateFeatureLedger} from '../scripts/qa/learning-lab-engine-feature-audit-v1.mjs';
const read=p=>readFileSync(p,'utf8');
const audit=JSON.parse(read('data/learning-lab-engine-feature-audit-v1.json'));
test('Enterprise research stage work advances only member-gated source candidates, without independent release',()=>{
 const rows=validateFeatureLedger(audit);
 assert.equal(rows.learning_ENTERPRISE.length,8);
 assert.equal(rows.lab_ENTERPRISE.length,8);
 assert.equal(rows.learning_ENTERPRISE.find(x=>x.id==='LE-ENT-05').source_status,'partial');
 assert.equal(rows.lab_ENTERPRISE.find(x=>x.id==='LA-ENT-04').source_status,'partial');
 assert.equal(rows.lab_ENTERPRISE.filter(x=>x.source_status==='partial').length,2);
 assert.equal(rows.lab_ENTERPRISE.find(x=>x.id==='LA-ENT-05').source_status,'partial');
 assert.equal(rows.learning_ENTERPRISE.filter(x=>x.source_status==='partial').length,1);
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

test('Academy Enterprise Learning UI requires an authenticated member and scrubs on account change without breaking Basic',()=>{
 const html=read('bootcamp-academy.html'),academy=read('assets/js/bootcamp-academy-v014168.js');
 const supplement=read('assets/js/academy-enterprise-journey-v1.js');
 assert.match(html,/id="academy-enterprise-research"[^>]*hidden/);
 assert.match(html,/academy-enterprise-journey-v1\.js/);
 assert.match(academy,/CrownlightAcademyEnterpriseResearchV1\?\.scrub/);
 assert.match(academy,/CrownlightAcademyEnterpriseResearchV1\?\.mount/);
 assert.match(supplement,/family=learning/);
 assert.match(supplement,/getSession/);
 assert.match(supplement,/session\?\.user\?\.id!==userId/);
 assert.match(supplement,/!current\(\)/);
 assert.doesNotMatch(supplement,/localStorage|sessionStorage|payment_intent|officialGrade:true|masteryAwarded:true/);
});

test('Enterprise Lab comparison remains read-only, member granted and held-out values undisclosed',()=>{
 const ui=read('assets/js/learning-lab-edition-panel-v1.js');
 const api=read('functions/api/learning-lab-enterprise-case-workbench.js');
 const math=read('functions/_lib/learning-lab-enterprise-case-workbench-v1.js');
 assert.match(ui,/Compare two original fictional cases/);
 assert.match(ui,/holdoutValuesReturned!==false/);
 assert.match(api,/authorizeEditionRequest/);
 assert.match(api,/edition:'ENTERPRISE'/);
 assert.match(math,/chronologicalHoldout/);
 assert.match(math,/summarizeFictionalOutcomes/);
 assert.match(math,/holdoutValuesReturned:false/);
 assert.doesNotMatch(ui+api+math,/officialGrade:true|masteryAwarded:true|orders.insert|payment_intent/);
});

test('Independent Academy assessment courses conceal optional Enterprise research even when a grant exists',()=>{
 const ui=read('assets/js/academy-enterprise-journey-v1.js');
 const academy=read('assets/js/bootcamp-academy-v014168.js');
 assert.match(ui,/academy-official-assessment/);
 assert.match(ui,/protectedAssessment\?\.hidden===false/);
 assert.match(ui,/protectedAssessment\?\.hidden!==false/);
 assert.match(academy,/\['tape10','indicators10','filings7'\]\.includes\(code\)/);
});
