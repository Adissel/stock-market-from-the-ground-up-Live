/* SMFGU-VIS-CONTRACT-001: pure, data-source-neutral Apache ECharts options.
 * Render-only: no fetch, grading, study math, persistence or entitlement checks.
 * Callers MUST obtain already-authorized and provenance-checked source data.
 * Every visible chart also requires a consumer-owned semantic data table.
 */
(function(root){
 'use strict';
 const MAX_ROWS=24,MAX_POINTS=5000;
 const safeCount=x=>Number.isSafeInteger(x)&&x>=0;
 const safeBar=x=>Number.isSafeInteger(x)&&x>=0&&x<=10000000;
 const safeLabel=(value,max=96)=>typeof value==='string'&&
  value.trim().length>0&&value.length<=max&&!/[\x00-\x1f\x7f]/.test(value);
 function checkedItems(input){
  if(!input||!['counts','progress'].includes(input.kind)||
   !safeLabel(input.sourceLabel,160)||
   !Array.isArray(input.items)||!input.items.length||input.items.length>MAX_ROWS)return null;
  const used=new Set(),rows=[];
  for(const row of input.items){
   if(!row||!safeLabel(row.label)||!safeCount(row.value)||
    used.has(row.label.trim()))return null;
   used.add(row.label.trim());
   if(input.kind==='progress'){
    if(!safeCount(row.capacity)||row.value>row.capacity)return null;
    rows.push({label:row.label.trim(),value:row.value,capacity:row.capacity});
   }else{
    if(Object.hasOwn(row,'capacity'))return null;
    rows.push({label:row.label.trim(),value:row.value});
   }
  }
  return rows;
 }
 function barOptions(input){
  const rows=checkedItems(input);
  if(!rows)return null;
  const progress=input.kind==='progress';
  const visible=rows.map(x=>x.value);
  const max=Math.max(1,...rows.map(x=>progress?x.capacity:x.value));
  const source=input.sourceLabel.trim();
  const summary=rows.map(x=>x.label+': '+x.value+
   (progress?' of '+x.capacity:'')).join('; ');
  const common={
   animation:input.reducedMotion!==true,
   animationDuration:260,
   animationDurationUpdate:150,
   backgroundColor:'transparent',
   textStyle:{color:'#e6f2f8'},
   aria:{show:true,description:(progress?
    'Observed activity counts compared with available items. Not an assessment or mastery result. ':
    'Counts of different record types. Not percentages of a shared total or a time series. ')+
    'Upstream source: '+source+'. '+summary},
   grid:{left:16,right:54,top:16,bottom:26,containLabel:true},
   xAxis:{type:'value',min:0,...(progress?{max,interval:1}:{}),
    axisLabel:{color:'#d6eaf2',formatter:value=>Number(value).toLocaleString('en-US')},
    axisLine:{show:false},axisTick:{show:false},
    splitLine:{lineStyle:{color:'rgba(176,212,226,.17)',type:'dashed'}}},
   yAxis:{type:'category',inverse:true,data:rows.map(x=>x.label),
    axisLabel:{color:'#edf7fa',fontWeight:600,overflow:'truncate',width:155},
    axisLine:{show:false},axisTick:{show:false}},
   tooltip:{trigger:'axis',renderMode:'richText',axisPointer:{type:'shadow'},
    backgroundColor:'#102839',borderColor:'#638c9c',
    textStyle:{color:'#f0f7fb'},
    formatter:params=>{
     const row=rows[params?.[0]?.dataIndex];
     return row?(progress?
      row.label+': '+row.value+' / '+row.capacity+' items recorded':
      row.label+': '+row.value.toLocaleString('en-US')+' records'):'';
    }},
   series:[]
  };
  if(progress){
   common.series.push({name:'Available',type:'bar',silent:true,
    data:rows.map(x=>x.capacity),barWidth:22,barGap:'-100%',
    itemStyle:{color:'rgba(139,181,197,.25)',borderRadius:5}});
   common.series.push({name:'Recorded',type:'bar',data:visible,
    barWidth:22,barGap:'-100%',
    itemStyle:{color:'#67d6bb',borderRadius:5},
    label:{show:true,position:'right',distance:7,color:'#eef9fc',
     formatter:p=>p.value?Number(p.value).toLocaleString('en-US'):''}});
  }else{
   common.series.push({name:'Recorded',type:'bar',data:visible,
    barMaxWidth:27,showBackground:true,
    backgroundStyle:{color:'rgba(139,181,197,.12)',borderRadius:5},
    itemStyle:{color:'#5bbbe2',borderRadius:[0,6,6,0]},
    label:{show:true,position:'right',distance:8,color:'#eef9fc',
     formatter:p=>Number(p.value).toLocaleString('en-US')}});
  }
  return common;
 }
 function indicatorSeries(input){
  if(!input||!safeLabel(input.label)||!safeLabel(input.sourceLabel,160)||
   !safeBar(input.visibleThroughBar)||
   !Array.isArray(input.points)||input.points.length===0||
   input.points.length>MAX_POINTS)return null;
  let previous=-1;
  const available=[];
  for(const p of input.points){
   if(!p||!safeBar(p.bar)||p.bar<=previous||
    !(p.value===null||(typeof p.value==='number'&&Number.isFinite(p.value))))return null;
   previous=p.bar;
   if(p.bar<=input.visibleThroughBar)available.push([p.bar,p.value]);
  }
  if(!available.length)return null;
  // Never interpolate hidden future observations or convert missing seed values to 0.
  return {name:input.label.trim(),type:'line',data:available,
   showSymbol:false,symbol:'none',connectNulls:false,silent:true,
   sampling:'none',lineStyle:{width:2,color:'#65d2c1'},
   itemStyle:{color:'#65d2c1'},
   emphasis:{disabled:true},
   smfguSourceLabel:input.sourceLabel.trim(),
   smfguVisibleThroughBar:input.visibleThroughBar};
 }
 root.CrownlightVisualKitV1=Object.freeze({
  version:'1.0.0',barOptions,indicatorSeries
 });
})(typeof window!=='undefined'?window:globalThis);
