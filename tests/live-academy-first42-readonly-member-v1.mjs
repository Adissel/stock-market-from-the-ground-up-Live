/* SMFGU-ACADEMY-REALMEMBER-42-001
 * Real authenticated QA member, READ ONLY. No progress writes, attempts,
 * account changes, test purchases, grading, certificate or bypass.
 * Existing GitHub QA secrets supply the password. Do not log credentials.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const email=process.env.LAB_QA_EMAIL||'',password=process.env.LAB_QA_PASSWORD||'';
const config=readFileSync('config.js','utf8');
const sb=config.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const pub=config.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
const expectedQA='f42f9301-18e6-43a3-8531-32d371fd22c1';
if(!email||!password||!sb||!pub)throw Error('BLOCKED: Existing authenticated QA secrets or public config unavailable.');
const call=async(url,init={})=>{
 const res=await fetch(url,{...init,cache:'no-store',signal:AbortSignal.timeout(25000)});
 const body=await res.json().catch(()=>({}));
 return {status:res.status,body,cache:res.headers.get('cache-control')||''};
};
const api=(token,path,extra={})=>call(origin+path,{
 ...extra,headers:{authorization:'Bearer '+token,...extra.headers}
});
const plans=[['truth5',5],['watchlist7',7],['scanners10',10],['foundations30',30]];
try{
 const guest=await call(origin+'/api/bootcamp-academy?program=truth5');
 assert([401,403].includes(guest.status),'Anonymous source/progress access must be denied');
 const auth=await call(sb+'/auth/v1/token?grant_type=password',{
  method:'POST',headers:{apikey:pub,'content-type':'application/json'},
  body:JSON.stringify({email,password})
 });
 if(auth.status!==200||!auth.body?.access_token||!auth.body?.refresh_token)
  throw Error('BLOCKED: genuine QA sign-in refused (HTTP '+auth.status+'); no CAPTCHA bypass.');
 const user=await call(sb+'/auth/v1/user',{headers:{apikey:pub,authorization:'Bearer '+auth.body.access_token}});
 assert.equal(user.status,200,'Authenticated Supabase identity missing');
 assert.equal(user.body?.id,expectedQA,'Unexpected member: test must use only approved QA identity');
 const entitlement=await api(auth.body.access_token,'/api/member-tool-access?tool=ONDEMAND_TRAINING');
 assert.equal(entitlement.status,200,'Entitlement API failed');
 if(entitlement.body?.authorized!==true)
  throw Error('BLOCKED: real QA member does not hold ONDEMAND_TRAINING. No entitlement was fabricated.');
 const originals=new Map();
 for(const [code,expectedDays] of plans){
  const res=await api(auth.body.access_token,'/api/bootcamp-academy?program='+code);
  assert.equal(res.status,200,code+' genuine production GET failed');
  assert.equal(res.body?.ok,true);
  assert.equal(res.body?.program?.code,code,'Program mapping mismatch');
  assert(/private/.test(res.cache)&&/no-store/.test(res.cache),'Private member response is cacheable');
  if(code==='foundations30'){
   assert.equal(res.body.existingRoute,'bootcamp.html');
   assert.equal(res.body.program.days,30);
  }else{
   assert.equal(res.body.curriculum?.length,expectedDays,'Wrong canonical day count '+code);
   assert.equal(res.body.progressAvailable,true,'Private progress could not be verified '+code);
   assert(Array.isArray(res.body.progress));
   for(const [i,d] of res.body.curriculum.entries()){
    assert.equal(d.day,i+1);
    assert.equal(d.officiallyGraded,false,'No real official Academy grade may appear');
    assert.equal(d.masteryAwarded,false,'No independent mastery can be forged');
    assert(d.lesson,'Missing actual teaching content');
    assert(!JSON.stringify(d).includes('answer_key'),'Private grade keys leaked in lesson response');
   }
   originals.set(code,{version:res.body.version,
    progress:JSON.stringify(res.body.progress),enrolled:res.body.enrolled});
  }
 }
 // Tampered member selector must not alter server-owned progress visibility.
 const forged=await api(auth.body.access_token,'/api/bootcamp-academy?program=truth5&user_id=00000000-0000-4000-8000-000000000000');
 assert.equal(forged.status,200);
 assert.equal(JSON.stringify(forged.body.progress),originals.get('truth5').progress);
 // An invalid cross-origin write must fail before any persistence.
 const denied=await api(auth.body.access_token,'/api/bootcamp-academy',{
  method:'POST',headers:{origin:'https://untrusted.example','content-type':'application/json'},
  body:JSON.stringify({version:originals.get('truth5').version,program:'truth5',action:'enroll',day:0})
 });
 assert.equal(denied.status,403,'Foreign origin request must be rejected without a write');
 const newSession=await call(sb+'/auth/v1/token?grant_type=refresh_token',{
  method:'POST',headers:{apikey:pub,'content-type':'application/json'},
  body:JSON.stringify({refresh_token:auth.body.refresh_token})
 });
 assert.equal(newSession.status,200,'Cannot verify genuine QA session refresh');
 const freshIdentity=await call(sb+'/auth/v1/user',{
  headers:{apikey:pub,authorization:'Bearer '+newSession.body.access_token}
 });
 assert.equal(freshIdentity.body?.id,expectedQA,'Refresh changed QA identity');
 for(const [code,state] of originals){
  const after=await api(newSession.body.access_token,'/api/bootcamp-academy?program='+code);
  assert.equal(after.status,200);
  assert.equal(JSON.stringify(after.body.progress),state.progress,'Unexpected progress mutation '+code);
  assert.equal(after.body.version,state.version,'Unannounced deployed curriculum revision '+code);
 }
 console.log('PASS production authenticated Academy first-42 READ-ONLY API, owned QA account, four canonical programs, no grades, guest denial, cross-origin 403, forged selector isolation, refreshed member continuity');
 console.log('NOT TESTED: CAPTCHA visual browser login, second-member isolation, new study-save/restore, official protected assessment (unapproved), staff roles, exact production deployment proof.');
}catch(e){
 console.error('BLOCKED_OR_FAILED genuine Academy member acceptance: '+String(e?.message||e).slice(0,400));
 process.exitCode=1;
}
