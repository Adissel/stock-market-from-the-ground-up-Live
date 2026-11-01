import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const diagnostic=require('../assets/js/learning-evidence-diagnostic-v1.js');
const read=p=>readFileSync(p,'utf8');
const candle={labId:'F2-C07-L01',mode:'guided',stage:'practice',provenance:'fictional_authored',kind:'candle',
 caseCode:'canonical_candle_body_pct',expected:50,units:'%',sourceSteps:['Body is |Close - Open|; range is High - Low.'],topic:'Candlestick body'};
const vwap={labId:'F3-C06-L01',mode:'practice',stage:'practice',provenance:'fictional_authored',kind:'vwap',
 caseCode:'canonical_vwap_trade_groups',expected:2600/300,units:'USD/share',sourceSteps:['Multiply each price by share volume, sum and divide by all shares.']};
test('detects three independently verifiable misconceptions per authored numerical case',()=>{
 for(const [base,patterns] of [[candle,[[1,'body_amount_not_percentage'],[.5,'decimal_ratio_not_percentage'],[2,'full_range_not_body_share']]],
  [vwap,[[9,'unweighted_average'],[2600,'dollar_notional_not_vwap'],[300,'volume_not_price']]]]){
  for(const [submitted,code] of patterns){const r=diagnostic.evaluate({...base,submitted});
   assert.equal(r.status,'verified_misconception');assert.equal(r.code,code);
   assert.equal(r.verifiedCause,true);assert(r.prerequisite.length>45);assert(r.correction.length>45);
   assert.equal(r.officialGrade,false);assert.equal(r.masteryAwarded,false);
   assert.equal(r.sourceType,'fictional_authored');assert.match(r.sourceExcerpt,/shares|range/i);
   assert.match(r.followUp.prompt,/FICTIONAL/);assert.notEqual(r.followUp.id,'');
  }
 }
});
test('unknown numeric error is detected but cause remains unverified',()=>{
 const r=diagnostic.evaluate({...vwap,submitted:4.71});
 assert.equal(r.status,'unclassified_incorrect_result');assert.equal(r.code,'unknown_cause');assert.equal(r.verifiedCause,false);
 const other=diagnostic.evaluate({...vwap,caseCode:'unrecognized_case',submitted:9});
 assert.equal(other.status,'unclassified_incorrect_result');assert.equal(other.verifiedCause,false);
});
test('correct result never awards official mastery or a credential',()=>{
 for(const [base,submitted] of [[candle,50],[vwap,8.67]]){
  const r=diagnostic.evaluate({...base,submitted});
  assert.equal(r.status,'method_correct');assert.equal(r.officialGrade,false);
  assert.equal(r.memberRecordWritten,false);assert.equal(r.entitlementGranted,false);assert.equal(r.paidInference,false);
 }
});
test('future data, unverified source, blind assessment and malformed submissions fail closed',()=>{
 for(const variant of [{...vwap,mode:'assessment'},{...vwap,mode:'blind'},{...vwap,provenance:'historical_unverified'},
  {...vwap,provenance:'market_live'},{...vwap,stage:'transfer'},{...vwap,submitted:'Infinity'},{...vwap,submitted:'abc'},
  {...vwap,submitted:' '},{...vwap,expected:Infinity},{...vwap,kind:'unknown'}]){
  const x=diagnostic.evaluate({...variant,submitted:variant.submitted??9});
  assert.equal(x.status,'insufficient_evidence');assert.equal(x.officialGrade,false);
 }
});
test('independent follow-up is a different synthetic calculation with explicit source',()=>{
 for(const base of [candle,vwap]){
  const r=diagnostic.evaluate({...base,submitted:base.kind==='candle'?1:9});
  assert.equal(r.followUp.source,'fictional_constructed_no_feed');
  assert.notEqual(r.followUp.id,'');
  const miss=diagnostic.checkFollowUp({id:r.followUp.id,submitted:-999});
  assert.equal(miss.accepted,true);assert.equal(miss.correct,false);
  assert.equal(miss.masteryAwarded,false);
 }
 assert.equal(diagnostic.caseIds.length,4);
});
test('original 419 Lab IDs remain unaffected and no persistence or AI paths were added',()=>{
 const paths=JSON.parse(read('data/competency-lab-paths-v01499.json'));
 assert.equal(Object.keys(paths.byLab).length,419);
 const raw=read('assets/js/learning-evidence-diagnostic-v1.js');
 for(const re of [/fetch\s*\(/,/localStorage/,/sessionStorage/,/supabase/i,/stripe/i,/privateRubric/,/answer_key/,/document\.write/]){
  assert(!re.test(raw),'No grading, paid, storage, raw source fetch or private rubric: '+re);
 }
});

test('Learning/Lab integration receives only already-authored fictional practice evidence',()=>{
 const engine=read('assets/js/lab-engine-v32-universal.js');
 const html=read('lab-player.html');
 assert.match(html,/learning-evidence-diagnostic-v1\.js/);
 assert(html.indexOf('learning-evidence-diagnostic-v1.js')<html.indexOf('lab-engine-v32-universal.js'));
 assert.match(engine,/GroundUpLearningEvidenceV1/);
 assert.match(engine,/sourceSteps:special\.steps/);
 assert.match(engine,/provenance:'fictional_authored'/);
 assert.match(engine,/stage:'practice'/);
 assert.match(engine,/renderEvidenceDiagnosis\(body\)/);
 assert.match(engine,/caseCode='authored_subquestion'/);
 assert.match(engine,/api\.checkFollowUp/);
});

test('Verified errors suggest only existing 30 canonical guides and never declare an official failure',()=>{
 const source=JSON.parse(read('data/competency-study-guides-v01499.json'));
 assert.equal(source.guides.length,30);
 const guides=new Map(source.guides.map(g=>[g.code,g]));
 for(const [base,answer] of [[candle,1],[vwap,9]]){
  const diagnosis=diagnostic.evaluate({...base,submitted:answer});
  const plan=diagnostic.recommendPrerequisites({diagnosis,guides});
  assert.equal(plan.source,'verified_formative_misconception');
  assert(plan.items.length>0);
  for(const item of plan.items){assert.equal(item.title,guides.get(item.code).title);
   assert.match(item.status,/unavailable/);assert.match(item.note,/not an official failed assessment/);
   assert(item.url.startsWith('skills.html#guide-'));}
  assert.equal(plan.officialGrade,false);assert.equal(plan.memberProgressModified,false);
 }
});
test('Authenticated assessment status is distinct from fictional practice and absent evidence',()=>{
 const guides=JSON.parse(read('data/competency-study-guides-v01499.json')).guides;
 const diagnosis=diagnostic.evaluate({...vwap,submitted:9});
 const evidence={ok:true,skills:[
  {code:'VWAP_CONTEXT',status:'Proficient',completeAssessments:2,independentAssessments:1},
  {code:'VOLUME_ANALYSIS',status:'Proficient',completeAssessments:0,independentAssessments:0}
 ]};
 const plan=diagnostic.recommendPrerequisites({diagnosis,guides,evidence});
 assert.equal(plan.items.find(x=>x.code==='VWAP_CONTEXT').status,'Proficient');
 assert.equal(plan.items.find(x=>x.code==='VOLUME_ANALYSIS').status,'Not Yet Assessed');
 const untrusted=diagnostic.recommendPrerequisites({diagnosis,guides,evidence:{ok:false,skills:evidence.skills}});
 assert(untrusted.items.every(x=>x.status.includes('unavailable')));
 for(const submitted of [2600/300,4.71]){
  const noDiagnosis=diagnostic.evaluate({...vwap,submitted});
  assert.equal(diagnostic.recommendPrerequisites({diagnosis:noDiagnosis,guides}).items.length,0);
 }
});
test('Lab Engine routes diagnoses through current competency catalog and protected summary',()=>{
 const engine=read('assets/js/lab-engine-v32-universal.js');
 assert.match(engine,/recommendPrerequisites\?\.\(\{diagnosis:r,guides:map\.guides,evidence:skillEvidence\}\)/);
 assert.match(engine,/neededPrerequisites\.length\|\|special/);
 assert.match(engine,/lastEvidenceDiagnosis&&stage===4/);
});
