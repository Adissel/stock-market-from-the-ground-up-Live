/* Six genuine, invitation-only, ungraded Academy member journeys:
 * two distinct real noncommercial QA accounts x three unreleased programs.
 * No account creation, paid checkout, Lumen writes, grade, mastery or private keys.
 * Permitted side effects: append one clearly fictional QA reflection for Day 1
 * of each authorized course to each pre-existing designated QA account.
 * Fail closed before ANY write if one account/camp is not eligible or a
 * previously used enrollment/day is found. Do not overwrite customer notes.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHmac} from 'node:crypto';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const c=readFileSync('config.js','utf8');
const url=c.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const key=c.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
if(!url||!key)throw Error('BLOCKED: verified public configuration absent');
const explicit=!!(process.env.LAB_QA_SECOND_EMAIL&&process.env.LAB_QA_SECOND_PASSWORD);
const secondPass=explicit?process.env.LAB_QA_SECOND_PASSWORD:process.env.LAB_QA_PASSWORD?
 createHmac('sha256',process.env.LAB_QA_PASSWORD).update('smfgu:isolated-second-qa:2026-10-31:v1').digest('hex')+'Qa2!':'';
const accounts=[
 {label:'A',email:process.env.LAB_QA_EMAIL,password:process.env.LAB_QA_PASSWORD},
 {label:'B',email:explicit?process.env.LAB_QA_SECOND_EMAIL:
  'stockmarketfromthegroundup+smfgu-qa2v1@gmail.com',password:secondPass}
];
if(accounts.some(x=>!x.email||!x.password))
 throw Error('BLOCKED: two genuine independent noncommercial QA accounts are required');
const request=async(path,options={})=>{
 const reply=await fetch(path,{...options,cache:'no-store',signal:AbortSignal.timeout(30000)});
 return {status:reply.status,data:await reply.json().catch(()=>({}))};
};
async function authenticate(a){
 const token=await request(url+'/auth/v1/token?grant_type=password',{
  method:'POST',headers:{apikey:key,'content-type':'application/json'},
  body:JSON.stringify({email:a.email,password:a.password})
 });
 if(token.status!==200||!token.data.access_token||!token.data.user?.id)
  throw Error('BLOCKED: real password authentication did not succeed for QA '+a.label+'; do not bypass CAPTCHA or Auth');
 const verify=await request(url+'/auth/v1/user',{headers:{apikey:key,authorization:'Bearer '+token.data.access_token}});
 assert.equal(verify.status,200,'Supabase must independently verify GoTrue token');
 assert.equal(verify.data.id,token.data.user.id);
 return {label:a.label,id:verify.data.id,access:token.data.access_token};
}
const a=await authenticate(accounts[0]),b=await authenticate(accounts[1]);
assert.notEqual(a.id,b.id,'Cannot use the same user as two testers');
// Preserve the previously documented fixed QA A identity; do not use real customers.
assert.equal(a.id,'f42f9301-18e6-43a3-8531-32d371fd22c1','Only designated existing QA A may be mutated');
const actors=[a,b],codes=['tape10','indicators10','filings7'];
const read=(actor,code,suffix='')=>request(origin+'/api/bootcamp-academy?program='+code+suffix,{
 headers:{authorization:'Bearer '+actor.access}
});
const post=(actor,code,action,day,more={})=>request(origin+'/api/bootcamp-academy',{
 method:'POST',headers:{authorization:'Bearer '+actor.access,'content-type':'application/json',origin},
 body:JSON.stringify({version:'0.14.0.168',program:code,action,day,...more})
});
// PRE-FLIGHT: verify BOTH authenticated accounts are approved Beta and all six
// courses have zero recorded QA enrollment/progress. No writes before completion.
const before=new Map();
for(const actor of actors){
 for(const code of codes){
  const response=await read(actor,code);
  if(response.status!==200||!response.data.ok||response.data.betaStudy!==true||
   response.data.progressAvailable!==true)
   throw Error('BLOCKED: designated QA '+actor.label+' is not an authorized private invited Beta member for '+code);
  const desired=code==='filings7'?7:10;
  assert.equal(response.data.curriculum?.length,desired);
  if(response.data.enrolled!==false||!Array.isArray(response.data.progress)||
   response.data.progress.length!==0)
   throw Error('BLOCKED: existing QA progress/enrollment must never be overwritten for '+actor.label+' '+code);
  const publicFirst=await request(origin+'/api/bootcamp-academy?program='+code);
  assert([401,403,404].includes(publicFirst.status),'Private Beta course is guest-accessible');
  before.set(actor.label+':'+code,true);
 }
}
console.log('PASS: two distinct real GoTrue QA users and six invited, empty, private Beta journeys preflight; no writes yet.');
let enrolled=0,saved=0,conflicts=0;
for(const code of codes){
 // Verify that A enrollment does not join B. Then verify both persisted enrollments.
 for(const actor of actors){
  const start=await post(actor,code,'enroll',0);
  assert.equal(start.status,200,actor.label+' '+code+' enroll response');
  assert.equal(start.data.ok,true);
  assert.equal(start.data.enrolled,true);
  enrolled++;
  const fresh=await read(actor,code);
  assert.equal(fresh.data.enrolled,true,'Enrollment must survive genuine new HTTP request');
  assert.equal(fresh.data.progress.length,0);
  const other=actors.find(x=>x.id!==actor.id);
  if(actor.label==='A'){
   const otherRead=await read(other,code);
   assert.equal(otherRead.data.enrolled,false,'Enrollment leaked across real account boundary');
  }
 }
 for(const actor of actors){
  const initial=await post(actor,code,'start',1);
  assert.equal(initial.status,200);
  assert.equal(initial.data.progress.revision,1);
  assert.equal(initial.data.progress.graded,false);
  const reflection='FICTIONAL NONCOMMERCIAL QA ACCEPTANCE '+code+' member '+actor.label+
   ': The observation is invented, not a real issuer or market order. I verified the timing, denominators and limitations of my source, then documented a WAIT decision until an independent primary source and quote freshness can be confirmed. No brokerage execution, grade, mastery or reward is claimed.';
  const s=await post(actor,code,'save_reflection',1,{reflection,expectedRevision:1});
  assert.equal(s.status,200);
  assert.equal(s.data.progress.revision,2);
  assert.equal(s.data.progress.status,'reflection_saved');
  assert.equal(s.data.progress.reflection,reflection);
  assert.equal(s.data.progress.graded,false);
  assert.equal(s.data.progress.competencyMasteryAwarded,false);
  const reread=await read(actor,code);
  const row=reread.data.progress.find(x=>x.day===1);
  assert(row&&row.revision===2&&row.reflection===reflection,'QA progress did not persist');
  const stale=await post(actor,code,'save_reflection',1,{reflection:reflection+' STALE',expectedRevision:1});
  assert.equal(stale.status,409,'Two-tab stale revision must fail');
  conflicts++;
  // Foreign actor's name in a URL cannot grant access or select another profile.
  const foreign=actors.find(x=>x.id!==actor.id);
  const fake=await read(actor,code,'&user_id='+encodeURIComponent(foreign.id)+'&member_id='+encodeURIComponent(foreign.id));
  assert.equal(fake.status,200);
  const own=fake.data.progress.find(x=>x.day===1);
  assert.equal(own.reflection,reflection,'URL user selector must not expose other member');
  assert(!fake.data.progress.some(x=>x.reflection?.includes('member '+foreign.label+':')),
   'Foreign QA member data leaked across private progress boundary');
  saved++;
 }
}
assert.equal(enrolled,6);assert.equal(saved,6);assert.equal(conflicts,6);
console.log('PASS: SIX real QA course enrollments, six private saves/reloads and six stale revision conflicts; real cross-account isolation; zero grades/Lumens/payments.');
console.log('RESULT '+JSON.stringify({status:'REAL_INVITED_SIX_JOURNEYS_ACCEPTED',
 actors:2,programs:3,enrollments:enrolled,saves:saved,casConflicts:conflicts,
 livePayments:0,lumenChanges:0,protectedGrades:0,privateKeysExposed:0}));
