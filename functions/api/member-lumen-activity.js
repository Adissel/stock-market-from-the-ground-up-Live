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
  const [profile,flags,buckets,spends,adjustments,sentGifts,chart,adfree,tools]=await Promise.all([
   rows(config,'profiles?select=account_kind,deleted_at&id=eq.'+uid+'&limit=1'),
   rows(config,'admin_user_flags?select=status&user_id=eq.'+uid+'&limit=20'),
   rows(config,'groundup_question_pass_buckets?select=id,source,origin_key,initial_credits,remaining_credits,issued_at&user_id=eq.'+uid+'&order=issued_at.desc&limit=60'),
   rows(config,'groundup_question_pass_spends?select=id,action,lab_id,credits_spent,spent_at&user_id=eq.'+uid+'&order=spent_at.desc&limit=60'),
   rows(config,'groundup_question_pass_adjustments?select=id,operation,delta,reason,created_at&user_id=eq.'+uid+'&order=created_at.desc&limit=60'),
   rows(config,'gu_lumen_peer_gift_transfers_v1?select=id,amount,status,completed_at&sender_id=eq.'+uid+'&status=eq.completed&order=completed_at.desc&limit=60'),
   rows(config,'gu_sparks_chart_redemptions_v1?select=id,sku,sparks_spent,created_at&user_id=eq.'+uid+'&order=created_at.desc&limit=60'),
   rows(config,'gu_sparks_adfree_redemptions_v1?select=id,sku,sparks_spent,created_at&user_id=eq.'+uid+'&order=created_at.desc&limit=60'),
   rows(config,'gu_lumen_tool_redemptions_v1?select=id,offer_code,cost_lumens,created_at&user_id=eq.'+uid+'&order=created_at.desc&limit=60')
  ]);
  if(profile.length!==1||profile[0].account_kind!=='member'||profile[0].deleted_at!==null||
   flags.some(x=>['suspended','restricted'].includes(String(x.status||'').toLowerCase())))
   return reply({ok:false,error:'Wallet unavailable'},403);
  const events=[];
  for(const b of buckets){
   if(!safeNumber(b.initial_credits)||b.initial_credits<0)throw Error('Invalid grant data');
   events.push({id:'bucket:'+b.id,kind:'credit',lumens:b.initial_credits,
    description:String(b.origin_key||'').startsWith('learning-award:v1:')?'Verified learning reward':
     String(b.origin_key||'').startsWith('peer-gift:v1:')?'Member-to-member Lumen gift received':
     'Lumens issued · '+String(b.source||'unknown').slice(0,55),
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
  for(const g of sentGifts){
   if(!safeNumber(g.amount)||g.amount<10||g.amount>200)throw Error('Invalid gift data');
   events.push({id:'gift:'+g.id,kind:'gift',lumens:-g.amount,
    description:'Member-to-member Lumens sent',occurredAt:g.completed_at});
  }
  for(const item of chart){
   if(!safeNumber(item.sparks_spent)||item.sparks_spent<1)throw Error('Invalid chart Lumen debit');
   events.push({id:'chart:'+item.id,kind:'spend',lumens:-item.sparks_spent,
    description:'Chart Studio Lumen pass · '+String(item.sku||'').slice(0,60),occurredAt:item.created_at});
  }
  for(const item of adfree){
   if(!safeNumber(item.sparks_spent)||item.sparks_spent<1)throw Error('Invalid ad-free Lumen debit');
   events.push({id:'adfree:'+item.id,kind:'spend',lumens:-item.sparks_spent,
    description:'Ad-free Lumen pass · '+String(item.sku||'').slice(0,60),occurredAt:item.created_at});
  }
  for(const item of tools){
   if(!safeNumber(item.cost_lumens)||item.cost_lumens<1)throw Error('Invalid tool Lumen debit');
   events.push({id:'tool:'+item.id,kind:'spend',lumens:-item.cost_lumens,
    description:'Tool Lumen pass · '+String(item.offer_code||'').slice(0,60),occurredAt:item.created_at});
  }
  events.sort((a,b)=>String(b.occurredAt||'').localeCompare(String(a.occurredAt||'')));
  return reply({ok:true,currency:'Crownlight Lumens',
   note:'These are existing wallet events, not a cash transaction or account statement.',
   events:events.slice(0,30),hasMore:events.length>30});
 }catch(e){return reply({ok:false,error:e?.status===401?'Sign-in required':'Wallet history temporarily unavailable'},
  e?.status===401?401:503)}
}
