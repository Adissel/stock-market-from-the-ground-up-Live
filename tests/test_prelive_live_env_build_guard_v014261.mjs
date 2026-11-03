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
// Run the exact sourced gate directly; the full Pages build (and the separate
// Stage B integration job) still executes this gate before the complete build.
// Running eleven complete builds here was timing out in overloaded CI runners.
const guardPath='scripts/_lib/live-build-guard.sh';
const syntax=spawnSync('bash',['-n',guardPath],{encoding:'utf8',timeout:8000});
assert.equal(syntax.status,0,'LIVE gate shell syntax must remain valid: '+syntax.stderr);
const buildScript=readFileSync('scripts/build-pages.sh','utf8');
assert.match(buildScript,/^source scripts\/_lib\/live-build-guard\.sh$/m,
 'Every Pages build must source the same authorization gate before publishing');
assert.ok(buildScript.indexOf('source scripts/_lib/live-build-guard.sh')<buildScript.indexOf('node --test tests/runtime-owned-talia-v1.test.mjs'),
 'LIVE checkout guard must run before the expensive build and test suites');
const run=flags=>spawnSync('bash',[guardPath],{
 encoding:'utf8',timeout:8000,
 env:{...process.env,...initial,CF_PAGES_BRANCH:'main',...flags}
});
for(const checkout of ['GU58_LIVE_CHECKOUT_ENABLED','GU_F600_LIVE_CHECKOUT_ENABLED']){
 const r=run({[checkout]:'true'});assert.equal(r.status,9,checkout+' must block unauthorized LIVE checkout');
 assert.match(r.stderr,/LIVE BUILD BLOCK/);
}
for(const disabled of ['GU72_ZERO_MONTHLY_FULFILLMENT_ENABLED','GU72_ZERO_MONTHLY_QA_ENABLED']){
 const r=run({[disabled]:'true'});assert.equal(r.status,9,disabled+' must block deprecated zero-dollar QA in production');
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
 const r=run(env);assert.equal(r.status,0,'Owner approved commerce and signed webhooks must pass the identical LIVE build authorization gate: '+r.stderr.slice(-400));
}
console.log('PASS: unchanged fast-fail LIVE checkout guard (both blocked and approved flag matrices); complete Pages builds remain checked by the separate build and deploy jobs.');