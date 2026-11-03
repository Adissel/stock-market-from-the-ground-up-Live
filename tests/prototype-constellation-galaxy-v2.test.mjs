/* Offline V4 galaxy fallback and source-integrity contract. No live QA credentials. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mountConstellationGalaxy} from '../assets/js/prototype-constellation-galaxy-v2.js';
const events={dataset:{},getContext:()=>null};
const galaxy=mountConstellationGalaxy(events,()=>({yaw:0,pitch:0,depth:0,flat:false}));
assert.equal(galaxy.supported,false,'A WebGL denial must leave a no-throw CSS fallback');
assert.equal(events.dataset.renderer,'css-fallback');
galaxy.render();galaxy.dispose();
const missing=mountConstellationGalaxy(null,()=>({}));
assert.equal(missing.supported,false);
const source=readFileSync('assets/js/prototype-constellation-galaxy-v2.js','utf8');
const map=readFileSync('assets/js/prototype-learning-constellation-v1.js','utf8');
const css=readFileSync('assets/css/prototype-learning-constellation-v1.css','utf8');
assert.match(map,/mountConstellationGalaxy/);
assert.match(map,/galaxy\.dispose\(\)/,'Unmount must release WebGL resources');
assert.match(map,/data-lc="galaxy"/);
assert.match(map,/data-lc="flatten"/,'Accessible flat view required');
assert.match(css,/lc-galaxy-layer\[hidden\]/,'Hidden starfield must remain hidden');
assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|WebSocket|supabase|stripe|localStorage|document\.cookie|serviceRole/i,
 'Decorative galaxy cannot perform third-party, payment or member-data operations');
console.log('PASS standalone WebGL/CSS fallback, resource teardown and zero-network source boundary');
