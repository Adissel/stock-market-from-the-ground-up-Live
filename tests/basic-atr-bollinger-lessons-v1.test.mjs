import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),math=require('../assets/js/learning-indicators-v1.js');
const bridge=JSON.parse(readFileSync('data/lab-teaching-bridges-v014168.json','utf8')).entries;
test('canonical ATR and Bollinger lessons bind only to their real topics',()=>{
 assert.equal(math.select({labId:'DT-C19-L03',topic:bridge['DT-C19-L03'].title}),'atr');
 assert.equal(math.select({labId:'F3-C07-L04',topic:bridge['F3-C07-L04'].title}),'bollinger');
 assert.equal(math.select({labId:'DT-C19-L03',topic:bridge['F3-C07-L04'].title}),null);
 assert.equal(math.select({labId:'F3-C07-L04',topic:bridge['DT-C19-L03'].title}),null);
});
test('both lessons preserve authored curriculum and add complete indicator-workbench boundaries',()=>{
 for(const [id,study] of [['DT-C19-L03','atr'],['F3-C07-L04','bollinger']]){
  const row=bridge[id];assert.equal(row.indicatorLesson.studyId,study);assert.match(row.indicatorLesson.mappingStatus,/EDITORIAL_REVIEW_PENDING/);
  assert.equal(row.indicatorLesson.historicalData,false);assert.equal(row.indicatorLesson.officialGrade,false);
  const lesson=math.definitions[study];assert.match(lesson.workedPrompt,/Fictional/i);assert.match(lesson.transferPrompt,/NEW fictional/i);
  assert(lesson.intro.length>60);assert(lesson.limitation.length>80);assert.equal(lesson.units,'USD/share');
  assert(row.tabs.understand.length>=3);assert(row.tabs.apply.length>=3);assert(row.tabs.mistake.length>=3);
  assert.equal(row.transfer.graded,false);assert.equal(row.transfer.noLookahead,true);assert.equal(row.transfer.requiresNewEvidence,true);
 }
});
test('independent ATR and Bollinger cases retain declared conventions and finite outputs',()=>{
 const a=math.atr([{h:21,l:19,c:20},{h:23,l:20,c:22},{h:24,l:21,c:23},{h:25,l:22,c:24}],3);
 assert.deepEqual(a.tr,[2,3,3,3]);assert(Math.abs(a.history[2]-8/3)<1e-10);assert(Math.abs(a.history[3]-25/9)<1e-10);
 const b=math.bollinger([30,30,33],3,2);assert.equal(b.values[0],31);assert(Math.abs(b.values[1]-Math.sqrt(2))<1e-10);
 assert(Math.abs(b.values[2]-(31+2*Math.sqrt(2)))<1e-10);
});
