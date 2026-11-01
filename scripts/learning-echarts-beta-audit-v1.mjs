/* Closed-beta instructional readiness audit: local repository sources only.
 * Scope: all 419 canonical Lab IDs, ten Academy programs (274 days),
 * the Free five-day course, 61 original + 12 extended Tutor indicator briefs and four Chart Studio selections.
 * Structural acceptance is NOT a substitute for individual editorial signoff,
 * authenticated production browser tests, or historical data provenance.
 */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {academyPrograms,academyByCode} from '../functions/_lib/bootcamp-academy-v014168.js';
import '../assets/js/prototype-indicator-workbench-v2.js';
import {FOUNDATION_WORKED_MATH_CODES} from '../functions/_lib/tutor-foundation-worked-math-v1.js';
import {FOUNDATION_QUANT_TOPICS} from '../functions/_lib/talia-foundation-quant-v1.js';
import {FOUNDATION_RISK_MATH_TOPICS} from '../functions/_lib/talia-foundation-risk-quant-v1.js';
import {TALIA_RESEARCH_MATH_CODES} from '../functions/_lib/talia-research-math-v1.js';
import {TALIA_STUDY_CALCULATED} from '../functions/_lib/talia-indicator-worked-v1.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const map=JSON.parse(read('data/competency-lab-paths-v01499.json'));
const bridge=JSON.parse(read('data/lab-teaching-bridges-v014168.json'));
const guides=JSON.parse(read('data/competency-study-guides-v01499.json'));
const official=new Set(guides.guides.map(x=>x.code));
const critical=[],editorial=[],metrics={labs:0,labFacets:0,academyPrograms:0,academyDays:0,originalAcademyDays:0,newBetaAcademyDays:0,
 freeDays:5,studios:4,competencies:official.size,indicatorBriefs:0,tutorCalculatedStudies:0,
 tutorInterpretationOnlyStudies:0,computedChartStudies:0,extendedIndicatorBriefs:0,totalTutorIndicatorBriefs:0,foundationWorkedMathTopics:0,tutorExplanationTarget:600,extendedIndicatorGuided:0,totalTutorGuidedLessons:0,foundationSupplementalTopicDrafts:0,foundationQuantTopics:0,foundationRiskQuantTopics:0,foundationResearchQuantTopics:0,sourceOnlyIndicatorComputedExamples:0};
const facets=['understand','recognize','apply','mistake','limits'];
const fail=(id,reason)=>critical.push({id,reason});
// Inspect the authoritative first-party chart registry, not a copied metric.
// The 61 Tutor briefs, 53 synthetic Tutor calculations and computed chart
// overlays are separate inventories and must never be conflated.
const computedChartRegistry=globalThis.CrownlightPrototypeIndicators?.specs;
metrics.computedChartStudies=Array.isArray(computedChartRegistry)?computedChartRegistry.length:0;
if(metrics.computedChartStudies!==16||
   new Set((computedChartRegistry||[]).map(x=>x.id)).size!==16||
   !computedChartRegistry?.some(x=>x.id==='EMA_200'))
 fail('computed_chart_studies','Expected 16 distinct first-party Chart Studio studies, including EMA 200. Audit the actual adapter before publishing counts.');
const pending=(id,reason)=>editorial.push({id,reason});
if(map.totalCanonicalLabs!==419||Object.keys(map.byLab).length!==419||
  bridge.canonicalLabCount!==419||Object.keys(bridge.entries).length!==419)fail('curriculum','419-source canonical mismatch');
