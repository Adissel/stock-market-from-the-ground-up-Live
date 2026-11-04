/** Public fictional OHLCV chart only; member chart data and private state never enter this component. */
import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
type Study='ema9'|'sma20'|'none';
type Bar={open:number;close:number;low:number;high:number;volume:number};
type Chart={setOption:(v:unknown,replace?:boolean)=>void;resize:()=>void;dispose:()=>void;dispatchAction:(v:unknown)=>void};
declare global{interface Window{CrownlightECharts?:{load:()=>Promise<{init:(node:HTMLElement)=>Chart}>}}}
const DATA:Bar[]=Array.from({length:90},(_,i)=>{const trend=85+0.15*i+3*Math.sin(i*.22)+Math.cos(i*.68);const open=trend-.8*Math.sin(i*1.1),close=trend+.9*Math.cos(i*.9);return {open,close,low:Math.min(open,close)-.4-(i%4)*.16,high:Math.max(open,close)+.55+(i%3)*.18,volume:120+(i*31)%285}});
function moving(bars:Bar[],period:number,method:'ema'|'sma'){let state=0;return bars.map((b,i)=>{if(i<period-1)return null;if(i===period-1)state=bars.slice(0,period).reduce((sum,x)=>sum+x.close,0)/period;else if(method==='ema')state=(2/(period+1))*b.close+(1-2/(period+1))*state;else state=bars.slice(i-period+1,i+1).reduce((sum,x)=>sum+x.close,0)/period;return +state.toFixed(3)})}
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
function Terminal(){const host=useRef<HTMLDivElement>(null);const [study,setStudy]=useState<Study>('ema9');const [windowSize,setWindowSize]=useState(60);const [view,setView]=useState<'candles'|'line'>('candles');const [note,setNote]=useState('Fictional simulation · Not real-time market data');const chartInstance=useRef<Chart|null>(null);const focusIndex=useRef(DATA.length-1);
const inspect=(key:string)=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(key))return false;
 let next=focusIndex.current;
 if(key==='Home')next=0;else if(key==='End')next=DATA.length-1;
 else next=Math.max(0,Math.min(DATA.length-1,next+(key==='ArrowRight'?1:-1)));
 focusIndex.current=next;
 const b=DATA[next];
 chartInstance.current?.dispatchAction({type:'showTip',seriesIndex:0,dataIndex:next});
 setNote('Fictional B'+String(next+1).padStart(2,'0')+' · Open '+b.open.toFixed(2)+' · High '+b.high.toFixed(2)+' · Low '+b.low.toFixed(2)+' · Close '+b.close.toFixed(2));
 return true;
};
useEffect(()=>{let chart:Chart|undefined;let observer:ResizeObserver|undefined;let disposed=false;const start=async()=>{try{if(!window.CrownlightECharts?.load){await new Promise<void>((resolve,reject)=>{const script=document.createElement('script');script.src='/assets/js/crownlight-echarts-loader-v1.js';script.onload=()=>resolve();script.onerror=()=>reject(Error('ECharts loader missing'));document.head.append(script)})}const api=await window.CrownlightECharts?.load();if(!api||!host.current||disposed)throw Error('Chart library unavailable');chart=api.init(host.current);chartInstance.current=chart;const labels=DATA.map((_,i)=>'B'+String(i+1).padStart(2,'0'));const line=study==='ema9'?moving(DATA,9,'ema'):study==='sma20'?moving(DATA,20,'sma'):[];chart.setOption({animation:false,backgroundColor:'transparent',grid:[{left:50,right:20,top:25,height:'64%'},{left:50,right:20,top:'77%',height:'12%'}],tooltip:{trigger:'axis',axisPointer:{type:'cross'},confine:true,appendToBody:false,backgroundColor:'#102638',borderColor:'#4b687f',textStyle:{color:'#e8f4f8'},formatter:(params:unknown)=>marketTooltip(params,DATA,line,study)},legend:{show:false},xAxis:[{type:'category',data:labels,axisLine:{lineStyle:{color:'#3b5266'}},axisLabel:{color:'#96b3c5',interval:9}},{type:'category',gridIndex:1,data:labels,axisLabel:{show:false}}],yAxis:[{scale:true,axisLabel:{color:'#9db4c5'},splitLine:{lineStyle:{color:'rgba(121,163,188,.16)'}}},{gridIndex:1,axisLabel:{show:false},splitLine:{show:false}}],dataZoom:[{type:'inside',xAxisIndex:[0,1],start:100-windowSize,end:100,zoomOnMouseWheel:true,moveOnMouseMove:true,moveOnMouseWheel:false},{type:'slider',xAxisIndex:[0,1],start:100-windowSize,end:100,bottom:3,height:13}],series:[{type:view==='candles'?'candlestick':'line',name:'Fictional market',data:DATA.map(b=>view==='candles'?[b.open,b.close,b.low,b.high]:+b.close.toFixed(3)),smooth:false,showSymbol:false,lineStyle:{color:'#58d6c8',width:2},itemStyle:{color:'#37c7aa',color0:'#e36d79',borderColor:'#37c7aa',borderColor0:'#e36d79'}},{type:'line',name:study==='ema9'?'EMA 9':'SMA 20',data:line,showSymbol:false,connectNulls:false,lineStyle:{color:'#ecc888',width:2},z:3},{type:'bar',name:'Fictional volume',xAxisIndex:1,yAxisIndex:1,data:DATA.map(b=>({value:b.volume,itemStyle:{color:b.close>=b.open?'#2da98f':'#be6570'}}))}]},true);observer=new ResizeObserver(()=>chart?.resize());observer.observe(host.current);setNote('Interactive fictional OHLCV · Mouse wheel to zoom · Drag to pan');}catch{if(!disposed)setNote('Interactive library unavailable. Open Chart Studio for practice.')}};void start();return()=>{disposed=true;observer?.disconnect();chart?.dispose();if(chartInstance.current===chart)chartInstance.current=null}},[study,windowSize,view]);
return <div className="cl-react-terminal"><div className="cl-react-toolbar"><span className="cl-react-title">CROWNLIGHT <small>TRAINING TERMINAL</small></span><label>Chart <select value={view} onChange={e=>setView(e.target.value as 'candles'|'line')}><option value="candles">Candlesticks</option><option value="line">Line</option></select></label><label>Indicator <select value={study} onChange={e=>setStudy(e.target.value as Study)}><option value="ema9">EMA 9</option><option value="sma20">SMA 20</option><option value="none">None</option></select></label><label>History <select value={windowSize} onChange={e=>setWindowSize(Number(e.target.value))}><option value={30}>30%</option><option value={60}>60%</option><option value={100}>All</option></select></label></div><div ref={host} className="cl-react-plot" role="region" tabIndex={0} onKeyDown={event=>{if(inspect(event.key))event.preventDefault()}} aria-label="Interactive fictional OHLCV training chart. Press Left or Right arrow to inspect a candle, Home for first candle, End for last candle; mouse wheel to zoom."/><div className="cl-react-bottom"><span role="status">{note}</span><a href="/simulator.html">Open full Chart Studio</a></div></div>}
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
function mount(){const host=resolveHomeChartHost();if(!host||host.hasAttribute('data-react-terminal'))return;host.setAttribute('data-react-terminal','true');host.replaceChildren();createRoot(host).render(<Terminal/>);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
