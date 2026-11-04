import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('Member Status metric names are constant and correctly spelled',()=>{
 const s=read('assets/js/home-community.js');
 assert.match(s,/textContent='Online members'/);
 assert.match(s,/textContent='Registered members'/);
 assert.doesNotMatch(s,/Example online members|Example registered members|EXAMPLE DATA/);
 assert.match(s,/example\?'EXAMPLE':'LIVE'/);
 assert.match(s,/Owner-configured demonstration values only/);
 assert.match(s,/not verified registered or online members/);
 assert.match(s,/subtext:example\?'':'LAST 60 MIN'/);
 assert.match(s,/if\(snapshot&&!failed\)/,'Failed refresh must not relabel stale snapshots LIVE');
 assert.match(s,/panel\.querySelector\('\[data-online\]'\)\.textContent='—'/,'Unavailable data must not retain stale counts');
 assert.match(s,/>CONNECTING<\/span>/,'Do not assert LIVE before the aggregate API responds');
 assert.doesNotMatch(s,/EXAMPLE DATA|ILLUSTRATIVE/i);
});
test('Core public learning chart wording uses simulated, not unsourced live data',()=>{
 for(const p of ['src/experience/HomeMarketTerminal.tsx','index.html','assets/js/home-learning-constellation-v1.js','assets/js/prototype-shared-learning-market-v1.js','assets/js/crownlight-interactive-evidence-v1.js','assets/js/public-candle-learning-journey-v3.js','assets/js/lab-engine-v32-universal.js','assets/js/learning-indicators-v1.js']){
  const s=read(p);assert.doesNotMatch(s,/\bfictional\b/i,p);assert.match(s,/\bsimulated\b/i,p);
 }
 const chart=read('src/experience/HomeMarketTerminal.tsx');
 assert.match(chart,/No live or licensed market feed/);
 assert.match(chart,/href="\/practice-data-policy\.html"/);
});
test('Real data is never claimed without provenance; policy and legal link remain visible',()=>{
 const page=read('practice-data-policy.html'),legal=read('legal.html');
 assert.match(legal,/href="\/practice-data-policy.html"/);
 for(const phrase of ['simulated educational data','not verified membership totals','actual provenance','independently verify','not investment advice','Legal review: not represented as completed'])assert(page.includes(phrase),phrase);
 assert.match(page,/“EXAMPLE” badge/);
 assert.match(page,/“Online members”/);
 assert.match(page,/“Registered members”/);
 assert.match(page,/SIMULATION/);
 assert.match(page,/The absence of those words/);
});
