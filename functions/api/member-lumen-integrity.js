/* Noncharging private wallet integrity check backed by the authoritative
 * credit-bucket summary, gift/award links and dispute flags in Supabase.
 */
import {memberIdentity} from './member-tool-access.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','x-content-type-options':'nosniff'};
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:H});
const authHeaders=key=>({apikey:key,accept:'application/json',
 ...(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key)?{authorization:'Bearer '+key}:{})});
async function rest(config,path,options={}){
 const r=await fetch(config.base+'/rest/v1/'+path,{
  cache:'no-store',...options,
  headers:{...authHeaders(config.secret),...(options.headers||{})}
 });
 if(!r.ok)throw Error('Integrity source unavailable');
 return r.json();
}
export async function onRequest({request,env}){
 if(request.method!=='GET')return reply({ok:false,error:'Method not allowed'},405);
 try{
  const {userId,config}=await memberIdentity(env,request);
  const uid=encodeURIComponent(userId);
  const [p,flags]=await Promise.all([
   rest(config,'profiles?select=account_kind,deleted_at&id=eq.'+uid+'&limit=1'),
   rest(config,'admin_user_flags?select=status&user_id=eq.'+uid+'&limit=20')
  ]);
  if(p.length!==1||p[0].account_kind!=='member'||p[0].deleted_at!=null||
   flags.some(f=>['suspended','restricted'].includes(String(f.status||'').toLowerCase())))
   return reply({ok:false,error:'Account not eligible'},403);
  const d=await rest(config,'rpc/gu_lumen_member_wallet_integrity_v1',{
   method:'POST',headers:{'content-type':'application/json'},
   body:JSON.stringify({p_user:userId})
  });
  if(d?.ok!==true||typeof d.balanced!=='boolean')throw Error('Unverified integrity result');
  const summary=d.wallet||{};
  if(!Number.isSafeInteger(summary.available)||summary.available<0)throw Error('Invalid balance');
  return reply({ok:true,currency:'Crownlight Lumens',
   balanced:d.balanced,available:summary.available,
   discrepancyCount:Number(d.invalidAwardCredits||0)+Number(d.invalidGiftCredits||0),
   openDisputes:Number(d.openDisputes||0),awardCount:Number(d.awardCount||0),
   giftCount:Number(d.giftCount||0),
   note:'Verified against the authoritative current credit buckets; recent activity is not a complete cash statement.'});
 }catch(e){return reply({ok:false,error:e?.status===401?'Sign-in required':'Wallet verification unavailable'},
  e?.status===401?401:503)}
}
