import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const audit=JSON.parse(readFileSync('data/learning-lab-engine-feature-audit-v1.json','utf8'));
const rows=engine=>audit.features.filter(x=>x.engine===engine&&x.edition==='PROFESSIONAL');

test('Professional Learning and Lab have seven functional source requirements and one independent release gate each',()=>{
 for(const engine of ['learning','lab']){
  const set=rows(engine);assert.equal(set.length,8);
  assert.equal(set.filter(x=>x.source_status==='partial').length,7);
  assert.equal(set.filter(x=>x.source_status==='prototype').length,0);
  assert.equal(set.filter(x=>x.source_status==='not_implemented').length,1);
  assert.equal(set.find(x=>x.id.endsWith('-08')).source_status,'not_implemented');
  for(const row of set){assert.equal(row.real_member_accepted,false);assert.equal(row.independent_release_accepted,false)}
 }
});

test('Professional source covers completed-frame reasoning without releasing premium access or grades',()=>{
 const source=readFileSync('functions/_lib/learning-lab-edition-exercises-v1.js','utf8');
 const api=readFileSync('functions/api/learning-lab-edition-exercise.js','utf8');
 const ui=readFileSync('assets/js/learning-lab-edition-panel-v1.js','utf8');
 assert.match(source,/changeFromPrior/);assert.match(source,/uncertaintyEvidence/);
 assert.match(source,/remediation:freeze\(remediation\)/);assert.match(source,/noLookahead:true,graded:false,masteryAwarded:false/);
 assert.match(api,/const route=await reviewedRoute\(env,rights\.memberId\)/);
 assert.match(ui,/Completed timeframe decision evidence/);assert.match(ui,/What this evidence cannot establish/);
 assert.doesNotMatch(source+api+ui,/correctAnswer|officialGrade:true|masteryAwarded:true/);
});
