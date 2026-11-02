/* Crownlight Experience V2: pure math, authoring coverage, replay isolation, no fabrication. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
await import('../assets/js/crownlight-indicator-math-v2.js');
await import('../assets/js/prototype-indicator-workbench-v2.js');
await import('../assets/js/crownlight-chart-tutor-v1.js');
const api=globalThis.CrownlightPrototypeIndicators;
assert.ok(api&&typeof api.compute==='function','Canonical indicator adapter must load');
assert.equal(api.specs.length,16);
assert.ok(api.specs.some(x=>x.id==='VWAP'));
const catalog=JSON.parse(readFileSync('data/tutor-indicator-study-v1.json','utf8'));
assert.equal(catalog.count,61);
assert.equal(catalog.guides.length,61);
assert.equal(new Set(catalog.guides.map(g=>g.code)).size,61);
const closes=Array.from({length:90},(_,i)=>50+Math.sin(i*.17)*3+i*.09);
let total=0,value=0;
const bars=closes.map((c,i)=>{
 const o=i?closes[i-1]:c,h=Math.max(o,c)+.3,l=Math.min(o,c)-.3,v=1000+(i%5)*100;
 total+=v;value+=((h+l+c)/3)*v;
 return {time:String(i),o,h,l,c,v,proxy:value/total};
});
const cfg={...api.defaults,sma:8,rsi:9,volPeriod:7,bbPeriod:10,emaFast:6,emaSlow:15};
const selected=Object.fromEntries(api.specs.map(x=>[x.id,true]));
const full=api.compute(bars,cfg,selected);
const early=api.compute(bars.slice(0,34),cfg,selected);
assert.equal(full.price.length>=8,true,'EMA, SMA, HLC3 proxy, BB, levels and opening range overlays');
assert.equal(full.panes.includes('rsi'),true);
assert.equal(full.panes.includes('macd'),true);
assert.equal(full.panes.includes('atr'),true);
assert.equal(full.panes.includes('obv'),true);
const find=(all,name)=>all.find(x=>x.label===name);
assert.equal(find(early.price,'EMA 6').data.slice(0,5).every(x=>x===null),true,'Do not fabricate EMA warmup values');
assert.ok(Math.abs(find(full.price,'HLC3 volume-weighted bar proxy').data[5]-bars[5].proxy)<1e-8);
for(const a of early.price){const b=find(full.price,a.label);assert.ok(b,'Missing long-history pair '+a.label);for(let i=0;i<a.data.length;i++){
 const left=a.data[i],right=b.data[i];assert.ok(left===null&&right===null||(Number.isFinite(left)&&Number.isFinite(right)&&Math.abs(left-right)<1e-8),'Future candles changed prior '+a.label+' at '+i);
}}
assert.ok(early.marks.every(x=>x.confirmedAt<34),'Structure swing marker cannot precede confirmation');
assert.ok(api.validSettings({emaFast:0,emaSlow:500,rsi:0,bbDeviation:70}).emaFast>=2);
// Ten independent technical acceptance cases for the shared calculated studies.
// These are original deterministic fixtures, not historical or predictive market evidence.
const math=globalThis.CrownlightIndicatorMath;
const near=(actual,expected,label)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<1e-9,label+': '+actual+' !== '+expected);
// Multi-session acceptance: dates reset exchange-time HOD/LOD, opening range,
// and HLC3 VWAP; untrusted proxy input never supplies chart mathematics.
const sessionBars=[];
for(const d of [7,8]){
 for(let minute=0;minute<6;minute++){
  const t=Date.UTC(2024,4,d,13,29+minute);
  const c=d*10+minute;
  sessionBars.push({time:new Date(t).toISOString(),o:c-.1,h:c+.3,l:c-.4,c,v:100+minute,
   proxy:999999});
 }
}
const onlySessions={...Object.fromEntries(api.specs.map(x=>[x.id,false])),
 VWAP:true,HOD:true,LOD:true,OR:true};
const sessions=api.compute(sessionBars,{orb:3},onlySessions);
const sessionLine=label=>sessions.price.find(x=>x.label===label)?.data;
assert.equal(sessionLine('Observed HOD')[0],null,'Premarket is not completed regular-session HOD');
near(sessionLine('Observed HOD')[1],sessionBars[1].h,'First regular HOD');
near(sessionLine('Observed HOD')[7],sessionBars[7].h,'Next-day HOD must reset');
near(sessionLine('Observed LOD')[7],sessionBars[7].l,'Next-day LOD must reset');
assert.equal(sessionLine('Opening range high')[3],null,'Opening range cannot confirm before all 3 minutes');
near(sessionLine('Opening range high')[4],Math.max(...sessionBars.slice(1,4).map(b=>b.h)),'Completed opening range');
assert.equal(sessionLine('Opening range high')[9],null,'New day opening range warmup must recur');
const sessionProxy=sessionLine('HLC3 volume-weighted bar proxy');
near(sessionProxy[1],(sessionBars[1].h+sessionBars[1].l+sessionBars[1].c)/3,'Regular-session VWAP reset');
near(sessionProxy[7],(sessionBars[7].h+sessionBars[7].l+sessionBars[7].c)/3,'Next-session VWAP reset');
assert(sessionProxy.every(x=>x===null||x<999999),'Never trust externally supplied proxy values');
assert.throws(()=>api.compute([sessionBars[0],{...sessionBars[1],time:'1'}],{},onlySessions),
 /Mixed dated and undated/,'Mixed dated and undated input cannot inherit a false session');
// G1: a missing price invalidates only windows containing that missing observation.
assert.deepEqual(math.sma([1,2,NaN,4,5,6],2),[null,1.5,null,null,4.5,5.5]);
// G2: EMA starts from the exact SMA seed and uses alpha=2/(N+1).
assert.deepEqual(math.ema([1,2,3,4],3),[null,null,2,3]);
// G3: Bollinger bands use a complete-bar population standard deviation.
const three=[1,2,3].map(close=>({close,open:close,high:close,low:close,volume:100}));
const bb=math.bollinger(three,3,2);
near(bb.middle[2],2,'G3 Bollinger middle');
near(bb.upper[2],2+2*Math.sqrt(2/3),'G3 Bollinger upper');
near(bb.lower[2],2-2*Math.sqrt(2/3),'G3 Bollinger lower');
// G4: RSI is neutral on an unchanged-price sequence, not an implied buy.
assert.equal(math.rsi([10,10,10].map(close=>({close})),2)[2],50);
// G5: True Range includes previous close, with a seeded Wilder ATR.
near(math.atr([{high:11,low:9,close:10},{high:12,low:10,close:11}],2)[1],2,'G5 ATR');
// G6: the lowest MACD slow setting must not generate an unsupported one-bar EMA.
const edge=api.validSettings({macdFast:2,macdSlow:2,macdSignal:2});
assert.deepEqual([edge.macdFast,edge.macdSlow,edge.macdSignal],[2,3,2]);
assert.ok(api.validSettings({macdFast:100,macdSlow:3}).macdFast<3);
// G7: the first MACD value waits for slow warmup; signal waits beyond it.
const mm=math.macd(three.concat(Array.from({length:5},(_,i)=>({close:i+4}))),2,3,2);
assert.equal(mm.line[0],null);
assert.equal(mm.line[1],null);
assert.equal(mm.signal[2],null);
assert.ok(Number.isFinite(mm.signal[3]));
// G8: the observed high/low never includes future highs or lows.
const onlyLevels=api.compute(bars.slice(0,4),cfg,{...Object.fromEntries(api.specs.map(x=>[x.id,false])),HOD:true,LOD:true});
const firstH=onlyLevels.price.find(x=>x.label==='Observed HOD').data;
const firstL=onlyLevels.price.find(x=>x.label==='Observed LOD').data;
near(firstH[0],bars[0].h,'G8 first observed high');
near(firstL[0],bars[0].l,'G8 first observed low');
// G9: single-window volume SMA uses source bar volume without fabricated fill.
const volumeOnly=api.compute(bars.slice(0,3),{...cfg,volPeriod:2},{...Object.fromEntries(api.specs.map(x=>[x.id,false])),VOLMA:true});
near(volumeOnly.volume.find(x=>x.label==='Volume SMA 2').data[1],1050,'G9 volume SMA');
// G10: disclosed VWAP proxy is derived only from completed synthetic bars.
const firstProxy=bars[0].proxy;
near(firstProxy,(bars[0].h+bars[0].l+bars[0].c)/3,'G10 source HLC3');
assert.notEqual(firstProxy,0);
const gapped=math.sma([1,2,NaN,4,5,6],2);
assert.ok(gapped.every(x=>x===null||Number.isFinite(x)));
const guideKeys=['concept','formula','procedure','commonError','limit','selfCheck','reviewExplanation'];
const families=new Set(['Trend','Momentum','Volatility','Levels','Volume','Breadth','Sentiment']);
for(const guide of catalog.guides){
 assert.ok(families.has(guide.family),'Unknown indicator family '+guide.code);
 assert.ok(guideKeys.every(k=>typeof guide[k]==='string'&&guide[k].length>=8),'Missing authored teaching component '+guide.code);
 assert.ok(Array.isArray(guide.sourceUrls)&&guide.sourceUrls.length>0&&guide.sourceUrls.every(x=>/^https:\/\//.test(x)),'Missing original source provenance '+guide.code);
 assert.equal(guide.officialCompetency,false,'Do not mislabel indicator brief as protected official competency');
}

// Talia's EMA 200 teaching must use the same completed-bar math as Studio.
// This is synthetic reference evidence, not a live or licensed historical feed.
const chartTutor=globalThis.CrownlightChartTutor;
assert.ok(typeof chartTutor?.analyze==='function','Talia chart coaching must be available');
const tutoringBars=Array.from({length:220},(_,i)=>{
 const close=25+i*.07;
 return {time:new Date(Date.UTC(2024,4,7,14,30+i)).toISOString(),open:close-.03,high:close+.18,low:close-.19,close,volume:1100+(i%7)*40};
});
const underwarmed=chartTutor.analyze(tutoringBars.slice(0,199));
const exactlyWarmed=chartTutor.analyze(tutoringBars.slice(0,200));
const laterTutor=chartTutor.analyze(tutoringBars);
const emaStudy=x=>x.facts.find(f=>f.name==='EMA 200');
assert.equal(emaStudy(underwarmed).value,null,'No long-period estimate with 199 completed candles');
assert.match(emaStudy(underwarmed).reading,/200 valid completed closes/);
const expected200=math.ema(tutoringBars.map(x=>x.close),200);
near(emaStudy(exactlyWarmed).value,expected200[199],'Talia EMA 200 at exact warmup');
near(emaStudy(laterTutor).value,expected200[219],'Talia EMA 200 uses latest revealed bar');
assert.ok(!underwarmed.cues.some(x=>/future.*candle/i.test(x)),'No fabricated future bars in cues');
assert.match(emaStudy(exactlyWarmed).reading,/not automatic support/);

const html=readFileSync('prototype.html','utf8');
const tsx=readFileSync('src/prototype/PrototypeExperiences.tsx','utf8');
const workflow=readFileSync('.github/workflows/prototype-center-v1.yml','utf8');
assert.match(html,/crownlight-indicator-math-v2\.js/);
assert.match(html,/prototype-indicator-workbench-v2\.js/);
assert.ok(html.indexOf('crownlight-indicator-math-v2.js')<html.indexOf('prototype-indicator-workbench-v2.js'));
assert.ok(html.indexOf('prototype-indicator-workbench-v2.js')<html.indexOf('prototype-experiences-boot-v1.js'));
assert.match(tsx,/moveOnMouseMove:false/);
assert.match(tsx,/setPointerCapture/);
assert.match(tsx,/onPointerUp=\{onPanStop\}/);
assert.match(tsx,/onPointerCancel=\{onPanStop\}/);
assert.match(tsx,/onLostPointerCapture=\{onPanStop\}/);
assert.doesNotMatch(tsx,/className="cx-reorderable" draggable/);
assert.match(tsx,/zoomOnMouseWheel:true/);
assert.match(tsx,/dispatchAction\(\{type:'dataZoom'/);
assert.match(tsx,/Full session or revealed chart window/);
assert.match(tsx,/role="toolbar" aria-label="Chart navigation and panning"/);
assert.match(tsx,/Teach This in More Depth/);
assert.match(tsx,/checkTransfer/);
assert.match(tsx,/Independent practice preview/);
assert.match(tsx,/61 authored research guides/);
assert.doesNotMatch(tsx,/setGrade|postPayment|Stripe\.checkout/);
console.log('PASS: 16 studies, exact 61-guide source coverage, seeded indicators, warmup, no lookahead, pan/zoom, deep tutor and secure asset order');
