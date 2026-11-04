import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('visual scanner opts into sparse rules while the original Discovery Lab remains strict',()=>{
 const tool=read('assets/js/advanced-tools.js'),visual=read('assets/js/crownlight-scanner-visual-v1.js'),
  input=read('assets/js/market-research-engine-v014145.js'),page=read('advanced-tool.html');
 assert.ok(tool.includes("scannerOnly?engine.csv(raw,{mode:'SCANNER_PRESET_V2'}):engine.csv(raw)"));
 assert.ok(tool.includes('Required columns: <code>symbol,price,change_pct,volume,rvol,float,spread_pct</code>'));
 assert.ok(visual.includes('allowSparse:true'));
 assert.ok(visual.includes('fieldEvidence();'));
 assert.ok(visual.includes('CrownlightScannerEvidenceV6'));
 assert.ok(input.includes("const sparse=options.mode==='SCANNER_PRESET_V2'"));
 assert.ok(page.includes('crownlight-scanner-evidence-v6.js'));
 assert.ok(page.indexOf('crownlight-scanner-rules-v1.js')<page.indexOf('crownlight-scanner-evidence-v6.js'));
 assert.ok(page.indexOf('crownlight-scanner-evidence-v6.js')<page.indexOf('crownlight-scanner-visual-v1.js'));
 for(const p of ['assets/js/crownlight-scanner-evidence-v6.js','assets/js/crownlight-scanner-visual-v1.js'])
  assert.doesNotMatch(read(p),/fetch\s*\(|localStorage|sessionStorage|new\s+WebSocket/);
});
