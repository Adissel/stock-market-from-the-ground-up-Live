/* Protected Crownlight Lumens gifting API.
 * Exact opt-in @username search; service-verified transfer; disabled until
 * independent legal/security clearance. No anonymous recipient enumeration.
 */
import {memberIdentity} from './member-tool-access.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','x-content-type-options':'nosniff'};
const reply=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:H});
const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8a-f][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const HANDLE=/^@[A-Za-z][A-Za-z0-9_]{2,23}$/;
const headers=key=>({apikey:key,accept:'application/json','content-type':'application/json',
 ...(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key)?{authorization:'Bearer '+key}:{})});
async function rest(c,path,opt={}){
 const r=await fetch(c.base+'/rest/v1/'+path,{...opt,cache:'no-store',headers:{...headers(c.secret),...opt.headers}});
 if(!r.ok)throw Error('Gifting service is unavailable');
 return r.json();
}
async function release(c){
 const rows=await rest(c,'gu_lumen_completion_release_v1?select=member_gifts_enabled,legal_gifting_clearance,security_gifting_clearance&singleton=eq.true&limit=1');
 const r=rows?.[0]||{};
 return r.member_gifts_enabled===true&&r.legal_gifting_clearance===true&&r.security_gifting_clearance===true;
}
export async function onRequest({request,env}){
 if(!['GET','POST'].includes(request.method))return reply({ok:false,error:'Method not allowed'},405);
 if(request.method==='POST'&&request.headers.get('origin')!==new URL(request.url).origin)
  return reply({ok:false,error:'Same-origin confirmation required'},403);
 try{
  const {userId,config}=await memberIdentity(env,request);
  const [profiles,flags,ready]=await Promise.all([
   rest(config,'profiles?select=account_kind,deleted_at&id=eq.'+encodeURIComponent(userId)+'&limit=1'),
   rest(config,'admin_user_flags?select=status&user_id=eq.'+encodeURIComponent(userId)+'&limit=20'),
   release(config)
  ]);
  if(profiles?.[0]?.account_kind!=='member'||profiles[0].deleted_at!==null||
   flags.some(r=>['suspended','restricted'].includes(String(r.status||'').toLowerCase())))
   return reply({ok:false,error:'Account not eligible for gifting'},403);
  if(request.method==='GET'){
   const handle=new URL(request.url).searchParams.get('handle');
   if(!handle)return reply({ok:true,enabled:ready,minLumens:10,maxLumens:200,
     policy:'Noncash member gifts; only earned transferable credits when activated.'});
   if(!ready)return reply({ok:false,enabled:false,error:'Member gifting is not yet released'},409);
   if(!HANDLE.test(handle))return reply({ok:false,error:'Enter an exact @username'},400);
   const username=encodeURIComponent(handle.slice(1));
   const people=await rest(config,'profiles?select=id,username,account_kind,deleted_at&username=ilike.'+username+'&limit=2');
   const candidate=people.length===1?people[0]:null;
   if(!candidate||candidate.id===userId||candidate.account_kind!=='member'||candidate.deleted_at!=null)
    return reply({ok:true,found:false});
   const opt=await rest(config,'gu_lumen_peer_gift_optin_v1?select=discoverable,receiving_enabled&user_id=eq.'+encodeURIComponent(candidate.id)+'&limit=1');
   const allowed=opt.length===1&&opt[0].discoverable===true&&opt[0].receiving_enabled===true;
   return reply(allowed?{ok:true,found:true,handle:'@'+candidate.username}:{ok:true,found:false});
  }
  const raw=await request.text();
  if(raw.length>1800)return reply({ok:false,error:'Invalid request size'},413);
  let body;try{body=JSON.parse(raw)}catch{return reply({ok:false,error:'Invalid JSON'},400)}
  if(!body||typeof body!=='object'||Array.isArray(body))return reply({ok:false,error:'Invalid request'},400);
  if(!ready)return reply({ok:false,enabled:false,error:'Gifting is not yet released'},409);
  if(body.action==='optin'&&typeof body.discoverable==='boolean'&&typeof body.receivingEnabled==='boolean'&&
     Object.keys(body).length===3){
   await rest(config,'gu_lumen_peer_gift_optin_v1?on_conflict=user_id',{
    method:'POST',headers:{prefer:'resolution=merge-duplicates,return=minimal'},
    body:JSON.stringify({user_id:userId,discoverable:body.discoverable,receiving_enabled:body.receivingEnabled})});
   return reply({ok:true,optedIn:body.receivingEnabled});
  }
  if(body.action!=='send'||Object.keys(body).length!==4||!HANDLE.test(body.recipient)||
     !Number.isSafeInteger(body.lumens)||body.lumens<10||body.lumens>200||
     typeof body.requestId!=='string'||!UUID.test(body.requestId))
   return reply({ok:false,error:'Invalid gift request'},400);
  const value=await rest(config,'rpc/gu_lumen_peer_send_v1',{method:'POST',
   body:JSON.stringify({p_sender:userId,p_handle:body.recipient,p_amount:body.lumens,p_request:body.requestId})});
  if(value?.ok!==true)throw Error('Unverified transfer');
  return reply({ok:true,transactionId:value.giftId||null,idempotent:value.idempotent===true,
    lumens:body.lumens});
 }catch(e){return reply({ok:false,error:e?.status===401?'Sign-in required':'Gifting unavailable or not permitted'},
  e?.status===401?401:503)}
}
