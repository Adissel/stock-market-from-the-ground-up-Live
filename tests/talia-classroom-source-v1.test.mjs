// SMFGU-TALIA-CHAT-001: source boundary checks (not a substitute for authenticated browser QA).
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/tutor/TaliaClassroom.tsx',import.meta.url),'utf8');
const html=readFileSync(new URL('../talia-classroom.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/css/talia-classroom-v1.css',import.meta.url),'utf8');
const build=readFileSync(new URL('../scripts/build-pages.sh',import.meta.url),'utf8');
test('classroom uses existing service authority and never initiates paid AI inference',()=>{
 assert.match(source,/fetch\('\/api\/market-tutor'/);
 assert.match(source,/allowModel:false/);
 assert.match(source,/fetch\('\/api\/member-tutor-history'/);
 assert.match(source,/fetch\('\/api\/member-tutor-conversations'/);
 assert.match(source,/getSession\(\)/);
 assert.match(source,/onAuthStateChange/);
 assert.match(source,/identity\.current!==targetId/);
 assert.match(source,/pending\.current\?\.abort\(\)/);
 assert.doesNotMatch(source,/localStorage|sessionStorage|innerHTML|service_role|SUPABASE_SECRET_KEY|fetch\(['"]https?:/i);
 assert.doesNotMatch(source,/private.*(rubric|answer.key)|brokerOrder|placeOrder/i);
});
test('fictional replay supplies only the revealed candles to the renderer',()=>{
 assert.match(source,/FICTIONAL \/ NO LOOKAHEAD/);
 assert.match(source,/REPLAY\.slice\(0,visible\)/);
 assert.match(source,/visible===REPLAY\.length/);
 assert.match(source,/Latest visible completed candle/);
 assert.match(source,/Fictional completed-bar teaching example/);
 const dataSource=source.match(/const REPLAY:number\[\]\[\]=\[([\s\S]*?)\];/);
 assert.ok(dataSource,'fixture declared');
 const data=[...dataSource[1].matchAll(/\[([\d.,\s]+)\]/g)].map(m=>m[1].split(',').map(Number));
 assert.equal(data.length,12);
 for(const [open,close,low,high] of data){
  assert.ok(Number.isFinite(open)&&Number.isFinite(close));
  assert.ok(low<=Math.min(open,close)&&high>=Math.max(open,close));
 }
});
test('new React page is access-aware, keyboard accessible and only compiled in Pages build',()=>{
 assert.match(html,/data-auth-required="true"/);
 assert.match(html,/type="module" src="\/assets\/js\/talia-classroom-v1\.bundle\.js/);
 assert.match(html,/crownlight-echarts-loader-v1\.js/);
 assert.match(source,/role="log"/);
 assert.match(source,/aria-live="polite"/);
 assert.match(source,/type="submit"/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(build,/TaliaClassroom\.tsx/);
 assert.match(build,/talia-classroom-v1\.bundle\.js/);
});
