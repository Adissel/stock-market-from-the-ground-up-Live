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
  if(result.edition==='PROFESSIONAL'&&result.hypotheticalRisk?.length){
   const first=result.hypotheticalRisk[0];
   host.append(build('p','Illustrative whole shares: '+first.shares+
    ' · planned stop risk: '+Number(first.plannedRisk).toFixed(2)+
    '. Stops may slip; losses may exceed planned risk.'));
   const table=build('table'),caption=build('caption','Fictional stop-risk comparison');
   const head=build('thead'),titles=build('tr');
   for(const name of ['Fictional case','Risk per share','Whole shares','Planned stop risk','Notional exposure','Limitations'])titles.append(build('th',name));
   head.append(titles);
   const body=build('tbody'),amount=x=>Number.isFinite(x)?x.toFixed(2):'Not available';
   result.hypotheticalRisk.forEach((entry,i)=>{
    const row=build('tr');row.append(build('th','Case '+(i+1)),
     build('td',amount(entry.perShareRisk)),build('td',String(entry.shares)),
     build('td',amount(entry.plannedRisk)),build('td',amount(entry.exposure)),
     build('td',entry.limitation||'Stops can slip; planned loss is not guaranteed.'));
    body.append(row);
   });
   table.append(caption,head,body);host.append(table);
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
  let selected='ENTERPRISE',risk=100,emaPeriod=9,embargo=2,revision=0,needsRecalculation=false;
  const caseKey=typeof labId==='string'&&/^[A-Za-z0-9_-]{3,80}$/.test(labId)?labId:null;
  const source=demo();
  const exerciseBody=edition=>({family:'lab',edition,
    activity:edition==='ENTERPRISE'?'chronological_validation':
     edition==='PROFESSIONAL'?'decision_replay_review':'advanced_formative_review',
    payload:{evidence:source,emaPeriod,embargo,frameSize:5,
     riskCases:[{entry:40,stop:38,riskBudget:risk,availableCash:1000},
      {entry:40,stop:39,riskBudget:risk,availableCash:1000}]}});
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
   const budgetLabel=build('label','Fictional risk budget (USD)');
   const budgetInput=build('input');budgetInput.type='number';
   budgetInput.min='1';budgetInput.max='100000';budgetInput.step='1';budgetInput.value='100';
   budgetInput.setAttribute('aria-label','Fictional risk budget in dollars');
   if(selected==='PROFESSIONAL'){budgetLabel.append(budgetInput);choices.append(budgetLabel)}
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
    if(serial!==epoch||!alive()||!caseKey||needsRecalculation)return;
    save.disabled=true;status.textContent='Saving private ungraded example…';
    try{
     const response=await fetch(storageUrl,{method:'POST',credentials:'same-origin',
      cache:'no-store',signal:activeController.signal,headers:storageHeaders,
      body:JSON.stringify({...exerciseBody(selected),caseKey,expectedRevision:revision})});
     const data=await response.json().catch(()=>null);
     if(serial!==epoch||!alive())return;
     if(!response.ok||!data?.ok){
      if(response.status===409)needsRecalculation=true;
      status.textContent=response.status===409?
       'This study changed in another session. Restore the latest revision before saving.':
       'Study save unavailable. No official grade or mastery was changed.';return
     }
     revision=data.workspace.revision;
     status.textContent='Saved private study revision '+revision+'. No official grade was changed.';
    }catch{if(serial===epoch&&alive())status.textContent='Study save unavailable.'}
    finally{if(serial===epoch&&alive())save.disabled=needsRecalculation}
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
     if(!data.found){
      revision=0;needsRecalculation=false;save.disabled=!caseKey;
      status.textContent='No saved private study exists.';return
     }
     revision=data.workspace.revision;explain(data.workspace.summary,output);
     // Recovered calculations are authoritative snapshots. Inputs may differ
     // from their historical values; require fresh, server-approved calculation
     // before allowing a new save to avoid overwriting a recovered result.
     needsRecalculation=true;save.disabled=true;
     status.textContent='Restored private study revision '+revision+
      '. Recalculate fictional inputs before saving a new version. No official grade was changed.';
    }catch{if(serial===epoch&&alive())status.textContent='Study restore unavailable.'}
    finally{if(serial===epoch&&alive())restore.disabled=false}
   });
   recalc.addEventListener('click',async()=>{
    if(serial!==epoch||!alive())return;
    if(selected==='ENTERPRISE')embargo=Number(select.value);
    else emaPeriod=Number(select.value);
    if(selected==='PROFESSIONAL'){
     const nextRisk=Number(budgetInput.value);
     if(!Number.isSafeInteger(nextRisk)||nextRisk<1||nextRisk>100000){
      status.textContent='Enter a fictional risk budget in whole dollars from 1 to 100000.';
      return;
     }
     risk=nextRisk;
    }
    recalc.disabled=true;
    status.textContent='Calculating verified fictional studies…';
    try{
     const update=await invoke(selected);
     if(serial!==epoch||!alive())return;
     if(!update){host.replaceChildren();host.hidden=true;return}
     explain(update.result,output);needsRecalculation=false;save.disabled=!caseKey;
     status.textContent='Calculation completed using fictional observations only.';
    }catch{
     if(serial===epoch&&alive())status.textContent='Unable to verify this calculation. Your Lab progress was not changed.';
    }finally{if(serial===epoch&&alive())recalc.disabled=false}
   });
   explain(reply.result,output);
   const researchPath=build('section');
   researchPath.className='gu-enterprise-research-path';
   researchPath.setAttribute('aria-label','Enterprise cross-course research stages');
   const loadResearchPath=async()=>{
    if(selected!=='ENTERPRISE'||serial!==epoch||!alive())return;
    try{
     const response=await fetch('/api/learning-lab-enterprise-journey?family=lab',{
      method:'GET',cache:'no-store',credentials:'same-origin',
      signal:activeController.signal,headers:{authorization:'Bearer '+token}
     });
     const data=await response.json().catch(()=>null);
     if(!response.ok||!data?.ok||serial!==epoch||!alive()||
        data.journey?.edition!=='ENTERPRISE'||
        !Array.isArray(data.journey.stages)||data.journey.stages.length!==7)return;
     const h=build('h3','Seven governed cross-course research stages');
     const boundary=build('p',data.journey.boundary||
      'All linked courses and Labs retain their own entitlement checks.');
     const list=build('ol');
     for(const stage of data.journey.stages){
      if(!Number.isInteger(stage.number)||stage.number<1||stage.number>7||
         typeof stage.phase!=='string'||typeof stage.dayTitle!=='string'||
         typeof stage.programTitle!=='string')return;
      const li=build('li');
      li.append(build('strong','Stage '+stage.number+' — '+stage.phase));
      li.append(build('p',stage.programTitle+' · Day '+stage.day+
       ': '+stage.dayTitle));
      if(typeof stage.trainingHref==='string'&&
         /^bootcamp(?:-academy)?\.html(?:\?program=[a-z0-9]+&day=[0-9]+)?$/.test(stage.trainingHref)){
       const link=build('a','Open authorized Academy course');
       link.href=stage.trainingHref;li.append(link);
      }else li.append(build('p','Academy training link locked; independent training entitlement required.'));
      for(const lab of stage.optionalPublishedLabs||[]){
       if(!/^(?:(?:F[123]|DT|TAPE)-C[0-9]+-L[0-9]+|SITE-[0-9]+)$/.test(lab?.labId)||
          lab.matchingBookEntitlementStillRequired!==true)continue;
       const link=build('a','Optional Lab '+lab.labId+' — separate book entitlement required');
       link.href='labs.html?open='+encodeURIComponent(lab.labId);
       li.append(link);
      }
      list.append(li);
     }
     researchPath.replaceChildren(h,boundary,list);
    }catch{/* The gated research navigator is optional to original Basic instruction. */}
   };
   // Formative multi-case research is a manually requested educational
   // comparison. A valid Enterprise edition is required before exposing
   // this control, and the API rechecks the signed-in grant on every click.
   const workbench=build('section');
   workbench.className='gu-enterprise-case-workbench';
   workbench.setAttribute('aria-label','Enterprise original fictional case workbench');
   const compare=build('button','Compare two original fictional cases');
   compare.type='button';
   const workStatus=build('p','Use constructed examples only. Held-out values stay hidden.');
   workStatus.setAttribute('role','status');
   const workOutput=build('div');
   workOutput.className='gu-edition-exercise-output';
   workbench.append(build('h3','Training-only fictional research workbench'),
    build('p','Compare aligned constructed OHLC series with an embargo and undisclosed evaluation values. No order, license, or mastery credit is involved.'),
    compare,workStatus,workOutput);
   compare.addEventListener('click',async()=>{
    if(selected!=='ENTERPRISE'||serial!==epoch||!alive())return;
    compare.disabled=true;workStatus.textContent='Checking current research rights and training-only chronology…';
    try{
     const first=demo();
     const second={...first,bars:first.bars.map(b=>({
      ...b,open:b.open*1.01,high:b.high*1.01,
      low:b.low*1.01,close:b.close*1.01}))};
     const response=await fetch('/api/learning-lab-enterprise-case-workbench',{
      method:'POST',cache:'no-store',credentials:'same-origin',
      signal:activeController.signal,
      headers:{authorization:'Bearer '+token,'content-type':'application/json'},
      body:JSON.stringify({family:'lab',embargo:2,cases:[
       {caseId:'ORIGINAL_CASE_A',evidence:first},
       {caseId:'ORIGINAL_CASE_B',evidence:second}
      ]})
     });
     const data=await response.json().catch(()=>null);
     if(serial!==epoch||!alive())return;
     if(!response.ok||!data?.ok||data.result?.schema!=='smfgu.enterprise.fictional-case-comparison.v1'||
        data.result?.graded!==false||data.result?.holdoutValuesReturned!==false||
        !Array.isArray(data.result?.cases)||data.result.cases.length!==2){
      host.replaceChildren();host.hidden=true;return;
     }
     const table=build('table'),caption=build('caption','Training-only original fictional case comparisons');
     const head=build('thead'),titles=build('tr');
     for(const s of ['Constructed case','Training bars','Mean close','EMA','VWAP','Embargo bars','Undisclosed holdout bars'])
      titles.append(build('th',s));
     head.append(titles);
     const body=build('tbody');
     const fixed=n=>typeof n==='number'&&Number.isFinite(n)?n.toFixed(4):null;
     for(const item of data.result.cases){
      if(!/^[A-Za-z0-9][A-Za-z0-9_-]{2,59}$/.test(item.caseId)||
         !Number.isSafeInteger(item.trainingCount)||
         !Number.isSafeInteger(item.embargoCount)||
         !Number.isSafeInteger(item.heldOutEvaluationCount)||
         fixed(item.trainingMean)===null||fixed(item.trainingOnlyIndicators?.EMA)===null||
         fixed(item.trainingOnlyIndicators?.VWAP)===null){
       host.replaceChildren();host.hidden=true;return;
      }
      const row=build('tr');
      row.append(build('th',item.caseId),build('td',item.trainingCount),
       build('td',fixed(item.trainingMean)),build('td',fixed(item.trainingOnlyIndicators.EMA)),
       build('td',fixed(item.trainingOnlyIndicators.VWAP)),build('td',item.embargoCount),
       build('td',item.heldOutEvaluationCount));
      body.append(row);
     }
     table.append(caption,head,body);
     workOutput.replaceChildren(table);
     workStatus.textContent='Comparison complete: training-only descriptive values. No held-out outcome was displayed or used for model selection.';
    }catch{
     if(serial===epoch&&alive())workStatus.textContent='Fictional comparison unavailable. No progress or grade was changed.';
    }finally{
     if(serial===epoch&&alive())compare.disabled=false;
    }
   });
   section.append(heading,intro,choices,output);
   if(selected==='ENTERPRISE')section.append(researchPath,workbench);
   section.append(status);
   host.replaceChildren(section);host.hidden=false;
   if(selected==='ENTERPRISE')void loadResearchPath();
  }catch{if(serial===epoch){host.replaceChildren();host.hidden=true}}
 }
 function scrub(){
  ++serial;activeController?.abort();activeController=null;activeCharts.forEach(chart=>chart.dispose?.());activeCharts=[];
  const h=document.getElementById('player-edition-exercise');
  if(h){h.replaceChildren();h.hidden=true}
 }
 root.CrownlightEditionExercisePanelV1=Object.freeze({mount,scrub});
})(globalThis);
