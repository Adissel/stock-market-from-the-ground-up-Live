/**
 * Crownlight Experience Suite v1 — staff-only presentation experiments.
 * Three pages within the existing protected /prototype.html document:
 * ?experience=a (six-design lab), ?experience=b (three flagship apps),
 * ?experience=c (side-by-side membership studio).
 * No server write, pricing change, authorization grant, grade or live data.
 */
import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot,type Root} from 'react-dom/client';

type Page='a'|'b'|'c';
type Topic='vwap'|'candle';
type Studio='Standard'|'Advanced'|'Professional';
type ChartKind='price'|'heat'|'equity'|'radar'|'volume';
type Viz={init:(el:HTMLElement,theme?:string,opts?:object)=>any,connect?:(group:string)=>void};
type ChartWindow=Window & {CrownlightECharts?:{load:()=>Promise<Viz>}};
type Plan={code:string;label:string;preset:string;description:string;founder:boolean;commons:boolean};
type Bar={time:string;o:number;h:number;l:number;c:number;v:number;ema9:number;ema20:number;proxy:number};
const plans:Plan[]=[
 {code:'FREE',label:'Free Membership',preset:'Foundations Focus',description:'Foundational classroom, accessible learning, and independently entitled core tools.',founder:false,commons:false},
 {code:'FOUNDING_14',label:'Founding 14-Day Starter',preset:'Guided Workshop',description:'Short-cycle Founding Member design and structured guided practice.',founder:true,commons:false},
 {code:'FOUNDING_30',label:'Founding 30-Day',preset:'Analysis Desk',description:'Chart-first Founding Member classroom presentation.',founder:true,commons:false},
 {code:'FOUNDING_60',label:'Founding 60-Day',preset:'Flagship Classroom',description:'Founding Member flagship presentation and Founders Commons benefit.',founder:true,commons:true},
 {code:'FULL_MONTHLY',label:'Full Platform — Monthly',preset:'Professional Studies',description:'Full-platform monthly product design; product availability requires live catalog verification.',founder:false,commons:false},
 {code:'FULL_ANNUAL',label:'Full Platform — Annual',preset:'Study Academy',description:'Full-platform annual product design; pricing and availability unverified.',founder:false,commons:false},
 {code:'LIFETIME',label:'Lifetime Platform Access',preset:'Lifetime Study Suite',description:'Lifetime product design; no entitlement or sale is created.',founder:false,commons:false},
 {code:'ONDEMAND_MONTHLY',label:'Historical Replay / OnDemand — Monthly',preset:'Replay Classroom',description:'Replay-centered product design; actual access is server controlled.',founder:false,commons:false}
];
const designs=[
 {key:'quantum',label:'Quantum Command',caption:'Multichart mission control'},
 {key:'neon',label:'Neon Flux',caption:'Spectral intelligence'},
 {key:'green',label:'Green / Black',caption:'Trader terminal'},
 {key:'ember',label:'Ember Forge',caption:'Precision analysis'},
 {key:'aurora',label:'Aurora Flow',caption:'Learning intelligence'},
 {key:'onyx',label:'Onyx Prime',caption:'Quiet professional'}
] as const;
type Design=typeof designs[number]['key'];
const n=(v:number)=>Number(v.toFixed(4));
const dollars=(v:number)=>'$'+v.toFixed(2);
const series:Bar[]=(()=>{
 const arr:Bar[]=[];let p=43.2,e9=p,e20=p,pv=0,vol=0;
 for(let i=0;i<96;i++){
  const o=p;
  const c=n(Math.max(1,o+Math.sin(i*.36)*.21+Math.cos(i*.13)*.16+Math.sin(i*1.9)*.07+(i>24&&i<34?.14:0)-(i>61&&i<70?.18:0)));
  const h=n(Math.max(o,c)+.06+Math.abs(Math.sin(i*.61))*.23);
  const l=n(Math.min(o,c)-.06-Math.abs(Math.cos(i*.71))*.16);
  const v=Math.round(1250+1250*Math.abs(Math.sin(i*.32))+(i>24&&i<34?1000:0));
  e9=n(e9+(c-e9)*.2);e20=n(e20+(c-e20)*2/21);
  pv+=((h+l+c)/3)*v;vol+=v;
  const mins=570+i;
  arr.push({time:String(Math.floor(mins/60)).padStart(2,'0')+':'+String(mins%60).padStart(2,'0'),o,h,l,c,v,ema9:e9,ema20:e20,proxy:n(pv/vol)});
  p=c;
 }
 return arr;
})();
const demoTrades=[{price:10,volume:100},{price:11,volume:300},{price:12,volume:200}];
function dataFor(reveal:number){return series.slice(0,Math.max(1,Math.min(series.length,reveal)))}
function CandleShape({o,h,l,c}:{o:number;h:number;l:number;c:number}){
 const low=Math.min(l,o,c),high=Math.max(h,o,c),range=Math.max(.01,high-low);
 const y=(v:number)=>14+(high-v)/range*154;
 const color=c>=o?'#55e5b6':'#fb829d';
 return <svg className="cx-candle-svg" viewBox="0 0 240 185" role="img" aria-label="Candlestick showing open high low and close"><line x1="118" y1={y(high)} x2="118" y2={y(low)} stroke={color} strokeWidth="4"/><rect x="82" y={Math.min(y(o),y(c))} width="72" height={Math.max(3,Math.abs(y(o)-y(c)))} rx="2" fill={color}/>{([['H',h],['O',o],['C',c],['L',l]] as [string,number][]).map(([k,v],i)=><g key={k}><line x1={i%2?155:15} y1={y(v)} x2={i%2?215:81} y2={y(v)} stroke="#6b8895" strokeDasharray="3 3"/><text x={i%2?169:10} y={y(v)-5} fill="#c8dce7" fontSize="10">{k} {v.toFixed(2)}</text></g>)}</svg>
}

