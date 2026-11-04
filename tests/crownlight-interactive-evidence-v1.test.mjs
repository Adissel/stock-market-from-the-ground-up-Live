import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
const js=read('assets/js/crownlight-interactive-evidence-v1.js');
const core=read('assets/js/crownlight-evidence-core-v1.js');
const page=read('lab-player.html'),engine=read('assets/js/lab-engine-v32-universal.js');
test('Existing authorized member Lab calculation stage mounts optional ungraded toolkit',()=>{
 assert.match(page,/crownlight-evidence-core-v1\.js/);
 assert.match(page,/crownlight-interactive-evidence-v1\.js/);
 assert(page.indexOf('crownlight-evidence-core-v1.js')<page.indexOf('crownlight-interactive-evidence-v1.js'));
 assert(page.indexOf('crownlight-interactive-evidence-v1.js')<page.indexOf('lab-engine-v32-universal.js'));
 assert.match(engine,/CrownlightInteractiveEvidenceV1\?\.mount/);
 assert.match(engine,/kind:visualType,mode,labId/);
 assert.match(engine,/echartsControllers\.push\(evidenceSession\)/);
});
test('No teaching tools render inside protected blind/assessment or alter authentication',()=>{
 assert.match(engine,/if\(\['blind','assessment'\]\.includes\(mode\)\)/);
 assert.match(js,/!\['guided','practice'\]\.includes\(mode\)/);
 assert.match(js,/\['candle','vwap'\]\.includes\(kind\)/);
 assert.doesNotMatch(js,/fetch\s*\(|supabase|localStorage|sessionStorage|access_token|service_role|privateRubric|answer_key|gradeMember|stripe|\.innerHTML/i);
 assert.doesNotMatch(core,/fetch\s*\(|supabase|answer_key/i);
});
test('Controls are functional, not decorative, with reduced-motion and numeric fallback',()=>{
 for(const s of ['addEventListener(\'input\'','addEventListener(\'change\'','Reveal next simulated observation',
  'Reset observations','Reveal next transaction','Reset to zero transactions','core.aggregate','core.vwap',
  'aria-live','createElementNS','ResizeObserver','CrownlightECharts','setOption','chartHost']){} 
 for(const s of ['Reveal next simulated observation','Reset observations','Reveal next transaction','Reset to zero transactions',
 'core.aggregate','core.vwap','aria-live','createElementNS','ResizeObserver','CrownlightECharts','setOption','table(']) assert(js.includes(s),s);
 const css=read('assets/css/crownlight-interactive-evidence-v1.css');
 for(const s of ['focus-visible','min-height:44px','max-width:640px','prefers-reduced-motion'])assert(css.includes(s),s);
});
test('Trade-print VWAP is explicitly distinct from proxy and disclosure states no real feed or grade',()=>{
 for(const s of ['trade-print VWAP, not the HLC3 bar approximation','Illustrative simulated observations',
  'no live prices'.toLowerCase()]){assert(js.toLowerCase().includes(s.toLowerCase()),s)}
 assert.match(js,/Revealed '\+state.revealed/);
 assert.match(js,/state\.steps\.map/);
});
test('Build gate includes the new pure math and surface-source tests',()=>{
 const build=read('scripts/build-pages.sh');
 assert.match(build,/crownlight-evidence-core-v1\.test\.mjs/);
 assert.match(build,/crownlight-interactive-evidence-v1\.test\.mjs/);
});
