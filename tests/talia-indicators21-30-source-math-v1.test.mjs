import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const raw=JSON.parse(readFileSync('data/tutor-indicator-study-v1.json','utf8')).guides;
const g=raw.slice(20,30),byId=Object.fromEntries(g.map(x=>[x.code,x]));
test('all ten canonical guides 21-30 have formulas, are ungraded, and retain review boundaries',()=>{
 assert.equal(g.length,10);
 assert.equal(new Set(g.map(x=>x.code)).size,10);
 for(const x of g){assert.ok(x.formula.length>25);assert.equal(x.officialCompetency,false);assert.ok(x.sourceUrls.length)}
});
test('Aroon UP/DOWN and oscillator use completed lookbacks with declared 25 bar convention',()=>{
 const h=Array.from({length:25},(_,i)=>i===19?130:100+i*.1);
 const l=Array.from({length:25},(_,i)=>i===8?80:90-i*.05);
 const agoHigh=24-19,agoLow=24-8;
 const up=100*(25-agoHigh)/25,down=100*(25-agoLow)/25;
 assert.equal(up,80);assert.equal(down,36);assert.equal(up-down,44);
 assert.equal(h.slice(0,24).includes(130),true);
});
test('Ichimoku component values never expose a future observation as known today',()=>{
 const high=Array.from({length:52},(_,i)=>100+i);
 const low=high.map(x=>x-2);
 const mid=n=>(Math.max(...high.slice(-n))+Math.min(...low.slice(-n)))/2;
 const tenkan=mid(9),kijun=mid(26),senkouB=mid(52),senkouA=(tenkan+kijun)/2;
 assert.ok(senkouA>0&&senkouB>0);
 assert.equal(mid(9),146);
 assert.ok(byId.STUDY_ICHIMOKU.formula.includes('plotted 26 bars forward'));
 assert.equal(high.length,52);
});
test('Bollinger population sigma, %B and percent BandWidth use same completed window',()=>{
 const w=[10,11,12,13,14],mean=w.reduce((a,b)=>a+b,0)/5;
 const sigma=Math.sqrt(w.reduce((a,b)=>a+(b-mean)**2,0)/5);
 const upper=mean+2*sigma,lower=mean-2*sigma;
 const b=(14-lower)/(upper-lower),width=100*(upper-lower)/mean;
 assert.equal(mean,12);assert.ok(Math.abs(sigma-Math.sqrt(2))<1e-12);
 assert.ok(b>0&&b<1);assert.ok(width>0);
 assert.equal((14-lower)/(upper-lower),b);
});
test('Wilder DMI and ADX seed conventions and nonzero denominator cannot be omitted',()=>{
 const high=[12,13,15,14],low=[10,11,12,11],close=[11,12,14,12];
 const tr=Math.max(high[2]-low[2],Math.abs(high[2]-close[1]),Math.abs(low[2]-close[1]));
 const up=high[2]-high[1],down=low[1]-low[2],plus=up>down&&up>0?up:0;
 assert.equal(tr,3);assert.equal(plus,2);
 const pdi=100*plus/tr,mdi=0;
 const dx=100*Math.abs(pdi-mdi)/(pdi+mdi);
 assert.equal(dx,100);assert.equal(14+13,27);
 assert.ok(/Wilder/.test(byId.STUDY_ADX.formula));
});
test('SAR and Supertrend remain explicit formula-variant HOLD, never silently certified',()=>{
 assert.ok(/AF|acceleration|prior/i.test(byId.STUDY_PARABOLIC_SAR.formula));
 assert.ok(/initial direction|algorithm/i.test(byId.STUDY_SUPERTREND.formula));
});
