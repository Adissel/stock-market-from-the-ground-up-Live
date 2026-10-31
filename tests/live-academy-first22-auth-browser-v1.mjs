/* SMFGU-ACADEMY-REALBROWSER-22-001
 * Real production member / real Supabase session, 22 original Academy days,
 * READ-ONLY visual navigation. Supabase password grant is genuine, and direct
 * setSession does NOT test the human CAPTCHA/login UI itself.
 * No enrollment, grade, save, purchase, or credential logging.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const QA='f42f9301-18e6-43a3-8531-32d371fd22c1';
const cfg=readFileSync('config.js','utf8');
const supabase=cfg.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const key=cfg.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
const email=process.env.LAB_QA_EMAIL||'',password=process.env.LAB_QA_PASSWORD||'';
if(!supabase||!key||!email||!password)throw Error('BLOCKED: No genuine approved QA Auth credentials');
const fetchJSON=async(url,init={})=>{
 const res=await fetch(url,{...init,cache:'no-store',signal:AbortSignal.timeout(25000)});
 return {status:res.status,data:await res.json().catch(()=>({}))};
};
let browser;
try{
 const signin=await fetchJSON(supabase+'/auth/v1/token?grant_type=password',{
  method:'POST',headers:{apikey:key,'content-type':'application/json'},
  body:JSON.stringify({email,password})
 });
 if(signin.status!==200||!signin.data?.access_token||!signin.data?.refresh_token)
  throw Error('BLOCKED: QA password authentication failed; do not disable CAPTCHA.');
 assert.equal(signin.data.user?.id,QA,'QA identity mismatch');
 const verified=await fetchJSON(supabase+'/auth/v1/user',{
  headers:{apikey:key,authorization:'Bearer '+signin.data.access_token}
 });
 assert.equal(verified.status,200);
 assert.equal(verified.data.id,QA);
 const entitlement=await fetchJSON(origin+'/api/member-tool-access?tool=ONDEMAND_TRAINING',{
  headers:{authorization:'Bearer '+signin.data.access_token}
 });
 assert.equal(entitlement.status,200);
 assert.equal(entitlement.data.authorized,true,'Real member missing temporary authorized training QA entitlement');
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
 const page=await context.newPage();
 const browserErrors=[];
 page.on('pageerror',error=>browserErrors.push(String(error.message||error).slice(0,180)));
 await page.goto(origin+'/bootcamp-academy.html',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForFunction(()=>typeof window.getSupabaseClient==='function',{timeout:30000});
 const identity=await page.evaluate(async args=>{
  const sb=await window.getSupabaseClient();
  const result=await sb.auth.setSession(args.session);
  const actual=await sb.auth.getUser();
  const stored=await sb.auth.getSession();
  return {initialUserMatches:result?.data?.user?.id===args.expected,
   validatedUserMatches:actual?.data?.user?.id===args.expected,
   storedSessionMatches:stored?.data?.session?.user?.id===args.expected,
   code:result?.error?.code||actual?.error?.code||null,
   http:result?.error?.status||actual?.error?.status||0,
   hasUser:!!actual?.data?.user,hasSession:!!stored?.data?.session};
 },{session:{access_token:signin.data.access_token,refresh_token:signin.data.refresh_token},expected:QA});
 assert.equal(identity.code,null,'Browser Supabase session rejected: '+identity.code+' HTTP '+identity.http);
 assert(identity.validatedUserMatches&&identity.storedSessionMatches,
  'Browser genuine session mismatch: user='+identity.validatedUserMatches+
  ' storage='+identity.storedSessionMatches+' hasUser='+identity.hasUser+
  ' hasSession='+identity.hasSession+' initial='+identity.initialUserMatches);
 const counts={truth5:5,watchlist7:7,scanners10:10};
 let examined=0;
 for(const [program,n] of Object.entries(counts)){
  await page.goto(origin+'/bootcamp-academy.html?program='+program,
    {waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>{
   const w=document.getElementById('academy-workspace');
   const day=document.getElementById('academy-day-title');
   return w&&!w.hidden&&day?.textContent?.trim()?.length>5;
  },null,{timeout:30000});
  assert.equal(await page.locator('#academy-days button').count(),n,program+' did not render all days');
  for(let i=0;i<n;i++){
   await page.locator('#academy-days button').nth(i).click();
   const dayTitle=(await page.locator('#academy-day-title').innerText()).trim();
   assert(dayTitle.length>5,program+' Day '+(i+1)+' title missing');
   assert((await page.locator('#academy-objective').innerText()).trim().length>20);
   const lesson=await page.locator('#academy-original-instruction').innerText();
   assert(lesson.length>120,'Missing day-specific source lesson '+program+':'+(i+1));
   assert(!/answer_key|private_rubric|grading_secret/i.test(lesson),
    'Confidential grading data rendered in member lesson');
   const stages=await page.locator('#academy-guided-host .academy-guided-nav button').count();
   assert.equal(stages,10,'Shared ten-stage instructor unavailable '+program+':'+(i+1));
   examined++;
  }
  console.log('PASS genuine authenticated member Academy browser '+program+' — '+n+' day-specific instruction screens and ten-stage instructor.');
 }
 assert.equal(examined,22);
 assert.equal(browserErrors.length,0,'Browser JavaScript runtime errors detected: '+browserErrors.slice(0,3).join('; '));
 console.log('PASS 22/22 real member browser day navigation, original instruction, ten-stage guided engine, no protected keys; zero writes or graded outcomes.');
 console.log('NOT VERIFIED: CAPTCHA UI login, individual graded assessments, mobile/screen reader, historical feed rights, separate-account RLS, and exact-head deployed code.');
}catch(error){
 console.error('BLOCKED_OR_FAILED first22 genuine authenticated browser: '+String(error?.message||error).slice(0,600));
 process.exitCode=1;
}finally{await browser?.close().catch(()=>{})}
