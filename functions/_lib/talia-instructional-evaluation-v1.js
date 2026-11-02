const text=value=>String(value||'').trim();
const has=(body,needle)=>text(needle).length>0&&text(body).includes(text(needle));

function requiredExternalEvidence(scenario={}){
 const explicit=Array.isArray(scenario.requiredExternalEvidence)?scenario.requiredExternalEvidence:[];
 if(explicit.length)return [...new Set(explicit)];
 const required=[];
 if(scenario.mode==='multiturn')required.push('authenticated_same_member_continuity','cross_account_denial');
 if(scenario.mode==='historical')required.push('authorized_chart_cutoff','no_future_candle');
 return required;
}

function classifyMisconception(guide,learnerAnswer=''){
 const body=(text(learnerAnswer)+' '+text(guide?.commonError)).toLowerCase();
 const types=[];
 if(/\b(?:calculate|calculation|percent|ratio|average|weighted|divide|multiply|basis point|shares?|dollars?|units?|denominator|numerator)\b/.test(body))types.push('mathematical');
 if(/\b(?:means?|same as|definition|concept|guarantee|automatically|always|never)\b/.test(body))types.push('conceptual');
 if(/\b(?:prove|imply|infer|interpret|identity|intent|future|outcome|direction)\b/.test(body))types.push('interpretive');
 if(/\b(?:cutoff|timestamp|source|step|process|verify|record|look.?ahead|completed|workflow)\b/.test(body))types.push('process');
 return types.length?[...new Set(types)]:['conceptual'];
}

function evaluateInstructionalCycle({guide,scenario,turns={},externalEvidence={}}={}){
 const correction=text(guide?.editorialTrainingReviewV1?.correction||guide?.editorialTrainingReviewV1?.correctiveTeaching);
 const evidence={
  diagnosis:has(turns.initial,scenario?.prompt),
  misconceptionClassified:Array.isArray(turns.misconceptionTypes)&&turns.misconceptionTypes.length>0,
  targetedCorrection:has(turns.review,correction),
  guidedRetry:has(turns.retry,guide?.commonError)&&has(turns.retry,guide?.transferQuestion),
  independentTransfer:has(turns.transfer,guide?.transferQuestion)&&text(guide?.transferQuestion)!==text(guide?.workedCase),
  limitationPreserved:has(turns.initial,scenario?.expectedLimitation)||has(turns.initial,guide?.limit),
  noGradeClaim:![turns.initial,turns.review,turns.retry,turns.transfer].some(x=>/(?<!\bno )mastery credit was awarded|(?<!\bno )official grade achieved|(?<!\bnot )passed the competency/i.test(text(x))),
  mathematicalReasoning:scenario?.category!=='INDICATOR_MATH'||(/[0-9$%]|divide|multiply|ratio|average|units?/i.test(text(turns.initial)+text(turns.transfer)))
 };
 const failedCore=Object.entries(evidence).filter(([,ok])=>!ok).map(([key])=>key);
 const required=requiredExternalEvidence(scenario);
 const missingExternal=required.filter(key=>externalEvidence[key]!==true);
 const status=failedCore.length?'FAIL':missingExternal.length?'PARTIAL':'PASS';
 return Object.freeze({status,evidence:Object.freeze(evidence),failedCore:Object.freeze(failedCore),requiredExternalEvidence:Object.freeze(required),missingExternalEvidence:Object.freeze(missingExternal)});
}

export {classifyMisconception,evaluateInstructionalCycle,requiredExternalEvidence};
