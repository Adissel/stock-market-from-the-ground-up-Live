/* Read-only owner tier/roadmap acceptance baseline: no external API, payment or database calls. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {enginePolicyForPlan} from '../functions/_lib/learning-engine-tier-policy-v1.js';
import {roadmapCatalog} from '../functions/_lib/owner-roadmap-catalog.js';
import {roadmapEngineeringReview} from '../functions/_lib/owner-roadmap-engineering-review.js';
import {roadmapSupplementalItems,roadmapSupplementalReview} from '../functions/_lib/owner-roadmap-20261018-additions.js';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const report=read('data/owner-tier-roadmap-progress-v1.json');
const audit=read('data/learning-lab-engine-feature-audit-v1.json');
const ownerApi=readFileSync('functions/api/owner-roadmap.js','utf8');
const classes=['integrated','partial','prototype','not_implemented'];
const stageNames=['deployed_verified','source_implemented','in_progress','blocked','backlog'];
function stageSets(name){
  const m=new RegExp('const\\s+'+name+'\\s*=\\s*\\{').exec(ownerApi);
  assert.ok(m,'Owner Roadmap fallback set '+name+' is present');
  const end=ownerApi.indexOf('\n};',m.index);
  assert.ok(end>m.index,'Owner Roadmap fallback stage section closes');
  const output={};
  for(const match of ownerApi.slice(m.index,end).matchAll(/(\w+):new Set\(\[([0-9,\s]+)\]\)/g)){
    output[match[1]]=new Set(match[2].split(',').map(Number));
  }
  return output;
}
const execStages=stageSets('execStage'),historicalStages=stageSets('historicStage');
function v91Overrides(){
  const from=ownerApi.indexOf('const v91Evidence={');
  assert.ok(from>=0);
  const to=ownerApi.indexOf('\n};',from);
  const overrides=new Map();
  for(const m of ownerApi.slice(from,to).matchAll(/'((?:CORE|EXEC|PROM)-\d+)':\{stage:'([^']+)'/g)){
    overrides.set(m[1],m[2]);
  }
  return overrides;
}
const newer=v91Overrides();
function stageFor(item){
  const direct=roadmapSupplementalReview[item.id]?.stage||roadmapEngineeringReview.items[item.id]?.stage;
  if(newer.has(item.id))return newer.get(item.id);
  if(direct)return direct;
  const number=Number(item.id.split('-')[1]);
  const set=item.id.startsWith('EXEC-')?execStages:item.id.startsWith('PROM-')?historicalStages:{};
  return Object.entries(set).find(([,v])=>v.has(number))?.[0]||'backlog';
}
test('Original and supplemental Owner Roadmap source preserves all canonical records',()=>{
  assert.equal(roadmapCatalog.length,2096);
  assert.equal(roadmapSupplementalItems.length,94);
  assert.equal(roadmapCatalog.filter(x=>x.scope==='trace').length,1815);
  const primary=[...roadmapCatalog,...roadmapSupplementalItems].filter(x=>x.scope==='core');
  assert.equal(primary.length,375);
  assert.equal(new Set(primary.map(x=>x.id)).size,375);
  assert.equal(report.roadmap.primaryRequirements,375);
  assert.equal(report.roadmap.historicalTraceReferences,1815);
});
test('375 historical statuses are computed from real Roadmap sources, not fabricated accepted checkmarks',()=>{
  const result=Object.fromEntries(stageNames.map(s=>[s,0]));
  for(const r of [...roadmapCatalog,...roadmapSupplementalItems].filter(x=>x.scope==='core')){
    const stage=stageFor(r);
    assert.ok(Object.hasOwn(result,stage),r.id+' '+stage);
    result[stage]+=1;
  }
  assert.deepEqual(result,report.roadmap.stageCounts);
  const percent=(result.deployed_verified+0.5*result.source_implemented+0.25*result.in_progress)/375*100;
  assert.equal(Number(percent.toFixed(2)),report.roadmap.weightedPlanningPercent);
  assert.equal(Number(((result.deployed_verified+result.source_implemented)/375*100).toFixed(2)),report.roadmap.sourceImplementedOrVerifiedPercent);
  assert.equal(Number((result.deployed_verified/375*100).toFixed(2)),report.roadmap.narrowVerifiedPercent);
  assert.match(report.roadmap.warning,/Not a current/);
});
test('64 feature sources retain their explicit, mutually-exclusive disposition',()=>{
  assert.equal(audit.features.length,64);
  assert.equal(new Set(audit.features.map(x=>x.id)).size,64);
  const sums={integrated:0,partial:0,prototype:0,not_implemented:0};
  for(const f of audit.features) sums[f.source_status]+=1;
  assert.deepEqual(sums,{integrated:16,partial:31,prototype:11,not_implemented:6});
  assert.equal(report.engineFeatures.denominator,64);
  assert.equal(report.engineFeatures.integratedPercent,25);
  assert.equal(report.engineFeatures.sourceTouched,58);
  assert.equal(report.engineFeatures.sourceTouchedPercent,90.63);
  assert.equal(report.engineFeatures.independentlyReleased,0);
});
for(const f of audit.features){
  test('Source feature '+f.id+' counted without inventing acceptance',()=>{
    assert.ok(['learning','lab'].includes(f.engine));
    assert.ok(['BASIC','ADVANCED','PROFESSIONAL','ENTERPRISE'].includes(f.edition));
    assert.ok(classes.includes(f.source_status),f.id);
    const group=report.engineFeatures.perEdition[f.engine+'_'+f.edition];
    assert.ok(group,f.id+' edition known');
    assert.equal(group.total,8);
    assert.notEqual(f.independent_release_accepted,true);
  });
}
for(const [key,entry] of Object.entries(report.engineFeatures.perEdition)){
  test('Edition '+key+' count and percentages match source records',()=>{
    const [engine,edition]=key.split('_'),features=audit.features.filter(x=>x.engine===engine&&x.edition===edition);
    assert.equal(features.length,8);
    const count=status=>features.filter(f=>f.source_status===status).length;
    assert.equal(entry.integrated,count('integrated'));
    assert.equal(entry.partial,count('partial'));
    assert.equal(entry.prototype,count('prototype'));
    assert.equal(entry.notImplemented,count('not_implemented'));
    assert.equal(entry.sourceTouched,8-entry.notImplemented);
    assert.equal(entry.sourceTouchedPercent,Number((entry.sourceTouched/8*100).toFixed(2)));
    assert.equal(entry.integratedPercent,Number((entry.integrated/8*100).toFixed(2)));
    assert.equal(audit.counts[key].integrated,entry.integrated);
    assert.equal(entry.releasedFeatures,0);
  });
}
for(const member of report.membershipTargets){
  test('Membership '+member.code+' targets are not actual premium grants',()=>{
    const p=enginePolicyForPlan(member.code);
    assert.deepEqual(p.target,member.target);
    assert.deepEqual(p.effectiveCapabilities,{learning:'BASIC',lab:'BASIC',tutor:'FOUNDATION'});
    assert.equal(p.premiumFeaturesReleased,false);
    assert.equal(p.addOnCheckoutEnabled,false);
    assert.equal(p.equalTeachingQualityWithinAccessibleLesson,true);
    if(member.code==='FULL_ANNUAL')assert.equal(p.recognized,false);
    if(member.code==='ONDEMAND_MONTHLY')assert.equal(p.requiresVerifiedProduct,true);
  });
}
test('Basic Owner approval must not be conflated with independent release',()=>{
  assert.equal(report.basicOwnerSignoff.integrated,16);
  assert.equal(report.basicOwnerSignoff.requiresOwnerReapproval,false);
  assert.equal(audit.owner_signoff_BASIC.approved_count,16);
  assert.equal(audit.owner_signoff_BASIC.total,16);
  assert.equal(audit.owner_signoff_BASIC.owner_reapproval_required,false);
  assert.equal(audit.frozen.premiumFeaturesReleased,false);
  assert.equal(audit.frozen.addonCheckout,false);
  assert.equal(report.safety.premiumFeaturesReleased,false);
  assert.equal(report.safety.addOnCheckoutEnabled,false);
});
test('Talia 600 authoring ratio is explicitly separate from 64 integration feature denominator',()=>{
  assert.equal(report.tutor.supplementalFoundationDrafts,600);
  assert.equal(report.tutor.authoringTarget,600);
  assert.equal(report.tutor.authoringPercent,100);
  assert.equal(report.tutor.independentPublishedApprovalsVerified,0);
  assert.match(report.tutor.warning,/do not imply independently accepted/);
});
test('Historical overall score is never claimed as current universal website acceptance',()=>{
  assert.match(report.denominators.overallSitewide,/No reliable current/);
  assert.equal(report.roadmap.weightedPlanningPercent,33.8);
  assert.equal(report.safety.liveStripeWrites,false);
  assert.equal(report.safety.membersModified,false);
  assert.equal(report.safety.officialGradingEnabledByThisBatch,false);
});
