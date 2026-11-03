/* RC13: Two real QA member identities, three beta Academy programs.
 * Six NEW fictional ungraded API reflections. No credentials, grades or payments.
 * This is NOT six 30–45 minute human browser journeys. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHmac,randomUUID} from 'node:crypto';
const begin=Date.now(),origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const config=readFileSync('config.js','utf8');
const url=config.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const key=config.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
assert(url&&key,'BLOCKED: public Supabase config unavailable');
const pwd=process.env.LAB_QA_PASSWORD||'';
const explicitB=!!(process.env.LAB_QA_SECOND_EMAIL&&process.env.LAB_QA_SECOND_PASSWORD);
const members=[
 {label:'QA_A',id:'f42f9301-18e6-43a3-8531-32d371fd22c1',email:process.env.LAB_QA_EMAIL||'',password:pwd},
 {label:'QA_B',id:'bf3d5823-946d-4478-8d0f-cbea33495e5b',
 email:explicitB?process.env.LAB_QA_SECOND_EMAIL:'stockmarketfromthegroundup+smfgu-qa2v1@gmail.com',
 password:explicitB?process.env.LAB_QA_SECOND_PASSWORD:(pwd?createHmac('sha256',pwd).update('smfgu:isolated-second-qa:2026-10-31:v1').digest('hex')+'Qa2!':'')}
];
if(members.some(m=>!m.email||!m.password))throw Error('BLOCKED: existing encrypted QA credentials unavailable');
const courses=['tape10','indicators10','filings7'];
async function req(uri,init={}){
 const r=await fetch(uri,{...init,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(25000)});
 return {status:r.status,body:await r.json().catch(()=>({})),cache:r.headers.get('cache-control')};
}
async function login(m){
 const r=await req(url+'/auth/v1/token?grant_type=password',{method:'POST',
 headers:{apikey:key,'content-type':'application/json'},body:JSON.stringify({email:m.email,password:m.password})});
 assert.equal(r.status,200,'BLOCKED: genuine QA password grant or CAPTCHA failed');
 assert.equal(r.body.user?.id,m.id,'BLOCKED: not designated QA account');
 assert(r.body.access_token&&r.body.refresh_token);
 const u=await req(url+'/auth/v1/user',{headers:{apikey:key,authorization:'Bearer '+r.body.access_token}});
 assert.equal(u.status,200);assert.equal(u.body.id,m.id);
 return {name:m.label,id:m.id,token:r.body.access_token,refresh:r.body.refresh_token,records:[]};
}
const actors=await Promise.all(members.map(login));
assert.notEqual(actors[0].id,actors[1].id);
const headers=(a,post,foreign)=>({authorization:'Bearer '+a.token,
 ...(post?{'content-type':'application/json',origin:foreign?'https://unauthorized.example':origin}:{})});
const get=(a,p,other)=>req(origin+'/api/bootcamp-academy?program='+encodeURIComponent(p)+
 (other?'&user_id='+encodeURIComponent(other):''),{headers:headers(a,false)});
const post=(a,p,foreign=false)=>req(origin+'/api/bootcamp-academy',{
 method:'POST',headers:headers(a,true,foreign),body:JSON.stringify(p)});
function progress(r,p){
 assert.equal(r.status,200,'Member Academy GET blocked');
 assert.equal(r.body.ok,true);assert.equal(r.body.progressAvailable,true);
 assert.equal(r.body.enrolled,true);assert.equal(r.body.program?.code,p);
 assert(Array.isArray(r.body.progress)&&Array.isArray(r.body.curriculum));
 assert.match(r.cache||'',/no-store/);
 return r.body;
}
for(const a of actors){
 const r=await req(origin+'/api/member-tool-access?tool=ONDEMAND_TRAINING',{headers:headers(a,false)});
 assert.equal(r.status,200);assert.equal(r.body.authorized,true,'BLOCKED: valid temporary training grant missing');
 console.log('PASS '+a.name+' genuine signed member and positive expiring training access');
}
const guest=await req(origin+'/api/bootcamp-academy?program=tape10');
assert([401,403,404].includes(guest.status),'Guest beta course denial required');
for(const a of actors){
 const b=actors.find(x=>x.id!==a.id);
 for(const code of courses){
  const initial=progress(await get(a,code),code);
  const day=Array.from({length:initial.curriculum.length},(_,i)=>i+1).reverse()
   .find(n=>!initial.progress.some(x=>x.day===n));
  assert(day,'BLOCKED: no unused QA day; never overwrite prior progress');
  const marker=randomUUID(),info={program:code,day,version:'0.14.0.168'};
  const reflection='FICTIONAL RC13 QA '+a.name+' '+code+' '+marker+
   ' This exercise uses imaginary source evidence and no actual stock transaction. Record only pre-decision observations; separate quote from confirmed fill; preserve uncertainty; state the risk limit and a WAIT or NO TRADE decision before later information arrives.';
  assert(reflection.length>=80&&reflection.length<=2000);
  const start=await post(a,{...info,action:'start'});
  assert.equal(start.status,200);assert.equal(start.body.progress?.revision,1);
  assert.equal(start.body.progress?.graded,false);
  const saved=await post(a,{...info,action:'save_reflection',expectedRevision:1,reflection,user_id:b.id});
  assert.equal(saved.status,200);assert.equal(saved.body.progress?.revision,2);
  assert.equal(saved.body.progress?.reflection,reflection);
  assert.equal(saved.body.progress?.graded,false);
  assert.equal(saved.body.progress?.marketOutcomeClaimed,false);
  assert.equal(saved.body.progress?.competencyMasteryAwarded,false);
  const first=progress(await get(a,code),code);
  assert.equal(first.progress.length,initial.progress.length+1);
  assert.equal(first.progress.find(x=>x.day===day)?.reflection,reflection);
  const stale=await post(a,{...info,action:'save_reflection',expectedRevision:1,reflection:reflection+' STALE'});
  assert.equal(stale.status,409,'Optimistic concurrency must deny stale revision');
  const own=progress(await get(a,code),code);
  assert.equal(own.progress.find(x=>x.day===day)?.reflection,reflection);
  const spoof=progress(await get(a,code,b.id),code);
  assert.deepEqual(spoof.progress,own.progress,'Forged user selector changed signed owner');
  const other=progress(await get(b,code),code);
  assert(!JSON.stringify(other.progress).includes(marker),
   'CRITICAL: separate member exposed this user private reflection');
  a.records.push({code,day,reflection});
  console.log('PASS '+a.name+' '+code+' day '+day+': save/reload, 409, forged selector, isolation, ungraded');
 }
 const foreign=await post(a,{program:'tape10',day:1,action:'start',version:'0.14.0.168'},true);
 assert.equal(foreign.status,403,'Cross-origin mutation should be denied');
}
for(const a of actors){
 const fresh=await req(url+'/auth/v1/token?grant_type=refresh_token',{
 method:'POST',headers:{apikey:key,'content-type':'application/json'},
 body:JSON.stringify({refresh_token:a.refresh})});
 assert.equal(fresh.status,200,'Genuine refresh token exchange required');
 assert.equal(fresh.body.user?.id,a.id);a.token=fresh.body.access_token;
 for(const x of a.records){
  const latest=progress(await get(a,x.code),x.code);
  assert.equal(latest.progress.find(y=>y.day===x.day)?.reflection,x.reflection,
   'Recorded QA private reflection did not survive token refresh');
 }
}
assert.equal(actors.reduce((n,x)=>n+x.records.length,0),6);
console.log('PASS RC13 6/6 real two-account by three-course API study/reflection paths');
console.log('PASS private CAS, actor isolation, foreign/guest denial, genuine token refresh; zero official grading');
console.log('LIMIT: These are API paths, NOT six genuine 30–45 minute browser study journeys.');
console.log('Actual wall-clock seconds, never invented seat-time: '+((Date.now()-begin)/1000).toFixed(1));
