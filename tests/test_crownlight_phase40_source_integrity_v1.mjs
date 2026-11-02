// Forty independent, dependency-free source integrity checks for the approved Chart Studio release.
// These do not replace Chromium, RLS, authenticated member or mathematical acceptance.
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const files=[
  "assets/js/crownlight-chart-studio-v2.js",
  "assets/js/crownlight-chart-tiers-v1.js",
  "assets/js/crownlight-workspace-v2.js",
  "assets/js/crownlight-indicator-math-v2.js",
  "assets/js/crownlight-echarts-studio-v1.js",
  "assets/js/crownlight-echarts-replay-v1.js",
  "assets/js/crownlight-echarts-loader-v1.js",
  "assets/js/crownlight-echarts-admin-v1.js",
  "assets/js/crownlight-lab-chart-handoff-v2.js",
  "assets/js/crownlight-talia-lab-v2.js",
  "assets/js/crownlight-tradingview-datafeed-adapter-v1.js",
  "assets/css/crownlight-chart-v2-experience.css",
  "assets/js/crownlight-simulator-layout-v3.js",
  "assets/js/crownlight-live-formation-v1.js",
  "assets/js/crownlight-paper-terminal-v1.js",
  "assets/js/crownlight-chart-tutor-v1.js",
  "assets/js/crownlight-continuous-workspace-v1.js",
  "assets/js/admin-crownlight-workspace-v1.js",
  "assets/css/crownlight-chart-tiers-v1.css",
  "functions/api/chart-workspace.js",
  "functions/api/chart-tier-access.js",
  "functions/api/chart-studio-presentation.js",
  "functions/api/page-workspace-presentation.js",
  "functions/api/simulator-lab-context.js",
  "functions/api/alpaca-paper.js",
  "functions/api/live-market-stream.js",
  "functions/api/live-market-ticket.js",
  "tests/test_crownlight_chart_studio_v2.mjs",
  "tests/test_crownlight_chart_tiers_v1.mjs",
  "tests/test_crownlight_professional_density_v1.mjs",
  "tests/test_crownlight_chart_workspace_v2.mjs",
  "tests/test_crownlight_lab_handoff_v2.mjs",
  "tests/test_crownlight_founder_storefront_v1.mjs",
  "tests/test_crownlight_echarts_studio_browser_v1.mjs",
  "tests/test_crownlight_echarts_indicator_section_c_v1.mjs",
  "tests/test_crownlight_echarts_tv_adapter_browser_v1.mjs",
  "tests/test_crownlight_echarts_admin_smoke_v1.mjs",
  "tests/test_crownlight_admin_shared_analytics_browser_v1.mjs",
  "tests/test_crownlight_echarts_local_asset_v2.mjs",
  "tests/test_crownlight_chart_browser_v2.mjs"
];
assert.equal(files.length,40);
assert.equal(new Set(files).size,40);
let passed=0;
for(const [index,file] of files.entries()){
 try{
  assert.ok(existsSync(file),'Missing required release artifact');
  const source=readFileSync(file,'utf8');
  assert.ok(source.trim().length>40,'Empty/truncated release artifact');
  if(/\\.(?:mjs|js)$/.test(file)){
   const check=spawnSync(process.execPath,['--check',file],{encoding:'utf8',timeout:15000});
   assert.equal(check.status,0,check.stderr||'Invalid JavaScript syntax');
  }
  passed++;
  console.log('PASS '+String(index+1).padStart(2,'0')+'/40 '+file);
 }catch(error){
  console.error('FAIL '+String(index+1).padStart(2,'0')+'/40 '+file+': '+error.message);
  process.exitCode=1;
 }
}
console.log(JSON.stringify({project:'Crownlight Chart Studio',gate:'source_integrity',passed,total:40,failed:40-passed,memberBrowserAccepted:false,productionReleaseAccepted:false}));
if(passed!==40)process.exitCode=1;
