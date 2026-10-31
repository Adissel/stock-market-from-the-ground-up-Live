/* Real invited-member production Academy visibility audit; READ-ONLY teaching API.
 * No enrollment, progress update, grades, member entitlements, payments or rewards.
 * Requires pre-existing LAB_QA_EMAIL/PASSWORD encrypted GitHub secrets.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const email=process.env.LAB_QA_EMAIL||'',password=process.env.LAB_QA_PASSWORD||'';
if(!email||!password)throw Error('BLOCKED: genuine existing invited QA credentials are unavailable');
const c=readFileSync('config.js','utf8');
const url=c.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1],
 anon=c.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
assert(url&&anon,'Public Auth endpoint config missing');
const login=await fetch(url+'/auth/v1/token?grant_type=password',{
 method:'POST',headers:{apikey:anon,'content-type':'application/json'},
 body:JSON.stringify({email,password}),cache:'no-store',signal:AbortSignal.timeout(30000)
});
const data=await login.json().catch(()=>({}));
assert.equal(login.status,200,'Real invited member authentication must succeed');
assert(data.access_token&&data.user?.id,'GoTrue did not issue real member token');
const check=await fetch(url+'/auth/v1/user',{headers:{apikey:anon,authorization:'Bearer '+data.access_token},signal:AbortSignal.timeout(30000)});
const authenticated=await check.json().catch(()=>({}));
assert.equal(check.status,200,'Supabase must independently verify member token');
assert.equal(authenticated.id,data.user.id);
const get=async (path,member=false)=>{
 const res=await fetch(origin+path,{headers:member?{authorization:'Bearer '+data.access_token}:{},cache:'no-store',signal:AbortSignal.timeout(30000)});
 return {status:res.status,body:await res.json().catch(()=>({}))};
};
const catalog=await get('/api/bootcamp-academy?action=catalog');
assert.equal(catalog.status,200);
assert.equal(catalog.body.ok,true);
assert.equal(catalog.body.programs?.length,7);
const codes=['tape10','indicators10','filings7'],counts=[10,10,7];
assert(catalog.body.programs.every(p=>!codes.includes(p.code)),'Invite-only courses leaked into public catalog');
const days=new Set();let formative=0;
for(let i=0;i<codes.length;i++){
 const code=codes[i],unauthorized=await get('/api/bootcamp-academy?program='+code);
 assert([401,403,404].includes(unauthorized.status),'Guest course request unexpected HTTP '+unauthorized.status+' for '+code+'; response fields: '+Object.keys(unauthorized.body||{}).join(','));
 const res=await get('/api/bootcamp-academy?program='+code,true),body=res.body;
 assert.equal(res.status,200,'Invited member denied course '+code);
 assert.equal(body.ok,true);
 assert.equal(body.betaStudy,true,'Only the controlled, nonpublic instructional beta is accepted');
 assert.equal(body.program.code,code);
 assert.equal(body.program.curriculum.length,counts[i]);
 assert.equal(body.curriculum.length,counts[i]);
 assert.equal(body.progressAvailable,true,'Private progress backend unavailable');
 assert.equal(typeof body.enrolled,'boolean');
 for(const day of body.curriculum){
  assert(Number.isInteger(day.day)&&day.day>=1&&day.day<=counts[i]);
  assert(!days.has(code+':'+day.day),'Duplicate study day');days.add(code+':'+day.day);
  assert.equal(day.officiallyGraded,false);
  assert.equal(day.masteryAwarded,false);
  assert(day.lesson?.teach?.length>=60&&day.lesson?.worked?.length>=60,'Original teaching explanation or worked case missing '+code+':'+day.day);
  assert(day.lesson?.formativeQuestions?.length===12,'Day lacks twelve individual formative reviews '+code+':'+day.day);
  formative+=day.lesson.formativeQuestions.length;
 }
 console.log('PASS real invited member GET '+code+' '+counts[i]+' lesson days; private progress available, no enrollment writes');
}
assert.equal(days.size,27);assert.equal(formative,324);
console.log('RESULT '+JSON.stringify({acceptance:'REAL_INVITED_BETA_READ_ONLY_API_PASS',
 actualGoTrueSessions:1,privateDays:27,formativeItems:324,publicPrograms:7,
 guestDenied:true,privateProgressAvailable:true,writeActions:0,gradingAwards:0,
 payments:0,lumenChanges:0,
 notIncluded:['Member-led enrollment and save/reload CAS','True second-member isolation',
 'Keyboard/mobile/screen-reader','Independent rubric acceptance','CAPTCHA form sign-in']}));
