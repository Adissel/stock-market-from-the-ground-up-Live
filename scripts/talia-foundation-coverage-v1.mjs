/* SMFGU-TALIA-COVERAGE-001 — reproducible source-only Tutor coverage inventory.
 * This does NOT create new official competencies, alter Lab/Boot Camp source,
 * view protected grades, or certify an ungraded editorial topic as approved.
 */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {FOUNDATION_WORKED_MATH_CODES} from '../functions/_lib/tutor-foundation-worked-math-v1.js';
import {FOUNDATION_QUANT_TOPICS} from '../functions/_lib/talia-foundation-quant-v1.js';
import {FOUNDATION_RISK_MATH_TOPICS} from '../functions/_lib/talia-foundation-risk-quant-v1.js';
import {TALIA_RESEARCH_MATH_CODES} from '../functions/_lib/talia-research-math-v1.js';
import {TALIA_STUDY_CALCULATED} from '../functions/_lib/talia-indicator-worked-v1.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const labs=read('data/competency-lab-paths-v01499.json');
const core=read('data/competency-study-guides-v01499.json').guides;
const baseline=read('data/tutor-indicator-study-v1.json').guides;
const extensions=read('data/tutor-indicator-expansion-v1.json').guides;
const guided=read('data/tutor-guided-practice-v1.json').modules;
const guidedMore=read('data/tutor-guided-practice-expansion-v1.json').modules;
const first=read('data/talia-foundation-explanations-batch01-v1.json').guides;
const second=read('data/talia-foundation-explanations-batch02-v1.json').guides;
const third=read('data/talia-foundation-explanations-batch03-v1.json').guides;
const fourth=read('data/talia-foundation-explanations-batch04-v1.json').guides;
const fifth=read('data/talia-foundation-explanations-batch05-v1.json').guides;
const sixth=read('data/talia-foundation-explanations-batch06-v1.json').guides;
const seventh=read('data/talia-foundation-explanations-batch07-v1.json').guides;
const eighth=read('data/talia-foundation-explanations-batch08-v1.json').guides;
const ninth=read('data/talia-foundation-explanations-batch09-v1.json').guides;
const tenth=read('data/talia-foundation-explanations-batch10-v1.json').guides;
const eleventh=read('data/talia-foundation-explanations-batch11-v1.json').guides;
const twelfth=read('data/talia-foundation-explanations-batch12-v1.json').guides;
const thirteenth=read('data/talia-foundation-explanations-batch13-v1.json').guides;
const fourteenth=read('data/talia-foundation-explanations-batch14-v1.json').guides;
const fifteenth=read('data/talia-foundation-explanations-batch15-v1.json').guides;
const sixteenth=read('data/talia-foundation-explanations-batch16-v1.json').guides;
assert.equal(labs.totalCanonicalLabs,419);
assert.equal(Object.keys(labs.byLab).length,419);
assert.equal(labs.mappedLabs,419);
assert.equal(core.length,30);
assert.equal(academyPrograms.length,10);
assert.equal(academyPrograms.reduce((n,p)=>n+p.curriculum.length,0),274);
assert.equal(baseline.length,61);assert.equal(extensions.length,12);
assert.equal(guided.length,134);assert.equal(guidedMore.length,12);
assert.equal(first.length,20);assert.equal(second.length,20);assert.equal(third.length,20);assert.equal(fourth.length,20);assert.equal(fifth.length,20);assert.equal(sixth.length,20);assert.equal(seventh.length,20);assert.equal(eighth.length,20);assert.equal(ninth.length,20);assert.equal(tenth.length,20);assert.equal(eleventh.length,20);assert.equal(twelfth.length,20);assert.equal(thirteenth.length,20);assert.equal(fourteenth.length,20);assert.equal(fifteenth.length,20);assert.equal(sixteenth.length,20);
assert.equal(FOUNDATION_WORKED_MATH_CODES.length,13);
assert.equal(FOUNDATION_QUANT_TOPICS.length,9);
const topics=[...first,...second,...third,...fourth,...fifth,...sixth,...seventh,...eighth,...ninth,...tenth,...eleventh,...twelfth,...thirteenth,...fourteenth,...fifteenth,...sixteenth];
assert.equal(new Set(topics.map(g=>g.code)).size,320);
assert.equal(new Set(topics.map(g=>g.title.toLowerCase())).size,320);
assert.equal(FOUNDATION_RISK_MATH_TOPICS.length,9);assert.equal(TALIA_RESEARCH_MATH_CODES.length,14);
assert.equal(TALIA_STUDY_CALCULATED.length,8);
const grades=new Set(core.map(x=>x.code));
assert.equal(grades.size,30);
for(const t of topics){
 assert.equal(t.independentEditorialApproved,false);
 assert.equal(t.officialCompetency,false);
 assert.equal(t.foundationTopic,true);
 assert.ok(!grades.has(t.code));
}
const stopped=new Set(['this','that','these','those','when','with','from','have','than','versus','stock','market','trading','using','price','share','shares','basic','about','rather','historical','fictional','analysis','reading','calculation','completed','trade','level','source','data','concept']);
const tokens=v=>new Set((String(v||'').toLowerCase().match(/[a-z]{5,}/g)||[]).filter(x=>!stopped.has(x)));
const matches=(subject,candidates,max=3)=>{
 const words=tokens(subject);
 return candidates.map(c=>{
  const terms=tokens(c.title+' '+(c.objective||''));
  const common=[...words].filter(w=>terms.has(w));
  return{id:c.id,title:c.title,sharedTerms:common,score:common.length};
 }).filter(x=>x.score>=2).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,max)
 .map(({score,...row})=>({...row,linkStatus:'unverified_editorial_candidate_only'}));
};
const labRecords=Object.entries(labs.byLab).map(([id,x])=>({id,title:x.title}));
const dayRecords=academyPrograms.flatMap(p=>p.curriculum.map((d,i)=>({
 id:p.code+':'+String(i+1).padStart(2,'0'),
 title:d.title,objective:d.objective
})));
const crosswalk=topics.map(t=>({
 topicId:t.code,title:t.title,
 sourceType:'original_supplemental_ungraded',
 sourceReferenceUrls:t.sourceUrls,
 candidateLabs:matches(t.title+' '+t.concept,labRecords),
 candidateBootCampDays:matches(t.title+' '+t.concept,dayRecords),
 editorReviewed:false,protectedGradingReference:false,independentAcceptance:false
}));
const metrics={
 officialCompetencies:grades.size,
 canonicalLabs:labRecords.length,
 mappedLabs:labs.mappedLabs,
 bootcampPrograms:academyPrograms.length,
 bootcampStudyDays:dayRecords.length,
 legacyIndicatorGuides:baseline.length,
 supplementaryIndicatorGuides:extensions.length,
 indicatorGuidesTotal:baseline.length+extensions.length,
 originalGuidedModules:guided.length,
 extraGuidedModules:guidedMore.length,
 guidedModulesTotal:guided.length+guidedMore.length,
 coreWorkedMathTopics:FOUNDATION_WORKED_MATH_CODES.length,
 extraQuantTeachingTopics:FOUNDATION_QUANT_TOPICS.length,extraRiskMathTeachingTopics:FOUNDATION_RISK_MATH_TOPICS.length,extraResearchMathTopics:TALIA_RESEARCH_MATH_CODES.length,sourceOnlyNumericalIndicatorExamples:TALIA_STUDY_CALCULATED.length,
 explanationDrafts:topics.length,explanationGoal:600,explanationDraftPercent:Number((topics.length/600*100).toFixed(2)),
 newlySignedOffExplanations:0,
 candidateLabMatches:crosswalk.reduce((n,x)=>n+x.candidateLabs.length,0),
 candidateBootCampMatches:crosswalk.reduce((n,x)=>n+x.candidateBootCampDays.length,0)
};
const result={documentId:'SMFGU-TALIA-COVERAGE-001',version:'1.0',status:'ungraded_public_source_only_not_editorially_accepted',metrics,
 note:'Keyword overlap is ONLY a possible editor cross-reference. Neither 320 drafted topics nor 419/274 IDs establish independently accepted Tutor instruction; no protected answer data or future replay events were opened.',crosswalk};
mkdirSync('artifacts',{recursive:true});
writeFileSync('artifacts/talia-foundation-coverage-v1.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({documentId:result.documentId,metrics,warning:result.note}));
