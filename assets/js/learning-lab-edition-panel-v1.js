/* Optional, fully server-gated ungraded Lab edition exercises.
 * Never send assessed answers, private journal data, live prices or rubric keys.
 * The panel remains completely hidden until an actual server-authorized grant
 * AND released edition confirm membership. No paid actions.
 */
(function(root){'use strict';
 let serial=0,activeController=null;
 const build=(tag,label)=>{const x=document.createElement(tag);if(label!==undefined)x.textContent=String(label);return x};
 const demo=()=>{
  const bars=Array.from({length:21},(_,i)=>{
   const open=100+i*.15,close=open+(i%2?.05:.22);
   return{timestamp:(i+1)*1000,open,high:close+.25,low:open-.30,close,volume:100+i*10};
  });
  return{provenance:'fictional',asOf:21000,completedIndex:20,bars};
 };
 const explain=(result,host)=>{
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
  if(result.hypotheticalRisk?.length){
   const risk=build('p','Illustrative whole shares: '+result.hypotheticalRisk[0].shares+
    ' · planned stop risk: '+result.hypotheticalRisk[0].plannedRisk.toFixed(2)+
    '. Stops may slip; losses may exceed planned risk.');
   host.append(risk);
  }
  host.append(build('p',result.limitation||'No trading recommendation or official mastery is implied.'));
 };
 async function mount({host,userId,token,alive}={}){
  scrub();
  const epoch=serial;
  if(!host||!userId||typeof token!=='string'||!token||typeof alive!=='function')return;
  let selected='ENTERPRISE',risk=100,emaPeriod=9,embargo=2;
  const source=demo();
  const invoke=async(edition)=>{
   if(!alive()||serial!==epoch)return null;
   const body={family:'lab',edition,
    activity:edition==='ENTERPRISE'?'chronological_validation':
     edition==='PROFESSIONAL'?'decision_replay_review':'advanced_formative_review',
    payload:{evidence:source,emaPeriod,embargo,frameSize:5,
     riskCases:[{entry:40,stop:38,riskBudget:risk,availableCash:1000}]}};
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
   const output=build('div');output.className='gu-edition-exercise-output';
   output.setAttribute('aria-live','polite');
   const status=build('p','Server-approved educational calculation. No member progress was changed.');
   status.setAttribute('role','status');
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
  ++serial;activeController?.abort();activeController=null;
  const h=document.getElementById('player-edition-exercise');
  if(h){h.replaceChildren();h.hidden=true}
 }
 root.CrownlightEditionExercisePanelV1=Object.freeze({mount,scrub});
})(globalThis);
