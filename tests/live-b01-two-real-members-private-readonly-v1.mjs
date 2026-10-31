/* B01 graded beta: genuine TWO distinct preexisting GoTrue members,
 * noncommercial READ ONLY; no private question, answer or JWT logging.
 * No email verification bypass, entitlements, attempts, grading or writes.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHmac} from 'node:crypto';
const cfg=readFileSync('config.js','utf8');
const url=cfg.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const pub=cfg.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
assert(url&&pub,'Public Supabase configuration missing');
const first={email:process.env.LAB_QA_EMAIL||'',password:process.env.LAB_QA_PASSWORD||''};
const explicitSecond=!!(process.env.LAB_QA_SECOND_EMAIL&&process.env.LAB_QA_SECOND_PASSWORD);
const second={
 email:explicitSecond?process.env.LAB_QA_SECOND_EMAIL:
 'stockmarketfromthegroundup+smfgu-qa2v1@gmail.com',
 password:explicitSecond?process.env.LAB_QA_SECOND_PASSWORD:
 (first.password?createHmac('sha256',first.password).update('smfgu:isolated-second-qa:2026-10-31:v1').digest('hex')+'Qa2!':'')
};
if(!first.email||!first.password||!second.email||!second.password)
 throw Error('BLOCKED: two real member QA credentials absent; no synthetic identity substitute');
async function send(urlValue,init={}){
 return fetch(urlValue,{...init,cache:'no-store',signal:AbortSignal.timeout(26000)});
}
async function login(c){
 const r=await send(url+'/auth/v1/token?grant_type=password',{method:'POST',
 headers:{apikey:pub,'content-type':'application/json'},body:JSON.stringify({email:c.email,password:c.password})});
 if(r.status!==200)throw Error('BLOCKED: real distinct QA login failed HTTP '+r.status);
 const body=await r.json();
 assert(body.access_token&&body.user?.id,'No actual authenticated member token');
 const chk=await send(url+'/auth/v1/user',{headers:{apikey:pub,authorization:'Bearer '+body.access_token}});
 assert.equal(chk.status,200,'Real user identity could not be independently verified');
 const user=await chk.json();
 assert.equal(user.id,body.user.id,'Auth token identity mismatch');
 return {id:user.id,token:body.access_token};
}
async function privateRest(table,token,targetId){
 const fields=table==='lab_training_sets_v014'?'lab_id,version,questions,answer_key':'id,user_id,lab_id,report';
 const filter=table==='lab_training_sets_v014'?'&lab_id=eq.F1-C02-L01&version=eq.98':
 '&user_id=eq.'+encodeURIComponent(targetId);
 const headers={apikey:pub,...(token?{authorization:'Bearer '+token}:{})};
 const res=await send(url+'/rest/v1/'+table+'?select='+fields+filter+'&limit=1',{headers});
 // Do not parse or print potentially secret response body even on error.
 await res.body?.cancel().catch(()=>{});
 return res.status;
}
const deny=x=>x===401||x===403;
try{
 const firstSession=await login(first),secondSession=await login(second);
 assert.notEqual(firstSession.id,secondSession.id,'Two distinct genuine GoTrue identities required');
 assert.equal(firstSession.id,'f42f9301-18e6-43a3-8531-32d371fd22c1',
 'Unexpected primary QA account');
 const subjects=[null,firstSession,secondSession];
 let checks=0;
 for(const actor of subjects){
  for(const table of ['lab_training_sets_v014','lab_training_attempts_v014']){
   for(const target of [firstSession,secondSession]){
    const code=await privateRest(table,actor?.token,target.id);
    assert(deny(code),'PRIVATE_DATA_READ_ACCESS: '+table+' actor='+Boolean(actor)+' HTTP='+code);
    checks++;
   }
  }
 }
 console.log('PASS two distinct GoTrue members and anonymous identity: '+checks+
 ' direct protected assessment/attempt read denials; 0 writes or payments.');
 console.log('NOT ACCEPTED: native browser CAPTCHA, official graded member flow, private reviewer identity, real blind human testing or accessible report.');
}catch(e){
 console.error('BLOCKED/FAIL genuine two-member confidential B01 acceptance: '+
 String(e?.message||e).slice(0,260));
 process.exitCode=1;
}