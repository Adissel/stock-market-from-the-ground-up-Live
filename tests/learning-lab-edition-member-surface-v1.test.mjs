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
test('Supplement is optional and never exposes formative material in protected modes',()=>{
 assert.match(player,/function renderPlayer\(\)\{globalThis\.CrownlightEditionExercisePanelV1\?\.scrub\?\.\(\)/);
 assert.match(player,/mountOptionalPremiumEdition\(\)/);
 assert.match(player,/!\['guided','practice'\]\.includes\(mode\)/);
 assert.match(player,/if\(stage>=5\)globalThis\.CrownlightEditionExercisePanelV1\?\.scrub\?\.\(\)/);
 assert.match(ui,/!\['guided','practice'\]\.includes\(mode\)/);
 assert.match(player,/labPlayerSessionEpoch===epoch/);
 assert.match(player,/session\?\.user\?\.id!==memberId/);
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
 assert.match(ui,/EMA period for fictional exercise/);
 assert.match(ui,/Observations embargoed between training and holdout/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/@media\(max-width:620px\)/);
 assert.match(ui,/Completed fictional observations used by the server/);
 assert.match(ui,/CrownlightECharts\?\.load/);
 assert.match(ui,/e\.connect\(activeCharts\)/);
 assert.match(ui,/activeCharts\.forEach\(chart=>chart\.dispose/);
 assert.match(css,/gu-edition-linked-charts/);
});

test('Professional member surface exposes completed-frame reasoning and uncertainty boundaries',()=>{
 assert.match(ui,/Completed timeframe decision evidence/);
 assert.match(ui,/Change from prior/);
 assert.match(ui,/Reviewed prerequisite practice route/);
 assert.match(ui,/Professional uncertainty evidence/);
 assert.match(ui,/What this evidence cannot establish/);
 assert.doesNotMatch(ui,/future outcome is known|guaranteed execution|official mastery awarded/i);
});

test('Enterprise member source is enabled only after explicit release grant',()=>{
 assert.match(ui,/for\(const edition of \['ENTERPRISE','PROFESSIONAL','ADVANCED'\]\)/);
 assert.match(ui,/edition==='ENTERPRISE'\?'chronological_validation'/);
 assert.match(ui,/The held-out values are not displayed or used to choose a method/);
 assert.match(ui,/selected==='ENTERPRISE'\?\[1,2,3\]:\[5,9,12,20\]/);
});

test('Private edition workspace is member and canonical Lab scoped with revision conflict handling',()=>{
 assert.match(player,/labId:PLAYER\.lab\?\.id/);
 assert.match(ui,/caseKey=typeof labId==='string'/);
 assert.match(ui,/Save private study/);
 assert.match(ui,/Restore private study/);
 assert.match(ui,/expectedRevision:revision/);
 assert.match(ui,/response\.status===409/);
 assert.match(ui,/revision=data\.workspace\.revision/);
 assert.match(ui,/host\.replaceChildren\(\);host\.hidden=true;return/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage/);
});
