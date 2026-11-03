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
  if(!host||!client?.auth?.getSession||
     typeof userId!=='string'||!userId||typeof alive!=='function')return;
  controller=new AbortController();
  const signal=controller.signal;
  const current=()=>!signal.aborted&&epoch===serial&&alive();
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
   if(!current())return;
   host.replaceChildren(section);host.hidden=false;
  }catch{/* Denied, unavailable and interrupted research never block Basic study. */}
 }
 root.CrownlightAcademyEnterpriseResearchV1=Object.freeze({mount,scrub:reset});
})(globalThis);
