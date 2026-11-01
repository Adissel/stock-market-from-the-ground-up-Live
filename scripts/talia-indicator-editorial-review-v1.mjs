/* SMFGU-TALIA-INDICATOR-REVIEW-001 — all source guide editorial triage.
 * A valid source URL is NOT proof that its contents were checked. A computed
 * fictional case is NOT a licensed chart overlay or a signed-off lesson.
 */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {TALIA_STUDY_CALCULATED,indicatorWorkedTeaching} from '../functions/_lib/talia-indicator-worked-v1.js';
const read=name=>JSON.parse(readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));
const base=read('tutor-indicator-study-v1.json').guides;
const extra=read('tutor-indicator-expansion-v1.json').guides;
const programs=[...read('tutor-guided-practice-v1.json').modules,...read('tutor-guided-practice-expansion-v1.json').modules];
assert.equal(base.length,61);assert.equal(extra.length,12);assert.equal(programs.filter(x=>x.kind==='indicator').length,73);
const studies=[...base,...extra],guides=new Set(studies.map(g=>g.code));
assert.equal(guides.size,73);
const mathSet=new Set(TALIA_STUDY_CALCULATED);
assert.equal(mathSet.size,5);
const urlHost=new Set(['chartschool.stockcharts.com','toslc.thinkorswim.com','www.sec.gov','sec.gov','www.investor.gov','investor.gov','www.finra.org','finra.org']);
const records=studies.map((g,i)=>{
 const candidate=programs.filter(p=>p.kind==='indicator'&&p.guideCode===g.code);
 assert.equal(candidate.length,1,'Missing or duplicate guided module: '+g.code);
 const warnings=[];
 for(const property of ['title','concept','formula','whyUse','howToUse','procedure','limit','invalidation','commonError','selfCheck','reviewExplanation','fictionalPrompt']){
  if(typeof g[property]!=='string'||!g[property].trim())warnings.push('missing_'+property);
 }
 if(g.officialCompetency!==false)warnings.push('not_clearly_ungraded');
 if(!Array.isArray(g.sourceUrls)||!g.sourceUrls.length)warnings.push('missing_source_reference');
 else for(const u of g.sourceUrls){
  try{const url=new URL(u);if(url.protocol!=='https:'||!urlHost.has(url.hostname)||url.username||url.password)warnings.push('untrusted_reference_host')}
  catch{warnings.push('invalid_reference_url')}
 }
 if(String(g.formula||'').length<30)warnings.push('brief_formula_requires_expansion');
 if(String(g.procedure||'').length<120)warnings.push('short_teaching_procedure_review');
 if(String(g.commonError||'').length<35)warnings.push('weak_misconception_note');
 const math=mathSet.has(g.code);
 if(math&&!indicatorWorkedTeaching(g.code,'Explain'))warnings.push('numeric_fixture_not_rendered');
 if(i>=61&&candidate[0].metric!=='study-concept')warnings.push('unexpected_unverified_chart_calculation');
 const cleared=warnings.filter(w=>w==='missing_title'||w==='missing_concept'||w==='missing_formula'||w==='missing_procedure'||w==='not_clearly_ungraded'||w==='missing_source_reference'||w==='untrusted_reference_host'||w==='invalid_reference_url'||w==='numeric_fixture_not_rendered'||w==='unexpected_unverified_chart_calculation');
 return {
  code:g.code,title:g.title,origin:i<61?'existing_61':'extension_12',family:g.family,
  canonicalGuidedModuleId:candidate[0].id,
  sourceReferenceUrls:g.sourceUrls,
  referenceSourceReachability:'NOT_CHECKED',formulaVariantFactCheck:'PENDING_INDEPENDENT_REVIEW',
  formulaWarmupCheck:'PENDING_INDEPENDENT_REVIEW',
  observedNumericalWorkedFixture:math,
  sourceOnlyComputationAvailable:math,
  independentMemberInstructionAcceptance:false,
  independentlyEditoriallyApproved:false,
  operationalChartStudyFromThisExpansion:false,
  guidedTeachingMode:candidate[0].metric,
  defectFlags:warnings,structuralBlockers:cleared
 };
});
assert.equal(records.length,73);
assert.equal(records.filter(x=>x.sourceOnlyComputationAvailable).length,8);
assert.equal(records.filter(x=>x.origin==='extension_12').length,12);
assert.equal(records.filter(x=>x.structuralBlockers.length).length,0,
 'Mandatory source/guide structural defects: '+JSON.stringify(records.filter(x=>x.structuralBlockers.length).map(x=>({id:x.code,errors:x.structuralBlockers}))));
const out={
 documentId:'SMFGU-TALIA-INDICATOR-REVIEW-001',version:'1.0',
 status:'automatic_structure_triage_not_editorial_acceptance',
 inventory:73,originalGuides:61,addedGuides:12,
 publicGuidedIndicatorLessons:73,newSourceOnlyComputedCaseIds:[...mathSet],
 sourceOnlyComputedCaseCount:8,independentlyEditoriallyAccepted:0,
 computedChartStudioOverlaysAdded:0,
 pending:records.filter(x=>x.defectFlags.length).length,
 note:'Automated structural triage only. No external URL content was downloaded or verified, and no person verified correctness or accepted 73 guides. Computed arithmetic fixtures are not full interactive chart implementations.',
 records
};
mkdirSync('artifacts',{recursive:true});
writeFileSync('artifacts/talia-indicator-editorial-review-v1.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({documentId:out.documentId,inventory:73,structureValid:73,computedEducationalCases:5,flags:out.pending,editoriallyAccepted:0}));
