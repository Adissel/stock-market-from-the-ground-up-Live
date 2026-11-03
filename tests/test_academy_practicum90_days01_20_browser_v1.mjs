/* Synthetic browser coverage for the ungraded Practicum90 D01-D80 layer. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {academyByCode,ACADEMY_VERSION} from '../functions/_lib/bootcamp-academy-v014168.js';
const origin=(process.env.SITEWIDE_TEST_BASE||'http://127.0.0.1:8765').replace(/\/$/,'');
assert(/^http:\/\/127\.0\.0\.1:\d+$/.test(origin));
const course=academyByCode.practicum90,prompts=new Set();
for(const day of course.curriculum.slice(0,90)){
 assert.equal(day.lesson.formativeQuestions.length,12);assert.equal(day.lesson.advancedPracticums.length,1);
 for(const q of day.lesson.formativeQuestions){assert(!prompts.has(q.id));prompts.add(q.id);}
}
assert.equal(prompts.size,1080);
const auth="window.getSupabaseClient=async()=>({auth:{getUser:async()=>({data:{user:{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'}}}),getSession:async()=>({data:{session:{user:{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'},access_token:'synthetic'}}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})}});";
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const width of [390,768,1440]){
  const ctx=await browser.newContext({viewport:{width,height:960},serviceWorkers:'block',reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{const u=new URL(route.request().url());
   if(u.origin!==origin)return route.abort();
   if(u.pathname==='/assets/js/supabase-client.js')return route.fulfill({status:200,contentType:'application/javascript',body:auth});
   if(['/assets/js/site.js','/assets/js/session-manager.js'].includes(u.pathname))return route.fulfill({status:200,contentType:'application/javascript',body:'/* fixture */'});
   if(u.pathname==='/api/bootcamp-academy'&&route.request().method()==='GET')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,version:ACADEMY_VERSION,program:course,curriculum:course.curriculum,progressAvailable:true,enrolled:false,progress:[]})});
   return route.continue();});
  await page.goto(origin+'/bootcamp-academy.html?program=practicum90',{waitUntil:'domcontentloaded'});
  await page.locator('#academy-workspace:not([hidden])').waitFor({timeout:20000});
  assert.equal(await page.locator('#academy-days .gu-bc-day').count(),90);
  for(let i=0;i<90;i++){
   const control=page.locator('#academy-days .gu-bc-day').nth(i);await control.focus();await page.keyboard.press('Enter');
   await page.waitForFunction(title=>document.getElementById('academy-day-title')?.textContent===title,course.curriculum[i].title,{timeout:15000});
   const guide=page.locator('#academy-legacy-guide');await guide.locator(':scope > summary').click();
   await page.locator('#academy-guided-host .academy-guided-ten').waitFor({state:'visible',timeout:10000});
   assert((await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth))<=5,'Horizontal overflow D'+(i+1));
  }
  assert.deepEqual(errors,[]);console.log('PASS Practicum90 D01-D80 browser at '+width+'px');await ctx.close();
 }
 console.log('PASS Practicum90 D01-D80: 960 prompt identities and 240 responsive keyboard routes; synthetic, not authenticated acceptance.');
}finally{await browser.close();}
