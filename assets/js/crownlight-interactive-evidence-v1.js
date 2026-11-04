/* Crownlight interactive evidence · fictional, ungraded, authorized Lab stage only.
 * This component reads no member state and creates no new progress or grade system.
 */
(function(root){'use strict';
 const core=root.CrownlightEvidenceCoreV1,instances=new WeakMap();
 const prints=Object.freeze([
  {minute:0,price:100,shares:100},{minute:0,price:100.5,shares:150},
  {minute:1,price:100.25,shares:200},{minute:1,price:102,shares:250},
  {minute:3,price:101.5,shares:300}
 ]);
 const sequence=Object.freeze([
  {minute:0,price:100,shares:50},{minute:0,price:100.3,shares:40},
  {minute:1,price:100.9,shares:60},{minute:1,price:100.4,shares:40},
  {minute:2,price:100.2,shares:100},{minute:3,price:101.2,shares:120},
  {minute:4,price:100.8,shares:50},{minute:5,price:101.5,shares:90},
  {minute:6,price:101.1,shares:100},{minute:7,price:101.9,shares:120},
  {minute:8,price:101.2,shares:80},{minute:9,price:102.4,shares:100},
  {minute:10,price:101.8,shares:60},{minute:11,price:102.1,shares:60},
  {minute:12,price:101.7,shares:80},{minute:13,price:102.9,shares:100},
  {minute:14,price:102.2,shares:90}
 ]);
 const money=n=>'$'+n.toFixed(2);
 function mount({target,kind,mode,labId}={}){
  if(!core||!target||typeof target.append!=='function'||!['candle','vwap'].includes(kind)||
   !['guided','practice'].includes(mode)||typeof labId!=='string'||!(/^[A-Z0-9-]{6,28}$/).test(labId))return null;
  instances.get(target)?.dispose();
  const doc=target.ownerDocument||root.document;
  const node=(tag,label)=>{const n=doc.createElement(tag);if(label!==undefined)n.textContent=label;return n;};
  const btn=(label,onClick)=>{const n=node('button',label);n.type='button';n.addEventListener('click',onClick);return n;};
  const shell=node('details');shell.className='cl-evidence';shell.setAttribute('aria-label','Optional interactive fictional investigation');
  shell.append(node('summary','Open the Evidence Investigation Toolkit — optional, ungraded'));
  const content=node('div');content.className='cl-evidence-body';
  content.append(node('p','Illustrative fictional observations. No live prices, trade execution, future historical bars, official grade, mastery points or member record writes.'));
  const chooser=node('label','Choose an investigation');
  const select=node('select');const available=kind==='candle'?
   [['anatomy','Candle anatomy, wicks and context'],['timeline','Chronological candles and 1/3/5-minute microscope']]:
   [['transactions','VWAP trade-print calculator'],['timeline','Chronological candles and 1/3/5-minute microscope']];
  for(const [value,name] of available){const o=node('option',name);o.value=value;select.append(o)}
  chooser.append(select);content.append(chooser);
  const viewport=node('div');viewport.className='cl-evidence-viewport';content.append(viewport);
  shell.append(content);target.append(shell);
  let disposed=false,shown=false,cleanup=()=>{};
  function table(columns,rows,caption){
   const t=node('table');t.className='cl-evidence-table';t.append(node('caption',caption));
   const head=node('thead'),tr=node('tr');
   for(const name of columns){const th=node('th',name);th.scope='col';tr.append(th)}
   head.append(tr);t.append(head);const body=node('tbody');
   for(const cells of rows){const row=node('tr');for(const cell of cells)row.append(node('td',String(cell)));body.append(row)}
   t.append(body);return t;
  }
  function chart(container,options){
   // Accessible table is authoritative. ECharts is an optional enhancement.
   let inst=null,observer=null,stopped=false,latest=options;
   if(root.CrownlightECharts?.load){
    Promise.resolve().then(()=>root.CrownlightECharts.load()).then(api=>{
     if(stopped||disposed||!container.isConnected)return;
     inst=api.init(container);inst.setOption(latest,true);
     if(typeof root.ResizeObserver==='function'){
      observer=new root.ResizeObserver(()=>inst?.resize());observer.observe(container);
     }
    }).catch(()=>{container.setAttribute('aria-label','Chart unavailable; equivalent numerical observations are in the table.');});
   }else{container.setAttribute('aria-label','Chart unavailable; equivalent numerical observations are in the table.');}
   return {update(next){latest=next;if(inst)inst.setOption(next,true);},
    dispose(){stopped=true;observer?.disconnect();inst?.dispose();inst=null;}};
  }
  function optionsFor(bars,study=null){
   const labels=bars.map(b=>'M'+String(b.minute).padStart(2,'0'));
   return {animation:false,backgroundColor:'transparent',
    grid:[{left:48,right:16,top:20,height:'62%'},{left:48,right:16,top:'77%',height:'13%'}],
    tooltip:{trigger:'axis',confine:true},
    xAxis:[{type:'category',data:labels,axisLabel:{color:'#c8dce9'}},
     {type:'category',gridIndex:1,data:labels,axisLabel:{show:false}}],
    yAxis:[{scale:true,axisLabel:{color:'#c8dce9'},splitLine:{lineStyle:{color:'rgba(154,187,204,.2)'}}},
     {gridIndex:1,axisLabel:{show:false}}],
    dataZoom:[{type:'inside',xAxisIndex:[0,1],start:0,end:100}],
    series:[{type:'candlestick',name:'Revealed fictional bars',
     data:bars.map(b=>[b.open,b.close,b.low,b.high]),
     itemStyle:{color:'#46d9b0',color0:'#fa8893',borderColor:'#46d9b0',borderColor0:'#fa8893'}},
     {type:'bar',name:'Revealed volume',xAxisIndex:1,yAxisIndex:1,data:bars.map(b=>b.volume),
      itemStyle:{color:'#87a8d9'}},
     ...(study?[{type:'line',name:study.name,data:study.values,showSymbol:false,
      lineStyle:{color:'#f5cc78',width:2}}]:[])]};
  }
  function reflection(parent,prompt){
   const box=node('section');box.className='cl-evidence-reflection';
   const label=node('label',prompt),input=node('textarea');input.rows=3;input.maxLength=1200;
   input.placeholder='Describe an observation, a limitation, and what you cannot conclude.';
   label.append(input);const response=node('p');response.setAttribute('role','status');response.setAttribute('aria-live','polite');
   box.append(label,btn('Review my evidence checklist',()=>{
    const answer=input.value.trim();
    if(answer.length<15){response.textContent='Add a specific observation and your uncertainty first.';return}
    response.textContent='Reflection recorded in this view only (not saved). Verify the source and timeframe, describe a measured value, consider a counterexample, and avoid claiming the next candle is predictable. This checklist does not assess the accuracy of your explanation.';
   }),response);parent.append(box);
  }
  function anatomy(){
   const state={open:31,high:32.5,low:30.5,close:32},fields={};
   viewport.append(node('h3','Drag fictional OHLC prices and inspect the candle'));
   viewport.append(node('p','The body measures |Close − Open|. The full range measures High − Low. A wick identifies extremes, not their chronological order.'));
   const controls=node('div');controls.className='cl-evidence-controls';
   const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');
   svg.setAttribute('viewBox','0 0 360 280');svg.setAttribute('role','img');svg.setAttribute('class','cl-evidence-candle');
   const status=node('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
   const comparison=node('p');
   for(const key of ['open','high','low','close']){
    const label=node('label',key[0].toUpperCase()+key.slice(1)+' · '),r=node('input');
    r.type='range';r.min='29';r.max='34';r.step='0.05';r.value=String(state[key]);r.setAttribute('aria-label','Adjust fictional candle '+key);
    const value=node('output');fields[key]={r,value};label.append(r,value);controls.append(label);
    r.addEventListener('input',()=>{
     state[key]=Number(r.value);
     if(key==='high')state.high=Math.max(state.high,state.open,state.close);
     else if(key==='low')state.low=Math.min(state.low,state.open,state.close);
     else{state.high=Math.max(state.high,state.open,state.close);state.low=Math.min(state.low,state.open,state.close)}
     update();
    });
   }
   function update(){
    const result=core.candle(state);if(!result)return;
    for(const key of Object.keys(fields)){fields[key].r.value=String(state[key]);fields[key].value.textContent=money(state[key]);}
    svg.replaceChildren();
    const s=(tag,attrs)=>{const el=doc.createElementNS('http://www.w3.org/2000/svg',tag);
     for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));svg.append(el);return el;};
    const y=price=>248-(price-29)/5*220;
    s('line',{x1:180,x2:180,y1:y(state.high),y2:y(state.low),stroke:'#f2d080','stroke-width':4});
    s('rect',{x:136,y:y(Math.max(state.open,state.close)),width:88,
     height:Math.max(2,Math.abs(y(state.open)-y(state.close))),fill:result.direction==='down'?'#fa8893':'#46d9b0'});
    for(const [name,v] of [['H',state.high],['L',state.low],['O',state.open],['C',state.close]]){
     const text=s('text',{x:244,y:y(v)+4,fill:'#e8f2f7','font-size':13});text.textContent=name+' '+money(v);
    }
    status.textContent='Body '+money(result.body)+' · Range '+money(result.range)+' · Body '+result.bodyPercent.toFixed(1)+'% · Upper wick '+money(result.upperWick)+' · Lower wick '+money(result.lowerWick);
    const wider=core.candleContrast(state,{open:state.open,close:state.close,high:34,low:29});
    comparison.textContent=wider?'Counterexample: identical open and close with a wider fictional range changes body share to '+wider.second.bodyPercent.toFixed(1)+'%. Neither candle establishes what happens next.':'';
   }
   viewport.append(controls,svg,status,comparison);update();
   reflection(viewport,'Which observed prices establish the wick, and what remains unknown?');
  }
  function timeline(){
   let count=0,frame=1,plot=null;
   viewport.append(node('h3','Reveal chronological fictional price observations'));
   viewport.append(node('p','One new observation at a time. A swing high/low is confirmed only after a subsequent completed observation. Changing timeframe does not invent missing trades.'));
   const controls=node('div');controls.className='cl-evidence-actions';
   const label=node('label','Timeframe '),selectFrame=node('select');
   for(const f of [1,3,5]){const opt=node('option',f+' minute');opt.value=String(f);selectFrame.append(opt)}
   label.append(selectFrame);
   const status=node('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
   const plotHost=node('div');plotHost.className='cl-evidence-chart';plotHost.setAttribute('role','img');
   plotHost.setAttribute('aria-label','Fictional OHLCV chart showing only revealed observations; full numerical table follows.');
   const evidence=node('div');const pivots=node('p');
   const reveal=btn('Reveal next fictional observation',()=>{count=Math.min(sequence.length,count+1);sync()});
   const reset=btn('Reset observations',()=>{count=0;sync()});
   selectFrame.addEventListener('change',()=>{frame=Number(selectFrame.value);sync()});
   controls.append(label,reveal,reset);viewport.append(controls,status,plotHost,evidence,pivots);
   function sync(){
    const bars=core.aggregate(sequence,count,frame)||[];
    status.textContent='Revealed '+count+' / '+sequence.length+' fictional trades · '+frame+'-minute aggregation';
    reveal.disabled=count>=sequence.length;
    const completed=bars.length>1?bars.slice(0,-1):[];
    const swing=core.structure(completed)||[];
    pivots.textContent=swing.length?swing.map(s=>s.label+' at M'+s.index+' (confirmed after another bar)').join(' · '):
     'No confirmed swing labels yet. The currently forming bar cannot confirm itself.';
    evidence.replaceChildren(table(['Minute','Open','High','Low','Close','Shares'],bars.map(b=>[
     b.minute.toString(),money(b.open),money(b.high),money(b.low),money(b.close),b.volume.toString()
    ]),'Only price observations already revealed'));
    const opts=optionsFor(bars);
    if(plot)plot.update(opts);else if(bars.length){plot=chart(plotHost,opts);}
    if(!bars.length)plotHost.setAttribute('aria-label','No trade observations revealed; chart intentionally blank.');
   }
   cleanup=()=>plot?.dispose();sync();
   reflection(viewport,'How does aggregation change the candles without changing the underlying trades?');
  }
  function transactions(){
   let count=4,plot=null;
   viewport.append(node('h3','VWAP Transaction Explorer · exact trade-print method'));
   viewport.append(node('p','VWAP = sum of (trade price × shares) ÷ sum of shares. This is trade-print VWAP, not the HLC3 bar approximation. The fictional fifth transaction remains concealed until revealed.'));
   const actions=node('div');actions.className='cl-evidence-actions';
   const reveal=btn('Reveal next transaction',()=>{count=Math.min(prints.length,count+1);sync()});
   const reset=btn('Reset to zero transactions',()=>{count=0;sync()});
   const first=btn('Show first four transactions',()=>{count=4;sync()});
   actions.append(reveal,reset,first);
   const status=node('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
   const plotHost=node('div');plotHost.className='cl-evidence-chart';plotHost.setAttribute('role','img');
   plotHost.setAttribute('aria-label','Revealed fictional trade prices and calculated VWAP, also provided in the following numerical table.');
   const tableHost=node('div');
   viewport.append(actions,status,plotHost,tableHost);
   function sync(){
    const state=core.vwap(prints,count);if(!state)return;
    reveal.disabled=count===prints.length;
    status.textContent='Revealed '+state.revealed+' / '+state.total+
     ' · Volume '+state.volume.toLocaleString('en-US')+' shares · Cumulative price × volume $'+state.dollars.toLocaleString('en-US')+
     ' · VWAP '+(state.value===null?'not available':money(state.value));
    tableHost.replaceChildren(table(['Trade','Price','Shares','Price × shares','Cumulative VWAP'],state.steps.map((s,i)=>[
     String(i+1),money(s.price),String(s.shares),money(s.notional),money(s.vwap)
    ]),'Revealed fictional transactions only'));
    const option={animation:false,backgroundColor:'transparent',tooltip:{trigger:'axis'},
     grid:{left:52,right:18,top:20,bottom:42},
     xAxis:{type:'category',data:state.steps.map((_,i)=>'Trade '+(i+1)),axisLabel:{color:'#c8dce9'}},
     yAxis:{type:'value',scale:true,axisLabel:{color:'#c8dce9'}},
     series:[{type:'line',name:'Trade price',data:state.steps.map(s=>s.price),showSymbol:true,lineStyle:{color:'#46d9b0'}},
      {type:'line',name:'Cumulative trade-print VWAP',data:state.steps.map(s=>s.vwap),showSymbol:true,lineStyle:{color:'#f5cc78'}}]};
    if(plot)plot.update(option);else if(state.steps.length)plot=chart(plotHost,option);
    if(!state.steps.length)plotHost.setAttribute('aria-label','No transaction revealed; VWAP has no value yet.');
   }
   cleanup=()=>plot?.dispose();sync();
   reflection(viewport,'Why does the next trade change the weighted average, and what cannot be predicted?');
  }
  function render(){
   cleanup();cleanup=()=>{};viewport.replaceChildren();
   if(select.value==='anatomy')anatomy();
   else if(select.value==='timeline')timeline();
   else transactions();
  }
  select.addEventListener('change',render);
  shell.addEventListener('toggle',()=>{if(shell.open&&!shown&&!disposed){shown=true;render()}});
  const session={dispose(){if(disposed)return;disposed=true;cleanup();shell.remove();instances.delete(target)}};
  instances.set(target,session);return session;
 }
 root.CrownlightInteractiveEvidenceV1=Object.freeze({schema:'1.0.0',mount});
})(typeof window!=='undefined'?window:globalThis);
