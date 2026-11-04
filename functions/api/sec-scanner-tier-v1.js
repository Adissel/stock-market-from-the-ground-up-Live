import {secTierContext} from '../_lib/sec-scanner-tier-v1.js';
const HEAD={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store',
 'x-content-type-options':'nosniff'};
const reply=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:HEAD});
export async function onRequest({request,env}){
 try{
  if(request.method!=='GET')return reply({ok:false,error:'READ_ONLY'},405);
  const u=new URL(request.url);
  if([...u.searchParams.keys()].length)return reply({ok:false,error:'UNKNOWN_QUERY'},400);
  const {tier,capabilities}=await secTierContext(env,request);
  return reply({ok:true,product:'CROWNLIGHT_SEC_SCANNER',tier,capabilities,
   memberReleaseApproved:false,comparativeIssuerScan:false,source:'SERVER_ENTITLEMENT',
   note:'SEC filing research only; no live exchange data or trading signals.'});
 }catch(e){
  const status=[400,401,403,404,405].includes(e?.status)?e.status:503;
  return reply({ok:false,error:status===503?'SEC tier authorization temporarily unavailable.':e.message},status);
 }
}
