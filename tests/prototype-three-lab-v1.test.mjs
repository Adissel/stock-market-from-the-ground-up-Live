/* Crownlight Prototype Center V5 — React/TypeScript/WebGL source and build safety. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const html=read('prototype.html');
const legacy=read('assets/js/prototype-center-v1.js');
const css=read('assets/css/prototype-three-lab-v1.css');
const tsx=read('src/prototype/PrototypeThreeLab.tsx');
const build=read('scripts/build-pages.sh');
const workflow=read('.github/workflows/prototype-center-v1.yml');
assert.match(html,/<section id="pt-app" hidden/,'staff-gated application remains hidden');
assert.match(html,/data-route-access="staff"/);
assert.match(html,/prototype-three-lab-v1\.css/);
assert.match(legacy,/import\('\/assets\/js\/prototype-three-lab-v1\.bundle\.js'\)/,'3D bundle is loaded lazily');
assert.match(legacy,/threeDisposer=module\.mountPrototypeThree\(host\)/,'3D React root has cleanup');
assert.match(legacy,/teardownThree\(\)/,'3D cleanup at navigation and revocation');
assert.match(tsx,/import React,.*'react'/);
assert.match(tsx,/from 'react-dom\/client'/);
assert.match(tsx,/from 'three'/);
assert.match(tsx,/from 'three\/addons\/controls\/OrbitControls\.js'/);
assert.match(tsx,/new THREE\.WebGLRenderer/);
assert.match(tsx,/ResizeObserver/);
assert.match(tsx,/new THREE\.OrthographicCamera/);
assert.match(tsx,/WebGL is unavailable/,'graceful fallback on GPU or browser limitation');
assert.match(tsx,/<table className="pt-table">/,'text-based accessible fallback');
assert.match(tsx,/FICTIONAL · READ ONLY/);
assert.match(tsx,/root\.unmount\(\)/);
assert.match(css,/prefers-reduced-motion/);
assert.match(build,/typescript\/bin\/tsc/,'strict TypeScript typecheck enforced in deployment');
assert.match(build,/esbuild\/bin\/esbuild/,'React/Three bundle compiled before publish');
assert.match(build,/output\/assets/);
assert.match(workflow,/prototype-three-lab-v1\.test\.mjs/);
for(const source of [tsx,css]){
 assert.doesNotMatch(source,/api\/stripe|supabase\.from|service.role|Authorization:\s*Bearer|window\.localStorage\.setItem/i,'3D demo must not write sensitive or account data');
}
assert.equal((legacy.match(/\['3d','3D Experiments'\]/g)||[]).length,1,'preserve one existing 3D workspace');
console.log('PASS: Prototype V5 source security, accessibility, React/TS/Three.js wiring and build requirements.');
