/* Owner/Admin operational snapshots, rendered from the existing authorized
 * dashboard event. This is not historical revenue or a member analytics API.
 * All data tables remain accessible if canvas rendering is unavailable.
 */
(function(root){
 'use strict';
 const host=document.getElementById('crownlight-admin-echarts');if(!host)return;
 const status=host.querySelector('[data-admin-echarts-status]');
 const region=host.querySelector('[data-admin-echarts-chart]');
 const view=host.querySelector('[data-admin-echarts-view]');
 const categories=[
  ['users','Registered profiles','access'],
  ['activeEntitlements','Active access records','access'],
  ['library','Library records','learning'],
  ['orders','Recorded orders','commerce'],
  ['subscriptions','Subscription records','commerce'],
  ['catalogProducts','Catalog products','commerce'],
  ['publishedContent','Published content','learning']
 ];
 const groups={all:'All record types',access:'Accounts & access',
  commerce:'Commerce records',learning:'Learning & content'};
 const filterLabel=document.createElement('label');
 filterLabel.className='cc-echarts-group-label';
 filterLabel.textContent='Record group ';
 const filter=document.createElement('select');
 filter.dataset.adminEchartsGroup='';
 filter.setAttribute('aria-label','Filter operational chart by record group');
 for(const [value,label] of Object.entries(groups)){
  const option=document.createElement('option');option.value=value;
  option.textContent=label;filter.append(option);
 }
 filterLabel.append(filter);
 view.closest('label')?.insertAdjacentElement('afterend',filterLabel);
 const detail=document.createElement('details');
 detail.className='cc-echarts-source-table';
 const detailTitle=document.createElement('summary');
 detailTitle.textContent='View exact counts as a table';
 const table=document.createElement('table');
 table.innerHTML='<caption>Authorized snapshot values; unavailable numbers are excluded from the chart.</caption><thead><tr><th scope="col">Record type</th><th scope="col">Current count</th></tr></thead>';
 const tableBody=document.createElement('tbody');
 table.append(tableBody);detail.append(detailTitle,table);
 region.insertAdjacentElement('afterend',detail);
 let snapshot=null,echart=null,loading=null,resize=null,epoch=0,memberId=null;
 const valid=v=>Number.isSafeInteger(v)&&v>=0;
 function values(){
  return snapshot?categories.filter(x=>filter.value==='all'||x[2]===filter.value)
   .map(([key,label])=>({label,value:snapshot[key]})).filter(x=>valid(x.value)):[];
 }
 function populateTable(items){
  tableBody.replaceChildren();
  if(!items.length){
   const tr=document.createElement('tr'),cell=document.createElement('td');
   cell.colSpan=2;cell.textContent='No verified values are available in this group.';
   tr.append(cell);tableBody.append(tr);return;
  }
  for(const item of items){
   const tr=document.createElement('tr'),label=document.createElement('th');
   const count=document.createElement('td');label.scope='row';
   label.textContent=item.label;count.textContent=item.value.toLocaleString();
   tr.append(label,count);tableBody.append(tr);
  }
 }
 function clearSnapshot(){
  epoch++;snapshot=null;loading=null;
  if(Object.prototype.hasOwnProperty.call(root,'GroundUpAdminSummarySnapshot'))
   delete root.GroundUpAdminSummarySnapshot;
  resize?.disconnect();resize=null;echart?.dispose();echart=null;
  region.hidden=true;tableBody.replaceChildren();detail.hidden=true;
  status.textContent='Session changed. Return to Overview to load fresh authorized statistics.';
 }
 function display(){
  if(!snapshot)return;
  const items=values();populateTable(items);detail.hidden=false;
  const describe=items.map(x=>x.label+': '+x.value.toLocaleString()).join('; ');
  region.setAttribute('role','img');
  region.setAttribute('aria-label','Operational snapshot. '+(describe||'No verified values available')+
   '. Different record types; not a time series or percentages of one total.');
  if(!echart)return;
  if(!items.length){
   echart.clear();region.hidden=true;
   status.textContent='No verified summary values for this record group. Exact values are listed below.';
   return;
  }
  region.hidden=false;
  const bar=view.value==='bar';
  const palette=['#60d9c1','#69b9f8','#a4a0ff','#e2b977','#ee9e80','#8ccaf7','#b2dac8'];
  const gradient=root.echarts?.graphic?.LinearGradient?
   new root.echarts.graphic.LinearGradient(0,0,1,0,[
    {offset:0,color:'#217ca4'},{offset:0.55,color:'#38a9d8'},
    {offset:1,color:'#75ddc5'}]):'#4cb9d9';
  const option=bar?{
   grid:{left:175,right:73,top:24,bottom:39,containLabel:false},
   tooltip:{trigger:'axis',axisPointer:{type:'shadow'},
    backgroundColor:'#102637',borderColor:'#4f7d8f',textStyle:{color:'#edf7fa'}},
   xAxis:{type:'value',min:0,axisLabel:{color:'#d4e9f2',formatter:v=>Number(v).toLocaleString()},
    splitLine:{lineStyle:{color:'rgba(171,207,222,.14)',type:'dashed'}},
    axisLine:{show:false},axisTick:{show:false}},
   yAxis:{type:'category',data:items.map(x=>x.label),inverse:true,
    axisLabel:{color:'#e6f1f5',fontSize:12},axisTick:{show:false},axisLine:{show:false}},
   series:[{name:'Current recorded count',type:'bar',data:items.map(x=>x.value),
    barMaxWidth:27,showBackground:true,
    backgroundStyle:{color:'rgba(120,160,181,.11)',borderRadius:5},
    itemStyle:{color:gradient,borderRadius:[0,6,6,0]},
    label:{show:true,position:'right',distance:10,color:'#edf8fa',
     fontWeight:600,formatter:p=>Number(p.value).toLocaleString()}}]
  }:{
   tooltip:{trigger:'item',formatter:p=>p.name+': '+Number(p.value).toLocaleString()+
    ' records (share of displayed record counts: '+p.percent+'%).'},
   legend:{type:'scroll',bottom:2,textStyle:{color:'#d1e8f2',fontSize:12},
    icon:'roundRect',itemWidth:13,itemHeight:9},
   color:palette,
   series:[{name:'Current recorded counts',type:'pie',
    radius:['49%','71%'],center:['50%','43%'],minAngle:0,
    avoidLabelOverlap:true,padAngle:2,
    itemStyle:{borderWidth:2,borderColor:'#102331',borderRadius:5},
    label:{show:false},emphasis:{label:{show:true,color:'#f5fbfd',fontWeight:700}},
    data:items.map(x=>({name:x.label,value:x.value}))}]
  };
  echart.setOption({
   animation:!root.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,
   animationDuration:280,animationDurationUpdate:180,
   backgroundColor:'transparent',aria:{show:true,
    description:'Authorized operational record counts. '+describe+
     '. Record types are not mutually exclusive and do not represent a historical trend.'},
   textStyle:{color:'#edf7fa'},...option
  },{notMerge:true});
  const label=snapshot.showcase===true?'SYNTHETIC SHOWCASE — not operational data':
   'Authorized Admin dashboard snapshot';
  status.textContent=label+'. Counts of different record types, not a time series or revenue report.'+
   (snapshot.observedAt&&Number.isFinite(Date.parse(snapshot.observedAt))?
    ' Recorded '+new Date(snapshot.observedAt).toLocaleString()+'.':'');
 }
 async function onSummary(event){
  const data=event?.detail||root.GroundUpAdminSummarySnapshot;
  if(!data||typeof data!=='object')return;
  snapshot=data;
  if(!host.closest('.admin-panel.active'))return;
  populateTable(values());detail.hidden=false;
  if(!echart){
   if(!loading){
    const serial=epoch;
    if(!root.CrownlightECharts?.load){
     status.textContent='The local chart module is unavailable; exact values remain in the table.';
     return;
    }
    loading=root.CrownlightECharts.load().then(e=>{
     if(serial!==epoch||!snapshot||!host.closest('.admin-panel.active'))return;
     region.hidden=false;echart=e.init(region,null,{renderer:'canvas'});
     if(typeof ResizeObserver==='function'){
      resize=new ResizeObserver(()=>echart?.resize());resize.observe(region);
     }
     display();
    }).catch(error=>{
     if(serial===epoch)status.textContent='Visualization unavailable: '+error.message+
      '. The exact counts remain in the table.';
    }).finally(()=>{if(serial===epoch)loading=null});
   }
   return;
  }
  display();
 }
 view.addEventListener('change',display);
 filter.addEventListener('change',display);
 root.addEventListener('groundup:admin-summary',onSummary);
 root.addEventListener('crownlight:member-changed',clearSnapshot);
 if(typeof root.getSupabaseClient==='function')void root.getSupabaseClient().then(sb=>{
  if(!sb?.auth)return;
  void sb.auth.getSession().then(({data})=>{memberId=data?.session?.user?.id||null}).catch(()=>{});
  sb.auth.onAuthStateChange((event,session)=>{
   const uid=session?.user?.id||null;
   if(event==='SIGNED_OUT'||(memberId&&uid&&uid!==memberId))clearSnapshot();
   if(event==='SIGNED_OUT')memberId=null;else if(uid)memberId=uid;
  });
 }).catch(()=>{});
 if(root.GroundUpAdminSummarySnapshot)void onSummary({detail:root.GroundUpAdminSummarySnapshot});
 root.CrownlightAdminAnalytics={isReady:()=>!!echart,refresh:()=>void onSummary(),
  getStatus:()=>({rendered:!!echart,hasSnapshot:!!snapshot,recordGroup:filter.value})};
})(window);
