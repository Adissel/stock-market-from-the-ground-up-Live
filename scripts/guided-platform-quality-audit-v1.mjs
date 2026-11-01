/**
 * Guided Learning competitive-quality evidence V1 (2026-11-01).
 * Read-only source audit: never grades students, grants products or implies editorial approval.
 * Run: node scripts/guided-platform-quality-audit-v1.mjs
 * Output: artifacts/guided-platform-quality-audit-v1.json (local CI report).
 */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const source=read('data/lab-teaching-bridges-v014168.json');
const bridge=JSON.parse(source);
const mapping=JSON.parse(read('data/competency-lab-paths-v01499.json'));
const competencies=JSON.parse(read('data/competency-study-guides-v01499.json'));
const baseIndicators=JSON.parse(read('data/tutor-indicator-study-v1.json'));
const extraIndicators=JSON.parse(read('data/tutor-indicator-expansion-v1.json'));
const baseGuided=JSON.parse(read('data/tutor-guided-practice-v1.json'));
const extraGuided=JSON.parse(read('data/tutor-guided-practice-expansion-v1.json'));
const allGuides=[...baseIndicators.guides,...extraIndicators.guides];
const allGuided=[...baseGuided.modules,...extraGuided.modules];
const rows=Object.entries(bridge.entries||{});
const facets=['understand','recognize','apply','mistake','limits'];
assert.equal(rows.length,419,'Canonical Lab inventory changed');
assert.equal(mapping.totalCanonicalLabs,419);
assert.equal(Object.keys(mapping.byLab).length,419);
assert.equal(competencies.guides.length,30);
assert.equal(new Set(competencies.guides.map(x=>x.code)).size,30);
assert.equal(baseIndicators.guides.length,61);
assert.equal(extraIndicators.guides.length,12);
assert.equal(allGuides.length,73);
assert.equal(new Set(allGuides.map(x=>x.code)).size,73);
assert.equal(baseGuided.modules.length,134);
assert.equal(extraGuided.modules.length,12);
assert.equal(allGuided.length,146);
assert.equal(new Set(allGuided.map(x=>x.id)).size,146);
const moduleCodes=new Set(allGuided.filter(x=>x.kind==='indicator').map(x=>x.guideCode));
assert.equal(moduleCodes.size,73);
for(const guide of allGuides)assert.ok(moduleCodes.has(guide.code),'Missing Tutor module: '+guide.code);
assert.equal(academyPrograms.length,10);
assert.equal(academyPrograms.reduce((n,p)=>n+p.days,0),274);
const lineOccurrences=new Map();
for(const [id,row] of rows){
 assert.equal(row.labId,id,'Lab identity drift');
 assert.ok(mapping.byLab[id],'Unregistered Lab');
 for(const facet of facets){
  assert.ok(Array.isArray(row.tabs?.[facet])&&row.tabs[facet].length>0,'Missing Lab facet '+id+'/'+facet);
  for(const paragraph of row.tabs[facet]){
   const value=String(paragraph||'').trim();
   assert.ok(value.length>14,'Empty Lab teaching paragraph '+id);
   lineOccurrences.set(value,(lineOccurrences.get(value)||0)+1);
  }
 }
}
const frequentlyRepeated=[...lineOccurrences.entries()]
 .filter(([,count])=>count>=30)
 .sort((a,b)=>b[1]-a[1])
 .map(([paragraph,count])=>({count,paragraph}));
const repeatedSet=new Set(frequentlyRepeated.map(x=>x.paragraph));
const labFindings=rows.map(([id,row])=>{
 const paragraphs=facets.flatMap(k=>row.tabs[k]);
 const repeated=paragraphs.filter(p=>repeatedSet.has(p.trim())).length;
 const transfer=row.transfer;
 return {
  id,title:row.title,
  subjectSpecificSource:String(row.instructionSource||'').startsWith('ORIGINAL_SUBJECT_SPECIFIC_'),
  independentTransferDraft:transfer?.type==='ungraded_independent_practice'&&
   transfer?.graded===false&&transfer?.requiresNewEvidence===true&&transfer?.noLookahead===true&&
   typeof transfer?.prompt==='string'&&transfer.prompt.trim().length>30,
  frequentlyRepeatedParagraphs:repeated,
  editorialApproved:false
 };
});
const count=predicate=>labFindings.filter(predicate).length;
const subjectSpecific=count(x=>x.subjectSpecificSource);
const transferDrafts=count(x=>x.independentTransferDraft);
const repeatedAffected=count(x=>x.frequentlyRepeatedParagraphs>0);
const report={
 documentId:'SMFGU-EDU-COMPETITIVE-QA-001',
 reportVersion:'1.0',
 sourceSha256:createHash('sha256').update(source).digest('hex'),
 status:'SOURCE AUDIT ONLY — NO EDITORIAL OR MEMBER ACCEPTANCE',
 method:'Structural source assertions; repeated paragraph threshold 30+ across the five Lab teaching facets',
 inventory:{labs:419,competencies:30,bootCampPrograms:10,bootCampDays:274,freeFoundationsDays:5,
   tutorIndicatorGuides:73,tutorGuidedModules:146,sourceComputedChartStudies:16},
 findings:{
  subjectSpecificSourceTagged:subjectSpecific,
  subjectSpecificSourceTaggedPct:Number((100*subjectSpecific/419).toFixed(2)),
  independentTransferDrafts:transferDrafts,
  independentTransferDraftsPct:Number((100*transferDrafts/419).toFixed(2)),
  labsWithFrequentlyRepeatedParagraphs:repeatedAffected,
  labsWithFrequentlyRepeatedParagraphsPct:Number((100*repeatedAffected/419).toFixed(2)),
  individuallyIndependentlyAcceptedLabs:0
 },
 provenanceNotes:[
  'Subject-specific source tag is not independent editorial approval.',
  'An independent-transfer draft is not an official reviewed or graded assessment.',
  'Frequent phrases indicate review candidates; boilerplate detection is not proof of inaccurate instruction.',
  'Free-course, Browser, RLS, assessment, historical feed, Chart Studio and payments require separate authenticated acceptance.'
 ],
 frequentlyRepeated:frequentlyRepeated.slice(0,30),
 perLab:labFindings
};
mkdirSync(new URL('../artifacts/',import.meta.url),{recursive:true});
writeFileSync(new URL('../artifacts/guided-platform-quality-audit-v1.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log('PASS source integrity: '+rows.length+' Labs, 73 Tutor indicator guides, 146 guided modules, 274 Boot Camp days.');
console.log('EDITORIAL OPEN: '+subjectSpecific+'/419 source-tagged subject-specific; '+transferDrafts+'/419 transfer drafts; '+repeatedAffected+'/419 need repeat-content inspection.');
console.log('NOT A RELEASE ACCEPTANCE: external competitor hands-on, real-member browser and private grading remain outstanding.');