type IndicatorSpec={id:string;label:string;family:string;setting:string|null;placement:string};
type IndicatorPrefs={settings:Record<string,number>;enabled:Record<string,boolean>;setSettings:(name:string,value:number)=>void;setEnabled:(name:string,value:boolean)=>void;reset:()=>void;enableAll:()=>void};
const IndicatorContext=React.createContext<IndicatorPrefs|null>(null);
const specs:IndicatorSpec[]=[
 ['EMA_FAST','EMA · Fast','Trend','emaFast','Price overlay'],
 ['EMA_SLOW','EMA · Slow','Trend','emaSlow','Price overlay'],
 ['SMA','Simple moving average','Trend','sma','Price overlay'],
 ['VWAP','Session VWAP estimate','Volume/Price',null,'HLC3 bar proxy only'],
 ['BB','Bollinger Bands','Volatility','bbPeriod','Price overlay'],
 ['HOD','Observed HOD','Price levels',null,'Price overlay'],
 ['LOD','Observed LOD','Price levels',null,'Price overlay'],
 ['OR','Opening range H/L','Price levels','orb','Price overlay'],
 ['STRUCTURE','Confirmed market structure','Structure','pivot','Chart pivots'],
 ['VOLUME','Bar volume','Participation',null,'Volume pane'],
 ['VOLMA','Volume moving average','Participation','volPeriod','Volume pane'],
 ['RSI','Wilder RSI','Momentum','rsi','Oscillator pane'],
 ['MACD','MACD (fast / slow / signal)','Momentum','macdFast','Oscillator pane'],
 ['ATR','Wilder ATR','Volatility','atr','Oscillator pane'],
 ['OBV','On-balance volume','Participation',null,'Oscillator pane']
].map(([id,label,family,setting,placement])=>({id,label,family,setting,placement}));
const defaults:Record<string,number>={emaFast:9,emaSlow:20,sma:20,bbPeriod:20,bbDeviation:2,rsi:14,macdFast:12,macdSlow:26,macdSignal:9,atr:14,volPeriod:20,orb:5,pivot:2};
const defaultVisible:Record<string,boolean>={EMA_FAST:true,EMA_SLOW:true,VWAP:true,VOLUME:true,RSI:true};
function IndicatorDock(){
 const prefs=React.useContext(IndicatorContext);
 const [open,setOpen]=useState(true),[search,setSearch]=useState(''),[guides,setGuides]=useState<Array<{code:string;title:string;family:string;concept:string;formula:string;limit?:string;limits?:string;howToUse?:string;commonError?:string}>>([]);
 const [chosen,setChosen]=useState('STUDY_EMA');
 useEffect(()=>{let live=true;fetch('/data/tutor-indicator-study-v1.json',{cache:'no-store',credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json()}).then(d=>{if(live&&d?.count===61&&Array.isArray(d.guides)&&d.guides.length===61)setGuides(d.guides)}).catch(()=>{});return()=>{live=false}},[]);
 if(!prefs)return null;
 const guide=guides.find(g=>g.code===chosen);
 const matches=specs.filter(x=>(x.label+' '+x.family).toLowerCase().includes(search.toLowerCase()));
 const settingRow=(k:string,title:string,min:number,max:number,step=1)=><label key={k} className="cx-indicator-number">{title}<input type="number" aria-label={title} min={min} max={max} step={step} value={prefs.settings[k]} onChange={e=>prefs.setSettings(k,Math.max(min,Math.min(max,Number(e.target.value)||min)))}/></label>;
 return <section className="cx-indicator-workbench" aria-label="Configurable trading indicator library">
  <div className="cx-indicator-heading"><div><div className="cx-overline">CROWNLIGHT CHART STUDIO / TECHNICAL STUDY DESK</div><h2>Indicators & settings <small>15 calculated studies · 61 authored research guides</small></h2></div><div className="cx-tool-row"><button onClick={()=>setOpen(v=>!v)} aria-expanded={open}>{open?'Collapse indicators':'Expand indicators'}</button><button onClick={prefs.enableAll}>Show all calculated</button><button onClick={prefs.reset}>Restore defaults</button></div></div>
  {open&&<><div className="cx-indicator-layout"><div><label className="cx-study-search">Filter chart studies<input aria-label="Filter indicator list" value={search} onChange={e=>setSearch(e.target.value)} placeholder="EMA, RSI, volume, range…"/></label><div className="cx-study-list" role="group" aria-label="Toggle chart indicators">{matches.map(item=><label className="cx-study-choice" key={item.id}><input type="checkbox" aria-label={'Show '+item.label} checked={!!prefs.enabled[item.id]} onChange={e=>prefs.setEnabled(item.id,e.target.checked)}/><span><strong>{item.label}</strong><small>{item.family} · {item.placement}</small></span><b>{prefs.enabled[item.id]?'ON':'OFF'}</b></label>)}{matches.length===0&&<p>No supported chart study matches your search.</p>}</div></div>
  <div><div className="cx-overline">ADJUSTABLE CALCULATION PARAMETERS</div><div className="cx-indicator-params">{settingRow('emaFast','Fast EMA period',2,100)}{settingRow('emaSlow','Slow EMA period',3,100)}{settingRow('sma','SMA period',2,100)}{settingRow('rsi','RSI period',2,100)}{settingRow('bbPeriod','Bollinger period',2,100)}{settingRow('bbDeviation','Bollinger standard deviation',.5,4,.1)}{settingRow('macdFast','MACD fast',2,50)}{settingRow('macdSlow','MACD slow',3,100)}{settingRow('macdSignal','MACD signal',2,50)}{settingRow('atr','ATR period',2,100)}{settingRow('volPeriod','Volume SMA period',2,100)}{settingRow('orb','Opening range minutes',1,30)}{settingRow('pivot','Structure confirmation bars',1,5)}</div><p className="cx-small">Values update only after each fictional bar completes. Warm-up gaps remain empty, not zero. Signal studies do not predict or authorize trades.</p></div></div>
  <div className="cx-indicator-catalog"><div><div className="cx-overline">TALIA / FULL AUTHORED STUDY LIBRARY</div><label>Explore all {guides.length||61} indicator topics <select aria-label="Indicator teaching guide" value={chosen} onChange={e=>setChosen(e.target.value)}><option value="STUDY_EMA">Exponential Moving Average</option>{guides.filter(g=>g.code!=='STUDY_EMA').map(g=><option key={g.code} value={g.code}>{g.title} · {g.family}</option>)}</select></label></div><div className="cx-guide-copy"><strong>{guide?.title||'Exponential Moving Average'}</strong><p>{guide?.concept||'A recent-price-weighted moving average. View the calculation settings, bar history and limitations.'}</p><p><b>Formula:</b> {guide?.formula||'EMA(t) = α × price(t) + (1−α) × EMA(t−1), α=2/(N+1)'}</p><p><b>Where it fails:</b> {guide?.limit||guide?.limits||'Indicators derived from historical bars are not future price guarantees.'}</p><p><b>Common live-trading error:</b> {guide?.commonError||'Treating a crossover alone as a trade signal.'}</p><span className="cx-chip">61 topics are teaching references; 15 studies are calculated on this synthetic OHLCV fixture</span></div></div></>}
 </section>;
}

