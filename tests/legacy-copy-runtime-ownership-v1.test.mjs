/* Historical copy cleanup must not override new teaching applications.
 * Live browser routes are controlled by middleware; VM tests validate cached JS fallback.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync('assets/js/live-fixes.js','utf8');
const middleware=readFileSync('functions/_middleware.js','utf8');
const build=readFileSync('scripts/build-pages.sh','utf8');
function run(route,setup={}){
  const state={queried:[],observerCount:0,marked:[],removed:[]};
  const parent={children:[{}],textContent:'The account notice: transaction, tax, fraud-prevention, dispute, security, or audit records may be retained',remove(){state.removed.push('parent')}};
  const leaf={children:[],textContent:'Transaction, tax, fraud-prevention, dispute, security, or audit records may be retained.',remove(){state.removed.push('leaf')}};
  const promo={remove(){state.removed.push('promotion')}};
  const heading={textContent:'Lifetime platform access follows the entire first-party trading library',closest:()=>promo};
  const document={
    readyState:'complete',
    body:{setAttribute:(name,value)=>state.marked.push([name,value])},
    querySelectorAll(selector){
      state.queried.push(selector);
      if(selector==='h1,h2,h3,h4')return setup.promo?[heading]:[];
      if(selector==='.eyebrow,[class*="eyebrow"]')return [];
      if(selector==='p,small,div')return [parent,leaf];
      throw Error('Unrecognized selector: '+selector);
    }
  };
  const environment={
    document,location:{pathname:route},
    MutationObserver:class {constructor(callback){this.callback=callback;state.observerCount++}observe(){}disconnect(){}},
    setTimeout(){return 1},clearTimeout(){},console
  };
  vm.runInNewContext(source,environment,{timeout:1000});
  return state;
}
test('Historical removal module cannot run on instructional and chart routes',()=>{
  const modern=[
    '/labs','/labs.html','/lab-player.html','/bootcamp',
    '/bootcamp-academy.html','/site-lab.html','/simulator.html',
    '/talia-classroom.html','/talia-tutor-prototype.html',
    '/journal.html','/watchlist.html','/market-tutor.html'
  ];
  for(const route of modern){
    const x=run(route,{promo:true});
    assert.equal(x.queried.length,0,route+' still runs legacy cleanup');
    assert.equal(x.observerCount,0,route+' still watches modern DOM');
    assert.deepEqual(x.removed,[],route+' still removes modern content');
  }
});
test('Dashboard legacy copy removal cannot erase ancestor containers',()=>{
  const x=run('/dashboard.html');
  assert.ok(x.queried.length>0);
  assert.deepEqual(x.removed,['leaf']);
  assert.equal(x.observerCount,1);
});
test('Approved legacy promotion correction remains available on membership',()=>{
  const x=run('/membership.html',{promo:true});
  assert.deepEqual(x.removed,['promotion','leaf']);
});
test('Middleware injects historical patch only on its approved routes',()=>{
  assert.match(middleware,/const LEGACY_COPY_FIX_ROUTES=/);
  assert.match(middleware,/if\(!shouldInjectLegacyModule\(file,path\)\)continue/);
  assert.match(middleware,/if\(file==='live-fixes\.js'\)return LEGACY_COPY_FIX_ROUTES\.test/);
  assert.match(middleware,/el\.append\('<script defer src="\/assets\/js\/auth-boundary\.js"/);
  assert.match(middleware,/el\.append\('<script defer src="\/assets\/js\/service-worker\.js"/);
  assert.match(middleware,/if\(STANDALONE_VISUAL_ROUTES\.has\(path\)\)/);
});
test('Cloudflare build enforces legacy copy ownership checks',()=>{
  assert.match(build,/node --test tests\/legacy-copy-runtime-ownership-v1\.test\.mjs/);
});
