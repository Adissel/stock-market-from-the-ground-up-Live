// Static safety contract for the read-only wallet widget and Dashboard mount.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const js=fs.readFileSync('assets/js/member-lumen-wallet-widget-v1.js','utf8');
const html=fs.readFileSync('dashboard.html','utf8');
const nav=fs.readFileSync('assets/js/nav-search-and-sparks-v1.js','utf8');
assert.match(js,/member-sparks-balance/);
assert.match(js,/getSupabaseClient/);
assert.match(js,/getUser/);
assert.match(js,/Number\.isSafeInteger/);
for(const unsafe of [/\.insert\s*\(/,/\.update\s*\(/,/\.delete\s*\(/,/\.from\s*\(/,/\/api\/stripe/i,/transferLumens/i])assert.doesNotMatch(js,unsafe);
assert.match(html,/data-member-lumen-wallet/);
assert.match(html,/member-lumen-wallet-widget-v1\.js/);
assert.match(html,/Crownlight Lumens Wallet/);
assert.match(nav,/Crownlight Lumens/);
console.log('PASS: Dashboard wallet is read-only, bound to member identity, and mounted.');
