import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('lab-player.html','utf8'),player=readFileSync('assets/js/lab-player.js','utf8');
const ui=readFileSync('assets/js/learning-lab-edition-panel-v1.js','utf8');
const css=readFileSync('assets/css/learning-lab-edition-panel-v1.css','utf8');
test('Premium member supplement is loaded before player but hidden by default',()=>{
 assert.match(html,/<section id="player-edition-exercise" hidden/);
 assert.match(html,/assets\/js\/learning-lab-edition-panel-v1\.js/);
 assert(html.indexOf('learning-lab-edition-panel-v1.js')<html.indexOf('assets/js/lab-player.js'));
 assert.match(css,/#player-edition-exercise\[hidden\]\{display:none!important\}/);
});
test('Account switching immediately removes private premium output',()=>{
 assert.match(player,/scrubLabPlayerOnIdentityChange\(nextUserId\)\{\s*globalThis\.CrownlightEditionExercisePanelV1\?\.scrub\?\.\(\)/);
 assert.match(ui,/activeController\?\.abort\(\)/);
 assert.match(ui,/host\.replaceChildren\(\);host\.hidden=true/);
});
test('Supplement cannot prevent ungraded baseline lesson',()=>{
 assert.match(player,/renderPlayer\(\);\s*\/\/ The premium supplement is optional/);
 assert.match(player,/if\(session\?\.access_token&&PLAYER\.access\?\.isMember===true&&memberUnchanged\(\)\)/);
 assert.match(player,/alive:memberUnchanged/);
});
test('Educational examples never claim historical prices or mastery',()=>{
 assert.match(ui,/Original fictional prices only/);
 assert.match(ui,/provenance:'fictional'/);
 assert.match(ui,/aria-live','polite'/);
 assert.match(ui,/api\/learning-lab-edition-exercise/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|payment_intent|officialGrade:true|masteryAwarded:true/);
});
test('Keyboard reachable forms and data table remain accessible',()=>{
 assert.match(ui,/createElement\(tag\)/);
 assert.match(ui,/build\('table'\)/);
 assert.match(ui,/build\('caption'/);
 assert.match(ui,/setAttribute\('aria-label','EMA period for fictional exercise'\)/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/@media\(max-width:620px\)/);
});
