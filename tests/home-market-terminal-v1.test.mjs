import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const tsx=readFileSync('src/experience/HomeMarketTerminal.tsx','utf8'),build=readFileSync('scripts/build-pages.sh','utf8'),html=readFileSync('index.html','utf8');
test('home live JSX entry built with React/TypeScript',()=>{assert.match(build,/HomeMarketTerminal\.tsx/);assert.match(build,/typescript\/bin\/tsc/);assert.match(build,/home-market-terminal-v1\.bundle\.js/);assert.match(html,/type="module" src="\/assets\/js\/home-market-terminal-v1\.bundle\.js/);});
test('ECharts powered OHLCV with indicator and volume',()=>{for(const s of ['CrownlightECharts','candlestick','volume','dataZoom','EMA 9','SMA 20','ResizeObserver','setWindowSize'])assert.ok(tsx.includes(s),s);});
test('public simulation respects member data boundaries',()=>{assert.doesNotMatch(tsx,/supabase|access_token|service_role|fetch\(|\/api\/|protectedAnswer|gradeMember/i);assert.match(tsx,/Fictional simulation/);assert.match(tsx,/simulator\.html/);});

test('member progress is rendered from original statistics with no member data writes',()=>{
 const p=readFileSync('src/experience/MemberProgressVisual.tsx','utf8');
 const d=readFileSync('dashboard.html','utf8');
 for(const id of ['labs-completed','labs-in-progress','labs-not-started','dashboard-content'])assert.ok(p.includes(id),'missing original data binding '+id);
 assert.match(d,/member-progress-visual-v1\.bundle\.js/);
 assert.match(build,/MemberProgressVisual\.tsx/);
 assert.match(p,/MutationObserver/);
 assert.doesNotMatch(p,/fetch\(|supabase|access_token|\/api\/|localStorage|service_role/i);
});
