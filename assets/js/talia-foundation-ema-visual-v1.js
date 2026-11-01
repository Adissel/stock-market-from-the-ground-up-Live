/* SMFGU-TALIA-FOUNDATION-VISUAL-001 — original fictional completed-close
 * EMA9/20/200 learning pane; reuses the installed first-party indicator math
 * and same-origin Apache ECharts 6.1 lazy loader.
 * No market feed, private history, grading, strategy, storage, future replay
 * series, member entitlement change, paid AI or execution.
 */
(function(root){
 'use strict';
 const $=id=>document.getElementById(id);
 const id='talia-foundation-ema-chart';
 const value=n=>Number(n.toFixed(5));
 function fictionalCompletedCloses(count){
  if(!Number.isInteger(count)||count<1||count>210)return [];
  return Array.from({length:count},(_,i)=>value(20+i*.014+Math.sin(i/9)*.13));
 }
 function snapshot(count,math=root.CrownlightIndicatorMath){
  const closes=fictionalCompletedCloses(count);
  if(!math||typeof math.ema!=='function'||closes.length!==count)return null;
  const studies={};
  for(const period of [9,20,200]){
   const result=math.ema(closes,period);
   if(!Array.isArray(result)||result.length!==count)return null;
   studies[period]=result.map(v=>Number.isFinite(v)?v:null);
  }
  return {count,closes,studies};
 }
 function ready(){
  const host=$(id),control=$('talia-ema-completed'),summary=$('talia-ema-summary');
  const table=$('talia-ema-readout'),plot=$('talia-ema-plot');
  if(!host||!control||!summary||!table||!plot)return;
  let chart=null,loading=false;
  const display=v=>v===null?'Unavailable — incomplete history':'$'+v.toFixed(4);
  function update(){
   const n=Math.max(1,Math.min(210,Math.round(Number(control.value)||1)));
   const s=snapshot(n);
   summary.textContent=s?
    n+' fictional completed closes. EMA 9: '+(n>=9?'available':'needs 9')+
    '; EMA 20: '+(n>=20?'available':'needs 20')+
    '; EMA 200: '+(n>=200?'available':'needs 200')+
    '. Bar '+(n+1)+' is not part of this illustration.':
    'Indicator math unavailable; no values have been invented.';
   $('talia-ema-count').textContent=String(n);
   table.replaceChildren();
   for(const [name,result] of s?[['Price',s.closes[n-1]],['EMA 9',s.studies[9][n-1]],['EMA 20',s.studies[20][n-1]],['EMA 200',s.studies[200][n-1]]]:
     [['Price',null],['EMA 9',null],['EMA 20',null],['EMA 200',null]]){
    const tr=document.createElement('tr'),th=document.createElement('th'),td=document.createElement('td');
    th.scope='row';th.textContent=name;td.textContent=display(result);
    tr.append(th,td);table.append(tr);
   }
   if(!chart||!s)return;
   chart.setOption({
    animation:false,
    aria:{enabled:true,description:'Original fictional completed close series with SMA-seeded EMA 9, EMA 20 and EMA 200; unavailable values are blank.'},
    tooltip:{trigger:'axis'},
    legend:{data:['Fictional close','EMA 9','EMA 20','EMA 200'],top:0,textStyle:{color:'#dbe8ef'}},
    grid:{left:58,right:18,top:54,bottom:42},
    xAxis:{type:'category',boundaryGap:false,name:'Completed bar',nameLocation:'middle',nameGap:27,data:s.closes.map((_,i)=>i+1),axisLabel:{color:'#dbe8ef'}},
    yAxis:{type:'value',scale:true,name:'Fictional dollars',nameTextStyle:{color:'#dbe8ef'},axisLabel:{color:'#dbe8ef'}},
    series:[
     {name:'Fictional close',type:'line',showSymbol:false,data:s.closes},
     ...[9,20,200].map(p=>({name:'EMA '+p,type:'line',showSymbol:false,connectNulls:false,data:s.studies[p]}))
    ]
   },true);
  }
  async function open(){
   if(chart||loading)return;
   loading=true;
   try{
    const library=await root.CrownlightECharts?.load();
    if(!library?.init)throw Error('ECharts unavailable');
    chart=library.init(plot,null,{renderer:'canvas'});
    update();
    chart.resize();
   }catch{
    plot.textContent='Chart drawing is unavailable. The complete numeric table above remains accessible.';
   }finally{loading=false}
  }
  control.addEventListener('input',update);
  host.addEventListener('toggle',()=>{if(host.open)void open();});
  root.addEventListener('resize',()=>chart?.resize());
  update();
 }
 root.TaliaFoundationEMA=Object.freeze({fictionalCompletedCloses,snapshot});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
 else ready();
})(typeof window!=='undefined'?window:globalThis);
