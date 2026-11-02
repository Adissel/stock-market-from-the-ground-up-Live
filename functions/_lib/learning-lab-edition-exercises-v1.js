/* SMFGU-ENGINES-EDITION-EXECUTION-001
 * Original, ungraded educational functions for future released Advanced,
 * Professional and Enterprise Learning/Lab memberships. No answer keys,
 * subscription grants, external market feeds, future bars, or member writes.
 * Server endpoints must gate EVERY action, independently of this source.
 */
import {recommendFormativeRoute,completedReplayPrefix,compareFictionalRiskCases}
 from './learning-lab-formative-editions-v1.js';
export const EDITION_SCHEMA='smfgu.learning.lab.editions.v1';
export const EDITIONS=Object.freeze(['BASIC','ADVANCED','PROFESSIONAL','ENTERPRISE']);
const rank=x=>EDITIONS.indexOf(x);
const fin=n=>typeof n==='number'&&Number.isFinite(n);
const text=(s,max=200)=>typeof s==='string'&&s.trim()?s.trim().slice(0,max):'';
const uuid=s=>typeof s==='string'&&/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(s);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const freeze=o=>Object.freeze(o);
const denied=reason=>freeze({ok:false,reason,edition:'BASIC',graded:false,masteryAwarded:false});
/* Plan policy is a maximum TARGET, not a grant. Positive release flags,
 * product-owned grant, matching member, time and family are ALL required.
 */
export function verifyEditionAuthorization({actorId,family,requested,planTarget,grant,releaseEnabled,now=Date.now()}={}){
 if(!uuid(actorId)||!['learning','lab'].includes(family)||!fin(now))return denied('verified_member_required');
 if(!EDITIONS.includes(requested)||requested==='BASIC')return denied('invalid_premium_request');
 if(!EDITIONS.includes(planTarget)||rank(planTarget)<rank(requested))return denied('plan_target_insufficient');
 if(releaseEnabled!==true)return denied('edition_not_released');
 if(!grant||grant.serverVerified!==true||grant.memberId!==actorId||grant.family!==family||
    !EDITIONS.includes(grant.edition)||rank(grant.edition)<rank(requested)||
    grant.revoked===true||!fin(grant.expiresAt)||grant.expiresAt<=now)
  return denied('valid_product_grant_required');
 return freeze({ok:true,edition:requested,family,memberId:actorId,expiresAt:grant.expiresAt,
  graded:false,masteryAwarded:false});
}
function asOfPrefix(source){
 if(!source||!fin(source.asOf)||source.asOf<=0)return null;
 const approved=completedReplayPrefix({
  bars:source.bars,lastCompletedIndex:source.completedIndex,
  provenance:source.provenance,rights:source.rights
 });
 if(!approved||approved.completedThrough>source.asOf)return null;
 return approved;
}
function studySummary(prefix,fields=[]){
 const bars=prefix.bars,last=bars.at(-1),first=bars[0];
 const move=last.close-first.open;
 return freeze({from:first.timestamp,through:last.timestamp,sampleSize:bars.length,
  latestClose:last.close,netChange:move,netChangePercent:first.open>0?move/first.open*100:null,
  indicators:freeze(fields),barsVisible:bars.length,futureBarsIncluded:false});
}
function normalizeIndicators(indicators,cutoff){
 if(!Array.isArray(indicators)||indicators.length>12)return null;
 const seen=new Set(),out=[];
 for(const item of indicators){
  if(!item||!['EMA','RSI','MACD','ATR','BOLL','VWAP','VOLUME'].includes(item.name)||
    seen.has(item.name)||!fin(item.value)||!fin(item.asOf)||
    item.asOf>cutoff||item.asOf<=0||
    !text(item.method,150)||item.verified!==true)return null;
  seen.add(item.name);
  out.push(freeze({name:item.name,value:item.value,asOf:item.asOf,method:text(item.method,150),
   disclaimer:'An indicator is descriptive, not predictive.'}));
 }
 return out;
}
export function advancedFormativeStudy({competencies,observations,evidence,indicators}={}){
 const prefix=asOfPrefix(evidence);
 if(!prefix)return null;
 const studies=normalizeIndicators(indicators,prefix.completedThrough);
 if(!studies)return null;
 const path=recommendFormativeRoute({competencies,observations}).slice(0,12);
 return freeze({schema:EDITION_SCHEMA,edition:'ADVANCED',activity:'advanced_formative_review',
  evidence:studySummary(prefix,studies),remediation:freeze(path),graded:false,masteryAwarded:false,
  limitation:'Reviewed formative observations recommend practice, not a grade or a trade.'});
}
export function professionalDecisionStudy({evidence,indicators,riskCases,frames}={}){
 const prefix=asOfPrefix(evidence);
 if(!prefix)return null;
 const studies=normalizeIndicators(indicators,prefix.completedThrough);
 const risks=compareFictionalRiskCases(riskCases);
 if(!studies||!risks||!Array.isArray(frames)||frames.length>6)return null;
 const used=new Set(),frameRows=[];
 for(const frame of frames){
  if(!frame||!text(frame.label,40)||used.has(frame.label)||!fin(frame.completedThrough)||
    frame.completedThrough>prefix.completedThrough||frame.completedThrough<=0||
    !fin(frame.close)||frame.close<=0||frame.sourceVerified!==true)return null;
  used.add(frame.label);
  frameRows.push(freeze({label:text(frame.label,40),close:frame.close,
   completedThrough:frame.completedThrough}));
 }
 return freeze({schema:EDITION_SCHEMA,edition:'PROFESSIONAL',activity:'decision_replay_review',
  evidence:studySummary(prefix,studies),frames:freeze(frameRows),hypotheticalRisk:freeze(risks),
  noLookahead:true,graded:false,masteryAwarded:false,
  limitation:'Fictional risk amounts exclude slippage, fees and uncertain execution; no order is placed.'});
}
/* Rights metadata is evaluated per source. A URL or issuer label by itself
 * is NEVER evidence of licensing. Only a positive server-verified rights status
 * may participate in an Enterprise source manifest.
 */
