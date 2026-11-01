/* Synthetic responsive-browser acceptance: original Risk60 D11 and D14.
 * No real QA sign-in, fees, scores or Supabase writes.
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {academyByCode,ACADEMY_VERSION} from '../functions/_lib/bootcamp-academy-v014168.js';
const origin=(process.env.SITEWIDE_TEST_BASE||'http://127.0.0.1:8765').replace(/\/$/,'');
assert(/^http:\/\/127\.0\.0\.1:\d+$/.test(origin),'Local fixture only');
const course=academyByCode.risk60;
assert.equal(course.curriculum.length,60);
for(const index of [10,13,14,17,18,19]){
 const d=course.curriculum[index];
 assert.equal(d.lesson.formativeQuestions.length,12);
 assert.equal(d.lesson.advancedPracticums.length,1);
}
const identity=[
 "window.getSupabaseClient=async()=>({auth:{",
 "getUser:async()=>({data:{user:{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'}}}),",
 "getSession:async()=>({data:{session:{user:{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'},access_token:'synthetic'}}}),",
 "onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})",
 "}});"
].join('\n');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const width of [390,768,1440]){
  const ctx=await browser.newContext({viewport:{width,height:930},serviceWorkers:'block',reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin!==origin)return route.abort();
   if(url.pathname==='/assets/js/supabase-client.js')return route.fulfill({status:200,contentType:'application/javascript',body:identity});
   if(['/assets/js/site.js','/assets/js/session-manager.js'].includes(url.pathname))
    return route.fulfill({status:200,contentType:'application/javascript',body:'/* synthetic-only */'});
   if(url.pathname==='/api/bootcamp-academy'&&route.request().method()==='GET')
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
     ok:true,version:ACADEMY_VERSION,program:course,curriculum:course.curriculum,
     enrolled:false,progressAvailable:true,progress:[]})});
   return route.continue();
  });
  await page.goto(origin+'/bootcamp-academy.html?program=risk60',{waitUntil:'domcontentloaded'});
  await page.locator('#academy-workspace:not([hidden])').waitFor({timeout:20000});
  for(const index of [10,13,14,17,18,19]){
   await page.locator('#academy-days .gu-bc-day').nth(index).click();
   const host=page.locator('#academy-guided-host .academy-guided-ten');
   await host.waitFor({state:'visible'});
   assert.match(await host.innerText(),/Suggested active-learning itinerary\s*[—–-]\s*45 minutes\s*\(self-paced\)/,
    'Full-depth original Risk60 days must provide the 45-minute itinerary');
   const sizing=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert(sizing<=4,'No horizontal body overflow at '+width+'px, Risk60 D'+(index+1));
  }
  assert.deepEqual(errors,[],'No browser JS error for Risk60 D11/D14/D15/D18/D19/D20');
  await ctx.close();
 }
 console.log('PASS SYNTHETIC Risk60 D11/D14/D15/D18/D19/D20 advanced guided day routes and responsive mobile/tablet/desktop. Not real Beta member acceptance.');
}finally{await browser.close()}