if(official.size!==30)fail('competencies','Expected 30 reviewed competency codes');
for(const [id,lab] of Object.entries(map.byLab)){
 metrics.labs++;
 const row=bridge.entries[id];
 if(!row){fail(id,'Missing individual teaching bridge');continue}
 if(row.labId!==id||row.title!==lab.title||row.collection!==lab.bookCode)
  fail(id,'Teaching identity or collection differs from the canonical Lab');
 if(!official.has(row.mappedGuideCode))fail(id,'Unknown official competency guide');
 if(!Array.isArray(lab.relatedCompetencies)||!lab.relatedCompetencies.some(v=>official.has(v)))
  fail(id,'No valid competency context');
 const textOf=[];
 for(const facet of facets){
  const blocks=row.tabs?.[facet];
  if(!Array.isArray(blocks)||blocks.length<3||blocks.some(s=>typeof s!=='string'||s.trim().length<15)){
   fail(id,'Absent or shallow '+facet+' instruction');continue;
  }
  const words=blocks.join(' ').trim();
  if(words.length<160)fail(id,'Insufficient '+facet+' instruction');
  metrics.labFacets++;
  textOf.push(words.toLowerCase());
 }
 if(new Set(textOf).size!==5)fail(id,'Identical teaching used for different instructional purposes');
 if(row.independentGrade===true||row.verifiedHistory===true)fail(id,'Public teaching bridge claims an independent grade or verified historical data');
 if(/PENDING|PROVISIONAL/i.test(String(row.instructionSource||'')+' '+String(row.sourceStatus||'')))
  pending(id,'Final individual editorial/provenance signoff not established; permitted only in closed educational beta');
 const keyWords=lab.title.toLowerCase().match(/[a-z]{5,}/g)||[];
 const distinct=[...new Set(keyWords)].filter(w=>!/about|using|while|stock|market|trading|understand|review|reading|basic|practice|identify|different/.test(w));
 if(distinct.length&&textOf.length===5&&!distinct.some(w=>textOf.join(' ').includes(w)))
  pending(id,'Reviewer should verify topic-specific wording against exact canonical title');
}
const durations={truth5:5,watchlist7:7,scanners10:10,foundations30:30,charts45:45,
 risk60:60,practicum90:90,tape10:10,indicators10:10,filings7:7};
const betaCodes=new Set(['tape10','indicators10','filings7']);
const indicatorBriefs=JSON.parse(read('data/tutor-indicator-study-v1.json'));
const extensionBriefs=JSON.parse(read('data/tutor-indicator-expansion-v1.json'));
const tutorGuided=JSON.parse(read('data/tutor-guided-practice-v1.json'));
const guidedExtension=JSON.parse(read('data/tutor-guided-practice-expansion-v1.json'));
const foundationTopics=JSON.parse(read('data/talia-foundation-explanations-batch01-v1.json'));
const secondTopicBatch=JSON.parse(read('data/talia-foundation-explanations-batch02-v1.json'));
const thirdTopicBatch=JSON.parse(read('data/talia-foundation-explanations-batch03-v1.json'));
const fourthTopicBatch=JSON.parse(read('data/talia-foundation-explanations-batch04-v1.json'));
const fifthTopicBatch=JSON.parse(read('data/talia-foundation-explanations-batch05-v1.json'));
metrics.foundationRiskQuantTopics=FOUNDATION_RISK_MATH_TOPICS.length;
metrics.foundationResearchQuantTopics=TALIA_RESEARCH_MATH_CODES.length;
metrics.sourceOnlyIndicatorComputedExamples=TALIA_STUDY_CALCULATED.length;
metrics.foundationQuantTopics=FOUNDATION_QUANT_TOPICS.length;
metrics.foundationSupplementalTopicDrafts=(foundationTopics.guides?.length||0)+(secondTopicBatch.guides?.length||0)+(thirdTopicBatch.guides?.length||0)+(fourthTopicBatch.guides?.length||0)+(fifthTopicBatch.guides?.length||0);
if(foundationTopics.goal!==600||secondTopicBatch.goal!==600||thirdTopicBatch.goal!==600||fourthTopicBatch.goal!==600||fifthTopicBatch.goal!==600||foundationTopics.count!==20||
  secondTopicBatch.count!==20||thirdTopicBatch.count!==20||fourthTopicBatch.count!==20||fifthTopicBatch.count!==20||metrics.foundationSupplementalTopicDrafts!==100||metrics.foundationQuantTopics!==9||metrics.foundationRiskQuantTopics!==9||metrics.foundationResearchQuantTopics!==14||
  metrics.sourceOnlyIndicatorComputedExamples!==8||
  [...foundationTopics.guides,...secondTopicBatch.guides,...thirdTopicBatch.guides,...fourthTopicBatch.guides,...fifthTopicBatch.guides].some(g=>g.officialCompetency!==false||g.independentEditorialApproved!==false)||
  new Set([...foundationTopics.guides,...secondTopicBatch.guides,...thirdTopicBatch.guides,...fourthTopicBatch.guides,...fifthTopicBatch.guides].map(g=>g.code)).size!==100)
 fail('foundation_600_topic_batch','Expected one hundred distinct ungraded Foundation explanation drafts, fourteen research numeric topics, and eight indicator numeric examples');
