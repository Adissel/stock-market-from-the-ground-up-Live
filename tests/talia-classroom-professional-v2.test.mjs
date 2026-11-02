import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const s=readFileSync('src/tutor/TaliaClassroom.tsx','utf8'),css=readFileSync('assets/css/talia-classroom-pro-v2.css','utf8');
for(const p of ['talia-classroom.html','talia-tutor-prototype.html'])assert.match(readFileSync(p,'utf8'),/talia-classroom-pro-v2\.css/);
test('classroom and prototype have the same protected chart-analysis controls',()=>{assert.match(s,/endsWith\('\/talia-classroom\.html'\)/);for(const f of ['EMA 9','EMA 20','EMA 200','Right buffer','Teach this chart','Clear annotation'])assert.ok(s.includes(f),f);assert.match(s,/REPLAY\.slice\(0,visible\)/);});
test('premium responsive styling preserves legibility and functional layouts',()=>{for(const f of ['tc-grid','tc-chart','tc-transcript','tp-chart-tools','tc-composer','prefers-reduced-motion','max-width:900px'])assert.ok(css.includes(f),f);});
test('existing Tutor service endpoints and protected history remain in place',()=>{for(const f of ['/api/market-tutor','/api/member-tutor-history','/api/member-tutor-conversations','allowModel:false'])assert.ok(s.includes(f),f);});

test('terminal is chart-dominant, switchable, and preserves protected learning workflows',()=>{
 const terminal=readFileSync('assets/css/talia-terminal-v3.css','utf8');
 for(const page of ['talia-classroom.html','talia-tutor-prototype.html'])assert.match(readFileSync(page,'utf8'),/talia-terminal-v3\.css/);
 for(const key of ['tc-terminal-controls','tc-terminal-grid','tc-terminal-chart','tc-terminal-tutor','aria-pressed={dock===','setDock(\'chart\')','setDock(\'tutor\')'])assert.ok(s.includes(key)||terminal.includes(key),'missing '+key);
 assert.match(terminal,/\.tc-terminal-grid>\.tc-chart-panel\{grid-column:1;grid-row:1/);
 assert.match(s,/aria-label="Six-phase guided lesson"/);
 assert.match(s,/aria-label="Progressive ungraded instructional pathway"/);
 assert.match(s,/pathname\.endsWith\('\/talia-classroom\.html'\)\)\&\&/);
 assert.doesNotMatch(terminal,/\.lab-|\.bootcamp-/,'Protected interactive curricula must remain unchanged');
});
