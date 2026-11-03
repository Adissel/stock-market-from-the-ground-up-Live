import test from 'node:test';
import assert from 'node:assert/strict';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {buildEnterpriseResearchJourney,JOURNEY_SCHEMA}
 from '../functions/_lib/learning-lab-enterprise-journey-v1.js';
const auth=family=>({ok:true,edition:'ENTERPRISE',family});
test('Seven source-stable research stages map only to existing 274 Academy days',()=>{
 assert.equal(academyPrograms.length,10);
 assert.equal(academyPrograms.reduce((n,p)=>n+p.curriculum.length,0),274);
 const r=buildEnterpriseResearchJourney({authorization:auth('learning'),
  family:'learning',trainingAuthorized:true,labAuthorized:false});
 assert.equal(r.schema,JOURNEY_SCHEMA);assert.equal(r.stages.length,7);
 assert.equal(new Set(r.stages.map(s=>s.programCode)).size,7);
 for(const s of r.stages){
  const p=academyPrograms.find(p=>p.code===s.programCode);
  assert.equal(s.dayTitle,p.curriculum[s.day-1].title);
  assert.equal(s.trainingLocked,false);assert(s.trainingHref.startsWith('bootcamp'));
  assert.equal(s.optionalPublishedLabs.length,0);assert.equal(s.officialGrade,false);
  assert(!Object.hasOwn(s,'lesson'));assert(!Object.hasOwn(s,'answerKey'));
 }
 assert.equal(r.graded,false);assert.equal(r.masteryAwarded,false);
});
test('Independent training and Lab product rights cannot be inferred from a research tier',()=>{
 const r=buildEnterpriseResearchJourney({authorization:auth('lab'),
  family:'lab',labAuthorized:true,trainingAuthorized:false});
 assert.equal(r.stages.length,7);
 assert(r.stages.every(s=>s.trainingHref===null&&s.trainingLocked));
 assert.equal(r.bookLinksAreNotEntitlements,true);
 const n=buildEnterpriseResearchJourney({authorization:auth('learning'),
  family:'learning',trainingAuthorized:true,labAuthorized:false});
 assert(n.stages.every(s=>s.optionalPublishedLabs.length===0));
});
test('Malformed grants and forged published Lab identities fail closed',()=>{
 for(const authorization of [{ok:false,edition:'ENTERPRISE',family:'lab'},
  {ok:true,edition:'PROFESSIONAL',family:'lab'},
  {ok:true,edition:'ENTERPRISE',family:'learning'}]){
  assert.equal(buildEnterpriseResearchJourney({authorization,family:'lab'}),null);
 }
 for(const labs of [[{lab_id:'NOT_REAL',active:true,registry_visible:true}],
  [{lab_id:'F1-C01-L01',active:false,registry_visible:true}],
  [{lab_id:'F1-C01-L01',active:true,registry_visible:true},
   {lab_id:'F1-C01-L01',active:true,registry_visible:true}]]){
  assert.equal(buildEnterpriseResearchJourney({authorization:auth('lab'),
   family:'lab',publishedLabs:labs}),null);
 }
});
