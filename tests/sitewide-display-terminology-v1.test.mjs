import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const code=readFileSync('assets/js/crownlight-display-terminology-v1.js','utf8');
const middle=readFileSync('functions/_middleware.js','utf8');
function api(){
 const callbacks=[],script={document:{readyState:'loading',addEventListener(name,cb){callbacks.push(cb)}},
  NodeFilter:{SHOW_TEXT:4,SHOW_ELEMENT:1},MutationObserver:class{constructor(cb){this.cb=cb}observe(){}},
  requestAnimationFrame:cb=>cb(),setTimeout:cb=>cb()};
 vm.runInNewContext(code,{window:script,globalThis:script},{timeout:1000});
 return{bridge:script.CrownlightDisplayTerminologyV1,callbacks};
}
test('Display copy deletes only the requested wording and does not substitute text',()=>{
 const {bridge}=api();
 assert.equal(bridge.translate('Affiliate advertisement; simulated study; illustration only'), ';  study;  only');
 assert.equal(bridge.translate('SIMULATED / Simulated'), ' / ');
 assert.equal(bridge.translate('fictional_authored, fictional example'), 'fictional_authored, fictional example');
 assert.equal(bridge.translate('price_simulated_value'), 'price_simulated_value');
});
test('The display-only module never modifies authentication, provider inputs, grading or network APIs',()=>{
 for(const banned of ['fetch(','XMLHttpRequest','localStorage','sessionStorage','innerHTML',
  'eval(','service_role','navigator.sendBeacon'])assert(!code.includes(banned),banned);
 for(const label of ['aria-label','title','placeholder','alt'])assert(code.includes(label),label);
 assert(code.includes('data-raw-provenance'));
 assert(code.includes('MutationObserver'));
 assert(code.includes('characterData:true'));
 assert(code.includes('childList:true'));
});
test('Middleware attaches display terminology only after its existing route protection',()=>{
 assert(middle.includes('crownlight-display-terminology-v1.js'));
 assert(middle.includes('apiMutationBoundary(context,url)'));
 assert(middle.includes('const upstream=await context.next()'));
 assert(middle.indexOf('const denied=await apiMutationBoundary(context,url)')<middle.indexOf('const upstream=await context.next()'));
});
test('Published policy still contains its independent provenance and scope statements',()=>{
 const policy=readFileSync('practice-data-policy.html','utf8');
 for(const required of ['not live exchange quotations',
  'not verified membership totals','actual provenance','not investment advice'])
  assert(policy.includes(required),required);
});
