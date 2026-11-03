// 600 owner draft-only acceptance checks + 73 indicator inventory + 15 edition source-evidence gates.
// This is not a professional reviewer signature or a product-launch authorization.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const read=p=>JSON.parse(readFileSync(new URL(p,root),'utf8'));
const owner=read('data/talia-owner-draft-acceptance-600-v1.json');
const editions=read('data/talia-four-edition-evidence-audit-v1.json');
const all=owner.sourceSnapshot.flatMap(x=>read(x.path).guides);
const indicator=[...read('data/tutor-indicator-study-v1.json').guides,...read('data/tutor-indicator-expansion-v1.json').guides];
test('Owner acceptance is authoring-only and all 30 source batches are individually identified',()=>{
 assert.equal(owner.acceptedDraftCount,600);
 assert.equal(owner.acceptedBatchCount,30);
 assert.equal(owner.ownerDecision,'OWNER_ACCEPTED_AUTHORING_COMPLETENESS_ONLY');
 assert.equal(owner.sourceSnapshot.length,30);
 assert.deepEqual(owner.sourceSnapshot.map(x=>x.batch),Array.from({length:30},(_,i)=>i+1));
 assert.equal(new Set(owner.sourceSnapshot.map(x=>x.blobSha)).size,30);
 assert.equal(new Set(all.map(g=>g.code)).size,600);
 assert.equal(new Set(all.map(g=>g.title.toLowerCase())).size,600);
 assert.equal(all.length,600);
 assert.equal(all.filter(g=>g.independentEditorialApproved).length,0);
});
for(const [i,g] of all.entries())test('Owner authoring only #'+(i+1)+' '+g.code,()=>{
 assert.equal(g.foundationTopic,true);
 assert.equal(g.officialCompetency,false);
 assert.equal(g.independentEditorialApproved,false);
 assert.equal(g.editorSourceReview?.independentPublicationAccepted,false);
 assert.match(g.status,/pending_independent_editorial_review/);
 assert.match(g.workedCase,/^FICTIONAL:/i);
 assert.ok(g.sourceUrls.length>=1);
});
test('Indicator teaching guide count and restriction are not mislabeled as 73 validated overlays',()=>{
 assert.equal(indicator.length,73);assert.equal(new Set(indicator.map(g=>g.code)).size,73);
 assert.ok(indicator.some(g=>g.code==='STUDY_SCTR'));
 assert.ok(indicator.some(g=>g.code==='STUDY_VIX_CONTEXT'));
 assert.equal(editions.featureEvidence.length,15);
});
for(const [i,g] of indicator.entries())test('Indicator source guide #'+(i+1)+' '+g.code,()=>{
 assert.equal(g.officialCompetency,false);
 assert.ok(g.sourceUrls.length>=1);
});
for(const feature of editions.featureEvidence)test('Edition source evidence status '+feature.id,()=>{
 assert.equal(feature.productionFeatureAccepted,false);
 assert.equal(feature.authenticatedTierAccepted,false);
 assert.equal(feature.independentEditorialAccepted,false);
 assert.equal(feature.hasSourceEvidence,feature.evidence.length>0);
 assert.equal(feature.sourceStage==='NOT_YET_EDITION_SPECIFICALLY_EVIDENCED',!feature.hasSourceEvidence);
});
test('Reproducible 600/73/15 artifact audit retains premium release holds',()=>{
 const script=fileURLToPath(new URL('scripts/qa/talia-owner-600-and-tiers-v1.mjs',root));
 const output=execFileSync(process.execPath,[script],{encoding:'utf8',timeout:20000});
 const report=JSON.parse(output.trim().split('\n').at(-1));
 assert.equal(report.ownerAuthoringAccepted,600);
 assert.equal(report.lessonCodeUniqueness,600);
 assert.equal(report.independentEditorialApprovals,0);
 assert.equal(report.sourceRightsCleared,0);
 assert.equal(report.indicatorSourceGuides,73);
 assert.equal(report.independentlyAcceptedIndicatorOverlays,0);
 assert.deepEqual(Object.values(report.editionSourceEvidence).map(x=>x.evidenced),[6,3,3,3]);
 assert.equal(report.overallSourceEvidence.percent,100);
 assert.equal(report.premiumFullyReleased,0);
 assert.equal(report.fullV4PreviouslyAcceptedGates,2);
});
