import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const load=p=>JSON.parse(read(p));
const baseline=load('data/tutor-guided-practice-v1.json');
const extra=load('data/tutor-guided-practice-expansion-v1.json');
const authored=load('data/tutor-indicator-expansion-v1.json');
const registry=load('data/tutor-indicator-study-v1.json');
test('Additional 12 indicator guided practices reuse nine stages without altering frozen 134',()=>{
 assert.equal(baseline.modules.length,134);assert.equal(baseline.indicatorCount,61);
 assert.equal(registry.guides.length,61);assert.equal(authored.guides.length,12);
 assert.equal(extra.kind,'talia_guided_practice_extension_ungraded_v1');
 assert.equal(extra.originalGuidedModuleCountPreserved,134);
 assert.equal(extra.originalIndicatorCountPreserved,61);
 assert.equal(extra.indicatorCount,12);
 assert.equal(extra.numericIndicatorCountAdded,0);
 assert.equal(extra.interpretationOnlyIndicatorCountAdded,12);
 assert.deepEqual(extra.stages,baseline.stages);
 const all=[...baseline.modules,...extra.modules];
 assert.equal(all.length,146);assert.equal(all.filter(x=>x.kind==='indicator').length,73);
 assert.equal(new Set(all.map(x=>x.id)).size,146);
 const codes=new Set(authored.guides.map(x=>x.code));
 assert.equal(codes.size,12);
 assert.equal(new Set(extra.modules.map(x=>x.guideCode)).size,12);
 for(const [i,m] of extra.modules.entries()){
  const guide=authored.guides.find(g=>g.code===m.guideCode);
  assert.ok(guide,'Published additional source-backed guide '+m.guideCode);
  assert.equal(m.id,'IND-'+String(i+62).padStart(2,'0'));
  assert.equal(m.title,guide.title);
  assert.equal(m.metric,'study-concept','Do not pretend the specialization is numerically computed');
  assert.match(m.scope,/interpretation-only/);
  assert.match(m.sourceStatus,/pending_individual_editorial_acceptance/);
  assert.equal(m.sourceUrl,guide.sourceUrls[0]);
  assert.equal(m.formulaOrRule,guide.formula);
  for(const field of ['learn','method','limitation','question','feedback','transferQuestion','transferFeedback']){
   assert.ok(typeof m[field]==='string'&&m[field].length>30,m.guideCode+' '+field);
  }
  assert.equal(m.options.length,3);
  assert.equal(m.transferOptions.length,3);
  assert.equal(m.choiceFeedback.length,3);
  assert.equal(m.transferFeedbackByChoice.length,3);
  assert.ok(m.correct>=0&&m.correct<3&&m.transferCorrect>=0&&m.transferCorrect<3);
  assert.equal(m.choiceFeedback[m.correct],null);
  assert.equal(m.transferFeedbackByChoice[m.transferCorrect],null);
  assert.notEqual(m.question,m.transferQuestion,'Fresh independent transfer question required');
 }
});
test('Existing UI displays 146-module catalog with fail-safe optional extension and no new entitlement/grade writes',()=>{
 const script=read('assets/js/tutor-guided-practice-v1.js');
 assert.match(script,/tutor-guided-practice-expansion-v1\.json/);
 assert.match(script,/state\.units=available/);
 assert.match(script,/lessonFor\(requested,available\)/);
 assert.match(script,/available=\[\.\.\.units,\.\.\.extras\]/);
 assert.match(script,/m\.metric!=='study-concept'/);
 assert.match(script,/originalGuidedModuleCountPreserved!==134/);
 assert.doesNotMatch(script,/POST\s*\(/);
 const build=read('scripts/build-pages.sh');
 assert.match(build,/tutor-guided-practice-expansion-v1\.json/);
});
