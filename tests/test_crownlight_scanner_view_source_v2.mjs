import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('advanced-tool.html','utf8');
const visual=readFileSync('assets/js/crownlight-scanner-visual-v1.js','utf8');
const view=readFileSync('assets/js/crownlight-scanner-view-v2.js','utf8');
const rules=readFileSync('assets/js/crownlight-scanner-rules-v1.js','utf8');
const templates=readFileSync('assets/js/crownlight-scanner-templates-v1.js','utf8');
const paths=['crownlight-scanner-rules-v1.js','crownlight-scanner-view-v2.js',
 'crownlight-scanner-templates-v1.js','crownlight-scanner-visual-v1.js','advanced-tools.js'];
for(let i=0;i<paths.length-1;i++)assert(html.indexOf(paths[i])<html.indexOf(paths[i+1]),'ordered loader: '+paths[i]);
assert(visual.includes('view:activeView()'));
assert(visual.includes('const restored=found.payload.view?C.validateView(found.payload.view):null'));
assert(visual.includes('const nextView=input.view?C.validateView(input.view):null'));
assert(visual.includes('C.analyze(getRows(),current,'));
assert.match(visual,/C\.analyze\(getRows\(\),current,\s*\{\.\.\.activeView\(\),allowSparse:true\}\)/);
// Persisted source views still drive the original scan; sparse is strictly opt-in.
assert(visual.includes("templateLibrary.lookup(templateSelect.value)"));
assert(visual.includes("value.columns.map(key=>[key,C.FIELDS[key]])"));
assert(visual.includes('record.ruleTrail.details'));
assert(view.includes("Maximum 12 columns"));
assert(view.includes('engine.validateView(input)'));
assert(!view.includes('localStorage'));
assert(!visual.includes('api/marketdata'));
assert(rules.includes('secondarySort'));
assert(templates.includes('five-minute')||templates.includes('Five-minute'));
console.log('PASS scanner Wave 2 visual source contract: presets, view persistence, column selection, trace and loader');
