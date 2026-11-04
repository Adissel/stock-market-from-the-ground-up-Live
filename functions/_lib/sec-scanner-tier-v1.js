/* Crownlight SEC Scanner v1: independent server-only entitlements.
 * Existing WATCHLIST_WORKBENCH research access is intentionally unchanged.
 */
import {advancedToolContext,privateJson} from './advanced-tool-access-v014110.js';
export const SEC_TIERS=Object.freeze(['BASIC','PLUS','ADVANCED']);
const tierRank=Object.freeze({BASIC:0,PLUS:1,ADVANCED:2});
const fail=(message,status=403)=>Object.assign(new Error(message),{status});

export function tierAtLeast(tier,required) {
 return Object.hasOwn(tierRank,tier)&&Object.hasOwn(tierRank,required)&&tierRank[tier]>=tierRank[required];
}
export function activeSecTier(rows,now=Date.now()) {
 if(!Array.isArray(rows)||rows.length>1)throw fail('SEC tier grant storage unavailable.',503);
 const row=rows[0];
 if(!row)return 'BASIC';
 if(!SEC_TIERS.includes(row.tier)||!['active','revoked'].includes(row.status)||
    !Number.isInteger(row.version)||row.version<1)throw fail('SEC tier grant invalid.',503);
 if(row.status==='revoked')return 'BASIC';
 if(row.expires_at!==null&&row.expires_at!==undefined){
  const expires=Date.parse(row.expires_at);
  if(!Number.isFinite(expires))throw fail('SEC tier expiry invalid.',503);
  if(expires<=now)return 'BASIC';
 }
 return row.tier;
}
export async function secTierContext(env,request) {
 const actor=await advancedToolContext(env,request,'CATALYST_RESEARCH');
 if(actor.allowed!==true||actor.accessLevel!=='entitled')throw fail('Active Catalyst Research entitlement required.');
 const rows=await privateJson(actor.c,
  'gu_sec_scanner_tier_grants_v1?select=tier,status,version,expires_at&user_id=eq.'+
   encodeURIComponent(actor.userId)+'&limit=1');
 const tier=activeSecTier(rows);
 return {actor,tier,
  capabilities:Object.freeze({issuerLookup:true,filingDates:true,
   acceptedTimeWindows:tierAtLeast(tier,'PLUS'),
   formReview:tierAtLeast(tier,'PLUS'),
   fundamentals:tierAtLeast(tier,'ADVANCED'),
   comparativeIssuerScan:false,continuousMonitoring:false})};
}
export const SEC_SCANNER_TOOL='CATALYST_RESEARCH';
