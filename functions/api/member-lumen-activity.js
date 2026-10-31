/* Authenticated, read-only transaction activity on the existing Crownlight Lumens ledger.
 * Bucket allocations, redemptions and adjustments are shown separately; do not
 * aggregate these source events into the customer's cash spending totals.
 */
import {memberIdentity} from './member-tool-access.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','x-content-type-options':'nosniff'};
const reply=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:H});
const keyHeaders=x=>({apikey:x,accept:'application/json',
 ...(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(x)?{authorization:'Bearer '+x}:{})});
async function rows(config,path){
 const r=await fetch(config.base+'/rest/v1/'+path,{headers:keyHeaders(config.secret),cache:'no-store'});
 if(!r.ok)throw Error('Ledger activity cannot be verified');
 return r.json();
}
const safeNumber=x=>Number.isSafeInteger(x)&&Math.abs(x)<=1000000000;
export async function onRequest({request,env}){
 if(request.method!=='GET')return reply({ok:false,error:'Method not allowed'},405);
 try{
  const {userId,config}=await memberIdentity(env,request);
  const uid=encodeURIComponent(userId);
  const [profile,flags,buckets,spends,adjustments]=await Promise.all([
   rows(config,'profiles?select=account_kind,deleted_at&id=eq.'+uid+'&limit=1'),
   rows(config,'admin_user_flags?select=status&user_id=eq.'+uid+'&limit=20'),
   rows(config,'groundup_question_pass_buckets?select=id,source,initial_credits,remaining_credits,issued_at&user_id=eq.'+uid+'&order=issued_at.desc&limit=60'),
   rows(config,'groundup_question_pass_spends?select=id,action,lab_id,credits_spent,spent_at&user_id=eq.'+uid+'&order=spent_at.desc&limit=60'),
   rows(config,'groundup_question_pass_adjustments?select=id,operation,delta,reason,created_at&user_id=eq.'+uid+'&order=created_at.desc&limit=60')
  ]);
  if(profile.length!==1||profile[0].account_kind!=='member'||profile[0].deleted_at!==null||
   flags.some(x=>['suspended','restricted'].includes(String(x.status||'').toLowerCase())))
   return reply({ok:false,error:'Wallet unavailable'},403);
  const events=[];
  for(const b of buckets){
   if(!safeNumber(b.initial_credits)||b.initial_credits<0)throw Error('Invalid grant data');
   events.push({id:'bucket:'+b.id,kind:'credit',lumens:b.initial_credits,
    description:'Lumens issued · '+String(b.source||'unknown').slice(0,55),
    occurredAt:b.issued_at});
  }
  for(const s of spends){
   if(!safeNumber(s.credits_spent)||s.credits_spent<0)throw Error('Invalid spend data');
   events.push({id:'spend:'+s.id,kind:'spend',lumens:-s.credits_spent,
    description:'Lumen redemption · '+String(s.action||'practice').slice(0,60),
    occurredAt:s.spent_at});
  }
  for(const a of adjustments){
   if(!safeNumber(a.delta))throw Error('Invalid adjustment data');
   events.push({id:'adjustment:'+a.id,kind:'adjustment',lumens:a.delta,
    description:'Wallet adjustment · '+String(a.operation||'adjustment').slice(0,60),
    occurredAt:a.created_at});
  }
  events.sort((a,b)=>String(b.occurredAt||'').localeCompare(String(a.occurredAt||'')));
  return reply({ok:true,currency:'Crownlight Lumens',
   note:'These are existing wallet events, not a cash transaction or account statement.',
   events:events.slice(0,30),hasMore:events.length>30});
 }catch(e){return reply({ok:false,error:e?.status===401?'Sign-in required':'Wallet history temporarily unavailable'},
  e?.status===401?401:503)}
}
