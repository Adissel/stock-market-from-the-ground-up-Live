/* SMFGU-ENGINE-ADAPT-003: verified fictional practice errors -> learning feedback.
 * This is NOT a private rubric, historical feed, server grade or entitlement.
 * Do not invoke in Blind Decision/Assessment or on unauthenticated Lab content.
 */
(function(root){
'use strict';
const SCHEMA='smfgu.learning.lab.practice-evidence.v1';
const clean=s=>typeof s==='string'?s.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,420):'';
const close=(a,b)=>Math.abs(a-b)<0.016;
const CASES=Object.freeze({
 candle:Object.freeze([
  Object.freeze({id:'fictional-candle-independent-a',prompt:'New FICTIONAL candle: Open $18.00, High $19.20, Low $17.80, Close $18.60. Compute the real body as a percentage of the full range.',answer:100*(.6/1.4),units:'%',source:'fictional_constructed_no_feed'}),
  Object.freeze({id:'fictional-candle-independent-b',prompt:'New FICTIONAL candle: Open $13.20, High $14.40, Low $12.90, Close $14.00. Compute the real body as a percentage of the full range.',answer:100*(.8/1.5),units:'%',source:'fictional_constructed_no_feed'})
 ]),
 vwap:Object.freeze([
  Object.freeze({id:'fictional-vwap-independent-a',prompt:'New FICTIONAL trade groups: 120 shares at $7.00 and 80 shares at $10.00. Calculate volume-weighted average price in USD/share.',answer:(120*7+80*10)/200,units:'USD/share',source:'fictional_constructed_no_feed'}),
  Object.freeze({id:'fictional-vwap-independent-b',prompt:'New FICTIONAL trade groups: 90 shares at $9.00 and 60 shares at $13.00. Calculate volume-weighted average price in USD/share.',answer:(90*9+60*13)/150,units:'USD/share',source:'fictional_constructed_no_feed'})
 ])
});
const PATTERNS=Object.freeze({
 candle:Object.freeze([
  Object.freeze({value:1,code:'body_amount_not_percentage',prerequisite:'Separate the real-body dollar amount from its percentage of the full high-low range.',correction:'The real body is $1.00 and full range is $2.00. Divide $1.00 by $2.00, then multiply by 100 to obtain 50%.'}),
  Object.freeze({value:.5,code:'decimal_ratio_not_percentage',prerequisite:'Convert a ratio into percent units only after using the correct denominator.',correction:'The body-to-range ratio is 0.50, which is 50%, not 0.50%.'}),
  Object.freeze({value:2,code:'full_range_not_body_share',prerequisite:'Distinguish the full price range from the candle body and their ratio.',correction:'The full range is $2.00, but the body is $1.00; their ratio is 1 ÷ 2 = 0.50 or 50%.'})
 ]),
 vwap:Object.freeze([
  Object.freeze({value:9,code:'unweighted_average',prerequisite:'VWAP weights each price by shares; a simple mean is not sufficient.',correction:'($8 × 200 shares + $10 × 100 shares) ÷ (200 + 100 shares) = $2,600 ÷ 300 shares ≈ $8.67/share.'}),
  Object.freeze({value:2600,code:'dollar_notional_not_vwap',prerequisite:'Divide total traded dollars by total shares to obtain a price per share.',correction:'$2,600 is the numerator in dollars. Divide by 300 shares for approximately $8.67/share.'}),
  Object.freeze({value:300,code:'volume_not_price',prerequisite:'Distinguish total share volume from a volume-weighted price.',correction:'300 shares is the denominator, not the result in USD/share. $2,600 ÷ 300 = about $8.67/share.'})
 ])
});

/* Existing 30-guide prerequisite alignment; ordinary practice is NOT an
 * official assessment. This mapping never creates a new learning record.
 */
const SKILL_CODES=Object.freeze({
 body_amount_not_percentage:Object.freeze(['CANDLE_READING']),
 decimal_ratio_not_percentage:Object.freeze(['CANDLE_READING']),
 full_range_not_body_share:Object.freeze(['CANDLE_READING']),
 unweighted_average:Object.freeze(['VWAP_CONTEXT','VOLUME_ANALYSIS']),
 dollar_notional_not_vwap:Object.freeze(['VWAP_CONTEXT']),
 volume_not_price:Object.freeze(['VOLUME_ANALYSIS','VWAP_CONTEXT']),
 candle_body_step:Object.freeze(['CANDLE_READING']),
 candle_range_step:Object.freeze(['CANDLE_READING']),
 candle_percent_step:Object.freeze(['CANDLE_READING']),
 vwap_notional_step:Object.freeze(['VWAP_CONTEXT','VOLUME_ANALYSIS']),
 vwap_volume_step:Object.freeze(['VOLUME_ANALYSIS','VWAP_CONTEXT']),
 vwap_price_step:Object.freeze(['VWAP_CONTEXT'])
});
function recommendPrerequisites({diagnosis,guides,evidence}={}){
 const empty=Object.freeze({items:Object.freeze([]),source:'unverified_or_unclassified',
  officialGrade:false,masteryAwarded:false,memberProgressModified:false});
 if(diagnosis?.schema!==SCHEMA||!SKILL_CODES[diagnosis.code]||
    !((diagnosis?.verifiedCause===true&&diagnosis.status==='verified_misconception')||
      (diagnosis?.observedStepMismatch===true&&diagnosis.status==='observed_step_mismatch')))return empty;
 const catalog=guides instanceof Map?guides:
  new Map((Array.isArray(guides)?guides:[]).filter(g=>g&&typeof g.code==='string').map(g=>[g.code,g]));
 const verified=evidence?.ok===true&&Array.isArray(evidence.skills);
 const items=[];
 for(const code of SKILL_CODES[diagnosis.code]){
  const guide=catalog.get(code);
  if(typeof guide?.title!=='string'||!guide.title.trim())continue;
  const record=verified?evidence.skills.find(s=>s?.code===code):null;
  const assessed=Number.isSafeInteger(record?.independentAssessments)&&record.independentAssessments>0&&
   Number.isSafeInteger(record?.completeAssessments)&&record.completeAssessments>0;
  const status=verified?(assessed&&typeof record.status==='string'&&record.status.trim()?
   clean(record.status).slice(0,90):'Not Yet Assessed'):'Status unavailable — no verified account evidence';
  items.push(Object.freeze({code,title:clean(guide.title),url:'skills.html#guide-'+encodeURIComponent(code),
   status,source:verified?'authenticated_competency_summary':'public_guide_only',
   note:'Suggested by an ungraded fictional practice error; not an official failed assessment.'}));
 }
 return Object.freeze({items:Object.freeze(items),source:'verified_formative_misconception',
  officialGrade:false,masteryAwarded:false,memberProgressModified:false});
}


/* Three public authored fictional calculation steps. A wrong intermediate
 * value proves a mismatch, NOT the learner's motive or cognitive process.
 */
const STEP_CASES=Object.freeze({
 candle:Object.freeze({id:'canonical_candle_body_pct',keys:Object.freeze(['body','range','percent']),
  labels:Object.freeze(['Real body (USD)','High–low range (USD)','Body share (%)']),
  expected:Object.freeze([1,2,50]),explain:Object.freeze([
   'Real body = |Close − Open| = |$32 − $31| = $1.',
   'Full range = High − Low = $32.50 − $30.50 = $2.',
   'Body percent = $1 ÷ $2 × 100 = 50%.'])}),
 vwap:Object.freeze({id:'canonical_vwap_trade_groups',keys:Object.freeze(['dollars','shares','price']),
  labels:Object.freeze(['Trade value (USD)','Total volume (shares)','VWAP (USD/share)']),
  expected:Object.freeze([2600,300,2600/300]),explain:Object.freeze([
   'Trade value = $8 × 200 + $10 × 100 = $2,600.',
   'Volume = 200 shares + 100 shares = 300 shares.',
   'VWAP = $2,600 ÷ 300 ≈ $8.67 per share.'])})
});
const STEP_CODES=Object.freeze({candle:['candle_body_step','candle_range_step','candle_percent_step'],
 vwap:['vwap_notional_step','vwap_volume_step','vwap_price_step']});
function evaluateSteps({kind,caseCode,labId,mode,stage,provenance,inputs}={}){
 const bad=reason=>Object.freeze({schema:SCHEMA,status:'insufficient_evidence',reason,officialGrade:false,masteryAwarded:false});
 const ref=STEP_CASES[kind];
 if(!ref||ref.id!==caseCode||!['guided','practice'].includes(mode)||stage!=='practice'||
    provenance!=='fictional_authored'||!/^[A-Za-z0-9_-]{3,90}$/.test(String(labId||''))||
    !inputs||typeof inputs!=='object'||Array.isArray(inputs))
  return bad('This case does not provide approved public fictional calculation evidence.');
 const steps=[];
 for(let i=0;i<3;i++){
  const val=String(inputs[ref.keys[i]]??'').trim();
  if(val.length>24||!/^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(val))
   return bad('Enter all three intermediate results in ordinary finite decimal notation.');
  const actual=Number(val);if(!Number.isFinite(actual))return bad('Invalid numerical step.');
  const tolerance=i===2?(kind==='candle'?.055:.015):.015;
  steps.push(Object.freeze({key:ref.keys[i],label:ref.labels[i],value:actual,
   matched:Math.abs(actual-ref.expected[i])<=tolerance,explanation:ref.explain[i]}));
 }
 const index=steps.findIndex(s=>!s.matched);
 const choices=CASES[kind];
 const selected=choices[[...labId].reduce((a,c)=>a+c.charCodeAt(0),0)%choices.length];
 return Object.freeze({schema:SCHEMA,kind,labId,mode,stage,
  status:index<0?'method_steps_matched':'observed_step_mismatch',
  code:index<0?'none':STEP_CODES[kind][index],observedStepMismatch:index>=0,verifiedCause:false,
  steps:Object.freeze(steps),mismatchedStepCount:steps.filter(s=>!s.matched).length,
  followUp:Object.freeze({id:selected.id,prompt:selected.prompt,units:selected.units,source:selected.source}),
  limitation:'An observed numeric mismatch does not establish why the learner made it. No official assessment result is created.',
  officialGrade:false,masteryAwarded:false,memberRecordWritten:false,entitlementGranted:false,paidInference:false});
}

const none=(reason)=>Object.freeze({schema:SCHEMA,status:'insufficient_evidence',reason,
 officialGrade:false,masteryAwarded:false,memberRecordWritten:false,paidInference:false});
function evaluate({labId,mode,stage,provenance,kind,caseCode,submitted,expected,units,sourceSteps,topic}={}){
 if(!['guided','practice'].includes(mode)||stage!=='practice')return none('Independent or concealed assessment modes must not receive formative answer feedback.');
 if(provenance!=='fictional_authored' || !CASES[kind] || !/^[A-Za-z0-9_-]{3,90}$/.test(String(labId||'')))
  return none('No eligible authored fictional practice evidence is available for this case.');
 const input=clean(String(submitted??''));
 const n=Number(input),target=Number(expected);
 if(!input||input.length>40||!Number.isFinite(n)||!Number.isFinite(target)||!['%','USD/share'].includes(units))
  return none('A bounded numerical submission and an authored target with valid units are required.');
 const success=close(n,target);
 let pattern=null;
 // Misconception causes are only verified against the exact original authored case,
 // never guessed for a different question that coincidentally has the same number.
 if(!success && ((kind==='candle'&&caseCode==='canonical_candle_body_pct'&&close(target,50))||
    (kind==='vwap'&&caseCode==='canonical_vwap_trade_groups'&&close(target,2600/300)))){
  pattern=PATTERNS[kind].find(x=>close(n,x.value))||null;
 }
 const steps=Array.isArray(sourceSteps)?sourceSteps.filter(s=>typeof s==='string'&&s.trim()).slice(0,5):[];
 const hash=[...String(labId)].reduce((sum,ch)=>sum+ch.charCodeAt(0),0);
 const follow=CASES[kind][hash%CASES[kind].length];
 return Object.freeze({
  schema:SCHEMA,status:success?'method_correct':pattern?'verified_misconception':'unclassified_incorrect_result',
  labId,stage:'practice',mode,subject:clean(topic)||kind,sourceType:'fictional_authored',
  observed:Object.freeze({submitted:n,units,exactNumericalComparison:true,originalCase:caseCode||'unclassified_authored_case'}),
  code:success?'none':pattern?.code||'unknown_cause',
  verifiedCause:!!pattern,prerequisite:pattern?.prerequisite||(
   success?'The fictional numerical method matched its authored result.':
   'Your numerical result differs from the authored practice result; the cause cannot be inferred from the number alone.'
  ),correction:pattern?.correction||(
   success?'Use the same method with independently changed fictional values.':
   'Recheck the inputs, their units and every intermediate step before retrying.'
  ),
  sourceExcerpt:clean(steps.join(' '),420)||'No additional authored working is available for this case.',
  nextAction:success?'Attempt a new case independently.':'Review the authored method, retry the original question, then solve a different fictional case independently.',
  followUp:Object.freeze({id:follow.id,prompt:follow.prompt,units:follow.units,source:follow.source}),
  officialGrade:false,masteryAwarded:false,memberRecordWritten:false,entitlementGranted:false,paidInference:false,
  claim:'This is a numerical comparison of fictional authorized practice, not an official assessment, verified market tape or a prediction.'
 });
}
function checkFollowUp({id,submitted}={}){
 const row=Object.values(CASES).flat().find(c=>c.id===id);
 const str=clean(String(submitted??'')),answer=Number(str);
 if(!row||!str||str.length>40||!Number.isFinite(answer))return Object.freeze({accepted:false,correct:false,officialGrade:false,masteryAwarded:false,reason:'Enter a finite numerical response.'});
 return Object.freeze({accepted:true,correct:close(answer,row.answer),officialGrade:false,masteryAwarded:false,
  reason:close(answer,row.answer)?'Correct fictional calculation; no official grade or mastery awarded.':'Not yet correct; revisit the original method, units and independent case inputs.'});
}
const api=Object.freeze({schema:SCHEMA,evaluate,evaluateSteps,checkFollowUp,recommendPrerequisites,caseIds:Object.freeze(Object.values(CASES).flat().map(x=>x.id))});
root.GroundUpLearningEvidenceV1=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
