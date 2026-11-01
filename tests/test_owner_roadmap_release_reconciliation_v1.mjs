/* November 1 Owner Roadmap historical/source reconciliation contract.
 * No writes, network, chart feed, grades, payments or non-Owner access.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ownerRoadmapRelease20261101 as r} from '../functions/_lib/owner-roadmap-release-reconciliation-v1.js';
const read=p=>readFileSync(p,'utf8');
assert.equal(r.scope,'owner_private_evidence_snapshot');
assert.equal(r.originalChecklist.primary,375);
assert.equal(r.originalChecklist.reference,1815);
assert.equal(r.originalChecklist.total,2190);
assert.equal(r.originalChecklist.immutable,true);
assert.equal(r.metrics.length,12);
const byMetric=Object.fromEntries(r.metrics.map(x=>[x.id,x]));
assert.equal(byMetric.labs.value,'419');
assert.equal(byMetric.competencies.value,'30');
assert.equal(byMetric.academy.value,'93/380');
assert.equal(byMetric.academy.percent,24.47);
assert.equal(byMetric.source.value,'247/247');
assert.equal(byMetric.newcamps.value,'27/27');
assert.equal(byMetric.private.value,'0/54');
assert.equal(byMetric.indicators.value,'73');
assert.equal(byMetric.computed.value,'16');
assert.equal(byMetric.tutor.value,'134');
assert.equal(byMetric.chart.value,'3/14');
assert.equal(byMetric.b01.value,'62%');
assert.equal(byMetric.free.value,'88%');
for(const m of r.metrics){
 assert.ok(typeof m.unit==='string'&&m.unit.length>35,'Evidence qualifiers must accompany '+m.id);
 assert.ok(!['accepted','fully_approved','complete'].includes(m.state),'No blanket acceptance');
}
assert.equal(r.engines.premiumCheckoutEnabled,false);
const tiers=Object.fromEntries(r.engines.rows.map(row=>[row.code,row]));
assert.equal(Object.keys(tiers).length,9);
for(const p of ['FREE','FOUNDING_14','PICK_WHAT_YOU_WANT']){
 assert.equal(tiers[p].learning,'Basic');
 assert.equal(tiers[p].lab,'Basic');
 assert.equal(tiers[p].tutor,'Foundation');
}
assert.equal(tiers.FOUNDING_30.learning,'Advanced target');
assert.equal(tiers.FOUNDING_60.tutor,'Professional target');
assert.equal(tiers.FULL_MONTHLY.lab,'Professional target');
assert.equal(tiers.LIFETIME.learning,'Enterprise target');
assert.equal(tiers.LIFETIME.lab,'Enterprise target');
assert.equal(tiers.LIFETIME.tutor,'Enterprise target');
assert.equal(tiers.ONDEMAND_MONTHLY.learning,'Product dependent');
assert.equal(tiers.FULL_ANNUAL.learning,'Unassigned');
assert.equal(r.gates.length,10);
assert.deepEqual(r.gates.map((g,i)=>g.id),'R01 R02 R03 R04 R05 R06 R07 R08 R09 R10'.split(' '));
for(const g of r.gates){
 assert.ok(g.proof?.length>80&&g.next?.length>45,'Gate has concrete acceptance and next action: '+g.id);
 assert.ok(['open','partial','blocked'].includes(g.state),'Not a release-approved gate');
}
assert.ok(r.sources.length>=9);
for(const source of r.sources){
 assert.match(source.url,/^https:\/\/github\.com\/cybernexuspublishing\/stock-market-from-the-ground-up\/blob\/main\//);
 assert.ok(source.label.length>10);
}
const html=read('owner-roadmap.html'),js=read('assets/js/owner-roadmap.js'),
 ui=read('assets/js/owner-roadmap-release-reconciliation-v1.js'),
 css=read('assets/css/owner-roadmap.css'),api=read('functions/api/owner-roadmap.js');
for(const item of ['id="or-app" hidden','id="or-november-content"','id="or-current-audit"']){
 assert.ok(html.includes(item),'missing protected UI node '+item);
}
assert.ok(html.indexOf('owner-roadmap-release-reconciliation-v1.js')<html.indexOf('owner-roadmap.js'));
assert.match(js,/OwnerRoadmapRelease20261101\?\.render\(data\.releaseReconciliation\)/);
assert.match(api,/import \{ownerRoadmapRelease20261101\}/);
assert.match(api,/releaseReconciliation:ownerRoadmapRelease20261101/);
assert.match(api,/const user=await owner\(request,c,env\)/);
assert.ok(api.indexOf('const user=await owner(request,c,env)')<api.indexOf('releaseReconciliation:ownerRoadmapRelease20261101'));
assert.match(ui,/host\.replaceChildren\(\)/);
assert.match(ui,/\.textContent=String\(text\)/);
assert.doesNotMatch(ui,/innerHTML|localStorage|sessionStorage|fetch\(|postMessage|\.submit\(/);
assert.match(ui,/noopener noreferrer/);
assert.match(css,/@media\(max-width:850px\)/);
assert.match(css,/focus-visible/);
assert.ok(!html.includes('93/380'),'Owner-only evidence must not leak into public HTML before authorization');
assert.ok(!html.includes('FOUNDING_60'),'Owner-only engine policy snapshot must not be serialized into HTML');
console.log('PASS November Owner roadmap: 2190 historical items preserved; 12 qualified metrics, 9 engine policy rows, ten release gates, private API, safe render, no simulated commercial acceptance');
