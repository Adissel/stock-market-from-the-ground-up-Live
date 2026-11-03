import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
test('source presets are loaded after existing templates but before existing protected scanner mount',()=>{
 const html=read('advanced-tool.html');
 const ordered=['crownlight-scanner-rules-v1.js','crownlight-scanner-templates-v1.js','crownlight-scanner-presets-v2.js','crownlight-scanner-visual-v1.js','advanced-tools.js'];
 for(let i=0;i<ordered.length-1;i++)assert.ok(html.indexOf(ordered[i])<html.indexOf(ordered[i+1]));
 assert.ok(html.includes('crownlight-scanner-presets-v2.css'));
 const tools=read('assets/js/advanced-tools.js');
 assert.ok(tools.includes('if(scannerOnly&&globalThis.CrownlightScannerVisualV1)'));
 assert.ok(tools.includes("saveRecord('filter_set','Crownlight Visual Scanner'"));
 assert.ok(tools.includes("latestRecords('filter_set')"));
});
test('accessible search, category and source explanation reuse validated rules and existing private storage',()=>{
 const ui=read('assets/js/crownlight-scanner-visual-v1.js');
 const preset=read('assets/js/crownlight-scanner-presets-v2.js');
 assert.ok(ui.includes('CrownlightScannerPresetsV2||root.CrownlightScannerTemplatesV1'));
 assert.ok(ui.includes("search.type='search'"));
 assert.ok(ui.includes('aria-label'));
 assert.ok(ui.includes('templateLibrary.filter({category:category.value,query:search.value})'));
 assert.ok(ui.includes("template.sourceFiles.slice(0,2).join(' · ')"));
 assert.ok(ui.includes('C.validate(template.rules)'));
 assert.ok(ui.includes('await savePreset'));
 for(const f of [ui,preset])assert.doesNotMatch(f,/fetch\s*\(|innerHTML|localStorage|sessionStorage|new\s+WebSocket/i);
});
