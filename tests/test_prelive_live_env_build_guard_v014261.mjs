/* Owner-authorized LIVE launch build contract: block orphaned checkouts,
 * preserve live webhook redeployment for prior customers, and block retired QA.
 */
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const flags=['GU_PAYMENT_LIVE_LAUNCH_APPROVED','GU58_LIVE_CHECKOUT_ENABLED',
 'GU58_LIVE_DB_CONTRACT_APPROVED','GU58_LIVE_FULFILLMENT_APPROVED',
 'GU58_LIVE_WEBHOOK_ENABLED','GU72_ZERO_MONTHLY_FULFILLMENT_ENABLED',
 'GU72_ZERO_MONTHLY_QA_ENABLED','GU_F600_LIVE_CHECKOUT_ENABLED',
 'GU_F600_LIVE_FULFILLMENT_APPROVED','GU_F600_LIVE_WEBHOOK_ENABLED'];
const initial=Object.fromEntries(flags.map(x=>[x,'false']));
const guardFile='scripts/qa/prelive-live-build-flag-guard.sh';
const build=readFileSync('scripts/build-pages.sh','utf8');
const call='bash '+guardFile;
assert.ok(build.includes(call),'Every Pages build must execute the canonical LIVE security guard');
assert.ok(build.indexOf(call)<build.indexOf('node --test tests/runtime-owned-talia-v1.test.mjs'),
 'Reject unsafe LIVE checkout before lengthy Pages build and test suites');
// Test the exact guard invoked by the build rather than spawning ten full
// npm/TypeScript builds; process timeouts must never masquerade as approval.
const run=flags=>spawnSync('bash',[guardFile],{
 encoding:'utf8',timeout:3000,
 env:{...process.env,...initial,CF_PAGES_BRANCH:'main',...flags}
});
for(const checkout of ['GU58_LIVE_CHECKOUT_ENABLED','GU_F600_LIVE_CHECKOUT_ENABLED']){
 const r=run({[checkout]:'true'});assert.equal(r.status,9,checkout+' must require Owner launch authorization');
 assert.match(r.stderr,/LIVE BUILD BLOCK/);
}
for(const disabled of ['GU72_ZERO_MONTHLY_FULFILLMENT_ENABLED','GU72_ZERO_MONTHLY_QA_ENABLED']){
 const r=run({[disabled]:'true'});assert.equal(r.status,9,disabled+' must remain disabled in production');
 assert.match(r.stderr,/SECURITY BUILD BLOCK/);
}
for(const requirement of ['GU58_LIVE_DB_CONTRACT_APPROVED','GU58_LIVE_WEBHOOK_ENABLED','GU58_LIVE_FULFILLMENT_APPROVED']){
 const env={GU_PAYMENT_LIVE_LAUNCH_APPROVED:'true',GU58_LIVE_CHECKOUT_ENABLED:'true',
 GU58_LIVE_DB_CONTRACT_APPROVED:'true',GU58_LIVE_WEBHOOK_ENABLED:'true',GU58_LIVE_FULFILLMENT_APPROVED:'true',[requirement]:'false'};
 const r=run(env);assert.equal(r.status,9,'Missing '+requirement+' must refuse paid checkout build');
 assert.match(r.stderr,new RegExp(requirement));
}
for(const requirement of ['GU_F600_LIVE_WEBHOOK_ENABLED','GU_F600_LIVE_FULFILLMENT_APPROVED']){
 const env={GU_PAYMENT_LIVE_LAUNCH_APPROVED:'true',GU_F600_LIVE_CHECKOUT_ENABLED:'true',
 GU_F600_LIVE_WEBHOOK_ENABLED:'true',GU_F600_LIVE_FULFILLMENT_APPROVED:'true',[requirement]:'false'};
 const r=run(env);assert.equal(r.status,9,'Missing '+requirement+' must refuse founder checkout build');
 assert.match(r.stderr,new RegExp(requirement));
}
for(const env of [
 {GU58_LIVE_WEBHOOK_ENABLED:'true',GU58_LIVE_FULFILLMENT_APPROVED:'true',GU58_LIVE_DB_CONTRACT_APPROVED:'true'},
 {GU_PAYMENT_LIVE_LAUNCH_APPROVED:'true',GU58_LIVE_CHECKOUT_ENABLED:'true',GU58_LIVE_WEBHOOK_ENABLED:'true',
 GU58_LIVE_FULFILLMENT_APPROVED:'true',GU58_LIVE_DB_CONTRACT_APPROVED:'true',
 GU_F600_LIVE_CHECKOUT_ENABLED:'true',GU_F600_LIVE_WEBHOOK_ENABLED:'true',GU_F600_LIVE_FULFILLMENT_APPROVED:'true'}
]){
 const r=run(env);assert.equal(r.status,0,'Owner approved commerce and signed webhooks should deploy: '+r.stderr.slice(-400));
}
console.log('PASS: Owner-authorized checkout builds; orphaned paid checkout and retired zero-dollar QA remain blocked.');