/* Accessible offline research replay — mounted ONLY after existing scanner entitlement. */
(function(root){
'use strict';
function mount({host}){
 const R=root.CrownlightScannerHistoricalV5,importer=root.GroundUpResearchBarsV014150;
 if(!host||!R?.evaluate||!importer?.csvBars)throw Error('Crownlight historical research engine unavailable.');
 const doc=host.ownerDocument;
 const el=(tag,text,cls)=>{const e=doc.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
 const section=el('section',undefined,'cl-history-v5');
 section.setAttribute('aria-label','Offline five-minute scanner research replay');
 section.append(el('h2','Five-minute historical research · offline technical beta'),
  el('p','Upload personally authorized OHLCV CSV: timestamp,open,high,low,close,volume. This research is ungraded and does not retrieve exchange feeds, prove market history, or create trading signals.'));
 const controls=el('div',undefined,'cl-history-controls');
 const makeInput=(label,id,placeholder,type='text')=>{
  const wrapper=el('label',label),field=el('input');field.id=id;field.type=type;
  field.placeholder=placeholder;wrapper.append(field);controls.append(wrapper);return field;
 };
 const ticker=makeInput('Research ticker','cl-h5-ticker','Example: TEST');
 const source=makeInput('Your source / permission note','cl-h5-source','Authorized fictional or personal CSV source');
 const asOf=makeInput('Evaluation cutoff with UTC offset','cl-h5-cutoff','2026-10-30T09:45:00-04:00');
 const rvol=makeInput('Provided RVOL (optional)','cl-h5-rvol','Not supplied');
 const float=makeInput('Reported float (optional)','cl-h5-float','Not supplied');
 const spread=makeInput('Provided spread % (optional)','cl-h5-spread','Not supplied');
 const fileLabel=el('label','Five-minute OHLCV CSV (2 MB / 20,000 bars maximum)');
 const file=el('input');file.type='file';file.accept='.csv,text/csv';file.setAttribute('aria-label','Import member-supplied five-minute OHLCV CSV');
 fileLabel.append(file);controls.append(fileLabel);section.append(controls);
 const actions=el('div',undefined,'cl-history-actions');
 const button=(label)=>{const b=el('button',label,'btn secondary');b.type='button';actions.append(b);return b;};
 const run=button('Evaluate completed bars at cutoff'),back=button('Previous completed bar'),
  next=button('Reveal next completed bar'),chartButton=button('Display observed-only chart');
 const status=el('p','No historical input loaded.','cl-history-status');
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const evidence=el('div',undefined,'cl-history-evidence'),chart=el('div',undefined,'cl-history-chart');
 chart.hidden=true;chart.setAttribute('role','img');
 chart.setAttribute('aria-label','Offline observed-only close-price plot; the accessible evidence table follows.');
 const plotStatus=el('p','A chart is optional; the metrics table is the primary accessible evidence.','cl-history-status');
 section.append(actions,status,evidence,chart,plotStatus);host.append(section);
 let bars=[],snapshot=null,chartInstance=null,revision=0;
 const live=()=>doc.contains(section)&&!doc.querySelector('#tool-content')?.hidden;
 const dispose=()=>{revision++;chartInstance?.dispose?.();chartInstance=null;chart.hidden=true;};
 const selected=()=>{
  const metadata={};if(rvol.value.trim())metadata.rvol=rvol.value.trim();
  if(float.value.trim())metadata.float=float.value.trim();
  if(spread.value.trim())metadata.spread_pct=spread.value.trim();
  return {bars,asOf:asOf.value.trim(),symbol:ticker.value.trim(),
   sourceNote:source.value.trim(),metadata};
 };
 const metrics=[
  ['price','Observed last close'],['change_5m_pct','Five-minute close-to-close change %'],
  ['change_2d_pct','Two prior FULL observed sessions change %'],
  ['change_pct','Change vs last full observed session %'],
  ['volume','Current observed session volume'],['prev_close','Previous full session close'],
  ['yesterday_volume','Previous full observed session volume'],
  ['bar_vwap_proxy','HLC3 bar VWAP approximation — not trade VWAP'],
  ['ema_9','EMA 9 (SMA seeded)'],['ema_20','EMA 20 (SMA seeded)'],
  ['ema_200','EMA 200 (SMA seeded)'],['rsi_14','RSI 14 Wilder'],
  ['atr_14','ATR 14 Wilder'],['day_high','Observed session high'],
  ['day_low','Observed session low'],['rvol','Member-reported RVOL'],
  ['float','Member-reported float'],['spread_pct','Member-provided spread %']
 ];
 const rules=[
  ['FIVE_MIN_POSITIVE','Five-minute change above zero',{type:'rule',field:'change_5m_pct',op:'GT',value:0}],
  ['TWO_SESSION_POSITIVE','Two observed-session change above zero',{type:'rule',field:'change_2d_pct',op:'GT',value:0}],
  ['ABOVE_EMA9','Last close above EMA 9',{type:'rule',field:'price',op:'GT',compareField:'ema_9'}],
  ['ABOVE_BAR_PROXY','Last close above HLC3 bar VWAP proxy',{type:'rule',field:'price',op:'GT',compareField:'bar_vwap_proxy'}]
 ];
 const selectLabel=el('label','Original research condition (no trading recommendation)');
 const select=el('select');select.setAttribute('aria-label','Choose a rule to evaluate on completed bars only');
 for(const [code,label] of rules){const option=el('option',label);option.value=code;select.append(option);}
 selectLabel.append(select);evidence.append(selectLabel);
 const verdict=el('p','Run the offline research before evaluating a condition.','cl-history-status');
 evidence.append(verdict);
 const metricHost=el('div',undefined,'cl-history-table-wrap');evidence.append(metricHost);
 function paintMetrics(){
  metricHost.replaceChildren();if(!snapshot?.available)return;
  const table=el('table'),caption=el('caption','Computed from completed, unverified member-supplied five-minute candles');
  const tbody=el('tbody');table.append(caption,tbody);
  for(const [key,label] of metrics){
   const tr=el('tr');const th=el('th',label);th.scope='row';
   const value=snapshot.row[key];
   tr.append(th,el('td',value===null?'Not supplied / insufficient warmup':String(value)));
   tbody.append(tr);
  }
  metricHost.append(table);
 }
 function verdictForSelection(){
  if(!snapshot?.available){verdict.textContent='No completed candle at this cutoff.';return;}
  const found=rules.find(x=>x[0]===select.value);
  verdict.textContent=found[1]+': '+R.evaluateRule(snapshot,found[2])+
   '. This result evaluates one original rule on unverified historical observations; not a trade alert.';
 }
 select.onchange=verdictForSelection;
 function evaluate(){
  dispose();evidence.hidden=false;
  try{
   snapshot=R.evaluate(selected());paintMetrics();verdictForSelection();
   status.textContent=snapshot.available?
    snapshot.observedBars+' completed bars through '+snapshot.lastCompletedAt+
    '; source unverified; '+snapshot.visibleCurrentBars+' current-session bars. '+
    snapshot.warnings.join(' ') : snapshot.reason+'. No future bar is shown.';
  }catch(e){snapshot=null;metricHost.replaceChildren();verdict.textContent='No accepted result.';
   status.textContent=e.message||'Cannot validate member-supplied data.';}
 }
 run.onclick=evaluate;
 file.onchange=async()=>{
  try{
   const f=file.files?.[0];if(!f||f.size>2000000)throw Error('Select a file no larger than 2 MB.');
   const nextBars=importer.csvBars(await f.text());
   bars=nextBars;snapshot=null;dispose();metricHost.replaceChildren();
   status.textContent=bars.length+' locally parsed candles; set a cutoff and verify session coverage, source rights and methodology.';
  }catch(e){bars=[];snapshot=null;dispose();metricHost.replaceChildren();status.textContent=e.message;}
 };
 function move(delta){
  if(!bars.length){status.textContent='Import five-minute candles first.';return;}
  const times=bars.map(b=>b.time.getTime()+R.FRAME);
  let at;try{at=R.cutoff(asOf.value.trim());}catch{at=times[0]-1;}
  const candidate=delta>0?times.find(t=>t>at):times.filter(t=>t<at).at(-1);
  if(candidate===undefined){status.textContent='No further completed candle in this locally supplied file.';return;}
  asOf.value=new Date(candidate).toISOString();evaluate();
 }
 back.onclick=()=>move(-1);next.onclick=()=>move(1);
 chartButton.onclick=async()=>{
  if(!snapshot?.available){plotStatus.textContent='Evaluate completed observations before charting.';return;}
  if(chartInstance){dispose();plotStatus.textContent='Observed-only chart closed.';return;}
  const ticket=++revision,observed=snapshot.visibleBars.slice();
  plotStatus.textContent='Loading the existing ECharts library; no new data retrieval.';
  try{
   const E=await root.CrownlightECharts?.load?.();
   if(ticket!==revision||!live()||!E?.init){plotStatus.textContent='Chart canceled after session change or unavailable library.';return;}
   chart.hidden=false;chartInstance=E.init(chart,null,{renderer:'canvas'});
   chartInstance.setOption({animation:false,backgroundColor:'transparent',
    textStyle:{color:'#d7e8ef'},
    tooltip:{trigger:'axis'},grid:{left:65,right:24,top:38,bottom:63},
    xAxis:{type:'category',data:observed.map(b=>b.time),axisLabel:{hideOverlap:true}},
    yAxis:{type:'value',scale:true,name:'Observed close'},
    dataZoom:[{type:'inside'},{type:'slider',bottom:5,height:18}],
    series:[{type:'line',name:'Observed close only',data:observed.map(b=>b.close),
     symbol:'none',lineStyle:{width:2,color:'#68d9eb'}}]},true);
   plotStatus.textContent='Chart shows '+observed.length+' completed, locally supplied candles only. No future bars, trade entries or licensed feeds.';
  }catch(e){dispose();plotStatus.textContent='Optional chart unavailable. The accessible metrics table remains usable.';}
 };
 root.addEventListener?.('pagehide',dispose,{once:true});
 root.addEventListener?.('crownlight:member-changed',dispose);
 return Object.freeze({dispose});
}
root.CrownlightScannerHistoryViewV5=Object.freeze({mount});
})(globalThis);
