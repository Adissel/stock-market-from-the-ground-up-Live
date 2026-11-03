/* Staff-only 60-original-fictional-case method workbench. No API, network, fee,
 * account storage, grades, entitlements, trading signals or actual market prices.
 * Must mount only inside the verified administrative Prototype Center. */
(function(root){'use strict';
 const round=(x,n=4)=>Number(x.toFixed(n));
 const money=x=>Number(x).toFixed(2);
 const themes=Object.freeze([
  {id:'CANDLE',title:'Candlestick anatomy',description:'Observe only fully completed OHLC candles.'},
  {id:'SMA3',title:'Simple moving average',description:'Three completed close observations; not an EMA.'},
  {id:'BAR_VWAP_PROXY',title:'HLC3 volume-weighted bar proxy',description:'Not transaction-print VWAP; fictional completed bar volume.'},
  {id:'RISK',title:'Fictional risk-budget sizing',description:'Planned stop distance; no execution or fill guarantee.'},
  {id:'BREAKOUT',title:'Confirmed-bar range comparison',description:'Compares a finished close with prior observed highs; no future price claim.'},
  {id:'THREE_MINUTE',title:'Three-minute OHLCV aggregation',description:'Only complete groups of three 1-minute bars qualify.'}
 ]);
 const make=(theme,i)=>{
  const k=i+1,base=round(21+k*1.3,2),vol=100+k*17;
  const bars=Array.from({length:6},(_,j)=>{
   const open=round(base+j*.18+(i%3)*.02,2),close=round(open+(j%2===0?.22:-.11)+(i%2)*.03,2);
   return Object.freeze({sequence:j+1,minute:j+1,open,high:round(Math.max(open,close)+.12+(i%4)*.02,2),
    low:round(Math.min(open,close)-.11-(j%2)*.02,2),close,volume:vol+j*31});
  });
  const init=theme.id==='CANDLE'?1:theme.id==='SMA3'?3:theme.id==='THREE_MINUTE'?3:theme.id==='RISK'?1:theme.id==='BREAKOUT'?2:1;
  const risk=Object.freeze({entry:round(base+1.15,2),stop:round(base+.55-(i%3)*.05,2),
   budget:60+i*13,reserve:.03+(i%3)*.02});
  return Object.freeze({id:'ORIGINAL-'+theme.id+'-'+String(k).padStart(2,'0'),theme:theme.id,ordinal:themes.findIndex(x=>x.id===theme.id)*10+k,
   label:theme.title+' · case '+String(k).padStart(2,'0'),source:'original_constructed_fictional',
   provenance:'Six original deterministic fictional one-minute bars; no stock symbol or external feed.',
   initialVisible:init,bars:Object.freeze(bars),risk,methodLimits:theme.description,
   task:theme.id==='CANDLE'?'Inspect the newest completed candle: calculate body, upper and lower wick and range.':
    theme.id==='SMA3'?'Use the latest three completed closes to calculate the arithmetic mean.':
    theme.id==='BAR_VWAP_PROXY'?'Use all completed fictional HLC3 and per-bar volume to calculate a bar proxy, never trade VWAP.':
    theme.id==='RISK'?'Using the fictional entry, stop, slippage reserve and fixed budget, calculate the maximum whole-share planned size.':
    theme.id==='BREAKOUT'?'Compare the current completed close to the maximum high of all previous completed bars.':
    'Aggregate only complete non-overlapping triples of fictional one-minute bars into three-minute OHLCV.'});
 };
 const cases=Object.freeze(themes.flatMap(t=>Array.from({length:10},(_,i)=>make(t,i))));
 function evaluate(item,visible){
  if(!item||!cases.includes(item)||!Number.isInteger(visible)||visible<1||visible>item.bars.length)return null;
  const observed=item.bars.slice(0,visible),bar=observed.at(-1);
  const result={caseId:item.id,method:item.theme,visible,fullyObservedOnly:true,officialGrade:false,predictive:false,
   rights:'original_fictional_only',bars:observed.map(x=>({...x}))};
  if(item.theme==='CANDLE'){
   const body=Math.abs(bar.close-bar.open),range=bar.high-bar.low;
   return {...result,ready:true,values:{body:round(body),range:round(range),
    upperWick:round(bar.high-Math.max(bar.open,bar.close)),
    lowerWick:round(Math.min(bar.open,bar.close)-bar.low),
    direction:bar.close>bar.open?'up':bar.close<bar.open?'down':'flat'},
    explanation:'Completed O/H/L/C bar geometry; a candle cannot predict the next bar.'};
  }
  if(item.theme==='SMA3'){
   if(visible<3)return {...result,ready:false,reason:'Three completed close observations required.'};
   const last=observed.slice(-3).map(x=>x.close);
   return {...result,ready:true,values:{window:3,sumOfCloses:round(last.reduce((x,y)=>x+y,0)),sma3:round(last.reduce((x,y)=>x+y,0)/3)},
    explanation:'Arithmetic average of the latest three fully observed closes; no unseen bars.'};
  }
  if(item.theme==='BAR_VWAP_PROXY'){
   const numerator=observed.reduce((s,b)=>s+((b.high+b.low+b.close)/3)*b.volume,0);
   const volume=observed.reduce((s,b)=>s+b.volume,0);
   return {...result,ready:true,values:{completedVolume:volume,weightedTypicalPriceSum:round(numerator),hlc3WeightedBarProxy:round(numerator/volume)},
    explanation:'Bar (H+L+C)/3 times completed bar volume. This is NOT an exact transaction-print VWAP.'};
  }
  if(item.theme==='RISK'){
   const cost=item.risk.entry-item.risk.stop+item.risk.reserve;
   if(!(cost>0&&item.risk.budget>0))return {...result,ready:false,reason:'Invalid planned stop or risk budget.'};
   return {...result,ready:true,values:{entry:item.risk.entry,stop:item.risk.stop,reserve:item.risk.reserve,
    budget:item.risk.budget,plannedRiskPerShare:round(cost),wholeShares:Math.floor(item.risk.budget/cost)},
    explanation:'Hypothetical maximum whole shares by planned risk budget; fills, gaps and slippage can exceed the reserve.'};
  }
  if(item.theme==='BREAKOUT'){
   if(visible<2)return {...result,ready:false,reason:'A completed prior bar must establish a comparison high.'};
   const prior=observed.slice(0,-1),priorHigh=Math.max(...prior.map(b=>b.high)),margin=bar.close-priorHigh;
   return {...result,ready:true,values:{priorCompletedHigh:round(priorHigh),currentClose:bar.close,
    difference:round(margin),closeAbovePriorHigh:margin>0},
    explanation:'Only previous completed highs are used. This is descriptive recognition, never a trade signal.'};
  }
  if(item.theme==='THREE_MINUTE'){
   const groups=Math.floor(visible/3);
   if(groups<1)return {...result,ready:false,reason:'Three completed one-minute bars are required for a three-minute candle.'};
   const aggregated=[];
   for(let j=0;j<groups;j++){
    const slice=observed.slice(j*3,j*3+3);
    aggregated.push({group:j+1,open:slice[0].open,high:round(Math.max(...slice.map(x=>x.high))),low:round(Math.min(...slice.map(x=>x.low))),
     close:slice[2].close,volume:slice.reduce((s,x)=>s+x.volume,0)});
   }
   return {...result,ready:true,values:{completeGroups:groups,partialBarsHeld:visible%3,threeMinuteBars:aggregated},
    explanation:'Only completed triples are aggregated; the order inside a three-minute candle cannot be reconstructed from OHLC alone.'};
  }
  return null;
 }
 const format=value=>typeof value==='number'?Number.isInteger(value)?String(value):value.toFixed(4):typeof value==='boolean'?(value?'Yes':'No'):String(value);
 function mount(host){
  if(!host||!host.closest('#pt-app')||host.closest('#pt-app').hidden||!host.closest('#pt-methods60')?.open)return null;
  if(host.dataset.pt60Mounted==='yes')return null;
  host.dataset.pt60Mounted='yes';
  const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n};
  const controls=node('div');controls.className='pt60-controls';
  const label=node('label','Training case');label.setAttribute('for','pt60-case');
  const select=node('select');select.id='pt60-case';select.setAttribute('aria-label','Choose a fictional training case');
  for(const item of cases){const opt=node('option',item.label);opt.value=item.id;select.append(opt);}
  label.append(select);
  const previous=node('button','Previous completed bar'),next=node('button','Next completed bar'),reset=node('button','Reset case'),
   reveal=node('button','Show method explanation');
  for(const el of [previous,next,reset,reveal])el.type='button';
  controls.append(label,previous,next,reset,reveal);
  const status=node('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const task=node('p');task.className='pt60-task';
  const grid=node('div');grid.className='pt60-table';
  const explanation=node('div');explanation.hidden=true;explanation.className='pt60-evidence';
  host.replaceChildren(controls,status,task,grid,explanation);
  let selected=cases[0],visible=selected.initialVisible,show=false;
  function table(data){
   const table=node('table');const caption=node('caption','Completed fictional OHLCV observations only');
   const head=node('thead'),hrow=node('tr');for(const v of ['Minute','Open','High','Low','Close','Volume'])hrow.append(node('th',v));
   head.append(hrow);const body=node('tbody');
   for(const bar of data.bars){const tr=node('tr');for(const v of [bar.minute,money(bar.open),money(bar.high),money(bar.low),money(bar.close),bar.volume])tr.append(node('td',v));body.append(tr);}
   table.append(caption,head,body);return table;
  }
  function render(){
   const e=evaluate(selected,visible);
   previous.disabled=visible<=1;next.disabled=visible>=selected.bars.length;
   task.textContent=selected.task+' '+selected.methodLimits;
   status.textContent=selected.id+' · '+visible+' of '+selected.bars.length+' fictional completed minute bars shown. Unpublished prototype, not an assessment.';
   grid.replaceChildren(table(e));
   explanation.replaceChildren();
   explanation.hidden=!show;
   if(show){
    explanation.append(node('p',e.explanation||e.reason||'More observed bars are required.'));
    if(e.ready){
     const list=node('dl');for(const [k,value] of Object.entries(e.values)){const dt=node('dt',k),dd=node('dd',typeof value==='object'?JSON.stringify(value):format(value));list.append(dt,dd);}explanation.append(list);
    }
   }
   reveal.textContent=show?'Hide method explanation':'Show method explanation';
  }
  select.addEventListener('change',()=>{selected=cases.find(x=>x.id===select.value)||cases[0];visible=selected.initialVisible;show=false;render()});
  previous.addEventListener('click',()=>{visible=Math.max(1,visible-1);show=false;render()});
  next.addEventListener('click',()=>{visible=Math.min(selected.bars.length,visible+1);show=false;render()});
  reset.addEventListener('click',()=>{visible=selected.initialVisible;show=false;render()});
  reveal.addEventListener('click',()=>{show=!show;render()});
  render();return ()=>{host.replaceChildren();delete host.dataset.pt60Mounted};
 }
 if(typeof document!=='undefined'){
  const start=()=>{
   const details=document.getElementById('pt-methods60'),app=document.getElementById('pt-app'),host=document.getElementById('pt-methods60-body');
   if(!details||!app||!host)return;
   let cleanup=null;const sync=()=>{if(details.open&&!app.hidden){cleanup=cleanup||mount(host);}else if(cleanup){cleanup();cleanup=null;}};
   details.addEventListener('toggle',sync);new MutationObserver(sync).observe(app,{attributes:true,attributeFilter:['hidden']});
   window.addEventListener('pagehide',()=>{if(cleanup)cleanup();cleanup=null;},{once:true});sync();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 }
 root.CrownlightPrototype60=Object.freeze({version:'1.0',themes,cases,evaluate});
 if(typeof module!=='undefined'&&module.exports)module.exports={themes,cases,evaluate};
})(typeof window!=='undefined'?window:globalThis);