function EChart({kind,reveal,showVolume,showEma,showProxy,focusBar,onSelect,design,height=320}:{kind:ChartKind;reveal:number;showVolume:boolean;showEma:boolean;showProxy:boolean;focusBar:number;onSelect?:(index:number)=>void;design:Design;height?:number}){
 const ref=useRef<HTMLDivElement>(null),inst=useRef<any>(null),viewport=useRef({start:Math.max(0,100-40/Math.max(1,reveal)*100),end:100});
 const prefs=React.useContext(IndicatorContext);
 const onSelectRef=useRef(onSelect);onSelectRef.current=onSelect;
 const settings=prefs?.settings,enabled=prefs?.enabled;
 const currentEnabled={...enabled,EMA_FAST:showEma&&!!enabled?.EMA_FAST,EMA_SLOW:showEma&&!!enabled?.EMA_SLOW,VWAP:showProxy&&!!enabled?.VWAP,VOLUME:showVolume&&!!enabled?.VOLUME};
 const subpaneCount=kind==='price'?Object.entries(currentEnabled).filter(([k,v])=>v&&['RSI','MACD','ATR','OBV'].includes(k)).length:0;
 const actualHeight=kind==='price'?Math.max(height,360+subpaneCount*122):height;
 const resetViewport=()=>{viewport.current={start:0,end:100};inst.current?.dispatchAction({type:'dataZoom',start:0,end:100})};
 const moveWindow=(direction:number)=>{const {start,end}=viewport.current,windowSize=end-start,delta=direction*windowSize*.33;const left=Math.max(0,Math.min(100-windowSize,start+delta));inst.current?.dispatchAction({type:'dataZoom',start:left,end:left+windowSize})};
 const zoomWindow=(direction:number)=>{const {start,end}=viewport.current,mid=(start+end)/2;const width=Math.max(8,Math.min(100,(end-start)*(direction>0?.7:1.4)));const left=Math.max(0,Math.min(100-width,mid-width/2));inst.current?.dispatchAction({type:'dataZoom',start:left,end:left+width})};
 useEffect(()=>{
  let alive=true,resize:ResizeObserver|undefined;
  (async()=>{try{
   const echarts=await (window as ChartWindow).CrownlightECharts?.load();
   if(!alive||!ref.current||!echarts)return;
   const style=getComputedStyle(ref.current.closest('.cx-theme-green,.cx-theme-aurora,.cx-theme-quantum,.cx-theme-neon,.cx-theme-ember,.cx-theme-onyx')||ref.current);
   const cv=(k:string,fallback:string)=>style.getPropertyValue(k).trim()||fallback;
   const accent=cv('--cx-accent','#72e0d1'),good=cv('--cx-good','#46d5ad'),bad=cv('--cx-bad','#f27d98'),muted=cv('--cx-muted','#99aebe'),grid=cv('--cx-grid','#294452');
   const bars=dataFor(reveal),names=bars.map(b=>b.time);
   const axis={axisLine:{lineStyle:{color:grid}},axisTick:{show:false},axisLabel:{color:muted,fontSize:10},splitLine:{lineStyle:{color:grid,opacity:.55}}};
   let option:any={animation:false,backgroundColor:'transparent',textStyle:{color:muted,fontFamily:'Inter,system-ui'},tooltip:{trigger:'axis',confine:true,backgroundColor:'#102131',borderColor:grid,textStyle:{color:'#edf7ff'},axisPointer:{type:'cross'}},grid:{left:46,right:12,top:20,bottom:34},xAxis:{type:'category',data:names,...axis,axisLabel:{color:muted,fontSize:9,interval:Math.max(0,Math.floor(reveal/8))}},yAxis:{type:'value',scale:true,...axis},series:[]};
   if(kind==='price'){
    const math=(window as any).CrownlightPrototypeIndicators;
    const calculated=math?.compute?.(bars,settings||defaults,currentEnabled);
    if(!calculated)throw Error('Shared math library unavailable');
    const volumePane=calculated.volume.length>0;
    const panes:string[]=calculated.panes;
    const gridRows=[{id:'price',height:Math.max(185,actualHeight-65-(volumePane?95:0)-panes.length*120)}];
    if(volumePane)gridRows.push({id:'volume',height:81});
    for(const id of panes)gridRows.push({id,height:105});
    let top=18;
    option.grid=gridRows.map((x)=>{const out={left:55,right:22,top,height:x.height};top+=x.height+19;return out});
    option.xAxis=gridRows.map((x,i)=>({type:'category',gridIndex:i,data:names,boundaryGap:true,...axis,
      axisLabel:{show:i===gridRows.length-1,color:muted,fontSize:10,interval:Math.max(0,Math.floor(reveal/10))}}));
    option.yAxis=gridRows.map((x,i)=>({type:'value',gridIndex:i,scale:x.id!=='rsi',min:x.id==='rsi'?0:undefined,max:x.id==='rsi'?100:undefined,...axis,
      axisLabel:{color:muted,fontSize:10,formatter:(v:number)=>Number(v).toFixed(x.id==='rsi'?0:2)},splitNumber:3}));
    const xIndexes=gridRows.map((_,i)=>i);
    const {start,end}=viewport.current;
    option.dataZoom=[
      {id:'drag-pan',type:'inside',xAxisIndex:xIndexes,start,end,moveOnMouseMove:true,zoomOnMouseWheel:'ctrl',moveOnMouseWheel:false,preventDefaultMouseMove:true,filterMode:'none'},
      {id:'range',type:'slider',xAxisIndex:xIndexes,start,end,bottom:0,height:13,brushSelect:false,
       fillerColor:'rgba(95,204,190,.23)',borderColor:grid,backgroundColor:'#0a1c2a',handleStyle:{color:accent},textStyle:{color:muted},filterMode:'none'}
    ];
    option.axisPointer={link:[{xAxisIndex:'all'}],label:{backgroundColor:'#183242'}};
    const markerData=[...calculated.marks.map((m:any)=>({name:m.label,coord:[m.index,m.value],value:m.label,symbol:'pin',symbolSize:27,label:{color:'#06131e',fontWeight:700,fontSize:10}}))];
    if(focusBar>=0&&focusBar<bars.length)markerData.push({name:'Selected bar',coord:[focusBar,bars[focusBar].h],symbol:'circle',symbolSize:7,value:'',label:{show:false}});
    option.series=[{id:'price-candles',type:'candlestick',name:'Fictional completed OHLCV',data:bars.map(b=>[b.o,b.c,b.l,b.h]),
      itemStyle:{color:good,color0:bad,borderColor:good,borderColor0:bad},barMaxWidth:18,
      markPoint:{silent:true,data:markerData}}];
    for(const x of calculated.price)option.series.push({id:'ind-'+x.label,name:x.label,type:'line',data:x.data,showSymbol:false,connectNulls:false,animation:false,
       lineStyle:{color:x.color,width:x.width,type:x.label.includes('proxy')?'dashed':'solid'},itemStyle:{color:x.color},symbol:'none'});
    for(const x of calculated.volume){
      const index=gridRows.findIndex(x=>x.id==='volume');if(index<0)continue;
      option.series.push({id:'volume-'+x.label,name:x.label,type:x.kind==='bar'?'bar':'line',xAxisIndex:index,yAxisIndex:index,
       data:x.kind==='bar'?x.data.map((v:number,i:number)=>({value:v,itemStyle:{color:bars[i].c>=bars[i].o?good:bad,opacity:.65}})):x.data,
       showSymbol:false,itemStyle:{color:x.color},lineStyle:{color:x.color,width:2},barMaxWidth:17,animation:false});
    }
    for(const x of calculated.pane){
     const index=gridRows.findIndex(g=>g.id===x.axis);if(index<0)continue;
     const series:any={id:'pane-'+x.label,name:x.label,type:x.kind==='bar'?'bar':'line',xAxisIndex:index,yAxisIndex:index,
       data:x.data,showSymbol:false,animation:false,itemStyle:{color:x.color},lineStyle:{color:x.color,width:2},connectNulls:false};
     if(x.axis==='rsi'&&x.label.startsWith('Wilder'))series.markLine={silent:true,symbol:'none',lineStyle:{type:'dashed',color:grid},data:[{yAxis:30},{yAxis:70}]};
     option.series.push(series);
    }
   }else if(kind==='heat'){
    const rows=['Price response','Volume','VWAP proxy','Trend','Momentum','Recognition'];
    const blocks=Array.from({length:12*6},(_,k)=>[k%12,Math.floor(k/12),Math.round(40+55*Math.abs(Math.sin(k*.37+reveal*.04)))]);
    option={...option,tooltip:{position:'top'},visualMap:{show:false,min:0,max:100,inRange:{color:['#203141',accent,'#eedb88']}},grid:{left:90,right:12,top:12,bottom:33},
      xAxis:{type:'category',data:Array.from({length:12},(_,i)=>'T'+(i+1)),...axis,splitArea:{show:false}},yAxis:{type:'category',data:rows,...axis},
      series:[{type:'heatmap',data:blocks,label:{show:false},itemStyle:{borderColor:'#0c1723',borderWidth:3}}]};
   }else if(kind==='radar'){
    option={...option,tooltip:{show:true},radar:{indicator:[{name:'Knowledge',max:100},{name:'Recognition',max:100},{name:'Decision',max:100},{name:'Process',max:100},{name:'Review',max:100}],
      splitLine:{lineStyle:{color:grid}},splitArea:{areaStyle:{color:['transparent']}},axisLine:{lineStyle:{color:grid}},axisName:{color:muted}},
      series:[{type:'radar',data:[{value:[84,71,67,88,76],name:'Fictional learning record',areaStyle:{color:accent,opacity:.17},lineStyle:{color:accent,width:2},symbol:'circle'}]}]};
   }else if(kind==='equity'){
    const values=Array.from({length:30},(_,i)=>n(10000+i*17+Math.sin(i*.65)*120+Math.cos(i*.2)*170));
    option={...option,xAxis:{type:'category',data:values.map((_,i)=>String(i+1)),...axis},
      series:[{type:'line',name:'Fictional practice equity',data:values,smooth:.24,showSymbol:false,lineStyle:{color:accent,width:3},areaStyle:{opacity:.16,color:accent}}]};
   }else if(kind==='volume'){
    option={...option,xAxis:{type:'category',data:names,...axis},series:[{type:'bar',name:'Illustrative volume',data:bars.map(b=>({value:b.v,itemStyle:{color:b.c>=b.o?good:bad,opacity:.8}}))}]};
   }
   inst.current=echarts.init(ref.current);
   inst.current.setOption(option,true);
   if(kind==='price'){
    inst.current.on('datazoom',()=>{
      if(!inst.current)return;
      const state=inst.current.getOption()?.dataZoom?.[0];
      if(state&&Number.isFinite(state.start)&&Number.isFinite(state.end))viewport.current={start:state.start,end:state.end};
    });
    inst.current.on('click',(p:any)=>{if(typeof p.dataIndex==='number')onSelectRef.current?.(p.dataIndex)});
   }
   resize=new ResizeObserver(()=>inst.current?.resize());resize.observe(ref.current);
  }catch(error){if(ref.current)ref.current.textContent='Chart unavailable: check the locally hosted ECharts and shared indicator math bundles.';console.error('Crownlight synthetic chart',error)}
  })();
  return()=>{alive=false;resize?.disconnect();inst.current?.dispose();inst.current=null};
 },[kind,reveal,showVolume,showEma,showProxy,focusBar,design,settings,enabled,actualHeight]);
 return <div className="cx-interactive-chart">
 {kind==='price'&&<div className="cx-pan-controls" role="toolbar" aria-label="Chart navigation and panning">
    <span>DRAG INSIDE CHART TO PAN · CTRL + WHEEL TO ZOOM · RANGE SLIDER TO NAVIGATE</span>
    <button aria-label="Pan chart left" onClick={()=>moveWindow(-1)}>← Pan</button>
    <button aria-label="Pan chart right" onClick={()=>moveWindow(1)}>Pan →</button>
    <button aria-label="Zoom chart in" onClick={()=>zoomWindow(1)}>Zoom +</button>
    <button aria-label="Zoom chart out" onClick={()=>zoomWindow(-1)}>Zoom −</button>
    <button aria-label="Fit all revealed candles" onClick={resetViewport}>Fit</button>
   </div>}
 <div ref={ref} className={'cx-chart '+(kind==='price'?'cx-chart-grabbable':'')} style={{height:actualHeight}}
   role="img" aria-label={kind==='price'?'Draggable synthetic OHLCV candlestick chart. Mouse drag pans the completed bars, Control plus wheel zooms; keyboard-accessible pan and zoom buttons appear above.':kind+' fictional visualization'}/>
 </div>;
}

