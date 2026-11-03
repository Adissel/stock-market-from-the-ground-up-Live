import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyTutorFormativePractice,formatTutorFormativePractice} from '../functions/_lib/tutor-formative-practice-v1.js';
import {parseTutorRequest} from '../functions/_lib/tutor-request-boundary-v014147.js';

test('server recomputes authored candle and VWAP cases and recognizes six verified numerical causes',()=>{
 const cases=[
  ['canonical_candle_body_pct','1','body_amount_not_percentage'],
  ['canonical_candle_body_pct','.5','decimal_ratio_not_percentage'],
  ['canonical_candle_body_pct','2','full_range_not_body_share'],
  ['canonical_vwap_trade_groups','9','unweighted_average'],
  ['canonical_vwap_trade_groups','2600','dollar_notional_not_vwap'],
  ['canonical_vwap_trade_groups','300','volume_not_price']
 ];
 for(const [caseId,submitted,code] of cases){
  const result=verifyTutorFormativePractice({caseId,submitted,labId:'TALIA_CLASSROOM'},'review');
  assert.equal(result.status,'verified_misconception');assert.equal(result.code,code);assert.equal(result.verifiedCause,true);
  assert.equal(result.officialGrade,false);assert.equal(result.masteryAwarded,false);assert.equal(result.memberRecordWritten,false);
  assert.match(formatTutorFormativePractice(result),/Independent transfer:/);
 }
});

test('correct, unknown, malformed and non-review results retain honest evidence boundaries',()=>{
 const correct=verifyTutorFormativePractice({caseId:'canonical_candle_body_pct',submitted:'50',labId:'F1-C01-L01'},'review');
 assert.equal(correct.status,'method_correct');assert.equal(correct.verifiedCause,false);
 const unknown=verifyTutorFormativePractice({caseId:'canonical_candle_body_pct',submitted:'27',labId:'F1-C01-L01'},'review');
 assert.equal(unknown.status,'unclassified_incorrect_result');assert.equal(unknown.code,'unknown_cause');
 assert.equal(verifyTutorFormativePractice({caseId:'forged',submitted:'50'},'review').status,'insufficient_evidence');
 assert.equal(verifyTutorFormativePractice({caseId:'canonical_candle_body_pct',submitted:'50'},'question').status,'insufficient_evidence');
});

test('request boundary rejects client-supplied targets and unknown cases',async()=>{
 const request=body=>new Request('https://member.test/api/market-tutor',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
  question:'Review my fictional calculation.',mode:'review',learnerAnswer:'My reasoning is shown.',...body})});
 await assert.rejects(()=>parseTutorRequest(request({formativePractice:{caseId:'canonical_candle_body_pct',submitted:'50',expected:50}})),/Invalid Tutor request fields/);
 await assert.rejects(()=>parseTutorRequest(request({formativePractice:{caseId:'forged_case',submitted:'50'}})),/Invalid Tutor request fields/);
 const parsed=await parseTutorRequest(request({formativePractice:{caseId:'canonical_candle_body_pct',submitted:'50',labId:'F1-C01-L01'}}));
 assert.deepEqual(parsed.formativePractice,{caseId:'canonical_candle_body_pct',submitted:'50',labId:'F1-C01-L01'});
});
