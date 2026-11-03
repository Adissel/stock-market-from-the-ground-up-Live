/* Ungraded Enterprise research case workbench: original fictional inputs only.
 * Independent completed-bar and same-timeline validation, with embargoed
 * training-only numerical summaries. No external feeds, securities prices,
 * persistence, forecasting, model selection, grading or orders.
 */
import {deriveFictionalCompletedStudies} from './learning-lab-edition-exercises-v1.js';
import {chronologicalHoldout,summarizeFictionalOutcomes}
 from './learning-lab-research-evidence-v1.js';
export const WORKBENCH_SCHEMA='smfgu.enterprise.fictional-case-comparison.v1';
const fin=x=>typeof x==='number'&&Number.isFinite(x);
const validId=s=>typeof s==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{2,59}$/.test(s);
const frozen=Object.freeze;
export function compareOriginalFictionalCases({cases,embargo=2}={}){
 if(!Array.isArray(cases)||cases.length<2||cases.length>4||
   !Number.isSafeInteger(embargo)||embargo<1||embargo>3)return null;
 const rows=[],seen=new Set();let timeIndex=null;
 for(const item of cases){
  if(!item||!validId(item.caseId)||seen.has(item.caseId)||
   item.externalSource!==undefined||item.marketDataRights!==undefined||
   item.providerUrl!==undefined||item.licensedHistorical!==undefined||
   !item.evidence||item.evidence.provenance!=='fictional')return null;
  seen.add(item.caseId);
  const calculated=deriveFictionalCompletedStudies({evidence:item.evidence,emaPeriod:5});
  const bars=calculated?.evidence?.bars;
  if(!Array.isArray(bars)||bars.length<12||bars.length>100||
   calculated.evidence.asOf!==bars.at(-1).timestamp)return null;
  const times=bars.map(b=>b.timestamp);
  if(timeIndex===null)timeIndex=times;
  else if(times.length!==timeIndex.length||times.some((t,i)=>t!==timeIndex[i]))return null;
  const separation=chronologicalHoldout({sampleCount:bars.length,
   trainCount:Math.floor(bars.length*.6),embargo});
  if(!separation||separation.test.endExclusive-separation.test.start<2)return null;
  const train=bars.slice(separation.train.start,separation.train.endExclusive);
  const trainingStudy=deriveFictionalCompletedStudies({evidence:{
   provenance:'fictional',asOf:train.at(-1).timestamp,
   completedIndex:train.length-1,bars:train},emaPeriod:5});
  if(!trainingStudy)return null;
  const summary=summarizeFictionalOutcomes({values:train.map(x=>x.close),
   source:'fictional_constructed_no_feed'});
  if(!summary||!fin(summary.mean)||!fin(summary.sampleStdDev))return null;
  const values=Object.fromEntries(trainingStudy.indicators.map(x=>[x.name,x.value]));
  if(!['EMA','VWAP','RSI','MACD','ATR','BOLL'].every(x=>fin(values[x])))return null;
  rows.push(frozen({caseId:item.caseId,provenance:'original_fictional_no_feed',
   trainingCount:train.length,trainingThrough:train.at(-1).timestamp,
   embargoCount:separation.embargo.endExclusive-separation.embargo.start,
   heldOutEvaluationCount:separation.test.endExclusive-separation.test.start,
   trainingMean:summary.mean,trainingSampleStdDev:summary.sampleStdDev,
   trainingOnlyIndicators:frozen(values),methodSelectionOnHoldoutProhibited:true,
   holdoutValuesReturned:false,externalSourceRightsInferred:false,
   officialGrade:false}));
 }
 return frozen({schema:WORKBENCH_SCHEMA,edition:'ENTERPRISE',
  cases:frozen(rows),alignedCompletedAsOf:cases[0].evidence.asOf,
  sharedCompletedBars:timeIndex.length,embargo,
  comparisonScope:'Training-only original fictional observations, no provider source.',
  historicalDatasetUsed:false,holdoutValuesReturned:false,
  holdoutUsedForModelSelection:false,persisted:false,graded:false,masteryAwarded:false,
  limitation:'These constructed examples are not verified market observations. Evaluation outcomes remain undisclosed; training statistics do not establish predictive reliability.'});
}
