import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const studies=JSON.parse(readFileSync('data/tutor-indicator-study-v1.json','utf8')).guides.slice(30,45);
const close=Array.from({length:80},(_,i)=>100+.15*i+(i%7)*.09);
const high=close.map(x=>x+1.2),low=close.map(x=>x-1.1),volume=close.map((_,i)=>1000+25*i);
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const ema=(a,n)=>a.slice(n).reduce((prev,v)=>2/(n+1)*v+(1-2/(n+1))*prev,mean(a.slice(0,n)));
const atr=n=>{
 const trueRange=close.map((_,i)=>i===0?high[0]-low[0]:
 Math.max(high[i]-low[i],Math.abs(high[i]-close[i-1]),Math.abs(low[i]-close[i-1])));
 return trueRange.slice(n).reduce((prev,x)=>(prev*(n-1)+x)/n,mean(trueRange.slice(0,n)));
};
const prints=[[10,100],[10.4,200],[10.2,100],[10.6,50]];
const tv=prints.reduce((s,[p,v])=>s+v,0),notional=prints.reduce((s,[p,v])=>s+p*v,0),exact=notional/tv;
const sigma=Math.sqrt(prints.reduce((s,[p,v])=>s+v*(p-exact)**2,0)/tv);
const lr=Array.from({length:20},(_,j)=>Math.log(close[j+60]/close[j+59]));
const logmean=mean(lr);
const pp=(110+98+106)/3;
const actual={
 STUDY_KELTNER_CHANNELS:ema(close,20)+2*atr(14),
 STUDY_DONCHIAN_CHANNELS:Math.max(...high.slice(59,79)),
 STUDY_ATR:atr(14),STUDY_ATRP:100*atr(14)/close.at(-1),
 STUDY_HISTORICAL_VOLATILITY:Math.sqrt(lr.reduce((s,x)=>s+(x-logmean)**2,0)/(lr.length-1))*Math.sqrt(252),
 STUDY_CHANDELIER_EXIT:Math.max(...high.slice(-22))-3*atr(22),
 STUDY_PIVOT_POINTS:2*pp-98,
 STUDY_FIBONACCI_RETRACEMENT:130-.382*(130-100),
 STUDY_VWAP:exact,
 STUDY_ANCHORED_VWAP:prints.slice(1).reduce((s,[p,v])=>s+p*v,0)/prints.slice(1).reduce((s,[p,v])=>s+v,0),
 STUDY_VWAP_BANDS:exact+2*sigma,
 STUDY_VOLUME_SMA:mean(volume.slice(-5)),
 STUDY_RVOL:volume.at(-1)/mean(volume.slice(-6,-1)),
 STUDY_MATCHED_TIME_RVOL:1300/mean([1000,1100,1200]),
 STUDY_DOLLAR_VOLUME:notional
};
test('all 15 guide IDs 31-45 are canonical, ungraded and independently sourced',()=>{
 assert.equal(studies.length,15);assert.equal(new Set(studies.map(x=>x.code)).size,15);
 assert.deepEqual(studies.map(x=>x.code),Object.keys(actual));
 for(const g of studies){assert.ok(g.formula.length>40);assert.equal(g.officialCompetency,false);assert.ok(g.sourceUrls.length);}
});
test('Python and JavaScript independently agree for all 15 declared calculation cases',()=>{
 const r=spawnSync(process.platform==='win32'?'python':'python3',['scripts/qa/talia_indicators31_45_python_v1.py'],{encoding:'utf8',timeout:8000});
 assert.equal(r.status,0,r.stderr);
 const p=JSON.parse(r.stdout);
 assert.deepEqual(Object.keys(actual).sort(),Object.keys(p.values).sort());
 for(const [code,val] of Object.entries(actual)){
  assert.ok(Number.isFinite(val),code);
  assert.ok(Math.abs(val-p.values[code])<1e-9,code+': '+val+' versus '+p.values[code]);
 }
 assert.equal(p.exactAndProxyDiffer,true);
 assert.ok(Math.abs(actual.STUDY_VWAP-p.proxy)>1e-6);
 assert.equal(p.tradeVolume,450);
});
test('no silent future sample, current-bar RVOL baseline or vendor-equal proxy claims',()=>{
 assert.ok(Math.max(...high.slice(59,79))<high[79]);
 assert.equal(volume.at(-1)/mean(volume.slice(-6,-1)),actual.STUDY_RVOL);
 assert.notEqual(exact,(10.6+10+10.2)/3);
 assert.ok(actual.STUDY_HISTORICAL_VOLATILITY>=0);
});
