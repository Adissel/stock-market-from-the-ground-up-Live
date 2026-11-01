import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const x=require('../assets/js/learning-quant-studies-v1.js'),read=p=>readFileSync(p,'utf8');
test('EMA uses explicit SMA-seed, no early bars, no platform identity claim',()=>{
 const e=x.calculate('ema',{closes:[10,12,14,16],period:3});
 assert.deepEqual(e.values,[12,.5,14]);assert.deepEqual(e.history,[null,null,12,14]);
 assert.match(e.initialization,/SMA seed/);assert.equal(x.calculate('ema',{closes:[10,12,14],period:3}),null);
 assert.equal(x.calculate('ema',{closes:[10,12,NaN,16],period:3}),null);
 assert.equal(x.calculate('ema',{closes:[10,12,14,16],period:0}),null);
});
test('Risk and position sizing honor stop-distance, whole-share floor and purchasing power',()=>{
 assert.deepEqual(x.calculate('risk',{entry:42,stop:40.5}).values,[42,40.5,1.5]);
 const v=x.calculate('sizing',{entry:42,stop:40.5,riskBudget:150,availableCash:3000});
 assert.deepEqual(v.values,[100,71,71]);assert.equal(v.nominalRisk,106.5);
 assert.equal(x.calculate('risk',{entry:42,stop:42}),null);
 assert.equal(x.calculate('sizing',{entry:42,stop:42,riskBudget:150,availableCash:3000}),null);
});
test('Select only canonical study competency and matching topic, never generic Lab rights',()=>{
 assert.equal(x.select({competencies:['EMA_CONTEXT'],primaryCode:'EMA_CONTEXT',topic:'EMA 9 and trend'}),'ema');
 assert.equal(x.select({competencies:['RISK_PER_SHARE'],primaryCode:'RISK_PER_SHARE',topic:'Risk per share'}),'risk');
 assert.equal(x.select({competencies:['POSITION_SIZING'],primaryCode:'POSITION_SIZING',topic:'Position sizing'}),'sizing');
 assert.equal(x.select({competencies:['VWAP_CONTEXT'],primaryCode:'VWAP_CONTEXT',topic:'EMA 9'}),null);
 assert.equal(x.select({competencies:['EMA_CONTEXT'],primaryCode:'VWAP_CONTEXT',topic:'EMA 9'}),null);
});
test('Actual input checks step-specific errors without claiming cognition or mastery',()=>{
 for(const studyId of Object.keys(x.definitions)){
  const def=x.definitions[studyId],expected=x.calculate(studyId,def.initial).values;
  const good=x.assess({studyId,inputs:expected.map(String),mode:'guided',stage:'practice',provenance:'fictional_authored'});
  assert.equal(good.status,'method_steps_matched');assert.equal(good.officialGrade,false);
  assert.equal(good.memberRecordWritten,false);
  const wrong=x.assess({studyId,inputs:[String(expected[0]+1),...expected.slice(1).map(String)],mode:'practice',stage:'practice',provenance:'fictional_authored'});
  assert.equal(wrong.status,'observed_step_mismatch');assert.equal(wrong.verifiedCause,false);
  assert.equal(wrong.observations[0].matched,false);assert.equal(wrong.masteryAwarded,false);
 }
});
test('New independent EMA, risk, position numbers are different and ungraded',()=>{
 for(const [id,want] of [['ema',24],['risk',1.25],['sizing',35]]){
  assert.equal(x.calculate(id,x.definitions[id].transfer).values[2],want);
  const pass=x.checkTransfer({studyId:id,submitted:want,mode:'guided'});
  assert.equal(pass.correct,true);assert.equal(pass.officialGrade,false);assert.equal(pass.masteryAwarded,false);
  assert.equal(x.checkTransfer({studyId:id,submitted:'',mode:'practice'}).accepted,false);
 }
});
test('Blind/Assessment/market data injection and garbage numerical inputs rejected',()=>{
 for(const studyId of Object.keys(x.definitions)){
  const original=x.calculate(studyId,x.definitions[studyId].initial).values.map(String);
  const base={studyId,inputs:original,mode:'guided',stage:'practice',provenance:'fictional_authored'};
  for(const variant of [{mode:'assessment'},{mode:'blind'},{stage:'transfer'},{provenance:'historical_unverified'},
   {inputs:['Infinity',original[1],original[2]]},{inputs:['1e3',original[1],original[2]]}]){
   assert.equal(x.assess({...base,...variant}).status,'insufficient_evidence');
  }
 }
});
test('Real Lab engine integration respects approved skill match and private assessment guard',()=>{
 const engine=read('assets/js/lab-engine-v32-universal.js'),html=read('lab-player.html');
 assert.match(engine,/GroundUpLearningQuantStudiesV1/);
 assert.match(engine,/renderQuantitativeStudy\(body\)/);
 assert.match(engine,/quantitativeStudyId/);
 assert(html.indexOf('learning-quant-studies-v1.js')<html.indexOf('lab-engine-v32-universal.js'));
 assert.match(html,/learning-quant-studies-ui-v1.js/);
 assert.match(read('assets/js/learning-quant-studies-v1.js'),/officialGrade:false/);
 for(const forbidden of [/fetch\s*\(/,/localStorage/,/supabase/i,/stripe/i,/answer_key/,/document\.write/]){
  assert(!forbidden.test(read('assets/js/learning-quant-studies-v1.js')));
 }
});

test('Source registry explicitly distinguishes research, independent verification and redistribution',()=>{
 const doc=JSON.parse(read('data/learning-engine-quant-source-registry-v1.json'));
 assert.equal(doc.cases.length,3);
 assert.deepEqual(doc.cases.map(x=>x.id),['ema','risk','sizing']);
 assert.match(doc.status,/INDEPENDENT_EDITORIAL_ACCEPTANCE/);
 assert.match(doc.globalMetadata.license,/REFERENCE_ONLY/);
 for(const entry of doc.cases){
  for(const key of ['definition','formula','units','inputs','initialization','warmup','workedExample','independent','chart','interpretation','commonMistake','verification']){
   assert.equal(typeof entry[key],'string');assert(entry[key].trim().length>=(key==='units'?1:12));
  }
  assert(entry.references.length>=2);
  assert(entry.references.every(x=>x.url.startsWith('https://')));
 }
 assert.match(doc.sourceUsePolicy.dataIngestion,/None/);
});
test('Whole-share sizing uses conservative floor even at sub-cent budget limits',()=>{
 const a=x.calculate('sizing',{entry:42,stop:40.5,riskBudget:149.99,availableCash:10000});
 assert.deepEqual(a.values,[99,238,99]);
 assert(a.nominalRisk<=149.99);
});
