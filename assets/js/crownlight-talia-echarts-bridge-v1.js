/* Crownlight read-only chart-to-Talia visual bridge.
 * Existing revealed-bar event -> existing indicator math -> existing
 * deterministic chart Tutor -> ECharts. No API, grades or market feeds.
 * An event is NOT server authorization. Verify a signed-in Supabase user and
 * rely on the existing source/chart controller to enforce replay entitlement.
 */
(function(root){
 'use strict';
 const host=document.getElementById('crownlight-talia-echarts-visual');
 if(!host)return;
 const plot=host.querySelector('[data-talia-echarts-plot]');
 const body=host.querySelector('[data-talia-echarts-values]');
 const status=host.querySelector('[data-talia-echarts-status]');
 const teaching=host.querySelector('[data-talia-echarts-teaching]');
 if(!plot||!body||!status||!teaching)return;
 let chart=null,observer=null,revision=0,memberId=null,authClient=null;
 let checkedAt=0,verified=false,visibleCount=0,initialized=false;
 const MAX_BARS=2500;
 const finite=v=>typeof v==='number'&&Number.isFinite(v);
 const fmt=v=>finite(v)?v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:4}):'Warm-up / unavailable';
 const note='The visual uses only the completed candles currently revealed by the chart. No future candle is used. EMA requires its full seed; HLC3-volume VWAP is an estimate, not trade-print VWAP. This is ungraded teaching, not a signal, score or official Talia AI conversation.';
 const add=(type,text)=>{const node=document.createElement(type);node.textContent=text;return node};
 function clear(reason){
  revision++;visibleCount=0;chart?.dispose();chart=null;
  observer?.disconnect();observer=null;plot.hidden=true;body.replaceChildren();
  teaching.replaceChildren();status.textContent=reason||'Awaiting revealed candles from the active member chart.';
 }
 function validate(detail){
  const rows=detail?.bars;
  if(!Array.isArray(rows)||!rows.length||rows.length>MAX_BARS)return null;
  const parsed=[];let previous=0;
  for(const row of rows){
   if(!row||typeof row!=='object'||!['timestamp','open','high','low','close','volume'].every(
    key=>Object.hasOwn(row,key)&&row[key]!==null&&row[key]!==''))return null;
   const t=row.timestamp,o=row.open,h=row.high,l=row.low,c=row.close,v=row.volume;
   if(!Number.isSafeInteger(t)||t<=previous||t<=0||
    ![o,h,l,c,v].every(finite)||o<0||c<0||l<0||v<0||
    h<Math.max(o,c)||l>Math.min(o,c)||h<l)return null;
   previous=t;parsed.push({time:new Date(t),open:o,high:h,low:l,close:c,volume:v});
  }
  if(!parsed.every(row=>Number.isFinite(row.time.getTime())))return null;
  return parsed;
 }
 async function memberVerified(){
  if(!root.getSupabaseClient)return false;
  try{
   if(!authClient){
    const sb=await root.getSupabaseClient();
    if(!sb?.auth?.getUser||!sb?.auth?.getSession||!sb?.auth?.onAuthStateChange)return false;
    authClient=sb.auth;
    authClient.onAuthStateChange((event,session)=>{
     const id=session?.user?.id||null;
     if(event==='SIGNED_OUT'||event==='USER_DELETED'||(memberId&&id&&id!==memberId)){
      memberId=null;checkedAt=0;verified=false;
      clear('Member session changed. Sign in and open an authorized chart again.');
     }
    });
   }
   // Session identity is inexpensive to read and prevents cache reuse across
   // account switches even before a delayed Auth callback is delivered.
   const sessionState=await authClient.getSession();
   const currentId=sessionState?.data?.session?.user?.id||null;
   if(sessionState?.error||!currentId){verified=false;memberId=null;checkedAt=0;return false}
   if(memberId&&memberId!==currentId){
    verified=false;memberId=null;checkedAt=0;
    clear('Member changed. Previous chart context cleared.');
   }
   if(verified&&memberId===currentId&&checkedAt&&Date.now()-checkedAt<15000)return true;
   const result=await authClient.getUser();
   const uid=result?.data?.user?.id||null;
   if(result?.error||!uid||uid!==currentId)return false;
   if(memberId&&memberId!==uid)clear('Member changed. Previous teaching view cleared.');
   memberId=uid;verified=true;checkedAt=Date.now();
   return true;
  }catch{return false}
 }
 function fillFacts(history,series,tutor,source){
  const i=history.length-1,bar=history[i];
  const lines=[
   ['Last completed candle',String(i+1)+' of '+history.length],
   ['Close',fmt(bar.close)],
   ['EMA 9',fmt(series.ema9[i])],
   ['EMA 20',fmt(series.ema20[i])],
   ['HLC3-volume VWAP estimate',fmt(series.vwap[i])]
  ];
  body.replaceChildren();
  for(const [name,value] of lines){
   const tr=add('tr');const label=add('th',name);label.scope='row';
   tr.append(label,add('td',value));body.append(tr);
  }
  teaching.replaceChildren();
  if(tutor?.facts?.length){
   const heading=add('h4','Talia · What the revealed indicators establish');
   teaching.append(heading);
   for(const fact of tutor.facts.slice(0,4)){
    if(typeof fact?.reading!=='string'||typeof fact?.name!=='string')continue;
    teaching.append(add('p',fact.name+': '+fact.reading));
   }
   if(tutor.questions?.[0])teaching.append(add('p','Practice question: '+tutor.questions[0]));
  }else teaching.append(add('p','The deterministic chart Tutor is unavailable; the factual study table remains.'));
  teaching.append(add('p',note));
  const description='Chart teaching from the first '+history.length+
   ' revealed completed candles only. No next candle or protected assessment. '+source;
  plot.setAttribute('aria-label',description);
 }
 async function show(event){
  const seq=++revision;
  const history=validate(event?.detail);
  if(!history){clear('No valid completed-bar chart evidence; previous view cleared.');return}
  const ok=await memberVerified();
  if(seq!==revision)return;
  if(!ok){clear('Sign in to view chart-linked Talia instruction.');return}
  const math=root.CrownlightIndicatorMath,tutor=root.CrownlightChartTutor;
  const kit=root.CrownlightVisualKitV1;
  if(!math?.ema||!math?.vwapProxy||!kit?.indicatorSeries){
   clear('Validated chart mathematics or ECharts adapter is unavailable.');return;
  }
  const closes=history.map(row=>row.close);
  const series={ema9:math.ema(closes,9),ema20:math.ema(closes,20),vwap:math.vwapProxy(history)};
  if(!Object.values(series).every(v=>Array.isArray(v)&&v.length===history.length)){
   clear('Indicator results are incomplete.');return;
  }
  const source=String(event.detail.source||'unspecified source').replace(/[^a-zA-Z0-9 _.:/-]/g,'').slice(0,55);
  const inputs=[
   ['EMA 9',series.ema9],['EMA 20',series.ema20],
   ['HLC3-volume VWAP estimate',series.vwap]
  ];
  const overlay=inputs.map(([label,values])=>kit.indicatorSeries({
   label,sourceLabel:'Source declared by active chart: '+source,
   visibleThroughBar:history.length-1,
   points:values.map((value,bar)=>({bar,value:finite(value)?value:null}))
  }));
  if(overlay.some(x=>!x)){clear('Chart indicator cutoff validation failed.');return}
  let interpretation=null;
  try{interpretation=tutor?.analyze?.(history)||null}catch{interpretation=null}
  fillFacts(history,series,interpretation,source);
  visibleCount=history.length;
  status.textContent='Displaying '+visibleCount+' completed revealed candles · declared source '+source+
   ' · ungraded instructional chart. Membership entitlements remain enforced by the existing chart controller.';
  if(!root.CrownlightECharts?.load){
   plot.hidden=true;status.textContent+=' Exact numeric table remains available.';return;
  }
  try{
   const engine=await root.CrownlightECharts.load();
   if(seq!==revision||!verified)return;
   if(!chart){
    plot.hidden=false;chart=engine.init(plot,null,{renderer:'svg'});
    if(typeof ResizeObserver==='function'){
     observer=new ResizeObserver(()=>chart?.resize());observer.observe(plot);
    }
   }else plot.hidden=false;
   const colors=['#6ddac1','#f5c777','#9ab8ff'];
   const lines=overlay.map((item,i)=>({
    ...item,lineStyle:{...item.lineStyle,color:colors[i],width:2.5},
    itemStyle:{color:colors[i]}
   }));
   chart.setOption({
    animation:!root.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,
    backgroundColor:'transparent',
    aria:{show:true,description:plot.getAttribute('aria-label')},
    textStyle:{color:'#e8f3fa'},
    legend:{top:4,textStyle:{color:'#e1f0f8'}},
    grid:{left:58,right:25,top:54,bottom:58},
    tooltip:{trigger:'axis',renderMode:'richText',axisPointer:{type:'cross'},
     valueFormatter:value=>finite(value)?fmt(value):'Warm-up / unavailable'},
    xAxis:{type:'value',min:0,max:Math.max(1,history.length-1),
     name:'Revealed completed candle index (0-based)',
     nameLocation:'middle',nameGap:31,
     axisLabel:{color:'#d7e8f3'},splitLine:{lineStyle:{color:'rgba(183,211,227,.12)'}}},
    yAxis:{type:'value',scale:true,axisLabel:{color:'#d7e8f3'},
     splitLine:{lineStyle:{color:'rgba(183,211,227,.15)'}}},
    series:lines
   },{notMerge:true});
   chart.resize();
  }catch{
   if(seq===revision){
    observer?.disconnect();observer=null;chart?.dispose();chart=null;
    plot.hidden=true;status.textContent+=' Interactive chart unavailable; factual table and guidance remain.';
   }
  }
 }
 root.addEventListener('crownlight:revealed-bars',event=>{void show(event)});
 root.addEventListener('crownlight:member-changed',()=>{
  memberId=null;verified=false;checkedAt=0;
  clear('Member context changed. Teaching view cleared.');
 });
 root.addEventListener('pagehide',()=>clear('Page hidden.'));
 clear('Awaiting authorized revealed candles from the active chart.');
 root.CrownlightTaliaEChartsBridgeV1=Object.freeze({
  getStatus:()=>({ready:!!chart,visibleCount,memberVerified:!!memberId&&verified})
 });
})(window);
