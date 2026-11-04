import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const s=readFileSync('src/tutor/TaliaClassroom.tsx','utf8'),css=readFileSync('assets/css/talia-classroom-pro-v2.css','utf8');
for(const p of ['talia-classroom.html','talia-tutor-prototype.html'])assert.match(readFileSync(p,'utf8'),/talia-classroom-pro-v2\.css/);
test('classroom and prototype have the same protected chart-analysis controls',()=>{assert.match(s,/endsWith\('\/talia-classroom\.html'\)/);for(const f of ['EMA 9','EMA 20','EMA 200','Right buffer','Teach this chart','Clear annotation'])assert.ok(s.includes(f),f);assert.match(s,/REPLAY\.slice\(0,visible\)/);});
test('premium responsive styling preserves legibility and functional layouts',()=>{for(const f of ['tc-grid','tc-chart','tc-transcript','tp-chart-tools','tc-composer','prefers-reduced-motion','max-width:900px'])assert.ok(css.includes(f),f);});
test('existing Tutor service endpoints and protected history remain in place',()=>{for(const f of ['/api/market-tutor','/api/member-tutor-history','/api/member-tutor-conversations','allowModel:false'])assert.ok(s.includes(f),f);});

test('student classroom displays chart and Tutor together without hiding either panel',()=>{
 const student=readFileSync('assets/css/talia-student-desk-v1.css','utf8');
 for(const page of ['talia-classroom.html','talia-tutor-prototype.html'])assert.match(readFileSync(page,'utf8'),/talia-student-desk-v1\.css/);
 for(const key of ['tc-student-workspace','tc-chart-heading','tc-transcript','tc-replay-options','tc-advanced-tutor-options'])assert.ok(s.includes(key),'missing student feature '+key);
 assert.match(student,/grid-template-columns:minmax\(0,1\.34fr\) minmax\(355px,1fr\)/);
 assert.match(s,/aria-label="Six-phase guided lesson"/);
 assert.match(s,/aria-label="Progressive ungraded instructional pathway"/);
 assert.match(s,/const advancedExperience=isTaliaAdvancedRoute\(\)/);
 assert.match(s,/advancedExperience&&<section className="tp-teaching-loop"/);
 assert.doesNotMatch(student,/\.lab-|\.bootcamp-/,'Protected interactive curricula must remain unchanged');
});

test('instructor width is responsive, not a broken student-facing slider',()=>{
 const student=readFileSync('assets/css/talia-student-desk-v1.css','utf8');
 assert.doesNotMatch(s,/setDockWidth|Instructor width|setDock\(/);
 assert.match(s,/tc-grid tc-terminal-grid tc-terminal-split tc-student-workspace/);
 assert.match(student,/@media\(max-width:820px\)/);
 assert.match(student,/\.tc-student-workspace>\.tc-chat\{grid-column:1;grid-row:2/);
});
