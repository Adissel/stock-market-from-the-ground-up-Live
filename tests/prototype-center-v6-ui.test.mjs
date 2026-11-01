/* Crownlight Prototype Center v6: prove the default page is a redesigned
 * React/TypeScript + JavaScript + ECharts + WebGL-ready workbench.
 * Source tests supplement (do not replace) authorized Chromium acceptance.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const html=read('prototype.html');
const shell=read('assets/js/prototype-center-v1.js');
const sync=read('assets/js/prototype-preset-sync-v1.js');
const css=read('assets/css/prototype-center-v6.css');
const react=read('src/prototype/PrototypeWorkbenchDeck.tsx');
const build=read('scripts/build-pages.sh');
const workflow=read('.github/workflows/prototype-center-v1.yml');
assert.match(html,/data-route-access="staff"/);
assert.match(html,/<section id="pt-app" hidden/);
assert.match(html,/id="pt-command-deck"/);
assert.match(html,/prototype-center-v6\.css/);
assert.match(html,/id="pt-experience"/);
assert.match(html,/id="pt-case-host"/);
assert.match(html,/id="pt-designer"/);
assert.match(html,/id="pt-design-remote"/);
assert.ok(html.indexOf('id="pt-experience"')<html.indexOf('id="pt-content"'),'Real ECharts + lesson preview comes BEFORE the long design editor');
assert.match(shell,/import\('\/assets\/js\/prototype-deck-v6\.bundle\.js'\)/);
assert.match(shell,/module\.mountPrototypeDeck\(host\)/);
assert.match(shell,/CustomEvent\('crownlight:prototype-workspace'/);
assert.match(shell,/addEventListener\('crownlight:prototype-navigate'/);
assert.match(shell,/window\.CrownlightPrototypeTeaching\.mount\(caseHost/);
assert.match(shell,/caseHost\.hidden=/);
assert.match(shell,/teardownDeck\(\)/);
assert.match(shell,/teardownThree\(\)/);
assert.match(sync,/designRemote\.append\(controls\)/,'Server draft editing remains available but below primary preview');
assert.match(react,/from 'react-dom\/client'/);
assert.match(react,/useEffect, useState/);
assert.match(react,/CustomEvent\('crownlight:prototype-navigate'/);
for(const id of ['classroom','studio','labs','3d','visuals','bootcamps'])assert.ok(react.includes("id:'"+id+"'"),id+' quick navigation');
assert.match(css,/pt-experience-grid/);
assert.match(css,/pt-command-menu/);
assert.match(css,/pt-case-host\[hidden\]/);
assert.match(css,/prefers-reduced-motion/);
assert.match(build,/PrototypeWorkbenchDeck\.tsx/);
assert.match(build,/prototype-deck-v6\.bundle\.js/);
assert.match(workflow,/tests\/prototype-center-v6-ui\.test\.mjs/);
for(const item of [react,css])assert.doesNotMatch(item,/\/api\/(?:stripe|checkout)|SERVICE_ROLE_KEY|protectedAnswerKeys|set_entitlement|livePayment/,'No privilege or payment operations in presentation');
console.log('PASS Prototype V6: redesigned staff entry, interactive command deck, prominent chart & lesson preview, retained protected draft flows, HTML5/CSS3/React/TS/JS/Three.js isolation.');
