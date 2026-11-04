import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const tutor=read('src/tutor/TaliaClassroom.tsx');
const shared=read('src/prototype/PrototypeExperiences.tsx');
const css=read('assets/css/talia-student-desk-v1.css');

test('student split workspace places price chart and readable live Tutor instructions together',()=>{
 assert.match(tutor,/tc-grid tc-terminal-grid tc-terminal-/);
 assert.match(tutor,/tc-student-read-hint/);
 assert.match(tutor,/tc-transcript.*role="log"/);
 assert.match(css,/\.tc-terminal-grid\.tc-terminal-split\{grid-template-columns:/);
 assert.match(css,/\.tc-terminal-split>\.tc-chart-panel\{position:sticky/);
 assert.match(css,/\.tc-terminal-grid \.tc-message p\{font-size:clamp\(15px,1vw,16px\)!important/);
 assert.match(css,/max-width:100%;line-height:1\.58/);
 assert.match(css,/@media\(max-width:970px\)/);
 assert.match(css,/@media\(max-width:620px\)/);
 assert.doesNotMatch(css,/display:none!important.*tc-transcript/);
});

test('OHLC prices appear inside chart region, not as an always-open unrelated table',()=>{
 assert.match(shared,/export type ClassicChartMeasurement=/);
 assert.match(shared,/cx-classic-visual-region/);
 assert.match(shared,/className="cx-classic-measurements" aria-label="Latest revealed candle price measurements"/);
 const high=shared.indexOf('<dt>High</dt>'),close=shared.indexOf('<dt>Close</dt>'),open=shared.indexOf('<dt>Open</dt>'),low=shared.indexOf('<dt>Low</dt>');
 assert.ok(high>=0&&high<close&&close<open&&open<low,'Measurement order matches the instructional reference');
 assert.match(shared,/measurement\.high\.toFixed\(2\)/);
 assert.match(shared,/measurement\.close\.toFixed\(2\)/);
 assert.match(shared,/measurement\.open\.toFixed\(2\)/);
 assert.match(shared,/measurement\.low\.toFixed\(2\)/);
 assert.match(shared,/Math\.abs\(measurement\.close-measurement\.open\)/);
 assert.match(tutor,/measurement=\{\{index:visible,open:latest\[0\],high:latest\[3\],low:latest\[2\],close:latest\[1\],interval:'1-minute source'\}\}/);
 assert.match(tutor,/<details className="tc-current-candle-ledger">/);
 assert.match(tutor,/<table className="tc-candle-table"><caption>Latest visible completed candle/);
 assert.match(css,/\.cx-classic-visual-region\{display:grid;grid-template-columns/);
});

test('Talia chart consumes only its revealed bar prefix for full plotted data and selected timeframe prompts',()=>{
 assert.match(tutor,/useMemo\(\(\)=>REPLAY\.slice\(0,visible\)/);
 assert.match(tutor,/caseBars=\{sharedBars\}/);
 assert.match(shared,/const count=mode==='talia'\?Math\.max\(1,available\.length\)/);
 assert.match(shared,/if\(mode==='talia'&&caseBars\.length>0\)setFocus\(caseBars\.length-1\)/);
 assert.match(shared,/onObservedBar\?\.\(Math\.floor\(index\/appearance\.timeframe\),appearance\.timeframe\)/);
 assert.match(tutor,/REPLAY\.slice\(index\*interval,Math\.min\(visible,\(index\+1\)\*interval\)\)/);
 assert.match(tutor,/if\(group\.length!==interval\)return/);
 assert.match(tutor,/high=Math\.max\(\.\.\.group\.map\(bar=>bar\[3\]\)\)/);
 assert.match(tutor,/low=Math\.min\(\.\.\.group\.map\(bar=>bar\[2\]\)\)/);
 assert.match(shared,/effectiveStudio:Studio=memberSafe\?'Standard':studio/);
});

test('member and staff Tutor routes reuse one stylesheet and versioned build without changing homepage',()=>{
 const member=read('talia-classroom.html'),staff=read('talia-tutor-prototype.html'),gate=read('assets/js/talia-prototype-gate-v1.js');
 for(const h of [member,staff])assert.match(h,/talia-student-desk-v1\.css\?v=20261104-student-desk1/);
 assert.match(member,/talia-classroom-v1\.bundle\.js\?v=20261104-student-desk1/);
 assert.match(gate,/talia-classroom-v1\.bundle\.js\?v=20261104-student-desk1/);
 assert.match(staff,/data-route-access="staff"/);
 assert.match(gate,/control_panel\.access/);
 assert.doesNotMatch(read('index.html'),/talia-student-desk-v1\.css/);
});
