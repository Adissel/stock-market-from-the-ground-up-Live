/* SMFGU-TALIA-CHAT-001 v1.0
 * React/TypeScript member classroom. New presentation only: ALL Tutor replies,
 * access decisions, source retrieval, quotas and history remain server-owned.
 * No provider call, broker execution, official grade or private rubric access.
 */
import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ClassicClassroomChart} from '../prototype/PrototypeExperiences';

type Mode='explain'|'question'|'review'|'practice';
type TeachingDepth='FOUNDATION'|'ADVANCED'|'PROFESSIONAL'|'ENTERPRISE';
type LessonPhase='explain'|'demonstrate'|'practice'|'correct'|'transfer';
type CurriculumAccess={maximumDepth:TeachingDepth;allowedDepths:TeachingDepth[];
 lessons:Array<{id:string;title:string;chart:boolean;objective?:string;evidence?:string;limitation?:string}>;ok:true};
type ChatLine={id:string;who:'member'|'talia';text:string;label?:string};
type Member={id:string;access:string};
type SupabaseSession={access_token:string;user:{id:string}};
type AuthClient={
  auth:{
    getUser:()=>Promise<{data:{user:{id:string}|null}}>;
    getSession:()=>Promise<{data:{session:SupabaseSession|null}}>;
    onAuthStateChange:(fn:(event:string,session:SupabaseSession|null)=>void)=>{data:{subscription:{unsubscribe:()=>void}}}
  }
};
type ChartInstance={
  setOption:(value:unknown,options?:unknown)=>void;
  on:(event:string,cb:(event:{dataIndex?:number})=>void)=>void;
  dispose:()=>void;
  resize:()=>void;
  getOption?:()=>{dataZoom?:Array<{start?:number;end?:number}>};
  dispatchAction?:(action:unknown)=>void
};
type ChartApi={init:(el:HTMLElement,theme?:string,opts?:object)=>ChartInstance;connect?:(group:string)=>void};
declare global{
  interface Window{
    getSupabaseClient:()=>Promise<AuthClient>;
    CrownlightECharts?:{load:()=>Promise<ChartApi>};
  }
}
const DEFAULT:ChatLine[]=[{id:'welcome',who:'talia',text:'Welcome. I am Talia, your market-learning instructor. Ask a concept question, request a worked example, or explain your reasoning. We will use reviewed educational material and fictional practice, not trading predictions.'}];
const EXAMPLES=[
  'Explain candlestick open, high, low and close from first principles.',
  'Teach VWAP and explain why bar-based VWAP differs from trade-print VWAP.',
  'Try another original fictional EMA 9 and EMA 20 example.',
  'What makes choosing NO TRADE a defensible decision?'
];
const REPLAY:number[][]=[
  [20,20.16,19.90,20.27],[20.16,20.25,20.04,20.34],
  [20.25,20.12,20.02,20.32],[20.12,20.40,20.08,20.48],
  [20.40,20.35,20.27,20.55],[20.35,20.62,20.29,20.71],
  [20.62,20.58,20.44,20.73],[20.58,20.79,20.52,20.91],
  [20.79,20.85,20.71,20.96],[20.85,20.66,20.60,20.94],
  [20.66,20.49,20.40,20.73],[20.49,20.57,20.43,20.65]
];
// Original deterministic synthetic observations, not a feed, protected replay or grade.
for(let i=0;i<248;i++){
 const previous=REPLAY[REPLAY.length-1][1];
 const close=Number((previous+0.038*Math.sin(i*0.37)+0.027*Math.cos(i*0.13)-(i%19===0?0.055:0)).toFixed(2));
 const high=Number((Math.max(previous,close)+0.03+(i%4)*0.01).toFixed(2));
 const low=Number((Math.min(previous,close)-0.03-(i%3)*0.01).toFixed(2));
 REPLAY.push([previous,close,low,high]);
}
const syntheticVolume=(bar:number[],index:number)=>200+Math.round(Math.abs(bar[1]-bar[0])*3700)+index*17;
function aggregateCompleted(rows:number[][],minutes:1|3|5){
 if(minutes===1)return rows;
 const groups:number[][]=[];
 for(let i=0;i+minutes<=rows.length;i+=minutes){
  const batch=rows.slice(i,i+minutes);
  groups.push([batch[0][0],batch[minutes-1][1],Math.min(...batch.map(r=>r[2])),Math.max(...batch.map(r=>r[3]))]);
 }
 return groups;
}
const isTaliaPrototypePath=()=>window.location.pathname.endsWith('/talia-tutor-prototype.html')||window.location.pathname.endsWith('/talia-tutor-prototype');
const isTaliaClassroomPath=()=>window.location.pathname.endsWith('/talia-classroom.html')||window.location.pathname.endsWith('/talia-classroom');
const isTaliaAdvancedRoute=()=>isTaliaPrototypePath()||isTaliaClassroomPath();
const initialQuestion=()=>new URLSearchParams(location.search).get('q')?.slice(0,450)||'';
/* Public canonical IDs and stage hints only. Server independently checks the
 * registered Lab and the member entitlement; never forward lesson answers. */
const labHandoff=(()=>{
  const params=new URLSearchParams(location.search);
  const id=(params.get('lab')||'').toUpperCase();
  const stage=params.get('stage')||'Learn';
  const stages=['Start','Learn','Experiment','Predict','Practice','Assess','Review','Transfer','Results'];
  if(!/^(?:F[123]-C\d{2}-L\d{2}|DT-C\d{2}-L\d{2}|TAPE-C\d{2}-L\d{2})$/.test(id))return null;
  return {id,stage:stages.includes(stage)?stage:'Learn'};
})();
const labQuestion=(q:string)=>labHandoff
  ?('Lab '+labHandoff.id+'. Learning Journey stage: '+labHandoff.stage+'. '+q).slice(0,450):q;
