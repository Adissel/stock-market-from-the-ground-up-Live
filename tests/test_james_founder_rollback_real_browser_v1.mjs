/* Real noncommercial QA rollback / paid-benefit isolation test.
 * No paid provider calls, writes, grading, fake account or CAPTCHA bypass.
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const email=process.env.LAB_QA_EMAIL||'',password=process.env.LAB_QA_PASSWORD||'';
assert(email&&password,'BLOCKED: encrypted James_Test QA credentials required');
const uid='f42f9301-18e6-43a3-8531-32d371fd22c1';
const site='https://stock-market-from-the-ground-up-d1r.pages.dev';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
let checks=0;
const pass=(condition,message)=>{assert(condition,message);checks++;console.log('PASS ROLLBACK: '+message)};
try{
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width:1280,height:800}});
 const page=await context.newPage();
 const capt=await page.request.get(site+'/api/auth-guard-v0135');
 assert.equal(capt.status(),200);
 assert.equal((await capt.json()).enabled,false,'BLOCKED: CAPTCHA is enabled; do not bypass');
 await page.goto(site+'/signin.html?next=%2Fdashboard.html',{waitUntil:'domcontentloaded',timeout:30000});
 await page.locator('#login-identifier').fill(email);
 await page.locator('#login-password').fill(password);
 await page.locator('.auth-card button[type="submit"]').click();
 await page.waitForURL(u=>new URL(u).pathname==='/dashboard.html',{timeout:30000});
 const actual=await page.evaluate(async()=>{const c=await window.getSupabaseClient();
  const u=await c.auth.getUser(),s=await c.auth.getSession();
  return {id:u.data?.user?.id,jwt:s.data?.session?.access_token||''}});
 pass(actual.id===uid,'original James_Test account can sign in again after QA rollback');
 const q=await page.evaluate(async()=>{const c=await window.getSupabaseClient();
  const [g,s,f,access]=await Promise.all([
   c.from('user_plan_grants').select('plan_code,status,starts_at,ends_at,source').eq('user_id','f42f9301-18e6-43a3-8531-32d371fd22c1'),
   c.from('site_subscriptions').select('plan_code,status').eq('user_id','f42f9301-18e6-43a3-8531-32d371fd22c1'),
   c.rpc('gu_founder_my_status_v014174'),
   c.rpc('gu_founder_commons_access_v014174',{p_scope:'shared'})
  ]);
  return {errors:[g.error?.message,s.error?.message,f.error?.message,access.error?.message].filter(Boolean),
   grants:g.data,subs:s.data,founder:f.data,sharedCommons:access.data}
 });
 pass(q.errors.length===0,'read-only RLS and owner-bound Founder status RPC are accessible');
 const plans=['FOUNDING_14','FOUNDING_30','FOUNDING_60'],now=Date.now();
 const qa=(q.grants||[]).filter(g=>g.source==='qa_james_founding_sequential_20261031');
 pass(qa.length===3&&qa.every(g=>g.status==='canceled'&&Date.parse(g.ends_at)<=now),
  '14, 30 and 60 temporary QA grants are all cancelled and expired');
 pass(!(q.grants||[]).some(g=>plans.includes(g.plan_code)&&['active','trialing'].includes(g.status)&&
  (!g.starts_at||Date.parse(g.starts_at)<=now)&&(!g.ends_at||Date.parse(g.ends_at)>now)),
  'no effective paid Founding plan grant in original account baseline');
 pass(!(q.subs||[]).some(s=>plans.includes(s.plan_code)&&['active','trialing'].includes(s.status)),
  'no synthetic or paid Founding subscription exists');
 pass(q.founder?.eligible!==true,'commercial Founder membership is not fabricated by QA');
 pass(q.sharedCommons!==true,'Founders Commons shared paid access is not granted by prior noncommercial tests');
 const chart=await page.request.get(site+'/api/chart-tier-access',{headers:{authorization:'Bearer '+actual.jwt}});
 const chartResult=await chart.json();
 pass(chart.status()===200&&chartResult.ok===true,'Chart Studio access re-evaluated under reverted account');
 pass(!/Verified active FOUNDING_(14|30|60) paid term/.test(chartResult.reason||''),
  'chart tier is not falsely attributed to a paid Founding term');
 console.log('ROLLBACK_CHART_SOURCE '+JSON.stringify({tier:chartResult.tier,reason:chartResult.reason}));
 await page.evaluate(async()=>{const c=await window.getSupabaseClient();await c.auth.signOut()});
 await page.goto(site+'/signin.html',{waitUntil:'domcontentloaded'});
 pass(await page.evaluate(async()=>!(await (await window.getSupabaseClient()).auth.getSession()).data?.session),
  'James_Test signed out with no residual auth session');
 console.log('PASS Real James_Test noncommercial Founder rollback: '+checks+' checks; no payments, paid member seats, protected grades or writes');
 await context.close();
}finally{await browser.close()}
