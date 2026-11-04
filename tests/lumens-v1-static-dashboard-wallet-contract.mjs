/* Existing Dashboard wallet is a single authoritative, noncharging layout.
 * A static section must be updated, not silently skipped or replaced wholesale.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('dashboard.html','utf8');
const js=readFileSync('assets/js/member-lumen-wallet-widget-v1.js','utf8');
const test=readFileSync('tests/live-member-lumen-dashboard-browser-v1.mjs','utf8');
const legacy=readFileSync('assets/js/dashboard-ui-legacy.js','utf8');
for(const id of ['member-sparks-wallet','sparks-wallet-total','sparks-wallet-included',
 'sparks-wallet-purchased','sparks-wallet-manual','sparks-wallet-expiry','sparks-wallet-status'])
 assert(html.includes('id="'+id+'"'),'Dashboard missing static wallet '+id);
assert.match(js,/getElementById\('member-sparks-wallet'\)/);
assert.match(js,/\/api\/member-sparks-balance/);
assert.match(js,/w\.included\+w\.purchased\+w\.manual!==w\.available/);
assert.match(js,/if\(generation!==epoch\)return/);
assert.match(js,/SIGNED_OUT/);
assert.match(js,/No balance is assumed/);
assert.match(legacy,/preservedWalletPanel=q\('#member-sparks-wallet',main\)/);
assert.match(legacy,/preservedLumenWidgets=q\('\.gu-member-lumen-widgets',main\)/);
assert.match(legacy,/wallet:renderWallet/);
assert.match(legacy,/await fetch\('\/api\/member-sparks-balance'/,
 'After replacement the real wallet tab must fetch the authoritative API');
assert.match(legacy,/authorization:'Bearer '\+session\.access_token/,
 'The existing verified Wallet-tab bearer token must be used');
assert.match(legacy,/signal:AbortSignal\.timeout\(20000\)/,
 'Read-only balance fetch must be bounded');
assert.match(legacy,/active\?\.user\?\.id!==session\.user\.id/,
 'The same authenticated member must remain active before showing credits');
assert.match(legacy,/balance\.included\+balance\.purchased\+balance\.manual!==balance\.available/,
 'Credit bucket totals must reconcile before presentation');
assert.match(legacy,/\['wallet','Crownlight Lumens Wallet'\]/);
assert.match(legacy,/if\(preservedWalletPanel\)host\.appendChild\(preservedWalletPanel\)/);
assert(test.includes(String.raw`return /^\d{1,3}(,\d{3})*$/.test(total)`),
 'Genuine browser balance regex must match digits, not a literal backslash-d');
assert(test.includes(String.raw`match(/\d/)`),
 'Safe browser failure diagnostic must detect ordinary decimal digits');
assert.match(test,/#member-sparks-wallet/);
assert.match(test,/sparks-wallet-total/);
assert.doesNotMatch(html,/<small>never expires<\/small>/,
 'Included credits must not be advertised as nonexpiring');
console.log('PASS: Existing Dashboard wallet mounts, reconciles, masks on session change and describes the included-credit rollover');
