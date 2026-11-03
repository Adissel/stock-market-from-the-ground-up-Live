/* Server-side verification for two existing public fictional practice cases.
 * The browser supplies only a case ID and response; expected values and known
 * misconception signatures remain authoritative here. This is formative
 * teaching, never an official assessment, mastery decision or progress write.
 */
const CASES=Object.freeze({
 canonical_candle_body_pct:Object.freeze({
  kind:'candle',expected:50,units:'%',tolerance:.016,
  method:'Real body = |$32.00 − $31.00| = $1.00. Full range = $32.50 − $30.50 = $2.00. Body share = $1.00 ÷ $2.00 × 100 = 50%.',
  patterns:Object.freeze({
   '1':Object.freeze({code:'body_amount_not_percentage',correction:'$1.00 is the body amount, not its percentage of the $2.00 full range.'}),
   '0.5':Object.freeze({code:'decimal_ratio_not_percentage',correction:'0.50 is the body-to-range ratio; convert it to percent units to obtain 50%.'}),
   '2':Object.freeze({code:'full_range_not_body_share',correction:'$2.00 is the full range, not the body share. Divide the $1.00 body by that range.'})
  }),
  transfer:Object.freeze({id:'fictional-candle-independent-a',prompt:'FICTIONAL transfer: Open $18.00, High $19.20, Low $17.80, Close $18.60. Compute real body as a percentage of full range.',units:'%'})
 }),
 canonical_vwap_trade_groups:Object.freeze({
  kind:'vwap',expected:2600/300,units:'USD/share',tolerance:.016,
  method:'Trade value = $8 × 200 + $10 × 100 = $2,600. Volume = 300 shares. VWAP = $2,600 ÷ 300 ≈ $8.67/share.',
  patterns:Object.freeze({
   '9':Object.freeze({code:'unweighted_average',correction:'$9.00 is the simple mean. VWAP must weight each price by its share volume.'}),
   '2600':Object.freeze({code:'dollar_notional_not_vwap',correction:'$2,600 is total traded dollars. Divide it by 300 shares to produce USD/share.'}),
   '300':Object.freeze({code:'volume_not_price',correction:'300 shares is the denominator, not a price. Divide $2,600 by 300 shares.'})
  }),
  transfer:Object.freeze({id:'fictional-vwap-independent-a',prompt:'FICTIONAL transfer: 120 shares at $7.00 and 80 shares at $10.00. Calculate VWAP in USD/share.',units:'USD/share'})
 })
});
const safeLabId=value=>/^[A-Za-z0-9_-]{3,90}$/.test(String(value||''))?String(value):'TALIA_CLASSROOM';
const close=(a,b,t)=>Math.abs(a-b)<=t;
export function verifyTutorFormativePractice(value,mode){
 const unavailable=reason=>Object.freeze({schema:'smfgu.tutor.formative-practice.v1',status:'insufficient_evidence',reason,
  officialGrade:false,masteryAwarded:false,memberRecordWritten:false,paidInference:false});
 if(!value)return null;
 if(mode!=='review')return unavailable('Verified fictional calculation feedback is available only in ungraded review mode.');
 const row=CASES[value.caseId];
 const input=String(value.submitted??'').trim();
 if(!row||input.length<1||input.length>24||!/^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(input))
  return unavailable('Choose an approved fictional case and enter one finite decimal result.');
 const submitted=Number(input);
 if(!Number.isFinite(submitted))return unavailable('The submitted result is not a finite decimal value.');
 const matched=close(submitted,row.expected,row.tolerance);
 const pattern=matched?null:Object.entries(row.patterns).find(([number])=>close(submitted,Number(number),row.tolerance))?.[1]||null;
 return Object.freeze({schema:'smfgu.tutor.formative-practice.v1',caseId:value.caseId,labId:safeLabId(value.labId),
  category:'calculation',status:matched?'method_correct':pattern?'verified_misconception':'unclassified_incorrect_result',
  code:matched?'none':pattern?.code||'unknown_cause',verifiedCause:!!pattern,
  correction:matched?'The submitted fictional result matches the authored method.':pattern?.correction||'The result differs from the authored result, but the number alone does not verify why. Recheck each input, unit and intermediate step.',
  method:row.method,followUp:row.transfer,
  limitation:'This verifies one public fictional calculation only. It does not establish a personal cognitive diagnosis, historical-market skill, official grade or mastery.',
  officialGrade:false,masteryAwarded:false,memberRecordWritten:false,entitlementGranted:false,paidInference:false});
}
export function formatTutorFormativePractice(result){
 if(!result||result.status==='insufficient_evidence')return result?.reason||'';
 return ['Verified fictional calculation review (ungraded): '+result.status.replaceAll('_',' ')+'.',
  result.correction,'Explicit method: '+result.method,'Independent transfer: '+result.followUp.prompt,
  'Units: '+result.followUp.units+'. '+result.limitation].join('\n\n');
}
