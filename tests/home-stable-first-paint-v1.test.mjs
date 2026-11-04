/* Deterministic first-paint contract for authenticated/public Home.
 * This is not a substitute for genuine Owner/James_Test browser acceptance.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const read=p=>readFileSync(p,'utf8');
const code=read('assets/js/home-stable-first-paint-v1.js');
const home=read('index.html');
const workspace=read('assets/js/crownlight-continuous-workspace-v1.js');
const navigation=read('assets/js/navigation.js');

function browser(){
 const classes=new Set(),style={textContent:'',removed:false,
  setAttribute(){},remove(){this.removed=true}};
 const html={dataset:{},classList:{
  add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)}};
 const nav={dataset:{}},body={dataset:{}},listeners={};
 let timer=null,observer=null,disconnected=false;
 const document={
  documentElement:html,body,readyState:'loading',
  head:{append(x){assert.equal(x,style)}},
  createElement(tag){assert.equal(tag,'style');return style},
  addEventListener(name,fn){listeners[name]=fn},
  querySelector(selector){return selector==='.site-header .navlinks'?nav:null}
 };
 class MutationObserver{
  constructor(fn){observer=fn}
  observe(){assert.equal(disconnected,false)}
  disconnect(){disconnected=true}
 }
 const scope={document,MutationObserver,
  setTimeout(fn){timer=fn;return 37},
  clearTimeout(){timer=null},
  requestAnimationFrame(fn){fn()}};
 vm.runInNewContext(code,scope,{timeout:1000});
 return {
  classes,style,nav,body,html,domReady(){listeners.DOMContentLoaded?.()},
  change(){observer?.()},expire(){timer?.()},get hasSafety(){return !!timer},
  get observerDisconnected(){return disconnected}
 };
}

test('Home loads first-paint guard before all sitewide navigation and presentation scripts',()=>{
 const a=home.indexOf('home-stable-first-paint-v1.js');
 const b=home.indexOf('site.js?v=');
 assert(a>0&&b>a);
 assert.match(home,/main class="gu-premium-home"/);
 assert.match(home,/class="gu-home-terminal"/);
 assert.match(home,/id="cl-home-initial-loading" role="status" aria-live="polite"/);
 assert.match(code,/#cl-home-initial-loading/);
 for(const asset of ['premium-design-v014168.css','crownlight-page-workspace-v2.css','crownlight-page-style-visibility-v3.css','crownlight-cardless-layout-v1.css']){
  assert(home.includes(asset),'The published layout must have its CSS before first paint: '+asset);
  assert(home.indexOf(asset)<home.indexOf('</head>'),'Critical style must be an initial head link');
 }
});
test('Initial public/Classic shell cannot appear before verified state',()=>{
 const h=browser();
 assert(h.classes.has('cl-home-initializing'));
 assert.match(h.style.textContent,/main\.gu-premium-home,[\s\S]*visibility:hidden!important/);
 assert.match(h.style.textContent,/\.site-header/);
 h.domReady();
 assert(h.classes.has('cl-home-initializing'));
 assert(h.hasSafety);
});
test('Authenticated navigation alone cannot reveal the wrong default page style',()=>{
 const h=browser();h.domReady();h.nav.dataset.v11Owned='1';h.change();
 assert(h.classes.has('cl-home-initializing'));
});
test('Published page style alone cannot reveal the anonymous navigation first',()=>{
 const h=browser();h.domReady();h.body.dataset.clWorkspace='continuous';h.change();
 assert(h.classes.has('cl-home-initializing'));
});
test('Ready after both independently verified controllers removes the guard',()=>{
 const h=browser();h.domReady();
 h.nav.dataset.v11Owned='1';h.change();h.body.dataset.clWorkspace='continuous';h.change();
 assert.equal(h.classes.has('cl-home-initializing'),false);
 assert.equal(h.style.removed,true);
 assert.equal(h.observerDisconnected,true);
});
test('Classic presentation remains a valid resolved state for public guests',()=>{
 const h=browser();h.domReady();h.body.dataset.clWorkspace='classic';
 h.nav.dataset.v11Owned='1';h.change();
 assert.equal(h.classes.has('cl-home-initializing'),false);
});
test('Auth or layout service outages cannot leave the homepage hidden indefinitely',()=>{
 const h=browser();h.domReady();h.expire();
 assert.equal(h.classes.has('cl-home-initializing'),false);
 assert.equal(h.style.removed,true);
});
test('This change does not override published page choice, roles or owner controls',()=>{
 assert.match(workspace,/apply\(result\.mode\)/);
 assert.match(workspace,/if\(result\.ownerPreview===true\)ownerBar/);
 assert.match(navigation,/nav\.dataset\.v11Owned='1'/);
 assert.doesNotMatch(code,/localStorage|checkout|save\(|fetch\(|setting_save|clWorkspace\s*=|getSupabaseClient/);
});
test('Pages build executes the first-paint regression suite',()=>{
 assert.match(read('scripts/build-pages.sh'),/node --test tests\/home-stable-first-paint-v1\.test\.mjs/);
});
