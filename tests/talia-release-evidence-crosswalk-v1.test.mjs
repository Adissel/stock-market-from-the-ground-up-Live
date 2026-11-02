import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {enginePolicyForPlan} from '../functions/_lib/learning-engine-tier-policy-v1.js';
import {TALIA_PREMIUM_RESEARCH_RELEASED} from '../functions/_lib/talia-tier-research-contracts-v1.js';

const source=path=>readFileSync(path,'utf8');
const read=path=>JSON.parse(source(path));
const studies=[
 ...read('data/tutor-indicator-study-v1.json').guides,
 ...read('data/tutor-indicator-expansion-v1.json').guides
];
const late=read('data/talia-indicators61-73-evidence-v1.json');
const earlier=read('data/talia-indicators46-60-evidence-v1.json');
const app=source('assets/js/crownlight-echarts-studio-v1.js');
const math=source('assets/js/crownlight-indicator-math-v2.js');
const tutorBridge=source('assets/js/crownlight-talia-echarts-bridge-v1.js');
const access=source('functions/api/chart-tier-access.js');
const enginePolicy=source('functions/_lib/learning-engine-tier-policy-v1.js');

test('73 independent study guide subjects must never be mistaken for 73 released live ECharts overlays',()=>{
 assert.equal(studies.length,73);
 assert.equal(new Set(studies.map(x=>x.code)).size,73);
 assert.deepEqual(late.items.map(x=>x.code),studies.slice(60).map(x=>x.code));
 assert.deepEqual(earlier.records.map(x=>x.id),studies.slice(45,60).map(x=>x.code));
 const enabledBlock=app.match(/const enabled=\{([^}]+)\};/);
 assert.ok(enabledBlock,'Actual ECharts presentation controls must be inspected');
 const toggles=[...enabledBlock[1].matchAll(/([a-z0-9]+):(?:true|false)/g)].map(x=>x[1]);
 assert.deepEqual(toggles,[
  'ema9','ema20','ema200','sma20','vwap','bb20','hod','lod',
  'volma20','structure','rsi14','macd','atr14'
 ]);
 assert.equal(toggles.length,13);
 assert.equal(studies.filter(x=>x.officialCompetency===true).length,0);
 assert.match(app,/m\.vwapProxy\(bars\)/);
 assert.match(app,/HLC3 bar proxy/);
 assert.match(math,/HLC3 VWAP is an approximation/);
 assert.match(app,/CrownlightIndicatorMath/);
 assert.ok(toggles.length<studies.length,
  'Never represent research coverage as 73 production Chart Studio features');
});

test('71 math examples and two licensed/methodological holds are distinct from final publisher acceptance',()=>{
 const numerical=15+15+15+
  earlier.records.filter(x=>x.caseStatus==='ORIGINAL_INDEPENDENT_PYTHON_JS_CASE_CONFIGURED').length+
  late.items.filter(x=>x.numericalTestStatus==='INDEPENDENT_PYTHON_JAVASCRIPT_FICTIONAL_CASE_CONFIGURED').length;
 assert.equal(numerical,71);
 assert.deepEqual([
  earlier.records.find(x=>x.id==='STUDY_SCTR')?.caseStatus,
  late.items.find(x=>x.code==='STUDY_VIX_CONTEXT')?.numericalTestStatus
 ],['PROPRIETARY_SOURCE_NOT_NUMERICALLY_REPRODUCIBLE','NO_NUMERICAL_EMULATION_OFFICIAL_BENCHMARK']);
 assert.equal(late.items.filter(x=>x.independentPublicationApproved).length,0);
 assert.equal(late.items.filter(x=>x.marketDataReuseApproved).length,0);
 assert.equal(late.items.filter(x=>x.chartStudioParityAccepted).length,0);
});

test('tier targets and member ECharts source bridge cannot grant Learning/Lab/Tutor premium editions',()=>{
 assert.equal(TALIA_PREMIUM_RESEARCH_RELEASED,false);
 for(const plan of ['FREE','FOUNDING_14','FOUNDING_30','FOUNDING_60','LIFETIME']){
  const p=enginePolicyForPlan(plan);
  assert.equal(p.premiumFeaturesReleased,false,plan);
  assert.equal(p.addOnCheckoutEnabled,false,plan);
  assert.equal(p.effectiveCapabilities.learning,'BASIC');
  assert.equal(p.effectiveCapabilities.lab,'BASIC');
  assert.equal(p.effectiveCapabilities.tutor,'FOUNDATION');
 }
 assert.match(enginePolicy,/No checkout price, premium feature grant/);
 assert.match(tutorBridge,/An event is NOT server authorization/);
 assert.match(tutorBridge,/getSupabaseClient/);
 assert.match(access,/import \{toolAccess\} from '\.\/member-tool-access\.js'/);
 assert.match(access,/verifiedNoncommercialChartTier/);
 // Chart tier entitlement and separate future Learning/Lab/Tutor tier are distinct products.
 assert.ok(!app.includes('TALIA_PREMIUM_RESEARCH_RELEASED=true'));
});

test('the current chart bridge requires member identity and only revealed bars; real account acceptance remains separate',()=>{
 assert.match(tutorBridge,/getUser/);
 assert.match(tutorBridge,/getSession/);
 assert.match(tutorBridge,/crownlight:revealed-bars/);
 assert.match(tutorBridge,/Member session changed/);
 assert.match(app,/CrownlightEChartsStudio/);
 assert.match(app,/crownlight:member-changed/);
 assert.doesNotMatch(tutorBridge,/\blocalStorage\b|\bsessionStorage\b/);
});
