/* Optional, fully server-gated ungraded Lab edition exercises.
 * Never send assessed answers, private journal data, live prices or rubric keys.
 * The panel remains completely hidden until an actual server-authorized grant
 * AND released edition confirm membership. No paid actions.
 */
(function(root){'use strict';
 let serial=0,activeController=null,activeCharts=[];
 const build=(tag,label)=>{const x=document.createElement(tag);if(label!==undefined)x.textContent=String(label);return x};
 const demo=()=>{
  const bars=Array.from({length:21},(_,i)=>{
   const open=100+i*.15,close=open+(i%2?.05:.22);
   return{timestamp:(i+1)*1000,open,high:close+.25,low:open-.30,close,volume:100+i*10};
  });
  return{provenance:'fictional',asOf:21000,completedIndex:20,bars};
 };
 const explain=(result,host)=>{
  activeCharts.forEach(chart=>chart.dispose?.());activeCharts=[];
  host.replaceChildren();
  if(!result)return;
  if(result.edition==='ENTERPRISE'){
   const summary=build('p','Training observations: '+result.training.count+
    ' · embargo observations: '+result.embargo.count+
    ' · held-out evaluation observations: '+result.evaluation.count+
    '. The held-out values are not displayed or used to choose a method.');
   const table=build('table');const cap=build('caption','Training-only method comparisons');
   const head=build('thead'),headers=build('tr');
   for(const label of ['Method','Window','Descriptive result'])headers.append(build('th',label));
   head.append(headers);const body=build('tbody');
   for(const x of result.methodComparisons||[]){
    const tr=build('tr');tr.append(build('th',x.method),
     build('td',x.parameter),build('td',Number(x.descriptiveResult).toFixed(4)));body.append(tr);
   }
   table.append(cap,head,body);
   host.append(summary,table,build('p',result.limitation||
    'This is fictional research instruction, not a validated market forecast.'));
   return;
  }
  if(!result.evidence)return;
  const table=build('table');const cap=build('caption','Completed fictional data — computed by the server');
  const head=build('thead'),header=build('tr');
  for(const title of ['Calculation','Value','Method'])header.append(build('th',title));
  head.append(header);const body=build('tbody');
  for(const entry of result.evidence.indicators||[]){
   const row=build('tr');
   row.append(build('th',entry.name),build('td',Number(entry.value).toFixed(4)),
    build('td',entry.method));body.append(row);
  }
  table.append(cap,head,body);host.append(table);
  if(result.edition==='PROFESSIONAL'&&result.frames?.length){
   const frames=build('table'),caption=build('caption','Completed timeframe decision evidence');
   const frameHead=build('thead'),frameHeader=build('tr');
   for(const label of ['Completed frame','Close','Change from prior','Instructional boundary'])frameHeader.append(build('th',label));
   frameHead.append(frameHeader);const frameBody=build('tbody');
   result.frames.forEach(frame=>{const tr=build('tr');tr.append(build('th',frame.label),
    build('td',Number(frame.close).toFixed(4)),
    build('td',frame.changeFromPrior===null?'First completed frame':Number(frame.changeFromPrior).toFixed(4)),
    build('td',frame.interpretation));frameBody.append(tr)});
   frames.append(caption,frameHead,frameBody);host.append(frames);
  }
  if(result.remediation?.length){
   const route=build('section');route.setAttribute('aria-label','Reviewed prerequisite practice route');
   route.append(build('h3','Practice before the next decision replay'));
   const list=build('ol');
   result.remediation.forEach(item=>list.append(build('li',item.sequence.join(' → ')+' — ungraded practice only.')));
   route.append(list);host.append(route);
  }
  if(result.edition==='PROFESSIONAL'&&result.uncertaintyEvidence?.length){
   const boundary=build('section');boundary.setAttribute('aria-label','Professional uncertainty evidence');
   boundary.append(build('h3','What this evidence cannot establish'));
   const list=build('ul');result.uncertaintyEvidence.forEach(item=>list.append(build('li',item)));
   boundary.append(list);host.append(boundary);
  }
  const series=result.evidence.completedSeries||[];
  if(series.length){
   const observations=build('table'),obsCaption=build('caption','Completed fictional observations used by the server');
   const obsHead=build('thead'),obsHeader=build('tr');
   for(const label of ['Completed observation','Close','Volume'])obsHeader.append(build('th',label));
   obsHead.append(obsHeader);const obsBody=build('tbody');
   series.forEach((row,index)=>{const tr=build('tr');tr.append(build('th','Observation '+(index+1)),
    build('td',Number(row.close).toFixed(4)),build('td',String(row.volume)));obsBody.append(tr)});
   observations.append(obsCaption,obsHead,obsBody);host.append(observations);
   const charts=build('div');charts.className='gu-edition-linked-charts';
   const price=build('div'),volume=build('div');price.setAttribute('aria-label','Completed fictional close chart');
   volume.setAttribute('aria-label','Completed fictional volume chart');charts.append(price,volume);host.append(charts);
   const chartEpoch=serial;
   root.CrownlightECharts?.load?.().then(e=>{
    if(chartEpoch!==serial||!price.isConnected)return;
    const labels=series.map((_,i)=>'O'+(i+1)),close=series.map(x=>x.close),vol=series.map(x=>x.volume);
    const common={animation:false,aria:{enabled:true},textStyle:{color:'#e5f0fa'},
     grid:{left:55,right:20,top:35,bottom:45},xAxis:{type:'category',data:labels},
     tooltip:{trigger:'axis'},dataZoom:[{type:'inside',start:0,end:100}]};
    const a=e.init(price,null,{renderer:'svg'}),b=e.init(volume,null,{renderer:'svg'});activeCharts=[a,b];e.connect(activeCharts);
    a.setOption({...common,yAxis:{type:'value',scale:true},series:[{name:'Close',type:'line',data:close}]});
    b.setOption({...common,yAxis:{type:'value',min:0},series:[{name:'Volume',type:'bar',data:vol}]});
   }).catch(()=>{});
  }
  if(result.hypotheticalRisk?.length){
   const risk=build('p','Illustrative whole shares: '+result.hypotheticalRisk[0].shares+
    ' · planned stop risk: '+result.hypotheticalRisk[0].plannedRisk.toFixed(2)+
    '. Stops may slip; losses may exceed planned risk.');
   host.append(risk);
  }
  host.append(build('p',result.limitation||'No trading recommendation or official mastery is implied.'));
 };
 async function mount({host,userId,token,alive,labId,mode='guided'}={}){
  scrub();
  const epoch=serial;
  // Formative premium guidance is never presented in independent decision
  // or protected Assessment mode, including direct mount attempts.
  if(!['guided','practice'].includes(mode)||
     !host||!userId||typeof token!=='string'||!token||typeof alive!=='function')return;
  let selected='ENTERPRISE',risk=100,emaPeriod=9,embargo=2,revision=0;
  const caseKey=typeof labId==='string'&&/^[A-Za-z0-9_-]{3,80}$/.test(labId)?labId:null;
  const source=demo();
  const exerciseBody=edition=>({family:'lab',edition,
    activity:edition==='ENTERPRISE'?'chronological_validation':
     edition==='PROFESSIONAL'?'decision_replay_review':'advanced_formative_review',
    payload:{evidence:source,emaPeriod,embargo,frameSize:5,
     riskCases:[{entry:40,stop:38,riskBudget:risk,availableCash:1000}]}});
  const invoke=async(edition)=>{
   if(!alive()||serial!==epoch)return null;
   const body=exerciseBody(edition);
   const response=await fetch('/api/learning-lab-edition-exercise',{
    method:'POST',cache:'no-store',credentials:'same-origin',signal:activeController.signal,
    headers:{'authorization':'Bearer '+token,'content-type':'application/json'},
    body:JSON.stringify(body)
   });
   const data=await response.json().catch(()=>null);
   return response.ok&&data?.ok===true?data:null;
  };
  activeController=new AbortController();
  try{
   let reply=null;
   for(const edition of ['ENTERPRISE','PROFESSIONAL','ADVANCED']){
    const candidate=await invoke(edition);
    if(candidate){selected=edition;reply=candidate;break}
   }
   if(!reply||serial!==epoch||!alive())return;
   const section=build('section');section.className='gu-edition-exercise';
   section.setAttribute('aria-label','Authorized premium fictional calculation exercises');
   const heading=build('h2',reply.edition==='ENTERPRISE'?'Enterprise research validation':
    reply.edition==='PROFESSIONAL'?'Professional decision study':'Advanced indicator study');
   const intro=build('p','Original fictional prices only. All calculations use completed bars; this is ungraded instruction, not authenticated historical replay or investment advice.');
   const choices=build('div');choices.className='gu-edition-exercise-controls';
   const label=build('label',selected==='ENTERPRISE'?'Embargo observations ':'EMA periods ');
   const select=build('select');
   select.setAttribute('aria-label',selected==='ENTERPRISE'?
    'Observations embargoed between training and holdout':'EMA period for fictional exercise');
   for(const n of (selected==='ENTERPRISE'?[1,2,3]:[5,9,12,20])){
    const option=build('option',n);option.value=String(n);
    option.selected=n===(selected==='ENTERPRISE'?embargo:emaPeriod);select.append(option)
   }
   label.append(select);choices.append(label);
   const recalc=build('button','Recalculate fictional example');recalc.type='button';
   choices.append(recalc);
   const save=build('button','Save private study');
   const restore=build('button','Restore private study');
   save.type='button';restore.type='button';
   if(!caseKey){save.disabled=true;restore.disabled=true}
   choices.append(save,restore);
   const output=build('div');output.className='gu-edition-exercise-output';
   output.setAttribute('aria-live','polite');
   const status=build('p','Server-approved educational calculation. No member progress was changed.');
   status.setAttribute('role','status');
   const storageUrl='/api/learning-lab-edition-workspace';
   const storageHeaders={'authorization':'Bearer '+token,'content-type':'application/json'};
   save.addEventListener('click',async()=>{
    if(serial!==epoch||!alive()||!caseKey)return;
    save.disabled=true;status.textContent='Saving private ungraded example…';
    try{
     const response=await fetch(storageUrl,{method:'POST',credentials:'same-origin',
      cache:'no-store',signal:activeController.signal,headers:storageHeaders,
      body:JSON.stringify({...exerciseBody(selected),caseKey,expectedRevision:revision})});
     const data=await response.json().catch(()=>null);
     if(serial!==epoch||!alive())return;
     if(!response.ok||!data?.ok){status.textContent=response.status===409?
      'This study changed in another session. Restore the latest revision before saving.':
      'Study save unavailable. No official grade or mastery was changed.';return}
     revision=data.workspace.revision;
     status.textContent='Saved private study revision '+revision+'. No official grade was changed.';
    }catch{if(serial===epoch&&alive())status.textContent='Study save unavailable.'}
    finally{if(serial===epoch&&alive())save.disabled=false}
   });
   restore.addEventListener('click',async()=>{
    if(serial!==epoch||!alive()||!caseKey)return;
    restore.disabled=true;status.textContent='Restoring authorized private study…';
    try{
     const params=new URLSearchParams({family:'lab',edition:selected,caseKey});
     const response=await fetch(storageUrl+'?'+params,{method:'GET',credentials:'same-origin',
      cache:'no-store',signal:activeController.signal,headers:storageHeaders});
     const data=await response.json().catch(()=>null);
     if(serial!==epoch||!alive())return;
     if(!response.ok||!data?.ok){
      host.replaceChildren();host.hidden=true;return
     }
     if(!data.found){revision=0;status.textContent='No saved private study exists.';return}
     revision=data.workspace.revision;explain(data.workspace.summary,output);
     status.textContent='Restored private study revision '+revision+'. No official grade was changed.';
    }catch{if(serial===epoch&&alive())status.textContent='Study restore unavailable.'}
    finally{if(serial===epoch&&alive())restore.disabled=false}
   });
   recalc.addEventListener('click',async()=>{
    if(serial!==epoch||!alive())return;
    if(selected==='ENTERPRISE')embargo=Number(select.value);
    else emaPeriod=Number(select.value);
    recalc.disabled=true;
    status.textContent='Calculating verified fictional studies…';
    try{
     const update=await invoke(selected);
     if(serial!==epoch||!alive())return;
     if(!update){host.replaceChildren();host.hidden=true;return}
     explain(update.result,output);status.textContent='Calculation completed using fictional observations only.';
    }catch{
     if(serial===epoch&&alive())status.textContent='Unable to verify this calculation. Your Lab progress was not changed.';
    }finally{if(serial===epoch&&alive())recalc.disabled=false}
   });
   explain(reply.result,output);
   section.append(heading,intro,choices,output,status);
   host.replaceChildren(section);host.hidden=false;
  }catch{if(serial===epoch){host.replaceChildren();host.hidden=true}}
 }
 function scrub(){
  ++serial;activeController?.abort();activeController=null;activeCharts.forEach(chart=>chart.dispose?.());activeCharts=[];
  const h=document.getElementById('player-edition-exercise');
  if(h){h.replaceChildren();h.hidden=true}
 }
 root.CrownlightEditionExercisePanelV1=Object.freeze({mount,scrub});
})(globalThis);
