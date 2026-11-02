import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const s=readFileSync('src/tutor/TaliaClassroom.tsx','utf8'),css=readFileSync('assets/css/talia-classroom-pro-v2.css','utf8');
for(const p of ['talia-classroom.html','talia-tutor-prototype.html'])assert.match(readFileSync(p,'utf8'),/talia-classroom-pro-v2\.css/);
test('classroom and prototype have the same protected chart-analysis controls',()=>{assert.match(s,/endsWith\('\/talia-classroom\.html'\)/);for(const f of ['EMA 9','EMA 20','EMA 200','Right buffer','Teach this chart','Clear annotation'])assert.ok(s.includes(f),f);assert.match(s,/REPLAY\.slice\(0,visible\)/);});
test('premium responsive styling preserves legibility and functional layouts',()=>{for(const f of ['tc-grid','tc-chart','tc-transcript','tp-chart-tools','tc-composer','prefers-reduced-motion','max-width:900px'])assert.ok(css.includes(f),f);});
test('existing Tutor service endpoints and protected history remain in place',()=>{for(const f of ['/api/market-tutor','/api/member-tutor-history','/api/member-tutor-conversations','allowModel:false'])assert.ok(s.includes(f),f);});
