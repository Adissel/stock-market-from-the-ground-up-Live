import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const cross=JSON.parse(readFileSync('data/crownlight-scanner-phase8-crosswalk-v1.json','utf8'));
const tiers=JSON.parse(readFileSync('data/crownlight-scanner-tier-milestones-v1.json','utf8'));
assert.equal(cross.features.length,44);
assert.equal(new Set(cross.features.map(x=>x.id)).size,44);
assert.equal(cross.phase8.championBaselines,98);
assert.equal(cross.phase8.challengersPromoted,0);
assert.equal(cross.phase8.statisticallyValidatedStrategies,0);
assert.equal(cross.features.filter(x=>x.scannerState==='PARTIAL_FROM_MEMBER_SNAPSHOT').length,8);
for(const id of ['P8-F-038','P8-F-039','P8-F-040','P8-F-041','P8-F-042','P8-F-043','P8-F-044']){
 const x=cross.features.find(x=>x.id===id);
 assert.equal(x.scannerState,'OUTCOME_OR_UNVALIDATED_MODEL_BLOCKED',id);
}
for(const [tier,value] of Object.entries(tiers.tiers)){
 assert.equal(value.total,8,tier);
 assert.equal(value.passed,value.technicalSourceGates.filter(x=>x.passed===true).length,tier);
 assert.equal(value.percentage,100*value.passed/8,tier);
}
const tierPassed=Object.values(tiers.tiers).reduce((sum,tier)=>sum+tier.passed,0);
assert.equal(tiers.overall.passed,tierPassed,'Overall must reconcile exactly to tier source gates.');
assert.equal(tiers.overall.percentage,100*tierPassed/tiers.overall.total);
assert.equal(tiers.overall.total,32);
assert.equal(tiers.livePaidTierReleaseAcceptancePercent,0);
const visual=readFileSync('assets/js/crownlight-scanner-visual-v1.js','utf8');
assert(visual.includes("else{delete node.maxValue;}"),'Changing BETWEEN to other operator must remove stale upper bound.');
console.log('PASS Phase 8 44-feature nonproprietary mapping, restricted scores, 32 tier engineering milestones');