const indicatorModules=tutorGuided.modules?.filter(m=>m.kind==='indicator')||[];
const mapped=new Map(indicatorModules.map(m=>[m.guideCode,m]));
metrics.indicatorBriefs=indicatorBriefs.guides?.length||0;
metrics.extendedIndicatorBriefs=extensionBriefs.guides?.length||0;
metrics.totalTutorIndicatorBriefs=metrics.indicatorBriefs+metrics.extendedIndicatorBriefs;
metrics.foundationWorkedMathTopics=FOUNDATION_WORKED_MATH_CODES.length;
metrics.extendedIndicatorGuided=guidedExtension.modules?.length||0;
metrics.totalTutorGuidedLessons=(tutorGuided.modules?.length||0)+metrics.extendedIndicatorGuided;
if(guidedExtension.indicatorCount!==12||guidedExtension.interpretationOnlyIndicatorCountAdded!==12||
  metrics.extendedIndicatorGuided!==12||metrics.totalTutorGuidedLessons!==146||
  new Set([...(tutorGuided.modules||[]),...guidedExtension.modules].map(x=>x.id)).size!==146||
  new Set(guidedExtension.modules.map(x=>x.guideCode)).size!==12||
  guidedExtension.modules.some(x=>x.metric!=='study-concept'||
    !extensionBriefs.guides.some(g=>g.code===x.guideCode&&g.title===x.title)))
 fail('foundation_guided_indicator_expansion','Expected 12 nonduplicate ungraded interpretation-only guided lessons with matching 12 source briefs');
if(extensionBriefs.count!==12||metrics.totalTutorIndicatorBriefs!==73||metrics.foundationWorkedMathTopics!==13||
  extensionBriefs.guides.some(x=>x.officialCompetency!==false||x.masterStudy!==true)||
  new Set([...indicatorBriefs.guides,...extensionBriefs.guides].map(x=>x.code)).size!==73)
 fail('foundation_tutor_expansion','Unexpected 73-guide / 13-worked-math Foundation Tutor source or duplicate indicator ID');
metrics.tutorCalculatedStudies=indicatorModules.filter(m=>m.metric!=='study-concept').length;
metrics.tutorInterpretationOnlyStudies=indicatorModules.filter(m=>m.metric==='study-concept').length;
if(indicatorBriefs.count!==61||metrics.indicatorBriefs!==61||mapped.size!==61||
  tutorGuided.indicatorCount!==61||tutorGuided.numericIndicatorCount!==53||
  tutorGuided.interpretationOnlyIndicatorCount!==8||
  metrics.tutorCalculatedStudies!==53||metrics.tutorInterpretationOnlyStudies!==8)
 fail('indicators','Authoritative 61-study / 53-calculated / 8-interpretation Tutor registry drift');
for(const guide of indicatorBriefs.guides||[]){
 const module=mapped.get(guide.code);
 if(!module||module.guideCode!==guide.code||!guide.title||!guide.family||!guide.concept)
  fail(guide.code,'Tutor module lacks a matching authored indicator reference');
 if(module?.kind!=='indicator'||!Array.isArray(module.options)||!Number.isInteger(module.correct)||
    module.correct<0||module.correct>=module.options.length||
    !Array.isArray(module.transferOptions)||!Number.isInteger(module.transferCorrect)||
    module.transferCorrect<0||module.transferCorrect>=module.transferOptions.length)
  fail(guide.code,'Missing safe ungraded practice and independent transfer choice');
}
if(academyPrograms.length!==10||new Set(academyPrograms.map(p=>p.code)).size!==10)
 fail('academy','Exactly ten canonical Boot Camps must be recorded');
for(const [code,length] of Object.entries(durations)){
 const program=academyByCode[code];metrics.academyPrograms++;
 if(!program||program.days!==length||program.curriculum?.length!==length){fail(code,'Wrong Boot Camp duration');continue}
 const labels=new Set();
 for(const [index,day] of program.curriculum.entries()){
  const id=code+':'+(index+1);metrics.academyDays++;
  if(betaCodes.has(code))metrics.newBetaAcademyDays++;else metrics.originalAcademyDays++;
  if(day.day!==index+1||day.programCode!==code)fail(id,'Day sequence/program identity mismatch');
  for(const field of ['title','objective','observe','practice']){
   if(typeof day[field]!=='string'||day[field].trim().length<12)fail(id,'Missing individual '+field);
  }
  if(!String(day.limitation||day.caution||'').trim())fail(id,'Missing interpretation/risk limitation');
  if(day.officiallyGraded!==false||day.masteryAwarded!==false)fail(id,'Ungraded Boot Camp must not grant mastery');
  for(const link of day.relatedLabs||[])if(!map.byLab[link.id])fail(id,'Invalid linked Lab '+link.id);
  if(labels.has(day.title))pending(id,'Repeated day title needs editorial differentiation');
  labels.add(day.title);
 }
}
if(metrics.academyDays!==274||metrics.originalAcademyDays!==247||metrics.newBetaAcademyDays!==27)
 fail('academy','Wrong total of ten course durations or original-versus-beta split');
