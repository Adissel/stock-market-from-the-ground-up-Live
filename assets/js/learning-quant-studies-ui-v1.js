/* Existing member Lab Engine only. No new entitlement, storage or backend. */
(function(root){'use strict';
const sessions=new WeakMap();
function mount({target,studyId,mode,context}={}){
 const baseline=root.GroundUpLearningQuantStudiesV1;
 const indicator=root.GroundUpLearningIndicatorsV1;
 const math=indicator?.definitions?.[studyId]?indicator:baseline;
 const def=math?.definitions?.[studyId];
 const selected=math?.select?.(context||{});
 // Recheck the canonical topic mapping at the member UI boundary. A browser
 // caller cannot turn a tested calculation into a released lesson merely by
 // supplying its study ID; unmapped ATR/Bollinger methods remain math-only.
 if(!target||!def||selected!==studyId||!['guided','practice'].includes(mode)||typeof target.replaceChildren!=='function')return null;
 sessions.get(target)?.dispose?.();
 const doc=target.ownerDocument||root.document;
 const node=(tag,value)=>{const x=doc.createElement(tag);if(value!==undefined)x.textContent=value;return x;};
 const shell=node('section');shell.className='gu-quant-workbench';
 shell.setAttribute('aria-label','Original fictional quantitative learning exercise');
 shell.append(node('h3',def.label),node('p',def.intro));
 const source=node('p','Fictional teaching inputs only. No historical chart, real quote, advice, official assessment, or paid model.');
 source.className='gu-quant-provenance';shell.append(source);
 const base=math.calculate(studyId,def.initial);
 if(!base)return null;
 const intro=node('p',def.workedPrompt||(studyId==='ema'
  ?'Completed FICTIONAL closes: $10, $12, $14, $16. Period 3, SMA seed $12; alpha=0.5; fourth EMA $14.'
  :studyId==='risk'
  ?'FICTIONAL planned entry $42 and stop $40.50: absolute planned per-share distance $1.50. A stop does not guarantee fill.'
  :'FICTIONAL entry $42, stop $40.50, risk budget $150, cash $3,000. Floors 100 shares by risk and 71 by cash: choose 71.'));
 shell.append(intro);
 const chart=node('div');chart.className='gu-quant-echarts';chart.setAttribute('role','img');
 chart.setAttribute('aria-label',def.label+' · original fictional worked example only; equivalent values provided in the following table');
 const table=node('table');table.className='gu-quant-table';
 const caption=node('caption','Numerical values behind this fictional chart');table.append(caption);
 const header=node('tr');for(const v of ['Step','Worked example'])header.append(node('th',v));
 const tbody=node('tbody');
 for(let i=0;i<3;i++){const tr=node('tr');tr.append(node('th',def.keys[i]),node('td',base.values[i].toFixed(studyId==='sizing'?0:2)));tbody.append(tr)}
 table.append(header,tbody);
 shell.append(chart,table);
 const fields=[],grid=node('div');grid.className='gu-quant-grid';
 def.keys.forEach(label=>{const l=node('label',label),inp=node('input');inp.type='text';inp.inputMode='decimal';inp.autocomplete='off';inp.maxLength=24;l.append(inp);grid.append(l);fields.push(inp)});
 const worked=node('button','Show worked values in practice fields');worked.type='button';worked.className='secondary';
 worked.setAttribute('aria-label','Populate practice inputs with this fictional worked example');
 worked.addEventListener('click',()=>{
  def.keys.forEach((_,i)=>{fields[i].value=String(base.values[i]);});
  feedback.replaceChildren(node('p','Worked values populated for inspection. These are fictional teaching results, not a grade. Use Clear and retry to attempt independently.'));
  fields[0].focus();
 });
 shell.append(node('h4','Show all three intermediate calculations'),grid,worked);
 const feedback=node('div');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 const check=node('button','Check ungraded method'),btn=node('button','Clear and retry');check.type='button';btn.type='button';btn.className='secondary';
 check.addEventListener('click',()=>{
  const r=math.assess({studyId,inputs:fields.map(i=>i.value),mode,stage:'practice',provenance:'fictional_authored'});
  feedback.replaceChildren();if(r.status==='insufficient_evidence'){feedback.append(node('p',r.reason));return}
  feedback.append(node('p',r.status==='method_steps_matched'?'All three steps match this fictional example.':'Review the highlighted numerical differences. This is not an official assessment.'));
  const ol=node('ol');r.observations.forEach(o=>{const li=node('li',o.label+': '+(o.matched?'Matches the authored result.':'Entered '+o.actual+'; worked example result '+o.expected+'.'));ol.append(li)});feedback.append(ol);
  feedback.append(node('p',r.correction),node('p',r.limitation));
  const transfer=node('section');transfer.append(node('h4','New independent fictional calculation'));
  transfer.append(node('p',def.transferPrompt||(studyId==='ema'?'NEW closes 20,22,24,26, period 3 SMA-seeded: calculate EMA.':studyId==='risk'?'NEW entry $30, stop $28.75: calculate planned risk per share.':'NEW entry $27, stop $25, budget $70, cash $1,200: calculate whole-share cap.')));
  const label=node('label','My new-case answer ('+def.units+')'),answer=node('input');answer.type='text';answer.inputMode='decimal';label.append(answer);transfer.append(label);
  const status=node('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const checkNew=node('button','Check independent practice');checkNew.type='button';
  checkNew.addEventListener('click',()=>{status.textContent=math.checkTransfer({studyId,submitted:answer.value,mode}).message});
  transfer.append(checkNew,status);feedback.append(transfer);
 });
 btn.addEventListener('click',()=>{fields.forEach(f=>f.value='');feedback.replaceChildren();fields[0].focus()});
 shell.append(check,btn,feedback,node('p',def.limitation));target.replaceChildren(shell);
 let chartInstance=null,observer=null,disposed=false;
 if(root.CrownlightECharts?.load){
  Promise.resolve(root.CrownlightECharts.load()).then(e=>{
   if(disposed||!chart.isConnected)return;
   chartInstance=e.init(chart,null,{renderer:'svg'});
   // Chart renders only the already worked case. Independent transfer results
   // are NEVER plotted or printed before the learner attempts the new case.
   const values=Array.isArray(base.chart)?base.chart:
    studyId==='ema'?[{name:'Fictional close',type:'line',data:def.initial.closes},
      {name:'SMA-seeded EMA',type:'line',data:base.history,connectNulls:false}]:
      [{name:'Original method steps',type:'bar',data:base.values}];
   chartInstance.setOption({animation:false,backgroundColor:'transparent',aria:{enabled:true},tooltip:{trigger:'axis'},
    legend:{top:0,textStyle:{color:'#e2f2fa'}},grid:{left:60,right:25,top:58,bottom:50},
    textStyle:{color:'#d9e9f4'},xAxis:{type:'category',data:base.labels||(studyId==='ema'?['Close 1','Close 2','Close 3','Close 4']:def.keys),
    axisLabel:{color:'#d9e9f4'}},yAxis:{type:'value',scale:true,axisLabel:{color:'#d9e9f4'}},series:values});
   if(typeof ResizeObserver!=='undefined'){observer=new ResizeObserver(()=>chartInstance?.resize());observer.observe(chart)}
  }).catch(()=>{if(!disposed)chart.textContent='The chart is unavailable. All numerical examples and practice remain available in text.'});
 }else chart.textContent='ECharts unavailable. Full numerical instructions and the table remain available.';
 const controller={dispose(){if(disposed)return;disposed=true;observer?.disconnect();chartInstance?.dispose();chartInstance=null;shell.remove();if(sessions.get(target)===controller)sessions.delete(target)}};
 sessions.set(target,controller);return controller;
}
const api=Object.freeze({mount});root.GroundUpLearningQuantStudiesUIV1=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
