/* Crownlight SEC Scanner v1 member panel. The server, never this UI, decides tier access. */
(function(root){
'use strict';
const TAG='CROWNLIGHT_SEC_SCANNER';
const R=(tag,text)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;return el};
const labelled=(title,el)=>{const label=R('label',title);label.append(el);return label};
function mount({host,SB,USER}){
 if(!host||!SB||!USER?.id||host.querySelector('#cl-sec-tier-panel'))return;
 const panel=R('section');panel.id='cl-sec-tier-panel';panel.className='v11-workbench-panel cl-sec-tier';
 panel.setAttribute('aria-label','Crownlight SEC Scanner tier research');
 panel.append(R('h2','Crownlight SEC Scanner — primary-source research'),
  R('p','Separate from the stock scanner. Single verified issuer only. Filing acceptance is not first public dissemination or a trade signal.'));
 const badge=R('p','Verifying your SEC research tier…');badge.setAttribute('role','status');badge.setAttribute('aria-live','polite');
 const ticker=R('input');ticker.maxLength=12;ticker.placeholder='Example: MSFT';ticker.autocomplete='off';
 const mode=R('select');
 for(const [value,name] of [['filings','Official filing history'],['fundamentals','Official financial statement facts']]){
  const o=R('option',name);o.value=value;mode.append(o);
 }
 const button=R('button','Retrieve SEC issuer records');button.type='button';button.className='btn secondary';button.disabled=true;
 const status=R('p','');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const results=R('div');results.className='cl-sec-tier-results';
 const controls=R('div');controls.className='cl-sec-tier-controls';
 controls.append(labelled('Issuer ticker',ticker),labelled('Research dataset',mode),button);
 panel.append(badge,controls,status,results);
 host.append(panel);
 let tier=null,sequence=0,chart=null,resize=null;
 const clearChart=()=>{resize?.disconnect();resize=null;chart?.dispose();chart=null};
 async function session(){
  const s=(await SB.auth.getSession()).data?.session;
  if(!s?.access_token||s.user?.id!==USER.id)throw Error('Sign-in context changed. Refresh before continuing.');
  return s;
 }
 async function requestJson(url,init={}){
  const s=await session();
  const response=await fetch(url,{...init,headers:{...init.headers,authorization:'Bearer '+s.access_token},cache:'no-store',credentials:'same-origin'});
  const data=await response.json().catch(()=>null);
  await session();
  if(!host.contains(panel)||panel.closest('#tool-content')?.hidden)throw Error('Research panel is no longer active.');
  if(!response.ok||data?.ok!==true)throw Error(data?.error||'SEC research unavailable.');
  return data;
 }
 function renderFilings(data){
  const secEngine=root.CrownlightSecEvidenceV1;
  const title=R('h3',data.company+' · CIK '+data.cik);
  const source=R('p','SEC record observed '+data.observedAt+' UTC-source timestamp. Check amended filings and issuer identity.');
  const table=R('table'),caption=R('caption','Official filings — source evidence, not a trading recommendation');
  table.append(caption);
  const header=R('tr');
  for(const label of ['Form','Filed date','Verified original filing']){const th=R('th',label);th.scope='col';header.append(th);}
  const head=R('thead');head.append(header);table.append(head);
  const body=R('tbody');
  for(const f of data.filings||[]){
   const row=R('tr'),linkCell=R('td');
   if(secEngine?.safeFilingUrl?.(f.sourceUrl,data.cik,f.accession)){
    const a=R('a','Open filing on SEC.gov');a.href=f.sourceUrl;a.target='_blank';a.rel='noopener noreferrer';linkCell.append(a);
   }else linkCell.textContent='Unverified SEC link';
   row.append(R('td',f.form),R('td',f.filedDate),linkCell);body.append(row);
  }
  table.append(body);results.append(title,source,table);
  if(data.capabilities?.acceptedTimeWindows){
   const container=R('div');results.append(container);
   root.CrownlightScannerSecBriefV4?.mount?.({host:container,payload:data,symbol:data.symbol,asOf:new Date().toISOString()});
  }else results.append(R('p','Plus: SEC acceptance-time lookbacks and form-specific evidence. Not included in Basic.'));
 }
 function renderFacts(data){
  if(!data.capabilities?.fundamentals||!Array.isArray(data.fundamentals))return;
  results.append(R('h3','Reported SEC XBRL financial metrics — Advanced'));
  const table=R('table'),head=R('tr');
  for(const text of ['Reported metric','Latest reported value','Reporting period','SEC accepted (if verified)']){
   const th=R('th',text);th.scope='col';head.append(th);
  }
  table.append(head);
  for(const m of data.fundamentals){
   const x=m.observations?.[0],tr=R('tr');
   for(const v of [m.metric,x?String(x.value)+' '+x.unit:'Not reported',x?.periodEnd||'Unavailable',
    x?.acceptedAt||'Exact time unavailable'])tr.append(R('td',v));
   table.append(tr);
  }
  results.append(table,R('p','Cross-company or quarter-over-quarter comparisons require matching accounting periods and taxonomy. These are issuer-reported values, not forecasts.'));
  const available=data.fundamentals.filter(x=>(x.observations||[]).some(y=>Number.isFinite(y.value)));
  if(!available.length)return;
  const choices=R('select');
  for(let i=0;i<available.length;i++){const o=R('option',available[i].metric);o.value=String(i);choices.append(o);}
  const plot=R('div');plot.className='cl-sec-tier-chart';plot.setAttribute('role','img');
  plot.setAttribute('aria-label','SEC reported financial observations. Use the table above for accessible exact values.');
  const plotButton=R('button','Plot SEC-reported values');plotButton.type='button';plotButton.className='btn secondary';
  const plotStatus=R('p','Values are plotted by reporting period, not market price.');plotStatus.setAttribute('role','status');
  results.append(labelled('Select reported metric',choices),plotButton,plot,plotStatus);
  plotButton.onclick=async()=>{
   try{
    await session();
    const m=available[Number(choices.value)],points=(m?.observations||[]).filter(x=>Number.isFinite(x.value)&&x.periodEnd).slice().reverse();
    if(!points.length)throw Error('No reported observations to plot.');
    const echarts=await root.CrownlightECharts?.load?.();
    await session();
    if(!results.contains(plot)||!echarts?.init)throw Error('Chart unavailable; use the numeric table.');
    clearChart();
    chart=echarts.init(plot,null,{renderer:'canvas'});
    chart.setOption({animation:false,grid:{left:80,right:24,top:24,bottom:95},
     xAxis:{type:'category',data:points.map(x=>x.periodEnd),axisLabel:{rotate:35}},
     yAxis:{type:'value',scale:true},
     series:[{type:'bar',name:m.metric,data:points.map(x=>x.value),barMaxWidth:38}]},true);
    if(typeof ResizeObserver!=='undefined'){resize=new ResizeObserver(()=>chart?.resize());resize.observe(plot);}
    plotStatus.textContent='Source: SEC-reported XBRL observations. Reporting periods and restatements may differ.';
   }catch(e){clearChart();plotStatus.textContent=e?.message||'Chart unavailable. Use the table above.';}
  };
 }
 async function loadTier(){
  try{
   const x=await requestJson('/api/sec-scanner-tier-v1');
   tier=x.tier;badge.textContent='Verified SEC Scanner tier: '+tier+'. '+
    (tier==='ADVANCED'?'Financial statements enabled.':tier==='PLUS'?'Filing-time evidence enabled.':'Issuer filing lookup enabled.');
   mode.querySelector('[value="fundamentals"]').disabled=!x.capabilities.fundamentals;
   if(!x.capabilities.fundamentals)mode.value='filings';
   button.disabled=false;
  }catch(e){tier=null;button.disabled=true;badge.textContent=e?.message||'SEC tier unavailable. No research has been retrieved.';}
 }
 button.onclick=async()=>{
  const symbol=ticker.value.trim().toUpperCase();
  if(!/^[A-Z][A-Z0-9.-]{0,11}$/.test(symbol)){status.textContent='Enter a valid issuer ticker.';return;}
  const seq=++sequence;button.disabled=true;clearChart();results.replaceChildren();
  status.textContent='Checking entitlement, source budget and official SEC issuer records…';
  try{
   const data=await requestJson('/api/sec-scanner-research-v1?symbol='+encodeURIComponent(symbol)+
    '&include='+encodeURIComponent(mode.value));
   if(seq!==sequence)return;
   if(data.identityStatus!=='MATCHED'){status.textContent='No uniquely verified SEC CIK was found for that ticker.';return;}
   status.textContent='Authenticated '+data.tier+' research · '+data.filings.length+' reported filings. No trade signal.';
   renderFilings(data);renderFacts(data);
  }catch(e){if(seq===sequence)status.textContent=e?.message||'Official SEC research unavailable.';}
  finally{if(seq===sequence)button.disabled=false;}
 };
 void loadTier();
 void mountOwnerEditor();
 async function mountOwnerEditor(){
  let check;
  try{check=await requestJson('/api/owner-sec-scanner-tier-v1');}catch{return;}
  if(!check?.owner)return;
  const admin=R('section');admin.className='cl-sec-tier-owner';admin.setAttribute('aria-label','Owner-only SEC tier assignments');
  admin.append(R('h3','Owner — SEC tier grants (audited)'),
   R('p','Change SEC Scanner tier only. This does not create membership, Stripe, or Watchlist entitlement.'));
  const target=R('input');target.value=USER.id;target.maxLength=36;
  const tierSelect=R('select');
  for(const t of ['BASIC','PLUS','ADVANCED']){const op=R('option',t);op.value=t;tierSelect.append(op);}
  const state=R('select');
  for(const t of ['active','revoked']){const op=R('option',t);op.value=t;state.append(op);}
  const expiry=R('input');expiry.placeholder='Optional UTC ISO expiry';expiry.maxLength=50;
  const reason=R('input');reason.placeholder='Reason (8–500 characters)';reason.maxLength=500;
  const load=R('button','Load account grant');load.type='button';
  const save=R('button','Save audited SEC grant');save.type='button';
  const adminStatus=R('p','');adminStatus.setAttribute('role','status');adminStatus.setAttribute('aria-live','polite');
  admin.append(labelled('Authenticated member UUID',target),load,
   labelled('Granted research tier',tierSelect),labelled('Grant status',state),
   labelled('Expiry in ISO 8601 UTC (optional)',expiry),
   labelled('Administrative reason',reason),save,adminStatus);
  panel.append(admin);
  let expectedVersion=check.nextExpectedVersion;
  const showGrant=x=>{
   expectedVersion=x.nextExpectedVersion;
   tierSelect.value=x.grant?.tier||'BASIC';state.value=x.grant?.status||'active';
   expiry.value=x.grant?.expires_at||'';
   adminStatus.textContent='Current revision '+expectedVersion+'. Audit required for every change.';
  };
  showGrant(check);
  load.onclick=async()=>{
   try{
    const x=await requestJson('/api/owner-sec-scanner-tier-v1?target='+encodeURIComponent(target.value.trim()));
    showGrant(x);
   }catch(e){expectedVersion=null;adminStatus.textContent=e?.message||'Cannot load member grant.';}
  };
  save.onclick=async()=>{
   if(expectedVersion===null){adminStatus.textContent='Reload the member grant before saving.';return;}
   save.disabled=true;
   try{
    const data=await requestJson('/api/owner-sec-scanner-tier-v1',{method:'POST',
     headers:{'content-type':'application/json'},
     body:JSON.stringify({target:target.value.trim(),tier:tierSelect.value,status:state.value,
      expectedVersion,expiresAt:expiry.value.trim()||null,reason:reason.value.trim()})});
    expectedVersion=data.grant.version;
    adminStatus.textContent='SEC grant updated and audited. Revision '+expectedVersion+'.';
    if(target.value.trim().toLowerCase()===USER.id.toLowerCase())await loadTier();
   }catch(e){adminStatus.textContent=e?.message||'Change rejected. Reload current revision.';}
   finally{save.disabled=false;}
  };
 }
 root.addEventListener('pagehide',clearChart,{once:true});
}
root.CrownlightSecScannerTierUIV1=Object.freeze({mount});
})(globalThis);
