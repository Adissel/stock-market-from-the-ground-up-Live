/** Public fictional OHLCV chart only; member chart data and private state never enter this component. */
import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
type Study='all'|'ema9'|'ema20'|'vwap'|'sma20'|'none';
type Bar={open:number;close:number;low:number;high:number;volume:number};
type Chart={setOption:(v:unknown,replace?:boolean)=>void;resize:()=>void;dispose:()=>void;dispatchAction:(v:unknown)=>void};
type EmbeddedTerminalControl={pause?:()=>void;resume?:()=>void};
type EmbeddedTerminalSession={pause:()=>void;resume:()=>void;dispose:()=>void};
declare global{interface Window{
 CrownlightECharts?:{load:()=>Promise<{init:(node:HTMLElement)=>Chart}>};
 CrownlightHomeMarketTerminal?:{mountInto:(target:HTMLElement,options?:{context?:'lab'|'bootcamp';startPaused?:boolean;checkpointLocked?:boolean})=>EmbeddedTerminalSession|null};
}}
/** Original, deterministic 1-minute fictional tape. Volatility clusters, thin
 * consolidations, gaps, breakout spikes, retraces and uneven volume deliberately
 * resemble the shape (not prices or provenance) of educational market examples.
 * Never reverse-engineered from uploaded screenshots or licensed price feeds.
 */
const DATA:Bar[]=(()=>{
 const bars:Bar[]=[];let prior=48.26,seed=773217;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const regimes=[
  {end:19,drift:0.025,vol:0.075},{end:38,drift:0.009,vol:0.042},
  {end:58,drift:-0.035,vol:0.096},{end:76,drift:-0.008,vol:0.049},
  {end:91,drift:0.049,vol:0.112},{end:110,drift:0.004,vol:0.041},
  {end:130,drift:-0.052,vol:0.105},{end:150,drift:0.031,vol:0.064}
 ];
 for(let i=0;i<150;i++){
  const r=regimes.find(x=>i<x.end)||regimes[regimes.length-1];
  const open=Math.max(0.1,prior+(random()-.5)*r.vol*0.48);
  const surprise=(random()+random()+random()-1.5)*r.vol*2.8;
  const spike=i===17?0.52:i===60?-0.41:i===88?0.73:i===112?-0.69:i===137?0.35:0;
  const close=Math.max(0.1,open+r.drift+surprise+spike);
  const upper=(0.014+random()*.065+r.vol*random()*.85)*(i===88?1.8:1);
  const lower=(0.012+random()*.058+r.vol*random()*.85)*(i===112?1.8:1);
  const high=Math.max(open,close)+upper;
  const low=Math.max(.01,Math.min(open,close)-lower);
  const activity=(i<19?1.4:i>=85&&i<98?1.9:i>=110&&i<135?1.6:1);
  const volume=Math.max(20,Math.round((110+random()*700+Math.abs(close-open)*2600+
   (Math.abs(spike)>0?3200:0))*activity));
  bars.push({open:+open.toFixed(4),close:+close.toFixed(4),
   high:+high.toFixed(4),low:+low.toFixed(4),volume});
  prior=close;
 }
 return bars;
})();
function moving(bars:Bar[],period:number,method:'ema'|'sma'){let state=0;return bars.map((b,i)=>{if(i<period-1)return null;if(i===period-1)state=bars.slice(0,period).reduce((sum,x)=>sum+x.close,0)/period;else if(method==='ema')state=(2/(period+1))*b.close+(1-2/(period+1))*state;else state=bars.slice(i-period+1,i+1).reduce((sum,x)=>sum+x.close,0)/period;return +state.toFixed(3)})}
function barProxyVWAP(bars:readonly Bar[]):(number|null)[]{
 let amount=0,quantity=0;
 return bars.map(b=>{if(b.volume<=0)return quantity?+(amount/quantity).toFixed(3):null;
  amount+=((b.high+b.low+b.close)/3)*b.volume;
  quantity+=b.volume;return +(amount/quantity).toFixed(3)});
}
/** Exact-bar public tooltip. No HTML from members or market-data providers is used. */
function marketTooltip(params:unknown,bars:readonly Bar[],indicator:readonly (number|null)[],study:Study):string{
 const points=Array.isArray(params)?params:[params];
 const match=points.find((x):x is {dataIndex:number}=>x!==null&&typeof x==='object'&&Number.isInteger((x as {dataIndex?:unknown}).dataIndex));
 const index=match?.dataIndex;
 if(index===undefined||index<0||index>=bars.length)return '';
 const bar=bars[index];
 if(!bar||![bar.open,bar.high,bar.low,bar.close,bar.volume].every(Number.isFinite))return '';
 const price=(value:number)=>value.toFixed(2);
 const up=bar.close>=bar.open;
 const color=up?'#37d7ad':'#fb7b90';
 const rows:[string,number][]=[['Open',bar.open],['High',bar.high],['Low',bar.low],['Close',bar.close]];
 const cells=rows.map(([name,value])=>`<div class="cl-market-tooltip-row"><span>${name}</span><strong>${price(value)}</strong></div>`).join('');
 const observed=indicator[index];
 const indicatorRow=study!=='none'&&observed!==null&&Number.isFinite(observed)?
  `<div class="cl-market-tooltip-row cl-market-tooltip-study"><span>${study==='ema9'?'EMA 9':'SMA 20'}</span><strong>${price(observed)}</strong></div>`:'';
 return `<div class="cl-market-tooltip"><div class="cl-market-tooltip-heading"><span>Candle B${String(index+1).padStart(2,'0')}</span><span style="color:${color}">Fictional</span></div>${cells}<div class="cl-market-tooltip-row"><span>Volume</span><strong>${Math.round(bar.volume).toLocaleString('en-US')}</strong></div>${indicatorRow}</div>`;
}

