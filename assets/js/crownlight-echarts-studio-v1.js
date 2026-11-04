/* Apache ECharts Studio view. Optional foundational OHLCV analytics; not
 * brokerage execution, and never loads unrevealed or secret market data.
 * The calling Studio tier controller authenticates and sanitizes all bars.
 */
(function(root){'use strict';
 let view=null,chart=null,resize=null,serial=0,last=[],symbol='REPLAY',period='1-minute';
 const enabled={ema9:true,ema20:true,ema200:false,sma20:false,vwap:true,bb20:false,hod:false,lod:false,volma20:true,structure:false,rsi14:false,macd:false,atr14:false};
 const colors={ema9:'#69e4e0',ema20:'#f4d17c',ema200:'#ad9af3',sma20:'#e8a4e0',
  vwap:'#88a9ff',bb20:'#cfb0f7',hod:'#fabd93',lod:'#ed99a4',volma20:'#edcc80',
  rsi14:'#cba7f6',macd:'#71d5f4',macdSignal:'#f0b980',macdHistogram:'#61d7b2',atr14:'#e2a3d3'};
 let stroke='solid';
 const factoryColors={...colors},lineStyles={};
 function resetMemberPresentation(){
  for(const k of Object.keys(factoryColors))colors[k]=factoryColors[k];
  for(const k of Object.keys(lineStyles))delete lineStyles[k];
  stroke='solid';
  for(const k of Object.keys(enabled))enabled[k]=['ema9','ema20','vwap','volma20'].includes(k);
 }
 const paneSizes={rsi14:155,macd:185,atr14:155};
 const defaultPaneSizes={...paneSizes};
 const getPreferences=()=>({enabled:{...enabled},colors:{...colors},
  lineStyles:{...lineStyles},paneSizes:{...paneSizes},stroke});
 function restorePreferences(prefs){
  if(!prefs||typeof prefs!=='object'||Array.isArray(prefs))return false;
  for(const [key,value] of Object.entries(prefs.enabled||{}))
   if(Object.hasOwn(enabled,key)&&typeof value==='boolean')enabled[key]=value;
  for(const [key,value] of Object.entries(prefs.colors||{}))
   if(Object.hasOwn(colors,key)&&typeof value==='string'&&/^#[a-f0-9]{6}$/i.test(value))
    colors[key]=value.toLowerCase();
  for(const [key,value] of Object.entries(prefs.lineStyles||{}))
   if(Object.hasOwn(colors,key)&&['solid','dashed','dotted'].includes(value))lineStyles[key]=value;
  for(const [key,value] of Object.entries(prefs.paneSizes||{}))
   if(Object.hasOwn(paneSizes,key)&&Number.isInteger(value)&&value>=110&&value<=285)paneSizes[key]=value;
  if(['solid','dashed','dotted'].includes(prefs.stroke))stroke=prefs.stroke;
  if(view){
   for(const el of view.querySelectorAll('[data-study]'))el.checked=enabled[el.dataset.study];
   for(const el of view.querySelectorAll('[data-indicator-color]'))el.value=colors[el.dataset.indicatorColor];
   for(const el of view.querySelectorAll('[data-indicator-stroke]'))
    el.value=lineStyles[el.dataset.indicatorStroke]||'default';
   for(const el of view.querySelectorAll('[data-pane-height]'))el.value=String(paneSizes[el.dataset.paneHeight]);
   const color=view.querySelector('input[aria-label="EMA 9 line color"]');
   if(color)color.value=colors.ema9;
   const style=view.querySelector('select[aria-label="Indicator line style"]');
   if(style)style.value=stroke;
   render();
  }
  return true;
 }
 const NUM=(v)=>typeof v==='number'&&Number.isFinite(v);
 function clean(input){
  const out=[];let prev=-Infinity;
  for(const b of Array.isArray(input)?input:[]){
   // Null, missing and blank fields cannot be coerced into an artificial zero candle.
   if(!b||typeof b!=='object'||
    !['timestamp','open','high','low','close','volume'].every(k=>b[k]!==null&&b[k]!==undefined&&b[k]!==''))continue;
   const t=Number(b.timestamp),o=Number(b.open),h=Number(b.high),l=Number(b.low),c=Number(b.close),v=Number(b.volume);
   if(!Number.isSafeInteger(t)||t<=prev||![o,h,l,c,v].every(NUM)||
      o<0||c<0||v<0||l>Math.min(o,c)||h<Math.max(o,c)||h<l)continue;
   out.push({t,o,h,l,c,v});prev=t;
   if(out.length>2500)out.shift();
  }
  return out;
 }

 function studySnapshot(){
  const m=root.CrownlightIndicatorMath;
  if(!m||!last.length)return null;
  const bars=last.map(b=>({time:new Date(b.t),open:b.o,high:b.h,low:b.l,close:b.c,volume:b.v}));
  const closes=bars.map(b=>b.close),volumes=bars.map(b=>b.volume);
  return {ema9:m.ema(closes,9),ema20:m.ema(closes,20),ema200:m.ema(closes,200),
   sma20:m.sma(closes,20),vwap:m.vwapProxy(bars),bb20:m.bollinger(bars,20,2),
   levels:m.observedLevels(bars),volma20:m.sma(volumes,20),rsi14:m.rsi(bars,14),
   atr14:m.atr(bars,14),macd:m.macd(bars,12,26,9),structure:m.confirmedStructure(bars,2)};
 }
 function fillTable(snapshot){
  const body=view?.querySelector('[data-cl-echarts-rows]');
  if(!body)return;
  body.replaceChildren();
  const pretty=x=>NUM(x)?x.toFixed(4):'Warmup / unavailable';
  last.slice(-30).forEach((b,j)=>{
   const i=last.length-Math.min(30,last.length)+j;
   const tr=document.createElement('tr');
   const values=[new Date(b.t).toISOString(),b.c,b.v,snapshot?.ema9[i],snapshot?.ema20[i],
    snapshot?.ema200[i],snapshot?.vwap[i],snapshot?.rsi14[i],snapshot?.atr14[i],
    snapshot?.macd.line[i],snapshot?.macd.signal[i],snapshot?.macd.histogram[i]];
   for(let k=0;k<values.length;k++){
    const cell=document.createElement(k===0?'th':'td');
    if(k===0)cell.scope='row';
    cell.textContent=k===0?values[k]:pretty(values[k]);
    tr.append(cell);
   }
   body.append(tr);
  });
 }
 function render(){
  if(!view||!chart)return;
  const labels=last.map(b=>new Date(b.t).toLocaleString(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}));
  const summary=view.querySelector('[data-cl-echarts-summary]');
  summary.textContent=last.length
   ?symbol+' · '+period+' · '+last.length+' revealed candles · Last close '+last.at(-1).c.toFixed(4)
   :'No revealed candles. Load simulated or authorized replay history.';

  const snapshot=studySnapshot();
  fillTable(snapshot);
  const overlays=[];
  const add=(id,name,data,axis=0)=>{if(!enabled[id]||!Array.isArray(data))return;
   overlays.push({name,type:'line',data:data.map(v=>NUM(v)?v:null),
    showSymbol:false,connectNulls:false,smooth:false,xAxisIndex:axis,yAxisIndex:axis,
    lineStyle:{width:2.15,type:lineStyles[id]||stroke,color:colors[id]},itemStyle:{color:colors[id]},
    emphasis:{focus:'series'}})};
  if(snapshot){
   add('ema9','EMA 9',snapshot.ema9);
   add('ema20','EMA 20',snapshot.ema20);
   add('ema200','EMA 200',snapshot.ema200);
   add('sma20','SMA 20',snapshot.sma20);
   add('vwap','Session VWAP (HLC3 bar proxy)',snapshot.vwap);
   if(enabled.bb20){
    add('bb20','Bollinger middle',snapshot.bb20.middle);
    add('bb20','Bollinger upper',snapshot.bb20.upper);
    add('bb20','Bollinger lower',snapshot.bb20.lower);
   }
   add('hod','Observed HOD',snapshot.levels.HOD);
   add('lod','Observed LOD',snapshot.levels.LOD);
   add('volma20','Volume SMA 20',snapshot.volma20,1);
  }
  const marks=snapshot&&enabled.structure?snapshot.structure.filter(x=>x.confirmedAt<last.length)
   .map(x=>({name:x.label,coord:[x.index,x.price],value:x.label,
    label:{show:true,formatter:x.label,color:'#ffffff'}})):[];

  // All lower panels use the same completed-bar labels and coupled ECharts
  // axis pointer. They do not fetch independently or expose future candles.
  const lower=[];
  const lowerIds=['rsi14','macd','atr14'].filter(id=>enabled[id]&&!!snapshot);
  const height=lowerIds.reduce((sum,id)=>sum+paneSizes[id]+35,0)+55+340+30+90+55;
  const graph=view.querySelector('[data-cl-echarts-chart]');
  if(graph)graph.style.height=height+'px';
  const grids=[{left:65,right:35,top:55,height:340},{left:65,right:35,top:425,height:90}];
  let top=550;
  for(const id of lowerIds){
   const axis=grids.length;
   grids.push({left:65,right:35,top,height:paneSizes[id],containLabel:false});
   const line=(name,data,color,opts={})=>({
    name,type:'line',xAxisIndex:axis,yAxisIndex:axis,showSymbol:false,
    connectNulls:false,smooth:false,data:data.map(v=>NUM(v)?v:null),
    lineStyle:{color,width:2,type:lineStyles[({ 'Wilder RSI 14':'rsi14','MACD 12/26':'macd','MACD signal 9':'macdSignal','Wilder ATR 14':'atr14'})[name]]||stroke},itemStyle:{color},...opts
   });
   if(id==='rsi14')lower.push(line('Wilder RSI 14',snapshot.rsi14,colors.rsi14,{
    markLine:{symbol:'none',silent:true,label:{show:false},
     lineStyle:{color:'#8ca6bf',type:'dashed',opacity:.6},
     data:[{yAxis:30},{yAxis:70}]}
   }));
   if(id==='macd'){
    lower.push(line('MACD 12/26',snapshot.macd.line,colors.macd));
    lower.push(line('MACD signal 9',snapshot.macd.signal,colors.macdSignal));
    lower.push({name:'MACD histogram',type:'bar',xAxisIndex:axis,yAxisIndex:axis,
     data:snapshot.macd.histogram.map(v=>NUM(v)?v:null),
     itemStyle:{color:colors.macdHistogram}});
   }
   if(id==='atr14')lower.push(line('Wilder ATR 14',snapshot.atr14,colors.atr14));
   top+=paneSizes[id]+35;
  }
  const shown=overlays.concat(lower).filter(x=>x.data.some(NUM));
  const available=view.querySelector('[data-cl-echarts-math]');
  if(available)available.textContent=snapshot
   ?'All studies use completed revealed candles; EMA 200 requires 200 completed closes. HLC3 bar VWAP is not trade-print VWAP.'
   :'Indicator calculations unavailable; price and volume remain visible.';
  chart.setOption({
   animation:false,backgroundColor:'transparent',textStyle:{color:'#cfe2f0'},
   legend:{top:4,type:'scroll',data:['Revealed OHLC','Observed volume',...shown.map(x=>x.name)],textStyle:{color:'#c6dfef'}},
   tooltip:{trigger:'axis',axisPointer:{type:'cross'}},
   axisPointer:{link:[{xAxisIndex:'all'}]},
   grid:grids,
   xAxis:grids.map((_,i)=>({type:'category',data:labels,gridIndex:i,boundaryGap:true,
    axisLabel:{color:'#bbd3e0',hideOverlap:true,show:i===grids.length-1},
    axisPointer:{show:true}})),
   yAxis:grids.map((_,i)=>({
    type:'value',gridIndex:i,scale:i===0,
    ...(i===1?{min:0}:{}),
    ...(lowerIds[i-2]==='rsi14'?{min:0,max:100}:{}),
    ...(lowerIds[i-2]==='atr14'?{min:0}:{}),
    axisLabel:{color:'#bbd3e0'}
   })),
   series:[
    {name:'Revealed OHLC',type:'candlestick',data:last.map(b=>[b.o,b.c,b.l,b.h]),
     itemStyle:{color:'#36d5ae',color0:'#ff648b',borderColor:'#36d5ae',borderColor0:'#ff648b'},xAxisIndex:0,yAxisIndex:0,markPoint:{symbol:'pin',symbolSize:36,data:marks}},
    {name:'Observed volume',type:'bar',data:last.map(b=>({value:b.v,itemStyle:{color:b.c>b.o?'#36d5ae':b.c<b.o?'#ff648b':'#b2bbce'}})),xAxisIndex:1,yAxisIndex:1},...overlays,...lower
   ],
   dataZoom:[
    {type:'inside',xAxisIndex:grids.map((_,i)=>i),filterMode:'none'},
    {type:'slider',xAxisIndex:grids.map((_,i)=>i),filterMode:'none',bottom:7,height:17,
     borderColor:'#415b77',textStyle:{color:'#a6c4d7'}}
   ]
  },{notMerge:true});
  chart.resize();
 }
 function update(bars,name,timeframe){
  last=clean(bars);symbol=String(name||'REPLAY').replace(/[^a-zA-Z0-9_. :-]/g,'').slice(0,40);
  period=String(timeframe||'1-minute').slice(0,45);
  render();
 }
 function unmount(){
  serial++;resize?.disconnect();resize=null;
  chart?.dispose();chart=null;
  view?.remove();view=null;
  last=[];symbol='REPLAY';period='1-minute';
 }
 async function mount(parent,bars,name,timeframe){
  if(!parent)throw Error('Studio chart container unavailable');
  unmount();
  const request=serial;
  const frame=document.createElement('section');frame.className='cl-tier-echarts-frame';
  frame.setAttribute('aria-label','Apache ECharts candlesticks and volume analytics');
  const h=document.createElement('h3');h.textContent='Apache ECharts · Revealed OHLCV';
  const p=document.createElement('p');p.textContent='Interactive candlesticks, volume, crosshair and zoom. Educational only.';
  const evidence=document.createElement('p');evidence.dataset.clEchartsSummary='';
  const graph=document.createElement('div');graph.className='cl-tier-echarts-canvas';
  graph.dataset.clEchartsChart='';
  graph.setAttribute('role','img');graph.setAttribute('aria-label','Revealed OHLCV candlestick and volume chart');
  const controls=document.createElement('fieldset');controls.className='cl-echarts-indicator-controls';
  const caption=document.createElement('legend');caption.textContent='Indicator overlays · completed bars only';controls.append(caption);
  const choices=[['ema9','EMA 9'],['ema20','EMA 20'],['ema200','EMA 200'],['sma20','SMA 20'],
   ['vwap','Session HLC3 VWAP proxy'],['bb20','Bollinger Bands 20,2'],
   ['hod','Observed HOD'],['lod','Observed LOD'],['volma20','Volume SMA 20'],['structure','Confirmed market structure'],
   ['rsi14','RSI 14 lower panel'],['macd','MACD 12/26/9 lower panel'],['atr14','ATR 14 lower panel']];
  for(const [key,title] of choices){
   const label=document.createElement('label'),input=document.createElement('input');
   input.type='checkbox';input.checked=!!enabled[key];input.dataset.study=key;
   input.addEventListener('change',()=>{enabled[key]=input.checked;render()});
   label.append(input,document.createTextNode(title));controls.append(label);
  }
  const paneControls=document.createElement('div');paneControls.className='cl-echarts-pane-controls';
  paneControls.setAttribute('role','group');
  paneControls.setAttribute('aria-label','Resize independent indicator panels');
  for(const [key,name] of [['rsi14','RSI panel'],['macd','MACD panel'],['atr14','ATR panel']]){
   const label=document.createElement('label');label.textContent=name+' height ';
   const size=document.createElement('input');size.type='range';size.min='110';size.max='285';size.step='5';
   size.value=String(paneSizes[key]);size.dataset.paneHeight=key;
   size.setAttribute('aria-label',name+' height in pixels');
   size.addEventListener('input',()=>{paneSizes[key]=Math.max(110,Math.min(285,Number(size.value)));render()});
   label.append(size);paneControls.append(label);
  }
  const colorLabel=document.createElement('label');colorLabel.textContent='EMA 9 color ';
  const tint=document.createElement('input');tint.type='color';tint.value=colors.ema9;
  tint.setAttribute('aria-label','EMA 9 line color');
  tint.addEventListener('input',()=>{colors.ema9=tint.value;render()});
  colorLabel.append(tint);controls.append(colorLabel);
  const styleLabel=document.createElement('label');styleLabel.textContent='Line style ';
  const style=document.createElement('select');style.setAttribute('aria-label','Indicator line style');
  for(const name of ['solid','dashed','dotted']){const option=document.createElement('option');option.value=name;option.textContent=name;style.append(option)}
  style.value=stroke;style.addEventListener('change',()=>{stroke=style.value;render()});
  styleLabel.append(style);controls.append(styleLabel);
  const advanced=document.createElement('details');advanced.className='cl-echarts-colors';
  const advancedSummary=document.createElement('summary');
  advancedSummary.textContent='Customize every indicator color and individual line style';
  const palette=document.createElement('div');palette.className='cl-echarts-palette';
  for(const [id,label] of [
    ['ema9','EMA 9'],['ema20','EMA 20'],['ema200','EMA 200'],
    ['sma20','SMA 20'],['vwap','Session VWAP'],['bb20','Bollinger Bands'],
    ['hod','Observed HOD'],['lod','Observed LOD'],['volma20','Volume SMA'],
    ['rsi14','RSI'],['macd','MACD line'],['macdSignal','MACD signal'],
    ['macdHistogram','MACD histogram'],['atr14','ATR']
  ]){
   const field=document.createElement('label');field.textContent=label+' color ';
   const color=document.createElement('input');color.type='color';color.value=colors[id];
   color.dataset.indicatorColor=id;color.setAttribute('aria-label',label+' color');
   color.addEventListener('input',()=>{colors[id]=color.value;render()});
   field.append(color);
   if(id!=='macdHistogram'){
    const line=document.createElement('select');line.dataset.indicatorStroke=id;
    line.setAttribute('aria-label',label+' line style');
    for(const optionId of ['default','solid','dashed','dotted']){
     const option=document.createElement('option');option.value=optionId;option.textContent=optionId;line.append(option);
    }
    line.value=lineStyles[id]||'default';
    line.addEventListener('change',()=>{if(line.value==='default')delete lineStyles[id];
     else lineStyles[id]=line.value;render()});
    field.append(line);
   }
   palette.append(field);
  }
  advanced.append(advancedSummary,palette);
  const disclosure=document.createElement('p');disclosure.dataset.clEchartsMath='';
  const details=document.createElement('details');details.className='cl-echarts-numeric-table';
  const summary=document.createElement('summary');summary.textContent='Accessible numerical values · last 30 revealed candles';
  const scroll=document.createElement('div');scroll.className='cl-echarts-table-scroll';
  const table=document.createElement('table');const tableCaption=document.createElement('caption');
  tableCaption.textContent='Revealed candles and completed-bar calculations; warmup values remain unavailable';
  table.append(tableCaption);const header=document.createElement('thead'),hr=document.createElement('tr');
  for(const field of ['UTC time','Close','Volume','EMA 9','EMA 20','EMA 200','VWAP HLC3 proxy','RSI 14','ATR 14','MACD','MACD signal','MACD histogram']){
   const th=document.createElement('th');th.scope='col';th.textContent=field;hr.append(th)
  }
  header.append(hr);table.append(header);
  const tbody=document.createElement('tbody');tbody.dataset.clEchartsRows='';table.append(tbody);
  scroll.append(table);details.append(summary,scroll);
  frame.append(h,p,evidence,controls,paneControls,advanced,disclosure,graph,details);parent.append(frame);view=frame;
  update(bars,name,timeframe);
  try{
   const e=await root.CrownlightECharts.load();
   if(serial!==request||!view?.isConnected)return false;
   chart=e.init(graph,null,{renderer:'canvas'});
   resize=new ResizeObserver(()=>chart?.resize());resize.observe(graph);
   render();return true;
  }catch(e){if(serial===request)unmount();throw e}
 }
 root.addEventListener('crownlight:member-changed',()=>{unmount();resetMemberPresentation();Object.assign(paneSizes,defaultPaneSizes)});
 root.CrownlightEChartsStudio={
  mount,unmount,update,getPreferences,restorePreferences,
  getStatus:()=>({ready:!!chart,barCount:last.length,symbol}),
  getObserved:()=>last.map(b=>({timestamp:b.t,open:b.o,high:b.h,low:b.l,close:b.c,volume:b.v}))
 };
})(window);
