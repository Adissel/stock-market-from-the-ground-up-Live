import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const adaptive=require('../assets/js/learning-adaptive-diagnostic-v1.js');
const read=p=>readFileSync(p,'utf8');
const lab={concept:'VWAP reclaim',goal:'Use completed-bar evidence',teaching:{
 what:'VWAP weights eligible prices by volume over the specified session.',
 why:'Volume weighting differs from a simple average.',
 when:'Use only completed observations at the decision cutoff.',
 workedExample:'A fictional illustration multiplies each representative price by volume and divides by total volume.',
 transfer:'Try an independent fictional completed-bar sequence with no future bars.'}};
test('Four different prerequisite diagnostics are noncharging and ungraded',()=>{
 assert.equal(adaptive.skills.length,4);
 const results=adaptive.skills.map(need=>adaptive.diagnose({lab,need,confidence:'learning'}));
 assert.equal(new Set(results.map(x=>x.prerequisite)).size,4);
 for(const plan of results){
  assert.equal(plan.subject,'VWAP reclaim');
  assert.equal(plan.masteryAwarded,false);
  assert.equal(plan.officialGrade,false);
  assert.equal(plan.entitlementGranted,false);
  assert.equal(plan.memberRecordWritten,false);
  assert.equal(plan.paidInference,false);
  assert.match(plan.caution,/ungraded/i);
 }
 assert.match(results.find(x=>x.need==='calculation').sourceExcerpt,/fictional/i);
});
test('Missing subject-specific arithmetic is disclosed, not invented',()=>{
 const plan=adaptive.diagnose({lab:{concept:'Evidence',teaching:{what:'Read completed candles.'}},need:'calculation',confidence:'independent'});
 assert.match(plan.sourceExcerpt,/No verified numerical worked example/);
 assert.equal(adaptive.diagnose({lab,need:'assessment'}),null);
});
test('Authorized Lab access is checked before rendering, blind and assessment remain hidden',()=>{
 const source=read('assets/js/lab-player.js');
 assert(source.indexOf('if(!allowed){',source.indexOf('function renderPlayer()'))<source.indexOf('GroundUpLearningAdaptiveV1?.mount?.'));
 assert.match(source,/if\(!blind\)\{const diagnostic=/);
 assert.match(source,/id="gu-adaptive-teaching-slot".*hidden/);
 assert.match(read('lab-player.html'),/learning-adaptive-diagnostic-v1\.js/);
 assert.match(read('lab-player.html'),/learning-adaptive-diagnostic-v1\.css/);
});
test('Formative Learning Engine never calls network, storage, official grader or AI',()=>{
 const source=read('assets/js/learning-adaptive-diagnostic-v1.js');
 for(const pattern of [/fetch\(/,/localStorage/,/sessionStorage/,/supabase/i,/stripe/i,/masteryAwarded:true/,/document\.write\(/]){
  assert(!pattern.test(source),'Unsafe operation: '+pattern);
 }
});
test('Adaptive diagnostic works for every registered Lab, not just first 20',()=>{
 const data=JSON.parse(read('data/competency-lab-paths-v01499.json'));
 assert.equal(Object.keys(data.byLab).length,419);
 for(const [id,topic] of Object.entries(data.byLab)){
  const plan=adaptive.diagnose({lab:{concept:topic?.concept||topic?.title||id,goal:'Read authorized lesson'},need:'evidence'});
  assert(plan);assert.equal(plan.officialGrade,false);
 }
});