/** Intracandle simulation: every observation is exposed only when its playback tick occurs.
 * The fictional finished OHLCV is a private input to this generator, never passed to the
 * chart, indicator, tooltip, or keyboard inspector before the candle actually forms.
 */
type Frame=1|3|5;
const TICKS_PER_MINUTE=20;
const FIRST_REPLAY_MINUTE=0; // The initial frame contains exactly one forming candle, no historical pre-roll.
const TICK_MS=160; // Demonstration playback is deliberately compressed, not wall-clock exchange time.
function partialMinute(index:number,ticks:number):Bar{
 const b=DATA[index],n=Math.max(0,Math.min(TICKS_PER_MINUTE,Math.floor(ticks)));
 const first=index%2===0?b.low:b.high,second=index%2===0?b.high:b.low;
 const points=[b.open,(b.open+first)/2,first,(first+second)/2,second,(second+b.close)/2,b.close];
 const steps=[0,3,7,10,14,17,TICKS_PER_MINUTE];
 let high=b.open,low=b.open,close=b.open;
 for(let k=1;k<=n;k++){
  let j=0;while(j<steps.length-2&&k>steps[j+1])j++;
  const t=(k-steps[j])/(steps[j+1]-steps[j]);
  close=points[j]+(points[j+1]-points[j])*t;
  high=Math.max(high,close);low=Math.min(low,close);
 }
 return {open:b.open,high,low,close,volume:n===TICKS_PER_MINUTE?b.volume:Math.floor(b.volume*n/TICKS_PER_MINUTE)};
}
function groupMinutes(minutes:readonly Bar[],frame:Frame):Bar[]{
 const result:Bar[]=[];
 for(let i=0;i<minutes.length;i+=frame){
  const g=minutes.slice(i,i+frame);
  if(!g.length)continue;
  result.push({open:g[0].open,close:g[g.length-1].close,
   high:Math.max(...g.map(b=>b.high)),low:Math.min(...g.map(b=>b.low)),
   volume:g.reduce((v,b)=>v+b.volume,0)});
 }
 return result;
}
function revealedBars(frame:Frame,position:number):Bar[]{
 const first=Math.floor(FIRST_REPLAY_MINUTE/frame)*frame;
 const end=(DATA.length-first)*TICKS_PER_MINUTE;
 const safe=Math.max(0,Math.min(end,Math.floor(position)));
 const minutes=DATA.slice(0,first+Math.floor(safe/TICKS_PER_MINUTE));
 const next=first+Math.floor(safe/TICKS_PER_MINUTE);
 if(next<DATA.length)minutes.push(partialMinute(next,safe%TICKS_PER_MINUTE));
 return groupMinutes(minutes,frame);
}
function Terminal({context='home',startPaused=false,checkpointLocked=false,embedded}:{
 context?:'home'|'lab'|'bootcamp';startPaused?:boolean;checkpointLocked?:boolean;embedded?:EmbeddedTerminalControl
}){
 const host=useRef<HTMLDivElement>(null);
 const [study,setStudy]=useState<Study>('all');
 const [windowSize,setWindowSize]=useState(60);
 const [view,setView]=useState<'candles'|'line'>('candles');
 const [frame,setFrame]=useState<Frame>(1);
 const [speed,setSpeed]=useState(context==='home'?0.1:1);
 const homeSpeed=useRef(0.1);
 const [displaySpeed,setDisplaySpeed]=useState(0.1);
 const [playing,setPlaying]=useState(()=>!startPaused&&!checkpointLocked&&!(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches));
 const [note,setNote]=useState('Fictional simulation · Not real-time market data');
 const [progress,setProgress]=useState('Preparing fictional candle replay…');
 const chartInstance=useRef<Chart|null>(null);
 const playhead=useRef(1);
 const isPublicHome=context==='home';
 useEffect(()=>{
  if(!embedded)return;
  embedded.pause=()=>setPlaying(false);
  embedded.resume=()=>{if(!checkpointLocked)setPlaying(true)};
  return()=>{delete embedded.pause;delete embedded.resume};
 },[embedded,checkpointLocked]);
 useEffect(()=>{if(checkpointLocked)setPlaying(false)},[checkpointLocked]);
 const shown=useRef<Bar[]>([]);
 const focusIndex=useRef(0);
 const settings=useRef({study,windowSize,view,frame});
 settings.current={study,windowSize,view,frame};
 const inspect=(key:string)=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(key))return false;
  const bars=shown.current;if(!bars.length)return false;
  let next=focusIndex.current;
  if(key==='Home')next=0;else if(key==='End')next=bars.length-1;
  else next=Math.max(0,Math.min(bars.length-1,next+(key==='ArrowRight'?1:-1)));
  focusIndex.current=next;
  const bar=bars[next];
  chartInstance.current?.dispatchAction({type:'showTip',seriesIndex:0,dataIndex:next});
  setNote('Fictional B'+String(next+1).padStart(2,'0')+' · Open '+bar.open.toFixed(2)+' · High '+bar.high.toFixed(2)+' · Low '+bar.low.toFixed(2)+' · Close '+bar.close.toFixed(2));
  return true;
 };
 function paint(initial=false){
  const chart=chartInstance.current;if(!chart)return;
  const cfg=settings.current,bars=revealedBars(cfg.frame,playhead.current);
  shown.current=bars;focusIndex.current=Math.min(focusIndex.current,bars.length-1);
  const rightBuffer=bars.length<12?12:8;
  const labels=bars.map((_,i)=>'B'+String(i+1).padStart(2,'0'))
   .concat(Array.from({length:rightBuffer},()=> ' '));
  const padding=Array(rightBuffer).fill('-');
  const ema9=moving(bars,9,'ema'),ema20=moving(bars,20,'ema');
  const sma20=moving(bars,20,'sma'),vwap=barProxyVWAP(bars);
  const indicator=cfg.study==='sma20'?sma20:cfg.study==='ema20'?ema20:cfg.study==='vwap'?vwap:ema9;
  const show=(id:Study)=>cfg.study==='all'||cfg.study===id;
  const series=[
   {type:cfg.view==='candles'?'candlestick':'line',name:'Fictional market',
    data:bars.map(b=>cfg.view==='candles'?[b.open,b.close,b.low,b.high]:+b.close.toFixed(3)).concat(padding as never[]),
    barMaxWidth:9,barMinWidth:2,smooth:false,showSymbol:false,lineStyle:{color:'#10cdaa',width:1.7},
    itemStyle:{color:'#08c69d',color0:'#e32d55',borderColor:'#08c69d',borderColor0:'#e32d55'}},
   ...(show('ema9')?[{type:'line',name:'EMA 9',data:ema9.concat(padding as never[]),
    showSymbol:false,connectNulls:false,lineStyle:{color:'#8bf100',width:1.3},z:3}]:[]),
   ...(show('ema20')?[{type:'line',name:'EMA 20',data:ema20.concat(padding as never[]),
    showSymbol:false,connectNulls:false,lineStyle:{color:'#ff3356',width:1.3},z:3}]:[]),
   ...(cfg.study==='sma20'?[{type:'line',name:'SMA 20',data:sma20.concat(padding as never[]),
    showSymbol:false,connectNulls:false,lineStyle:{color:'#efd074',width:1.4},z:3}]:[]),
   ...(show('vwap')?[{type:'line',name:'Bar-based VWAP proxy',data:vwap.concat(padding as never[]),
    showSymbol:false,connectNulls:false,lineStyle:{color:'#ffbd25',width:1.4},z:3}]:[]),
   {type:'bar',name:'Fictional volume',xAxisIndex:1,yAxisIndex:1,barMaxWidth:9,
    data:bars.map(bar=>({value:bar.volume,itemStyle:{color:bar.close>=bar.open?'#18a584':'#d94c6a'}}))
     .concat(padding.map(()=>({value:0,itemStyle:{color:'transparent'}})))}
  ];
  const tooltip={trigger:'axis',axisPointer:{type:'cross'},confine:true,appendToBody:false,
   backgroundColor:'#102638',borderColor:'#4b687f',textStyle:{color:'#e8f4f8'},
   formatter:(params:unknown)=>marketTooltip(params,bars,indicator,cfg.study)};
  if(initial){
   chart.setOption({animation:false,backgroundColor:'transparent',
    grid:[{left:50,right:20,top:25,height:'64%'},{left:50,right:20,top:'77%',height:'12%'}],
    tooltip,legend:{show:false},
    xAxis:[{type:'category',data:labels,axisLine:{lineStyle:{color:'#3b5266'}},axisLabel:{color:'#96b3c5',interval:9}},
      {type:'category',gridIndex:1,data:labels,axisLabel:{show:false}}],
    yAxis:[{scale:true,axisLabel:{color:'#9db4c5'},splitLine:{lineStyle:{color:'rgba(121,163,188,.16)'}}},
      {gridIndex:1,axisLabel:{show:false},splitLine:{show:false}}],
    dataZoom:[{type:'inside',xAxisIndex:[0,1],start:bars.length<=32?0:100-cfg.windowSize,end:100,zoomOnMouseWheel:true,moveOnMouseMove:true,moveOnMouseWheel:false},
      {type:'slider',xAxisIndex:[0,1],start:bars.length<=32?0:100-cfg.windowSize,end:100,bottom:3,height:13}],series},true);
  }else{
   // Merge incremental series updates: keep the visitor's zoom and horizontal pan.
   chart.setOption({tooltip,xAxis:[{data:labels},{data:labels}],series},false);
  }
  const first=Math.floor(FIRST_REPLAY_MINUTE/cfg.frame)*cfg.frame;
  const max=(DATA.length-first)*TICKS_PER_MINUTE;
  const active=bars[bars.length-1];
  const pct=Math.round(100*(playhead.current%(cfg.frame*TICKS_PER_MINUTE))/(cfg.frame*TICKS_PER_MINUTE));
  setProgress((playhead.current>=max?'Replay complete':'Forming B'+String(bars.length).padStart(2,'0')+' · '+pct+'%')+
   (active?' · O '+active.open.toFixed(2)+' H '+active.high.toFixed(2)+' L '+active.low.toFixed(2)+' C '+active.close.toFixed(2)+' · Vol '+active.volume.toLocaleString('en-US'):''));
 }
 useEffect(()=>{
  let chart:Chart|undefined,observer:ResizeObserver|undefined,disposed=false;
  const start=async()=>{
   try{
    if(!window.CrownlightECharts?.load){
     await new Promise<void>((resolve,reject)=>{
      const script=document.createElement('script');script.src='/assets/js/crownlight-echarts-loader-v1.js';
      script.onload=()=>resolve();script.onerror=()=>reject(Error('ECharts loader missing'));document.head.append(script);
     });
    }
    const api=await window.CrownlightECharts?.load();
    if(!api||!host.current||disposed)throw Error('Chart library unavailable');
    chart=api.init(host.current);chartInstance.current=chart;
    paint(true);
    observer=new ResizeObserver(()=>chart?.resize());observer.observe(host.current);
    setNote('Interactive fictional OHLCV · Forming candles · Wheel to zoom · Drag to pan');
   }catch{if(!disposed)setNote('Interactive library unavailable. Open Chart Studio for practice.')}
  };
  void start();
  return()=>{disposed=true;observer?.disconnect();chart?.dispose();if(chartInstance.current===chart)chartInstance.current=null};
 },[study,windowSize,view,frame]);
 useEffect(()=>{
  if(!playing)return;
  let carry=0,last=performance.now();
  const timer=window.setInterval(()=>{
   const now=performance.now(),elapsed=Math.min(400,now-last);last=now;
   if(document.hidden)return;
   const actualSpeed=isPublicHome?(Math.floor(playhead.current/TICKS_PER_MINUTE)%2===0?0.1:0.5):speed;
   if(isPublicHome&&homeSpeed.current!==actualSpeed){homeSpeed.current=actualSpeed;setDisplaySpeed(actualSpeed);}
   carry+=elapsed*actualSpeed;
   const steps=Math.floor(carry/TICK_MS);
   if(steps<1)return;
   carry-=steps*TICK_MS;
   const first=Math.floor(FIRST_REPLAY_MINUTE/frame)*frame;
   const end=(DATA.length-first)*TICKS_PER_MINUTE;
   playhead.current=Math.min(end,playhead.current+steps);
   paint();
   if(playhead.current>=end){setPlaying(false);setNote('Fictional replay completed. Choose Replay to start again.')}
  },60);
  return()=>window.clearInterval(timer);
 },[playing,speed,frame,isPublicHome]);
 const changeFrame=(value:Frame)=>{if(checkpointLocked)return;playhead.current=1;setFrame(value);setPlaying(true);setNote('Fictional '+value+'-minute replay · Intracandle movement is compressed for demonstration.')};
 const restart=()=>{if(checkpointLocked)return;playhead.current=1;paint();setPlaying(true);setNote('Fictional replay restarted. No live market feed.')};
 return <div className="cl-react-terminal">
  <div className="cl-react-toolbar">
   <span className="cl-react-title">CROWNLIGHT <small>{context==='home'?'TRAINING TERMINAL':'LAB & BOOT CAMP MARKET REPLAY'}</small></span>
   <label>Chart <select value={view} onChange={e=>setView(e.target.value as 'candles'|'line')}><option value="candles">Candlesticks</option><option value="line">Line</option></select></label>
   <label>Indicator <select value={study} onChange={e=>setStudy(e.target.value as Study)}>
   <option value="all">EMA 9 / EMA 20 / VWAP proxy</option><option value="ema9">EMA 9</option>
   <option value="ema20">EMA 20</option><option value="vwap">VWAP proxy</option>
   <option value="sma20">SMA 20</option><option value="none">None</option></select></label>
   <label>History <select value={windowSize} onChange={e=>setWindowSize(Number(e.target.value))}><option value={30}>30%</option><option value={60}>60%</option><option value={100}>All</option></select></label>
   <label>Timeframe <select value={frame} onChange={e=>changeFrame(Number(e.target.value) as Frame)}><option value={1}>1m</option><option value={3}>3m</option><option value={5}>5m</option></select></label>
   {isPublicHome?<div className="cl-react-home-speed" role="status" aria-label="Homepage automatically alternates replay speed">
   Auto speed <strong>{displaySpeed.toFixed(1)}×</strong><small>0.1× ↔ 0.5× per completed candle</small>
  </div>:<label>Replay speed <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}>
   <option value={0.1}>0.1×</option><option value={0.5}>0.5×</option>
   <option value={1}>1×</option><option value={3}>3×</option></select></label>}
   <div className="cl-react-playback"><button type="button" disabled={checkpointLocked} onClick={()=>setPlaying(x=>!x)}
    aria-label={playing?'Pause fictional candle formation':'Resume fictional candle formation'}>{playing?'Pause':'Resume'}</button>
    <button type="button" disabled={checkpointLocked} onClick={restart}>Replay</button></div>
  </div>
  <div ref={host} className="cl-react-plot" role="region" tabIndex={0} onKeyDown={event=>{if(inspect(event.key))event.preventDefault()}}
   aria-label="Interactive fictional OHLCV training chart. Press Left or Right arrow to inspect a candle, Home for first candle, End for last candle; mouse wheel to zoom."/>
  <div className="cl-react-progress" aria-live="off"><span>{checkpointLocked?'Playback paused for the Lab calculation checkpoint. Finish the ungraded method check to continue.':progress}</span>
   <small>Fictional one-minute OHLCV; every replay starts with one forming candle. EMA 9 (green), EMA 20 (red), bar-based VWAP proxy (gold, not trade-print VWAP). No live or licensed market feed.</small></div>
  <div className="cl-react-bottom"><span role="status">{note}</span><a href="/simulator.html">Open full Chart Studio</a></div>
 </div>;
}
/** Keep the original linked SVG available until the compiled chart is ready.
 * The current homepage uses a canonical .gu-home-terminal hero rather than the
 * older .sm-v5-chart hero, so mount into either surface without replacing copy,
 * membership controls, or the rest of the homepage.
 */
