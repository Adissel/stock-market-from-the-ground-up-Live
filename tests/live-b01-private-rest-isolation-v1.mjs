/* Genuine single-QA-member read-denial acceptance for private B01 rubrics.
 * No attempts, grades, member-state writes, entitlements or monetary operations.
 * Never print JWTs, passwords, question content or keys.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const config=readFileSync('config.js','utf8');
const url=config.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const pub=config.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
const email=process.env.LAB_QA_EMAIL||'';
const password=process.env.LAB_QA_PASSWORD||'';
const expectedQA='f42f9301-18e6-43a3-8531-32d371fd22c1';
if(!url||!pub||!email||!password)
 throw Error('BLOCKED: Supabase public config and prior approved GitHub-only QA secrets required');
async function req(target,init={}){
 const r=await fetch(target,{...init,cache:'no-store',signal:AbortSignal.timeout(25000)});
 return r;
}
const readPrivate=async(table,token)=>{
 const fields=table==='lab_training_sets_v014'?'lab_id,version,questions,answer_key':'id,user_id,lab_id,report';
 const filter=table==='lab_training_sets_v014'?'&lab_id=eq.F1-C02-L01&version=eq.98':'&lab_id=eq.F1-C02-L01';
 const r=await req(url+'/rest/v1/'+table+'?select='+fields+filter+'&limit=1',{headers:{
  apikey:pub,...(token?{authorization:'Bearer '+token}:{})}});
 // Never parse / log response body: it might contain grading keys if broken.
 await r.body?.cancel().catch(()=>{});
 return r.status;
};
const deny=status=>[401,403].includes(status);
try {
 for(const table of ['lab_training_sets_v014','lab_training_attempts_v014']){
  const status=await readPrivate(table,'');
  assert(deny(status),'ANON_PRIVATE_DATA_EXPOSURE: '+table+' HTTP '+status);
 }
 const session=await req(url+'/auth/v1/token?grant_type=password',{method:'POST',
  headers:{apikey:pub,'content-type':'application/json'},
  body:JSON.stringify({email,password})});
 assert.equal(session.status,200,'Authorized existing QA sign-in failed');
 const auth=await session.json();
 assert(auth.access_token,'No legitimate GoTrue access token');
 const who=await req(url+'/auth/v1/user',{headers:{apikey:pub,authorization:'Bearer '+auth.access_token}});
 assert.equal(who.status,200,'QA user identity lookup failed');
 const user=await who.json();
 assert.equal(user.id,expectedQA,'Unexpected identity; do not test unrelated members');
 for(const table of ['lab_training_sets_v014','lab_training_attempts_v014']){
  const status=await readPrivate(table,auth.access_token);
  assert(deny(status),'MEMBER_PRIVATE_DATA_EXPOSURE: '+table+' HTTP '+status);
 }
 console.log('PASS genuine GoTrue QA identity + anon and authenticated REST denial of private B01 answer keys and attempt reports, four explicit non-read outcomes; NO mutations');
 console.log('NOT TESTED: second distinct genuine member, native CAPTCHA browser sign-in, formal grading, reviewer approval or screen reader.');
}catch(e){console.error('FAIL OR BLOCKED private B01 one-member REST read-denial acceptance: '+String(e.message||e).slice(0,300));process.exitCode=1;}
