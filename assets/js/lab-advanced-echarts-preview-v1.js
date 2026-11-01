/* SMFGU-LAB-ADV-PREVIEW-001 · Staff prototype, not an Advanced entitlement.
 * Two linked ECharts using bounded FICTIONAL bars; no market feed or progress.
 */
(function(root){'use strict';
const MODE='fictional_constructed_no_feed';
const original=Object.freeze([
 [18,18.4,17.9,18.5,900],[18.4,19.1,18.2,19.2,1150],
 [19.1,18.9,18.4,19.3,750],[18.9,19.5,18.8,19.6,1350],
 [19.5,19.3,19.0,19.9,1100],[19.3,19.8,19.2,20.1,1210],
 [19.8,19.6,19.4,20.0,640],[19.6,20.2,19.5,20.4,1420],
 [20.2,19.9,19.7,20.5,770],[19.9,20.3,19.8,20.6,1180],
 [20.3,20.5,20.0,20.8,1450],[20.5,20.1,19.9,20.7,980]
].map(b=>Object.freeze(b)));
function prepare(bars,cursor,source=MODE){
 if(source!==MODE||!Array.isArray(bars)||bars.length<3||bars.length>240||
   !Number.isInteger(cursor)||cursor<0||cursor>=bars.length)return null;
 // Validate and calculate only completed observations at the replay cursor.
 // Unseen future values must not affect a previously rendered learning frame.
 const slice=bars.slice(0,cursor+1);
 if(!slice.every(b=>Array.isArray(b)&&b.length===5&&b.every(Number.isFinite)&&
    b[2]>0&&b[2]<=Math.min(b[0],b[1])&&b[3]>=Math.max(b[0],b[1])&&b[4]>=0))return null;
 const labels=slice.map((_,i)=>'F'+String(i+1).padStart(2,'0'));
 const closes=slice.map(b=>b[1]),volume=slice.map(b=>b[4]);
 const candle=slice.map(b=>[b[0],b[1],b[2],b[3]]);
 const ema9=closes.map((_,i)=>{if(i<8)return null;const alpha=2/10,seed=closes.slice(0,9).reduce((a,b)=>a+b,0)/9;
  let v=seed;for(let j=9;j<=i;j++)v=alpha*closes[j]+(1-alpha)*v;return v});
 return Object.freeze({provenance:MODE,count:slice.length,total:bars.length,cursor,
  labels:Object.freeze(labels),closes:Object.freeze(closes),volume:Object.freeze(volume),
  candle:Object.freeze(candle.map(x=>Object.freeze(x))),ema9:Object.freeze(ema9)});
}
function mount(){
 const host=document.getElementById('pt-lab-advanced-preview'),left=document.getElementById('pt-advanced-chart-price'),
 right=document.getElementById('pt-advanced-chart-volume'),status=document.getElementById('pt-advanced-chart-status');
 if(!host||!left||!right||!status||host.hidden)return null;
 const api=root.CrownlightECharts;
 let disposed=false,charts=[],observer=null,cursor=8;
 const sync=()=>{
  const data=prepare(original,cursor);if(!data)return;
  // The instructional data table works even if ECharts fails or is blocked.
  const table=document.getElementById('pt-advanced-series-table');
  if(table){
   table.replaceChildren();
   const caption=document.createElement('caption');caption.textContent='Completed fictional replay observations through the selected bar';
   const thead=document.createElement('thead'),header=document.createElement('tr');
   for(const title of ['Fictional bar','Close (USD)','Shares','EMA 9 (USD)']){
    const th=document.createElement('th');th.scope='col';th.textContent=title;header.append(th);
   }
   thead.append(header);const tbody=document.createElement('tbody');
   data.labels.forEach((label,i)=>{
    const tr=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent=label;tr.append(th);
    for(const value of [data.closes[i].toFixed(2),String(data.volume[i]),data.ema9[i]===null?'Warmup':data.ema9[i].toFixed(3)]){
     const td=document.createElement('td');td.textContent=value;tr.append(td);
    }
    tbody.append(tr);
   });
   table.append(caption,thead,tbody);
  }
  status.textContent='Showing '+data.count+' of '+data.total+' completed fictional bars. EMA9 starts after nine completed closes. No grades, future historical observations or live market data.';
  if(!charts.length)return;
  const common={animation:false,backgroundColor:'transparent',aria:{enabled:true},
   legend:{textStyle:{color:'#e6f2fb'}},tooltip:{trigger:'axis',axisPointer:{type:'cross'}},
   grid:{left:55,right:25,top:55,bottom:55},
   textStyle:{color:'#e5f0fa'},xAxis:{type:'category',data:data.labels,axisLabel:{color:'#ced8e4'}},
   yAxis:{type:'value',scale:true,axisLabel:{color:'#ced8e4'}},
   dataZoom:[{type:'inside',start:0,end:100},{type:'slider',bottom:7,height:15,start:0,end:100}]};
  charts[0].setOption({...common,series:[
   {name:'Fictional candles',type:'candlestick',data:data.candle},
   {name:'EMA 9 · SMA seed',type:'line',connectNulls:false,data:data.ema9,symbol:'none'}]},{notMerge:true});
  charts[1].setOption({...common,series:[
   {name:'Fictional volume',type:'bar',data:data.volume},
   {name:'Close (USD)',type:'line',data:data.closes,yAxisIndex:1,symbol:'none'}],
   yAxis:[
    {name:'Shares',type:'value',min:0,axisLabel:{color:'#ced8e4'}},
    {name:'USD',type:'value',scale:true,position:'right',axisLabel:{color:'#ced8e4'}}]},{notMerge:true});
 };
 // Always populate the accessible original-data table before requesting ECharts.
 sync();
 if(api?.load){
  api.load().then(e=>{
   if(disposed||host.closest('[hidden]'))return;
   charts=[e.init(left,null,{renderer:'svg'}),e.init(right,null,{renderer:'svg'})];
   e.connect(charts);sync();
   if(typeof ResizeObserver!=='undefined'){observer=new ResizeObserver(()=>charts.forEach(x=>x.resize()));observer.observe(host)}
  }).catch(()=>{
   charts.forEach(c=>c.dispose?.());charts=[];
   if(!disposed)status.textContent='Charts unavailable. Review the completed fictional observations in the data table and use Previous/Next to replay.';
  });
 }else status.textContent='Charts unavailable. The completed fictional observations remain available in the data table and Previous/Next replay.';
 const prev=document.getElementById('pt-advanced-prev'),next=document.getElementById('pt-advanced-next');
 const onPrev=()=>{cursor=Math.max(0,cursor-1);sync()},onNext=()=>{cursor=Math.min(original.length-1,cursor+1);sync()};
 prev?.addEventListener('click',onPrev);next?.addEventListener('click',onNext);
 return{dispose(){disposed=true;observer?.disconnect();charts.forEach(c=>c.dispose());charts=[];prev?.removeEventListener('click',onPrev);next?.removeEventListener('click',onNext)}};
}
const api=Object.freeze({prepare,original,mount});
root.CrownlightAdvancedLabPreviewV1=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(typeof document!=='undefined'){
 const setup=()=>{const details=document.getElementById('pt-lab-advanced-preview');if(!details)return;let controller=null;
  details.addEventListener('toggle',()=>{controller?.dispose();controller=null;if(details.open&&!document.getElementById('pt-app')?.hidden)controller=mount()});
  root.addEventListener?.('pagehide',()=>controller?.dispose());
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
}
})(typeof window!=='undefined'?window:globalThis);