const Icon=({type}:{type:string})=><span aria-hidden="true" className="cx-glyph">{type}</span>;
type CoachMode='Explain This Concept'|'Guided Example'|'Try Another Example'|'Teach This in More Depth';
function Talia({topic,step,bar}:{topic:Topic;step:number;bar?:Bar}){
 const [mode,setMode]=useState<CoachMode>('Explain This Concept');
 useEffect(()=>setMode('Explain This Concept'),[topic,step]);
 const stagesVWAP=[
 ['Objective','Explain why weighting by trade size matters; compute the weighted mean with units; distinguish trade-print VWAP from a candle-level approximation.'],
 ['First principles','VWAP asks: At what average price did the observed shares trade? Each transaction contributes price × shares. Larger share lots influence the mean more.'],
 ['Worked numerical example','100 shares at $10 = $1,000; 300 at $11 = $3,300; $4,300 ÷ 400 shares = $10.75/share. Simple mean $10.50 is wrong for unequal quantities.'],
 ['Guided chart observation','Compare a completed close with cumulative HLC3 × volume proxy. This uses bar typical prices, not the individual trade-print VWAP.'],
 ['Knowledge checkpoint','Identify numerator (traded dollars), denominator (shares), units, and whether a VWAP value is trade-print based or an approximation.'],
 ['Guided practice','Change trade inputs. Recompute each trade value, the total traded dollars and total shares before checking the final answer.'],
 ['Independent practice preview','Calculate without copying the worked example. This preview is ungraded, and protected official assessment questions are not exposed.'],
 ['Transfer','Another session: 200 shares at $12 and 800 at $12.50. ($2,400+$10,000)/1,000 = $12.40/share, not the unweighted $12.25.'],
 ['Review and decision','VWAP is retrospective. Above/below a mean cannot alone establish liquidity, a confirmed entry, or next-bar behavior.']
 ];
 const stagesCandle=[
 ['Objective','Identify OHLC, body, wicks, range and body-to-range percent. Avoid predictions from candle shape alone.'],
 ['First principles','A candle summarizes one fixed interval. Open is first, close is final, high is maximum and low is minimum; the order inside the bar is not known.'],
 ['Worked numerical example','O=$31.00, H=$32.50, L=$30.50, C=$32.00. Body=$1.00; range=$2.00; upper wick=$0.50; lower wick=$0.50; body/range=50%.'],
 ['Guided chart observation','Choose a completed candle and record four prices, close versus open, body size and the upper and lower wicks.'],
 ['Knowledge checkpoint','Distinguish full high–low range from close–open body; green color alone cannot establish bullish continuation.'],
 ['Guided practice','Change OHLC in the builder. Confirm high ≥ open/close and low ≤ open/close. Examine body and wick recalculations.'],
 ['Independent practice preview','Work independently before checking. This preview never accesses or reveals the protected official assessment answer keys.'],
 ['Transfer','New candle: O=$40, H=$41.20, L=$39.60, C=$40.40. Range=$1.60, body=$0.40, upper wick=$0.80, lower wick=$0.40; body/range=25%.'],
 ['Review and decision','A long wick shows price excursion, not who traded or what must come next. Check volume, structure, time and invalidation.']
 ];
 const stages=topic==='vwap'?stagesVWAP:stagesCandle;
 const base=stages[Math.min(8,Math.max(0,step))];
 const evidence=bar?'Current revealed candle '+bar.time+': O '+dollars(bar.o)+', H '+dollars(bar.h)+', L '+dollars(bar.l)+', C '+dollars(bar.c)+', volume '+bar.v.toLocaleString()+' shares, range '+dollars(bar.h-bar.l)+', body '+dollars(Math.abs(bar.c-bar.o))+'.':'The active learning example uses fictional OHLCV.';
 const alternate=topic==='vwap'?'150 shares at $12 and 50 shares at $16: $1,800 + $800 = $2,600. Divide by 200 shares = $13/share. The simple mean $14 is wrong because quantities differ.':'O=$28.50, H=$29.20, L=$28.00, C=$28.90. Body=$0.40; range=$1.20; upper wick=$0.30; lower wick=$0.50; body/range=33.33%.';
 const deep=topic==='vwap'?'Price ($/share) × shares = dollars; divided by shares gives $/share. Bar HLC3 proxy uses (high+low+close)/3 × bar volume, not a true trade price. Future bars cannot be used to evaluate a prior replay decision.':'Body=|C−O|; upper wick=H−max(O,C); lower wick=min(O,C)−L; range=H−L. Three parts sum to the range. Body-to-range is undefined at zero range; intrabar price order is unknown.';
 const diagnostic=topic==='vwap'?'Averaging transaction prices without weighting shares, or treating HLC3 as exact print VWAP. Correct by computing every price×shares subtotal and declaring source limitations.':'Confusing body with high–low range or reading a wick as a guaranteed reversal. Correct by labeling O/H/L/C separately and calculating each component.';
 const content=mode==='Guided Example'?(topic==='vwap'?stagesVWAP[2][1]:stagesCandle[2][1]):mode==='Try Another Example'?alternate:mode==='Teach This in More Depth'?base[1]+' '+deep+' '+diagnostic:base[1];
 return <section className="cx-talia" aria-label="Talia Mercer guided teaching"><div className="cx-orb" aria-hidden="true">T</div><div className="cx-coach-content"><div className="cx-overline">TALIA MERCER / INSTRUCTIONAL COACH</div><strong>{base[0]} · {topic==='vwap'?'VWAP':'Candlestick anatomy'}</strong>
  <div className="cx-coach-actions">{(['Explain This Concept','Guided Example','Try Another Example','Teach This in More Depth'] as CoachMode[]).map(m=><button type="button" key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m}</button>)}</div>
  <p role="status">{content}</p>
  {step===3&&<p className="cx-coach-evidence">{evidence}</p>}
  {step===5&&<p className="cx-coach-evidence"><b>Guided process:</b> identify inputs → formula → substitute values → calculate → label units → explain limitations.</p>}
  {step===8&&<p className="cx-coach-evidence"><b>Common mistake and correction:</b> {diagnostic}</p>}
  <small>Complete explanations and retries are not paywalled within an accessible lesson. This is authored deterministic teaching, not a claim of a live AI conversation.</small>
 </div></section>;
}
function Lesson({topic,setTopic,stage,setStage,bar,setBar}:{topic:Topic;setTopic:(v:Topic)=>void;stage:number;setStage:(v:number)=>void;bar:Bar;setBar:(v:Bar)=>void}){
 const [trades,setTrades]=useState(demoTrades);
 const [answer,setAnswer]=useState('');
 const [feedback,setFeedback]=useState('');
 const [o,setO]=useState(31),[h,setH]=useState(32.5),[l,setL]=useState(30.5),[c,setC]=useState(32);
 const sumV=trades.reduce((s,x)=>s+x.volume,0),sumPV=trades.reduce((s,x)=>s+x.price*x.volume,0);
 const trueVWAP=sumV?sumPV/sumV:0;
 const check=()=>{const result=topic==='vwap'?trueVWAP:Math.abs(c-o);const guess=Number(answer);setFeedback(answer.trim()!==''&&Number.isFinite(guess)&&Math.abs(guess-result)<.011?'Correct. Now explain each step and the result’s limitations.':'Try again. Show each intermediate calculation, including units.');};
 const adjust=(name:'o'|'h'|'l'|'c',v:number)=>{
  if(name==='o')setO(v);if(name==='c')setC(v);
  if(name==='h')setH(Math.max(v,o,c));if(name==='l')setL(Math.min(v,o,c));
  if(name==='o'||name==='c'){setH(old=>Math.max(old,v));setL(old=>Math.min(old,v));}
  setFeedback('');
 };
 return <section className="cx-panel cx-learning">
  <div className="cx-panel-head"><div><div className="cx-overline">CROWNLIGHT LEARNING ENGINE / NINE STAGES</div><h3>{topic==='vwap'?'Understanding VWAP':'Build & Understand a Candlestick'}</h3></div><div className="cx-switch"><button aria-pressed={topic==='vwap'} onClick={()=>{setTopic('vwap');setAnswer('');setFeedback('')}}>VWAP</button><button aria-pressed={topic==='candle'} onClick={()=>{setTopic('candle');setAnswer('');setFeedback('')}}>Candles</button></div></div>
  <div className="cx-stepper" role="group" aria-label="Teaching stage">{['Objectives','Definition','Math','Chart','Check','Guided','Independent','Transfer','Review'].map((x,i)=><button title={x} key={x} aria-pressed={stage===i} onClick={()=>setStage(i)}>{i+1}</button>)}</div>
  <div className="cx-stage-name">STAGE {stage+1} / 9 · {['Objectives','First principles','Worked calculation','Guided visualization','Knowledge checkpoint','Guided practice','Independent assessment preview','Transfer task','Diagnostic feedback'][stage]}</div>
  <Talia topic={topic} step={stage} bar={bar}/>
  {topic==='candle'?<div className="cx-lesson-body"><CandleShape o={o} h={h} l={l} c={c}/><div className="cx-input-grid">{([['o','Open',o],['h','High',h],['l','Low',l],['c','Close',c]] as ['o'|'h'|'l'|'c',string,number][]).map(([id,label,value])=><label key={id}>{label}<input type="number" min="1" step=".1" value={value} onChange={e=>adjust(id,Number(e.target.value)||1)}/></label>)}</div><div className="cx-numeric"><span>Body <b>{dollars(Math.abs(c-o))}</b></span><span>Range <b>{dollars(h-l)}</b></span><span>Upper wick <b>{dollars(h-Math.max(o,c))}</b></span><span>Lower wick <b>{dollars(Math.min(o,c)-l)}</b></span></div><p className="cx-small">Selected replay candle: {bar.time} · O {dollars(bar.o)} · H {dollars(bar.h)} · L {dollars(bar.l)} · C {dollars(bar.c)}. Builder is an independent fictional example.</p></div>:<div className="cx-lesson-body"><div className="cx-overline">EXACT TRADE-PRINT VWAP · FICTIONAL TRANSACTIONS</div><div className="cx-trade-rows">{trades.map((t,i)=><div key={i} className="cx-trade"><label>Price <input type="number" min=".01" step=".5" value={t.price} onChange={e=>setTrades(v=>v.map((x,j)=>i===j?{...x,price:Math.max(.01,Number(e.target.value)||.01)}:x))}/></label><label>Shares <input type="number" min="1" step="50" value={t.volume} onChange={e=>setTrades(v=>v.map((x,j)=>i===j?{...x,volume:Math.max(1,Math.round(Number(e.target.value)||1))}:x))}/></label><strong>{dollars(t.price*t.volume)}</strong></div>)}</div><div className="cx-numeric"><span>Total traded value <b>{dollars(sumPV)}</b></span><span>Shares <b>{sumV.toLocaleString()}</b></span><span>VWAP <b>{dollars(trueVWAP)}</b></span></div><p className="cx-small">Formula: Σ(price × shares) ÷ Σ(shares). The chart overlay is a separate OHLCV approximation and is explicitly labeled as such.</p></div>}
  <div className="cx-check"><label>{topic==='vwap'?'Calculate the trade-print VWAP ($/share)':'Calculate the candle body ($/share)'}<input aria-label="Practice answer" type="number" step=".01" value={answer} onChange={e=>setAnswer(e.target.value)}/></label><button onClick={check}>Check ungraded answer</button><p role="status">{feedback||'Try the calculation. Explanations, retries and feedback are free within any accessible lesson.'}</p></div>
 </section>;
}
const featureRows=[
 ['First-principles lesson','Identical instruction quality whenever accessible'],
 ['Guided explanations and retry','Available within any accessible Lab'],
 ['Core chart preview','Independently controlled by Chart Studio entitlement'],
 ['Drawing tools','Advanced tool-preview scenario'],
 ['Synchronized charts','Professional tool-preview scenario'],
 ['Historical replay','Separate product or membership entitlement'],
 ['Founders Commons','Founding 60-Day benefit'],
 ['Saved workspace','Requires account permissions and storage policy']
];
function Access({plan,studio}:{plan:Plan;studio:Studio}){
 const features=[true,true,true,studio!=='Standard',studio==='Professional',plan.code==='ONDEMAND_MONTHLY'||plan.code==='FULL_MONTHLY'||plan.code==='FULL_ANNUAL'||plan.code==='LIFETIME',plan.commons,studio!=='Standard'];
 return <section className="cx-panel"><div className="cx-panel-head"><h3>Access & capability inspector</h3><span className="cx-chip">PREVIEW ONLY</span></div><p className="cx-small">Membership design and Chart Studio level are independent selectors. Icons below are illustrative UI scenarios, not verified product entitlements.</p>{featureRows.map(([name,desc],i)=><div className="cx-access-row" key={name}><span className={features[i]?'cx-yes':'cx-maybe'}>{features[i]?'●':'◇'}</span><div><strong>{name}</strong><small>{desc}</small></div><span>{features[i]?'Demo':'Conditional'}</span></div>)}</section>
}
function Workstation({plan,studio,design,topic,setTopic,stage,setStage,reveal,setReveal,volume,setVolume,ema,setEma,proxy,setProxy,focus,setFocus}:{plan:Plan;studio:Studio;design:Design;topic:Topic;setTopic:(t:Topic)=>void;stage:number;setStage:(v:number)=>void;reveal:number;setReveal:(v:number)=>void;volume:boolean;setVolume:(v:boolean)=>void;ema:boolean;setEma:(v:boolean)=>void;proxy:boolean;setProxy:(v:boolean)=>void;focus:number;setFocus:(v:number)=>void}){
 const bar=series[Math.min(focus,reveal-1)]||series[0];
 const [panels,setPanels]=useState(['primary','analysis','learning']);
 const ordered:Record<Design,string[]>={quantum:['primary','analysis','learning'],neon:['analysis','primary','learning'],green:['primary','learning','analysis'],ember:['learning','primary','analysis'],aurora:['learning','analysis','primary'],onyx:['analysis','learning','primary']};
 useEffect(()=>setPanels([...ordered[design]]),[design]);
 const swap=(i:number,dir:number)=>setPanels(current=>{const arr=[...current],j=i+dir;if(j<0||j>=arr.length)return current;[arr[i],arr[j]]=[arr[j],arr[i]];return arr});
 const content:Record<string,React.ReactNode>={
 primary:<section className="cx-panel cx-chart-card"><div className="cx-panel-head"><div><div className="cx-overline">SYNTHETIC INTRADAY STREAM / OHLCV</div><h3>Primary price discovery</h3></div><span className="cx-chip">{bar.time} · {dollars(bar.c)}</span></div><div className="cx-tool-row"><button aria-pressed={volume} onClick={()=>setVolume(!volume)}>Volume</button><button aria-pressed={ema} onClick={()=>setEma(!ema)}>EMA 9 / 20</button><button aria-pressed={proxy} onClick={()=>setProxy(!proxy)}>OHLCV VWAP proxy</button><button onClick={()=>setReveal(96)}>Full series</button></div><EChart kind="price" reveal={reveal} showVolume={volume} showEma={ema} showProxy={proxy} focusBar={focus} onSelect={setFocus} design={design} height={330}/><div className="cx-chart-foot">Select a candle · zoom / pan · no future bars beyond the replay boundary · no live orders</div><div className="cx-replay"><button onClick={()=>setReveal(Math.max(1,reveal-1))}>− Previous</button><input type="range" aria-label="Reveal fictional candles" min="1" max="96" value={reveal} onChange={e=>setReveal(Number(e.target.value))}/><span>{reveal}/96</span><button onClick={()=>setReveal(Math.min(96,reveal+1))}>Next +</button></div></section>,
 analysis:<section className="cx-panel"><div className="cx-panel-head"><h3>Analytical overlays</h3><span className="cx-chip">{studio.toUpperCase()} PREVIEW</span></div><div className="cx-double-chart"><div><div className="cx-overline">MARKET STRUCTURE / SYNTHETIC HEATMAP</div><EChart kind="heat" reveal={reveal} showVolume={volume} showEma={ema} showProxy={proxy} focusBar={focus} design={design} height={186}/></div><div><div className="cx-overline">FICTIONAL PRACTICE EQUITY</div><EChart kind="equity" reveal={reveal} showVolume={volume} showEma={ema} showProxy={proxy} focusBar={focus} design={design} height={186}/></div></div><p className="cx-small">Heatmap and equity track are demonstration analytics, not predictions, trading results, or real market measurements.</p></section>,
 learning:<Lesson topic={topic} setTopic={setTopic} stage={stage} setStage={setStage} bar={bar} setBar={()=>{}}/>
 };
 return <div className="cx-workgrid"><div className="cx-maincolumn"><div className="cx-kpis"><div><span>LAST REVEALED CLOSE</span><b>{dollars(series[reveal-1].c)}</b></div><div><span>VISIBLE BARS</span><b>{reveal}</b></div><div><span>OHLCV PROXY</span><b>{dollars(series[reveal-1].proxy)}</b></div><div><span>PREVIEW PRESET</span><b>{plan.preset}</b></div></div>{panels.map((key,i)=><div key={key} className="cx-reorderable" draggable onDragStart={e=>e.dataTransfer.setData('text/plain',String(i))} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const from=Number(e.dataTransfer.getData('text/plain'));if(Number.isInteger(from))setPanels(a=>{const b=[...a],moving=b.splice(from,1)[0];b.splice(i,0,moving);return b})}}><div className="cx-reorder-tools"><span>DRAG TO REARRANGE / PANEL {i+1}</span><button disabled={i===0} onClick={()=>swap(i,-1)}>↑</button><button disabled={i===panels.length-1} onClick={()=>swap(i,1)}>↓</button></div>{content[key]}</div>)}</div><aside className="cx-right"><Access plan={plan} studio={studio}/><section className="cx-panel"><div className="cx-panel-head"><h3>Replay candle inspector</h3><span className="cx-chip">BAR {Math.min(focus+1,reveal)}</span></div>{[['Open',bar.o],['High',bar.h],['Low',bar.l],['Close',bar.c],['Full range',bar.h-bar.l],['Real body',Math.abs(bar.c-bar.o)],['Upper wick',bar.h-Math.max(bar.o,bar.c)],['Lower wick',Math.min(bar.o,bar.c)-bar.l]].map(([name,value])=><div className="cx-data-row" key={name}><span>{name}</span><b>{dollars(Number(value))}</b></div>)}<div className="cx-small">A candle identifies the range of completed prices; it does not reveal the sequence of trades inside the bar.</div></section><section className="cx-panel"><h3>Competency intelligence</h3><EChart kind="radar" reveal={reveal} showVolume={volume} showEma={ema} showProxy={proxy} focusBar={focus} design={design} height={220}/><p className="cx-small">Illustrative learning measures; not real member progress.</p></section></aside></div>;
}
function Flagships(props:Parameters<typeof Workstation>[0]){
 const [which,setWhich]=useState<'quantum'|'aurora'|'green'>('quantum');
 const [dimension,setDimension]=useState<'chart'|'lesson'>('chart');
 const d=which==='quantum'?'quantum':which==='aurora'?'aurora':'green';
 const chart=<EChart kind="price" reveal={props.reveal} showVolume={props.volume} showEma={props.ema} showProxy={props.proxy} focusBar={props.focus} onSelect={props.setFocus} design={d} height={395}/>;
 const lesson=<Lesson topic={props.topic} setTopic={props.setTopic} stage={props.stage} setStage={props.setStage} bar={series[Math.min(props.focus,props.reveal-1)]} setBar={()=>{}}/>;
 return <section className={'cx-flagship cx-flagship-'+which+' cx-theme-'+which}><div className="cx-flagship-tabs">{([['quantum','01 / Quantum Command'],['aurora','02 / Aurora Learning'],['green','03 / Green / Black Terminal']] as const).map(([k,t])=><button key={k} aria-pressed={k===which} onClick={()=>setWhich(k)}>{t}</button>)}</div><div className="cx-flagship-intro"><div><span className="cx-overline">{which.toUpperCase()} / FLAGSHIP DESIGN SYSTEM</span><h2>{which==='quantum'?'The analytical edge.':which==='aurora'?'Make the market understandable.':'Signal. Structure. Discipline.'}</h2><p>{which==='quantum'?'A high-density multichart cockpit with data-linked research and replay.':which==='aurora'?'A guided education environment where explanations, calculations and chart evidence are always connected.':'A high-contrast operational workstation for focused chart and replay work.'}</p></div><span className="cx-chip">{props.plan.label} · {props.studio} tool preview</span></div>{which==='quantum'?<div className="cx-flagship-quantum"><div className="cx-panel"><div className="cx-panel-head"><h3>Price / participation</h3><span className="cx-chip">SIMULATED</span></div>{chart}</div><div className="cx-panel"><h3>Scenario heatmap</h3><EChart kind="heat" reveal={props.reveal} showVolume={props.volume} showEma={props.ema} showProxy={props.proxy} focusBar={props.focus} design={d} height={270}/><h3>Practice performance</h3><EChart kind="equity" reveal={props.reveal} showVolume={props.volume} showEma={props.ema} showProxy={props.proxy} focusBar={props.focus} design={d} height={170}/></div></div>:which==='aurora'?<div className="cx-flagship-aurora"><div>{lesson}</div><div className="cx-panel"><div className="cx-panel-head"><h3>Chart evidence in context</h3><span className="cx-chip">TEACHING OVERLAY</span></div>{chart}<div className="cx-overline">GUIDED OBSERVATION</div><p>Use the chart to identify a completed candle, then explain the applicable calculation. The OHLCV approximation is never a substitute for trade-print VWAP.</p></div></div>:<div className="cx-flagship-green"><div className="cx-green-ticker"><span>SIM-01 / FICTITIOUS</span><span>{dollars(series[props.reveal-1].c)}</span><span>VOLUME {series[props.reveal-1].v.toLocaleString()}</span><span>NO LIVE ORDERS</span></div><div className="cx-panel cx-black-chart">{chart}<div className="cx-replay"><button onClick={()=>props.setReveal(Math.max(1,props.reveal-1))}>BACK</button><input type="range" min="1" max="96" aria-label="Visible replay bars" value={props.reveal} onChange={e=>props.setReveal(Number(e.target.value))}/><button onClick={()=>props.setReveal(Math.min(96,props.reveal+1))}>FORWARD</button></div></div><div className="cx-green-side"><section className="cx-panel"><h3>Indicator stack</h3><div className="cx-tool-row"><button aria-pressed={props.ema} onClick={()=>props.setEma(!props.ema)}>EMA 9/20</button><button aria-pressed={props.proxy} onClick={()=>props.setProxy(!props.proxy)}>Proxy VWAP</button><button aria-pressed={props.volume} onClick={()=>props.setVolume(!props.volume)}>Volume</button></div><EChart kind="volume" reveal={props.reveal} showVolume={props.volume} showEma={props.ema} showProxy={props.proxy} focusBar={props.focus} design={d} height={230}/></section><section className="cx-panel">{lesson}</section></div></div>}<div className="cx-flagship-bottom"><button aria-pressed={dimension==='chart'} onClick={()=>setDimension('chart')}>Chart diagnostics</button><button aria-pressed={dimension==='lesson'} onClick={()=>setDimension('lesson')}>Instructor view</button><span>{dimension==='chart'?'Visible candles '+props.reveal+'/96 · no future data':'Nine-stage teaching engine · identical instructional quality'}</span></div></section>;
}
function Compare({design,studio,topic,setTopic,stage,setStage,reveal,setReveal,volume,ema,proxy,focus,setFocus}:{design:Design;studio:Studio;topic:Topic;setTopic:(v:Topic)=>void;stage:number;setStage:(v:number)=>void;reveal:number;setReveal:(v:number)=>void;volume:boolean;ema:boolean;proxy:boolean;focus:number;setFocus:(v:number)=>void}){
 const [left,setLeft]=useState('FREE'),[right,setRight]=useState('FOUNDING_60');
 const a=plans.find(x=>x.code===left)||plans[0],b=plans.find(x=>x.code===right)||plans[3];
 const selector=(value:string,set:(v:string)=>void)=><select aria-label="Comparison membership" value={value} onChange={e=>set(e.target.value)}>{plans.map(x=><option key={x.code} value={x.code}>{x.label}</option>)}</select>;
 return <div className="cx-comparison"><div className="cx-compare-head"><div><div className="cx-overline">PRODUCT DESIGN / EIGHT SOURCE-GROUNDED MEMBERSHIP IDENTITIES</div><h2>Compare member experiences. Not just prices.</h2><p>Membership preview affects the proposed classroom presentation. Chart Studio tier remains a separate hypothetical entitlement. No checkout, account, grade or subscription changes occur.</p></div><span className="cx-chip">SIDE-BY-SIDE INSPECTION</span></div><div className="cx-compare-cols">{[a,b].map((p,i)=><section key={i} className="cx-compare-col"><div className="cx-compare-top"><div className="cx-overline">PREVIEW {i===0?'A':'B'}</div>{selector(i===0?left:right,i===0?setLeft:setRight)}<h3>{p.preset}</h3><p>{p.description}</p><span className="cx-chip">{p.commons?'Founders Commons: benefit documented':'Founders Commons: not asserted'}</span></div><div className="cx-panel"><div className="cx-panel-head"><h3>{topic==='vwap'?'VWAP evidence':'Candlestick evidence'}</h3><span className="cx-chip">FICTIONAL</span></div><EChart kind="price" reveal={reveal} showVolume={volume} showEma={ema} showProxy={proxy} focusBar={focus} onSelect={setFocus} design={design} height={255}/></div><div className="cx-panel"><h3>Learning access quality</h3><Talia topic={topic} step={stage}/><p className="cx-small">The same complete first-principles instruction, guided examples, free explanations, diagnostics, independent assessment protection and retries are used whenever the lesson is accessible.</p></div><Access plan={p} studio={studio}/></section>)}</div><section className="cx-panel"><div className="cx-panel-head"><h3>Illustrative capability scenario matrix</h3><span className="cx-chip">NOT AUTHORIZATION DATA</span></div><div className="cx-matrix"><div>Capability</div><div>{a.label}</div><div>{b.label}</div>{featureRows.map(([title,desc],i)=><React.Fragment key={title}><div><strong>{title}</strong><small>{desc}</small></div><div>{i<2?'Equal quality':i===6?(a.commons?'Documented benefit':'Not asserted'):'Depends on entitlement'}</div><div>{i<2?'Equal quality':i===6?(b.commons?'Documented benefit':'Not asserted'):'Depends on entitlement'}</div></React.Fragment>)}</div></section><div className="cx-panel"><div className="cx-overline">DECISION SUPPORT</div><p>The comparison documents visual differences without making unverified claims about currently purchasable plans or entitlements. Actual access must come from the authoritative server-side product catalog and permission checks.</p></div></div>;
}
function Suite({page}:{page:Page}){
 const [planCode,setPlanCode]=useState('FREE'),[studio,setStudio]=useState<Studio>('Standard'),[design,setDesign]=useState<Design>('quantum');
 const [topic,setTopic]=useState<Topic>('vwap'),[stage,setStage]=useState(2),[reveal,setReveal]=useState(54),[volume,setVolume]=useState(true),[ema,setEma]=useState(true),[proxy,setProxy]=useState(true),[focus,setFocus]=useState(30);
 const [indicatorSettings,setIndicatorSettings]=useState<Record<string,number>>({...defaults});
 const [indicatorEnabled,setIndicatorEnabled]=useState<Record<string,boolean>>({...defaultVisible});
 const setSettings=(key:string,value:number)=>setIndicatorSettings(old=>({...old,[key]:Number.isFinite(value)?value:defaults[key]}));
 const setEnabled=(key:string,value:boolean)=>setIndicatorEnabled(old=>({...old,[key]:value}));
 const indicatorPrefs:IndicatorPrefs={settings:indicatorSettings,enabled:indicatorEnabled,setSettings,setEnabled,
  reset:()=>{setIndicatorSettings({...defaults});setIndicatorEnabled({...defaultVisible})},
  enableAll:()=>setIndicatorEnabled(Object.fromEntries(specs.map(x=>[x.id,true])))};
 const plan=plans.find(x=>x.code===planCode)||plans[0];
 const theme=page==='b'?'quantum':design;
 const safeSetReveal=(v:number)=>{setReveal(v);setFocus(x=>Math.min(x,v-1));};
 const props={plan,studio,design:theme,topic,setTopic,stage,setStage,reveal,setReveal:safeSetReveal,volume,setVolume,ema,setEma,proxy,setProxy,focus:Math.min(focus,reveal-1),setFocus};
 return <IndicatorContext.Provider value={indicatorPrefs}><div className={'cx-app cx-theme-'+design+' cx-page-'+page}>
  <header className="cx-top"><div className="cx-logo"><span className="cx-mark">CL</span><div><span>THE STOCK MARKET: FROM THE GROUND UP</span><strong>CROWNLIGHT / EXPERIENCE LABORATORY</strong></div></div><div className="cx-top-actions"><span>STAFF RESTRICTED</span><a href="/prototype.html">Return to Prototype Center</a></div></header>
  <nav className="cx-pages" aria-label="Three prototype pages">{([['a','OPTION A','Six-design master workbench'],['b','OPTION B','Three flagship applications'],['c','OPTION C','Membership comparison']] as const).map(([k,t,s])=><a key={k} href={'/prototype.html?experience='+k} aria-current={page===k?'page':undefined}><b>{t}</b><small>{s}</small></a>)}</nav>
  <div className="cx-bar"><div><div className="cx-overline">PRODUCT DESIGN EXPERIMENT · 31 OCT 2026</div><h1>{page==='a'?'Six worlds. One professional platform.':page==='b'?'Three premium experiences, engineered.':'Every membership. One coherent learning standard.'}</h1><p>{page==='a'?'Dockable analytical panels, advanced ECharts, six distinct dark design systems and hands-on VWAP/candlestick learning.':page==='b'?'Quantum Command, Aurora Flow and Green/Black are distinct full-screen application compositions, not recolored copies.':'Choose any two of the eight existing membership identities, examine proposed layouts and inspect contingent tool access.'}</p></div><span className="cx-beta">INTERNAL · FICTIONAL · READ ONLY</span></div>
  <div className="cx-controlstrip">
   <label>Membership design preview<select value={planCode} onChange={e=>setPlanCode(e.target.value)}>{plans.map(p=><option value={p.code} key={p.code}>{p.label}</option>)}</select></label>
   <label>Independent Chart Studio preview<select value={studio} onChange={e=>setStudio(e.target.value as Studio)}>{(['Standard','Advanced','Professional'] as Studio[]).map(t=><option key={t}>{t}</option>)}</select></label>
   {page==='a'&&<label>Design system<select value={design} onChange={e=>setDesign(e.target.value as Design)}>{designs.map(d=><option key={d.key} value={d.key}>{d.label}</option>)}</select></label>}
   <label>Teaching topic<select value={topic} onChange={e=>setTopic(e.target.value as Topic)}><option value="vwap">Understand VWAP</option><option value="candle">Build & Understand a Candlestick</option></select></label>
  </div>
  {page==='a'&&<nav className="cx-designs" aria-label="Choose one of six advanced designs">{designs.map((d,i)=><button key={d.key} aria-pressed={design===d.key} onClick={()=>setDesign(d.key)}><i className={'cx-swatch cx-swatch-'+d.key}/><span><small>0{i+1} / DESIGN SYSTEM</small><b>{d.label}</b><small>{d.caption}</small></span></button>)}</nav>}
  <IndicatorDock/>
  <div className="cx-statusline"><span><Icon type="◉"/> {plan.label} · {plan.preset}</span><span>Chart Studio: {studio} (preview only)</span><span>Fictional replay: {reveal} completed candles</span></div>
  {page==='a'?<Workstation {...props}/>:page==='b'?<Flagships {...props}/>:<Compare design={design} studio={studio} topic={topic} setTopic={setTopic} stage={stage} setStage={setStage} reveal={reveal} setReveal={safeSetReveal} volume={volume} ema={ema} proxy={proxy} focus={focus} setFocus={setFocus}/>}
  <footer className="cx-footer"><span>CROWN & LANTERN PRESS / INTERNAL DESIGN STUDY</span><span>REACT · TYPESCRIPT · JAVASCRIPT · HTML5 · CSS3 · APACHE ECHARTS 6.1</span><span>Demo only. Server membership rules unchanged.</span></footer>
 </div></IndicatorContext.Provider>;
}
export function mountExperienceSuite(element:HTMLElement,page:Page):()=>void{
 const root:Root=createRoot(element);root.render(<Suite page={page}/>);return()=>root.unmount();
}
