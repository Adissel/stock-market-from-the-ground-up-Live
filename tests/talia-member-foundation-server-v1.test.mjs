import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Tutor has Foundation source-only access when Free eligible',()=>{
 const s=read('functions/api/market-tutor-v01492.js');
 assert.match(s,/!auth.authorized&&!auth.freeEligible/);
 assert.match(s,/foundation_source_only/);
 assert.match(s,/auth.authorized===true\?await paidLearningDraft/);
 assert.match(s,/tutorRequestLimit/);
 assert.match(s,/graded:false,masteryAwarded:false/);
});
test('Member-facing edition is server-resolved, unreleased profile does not turn on access',()=>{
 const s=read('functions/api/member-learning-engine-versions.js');
 const ui=read('assets/js/member-tutor-version-loader-v1.js');
 assert.match(s,/const effectiveEdition='FOUNDATION'/);
 assert.match(s,/premiumFeaturesAvailable:false/);
 assert.match(s,/FOUNDING_30:'ADVANCED'/);
 assert.match(s,/LIFETIME:'ENTERPRISE'/);
 assert.match(ui,/j.tutorEdition/);
 assert.match(read('market-tutor.html'),/id="tutor-membership-edition"/);
});