const freeSource=read('functions/_lib/free-foundations-v1.js');
const freeStudio=read('assets/js/free-foundations-teaching-studio-v3.js');
if(!/five|Five/.test(freeSource)||!freeStudio.includes('GroundUpFreeStudioV3'))fail('free5','Free Foundations teaching bridge unavailable');
const page=read('bootcamp-academy.html');
const member=read('lab-player.html');
const engine=read('assets/js/lab-engine-v32-universal.js');
const charts=read('assets/js/crownlight-chart-tiers-v1.js');
const chartApi=read('functions/api/chart-tier-access.js');
const echart=read('assets/js/crownlight-learning-echarts-v1.js');
const loader=read('assets/js/crownlight-echarts-loader-v1.js');
for(const path of ['lab-player.html','bootcamp-academy.html','bootcamp.html','simulator.html','market-tutor.html','dashboard.html']){
 if(!read(path).includes('crownlight-learning-echarts-v1.js'))fail(path,'Missing shared ECharts teaching integration');
}
if(!member.includes('lab-engine-v32-universal.js')||!engine.includes('CrownlightLearningEChartsV1'))fail('labs','Shared engine integration missing');
if(!page.includes('GroundUp')&&!page.includes('academy-lab-slot'))fail('academy','Academy learner workstation missing');
for(const mode of ['STANDARD','ECHARTS','ADVANCED','PROFESSIONAL'])if(!charts.includes(mode))fail('studios','Missing Studio option '+mode);
if(!charts.includes("t==='ECHARTS'?'STANDARD':t")||!chartApi.includes('allowed'))fail('studios','ECharts choice or server entitlement gate missing');
if(!/Free|FREE/.test(chartApi)||!charts.includes('state.verified'))fail('studios','Free/verified chart boundary unavailable');
if(!echart.includes('checkCalculation')||!echart.includes('without Lumens')||!echart.includes('ungraded')||
   !echart.includes('gu-echarts-table')||!echart.includes('HIGH '))fail('charts','ECharts worksheet or accessibility/instruction safeguards missing');
if(!loader.includes('/assets/vendor/echarts/6.1.0/echarts.min.js'))fail('charts','Self-hosted pinned ECharts build absent');
if(!engine.includes("['blind','assessment'].includes(mode)")||!engine.includes('progressStore'))
 fail('grading','Private grading or progress authorization boundary missing');
if(!read('tests/test_crownlight_chart_tiers_v1.mjs').includes("FOUNDER")&&
  !read('tests/test_crownlight_chart_tiers_v1.mjs').includes("FOUNDING"))
 fail('entitlement','Server tier acceptance tests not connected');
const result={documentId:'SMFGU-LEARN-BETA-AUDIT-001',version:'1.0',scope:'SOURCE-ONLY / CLOSED BETA',
 metrics:{...metrics,academyAndFreeDays:metrics.academyDays+metrics.freeDays},
  computedChartStudyIds:Array.isArray(computedChartRegistry)?computedChartRegistry.map(x=>x.id):[],
 critical,editorialReviewPending:editorial,criticalCount:critical.length,editorialFlags:editorial.length,
 note:'Ten Academy courses and 73 Tutor indicator teaching briefs are inventoried (61 original plus 12 new pending editorial review), not independently accepted. All 73 Tutor indicator briefs now have corresponding guided practice modules (61 existing + 12 new interpretation-only). 53 original ungraded numerical demos and 16 actual Chart Studio studies remain distinct. The owner target is 600 individually editorial-accepted Tutor explanations; twenty additional original supplementary Foundation topics are source-authored, not individually accepted, and they do not change the 30 official competencies. No private grade, historical license or real-member QA is implied.'};
mkdirSync('artifacts',{recursive:true});
writeFileSync('artifacts/learning-echarts-beta-audit-v1.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({metrics:result.metrics,critical:critical.slice(0,12),criticalCount:critical.length,editorialFlags:editorial.length}));
assert.equal(critical.length,0,'Critical curriculum or entitlement gaps; see artifacts/learning-echarts-beta-audit-v1.json');
