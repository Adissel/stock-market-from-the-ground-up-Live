import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('homepage Constellation compact presentation preserves protected map',()=>{
 const index=read('index.html'),css=read('assets/css/home-constellation-compact-v3.css');
 assert.match(index,/home-constellation-compact-v3\.css\?v=20261105-compact3b/);
 for(const name of ['lc-map-head','lc-map-tools button','lc-tabs button','lc-metrics','lc-detail-note'])
   assert.ok(css.includes('#learning-constellation #pt-experiences-root .'+name),name);
 assert.doesNotMatch(css,/(^|\n)#pt-experiences-root \.lc-app\{/);
});
test('constellation notes and shared legal/social footers cannot collide',()=>{
 const app=read('assets/js/prototype-learning-constellation-v1.js');
 const site=read('assets/js/site.js'),runtime=read('assets/js/sitewide-runtime.js');
 assert.match(app,/if\(publicPreview\)\{/);assert.match(app,/root\.querySelectorAll\('footer'\)/);
 assert.match(app,/footer\.replaceWith\(group\)/);
 assert.match(site,/querySelectorAll\('body > footer, footer\.footer'\)/);
 assert.match(site,/querySelector\('body > footer, footer\.footer'\)/);
 assert.match(runtime,/querySelector\('body > footer, footer\.footer'\)/);
});
