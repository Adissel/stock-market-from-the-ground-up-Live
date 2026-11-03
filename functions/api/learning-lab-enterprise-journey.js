/* Read-only Enterprise Academy research navigator.
 * Authorize exact family, edition, tool and current session on EVERY request.
 * Linked Labs are published IDs only; book-level purchase is NOT implied.
 */
import {authorizeEditionRequest} from './learning-lab-edition-exercise.js';
import {toolAccess} from './member-tool-access.js';
import {buildEnterpriseResearchJourney} from '../_lib/learning-lab-enterprise-journey-v1.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store',
 'vary':'Authorization','x-content-type-options':'nosniff'};
const respond=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:H});
const deny=(message,status)=>Object.assign(new Error(message),{status});
async function publishedLabs(env){
 const base=String(env?.SUPABASE_URL||'').replace(/\/$/,'');
 const secret=String(env?.SUPABASE_SECRET_KEY||'');
 if(!/^https:\/\/[^/]+\.supabase\.co$/.test(base)||!secret)
  throw deny('Canonical Lab registry unavailable.',503);
 const h={apikey:secret,accept:'application/json'};
 if(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(secret))
  h.authorization='Bearer '+secret;
 const uri=base+'/rest/v1/platform_labs?select=lab_id,active,registry_visible'+
  '&active=eq.true&registry_visible=eq.true&limit=500';
 const r=await fetch(uri,{headers:h,cache:'no-store'});
 if(!r.ok)throw deny('Canonical Lab registry unavailable.',503);
 const list=await r.json().catch(()=>null);
 if(!Array.isArray(list)||list.length>500)throw deny('Malformed published Lab registry.',503);
 return list;
}
export async function onRequest({request,env}){
 try{
  if(request.method!=='GET')return respond({ok:false,error:'Method not allowed.'},405);
  const origin=request.headers.get('origin'),site=request.headers.get('sec-fetch-site');
  if(origin&&origin!==new URL(request.url).origin)throw deny('Cross-origin request denied.',403);
  if(site&&!['same-origin','none'].includes(site))throw deny('Cross-site request denied.',403);
  const family=new URL(request.url).searchParams.get('family');
  if(!['learning','lab'].includes(family))throw deny('Engine family required.',400);
  const rights=await authorizeEditionRequest({request,env,family,edition:'ENTERPRISE'});
  const independent=async tool=>{
   const result=await toolAccess(env,request,tool);
   if(result.userId!==rights.memberId)throw deny('Member session changed.',403);
   return result.authorized===true;
  };
  const trainingAuthorized=family==='learning'?true:await independent('ONDEMAND_TRAINING');
  const labAuthorized=family==='lab'?true:await independent('INTERACTIVE_LEARNING');
  const rows=await publishedLabs(env);
  const journey=buildEnterpriseResearchJourney({authorization:rights.authorization,
   family,trainingAuthorized,labAuthorized,publishedLabs:rows});
  if(!journey)throw deny('Research path validation failed.',503);
  return respond({ok:true,journey,officialGrade:false,masteryAwarded:false,
   memberRecordsModified:false,externalResearchDataDelivered:false});
 }catch(e){
  const status=[400,401,403,405].includes(e?.status)?e.status:503;
  return respond({ok:false,error:status===503?'Enterprise research path unavailable.':
   e.message||'Enterprise access required.'},status);
 }
}
