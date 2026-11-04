/* Crownlight P2 interactive EMA, RSI, MACD, Bollinger and evidence comparison.
 * This is a client-side ungraded teaching enhancement inside a canonical authorized Lab.
 * No member data, network calls, private assessments, credits or entitlements.
 */
(function(root){'use strict';
const source=root.CrownlightIndicatorExperimentsV1;
const sessions=new WeakMap();
function mount({target,studyId,mode,context}={}){
 const math=studyId==='ema'?root.GroundUpLearningQuantStudiesV1:root.GroundUpLearningIndicatorsV1;
 if(!source||!target||typeof target.replaceChildren!=='function'||!['ema','rsi','macd','bollinger'].includes(studyId)||
  !['guided','practice'].includes(mode)||math?.select?.(context||{})!==studyId)return null;
 sessions.get(target)?.dispose?.();
 const doc=target.ownerDocument||root.document;
 const node=(tag,label)=>{const el=doc.createElement(tag);if(label!==undefined)el.textContent=String(label);return el};
 const shell=node('details');shell.className='cl-indicator-explorer';
 const header=node('summary','Open dynamic indicator evidence workshop — fictional, ungraded');
 shell.append(header);
 const body=node('div');body.className='cl-indicator-body';
 body.append(node('p','Manipulate only an authored fictional sequence of completed closing prices. No historical prices, trade recommendation, official assessment, new entitlement or saved progress.'));
 const fields=node('div');fields.className='cl-indicator-controls';
 const input=(label,type,value,min,max,step)=>{
  const wrap=node('label',label),control=node('input');control.type=type;control.min=String(min);
  control.max=String(max);control.step=String(step);control.value=String(value);
  wrap.append(control);fields.append(wrap);return control};
 const last=input('Change the last fictional close','range',17.2,8,22,.1);
 const windowSize=input('Lookback period','range',3,2,5,1);
 const multiplier=input('Bollinger standard-deviation multiplier','range',2,.5,3,.5);
 const fast=input('MACD fast EMA period','range',3,2,4,1);
 const slow=input('MACD slow EMA period','range',5,5,7,1);
 const signal=input('MACD signal EMA period','range',3,2,4,1);
 const live=node('p');live.className='cl-indicator-live';live.setAttribute('role','status');live.setAttribute('aria-live','polite');
 const plot=node('div');plot.className='cl-indicator-plot';plot.setAttribute('role','img');
 plot.setAttribute('aria-label','Fictional completed-close indicator values. Full numerical table follows.');
 const tableHost=node('div');
 const note=node('p');
 body.append(fields,live,plot,tableHost,note);
 const compareTitle=node('h4','Indicator Evidence Comparator');
 const info=node('p','Compare two methods on the exact same fictional completed closing prices. Different units, smoothing conventions, warmups and limitations are not independent buy or sell votes.');
 const comparisonControls=node('div');comparisonControls.className='cl-indicator-controls';
 const choose=(caption,selected)=>{
  const wrap=node('label',caption),select=node('select');
  for(const id of source.names){const option=node('option',source.definitions[id].label);option.value=id;select.append(option)}
  select.value=selected;wrap.append(select);comparisonControls.append(wrap);return select};
 const methodA=choose('First indicator',studyId),methodB=choose('Comparison indicator',studyId==='macd'?'rsi':'macd');
 const comparator=node('div');
 const reflect=node('label','What changed, what stayed uncertain, and why?');
 const reflection=node('textarea');reflection.rows=3;reflection.maxLength=1200;reflect.append(reflection);
 const feedback=node('p');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 const review=node('button','Review evidence limits');review.type='button';
 review.addEventListener('click',()=>{
  const value=reflection.value.trim();
  feedback.textContent=value.length<15?'Describe your observed change and a limitation.':
   'Reflection is local to this view and not saved. Check the disclosed calculation, period, price source, warmup, counterexample and uncertainty; neither indicator predicts the next price.';
 });
 body.append(compareTitle,info,comparisonControls,comparator,reflect,review,feedback);
 shell.append(body);target.replaceChildren(shell);
 let disposed=false,opened=false,chart=null,observer=null;
 const safe=n=>typeof n==='number'&&Number.isFinite(n)?n.toFixed(3):'Warmup / unavailable';
 const table=(columns,rows,caption)=>{
  const t=node('table');t.className='cl-indicator-table';t.append(node('caption',caption));
  const h=node('thead'),tr=node('tr');for(const c of columns){const th=node('th',c);th.scope='col';tr.append(th)}
  h.append(tr);t.append(h);
  const b=node('tbody');for(const cells of rows){const row=node('tr');for(const c of cells)row.append(node('td',c));b.append(row)}
  t.append(b);return t;
 };
 function settings(){return {period:Number(windowSize.value),multiplier:Number(multiplier.value),
  fast:Number(fast.value),slow:Number(slow.value),signal:Number(signal.value)}}
 function render(){
  if(!shell.open||disposed)return;
  const closes=source.fixtures.slice();closes[closes.length-1]=Number(last.value);
  const params=settings(),calculated=source.calculate(studyId,closes,params);
  windowSize.parentNode.hidden=studyId==='macd';multiplier.parentNode.hidden=studyId!=='bollinger';
  for(const box of [fast,slow,signal])box.parentNode.hidden=studyId!=='macd';
  if(!calculated){live.textContent='Unable to calculate from these inputs. Verify period and price settings.';tableHost.replaceChildren();return}
  const label=Object.entries(calculated.detail).map(([key,value])=>key+' = '+safe(value)).join(' · ');
  live.textContent=source.definitions[studyId].label+' · Latest close '+safe(closes.at(-1))+
   ' · '+label+' · This observation is not a future prediction.';
  note.textContent=calculated.formula+' · '+calculated.limitation;
  tableHost.replaceChildren(table(['Close number','Completed fictional close',...calculated.lines.map(s=>s.name)],
   closes.map((price,i)=>[String(i+1),safe(price),...calculated.lines.map(s=>safe(s.data[i]))]),
   'Numerical evidence and explicit warmup from all completed fictional closes'));
  const comp=source.compare(methodA.value,methodB.value,closes,params);
  comparator.replaceChildren();
  if(!comp){comparator.append(node('p','Select two different methods for an evidence comparison.'))}
  else{
   comparator.append(table(['Method','Units','Latest result','Calculation','Interpretive limitation'],[comp.first,comp.second].map(x=>[
    x.label,x.units,safe(x.current),x.formula,x.limitation]),'Same fictional closes, different method and units'));
   comparator.append(node('p',comp.relationship));
  }
  const chartData={animation:false,backgroundColor:'transparent',tooltip:{trigger:'axis'},aria:{enabled:true},
   grid:{left:55,right:20,top:55,bottom:46},
   legend:{top:0,textStyle:{color:'#e2f2fa'}},
   xAxis:{type:'category',data:closes.map((_,i)=>'C'+(i+1)),axisLabel:{color:'#dcecf8'}},
   yAxis:{type:'value',scale:true,axisLabel:{color:'#dcecf8'}},
   series:calculated.lines.map(s=>({name:s.name,type:s.name==='Histogram'?'bar':'line',
    data:s.data,connectNulls:false,showSymbol:true}))};
  if(chart)chart.setOption(chartData,true);
  else if(root.CrownlightECharts?.load){
   root.CrownlightECharts.load().then(lib=>{
    if(disposed||!shell.open||!plot.isConnected||chart)return;
    chart=lib.init(plot,null,{renderer:'svg'});chart.setOption(chartData,true);
    if(typeof root.ResizeObserver==='function'){observer=new root.ResizeObserver(()=>chart?.resize());observer.observe(plot)}
   }).catch(()=>{if(!disposed)plot.textContent='Chart unavailable; the numerical table remains authoritative.'});
  }else plot.textContent='Chart unavailable; use the numerical evidence table.';
 }
 for(const control of [last,windowSize,multiplier,fast,slow,signal])control.addEventListener('input',render);
 for(const select of [methodA,methodB])select.addEventListener('change',render);
 shell.addEventListener('toggle',()=>{if(shell.open){opened=true;render()}else{observer?.disconnect();observer=null;chart?.dispose();chart=null}});
 const controller={dispose(){if(disposed)return;disposed=true;observer?.disconnect();chart?.dispose();shell.remove();if(sessions.get(target)===controller)sessions.delete(target)}};
 sessions.set(target,controller);return controller;
}
root.CrownlightIndicatorExplorerV1=Object.freeze({schema:'1.0.0',mount});
})(typeof window!=='undefined'?window:globalThis);