export function enterpriseResearchStudy({manifest,observations,embargo=0,sensitivity}={}){
 if(!Array.isArray(manifest)||manifest.length<1||manifest.length>8||
    !Array.isArray(observations)||observations.length<6||observations.length>5000||
    !Number.isSafeInteger(embargo)||embargo<1||embargo>250||
    !Array.isArray(sensitivity)||sensitivity.length<1||sensitivity.length>30)return null;
 const sources=[],ids=new Set();
 for(const m of manifest){
  if(!m||!text(m.id,60)||ids.has(m.id)||!text(m.methodVersion,80)||
   !text(m.reference,250)||!fin(m.asOf)||m.asOf<=0||
   m.rights!=='verified_for_requested_use'||m.serverRightsVerified!==true)return null;
  ids.add(m.id);
  sources.push(freeze({id:text(m.id,60),methodVersion:text(m.methodVersion,80),
   reference:text(m.reference,250),asOf:m.asOf,rights:m.rights}));
 }
 let prior=-Infinity;const records=[];
 const cutoff=Math.min(...sources.map(s=>s.asOf));
 for(const x of observations){
  if(!x||!fin(x.timestamp)||x.timestamp<=prior||x.timestamp>cutoff||
   !fin(x.value))return null;
  prior=x.timestamp;records.push(freeze({timestamp:x.timestamp,value:x.value}));
 }
 const trainEnd=Math.floor(records.length*0.6);
 const evalStart=trainEnd+embargo;
 if(trainEnd<3||evalStart>=records.length-1)return null;
 const methods=[];
 for(const row of sensitivity){
  if(!row||!text(row.method,80)||!fin(row.parameter)||!fin(row.result)||
   row.holdoutUsedForSelection===true)return null;
  methods.push(freeze({method:text(row.method,80),parameter:row.parameter,
   descriptiveResult:row.result,selectionProhibited:true}));
 }
 return freeze({schema:EDITION_SCHEMA,edition:'ENTERPRISE',activity:'chronological_validation',
  rightsManifest:freeze(sources),methodComparisons:freeze(methods),
  training:freeze({count:trainEnd,through:records[trainEnd-1].timestamp}),
  embargo:freeze({count:embargo}),
  evaluation:freeze({count:records.length-evalStart,from:records[evalStart].timestamp,
   through:records.at(-1).timestamp}),
  holdoutProtected:true,graded:false,masteryAwarded:false,
  limitation:'Chronological separation is necessary but does not establish predictive reliability.'});
}
export function runEditionExercise({authorized,activity,payload}={}){
 if(authorized?.ok!==true||!['learning','lab'].includes(authorized.family)||
  !EDITIONS.includes(authorized.edition)||authorized.edition==='BASIC')return null;
 const allowed={ADVANCED:'advanced_formative_review',PROFESSIONAL:'decision_replay_review',
  ENTERPRISE:'chronological_validation'};
 if(activity!==allowed[authorized.edition])return null;
 if(!payload||typeof payload!=='object'||Array.isArray(payload))return null;
 if(activity==='advanced_formative_review')return advancedFormativeStudy(payload);
 if(activity==='decision_replay_review')return professionalDecisionStudy(payload);
 return enterpriseResearchStudy(payload);
}
