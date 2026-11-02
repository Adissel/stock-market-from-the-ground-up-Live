// SMFGU Tutor: deployment must actually ship every member-teaching batch that the loader requests.
// Does not access live users, provider services, paid inference, or production data.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const build=readFileSync('scripts/build-pages.sh','utf8');
const loader=readFileSync('functions/_lib/original-competency-tutor-v014100.js','utf8');
const matches=[...loader.matchAll(/'talia-foundation-explanations-batch(\d{2})-v1\.json'/g)];
const required=[...new Set(matches.map(m=>'talia-foundation-explanations-batch'+m[1]+'-v1.json'))];
test('every Tutor-loaded Foundation batch exists and is included in both Cloudflare artifact-copy passes',()=>{
 assert.ok(required.length>=13,'current source includes at least 13 authored batches');
 const loopA=build.split('\n').find(line=>line.startsWith('for file in crownlight-sparks-'));
 const loopB=build.split('\n').find(line=>line.startsWith('for tutor_asset in talia-foundation-'));
 assert.ok(loopA&&loopB,'production artifact copy loops present');
 for(const name of required){
  assert.ok(existsSync('data/'+name),'missing original '+name);
  assert.ok(loopA.split(/\s+/).includes(name),'missing staged deployment asset: '+name);
  assert.ok(loopB.split(/\s+/).includes(name),'missing public Tutor asset: '+name);
 }
});
test('new Tutor source drafts stay ungraded and do not silently become published competencies',()=>{
 for(const name of required.slice(12)){
  const data=JSON.parse(readFileSync('data/'+name,'utf8'));
  assert.equal(data.guides.length,20);
  for(const lesson of data.guides){
   assert.equal(lesson.supplemental,true);
   assert.equal(lesson.foundationTopic,true);
   assert.equal(lesson.officialCompetency,false);
   assert.equal(lesson.independentEditorialApproved,false);
  }
 }
});