function resolveHomeChartHost():HTMLElement|null{
 const existing=document.querySelector<HTMLElement>('.sm-v5-chart');
 if(existing)return existing;
 const linked=document.querySelector<HTMLAnchorElement>('main.gu-premium-home a.gu-home-terminal');
 if(!linked)return null;
 const host=document.createElement('div');
 host.className='gu-home-terminal sm-v5-chart';
 host.setAttribute('role','group');
 host.setAttribute('aria-label','Interactive fictional OHLCV training workstation');
 linked.replaceWith(host);
 return host;
}
// The exact homepage ECharts experience is embedded only by an authorized
// Lab or Academy lesson host. It never reads membership, progress or hidden
// historical bars; it uses the existing public fictional dataset.
const embeddedRoots=new WeakMap<HTMLElement,EmbeddedTerminalSession>();
function mountInto(target:HTMLElement,options?:{context?:'lab'|'bootcamp';startPaused?:boolean;checkpointLocked?:boolean}):EmbeddedTerminalSession|null{
 if(!target||typeof target.replaceChildren!=='function'||!target.isConnected)return null;
 embeddedRoots.get(target)?.dispose();
 const controller:EmbeddedTerminalControl={};
 const root=createRoot(target);
 let disposed=false;
 const session:EmbeddedTerminalSession={
  pause(){if(!disposed)controller.pause?.()},
  resume(){if(!disposed)controller.resume?.()},
  dispose(){if(disposed)return;disposed=true;root.unmount();target.replaceChildren();if(embeddedRoots.get(target)===session)embeddedRoots.delete(target)}
 };
 embeddedRoots.set(target,session);
 root.render(<Terminal context={options?.context==='bootcamp'?'bootcamp':'lab'}
   startPaused={options?.startPaused===true} checkpointLocked={options?.checkpointLocked===true} embedded={controller}/>);
 return session;
}
window.CrownlightHomeMarketTerminal=Object.freeze({mountInto});
function mount(){const host=resolveHomeChartHost();if(!host||host.hasAttribute('data-react-terminal'))return;host.setAttribute('data-react-terminal','true');host.replaceChildren();createRoot(host).render(<Terminal/>);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
