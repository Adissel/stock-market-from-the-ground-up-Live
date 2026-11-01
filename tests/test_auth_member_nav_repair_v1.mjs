/* No live accounts or payments; source regression against CDN/Auth and Lumen layout. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
const auth=fs.readFileSync('assets/js/supabase-client.js','utf8');
const build=fs.readFileSync('scripts/build-pages.sh','utf8');
const html=fs.readFileSync('dashboard.html','utf8');
const nav=fs.readFileSync('assets/js/navigation.js','utf8');
const css=fs.readFileSync('assets/css/lumen-dashboard-navigation-fix-v1.css','utf8');
const gift=fs.readFileSync('assets/js/crownlight-member-gifting-v1.js','utf8');
assert.match(auth,/\/assets\/vendor\/supabase-js\/2\.109\.0\/supabase\.js/);
assert.doesNotMatch(auth,/cdn\.jsdelivr\.net/);
assert.match(auth,/siteSupabaseVendorPending/);
assert.match(build,/@supabase\/supabase-js@2\.109\.0/);
assert.match(build,/dist\/umd\/supabase\.js/);
assert.match(html,/lumen-dashboard-navigation-fix-v1\.css/);
const shell=html.indexOf('<div class="gu-member-dashboard-shell">');
const intro=html.indexOf('<div id="dashboard-gate"></div>',shell);
const wallet=html.indexOf('<div class="gu-member-lumen-widgets">');
assert(shell>=0&&intro>shell&&wallet>intro,'Wallet must be INSIDE member dashboard after overview');
for(const x of ['data-member-lumen-wallet','data-member-lumen-history','data-academy-study-progress'])
 assert.equal(html.split(x).length-1,1,'one authoritative '+x);
assert.match(nav,/const desktopMember=\(\)=>kind==='member'&&innerWidth>900/);
assert.match(nav,/if\(desktopMember\(\)\)collapsed=false/);
assert.match(nav,/button\.hidden=desktopMember\(\)/);
assert.match(css,/\.gu-member-lumen-widgets/);
assert.match(css,/\.gu-lumen-gifting-form/);
assert.match(css,/focus-visible/);
assert.match(gift,/gu-member-lumen-widget gu-member-lumen-gifting/);
console.log('PASS self-hosted Supabase, member dashboard wallet hierarchy, desktop nav toggle and responsive gifting contracts.');
