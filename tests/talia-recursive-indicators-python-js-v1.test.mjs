import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {completedPrefix,wilderDmi,parabolicSar,wilderAtr,supertrend,ichimoku}
 from '../scripts/qa/talia_recursive_indicators_v1.mjs';
const count=160;
const close=Array.from({length:count},(_,i)=>100+.17*i+Math.sin(i/5)*3-Math.max(0,i-100)*.5);
const bars=close.map((c,i)=>{
 const open=(i?close[i-1]:100)+.08*Math.sin(i);
 return {time:100000+i*60000,closeTime:160000+i*60000,completed:true,
  open,close:c,high:Math.max(open,c)+.5+.02*(i%3),low:Math.min(open,c)-.5-.01*(i%4)};
});
const near=(a,b,id)=>assert.ok(a!==null&&Number.isFinite(a)&&Math.abs(a-b)<1e-8,id+': '+a+' != '+b);
const summary=a=>({last:a.at(-1),firstValid:a.findIndex(x=>x!==null)});
test('two independent languages agree over fully recursive fictional ADX, DMI, PSAR, ATR, Supertrend, Ichimoku',()=>{
 const run=spawnSync(process.platform==='win32'?'python':'python3',['scripts/qa/talia_recursive_indicators_python_v1.py'],{encoding:'utf8',timeout:8000});
 assert.equal(run.status,0,run.stderr);
 const p=JSON.parse(run.stdout);
 const verified=completedPrefix(bars,bars.length-1,bars.at(-1).closeTime);
 assert.ok(verified&&verified.length===160);
 const d=wilderDmi(verified),cloud=ichimoku(verified);
 const actual={ADX:summary(d.adx),'+DI':summary(d.diPlus),'-DI':summary(d.diMinus),
 PSAR:summary(parabolicSar(verified)),ATR:summary(wilderAtr(verified)),
 SUPERTREND:summary(supertrend(verified)),
 SPAN_A:summary(cloud.map(x=>x.spanA)),SPAN_B:summary(cloud.map(x=>x.spanB))};
 for(const [id,v] of Object.entries(actual)){near(v.last,p[id].last,id);assert.equal(v.firstValid,p[id].firstValid,id+' first completed warmup');}
 assert.equal(actual.ADX.firstValid,27);
 assert.equal(actual.ATR.firstValid,13);
 assert.equal(actual.SPAN_A.firstValid,25);
 assert.equal(actual.SPAN_B.firstValid,51);
 assert.equal(cloud.at(-1).plotIndex,p.prefix.plotIndex);
 assert.equal(cloud.every(x=>x.usesFutureBars===false),true);
});
test('forming bars, overlapping timestamps and lookahead observation are denied before math',()=>{
 const last=bars.at(-1);
 assert.equal(completedPrefix(bars,159,last.closeTime-1),null);
 assert.equal(completedPrefix([...bars.slice(0,-1),{...last,completed:false}],159,last.closeTime),null);
 assert.equal(completedPrefix([...bars.slice(0,-1),{...last,time:bars.at(-2).closeTime-1}],159,last.closeTime),null);
 assert.equal(completedPrefix(bars,160,last.closeTime),null);
 assert.equal(completedPrefix(bars,-1,last.closeTime),null);
});
test('future hidden candles do not alter any previously available calculation or forward-plotted cloud fact',()=>{
 const x=completedPrefix(bars,100,bars[100].closeTime);
 assert.equal(x.length,101);
 const whole=wilderDmi(bars),partial=wilderDmi(x);
 near(whole.adx[100],partial.adx.at(-1),'ADX-prefix');
 near(parabolicSar(bars)[100],parabolicSar(x).at(-1),'SAR-prefix');
 near(supertrend(bars)[100],supertrend(x).at(-1),'Supertrend-prefix');
 assert.equal(ichimoku(x).at(-1).plotIndex,126);
 near(ichimoku(bars)[100].spanB,ichimoku(x).at(-1).spanB,'spanB-prefix');
});
