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
function EChart({kind,reveal,showVolume,showEma,showProxy,focusBar,onSelect,design,height=320}:{kind:ChartKind;reveal:number;showVolume:boolean;showEma:boolean;showProxy:boolean;focusBar:number;onSelect?:(index:number)=>void;design:Design;height?:number}){
 const ref=useRef<HTMLDivElement>(null);
 const inst=useRef<any>(null);
 const onSelectRef=useRef(onSelect);onSelectRef.current=onSelect;
 useEffect(()=>{
  let alive=true;let resize:ResizeObserver|undefined;
  (async()=>{
   try{
    const echarts=await (window as ChartWindow).CrownlightECharts?.load();
    if(!alive||!ref.current||!echarts)return;
    const style=getComputedStyle(ref.current.closest('.cx-app')||ref.current);
    const cv=(k:string,fallback:string)=>style.getPropertyValue(k).trim()||fallback;
    const accent=cv('--cx-accent','#72e0d1'),good=cv('--cx-good','#46d5ad'),bad=cv('--cx-bad','#f27d98'),muted=cv('--cx-muted','#99aebe'),grid=cv('--cx-grid','#294452');
    const bars=dataFor(reveal),names=bars.map(b=>b.time);
    const axis={axisLine:{lineStyle:{color:grid}},axisTick:{show:false},axisLabel:{color:muted,fontSize:10},splitLine:{lineStyle:{color:grid,opacity:.55}}};
    let option:any={animationDuration:280,backgroundColor:'transparent',textStyle:{color:muted,fontFamily:'Inter,system-ui'},tooltip:{trigger:'axis',confine:true,backgroundColor:'#102131',borderColor:grid,textStyle:{color:'#edf7ff'},axisPointer:{type:'cross'}},grid:{left:46,right:12,top:20,bottom:34},xAxis:{type:'category',data:names,...axis,axisLabel:{color:muted,fontSize:9,interval:Math.max(0,Math.floor(reveal/8))}},yAxis:{type:'value',scale:true,...axis},series:[]};
    if(kind==='price'){
      option.grid=showVolume?[{left:48,right:16,top:16,height:'65%'},{left:48,right:16,top:'82%',height:'12%'}]:{left:48,right:16,top:16,bottom:36};
      option.xAxis=showVolume?[{type:'category',data:names,...axis,axisLabel:{color:muted,fontSize:10,interval:Math.max(0,Math.floor(reveal/8))}},{type:'category',data:names,gridIndex:1,axisLabel:{show:false},axisLine:{show:false},axisTick:{show:false}}]:option.xAxis;
      option.yAxis=showVolume?[{type:'value',scale:true,...axis},{type:'value',gridIndex:1,splitLine:{show:false},axisLabel:{show:false},axisLine:{show:false}}]:{type:'value',scale:true,...axis};
      option.dataZoom=[{type:'inside',xAxisIndex:showVolume?[0,1]:[0],start:0,end:100}];
      option.series=[{type:'candlestick',name:'Fictional candles',data:bars.map(b=>[b.o,b.c,b.l,b.h]),itemStyle:{color:good,color0:bad,borderColor:good,borderColor0:bad},barWidth:'64%',markPoint:focusBar>=0&&focusBar<bars.length?{symbol:'circle',symbolSize:7,itemStyle:{color:accent},data:[{coord:[focusBar,bars[focusBar].h],value:''}]}:undefined}];
      if(showEma)option.series.push({type:'line',name:'EMA 9',data:bars.map(b=>b.ema9),showSymbol:false,smooth:true,lineStyle:{color:accent,width:2}},{type:'line',name:'EMA 20',data:bars.map(b=>b.ema20),showSymbol:false,smooth:true,lineStyle:{color:'#e4b76b',width:1.6}});
      if(showProxy)option.series.push({type:'line',name:'OHLCV VWAP proxy',data:bars.map(b=>b.proxy),showSymbol:false,lineStyle:{color:'#879cff',type:'dashed',width:2}});
      if(showVolume)option.series.push({name:'Volume',type:'bar',xAxisIndex:1,yAxisIndex:1,barWidth:'70%',data:bars.map(b=>({value:b.v,itemStyle:{color:b.c>=b.o?good:bad,opacity:.55}}))});
    }else if(kind==='heat'){
      const rows=['Price response','Volume','VWAP proxy','Trend','Momentum','Recognition'];
      const blocks=Array.from({length:12*6},(_,k)=>[k%12,Math.floor(k/12),Math.round(40+55*Math.abs(Math.sin(k*.37+reveal*.04)))]);
      option={...option,tooltip:{position:'top'},visualMap:{show:false,min:0,max:100,inRange:{color:['#203141',accent,'#eedb88']}},grid:{left:90,right:12,top:12,bottom:33},xAxis:{type:'category',data:Array.from({length:12},(_,i)=>'T'+(i+1)),...axis,splitArea:{show:false}},yAxis:{type:'category',data:rows,...axis},series:[{type:'heatmap',data:blocks,label:{show:false},itemStyle:{borderColor:'#0c1723',borderWidth:3}}]};
    }else if(kind==='radar'){
      option={...option,tooltip:{show:true},radar:{indicator:[{name:'Knowledge',max:100},{name:'Recognition',max:100},{name:'Decision',max:100},{name:'Process',max:100},{name:'Review',max:100}],splitLine:{lineStyle:{color:grid}},splitArea:{areaStyle:{color:['transparent']}},axisLine:{lineStyle:{color:grid}},axisName:{color:muted}},series:[{type:'radar',data:[{value:[84,71,67,88,76],name:'Fictional learning record',areaStyle:{color:accent,opacity:.17},lineStyle:{color:accent,width:2},symbol:'circle'}]}]};
    }else if(kind==='equity'){
      const values=Array.from({length:30},(_,i)=>n(10000+i*17+Math.sin(i*.65)*120+Math.cos(i*.2)*170));
      option={...option,xAxis:{type:'category',data:values.map((_,i)=>String(i+1)),...axis},series:[{type:'line',name:'Fictional practice equity',data:values,smooth:.24,showSymbol:false,lineStyle:{color:accent,width:3},areaStyle:{opacity:.16,color:accent}}]};
    }else if(kind==='volume'){
      option={...option,xAxis:{type:'category',data:names,...axis},series:[{type:'bar',name:'Illustrative bar volume',data:bars.map(b=>({value:b.v,itemStyle:{color:b.c>=b.o?good:bad,opacity:.8}}))}]};
    }
    inst.current=echarts.init(ref.current);
    inst.current.setOption(option,true);
    if(kind==='price')inst.current.on('click',(p:any)=>{if(typeof p.dataIndex==='number')onSelectRef.current?.(p.dataIndex)});
    resize=new ResizeObserver(()=>inst.current?.resize());resize.observe(ref.current);
   }catch(e){if(ref.current)ref.current.textContent='Chart unavailable: local ECharts bundle could not initialize.'}
  })();
  return()=>{alive=false;resize?.disconnect();inst.current?.dispose();inst.current=null};
 },[kind,reveal,showVolume,showEma,showProxy,focusBar,design]);
 return <div ref={ref} className="cx-chart" style={{height}} role="img" aria-label={kind==='price'?'Interactive synthetic OHLC candlesticks, optional moving averages, OHLCV proxy and bar volume':kind+' fictional visualization'}/>;
}
const Icon=({type}:{type:string})=><span aria-hidden="true" className="cx-glyph">{type}</span>;
function Talia({topic,step}:{topic:Topic;step:number}){
 const vwap=['Volume Weighted Average Price weights each traded price by its associated share volume.','For 100 shares at $10 and 300 at $11: ($1,000 + $3,300) / 400 = $10.75.','A bar-level typical-price × volume line is only a proxy, not trade-print VWAP.','Above or below VWAP is context—not a prediction or trading signal.'];
 const candle=['Every candle contains open, high, low and close (OHLC).','The real body is |close − open|. Wicks extend from the body to the high and low.','Body / range = |close − open| ÷ (high − low) × 100%.','A long wick is evidence of movement and rejection within the bar, not proof of what comes next.'];
 return <div className="cx-talia"><div className="cx-orb">T</div><div><div className="cx-overline">TALIA MERCER · GUIDED EXPLANATION</div><p>{(topic==='vwap'?vwap:candle)[step%4]}</p><small>Explanations and guided retries are not paywalled when a lesson is accessible.</small></div></div>
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
  <Talia topic={topic} step={stage}/>
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
 return <section className={'cx-flagship cx-flagship-'+which}><div className="cx-flagship-tabs">{([['quantum','01 / Quantum Command'],['aurora','02 / Aurora Learning'],['green','03 / Green / Black Terminal']] as const).map(([k,t])=><button key={k} aria-pressed={k===which} onClick={()=>setWhich(k)}>{t}</button>)}</div><div className="cx-flagship-intro"><div><span className="cx-overline">{which.toUpperCase()} / FLAGSHIP DESIGN SYSTEM</span><h2>{which==='quantum'?'The analytical edge.':which==='aurora'?'Make the market understandable.':'Signal. Structure. Discipline.'}</h2><p>{which==='quantum'?'A high-density multichart cockpit with data-linked research and replay.':which==='aurora'?'A guided education environment where explanations, calculations and chart evidence are always connected.':'A high-contrast operational workstation for focused chart and replay work.'}</p></div><span className="cx-chip">{props.plan.label} · {props.studio} tool preview</span></div>{which==='quantum'?<div className="cx-flagship-quantum"><div className="cx-panel"><div className="cx-panel-head"><h3>Price / participation</h3><span className="cx-chip">SIMULATED</span></div>{chart}</div><div className="cx-panel"><h3>Scenario heatmap</h3><EChart kind="heat" reveal={props.reveal} showVolume={props.volume} showEma={props.ema} showProxy={props.proxy} focusBar={props.focus} design={d} height={270}/><h3>Practice performance</h3><EChart kind="equity" reveal={props.reveal} showVolume={props.volume} showEma={props.ema} showProxy={props.proxy} focusBar={props.focus} design={d} height={170}/></div></div>:which==='aurora'?<div className="cx-flagship-aurora"><div>{lesson}</div><div className="cx-panel"><div className="cx-panel-head"><h3>Chart evidence in context</h3><span className="cx-chip">TEACHING OVERLAY</span></div>{chart}<div className="cx-overline">GUIDED OBSERVATION</div><p>Use the chart to identify a completed candle, then explain the applicable calculation. The OHLCV approximation is never a substitute for trade-print VWAP.</p></div></div>:<div className="cx-flagship-green"><div className="cx-green-ticker"><span>SIM-01 / FICTITIOUS</span><span>{dollars(series[props.reveal-1].c)}</span><span>VOLUME {series[props.reveal-1].v.toLocaleString()}</span><span>NO LIVE ORDERS</span></div><div className="cx-panel cx-black-chart">{chart}<div className="cx-replay"><button onClick={()=>props.setReveal(Math.max(1,props.reveal-1))}>BACK</button><input type="range" min="1" max="96" aria-label="Visible replay bars" value={props.reveal} onChange={e=>props.setReveal(Number(e.target.value))}/><button onClick={()=>props.setReveal(Math.min(96,props.reveal+1))}>FORWARD</button></div></div><div className="cx-green-side"><section className="cx-panel"><h3>Indicator stack</h3><div className="cx-tool-row"><button aria-pressed={props.ema} onClick={()=>props.setEma(!props.ema)}>EMA 9/20</button><button aria-pressed={props.proxy} onClick={()=>props.setProxy(!props.proxy)}>Proxy VWAP</button><button aria-pressed={props.volume} onClick={()=>props.setVolume(!props.volume)}>Volume</button></div><EChart kind="volume" reveal={props.reveal} showVolume={props.volume} showEma={props.ema} showProxy={props.proxy} focusBar={props.focus} design={d} height={230}/></section><section className="cx-panel">{lesson}</section></div></div>}<div className="cx-flagship-bottom"><button aria-pressed={dimension==='chart'} onClick={()=>setDimension('chart')}>Chart diagnostics</button><button aria-pressed={dimension==='lesson'} onClick={()=>setDimension('lesson')}>Instructor view</button><span>{dimension==='chart'?'Visible candles '+props.reveal+'/96 · no future data':'Nine-stage teaching engine · identical instructional quality'}</span></div></section>;
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
 const plan=plans.find(x=>x.code===planCode)||plans[0];
 const theme=page==='b'?'quantum':design;
 const safeSetReveal=(v:number)=>{setReveal(v);setFocus(x=>Math.min(x,v-1));};
 const props={plan,studio,design:theme,topic,setTopic,stage,setStage,reveal,setReveal:safeSetReveal,volume,setVolume,ema,setEma,proxy,setProxy,focus:Math.min(focus,reveal-1),setFocus};
 return <div className={'cx-app cx-theme-'+design+' cx-page-'+page}>
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
  <div className="cx-statusline"><span><Icon type="◉"/> {plan.label} · {plan.preset}</span><span>Chart Studio: {studio} (preview only)</span><span>Fictional replay: {reveal} completed candles</span></div>
  {page==='a'?<Workstation {...props}/>:page==='b'?<Flagships {...props}/>:<Compare design={design} studio={studio} topic={topic} setTopic={setTopic} stage={stage} setStage={setStage} reveal={reveal} setReveal={safeSetReveal} volume={volume} ema={ema} proxy={proxy} focus={focus} setFocus={setFocus}/>}
  <footer className="cx-footer"><span>CROWN & LANTERN PRESS / INTERNAL DESIGN STUDY</span><span>REACT · TYPESCRIPT · JAVASCRIPT · HTML5 · CSS3 · APACHE ECHARTS 6.1</span><span>Demo only. Server membership rules unchanged.</span></footer>
 </div>;
}
export function mountExperienceSuite(element:HTMLElement,page:Page):()=>void{
 const root:Root=createRoot(element);root.render(<Suite page={page}/>);return()=>root.unmount();
}
