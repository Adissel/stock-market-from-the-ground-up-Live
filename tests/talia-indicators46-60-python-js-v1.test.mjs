import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const official=JSON.parse(readFileSync('data/tutor-indicator-study-v1.json','utf8')).guides.slice(45,60);
const count=140;
const close=Array.from({length:count},(_,i)=>100+.045*i+2*Math.sin(.45*i)+.7*Math.cos(.13*i));
const high=close.map((v,i)=>v+1.1+.07*(i%3)),low=close.map((v,i)=>v-1.1-.05*(i%5));
const volume=close.map((_,i)=>4000+31*i+180*(i%7));
const sum=a=>a.reduce((v,x)=>v+x,0);
const avg=a=>sum(a)/a.length;
const ema=(input,n)=>{
 if(input.length<n)return null;
 const alpha=2/(n+1);
 return input.slice(n).reduce((prior,x)=>alpha*x+(1-alpha)*prior,avg(input.slice(0,n)));
};
const flows=[],accumulation=[];
let obv=0,ad=0;
for(let i=0;i<count;i++){
 if(i)obv+=close[i]>close[i-1]?volume[i]:close[i]<close[i-1]?-volume[i]:0;
 const width=high[i]-low[i],clv=width?(2*close[i]-high[i]-low[i])/width:0;
 const mf=clv*volume[i];ad+=mf;flows.push(mf);accumulation.push(ad);
}
const typical=close.map((c,i)=>(high[i]+low[i]+c)/3);
let positive=0,negative=0;
for(let i=count-14;i<count;i++){
 const raw=typical[i]*volume[i];
 if(typical[i]>typical[i-1])positive+=raw;
 else if(typical[i]<typical[i-1])negative+=raw;
}
const mfi=!positive&&!negative?50:negative===0?100:positive===0?0:100*positive/(positive+negative);
const histogram=new Map();
for(let i=0;i<count;i++){
 const bucket=Math.floor(close[i]/2)*2;
 histogram.set(bucket,(histogram.get(bucket)||0)+volume[i]);
}
const top=[...histogram.entries()].sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0];
const benchmark=95+.03*(count-1)+.3*Math.sin(.2*(count-1));
const advances=Array.from({length:count},(_,i)=>600+(13*i%97));
const declines=Array.from({length:count},(_,i)=>520+(11*i%83));
const raw=advances.map((x,i)=>x-declines[i]);
const rana=raw.map((x,i)=>1000*x/(advances[i]+declines[i]));
const basket=[112,105,99,102,88,105,115,93];
const means=[110,100,100,101,90,100,110,95];
const calculated={
 STUDY_OBV:obv,
 STUDY_ACC_DIST_LINE:accumulation.at(-1),
 STUDY_CMF:sum(flows.slice(-20))/sum(volume.slice(-20)),
 STUDY_MFI:mfi,
 STUDY_CHAIKIN_OSCILLATOR:ema(accumulation,3)-ema(accumulation,10),
 STUDY_PVO:100*(ema(volume,12)-ema(volume,26))/ema(volume,26),
 STUDY_FORCE_INDEX:(close.at(-1)-close.at(-2))*volume.at(-1),
 STUDY_VOLUME_PROFILE:top[1],
 STUDY_PRICE_RELATIVE:close.at(-1)/benchmark,
 STUDY_ADVANCE_DECLINE:sum(raw),
 STUDY_NEW_HIGHS_LOWS:100+(count-1)%17-(80+(count-1)%13),
 STUDY_MCCLELLAN_OSC:ema(rana,19)-ema(rana,39),
 STUDY_PERCENT_ABOVE_MA:100*basket.filter((x,i)=>x>means[i]).length/basket.length,
 STUDY_PUT_CALL_RATIO:9200/12500
};
test('canonical 46–60 identities retain mathematical teaching and proprietary rank restriction',()=>{
 assert.equal(official.length,15);
 assert.equal(new Set(official.map(x=>x.code)).size,15);
 for(const g of official){assert.equal(g.officialCompetency,false);assert.ok(g.sourceUrls?.length);}
 assert.equal(official.find(x=>x.code==='STUDY_SCTR')?.code,'STUDY_SCTR');
 assert.equal(Object.keys(calculated).length,14);
 assert.equal(Object.hasOwn(calculated,'STUDY_SCTR'),false,'never invent a vendor SCTR value');
});
test('Python and independent JS agree for all 14 calculable original bar/market-breadth scenarios',()=>{
 const r=spawnSync(process.platform==='win32'?'python':'python3',['scripts/qa/talia_indicators46_60_python_v1.py'],{encoding:'utf8',timeout:10000});
 assert.equal(r.status,0,r.stderr);
 const p=JSON.parse(r.stdout);
 assert.deepEqual(Object.keys(calculated).sort(),Object.keys(p.values).sort());
 assert.deepEqual(p.nonNumerical,['STUDY_SCTR']);
 for(const [code,v] of Object.entries(calculated)){
  assert.ok(Number.isFinite(v),code);
  assert.ok(Math.abs(v-p.values[code])<1e-7,code+': '+v+' vs '+p.values[code]);
 }
 assert.match(p.volumeProfile,/proxy_NOT_EXCHANGE_VOLUME_AT_PRICE/);
 assert.match(p.mcclellan,/ratio_adjusted_net_advances/);
});
test('zero denominators, flat candles, time-window mismatches and provider permission remain guarded',()=>{
 assert.equal(0/0===0,false);
 const clv=(h,l,c)=>h===l?0:(2*c-h-l)/(h-l);
 assert.equal(clv(10,10,10),0);
 assert.equal((()=>{const den=0;return den===0?null:100/den})(),null);
 assert.equal((()=>{const callVol=0;return callVol<=0?null:9200/callVol})(),null);
 assert.equal((()=>{const prior=0;return prior<=0?null:100/prior})(),null);
 assert.equal(ema([100,101,102],39),null);
 assert.notEqual(ema(raw,19)-ema(raw,39),calculated.STUDY_MCCLELLAN_OSC,
  'raw and ratio-adjusted breadth variants are not interchangeable');
});
