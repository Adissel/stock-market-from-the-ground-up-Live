/* SMFGU-ENGINE-WORKSPACE-001: private premium ungraded evidence storage.
 * Access requires a fresh member tool/edition grant on EVERY read or write.
 * Server recomputes exercises; cannot persist caller-supplied grades, keys,
 * journal data or historical market feed. A downgrade retains rows but blocks
 * premium reads. Optimistic revision conflict prevents stale account updates.
 */
import {authorizeEditionRequest,onRequest as calculateEdition} from './learning-lab-edition-exercise.js';
import {toolAccess} from './member-tool-access.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store',
 'vary':'Authorization','x-content-type-options':'nosniff'};
const reply=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:H});
const fail=(msg,status)=>Object.assign(new Error(msg),{status});
const validCase=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{3,80}$/.test(x);
const validEdition=x=>['ADVANCED','PROFESSIONAL','ENTERPRISE'].includes(x);
const validFamily=x=>['learning','lab'].includes(x);
function db(env){
 const base=String(env?.SUPABASE_URL||'').replace(/\/$/,'');
 const secret=String(env?.SUPABASE_SECRET_KEY||'');
 if(!/^https:\/\/[^/]+\.supabase\.co$/.test(base)||!secret)throw fail('Storage unavailable.',503);
 const headers={apikey:secret,accept:'application/json','content-type':'application/json'};
 if(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(secret))
  headers.authorization='Bearer '+secret;
 return {base,headers};
}
function sourceUrl(config,actor,body,extra=''){
 const q=new URLSearchParams({select:'id,case_key,family,edition,activity,summary,revision,updated_at',
  user_id:'eq.'+actor,case_key:'eq.'+body.caseKey,
  family:'eq.'+body.family,edition:'eq.'+body.edition});
 if(extra)q.set('revision','eq.'+extra);
 return config.base+'/rest/v1/gu_learning_lab_edition_workspaces_v1?'+q.toString();
}
async function verifyPublishedLab(config,env,request,caseKey,memberId){
 const url=config.base+'/rest/v1/platform_labs?select=lab_id,book_code,active,registry_visible'+
  '&lab_id=eq.'+encodeURIComponent(caseKey)+'&limit=1';
 const r=await fetch(url,{headers:config.headers,cache:'no-store'});
 if(!r.ok)throw fail('Lab registry verification unavailable.',503);
 const rows=await r.json().catch(()=>null);
 if(!Array.isArray(rows)||rows.length!==1||rows[0]?.lab_id!==caseKey||
  rows[0].active!==true||rows[0].registry_visible!==true)
  throw fail('Lab is not in the published canonical registry.',404);
 if(rows[0].book_code==='SITE_EXCLUSIVE'){
  const training=await toolAccess(env,request,'ONDEMAND_TRAINING');
  if(training.userId!==memberId||training.authorized!==true)
   throw fail('Separate site-only training entitlement required.',403);
 }
}
async function dbRead(config,url){
 const r=await fetch(url,{headers:config.headers,cache:'no-store'});
 if(!r.ok)throw fail('Private workspace lookup unavailable.',503);
 const v=await r.json().catch(()=>null);
 if(!Array.isArray(v)||v.length>1)throw fail('Workspace row integrity error.',503);
 return v;
}
function rejectCrossOrigin(request){
 const o=request.headers.get('origin');
 if(o&&o!==new URL(request.url).origin)throw fail('Cross-origin action denied.',403);
 const s=request.headers.get('sec-fetch-site');
 if(s&&!['same-origin','none'].includes(s))throw fail('Cross-site action denied.',403);
}
export async function onRequest({request,env}){
 try{
  if(!['GET','POST'].includes(request.method))return reply({ok:false,error:'Method not allowed'},405);
  rejectCrossOrigin(request);
  const url=new URL(request.url);
  let body;
  if(request.method==='GET'){
   body={family:url.searchParams.get('family'),edition:url.searchParams.get('edition'),
    caseKey:url.searchParams.get('caseKey')};
  }else{
   if(Number(request.headers.get('content-length')||0)>24000)
    throw fail('Request too large.',413);
   const raw=await request.text();
   if(raw.length>24000)throw fail('Request too large.',413);
   try{body=JSON.parse(raw)}catch{throw fail('Invalid workspace request.',400)}
  }
  if(!body||!validFamily(body.family)||!validEdition(body.edition)||!validCase(body.caseKey))
   throw fail('Invalid workspace identity.',400);
  const rights=await authorizeEditionRequest({request,env,family:body.family,edition:body.edition});
  const config=db(env);
  if(body.family==='lab')await verifyPublishedLab(config,env,request,body.caseKey,rights.memberId);
  const target=sourceUrl(config,rights.memberId,body);
  if(request.method==='GET'){
   const rows=await dbRead(config,target);
   return reply({ok:true,found:rows.length===1,workspace:rows[0]||null,
    officialGrade:false,masteryAwarded:false});
  }
  if(!Number.isSafeInteger(body.expectedRevision)||body.expectedRevision<0||
     body.expectedRevision>2147483646)throw fail('Expected revision required.',400);
  const clean={family:body.family,edition:body.edition,activity:body.activity,payload:body.payload};
  const calculateRequest=new Request(request.url,{method:'POST',headers:{
   'authorization':request.headers.get('authorization')||'',
   'content-type':'application/json','origin':new URL(request.url).origin},
   body:JSON.stringify(clean)});
  const computed=await calculateEdition({request:calculateRequest,env});
  if(!computed.ok){const error=await computed.json().catch(()=>({}));
   throw fail(error.error||'Study validation failed.',computed.status);}
  const result=await computed.json();
  const summary=result.result;
  if(!summary||JSON.stringify(summary).length>15000)throw fail('Study evidence too large.',400);
  let write,expected=body.expectedRevision;
  if(expected===0){
   write=await fetch(config.base+'/rest/v1/gu_learning_lab_edition_workspaces_v1?'+
     new URLSearchParams({select:'id,revision,updated_at'}).toString(),{
    method:'POST',cache:'no-store',headers:{...config.headers,
     prefer:'resolution=ignore-duplicates,return=representation'},
    body:JSON.stringify({user_id:rights.memberId,case_key:body.caseKey,
     family:body.family,edition:body.edition,activity:body.activity,
     summary,revision:1})
   });
  }else{
   write=await fetch(sourceUrl(config,rights.memberId,body,String(expected)),{
    method:'PATCH',cache:'no-store',
    headers:{...config.headers,prefer:'return=representation'},
    body:JSON.stringify({activity:body.activity,summary,revision:expected+1,
     updated_at:new Date().toISOString()})
   });
  }
  if(!write.ok)throw fail('Private workspace save unavailable.',503);
  const rows=await write.json().catch(()=>null);
  if(!Array.isArray(rows)||rows.length!==1)
   throw fail('Workspace changed or already exists. Reload the current revision.',409);
  return reply({ok:true,workspace:{id:rows[0].id,revision:rows[0].revision,
   updated_at:rows[0].updated_at},memberRecordsModified:true,
   officialGrade:false,masteryAwarded:false});
 }catch(error){
  const status=[400,401,403,404,405,409,413].includes(error?.status)?error.status:503;
  return reply({ok:false,error:status===503?'Private edition workspace unavailable.':
   error?.message||'Workspace request failed.'},status);
 }
}
