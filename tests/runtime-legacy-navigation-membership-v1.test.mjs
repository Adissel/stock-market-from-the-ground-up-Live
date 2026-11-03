/* Runtime ownership: preserve legitimate member links and workspace headings.
 * Verify actual legacy function bodies with a controlled synthetic DOM.
 * No credentials, service requests, payment operations or account mutations.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const nav=readFileSync('assets/js/navigation.js','utf8');
const frontend=readFileSync('assets/js/frontend-complete.js','utf8');
const catalog=readFileSync('assets/js/membership-platform.js','utf8');
const signup=readFileSync('create-account.html','utf8');
const verification=readFileSync('book-receipt-verification.html','utf8');
const build=readFileSync('scripts/build-pages.sh','utf8');
function piece(source,start,end){
 const i=source.indexOf(start),j=source.indexOf(end,i);
 assert.ok(i>=0&&j>i,'Missing runtime source boundary: '+start);
 return source.slice(i,j);
}
const navRuntime=piece(nav,'  function removeLegacy(){','  function passwordToggles(root=document){')+
 '\nthis.actions={removeLegacy,removeLearningIdentityCopy};';
const membershipRuntime=piece(frontend,'function membershipEnhance(){','function forumEnhance(){')+
 '\nthis.membershipEnhance=membershipEnhance;';

function navHarness(route){
 const state={links:[],removed:[],queried:[]};
 function anchor(href){
  const node={href,getAttribute(k){assert.equal(k,'href');return href},remove(){state.removed.push(href)}};
  state.links.push(node);return node;
 }
 const parent={children:[{}],textContent:'Digital-sales control: parent has legitimate descendants',remove(){state.removed.push('parent')}};
 const leaf={children:[],textContent:'Digital-sales control: retired standalone text',remove(){state.removed.push('leaf')}};
 const heading={textContent:'Learning identity',remove(){state.removed.push('heading')}};
 const copy={children:[],textContent:'Your username is also your permanent display name and forum identity.',remove(){state.removed.push('copy')}};
 const document={querySelectorAll(selector){
  state.queried.push(selector);
  switch(selector){
   case 'div,section,aside,p':return [parent,leaf];
   case 'a[href]':return state.links;
   case 'p,small,div':return [copy];
   case 'h1,h2,h3,h4,.eyebrow':return [heading];
   default:throw Error('Unexpected DOM selector: '+selector);
  }
 }};
 const location={origin:'https://example.test',href:'https://example.test'+route,pathname:route};
 const scope={document,location,URL,path:route};
 vm.runInNewContext(navRuntime,scope,{timeout:1000});
 return {...state,anchor,actions:scope.actions};
}
test('retired correction links are distinguished from active receipt verification',()=>{
 const x=navHarness('/create-account.html');
 x.anchor('corrections.html');
 x.anchor('/verification.html?source=legacy');
 x.anchor('/book-receipt-verification.html');
 x.anchor('book-receipt-verification.html?book=1');
 x.anchor('https://other.test/corrections.html');
 x.anchor('/receipt/verification.html/details');
 x.actions.removeLegacy();
 assert.deepEqual(x.removed,['leaf','corrections.html','/verification.html?source=legacy']);
 assert.ok(signup.includes('book-receipt-verification.html'));
 assert.match(verification,/<h1>Verify your book purchase<\/h1>/i);
});
test('parent elements containing legacy promo text cannot be deleted',()=>{
 const x=navHarness('/dashboard.html');
 x.actions.removeLegacy();
 assert.deepEqual(x.removed,['leaf']);
});
test('Dashboard and teaching routes keep Learning identity headings',()=>{
 for(const route of ['/dashboard.html','/labs.html','/bootcamp-academy.html','/lab-player.html','/simulator.html']){
  const x=navHarness(route);
  x.actions.removeLearningIdentityCopy();
  assert.deepEqual(x.removed,[],route+' had identity UI deleted');
 }
});
test('legacy registration text cleanup is scoped to authentication forms',()=>{
 const x=navHarness('/create-account.html');
 x.actions.removeLearningIdentityCopy();
 assert.deepEqual(x.removed,['copy','heading']);
});
test('membership comparison anchors remain real links without a recurring remover',()=>{
 const calls={replaced:0,observers:0};
 const link={replaceWith(){calls.replaced++}};
 const matrix={links:[link]};
 const scope={
  path:'/membership.html',
  qs:()=>matrix,qsa:()=>matrix.links,
  document:{createElement:()=>({})},
  MutationObserver:class {constructor(){calls.observers++}observe(){}}
 };
 vm.runInNewContext(membershipRuntime,scope,{timeout:1000});
 scope.membershipEnhance();
 assert.deepEqual(calls,{replaced:0,observers:0});
});
test('removing the legacy stripper does not enable disabled paid enrollment',()=>{
 assert.match(catalog,/Enrollment Opening Soon/);
 assert.match(catalog,/Tool Subscription Coming Soon/);
 assert.match(catalog,/disabled-buy/);
 assert.match(build,/node --test tests\/runtime-legacy-navigation-membership-v1\.test\.mjs/);
});
