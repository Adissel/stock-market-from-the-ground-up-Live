/* Free Foundations learning-activity visuals. Source: verified same-member
 * /api/bootcamp-academy response via dashboard.js; never scores or mastery.
 * Apache ECharts is presentation-only and optional. No new authenticated read.
 */
(function(root){
 'use strict';
 if(!/^\/dashboard(?:\.html)?$/i.test(root.location.pathname))return;
 let host=null,plot=null,chart=null,observer=null,revision=0,days=null,identity=null;
 const DOMAINS=[
  {name:'Knowledge',days:[1,3]},{name:'Recognition',days:[2]},
  {name:'Decision',days:[4]},{name:'Process',days:[5]}
 ];
 const create=(name,text)=>{const el=document.createElement(name);
  if(text!==undefined)el.textContent=text;return el;};
 const isValid=rows=>Array.isArray(rows)&&rows.length===5&&
  rows.every((row,index)=>row&&row.day===index+1&&
   ['saved','started','not_started'].includes(row.status));
 const saved=day=>days?.find(x=>x.day===day)?.status==='saved';
 const count=ids=>ids.filter(saved).length;
 function ensure(){
  if(host?.isConnected)return true;
  const anchor=document.getElementById('free-reflection-progress');
  const panel=document.getElementById('free-learning-launchpad');
  if(!anchor||!panel||panel.hidden)return false;
  host=create('section');host.id='free-foundations-echarts';
  host.setAttribute('aria-label','Your private Free Foundations study activity');
  const head=create('div');head.className='ffe-head';
  const words=create('div');words.append(
   Object.assign(create('p','MY LEARNING · FIVE-DAY ACTIVITY'),{className:'ffe-kicker'}),
   create('h3','Your Free Foundations progress'),
   create('p','Saved guided reflections are practice evidence, not graded assessments or verified mastery.')
  );head.append(words);
  const label=create('label','View ');
  const select=create('select');select.setAttribute('aria-label','Choose Free Foundations chart view');
  for(const [value,text] of [['days','Five study days'],['domains','Four learning domains']]){
   const option=create('option',text);option.value=value;select.append(option);
  }
  select.addEventListener('change',draw);label.append(select);head.append(label);
  plot=create('div');plot.className='ffe-chart';
  plot.setAttribute('role','img');
  const table=create('table');table.className='ffe-table';
  const caption=create('caption','Exact counts from the current verified five-day study record');
  const tbody=create('tbody');
  const thead=create('thead');
  const header=create('tr');
  for(const label of ['Study area','Saved','Available']){
   const th=create('th',label);th.scope='col';header.append(th);
  }
  thead.append(header);table.append(caption,thead,tbody);
  const note=create('p');note.className='ffe-note';note.setAttribute('role','status');
  host.append(head,plot,table,note);
  anchor.insertAdjacentElement('afterend',host);
  host._select=select;host._tbody=tbody;host._note=note;
  return true;
 }
 function draw(){
  if(!days||!host?.isConnected)return;
  const domainMode=host._select.value==='domains';
  const values=domainMode?DOMAINS.map(x=>({
   label:x.name,saved:count(x.days),available:x.days.length
  })):days.map(x=>({label:'Day '+x.day,saved:x.status==='saved'?1:0,available:1}));
  host._tbody.replaceChildren();
  for(const value of values){
   const row=create('tr');
   const name=create('th',value.label);name.scope='row';
   row.append(name,create('td',String(value.saved)),create('td',String(value.available)));
   host._tbody.append(row);
  }
  const total=count([1,2,3,4,5]);
  host._note.textContent=total+' / 5 saved reflections · '+(5-total)+
   ' not saved. This does not establish assessment scores or competency mastery.';
  plot.setAttribute('aria-label',(domainMode?'Learning domain':'Study day')+
   ' activity: '+values.map(x=>x.label+' '+x.saved+' of '+x.available+' saved').join('; ')+
   '. Ungraded reflections only.');
  if(!chart)return;
  // Shared source-neutral visual option factory. Legacy ECharts renderer stays as
  // a nonbreaking fallback for deployments that do not yet load the kit.
  const shared=root.CrownlightVisualKitV1?.barOptions({
   kind:'progress',sourceLabel:'Authenticated five-day Free Foundations saved reflections',
   reducedMotion:!!root.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,
   items:values.map(x=>({label:x.label,value:x.saved,capacity:x.available}))
  });
  if(shared){
   shared.aria.description=plot.getAttribute('aria-label');
   shared.grid={left:domainMode?106:80,right:44,top:18,bottom:30};
   chart.setOption(shared,{notMerge:true});chart.resize();return;
  }
  const max=Math.max(...values.map(x=>x.available),1);
  chart.setOption({
   animation:!root.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,
   animationDuration:240,
   aria:{show:true,description:plot.getAttribute('aria-label')},
   backgroundColor:'transparent',
   grid:{left:domainMode?106:80,right:48,top:18,bottom:30},
   xAxis:{type:'value',min:0,max,interval:1,
    axisLabel:{color:'#d9eaf2',formatter:v=>Number.isInteger(v)?String(v):''},
    splitLine:{lineStyle:{color:'rgba(183,221,235,.14)',type:'dashed'}}},
   yAxis:{type:'category',inverse:true,data:values.map(x=>x.label),
    axisLabel:{color:'#f0f7fa',fontWeight:600},
    axisLine:{show:false},axisTick:{show:false}},
   tooltip:{trigger:'axis',axisPointer:{type:'shadow'},
    formatter:p=>p[0]?.axisValue+': '+values[p[0]?.dataIndex]?.saved+' / '+
     values[p[0]?.dataIndex]?.available+' reflections saved',
    backgroundColor:'#112c3e',borderColor:'#7495a5',textStyle:{color:'#f0f7fa'}},
   series:[
    {type:'bar',name:'Available',data:values.map(x=>x.available),
     silent:true,barWidth:22,barGap:'-100%',
     itemStyle:{color:'rgba(141,180,197,.25)',borderRadius:5}},
    {type:'bar',name:'Saved',data:values.map(x=>x.saved),
     barWidth:22,barGap:'-100%',itemStyle:{color:'#66d8bd',borderRadius:5},
     label:{show:true,position:'right',color:'#eff9fb',fontWeight:700,
      formatter:p=>p.value?String(p.value):''}}
   ]
  },{notMerge:true});
  chart.resize();
 }
 async function receive(event){
  const received=event?.detail;
  if(received?.verified!==true||!isValid(received.days))return;
  if(!ensure())return;
  days=received.days.map(x=>({day:x.day,status:x.status}));
  const current=++revision;
  draw();
  if(chart)return;
  if(!root.CrownlightECharts?.load){
   host._note.textContent+=' Chart unavailable; exact table remains available.';return;
  }
  try{
   const engine=await root.CrownlightECharts.load();
   if(revision!==current||!days||!host?.isConnected)return;
   chart=engine.init(plot,null,{renderer:'svg'});
   if(typeof ResizeObserver==='function'){
    observer=new ResizeObserver(()=>chart?.resize());observer.observe(plot);
   }
   draw();
  }catch{
   if(current===revision&&host)host._note.textContent+=' Chart unavailable; exact table remains available.';
  }
 }
 function clear(){
  ++revision;days=null;observer?.disconnect();observer=null;
  chart?.dispose();chart=null;host?.remove();host=null;plot=null;
 }
 document.addEventListener('smfgu:free-foundations-evidence',receive);
 document.addEventListener('smfgu:free-foundations-unavailable',clear);
 root.addEventListener('crownlight:member-changed',clear);
 root.addEventListener('pagehide',clear);
 if(typeof root.getSupabaseClient==='function'){
  void root.getSupabaseClient().then(sb=>{
   if(!sb?.auth)return;
   void sb.auth.getSession().then(({data})=>{identity=data?.session?.user?.id||null}).catch(()=>{});
   sb.auth.onAuthStateChange((event,session)=>{
    const now=session?.user?.id||null;
    if(event==='SIGNED_OUT'||(identity&&now&&identity!==now))clear();
    identity=event==='SIGNED_OUT'?null:now||identity;
   });
  }).catch(()=>{});
 }
 root.CrownlightFreeFoundationAnalytics={getStatus:()=>({
  rendered:!!chart,verified:!!days,savedDays:days?count([1,2,3,4,5]):null
 })};
})(window);
