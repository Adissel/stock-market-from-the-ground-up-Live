// SMFGU-TALIA-SOURCE-QUALITY-023: internal source triage, not editorial acceptance.
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const legacyGeneric='https://school.stockcharts.com/doku.php?id=technical_indicators';
const edgarGeneric='https://www.sec.gov/edgar/search/';
const generic=new Set([edgarGeneric,'https://www.investor.gov/introduction-investing','https://www.investor.gov/introduction-investing/','https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators',legacyGeneric]);
const batches=[],issues=[],codes=new Set(),titles=new Set();
const stats={lessons:0,fictionalWorkedExamples:0,independentApprovals:0,missingSources:0,broadReferences:0,genericEdgarSearchReferences:0,unreconciledPriorGenericReferences:0,missingRightsMetadata:0,missingReviewObject:0,explicitNotReviewed:0,legacyGenericReferences:0,invalidLinks:0};
for(let n=1;n<=30;n++){
 const name='talia-foundation-explanations-batch'+String(n).padStart(2,'0')+'-v1.json';
 const guides=JSON.parse(readFileSync(new URL('../../data/'+name,import.meta.url),'utf8')).guides;
 assert.equal(guides.length,20,name);
 const row={batch:n,lessons:guides.length,independentApprovals:0,broadReferences:0,unreconciledPriorGenericReferences:0,missingRightsMetadata:0};
 for(const g of guides){
  stats.lessons++;
  assert.ok(!codes.has(g.code),'duplicate '+g.code);codes.add(g.code);
  const title=g.title.trim().toLowerCase();assert.ok(!titles.has(title),'duplicate title '+title);titles.add(title);
  assert.equal(g.officialCompetency,false,g.code);
  if(g.independentEditorialApproved){stats.independentApprovals++;row.independentApprovals++;}
  if(g.editorSourceReview?.reviewStatus==='NOT_REVIEWED') {stats.explicitNotReviewed++;issues.push({batch:n,code:g.code,type:'pending_independent_source_and_math_review'});}
  if(/^FICTIONAL:/i.test(g.workedCase||''))stats.fictionalWorkedExamples++;
  if(!g.sourceRightsStatus){stats.missingRightsMetadata++;row.missingRightsMetadata++;}
  if(!g.editorSourceReview){stats.missingReviewObject++;issues.push({batch:n,code:g.code,type:'review_object_missing'});}
  if(!Array.isArray(g.sourceUrls)||g.sourceUrls.length===0){stats.missingSources++;issues.push({batch:n,code:g.code,type:'missing_source'});continue;}
  for(const uri of g.sourceUrls){
   if(generic.has(uri)){stats.broadReferences++;row.broadReferences++;issues.push({batch:n,code:g.code,type:'generic_reference'});}
   if(uri===legacyGeneric)stats.legacyGenericReferences++;
   if(uri===edgarGeneric)stats.genericEdgarSearchReferences++;
   if(uri===g.previousGenericSourceUrl||(Array.isArray(g.previousGenericSourceUrls)&&g.previousGenericSourceUrls.includes(uri))){
    stats.unreconciledPriorGenericReferences++;row.unreconciledPriorGenericReferences++;
    issues.push({batch:n,code:g.code,type:'unreconciled_prior_generic_reference'});
   }
   try{const u=new URL(uri);if(u.protocol!=='https:'||u.username||u.password)throw Error('unsafe');}
   catch{stats.invalidLinks++;issues.push({batch:n,code:g.code,type:'invalid_source_url'});}
  }
 }
 batches.push(row);
}
assert.equal(stats.lessons,600);assert.equal(codes.size,600);assert.equal(titles.size,600);
assert.equal(stats.independentApprovals,0,'Independently approved topics need a reviewed acceptance update');
assert.equal(stats.missingRightsMetadata,0,'All topics require explicit source-rights hold metadata');
assert.equal(stats.missingReviewObject,0,'All topics require an explicit review state (not an approval)');
assert.equal(stats.unreconciledPriorGenericReferences,0,'Previous generic citations must be narrowed before internal source triage can close');
const report={documentId:'SMFGU-TALIA-SOURCE-QUALITY-023',version:'1.2',status:'internal_automated_triage_only',counts:stats,batches,issues,limits:['Source link is not proof that the page supports a lesson','No source or third-party publication rights were individually approved','No live member authorization, protected answers, or paid inference accessed']};
mkdirSync('artifacts',{recursive:true});writeFileSync('artifacts/talia-foundation-source-quality-v1.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({documentId:report.documentId,counts:stats,triageCount:issues.length}));
