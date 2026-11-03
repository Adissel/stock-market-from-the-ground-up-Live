import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
test('new viewer reuses the original member scanner gate and shared importer',()=>{
 const page=read('advanced-tool.html'),tool=read('assets/js/advanced-tools.js');
 const order=['crownlight-scanner-rules-v1.js','crownlight-indicator-math-v2.js',
 'crownlight-scanner-historical-v5.js','crownlight-scanner-history-view-v5.js','advanced-tools.js'];
 for(let i=0;i<order.length-1;i++)assert.ok(page.indexOf(order[i])<page.indexOf(order[i+1]),order[i]);
 assert.ok(page.includes('crownlight-scanner-history-v5.css'));
 assert.ok(tool.includes('if(scannerOnly&&globalThis.CrownlightScannerHistoryViewV5)'));
 assert.ok(tool.includes("case'SCANNER_BUILDER':return universeWorkbench(true)"));
 assert.ok(tool.includes("'/api/advanced-tool-access-v014110?tool='"));
 const view=read('assets/js/crownlight-scanner-history-view-v5.js');
 assert.ok(view.includes('importer.csvBars(await f.text())'));
 assert.ok(view.includes('CrownlightECharts?.load'));
 assert.ok(view.includes('const ticket=++revision'));
 assert.ok(view.includes('visibleBars.slice()'));
 assert.ok(view.includes("root.addEventListener?.('crownlight:member-changed',dispose)"));
 for(const path of ['assets/js/crownlight-scanner-historical-v5.js','assets/js/crownlight-scanner-history-view-v5.js'])
  assert.doesNotMatch(read(path),/fetch\s*\(|localStorage|sessionStorage|innerHTML/i);
});
test('rights, payments and independent review cannot be implied from source CI',()=>{
 const d=JSON.parse(read('data/crownlight-scanner-wave5-research-catalog.json'));
 assert.equal(d.approvedForLive,false);
 assert.equal(d.independentMarketDataRightsCleared,false);
 assert.equal(d.proposedTechnicalMilestoneCredits,0);
 assert.equal(d.existingMilestonesAccepted,7);
 assert.equal(d.privateMemberDataStored,false);
 assert.ok(d.references.length>=4);
 for(const x of d.references)assert.ok(x.url.startsWith('https://'));
});
