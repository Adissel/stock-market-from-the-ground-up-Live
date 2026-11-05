import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
/* Two distinct genuine password-authenticated QA accounts; RLS negative
 * read tests only. No service key, role impersonation, records, or purchases. */
const source=readFileSync('config.js','utf8');
const url=source.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const anon=source.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
const credentials=[
 [process.env.LAB_QA_EMAIL||'',process.env.LAB_QA_PASSWORD||''],
 [process.env.LAB_QA_SECOND_EMAIL||'',process.env.LAB_QA_SECOND_PASSWORD||'']
];
if(!url||!anon||credentials.some(([email,password])=>!email.trim()||!password))
 throw Error('BLOCKED_SECOND_QA_CREDENTIALS: supply both genuine nonstaff QA login pairs securely; never put secrets in source.');
const ask=async(path,{token=null,method='GET',body}={})=>{
 const r=await fetch(url+path,{method,cache:'no-store',signal:AbortSignal.timeout(25000),
  headers:{apikey:anon,'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},
  ...(body?{body:JSON.stringify(body)}:{})});
 return {status:r.status,data:await r.json().catch(()=>null)};
};
const users=[];
for(const [email,password] of credentials){
 const a=await ask('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
 assert.equal(a.status,200,'BLOCKED: a genuine QA login was not accepted (no password printed)');
 assert(a.data?.access_token&&a.data?.user?.id,'Supabase did not issue authenticated member identity');
 const token=a.data.access_token;
 const u=await ask('/auth/v1/user',{token});
 assert.equal(u.status,200);
 assert.equal(u.data.id,a.data.user.id);
 users.push({id:u.data.id,token});
}
assert.notEqual(users[0].id,users[1].id,'BLOCKED: two login pairs resolve to the same account');
const profile=async user=>{
 const a=await ask('/rest/v1/profiles?select=id,account_kind,deleted_at&id=eq.'+user.id+'&limit=1',{token:user.token});
 assert.equal(a.status,200,'Member profile must remain accessible to its owner');
 assert.equal(a.data?.length,1);
 assert.equal(a.data[0].account_kind,'member');
 assert.equal(a.data[0].deleted_at,null);
};
await Promise.all(users.map(profile));
for(const table of ['site_lab_progress','decision_journal']){
 const own=await ask('/rest/v1/'+table+'?select=user_id&user_id=eq.'+users[0].id+'&limit=100',{token:users[0].token});
 assert.equal(own.status,200,table+' owner read HTTP status');
 assert(Array.isArray(own.data)&&own.data.length>0,table+' needs real owner-owned rows to prove isolation');
 assert(own.data.every(x=>x.user_id===users[0].id),'Owner self-scope mismatch');
 const ownB=await ask('/rest/v1/'+table+'?select=user_id&user_id=eq.'+users[1].id+'&limit=100',{token:users[1].token});
 assert.equal(ownB.status,200,table+' QA B owner read HTTP status');
 assert(Array.isArray(ownB.data)&&ownB.data.length>0,table+' requires genuine QA B-owned rows; an empty reverse test is not acceptance');
 assert(ownB.data.every(x=>x.user_id===users[1].id),'QA B own-scope mismatch');
 const other=await ask('/rest/v1/'+table+'?select=user_id&user_id=eq.'+users[0].id+'&limit=100',{token:users[1].token});
 assert.equal(other.status,200,table+' second-member RLS query status');
 assert.deepEqual(other.data,[],table+' leaked first member rows to second member');
 const reverse=await ask('/rest/v1/'+table+'?select=user_id&user_id=eq.'+users[1].id+'&limit=100',{token:users[0].token});
 assert.equal(reverse.status,200);
 assert.deepEqual(reverse.data,[],table+' leaked second member rows to first member');
 console.log('PASS genuine two-account read isolation: '+table+' private owner rows denied cross-account');
}
console.log('PASS two real Supabase member identities; direct Data API RLS protects Lab progress and Journal; zero writes');
