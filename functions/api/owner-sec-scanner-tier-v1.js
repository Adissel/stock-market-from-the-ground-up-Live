/* Owner-only Crownlight SEC tier editor: no new payment grants or account ownership changes. */
import {advancedToolContext,privateJson,serviceHeaders} from '../_lib/advanced-tool-access-v014110.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store',
 'x-content-type-options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:H});
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function ownerContext(env,request){
 const actor=await advancedToolContext(env,request,'CATALYST_RESEARCH');
 if(!actor.allowed||actor.accessLevel!=='entitled')return null;
 const roles=await privateJson(actor.c,'admin_user_roles?select=role_code,expires_at&user_id=eq.'+
  encodeURIComponent(actor.userId));
 if(!Array.isArray(roles)||!roles.some(x=>x?.role_code==='OWNER'&&
  (x.expires_at==null||(Number.isFinite(Date.parse(x.expires_at))&&Date.parse(x.expires_at)>Date.now()))))
  return null;
 return actor;
}
export async function onRequest({request,env}){
 try{
  if(!['GET','POST'].includes(request.method))return json({ok:false,error:'METHOD_NOT_ALLOWED'},405);
  const actor=await ownerContext(env,request);
  if(!actor)return json({ok:false,error:'OWNER_ACCESS_REQUIRED'},403);
  const url=new URL(request.url);
  if(url.searchParams.size>1||[...url.searchParams.keys()].some(x=>x!=='target'))
   return json({ok:false,error:'UNSUPPORTED_QUERY'},400);
  if(request.method==='GET'){
   const target=url.searchParams.get('target')||actor.userId;
   if(!UUID.test(target))return json({ok:false,error:'INVALID_TARGET'},400);
   const rows=await privateJson(actor.c,
    'gu_sec_scanner_tier_grants_v1?select=user_id,tier,status,version,expires_at,updated_at,reason&user_id=eq.'+
      encodeURIComponent(target)+'&limit=1');
   if(!Array.isArray(rows)||rows.length>1)return json({ok:false,error:'SEC_GRANT_STORE_UNAVAILABLE'},503);
   return json({ok:true,owner:true,target,grant:rows[0]||null,
    nextExpectedVersion:rows[0]?.version||0});
  }
  if(url.searchParams.size)return json({ok:false,error:'QUERY_NOT_ALLOWED'},400);
  const raw=await request.text();
  if(raw.length>2000)return json({ok:false,error:'OVERSIZE_CHANGE'},413);
  let input;try{input=JSON.parse(raw)}catch{return json({ok:false,error:'INVALID_JSON'},400)}
  if(!input||typeof input!=='object'||Array.isArray(input)||
     Object.keys(input).some(k=>!['target','tier','status','expectedVersion','expiresAt','reason'].includes(k)))
   return json({ok:false,error:'INVALID_CHANGE_FIELDS'},400);
  if(!UUID.test(input.target)||!['BASIC','PLUS','ADVANCED'].includes(input.tier)||
     !['active','revoked'].includes(input.status)||
     !Number.isSafeInteger(input.expectedVersion)||input.expectedVersion<0||
     input.expectedVersion>2147483640||typeof input.reason!=='string'||
     input.reason.trim().length<8||input.reason.length>500||
     (input.expiresAt!==null&&input.expiresAt!==undefined&&
      (typeof input.expiresAt!=='string'||!Number.isFinite(Date.parse(input.expiresAt))||
       Date.parse(input.expiresAt)<=Date.now())))
   return json({ok:false,error:'INVALID_TIER_CHANGE'},400);
  const rpc=await fetch(actor.c.base+'/rest/v1/rpc/gu_sec_scanner_set_tier_v1',{
   method:'POST',cache:'no-store',
   headers:serviceHeaders(actor.c.secret,true),
   body:JSON.stringify({p_actor:actor.userId,p_target:input.target,p_tier:input.tier,
    p_status:input.status,p_expected_version:input.expectedVersion,
    p_expires_at:input.expiresAt||null,p_reason:input.reason.trim()})
  });
  if(!rpc.ok){
   const error=await rpc.json().catch(()=>({}));
   return json({ok:false,error:error.code==='40001'?'STALE_SEC_TIER_REVISION':'SEC_TIER_CHANGE_REJECTED'},
    error.code==='40001'?409:503);
  }
  const result=await rpc.json().catch(()=>null);
  if(!result?.ok||!Number.isInteger(result.version))return json({ok:false,error:'SEC_GRANT_CONFIRMATION_FAILED'},503);
  return json({ok:true,grant:result});
 }catch(e){
  const code=[400,401,403,404,405].includes(e?.status)?e.status:503;
  return json({ok:false,error:code===503?'SEC tier administration unavailable.':e.message},code);
 }
}
