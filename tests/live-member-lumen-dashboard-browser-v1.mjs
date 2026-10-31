/* Genuine signed-in, read-only member Dashboard and wallet browser acceptance.
 * Uses pre-existing LAB_QA secrets. No fake JWT, no payment, no Lumen transfer.
 */
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const cfg=readFileSync('config.js','utf8');
const sburl=cfg.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const key=cfg.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
const email=process.env.LAB_QA_EMAIL,password=process.env.LAB_QA_PASSWORD;
if(!email||!password||!sburl||!key)throw Error('BLOCKED: Real member QA credentials missing');
const response=await fetch(sburl+'/auth/v1/token?grant_type=password',{method:'POST',
 headers:{apikey:key,'content-type':'application/json'},body:JSON.stringify({email,password}),
 signal:AbortSignal.timeout(25000)});
const login=await response.json().catch(()=>({}));
if(!response.ok||!login.access_token||!login.refresh_token)
 throw Error('BLOCKED: Genuine Supabase Auth did not accept existing QA credentials');
assert.equal(login.user?.id,'f42f9301-18e6-43a3-8531-32d371fd22c1');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1360,height:900},serviceWorkers:'block'});
 const page=await context.newPage();
 const protectedWrites=[];
 page.on('request',r=>{
  try{const u=new URL(r.url());if(u.origin===origin&&!['GET','HEAD','OPTIONS'].includes(r.method())&&
   /^\/api\/(member-lumen-gifts|member-sparks|chart-workspace|stripe|checkout)/.test(u.pathname))
   protectedWrites.push(r.method()+' '+u.pathname)}catch{}
 });
 await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>typeof window.getSupabaseClient==='function',null,{timeout:22000});
 const session=await page.evaluate(async tokens=>{
  const sb=await window.getSupabaseClient(),{data,error}=await sb.auth.setSession(tokens);
  return{ok:!error&&!!data?.session?.access_token,id:data?.user?.id};
 },{access_token:login.access_token,refresh_token:login.refresh_token});
 assert.equal(session.id,login.user.id);
 await page.goto(origin+'/dashboard.html?tab=wallet',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>document.querySelector('[data-member-lumen-wallet]')?.textContent?.includes('Lumens available'),null,{timeout:35000});
 const wallet=await page.locator('[data-member-lumen-wallet]').innerText();
 assert.match(wallet,/Crownlight Lumens/);assert.match(wallet,/Included:/);assert.match(wallet,/Purchased:/);
 await page.waitForFunction(()=>!!document.querySelector('[data-member-lumen-history] h3'),null,{timeout:35000});
 assert.match(await page.locator('[data-member-lumen-history]').innerText(),/Recent Lumen wallet activity/);
 await page.waitForFunction(()=>!!document.querySelector('[data-academy-study-progress] h3'),null,{timeout:35000});
 assert.match(await page.locator('[data-academy-study-progress]').innerText(),/Labs and Boot Camps/);
 await page.waitForFunction(()=>!!document.querySelector('.gu-nav-sparks-popup [data-crownlight-quick-progress]'),null,{timeout:30000});
 const menu=page.locator('.gu-nav-sparks-popup');
 assert.match(await menu.innerText(),/Closest study progress/);
 const details=menu.getByRole('link',{name:/How to use.*wallet details/i});
 assert.equal(await details.getAttribute('href'),'/dashboard.html?tab=wallet');
 await page.waitForFunction(()=>!!document.querySelector('[data-member-lumen-gifting]'),null,{timeout:22000});
 const gifting=page.locator('[data-member-lumen-gifting]');
 assert.match(await gifting.innerText(),/Transfers are not yet enabled/);
 assert.equal(await gifting.locator('button[type=submit]').isDisabled(),true);
 const guest=await context.newPage();
 await guest.goto(origin+'/index.html',{waitUntil:'domcontentloaded'});
 const res=await guest.request.get(origin+'/api/member-lumen-activity');
 assert([401,403].includes(res.status()),'Guest private wallet activity must be denied');
 assert.equal(protectedWrites.length,0,'Read-only member dashboard initiated sensitive writes');
 console.log('PASS REAL CHROMIUM James_Test: Dashboard wallet, buckets, private ledger activity, Lab/Boot Camp top-five, navbar details, gifts disabled and anonymous denial.');
 console.log('NO Lumen, payment, workspace or entitlement changes were initiated.');
 await context.close();
}finally{await browser.close()}
