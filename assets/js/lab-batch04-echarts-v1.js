/* Original fictional Batch04 comparisons in the EXISTING member Lab Engine.
   Ungraded; never historical data, trade tape, account state or private keys. */
(function(root){'use strict';
let dataPromise=null;
const node=(tag,value)=>{const x=document.createElement(tag);if(value!==undefined)x.textContent=String(value);return x};
const names={
 'F2-C14-L04':['Reaction B','Reaction A'],
 'F3-C01-L01':['Completed close','Resistance'],
 'F3-C01-L02':['Support','Completed close'],
 'F3-C01-L03':['Completed high','Resistance'],
 'F3-C01-L04':['Reclaim close','Support'],
 'F3-C01-L05':['Resistance','Re-entry close'],
 'F3-C01-L06':['Support','Low probe'],
 'F3-C01-L07':['Probe high','Resistance'],
 'F3-C02-L01':['High','Pullback close'],
 'F3-C02-L02':['Range high','Range low'],
 'F3-C02-L03':['Opening price','Previous close'],
 'F3-C02-L04':['Visible high','Opening price'],
 'F3-C02-L05':['Opening price','Post-open close'],
 'F3-C03-L01':['Bearish open','Bearish close'],
 'F3-C03-L02':['Bullish close','Bullish open'],
 'F3-C03-L03':['High','Low'],
 'F3-C03-L04':['5-minute open','5-minute close'],
 'F3-C07-L01':['Later close','Earlier close'],
 'F3-C07-L02':['Earlier close','Later close'],
 'F3-C07-L03':['Seeded EMA 12','Seeded EMA 26']
};
function fixtures(){
 if(!dataPromise)dataPromise=fetch('/data/lab-bridge-batch04-quant-fixtures-v1.json',{cache:'no-cache'})
  .then(r=>{if(!r.ok)throw Error('No ungraded fixture');return r.json()})
  .then(d=>{if(d.schema!=='SMFGU-LAB-BATCH04-QUANT-V1'||d.items?.length!==20)throw Error('Unexpected fixture');return new Map(d.items.map(x=>[x.labId,x]))})
  .catch(e=>{dataPromise=null;throw e});
 return dataPromise;
}
function mount(target,{labId,bridge}={}){
 if(!target||!names[labId]||bridge?.instructionSource!=='ORIGINAL_SUBJECT_SPECIFIC_BATCH04_20261101')return null;
 let disposed=false,chartInstance=null,observer=null;
 const host=node('section');host.className='gu-b04-viz';
 host.setAttribute('aria-label','Original fictional completed observations: '+bridge.title);
 host.append(node('h4',bridge.title),node('p','Completed fictional evidence only. No unseen historical candle, real feed, trade fill, or official grade is present.'));
 const graphic=node('div');graphic.className='gu-b04-chart';graphic.setAttribute('role','img');
 graphic.setAttribute('aria-label','Fictional comparison graphic; exact corresponding dollar figures appear in the next accessible table.');
 const table=node('table');table.className='gu-b04-table';table.append(node('caption','Completed fictional numerical observations'));
 const status=node('p','Loading the fictional comparison.');status.setAttribute('role','status');
 host.append(graphic,table,status);target.append(host);
 fixtures().then(map=>{
  if(disposed)return;
  const item=map.get(labId), pair=item?.inputs;
  if(!pair||pair.length!==2||pair.some(n=>!Number.isFinite(n))||Math.abs(Math.abs(pair[0]-pair[1])-item.expected)>1e-9)throw Error('Numerical case missing');
  table.replaceChildren(node('caption','Exact fictional values (USD per share)'));
  const head=node('thead'),tr=node('tr');for(const t of ['Completed observation','USD/share'])tr.append(node('th',t));head.append(tr);table.append(head);
  const body=node('tbody');names[labId].forEach((name,i)=>{const tr=node('tr'),th=node('th',name);th.scope='row';tr.append(th,node('td','$'+pair[i].toFixed(2)));body.append(tr)});
  const end=node('tr'),th=node('th','Absolute difference');th.scope='row';end.append(th,node('td','$'+item.expected.toFixed(2)));body.append(end);table.append(body);
  status.textContent='The bars start at zero to avoid exaggerating price differences. Use the precise table figures for small changes; these observations do not predict the next price.';
  if(!root.CrownlightECharts?.load){graphic.textContent='Chart unavailable; exact values remain in the table.';return;}
  return root.CrownlightECharts.load().then(e=>{
   if(disposed)return;
   chartInstance=e.init(graphic);chartInstance.setOption({
    animation:false,backgroundColor:'transparent',
    aria:{enabled:true,description:'Two fictionally completed prices. Full numerical data is in the adjacent table.'},
    tooltip:{trigger:'axis'},grid:{top:24,bottom:54,left:62,right:20},
    xAxis:{type:'category',data:names[labId],axisLabel:{color:'#e2f0f5',interval:0,overflow:'truncate',width:140}},
    yAxis:{type:'value',min:0,scale:false,axisLabel:{color:'#e2f0f5',formatter:v=>'
    series:[{type:'bar',name:'Fictional completed values',data:pair,barMaxWidth:68,itemStyle:{color:p=>p.dataIndex===0?'#2bc3cf':'#d5a548',borderRadius:[5,5,0,0]}}]
   },true);
   if(typeof ResizeObserver==='function'){observer=new ResizeObserver(()=>chartInstance?.resize());observer.observe(graphic);}
  });
 }).catch(()=>{if(!disposed){graphic.textContent='Chart unavailable; use the authored fictional example text.';status.textContent='No verified market data or grade is implied.';}});
 return {dispose(){disposed=true;observer?.disconnect();chartInstance?.dispose();host.remove();}};
}
root.GroundUpLabBatch04EChartsV1=Object.freeze({mount,version:'1.0',fictionalOnly:true});
})(globalThis);
+Number(v).toFixed(2)}},
    series:[{type:'bar',name:'Fictional completed values',data:pair,barMaxWidth:68,itemStyle:{color:p=>p.dataIndex===0?'#2bc3cf':'#d5a548',borderRadius:[5,5,0,0]}}]
   },true);
   if(typeof ResizeObserver==='function'){observer=new ResizeObserver(()=>chartInstance?.resize());observer.observe(graphic);}
  });
 }).catch(()=>{if(!disposed){graphic.textContent='Chart unavailable; use the authored fictional example text.';status.textContent='No verified market data or grade is implied.';}});
 return {dispose(){disposed=true;observer?.disconnect();chartInstance?.dispose();host.remove();}};
}
root.GroundUpLabBatch04EChartsV1=Object.freeze({mount,version:'1.0',fictionalOnly:true});
})(globalThis);
