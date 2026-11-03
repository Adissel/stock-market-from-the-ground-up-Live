// Talia owner draft milestone + 15-spec-edition + 73-source-indicator trace audit.
// Internal evidence ONLY; never an independent editorial, license or feature-release signoff.
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {TALIA_STUDY_CALCULATED} from '../../functions/_lib/talia-indicator-worked-v1.js';

const root=new URL('../../',import.meta.url);
const read=p=>JSON.parse(readFileSync(new URL(p,root),'utf8'));
const owner=read('data/talia-owner-draft-acceptance-600-v1.json');
const matrix=read('data/talia-four-edition-evidence-audit-v1.json');
const total=[],uniqueCodes=new Set(),uniqueTitles=new Set(),drift=[];
assert.equal(owner.ownerDecision,'OWNER_ACCEPTED_AUTHORING_COMPLETENESS_ONLY');
assert.equal(owner.sourceSnapshot.length,30);
assert.equal(owner.acceptedDraftCount,600);
for(const x of owner.sourceSnapshot){
 const bytes=readFileSync(new URL(x.path,root));
 const digest=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 if(digest!==x.blobSha)drift.push({batch:x.batch,previousBlobSha:x.blobSha,currentBlobSha:digest,reason:'source changed since owner accepted completeness; content-level review must be repeated'});
 const guides=JSON.parse(bytes.toString('utf8')).guides;
 assert.equal(guides.length,20,x.path);
 for(const [offset,g] of guides.entries()){
  const ordinal=(x.batch-1)*20+offset+1;
  assert.equal(g.foundationTopic,true,g.code);
  assert.equal(g.officialCompetency,false,g.code);
  assert.equal(g.independentEditorialApproved,false,g.code);
  assert.equal(g.editorSourceReview?.independentPublicationAccepted,false,g.code);
  assert.ok(g.status.includes('pending_independent_editorial_review'),g.code);
  assert.match(g.workedCase||'',/^FICTIONAL:/i,g.code);
  assert.ok(Array.isArray(g.sourceUrls)&&g.sourceUrls.length>=1,g.code);
  assert.ok(typeof g.sourceRightsStatus==='string'&&g.sourceRightsStatus.length>0,g.code);
  const title=g.title.trim().toLowerCase();
  assert.ok(!uniqueCodes.has(g.code)&&!uniqueTitles.has(title),g.code);
  uniqueCodes.add(g.code);uniqueTitles.add(title);
  total.push({ordinal,batch:x.batch,topicId:g.code,title:g.title,ownerAuthoringMilestoneAccepted:true,sourceSnapshotUnchanged:digest===x.blobSha,independentEditorialAccepted:false,sourceRightsCleared:false,officialCompetency:false,publicationAllowed:false});
 }
}
assert.equal(total.length,600);assert.equal(uniqueCodes.size,600);assert.equal(uniqueTitles.size,600);

const indicatorGuides=[...read('data/tutor-indicator-study-v1.json').guides,...read('data/tutor-indicator-expansion-v1.json').guides];
assert.equal(indicatorGuides.length,73);
const computedCodes=new Set(TALIA_STUDY_CALCULATED);
assert.equal(computedCodes.size,8);
const indicators=indicatorGuides.map((g,index)=>{
 assert.ok(typeof g.code==='string'&&g.sourceUrls.length>=1,g.code);
 assert.equal(g.officialCompetency,false,g.code);
 return {ordinal:index+1,code:g.code,title:g.title,
  sourceGuidePresent:true,sourceOnlyCalculatedExample:computedCodes.has(g.code),
  restrictedOfficialOrProprietary:index>=0&&['STUDY_SCTR','STUDY_VIX_CONTEXT'].includes(g.code),
  independentFormulaValidation:false,licensedChartOverlayAccepted:false,independentPublicationApproved:false};
});
assert.equal(new Set(indicators.map(x=>x.code)).size,73);
assert.ok(indicators.some(x=>x.code==='STUDY_SCTR'&&x.restrictedOfficialOrProprietary));
assert.ok(indicators.some(x=>x.code==='STUDY_VIX_CONTEXT'&&x.restrictedOfficialOrProprietary));

assert.equal(matrix.featureEvidence.length,15);
const editionStats={};
for(const edition of matrix.tiers){
 const items=matrix.featureEvidence.filter(x=>x.edition===edition);
 const required=edition==='FOUNDATION'?6:3;
 assert.equal(items.length,required,edition);
 let evidenced=0;
 for(const item of items){
  assert.equal(item.productionFeatureAccepted,false,item.id);
  assert.equal(item.authenticatedTierAccepted,false,item.id);
  assert.equal(item.independentEditorialAccepted,false,item.id);
  if(item.hasSourceEvidence){
   assert.ok(item.evidence.length>0,item.id);
   for(const ev of item.evidence){
    const contents=readFileSync(new URL(ev.path,root),'utf8');
    for(const anchor of ev.anchors)assert.ok(contents.includes(anchor),item.id+' anchor '+anchor+' in '+ev.path);
   }
   evidenced++;
  }else assert.equal(item.evidence.length,0,item.id);
 }
 editionStats[edition]={required,evidenced,sourceEvidencePercent:Number((100*evidenced/required).toFixed(1)),independentlyReleased:0,releaseHold:true};
}
assert.deepEqual(Object.values(editionStats).map(x=>x.evidenced),[6,2,3,1]);
const policy=readFileSync(new URL('functions/_lib/talia-tier-research-contracts-v1.js',root),'utf8');
assert.match(policy,/TALIA_PREMIUM_RESEARCH_RELEASED=false/);

const result={
 documentId:'SMFGU-TALIA-OWNER-AUDIT-600-15-73-001',asOf:'2026-11-03',
 ownerAuthoringAccepted:600,ownerAuthoringTarget:600,
 lessonCodeUniqueness:600,acceptedBatchCount:30,changedSourceBatchesSinceOwnerInventoryAcceptance:drift.length,
 independentEditorialApprovals:0,sourceRightsCleared:0,
 indicatorSourceGuides:indicators.length,sourceOnlyComputedExamples:computedCodes.size,
 independentlyAcceptedIndicatorOverlays:0,editionSourceEvidence:editionStats,
 overallSourceEvidence:{evidenced:12,required:15,percent:80},
 premiumFullyReleased:0,fullV4PreviouslyAcceptedGates:2,fullV4GateDenominator:5,
 warning:'Owner acceptance covers completed draft authoring only. Source evidence does not prove functional paid editions or release. This audit has NOT established independent mathematical, financial, IP, QA, accessibility or authenticated browser acceptance.'
};
mkdirSync('artifacts',{recursive:true});
writeFileSync('artifacts/talia-owner-600-draft-acceptance-v1.json',JSON.stringify({...result,ownerDecision:owner.ownerDecision,baselineCommit:owner.baselineCommit,sourceDrift:drift,lessons:total},null,2)+'\n');
writeFileSync('artifacts/talia-four-edition-source-evidence-v1.json',JSON.stringify({...result,features:matrix.featureEvidence},null,2)+'\n');
writeFileSync('artifacts/talia-indicator-73-methodology-holds-v1.json',JSON.stringify({documentId:'SMFGU-TALIA-INDICATOR-METHOD-73-001',asOf:'2026-11-03',status:'SOURCE_GUIDES_NOT_ACCEPTED_OVERLAYS',guides:indicators},null,2)+'\n');
console.log(JSON.stringify(result));
