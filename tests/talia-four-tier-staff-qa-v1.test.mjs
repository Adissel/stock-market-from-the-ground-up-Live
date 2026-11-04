import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildTierScenario,onRequest} from '../functions/api/talia-tier-qa-v1.js';
const read=p=>readFileSync(p,'utf8');

test('Four supported Tutor tiers have fixed synthetic features; never premium runtime releases',()=>{
 const expected={FOUNDATION:6,ADVANCED:3,PROFESSIONAL:3,ENTERPRISE:3};
 const ids=new Set();
 for(const [tier,n] of Object.entries(expected)){
  const x=buildTierScenario(tier);
  assert.equal(x.ok,true);
  assert.equal(x.tier,tier);
  assert.equal(x.featureCount,n);
  assert.equal(x.features.length,n);
  assert.equal(x.source,'DETERMINISTIC_SYNTHETIC_FIXTURES');
  assert.equal(x.scope,'STAFF_TEST_ONLY');
  for(const key of ['premiumMemberFeatureReleased','authenticMemberTierAccepted','noBillingChange','noPaidModelCall','noRealUserProgressRead','noRealAccountImpersonation']){
   assert.equal(x[key],key==='premiumMemberFeatureReleased'||key==='authenticMemberTierAccepted'?false:true,key);
  }
  for(const feature of x.features){assert.equal(ids.has(feature.id),false,feature.id);ids.add(feature.id);}
 }
 assert.equal(ids.size,15);
 assert.equal(buildTierScenario('ALL'),null);
 assert.equal(buildTierScenario(''),null);
});

test('Advanced and Professional specimens show grounded positive and negative cases',()=>{
 const a=buildTierScenario('ADVANCED').features;
 assert.equal(a[0].result.items[0].learnerStatus,'Needs Practice');
 assert.equal(a[1].result.accepted,true);
 assert.equal(a[1].result.masteryAwarded,false);
 assert.equal(a[1].result.feedback.answerKeyExposed,false);
 assert.equal(a[2].result.items.length,2);
 const p=buildTierScenario('PROFESSIONAL').features;
 assert.equal(p[0].result.observations.length,2);
 assert.equal(p[0].result.hasFutureBars,false);
 assert.equal(p[1].result.status,'insufficient_source_replay_evidence');
 assert.equal(p[1].result.expectedNegativeCase,true);
 assert.equal(p[2].result.accepted,true);
 assert.equal(p[2].result.priceChange,1);
 assert.equal(p[2].result.notARealFill,true);
});

test('Enterprise QA is restricted to fictional source inputs, as-of citations and no member IDs',()=>{
 const list=buildTierScenario('ENTERPRISE').features;
 assert.equal(list[0].result.accepted,true);
 assert.equal(list[0].result.workItems.length,2);
 assert.equal(list[0].result.sourceRightsGranted,false);
 assert.deepEqual(list[1].result.provenance.citations.map(x=>x.id),['SEC-EDU']);
 assert.deepEqual(list[1].result.comparison.evidenceGaps,['FUTURE']);
 assert.equal(list[2].result.accepted,true);
 assert.equal(list[2].result.totalCases,2);
 assert.equal(list[2].result.memberIdentifiersReturned,false);
 assert.equal(JSON.stringify(list[2].result).includes('11111111-1111-1111-1111-111111111111'),false);
});

test('QA route denies anonymous, unsupported method and never accepts a browser-supplied membership tier claim',async()=>{
 const url='https://example.test/api/talia-tier-qa-v1?tier=ENTERPRISE';
 const anon=await onRequest({request:new Request(url),env:{}});
 assert.equal(anon.status,401);
 const body=await anon.json();assert.equal(body.ok,false);
 const post=await onRequest({request:new Request(url,{method:'POST'}),env:{}});
 assert.equal(post.status,405);
 const source=read('functions/api/talia-tier-qa-v1.js');
 assert.match(source,/verifyPrototypeStaff\(request,env\)/);
 assert.doesNotMatch(source,/body\.tier|request\.json\(\)|memberToolAccess|stripe|AI_TUTOR_API_KEY|allowModel/);
 assert.match(source,/cache-control':'private, no-store/);
});

test('Owner prototype integrates QA UI only in the protected staff workspace',()=>{
 const html=read('talia-tutor-prototype.html');
 const gate=read('assets/js/talia-prototype-gate-v1.js');
 const js=read('assets/js/talia-tier-qa-v1.js');
 const css=read('assets/css/talia-tier-qa-v1.css');
 assert.ok(html.indexOf('<div id="tp-workspace" hidden>')<html.indexOf('id="talia-tier-qa"'));
 assert.ok(html.indexOf('id="talia-tier-qa"')<html.indexOf('</div></main>'));
 assert.match(html,/data-route-access="staff"/);
 assert.match(html,/talia-tier-qa-v1\.js/);
 assert.match(html,/talia-tier-qa-v1\.css/);
 assert.match(gate,/control_panel\.access/);
 assert.match(js,/workspace\?\.hidden/);
 assert.match(js,/getSupabaseClient/);
 assert.match(js,/getSession\(\)/);
 assert.match(js,/getUser\(\)/);
 assert.match(js,/pending\?\.abort\(\)/);
 assert.match(js,/replaceChildren/);
 assert.match(js,/textContent/);
 assert.doesNotMatch(js,/innerHTML|localStorage|sessionStorage|service_role|stripe|paidProvider/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
});
