/* Optional Enterprise Learning research pathway in Academy.
 * Server authorization is decisive. A plan label, signed-in state or
 * owner approval alone cannot reveal private premium content.
 */
(function(root){'use strict';
 let serial=0,controller=null;
 const element=(name,value)=>{
  const node=document.createElement(name);
  if(value!==undefined)node.textContent=String(value);
  return node;
 };
 const safeRoute=href=>typeof href==='string'&&
  (href==='bootcamp.html'||/^bootcamp-academy\.html\?program=[a-z0-9]+&day=[1-9][0-9]?$/.test(href));
 const safeLab=id=>typeof id==='string'&&/^(?:(?:F[123]|DT|TAPE)-C[0-9]+-L[0-9]+|SITE-[0-9]+)$/.test(id);
 const reset=()=>{
  ++serial;controller?.abort();controller=null;
  const host=document.getElementById('academy-enterprise-research');
  if(host){host.replaceChildren();host.hidden=true}
 };
 async function mount({host,client,userId,alive}={}){
  reset();
  const epoch=serial;
  const protectedAssessment=document.getElementById('academy-official-assessment');
  if(protectedAssessment?.hidden===false)return;
  if(!host||!client?.auth?.getSession||
     typeof userId!=='string'||!userId||typeof alive!=='function')return;
  controller=new AbortController();
  const signal=controller.signal;
  const current=()=>!signal.aborted&&epoch===serial&&alive()&&
   protectedAssessment?.hidden!==false;
  try{
   const checked=await client.auth.getSession();
   if(!current())return;
   const session=checked?.data?.session;
   if(session?.user?.id!==userId||!session.access_token)return;
   const response=await fetch('/api/learning-lab-enterprise-journey?family=learning',{
    method:'GET',credentials:'same-origin',cache:'no-store',signal,
    headers:{authorization:'Bearer '+session.access_token}
   });
   const data=await response.json().catch(()=>null);
   if(!current()||!response.ok||data?.ok!==true)return;
   const journey=data.journey;
   if(journey?.edition!=='ENTERPRISE'||journey.family!=='learning'||
      journey.readOnly!==true||journey.graded!==false||
      !Array.isArray(journey.stages)||journey.stages.length!==7||
      journey.stages.some((x,i)=>x?.number!==i+1||
       !Number.isSafeInteger(x.day)||x.day<1||x.day>90||
       typeof x.phase!=='string'||typeof x.dayTitle!=='string'||
       typeof x.programTitle!=='string'||x.officialGrade!==false))return;
   const section=element('section');section.className='gu-academy-enterprise-research';
   section.setAttribute('aria-label','Enterprise Learning cross-course research stages');
   section.append(element('h4','Enterprise research pathway — seven stages'));
   section.append(element('p',journey.boundary||
    'Each course and optional Lab retains independent access rules. No official mastery is awarded.'));
   const list=element('ol');
   for(const x of journey.stages){
    const li=element('li');
    li.append(element('strong','Stage '+x.number+': '+x.phase));
    li.append(element('p',x.programTitle+' · Day '+x.day+': '+x.dayTitle));
    if(safeRoute(x.trainingHref)&&x.trainingLocked===false){
     const link=element('a','Open authorized Academy study');
     link.href=x.trainingHref;li.append(link);
    }else li.append(element('p','Training route locked; a separate entitlement is required.'));
    if(Array.isArray(x.optionalPublishedLabs)){
     for(const lab of x.optionalPublishedLabs.slice(0,2)){
      if(!safeLab(lab?.labId)||lab.matchingBookEntitlementStillRequired!==true)continue;
      const link=element('a','Optional book Lab '+lab.labId+' — matching book entitlement required');
      link.href='labs.html?open='+encodeURIComponent(lab.labId);
      li.append(link);
     }
    }
    list.append(li);
   }
   section.append(list);
   const bookmark=element('div');bookmark.className='gu-academy-enterprise-bookmark';
   bookmark.append(element('h5','Private study bookmark'));
   bookmark.append(element('p','Choose where to resume. Saving a bookmark does not complete an Academy day, record an assessment, or award mastery.'));
   const chooser=element('select');chooser.id='academy-enterprise-bookmark-stage';
   for(const stage of journey.stages){
    const option=element('option','Stage '+stage.number+': '+stage.phase);
    option.value=String(stage.number);chooser.append(option);
   }
   const stageLabel=element('label','Research stage to resume');
   stageLabel.htmlFor=chooser.id;
   bookmark.append(stageLabel,chooser);
   const actions=element('div');actions.className='gu-academy-enterprise-bookmark-actions';
   const save=element('button','Save private study bookmark');
   const restore=element('button','Restore private study bookmark');
   save.type='button';restore.type='button';
   actions.append(save,restore);bookmark.append(actions);
   const status=element('p','Loading your private bookmark…');
   status.setAttribute('role','status');status.setAttribute('aria-live','polite');
   bookmark.append(status);section.append(bookmark);
   let revision=0,loaded=false,busy=false;
   const endpoint='/api/learning-lab-edition-workspace';
   const key='ACADEMY_ENTERPRISE_PATH_V1';
   const activity='enterprise_academy_bookmark';
   const updateDisabled=()=>{
    save.disabled=restore.disabled=busy||!current();
    chooser.disabled=busy||!current();
   };
   const token=async()=>{
    if(!current())return null;
    const refreshed=await client.auth.getSession();
    if(!current())return null;
    const active=refreshed?.data?.session;
    if(active?.user?.id!==userId||!active.access_token){
     reset();return null;
    }
    return active.access_token;
   };
   const validStored=data=>data?.workspace?.summary?.schema===
    'smfgu.learning.enterprise-path-bookmark.v1'&&
    data.workspace.summary.researchActivity===activity&&
    Number.isSafeInteger(data.workspace.revision)&&data.workspace.revision>0&&
    Number.isSafeInteger(data.workspace.summary.stageNumber)&&
    data.workspace.summary.stageNumber>=1&&data.workspace.summary.stageNumber<=7&&
    data.workspace.summary.officialGrade===false&&
    data.workspace.summary.independentCompletionRecorded===false;
   const reload=async()=>{
    if(busy||!current())return;
    busy=true;updateDisabled();
    try{
     const access=await token();if(!access)return;
     const uri=endpoint+'?'+new URLSearchParams({
      family:'learning',edition:'ENTERPRISE',caseKey:key,activity
     });
     const response=await fetch(uri,{method:'GET',cache:'no-store',
      credentials:'same-origin',signal,headers:{authorization:'Bearer '+access}});
     const data=await response.json().catch(()=>null);
     if(!current())return;
     if([401,403].includes(response.status)){reset();return;}
     if(!response.ok||data?.ok!==true||typeof data.found!=='boolean')
      throw Error('Private research bookmark unavailable.');
     if(data.found){
      if(!validStored(data))throw Error('Stored research bookmark is not recognized.');
      revision=data.workspace.revision;
      chooser.value=String(data.workspace.summary.stageNumber);
      status.textContent='Restored stage '+chooser.value+'. This is a private study position, not course completion.';
     }else{
      revision=0;
      status.textContent='No saved research bookmark. Select a stage and save to resume later.';
     }
     loaded=true;
    }catch{
     if(current()){loaded=false;status.textContent='Unable to restore the private bookmark. Academy study links remain available.';}
    }finally{busy=false;updateDisabled();}
   };
   const saveBookmark=async()=>{
    if(busy||!current())return;
    if(!loaded){status.textContent='Restore your current bookmark before saving to avoid overwriting another session.';return;}
    const stageNumber=Number(chooser.value);
    if(!Number.isSafeInteger(stageNumber)||stageNumber<1||stageNumber>7)return;
    busy=true;updateDisabled();
    try{
     const access=await token();if(!access)return;
     const response=await fetch(endpoint,{method:'POST',cache:'no-store',
      credentials:'same-origin',signal,
      headers:{authorization:'Bearer '+access,'content-type':'application/json'},
      body:JSON.stringify({family:'learning',edition:'ENTERPRISE',caseKey:key,activity,
       expectedRevision:revision,payload:{stageNumber}})
     });
     const data=await response.json().catch(()=>null);
     if(!current())return;
     if([401,403].includes(response.status)){reset();return;}
     if(response.status===409){
      loaded=false;
      status.textContent='Bookmark changed in another session. Restore the latest revision before saving.';
      return;
     }
     if(!response.ok||data?.ok!==true||
       !Number.isSafeInteger(data.workspace?.revision)||
       data.workspace.revision!==revision+1)throw Error('Save unavailable.');
     revision=data.workspace.revision;
     status.textContent='Saved private stage '+stageNumber+'. No completion or mastery was recorded.';
    }catch{
     if(current())status.textContent='Private bookmark could not be saved. Your Academy study remains available.';
    }finally{busy=false;updateDisabled();}
   };
   restore.addEventListener('click',reload);
   save.addEventListener('click',saveBookmark);
   if(!current())return;
   host.replaceChildren(section);host.hidden=false;
   await reload();
  }catch{/* Denied, unavailable and interrupted research never block Basic study. */}
 }
 root.CrownlightAcademyEnterpriseResearchV1=Object.freeze({mount,scrub:reset});
})(globalThis);
