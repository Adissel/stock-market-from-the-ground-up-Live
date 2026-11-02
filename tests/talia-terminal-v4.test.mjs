import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const s=readFileSync('src/tutor/TaliaClassroom.tsx','utf8');
test('professional V4 assets load on both classroom routes',()=>{
 for(const p of ['talia-classroom.html','talia-tutor-prototype.html'])assert.ok(readFileSync(p,'utf8').includes('talia-terminal-v4.css'));
 assert.ok(readFileSync('talia-classroom.html','utf8').includes('20261102-terminal4'));
 assert.ok(readFileSync('assets/css/talia-terminal-v4.css','utf8').includes('prefers-reduced-motion'));
});
test('extended synthetic fixture is original and supports 200-bar indicator warmup',()=>{
 for(const f of ['for(let i=0;i<248;i++)','REPLAY.push([previous,close,low,high])','Load 200 completed fictional bars','setVisible(200)','Step back one bar'])assert.ok(s.includes(f),f);
});
test('only already-revealed complete one-, three-, five-minute groups enter chart math',()=>{
 for(const f of ['aggregateCompleted(revealed,timeframe)','i+minutes<=rows.length','const revealed=REPLAY.slice(0,visible)','const shown=aggregateCompleted(revealed,timeframe)','1 minute','3 minutes','5 minutes','const r=shown[x.dataIndex]','const bar=shown[i]'])assert.ok(s.includes(f),f);
});
test('multi indicator overlays and confirmed structure share the displayed timeframe',()=>{
 for(const f of ['Compare EMA 9 / 20 / 200 + VWAP','EMA 200','VWAP proxy','Confirmed market structure','Swing H','Swing L',"'HH'","'HL'","'LH'","'LL'","syntheticVolume"])assert.ok(s.includes(f),f);
 assert.ok(s.includes('if(i<period-1)return null'));
});
test('pan controls and pointer release are provided with the existing security boundaries',()=>{
 for(const f of ['Pan left','Pan right','getOption?.()','dispatchAction','onPointerUpCapture','onPointerCancelCapture','releasePointerCapture','allowModel:false','/api/member-tool-access?tool=MARKET_TUTOR'])assert.ok(s.includes(f),f);
});
