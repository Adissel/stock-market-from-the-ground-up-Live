/* SMFGU-ENGINES-FORMATIVE-001 v1.0 — ungraded capability contracts.
 * NOT an entitlement, grading service, official mastery record, market feed,
 * or replacement for frozen Learning v3.3 / Lab v3.2.
 * Consumers MUST obtain an independently server-verified released entitlement
 * before exposing premium actions. Never import private answer keys here.
 */
export const FORMATIVE_SCHEMA='smfgu.engines.formative.v1';
const LEVELS=Object.freeze(['BASIC','ADVANCED','PROFESSIONAL','ENTERPRISE']);
const FEATURES=Object.freeze({
 BASIC:Object.freeze(['first_principles','worked_examples','ordinary_retry','independent_transfer','no_trade']),
 ADVANCED:Object.freeze(['evidence_prerequisite_route','completed_bar_multi_indicator','intermediate_arithmetic','misconception_feedback']),
 PROFESSIONAL:Object.freeze(['comparative_decision_evidence','replay_case_review','risk_scenario_comparison','uncertainty_interpretation']),
 ENTERPRISE:Object.freeze(['versioned_research_method','bias_review','out_of_sample_review','sensitivity_review','research_provenance'])
});
const hasOwn=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const finite=v=>typeof v==='number'&&Number.isFinite(v);
export function capabilityCatalog(){
 return Object.freeze(LEVELS.map((edition,i)=>Object.freeze({
  edition,
  includes:Object.freeze(LEVELS.slice(0,i+1)),
  features:Object.freeze(LEVELS.slice(0,i+1).flatMap(k=>FEATURES[k])),
  released:false,
  grantsEntitlement:false,
  writesOfficialGrades:false
 })));
}
/* Activity, self-rating and unsupported textual confidence cannot become mastery.
 * Only valid, explicitly reviewed observations can suggest formative remediation.
 * Recommendations do not override lesson publication/prerequisite enforcement.
 */
export function recommendFormativeRoute({competencies,observations}={}){
 if(!Array.isArray(competencies)||!Array.isArray(observations))return Object.freeze([]);
 const verified=new Set();
 for(const o of observations){
  if(!o||typeof o!=='object'||o.reviewed!==true||o.kind!=='formative_observation'||
    typeof o.competencyId!=='string'||!['correct','needs_review'].includes(o.outcome))continue;
  if(o.outcome==='needs_review')verified.add(o.competencyId);
 }
 const result=[];
 const seen=new Set();
 for(const c of competencies){
  if(!c||typeof c!=='object'||typeof c.id!=='string'||!c.id.trim()||
     seen.has(c.id)||!verified.has(c.id))continue;
  seen.add(c.id);
  const deps=Array.isArray(c.prerequisites)?c.prerequisites.filter(x=>typeof x==='string'&&x.trim()&&x!==c.id).slice(0,20):[];
  const sequence=Object.freeze([...new Set([...deps,c.id])]);
  result.push(Object.freeze({competencyId:c.id,route:'formative_remediation',
   prerequisites:Object.freeze([...new Set(deps)]),sequence,
   rationale:'A reviewed formative observation requires another worked example and independent transfer.',
   changesMastery:false,changesAccess:false}));
 }
 return Object.freeze(result);
}
/* Cursor is the last COMPLETED bar index. Explicitly deny unknown provenance,
 * malformed timestamps and any future suffix in the returned teaching contract.
 * This is an ungraded data boundary, not a substitute for server data rights.
 */
export function completedReplayPrefix({bars,lastCompletedIndex,provenance,rights}={}){
 if(!Array.isArray(bars)||bars.length>20000||!Number.isInteger(lastCompletedIndex)||
 lastCompletedIndex<0||lastCompletedIndex>=bars.length)return null;
 if(!['fictional','licensed_historical','user_provided_authorized'].includes(provenance))return null;
 if(provenance!=='fictional'&&rights!=='verified_for_requested_use')return null;
 let prior=-Infinity;
 const visible=[];
 for(let i=0;i<=lastCompletedIndex;i++){
  const b=bars[i];
  if(!b||!finite(b.timestamp)||b.timestamp<=prior||!finite(b.open)||
    !finite(b.high)||!finite(b.low)||!finite(b.close)||!finite(b.volume)||
    b.volume<0||b.low>b.high||b.open<b.low||b.open>b.high||
    b.close<b.low||b.close>b.high)return null;
  prior=b.timestamp;
  visible.push(Object.freeze({timestamp:b.timestamp,open:b.open,high:b.high,
    low:b.low,close:b.close,volume:b.volume}));
 }
 return Object.freeze({schema:FORMATIVE_SCHEMA,provenance,
  lastCompletedIndex,completedThrough:prior,
  bars:Object.freeze(visible),futureBarsIncluded:false,officialGrade:false});
}
/* Original instructional risk math, NOT an order, advice or rubric. */
export function compareFictionalRiskCases(cases){
 if(!Array.isArray(cases)||cases.length===0||cases.length>30)return null;
 const results=[];
 for(const c of cases){
  if(!c||!finite(c.entry)||!finite(c.stop)||!finite(c.riskBudget)||
    !finite(c.availableCash)||c.entry<=0||c.stop<=0||c.riskBudget<0||
    c.availableCash<0||c.entry===c.stop)return null;
  const perShare=Math.abs(c.entry-c.stop);
  const shares=Math.min(Math.floor(c.riskBudget/perShare),Math.floor(c.availableCash/c.entry));
  if(!Number.isSafeInteger(shares)||shares<0)return null;
  results.push(Object.freeze({perShareRisk:perShare,shares,
   plannedRisk:shares*perShare,exposure:shares*c.entry,
   limitation:'Stop orders may slip; losses can exceed planned risk.'}));
 }
 return Object.freeze(results);
}
