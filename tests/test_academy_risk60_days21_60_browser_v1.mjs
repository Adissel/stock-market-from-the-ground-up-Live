/* Original Risk60 days 21–60: responsive, keyboard-accessible member
 * instructional surface. Isolated synthetic browser fixture only: no real
 * member, payment, entitlement change, grading or Supabase persistence.
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {academyByCode,ACADEMY_VERSION} from '../functions/_lib/bootcamp-academy-v014168.js';
const origin=(process.env.SITEWIDE_TEST_BASE||'http://127.0.0.1:8765').replace(/\/$/,'');
assert(/^http:\/\/127\.0\.0\.1:\d+$/.test(origin),'Must use the isolated local fixture');
const course=academyByCode.risk60;
assert.equal(course.days,60);
assert.equal(course.curriculum.length,60);
const advanced=course.curriculum.slice(20);
assert.equal(advanced.length,40);
const prompts=new Set();
for(const lesson of advanced){
 assert.equal(lesson.programCode,'risk60','Program identity must remain Risk60');
 assert.equal(lesson.officiallyGraded,false,'Advanced instruction never awards official grades');
 assert.equal(lesson.lesson.formativeQuestions.length,12,'12 distinct ungraded questions per day');
 assert(lesson.lesson.advancedPracticums.length>=1,'Each day must have an advanced worked case');
 for(const q of lesson.lesson.formativeQuestions){
  assert(typeof q.id==='string'&&!prompts.has(q.id),'Duplicate or missing original question identity');
  prompts.add(q.id);
  assert(q.prompt.length>25&&q.review.length>55,'Question and feedback must be substantial');
 }
 const p=lesson.lesson.advancedPracticums[0];
 for(const field of ['scenario','task','worked','pitfall','transfer'])
  assert(typeof p[field]==='string'&&p[field].length>60,
   'Risk60 day '+lesson.day+' is missing an advanced worked '+field);
}
assert.equal(prompts.size,480,'40 days x 12 distinct instructional prompts');
const authScript="window.getSupabaseClient=async()=>({auth:{getUser:async()=>({data:{user:{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'}}}),getSession:async()=>({data:{session:{user:{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'},access_token:'synthetic'}}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})}});";
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const width of [390,768,1440]){
  const ctx=await browser.newContext({viewport:{width,height:960},serviceWorkers:'block',reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
   const uri=new URL(route.request().url());
   if(uri.origin!==origin)return route.abort();
   if(uri.pathname==='/assets/js/supabase-client.js')
    return route.fulfill({status:200,contentType:'application/javascript',body:authScript});
   if(['/assets/js/site.js','/assets/js/session-manager.js'].includes(uri.pathname))
    return route.fulfill({status:200,contentType:'application/javascript',body:'/* fixture only */'});
   if(uri.pathname==='/api/bootcamp-academy'&&route.request().method()==='GET')
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
     ok:true,version:ACADEMY_VERSION,program:course,curriculum:course.curriculum,
     progressAvailable:true,enrolled:false,progress:[]
    })});
   return route.continue();
  });
  await page.goto(origin+'/bootcamp-academy.html?program=risk60',{waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('#academy-workspace:not([hidden])').waitFor({timeout:20000});
  assert.equal(await page.locator('#academy-days .gu-bc-day').count(),60);
  for(let index=20;index<60;index++){
   const d=course.curriculum[index],control=page.locator('#academy-days .gu-bc-day').nth(index);
   await control.focus();
   await page.keyboard.press('Enter');
   await page.waitForFunction(title=>document.getElementById('academy-day-title')?.textContent===title,
    d.title,{timeout:15000});
   assert.equal(await page.locator('#academy-days .gu-bc-day').nth(index).getAttribute('aria-current'),
    'step','Selected day must expose aria-current Risk60 '+(index+1));
   const guide=page.locator('#academy-legacy-guide');
   await guide.waitFor({state:'attached'});
   assert.equal(await guide.evaluate(el=>el.open),false,
    'Advanced supplemental instruction should start collapsed for day '+(index+1));
   await guide.locator(':scope > summary').click();
   const host=page.locator('#academy-guided-host .academy-guided-ten');
   await host.waitFor({state:'visible',timeout:10000});
   assert.match(await host.innerText(),/Suggested active-learning itinerary\s*[—–-]\s*45 minutes\s*\(self-paced\)/,
    'Full-depth original day must retain 45-minute self-paced instructional itinerary');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
   assert(overflow<=5,'Overflow '+overflow+'px at viewport '+width+', Risk60 day '+(index+1));
  }
  assert.deepEqual(errors,[],'No script errors across Risk60 Days 21–60 at width '+width);
  console.log('PASS: 40 distinct original Risk60 day routes, keyboard navigation, disclosure, source-integrity and responsive width '+width+'px');
  await ctx.close();
 }
 console.log('PASS: 40 original Risk60 days, 480 distinct questions, 120 responsive/keyboard checks. Synthetic only, not genuine authenticated member acceptance.');
}finally{await browser.close()}
