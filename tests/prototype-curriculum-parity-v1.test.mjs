/* V1 staff Prototype source parity; only source evidence, no authenticated/live signoff. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
const html=read('prototype.html'),js=read('assets/js/prototype-curriculum-parity-v1.js');
const css=read('assets/css/prototype-curriculum-parity-v1.css');
const labs=JSON.parse(read('data/competency-lab-paths-v01499.json'));
const guides=JSON.parse(read('data/competency-study-guides-v01499.json'));
const indicators=JSON.parse(read('data/tutor-indicator-study-v1.json'));
const bridges=JSON.parse(read('data/lab-teaching-bridges-v014168.json'));
await import('../assets/js/crownlight-indicator-math-v2.js');
await import('../assets/js/prototype-indicator-workbench-v2.js');
assert.equal(labs.totalCanonicalLabs,419);
assert.equal(Object.keys(labs.byLab).length,419);
assert.equal(guides.guides.length,30);
assert.equal(indicators.guides.length,61);
assert.equal(indicators.count,61);
assert.equal(bridges.canonicalLabCount,419);
assert.equal(Object.keys(bridges.entries).length,419);
assert.equal(bridges.independentGradesIncluded,false);
assert.equal(bridges.historicalBarDataIncluded,false);
for(const [id,row] of Object.entries(bridges.entries)){
 assert.equal(row.labId,id);
 for(const facet of ['understand','recognize','apply','mistake','limits'])
  assert(row.tabs[facet].length>=3,'Individual five-facet Lab instruction missing for '+id+' '+facet);
}
assert.equal(new Set(indicators.guides.map(g=>g.code)).size,61);
assert.equal(globalThis.CrownlightPrototypeIndicators.specs.length,15);
assert.match(html,/<section id="pt-app" hidden/);
assert.match(html,/id="pt-curriculum-parity"/);
assert.match(html,/prototype-curriculum-parity-v1\.js/);
assert.match(html,/prototype-curriculum-parity-v1\.css/);
assert.ok(html.indexOf('prototype-indicator-workbench-v2.js')<html.indexOf('prototype-curriculum-parity-v1.js'));
assert.match(js,/if\(!host\|\|!app\)return/);
assert.match(js,/guard\.observe\(app,\{attributes:true,attributeFilter:\['hidden'\]\}\)/);
assert.match(js,/totalCanonicalLabs!==419/);
assert.match(js,/lab-teaching-bridges-v014168\.json/);
assert.match(js,/independentGradesIncluded!==false/);
assert.match(js,/facets=/);
assert.match(js,/skills\?\.guides\?\.length!==30/);
assert.match(js,/indicators\?\.guides\?\.length!==61/);
assert.match(js,/computed\.length!==15/);
assert.match(js,/\/api\/bootcamp-academy\?action=catalog/);
assert.match(js,/fetchJson\('\/data\/competency-lab-paths-v01499\.json'\)/);
assert.match(js,/textContent=String\(text\)/);
assert.match(js,/No member or protected grading data was loaded/);
for(const prohibited of [/\/api\/stripe/i,/service.role/i,/\.insert\(/,/\.update\(/,/localStorage\.setItem\(/,/document\.write\(/,/innerHTML\s*=/,new RegExp('bootcamp-academy\\?program=')]){
 assert.doesNotMatch(js,prohibited,'Private action or unsafe markup is not permitted in read-only parity');
}
assert.match(css,/@media\(max-width:760px\)/);
assert.match(css, /focus-visible/);
console.log('PASS: staff-gated source parity with 419 Lab paths, 30 competency guides, 61 authored indicator studies and 15 computed chart studies; authenticated Academy catalog only metadata');
