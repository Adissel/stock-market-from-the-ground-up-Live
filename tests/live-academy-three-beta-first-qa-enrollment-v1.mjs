/* A genuine, pre-existing, approved noncommercial QA member across three
 * invitation-only new Boot Camps. No customer writes or purchased entitlements.
 * Does not masquerade as the separately required second-account isolation test.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const cfg=readFileSync('config.js','utf8');
const url=cfg.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const apikey=cfg.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
const email=process.env.LAB_QA_EMAIL,password=process.env.LAB_QA_PASSWORD;
if(!url||!apikey||!email||!password)throw Error('BLOCKED: existing noncommercial QA credentials unavailable');
async function request(url,init={}){
 const response=await fetch(url,{...init,cache:'no-store',signal:AbortSignal.timeout(30000)});
 return {status:response.status,data:await response.json().catch(()=>({}))};
}
const auth=await request(url+'/auth/v1/token?grant_type=password',{method:'POST',
 headers:{apikey,'content-type':'application/json'},body:JSON.stringify({email,password})});
if(auth.status!==200||!auth.data.access_token||!auth.data.user?.id)
 throw Error('BLOCKED: genuine GoTrue QA sign-in failed; do not bypass CAPTCHA');
const actor=auth.data.user.id;
assert.equal(actor,'f42f9301-18e6-43a3-8531-32d371fd22c1','Fail closed: existing dedicated QA identity mismatch');
const verify=await request(url+'/auth/v1/user',{headers:{apikey,authorization:'Bearer '+auth.data.access_token}});
assert.equal(verify.status,200);assert.equal(verify.data.id,actor);
const token=auth.data.access_token;
const get=(code)=>request(origin+'/api/bootcamp-academy?program='+code,{headers:{authorization:'Bearer '+token}});
const post=(code,action,day,extra={})=>request(origin+'/api/bootcamp-academy',{
 method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json',origin},
 body:JSON.stringify({version:'0.14.0.168',program:code,action,day,...extra})
});
const codes=['tape10','indicators10','filings7'];
for(const code of codes){
 const init=await get(code);
 if(init.status!==200||init.data.betaStudy!==true||init.data.progressAvailable!==true)
  throw Error('BLOCKED: real QA is not authorized for '+code);
 if(init.data.enrolled||!Array.isArray(init.data.progress)||init.data.progress.length)
  throw Error('BLOCKED: cannot overwrite any existing member test progress: '+code);
 const guest=await request(origin+'/api/bootcamp-academy?program='+code);
 assert([401,403,404].includes(guest.status),'Private Beta leaked to guest');
}
// Begin approved noncommercial QA writes only after all three programs pass preflight.
let enrolled=0,saved=0,conflicts=0;
for(const code of codes){
 const joined=await post(code,'enroll',0);
 assert.equal(joined.status,200,'QA course enrollment failed '+code);
 assert.equal(joined.data.enrolled,true);enrolled++;
 const read=await get(code);
 assert.equal(read.data.enrolled,true);
 const started=await post(code,'start',1);
 assert.equal(started.status,200);assert.equal(started.data.progress.revision,1);
 const reflection='FICTIONAL QA RECORD '+code+': An independent practice case requires me to document the fictional quote timestamp, issuer original source, numeric denominator, observed candle completion and risk veto at its cutoff before any hypothetical decision. I classify unknown or stale inputs as WAIT and do not record a real trade, private grade, reward or verified mastery.';
 assert(reflection.length>=80&&reflection.length<=2000);
 const save=await post(code,'save_reflection',1,{expectedRevision:1,reflection});
 assert.equal(save.status,200,'QA progress write failed '+code);
 assert.equal(save.data.progress.revision,2);
 assert.equal(save.data.progress.graded,false);
 assert.equal(save.data.progress.competencyMasteryAwarded,false);
 saved++;
 const fresh=await get(code);
 const row=fresh.data.progress.find(x=>x.day===1);
 assert(row&&row.revision===2&&row.reflection===reflection,'QA reflection did not survive production reload');
 const stale=await post(code,'save_reflection',1,{expectedRevision:1,reflection:reflection+' INVALID STALE'});
 assert.equal(stale.status,409,'Concurrent stale revision must reject');conflicts++;
}
assert.equal(enrolled,3);assert.equal(saved,3);assert.equal(conflicts,3);
console.log('PASS first genuine QA member: three invited Beta enrollments, three saves/reloads, three 409 stale CAS rejections, guest denial, zero official grading, no payments or Lumens.');
console.log('RESULT '+JSON.stringify({accepted:'ONE_REAL_QA_THREE_PROGRAMS',realUsers:1,enrollments:3,saves:3,staleConflicts:3,expectedSixTotal:6,liveCharges:0}));
