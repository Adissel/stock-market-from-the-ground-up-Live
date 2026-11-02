/* SMFGU-ENGINES-RESEARCH-001 — bounded, deterministic research EDUCATION.
 * Formative calculations only; NEVER official grading, entitlement or financial advice.
 * No external historical feed, protected rubric, progress or account writes.
 */
export const RESEARCH_SCHEMA='smfgu.learning.research-evidence.v1';
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const freeze=x=>Object.freeze(x);
const validSeries=x=>Array.isArray(x)&&x.length>=2&&x.length<=10000&&x.every(finite);
const slug=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.-]{0,79}$/.test(x);
function stats(values){
 if(!validSeries(values))return null;
 const n=values.length,mean=values.reduce((a,b)=>a+b,0)/n;
 if(!finite(mean))return null;
 const variance=values.reduce((a,v)=>a+(v-mean)**2,0)/(n-1);
 if(!finite(variance))return null;
 return freeze({n,mean,sampleVariance:variance,sampleStdDev:Math.sqrt(variance),
  standardError:Math.sqrt(variance/n)});
}
/** No normality or predictive coverage is claimed. Confidence interval below
 * is approximate and must not be interpreted as a trading forecast.
 */
export function summarizeFictionalOutcomes({values,source}={}){
 if(source!=='fictional_constructed_no_feed')return null;
 const s=stats(values);
 if(!s)return null;
 const margin=1.96*s.standardError;
 if(!finite(margin))return null;
 return freeze({schema:RESEARCH_SCHEMA,...s,approximateNormal95:freeze([
  s.mean-margin,s.mean+margin
 ]),assumptions:freeze(['Independent observations are assumed, not verified.',
  'Normal-approximation interval is unreliable for small samples or heavy tails.',
  'Past fictional outcomes do not predict actual returns.']),
  officialMastery:false});
}
/** Time-ordered separation; explicit embargo eliminates accidental overlap.
 * Returns only indices, not a future-outcome series or source observations.
 */
export function chronologicalHoldout({sampleCount,trainCount,embargo=0}={}){
 if(!Number.isInteger(sampleCount)||sampleCount<6||sampleCount>100000||
 !Number.isInteger(trainCount)||trainCount<3||trainCount>=sampleCount||
 !Number.isInteger(embargo)||embargo<0||embargo>1000)return null;
 const testStart=trainCount+embargo;
 if(sampleCount-testStart<2)return null;
 return freeze({train:freeze({start:0,endExclusive:trainCount}),
  embargo:freeze({start:trainCount,endExclusive:testStart}),
  test:freeze({start:testStart,endExclusive:sampleCount}),
  overlapping:false,noFutureTrainingObservations:true,
  note:'Chronological holdout is not proof of out-of-sample validity; selection and parameter tuning must be audited.'});
}
/** Deterministic research notebook manifest, not persisted and not rights approval. */
export function researchCaseManifest({caseId,methodVersion,datasetId,rights,source,assumptions=[]}={}){
 if(!slug(caseId)||!slug(methodVersion)||!slug(datasetId)||
 !['fictional_constructed_no_feed','historical_authorized'].includes(source)||
 !['fictional_original','verified_for_requested_use'].includes(rights)||
 (source==='historical_authorized'&&rights!=='verified_for_requested_use')||
 (source==='fictional_constructed_no_feed'&&rights!=='fictional_original')||
 !Array.isArray(assumptions)||assumptions.length>20||
 !assumptions.every(x=>typeof x==='string'&&x.trim().length>0&&x.length<=240))return null;
 return freeze({schema:RESEARCH_SCHEMA,caseId,methodVersion,datasetId,
  rights,source,assumptions:freeze([...assumptions]),
  persisted:false,reviewed:false,publicationApproved:false,officialGrade:false});
}
/** Explicitly compare model candidates on a caller-designated TEST sample;
 * never promote best test performer as independently validated.
 */
export function compareModelSensitivity({candidates,holdout}={}){
 if(!Array.isArray(candidates)||candidates.length<2||candidates.length>30||
 !holdout||holdout.noFutureTrainingObservations!==true||
 holdout.overlapping!==false)return null;
 const rows=[],seen=new Set();
 for(const c of candidates){
  if(!c||!slug(c.id)||seen.has(c.id)||!validSeries(c.testOutcomes))return null;
  seen.add(c.id);
  const s=stats(c.testOutcomes);
  if(!s)return null;
  rows.push(freeze({id:c.id,observations:s.n,mean:s.mean,
   sampleStdDev:s.sampleStdDev}));
 }
 return freeze({schema:RESEARCH_SCHEMA,rows:freeze(rows),
  selectionOnTestSetInvalidatesIndependentHoldout:true,
  caveat:'Parameter selection from these test outcomes requires a new untouched validation sample.',
  officialGrade:false});
}
