import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const runner=readFileSync('scripts/watchlist-regression-diff-v2.mjs','utf8');
const qa=readFileSync('tests/test_james_free_member_commerce_20261030.mjs','utf8');
const match=runner.match(/const forbidden=\/([^\n]+)\/i;/);
assert(match,'Watchlist offline exclusion regex must exist');
const forbidden=new RegExp(match[1],'i');
test('Real James_Test login is excluded from credential-free offline diffs',()=>{
 assert.equal(forbidden.test('test_james_free_member_commerce_20261030.mjs'),true);
});
test('Actual browser and production-only tests remain excluded',()=>{
 for(const name of ['test_live_owner_workflow.mjs','test_member_browser.mjs','test_authentic_readonly.mjs'])
  assert.equal(forbidden.test(name),true,name);
});
test('Ordinary isolated source-regression tests remain eligible',()=>{
 for(const name of ['test_watchlist_rule_engine.mjs','test_scanner_contract.mjs','test_journal_source_contract.mjs'])
  assert.equal(forbidden.test(name),false,name);
});
test('Genuine QA still requires encrypted credentials and tests real LIVE login',()=>{
 assert.match(qa,/LAB_QA_EMAIL/);assert.match(qa,/LAB_QA_PASSWORD/);
 assert.match(qa,/stock-market-from-the-ground-up-d1r\.pages\.dev/);
 assert.match(qa,/no CAPTCHA bypass/);
 assert.match(qa,/process\.exitCode=1/);
});
test('Offline sweep still fails on any true source regression',()=>{
 assert.match(runner,/if\(summary\.newFailures\|\|summary\.changedFailures\)process\.exitCode=1/);
});
test('Runner still compares baseline and current source tests',()=>{
 assert.match(runner,/const\s+name\s*=\s*list\[i\]\s*,\s*before\s*=\s*run\(baseline,\s*name\)\s*,\s*after\s*=\s*run\(current,\s*name\)/);
});
