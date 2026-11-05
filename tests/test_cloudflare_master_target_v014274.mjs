/* v0.14.0.274 -- block accidental Cloudflare deployments to interim/old accounts.
 * GitHub source-only assertions, no keys, no provider mutations. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root),'utf8');
const acct='4fe9e562905cf607b6f004d2374299fc';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const project='stock-market-from-the-ground-up';
test('legacy Pages fallback is archived, not executable from main',()=>{
 assert.equal(existsSync(new URL('.github/workflows/replacement-cloudflare-pages.yml',root)),false,'Do not restore the paused legacy deployment to main');
 const active=read('.github/workflows/cloudflare-master-target-guard-v014274.yml');
 assert.ok(active.includes(acct));
 assert.ok(active.includes(project));
 assert.ok(active.includes('stock-market-from-the-ground-up-d1r.pages.dev'));
 assert.ok(active.includes('secrets.SMFGU_LIVES_PAGES_DEPLOY'));
 assert.ok(active.includes("p.production_branch!=='main'"));
 assert.doesNotMatch(active,/9a43bc08e9db72e7187bc8c0a31710c2|5cc474054a0869a2fc0c4d0bd1c5373b/);
});
test('active public acceptance probes target newest production, not interim account',()=>{
 const js=read('tests/test_lives_production_guest_v014270.mjs');
 const yml=read('.github/workflows/lives-beta-guest-acceptance-v014270.yml');
 assert.ok(js.includes("const ORIGIN='"+origin+"'"));
 assert.match(yml,/Yahoo Master Beta/);
 assert.doesNotMatch(js,/stock-market-from-the-ground-up-lives\.pages\.dev/);
 const active=read('.github/workflows/cloudflare-master-smoke.yml');
 assert.ok(active.includes('tests/cloudflare-master-smoke.mjs'));
 assert.ok(read('tests/cloudflare-master-smoke.mjs').includes(origin));
});
test('historical interim smoke is archived and the approved archive is exempted',()=>{
 assert.equal(existsSync(new URL('.github/workflows/cloudflare-replacement-smoke.yml',root)),false,'No interim smoke workflow may run from main');
 const governance=read('.github/workflows/main-only-branch-governance.yml');
 assert.ok(governance.includes('APPROVED_ARCHIVE_BRANCH: archive/obsolete-ci-20261104'));
 assert.ok(governance.includes('if name==archive:'));
});
test('master Worker remains private and unscheduled',()=>{
 const s=read('workers/wrangler-master-billing.jsonc');
 assert.ok(s.includes(origin));
 assert.match(s,/"crons": \[\]/);
 assert.match(s,/"workers_dev": false/);
 assert.match(s,/"preview_urls": false/);
});
test('master account credentials referenced only by secret-name expression in Actions',()=>{
 for(const p of ['.github/workflows/verify-master-cloudflare-access.yml',
 '.github/workflows/master-postsecret-readiness.yml',
 '.github/workflows/master-presecret-inventory.yml']){
   const s=read(p);
   assert.ok(s.includes(acct),p+' must match current account');
   assert.match(s,/secrets\.SMFGU_LIVES_PAGES_DEPLOY/,p+' must use GitHub masked secret');
   assert.doesNotMatch(s,/9a43bc08e9db72e7187bc8c0a31710c2\S*\/pages\/projects\/stock-market-from-the-ground-up-lives\.pages\.dev/);
 }
});
