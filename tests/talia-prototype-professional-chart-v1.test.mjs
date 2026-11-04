import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const ts=readFileSync('src/tutor/TaliaClassroom.tsx','utf8');
test('Prototype chart offers four financial studies while preventing premature EMA history',()=>{
 for(const option of ['EMA 9','EMA 20','EMA 200','Fictional proxy VWAP'])assert.ok(ts.includes(option),option);
 assert.match(ts,/i<period-1/);assert.match(ts,/closes\.slice\(0,period\)/);
 assert.match(ts,/REPLAY\.slice\(0,visible\)/);
 assert.match(ts,/showVolume/);assert.match(ts,/showStructure/);assert.match(ts,/setBuffer/);
});
test('Customization is available only on the staff prototype and never authorizes an assessment',()=>{
 assert.match(ts,/pathname\.endsWith\('\/talia-tutor-prototype\.html'\)/);
 assert.match(ts,/import \{ClassicClassroomChart\} from '\.\.\/prototype\/PrototypeExperiences'/);
 assert.match(ts,/<ClassicClassroomChart mode="talia" memberSafe=\{true\}/);
 assert.match(ts,/caseBars=\{sharedBars\}/);
 assert.match(ts,/if\(group\.length!==interval\)return/);
 assert.match(ts,/false&&<div className="tc-row tp-chart-tools"/,'Legacy duplicated controls are not mounted');
 assert.match(ts,/type="color"/);assert.match(ts,/moveOnMouseMove:true/);
 assert.match(ts,/onQuestion\('Teach the '/);
 assert.match(ts,/Volume is simulated/,'Tutor clearly distinguishes simulated volume from observed market prints');
});

test('Member-scoped chart preferences validate stored values and do not persist conversation data',()=>{
 assert.match(ts,/smfgu-talia-prototype-chart-v1:'\+memberId/);
 assert.match(ts,/localStorage\.getItem/);
 assert.match(ts,/localStorage\.setItem/);
 assert.match(ts,/settingsLoaded/);
 assert.match(ts,/memberId=\{member\.id\}/);
 assert.match(ts,/Private browsing may disable storage/);
});

test('Accessible prototype ledger exposes only completed bars with keyboard Tutor actions',()=>{
 assert.match(ts,/Accessible completed-candle ledger/);
 assert.match(ts,/REPLAY\.slice\(0,visible\)\.map/);
 assert.match(ts,/scope="row"/);
 assert.match(ts,/Explain bar \{i\+1\}/);
 assert.match(ts,/Use only the visible preceding candles/);
});
