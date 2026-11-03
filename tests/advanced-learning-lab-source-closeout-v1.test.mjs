import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ledger=JSON.parse(readFileSync('data/learning-lab-engine-feature-audit-v1.json','utf8'));
const advanced=ledger.features.filter(x=>x.edition==='ADVANCED');

test('Advanced Learning and Lab have seven functional source requirements and one independent release gate each',()=>{
 for(const engine of ['learning','lab']){
  const rows=advanced.filter(x=>x.engine===engine);
  assert.equal(rows.length,8);
  assert.equal(rows.filter(x=>x.source_status==='partial').length,7);
  assert.equal(rows.filter(x=>x.source_status==='not_implemented').length,1);
  assert.equal(rows.find(x=>x.id.endsWith('-08')).source_status,'not_implemented');
  assert.equal(rows.some(x=>x.source_status==='integrated'),false);
  for(const row of rows){assert.equal(row.real_member_accepted,false,row.id);assert.equal(row.independent_release_accepted,false,row.id)}
 }
});

test('Advanced release remains fail-closed while source functionality is testable',()=>{
 const policy=readFileSync('functions/_lib/learning-engine-tier-policy-v1.js','utf8');
 const endpoint=readFileSync('functions/api/learning-lab-edition-exercise.js','utf8');
 assert.match(policy,/premiumFeaturesReleased:false/);
 assert.match(policy,/addOnCheckoutEnabled:false/);
 assert.match(endpoint,/ENGINE_'\+family\.toUpperCase\(\)\+'_'\+edition\+'_RELEASED/);
 assert.match(endpoint,/user_id=eq\.'\+encode\(memberId\)/);
 assert.match(endpoint,/mapping_individually_reviewed/);
});

test('Advanced member surface retains accessibility, no-lookahead and protected-grade boundaries',()=>{
 const panel=readFileSync('assets/js/learning-lab-edition-panel-v1.js','utf8');
 const exercise=readFileSync('functions/_lib/learning-lab-edition-exercises-v1.js','utf8');
 assert.match(panel,/Completed fictional observations used by the server/);
 assert.match(panel,/aria-live/);
 assert.match(panel,/e\.connect\(activeCharts\)/);
 assert.match(exercise,/futureBarsIncluded:false/);
 assert.match(exercise,/graded:false,masteryAwarded:false/);
 assert.doesNotMatch(panel,/correctAnswer|privateAnswerKey|officialGrade:true/);
});
