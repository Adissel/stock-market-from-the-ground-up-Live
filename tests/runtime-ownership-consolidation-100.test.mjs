/* Runtime ownership consolidation — 100+ independent route/source contracts.
 * These are SOURCE-LEVEL acceptance checks. Genuine member/Chromium checks
 * remain separate and required before the entire release is certified.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
const mw=read('functions/_middleware.js');
const freeze=read('assets/js/frontend-freeze.js');
const front=read('assets/js/frontend-complete.js');
const production=read('assets/js/production.js');
const runtime=read('assets/js/sitewide-runtime.js');
const css=read('assets/css/frontend-complete.css');
const teachingCss=read('assets/css/teaching-full-width-v1.css');
const build=read('scripts/build-pages.sh');
const start=mw.indexOf('const LEGACY_COPY_FIX_ROUTES=');
const stop=mw.indexOf('const JSON_HEADERS=',start);
assert(start>0&&stop>start,'Middleware ownership policy boundaries missing');
const scope={};
vm.runInNewContext(mw.slice(start,stop)+
 '\nthis.canonicalRuntimeRoute=canonicalRuntimeRoute;this.inject=shouldInjectLegacyModule;this.style=shouldInjectLegacyStylesheet;',scope,{timeout:1000});
const check=(file,route)=>scope.inject(file,route);
const teaching=[
 'labs','lab-player','site-lab','lab-samples','lab-v32-member',
 'lab-v32-reference','bootcamp','bootcamp-academy','simulator',
 'journal','journal-entry','journal-analytics','market-tutor',
 'ondemand-training','verified-replay','free-watchlist',
 'free-foundations-challenge','chart-reveal-practice','candle-practice',
 'assessments','compare','review-queue','skills','training-editor'
];
for(const page of teaching){
 const route='/'+page+'.html';
 test(route+' excludes obsolete production.js',()=>assert.equal(check('production.js',route),false));
 test(route+' excludes old completion renderer',()=>assert.equal(check('production-completion.js',route),false));
 test(route+' excludes old global footer/DOM observer',()=>assert.equal(check('frontend-freeze.js',route),false));
 test(route+' excludes dashboard-only controller',()=>assert.equal(check('dashboard-ui-legacy.js',route),false));
 test(route+' excludes dashboard-only stylesheet',()=>assert.equal(scope.style('dashboard.css',route),false));
 test(route+' preserves canonical navigation',()=>assert.equal(check('navigation.js',route),true));
 test(route+' retains modern UI enhancement owner',()=>assert.equal(check('frontend-complete.js',route),true));
 test(route+' excludes retired copy remover',()=>assert.equal(check('live-fixes.js',route),false));
}
for(const page of ['dashboard','admin','store','index','market-commons']){
 test(page+' retains approved legacy completion shell',()=>assert.equal(check('production-completion.js','/'+page+'.html'),true));
}
for(const page of ['account','access','settings','data-connections','forum','signin','create-account']){
 test(page+' retains legacy alias/auth redirects',()=>assert.equal(check('production.js','/'+page+'.html'),true));
}
for(const route of ['/dashboard','/dashboard.html']){
 test(route+' retains Dashboard controller',()=>assert.equal(check('dashboard-ui-legacy.js',route),true));
 test(route+' retains Dashboard CSS',()=>assert.equal(scope.style('dashboard.css',route),true));
}
for(const route of ['/','/index.html','/store.html','/membership.html','/dashboard.html']){
 test(route+' retains historically approved copy cleanup only where needed',()=>assert.equal(check('live-fixes.js',route),true));
}
test('all native Talia route aliases retain isolated ownership',()=>{
 for(const route of ['/talia-classroom','/talia-classroom.html','/talia-tutor-prototype','/talia-tutor-prototype.html'])
  assert(mw.includes("'"+route+"'"));
 assert(mw.includes('if(STANDALONE_VISUAL_ROUTES.has(path))'));
});
test('middleware keeps protected authentication and session workers',()=>{
 assert.match(mw,/POLICY\.isProtected\(path\)/);
 assert.match(mw,/auth-boundary\.js/);
 assert.match(mw,/service-worker\.js/);
 assert.match(mw,/presence\.js/);
});
test('module gates are enforced at injected SCRIPT sites',()=>{
 assert.match(mw,/if\(!shouldInjectLegacyModule\(file,path\)\)continue/);
 assert.match(mw,/if\(!shouldInjectLegacyStylesheet\(file,path\)\)continue/);
});
test('existing lab and lesson presentation remains available',()=>{
 assert.match(mw,/lab-registry\.js/);
 assert.match(mw,/lab-narrative\.js/);
 assert.match(mw,/site-lab-experience\.js/);
 assert.match(mw,/lab-v33-site-shell\.css/);
});
test('historical footer only runs as fallback when canonical navigation is absent',()=>{
 assert.match(freeze,/if\(q\('script\[src\*="\/assets\/js\/navigation\.js"\]'\)\)return/);
 assert.match(freeze,/async function stableFooter\(\)/);
});
test('historical link repair cannot mutate teaching content links',()=>{
 assert.match(freeze,/header a\[href\],footer a\[href\],\.gu-member-side-menu a\[href\]/);
 assert.doesNotMatch(freeze,/qa\('a\[href\]'\)/);
});
test('old broad observer no longer scans all content on every mutation',()=>{
 assert.match(freeze,/clearTimeout\(pendingCleanup\)/);
 assert.match(freeze,/setTimeout\(acceptanceCleanup,160\)/);
 assert.match(freeze,/\.observe\(document\.body,\{childList:true,subtree:true\}\)/);
 assert.doesNotMatch(freeze,/new MutationObserver\(acceptanceCleanup\)/);
});
test('canonical policy directory stops duplicate footer policies',()=>{
 assert.match(production,/footer a\[href="\/legal\.html"\]/);
 assert.match(production,/v13-policy-links/);
});
test('unverified version does not overwrite verified release metadata',()=>{
 assert.match(runtime,/const configured=/);
 assert.match(runtime,/const prior=/);
 assert.match(runtime,/if\(version\)/);
 assert.doesNotMatch(runtime,/m\.content='unverified'/);
});
test('Simulator preserves teaching sequence and disables arbitrary panel reorder',()=>{
 const x=front.slice(front.indexOf('function simulatorEnhance(){'),front.indexOf('function membershipCompare(){'));
 assert.match(x,/panel\.draggable=false/);
 assert.match(x,/local\.del\('sim-layout-order'\)/);
 assert.match(x,/layout\.classList\.remove\('fe-sortable'\)/);
 assert.match(x,/savePref\('simulator',\{preset:sel\.value\}\)/);
 assert.doesNotMatch(x,/insertBefore\(dragged/);
 assert.doesNotMatch(x,/fe-sim-move-handle/);
 assert.doesNotMatch(x,/dragstart/);
});
test('Dashboard must not make every widget draggable',()=>{
 const x=front.slice(front.indexOf('function customizeDashboard(ov){'),front.indexOf('async function renderBilling(host){'));
 assert.match(x,/panel\.draggable=false/);
 assert.match(x,/fe-widget-move-handle/);
 assert.match(x,/event\.target!==qs\('\.fe-widget-move-handle'/);
});
test('Client shortcut cannot blindly trigger graded or purchase submissions',()=>{
 const x=front.slice(front.indexOf('function globalShortcuts(){'),front.indexOf('function showShortcuts(){'));
 assert.doesNotMatch(x,/\[type="submit"\]/);
 assert.match(x,/button\[data-draft-save\]/);
 assert.match(x,/isContentEditable/);
});
test('specific save shortcuts still exist for approved Admin dialogs',()=>{
 const x=front.slice(front.indexOf('function globalShortcuts(){'),front.indexOf('function showShortcuts(){'));
 assert.match(x,/#admin-dialog-save,#v11-modal-save/);
});
test('Dashboard maintains keyboard-accessible section ordering',()=>{
 assert.match(front,/aria-label="Move dashboard section earlier"/);
 assert.match(front,/aria-label="Move dashboard section later"/);
 assert.match(css,/\.fe-widget-sort-controls button:focus-visible/);
});
test('chart canvas does not inherit always-on HTML drag behavior',()=>{
 assert.doesNotMatch(front,/x\.draggable=layout\.classList/);
 assert.match(front,/qsa\(':scope > \*',layout\)/);
});
test('Cloudflare build enforces consolidated source contracts',()=>{
 assert.match(build,/node --test tests\/runtime-ownership-consolidation-100\.test\.mjs/);
});

test('mobile teaching shells do not clip chart menus or overlays',()=>{
 const mobile=teachingCss.slice(teachingCss.indexOf('/* Mobile chart and instructional overlay access.'));
 assert(mobile.startsWith('/* Mobile chart and instructional overlay access.'));
 assert.match(mobile,/@media\(max-width:640px\)/);
 assert.match(mobile,/body\.gu-teaching-wide main\.section>/);
 assert.match(mobile,/body\.gu-lab-member\.gu-teaching-wide #app/);
 assert.match(mobile,/body\.gu-bc-learning\.gu-teaching-wide \.academy-study-grid/);
 assert.match(mobile,/overflow-x:visible!important/);
 assert.match(mobile,/overflow-y:visible!important/);
 assert.doesNotMatch(mobile,/overflow-x:hidden/);
});
test('horizontal instructional controls remain scrollable on mobile',()=>{
 assert.match(teachingCss,/\.gu-learning-top-nav\{[\s\S]*?overflow-x:auto!important/);
 assert.match(teachingCss,/:is\(pre,table\)\{[\s\S]*?overflow-x:auto!important/);
});
