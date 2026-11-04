/* SEC EDGAR rollout guard: never equate an existing Watchlist entitlement with
 * general SEC source activation. QA is explicitly granted and audited.
 */
import {privateJson} from './advanced-tool-access-v014110.js';

const error=(message,status)=>Object.assign(new Error(message),{status});
const ALLOWED=Object.freeze(['BASIC','PLUS','ADVANCED']);

export function isActiveSecQaGrant(rows,now=Date.now()){
 if(!Array.isArray(rows)||rows.length>1)throw error('SEC QA grant could not be verified.',503);
 if(rows.length===0)return false;
 const row=rows[0];
 if(!row||!ALLOWED.includes(row.tier)||!['active','revoked'].includes(row.status)||
    !Number.isSafeInteger(row.version)||row.version<1)
  throw error('SEC QA grant is invalid.',503);
 if(row.expires_at!==null&&row.expires_at!==undefined){
  if(typeof row.expires_at!=='string')throw error('SEC QA grant expiry is invalid.',503);
  const until=Date.parse(row.expires_at);
  if(!Number.isFinite(until))throw error('SEC QA grant expiry is invalid.',503);
  if(until<=now)return false;
 }
 return row.status==='active';
}

export function secSourceContact(env){
 const contact=String(env?.SEC_EDGAR_USER_AGENT||'').trim();
 if(contact.length<12||contact.length>160||/[\\r\\n]/.test(contact)||
    !/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/i.test(contact))
  throw error('SEC source requires a configured contact-identifying User-Agent.',503);
 return contact;
}
export async function requireSecSourceRelease(actor,env){
 if(env.SEC_EDGAR_BETA_ENABLED!=='true')
  throw error('Official SEC source retrieval is not enabled.',503);
 secSourceContact(env);
 if(!actor?.c||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actor.userId||''))
  throw error('Authenticated SEC member required.',403);
 if(env.SEC_EDGAR_GENERAL_RELEASE_APPROVED==='true')return 'GENERAL_RELEASE';
 const id=encodeURIComponent(actor.userId);
 const rows=await privateJson(actor.c,
  'gu_sec_scanner_tier_grants_v1?select=tier,status,version,expires_at&user_id=eq.'+
   id+'&limit=2');
 if(!isActiveSecQaGrant(rows))throw error('SEC source access is restricted to approved QA members.',403);
 return 'AUDITED_QA';
}
