import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const ui=readFileSync('assets/js/crownlight-sec-scanner-tier-ui-v1.js','utf8');
const html=readFileSync('advanced-tool.html','utf8');
const advance=readFileSync('assets/js/advanced-tools.js','utf8');
const style=readFileSync('assets/css/crownlight-sec-scanner-tier-ui-v1.css','utf8');
const tier=readFileSync('functions/api/sec-scanner-tier-v1.js','utf8');
const sec=readFileSync('functions/api/sec-scanner-research-v1.js','utf8');
const catalog=JSON.parse(readFileSync('data/crownlight-sec-scanner-tiers-v1.json','utf8'));

test('SEC tier panel is only mounted in authenticated Catalyst tool and uses bearer token',()=>{
 assert.ok(html.includes('crownlight-sec-scanner-tier-ui-v1.js'));
 assert.ok(html.includes('crownlight-sec-scanner-tier-ui-v1.css'));
 assert.ok(html.indexOf('crownlight-sec-scanner-tier-ui-v1.js')<html.indexOf('advanced-tools.js'));
 assert.ok(advance.includes("case'CATALYST_RESEARCH':return renderCatalyst()"));
 assert.ok(advance.includes("CrownlightSecScannerTierUIV1?.mount?."));
 assert.match(ui,/SB\.auth\.getSession/);
 assert.match(ui,/s\.user\?\.id!==USER\.id/);
 assert.match(ui,/cache:'no-store'/);
 assert.match(ui,/credentials:'same-origin'/);
 assert.match(ui,/panel\.closest\('#tool-content'\)\?\.hidden/);
});
test('research panel respects server capability decisions',()=>{
 assert.match(ui,/mode\.querySelector\('\[value="fundamentals"\]'\)\.disabled=!x\.capabilities\.fundamentals/);
 assert.match(ui,/data\.capabilities\?\.acceptedTimeWindows/);
 assert.match(ui,/data\.capabilities\?\.fundamentals/);
 assert.match(ui,/CrownlightScannerSecBriefV4\?\.mount/);
 assert.match(ui,/safeFilingUrl/);
 assert.match(ui,/SEC\.gov/);
 assert.match(ui,/not first public dissemination/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|document\.cookie/);
 assert.doesNotMatch(ui,/innerHTML|document\.write|eval\(/);
});
test('owner panel is gated on successful server owner response and versioned mutation',()=>{
 assert.match(ui,/await requestJson\('\/api\/owner-sec-scanner-tier-v1'\)/);
 assert.match(ui,/if\(!check\?\.owner\)return/);
 assert.match(ui,/expectedVersion/);
 assert.match(ui,/reason:reason\.value\.trim\(\)/);
 assert.match(ui,/Reload the member grant before saving/);
 assert.match(ui,/SEC grant updated and audited/);
 assert.match(sec,/secTierContext/);
 assert.match(tier,/secTierContext/);
 assert.equal(catalog.product.existingGateway,'WATCHLIST_WORKBENCH');
});
test('UI remains accessible and existing pages preserve private DB/server files',()=>{
 for(const path of ['assets/js/crownlight-scanner-sec-evidence-v1.js','assets/js/crownlight-scanner-sec-brief-v4.js',
  'functions/api/sec-issuer-research-v1.js','supabase/migrations/20261103_sec_scanner_tier_grants_v1.sql'])
  assert.ok(existsSync(path),path);
 assert.match(style,/:focus-visible/);
 assert.match(style,/@media\(max-width:640px\)/);
 assert.match(style, /prefers-reduced-motion/);
 assert.match(ui,/caption/);
 assert.match(ui,/createElement/);
 assert.match(ui,/role','status/);
});
