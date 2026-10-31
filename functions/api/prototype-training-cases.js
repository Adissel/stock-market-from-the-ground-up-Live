/* Crownlight Prototype Center V2: server-authorized, fictional teaching cases.
 * No member records, production learning sources, protected answer keys or grading.
 * All role grants are re-read from authoritative Supabase role and permission tables.
 */
const headers={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store, max-age=0','x-content-type-options':'nosniff','x-robots-tag':'noindex, nofollow'};
const response=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const fail=(message,status)=>response({ok:false,error:message},status);
const clean=value=>String(value||'').trim();
function serviceKey(raw){
 const key=clean(raw);
 if(key.startsWith('sb_secret_'))return {apikey:key};
 if(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key))return {apikey:key,authorization:'Bearer '+key};
 throw Error('Server database authorization unavailable');
}
export async function verifyPrototypeStaff(request,env){
 const jwt=/^Bearer\s+(\S+)$/i.exec(request.headers.get('authorization')||'')?.[1];
 if(!jwt)return {status:401};
 const base=clean(env.SUPABASE_URL).replace(/\/$/,'');
 const pub=clean(env.SUPABASE_PUBLISHABLE_KEY)||clean(env.SUPABASE_ANON_KEY);
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base)||!pub)return {status:503};
 const who=await fetch(base+'/auth/v1/user',{headers:{apikey:pub,authorization:'Bearer '+jwt},cache:'no-store'});
 if(who.status===401||who.status===403)return {status:401};
 if(!who.ok)throw Error('Identity verification unavailable');
 const member=await who.json();if(!member?.id)return {status:401};
 const h={...serviceKey(env.SUPABASE_SECRET_KEY),accept:'application/json'};
 const id=encodeURIComponent(member.id);
 const [rolesResult,profileResult,flagResult]=await Promise.all([
  fetch(base+'/rest/v1/admin_user_roles?select=role_code,expires_at&user_id=eq.'+id,{headers:h,cache:'no-store'}),
  fetch(base+'/rest/v1/profiles?select=account_kind,deleted_at&id=eq.'+id+'&limit=1',{headers:h,cache:'no-store'}),
  fetch(base+'/rest/v1/admin_user_flags?select=status&user_id=eq.'+id+'&limit=1',{headers:h,cache:'no-store'})
 ]);
 if(!rolesResult.ok||!profileResult.ok||!flagResult.ok)throw Error('Role verification unavailable');
 const rs=await rolesResult.json(),ps=await profileResult.json(),fs=await flagResult.json();
 const profile=ps[0],flag=fs[0];
 if(!profile||profile.deleted_at||profile.account_kind!=='member'||['restricted','suspended'].includes(clean(flag?.status).toLowerCase()))return {status:403};
 const active=rs.filter(x=>!x.expires_at||Date.parse(x.expires_at)>Date.now()).map(x=>x.role_code);
 if(active.includes('SHOWCASE_VIEWER')||!active.some(x=>['OWNER','ADMIN','TECH_ADMIN'].includes(x)))return {status:403};
 const normalized=[...new Set(active)].filter(x=>/^[A-Z_]+$/.test(x));
 const filter=encodeURIComponent('('+normalized.map(x=>'"'+x+'"').join(',')+')');
 const perms=await fetch(base+'/rest/v1/admin_role_permissions?select=permission_code&role_code=in.'+filter,{headers:h,cache:'no-store'});
 if(!perms.ok)throw Error('Permission verification unavailable');
 if(!(await perms.json()).some(x=>x.permission_code==='control_panel.access'))return {status:403};
 return {status:200};
}
const cases=Object.freeze([
 {id:'CL-PROTO-VWAP-01',topic:'VWAP reclaim',name:'Fictional VWAP reclaim at a decision boundary',type:'FICTIONAL',objective:'Calculate a four-bar OHLCV typical-price weighted VWAP proxy and explain why it is not equivalent to trade-print VWAP or sufficient evidence of a successful reclaim.',note:'OHLC candles and volumes are invented for instruction, not sourced from any market or security.',candles:[
  {time:'09:30',open:10.00,high:10.40,low:9.80,close:10.20,volume:1000},
  {time:'09:31',open:10.20,high:10.50,low:10.10,close:10.40,volume:1500},
  {time:'09:32',open:10.40,high:10.40,low:10.00,close:10.10,volume:2000},
  {time:'09:33',open:10.10,high:10.60,low:10.10,close:10.50,volume:2500}
 ],instructor:'A close above an OHLCV VWAP proxy is one observation, not the exact transaction-weighted session VWAP. Compare relative position, volume, subsequent confirmation and invalidation before interpreting the setup.',question:'What is the typical price of the first candle?',expectedNumerator:10.4+9.8+10.2,expectedDenominator:3},
 {id:'CL-PROTO-BREAKOUT-02',topic:'Breakout',name:'Fictional breakout and rejection',type:'FICTIONAL',objective:'Distinguish an intrabar breakout from a close that holds above resistance.',note:'Invented 1-minute candles. A price touch is not proof of acceptance.',candles:[
  {time:'09:30',open:20.00,high:20.30,low:19.90,close:20.20,volume:1200},
  {time:'09:31',open:20.20,high:20.35,low:20.05,close:20.25,volume:900},
  {time:'09:32',open:20.25,high:20.60,low:20.10,close:20.15,volume:2200},
  {time:'09:33',open:20.15,high:20.25,low:19.80,close:19.90,volume:1800}
 ],instructor:'A wick beyond a level followed by a close back below it can signal rejection; do not infer a reliable outcome without context.',question:'How many dollars per share did the third candle reject from its $20.60 high to its $20.15 close?',expectedNumerator:20.6-20.15,expectedDenominator:1},
 {id:'CL-PROTO-RISK-03',topic:'Risk planning',name:'Fictional stop and target planning',type:'FICTIONAL',objective:'Separate a planned hypothetical risk calculation from actual executable prices and slippage.',note:'Illustrative price series; not a trade recommendation.',candles:[
  {time:'09:30',open:15.00,high:15.15,low:14.85,close:15.05,volume:800},
  {time:'09:31',open:15.05,high:15.30,low:15.00,close:15.25,volume:1200},
  {time:'09:32',open:15.25,high:15.45,low:15.10,close:15.30,volume:1400},
  {time:'09:33',open:15.30,high:15.55,low:15.15,close:15.50,volume:1700}
 ],instructor:'For a hypothetical long entry of $15.25, stop of $15.00 and target of $15.75: risk is $0.25/share, reward is $0.50/share, and the planned reward-to-risk ratio is 2:1 before costs.',question:'What is per-share risk for an entry at $15.25 with a stop at $15.00?',expectedNumerator:15.25-15,expectedDenominator:1}
]);
export async function onRequest({request,env}){
 if(request.method!=='GET')return fail('Method not allowed',405);
 try{
  const status=await verifyPrototypeStaff(request,env);if(status.status!==200)return fail(status.status===401?'Authenticated session required':status.status===403?'Owner or Administrator authorization required':'Authorization service unavailable',status.status);
  const publicCases=cases.map(({expectedNumerator,expectedDenominator,...item})=>item);
  return response({ok:true,source:'FICTIONAL_PROTOTYPE',safeForPublicInstruction:true,privateAnswerKeysIncluded:false,gradingEnabled:false,generatedAt:null,cases:publicCases});
 }catch{return fail('Prototype instructional cases are temporarily unavailable',503)}
}
