import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('visible Constellation v2 assets are cache-busted and homepage scoped',()=>{
 const html=read('index.html'),home=read('assets/js/home-learning-constellation-v1.js');
 const css=read('assets/css/home-constellation-compact-v3.css');
 assert.match(html,/home-constellation-compact-v3\.css\?v=20261105-compact3/);
 assert.match(html,/home-learning-constellation-v1\.js\?v=20261105-compact3/);
 assert.match(home,/prototype-learning-constellation-v1\.js\?v='/);
 assert.match(home,/20261105-compact3/);
 assert.match(home,/root\.dataset\.guConstellationHomeCompact='v3'/);
 assert.match(css,/#learning-constellation #pt-experiences-root \.lc-map-head strong/);
 assert.match(css,/#learning-constellation #pt-experiences-root \.lc-map-tools button/);
 assert.match(css,/font-size:12px!important/);
 assert.match(css,/min-height:350px!important/);
 assert.doesNotMatch(css,/(?:^|\n)#pt-experiences-root \.lc-app\{/);
});
test('Constrained site footer relocation never touches member accounts',()=>{
 const home=read('assets/js/home-learning-constellation-v1.js');
 assert.match(home,/main\.after\(footer\)/);
 assert.match(home,/host\.querySelectorAll\('footer\.footer'\)/);
 assert.match(home,/MutationObserver/);
 for(const term of ['Bearer ','service_role','stripe','fetch(','localStorage'])
  assert.ok(!home.includes(term),term);
});
