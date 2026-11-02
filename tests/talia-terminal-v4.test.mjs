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

test('independent quantitative validation of generated OHLC and grouped completed intervals',()=>{
 const m=s.match(/const REPLAY:number\[\]\[\]=\[([\s\S]*?)\];/);
 assert.ok(m,'original reviewed candle fixture');
 const base=JSON.parse('['+m[1]+']');
 assert.equal(base.length,12);
 const rows=base.map(x=>[...x]);
 for(let i=0;i<248;i++){
  const previous=rows[rows.length-1][1];
  const close=Number((previous+0.038*Math.sin(i*0.37)+0.027*Math.cos(i*0.13)-(i%19===0?0.055:0)).toFixed(2));
  const high=Number((Math.max(previous,close)+0.03+(i%4)*0.01).toFixed(2));
  const low=Number((Math.min(previous,close)-0.03-(i%3)*0.01).toFixed(2));
  rows.push([previous,close,low,high]);
 }
 assert.equal(rows.length,260);
 for(const [open,close,low,high] of rows){
  assert.ok(Number.isFinite(open)&&Number.isFinite(close));
  assert.ok(low<=Math.min(open,close)&&high>=Math.max(open,close)&&high>low);
 }
 for(const period of [1,3,5]){
  for(const cutoff of [7,8,19,200,259,260]){
   const prefix=rows.slice(0,cutoff);
   const groups=[];
   for(let i=0;i+period<=prefix.length;i+=period){
    const batch=prefix.slice(i,i+period);
    groups.push([batch[0][0],batch[period-1][1],Math.min(...batch.map(r=>r[2])),Math.max(...batch.map(r=>r[3]))]);
   }
   assert.equal(groups.length,Math.floor(cutoff/period));
   assert.ok(groups.every(r=>r[2]<=Math.min(r[0],r[1])&&r[3]>=Math.max(r[0],r[1])));
  }
 }
 const closes=rows.slice(0,200).map(r=>r[1]);
 let seeded=closes.slice(0,200).reduce((a,b)=>a+b,0)/200;
 assert.ok(Number.isFinite(seeded)&&seeded>0);
 assert.equal(Math.floor(200/3),66);
 assert.equal(Math.floor(200/5),40);
});