type LessonKind='candles'|'body-range'|'vwap';
type FictionalTrade={shares1:number;price1:number;shares2:number;price2:number};
type LessonQuestion={id:string;kind:'choice'|'numeric'|'vwap';title:string;prompt:string;options?:string[];correct?:number;calculationStep?:0|1|2;trade?:FictionalTrade;hint:string};
const displayStages=['Welcome','Percentage basics','Candle experiment','Calculate the body','Calculate the range','Calculate the percentage','Independent practice','Review and retry','Transfer challenge','Learning report'] as const;
const cleanNumber=(x:string)=>{const n=Number(x.trim());return x.trim()!==''&&Number.isFinite(n)?n:null};
const closeNumber=(actual:number|null,expected:number,tolerance=.011)=>actual!==null&&Math.abs(actual-expected)<=tolerance;
function originalQuestion(kind:LessonKind,bar:number[],index:number):LessonQuestion{
 if(kind==='vwap'){
   const cases:FictionalTrade[]=[
     {shares1:200,price1:8,shares2:100,price2:10},
     {shares1:150,price1:9,shares2:250,price2:11},
     {shares1:120,price1:12,shares2:180,price2:15}
   ];
   const trade=cases[index<=8?0:index<=10?1:2];
   return{id:'vwap-'+index,kind:'vwap',trade,title:'Work out a different fictional transaction VWAP',
     prompt:'Two original fictional groups traded: '+trade.shares1+' shares at $'+trade.price1+
       ' and '+trade.shares2+' shares at $'+trade.price2+'. Enter traded dollars, total shares and VWAP independently.',
     hint:'Multiply each price by its own number of shares, add the dollar totals, then divide by combined shares. This trade-print example is not bar-based proxy VWAP.'};
 }
 if(kind==='body-range'){
   const step:0|1|2=index<=8?0:index<=10?1:2;
   const titles=['Calculate the real body','Calculate the full candle range','Calculate the body as a percentage'];
   const prompts=[
     'Calculate |close − open| for this completed fictional candle. This is the absolute height of the real body, in dollars.',
     'Calculate high − low for this completed fictional candle. The wick extremes determine the complete range, in dollars.',
     'After learning body and range separately, calculate (real body ÷ full range) × 100. Enter a percentage, not a decimal fraction.'
   ];
   return{id:'body-'+index,kind:'numeric',calculationStep:step,title:titles[step],
     prompt:'Completed fictional candle: open $'+bar[0].toFixed(2)+', high $'+bar[3].toFixed(2)+', low $'+bar[2].toFixed(2)+', close $'+bar[1].toFixed(2)+'. '+prompts[step],
     hint:'Real body = |close − open|. Full range = high − low. Body percentage = (body ÷ full range) × 100.'};
 }
 return{id:'candle-'+index,kind:'choice',title:'Read the completed candle',
   prompt:'Which statement can you justify from the revealed fictional candle without predicting the next one?',
   options:['The candle guarantees the next price direction.',
    'The observed open, high, low and close describe this completed interval only.',
    'A green body guarantees buyers will control the following interval.',
    'The wick proves the exact transaction sequence inside the interval.'],
   correct:1,hint:'Separate what has already been observed from what remains unknown. OHLC does not establish intrabar transaction order.'};
}
function FictionalChart({onQuestion,memberId,visible,setVisible,playing,setPlaying,playSpeed,setPlaySpeed,onPauseForQuestion}:{
 onQuestion:(q:string)=>void;memberId:string;visible:number;setVisible:React.Dispatch<React.SetStateAction<number>>;
 playing:boolean;setPlaying:React.Dispatch<React.SetStateAction<boolean>>;playSpeed:number;setPlaySpeed:React.Dispatch<React.SetStateAction<number>>;
 onPauseForQuestion:()=>void
}){
  const host=useRef<HTMLDivElement|null>(null);
  const chartRef=useRef<ChartInstance|null>(null);
  const [timeframe,setTimeframe]=useState<1|3|5>(1);
  const [compare,setCompare]=useState(false);
  const prototype=typeof window!=='undefined'&&isTaliaAdvancedRoute();
  const sharedBars=useMemo(()=>REPLAY.slice(0,visible).map((bar,i)=>({
    time:'B'+String(i+1).padStart(3,'0'),o:bar[0],c:bar[1],l:bar[2],h:bar[3],
    v:syntheticVolume(bar,i),ema9:0,ema20:0,proxy:0
  })),[visible]);
  const [study,setStudy]=useState<'none'|'sma3'|'ema3'|'ema9'|'ema20'|'ema200'|'vwap'>('ema9');
  const [zoom,setZoom]=useState(100);
  const [showVolume,setShowVolume]=useState(true);
  const [showStructure,setShowStructure]=useState(true);
  const [buffer,setBuffer]=useState(3);
  const [bull,setBull]=useState('#38c6a6');
  const [bear,setBear]=useState('#e37779');
  const [annotation,setAnnotation]=useState<number|null>(null);
  const [settingsLoaded,setSettingsLoaded]=useState(false);
  useEffect(()=>{
    if(!prototype||!memberId)return;
    setSettingsLoaded(false);
    try{
      const raw=window.localStorage.getItem('smfgu-talia-prototype-chart-v1:'+memberId);
      if(raw){const v=JSON.parse(raw);
        if(['none','sma3','ema3','ema9','ema20','ema200','vwap'].includes(v.study))setStudy(v.study);
        if([0,3,6].includes(v.buffer))setBuffer(v.buffer);
        if([45,70,100].includes(v.zoom))setZoom(v.zoom);
        if(typeof v.bull==='string'&&/^#[0-9a-fA-F]{6}$/.test(v.bull))setBull(v.bull);
        if(typeof v.bear==='string'&&/^#[0-9a-fA-F]{6}$/.test(v.bear))setBear(v.bear);
        if(typeof v.showVolume==='boolean')setShowVolume(v.showVolume);
        if(typeof v.showStructure==='boolean')setShowStructure(v.showStructure);
      }
    }catch{/* Settings storage is optional; chart continues with safe defaults. */}
    setSettingsLoaded(true);
  },[prototype,memberId]);
  useEffect(()=>{
    if(!prototype||!memberId||!settingsLoaded)return;
    try{window.localStorage.setItem('smfgu-talia-prototype-chart-v1:'+memberId,JSON.stringify({study,buffer,zoom,bull,bear,showVolume,showStructure}));}catch{/* Private browsing may disable storage. */}
  },[prototype,memberId,settingsLoaded,study,buffer,zoom,bull,bear,showVolume,showStructure]);
  const [status,setStatus]=useState('Fictional completed-bar teaching example; subsequent bars are concealed.');
  const panChart=(direction:-1|1)=>{
    const chart=chartRef.current;
    const view=chart?.getOption?.().dataZoom?.[0];
    if(!chart?.dispatchAction||!view)return;
    const start=Number(view.start??0),end=Number(view.end??100),span=Math.max(1,end-start);
    const nextStart=Math.max(0,Math.min(100-span,start+direction*span*.45));
    chart.dispatchAction({type:'dataZoom',start:nextStart,end:nextStart+span});
  };
  const releasePointer=(event:React.PointerEvent<HTMLDivElement>)=>{
    const el=event.target as Element;
    if(el.hasPointerCapture?.(event.pointerId))el.releasePointerCapture(event.pointerId);
  };
  useEffect(()=>{
    let disposed=false,plot:ChartInstance|null=null,observer:ResizeObserver|null=null;
    const resize=()=>plot?.resize();
    const mount=async()=>{
      try{
        if(!host.current||!window.CrownlightECharts?.load){
          setStatus('Chart unavailable; use the accessible candle table below.');return;
        }
        const echarts=await window.CrownlightECharts.load();
        if(disposed||!host.current)return;
        plot=echarts.init(host.current);
        chartRef.current=plot;
        const revealed=REPLAY.slice(0,visible);
        const shown=aggregateCompleted(revealed,timeframe);
        const closes=shown.map(r=>r[1]);
        const overlay=closes.map((_,i)=>{
          if(i<2||study==='none')return null;
          if(study==='sma3')return Number(((closes[i]+closes[i-1]+closes[i-2])/3).toFixed(4));
          let ema=(closes[0]+closes[1]+closes[2])/3;
          for(let j=3;j<=i;j++)ema=closes[j]*.5+ema*.5;
          return Number(ema.toFixed(4));
        });
        // Display only completed observations; longer lookback indicators correctly remain in warmup.
        const ema=(period:number)=>closes.map((_,i)=>{if(i<period-1)return null;let v=closes.slice(0,period).reduce((a,b)=>a+b,0)/period;for(let j=period;j<=i;j++)v=v+(closes[j]-v)*2/(period+1);return Number(v.toFixed(4))});
        const volumes=shown.map((_,i)=>revealed.slice(i*timeframe,(i+1)*timeframe).reduce((total,r,j)=>total+syntheticVolume(r,i*timeframe+j),0)); // synthetic proxy, NOT market volume
        const vwap=shown.map((_,i)=>{let sum=0,qty=0;for(let j=0;j<=i;j++){sum+=((shown[j][3]+shown[j][2]+shown[j][1])/3)*volumes[j];qty+=volumes[j]}return Number((sum/qty).toFixed(4))});
        const structure:{coord:number[];value:string}[]=[];
        let earlierHigh:number|null=null,earlierLow:number|null=null;
        for(let i=1;i<shown.length-1;i++){
         const bar=shown[i],left=shown[i-1],right=shown[i+1];
         if(bar[3]>left[3]&&bar[3]>right[3]){
          const label=earlierHigh===null?'Swing H':bar[3]>earlierHigh?'HH':bar[3]<earlierHigh?'LH':'Equal H';
          structure.push({coord:[i,bar[3]],value:label});earlierHigh=bar[3];
         }
         if(bar[2]<left[2]&&bar[2]<right[2]){
          const label=earlierLow===null?'Swing L':bar[2]>earlierLow?'HL':bar[2]<earlierLow?'LL':'Equal L';
          structure.push({coord:[i,bar[2]],value:label});earlierLow=bar[2];
         }
        }
        const horizon=Array.from({length:prototype?buffer:0},(_,i)=>'Buffer '+(i+1));
        plot.setOption({
          animation:false,backgroundColor:'transparent',
          dataZoom:prototype?[{type:'inside',start:Math.max(0,100-zoom),end:100,zoomOnMouseWheel:true,moveOnMouseMove:true,moveOnMouseWheel:false},{type:'slider',start:Math.max(0,100-zoom),end:100,height:13,bottom:7}]:[],
          grid:showVolume&&prototype?[{top:26,left:52,right:25,height:'58%'},{top:'74%',left:52,right:25,height:'14%'}]:{top:24,left:50,right:25,bottom:55},
          xAxis:showVolume&&prototype?[{type:'category',data:[...shown.map((_,i)=>'Bar '+(i+1)),...horizon],axisLabel:{color:'#a4b7c9'},axisLine:{lineStyle:{color:'#536578'}}},{type:'category',gridIndex:1,data:[...shown.map((_,i)=>'Bar '+(i+1)),...horizon],axisLabel:{show:false},axisLine:{show:false}}]:{type:'category',data:[...shown.map((_,i)=>'Bar '+(i+1)),...horizon],axisLabel:{color:'#a4b7c9'},axisLine:{lineStyle:{color:'#536578'}}},
          yAxis:showVolume&&prototype?[{scale:true,type:'value',axisLabel:{color:'#a4b7c9'},splitLine:{lineStyle:{color:'#34465a',opacity:0.35}}},{type:'value',gridIndex:1,axisLabel:{color:'#88a8bb'},splitLine:{show:false}}]:{scale:true,type:'value',axisLabel:{color:'#a4b7c9'},splitLine:{lineStyle:{color:'#34465a',opacity:0.35}}},
          tooltip:{trigger:'item',formatter:(x:{dataIndex:number})=>{
            const r=shown[x.dataIndex];return r?'Completed '+timeframe+'m fictional bar '+(x.dataIndex+1)+' | O '+r[0].toFixed(2)+' H '+r[3].toFixed(2)+' L '+r[2].toFixed(2)+' C '+r[1].toFixed(2):'';
          }},
          series:[{type:'candlestick',name:'Fictional completed bars',
            data:shown,itemStyle:{color:prototype?bull:'#38c6a6',color0:prototype?bear:'#e37779',borderColor:prototype?bull:'#38c6a6',borderColor0:prototype?bear:'#e37779',borderWidth:1.5,shadowBlur:prototype?4:0,shadowColor:'#145a67'},
            markLine:prototype?{symbol:'none',silent:true,lineStyle:{color:'#668ba1',type:'dashed',width:1,opacity:.7},
              data:[
                ...(showStructure?[{yAxis:Math.max(...shown.map(r=>r[3])),name:'Visible swing high',label:{show:false}},
                  {yAxis:Math.min(...shown.map(r=>r[2])),name:'Visible swing low',label:{show:false}}]:[]),
                ...([['Open',shown.at(-1)?.[0]],['High',shown.at(-1)?.[3]],['Low',shown.at(-1)?.[2]],['Close',shown.at(-1)?.[1]]] as [string,number|undefined][])
                  .filter((x):x is [string,number]=>typeof x[1]==='number')
                  .map(([name,value])=>({yAxis:value,name:name+' $'+value.toFixed(2),
                    label:{show:true,position:'insideEndTop',formatter:name+' $'+value.toFixed(2),fontSize:10,color:'#e4f8f6'},
                    lineStyle:{color:name==='High'||name==='Low'?'#7ebbd9':'#63bfae',type:'dotted',opacity:.6}}))
              ]}:undefined,
            markPoint:prototype&&annotation!==null&&Math.floor(annotation/timeframe)<shown.length?{symbol:'pin',symbolSize:42,label:{formatter:'Study',color:'#091827'},data:[{coord:[Math.floor(annotation/timeframe),shown[Math.floor(annotation/timeframe)][1]],value:'Study'}]}:undefined},
            ...(prototype&&study!=='none'?[{type:'line',name:study==='sma3'?'SMA 3':study.toUpperCase(),data:study==='ema9'?ema(9):study==='ema20'?ema(20):study==='ema200'?ema(200):study==='vwap'?vwap:overlay,showSymbol:false,connectNulls:false,lineStyle:{width:2,color:'#e9bc72'},itemStyle:{color:'#e9bc72'},smooth:false}]:[]),
            ...(prototype&&compare?[9,20,200].map(period=>({type:'line',name:'EMA '+period,data:ema(period),showSymbol:false,connectNulls:false,lineStyle:{width:period===200?2.8:2,color:period===9?'#f4ce79':period===20?'#80b9ff':'#ed86cd'},itemStyle:{color:'#f4ce79'},smooth:false})):[]),
            ...(prototype&&compare?[{type:'line',name:'VWAP proxy',data:vwap,showSymbol:false,connectNulls:false,lineStyle:{width:2,color:'#9de7e2',type:'dashed'},itemStyle:{color:'#9de7e2'}}]:[]),
            ...(prototype&&showVolume?[{type:'bar',name:'Fictional volume proxy',xAxisIndex:1,yAxisIndex:1,data:volumes,itemStyle:{color:'#388fac'}}]:[]),
            ...(prototype&&showStructure&&structure.length?[{type:'scatter',name:'Confirmed market structure',data:structure.map(x=>({value:x.coord,name:x.value})),symbolSize:10,label:{show:true,position:'top',formatter:(x:{data?:{name?:string}})=>x.data?.name||'',color:'#f5d79c',fontSize:11},itemStyle:{color:'#eac783'}}]:[])]
        });
        plot.on('click',e=>{
          const i=Number(e.dataIndex);
          if(Number.isInteger(i)&&i>=0&&i<shown.length){
            const bar=shown[i];
            onQuestion(('Completed '+timeframe+'-minute fictional bar '+(i+1)+': open '+bar[0].toFixed(2)+', high '+bar[3].toFixed(2)+', low '+bar[2].toFixed(2)+', close '+bar[1].toFixed(2)+'. Only '+visible+' underlying one-minute candles revealed. Guide my observations and prior confirmed structure; no future bars or grading.').slice(0,450));
          }
        });
        window.addEventListener('resize',resize);
        if(typeof ResizeObserver!=='undefined'&&host.current){observer=new ResizeObserver(resize);observer.observe(host.current)}
        setStatus(visible+' of '+REPLAY.length+' fictional one-minute candles revealed; '+shown.length+' fully completed '+timeframe+'-minute candles rendered. Incomplete timeframe groups are concealed.');
      }catch{if(!disposed)setStatus('Chart unavailable; the completed-candle table remains available.')}
    };
    void mount();
    return ()=>{disposed=true;window.removeEventListener('resize',resize);observer?.disconnect();if(chartRef.current===plot)chartRef.current=null;plot?.dispose()};
  },[visible,onQuestion,prototype,study,zoom,annotation,showVolume,showStructure,buffer,bull,bear,timeframe,compare]);
  const latest=REPLAY[visible-1];
  return <section className="tc-chart-panel" aria-label="Optional fictional completed-candle teaching chart">
    <div className="tc-row tc-row-between tc-chart-heading"><h2>Chart &amp; price evidence</h2><span className="tc-pill">SIMULATED · UNGRADED</span></div>
    {false&&<div className="tc-row tp-chart-tools" aria-label="Superseded chart controls; use shared Classic technical chart">
      <label>Completed-bar study <select value={study} onChange={e=>setStudy(e.target.value as 'none'|'sma3'|'ema3'|'ema9'|'ema20'|'ema200'|'vwap')}><option value="ema3">EMA 3</option><option value="sma3">SMA 3</option><option value="ema9">EMA 9</option><option value="ema20">EMA 20 (requires 20 bars)</option><option value="ema200">EMA 200 (requires 200 bars)</option><option value="vwap">Fictional proxy VWAP</option><option value="none">No overlay</option></select></label>
      <label>Completed interval <select value={timeframe} onChange={e=>setTimeframe(Number(e.target.value) as 1|3|5)}><option value={1}>1 minute</option><option value={3}>3 minutes</option><option value={5}>5 minutes</option></select></label>
      <label>Visible window <select value={zoom} onChange={e=>setZoom(Number(e.target.value))}><option value={100}>All revealed bars</option><option value={70}>70%</option><option value={45}>45%</option><option value={20}>20% detail</option></select></label>
      <button type="button" className="tc-secondary" onClick={()=>panChart(-1)} aria-label="Pan to older completed candles">Pan left</button>
      <button type="button" className="tc-secondary" onClick={()=>panChart(1)} aria-label="Pan to newer completed candles">Pan right</button>
      <label><input type="checkbox" checked={compare} onChange={e=>setCompare(e.target.checked)}/> Compare EMA 9 / 20 / 200 + VWAP</label>
      <label>Right buffer <select value={buffer} onChange={e=>setBuffer(Number(e.target.value))}><option value={0}>None</option><option value={3}>3 bars</option><option value={6}>6 bars</option></select></label>
      <label>Bull <input aria-label="Bull candle color" type="color" value={bull} onChange={e=>setBull(e.target.value)}/></label>
      <label>Bear <input aria-label="Bear candle color" type="color" value={bear} onChange={e=>setBear(e.target.value)}/></label>
      <label><input type="checkbox" checked={showVolume} onChange={e=>setShowVolume(e.target.checked)}/> Volume proxy</label>
      <label><input type="checkbox" checked={showStructure} onChange={e=>setShowStructure(e.target.checked)}/> Structure</label>
      <button type="button" className="tc-secondary" onClick={()=>setAnnotation(visible-1)}>Annotate latest</button>
      <button type="button" className="tc-secondary" onClick={()=>setAnnotation(null)} disabled={annotation===null}>Clear annotation</button>
      <button type="button" className="tc-secondary" onClick={()=>onQuestion('Teach the '+(study==='none'?'candle structure':study.toUpperCase())+' on this '+timeframe+'-minute chart using only '+visible+' revealed one-minute bars. Explain indicator warmup and any confirmed HH/HL/LH/LL labels without future candles.')}>Teach this chart</button>
    </div>}
    {prototype?<div className="tc-unified-chart" aria-label="Talia synchronized Classic technical chart">
      <ClassicClassroomChart mode="talia" memberSafe={true}
       caseBars={sharedBars}
       measurement={{index:visible,open:latest[0],high:latest[3],low:latest[2],close:latest[1],interval:'1-minute source'}}
       onObservedBar={(index,interval)=>{
        // The selected ECharts index is an AGGREGATED completed timeframe
        // candle, not the index of a one-minute source bar. Never inspect an
        // unfinished group or any source bar after the Talia reveal boundary.
        const group=REPLAY.slice(index*interval,Math.min(visible,(index+1)*interval));
        if(group.length!==interval)return;
        const opening=group[0][0],closing=group[group.length-1][1];
        const high=Math.max(...group.map(bar=>bar[3]));
        const low=Math.min(...group.map(bar=>bar[2]));
        onQuestion(('Talia, explain completed simulated '+interval+'-minute candle '+(index+1)+' using only '+((index+1)*interval)+' completed one-minute observations available AT THAT BAR. Open '+opening.toFixed(2)+', high '+high.toFixed(2)+', low '+low.toFixed(2)+', close '+closing.toFixed(2)+'. Discuss actual observed structure, not future prices or protected answers.').slice(0,450));
       }}/>
     </div>:<div className="tc-chart" ref={host} role="img" onPointerUpCapture={releasePointer} onPointerCancelCapture={releasePointer} aria-label={'Simulated price chart of '+Math.floor(visible/timeframe)+' complete '+timeframe+'-minute candlesticks'} />}
    <p className="tc-muted tc-chart-sync" role="status">{prototype?visible+' completed candles revealed · Volume is simulated.':status}</p>
    {!prototype&&<details className="tc-current-candle-ledger">
      <summary>Accessible latest-candle data table · bar {visible}</summary>
      <table className="tc-candle-table"><caption>Latest visible completed candle (base one-minute source)</caption>
        <thead><tr><th>Bar</th><th>Open</th><th>High</th><th>Low</th><th>Close</th></tr></thead>
        <tbody><tr><td>{visible}</td><td>{latest[0].toFixed(2)}</td><td>{latest[3].toFixed(2)}</td><td>{latest[2].toFixed(2)}</td><td>{latest[1].toFixed(2)}</td></tr></tbody>
      </table>
    </details>}
    {prototype&&<details className="tp-candle-audit"><summary>Accessible completed-candle ledger — {visible} revealed candles</summary>
      <p className="tc-muted">Only candles revealed at the current decision boundary appear below. Keyboard users can request an explanation for any completed candle.</p>
      <div className="tp-candle-audit-scroll"><table className="tc-candle-table"><caption>Fictional replay: completed observations only</caption>
        <thead><tr><th scope="col">Bar</th><th scope="col">Open</th><th scope="col">High</th><th scope="col">Low</th><th scope="col">Close</th><th scope="col">Tutor</th></tr></thead>
        <tbody>{REPLAY.slice(0,visible).map((bar,i)=><tr key={i}><th scope="row">{i+1}</th><td>{bar[0].toFixed(2)}</td><td>{bar[3].toFixed(2)}</td><td>{bar[2].toFixed(2)}</td><td>{bar[1].toFixed(2)}</td><td><button type="button" className="tc-secondary" onClick={()=>onQuestion(('Explain fictional completed candle '+(i+1)+' with open '+bar[0].toFixed(2)+', high '+bar[3].toFixed(2)+', low '+bar[2].toFixed(2)+', close '+bar[1].toFixed(2)+'. Use only the visible preceding candles.').slice(0,450))}>Explain bar {i+1}</button></td></tr>)}</tbody>
      </table></div>
    </details>}
    <div className="tc-row tc-playback-primary">

      <button type="button" onClick={()=>{setPlaying(false);setVisible(v=>Math.min(REPLAY.length,v+1))}} disabled={visible===REPLAY.length}>Next candle</button>
      <button type="button" onClick={()=>setPlaying(v=>!v)} disabled={visible>=REPLAY.length} aria-pressed={playing} aria-label={playing?'Pause automatic fictional candle playback':'Start automatic fictional candle playback'}>{playing?'Pause':'Play'}</button>



      <button type="button" className="tc-secondary" onClick={()=>onQuestion(('The latest revealed fictional bar is '+visible+' with open '+latest[0].toFixed(2)+', high '+latest[3].toFixed(2)+', low '+latest[2].toFixed(2)+', close '+latest[1].toFixed(2)+'. Guide me through one observation question using only these completed bars; do not reveal later candles.').slice(0,450))}>Ask Talia about candle</button>
    </div>
    <details className="tc-replay-options">
      <summary>More replay options</summary>
      <div className="tc-row">
        {prototype&&<button type="button" className="tc-secondary" onClick={()=>{setPlaying(false);setVisible(200);setTimeframe(1);setZoom(20)}} disabled={visible>=200}>Load 200 candles for EMA 200</button>}
        {prototype&&<button type="button" className="tc-secondary" onClick={()=>{setPlaying(false);setVisible(v=>Math.max(7,v-1))}} disabled={visible<=7}>Previous candle</button>}
        <label className="tc-playback-speed">Speed <select value={playSpeed} onChange={e=>setPlaySpeed(Number(e.target.value))} aria-label="Fictional playback speed"><option value={3000}>Slow</option><option value={1600}>Normal</option><option value={750}>Fast</option></select></label>
        <button type="button" className="tc-secondary" onClick={()=>{setPlaying(false);onPauseForQuestion()}}>Pause for a question</button>
        <button type="button" className="tc-secondary" onClick={()=>{setPlaying(false);setVisible(7);setTimeframe(1);setZoom(100);setAnnotation(null)}} disabled={visible===7&&timeframe===1&&zoom===100&&annotation===null}>Restart replay</button>
      </div>
    </details>
  </section>;
}
/** Original fictional ungraded teaching questions: never protected answer keys.
 * The checkpoint's local checks pause the chart and produce personalized
 * corrective feedback. Nothing is persisted as a formal grade or mastery.
 */
function TeachingCheckpoint({checkpoint,bar,onComplete,onFeedback,onSkip}:{
 checkpoint:LessonQuestion;bar:number[];
 onComplete:(reply:string,feedback:string)=>void;onFeedback:(feedback:string)=>void;onSkip:()=>void
}){
 const [choice,setChoice]=useState<number|null>(null);
 const [fields,setFields]=useState(['','','']);
 const [feedback,setFeedback]=useState('');
 const [tries,setTries]=useState(0);
 const [showExplanation,setShowExplanation]=useState(false);
 const numerical=checkpoint.kind==='numeric'||checkpoint.kind==='vwap';
 const names=checkpoint.kind==='vwap'?['Total traded dollars ($)','Total shares','VWAP ($ per share)']:
   ['Real body ($)','Full candle range ($)','Body as percentage of range (%)'];
 const trade=checkpoint.trade;
 const vwapValue=trade?(trade.price1*trade.shares1+trade.price2*trade.shares2)/(trade.shares1+trade.shares2):0;
 const expected=checkpoint.kind==='vwap'&&trade?[
    trade.price1*trade.shares1+trade.price2*trade.shares2,
    trade.shares1+trade.shares2,vwapValue]:
  [Math.abs(bar[1]-bar[0]),bar[3]-bar[2],
    bar[3]===bar[2]?0:Math.abs(bar[1]-bar[0])/(bar[3]-bar[2])*100];
 const explanation=checkpoint.kind==='vwap'&&trade?(
    trade.shares1+' × $'+trade.price1+' = $'+(trade.shares1*trade.price1).toFixed(2)+
    '; '+trade.shares2+' × $'+trade.price2+' = $'+(trade.shares2*trade.price2).toFixed(2)+
    '. Total traded dollars = $'+expected[0].toFixed(2)+
    '. Total shares = '+expected[1]+'. VWAP = $'+expected[0].toFixed(2)+' ÷ '+expected[1]+
    ' = $'+vwapValue.toFixed(4)+' per share. These are original fictional transactions, not a bar-based proxy.'
  ):
 checkpoint.kind==='numeric'?'Body is the absolute close-minus-open difference. Range is high minus low. Divide body by range and multiply by 100 for the percentage; never use close/open as the denominator.':
 'A completed OHLC candle describes observed prices in its interval. It cannot prove the next candle, the order of intra-bar transactions, or any trading outcome.';
 const check=(e:React.FormEvent)=>{
  e.preventDefault();setTries(n=>n+1);
  let correct=false;let reply='';let diagnostic='';
  if(checkpoint.kind==='choice'){
   if(choice===null){setFeedback('Choose an answer before continuing.');return}
   correct=choice===checkpoint.correct;reply=checkpoint.options?.[choice]||'';
   diagnostic=correct?'Correct observation: OHLC is evidence about a completed period, not a prediction.':
    'Not quite. A finished candle tells you its prices, but not the next direction or exact intrabar order. Review the other options and try again.';
  }else{
   const values=fields.map(cleanNumber);
   const matches=expected.map((v,i)=>closeNumber(values[i],v,i===2&&checkpoint.kind==='vwap'?0.02:0.011));
   correct=checkpoint.kind==='numeric'?matches[checkpoint.calculationStep??0]===true:matches.every(Boolean);
   reply=names.map((k,i)=>checkpoint.kind==='numeric'&&i!==checkpoint.calculationStep?'':k+': '+fields[i]).filter(Boolean).join('; ');
   diagnostic=correct?(checkpoint.kind==='numeric'?'This separate candle calculation is correct.':'All three fictional transaction calculations are correct.'):
    matches.map((valid,i)=>checkpoint.kind==='numeric'&&i!==checkpoint.calculationStep?'':valid?names[i]+': correct.':names[i]+': check your arithmetic and units.').filter(Boolean).join(' ');
  }
  if(correct){setFeedback(diagnostic);onComplete(reply,diagnostic+' '+explanation)}
  else{setFeedback(diagnostic);onFeedback(diagnostic)}
 };
 return <section className="tc-checkpoint" aria-labelledby="tc-checkpoint-heading">
  <div className="tc-row tc-row-between"><h3 id="tc-checkpoint-heading">Talia's teaching checkpoint</h3><span className="tc-pill">Playback paused · ungraded</span></div>
  <p><strong>{checkpoint.title}</strong></p><p>{checkpoint.prompt}</p>
  <form onSubmit={check} className="tc-checkpoint-form">
   {checkpoint.kind==='choice'?<fieldset><legend>Choose the supported observation</legend>
     {(checkpoint.options||[]).map((option,i)=><label className="tc-checkpoint-option" key={i}>
       <input type="radio" name={checkpoint.id} checked={choice===i} onChange={()=>setChoice(i)}/>
       <span>{option}</span>
     </label>)}</fieldset>:
     <fieldset><legend>Work through the three calculations separately</legend>
       {names.map((name,i)=>(checkpoint.kind==='vwap'||i===checkpoint.calculationStep)&&<label key={name} className="tc-equation-field">{name}
         <input value={fields[i]} onChange={e=>setFields(old=>old.map((x,j)=>i===j?e.target.value.slice(0,22):x))}
           inputMode="decimal" placeholder={i===2?'Calculate last':'Enter your result'} aria-label={name}/>
       </label>)}
     </fieldset>}
   <div className="tc-row"><button type="submit">Check my answer</button>
    <button className="tc-secondary" type="button" onClick={()=>setShowExplanation(v=>!v)}>{showExplanation?'Hide explanation':'Explain this concept — Free'}</button>
    <button className="tc-secondary" type="button" onClick={onSkip}>Skip this ungraded checkpoint</button></div>
  </form>
  {feedback&&<p role="status" className="tc-checkpoint-feedback">{feedback} {tries>1?'You can retry without losing credit.':''}</p>}
  {showExplanation&&<div className="tc-worked-lesson" role="note"><strong>Worked explanation</strong>
     <p>{checkpoint.hint}</p><p>{explanation}</p><p>No Lumens are required for explanations or retries.</p></div>}
 </section>;
}
function Classroom(){
  const advancedExperience=isTaliaAdvancedRoute();
  const [member,setMember]=useState<Member|null>(null);
  const [ready,setReady]=useState(false);
  const [chat,setChat]=useState<ChatLine[]>(DEFAULT);
  const [visible,setVisible]=useState(7);
  const [playing,setPlaying]=useState(false);
  const [playSpeed,setPlaySpeed]=useState(1600);
  const [lessonKind,setLessonKind]=useState<LessonKind|null>(null);
  const [teachingCatalog,setTeachingCatalog]=useState<CurriculumAccess|null>(null);
  const [teachingTopic,setTeachingTopic]=useState('candlesticks');
  const [teachingDepth,setTeachingDepth]=useState<TeachingDepth>('FOUNDATION');
  const [teachingPhase,setTeachingPhase]=useState<LessonPhase>('explain');
  const [teachingStarted,setTeachingStarted]=useState(false);
  const [teachingAccessError,setTeachingAccessError]=useState('');
  const [practiceNotes,setPracticeNotes]=useState('');
  const [viewedSteps,setViewedSteps]=useState<LessonPhase[]>([]);
  const [checkpoint,setCheckpoint]=useState<LessonQuestion|null>(null);
  const [stageIndex,setStageIndex]=useState(0);
  const [studyReport,setStudyReport]=useState({completed:0,retries:0,skipped:0,latest:'No ungraded question submitted'});
  const [typingSpeed,setTypingSpeed]=useState(28);
  const [typingId,setTypingId]=useState<string|null>(null);
  const [typedCount,setTypedCount]=useState(0);
  const [activeEdition,setActiveEdition]=useState('FOUNDATION');
  const [premiumEvidence,setPremiumEvidence]=useState<Record<string,Record<string,unknown>>|null>(null);
  const [question,setQuestion]=useState(initialQuestion);
  const [reasoning,setReasoning]=useState('');
  const [practiceCase,setPracticeCase]=useState<'none'|'canonical_candle_body_pct'|'canonical_vwap_trade_groups'>('none');
  const [practiceValue,setPracticeValue]=useState('');
  const [mode,setMode]=useState<Mode>('explain');
  const [save,setSave]=useState(false);
  const [conversationId,setConversationId]=useState<string|null>(null);
  const [conversationLabel,setConversationLabel]=useState('');
  const [busy,setBusy]=useState(false);
  const phases=['Observe','Explain','Attempt','Correct','Retry','Transfer'] as const;
  type Phase=typeof phases[number];
  const [phase,setPhase]=useState<Phase>('Observe');
  const [attempts,setAttempts]=useState(0);
  const [sessionTopic,setSessionTopic]=useState('Reading completed candles');
  const [misconception,setMisconception]=useState('observation');
  const [confidence,setConfidence]=useState('unsure');
  const perspectives=['Understand','Recognize','Apply','Common Mistake','Limitations'] as const;
  type Perspective=typeof perspectives[number];
  const methods=['I DO','WE DO','YOU DO','REVIEW','TRANSFER'] as const;
  type Method=typeof methods[number];
  const [perspective,setPerspective]=useState<Perspective>('Understand');
  const [method,setMethod]=useState<Method>('I DO');
  const misconceptionPrompts:Record<string,string>={
    observation:'I may be confusing what a completed candle shows with what I expect the market to do next. Separate observation from prediction.',
    structure:'I may be treating one higher high as proof of a confirmed trend. Show how multiple swing points and invalidation change that conclusion.',
    indicator:'I may be treating an indicator crossover as a guaranteed signal. Explain lag, warmup, context and cases in which NO TRADE is reasonable.',
    risk:'I may be choosing a trade without an invalidation point. Walk me through an ungraded risk-first fictional decision.',
    lookahead:'I may be using candles not yet revealed to justify a past decision. Reconstruct the decision from the visible historical prefix only.'
  };
  const requestCorrection=()=>{
    setPhase('Correct');setMode('review');
    setQuestion(('Current topic: '+sessionTopic+'. '+misconceptionPrompts[misconception]+' Ask me what evidence supports my reasoning, then correct it using only approved ungraded instruction.').slice(0,450));
    setStatus('Misconception review prepared. Explain your own reasoning in the review field before sending.');
  };
  const requestRecommendation=()=>{
    setPhase('Retry');setMode('question');
    const basis=confidence==='unsure'?'Start with a simpler observation and worked example.':confidence==='developing'?'Ask a new comparison that tests the distinction.':'Ask a more difficult independent transfer question.';
    const prompt=('Practice '+dimension+' for '+sessionTopic+'. '+basis+' Focus on '+misconceptionPrompts[misconception]+' Do not grade this response.').slice(0,450);
    void submitTutor(prompt,'question','');
    setStatus('Requesting a new ungraded practice question from the authenticated Tutor.');
  };
  const [dimension,setDimension]=useState<'Knowledge'|'Recognition'|'Decision'|'Process'>('Recognition');
  const phaseInstructions:Record<Phase,{mode:Mode;prompt:string}>={
    Observe:{mode:'question',prompt:'Ask me to identify two observable facts from the current completed candle or concept. Do not interpret for me yet.'},
    Explain:{mode:'explain',prompt:'Teach the concept from first principles. Separate the observed evidence from assumptions and use a fictional worked example.'},
    Attempt:{mode:'question',prompt:'Ask one diagnostic question. Wait for my answer before providing the explanation. This is ungraded.'},
    Correct:{mode:'review',prompt:'Help me inspect my reasoning for a specific misconception. Explain the correction and why my inference may fail. Do not supply a private rubric.'},
    Retry:{mode:'question',prompt:'Give me a DIFFERENT ungraded question focused on the same misconception; wait for my attempt.'},
    Transfer:{mode:'practice',prompt:'Give a new fictional scenario requiring an independent decision including NO TRADE. Do not grade or award mastery.'}
  };
  const preparePhase=(next:Phase)=>{
    setPhase(next);
    setMode(phaseInstructions[next].mode);
    setQuestion((sessionTopic+'. '+phaseInstructions[next].prompt).slice(0,450));
    setStatus('Instruction prepared for '+next+'. Review the question and send it to Talia.');
  };
  const instructionalQuestion=(q:string)=>advancedExperience?
    ('Instructional perspective: '+perspective+'. Method: '+method+'. '+q).slice(0,450):q;
  const [status,setStatus]=useState('Verifying member sign-in...');
  const epoch=useRef(0),pending=useRef<AbortController|null>(null);
  const log=useRef<HTMLOListElement|null>(null);
  const client=useRef<AuthClient|null>(null);
  const identity=useRef<string|null>(null);
  const reset=useCallback((id:string|null)=>{
    epoch.current++;pending.current?.abort();pending.current=null;
    identity.current=id;setMember(null);setChat(DEFAULT);
    setPlaying(false);setVisible(7);setLessonKind(null);setCheckpoint(null);setStageIndex(0);
    setTeachingCatalog(null);setTeachingTopic('candlesticks');setTeachingDepth('FOUNDATION');
    setTeachingPhase('explain');setTeachingStarted(false);setTeachingAccessError('');
    setPracticeNotes('');setViewedSteps([]);
    setStudyReport({completed:0,retries:0,skipped:0,latest:'No ungraded question submitted'});
    setActiveEdition('FOUNDATION');setPremiumEvidence(null);setTypingId(null);setTypedCount(0);
    setConversationId(null);setConversationLabel('');setSave(false);
    setQuestion('');setReasoning('');setMode('explain');setBusy(false);setPhase('Observe');setAttempts(0);setSessionTopic('Reading completed candles');
    setMisconception('observation');setConfidence('unsure');setDimension('Recognition');setPerspective('Understand');setMethod('I DO');setStatus(id?'Member identity changed. Verifying the new session...':'Signed out. Private Tutor content was cleared.');
  },[]);
  useEffect(()=>{
    let live=true,unsubscribe:(()=>void)|null=null;
    const authorize=async(userId:string,access:string)=>{
      try{
        const response=await fetch('/api/member-tool-access?tool=MARKET_TUTOR',{
          cache:'no-store',headers:{authorization:'Bearer '+access}});
        const data=await response.json().catch(()=>null);
        if(!live||identity.current!==userId)return;
        if(!response.ok||data?.ok!==true||(data.authorized!==true&&data.freeEligible!==true)){
          setMember(null);
          setStatus('Talia requires an eligible, unrestricted membership. Sign in with an active member account.');
          return;
        }
        setMember({id:userId,access});
        setStatus('Membership verified. Original source-grounded Tutor ready; no personal API key required.');
      }catch{
        if(live&&identity.current===userId){
          setMember(null);setStatus('Membership could not be verified. Tutor remains locked.');
        }
      }
    };
    const init=async()=>{
      try{
        const sb=await window.getSupabaseClient();if(!live)return;
        client.current=sb;
        const [verified,current]=await Promise.all([sb.auth.getUser(),sb.auth.getSession()]);
        if(!live)return;
        const userId=verified.data.user?.id,session=current.data.session;
        if(userId&&session?.user.id===userId&&session.access_token){
          identity.current=userId;await authorize(userId,session.access_token);
        }else{
          setMember(null);setStatus('Sign in with an eligible membership to use Talia.');
        }
        const change=sb.auth.onAuthStateChange((event,next)=>{
          if(!live)return;
          const id=next?.user?.id||null;
          if(event==='SIGNED_OUT'||id!==identity.current)reset(id);
          if(id&&next?.access_token)void authorize(id,next.access_token);
          else setMember(null);
        });
        unsubscribe=()=>change.data.subscription.unsubscribe();
      }catch{if(live)setStatus('Member authentication is unavailable. No private Tutor request was sent.')}
      finally{if(live)setReady(true)}
    };
    void init();
    return ()=>{live=false;epoch.current++;pending.current?.abort();unsubscribe?.()};
  },[reset]);
  useEffect(()=>{log.current?.scrollTo({top:log.current.scrollHeight,behavior:'auto'})},[chat,busy,typedCount]);
  useEffect(()=>{
    const latest=chat[chat.length-1];
    if(latest?.who!=='talia'||latest.id===typingId)return;
    setTypingId(latest.id);
    setTypedCount(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?latest.text.length:0);
  },[chat,typingId]);
  useEffect(()=>{
    const latest=chat[chat.length-1];
    if(!latest||latest.who!=='talia'||latest.id!==typingId||typedCount>=latest.text.length)return;
    const step=typingSpeed===0?latest.text.length:typingSpeed===12?5:typingSpeed===28?3:1;
    const timer=window.setTimeout(()=>setTypedCount(v=>Math.min(latest.text.length,v+step)),typingSpeed===0?0:typingSpeed);
    return()=>window.clearTimeout(timer);
  },[chat,typingId,typedCount,typingSpeed]);
  const appendInstructor=useCallback((message:string,label='Original fictional teaching')=>{
    setChat(prev=>[...prev,{id:crypto.randomUUID(),who:'talia',text:message,label}]);
  },[]);
  const pauseForQuestion=useCallback((kind:LessonKind|null=lessonKind,at=visible)=>{
    const selected=kind||'candles';
    setPlaying(false);setCheckpoint(originalQuestion(selected,REPLAY[at-1],at));
    setChat(x=>[...x,{id:crypto.randomUUID(),who:'talia',text:'Playback paused at completed fictional candle '+at+'. '+originalQuestion(selected,REPLAY[at-1],at).prompt,label:'Ungraded learner checkpoint'}]);
  },[lessonKind,visible]);
  const startLesson=(kind:LessonKind)=>{
    setLessonKind(kind);setPlaying(false);setVisible(7);setCheckpoint(null);setStageIndex(0);
    setStudyReport({completed:0,retries:0,skipped:0,latest:'No ungraded question submitted'});
    const intro=kind==='vwap'?'We will build fictional trade-print VWAP by multiplying price and volume, adding totals, then dividing. Watch the completed candles separately; their volume proxy is not a real trade-print VWAP.':
      kind==='body-range'?'We will identify open, high, low and close, then calculate body, range and body percentage as three separate steps. The chart will pause for your arithmetic.':
      'We will watch completed fictional candles. I will ask what you can observe and what cannot be predicted. The chart pauses while you answer.';
    appendInstructor(intro);setStatus('Interactive teaching started. Playback is controlled by Talia’s checkpoints.');setPlaying(true);
  };
  useEffect(()=>{
    if(!playing||!member||busy||checkpoint)return;
    const lastTutor=chat.at(-1);
    if(lastTutor?.who==='talia'&&lastTutor.id===typingId&&typedCount<lastTutor.text.length)return;
    if(document.hidden){setPlaying(false);return;}
    const timer=window.setTimeout(()=>{
      const next=Math.min(REPLAY.length,visible+1);
      setVisible(next);
      if(next>=REPLAY.length){setPlaying(false);appendInstructor('The fictional replay is complete. Review one new transfer case or restart the lesson.');return;}
      if(next===8||next%5===0){
        setPlaying(false);setStageIndex(i=>Math.min(9,i+1));
        const kind=lessonKind||'candles',q=originalQuestion(kind,REPLAY[next-1],next);
        setCheckpoint(q);
        appendInstructor('Playback paused at candle '+next+'. '+q.prompt,'Ungraded learner checkpoint');
      }
    },playSpeed);
    return()=>window.clearTimeout(timer);
  },[playing,member,busy,checkpoint,visible,playSpeed,lessonKind,appendInstructor,chat,typingId,typedCount]);
  useEffect(()=>{const hidden=()=>{if(document.hidden)setPlaying(false)};document.addEventListener('visibilitychange',hidden);return()=>document.removeEventListener('visibilitychange',hidden)},[]);
  const checkpointCompleted=(answer:string,feedback:string)=>{
    setStudyReport(r=>({...r,completed:r.completed+1,latest:checkpoint?.title||'Completed ungraded exercise'}));
    setChat(lines=>[...lines,{id:crypto.randomUUID(),who:'member',text:answer,label:'Ungraded practice'},
      {id:crypto.randomUUID(),who:'talia',text:feedback+' Playback will resume with the next revealed fictional candle.',label:'Original fictional corrective explanation'}]);
    setCheckpoint(null);setStageIndex(i=>Math.min(9,i+1));setPlaying(true);
  };
  const checkpointFeedback=(feedback:string)=>{
    setStudyReport(r=>({...r,retries:r.retries+1,latest:checkpoint?.title||'Ungraded corrective practice'}));
    appendInstructor(feedback+' Try again, request a free explanation, or skip this ungraded practice.');
  };
  const checkpointSkipped=()=>{
    setStudyReport(r=>({...r,skipped:r.skipped+1,latest:checkpoint?.title||'Skipped ungraded exercise'}));
    appendInstructor('This ungraded question was skipped. Skipping does not prove proficiency or award credits. We will resume on the next fictional candle.');
    setCheckpoint(null);setPlaying(true);
  };
  const getToken=useCallback(async()=>{
    if(!client.current||!identity.current)return null;
    const result=(await client.current.auth.getSession()).data.session;
    return result?.user.id===identity.current?result.access_token:null;
  },[]);
  const submitTutor=async(q:string,selectedMode:Mode,learnerInput:string)=>{
    if(busy||!member||!ready)return;
    if(checkpoint){setStatus('Finish, retry or skip Talia’s current checkpoint before sending a new message.');return}
    setPlaying(false);
    if(q.length<4||q.length>450){setStatus('Question must contain 4–450 characters.');return}
    if(selectedMode==='review'&&!learnerInput.trim()){setStatus('Provide your reasoning to request an ungraded review.');return}
    if(practiceCase!=='none'&&!/^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(practiceValue.trim())){
      setStatus('Enter one finite decimal result for the selected fictional calculation.');return;
    }
    const targetId=member.id,version=epoch.current;
    const controller=new AbortController();pending.current=controller;setBusy(true);
    const currentSave=save,thread=save?conversationId:null;
    setChat(x=>[...x,{id:crypto.randomUUID(),who:'member',text:q}]);
    setQuestion('');setStatus('Talia is preparing a source-grounded explanation...');
    try{
      const access=await getToken();if(!access)throw Error('Member session expired. Please sign in.');
      const res=await fetch('/api/market-tutor',{method:'POST',cache:'no-store',credentials:'same-origin',signal:controller.signal,
        headers:{authorization:'Bearer '+access,'content-type':'application/json'},
        body:JSON.stringify({question:labQuestion(instructionalQuestion(q)),mode:selectedMode,learnerAnswer:learnerInput.trim().slice(0,1800),
          requestId:crypto.randomUUID(),allowModel:false,saveHistory:currentSave,conversationId:thread,
          ...(practiceCase!=='none'?{formativePractice:{caseId:practiceCase,submitted:practiceValue.trim(),labId:labHandoff?.id||'TALIA_CLASSROOM'}}:{})})});
      const result=await res.json().catch(()=>null);
      if(controller.signal.aborted||version!==epoch.current||identity.current!==targetId)return;
      if(!res.ok||result?.ok!==true||typeof result.answer!=='string'||!result.answer.trim())
        throw Error(res.status===429?'Tutor rate limit reached. Your other lessons remain accessible.':
          res.status===403?'Tutor access could not be verified for this account.':
          res.status===401?'Member session expired.':result?.error||'No verified Tutor explanation is available.');
      setChat(x=>[...x,{id:crypto.randomUUID(),who:'talia',text:result.answer.slice(0,7000),label:result.generation||'source-grounded'}]);
      setReasoning('');setPracticeValue('');setAttempts(n=>n+1);
      setStatus(currentSave?(result.historySaved?'Saved to the existing private Tutor history.':'Response displayed, but private saving was not confirmed.'):
        'Response displayed in this tab only. No model request, grade or saved history was created by this interface.');
    }catch(err){
      if(version===epoch.current&&identity.current===targetId)setStatus(controller.signal.aborted?
        'Stopped waiting. The server may still have processed this request; no automatic paid retry will occur.':
        err instanceof Error?err.message:'Tutor request unavailable.');
    }finally{
      if(version===epoch.current&&identity.current===targetId){setBusy(false);pending.current=null}
    }
  };

  useEffect(()=>{
    if(!member?.id||!member.access)return;
    let live=true;const uid=member.id,version=epoch.current;
    const load=async()=>{
      try{
        const token=await getToken();if(!token)throw Error('Your member session expired.');
        const response=await fetch('/api/talia-classroom-curriculum-v1',{
          method:'GET',cache:'no-store',headers:{authorization:'Bearer '+token}});
        const result=await response.json().catch(()=>null);
        if(!live||version!==epoch.current||identity.current!==uid)return;
        if(!response.ok||result?.ok!==true||!Array.isArray(result.allowedDepths)||
           !Array.isArray(result.lessons)||!result.allowedDepths.includes('FOUNDATION'))
          throw Error('Teaching choices could not be verified for this account.');
        setTeachingCatalog(result as CurriculumAccess);
        setTeachingAccessError('');
        setTeachingDepth(prev=>result.allowedDepths.includes(prev)?prev:'FOUNDATION');
      }catch(e){
        if(live&&version===epoch.current&&identity.current===uid){
          setTeachingCatalog(null);
          setTeachingAccessError(e instanceof Error?e.message:'Teaching choices unavailable.');
        }
      }
    };
    void load();
    return()=>{live=false};
  },[member?.id,member?.access,getToken]);
  const teachSelected=async(phase:LessonPhase)=>{
    if(!member||!ready||busy||checkpoint||!teachingCatalog||
       !teachingCatalog.allowedDepths.includes(teachingDepth))return;
    const uid=member.id,version=epoch.current,topic=teachingTopic,depth=teachingDepth;
    const title=teachingCatalog.lessons.find(x=>x.id===topic)?.title;
    if(!title)return;
    setPlaying(false);
    const controller=new AbortController();pending.current=controller;setBusy(true);
    setTeachingPhase(phase);setTeachingAccessError('');
    setStatus('Talia is preparing '+title+' at '+depth.toLowerCase()+' depth...');
    try{
      const access=await getToken();if(!access)throw Error('Member session expired.');
      const response=await fetch('/api/talia-classroom-curriculum-v1',{
        method:'POST',cache:'no-store',credentials:'same-origin',signal:controller.signal,
        headers:{authorization:'Bearer '+access,'content-type':'application/json'},
        body:JSON.stringify({topic,depth,phase})});
      const result=await response.json().catch(()=>null);
      if(version!==epoch.current||identity.current!==uid||controller.signal.aborted)return;
      if(!response.ok||result?.ok!==true||typeof result.answer!=='string')
        throw Error(response.status===403?'Your membership does not authorize that teaching depth.':
          result?.error||'Verified teaching material unavailable.');
      setChat(old=>[...old,{id:crypto.randomUUID(),who:'member',
        text:(phase==='explain'?'Start':phase==='demonstrate'?'Show a worked example':phase==='practice'?'Give me practice':phase==='correct'?'Correct my understanding':'Try a transfer case')+' — '+title+' ('+depth.toLowerCase()+')'},
        {id:crypto.randomUUID(),who:'talia',text:result.answer.slice(0,7000),
         label:'Original '+depth.toLowerCase()+' teaching · '+phase+' · ungraded'}]);
      setTeachingStarted(true);setSessionTopic(title);
      setViewedSteps(old=>old.includes(phase)?old:[...old,phase]);
      setStatus('Talia completed the '+phase+' step. Select another teaching step or ask a question.');
    }catch(e){
      if(version===epoch.current&&identity.current===uid)
        setStatus(controller.signal.aborted?'Teaching request stopped.':
          e instanceof Error?e.message:'Teaching request unavailable.');
    }finally{
      if(version===epoch.current&&identity.current===uid){setBusy(false);pending.current=null}
    }
  };
  const comparePractice=()=>{
    const note=practiceNotes.trim();
    if(note.length<3){setStatus('Write your calculation or reasoning before opening the worked check.');return}
    setChat(old=>[...old,{id:crypto.randomUUID(),who:'member',text:'My ungraded practice notes: '+note.slice(0,1200),
      label:'Private to this open tab · not submitted for grading'}]);
    void teachSelected('correct');
  };
  const send=(e:React.FormEvent)=>{e.preventDefault();void submitTutor(question.trim(),mode,reasoning.trim())};
  const newConversation=async()=>{
    if(!member||busy)return;
    const title=window.prompt('Private conversation title (maximum 80 characters):','Learning session');
    if(title===null)return;
    if(title.trim().length<1||title.trim().length>80){setStatus('Use 1–80 characters for the conversation title.');return}
    const uid=member.id,version=epoch.current;
    try{
      const access=await getToken();if(!access)throw Error('Session expired.');
      const res=await fetch('/api/member-tutor-conversations',{method:'POST',cache:'no-store',
        headers:{authorization:'Bearer '+access,'content-type':'application/json'},body:JSON.stringify({title:title.trim()})});
      const data=await res.json().catch(()=>null);
      if(version!==epoch.current||identity.current!==uid)return;
      if(!res.ok||!data?.ok||typeof data.id!=='string')throw Error('Private conversation storage is unavailable for this membership.');
      const confirmed=await getToken();if(!confirmed||version!==epoch.current||identity.current!==uid)return;
      setConversationId(data.id);setConversationLabel(title.trim());setChat(DEFAULT);setSave(true);
      setStatus('Private conversation created. Only server-verified saved turns can supply verified follow-up context.');
    }catch(e){if(version===epoch.current)setStatus(e instanceof Error?e.message:'Unable to create private conversation.')}
  };
  const loadHistory=async()=>{
    if(!member||busy)return;
    const uid=member.id,version=epoch.current;
    try{
      const access=await getToken();if(!access)throw Error('Session expired.');
      const res=await fetch('/api/member-tutor-history',{cache:'no-store',headers:{authorization:'Bearer '+access}});
      const data=await res.json().catch(()=>null);
      if(version!==epoch.current||identity.current!==uid)return;
      if(!res.ok||!data?.ok||!Array.isArray(data.history))throw Error('Private Tutor history is not available.');
      // Prevent loading a previous member's history if authorization changed during this request.
      const confirmed=await getToken();if(!confirmed||version!==epoch.current||identity.current!==uid)return;
      const rows=data.history.slice(-30).reverse().flatMap((item:{id?:string;question?:string;answer?:string})=>[
        {id:String(item.id||crypto.randomUUID())+'-q',who:'member' as const,text:String(item.question||'').slice(0,450)},
        {id:String(item.id||crypto.randomUUID())+'-a',who:'talia' as const,text:String(item.answer||'').slice(0,7000),label:'Previously saved'}]);
      if(version!==epoch.current||identity.current!==uid)return;
      setChat([DEFAULT[0],...rows]);setConversationId(null);setConversationLabel('');
      setStatus(rows.length/2+' previously saved Tutor exchanges loaded for display only. New replies remain separate unless you select private saving.');
    }catch(e){if(version===epoch.current)setStatus(e instanceof Error?e.message:'Unable to load history.')}
  };
  const safeSuggest=useCallback((q:string)=>{setQuestion(q.slice(0,450));setStatus('Review the suggested question, then send it to Talia.');},[]);
  const teachFocus=()=>void submitTutor(('Teach '+sessionTopic+' using only the visible '+visible+
    ' fictional completed candles. Explain one observation, one calculation and one limitation before asking me a question.').slice(0,450),'explain','');
  const selectEdition=async(target:string)=>{
    if(!member||busy)return;
    if(target==='FOUNDATION'){
      setActiveEdition('FOUNDATION');setPremiumEvidence(null);
      appendInstructor('Foundation teaching is available to every eligible signed-in member. You can ask questions, practice fictional calculations and follow the guided chart lesson without purchasing explanations.','Foundation instruction');
      setStatus('Foundation teaching selected. No premium beta grant required.');return;
    }
    const uid=member.id,version=epoch.current;
    try{
      const token=await getToken();if(!token)throw Error('Your member session expired.');
      const res=await fetch('/api/talia-premium-member-v1?tier='+encodeURIComponent(target),{
        headers:{authorization:'Bearer '+token,accept:'application/json'},cache:'no-store'});
      const data=await res.json().catch(()=>null);
      if(version!==epoch.current||identity.current!==uid)return;
      const verified=await getToken();if(verified!==token)return;
      if(!res.ok||data?.ok!==true||data.scope!=='AUTHENTICATED_MEMBER_BETA'||data.tier!==target)
        throw Error('This edition is not authorized for the current member beta account.');
      setActiveEdition(target);setPremiumEvidence(data.features||{});
      appendInstructor('Your authenticated '+target+' educational evidence is available for this session. Select a documented teaching topic below. No private grades or cross-member progress are disclosed.','Verified private edition context');
      setStatus('Authenticated '+target+' member beta. The server has verified this edition.');
    }catch(e){setPremiumEvidence(null);setActiveEdition('FOUNDATION');setStatus(e instanceof Error?e.message:'Member tier validation failed.')}
  };
  const latestExchange=chat.length>=3&&chat[chat.length-1]?.who==='talia'?
    [...chat].reverse().find(line=>line.who==='member')?.text||'the current topic':'the current topic';
  const continueLesson=(kind:'clarify'|'challenge'|'transfer')=>{
    const subject=latestExchange.slice(0,170);
    const nextMode:Mode=kind==='clarify'?'explain':kind==='challenge'?'question':'practice';
    setMode(nextMode);
    const prompt=kind==='clarify'?'Continue our previous lesson about '+subject+'. Explain one difficult part more clearly, using a distinct fictional example. Do not assume I understood.':
      kind==='challenge'?'Continue our previous lesson about '+subject+'. Ask ONE evidence-based diagnostic question and wait for my attempt before correcting.':
      'Continue our previous lesson about '+subject+'. Give a different fictional transfer case and invite NO TRADE as an option; do not grade.';
    void submitTutor(prompt.slice(0,450),nextMode,'');
  };
  if(!member)return <main className="tc-main" aria-label="Talia membership access">
    <div className="tc-top"><div><p className="tc-eyebrow">THE STOCK MARKET: FROM THE GROUND UP / MEMBER TUTOR</p>
      <h1>Talia Interactive Classroom</h1><p>{status}</p>
      <p>The interactive chart, conversations and private study functions are available only to verified members. No personal API key is required.</p>
      <p><a href={'/signin.html?next='+encodeURIComponent(isTaliaPrototypePath()?'/talia-tutor-prototype.html':'/talia-classroom.html')}>Sign in with your membership</a></p>
    </div></div>
  </main>;
  return <main className="tc-main">
    <header className="tc-top tc-student-page-intro"><h1>Talia Classroom</h1><p>Study the chart with Talia. Only completed simulated candles are shown.</p></header>
    <section className="tc-teaching-selector" aria-labelledby="tc-teach-selector-title">
      <div className="tc-teaching-selector-heading"><h2 id="tc-teach-selector-title">Choose what Talia teaches</h2>
        <span className="tc-muted">Original lessons · no grades or trading signals</span></div>
      <div className="tc-teaching-choices">
        <label htmlFor="tc-teaching-topic">Lesson topic
          <select id="tc-teaching-topic" value={teachingTopic} onChange={e=>{setTeachingTopic(e.target.value);setTeachingStarted(false);setTeachingPhase('explain');setPracticeNotes('');setViewedSteps([])}} disabled={!teachingCatalog||busy}>
            {(teachingCatalog?.lessons||[{id:'candlesticks',title:'Reading candlesticks',chart:true}]).map(t=>
              <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </label>
        <label htmlFor="tc-teaching-depth">Teaching depth
          <select id="tc-teaching-depth" value={teachingDepth} onChange={e=>{setTeachingDepth(e.target.value as TeachingDepth);setTeachingStarted(false);setTeachingPhase('explain');setPracticeNotes('');setViewedSteps([])}} disabled={!teachingCatalog||busy}>
            {(['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE'] as const).map(t=>
              <option key={t} value={t} disabled={!teachingCatalog?.allowedDepths.includes(t)}>{t.charAt(0)+t.slice(1).toLowerCase()}{!teachingCatalog?.allowedDepths.includes(t)?' · Requires entitlement':''}</option>)}
          </select>
        </label>
        <button type="button" className="tc-teaching-start" onClick={()=>void teachSelected('explain')} disabled={!teachingCatalog||busy||!!checkpoint}>Start teaching</button>
      </div>
      {teachingCatalog&&<div className="tc-teaching-focus" aria-label="Selected lesson learning guide">
        <strong>{teachingCatalog.lessons.find(t=>t.id===teachingTopic)?.title||'Learning guide'}</strong>
        <p><b>Learning objective:</b> {teachingCatalog.lessons.find(t=>t.id===teachingTopic)?.objective||'Observe the evidence and test your reasoning.'}</p>
        <p><b>Evidence to inspect:</b> {teachingCatalog.lessons.find(t=>t.id===teachingTopic)?.evidence||'Completed observations.'}</p>
        <p><b>Limitation:</b> {teachingCatalog.lessons.find(t=>t.id===teachingTopic)?.limitation||'An example is not a prediction.'}</p>
        <small>{teachingCatalog.lessons.find(t=>t.id===teachingTopic)?.chart?'The nearby chart is a separate simulated example.':'This lesson uses rule-based examples; the nearby chart is optional context.'} Lesson examples do not necessarily match the chart.</small>
      </div>}
      {teachingCatalog?<div className="tc-teaching-progress">
        <span>Included with your Tutor access: up to {teachingCatalog.maximumDepth.charAt(0)+teachingCatalog.maximumDepth.slice(1).toLowerCase()}.</span>
        <span>Higher-tier members may select any lower teaching depth.</span><span>Viewed {viewedSteps.length} of 5 lesson steps in this tab · not a mastery record.</span></div>:
        <p className="tc-teaching-access" role="status">{teachingAccessError||'Checking your available lessons and membership teaching depth...'}</p>}
      {teachingStarted&&<div className="tc-teaching-steps" role="group" aria-label="Talia lesson steps">
        {([['explain','Explain'],['demonstrate','Demonstrate'],['practice','Practice'],['correct','Correct'],['transfer','Transfer']] as Array<[LessonPhase,string]>).map(([step,label])=>
          <button type="button" key={step} aria-pressed={teachingPhase===step} disabled={busy||!!checkpoint}
            onClick={()=>void teachSelected(step)}>{viewedSteps.includes(step)?'✓ ':''}{label}</button>)}
      </div>}
      {teachingStarted&&teachingPhase==='practice'&&<div className="tc-teaching-notebook">
        <label htmlFor="tc-practice-notes">Your ungraded practice working</label>
        <textarea id="tc-practice-notes" rows={3} maxLength={1200} value={practiceNotes}
          onChange={e=>setPracticeNotes(e.target.value)} disabled={busy||!!checkpoint}
          placeholder="Write your calculation, evidence, uncertainty, or why you would choose NO TRADE." />
        <div className="tc-teaching-notebook-actions"><small>Optional local notes. Talia will show a worked reference, not automatically grade your response. These notes are not sent to the lesson API or saved in Tutor history.</small>
          <button type="button" onClick={comparePractice} disabled={busy||!!checkpoint||practiceNotes.trim().length<3}>Compare with worked check</button></div>
      </div>}
    </section>
    {labHandoff&&<p className="tc-muted" role="note">Lab context: {labHandoff.id} · {labHandoff.stage}. Only the public registered Lab ID and learning stage are sent to Talia. Your assessment answers and progress remain in the Lab. <a href={'/labs.html?q='+encodeURIComponent(labHandoff.id)}>Return to Lab</a></p>}
    <div className="tc-grid tc-terminal-grid tc-terminal-split tc-student-workspace">
      <FictionalChart onQuestion={q=>void submitTutor(q,'explain','')} memberId={member.id} visible={visible} setVisible={setVisible}
      playing={playing} setPlaying={setPlaying} playSpeed={playSpeed} setPlaySpeed={setPlaySpeed}
      onPauseForQuestion={()=>pauseForQuestion()}/>
      <section className="tc-chat" aria-labelledby="tc-chat-title">
      <div className="tc-chat-top"><div><h2 id="tc-chat-title">Talia Mercer · Your Instructor</h2>{conversationLabel&&<p className="tc-muted">{conversationLabel}</p>}</div><span className="tc-pill">{member?'SIGNED IN':'MEMBER SIGN-IN REQUIRED'}</span></div>
      <ol className="tc-transcript" ref={log} role="log" aria-label="Talia conversation transcript" aria-live="polite" aria-relevant="additions">
        {chat.map(m=><li className={'tc-message tc-'+m.who} key={m.id}><strong>{m.who==='talia'?'Talia Mercer':'You'}</strong>
          <p>{m.id===typingId?<><span className="tc-screen-reader-only">{m.text}</span><span aria-hidden="true">{m.text.slice(0,typedCount)}{typedCount<m.text.length&&<span className="tc-typing-caret">▌</span>}</span></>:m.text}</p>
          {m.label&&<small>{m.label}</small>}</li>)}
      </ol>
      <div className="tc-typing-controls"><label>Text display speed <select aria-label="Talia typing speed" value={typingSpeed} onChange={e=>setTypingSpeed(Number(e.target.value))}>
        <option value={56}>Slow</option><option value={28}>Normal</option><option value={12}>Fast</option><option value={0}>Show instantly</option></select></label>
        <button type="button" className="tc-secondary" onClick={()=>{const last=chat.at(-1);if(last?.who==='talia')setTypedCount(last.text.length)}}>Show all text</button>
        {typingId&&typedCount<(chat.at(-1)?.text.length||0)&&<span role="status" className="tc-muted">Talia is displaying her explanation…</span>}
      </div>
      {busy&&<p className="tc-wait" role="status">Talia is preparing a source-grounded reply… <button type="button" onClick={()=>pending.current?.abort()}>Stop</button></p>}
      <form onSubmit={send} className="tc-composer">
        <label htmlFor="tc-question">Your question or follow-up</label>
        <textarea id="tc-question" value={question} onChange={e=>setQuestion(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();void submitTutor(question.trim(),mode,reasoning.trim())}}}
          maxLength={450} rows={3} placeholder="Message Talia… Enter to send · Shift+Enter for a new line" disabled={!member||busy||!!checkpoint}/>
        <div className="tc-row"><label htmlFor="tc-mode">Teaching mode</label>
          <select id="tc-mode" value={mode} onChange={e=>setMode(e.target.value as Mode)} disabled={!member||busy||(lessonKind!==null&&stageIndex>=3)}>
            <option value="explain">Explain concept</option><option value="question">Guided self-check</option>
            <option value="review">Review reasoning (ungraded)</option><option value="practice">Recommend practice</option>
          </select><span className="tc-muted">{question.length}/450</span>
        </div>
        {mode==='review'&&<><label htmlFor="tc-reasoning">Your reasoning (ungraded)</label>
          <textarea id="tc-reasoning" value={reasoning} onChange={e=>setReasoning(e.target.value)} maxLength={1800} rows={3} disabled={!member||busy}/>
          <fieldset><legend>Optional verified fictional calculation</legend>
            <label htmlFor="tc-practice-case">Practice case</label>
            <select id="tc-practice-case" value={practiceCase} onChange={e=>{
              const next=e.target.value as typeof practiceCase;setPracticeCase(next);setPracticeValue('');
              if(next==='canonical_candle_body_pct')setQuestion('Review my fictional candle body percentage calculation.');
              if(next==='canonical_vwap_trade_groups')setQuestion('Review my fictional volume weighted average price calculation.');
            }} disabled={!member||busy}>
              <option value="none">No numerical verification</option>
              <option value="canonical_candle_body_pct">Candle: O 31, H 32.50, L 30.50, C 32 — body % of range</option>
              <option value="canonical_vwap_trade_groups">VWAP: 200 shares at $8, 100 shares at $10</option>
            </select>
            {practiceCase!=='none'&&<><label htmlFor="tc-practice-value">Your numerical result</label>
              <input id="tc-practice-value" inputMode="decimal" value={practiceValue} onChange={e=>setPracticeValue(e.target.value.slice(0,24))} disabled={!member||busy}/>
              <p className="tc-muted">Talia recomputes this public fictional case on the server, explains a verified known error when the number supports one, then gives a different transfer case. This is not an official grade.</p></>}
          </fieldset></>}
        <div className="tc-row tc-row-between">
          <label className="tc-check"><input type="checkbox" checked={save} onChange={e=>setSave(e.target.checked)} disabled={!member||busy}/> Save responses to private Tutor history</label>
          <button type="submit" disabled={!member||busy||!!checkpoint||question.trim().length<4}>Send to Talia</button>
        </div>
        {!member&&<p><a href={'/signin.html?next='+encodeURIComponent(isTaliaPrototypePath()?'/talia-tutor-prototype.html':'/talia-classroom.html')}>Sign in to use the member classroom</a></p>}
      </form>
      <details className="tc-example-questions"><summary>Suggested questions</summary><div className="tc-chipbar" aria-label="Example questions">
        {EXAMPLES.map(item=><button type="button" key={item} disabled={busy||!!checkpoint} onClick={()=>void submitTutor(item,'explain','')}>{item}</button>)}
      </div></details>
      {advancedExperience&&<details className="tc-guided-lesson" open={!!lessonKind}><summary>{lessonKind?'Guided lesson · '+lessonKind:'Choose a guided lesson'}</summary><section className="tc-live-lesson" aria-label="Talia synchronized interactive lesson">
        <div className="tc-row tc-row-between"><h3>Teach with the chart</h3><span className="tc-pill">Original fictional · ungraded</span></div>
        <p>Talia reveals completed candles, types explanations and pauses automatically for multiple-choice or numerical questions. Free corrections and unlimited practice retries are available.</p>
        <div className="tc-row">
          <button type="button" onClick={()=>startLesson('candles')} disabled={busy}>Start candle-reading lesson</button>
          <button type="button" onClick={()=>startLesson('body-range')} disabled={busy}>Start body, range & percentage</button>
          <button type="button" onClick={()=>startLesson('vwap')} disabled={busy}>Start VWAP calculation</button>
        </div>
        <div className="tc-row tc-row-between"><span>Lesson: {lessonKind||'Select a teaching sequence'}</span>
          <span role="status">{playing?'Chart playing':checkpoint?'Paused for your answer':'Chart paused'} · {visible} revealed candles</span></div>
        {lessonKind&&<><div className="tc-stage-grid" aria-label="Ten displayed lesson steps, nine saved Learning Engine stages">
          {displayStages.map((item,i)=><span key={item} className={i===stageIndex?'tc-stage-active':''}>{i+1}. {item}</span>)}
        </div><p className="tc-muted">Ten visible instructional steps; the approved nine-stage Learning Engine and protected progress are unchanged. This demonstration creates no official grade.</p></>}
        <details className="tc-learning-report"><summary>My learning report — ungraded activity only</summary>
          <p>Completed practice checkpoints: {studyReport.completed} · Corrective retries: {studyReport.retries} · Skipped: {studyReport.skipped}</p>
          <p>Latest activity: {studyReport.latest}</p>
          <p>These are temporary in-tab practice counters, not a saved Assessment, official proficiency measure, entitlement change or Lumens award.</p>
        </details>
        {checkpoint&&<TeachingCheckpoint key={checkpoint.id} checkpoint={checkpoint} bar={REPLAY[visible-1]}
          onComplete={checkpointCompleted} onFeedback={checkpointFeedback} onSkip={checkpointSkipped}/>}
        {!checkpoint&&lessonKind&&<p className="tc-muted">Use Auto Play to continue. You can pause, zoom, inspect the accessible candle table, or ask Talia a follow-up at any point.</p>}
      </section></details>}
      <details className="tc-advanced-tutor-options" hidden={!advancedExperience}><summary>Additional tutoring options</summary>
      {advancedExperience&&<section className="tc-premium-bridge" aria-label="Authenticated Tutor tier teaching">
        <h3>Personalized Tutor editions <span className="tc-pill">{activeEdition}</span></h3>
        <p className="tc-muted">Beta features are available only after the server confirms your signed-in membership. These controls do not change subscriptions or publish premium features.</p>
        <div className="tc-row">{(['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE'] as const).map(edition=>
          <button key={edition} type="button" className="tc-secondary" aria-pressed={activeEdition===edition} disabled={busy}
            onClick={()=>void selectEdition(edition)}>{edition.charAt(0)+edition.slice(1).toLowerCase()}</button>)}</div>
        {premiumEvidence&&Object.entries(premiumEvidence).map(([id,feature])=>{
          const prompt=[feature.coachingPrompt,feature.lessonPrompt,feature.studyPrompt,feature.nextPrompt,feature.prompt]
            .find(x=>typeof x==='string'&&x.length>=12&&x.length<=450);
          return <details key={id} className="tc-premium-topic"><summary>{id} · {String(feature.capability||'Verified study evidence')}</summary>
            <p className="tc-muted">Authenticated source evidence; independent learning assessments and market rights are not inferred.</p>
            {typeof prompt==='string'&&<button type="button" disabled={busy||!!checkpoint} onClick={()=>void submitTutor(prompt,'explain','')}>Discuss this evidence with Talia</button>}
          </details>;
        })}
      </section>}
      {advancedExperience&&<section className="tp-instruction-engine" aria-label="Six-phase guided lesson">
        <div className="tp-instruction-header"><div><strong>Guided lesson pathway</strong><p>Instructor-directed practice, not a grade or verified mastery record.</p></div><span>{attempts} Tutor exchanges in this session</span></div>
        <div className="tp-instruction-controls">
          <label>Current study focus<input value={sessionTopic} maxLength={90} onChange={e=>setSessionTopic(e.target.value)} aria-label="Current study focus"/></label>
          <button type="button" className="tc-secondary" onClick={teachFocus} disabled={busy||!!checkpoint}>Teach this focus now</button>
          <label>Practice dimension<select value={dimension} onChange={e=>setDimension(e.target.value as typeof dimension)}>
            <option>Knowledge</option><option>Recognition</option><option>Decision</option><option>Process</option>
          </select></label>
        </div>
        <div className="tp-instruction-controls" aria-label="Instructional method and perspective">
          <label>Teaching perspective<select value={perspective} onChange={e=>setPerspective(e.target.value as Perspective)}>
            {perspectives.map(item=><option key={item}>{item}</option>)}
          </select></label>
          <label>Teaching method<select value={method} onChange={e=>setMethod(e.target.value as Method)}>
            {methods.map(item=><option key={item}>{item}</option>)}
          </select></label>
        </div>
        <div className="tp-instruction-controls" aria-label="Personalized instructional support">
          <label>Where are you getting stuck?<select value={misconception} onChange={e=>setMisconception(e.target.value)}>
            <option value="observation">Observation versus prediction</option>
            <option value="structure">Market structure confirmation</option>
            <option value="indicator">Indicator signals and lag</option>
            <option value="risk">Risk and invalidation</option>
            <option value="lookahead">Historical replay look-ahead</option>
          </select></label>
          <label>How confident do you feel?<select value={confidence} onChange={e=>setConfidence(e.target.value)}>
            <option value="unsure">Not confident yet</option><option value="developing">Developing confidence</option><option value="confident">Ready for a harder case</option>
          </select></label>
        </div>
        <div className="tc-row"><button type="button" className="tc-secondary" onClick={requestCorrection} disabled={busy}>Help me correct this</button>
          <button type="button" className="tc-secondary" onClick={requestRecommendation} disabled={busy}>Recommend my next practice</button></div>
        <div className="tp-instruction-steps" role="group" aria-label="Instruction phases">
          {phases.map((p,i)=><button type="button" key={p} aria-pressed={phase===p} onClick={()=>{preparePhase(p);if(p==='Attempt'||p==='Retry')pauseForQuestion();else if(p!=='Correct')void submitTutor((sessionTopic+'. '+phaseInstructions[p].prompt).slice(0,450),phaseInstructions[p].mode,'')}} disabled={busy}><span>{String(i+1).padStart(2,'0')}</span>{p}</button>)}
        </div>
        <p className="tc-muted">Current instructional lens: {dimension} · {perspective} · {method}. Select a phase to prepare an editable question. Only the existing authenticated Tutor API can provide the explanation; this prototype does not assign scores.</p>
      </section>}
      </details>
      {advancedExperience&&chat.length>=3&&chat[chat.length-1]?.who==='talia'&&
        <section className="tp-followup" aria-label="Continue the current learning session">
          <strong>Continue this lesson</strong>
          <p className="tc-muted">Choose how Talia should build on the conversation. You can edit the question before submitting it.</p>
          <div className="tc-row">
            <button type="button" className="tc-secondary" onClick={()=>continueLesson('clarify')} disabled={busy}>Explain it another way</button>
            <button type="button" className="tc-secondary" onClick={()=>continueLesson('challenge')} disabled={busy}>Check my understanding</button>
            <button type="button" className="tc-secondary" onClick={()=>continueLesson('transfer')} disabled={busy}>Practice a new scenario</button>
          </div>
          <p className="tc-muted">For verified server-side follow-up context, create or select an authorized private conversation and enable saving.</p>
        </section>}
      {advancedExperience&&<section className="tp-teaching-loop" aria-label="Progressive ungraded instructional pathway">
        <div className="tp-teaching-loop-heading"><strong>Guided learning cycle</strong><span>Choose a phase; review the prepared question and submit it to the authenticated Tutor.</span></div>
        <div className="tp-teaching-loop-actions">
          <button type="button" className="tc-secondary" onClick={()=>{setMode('explain');void submitTutor('Teach this concept from first principles with a fully worked fictional example and describe the observable evidence.','explain','')}}>1 · Explain & demonstrate</button>
          <button type="button" className="tc-secondary" onClick={()=>{setMode('question');pauseForQuestion()}}>2 · Diagnose understanding</button>
          <button type="button" className="tc-secondary" onClick={()=>{setMode('review');safeSuggest('Identify a misconception in my reasoning, explain why it fails using completed evidence, and guide me toward a correction without giving a protected answer key.')}}>3 · Correct reasoning</button>
          <button type="button" className="tc-secondary" onClick={()=>{setMode('practice');void submitTutor('Give me a new fictional transfer scenario requiring an independent decision, including NO TRADE as an option. Do not grade it.','practice','')}}>4 · Independent transfer</button>
        </div>
        <p className="tc-muted">Ungraded teaching aid. These prompts do not advance a Lab stage, generate mastery credits, or record a protected assessment.</p>
      </section>}

      <p className="tc-status" role="status" aria-live="polite">{status}</p>
      <div className="tc-row tc-actions">
        <button type="button" className="tc-secondary" onClick={()=>{pending.current?.abort();epoch.current++;setBusy(false);setQuestion('');setReasoning('');setPracticeCase('none');setPracticeValue('');setMode('explain');setPhase('Observe');setAttempts(0);setMisconception('observation');setConfidence('unsure');setPerspective('Understand');setMethod('I DO');setChat(DEFAULT);setConversationId(null);setConversationLabel('');setSave(false);
          setPlaying(false);setVisible(7);setLessonKind(null);setCheckpoint(null);setStageIndex(0);
          setStudyReport({completed:0,retries:0,skipped:0,latest:'No ungraded question submitted'});
          setStatus('New unsaved lesson started. Previous private history was not deleted.')}}>New unsaved topic</button>
        <button type="button" className="tc-secondary" onClick={()=>void newConversation()} disabled={!member||busy}>Create private conversation</button>
        <button type="button" className="tc-secondary" onClick={()=>void loadHistory()} disabled={!member||busy}>Load my saved history</button>
      </div>
      <p className="tc-muted">This classroom uses the existing authenticated Tutor API and approved source materials. It does not use paid model inference, award grades, access protected answer keys, or send future market bars. Saved follow-up context is verified only when the server confirms the member-owned conversation.</p>
    </section></div>
  </main>;
}
const host=document.getElementById('talia-classroom-root');if(host)createRoot(host).render(<Classroom/>);
