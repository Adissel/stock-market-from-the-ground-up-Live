/* Real, read-only Supabase QA member negative acceptance of Prototype Center.
 * Existing LAB_QA_EMAIL/PASSWORD GitHub Secrets only. No payment, role, RLS,
 * member, wallet, progress or protected-content writes. No token logging.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const config=readFileSync('config.js','utf8');
const supabase=config.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const publicKey=config.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
const email=process.env.LAB_QA_EMAIL||'',password=process.env.LAB_QA_PASSWORD||'';
if(!supabase||!publicKey||!email||!password)throw Error('BLOCKED: existing noncommercial QA secrets/config are unavailable; no simulated real-account acceptance.');
const json=async(url,options={})=>{
 const res=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(22000),...options});
 return {status:res.status,body:await res.json().catch(()=>({})),cache:res.headers.get('cache-control')||''};
};
const auth=await json(supabase+'/auth/v1/token?grant_type=password',{
 method:'POST',headers:{apikey:publicKey,'content-type':'application/json'},body:JSON.stringify({email,password})
});
if(auth.status!==200||!auth.body?.access_token)throw Error('BLOCKED: dedicated QA account could not complete genuine Supabase password grant (HTTP '+auth.status+')');
const token=auth.body.access_token;
const verified=await json(supabase+'/auth/v1/user',{headers:{apikey:publicKey,authorization:'Bearer '+token}});
assert.equal(verified.status,200,'Supabase must verify real issued access token');
assert.equal(verified.body?.id,auth.body.user?.id);
const ctx=await json(origin+'/api/admin?action=context',{headers:{authorization:'Bearer '+token}});
if(ctx.status===200){
 const roles=Array.isArray(ctx.body?.roles)?ctx.body.roles:[];
 assert.ok(!roles.some(role=>['OWNER','ADMIN','TECH_ADMIN'].includes(role)), 'Existing QA member unexpectedly has privileged role; test is not valid');
}
for(const path of ['/api/prototype-document','/api/prototype-training-cases']){
 const denied=await json(origin+path,{headers:{authorization:'Bearer '+token,accept:'application/json'}});
 assert.equal(denied.status,403,'Genuine non-staff member must be denied '+path);
 assert.match(denied.cache,/no-store/);
 assert.equal(denied.body?.ok,false);
}
console.log('PASS: real Supabase-issued, non-admin QA member denied both protected Prototype APIs; 0 commerce, role or member-data writes.');
