/* Prevent legacy global runtime injection from overriding Talia V4 React classrooms.
 * Source-level regression only; authenticated Playwright verification remains separate.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const middleware=readFileSync('functions/_middleware.js','utf8');
const member=readFileSync('talia-classroom.html','utf8');
const staff=readFileSync('talia-tutor-prototype.html','utf8');
const build=readFileSync('scripts/build-pages.sh','utf8');

test('all Talia route aliases enter the modern runtime ownership branch',()=>{
  for(const route of [
    '/talia-classroom','/talia-classroom.html',
    '/talia-tutor-prototype','/talia-tutor-prototype.html'
  ])assert.ok(middleware.includes("'"+route+"'"),'unprotected runtime ownership alias '+route);
  const guard=middleware.indexOf('if(STANDALONE_VISUAL_ROUTES.has(path))');
  const legacy=middleware.indexOf("'dashboard-ui-legacy.js'",guard);
  assert.ok(guard>0 && legacy>guard,'Modern isolation must run before legacy script injection');
  const endOfGuard=middleware.indexOf(`el.append('<meta name="application-version"'`,guard);
  assert.ok(endOfGuard>guard && endOfGuard<legacy,'Isolated branch must end before sitewide enhancers');
  const branch=middleware.slice(guard,endOfGuard);
  assert.match(branch,/auth-boundary\.js/,'auth guard must remain active');
  assert.match(branch,/service-worker\.js/,'service-worker migration must remain active');
  assert.match(branch,/return;/,'new page must exit the legacy enhancer branch');
  assert.doesNotMatch(branch,/dashboard-ui-legacy|frontend-freeze|sitewide-composition|production-completion/);
  assert.match(middleware,/POLICY\.isProtected\(path\)/,'protected route authorization must remain');
});
test('member and staff classrooms own their explicit React and CSS runtime',()=>{
  assert.doesNotMatch(member,/<script[^>]*src=["']\/assets\/js\/site\.js(?:\?[^"']*)?["']/i,
    'historical site.js would load global CSS and extra DOM modifiers');
  assert.match(member,/talia-classroom-v1\.bundle\.js/);
  assert.match(member,/session-manager\.js/);
  assert.match(member,/supabase-client\.js/);
  assert.match(member,/talia-terminal-v4\.css/);
  assert.match(staff,/talia-prototype-gate-v1\.js/);
  assert.match(staff,/talia-classroom-pro-v2\.css/);
  assert.match(staff,/data-route-access="staff"/);
});
test('production Cloudflare Pages build enforces the modern ownership gate',()=>{
  assert.match(build,/node --test tests\/runtime-owned-talia-v1\.test\.mjs/);
});
